// Epic ZC regression — Zodiac Sign Compatibility hub + pair pages.
// Covers: axe (strict, no exclusions) in BOTH themes, picker canonicalisation,
// full result render (score/band/6 cards/tips/disclaimer), swap button,
// and honest-state handling.
// Run: bun qa/e2e-zc-compatibility.mjs   (preview server on :4321 required;
// backend API base baked into the build must be reachable)
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

let failures = 0;
const ok = (label) => console.log("  ok:", label);
const fail = (label) => { failures++; console.log("  FAIL:", label); };
const assert = (cond, label) => (cond ? ok(label) : fail(label));

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// --- 1. axe strict scan, both themes, hub + one Excellent + one Challenging pair
const AXE_PAGES = ["/compatibility/", "/compatibility/aries/leo/", "/compatibility/aries/cancer/"];
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  for (const path of AXE_PAGES) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(400);
    // pair pages render results asynchronously — wait for content or honest state
    await page
      .waitForSelector(".zc-tips, .zc-state", { timeout: 8000 })
      .catch(() => {});
    await page.waitForTimeout(400);
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

// --- 2. picker canonicalisation: Leo (own) + Aries (partner) → /compatibility/aries/leo/
await page.emulateMedia({ colorScheme: "light" });
await page.goto(BASE + "/compatibility/", { waitUntil: "load" });
await page.selectOption('select[name="sign1"]', "leo");
await page.selectOption('select[name="sign2"]', "aries");
await Promise.all([
  page.waitForURL("**/compatibility/aries/leo/**", { timeout: 8000 }),
  page.click('button:has-text("Check Compatibility")'),
]);
assert(page.url().endsWith("/compatibility/aries/leo/"), "picker canonicalises leo+aries → aries/leo");

// --- 3. full result render on the pair page
await page.waitForSelector(".zc-tips li", { timeout: 8000 });
const score = await page.textContent(".zc-score-value");
const band = (await page.textContent(".zc-band-chip"))?.trim();
const cards = await page.locator(".zc-cat").count();
const tips = await page.locator(".zc-tips li").count();
const labels = await page.locator(".zc-cat-head h3").allTextContents();
const disclaimer = await page.textContent(".zc-disclaimer");
assert(score === "91", `overall score renders 91 (got ${score})`);
assert(band === "Excellent", `band chip Excellent (got ${band})`);
assert(cards === 6, `6 category cards (got ${cards})`);
assert(tips >= 4 && tips <= 6, `tips 4–6 (got ${tips})`);
assert(labels.length === 6 && labels.every((l) => l && !l.toLowerCase().endsWith("compatibility compatibility")), `labels clean (${labels.join(", ")})`);
assert(disclaimer.includes("guidance and entertainment"), "disclaimer strip renders");
const unverified = await page.locator(".zc-unverified").count();
assert(unverified === 1, "honesty flag (interpretive method) present");

// --- 4. facts chips + swap on the pair page
const chips = await page.locator(".zc-chip").allTextContents();
assert(chips.some((c) => c.includes("trine")), `aspect chip renders (${chips.length} chips)`);
await page.selectOption('select[name="sign2"]', "cancer");
await page.click("[data-zc-swap]");
const s1 = await page.inputValue('select[name="sign1"]');
const s2 = await page.inputValue('select[name="sign2"]');
assert(s1 === "cancer" && s2 === "aries", `swap exchanges values (got ${s1}/${s2})`);

// --- 5. same-sign page renders (nuanced 80, conjunction)
await page.goto(BASE + "/compatibility/leo/leo/", { waitUntil: "load" });
await page.waitForSelector(".zc-tips li", { timeout: 8000 });
const sameScore = await page.textContent(".zc-score-value");
const sameBand = (await page.textContent(".zc-band-chip"))?.trim();
assert(sameScore === "80", `same-sign leo/leo scores 80 (got ${sameScore})`);
assert(sameBand === "Strong", `same-sign band Strong (got ${sameBand})`);

// --- 6. hub 12-sign grid links to same-sign canonical pages
await page.goto(BASE + "/compatibility/", { waitUntil: "load" });
const gridLinks = await page.locator(".zc-sign-card").count();
const hrefs = await page.locator(".zc-sign-card").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
assert(gridLinks === 12, `12 sign cards (got ${gridLinks})`);
assert(hrefs.every((h) => /^\/compatibility\/[a-z]+\/\1\/$/.test(h) || h.match(/^\/compatibility\/([a-z]+)\/\1\/$/)), "grid links are same-sign canonical");

// --- 7. astrology hub card + sitemap carry the new URLs
await page.goto(BASE + "/astrology/", { waitUntil: "load" });
const zcCard = await page.locator('a[href="/compatibility"]').count();
assert(zcCard === 1, "astrology hub has the Zodiac Compatibility card");
const res = await page.request.get(BASE + "/sitemap.xml");
const xml = await res.text();
const pairUrls = (xml.match(/\/compatibility\/[a-z]+\/[a-z]+/g) ?? []).length;
assert(xml.includes("<loc>https://vyotish.com/compatibility</loc>"), "sitemap has hub URL");
assert(pairUrls === 78, `sitemap has 78 pair URLs (got ${pairUrls})`);

await browser.close();
console.log(failures === 0 ? "\nALL ZC E2E CHECKS PASS" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
