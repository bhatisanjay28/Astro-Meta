# Vimshottari Dasha Calculator (विंशोत्तरी दशा) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Vimshottari Dasha is the **120-year planetary period system** used for timing events in Vedic astrology ("vimshottari" = 120). The sequence is fixed — **Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 years = 120** — starting from the lord of the Moon's birth nakshatra, with the first period truncated to the fraction of that nakshatra still un-traversed at birth ("balance at birth"). It is the most-used predictive layer in Jyotish: transits and yogas are read *through* the running dasha.

Who uses it and why:
- **Astrologers** — event timing, predictions, remedial scheduling; the mahadasha/antardasha stack is the standard answer to "when will X happen".
- **Consumers** — "what is my current dasha / when does my next mahadasha start" is a high-traffic intent (AstroSage runs a dedicated Dasha Calculator plus a paid "Vimshottari Dasha Predictions" life report; Mahadasha.com exists purely for this).
- **Astrology businesses** — dasha timelines are the backbone of paid report upsells.
- **Practitioners checking dasha-sandhi** — births/clients near a mahadasha boundary need explicit care (section 6).

The calculation is pure arithmetic *once the Moon's sidereal longitude is known* — so this calculator is 100% downstream of the rashi/nakshatra engine, and its test cases validate the date arithmetic, not the ephemeris.

## 2. Inputs

| Field | Required/Optional | Format & units | Valid range | Default | Why needed |
|---|---|---|---|---|---|
| Birth date | Required | Gregorian date | ~1700–2200 (ephemeris range for the Moon lookup) | — | Fixes the Moon's nakshatra and traversed fraction |
| Birth time | **Required for a trustworthy balance** | 24h HH:MM | 00:00–23:59 | Vyotish kundli currently allows omitted time → 12:00 | The dasha balance is proportional to the Moon's nakshatra fraction: 1° of Moon error (≈2 h) shifts a 20-year-lord's boundaries by ~1.5 years |
| Place of birth | Required | City → lat/lng + IANA tz | lat −90..90, lng −180..180 | — | Timezone/DST → UT; Moon position is geocentric |
| "As of" date (display) | Optional | Date (defaults to today) | — | today | To highlight the currently running mahadasha/antardasha (DrikPanchang/Mahadasha.com behavior) |
| Year-length convention | Optional advanced | Enum: 365.25-day (default), 365.2425, 360-day savana | — | 365.25 | Changes all period dates; see section 3 variants |
| Sub-period depth | Optional display | 1–5 levels (MD / AD / PD / sookshma / prana) | — | MD+AD | Competitors offer up to 5 levels |

### Recommended input set
Birth date + exact birth time + place of birth (city autocomplete → lat/lng + tz) — identical to AstroSage's Dasha Calculator ("accuracy of the birth time matters since dasha calculations depend on the Moon's exact longitude"), DrikPanchang's kundali/dasha tools and Prokerala's Vimshottari page. Plus an "as of" date for current-dasha highlighting and a visible year-length convention. Name/gender irrelevant.

### Current Vyotish input set
**No dedicated dasha page** — the kundli flow (`POST /api/v1/kundli`: birth date, optional birth time (12:00 default), city autocomplete) computes dasha among all results. Same input gap as lagna: optional time silently degrades the dasha balance.

## 3. Formula(s) / method

Step-by-step (standard Vimshottari; sequence/durations as tabulated by AstroSage/Wikipedia):

