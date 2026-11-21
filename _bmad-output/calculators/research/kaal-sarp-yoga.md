# Kaal Sarp Yoga Check — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Kaal Sarpa Yoga/Dosha ("serpent of time") is claimed when all seven visible grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) fall on one side of the Rahu–Ketu axis. The calculator answers: (a) is the yoga present (full)? (b) in which direction (Rahu→Ketu vs Ketu→Rahu arc)? (c) which of the 12 named types (by Rahu's house from Lagna)?

Users:
- Fear-driven self-checkers: it is one of the most-searched "dosha" terms; most users arrive after another site flagged it.
- Matchmaking contexts and puja-related decisions (Kaal Sarp Dosh puja in Ujjain/Trimbakeshwar is a large remedies market — AstroSage, GaneshaSpeaks).
- Astrology students validating charts.

Credibility framing (must appear in output copy): AstroSage itself states the yoga "is not mentioned in any of the ancient astrological texts" and is a modern construct; the web debate includes outright "myth" positions. Copy should present the finding factually with the classical-text caveat, not fear. GaneshaSpeaks notes the same yoga is read positively by many ("some holders succeed greatly"; benefic when Rahu is in kendra/trikona per AstroSage).

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Birth date | required | DD/MM/YYYY | 1900–2076 (DrikPanchang) | — | Rahu/Ketu + 7 grahas sidereal positions at birth |
| Birth time | required | HH:MM(:SS) | — | — | Lagna determines Rahu's whole-sign house → the type name; also needed for the debated "Lagna side of axis" variant. Presence/direction can be computed without it, type cannot |
| Place of birth | required | city → lat/lng + tz | — | — | Lagna computation (geocentric grahas need only tz; Asc needs lat/lng) |
| Name / gender | optional | text; M/F | — | — | Personalization; all competitors ask |
| Ayanamsha | advanced, optional | Lahiri default; Raman/KP | — | Lahiri | Shifts Rahu by up to ~1° → can flip Rahu's house at sign boundaries, changing the type name |

### Recommended input set
Name (optional), gender (optional), date of birth, exact birth time, place of birth (city autocomplete → lat/lng/tz). A "time unknown" fallback should still report presence + direction and explicitly say the type (house from Lagna) cannot be determined. No "check date" is needed — this is a birth-chart (static) calculator, unlike sade-sati.

### Current Vyotish input set
Page `/calculators/kaal-sarp` takes birth date, optional time, place (city autocomplete → lat/lng/tz) — same form as sade-sati — but the page calls `GET /api/v1/kundli`, a route that only accepts POST → users get a 404 and no result at all. The engine itself (`kaalSarp`) is implemented and receives the standard birth-detail payload once the route mismatch is fixed.

## 3. Formula(s) / method

Definitions: sidereal longitudes (Lahiri) of the 7 grahas; Rahu = mean lunar node Ω (most Vedic software uses the mean node; Meeus: Ω = 125.04452° − 19.34136°×T, T = Julian centuries from J2000); Ketu = Ω + 180°. Whole-sign houses from Lagna.

Step-by-step (strict/full method):
1. Compute Rahu and Ketu sidereal longitudes; they define two 180° arcs: arc-A = Rahu→Ketu (longitudes rel = lon − Rahu in (0°,180°)) and arc-B = Ketu→Rahu (rel in (180°,360°)).
2. Classify each of the 7 grahas by its rel.
3. **Full yoga present iff all 7 grahas lie in the same arc.** Direction = `rahu_to_ketu` (arc-A) or `ketu_to_rahu` (arc-B).
4. Type = the named type indexed by Rahu's whole-sign house from Lagna (see table).
5. Output the evidence: which planet is closest to the axis and by how many degrees (needed for boundary warnings).

