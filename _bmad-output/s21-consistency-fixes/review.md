# BMAD Code Review — S21 Consistency Fixes

**Reviewer:** per-commit review pass (QA mindset, manual BMAD process)
**Date:** 2026-11-23 · **Pre-commit review of:** frontend 3 modified files, meta 2 QA suites updated + session docs
**Verdict:** ✅ **APPROVED for commit** — acceptance criteria AC-1–4 all evidenced (see `qa/QA-REPORT.md`).

## Review conditions

| Condition | Assessment |
| --- | --- |
| **C1 — fix-where-it-belongs (no scope creep)** | ✅ Backend untouched — its optional-email contract (requests.ts trims `""` → `null`) was already correct and is now the single source both forms agree with. Privacy policy untouched — it was the correct side. No drive-by edits beyond the two owner findings. |
| **C2 — parity, not a third semantic** | ✅ BookingModal now behaves byte-for-byte like BookingForm's email: `optional` FieldLabel marker, no `required` attr, no validator rule, native `type="email"` format check only when filled. The shared FieldLabel `optional` prop is used instead of a hand-rolled label — consistent with the S18 marker system. |
| **C3 — consent boundary preserved** | ✅ DPDP consent checkbox stays `required` + gate-checked; the modal's stricter D11 consent design is otherwise intact — only email demoted, and the gate comment now records *why* (privacy policy + backend contract) so the next reader doesn't "restore" it. |
| **C4 — tests updated to the new contract, both directions** | ✅ S18 e2e §11 asserts the negative (no `required` attr, "fix 3 fields", untouched email never `aria-invalid`) *and* the positive (errors clear once name+phone+consent fixed). Booking-modal suite gains Path 5 (no-email POST, payload `email === ""`, success shown) — API mocked, no probe rows. |
| **C5 — pre-existing suite breakage repaired, separately noted** | ✅ `qa/e2e-booking-modal.mjs` still filled `#bk-date` as a visible input — broken since S16 made DateField's real input hidden (suite last green pre-S16; not a regression from this change). Now drives `[data-dt-seg]` segments like the S18 helper. Flagged in story + QA report so history stays honest. |
| **C6 — count fix grounded in the registry, not memory** | ✅ 23 verified by counting unique `slug:` entries in `calculators/[tool].astro`; nav.ts already 23; DB swept via MCP across faq_items/content_blocks/site_settings/blog_posts (S19 lesson: DB copy evades src greps); dist grep proves nothing stale ships. |

## Acceptance criteria check

- **AC-1** ✅ Path 5: one POST, `email: ""`, success panel.
- **AC-2** ✅ `type="email"` retained (format check on filled values); gate rules no longer reference email at all.
- **AC-3** ✅ S18 §11: "fix 3 fields" on empty submit; email no `required`; email no `aria-invalid` after fix-up.
- **AC-4** ✅ dist: "23 free calculators" on /about + /contact; zero "17 free calculators"; zero `bk-email…required` in any shipped HTML.

## Non-blocking notes

1. BookingModal preferred **date** remains optional and the modal still posts even with an empty date — unchanged, matches BookingForm and backend defaults.
2. NewsletterForm's mandatory email stays — inherent to subscribing and separately disclosed in privacy.astro:33.
3. `/hi/` ships no forms today; if a Hindi booking form lands, the hardcoded EN gate messages ("Please enter your name.") need the HI catalog — pre-existing S18 note, still true.
