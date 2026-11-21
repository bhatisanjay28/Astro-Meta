# S14-1a — Backend: engine accuracy fixes + interpretation layer (Epic 14 story 1 of 3)

> Written by Bob (SM) 2026-11-21 · Source: `_bmad-output/calculators/qa/discrepancy-report.md` (§2, §4, §6) + `_bmad-output/calculators/decisions.md` + `design/output-spec.md` §4.
> **BMAD review: APPROVED (self, 2026-11-21)** — acceptance criteria map 1:1 to failing regression assertions QB-01a/b/c, QB-02, QB-05, QB-06, QB-08, QB-10, QN-08, QF-06, QF-07, QN-01, QN-02, QF-02, QF-03; all work is additive API surface + bug fixes; no schema/contract breaks (ENGINE_VERSION minor bump).

## Story

**As the** owner of Vyotish, **I want** every calculator API to return the *correct* classical result **with** a plain-English meaning layer and complete output blocks, **so that** the thin-frontend (D12) can render full detail cards and no user ever sees a wrong chart or a null answer.

**Why now:** owner complaint "we are not getting all the details in output" + 17 proven regressions (P0 ×2: QB-01 wrong-day solver, QB-02 tropical nodes).

## Scope — backend repo only (`Astro-Backend`), routes: `src/routes/v1/calculators.ts`, engine: `src/engine/*`, lib: `src/lib/birth.ts`, matching: `src/engine/matching.ts`

### AC-1 QB-01 — UTC drift solver (P0)
`backend/src/lib/birth.ts:77`: the drift solver compares formatted wall-clock to literal `0` instead of the target hh:mm. Fix: compute drift from the **target local hh:mm** (parse `time`), normalise into [−12h, +12h), and derive UTC instant `= localWall − tzOffset − drift`. Acceptance (regression):
- kundli POST `2000-03-30 22:15 IST Mumbai` → `datetime_utc` starts `2000-03-30T16:45` (QB-01a)
- rashi `1995-11-05 19:15 IST Mumbai` → Rashi **Pisces** (QB-01b)
- control `1990-05-15 14:30 Sydney` → lagna Virgo still (QB-01c); RG-01 Delhi noon fixture unchanged.
- Unit tests: IST 00:15, 23:45, half-hour offset (IST is +5:30), UTC, −5 (New York), +9:30 (Adelaide) — chart UTC equals local−offset, no day skip.

### AC-2 QB-02 — sidereal Rahu/Ketu (P0)
`backend/src/engine/nodes.ts`: subtract Lahiri linear ayanamsha (same anchor/constant used elsewhere in the engine) from mean-node longitude; Ketu = Rahu+180. Acceptance:
- transits Rahu within 0.3° of Meeus mean-node − ayanamsha (QB-02 inline vector)
- kaal-sarp hemming uses sidereal longitudes end-to-end.
- Unit test with a pinned date (ayanamsha value asserted).

### AC-3 FLAMES algorithm (QF-02/03)
`backend/src/engine/tools.ts:233-239`: count remaining letters from a **copy** before mutation (or count non-matched without splicing); normalise n≤0 → 0. Acceptance: Rohan+Lenna → **Marriage** (Wikipedia vector, QF-02); Asha+Asha → **Friends** with n=0 convention (QF-03); ≥1 letter-remaining case in unit tests.

### AC-4 Mobile numerology prefix strip (QN-01)
Strip `+91`/`91`/leading `0` only when the remainder is 10 digits starting 6–9 (else sum raw); anchored validation 3–15 digits total (reject 16+); `length_warning` field outside 10; sum 0 → 400. Acceptance: `+91 98765 43210` → 45 → 9 Mars (QN-01); RG-03 `9990513999` unchanged; `98765432109876` → 400.

### AC-5 Vehicle number consensus matrix (QN-02) + plate analyser (D-QN03)
Replace planet-friendship matrix with number-level consensus (mulank 5 → friendly [1,2,3,4,6], neutral [7,8,9] — QN-02). New inputs: `plate` (vehicle registration, required) + owner `date`. Compute School A (digits sum → root) and School B (Chaldean letters + digits → root); verdict vs owner mulank/bhagyank via consensus matrix; digit-clash override noted. Acceptance: QN-02 vector passes; plate "UP32 AB 1234" returns both schools + verdict; missing plate → 400.

### AC-6 Manglik flags (QB-05)
`backend/src/engine/matching.ts` manglik: detection flags (`from_lagna/from_moon/from_venus`) reflect **placement** truth regardless of cancellation; `cancelled` + reasons are separate fields; reason strings distinguish own-sign vs exaltation. Acceptance: MD2 fixture 1992-03-02 08:15 Jaipur → `from_moon:true AND cancelled:true` (QB-05).

### AC-7 Sade-sati window start = first entry (D-QB06)
Window start = first Saturn ingress into 12th-from-Moon sign; 200-day rule only for final exit. Acceptance: Ex2 (1995-11-05 14:20 Mumbai) current window starts **2022-04-29** (QB-06); retro dips don't end windows (unit test).

