# Rashi Calculator (Vedic Moon Sign / Chandra Rashi) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

The Rashi Calculator determines the **sidereal zodiac sign the Moon occupied at the moment of birth** (Chandra Rashi / चंद्र राशि / Janma Rashi). Unlike the Western Sun sign, Vedic astrology treats the Moon sign as the primary identity marker: it represents *manas* (mind, emotions, temperament) and is the anchor for most classical predictions.

Who uses it and why:
- **General consumers** checking "what is my moon sign?" — the most common entry point into Vedic astrology (AstroSage markets it as defining "inclinations, emotions, and personality").
- **Kundli/janam-patrika generation** — the Moon sign is the first line of every Vedic chart.
- **Marriage matching (Ashtakoota Guna Milan)** — score is computed primarily from the Moon signs and Moon nakshatras of both partners.
- **Naming ceremonies (Namkaran)** — the first syllable of a child's name is chosen from the Moon nakshatra pada.
- **Daily/monthly horoscopes** — Vedic transits (gochar) are read from the Moon sign.
- **Timing (Vimshottari Dasha)** — the Moon's nakshatra determines the dasha sequence; the rashi page is the natural funnel into it.
- **Muhurta selection** — the Moon's sign/strength is checked for auspicious timing.

Key behavior to communicate to users: the Moon moves ~13.2°/day (a full 360° orbit in ~27.32 sidereal days), i.e. **~1° every 2 hours**, and changes sign roughly every 2.5 days. A birth time that is off by 1–2 hours can change the result near a boundary (AstroSutra explicitly advises this; AskSoma shows an example where births an hour apart on 2026-09-09 fall in different signs).

## 2. Inputs

| Field | Required/Optional | Format & units | Valid range | Default | Why needed |
|---|---|---|---|---|---|
| Birth date | Required | Gregorian calendar date (DD/MM/YYYY) | ~1700–2200 (engine-dependent; JPL DE441 covers 1550–2650) | — | Moon position depends on the exact day (moves ~13.2°/day) |
| Birth time | Required for correctness | 24h HH:MM (IST or local zone) | 00:00–23:59 | **12:00 noon when omitted (Vyotish current behavior)** | Moon moves ~0.5°/hour; time matters near sign/nakshatra boundaries |
| Place of birth | Required | City name → lat/lng in decimal degrees + IANA timezone | lat −90..+90, lng −180..+180 | — | Only used to (a) resolve the correct timezone/DST offset to convert local→UT and (b) display local context; the Moon's geocentric position itself is location-independent (AskSoma) |
| Full name | Optional (not needed for math) | Free text | — | — | Personalization/persistence only; no effect on calculation |
| Gender | Optional (not needed for math) | Enum M/F/Other | — | — | Marketing/report wording only; no effect on calculation |
| Ayanamsha choice | Optional advanced | Enum (Lahiri default; Raman, KP, True Chitra, Fagan–Bradley) | — | Lahiri | Power users comparing systems; AstroSage exposes "Advanced Settings" with manual lat/lng/timezone |

### Recommended input set
A complete calculator of this type asks for: **birth date, exact birth time (with AM/PM disambiguation), place of birth (city autocomplete resolving to lat/lng + timezone)** — the same trio all four competitors use (AstroSage: date + time + place with advanced manual lat/lng/tz; DrikPanchang: date + time + place; AstroSutra and AskSoma: date + time + place). Name and gender are optional extras. An optional advanced ayanamsha selector (Lahiri default) is a differentiator. If birth time is unknown, the tool should ask for "morning/noon/evening" or default to 12:00 and **show a boundary-proximity warning**.

### Current Vyotish input set
`GET /api/v1/calculators/rashi?date&time&lat&lng&tz` on page `/calculators/rashi` — birth date, birth time (**optional, defaults 12:00**), place of birth via city autocomplete (lat/lng/tz). No gender, no name, no ayanamsha selector. Matches the recommended set except: no explicit "time unknown" affordance (silent noon default) and no ayanamsha choice.

## 3. Formula(s) / method

Exact method (this is the standard used by DrikPanchang, AstroSage, AstroSutra and Vyotish):

