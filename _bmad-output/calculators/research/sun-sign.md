# Sun Sign Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Story note: the owner originally titled this "sun shine calculator"; an earlier story established the product as **Sun Sign** (Western tropical + Vedic sidereal).

## 1. Purpose and who uses it

Given a birth date (ideally + birth time + birth place), returns the person's **Sun sign** — in *both* systems Vyotish serves: the **Western tropical sign** (the one everyone knows: "I'm a Leo") and the **Vedic sidereal sun rashi** (used by Indian/panchang users; also fixes things like Makar Sankranti-based festival sign logic). Output also carries the sign's element, ruling planet, and the date window covered, plus a cusp warning when the birth is near a sign-change instant.

Audience: general entertainment users ("what's my sign" is the single most-searched astrology query), Vedic users who need the sun rashi alongside the janma rashi, and festival-oriented users checking Sankranti timing. AstroSage's sun-sign tool explicitly computes "for the exact moment of birth" — the expectation in this market is ephemeris-grade, not a fixed date table.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| birth date | required | ISO `YYYY-MM-DD` | 1900–2100 (ephemeris range) | — | tropical sign is date-driven to within ~1 day |
| birth time | optional but strongly recommended | `HH:MM` 24-h, local clock | 00:00–23:59 | 12:00 local if omitted | sign changes at a specific UTC instant; cusp-day births cannot be resolved without time |
| birth timezone (or place) | optional | IANA tz or place name (lat/lon + tz) | any | user's detected zone | converts local birth time to UTC; place also needed for later nakshatra/moon work |
| ayanamsha | optional (advanced) | enum: Lahiri (default), Raman, KP, others | — | Lahiri | Vedic sun rashi depends on ayanamsha choice; Lahiri is the Indian default |

When time/place are omitted the result must be labelled "date-only: sign assumed at 12:00 local; if born on a cusp day, provide birth time."

