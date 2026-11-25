// S16-1 — the shared DateField on EVERY date/time surface (19 instances).
// Black-box e2e through the real UI: segment typing/auto-advance/paste,
// impossible/future/100y messages, hidden-input ISO contract, calendar popup
// (newest-first years, day pick, keyboard), 12h/24h time, required submit
// guard, free presets, the admin datetime + set/rebind seams (injected root),
// form.reset(), panchang seam, axe wcag2aa light+dark, light+dark shots.
// Run: bun qa/e2e-s16-datetime.mjs   (preview server on :4321; dist built;
// backend live — pages fetch the deployed worker API)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.HZ_BASE ?? "http://127.0.0.1:4321";
// "Tomorrow" for the future-birth checks (D-05/D-30) must be computed — a
// hardcoded date rots (the written-on date stopped being future three days
// later and the checks failed against correct product behaviour).
const TOMORROW = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return [String(d.getDate()).padStart(2, "0"), String(d.getMonth() + 1).padStart(2, "0"), String(d.getFullYear())];
})();
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");
const OUT = resolve(__dirname, "../_bmad-output/birth-datetime/qa");
mkdirSync(resolve(OUT, "shots"), { recursive: true });

let failures = 0;
const results = [];
const t = (id, name, ok, detail = "") => {
  results.push({ id, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function open(path) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const gotit = page.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) {
    await gotit.click();
    await page.waitForTimeout(200);
  }
}

// full state of the DateField whose hidden input is #id
async function dtState(id) {
  return page.evaluate((id) => {
    const hidden = document.getElementById(id);
    const root = hidden?.closest("[data-dt]");
    if (!root) return null;
    const seg = (s) => root.querySelector(`[id$="-${s}"]`)?.value ?? "";
    const err = root.querySelector("[data-dt-error]");
    return {
      value: hidden.value,
      dd: seg("dd"), mm: seg("mm"), yy: seg("yy"),
      hh: seg("hh"), mi: seg("mi"),
      invalid: root.getAttribute("data-invalid") === "true",
      error: err?.textContent ?? "",
      errVisible: Boolean(err) && err.offsetParent !== null,
      amPressed: root.querySelector('[data-dt-amp]')?.getAttribute("aria-pressed") === "true",
      pmPressed: root.querySelector('[data-dt-pm]')?.getAttribute("aria-pressed") === "true",
      hasAmpm: Boolean(root.querySelector("[data-dt-amp]")),
      expanded: root.querySelector("[data-dt-trigger]")?.getAttribute("aria-expanded") === "true",
    };
  }, id);
}

const segLoc = (id, s) => page.locator(`[data-dt]:has(#${id}) [id$="-${s}"]`);
const errLoc = (id) => page.locator(`[data-dt]:has(#${id}) [data-dt-error]`);
const triggerLoc = (id) => page.locator(`[data-dt]:has(#${id}) [data-dt-trigger]`);
const popLoc = (id) => page.locator(`[data-dt]:has(#${id}) [data-dt-pop]`);

async function typeDate(id, dd, mm, yyyy) {
  await segLoc(id, "dd").click();
  await segLoc(id, "dd").pressSequentially(dd, { delay: 25 });
  await segLoc(id, "mm").pressSequentially(mm, { delay: 25 });
  await segLoc(id, "yy").pressSequentially(yyyy, { delay: 25 });
}

async function typeTime(id, hh, mi) {
  await segLoc(id, "hh").click();
  await segLoc(id, "hh").pressSequentially(hh, { delay: 25 });
  await segLoc(id, "mi").pressSequentially(mi, { delay: 25 });
}

async function shot(page_, name) {
  await page_.screenshot({ path: resolve(OUT, "shots", name + ".png"), fullPage: false });
}

// ═══ /kundli — reference birth surface (FormData + prefill 10:00) ════════════
await open("/kundli");

// prefill contract: 10:00 rendered with AM pressed
let st = await dtState("k-time");
t("D-01", "kundli time prefill 10:00 → segments + AM + hidden", st.value === "10:00" && st.hh === "10" && st.mi === "00" && st.amPressed, JSON.stringify(st));

// typing flow with auto-advance + auto-pad
await typeDate("k-date", "15", "8", "1990");
st = await dtState("k-date");
t("D-02", "type 15/8/1990 → auto-pad 08, hidden ISO 1990-08-15", st.value === "1990-08-15" && st.dd === "15" && st.mm === "08" && st.yy === "1990", JSON.stringify(st));

// impossible date message + hidden emptied
await typeDate("k-date", "31", "02", "1990");
st = await dtState("k-date");
t("D-03", "31 Feb 1990 → impossible message, hidden empty, invalid flag",
  st.value === "" && st.invalid && st.error.includes("31 February 1990 doesn't exist — February 1990 has 28 days."), st.error);

// fixing the day clears the message
await segLoc("k-date", "dd").click();
await segLoc("k-date", "dd").pressSequentially("28", { delay: 25 });
st = await dtState("k-date");
t("D-04", "fix to 28 Feb 1990 → message cleared, hidden ISO", st.value === "1990-02-28" && !st.invalid && st.error === "");

// future + 100-year window (birth preset)
await typeDate("k-date", TOMORROW[0], TOMORROW[1], TOMORROW[2]);
st = await dtState("k-date");
t("D-05", "tomorrow rejected in birth preset", st.value === "" && st.invalid && st.error.includes("can't be in the future"), st.error);
await typeDate("k-date", "1", "1", "1900");
st = await dtState("k-date");
t("D-06", "year older than 100 rejected", st.value === "" && st.invalid && st.error.includes("last 100 years"), st.error);

// paste distribution
await typeDate("k-date", "25", "12", "1995"); // reset to a valid base first
await segLoc("k-date", "dd").click();
await page.evaluate(() => {
  const seg = document.querySelector('[data-dt]:has(#k-date) [id$="-dd"]');
  const dt = new DataTransfer();
  dt.setData("text/plain", "25-12-1995");
  seg.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
});
st = await dtState("k-date");
t("D-07", 'paste "25-12-1995" distributes across segments', st.value === "1995-12-25" && st.dd === "25" && st.mm === "12" && st.yy === "1995", JSON.stringify(st));

// time: typing + PM toggle + a/p key
await typeTime("k-time", "11", "30");
st = await dtState("k-time");
t("D-08", "time 11:30 AM unset → hidden 11:30", st.value === "11:30" && st.hh === "11" && st.mi === "30", JSON.stringify(st));
await page.locator('[data-dt]:has(#k-time) [data-dt-pm]').click();
st = await dtState("k-time");
t("D-09", "PM click → hidden 23:30", st.value === "23:30" && st.pmPressed, JSON.stringify(st));
await segLoc("k-time", "hh").click();
await page.keyboard.press("a");
st = await dtState("k-time");
t("D-10", '"a" key sets AM → hidden 11:30', st.value === "11:30" && st.amPressed && !st.pmPressed, JSON.stringify(st));

// hour bound message
await typeTime("k-time", "13", "00");
st = await dtState("k-time");
t("D-11", "13:00 in 12h → hour message, hidden empty", st.value === "" && st.invalid && st.error.includes("Hour must be 1–12"), st.error);

// calendar popup: year order + day pick + aria state
// clear the date first so the popup opens on today's view (deterministic)
await page.locator('[data-dt]:has(#k-date) [data-dt-clear]').click();
await triggerLoc("k-date").click();
let pop = await page.evaluate(() => {
  const root = document.querySelector('[data-dt]:has(#k-date)');
  const pop = root.querySelector("[data-dt-pop]");
  const yearSel = root.querySelector("[data-dt-year]");
  const months = Array.from(root.querySelector("[data-dt-month]").options).filter((o) => o.disabled).length;
  const years = Array.from(yearSel.options).map((o) => Number(o.value));
  return {
    visible: !pop.hidden,
    expanded: root.querySelector("[data-dt-trigger]").getAttribute("aria-expanded") === "true",
    yearCount: years.length,
    firstYear: years[0], lastYear: years[years.length - 1],
    newestFirst: years.every((y, i) => i === 0 || years[i - 1] > y),
    disabledMonths: months,
    focusedDay: document.activeElement?.classList?.contains("dt-day"),
    todayMarked: Boolean(root.querySelector('[data-dt-grid] [aria-current="date"]')),
  };
});
t("D-12", "popup opens (dialog + focus + today marked)", pop.visible && pop.expanded && pop.focusedDay && pop.todayMarked, JSON.stringify(pop));
t("D-13", "birth years newest-first: 2026…1926 (101)", pop.yearCount === 101 && pop.firstYear === 2026 && pop.lastYear === 1926 && pop.newestFirst, JSON.stringify(pop));
t("D-14", "future months disabled in Nov 2026 view", pop.disabledMonths === 1, String(pop.disabledMonths));
await shot(page, "kundli-popup-light");
// navigate to August 1990 via the dropdowns, pick the 15th
await page.locator('[data-dt]:has(#k-date) [data-dt-month]').selectOption("7");
await page.locator('[data-dt]:has(#k-date) [data-dt-year]').selectOption("1990");
await page.locator('[data-dt]:has(#k-date) [data-dt-grid] [aria-label="15 August 1990"]').click();
st = await dtState("k-date");
pop = await page.evaluate(() => {
  const root = document.querySelector('[data-dt]:has(#k-date)');
  return {
    hidden: root.querySelector("[data-dt-pop]").hidden,
    expanded: root.querySelector("[data-dt-trigger]").getAttribute("aria-expanded"),
    focusBack: document.activeElement === root.querySelector("[data-dt-trigger]"),
  };
});
t("D-15", "day pick fills segments + hidden + closes + focus returns",
  st.value === "1990-08-15" && st.dd === "15" && st.mm === "08" && st.yy === "1990" && pop.hidden && pop.expanded === "false" && pop.focusBack, JSON.stringify({ st, pop }));

// popup keyboard: arrows move, Enter picks, Esc closes
await triggerLoc("k-date").click();
await page.locator('[data-dt]:has(#k-date) [data-dt-month]').selectOption("7");
await page.locator('[data-dt]:has(#k-date) [data-dt-year]').selectOption("1990");
const dayBtns = page.locator('[data-dt]:has(#k-date) [data-dt-grid] .dt-day:not(:disabled)');
await dayBtns.first().focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
st = await dtState("k-date");
t("D-16", "popup keyboard: arrows + Enter picks focused day", st.value === "1990-08-09", st.value);
await triggerLoc("k-date").click();
await page.keyboard.press("Escape");
pop = await page.evaluate(() => {
  const root = document.querySelector('[data-dt]:has(#k-date)');
  return {
    hidden: root.querySelector("[data-dt-pop]").hidden,
    focusBack: document.activeElement === root.querySelector("[data-dt-trigger]"),
  };
});
t("D-17", "Esc closes popup and refocuses the trigger", pop.hidden && pop.focusBack);

// clear button per box
await page.locator('[data-dt]:has(#k-date) [data-dt-clear]').first().click();
st = await dtState("k-date");
t("D-18", "clear empties segments + hidden", st.value === "" && st.dd === "" && st.yy === "");

// required submit guard blocks the page's own handler
await page.evaluate(() => {
  window.__pageSubmitRan = false;
  document.addEventListener("submit", () => { window.__pageSubmitRan = true; }, false);
});
await page.locator('[data-k-form] button[type="submit"]').click();
st = await dtState("k-date");
const ran1 = await page.evaluate(() => window.__pageSubmitRan);
t("D-19", "required-empty submit blocked before page handler; focus on DD",
  !ran1 && st.invalid && st.error.includes("Please enter your date of birth") && await segLoc("k-date", "dd").evaluate((el) => el === document.activeElement),
  `ran=${ran1} err=${st.error}`);

// valid payload keeps ISO (intercept the POST)
let kundliBody = null;
await page.route("**/api/v1/kundli", async (route) => {
  kundliBody = route.request().postDataJSON();
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { lagna: { sign: "Aries", signIndex: 0 }, grahas: [], dasha: { mahadashas: [] } } }) });
});
await typeDate("k-date", "15", "08", "1990");
await typeTime("k-time", "10", "30");
// pick the place through the real PlaceField
const kPlace = page.locator("#k-place");
await kPlace.click();
await kPlace.fill("New Del");
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
await page.locator('[data-place-list]:not([hidden]) [role="option"]').first().click();
await page.waitForTimeout(400);
await page.locator('[data-k-form] button[type="submit"]').click();
await page.waitForTimeout(900);
t("D-20", "submit payload: date ISO + 24h time intact",
  kundliBody?.date === "1990-08-15" && kundliBody?.time === "10:30", JSON.stringify(kundliBody));

