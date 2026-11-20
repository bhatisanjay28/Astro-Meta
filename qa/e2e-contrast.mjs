// BUG-06 regression — WCAG AA color contrast in light mode on the pages
// that had hardcoded dark-text-on-gold surfaces (1.97–2.18:1 fails).
// The .eyebrow gold styling (~3:1) is a separate owner-flagged design
// decision, so eyebrow nodes are reported but not asserted.
// Run: bun qa/e2e-contrast.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

const PAGES = [
  "/",                          // consent "Got it" button
  "/blog",                      // Search submit button
  "/horoscope/aries/daily",     // active period chip
  "/consultations",             // initial badges
  "/consultations/astrology-for-career-decisions", // detail badge + crumbs
  "/calculators/rashi",         // control — was already passing
];

let failures = 0;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

for (const path of PAGES) {
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
  const eyebrow = violations.filter((v) => v.html.includes("eyebrow"));
  const real = violations.filter((v) => !v.html.includes("eyebrow"));
  console.log(`${path}: ${real.length} contrast fail(s), ${eyebrow.length} eyebrow (owner-flagged)`);
  for (const v of real) {
    failures++;
    console.log("   FAIL:", v.html, "ratio", v.ratio);
  }
}

await browser.close();
console.log(failures ? `\n${failures} contrast failure(s) — REGRESSION` : "\nALL PASS");
process.exit(failures ? 1 : 0);
