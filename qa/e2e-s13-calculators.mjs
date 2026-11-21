// S13 — owner-requested calculators: moon-phase / sun-sign / destiny-number.
// Black-box e2e through the real UI: fill the form, submit, assert the
// research-verified vectors render; plus strict WCAG AA contrast (axe) on all
// three pages in BOTH light and dark mode.
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

async function calc(path, fields) {
  await page.goto(BASE + path, { waitUntil: "load" });
  for (const [name, value] of Object.entries(fields)) {
    await page.fill(`[name="${name}"]`, value);
  }
  await page.click("form button[type=submit]");
  await page.waitForSelector("[data-calc-result] .grid-result", { timeout: 15000 });
  // key → rendered text of the value cell
  return page.evaluate(() => {
    const out = {};
    document.querySelectorAll("[data-calc-result] .row").forEach((row) => {
      const k = row.querySelector(".k")?.textContent?.trim();
      const v = row.querySelector(".v")?.textContent?.trim();
      if (k) out[k] = v ?? "";
    });
    return out;
  });
}

function check(caseName, result, expectations) {
  const row = { case: caseName, ok: true, misses: [] };
  for (const [key, predicate] of Object.entries(expectations)) {
    const value = result[key] ?? "";
    if (!predicate(value)) {
      row.ok = false;
      row.misses.push(`${key}="${value}"`);
    }
  }
  if (!row.ok) failures++;
  evidence.cases.push(row);
  console.log(`${row.ok ? "PASS" : "FAIL"}  ${caseName}${row.ok ? "" : " → " + row.misses.join("; ")}`);
}

const includes = (needle) => (v) => v.includes(needle);

// 1. Moon phase — full-moon instant (published 2025-01-13 22:26 UTC)
const fm = await calc("/calculators/moon-phase/", { date: "2025-01-13", time: "22:30" });
check("moon-phase FM 2025-01-13 22:30 UTC", fm, {
  phase: includes("Full Moon"),
  waxing: includes("No"),
  prev_new_moon: includes("2024-12-30"),
  next_new_moon: includes("2025-01-29"),
  next_full_moon: includes("2025-02-12"),
});

// 2. Moon phase — date-only default (noon UTC) lands in the NM bucket for 2025-06-25
const nm = await calc("/calculators/moon-phase/", { date: "2025-06-25" });
check("moon-phase date-only 2025-06-25", nm, {
  phase: includes("New Moon"),
  next_full_moon: includes("2025-07-10"),
});

// 3. Sun sign — Makar Sankranti day 2025 (ingress 09:03 IST → noon UTC is Makara)
const sun = await calc("/calculators/sun-sign/", { date: "2025-01-14" });
check("sun-sign Makar Sankranti 2025-01-14", sun, {
  tropical_sign: includes("Capricorn"),
  rashi: includes("Capricorn"),
  lord: includes("Saturn"),
});

// 4. Sun sign — Mesha ingress straddle (Apr 13 Meena / Apr 15 Mesha)
const meena = await calc("/calculators/sun-sign/", { date: "2025-04-13" });
check("sun-sign 2025-04-13 (pre-ingress)", meena, { rashi: includes("Pisces") });
const mesha = await calc("/calculators/sun-sign/", { date: "2025-04-15" });
check("sun-sign 2025-04-15 (post-ingress)", mesha, { rashi: includes("Aries"), lord: includes("Mars") });

// 5. Destiny — master-33 case (bhagyank.in shows 33, AstroTalk shows 6)
const master = await calc("/calculators/destiny-number/", { date: "1970-06-19" });
check("destiny master-33 1970-06-19", master, {
  destiny: includes("6"),
  destiny_sum: includes("33"),
  master: includes("Yes"),
  mulank: includes("1"),
  destiny_lord: includes("Venus"),
  mulank_lord: includes("Sun"),
});

// 6. Destiny — plain vectors (Independence Day → 8/Saturn)
const indep = await calc("/calculators/destiny-number/", { date: "1947-08-15" });
check("destiny 1947-08-15", indep, {
  destiny: includes("8"),
  destiny_lord: includes("Saturn"),
  mulank: includes("6"),
  master: includes("No"),
});

// 7. Impossible date — the browser's type=date input is the client-side guard:
// it cannot hold 2025-02-30 at all, so submit stays blocked (server 400 path is
// covered by the API route tests + live curl).
await page.goto(BASE + "/calculators/moon-phase/", { waitUntil: "load" });
await page.fill('[name="date"]', "2025-02-30");
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
