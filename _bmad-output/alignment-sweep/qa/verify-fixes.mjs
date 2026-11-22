// Verify: phone placeholder zoom (consultations), kundli form star alignment,
// home calculator search placeholder, BookingModal phone (home)
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 3 });

// 1. phone field zoom on /consultations/
const p1 = await ctx.newPage();
await p1.goto("http://127.0.0.1:4321/consultations/", { waitUntil: "networkidle" });
const ph = p1.locator("#bk-phone");
await ph.scrollIntoViewIfNeeded();
await p1.waitForTimeout(200);
await ph.screenshot({ path: "shots/phone-field-after.png" });

// 2. kundli form (required star inline?)
const p2 = await ctx.newPage();
await p2.goto("http://127.0.0.1:4321/kundli/", { waitUntil: "networkidle" });
const f = p2.locator("form[data-k-form]");
await f.scrollIntoViewIfNeeded();
await p2.waitForTimeout(150);
await f.screenshot({ path: "shots/kundli-form-after.png" });

// 3. home: calculators search input + BookingModal phone (open modal via button)
const p3 = await ctx.newPage();
await p3.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const srch = p3.locator('input[aria-label="Search calculators"]');
await srch.scrollIntoViewIfNeeded();
await p3.waitForTimeout(150);
await srch.screenshot({ path: "shots/home-search-after.png" });
console.log("placeholders live:",
  await p1.locator("#bk-phone").getAttribute("placeholder"),
  "|", await srch.getAttribute("placeholder"));
await ctx.close();
await browser.close();
console.log("ok");
