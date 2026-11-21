# Changelog — Vyotish-Astro

All notable changes to the Vyotish-Astro project (meta repository tracks the project as a
whole; per-repo detail lives in each repo's own history).

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Calculators overhaul — Epic 14 (owner directive 2026-11-21: "cross check and fix outputs of all the calculators")

BMAD pipeline (Mary research → Quinn cross-check → Sally output-spec → Bob stories →
Amelia dev → Quinn verify). Full papers: `_bmad-output/calculators/`.

#### Root causes behind the owner's "missing details / wrong alignment" report
- **Missing details:** 20 endpoints returned rich payloads the old page never rendered —
  it dumped raw rows (`grid-result`) with no verdict, chips, tables or interpretation.
- **Wrong alignment:** Astro scoped CSS never matches JS-injected DOM nodes, so every
  result block was unstyled.
- **Wrong values (17 proven bugs):** UTC day-shift solver for evening births (P0),
  tropical Rahu/Ketu (P0), sade-sati window start, raw manglik flags dropped when
  cancelled, mean-node formula, 6 dead pages (mangal-dosha/kaal-sarp wiring, FLAMES
  params, names-kind fields), missing required inputs (plate, gender, optional date).

#### Backend — 2 deploys, CI ✅, live-verified 27/27 (ab93aa0 + d362808)
- engine 1.4.0-alpha1: QB-01 UTC solver, QB-02 sidereal mean nodes, QB-05 raw manglik
  flags kept alongside cancellations, QB-06/07 sade-sati first-entry windows + dhaiya +
  phase_windows, cumulative antardashas, interpretations layer, kaal-sarp planet table,
  KARAKA_SCHEME, honest Unparseable plates.
- 4 new routes: nakshatra / lagna / vimshottari-dasha / mangal-dosha (+ vehicle-plate
  rewrite, name-numerology owner_compatibility). 313 tests green on pushed HEAD d362808.

#### Frontend — 3 commits pushed = D8 deploy (7ba48b4 → 3cf3301; 36 commits went live)
- Shared block renderer (`calculator-renderer.ts` + per-endpoint `calculator-render-map.ts`):
  verdict card (B1) + status chips (B2) + meaning/guidance/basis (B3) + detail cards,
  tables, Lo Shu 3×3, dasha bar/timeline (B4) + honesty rules: `verified:false` →
  P11 flagline, for_fun label, unmapped keys → "More details" fallback (B5).
- All 23 calculator pages rebuilt on it; `is:global` result styles off theme tokens;
  3 new pages (nakshatra / lagna / vimshottari-dasha); registry fixes (dedicated
  mangal-dosha + kaal-sarp routes, names-kind a/b fields, required plate input,
  gender select, optional owner date, sade-sati as-of); hub + sitemap updated.

#### Verification (S14-3)
- 26/26 regressions vs deployed backend **and** vs live vyotish.com post-deploy;
  27/27 live-Worker checks; 14/14 S13 e2e on the new renderer; 11/11 S14 UI checks;
  axe wcag2aa 8/8 (4 pages × light/dark); 92/92 result-bearing shots at
  360/768/1024/1440 → `_bmad-output/calculators/qa/shots-after/`.
- Deferred (documented): gochara overlay for dasha pages, P11 Jyotishi sign-off.

### Engine completeness + full page layer — Epics 1.8–1.10, 2.5, 4.1–4.6, 5.1–5.5, 3.2b/3.4b/2.3b (2026-11-19)

#### Backend — 5 deploys, CI ✅, all live-verified (3f177ac → 34da3c5)
- **1.8 Ashtakoota (3f177ac):** 36-guna/8-koota matching + Manglik (Lagna/Moon/Venus,
  classical cancellations); `verified:false` pending Jyotishi review (P11); self-match
  28/36 identity + recomputation cross-checks tested.
- **1.9 Configurability (f9fc742):** engine config (ayanamsha/month/house/chart style)
  with allowed-value validation; migration **0005** applied via MCP
  (`public.engine_*` site settings — do NOT re-run); **GET /api/v1/settings** (engine
  config + gemstones/contact/WhatsApp); panchang `hindu_month.primary`; kundli
  accepts strict-validated options.
- **1.10 Sade Sati + divisionals (02e6530):** Sade Sati window = first trio entry →
  final exit (retro dips ignored; **external anchor: Aquarius-moon 2020-01-24 →
  2028-02-23 matches published ingresses**), phases 1/2/3; Parashari D3/D7/D9/D10/D12
  (D9 sync-tested); ENGINE_VERSION **1.3.0-alpha1**; kundli response gains
  `divisionals` + `sade_sati` + `manglik` + `kaal_sarp`.
- **4.1 match endpoint:** POST /api/v1/kundli/match (Ashtakoota + Manglik both sides +
  classical combined note); shared birth validation extracted to src/lib/birth.ts.
- **4.4/4.6 tools (9ad9db8):** engine/tools.ts (Jaimini karakas, Ishta Devata base —
  deity table deferred to P11, Kaal Sarp ×12 types, Lo Shu, FLAMES/love/friendship
  for_fun, vehicle/mobile/name numerology, age) + **GET /api/v1/calculators/{…} ×16**.
- **5.2/5.3 (d3d25a4):** GET /astrologers(+/{slug}) + GET /pujas(+/{slug},?category=);
  POST /requests/consultation + /requests/puja (validation, per-IP throttle, slug→id
  resolution, anon inserts via RLS).
- **3.2b/3.4b (6ccd7ce, 34da3c5):** GET /api/v1/festivals?date=; Choghadiya slots in
  muhurat/today auspicious+avoid lists.
- Tests **177/177** green; biome clean; tsc strict clean (one CI lint failure on
  appended-file formatting — fixed in 34da3c5, CI green).

#### Frontend — LOCAL commit 9d20739 (NOT deployed; D8 gate)
- **+2,189/−75 across 26 files** — the full page layer over the API-first backend:
  - **5.1** /horoscope/ hub + **72 static** /horoscope/{sign}/{period} pages (12×6)
    with runtime API text + honest unavailable state.
  - **4.4/4.6** /calculators/ hub (DB-driven Tier 1 grid) + **17 shared-template tool
    pages** (BirthForm + generic result renderer; for_fun + P11 flags surfaced).
  - **4.3** /matching — Ashtakoota table + Manglik verdicts (browser-verified
    self-match 28/36).
  - **4.5** /astrology/learn — content collection + **7 original articles** (12 rashis,
    Navagraha, 27 nakshatras, houses, panchang, doshas, dasha) + /astrology hub.
  - **5.2/5.3** /consultations + /poojan directories (build-time API fetch) + shared
    BookingForm posting live to /requests/*.
  - **5.4** /gemstones wired to /settings (links out when the store URL is set).
  - **2.5** home picker cards → per-sign pages; calculators strip hrefs live (DB
    content_blocks hrefs updated via MCP).
  - **3.2b** city panchang: Today/Tomorrow quick buttons, festivals block, Hindu month
    + Samvat cells; **2.3b** consent-banner stub in Base.
- astro check 0 errors; biome clean; build OK; browser-verified: per-sign pages
  (API text live), sade-sati tool E2E, matching self-match, both directories,
  learn articles, gemstones branch.

#### Status
- **~42 of 50 tracked stories done.** Remaining: E6 (blog/admin), E7 (SEO/security/
  legal/analytics), E8 (QA/launch gates — owner participation), polish 3.1b (cache/
  cron), monthly calendar view, kundli interpretations, 5.2 profile pages.

### Epic 9 complete — API-first data plane live end-to-end (2026-11-19)

#### Backend — deployed 494aeff (CI ✅, verified live)
- **9.1 Supabase migration 0004** (applied once via MCP, vyotish-dev): astrologers/
  pujas extended additively for the design surface (title, availability, sort_order,
  accent, includes jsonb); NEW `faq_items` + `content_blocks` tables with public-read
  RLS (status='published'); D11-verbatim seeds (3 astrologers, 3 pujas, 3 home FAQs,
  5 content blocks) marked `is_sample=true`; generic V1 placeholders soft-retired
  (is_active=false) → exactly 3+3 active.
- **9.2 GET /api/v1/cities** (?lang=&country= — public city list; live: 30 cities
  incl. London/Kathmandu/New York with Hindi names) + **GET /api/v1/content/home**
  (one cacheable bundle: astrologers, poojas with includes, faqs, keyed content
  blocks; honest is_sample flags; 503 w/o creds, 500 on REST failure) — both
  live-verified.
- **9.3 Engine 1.2.0-alpha1:** panchang `active{as_of, limb→{window,next}}` —
  server-side current/next picking with deterministic fallbacks + `nowOverride`
  (D12: the frontend renders picks, never computes). Tests 113/113 green
  (pickActiveLimb boundaries/fallbacks, computePanchang active fields, cities/
  content route mapping/503/validation/500 with mocked Supabase REST).

#### Frontend — LOCAL commit 25bb1b4 (NOT deployed; D8 gate)
- **9.4 thin-client rewiring:** home content arrays, hero trust badges and
  gemstones kicker/title now BUILD-time fetches of /content/home with honest
  empty notes on failure; city select + kundli datalist RUNTIME fetches of /cities;
  panchang [city]/index getStaticPaths generated from /cities (30 pages);
  `src/data/cities.ts` (219 lines) DELETED; rashiphal text removed from
  HomeHoroscope (API-only data, honest unavailable line); HomePanchang renders
  server-picked `active` limbs — client currentLimb/nextLimb pickers deleted.
- astro check 0 errors; biome clean; build OK; browser pass: every home section
  renders from live APIs identically to the D11 mockup (astrologers VS/AD/RM
  initials derived, pooja ₹ formatting, 30-city datalist, Varanasi page props).
- Boundary kept: NAV_TABS + 12-sign identity remain frontend presentation config;
  ALL content/rows are Supabase→API.

### D11 design rebuild live-verified + D12 API-first directive (2026-11-19)

#### Decisions
- **D11 (owner directive):** attached homepage mockup = design source of truth;
  supersedes Sandalwood & Teal on redesigned surfaces.
- **D12 (owner directive):** API-first + Supabase-only data plane → new **Epic 9**
  (backend owns all logic, frontend renders from `/api/v1/*`, no baked data).

#### Backend — deployed 805babc (CI ✅, verified live)
- **1.7 engine:** Hindu month (Amanta+Purnimanta, adhika) + paksha + Vikram/Shaka
  Samvat + Choghadiya (day+night, drikpanchang-verified 14-weekday regression) +
  Hora — all surfaced in `/api/v1/panchang`. Live values match the design sample
  (Kartika • Shukla • Vikram 2083 • Shaka 1948).
- **5.1 partial:** GET `/api/v1/horoscope` (period/lang/signs) + rolling 12×EN/HI
  sample seeds (`is_sample=true`) — verified live.
- **5.5 partial:** POST `/api/v1/newsletter` (validation, source whitelist,
  per-IP throttle → 429, Supabase upsert) — happy path + validation verified live.
- Tests 96/96 green (hindu-calendar, choghadiya/hora regression, routes).

#### Frontend — LOCAL commit e303b6c (NOT deployed; D8 gate)
- Home + chrome (utility bar, header, footer) rebuilt pixel-exact to the D11
  mockup; Tailwind v4 utilities-only with `@theme` design tokens; chrome-reset
  scoped resets; dual theming (class+attribute); Material Symbols per design.
- Live islands: panchang (city/date, limbs, sun/rahu/abhijit, Hindu month &
  Samvat), horoscope (period tabs), kundli form (N/S/E SVG charts — live E2E
  verified), newsletter ×2; honest Phase-1 booking modal (no fake success).
- Fixes: unlayered `icon-display.css` so display utilities beat the Google-hosted
  icon rule; panchang island `sun` ReferenceError + duplicate nextLimb;
  kundli/muhurat page global styles scoped (bare `button` leaked onto chrome).
- Placeholder favicon re-coloured to D11 palette (+a11y title); biome
  tailwindDirectives + preset migration; biome clean; verified light+dark
  across home/kundli/muhurat/panchang pages.

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
