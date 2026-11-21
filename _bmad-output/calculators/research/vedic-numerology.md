# Vedic Numerology (Mulank + Bhagyank + Name Number) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
The flagship "Vedic Numerology" calculator is the umbrella tool that computes the three core personal numbers of the Cheiro/Vedic tradition used across India:
- **Mulank (birth/root/psychic number)** — digital root of the birth DAY. Describes core nature, inner power, instinctive behaviour (grahai.com, anytimeastro.com).
- **Bhagyank (destiny/life-path number)** — digital root of ALL digits of the full DOB (DDMMYYYY). Describes life path, opportunities, what one is "here to do" (prokerala.com).
- **Name number (Chaldean)** — digit sum of the letters of the name (compound + root), used to judge whether the name "resonates" with the birth numbers.

Users: the mainstream Indian astrology-app audience (18–45), people choosing names for babies or businesses, people "correcting spellings" of their own names, and users deciding whether their name/date combination is lucky. It is typically the entry-point page from which users navigate to the specialised tools (Lo Shu grid, mobile number, vehicle number). Competitors (AstroSage, GaneshaSpeaks) treat this as a top-3 traffic calculator.

Scope note: "Vedic numerology" as practised on Indian sites is the Cheiro-derived Chaldean-flavoured system with the nine planetary lords (1 Sun … 9 Mars). It is NOT the same as Western Pythagorean numerology; differences are flagged below wherever they change an output.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Date of birth | required | date, DD/MM/YYYY (accept ISO YYYY-MM-DD internally) | 1900-01-01 … today; day 01–31, month 01–12, year 4-digit | none | Source of Mulank (day) and Bhagyank (all digits). The single mandatory input. |
| Full name | recommended (required for name number) | Latin-script text; spaces/hyphens allowed; digits & symbols rejected or stripped | 1–60 chars; letters A–Z + space + hyphen | blank | Chaldean name number (compound + root) and compatibility with Mulank/Bhagyank. |
| Gender | optional | enum male/female/other | — | unset | Not used in any formula; some interpretation text is gendered on competitor sites (GaneshaSpeaks forms include it). Nice-to-have, not blocking. |
| Time of birth | optional | HH:MM | — | unset | NOT used in numerology formulas (it is a jyotish input). Only displayed for upsell to kundli tools. Do NOT compute anything from it. |

How the name is treated (schools):
- **All words of the name summed together** (first + middle + last) — the standard: name number is the sum of every letter of the full name, words added then totalled (AstroSage example: full name total 46 → 10 → 1).
- **First name only vs full name**: some practitioners read "public image" from first name and "karmic destiny" from the full name. Recommend: compute compound for EACH word AND for the whole name; interpret from the whole name, display both.
- Middle/last names count equally; initials-only input ("S. Bhati") cannot be evaluated → prompt for the expanded name.

### Recommended input set
DOB (mandatory) + full name (strongly recommended, multi-word aware) + optional gender for display. This matches AstroSage/GaneshaSpeaks behaviour (name + DOB + gender dropdown) and enables the compatibility verdict (name vs birth numbers) that competitors show.

### Current Vyotish input set
`GET /api/v1/calculators/numerology?date&name` — date mandatory, name OPTIONAL. No gender. Non-Latin name characters are silently dropped (map to 0) instead of rejected. No DOB-vs-name compatibility because name is optional.

## 3. Formula(s) / method
### 3.1 Mulank (birth/root number)
`mulank = digital_root(day_of_month)`
- Take the birth DAY only (e.g. 14 → 1+4 = 5; 05 → 5). Range 1–9.
- Leading zero of the day (e.g. "05") contributes nothing.
- Source: grahai.com, anytimeastro.com, AstroSage ("born 5th November = number 5 ruled by Mercury").

### 3.2 Bhagyank (destiny number)
`bhagyank = digital_root(sum of every digit of DDMMYYYY)`
- Write the date as DDMMYYYY and add every digit: e.g. 14-03-1992 → 1+4+0+3+1+9+9+2 = 29 → 2+9 = 11 → 1+1 = 2.
- Equivalent shortcut (same result): digital_root(day_root + month_root + year_root) because digit sums are additive (e.g. day 14→5, month 3→3, year 1992→1+9+9+2=21→3; 5+3+3=11→2). Use the shortcut only as an internal optimisation; display the full digit string in the UI.
- Source: prokerala.com bhagyank calculator (worked example 15-08-1985 → 37 → 10 → 1).

