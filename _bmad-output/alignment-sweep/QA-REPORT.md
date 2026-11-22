# QA Report — S20 Alignment Sweep

**Date:** 2026-11-22 · **Scope:** owner-reported overlaps (poojan Preferred date, consultations Topic) + site-wide alignment audit + owner find (phone placeholder)
**Tooling:** Playwright (system Chrome) against the built `dist/` on the static preview server · all measurements are bounding-box geometry from the live DOM, not screenshots.

## 1. Defects found & fixed

| # | Surface | Defect | Root cause | Fix | Evidence |
|---|---------|--------|-----------|-----|----------|
| 1 | BookingForm ×4 (poojan, consultations, both detail pages) | Left-column controls overlap right-column by 14px (`bk-gotra × dt-box`); right-column controls overhang panel padding by 26px (1px past the border) | `tailwind.css` is utilities-only (no preflight) and nothing set `box-sizing: border-box` — every `w-full px-3 border` control rendered content-box: 495px wide × 62px tall in a 469px cell | `base.css`: `*, ::before, ::after { box-sizing: border-box }` | `measure.mjs` before/after: overlaps 3→0 per page; widths 495→469/453 (= cell) |
| 2 | Every page, every focusable | Tap/tab/label-click scrolls fields flush to y=0 — hidden under the 75–82px sticky header ("overlapping with tabs") | No `scroll-padding-top` on the scrollport; only per-element margins (form root 96px, legal TOC 88px — the latter *under* the header) | `base.css`: `html { scroll-padding-top: 6rem }`; trimmed the now-redundant `scroll-mt-24` (form) and 88px (LegalPage) | `measure.mjs`/`sweep.mjs`: focus-under-header N→0; fields land at y=96 vs header 82/75 |
| 3 | `/calculators/lo-shu/` @390px | Calendar trigger fully overlaps the Calculate button (40×40px) | (a) `grid-cols-2` base gives ~160px cells; picker needs ~230px+ (the trap BirthForm dodged in S18); (b) `[tool].astro` passed `className=` but `DateField` destructures only `class` → **span class silently dropped** | `className=` → `class=` (2 call sites); `DateField` now accepts `className` as an alias so the drop can't recur | `loshu.mjs`: `.dt` col-start `auto` → `span 2`; button moves to its own row (y 461→517) |
| 4 | `/kundli/` | Required `*` renders on its own line under Birth date / Birth time / Place of birth | `.kl label { display: grid }` predates the shared components; grid stacks label text and `*` span as two rows | Selector → `.kl label:not(.dt-label):not(.pp-label)` | `kundli-form-after.png`: stars inline |
| 5 | BookingForm phone field (×4 surfaces) | Placeholder `+91 …` reads as a low-hanging dash — ellipsis glyph draws dots on the baseline (text line itself is centred: 44px input, 8/8 padding, verified) | Cryptic placeholder glyph | `+91 …` → `+91 98765 43210` (matches BookingModal precedent); audit of all 19 unique placeholders in `src/` also unified `Search calculator...` → `Search calculators…` | `phone-field-zoom.png` vs `phone-field-after.png` |

## 2. Site-wide gate (`sweep.mjs`) — re-runnable

42 representative pages (every template family) × 3 viewports (1366 / 1024 / 390). Per page:
- **A. control-vs-control overlap** (pairwise rects, >2px both axes, ancestor pairs excluded)
- **B. horizontal overflow** (`scrollWidth > clientWidth`)
- **C. focus-under-header** (focusables below the header in document order, scrolled `block:start`, must clear the stuck header; header chrome + utility strip + skip-link excluded by design; consent banner auto-acknowledged)

**Final run: 0 findings** (after fixes 1–5; interim runs caught 3–5 — the gate demonstrably works). Results: `findings.json`. Full-page shots: `shots/` (laptop/mobile × light; dark for home, kundli, matching, rashi, poojan, consultations, privacy, admin) — visually reviewed, no regressions from the border-box change (home hero/forms, admin login card, kundli row, headers, footers all intact).

## 3. Regression

- S18 form-validation e2e (all birth-detail forms): **ALL PASS** (re-run after every fix batch)
- `date-time-core` unit tests: **5/5 pass**
- No test/script referenced the changed placeholder string (grepped before editing)

## 4. Verification shots (after fixes)

- `poojan-index-laptop-light.png` / `cons-index-laptop-dark.png` / `cons-index-mobile-light.png` — columns flush, no overlap, symmetric gutters
- `kundli-form-after.png` — inline stars, aligned picker row
- `phone-field-after.png`, `home-search-after.png` — clean placeholders