### AC-8 Ishta-devata classical method (D-QB08)
Implement 12th-from-Karakamsha: occupant by highest degree else sign lord (Scorpio/Aquarius dual-lordship; Ketu-as-lord → Ganesha), planet→deity table. Stable core outright (Sun→Shiva, Moon→Devi, Mercury→Vishnu, Venus→Lakshmi, Ketu→Ganesha); disputed rows (Mars/Saturn/Rahu) carry `disputed:true` per-planet note; keep global `verified:false`. Acceptance: QB-08 vector 1990-06-15 10:30 Delhi → **Shiva**; null never returned; unit tests for each stable-core planet.

### AC-9 Impossible-date guard sweep (QB-10, QN-08, QF-06, QF-07)
`isCalendarDate` applied on **every** date-taking route: rashi, sade-sati, kaal-sarp, karakas, ishta-devata, numerology, lo-shu, vehicle-number, age (destiny/sun-sign/moon-phase already correct). Age additionally rejects future DOB and `now` before DOB (400). Acceptance: `2025-02-30` → 400 on rashi (QB-10) + numerology (QN-08) + age (QF-06); age `2030-01-01` DOB → 400 (QF-07); all RG guards untouched.

### AC-10 Name-tool validation (QN-10/11)
Names: A–Z(a–z, spaces, hyphen) only, 1–60 chars, else 400 with plain message; letters returned **with their Chaldean values**, per-word subtotals; root 0 never emitted (sum 0 impossible by construction).

### AC-11 Numerology full shape (decisions)
`GET /api/v1/calculators/numerology` returns the same destiny shape as destiny-number (sums, chains, master flags, lords) + mulank + namank + name fields; `date` optional there and on name-numerology/mobile-numerology → owner-DOB **compatibility verdict** (logic in API per D12).

### AC-12 Interpretation layer (QB-13, QN-14/17/18 — D12: text lives in API)
Every calculator response gains `interpretation` (1–3 short plain-English paragraphs) and, where applicable, `remedies[]` + `meta.note` disclaimer. Content grounded in `research/*.md` §Meaning; for_fun tools carry the entertainment note; disputed content keeps `verified:false` language. Interpretation is deterministic (no LLM at runtime).

### AC-13 New/expanded GET routes
- **`GET /api/v1/calculators/kaal-sarp`** (birth params) — verdict, type by Rahu house, per-planet hemming table. Page stops POSTing kundli (QB-03).
- **`GET /api/v1/calculators/mangal-dosha`** (birth params + optional `gender`) — verdict, from_lagna/moon/venus flags, cancellations with reasons, house table. (QB-04, D-QB09.)
- **`GET /api/v1/calculators/lagna`** — ascendant-focused: sign, lord, degree, birth UTC echo. (D-pages.)
- **`GET /api/v1/calculators/nakshatra`** — nakshatra-first: name, pada, lord, deity, gana, longitude. (D-pages.)
- **`GET /api/v1/calculators/vimshottari-dasha`** — mahadasha list with dates + antardashas for current mahadasha + current-period block. (D-pages, QB-13.)
- sade-sati gains dhaiya (4th/8th Saturn) rows + `as_of` check-date honoured (QB-07) + phase sub-windows.
- moon-phase: illumination as % (keep raw too), phase-instant times for the 8 bins, next NM/FM already present.
- sun-sign: optional `time`+place-aware cusp detection (QF-08): warn when within ±1° of ingress; element + Sanskrit name + dates covered.
- age: weeks/hours, next-birthday countdown, day-of-week (QF-15).
- lo-shu: `missing`/`repeated` sorted ascending; planes + arrows analysis added (QN-06 partial, D-decisions).
- transits: grahas rows with degree, nakshatra, retrograde boolean; `now` stamp (QB-12 partial; gochara overlay deferred).
- karakas: scheme disclosure (7 vs 8) + AK highlight field (QB-14).

### AC-14 ENGINE_VERSION + docs
Bump ENGINE_VERSION minor; every changed endpoint documented in the API contract file; no breaking rename of existing fields (additive only).

> **Split note:** new dedicated routes, the interpretation layer and the per-tool output expansions moved to **S14-1b** (same epic, ships after S14-1a). This story owns accuracy + validation only (AC-1…AC-9 + version bump).

## Non-goals
No Supabase changes. No kundli/matching contract changes beyond the QB-05 field semantics clarification. Gochara overlay deferred. Frontend untouched here (S14-2).

## Test plan
- `bun test` — new unit files: `birth-solver.test.ts` (AC-1 matrix), `nodes-ayanamsha.test.ts` (AC-2), `flames.test.ts` (AC-3), `numerology-validation.test.ts` (AC-4/10), `vehicle.test.ts` (AC-5), `manglik.test.ts` (AC-6), `sade-sati.test.ts` (AC-7), `ishta-devata.test.ts` (AC-8), `date-guards.test.ts` (AC-9), interpretation presence test per route (AC-12).
- Route-level tests for the 3 new pages' endpoints (AC-13).
- Existing 288 tests must stay green; then `qa/e2e-calculators-regressions.mjs` re-run → **26 PASS / 0 FAIL** target (QB-06 subject to D-QB06 as decided).
