# Current Transit Chart (Gochara) — Research

> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Engine assumption: sidereal zodiac, Lahiri (Chitra Paksha) ayanamsha — same as Vyotish.

## 1. Purpose and who uses it

A **transit (gochara)** chart shows where the planets are **right now** (or at any chosen moment) in the sidereal zodiac. In Vedic practice its interpretive value comes from comparing those current positions against the **natal chart** — classically by counting whole-sign **houses from the natal Moon (Chandra lagna)**, with the natal Lagna used as a second, complementary reference. It answers everyday questions: "Is now a good time to…?", "When does my Sade Sati start/end?", "Why is Jupiter good for me this year?".

Who uses it:
- **Daily-checkers** (the largest segment): open a "today's transit" page daily; AstroSage frames its whole transit product "in respect to your birth chart's Rashi (Moon-sign)".
- **Saturn-watchers**: Sade Sati (~7.5 years, three phases) and Ashtama/Ardhashtama Shani are among the most-searched Vedic topics; they are pure gochara-from-Moon constructs.
- **Practitioners/astrologers**: want a drawn chart (biwheel: natal inner wheel, transits outer) with degrees, retrograde flags, and house counts — the astro.com / astro-seek pattern.
- **Vyotish product-wise**: the current endpoint is a place-only "current sky snapshot" with no natal reference — it shows the sky but cannot *interpret* it. This file specifies both levels (snapshot + natal overlay).

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Place (lat/lng/tz) | required | decimal degrees + IANA tz | ±90 / ±180 / any zone | user's saved place | Snapshot time zone and local moment; planets' signs are place-independent (to seconds), but "now" is local |
| As-of date/time | optional | ISO datetime | any past/future | **now** | Vyotish hardcodes "now"; AstroSage lets users pick a target date ("select the date you want the transit for") — cheap to support, big use-case (planning) |
| Birth date/time/place | optional (required for gochara layer) | same as other calculators | — | — | Needed only for the interpretive layer: natal Moon sign (Chandra lagna), natal Lagna sign, biwheel overlay |
| Chart style | optional | North/South Indian | — | North | For the drawn chart (AstroSage offers both) |
| Ayanamsha | optional (engine-level) | fixed Lahiri recommended | — | Lahiri | Engine standard; AstroSage exposes multiple, unnecessary here |

**Place-only vs full birth-chart overlay — research finding:** the leading tools do NOT stop at a bare current-positions list. AstroSage's Transit Today requires birth details and computes the transit chart against the natal Moon sign; AstroTalk's Transit Chart Calculator explicitly describes a biwheel — "the inner circle is your birth chart, and the outer ring shows where the planets are now"; astro.com ("Natal chart and transits") and astro-seek draw the same biwheel with natal houses fixed so users see which natal houses the transiting planets occupy. DrikPanchang's sidereal planetary-positions page is the notable place-only exception (positions table only). **Conclusion: a GOOD transit tool overlays transiting planets on the natal chart (at minimum, house-from-Moon counts; ideally a drawn biwheel). A place-only snapshot is the "position data" tier, not the product tier.**