1. **Convert local clock time to Universal Time** using the place's timezone offset including historical DST rules. `UT = local_time − tz_offset`.
2. **Compute the Moon's geocentric apparent tropical ecliptic longitude** `λ_trop` for that UT instant, in the ecliptic/equinox **of date** (i.e., apparent position: light-time + stellar aberration + precession + nutation applied — this is the "apparent RA/Dec of date" frame; longitude is obtained from apparent RA α and Dec δ via `λ_trop = atan2(sin α·cos ε + tan δ·sin ε, cos α)` with ε = obliquity of date). Any high-precision ephemeris works: JPL DE441 (Horizons), Swiss Ephemeris (DE431), astronomy-engine (used by Vyotish).
3. **Subtract the ayanamsha** to get sidereal longitude: `λ_sid = λ_trop − A(T)` (mod 360°).
   - **Lahiri (Chitrapaksha)** — the Indian official standard since the Calendar Reform Committee, 1955: Sidereal zodiac pinned so Chitra (Spica) = 180° (0° Libra). Value ≈ 23°51′11″ at J2000, ≈ 24°13′13″ on 1 Jan 2026, growing ~50.3″/year.
   - **Vyotish implementation**: linear model `A = 23.853044° + 50.2564″/yr × (years since J2000)` subtracted from astronomy-engine's tropical Moon longitude.
4. **Map to rashi**: `signIndex = floor(λ_sid / 30)`; `degreeInSign = λ_sid − 30×signIndex`.
5. **Map to nakshatra (bonus output)**: span 360°/27 = 13°20′00″; `nakshatraIndex = floor(λ_sid / 13.333333°)`; `pada = floor((λ_sid mod 13.333333°) / 3.333333°) + 1` (pada 1–4).

Variants found in the wild (researched, both listed where they disagree):
- **Ayanamsha systems**: Lahiri (official; default on DrikPanchang/AstroSage/AstroSutra) vs Raman vs Krishnamurti (KP) vs True-Chitra (Spica pinned to 180° at every instant — Swiss Ephemeris `SE_SIDM_TRUE_CITRA`) vs Fagan–Bradley (Western sidereal). These differ from Lahiri by from a few arc-minutes (True Chitra) up to ~2° (Raman); outcomes near sign boundaries differ by hours of Moon travel. Swiss Ephemeris notes Lahiri is "ill-defined" in the strictest sense and reproduces the official Indian values via its precession model rather than a constant rate.
- **Ayanamsha time-model**: Vyotish's linear 50.2564″/yr vs Swiss Ephemeris' full precession polynomial. At 2026-01-01 Vyotish gives 24°12′58″ vs published 24°13′13″ — a **15″ (0.0042°) difference**, ~1/45th of a nakshatra pada, negligible except for births within seconds of a boundary.
- **Position reference**: apparent-of-date (aberration+nutation included) vs astrometric J2000 longitude pre-converted. Differences are ≤ ~0.005°, again negligible except at exact boundaries.
- **Ephemeris engine**: JPL DE441 (gold standard, Horizons), Swiss Ephemeris (DE431), astronomy-engine (pure-JS port-class library; README states lunar accuracy within ~1 arcminute — UNVERIFIED against this project, but pipeline validation below showed ≲1′ agreement), low-precision Moshier.

**RECOMMENDATION: keep Lahiri (Chitrapaksha) with the current linear Vyotish model.** Reasons: (a) it is the de-facto industry standard for Indian-astrology consumers and the official Indian panchang standard since 1955; (b) the 15″ gap vs Swiss Ephemeris' polynomial model is far below the 3°20′ pada granularity, so sign/nakshatra/pada outputs match mainstream sites; (c) switching ayanamsha would silently change results users have already received. Only add other ayanamshas as an explicit advanced option, never as default.

## 4. Worked examples (≥3: normal, edge, boundary)

All numbers below were computed 2026-11-21 with NASA JPL Horizons (DE441, geocentric apparent RA/Dec of date) + mean-obliquity conversion + the Vyotish linear Lahiri model, then cross-checked against the published AskSoma worked example for 2026-09-09 (agreement ≤1′). These are directly usable as automated test cases.

**Pipeline validation (published cross-check, AskSoma):** 2026-09-09 13:15 IST → computed λ_sid = 118.8349° = Karka (Cancer) 28°50′, Ashlesha pada 4 — published: "Cancer 28°49′, Ashlesha". 2026-09-09 15:45 IST → computed λ_sid = 120.3044° = Simha (Leo) 0°18′, Magha pada 1 — published: "Leo 00°18′, Magha". ✓

