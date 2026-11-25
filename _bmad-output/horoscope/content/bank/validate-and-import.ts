/**
 * Phrase-bank validator + Supabase importer (library-structure.md contract,
 * style-guide §3 banned list, §8 length bounds).
 *
 * Usage (from this directory):
 *   bun validate-and-import.ts lint     # structure + language checks only
 *   bun validate-and-import.ts import   # lint + trigram originality + upsert
 *
 * Import target: horoscope_library (migration 0013), unique key
 * (slot, condition, lang, variant_no), Prefer: resolution=merge-duplicates.
 * Credentials: reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from
 * backend/.env — never printed.
 */
import { readdirSync, readFileSync } from "node:fs";
import { allRows } from "./index";
import type { BankRow } from "./types";

// ---------- banned tokens (style-guide §3) ----------
// EN: word-boundary, case-insensitive. HI: substring on the raw text.
const EN_BANNED = [
  // legal / financial directives
  "invest", "invests", "invested", "investing", "investment", "investments",
  "buy", "buys", "buying", "bought", "sell", "sells", "selling", "sold",
  "shares", "lawsuit", "litigation",
  // absolutes & guarantees
  "always", "never", "definitely", "guarantee", "guaranteed", "certainly",
  "impossible", "cannot",
  // fear words
  "danger", "dangerous", "beware", "disaster", "doom", "doomed", "unlucky",
  "cursed", "curse", "misfortune", "catastrophe", "ruin", "fear", "afraid",
  "suffer", "suffering", "struggle", "struggling", "failure",
  // sade-sati fear coupling / shaming
  "punishment", "punished",
  // medical
  "illness", "disease", "cure", "medication", "symptom", "symptoms",
  "diagnosis", "treatment",
  // determinism
  "destiny",
];
// EN tokens the guide restricts by context (compulsion / outcome) — reviewed manually.
const EN_WARN = ["will", "must", "tax", "taxes", "taxed", "loss", "losses", "warning", "threat"];
const HI_BANNED = [
  "निवेश", "खरीदें", "खरीदिए", "ख़रीदें", "बेचें", "बेचिए", "बेचना",
  "हमेशा", "कभी नहीं", "गारंटी", "निश्चित रूप से", "असंभव", "नहीं सकते",
  "ख़तरा", "खतरा", "खतरनाक", "आफ़त", "विनाश", "अभिशाप", "श्राप", "अभिशप्त",
  "असफलता", "संघर्ष", "सज़ा-ए", "बीमारी", "इलाज",
  "लक्षण", "पट्टी", "बैंड", "अर्हता", "मुद्र्रा",
];
// Devanagari: JS \b is ASCII-only, so tokens use Unicode property escapes.
// Devanagari matras are \p{M} (marks), NOT \p{L} — guard must exclude both,
// else अंदर/अन्दर/निडर/निरोग (matra-preceded) slip through.
const NOT_WORD = "[\\p{L}\\p{M}]";
const HI_BANNED_RES = [
  new RegExp(`(?<!${NOT_WORD})ज़रूर(?!${NOT_WORD})`, "gu"), // ज़रूर, not ज़रूरी/ज़रूरत
  new RegExp(`(?<!${NOT_WORD})डर`, "gu"), // डर/डरते/डरना, not अंदर/अन्दर/निडर
  new RegExp(`(?<!${NOT_WORD})दंड`, "gu"), // दंड/दंडित, not मापदंड
  new RegExp(`(?<!${NOT_WORD})रोग`, "gu"), // रोग/रोगी, not निरोग
  new RegExp(`(?<!${NOT_WORD})दवा`, "gu"), // दवा, not compounds
];
const HI_WARN = ["सजा", "खरीद", "नुकसान"];

