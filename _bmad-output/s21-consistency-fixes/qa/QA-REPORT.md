# QA Report — S21 Consistency Fixes (owner directives)

**Date:** 2026-11-23 · **Tester:** per-commit QA pass (manual BMAD process) · **Frontend:** dist current (rebuilt post-fix)
**Verdict:** ✅ **PASS — ready to commit** (push consent-gated per operating rules)

## Gates (S20-phase-2 push checklist)

| Gate | Result |
| --- | --- |
| `bun run lint` (biome check src) | ✅ 103 files, no violations |
| `bunx astro check` | ✅ 0 errors / 0 warnings / 8 hints (pre-existing hints) |
| `bun run build` | ✅ Complete (14.4s static + 21.2s server) |
| Preview server :4321 | ✅ HTTP 200 |

## E2e suites

| Suite | Result |
| --- | --- |
| `qa/e2e-booking-modal.mjs` (meta repo) | ✅ **20/20 ALL PASS** — incl. new Path 5 (no-email submit → 1 POST, `email === ""`, success shown) |
| `_bmad-output/form-validation/qa/e2e.mjs` (S18) | ✅ **28/28 ALL PASS** — incl. updated §11: "fix 3 fields", email not `required`, untouched email never `aria-invalid` |

## AC evidence

| AC | Evidence |
| --- | --- |
| AC-1 modal submits without email | booking-modal Path 5 assertions (API mocked — no probe rows) |
| AC-2 filled email still format-checked | `type="email"` attr present in dist modal HTML; native browser validation on filled values (same mechanism BookingForm relies on) |
| AC-3 gate = 3 errors, no email flag | S18 §11 first three assertions |
| AC-4 counts consistent | dist greps: `23 free calculators` in `about/index.html` + `contact/index.html`; `17 free calculators` → **0 hits**; `bk-email…required` → **0 hits** in any shipped HTML. DB sweep via Supabase MCP (faq_items, content_blocks, site_settings, blog_posts) → 0 count mentions |

## Notes

1. **Pre-existing suite repair (not a product bug):** `qa/e2e-booking-modal.mjs` filled `#bk-date` directly; S16 (2026-11-22) made DateField's real input hidden, so the suite had been unrunnable since before its last green run. Now drives visible `[data-dt-seg]` segments (day/month/year) like the S18 `fillDate` helper. All 4 original paths re-green.
2. Registry ground truth: 23 unique `slug:` entries counted in `calculators/[tool].astro` — nav's "23 free tools" was already right; About/Contact were the drift (pre-S13/Epic-14 copy).
3. Backend untouched; no DB writes this session (read-only MCP queries).
