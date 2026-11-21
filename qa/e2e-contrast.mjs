// BUG-06 regression — WCAG AA color contrast on the pages that had hardcoded
// dark-text-on-gold surfaces (1.97–2.18:1 fails), in BOTH light and dark mode.
// Eyebrow contrast (accent gold ≈3.1:1 light / text-saffron ≈3.1:1 dark) was
// owner-flagged and is now fixed too — this suite asserts everything, strictly:
// no node is excluded (the old eyebrow exemption is gone).
// Run: bun qa/e2e-contrast.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

const PAGES = [
  "/",                          // home eyebrows (saffron) + consent "Got it" button
  "/blog",                      // Search submit button
  "/horoscope/aries/daily",     // active period chip
  "/consultations",             // initial badges
  "/consultations/astrology-for-career-decisions", // detail badge + crumbs
  "/calculators/rashi",         // control — was already passing
  "/about",                     // LegalPage .eyebrow (was accent gold, light-mode fail)
  "/contact",                   // .eyebrow + eyebrow-dot
];

let failures = 0;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Dark mode is honoured via prefers-color-scheme by Base.astro's inline script
// (fresh context has no localStorage override), so emulating it is deterministic.
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(600);
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
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
    console.log(`[${colorScheme}]${isDark === (colorScheme === "dark") ? "" : " THEME-MISMATCH!"} ${path}: ${violations.length} contrast fail(s)`);
    for (const v of violations) {
      failures++;
      console.log("   FAIL:", v.html, "ratio", v.ratio);
    }
  }
}

await browser.close();
console.log(failures ? `\n${failures} contrast failure(s) — REGRESSION` : "\nALL PASS (light + dark, strict)");
process.exit(failures ? 1 : 0);
