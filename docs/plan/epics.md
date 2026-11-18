# Vyotish-Astro — Epic & Story Plan (BMAD)

Derived from the PRD (docs/PRD.md) and DECISIONS.md. Epics map to PRD §18 milestones.
Working mode: autonomous, but **any product judgement call → stop and ask the owner**.
Every epic ends with: local build verified, owner demo, CHANGELOG + placeholder register updated.
**Build gate: nothing deploys until the owner approves the local build (D8).**

Status legend: ⬜ todo · 🔄 in progress · ✅ done · ⏸️ blocked

---

## Epic 0 — Foundations & Orchestrator (PRD milestone 1) — status ⬜
Goal: repos, environments, design system, schema, all scaffolding in place.

| # | Story | Repo | Notes |
|---|-------|------|-------|
| 0.1 | Meta orchestrator setup: PRD, DECISIONS.md, plan/, CHANGELOG.md, docs/placeholders.md, THIRD_PARTY_LICENSES.md | Astro-Meta | Done as part of this commit except registers |
| 0.2 | Backend re-architecture: replace Express with **Hono + Bun + TS** Workers project; wrangler config; `/health`, `/api/v1`; Dockerfile (bun image) for local dev; lint+test wired | Astro-Backend | Express scaffold removed; endpoints preserved |
| 0.3 | Frontend re-architecture: **Astro 5 + TS** with `@astrojs/cloudflare` adapter; Coming-Soon page reproduced 1:1 (no regression on vyotish.com); design tokens (Impeccable direction) + dummy Vyotish SVG wordmark | Astro-Frontend | SPA → Astro migration per D1 |
| 0.4 | **Supabase project** (dev project first) + schema V1: all 20 PRD §10 tables, RLS on every table, indexes; seed script (cities subset + clearly-marked sample content) | Supabase + Astro-Backend migrations | Needs owner-created project |
| 0.5 | Environments & secrets: `.env.example` both repos; Worker secrets via wrangler; secret scanning pre-commit | Both | PRD §14 |

## Epic 1 — Calculation Engine (PRD §5.3/5.4/5.5/5.7, §8) — status ⬜
Goal: versioned, tested engine — the site's spine. Zero I/O, pure functions.

| # | Story | Notes |
|---|-------|-------|
| 1.1 | Core astronomy layer: astronomy-engine wrapper, Lahiri ayanamsha, IANA tz handling, sunrise-based Vedic day | D5 |
| 1.2 | Panchang module: 5 limbs w/ start-end times, Rahu Kaal/Yamaganda/Gulika/Abhijit, Choghadiya, Hora, Amanta+Purnimanta | Validation tests vs known dates |
| 1.3 | Kundli module: charts (N/S Indian), planetary positions, divisionals incl. Navamsha, Vimshottari Dasha, doshas | Validation vs known charts |
| 1.4 | Muhurat rules engine: rules as data tables w/ documented sources; finder (event, range, city) | Owner flags: Jyotishi review pre-launch |
| 1.5 | Calculator primitives: rashi, nakshatra, sun sign, lagna, moon phase, numerology set | Tier 1 per PRD 5.7 |
| 1.6 | Engine published as internal package w/ README + accuracy notes | Consumed by backend |

## Epic 2 — Public Site Shell & Home (PRD §4, §6, milestone 2) — status ⬜
Goal: 9-tab navigation, home page, legal skeleton — all responsive, light/dark.

| # | Story | Notes |
|---|-------|-------|
| 2.1 | Header/footer/nav: Vyotish+logo, 9 tabs, EN/HI switch, theme toggle, CTA; mobile drawer + sticky bottom CTA | |
| 2.2 | Home page full composition per PRD §6 (hero, today-at-a-glance, horoscope picker, explore tiles, quick Kundli, calculators, astrologers-sample, festivals, pooja, blog, trust, FAQ, newsletter) | |
| 2.3 | About/Contact + 4 legal pages skeleton + custom 404 + offline/empty/error states + consent banner stub | Content in Epic 7 |
| 2.4 | a11y + i18n foundations: ≥44px targets, focus rings, `/hi/` route structure + hreflang scaffolding, reduced-motion | PRD §9, §13 |

