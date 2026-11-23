# Story S21 — two visitor-facing consistency fixes (owner directives)

**Date:** 2026-11-23 · **Owner:** two spot-fixes requested in one session
**Pinned:** frontend (BookingModal.astro, about.astro, contact.astro) · meta QA suites (`qa/e2e-booking-modal.mjs`, `_bmad-output/form-validation/qa/e2e.mjs`) · backend untouched

## Fix 1 — homepage booking-modal email: mandatory → optional

**Owner finding:** privacy policy says consultation email is optional, but the homepage consultation form marks it mandatory.

**Audit result (pre-fix):** exactly one outlier in the whole product —

| Surface | Email |
| --- | --- |
| privacy.astro:31–32 (consultation + pooja) | **"(optional)"** — the published policy |
| BookingForm.astro (used on /consultations ×2, /poojan ×2) | optional ("Email (optional)", no `required`, no gate rule) |
| backend requests.ts:43–59 | optional (validated only if present; empty → `null`) |
| **BookingModal.astro (homepage)** | **mandatory ×2**: FieldLabel `required` star + input `required` attr + S18 gate rule ("Please enter your email address.") |
| NewsletterForm | required — correctly self-disclosed in privacy.astro:33 (own consent line) — not touched |

S18's story had codified the modal as "the stricter D11 consent design"; **the owner now overrules that** — the published privacy policy is the contract, and the modal drifting from its own sibling form (same request, different page) is a compliance bug, not a feature.

**Change:** BookingModal email field gets `FieldLabel optional` (renders "(optional)"), drops the `required` attr, leaves the S18 gate `text` rules entirely (name+phone only); `type="email"` kept so a *filled* email still gets the native format check — identical semantics to BookingForm. Empty submit sends `email: ""` → backend trims to `null`. No backend change.

## Fix 2 — calculator count: 17 → 23 everywhere

**Owner finding:** homepage advertises 23 free calculators, About says 17. Make it 23 on About (and keep consistent site-wide).

**Audit result:** registry in `calculators/[tool].astro` getStaticPaths = **23 unique slugs** (verified by count, not by memory). Stale "17" lived in exactly two files: `about.astro:49` and `contact.astro:167`. Mega-menu desc in `navigation.ts:259` already said "23 free tools". DB-served copy swept via Supabase MCP (faq_items question+answer, content_blocks payload, site_settings value, blog_posts content_md/excerpt) — **zero** count mentions; dist greps confirm no "17 free calculators" ships.

**Change:** both strings 17 → 23. Nothing else in src or DB carries a count.

## Acceptance criteria

- **AC-1:** homepage modal submits with name+phone+consent only; POST body carries `email: ""`; success panel shows.
- **AC-2:** a *filled* invalid email is still rejected (native `type="email"` retained).
- **AC-3:** empty-submit gate summary = "fix 3 fields"; untouched email never gets `aria-invalid`; email input carries no `required` attribute.
- **AC-4:** /about and /contact render "23 free calculators"; no "17 free calculators" anywhere in `dist/`; DB copy clean.

## Test plan

1. `bun run lint` + `bunx astro check` green (S20-phase-2 gate).
2. Rebuild dist; serve on :4321.
3. `qa/e2e-booking-modal.mjs` — incl. **new Path 5**: submit with no email → one POST, `email === ""`, success shown. (Suite also repaired: S16 turned `#bk-date` into a hidden DateField input and this pre-S16 suite could no longer fill it — now drives the visible `[data-dt-seg]` segments.)
4. `_bmad-output/form-validation/qa/e2e.mjs` section 11 updated: "fix 4 fields" → "fix 3 fields", email-`required`-attr assertion added, and the fix-up phase no longer fills email (pins "untouched optional email never flagged invalid").
5. Dist greps: `23 free calculators` present on about+contact; `17 free calculators` and `bk-email…required` absent site-wide.