// ═══ home — HomeKundli + BookingModal ════════════════════════════════════════
await open("/");
await typeDate("hk-dob", "07", "04", "1985");
let v = await page.evaluate(() => document.querySelector("[data-dob]")?.value);
t("D-21", "HomeKundli [data-dob] hidden carries ISO", v === "1985-04-07", v);
await typeTime("hk-tob", "6", "45");
// S18 rule pin: an hour12 time WITHOUT a meridiem never composes — assuming
// AM silently turned 10:30 PM into 10:30 AM, so empty is the intended state
let vNoM = await page.evaluate(() => document.querySelector("[data-tob]")?.value);
t("D-22a", "hour12 time without AM/PM stays empty (no silent AM — S18)",
  vNoM === "" && (await dtState("hk-tob")).amPressed === false && (await dtState("hk-tob")).pmPressed === false,
  `v=${vNoM}`);
await page.locator('[data-dt]:has(#hk-tob) [data-dt-amp]').click();
v = await page.evaluate(() => document.querySelector("[data-tob]")?.value);
t("D-22", "HomeKundli [data-tob] hidden carries 24h (AM picked)", v === "06:45", v);
// BookingModal field works inside the modal
await page.locator("[data-open-booking]").first().click();
await page.waitForTimeout(300);
await typeDate("bk-date", "20", "3", "2027");
st = await dtState("bk-date");
t("D-23", "BookingModal #bk-date free preset accepts future", st.value === "2027-03-20", JSON.stringify(st));
await triggerLoc("bk-date").click();
const modalYear = await page.evaluate(() => document.querySelector('[data-dt]:has(#bk-date) [data-dt-year]')?.options?.[0]?.value);
t("D-24", "modal popup year dropdown populated (free preset newest first)", modalYear === "2100", String(modalYear));
await page.keyboard.press("Escape"); // close popup
await page.keyboard.press("Escape"); // close modal
await shot(page, "home-modal-light");

