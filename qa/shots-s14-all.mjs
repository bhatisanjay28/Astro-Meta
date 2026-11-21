// S14-3 AC-2 — responsive evidence for ALL 23 calculator pages at
// 360/768/1024/1440 with a submitted result on screen (the empty-form state
// is not the deliverable). One verdict-bearing full-page shot per pair →
// _bmad-output/calculators/qa/shots-after/{slug}-{width}.png.
// Run: bun qa/shots-s14-all.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const SHOTS = resolve(__dirname, "../_bmad-output/calculators/qa/shots-after");
mkdirSync(SHOTS, { recursive: true });

// per-tool submit payloads (registry kinds: birth / date-place / date / name / place)
const TOOLS = {
  rashi: { date: "1990-05-15", time: "14:30", place: "New Delhi" },
  nakshatra: { date: "1990-05-15", time: "14:30", place: "New Delhi" },
  lagna: { date: "1990-05-15", time: "14:30", place: "New Delhi" },
  "vimshottari-dasha": { date: "1990-05-15", time: "14:30", place: "New Delhi" },
  karakas: { date: "1990-06-15", time: "10:30", place: "New Delhi" },
  "ishta-devata": { date: "1990-06-15", time: "10:30", place: "New Delhi" },
  "sade-sati": { date: "1995-11-05", time: "14:20", place: "Mumbai" },
  "mangal-dosha": { date: "1992-03-02", time: "08:15", place: "Jaipur", select: { gender: "male" } },
  "kaal-sarp": { date: "2000-03-30", time: "12:00", place: "Mumbai" },
  transits: { place: "New Delhi" },
  "sun-sign": { date: "2025-01-14" },
  "moon-phase": { date: "2025-01-13", time: "22:30" },
  numerology: { name: "Poonam", date: "1990-06-15" },
  "destiny-number": { date: "1970-06-19" },
  "lo-shu": { date: "1967-08-24" },
  age: { date: "2000-02-29" },
  "vehicle-number": { date: "1990-06-15", plate: "DL 8C AF 1234" },
  "name-numerology": { name: "Poonam", date: "1990-06-15" },
  "mobile-numerology": { digits: "9990513999" },
  "name-compatibility": { a: "Rohan", b: "Lenna" },
  love: { a: "Rohan", b: "Lenna" },
  friendship: { a: "Rohan", b: "Lenna" },
  flames: { a: "Rohan", b: "Lenna" },
};

let failures = 0;
const only = process.argv.slice(2);
const slugs = only.length ? only : Object.keys(TOOLS);
const log = [];
const prevIndex = (() => {
  try {
    return readFileSync(resolve(SHOTS, "_index.txt"), "utf8").split("\n").filter((l) => l && !slugs.some((s) => l.startsWith(`${s}@`)));
  } catch {
    return [];
  }
})();
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

for (const slug of slugs) {
  const cfg = TOOLS[slug];
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    try {
      await page.goto(`${BASE}/calculators/${slug}/`, { waitUntil: "load", timeout: 20000 });
      const gotit = page.getByRole("button", { name: /Got it/i });
      if (await gotit.isVisible().catch(() => false)) {
        await gotit.click();
        await page.waitForTimeout(150);
      }
      for (const [name, value] of Object.entries(cfg)) {
        if (name === "place" || name === "select") continue;
        await page.fill(`form [name="${name}"]`, value);
      }
      for (const [name, value] of Object.entries(cfg.select ?? {})) {
        await page.selectOption(`form select[name="${name}"]`, value);
      }
      if (cfg.place) {
        const place = page.locator('[data-place-field] input:not([type="hidden"])').first();
        await place.click();
        await place.fill(cfg.place);
        await page.waitForTimeout(500);
        await page.locator('[data-place-list] [role="option"], [data-place-list] li').first().click();
        await page.waitForTimeout(500);
      }
      await page.click("form button[type=submit]");
      await page.waitForSelector("[data-calc-result] .verdict-card", { timeout: 20000 });
      const file = resolve(SHOTS, `${slug}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      log.push(`PASS ${slug}@${width}`);
    } catch (e) {
      failures++;
      log.push(`FAIL ${slug}@${width} — ${String(e).split("\n")[0].slice(0, 120)}`);
    }
  }
}
await browser.close();
const all = [...prevIndex, ...log].sort();
writeFileSync(resolve(SHOTS, "_index.txt"), all.join("\n") + "\n");
console.log(log.join("\n"));
console.log(`\n${log.filter((l) => l.startsWith("PASS")).length}/${slugs.length * 4} shots this run — ${failures} failures (index: ${all.filter((l) => l.startsWith("PASS")).length} PASS total)`);
process.exit(failures === 0 ? 0 : 1);