// ---------- §8 length bounds (words) ----------
// One range per slot, applied to both langs — HI rows are authored to fit the
// same range (they run slightly shorter, so EN floors govern).
const BOUNDS: Record<string, [number, number]> = {
  "clause.pos": [8, 16],
  "clause.neg": [8, 16],
  "clause.closing": [3, 10],
  "yearly.overview": [100, 150],
  "daily.overview": [35, 65], // §8 has no daily-overview row; lead paragraph between category and weekly-overview
  "weekly.overview": [50, 80],
  "monthly.overview": [80, 120],
  "thought": [12, 20],
  "dos": [4, 10],
  "donts": [4, 10],
  default: [90, 140], // yearly.<area>
};
const DAILY_AREA: [number, number] = [35, 55]; // §8 daily category paragraph
const WEEKLY_AREA: [number, number] = [45, 70]; // §8 weekly category paragraph
const MONTHLY_AREA: [number, number] = [60, 90]; // §8 monthly area section
for (const a of ["career", "money", "love", "education", "family", "health"]) {
  BOUNDS[`daily.${a}`] = DAILY_AREA;
  BOUNDS[`weekly.${a}`] = WEEKLY_AREA;
  BOUNDS[`monthly.${a}`] = MONTHLY_AREA;
}
const VARIANT_MIN: Record<string, number> = {
  "clause.pos": 6, "clause.neg": 6, "clause.closing": 6,
  "yearly.overview": 3, default: 3, // yearly.<area>
  "daily.overview": 4, "weekly.overview": 4, "monthly.overview": 4,
  "thought": 4, "dos": 4, "donts": 4,
};

const isClauseFragment = (slot: string) => slot === "clause.pos" || slot === "clause.neg";
const wordCount = (t: string) => t.trim().split(/\s+/).length;
const enWordRe = (w: string) => new RegExp(`\\b${w}\\b`, "i");

interface Finding { level: "error" | "warn"; where: string; msg: string }

