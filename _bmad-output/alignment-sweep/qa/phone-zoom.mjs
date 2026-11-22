// Zoom into the phone field placeholder on /consultations/ + audit all placeholders site-wide
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 3 });
await page.goto("http://127.0.0.1:4321/consultations/", { waitUntil: "networkidle" });
const phone = page.locator("#bk-phone");
await phone.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await phone.screenshot({ path: "shots/phone-field-zoom.png" });

// measure placeholder vertical centering within the input
const m = await page.evaluate(() => {
  const el = document.querySelector("#bk-phone");
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  // create a range over the ::placeholder? not possible — measure via canvas proxy:
  // instead report geometry facts
  return {
    inputH: Math.round(r.height),
    padTop: cs.paddingTop, padBottom: cs.paddingBottom,
    lineHeight: cs.lineHeight, fontSize: cs.fontSize,
    boxSizing: cs.boxSizing,
    placeholder: el.getAttribute("placeholder"),
  };
});
console.log(JSON.stringify(m, null, 1));

// audit: every input/select/textarea placeholder on the page
const phs = await page.evaluate(() =>
  [...document.querySelectorAll("input[placeholder], textarea[placeholder]")].map((el) => ({
    id: el.id || el.name, ph: el.getAttribute("placeholder"),
  }))
);
console.log(JSON.stringify(phs, null, 1));
await browser.close();
