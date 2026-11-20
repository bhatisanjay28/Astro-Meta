# Lighthouse baseline — local preview, 2026-11-20 (Story S4 / Epic 8.2)

Environment: built `dist/` served by `bun scripts/preview-static.ts` (port 4322),
Chrome 1xx via `bunx lighthouse --chrome-flags="--headless=new"` (default mobile
emulation). Reports: `*.report.json` (+ `.report.html` for run 1). Production
re-run against vyotish.com after the D8 deploy is the owner gate (8.2).

## Scores (category scores ×100)

| page | run | perf | a11y | best-practices | seo | LCP | TBT | CLS |
|------|-----|------|------|----------------|-----|-----|-----|-----|
| / | 1 | 89 | 92 | 100 | 92 | 1.82s | 391ms | 0 |
| / | 2 | **98** | 92 | 100 | 92 | — | 52ms | 0 |
| /panchang/agra | 1 | 88 | 95 | 100 | 92 | 1.36s | 0 | 0.246 |
| /panchang/agra | 2 | 82 | 95 | 100 | 92 | — | 0 | 0.356 |
| /blog/how-the-vedic-panchang-works | 1 | 86 | 95 | 100 | 92 | 1.36s | 0 | 0.267 |
| /blog/how-the-vedic-panchang-works | 2 | 82 | 95 | 100 | 92 | — | 0 | 0.358 |
| /kundli | 1 | **100** | 90 | 100 | 92 | 1.21s | 0 | 0.025 |
| /consultations | 1 | **98** | 95 | 100 | 92 | 1.21s | 0 | 0.080 |

Variance note: run 1 of `/` overlapped the `bunx` package warm-up (TBT 391ms →
52ms on the quiet run) — home clears 90 when the machine is quiet. panchang/blog
persistently fail perf across both runs for one reason: **CLS 0.25–0.36**.

## Findings (numbered, with owners)

1. **CLS on panchang/blog (perf 82–88)** — whole-`main#main-content` shift
   (0.24–0.36) from font-metric swap of display/body faces; kundli (0.03) and
   consultations (0.08) unaffected. Fix = fallback font-metric overrides or
   targeted preloads → **story S12**.
2. **SEO 92 everywhere: `crawlable-anchors`** — header `a.font-label` (Gemstones
   "Soon" chip) has no usable href (Header.astro) → **story S11 (item 1)**.
3. **a11y `aria-allowed-attr`** — `input#hp-place` / `input#hk-place` (HomePanchang
   / HomeKundli PlaceField inputs) carry a role-forbidden aria attribute →
   **story S11 (item 2)**.
4. **a11y `label-content-name-mismatch`** — header brand link `a.flex`
   (Header.astro) accessible name vs visible text → **story S11 (item 3)**.
5. **a11y `heading-order`** (panchang/blog/kundli, not home) — one skipped level in
   shared components → **story S11 (item 4)**.
6. **a11y `color-contrast`** — e.g. `div.consent-stub > button`; palette is
   owner-approved (D11) so the tweak needs an owner nod → **story S11 (item 5)**.
7. **`unminified-javascript` (minor, 0.5-scored)** — an Astro-inlined page script
   ships unminified; candidate micro-fix, not scored-heavy → record.
8. **`font-display-insight` flags the icon face** — `display=block` on Material
   Symbols is deliberate (ligature glyphs, Story S1); accepted, no action.
9. **`cache-insight` / `document-latency` / `network-dependency-tree` /
   `render-blocking` insights** — local-preview diagnostics (no CDN in front);
   re-judge on the production audit after D8.

Verdict vs AC: a11y ≥ 90 ✅ everywhere (92–95); best-practices 100 ✅; perf ≥ 90 ✅
on home (run 2), kundli, consultations; ❌ panchang/blog pending S12; seo 92 →
S11. 8.2 stays 🔶 until the production re-run.
