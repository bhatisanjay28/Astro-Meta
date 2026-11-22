// Alignment sweep — step 1: reproduce the two reported overlaps.
// /poojan/ "Preferred date" + /consultations/ "Topic" reported overlapping
// with "other tab" — shoot every BookingForm surface at 3 viewports × 2 themes.
// Run: bun repro.mjs  (preview server on 127.0.0.1:4321)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const base = "http://127.0.0.1:4321";

const pages = [
  ["/poojan/", "poojan-index"],
  ["/poojan/navagraha-shanti", "poojan-detail"],
  ["/consultations/", "cons-index"],
  ["/consultations/ananya-dave", "cons-detail"],
];
const viewports = [
  [1366, 768, "laptop"],
  [1024, 768, "tab-land"],
  [390, 844, "mobile"],
];
const themes = ["light", "dark"];

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});

for (const [w, h, vp] of viewports) {
  for (const theme of themes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    for (const [url, name] of pages) {
      await page.goto(base + url, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        const root = document.documentElement;
        root.setAttribute("data-theme", t);
        root.classList.toggle("dark", t === "dark");
        try { localStorage.setItem("vy-theme", t); } catch {}
      }, theme);
      await page.waitForTimeout(120);
      const panel = page.locator(".formpanel").first();
      if ((await panel.count()) === 0) {
        console.log(`SKIP ${url} @${vp}/${theme} — no .formpanel`);
        continue;
      }
      await panel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await panel.screenshot({ path: `${OUT}${name}-${vp}-${theme}.png` });
      // also shoot the date field with its calendar OPEN (popup overlap check)
      const trig = page.locator("[data-dt-trigger]").first();
      if ((await trig.count()) > 0) {
        await trig.click();
        await page.waitForTimeout(200);
        await panel.screenshot({ path: `${OUT}${name}-${vp}-${theme}-popup.png` });
        await page.keyboard.press("Escape");
      }
    }
    await ctx.close();
  }
}
console.log("done →", OUT);
await browser.close();
