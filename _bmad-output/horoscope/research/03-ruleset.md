# Mary (Analyst) — Research 3: The Horoscope Rule Set v1 (transit data → text & ratings)
**Horoscope Upgrade · Step 1 of 5 · 2026-11-24 · Owner-approval pending**

This is the formal, implementable rule set that maps **real planetary positions (our astronomy-engine, Lahiri sidereal, IST)** to **ratings, lucky attributions, mantra/deity, and text-selection conditions** for all 12 signs × 4 periods. Everything here is deterministic: the same date + sign + lang always produces the same horoscope, and every text slot is driven by data, never invented at write time.

Grounding and citations live in `01-vedic-horoscope-methodology.md`. Items marked **[VAR]** are recorded variances between traditions — we pick one and disclose it on-page. Items marked **[ED]** are our own editorial conventions (deterministic, disclosed on-page).

---

## 1. Inputs

Per evaluation date **D** (IST calendar date; vedic day = sunrise→sunrise already computed by `computePanchang`):

```
snapshot(D) = {
  for p in [Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu]:
      p.signIndex          // 0..11 sidereal (Lahiri, computed — engine already does this)
      p.retrograde         // engine already computes; Sun/Moon false by definition
  moonNakshatra, tithi, yoga, karana, vaar, sunrise/sunset   // panchang engine
  moonPhase, nextNew/nextFull                                // engine/calculators.ts
}
```

All of these already exist in the backend engine (`planetaryPositions`, `computePanchang`, `moonPhase*`, mean nodes). Nothing new is needed at the ephemeris layer.

**Reference convention**: houses are counted **zodiacally from the rashi itself** — `house(p, s) = ((p.signIndex − s) mod 12) + 1`. The reader's rashi is treated as their Moon-sign (house 1). [ED — consistent with Chandra-lagna gochara, see methodology §0]

---

## 2. Planet favorability tables (from Moon sign)

### 2.1 Favorable houses

| Planet | Favorable houses | Unfavorable | Notes |
|---|---|---|---|
| Sun | 3, 6, 10, 11 | rest | standard table |
| Moon | 1, 3, 6, 7, 10, 11 | 2, 4, 5, 8, 9, 12 | [VAR] Indastro lists 1,3,6,10,11 but its own 7th-house text is positive; Phaladeepika-lineage tables include 7 → **we include 7** |
| Mars | 3, 6, 11 | rest | [VAR] some modern tables add 10; **we keep classical 3,6,11**, house 10 = neutral for Mars |
| Mercury | 2, 4, 6, 8, 10, 11 | 1, 3, 5, 7, 9, 12 | standard table |
| Jupiter | 2, 5, 7, 9, 11 | 1, 3, 4, 6, 8, 10, 12 | standard table; Jupiter in house 1 (on the rashi) gets a small editorial boost — see §4.4 |
| Venus | 1, 2, 3, 4, 5, 8, 9, 11, 12 | 6, 7, 10 | standard table (12th = mildly favorable) |
| Saturn | 3, 6, 11 | rest | standard table; Sade Sati/Dhaiya phases handled in §4.3 |
| Rahu | 3, 6, 11 | rest | [VAR] modern tables add 10 → house 10 = weak-positive (+0.5) for nodes |
| Ketu | 3, 6, 11 | rest | same [VAR] as Rahu |

