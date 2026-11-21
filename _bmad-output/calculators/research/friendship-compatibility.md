# Friendship Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Positioning: **fun/entertainment** percentage tool, sibling of the Love Calculator. No standard formula exists — the method below is our documented entertainment convention, and the UI must say so.

## 1. Purpose and who uses it

The "friendship meter": two names in, a friendship percentage out, with a light verdict. Same recreational DNA as the love meter (calculator.net's own framing — such tools are "amusement only") but aimed at friends, classmates and colleagues; big with school/college-age users and social sharing. For Vyotish it completes the fun-tools cluster (FLAMES, love, friendship) that funnels casual users toward the serious calculators.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| name A | required | text, Latin letters | 1–40 chars | — | first friend's name (drives letter counts) |
| name B | required | text, Latin letters | 1–40 chars | — | second friend's name |

No birthdays in v1 (some competitors accept them; optional future field). First names are the casual norm.

### Recommended input set
Two names only, one screen, shareable result — same UX contract as the Love Calculator so the two tools share code (only the keyword differs).

### Current Vyotish input set
`GET /calculators/friendship?a&b` — two names; **UI bug: sends `name=` instead of `a=`** (shared with name-compatibility/love/flames).

## 3. Formula(s) / method

**No standard formula exists.** What competitors actually do (documented observations):
- Generic friendship-calculator sites (e.g., sorrycard.app-style): two names → percentage, method undisclosed, with commentary that a "real friend test" doesn't exist.
- The paper-game family: write both names with a keyword between them (LOVES, FRIEND…), count keyword-letter occurrences, fold the digit row to a percentage — the same trick documented for the love percentage, with **FRIEND** as the friendship variant; FLAMES-style cancellation is the verdict-based cousin (see `flames.md`).

### 3.1 RECOMMENDED — the documented "FRIEND triangle" game (our entertainment convention)
Identical deterministic machinery to the Love Calculator's LOVES game, with the keyword **FRIEND** (6 letters — the row starts one digit longer, giving the tool its own feel and results):
1. `S = (nameA + nameB)`, lowercased, letters only.
2. Count occurrences of **F, R, I, E, N, D** in `S` → six counts; count ≥ 10 → digital root (our convention).
3. Row 0 = `[c_F, c_R, c_I, c_E, c_N, c_D]` (6 digit entries).
4. **Fold:** row → adjacent-pair sums; a two-digit sum is written as its two digits (11 → digits 1, 1).
5. Repeat while the row has more than 2 digits (carries hold length but strictly reduce digit-sum, so termination at exactly 2 digits is guaranteed).
6. Score = `10×d1 + d2` (0–99), displayed as `N%`.
Show the counts line and every fold row — the show-your-work differentiator.

### 3.2 Bands (our documented entertainment convention — not from any source)
| Score | Band | Copy tone |
|---|---|---|
| 0–24 | "Acquaintances (in this game)" | playful |
| 25–49 | "Good company" | warm |
| 50–74 | "Solid squad" | upbeat |
| 75–99 | "Best-friend material" | celebratory |
Persistent disclaimer: "A name-and-keyword game — real friendship isn't a percentage."

**Variants (documented, not recommended):** LOVES-keyword reuse for friendship (dilutes the two tools), outer-digit folding, black-box percentages, first-letters-only "bond test" gimmicks. Choosing FRIEND-keyword keeps love/friendship results visibly different for the same pair and matches the documented paper tradition.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal: "SANJAY" + "PRIYA"
- Combined letters: s,a,n,j,a,y,p,r,i,y,a. FRIEND counts: F=0, R=1, I=1, E=0, N=1, D=0 → row `0 1 1 0 1 0`.
- Fold 1: (0+1)(1+1)(1+0)(0+1)(1+0) → `1 2 1 1 1`
- Fold 2: (1+2)(2+1)(1+1)(1+1) → `3 3 2 2`
- Fold 3: (3+3)(3+2)(2+2) → `6 5 4`
- Fold 4: (6+5)(5+4) → 11 splits → `1 1 9`
- Fold 5: (1+1)(1+9) → 10 splits → `2 1 0`
- Fold 6: (2+1)(1+0) → `3 1` → stop → **31%**, band "Good company".
- Note: 31% friendship vs 1% love for the same pair — the two tools visibly differ, as intended.

### Example 2 — carry-heavy: "PRIYA" + "PRIYA" (identical names)
- Counts: F=0, R=2, I=2, E=0, N=0, D=0 → row `0 2 2 0 0 0`.
- Folds: `2 4 2 0 0` → `6 6 2 0` → `1 2 8 2` (12 splits) → `3 1 0 1 0` (two 10s split) → `4 1 1 1` → `5 2 2` → `7 4` → stop → **74%**, band "Solid squad".
- Demonstrates that carry rows keep the row length at 4–5 temporarily yet still terminate — good stress-test vector.

### Example 3 — edge: no keyword letters at all: "BOB" + "TIM"
- Combined b,o,b,t,i,m: F,R,I,E,N,D all absent (I is present! — check: TIM contains I → c_I = 1). Corrected counts: F=0, R=0, I=1, E=0, N=0, D=0 → row `0 0 1 0 0 0`.
- Folds: `0 1 1 0 0` → `1 2 1 0` → `3 3 1` → `6 4` → stop → **64%**.
- True all-zero pair example: "BOB" + "AMY" (no F,R,I,E,N,D letters) → row `0 0 0 0 0 0` → folds collapse to `0 0` → **0%** (documented all-zero rule).

### Example 4 — boundary: "SAM" + "DEAN"
- Combined s,a,m,d,e,a,n: E=1, N=1, D=1, others 0 → row `0 0 0 1 1 1`.
- Folds: `0 0 1 2 2` → `0 1 3 4` → `1 4 7` → `5 1 1` (11 splits) → `6 2` → stop → **62%**.
- Score bounds note: final row is always exactly 2 digits → score ∈ [0, 99]; a genuine 100% is impossible under the game — never fake it.

## 5. Complete output list

A GOOD friendship calculator shows:
1. **Percentage** (big, shareable).
2. **Band** + one-line meaning, friendly tone.
3. **Method breakdown**: FRIEND counts line + every fold row (transparency differentiator).
4. **Both names echoed** with the combined string used.
5. `for_fun: true` + entertainment disclaimer.
6. Cross-links: "try FLAMES for a verdict" and "try Love Calculator".
7. Nice-to-have: share URL, group/friend-list mode (rank multiple friends by score — no competitor does this cleanly).

**Comparison vs competitors**
- sorrycard.app-style friendship calculators: names → percentage with commentary; method undisclosed; disclaimer quality varies.
- Love-calculator clones reusing the LOVES keyword for friendship: results mirror the love tool — confusing; Vyotish's FRIEND keyword keeps them distinct.
- FLAMES sites: verdict (Friends/Enemy…) rather than a percentage — adjacent but a different product; cross-link rather than duplicate.

### Current Vyotish outputs
`GET /calculators/friendship?a&b` → same shape as love (`score = clamp(40 + digitalRoot(rootA + rootB) × 5, 55, 95)`, `band`, `note`, `for_fun:true`) with the band index shifted by 2; page `/calculators/friendship` (UI posts `name=` instead of `a=` — broken).

### Initial gap list
1. **UI param bug** (`name=` vs `a=`) — page dead until fixed.
2. **Clamped score range 55–85 in practice** — no memorable 0s/90s; the FRIEND game spans 0–99 and is deterministic.
3. **Bands undocumented**; band index "shifted by 2" is invisible to users and not tied to any convention.
4. **No method disclosure or work-shown breakdown** — the love/friendship pair currently differ only by an internal offset; users can't see why scores differ.
5. No disclaimer copy beyond `for_fun:true`; no share/UX affordances.
6. Numerology roots used silently — same recommendation as love: use the documented game here, leave numerology to name-compatibility.

## 6. Edge cases and validation rules

1. **Empty/whitespace names, >40 chars** → 400 with friendly message.
2. **Case/punctuation**: casefold; strip non-letters; "Priya" ≡ "PRIYA"; hyphenated names sum both parts.
3. **All-zero counts** → 0% (defined; Example 3's BOB+AMY).
4. **Count ≥ 10** → digital root (documented; keeps rows one digit per keyword letter).
5. **Carry rows** guaranteed to terminate (digit-sum strictly decreases on carries; length strictly decreases otherwise); safety cap on fold count (e.g., 50) with loud failure if exceeded.
6. **Score bounds** 0–99; document that 100 is unreachable (honesty rule).
7. **Determinism**: golden-vector tests; no randomness or time dependence.
8. **Identical names** valid (Example 2 → 74%); **single-letter names** valid.
9. **Non-Latin scripts** → polite rejection (transliteration future work).
10. **Distinctness from love tool**: regression check that SANJAY+PRIYA gives 1% (love/LOVES) and 31% (friendship/FRIEND) — guards against keyword mix-ups.
11. **`for_fun:true`** stays in the API contract; disclaimer above the fold.

## 7. Sources

- calculator.net — Love Calculator page framing (amusement-only disclaimer applicable to the whole genre): https://www.calculator.net/love-calculator.html
- Paper-method documentation ("count occurrences of letters in a keyword like FRIEND or LOVES between two names, tally, add/reduce digits, convert to a percentage by hand"): "How to Calculate Love Percentage by Name on Paper" walkthroughs found via WebSearch aggregation (wikiHow-style guides; Brit + Co paper love-calculator guide)
- Friendship calculator genre reference (names → percentage, undisclosed method): sorrycard.app friendship calculator (https://sorrycard.app — friendship calculator page, found via WebSearch)
- FLAMES as the verdict-based cousin of the same game family: see sibling file `flames.md` (this directory)
- LOVES-triangle fold mechanics documentation (adjacent-pair sums, 8+4=12 → write 1,2): LADbible nostalgia video https://www.facebook.com/LADbible/videos/178212365318080
