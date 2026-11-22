// S15-1 — place/city search-select UX on every PlaceField surface.
// Black-box e2e through the real UI: select → type-to-replace → ×-clear;
// state invalidation on edit; free-text validation + submit blocking;
// prefill edit mode (rebind seam); keyboard (Esc×2, Tab-to-×, arrows, Enter);
// matching field independence; muhurat default; panchang slug navigation;
// axe wcag2aa light+dark; responsive field shots at 360/768/1024/1440.
// Run: bun qa/e2e-place-picker.mjs   (preview server on :4321 required;
// backend must be deployed — pages call the live worker API)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");
const OUT = resolve(__dirname, "../_bmad-output/place-picker/qa");
mkdirSync(resolve(OUT, "shots"), { recursive: true });

let failures = 0;
const results = [];
const t = (id, name, ok, detail = "") => {
  results.push({ id, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function open(path) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const gotit = page.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) {
    await gotit.click();
    await page.waitForTimeout(200);
  }
}

// read the full state of the place field whose visible input is #id
async function placeState(id) {
  return page.evaluate((id) => {
    const input = document.getElementById(id);
    const field = input?.closest("[data-place-field]");
    if (!field) return null;
    const role = (r) => field.querySelector(`[data-place-role="${r}"]`)?.value ?? "";
    const clear = field.querySelector("[data-place-clear]");
    return {
      text: input.value,
      selected: field.getAttribute("data-place-selected") === "true",
      combined: role("combined"),
      lat: role("lat"),
      lng: role("lng"),
      tz: role("tz"),
      place_id: role("place_id"),
      clearVisible: Boolean(clear) && !clear.hidden,
      status: field.querySelector("[data-place-status]")?.textContent ?? "",
      ariaInvalid: input.getAttribute("aria-invalid") === "true",
      focused: document.activeElement === input,
    };
  }, id);
}

// wait until the field's resolved place lands in its hidden roles
async function waitResolved(id) {
  await page.waitForFunction(
    (id) => {
      const f = document.getElementById(id)?.closest("[data-place-field]");
      const r = f?.querySelector('[data-place-role="combined"], [data-place-role="lat"]');
      return Boolean(r && r.value);
    },
    id,
    { timeout: 15000 },
  );
}

// pick a place through the real UI: one input event → suggestions → click → resolve
// (single fill avoids the multi-render window of char-by-char typing; the
// option selector is scoped to an OPEN list so a second field's stale list
// can never satisfy the wait)
async function pick(id, query) {
  const input = page.locator(`#${id}`);
  await input.click();
  await input.fill(query);
  await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
  await page.waitForTimeout(150);
  await page.locator('[data-place-list]:not([hidden]) [role="option"]').first().click();
  await waitResolved(id);
}

// type free text into a place field (fresh, replaces anything selected)
async function typeFree(id, text) {
  const input = page.locator(`#${id}`);
  await input.click();
  await input.pressSequentially(text, { delay: 30 });
}

// ── /kundli — the combined-variant reference surface ─────────────────────────
await open("/kundli");
await pick("k-place", "New Del");
let st = await placeState("k-place");
t("P-01", "select fills roles + selected + × visible + ✓ status",
  st.combined.split(",").length === 3 && st.selected && st.clearVisible && st.status.startsWith("✓"),
  `combined=${st.combined}`);

// AC-2: click select-all + first keystroke replaces
await page.locator("#k-place").click();
await page.waitForTimeout(100); // deferred select fires a tick after the click
const selectAll = await page.evaluate(() => {
  const i = document.getElementById("k-place");
  return i.selectionStart === 0 && i.selectionEnd === i.value.length;
});
t("P-02a", "clicking the filled field selects all its text", selectAll && st.text.length > 0);
await page.keyboard.type("Mum");
await page.waitForTimeout(150);
st = await placeState("k-place");
t("P-02b", "first keystroke invalidates the old place immediately",
  st.combined === "" && st.place_id === "" && !st.selected);
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
await page.locator('[data-place-list]:not([hidden]) [role="option"]').first().click();
await waitResolved("k-place");
const stP01 = await placeState("k-place");
t("P-02c", "new pick replaces old value end-to-end",
  stP01.selected && stP01.combined.split(",").length === 3 && stP01.text !== "" && stP01.text.includes("Mum"),
  `text=${stP01.text}`);

// retyping the SAME query after a pick must fetch again (session consumed)
await page.locator("#k-place").click();
await page.waitForTimeout(100); // deferred select-all lands before typing
await page.keyboard.type("Mum"); // the exact query that produced the current pick
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
t("P-02d", "same query re-fetches after a consumed selection", true);
await page.keyboard.press("Escape"); // close the list; text stays → × visible for P-03

// AC-1: × clear
await page.locator('[data-place-clear]').first().click();
await page.waitForTimeout(120);
st = await placeState("k-place");
t("P-03", "× clears text+state, refocuses input, announces, shows placeholder path",
  st.text === "" && st.combined === "" && st.place_id === "" && !st.selected && !st.clearVisible
    && st.focused && st.status === "City cleared." && !st.ariaInvalid);

// AC-4: free-text validation on blur + submit block
await typeFree("k-place", "xyzabc");
await page.locator("h1").click(); // blur to an element OUTSIDE the field
await page.waitForTimeout(300);
st = await placeState("k-place");
t("P-04", "free text on blur → aria-invalid + 'Please select a city from the list.'",
  st.ariaInvalid && st.status.includes("Please select a city from the list."));
// S16 segmented DateField: compose via the picker's own API (the hidden
// [name=date]/[name=time] inputs are not directly fillable)
await page.evaluate(() => {
  window.vyDateTime.set(document.querySelector('[name="date"]'), "2000-01-01");
  window.vyDateTime.set(document.querySelector('[name="time"]'), "10:00");
});
await page.locator('form:has(#k-place) button[type="submit"]').click();
await page.waitForTimeout(500);
// S18: the shared gate owns submit blocking (capture + stopPropagation) —
// the free-text place is caught by the GATE (status + summary), and the
// page's fetch handler never runs, so [data-k-error] stays hidden
const kBlock = await page.evaluate(() => {
  const status = document.querySelector('form:has(#k-place) [data-place-status]')?.textContent ?? "";
  const summary = document.querySelector('form:has(#k-place) [data-form-errors]')?.textContent ?? "";
  const kErr = document.querySelector("[data-k-error]");
  return { status, summary, kErrHidden: !kErr || kErr.hidden };
});
t("P-05", "kundli submit blocked while field holds free text (gate owns the block)",
  kBlock.status.includes("place of birth") && kBlock.summary.length > 0 && kBlock.kErrHidden,
  JSON.stringify(kBlock));

// AC-5: keyboard — arrows+Enter, Tab-to-×, Esc×2
await open("/kundli");
const inp = page.locator("#k-place");
await inp.click();
await inp.pressSequentially("Jaipur", { delay: 40 });
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
await page.keyboard.press("ArrowDown");
const activeIdx = await page.evaluate(() => {
  const opts = [...document.querySelectorAll('[data-place-list] [role="option"]')];
  return opts.findIndex((o) => o.classList.contains("active"));
});
await page.keyboard.press("Enter");
await waitResolved("k-place");
st = await placeState("k-place");
t("P-06a", "ArrowDown highlights, Enter picks", st.selected && activeIdx === 0);
await page.keyboard.press("Tab");
const tabTarget = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
t("P-06b", "Tab from input reaches × (aria-label 'Clear city')", tabTarget === "Clear city");
await page.keyboard.press("Enter");
st = await placeState("k-place");
t("P-06c", "Enter on × clears the field", st.text === "" && !st.clearVisible && st.status === "City cleared.");
await typeFree("k-place", "Udaipur");
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
await page.keyboard.press("Escape");
const listHidden = await page.evaluate(() =>
  document.querySelector('[data-place-list]')?.hidden ?? true,
);
t("P-06d", "first Esc closes the list", listHidden === true);
await page.keyboard.press("Escape");
await page.waitForTimeout(120);
st = await placeState("k-place");
t("P-06e", "second Esc clears the field", st.text === "" && st.status === "City cleared.");

// AC-7: prefill edit mode via the rebind seam
await page.evaluate(() => {
  const field = document.getElementById("k-place").closest("[data-place-field]");
  field.querySelector("[data-place-input]").value = "Jaipur, Rajasthan, India";
  field.querySelector('[data-place-role="combined"]').value = "26.9124,75.7873,Asia/Kolkata";
  field.querySelector('[data-place-role="place_id"]').value = "city:jaipur";
  window.vyPlacePicker.rebind();
});
st = await placeState("k-place");
t("P-07a", "prefill adopted — selected + × visible", st.selected && st.clearVisible,
  `text=${st.text}`);
await page.locator("#k-place").click();
await page.keyboard.type("Delh");
await page.waitForTimeout(120);
st = await placeState("k-place");
t("P-07b", "editing a prefilled place invalidates it", st.combined === "" && !st.selected);
await typeFree("k-place", "Delhi");
await page.waitForSelector('[data-place-list]:not([hidden]) [role="option"]', { timeout: 15000 });
await page.locator('[data-place-list]:not([hidden]) [role="option"]').first().click();
await waitResolved("k-place");
st = await placeState("k-place");
t("P-07c", "prefilled place replaceable end-to-end", st.selected && st.text.includes("Delh"));

// ── /matching — two independent fields ───────────────────────────────────────
await open("/matching");
await pick("boy-place", "Mumbai");
await pick("girl-place", "Pune");
let boy = await placeState("boy-place");
let girl = await placeState("girl-place");
t("P-08a", "boy+girl selected independently",
  boy.selected && boy.lat !== "" && girl.selected && girl.lat !== "");
await page.locator("#boy-place").click();
await page.keyboard.type("Delh");
await page.waitForTimeout(120);
boy = await placeState("boy-place");
girl = await placeState("girl-place");
t("P-08b", "editing boy clears only boy; girl untouched",
  boy.lat === "" && boy.tz === "" && !boy.selected && girl.selected && girl.lat !== "" && girl.tz !== "");

// ── /muhurat — hidden default stays, pick reloads today ─────────────────────
await open("/muhurat/");
st = await placeState("mt-place");
const windows0 = await page.locator("[data-mt-out] .cell:not(.skeleton)").count();
t("P-09a", "muhurat default New Delhi in roles, empty look, no ×",
  st.combined.split(",").length === 3 && !st.clearVisible && !st.selected && st.text === "");
await pick("mt-place", "Pune");
await page.waitForTimeout(1200);
const windows1 = await page.locator("[data-mt-out] .cell:not(.skeleton)").count();
st = await placeState("mt-place");
t("P-09b", "pick reloads today windows via place:selected", windows1 > 0 && windows0 > 0 && st.selected);

// ── /panchang — pick navigates to the city page (or honest fallback) ─────────
await open("/panchang/");
await pick("pl-place", "Mumbai");
await page.waitForURL("**/panchang/mumbai", { timeout: 12000 }).catch(() => null);
t("P-10a", "carded city pick navigates to /panchang/mumbai", page.url().includes("/panchang/mumbai"),
  page.url());
// a city-table row without a dedicated card keeps the designed fallback message
await open("/panchang/");
await pick("pl-place", "New Delhi"); // resolves to city:new-delhi-delhi — no card for it
st = await placeState("pl-place");
t("P-10b", "non-carded pick keeps the designed fallback message",
  st.status.includes("no dedicated page"), st.status.slice(0, 60));

// ── calculators — required and optional kinds ────────────────────────────────
await open("/calculators/rashi/");
await page.evaluate(() => {
  window.vyDateTime.set(document.querySelector('[name="date"]'), "2000-01-01");
  window.vyDateTime.set(document.querySelector('[name="time"]'), "10:00");
});
await typeFree("bf-place", "Jaipur");
await page.locator('form button[type="submit"]').click();
await page.waitForTimeout(500);
const calcStatus = await page.evaluate(
  () => document.querySelector("[data-place-status]")?.textContent ?? "",
);
t("P-11a", "required calculator blocks free text (gate wording — birth place context)",
  calcStatus.includes("place of birth from the list"), calcStatus);
await pick("bf-place", "Jaipur");
await page.locator('form button[type="submit"]').click();
await page.waitForSelector("[data-calc-result] .verdict-card", { timeout: 20000 });
t("P-11b", "required calculator submits after a real pick", true);

await open("/calculators/sun-sign/");
await page.evaluate(() => {
  window.vyDateTime.set(document.querySelector('[name="date"]'), "1995-11-05");
});
await typeFree("bf-place", "Jaipur");
await page.locator('form button[type="submit"]').click();
await page.waitForTimeout(500);
const sunStatus = await page.evaluate(
  () => document.querySelector("[data-place-status]")?.textContent ?? "",
);
const noVerdict = await page.evaluate(
  () => !document.querySelector("[data-calc-result] .verdict-card"),
);
t("P-11c", "optional calculator blocks free text with no pick",
  sunStatus.includes("Please select a city from the list.") && noVerdict, sunStatus);
await page.locator("#bf-place").fill("");
await page.locator('form button[type="submit"]').click();
await page.waitForSelector("[data-calc-result] .verdict-card", { timeout: 20000 });
t("P-11d", "optional calculator still works with no place (regression)", true);

// ── AC-8: locked (readonly) field binds nothing ──────────────────────────────
await open("/kundli");
await page.evaluate(() => {
  const wrap = document.createElement("div");
  wrap.id = "pp-locked-test";
  wrap.innerHTML = `<div data-place-field="" style="display:none">
    <input data-place-input id="pp-locked-input" readonly aria-label="locked place" />
    <div data-place-list hidden></div>
    <p data-place-status></p>
  </div>`;
  document.body.appendChild(wrap);
  window.vyPlacePicker.rebind();
});
const lockedOk = await page.evaluate(() => {
  const f = document.getElementById("pp-locked-input").closest("[data-place-field]");
  return !f.querySelector("[data-place-clear]") && f.querySelector("[data-place-list]").hidden;
});
t("P-12", "readonly field: no × rendered, picker binds nothing", lockedOk);
await page.evaluate(() => document.getElementById("pp-locked-test").remove());

// ── axe wcag2aa on /kundli in light + dark (× visible, error state shown) ────
let axeFails = 0;
for (const colorScheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme });
  await open("/kundli");
  await typeFree("k-place", "xyzabc");
  await page.keyboard.press("Tab"); // error state visible
  await page.waitForTimeout(300);
  await page.addScriptTag({ content: axeSrc });
  const violations = await page.evaluate(() =>
    window.axe
      .run(document, { runOnly: { type: "tag", values: ["wcag2aa"] } })
      .then((r) => r.violations.map((v) => `${v.id}×${v.nodes.length}`)),
  );
  console.log(`  [${colorScheme}] axe: ${violations.length ? violations.join(", ") : "clean"}`);
  if (violations.length) axeFails++;
}
await page.emulateMedia({ colorScheme: "light" });
t("P-13", "axe wcag2aa clean in light + dark (incl. error state)", axeFails === 0);

