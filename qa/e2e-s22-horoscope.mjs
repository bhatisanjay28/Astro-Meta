// S22 — Horoscope 4 owner fixes: baked-page verification for both languages.
// Covers: (1) reviewer sentence gone + trust card intact, (2) home widget tab
// → sign-card href carries the period (today→daily, others 1:1) on BOTH homes,
// (3) picker chips show zodiac EN + Devanagari name on all 144 pages,
// (4) /hi/horoscope/* renders Hindi chrome + Hindi content, exact switcher
// counterparts, hreflang pairs, and clean layouts at 360/768/1024/1440.
// Run: build + `bun run preview` on :4321 first, then `bun qa/e2e-s22-horoscope.mjs`
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.HZ_BASE ?? "http://127.0.0.1:4321";
const SHOTS = resolve(__dirname, "../_bmad-output/s22-horoscope-4fixes/shots");
mkdirSync(SHOTS, { recursive: true });
const axeSrc = readFileSync(resolve(__dirname, "node_modules/axe-core/axe.min.js"), "utf8");

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];
const PERIODS = ["yesterday", "daily", "tomorrow", "weekly", "monthly", "yearly"];
const PERIOD_HI = {
  yesterday: "बीते कल", daily: "आज", tomorrow: "कल",
  weekly: "साप्ताहिक", monthly: "मासिक", yearly: "वार्षिक",
};
const SIGN_HI = {
  aries: "मेष", taurus: "वृषभ", gemini: "मिथुन", cancer: "कर्क", leo: "सिंह",
  virgo: "कन्या", libra: "तुला", scorpio: "वृश्चिक", sagittarius: "धनु",
  capricorn: "मकर", aquarius: "कुम्भ", pisces: "मीन",
};
const SIGN_EN = {
  aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer", leo: "Leo",
  virgo: "Virgo", libra: "Libra", scorpio: "Scorpio", sagittarius: "Sagittarius",
  capricorn: "Capricorn", aquarius: "Aquarius", pisces: "Pisces",
};

let failures = 0;
const ok = (label) => console.log("  ok:", label);
const fail = (label) => { failures++; console.log("  FAIL:", label); };
const assert = (cond, label) => (cond ? ok(label) : fail(label));

// ---------- static HTML sweep over all 144 sign×period pages (no browser) ----------
async function fetchText(path) {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(`http ${r.status} for ${path}`);
  return r.text();
}

console.log("1. static sweep — 144 sign×period pages (EN + HI)");
let sweepFail = 0;
for (const lang of ["", "/hi"]) {
  for (const s of SIGNS) {
    for (const p of PERIODS) {
      const path = `${lang}/horoscope/${s}/${p}/`;
      const html = await fetchText(path);
      const hi = lang !== "";
      const label = `${path}`;
      const checks = [
        [!html.includes("Panel reviewer names"), "no reviewer sentence"],
        [/class="card trust"/.test(html) && /class="card trust"[\s\S]*?<h2[\s>]/.test(html), "trust card keeps h2"],
        [(html.match(/class="sname"/g) ?? []).length === 12, `12 zodiac chips (${hi ? "hi" : "en"})`],
        [(html.match(/class="sname hi" lang="hi"/g) ?? []).length === 12, "12 Devanagari chips"],
        [html.includes(`>${SIGN_EN[s]}<`), "zodiac EN name present"],
        [html.includes(SIGN_HI[s]), "Devanagari sign name present"],
        [/rel="alternate" hreflang="en"/.test(html) && /rel="alternate" hreflang="hi"/.test(html), "hreflang pair"],
      ];
      if (hi) {
        checks.push(
          [html.includes('<html lang="hi"'), "html lang=hi"],
          [html.includes("सभी 12 राशियाँ"), "picker h2 Hindi"],
          [html.includes(PERIOD_HI[p]), `period label Hindi (${p})`],
          [html.includes(SIGN_HI[s] + " राशिफल") || html.includes("राशिफल — " + SIGN_HI[s]), "h1 Hindi wording"],
          [html.includes(`href="/horoscope/${s}/${p}/"`), "switcher EN counterpart"],
        );
      } else {
        checks.push(
          [html.includes('<html lang="en"'), "html lang=en"],
          [html.includes("All 12 Signs"), "picker h2 EN"],
          [html.includes(`href="/hi/horoscope/${s}/${p}/"`), "switcher HI counterpart"],
        );
      }
      const bad = checks.filter(([c]) => !c).map(([, l]) => l);
      if (bad.length) { sweepFail++; fail(`${label} → ${bad.join("; ")}`); }
    }
  }
}
if (!sweepFail) ok("all 144 pages pass the static sweep");
else fail(`${sweepFail} pages failed the static sweep`);

