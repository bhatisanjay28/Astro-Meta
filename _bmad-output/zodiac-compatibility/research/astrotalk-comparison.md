# Astrotalk Compatibility — Structure Study and Feature Comparison

- **Author:** Mary (BMAD Analyst persona)
- **Date:** 2026-11-22
- **Basis:** Structure-only inspection of three fetched Astrotalk pages (compatibility hub, Aries hub, Aries–Taurus pair page) on 2026-11-22. **No content, wording or scores have been copied.** Only short factual labels (category/heading names) are reproduced where needed to describe structure. Sources: `sources.md` entries [6][7][8]. Supporting comparisons from Astrostyle [11], Astrology.com [12][13], GaneshaSpeaks [14], Cafe Astrology [9], ZodiacSign.com [15].

---

## 1. Astrotalk structure study

### 1.1 Page inventory and URL pattern

| Level | URL pattern | Observed on |
|---|---|---|
| Compatibility hub | `/compatibility` | [6] |
| Per-sign hub | `/compatibility/<sign>` (e.g. `/compatibility/aries`) | [7] |
| Pair result page | `/compatibility/<sign-a>/<sign-b>` (e.g. `/compatibility/aries/taurus`) | [8] |

This is a clean 3-level hierarchy: hub → 12 sign hubs → 144 pair pages. Every pair page is individually addressable (SEO asset), and every sign hub cross-links all 12 of its pairs.

### 1.2 Hub page (`/compatibility`) — sections in order

1. Header/nav with mega-menus (consultations, horoscope, free services/calculators, panchang, shop, blog), language switcher (English/Hindi/Kannada/German), theme toggle.
2. Title + multi-paragraph SEO intro about love compatibility.
3. Astrologer CTA band (talk/chat buttons, app deep links).
4. **"Choose Your Sign" grid — 12 clickable sign cards (name + date range)**.
5. Dense multi-column footer (tools, resources, shop, corporate, app badges, trust badges: secure payments / verified astrologers / privacy; 24x7 support email).

**User flow at hub level: one step** — pick your own sign → jumps to your sign's hub. No FAQ on this page. Disclaimer exists only as a footer link [6].

### 1.3 Per-sign hub (`/compatibility/aries`) — sections in order

1. Same header/nav.
2. SEO intro essay about the sign in relationships.
3. **Calculator widget: two dropdowns** ("your sign" pre-set + "partner's sign") + submit.
4. Interactive-tool links nearby (love calculator, kundli matching, love horoscope).
5. **"Choose Your Partner Sign" grid — 12 partner link cards** (name + date range) linking to the 12 pair pages.
6. Trust badges, dense footer.

**User flow: two paths to the same place** — the dropdown calculator (tool-style) or the browseable 12-card grid (SEO-style). No breadcrumb trail observed; mega-menu does the navigation work [7].

### 1.4 Pair result page (`/compatibility/aries/taurus`) — sections in order

1. Header/nav.
2. H1 for the pair + subtitle framing "love, sex, friendship & more".
3. **Score block: bare percentage figures displayed prominently, one per category — no overall total, no stars, no x/100.**
4. "Are you compatible?" interactive picker widget + submit.
5. Astrologer connect CTA (call/chat).
6. **Category sections, in order: Love Compatibility → Sexual Compatibility → Friendship Compatibility → Communication Compatibility** (each: percentage + one explanatory paragraph) → **Relationship Tips** (text-only advice block, not scored).
7. "Aries Compatibility With Other Signs" — grid of 12 related pair links.
8. Complimentary astrology services promo cards.
9. Full footer.

Notable observations:

- **No FAQ block on pair pages; no inline disclaimer** (footer link only) [8].
- **Templating QA bug observed:** supporting paragraphs referenced the wrong signs (Gemini/Virgo text on the Aries/Taurus page) [8] — a lesson for our content pipeline (bind every sentence to the pair ID).
- Heavy monetisation density (astrologer CTAs, promo cards) relative to content depth: each category is one short paragraph.

### 1.5 What Astrotalk does NOT show (also useful)

- No overall match score or band label [8].
- No Trust / Emotions / Family / Marriage categories on Western pair pages [8].
- No star ratings; no share/download of results; no FAQ; no per-category radar/visual beyond text+number [8].

---

## 2. Vyotish planned offering (from owner brief)

- Two sign selectors (own + partner, same sign allowed) → "Check Compatibility" → result with **overall score/rating** + one card per category with short explanation + relationship tips.
- Required categories: Sexual, Friendship, Communication, Relationship Tips; recommended additions per research: Love, Trust, Emotional (see `mary-research.md` §4.3).
- Friendly, clear tone; no fear-based readings; "guidance and entertainment" disclaimers; verification flags on astrological verdicts.
- Thin frontend: all data/logic served by backend API; frontend is a renderer.
- All 144 pairings covered, including 12 same-sign pairs.

---

## 3. Feature comparison table

