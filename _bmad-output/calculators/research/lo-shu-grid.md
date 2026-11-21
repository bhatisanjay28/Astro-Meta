# Lo Shu Grid — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
The Lo Shu Grid (also Lo-Shu/Loshu chart) is a 3×3 "magic square" of Chinese origin (every row, column and diagonal sums to 15) that Indian numerology adopted as a birth-date personality chart: each digit of the DDMMYYYY date is placed into its fixed cell, and the pattern of present / missing / repeated digits is read as strengths, gaps ("karmic lessons") and remedies. It is one of the most popular calculators on Indian astrology portals right now (AstroTalk ships a dedicated tool; dozens of standalone sites exist), used by the same audience as the main numerology page, often to decide remedies (colours, gemstones, behaviours) for "missing" numbers. Because the layout is visual, it is also the most shareable/screenshot-able output — competitors use it as a lead magnet.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Date of birth | required | date DD/MM/YYYY (digits are extracted in DDMMYYYY order) | day 1–31, month 1–12, year ~1900–today (AstroTalk offers 1927–2026 in dropdowns) | none | The ONLY input: its digits populate the grid. |
| Name | optional (some sites) | text | — | blank | NOT part of the Lo Shu formula; a few sites add a name-number panel beside the grid. Not recommended for v1 — keeps the tool single-purpose. |
| Gender | optional | enum | — | unset | Not used in the formula. Skip. |

### Recommended input set
DOB only (single mandatory field), with day/month/year dropdowns like AstroTalk (year range ≥ 1900–current year). Everything else is output, not input.

### Current Vyotish input set
`GET /api/v1/calculators/lo-shu?date` — date only. Matches the recommended minimum; needs stronger date validation (see §6).

## 3. Formula(s) / method
### 3.1 Classical grid map (verified)
```
4  9  2
3  5  7
8  1  6
```
Rows: 4-9-2 (top), 3-5-7 (middle), 8-1-6 (bottom). Columns: 4-3-8 (left), 9-5-1 (middle), 2-7-6 (right). Diagonals: 4-5-6, 2-5-8. Every line sums to 15 (occultscience.in; consistent across all sources).

### 3.2 Placement algorithm
1. Write DOB as DDMMYYYY; split into individual digits.
2. Drop every `0` (see 3.4).
3. For each remaining digit d, append d to cell[d] and increment count[d]. A digit appearing k times appears k times in its cell ("if a number shows up more than once in your birth date, you've got a natural gift there" — astrotalk.com).
4. Cells with count 0 are MISSING numbers; cells with count ≥ 2 are REPEATED numbers.

### 3.3 Planes / arrows (all 8 verified lines with names — occultscience.in)
An arrow (plane) is COMPLETE (arrow of strength) when all three of its numbers are present; it is BROKEN (arrow of weakness) when any member is missing.

| # | Plane name | Numbers | Direction | Complete (strength) meaning | Broken (weakness) meaning |
|---|---|---|---|---|---|
| 1 | Mental Plane | 4-9-2 | top row | logic, planning, memory, clear thinking | weak memory, poor planning, loss of focus |
| 2 | Emotional Plane | 3-5-7 | middle row | emotional control, kindness, calm, loyalty | uncontrolled emotions, self-doubt |
| 3 | Practical Plane | 8-1-6 | bottom row | groundedness, money management | dreamy impracticality, overspending |
| 4 | Thought Plane | 4-3-8 | left column | sharp fast mind, creativity | confusion, indecision, distraction |
| 5 | Will Plane | 9-5-1 | middle column | inner strength, perseverance, leadership | self-doubt, no leadership |
| 6 | Action Plane | 2-7-6 | right column | execution, drive | hesitation, overthinking |
| 7 | Silver Yog (Rajat Yog) | 2-5-8 | diagonal (top-right→bottom-left) | luck, strong money flow | financial struggles, unfinished efforts |
| 8 | Golden Yog (Raj Yog) | 4-5-6 | diagonal (top-left→bottom-right) | stability + adaptability; claimed present in only 2–3% of people | lack of stability, avoiding responsibility |

Classical naming cross-check: the Western "Arrow of Determination / Golden Arrow 1-5-9" is the SAME line as the Lo Shu middle column 9-5-1 (5 centre; 1 bottom-centre; 9 top-centre) — so "1-5-9" and "9-5-1" are one arrow, not two. The "Arrow of Spirituality 3-5-7" = Lo Shu middle row. WARNING for QA: AstroTalk's FAQ loosely cites "1-5-9" (fine) and "2-6-8" (NOT a straight line in the Lo Shu layout — 2 top-right, 6 bottom-right, 8 bottom-left are not collinear; treat 2-6-8 as a marketing phrase, not an arrow — UNVERIFIED as a classical arrow). Only the 8 lines in the table above are valid arrows.

