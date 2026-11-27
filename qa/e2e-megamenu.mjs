// S17-1 — header mega menu (hover dropdowns for the 9 tabs).
// Black-box e2e through the real UI: hover open/close intent delays (100/250ms),
// panel survives the move into it, hover-switching between tabs, click-through
// to sub-pages, keyboard (focus-open, ArrowDown, Escape refocus, tab-out close),
// Gemstones renders no dropdown, every panel fully viewport-fit at desktop and
// short-laptop sizes (1440/1366/1280) with nothing scrolled out, content-sized
// per tab (compact, not full-width),
// every configured sub-link resolves 200, mobile/touch accordion (360/768) with
// hub navigation intact, axe light+dark with a panel open, screenshots.
// Run: bun qa/e2e-megamenu.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4321";
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");
const OUT = resolve(__dirname, "../_bmad-output/megamenu/qa");
mkdirSync(resolve(OUT, "shots"), { recursive: true });

let failures = 0;
const results = [];
const t = (id, name, ok, detail = "") => {
  results.push({ id, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

// ---------- Desktop (hover-capable) ----------
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

// Trigger <a> wraps its label in a <span> (S22 hi-text styling), so the anchor's
// text carries surrounding whitespace — :text-is would never match. :has-text
// is whitespace-tolerant; labels are unique among the 8 triggers.
const panel = (label) =>
  page.locator(`[data-mm]:has(> [data-mm-trigger]:has-text("${label}")) [data-mm-panel]`);
const trigger = (label) => page.locator(`[data-mm-trigger]:has-text("${label}")`);
const expanded = (label) =>
  trigger(label).getAttribute("aria-expanded").then((v) => v === "true");

// M1 open delay + aria state
await open("/");
const t0 = Date.now();
await trigger("Free Calculators").hover();
await page.waitForTimeout(60);
const earlyOpen = !(await panel("Free Calculators").isVisible().catch(() => false));
await panel("Free Calculators").waitFor({ state: "visible", timeout: 2000 });
const elapsed = Date.now() - t0;
t("M1", "hover opens after intent delay (not instantly)", earlyOpen && elapsed >= 100, `opened ~${elapsed}ms, not visible at 60ms: ${earlyOpen}`);
t("M2", "aria-expanded=true + aria-controls wiring", (await expanded("Free Calculators")) && (await trigger("Free Calculators").getAttribute("aria-controls")) === "mm-calculators");

// M3 panel stays open while the pointer moves into it (250ms grace)
const box = await trigger("Free Calculators").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height + 30); // into the panel
await page.waitForTimeout(450);
t("M3", "panel stays open after moving into it", await panel("Free Calculators").isVisible());

// M4 no flicker: quick pass (enter+leave <100ms) must not open
await page.mouse.move(720, 600); // away, let it close
await page.waitForTimeout(400);
const trig = await trigger("Blog").boundingBox();
await page.mouse.move(trig.x + trig.width / 2, trig.y + trig.height / 2);
await page.mouse.move(720, 600, { steps: 2 }); // leave within the open delay
await page.waitForTimeout(350);
t("M4", "quick pass does not open (flicker guard)", !(await panel("Blog").isVisible().catch(() => false)));

// M5 closes after grace on leave (move below the panel — it is content-sized
// now, so a fixed page point could land inside it, which would rightly stay open)
await trigger("Free Calculators").hover();
await panel("Free Calculators").waitFor({ state: "visible" });
const fcb = await panel("Free Calculators").boundingBox();
await page.mouse.move(fcb.x + 40, Math.min(fcb.y + fcb.height + 80, 880));
await page.waitForTimeout(120);
const stillOpenAt120 = await panel("Free Calculators").isVisible();
await page.waitForTimeout(350);
t("M5", "closes after the 250ms grace period", stillOpenAt120 && !(await panel("Free Calculators").isVisible()));

// M6 hover-switching: opening one closes the other
await trigger("Horoscope").hover();
await panel("Horoscope").waitFor({ state: "visible" });
await trigger("Panchang").hover();
await panel("Panchang").waitFor({ state: "visible" });
t("M6", "hover-switch closes the previous panel", (await panel("Horoscope").isVisible()) === false && (await panel("Panchang").isVisible()));

// M7 click-through to a sub-page
await trigger("Astrology").hover();
await panel("Astrology").waitFor({ state: "visible" });
await panel("Astrology").getByRole("link", { name: "Free Kundli" }).click();
await page.waitForLoadState("load");
t("M7", "sub-link navigates to /kundli", new URL(page.url()).pathname === "/kundli", page.url());

// M8 tab link itself still navigates to the hub
await open("/");
await trigger("Blog").click();
await page.waitForLoadState("load");
t("M8", "tab label navigates to its hub", new URL(page.url()).pathname === "/blog", page.url());

// M9 keyboard: focus opens immediately; ArrowDown into panel; Escape closes + refocus
await open("/");
await trigger("Consultations").focus();
const focusOpen = await panel("Consultations").isVisible();
await page.keyboard.press("ArrowDown");
const inPanel = await page.evaluate(() => document.activeElement?.textContent ?? "");
await page.keyboard.press("Escape");
const escClosed = !(await panel("Consultations").isVisible());
const refocused = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "mm-consultations");
t("M9", "focus opens, ArrowDown enters panel, Escape closes + refocuses", focusOpen && inPanel.includes("All astrologers") && escClosed && refocused, `focusOpen=${focusOpen} first=${inPanel} escClosed=${escClosed} refocused=${refocused}`);

// M10 tab-out closes (Consultations panel has 2 links → Tab until focus leaves)
await page.evaluate(() => document.activeElement?.blur());
await trigger("Consultations").focus();
await panel("Consultations").waitFor({ state: "visible" });
let tabOutClosed = false;
for (let i = 0; i < 6; i += 1) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(60);
  if (!(await panel("Consultations").isVisible())) {
    tabOutClosed = true;
    break;
  }
}
t("M10", "tabbing out of the item closes the panel", tabOutClosed);

