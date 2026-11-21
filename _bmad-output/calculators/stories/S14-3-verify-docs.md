# S14-3 — Verify + document (Epic 14 story 4: Quinn closes the loop)

> Written by Bob (SM) 2026-11-21 · Source: pipeline Step 2 "Quinn (verify)" + owner rule "BMAD code review before every commit; QA-mindset testing".
> **BMAD review: APPROVED (self, 2026-11-21)** — no product code in this story; evidence + docs only.

## Story

**As the** owner, **I want** independent verification that every fixed calculator now matches Mary's research vectors and renders correctly at four viewports, **plus** updated project docs, **so that** the "no scope of error" bar is demonstrably met and the record is clean.

## Scope — meta repo (Astro-Meta) artifacts + re-runs; no backend/frontend code changes

### AC-1 Regression suite closes green
`bun qa/e2e-calculators-regressions.mjs` against the **deployed** backend + built frontend → **26 PASS / 0 FAIL** (all 17 bug proofs flip; all 8 RG guards + Sydney control hold). Evidence: `_bmad-output/calculators/qa/regressions.json` (new timestamp).

### AC-2 Visual regression evidence
Responsive screenshots at 360/768/1024/1440 for all 20 calculator pages + 3 new pages → `_bmad-output/calculators/qa/shots-after/`; spot-check: no glued labels, Lo Shu 3×3, transits table, dasha timeline; axe AA light+dark on rashi/dasha/lo-shu/transits (QA-sweep standard, strict mode).

### AC-3 Unit test count and CI
Backend `bun test` ≥ 320 tests green on the pushed commit; CI deploy succeeds; spot live-verify: rashi evening fixture, transits Rahu Δ<0.3°, kaal-sarp GET, mangal-dosha GET, lagna GET, nakshatra GET, vimshottari-dasha GET, ishta-devata Shiva vector.

### AC-4 Docs
- Meta `docs/CHANGELOG.md`: S14 entry (root causes + fixes + new routes).
- `_bmad-output/calculators/SUMMARY.md` (pipeline closeout): what shipped, what's deferred (gochara overlay, P11 Jyotishi sign-off), owner actions remaining (frontend push = D8 deploy, Places key unchanged).
- Memory: session file update.

### AC-5 Honest reporting
Final report to owner states exactly what changed, what remains owner-gated (frontend push, disputed ishta-devata rows), and the regression counts — no "done" language for anything unverified.

## Non-goals
No new features. Launch-blockers.md edits only if the push gate actually changes.
