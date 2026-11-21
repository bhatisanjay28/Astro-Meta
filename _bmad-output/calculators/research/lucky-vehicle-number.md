# Lucky Vehicle Number — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it
Vehicle Number Numerology judges whether a vehicle registration plate (car, bike, commercial vehicle) is favourable for its owner: the plate's value (digits, and in one school letters via Chaldean) is reduced to a root number and compared with the owner's Mulank/Bhagyank. Users: anyone buying a new vehicle and choosing among available registration numbers at the RTO, buyers paying for VIP/fancy plates (e.g. 0001, 0786, repeating digits), used-vehicle buyers checking an existing plate, and sellers marketing "lucky" plates. Practitioner marketing claims safety benefits (avoid accidents, attract prosperity — free vehicle-numerology calculators); the tool must therefore carry a strong disclaimer. It is also a natural upsell: Numerology by Nehaa sells ₹1000 consultations for plate selection plus auspicious delivery date/time.

## 2. Inputs
| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Vehicle registration string | required | full plate as printed, e.g. `MH 12 AB 4321`; letters A–Z + digits; spaces/hyphens tolerated | 2–15 characters after stripping; state code + RTO + series + number | none | The object being judged. Owner directive: FULL registration string, because schools differ on which parts count (digits-only vs letters+digits) — the tool must receive everything and apply the chosen school. |
| Owner's date of birth | required | date DD/MM/YYYY | 1900–today | none | Source of Mulank (root of day) and Bhagyank (root of full DOB) — both NameVibrations and Numerology-by-Nehaa require it; a plate cannot be judged without the owner. |
| Vehicle type | optional | enum (car/bike/commercial) | — | unset | Not used in any formula found; competitors use it only for copy. Skip for v1. |
| Purchase date | optional | date | — | none | Nehaa's premium service picks an auspicious delivery date/time; optional v2 remedial feature. |

### Recommended input set
Full registration string (mandatory) + owner DOB (mandatory). The owner directive is explicit: FULL registration string + owner's birth number. Optionally pre-fill DOB from the logged-in user's profile.

### Current Vyotish input set
`GET /calculators/vehicle-number?date` — takes ONLY the owner's birth date. There is NO vehicle-number input at all; it outputs which vehicle roots are friendly for the owner (mulank, lord, friendly_numbers, neutral_numbers, note, verified:false). It is a "lucky numbers for vehicles" reference table, not a plate analyser — the recommended tool requires the registration string as a second mandatory input.

## 3. Formula(s) / method
### 3.1 Plate value — the two schools
- **School A (digits-only, unique number portion):** sum ONLY the digits of the registration's number portion (exclude state code, RTO code, and series letters). Numerology-by-Nehaa: "DL 1AB 2345" → unique number 2345 → 2+3+4+5 = 14 → **5**. Letters and state/RTO codes excluded; no letter chart used.
- **School B (full string, Chaldean letters):** convert EVERY letter on the plate with the Chaldean chart (AIJQY=1, BKR=2, CGLS=3, DMT=4, EHNX=5, UVW=6, OZ=7, FP=8 — same table as name numerology) and add them to all digits. NameVibrations walkthrough: "DL 03 XB 1234" → DL = D4+L3 = 7, XB = X5+B2 = 7 → letters 14; digits 0+3+1+2+3+4 = 13 → 4; grand total 27 → **9**; the pure-digit total 13→4 (well, 10→1 including all digits: see §4 example 2) is also reported. NameVibrations additionally computes a Pythagorean letter value for a dual-chart verdict.
- **RECOMMENDATION:** Ship School A (digits-only of the unique number portion) as the PRIMARY result — it matches the dominant Indian practitioner method (Nehaa, JC Chaudhry framing) and is deterministic. Show School B (full-string Chaldean) as a secondary "letter vibration" line for completeness. State the school choice in the UI.

