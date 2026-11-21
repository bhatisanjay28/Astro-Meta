// S14-2 — shared results renderer + registry fixes + 3 new pages.
// Black-box e2e through the real UI: fill, submit, assert the shared block
// renderer (B1 verdict card / B2 chips / B4 details) renders correctly on
// rebuilt + new pages; strict full WCAG AA (axe) on rashi / dasha / lo-shu /
// transits in BOTH light and dark; responsive screenshots to shots-after/.
// Run: bun qa/e2e-s14-calculators.mjs   (preview server on :4321 required;
// backend must be deployed — pages call the live worker API)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");
const SHOTS = resolve(__dirname, "../_bmad-output/calculators/qa/shots-after");
mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const evidence = { ran_at: new Date().toISOString(), cases: [], contrast: {}, shots: [] };

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function open(slug) {
  await page.goto(`${BASE}/calculators/${slug}/`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  // dismiss the consent banner so it never overlays evidence shots
  const gotit = page.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) {
    await gotit.click();
    await page.waitForTimeout(200);
  }
}
async function submitBirth(slug, date, time) {
  await open(slug);
  await page.fill('[name="date"]', date);
  await page.fill('[name="time"]', time);
  const place = page.locator('[data-place-field] input:not([type="hidden"])').first();
  await place.click();
  await place.fill("New Delhi");
  await page.waitForTimeout(600);
  await page.locator('[data-place-list] [role="option"], [data-place-list] li').first().click();
  await page.waitForTimeout(600);
  await page.click("form button[type=submit]");
  await page.waitForSelector("[data-calc-result] .verdict-card, [data-calc-result] .hint.err", { timeout: 20000 });
}
async function submitFields(slug, fields) {
  await open(slug);
  for (const [name, value] of Object.entries(fields)) {
    await page.fill(`[name="${name}"]`, value);
  }
  await page.click("form button[type=submit]");
  await page.waitForSelector("[data-calc-result] .verdict-card, [data-calc-result] .hint.err", { timeout: 20000 });
}
const result = () =>
  page.evaluate(() => {
    const $ = (sel) => Array.from(document.querySelectorAll(`[data-calc-result] ${sel}`));
    return {
      verdict: document.querySelector("[data-calc-result] .verdict-main")?.textContent?.trim() ?? "",
      eyebrow: document.querySelector("[data-calc-result] .verdict-eyebrow")?.textContent?.trim() ?? "",
      sub: document.querySelector("[data-calc-result] .verdict-sub")?.textContent?.trim() ?? "",
      chips: $(".chip").map((c) => c.textContent?.replace(/\s+/g, " ").trim() ?? ""),
      rows: $(".row").map((r) => `${r.querySelector(".k")?.textContent?.trim()}=${r.querySelector(".v")?.textContent?.trim()}`),
      tables: $(".table").length,
      tableRows: $(".table tbody tr").length,
      loshuCells: $(".loshu-cell").length,
      loshuMiss: $(".loshu-cell.miss").length,
      bars: $(".bar").length,
      lists: $(".blist li").map((li) => li.textContent?.trim() ?? ""),
      meaning: $(".meaning p").map((p) => p.textContent?.trim() ?? ""),
      flaglines: $(".flagline").map((f) => f.textContent?.trim() ?? ""),
    };
  });

function check(caseName, r, expectations) {
  const row = { case: caseName, ok: true, misses: [] };
  for (const [key, predicate] of Object.entries(expectations)) {
    const value = r[key];
    if (!predicate(value)) {
      row.ok = false;
      row.misses.push(`${key}=${JSON.stringify(value)?.slice(0, 140)}`);
    }
  }
  if (!row.ok) failures++;
  evidence.cases.push(row);
  console.log(`${row.ok ? "PASS" : "FAIL"}  ${caseName}${row.ok ? "" : " → " + row.misses.join("; ")}`);
}
const has = (needle) => (arr) => Array.isArray(arr) && arr.some((x) => String(x).includes(needle));
const gt = (n) => (v) => typeof v === "number" && v > n;
const eq = (n) => (v) => v === n;

// 1. rashi — rebuilt page through the shared renderer (B1+B2+B3)
await submitBirth("rashi", "1990-05-15", "14:30");
check("rashi verdict card", await result(), {
  eyebrow: (v) => v === "MOON SIGN",
  verdict: (v) => v === "Capricorn",
  sub: (v) => v.includes("Uttara Ashadha") && v.includes("2"),
  chips: has("Sign lord"),
  meaning: (arr) => Array.isArray(arr) && arr.length > 0,
});

// 2. vimshottari-dasha — NEW page: bar + mahadasha table + antardasha table
await submitBirth("vimshottari-dasha", "1990-05-15", "14:30");
check("vimshottari-dasha page", await result(), {
  eyebrow: (v) => v === "CURRENT MAHADASHA",
  verdict: (v) => v.length > 0,
  chips: has("Next antardasha"),
  bars: eq(1),
  tables: eq(2),
  tableRows: gt(9),
});