// hubs
{
  const en = await fetchText("/horoscope/");
  const hi = await fetchText("/hi/horoscope/");
  assert(!en.includes("Panel reviewer names") && !hi.includes("Panel reviewer names"), "hubs: no reviewer sentence");
  assert((hi.match(/\/hi\/horoscope\/\w+\/daily/g) ?? []).length >= 12, "hi hub: 12 sign cards under /hi");
  assert(hi.includes("आज का राशिफल →"), "hi hub: Hindi CTA");
  assert(en.includes('href="/hi/horoscope/"') || hi.includes('href="/horoscope/"'), "hubs: switcher counterparts");
  assert(await fetchText("/hi/").then((h) => h.includes('id="horoscope"') && h.includes("दैनिक, साप्ताहिक और वार्षिक राशिफल")), "hi home: Hindi widget section present");
  assert(await fetchText("/hi/").then((h) => h.includes('href="/hi/horoscope/aries/daily"')), "hi home: widget cards link /hi/horoscope");
  // S24 supersedes the S22 phased-rollout note: the whole site is Hindi now,
  // so the "राशिफल अब हिन्दी में उपलब्ध है" banner was removed. Assert its
  // absence plus the surviving honest-replacement signals.
  assert(
    !(await fetchText("/hi/")).includes("हिन्दी बिल्ड चरणबद्ध है"),
    "hi home: obsolete phased note removed (S24)",
  );
  assert(
    await fetchText("/hi/").then((h) => h.includes("वैदिक राशिफल") || h.includes("राशिफल")),
    "hi home: horoscope widget copy is Hindi",
  );
}

// ---------- browser: interactive behaviour + layout + axe ----------
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
async function open(path) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(300);
  const gotit = page.getByRole("button", { name: /Got it/i });
  if (await gotit.isVisible().catch(() => false)) {
    await gotit.click();
    await page.waitForTimeout(200);
  }
}

console.log("2. item 2 — home widget tab → card href carries period");
{
  await open("/");
  const tabToSlug = { Monthly: "monthly", Today: "daily", Yesterday: "yesterday", Tomorrow: "tomorrow", Weekly: "weekly", Yearly: "yearly" };
  let carryFail = 0;
  for (const [tab, slug] of Object.entries(tabToSlug)) {
    await page.locator('#horoscope [role="tab"]', { hasText: tab }).first().click();
    await page.waitForTimeout(120);
    const hrefs = await page.$$eval('#horoscope [data-sign]', (els) => els.map((e) => e.getAttribute("href")));
    const want = `/horoscope/aries/${slug}`;
    if (hrefs.length === 12 && hrefs.every((h) => h.endsWith(`/${slug}`))) ok(`${tab} → all 12 cards end /${slug}`);
    else { carryFail++; fail(`${tab} → want ${want}, got ${hrefs[0]}`); }
  }
  if (!carryFail) ok("EN home: all 6 tabs carry their period to all 12 sign cards");

  await open("/hi/");
  const hiTabToSlug = { "मासिक": "monthly", "आज": "daily", "साप्ताहिक": "weekly" };
  let hiFail = 0;
  for (const [tab, slug] of Object.entries(hiTabToSlug)) {
    await page.locator('#horoscope [role="tab"]', { hasText: tab }).first().click();
    await page.waitForTimeout(120);
    const href = await page.getAttribute('[data-sign="leo"]', "href");
    if (href === `/hi/horoscope/leo/${slug}`) ok(`hi home ${tab} → leo /${slug}`);
    else { hiFail++; fail(`hi home ${tab} → got ${href}`); }
  }
  if (!hiFail) ok("HI home: tabs carry period under /hi/horoscope");
}

