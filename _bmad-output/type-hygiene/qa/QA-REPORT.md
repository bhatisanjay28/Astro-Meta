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
