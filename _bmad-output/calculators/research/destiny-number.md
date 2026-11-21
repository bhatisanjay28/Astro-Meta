# Destiny Number (Bhagyank) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
The Destiny Number (Bhagyank, called Life Path Number in Western numerology) is computed from the FULL date of birth and is presented as the single most important personal number: it describes life purpose, the direction the life takes, career fit, and the pattern of opportunities/challenges (grahai.com; numerologist.com calls it "the single most important number in a chart"). Users: everyone running their own chart (it is the second number every Indian astrology user learns, after Mulank), parents checking a newborn's chart, and users deciding on name changes (the name number is tuned to harmonise with Bhagyank). For Vyotish it is a standalone funnel tool that should hand off to the umbrella numerology page, Lo Shu grid, and mobile/vehicle tools.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Date of birth | required | date, DD/MM/YYYY | day 1–31, month 1–12, year ~1900–today (Prokerala dropdowns 1901–2028; numerologist.com 1920–2025) | none | Sole formula input: every digit of DDMMYYYY is summed. |
| Name | optional | Latin text | — | blank | NOT used in the Bhagyank formula. Numerologist.com uses it to upsell the other 4 core numbers; recommend showing it only on the umbrella tool, keep destiny tool DOB-only. |
| Gender | optional | enum | — | unset | Not used in formula; competitor forms include it for interpretation copy. Optional nice-to-have. |

### Recommended input set
DOB only (three dropdowns day/month/year like Prokerala and numerologist.com give the best UX and prevent format errors). Keep the tool single-purpose; cross-sell the name-number tool separately.

### Current Vyotish input set
`GET /api/v1/calculators/destiny-number?date` — date only. Matches the recommended minimum.

## 3. Formula(s) / method
### 3.1 Primary method (Indian standard — all-digit sum)
`bhagyank_sum = Σ every digit of DDMMYYYY` (written day-month-year)
`bhagyank = digital_root(bhagyank_sum)` — i.e. repeatedly sum digits of the total until 1 digit remains.
- Worked reference (Prokerala): 15-08-1985 → 1+5+0+8+1+9+8+5 = 37 → 3+7 = 10 → 1+0 = **1**.
- Range of bhagyank: 1–9 (Vedic school), or {1–9, 11, 22, 33} (Western school).
- Equivalent shortcut (same final root): digital_root(digital_root(day) + digital_root(month) + digital_root(year)); use only as internal optimisation — the UI must display the full digit chain.

### 3.2 Variant — Western separate reduction (numerologist.com)
Reduce month, day, and year to single digits (or Master Numbers) INDEPENDENTLY, then sum the three results and reduce unless the result is 11/22/33.
- Example (from numerologist.com): 12-03-1940 → 3 (month) + 3 (day 12→3) + 5 (year 1940→14→5) = **11, kept as Master**.
- All-digit method on the same date: 1+2+0+3+1+9+4+0 = 20 → **2**. The two schools genuinely DISAGREE on master-number detection (numerologist.com argues the shortcut "can create false Master Numbers or lose real ones entirely"; it also preserves Western "Karmic Debt numbers" 13/14/16/19).
- **RECOMMENDATION for Vyotish:** use the Indian all-digit sum (3.1) as the primary result — it is the standard for the Bhagyank framing and matches the audience. Detect `master` only when the FIRST-PASS total (bhagyank_sum) is exactly 11, 22, or 33 and surface a short "higher octave" note reading it through its root (2/4/6) per the Cheiro/Indian school. Do NOT implement karmic-debt numbers (Western concept, not used in Vedic practice).

### 3.3 Master numbers {11, 22, 33} — the two schools
- **Western (keep):** 11, 22, 33 are not reduced; interpreted as intensified 2, 4, 6 (worldnumerology.com; Prokerala explicitly: "Do NOT reduce Master Numbers, such as 11, 22, and 33"; numerologist.com keeps component-level 11s too).
- **Indian/Cheiro (reduce):** all numbers resolve to 1–9 because each is ruled by one of the nine grahas; 11→2, 22→4, 33→6, read as "higher octave" of the root.
- Recommended hybrid is stated in 3.2: primary output = Vedic root; `master: true` flag + note when the first-pass total is 11/22/33.

