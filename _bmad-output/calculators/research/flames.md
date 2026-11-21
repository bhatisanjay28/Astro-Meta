# FLAMES Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Positioning: **pure schoolyard game** (Friends / Love / Affection / Marriage / Enemy / Sibling) — no astrology content, maximum fun and shareability.

## 1. Purpose and who uses it

FLAMES is the classic pen-and-paper name game played by school kids (especially across India) to "predict" the relationship between two people: **F**riends, **L**ove, **A**ffection, **M**arriage, **E**nemy, **S**ibling. The calculator automates it. Wikipedia documents it as a "relationship status" game with a Josephus-problem-style elimination; it has zero scientific or astrological content and is sold purely as nostalgia/fun. Users: students, social sharers, nostalgia traffic — the cheapest, most viral tool in Vyotish's fun cluster.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| name A | required | text, Latin letters (case-insensitive) | 1–40 chars | — | first player's name |
| name B | required | text, Latin letters (case-insensitive) | 1–40 chars | — | second player's name |

Spaces and punctuation are stripped before matching (the paper game writes full names; letter matching is per-letter). Case-insensitive — the game is played on letters, not capitals.

### Recommended input set
Two names, nothing else. Optionally encourage full names ("try nicknames too — results differ!") which competitors like theflames.app explicitly suggest as a fun feature.

### Current Vyotish input set
`GET /calculators/flames?a&b` — two names; **UI bug: sends `name=` instead of `a=`** (shared bug across all four name tools), so the live page cannot produce a result.

## 3. Formula(s) / method

### 3.1 Standard algorithm (Wikipedia-documented; RECOMMENDED)
1. Normalize both names: lowercase, keep letters only.
2. **Cross out common letters one-to-one**: for each letter value, cancel `min(count_in_A, count_in_B)` occurrences from each name (multiset intersection). Wikipedia's own example does exactly this and separately notes the "cross ALL occurrences" play-style variant (see 3.3).
3. Let `n` = total letters remaining in both names combined.
4. Write the word **FLAMES** as a 6-letter cycle: F=Friends, L=Love, A=Affection, M=Marriage, E=Enemies, S=Siblings.
5. Starting at F and counting **the current letter as 1**, count n letters cyclically; cross out the nth letter; the next count starts from the letter **after** the one crossed.
6. Repeat until one letter remains — that letter is the result. In code: `idx = (start + n − 1) mod len; remove(idx); start = idx mod (len − 1)`.

### 3.2 Outcomes (fixed, exactly 6)
F → **Friends**, L → **Love**, A → **Affection**, M → **Marriage**, E → **Enemy**, S → **Sibling**. (Wikipedia expands Affection as "Affectionate" and Sibling as "Siblings"; Vyotish uses the short forms above consistently.)

