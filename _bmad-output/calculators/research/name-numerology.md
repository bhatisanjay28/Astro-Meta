# Name Numerology (Chaldean) — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
Name Numerology converts a person's (or business's) name into a number via the Chaldean letter-value table and judges whether that "name vibration" supports or fights the person's birth numbers. It is the tool behind the huge Indian market for name-spelling corrections (adding/removing letters in names, brand names, baby names). Users: people told their name number clashes with their Mulank/Bhagyank, parents naming babies (baby-name vibrational matching — namevibrations.in pattern), founders naming businesses, and actors/celebrities tuning stage names. AstroSage's canonical examples are celebrities (Virat Kohli 32→5, Karishma Kapoor 46→10→1), which shows the content angle. This is also Vyotish's monetisable remedial tool: the verdict ("your name needs correction") is the pitch.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Full name | required | Latin-script text; letters A–Z, spaces, hyphens; case-insensitive | 1–60 chars (typical); reject digits/symbols/empty | none | The letter values ARE the calculation. Full name = first + middle + last all summed (per-word sums, then total). |
| Date of birth | required for compatibility verdict | date DD/MM/YYYY | 1900–today | none | Mulank (root of day) + Bhagyank (root of full date) are the reference numbers the name must harmonise with. Astrotridev-style tools require it; AstroTalk's name calculator also takes "birth details". |
| System | optional enum (advanced) | chaldean (default) / pythagorean | — | chaldean | AstroTalk exposes a system choice (Chaldean, Pythagorean, Sepharial, Modern). Recommend Chaldean-only default with optional Pythagorean toggle for cross-checkers; skip Sepharial/Modern. |

Name-treatment rules (schools):
- **Full name summed** (all words) is the standard for the "destiny/expression" style number; a minority reads only the first name for "social vibration". Recommend: display per-word totals AND the total; interpret from the full-name total.
- Middle/last names count fully. Initials without expansion cannot be evaluated — prompt for the expanded name.
- Married names / spelling variants: tools let users test multiple candidate spellings side by side (the "suggested spelling" feature). Good output: a small what-if re-computation.

### Recommended input set
Full name (mandatory) + DOB (mandatory for the compatibility verdict) + optional system toggle. Without DOB the tool can still show sum/root/lord but must label the verdict section "add birth date to judge compatibility".

### Current Vyotish input set
`GET /calculators/name-numerology?name` — name only, NO DOB → compatibility verdict impossible today (biggest functional gap vs Astrotridev/AstroTalk).

## 3. Formula(s) / method
### 3.1 Chaldean letter-value table (verified verbatim — Cheiro-derived standard, values 1–8, no 9)
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
| 9 | (no letters — 9 is "sacred"; a name TOTAL may still reduce to 9, e.g. ROHIT MEHRA → 36 → 9) |

Source: swarnsiddhi.com (which also warns of "minor variants… usually over a handful of letters such as X, Y and W" — the table above is the standard Indian version; do not adopt variant charts).

### 3.2 Pythagorean table (for the optional comparison toggle — NOT the default)
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

Difference: Pythagorean is strictly positional (alphabet serial mod 9); Chaldean is phonetic and never assigns 9. A name can score very differently (e.g. "SANJAY" = 12 Chaldean vs 1+1+5+1+1+7 = 16 Pythagorean).

