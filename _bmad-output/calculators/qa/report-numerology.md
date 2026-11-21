# QA Report — Numerology Cluster (Quinn)

> Cluster: **vedic-numerology, lo-shu-grid, destiny-number, name-numerology, mobile-number-numerology, lucky-vehicle-number**
> Date: 2026-11-21 · Author: Quinn (QA) · Pipeline: _bmad-output/calculators/
> Method: research worked-example verification against `qa/api-probe.json` (live-deployed backend, engine 1.3.0-alpha1) + `qa/ui-probe.json` (4 viewports) + screenshots; 26 extra one-off API probes fired 2026-11-21 against `https://astro-backend.vyotish.workers.dev`; root causes confirmed by reading `backend/src/engine/tools.ts`, `backend/src/engine/calculators.ts`, `backend/src/routes/v1/calculators.ts`, `frontend/src/pages/calculators/[tool].astro`. No application code was modified.

## Evidence files used

| Evidence | Path |
|---|---|
| Inventory (X-issues) | `_bmad-output/calculators/inventory.md` |
| Research (expected I/O) | `research/vedic-numerology.md`, `research/lo-shu-grid.md`, `research/destiny-number.md`, `research/name-numerology.md`, `research/mobile-number-numerology.md`, `research/lucky-vehicle-number.md` |
| API probe (2026-11-21) | `qa/api-probe.json` |
| UI probe (2026-11-21) | `qa/ui-probe.json` (slugs: numerology, lo-shu, vehicle-number, name-numerology, mobile-numerology, destiny-number) |
| Screenshots | `qa/shots/lo-shu-360.png`, `lo-shu-1440.png`, `numerology-360.png`, `mobile-numerology-360.png` (+768/1024 variants) |
| Extra live probes (this session) | 26 one-off `bun -e` fetches — outputs quoted inline below |

---

## 1. Discrepancy table (all findings, P0 first)

