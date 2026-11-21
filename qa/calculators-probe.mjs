// Quinn probe (BMAD Step 2): drive EVERY calculator page through the real UI
// against the live deployed backend, capture rendered rows + screenshots at
// 4 viewports + console errors + overflow checks. Writes structured evidence.
// Run: bun qa/calculators-probe.mjs   (preview server on 127.0.0.1:4321)
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:4321";
const API = "https://astro-backend.vyotish.workers.dev";
const OUT = "_bmad-output/calculators/qa";
mkdirSync(`${OUT}/shots`, { recursive: true });

const VIEWPORTS = [360, 768, 1024, 1440];

// Per-tool probe definitions: page form fields to fill + case inputs.
// Birth tools: date/time/place (place = type "Delhi", pick first suggestion).
const TOOLS = [
  { slug: "rashi", kind: "birth", case: { date: "1990-05-15", time: "10:30" } },
  { slug: "sade-sati", kind: "birth", case: { date: "1990-02-05", time: "10:30" } },
  { slug: "mangal-dosha", kind: "birth", case: { date: "1995-11-05", time: "20:38" } },
  { slug: "kaal-sarp", kind: "birth", case: { date: "2000-03-30", time: "12:00" } },
  { slug: "karakas", kind: "birth", case: { date: "1990-05-15", time: "10:30" } },
  { slug: "ishta-devata", kind: "birth", case: { date: "1990-05-15", time: "10:30" } },
  { slug: "transits", kind: "transits", case: {} },
  { slug: "moon-phase", kind: "generic", fields: { date: "2025-01-13", time: "22:27" } },
  { slug: "sun-sign", kind: "generic", fields: { date: "2025-01-14" } },
  { slug: "destiny-number", kind: "generic", fields: { date: "1970-06-19" } },
  { slug: "numerology", kind: "generic", fields: { date: "1992-03-14", name: "Sanjay" } },
  { slug: "lo-shu", kind: "generic", fields: { date: "1992-03-14" } },
  { slug: "vehicle-number", kind: "generic", fields: { date: "1992-03-14" } },
  { slug: "name-numerology", kind: "generic", fields: { name: "Sanjay Bhati" } },
  { slug: "mobile-numerology", kind: "generic", fields: { digits: "9990513999" } },
  { slug: "age", kind: "generic", fields: { date: "2000-02-29" } },
  { slug: "name-compatibility", kind: "generic", fields: { name: "Sanjay", b: "Priya" } },
  { slug: "love", kind: "generic", fields: { name: "Sanjay", b: "Priya" } },
  { slug: "friendship", kind: "generic", fields: { name: "Rohan", b: "Lenna" } },
  { slug: "flames", kind: "generic", fields: { name: "Rohan", b: "Lenna" } },
];

