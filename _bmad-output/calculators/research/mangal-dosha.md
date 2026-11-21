# Mangal Dosha / Manglik Check — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Mangal Dosha (Manglik dosha; Kuja Dosham / Sevvai (Chevvai) Dosham in South India) is the claim that Mars placed in certain houses afflicts marriage — delays, discord, or worse — making "Manglik matching" a standard step before arranged-marriage finalization. The calculator answers: (a) Is this person Manglik? (b) From which reference frame (Lagna, Moon, Venus)? (c) Is it cancelled/softened? (d) How intense (high vs low/partial)?

Users:
- Marriage/matchmaking flow (dominant use): parents and couples checking both kundlis; "Manglik–Manglik marriage nullifies the dosha" is a common practice rule (AstroSage).
- Individuals flagged by other sites who want a second opinion (cancellation rules are the battleground — different sites disagree).
- Astrologers/pandits using it as a pre-check before a full match.

Sensitivity framing: the verdict can affect real marriage decisions. Copy must include cancellation context and a disclaimer; presenting a bare "Manglik" verdict without the cancellation rules is worse than competitor standard.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Birth date | required | DD/MM/YYYY | 1900–2076 | — | Mars, Moon, Venus sidereal positions at birth |
| Birth time | required for the Lagna frame | HH:MM(:SS) | — | — | Ascendant needed for Mars-house-from-Lagna. Degradation: Mars-from-Moon and Mars-from-Venus need only the Moon/Venus signs, which are stable all day except on sign-change days |
| Place of birth | required | city → lat/lng + tz | — | — | Ascendant (lat/lng) and timezone |
| Gender | optional (but ask it) | M/F(/other) | — | — | Not needed for the computation (AstroSage: "Both Genders can have Mangal Dosha") but traditional matching practice is gender-asymmetric and report copy/remedies are gendered (GaneshaSpeaks "Manglik Boy & Girl" remedies); also expected by users |
| Name | optional | text | — | — | Personalization; competitors ask |
| Ayanamsha | advanced, optional | Lahiri default | — | Lahiri | Mars sign/house boundaries shift ~1° across ayanamsha variants |

### Recommended input set
Name (optional), gender (ask, used for copy only), date of birth, exact birth time, place of birth (city autocomplete → lat/lng/tz). "Time unknown" fallback: compute from_moon and from_venus, mark from_lagna indeterminate, and warn on sign-change days for Moon/Venus.

### Current Vyotish input set
Page `/calculators/mangal-dosha` takes birth date, optional time, place (city autocomplete → lat/lng/tz). **No gender.** Like kaal-sarp, the page calls `GET /api/v1/kundli` (POST-only route) → users see a 404; the engine (`manglik`) itself works once the route mismatch is fixed.

## 3. Formula(s) / method

Definitions: sidereal (Lahiri) longitudes of Mars, Moon, Venus; Ascendant; whole-sign houses.

Step-by-step:
1. Compute Ascendant sign A (from date, time, lat, lng; Lahiri sidereal).
2. For each reference point R ∈ {Lagna(A), Moon sign M, Venus sign V}: Mars house h(R) = ((signIndex(Mars) − signIndex(R) + 12) mod 12) + 1.
3. Dosha present from R iff h(R) ∈ {1, 2, 4, 7, 8, 12}. Verdict flags: `from_lagna`, `from_moon`, `from_venus`.
4. Aggregation (variants):
   - AstroSage scheme: **High Mangal Dosha** = Mars in dosha houses from natal chart AND Moon chart AND Venus chart; **Low/Partial ("Anshik") Manglik** = dosha in only one of the three charts.
   - Classical Parashara-based North Indian list is often quoted as {1, 4, 7, 8, 12} (no 2nd house); the 2nd house is added by **South Indian tradition (Sevvai/Chevvai Dosham)** — AstroSage states this explicitly, and GaneshaSpeaks lists {1,2,4,7,8,12} from Lagna with Moon/Venus as optional additional frames.
