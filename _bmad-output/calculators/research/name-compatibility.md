# Name Compatibility Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Positioning: **semi-fun** tool grounded in real numerology (not a pure gag like FLAMES), clearly labelled "for fun" in the UI.

## 1. Purpose and who uses it

Compares two people's **name numbers** and reports how well their "name vibrations" get along. Unlike the pure-entertainment love/friendship/FLAMES tools, this one can be honestly grounded in published numerology: each name reduces to a number (1–9) whose **planet lord** (Sun, Moon, Jupiter, Rahu, Mercury, Venus, Ketu, Saturn, Mars) has traditional friend/enemy/neutral relationships with the other person's lord. Users: couples checking a prospective match, friends, business partners choosing names, and numerology-curious users — the Indian audience knows this as **Namank** (name number) comparison, which AstroSage publishes a dedicated calculator for.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| name A | required | text, Latin letters (strip spaces/punctuation for summing) | 1–60 chars | — | first person's name root |
| name B | required | text, Latin letters | 1–60 chars | — | second person's name root |
| system | optional (advanced) | enum: `chaldean` (default), `pythagorean`, `both` | — | Chaldean (Indian audience standard) | the two schools assign letters differently and can disagree; showing both is honest |
| birthdays | optional (future feature) | ISO dates | — | — | serious numerology compat checks DOB numbers too (NameVibrations runs 12 checks incl. DOB); v1 can stay name-only |

Full names are recommended (numerology schools use the full birth name; first-name-only is the casual variant). Case-insensitive; only A–Z letters count.

### Recommended input set
Two **full names** (encourage via placeholder "Enter full name for better accuracy") + advanced system selector (Chaldean default; "both" shown). Optional birthdays field clearly marked as "coming soon" or included from day one since the numerology logic is identical.

### Current Vyotish input set
`GET /calculators/name-compatibility?a&b` — two names only, no system choice, no DOB. **UI bug: the form sends `name=` instead of `a=`** (same bug on love/friendship/flames), so the endpoint receives nothing and the page is effectively broken.

## 3. Formula(s) / method

### 3.1 Letter-to-number charts (both schools, published)

**Chaldean** (values 1–8; no letter is assigned 9, considered sacred; groups letters by sound):

| Value | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Letters | A, I, J, Q, Y | B, K, R | C, G, L, S | D, M, T | E, H, N, X | U, V, W | O, Z | F, P |

**Pythagorean** (values 1–9, sequential):

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| A J S | B K T | C L U | D M V | E N W | F O X | G P Y | H Q Z | I R |

