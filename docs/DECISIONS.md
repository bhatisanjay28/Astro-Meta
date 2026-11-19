# DECISIONS.md — Vyotish-Astro

Single source of truth for architecture and product decisions. Appended per PRD §18 ("Plan first").
Every entry records date, status, and rationale. Owners approve marked entries.

| # | Decision | Status | Date |
|---|----------|--------|------|
| D1 | Frontend framework: **Astro 5 + TypeScript** | ✅ Approved by owner | 2026-11-18 |
| D2 | Backend: **Hono + TypeScript on Cloudflare Workers**; Bun runtime for local dev; **Docker = local dev parity only** (bun image), production deploys via wrangler | ✅ Approved by owner | 2026-11-18 |
| D3 | Database access: **Supabase Postgres touched ONLY by the backend** (Hono). Zero RPC / stored functions — all queries and business logic live in the backend API. RLS enabled on every table as defense-in-depth. Frontend never holds Supabase keys. | ✅ Owner directive | 2026-11-18 |
| D4 | Auth: Supabase Auth, administered **through backend endpoints** (roles: admin, editor; first admin via secure setup script; MFA recommended). Admin cannot write to Supabase from the browser except through the API. | Decided (per D3) | 2026-11-18 |
| D5 | Ephemeris: **astronomy-engine (MIT licence)** as the default engine behind our own Lahiri-ayanamsha + IANA-timezone layer; validated against known Panchang/Kundli values. Swiss Ephemeris (AGPL/paid) revisited only if accuracy proves insufficient — owner sign-off required before public launch either way. | Decided, revisit-gated | 2026-11-18 |
| D6 | City data: GeoNames-derived dataset (lat/lng/IANA tz) seeded into Supabase; attribution kept in THIRD_PARTY_LICENSES.md. | Decided | 2026-11-18 |
| D7 | **Astro-Meta is the orchestrator**: holds PRD, DECISIONS.md, plan/epics, CHANGELOG, placeholder register; frontend/backend are submodules whose pins are bumped per completed epic. | Decided | 2026-11-18 |
| D8 | Deployment gate: **no production deploy until the owner reviews and approves the local build** (PRD §2, §18). Local preview at every milestone. | Decided | 2026-11-18 |
| D9 | Branding: site name "Vyotish", original dummy SVG wordmark kept in one file for easy swap; final logo supplied later. | Decided (PRD §1, §9) | 2026-11-18 |

## Consequences of D1 (Astro migration)

- The current Astro-Frontend code is a Vite + React SPA ("Coming Soon" page). It will be **replaced by an Astro project** in Epic 0. The live Coming-Soon page is reproduced as the first Astro page so https://vyotish.com does not regress during migration.
- Interactive pieces (Kundli form, calculators, matching) render as **Astro islands** — server-rendered shells with hydrating React/Svelte components only where needed, keeping Lighthouse ≥90 realistic.
- **Research note (2026-11-18):** Astro 6 is now released but its `@astrojs/cloudflare` adapter still has reported friction (workerd dev-runtime changes, image transform endpoint, prerendered-manifest issues). Astro 5 (latest 5.18.x) is retained per D1; migration to 6.x is deferred until the adapter stabilises — revisit before Epic 7.

## Consequences of D2/D3 (backend shape)

- The existing Express scaffold in Astro-Backend is replaced by a Hono + Bun + TypeScript Workers project (Epic 0.2). Endpoints `/health`, `/api` preserved.
- Supabase service-role key lives in **Worker secrets only** (`wrangler secret put`), never in the repo, never in frontend env.
- Scheduled jobs (daily Panchang/horoscope refresh, panchang_cache pruning) are Workers Cron Triggers within the same backend project.

| D10 | **Epic/story plan v2** after BMAD traceability review of the PRD (2026-11-19): 14 gaps found and placed into new stories 1.7–1.10, 2.5–2.6, 4.5–4.6, 5.5 + polish items (see epics.md Gap Log). Engine configurability (ayanamsha/month/house/chart) accepted as required-by-PRD. | ✅ Owner-directed review | 2026-11-19 |
| D11 | **Design source of truth = the owner-attached homepage mockup** (Stitch/Tailwind export): exact palette, Cinzel/Poppins/JetBrains Mono type, Material Symbols icons, tabs, sections, components. **Supersedes the "Sandalwood & Teal" theme** for all redesigned surfaces. Tailwind v4 `@theme` carries the design config verbatim; utilities-only (no preflight) so legacy pages keep their own CSS; `.chrome-reset` scopes resets to redesigned markup; dual theming (`.dark` class + `data-theme`) keeps legacy tokens working. Frontend rebuild stays LOCAL until D8. | ✅ Owner directive ("same as attached html, don't change anything") | 2026-11-19 |
| D12 | **API-first + Supabase-only data plane (owner directive):** ALL business logic ("what to show") lives in the backend Hono engine/routes and is consumed via `/api/v1/*`; ALL page data (horoscopes, cities, astrologers, poojas, blog teasers, FAQs, content blocks, seeds) lives in Supabase tables with RLS. The frontend is a thin renderer: no baked-in data arrays, no client-side computation beyond drawing/markup. Sample content is seeded into Supabase marked `is_sample=true` so the frontend renders from the API from day one; later epics (5.x, 6.x admin) manage the same tables. Implemented as **Epic 9**. | ✅ Owner directive ("all the logic in backend, call with APIs; all data in Supabase DB; always use BMAD") | 2026-11-19 |
| D13 | **Admin platform decisions (Epic 6.1/6.2):** authorization source = `admin_users` table (migration 0006, service-role read by backend middleware); 0001's `user_roles`/`profiles`-based staff RLS is inert under D3/D12 (backend bypasses RLS; nothing public writes) and left untouched. **Scheduled posts = draft status + future `publish_at`** with a lazy sweep-to-published on listing (no cron dependency, keeps the 0001 status constraint). **Media storage = Supabase Storage** public `media` bucket (PRD §2 pins Supabase = Postgres+Auth+Storage), 5MB cap, PNG/JPEG/WebP/GIF only (SVG rejected as stored-XSS vector). Markdown sanitisation happens at render time in the public blog (Epic 6.3, rehype-sanitize) — stored markdown is admin-role-gated at write. Token validation delegated to Supabase `/auth/v1/user` (no JWT crypto deps); `aal` claim read post-validation → MFA enforcement is a middleware option. | Decided (agent, within D3/D4/D12 bounds) | 2026-11-19 |

## Open items

- Supabase project creation (owner, with agent guidance) — needed before Epic 0.4.
- MCP connections: servers are declared and reachable (HTTP 401 = auth pending). Resolved routes per research: **GitHub** — fine-grained PAT (3 repos, Contents R/W) wired as `Authorization` header, or OAuth popup; **Supabase** — PAT (Account → Access Tokens) wired as header, or OAuth; **Cloudflare** — OAuth only via Settings → MCP (owner click), plus a scoped API token for wrangler deploys stored in gitignored `.env`.
- Runtime: Bun 1.4.4 installed on the workstation; Node/npm intentionally absent (owner directive — Bun only).
- BMAD skill files were lost with the old local workspace; BMAD process is run manually (this plan) — reinstall optional, not blocking.