### 3.3 Master numbers {11, 22, 33} — two schools
- **Western Pythagorean school (KEEP):** do NOT reduce 11, 22, 33; interpret them as intensified forms of 2, 4, 6 (worldnumerology.com). Prokerala's Bhagyank calculator explicitly implements this ("Do NOT reduce Master Numbers, such as 11, 22, and 33").
- **Indian Vedic/Cheiro school (REDUCE):** every compound reduces to a single digit 1–9 because each number is ruled by one of the nine grahas; 11 is read through its root 2, 22 through 4, 33 through 6 (Cheiro tradition, per worldnumerology.com's own note on the Indian reading, and swarnsiddhi.com which keeps no master numbers in the Chaldean table).
- **RECOMMENDATION for Vyotish:** compute the single-digit root always (Vedic core), but ALSO detect when the first-pass compound (day sum for Mulank, full-DOB sum for Bhagyank) is exactly 11/22/33 and flag `master_detected: true` with a short "higher octave" note. This satisfies both audiences and matches what AstroSage does (they reduce but have separate master-number pages).

### 3.4 Name number (Chaldean)
Chaldean letter-value table (values 1–8; 9 is assigned NO letters — verified verbatim from swarnsiddhi.com):

| Value | Letters |
|---|---|
| 1 | A, I, J, Q, Y |
| 2 | B, K, R |
| 3 | C, G, L, S |
| 4 | D, M, T |
| 5 | E, H, N, X |
| 6 | U, V, W |
| 7 | O, Z |
| 8 | F, P |
| 9 | (no letters) |

Pythagorean table (for comparison only; do NOT use as default):
| Value | Letters |
|---|---|
| 1 | A, J, S |
| 2 | B, K, T |
| 3 | C, L, U |
| 4 | D, M, V |
| 5 | E, N, W |
| 6 | F, O, X |
| 7 | G, P, Y |
| 8 | H, Q, Z |
| 9 | I, R |

- `name_compound = Σ chaldean(letter)` over the full name; `name_root = digital_root(name_compound)`.
- Spaces separate words; hyphens are treated as spaces (each side summed and added). Digits inside a name (rare, e.g. "John 2") have no Chaldean value → validation should reject them. Swarnsiddhi sums each word separately then adds word totals — same result as one continuous sum.
- Display BOTH compound and root: "25/7" (e.g. AstroSage shows Virat Kohli 32→5, Karishma Kapoor 46→10→1).
- Minor variants exist for a few letters (X, Y, W); the Cheiro-derived table above is the standard Indian version (swarnsiddhi.com warns of variants).

### 3.5 Planet lords and friendship matrix
Lords (verified across sources; matches Vyotish's current implementation):
1 Sun · 2 Moon · 3 Jupiter · 4 Rahu · 5 Mercury · 6 Venus · 7 Ketu · 8 Saturn · 9 Mars.

Friend/neutral/enemy matrix — schools differ slightly; the consensus core (stable across all fetched sources) plus the full Astrologer-Geetanjali table:

| # | Lord | Friends (consensus) | Neutral | Enemies (consensus) |
|---|---|---|---|---|
| 1 | Sun | 2, 3, 5, 9 | 4, 7 | 6, 8 |
| 2 | Moon | 1, 3, 5 | 6, 7, 9 | 4, 8 |
| 3 | Jupiter | 1, 2, 9 (some add 5) | 4, 7, 8 | 5, 6 |
| 4 | Rahu | 5, 6, 8 (some add 7) | 3 | 1, 2, 9 |
| 5 | Mercury | 1, 2, 3, 4, 6 | 7, 8, 9 | none |
| 6 | Venus | 4, 5, 8 (some add 1, 7) | 2, 9 | 1 or 3 (varies; usually 1, 2) |
| 7 | Ketu | 4, 5, 6 (some add 1) | 2, 3, 8, 9 | none (some: 9) |
| 8 | Saturn | 4, 5, 6 (some add 7) | 3 | 1, 2, 9 |
| 9 | Mars | 1, 3, 5 (some add 2, 6) | 4, 6, 7 | 4, 8 (usually 8; Geetanjali adds 2) |

Load-bearing invariants across ALL sources fetched: 8 (Saturn) is enemy/near-enemy to 1, 2, 9; 5 (Mercury) is friendly to almost everyone; 1-2-3 are mutually friendly; 8 is friends with 4/5/6. Derived from classical Vedic natural friendships (Sun friends Moon/Mars/Jupiter, enemies Venus/Saturn; Mercury has no enemies) — steer.coach table.
- **RECOMMENDATION:** adopt the consensus table above; keep the rival rows (Geetanjali lists e.g. 1's friends as 9,2,5,3,6,4 / unfriendly 8 / neutral 7) in an internal config so verdicts can be tuned per astrologer review.

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal: DOB 14-03-1992, name "Sanjay Bhati"
- Mulank: day 14 → 1+4 = **5** (Mercury).
- Bhagyank: digits 1,4,0,3,1,9,9,2 → 1+4+0+3+1+9+9+2 = 29 → 2+9 = 11 → 1+1 = **2** (Moon).
- Name: SANJAY = S3+A1+N5+J1+A1+Y1 = 12; BHATI = B2+H5+A1+T4+I1 = 13; total compound = **25** → root **7** (Ketu).
- Compatibility: name root 7 vs mulank 5 → 7 is in 5's neutral band (consensus) → "neutral" verdict; name root 7 vs bhagyank 2 → neutral. Compound 25 is a recognised auspicious Chaldean compound.

### Example 2 — edge: DOB 05-12-2000, name "Om" (non-standard short name)
- Mulank: day 05 → **5** (leading zero ignored).
- Bhagyank: 0+5+1+2+2+0+0+0 = 10 → **1** (leading zeros add nothing — must not break the sum).
- Name: OM = O7+M4 = compound **11** → school A (Western): keep 11, "master number"; school B (Vedic): root **2** (Moon). Output must show 11/2 both, with the Vedic root as primary lord.

### Example 3 — boundary: DOB 29-11-1980, name "Sanjay Kumar Bhati"
- Mulank: day 29 → 2+9 = **11** → master boundary: Western keeps **11**, Vedic root = **2** (Moon). Flag `master_detected`.
- Bhagyank: 2+9+1+1+1+9+8+0 = 31 → 3+1 = **4** (Rahu).
- Name: SANJAY 12 + KUMAR (K2+U6+M4+A1+R2 = 15) + BHATI 13 → compound **40** → root **4** (Rahu).
- Name root 4 vs bhagyank 4 → same number = friendly by identity; vs mulank 11→2: 4 vs 2 is in 2's enemy band (Rahu) → caution verdict.

### Example 4 — boundary digits: DOB 31-12-1999
- Mulank: 3+1 = **4**. Bhagyank: 3+1+1+2+1+9+9+9 = 35 → 3+5 = **8** (Saturn). Verdict text must handle mulank 4 vs bhagyank 8 (friends, consensus).

## 5. Complete output list
A GOOD Vedic-numerology calculator shows, for each of Mulank / Bhagyank / Name number:
1. Compound sum AND digital root (e.g. "29 → 2"; "25/7").
2. Ruling planet/lord per number (Sun…Mars) with a one-line lord description.
3. Interpretation paragraphs per number (personality, strengths, shadow traits — mulank 1 leader/ambitious; 2 sensitive/diplomatic; 3 expressive/teacher; 4 unconventional/practical; 5 communicative/business-minded; 6 artistic/luxury-loving; 7 spiritual/analytical; 8 disciplined/karmic; 9 energetic/protective — anytimeastro.com, grahai.com).
4. Master-number banner when compound = 11/22/33 (both schools' note).
5. Friendly/neutral/enemy numbers of the user's root numbers (from §3.5 table).
6. Name-vs-birth-number compatibility verdict (harmonious / neutral / challenging) with advice text.
7. Lucky / unlucky numbers for the user (derived from the friendship matrix).
8. Standard Vedic remedies block: favourable days, colours, gemstone (per lord), and the classic remedy targets (e.g. for 8: blue sapphire caution, discipline; for 2: pearl, Monday) — labelled "traditional remedy, astrologer consultation advised".
9. Relationship of Mulank→Bhagyank (e.g. "your path supports your nature" when friendly).
10. Disclaimer: entertainment/self-reflection only (Prokerala-style disclaimer is industry standard).
11. If Lo Shu/other tools linked: cross-links to lo-shu, mobile, vehicle calculators (competitors cross-sell heavily).

Competitor comparison:
| output | AstroSage | GaneshaSpeaks | AstroTalk (web) | Prokerala | Vyotish today |
|---|---|---|---|---|---|
| Inputs | name+DOB+gender | name+DOB+gender, multiple sub-calculators | web page "under development" (app-only) | DOB dropdowns (day/month/year 1901–2028) | date (+optional name) |
| Mulank/root | yes, with lord | yes | — (app) | implied via life-path | yes (root only) |
| Bhagyank | yes | yes | — | yes, keeps master numbers | yes (root only) |
| Name number | Chaldean, compound+root (46→1, 32→5) | Chaldean, dedicated calculator | — | — | compound+root via API |
| Master numbers | separate pages | separate pages | — | kept as 11/22/33 | only for destiny sum (flag) |
| Interpretation text | yes (articles linked) | yes | — | yes, per-number meaning pages | NO (none) |
| Friendly/enemy numbers | yes (articles) | yes | — | no | NO |
| Remedies | yes | yes | — | no | NO |

### Current Vyotish outputs
Page `/calculators/numerology`; `GET /api/v1/calculators/numerology?date&name` → `mulank, destiny, name_root, name_sum, name_lord`. Mulank = digital root of day; destiny = digital root of full-DOB digit sum; name via Chaldean A–Z only (non-Latin → 0). No meaning text, no compound display for mulank/destiny, no master flag, no lord for mulank/destiny in response, no compatibility, no remedies, no friendly/unfriendly numbers.

### Initial gap list
1. No interpretation/meaning text for any of the three numbers (single biggest gap; all competitors ship it).
2. No `mulank_lord` / `destiny_lord` fields (destiny-number calculator has them; numerology endpoint does not — inconsistent API shape).
3. Mulank/destiny shown as root only — compound (e.g. 29) never displayed; users expect "29 → 2".
4. Master-number handling absent for Mulank (day 29 → 11 case) and only partially present for destiny.
5. Non-Latin names silently map to 0 instead of returning a validation error or transliteration.
6. No friendly/neutral/enemy numbers, no lucky/unlucky numbers.
7. No name-vs-birth-number compatibility verdict.
8. No remedies (colours/days/gemstone) — remedial content is the main monetisation hook on competitors.
9. Name optional → compatibility silently skipped; should prompt/soft-warn instead.
10. No disclaimers.

## 6. Edge cases and validation rules
- Day 1–31 validation by month (reject 30/31 Feb, 31 Apr etc.); no future dates.
- Leap years: 29-02 valid only in leap years (29-02-1988 test case).
- Leading zeros (05-12-2000) must not alter sums.
- Single-digit day (e.g. 7) → mulank 7 directly, no compound digit to display (show "7" not "7 → 7").
- Compound exactly 11/22/33 → master flag; note 29→11→2 also passes through 11 (do NOT flag intermediate 11 of a multi-step reduction; only the FIRST-pass sum qualifies — Prokerala/Western rule).
- Name: uppercase-insensitive; strip spaces/hyphens before mapping; reject digits & non-Latin scripts with a clear message (current code returns 0 — must change); empty name → skip name outputs, do not emit `name_root: 0`.
- Year 0000/2-digit years rejected; DOB must be in the past.
- Max name length ~60 chars; per-word totals returned for multi-word names.
- Digital root of 0 (impossible for valid DOB; possible only from empty name) → guard.

## 7. Sources
- Mulank/Bhagyank definitions & meanings: https://www.grahai.com/numerology ; https://www.anytimeastro.com/blog/numerology/mulank-1
- Bhagyank method + master-number keep rule + worked example (15-08-1985→1): https://www.prokerala.com/numerology/bhagyank-calculator.php
- Chaldean letter table verbatim (1–8, no 9, word-sum method, variant warning): https://swarnsiddhi.com/blog/chaldean-numerology-table
- Master numbers Western school (keep 11/22/33) and Indian Cheiro root-reading note: https://www.worldnumerology.com/numerology-master-numbers
- Full friend/enemy/neutral table (per-number rows quoted): https://astrologergeetanjalijindal.com/numerology
- Classical Vedic planetary friendship derivation: https://steer.coach/planet-friend-enemy-table
- AstroSage method & name-number examples (46→1, 32→5): https://www.astrosage.com/numerology/
- GaneshaSpeaks inputs/outputs: https://www.ganeshaspeaks.com/numerology
- AstroTalk web status (under development; app-only): https://www.astrotalk.com/numerology