### 3.3 Variants (documented, fork matters)
- **Crossing convention:** (a) one-to-one (Wikipedia's example; recommended — deterministic and symmetric) vs (b) cross ALL occurrences of any common letter in both names. They change `n` and therefore the result — see worked example 1 vs 2.
- **Counting convention:** (a) count the starting letter as 1 (Wikipedia: "cross out the nth letter") vs (b) skip-style `idx = (start + n) mod len`. Convention (a) is the documented standard; (b) shifts every elimination by one and changes results.
- **Case sensitivity:** no source mentions case — the paper game is inherently case-insensitive (recommend: lowercase).
- **n = 0** (all letters cancel, e.g., identical names): **UNVERIFIED — no source defines it.** Our documented convention: show a special "Perfect match — every letter cancelled!" state in the UI and map to result **Friends** in the API with an explanatory note, preserving the 6-outcome contract.

### 3.4 RECOMMENDATION
One-to-one cancellation (Wikipedia's example), count-starts-as-1 (Wikipedia's text), lowercase letters-only normalization, n=0 → Friends + note. Expose the full trace in the UI — the fun of FLAMES is watching letters disappear, and no major competitor shows the elimination round-by-round.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal: "SANJAY" + "PRIYA" (one-to-one, the recommended method)
- Letters: SANJAY = {s,a,n,j,a,y}, PRIYA = {p,r,i,y,a}. Common (multiset): a×1, y×1 → cross one A and one Y.
- Remaining: SANJAY → **S, N, J, A** (4); PRIYA → **P, R, I** (3). `n = 7`.
- Elimination on FLAMES, counting current letter as 1 each round:
  - Round 1 (len 6): F1 L2 A3 M4 E5 S6 F7 → cross **F**. Remaining L A M E S; next start L.
  - Round 2 (len 5): L1 A2 M3 E4 S5 L6 A7 → cross **A**. Remaining L M E S; next start M.
  - Round 3 (len 4): M1 E2 S3 L4 M5 E6 S7 → cross **S**. Remaining L M E; next start L.
  - Round 4 (len 3): L1 M2 E3 L4 M5 E6 L7 → cross **L**. Remaining M E; next start M.
  - Round 5 (len 2): M1 E2 M3 E4 M5 E6 M7 → cross **M**. Remaining **E**.
- **Result: Enemy** — `letters_removed = [A, Y]`, `remaining_count = 7`, elimination order [F, A, S, L, M].
- (Yes, the game says "Enemy" for this pair — a perfect demo that FLAMES is a game, not a verdict; the UI copy must stay playful.)

### Example 2 — variant fork: same names under "cross ALL occurrences"
- Common letters a and y crossed everywhere: SANJAY → **S, N, J** (3); PRIYA → **P, R, I** (3). `n = 6`.
- Elimination: Round 1: F1 L2 A3 M4 E5 S6 → cross **S**; Round 2 (F L A M E): F1 L2 A3 M4 E5 F6 → cross **F**; Round 3 (L A M E): L1 A2 M3 E4 L5 A6 → cross **A**; Round 4 (L M E): M1 E2 L3 M4 E5 L6 → cross **L**; Round 5 (M E): M1 E2 M3 E4 M5 E6 → cross **E**; remaining **M** → **Marriage**.
- One-to-one says Enemy, cross-all says Marriage — both documented; Vyotish must state which it uses (recommendation: one-to-one) and may offer a "show other variant" toggle as a fun extra.

### Example 3 — zero common letters: "BOB" + "MARCUS"
- Common: none → remaining = 3 + 6 = 8.
- Elimination (n=8): Round 1: F1 L2 A3 M4 E5 S6 F7 L8 → cross **L**; remaining F A M E S, start A. Round 2: A1 M2 E3 S4 F5 A6 M7 E8 → cross **E**; remaining F A M S, start S. Round 3: S1 F2 A3 M4 S5 F6 A7 M8 → cross **M**; remaining F A S, start S. Round 4: S1 F2 A3 S4 F5 A6 S7 F8 → cross **F**; remaining A S, start A. Round 5: A1 S2 A3 S4 A5 S6 A7 S8 → cross **S**; remaining **A** → **Affection**.
- (Index-method cross-check: idx1=(0+7)mod6=1→L ✓; idx2=(1+7)mod5=3→E ✓; idx3=(3+7)mod4=2→M ✓; idx4=(2+7)mod3=0→F ✓; idx5=(0+7)mod2=1→S ✓ → A.)

### Example 4 — edge/boundary: identical names and n=1
- "PRIYA" + "PRIYA": every letter cancels one-to-one → remaining 0 → `n = 0` → special state "Perfect match — every letter cancelled!" with API result **Friends** + note (our documented convention; UNVERIFIED against tradition since no source defines n=0).
- "priya" + "PRIYA": identical after lowercasing → same as above (case-insensitivity test).
- n=1 boundary: "AB" + "ABC" → common A,B → remaining: 0 + C → `n = 1` → Round 1: F1 → cross **F** → remaining A M E S, and one letter always falls out per round: [A,M,E,S] → n=1 each round removes the current start letter: F, then A, M, E → **S = Sibling**. (Trace: R1 F1→F; R2 A1→A; R3 M1→M; R4 E1→E; R5 S1→S.) Deterministic: n=1 always → Sibling.
- Space/punctuation: "SAN JAY" vs "SANJAY" → identical after stripping → n=0 case.

## 5. Complete output list

A GOOD FLAMES calculator shows:
1. **Result** (one of the 6) with a bold, shareable visual.
2. **Fun explanation** per outcome (2–3 sentences, playful tone — e.g., Enemy: "The letters conspired — blame the game, not each other!").
3. **The trace**: names used (normalized), which letters were crossed out, remaining letters and count `n`, and the elimination order of FLAMES letters round by round.
4. **Variant statement** ("we cross common letters one-to-one, case-insensitive").
5. `for_fun: true` + one-line disclaimer ("a schoolyard game — for laughs only").
6. Nice-to-have: replay with nicknames, share URL, "the other variant says …" toggle (fun for n-variant divergence like Example 1 vs 2).

**Comparison vs competitors**
- Wikipedia's documented example (ROHAN + LENNA → Marriage): the reference trace for our own engine; its "6th letter S, then F, A, L, E, → M" sequence is our regression vector.
- theflames.app: step-by-step guide with worked examples; suggests trying full names vs nicknames (good engagement idea).
- GitHub FLAMES implementations (e.g., amruthpillai/FlamesAlgorithm-C): cross-out-common + cyclic elimination; implementations differ on the counting convention — hence our need to document ours.
- Generic FLAMES sites: show only the final letter — Vyotish's round-by-round trace is the differentiator.

### Current Vyotish outputs
`GET /calculators/flames?a&b` → `{result, letters_removed, for_fun:true}`; page `/calculators/flames` (UI posts `name=` instead of `a=` — broken).

### Initial gap list
1. **UI param bug** (`name=` vs `a=`) — page dead until fixed.
2. **No elimination trace** in output (only `letters_removed` — which letters cancelled — no `remaining_count`, no round-by-round FLAMES elimination order).
3. **Variant/case conventions undocumented**: one-to-one vs cross-all not stated; case-insensitivity not stated; `n=0` (identical names) behavior undefined.
4. **No per-outcome fun explanations** and no disclaimer copy; result arrives bare.
5. No normalization spec (spaces/punctuation) — silently ambiguous behavior.
6. No share/replay affordances (category expectation).

## 6. Edge cases and validation rules

1. **Normalization:** lowercase; strip all non-letters (spaces, hyphens, apostrophes) before cancellation; "Sanjay" ≡ "sanjay".
2. **One-to-one cancellation** uses multiset intersection — never cancel more of a letter than the *smaller* count (ROHAN+LENNA crosses exactly one A and one N even though LENNA has two Ns).
3. **n = 0** → special "perfect match" UI state, API result Friends + note (documented convention; UNVERIFIED vs tradition).
4. **n bounds:** 1 ≤ n ≤ 80 for valid 40-char names; n=1 always → Sibling (regression test), n=6 → Marriage (Wikipedia's ROHAN+LENNA vector), n=7 → Enemy (Example 1 vector).
5. **Determinism:** pure function of the two normalized names; golden-vector suite (Examples 1–4 + Wikipedia's example).
6. **Empty/whitespace-only/too-long names** → 400 friendly error.
7. **Non-Latin scripts** → polite rejection (transliteration future work).
8. **Counting convention guard:** assert round-1 elimination for n=6 is **S** (not L) — protects against the skip-style variant slipping in.
9. **Outcome integrity:** result always ∈ the fixed 6; special n=0 handled outside the enum with its own UI state.
10. **`for_fun:true`** stays in the API contract.

## 7. Sources

- Wikipedia — FLAMES (game): rules, one-to-one vs all-occurrence crossing variants, exact worked example ROHAN + LENNA (n=6: S, F, A, L, E eliminated → M = Marriage): https://en.wikipedia.org/wiki/FLAMES_(game)
- theflames.app — How to Play FLAMES (step-by-step rules, worked examples, nickname-suggestion feature): https://theflames.app/how-it-works
- GitHub — amruthpillai/FlamesAlgorithm-C (implementation of cross-out-common + cyclic elimination; demonstrates the coding convention `n mod remaining`): https://github.com/AmruthPillai/FlamesAlgorithm-C
- "The FLAMES Algorithm" paper (2005) — algorithm write-up referenced in WebSearch results (5-page description of cross-out/count/eliminate procedure)
- Josephus-problem connection (cyclic elimination structure): as described in the Wikipedia FLAMES article above.
