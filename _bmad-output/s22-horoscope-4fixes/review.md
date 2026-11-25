# BMAD Code Review — S22 Horoscope 4 Owner Fixes

**Date:** 2026-11-25 · **Reviewer:** QA role (per DECISIONS.md manual BMAD process) · **Verdict:** ✅ **APPROVED** — no blocking findings; 3 advisory notes recorded.

**Story:** `story.md` (same folder) · **Scope:** frontend repo ONLY — backend has **zero** changes (all Hindi content already lived in Supabase; only page chrome was missing, per D12).

## Files reviewed (frontend, 17)

| # | File | Change |
|---|------|--------|
| 1 | `src/components/horoscope/SignPage.astro` | NEW — shared EN+HI sign×period body (both routes) |
| 2 | `src/components/horoscope/HubPage.astro` | NEW — shared EN+HI hub body |
| 3 | `src/pages/horoscope/[sign]/[period].astro` | Rewritten as thin EN wrapper |
| 4 | `src/pages/hi/horoscope/[sign]/[period].astro` | NEW — 72 HI twin pages (12×6) |
| 5 | `src/pages/horoscope/index.astro` | Thin EN wrapper |
| 6 | `src/pages/hi/horoscope/index.astro` | NEW — HI hub |
| 7 | `src/components/home/HomeHoroscope.astro` | lang prop + item-2 href carry (syncHrefs) |
| 8 | `src/pages/hi/index.astro` | Hindi widget mount + honest en-note |
| 9 | `src/layouts/Base.astro` | exact-counterpart switcher hrefs; Footer lang |
| 10 | `src/components/UtilityBar.astro` | enHref/hiHref props (defaults keep old behaviour) |
| 11 | `src/components/Header.astro` | nav hrefs via `withLang` (CTA stays EN) |
| 12 | `src/data/navigation.ts` | `withLang()` helper (/hi prefix only for /horoscope*) |
| 13 | `src/components/ExploreTiles.astro` | lang prop + withLang + Devanagari fonts |
| 14 | `src/components/Footer.astro` | lang prop + portal links via withLang |
| 15 | `src/components/HoroscopeSidebar.astro` | item 1 (reviewer sentence + dead CSS removed); lang-aware labels |
| 16 | `src/components/HoroscopeDetail.astro` | lang/signHi props; dual Sade-Sati detection (EN+HI labels) |
| 17 | `src/pages/sitemap.xml.ts` | +73 /hi/horoscope entries (no fake lastmod) |

Meta repo (not yet committed): `qa/e2e-s22-horoscope.mjs` (NEW), `qa/e2e-s16-datetime.mjs` (suite fix — see Advisory 1).

## Owner-item traceability

1. **Reviewer sentence removed** — source grep (en+hi) + dist sweep 0 hits; trust card intact with heading (no empty box). e2e-s22 asserts on all 144 pages + 2 hubs.
2. **Tab → href period carry** — `syncHrefs()` on load + every tab click; mapping today→daily, others 1:1. Browser-verified: EN 6 tabs × 12 cards, HI 3 tabs; e2e asserts exact hrefs.
3. **All-12-Signs picker bilingual** — zodiac EN name + Devanagari name chips on every page/period; e2e asserts 12+12 per page across all 144.
4. **Hindi horoscope works** — cause: content existed in DB (daily 120/120, weekly/monthly/yearly 24/24/lang, 9/9 bilingual blocks); pages never read/served it (EN-only routes). Fix: 73 prerendered /hi/horoscope pages + Hindi chrome + lang-param API fetch; language carries home→hub→sign→period via exact switcher counterparts + hreflang pairs; fail-soft honest line if a field is missing. **Nothing missing — no content to invent.** Layout verified 360/768/1024/1440 (no horizontal overflow, 20 full-page shots); axe strict light+dark 0 violations.

## Review notes

- **Astro gotchas respected:** SIGNS/PERIODS inside `getStaticPaths` (worker-build hoisting); `class:list` (never spread-merged attrs); trailing-slash hrefs; scoped CSS via parent classes, `:global()` where needed.
- **Devanagari typography:** conditional classes (`hz-hi`, `hzd-hi`, `hzs-hi`, `hz-home-hi`, `explore-hi`) swap to self-hosted Noto Sans Devanagari — Latin display faces carry no Devanagari glyphs. h1 parenthetical uses short `zodiac` on HI pages (avoids "Simha (Leo)" double-paren bug — found in QA, fixed).
- **Honest fallbacks only:** untranslatable targets (calculators, consultations CTA, legal) stay EN with `withLang` no-op — never dead links; hi home states the staged rollout plainly. Sample rows show नमूना line without a dated frame.
- **D12 boundary held:** sign identity/chrome = frontend config; all reading text = API per lang.
- **Hygiene:** new inline-script comment written visitor-neutral after dist sweep flagged "S22" (S19 gate). Dist sweep CLEAN: 18/18 banned patterns 0 files (incl. owner name, localhost, internal paths), re-swept after final rebuild.

## Advisory notes (non-blocking)

1. **`qa/e2e-s16-datetime.mjs` date-rot (fixed in this bundle):** D-05/D-30 hardcoded "tomorrow = 23/11/2026"; on 2026-11-25 that date is past and the birth preset correctly accepts it → 2 false failures. Suite now computes TOMORROW dynamically and honours `HZ_BASE` like the other suites (the hardcoded BASE had silently ignored the live-vs-local override). Verified: 59/59 local AND 59/59 live — confirms it was test rot, not a product bug; live product passes with today's date.
2. **Pre-existing blemish, OUT of scope (not fixed):** ExploreTiles on hi home renders raw Material icon names as visible text ("support_agent"); identical on live vyotish.com. Recommend a small follow-up story.
3. **`Base.astro` enPath uses `startsWith("/hi")`** — a future route like `/hindi-*` would misroute the switcher. No such route exists today; noted for the future /hi rollout epic.

## Gate evidence (all green, final build 23:34)

biome lint clean · `astro check` 0 errors/0 warnings · build OK · unit 5/5 · e2e-horoscope **72/72** · e2e-s22 **ALL PASS** (144-page static sweep + interactive + axe + layout) · e2e-megamenu ALL PASS · e2e-aria ALL PASS · e2e-contrast strict light+dark ALL PASS · e2e-s16-datetime **59/59 local + 59/59 live** · regressions-local **23/0** · dist sweep CLEAN.
