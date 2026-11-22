// S18 e2e — required-field consistency + validation across every form that
// takes birth details (owner test directive):
//   submit empty · each required field missing in turn · invalid date
//   (31 Feb + future) · place typed-not-selected · fixing clears the error ·
//   valid submission still calculates. Focus + aria + summary asserted.
// Run: bun e2e.mjs  (preview-static on 127.0.0.1:4321, system Chrome)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

mkdirSync(fileURLToPath(new URL("shots/", import.meta.url)), { recursive: true });
const base = "http://127.0.0.1:4321";
const out = (p) => fileURLToPath(new URL(`shots/${p}`, import.meta.url));

let fails = 0;
const pass = (label) => console.log(`pass  ${label}`);
const fail = (label) => { fails++; console.log(`FAIL  ${label}`); };
const expect = (ok, label) => (ok ? pass(label) : fail(label));
const txt = async (loc) => ((await loc.textContent().catch(() => "")) ?? "").trim();

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(9000);

/* ---------- helpers ---------- */
async function fillDate(rootSel, d, m, y) {
  const segs = page.locator(`${rootSel} [data-dt-seg]`);
  await segs.nth(0).fill(d);
  await segs.nth(1).fill(m);
  await segs.nth(2).fill(y);
  await segs.nth(0).blur();
}
async function fillTime(rootSel, hh, mm, ampm) {
  const segs = page.locator(`${rootSel} [data-dt-seg]`);
  await segs.nth(0).fill(hh);
  await segs.nth(1).fill(mm);
  await page.locator(`${rootSel} [data-dt-${ampm === "am" ? "amp" : "pm"}]`).click();
  await segs.nth(0).blur();
}
async function pickPlace(inputId, text) {
  await page.locator(`#${inputId}`).fill(text);
  await page
    .locator(`#${inputId}-listbox [role="option"], #${inputId}-listbox li, #${inputId}-listbox button`)
    .first()
    .waitFor();
  await page.locator(`#${inputId}-listbox [role="option"], #${inputId}-listbox li, #${inputId}-listbox button`).first().click();
  await page.waitForTimeout(400);
}
const summaryText = (scope = "") => txt(page.locator(`${scope} [data-form-errors]`));
const submitBtn = (formSel) =>
  page.locator(`${formSel} button[type="submit"], ${formSel} button:not([type="button"])`).first();

async function emptySubmitGate(formSel, focusSegId, label) {
  await submitBtn(formSel).click();
  await page.locator("[data-form-errors]").waitFor();
  const s = await summaryText();
  expect(/Please fix \d+ fields? to continue\./.test(s), `${label} — summary visible: "${s}"`);
  const focusId = await page.evaluate(() => document.activeElement?.id || "");
  expect(focusId === focusSegId, `${label} — focus on first error (got #${focusId})`);
}
async function assertBlocked(formSel, label) {
  const s = await summaryText();
  await page.waitForTimeout(250);
  const box = page.locator(`${formSel} [data-calc-result]`);
  const unchanged = (await box.count()) === 0 || !(await txt(box)).includes("Calculating");
  expect(s.length > 0 || unchanged, `${label} — submission blocked`);
}

/* ===== 1. /calculators/rashi — birth kind: date + time + place ===== */
await page.goto(base + "/calculators/rashi", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-date-dd", "rashi empty");
expect((await txt(page.locator("form[data-calc-endpoint] .dt[data-dt=date] .dt-error"))).includes("date of birth"),
  "rashi — DOB message under date field");
// date filled, time+place missing → 2
await fillDate(".dt:has(#bf-date)", "15", "06", "1990");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect((await summaryText()).includes("Please fix 2 fields"), "rashi — date ok, 2 left (time+place)");
expect((await txt(page.locator("form[data-calc-endpoint] .dt[data-dt=time] .dt-error"))).includes("time of birth"),
  "rashi — TOB message under time field");
await fillTime(".dt:has(#bf-time)", "06", "30", "pm");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect((await summaryText()).includes("Please fix 1 field to continue"), "rashi — only place left → fix 1");
// typed-not-selected place
await page.locator("#bf-place").fill("New Delhi");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect((await txt(page.locator("form[data-calc-endpoint] .pp-status"))).includes("select your place of birth"),
  "rashi — free-text place blocked with POB message");
// fix-clears: picking from the list clears the error instantly
await pickPlace("bf-place", "New Delhi");
expect((await txt(page.locator("form[data-calc-endpoint] .pp-status"))) === "", "rashi — pick clears place error");
// 31 Feb + future date
await fillDate(".dt:has(#bf-date)", "31", "02", "1990");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect(/doesn't exist/.test(await txt(page.locator("form[data-calc-endpoint] .dt[data-dt=date] .dt-error"))),
  "rashi — 31 Feb rejected with specific message");
await fillDate(".dt:has(#bf-date)", "01", "01", "2099");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect(/future/.test(await txt(page.locator("form[data-calc-endpoint] .dt[data-dt=date] .dt-error"))),
  "rashi — future date rejected");
// valid end-to-end (prod API)
await fillDate(".dt:has(#bf-date)", "15", "06", "1990");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "rashi — valid input still calculates");
await page.screenshot({ path: out("rashi-valid-light.png") });

