# Rising Sign / Lagna Calculator (जन्म लग्न) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

The Lagna (ascendant / rising sign) is the **sidereal zodiac sign rising on the eastern horizon at the exact moment and place of birth**. It is the structural backbone of a Vedic chart: the lagna's sign becomes the **1st house**, and in the Vedic whole-sign system every other sign occupies one house in sequence — so all planetary house placements, yogas and dasha readings are anchored to it. While the Moon sign represents the mind (per AstroSage's framing: Moon = emotions/inclinations, Lagna = the self/body/persona), the lagna is treated as the primary "who you are" marker alongside the Moon.

Who uses it and why:
- **Kundli generation** — every janam-patrika starts with the lagna line (sign + degrees + nakshatra).
- **Astrologers** — house placements, lagna lord strength, and dasha interpretation all hang off the lagna.
- **Consumers asking "what is my rising sign?"** — in Western astrology this is the single most-searched chart point; the Vedic lagna page should capture the same intent.
- **Marriage matching** — lagna and lagna lord compatibility supplement Moon-based Guna Milan.
- **Muhurta** — DrikPanchang publishes daily lagna start/end times because practitioners elect activities in auspicious rising signs; the same engine powers birth-time lagna.
- **Horary (Prashna)** — the lagna at the moment of a question is the chart.

Critical difference vs the Moon calculators: **the lagna depends on birth time much more strongly** — it advances ~1° per 4 minutes (LivePanditji) and completes a full 360° per day, so a 1-hour birth-time error moves it ~15° (one whole sign), and the noon-default convention that is tolerable for Moon sign is **not tolerable for lagna**.

## 2. Inputs

| Field | Required/Optional | Format & units | Valid range | Default | Why needed |
|---|---|---|---|---|---|
| Birth date | Required | Gregorian date (DD/MM/YYYY) | ~1700–2200 | — | Determines sidereal time and obliquity of date |
| Birth time | **Required (hard)** | 24h HH:MM (seconds optional) | 00:00–23:59 | none — must not silently default to 12:00 | Lagna moves ~1°/4 min (~15°/h); wrong time ⇒ wrong sign ≈ 1 sign per hour of error |
| Place of birth | Required | City → **latitude & longitude** (decimal degrees) + IANA timezone | lat −90..+90 (reject ±90), lng −180..+180, east positive | — | Latitude/longitude enter the formula directly (unlike Moon sign, where place only fixes the timezone); tz/DST converts local→UT |
| Name / gender | Optional | free text / enum | — | — | Personalization only; no math effect |
| Ayanamsha (advanced) | Optional | Enum, default Lahiri | — | Lahiri | Sidereal lagna = tropical asc − ayanamsha; AstroSage exposes Lahiri/KP/Raman etc. |
| House system (advanced) | Optional | Enum: whole-sign (default, Vedic rashi chart), Sripati/bhava-chalit, equal | — | Whole-sign | Determines house assignments derived from the lagna; the rising degree itself is house-system independent |

### Recommended input set
Birth date + exact birth time + place of birth resolving to **lat/lng + timezone** — the same trio used by AstroSage's Rising Sign calculator (date/time/place; name+gender elsewhere on the site), DrikPanchang's Janma Lagna calculator (date/time/place) and Prokerala. A lagna tool should refuse to compute (or clearly mark "cannot determine") when birth time is unknown — every competitor treats time as mandatory here.

### Current Vyotish input set
**No dedicated lagna page** — the featured card links to `/kundli`. The kundli flow takes birth date, optional birth time (12:00 default!), city autocomplete (lat/lng/tz) and posts `POST /api/v1/kundli`, which computes lagna among all chart points. Gap: optional time with silent noon default is dangerous for lagna (see section 6).

## 3. Formula(s) / method