Sources: [LuckyGemFinder gochara table](https://luckygemfinder.com/gochara-predictions.html) (corroborated by [Indastro Moon page](https://www.indastro.com/transit-planets/transit-of-moon.html) and [Art of Vedic Astrology](https://www.theartofvedicastrology.com/?page_id=356) examples); variances flagged above. **House 8 from Moon sign = "Chandrashtama"** for the Moon — special-cased in tone rules (§6).

### 2.2 Vedha (obstruction) pairs — dampeners on favorable transits

` vedha(P, goodHouse) = obstructingHouse ` — a **planet other than the exempt pair** occupying the obstructing house cancels most of P's benefit:

| Planet | good ← obstructed by |
|---|---|
| Sun | 3←9, 6←12, 10←4, 11←5 |
| Moon | 1←5, 3←9, 6←12, 7←2, 10←4, 11←8 |
| Mars | 3←12, 6←9, 11←5 |
| Mercury | 2←5, 4←3, 6←9, 8←1, 10←8, 11←12 |
| Jupiter | 2←12, 5←4, 7←3, 9←10, 11←8 |
| Venus | 1←8, 2←7, 3←1, 4←10, 5←9, 8←5, 9←11, 11←6, 12←3 |
| Saturn | 3←12, 6←9, 11←5 |
| Rahu/Ketu | none (nodes neither cause nor receive vedha) |

Exemptions (both from the vedha source + Art of Vedic Astrology): **Sun and Saturn never obstruct each other; Moon and Mercury never obstruct each other**; the Moon itself never acts as an obstructing body for daily texts (it moves too fast to be treated as a standing obstruction) **[ED]**.
Source: [Ashtakvarga Jyoti vedha table](https://ashtakvargajyoti.wordpress.com/) (UNVERIFIED-3 — treat as dampener, not eraser).

---

## 3. Per-planet daily favorability value

For planet **p** and sign **s** on date D:

```
h  = house(p, s)
b(p) = +1            if h ∈ favorable(p) AND no vedha applies
     = +0.2          if h ∈ favorable(p) AND vedha applies      (dampened, not erased)
     = +0.5          if p ∈ {Rahu,Ketu} AND h = 10              (weak-positive [VAR])
     = −1            if h ∈ unfavorable(p)
     =  0            otherwise (neutral)
```

Retrograde modifier: if `p.retrograde` and `b(p) > 0` → `b(p) ×= 0.6` and the text condition gains flag `retro:review` (tone = "plans may need a second pass"; never alarmist). If retrograde and `b(p) < 0` → unchanged (no fear amplification). **[ED]**
Sade Sati / Dhaiya modifier: see §4.3.

---

## 4. Category scoring (all periods)

### 4.1 Categories and planet weights

Planet significations (karakatvas) drive the weights; they sum to 1.0 per category.

| Category | Weight map (planet → weight) |
|---|---|
| **Health & Wellbeing** | Moon .30, Sun .20, Saturn .20, Mars .15, Rahu .10, Ketu .05 |
| **Education & Learning** | Mercury .40, Jupiter .35, Venus .15, Moon .10 |
| Career & Job *(yearly; optional daily chip)* | Sun .25, Saturn .25, Mars .20, Mercury .15, Jupiter .15 |
| Business & Trade *(yearly)* | Mercury .35, Saturn .20, Venus .20, Jupiter .15, Mars .10 |
| Wealth & Finance *(yearly; optional daily chip)* | Jupiter .30, Venus .25, Moon .15, Mercury .15, Saturn .15 |
| Love & Romance *(yearly)* | Venus .40, Moon .30, Mars .15, Jupiter .15 |
| Marriage & Partner *(yearly)* | Venus .35, Jupiter .30, Moon .20, Saturn .15 |
| Family & Home *(yearly)* | Moon .35, Jupiter .25, Sun .10, Venus .15, Saturn .15 |
| Children *(yearly)* | Jupiter .40, Moon .25, Venus .15, Sun .10, Saturn .10 |

### 4.2 Score → rating

```
score(cat, s, D) = Σ w(p,cat) × b(p)          ∈ [−1, +1]  (weights sum to 1)
```

Rating bands (tuned at build time; these are the starting values):

| Rating | score | Label (EN) | Label (HI) | Icon (no-colour fallback) |
|---|---|---|---|---|
| Excellent | ≥ +0.35 | Excellent | उत्तम | ▲▲ |
| Good | +0.10 … +0.35 | Good | अच्छा | ▲ |
| Moderate | −0.10 … +0.10 | Moderate | मध्यम | ◆ |
| Challenging | < −0.10 | Challenging | चुनौतीपूर्ण | ▼ |

Ratings are always rendered with **text + icon + colour** (a11y: never colour alone).

### 4.3 Sade Sati & Dhaiya modifiers [grounded in methodology §6]

Saturn's house from the sign triggers a **capped, non-fearful** modifier on Health, Family, Career:

| Saturn house | Phase | Modifier | Tone rule |
|---|---|---|---|
| 12th | Sade Sati phase 1 | −0.20 | "extra effort, new routines help" |
| 1st | Sade Sati phase 2 (peak) | −0.25 | "patience and steady habits" |
| 2nd | Sade Sati phase 3 | −0.20 | "consolidate, avoid new debts" |
| 4th | Ardhastama / Dhaiya | −0.15 | "home & workplace balance needs attention" |
| 8th | Ashtama phase | −0.15 | "health routines and rest matter" |
| 3, 6, 11 | favorable | +1 (as base) | normal favorable text |

Never cumulative with retrograde amplification; never phrased as doom. The yearly page states the phase name and years when relevant — factual, calendar-derived.

### 4.4 Special boosts

- Jupiter transiting house 1 (on the rashi itself): +0.10 to every category **[ED, grounded in "Jupiter over natal Moon is generally positive"]**.
- **Double-transit mention**: if Jupiter and Saturn both aspect-by-house the same area (their houses' 5/7/9 and 3/7/10 aspects, respectively, land on the same counted house), the monthly/yearly text gains one qualitative line ("steady progress supported on two fronts"). No numeric effect **[ED — we are chart-generic; kept qualitative]**.

### 4.5 Period aggregation

- **Daily** (incl. yesterday/tomorrow variants): score on date D.
- **Weekly**: day-weighted mean of daily scores Mon→Sun (IST); explicit flags for fast-planet sign changes or stations inside the window.
- **Monthly**: day-weighted mean of daily scores across the calendar month (split-weighted at ingresses: a planet's b(p) applies day-by-day, which handles mid-month sign changes exactly).
- **Yearly** (area-by-area sections): score on the 15th of each month, day-weighted over the year → gives the area narrative; **month-by-month table** uses each month's own aggregate (same as monthly) so the table is consistent with the monthly pages.

---

## 5. Lucky Colour / Number / Direction [ED, grounded in methodology §7]

**Planetary attribute tables (constant):**

| Planet | Colours | Number | Direction | Deity (primary) | Beej mantra (HI transliteration + EN) |
|---|---|---|---|---|---|
| Sun | saffron, gold, orange | 1 | East | Surya (Shiva as alternative) | ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः / Om Hraam Hreem Hraum Sah Suryaya Namah |
| Moon | white, silver | 2 | North-West | Parvati | ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः / Om Shraam Shreem Shraum Sah Chandraya Namah |
| Mars | red, crimson | 9 | South | Hanuman (Kartikeya alt.) | ॐ क्रां क्रीं क्रौं सः भौमाय नमः / Om Kraam Kreem Kraum Sah Bhaumaya Namah |
| Mercury | green | 5 | North | Vishnu (Ganesha alt.) | ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः / Om Braam Breem Braum Sah Budhaya Namah |
| Jupiter | yellow, gold | 3 | North-East | Brihaspati (Vamana alt.) | ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः / Om Graam Greem Graum Sah Gurave Namah |
| Venus | white, cream | 6 | South-East | Lakshmi | ॐ द्रां द्रीं द्रौं सः शुक्राय नमः / Om Draam Dreem Draum Sah Shukraya Namah |
| Saturn | blue, black, grey | 8 | West | Shani (Hanuman as protector) | ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः / Om Praam Preem Praum Sah Shanaischaraya Namah |
| Rahu | smoky, multi-shade | 4 | South-West | Durga (Bhairava alt.) | ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः / Om Bhraam Breem Bhraum Sah Rahave Namah |
| Ketu | grey, brown | 7 | *none assigned* | Ganesha (Bhairava alt.) | ॐ स्रां स्रीं स्रौं सः केतवे नमः / Om Sraam Sreem Sraum Sah Ketave Namah |

Colour/number/direction basis: Kripalu weekday guide, DivyaIndia, Swarnsiddhi/TOI numerology, graha-dik tables (UNVERIFIED-4 — Ketu excluded from direction assignment; falls through). Deities [VAR — traditions differ per source; our mapping is published as our editorial convention, on-page note: "devi-devta associations vary by tradition; we follow this consistent mapping"].

**Assignment rules (deterministic precedence):**

```
attribPlanet(D, s) =
  1. today's highest-scoring planet for that sign  (argmax b(p) over the 9 grahas,
     vedha-adjusted, retro-benefics demoted one rank)
  2. else the weekday planet (Sun=Sun…Sat=Saturn)
  3. else the sign lord

luckyColour(D, s)   = attribPlanet.colours[0]  → swatch + text label (EN + HI)
luckyNumber(D, s)   = attribPlanet.number      (single number v1; optional second
                      "friendly number" later per the friendship chart [ED])
luckyDirection(D,s) = attribPlanet.direction   (Ketu can never win slot 1 —
                      argmax excludes Ketu for direction; if Ketu is attribPlanet
                      for colour/number, direction falls to rule 2)
mantra(D, s)        = attribPlanet.beejMantra  (same planet — mantra never mixes
                      planets with deity)
deity(D, s)         = attribPlanet.deity
thought(D, s)       = library aphorism keyed by dominantHouseTheme(D, s)
                      (see §7.4) — no astrology claims inside the thought text
```

Weekly/Monthly/Yearly attributions use the same precedence with `attribPlanet` computed from that period's aggregate score (weekly: mean; monthly/yearly: day-weighted mean over the period). Fixed per-sign fallbacks (for empty/neutral edge states) = the sign lord's attributes — table in §9.

---

## 6. Do's & Don'ts [ED taxonomy grounded in classical house themes]

House→theme map (the conditions Paige writes variants for):

| House | Theme tag | Do (theme) | Don't (theme) |
|---|---|---|---|
| 1 | self / fresh start | begin small personal projects, self-care | overcommitting publicly |
| 2 | money / speech | gentle speech, sensible budgeting | harsh words, impulse purchases |
| 3 | courage / initiative / siblings | start that pending task, call siblings | scattering energy across too many things |
| 4 | home / comfort | tidy the home, family time | rushing property decisions |
| 5 | children / creativity | creative hobbies, mentoring | speculation and rushed gambles |
| 6 | service / routine / health | exercise, steady routine, helping others | confrontations and arguments |
| 7 | partnership | listening, collaboration | forcing agreements |
| 8 | change / research | backing up work, careful research | ignoring small health niggles |
| 9 | learning / travel / elders | study, plan trips, seek elders' advice | dismissing good counsel |
| 10 | work / public action | pitch ideas, take the lead | public disputes |
| 11 | gains / networks | networking, following up on offers | impulsive lending |
| 12 | rest / expense | rest, charity, reviewing finances | taking on big new commitments |

**Selection rule**: Do item ← the house of the day's best positive transit (highest b(p)>0); Don't item ← the house of the day's worst negative transit (lowest b(p)<0). If no negative exists, the Don't slot uses the Chandrashtama/neutral caution theme of the day (weekday-generic). Weekly/Monthly/Yearly use the period's aggregate best/worst houses. Paige writes ≥4 distinct EN + ≥4 HI variants per cell of this table → 12×2×4 = 96 phrases minimum per language for daily alone (see §7.1).

**Tone caps (site policy, binding on the library):** never diagnose; never prescribe medical/legal/financial action; never absolutes ("will", "guaranteed"); Sade Sati/Chandrashtama phrased as "extra care / steady habits", never doom.

---

## 7. Text-selection conditions (what Paige's library must cover)

The rule set emits a **condition key** per slot; the content library supplies ≥N original variants per (slot, condition, lang). Selection = deterministic hash of `(dateKey, sign, lang, slot)` → variant index, with a no-repeat guarantee: the same variant may not repeat for the same sign+slot within the last 3 consecutive days (validated at publish time; see automation req #5).

### 7.1 Daily/Weekly/Monthly condition keys
- `health: {rating ∈ 4 bands} × {moonHouseBucket ∈ {fav, neutral, unfav, chandrashtama}} × {retro ∈ {none, review}}`
- `education: {rating} × {mercOrJupHouseBucket}` (bucket = favorable/neutral/unfavorable of the category's top planet)
- `dos: houseDo ∈ 12`, `donts: houseDont ∈ 12`
- `thought: theme ∈ 12` (house theme)
- lucky triad: pure data (colour/number/direction/mantra/deity) — no free text except a one-line "why" tag: `why ∈ {planet-of-the-day, weekday, sign-lord}` **[ED: shows the traditional basis, on-page]**

### 7.2 Yearly area sections
Per area: `{area ∈ 9} × {rating ∈ 4} × {driver ∈ {jupiter-good, saturn-phase, rahu-axis, mixed, steady}}` — driver derived from which slow-planet factor dominated that area's score.

### 7.3 Month-by-month table row
`{rating ∈ 4}` + one-line reason template: **auto-composed from data**, not free text: `"Jupiter in your {h1} supports {area}; Saturn in your {h2} asks for patience on {area2}"` — generated from the month's top positive and top negative slow-planet houses, with Paige-approved clause fragments per (planet, house-band). This keeps 144 rows/sign-year original yet honest.

### 7.4 Best & Testing Days (monthly)
Pure data: the month's highest and lowest mean daily score days for the sign, each with its driver planets. No library text needed beyond a header template.

### 7.5 Sky & Panchang (monthly)
Pure data from existing engine + festivals DB: Sun ingress date, Mercury/Venus/Mars ingresses in month, new/full moon dates + nakshatra, retrograde stations, festivals/vrats falling in the month. Zero fabricated text; template headers only.

---

## 8. Period-specific derivation summary

| Period | Primary drivers | Aggregation |
|---|---|---|
| Yesterday/Today/Tomorrow | Moon house + weekday + all-planet snapshot | single date D (shifted) |
| Weekly | Moon's swept houses Mon–Sun + fast-planet changes/stations | day-weighted mean |
| Monthly | Sun ingress anchor + Mars/Mercury/Venus arcs + lunations + retro stations | day-weighted mean; best/testing days; sky block |
| Yearly | Jupiter, Saturn (Sade Sati phase), Rahu–Ketu axis | 12 monthly aggregates → area narratives + month table |

---

## 9. Sign constants (all 12 — lord, base attributes, fallback deity/mantra)

| # | Sign (slug) | HI | Lord | Base colour(s) | Base number | Base direction | Deity | Mantra (planet) |
|---|---|---|---|---|---|---|---|---|
| 1 | aries | मेष | Mars | red | 9 | South | Hanuman | Mars |
| 2 | taurus | वृषभ | Venus | white, cream | 6 | South-East | Lakshmi | Venus |
| 3 | gemini | मिथुन | Mercury | green | 5 | North | Vishnu | Mercury |
| 4 | cancer | कर्क | Moon | white, silver | 2 | North-West | Parvati | Moon |
| 5 | leo | सिंह | Sun | saffron, gold | 1 | East | Surya | Sun |
| 6 | virgo | कन्या | Mercury | green | 5 | North | Vishnu | Mercury |
| 7 | libra | तुला | Venus | white | 6 | South-East | Lakshmi | Venus |
| 8 | scorpio | वृश्चिक | Mars | red, maroon | 9 | South | Hanuman | Mars |
| 9 | sagittarius | धनु | Jupiter | yellow | 3 | North-East | Brihaspati | Jupiter |
| 10 | capricorn | मकर | Saturn | blue, black | 8 | West | Shani | Saturn |
| 11 | aquarius | कुम्भ | Saturn | blue | 8 | West | Shani | Saturn |
| 12 | pisces | मीन | Jupiter | yellow | 3 | North-East | Brihaspati | Jupiter |

(Base = sign lord's attributes; the daily slots rotate per §5 but the fallback is always these. Slugs match the existing frontend `SIGNS` array — reuse confirmed in `04`.)

---

## 10. Validation rules (feeds automation req #5)

Every generated horoscope row must pass before publish:
1. All 12 signs present for the period+lang; every required section non-empty.
2. No placeholder tokens (`TODO`, `lorem`, `…`, `xx`) in any section.
3. Lucky colour ∈ palette table; number ∈ 1–9; direction ∈ 8 valid; mantra/deity pair = same planet.
4. Rating labels ∈ the 4-band scale; yearly table has exactly 12 month rows per sign.
5. **Variety check**: for the same sign+slot, no identical sentence repeated across the last 3 consecutive dated rows (hash compare of section text).
6. Date integrity: `date_key` = IST date; weekly row covers the coming Mon–Sun; monthly row covers the coming calendar month; yearly row covers the coming calendar year (leap years included — engine derives real dates).
7. Both `lang=en` and `lang=hi` rows generated (hi from the hi library, not machine-translated at run time).

---

## 11. Open editorial decisions for the owner (answer at approval, or I proceed with defaults)

1. **Daily Career & Money line?** Default: **add a compact Career + Money two-line summary** to daily/weekly/monthly (all 3 reference sites have it; engine scores already exist). Remove nothing from the brief's core list.
2. **Friendly-number as a second lucky number?** Default: **single number** in v1.
3. **On-page disclosure wording** for [VAR]/[ED] conventions (deity mapping, Moon-7, vedha dampening) — Default: one "How we compute this" details-block per page, plain language.
4. **Ratings on daily page?** Default: ratings chips shown only on Monthly Best/Testing days + the yearly month table; daily shows text sections without numeric-looking scores (keeps it warm, avoids false precision).
5. Sade Sati **year-range display** on yearly pages — Default: show phase name + year range only when Saturn is in 12/1/2/4/8, phrased as effort/patience.

---

*Formal implementation mapping (which backend files/tables change) is deliberately NOT in this file — that belongs to the dev step. Code-reuse findings: `04-existing-code-review.md`.*
