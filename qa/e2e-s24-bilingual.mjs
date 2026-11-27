// S24 — site-wide bilingual e2e (owner acceptance matrix).
// Covers: (1) EN→HI switcher lands on the CORRESPONDING page for every major
// route and back again, (2) language sticks across nav/footer/breadcrumb/
// internal links on hi pages, (3) hi pages render Devanagari chrome
// (header/footer/utility) + html lang=hi, (4) blog articles stay EN with no
// fabricated /hi/article links, (5) direct /hi URLs serve 200 + lang=hi +
// correct canonical/hreflang pairs, (6) refresh keeps Hindi, (7) calculator
// + kundli + panchang hi pages carry translated form chrome, (8) desktop +
// mobile layout spot-checks.
// Run: build + `bun run preview` on :4321 first, then
// `bun qa/e2e-s24-bilingual.mjs`
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:4321";
const SHOTS = resolve(__dirname, "../_bmad-output/s24-bilingual-site/shots");
mkdirSync(SHOTS, { recursive: true });

// The switcher anchor(s): UtilityBar/Header expose hreflang alternate links —
// we locate the hi switcher by its hreflang attr (language-agnostic).
async function hiSwitchHref(page) {
  return page.evaluate(() => {
    const link = document.querySelector('link[rel="alternate"][hreflang="hi"]');
    if (link) return new URL(link.getAttribute("href"), location.origin).pathname;
    const a = document.querySelector('a[hreflang="hi"], a[data-lang-switch="hi"], a[aria-label*="Hindi"], a[title*="हिंदी"]');
    return a ? new URL(a.getAttribute("href"), location.origin).pathname : null;
  });
}
async function enSwitchHref(page) {
  return page.evaluate(() => {
    const link = document.querySelector('link[rel="alternate"][hreflang="en"]');
    if (link) return new URL(link.getAttribute("href"), location.origin).pathname;
    return null;
  });
}

let pass = 0;
let fail = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  headless: true,
});

// ---- Group 1: page-level switch EN→HI→EN across every major route ----
const PAIRS = [
  ["/", "/hi/"],
  ["/kundli/", "/hi/kundli/"],
  ["/panchang/", "/hi/panchang/"],
  ["/muhurat/", "/hi/muhurat/"],
  ["/horoscope/", "/hi/horoscope/"],
  ["/matching/", "/hi/matching/"],
  ["/calculators/", "/hi/calculators/"],
  ["/calculators/rashi/", "/hi/calculators/rashi/"],
  ["/compatibility/", "/hi/compatibility/"],
  ["/consultations/", "/hi/consultations/"],
  ["/poojan/", "/hi/poojan/"],
  ["/astrology/", "/hi/astrology/"],
  ["/astrology/learn/", "/hi/astrology/learn/"],
  ["/blog/", "/hi/blog/"],
  ["/about/", "/hi/about/"],
  ["/contact/", "/hi/contact/"],
  ["/privacy/", "/hi/privacy/"],
  ["/terms/", "/hi/terms/"],
  ["/refund/", "/hi/refund/"],
  ["/disclaimer/", "/hi/disclaimer/"],
];

const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await ctx.newPage();
console.log("Group 1 — EN→HI→EN page-level switch");
for (const [enPath, hiPath] of PAIRS) {
  await page.goto(BASE + enPath, { waitUntil: "domcontentloaded" });
  const hiHref = await hiSwitchHref(page);
  check(`${enPath} switcher has hi target`, hiHref === hiPath, `got ${hiHref}`);
  if (hiHref !== hiPath) continue;
  await page.goto(BASE + hiHref, { waitUntil: "domcontentloaded" });
  check(`${hiPath} serves html lang=hi`, (await page.getAttribute("html", "lang")) === "hi");
  const backHref = await enSwitchHref(page);
  check(`${hiPath} switcher back → ${enPath}`, backHref === enPath, `got ${backHref}`);
  // refresh keeps Hindi (static page; lang attr must persist)
  await page.reload({ waitUntil: "domcontentloaded" });
  check(`${hiPath} refresh keeps lang=hi`, (await page.getAttribute("html", "lang")) === "hi");
}
console.log(`  group1: ${pass} pass / ${fail} fail so far`);

