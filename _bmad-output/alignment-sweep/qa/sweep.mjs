// S20 alignment sweep — generic, repeatable gate (owner: "we keep finding these").
// Runs EVERY representative page template × 3 viewports and detects:
//   A. pairwise bounding-box overlap among leaf controls (label, input, select,
//      textarea, visible buttons, .dt-box) — the Gotra × Preferred-date class
//   B. horizontal page overflow (scrollWidth > clientWidth) — poke-out-right class
//   C. focus-under-header — any focusable scrolled flush under the sticky tabs
// Also drops full-page screenshots (laptop/mobile × light; dark on key pages)
// for the human/agent visual pass.
// Run: bun sweep.mjs   (preview server on 127.0.0.1:4321)
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const base = "http://127.0.0.1:4321";

const PAGES = [
  "/", "/hi/", "/404.html", "/coming-soon/",
  "/about/", "/contact/", "/privacy/", "/terms/", "/refund/", "/disclaimer/",
  "/admin/", "/admin/login/", "/admin/inbox/", "/admin/posts/",
  "/astrology/learn/", "/astrology/learn/the-12-rashis/",
  "/blog/", "/blog/demystifying-manglik-dosha/", "/blog/category/kundli-science/",
  "/calculators/", "/calculators/rashi/", "/calculators/moon-phase/",
  "/calculators/numerology/", "/calculators/lo-shu/", "/calculators/vimshottari-dasha/",
  "/calculators/name-numerology/", "/calculators/flames/", "/calculators/friendship/",
  "/compatibility/", "/compatibility/aries/leo/",
  "/consultations/", "/consultations/ananya-dave/",
  "/gemstones/",
  "/horoscope/", "/horoscope/aries/",
  "/kundli/", "/matching/", "/muhurat/",
  "/panchang/", "/panchang/agra/",
  "/poojan/", "/poojan/navagraha-shanti/",
];
const VIEWPORTS = [[1366, 768, "laptop"], [1024, 768, "tab"], [390, 844, "mobile"]];
const DARK_EXTRA = ["/", "/kundli/", "/matching/", "/calculators/rashi/", "/poojan/", "/consultations/", "/privacy/", "/admin/"];

const PROBE = () => {
  const out = { overlaps: [], hOverflow: null, focusIssues: [], headerBottom: 0 };
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return null;
    return r;
  };
  // A. pairwise overlaps among leaf controls
  const sel = "label, input:not([type=hidden]), select, textarea, button:not([hidden]), .dt-box";
  const els = [...document.querySelectorAll(sel)].filter((el) => !el.closest("[hidden]"));
  const rects = els.map((el) => ({ el, r: vis(el) }));
  const live = rects.filter((x) => x.r);
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const A = live[i], B = live[j];
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
      const oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
      if (ox > 2 && oy > 2) {
        const name = (el) => `${el.tagName.toLowerCase()}#${el.id || el.name || el.className?.toString().slice(0, 30) || ""}`;
        out.overlaps.push({ a: name(A.el), b: name(B.el), ox: Math.round(ox), oy: Math.round(oy) });
      }
    }
  }
  // B. horizontal overflow
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) out.hOverflow = { scrollW: de.scrollWidth, clientW: de.clientWidth };
  // C. focus-under-header (stuck state). Excluded: header-internal controls,
  // the skip-link, and anything ABOVE the header in document order (utility
  // strip — it can never scroll under the header; the page can't scroll far
  // enough), which is decided by doc-y at scroll-0.
  window.scrollTo(0, 400);
  const hd = document.querySelector("header");
  if (hd) out.headerBottom = hd.getBoundingClientRect().bottom;
  const threshold = hd ? hd.getBoundingClientRect().bottom + window.scrollY : 0; // scroll-0 doc-y of header bottom
  const focusables = [...document.querySelectorAll("a[href], button:not([hidden]), input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex='-1'])")].filter((el) => {
    if (el.closest("[hidden]")) return false;
    if (hd && hd.contains(el)) return false;
    if (el.classList.contains("skip-link")) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return false;
    return r.top + window.scrollY > threshold;
  });
  window.scrollTo(0, 0);
  for (const el of focusables) {
    el.scrollIntoView({ block: "start" });
    const r = el.getBoundingClientRect();
    if (out.headerBottom && r.top < out.headerBottom - 1) {
      out.focusIssues.push({ el: `${el.tagName.toLowerCase()}#${el.id || el.className?.toString().slice(0, 24)}`, top: Math.round(r.top) });
    }
  }
  window.scrollTo(0, 0);
  return out;
};

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const findings = [];
let total = 0;

for (const [w, h, vp] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => { try { localStorage.setItem("vyotish.consent.v1", "acknowledged"); } catch {} });
  const page = await ctx.newPage();
  for (const url of PAGES) {
    let probe;
    try {
      await page.goto(base + url, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      await page.goto(base + url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
    }
    try { probe = await page.evaluate(PROBE); } catch (e) { console.log(`SKIP ${url} @${vp}: ${e.message.slice(0, 60)}`); continue; }
    const issues = [];
    for (const o of probe.overlaps) issues.push(`OVERLAP [${o.a}] × [${o.b}] (${o.ox}×${o.oy}px)`);
    if (probe.hOverflow) issues.push(`H-OVERFLOW scrollW=${probe.hOverflow.scrollW} clientW=${probe.hOverflow.clientW}`);
    for (const f of probe.focusIssues.slice(0, 5)) issues.push(`FOCUS-UNDER-HEADER ${f.el} top=${f.top} vs ${Math.round(probe.headerBottom)}`);
    if (probe.focusIssues.length > 5) issues.push(`…+${probe.focusIssues.length - 5} more focus issues`);
    for (const i of issues) { console.log(`[${vp}] ${url} — ${i}`); findings.push({ vp, url, issue: i }); total++; }
    // screenshots: laptop + mobile, light + dark extras
    if (vp === "laptop" || vp === "mobile") {
      await page.evaluate(() => { const r = document.documentElement; r.setAttribute("data-theme", "light"); r.classList.remove("dark"); });
      await page.waitForTimeout(80);
      await page.screenshot({ path: `${OUT}${url === "/" ? "home" : url.replace(/^\/|\/$|\.html$/g, "").replace(/\//g, "_")}-${vp}-light.png`, fullPage: true });
      if (vp === "laptop" && DARK_EXTRA.includes(url)) {
        await page.evaluate(() => { const r = document.documentElement; r.setAttribute("data-theme", "dark"); r.classList.add("dark"); });
        await page.waitForTimeout(80);
        await page.screenshot({ path: `${OUT}${url === "/" ? "home" : url.replace(/^\/|\/$|\.html$/g, "").replace(/\//g, "_")}-${vp}-dark.png`, fullPage: true });
      }
    }
  }
  await ctx.close();
}
writeFileSync(fileURLToPath(new URL("findings.json", import.meta.url)), JSON.stringify(findings, null, 1));
console.log(`\nDONE — ${total} findings across ${PAGES.length} pages × ${VIEWPORTS.length} viewports → findings.json`);
await browser.close();