console.log("3. hi page — content language, Devanagari font, axe");
{
  await open("/hi/horoscope/leo/daily/");
  const h1 = await page.textContent("h1");
  assert(h1.includes("आज का") && h1.includes("सिंह"), "hi h1: आज का राशिफल — सिंह");
  const lang = await page.getAttribute("html", "lang");
  assert(lang === "hi", "html lang=hi");
  const fontHi = await page.$eval("section.hzd, section.hz", (el) => getComputedStyle(el).fontFamily);
  assert(/Devanagari/i.test(fontHi), "hi page body font is Devanagari face");
  const crumbs = await page.textContent(".crumbs");
  assert(crumbs.includes("राशिफल"), "crumbs Hindi");
  const chips = await page.$$eval(".periods .chip", (els) => els.map((e) => e.textContent.trim()));
  assert(chips.join("|").includes("साप्ताहिक") && chips.join("|").includes("मासिक"), "period chips Hindi");
  const payloadHi = (await page.content()).includes("सारांश");
  const unavailable = (await page.textContent(".hzd")).includes("तैयार हो रही है");
  assert(payloadHi || unavailable, "hi content: Hindi payload sections or honest unavailable");
  // switcher cross-links back to the EN counterpart
  const enHref = await page.getAttribute('a:has-text("English")', "href");
  assert(enHref === "/horoscope/leo/daily/", "switcher EN link is exact counterpart");
  // axe strict, both themes
  for (const theme of ["light", "dark"]) {
    await page.evaluate((t) => {
      const root = document.documentElement;
      if (t === "dark") { root.setAttribute("data-theme", "dark"); root.classList.add("dark"); }
      else { root.removeAttribute("data-theme"); root.classList.remove("dark"); }
    }, theme);
    await page.waitForTimeout(150);
    await page.addScriptTag({ content: axeSrc });
    const res = await page.evaluate(() => window.axe.run(document, { resultTypes: ["violations"] }));
    assert(res.violations.length === 0, `axe ${theme} /hi/horoscope/leo/daily/ — ${res.violations.length} violation(s)`);
  }
}

console.log("4. layout sweep — 360/768/1024/1440, EN + HI (no horizontal overflow)");
{
  const targets = [
    { path: "/horoscope/leo/daily/", name: "en-leo-daily" },
    { path: "/hi/horoscope/leo/daily/", name: "hi-leo-daily" },
    { path: "/hi/horoscope/leo/yearly/", name: "hi-leo-yearly" },
    { path: "/hi/horoscope/", name: "hi-hub" },
    { path: "/hi/", name: "hi-home" },
  ];
  const widths = [360, 768, 1024, 1440];
  let overflow = 0;
  for (const t of targets) {
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: Math.round(w * 1.8) });
      await open(t.path);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      const iw = await page.evaluate(() => window.innerWidth);
      if (sw > iw + 1) { overflow++; fail(`${t.name} @${w}: scrollWidth ${sw} > ${iw}`); }
      await page.screenshot({ path: resolve(SHOTS, `${t.name}-${w}.png`), fullPage: true });
    }
  }
  if (!overflow) ok(`no horizontal overflow at 360/768/1024/1440 across ${targets.length} pages (shots written)`);
}

await browser.close();
console.log(failures === 0 ? "\nALL PASS (S22)" : `\nFAILURES: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