Standard astronomical method (as described by LivePanditji's manual method and Wikipedia's Ascendant article; this is also what Vyotish's engine implements as the spherical-ASC-minus-Lahiri approach):

1. **Local time → UT** using the place's timezone + DST. `UT = local − offset`.
2. **Greenwich Mean Sidereal Time** (Meeus, Astronomical Algorithms eq. 12.4), with `d` = days since J2000.0 (2000-01-01 12:00 UT), `T = d/36525`:
   `GMST = 280.46061837 + 360.98564736629·d + 0.000387933·T² − T³/38710000` (degrees, mod 360).
3. **Local sidereal time / RAMC**: `RAMC = GMST + longitude_east` (mod 360) — the right ascension of the local meridian.
4. **Obliquity of date** (IAU 1976 mean): `ε = 23°26′21.448″ − 46.8150″T − 0.00059″T² + 0.001813″T³`.
5. **Tropical ascendant** (ecliptic longitude of the eastern-horizon intersection):
   `λ_asc = atan2( cos(RAMC), −(sin(RAMC)·cos ε + tan(φ)·sin ε) )`, normalized to [0°, 360°).
   Equivalent classical form: `tan L = −cos(RAMC) / (cos ε·sin(RAMC) + sin ε·tan φ)` with a +180° flip and quadrant test to select the eastern (ascendant) root — LivePanditji gives the disambiguation test `−cos L·sin(RAMC) + sin L·cos ε·cos(RAMC) > 0`. The atan2 form above selects the correct root directly (verified at three control points and against a published worked example below).
6. **Sidereal lagna**: `λ_lagna = λ_asc − A(T)` (mod 360°), Lahiri ayanamsha (Vyotish: 23.853044° @ J2000 + 50.2564″/yr).
7. **Map**: `lagnaSignIndex = floor(λ_lagna/30)`; `degreeInSign = λ_lagna mod 30`; optionally `nakshatra = floor(λ_lagna/13°20′)`, `pada = floor((λ_lagna mod 13°20′)/3°20′)+1`; `house = lagnaSignIndex` position in the whole-sign wheel (the sign itself is house 1; a planet in sign X sits in house `((X − lagnaSignIndex) mod 12) + 1`).

Variants (researched, and where they differ):
- **House systems**: whole-sign (Vedic rashi chart standard; each sign = one house), Sripati/bhava-chalit (equal-ish houses from the bhava madhya), equal-house, Placidus (Western). The **rising degree is identical** across all of them; only house assignments differ. DrikPanchang/AstroSage default to whole-sign and offer bhava chalit separately. **RECOMMEND whole-sign as the house basis**, matching Vedic convention.
- **GMST vs GAST**: GAST adds the equation of the equinoxes (Δψ·cos ε ≈ up to ~1.1 s of time ≈ 15″ of RAMC) — negligible at lagna granularity (0.1° = 24 s of time). Hand methods skip it (LivePanditji explicitly says it can be skipped).
- **Mean vs true obliquity**: Δε_nutation ≤ ~9.2″ → ASC shift ≪ 0.01°. Negligible.
- **TT vs UT**: ΔT ≈ 1 min for 1990s dates → RAMC error ≈ 0.003°. Negligible.
- **Rising-time tables (Lagna Sarani)** vs direct formula: tables (sign-rise durations by latitude & epoch) are the traditional shortcut; the direct sidereal-time formula is exact and is what modern engines use. LivePanditji shows the table agreeing with the formula (Leo at LST 03:16–05:34 for Delhi 2026).
- **Ayanamsha**: Lahiri vs others — identical situation to rashi.md section 3; Lahiri is the standard and Vyotish's choice.
- **Different "lagnas"**: hora lagna, ghati lagna, bhava lagna, Pranapada are sunrise-based specialty points (LivePanditji notes they use different arithmetic) — out of scope for a birth lagna calculator, but the page should not confuse them with the janma lagna.

**RECOMMENDATION: keep the current approach — Meeus GMST + atan2 ascendant formula + Lahiri subtraction + whole-sign houses.** It matches the published worked example to 1 arcminute (section 4), is the same math DrikPanchang/AstroSage describe, and the only real risk (root selection / longitude sign) is handled by atan2 + east-positive longitude.

## 4. Worked examples (≥3: normal, edge, boundary)

All numbers from the validated pipeline (Horizons DE441 only needed for Moon; the ASC here is pure sidereal-time/geometry — validated against a published example to 0.1′).

### Example 1 — Validation against published worked example
**Input:** 1992-07-08, 09:20 IST, New Delhi (28.6139 N, 77.2090 E, UTC+5:30) → UT = 03:50.
1. d = −2733.34028 days from J2000; T = −0.0748650.
2. GMST = 280.46061837 + 360.98564736629×(−2733.34028) + 0.000387933×T² − T³/38710000 = **343.8510°** (published: 343.8510° ✓).
3. RAMC = 343.8510 + 77.2090 = 421.0600 − 360 = **61.0600°** (published: 61.0600° ✓).
4. ε = 23.440264°.
5. λ_asc(tropical) = atan2(cos 61.06°, −(sin 61.06°·cos 23.4403° + tan 28.6139°·sin 23.4403°)) = **154.6182°** (published: 154.6183° ✓).
6. Ayanamsha (Vyotish linear) = 23.74857° → λ_lagna = 154.6182 − 23.74857 = **130.8697°**.
7. **Simha (Leo) 10°52′** — published result: Leo 10°51′ (their Lahiri value 23.7523° differs from the linear model by 13.6″; 1′ total agreement ✓). Nakshatra: floor(130.8697/13.33333) = 9 → **Magha**, inNak = 10.8697° → **pada 4**. Lord: Sun.
Note from the published walkthrough: omitting the ayanamsha gives tropical Virgo (+23.8° error); using the IST meridian 82.5°E instead of Delhi's longitude shifts the lagna +4.6°; forgetting UT shifts +72° — three classic bugs worth keeping as QA negatives.

### Example 2 — Normal case
**Input:** 1990-05-15, 14:30 IST, New Delhi → UT = 09:00.
1. d = −3518.125; GMST = 7.8300°; RAMC = 7.8300 + 77.2090 = **85.0390°**.
2. ε = 23.440544°.
3. λ_asc(tropical) = atan2(cos 85.039°, −(sin 85.039°·cos 23.4405° + tan 28.6139°·sin 23.4405°)) = **175.6278°**.
4. Ayanamsha = 23.71858° → λ_lagna = **151.9092°**.
5. Sign: floor(151.9092/30) = 5 → **Kanya (Virgo) 1°55′** (151.9092 − 150).
6. Nakshatra: floor(151.9092/13.33333) = 11 → **Uttara Phalguni**, inNak = 5.2425° → **pada 2**. Lagna lord: Mercury.
7. Whole-sign houses: Virgo = house 1; Moon at 271.9010° (Makara) = sign 9 → house ((9−5) mod 12)+1 = **house 5** from lagna.

### Example 3 — Boundary case (sign flips within 10 minutes)
**Input:** 1990-05-15, New Delhi, times around the Kanya-rising onset (sidereal 150° = Virgo 0°):
- 14:20 IST (08:50 UT): GMST = 5.3231°, RAMC = 82.5321° → λ_asc = 173.4198° → λ_lagna = **149.7012° = Simha 29°42′** (Uttara Phalguni pada 1... inNak = 149.7012 − 146.66667 = 3.0345° → pada 1).
- **14:21 IST (08:51 UT): λ_lagna = 149.9219° — still Simha.**
- **14:22 IST (08:52 UT): λ_lagna = 150.1427° = Kanya 0°09′ — Virgo rising begins ≈ 14:21–14:22 IST.**
- 14:30 IST: 151.9092° (Example 2); 14:45 IST (09:15 UT): RAMC = 88.7992° → λ_lagna = **155.2230° = Kanya 5°13′** — the lagna advanced **5.52° in 25 minutes** (~1°/4.5 min at this latitude/sign).
**Expected behavior:** a birth certificate recorded "14:30" vs a remembered "14:20" gives different lagna signs here; the tool must show the degree (so users see 29°42′ proximity) and warn within ~2° of any sign boundary. QA test: exact pair (14:20 → Simha, 14:22 → Kanya).

### Example 4 — Location dependence (same instant, different city) + southern hemisphere
**Input:** 1990-05-15, 14:30 **Sydney time (UTC+10)** = 04:30 UT, Sydney (−33.8688, 151.2093).
1. GMST = 300.1452°; RAMC = 300.1452 + 151.2093 = 451.3545 − 360 = **91.3545°**.
2. λ_asc(tropical) = atan2(cos 91.3545°, −(sin 91.3545°·cos 23.4405° + tan(−33.8688°)·sin 23.4405°)) = **182.0820°** (southern latitude enters via tan φ sign).
3. λ_lagna = 182.0820 − 23.71857 = **158.3634° = Kanya (Virgo) 8°22′**, Uttara Phalguni **pada 4**.
**Expected behavior:** at the same UT, Delhi's 09:00-UT lagna was Virgo 1°55′ and Sydney's 04:30-UT lagna Virgo 8°22′ — different RAMC and latitude change both the value and (generally) the sign; the formula is valid for negative latitudes. (Same city, 5.5 h clock offset between IST and AEST, shows why tz resolution matters.)

### Example 5 — Pre-1900 date and near-boundary edge
**Input:** 1889-01-31, 12:00 IST (06:30 UT), Allahabad (25.4358, 81.8463).
1. GMST = 228.1748°; RAMC = 228.1748 + 81.8463 = **310.0211°**; ε = 23.453714°.
2. λ_asc = atan2(cos 310.0211°, −(sin 310.0211°·cos 23.4537° + tan 25.4358°·sin 23.4537°)) = **51.4060°** (tropical).
3. Ayanamsha = 22.30468° → λ_lagna = **29.1013° = Mesha (Aries) 29°06′** — only **0.90°** below the Taurus boundary.
4. Nakshatra: floor(29.1013/13.33333) = 2 → **Krittika**, inNak = 2.4346° → **pada 1**. Lord: Mars/Sun (sign Mars, nakshatra Sun).
**Expected behavior:** result valid for the historical epoch; boundary warning should fire (0.9° < 2°).

## 5. Complete output list

What a GOOD lagna calculator shows:
- **Primary**: lagna sign (Sanskrit + English + glyph) and the **ascendant degree within the sign** (D°M′S″ — DrikPanchang shows "12° Mesh 09′ 20″" style precision; degree is essential because time errors hide in it).
- **Lagna lord** (ruling planet of the rising sign) — DrikPanchang shows it; it's the anchor for chart interpretation.
- **Lagna nakshatra + pada** (+ nakshatra lord) — as on DrikPanchang kundali.
- **Whole-sign chart** (north/south Indian style) with houses 1–12 labeled and planets placed; optionally bhava-chalit positions (DrikPanchang/AstroSage offer chart styles).
- **The lagna–Sun–Moon triad**: rising sign + moon sign + (western) sun sign together — AstroSage's rising-sign tool pairs the ascendant with sun/moon signs; most users arrive knowing one of the three.
- **Rising context**: "your lagna changed from Simha at ~14:21 to Kanya at 14:22 that day" or a daily lagna timetable (DrikPanchang's daily lagna page lists start/end times of all 12 lagnas for a city — useful muhurta content and a great trust signal).
- **Interpretation text**: 1–2 paragraphs on the rising sign (AstroSage generates a personality description from the rising sign).
- **Warnings**: birth-time-critical warning (result within 2° of a boundary OR time defaulted); timezone/DST confirmation for the place; disclaimer that lagna is invalid without a reliable birth time.
- **Funnel links**: full kundli, dasha, matching.

Comparison vs leading competitors:

| Output | Vyotish (current) | AstroSage | DrikPanchang | LivePanditji |
|---|---|---|---|---|
| Lagna sign | sign + signIndex | ✓ (+ personality text) | ✓ | ✓ (kundli) |
| Ascendant degree in sign | `lon` (raw degrees, not formatted) | ✓ (in kundli) | ✓ (DMS) | ✓ |
| Lagna lord | ✗ | ✓ (kundli/report) | ✓ | ✓ |
| Lagna nakshatra + pada | nakshatra, nakshatraIndex, pada, house | ✓ | ✓ (+ nakshatra lord/sub) | ✓ |
| Whole-sign chart with houses | ✓ (via kundli) | ✓ (chart styles) | ✓ | ✓ |
| Sun+Moon+Lagna triad view | ✗ (separate tools) | ✓ | ✓ (via kundali) | — |
| Daily lagna timings (muhurta) | ✗ | — | ✓ (12 lagna start/end) | — |
| Boundary / time-critical warning | ✗ | — | — | ✓ (manual method notes 1°/4 min) |
| Dedicated lagna page/URL | ✗ (links to /kundli) | ✓ | ✓ | ✓ (blog+tool) |
| Ayanamsha transparency | ✗ | ✓ (advanced selector) | — | ✓ (shows 23.7523° in example) |

### Current Vyotish outputs
No dedicated page — featured card links `/kundli`. `POST /api/v1/kundli` returns `lagna {lon, sign, signIndex, nakshatra, nakshatraIndex, pada, house}`; lagna computed via the spherical ASC formula minus Lahiri ayanamsha (matches the recommended method; validation above shows the math class is correct). No interpretation, no lagna lord, no boundary warnings, no human-formatted degree.

### Initial gap list
1. **No dedicated lagna/rising-sign page** — a top-funnel search intent ("rising sign calculator") currently bounced to a full-kundli tool.
2. **Birth time optional with silent 12:00 default on the kundli flow** — for lagna this can be off by up to ~15°/hour (a whole sign per hour of error); should require time or clearly mark the result "unreliable — no birth time".
3. **Ascendant degree not human-formatted** (`lon` raw float) — users and QA need D°M′.
4. **No lagna lord** shown.
5. **No boundary warning** (most important of all four calculators: Example 3 shows a 2-minute flip).
6. **No lagna–Sun–Moon triad presentation** for users comparing with Western astrology.
7. **No interpretation text** for the rising sign.
8. **No ayanamsha/precision disclosure** (e.g., "Lahiri 23°43′07″ on 1990-05-15").
9. **No daily lagna timings** (muhurta-adjacent content competitors own).

## 6. Edge cases and validation rules

- **Birth-time precision is the #1 risk**: lagna advances ~0.25°/min (Example 3: 5.52° in 25 min at Delhi in a short-ascension sign; ~1°/4 min average globally). Rules: (a) require birth time for a lagna result — never silently default; if time unknown, return "lagna cannot be determined" (a noon default can be off by up to ~180°); (b) warn when `degreeInSign < 2°` or `> 28°`; (c) show minutes, not just the sign.
- **Timezone/DST errors move the lagna ~15° per hour** — more than the formula's own error by 4 orders of magnitude. Validate city→lat/lng/tz (IANA db, date-aware DST); display the resolved offset + UT back to the user ("14:30 IST = 09:00 UT") for trust. Sign convention: longitude **east positive** — an E/W swap shifts RAMC by 2×longitude (e.g., ±77° for Delhi) and lands the lagna in a random other sign; add a negative-longitude test case.
- **Root selection (ascendant vs descendant)**: the atan2 formula returns the eastern point; the classical tan form returns one root then flips +180° with the quadrant test (LivePanditji). QA must include at least one case per quadrant of RAMC to catch a 180°-off bug (Example 1's published source lists "keeping the descendant" as a common error costing exactly 180°).
- **Polar regions**: the formula is finite for |φ| < 90°; at Tromsø (69.65 N) on 1990-05-15 11:00 UT (midnight-sun season) it still yields a valid value (λ_lagna = 139.7437° = Simha 19°44′, computed in section 4 pipeline) because the horizon still intersects the ecliptic; degenerate only as |φ| → 90° (tan φ → ∞). Rules: reject |lat| ≥ 89.9°; keep computing for high latitudes but note whole-sign house interpretation is traditionally latitude-bound. No southern-hemisphere sign flip (Example 4 validates the tan φ sign behavior).
- **Exact-boundary floats**: λ_lagna = 150.0 exactly → sign index 5 (Kanya), degree 0°00′, nakshatra #12 (Uttara Phalguni? — 150° → nakIndex = floor(150/13.3333) = 11, inNak = 3.3333 → pada 2 start). Use `mod` normalization before floor; clamp pada sub-expression; test λ = k×30° for k = 0..11.
- **Sidereal-time accumulation errors**: GMST polynomial (Meeus 12.4) is good to ~0.1 s of time (≈0.04″) — fine; GAST nutation (~1 s ≈ 15″) and ΔT (≤1 min pre-1950 ≈ 0.25°) are ignorable at display granularity but matter if degrees are shown to arcseconds — display to arcminute only.
- **Dates before 1900 / calendars**: Julian–Gregorian and ΔT handled by ephemeris/library (Example 5); enforce unambiguous date parsing; historical Indian timezones pre-1955 (Calcutta/Bombay local mean times) — UNVERIFIED against tz db; prompt users for pre-1906 dates.
- **Rounding**: floor on unrounded λ; display D°M′ (arcseconds only if the engine is validated to that level); house numbers 1–12 integers; never show "Simha/Kanya cusp" as a third state.
- **Cross-checks**: the lagna must always satisfy `lagna sign − descendant sign = 6 signs` (mod 12), and the MC (if shown) must satisfy `tan MC = tan(RAMC)/cos ε` — cheap self-consistency assertions for QA.

## 7. Sources

- LivePanditji — How to Calculate Lagna Manually: Local Sidereal Time (six-step method, GMST formula, RAMC, ascendant tan-formula + root test, Lahiri subtraction, published worked example 1992-07-08 Delhi used for validation, common-mistake costs, Lagna Sarani tables, hora/ghati/bhava lagna distinction): https://www.livepanditji.com/blog/how-to-calculate-lagna-manually-local-sidereal-time
- Wikipedia — Ascendant (definition, ecliptic–horizon intersection, RAMC-based formula): https://en.wikipedia.org/wiki/Ascendant
- Meeus, Astronomical Algorithms — GMST eq. 12.4 (as applied by LivePanditji and standard engines; cited via the LivePanditji walkthrough)
- DrikPanchang — Janma Lagna (Birth Ascendant) Calculator (rising sign + degree + lagna lord + nakshatra): https://www.drikpanchang.com/utilities/horoscope/hindu-lagna-calculator.html
- DrikPanchang — Daily Lagna timings (start/end of all 12 lagnas per city, Pushkara Navamsha): https://www.drikpanchang.com/muhurat/lagna.html
- AstroSage — Rising Sign (Ascendant) Calculator (inputs date/time/place; rising sign + personality description; sun/moon pairing): https://www.astrosage.com/free/rising-ascendant-calculator.asp
- AstroSage — Ascendant reference page: https://www.astrosage.com/planet/ascendant/default.asp
- AstroSutra — Moon sign page (Lahiri context; sign/lord table reused for lagna lords): https://astrosutra.app/calculators/moon-sign
- NASA JPL Horizons manual (sidereal-time/UT conventions, DE441 range, apparent-of-date frames): https://ssd.jpl.nasa.gov/horizons/manual.html · https://ssd-api.jpl.nasa.gov/doc/horizons.html
- Swiss Ephemeris general documentation (sidereal mode/ayanamsa background): http://www.astro.com/swisseph/swisseph.htm
- Numerical pipeline for section 4: Meeus GMST + IAU 1976 obliquity + atan2 ascendant + Vyotish linear Lahiri (`C:\Users\sanjay.bhati.OM\AppData\Local\Temp\vyo_calc.ps1`); validated to 1′ against the LivePanditji published example (tropical 154.6182° vs 154.6183°).