// ---- Group 2: language sticks across navigation on hi pages ----
// Leak-scan: on a hi page, any internal link into a twinned route must point
// at its /hi/ counterpart. Deep blog articles are the documented exception —
// they stay EN by policy. Pure anchors (#…) and external links are skipped.
console.log("Group 2 — Hindi stays sticky across menus/links");
const TWINNED_PREFIXES = [
  "/kundli", "/panchang", "/muhurat", "/horoscope", "/matching",
  "/calculators", "/compatibility", "/consultations", "/poojan",
  "/astrology", "/blog/", "/about", "/contact", "/privacy", "/terms",
  "/refund", "/disclaimer", "/gemstones",
];
const SCAN_PAGES = [
  "/hi/",
  "/hi/kundli/",
  "/hi/horoscope/",
  "/hi/panchang/new-delhi/",
  "/hi/muhurat/",
  "/hi/matching/",
  "/hi/calculators/",
  "/hi/compatibility/",
  "/hi/consultations/",
  "/hi/poojan/",
  "/hi/astrology/",
  "/hi/blog/",
  "/hi/about/",
  "/hi/contact/",
];
const g2start = fail;
for (const startPath of SCAN_PAGES) {
  await page.goto(BASE + startPath, { waitUntil: "domcontentloaded" });
  const leaks = await page.evaluate((prefixes) => {
    const out = [];
    for (const a of document.querySelectorAll("a[href]")) {
      // the language switcher's inactive pill LEGITIMATELY points at the
      // counterpart language — excluded via the data-lang-switcher marker
      if (a.closest("[data-lang-switcher]")) continue;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/")) continue; // external / anchor / mailto
      const path = href.split("#")[0];
      if (path === href && href.startsWith("#")) continue; // pure anchor
      // deep blog articles stay EN by policy; the /blog/ hub itself twins
      if (path.startsWith("/blog/") && path !== "/blog/" && path !== "/blog") continue;
      // deep learn articles stay EN by policy (original-language scholarship);
      // the /astrology/ and /astrology/learn/ hubs do have twins
      if (path.startsWith("/astrology/learn/") && path !== "/astrology/learn/" && path !== "/astrology/learn") continue;
      for (const p of prefixes) {
        if ((path + "/").startsWith(p + "/") || path === p) {
          if (!path.startsWith("/hi/") && path !== "/hi") out.push(href);
          break;
        }
      }
    }
    return out.slice(0, 6);
  }, TWINNED_PREFIXES);
  check(`${startPath}: no EN-route leaks in links`, leaks.length === 0, leaks.join(", "));
}
console.log(`  group2: ${fail - g2start} new failures`);

// ---- Group 3: chrome translated on hi pages ----
console.log("Group 3 — Devanagari chrome on hi pages");
const DEVANAGARI = /[\u0900-\u097F]/;
for (const p of ["/hi/", "/hi/kundli/", "/hi/panchang/", "/hi/muhurat/", "/hi/about/"]) {
  await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
  const chromeHi = await page.evaluate(() => {
    const header = document.querySelector("header")?.innerText ?? "";
    const footer = document.querySelector("footer")?.innerText ?? "";
    return { header, footer };
  });
  check(`${p} header has Devanagari`, DEVANAGARI.test(chromeHi.header));
  check(`${p} footer has Devanagari`, DEVANAGARI.test(chromeHi.footer));
  const canonical = await page.getAttribute('link[rel="canonical"]', "href");
  check(`${p} canonical is the hi URL`, canonical === `https://vyotish.com${p}`, `got ${canonical}`);
  const enAlt = await page.getAttribute('head link[rel="alternate"][hreflang="en"]', "href");
  check(`${p} hreflang en points to EN twin`, (enAlt ?? "").startsWith("https://vyotish.com/") && !enAlt.includes("/hi/"), `got ${enAlt}`);
}