// ═══ /matching — two persons × (date + optional time) ════════════════════════
await open("/matching");
await typeDate("boy-date", "12", "06", "1992");
await typeDate("girl-date", "03", "09", "1994");
const boy = await page.evaluate(() => document.getElementById("boy-date")?.value);
const girl = await page.evaluate(() => document.getElementById("girl-date")?.value);
t("D-25", "matching hidden ids keep the page contract", boy === "1992-06-12" && girl === "1994-09-03", `${boy}/${girl}`);
// optional time partially typed → submit blocked with the clear-it message
await segLoc("boy-time", "hh").click();
await segLoc("boy-time", "hh").pressSequentially("1", { delay: 25 });
await page.evaluate(() => {
  window.__pageSubmitRan = false;
  document.addEventListener("submit", () => { window.__pageSubmitRan = true; }, false);
});
await page.locator('#match-form button[type="submit"]').click();
st = await dtState("boy-time");
const ran2 = await page.evaluate(() => window.__pageSubmitRan);
t("D-26", "partially-typed optional time blocks submit", !ran2 && st.invalid && st.error.includes("complete the time"), `ran=${ran2} err=${st.error}`);
await shot(page, "matching-light");

// ═══ /calculators/rashi — BirthForm (birth kind) ═════════════════════════════
await open("/calculators/rashi");
await typeDate("bf-date", "10", "10", "1990");
await typeTime("bf-time", "14", "20");
const bfDate = await page.evaluate(() => document.querySelector('[data-calc-endpoint] #bf-date')?.value);
t("D-27", "BirthForm bf-date hidden ISO (FormData contract)", bfDate === "1990-10-10", bfDate);

