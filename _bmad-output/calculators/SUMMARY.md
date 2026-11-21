# Epic 14 — Calculators overhaul: pipeline closeout (2026-11-21)

Owner directive: *"cross check and fix outputs of all the calculators … not getting all
the details in output and even alignment is not correct … check input asked for each
calculator … There should not be scope of error."* Owner approval at the Step-2 gate:
*"take your best decision and go ahead with suggested changes."*

## Pipeline (BMAD, manual personas)
| Step | Agent | Output |
|---|---|---|
| 0. Inventory | Quinn | 23 tools audited; response-shape walk (`qa/shapes.mjs`) |
| 1. Research | Mary | 23 research files with published vectors (`research/`) |
| 2. Cross-check | Quinn | 58 findings, **17 proven bugs** (`qa/discrepancy-report.md`), 80 before-shots |
| 3. Output spec | Sally | block-renderer spec + 4 Stitch screens (`design/`) |
| 4. Stories | Bob | S14-1a/1b/2/3, BMAD-approved (`stories/`) |
| 5. Dev + verify | Amelia + Quinn | below |

## What shipped

### Backend (PUSHED + deployed + live-verified: ab93aa0, d362808)
- Engine **1.4.0-alpha1**: UTC day-shift solver fix (evening births), sidereal mean
  nodes for Rahu/Ketu, raw manglik flags preserved beside cancellations, sade-sati
  first-entry windows + dhaiya + phase windows, cumulative antardashas, interpretation
  layer, kaal-sarp planet table, karaka scheme, honest Unparseable plates.
- 4 new routes: **nakshatra / lagna / vimshottari-dasha / mangal-dosha**; vehicle-plate
  rewrite; name-numerology owner_compatibility. **313 tests green** (story estimated
  ≥320; actual landed at 313 — reported honestly).

### Frontend (PUSHED 2026-11-21 = D8 deploy; 7ba48b4 → 3cf3301)
- Shared **block renderer** (`calculator-renderer.ts` + `calculator-render-map.ts`):
  B1 verdict card · B2 status chips · B3 meaning/guidance/basis · B4 detail cards,
  tables, Lo Shu 3×3 grid, dasha bar + timeline · B5 honesty flaglines
  (`verified:false` → "pending Jyotishi review", for_fun labels, unmapped keys →
  "More details" fallback).
- All **23 calculator pages** rebuilt; result styles `is:global` on theme tokens
  (root-cause fix for the alignment complaint); new pages nakshatra / lagna /
  vimshottari-dasha; registry fixes: dedicated mangal-dosha + kaal-sarp routes,
  names-kind a/b only, required plate input, gender select, optional owner date,
  sade-sati as-of date; hub + sitemap updated.
- NOTE: the push deployed **all 36 pending local commits** to vyotish.com
  (fonts, profile pages, kundli 4.2b, legal 7.3, UX-audit + QA-sweep fixes included).

## Verification (S14-3)
- `26/26` regressions vs deployed backend **and** vs live vyotish.com post-deploy
  (`qa/regressions.json`, `regressions-live-backend.json` 27/27).
- S13 e2e 14/14 on the new renderer; S14 UI 11/11; axe wcag2aa 8/8 (4 pages ×
  light/dark, strict).
- **92/92 result-bearing shots** (23 pages × 360/768/1024/1440, forms submitted):
  `qa/shots-after/` (index `_index.txt`). Spot-checked: rashi, vimshottari-dasha,
  lo-shu, transits, kaal-sarp.

## Deferred (documented, not silently dropped)
- Gochara (transit) overlay on the dasha page — S14-2 non-goal; engine returns natal
  periods only.
- **P11 Jyotishi sign-off** for interpretations + matching verdicts (`verified:false`
  flaglines render on every affected tool).
- Ishta-devata deity-table rows the owner disputed remain flagged pending review.

## Owner actions remaining
- None for this epic — backend and frontend are both pushed and live.
- Standing owner gates unchanged: P11 review, 7.2/7.4 keys, admin first-login check.

## Artifact map
`inventory.md` · `research/` (23) · `qa/discrepancy-report.md` · `qa/regressions*.json`
· `qa/shots/` (80 before) · `qa/shots-after/` (92 after) · `design/` (spec + screens)
· `stories/S14-1a…S14-3` · repo commits: backend ab93aa0+d362808, frontend
a5ccbae+b333ed8+3cf3301, meta qa 8ecab96.
