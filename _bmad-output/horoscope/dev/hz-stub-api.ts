/**
 * Dress-rehearsal API for the horoscope frontend (Step 4 QA; scratch — NOT deployed).
 *
 * Serves GET /api/v1/horoscope with the exact resolve-current contract using
 * the REAL backend compose pipeline in fallback-library mode (empty
 * horoscope_library → fallbackForSlot phrases) and the REAL block payloads
 * parsed verbatim out of migration 0013. Zero database, zero deploys —
 * lets `astro build` bake full-payload pages for browser QA before the
 * consent-gated migration lands.
 *
 * Run:  bun _bmad-output/horoscope/dev/hz-stub-api.ts   (port 8799)
 */
import { readFileSync } from "node:fs";
import {
  type ComposeCtx,
  composeHoroscope,
  type Lang,
  type PickResult,
} from "../../../backend/src/horoscope/compose";
import { fallbackForSlot } from "../../../backend/src/horoscope/fallback";
import { addDays, periodDateKey } from "../../../backend/src/horoscope/ist";
import { HOROSCOPE_SIGNS, type HoroscopeSign } from "../../../backend/src/horoscope/rules";
import { type Snapshot, snapshotAt } from "../../../backend/src/horoscope/score";
import { pickVariant } from "../../../backend/src/horoscope/select";
import { resolveCurrent } from "../../../backend/src/routes/v1/horoscope";

const ROOT = "C:/Users/sanjay.bhati.OM/Downloads/Vyotish-Repos/Astro-Meta";

// — blocks verbatim from migration 0013 (EN + HI) ———————————————
const sql = readFileSync(`${ROOT}/backend/supabase/migrations/0013_horoscope_automation.sql`, "utf8");
const blocksByLang: Record<Lang, Record<string, unknown>> = { en: {}, hi: {} };
for (const m of sql.matchAll(/'horoscope\.([a-z_]+)', '(en|hi)', \$\$\s*(.*?)\s*\$\$/gs)) {
  blocksByLang[m[2] as Lang][m[1]] = JSON.parse(m[3]);
}
console.log(
  "blocks loaded:",
  Object.keys(blocksByLang.en).join(", "),
  "| hi:",
  Object.keys(blocksByLang.hi).length,
);

// — real compose in fallback-library mode (mirrors generator makePick) ————
const snapCache = new Map<string, Snapshot>();
const snapFor = (dk: string): Snapshot => {
  let s = snapCache.get(dk);
  if (!s) {
    s = snapshotAt(new Date(`${dk}T00:05:00+05:30`));
    snapCache.set(dk, s);
  }
  return s;
};

const daysInMonth = (y: number, m: number): number => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** Window snapshots for one resolved (period, dateKey) — mirrors generate.ts. */
function windowSnaps(period: string, dateKey: string): Snapshot[] {
  if (period === "daily") return [snapFor(dateKey)];
  if (period === "weekly")
    return Array.from({ length: 7 }, (_, i) => snapFor(addDays(dateKey, i)));
  if (period === "monthly") {
    const [y, m] = dateKey.split("-").map(Number);
    return Array.from({ length: daysInMonth(y, m) }, (_, i) =>
      snapFor(`${dateKey}-${String(i + 1).padStart(2, "0")}`),
    );
  }
  const y = Number(dateKey);
  const n = Math.round((Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / 86400000);
  return Array.from({ length: n }, (_, i) => snapFor(addDays(`${dateKey}-01-01`, i)));
}

function makeCtx(dateKey: string, sign: HoroscopeSign, lang: Lang): ComposeCtx {
  return {
    lang,
    pick: (slot, condition, rating): PickResult =>
      pickVariant(
        { dateKey, sign, lang, slot, condition },
        { rows: [], fallback: fallbackForSlot(slot, rating) },
      ),
  };
}

type SignRow = ReturnType<typeof buildRow>;
function buildRow(period: string, dateKey: string, sign: HoroscopeSign, lang: Lang) {
  const payload = composeHoroscope({
    period: period as "daily" | "weekly" | "monthly" | "yearly",
    sign,
    dateKey,
    snaps: windowSnaps(period, dateKey),
    ctx: makeCtx(dateKey, sign, lang),
  });
  return {
    sign,
    overview: payload.overview.text,
    love: payload.areas?.love?.text ?? "",
    career: payload.areas?.career?.text ?? "",
    finance: payload.areas?.money?.text ?? "",
    health: payload.areas?.health?.text ?? "",
    is_sample: false,
    has_payload: true,
    payload,
  };
}

// cache the full 12-sign batch per resolved window (yearly is expensive)
const batchCache = new Map<string, SignRow[]>();
function batchFor(period: string, dateKey: string): SignRow[] {
  const key = `${period}|${dateKey}`;
  let batch = batchCache.get(key);
  if (!batch) {
    batch = HOROSCOPE_SIGNS.map((s) => buildRow(period, dateKey, s, "en"));
    batchCache.set(key, batch);
    console.log(`composed ${key}: ${batch.length} signs`);
  }
  return batch;
}

Bun.serve({
  port: 8799,
  fetch(req) {
    const u = new URL(req.url);
    if (u.pathname !== "/api/v1/horoscope") {
      return new Response("not found", { status: 404 });
    }
    const period = u.searchParams.get("period") ?? "daily";
    const sign = u.searchParams.get("sign");
    const lang = (u.searchParams.get("lang") ?? "en") as Lang;
    const { period: rp, dateKey } = resolveCurrent(period as never, new Date());
    const all = batchFor(rp, dateKey);
    const signs = sign ? all.filter((r) => r.sign === sign) : all;
    return Response.json({
      data: {
        period,
        resolved_period: rp,
        date_key: dateKey,
        lang,
        range: all[0]?.payload?.range ?? null,
        blocks: blocksByLang[lang] ?? blocksByLang.en,
        signs,
      },
    });
  },
});
console.log("stub horoscope API on http://127.0.0.1:8799");