5. Cancellation rules (recommendation: implement the chart-checkable subset, present the rest as notes):
   - **Mars in own sign (Mesha/Aries or Vrishchika/Scorpio) or exalted (Makara/Capricorn)** — GaneshaSpeaks lists explicitly; this is the only cancellation Vyotish's engine implements today. (Classical texts also cite debilitation-based and yogakaraka exceptions — UNVERIFIED, do not ship without a classical citation.)
   - **Mars aspected by a strong benefic — Jupiter (or Venus per AstroSage)**: Jupiter's aspects are 5th, 7th, 9th from Mars. Chart-checkable; GaneshaSpeaks ("Jupiter casts a strong benefic aspect on Mars") + AstroSage ("aspected by benefic planets like Jupiter or Venus").
   - **Favorable Navamsa (D9) placement of Mars** — GaneshaSpeaks. Requires D9 computation (adding a navamsa engine dependency — mark as future).
   - **Strong and unafflicted Moon and Venus** — GaneshaSpeaks (fuzzy; represent as a note, not a boolean).
   - **Age-based**: "may be nullified after the age of 28, according to some astrologers" (AstroSage) — a belief, not a chart rule; present as a note with that exact attribution.
   - **Manglik–Manglik marriage** nullifies (AstroSage) — a matching-time rule; surface in the matchmaking UI, not in a single-chart verdict.
6. Output verdict: a single `is_manglik` boolean needs an aggregation decision — RECOMMENDED: `is_manglik` = dosha present from Lagna (the classical frame), with from_moon/from_venus and a severity field (high when all three, low/partial when one — AstroSage scheme) and `cancelled` + `cancellation_reason`.

Variants summary and recommendation:
- **House list**: RECOMMEND {1,2,4,7,8,12} from all three frames (AstroSage "High" definition + GaneshaSpeaks), which is also what Vyotish implements; document that strict Parashara lists omit the 2nd and South Indian tradition adds it — do not make it a settings toggle, but state the list used in the output detail.
- **Reference frames**: RECOMMEND checking Lagna + Moon + Venus (all three) and reporting each separately, because the frames disagree in ~most charts (worked examples below) and "partial manglik" only exists in this scheme.
- **Cancellations**: RECOMMEND implementing own-sign/exaltation + Jupiter-aspect now (deterministic), everything else as documented notes. Reason: these two are objective, classical-adjacent, and cover the majority of "why do sites disagree" cases; the fuzzy rules (Navamsa quality, strong Moon/Venus, age 28) can't be booleans without inventing thresholds.
- **Gender**: no computational difference (AstroSage explicitly covers both genders); collect gender for copy only. Never gate the verdict on gender.

## 4. Worked examples (≥3 per calculator: normal, edge, boundary)

All positions computed with the validated DE441 + linear-Lahiri pipeline (validation in shani-sade-sati.md §4). Mumbai = 19.0760N 72.8777E; Delhi = 28.6139N 77.2090E; Jaipur = 26.9124N 75.7873E.

### Example 1 — normal (classic 7th-house Manglik from Lagna, with own-sign cancellation debate)
Birth: 1995-11-05, 19:15 IST, Mumbai.
- Sidereal: Asc 39.23° (Vrishabha/Taurus 9.23); Mars 227.57° (Vrishchika/Scorpio 17.57); Moon 358.93° (Meena/Pisces 28.93); Venus 248.87° (Vrishchika/Scorpio 8.87).
- From Lagna (Taurus, ix 1): Mars ix 7 → h = ((7−1) mod 12)+1 = **7th → dosha present** → `from_lagna=true`, verdict Manglik.
- From Moon (Pisces, ix 11): h = ((7−11+12) mod 12)+1 = **9th → no dosha** → `from_moon=false`.
- From Venus (Scorpio, ix 7): h = ((7−7) mod 12)+1 = **1st → dosha present** → `from_venus=true`.
- Cancellation check: Mars is in Vrishchika = **own sign** → `cancelled=true`, `cancellation_reason="mars_own_sign"`. Net engine verdict: Manglik from Lagna and Venus, cancelled by own-sign rule; a site that ignores cancellations (or counts Venus-frame 1st house differently) will disagree — output the reason explicitly.
- Severity per AstroSage scheme: dosha in 2 of 3 frames → not "High"; report as present-with-cancellation.

