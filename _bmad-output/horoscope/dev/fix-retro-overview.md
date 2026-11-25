# Fix record — weekly/monthly overview fallback ("dummy information") — 2026-11-25

## Owner complaint
"Yearly horoscope is not giving proper details and giving some dummy information."

## Root cause chain
1. `horoscope_library` had yearly slots seeded (migration 0013) but daily/weekly/monthly
   were empty until the phrase-bank import (this session: 6,392 rows, 0 lint errors,
   originality gate 0 failing). With empty pools, `select.ts` pickVariant fell back to
   slot-family templates (`variantNo = 1000+idx`, `source:"fallback"`) — the dummy text.
2. After the import, daily rows regenerated clean, but weekly/monthly **overviews**
   stayed fallback. Cause: `composeWindow` (compose.ts) coerced `retroBit()`'s
   `"review"|"none"` string to a boolean before interpolation → condition
   `rating=X.retro=true|false`, which matches no library row (bank uses
   `retro=review|none` everywhere, per §7.1). Areas were unaffected (composeArea
   maps correctly); daily overview was unaffected (raw string). So *every*
   weekly/monthly overview silently fell back — 4/4 windows × 24 sign-lang rows.
3. Secondary: generate.ts `loadLibrary` fetched one PostgREST page (1000-row cap) —
   with 6,392 rows the index truncated silently → fallbacks. Fixed with pagination.
4. Secondary: §10.5 variety compared cross-period texts and re-published same-date
   rows against themselves (cron-retry false failures, e.g. the 01:52 UTC run on
   2026-11-25 failing rule 5). Fixed: same-period only + skip same-date.

## Fixes (backend, uncommitted as of this record)
- `src/horoscope/compose.ts` — composeWindow: `const retro = retroBit(snaps);`
  (vocabulary comment added).
- `src/horoscope/generate.ts` — loadLibrary pages through `limit=1000&offset=N`
  until short page; makePick accepts `salt` (month key) so yearly month-table
  clauses spread across variants; per-period prev payloads (daily/weekly/monthly/
  yearly families) for §10.5; prevMonth helper.
- `src/horoscope/validate.ts` — rule 5 scoped to same period; same-date republish
  exempt.
- `test/horoscope-compose-validate.test.ts` — +2 tests (idempotent republish,
  cross-period).
- `test/horoscope-ist-select.test.ts` — +1 test (salted seeds spread picks).

## Coverage matrix verified (generator condition ↔ DB horoscope_library)
- daily.overview / weekly.overview / monthly.overview: `rating={4}.retro={review,none}`
  → 8/8 conds each. (weekly+monthly were unreachable until the retro fix.)
- thought: `theme={1..12}.tone={4}` → 48/48.
- areas (daily/weekly/monthly × 6): `rating={4}.pb={fav,neutral,unfav[,chandrashtama
  for Moon areas]}.retro={review,none}` → career-class 24/24, health 32/32.
- dos/donts: `house={1..12}.flavour={constructive,deferring}` → 12/12 each.
- clause.pos/neg: `planet={Jupiter,Saturn,Rahu}.band={fav,neutral,unfav}` → 9/9 each
  (SLOW_PLANETS matches exactly).
- clause.closing: `rating={4}` → 4/4. yearly.overview: `rating={4}` → 4/4.
- yearly.{10 areas}: `rating={4}.driver={steady,saturn-phase,rahu-axis,jupiter-good,
  mixed}` → 20/20 × 10 (driverFor's exact vocabulary).

**Every generator-queried (slot, condition) has 3–6 library variants. Zero planned
fallback paths remain.**

## Verification evidence
- Backend tests 400/400 (incl. 72 horoscope tests), biome lint clean.
- Regen runs (local Bun runner `dev/regen.ts` → same runHoroscopeGeneration as the
  Workers cron): 2026-11-25 15:10 UTC success 336 rows 0 violations; second run
  after the retro fix success 336 rows 0 violations.
- DB sweep `payload::text LIKE '%fallback%'`: 0 rows in every reachable window
  (daily 2026-11-24…12-01, weekly 2026-11-23 + 11-30, monthly 2026-11 + 12, yearly
  2026 + 2027). Only stale `daily 2026-11-23` (past, unreachable by resolve-current)
  keeps old fallback text.
- Live API (astro-backend.vyotish.workers.dev), 6 periods × sign/lang samples:
  fallback=0, library-only everywhere.
- Static vyotish.com pages: still baked from the 2026-11-24 16:41 build (pre-fix
  rows). Re-bake happens automatically via the horoscope-cron deploy hook after the
  next successful generation (next cron ~01:55 UTC 2026-11-26); earlier re-bake
  needs a frontend repo push (owner consent).

## BMAD review (manual, QA mindset)
- compose.ts: single-line behavior fix; `retro` used only in the condition; matches
  composeArea/composeDaily vocabulary; comment explains the failure mode. PASS.
- generate.ts pagination: first-page failure → honest empty-fallback mode preserved;
  later-page failure keeps partial index (fail-soft). Nit: `Prefer: count=exact`
  header requested but count never read — harmless, left as-is. PASS.
- validate.ts rule-5 scoping: cannot mask true day-over-day repeats (different
  date_key still compares). PASS.
- Tests pin each new behavior. PASS.
- Data effect: republish only, upsert by (sign, period, date_key, lang); no deletes.
  PASS.

## Pending owner consent
1. Backend (Astro-Backend): commit the 5 modified files + push (CI deploys Workers).
2. Meta (Astro-Meta): commit bundle docs/records.
3. Optional: immediate frontend re-bake (empty commit push to Astro repo) vs. wait
   for the ~01:55 UTC cron (automatic).
