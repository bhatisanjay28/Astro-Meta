# Love Compatibility Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Positioning: **fun/entertainment** percentage tool. No standard formula exists anywhere — the method below is our documented entertainment convention, and the UI must say so.

## 1. Purpose and who uses it

The classic "love meter": enter two names, get a percentage (0–100%) that declares how compatible the pair is. Purely recreational — calculator.net states outright that such tools are "intended for amusement only rather than as a real indication of love" and that "there will probably never be a science of love." Users: teens and social-media sharers (the shareable-result format is the product), couples playing around, and traffic funnel into Vyotish's serious tools. Every major calculator portal has one because the queries are enormous.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| name A | required | text, Latin letters | 1–40 chars | — | first partner's name (drives the letter counts) |
| name B | required | text, Latin letters | 1–40 chars | — | second partner's name |
| birthday A / birthday B | optional (future) | ISO dates | — | — | some competitors accept birthdays too; v1 names-only, birthdays can feed the numerology add-on later |

First names are the norm for this tool (casual); full names allowed but the game reads them letter by letter.

### Recommended input set
Two names (required) only for v1. Keep it one screen, shareable result. Optional birthday fields deferred to a "love match + numerology" pro variant (NameVibrations-style 12-check pattern).

### Current Vyotish input set
`GET /calculators/love?a&b` — two names; **UI bug: form sends `name=` instead of `a=`** (shared with name-compatibility/friendship/flames), so the live page cannot return a result.

## 3. Formula(s) / method

**There is no standard formula.** Survey of what competitors actually do:
- calculator.net: two names → 0–100% with an **undisclosed** internal algorithm; explicit amusement-only disclaimer; posts example scores (Biden–Jacobs 96%, Trump–Knavs 12%).
- AstroYogi love meter: "uses the combination of letters from both names" → percentage; again undisclosed.
- Generic implementations: letter-to-number mappings or letter-count games; several implement the schoolyard **"LOVES"** paper game (below).

### 3.1 RECOMMENDED — the documented "LOVES triangle" game (our entertainment convention)
A published schoolyard game (LADbible nostalgia post; Brit + Co and wikiHow-style paper walkthroughs; a Birmingham University 2016 playful write-up "Calculating endless love!"), made fully deterministic. Show-your-work is the UX advantage over calculator.net's black box.

Steps:
1. Concatenate both names, lowercase, letters only: `S = (nameA + nameB)`.
2. Count occurrences of each letter of **L, O, V, E, S** in `S`: five counts `c_L, c_O, c_V, c_E, c_S`. If any count ≥ 10, replace it with its **digital root** (our convention — keeps the row one digit per letter).
3. Form row 0 = `[c_L, c_O, c_V, c_E, c_S]` (5 digit entries).
4. **Fold:** replace the row with the sums of adjacent pairs; a two-digit sum is written as its two digits (e.g., 8+4=12 → digits 1, 2). So row `[d1..dn]` → `[d1+d2, d2+d3, …, d(n-1)+dn]` with carries split into separate digits.
5. Repeat folding **while the row has more than 2 digits**. Row length decreases by 1 per no-carry fold; carries keep length constant but strictly reduce total digit-sum, so the process always terminates at exactly 2 digits.
6. Score = `10×d1 + d2` (range 0–99). Display as `N%`.

Deterministic: same names always give the same percentage; every fold is displayable — the UI should show the counting line (e.g., `L0 O0 V2 E0 S0`) and each fold row.

### 3.2 Bands (our documented entertainment convention — not from any source)
| Score | Band | Copy tone |
|---|---|---|
| 0–24 | "Just pals (in this game)" | playful |
| 25–49 | "Getting along" | encouraging |
| 50–74 | "Strong spark" | warm |
| 75–99 | "Game-approved match" | celebratory |
Plus persistent disclaimer: "A game played on names and the word LOVES — for laughs, not life decisions."

**Variants in the wild (documented, not recommended):** outer-digits folding (sum first+last digit repeatedly) instead of adjacent pairs; undisclosed black-box percentages (calculator.net, AstroYogi); zodiac-sign love meters (different tool category). Adjacent-pair folding is chosen because it is the most widely taught paper version and every intermediate step renders nicely.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal: "SANJAY" + "PRIYA"
- Combined: `sanjaypriya`. Counts: L=0, O=0, V=0, E=0, S=1 → row `0 0 0 0 1`.
- Fold 1: (0+0)(0+0)(0+0)(0+1) → `0 0 0 1`
- Fold 2: (0+0)(0+0)(0+1) → `0 0 1`
- Fold 3: (0+0)(0+1) → `0 1` → stop (2 digits) → **score 1%**, band "Just pals (in this game)".
- (A funny but honest outcome for the test pair — demonstrates that the game reads only the letters L-O-V-E-S.)

### Example 2 — normal/high: "DAVID" + "VICTORIA"
- Combined letters include V twice (DAVID, VICTORIA) and O once (VICTORIA): counts L=0, O=1, V=2, E=0, S=0 → row `0 1 2 0 0`.
- Fold 1: (0+1)(1+2)(2+0)(0+0) → `1 3 2 0`
- Fold 2: (1+3)(3+2)(2+0) → `4 5 2`
- Fold 3: (4+5)(5+2) → `9 7` → **97%**, band "Game-approved match".