### Recommended input set
`birth date` + `birth time` + `birth place` (place resolves tz, matches AstroSage/DrikPanchang's DOB + time + place input pattern) + advanced ayanamsha selector defaulting to Lahiri. Date-only fallback allowed with an explicit caveat banner on cusp days.

### Current Vyotish input set
`GET /calculators/sun-sign?date` — date only, computed at a fixed **12:00 UTC**, no time/place input. This silently produces wrong sidereal rashi for cusp-day births (see worked example 1: on 2025-01-14 every birth before 09:03 IST is Dhanu, but 12:00 UTC = 17:30 IST → always Makar).

## 3. Formula(s) / method

### 3.1 Tropical (Western) sign — the only correct rule
`tropical_sign = floor(tropical_sun_longitude / 30)`, longitude in [0°, 360°), 0–30 Aries, …, 330–360 Pisces; intervals half-open **[a, b)** so exactly 30° is Taurus, exactly 270° is Capricorn (Wikipedia gives the sign sectors with closed-first/open-second endpoints). The Sun's longitude must come from an ephemeris (Meeus / Swiss Ephemeris), because the ingress into each sign happens at a specific UTC instant that drifts every year — e.g., the tropical Capricorn ingress (December solstice) was **2024-12-21 09:20 UTC**, **2025-12-21 15:03 UTC**, **2026-12-21 20:50 UTC** (~5 h 43 m later each year until leap-day resets) (EarthSky-type solstice tables). Aquarius ingress 2025: **~Jan 19, 20:00 UTC** (3:00 PM EST per astrology ephemeris sources).

### 3.2 Standard tropical boundary dates table (popular reference, ±1 day)
For display ("dates covered") only — never as the deciding rule:

| Tropical sign | Element | Lord | Common date range |
|---|---|---|---|
| Aries | Fire | Mars | Mar 21 – Apr 19 |
| Taurus | Earth | Venus | Apr 20 – May 20 |
| Gemini | Air | Mercury | May 21 – Jun 20 |
| Cancer | Water | Moon | Jun 21 – Jul 22 |
| Leo | Fire | Sun | Jul 23 – Aug 22 |
| Virgo | Earth | Mercury | Aug 23 – Sep 22 |
| Libra | Air | Venus | Sep 23 – Oct 22 |
| Scorpio | Water | Mars | Oct 23 – Nov 21 |
| Sagittarius | Fire | Jupiter | Nov 22 – Dec 21 |
| Capricorn | Earth | Saturn | Dec 22 – Jan 19 |
| Aquarius | Air | Saturn | Jan 20 – Feb 18 |
| Pisces | Water | Jupiter | Feb 19 – Mar 20 |

Note the well-known table variance: popular US sources give Aquarius Jan 20 – Feb 18/19 and Pisces Feb 19 – Mar 20; Wikipedia's sector chart prints adjacent-day variants (e.g., Capricorn 22 Dec – 20 Jan). This variance is itself the argument for computing from longitude: **the table is an approximation of the true half-open longitude intervals; cusp days must always be resolved by the ingress instant of the birth year.**

**Cusp-day problem, precisely stated:** a sign changes at a specific UTC instant each year, not on a calendar date. A birth at 2025-01-19 18:00 UTC is tropical Capricorn; 3 hours later it is tropical Aquarius. Any date-only table is wrong for such births in some years.

### 3.3 Sidereal (Vedic) sun rashi
`sidereal_longitude = tropical_sun_longitude − ayanamsha` (normalize to [0,360)); `rashi_index = floor(sidereal_longitude / 30)` (0 = Mesha … 11 = Meena; Mesha starts at sidereal 0°). Ayanamsha: **Lahiri (Chitrapaksha) ≈ 24°12′ for 2025** (≈ 24°12′16″; increases ~50.3″/year — crosses 24°13′ early 2026). Rashi names/lords: Mesha Mars, Vrishabha Venus, Mithuna Mercury, Karka Moon, Simha Sun, Kanya Mercury, Tula Venus, Vrishchika Mars, Dhanu Jupiter, Makar Saturn, Kumbha Saturn, Meena Jupiter.

### 3.4 Makar Sankranti as the sidereal Capricorn ingress
Makar Sankranti is by definition the moment the Sun enters **sidereal** Capricorn (sidereal longitude 270°). Because tropical Capricorn ingress (Dec solstice) is ~24° of precession earlier in longitude, Sankranti falls ~23–24 days after the solstice: **2025-01-14, 09:03 IST** (widely reported; Punya Kaal 09:03–17:46 IST that day). The date oscillates Jan 14/15 (e.g., 2027: ingress 21:10 IST Jan 14 → observed Jan 15). This is the canonical cross-check for the sidereal module: `sidereal_sun_longitude(2025-01-14T03:33Z) ≈ 270°` (09:03 IST = 03:33 UTC).

### 3.5 RECOMMENDATION
Compute both signs from one ephemeris call (tropical longitude → tropical sign via /30; sidereal = longitude − Lahiri ayanamsha → rashi via /30), with the date table used only for the "dates covered" display line. If birth time is missing, compute at 12:00 **in the user's local zone** and emit a cusp warning whenever the sun longitude is within 1° (≈ 2 h) of a boundary. Reuse the same ayanamsha module as `/calculators/rashi` and the moon-phase rashi cross-ref.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — boundary (sidereal): birth on 2025-01-14 (Makar Sankranti day, India)
Published: Sun enters sidereal Capricorn at **09:03 IST (03:33 UTC)** on 2025-01-14; Lahiri ayanamsha ≈ 24°12′.
- (a) Birth 2025-01-14 **08:00 IST** (02:30 UTC): sun sidereal ≈ 29°58′ **Dhanu (Sagittarius)** → rashi Dhanu (index 9). Tropical sun ≈ 29°58′ + 24°12′ = 54°10′ → **Taurus**?? No — compute correctly: tropical = sidereal + ayanamsha = 29°58′ + 24°12′ = 54°10′? That would be Taurus, which is absurd for mid-January. Correction: sidereal Dhanu 29°58′ = sidereal longitude 269°58′; tropical = 269°58′ + 24°12′ = 294°10′ → tropical **Capricorn 24°10′**. Tropical sign: **Capricorn**.
- (b) Birth 2025-01-14 **10:00 IST** (04:30 UTC): sidereal longitude ≈ 270°01′ → **Makar (Capricorn)**, index 10. Tropical ≈ 294°13′ → tropical Capricorn.
- Test vectors: `2025-01-14T08:00+05:30` → `{tropical: Capricorn, rashi: Dhanu}`; `2025-01-14T10:00+05:30` → `{tropical: Capricorn, rashi: Makar}`; boundary instant `2025-01-14T09:03+05:30` → rashi Makar (half-open: ingress instant belongs to the new sign).
- Vyotish-current check: date-only at 12:00 UTC = 17:30 IST → returns Makar for both (a) and (b): (a) is **wrong**. This is the headline gap.

### Example 2 — boundary (tropical): birth 2025-01-19 (Aquarius ingress day)
Published: Sun enters tropical Aquarius (longitude 300°) at **~20:00 UTC** on 2025-01-19 (3:00 PM EST).
- (a) 2025-01-19 **18:00 UTC**: tropical sun ≈ 299.9° → tropical **Capricorn**; sidereal ≈ 299.9 − 24.2 = 275.7° → sidereal **Makar**.
- (b) 2025-01-19 **21:00 UTC**: tropical sun ≈ 300.05° → tropical **Aquarius**; sidereal ≈ 275.8° → sidereal Makar (still).
- Shows the systems diverging on different sides of the same evening; a date-only table (Aquarius from Jan 20) would label both (a) and (b) Capricorn by date — (b) is wrong by table and only correct by ephemeris.

### Example 3 — mid-sign (normal): birth 2025-04-10 and 2025-04-15
- 2025-04-10 (any time): tropical sun ≈ 20° **Aries** (mid-sign, no cusp risk); sidereal ≈ 20 − 24.2 = −4.2° → 355.8° → sidereal **Meena (Pisces)**. Classic divergence case.
- 2025-04-15: tropical sun ≈ 25° **Aries**; sidereal ≈ 0.8° → **Mesha (Aries)**. The agree case (tropical and sidereal identical) — useful as the "both systems match" UX demonstration.
- (Degrees are ephemeris-approximate to ±0.5°; exact values must come from the ephemeris module — UNVERIFIED to the minute.)

## 5. Complete output list

A GOOD sun-sign calculator shows:
1. **Tropical (Western) sign** + name/icon.
2. **Dates covered** — the table window for that sign (with "±1 day varies by year" note).
3. **Element** (fire/earth/air/water) and **ruling planet** (Western lord) for the tropical sign.
4. **Vedic sun rashi** (sidereal) with Sanskrit name (Makar etc.) + rashi lord (Saturn for Makar, etc.).
5. **Nakshatra of the Sun** + **pada** (already in Vyotish output — keep).
6. **Cusp warning** when within ~1° of any boundary: "born near a sign change — enter birth time to confirm."
7. **Assumptions panel**: the clock time used (12:00 local if unknown), timezone, ayanamsha (Lahiri).
8. For Vedic users: next Makar Sankranti / sun-rashi-ingress dates (DrikPanchang-style utility value).
9. Nice-to-have: "Sun in sign X until <ingress date>" line.

**Comparison vs competitors**
- AstroSage Sun Sign Calculator (astrosage.com/sunsign.asp): computes sun sign "for the exact moment of birth" — inputs DOB + birth time + birth place; also sells the Vedic rashi separately. Vyotish's single tropical+sidereal combined output is a genuine differentiator if we add time/place.
- DrikPanchang (drikpanchang.com): rashi/sun-sign calculators ask birth date + time + place; additionally offers name-based fallback ("Find Rashi With Birth Name") — a pattern worth noting for a future Vyotish input-less variant.
- timeanddate-style "what is my sign" tools: fixed table only; fine for entertainment but silently wrong on cusp days — Vyotish should not copy this behavior.
- Astro-Seek: offers explicit ayanamsha selection — model for the advanced selector.

### Current Vyotish outputs
`GET /calculators/sun-sign?date` → `{tropical_sign, rashi, rashiIndex, nakshatra, nakshatraIndex, pada, lord}`, computed at fixed 12:00 UTC, no time/place input. Page: `/calculators/sun-sign`.

### Initial gap list
1. **No birth time / timezone / place input** — fixed 12:00 UTC makes every cusp-day answer potentially wrong (Jan 14 2025: births 00:00–09:03 IST are Dhanu but Vyotish returns Makar all day).
2. No **cusp warning** when computed longitude is within ~1° of a boundary.
3. No **element / sign lord / dates-covered** display for the tropical sign (Western-side output is bare).
4. `lord` field ambiguity: sign lord or nakshatra lord? Name the fields explicitly (`sign_lord`, `nakshatra_lord`).
5. No ayanamsha selector; Lahiri assumed but not surfaced (`meta.ayanamsha` missing).
6. No Makar Sankranti / ingress info (high-intent Vedic feature, cheap to add from the same ephemeris).
7. Date-table fallback not shown when ephemeris unavailable (resilience/UX).

## 6. Edge cases and validation rules

1. **Cusp-day resolution:** for any date where the sun longitude is within 1° of a boundary at the assumed time, require/ask for birth time; with time given, classify strictly by longitude (half-open [a,b): exactly 300° = Aquarius, exactly 0° = Aries).
2. **Timezone conversion:** local birth time must convert via the *birth-year* tz rules (DST on the birth date, e.g., US births in summer); storing only the UTC instant is fine but the display must show the local input back to the user.
3. **Leap-year drift:** ingress times shift ~5 h 43 m later per non-leap year and jump back on leap years — regression-test the solstice set {2024-12-21 09:20Z, 2025-12-21 15:03Z, 2026-12-21 20:50Z} (EarthSky-published).
4. **Sankranti cross-check:** sidereal longitude at 2025-01-14T03:33Z must be ≈ 270° (09:03 IST published); at 2027 the ingress is late on Jan 14 IST (observed Jan 15) — test the Jan 14/15 oscillation.
5. **Date-only ambiguity:** state the assumed clock time in output meta; never present a date-only cusp result as certain.
6. **Ayanamsha monotonicity:** Lahiri increases ~50.3″/yr; a result where sidereal longitude decreases over time in the same module indicates a normalization bug.
7. **Input validation:** reject invalid dates; reject times with seconds; normalize case of sign names; clamp longitudes to [0,360) after subtracting ayanamsha (negative → +360).
8. **Consistency:** `rashi` here must equal the rashi calculator's sun-rashi and the moon-phase page's rashi module for the same instant (single shared ephemeris/ayanamsha service).
9. **Half-open boundary tests:** longitudes 0.0000001°, 30°, 90°, 180°, 270°, 359.9999° each map to the expected sign index.

## 7. Sources

- Wikipedia — Astrological sign (30° sector intervals closed-open; sign start dates vary year to year with the equinox; tropical vs sidereal precession note): https://en.wikipedia.org/wiki/Astrological_sign
- EarthSky / solstice-time tables — December solstice 2024 = 2024-12-21 09:20 UTC (= tropical Capricorn ingress); 2025-12-21 15:03 UTC; 2026-12-21 20:50 UTC: https://earthsky.org/ (solstice article listing these instants; verified via WebSearch aggregation)
- Aquarius ingress 2025 — Sun enters Aquarius 2025-01-19 20:00 UTC (3:00 PM EST), longitude 300°: astrology ephemeris sources found via WebSearch (e.g., ingress/ephemeris tables; minute-level values vary slightly between sources — UNVERIFIED to the minute)
- Makar Sankranti 2025 — Sun enters sidereal Capricorn 2025-01-14 09:03 IST; Punya Kaal 09:03–17:46 IST; Jan 14/15 oscillation (2027 on Jan 15): Times of India / DrikPanchang coverage found via WebSearch
- Lahiri ayanamsha 2025 ≈ 24°12′16″, drift ~50.3″/yr: ayanamsa reference tables found via WebSearch (e.g., https://www.scribd.com/document/806622216/Ayanamsa-Calculator-Lahiri-Raman-KP-Old-KP-new; logicastro.com KP-precession PDF)
- AstroSage — Sun Sign Calculator (exact-moment-of-birth framing, DOB+time+place inputs): https://www.astrosage.com/sunsign.asp ; Rashi Calculator: https://www.astrosage.com/rasi-calculator.asp
- DrikPanchang — Moonsign/Rashi calculator (DOB + time + place; name-based fallback): https://www.drikpanchang.com/utilities/horoscope/hindu-moonsign-calculator.html
- Sibling pipeline files: `rashi.md` (rashi/lord conventions), `nakshatra.md` (nakshatra+pada) — same directory.
