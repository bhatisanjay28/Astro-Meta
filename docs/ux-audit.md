# UX Audit — vyotish.com frontend (2026-11-20)

Auditor: Sally — UX Designer pass over the existing Astro 5 frontend.
Method: **browser-verified** — the ZCode in-app browser opened every page at
360 / 768 / 1024 / 1440 px, ran a per-page DOM metrics sweep (overflow, tap
targets, headings, labels, font stacks) and captured full-page screenshots
(`docs/plan/ux-audit-2026-11-20/before/…`, 22 routes × 4 widths, gitignored),
plus a code audit of the shared chrome and templates. Findings below are based
on what was actually seen/measured, not guesses.

Skill availability note: the "Impeccable" design skills (audit, critique,
polish, arrange, typeset, normalize, adapt, harden, clarify) are **not
installed** in this session (checked skill list + plugin cache; the only
design plugin present is the official `design` HTML-deliverable workflow,
which is unrelated). Each finding below is tagged with the Impeccable skill
whose intent was applied manually, so the traceability the owner asked for is
preserved.

## Verdict

The site is in good shape: **no horizontal overflow anywhere at 768/1024/1440**,
consistent token-driven palette (light + dark both verified visually), honest
empty/loading states on data pages, skip link, focus-visible ring, labelled
booking form, self-hosted fonts, correct `lang="hi"` on Hindi pages, correct
`rel="noopener"` on external links. What remains is one mobile breakage per
long-form/admin surfaces, one cross-cutting font normalization gap, small tap
targets in the shared chrome, and dev-facing jargon in user copy.

## Findings (priority order)

### P0 — breakage (fix first)

| # | Finding | Evidence | Checklist | Skill | Fix |
|---|---------|----------|-----------|-------|-----|
| F1 | **Admin login card overflows** viewports ≤ 400px (card right edge = 398px at 360). Root cause: standalone page has no `box-sizing: border-box`, so `width: 340px` + 28px padding + border = 398px. | `/admin/login` @360 screenshot; metrics `sw=398 vs vw=345` | 5 Responsive | **adapt** | `box-sizing: border-box` + `width: min(340px, calc(100vw - 32px))` + body padding |
| F2 | **Learn & blog article tables overflow** at 360 (learn table right = 361px, clipped "Nature" column, horizontal scrollbar). `.prose table { width:100% }` has no scroll container. | `/astrology/learn/the-12-rashis` @360 screenshot + metrics `overflowX:true` | 5 Responsive, 1 Alignment | **adapt** | `.prose table { display:block; overflow-x:auto; }` in learn + blog prose styles |

### P1 — cross-cutting consistency

| # | Finding | Evidence | Checklist | Skill | Fix |
|---|---------|----------|-----------|-------|-----|
| F3 | **Every form control renders in Arial**, not Poppins: Tailwind preflight is disabled and `font: inherit` only exists inside `.chrome-reset` (header/footer), so inputs/selects/buttons in main content (calculators, kundli, matching, contact, booking, newsletter, admin login) fall back to the browser UI font. | metrics: `ff="Arial"` on select/input/button across kundli, matching, calc pages @1024 | 3 Typography, 9 Visual consistency | **normalize** | Global `:where(button, input, select, textarea) { font: inherit; letter-spacing: inherit; }` in `base.css` (layer `base` — utilities still win) |
| F4 | **Focus ring mutates element shape**: the global `:focus-visible` rule sets `border-radius: 4px`, so pill buttons/chips become square-cornered while focused. | `base.css:21-25` code review | 4 Colour & states, 8 Accessibility | **polish** | Drop `border-radius` from the rule; the ring follows the element's own radius |
| F5 | **`javascript:void(0)` hrefs** on the inactive language switcher: fake link announced to AT, and it will be blocked when the CSP story (7.2) ships. | `/` DOM snapshot shows `link "English" → javascript:void(0)` | 6 Navigation, 8 Accessibility | **harden** | Render the current language as `<span aria-current="true">`, keep the other as a real link |
| F6 | **Tap targets below 44px** (WCAG 2.5.8 AA floor is 24px; several sit below even that): utility-bar language links **48×14 / 33×14**, theme toggle **36×38**, calculator `.inp` ≈ 35px & `.btn` ≈ 37px tall, home calculator-search input, newsletter email input, footer/list links ≈ 20px tall, breadcrumb & card links ≈ 20px. Recurs on every page (shared chrome). | metrics `smallCount` 27–64 per page at all widths | 5 Responsive | **adapt + harden** | Padding bumps: primary controls → ≥44px; dense list/breadcrumb links → ≥24px with spacing (inline text links in prose stay exempt) |
| F7 | **Mobile drawer keyboard gaps**: opens/closes by click only — no Escape key, no focus move into the drawer, no `aria-controls`. | `Header.astro:89-102` code review | 7 Forms & interactions, 8 Accessibility | **harden** | Escape closes + focus returns; `aria-controls="mobile-drawer"`; focus first link on open |

