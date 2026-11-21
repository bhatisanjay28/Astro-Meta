# Nakshatra Calculator (Moon Nakshatra + Pada / जन्म नक्षत्र) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

The Nakshatra Calculator finds the **lunar mansion (janma nakshatra, जन्म नक्षत्र) the Moon occupied at birth and its pada (quarter, चरण/पाद)** — 27 nakshatras of exactly 13°20′ each, each divided into 4 padas of 3°20′, partitioning the 360° sidereal zodiac (Wikipedia; DrikPanchang). This is arguably the single most operationally important Vedic output because:

- **Vimshottari Dasha** — the nakshatra's lord starts the 120-year planetary period sequence; the fraction of the nakshatra traversed at birth determines the "balance at birth". Every dasha calculator is downstream of this result.
- **Marriage matching (Ashtakoota)** — Gana Koota (6 pts), Yoni Koota (4 pts), Nadi Koota (8 pts), Rajju and others are all computed from the two partners' birth nakshatras (Prokerala markets these kootas directly from the nakshatra finder).
- **Naming (Namkaran)** — the birth pada fixes the first syllable of the child's name (108 pada swars; DrikPanchang maintains the authoritative table).
- **Muhurta, daily panchang, personality reports** — nakshatra is the base unit of Indian calendrics (moon transits one nakshatra per ~1 day).
- **Users**: parents (naming), matchmakers/couples, astrologers, panchang consumers, and general users who know their "star" (birth star culture is stronger than sign culture in South India especially).

The Moon moves ~13.2°/day, so it crosses one nakshatra every ~24.5 h and one **pada every ~6.1 h** — birth-time precision matters far more here than for the sun-sign-style tools.

## 2. Inputs

| Field | Required/Optional | Format & units | Valid range | Default | Why needed |
|---|---|---|---|---|---|
| Birth date | Required | Gregorian date (unambiguous DD/MM/YYYY) | ~1700–2200 (engine range) | — | Moon's nakshatra changes daily (~24.5 h per nakshatra) |
| Birth time | Required for correctness | 24h HH:MM[:SS] local | 00:00–23:59 | **12:00 noon when omitted (Vyotish)** | Pada boundary every ~6.1 h; a 3 h error can flip the pada (and thus the name syllable and dasha balance) |
| Place of birth | Required | City → lat/lng + IANA timezone | lat −90..90, lng −180..180 | — | Timezone/DST resolution to get UT; Moon position itself is geocentric/location-independent |
| Name | Optional | Free text | — | — | AstroSage asks for it (personalization); no math effect |
| Gender | Optional | M/F/Other | — | — | AstroSage asks for it (report wording); no math effect |
| Ayanamsha (advanced) | Optional | Enum: N.C. Lahiri (default), KP New/Old, B.V. Raman, KP Khullar, Sayan | — | Lahiri | AstroSage exposes a full ayanamsa selector on its nakshatra finder; ayanamsha shifts the Moon's sidereal longitude and can flip nakshatra/pada near boundaries |
| Scheme (27 vs 28) | Optional advanced | Enum | — | 27 (Abhijit ignored) | Some traditions insert Abhijit (28th mansion, 276°40′–280°53′20″); see section 3 variants |

### Recommended input set
Birth date + exact birth time + place of birth (city autocomplete → lat/lng + tz) — identical to AstroSage's nakshatra finder (which adds name + gender + advanced ayanamsha/chart settings), DrikPanchang's Janma Nakshatra calculator (date + time + place), and Prokerala's Nakshatra Finder (date + time + location). Plus: explicit "time unknown" handling with warning, and an optional ayanamsha selector (Lahiri default).

### Current Vyotish input set
**No dedicated nakshatra page exists** — the featured calculator card reuses the rashi page (`/calculators/rashi`, `GET /api/v1/calculators/rashi?date&time&lat&lng&tz`, time optional → 12:00), which happens to compute nakshatra + pada as part of the moon-sign result. Inputs: date, optional time, city autocomplete. No name, gender, ayanamsha selector, or scheme option.

## 3. Formula(s) / method