// ═══ /calculators/sun-sign — inline date-place + time-guard seam ═════════════
await open("/calculators/sun-sign");
await typeDate("bf-date", "05", "05", "1995");
await typeTime("bf-time", "9", "15");
// per-part state: hh+mi without meridiem must NOT compose (S18, no silent AM)
const timeNoM = await page.evaluate(() => document.querySelector('[data-calc-endpoint] [name="time"]')?.value);
t("D-28a", "tool time without AM/PM stays empty (no silent AM — S18)", timeNoM === "", timeNoM);
await page.locator('[data-dt]:has(#bf-time) [data-dt-amp]').click();
const timeVal = await page.evaluate(() => document.querySelector('[data-calc-endpoint] [name="time"]')?.value);
t("D-28", "[tool] time guard reads hidden [name=time] .value (AM picked)", timeVal === "09:15", timeVal);
await page.locator('form[data-calc-endpoint] button[type="submit"]').click();
await page.waitForTimeout(300);
const placeStatus = await page.evaluate(() => document.querySelector("[data-place-status]")?.textContent ?? "");
t("D-29", "time-without-place guard still fires (hidden value drives it)", placeStatus.includes("Add your place of birth"), placeStatus);

// ═══ /calculators/age — inline birth date + free extra ═══════════════════════
await open("/calculators/age");
await typeDate("bf-date", TOMORROW[0], TOMORROW[1], TOMORROW[2]);
st = await dtState("bf-date");
t("D-30", "age tool date is birth preset (future rejected)", st.invalid && st.error.includes("can't be in the future"), st.error);
await typeDate("bf-date", "01", "01", "2000");
await typeDate("bf-now", "01", "06", "2030");
st = await dtState("bf-now");
t("D-31", "age 'now' extra is free preset (future accepted)", st.value === "2030-06-01", JSON.stringify(st));
let ageUrl = null;
await page.route("**/api/v1/calculators/age**", async (route) => {
  ageUrl = route.request().url();
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: {} }) });
});
await page.locator('form[data-calc-endpoint] button[type="submit"]').click();
await page.waitForTimeout(700);
const u = ageUrl ? new URL(ageUrl) : null;
t("D-32", "age submit qs: date + now ISO", u?.searchParams.get("date") === "2000-01-01" && u?.searchParams.get("now") === "2030-06-01", ageUrl);