### 3.4 Lords and companion Mulank
Lords 1–9 (Vedic standard, verified): 1 Sun, 2 Moon, 3 Jupiter, 4 Rahu, 5 Mercury, 6 Venus, 7 Ketu, 8 Saturn, 9 Mars.
`mulank = digital_root(day)` (see vedic-numerology.md §3.1) — shown alongside destiny as the "nature vs path" pair; friendship matrix for their compatibility as per vedic-numerology.md §3.5.

### 3.5 Bhagyank meanings 1–9 (interpretation anchors)
1 (Sun) leader/authority/achievement · 2 (Moon) diplomacy/partnership/sensitivity · 3 (Jupiter) knowledge/teaching/creativity · 4 (Rahu) unconventional path/technology/struggle-then-success · 5 (Mercury) business/communication/travel · 6 (Venus) luxury/arts/service · 7 (Ketu) spirituality/research/detachment · 8 (Saturn) karma/delayed success/discipline/long-game · 9 (Mars) courage/humanitarian service/completion (grahai.com; AstroSage articles; career-fit articles for 1 and 9).

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal: DOB 14-03-1992
- Digits: 1,4,0,3,1,9,9,2 → sum = 1+4+0+3+1+9+9+2 = 29
- 29 → 2+9 = 11 → 1+1 = **2**. Bhagyank = 2 (Moon). `destiny_sum = 29`; NOT a master flag (29 ≠ 11/22/33; the intermediate 11 inside the reduction chain must NOT trigger the master flag).
- Mulank = 1+4 = **5** (Mercury). Compatibility: 5 vs 2 → neutral (consensus matrix).

### Example 2 — edge (cross-source verification): DOB 15-08-1985
- 1+5+0+8+1+9+8+5 = 37 → 3+7 = 10 → 1+0 = **1** (Sun). Matches Prokerala's published example exactly — canonical regression test.
- Mulank = 1+5 = 6 (Venus). 6 vs 1 → enemy per consensus (Venus–Sun enmity) → caution note.

### Example 3 — boundary master: DOB 22-11-1960
- 2+2+1+1+1+9+6+0 = **22** → first-pass total IS a master number.
- Western school: keep **22** (Master Builder). Indian school: root = 2+2 = **4** (Rahu).
- Output contract: `destiny: 4, destiny_sum: 22, master: true` + master note text ("22 is a higher octave of 4: large-scale building potential").
- Mulank = 2+2 = 11 → mulank master case (see gap list; Vyotish currently flags master only on the destiny sum).

### Example 4 — boundary single-step: DOB 01-01-2001
- 0+1+0+1+2+0+0+1 = **4** — total is already single-digit; reduction loop must not run/display extra steps; `destiny_sum = 4, destiny = 4`.
- Mulank = 0+1 = **1**. 1 vs 4 neutral. Also exercises leading zeros (must contribute nothing).