function lint(): Finding[] {
  const f: Finding[] = [];
  const seen = new Map<string, string>(); // slot|cond|text -> first location (duplicate check)
  const condVariants = new Map<string, number>();

  for (const row of allRows) {
    const where = `${row.slot} [${row.condition}] ${row.lang}#${row.variant_no}`;
    const t = row.text;
    const words = wordCount(t);
    const bounds = BOUNDS[row.slot] ?? BOUNDS.default!;
    if (words < bounds[0] || words > bounds[1]) {
      f.push({ level: "error", where, msg: `length ${words} outside §8 bounds ${bounds[0]}–${bounds[1]}` });
    }
    if (t.includes("!")) f.push({ level: "error", where, msg: "exclamation mark" });
    if (isClauseFragment(row.slot)) {
      if (t.includes(";")) f.push({ level: "error", where, msg: "fragment contains ';'" });
      if (t.includes(" — ")) f.push({ level: "error", where, msg: "fragment contains ' — '" });
      if (/[।.]$/.test(t.trim())) f.push({ level: "error", where, msg: "fragment ends with terminal punctuation" });
      if (!t.includes("{planet}") || !t.includes("{house}")) {
        f.push({ level: "error", where, msg: "fragment missing {planet}/{house} token" });
      }
    } else if (row.slot === "clause.closing") {
      // composer joins "pos; neg — closing"; closings carry no trailing period (clauses header contract)
      if (t.includes(";")) f.push({ level: "error", where, msg: "closing contains ';'" });
      if (t.includes(" — ")) f.push({ level: "error", where, msg: "closing contains ' — '" });
      if (/[।.]$/.test(t.trim())) f.push({ level: "error", where, msg: "closing ends with terminal punctuation" });
      if (t.includes("{planet}") || t.includes("{house}")) {
        f.push({ level: "error", where, msg: "closing carries {planet}/{house} token" });
      }
    } else {
      if (t.includes("{planet}") || t.includes("{house}")) {
        f.push({ level: "error", where, msg: "non-fragment row carries {planet}/{house} token" });
      }
      if (!/[।.]$/.test(t.trim())) {
        f.push({ level: "error", where, msg: "paragraph missing terminal . / ।" });
      }
    }
    for (const w of EN_BANNED) {
      if (enWordRe(w).test(t)) f.push({ level: "error", where, msg: `EN banned token: ${w}` });
    }
    for (const w of EN_WARN) {
      if (enWordRe(w).test(t)) f.push({ level: "warn", where, msg: `EN review token: ${w}` });
    }
    for (const w of HI_BANNED) {
      if (t.includes(w)) f.push({ level: "error", where, msg: `HI banned token: ${w}` });
    }
    for (const re of HI_BANNED_RES) {
      re.lastIndex = 0;
      if (re.test(t)) f.push({ level: "error", where, msg: `HI banned token: /${re.source}/` });
    }
    for (const w of HI_WARN) {
      if (t.includes(w)) f.push({ level: "warn", where, msg: `HI review token: ${w}` });
    }
    const dupKey = `${row.slot}|${row.condition}|${t}`;
    const first = seen.get(dupKey);
    if (first) f.push({ level: "error", where, msg: `duplicate text of ${first}` });
    seen.set(dupKey, where);
    const vKey = `${row.slot}|${row.condition}|${row.lang}`;
    condVariants.set(vKey, (condVariants.get(vKey) ?? 0) + 1);
  }

  // expected full coverage — every condition authored, variant counts exact
  // (library-structure.md §3–§4 contract; dos/donts carry only the flavour the
  // composer serves — constructive in dos, deferring in donts — so no dead rows)
  const expected = new Map<string, number>();
  const RATINGS = ["excellent", "good", "moderate", "challenging"];
  const RETROS = ["none", "review"];
  for (const lang of ["en", "hi"] as const) {
    for (const p of ["Jupiter", "Saturn", "Rahu"]) {
      for (const b of ["fav", "neutral", "unfav"]) {
        expected.set(`clause.pos|planet=${p}.band=${b}|${lang}`, 6);
        expected.set(`clause.neg|planet=${p}.band=${b}|${lang}`, 6);
      }
    }
    for (const r of RATINGS) {
      expected.set(`clause.closing|rating=${r}|${lang}`, 6);
      expected.set(`yearly.overview|rating=${r}|${lang}`, 3);
    }
    for (const r of RATINGS) {
      for (const retro of RETROS) {
        expected.set(`daily.overview|rating=${r}.retro=${retro}|${lang}`, 4);
        expected.set(`weekly.overview|rating=${r}.retro=${retro}|${lang}`, 4);
        expected.set(`monthly.overview|rating=${r}.retro=${retro}|${lang}`, 4);
      }
    }
    for (const house of ["1","2","3","4","5","6","7","8","9","10","11","12"]) {
      expected.set(`dos|house=${house}.flavour=constructive|${lang}`, 4);
      expected.set(`donts|house=${house}.flavour=deferring|${lang}`, 4);
      for (const r of RATINGS) {
        expected.set(`thought|theme=${house}.tone=${r}|${lang}`, 4);
      }
    }
  }
  const yearlyAreas = ["business", "career", "children", "education", "family", "health", "love", "marriage", "wealth"];
  const periodAreas = ["career", "money", "love", "education", "family", "health"];
  const PB: Record<string, string[]> = { health: ["fav", "neutral", "unfav", "chandrashtama"], default: ["fav", "neutral", "unfav"] };
  for (const lang of ["en", "hi"] as const) {
    for (const area of yearlyAreas) {
      for (const r of RATINGS) {
        for (const d of ["jupiter-good", "saturn-phase", "rahu-axis", "mixed", "steady"]) {
          expected.set(`yearly.${area}|rating=${r}.driver=${d}|${lang}`, 3);
        }
      }
    }
    for (const period of ["daily", "weekly", "monthly"]) {
      const v = period === "daily" ? 6 : 4;
      for (const area of periodAreas) {
        for (const r of RATINGS) {
          for (const pb of PB[area] ?? PB.default!) {
            for (const retro of RETROS) {
              expected.set(`${period}.${area}|rating=${r}.pb=${pb}.retro=${retro}|${lang}`, v);
            }
          }
        }
      }
    }
  }
  for (const [key, want] of expected) {
    const got = condVariants.get(key) ?? 0;
    const [slot, , lang] = key.split("|");
    const min = VARIANT_MIN[slot] ?? VARIANT_MIN.default!;
    if (got < min) f.push({ level: "error", where: key, msg: `only ${got} variants (need ≥${min})` });
    if (got !== want) f.push({ level: "error", where: key, msg: `has ${got} variants, expected exactly ${want}` });
  }
  // unexpected conditions
  for (const [key, got] of condVariants) {
    if (!expected.has(key)) f.push({ level: "error", where: key, msg: `unexpected condition with ${got} rows` });
  }
  // global total — clause 132 + yearly 552 + daily 944 + weekly 640 + monthly 640
  //               + thought 192 + dos 48 + donts 48 = 3,196 per lang
  const wantTotal = 2 * 3196;
  if (allRows.length !== wantTotal) {
    f.push({ level: "error", where: "total", msg: `${allRows.length} rows, expected ${wantTotal}` });
  }
  return f;
}

