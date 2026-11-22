# S-ZC-2 — Backend: sign-compatibility engine, pair data, routes, tests (Epic ZC story 2 of 4)

> Written by Bob (SM) via orchestrator, 2026-11-22 · Source: master story ACs B1–B4 + `../research/pair-matrix.md` (complete developer spec: §1 tables, §2 formula, §4 78-row matrix, §5 QA assertions, §7 category offsets).
> **BMAD review: APPROVED (self, 2026-11-22)** — additive engine module + additive routes only; deterministic formula is fully specified in pair-matrix.md (no judgment calls left to dev); no-PII (no birth data); verified:false per P11; D12 honoured (frontend fetches, backend owns logic+data).

## Story

**As the** owner of Vyotish, **I want** a deterministic sign-compatibility engine with editable pair content served over two GET endpoints, **so that** the thin frontend renders all 144 ordered pairings from one canonical, tested data source.

## Scope — backend repo only (`Astro-Backend`)

Files: `src/engine/sign-compatibility.ts` (new), `src/data/sign-compatibility/*.json` (new, 12 files), loader in the engine module, `src/routes/v1/compatibility.ts` (new), mount in `src/app.ts` + `v1.ts` implemented list, tests in `test/sign-compatibility.test.ts` + `test/compatibility-route.test.ts` (new).

### AC-1 — Engine facts + scoring (exactly per pair-matrix.md)
Encode §1.1 sign table (index, element, modality, polarity, classical ruler, modern co-ruler, sanskrit name from existing `SUN_SIGN_META` in `src/engine/calculators.ts`), §1.2 aspect-by-`d = min(diff, 12−diff)` table, §1.3 dignity table, §2 formula:
- `score = clamp(aspectBase + elementModifier + dignityModifier + sharedRulerBonus, 35, 95)` with the exact bases (trine 88, conjunction 80, sextile 78, opposition 62, semisextile 54, quincunx 48, square 45), element modifiers (complementary +3, contrary −3, cross 0, same 0), dignity modifier per-direction (+3 exalted, −4 detriment/fall, total clamped [−6, +5], **skipped for same-sign**), shared-ruler bonuses (Gemini–Virgo/Taurus–Libra +2; Aries–Scorpio/Sagittarius–Pisces/Capricorn–Aquarius +1 with `disputed: true`), bands (85–95 Excellent, 70–84 Strong, 55–69 Mixed, 40–54 Challenging, 35–39 Very challenging).
- Exports per pair: `{ aspect, degrees, element_pair, modality_pair, polarity_pair, rulers, ruler_note, shared_ruler: {planet, disputed}, score, band, verified: false }`.
- Per-category scores via §7 offsets (love +4; sexual +6/+2 by aspect; friendship +2/−2 by element; communication −6/0 by aspect; trust −8/−2 by aspect; emotional +2 water-involving; all clamped 35–95). Category keys: `love, sexual, friendship, communication, trust, emotional`.
- Pure function over two sign slugs, canonicalised by wheel index (symmetric).

### AC-2 — Pair content data + loader
- 12 JSON files `src/data/sign-compatibility/{aries..pisces}.json`, arrays of records shaped `{ pair, aspect, overall: { verdict }, categories: { love, sexual, friendship, communication, trust, emotional }, tips: string[] }` — exactly the Paige schema.
- Loader joins engine facts + content by canonical slug; **missing key throws at startup/test time** (loud failure, no runtime fallback copy); JSON validated (both signs' names present, banned-words sweep, tips length 4–6, category text length bounds) by a test, not at runtime.
- `pair-matrix.md` §4's per-pair flags that affect copy (Cancer–Scorpio secrecy caveat, Gemini–Virgo shared-Mercury nuance, Aries–Aquarius classical/modern ruler dispute, traditional-only shared rulers) must be reflected in the content records — enforced by a test that greps each flagged pair's record for its nuance keyword.

### AC-3 — Routes (D12)
- `GET /api/v1/compatibility/signs` → 12 signs: `{ slug, name, sanskrit, element, modality, polarity, ruler, co_ruler, approximate_dates }` (wheel order).
- `GET /api/v1/compatibility/signs/pair?sign1=&sign2=` → canonicalised result: `{ pair (canonical slug), requested: {sign1, sign2}, facts (engine facts block), overall: { score, band, verdict }, categories: [{ key, label, score, explanation } × 6], tips: string[], disclaimer, method_note, verified: false }`.
- Labels: human-readable category labels ("Love Compatibility", …, band labels "Mixed — workable with effort" style per §2 Step 5 copy guidance).
- Validation: unknown sign → 400 `{ error: { code: "validation_error", message } }`; missing param → 400. Same sign allowed. No birth data anywhere (no-PII).
- Mount in `src/app.ts` alongside existing routers; add both endpoints to the `v1.ts` implemented list.

### AC-4 — Tests (assert §5 exactly)
- **Completeness:** all 144 ordered `(sign1, sign2)` resolve; content loader covers all 78 canonical pairs; every category text non-empty and within length bounds; tips 4–6 items.
- **Formula assertions (pair-matrix §5):** 78 rows exactly (12 per aspect class, 6 oppositions); band distribution Excellent 10 / Strong 26 / Mixed 6 / Challenging 33 / Very challenging 3; all six oppositions = 59; all 12 same-sign = 80; extremes: min Aries–Cancer 38 (next Gemini–Pisces 39, Virgo–Sagittarius 39), max 91 (Aries–Leo, Cancer–Pisces, Libra–Aquarius); symmetry invariant over all 144 (pair(A,B) deep-equals pair(B,A) minus echo fields).
- **Category offsets:** spot vectors (e.g. Aries–Leo sexual 95 = clamp(91+6); Aries–Cancer trust 30→clamp 35? — compute per formula and assert; include one water emotional +2 case and one non-water 0 case).
- **Route tests:** valid pair 200, reversed pair identical payload, unknown sign 400, missing param 400, same-sign 200.
- All tests green via `bun test`; existing suites untouched and green.

### AC-5 — Conventions
- Comment style matches engine neighbours (documented variant choices inline); `verified: false` on verdicts (P11); `meta.note` disclaimer strings included in route payloads; no new dependencies.

## Non-goals
No Supabase migration (static content ships in code — D-ZC3); no admin UI; no Hindi; no consult CTA logic.
