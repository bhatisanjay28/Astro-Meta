// S13 — owner-requested calculators: moon-phase / sun-sign / destiny-number.
// Black-box e2e through the real UI: fill the form, submit, assert the
// research-verified vectors render (S14-2 shared block renderer: verdict card
// / chips / detail rows); plus strict WCAG AA contrast (axe) on all three
// pages in BOTH light and dark mode.
// Run: bun qa/e2e-s13-calculators.mjs   (preview server on :4321 required;
// backend must be deployed — pages call the live worker API)
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

let failures = 0;
const evidence = { ran_at: new Date().toISOString(), cases: [], contrast: {} };

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// S16 made #bf-date/#bf-time hidden DateField inputs — drive the visible
// segments. Time fields may be 12h (AM/PM buttons) or 24h per data-hour12.
async function fillDate(page, date) {
  const [y, m, d] = date.split("-");
  await page.fill("#bf-date-dd", d);
  await page.fill("#bf-date-mm", m);
  await page.fill("#bf-date-yy", y);
  await page.locator("#bf-date-yy").blur();
}
async function fillTime(page, time) {
  const hour12 = (await page.getAttribute('.dt[data-dt="time"]', "data-hour12")) === "true";
  const [h, mi] = time.split(":").map(Number);
  if (hour12) {
    const h12 = h % 12 === 0 ? 12 : h % 12;
    await page.fill("#bf-time-hh", String(h12).padStart(2, "0"));
    await page.fill("#bf-time-mi", String(mi).padStart(2, "0"));
    await page.locator(h >= 12 ? "[data-dt-pm]" : "[data-dt-amp]").click();
  } else {
    await page.fill("#bf-time-hh", String(h).padStart(2, "0"));
    await page.fill("#bf-time-mi", String(mi).padStart(2, "0"));
  }
  await page.locator("#bf-time-mi").blur();
}

async function calc(path, fields) {
  await page.goto(BASE + path, { waitUntil: "load" });
  if (fields.date) await fillDate(page, fields.date);
  if (fields.time) await fillTime(page, fields.time);
  await page.click("form button[type=submit]");
  await page.waitForSelector("[data-calc-result] .verdict-card, [data-calc-result] .hint.err", { timeout: 15000 });
  // S14-2 renderer shapes: verdict card, chips ("Label value"), detail rows ("k=v")
  return page.evaluate(() => {
    const $ = (sel) => Array.from(document.querySelectorAll(`[data-calc-result] ${sel}`));
    return {
      verdict: document.querySelector("[data-calc-result] .verdict-main")?.textContent?.trim() ?? "",
      sub: document.querySelector("[data-calc-result] .verdict-sub")?.textContent?.trim() ?? "",
      chips: $(".chip").map((c) =>
        [c.querySelector(".chip-k")?.textContent?.trim(), c.querySelector(".chip-v")?.textContent?.trim()]
          .filter(Boolean)
          .join(" "),
      ),
      rows: $(".row").map((r) => `${r.querySelector(".k")?.textContent?.trim()}=${r.querySelector(".v")?.textContent?.trim()}`),
    };
  });
}

function check(caseName, result, expectations) {
  const row = { case: caseName, ok: true, misses: [] };
  for (const [key, predicate] of Object.entries(expectations)) {
    const value = result[key];
    if (!predicate(value)) {
      row.ok = false;
      row.misses.push(`${key}=${JSON.stringify(value)?.slice(0, 140)}`);
    }
  }
  if (!row.ok) failures++;
  evidence.cases.push(row);
  console.log(`${row.ok ? "PASS" : "FAIL"}  ${caseName}${row.ok ? "" : " → " + row.misses.join("; ")}`);
}

const includes = (needle) => (v) => typeof v === "string" && v.includes(needle);
const has = (needle) => (v) =>
  Array.isArray(v) ? v.some((x) => String(x).includes(needle)) : String(v ?? "").includes(needle);

// 1. Moon phase — full-moon instant (published 2025-01-13 22:26 UTC; 22:30 is
// just past full → waning, chips carry motion, rows carry neighbouring phases)
const fm = await calc("/calculators/moon-phase/", { date: "2025-01-13", time: "22:30" });
check("moon-phase FM 2025-01-13 22:30 UTC", fm, {
  verdict: includes("Full Moon"),
  chips: has("Waning"),
  // neighbouring phases render in display format ("31 Dec 2024, 03:57 am")
  rows: has("Previous new moon=31 Dec 2024") && has("Next new moon=29 Jan 2025") && has("Next full moon=12 Feb 2025"),
});

