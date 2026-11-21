// QA crawler — visits every sitemap URL on the local preview server, captures
// console errors, page errors, failed network requests, SEO meta, a11y (axe-core).
// Usage: bun qa/crawl.mjs [--limit N] [--only substring]
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:4321";
const args = process.argv.slice(2);
const argOf = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const limit = Number(argOf("--limit") ?? 0);
const only = argOf("--only");

// ---- Build URL list from sitemap + extras ----
const distDir = resolve(__dirname, "../frontend/dist");
const sitemapUrls = (() => {
  try {
    const xml = readFileSync(resolve(distDir, "sitemap.xml"), "utf8");
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
      m[1].replace("https://vyotish.com", ""),
    );
  } catch {
    return [];
  }
})();

const extraPaths = [
  "/", "/404", "/robots.txt", "/sitemap.xml", "/admin", "/admin/login",
  "/no-such-page-404-probe", // deliberate 404 probe
];
const paths = [...new Set([...sitemapUrls.map((u) => u || "/"), ...extraPaths])].filter(
  (p) => (only ? p.includes(only) : true),
);

mkdirSync(resolve(__dirname, "evidence"), { recursive: true });

// ---- Launch ----
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// axe-core source (from node_modules) to inject
const axeSrc = readFileSync(
  resolve(__dirname, "node_modules/axe-core/axe.min.js"),
  "utf8",
).toString();

const results = [];
const allLinks = new Map(); // href -> referring pages

let idx = 0;
for (const path of paths) {
  idx++;
  const url = BASE + path;
  const rec = {
    path,
    status: null,
    title: null,
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
    failedRequests: [],
    h1Count: 0,
    metaDescription: null,
    canonical: null,
    ogTitle: null,
    ogImage: null,
    robotsMeta: null,
    lang: null,
    imgsMissingAlt: 0,
    emptyLinks: 0,
    jsProtocolLinks: [],
    axeViolations: null,
    overflowX: null,
    elapsedMs: 0,
  };
  const onConsole = (msg) => {
    if (msg.type() === "error") rec.consoleErrors.push(msg.text().slice(0, 300));
    if (msg.type() === "warning") rec.consoleWarnings.push(msg.text().slice(0, 200));
  };
  const onPageError = (err) => rec.pageErrors.push(String(err).slice(0, 300));
  const onResponse = (resp) => {
    if (resp.status() >= 400)
      rec.failedRequests.push({
        url: resp.url().replace(BASE, "").slice(0, 200),
        status: resp.status(),
      });
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  const t0 = Date.now();
  try {
    const resp = await page.goto(url, { waitUntil: "load", timeout: 30000 });
    rec.status = resp ? resp.status() : null;
    await page.waitForLoadState("domcontentloaded");
    // give client fetches a moment to fire/complete
    await page.waitForTimeout(1200);

    const audit = await page.evaluate(() => {
      const meta = (sel, attr = "content") =>
        document.querySelector(sel)?.getAttribute(attr) ?? null;
      return {
        title: document.title,
        metaDescription: meta('meta[name="description"]'),
        canonical: meta('link[rel="canonical"]', "href"),
        ogTitle: meta('meta[property="og:title"]'),
        ogImage: meta('meta[property="og:image"]'),
        robotsMeta: meta('meta[name="robots"]'),
        lang: document.documentElement.getAttribute("lang"),
        h1Count: document.querySelectorAll("h1").length,
        imgsMissingAlt: [...document.querySelectorAll("img")]
          .filter((i) => !i.hasAttribute("alt"))
          .map((i) => i.src?.slice(-80)),
        emptyLinks: [...document.querySelectorAll("a")]
          .filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#")
          .length,
        jsProtocolLinks: [...document.querySelectorAll('a[href^="javascript:"]')]
          .map((a) => a.getAttribute("href")?.slice(0, 60)),
        overflowX:
          document.documentElement.scrollWidth > document.documentElement.clientWidth
            ? document.documentElement.scrollWidth
            : null,
        links: [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("javascript:")),
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    Object.assign(rec, {
      title: audit.title,
      metaDescription: audit.metaDescription,
      canonical: audit.canonical,
      ogTitle: audit.ogTitle,
      ogImage: audit.ogImage,
      robotsMeta: audit.robotsMeta,
      lang: audit.lang,
      h1Count: audit.h1Count,
      imgsMissingAlt: audit.imgsMissingAlt.length,
      imgsMissingAltSrcs: audit.imgsMissingAlt,
      emptyLinks: audit.emptyLinks,
      jsProtocolLinks: audit.jsProtocolLinks,
      overflowX: audit.overflowX,
    });
    for (const h of audit.links) {
      try {
        const abs = new URL(h, url);
        if (abs.hostname === "127.0.0.1" || abs.hostname === "localhost") {
          const p = abs.pathname + abs.search;
          if (!allLinks.has(p)) allLinks.set(p, []);
          allLinks.get(p).push(path);
        }
      } catch {}
    }

    // axe-core a11y scan (skip non-HTML like robots.txt/sitemap.xml)
    const isHtml = (await page.content()).includes("<html");
    if (isHtml) {
      try {
        await page.addScriptTag({ content: axeSrc });
        const axe = await page.evaluate(() => {
          const r = window.axe?.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
          });
          return r;
        });
        if (axe) {
          rec.axeViolations = axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            sample: (v.nodes[0]?.html ?? "").slice(0, 120),
          }));
        }
      } catch (e) {
        rec.axeViolations = [{ id: "axe-error", sample: String(e).slice(0, 120) }];
      }
    }
    rec.elapsedMs = Date.now() - t0;
    // evidence screenshot for representative pages (first 40 flagged elsewhere; take full set cheaply)
    if (rec.consoleErrors.length || rec.failedRequests.length || rec.pageErrors.length || path === "/" || path === "/404" || path === "/admin/login" || path === "/kundli") {
      const safe = path.replace(/[^a-z0-9]+/gi, "_").slice(0, 60) || "root";
      try {
        await page.screenshot({
          path: resolve(__dirname, `evidence/${safe}.png`),
          fullPage: rec.pageHeight < 4000,
        });
      } catch {}
    }
  } catch (e) {
    rec.pageErrors.push("NAV-FAIL: " + String(e).slice(0, 300));
    rec.elapsedMs = Date.now() - t0;
  }
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.removeAllListeners("response");
  results.push(rec);
  if (limit && idx >= limit) break;
}

