# Moon Phase Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Tells the user, for any given date/time (optionally a place), what phase the Moon is in: the named phase (of 8), the illuminated fraction of the lunar disk, the Moon's "age" in days since the last new moon, whether it is waxing or waning, and when the next/previous primary lunations (new moon, first quarter, full moon, last quarter) occur. Optionally cross-references the Vedic moon rashi (sidereal moon sign) for the same instant, which ties the tool to Vyotish's core astrology content.

Audience segments:
- **General users** checking "what is tonight's moon" — the largest traffic driver (timeanddate's moon phase pages are among the most visited astronomy pages on the web).
- **Photographers / skywatchers / anglers / gardeners** who need illumination % and moonrise context.
- **Vedic/panchang users** who want the moon rashi (and, on DrikPanchang-style sites, the related tithi) for a festival, muhurta or personal-chart question.
- **Astrology practitioners** who need the current transiting moon sign alongside the phase.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| date | required | ISO date `YYYY-MM-DD` | any date the ephemeris supports (recommend 1900–2100) | today | the instant whose moon phase is asked about |
| time | optional | ISO time `HH:MM` 24-h | 00:00–23:59 | 12:00 | phase changes during a day (e.g., full moon at 22:27 UTC means morning of that UTC date is waxing gibbous) |
| timezone (or place) | optional | IANA tz name, or place name resolved to lat/lon + tz | any IANA zone | UTC (recommend: user's detected local zone) | phase names are instant-based; local date/time display and "tonight's moon" questions are zone-dependent |
| show vedic rashi | optional | boolean toggle | true/false | true on Vyotish | ties result to Vedic content; needs sidereal moon longitude (Lahiri ayanamsha) |

Notes: the phase itself is defined at an instant, so **date + time + timezone** is the correct input model; a date-only query must state which clock time it assumes. Place is only needed for moonrise/moonset or precise local-date framing (not required for phase/illumination/rashi); recommend keeping it out of v1 and adding it later only if moonrise is added.

### Recommended input set
`date` (default today, user's local zone) + `time` (default 12:00 local) + `timezone` (default user's zone, shown on screen with an explicit "times shown in <tz>" note) + optional Vedic rashi toggle. This matches timeanddate and DrikPanchang behavior, which always frame phase results in a chosen location/timezone.

### Current Vyotish input set
`GET /api/v1/calculators/moon-phase?date&time` — time optional, interpreted as **UTC**, default 12:00 UTC. No timezone/place input, UI does not let the user say "my local evening". Gap: non-UTC users near phase boundaries will see the wrong phase for their local evening; also nothing on screen tells them 12:00 UTC is assumed (only `meta.note`).

## 3. Formula(s) / method

**Quantity driving everything: the elongation D** — the excess of the apparent geocentric ecliptic longitude of the Moon over that of the Sun, `D = λ_moon − λ_sun` normalized to [0°, 360°). Primary phases occur at D = 0° (new), 90° (first quarter), 180° (full), 270° (last quarter) (USNO).

### 3.1 Eight-phase classification (half-open interval convention)
Bin D into 45°-wide intervals; a boundary value belongs to the phase of the interval it starts:

| D (deg) | Phase | Waxing? | Typical illumination |
|---|---|---|---|
| [0, 45) | New Moon | (start of cycle) | ~0% |
| [45, 90) | Waxing Crescent | yes | 0–50% |
| [90, 135) | First Quarter | yes | 50% |
| [135, 180) | Waxing Gibbous | yes | 50–100% |
| [180, 225) | Full Moon | no | 100% |
| [225, 270) | Waning Gibbous | no | 50–100% |
| [270, 315) | Last Quarter | no | 50% |
| [315, 360) | Waning Crescent | no | 0–50% |

Convention notes: exactly 0° = New Moon, exactly 45° = Waxing Crescent, exactly 90° = First Quarter, exactly 180° = Full Moon, exactly 315° = Waning Crescent. The four "primary" phases are the ones whose instants are published (new/FQ/full/LQ); crescent/gibbous bins are the "intermediate" phases (timeanddate, USNO).

### 3.2 Illuminated fraction
`k = (1 − cos D) / 2` (equivalently `k = sin²(D/2)`), where D is the elongation in degrees; this equals the fraction of the disk area lit by direct sunlight, as a value in [0, 1]; display as `illumination % = 100 × k` (Wikipedia "Lunar phase"; USNO defines the percentage as area-lit/total-area and gives 0% new, 50% quarters, 100% full). Check: D=0→0, 90→0.5, 180→1, 270→0.5.

Caveat to document: this is the **geometric** fraction; it ignores libration and the opposition surge; practical sites round to whole percent.

### 3.3 Moon age in days — two conventions
- **Convention A (mean-cycle):** `age = ((JD_target − JD_epoch) mod 29.530588)`, with epoch = the new moon of 2000-01-06 18:14 UTC (Brown Lunation Number BLN 1) and mean synodic month = 29.530588 days (= 29 d 12 h 44 m 03 s for year 2000, NASA). Simple, always available, but individual lunations vary by several hours (NASA: roughly 29.27–29.83 d) so the age can be wrong by ~±0.5 day near phase boundaries.
- **Convention B (measured):** `age = JD_target − JD_prev_actual_new_moon`, where the previous new moon is found by solving D = 0° numerically (ephemeris/Meeus corrections). Accurate to seconds; requires a real phase-search routine — which Vyotish already needs for `prev_new_moon`, so Convention B is essentially free.

**RECOMMENDATION:** use Convention B (age measured from the actual preceding new moon found by elongation search) and compute D from a real ephemeris (e.g., Swiss Ephemeris / ELP2000 / Meeus's *Astronomical Algorithms* — the method Espenak used for NASA's tables). Keep the mean-cycle value (29.530588) only as (a) the fallback estimate to seed the root-finder and (b) an informational "average lunation length" line. Never classify the phase from mean-cycle age alone: see worked example 2, where it mislabels a true full moon as waxing gibbous.

### 3.4 Waxing / waning
`waxing = (D < 180°)`, `waning = (D ≥ 180°)`. At the exact new-moon instant (D = 0) the rule returns waxing=true with 0% illumination; document this on screen ("Moon is new; light will grow from tonight"). Alternative (treat exact new/old instants as neither) is not recommended — it complicates the UI for no user benefit.

### 3.5 Next / previous new & full moon (and quarters)
Numerically solve `D(t) = 0°` (new), `90°` (FQ), `180°` (full), `270°` (LQ) by root-finding (bisection or Newton) over the elongation function:
1. Seed with the mean estimate `t₀ = JD_epoch + n × 29.530588` for the nearest integer n on each side of the target date.
2. Refine with bisection until |Δt| < 1 second.
Output each as an ISO-8601 UTC instant and additionally in the user's timezone for display. Return the full four-phase set for the surrounding lunation (prev + next of each) — competitors (timeanddate, Moongiant) show the whole month, so four primary instants is the minimum credible output.

### 3.6 Optional Vedic moon rashi cross-ref
`rashi_index = floor(sidereal_moon_longitude / 30)` (0 = Mesha … 11 = Meena), where `sidereal_longitude = tropical_longitude − ayanamsha` (Lahiri; ≈ 24°12′ for 2025). Identical to the logic already specified in the sibling `rashi.md` research file — reuse the same ayanamsha module so moon-phase and rashi never disagree for the same instant.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal: Full Moon instant 2025-01-13 22:27 UTC (published)
Published instants (Moongiant / EarthSky / astropixels, all consistent): Full Moon **2025-01-13 22:27 UTC**, First Quarter 2025-01-06 23:56 UTC, Last Quarter 2025-01-21 ~20:30 UTC, New Moon 2025-01-29 12:35 UTC.
At D = 180.0° (by construction, this is the full-moon instant):
- Phase: D ∈ [180°, 225°) → **Full Moon**
- Illumination: k = (1 − cos 180°)/2 = (1 + 1)/2 = **1.000 → 100%**
- Waxing/waning: 180 ≥ 180 → **waning** (from this instant the lit fraction decreases)
- Moon age (Convention B): at the instant itself age is not yet known until the preceding new moon is solved — mean-cycle estimate from epoch 2000-01-06 18:14 UTC: Δt = 9139.176 d; 9139.176 mod 29.530588 = 9139.176 − 309 × 29.530588 = **14.22 days** (plausible for a real full moon: real lunations vary, so full-moon age lands between ~13.9 and ~14.8 d).
- Moon rashi (informational): tropical moon ≈ 24° Cancer → sidereal ≈ 24° − 24°12′ ≈ 29°48′ **Gemini (Mithuna)** (approximate; exact degree must come from the ephemeris module — UNVERIFIED as an exact value).

### Example 2 — edge: mean-cycle approximation misclassifies this very instant
Same instant, but if we classified from mean-cycle age alone: elongation estimate = 360 × (14.2243 / 29.530588) = **173.4°** → bin [135°, 180°) → "Waxing Gibbous". This contradicts the true published Full Moon. Error ≈ 6.6° ≈ 4.5 hours of elongation growth — exactly why the mean method must not drive classification. **Test case:** at 2025-01-13T22:27Z the API must return `phase = Full Moon`, `illumination = 1.0`, `waxing = false` (this guards the ephemeris-based path).

### Example 3 — boundary: elongation exactly 45.0° (synthetic deterministic test)
D = 45.0°:
- Phase: [45°, 90°) → **Waxing Crescent** (boundary value opens the bin)
- Illumination: k = (1 − cos 45°)/2 = (1 − 0.70711)/2 = 0.14645 → **14.6%**
- Moon age (mean convention): (45/360) × 29.530588 = **3.691 days**
- Waxing: true
Repeat the same test at D = 90.0° → First Quarter, 50.0%, 7.383 d; D = 180.0° → Full Moon, 100%; D = 315.0° → Waning Crescent, k = (1 − cos 315°)/2 = 0.14645 → 14.6%, age 25.84 d, waxing = false.

### Example 4 — edge: New Moon instant 2025-01-29 12:35 UTC (published)
D = 0°:
- Phase: **New Moon**; illumination k = (1 − cos 0°)/2 = **0.000 → 0%**
- Moon age (Convention B): **0.0 days** (this instant *is* the previous new moon)
- Waxing: true under the rule `D < 180°` — display nuance required (0% lit but about to wax); recommend the UI copy "New Moon — light begins to grow from tonight".
- Primary-phase outputs around it: prev FQ 2025-01-06 23:56 UTC, prev full 2025-01-13 22:27 UTC, prev LQ 2025-01-21 ~20:30 UTC; next FQ/full must come from the solver (roughly +7.4 / +14.8 mean days but must be computed, not estimated — NASA notes individual lunations vary by several hours).

## 5. Complete output list

A GOOD calculator shows, for the queried instant:
1. **Phase name** (8-phase set) + phase icon/emoji.
2. **Illumination %** — 0–100, one decimal (NOT the raw 0–1 fraction).
3. **Moon age** — days since new moon, 1 decimal, plus "day N of ~29.5".
4. **Waxing / waning** label.
5. **Next 4 lunations** — next first quarter, full, last quarter, new (each as UTC ISO + local-formatted datetime); and the previous four for context. Half-open-interval boundaries documented.
6. **Vedic moon rashi** (Lahiri sidereal) — cross-ref only, clearly marked as Vedic.
7. Meta: assumed timezone, note that times are instant-based.
8. Nice-to-have: "next full moon countdown", month-phase calendar strip (competitors: timeanddate shows a month calendar with illumination and moonrise/set; Moongiant shows daily phase + illumination; DrikPanchang adds tithi/paksha).

**Comparison vs competitors**
- timeanddate.com: 8 phases, four primary instants per month with local times, illumination %, moonrise/moonset, month calendar. (Source: timeanddate moon phases page.)
- Moongiant: monthly phase list with exact UTC times + daily illumination; matches the January 2025 instants used above.
- DrikPanchang (Indian audience): moon phase framed with panchang concepts (tithi, paksha) alongside; Vyotish should show at least the moon rashi to serve this audience.
- USNO: authoritative % illumination definitions but bare output — not a UX benchmark.
- AstroSage: moon sign/phase in Vedic framing, ad-heavy; opportunity for Vyotish on clean dual-mode (Western + Vedic) presentation.

### Current Vyotish outputs
`GET /api/v1/calculators/moon-phase?date&time` returns: `phase` (8 names), `illumination` (0–1, shown **raw, not as %**), `waxing`, `moon_age_days`, `prev_new_moon`, `next_new_moon`, `prev_full_moon`, `next_full_moon` (ISO), `rashi` (Vedic moon sign), `meta.note` (UTC). Page: `/calculators/moon-phase`.

### Initial gap list
1. **Illumination displayed as raw 0–1 fraction** — must render as 0–100% (bug-level).
2. No **first quarter / last quarter** in next/prev lunation outputs (only new + full) — competitors show all four primary phases.
3. **No timezone input**; time forced to UTC default 12:00 — wrong phase for local-evening users near boundaries; `meta.note` mentions UTC but UI should also show a local-time rendering or accept a timezone param.
4. `moon_age_days` basis undocumented (mean-cycle vs measured) — needs `meta.method` field and Convention B via the already-required new-moon solver.
5. No phase icon/emoji, no "day N of ~29.5" framing, no next-full-moon countdown.
6. Waxing-at-exact-new-moon convention undocumented (see §3.4) — pick and document.
7. Rashi cross-ref should share the exact ayanamsha/ephemeris module with `/calculators/rashi` to avoid divergence.

## 6. Edge cases and validation rules

1. **Timezone boundary:** a phase at 2025-01-13 22:27 UTC is "full" for UTC users but on 2025-01-14 early morning in IST (+5:30) — local date framing must be shown; do not silently convert dates.
2. **Boundary values:** D exactly 0/45/90/135/180/225/270/315 must fall in the bin they *start* (half-open [a, b)); add unit tests for all 8 boundaries (floating-point: compare with tolerance < 1e−6 deg and treat ≥ b − ε as still in bin a only if mathematically exact).
3. **Illumination clamps:** k must clamp to [0, 1]; round to 0.1% for display; at exactly 0° and 180° expect exactly 0% and 100%.
4. **Invalid date:** reject dates outside ephemeris range (e.g., before 1800 or after 2200) with a clear message instead of extrapolation drift.
5. **Time-only changes:** same date, 06:00 vs 23:00 can differ in phase (e.g., 2025-01-13 06:00 UTC is Waxing Gibbous 135–180 bin, 22:27 onward is Full) — test both.
6. **Leap years/DST:** age arithmetic in Julian Days, not civil-calendar subtraction, so DST/leap seconds cannot corrupt it.
7. **Waxing at D=0:** defined behavior (true) with UI copy; do not emit null.
8. **Rashi consistency:** rashi output must equal the rashi calculator's output for the same instant (same ayanamsha, same longitude source).
9. ** Lunation solver convergence:** assert |residual D| < 0.001° and iteration count bounded; if not converged, fail loudly rather than return a wrong instant.
10. **Moon age range:** 0 ≤ age < 29.53 at all times (measured convention); if measured age > 29.83 d something is broken (NASA documents max lunation ~29.83).

## 7. Sources

- USNO — Phases of the Moon and Percent of the Moon Illuminated (8-phase definitions, % illumination convention, primary phases at elongation 0/90/180/270°, 29.5-day mean cycle, 97–99% day before/after full): https://aa.usno.navy.mil/faq/moon_phases
- NASA Eclipse GSFC — Moon Phases 6000-Year Catalog (mean synodic month 29.530588 d = 29 d 12 h 44 m 03 s for year 2000; individual lunations vary by several hours): https://eclipse.gsfc.nasa.gov/phase/phasecat.html
- Astropixels (Fred Espenak, computed with Meeus's *Astronomical Algorithms*) — Six Millennium Catalog of Phases of the Moon (phase tables 2001–2100 used to verify January 2025 instants): https://astropixels.com/ephemeris/phasescat/phasescat.html
- Moongiant — January 2025 moon phases (First Quarter Jan 6 23:56 UTC; Full Moon Jan 13 22:27 UTC; Last Quarter Jan 21 ~20:30 UTC; New Moon Jan 29 12:35 UTC): https://www.moongiant.com/moonphases/january/2025
- timeanddate — Moon phases: 8 phases, 4 primary phases, monthly tables: https://www.timeanddate.com/astronomy/moon/phases.html and https://www.timeanddate.com/moon/phases/timezone/utc?month=1&year=2025
- Wikipedia — Lunar phase (illuminated fraction k = (1 − cos θ)/2 = sin²(θ/2), θ = elongation; equivalent phase-angle form k = (1 + cos i)/2; approximation-error discussion): https://en.wikipedia.org/wiki/Lunar_phase
- Wikipedia — New moon (Brown Lunation Number epoch: first new moon of 2000 at ~18:14 UTC, 6 Jan 2000 = BLN 1): https://en.wikipedia.org/wiki/New_moon
- NASA Space Place — What Are the Moon's Phases? (educational phase ordering): https://spaceplace.nasa.gov/moon-phases
- Lahiri ayanamsha ≈ 24°12′ (2025) for the Vedic rashi cross-ref: see sibling research file `rashi.md` (same pipeline directory) and DrikPanchang ayanamsha references.