### Example 3 — edge: identical names "PRIYA" + "PRIYA"
- Counts: L=O=V=E=S=0 → row `0 0 0 0 0`.
- Folds: `0 0 0 0` → `0 0 0` → `0 0` → **0%**. Documented rule: all-zero counts → 0% (the game literally cannot see the pair). UI copy should joke gently, not insult.

### Example 4 — boundary: carry split + count ≥ 10
- Carry case: a fold producing 12 splits into digits 1 and 2, keeping the row the same length once. Example: "BOB" + "SAL": counts S=1,O=1,L=1,V=0,E=0 → row `1 1 1 0 0`… fold: (1+1)(1+1)(1+0)(0+0) → `2 2 1 0`; fold: (2+2)(2+1)(1+0) → `4 3 1`; fold: (4+3)(3+1) → `7 4` → **74%**.
- Count ≥ 10 rule: a name pair with twelve S's (e.g., S repeated across long names) contributes digital root 3 (1+2) to the S slot — documented in `meta.rule`, tested with a synthetic 12-S pair.

## 5. Complete output list

A GOOD love calculator shows:
1. **Percentage** (big, shareable).
2. **Band** with a one-line meaning and light tone.
3. **Method breakdown**: the LOVES counts line + every fold row (the "show your work" differentiator).
4. **Both names echoed** with the combined-letter string used.
5. `for_fun: true` + entertainment disclaimer ("amusement only" — calculator.net's own framing).
6. Nice-to-have: share button/URL, re-run with full names variant, link to the serious Name Compatibility tool ("want the numerology version?").

**Comparison vs competitors**
- calculator.net: 0–100% from names, black-box method, excellent plain disclaimer; example celebrity scores. No work shown.
- AstroYogi love meter: same shape (names → %), letters-based, undisclosed.
- LOVES-game online implementations: show some work but variants differ (adjacent-pair vs outer-digit folding) — none documents its exact rules; Vyotish can win by being the one that shows every row and states its convention.

### Current Vyotish outputs
`GET /calculators/love?a&b` → `score = clamp(40 + digitalRoot(rootA + rootB) × 5, 55, 95)` (numerology roots), plus `band, note, for_fun:true`; page `/calculators/love` (UI posts `name=` instead of `a=` — broken).

### Initial gap list
1. **UI param bug** (`name=` vs `a=`) — page dead until fixed.
2. **Clamped score range 55–85 in practice** (digitalRoot 1–9 → 45–85, clamped to 55–95): never shows a 90s "soulmate" or a low "just friends" score — kills the fun; the LOVES game spans 0–99.
3. **Method opaque**: clamp formula not explained anywhere; bands undocumented; no percentage breakdown shown.
4. **Bands not tied to any documented convention**; no per-band copy.
5. No disclaimer copy beyond `for_fun:true`; no share-friendly result.
6. Numerology roots used silently — if we keep any numerology tie-in it must be labelled; recommend switching to the LOVES game for this tool and leaving numerology to name-compatibility.

## 6. Edge cases and validation rules

1. **Empty/whitespace names, >40 chars** → 400 with friendly message.
2. **Case/punctuation**: casefold; strip non-letters (hyphens, spaces) before counting; "Priya" ≡ "PRIYA".
3. **All-zero counts** → 0% (defined; not an error).
4. **Count ≥ 10** → digital root (documented; prevents ambiguous multi-digit rows).
5. **Carry rows**: two-digit sums split into two digits — row length can hold at 5 while carries persist, but total digit-sum strictly decreases, so termination is guaranteed; add a fold-count cap (e.g., 50) with an assertion failure as a safety net.
6. **Score bounds**: 0–99 (a LOVES-fold can never yield 100 — do not fake a 100%).
7. **Determinism**: no randomness, no time-dependence; same input → same output forever (test: golden-vector suite).
8. **Identical names**: valid input; expect the deterministic 0% (Example 3) unless letters exist.
9. **Non-Latin scripts** → reject politely (transliteration future work).
10. **`for_fun:true`** stays in the contract; result page leads with the disclaimer.

## 7. Sources

- calculator.net — Love Calculator (names → 0–100%; undisclosed method; explicit "amusement only" disclaimer; sample celebrity scores): https://www.calculator.net/love-calculator.html
- AstroYogi — Love meter (letter-combination method description): https://www.astroyogi.com/love/love-calculator
- LOVES paper-game method (count L-O-V-E-S letters, fold adjacent sums until two digits remain; 8+4=12 → write 1,2): LADbible nostalgia video https://www.facebook.com/LADbible/videos/178212365318080 ; Brit + Co "how to make a love calculator" walkthrough (brit.co); wikiHow-style step-by-step love-calculator-on-paper guide (found via WebSearch aggregation)
- University of Birmingham (Feb 2016) — "Calculating endless love!" playful analysis of name-based love percentages: https://www.birmingham.ac.uk/news-archive/2016/calculating-endless-love
- Competitor pattern of combining DOB + name checks (future birthday fields): NameVibrations https://namevibrations.com/love-compatibility-by-name