### 3.4 Zero handling — the two schools
- **School A (dominant, classical):** drop zeros entirely. "0 has no cell in the grid" — every construction guide and calculator instructs ignoring zeros (losbugrid sources, astrotalk implicitly).
- **School B (minority, modern Indian content):** count a 0 as a 5 (since 0 is "seen as" the emptiness that 5/centre governs). No classical source found supports this — mark UNVERIFIED.
- **RECOMMENDATION:** School A (drop). Vyotish already drops zeros — keep it. Consequence to preserve: dropping 0s often CAUSES a missing 5, which is the correct classical reading (empty centre = emotional-imbalance lesson), not a bug.

### 3.5 Missing vs repeated meaning (per number)
| Number | Cell/element/direction | Present meaning | Missing = growth area |
|---|---|---|---|
| 1 | North, Water | independence, leadership, confidence, initiative | difficulty asserting oneself, low self-confidence |
| 2 | SW, Earth | sensitivity, cooperation, intuition, diplomacy | empathy/diplomacy challenges |
| 3 | East, Wood | creativity, imagination, communication | trouble expressing ideas |
| 4 | SE, Wood | discipline, organization, systematic planning | disorganization, poor routines |
| 5 | Centre, Earth (most important cell) | balance, adaptability, emotional stability | emotional imbalance, restlessness |
| 6 | NW, Metal | responsibility, family duty, home, luxury | commitment/domestic struggles |
| 7 | West, Metal | spirituality, introspection, wisdom | avoids introspection, faith struggles |
| 8 | NE, Earth | wisdom, business acumen, money flow | financial/decision struggles |
| 9 | South, Fire | recognition, fame, energy | low recognition/drive |

Repeated digits strengthen the trait (1×1 vs 1×2 vs 1111: AstroTalk FAQ — 1111 = "very strong independence with possible excessive self-focus"). Missing numbers are lessons to develop through habits, not fixed flaws.

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal: DOB 14-03-1992
Digits: 1,4,0,3,1,9,9,2 → drop 0 → multiset {1,1,2,3,4,9,9}.
Grid (counts in the 4-9-2 / 3-5-7 / 8-1-6 layout):
```
4:[4]        9:[9,9]      2:[2]
3:[3]        5:[  ] MISSING   7:[  ] MISSING
8:[  ] MISSING   1:[1,1]  6:[  ] MISSING
```
- counts: {1:2, 2:1, 3:1, 4:1, 5:0, 6:0, 7:0, 8:0, 9:2}
- missing = [5,6,7,8]; repeated = [1(×2), 9(×2)]
- Arrows complete: ONLY Mental Plane 4-9-2 (strength: planning/memory). Broken: all other 7 (incl. both diagonals — no Golden/Silver Yog; Will Plane 9-5-1 broken because 5 absent despite 9,1 present).
- Companion numbers: mulank = 1+4 = 5; bhagyank = 29 → 2.

### Example 2 — edge: heavy-zero date DOB 20-10-2020
Digits: 2,0,1,0,2,0,2,0 → drop 0 → multiset {1,2,2,2}.
```
4:[ ]M  9:[ ]M  2:[2,2,2]
3:[ ]M  5:[ ]M  7:[ ]M
8:[ ]M  1:[1]   6:[ ]M
```
- counts: {1:1, 2:3, others 0}; missing = [3,4,5,6,7,8,9] (7 missing); repeated = [2(×3)].
- No arrows complete (all 8 broken). Interpretation stress: triple-2 (very strong cooperation/sensitivity) + empty centre.
- Edge rule this exercises: zeros never enter cells; counts of 0 are "missing", not "zero present".

### Example 3 — boundary: leap day DOB 29-02-1988
Digits: 2,9,0,2,1,9,8,8 → drop 0 → multiset {1,2,2,8,8,9,9}.
```
4:[ ]M   9:[9,9]  2:[2,2]
3:[ ]M   5:[ ]M   7:[ ]M
8:[8,8]  1:[1]    6:[ ]M
```
- counts: {1:1, 2:2, 3:0, 4:0, 5:0, 6:0, 7:0, 8:2, 9:2}; missing = [3,4,5,6,7]; repeated = [2,8,9 each ×2].
- No complete arrows. Boundary exercised: leap-day validity + triple repetition (2,8,9).

### Example 4 — boundary (oracle fact): a COMPLETE grid is impossible
DDMMYYYY has exactly 8 digit slots; the 1900s/2000s century digits and the month's leading 0 force the max count of DISTINCT digits 1–9 to 7 (e.g. DOB 24-08-1967: digits 2,4,0,8,1,9,6,7 → distinct non-zero = {1,2,4,6,7,8,9}, missing [3,5], repeated none). Therefore "missing = []" must be IMPOSSIBLE for any valid 1900–2099 DOB — a perfect automated test oracle (at least 2 numbers are always missing; if the code ever returns an empty missing list, it is buggy).