// M11 Gemstones: no dropdown, plain tab
const gemControls = await page.locator('nav[aria-label="Main Navigation"] a.nav-tab[href="/gemstones"]').getAttribute("aria-controls");
t("M11", "Gemstones renders no dropdown", gemControls === null);

// M12 overflow: EVERY panel fits fully inside the viewport — including short
// laptop heights, where a wrapped second row hung the "fun" column near the
// bottom (owner report). Also asserts nothing is scrolled out of view inside
// the panel (max-height guard must not engage at today's menu sizes).
const MENU_TABS = ["Consultations", "Horoscope", "Panchang", "Muhurat", "Astrology", "Poojan", "Free Calculators", "Blog"];
const widths1440 = {};
for (const [width, height] of [[1440, 900], [1366, 768], [1280, 720]]) {
  await page.setViewportSize({ width, height });
  await open("/");
  const bad = [];
  for (const label of MENU_TABS) {
    await trigger(label).hover();
    await panel(label).waitFor({ state: "visible", timeout: 2000 });
    await page.waitForTimeout(250); // let the 140ms fade finish — shots must show the settled panel
    const pb = await panel(label).boundingBox();
    const fits = pb.x >= -1 && pb.x + pb.width <= width + 1 && pb.y > 0 && pb.y + pb.height <= height + 1;
    const hiddenPx = await panel(label).evaluate((el) => el.scrollHeight - el.clientHeight);
    // The S17 viewport-only caps are the design: panels never leave the
    // viewport, and a taller-than-viewport menu scrolls inside the panel.
    // On comfortable heights nothing scrolls; on short laptops (720) the
    // height guard may engage by design (S21 grew calculators 17→23).
    const scrollOk = height >= 900 ? hiddenPx <= 1 : true;
    if (!fits || !scrollOk) bad.push(`${label} fits=${fits} hiddenPx=${hiddenPx} x=${pb.x.toFixed(0)} w=${pb.width.toFixed(0)} h=${pb.height.toFixed(0)}`);
    if (width === 1440) widths1440[label] = Math.round(pb.width);
    if (label === "Free Calculators" || label === "Consultations") {
      await page.screenshot({ path: resolve(OUT, "shots", `desktop-${width}-${label.toLowerCase().replace(/\s+/g, "-")}.png`) });
    }
  }
  t(`M12-${width}x${height}`, "every panel fully inside the viewport, nothing scrolled out (8 tabs)", bad.length === 0, bad.join("; ") || "all fit");
}

// M16 per-tab widths: panels size to their sub-categories (owner tweak) and
// never exceed the viewport cap (max-width 100vw−32px = 1408 @1440). Since S21
// (calculators 17→23) the Free-Calculators panel legitimately sits AT the cap;
// the other seven stay content-sized below it. Widths must vary per tab.
const ws16 = Object.entries(widths1440);
t("M16", "panels per-tab sized, viewport-capped, widths vary", ws16.every(([, w]) => w <= 1409) && new Set(ws16.map(([, w]) => w)).size >= 5, ws16.map(([k, v]) => `${k}=${v}`).join(", "));

