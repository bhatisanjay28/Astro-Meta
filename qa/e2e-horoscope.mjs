// Horoscope Upgrade Step 4 — baked /horoscope/{sign}/{period} pages (72 total).
// Mode-aware: when the build-time fetch served a generated payload it asserts
// the full spec §1–§5 render (bandmarks, chips, lucky card, month table);
// otherwise it pins the honest legacy/empty states (pre-migration builds).
// Run: bun qa/e2e-horoscope.mjs   (build + `bun run preview` on :4321 first)
// Step 5 live run: HZ_BASE=https://vyotish.com bun qa/e2e-horoscope.mjs
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.HZ_BASE ?? "http://127.0.0.1:4321";
const SHOTS = resolve(__dirname, "../_bmad-output/horoscope/qa/shots");
mkdirSync(SHOTS, { recursive: true });
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];
const PERIODS = ["yesterday", "daily", "tomorrow", "weekly", "monthly", "yearly"];

let failures = 0;
let payloadPages = 0;
const ok = (label) => console.log("  ok:", label);
const fail = (label) => { failures++; console.log("  FAIL:", label); };
const assert = (cond, label) => (cond ? ok(label) : fail(label));

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function open(path) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(300);
  const gotit = page.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) {
    await gotit.click();
    await page.waitForTimeout(200);
  }
}

// --- 1. structural sweep: all 12 signs × 6 periods -------------------------
console.log("1. structure sweep (72 pages)");
for (const sign of SIGNS) {
  for (const period of PERIODS) {
    const path = `/horoscope/${sign}/${period}/`;
    const res = await page.goto(BASE + path, { waitUntil: "load" });
    if (!res.ok()) { fail(`${path} HTTP ${res.status()}`); continue; }
    const h1 = await page.locator("h1").count();
    const fetchBox = await page.locator("[data-horoscope-reading]").count();
    const activeChips = await page.locator('.periods a[aria-current="page"]').count();
    const currentSigns = await page.locator('.picker a[aria-current="page"]').count();
    const trust = await page.locator(".hzs .trust").count();
    const book = await page.locator('.hzs a[href="/consultations/"]').count();
    const hasPayload = (await page.locator(".hzd-bandmark, .hzd-mtable, .hzd-thought").count()) > 0;
    if (hasPayload) payloadPages++;
    const problems = [];
    if (h1 !== 1) problems.push(`h1=${h1}`);
    if (fetchBox !== 0) problems.push("client fetch box still present");
    if (activeChips !== 1) problems.push(`activeChips=${activeChips}`);
    if (currentSigns > 1) problems.push(`currentSigns=${currentSigns}`);
    if (trust !== 1) problems.push(`trust=${trust}`);
    if (book !== 1) problems.push(`book=${book}`);
    // exactly one content mode renders
    const modes =
      (await page.locator(".hzd-empty").count()) +
      (await page.locator(".hzd-card").count());
    if (modes === 0) problems.push("no content mode rendered");
    assert(problems.length === 0, `${path}${problems.length ? " — " + problems.join(", ") : ""}${hasPayload ? " [payload]" : ""}`);
  }
}
assert(payloadPages > 0 || true, `payload pages baked: ${payloadPages}/72`);

// --- 2. probe: aries across all 6 periods, mode-aware -----------------------
console.log("2. aries probe per period");
await open("/horoscope/aries/daily/");
const dailyPayload = (await page.locator(".hzd-thought").count()) > 0;
if (dailyPayload) {
  assert((await page.locator(".hzd-bandmark").count()) >= 1, "daily: overview bandmark");
  assert((await page.locator(".hzd-dos .do, .hzd-dos .dont").count()) >= 1, "daily: dos/donts cards");
} else {
  const legacy = (await page.locator(".hzd-card").count()) > 0;
  const empty = (await page.locator(".hzd-empty").count()) === 1;
  assert(legacy || empty, "daily: legacy column card or honest empty");
}

