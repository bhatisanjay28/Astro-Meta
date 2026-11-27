// Quinn regression suite (BMAD Step 2.5): asserts the CORRECT values from
// _bmad-output/calculators/research/* against the live deployed backend and
// the built frontend. Every FAIL = a confirmed bug (see discrepancy-report.md).
// Run: bun qa/e2e-calculators-regressions.mjs   (preview server on 127.0.0.1:4321)
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://astro-backend.vyotish.workers.dev";
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:4321";
const OUT = "_bmad-output/calculators/qa";
mkdirSync(OUT, { recursive: true });

const results = [];
function record(id, desc, ok, detail) {
  results.push({ id, desc, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${desc}${ok ? "" : " — " + detail}`);
}

async function api(name, path, init) {
  const r = await fetch(API + path, init);
  let j = null;
  try { j = await r.json(); } catch {}
  return { status: r.status, j };
}
const birthQS = (date, time, lat, lng, tz = "Asia/Kolkata") =>
  `?date=${date}&time=${time}&lat=${lat}&lng=${lng}&tz=${encodeURIComponent(tz)}`;
const kundliBody = (date, time, lat, lng, tz = "Asia/Kolkata") => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ date, time, lat, lng, tz }),
});

// ---------- A. Regression guards: behaviour that MUST keep passing ----------
{
  const { j } = await api("rashi", `/api/v1/calculators/rashi${birthQS("1990-05-15", "14:30", 28.6139, 77.209)}`);
  record("RG-01", "rashi 1990-05-15 14:30 Delhi → Capricorn/Uttara Ashadha p2", j?.data?.rashi === "Capricorn" && j?.data?.nakshatra === "Uttara Ashadha" && j?.data?.pada === 2, JSON.stringify(j?.data));
}
{
  const { j } = await api("destiny", `/api/v1/calculators/destiny-number?date=1970-06-19`);
  record("RG-02", "destiny 1970-06-19 → 6 / sum 33 / master / mulank 1", j?.data?.destiny === 6 && j?.data?.destiny_sum === 33 && j?.data?.master === true && j?.data?.mulank === 1, JSON.stringify(j?.data));
}
{
  const { j } = await api("mobile", `/api/v1/calculators/mobile-numerology?digits=9990513999`);
  record("RG-03", "mobile 9990513999 → 63 → 9 Mars", j?.data?.sum === 63 && j?.data?.root === 9 && j?.data?.lord === "Mars", JSON.stringify(j?.data));
}
{
  const { j } = await api("loshu", `/api/v1/calculators/lo-shu?date=1967-08-24`);
  record("RG-04", "lo-shu 1967-08-24 → missing [3,5], repeated []", JSON.stringify(j?.data?.missing) === "[3,5]" && JSON.stringify(j?.data?.repeated) === "[]", JSON.stringify({ m: j?.data?.missing, r: j?.data?.repeated }));
}
{
  const a = await api("sunsin1", `/api/v1/calculators/sun-sign?date=2025-01-14`);
  const b = await api("sunsin2", `/api/v1/calculators/sun-sign?date=2025-01-13`);
  record("RG-05", "sun-sign Sankranti pair → Makara / Dhanu", a.j?.data?.rashi === "Capricorn" && b.j?.data?.rashi === "Sagittarius", `${a.j?.data?.rashi} / ${b.j?.data?.rashi}`);
}
{
  const { j } = await api("moonfm", `/api/v1/calculators/moon-phase?date=2025-01-13&time=22:27`);
  record("RG-06", "moon-phase FM instant → Full Moon", j?.data?.phase === "Full Moon", JSON.stringify({ phase: j?.data?.phase, illum: j?.data?.illumination }));
}
{
  const { j } = await api("namenum", `/api/v1/calculators/name-numerology?name=${encodeURIComponent("Sanjay Bhati")}`);
  record("RG-07", "name-numerology 'Sanjay Bhati' → 25 → 7 Ketu", j?.data?.sum === 25 && j?.data?.root === 7 && j?.data?.lord === "Ketu", JSON.stringify(j?.data));
}
{
  const { j } = await api("age", `/api/v1/calculators/age?date=2000-02-29&now=2025-02-28`);
  record("RG-08", "age Feb-29 → 24y 11m 30d / 9131 days", j?.data?.years === 24 && j?.data?.months === 11 && j?.data?.days === 30 && j?.data?.total_days === 9131, JSON.stringify(j?.data));
}

// ---------- B. Bug proofs: EXPECTED-correct behaviour (currently failing) ----------
// QB-01: UTC solver wrong day for evening births
{
  const { j } = await api("k1", `/api/v1/kundli`, kundliBody("2000-03-30", "22:15", 19.076, 72.8777));
  record("QB-01a", "kundli 22:15 IST Mumbai → UTC echo 2000-03-30T16:45", j?.data?.birth?.datetime_utc?.startsWith("2000-03-30T16:45"), `got ${j?.data?.birth?.datetime_utc}`);
}
{
  const { j } = await api("r2", `/api/v1/calculators/rashi${birthQS("1995-11-05", "19:15", 19.076, 72.8777)}`);
  record("QB-01b", "rashi 19:15 IST Mumbai (evening) → Pisces", j?.data?.rashi === "Pisces", `got ${j?.data?.rashi}`);
}
{
  const { j } = await api("k2", `/api/v1/kundli`, kundliBody("1990-05-15", "14:30", -33.8688, 151.2093, "Australia/Sydney"));
  record("QB-01c", "kundli 14:30 Sydney → lagna Virgo (QB-01 date-shift control)", j?.data?.lagna?.sign === "Virgo", `got ${j?.data?.lagna?.sign}`);
}
// QB-02: Rahu/Ketu must be sidereal (Meeus mean node − Lahiri linear ayanamsha)
{
  const { j } = await api("tr", `/api/v1/calculators/transits?lat=28.6139&lng=77.209&tz=Asia/Kolkata`);
  const now = new Date();
  const d = (now.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
  const omega = ((125.04452 - 0.05295376 * d) % 360 + 360) % 360;
  const ayan = 23.853044 + (50.2564 / 3600) * (d / 365.25);
  const expected = ((omega - ayan) % 360 + 360) % 360;
  const rahu = j?.data?.grahas?.find((g) => g.planet === "Rahu");
  const delta = rahu ? Math.abs(((rahu.lon - expected + 540) % 360) - 180) : NaN;
  record("QB-02", `transits Rahu sidereal ≈ ${expected.toFixed(2)}° (Δ<0.3°)`, Number.isFinite(delta) && delta < 0.3, `got ${rahu?.lon} Δ=${delta}`);
}
// QB-03/04: previously-dead pages must render a verdict (S14-2 renderer:
// results are .verdict-card/.detail-card blocks, never the old .grid-result)
{
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  async function uiVerdict(slug, fill) {
    await page.goto(`${BASE}/calculators/${slug}`, { waitUntil: "networkidle" });
    await fill(page);
    await page.click("form button[type=submit]");
    await page.waitForSelector("[data-calc-result] .verdict-card, [data-calc-result] .hint.err", { timeout: 20000 });
    const verdict = await page.$eval("[data-calc-result] .verdict-main", (el) => el.textContent?.trim() ?? "").catch(() => "");
    const details = await page.$$eval("[data-calc-result] .detail-card", (cards) => cards.length);
    const rows = await page.$$eval("[data-calc-result] .row", (rows) => rows.length);
    return { verdict, details, rows };
  }
  const birthFill = (date, time) => async (page) => {
    // S16 made #bf-date/#bf-time hidden DateField inputs — drive the visible
    // segments (date DD/MM/YYYY; time is hour12, so convert 24h → 12h + AM/PM).
    const [y, m, d] = date.split("-");
    await page.fill("#bf-date-dd", d);
    await page.fill("#bf-date-mm", m);
    await page.fill("#bf-date-yy", y);
    await page.locator("#bf-date-yy").blur();
    const h24 = Number(time.split(":")[0]);
    const mi = time.split(":")[1];
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    await page.fill("#bf-time-hh", String(h12).padStart(2, "0"));
    await page.fill("#bf-time-mi", mi);
    await page.locator(h24 >= 12 ? "[data-dt-pm]" : "[data-dt-amp]").click();
    await page.locator("#bf-time-mi").blur();
    const place = page.locator('[data-place-field] input:not([type="hidden"])').first();
    await place.click();
    await place.fill("New Delhi");
    await page.waitForTimeout(600);
    await page.locator('[data-place-list] [role="option"], [data-place-list] li').first().click();
    await page.waitForTimeout(600);
  };
  const namesFill = (a, b) => async (page) => {
    await page.fill('form [name="a"]', a);
    await page.fill('form [name="b"]', b);
  };
  const ks = await uiVerdict("kaal-sarp", birthFill("2000-03-30", "12:00")).catch((e) => ({ err: String(e).slice(0, 80) }));
  record("QB-03", "UI kaal-sarp renders a verdict (dedicated route)", typeof ks.verdict === "string" && ks.verdict.length > 0 && ks.details > 0, JSON.stringify(ks));
  const md = await uiVerdict("mangal-dosha", birthFill("1995-11-05", "20:38")).catch((e) => ({ err: String(e).slice(0, 80) }));
  record("QB-04", "UI mangal-dosha renders a verdict (dedicated route)", typeof md.verdict === "string" && (md.verdict.includes("Manglik") || md.verdict.includes("Not Manglik")) && md.rows > 0, JSON.stringify(md));
  const fl = await uiVerdict("flames", namesFill("Rohan", "Lenna")).catch((e) => ({ err: String(e).slice(0, 80) }));
  record("QF-01", "UI flames renders Marriage with trace (a/b params)", fl.verdict === "Marriage" && fl.details > 0, JSON.stringify(fl));
  await browser.close();
}
// QB-05: manglik must report detection alongside cancellation
{
  const { j } = await api("k3", `/api/v1/kundli`, kundliBody("1992-03-02", "08:15", 26.9124, 75.7873));
  const m = j?.data?.manglik;
  record("QB-05", "manglik MD2 → from_moon true AND cancelled true", m?.from_moon === true && m?.cancelled === true, JSON.stringify({ fm: m?.from_moon, c: m?.cancelled, h: m?.mars_houses }));
}
// QB-06 (decision-gated D-QB06): sade-sati window start = first entry
{
  const { j } = await api("ss", `/api/v1/calculators/sade-sati${birthQS("1995-11-05", "14:20", 19.076, 72.8777)}`);
  record("QB-06", "sade-sati Ex2 window starts 2022-04-29 (first-entry)", String(j?.data?.current?.start ?? "").startsWith("2022-04-29"), `got ${j?.data?.current?.start}`);
}
// QB-08: ishta-devata must answer
{
  const { j } = await api("id", `/api/v1/calculators/ishta-devata${birthQS("1990-06-15", "10:30", 28.6139, 77.209)}`);
  record("QB-08", "ishta-devata 1990-06-15 Delhi → Shiva (12th from Karakamsha)", j?.data?.ishta_devata === "Shiva", `got ${JSON.stringify(j?.data?.ishta_devata)}`);
}
// QB-10/QN-08/QF-06/07: impossible + nonsensical dates must 400
{
  const a = await api("r3", `/api/v1/calculators/rashi${birthQS("2025-02-30", "12:00", 28.6139, 77.209)}`);
  record("QB-10", "rashi 2025-02-30 → 400", a.status === 400, `got ${a.status} ${JSON.stringify(a.j?.data?.rashi)}`);
  const b = await api("n1", `/api/v1/calculators/numerology?date=2025-02-30`);
  record("QN-08", "numerology 2025-02-30 → 400", b.status === 400, `got ${b.status} ${JSON.stringify(b.j?.data)}`);
  const c = await api("a1", `/api/v1/calculators/age?date=2025-02-30&now=2026-01-01`);
  record("QF-06", "age 2025-02-30 → 400", c.status === 400, `got ${c.status} ${JSON.stringify(c.j?.data)}`);
  const e = await api("a2", `/api/v1/calculators/age?date=2030-01-01&now=2026-01-01`);
  record("QF-07", "age future DOB → 400", e.status === 400, `got ${e.status} ${JSON.stringify(e.j?.data)}`);
}
// QN-01: mobile prefix strip
{
  const { j } = await api("m1", `/api/v1/calculators/mobile-numerology?digits=${encodeURIComponent("+91 98765 43210")}`);
  record("QN-01", "mobile '+91 98765 43210' → 45 → 9 Mars", j?.data?.sum === 45 && j?.data?.root === 9 && j?.data?.lord === "Mars", JSON.stringify(j?.data));
}
// QN-02: vehicle consensus matrix
{
  const { j } = await api("v1", `/api/v1/calculators/vehicle-number?date=1992-03-14`);
  record("QN-02", "vehicle mulank 5 → friendly [1,2,3,4,6] neutral [7,8,9]", JSON.stringify(j?.data?.friendly_numbers) === "[1,2,3,4,6]" && JSON.stringify(j?.data?.neutral_numbers) === "[7,8,9]", JSON.stringify({ f: j?.data?.friendly_numbers, n: j?.data?.neutral_numbers }));
}
// QF-02/03: FLAMES algorithm
{
  const { j } = await api("f1", `/api/v1/calculators/flames?a=Rohan&b=Lenna`);
  record("QF-02", "flames Rohan+Lenna → Marriage (Wikipedia vector)", j?.data?.result === "Marriage", `got ${j?.data?.result}`);
  const k = await api("f2", `/api/v1/calculators/flames?a=Asha&b=Asha`);
  record("QF-03", "flames Asha+Asha → Friends (n=0 convention)", k.j?.data?.result === "Friends", `got ${k.j?.data?.result}`);
}

const pass = results.filter((r) => r.ok === true).length;
const fail = results.filter((r) => r.ok === false).length;
writeFileSync(`${OUT}/regressions.json`, JSON.stringify({ date: new Date().toISOString(), pass, fail, results }, null, 2));
console.log(`\n${pass} PASS / ${fail} FAIL (evidence: ${OUT}/regressions.json)\nFAILs = confirmed bugs per discrepancy-report.md`);
process.exit(0);
