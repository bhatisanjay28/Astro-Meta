# Launch blockers — vyotish.com go-live checklist (Story S6 / Epic 8.4)

Owner review gate: go-live happens only when every row below is ✅. Cross-checked
against epics.md "Pre-launch gates" + story totals 2026-11-20. Agent-side work is
done or tracked in [stories-remaining.md](stories-remaining.md); rows marked
**owner** need your input/decision.

| # | Blocker | Who | Where / exact action | Gate |
|---|---------|-----|----------------------|------|
| 1 | Frontend review & push (D8) | **owner** | frontend repo `main` is **LOCAL, ahead 16** (285d710 self-hosted fonts on top of 80976ea). Review `git log origin/main..main`, then push = vyotish.com deploy. | D8 |
| 2 | First admin credentials | **owner** | account **already exists**: vyotish@gmail.com is admin in `admin_users` (row since 2026-11-19; script re-run 2026-11-20 confirmed idempotent; /api/v1/auth/login live). Open item = sign in at `/admin/login` with the password from the 2026-11-19 session; if unknown, say the word and a fresh generated password will be set via the Supabase admin API (shown once, change on first sign-in) | 6.4 |
| 3 | Legal final drafts (7.3) | **owner** | **drafts landed 2026-11-21** — privacy/terms/refund/disclaimer/about fully written (DPDP Act 2023 + DPDP Rules 2025 + E-Commerce Rules 2020 grounded; see epics.md 7.3). Owner actions: (a) legal review of all 5 pages (counsel optional); (b) supply **registered entity legal name + principal address** — required on-page by E-Commerce Rules Rule 4(2); pages currently say "Vyotish" with vyotish@gmail.com only; (c) confirm **Grievance Officer identity** (name/designation — Rule 4(4) requires them displayed; pages currently show the role "Grievance Officer, Vyotish" + vyotish@gmail.com); (d) optional: role addresses privacy@/support@ to replace the gmail one | P7 |
| 4 | Sample-data decision | **owner** | mark or remove sample astrologers/pujas/faq (P8/P9/P10/P17 — `is_sample` flags exist; /admin/* or SQL) | launch |
| 5 | Jyotishi review of muhurat rules | **owner** | P11 — muhurat_rules table review | P11 |
| 6 | Engine sign-off | **owner** | P16/D5 — known-value validation accepted | P16 |
| 7 | Turnstile keys (7.2) | **owner** | Cloudflare Turnstile site+secret keys; then `wrangler secret put TURNSTILE_SECRET_KEY` + widget wiring (S2) | 7.2 |
| 8 | CSP deploy iterations (7.2) | **owner** | `_headers` CSP needs production deploys to verify (S2) — rides on #1 | 7.2 |
| 9 | CF Web Analytics + error monitoring + email (7.4) | **owner** | pick accounts, provide token/DSN/provider (S7); GA4 needs `ga_measurement_id` setting | 7.4 |
| 10 | Lighthouse production re-run (8.2) | **owner** | after #1: re-run audit against vyotish.com; local baseline: `docs/plan/lighthouse-2026-11-20/` (perf 86–100, a11y 90–95, bp 100, seo 92; findings → stories S11/S12) | 8.2 |
| 11 | Device matrix run (8.3) | **owner** | run the S5 checklist on real devices | 8.3 |
| 12 | Token rotation | **owner** | rotate service-role key / wrangler token / GitHub PAT per debt register | debt |
| 13 | vyotish.co.in nameservers | **owner** | switch GoDaddy → bob/melinda.ns.cloudflare.com (301 redirect fully staged) | domain |
| 14 | (optional) GOOGLE_PLACES_API_KEY | **owner** | `wrangler secret put GOOGLE_PLACES_API_KEY` — pickers upgrade worldwide, no code change | 4.7 |
| 15 | ~~~offers_config leftover row~~~ | — | ✅ DONE 2026-11-20 (deleted via dashboard, verified server-side) | — |

Closed items: settings table clean (8 rows, no nulls) · 0.5b secret-scan hooks live ·
backend live at astro-backend.vyotish.workers.dev (262 tests) · sitemap 156 URLs ·
consent stub honest · hreflang pair cleaned.