| ID | Calculator | Type | Input used | Expected (source) | Actual | Sev | Suspected root cause |
|---|---|---|---|---|---|---|---|
| QN-01 | mobile-numerology | Wrong result | digits=`+91 98765 43210` (standard Indian format) | Strip +91/0 prefixes BEFORE summing → must equal `9876543210` = 45 → **9 Mars** (mobile-number-numerology.md §2 "Leading +91/0 must be stripped BEFORE summing", §6 rule 1) | 200 `{sum:55, root:1, lord:Sun}` — the +91 digits are summed in | **P0** | `backend/src/engine/tools.ts:345-347` — `mobileNumerology` sums every digit of the raw string; no prefix-strip step anywhere in route `calculators.ts:258-266` |
| QN-02 | vehicle-number | Wrong result | date=1992-03-14 (mulank 5 Mercury) | Consensus matrix: 5's friends = **1,2,3,4,6**; neutral = **7,8,9**; enemies none (vedic-numerology.md §3.5) | `friendly_numbers:[1,2,3,4,5,6,8,9]`, `neutral_numbers:[7]` — **8 and 9 shown friendly** (consensus: neutral). Cross-check mulank 3 (probe date=2025-02-30): API `friendly:[1,2,3,5,7,9]` but consensus says 3's enemies are 5,6 → 5 wrongly "friendly", enemy band missing entirely | P1 | `backend/src/engine/tools.ts:298-308` `NUMBER_FRIENDS` is classical *planet-level* friendship + `tools.ts:320-329` "mutual-friend overlap" test — not the research's *number-level* consensus matrix; no enemy classification exists (everything not friendly becomes "neutral") |
| QN-03 | vehicle-number | Missing input | — (whole tool) | Full registration string (e.g. `MH 12 AB 4321`) + owner DOB, both mandatory; tool must answer "is THIS plate lucky for me" (lucky-vehicle-number.md §2, §5 gap 1; owner directive) | NO vehicle-number field anywhere: route reads only `?date` (`calculators.ts:249-255`); registry kind `"date"` (`[tool].astro:154-159`); ui-probe formFields = `[{date}]` only. Tool is a "lucky numbers reference table", not a plate analyser | P1 | Registry entry lacks any plate `extraField`; engine has no plate parsing/Chaldean-letter school A/B functions at all |
| QN-04 | mobile-numerology | Missing input | UI form renders optional `Date` field next to "Mobile number" | Owner DOB mandatory → compatibility verdict vs Mulank/Bhagyank with Atrish verdict levels (mobile-number-numerology.md §2, §3.2, §5 gap 1) | Date field **is rendered** (`[tool].astro:315` renders date for every kind; ui-probe mobile formFields: date optional visible) and **is sent** (FormData passthrough `[tool].astro:392-396`), but the endpoint ignores `date` — response has no mulank/bhagyank/verdict. Dead, misleading input | P1 | `backend/src/routes/v1/calculators.ts:258-266` reads only `digits`; frontend renders the shared date input for `kind:"mobile"` |
| QN-05 | name-numerology | Missing input | UI form renders optional `Date` field | DOB mandatory for the compatibility verdict — the entire point of a lucky-name tool (name-numerology.md §2, §3.5, §5 gap 1) | Same dead-input pattern: date rendered + sent, ignored by API (`calculators.ts:269-273` reads only `name`); response has no compatibility. Research said "no DOB input" — actually the field EXISTS but is non-functional | P1 | `backend/src/routes/v1/calculators.ts:269-273`; frontend `[tool].astro:315` |
| QN-06 | lo-shu | Alignment | date=14-03-1992 at 360/1440 | Rendered **3×3 grid** in cell order 4-9-2/3-5-7/8-1-6 — "the core UX of this calculator, highest-priority gap" (lo-shu-grid.md §5 item 1, gap 1) | Flat label/value rows: ui-probe `grid` row is one 850×675 text dump; rowHeights[0]=700 at ALL 4 viewports; screenshots `lo-shu-360.png`/`lo-shu-1440.png` show "number4 / digits4 / count1 / number9 …" as a vertical list. Page copy itself promises "the classical 3×3 Lo Shu map" — output contradicts it | P1 | `frontend/src/pages/calculators/[tool].astro:359-381` generic `renderObject` dumps every key as `.row`; no per-tool layout; API shape (`grid[9]{number,digits,count}`) is actually grid-ready — renderer never uses it |
| QN-07 | ALL cluster calculators | Alignment | any result, any viewport | Result rows styled two-column (200px key column) per CSS rules | **All result rows unstyled** (X3): keys/values run together ("mulank5", "name_root3", "lordMars" — visible in `numerology-360.png`, `mobile-numerology-360.png`); ui-probe proves it — `vBox.x` varies per row (name-numerology: 327/327/326/345/331; numerology: 355/353/386/389/385) instead of fixed k+200px; vehicle `note` row wraps to 175px tall at 360 (rowHeights [25,25,50,25,175,25]) | P1 | `frontend/src/pages/calculators/[tool].astro:427` `<style>` is scoped (no `is:global`) while rows are JS-injected → `.row/.k/.v/.obj` selectors (lines 446-456) never match. Owner's "alignment is not correct" complaint root cause |
| QN-08 | numerology, lo-shu, vehicle-number | Validation | date=2025-02-30 (impossible) | Reject impossible calendar dates (all 6 research §6 rules; destiny-number.md §6) | **200 accepted, computed from raw digits**: numerology → `{mulank:3, destiny:5}` (mulank from raw "30"→3; NOT the rolled Mar-2 mulank 2; Feb-28 gives mulank 1/destiny 3 — different numbers for an impossible date); lo-shu → grid {2×3,3,5}; vehicle → mulank 3 Jupiter. destiny-number correctly 400s (`date is not a valid calendar date`) — guard exists but is not applied here (X4) | P1 | `backend/src/routes/v1/calculators.ts:65-70` `isCalendarDate()` exists but is only called on sun-sign (:154) and destiny-number (:166); numerology (:175-201), lo-shu (:242-246), vehicle-number (:249-255) lack it; engines use raw string digits (`tools.ts:74-77,317`; `engine/calculators.ts:189-191,225-226`) so nothing downstream catches it |
| QN-09 | numerology | Missing detail | date=1992-03-14&name=Sanjay Bhati | mulank_lord/destiny_lord + compound sums + master flag (destiny-number.md §5; vedic-numerology.md gap 2-4: "destiny-number calculator has them; numerology endpoint does not — inconsistent API shape") | `{mulank:5, destiny:2, name_root:7, name_sum:25, name_lord:Ketu}` — no `mulank_lord`, no `destiny_lord`, no `destiny_sum` (29), no `master` (destiny-number endpoint on same date returns all of them) | P2 | `backend/src/routes/v1/calculators.ts:190-198` builds a smaller payload than `destinyNumber()` (engine `calculators.ts:217-239`) which it could reuse |
| QN-10 | name-numerology | Validation | name=King4Life / name=संजय / name=123 / name="   " / 80×"A" | REJECT digits & non-Latin with "letters A–Z only"/"enter in English letters"; empty → error; max ~60 chars (name-numerology.md §4 Ex 4, §6; vedic-numerology.md §6; X7) | All 200: "King4Life" → 28→1 (digit 4 silently stripped); "संजय" → `{sum:0, root:0, lord:Sun}`; "123" → sum 0 root 0; spaces-only → sum 0 root 0; 80-letter name accepted (no cap) | P2 | `backend/src/engine/tools.ts:54` `name.replace(/[^A-Z]/g,"")` silently strips; route `calculators.ts:269-273` only checks non-empty param, no charset/length check |
| QN-11 | name-numerology, mobile-numerology, numerology | Wrong result | name omitted on numerology; digits="000"; name="   " | Root range 1–9; guard sum=0 → validation error, never emit root 0; empty name → skip name outputs entirely (vedic-numerology.md §6; name-numerology.md §6) | `root:0, lord:"Sun"` nonsense (Sun rules 1, not 0): numerology with no name renders rows `name_root 0 / name_sum 0 / name_lord Sun` (api-probe X4 case); mobile "000" → `{sum:0, root:0, lord:Sun}`; ui-probe numerology resultText confirms the rows render | P2 | `backend/src/engine/tools.ts:59` `digitalRoot(0)` returns 0; `:351,367` `NUMBER_LORDS[root-1] ?? "Sun"` fallback masks it; route `calculators.ts:190-198` always emits name fields even when name="" |
| QN-12 | mobile-numerology | Validation | digits=1234567890123456 (16), 12345678901234567 (17), "123" | Accept 3–15 after strip (own message: "digits must contain 3–15 numeric characters"); 10 = standard; research wants 10 normal, 3–15 flagged `length_warning` (mobile-number-numerology.md §2, §5 gap 9, §6) | **16- and 17-digit accepted** (200; sums 66→3 and 73→1 — unanchored regex matches a 15-digit run inside longer input); "123" accepted silently with NO `length_warning`; UI placeholder says **"10–15 digits"** (`[tool].astro:190`) — contradicts both the 3–15 message and the ≥16 reality | P2 | `backend/src/routes/v1/calculators.ts:260` `/\d{3,15}/.test(...)` is **unanchored** (should be `/^\d{3,15}$/`); placeholder `[tool].astro:190` |
| QN-13 | destiny-number, mobile, name, numerology | Missing detail | date=1980-11-29 (mulank day 29→11); digits=9992220000 (sum 33); name=Om (compound 11) | Flag `master` when first-pass sum/day ∈ {11,22,33} + both-schools note; mulank master case flagged (destiny-number.md §4 Ex 3, gap 2; vedic-numerology.md §3.3; mobile §4 Ex 4; name §4 Ex 3) | destiny-number flag WORKS (22-11-1960 → `destiny_sum:22, master:true` ✓; 31→`master:false` ✓ no false positive on chain intermediates ✓). But mulank 29-11-1980 → `mulank:2` no flag/compound 11 anywhere; mobile 9992220000 → `{sum:33, root:6}` no flag; name "Om" → `{sum:11, root:2}` no note | P2 | `backend/src/engine/calculators.ts:234` master computed only on destiny sum; `tools.ts:317-329` (vehicle), `:339-354` (mobile), `:356-371` (name) have no master logic; no `mulank_sum` field exists |
| QN-14 | ALL cluster | Missing detail | any | Interpretation/meaning text per number (mulank 1–9 personality, destiny career-fit, name root meaning, mobile root meanings w/ professions, Lo Shu per-number present/missing meanings) — the #1 gap in ALL SIX research files' complete-output lists | Zero meaning text anywhere: responses carry only numbers + one-line `note`; UI renders raw snake_case keys (`ui-probe` resultText "mulank5 destiny2 name_root3…") | P2 | No content/interpretation layer exists — engine returns bare numbers (`tools.ts:339-371`, `engine/calculators.ts:181-239`); renderer has no per-tool sections (`[tool].astro:359-381`) |
| QN-15 | numerology, destiny, name, mobile, vehicle | Missing detail | any | Friendly/neutral/enemy number lists + lucky/unlucky numbers + compatibility verdicts: name↔DOB (mulank+bhagyank), mobile↔owner, vehicle plate↔owner, mulank↔destiny "nature vs path" (vedic-numerology.md §5 items 5-7,9; destiny-number.md §5 items 4-6; name-numerology.md §3.5; mobile §3.2; vehicle §3.2) | Only vehicle returns friend/neutral lists (wrong per QN-02, mulank-side only, no bhagyank). No verdicts anywhere: destiny response has mulank+lords but no mulank-vs-destiny verdict (destiny-number.md gap 4 — "despite both numbers + lords already in the response"); name/mobile have no owner numbers at all | P2 | No compatibility layer; matrix exists only inside vehicle helper (and diverges from research, QN-02) |
| QN-16 | lo-shu | Missing detail | date=14-03-1992 | 8 arrows/planes (Mental 4-9-2 … Golden Yog 4-5-6, Silver Yog 2-5-8) complete/broken + meanings; remedies per missing number; mulank/bhagyank companions; disclaimer (lo-shu-grid.md §3.3, §5 items 2-10; gap 2-8) | API returns only `grid/missing/repeated` (api-probe); probe case 14-03-1992 correctly yields missing [5,7,8,6] etc. — so Mental Plane 4-9-2 complete / all others broken is computable but absent; no arrows field, no remedies, no companions, no disclaimer | P2 | `backend/src/engine/tools.ts:69-90` `loShuGrid` implements placement only; planes/arrows table not implemented |
| QN-17 | ALL cluster | Missing detail | any | Remedies block (favourable days, colours, gemstones per lord; Lo Shu per-missing-number remedies) — "main monetisation hook on competitors" (vedic-numerology.md §5 item 8, gap 8; lo-shu §5 item 7; destiny §5 item 8; mobile §5 item 7) | None anywhere in cluster (vehicle note is a P11 caveat, not remedies) | P2 | No remedial content layer |
| QN-18 | ALL cluster except mobile | Missing detail | any | User-facing disclaimer: entertainment/self-reflection only; vehicle niche REQUIRES safety-claim disclaimer (vedic-numerology.md §5 item 10; destiny §5 item 9; lo-shu §5 item 9; name §5 item 10; vehicle §5 item 10 "mandatory") | vehicle shows internal `verified:false` → UI flagline "Table set pending Jyotishi review (P11)" (not a user disclaimer); mobile has `for_fun` + "For entertainment only." flagline (partial); numerology/lo-shu/destiny/name have none | P2 | Frontend flaglines only for `verified===false`/`for_fun===true` (`[tool].astro:410-415`); no disclaimer field in API or copy |
| QN-19 | mobile-numerology | Missing detail | digits=9999999999; 09876543210 | Tail (last-4) total ("tail vibration"), pattern-digit analysis (9×10 amplification), ends-in-0 advisory, excessive-4/8 advisory, zero-count (mobile-number-numerology.md §3.1 secondary, §3.3, §5 item 2/6, gaps 2/5) | `{sum:90, root:9, lord:Mars}` only — sum/root/lord correct (matches research Ex 3) but no tail, no pattern, no advisories | P3 | `tools.ts:339-354` computes total only |
| QN-20 | lo-shu | Wrong result (cosmetic ordering) | date=14-03-1992 | `missing=[5,6,7,8]`, `repeated=[1,9]` ascending (lo-shu-grid.md §4 Ex 1) | `missing=[5,7,8,6]`, `repeated=[9,1]` — LO_SHU_POSITIONS cell order, not ascending (counts/grid themselves correct) | P3 | `backend/src/engine/tools.ts:87-88` filter over `LO_SHU_POSITIONS` without sort |
| QN-21 | name-numerology | Missing detail | name=priya-verma | Per-word subtotals (13, 18) via `words[]`; per-letter table as typed (letters paired with the letter) (name-numerology.md §5 items 1-2, gap 5; vedic-numerology.md §2) | `letters:[8,2,1,1,1,6,5,2,4,1]` — bare value array, no letter labels, no word grouping; sum 31→4 Rahu correct (matches research Ex 2) | P3 | `tools.ts:51-60` `nameNumber` collects values only |
| QN-22 | destiny-number, numerology | Missing detail | date=14-03-1992 | Visible reduction chain "29 → 11 → 2" / "37 → 10 → 1" (destiny-number.md §5 item 1, gap 3; vedic-numerology.md §5 item 1 "display the full digit string") | destiny UI shows `destiny_sum 33` and `destiny 6` as two unrelated rows (ui-probe destiny resultText); chain not rendered; numerology endpoint lacks destiny_sum entirely (QN-09) | P3 | API has no `chain[]` field; renderer would need it |
| QN-23 | name-numerology | Validation (minor) | name=O'Neill | Strip apostrophe **with a note** (O'Neill → ONEILL) (name-numerology.md §4 Ex 4, §6) | Stripped silently: `{sum:24, root:6, lord:Venus}` — value correct (O7+N5+E5+I1+L3+L3=24), no note | P3 | `tools.ts:54` strip; no policy note |