// ── responsive field shots — every surface × 360/768/1024/1440 ───────────────
const surfaces = [
  ["kundli", "/kundli", "k-place", "pick"],
  ["matching", "/matching", "boy-place", "pick"],
  ["muhurat", "/muhurat/", "mt-place", "type"], // pick navigates nothing but keep the × state cheap
  ["panchang", "/panchang/", "pl-place", "type"], // a pick would navigate away
  ["home-kundli", "/", "hk-place", "pick"],
  ["home-panchang", "/", "hp-place", "pick"],
  ["calc-rashi", "/calculators/rashi/", "bf-place", "pick"],
  ["calc-sun-sign", "/calculators/sun-sign/", "bf-place", "pick"],
];
const shots = [];
for (const [name, path, id, mode] of surfaces) {
  for (const w of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await open(path);
    if (mode === "pick") {
      await pick(id, "New Del");
    } else {
      await typeFree(id, "New Delhi");
      await page.keyboard.press("Escape"); // close the list, keep text → × visible
    }
    await page.waitForTimeout(250);
    const field = page.locator("div.pp").filter({ has: page.locator(`#${id}`) });
    const file = resolve(OUT, "shots", `${name}-${w}.png`);
    await field.screenshot({ path: file });
    shots.push(`${name}-${w}.png`);
  }
}
// full-viewport 360 layout shots with the field selected
for (const [name, path, id] of [
  ["kundli", "/kundli", "k-place"],
  ["matching", "/matching", "boy-place"],
  ["muhurat", "/muhurat/", "mt-place"],
]) {
  await page.setViewportSize({ width: 360, height: 800 });
  await open(path);
  if (name === "muhurat") {
    await typeFree(id, "New Delhi");
    await page.keyboard.press("Escape");
  } else {
    await pick(id, "New Del");
  }
  await page.waitForTimeout(250);
  const file = resolve(OUT, "shots", `full-${name}-360.png`);
  await page.screenshot({ path: file, fullPage: true });
  shots.push(`full-${name}-360.png`);
}
await page.setViewportSize({ width: 1440, height: 900 });

writeFileSync(
  resolve(OUT, "evidence.json"),
  JSON.stringify({ ran_at: new Date().toISOString(), base: BASE, results, shots }, null, 2),
);
console.log(
  failures
    ? `\n${failures} failure(s) — REGRESSION`
    : `\nALL ${results.length} PASS — S15-1 place-picker UX verified`,
);
await browser.close();
process.exit(failures ? 1 : 0);