// ---- Group 4: blog articles stay EN ----
console.log("Group 4 — blog articles stay original language");
await page.goto(BASE + "/blog/", { waitUntil: "domcontentloaded" });
const firstArticleHref = await page.evaluate(() => {
  const a = document.querySelector('a[href^="/blog/"]:not([href="/blog/"])');
  return a ? a.getAttribute("href") : null;
});
if (!firstArticleHref) {
  check("blog has at least one article link", false);
} else {
  check("no fabricated hi article link on EN hub", !(await page.content()).includes(`href="${BASE}/hi${firstArticleHref}"`));
  await page.goto(BASE + firstArticleHref, { waitUntil: "domcontentloaded" });
  check(`${firstArticleHref} stays EN`, (await page.getAttribute("html", "lang")) === "en");
  const hiArticle = await page.evaluate(() => document.querySelector('link[rel="alternate"][hreflang="hi"]')?.getAttribute("href") ?? null);
  check(`${firstArticleHref} emits NO hi alternate`, hiArticle === null, `got ${hiArticle}`);
  // hi blog hub links EN articles (owner req: /hi/blog hub links the EN articles)
  await page.goto(BASE + "/hi/blog/", { waitUntil: "domcontentloaded" });
  const hiHubArticle = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/blog/"]:not([href="/blog/"])');
    return a ? a.getAttribute("href") : null;
  });
  check("/hi/blog/ hub links the EN article", hiHubArticle === firstArticleHref, `got ${hiHubArticle}`);
}

// ---- Group 5: hi calculator/kundli/panchang form chrome ----
console.log("Group 5 — translated form chrome on dynamic hi pages");
await page.goto(BASE + "/hi/calculators/rashi/", { waitUntil: "domcontentloaded" });
const rashiLabels = await page.evaluate(() => Array.from(document.querySelectorAll("label, button")).map((e) => e.innerText).join(" | "));
check("hi rashi page: तिथि label present", rashiLabels.includes("तिथि"));
check("hi rashi page: no 'Date' EN label", !/\bDate\b/.test(rashiLabels), rashiLabels.slice(0, 120));
await page.goto(BASE + "/hi/kundli/", { waitUntil: "domcontentloaded" });
const kundliText = await page.evaluate(() => document.querySelector("main")?.innerText ?? document.body.innerText);
check("hi kundli page: जन्म तिथि label present", kundliText.includes("जन्म तिथि") || kundliText.includes("जन्म की तिथि"));
check("hi kundli page: Devanagari h1", DEVANAGARI.test((await page.textContent("h1")) ?? ""));
await page.goto(BASE + "/hi/panchang/new-delhi/", { waitUntil: "domcontentloaded" });
const panchangH1 = (await page.textContent("h1")) ?? "";
check("hi panchang city page: Devanagari h1", DEVANAGARI.test(panchangH1), panchangH1);

// ---- Group 6: mobile spot-checks ----
console.log("Group 6 — mobile (390×844) spot checks");
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mctx.newPage();
for (const [p, needle] of [
  ["/hi/", "राशिफल"],
  ["/hi/kundli/", "कुंडली"],
  ["/hi/panchang/", "पंचांग"],
]) {
  await mpage.goto(BASE + p, { waitUntil: "domcontentloaded" });
  const overflow = await mpage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`${p} mobile: no horizontal overflow`, overflow <= 1, `overflow ${overflow}px`);
  const body = await mpage.evaluate(() => document.body.innerText);
  check(`${p} mobile: ${needle} visible`, body.includes(needle));
}
await mpage.screenshot({ path: resolve(SHOTS, "mobile-hi-home.png"), fullPage: false });
await page.screenshot({ path: resolve(SHOTS, "desktop-hi-home.png"), fullPage: false });

await ctx.close();
await mctx.close();
await browser.close();

console.log(`\nS24 bilingual e2e: ${pass} pass, ${fail} fail`);
if (failures.length) {
  console.log("Failures:");
  for (const f of failures) console.log(`  - ${f}`);
}
process.exit(fail === 0 ? 0 : 1);
