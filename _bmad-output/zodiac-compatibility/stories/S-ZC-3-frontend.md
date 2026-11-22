# S-ZC-3 — Frontend: compatibility hub + 78 pair pages + entry points + e2e (Epic ZC story 3 of 4)

> Written by Bob (SM) via orchestrator, 2026-11-22 · Source: master story ACs F1–F3 + `../design/design-spec.md` (Sally, when landed) + D12 thin-renderer conventions.
> **BMAD review: APPROVED (self, 2026-11-22)** — additive pages/routes only; thin renderer preserved (all computation/content via API); tokens.css theming; no nav change. Depends on S-ZC-2 (backend) landing first (backend-deploys-first rule) and on Sally's design spec being mapped.

## Story

**As the** owner of Vyotish, **I want** a compatibility hub with two sign selectors and 78 indexable pair pages rendering results from the backend API, **so that** users get the familiar pick-two-signs flow and search engines can index every pairing.

## Scope — frontend repo only (`Astro-Frontend`)

Files: `src/pages/compatibility/index.astro` (new hub), `src/pages/compatibility/[sign1]/[sign2].astro` (new shared pair template, 78 static paths), `src/pages/astrology/index.astro` (add card to SECTIONS), `src/data/navigation.ts` untouched, `sitemap.xml.ts` (add hub + 78 pair URLs), CSS per Sally's token mapping.

### AC-1 — Hub `/compatibility` (thin renderer)
- Hero (h1 + lede, original copy), picker card: two labelled selects ("Your sign", "Partner's sign" — both from the signs API or a frontend slugs constant mirroring it; same sign selectable), "Check Compatibility" button → client-side navigation to `/compatibility/{sign1}/{sign2}` (wheel-order canonicalisation happens in the URL builder).
- Below the picker: 3-step "how it works" strip; 12-sign chip grid (each chip links to `/compatibility/{sign}/{sign}` — the same-sign page — or opens the picker preselected; simplest: link to same-sign page); method note + guidance-and-entertainment disclaimer strip; cross-link card to `/matching` ("want the Vedic view?").
- Meta title/description original; entry card added to `/astrology` SECTIONS (5th card, title "Zodiac Compatibility", hi "राशि मैत्री", short desc).

### AC-2 — Pair pages `/compatibility/[sign1]/[sign2]` (78 static pages)
- `getStaticPaths` emits exactly the 78 wheel-order pairs (slug order = wheel index order); any other path → 404 (Astro default).
- Shared template renders from the pair API at client load (thin renderer, fail-soft + honest error state per site pattern):
  - Breadcrumb: Compatibility hub → "{Sign A} & {Sign B}".
  - Pair header: both sign names (+ hi names if the pattern exists), facts chips (elements, modalities, aspect + degrees, rulers incl. shared-ruler/disputed flags).
  - Overall block: score (e.g. "82 / 100"), band label, verdict line, verification flag ("interpretive method — not a scientific measure") per site convention.
  - Six category cards (2–3 col desktop grid, stacked mobile): label, score with small bar/ring, explanation text. Keys→labels: love→Love Compatibility, sexual→Sexual Compatibility, friendship→Friendship Compatibility, communication→Communication Compatibility, trust→Trust Compatibility, emotional→Emotional Compatibility.
  - Relationship Tips card (list).
  - Footer strip: inline "for guidance and entertainment purposes only" + method note + cross-links (Kundli matching, today's horoscope).
- Selectors present (prefilled with the page's signs, swap button optional) so users can change pair without going back.
- Loading skeleton / fail-soft error panel mirrors the calculators pattern (honest empty/error states per D12 boundary).

### AC-3 — Theming + a11y (strict harness)
- All styling via tokens.css variables (light + dark) — **no theme-aware tokens inside `@theme`** (QA-sweep gotcha) and **`:global()` for any content injected at runtime** (Astro scoped CSS never matches JS-injected nodes).
- AA contrast in both themes; labels wired to selects; focus order logical; button/select touch targets ≥44px mobile; `aria-live` polite region for result load.

### AC-4 — SEO plumbing
- Both pages: unique original meta title/description (pair pages: "{A} and {B} Compatibility — score, love, trust & more | Vyotish" style, generated per pair).
- `sitemap.xml.ts` += hub + 78 pair URLs.
- Mirrored-order paths intentionally **404** (only 78 canonical pages exist) — no duplicate content.

### AC-5 — e2e (qa harness, meta repo `qa/` conventions)
- Hub: pick Aries + Leo → navigates to `/compatibility/aries/leo` → result renders (score, band, 6 category cards, tips, disclaimer).
- Same-sign: `/compatibility/leo/leo` renders Strong-80 nuance result.
- Direct load of a canonical pair URL renders; unknown pair path 404s.
- Sign-binding check: rendered result mentions exactly the two selected sign names.
- Strict axe + contrast in light AND dark; regression suite stays green.
- Build before e2e (gotcha: build must complete before serving for tests).

### AC-6 — Performance hygiene
- One API fetch per pair page load; no layout shift from result render (reserve min-height for the result region — CLS gotcha from Lighthouse baseline on panchang/blog).

## Non-goals
No Hindi pages, no consult CTA wiring (slot placeholder only), no query-param result rendering (pair pages are canonical).
