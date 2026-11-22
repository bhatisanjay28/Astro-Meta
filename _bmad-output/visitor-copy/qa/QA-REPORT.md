# QA Report — S19 Visitor-facing copy sweep

**Date:** 2026-11-22 · **Verdict:** ✅ **PASS** — public dist HTML contains zero banned tokens (programmatic sweep, all ~900 pages)

## What was checked
Automated sweep over every `dist/**/*.html` (excluding `/admin/*` and `/privacy/*` per review condition C2) for: `Epic N`, `PRD §`, `(P#)`, "admin-authored / admin-managed / publication engine / admin area", "Sample …" variants + `(sample)` + `SAMPLE DATA`, `Phase 1/2`, `GEMSTONES_SITE_URL`, `Supabase`, "Jyotishi review". **Result: CLEAN** after two build iterations (the first sweep caught 6 leaks the source audit missed — see below).

## Fixed — owner's listed examples

| Where | Before | After |
| --- | --- | --- |
| Home hero card | "Sample Kundli Lagna Chart" | "Janam Kundli — Lagna Chart" |
| Home astrologer directory | `[Sample Data for Phase 1 Local Review]` badge | removed (render path + flag) |
| Home consultations note | "Phase 1 Consultation Model: … saved to Supabase and routed to admin … Phase 2" | "Book by request — … confirmed personally …" |
| Home pooja cards | "Sample Dakshina" ×3 | "Dakshina" |
| Home gemstones | "Configured by GEMSTONES_SITE_URL. Once active…" | "Our dedicated gemstones store is launching soon." |
| Home blog note | "…written and reviewed through the Vyotish admin publication engine." | "Original research and classical commentary from the Team Vyotish scholars." |
| BookingModal (home) | "Saved securely to Supabase • Admin confirmed" | "Saved securely — used only to contact you about this request." |
| BookingForm | "Saved securely to the Vyotish admin inbox" | same replacement |
| consultations/[slug] | "Sample profile for Phase 1 review — …admin-managed…" | removed |
| poojan/[slug] | "Sample listing for Phase 1 review — …admin-managed…" | removed |

## Found by the dist sweep (missed by source audit — all visitor-visible)

| Where | Leak | Fix |
| --- | --- | --- |
| Home FAQ #3 (visible + JSON-LD, DB `faq_items`) | "In **Phase 1**, … Our **administrative team** coordinates…" | answer rewritten (no phase/team jargon) |
| matching.astro fine print | "pending Jyotishi review **(P11)**" | "…follow widely published variants and are indicative" |
| matching.astro result flagline (JS) | "Koota tables pending Jyotishi review (P11) — treat as indicative." | "…follow widely published variants — treat results as indicative." |
| muhurat lede | "Rule data is pending Jyotishi review — treat windows as indicative only." | "Treat the windows as indicative only — confirm in a personal consultation." |
| ishta-devata tool description | "Deity table pending Jyotishi review." | "Individual traditions vary — treat the table as guidance." |
| calculator-renderer flagline (all tools) | "Table set pending Jyotishi review (P11)…" | "Tables follow widely published variants — treat results as indicative." |
| PanchangDetail segment caption (169 city pages) | "⚠ pending Jyotishi review — " | "⚠ provisional timings" |
| learn articles ×2 | "flagged for Jyotishi review pending final sign-off" / "flag what awaits Jyotishi review" | reworded (no dev process language) |
| Shipped HTML/CSS/JS comments (view-source, ~400 pages) | "Epic 7 / 5.5 / 5.2 / 4.2b / 3.2b / 3.1", "(P8)", "admin-authored", "consultation_requests", "admin inbox" | reworded to plain language (Base.astro, index, BookingModal, kundli, PanchangDetail, HomePanchang, matching) |

## DB updates (Supabase MCP, review C4 — no flag flips)

- `astrologers.about` ×6: visitor bios for the 3 active profiles (restating expertise/experience/languages only — C3); 3 inactive seed rows → "Profile not published yet."
- `pujas.purpose` ×3: dev suffixes ("SAMPLE…", "(P9)", "PRD §…") removed.
- `festivals.description` ×3: "SAMPLE DATA (P10)"/"Epic 1 (P16)" removed, plain festival lines.
- `faq_items.answer` ×1: phase/team jargon removed.
- Post-update verification query returns **0** rows matching dev-text patterns in any public-facing text column.

## Deliberately kept (documented decisions)

- Privacy policy names Supabase/Cloudflare/Google Places as processors — DPDP transparency, standard legal practice (C2; owner can overrule).
- `is_sample` DB flags remain true (admin-side truth); nothing public renders them anymore.
- Inactive `sample-astrologer-*` rows, dead code (TabStub, QuickKundli) — never rendered; comments in dead code untouched.

## Regression

- S18 validation e2e suite re-run after the copy sweep: **65/65 ALL PASS** (booking rows created during QA deleted from prod `consultation_requests`; 1 flake on the kundli place dropdown retried green — no product change involved).
- Full `bun run build` green; astro check unchanged (7 pre-existing errors, none from S19).

## Not verified live yet
Frontend push + Pages deploy + live curl sweep pending owner consent.
