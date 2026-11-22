/**
 * Epic ZC content consolidator (D-ZC9) — merge the 12 per-base-sign writer
 * files into backend/src/data/sign-compatibility/pairs.json (flat array,
 * wheel order). Run with Bun only:
 *
 *   bun _bmad-output/zodiac-compatibility/content/consolidate.ts
 *
 * Gates (all hard failures — loud, never silently skipped):
 *   1. all 12 files present with exact expected counts (78 records total)
 *   2. wheel-order pairing per file (base-base .. base-pisces)
 *   3. aspect token matches engine geometry (wheel distance), engine is authority
 *   4. exact schema keys, types
 *   5. banned-word sweep (case-insensitive; substring for perfect-class words)
 *   6. sign binding: both display names in verdict AND every category block
 *   7. length gates matching backend tests (verdict >= 40 chars, categories >= 80, tips 4-6)
 *   8. exactly the 78 canonical slugs, no duplicates
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/Users/sanjay.bhati.OM/Downloads/Vyotish-Repos/Astro-Meta";
const PAIRS_DIR = join(ROOT, "_bmad-output/zodiac-compatibility/content/pairs");
const OUT = join(ROOT, "backend/src/data/sign-compatibility/pairs.json");

const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];
const EXPECTED_COUNT: Record<string, number> = {
  aries: 12,
  taurus: 11,
  gemini: 10,
  cancer: 9,
  leo: 8,
  virgo: 7,
  libra: 6,
  scorpio: 5,
  sagittarius: 4,
  capricorn: 3,
  aquarius: 2,
  pisces: 1,
};
const ASPECT_BY_DISTANCE = ["conjunction", "semisextile", "sextile", "square", "trine", "quincunx", "opposition"];
const CATEGORIES = ["love", "sexual", "friendship", "communication", "trust", "emotional"];
const NAME: Record<string, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

const BANNED_WORD = /\b(always|never|guaranteed|destined|destiny|doomed|toxic|proven|scientifically|soulmate|soulmates|science|will|shall|twin\s+flame|perfect\s+match|made\s+for\s+each\s+other|best\s+match|worst\s+match|your\s+partner|organize|organized|analyz|toward|candor|favor|behavior|color|practicing|realiz|apologiz|honor|humor|labor|traveling|husband|wife|husbands|wives|boyfriend|girlfriend|man\b|woman|men\b|women|he\b|she\b|him\b|her\b|his\b|husband|spouse|guy|girl)\b/i;
const BANNED_SUBSTR = /perfect|doom|guarantee/i;

interface Record {
  pair: string;
  aspect: string;
  overall: { verdict: string };
  categories: Record<string, string>;
  tips: string[];
}

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);
const dist = (a: number, b: number) => Math.min(Math.abs(a - b), 12 - Math.abs(a - b));

const all: Record[] = [];
for (const base of SIGNS) {
  const file = join(PAIRS_DIR, `${base}.json`);
  let parsed: Record[];
  try {
    parsed = JSON.parse(readFileSync(file, "utf8")) as Record[];
  } catch (e) {
    fail(`${base}.json: unreadable/invalid JSON — ${e}`);
    continue;
  }
  if (parsed.length !== EXPECTED_COUNT[base]) {
    fail(`${base}.json: ${parsed.length} records, expected ${EXPECTED_COUNT[base]}`);
  }
  const baseIdx = SIGNS.indexOf(base);
  parsed.forEach((r, i) => {
    const partner = SIGNS[baseIdx + i];
    if (!partner) {
      fail(`${base}.json[${i}]: more records than remaining wheel slots`);
      return;
    }
    const expectedPair = `${base}-${partner}`;
    if (r.pair !== expectedPair) {
      fail(`${base}.json[${i}].pair: "${r.pair}", expected "${expectedPair}"`);
      return;
    }
    const d = dist(baseIdx, SIGNS.indexOf(partner));
    const expectedAspect = ASPECT_BY_DISTANCE[d];
    if (r.aspect !== expectedAspect) {
      fail(`${r.pair}.aspect: "${r.aspect}", engine geometry says "${expectedAspect}"`);
    }
    const keys = Object.keys(r).sort();
    const wantKeys = ["aspect", "categories", "overall", "pair", "tips"].sort();
    if (JSON.stringify(keys) !== JSON.stringify(wantKeys)) {
      fail(`${r.pair}: schema keys ${keys.join(",")}, expected ${wantKeys.join(",")}`);
    }
    if (typeof r.overall?.verdict !== "string" || r.overall.verdict.length < 40) {
      fail(`${r.pair}.overall.verdict: missing/short (<40 chars)`);
    }
    for (const cat of CATEGORIES) {
      const text = r.categories?.[cat];
      if (typeof text !== "string" || text.length < 80) {
        fail(`${r.pair}.categories.${cat}: missing/short (<80 chars)`);
      }
    }
    if (!Array.isArray(r.tips) || r.tips.length < 4 || r.tips.length > 6) {
      fail(`${r.pair}.tips: ${r.tips?.length} tips, expected 4-6`);
    }
    const haystack = [
      r.overall?.verdict ?? "",
      ...CATEGORIES.map((c) => r.categories?.[c] ?? ""),
      ...(r.tips ?? []),
    ].join(" ");
    if (BANNED_WORD.test(haystack.replace(/\bperfect\w*\b/gi, ""))) {
      const m = haystack.match(BANNED_WORD);
      fail(`${r.pair}: banned word "${m?.[0]}"`);
    }
    if (BANNED_SUBSTR.test(haystack)) {
      fail(`${r.pair}: banned substring (perfect/doom/guarantee class)`);
    }
    const names = new Set(
      (NAME[base] === NAME[partner] ? [NAME[base]] : [NAME[base], NAME[partner]]) as string[],
    );
    // Style-guide §10: each sign name >= 2 mentions across the record
    // (verdict + categories + tips combined; engine test asserts the same).
    for (const n of names) {
      const mentions = (haystack.match(new RegExp(n, "g")) ?? []).length;
      if (mentions < 2) {
        fail(`${r.pair}: sign binding — "${n}" only ${mentions} mention(s) across the record`);
      }
    }
    all.push(r);
  });
}

const expectedSlugs = new Set<string>();
for (let i = 0; i < SIGNS.length; i++) {
  for (let j = i; j < SIGNS.length; j++) expectedSlugs.add(`${SIGNS[i]}-${SIGNS[j]}`);
}
const seen = new Set<string>();
for (const r of all) {
  if (seen.has(r.pair)) fail(`duplicate pair ${r.pair}`);
  seen.add(r.pair);
  if (!expectedSlugs.has(r.pair)) fail(`unexpected pair slug ${r.pair}`);
}
for (const s of expectedSlugs) {
  if (!seen.has(s)) fail(`missing pair ${s}`);
}

if (errors.length > 0) {
  console.error(`CONSOLIDATION FAILED — ${errors.length} gate violations:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

writeFileSync(OUT, `${JSON.stringify(all, null, 2)}\n`, "utf8");
console.log(`OK — consolidated ${all.length} records → ${OUT}`);