## 5. Complete output list
A GOOD destiny-number calculator shows:
1. `destiny` (root 1–9) AND `destiny_sum` (compound, e.g. 29) with the visible reduction chain (29 → 11 → 2).
2. `master` flag (true when first-pass sum ∈ {11,22,33}) + master note (both schools' reading).
3. Ruling lord (`destiny_lord`) with lord one-liner (e.g. 2 → Moon: mind, mother, public).
4. Full interpretation text per destiny number (personality, career fit, relationships, challenges — §3.5 anchors; competitors ship full pages per number).
5. Mulank alongside with its lord and nature-vs-path compatibility verdict (friendly/neutral/enemy per matrix).
6. Friendly/neutral/enemy numbers for the destiny root.
7. Master-number cross-links (11/2, 22/4, 33/6 pages — numerologist.com pattern).
8. Lucky numbers/days/colours per lord + remedies block (traditional, with consult disclaimer).
9. Disclaimer (entertainment/self-reflection — Prokerala standard).
10. Cross-sell: name-number harmonisation check (name vs destiny), Lo Shu grid link.

Competitor comparison:
| output | Prokerala | numerologist.com | AstroSage | Vyotish today |
|---|---|---|---|---|
| Input | DOB dropdowns 1901–2028 | DOB dropdowns 1920–2025 (+name for full chart) | DOB (+name) | `?date` |
| Method | all-digit sum | separate component reduction | digit reduction | all-digit sum |
| Master handling | keep 11/22/33 + meaning pages | keep component-level masters + karmic debt 13/14/16/19 | reduce; separate master pages | `master` flag on destiny sum (Vedic root shown) |
| Compound displayed | yes | yes | yes | `destiny_sum` yes |
| Reduction chain shown | yes | yes | — | NO |
| Meaning text | yes (per-number pages) | yes (12 path pages) | yes (articles) | NO |
| Mulank alongside | yes | via full chart | yes | yes (`mulank`, `mulank_lord`) |
| Compatibility verdict | no | chart-level | articles | NO |
| Remedies | no | upsell reading | yes | NO |
| Disclaimer | yes | privacy/results note | — | NO |

### Current Vyotish outputs
Page `/calculators/destiny-number`; `GET /api/v1/calculators/destiny-number?date` → `destiny, destiny_sum, master (sum∈{11,22,33}), mulank, destiny_lord, mulank_lord`. Lords correct (Sun…Mars). Best-shaped numerology API in the suite — but no meaning text, no reduction chain, no compatibility verdict, no master handling for mulank, no remedies, no disclaimers.

### Initial gap list
1. No interpretation/meaning text for the destiny number (all competitors ship it; highest-value gap).
2. `master` flag not implemented for Mulank (day 11/22/29→11 cases silently root-reduced with no flag).
3. Reduction chain not exposed (show "37 → 10 → 1") — QA and user trust both need it.
4. No mulank-vs-destiny compatibility verdict despite both numbers + lords already in the response.
5. No friendly/neutral/enemy numbers for the destiny root.
6. No remedies/lucky colours/days.
7. No disclaimers.
8. Decision needed: state in UI copy that masters are read through roots (Indian school) while flagging them, to avoid confusion when users cross-check Western sites.

## 6. Edge cases and validation rules
- Date validity: month 1–12, day 1–31 with per-month caps, leap-year check for 29-02 (29-02-1988 valid; 29-02-1989 invalid), no future DOB, year ≥ 1900 (Prokerala goes to 1901; upper bound = current year).
- Leading zeros contribute 0 to sums (01-01-2001 → 4, not inflated).
- Master detection ONLY on first-pass total (`destiny_sum`), never on intermediates inside the reduction chain (29→11→2 must NOT set master — Example 1 is the regression test).
- Reduction chain must terminate at 1–9; guard against 0 (impossible for valid DOB with a 1–31 day, but guard anyway for API robustness).
- Numerologist-style separate reduction (3.2) must NOT be mixed into the primary path — keep single code path; only mention in docs.
- `master` semantics: boolean + note string; `destiny` always the Vedic root (never 11/22/33 as numeric value) so downstream UI doesn't break ranges.
- Karmic debt numbers (13/14/16/19) out of scope — do not flag.

## 7. Sources
- Bhagyank method + master-keep rule + canonical example (15-08-1985→1) + meanings + disclaimer: https://www.prokerala.com/numerology/bhagyank-calculator.php
- Mulank/Bhagyank distinction and meanings: https://www.grahai.com/numerology
- Western separate-reduction method, master preservation, karmic debt 13/14/16/19, 12 path pages: https://numerologist.com/numerology/life-path-number
- Master numbers Western school: https://www.worldnumerology.com/numerology-master-numbers
- Lords 1–9 + Vedic root-reading of masters (Cheiro): https://www.worldnumerology.com/numerology-master-numbers + https://swarnsiddhi.com/blog/chaldean-numerology-table
- Friendship matrix (compatibility verdicts): https://astrologergeetanjalijindal.com/numerology + https://steer.coach/planet-friend-enemy-table
- AstroSage framing/examples: https://www.astrosage.com/numerology/
- Career-fit interpretation anchors (1, 9): search synthesis of Vedic bhagyank articles (grahai.com)