**Not duplicated here (cross-cutting, owned by other findings):** X9 invented fun bands do not appear in this cluster's endpoints (love/friendship/flames only); X5 renderer weaknesses covered by QN-06/QN-07/QN-14.

---

## 2. Per-calculator pass/fail summary

### vedic-numerology (`/calculators/numerology`) — PARTIAL PASS
- PASS: mulank 5 (day 14), destiny 2 (digit-sum 29→2) for 1992-03-14 — matches research §4 Ex 1 vector exactly (probe: `numerology` + live re-probe with full name `Sanjay Bhati` → `name_sum:25, name_root:7, name_lord:Ketu` ✓). Chaldean A–Z table verified letter-by-letter against research §6 idempotence list — identical.
- FAIL: QN-08 (impossible date 200/mulank 3), QN-09 (no lords/compound/master), QN-11 (name_root 0 + lord Sun emitted when name omitted), QN-14/15/17/18 (no meanings, friendly/enemy, remedies, disclaimer), name optional without soft-warn (research gap 9).

### lo-shu-grid (`/calculators/lo-shu`) — PASS on data, FAIL on presentation
- PASS: 14-03-1992 counts {1:2,2:1,3:1,4:1,9:2} with zeros dropped = research §4 Ex 1 exactly; cell order [4,9,2,3,5,7,8,1,6] preserved (§6 requirement); oracle holds — missing list never empty (14-03-1992 → 4 missing; 1967-08-24 → missing [3,5], repeated [] = research §4 Ex 4 boundary case reproduced exactly).
- FAIL: QN-06 (flat rows, no 3×3 — worst UI gap in cluster), QN-08 (Feb-30 accepted, grid from raw digits), QN-16 (no arrows/planes/meanings/remedies/companions), QN-20 (list ordering), QN-18 (no disclaimer).