The 12 types (RECOMMENDED mapping — names verified on DrikPanchang and GaneshaSpeaks; AstroSage's list matches except it writes "Shankhnaad" for #9, evidently a typo for Shankhachud):
| # | Rahu house (Ketu opposite) | Name | (Alt spelling) |
|---|---|---|---|
| 1 | 1st / 7th | Anant | Ananta |
| 2 | 2nd / 8th | Kulik | Kulika |
| 3 | 3rd / 9th | Vasuki | — |
| 4 | 4th / 10th | Shankhpal | Shankhapal |
| 5 | 5th / 11th | Padam | Padma |
| 6 | 6th / 12th | Mahapadam | Mahapadma |
| 7 | 7th / 1st | Takshak | Takshaka |
| 8 | 8th / 2nd | Karkotak | Karkotaka |
| 9 | 9th / 3rd | Shankhachud | Shankhachoodh / Shankhnaad(AstroSage typo) |
| 10 | 10th / 4th | Ghatak | Ghataka |
| 11 | 11th / 5th | Vishdhar | Vishdhara |
| 12 | 12th / 6th | Sheshnag | Sheshnaag |

Variant naming found in circulation (document, do not adopt): some sites list the 8th–12th types as **Sheshnag (8th), Gandhak (9th), Shool (10th), Vish (11th), Patak (12th)**. The task's seed list follows this variant. Both circulate; the recommended table above is the one used by the three biggest consumer sites (DrikPanchang, GaneshaSpeaks, AstroSage). GaneshaSpeaks's own page contains mapping typos (Vasuki written as "2nd"; Shankhachur and Sheshnaag both written as 12th) — their list order still implies the recommended mapping; do not copy their page verbatim.

Known variant debates (list; recommendation at the end):
1. **Full vs partial**: Strict view — one planet outside the axis ⇒ no yoga at all ("There is no Kaal Sarpa Yoga if one world is outside of the Rahu Ketu axis" — GaneshaSpeaks; DrikPanchang explicitly declines to list partial cases, calling the concept not widely accepted). Lenient view — one planet escaping = "partial/ardha Kaal Sarpa", milder effects (psychologicallyastrology and several blogs). AstroSage: all seven hemmed, no partial.
2. **Direction**: (a) No direction requirement — any one-arc configuration is Kaal Sarpa Dosha (AstroSage, GaneshaSpeaks do not differentiate; Vyotish engine returns the axis direction without asserting one). (b) Kala Sarpa vs Kala Amrita Yoga — planets hemmed Rahu→Ketu = Kala Sarpa (malefic reading); hemmed Ketu→Rahu = **Kala Amrita Yoga**, read as softer/spiritual by many authors (search consensus; some schools say no dosha exists at all in that direction). (c) Anulom (Rahu→Ketu, milder) vs Vilom (Ketu→Rahu, stronger) naming (paramarsh.app).
3. **Lagna on the arc**: some traditions additionally require the Lagna to sit OUTSIDE the arc holding the planets ("the serpent encircles the chart"); debated and not universally accepted (paramarsh.app; web debate). Note Takshak-type charts put Ketu in the Lagna sign, which this variant would treat specially.
4. **Moon counting**: AstroSage explicitly includes the Moon among the hemmed seven; some schools exclude the Moon (checking it via the Chandra-kundli instead) — a source of divergent verdicts.
5. **Degree-level (orb) check at the boundary**: AstroSage instructs checking actual degrees, e.g., if Mars and Rahu share a sign, Mars must be at a LOWER degree than Rahu to count as inside the arc. Equivalent in spirit to Vyotish's continuous-180° check; the whole-degree arc test is cleaner than sign-level tests.
6. **Mean vs true node**: mean node (standard in Vedic software) vs true node differ by up to ±1.75° — boundary cases (a graha within ~2° of the axis) can flip. Vyotish should pin MEAN node and say so.
7. **Classical status**: no definition in Parashara/Jaimini (AstroSage and paramarsh.app agree) — keep the disclaimer.

RECOMMENDATION (with reason): adopt the strict full-yoga rule (all 7 in one arc, Moon included, mean node, continuous-180° arc with degree precision, Lahiri) + report direction + report the closest-graha margin; do NOT assert a type unless full; add an explicit `partial` informational state (n of 7 hemmed, which graha is outside) because users arrive with that vocabulary from other sites, while keeping `present:false` for partial cases like DrikPanchang. Reason: it matches DrikPanchang (strict), AstroSage (Moon in, degrees matter), and the engine's existing output contract (`axis`, `rahu_house`, `type`), while the informational partial line defuses the #1 source of "your site says no, AstroSage says yes" complaints.

## 4. Worked examples (≥3 per calculator: normal, edge, boundary)

All positions computed with the validated DE441 + linear-Lahiri pipeline (see shani-sade-sati.md §4 for validation); Mumbai = 19.0760N, 72.8777E, IST.

### Example 1 — normal (strict FULL, Ketu→Rahu direction, type Ghatak)
Birth: 2000-03-30, 22:15 IST, Mumbai.
- Sidereal longitudes (deg): Asc 213.83 (Vrishchika 3.83); Rahu 101.14 (Karka 11.14); Ketu 281.14; Su 346.43; Mo 285.79; Ma 11.74; Me 318.72; Ju 15.03; Ve 327.41; Sa 21.50.
- Rel to Rahu (mod 360): Su 245.28, Mo 184.65, Ma 300.60, Me 217.58, Ju 303.89, Ve 226.27, Sa 310.36 — **all 7 in (180°,360°) = Ketu→Rahu arc** → `present:true`, `axis:"ketu_to_rahu"`.
- Closest graha to the axis: Moon, 4.65° past Ketu (safe margin — verdict robust to ±1.75° node variant).
- Rahu's house: Asc sign Vrishchika (index 7), Rahu sign Karka (index 3) → house = ((3−7+12) mod 12)+1 = **9th** → type = **Ghatak**.
- Lagna (Vrishchika, rel 112.69) sits in the EMPTY arc (Rahu→Ketu) → also passes the strict "Lagna outside the occupied arc" variant. This chart is unambiguous under every variant.

### Example 2 — edge (full by 0.61°; Lagna inside the occupied arc; Rahu conjunct Lagna)
Birth: 2000-03-30, 14:15 IST, Mumbai.
- Sidereal: Asc 102.64 (Karka 12.64); Rahu 101.14 (Karka 11.14) — Rahu is 1.50° from the Ascendant degree, same sign → Rahu in 1st house.
- Moon 281.75 (Makara 11.75) → rel = 180.61 — **0.61° past the Ketu axis**; rel of the other six: Su 244.95, Ma 300.35, Me 217.23, Ju 303.81, Ve 225.85, Sa 310.32 — so all 7 grahas are (barely) in the Ketu→Rahu arc → strict verdict `present:true`, `axis:"ketu_to_rahu"`, type **Anant** (Rahu in 1st).
- The Lagna sits INSIDE the occupied arc → a calculator implementing the Lagna-arc variant would return NOT full.
- Assert both behaviors in tests: margin output (0.61°) must be surfaced with a "near-axis" warning; a true-node ephemeris (up to ±1.75° vs mean node) would flip Moon to the other arc and void the yoga — this single fixture exercises the mean-vs-true-node decision.

### Example 3 — boundary (partial by 0.90°; type must NOT be asserted)
Birth: 2000-03-30, 11:15 IST, Mumbai.
- Sidereal: Asc 62.15 (Mithuna 2.15 → Asc sign index 2); Moon 280.24 (Makara 10.24) → rel = 179.10 — **0.90° short of the Ketu axis**, i.e., Moon is in the Rahu→Ketu arc while the other six (Su rel 244.83, Ma 300.26, Me 217.09, Ju 303.78, Ve 225.70, Sa 310.30) are in Ketu→Rahu → 6-vs-1 split → strict `present:false`; lenient sites would call it "partial".
- Rahu's house from Lagna = 2nd → a buggy engine would emit type **Kulik**. The engine must return `type:null` (or omit) whenever the yoga is not full — this fixture is the regression test for that.
- Note: within ~3 hours around midday on this same day, Moon crossed the Ketu axis (179.10° at 11:15 → 180.61° at 14:15), so three nearby birth times on one date give partial / full+Anant / full+Ghatak — an excellent fixture family (all real numbers above).

### Example 4 — clean partial (one graha far outside; no orb ambiguity)
Birth: 1998-03-20, 05:45 IST, Mumbai.
- Sidereal: Asc 315.81 (Kumbha 15.81); Rahu 101.56 (Karka 11.56); Ketu 281.56; Su 335.62 (Meena 5.62); Mo 230.16 (Vrishchika 20.16); Ma 347.99; Me 353.76; Ju 316.59; Ve 289.13; Sa 356.46.
- Rel to Rahu: Su 234.05, **Mo 128.59**, Ma 246.42, Me 252.20, Ju 215.03, Ve 187.57, Sa 254.90 → six grahas in the Ketu→Rahu arc, Moon deep inside the Rahu→Ketu arc, 51.41° from the Ketu axis → `present:false`, evidence "6 of 7 hemmed; Moon outside by 51.4°". Rahu in 6th house — if it were full the type would be Mahapadam; engine must not say so.

## 5. Complete output list

What a GOOD Kaal Sarp calculator shows:
1. Verdict: `present` true/false (full yoga).
2. Direction/axis: `rahu_to_ketu` or `ketu_to_rahu` (+ optional Kala-Amrita labeling note if the direction is Ketu→Rahu).
3. Type: named type + Rahu's house from Lagna (only when full and birth time known).
4. Evidence: list of the 7 grahas with sign + degree, their rel-to-Rahu, which arc each is in, and the closest-approach margin in degrees (with a near-axis warning when < ~2°).
5. Partial information: when not full, "n of 7 hemmed; <graha> outside by x°" (defuses competitor mismatch).
6. Lagna position (+ note whether the Lagna sits inside or outside the occupied arc, since some traditions read that differently).
7. Chart display (North/South Indian style toggle — AstroSage offers both).
8. Remedies block: Shiva worship (Shiva/Gayatri mantra), Rudrabhishek, Maha Mrityunjaya, Kaal Sarp Dosh puja (Ujjain — AstroSage), feeding dogs — keep brief, optional, non-fearful.
9. Disclaimers: yoga not found in classical texts (AstroSage, paramarsh.app); not deterministic; full chart (esp. benefic placement of hemmed planets) tempers effects.

Comparison vs leading competitors:
| Feature | AstroSage (free/kaalsarp-yog.asp) | GaneshaSpeaks (learn-astrology/yogas/kal-sarpa-yoga) | DrikPanchang (kalasarpa-yoga-calculator) | AstroTalk (kaal sarp calculator) | Vyotish current |
|---|---|---|---|---|---|
| Presence verdict + type name | Yes (12 types incl. all-7 rule, Moon counted, degree rule) | Article + mapping (typos) | Yes (12 types; strict, no partial) | Yes (presence + type) | Yes (`present`, `type`) |
| Direction (Rahu→Ketu vs Ketu→Rahu) | Not differentiated | Not discussed | Not discussed | Not discussed | **Yes — `axis` (differentiator; keep)** |
| Degree/orb nuance at arc boundary | Yes (Mars-vs-Rahu degree rule) | — | — | — | Yes implicitly (continuous 180° arc) |
| Partial handling | No (all-7 strict) | Strict ("no yoga if one world outside") | Strict, partial explicitly not listed | — | Never asserts partial (no informational state) |
| Chart style toggle | Yes (N/S Indian) | — | — | — | None |
| Remedies | Extensive (Shiva, Rudrabhishek, Ujjain puja) | Yes | Puja links | Yes | `note` only |
| Classical-text disclaimer | Yes ("nothing in ancient texts") | No | No | — | None |
| Ayanamsha choice | Yes (advanced) | — | Yes (Lahiri default) | — | Fixed Lahiri |

### Current Vyotish outputs
Page `/calculators/kaal-sarp` — **BROKEN: the page calls `GET /api/v1/kundli` but that route only accepts POST → users see a 404 error.** Engine exists (`kaalSarp`): output `present, axis ("rahu_to_ketu"|"ketu_to_rahu"), rahu_house, type (named type), note, verified:false`. Rule implemented: all 7 grahas within 180° ahead of Rahu (i.e., full yoga on either arc, direction reported); type from Rahu's whole-sign house from Lagna; partial never asserted.

### Initial gap list
1. **P0 — page/route mismatch (GET vs POST `/api/v1/kundli`) → total user-facing failure.** Same defect on the mangal-dosha page.
2. No evidence block (graha longitudes/rel/margins) → Jyotishi review (`verified:false`) has nothing to verify against; also users can't reconcile "AstroSage says yes, we say no" in boundary cases.
3. No near-axis warning (<2°) where mean-vs-true-node choice can flip the verdict (Example 2: 0.61°).
4. No partial informational state (n-of-7, which graha outside) — competitor vocabulary gap.
5. Type-name table must be pinned to the recommended 12 (Anant…Sheshnag with Karkotak/Shankhachud/Ghatak/Vishdhar) — the alternate Sheshnag/Gandhak/Shool/Vish/Patak naming found on some sites (and in the seed list) must be an explicit i18n/variant decision, not silent.
6. No Lagna-in-arc disclosure (Example 2 would be read "not full" by that variant; currently invisible to the user).
7. No Kala-Amrita labeling note for Ketu→Rahu direction (most engines treat both as dosha; a note prevents confusion).
8. Mean-vs-true node not documented in output; Rahu's house and the verdict can differ at boundaries.
9. No remedies/disclaimer copy; no chart display; no "time unknown" degradation path (type requires Asc).
10. `verified:false` workflow (Jyotishi sign-off) missing.

## 6. Edge cases and validation rules

1. **Graha within ~2° of the Rahu/Ketu axis**: verdict is fragile (mean/true node ±1.75°; ayanamsha variant ±1°). Warn; never round silently. Fixtures: 2000-03-30 14:15 IST (0.61° past Ketu → full) vs 11:15 IST (0.90° short → partial).
2. **Rahu exactly on the Lagna degree/sign** (Example 2: Rahu 1.50° from Asc): house counting is stable (whole-sign) but the "Rahu in 1st → Anant" + "Lagna inside occupied arc" combination must both render.
3. **Type null when not full**: Example 3 asserts `type` is null despite Rahu being in the 2nd (Kulik bait).
4. **"Any five consecutive houses are always empty"** (DrikPanchang) — a full-yoga chart always leaves 5 consecutive signs with no graha; use as a cheap sanity assertion on the whole-sign rendering (catches arc-direction sign errors).
5. **Identity check**: sum of hemmed grahas across the two arcs must be exactly 7 (no graha counted twice, Rahu/Ketu themselves never counted).
6. **Mean node pinned**: document; true-node mode (if ever added) must be a separate output flag since it flips boundary cases.
7. **Birth time unknown / null**: `present`/`axis` computable; `rahu_house`/`type` not — degrade honestly.
8. **Ayanamsha**: Lahiri fixed (engine) but Raman/KP shifts Rahu up to ~1° → type can change at sign boundaries; state "as per Lahiri" in output.
9. **Planets exactly 180.00° from Rahu**: floating-point — define inclusive/exclusive boundary (recommend: rel ∈ (0,180) exclusive at both ends; rel==180 exactly = ON the axis → treat as outside the occupied arc with warning).
10. **Retrograde grahas** still count (hemming is positional); do not special-case.
11. **Outer planets (Uranus/Neptune/Pluto) must NOT be counted** — western-influenced tools sometimes include them; Jyotish canon is the 7 grahas.
12. **Date range**: ephemeris validity for DOB 1900–2100; Rahu cycle 18.6y — sanity-check that `rahu_house` recomputation is stable across a sample of 50k random births (property test: arc classification has no NaN/negative rel).

## 7. Sources

- DrikPanchang Kala Sarpa Yoga calculator (inputs incl. ayanamsha; strict full rule; partial not listed; 12 type names; "any five consecutive houses always empty"): https://www.drikpanchang.com/jyotisha/kalasarpa-yoga/kalasarpa-yoga-calculator.html
- AstroSage Kaal Sarp Dosh Finder (all 7 hemmed incl. Moon; Mars/Rahu degree rule; 12 types; remedies incl. Ujjain puja; "not in ancient texts"): https://www.astrosage.com/free/kaalsarp-yog.asp
- GaneshaSpeaks Kaal Sarp Yog article (strict rule quote; 12-type mapping with typos; "no Kaal Sarpa Yoga if one world is outside"): https://www.ganeshaspeaks.com/learn-astrology/yogas/kal-sarpa-yoga
- Paramarsh (Kaal Sarpa not in classical texts; anulom/vilom; Lagna-side debate; partial informal): https://paramarsh.app/patrika/yogas/kaal-sarpa-yoga-nodes-axis
- psychologicallyastrology, "The Almost Kaal Sarpa" (partial/lenient view): https://psychologicallyastrology.com/2018/12/03/the-almost-kaal-sarpa
- Kala Sarpa vs Kala Amrita direction distinction (search-surfaced; direction gives KSY vs KAY): summarized from search results on kala amrita yoga (no single canonical URL retrieved — treat the KSY/KAY naming as a documented variant, UNVERIFIED against a classical source)
- AstroTalk Kaal Sarp calculator (presence + type + effects + remedies): https://astrotalk.com/ (calculator listed via search result; page not fetched directly — UNVERIFIED details)
- Ephemeris for all computed positions: JPL Horizons API (geocentric apparent RA/Dec, DE441), https://ssd.jpl.nasa.gov/api/horizons.api, reduced with mean node Ω = 125.04452° − 19.34136°·T (Meeus, Astronomical Algorithms ch. 47) + linear Lahiri model (validation described in shani-sade-sati.md §4).
