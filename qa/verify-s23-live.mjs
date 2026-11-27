/**
 * S23 live verification — every horoscope page on vyotish.com must carry the
 * correct IST date/range for its period tab, in both languages.
 *
 * Checks per (sign, lang, period): the hero meta line contains the expected
 * date string (daily/yesterday/tomorrow: long weekday-date; weekly:
 * "23 Nov – 29 Nov"; monthly: "November 2026"; yearly: "2026"), computed
 * from IST "now" via the same rules the backend generator uses.
 *
 * Run: bun qa/verify-s23-live.mjs
 */
import { readFileSync, existsSync } from "node:fs";

const BASE = "https://vyotish.com";
const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];
const PERIODS = ["daily", "yesterday", "tomorrow", "weekly", "monthly", "yearly"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_HI = ["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const WD_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WD_HI = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];

// IST = UTC+5:30 fixed — no DST
const ist = new Date(Date.now() + 330 * 60 * 1000);
const y = ist.getUTCFullYear(), m = ist.getUTCMonth(), d = ist.getUTCDate(), wd = ist.getUTCDay();
const pad = (n) => String(n).padStart(2, "0");
const iso = (dt) => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
const addDays = (n) => new Date(ist.getTime() + n * 86400000);
// Monday-on-or-before of the IST today
const monday = new Date(ist.getTime() - ((wd + 6) % 7) * 86400000);
const sunday = new Date(monday.getTime() + 6 * 86400000);

const fmtLong = (dt, lang) =>
  lang === "hi"
    ? `${WD_HI[dt.getUTCDay()]}, ${dt.getUTCDate()} ${MONTHS_HI[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`
    : `${WD_EN[dt.getUTCDay()]}, ${dt.getUTCDate()} ${MONTHS_EN[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
// weekly meta line uses MONTHS_SHORT[lang] (horoscope-l10n.ts) — Hindi pages
// render Devanagari abbreviations ("23 नव – 29 नव"), EN pages Latin ones.
const MONTHS_SHORT_HI = ["जन","फर","मार्च","अप्रै","मई","जून","जुल","अग","सित","अक्टू","नव","दिस"];
const fmtShort = (dt, lang) =>
  `${dt.getUTCDate()} ${(lang === "hi" ? MONTHS_SHORT_HI : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])[dt.getUTCMonth()]}`;

const EXPECT = {
  daily: (lang) => fmtLong(ist, lang),
  yesterday: (lang) => fmtLong(addDays(-1), lang),
  tomorrow: (lang) => fmtLong(addDays(1), lang),
  weekly: (lang) => `${fmtShort(monday, lang)} – ${fmtShort(sunday, lang)}`,
  monthly: (lang) => (lang === "hi" ? `${MONTHS_HI[m]} ${y}` : `${MONTHS_EN[m]} ${y}`),
  yearly: () => `${y}`,
};

// optional staleness allowance: if qa/.s23-allow-stale exists, expected dates
// may lag by one day (used only when deliberately simulating a missed run)
const allowStale = existsSync("qa/.s23-allow-stale");

let pass = 0, fail = 0;
const failures = [];

for (const lang of ["", "hi/"]) {
  const isHi = lang !== "";
  for (const sign of SIGNS) {
    for (const period of PERIODS) {
      const url = `${BASE}/${lang}horoscope/${sign}/${period}/`;
      let html = "";
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        html = await res.text();
      } catch (e) {
        fail += 1;
        failures.push(`${url} → fetch failed: ${e.message}`);
        continue;
      }
      const want = EXPECT[period](isHi ? "hi" : "en");
      const ok = html.includes(want);
      // stale note may coexist with an older date ONLY when allowStale is set
      const hasStaleNote = html.includes("stale-note");
      if (ok && !(hasStaleNote && !allowStale)) {
        pass += 1;
      } else if (allowStale && (html.includes(fmtLong(addDays(-1), isHi ? "hi" : "en")) || hasStaleNote)) {
        pass += 1; // serving yesterday with the honesty label is acceptable here
      } else {
        fail += 1;
        const lede = html.match(/class="lede"[^>]*>([^<]*)</)?.[1] ?? "(lede missing)";
        failures.push(`${url} → expected "${want}", lede: "${lede.trim()}"${hasStaleNote ? " [stale-note present]" : ""}`);
      }
    }
  }
}

console.log(`S23 live sweep: ${pass} pass, ${fail} fail  (IST now: ${iso(ist)})`);
for (const f of failures.slice(0, 20)) console.log(`  FAIL ${f}`);
process.exit(fail === 0 ? 0 : 1);
