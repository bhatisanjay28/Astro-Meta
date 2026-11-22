# Story S20 — alignment sweep: booking-form field overlap + focus-under-header, plus a repeatable alignment gate

**Date:** 2026-11-22 · **Owner request:** "Alignment of preferred date in poojan section and Topic in consultations section (Request a consultation) are overlapping with other tab. Fix this… cross check on entire website if any mis-alignment is found and fix it. we have done this sweep many times and still finding such issues."
**Pinned:** frontend (`styles/base.css`, `BookingForm.astro`, `LegalPage.astro`) · QA: `_bmad-output/alignment-sweep/qa/`

## Problem (owner)

- On `/poojan/` the **Preferred date** field visibly collides with the neighbouring **Gotra** field; on `/consultations/` the **Topic** select and right-column fields run past the form panel's right padding.
- Fields scroll **under the sticky header tabs** when focused/tapped or when anchors jump (content hidden behind "Consultations / Horoscope / …").
- Meta-complaint: manual sweeps keep finding this class of bug — the fix must include a **repeatable automated gate**, not another one-off pass.

## Root-cause audit (measured, not eyeballed)

Probe: `qa/measure.mjs` — bounding rects of every control in each BookingForm surface (index + detail × poojan/consultations), 3 viewports.

**Finding 1 — the grid was never wrong; the controls were.**
Form grid tracks measured `469px 469px` (correct), but every `w-full px-3 border` control measured **495×62px**:
`495 = 469 (cell) + 24 (px-3) + 2 (border)`, `62 = 44 (min-h) + 16 (py-2) + 2`.
→ controls rendered at the **browser-default `content-box`**. `tailwind.css` is deliberately *utilities-only, NO preflight* (legacy pages keep their own base CSS), and nothing else on the site declared `box-sizing: border-box` (verified: 0 hits across all built stylesheets). The `DateField` `.dt-box` set `border-box` explicitly — which is why **the date field looked correct while its neighbours bled 13px into the 12px gap** (`bk-gotra × dt-box overlap = 14px`), and right-column controls overhung the panel padding by 26px (1px past the panel border). Every `w-full` user site-wide (8 files: BookingForm, BookingModal, BirthForm, HomePanchang, HomeKundli, NewsletterForm, matching, index) carried the same latent defect; 2-column grids merely made it visible.

**Finding 2 — no `scroll-padding-top` on the scrollport.**
Stuck header height measured **82px** (desktop) / **75px** (mobile+tablet); the only scroll clearances on the site were per-element (`BookingForm` `scroll-mt-24`=96px on the form root, `LegalPage` headings 88px — the latter *under* the 82px header). Individual inputs carry no scroll-margin, so a tap/tab/label-click/autofill that scrolls a field into view landed it **flush at y=0, fully under the header tabs** (measured: every field `top=0` vs header 151px at scroll-0 incl. utility strip). Homepage section anchors (`#kundli-section`, `#panchang`, `#consultations`, `#glance-h`) had the same defect.

## Fixes (fix-where-it-belongs)

1. **`src/styles/base.css`** — declare the missing preflight subset, once, globally:
   `*, ::before, ::after { box-sizing: border-box }` (layer base; utilities still win; explicit rules like material-icons' `content-box` out-specify the universal).
   And `html { scroll-padding-top: 6rem }` — clears both stuck-header sizes with air; covers **every** focus/anchor scroll site-wide (forms, legal TOC, homepage anchors), the mechanism Tailwind preflight would have shipped.
2. **`BookingForm.astro`** — `scroll-mt-24` → `scroll-mt-2` (global padding now owns the header clearance; 96+96 would double the gap).
3. **`LegalPage.astro`** — heading `scroll-margin-top: 88px` → `10px` (88 sat under the header; global padding replaces it).

## Found by the sweep (the gate paying off immediately)

**Finding 3 — `/calculators/lo-shu/` mobile: picker overlaps the Calculate button (40×40 full overlap).**
Two stacked causes: (a) the form grid (`grid-cols-2` at base) gives each cell ~160px while the composite picker needs ~230px+ — the exact trap `BirthForm.astro` already documented and dodged in S18 with `col-span-2 sm:col-span-1`; (b) **the span class never reached the DOM** — `[tool].astro` passed `className="col-span-2 sm:col-span-1"` to `DateField`, which destructures only `class` (`class: className`); in Astro the prop is literally named `className` and was **silently dropped**, so the picker auto-placed into one cell. BirthForm was immune only because it wraps its pickers in a div.
Fixes: `className=` → `class=` on both `[tool].astro` call sites, and `DateField` now accepts `className` as an alias of `class` so this class of silent drop can never recur.

**Finding 4 — `/kundli/`: required `*` dropped to its own line under Birth date / Birth time / Place of birth.**
`.kl label { display: grid }` (a rule written for the pre-component form) turns the label's text node and the `*` span into two grid rows. Selector now `:not(.dt-label):not(.pp-label)` so shared-component labels keep their inline star.

**Finding 5 — owner find during review: Phone placeholder `+91 …` reads as a low-hanging dash.**
The text line is vertically centred (44px input, symmetric padding — verified); the **ellipsis glyph draws its dots on the baseline**, so standalone `+91 …` looks misaligned. Replaced with the example-format placeholder `+91 98765 43210` — same as `BookingModal.astro` already used (the in-repo precedent). Placeholder audit across `src/` (19 unique strings): the only orphan-glyph placeholder; also unified `Search calculator...` (three ASCII periods) → `Search calculators…` to match the sibling `…`-style search placeholders.

## The repeatable gate (`qa/sweep.mjs`)

Owner's real ask: stop rediscovering this class of bug. The sweep is a standing artifact, re-runnable against any build:

- **42 representative pages** covering every template family (home/hi, legal ×6, admin ×4, learn, blog ×3, calculators ×9, compatibility pair, consultations ×2, gemstones, horoscope ×2, kundli, matching, muhurat, panchang ×2, poojan ×2, 404, coming-soon) × **3 viewports** (1366/1024/390).
- Detects, per page: (A) pairwise bounding-box **overlap** among leaf controls (labels, inputs, selects, textareas, visible buttons, `.dt-box`), (B) **horizontal overflow** (`scrollWidth > clientWidth`), (C) **focus-under-header** (every focusable below the header in document order, scrolled `block:start`, must clear the stuck header). Consent banner auto-acknowledged; header-internal chrome and the utility strip excluded by design.
- Plus full-page screenshots (laptop/mobile × light; dark on key pages) → `qa/shots/` for the visual pass.

## Results

Final gate run (after all fixes): **0 findings across 42 pages × 3 viewports** (see `qa/findings.json`). S18 form-validation e2e suite: ALL PASS. Unit tests 5/5. Interim runs caught findings 3–5 above (proving the gate works). Details in `QA-REPORT.md`.
