# Mobile Number Numerology — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
Mobile Number Numerology judges whether a phone number "vibrates" well for its owner: the digits are summed to a root number (ruling planet), which is then checked for compatibility with the owner's Mulank/Bhagyank. It is one of the highest-traffic specialty calculators in India (AstroTalk ships a dedicated tool; numerologists sell "lucky number" consultations and VIP numbers). Users: people buying a new SIM/choosing among available numbers, VIP/fancy-number buyers (repeating patterns 777/999), professionals picking numbers for career goals (love, money, confidence — AstroTalk), and numerology-curious users checking their existing number. It is inherently a two-input tool (number + owner DOB) — a number cannot be judged in isolation, which is exactly what competitors implement and what Vyotish currently lacks.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Mobile number | required | digit string; strip spaces, hyphens, +91/0 country/STD prefixes | 10 digits (Indian standard); accept 3–15 after stripping but flag non-10 as "unusual length" | none | The digits being judged. Leading +91/0 must be stripped BEFORE summing (owner dialed forms differ; the subscriber number is what is judged). |
| Owner's date of birth | required (for compatibility) | date DD/MM/YYYY | 1900–today | none | Source of Mulank (root of day) and Bhagyank (root of full date) — the compatibility reference. AstroTalk requires DOB; Dinesh Atrish requires both numbers derived from it. |
| Owner's name | optional | Latin text | — | blank | AstroTalk also compares the number against the NAME number. Optional v2 feature. |
| Purpose | optional | enum (money/love/peace/career) | — | none | AstroTalk: "best number depends on what you want in life" (wealth → 6/8 emphasised). Nice-to-have for interpretation copy. |

### Recommended input set
Mobile number (mandatory) + owner DOB (mandatory — no compatibility verdict without it) + optional name and purpose. This matches AstroTalk's input set (DOB + mobile) and Dinesh Atrish's (both birth numbers derived from DOB).

### Current Vyotish input set
`GET /calculators/mobile-numerology?digits` (3–15 digits after stripping non-digits) — NO owner DOB input, so no compatibility with Mulank/Bhagyank; output is marked `for_fun:true`. The owner-DOB input is the single most important missing field per the owner directive.

## 3. Formula(s) / method
### 3.1 Total: which digits — the two schools
- **School A (dominant, full sum):** add ALL digits of the (stripped) number and reduce to one digit. Examples from live sites: 9876543210 → 45 → **9** (AstroTalk); 9990513999 → 63 → **9** (Dinesh Atrish, Mars).
- **School B (last-4 variant):** some numerologists sum only the last 4 digits, tying that total to the "driver/conductor" pair (Mulank/Bhagyank) — seen in practitioner PDFs ("Mulank wise lucky phone numbers").
- Dinesh Atrish's synthesis: "the whole number's total matters, not just the last digits — though pattern digits at the end (e.g. AAAA) carry the 'last vibration'". AstroTalk similarly emphasises the last 4 digits as "strongest, most active energy" while summing all digits.
- **RECOMMENDATION:** School A (full sum) as the primary total; ALSO report the last-4-digit total as a secondary "tail vibration" line. This covers both schools and the pattern-buyer audience.

### 3.2 Compatibility with owner's Mulank/Bhagyank (Dinesh Atrish rules — most explicit published scheme)
1. Mulank = root of birth day; Bhagyank = root of full DOB.
2. Age weighting: before ~35 the Mulank ("driver") dominates; after ~35 the Bhagyank ("conductor") dominates.
3. If Mulank and Bhagyank are friendly to each other → choose a total friendly to BOTH.
4. If they are not friends → prefer a total friendly to whichever is a benefic number (benefics: 1, 2, 3, 5, 6, 9).
5. Verdict levels: friendly to both = Excellent/Very good; friendly to one + neutral to other = Very good–Neutral; neutral to both = acceptable; inimical to either = "Less in tune — not suggested"; inimical to both = not suggested.
6. Friendship matrix per vedic-numerology.md §3.5 (planet friend/enemy pairs); note Atrish's per-number table (below) is one school's variant of it.

### 3.3 Digit rules
- 0 is neutral: adds nothing, usable as filler; avoid numbers ENDING in 0.
- Repeating-pattern digit (e.g. the 7 in 7777): should be friendly to the owner's ruling number; inimical digits never used in patterns.
- 4/7/8 are NOT universally bad (contrary to the popular "avoid 4 and 8" school — Atrish explicitly rejects it; they suit certain owner numbers, e.g. 4/8 owners can use 1). Present the "avoid 4/8/0" advice as a common school-of-thumb, not a rule.
- AstroTalk adds: excessive 4s/8s, too many zeros, or digits conflicting with birth/name numbers → caution.

