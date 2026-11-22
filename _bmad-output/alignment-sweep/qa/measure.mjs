// Alignment sweep — step 2: precise measurement.
// (a) focus each booking-form field → is any part hidden under the sticky header?
// (b) pairwise bounding-box overlaps among form controls (different cells)
// (c) column geometry: left/right control widths + right edge vs panel padding
// Run: bun measure.mjs
import { chromium } from "playwright-core";

const base = "http://127.0.0.1:4321";
const pages = ["/poojan/", "/consultations/", "/poojan/navagraha-shanti", "/consultations/ananya-dave"];

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});

const MEASURE = () => {
  // read the header in its STUCK state (scroll down first), not scroll-0
  window.scrollTo(0, 400);
  const hb = document.querySelector("header")?.getBoundingClientRect();
  const out = { headerBottom: hb ? hb.bottom : 0, headerSticky: getComputedStyle(document.querySelector("header")).position, focusIssues: [], overlaps: [], geometry: [] };
  window.scrollTo(0, 0);
  const form = document.querySelector("form[data-booking-endpoint]");
  const panel = document.querySelector(".formpanel");
  if (!form || !panel) return out;
  const pb = panel.getBoundingClientRect();
  out.panel = { left: pb.left, right: pb.right, width: pb.width };
  const cs = getComputedStyle(panel);
  out.panelPad = { left: parseFloat(cs.paddingLeft), right: parseFloat(cs.paddingRight) };
  // (a) focus scroll clearance
  const controls = [...form.querySelectorAll("input:not([type=hidden]), select, textarea")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  for (const el of controls) {
    el.scrollIntoView({ block: "start" }); // what a tap/tab does (minus scroll-margin of the FORM root)
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    if (r.top < out.headerBottom - 1) {
      out.focusIssues.push({ id: el.id || el.name, top: Math.round(r.top), headerBottom: Math.round(out.headerBottom), hiddenBy: Math.round(out.headerBottom - r.top) });
    }
  }
  // (b) pairwise overlaps among visible controls (excluding ancestor pairs)
  const vis = [...panel.querySelectorAll("input:not([type=hidden]), select, textarea, button:not([hidden]), .dt-box")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  for (let i = 0; i < vis.length; i++) {
    for (let j = i + 1; j < vis.length; j++) {
      const a = vis[i], b = vis[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 2 && oy > 2) {
        out.overlaps.push({ a: (a.id || a.name || a.className || "btn").slice(0, 40), b: (b.id || b.name || b.className || "btn").slice(0, 40), ox: Math.round(ox), oy: Math.round(oy) });
      }
    }
  }
  // (c) geometry: each control vs its grid cell right edge / panel padding
  for (const el of vis) {
    const r = el.getBoundingClientRect();
    out.geometry.push({ id: (el.id || el.name || el.className || "btn").slice(0, 36), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
  }
  return out;
};

for (const vp of [[1366, 768, "laptop"], [1024, 768, "tab"], [390, 844, "mobile"]]) {
  const ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] } });
  const page = await ctx.newPage();
  for (const url of pages) {
    await page.goto(base + url, { waitUntil: "networkidle" });
    const m = await page.evaluate(MEASURE);
    console.log(`\n=== ${url} @${vp[2]} ===`);
    console.log(`header: ${m.headerSticky} bottom=${Math.round(m.headerBottom)}`);
    if (m.panel) console.log(`panel: x ${m.panel.left}..${m.panel.right} pad L${m.panelPad.left}/R${m.panelPad.right}`);
    for (const f of m.focusIssues) console.log(`  FOCUS-UNDER-HEADER: ${f.id} top=${f.top} vs header=${f.headerBottom} (hidden ${f.hiddenBy}px)`);
    for (const o of m.overlaps) console.log(`  OVERLAP: [${o.a}] × [${o.b}] ox=${o.ox} oy=${o.oy}`);
    if (m.geometry.length) {
      const inner = m.panel ? [m.panel.left + m.panelPad.left, m.panel.right - m.panelPad.right] : [0, 0];
      for (const g of m.geometry) {
        const flag = inner[0] && (g.left < inner[0] - 1 || g.right > inner[1] + 1) ? "  ⚠ outside panel padding" : "";
        console.log(`  ctl ${g.id}  x=${g.left}..${g.right} w=${g.w}${flag}`);
      }
    }
  }
  await ctx.close();
}
await browser.close();
