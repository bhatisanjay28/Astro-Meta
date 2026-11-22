# S-ZC-4 — Verify: content gates, QA sweep, BMAD review, docs (Epic ZC story 4 of 4)

> Written by Bob (SM) via orchestrator, 2026-11-22 · Source: master story ACs Q1–Q3 + operating rules (BMAD review before every commit; QA-mindset testing).
> **BMAD review: APPROVED (self, 2026-11-22)** — verification-only story; no behaviour change; gates are hard blockers per master story.

## Story

**As the** owner of Vyotish, **I want** every hard gate proven green before anything is committed, **so that** nothing unoriginal, unthemed, or broken reaches the repos.

## Gates (all blockers)

### AC-1 — Originality (AC-Q1)
- Fetch the reference corpus (Astrotalk pair page + hub, Cafe Astrology grid page if accessible, Astrostyle pair example, ZodiacSign.com pair example — structure URLs already in `../research/sources.md`) into `../research/corpus/`.
- Bun script: normalise text, extract ≥6-gram shingles from corpus, scan every pair record's strings; **zero near-matches** required (allow list: category names, sign names, aspect terms). Report → `../content/originality-check.md` (pairs scanned, n-gram count, findings, verdict).

### AC-2 — Content quality (AC-Q2)
- Banned-words sweep (always/never/guaranteed/destined/doomed/toxic/proven/scientifically + medical/legal/financial claim patterns) across all 78 records.
- Length bounds per block; tips 4–6; both sign names present per record; flagged-pair nuance keywords present (pair-matrix §6 list).
- Style consistency spot-check against Paige's exemplars (first sentence shape, no score mentions, gender-neutral pronouns).

### AC-3 — Visual + a11y sweep (AC-Q3 / AC-F3)
- Build frontend, run strict axe + contrast in light AND dark (S-ZC-3 AC-3 rules, incl. the `@theme`/`:global()` gotchas).
- Full-page screenshots: hub + 4 representative pair pages (Aries–Leo Excellent, Aries–Libra Mixed, Gemini–Pisces Very challenging, Leo–Leo same-sign) × light/dark × mobile/desktop → visual check against Sally's spec.
- Regression: existing QA suites (calculators regression, contrast e2e, logo/eyebrow regressions) stay green.

### AC-4 — Backend verification
- `bun test` full suite green (new + existing); deploy preview via `wrangler dev` and live-check both endpoints (valid, reversed, invalid, same-sign) before any commit/push; backend deploys first at push time (operating rule) — push itself remains owner-gated.

### AC-5 — BMAD code review (no exceptions before commit)
- Review diff per repo: D12 conformance, no-PII, conventions (comment density, naming), test coverage of AC-4 assertions, tokens-only styling, honest error states, no dead code.
- Verdict recorded in `../stories/bmad-review-ZC.md`; any findings fixed and re-reviewed before the owner commit/push gate (G2).

### AC-6 — Docs
- Backend `CHANGELOG.md` + meta `CHANGELOG.md` entries; v1.ts implemented list; epics doc addendum (Epic ZC 1–4 mapping to this story set); memory update at session end.
