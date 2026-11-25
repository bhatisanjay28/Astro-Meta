/**
 * Rule-5 collision probe (scratch — NOT committed).
 * Composes the daily payload for one (sign, lang, date) exactly like the cron
 * does — real library, real prev payload — and prints per-slot text equality
 * vs the two published prev rows, plus the recent-variant sets.
 * Run: bun _bmad-output/horoscope/dev/probe-rule5.ts aries en 2026-11-25
 */
import { readFileSync } from "node:fs";
import { composeHoroscope, type ComposeCtx } from "../../../backend/src/horoscope/compose";
import { pickVariant, type LibraryRow, type VariantPool } from "../../../backend/src/horoscope/select";
import { fallbackForSlot } from "../../../backend/src/horoscope/fallback";
import { snapshotAt } from "../../../backend/src/horoscope/score";
import { istDateKey, addDays } from "../../../backend/src/horoscope/ist";
import type { Rating } from "../../../backend/src/horoscope/rules";

const envFile = readFileSync(
  "C:/Users/sanjay.bhati.OM/Downloads/Vyotish-Repos/Astro-Meta/backend/.env",
  "utf8",
);
const env: Record<string, string> = {};
for (const m of envFile.matchAll(/^\s*([A-Z_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/gm)) env[m[1]] = m[2];

const [signArg, langArg, dateArg] = process.argv.slice(2);
const sign = signArg ?? "aries";
const lang = (langArg ?? "en") as "en" | "hi";
const today = dateArg ?? istDateKey(new Date());

const url = env.SUPABASE_URL!.replace(/\/$/, "");
const headers = {
  apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY!}`,
};

// library index (same query as generate.ts loadLibrary)
const lib = new Map<string, LibraryRow[]>();
const libRes = await fetch(`${url}/rest/v1/horoscope_library?select=slot,condition,lang,variant_no,text,is_active&is_active=eq.true`, { headers });
const libRows = (await libRes.json()) as LibraryRow[];
for (const row of libRows) {
  const key = `${row.slot}|${row.condition}|${row.lang}`;
  const list = lib.get(key) ?? [];
  list.push(row);
  lib.set(key, list);
}
console.log(`library rows: ${libRows.length}`);

// prev payloads (same query as loadPrevPayloads)
const prevKeys = [addDays(today, -1), addDays(today, -2)]
  .map((k) => `date_key.eq.${k}`)
  .join(",");
const prevRes = await fetch(
  `${url}/rest/v1/horoscopes?select=sign,lang,payload&period=eq.daily&or=(${prevKeys})&sign=eq.${sign}&lang=eq.${lang}`,
  { headers },
);
const prevs = (await prevRes.json()) as Array<{ sign: string; lang: string; payload: never }>;
console.log(`prev payloads: ${prevs.length} (${prevKeys})`);

// recent-variant map, replicated from generate.ts recentFor
const recent = new Map<string, number[]>();
for (const p of prevs) {
  const variants = (p.payload as { variants?: Record<string, number | null> }).variants ?? {};
  for (const [slot, v] of Object.entries(variants)) {
    if (v === null) continue;
    const list = recent.get(slot) ?? [];
    list.push(v);
    recent.set(slot, list);
  }
}
console.log("recent map:", JSON.stringify([...recent]));

const libKey = (slot: string, condition: string) => `${slot}|${condition}|${lang}`;
const pick = (
  slot: string,
  condition: string,
  rating: Rating,
  recentVariants?: number[],
  salt?: string,
) => {
  const rows = lib.get(libKey(slot, condition)) ?? [];
  const pool: VariantPool = { rows, fallback: fallbackForSlot(slot, rating) };
  const out = pickVariant(
    {
      dateKey: salt ? `${today}#${salt}` : today,
      sign,
      lang,
      slot,
      condition,
      recentVariants,
    },
    pool,
  );
  console.log(`  pick ${slot} [${condition}] -> ${out.source}#${out.variantNo} (pool ${rows.length}r/${pool.fallback.length}f, recent [${(recentVariants ?? []).join(",")}])`);
  return out;
};

const snaps = [snapshotAt(new Date(Date.parse(`${today}T00:05:00+05:30`)))];
const ctx: ComposeCtx = {
  lang,
  pick,
  ...(recent.size > 0 ? { recent } : {}),
};
const payload = composeHoroscope({ period: "daily", sign, dateKey: today, snaps, ctx });

console.log(`\ncomposed ${sign}/${lang}/${today} — equality vs prevs:`);
const texts = new Map<string, string>([["overview", payload.overview.text]]);
for (const [k, a] of Object.entries(payload.areas ?? {})) texts.set(`area.${k}`, a.text);
for (const p of prevs) {
  const pl = p.payload as {
    date_key: string;
    overview: { text: string };
    areas?: Record<string, { text: string }>;
  };
  const prevTexts = new Map<string, string>([["overview", pl.overview.text]]);
  for (const [k, a] of Object.entries(pl.areas ?? {})) prevTexts.set(`area.${k}`, a.text);
  for (const [slot, text] of texts) {
    const before = prevTexts.get(slot);
    if (before === text && text.length > 0) console.log(`  VIOLATION ${slot} == ${pl.date_key}`);
  }
}
console.log("\nsample overview:", JSON.stringify(payload.overview));
const prev0 = prevs[0]?.payload as { overview?: { text: string; source?: string } } | undefined;
console.log("prev overview:", JSON.stringify(prev0?.overview));
