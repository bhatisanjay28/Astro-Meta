/**
 * Epic ZC originality gate (D-ZC7) — ≥6-gram overlap check between shipped
 * content and every source the writers could have echoed (internal research
 * docs + optionally an external corpus fetched into ../research/corpus/).
 *
 *   bun _bmad-output/zodiac-compatibility/content/originality.ts
 *
 * A shared 6-gram (case/punctuation-normalised) is a paraphrase-drift signal;
 * whitelisted astrological fact phrases (sign names, ruler names, "mutual
 * detriment" etc.) are trimmed before comparison. Any hit > 4 shared 6-grams
 * in one record fails the gate.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/Users/sanjay.bhati.OM/Downloads/Vyotish-Repos/Astro-Meta";
const ZC = join(ROOT, "_bmad-output/zodiac-compatibility");
const PAIRS_DIR = join(ZC, "content/pairs");
const CORPUS_DIR = join(ZC, "research/corpus");

const INTERNAL_SOURCES = [
  join(ZC, "research/mary-research.md"),
  join(ZC, "research/pair-matrix.md"),
  join(ZC, "research/astrotalk-comparison.md"),
];

const STOP = new Set([
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio",
  "sagittarius", "capricorn", "aquarius", "pisces", "astrology", "astrologer",
  "muhurat", "kundli", "vyotish", "astrotalk",
]);

function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP.has(w));
}

function ngrams(words: string[], n: number): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

const N = 6;
const corpusFiles = [...INTERNAL_SOURCES];
if (existsSync(CORPUS_DIR)) {
  for (const f of readdirSync(CORPUS_DIR)) corpusFiles.push(join(CORPUS_DIR, f));
}
const corpusGrams = new Set<string>();
for (const f of corpusFiles) {
  if (!existsSync(f)) continue;
  for (const g of ngrams(normalise(readFileSync(f, "utf8")), N)) corpusGrams.add(g);
}

const errors: string[] = [];
let checked = 0;
for (const base of ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]) {
  const file = join(PAIRS_DIR, `${base}.json`);
  if (!existsSync(file)) continue;
  const records = JSON.parse(readFileSync(file, "utf8")) as Array<{
    pair: string;
    overall: { verdict: string };
    categories: Record<string, string>;
    tips: string[];
  }>;
  for (const r of records) {
    checked++;
    const text = [r.overall.verdict, ...Object.values(r.categories), ...r.tips].join(" ");
    const grams = [...ngrams(normalise(text), N)];
    const hits = grams.filter((g) => corpusGrams.has(g));
    if (hits.length > 4) {
      errors.push(`${r.pair}: ${hits.length} shared 6-grams, e.g. "${hits[0]}"`);
    } else if (hits.length > 0) {
      console.log(`  note ${r.pair}: ${hits.length} shared 6-gram(s): ${hits.join(" | ")}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`ORIGINALITY GATE FAILED — ${errors.length} records:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`OK — ${checked} records checked against ${corpusFiles.filter(existsSync).length} source file(s); no paraphrase clusters.`);