// ---------- trigram originality vs originality/fetch/ ----------
function loadCorpusTrigrams(): Set<string> {
  const dir = new URL("../originality/fetch/", import.meta.url).pathname
    .replace(/^\/([A-Za-z]:)/, "$1"); // windows drive fix
  const files = readdirSync(dir).filter((x) => x.endsWith(".html"));
  const set = new Set<string>();
  for (const file of files) {
    const raw = readFileSync(`${dir}${file}`, "utf8");
    const text = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ");
    const ws = text.split(/\s+/).filter(Boolean);
    for (let i = 0; i + 2 < ws.length; i++) set.add(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
  }
  return set;
}

function textTrigrams(text: string): string[] {
  const ws = text.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) out.push(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
  return out;
}

function originalityCheck(): Finding[] {
  const corpus = loadCorpusTrigrams();
  const f: Finding[] = [];
  for (const row of allRows) {
    if (row.lang !== "en") continue; // corpus is EN-only
    const tris = textTrigrams(row.text);
    if (!tris.length) continue;
    let shared = 0;
    for (const tri of tris) if (corpus.has(tri)) shared++;
    const pct = shared / tris.length;
    if (pct > 0.01) {
      f.push({ level: "error", where: `${row.slot} [${row.condition}] en#${row.variant_no}`, msg: `trigram overlap ${(pct * 100).toFixed(2)}% > 1%` });
    }
  }
  return f;
}

// ---------- import ----------
function readEnv(): { url: string; key: string } {
  const envPath = new URL("../../../../backend/.env", import.meta.url).pathname
    .replace(/^\/([A-Za-z]:)/, "$1");
  const raw = readFileSync(envPath, "utf8");
  const get = (k: string) => {
    const m = raw.match(new RegExp(`^${k}=(.*)$`, "m"));
    if (!m) throw new Error(`backend/.env missing ${k}`);
    return m[1].trim().replace(/^["']|["']$/g, "");
  };
  return { url: get("SUPABASE_URL").replace(/\/$/, ""), key: get("SUPABASE_SERVICE_ROLE_KEY") };
}

async function importRows(): Promise<void> {
  const { url, key } = readEnv();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  const payload = allRows.map((r: BankRow) => ({
    slot: r.slot, condition: r.condition, lang: r.lang, variant_no: r.variant_no, text: r.text,
  }));
  const CHUNK = 200;
  for (let i = 0; i < payload.length; i += CHUNK) {
    const slice = payload.slice(i, i + CHUNK);
    const res = await fetch(`${url}/rest/v1/horoscope_library?on_conflict=slot,condition,lang,variant_no`, {
      method: "POST", headers, body: JSON.stringify(slice),
    });
    if (!res.ok) {
      throw new Error(`chunk ${i}-${i + slice.length} failed: HTTP ${res.status} ${await res.text()}`);
    }
    console.log(`upserted ${Math.min(i + CHUNK, payload.length)}/${payload.length}`);
  }
  console.log("IMPORT OK");
}

// ---------- main ----------
const mode = process.argv[2] ?? "lint";
const findings = lint();
const errs = findings.filter((x) => x.level === "error");
const warns = findings.filter((x) => x.level === "warn");
if (mode === "dump") {
  // print full text of every error row (for hand-rewriting)
  for (const row of allRows) {
    const where = `${row.slot} [${row.condition}] ${row.lang}#${row.variant_no}`;
    if (errs.some((e) => e.where === where)) {
      console.log(`### ${where}`);
      console.log(row.text);
      console.log();
    }
  }
  process.exit(0);
}
for (const x of errs) console.log(`ERROR  ${x.where}: ${x.msg}`);
for (const x of warns) console.log(`warn   ${x.where}: ${x.msg}`);
console.log(`\n${allRows.length} rows · ${errs.length} errors · ${warns.length} warnings`);
if (errs.length > 0) {
  console.log("LINT FAILED");
  process.exit(1);
}
if (mode === "import") {
  const orig = originalityCheck();
  for (const x of orig) console.log(`ERROR  ${x.where}: ${x.msg}`);
  if (orig.length > 0) {
    console.log("ORIGINALITY FAILED");
    process.exit(1);
  }
  console.log("originality clean — importing…");
  await importRows();
} else {
  console.log("LINT OK");
}
