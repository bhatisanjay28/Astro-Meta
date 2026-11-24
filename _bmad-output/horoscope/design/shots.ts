// Sally — render horoscope mockups to screenshots (Bun + playwright-core, system Chrome).
import { chromium } from "../../../qa/node_modules/playwright-core/index.mjs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const HERE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const pages = ["mockup-daily", "mockup-weekly", "mockup-monthly", "mockup-yearly"];

const browser = await chromium.launch({ executablePath: CHROME });
for (const vp of [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto("file:///" + HERE + p + ".html", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: HERE + "screens/" + p + "-" + vp.name + ".png", fullPage: true });
    console.log("shot:", p, vp.name);
  }
  await ctx.close();
}
await browser.close();
