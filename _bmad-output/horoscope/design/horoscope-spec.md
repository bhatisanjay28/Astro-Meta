# Sally (UX) — Horoscope Design Spec v1
**Horoscope Upgrade · Step 3 of 5 · 2026-11-24 · consumes [style-guide](../content/style-guide.md) + [library-structure](../content/library-structure.md) + [ruleset §7](../research/03-ruleset.md); feeds Step 4 (dev)**

Designs produced with the **Stitch MCP** (Sally directive), design system **"Vedic Serenity"** (asset `3979a94b895743cdad7c61609ae09bf8`, project `7000631376845729468`) — the same system behind the approved contact/footer/legal designs and the live site tokens.

---

## 1. Page architecture

Every page keeps the existing shell skeleton (breadcrumb → hero → period chips → 12-sign picker → footer) and **replaces the runtime `.reading` fetch box with server-rendered content** (PanchangDetail pattern: shell renders data, no client fetch for primary content; fail-soft line only when a period's row is genuinely missing).

```
┌ site header (existing)
├ breadcrumb: Horoscope / {Sign}
├ HERO: sign roundel ♈ · H1 "{Period}'s Rashiphal — {Sign} ({राशि})"
│        meta line: date / date-range · panchang (weekday · tithi · nakshatra · paksha)
├ PERIOD TABS: Yesterday Today Tomorrow Weekly Monthly Yearly (existing chips)
├ ┌─ MAIN (2/3) ──────────────┬─ SIDEBAR (1/3) ────────┐
│  │ period content stack      │ Lucky card              │
│  │ (per period, §2)          │ Trust card (P11 line)   │
│  │                           │ Explore card (links +   │
│  │                           │  Book Consultation)     │
│  └───────────────────────────┴─────────────────────────┘
├ disclosure <details> "How we compute this" (D3, full width)
├ disclaimer line (style §7 fixed string, full width)
├ 12-sign picker (existing grid)
└ site footer (existing)
```

Main column per period:

| Period | Content stack (top → bottom) |
|---|---|
| **Daily** (also Yesterday/Tomorrow — identical layout, shifted date) | Overview card (rating chip) → Thought strip → 5 category cards (2-col grid: Health; Career & Money combined per D1; Love; Education; Family) → Do's & Don'ts (2 columns) |
| **Weekly** | Week range header strip → Overview (rating chip) → same 5-category grid (longer register) → Do's & Don'ts → chandrashtama note when active (health card annotation) |
| **Monthly** | Month header → Overview → **Best days** chip row 🟢 + **Testing day** chip 🔴 (D4: chips live here) → 5 category sections → **"This month's sky"** block (ingresses + new/full moon + stations, dated lines) |
| **Yearly** | Year overview → **Sade Sati note** (only when Saturn in 12/1/2/4/8 from sign; D5 phase display) → 9 area sections (Health, Education, Career, Business, Wealth, Love, Marriage, Family, Children) → **Month-by-month table** (12 rows: month · one-line clause · rating chip) |

## 2. Rating chip (the central component)

4 bands, always **word + glyph + colour together** (site anti-feature: never colour alone):

| Band | Chip | Colour tokens (light / dark) |
|---|---|---|
| Excellent | `▲▲ Excellent / उत्तम` | text `--color-success`, bg `--color-auspicious-bg` (#e7f2e9 / dark twin) |
| Good | `▲ Good / अच्छा` | text `#1E3A5F` tertiary, bg `#E0ECFC` celestial soft (design-system pair) |
| Moderate | `◆ Moderate / मध्यम` | text amber-700, bg amber-50 (new token pair — flagged in §8) |
| Challenging | `▼ Challenging / चुनौतीपूर्ण` | text `--color-error`-adjacent terracotta, bg `--color-inauspicious-bg` (#fbebeb / dark twin) |

- Pill shape (design system chip spec), height 28–32px, `label-md` type; glyph rendered in a `<span aria-hidden>` with the word as real text (screen readers read the word).
- Where chips appear (D4): monthly Best/Testing day chips + yearly month-table rows **only**. Daily/weekly/monthly category sections use the chip next to the heading too — D4 said "rating chips only on monthly Best/Testing + yearly table"; category headings keep a **small text glyph** (e.g. "▲ Good") without the filled chip to stay inside D4 while keeping band legibility. *(Interpretation note for owner — see §8.)*

## 3. Sidebar cards

1. **Lucky card** — gold accent header "Today's/This week's… Lucky": colour swatch + name, big numeral (single, D2), direction, deity, Devanagari mantra + transliteration + cadence line, and the "Why" footnote (fixed template `horoscope.lucky_why`).
2. **Trust card** — "Team Vyotish · Reviewed by our Jyotishi panel" (byline idea #2 from site analysis; the P11 reviewer name joins at launch, D6).
3. **Explore card** — links to the other periods + terracotta pill button "Book a Consultation" (natural cross-link, idea #6).

## 4. Data-bearing blocks

- **Best/Testing days (monthly)**: green-tint pill per best day (date + ▲), red-tint pill for testing day (date + ▼); dates come from ruleset scoring — pure data.
- **"This month's sky" block**: dated one-liners (Mercury enters Scorpio — Dec 3; New moon — Dec 9; …). Astronomical facts stated as facts (style §5.4). Renders from `planetIngresses` + moon phases + stations computed by the generator.
- **Month-by-month table (yearly)**: 12 rows, 3 columns (Month · clause · chip); clause = one 8–16-word reason fragment (`clause.*` library rows); table gets `<caption>` + scope attrs.
- **Sade Sati note (yearly)**: calm tinted card, phase segments rendered as a simple two-segment timeline ("Rising: Jan–May & Nov–Dec · Peak: Jun–Oct") using the `horoscope.sadesati_note` template — effort/patience framing only.
- **Disclosure**: single `<details open>` per page with the fixed EN/HI string (D3) — placed below the main grid, above the disclaimer.

## 5. Responsive

- ≥1024px: 2/3 + 1/3 grid; 640–1023px: single column, sidebar cards collapse **above** the disclosure in Lucky → Explore order; <640px: category grid 2-col → 1-col; month table keeps 3 columns (Month cell narrows, clause wraps); period tabs wrap to 2 rows; all tap targets ≥44px.
- Dark mode: every chip/card token has a dark twin via the `[data-theme="dark"]` alias layer; QA sweeps both (S20-proven gate).

## 6. Accessibility (non-negotiables)

- Chips: word + glyph + colour; never colour alone (AA contrast on tint bgs, verified in both themes).
- `<details>` disclosure keyboard-operable natively; mantra Devanagari gets `lang="hi"` spans.
- Reading column is real SSR text (no client-fetch flash) — resolves the S1-era "Fetching rashiphal…" placeholder.
- The 12-sign picker keeps current sign highlighted with border + `aria-current="page"`.
- Month table: `<caption>` + `scope="col"`; chips inside cells carry their word.

## 7. Implementation mapping (Step 4 notes)

- One shared `HoroscopeDetail.astro` component family (cards + chips + lucky card) replacing the `.reading` box in `src/pages/horoscope/[sign]/[period].astro`; per-period sections branch on `period` prop. Dev replaces shells per D12 (SSR from `horoscopes` rows via the existing API/server fetch; PanchangDetail is the template for structure + fail-soft).
- New tokens needed: `--rating-good-text/bg`, `--rating-moderate-text/bg` (+ dark twins) — additive to tokens.css alias layer.
- Stitch screens (below) are **layout references, not pixel sources**: final HTML uses Vyotish's real tokens/fonts (Tailwind + tokens.css), per the established re-map pattern.

## 8. Screens produced + flags for owner

**Stitch note (2026-11-24):** the Stitch MCP generation endpoint was down today — two `generate_screen_from_text` attempts for the Daily layout (project `7000631376845729468`, Vedic Serenity design system) both hit the known 30s MCP timeout and the screen never persisted across ~15 min of `list_screens` polling, while all read tools (list_design_systems, list_screens) kept working. Per Sally's proven fallback pattern (contact/footer polish, S-TB), the four screens were produced as **local HTML mockups built directly on the Vedic Serenity values mapped onto Vyotish token names** — which is *closer* to what Step 4 ships than Stitch HTML would be (Step 4 re-maps Stitch output onto real tokens anyway).

| Mockup | File | Screenshot (desktop · mobile) |
|---|---|---|
| Daily (also Yesterday/Tomorrow) | `design/mockup-daily.html` | `design/screens/mockup-daily-desktop.png` · `…-mobile.png` |
| Weekly | `design/mockup-weekly.html` | `design/screens/mockup-weekly-desktop.png` · `…-mobile.png` |
| Monthly | `design/mockup-monthly.html` | `design/screens/mockup-monthly-desktop.png` · `…-mobile.png` |
| Yearly | `design/mockup-yearly.html` | `design/screens/mockup-yearly-desktop.png` · `…-mobile.png` |

- Mockups carry the **real Aries sample copy** (samples §1.1–4.1) and the **real fixed strings** (style-guide §7 disclosure + disclaimer), so Step 4's templates can be lifted almost verbatim.
- Shared styles in `design/_tokens.css`: every colour is annotated with the Vyotish token name it maps to; `shots.ts` re-renders all 8 screenshots (Bun + playwright-core + system Chrome).
- All mockups are **EN-only**: the EN/HI presentation decision (in-page toggle vs `/hi/` routes) is an owner decision queued from Step 1 assumption #4 — layouts are language-agnostic.
- Visual verification done on daily/monthly/yearly desktop (all render clean); weekly shares the daily skeleton.

Flags:
1. **D4 interpretation** — brief text says chips on monthly Best/Testing + yearly table; I kept a *small text band marker* ("▲ Good") on daily/weekly/monthly category headings so the band is visible without a filled chip. If the owner prefers strict D4 (band word only in those two places), the category headings drop the marker entirely — one-line change.
2. **Moderate-band amber token** is new (site has green/red status pairs only) — additive tokens, needs the usual QA contrast pass in both themes.
3. HI disclosure wording simplification (carried from Step 2) applies to the disclosure block rendering.
