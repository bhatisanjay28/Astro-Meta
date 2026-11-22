/* one-off probe: find elements wider than the viewport at 360px on rashi with errors shown */
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
await page.goto("http://127.0.0.1:4321/calculators/rashi", { waitUntil: "networkidle" });
await page.locator("form[data-calc-endpoint] button[type=submit]").click();
await page.locator("[data-form-errors]").waitFor();

const report = await page.evaluate(() => {
  const vw = window.innerWidth;
  const docW = document.documentElement.scrollWidth;
  const out = { vw, docW, offenders: [] };
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
      out.offenders.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 80),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
        text: (el.textContent ?? "").trim().slice(0, 50),
      });
    }
  }
  // also report scrollWidth > clientWidth containers (hidden overflow creators)
  out.scrollers = [];
  for (const el of document.querySelectorAll("*")) {
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      out.scrollers.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 60),
        sw: el.scrollWidth,
        cw: el.clientWidth,
      });
    }
  }
  out.scrollers = out.scrollers.slice(0, 15);
  out.offenders = out.offenders.slice(0, 20);
  return out;
});
console.log(JSON.stringify(report, null, 1));
await browser.close();