## 5. Complete output list
A GOOD Lo Shu calculator shows:
1. The rendered 3×3 GRID with the classical cell order 4-9-2/3-5-7/8-1-6, each cell showing its digit(s) (repeats listed) or empty-marker (AstroTalk renders a real 3×3; this is the shareable artifact).
2. Missing-number list with per-number growth-area text (table §3.5).
3. Repeated-number list with "gift but watch excess" text (e.g. 1111 note).
4. All 8 planes/arrows with complete/broken status and both meanings (§3.3), incl. Golden Yog (4-5-6) and Silver Yog (2-5-8) callouts.
5. Per-number meaning text for 1–9 (present meaning).
6. Companion numbers: Mulank and Bhagyank of the same DOB (competitors show them alongside).
7. Remedies per missing number (AstroTalk style): weekday colour (e.g. red on Sunday for missing 1, green Thursday for missing 4), gemstone (red coral, moonstone, citrine, emerald, turquoise, rose quartz, amethyst, blue sapphire, ruby), meditation/behavioural practice — with "consult an astrologer" framing.
8. Balance summary ("good grid = balanced; 1-5-9 with 2-5-8 both present is rare/auspicious").
9. Disclaimer (tendencies, not destiny; entertainment/self-reflection).
10. Cross-links to mobile-number and name numerology tools (funnel).

Competitor comparison:
| output | AstroTalk (web) | AstroSage | standalone Lo Shu sites | Vyotish today |
|---|---|---|---|---|
| Input | DOB dropdowns (1927–2026) | general numerology tools, no dedicated Lo Shu surfaced | DOB | `?date` |
| 3×3 visual grid | yes | — | yes | API only; UI shows FLAT ROWS (not 3×3) |
| missing list | yes | — | yes | yes |
| repeated list | yes | — | yes | yes |
| arrows/planes (8) | FAQ only, loosely (incl. non-classical "2-6-8") | — | yes (occultscience style) | NO |
| per-number meanings | yes | — | yes | NO |
| remedies | yes (colours/gemstones) | — | yes | NO |
| mulank/bhagyank alongside | implied | yes (other tools) | some | NO (separate tool) |
| disclaimer | tendencies note | — | varies | NO |

### Current Vyotish outputs
Page `/calculators/lo-shu`; `GET /api/v1/calculators/lo-shu?date` → `grid` = 9 × `{number, digits[], count}` in order [4,9,2,3,5,7,8,1,6] (cell order matches classical map — good), `missing`, `repeated`. Zeros dropped (matches School A). No meanings, no arrows/planes, no remedies, no disclaimers; UI renders the 9 cells as flat rows instead of the 3×3 square.

### Initial gap list
1. UI shows a flat row list — the 3×3 visual grid is the core UX of this calculator (highest-priority gap).
2. No arrows/planes analysis (8 lines, complete/broken + meanings) — standard on standalone sites.
3. No per-number meaning text for present/missing/repeated.
4. No remedies block (competitors monetise through this).
5. No Golden/Silver Yog special callout.
6. No mulank/bhagyank shown alongside.
7. No disclaimers.
8. API shape fine (`digits[]`, `count`) but add `arrows: [{numbers, complete, name}]` and `planes` for future UI.

## 6. Edge cases and validation rules
- Zeros dropped everywhere (never placed, never counted as present); dropping 0 may make 5 missing — correct, do not "fix".
- Month/day leading zeros (05-12-2000) → the two 0s dropped; only 5,1,2,2 placed. DOB 05-12-2000 → digits {5,1,2}: missing = [3,4,6,7,8,9].
- Day/month validity (no 30 Feb, no month 13); leap-year check for 29-02; no future dates.
- Repeats allowed up to realistic bounds: with 8 digits max count per number is 8 (e.g. DOB 02-02-2002 → digits 0,2,0,2,2,0,0,2 → 2×4, everything else missing). Test oracle: count sum over cells = number of non-zero digits = 8 − (number of zeros).
- Max distinct digits = 7 for 1900–2099 DOBs (see Example 4) → missing list NEVER empty; repeated list CAN be empty (Example 4 has none).
- Year range: recommend ≥1900; AstroTalk uses 1927–2026.
- Case: DOB 11-11-2011 → digits 1,1,1,1,1,1,1,1 → cell 1 count 8; missing [2,3,4,5,6,7,8,9]; all arrows broken. Extreme-but-valid test case.
- Output must keep cell order 4,9,2,3,5,7,8,1,6 (already correct in Vyotish) so the UI can render top-left→bottom-right.

## 7. Sources
- Grid map, planes, complete/broken arrow meanings (all 8 lines + names): https://www.occultscience.in/arrows-in-numerology
- AstroTalk Lo Shu calculator inputs/outputs/meanings/remedies/FAQ: https://astrotalk.com/lo-shu-grid-calculator ; hub https://astrotalk.com/calculators
- Zero-drop rule (dominant school; no classical support found for "0=5"): search synthesis of construction guides incl. loshugridcalculators.com — https://loshugridcalculators.com
- Per-number meanings & missing-number readings: https://loshugridcalculators.com (and AstroTalk page above)
- General overview/magic-square property (rows/cols/diagonals sum 15): occultscience.in page above + AstroTalk page above
- Non-classical "2-6-8" phrase flagged UNVERIFIED: observed only in AstroTalk FAQ wording (no classical source) — do not implement as an arrow.
