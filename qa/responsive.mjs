// Responsive sweep: every page at 360/768/1024 — horizontal overflow + key perf metrics at 1440.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = "http://127.0.0.1:4321";
const distDir = resolve(process.cwd(), "../frontend/dist");
const sitemapUrls = (() => {
  try {
    const xml = readFileSync(resolve(distDir, "sitemap.xml"), "utf8");
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace("https://vyotish.com", ""));
  } catch {
    return [];
  }
})();
const paths = [...new Set([...sitemapUrls, "/404", "/admin/login", "/admin", "/contact", "/blog"])];
const keyPages = ["/", "/kundli", "/matching", "/panchang/new-delhi", "/calculators/rashi", "/blog", "/horoscope", "/contact", "/muhurat"];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const out = { overflow: {}, perf: {}, hindi: null };

// --- responsive overflow sweep ---
for (const vw of [360, 768, 1024]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: 800 } });
  const page = await ctx.newPage();
  const ovf = [];
  for (const p of paths.slice(0, 120)) {
    try {
      await page.goto(BASE + (p || "/"), { waitUntil: "load", timeout: 20000 });
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        const doc = document.documentElement;
        const wide = doc.scrollWidth > doc.clientWidth;
        let culprit = null;
        if (wide) {
          for (const el of document.querySelectorAll("body *")) {
            const b = el.getBoundingClientRect();
            if (b.right > doc.clientWidth + 1 && b.width > 40 && b.width < 3000) {
              culprit = el.tagName + "." + String(el.className).slice(0, 60) + " w=" + Math.round(b.width);
              break;
            }
          }
        }
        return { wide, culprit };
      });
      if (r.wide) ovf.push({ path: p, culprit: r.culprit });
    } catch {}
  }
  out.overflow[vw] = ovf;
  await ctx.close();
}

// --- perf metrics at 1440 ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const p of keyPages) {
    const t0 = Date.now();
    await page.goto(BASE + p, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const res = performance.getEntriesByType("resource");
      const bytes = res.reduce((a, r) => a + (r.transferSize || 0), 0);
      const big = res.slice().sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 3).map((r) => (r.name.split("/").pop() || "").slice(0, 50) + " " + Math.round((r.transferSize || 0) / 1024) + "KB");
      return { domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0), load: Math.round(nav?.loadEventEnd ?? 0), resources: res.length, transferKB: Math.round(bytes / 1024), big, docHeight: document.documentElement.scrollHeight, blockingScripts: [...document.querySelectorAll("script[src]:not([defer]):not([async]):not([type=module])")].length };
    });
    out.perf[p] = { ...m, wallMs: Date.now() - t0 };
  }
  await ctx.close();
}

// --- Hindi page check ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/hi", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(1500);
  out.hindi = await page.evaluate(() => ({
    lang: document.documentElement.getAttribute("lang"),
    title: document.title.slice(0, 70),
    h1: document.querySelector("h1")?.textContent.slice(0, 60) ?? null,
    hasDevanagari: /[\u0900-\u097F]/.test(document.body.textContent),
    boxOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  await ctx.close();
}

writeFileSync("responsive-report.json", JSON.stringify(out, null, 2));
await browser.close();
console.log("overflow:", JSON.stringify(Object.fromEntries(Object.entries(out.overflow).map(([k, v]) => [k, v.length]))));
for (const [vw, list] of Object.entries(out.overflow)) for (const o of list.slice(0, 10)) console.log(`  ${vw}px`, o.path, o.culprit ?? "");
console.log("perf:", JSON.stringify(out.perf, null, 1).slice(0, 1200));
console.log("hindi:", JSON.stringify(out.hindi));