// ═══ /calculators/moon-phase — free date + 24-hour UTC time ══════════════════
await open("/calculators/moon-phase");
st = await dtState("bf-time");
t("D-33", "moon-phase UTC time: no AM/PM buttons", !st.hasAmpm, JSON.stringify(st));
await typeDate("bf-date", "20", "07", "1969");
await typeTime("bf-time", "18", "30");
st = await dtState("bf-time");
t("D-34", "24h time typed → hidden 18:30", st.value === "18:30" && st.hh === "18", JSON.stringify(st));
let mpUrl = null;
await page.route("**/api/v1/calculators/moon-phase**", async (route) => {
  mpUrl = route.request().url();
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: {} }) });
});
await page.locator('form[data-calc-endpoint] button[type="submit"]').click();
await page.waitForTimeout(700);
const mu = mpUrl ? new URL(mpUrl) : null;
t("D-35", "moon-phase qs: date ISO + UTC time", mu?.searchParams.get("date") === "1969-07-20" && mu?.searchParams.get("time") === "18:30", mpUrl);
await triggerLoc("bf-date").click();
const mpYears = await page.evaluate(() => {
  const opts = Array.from(document.querySelector('[data-dt]:has(#bf-date) [data-dt-year]').options).map((o) => Number(o.value));
  return { first: opts[0], last: opts[opts.length - 1], count: opts.length };
});
t("D-36", "free preset years 2100…1900 (201)", mpYears.first === 2100 && mpYears.last === 1900 && mpYears.count === 201, JSON.stringify(mpYears));
await page.keyboard.press("Escape");
await shot(page, "moonphase-light");

