# S14-2 — Frontend: shared results renderer + registry fixes + 3 new pages (Epic 14 story 3 of 3)

> Written by Bob (SM) 2026-11-21 · Source: discrepancy-report §1/§3/§5/§7 + decisions.md + design/output-spec.md (all component classes, states, per-tool mapping).
> **BMAD review: APPROVED (self, 2026-11-21)** — renderer + registry live in one file per change; new pages reuse it; ships AFTER backend deploy (backend-deploys-first rule).

## Story

**As a** visitor on vyotish.com, **I want** every calculator to show a clear verdict headline, meaning text and aligned detail blocks at any viewport, **so that** I get "all the details" with correct alignment — the owner's two complaints.

## Scope — frontend repo only (`Astro-Frontend`); ship-gate: backend live-verified first; push to main auto-deploys vyotish.com (D8)

### AC-1 Registry endpoint/param fixes (dead pages → working, QB-03/04/QF-01)
In `frontend/src/pages/calculators/[tool].astro` registry:
- `mangal-dosha`: endpoint `/api/v1/kundli` → `/api/v1/calculators/mangal-dosha` (new GET route), add optional `gender` select via BirthForm extraFields (D-QB09).
- `kaal-sarp`: endpoint → `/api/v1/calculators/kaal-sarp`.
- `names` kind first-name input: `name=` → `name="a"` (API requires `a`/`b`); remove the spurious optional Date field on name-pair pages (QF-20) — `names` kind renders only the two name inputs.
- `vehicle-number`: kind gains plate input (`plate`, required) + owner date (D-QN03); registry note updated.
- `mobile-numerology`: placeholder/validation copy "10 digits (or +91 …)"; `name-numerology`/`numerology` gain optional owner `date` field (API verdict).
- `sade-sati`/`sun-sign`/`moon-phase`/`age`: add the new optional fields the API now honours (`as_of`, time+place optional, age "Age at date").
- Featured-card links (calculators hub) retarget nakshatra/lagna/vimshottari-dasha to the 3 new pages (D-pages).

### AC-2 Shared results renderer per output-spec §1–§3
Replace `renderObject` flat dump with block renderer emitting spec classes (`.verdict-card`, `.chip`, `.meaning`, `.detail-card`, `.row/.k/.v`, `.table`, `.loshu`, `.flagline`, `.status-chip`, progress bar). A per-tool small map (in the same file or a helper) decides which API fields go to B1 headline vs B2 chips vs B4 details per output-spec §4 table. Unknown keys still render as detail rows (honesty rule — never hide data). States: empty/loading(`aria-busy`)/error(API message)/results.

### AC-3 CSS: `is:global` for renderer classes (root-cause fix for "alignment")
The result-region styles move to a scoped `is:global` block (or shared stylesheet) so JS-injected nodes match — established fix pattern. Grid `.row` ≥480px: `minmax(140px,200px) 1fr`; ≤480px stacked (UX audit F8). `.table` max-width 100% with horizontal scroll wrapper on mobile (transits 1825px bug). Dark mode via existing token aliases only.

### AC-4 Three new calculator pages (D-pages)
- `/calculators/nakshatra`, `/calculators/lagna`, `/calculators/vimshottari-dasha` as registry entries (kind `birth`), each with title/hi/description; they render through the same renderer (dasha gets the timeline-bar + antardasha `.table` presentation per spec §5.2).
- Sitemap/hub inclusion via the existing registry-driven hub (verify hub lists them; `astro check` + build).

### AC-5 Build, e2e, a11y
- `bun run build` clean; `bun scripts/preview-static.ts` smoke on :4321.
- Extend `qa/e2e-calculators-regressions.mjs` UI section: all previously-dead pages now render rows (QB-03/04/QF-01 flip to PASS); add axe AA light+dark on rashi, dasha, lo-shu, transits pages (the QA-sweep standard); screenshots 360/768/1024/1440 regenerated to `_bmad-output/calculators/qa/shots-after/`.
- Visual check: no `.k/.v` glued labels; Lo Shu renders 3×3; transits is a table; FLAMES shows trace.

### AC-6 BMAD review + commit hygiene
Review-before-commit; single-purpose commits (renderer fix / registry fix / new pages); bun.lock only; ≤300-line guidance respected by extracting per-tool headline map to a helper module if `[tool].astro` grows past it.

## Non-goals
No new colours/fonts/icons; kundli/matching pages untouched; no analytics changes beyond existing `vyTrack` event.

## Test plan
Same harness as the QA sweep (build-before-e2e gotcha; consent check disabled in e2e; Chrome channel). Acceptance evidence: regressions.json 26/26, responsive report regenerated, screenshots committed under `_bmad-output/calculators/qa/shots-after/`.