### Example 1 — Normal case
**Input:** 1990-05-15, 14:30 IST, New Delhi (28.6139 N, 77.2090 E, UTC+5:30) → UT = 09:00.
1. Horizons apparent Moon RA = 19h51m23.93s = 297.8497°; Dec = −22°16′38.6″ = −22.2774°.
2. Mean obliquity ε = 23.440544°.
3. Tropical longitude: λ_trop = atan2(sin 297.8497°·cos 23.4405° + tan(−22.2774°)·sin 23.4405°, cos 297.8497°) = **295.6195°**.
4. Ayanamsha (Vyotish model): days since J2000 = −3518.125 → years = −9.63278 → A = 23.853044 − 9.63278×(50.2564/3600) = **23.71858°**.
5. Sidereal: λ_sid = 295.6195 − 23.71858 = **271.9010°**.
6. Sign: floor(271.9010/30) = **9** → 10th sign = **Makara (Capricorn)**; degree in sign = 271.9010 − 270 = **1.9010° = 1°54′04″**.
7. Nakshatra: floor(271.9010/13.333333) = 20 (0-based) → **21st nakshatra, Uttara Ashadha**; in-nakshatra = 271.9010 − 266.66667 = **5.2343°**; pada = floor(5.2343/3.33333)+1 = **2**.
**Expected output:** Rashi = Makara (Capricorn) 1°54′ · Nakshatra Uttara Ashadha pada 2 · sign lord Saturn, nakshatra lord Sun.

### Example 2 — Boundary/cusp case (sign + nakshatra flip within 2 hours)
**Input:** 2026-09-09, Delhi, three times (IST):
- 13:15 IST (07:45 UT): λ_sid = **118.8349°** → Karka 28°50′, Ashlesha pada 4 (in-nak 12.1682°; pada = floor(12.1682/3.33333)+1 = 4). Lord: Moon / Mercury.
- **15:14 IST (09:44 UT): λ_sid = 120.0008°** — the Moon crosses 0° Simha (= end of Ashlesha / start of Magha) at **15:14 IST**: computed λ_trop = 144.2265°, ayan = 24.22562°, λ_sid = 120.0008°. Any birth from this minute is Leo/Magha.
- 15:45 IST (10:15 UT): λ_sid = **120.3044°** → Simha 0°18′, Magha pada 1.
**Expected behavior:** result flips Karka/Ashlesha→Simha/Magha at 15:14 IST; a calculator must not round a value like 119.9999° up, and should warn when within ~1° of a boundary.

### Example 3 — Unknown birth time (noon default fallback)
**Input:** 1990-05-15, time omitted → default 12:00 IST (06:30 UT).
1. Horizons RA = 296.5068°, Dec = −22.6178° → λ_trop = 294.3368°.
2. Ayanamsha = 23.71857° → λ_sid = **270.6182°**.
3. Sign: **Makara (Capricorn) 0°37′**; nakshatra Uttara Ashadha (index 20), in-nak 3.9515° → **pada 2** — same sign/nakshatra/pada as Example 1 (actual 14:30), degree differs by 1.28°.
**Expected behavior:** same result here, but the calculator should flag that with a noon default the moon has moved ≥1° by 14:30; had the birth been before ~10:40 IST the moon would still have been in Dhanu (Sagittarius) — a noon default silently returns the wrong sign in such cases. Rule: when time is defaulted, warn if `degreeInSign < 2°` or `degreeInSign > 28°` (moon can traverse ±2° within a ±4 h time uncertainty).

### Example 4 — Pre-1900 date (historical calendar/ΔT handling)
**Input:** 1889-01-31, 12:00 IST (06:30 UT), Allahabad.
1. Horizons (DE441 covers this epoch; mixed Julian/Gregorian handling automatic) RA = 313.1037°, Dec = −19.3542°.
2. ε = 23.453714° → λ_trop = **310.1651°**.
3. Ayanamsha: years since J2000 = −110.9227 → A = 23.853044 − 110.9227×0.01396011 = **22.30468°**.
4. λ_sid = 310.1651 − 22.30468 = **287.8604°** → **Makara (Capricorn) 17°52′**.
5. Nakshatra: floor(287.8604/13.333333) = 21 → **22nd nakshatra, Shravana**; in-nak = 287.8604 − 280.0 = 7.8604° → pada = floor(7.8604/3.33333)+1 = **3**.
**Expected output:** Makara 17°52′ · Shravana pada 3 · lord Saturn / Moon.

## 5. Complete output list

