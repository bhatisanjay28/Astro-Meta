# QA Report — S20 astro-check errors cleared

**Date:** 2026-11-22 · **Verdict:** ✅ **PASS** — `bunx astro check`: **0 errors** (was 7)

## Fixes verified

| Site | Fix | Evidence |
| --- | --- | --- |
| DateField.astro ×5 ts(2322) | `inputmode: "numeric" as const` (one line in `segProps`) | astro check 0 errors; `dist/kundli/index.html` **byte-identical** to the pre-fix build — compile-time only, no runtime delta |
| compatibility/index.astro:139 ts(18047) | `if (!key) return;` after `canonicalPairSlug` | Guard present in built bundle (`if(!a)return;`); inline comment in source |
| compatibility/[sign1]/[sign2].astro:187 ts(18047) | same guard in `navigate()` | same pattern, same file bundle |

## Acceptance criteria (from story.md)

1. **astro check 0 errors, 0 warnings, 9 hints** ✅ (92 files)
2. `bun test scripts/` — 5 pass / 0 fail (18 assertions) ✅
3. `bun run build` complete ✅; dist identity spot-check: kundli identical; the compatibility page's only diff is its own script-bundle hash (the guard — the intended change) ✅
4. Preview navigation: `/compatibility/` → select Leo+Aries → submit → lands on `/compatibility/aries/leo/` ✅

## Notes

- The 2 remaining `ts(80006)` / `ts(6133)` items were **warnings**, not errors — they never failed CI and are untouched (non-goal per story).
- Unrelated finding documented while here: graha-shanti-puja / satyanarayan-puja / rudrabhishek-puja return 404 because their DB rows are `is_active=false` (admin-deactivated near-duplicate seed rows of the 3 live pujas) — the API correctly filters them and `getStaticPaths` bakes only active rows. **Working as designed; no change made** (flagged in S19 QA-REPORT live-verification note).
- Frontend CI (`bun run check`) should now go green on the next push.

## PHASE 2 (2026-11-22, post-push) — CI `lint` leg: biome red → green + gate fixes

Pushed S20 revealed the CI `build` job fails in `bun run lint` (biome) — pre-existing since
before S19, invisible locally. Cleared in this phase:

- **24 biome violations** (CI's log showed the first 8): all `noNonNullAssertion` in
  DateField/date-time-picker hand-fixed with judgment (`?? ""` keeps identical
  incomplete-handling semantics; hoisted locals replace `ctx.x!`; `onSegPaste` dropped an
  unused param) + `organizeImports`/format across 15 files (also normalized the alignment
  sweep's CRLF edits). `bun run lint` → clean; astro check still 0 errors; unit 5/5; build green.
- **Alignment sweep committed** (abee0f4) — was sitting uncommitted with consent pending; owner's
  "push" covered shipping it. QA gate from its own session: sweep.mjs 0 findings/42 pages×3 viewports.

### Gate fixes the QA suites surfaced (this is why we re-run them)

1. **Muhurat finder city copy (visitor-visible bug):** S18's gate auto-covers every
   `data-place-field="required"`, so the finder's City got "Please select your **place of birth**…"
   — wrong context. Fix: `installFormValidation` gains optional `placeMessage`; muhurat passes
   "Please select the city from the suggestions." (its original inline copy, now unreachable via
   normal submit since the gate blocks first — kept as no-JS fallback).
2. **Picker ✓ announcement erased (a11y bug):** the gate's `place:selected` handler called
   `clear()`, wiping `[data-place-status]` — the same aria-live element the picker had *just*
   written `✓ …` into. Fix: drop only the error state; clear text only while it holds the
   gate's error (`.vy-err`). Caught by place-suite P-01 after the suite was revived.

### QA suites updated to current intended semantics (stale since S18/S16)

- `e2e-s16-datetime.mjs`: **59/59 PASS** (57 original + 2 new per-part pins). D-19/D-26 expect the
  S18 gate messages; D-22/D-28 pick a meridiem before asserting the 24h value, and new D-22a/D-28a
  pin the S18 rule "hh:mm without AM/PM stays empty — no silent AM"; D-41 rewritten: the gate owns
  the empty-city block (capture + stopPropagation, handler suppressed, in-context wording).
- `e2e-place-picker.mjs`: **28/28 PASS** (revived after S16 staleness — it still filled the old
  single `[name=date]` input; now uses the picker's `vyDateTime.set` API). P-05 rewritten for
  gate-owned blocking; P-11a expects the gate's birth-place wording (correct context on calculators).
  One pick() timeout flake observed once (known class), clean on re-run.
- Booking-modal suite untouched (no place fields; gate change is additive/optional param).