### P2 — responsive & reading comfort

| # | Finding | Evidence | Checklist | Skill | Fix |
|---|---------|----------|-----------|-------|-----|
| F8 | **Calculator/matching result rows** use `grid-template-columns: 200px/160px 1fr` — the label column eats ~60% of a 360px card, values cramped. | `[tool].astro:413`, `matching.astro:185` | 1 Alignment, 5 Responsive | **adapt** | Collapse label/value to stacked rows under 480px |
| F9 | **Article prose line length ≈ 90+ chars** (760px container ÷ 14.5px text) — above the 66–75ch comfort band on both learn and blog articles. | learn/blog `@1440` screenshots | 3 Typography | **typeset** | `max-width: 68ch` on `.prose p, .prose li` |

### P3 — microcopy (content meaning unchanged; dev jargon removed)

| # | Finding | Where | Checklist | Skill | Fix |
|---|---------|-------|-----------|-------|-----|
| F10 | "All computation happens in the Vyotish backend engine via /api/v1 — the page never calculates." — implementation detail shown to users | calculators pages flag pill | 11 Copy | **clarify** | → "Free · instant · computed live — nothing is stored." |
| F11 | "Results appear here — computed by the Vyotish backend; nothing is stored." | calculators result hint | 11 Copy | **clarify** | → "Your result will appear here — instant, and nothing is stored." |
| F12 | "Requests are saved to the Vyotish admin inbox —" (internal plumbing) + "Sample data for Phase 1 review — the directory is admin-managed once Epic 6.4 lands." (epic numbers on a public page) | consultations index | 11 Copy | **clarify** | Keep the 24–48h promise; note becomes "Launch preview: profiles shown are illustrative until the directory is finalised." |
| F13 | "Content is served live from the Vyotish backend. The home page shows all signs in tabs." | horoscope index intro | 11 Copy | **clarify** | → "Updated daily for every moon sign. The home page shows all signs in tabs." |
| F14 | "© … All rights reserved. Phase 1 Local Build." + "Security: Cloudflare RLS & CSP Compliant" — internal build state; the CSP claim is **not yet true** (story 7.2 open), so it is also a false claim | footer | 11 Copy | **clarify** | Drop "Phase 1 Local Build"; replace the false CSP claim with the true zero-OTP promise (kept once) |
| F15 | "WhatsApp click-to-chat arrives with Epic 7.4." | contact page | 11 Copy | **clarify** | → "WhatsApp chat support is coming soon." (The adjacent P7 legal placeholder box stays as-is — owner-gated 7.3 legal drafts.) |
| F16 | "…the full booking pipeline lands in Phase 1 Epic 5.2." | booking modal success line | 11 Copy | **clarify** | → "Our admin team will confirm your booking by phone/WhatsApp." |
| F17 | "Sign in with the owner/admin account created by setup-first-admin.ts." — internal script name | admin login | 11 Copy | **clarify** | → "Sign in with your Vyotish admin account." |

### P3 — accessibility details

| # | Finding | Where | Checklist | Skill | Fix |
|---|---------|-------|-----------|-------|-----|
| F18 | Newsletter email input is placeholder-only (no label/`aria-label`) — placeholder vanishes on input and is not a reliable name. ×2 instances on home. | `NewsletterForm.astro:18` | 7 Forms, 8 Accessibility | **harden** | `aria-label` (+ same for the visible search input) |
| F19 | Home calculator search input has no accessible name. | `index.astro:313` | 8 Accessibility | **harden** | `aria-label="Search calculators"` |
| F20 | No `prefers-reduced-motion` guard; the site uses hover/active transitions and `active:scale`. | global grep — zero matches | 8 Accessibility | **harden** | Standard reduced-motion media query in `base.css` |

### Verified non-issues (checked, no action)