// ═══ /panchang/mumbai — programmatic seam (init + quick buttons) ═════════════
await open("/panchang/mumbai");
st = await dtState("pd-date");
const todayIso = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
t("D-37", "panchang date prefill (init seam): hidden + segments = today",
  st.value === todayIso && st.dd === todayIso.slice(8, 10) && st.mm === todayIso.slice(5, 7) && st.yy === todayIso.slice(0, 4), JSON.stringify({ st, todayIso }));
const tomorrowIso = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString("en-CA"); })();
await page.locator('[data-pd-quick="tomorrow"]').click();
await page.waitForTimeout(500);
st = await dtState("pd-date");
t("D-38", "Tomorrow button updates hidden + segments (seam)",
  st.value === tomorrowIso && st.dd === tomorrowIso.slice(8, 10) && page.url().includes("date=" + tomorrowIso), JSON.stringify({ st, url: page.url() }));
// user pick via the popup fires change → URL + load
await triggerLoc("pd-date").click();
await page.locator('[data-dt]:has(#pd-date) [data-dt-grid] .dt-day:not(:disabled)').first().click();
await page.waitForTimeout(500);
st = await dtState("pd-date");
t("D-39", "popup pick on panchang updates ?date= via change dispatch", page.url().includes("date=" + st.value) && st.value !== "", JSON.stringify({ st, url: page.url() }));

// ═══ /muhurat — required range ═══════════════════════════════════════════════
await open("/muhurat");
await page.evaluate(() => {
  window.__pageSubmitRan = false;
  document.addEventListener("submit", () => { window.__pageSubmitRan = true; }, false);
});
await page.locator('[data-mf-form] button[type="submit"]').click();
st = await dtState("mf-from");
const ran3 = await page.evaluate(() => window.__pageSubmitRan);
t("D-40", "muhurat empty range blocked by guard (from focused)",
  !ran3 && st.invalid && st.error.includes("complete date"), `ran=${ran3} err=${st.error}`);
await typeDate("mf-from", "01", "12", "2026");
await typeDate("mf-to", "31", "12", "2026");
let mfRan = null;
await page.evaluate(() => {
  window.__pageSubmitRan = false;
});
await page.locator('[data-mf-form] button[type="submit"]').click();
await page.waitForTimeout(600);
mfRan = await page.evaluate(() => window.__pageSubmitRan);
// S18: the shared validation gate owns submit blocking (capture +
// stopPropagation) — an empty city is caught by the GATE with the finder's
// own context wording, and the page's fetch handler must not run
const mfCityStatus = await page.evaluate(() =>
  document.querySelector('[data-mf-form] [data-place-status]')?.textContent ?? "");
t("D-41", "valid range, empty city → gate blocks (city wording, handler suppressed)",
  !mfRan && mfCityStatus.includes("select the city"), `ran=${mfRan} status=${mfCityStatus}`);