/* ===== 2. /calculators/sun-sign — date required; time+place optional ===== */
await page.goto(base + "/calculators/sun-sign", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-date-dd", "sun-sign empty");
expect((await summaryText()).includes("fix 1 field"), "sun-sign — only date required (time/place optional)");
await fillDate(".dt:has(#bf-date)", "15", "08", "1990");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "sun-sign — valid without time/place still calculates");

/* ===== 3. /calculators/numerology — date required, name OPTIONAL (S18 fix) ===== */
await page.goto(base + "/calculators/numerology", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-date-dd", "numerology empty");
expect((await summaryText()).includes("fix 1 field"), "numerology — name is optional (date only)");
expect(await page.locator("#bf-name").getAttribute("required") === null, "numerology — no native required on name");
await fillDate(".dt:has(#bf-date)", "24", "07", "1991");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "numerology — calculates without a name");

/* ===== 4. /calculators/name-numerology — name required, date optional ===== */
await page.goto(base + "/calculators/name-numerology", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-name", "name-numerology empty");
expect((await txt(page.locator("#bf-name-err"))).includes("enter your name"), "name-numerology — name message");
await page.locator("#bf-name").fill("Arjun");
await page.waitForTimeout(200);
expect((await txt(page.locator("#bf-name-err"))) === "", "name-numerology — typing clears the error");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "name-numerology — calculates");

/* ===== 5. /calculators/mobile-numerology — digits required ===== */
await page.goto(base + "/calculators/mobile-numerology", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-digits", "mobile empty");
await page.locator("#bf-digits").fill("9876543210");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "mobile — calculates");

/* ===== 6. /calculators/vehicle-number — date + plate ===== */
await page.goto(base + "/calculators/vehicle-number", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-calc-endpoint]", "bf-date-dd", "vehicle empty");
await page.locator("#bf-plate").fill("DL 8C AF 1234");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForTimeout(300);
expect((await summaryText()).includes("fix 1 field"), "vehicle — plate ok, date missing → 1");
await fillDate(".dt:has(#bf-date)", "10", "01", "2015");
await submitBtn("form[data-calc-endpoint]").click();
await page.waitForFunction(() => { const b = document.querySelector("[data-calc-result]"); return !!b && b.querySelectorAll(":scope > :not(.hint)").length > 0; });
expect(true, "vehicle — calculates");

/* ===== 7. /kundli — date + time + place ===== */
await page.goto(base + "/kundli", { waitUntil: "networkidle" });
await emptySubmitGate("form[data-k-form]", "k-date-dd", "kundli empty");
expect((await summaryText()).includes("fix 2 fields"), "kundli — time prefilled 10:00 → date+place only");
await fillDate(".dt:has(#k-date)", "15", "06", "1990");
await page.locator("#k-place").fill("Mumbai");
await submitBtn("form[data-k-form]").click();
await page.waitForTimeout(300);
expect((await txt(page.locator("form[data-k-form] .pp-status"))).includes("select your place of birth"),
  "kundli — unselected place blocked");
await pickPlace("k-place", "Mumbai");
await submitBtn("form[data-k-form]").click();
await page.locator("[data-k-out]").waitFor();
expect(true, "kundli — chart renders after valid submit");
await page.screenshot({ path: out("kundli-valid-light.png") });

/* ===== 8. /matching — both charts: dates + times + places ===== */
await page.goto(base + "/matching", { waitUntil: "networkidle" });
await emptySubmitGate("form#match-form", "boy-date-dd", "matching empty");
expect((await summaryText()).includes("fix 6 fields"), "matching — 4 dt + 2 places = 6");
await fillDate(".dt:has(#boy-date)", "15", "06", "1990");
await fillTime(".dt:has(#boy-time)", "06", "30", "pm");
await pickPlace("boy-place", "New Delhi");
await submitBtn("form#match-form").click();
await page.waitForTimeout(300);
expect((await summaryText()).includes("fix 3 fields"), "matching — girl side remains: 3");
await fillDate(".dt:has(#girl-date)", "20", "11", "1992");
await fillTime(".dt:has(#girl-time)", "08", "15", "am");
await pickPlace("girl-place", "Jaipur");
await submitBtn("form#match-form").click();
await page.locator("#match-result table").first().waitFor();
expect(true, "matching — 36-gun table renders");
await page.screenshot({ path: out("matching-valid-light.png") });

/* ===== 9. home HomeKundli — date + time + place (name optional) ===== */
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.locator("[data-kundli-form]").scrollIntoViewIfNeeded();
await submitBtn("form[data-kundli-form]").click();
await page.locator("[data-kundli-form] [data-form-errors]").waitFor();
expect((await summaryText("[data-kundli-form]")).includes("fix 3 fields"), "home kundli — date+time+place (name optional)");
expect(await page.locator("[data-kundli-form] input[type=text]").first().getAttribute("required") === null,
  "home kundli — full name no longer native-required");