## Epic 3 — Panchang & Muhurat surfaces (PRD §5.3/5.4, milestone 3) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 3.1 | Backend API: `/api/v1/panchang?city&date` with edge cache (panchang_cache) + cron refresh | D3: all DB via API |
| 3.2 | `/panchang/[city]` SSR pages + city selector (remembered) + date picker + monthly view + About/Accuracy note | Per-city SEO URLs |
| 3.3 | Backend API: today's windows + muhurat finder | Rules from engine 1.4 |
| 3.4 | `/muhurat` today page + finder UI | |

## Epic 4 — Kundli & Calculators (PRD §5.5/5.7, milestone 4) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 4.1 | Backend API: kundli generate (+ no-PII cache policy), matching, calculator endpoints | Consent noted for birth data |
| 4.2 | Free Kundli UI: city autocomplete, no-signup, N/S chart toggle, printable SVG charts, doshas + interpretations | |
| 4.3 | Kundli matching UI: Ashtakoota 36 + Manglik + score explanation | |
| 4.4 | Calculator library: shared template (form/result/explanation/FAQ/share/related/soft CTA) + index with search; all Tier 1 tools | Fun ones labelled "for fun" |

## Epic 5 — Horoscope, Consultations, Poojan, Gemstones (PRD §5.1/5.2/5.6/5.8, milestone 5) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 5.1 | Horoscope APIs + `/horoscope/[sign]/[period]` pages; Moon-sign notice + Rashi link; content from DB | Sample content marked |
| 5.2 | Astrologer directory + profile pages (sample data, filters/sort) + booking request form (Turnstile, rate limit → API → Supabase → admin notify) | |
| 5.3 | Poojan catalogue + detail + booking requests | |
| 5.4 | Gemstones "Coming soon..!" driven by `GEMSTONES_SITE_URL` setting | |

## Epic 6 — Blog & Admin Panel (PRD §7, milestone 6) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 6.1 | Admin auth via backend: Supabase Auth, admin/editor roles, session expiry, MFA-ready, first-admin setup script | D3/D4 |
| 6.2 | Post CRUD: draft/publish/schedule/preview, Markdown + sanitiser, media upload (Supabase Storage via API), categories/tags/slug/excerpt/featured image, SEO fields, soft delete | XSS-safe |
| 6.3 | Public blog: listing/pagination, category+tag pages, search, article w/ TOC, related, share, author box, RSS, sitemap | |
| 6.4 | Admin modules: horoscope content, astrologers, poojas, requests inbox, contact messages, newsletter export, site settings | SHOULD items |

## Epic 7 — SEO, Security, Legal, Analytics (PRD §11–§16, milestone 7) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 7.1 | SEO pass: unique titles/metas, canonical, hreflang, JSON-LD (Org/WebSite/Breadcrumb/Article/FAQ/Person), sitemap, robots, OG images, internal linking | |
| 7.2 | Security pass: CSP/HSTS/etc headers, rate limiting everywhere, Turnstile on all forms, input validation audit, dependency audit, secret scan | |
| 7.3 | Legal content: Privacy/Terms/Refund/Disclaimer/About/Contact final drafts + DPDP data-handling statements + grievance contact | Placeholder until owner supplies entity details |
| 7.4 | Analytics + events (CF Web Analytics), error monitoring hookup, transactional email design (no real sends pre-approval) | |

## Epic 8 — QA, Performance & Owner Review Gate (PRD §12/§17/§19, milestone 8) — status ⬜
| # | Story | Notes |
|---|-------|-------|
| 8.1 | Test suites green: engine units, API tests, E2E core journeys; edge cases (midnight births, foreign tz, leap years, near-poles, invalid inputs) | |
| 8.2 | Performance: Lighthouse ≥90 P/SEO/A11y; budgets on mid-range device profile | |
| 8.3 | Manual device matrix: low-end Android + iPhone, both themes, slow network | Owner participates |
| 8.4 | **Owner review gate**: local demo, placeholder register walk-through, launch blockers list | D8 — nothing deploys before this |

---

## Workstream split (owner directive 2026-11-18)

| Workstream | Owns | Repos |
|---|---|---|
| **Frontend** | Astro pages/islands, design system, SEO markup, a11y, i18n scaffolding; consumes API only | Astro-Frontend |
| **Backend** | Hono API, business logic, engine package, caching, cron, Supabase access (D3), admin APIs | Astro-Backend |
| **Database** | Schema V1 migrations, RLS policies, indexes, seed scripts — *authored in backend repo, applied to Supabase dev project* | Astro-Backend → Supabase |

Database is **never touched by the frontend** (D3). No RPC/stored functions — all logic in Hono handlers.