| # | Feature | Astrotalk | Vyotish plan | Verdict |
|---|---|---|---|---|
| 1 | 3-level URL hierarchy (hub / sign / pair) | Yes | Yes (planned) | **Must-have** — SEO and crawlability [8] |
| 2 | 12-sign card grid with date ranges | Yes | Yes | **Must-have** |
| 3 | Two-dropdown calculator (own + partner sign) | Yes (on sign hubs) | Yes (on section entry) | **Must-have** |
| 4 | Browseable 12-partner link grid per sign | Yes | Yes | **Must-have** (cheap, strong internal linking) |
| 5 | Per-category scores with explanation | Yes (4 scored + tips) | Yes (6 scored + tips per research) | **Must-have** |
| 6 | Overall score + band label | **No** | Yes | **Must-have (our differentiator over Astrotalk)** |
| 7 | Same-sign pairs allowed | Yes (12 pair pages incl. own sign) | Yes | **Must-have** |
| 8 | Related-pairs grid (12 per sign) on every pair page | Yes | Yes | **Must-have** |
| 9 | Inline disclaimer ("guidance & entertainment") near result | No (footer link only) | Yes (inline + footer) | **Must-have (policy + trust)** |
| 10 | Verification flags on verdicts (method note per score) | No | Yes | **Must-have (Vyotish pattern)** |
| 11 | FAQ section on compatibility | No | Yes (owner asked for FAQ support patterns) | **Nice-to-have → do** (SEO + objection handling) |
| 12 | Astrologer/expert consult CTAs | Yes (heavy) | Map to Vyotish consult/report CTAs if such a flow exists | **Nice-to-have** (depends on Vyotish product plans) |
| 13 | Cross-tool promo cards (horoscope, kundli, panchang…) | Yes | Yes — cross-link Kundli matching, panchang, existing calculators | **Nice-to-have** |
| 14 | Language switcher (EN/HI/…) | Yes (4 languages) | Not planned | **Skip for now** (owner decision; big content cost) |
| 15 | Dark/light theme toggle | Yes | Follow site-wide theme only | **Skip** (site-level concern) |
| 16 | Share/save result (link or image) | Not observed | Not planned | **Skip for now** (see gap list) |
| 17 | Method-explainer sections (Planets/Elements/Modalities) | No (they skip it; Astrology.com does it [13]) | Short method note + link to explainer | **Nice-to-have** (credibility; matches verification-flag policy) |
| 18 | Monetisation banners inside results | Yes | No | **Skip** (tone mismatch) |

---

## 4. Gap list — useful features we are missing, ranked

Effort: S = small (≤1 day dev), M = medium (days), L = large (week+). "API-first fit" = whether it works with our thin-frontend renderer.

1. **Overall score + band label on the result** — Astrotalk lacks it; the owner wants it. Pure API computation (score already derived in `pair-matrix.md` §2/§7) + one UI block. **Effort: S. API-first fit: perfect.**
2. **Inline disclaimer + verification flag components** — rendered from API metadata with each verdict (flag level, method used). **Effort: S. Fit: perfect.**
3. **FAQ block per section (and optionally per sign)** — static content served by API (content JSON), rendered as accordion; include FAQPage structured data for SEO. Astrotalk has none — easy differentiation. **Effort: S–M. Fit: perfect.**
4. **Pair permalink URLs for all 78 unique pairs** — canonicalise (see `pair-matrix.md` §8): one canonical record per unique pair; mirrored titles reorder via frontend. API serves the record; the thin frontend renders either order. **Effort: S (records) + M (routing/SEO rules). Fit: perfect.**
5. **Related-pairs grid + cross-links** (12 per sign on every pair page; links to Kundli matching/love calculator/panchang) — pure data (list endpoints or static manifest). **Effort: S. Fit: perfect.**
6. **Sign info strip** (element, modality, ruler, dates) on selectors and results — data comes from the same master tables in `pair-matrix.md` §1.1 via a `/signs` endpoint. **Effort: S. Fit: perfect.**
7. **Breadcrumbs** (Compatibility › Aries › Aries & Taurus) — Astrotalk relies on mega-menus; explicit breadcrumbs help SEO and thin-frontend nav. **Effort: S. Fit: perfect.**
8. **Method explainer page** ("How sun-sign compatibility is calculated") — one content page summarising elements/modalities/aspects/rulers (from `mary-research.md` §2, rewritten for site tone); linked from every result's verification flag. **Effort: M (content). Fit: perfect.**
9. **Consult/report CTA slot** — if Vyotish plans paid readings, reserve an API-driven CTA slot on results (Astrotalk monetises here heavily [8]). **Effort: S (slot) / M (product). Fit: perfect.**
10. **Share/save result** — shareable link is trivial (URL already unique per pair); a downloadable result card image is a rendering task better deferred. **Effort: S (link) / L (image card). Fit: good (link) / weak (image needs client rendering).**
11. **Multilingual content (EN/HI first)** — content volume is 78 pairs × 7 categories; translation doubles/triples content ops. Astrotalk supports 4 languages [6]. **Effort: L. Fit: good (API returns per-locale content). Defer.**
12. **Full synastry upgrade path (birth-chart based)** — beyond sun signs; needs birth data input and ephemeris backend. Out of scope; note as future. **Effort: L. Fit: good but separate service.**

---

## 5. Verdict summary

- Astrotalk's compatibility product is structurally minimal and clean: **3-level URLs, two selectors, four scored categories + text tips, no overall score** [6][7][8]. Its strength is distribution (dense internal linking, app CTAs, 4 languages); its weaknesses are thin explanations, no overall verdict, no FAQ, footer-only disclaimer, and observed templating QA issues [8].
- Vyotish's plan is strictly stronger on trust signals (overall score + band, verification flags, inline disclaimer, method note) and content depth (6 scored cards, full 78-pair coverage with deterministic scoring). Everything in the plan fits the thin-frontend/API-first architecture without exceptions; the only genuinely large-ticket items (multilingual, image-card sharing, full synastry) are deferrable.
- The one Astrotalk feature worth consciously *not* copying: fear-free but score-heavy monetisation inside results, and gendered inputs elsewhere in the market (GaneshaSpeaks uses gender toggles [14]) — both conflict with Vyotish tone policy.