1. **Convert local birth time → UT** (timezone + DST from place).
2. **Compute Moon's geocentric apparent tropical longitude** `λ_trop` (of-date frame, same as rashi; from an ephemeris such as JPL DE441, Swiss Ephemeris, or astronomy-engine).
3. **Subtract Lahiri ayanamsha**: `λ_sid = λ_trop − A` (mod 360°). Vyotish model: `A = 23.853044° + 50.2564″/yr × years since J2000` (≈ 24.2160° at 2026-01-01 vs published 24°13′13″ = 24.2203° — 15″ difference, negligible vs the 3°20′ pada).
4. **Nakshatra index**: span `S = 360°/27 = 13°20′00″ = 13.333333…°`; `nakIndex = floor(λ_sid / S)` (0-based 0–26; display 1-based 1–27).
5. **Pada**: `inNak = λ_sid − nakIndex × S`; `pada = floor(inNak / (S/4)) + 1`, `S/4 = 3°20′00″ = 3.333333…°` → pada 1–4. **Clamp pada to 3 in the sub-expression** (`min(floor(inNak/(S/4)), 3)`) to protect against floating-point drift when `inNak` lands within epsilon of `S`.
6. **Derived attributes (static lookups)**: nakshatra lord (dasha lord) from the fixed cycle **Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury → (repeat ×3)**: Ashwini=Ketu, Bharani=Venus, Krittika=Sun, Rohini=Moon, Mrigashira=Mars, Ardra=Rahu, Punarvasu=Jupiter, Pushya=Saturn, Ashlesha=Mercury, then Magha starts the cycle again; deities, gana, yoni, nadi and pada syllables from the standard 27-row table (Wikipedia "List of Nakshatras"; DrikPanchang pada-swar table).
7. **Fraction traversed** (feeds Vimshottari): `f = inNak / S` (0–1). **Balance at birth** for the nakshatra lord's dasha = `lord_years × (1 − f)`.

Variants (researched):
- **Ayanamsha**: Lahiri (standard; default everywhere) vs KP vs Raman vs True-Chitra — see rashi.md section 3. A ±2° ayanamsha difference can move the Moon ±1 nakshatra near a boundary.
- **27 vs 28 nakshatra scheme (Abhijit)**: the classical 28-mansion scheme includes **Abhijit spanning 276°40′–280°53′20″** (last quarter of Uttara Ashadha + first 53′20″ of Shravana) — some tools flag births in this zone as "Abhijit nakshatra" (auspicious; used in muhurta), while the standard 27-scheme assigns those births to Uttara Ashadha pada 4 or Shravana pada 1. Wikipedia's List of Nakshatras and multiple panchang sources describe the zone; mainstream calculators (AstroSage, DrikPanchang, Prokerala) use the 27-scheme. **RECOMMEND the 27-scheme as output**, optionally surfacing an "Abhijit zone" informational flag.
- **Mean vs true Moon**: mean lunar longitude can differ from the true/apparent Moon by up to ~6° (equation of center) — i.e., up to half a nakshatra. Nobody reputable uses the mean Moon for janma nakshatra; every mainstream tool uses the true/apparent Moon. **RECOMMEND apparent (true) geocentric Moon of date** — matches Vyotish's astronomy-engine.
- **Moment convention**: birth-time tools use the Moon at the exact birth instant; **daily-panchang tools evaluate at sunrise** (DrikPanchang day-panchang convention). A birth calculator must use the birth instant, not sunrise.
- **Ephemeris engine**: same variants as rashi.md (DE441 / SE / astronomy-engine); all agree well within ±1′, which is 1/800th of a nakshatra — safe.

## 4. Worked examples (≥3: normal, edge, boundary)

All computed with the validated pipeline (JPL Horizons DE441 apparent-of-date Moon + mean obliquity + Vyotish linear Lahiri; pipeline validated ≤1′ against published example — see rashi.md).

### Example 1 — Normal case
**Input:** 1990-05-15, 14:30 IST (09:00 UT), New Delhi.
1. Horizons: RA = 297.8497°, Dec = −22.2774°; ε = 23.440544° → λ_trop = 295.6195°.
2. Ayanamsha = 23.71858° → **λ_sid = 271.9010°**.
3. Nakshatra: S = 13.333333°; floor(271.9010/13.333333) = **20 (0-based) → #21 Uttara Ashadha** (starts 266°40′).
4. inNak = 271.9010 − 266.66667 = **5.2343°** → pada = floor(5.2343/3.333333)+1 = **2** (pada 2 spans 270°00′–273°20′).
5. Fraction traversed f = 5.2343/13.333333 = **0.39257**.
**Expected output:** Nakshatra = Uttara Ashadha · Pada 2 · name syllable "Bho" · lord (dasha) Sun · deity Vishwadevas · gana Manushya · yoni Mongoose · Moon sign Makara (Capricorn) · 39.3% of nakshatra elapsed.

