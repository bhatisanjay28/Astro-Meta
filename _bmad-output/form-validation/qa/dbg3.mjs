import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage();
page.on("console", (m) => console.log("CONSOLE:", m.type(), m.text().slice(0, 200)));
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.slice(0, 300)));
await page.goto("http://127.0.0.1:4321/consultations", { waitUntil: "networkidle" });
console.log(await page.evaluate(() => {
  const form = document.querySelector("form#book");
  return {
    vyFv: form?.getAttribute("data-vy-fv"),
    summary: form?.querySelector("[data-form-errors]")?.outerHTML.slice(0, 120),
    nameErr: document.getElementById("bk-name-err")?.outerHTML.slice(0, 120),
    submitBtns: [...form.querySelectorAll("button")].map((b) => `${b.getAttribute("type")} ${b.textContent?.trim().slice(0, 20)}`),
  };
}));
await page.evaluate(() => document.querySelector("form#book").requestSubmit());
await page.waitForTimeout(800);
console.log("after submit:", await page.evaluate(() => ({
  summaryHidden: document.querySelector("form#book [data-form-errors]")?.hidden,
  summaryText: document.querySelector("form#book [data-form-errors]")?.textContent,
  result: document.querySelector("[data-booking-result]")?.textContent.slice(0, 80),
})));
await browser.close();
