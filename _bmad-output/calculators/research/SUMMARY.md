# Calculators Research — SUMMARY (Mary, Analyst)
> 2026-11-21 · All 23 calculators researched · Files in this folder, one per calculator · Companion: `../inventory.md`

## Status table

| Calculator | Research file | Research status | Key gaps vs current implementation |
|---|---|---|---|
| Rashi | rashi.md | ✅ | No degree-in-sign, no sign lord/element, no boundary/unknown-time warning, no ayanamsha disclosure, no interpretation |
| Nakshatra | nakshatra.md | ✅ | No dedicated page (reuses rashi), no nakshatra lord/pada-syllable/gana/yoni/deity, no %-traversed, no pada-boundary warning (pada flips ~6h), no Abhijit flag |
| Lagna (Rising Sign) | lagna-rising-sign.md | ✅ | No dedicated page; optional-time noon default dangerous (lagna moves ~1°/4min); ASC degree not human-formatted; no lagna lord; no boundary warning |
| Vimshottari Dasha | vimshottari-dasha.md | ✅ | Mahadashas only — no antardasha/pratyantardasha, no current-dasha highlight, balance as raw years not date, no year-length disclosure (360 vs 365.25 ≈ 1.7yr late-life drift), no sandhi warning |
| Shani Sade Sati | shani-sade-sati.md | ✅ | No "check date" param (runs only for now); no dhaiya/small-panoti; no phase sub-window dates or retro-dip revival; no Saturn till-date/retro flag; start-convention ambiguity undocumented |
| Kaal Sarp Yoga | kaal-sarp-yoga.md | ✅ | **P0: page GETs POST-only /api/v1/kundli → 404**; no evidence/margin block or near-axis warning; partial state never surfaced; type-name list must be pinned |
| Mangal Dosha | mangal-dosha.md | ✅ | **P0: same GET/POST 404**; no gender input; cancellation too thin (no Jupiter-aspect/navamsa rules); no severity (Anshik); no boundary warnings |
| Atmakaraka & Jaimini Karakas | atmakaraka-jaimini-karakas.md | ✅ | No scheme toggle/disclosure (7 hardcoded), no AK highlight, no retrograde flags, no near-tie warning, Karakamsha not surfaced |
| Ishta Devata | ishta-devata.md | ✅ | `ishta_devata` always null — computes everything except the answer; no 12th-from-Karakamsha derivation; no deity mapping table |
| Current Transit Chart | current-transit-chart.md | ✅ | Place-only snapshot: no natal overlay/biwheel, no house counts, no gochara good/bad badges, no Sade Sati phase, no chart drawing, no target-date param |
| Vedic Numerology | vedic-numerology.md | ✅ | No meaning text, no master flag on mulank, non-Latin names silently → 0, no friendly/enemy numbers, no name-vs-birth verdict |
| Lo Shu Grid | lo-shu-grid.md | ✅ | UI renders flat rows, not the 3×3 grid (core UX); no arrows/planes analysis; no per-number meanings; no remedies |
| Destiny Number | destiny-number.md | ✅ | No interpretation text, master flag missing for mulank, reduction chain not shown, no mulank-vs-destiny verdict |
| Name Numerology | name-numerology.md | ✅ | No DOB input → compatibility verdict impossible (the tool's whole point); digits/non-Latin sum to 0 instead of erroring |
| Mobile Number Numerology | mobile-number-numerology.md | ✅ | No owner DOB → no compatibility verdict; no last-4 tail/pattern analysis; `for_fun:true` instead of real content |
| Lucky Vehicle Number | lucky-vehicle-number.md | ✅ | NO vehicle-number input at all (owner DOB only → friendly-list, not plate analysis); no dual-method plate computation |
| Moon Phase | moon-phase.md | ✅ | illumination raw 0–1 not %; no quarter lunations; UTC-only; moon-age basis undocumented |
| Sun Sign | sun-sign.md | ✅ | Fixed 12:00 UTC → wrong rashi for cusp-day births (2025-01-14 pre-09:03 IST is Dhanu); no time/place input; no element/dates-covered; no cusp warning |
| Age Calculator | age-calculator.md | ✅ | No next-birthday countdown, no day-of-week, no weeks/hours; "age at date" hidden in UI; UTC-today default wrong for IST users |
| Name Compatibility | name-compatibility.md | ✅ | **UI param bug (name= vs a=)**; invented bands not grounded in tradition; no planet lords or letter-math shown |
| Love Compatibility | love-compatibility.md | ✅ | **UI param bug**; clamp forces 55–95 (never extremes); opaque formula; no method shown |
| Friendship | friendship-compatibility.md | ✅ | **UI param bug**; band "shift by 2" undocumented; indistinguishable from love tool |
| FLAMES | flames.md | ✅ | **UI param bug**; no round-by-round trace; crossing/case/n=0 conventions undefined; bare result |

## Cross-cutting findings (drive Quinn's test plan)

1. **Two featured tools are dead in the UI** (kaal-sarp, mangal-dosha): pages call `GET /api/v1/kundli`, which is POST-only → users see a 404 error. Engine logic exists and is fine.
2. **Four fun tools are dead in the UI** (name-compatibility, love, friendship, flames): pages send `name=`/`b=` but endpoints require `a=`/`b=` → 400. The whole fun-tools cluster is effectively unusable.
3. **All result rendering is one generic key-value dump** with a scoped-CSS bug (`[tool].astro`) → unstyled/misaligned rows. No headline cards, no tables (dasha), no 3×3 grid (lo-shu), no interpretation text, no disclaimers beyond one flag line.
4. **Input gaps**: no gender anywhere; numerology family missing owner-DOB↔object (mobile/vehicle/name) compatibility inputs; vehicle-number has no vehicle-number field; sade-sati has no check-date field; sun-sign/moon-phase lack optional time+place; age hides the "age at" date.
5. **Verification infrastructure exists**: engine outputs are largely correct where implemented (validated pipelines during research: JPL DE441 + Lahiri model agreement ≤1′; published lunation instants ±2 min already pinned in backend tests).
6. **Recommended standards adopted in research**: Lahiri ayanamsha (keep), 365.25-day dasha years (keep, disclose), 27-nakshatra scheme, half-open 45° moon-phase buckets (matches implementation), Chaldean 1–8 for names, classical Lo Shu map 4-9-2/3-5-7/8-1-6, DrikPanchang-family kaal-sarp type names, one-to-one FLAMES cancellation.
7. **QA oracle data is ready**: every research file has ≥3 fully-stepped worked examples usable as automated test vectors (e.g. shared birth fixture 1990-05-15 Delhi: Moon 271.9010° → Uttara Ashadha pada 2 → Sun balance 3.6446 yr; kaal-sarp fixture family on 2000-03-30 Mumbai; FLAMES regression ROHAN+LENNA → Marriage from Wikipedia).

## Recommended next step
Quinn (QA) runs each calculator against the worked examples + edge cases, confirms the P0 UI bugs, adds the alignment/UX findings, and produces `../qa/discrepancy-report.md`.