### Example 2 — Pada boundary (syllable and dasha balance flip in ~6 hours)
**Input:** 1990-05-15, Delhi. Pada 2→3 boundary of Uttara Ashadha is at λ_sid = 273°20′ = 273.33333°.
- 14:30 IST (09:00 UT): inNak = 5.2343° → **pada 2**, syllable "Bho".
- **17:20 IST (11:50 UT): Horizons RA = 299.3669°, Dec = −21.8774° → λ_trop = 297.0762° → λ_sid = 273.3576° → inNak = 6.6910° → pada 3**, syllable "Ja". The boundary (inNak = 6.6667°) was crossed at ≈ **17:18 IST**.
- 19:30 IST (14:00 UT): λ_sid = 274.4738° → inNak = 7.8071° → **pada 3**, syllable "Ja" still.
**Expected behavior:** 17:20 birth must show pada 3; a birth at 17:10 is pada 2. Same nakshatra → same dasha lord (Sun), but the dasha **balance at birth changes by ~11% of Sun's 6 years** across the pada boundary — the pada, not just the nakshatra, is load-bearing for dasha.

### Example 3 — Nakshatra boundary + Abhijit zone (edge)
**Input:** 1990-05-16, 01:30 IST (20:00 UT), Delhi.
1. Horizons: RA = 306.6125°, Dec = −19.7446° → λ_trop = 304.1500°; ayan = 23.71861° → **λ_sid = 280.4314°**.
2. floor(280.4314/13.333333) = **21 → #22 Shravana** (starts 280°00′); inNak = 0.4314° → **pada 1**, syllable "Ju/Khi" (DrikPanchang swar table).
3. **Abhijit check**: Abhijit zone = 276°40′–280°53′20″ (276.667–280.8889°). λ_sid = 280.4314° falls **inside the zone** → tool should optionally flag "birth in Abhijit kshetra" while still outputting Shravana pada 1 under the 27-scheme.
**Expected behavior:** 27-scheme output Shravana pada 1; optional Abhijit flag on; do NOT switch the nakshatra itself.

### Example 4 — Sign+nakshatra boundary crossing (boundary case, validated against published source)
**Input:** 2026-09-09, Delhi.
- 13:15 IST: λ_sid = 118.8349° → nakIndex = floor(118.8349/13.333333) = 8 → **Ashlesha #9** (spans 106°40′–120°00′); inNak = 118.8349 − 106.66667 = 12.1682° → pada = floor(12.1682/3.333333)+1 = **4** — matches published "Cancer 28°49′, Ashlesha" (AskSoma).
- **15:14 IST (09:44 UT): λ_sid = 120.0008° → nakIndex 9 → Magha #10, pada 1** — the 27th-nakshatra "0" boundary at exactly 120° = also the Leo sign boundary.
- 15:45 IST: λ_sid = 120.3044° → Magha pada 1 — matches published "Leo 00°18′, Magha".
**Expected behavior:** crossing flips nakshatra lord Mercury→Ketu and restarts the dasha cycle — the highest-stakes boundary in the calculator.

### Example 5 — Unknown time (noon default)
**Input:** 1990-05-15, time omitted → 12:00 IST (06:30 UT): λ_sid = 270.6182° → Uttara Ashadha, inNak = 3.9515° → **pada 2** (same pada as the 14:30 actual birth in Example 1 — lucky), but degree differs 1.28°. With the 17:18 pada boundary only ~2.8 h after noon, an unknown-time birth could plausibly be pada 2 or 3 → **warn** when inNak is within ~1.5° of any pada boundary under a noon default.

## 5. Complete output list