### 3.4 Root meanings 1–9 for a mobile number (with lords)
1 Sun — leadership, independence, new starts (CEOs, politics) · 2 Moon — teamwork, emotion, partnership (artists, writers) · 3 Jupiter — creativity, communication, teaching (doctors, lawyers) · 4 Rahu — discipline through hard work, technology (engineers) · 5 Mercury — change, freedom, business, communication (sales, marketing) · 6 Venus — family, care, luxury, wealth (film, fashion, medicine; wealth number) · 7 Ketu — spirituality, research, deep thinking · 8 Saturn — wealth, business success, power (finance, real estate; wealth number) · 9 Mars — courage, completion, service (police, sports). Masters 11/22/33: "strong spiritual energy, higher purpose, bigger challenges" (AstroTalk).

### 3.5 Auspicious purchase timing (Atrish, optional output)
Each root has lucky day/dates, e.g. root 1: Sunday/Wednesday/Thursday, dates 1, 10, 19, 28. Optional remedial/perk content.

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal: number 9876543210, owner DOB 14-03-1992
- Strip (nothing to strip): digits 9,8,7,6,5,4,3,2,1,0 → sum = 45 → 4+5 = **9** (Mars). Tail (last 4) = 3+2+1+0 = 6 → 6 (Venus).
- Owner: mulank 5 (Mercury), bhagyank 2 (Moon). Total 9 vs mulank 5 → 9 is inimical to 5 (Mars–Mercury enmity; Atrish: 9 inimical 4,5) → "Less in tune". Total 9 vs bhagyank 2 → 9 friendly/neutral to 2 (Atrish: 2's list has 9 neutral; Mars friends include 2) → acceptable.
- Verdict: NOT suggested for this owner (inimical to mulank). Demonstrates why DOB is mandatory.

### Example 2 — normal (cross-source): number 9990513999 (Atrish's published example)
- Digits: 9,9,9,0,5,1,3,9,9,9 → 9+9+9+0+5+1+3+9+9+9 = 63 → 6+3 = **9** (Mars). Pattern digit 9 ×6.
- For owner mulank 9/bhagyank 9: 9 vs 9 → friendly (identity) → Excellent.

### Example 3 — edge: all-9s 9999999999
- 10 × 9 = sum **90** → 9+0 = **9** (Mars). Tail = 9999 → 36 → 9. Pattern 9 ×10 ("amplified Mars energy" — AstroTalk pattern rule).
- For mulank 4 owner (Rahu): 9 vs 4 → inimical (Atrish: 9 inimical 4) → not suggested; for mulank 9 → excellent. Edge exercises 10-digit max length + repeated single digit.

### Example 4 — boundary: master-crossing total 9992220000
- Digits: 9,9,9,2,2,2,0,0,0,0 → sum = 27+6 = **33** → first-pass total IS a master number.
- Western school: keep **33** (compassion/healing). Indian school: root 3+3 = **6** (Venus).
- Output contract: `sum: 33, root: 6, master: true` + master note. Also exercises six trailing zeros (0-neutral filler rule; number ends in 0 → "avoid ending in 0" advisory fires).

### Example 5 — boundary length: "123" (minimum accepted)
- Sum 6 → root **6** (Venus). Flag `length_warning: "not a standard 10-digit mobile number"`; treat as generic digit string.

## 5. Complete output list
A GOOD mobile numerology calculator shows:
1. `sum` (compound, e.g. 45/63) + `root` (1–9) + ruling planet with one-liner.
2. Tail/last-4-digit total ("tail vibration") + pattern-digit analysis (repeats, AAAA patterns, 777/999 amplification note).
3. Owner compatibility block (needs DOB): mulank + bhagyank of owner, age-weighting note (<35 driver / >35 conductor), verdict level (Excellent/Very good/Good/Neutral/Less in tune) per Atrish levels, and WHICH relationship drove it.
4. Master-number note when first-pass sum ∈ {11,22,33} (both schools).
5. Meaning paragraph for the root (1–9, career-fit style, §3.4).
6. Digit-quality notes: zeros count/ending-in-0 advisory, excessive 4s/8s advisory, pattern-digit friendliness to owner number.
7. Suggestions: characteristics of a better number for this owner (target root list per owner's mulank/bhagyank from the matrix), wealth focus (6/8) if purpose = money.
8. Optional: auspicious day/dates to activate/change the number; Lo Shu cross-analysis (AstroTalk mentions advanced tools do this).
9. Disclaimer: AstroTalk's own framing — scientific proof is limited, benefits anecdotal; plus entertainment disclaimer.

Competitor comparison:
| output | AstroTalk | Dinesh Atrish | Vastu Raviraj | Vyotish today |
|---|---|---|---|---|
| Inputs | DOB + mobile | DOB (+derived mulank/bhagyank) + mobile | number + birth numbers | digits only (3–15) |
| Full-sum total | yes (45→9 example) | yes (63→9 example) | yes | yes |
| Last-4/tail analysis | emphasized | "last vibration" | — | NO |
| Pattern analysis | yes (777/999) | yes (pattern digit rules) | — | NO |
| Owner compatibility | yes (vs birth/name/life-path) | yes, with age weighting + verdict levels | friendliness check | NO (no DOB input) |
| Master numbers | yes (11/22/33) | n/a (reduces) | — | NO |
| Meanings 1–9 | yes | yes (+professions + lucky day/dates) | yes | NO (single `note`) |
| Remedies/suggestions | yes (choose per goal, 6/8 wealth) | yes (best totals, auspicious dates) | suggestions | NO |
| Disclaimer | yes (science-limited note) | — | — | `for_fun:true` flag only |

### Current Vyotish outputs
Page `/calculators/mobile-numerology`; `GET /calculators/mobile-numerology?digits` (3–15 digits after stripping non-digits) → `sum, root, lord, note, for_fun:true`. Correct full-sum method and lord mapping. Gaps: no owner DOB → no compatibility (owner directive explicitly requires Mulank/Bhagyank judgement); no tail/pattern analysis; no meanings per root; no master handling; no digit-quality advisories; 3–15 digit acceptance silently allows non-phone strings.

### Initial gap list
1. No owner DOB input → cannot judge compatibility with Mulank/Bhagyank (the core feature competitors ship).
2. No last-4-digit tail total / pattern-digit analysis (777/999 etc.).
3. No per-root meaning text (1–9 with professions).
4. No master-number handling (first-pass sum 11/22/33).
5. No digit advisories (ending in 0, excessive 4/8, zero count).
6. No verdict levels (Excellent→Not suggested) even once DOB is added — copy the Atrish level scheme.
7. No suggestions for better numbers per owner.
8. `for_fun:true` instead of a proper disclaimer + meaning text.
9. Length validation: accept 10 digits normally; 3–15 allowed but flagged.

## 6. Edge cases and validation rules
- Strip +91 / 91 / 0 prefixes and all separators (spaces, hyphens, dots) BEFORE summing; a number entered as "+91 98765 43210" must total identically to "9876543210" (45→9). Careful: stripping leading 91 of a 12-digit entry — only strip when result is 10 digits and starts with 6–9 (Indian mobile rule), else treat digits as-is.
- Length: 10 digits standard; 3–15 accepted with `length_warning`; empty/non-digit input → error.
- Leading 0 of subscriber numbers (rare) contributes nothing to sum but triggers "ends in 0"/"starts with 0" advisory.
- All-same-digit numbers (9999999999) — pattern rule; sum 90→9.
- First-pass sum 33 boundary test: 9992220000 → sum 33 → root 6 + master flag (Example 4).
- Sum range: 3-digit min sum 6; 15-digit max sum 135 → root 9; digital-root function must handle any input length without overflow (numbers as strings, not ints).
- Master detection on first-pass total only (not intermediates).
- No storage of phone numbers (privacy) — AstroTalk states nothing is saved; replicate the privacy note.
- Compatibility verdicts must be symmetric-checked against the chosen friendship matrix (matrix is directional in Atrish's tables — define Vyotish's direction: compare TOTAL's root against OWNER's numbers using the owner-number's friend/enemy row).

## 7. Sources
- AstroTalk mobile numerology calculator (inputs DOB+mobile, full-sum 45→9 example, patterns, last-4 emphasis, meanings 1–9, masters, remedies, science-limited note): https://astrotalk.com/mobile-number-numerology-calculator
- Dinesh Atrish rules (full sum 9990513999→63→9; age weighting; verdict levels; benefics 1,2,3,5,6,9; 0-neutral; pattern-digit rules; 4/7/8 not universally bad; per-root best/inimical tables; auspicious day/dates): https://www.dineshatrish.com/mobile-number-numerology-calculator
- Vastu Raviraj calculator (friendliness with birth numbers): https://vasturaviraj.co.in/mobile-number-numerology-calculator
- Last-4-digit school: practitioner PDFs ("Mobile Numerology: Good and Bad Combinations"; "Mulank Wise Lucky Phone Numbers") — search synthesis, secondary variant
- Lords 1–9: vedic-numerology.md §3.5 sources (swarnsiddhi.com, steer.coach, astrologergeetanjalijindal.com)
- Friendship matrix: https://astrologergeetanjalijindal.com/numerology + https://steer.coach/planet-friend-enemy-table
