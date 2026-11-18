# Changelog — Vyotish-Astro

All notable changes to the Vyotish-Astro project (meta repository tracks the project as a
whole; per-repo detail lives in each repo's own history).

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Epic 0 — Foundations & Orchestrator (in progress)

#### Added
- docs: PRD digest, DECISIONS.md, plan/epics.md with BMAD epic/story plan, repo catalog.
- docs/plan/epics.md: workstream split (frontend / backend / database), API & data
  contracts v1, Epic 0 acceptance criteria.
- docs/placeholders.md: register of every placeholder/sample item to replace before launch.
- THIRD_PARTY_LICENSES.md: third-party licences and attribution obligations.
- Agent operating rules adopted by owner (commits, review, testing, layer ownership,
  cross-repo ordering) — recorded in agent memory and reflected in DECISIONS.md.
- Tooling: Bun 1.4.4 installed as the sole JS runtime (owner directive; no Node/npm).
- MCP connectivity: GitHub MCP + Supabase MCP verified with scoped PATs; Cloudflare MCP
  OAuth granted; Cloudflare wrangler deploy token created and verified active.

#### Changed
- Astro-Backend: Express + Node scaffold replaced by Hono + Bun + TypeScript on
  Cloudflare Workers (Epic 0.2). `/health` and `/api` preserved; `/api/v1` introduced.
- Astro-Frontend: Vite + React SPA replaced by Astro 5 + TypeScript with the Cloudflare
  adapter (Epic 0.3). Coming-Soon page reproduced 1:1 — no regression on vyotish.com.
- Design tokens (brand palette) and the swappable dummy Vyotish wordmark SVG introduced.

#### Decisions
- D1 Astro 5 (5.18.x) retained over Astro 6 (adapter friction); revisit before Epic 7.
- D2 confirmed: Hono on Workers via wrangler in production; Docker (oven/bun) is local
  dev parity only.
- D3 enforced: Supabase touched only by the backend; zero RPC; RLS everywhere.

### Pending
- Epic 0.4: Supabase dev project + schema V1 (20 tables, RLS, seed) — needs the guided
  dev-project creation.
- Epic 0.5 completion: secret-scan pre-commit hooks installed in all three repos.