What a GOOD rashi calculator shows:
- **Primary result**: Moon sign in Sanskrit + English (e.g., मकर / Makara / Capricorn) and the sign glyph.
- **Degree within the sign** (DMS or decimal) — competitors show it so users can judge boundary proximity (AstroSutra shows the Moon's degree for exactly this reason; DrikPanchang kundali shows "12° Mesh 09′ 20″").
- **Sign lord** (rashi adhipati) — static lookup table (Mesha→Mars … Meena→Jupiter).
- **Element (tatva), quality, guna** for the sign — static attributes.
- **Nakshatra + pada + nakshatra lord** — every competitor (AstroSage, DrikPanchang, AstroSutra) pairs moon sign with janma nakshatra; the nakshatra lord is what drives Vimshottari.
- **Name-syllable (pada swar)** for the pada — DrikPanchang publishes the 108 pada-initials table; useful for namkaran users.
- **Moon sign-change context**: "Moon entered this sign on <date/time>, leaves on <date/time>" or a boundary-proximity percentage (DrikPanchang shows a "% into rashi" style figure).
- **Tropical (Western) moon sign** for comparison — AstroSage offers Western sun/moon signs alongside Vedic.
- **Chart position**: a north/south Indian chart snippet with the Moon highlighted, and house number counted from the Moon (Chandra lagna) — AstroSage/DrikPanchang show a mini chart.
- **Interpretation text**: 2–5 sentence personality/temperament write-up per sign (AstroSage has a paragraph per moon sign; AskSoma adds a disclaimer that these are traditional, not scientific).
- **Warnings/disclaimers**: birth-time sensitivity warning near boundaries; "traditional interpretations" disclaimer; accuracy note on ephemeris; pointer to full kundli/dasha.

Comparison vs leading competitors:

| Output | Vyotish (current) | AstroSage | DrikPanchang | AstroSutra |
|---|---|---|---|---|
| Moon sign (Sanskrit + English) | rashi string + rashiIndex | ✓ both | ✓ (janma rashi) | ✓ both + glyph span |
| Degree within sign | ✗ | ✓ (in kundli) | ✓ | ✓ |
| Sign lord | ✗ | ✓ (in kundli/report) | ✓ | ✓ (table) |
| Element/guna/attributes | ✗ | ✓ (report) | ✓ | ✓ (span table) |
| Nakshatra + pada | nakshatra, nakshatraIndex, pada | ✓ | ✓ | ✓ |
| Nakshatra lord | ✗ | ✓ | ✓ | — |
| Pada name-syllable | ✗ | ✓ (nakshatra page) | ✓ (108 pada swar table) | — |
| Boundary/time-accuracy warning | ✗ | — | — | ✓ (advice text) |
| Tropical/western moon sign | ✗ | ✓ (western moon sign tools) | — | — |
| Interpretation text | ✗ | ✓ (per-sign paragraph) | ✓ (rashi pages) | ✓ (context) |
| Ayanamsha transparency (value shown) | ✗ | advanced setting | — | ✓ (states 24°13′13″ @ 2026) |

### Current Vyotish outputs
`GET /api/v1/calculators/rashi?date&time&lat&lng&tz` (time optional, default 12:00) returns exactly: `rashi, rashiIndex, nakshatra, nakshatraIndex, pada`. Algorithm: astronomy-engine tropical Moon longitude − Lahiri ayanamsha (linear: 23.853044° @ J2000 + 50.2564″/yr); sign = floor(lon/30), nakshatra = floor(lon/(360/27)), pada 1–4. No interpretation text, no degree/longitude shown, no sign lord, no element.

### Initial gap list
1. **Moon degree within sign (and within nakshatra) not exposed** — users cannot judge boundary proximity; QA cannot distinguish "Capricorn 0°01′" from "Capricorn 29°59′".
2. **No sign lord** — a zero-cost static lookup that every competitor shows; also needed later for dasha-funnel consistency.
3. **No nakshatra lord** — needed to explain the Vimshottari link (rashi → nakshatra → dasha).
4. **No boundary-proximity warning** for the noon-default (unknown-time) case — recommend warning when degreeInSign < 2° or > 28°.
5. **No interpretation text** (personality/emotion blurb per sign) — the page currently has result-without-meaning.
6. **No element/tatva or sign attributes** shown.
7. **Ayanamsha not surfaced** — display "Lahiri ayanamsha 24°13′ (2026)" for trust + a QA-visible constant.
8. **No pada name-syllable** (namkaran use case).
9. **No funnel links** from rashi result → nakshatra page / vimshottari dasha.
10. **No historical-DST/tz validation messaging** for pre-1906 Indian dates (see section 6).

## 6. Edge cases and validation rules

- **Impossible/invalid dates**: reject 30 Feb, 31 Apr, 29 Feb on non-leap years, year 0; validate `date` parses strictly (no silent rollover like JS `Date("2023-02-30")` → 2 Mar). Far-range: astronomy-engine's usable range is ~1700–2200 (README claim — UNVERIFIED in this codebase); JPL DE441 covers 1550–2650. Decide a support window and clamp/error outside it.
- **Cusp/boundary times**: Moon moves ~0.51°/h here (Examples 1–3: 1.283° in 2.5 h). Rules: (a) never round λ_sid before floor; (b) if `λ_sid mod 30°` < ~0.5° or > 29.5°, attach a "near sign boundary" warning; (c) same for nakshatra boundaries (mod 13°20′) — pada width is only 3°20′ ≈ 6.6 h of Moon travel; (d) handle exact-boundary float cases (`λ_sid mod 30 == 0` → new sign, pada 1).
- **Timezone/DST**: use IANA tz db via lat/lng→city, not fixed offsets; note historical quirks — IST has been UTC+5:30 since 1955 but varied before (Calcutta +5:53:20 / Bombay +5:53:20 era, DST during the 1962 and 1965 wars — UNVERIFIED, verify against tz db before shipping historical messaging). For pre-1906 Indian births, recommend prompting users to confirm the timezone.
- **Polar regions**: Moon sign is geocentric — latitude does **not** change the result (AskSoma); only the timezone resolution differs (UTC+13 etc.). No polar fallback needed for the math, but tz lookup must not assume a "nearest city" that fails above ~66° lat.
- **Dates before 1900**: Horizons/SE handle Julian→Gregorian calendar switch (pre-1582 is Julian); ΔT is minutes-scale — irrelevant at pada granularity. The real risk is **user input interpretation** (e.g., "02/10/1869" D/M vs M/D) — enforce an unambiguous date format.
- **Unknown birth time fallback**: default 12:00 (current Vyotish behavior is fine and matches the "noon" convention), but must warn (Example 3 rule). Optionally offer "unknown time" mode that returns the sign range covered over the whole day if the Moon changes sign that day.
- **Rounding rules**: sign/nakshatra/pada via floor on unrounded λ_sid; display degrees rounded to the nearest minute (never second-level false precision with a 1′ engine); pada always integer 1–4; nakshatraIndex displayed 1-based to users (27) while API keeps 0-based internally — document which is which.
- **API robustness**: missing `time` → 12:00 default + `isApproximateTime: true` flag in response (add); invalid lat/lng out of range → 400; date out of engine range → 400 with message.

## 7. Sources

- AstroSutra — Vedic Moon Sign Calculator (method, Lahiri 24°13′13″ @ 2026-01-01, ~50″/yr growth, 1955 Calendar Reform Committee, sign/lord table, boundary advice): https://astrosutra.app/calculators/moon-sign
- AskSoma — How Your Vedic Moon Sign Is Calculated (UT conversion → geocentric apparent longitude → ayanamsha subtraction → sign/nakshatra mapping; 2026-09-09 worked example used for pipeline validation): https://asksoma.ai/blog/moon-sign-calculator-free-vedic-rashi-finder
- AstroSage — Moon Sign Calculator (inputs incl. advanced lat/lng/tz; per-sign interpretation content; Moon=mind/emotions framing): https://www.astrosage.com/moonSign.asp
- DrikPanchang — Rashi/Moonsign Calculator (janma rashi + janma nakshatra + pada outputs): https://www.drikpanchang.com/utilities/horoscope/hindu-moonsign-calculator.html
- DrikPanchang — Kundali (longitude display format "12° Mesh 09′ 20″ — Ashwini 4"): https://www.drikpanchang.com/jyotisha/kundali/kundali.html
- DrikPanchang — Hindu Name Initials (108 pada swars): https://www.drikpanchang.com/astrology/prediction/info/hindu-name-initials.html
- NASA JPL Horizons manual — apparent RA/Dec in equator/equinox of-date frame; DE441; Julian/Gregorian handling; 1550–2650 coverage: https://ssd.jpl.nasa.gov/horizons/manual.html · API doc: https://ssd-api.jpl.nasa.gov/doc/horizons.html
- Swiss Ephemeris general documentation — sidereal modes/ayanamsas (SE_SIDM_LAHIRI = 1, official Indian values, vs TRUE_CITRA): http://www.astro.com/swisseph/swisseph.htm (discussion: https://groups.io/g/swisseph)
- Ayanamsa background (Lahiri definition, Spica at 180°, competing systems): https://en.wikipedia.org/wiki/Ayanamsa
- NASA — Moon phases/orbit facts (sidereal month 27.32 days, ~13.2°/day): https://science.nasa.gov/moon/moon-phases/
- astronomy-engine (Vyotish's engine; stated lunar accuracy ~±1′ — engine claim, UNVERIFIED locally): https://github.com/cosinekitty/astronomy
- Numerical validation pipeline used for section 4: JPL Horizons DE441 apparent-of-date positions + IAU 1976 mean obliquity + Vyotish linear Lahiri model (script: `C:\Users\sanjay.bhati.OM\AppData\Local\Temp\vyo_calc.ps1`); agreement with published AskSoma example ≤1′.
