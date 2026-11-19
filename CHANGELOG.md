# Changelog — Vyotish-Astro

All notable changes to the Vyotish-Astro project (meta repository tracks the project as a
whole; per-repo detail lives in each repo's own history).

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Infra complete — CI pipeline live + city-mode Panchang (2026-11-19)

- PAT vyotish-zcode-agent: Actions/Secrets/Workflows R/W granted (owner sudo).
- GitHub repo secrets set via API (sealed-box): CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
- Actions deploy pipeline LIVE: first run 44458377057 completed/success
  (8/8 steps: install→test→lint→typecheck→wrangler deploy). Push = deploy.
- Worker secrets set: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
- Panchang city mode LIVE on the API: ?city={slug} DB lookup (30-city seed),
  per-city IANA timezones (London/GMT verified), 404 for unknown slugs.
  Frontend /panchang/[city] pages now resolve their real city slugs.

### Re-theme — "Sandalwood & Teal" (owner brief, colours only)

#### Changed (frontend, local commit 0a84310)
- Palette replaced end-to-end: light (sandalwood #FAF6EE bg, white surfaces,
  teal #1F6F78 primary, terracotta #E58E62 accent) is now the DEFAULT theme;
  dark theme (#0F1B1C/#172627, teal #5CB8C2) provided per brief. Theme toggle
  follows the system setting by default and remembers the user choice.
- All colour centralised in tokens.css (--color-* tokens + legacy aliases);
  zero colour values outside the token file; all gradients/glows removed.
- Usage rules applied: teal primary buttons, terracotta CTAs with dark text,
  white secondary buttons with teal border, teal headings/links (terracotta
  hover), teal footer with white text, active nav = teal bg white text.
- Status chips (auspicious #1E6B3A/#E6F4EA, inauspicious #A32A2A/#FBE9E7 —
  dark variants supplied) always carry a ✓/⚠ icon or label, never colour alone.
- Favicon + wordmark recoloured (wordmark now inlines with CSS-var fills so it
  adapts per theme).

#### Fixed
- Five JS-injected islands (glance cells, Quick Kundli, Panchang detail,
  muhurat results, kundli charts/tables) had silently unstyled results —
  Astro scoped CSS cannot match innerHTML-injected nodes. Style blocks are
  now is:global. Bug existed since Epic 2/3; exposed by the re-theme QA.

#### Verified
- WCAG contrast script: light 12/12 and dark 12/12 pairs pass (4.5:1 text /
  3:1 UI); interactive borders use a stronger token where the decorative
  sandy border fails 3:1. Old-palette hex sweep across src+public: clean.
- Screenshots (light home, teal footer, dark muhurat chips, kundli chart)
  saved to session artifacts for owner review.


### Epic 0 — Foundations & Orchestrator (✅ core stories complete, 2026-11-18/19 overnight run)

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
- **Epic 0.4 — Supabase live:** project `vyotish-dev` (ref owgszyhxvyomxyxhoeed,
  ap-southeast-1) created; schema V1 applied — 20 tables, RLS enabled on ALL 20
  (deny-by-default, inline user_roles policies, zero stored functions per D3);
  sample seed (30 cities GeoNames subset, 3 sample astrologers, 3 sample pujas,
  3 sample festivals, 3 sample muhurat rules, public.* site settings).
- **Epic 1.1/1.2 — calculation engine core (backend `src/engine/`):** Lahiri ayanamsha
  (validated vs published tables), astronomy-engine 2.1.19 wrapper, wrap-aware bisection
  finders, Panchang five limbs as start/end windows in the sunrise-based Vedic day,
  Rahu Kaal/Yamaganda/Gulika (unverified tables flagged pending Jyotishi review P11),
  Abhijit/Brahma Muhurta, moonrise/moonset.
- **Epic 1.3 — Kundli core:** nine grahas, Lagna (validated at sunrise across three
  locations), whole-sign houses, Navamsha D9, Vimshottari Dasha.
- **Epic 1.5/1.6 — calculator primitives + engine README:** moon phase, tropical sun
  sign, Rashi/nakshatra, Chaldean numerology; accuracy notes documented. A frame-mixing
  bug (sidereal vs tropical elongation) was caught by the moon-phase tests and fixed.
  **59/59 tests green.**
- **Epic 3.1 (partial) — GET /api/v1/panchang live** on
  https://astro-backend.vyotish.workers.dev (coords mode; city mode activates when the
  Supabase service key is configured as a Worker secret).
- **Epic 0.5 (partial) — GitHub Actions workflows written** in both repos (backend
  deploy-on-push; frontend build-only). Waiting on owner: PAT Workflow/Actions scope
  + repo secrets — see the morning action list.
- Backend CI gates: bun test, Biome lint, tsc strict — all green before every push.

#### Changed
- Astro-Backend: Express + Node scaffold replaced by Hono + Bun + TypeScript on
  Cloudflare Workers (Epic 0.2). `/health` and `/api` preserved; `/api/v1` introduced.
- Astro-Frontend: Vite + React SPA replaced by Astro 5 + TypeScript with the Cloudflare
  adapter (Epic 0.3). Coming-Soon page reproduced 1:1 — **pixel parity verified by
  side-by-side screenshots vs live vyotish.com** (artifacts saved for owner review).
- Design tokens (brand palette) and the swappable dummy Vyotish wordmark SVG introduced.
- Frontend `preview` = Bun static server (adapter lacks astro preview; workerd unstable
  on this workstation).

#### Deployment state (owner-authorised overnight run)
- **LIVE:** backend Worker `astro-backend` on Cloudflare (manual wrangler deploy);
  Supabase `vyotish-dev` database (schema + seed).
- **LOCAL ONLY (owner directive):** Astro-Frontend — committed `ea68a38`, NOT pushed
  (push to main would auto-deploy vyotish.com; awaiting owner build approval, D8).

### Pending (morning action list)
- Owner/I: grant the GitHub PAT `Workflow` + `Actions` scopes (browser, sudo needed),
  set repo secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY), then push the prepared workflow commits → CI goes live.
- Set `SUPABASE_SERVICE_ROLE_KEY` (+ `SUPABASE_URL`) as Worker secrets (`wrangler
  secret put`) → city mode + panchang_cache go live.
- Epic 0.5 completion: secret-scan pre-commit hooks installed in all three repos.
- Epic 1.3/1.4: Kundli + Muhurat modules; Epic 2: site shell.