### 3.2 Name root (name number / Namank)
`root = digital_root(Σ letter_values)` where `digital_root(n) = 1 + (n−1) mod 9` for n ≥ 1 (keep the compound total too — Chaldean practice reads the compound number's meaning; display it as secondary). Master numbers 11/22/33 (Pythagorean school) — for compatibility mapping, reduce to 2/4/6 for the planet-lord comparison but display "11 (reduced to 2 for pairing)" so the school's convention stays visible. Strip all non-letter characters; case-insensitive.

### 3.3 Planet lords (Vedic/Chaldean numerology, standard mapping)
1 = Sun, 2 = Moon, 3 = Jupiter, 4 = Rahu, 5 = Mercury, 6 = Venus, 7 = Ketu, 8 = Saturn, 9 = Mars.

### 3.4 Compatibility verdict — the Chaldean friend/enemy/neutral matrix
The traditionally cited scheme (planet-friendship based; multiple published versions agree on the core pairs; label the table "traditional Chaldean numerology teaching"):

| Root | Friendly | Enemy | Neutral |
|---|---|---|---|
| 1 (Sun) | 1, 2, 3, 5, 6, 9 | 8 | 4, 7 |
| 2 (Moon) | 1, 3, 5 | 4, 8, 9 | 2, 6, 7 |
| 3 (Jupiter) | 1, 2, 3, 5, 7 | 6 | 4, 8, 9 |
| 4 (Rahu) | 1, 5, 6, 7 | 2 | 3, 4, 8, 9 |
| 5 (Mercury) | 1, 2, 3, 4, 5, 6, 7, 8, 9 | — | — |
| 6 (Venus) | 1, 4, 5, 7 | 3 | 2, 6, 8, 9 |
| 7 (Ketu) | 1, 3, 4, 5, 6 | 2, 9 | 7, 8 |
| 8 (Saturn) | 5, 6 | 1, 2 | 3, 4, 7, 8, 9 |
| 9 (Mars) | 1, 5 | 2, 4, 8 | 3, 6, 7, 9 |

(5 is the universal friend; symmetric-reading caveat: the matrix is row-defined — for pair (a, b) read row a. If row a says friendly and row b says enemy, the pair is mixed; see RECOMMENDATION below.)

### 3.5 RECOMMENDATION — one documented, deterministic method (our convention, labelled entertainment)
1. Compute `a_root`, `b_root` (Chaldean default; Pythagorean shown when "both" mode). Display compound total + digital root + planet lord for each.
2. `combined_root = digital_root(a_root + b_root)` with its planet lord (the "relationship number") — matches Vyotish's existing `combined_root` field.
3. Verdict from row(a_root) → column b_root:
   - b friendly to a **and** a friendly to b → band **"Harmonious"**
   - same root (a = b) → band **"Same vibration"** (special case: strongest per tradition)
   - one-directional friendly / mixed → band **"Neutral"** with explanation "one side adapts more"
   - either direction enemy → band **"Challenging"** with a gentle, non-scary explanation ("traditional numerology calls these lords unfriendly — every pairing has strengths; this is for fun")
4. Never output a scary or absolute verdict; the page carries a persistent "For entertainment — real relationships aren't decided by letters" note.
5. In "both" mode show the Chaldean and Pythagorean verdicts side by side when they differ (they can — see example 1) with one-line method notes. This honesty is the differentiator vs gag-name-compat sites.

**Variants in the wild (documented, not recommended):** alphabetical-position sums (A=1…Z=26), letter-overlap scoring, single-direction matrix reads, love-percentage wrappers (those belong to the love/friendship tools, not this one).

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal/system-divergent: "SANJAY" + "PRIYA"
- **Chaldean:** SANJAY = S3+A1+N5+J1+A1+Y1 = 12 → root **3 (Jupiter)**. PRIYA = P8+R2+I1+Y1+A1 = 13 → root **4 (Rahu)**. Row 3, column 4 → **Neutral** → band **Neutral** ("Jupiter adapts more; Rahu stays independent" — Jupiter's row lists 4 neutral).
- **Pythagorean:** SANJAY = S1+A1+N5+J1+A1+Y7 = 16 → root **7 (Ketu)**. PRIYA = P7+R9+I9+Y7+A1 = 33 → master → reduced **6 (Venus)**. Row 7, column 6 → friendly both ways (7 lists 6; 6 lists 7) → band **Harmonious**.
- Output must show both when mode = both: Chaldean Neutral, Pythagorean Harmonious, with each school's letter math displayed (this doubles as the transparency feature).
- combined_root (Chaldean) = digital_root(3+4) = 7 (Ketu); (Pythagorean) = digital_root(7+6) = 4 (Rahu).

### Example 2 — edge: identical names "PRIYA" + "PRIYA"
- Chaldean: 13 → root 4 both sides → same root → band **Same vibration**. combined_root = digital_root(4+4) = 8 (Saturn) — worth surfacing ("same names resonate, but the combined tone is Saturn's discipline").
- Zero-letter-difference trivially reduces both roots; also our "no common letters needed" counterexample vs FLAMES (letter overlap plays NO role here — roots can match with zero shared letters).

### Example 3 — enemy boundary: "SANJAY" + "GUV" (Chaldean)
- SANJAY = 12 → 3 (Jupiter). GUV = G3+U6+V6 = 15 → 6 (Venus). Row 3 enemy {6} → band **Challenging**. Reverse read: row 6 enemy {3} — enemy both directions; output must still be gentle in tone.
- Friendly companion case: "SANJAY" + "HEN": HEN = H5+E5+N5 = 15 → 5 (Mercury). Row 3 friendly {5}; row 5 friendly {3} → band **Harmonious**; combined_root = digital_root(3+5) = 8.

### Example 4 — boundary inputs
- "Maria-Anne" + "O'Brien": hyphen/apostrophe stripped → "MARIAANNE" (M4+A1+R2+I1+A1+A1+N5+N5+E5 = 25 → 7) vs "OBRIEN" (O7+B2+R2+I1+E5+N5 = 22 → master/4) — test punctuation stripping.
- "" (empty) → 400 validation error; "A" + "B" (single letters) → roots 1 and 2, valid.

## 5. Complete output list

A GOOD name-compatibility calculator shows:
1. **Both roots**: compound number + digital root + planet lord each (e.g., "Priya: 13 → 4 · Rahu").
2. **Verdict band** from the documented matrix (Harmonious / Same vibration / Neutral / Challenging) + 2–4 sentence plain-language explanation naming the planets involved.
3. **Combined root** ("relationship number") + its lord + one line of meaning.
4. **The letter math** (expandable table: each letter → value) — transparency no gag competitor offers.
5. **System selector + both-system results** when they differ.
6. `for_fun: true` + persistent entertainment disclaimer.
7. Nice-to-have: DOB-numbers add-on (birth/destiny number cross-checks — NameVibrations' 12-check pattern).

**Comparison vs competitors**
- AstroSage (astrosage.com/numerology/namecompatibility.asp): frames it as Namank comparison — adds all letters, reduces, compares; Indian-audience vocabulary ("Namank", planet lords). Vyotish's Chaldean default matches this expectation.
- NameVibrations (namevibrations.com/love-compatibility-by-name): runs **12 checks** — 4 DOB-based (birth & destiny numbers in combinations) + 4 Chaldean name-based — far deeper than a single number pair; shows where the category is heading.
- Generic name-compat gag sites: percentage from letter overlap/alphabet sums with no method shown — Vyotish should visibly differentiate by showing the math.

### Current Vyotish outputs
`GET /calculators/name-compatibility?a&b` → `{a_root, b_root, combined_root, band, note, for_fun:true}` with bands {Warm, Bright, Harmonious, Playful, Steady}; page `/calculators/name-compatibility` (UI currently **broken**: posts `name=` instead of `a=`).

### Initial gap list
1. **UI param bug** (`name=` vs `a=`) — tool effectively dead until fixed (shared bug across name/love/friendship/flames).
2. **Bands are invented** {Warm, Bright, Harmonious, Playful, Steady} — not from any numerology tradition, not deterministic w.r.t. the standard matrix; replace with matrix-grounded bands (Harmonious / Same vibration / Neutral / Challenging).
3. **No planet lords** displayed — the core of the traditional method.
4. **No system choice** (Chaldean vs Pythagorean) and no statement of which chart is used — users can't reproduce or verify.
5. **No letter-math transparency** and no compound-number display (Chaldean practice reads compound numbers).
6. No entertainment disclaimer copy in output; `note` field exists but band meanings are undocumented.
7. Master numbers (11/22/33) handling undocumented; non-Latin-script input behavior undefined.

## 6. Edge cases and validation rules

1. **Normalization:** trim, casefold, strip all non A–Z letters before summing; identical results for "priya" vs "PRIYA".
2. **Empty / whitespace-only / >60 chars** → 400 with friendly message (both fields required).
3. **Non-Latin scripts (Devanagari names)** → v1: reject with "Please enter names in English letters" (transliteration is a future feature; do NOT silently sum 0).
4. **Master numbers:** Pythagorean totals 11/22/33 → display master, reduce to 2/4/6 for planet mapping, and state the reduction in output (`reduced_from: 33`).
5. **Matrix symmetry:** verdict computed as both-direction read; document the rule (enemy-in-either-direction ⇒ Challenging; friendly-both ⇒ Harmonious; mixed ⇒ Neutral; equal roots ⇒ Same vibration regardless of matrix).
6. **Compound number display:** never lose the pre-reduction total (13 vs 4 — Chaldean meaning differs).
7. **Determinism:** same inputs always yield the same bands (no randomization anywhere — contrast with love/friendship gag tools if they ever add jitter; they must not).
8. **Single-letter names** valid (root = that letter's value); extremely long names capped at 60 letters.
9. **`for_fun:true`** must stay in the API contract; UI shows disclaimer above the result, not below the fold.

## 7. Sources

- Chaldean letter chart (1–8, no 9; sound grouping): https://swarnsiddhi.com/blog/chaldean-numerology-table
- Pythagorean chart + Expression/Destiny number calculation (sum letters, reduce, keep 11/22/33): https://www.astronumero.org/numerology-charts and https://numerologychart.com
- Chaldean vs Pythagorean chart comparison (J=1/S=6 Chaldean vs J=1/S=1 Pythagorean): https://www.astronumero.org/numerology-charts
- Planet lords 1–9 (Sun, Moon, Jupiter, Rahu, Mercury, Venus, Ketu, Saturn, Mars) + friendly-number basis in planetary friendship: WebSearch aggregation of Chaldean numerology references (e.g., Swarnsiddhi table page; standard Cheiro-lineage teaching)
- Friendly/enemy/neutral matrix 1–9 (commonly cited scheme; treat table values as traditional teaching, not physics): https://www.quora.com/What-are-friendly-numbers-and-enemy-numbers-to-each-number-in-numerology ; https://www.scribd.com/document/893028911/Numerology-for-Divine-Pregnancy-and-Conception ; https://medium.com/@punneetpsychology/numerology-compatibility-for-better-relationships-1f26cd0b2b03
- AstroSage — Name Compatibility (Namank framing): https://www.astrosage.com/numerology/namecompatibility.asp
- NameVibrations — 12-check compatibility (4 DOB + 4 Chaldean name checks): https://namevibrations.com/love-compatibility-by-name
