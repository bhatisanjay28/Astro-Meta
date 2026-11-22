import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:4321/poojan/", { waitUntil: "networkidle" });
const d = await page.evaluate(() => {
  return [...document.querySelectorAll("a.inline-flex, button.inline-flex")].slice(0, 8).map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName, cls: el.className.slice(0, 60),
      rect: `x=${Math.round(r.left)} y=${Math.round(r.top)} w=${Math.round(r.width)}`,
      pos: cs.position, inHeader: !!document.querySelector("header")?.contains(el),
      aria: el.getAttribute("aria-label"),
    };
  });
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