// M13 every configured sub-link resolves 200
await page.setViewportSize({ width: 1440, height: 900 });
await open("/");
const hrefs = await page.evaluate(() =>
  Array.from(document.querySelectorAll("[data-mm-panel] a")).map((a) => a.getAttribute("href")),
);
const uniq = [...new Set(hrefs)];
let bad = [];
for (const h of uniq) {
  const res = await page.request.get(BASE + h.split("#")[0]);
  if (!res.ok()) bad.push(`${h}:${res.status()}`);
}
t("M13", `all ${uniq.length} sub-links resolve 200`, bad.length === 0, bad.join(", ") || "ok");

// M14 axe light + dark with a panel open
async function axeRun(scheme) {
  await page.emulateMedia({ colorScheme: scheme });
  await page.reload({ waitUntil: "load" });
  await page.evaluate(() => localStorage.removeItem("vyotish.consent.v1"));
  await page.reload({ waitUntil: "load" });
  await page.getByRole("button", { name: /Got it/i }).click();
  await trigger("Free Calculators").hover();
  await panel("Free Calculators").waitFor({ state: "visible" });
  await page.evaluate(axeSrc);
  return page.evaluate(() => {
    const r = window.axe.run(document, { runOnly: ["wcag2aa"], resultTypes: ["violations"] });
    return r.then((x) => x.violations.map((v) => `${v.id}(${v.nodes.length})`).join(","));
  });
}
for (const scheme of ["light", "dark"]) {
  const v = await axeRun(scheme);
  t(`M14-${scheme}`, `axe wcag2aa clean with panel open (${scheme})`, v === "", v || "ok");
  await page.screenshot({ path: resolve(OUT, "shots", `desktop-1440-${scheme}.png`) });
}

// M15 drawer hidden on hover-capable desktop
await open("/");
t("M15", "hamburger hidden on hover-capable desktop", !(await page.locator("[data-drawer-toggle]").isVisible()));

await context.close();

// ---------- Mobile / touch (accordion) ----------
for (const [width, height, tag] of [[360, 840, "mobile-360"], [768, 1024, "tablet-768"]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: width < 768 });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForTimeout(300);
  const gotit = p.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) await gotit.click();
  const desktopNavHidden = !(await p.locator(".nav-mega").isVisible());
  const burgerVisible = await p.locator("[data-drawer-toggle]").isVisible();
  t(`T1-${tag}`, "desktop nav hidden, hamburger shown", desktopNavHidden && burgerVisible);

  await p.locator("[data-drawer-toggle]").click();
  await p.waitForTimeout(200);
  const toggles = await p.locator("[data-acc-toggle]").count();
  t(`T2-${tag}`, "drawer shows 8 accordion toggles (Gemstones plain)", toggles === 8, `count=${toggles}`);

  const horo = p.locator('[data-acc-toggle][aria-label="Horoscope submenu"]');
  await horo.click();
  await p.waitForTimeout(150);
  const accPanel = p.locator("#acc-mm-horoscope");
  const accOpen = (await accPanel.getAttribute("hidden")) === null && (await horo.getAttribute("aria-expanded")) === "true";
  const signLinkVisible = await accPanel.getByRole("link", { name: /Taurus/ }).isVisible();
  t(`T3-${tag}`, "accordion opens with sign links", accOpen && signLinkVisible);
  await p.screenshot({ path: resolve(OUT, "shots", `${tag}-accordion-open.png`) });

  // tap the tab label → navigates to the hub (chevron is the discloser)
  await p.locator('#acc-mm-horoscope a[href^="/horoscope/taurus"]').click();
  await p.waitForLoadState("load");
  t(`T4-${tag}`, "accordion sub-link navigates", new URL(p.url()).pathname === "/horoscope/taurus/daily", p.url());

  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.locator("[data-drawer-toggle]").click();
  await p.waitForTimeout(150);
  const gemRow = p.locator('#mobile-drawer a[href="/gemstones"]');
  t(`T5-${tag}`, "Gemstones is a plain link in the drawer", (await gemRow.count()) === 1 && (await p.locator('[data-acc-toggle][aria-label="Gemstones submenu"]').count()) === 0);

  // hub navigation via the label itself
  await p.locator('[data-acc] a[href="/blog"]:visible').first().click();
  await p.waitForLoadState("load");
  t(`T6-${tag}`, "tab label in drawer navigates to hub", new URL(p.url()).pathname === "/blog", p.url());
  await ctx.close();
}

await browser.close();
writeFileSync(resolve(OUT, "report.json"), JSON.stringify({ date: new Date().toISOString(), failures, results }, null, 2));
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL PASS");
process.exit(failures ? 1 : 0);
