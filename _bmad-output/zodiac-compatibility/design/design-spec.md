# Zodiac Sign Compatibility — Post-Build Design Spec (Sally, UX)

Written 2026-11-22 · BMAD Epic ZC · Design validation + polish handoff.
**Supersedes the ZC-1 pre-build handoff of the same file for polish purposes** — the feature is already built and working; nothing below is a redesign request.

- Stitch project: `projects/7000631376845729468` (Vyotish — UX Designs (Sally), Vedic Serenity design system `assets/3979a94b895743cdad7c61609ae09bf8`)
- Stitch reference screens used for comparison (existing, DESKTOP + mobile variants of the same two layouts):
  - Hub desktop: "Vyotish - Zodiac Sign Compatibility (/compatibility)" — `projects/7000631376845729468/screens/15a0d07026e347c69eacfd3d0871e725` (2560×3196)
  - Hub mobile: "Vyotish - Zodiac Sign Compatibility (Mobile)" — `projects/7000631376845729468/screens/964b8d1f184d45879d2fe5309e8c1294`
  - Pair-result desktop: "Vyotish - Aries & Taurus Compatibility Result" — `projects/7000631376845729468/screens/a6461ee0a22745a48bcd231798c7c100` (2560×3608; full HTML artifact reviewed: `…/files/373d948db4ec447e880ac7cc5f84eb6a`)
  - Pair-result mobile: "Vyotish - Aries & Taurus Compatibility Result (Mobile)" — `projects/7000631376845729468/screens/006e9fbed48f4595ab908761eb0e5cf5`
- Tooling note: fresh dark-theme regeneration attempts for "Aries & Leo 91/Excellent" today (4 × `generate_screen_from_text`, DESKTOP) all hit the MCP 30 s timeout and never persisted — the project stayed at 17 screens through ~35 min of polling. Per the no-regenerate rule, generation was stopped and the comparison above was done against the existing Stitch screens of the same two layouts. No Astrotalk content was used anywhere; all sample copy in this spec and in the Stitch mocks is original Vyotish wording.

Sources of truth for this spec: `frontend/src/styles/tokens.css` (D11 alias layer), `frontend/src/pages/compatibility/index.astro`, `frontend/src/pages/compatibility/[sign1]/[sign2].astro` (`is:global` block, lines 260–334), `frontend/src/scripts/compatibility-render.ts`. Where Stitch and the site differ slightly, **tokens.css wins** (established practice).

---

## 1. What the current build already matches — validated

Verified against tokens.css, the three page implementations and the Stitch reference screens:

1. **Content width & page rhythm** — 900px max-width with `padding: var(--space-6) var(--space-4) var(--space-8)` on both hub and pair pages; identical to the `.mx` wrapper on /matching. Stitch mock's centered canvas maps 1:1.
2. **Typography ladder** — h1 `--font-display` `clamp(26px, 5vw, 38px)` ivory, lede 14.5px `--text-muted`, breadcrumb 12.5px with gold links, kicker 12px uppercase 0.08em gold. Matches the sibling-page convention and the mock's display/label roles.
3. **Verdict card anatomy** — `.zc-overall` uses the site's calculator-renderer B1 pattern: `--color-primary` fill, `--color-on-primary` ink, `--border-emphasis` border, eyebrow "Overall compatibility" 11px/0.12em, score `clamp(28px, 5vw, 40px)` display serif with small "/ 95" range at 85% opacity, band word in a white-outline chip (`rgba(255,255,255,0.14)` bg / `0.35` border, 12px/600), verdict sentence, honest-range note. This is the same anatomy as the Stitch verdict card ("OVERALL COMPATIBILITY · 42/100 · chip · sentence · method line") remapped to site tokens.
4. **Honest score scale** — "/ 95" max on overall and category scores; the unverified line "Interpretive method — scores sit in an honest 35–95 range." is always visible, never hover-only (P11 convention). The mock showed "/100"; the build's honest scale is the correct, shipped divergence.
5. **Band accents, colour-alone rule** — category-card border accents use theme-aware status tokens (`--color-auspicious-text` for excellent/strong, `--color-warning` #b45309 for mixed, `--color-inauspicious-text` for challenging/very-challenging) and are always adjacent to the score number and category word — never colour alone (tokens.css header rule). Dark-theme values (#6fcf8f / #f2a5a0) verified AA. The Stitch mock is monochrome here; the build is deliberately richer and correct.
6. **Category cards** — `--bg-raised`, 1px `--color-border`, `--radius-card`, padding `--space-4`; head (14px label + 20px/700 score + 11px "/95"), 6px pill bar with `--gold` fill, 13px/1.65 explanation. Same anatomy as the mock (label + score, 6px bar, explanation) at the site's token values.
7. **Fact chips** — pill chips in `--color-tint`, uppercase 11px dim label + value, flex-wrap with `--space-2` gap; aspect chip carries degrees ("Trine · 120°"), shared-ruler chip carries the disputed suffix. Matches the mock's chip row concept and the site `.chip` pattern.
8. **Hub picker** — raised panel, 1px `--color-border-strong`, two labelled native selects (min-height `--target-min`, `--color-tint` fill), 44×44 outlined swap button, gold pill CTA (hover `--gold-bright`, disabled 50% until both signs chosen), helper line 12.5px dim. Matches the mock's picker card and the pre-build behaviour spec §1.3.
9. **Hub how-it-works** — 3 numbered steps (26px circles, tint fill, gold-soft border), 3-col ≥640px, tint step tiles. Matches mock step strip.
10. **12-sign grid** — 2 cols mobile → 6 cols ≥640px, raised cards, gold 22px glyph, 13px name, 12px Hindi name, hover `--border-gold-soft`; same-sign canonical URLs. Matches mock sign grid (6/3/2 variants differ only in density, see §4).
11. **Method/disclaimer strips** — tint panels, weak `--color-border`, 12.5–13px dim text; used identically on hub strip, result note strip, and Vedic cross-link band. Consistent across both pages and with the mock's footer aside.
12. **JS-injection styling** — result markup is injected at runtime, so all result styles live in the `is:global` block keyed off `[data-zc-result]`; Astro scoped CSS cannot match injected nodes. The established root-cause pattern is applied correctly.

---

## 2. Polish deltas — concrete, small, CSS-touch only

Max six; each is a token/line-level change. No layout rewrites, no new features.

### D1. Fact-chip value hierarchy
- **Element:** `.zc-chip` fact chips on the pair result (renderer `chip()` in `compatibility-render.ts`; CSS `[sign2].astro` lines 293–298).
- **Current:** whole chip text is 12.5px `--text-muted` and the label part is 11px `--text-dim` uppercase — label and value sit in the same low-contrast register, so the data layer (Trine · 120°, Mars · Sun) reads dimmer than surrounding body copy.
- **Proposed:** value at `--color-text` (or `--ivory`) 12.5px/500, label stays 11px `--text-dim` uppercase. One-line CSS: `[data-zc-result] .zc-chip { color: var(--color-text); font-weight: 500; }` (label span overrides back to dim/400).
- **Why:** the Stitch chip pattern is muted label + semibold on-surface value; facts are the skimmable data row and deserve value-level contrast. Pure CSS, zero structure change.
- **CSS-touch:** 2 lines in the `is:global` block.

### D2. Long fact-chip overflow guard (375px)
- **Element:** `.zc-facts` / `.zc-chip`.
- **Current:** chips are `inline-flex` with no width cap. The shared-ruler chip can carry the suffix "(traditional — disputed by modern astrologers)" — at 12.5px that is wider than the ~300px content column at 375px, forcing horizontal page scroll.
- **Proposed:** `[data-zc-result] .zc-chip { max-width: 100%; }` (chip text then wraps inside the pill).
- **Why:** belt-and-braces for any API-authored long value; mirrors matching.astro's F2 "never push the page wide" rule.
- **CSS-touch:** 1 line.

### D3. Hub picker stacking on small phones
- **Element:** `.zc-fields` / `.zc-swap` on `/compatibility` (hub `index.astro` lines 172–186).
- **Current:** `flex-wrap` with labels at `flex: 1 1 200px` and the 44px swap between them. At 375px the row wraps as *field-1 + swap* on line one and *field-2* on line two — the swap glyph visually attaches to field 1 and reads as misalignment.
- **Proposed:** `@media (max-width: 480px) { .zc-fields { flex-direction: column; align-items: stretch; } .zc-swap { align-self: center; margin: -6px 0; } }` — deliberate vertical stack, swap centred between the two selects (matching pre-build spec §1.2 and the F8 stacking pattern on /matching).
- **Why:** predictable stacking beats accidental wrap; keeps the swap metaphor intact.
- **CSS-touch:** 1 media query, ~4 lines.

### D4. Hub CTA full-width on mobile
- **Element:** `.zc-check` button.
- **Current:** inline-width pill at all breakpoints (only `--zc-vedic-btn` has the ≤639px full-width rule).
- **Proposed:** `@media (max-width: 639px) { .zc-check { width: 100%; } }` — mirrors the existing `.zc-vedic-btn` rule directly below it and the pre-build spec's thumb-reach note.
- **Why:** the primary action of the page should be the widest, easiest target on phones; consistency with the sibling CTA on the same page.
- **CSS-touch:** 1 line (folded into the D3 media query block or the existing 639px one).

### D5. Result section titles in display serif
- **Element:** `.zc-section-title` ("How the two signs compare", "Relationship tips for this pairing").
- **Current:** 16px/500 ivory in the body font.
- **Proposed:** add `font-family: var(--font-display); font-size: 17px;` (colour and margins unchanged).
- **Why:** the site's in-result heading convention is display serif (matching.astro `.result h3` uses `--font-display`; the h1s on both compatibility pages are display). Stitch mock also renders section headings in the display face (Cinzel stand-in). One property restores the serif-heading rhythm inside result content.
- **CSS-touch:** 1 line.

### D6. Related-link tap targets on the pair page
- **Element:** `.zc-more` links ("Vedic Kundli Matching →", horoscopes).
- **Current:** bare 13px inline links (~19px hit height) in a flex row — below the site's `--target-min: 44px` rule.
- **Proposed:** `.zc-more a { display: inline-flex; align-items: center; padding: 12px 0; }` (≈43–44px height; no visual change beyond spacing).
- **Why:** token rule `--target-min` is applied to every other interactive element on these pages; this is the one row left under target.
- **CSS-touch:** 1 line.

---

## 3. Mobile notes @ 375px

**Selector stacking**
- Hub (D3): without the fix, wrap order is field-1 + swap / field-2; with it, Your sign → swap (centred) → Partner's sign → full-width CTA (D4). Selects keep 44px min-height and `--color-tint` fill; labels 12.5px dim.
- Pair page picker ("Check another pairing"): same `.zc-fields` pattern rendered inside the pair page — apply the identical ≤480px rule there so both pickers behave the same. Prefilled selects make the stacked form a 2-tap path to the next pairing; keep it below the result (current DOM order is correct for the "check another pairing" job, no reorder needed).

**Chip wrapping**
- `.zc-facts` chips wrap cleanly with 8px gaps at 375px; the only risk is the long shared-ruler chip → covered by D2 (`max-width: 100%` + in-chip wrap). Never truncate a chip mid-value (matches pre-build spec §2.2).
- Band chip and overall score block: `.zc-score-block` is `flex: 0 0 auto` and `.zc-overall-copy` wraps below it at ~260px basis — score on its own line, then eyebrow/chip/verdict. Correct reading order (score → band → verdict), no change needed.

**Card order**
- Pair page (single column): overall verdict → fact chips → ruler note → "How the two signs compare" (6 cards, 1-col ≤639px in DOM order Love → Sexual → Friendship → Communication → Trust → Emotional) → tips → method/disclaimer strip → picker → related links. DOM order = visual order = screen-reader parity; keep it.
- Hub: hero → picker → 3 steps (1-col) → 12-sign grid (2 cols) → grid note → method strip → Vedic band (copy above, full-width button below via the existing ≤639px rule). No reorder needed.

---

## 4. Deliberate divergences from the Stitch mock — do not "fix"

1. **2-column category grid (≥640px) instead of the mock's 3 columns.** Explanations are never truncated in the build; the mock clamps to 2 lines (`line-clamp-2`). Honesty of copy beats density — keep 2 cols at 900px content width.
2. **No 80px medallion pair-header card.** The build uses the h1 "Aries & Leo" with gold 0.7em glyphs + lede, then facts as chips under the verdict card — fewer stacked cards above the fold on mobile. Keep.
3. **"/ 95" honest range vs the mock's "/100".** Backend-authored scores sit in 35–95; the UI must keep showing the true scale.
4. **Band accents on category cards.** The mock is monochrome; the build adds theme-aware status borders paired with the score word/number. This exceeds the mock in the right direction (tokens.css "never colour alone" rule) — keep.
5. **Monochrome verdict card with the band word in a chip** (not a coloured band banner). Matches B1 and keeps AA in both themes; band colour lives on category cards only.

---

*Design-only handoff. No frontend/backend source files were modified — all deltas above are proposals for Dev, each ≤ ~4 CSS lines. Sample copy anywhere in this spec (Aries & Leo 91/Excellent wording used in the generation prompts, mock chip values, tips) is original Vyotish writing; no competitor content was copied.*