- No horizontal overflow at 768/1024/1440 on any of the 22 audited routes; home/panchang/kundli/matching/contact/404 clean even at 360.
- Dark mode verified visually — token aliasing (`tokens.css`) holds; contrast, chips, and chart all render correctly.
- Alt-text: zero `<img>` across the audited routes (icon-font + inline SVG design) — nothing unlabeled via alt.
- No unnamed interactive elements found on public pages.
- `rel="noopener noreferrer"` correctly present on the one `target="_blank"` (blog).
- Panchang city page already ships skeleton loaders + min-height cells (CLS mitigation in place; the Lighthouse font-swap CLS was addressed by self-hosted fonts in S1).
- Booking modal fields are properly labelled (`for`/`id` pairs), consent checkbox labelled; admin login has `role="alert"` error region + `autocomplete` attributes.
- Hindi home sets `lang="hi"` and renders Noto Sans Devanagari correctly.
- The navy "Talk to Astrologer" button is `--color-light-secondary` (#1e3a5f) — an approved design token, **not** an off-brand accident. Left unchanged.
- The dark pill at the bottom of dev screenshots is the Astro dev toolbar — dev-only, never ships.

## Fix plan (small, themed commits — each is the story for that commit)

Story-first: each commit group below carries its acceptance criteria; BMAD-style
review pass runs before every commit (hard rule).

1. **C1 `fix(responsive)` — mobile breakage** (F1, F2, F8) — Given a 360px viewport, When the admin-login card or an article table or a calculator result row renders, Then no element exceeds the viewport (scrollWidth ≤ clientWidth) and all content stays reachable. Files: admin/login.astro, learn/[slug].astro, blog/[slug].astro, calculators/[tool].astro, matching.astro, kundli.astro.
2. **C2 `fix(base)` — design-system normalize** (F3, F4, F20) — Given any form control, When rendered, Then font-family resolves to Poppins; Given keyboard focus, When focus-visible fires, Then the element's radius is unchanged; Given reduced-motion preference, When any transition runs, Then it is suppressed. Files: base.css.
3. **C3 `fix(chrome)` — shared chrome tap targets & switcher** (F5, F6) — Given the utility bar/header/footer, When touched at 360px, Then language links ≥24px tall, theme toggle ≥44px, footer/list links ≥24px, and no `javascript:` href exists. Files: UtilityBar.astro, Footer.astro, Header.astro.
4. **C4 `fix(a11y)` — drawer & labels** (F7, F18, F19) — Given the mobile drawer open, When Escape is pressed, Then it closes and focus returns to the toggle; Given the newsletter/search inputs, Then each has an accessible name. Files: Header.astro, NewsletterForm.astro, index.astro.
5. **C5 `fix(copy)` — de-jargon public copy** (F10–F17) — Given any public page, When read, Then no internal epic/phase/script identifiers appear; promises that are not shipped (CSP) are not claimed. Files: calculators/[tool].astro, consultations/index.astro, horoscope/index.astro, Footer.astro, contact.astro, BookingModal.astro, admin/login.astro.

Out of scope, recorded: legal placeholder box (P7, owner-gated 7.3), CSP/WAF
(7.2), font-swap CLS refinements (S12), admin-app interior pages (owner-gated
auth), content/routes/business logic unchanged throughout.

## Before/after verification

Re-verified after each commit group at 360/768/1024/1440 with the same metrics
sweep + screenshots (`docs/plan/ux-audit-2026-11-20/after/…`). Results appended
below after the fixes land.

### After-results (2026-11-20)

Full re-sweep of all 22 routes × 4 widths (360/768/1024/1440), light theme,
light-mode screenshots in `docs/plan/ux-audit-2026-11-20/after/` (88 files;
admin-login stays dark by design):

- **Overflow:** 0 pages with `scrollWidth > clientWidth` at any width (before:
  admin-login 398px @360, learn-article 361px @360).
- **Fonts:** no form control resolves to Arial on any audited page (incl.
  admin-login after `font: inherit` on its standalone button).
- **Labels:** `inputsNoLabel` = 0 on every page (was 3 on `/`).
- **Tap targets:** sub-24px interactive elements dropped from 27–58 per page
  to 1–6 (remaining are inline prose/text links, which WCAG 2.5.8 exempts);
  language links 26px tall, theme toggle 44×44, footer links 28px, form
  controls ≥44px; result rows stack under 480px.
- **Prose typography:** the scoped-CSS dead-zone bug means the gold Cinzel h2s
  and muted body text now actually render on learn/blog (verified live:
  `font-family: Cinzel` on `.prose h2`); tables scroll-contained
  (`display:block; overflow-x:auto`).
- **Focus / motion:** ring follows element radius; `prefers-reduced-motion`
  guard active.
- **Drawer:** Escape closes + focus returns; `aria-controls` present.
- **Copy:** jargon grep clean — no `Epic`/`Phase 1`/`PRD §`/`setup-first-admin`/
  `/api/v1` strings in user-visible copy; false CSP claim removed.

Commits (frontend, local main — **not pushed**, owner gate D8):
`5d8ba64` fix(responsive) → `8df2d99` fix(forms) → `3e46443` fix(base) →
`7a3433f` fix(chrome) → `86e0aeb` fix(copy). Lint 0 errors, astro check
0 errors, secret-scan clean on every commit.