// ---- Follow discovered internal links not already visited (404 detection) ----
const visited = new Set(paths);
const newLinks = [...allLinks.keys()].filter((p) => !visited.has(p) && !p.startsWith("/assets/") && !p.startsWith("/_"));
const linkResults = [];
for (const p of newLinks.slice(0, 200)) {
  try {
    const resp = await page.request.get(BASE + p, { maxRedirects: 0 });
    linkResults.push({ path: p, status: resp.status(), referrers: (allLinks.get(p) || []).slice(0, 3) });
  } catch (e) {
    linkResults.push({ path: p, status: "ERR " + String(e).slice(0, 80), referrers: (allLinks.get(p) || []).slice(0, 3) });
  }
}

writeFileSync(resolve(__dirname, "report.json"), JSON.stringify({ base: BASE, results, linkResults }, null, 2));
await browser.close();

// ---- Console summary ----
const bad = results.filter((r) => r.consoleErrors.length || r.failedRequests.length || r.pageErrors.length || r.status >= 400);
console.log(`Crawled ${results.length} pages + ${linkResults.length} extra links`);
console.log(`Pages with issues: ${bad.length}`);
for (const r of bad) {
  console.log(`\n== ${r.path} [${r.status}]`);
  for (const e of r.pageErrors) console.log("  PAGEERROR:", e);
  for (const e of r.consoleErrors) console.log("  CONSOLE:", e);
  for (const e of r.failedRequests) console.log(`  HTTP ${e.status}: ${e.url}`);
}
const badLinks = linkResults.filter((l) => l.status !== 200);
if (badLinks.length) {
  console.log("\n== Links not returning 200:");
  for (const l of badLinks) console.log(`  ${l.status} ${l.path}  (from: ${l.referrers.join(", ")})`);
}