### Recommended input set
Two tiers on one page: (a) **Snapshot tier** (place-only, default "now", optional target datetime): current sidereal positions table + drawn transit chart. (b) **Gochara tier** (adds birth data, or auto-reuses the user's saved kundli): house counts from natal Moon and from natal Lagna, favorable/unfavorable flags per the gochara table, Sade Sati phase, biwheel drawing.

### Current Vyotish input set
`GET /api/v1/calculators/transits?lat&lng&tz` — **no date parameter (always "now"), place-only, no birth data**. Page `/calculators/transits`.

## 3. Formula(s) / method

### Core computation
1. For the as-of UTC instant, compute each planet's **sidereal longitude** (Lahiri): Sun…Saturn + mean (or true) Rahu & Ketu. Snapshot = these nine positions at a timestamp.
2. Sign = `floor(lon / 30°)`; degree-in-sign = `lon mod 30°` (show DMS); nakshatra = `floor(lon / (13°20′))` with pada = 1/4 of nakshatra; retrograde flag from ephemeris speed (Sun/Moon never retrograde).
3. **Gochara house from natal Moon (Chandra lagna):** `house_from_moon = ((transit_sign_index − natal_moon_sign_index) mod 12) + 1` — whole-sign counting; the Moon's *degree* is irrelevant, only its sign.
4. **Gochara house from natal Lagna:** same formula with natal Lagna sign index. Both are used in practice; classical gochara tables are stated from the Moon, and modern tools additionally show houses from the Lagna. RECOMMENDATION: compute **both**; interpret primarily from the Moon (that is what the classical tables below are calibrated to), show Lagna houses as supplementary columns — AstroSage anchors its product on the Moon-sign, astro.com/astro-seek on natal houses from the Lagna.

### The classical gochara table (houses counted from the natal Moon)
Favorable houses per transiting planet (standard/consensus list, cross-checked across two independent sources):

| Transiting planet | Favorable houses from natal Moon | Unfavorable (remainder) | Variant notes |
|---|---|---|---|
| Sun | 3, 6, 10, 11 | 1, 2, 4, 5, 7, 8, 9, 12 | consistent |
| Moon | 1, 3, 6, 7, 10, 11 | 2, 4, 5, 8, 9, 12 | luckygemfinder drops 7 (gives 1,3,6,10,11) — treat 7 as variant |
| Mars | 3, 6, 11 | 1, 2, 4, 5, 7, 8, 9, 10, 12 | luckygemfinder adds 10 (3,6,10,11) — variant |
| Mercury | 2, 4, 6, 8, 10, 11 | 1, 3, 5, 7, 9, 12 | consistent |
| Jupiter | 2, 5, 7, 9, 11 | 1, 3, 4, 6, 8, 10, 12 | consistent; matches "Jupiter good in 2,5,7,9,11" everywhere |
| Venus | 1, 2, 3, 4, 5, 8, 9, 11, 12 | 6, 7, 10 | a separate school says Venus is bad only in 6 — variant; all sources agree Venus is the exception to "12th always bad" |
| Saturn | 3, 6, 11 | 1, 2, 4, 5, 7, 8, 9, 10, 12 | consistent — verify claim "bad in 1,2,4,5,7,8,9,10,12": CONFIRMED by both sources |
| Rahu | 3, 6, 11 | remainder | luckygemfinder adds 10 (3,6,10,11) — variant |
| Ketu | 3, 6, 11 | remainder | same variant as Rahu |

Folk-synthesis seen in sources: "all planets give good results in the 11th except Venus; all give bad results in the 12th except Venus" — useful sanity check for the table above.

### Saturn special periods (all counted from the natal Moon)
- **Sade Sati** (~7.5 years; name = "seven and a half"): Saturn transits the **12th, then 1st, then 2nd** sign from the natal Moon — three phases of ~2.5 years each (Rising / Peak / Setting); recurs every ~29.5 years. Begins when Saturn enters the 12th sign from the Moon; ends when Saturn enters the 3rd.
- **Ashtama Shani**: Saturn in the **8th** from natal Moon (source-flagged as very unfavorable: illness, surgery, financial hardship).
- **Ardhastama Shani**: Saturn in the **4th** from natal Moon ("half-eight": family problems, accidents, financial instability).
- Saturn favorable transit = **3rd** from Moon (end of the Sade Sati cycle).

### Advanced: Gochara Vedha (obstruction)
A planet transiting a *vedha* position can obstruct a benefic transit (source example: Jupiter transiting the 2nd from the Moon is diminished if another planet occupies the 12th). Full vedha-pair table was not verbatim-verified — **UNVERIFIED beyond the Jupiter-2/12 example; mark as advanced/optional.**

### RECOMMENDATION
Interpret from the **natal Moon first** (classical tables are Moon-based; Sade Sati family is Moon-based; AstroSage's product is Moon-sign-based) and **show natal-Lagna house positions as a second column** (modern biwheel convention). Ship the snapshot tier (no birth data) and the gochara tier (with birth data) on the same page so the page still works for anonymous users. Use whole-sign counting everywhere; never degree-based houses for gochara.

## 4. Worked examples (≥3: normal, edge, boundary)

Natal fixture (reused from the other two research files): **born 1990-06-15, 10:30 IST, New Delhi** — natal Moon = **Aquarius** 17°44′44″ (Chandra lagna = Aquarius, sign index 10); natal Lagna = **Leo** 06°12′31″ (index 4). All positions Lahiri sidereal (DrikPanchang).

### Example A (normal, real ephemeris) — current snapshot 2026-11-21, 19:31:10 IST, New Delhi
Transit positions (DrikPanchang sidereal page; mean nodes): Sun 05°01′50″ Scorpio · Moon 23°56′25″ Pisces · Mars 03°57′20″ Leo · Mercury 15°33′35″ Libra · Jupiter 02°02′53″ Leo · Venus 29°43′29″ Virgo (debilitated) · Saturn 14°01′42″ Pisces (R) · Rahu 00°44′30″ Aquarius (R, mean) · Ketu 00°44′30″ Leo (R, mean).

**Houses from natal Moon (Aquarius):** `house = ((transit_sign − 10) mod 12) + 1`
| Planet | Transit sign | From Moon | Gochara verdict (standard table) |
|---|---|---|---|
| Sun | Scorpio | (7−10)mod12=9 → **10th** | favorable (3,6,10,11) |
| Moon | Pisces | 1 → **2nd** | unfavorable |
| Mars | Leo | (4−10)mod12=6 → **7th** | unfavorable (3,6,11; also unfavorable in the luckygemfinder variant) |
| Mercury | Libra | 8 → **9th** | unfavorable (2,4,6,8,10,11) |
| Jupiter | Leo | 6 → **7th** | **favorable** (2,5,7,9,11) |
| Venus | Virgo | 7 → **8th** | favorable (1,2,3,4,5,8,9,11,12) |
| Saturn | Pisces (R) | 1 → **2nd** | unfavorable + **Sade Sati setting (3rd/last) phase** |
| Rahu | Aquarius (R) | 0 → **1st** | unfavorable (3,6,11) |
| Ketu | Leo (R) | 6 → **7th** | unfavorable |

**Houses from natal Lagna (Leo):** Sun→4th, Moon→8th, Mars→1st, Mercury→**3rd (favorable from Lagna-table framing)**, Jupiter→1st, Venus→2nd, Saturn→8th, Rahu→7th, Ketu→1st. Note Saturn is simultaneously 2nd-from-Moon (Sade Sati phase) and 8th-from-Lagna — a good demonstration of why both columns must be shown separately and never merged.

Snapshot-tier test assertions (no birth data): every planet's sign/nakshatra/retro flag matches the table above; Saturn retro = true; Sun/Moon/Venus/Mars/Mercury/Jupiter direct.

### Example B (edge: live Sade Sati boundary — real future event)
Same native. Sade Sati for Aquarius-Moon natives **ends the moment Saturn leaves Pisces and enters Aries (sidereal)**, because house-from-Moon goes 2nd → 3rd and 3rd is Saturn's only clearly favorable house and the terminal marker of Sade Sati. With Saturn at 14°01′42″ Pisces (R) on 2026-11-21, Sade Sati is still active (setting phase). Expected end: Saturn's sidereal entry into Aries (astro transit guides reference a 2027 Saturn-Aries ingress — exact date **UNVERIFIED here; validate against DrikPanchang's Saturn transit dates before asserting**). Test assertion: on the ingress date, `sade_sati.phase = null` (ended) and Saturn's house-from-Moon = 3 (favorable); the day before, phase = "setting" and house = 2 (unfavorable).

### Example C (edge: natal Moon sign boundary, synthetic)
Native with natal Moon at **29°59′59″ Pisces** vs the same chart with Moon at **00°00′00″ Aries**: Chandra lagna flips Pisces→Aries, and every gochara house count shifts by exactly 1 (e.g., transit Saturn in Pisces = 1st-from-Moon (peak Sade Sati) for the Pisces-Moon native, but 12th-from-Moon (Sade Sati rising) for the Aries-Moon native). Validates: (1) house-from-Moon uses the Moon's **sign** only; (2) near-boundary natal Moons inherit birth-time fragility → emit a warning when natal Moon is within 30′ of a sign boundary; (3) `sade_sati.phase` must be computed from the sign, not the degree.

### Example D (as-of date param, synthetic)
Same native, target = 2027-01-15 12:00 IST: recompute all nine longitudes for that instant (ephemeris call, not cached "now"). Assertions: output `as_of` matches the requested instant; signs differ from Example A for fast movers (Moon moves ~13°/day ≈ one sign every 2.5 days; Mercury/Venus also likely shift), while slow movers (Jupiter/Saturn/Rahu) may hold their signs. Validates the optional target-date input recommended in §2 (AstroSage supports it).

## 5. Complete output list

What a GOOD current-transit calculator shows:
1. **Snapshot header**: as-of timestamp (ISO + local with tz), place, ayanamsha disclosure ("Lahiri/Chitra Paksha"), mean/true node note.
2. **Nine-graha table**: planet, sidereal sign, degree-in-sign (DMS), continuous longitude, nakshatra + pada, retrograde flag (Sun/Moon never retrograde), speed or next-sign-change date (advanced).
3. **Drawn chart**: the transit chart itself (North/South Indian style for a Vedic audience) — currently missing in Vyotish.
4. **Gochara layer (with birth data)**: biwheel (natal inner, transit outer — the AstroTalk/astro.com/astro-seek pattern); for each transiting planet: house from natal Moon **and** from natal Lagna; favorable/unfavorable badge per the standard table (with variant notes for Moon-7/Mars-10/Rahu-Ketu-10); Sade Sati phase banner (rising/peak/setting/ended) + Ashtama/Ardhastama Shani flags; interpretation snippets per planet-house.
5. **Vedha note** (optional/advanced) and an explanation that gochara is one lens among several (dasha, varga charts) — a disclaimer, not a substitute.
6. **Disclaimers**: snapshot ≠ prediction of event timing; whole-sign counting; retrograde/mean-node methodology disclosed.

### Competitor comparison
| Output element | AstroSage (free/transit-today.asp) | AstroTalk (transit-chart-calculator) | DrikPanchang (sidereal positions page) | astro-seek / astro.com | Vyotish (current) |
|---|---|---|---|---|---|
| Inputs | name/sex/dob/tob/place + **target date** + advanced (ayanamsha, chart style) | name/gender/dob/tob/place | place (+date params in URL) | birth data + arbitrary as-of | lat/lng/tz only, hardcoded "now" |
| Positions table with degrees | unstated in fetched view | prose only | **Yes** (deg, nakshatra, pada, retro, mean/true nodes, ayanamsha note) | Yes | **Yes** (lon, sign, nakshatra, pada, retrograde) |
| Chart drawn | "transit chart" claimed | **biwheel described** (inner natal, outer transits) | No | **biwheel with natal houses** | **No** |
| Houses from natal Moon | Yes (Moon-sign framing) | house themes described | No | natal houses (Lagna-based, Western) | **No** |
| Gochara good/bad table | separate gochar content | not explicit | No | No (Western) | **No** |
| Sade Sati flag | separate Sade Sati report | named in prose | separate page (URL variant; our fetch 404'd) | No | **No** |
| Retrograde flags | unstated | unstated | **Yes** | Yes | **Yes** |
| As-of transparency | target-date selectable | now | date shown | Yes | `as_of` + `meta.cache` (good) |

### Current Vyotish outputs
`GET /api/v1/calculators/transits?lat&lng&tz` → `as_of` (ISO), `timezone`, `grahas` = 9 × `{planet, lon, sign, signIndex, nakshatra, nakshatraIndex, pada, retrograde}`, `meta.cache`. Page `/calculators/transits`. Solid snapshot tier — no houses, no gochara interpretation, no chart drawing, no natal overlay, no target-date.

### Initial gap list
1. **No natal overlay / gochara layer** — the tool shows the sky but not its meaning for the user; every leading competitor ties transits to a birth chart (AstroSage Moon-sign framing, AstroTalk biwheel, astro-seek/astro.com biwheel). Reuse saved birth data if the user has any Vyotish chart.
2. **No house counts** (from Moon or Lagna) — one `mod`-12 subtraction each; highest value-per-line-of-code in this file.
3. **No favorable/unfavorable badges** per the standard gochara table (§3) — the table must ship as versioned data, not inline strings.
4. **No Sade Sati phase flag** (rising/peak/setting/ended) + Ashtama/Ardhastama Shani — the single most-searched use case; one sign-distance check from natal Moon.
5. **No chart drawing** — even the snapshot tier should render the transit chart (North/South Indian style).
6. **No target-date parameter** — hardcoded "now" blocks planning use cases AstroSage supports; add optional `as_of` (respecting cache semantics).
7. **No DMS degree display** (only continuous `lon`) — Vedic users expect 14°01′42″ format.
8. **No mean/true node disclosure** — output says Rahu/Ketu but not which node variant (DrikPanchang defaults mean and says so).
9. **No disclaimers/variant notes** (gochara is one lens; whole-sign counting; Venus/Saturn school differences).
10. **Cache UX** — `meta.cache` exists but no visible "as of local time" header on the page; make the timestamp human-readable with tz.

## 6. Edge cases and validation rules

1. **Whole-sign counting only**: house-from-Moon/Lagna uses sign indices, never degrees. Transit planet at 29°59′59″ of a sign still counts in that sign (Venus at 29°43′29″ Virgo = 8th from Aquarius Moon in Example A).
2. **Sign-boundary snapshot races**: Moon moves ~13°/day — a cached snapshot can be minutes stale and change the Moon's sign near a cusp. Include `as_of` in the response (Vyotish already does) and invalidate cache on a tight TTL for the Moon row (or the whole payload); competitors don't disclose TTL, so set and document one.
3. **Sade Sati phase transitions**: phase must flip exactly at sign ingress (Example B); compute from signs only; handle the "Saturn retrograding back into the 2nd from Moon" case — Sade Sati *resumes* (phase reverts to setting) when Saturn re-enters Pisces after touching Aries; do not treat phase as monotonic.
4. **Rahu/Ketu**: always exactly 6 signs apart — assert `(rahu_index + 6) mod 12 == ketu_index`; both flagged retrograde by convention (nodes are always retrograde in motion; DrikPanchang lists them R). House counts for nodes use the same whole-sign rule.
5. **Retrograde flags**: never set for Sun/Moon; validate ephemeris speed sign, not longitude deltas alone (a delta across an apex can mislabel).
6. **Mean vs true node**: picks affect degree (Example B in the karakas file: mean 15°58′46″ vs true 14°22′31″ Capricorn) and, rarely, sign near a boundary → which changes gochara houses. Pin mean (DrikPanchang default) and disclose.
7. **Ayanamsha consistency**: transit signs must use the same Lahiri ayanamsha as natal charts, or house counts (which subtract natal from transit) can silently flip near cusps.
8. **Timezone/DST**: as-of local display must use the place's tz including historical DST for target dates; the gochara layer's natal data must resolve the same way as other calculators.
9. **Gochara table variants**: Moon-7 / Mars-10 / Venus-school / Rahu-Ketu-10 differences must be data-versioned with source URLs (§3), never silently mixed.
10. **Anonymous users**: the gochara layer must degrade gracefully — snapshot tier renders fully with place-only input; gochara tier shows a birth-details prompt instead of zeros.

## 7. Sources

- luckygemfinder (dr.gurudeva) — Gochara predictions (full favorable/unfavorable house tables per planet from natal Moon; Sade Sati phase framing; Ardhastama; gochara vedha with Jupiter-2/12 example): https://www.luckygemfinder.com/gochara-predictions.html
- Standard gochara table cross-check (Moon 1,3,6,7,10,11; Mars/Saturn/Rahu/Ketu 3,6,11; Mercury 2,4,6,8,10,11; Jupiter 2,5,7,9,11; Venus 1,2,3,4,5,8,9,11,12; Sun 3,6,10,11) — aggregated search results incl. Scribd "Gochara Effects of All Planets": https://www.scribd.com/doc/44810792/Gochara-Effects-of-All-Planets
- AstroSage — Free Transit Today (birth-data input, target-date support, transit chart vs natal Moon-sign framing, advanced ayanamsha/chart-style options): https://www.astrosage.com/free/transit-today.asp
- AstroTalk — Transit Chart Calculator (biwheel description "inner circle is your birth chart, outer ring shows where the planets are now"; house themes; Sade Sati mention): https://astrotalk.com/transit-chart-calculator
- astro.com — transits/biwheel ("Natal chart and transits" chart type; natal houses fixed): https://www.astro.com/horoscope
- astro-seek — Transit Chart Calculator (biwheel incl. natal houses): https://horoscopes.astro-seek.com/transit-chart-planetary-transits
- DrikPanchang — Sidereal planetary positions (worked-example ephemeris 2026-11-21 19:31:10 IST New Delhi; 1990-06-15 natal fixture; Lahiri/Chitra Paksha; mean nodes; retrograde flags): https://www.drikpanchang.com/planet/position/planetary-positions-sidereal.html
- Sade Sati definition (7.5 years; 12th-1st-2nd from natal Moon; three ~2.5-year phases; ~29.5-year recurrence) — aggregated sources incl. AstroPundit/Rasilagnam summaries (per search snippets; DrikPanchang sade-sati URL variant returned 404 — cite via AstroSage's separate Sade Sati report product page): https://www.astrosage.com/free/transit-today.asp (report list) — exact sade-sati page URL UNVERIFIED.
- Vyotish codebase scan (current implementation facts): internal, 2026-11-21.