// 2. Moon phase — date-only default (noon UTC) lands in the NM bucket for 2025-06-25
const nm = await calc("/calculators/moon-phase/", { date: "2025-06-25" });
check("moon-phase date-only 2025-06-25", nm, {
  verdict: includes("New Moon"),
  // API returns 2025-07-10T20:37Z → IST 11 Jul, which is what the renderer shows
  rows: has("Next full moon=11 Jul 2025"),
});

// 3. Sun sign — Makar Sankranti day 2025 (ingress 09:03 IST → noon UTC is Makara)
const sun = await calc("/calculators/sun-sign/", { date: "2025-01-14" });
check("sun-sign Makar Sankranti 2025-01-14", sun, {
  verdict: includes("Capricorn"),
  sub: has("Capricorn"),
  chips: has("Sign lord Saturn"),
});

// 4. Sun sign — Mesha ingress straddle. The verdict card shows the WESTERN
// (tropical) sign; the vedic rashi rides in the sub line. On 2025-04-13 the
// tropical sun is already Aries (ingress Mar 20) while sidereal is still Meena.
const meena = await calc("/calculators/sun-sign/", { date: "2025-04-13" });
check("sun-sign 2025-04-13 (pre-ingress)", meena, { verdict: includes("Aries"), sub: has("Pisces") });
const mesha = await calc("/calculators/sun-sign/", { date: "2025-04-15" });
check("sun-sign 2025-04-15 (post-ingress)", mesha, { verdict: includes("Aries"), sub: has("Mesha"), chips: has("Sign lord Mars") });

// 5. Destiny — master-33 case (bhagyank.in shows 33, AstroTalk shows 6)
const master = await calc("/calculators/destiny-number/", { date: "1970-06-19" });
check("destiny master-33 1970-06-19", master, {
  verdict: includes("6"),
  chips: has("Mulank 1") && has("Destiny lord Venus") && has("Mulank lord Sun") && has("Master number Yes"),
  rows: has("Full sum before reduction=33") && has("Master number=Yes"),
});

// 6. Destiny — plain vectors (Independence Day → 8/Saturn)
const indep = await calc("/calculators/destiny-number/", { date: "1947-08-15" });
check("destiny 1947-08-15", indep, {
  verdict: includes("8"),
  chips: has("Destiny lord Saturn") && has("Mulank 6"),
  rows: has("Master number=No"),
});

// 7. Impossible date — the S16 DateField is the client-side guard: segments
// can hold 30/02/2025, but the hidden value must not commit an invalid date
// (server 400 path is covered by the API route tests + live curl).
await page.goto(BASE + "/calculators/moon-phase/", { waitUntil: "load" });
await page.fill("#bf-date-dd", "30");
await page.fill("#bf-date-mm", "02");
await page.fill("#bf-date-yy", "2025");
await page.locator("#bf-date-yy").blur();
await page.waitForTimeout(200);
const dateValue = await page.$eval('[name="date"]', (el) => el.value);
const guarded = dateValue !== "2025-02-30";
if (!guarded) failures++;
evidence.cases.push({ case: "date input rejects impossible 2025-02-30", ok: guarded, actual: dateValue });
console.log(`${guarded ? "PASS" : "FAIL"}  date input rejects impossible date (value="${dateValue}")`);

// 8. Strict WCAG AA contrast on all three pages, light AND dark
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  for (const path of ["/calculators/moon-phase/", "/calculators/sun-sign/", "/calculators/destiny-number/"]) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(600);
    await page.addScriptTag({ content: axeSrc });
    const violations = await page.evaluate(() =>
      window.axe
        .run(document, { runOnly: { type: "tag", values: ["wcag2aa"] } })
        .then((r) =>
          r.violations
            .filter((v) => v.id === "color-contrast")
            .flatMap((v) => v.nodes.map((n) => ({ html: n.html.slice(0, 90), ratio: n.any[0]?.data?.contrastRatio }))),
        ),
    );
    const ok = violations.length === 0;
    if (!ok) failures++;
    evidence.contrast[`${colorScheme} ${path}`] = { ok, violations };
    console.log(`${ok ? "PASS" : "FAIL"}  contrast ${colorScheme} ${path}`);
  }
}

await browser.close();
writeFileSync(resolve(__dirname, "evidence/s13-calculators.json"), JSON.stringify(evidence, null, 2));
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURES"} — evidence: qa/evidence/s13-calculators.json`);
process.exit(failures === 0 ? 0 : 1);