### Example 2 — edge (dosha only from Moon/Venus frames; exaltation cancellation)
Birth: 1992-03-02, 08:15 IST, Jaipur.
- Sidereal: Asc 346.26° (Meena/Pisces 16.26); Mars 316.18° (Makara/Capricorn 16.18); Moon 321.12° (Makara 21.12); Venus 321.58° (Makara 21.58).
- From Lagna (Pisces, ix 11): h = ((9−11+12) mod 12)+1 = **11th → no dosha** → `from_lagna=false`.
- From Moon (Capricorn, ix 9): h = ((9−9) mod 12)+1 = **1st → dosha** → `from_moon=true`.
- From Venus (Capricorn, ix 9): h = **1st → dosha** → `from_venus=true`.
- Cancellation: Mars in Makara = **exalted** → `cancelled=true`, reason "mars_exalted". This is the fixture proving the engine must NOT return a flat "Manglik" from the Moon/Venus flags alone.
- Reference-frame fixture: same person is simultaneously "not Manglik" (Lagna frame) and "Manglik, cancelled" (Moon/Venus frames) — exactly the disagreement users see across sites.

### Example 3 — boundary (4-minute birth-time error flips the verdict)
Birth: 1995-11-05, Mumbai, Mars in Scorpio (ix 7) all evening.
- 20:38 IST: Asc 59.60° (Vrishabha 29.60°, 0.40° before the Gemini boundary) → Mars house = ((7−1) mod 12)+1 = **7th → dosha** (Manglik).
- 20:42 IST: Asc 60.54° (Mithuna 0.54°) → Mars house = ((7−2) mod 12)+1 = **6th → no dosha** (non-Manglik).
- The Taurus→Gemini Ascendant crossing is ≈20:40 IST (computed: 20:35 → Taurus 28.90; 20:40 → Gemini 0.07). A ±4-minute birth-time error flips the verdict. Rule: when the Ascendant is within ~1° of a sign boundary (≈4 min at Mumbai's rising rate that night), flag "verdict sensitive to birth-time accuracy" and never present a bare boolean.
- Related house-level flip on the same evening: 18:40 IST → Asc Mesha 29.99° (0.01° before Vrishabha!) → Mars in 8th; at 18:45 → Asc Vrishabha → Mars in 7th. Both are dosha houses, so the verdict survives but the house number — which drives severity copy — flips. Any house-level test fixture near a boundary needs minute-precision birth times.

### Example 4 — reference-frame split without cancellation (extra)
Birth: 1990-06-15, 06:30 IST, Delhi.
- Sidereal: Asc 74.35° (Mithuna/Gemini 14.35); Mars 346.99° (Meena/Pisces 16.99); Moon 315.55° (Kumbha/Aquarius 15.55); Venus 24.52° (Mesha/Aries 24.52).
- From Lagna (Gemini, ix 2): h = ((11−2+12) mod 12)+1 = **10th → no dosha**.
- From Moon (Aquarius, ix 10): h = ((11−10) mod 12)+1 = **2nd → dosha** (2nd is in the adopted list; a strict Parashara {1,4,7,8,12} reading would say no dosha — documents the house-list variant's impact).
- From Venus (Aries, ix 0): h = ((11−0+12) mod 12)+1 = **12th → dosha**.
- No cancellation (Pisces is neither own sign nor exaltation for Mars) → net: non-Manglik from Lagna, dosha flagged from Moon + Venus frames → "Low/Partial (Anshik) Manglik" per AstroSage's scheme.

## 5. Complete output list

What a GOOD Mangal Dosha calculator shows:
1. Verdict `is_manglik` (boolean) + a human sentence, not a bare label.
2. Per-frame flags: `from_lagna`, `from_moon`, `from_venus` with the actual Mars house in each frame (`mars_houses`).
3. Severity: High (all three frames) vs Low/Partial ("Anshik") — AstroSage's scheme.
4. Cancellation analysis: `cancelled` + `cancellation_reason` (own sign/exaltation, Jupiter/Venus aspect — with the aspect house named), plus non-boolean notes (Navamsa support, strong Moon/Venus, age-28 belief, Manglik–Manglik pairing).
5. The house list used ({1,2,4,7,8,12}) and the ayanamsha, so professionals can audit.
6. Boundary warnings: Asc within ~1° of a sign boundary; Moon/Venus near sign boundary when time is unknown.
7. Chart display (North/South Indian toggle) — AstroSage offers both; useful because South Indian users think in Sevvai Dosham terms.
8. Remedies block (Hanuman worship Tuesdays, Mangal Shanti puja, Kumbh Vivah as a traditional option) — keep brief, non-fearful.
9. Disclaimers: traditional belief, not a scientific verdict; one chart flag alone doesn't decide a match; consult a qualified astrologer before marriage decisions.

Comparison vs leading competitors:
| Feature | AstroSage (free/mangal-dosha-report.asp) | GaneshaSpeaks (kundli/dosha/mangal-dosha) | AstroTalk (mangal-dosha-calculator) | DrikPanchang | Vyotish current |
|---|---|---|---|---|---|
| Verdict + from-Lagna/Moon/Venus breakdown | Yes (3-chart check; High vs Low) | Yes (houses {1,2,4,7,8,12}; Moon/Venus optional) | Yes (status + intensity) | No standalone calculator page found (kundli tool covers it) — UNVERIFIED | Yes (`from_lagna/moon/venus`, `mars_houses`) |
| Cancellation rules | Benefic aspect; two-Manglik marriage; age-28 (partial) | Own/exalted sign; Jupiter aspect; Navamsa; strong Moon/Venus | Implied via "intensity" | — | **Own-sign/exaltation only** — no Jupiter-aspect check |
| Severity (High/Partial "Anshik") | Yes | Yes (severity factors listed) | Yes ("intensity") | — | **Missing** |
| Gender input | Yes (both genders covered in text) | Yes (+ gendered remedies page) | Yes | — | **Missing** |
| Chart style toggle (N/S Indian) | Yes | — | — | — | None |
| Remedies (incl. Kumbh Vivah) | Yes (Kumbh Vivah, pujas, fasting) | Yes (separate remedies page) | Yes | — | `detail` string only |
| Disclaimer | None explicit | No | — | — | `verified:false` only |

### Current Vyotish outputs
Page `/calculators/mangal-dosha` — **BROKEN the same way as kaal-sarp: page calls `GET /api/v1/kundli`, route accepts only POST → users see a 404.** Engine exists (`manglik`): output `is_manglik, from_lagna, from_moon, from_venus, mars_houses {lagna,moon,venus}, cancelled, cancellation_reason, detail, verified:false`. Houses checked {1,2,4,7,8,12} from Lagna+Moon+Venus; cancelled only when Mars in Aries/Scorpio (own) or Capricorn (exalted).

### Initial gap list
1. **P0 — GET/POST route mismatch → 404 for every user.** (Same defect on kaal-sarp page.)
2. **No gender field** — competitors collect it; traditional matching flows expect it; copy/remedies are gendered (computation itself must stay gender-independent).
3. **Cancellation logic too thin**: only own-sign/exaltation. Add Jupiter-aspect (5th/7th/9th from Mars) as a deterministic second rule; expose the rest (Navamsa, strong Moon/Venus, age 28, Manglik–Manglik) as attributed notes, since all competitors list more than we do.
4. **No severity field** (High vs Low/Anshik per AstroSage's 3-frame scheme) — currently the three booleans exist but nothing tells the user "dosha in all three frames = worst case".
5. **No boundary warnings** (Asc/Moon/Venus near sign edges) — verdicts flip with minutes of birth time (Example 3).
6. **No time-unknown degradation** (from_moon/from_venus are computable without Asc; from_lagna is not).
7. **No remedies/disclaimer copy**; no Kumbh Vivah/Manglik–Manglik pairing notes that users arrive expecting.
8. **No chart display**, no house-list/ayanamsha disclosure in output for professional audit.
9. **No partial-manglik vocabulary** — "Anshik Manglik" is the term users search; map the 1-of-3-frames case to it explicitly.
10. `verified:false` needs a Jyotishi sign-off workflow.

## 6. Edge cases and validation rules

1. **Ascendant within ~1° of a sign boundary** (Example 3: 20:38 vs 20:42 IST flips Manglik→non-Manglik): warn; require minute-level birth time; never output a bare boolean in that state.
2. **Moon or Venus within ~1° of a sign boundary** (birth 1995-11-05 ≈21:00 IST: Moon Pisces 28.6→Aries): `from_moon`/`from_venus` flags flip; with unknown birth time, compute both candidate signs and warn.
3. **Mars near a sign boundary** (ayanamsha variants shift Mars ~1°): house-from-frame flips when Mars sits at a cusp; flag when Mars is within ~1° of any sign edge.
4. **Own-sign/exaltation cancellation** fixtures: Mars in Vrishchika (Example 1 — cancelled), Mars in Makara (Example 2 — cancelled), Mars in Meena (Example 4 — NOT cancelled, Pisces is neither own nor exalted). Regression-test all three.
5. **House-list variant impact**: the 2nd house matters (Example 4's from_moon=2nd is dosha in the {1,2,4,7,8,12} list, not in a strict {1,4,7,8,12} list). Pin the list in output; treat strict-Parashara and South-Indian lists as documentation, not settings.
6. **Frames disagree by design** (Example 2: Lagna-frame clean, Moon/Venus-frame flagged): the aggregation rule must be deterministic and stated (RECOMMENDED: verdict from Lagna frame; severity from frame count).
7. **Jupiter aspect check** (once implemented): Jupiter aspects = 5th, 7th, 9th from Mars by whole sign; require Jupiter sign-wise aspect only (degree orbs would be inventing rules). Test with a chart where Jupiter is in the 7th sign from Mars (e.g., Mars Aries, Jupiter Libra).
8. **Timezone/DST history**: Asc is lat/lng/tz-sensitive; a wrong tz shifts Asc by hours of rising → wrong Lagna frame entirely. Validate foreign births against known software.
9. **Gender neutrality**: verdict computation identical for all genders; assert engine output is gender-independent (gender only shapes copy).
10. **Date range**: 1900–2100 ephemeris validity; Mars moves ~0.5–0.7°/day — a wrong day (off-by-one at date boundaries) shifts Mars ~0.5° and Asc ~360°·(fraction) — assert UTC conversion at midnight boundaries.
11. **Boolean sanity**: `cancelled=true` must imply at least one frame was dosha-positive (never cancel a non-existent dosha); `is_manglik=true` + `cancelled=true` must be representable (Example 1) — the UI copy must handle that state, not just boolean-collapse it.

## 7. Sources

- AstroSage Mangal Dosha report page (houses from Lagna; South-Indian 2nd-house note; High vs Low from Lagna+Moon+Venus charts; cancellations: benefic aspect, two-Manglik marriage, age-28 "according to some astrologers"; Kumbh Vivah; both genders): https://www.astrosage.com/free/mangal-dosha-report.asp
- GaneshaSpeaks Mangal Dosha page (houses 1,2,4,7,8,12 from Lagna; Moon/Venus as additional frames; cancellations: Navamsa support, strong Moon/Venus, Jupiter aspect, Mars in Aries/Scorpio/exalted Capricorn): https://www.ganeshaspeaks.com/kundli/dosha/mangal-dosha
- GaneshaSpeaks Manglik remedies page (gendered remedies; Kuja Dosha cancellation mention): https://www.ganeshaspeaks.com/predictions/astrology/astrological-remedies-for-mangal-dosha
- AstroTalk Mangal Dosha calculator (status + intensity + remedies): https://astrotalk.com/mangal-dosha-calculator (per search result; page not fetched directly — UNVERIFIED details)
- DrikPanchang: no standalone Mangal Dosha calculator page surfaced in search (their Kundali tool covers dosha flags) — UNVERIFIED; do not cite a URL we haven't fetched.
- Classical house-list note (Parashara-derived {1,4,7,8,12}; 2nd added by South Indian Kuja/Chevvai Dosham tradition): as summarized on the AstroSage page above (South Indian 2nd-house quote) and in search-result summaries; treat the exact classical attribution as UNVERIFIED until a primary text (e.g., Jataka Parijata/Phaladeepika) is consulted.
- Ephemeris for all computed positions (Mars, Moon, Venus, Ascendant): JPL Horizons API (geocentric apparent RA/Dec, DE441), https://ssd.jpl.nasa.gov/api/horizons.api, reduced with the validated pipeline described in shani-sade-sati.md §4 (of-date mean obliquity, linear Lahiri; Ascendant via GMST/RAMC formula).
