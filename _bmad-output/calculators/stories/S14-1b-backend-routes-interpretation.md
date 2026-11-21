# S14-1b — Backend: new routes, interpretation layer, expanded outputs (Epic 14 story 2 of 3)

> Written by Bob (SM) 2026-11-21 · Source: discrepancy-report §6 + decisions.md (D-pages, D-QB07/08, D12) + design/output-spec.md §4.
> **BMAD review: APPROVED (self, 2026-11-21)** — additive routes/fields only; depends on S14-1a accuracy fixes (ship together, S14-1a first).

## Story

**As the** thin frontend, **I want** each calculator API to carry its complete output blocks and a plain-English meaning layer, **so that** the renderer's headline/chips/details structure has real content and no page shows a flat key/value dump.

## Scope — backend repo only

### AC-1 Three new dedicated GET routes (D-pages)
- `GET /api/v1/calculators/lagna` — sign, lord, sign degree, nakshatra of ascendant, birth UTC echo. Standard birth params.
- `GET /api/v1/calculators/nakshatra` — Moon nakshatra-first: name, pada, lord, deity, gana, longitude.
- `GET /api/v1/calculators/vimshottari-dasha` — mahadasha list (lord, start, end, elapsed fraction), current mahadasha/antardasha block, antardasha table for the current mahadasha with status Past/Current/Upcoming.
- All reuse `resolveBirth` from S14-1a (fixed solver), `isCalendarDate` guard, same envelope.

### AC-2 Dedicated kaal-sarp + mangal-dosha GET routes (QB-03/04, D-decisions)
`GET /api/v1/calculators/kaal-sarp` (verdict, type, per-planet hemming table) and `GET /api/v1/calculators/mangal-dosha` (verdict, per-frame flags, cancellations with reasons, optional `gender` echoed as presentation context per D-QB09). Old registry endpoints on the kundli route stay working (no removal).

### AC-3 Interpretation layer (QB-13, QN-14/17/18)
New engine module (or plain data module) `interpretations.ts`: deterministic per-tool text built from the result values — no runtime LLM, no PII. Every calculator response gains:
- `interpretation`: string[] (1–3 short paragraphs), grounded in research/*.md §Meaning
- `remedies?: string[]` where the research supplies classical ones (numerology name fix, sade-sati, manglik cancellations, missing Lo Shu numbers)
- `meta.note` disclaimer (verified:false language where tables are pending P11; for_fun note on fun tools).
Unit test: every calculator route's golden fixture asserts `interpretation` non-empty.

### AC-4 Expanded outputs per tool (§6 of discrepancy report)
- sade-sati: dhaiya rows (4th/8th Saturn), phase sub-windows, `as_of` check-date honoured (default now), window start per D-QB06.
- moon-phase: `illumination_pct`, per-bin phase-instant times (next for the current bin).
- sun-sign: optional `time` (+ place → UTC via S14-1a solver); cusp warning when Sun within ±1° of ingress; `element`, Sanskrit name, dates covered.
- age: weeks, total hours, next-birthday countdown (days + weekday), day-of-week of DOB.
- lo-shu: `missing`/`repeated` sorted ascending; `planes` (mental/practical/emotional per research) + `arrows` present/absent list.
- transits: per-graha `degree_in_sign`, `nakshatra`, `retrograde`, `now` ISO stamp.
- karakas: `scheme` disclosure ("7-karaka (classical) / 8-karaka extension") + `atmakaraka` flag on the AK row.
- numerology endpoint: full destiny shape (same fields as destiny-number) + namank + optional-owner-date compatibility verdict; mobile/name numerology accept optional `date` for the verdict (logic in API, D12).

### AC-5 Validation & contract hygiene
- Names A–Z/spaces/hyphen, 1–60 chars → else 400 (QN-10/11); letters returned with values; per-word subtotals; root 0 never emitted.
- Mobile prefix strip rules + anchored 3–15 (S14-1a AC-4 detail lives in engine; this story asserts route-level messages are plain English).
- ENGINE_VERSION minor bump; API contract doc updated for all changed/new endpoints; additive fields only.

## Non-goals
Gochara overlay for transits (deferred). No Supabase. No frontend work.

## Test plan
`bun test` additions: route golden-fixture tests for the lagna, nakshatra and vimshottari-dasha routes, kaal-sarp/mangal-dosha GET parity with kundli-derived values, interpretation presence test, sade-sati as_of unit, lo-shu planes/arrows unit, age/next-birthday unit. Target: 288 → ~330 tests green; regression suite 26/26.
