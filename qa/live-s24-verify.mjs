// S24 LIVE verification vs https://vyotish.com (post-push). Static HTML checks
// + one browser pass (switcher click-through + hi-nav persistence).
import { chromium } from "playwright-core";

const BASE = "https://vyotish.com";
let failures = 0;
const ok = (l) => console.log("  ok:", l);
const fail = (l) => { failures++; console.log("  FAIL:", l); };
const assert = (c, l) => (c ? ok(l) : fail(l));

async function html(path) {
  const r = await fetch(BASE + path, { redirect: "follow" });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.text();
}

console.log("1. switcher counterparts (static)");
for (const [en, hi] of [
  ["/kundli/", "/hi/kundli/"], ["/panchang/", "/hi/panchang/"], ["/muhurat/", "/hi/muhurat/"],
  ["/about/", "/hi/about/"], ["/privacy/", "/hi/privacy/"], ["/calculators/rashi/", "/hi/calculators/rashi/"],
  ["/panchang/new-delhi/", "/hi/panchang/new-delhi/"], ["/poojan/navagraha-shanti/", "/hi/poojan/navagraha-shanti/"],
]) {
  const enHtml = await html(en);
  const hiHtml = await html(hi);
  const enHas = enHtml.includes('hreflang="hi" href="' + BASE + hi.replace(/\/$/, "") + '"') || enHtml.includes(`href="${hi}"`);
  const hiHas = hiHtml.includes('hreflang="en"') && hiHtml.includes("<html lang=\"hi\"");
  assert(enHas, `${en} → hi switcher/hreflang present`);
  assert(hiHas, `${hi} → lang=hi + en hreflang present`);
}

console.log("2. hi pages carry Hindi chrome");
{
  const h = await html("/hi/kundli/");
  assert(h.includes("जन्म तिथि") || h.includes("जन्म की तिथि"), "hi kundli: Hindi form label");
  assert(h.includes("कुंडली"), "hi kundli: Hindi heading");
  const nav = await html("/hi/astrology/");
  assert(!/href="\/calculators\/(?!name-compatibility)/.test(nav) || nav.includes("/hi/calculators/"), "hi astrology: nav links stay /hi");
}

console.log("3. blog stays EN, no fabricated hi article links");
{
  const art = await html("/blog/why-the-vedic-day-begins-at-sunrise/");
  assert(art.includes('<html lang="en"'), "blog article: lang=en");
  assert(!art.includes('hreflang="hi"'), "blog article: no hi hreflang");
  assert(!/href="\/hi\/blog\/[a-z-]+"/.test(art), "blog article: no /hi/article links");
}

console.log("4. sitemap live reciprocity");
{
  const r = await fetch(BASE + "/sitemap.xml");
  const xml = await r.text();
  const hiK = xml.slice(xml.indexOf("<loc>https://vyotish.com/hi/kundli</loc>"));
  const entry = hiK.slice(0, hiK.indexOf("</url>") + 6);
  assert(entry.includes('hreflang="en" href="https://vyotish.com/kundli"'), "hi/kundli entry: en alternate → EN twin");
  assert(entry.includes('hreflang="hi" href="https://vyotish.com/hi/kundli"'), "hi/kundli entry: hi alternate → self");
  const pairHi = (xml.match(/<loc>https:\/\/vyotish\.com\/hi\/compatibility\/[a-z]+\/[a-z]+<\/loc>/g) ?? []).length;
  assert(pairHi === 78, `sitemap: 78 HI pair locs (got ${pairHi})`);
}

console.log("5. browser pass — switcher click-through + hi persistence");
{
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(BASE + "/kundli/", { waitUntil: "load", timeout: 60000 });
  // click the visible language switcher (utility bar link to the hi twin)
  const hiLink = page.locator('[data-lang-switcher] a[hreflang="hi"], [data-lang-switcher] a[href^="/hi/"]').first();
  await hiLink.click({ timeout: 10000 });
  await page.waitForLoadState("load");
  assert(page.url().includes("/hi/kundli"), `EN kundli → click switcher lands /hi/kundli (got ${page.url()})`);
  // navigate via header tab — must stay hi
  await page.locator('header a[href^="/hi/panchang"]').first().click({ timeout: 10000 });
  await page.waitForLoadState("load");
  assert(page.url().includes("/hi/panchang"), `hi nav → /hi/panchang (got ${page.url()})`);
  const lang = await page.getAttribute("html", "lang");
  assert(lang === "hi", "nav result: html lang=hi");
  // back to EN via switcher
  const enLink = page.locator('[data-lang-switcher] a[hreflang="en"], [data-lang-switcher] a:not([href^="/hi/"])').first();
  await enLink.click({ timeout: 10000 });
  await page.waitForLoadState("load");
  assert(!page.url().includes("/hi/"), `switch back → EN (got ${page.url()})`);
  await browser.close();
}

console.log(failures === 0 ? "\nLIVE VERIFY: ALL PASS" : `\nLIVE VERIFY: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