### 3.2 Reduction and compatibility
- `plate_root = digital_root(plate_value)`.
- Owner: `mulank = digital_root(day)`, `bhagyank = digital_root(DDMMYYYY sum)`.
- Verdict: plate_root compared to mulank AND bhagyank via the friend/neutral/enemy matrix (vedic-numerology.md §3.5). NameVibrations verdict ladder (dual-chart): both Chaldean & Pythagorean friendly → "amazing"; both unfriendly → "worst"; only Chaldean friendly → "good"; only Pythagorean → "low". Nehaa: plate total must be a lucky number for the person AND friendly with BOTH Main Planet (mulank) and Life Path (bhagyank).
- Per-mulank lucky lists (JC Chaudhry school): mulank 4 → good plate roots 1,2,5,6,7,9, avoid 3,4,8; mulank 9 → good 1,3,5,6,9, avoid 2,4,8. General: 5 and 6 considered best plate numbers (6 Venus "exceptionally harmonious for vehicles, comfort, peaceful commutes" — Nehaa); 8 generally worst; several practitioners advise avoiding 7/8 in plates.

### 3.3 Individual-digit clash rules (Nehaa school — overrides the total)
- A friendly TOTAL can still be NEGATIVE if an individual digit clashes with the owner's numbers: e.g. DOB 13/04/1995 + plate 2876 (total 5) is negative because digit 8 is negative for that DOB.
- Doubled pairs matter: DOB 12/02/1992 + plate 3664 (total 1) is negative because mulank 3 clashes with 6 and the "66" pair is harmful.
- RECOMMENDATION: implement total-compatibility first; add digit-clash override as a warning flag (schools differ on which digits are "negative" for which owner — derive from the owner-mulank row of the friendship matrix and mark any extra "negative digit" list as school-specific).

### 3.4 Auspicious numbers per lord (owner directive)
Lords 1–9 standard (1 Sun … 9 Mars). "Auspicious plate numbers per lord" = the owner-mulank's FRIENDLY numbers from the matrix (e.g. mulank 1 → friendly plate roots 2,3,5,9), with the universal adjustments: 6 (Venus) and 5 (Mercury) broadly favourable for vehicles; 8 (Saturn) broadly avoided; 9 (Mars) emphasised by some for vehicles (courage/protection on the road). JC Chaudhry's per-mulank avoid-lists (§3.2) are the published per-lord variant. All such lists are school-specific — render from the matrix, cite the source table in UI copy.

### 3.5 Non-formula beliefs to label as beliefs
- Increasing-order digits (e.g. 1234) required for luck: "personal belief, not numerology" (Nehaa, explicit).
- "First two digits smaller than last two" (Quora school): belief, UNVERIFIED.
- Car colour matched to the owner's vibration: remedial add-on, not part of the number formula.

