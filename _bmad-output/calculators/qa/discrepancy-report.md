# Calculator QA — MASTER DISCREPANCY REPORT (Quinn, QA Engineer)

> 2026-11-21 · Pipeline: Mary (research ✅) → **Quinn (this report)** → Sally (design) → Bob/Amelia (fix) → Quinn (verify)
> Detail tables live in the three cluster reports; this file is the executive merge + decision list.
> Evidence: `qa/api-probe.json` (28 live-API cases), `qa/ui-probe.json` (20 pages × 4 viewports), `qa/shots/*.png`, ~40 extra one-off live probes quoted in cluster reports, backend tests 288/288 green (engine-level tests pass — the bugs below are gaps the existing tests don't cover).

## 1. The owner's two complaints, root-caused

| Complaint | Root cause | Fix layer |
|---|---|---|
| **"we are not getting all the details in output"** | ① One generic renderer dumps every API key as a flat key/value row (`[tool].astro` `renderObject`) — no headline card, no interpretation text, no tables, no 3×3 grid (lo-shu), raw 0–1 illumination, raw ISO timestamps. ② APIs return bare numbers — no meaning/interpretation/remedy text layer at all (QN-14/16/17/18, QF-11–16, QB-12/13). ③ Several tools are missing whole output blocks (dasha antardashas, sade-sati dhaiya, karaka scheme disclosure). | FE (presentation) + BE (missing fields/interpretations) — API-first per D12: interpretations belong in the API |
| **"alignment is not correct"** | `[tool].astro:427` `<style>` is **scoped** while result rows are JS-injected → `.row/.k/.v/.obj` selectors never match. Label and value render glued together ("mulank5", "in_sade_satiNo"); keys/values at drifting x-positions; transits = one 1825px row; Lo Shu = 700px text dump. (QN-07, QF-17, QB-11/12) | FE — one `is:global` fix repairs all 20 pages (established fix pattern in CHANGELOG) |

## 2. Confirmed wrong-calculation bugs (P0/P1)

| ID | Bug | Impact | Root cause |
|---|---|---|---|
| **QB-01** | **Shared UTC solver computes the wrong day for evening births** (local time + tz offset ≥ 24:00: IST ≥ 18:30, Sydney ≥ 14:00). Chart lands on date +4 days (time-of-day kept). Proven: rashi 19:15 Mumbai → Taurus instead of Pisces; kundli echo `datetime_utc 2000-04-03` for input `2000-03-30`; sade-sati natal moon Aries instead of Aquarius; tz=UTC control exact. | **~40% of real births in positive-offset zones get a wrong chart** on every birth tool, kundli, and match | `backend/src/lib/birth.ts:77` — drift solver compares formatted wall-clock to literal 0 instead of target hh:mm |
| **QB-02** | **Rahu/Ketu are tropical** (never ayanamsha-corrected) — every node sign/degree/nakshatra/house/navamsha wrong by the full ayanamsha (≈24.2°); kaal-sarp hemming mixes sidereal planets with a tropical axis → verdicts can flip (KS2 research "full + Anant" → engine `false`) | kundli, transits, kaal-sarp | `backend/src/engine/nodes.ts` — Lahiri never subtracted; `kaalSarp` (tools.ts:175) consumes it raw |
| **QF-02** | FLAMES `remaining` undercounted whenever names share a letter (the common case) — pinned Wikipedia vector Rohan+Lenna → **Enemy** instead of **Marriage** | flames: wrong for majority of inputs | `backend/src/engine/tools.ts:233` — reads `lb.length` after splice mutation |
| **QF-03** | FLAMES identical/subset names → negative n → negative `%` + `splice(-k)` garbage (Asha+Asha → "Marriage") | flames edge cases | `tools.ts:233/237/239` — unreachable `===0` guard, no negative normalization |
| **QN-01** | Mobile numerology sums the "+91" prefix: `+91 98765 43210` → 55→1 Sun instead of 45→**9 Mars** | Wrong for the most common Indian input format | `backend/src/engine/tools.ts:345-347` — no prefix strip |
| **QB-05** | Manglik cancellation **suppresses detection flags**: `from_moon:false` despite Mars in dosha house 4; reason string conflates own-sign vs exaltation | mangal-dosha detail is self-contradictory (`cancelled:true` with zero positive frames) | `backend/src/engine/matching.ts` manglik |
| **QN-02** | Vehicle friendly/neutral sets diverge from the consensus number matrix (mulank 5 → shows 8,9 "friendly" — consensus neutral); no enemy band at all | vehicle-number verdicts unreliable | `backend/src/engine/tools.ts:298-329` — planet-level friendship + mutual-overlap, not number-level matrix |

## 3. Dead pages (P0) — tools that never work from the UI

| ID | Page | Symptom | Root cause |
|---|---|---|---|
| QB-03 | `/calculators/kaal-sarp` | 404 "No route for GET /api/v1/kundli" on every submit | Registry endpoint GET vs POST-only kundli route |
| QB-04 | `/calculators/mangal-dosha` | same | same |
| QF-01 | `/calculators/name-compatibility`, `/love`, `/friendship`, `/flames` | 400 "a and b name parameters are required" on every submit | `[tool].astro:320` sends `name=` but API requires `a=`+`b=` |

## 4. Validation gaps (silent wrong answers)

- **Impossible dates roll over silently** where `isCalendarDate` isn't applied: rashi/sade-sati/kaal-sarp/karakas/ishta-devata (QB-10 — `2025-02-30` → 200, Mar-2 chart), numerology/lo-shu/vehicle-number (QN-08 — computes from raw digits: Feb-30 mulank 3 ≠ Feb-28 mulank 1, i.e. the answer is *doubly* wrong), age (QF-06). destiny-number/sun-sign/moon-phase correctly 400.
- **age accepts future DOB / reversed range** → negative ages with 200 (QF-07).
- **mobile-numerology regex unanchored**: 16–17-digit strings accepted (message says 3–15; placeholder says 10–15 — three contradictory limits) (QN-12).
- **name-numerology accepts digits/Devanagari/spaces-only/80-char names** → `root 0, lord "Sun"` nonsense instead of an error (QN-10/11).

## 5. Missing inputs (owner's specific ask — research "Recommended input set" vs reality)

| Tool | Missing input | Finding |
|---|---|---|
| mangal-dosha (+ match) | **Gender** (traditional rules are gendered) | QB-09 |
| sade-sati | **Check-date** ("was I in sade sati on X?" — `as_of` param silently ignored today) | QB-07 |
| vehicle-number | **The vehicle registration number itself** (tool only takes owner DOB — it cannot answer "is THIS plate lucky for me") | QN-03 |
| mobile-numerology / name-numerology | **Owner DOB is rendered by the UI but silently ignored by the API** — the compatibility verdict (the tool's point) is impossible | QN-04/05 |
| sun-sign | Optional **birth time + place** (fixed 12:00 UTC mislabels cusp-day births — 2025-01-14 pre-09:03 IST is Dhanu, page says Makara all day) | QF-08 |
| age | "Age at date" field (hidden `now` param) + user-local "today" default (UTC default wrong for IST 00:00–05:30) | QF-09 |
| all name-pair pages | Spurious optional Date field rendered + sent, ignored by API | QF-20 |
| birth tools | Birth time to seconds (HH:mm only) | QB-09 |

## 6. Missing outputs (research "Complete output list" highlights)

- Interpretation/meaning text per result — missing on **all 23** (QN-14, QB-13); remedies/disclaimers missing on all numerology tools (QN-17/18).
- Lo Shu 3×3 grid not drawn (QN-06 — API already returns grid-ordered data; renderer-only fix).
- Vimshottari: no antardasha/pratyantardasha, no current-period highlight (QB-13).
- Sade-sati: no dhaiya (4th/8th Saturn), no phase sub-windows, no check-date semantics (QB-06/07).
- Transits: 75 raw rows, no house framing or gochara good/bad view (QB-12).
- FLAMES: no letter trace, no round-by-round elimination (QF-13).
- Moon-phase: illumination raw 0–1 (not %), no quarter lunations, no icon (QF-11/12).
- Age: no next-birthday countdown, no day-of-week, no weeks/hours (QF-15).
- Sun-sign: no element/dates-covered/cusp warning/Sanskrit name (QF-16).
- Karakas: no AK highlight, no 7-vs-8 scheme disclosure (QB-13/14).
- Ishta-devata: **always null** — the endpoint computes everything except the answer (QB-08).

## 7. Per-calculator verdicts (API-calc / UI)

| Calculator | Calc verdict | UI verdict | Worst finding |
|---|---|---|---|
| rashi (+nakshatra page) | PASS (morning/noon inputs) | FAIL styling | QB-01 poisons evening inputs |
| lagna (via kundli) | PASS (Δ0.003°) | n/a (no dedicated page) | QB-01; no dedicated page (owner list item) |
| vimshottari (via kundli) | PASS | n/a (no dedicated page) | no antardasha; no dedicated page |
| sade-sati | PASS verdicts | FAIL styling | QB-01 evening; QB-06 start convention; QB-07 check-date |
| karakas | PASS | FAIL styling | QB-01 evening |
| ishta-devata | **FAIL** (null answer) | FAIL | QB-08 |
| transits | planets PASS / **nodes FAIL** | FAIL (75-row dump) | QB-02 |
| kaal-sarp | **UNRELIABLE** (tropical hemming) | **DEAD** | QB-02 + QB-03 |
| mangal-dosha | verdict PASS / detail FAIL | **DEAD** | QB-04 + QB-05 |
| moon-phase | PARTIAL (bin convention conflict) | FAIL styling | QF-04 |
| sun-sign | PASS vectors | FAIL | QF-08 cusp-day design |
| destiny-number | PASS (best in set) | FAIL styling | QN-13 mulank master |
| vedic numerology | PASS core | FAIL styling | QN-08/09/11 |
| lo-shu | PASS data | FAIL (no 3×3) | QN-06 |
| name-numerology | PASS math | FAIL styling | QN-10 validation |
| mobile-numerology | PASS bare digits | FAIL styling | **QN-01 +91** |
| vehicle-number | PARTIAL (matrix diverges) | FAIL | QN-02 + no plate input |
| age | PASS math | FAIL | QF-06/07 validation |
| name-compatibility | PASS roots / band invented | **DEAD** | QF-01 + QF-05 |
| love | deterministic but clamped 55–85 | **DEAD** | QF-01 + QF-10 |
| friendship | identical score to love | **DEAD** | QF-01 + QF-10 |
| flames | **FAIL** (undercount + negative n) | **DEAD** | QF-02/03 |

**Counts: 58 findings — P0 ×6, P1 ×14, P2 ×21, P3 ×17.** Cluster detail: `report-birth.md` (15), `report-numerology.md` (23), `report-fun-date.md` (20). Research errata (3) documented inside cluster reports for Mary.

## 8. Decisions needed from the owner before dev (Step 3/4)

1. **D-QF04 moon-phase bins**: S13-approved convention (bins centered ±22.5°, e.g. D=157.5→Full Moon) vs Mary's recommendation (half-open bins anchored at phase instants, D=171.6→Waxing Gibbous). Backend tests currently lock the S13 convention.
2. **D-QB06 sade-sati window start**: first-entry (research, 2022-04-29 for Ex2) vs stable-post-retro entry (engine, 2023-01-17).
3. **D-QF10 fun scores**: adopt the documented deterministic paper-game (LOVES/FRIEND, 0–99 with shown work) vs keep the clamped numerology formula; replace invented bands with traditional planet-lord matrix or label explicitly as our convention.
4. **D-QN03 vehicle method**: School A (digits-only) + School B (Chaldean letters) dual computation on a real plate input.
5. **D-QB08 ishta-devata mapping**: implement the classical 12th-from-Karakamsha method now (stable core: Sun→Shiva, Moon→Devi, Mercury→Vishnu, Venus→Lakshmi, Ketu→Ganesha; disputed rows marked) or keep null until Jyotishi sign-off (P11).
6. **D-QB09 gender field**: add to mangal-dosha + match (traditional inputs) — content decision.
7. **D-pages**: build dedicated pages for Nakshatra, Lagna, Vimshottari Dasha (owner's featured list) — or keep them as kundli-section features with better deep-linking.

## 9. Regression tests

`qa/e2e-calculators-regressions.mjs` (run: `bun qa/e2e-calculators-regressions.mjs`) asserts the **correct** values from research — every failure is a confirmed bug to be closed by the fix phase. Current run: **9 PASS / 17 FAIL** (evidence `_bmad-output/calculators/qa/regressions.json`). Fails = QB-01a/b, QB-02, QB-03, QB-04, QF-01, QB-05, QB-06*, QB-08, QB-10, QN-08, QF-06, QF-07, QN-01, QN-02, QF-02, QF-03 (*decision-gated D-QB06). Notable proof: transits Rahu is off by **exactly Δ=24.228° = the Lahiri ayanamsha** (QB-02), and the kundli UTC echo for input 2000-03-30 22:15 IST is `2000-04-03T16:45Z` (QB-01). 8 regression guards (RG-01…08) pin the currently-correct behaviour that must survive the fix phase. Sydney 14:30 control (QB-01c) passes — the date-shift bug fires for IST-style evening offsets, which is the owner-relevant case.