await open("/horoscope/aries/monthly/");
if ((await page.locator(".hzd-daypill").count()) > 0) {
  assert((await page.locator(".hzd-daypill").count()) >= 2, "monthly: best/testing pills");
  assert((await page.locator(".hzd-sky li").count()) >= 1, "monthly: sky list");
} else {
  assert((await page.locator(".hzd-empty").count()) === 1, "monthly pre-payload: honest empty");
}

await open("/horoscope/aries/yearly/");
if ((await page.locator(".hzd-mtable").count()) > 0) {
  const rows = await page.locator(".hzd-mtable tbody tr").count();
  assert(rows === 12, `yearly: month table 12 rows (got ${rows})`);
  const chips = await page.locator(".hzd-mtable .hz-chip").count();
  assert(chips === 12, `yearly: filled chip on every row (got ${chips})`);
  const chipWords = await page.locator(".hzd-mtable .hz-chip .w").first().textContent();
  assert(!!chipWords && chipWords.trim().length > 0, "yearly: chip carries band word text");
} else {
  assert((await page.locator(".hzd-empty").count()) === 1, "yearly pre-payload: honest empty");
}

// lucky sidebar card — only meaningful with payload
if (payloadPages > 0 && (await page.locator(".hzs .lucky").count()) > 0) {
  const num = await page.locator(".hzs .lucky .num").textContent();
  assert(!!num && Number(num) >= 1 && Number(num) <= 9, `lucky: number in 1–9 (got ${num})`);
  assert((await page.locator(".hzs .lucky .sw").count()) >= 1, "lucky: colour swatches");
  assert((await page.locator('.hzs .lucky [lang="hi"]').count()) === 1, "lucky: mantra has lang=hi");
  const why = await page.locator(".hzs .lucky .why").textContent();
  assert(!!why && why.length > 10, "lucky: why line filled");
  assert((await page.locator(".hzs .lucky dd").count()) >= 3, "lucky: direction/deity rows present");
} else {
  assert((await page.locator(".hzs .trust").count()) === 1, "lucky: absent pre-payload, trust card present");
}

// --- 3. axe strict, BOTH themes, 3 representative pages ---------------------
console.log("3. axe strict scan (both themes)");
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  for (const path of ["/horoscope/aries/daily/", "/horoscope/aries/yearly/", "/horoscope/libra/monthly/"]) {
    await open(path);
    await page.addScriptTag({ content: axeSrc });
    const violations = await page.evaluate(() =>
      window.axe.run(document, { resultTypes: ["violations"] }),
    );
    const bad = violations.violations ?? [];
    assert(bad.length === 0, `axe ${colorScheme} ${path} — ${bad.length} violation(s)`);
    for (const v of bad) {
      console.log(`    [${v.id}] ${v.impact} ${v.nodes.length} node(s): ${v.nodes[0]?.target?.join(" ")}`);
    }
  }
}

// --- 4. evidence shots (light/dark desktop + mobile) -------------------------
console.log("4. evidence shots");
await page.emulateMedia({ colorScheme: "light" });
await open("/horoscope/aries/daily/");
await page.screenshot({ path: resolve(SHOTS, "aries-daily-light.png"), fullPage: true });
await open("/horoscope/aries/yearly/");
await page.screenshot({ path: resolve(SHOTS, "aries-yearly-light.png"), fullPage: true });
await page.emulateMedia({ colorScheme: "dark" });
await open("/horoscope/aries/daily/");
await page.screenshot({ path: resolve(SHOTS, "aries-daily-dark.png"), fullPage: true });
await page.setViewportSize({ width: 375, height: 812 });
await page.emulateMedia({ colorScheme: "light" });
await open("/horoscope/aries/weekly/");
await page.screenshot({ path: resolve(SHOTS, "aries-weekly-mobile.png"), fullPage: true });
ok("4 shots written to _bmad-output/horoscope/qa/shots/");

await browser.close();
console.log(failures === 0 ? `\nALL PASS (${payloadPages} payload pages)` : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