// 3. lo-shu — 3×3 grid + planes/arrows table
await submitFields("lo-shu", { date: "1967-08-24" });
check("lo-shu grid page", await result(), {
  verdict: (v) => v.includes("Missing") && v.includes("3") && v.includes("5"),
  loshuCells: eq(9),
  loshuMiss: gt(0),
  tables: eq(1),
  tableRows: eq(8),
});

// 4. transits — grahas table (no more 1825px row dump)
await open("transits");
const place = page.locator('[data-place-field] input:not([type="hidden"])').first();
await place.click();
await place.fill("New Delhi");
await page.waitForTimeout(600);
await page.locator('[data-place-list] [role="option"], [data-place-list] li').first().click();
await page.waitForTimeout(600);
await page.click("form button[type=submit]");
await page.waitForSelector("[data-calc-result] .verdict-card, [data-calc-result] .hint.err", { timeout: 20000 });
check("transits table", await result(), {
  eyebrow: (v) => v === "CURRENT SKY",
  tables: eq(1),
  tableRows: eq(9),
});

// 5. mangal-dosha — dedicated route + verdict semantics (QB-05 raw flags;
// rows carry the raw house numbers, chips carry the Yes/No flags)
await submitBirth("mangal-dosha", "1992-03-02", "08:15");
check("mangal-dosha MD2 (cancelled)", await result(), {
  verdict: (v) => v.includes("Manglik"),
  chips: has("Cancellation"),
  rows: has("House from Moon=1"),
});

// 6. kaal-sarp — dedicated route + planet table
await submitBirth("kaal-sarp", "2000-03-30", "12:00");
check("kaal-sarp page", await result(), {
  verdict: (v) => v.includes("Not present") || v.includes("Full") || v.includes("Present"),
  tables: eq(1),
  tableRows: eq(7),
});

// 7. flames — trace list (QF-01 companion; the trace names the remaining
// candidate after each elimination — 5 entries for the 5 removed letters)
await submitFields("flames", { a: "Rohan", b: "Lenna" });
check("flames trace", await result(), {
  verdict: (v) => v === "Marriage",
  lists: (arr) => Array.isArray(arr) && arr.length >= 5,
  flaglines: has("entertainment"),
});

// 8. name-numerology — owner-date compatibility card (new field)
await submitFields("name-numerology", { name: "Poonam", date: "1990-06-15" });
check("name-numerology with owner date", await result(), {
  verdict: (v) => v === "5",
  rows: has("Owner mulank"),
});

// 9. vehicle-number — plate analyser (dual schools)
await submitFields("vehicle-number", { date: "1990-06-15", plate: "DL 8C AF 1234" });
check("vehicle plate verdict", await result(), {
  eyebrow: (v) => v === "PLATE VERDICT",
  verdict: (v) => ["Lucky", "Mixed", "Neutral", "Not suggested"].some((x) => v.includes(x)),
  rows: has("State code=DL"),
});

// 10. NEW pages render at all (nakshatra + lagna)
await submitBirth("nakshatra", "1990-05-15", "14:30");
check("nakshatra new page", await result(), {
  eyebrow: (v) => v === "NAKSHATRA",
  verdict: (v) => v === "Uttara Ashadha",
});
await submitBirth("lagna", "1990-05-15", "14:30");
check("lagna new page", await result(), {
  eyebrow: (v) => v === "ASCENDANT (LAGNA)",
  verdict: (v) => v.length > 0,
});

// 11. Responsive screenshots (360/768/1024/1440) of rashi, dasha, lo-shu
for (const [slug, runner] of [
  ["rashi", () => submitBirth("rashi", "1990-05-15", "14:30")],
  ["vimshottari-dasha", () => submitBirth("vimshottari-dasha", "1990-05-15", "14:30")],
  ["lo-shu", () => submitFields("lo-shu", { date: "1967-08-24" })],
]) {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await runner();
    const file = resolve(SHOTS, `${slug}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    evidence.shots.push(file);
    console.log(`SHOT  ${slug} @${width}`);
  }
}
await page.setViewportSize({ width: 1440, height: 900 });

// 12. Strict full WCAG AA on rashi / dasha / lo-shu / transits, light AND dark
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  for (const slug of ["rashi", "vimshottari-dasha", "lo-shu", "transits"]) {
    await open(slug);
    await page.waitForTimeout(600);
    await page.addScriptTag({ content: axeSrc });
    const violations = await page.evaluate(() =>
      window.axe
        .run(document, { runOnly: { type: "tag", values: ["wcag2aa"] } })
        .then((r) => r.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
    );
    const ok = violations.length === 0;
    if (!ok) failures++;
    evidence.contrast[`${colorScheme} ${slug}`] = { ok, violations };
    console.log(`${ok ? "PASS" : "FAIL"}  axe AA ${colorScheme} /calculators/${slug}/ ${ok ? "" : JSON.stringify(violations)}`);
  }
}
await page.emulateMedia({ colorScheme: "light" });

await browser.close();
writeFileSync(resolve(__dirname, "evidence/s14-calculators.json"), JSON.stringify(evidence, null, 2));
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURES"} — evidence: qa/evidence/s14-calculators.json, shots: ${evidence.shots.length}`);
process.exit(failures === 0 ? 0 : 1);