1. **Moon sidereal longitude** `λ_sid` at birth (Lahiri ayanamsha subtracted — same pipeline as rashi/nakshatra).
2. **Nakshatra**: `S = 360°/27 = 13°20′00″`; `k = floor(λ_sid/S)`; lord `L = DashaLord(k)` where the lord cycle from Ashwini is **Ketu(7), Venus(20), Sun(6), Moon(10), Mars(7), Rahu(18), Jupiter(16), Saturn(19), Mercury(17)** repeating ×3 (27 nakshatras). Total cycle = 120 years.
3. **Elapsed fraction**: `f = (λ_sid − k·S)/S` (0 ≤ f < 1).
4. **Balance at birth** (first, truncated mahadasha): `B = Years(L) × (1 − f)`.
5. **Mahadasha table**: period 1 = lord L from birth for `B`; then subsequent lords in cycle order with full years. Convert durations to dates by **adding days**: `days = years × Y`, where `Y` = 365.25 (Vyotish) — see variants.
6. **Antardasha (bhukti)** within a mahadasha of length `D`: sub-lords run in cycle order **starting with the mahadasha lord itself**; each sub-period `d(a) = D × Years(a)/120`. For the truncated first mahadasha, apply the same proportionality to `B`; the first bhukti (the mahadasha lord's own) is itself truncated: `b1 = B × (1 − f)` (standard practice).
7. **Pratyantardasha**: same proportionality one level down (`pd = d × Years(p)/120`), starting with the antardasha lord; competitors extend identically to sookshma and prana levels.

Variants (researched — this system has one genuinely contested parameter):
- **Year length** — the big one:
  - **365.25-day (Julian/solar) year**: modern default of mainstream software (Jagannatha Hora, Parashara's Light per the literature) and Vyotish's engine. Shyam Sundar Dasa's multi-part textual study concludes the classical intent was the ~365.25-day solar year.
  - **360-day (savana) year**: 12 months × 30 days; the 120-year cycle = 43,200 days ≈ 118.3 solar years. Traditionalist minority view citing scriptural year definitions. Over a lifetime, dates drift up to **~1.7 years** vs 365.25 (Example 2).
  - **365.2425 (Gregorian) year**: rare refinement; ≤ ~4 days difference from 365.25 over a full cycle for middle periods — negligible vs the 360/365.25 split.
- **First-antardasha truncation**: mainstream tools truncate the first bhukti by the same (1−f) factor (described above); some simplistic tools show the first bhukti untruncated — that is wrong because the person is born *inside* the mahadasha lord's own bhukti.
- **Dasha systems themselves**: Vimshottari is the default; Ashtottari (108 yr), Yogini, Kalachakra etc. exist but are niche — not a variant to ship beyond an "advanced" note.
- **Node convention**: Rahu/Ketu periods come from the nakshatra cycle, **not** from computing Rahu/Ketu positions — mean-vs-true-node debates do not affect this calculator.

**RECOMMENDATION: keep 365.25-day years (Vyotish's current engine) and the standard truncation rules above.** Reasons: (a) it is the modern software majority default, so users cross-checking AstroSage/DrikPanchang/Prokerala see matching dates; (b) the classical-textual analysis (Shyam Sundar Dasa) supports the solar year; (c) the savana alternative shifts late-life boundaries by ~1.7 years — a change that should never happen silently. Disclose the convention on the page and (optionally) offer 360-day as an explicit advanced toggle.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — Normal case with FULL mahadasha table
**Input:** 1990-05-15, 14:30 IST, New Delhi → Moon λ_sid = 271.9010° = Uttara Ashadha (k = 20, 0-based), lord **Sun (6 yr)**.
1. inNak = 271.9010 − 266.66667 = 5.2343° → f = 5.2343/13.333333 = **0.392573**.
2. Balance = 6 × (1 − 0.392573) = **3.644565 yr** = 1331.3 days → Sun mahadasha ends 1990-05-15 + 1331.3 d = **1994-01-05**.
3. Full mahadasha table (365.25-day years; dates in UT, display converts to IST):

| # | Lord | Start | End | Length |
|---|---|---|---|---|
| 1 | Sun | 1990-05-15 | 1994-01-05 | 3.6446 yr (balance) |
| 2 | Moon | 1994-01-05 | 2004-01-06 | 10 yr |
| 3 | Mars | 2004-01-06 | 2011-01-06 | 7 yr |
| 4 | Rahu | 2011-01-06 | 2029-01-05 | 18 yr |
| 5 | Jupiter | 2029-01-05 | 2045-01-05 | 16 yr |
| 6 | Saturn | 2045-01-05 | 2064-01-06 | 19 yr |
| 7 | Mercury | 2064-01-06 | 2081-01-05 | 17 yr |
| 8 | Ketu | 2081-01-05 | 2088-01-06 | 7 yr |
| 9 | Venus | 2088-01-06 | 2108-01-07 | 20 yr |

4. Antardashas of the truncated Sun mahadasha (each = 3.644565 × years/120):

| Bhukti | Start | End | Days |
|---|---|---|---|
| Sun/Sun | 1990-05-15 | 1990-07-21 | 66.6 |
| Sun/Moon | 1990-07-21 | 1990-11-09 | 110.9 |
| Sun/Mars | 1990-11-09 | 1991-01-25 | 77.7 |
| Sun/Rahu | 1991-01-25 | 1991-08-13 | 199.7 |
| Sun/Jupiter | 1991-08-13 | 1992-02-06 | 177.5 |
| Sun/Saturn | 1992-02-06 | 1992-09-04 | 210.8 |
| Sun/Mercury | 1992-09-04 | 1993-03-12 | 188.6 |
| Sun/Ketu | 1993-03-12 | 1993-05-28 | 77.7 |
| Sun/Venus | 1993-05-28 | 1994-01-05 | 221.9 |

Sum check: 66.6+110.9+77.7+199.7+177.5+210.8+188.6+77.7+221.9 = 1331.4 days = 3.6446 yr ✓. Running bhukti at birth = Sun/Sun truncated by (1−f): full Sun/Sun would be 3.6446×6/120 = 0.18223 yr = 66.6 d; elapsed = f×that = 26.1 d → at birth 40.5 d of Sun/Sun remain (ends 1990-06-25 if computed from the untruncated Mahadasha onset — the standard display shows the truncated table above).

### Example 2 — Year-length variant (edge)
Same birth (1990-05-15, Delhi) computed with the **360-day savana year**: balance = 3.644565 × 360 = 1312.0 d → Sun ends **1993-12-17**; Moon ends 2003-10-26; Mars 2010-09-19; Rahu 2028-06-16; Jupiter 2044-03-24; Saturn 2062-12-15; Mercury 2079-09-17; Ketu 2086-08-11; Venus **2106-04-29**. vs 365.25-day: every boundary is earlier, drift growing to **1 yr 8.5 months by the final Venus end** (2106-04-29 vs 2108-01-07). QA must pin the convention; users comparing sites with different conventions will see "wrong" dates by up to 1.7 years.

### Example 3 — Dasha-sandhi boundary case (10 minutes flips the lord)
**Input:** 2026-09-10, New Delhi:
- **14:00 IST (08:30 UT)**: λ_sid = 133.2938° → nakshatra **Magha (k = 9, lord Ketu, 7 yr)**; inNak = 13.2938° → f = 0.997035 → **balance = 0.0208 yr ≈ 7.6 days** — the Ketu mahadasha ends when the child is a week old.
- **14:10 IST (08:40 UT)**: λ_sid = 133.3904° → nakshatra **Purva Phalguni (k = 10, lord Venus, 20 yr)**; inNak = 0.0571° → f = 0.00428 → **balance = 6.97 yr**.
**Expected behavior:** a 10-minute birth-time error changes the entire 120-year timeline (Ketu-7-first vs Venus-20-first). The tool must (a) display balance precision, (b) warn when balance < ~0.5 yr ("dasha sandhi — verify birth time"), and (c) never round f such that f = 0.9970 becomes 1.0 and silently shifts to the next lord.

### Example 4 — Pre-1900 birth, full table
**Input:** 1889-01-31, 12:00 IST, Allahabad → Moon λ_sid = 287.8604° = **Shravana (k = 21, lord Moon, 10 yr)**; inNak = 7.8604° → f = 0.589530 → balance = 10 × 0.410470 = **4.1047 yr** (1499.2 d). Full table (365.25-day years): Moon 1889-01-31 → 1893-03-10; Mars → 1900-03-11; Rahu → 1918-03-11; Jupiter → 1934-03-11; Saturn → 1953-03-11; Mercury → 1970-03-11; Ketu → 1977-03-11; Venus → 1997-03-11; Sun → 2003-03-12. **Sum check:** the 9 listed periods total 4.1047 + (7+18+16+19+17+7+20+6) = **114.10 yr**, not 120 — the missing 5.90 yr (10 − 4.1047) is Moon's elapsed share from the *previous* cycle before birth. 5.90 + 114.10 = 120.0 ✓ — correct Vimshottari behavior, not an error; QA must not assert a naive 120.0 sum for truncated first periods.

### Example 5 — Balance ≈ full period (birth at nakshatra start)
**Input:** 2026-09-09, 15:14 IST, Delhi (from nakshatra.md Example 4): λ_sid = 120.0008° → Magha, inNak = 0.0008° → f = 0.00006 → **Ketu balance = 7 × 0.99994 = 6.99958 yr** — dasha table starts with an essentially full 7-year Ketu period. Boundary rule: `f = 0` (exactly on the nakshatra start) → full period; `f ≥ 1−ε` → clamp and move to next lord (Example 3).

## 5. Complete output list

What a GOOD dasha calculator shows:
- **Provenance line**: Moon nakshatra + pada + nakshatra lord + traversed fraction % + balance at birth (in years AND as a date) — the audit trail that lets users and QA verify everything downstream.
- **Mahadasha table**: all 9 periods with lord, start date, end date, length in years — dates in the birth timezone.
- **Current running period highlighted** (based on today or an "as of" date) — DrikPanchang tree highlights it; Mahadasha.com's whole pitch is "current dasha".
- **Expandable antardasha (bhukti) rows per mahadasha** — 9 sub-periods each with dates (AstroSage, DrikPanchang, Prokerala all show MD+AD at minimum).
- **Pratyantardasha** (and optionally sookshma/prana) on expand — AstroSage advertises all levels; DrikPanchang's tree goes 5 levels deep.
- **Convention disclosure**: "computed with 365.25-day years, Lahiri ayanamsha" — the 360/365.25 split makes this mandatory for trust.
- **Interpretation text** per mahadasha lord (AstroSage's Vimshottari Dasha Predictions report; even 2–3 sentences per lord differentiates a result page from a bare table).
- **Warnings**: birth-time-sensitivity warning (see section 6 math); dasha-sandhi warning for balance < ~0.5 yr; disclaimer that dasha timing is interpretive, not predictive guarantee.
- **Funnel links**: nakshatra page (provenance), full kundli, consultation/report upsell.

Comparison vs leading competitors:

| Output | Vyotish (current) | AstroSage | DrikPanchang | Prokerala |
|---|---|---|---|---|
| Mahadasha table with dates | mahadashas[9] {lord, start, end, years} | ✓ | ✓ (tree) | ✓ |
| Balance at birth | balance_at_birth_years (number only) | ✓ | ✓ | ✓ |
| Antardasha (bhukti) | ✗ | ✓ | ✓ | ✓ |
| Pratyantardasha | ✗ | ✓ | ✓ (5 levels) | ✓ |
| Current dasha highlighted | ✗ | ✓ | ✓ | ✓ |
| Nakshatra/fraction provenance | moon_nakshatra, moon_nakshatra_lord | ✓ | ✓ | ✓ |
| Year-length disclosure | ✗ (365.25 hardcoded) | — | — | — |
| Interpretation per period | ✗ | ✓ (paid report + page text) | ✓ (page content) | — |
| Dedicated page/URL | ✗ (inside /kundli) | ✓ | ✓ | ✓ |
| Sandhi/birth-time warnings | ✗ | — | — | — |

### Current Vyotish outputs
`POST /api/v1/kundli` returns `dasha {moon_nakshatra, moon_nakshatra_lord, balance_at_birth_years, mahadashas[9] {lord, start, end, years}}` — first period balance-truncated, 365.25-day solar years, **mahadashas only** (no antardasha/pratyantardasha levels), shown inside `/kundli` (no dedicated page).

### Initial gap list
1. **No dedicated dasha page/URL** — "vimshottari dasha calculator" is a major search intent competitors own with standalone tools.
2. **No antardasha / pratyantardasha levels** — the single biggest functional gap; every competitor ships at least MD+AD, most MD+AD+PD. Requires only proportional arithmetic on existing data.
3. **No current-dasha highlighting** ("what dasha am I in right now" is the top user question).
4. **Balance shown only as a raw year count** — should also show as a date (e.g., "Sun mahadasha until 1994-01-05") and % of nakshatra traversed.
5. **No provenance display** (moon nakshatra %, pada) on the dasha page — needed for auditability.
6. **No year-length convention disclosure** (365.25 hardcoded; the 360-day debate means users comparing sites can see ~1.7-yr differences).
7. **No sandhi / birth-time warnings** (Example 3: 10 minutes flips a 7-yr-Ketu start into a 20-yr-Venus start).
8. **No interpretation text** per mahadasha lord.
9. **No "as of" date control** for historical/future dasha views.

## 6. Edge cases and validation rules

- **Birth-time sensitivity is multiplicative**: Moon moves ~0.55°/h near 1990-05-15; 1° of Moon = 0.075 of a nakshatra → the balance shifts by `Years(L)×0.075` — **1.5 years on a 20-year Venus lord, 0.45 yr on a 6-year Sun lord**. A pada boundary (3°20′ ≈ 6.1 h) shifts it by up to 2.2 yr. Rules: warn whenever time is defaulted/approximate; show balance to 2 decimals; never let a UI imply minute-level certainty the input can't support.
- **Dasha sandhi**: when `balance < 0.5 yr`, warn "running mahadasha ends within months of birth — verify birth time" (Example 3: 0.0208 yr = 7.6 days).
- **Fraction bounds**: `f` must be clamped to [0, 1) — float drift at exact nakshatra boundaries (λ_sid = 133.3333333°) must not produce `f = 1.0000001` and flip the lord; at `f = 0` exactly, balance = full `Years(L)` (Example 5). Compute `f` from `λ_sid − k·S` using the *same* k as the nakshatra index, never from an independently rounded k.
- **Sum invariants (cheap QA assertions)**: (a) the 9 mahadasha lengths sum to exactly 120 years (first truncated: sum = 120 − elapsed(L)); (b) the 9 antardashas of any mahadasha sum to that mahadasha's length; (c) antardasha sub-lords run in cycle order starting from the mahadasha lord (Ketu→Venus→Sun→Moon→Mars→Rahu→Jupiter→Saturn→Mercury wrap).
- **Year-length convention**: pin 365.25 (recommended; see section 3), disclose on-page; if a 360-day toggle is ever added, recompute Example 2 and expect every boundary earlier — do not mix conventions between mahadasha and antardasha levels.
- **Date arithmetic**: add fractional **days** to the UT birth instant (`days = years × 365.25`), then convert to birth-local tz for display — never add "calendar years" (which drifts across leap years by ±1 day) or truncate before summing. Display dates to the day; a 0.5-day rounding tolerance is acceptable in tests.
- **Cycle wrap-around**: births early in a lord's cycle produce tables whose 9 rows span <120 yr (Example 4 sums to 114.8 because 5.2 yr of Moon's period predate birth) — QA must not assert a naive 120.0 total for truncated first periods.
- **Long horizons**: dates up to birth + 120 yr (a 2026 birth ends Venus in 2146) — pure date arithmetic, no ephemeris needed downstream; but the Moon lookup itself needs the engine's valid range (~1700–2200 for astronomy-engine — UNVERIFIED claim; JPL DE441 covers 1550–2650). Clamp supported birth years accordingly.
- **Unknown birth time**: noon default shifts `f` by up to ~0.2 (3.2° of Moon travel) → balance error up to ~4 yr on Venus. Show "balance approximate" state rather than a confident timeline; optionally compute dasha for the 00:00 and 23:59 brackets.
- **Rounding**: display years to 2–3 decimals, dates to the day; compute with full float precision end-to-end; the running-period highlight uses `start ≤ as_of < end` on exact stored dates (boundary instant belongs to the *new* period, mirroring the nakshatra lower-bound rule).

## 7. Sources

- AstroSage — Dasha Calculator (mahadasha/antardasha/pratyantardasha with dates; MD 6–20 yr across 9 planets totaling 120 yr; birth-time accuracy note): https://www.astrosage.com/free/dasha-calculator.asp
- AstroSage — Vimshottari Dasha Predictions life report (interpretation layer): https://www.astrosage.com/free/vimshottari-dasha-prediction-life-report.asp
- Shyam Sundar Dasa — "How Long is a Year?" multi-part study (classical-text analysis concluding ~365.25-day solar year for mahadasha; savana 360-day critique): https://shyamasundaradasa.com/jyotish/resources/articles/how_long_year/how_long_year_1.html
- DrikPanchang — Janma Kundali (dasha in kundali output): https://www.drikpanchang.com/jyotisha/kundali/janma-kundali.html
- DrikPanchang — Vimshottari dasha tree utility (MD→AD→PD→sookshma→prana, current dasha highlighted): https://www.drikpanchang.com/jyotisha/dasha/vimshottari-dasha.html
- Prokerala — Vimshottari Dasha calculator: https://www.prokerala.com/astrology/vimshottari-dasha.php
- Mahadasha.com — 120-year Vimshottari calculator focused on current dasha/antardasha/pratyantar: https://www.mahadasha.com/
- Wikipedia — List of Nakshatras (27 nakshatra spans; dasha-lord cycle Ketu→Venus→Sun→Moon→Mars→Rahu→Jupiter→Saturn→Mercury): https://en.wikipedia.org/wiki/List_of_Nakshatras
- LivePanditji — 27 Nakshatras (spans + dasha lords table): https://www.livepanditji.com/nakshatra
- NASA JPL Horizons manual (Moon apparent-of-date source used to derive the nakshatra fractions in all examples): https://ssd.jpl.nasa.gov/horizons/manual.html · https://ssd-api.jpl.nasa.gov/doc/horizons.html
- NASA — Moon phases (27.32-day sidereal month → ~13.2°/day sensitivity math): https://science.nasa.gov/moon/moon-phases/
- AstroSutra — Moon sign page (Lahiri ayanamsha values used for λ_sid): https://astrosutra.app/calculators/moon-sign
- Numerical pipeline for sections 4–5: JPL Horizons DE441 Moon + Vyotish linear Lahiri + 365.25/360-day day-addition tables (`C:\Users\sanjay.bhati.OM\AppData\Local\Temp\vyo_calc.ps1`); mahadasha/antardasha dates computed by explicit day-count arithmetic (Example 1 sum check: antardashas total 1331.4 d = balance).