### destiny-number (`/calculators/destiny-number`) — PASS (best in cluster)
- PASS: master33 case (1970-06-19) → `destiny 6, destiny_sum 33, master true, mulank 1, Venus/Sun` ✓; 1947-08-15 → `destiny 8, destiny_sum 35, mulank 6, Saturn/Venus` ✓; 1960-11-22 → 22/master:true ✓; 1980-11-29 → mulank 2 / destiny 4 / master:false ✓ (no false master on chain intermediate — §6 regression rule respected); **only cluster endpoint that rejects 2025-02-30 (400)**.
- FAIL: QN-13 (mulank master unflagged), QN-22 (no chain), QN-14/15/17/18 (no meanings, verdict, friendly/enemy, remedies, disclaimer).

### name-numerology (`/calculators/name-numerology`) — PASS on math, FAIL on validation
- PASS: "Sanjay Bhati" → sum 25, root 7, Ketu, letters [3,1,5,1,1,1,2,5,1,4,1] = research §4 Ex 1 regression contract, letter-for-letter; "priya-verma" → 31→4 Rahu ✓ (hyphen handled); "Om" → 11→2 Moon ✓ (Vedic school); "ROHIT MEHRA" → 36→9 Mars ✓.
- FAIL: QN-05 (dead DOB field, no compatibility verdict), QN-10 (digits/Devanagari/spaces/80-char all accepted), QN-11 (root 0 lord Sun), QN-21 (no word subtotals/letter labels), QN-23 (silent apostrophe strip), QN-14/17/18.

