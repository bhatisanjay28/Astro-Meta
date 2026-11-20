// BUG-04 regression — place-picker inputs must use valid combobox ARIA.
// Axe flagged aria-expanded/aria-autocomplete on a plain textbox
// (aria-allowed-attr, critical) on every page with a PlaceField.
// Run: bun qa/e2e-aria.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

const PAGES = ["/kundli", "/muhurat", "/matching", "/horoscope", "/calculators/rashi"];

let failures = 0;
const assert = (cond, label) => {
  if (cond) console.log("  ok:", label);
  else { failures++; console.log("  FAIL:", label); }
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSrc });
  const violations = await page.evaluate(() =>
    window.axe
      .run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag21a"] } })
      .then((r) => r.violations.filter((v) => v.id === "aria-allowed-attr")),
  );
  assert(violations.length === 0, `${path}: no aria-allowed-attr violations`);
}

// combobox wiring on a representative field
await page.goto(BASE + "/muhurat", { waitUntil: "load" });
const wiring = await page.evaluate(() => {
  const input = document.querySelector("input[data-place-input]");
  if (!input) return null;
  const listId = input.getAttribute("aria-controls");
  return {
    role: input.getAttribute("role"),
    controls: listId,
    listExists: listId ? !!document.getElementById(listId) : false,
    autocomplete: input.getAttribute("aria-autocomplete"),
  };
});
assert(wiring?.role === "combobox", "input has role=combobox");
assert(wiring?.autocomplete === "list", "input keeps aria-autocomplete=list");
assert(wiring?.listExists === true, "aria-controls points at the rendered listbox");

await browser.close();
console.log(failures ? `\n${failures} assertion(s) FAILED` : "\nALL PASS");
process.exit(failures ? 1 : 0);
