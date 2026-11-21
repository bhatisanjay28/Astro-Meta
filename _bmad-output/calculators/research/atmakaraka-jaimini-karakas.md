# Atmakaraka & Jaimini Karakas — Research

> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Engine assumption: sidereal zodiac, Lahiri (Chitra Paksha) ayanamsha — same as Vyotish.

## 1. Purpose and who uses it

The **Chara Karakas** ("movable/temporal significators") are a Jaimini-system device: instead of planets having fixed significations, each planet is *assigned a role* based on how far it has travelled **within its sign** in the natal chart. The planet with the highest arc traversed becomes the **Atmakaraka (AK)** — the "soul significator", treated as the king of the chart — and the rest fill the remaining roles in descending order of degrees.

Who uses it:
- **Vedic astrologers (Jaimini lineage)** — karakas are the foundation of Jaimini techniques: Karakamsha, Chara Dasha, Ishta Devata derivation.
- **Astrology hobbyists / spiritual seekers** — the AK alone is extremely popular on the consumer web ("find your soul planet"); sites like AstroTalk and steer.coach market it as a personality/spiritual-purpose product.
- **Relationship-focused users** — the **Darakaraka (DK)** "spouse planet" is heavily marketed as a marriage indicator (AstroTalk's calculator is literally titled "Atmakaraka and Darakaraka Calculator").
- Downstream of this calculator inside Vyotish: **Ishta Devata** (needs AK's navamsha) and any future Chara Dasha feature.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Birth date | required | ISO `YYYY-MM-DD` (UI: dd/mm/yyyy) | 1900-01-01 … today (site-dependent; ephemeris supports wider) | today | Fixes planetary longitudes |
| Birth time | required | `HH:MM` or `HH:MM:SS`, 24h, local clock | 00:00:00–23:59:59 | 12:00 | Sub-minute precision matters: karaka rank depends on arc-seconds, and the Moon can move ~0.5°/2h. steer.coach explicitly notes exact time only becomes critical when two planets are near the top of the ranking |
| Birth latitude | required | decimal degrees, North positive | −90 … +90 | — | Converts place → local time/ephemeris; affects longitude negligibly but needed for correct time-zone application |
| Birth longitude | required | decimal degrees, East positive | −180 … +180 | — | Same as above |
| Time-zone / offset | required | IANA zone id or fixed offset | any valid zone | — | Local clock → UT for the ephemeris call |
| Karaka scheme | optional | enum: `7` (Sun…Saturn) or `8` (+Rahu) | 7 or 8 | recommend `7` (see §3) | Selects whether Rahu competes for a karaka role |
| Node type | optional | enum: `mean` or `true` (Rahu/Ketu) | — | `mean` | Only used in the 8-scheme; mean vs true Rahu can change its rank (see §6) |

Ayanamsha is **not** an input — engine standard (Lahiri) applies. Name/gender are not needed (AstroTalk asks for them; they have zero effect on computation).

### Recommended input set
`date + time + lat + lng + tz` (exactly what Vyotish already accepts) **plus** an optional `scheme=7|8` parameter defaulting to 7. No name, no gender. Reason: karakas are purely astronomical; AstroTalk's name/gender fields are marketing friction, not inputs.

### Current Vyotish input set
`GET /api/v1/calculators/karakas?date&time&lat&lng&tz` — matches the recommended set minus the scheme toggle. Gap: no scheme option (7-karaka hardcoded), no node-type option (irrelevant until 8-scheme is offered).

## 3. Formula(s) / method

### Step-by-step (common core)
1. Compute each planet's **sidereal longitude** (Lahiri) at birth: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn (Rahu only in the 8-scheme). **Ketu is never a chara karaka in either scheme** (it is the fixed Moksha-karaka). The Lagna is explicitly excluded from ranking (Paramarsh).
2. Compute the **degree within the sign**: `d = floor(sidereal_lon / 30°)` gives the sign index; `deg_in_sign = sidereal_lon − sign_index × 30°`, expressed in degrees-minutes-seconds (e.g., 26°10′ Leo → 26°10′). The sign itself is set aside (Paramarsh).
3. **Rahu adjustment (8-scheme only)**: because Rahu moves retrograde, its advancement is counted backwards: `deg_in_sign_rahu = 30° − deg_in_sign`. Worked example from Paramarsh: Rahu 5°20′ Sagittarius → 30° − 5°20′ = 24°40′.
4. **Sort descending** by adjusted degree-within-sign. Rank 1 = Atmakaraka, then each subsequent rank gets the next karaka name.
5. **Tie-breaking**: compare degrees; if equal, compare **minutes of arc**; if equal, compare **seconds** ("whichever has traversed maximum degrees… if degrees are identical, the one with more minutes of arc; if that too is same, seconds" — Sanjay Rath's Chara Karaka document; also the BPHS-based tradition). An exact tie to the arc-second is astronomically near-impossible; if it ever occurs, BPHS is quoted as saying "if two planets have equal degrees, then only we should consider Rahu as Karaka" (sarvatobhadra quoting BPHS) — in a 7-scheme implementation, define a deterministic secondary key (see §6) and document it as an engineering choice, not a classical rule.
6. Compute each karaka's **navamsha sign** (needed for Karakamsha / Ishta Devata downstream):
   - Each sign = 30° = 9 navamshas of **3°20′** each.
   - `part = floor(deg_in_sign ÷ 3°20′)` (0-based). Use integer arc-seconds: `part = floor(arcsec_in_sign ÷ 12000)`.
   - `navamsha_sign = (sign_index × 9 + part) mod 12` (Aries = 0). This single formula is equivalent to the classical rule "movable signs start navamsha from themselves, fixed from the 9th sign therefrom, dual from the 5th" (verified: Aries+0→Aries; Taurus fixed→9th = Capricorn = (1×9) mod 12; Gemini dual→5th = Libra = (2×9) mod 12; identical for all 12 — also stated as the "multiply total longitude by 9, take mod 360" shortcut).
   - The AK's navamsha sign is the **Karakamsha** — treated as a special "soul ascendant" in Jaimini reading.
7. Output all 7/8 karakas with planet, sign, degree-within-sign, and navamsha sign; highlight AK.

### Variant A — 7-karaka scheme (Sun…Saturn, Rahu excluded)
Ranks: 1 Atmakaraka → 2 Amatyakaraka → 3 Bhratrikaraka → 4 Matrikaraka → 5 Putrakaraka → 6 Gnatikaraka → 7 Darakaraka. Because there are only 7 planets for 8 classical slots, the **Atmakaraka doubles as Pitrikaraka** (father significator) in this scheme (Paramarsh). Used by: KN Rao school and most consumer sites (AstroTalk's calculator excludes Rahu/Ketu; steer.coach defaults to 7 with optional Rahu).

### Variant B — 8-karaka scheme (Sun…Saturn + Rahu)
Ranks: 1 Atmakaraka → 2 Amatyakaraka → 3 Bhratrikaraka → 4 Matrikaraka → **5 Pitrikaraka (own slot)** → 6 Putrakaraka → 7 Gnatikaraka → 8 Darakaraka. Rahu enters with the reverse-degree rule (step 3). Used by: Sanjay Rath lineage and BPHS-literalists; practitioners report it "works better" for many (Paramarsh, Reddit r/Nakshatras). Pitrukaraka is a distinct office — "not another name for Gnatikaraka" (Paramarsh).

### Karaka names and meanings
| # | 7-scheme | 8-scheme | Meaning |
|---|---|---|---|
| 1 | Atmakaraka (AK) | Atmakaraka (AK) | Soul; king of the chart; desires, character, the soul's core lessons (sarvatobhadra: "the decisions of the soul shall be the final reality for that native") |
| 2 | Amatyakaraka (AmK) | Amatyakaraka (AmK) | Minister; career, profession, execution of the soul's karma, mentors/advisors |
| 3 | Bhratrikaraka (BK) | Bhratrikaraka (BK) | Siblings, brotherhood; also the guru/mentor (sarvatobhadra) |
| 4 | Matrikaraka (MK) | Matrikaraka (MK) | Mother, home, emotional nourishment |
| 5 | Putrakaraka (PK) | **Pitrikaraka (PiK)** | 7-scheme: children, students, creativity. 8-scheme slot 5: father, paternal lineage, bosses/fatherly guides |
| 6 | Gnatikaraka (GK) | Putrakaraka (PK) | 7-scheme slot 6: relatives, community; obstacles, disease, litigation, competition (sarvatobhadra). 8-scheme slot 6: children |
| 7 | Darakaraka (DK) | Gnatikaraka (GK) | 7-scheme slot 7: spouse, partnership (also wealth per sarvatobhadra). 8-scheme slot 7: relatives/obstacles |
| 8 | — (AK doubles as Pitrikaraka) | Darakaraka (DK) | 8-scheme slot 8: spouse, partnership |

### RECOMMENDATION
**Ship the 7-karaka scheme as the default, with the 8-karaka scheme available as a documented toggle (8-scheme uses mean Rahu, reverse-30° rule).** Reasons: (1) the 7-scheme matches the current Vyotish implementation, so no behavioral break; (2) it matches the consumer-market expectation set by AstroTalk and most free tools, making Vyotish's output comparable and trustworthy to users who cross-check; (3) the 8-scheme inherits a second ambiguity — mean vs true node — that changes ranking near ties, which is a QA burden; (4) sources are genuinely split (BPHS/Rath tradition favors 8; KN Rao/Paramarsh present both), so an explicit toggle with a lineage note is the honest product answer. Always state on the result page which scheme was used.

### AK significance (for output copy)
- AK = the soul's planet; its planetary nature colors the native's core character and life lessons (Sun AK = leadership/ego themes, Saturn AK = patience/duty, etc. — AstroTalk, steer.coach).
- AK is read as the "king"; AK + Lagna-lord association in houses 1/7/9 is read as Raja-yoga-like (sarvatobhadra).
- The AK's **navamsha sign = Karakamsha**, a soul-ascendant used for Ishta Devata (12th from it) and spiritual/career reading (steer.coach karakamsa page, vidhata.app). Note: Rath lineage distinguishes **Karakamsha** (AK's navamsha sign) from **Swamsha** (navamsha Lagna itself).

## 4. Worked examples (≥3: normal, edge, boundary)

All examples sidereal, Lahiri ayanamsha. Degrees-within-sign shown as °′″. Navamsha via `(signIndex×9 + part) mod 12`, Aries=0.

### Example A (normal, real ephemeris) — 2026-11-21, 19:31:10 IST, New Delhi (28°38′08″N, 77°13′28″E)
Source of positions: DrikPanchang sidereal planetary positions page (default snapshot; Lahiri/Chitra Paksha; mean nodes).

| Planet | Sign | deg in sign | decimal | navamsha part | navamsha sign |
|---|---|---|---|---|---|
| Sun | Scorpio | 05°01′50″ | 5.030556 | 1 | Leo |
| Moon | Pisces | 23°56′25″ | 23.940278 | 7 | Aquarius |
| Mars | Leo | 03°57′20″ | 3.955556 | 1 | Taurus |
| Mercury | Libra | 15°33′35″ | 15.559722 | 4 | Aquarius |
| Jupiter | Leo | 02°02′53″ | 2.048056 | 0 | Aries |
| Venus | Virgo | 29°43′29″ | 29.724722 | 8 | Virgo |
| Saturn | Pisces | 14°01′42″ | 14.028333 | 4 | Scorpio |
| Rahu (mean) | Aquarius | 00°44′30″ → **adjusted 29°15′30″** | 29.258333 | 8 | Aquarius→ see note |

Sort (descending): Venus 29.724722 > Moon 23.940278 > Mercury 15.559722 > Saturn 14.028333 > Sun 5.030556 > Mars 3.955556 > Jupiter 2.048056.

**7-karaka result:** AK = **Venus** (Virgo 29°43′29″, navamsha Virgo) · AmK = Moon · BK = Mercury · MK = Saturn · PK = Sun · GK = Mars · DK = Jupiter.

**8-karaka result:** Rahu (adjusted 29°15′30″) slots in 2nd: AK = Venus · AmK = **Rahu** · BK = Moon · MK = Mercury · PiK = Saturn · PK = Sun · GK = Mars · DK = Jupiter.

Navamsha checks: Venus part = floor(29.724722/3.333333) = 8 → (5×9+8) = 53 mod 12 = 5 = Virgo. Moon (Pisces=11): (11×9+7) = 106 mod 12 = 10 = Aquarius. Jupiter (Leo=4): (4×9+0) = 36 mod 12 = 0 = Aries. Rahu (Aquarius=10): (10×9+8) = 98 mod 12 = 2 = Gemini.

This example also covers two boundary flavors: Venus at 29°43′29″ (one navamsa short of sign end → 9th navamsha, part=8) and Rahu at 0°44′30″ whose reverse rule maps 0.7475° → 29.2583° (rank flips from "lowest" to "2nd highest").

### Example B (normal birth chart, real ephemeris) — 1990-06-15, 10:30 IST, New Delhi
Source of positions: DrikPanchang sidereal positions with date/time params (Lahiri; mean nodes). All planets direct except Saturn and nodes.

| Planet | Sign | deg in sign | decimal | navamsha part | navamsha sign |
|---|---|---|---|---|---|
| Sun | Gemini | 00°07′14″ | 0.120556 | 0 | Libra |
| Moon | Aquarius | 17°44′44″ | 17.745556 | 5 | Pisces |
| Mars | Pisces | 17°06′04″ | 17.101111 | 5 | Sagittarius |
| Mercury | Taurus | 11°27′43″ | 11.461944 | 3 | Aries |
| Jupiter | Gemini | 22°05′46″ | 22.096111 | 6 | Aries |
| Venus | Aries | 24°42′15″ | 24.704167 | 7 | Scorpio |
| Saturn | Capricorn | 00°19′07″ | 0.319444 | 0 | Capricorn |
| Rahu (mean) | Capricorn | 15°58′46″ → **adjusted 14°01′14″** | 14.020556 | 4 | Scorpio |

Sort: Venus 24.704167 > Jupiter 22.096111 > **Moon 17.745556 > Mars 17.101111** (close pair, gap 38′40″ — resolved at the minutes level: 44′ vs 06′) > Mercury 11.461944 > Saturn 0.319444 > Sun 0.120556.

**7-karaka result:** AK = **Venus** (Aries 24°42′15″, navamsha Scorpio) · AmK = Jupiter · BK = Moon · MK = Mars · PK = Mercury · GK = Saturn · DK = Sun.

**8-karaka result:** Rahu (14°01′14″ adjusted) slots 5th: AK Venus · AmK Jupiter · BK Moon · MK Mars · **PiK Rahu** · PK Mercury · GK Saturn · DK Sun.

Navamsha spot-checks: Venus part = floor(24.704167/3.333333) = 7 → (0×9+7) = 7 = Scorpio. Saturn part = 0 → (9×9+0) = 81 mod 12 = 9 = Capricorn → Saturn in Capricorn navamsha (own-sign navamsha because it sits at 0°19′ of Capricorn, a movable sign starting navamshas from itself). Sun part = 0 → (2×9+0) = 18 mod 12 = 6 = Libra.

### Example C (edge + boundary, synthetic test fixture — inputs fully specified)
Synthetic sidereal longitudes (stated directly; deterministic fixture for automated tests):

| Planet | Sign | deg in sign | decimal | note |
|---|---|---|---|---|
| Sun | Virgo | 15°30′20″ | 15.505556 | near-tie with Mars |
| Moon | Aries | 00°00′00″ | 0.000000 | absolute minimum (0° traversed) |
| Mars | Leo | 15°28′55″ | 15.481944 | near-tie with Sun |
| Mercury | Pisces | 29°59′59″ | 29.999722 | one arc-second from sign end |
| Jupiter | Sagittarius | 03°20′00″ | 3.333333 | exactly on a navamsa boundary |
| Venus | Taurus | 00°00′01″ | 0.000278 | one arc-second into the sign |
| Saturn | Libra | 10°00′00″ | 10.000000 | — |

Sort: Mercury 29.999722 > Sun 15.505556 > Mars 15.481944 > Saturn 10.000000 > Jupiter 3.333333 > Venus 0.000278 > Moon 0.000000.

**7-karaka result:** AK = Mercury (Pisces 29°59′59″) · AmK = **Sun** (tie pair decided at the *minutes* level: 30′ > 28′) · BK = Mars · MK = Saturn · PK = Jupiter · GK = Venus · DK = Moon.

Navamsha checks (boundary behavior): Jupiter at exactly 3°20′00″ = 12000 arc-sec → part = **1** (2nd navamsha, not the 1st): (8×9+1) = 73 mod 12 = 1 = Taurus. Implementation must use integer arc-seconds (`floor(arcsec/12000)`), not `floor(3.333333…/3.333333…)` in binary floating point, or the boundary case can round to part 0. Mercury part = floor(29.999722/3.333333) = 8 → (11×9+8) = 107 mod 12 = 11 = Pisces. Moon part = 0 → (0×9+0) = 0 = Aries (vargottama). Mars part = 4 → (4×9+4) = 40 mod 12 = 4 = Leo (vargottama).

### Example D (8-scheme tie rule, documentary) — UNVERIFIED beyond quotes
Documented but not reproduced numerically: BPHS (as quoted by sarvatobhadra) — "if two planets have equal degrees, then only we should consider Rahu as Karaka"; Rath-tradition documents resolve ties by minutes then seconds. Treat any exact-tie fallback in code as an engineering decision (e.g., stable secondary key = classical order Sun→Saturn, Rahu last), clearly logged in the API response. Marked UNVERIFIED because no source demonstrates it on a real chart.

## 5. Complete output list

What a GOOD karaka calculator shows:
1. All 7 (or 8) karakas, in rank order, each with: karaka name (with abbreviation AK/AmK/BK/MK/PiK/PK/GK/DK), planet, rashi sign, degree-within-sign (°′″), navamsha (D9) sign, retrograde flag for the planet.
2. **AK visually highlighted** (badge "Soul planet") + short significance paragraph for AK's planetary nature.
3. Stated scheme ("7-karaka / Rahu excluded" or "8-karaka / Rahu included, reverse-counted") and ayanamsha used.
4. Karakamsha sign (AK's navamsha sign) explicitly named — needed by users and by the Ishta Devata feature.
5. Optional interpretive layer: per-planet AK lessons (AstroTalk/steer.coach style) and DK relationship themes; Darakaraka explanation for the marriage-market segment.
6. Ephemeris transparency: the 7/8 input longitudes (sign + degree) so the user can verify — steer.coach shows the ranked list from raw positions.
7. Disclaimer: birth-time sensitivity (a few arc-minutes can flip the Moon vs a neighbor; retrograde-near-cusp cases), and a note that the 7/8-scheme debate is lineage-dependent.

### Competitor comparison
| Output element | AstroTalk (atmakaraka-and-darakaraka-calculator) | steer.coach (find-my-atmakaraka) | DrikPanchang | Vyotish (current) |
|---|---|---|---|---|
| Inputs | Name, gender, dob, tob, place | date, time, place | no dedicated tool (positions page only) | date, time, lat, lng, tz |
| Planets used | AK+DK only; excludes Rahu/Ketu (7-planets; page inconsistently lists Rahu traits) | Sun…Saturn default, optional Rahu 8-scheme | n/a | Sun…Saturn (7) hardcoded |
| All 7/8 karakas shown | No (AK + DK only) | Yes (ranked list) | n/a | **Yes (7)** |
| Degrees shown | No (sign + nakshatra only) | Yes (deg-within-sign) | raw positions | Yes (`degree_in_sign`) |
| Navamsha of each karaka | No | Not in main output | n/a | **Yes** |
| AK highlighted + meaning | Yes (rich per-planet lessons) | Yes (themes) | n/a | Partial (karaka name only) |
| Scheme disclosure | Not stated | Stated (7 vs 8 toggle) | n/a | Not stated (implicit 7) |
| Retrograde flags | No | Not extracted | Yes | Not in karakas output |
| Disclaimer | "birth time accuracy" note | birth-time sensitivity note | n/a | none found |

(VedicRishi also has an "Atmakaraka Calculator" page — its body did not load for verification; treat as list-only evidence, UNVERIFIED detail.)

### Current Vyotish outputs
`GET /api/v1/calculators/karakas?date&time&lat&lng&tz` → `karakas` = exactly 7 objects `{karaka, planet, sign, degree_in_sign, navamsha_sign}` with karaka ∈ {Atmakaraka, Amatyakaraka, Bhratrikaraka, Matrikaraka, Putrakaraka, Gnatikaraka, Darakaraka}. Algorithm: 7-karaka Jaimini scheme over Sun…Saturn (Rahu excluded), sorted descending by degree-within-sign; navamsha sign = `(signIndex×9 + part) mod 12`. Page: `/calculators/karakas`. Inputs shown: birth date/time/place (no name/gender).

### Initial gap list
1. **No scheme choice / disclosure** — output never says "7-karaka, Rahu excluded"; users comparing with Rath-lineage tools will see different AK when Rahu competes. Add `scheme` param + displayed scheme note.
2. **No AK emphasis** — all 7 objects are flat; AK should be flagged/highlighted and given a significance paragraph.
3. **No retrograde flags** on karaka planets (competitors show them; cheap to add from engine).
4. **No degrees transparency for verification** — `degree_in_sign` exists (good) but navamsha part / ayanamsha not exposed; consider echoing ayanamsha + raw longitudes for trust.
5. **No tie/near-tie warning** — when the #1 vs #2 gap is small (or Moon involved), warn about birth-time sensitivity (steer.coach does this narratively).
6. **No Pitrikaraka slot** — 8-scheme users expect PiK; needs the toggle, not a hardcode.
7. **No Karakamsha named output** — AK's navamsha sign is computed per-karaka but not surfaced as "Karakamsha: <sign>", which is what downstream Ishta Devata and Jaimini-literate users want.
8. **No disclaimer** on birth-time sensitivity or scheme lineage.

## 6. Edge cases and validation rules

1. **Tie-break chain**: degrees → minutes → seconds. Implement with integer arc-seconds to avoid float equality failures. Exact tie (≤1 arc-sec apart at same deg/min): deterministic fallback required; document in response; note the BPHS "equal degrees → consider Rahu" quote is scheme-dependent, not an implementable spec.
2. **Sign boundaries**: 0°00′00″ (min, e.g., Sun 00°07′14″ Gemini in Example B; Moon at exactly 0° in Example C) and 29°59′59″ (max, Example C). Both must rank correctly: 0° is the lowest possible arc (instant DK in 7-scheme), 29°59′ the highest (instant AK).
3. **Navamsa boundary**: deg_in_sign exactly divisible by 3°20′ (e.g., 3°20′00″, 6°40′00″, 10°00′00″) belongs to the **next** navamsa (part = k, not k−1). Integer arithmetic mandatory.
4. **Rahu reverse rule at boundaries**: Rahu at 0°00′30″ → adjusted 29°59′30″ (near-max); Rahu at 29°59′30″ → adjusted 0°00′30″. Never apply reverse rule to other planets.
5. **Mean vs true node**: Example B mean Rahu 15°58′46″ (adj 14°01′14″) vs true 14°22′31″ (adj 15°37′29″) — true-Rahu adjustment ranks higher; in tight charts this can change PiK/GK assignments. Fix one (recommend mean, matching DrikPanchang default) and label it.
6. **Moon speed**: Moon moves ~13°/day (≈ 32′/hour); a wrong birth time by 15 min can swap the Moon's rank vs a neighbor (Example B's Moon–Mars gap is only 38′40″ ≈ 72 minutes of clock error). Emit a near-tie sensitivity warning when top-rank gap < 30′.
7. **Retrograde planets**: ranking uses degree-within-sign regardless of retrograde motion (Saturn retro in Example B still ranks normally); do NOT apply the Rahu reverse rule to retrograde inner planets — sources apply reverse counting only to the nodes.
8. **Date validation**: reject date-only queries (no time) with 400 + message; karaka output without a time is misleading (see item 6).
9. **Precision contract**: round outputs to arc-second (DMS) in display; keep arc-seconds internally.
10. **Consistency downstream**: the Ishta Devata endpoint must consume the *same* AK computation (same scheme toggle state) or the two pages can contradict each other.

## 7. Sources

- Paramarsh — Jaimini Astrology: Karakas and Chara Dasha (degree-within-sign method, Rahu 30°− rule with 5°20′→24°40′ example, 7 vs 8 scheme lists, Lagna excluded, Ketu excluded): https://paramarsh.app/patrika/dashas-transits/jaimini-astrology-karakas
- Sanjay Rath tradition — Chara Karaka System document (tie rule: degrees → minutes → seconds): https://www.scribd.com/document/356424906/Chara-Karak-a-Scheme-Color-Final
- Sarvatobhadra — Demystifying Chara Karaka (8 karaka names/meanings, AK-as-king, BPHS equal-degrees quote, AK+Lagna lord yoga): https://www.sarvatobhadra.com/char-karaka
- steer.coach — Atmakaraka calculator (method, Swiss Ephemeris, ayanamsha subtraction, Rahu-optional 8-scheme, birth-time sensitivity): https://steer.coach/find-my-atmakaraka
- steer.coach — Karakamsa (Karakamsha = AK's navamsha sign, soul ascendant): https://steer.coach/karakamsa
- AstroTalk — Atmakaraka and Darakaraka calculator (inputs incl. name/gender, AK+DK-only output, 7-planet exclusion of nodes, per-planet meanings): https://astrotalk.com/atmakaraka-and-darakaraka-calculator
- vidhata.app — Karakamsha & Ishta Devata overview (Karakamsha vs Swamsha, 12th-from rule): https://vidhata.app/blog/karakamsha-ishta-devata-jaimini-vedic-astrology
- Navamsa calculation (3°20′ partitions; movable/fixed/dual starting signs; ×9-mod-360 equivalence): https://www.scribd.com/document/133753260/Navamsa-Calculation and http://tuningmymelody.blogspot.com/2019/08/navamsa-construction-and-other.html
- DrikPanchang — Sidereal planetary positions (worked-example ephemeris for 2026-11-21 and 1990-06-15, Lahiri/Chitra Paksha, mean nodes default): https://www.drikpanchang.com/planet/position/planetary-positions-sidereal.html
- 7-vs-8 debate practitioner discussion (Reddit r/Jyotishya — original-text degrees-vs-minutes debate; r/Nakshatras — 8-scheme preference): https://www.reddit.com/r/Jyotishya/comments/1biij4z/ ; DD Planet — Resolving Chara Karaka confusion (article body did not render; referenced via search snippet only — UNVERIFIED detail): https://www.ddplanet.in/blogs/astrology-jataka/resolving-chara-karaka-confusion-seven-or-eight
- Vyotish codebase scan (current implementation facts): internal, 2026-11-21.