### mobile-number-numerology (`/calculators/mobile-numerology`) — PASS on core sum, FAIL on validation
- PASS: 9990513999 → 63→9 Mars (research/Atrish canonical example ✓); 9999999999 → 90→9 ✓; "99" → 400 ✓; full-sum school (A) implemented as recommended.
- FAIL: QN-01 (+91 prefix → wrong root, **P0**), QN-04 (dead DOB field, no compatibility), QN-12 (16/17-digit accepted; placeholder "10–15" vs message "3–15" vs reality "≥3, any"), QN-11 ("000" → root 0), QN-13 (33 unflagged), QN-19 (no tail/pattern/advisories), QN-14/17/18.

### lucky-vehicle-number (`/calculators/vehicle-number`) — FAIL
- PASS: mulank/lord mapping correct (1992-03-14 → 5 Mercury ✓).
- FAIL: QN-03 (no plate input — tool cannot answer its core question), QN-02 (friendship sets diverge from consensus matrix; no enemy band; mulank-side only), QN-08 (Feb-30 → mulank 3), QN-17/18 (no remedies, no real disclaimer — `verified:false` is internal).

---

## 3. Top 5 issues for the cluster

1. **QN-01 (P0) — mobile-numerology wrong for the most common input format.** "+91 98765 43210" → root 1/Sun instead of 45→9/Mars. The tool's only output is wrong whenever a country code is present. Fix: strip `+91`/`91`/leading `0` when the remainder is a 10-digit number starting 6–9 (per research §6), then sum.
2. **QN-03 (P1) — vehicle-number has no vehicle-number input.** The page accepts a birth date and prints a lucky-numbers table; the owner directive and research require a full registration string + DOB with School A/B plate analysis. The tool needs a second mandatory field + new engine logic.
3. **QN-06 (P1) — Lo Shu renders as flat rows, not a 3×3 grid.** The single most shareable artifact in the cluster (and the page's own headline promise) is missing; API data is already grid-ordered so a renderer fix alone closes it.
4. **QN-07 (P1) — every result in the cluster is unstyled/misaligned (X3).** Scoped `<style>` never matches JS-injected rows: keys/values run together, no key column, notes wrap into 175px blobs at 360px. One `is:global` fix repairs all six calculators at once — the direct root cause of the owner's "alignment is not correct" report.
5. **QN-04/QN-05 (P1) — name-numerology and mobile-numerology render a DOB field the API silently ignores.** Worse than no field: users enter their birth date, see no compatibility verdict, and get no feedback. Either wire `date` into the endpoints (enabling the mulank/bhagyank compatibility verdicts both research files demand) or remove the field and label the tool single-input.

---

## 4. Probe log (one-off live calls, 2026-11-21)

| Probe | Status | Key result |
|---|---|---|
| numerology?date=2025-02-28 | 200 | mulank 1, destiny 3 |
| numerology?date=2025-02-30 | 200 | mulank 3, destiny 5 (raw "30"→3; differs from Feb-28 → invalid date changes result, X4) |
| lo-shu?date=2025-02-30 / 02-28 | 200 | grids from raw digits {2×3,3,5} / {2×4,5,8} |
| vehicle-number?date=2025-02-30 | 200 | mulank 3 Jupiter (accepted) |
| destiny-number?date=2025-02-30 | **400** | "date is not a valid calendar date" (guard exists, only applied here) |
| destiny-number?date=1960-11-22 | 200 | destiny_sum 22, master true, mulank 4 Rahu/Rahu |
| destiny-number?date=1980-11-29 | 200 | mulank 2 (29→11→2, no master flag/compound), destiny 4 |
| numerology?date=1940-03-12 | 200 | mulank 3, destiny 2 (all-digit 20→2 per Indian school; no compound shown) |
| numerology?date=1992-03-14&name=Sanjay Bhati | 200 | mulank 5, destiny 2, name 25/7 Ketu — full research vector ✓ |
| name-numerology?name=King4Life | 200 | 28→1 (digit stripped silently) |
| name-numerology?name=संजय | 200 | sum 0, root 0, lord Sun |
| name-numerology?name=priya-verma | 200 | 31→4 Rahu ✓ |
| name-numerology?name=O'Neill | 200 | 24→6 Venus ✓ (silent strip) |
| name-numerology?name=Om | 200 | 11→2 Moon (no master note) |
| name-numerology?name=ROHIT MEHRA | 200 | 36→9 Mars ✓ |
| name-numerology?name=%20%20%20 | 200 | sum 0 root 0 |
| name-numerology?name=A×80 | 200 | 80→8 (no length cap) |
| mobile?digits=123 | 200 | 6→6 Venus (no length_warning) |
| mobile?digits=1234567890123456 (16) | 200 | 66→3 (boundary bug) |
| mobile?digits=12345678901234567 (17) | 200 | 73→1 |
| mobile?digits=9992220000 | 200 | 33→6 (no master flag) |
| mobile?digits=99 | 400 | correct lower bound |
| mobile?digits=abc123def | 200 | 6→6 (letters stripped silently) |
| mobile?digits=9999999999 | 200 | 90→9 Mars ✓ |
| mobile?digits=+91 98765 43210 | 200 | 55→1 Sun (**expected 45→9 Mars**, QN-01) |
| mobile?digits=09876543210 | 200 | 45→9 (leading 0 harmless; +91 is the harmful case) |
| mobile?digits=000 | 200 | sum 0, root 0, lord Sun |
| lo-shu?date=1967-08-24 | 200 | missing [3,5], repeated [] — research §4 Ex 4 oracle reproduced exactly ✓ |