const results = [];

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function probeTool(t) {
  const rec = { slug: t.slug, kind: t.kind, ok: false };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
  try {
    await page.goto(`${BASE}/calculators/${t.slug}`, { waitUntil: "networkidle" });
    rec.pageTitle = await page.title();
    rec.formFields = await page.$$eval("form [name]", (els) =>
      els.map((e) => ({ name: e.name || e.dataset?.placeRole || "?", type: e.type ?? null, required: e.required ?? null, visible: !!(e.offsetParent || e.tagName === "INPUT" && e.type === "hidden" ? e.type === "hidden" ? false : true : true) }))
    );

    if (t.kind === "birth") {
      await page.fill('[name="date"]', t.case.date);
      if (t.case.time) await page.fill('[name="time"]', t.case.time);
      const place = page.locator('[data-place-field] input[type="text"], [data-place-field] input:not([type="hidden"])').first();
      await place.click();
      await place.fill("New Delhi");
      await page.waitForSelector('[data-place-list] li, [data-place-list] [role="option"], [data-place-list] *', { timeout: 8000 });
      await page.waitForTimeout(600);
      const firstOpt = page.locator('[data-place-list] [role="option"], [data-place-list] li').first();
      await firstOpt.click();
      await page.waitForTimeout(600);
      rec.placeResolved = await page.locator('[data-place-status]').first().innerText().catch(() => "?");
    } else if (t.kind === "transits") {
      const place = page.locator('[data-place-field] input:not([type="hidden"])').first();
      await place.click();
      await place.fill("New Delhi");
      await page.waitForTimeout(600);
      await page.locator('[data-place-list] [role="option"], [data-place-list] li').first().click();
      await page.waitForTimeout(600);
    } else {
      for (const [name, val] of Object.entries(t.fields)) {
        const sel = `form [name="${name}"]`;
        if ((await page.locator(sel).count()) === 0) { rec.missingField = name; continue; }
        await page.fill(sel, val);
      }
    }

    await page.click("form button[type=submit]");
    await page.waitForSelector("[data-calc-result] .grid-result, [data-calc-result] .hint.err", { timeout: 25000 });
    await page.waitForTimeout(400);
    rec.resultClass = await page.$eval("[data-calc-result]", (el) => el.firstElementChild?.className ?? "");
    rec.resultText = (await page.$eval("[data-calc-result]", (el) => el.innerText)).slice(0, 2500);
    rec.rows = await page.$$eval("[data-calc-result] .row", (rows) =>
      rows.map((r) => {
        const k = r.querySelector(".k")?.innerText ?? "";
        const v = r.querySelector(".v")?.innerText ?? "";
        const kb = r.querySelector(".k")?.getBoundingClientRect();
        const vb = r.querySelector(".v")?.getBoundingClientRect();
        return { k, v: v.slice(0, 300), kBox: kb ? { w: Math.round(kb.width), h: Math.round(kb.height), x: Math.round(kb.x) } : null, vBox: vb ? { w: Math.round(vb.width), h: Math.round(vb.height), x: Math.round(vb.x) } : null };
      })
    );
    rec.consoleErrors = consoleErrors;
    rec.ok = rec.rows.length > 0 && !rec.resultClass.includes("err");

    // screenshots at all viewports + overflow detection
    rec.shots = {};
    rec.overflow = {};
    for (const w of VIEWPORTS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      const shot = `${OUT}/shots/${t.slug}-${w}.png`;
      await page.screenshot({ path: shot, fullPage: false });
      rec.shots[w] = shot;
      rec.overflow[w] = await page.evaluate(() => {
        const d = document.documentElement;
        const overflowX = d.scrollWidth > d.clientWidth + 1;
        let firstBad = null;
        if (overflowX) {
          for (const el of document.querySelectorAll("body *")) {
            const b = el.getBoundingClientRect();
            if (b.right > d.clientWidth + 1 && b.width > 8) { firstBad = el.tagName + "." + String(el.className).slice(0, 40); break; }
          }
        }
        // vertical alignment probe on result rows
        const rows = [...document.querySelectorAll("[data-calc-result] .row")].slice(0, 6);
        const heights = rows.map((r) => Math.round(r.getBoundingClientRect().height));
        return { overflowX, firstBad, rowHeights: heights, resultBoxH: Math.round(document.querySelector("[data-calc-result]")?.getBoundingClientRect().height ?? 0) };
      });
    }
  } catch (e) {
    rec.error = String(e).slice(0, 400);
    rec.consoleErrors = consoleErrors;
    try { await page.screenshot({ path: `${OUT}/shots/${t.slug}-error.png` }); } catch {}
  }
  await ctx.close();
  results.push(rec);
  console.log(`${rec.ok ? "OK " : "ERR"} ${t.slug}: rows=${rec.rows?.length ?? 0} ${rec.error ?? ""}`);
}

for (const t of TOOLS) await probeTool(t);