What a GOOD nakshatra calculator shows:
- **Primary**: nakshatra # (1–27) + name in Sanskrit/Devanagari + transliteration.
- **Pada (charan) 1–4** and the **degree within the nakshatra** (e.g., "12°10′ of 13°20′" or % traversed) — needed to sanity-check the dasha balance.
- **Nakshatra lord (dasha lord)** — the planet whose Vimshottari period runs at birth; explicitly linked ("your Sun dasha runs until <date>").
- **Pada name-syllable** (pada swar) for naming ceremonies (DrikPanchang's 108-pada table).
- **Deity** (Ashwini Kumaras, Yama, Agni … Pushan) — Wikipedia/DrikPanchang table.
- **Matching attributes**: gana (Deva/Manushya/Rakshasa), yoni (animal), nadi (Adi/Madhya/Antya), varna, vashya, tatva, paya — Prokerala outputs janma nakshatra, pada, moon sign, lord, deity, yoni, gana, varna together; gana/yoni/nadi are consumed by Guna Milan.
- **Moon sign (rashi)** the nakshatra falls in, and the 2–3 signs the nakshatra spans (e.g., Uttara Ashadha spans 266°40′–280°00′: pada 1 in Dhanu/Sagittarius, padas 2–4 in Makara/Capricorn) — AstroSutra publishes per-sign pada maps.
- **Nakshatra sign-change times**: "Moon entered <nak> at <time>, leaves at <time>" (panchang-style context; DrikPanchang shows moon nakshatra entry/exit on day panchang).
- **Interpretation text**: 1–2 paragraphs of nakshatra personality (AstroSage links all 27 detail pages; competitors surface a summary).
- **Warnings**: pada-boundary proximity + unknown-time warning; Abhijit-zone informational flag.
- **Funnel links**: Vimshottari dasha (uses lord + fraction), Guna Milan (uses gana/yoni/nadi), full kundli.

Comparison vs leading competitors:

| Output | Vyotish (current) | AstroSage | DrikPanchang | Prokerala |
|---|---|---|---|---|
| Nakshatra + pada | nakshatra, nakshatraIndex, pada | ✓ (+ individual detail pages ×27) | ✓ (birthstar calculator) | ✓ |
| Nakshatra lord | ✗ | ✓ (via pages/kundli) | ✓ | ✓ |
| Deity | ✗ | ✓ (detail pages) | ✓ | ✓ |
| Gana / yoni / nadi / varna | ✗ | ✓ (in matching) | ✓ (via pages) | ✓ (all four) |
| Pada name syllable | ✗ | ✓ ("lucky name" flow) | ✓ (dedicated swar pages) | — |
| Degree/% within nakshatra | ✗ | ✓ (kundli degrees) | ✓ (panchang degrees) | — |
| Dedicated page/URL | ✗ (reuses rashi page) | ✓ | ✓ | ✓ |
| Ayanamsha selector | ✗ | ✓ (Lahiri/KP/Raman/Khullar/Sayan) | — (Lahiri) | — (Lahiri) |
| Boundary/unknown-time warnings | ✗ | — | — | — |
| Dasha balance link | ✗ (kundli only) | ✓ (nakshatra → dasha tool) | ✓ | ✓ |

### Current Vyotish outputs
No dedicated page; featured card reuses `/calculators/rashi`. API (`GET /api/v1/calculators/rashi`) returns `nakshatra, nakshatraIndex, pada` (0-based nakshatra index, pada 1–4) computed from Lahiri-adjusted Moon longitude — same numbers as rashi, nothing nakshatra-specific added.

### Initial gap list
1. **No dedicated nakshatra page/URL** — SEO and user intent ("what is my nakshatra?") are distinct from rashi; every competitor has a standalone tool.
2. **No nakshatra lord** — the single most important derived value (drives Vimshottari); static 27-row lookup, trivial to add.
3. **No pada name-syllable** — the namkaran use case is a high-traffic intent (DrikPanchang's swar pages).
4. **No deity/gana/yoni/nadi/varna attributes** — required for any future Guna Milan and expected by users.
5. **No degree/percentage within nakshatra** — hides how close the dasha balance is to the truth; also no QA-visible boundary proximity.
6. **No pada-boundary or unknown-time warnings** (pada flips every ~6.1 h; noon default spans up to ±2 pada boundaries within a day's uncertainty).
7. **No interpretation text** per nakshatra/pada.
8. **No Abhijit-zone flag** — decision documented (27-scheme output + optional flag recommended).
9. **No funnel** from nakshatra result → vimshottari dasha or matching.

## 6. Edge cases and validation rules

- **Pada boundary arithmetic**: pada = floor(inNak/3.333333…)+1; when inNak is within float epsilon of 13.3333… (e.g., λ_sid = 279.99999999), floor may yield pada 4 → clamp to 3 and let the nakshatra index handle the rollover; compute `S` as `360/27` (not the literal 13.333333) everywhere so remainder arithmetic is exact.
- **Index range**: λ_sid must be normalized to [0, 360) **before** floor — λ_sid = 360.0 (float drift) yields nakIndex 27 (out of range) and signIndex 12 with degreeInSign 30. Normalize + wrap inNak with `min(floor(inNak/(S/4)),3)`.
- **Boundary sensitivity**: nakshatra boundary every 13°20′ (~24.5 h), pada boundary every 3°20′ (~6.1 h). At the Moon's slowest apparent motion (~11.8°/day near apogee) a pada still flips every ~6.8 h; at fastest (~15°/day near perigee) ~5.3 h — so **no birth-time uncertainty policy below ±3 h is ever "pada-safe"**: always warn when inNak < 1° or > 12.33° under approximated time.
- **Unknown birth time**: noon default (Vyotish) spans 3.2° of Moon travel at mean speed — can cross a pada boundary (Example 5) but rarely a full nakshatra boundary (13.3°); nakshatra-level result is usually safe, pada-level is not → show "pada approximate" badge when time defaulted.
- **Abhijit zone (276°40′–280°53′20″)**: 27-scheme output mandatory; flag optional; never emit nakshatra #28 in the index — if a future 28-scheme option is added it must be a separate, explicitly labeled output.
- **Exact-boundary floats**: λ_sid = 120° exactly → nakIndex 9 (Magha pada 1), not Ashlesha pada 4 (Example 4); tests must cover λ_sid = k×13.333333° for k = 0…26 (inclusive lower bound belongs to the new nakshatra).
- **Impossible/invalid dates**: same validation as rashi.md (strict date parse, engine range ~1700–2200, 400 errors); pre-1900 Julian/Gregorian + ΔT handled by ephemeris (Horizons DE441 / SE); historical IST offsets pre-1955 (Calcutta/Bombay local times) — UNVERIFIED against tz db; gate historical messaging.
- **Polar/timezone**: result is geocentric — latitude-independent; only tz resolution varies (UTC+13 zones fine). Never apply DST twice (some tz db APIs need the date, not just the zone).
- **Rounding**: floor for indices; display inNak as D°M′ within the 13°20′ span; percentage to 1 decimal; never round λ_sid before all floors.
- **Sunrise-convention confusion**: panchang sites report the day's nakshatra at sunrise; a birth calculator must compute at the birth instant — QA should include a case where the two differ (e.g., birth late evening on a day whose "panchang nakshatra" is the previous one).

## 7. Sources

- Wikipedia — List of Nakshatras (27 nakshatras × 13°20′, lords, deities, yoni, gana, pada syllables, Abhijit zone): https://en.wikipedia.org/wiki/List_of_Nakshatras
- Live Pandit Ji — 27 Nakshatras table (spans, lords, deities, gana): https://www.livepanditji.com/nakshatra
- AstroSage — Nakshatra Calculator (inputs incl. name/gender + advanced ayanamsa selector Lahiri/KP/Raman/Khullar/Sayan; outputs birth star + pada + rashi; 27 detail pages): https://www.astrosage.com/nakshatra-calculator.asp
- DrikPanchang — Janma Nakshatra (Birthstar) Calculator: https://www.drikpanchang.com/utilities/horoscope/hindu-birthstar-calculator.html
- DrikPanchang — 108 Nakshatra Pada Swars (name syllables per pada): https://www.drikpanchang.com/swar-siddhanta/nakshatra/nakshatra-pada-swar-siddhanta.html
- DrikPanchang — Hindu Baby Name Calculator (names from janma nakshatra): https://www.drikpanchang.com/utilities/horoscope/hindu-baby-name-calculator.html
- Prokerala — Nakshatra Finder (outputs janma nakshatra, pada, moon sign, lord, deity, yoni, gana, varna; Lahiri): https://www.prokerala.com/astrology/nakshatra-finder
- MahaJyotish — Rashi & Nakshatra Finder (rashi, star, deity, lucky day/number/colour, name letters): https://mahajyotish.com/tools/rashi-nakshatra-finder
- NASA JPL Horizons manual (apparent-of-date Moon, DE441, 1550–2650 coverage): https://ssd.jpl.nasa.gov/horizons/manual.html · https://ssd-api.jpl.nasa.gov/doc/horizons.html
- NASA — Moon phases (27.32-day sidereal month, ~13.2°/day): https://science.nasa.gov/moon/moon-phases/
- AstroSutra — Moon sign page (each sign = 9 nakshatra padas; Lahiri values): https://astrosutra.app/calculators/moon-sign
- AskSoma — Moon sign method + published 2026-09-09 example used to validate the numeric pipeline: https://asksoma.ai/blog/moon-sign-calculator-free-vedic-rashi-finder
- Swiss Ephemeris docs (sidereal modes, Lahiri vs True Chitra): http://www.astro.com/swisseph/swisseph.htm
- Numerical pipeline: JPL Horizons DE441 + IAU 1976 obliquity + Vyotish linear Lahiri (`C:\Users\sanjay.bhati.OM\AppData\Local\Temp\vyo_calc.ps1`).