// ═══ datetime mode + set/rebind seams (injected root, admin pattern) ═════════
await open("/kundli");
const injected = await page.evaluate(() => {
  const wrap = document.createElement("div");
  wrap.id = "dt-inject";
  wrap.innerHTML = `
  <div class="dt" data-dt="datetime" data-dt-preset="free" data-hour12="true">
    <label class="dt-label" for="publish_at-d-dd">Publish at</label>
    <div class="dt-box" data-dt-box="date">
      <input class="dt-seg" id="publish_at-d-dd" data-dt-seg type="text" inputmode="numeric" maxlength="2" placeholder="DD" aria-label="Day" autocomplete="off" />
      <span class="dt-sep">/</span>
      <input class="dt-seg" id="publish_at-d-mm" data-dt-seg type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="Month" autocomplete="off" />
      <span class="dt-sep">/</span>
      <input class="dt-seg dt-seg-year" id="publish_at-d-yy" type="text" inputmode="numeric" maxlength="4" placeholder="YYYY" aria-label="Year" autocomplete="off" />
      <button type="button" class="dt-clear" data-dt-clear hidden aria-label="Clear"></button>
      <button type="button" class="dt-trigger" data-dt-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="publish_at-pop"></button>
      <div class="dt-pop" id="publish_at-pop" data-dt-pop role="dialog" aria-label="Choose a date" hidden>
        <div class="dt-pop-head">
          <button type="button" class="dt-nav" data-dt-prev aria-label="Previous month"></button>
          <select class="dt-sel" data-dt-month aria-label="Month"><option value="0">January</option><option value="1">February</option><option value="2">March</option><option value="3">April</option><option value="4">May</option><option value="5">June</option><option value="6">July</option><option value="7">August</option><option value="8">September</option><option value="9">October</option><option value="10">November</option><option value="11">December</option></select>
          <select class="dt-sel dt-sel-year" data-dt-year aria-label="Year"></select>
          <button type="button" class="dt-nav" data-dt-next aria-label="Next month"></button>
        </div>
        <div class="dt-grid" data-dt-grid role="group" aria-label="Days"></div>
        <div class="dt-pop-foot"><button type="button" class="dt-today" data-dt-today>Today</button></div>
      </div>
    </div>
    <div class="dt-box" data-dt-box="time">
      <input class="dt-seg" id="publish_at-t-hh" data-dt-seg type="text" inputmode="numeric" maxlength="2" placeholder="HH" aria-label="Hour (1–12)" autocomplete="off" />
      <span class="dt-sep">:</span>
      <input class="dt-seg" id="publish_at-t-mi" data-dt-seg type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="Minutes" autocomplete="off" />
      <span class="dt-ampm" role="group" aria-label="AM or PM">
        <button type="button" class="dt-amp" data-dt-amp aria-pressed="false">AM</button>
        <button type="button" class="dt-amp" data-dt-pm aria-pressed="false">PM</button>
      </span>
      <button type="button" class="dt-clear" data-dt-clear hidden aria-label="Clear"></button>
    </div>
    <p class="dt-error" data-dt-error role="status"></p>
    <input type="hidden" id="publish_at" data-dt-value value="" />
  </div>`;
  document.body.appendChild(wrap);
  window.vyDateTime.rebind();
  return true;
});
t("D-42", "rebind() adopts injected datetime root", injected);
await page.evaluate(() => window.vyDateTime.set(document.getElementById("publish_at"), "2026-12-05T14:30"));
st = await dtState("publish_at");
t("D-43", "set() seam composes datetime: segments + PM + hidden",
  st.value === "2026-12-05T14:30" && st.dd === "05" && st.mm === "12" && st.yy === "2026" && st.hh === "02" && st.mi === "30" && st.pmPressed, JSON.stringify(st));