// Direct API probes with Mary's exact worked-example vectors
const API_CASES = [
  { name: "rashi", url: `${API}/api/v1/calculators/rashi?date=1990-05-15&time=10:30&lat=28.6139&lng=77.2090&tz=Asia/Kolkata`, expect: "research/rashi.md fixture 1990-05-15 Delhi" },
  { name: "moon-phase FM", url: `${API}/api/v1/calculators/moon-phase?date=2025-01-13&time=22:27`, expect: "Full Moon, illumination ~1.0, next FM 2025-02-12T13:53Z, next NM 2025-01-29T12:35Z, prev NM 2024-12-30T22:27Z" },
  { name: "moon-phase NM", url: `${API}/api/v1/calculators/moon-phase?date=2025-06-25&time=10:32`, expect: "New Moon, waxing false" },
  { name: "sun-sign sankranti", url: `${API}/api/v1/calculators/sun-sign?date=2025-01-14`, expect: "rashi Makara (12:00 UTC is after 09:03 IST ingress)" },
  { name: "sun-sign pre-ingress", url: `${API}/api/v1/calculators/sun-sign?date=2025-01-13`, expect: "rashi Dhanu" },
  { name: "destiny master33", url: `${API}/api/v1/calculators/destiny-number?date=1970-06-19`, expect: "destiny 6, destiny_sum 33, master true, mulank 1, lords Venus/Sun" },
  { name: "destiny indep", url: `${API}/api/v1/calculators/destiny-number?date=1947-08-15`, expect: "destiny 8, mulank 6" },
  { name: "numerology", url: `${API}/api/v1/calculators/numerology?date=1992-03-14&name=Sanjay`, expect: "mulank 5, destiny 2, name per Chaldean" },
  { name: "lo-shu", url: `${API}/api/v1/calculators/lo-shu?date=1992-03-14`, expect: "grid of 9, classical order 4,9,2,3,5,7,8,1,6" },
  { name: "vehicle", url: `${API}/api/v1/calculators/vehicle-number?date=1992-03-14`, expect: "mulank 5 Mercury friendly set" },
  { name: "name-numerology", url: `${API}/api/v1/calculators/name-numerology?name=Sanjay%20Bhati`, expect: "Chaldean per-letter values" },
  { name: "mobile", url: `${API}/api/v1/calculators/mobile-numerology?digits=9990513999`, expect: "sum 63 root 9 Mars" },
  { name: "age", url: `${API}/api/v1/calculators/age?date=2000-02-29&now=2025-03-01`, expect: "per borrow convention in research/age-calculator.md" },
  { name: "age same-day", url: `${API}/api/v1/calculators/age?date=2000-02-29&now=2025-02-28`, expect: "edge case Feb-29 birthday" },
  { name: "name-compat", url: `${API}/api/v1/calculators/name-compatibility?a=Sanjay&b=Priya`, expect: "roots + band" },
  { name: "love", url: `${API}/api/v1/calculators/love?a=Sanjay&b=Priya`, expect: "score 55-95 + band" },
  { name: "friendship", url: `${API}/api/v1/calculators/friendship?a=Rohan&b=Lenna`, expect: "score + band" },
  { name: "flames", url: `${API}/api/v1/calculators/flames?a=Rohan&b=Lenna`, expect: "Wikipedia vector: Marriage (verify convention)" },
  { name: "flames same", url: `${API}/api/v1/calculators/flames?a=Asha&b=Asha`, expect: "n=0 convention" },
  { name: "karakas", url: `${API}/api/v1/calculators/karakas?date=1990-05-15&time=10:30&lat=28.6139&lng=77.2090&tz=Asia/Kolkata`, expect: "7 karakas descending degree" },
  { name: "ishta-devata", url: `${API}/api/v1/calculators/ishta-devata?date=1990-05-15&time=10:30&lat=28.6139&lng=77.2090&tz=Asia/Kolkata`, expect: "ishta_devata null (known gap)" },
  { name: "sade-sati", url: `${API}/api/v1/calculators/sade-sati?date=1990-02-05&time=10:30&lat=28.6139&lng=77.2090&tz=Asia/Kolkata`, expect: "Aquarius moon; Saturn in Pisces = phase 2 (2025-11-21)" },
  { name: "kaal-sarp API", url: `${API}/api/v1/kundli`, method: "POST", body: { date: "2000-03-30", time: "12:00", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" }, expect: "kaal_sarp present? type Ghatak per research" },
  { name: "kundli dasha fixture", url: `${API}/api/v1/kundli`, method: "POST", body: { date: "1990-05-15", time: "10:30", lat: 28.6139, lng: 77.2090, tz: "Asia/Kolkata" }, expect: "dasha Sun first, balance 3.6446y; lagna sign" },
  { name: "X1 mangal GET (bug)", url: `${API}/api/v1/kundli?date=1995-11-05&time=20:38&lat=19.076&lng=72.8777&tz=Asia/Kolkata`, expect: "404 GET not allowed — proves UI bug X1" },
  { name: "X2 name param (bug)", url: `${API}/api/v1/calculators/flames?name=Rohan&b=Lenna`, expect: "400 a and b required — proves UI bug X2" },
  { name: "X4 impossible date", url: `${API}/api/v1/calculators/numerology?date=2025-02-30`, expect: "silently rolls to Mar 2 (bug X4)" },
  { name: "transits", url: `${API}/api/v1/calculators/transits?lat=28.6139&lng=77.2090&tz=Asia/Kolkata`, expect: "9 grahas as_of now" },
];

const apiResults = [];
for (const c of API_CASES) {
  try {
    const init = { method: c.method ?? "GET", headers: {} };
    if (c.body) { init.body = JSON.stringify(c.body); init.headers = { "content-type": "application/json" }; }
    const r = await fetch(c.url, init);
    let j = null;
    try { j = await r.json(); } catch {}
    apiResults.push({ name: c.name, status: r.status, expect: c.expect, body: j });
    console.log(`API ${r.status} ${c.name}`);
  } catch (e) {
    apiResults.push({ name: c.name, status: "ERR", expect: c.expect, error: String(e).slice(0, 200) });
    console.log(`API ERR ${c.name}`);
  }
}

writeFileSync(`${OUT}/ui-probe.json`, JSON.stringify(results, null, 2));
writeFileSync(`${OUT}/api-probe.json`, JSON.stringify(apiResults, null, 2));
console.log(`\nWrote ${OUT}/ui-probe.json (${results.length} pages) and ${OUT}/api-probe.json (${apiResults.length} API cases)`);
await browser.close();
