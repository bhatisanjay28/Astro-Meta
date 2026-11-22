# BMAD Review — S19 Visitor-facing copy sweep

**Reviewer:** BMAD manual process · **Date:** 2026-11-22 · **Verdict:** ✅ **APPROVED** with conditions

The audit is exhaustive (16 leaks across frontend markup + 3 DB tables) and the clean-list shows genuine negative testing (dead code, inactive rows, privacy-policy carve-out). Conditions:

- **C1 — copy-only discipline:** replacements must not change layout, components, or behaviour; the two render-path removals (is_sample notes, festival suffix) must be verified to not alter what remains (horoscope readings, festival lines still render).
- **C2 — privacy-policy carve-out is explicit:** Supabase/Cloudflare processor names in privacy.astro stay (DPDP transparency); the QA banned-string scan must whitelist that page and the story documents the owner-overridable decision.
- **C3 — no silent claim changes:** the replacement copy must not invent guarantees (no "verified", "guaranteed", "certified" beyond what exists). Astrologer bios may restate row data (expertise/experience/languages) only.
- **C4 — DB writes via MCP, reversible:** UPDATE statements touch only `astrologers.about` (6 rows incl. inactive), `pujas.purpose` (3), `festivals.description` (3); no flag flips; documented in the QA report.
- **C5 — QA evidence:** post-build dist grep for the banned strings (privacy.astro whitelisted) + live curl sweep after deploy + screenshot evidence on the touched home sections.