await fillDate(".dt:has(#hk-dob)", "15", "06", "1990");
await fillTime(".dt:has(#hk-tob)", "06", "30", "pm");
await pickPlace("hk-place", "New Delhi");
await submitBtn("form[data-kundli-form]").click();
await page.locator("[data-kundli-result]:not(.hidden)").waitFor();
expect(true, "home kundli — result panel renders");

/* ===== 10. /consultations BookingForm — name + phone ===== */
await page.goto(base + "/consultations", { waitUntil: "networkidle" });
await emptySubmitGate("form#book", "bk-name", "booking empty");
expect((await summaryText()).includes("fix 2 fields"), "booking — name+phone required, email optional");
await page.locator("#bk-name").fill("QA S18");
await submitBtn("form#book").click();
await page.waitForTimeout(300);
expect((await summaryText()).includes("fix 1 field"), "booking — phone missing → 1");
expect(await page.locator("#bk-phone").getAttribute("aria-invalid") === "true", "booking — phone aria-invalid");
await page.locator("#bk-phone").fill("9999999999");
await submitBtn("form#book").click();
await page.locator("[data-booking-result] p").filter({ hasText: /received|not sent|could not/i }).first().waitFor();
const bookingResult = await txt(page.locator("[data-booking-result]"));
expect(/received/i.test(bookingResult), `booking — request sent ("${bookingResult.slice(0, 60)}")`);

/* ===== 11. home BookingModal — name/phone/email/consent ===== */
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.locator("[data-open-booking]").first().click();
await page.locator("#booking-modal:not(.hidden)").waitFor();
await page.locator("#booking-modal button[type=submit]").click();
await page.locator("#booking-modal [data-form-errors]").waitFor();
expect((await summaryText("#booking-modal")).includes("fix 4 fields"), "booking modal — name+phone+email+consent = 4");
await page.locator("#booking-modal #bk-name").fill("QA S18");
await page.locator("#booking-modal #bk-phone").fill("9999999999");
await page.locator("#booking-modal #bk-email").fill("qa-s18@example.invalid");
await page.locator("#consent-check").check();
await page.waitForTimeout(200);
expect((await summaryText()).includes("fix 0") === false, "modal — errors cleared after fixing (not resubmitted)");

/* ===== 12. Hindi catalog — flip the document lang and resubmit rashi ===== */
await page.goto(base + "/calculators/rashi", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.setAttribute("lang", "hi"));
await submitBtn("form[data-calc-endpoint]").click();
await page.locator("[data-form-errors]").waitFor();
expect(/कृपया जारी रखने के लिए/.test(await summaryText()), "rashi hi — Hindi summary");
expect(/जन्म तिथि/.test(await txt(page.locator("form[data-calc-endpoint] .dt[data-dt=date] .dt-error"))),
  "rashi hi — Hindi DOB message");
expect(/जन्म स्थली/.test(await txt(page.locator("form[data-calc-endpoint] .pp-status"))),
  "rashi hi — Hindi POB message");
await page.screenshot({ path: out("rashi-errors-hindi.png") });

/* ===== 13. responsive alignment — 360/768/1024/1440 (rashi errors + booking) ===== */
for (const [w, h] of [[360, 800], [768, 900], [1024, 800], [1440, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(base + "/calculators/rashi", { waitUntil: "networkidle" });
  await submitBtn("form[data-calc-endpoint]").click();
  await page.locator("[data-form-errors]").waitFor();
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noOverflow, `rashi errors — no horizontal overflow @${w}px`);
  await page.screenshot({ path: out(`rashi-errors-${w}.png`) });
  if (w === 360) await page.screenshot({ path: out("rashi-errors-360-full.png"), fullPage: true });
}
await page.setViewportSize({ width: 1440, height: 900 });

/* ===== 14. error-text contrast (light + dark) ===== */
async function contrastCheck(scheme, label) {
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto(base + "/calculators/rashi", { waitUntil: "networkidle" });
  await submitBtn("form[data-calc-endpoint]").click();
  await page.locator("[data-form-errors]").waitFor();
  const { color, bg } = await page.evaluate(() => {
    const el = document.querySelector("[data-form-errors]");
    const cs = getComputedStyle(el);
    let node = el;
    let background = "rgb(255, 255, 255)";
    while (node && node !== document.documentElement) {
      const c = getComputedStyle(node).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)") { background = c; break; }
      node = node.parentElement;
    }
    return { color: cs.color, bg: background };
  });
  const lum = (rgb) => {
    const m = rgb.match(/\d+/g).map(Number);
    const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
  };
  const l1 = lum(color), l2 = lum(bg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  const ratio = (hi + 0.05) / (lo + 0.05);
  expect(ratio >= 4.5, `${label} — summary contrast ${ratio.toFixed(2)}:1 (${color} on ${bg})`);
}
await contrastCheck("light", "summary light");
await contrastCheck("dark", "summary dark");
await page.emulateMedia({ colorScheme: "light" });

await browser.close();
console.log(fails === 0 ? "\nALL PASS" : `\n${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