## API & data contracts v1 (agreed before parallel build — PRD §2)

All workstreams code against this contract; changes require a DECISIONS.md entry.

- **Base/versioning:** backend serves `/api/v1/*` only. Breaking change ⇒ new version prefix, old kept until frontend migrates.
- **Auth:** Supabase Auth JWT in `Authorization: Bearer <jwt>`. Admin/editor routes check role claim server-side (D4).
- **Envelope:** success `{ "data": …, "meta"?: … }`; error `{ "error": { "code": string, "message": string, "details"?: … } }` with correct HTTP status. Codes are stable machine strings (`validation_error`, `not_found`, `rate_limited`, …).
- **Pagination:** `?page=&limit=` (limit ≤ 50) → `meta: { page, limit, total }`.
- **Domain endpoints (signatures fixed at story level with @hono/zod-openapi schemas):**
  - `GET /health`, `GET /api` (preserved from scaffold)
  - `GET /api/v1/panchang?city={slug}&date={YYYY-MM-DD}` · `GET /api/v1/muhurat/today?city=` · `POST /api/v1/muhurat/find`
  - `POST /api/v1/kundli` · `POST /api/v1/kundli/match` · `GET /api/v1/calculators/{tool}`
  - `GET /api/v1/horoscope/{sign}/{period}` · `GET /api/v1/astrologers` · `GET /api/v1/astrologers/{slug}`
  - `POST /api/v1/requests/consultation` · `POST /api/v1/requests/puja` (Turnstile token + rate limit)
  - `GET /api/v1/pujas` · `GET /api/v1/blog/posts` · `GET /api/v1/blog/posts/{slug}` · admin CRUD under `/api/v1/admin/*`
  - `GET /api/v1/settings/public` (drives `GEMSTONES_SITE_URL` tab behaviour)
- **Determinism/caching:** panchang & kundli responses are pure functions of inputs ⇒ cached (panchang_cache keyed city+date; no-PII policy for kundli). Cron refreshes daily content.
- **Schema V1:** the 20 tables from PRD §10; RLS on every table; cities seeded from GeoNames subset; migrations live in `backend/supabase/migrations/`.
- **Frontend↔backend:** typed API client in frontend generated/checked against the OpenAPI schema; no Supabase client anywhere in frontend (D3).

## Epic 0 acceptance criteria

| Story | Done when |
|---|---|
| 0.1 | CHANGELOG.md, docs/placeholders.md, THIRD_PARTY_LICENSES.md exist and are referenced in README |
| 0.2 | `bun install && bun test && bun run dev` green; `/health` + `/api/v1` respond; `wrangler dev` runs the same app; Docker build (pinned oven/bun) runs; lint passes |
| 0.3 | `bun install && bun build && bun run preview` green; Coming-Soon page pixel-parity vs current SPA; design tokens file + swappable wordmark SVG committed; Lighthouse ≥90 local |
| 0.4 | Migrations apply cleanly to the dev Supabase project; RLS verified (anon can read public, insert own requests only); seed script runs |
| 0.5 | `.env.example` in both repos documents every var; secret-scan pre-commit hook active; no real secrets in any tracked file |

---

## Dependencies
E1 feeds E3/E4 APIs · E0.4 (schema) feeds all data stories · E2 shell feeds all pages · E6.3 needs E6.2 · E7/E8 last.
Parallelisation after Epic 0: calc engine (E1) can run alongside E2 shell; E3–E5 sequence behind both.

## Environment status (2026-11-18)

- Bun 1.4.4 installed on the workstation (Bun is the only JS runtime — owner directive; Node not installed).
- MCP servers declared in ZCode user config: github, cloudflare, supabase, context7. Endpoints reachable (401 = auth pending). Auth routes per research: GitHub PAT header or OAuth; Supabase PAT header or OAuth; Cloudflare OAuth only (+ separate API token for wrangler deploys).
- Supabase dev project: to be created in the guided browser session (Epic 0.4 prerequisite).

## Immediate next actions (on GO)
1. Guided browser session: GitHub login → fine-grained PAT; Supabase login → PAT + create dev project; Cloudflare login → MCP OAuth approve in Settings → MCP + API token for wrangler. Then session restart → verify all MCP connections live → GO/NO-GO.
2. Epic 0 stories 0.2/0.3 run in parallel (backend re-arch + Astro migration), then 0.4/0.5.
3. Epic 1 (engine) and Epic 2 (site shell) follow in parallel per Dependencies.