await segLoc("publish_at", "hh").click();
await segLoc("publish_at", "hh").pressSequentially("08", { delay: 25 });
await segLoc("publish_at", "mi").pressSequentially("15", { delay: 25 });
await page.locator('[data-dt]:has(#publish_at) [data-dt-amp]').click();
st = await dtState("publish_at");
t("D-44", "datetime edit recomposes hidden (08:15 AM)", st.value === "2026-12-05T08:15", JSON.stringify(st));
await page.locator('[data-dt]:has(#publish_at) [data-dt-box="date"] [data-dt-clear]').click();
st = await dtState("publish_at");
t("D-45", "date-box clear only empties the date half", st.value === "" && st.hh === "08" && st.mi === "15", JSON.stringify(st));

// form.reset() handler
await open("/consultations");
const consultationHasForm = await page.locator("form[data-booking-endpoint]").count();
if (consultationHasForm > 0) {
  await typeDate("bk-date", "10", "10", "2027");
  await page.locator('[data-booking-endpoint] [data-dt]:has(#bk-date) [data-dt-clear]').click();
  st = await dtState("bk-date");
  t("D-46", "consultation BookingForm preferred_date works + clearable", st.value === "", JSON.stringify(st));
} else {
  t("D-46", "consultation BookingForm present", false, "no form[data-booking-endpoint] on /consultations");
}

// reset seam: fill a BookingForm field, reset the form via JS, field re-renders
if (consultationHasForm > 0) {
  await typeDate("bk-date", "10", "10", "2027");
  await page.evaluate(() => document.querySelector("form[data-booking-endpoint]").reset());
  await page.waitForTimeout(200);
  st = await dtState("bk-date");
  t("D-47", "form.reset() re-renders field from reset hidden (seam)", st.value === "" && st.dd === "" && !st.pmPressed, JSON.stringify(st));
}

// ═══ axe + dark mode ══════════════════════════════════════════════════════════
async function axe(label, path, theme) {
  await open(path);
  if (theme === "dark") await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(() => axe.run(document, { runOnly: { type: "tag", values: ["wcag2aa"] } }));
  const vios = res.violations.map((v) => `${v.id}(${v.nodes.length})`).join(", ");
  t(label, `axe wcag2aa ${path} ${theme}`, res.violations.length === 0, vios || "clean");
}
await axe("D-48", "/kundli", "light");
await axe("D-49", "/", "light");
await axe("D-50", "/matching", "light");
await axe("D-51", "/calculators/age", "light");
await axe("D-52", "/calculators/moon-phase", "light");
await axe("D-53", "/muhurat", "light");
await axe("D-54", "/panchang/mumbai", "light");
await axe("D-55", "/kundli", "dark");
await axe("D-56", "/calculators/age", "dark");

// dark shots with popup open + error state
await open("/kundli");
await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
await typeDate("k-date", "31", "02", "1990");
await shot(page, "kundli-error-dark");
await typeDate("k-date", "15", "08", "1990");
await triggerLoc("k-date").click();
await page.locator('[data-dt]:has(#k-date) [data-dt-month]').selectOption("7");
await shot(page, "kundli-popup-dark");

// mobile 360 popup shot
await page.setViewportSize({ width: 360, height: 780 });
await open("/kundli");
await triggerLoc("k-date").click();
await page.waitForTimeout(200);
const mobileClamp = await page.evaluate(() => {
  const pop = document.querySelector('[data-dt]:has(#k-date) [data-dt-pop]');
  const r = pop.getBoundingClientRect();
  return { visible: !pop.hidden, within: r.left >= 0 && r.right <= window.innerWidth + 1, width: r.width };
});
t("D-57", "360px: popup clamps to viewport", mobileClamp.visible && mobileClamp.within, JSON.stringify(mobileClamp));
await shot(page, "kundli-popup-360");

writeFileSync(resolve(OUT, "s16-results.json"), JSON.stringify({ results, failures }, null, 2));
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURES"} — ${results.length} checks`);
await browser.close();
process.exit(failures === 0 ? 0 : 1);