### 3.3 Summation and spaces/digits/hyphens
- `compound = Σ value(letter)` for every letter A–Z in the name; spaces are separators — sum each word, then add word totals (same result as one continuous sum; swarnsiddhi's word-by-word method).
- Hyphens: treat as spaces (e.g. "Priya-Verma" = "Priya Verma").
- Digits (0–9) and symbols inside a name: NO Chaldean value exists → validation must REJECT them (do not silently skip).
- Case-insensitive mapping.
- Display: `compound / root` (e.g. 25/7). Chaldean school (swarnsiddhi): record the compound first, then reduce; no master numbers are kept in this table's practice (11/22 are read through roots 2/4 — state this explicitly since Western tools disagree).

### 3.4 Compound-number meanings (Cheiro tradition, 10–99)
Beyond the root 1–9, the compound itself carries meaning ("10 Wheel of Fortune — rise-and-fall fame", "19 Prince of Heaven — most fortunate", "20 spiritual awakening", "25 wisdom through trials", "37 fortunate in love/creativity", "41/45 among the traditionally lucky", "46 fortunate but responsible"). Cheiro divides numbers into 1–9 (simple) and 10–99 (compound, "occult meanings"). RECOMMENDATION: ship root + lord + meaning first; add the compound-meaning library for the ~15 most-cited compounds (10, 15, 19, 20, 23, 25, 27, 29, 31, 32, 37, 41, 45, 46) — mark the full 10–99 set as a content backlog.

### 3.5 Compatibility verdict (name vs birth numbers)
Compare name root against Mulank and Bhagyank using the friend/neutral/enemy matrix (vedic-numerology.md §3.5): friendly → "lucky/harmonious name"; neutral → "acceptable"; enemy → "challenging — consider spelling adjustment" with what-if suggestions (each suggested variant re-computed live). Astrotridev implements exactly this (name vs Moolank + Bhagyank); AstroTalk's tool feeds the same verdict; NameVibrations applies it to baby names.

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal: "Sanjay Bhati", DOB 14-03-1992
Per-letter values (Chaldean):
- SANJAY: S3, A1, N5, J1, A1, Y1 → 3+1+5+1+1+1 = **12**
- BHATI: B2, H5, A1, T4, I1 → 2+5+1+4+1 = **13**
- Compound = 12+13 = **25** → root 2+5 = **7** (Ketu).
- Compatibility: mulank 5 (Mercury) vs name 7 → neutral; bhagyank 2 (Moon) vs 7 → neutral. Compound 25 = "experience and wisdom through trials" (Cheiro compound list).
- Regression contract: `letters: {S:3,A:1,N:5,J:1,A:1,Y:1,B:2,H:5,A:1,T:4,I:1}, sum: 25, root: 7, lord: Ketu`.

### Example 2 — edge: hyphenated + mixed case "priya-verma"
- PRIYA: P8, R2, I1, Y1, A1 = **13**; VERMA: V6, E5, R2, M4, A1 = **18** → compound **31** → root **4** (Rahu).
- Hyphen treated as space; lowercase mapped identically. Word totals must both be returned (13, 18).

### Example 3 — boundary: "Om" (master-crossing name)
- O7 + M4 = compound **11** → Chaldean/Vedic school: root **2** (Moon); Western tools would keep 11. Output must show `compound: 11, root: 2, master_note` (both schools stated).
- Second boundary in same family: single letter "A" → compound 1, root 1 (Sun) — minimum input length 1.

### Example 4 — invalid inputs (validation contract)
- "King4Life" → contains digit 4 → REJECT with message "letters A–Z only".
- "संजय" (Devanagari) → zero mappable letters → REJECT "please enter the name in English letters" (current Vyotish behaviour returns sum 0 — must change to an explicit error).
- "Anna-Maria O'Neill" → apostrophe rejected or stripped per policy; recommend strip-and-continue with a note, since names like O'Neill are common.

## 5. Complete output list
A GOOD Chaldean name calculator shows:
1. Per-letter value table of the name as typed (Vyotish already has `letters[]` — keep and render it).
2. Per-word subtotals + full compound + root (display "25/7").
3. Lord of the root (Sun…Mars) + one-line lord description.
4. Compound-number meaning (Cheiro 10–99, at least for common compounds) + root meaning paragraph.
5. Compatibility verdict vs Mulank and Bhagyank (requires DOB): harmonious/neutral/challenging with matrix citation.
6. What-if spelling suggestions when verdict is "challenging" (recomputed live candidates).
7. System toggle note (Chaldean default; optional Pythagorean comparison showing the alternative score).
8. Master-number note when compound ∈ {11, 22, 33} (both schools).
9. Lucky/unlucky name-number quick list for the user's mulank/bhagyank (e.g. "for Mulank 5: name roots 1,4,6 are friendly").
10. Disclaimer + "name correction is advisory; consult an astrologer" line.

Competitor comparison:
| output | AstroTalk | AstroSage | Astrotridev | Vyotish today |
|---|---|---|---|---|
| Input | name + birth details + SYSTEM choice (Chaldean/Pythagorean/Sepharial/Modern) | name (+DOB on umbrella tool) | name + DOB | name only |
| Per-letter table | yes | — | — | yes (`letters[]`) |
| Compound+root | yes | yes (46→1, 32→5 shown) | yes | yes (`sum`,`root`) |
| Lord | yes | yes (links lord to planets) | yes | yes (`lord`) |
| Meaning text | yes | yes (article links) | yes | NO (single `note` string) |
| Compatibility vs mulank/bhagyank | yes | yes (framing) | yes (core feature) | NO (no DOB input) |
| Spelling suggestions | upsell reading | — | — | NO |
| Compound meanings (Cheiro) | — | in articles | some | NO |

### Current Vyotish outputs
Page `/calculators/name-numerology`; `GET /calculators/name-numerology?name` → `sum, root, lord, letters[] (per-letter Chaldean values), note`. Correct table, correct per-letter mapping, no DOB → no compatibility verdict; no meaning text; non-Latin names map to 0 instead of erroring; no compound-meaning text; no spelling suggestions; no disclaimers.

### Initial gap list
1. No DOB input → the tool cannot produce the compatibility verdict, which is the entire point of a "lucky name" tool ( competitors all require it).
2. No interpretation text per root number (1–9 meaning paragraphs).
3. No Cheiro compound-number meanings (10/19/25/37/…).
4. Non-Latin/digit characters silently sum to 0 — must become validation errors.
5. No per-word subtotals in the API response (letters[] exists; add `words[]`).
6. No what-if spelling suggestions / side-by-side candidate comparison.
7. No Pythagorean comparison toggle (AstroTalk exposes system choice; users will ask).
8. No master-number (11/22/33) note.
9. No disclaimers.

## 6. Edge cases and validation rules
- Reject digits, symbols, empty string; strip apostrophes with a note (O'Neill → ONEILL).
- Accept hyphens as word separators; preserve multi-word structure (`words[]` = subtotals).
- Case-insensitive; trim whitespace; collapse multiple spaces.
- Max length ~60 letters (compute budget); minimum 1 letter.
- Non-Latin scripts → explicit error with "enter in English letters" (never return 0).
- Compound 11/22/33 → master note, root still primary (Vedic school).
- Root range 1–9; guard sum=0 (all-unmapped) → validation error, not root 0.
- Unicode normalization: treat accented Latin (é → E) as its base letter or reject — pick REJECT for v1 simplicity (document it).
- Idempotence: same name must always map identically (table is static; add unit tests over the full A–Z table: A=1,B=2,C=3,D=4,E=5,F=8,G=3,H=5,I=1,J=1,K=2,L=3,M=4,N=5,O=7,P=8,Q=1,R=2,S=3,T=4,U=6,V=6,W=6,X=5,Y=1,Z=7).

## 7. Sources
- Chaldean table verbatim, word-sum method, no-9 rule, variant warning: https://swarnsiddhi.com/blog/chaldean-numerology-table
- AstroSage method + celebrity examples (46→1, 32→5): https://www.astrosage.com/numerology/
- AstroTalk name calculator (system choice Chaldean/Pythagorean/Sepharial/Modern; name + birth details): https://astrotalk.com/name-numerology-calculator (hub: https://astrotalk.com/calculators)
- Compatibility verdict vs Mulank/Bhagyank pattern: Astrotridev name numerology tool (search result) + NameVibrations baby-name matching
- Cheiro compound-number meanings (10, 19, 20, 25, 37, 41, 45, 46): https://www.vedicastrology.co.in/numerology-compound-numbers-31-51.html + Scribd "compound numbers" digest (search synthesis; UNVERIFIED for the full 10–99 list — ship only widely cited compounds)
- Pythagorean table (comparison): standard positional table as cross-cited by Chaldean/Pythagorean comparison charts (swarnsiddhi + numerologist.com framing)
- Friendship matrix for verdicts: https://astrologergeetanjalijindal.com/numerology + https://steer.coach/planet-friend-enemy-table