## 4. Worked examples (≥3, normal / edge / boundary)
### Example 1 — normal (Nehaa's published case): plate DL 1AB 2345, owner DOB 28-09-1991
- School A: unique number 2345 → 2+3+4+5 = 14 → 1+4 = **5** (Mercury).
- Owner: mulank = 2+8 = 10 → 1 (Sun); bhagyank = 2+8+0+9+1+9+9+1 = 39 → 3+9 = 12 → 1+2 = **3** (Jupiter).
- 5 friendly to mulank 1 ✓ and bhagyank 3 ✓ (consensus: 5 friend of 1 and 3) → LUCKY. (Nehaa lists the owner's lucky numbers as 1, 3, 5, 9.)
- School B secondary: letters D,L,A,B → 4+3+1+2 = 10; digits 14; grand 24 → **6** (Venus) — also friendly to both.

### Example 2 — full-string school (NameVibrations published walkthrough): plate DL 03 XB 1234, owner Birth Number 1
- Letters (Chaldean): DL → D4+L3 = 7; XB → X5+B2 = 7; letters total = 14.
- Digits: 0+3+1+2+3+4 = 13 → 4; grand total = 14+13 = 27 → 2+7 = **9** (Mars).
- Pure-digit total = 13 → 1+3 = **4**? — NameVibrations' own walkthrough reports the digit total as 1+2+3+4 = 10 → **1** (they exclude the RTO digit 0 and 3; i.e. unique-number-portion digits only). NOTE the school boundary: which digits belong in the "digit total" (full string vs number portion) is itself split — implement per §3.1 recommendation (number portion) and surface both for QA.
- Verdict: 9 friendly to mulank 1 (1's friends include 9) ✓; 1 = identity ✓ → friendly.

### Example 3 — edge, digit-clash override (Nehaa): plate 2876, owner DOB 13-04-1995
- Plate total: 2+8+7+6 = 23 → 2+3 = **5** (friendly to bhagyank: 1+3+0+4+1+9+9+5 = 32 → 3+2 = 5; identity).
- BUT digit 8 is "negative for that DOB" (mulank 1+3 = 4; the school flags 8 against this owner) → verdict NEGATIVE despite friendly total. This exercises the §3.3 override flag.
- Secondary: mulank 4 vs plate root 5 → friendly (consensus: 4's friends include 5) — total and override disagree, which is exactly the documented behaviour.

### Example 4 — boundary, doubled-pair clash (Nehaa): plate 3664, owner DOB 12-02-1992
- Plate total: 3+6+6+4 = 19 → 1+9 = 10 → **1** (Sun).
- Owner: mulank = 1+2 = **3** (Jupiter); bhagyank = 1+2+0+2+1+9+9+2 = 26 → 2+6 = **8** (Saturn).
- Mulank 3 clashes with 6 (3's enemies include 6 — Jupiter–Venus enmity) and the "66" pair is harmful → verdict NEGATIVE despite total 1.
- Boundary note: total lands on a two-step reduction (19→10→1) — chain must display fully.

### Example 5 — task-specified plate: "MH 12 AB 4321", owner DOB 14-03-1992 (mulank 5, bhagyank 2)
- School A: digits 1,2,4,3,2,1 → 1+2+4+3+2+1 = 13 → **4** (Rahu).
- School B: letters M4+H5+A1+B2 = 12; digits 13 → grand 25 → **7** (Ketu).
- Verdict School A: 4 vs mulank 5 → friendly (5's friends include 4) ✓; 4 vs bhagyank 2 → enemy (2's enemies 4,8) ✗ → MIXED → "not suggested" per both-must-be-friendly rule.
- Verdict School B: 7 vs 5 neutral, 7 vs 2 neutral → acceptable.

## 5. Complete output list
A GOOD vehicle-number calculator shows:
1. Parsed plate: state code, RTO code, series letters, unique number (structured), and each part's contribution.
2. School A total (compound + root, e.g. "14 → 5") and School B total (letters + digits, "25 → 7") with school labels.
3. Root's lord + one-liner (5 Mercury — commerce, travel, versatility; 6 Venus — comfort/luxury).
4. Owner block: mulank + lord, bhagyank + lord, and the owner's friendly/neutral/enemy numbers.
5. Compatibility verdict per the ladder (amazing/good/neutral/low/worst or lucky/not-suggested), stating BOTH comparisons (mulank AND bhagyank) and any age-weighting note if adopted.
6. Digit-clash warnings (unlucky individual digits, doubled pairs like 66, 000) per §3.3.
7. Per-owner lucky plate-number list ("for mulank X: plate roots 1,3,5,9 …") + general best (5, 6) and avoid (8; often 7) list.
8. Belief-labelled extras: increasing-order digits (belief), colour match (remedial), auspicious delivery date (v2).
9. Remedies text if plate is unfavourable (Nehaa sells "simple and affordable remedies"; Vyotish: traditional remedies + consult-an-astrologer line).
10. Disclaimer: safety/accident claims are traditional beliefs, not guarantees — mandatory given the accident-prevention marketing in this niche.

Competitor comparison:
| output | NameVibrations | Numerology by Nehaa | AstroSage/GaneshaSpeaks | Vyotish today |
|---|---|---|---|---|
| Inputs | DOB + plate string | DOB + vehicle number | no dedicated tool surfaced (numerology umbrella) | DOB only |
| Letters converted | yes — Chaldean AND Pythagorean dual verdict | NO (digits of unique number only) | — | n/a (no plate input) |
| Compound+root shown | yes (27→9, digit total separate) | yes (14→5) | — | n/a |
| Compatibility vs mulank+bhagyank | yes (friendship chart, 4-level ladder) | yes (both must be friendly) | — | only a friendly/neutral list FROM the mulank (no plate) |
| Digit-clash overrides | — | yes (8 negative, "66" pair) | — | NO |
| Lucky-number lists | yes | yes | — | yes (friendly/neutral numbers) |
| Remedies / paid consult | upsell | yes (₹1000 consult, delivery date) | — | NO |
| Disclaimer | — | — | — | `verified:false` flag (not user-facing) |

### Current Vyotish outputs
Page `/calculators/vehicle-number`; `GET /calculators/vehicle-number?date` → `mulank, lord, friendly_numbers, neutral_numbers, note, verified:false`. Owner-directive gap: the page takes ONLY the owner's birth date — there is NO vehicle-number input; it outputs which vehicle numbers are friendly for the owner rather than analysing a specific registration. `verified:false` signals the team already knows the logic is provisional.

### Initial gap list
1. NO plate input — the calculator cannot answer the actual user question ("is MH 12 AB 4321 lucky for me?"); needs full registration string + DOB.
2. No School A / School B dual computation (digits-only vs Chaldean full string) — must implement and label both.
3. No compatibility verdict of plate vs mulank AND bhagyank (current friendly_numbers list only covers mulank side).
4. No digit-clash/pair warnings (8-negative, 66-pair rules).
5. No parsed-plate display (state/RTO/series/number) — needed for School A scoping (unique number portion).
6. No per-owner lucky plate list tied to bhagyank.
7. No remedies text, no auspicious delivery date (v2).
8. No disclaimers (accident-prevention claims in this niche make it mandatory).
9. `verified:false` should be removed only after School A/B logic ships with the test cases below.

## 6. Edge cases and validation rules
- Plate parsing: accept `MH12AB4321`, `MH 12 AB 4321`, `MH-12-AB-4321` identically; uppercase-insensitive letters; reject empty; reject >15 chars after stripping.
- Indian format awareness: state code (2 letters) + RTO (1–2 digits) + series (1–3 letters) + number (1–4 digits); BH-series/ev plates may vary — do not hard-fail on non-standard formats, just parse digits/letters generically and flag format as non-standard.
- Zeros: leading zeros in the number portion (e.g. 0045) contribute nothing to sums (both schools agree 0 adds nothing) but are significant to VIP-plate buyers — display as-is in parsed output.
- School scoping: School A sums digits of the NUMBER PORTION only (Nehaa: "DL 1AB 2345" → 2345); if the tool receives the full string it must exclude state+RTO digits per School A — document the split (Example 2 shows NameVibrations' digit-total ambiguity).
- Letter values: Chaldean only for School B (no 9-letter); Pythagorean optional toggle. Reject plates with characters outside A–Z/0–9 (e.g. `IND` emblem, stickers) with a message.
- Owner DOB validation: same rules as destiny-number.md §6 (leap years, month/day caps, no future dates).
- Verdict matrix direction: compare plate root against the OWNER's mulank row and bhagyank row of the friendship matrix; both-friendly → lucky; any enemy → not suggested; neutrals → acceptable.
- Boundary: plate sum landing on 11/22/33 (first-pass) → master note, root primary (same contract as mobile tool). E.g. unique number 9992220000 → 33 → root 6.
- Max per-digit count: unique number ≤ 4 digits normally (fancy plates up to 9999); sum overflow impossible; still implement digits-as-strings.

## 7. Sources
- Digits-only school + unique-number scoping + both-must-be-friendly rule + digit-clash overrides (8, "66") + belief labelling (increasing order) + lucky lists (1,3,5,9 example) + ₹1000 consult / delivery date: https://numerologybynehaa.com/vehicle-number-numerology-calculator/
- Full-string Chaldean school + dual Chaldean/Pythagorean verdict ladder + DL 03 XB 1234 walkthrough (DL=7, XB=7, total 9): https://www.namevibrations.com/lucky-license-plate-calculator-for-vehicle
- Chaldean letter chart for plates (AIJQY=1 … FP=8) + Pythagorean chart: NameVibrations page above (identical to https://swarnsiddhi.com/blog/chaldean-numerology-table)
- Per-mulank plate recommendations (mulank 4: good 1,2,5,6,7,9 / avoid 3,4,8; mulank 9: good 1,3,5,6,9 / avoid 2,4,8): https://www.jcchaudhry.com/vehicle-number-numerology
- General best/avoid (6 & 5 best, 8 worst, 7/8 often avoided): https://www.quora.com/How-do-you-calculate-the-numerical-value-of-your-lucky-vehicle-number-in-numerology (community school-of-thumb — treat as variant, not rule)
- Lords 1–9 + friendship matrix: https://astrologergeetanjalijindal.com/numerology + https://steer.coach/planet-friend-enemy-table + vedic-numerology.md §3.5
- App-store competitor (enter plate → calculate): https://play.google.com/store/apps/details?id=com.zigzagai.vehiclenumbernumerology
