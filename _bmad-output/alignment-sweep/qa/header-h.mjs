// Stuck sticky-header height per viewport (for scroll-padding-top choice)
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
for (const [w, h, n] of [[1366, 768, "laptop"], [1280, 720, "laptop-sm"], [1024, 768, "tab"], [768, 1024, "tab-p"], [390, 844, "mobile"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://127.0.0.1:4321/poojan/", { waitUntil: "networkidle" });
  await page.evaluate(() => scrollTo(0, 1500));
  await page.waitForTimeout(150);
  const m = await page.evaluate(() => {
    const hd = document.querySelector("header").getBoundingClientRect();
    const util = document.querySelector("[data-utility-bar], .utility-bar, #utility-bar");
    return { top: Math.round(hd.top), h: Math.round(hd.height), utilH: util ? Math.round(util.getBoundingClientRect().height) : null };
  });
  console.log(`${n}: stuck header top=${m.top} height=${m.h} utilityH=${m.utilH}`);
  await page.close();
}
await browser.close();
