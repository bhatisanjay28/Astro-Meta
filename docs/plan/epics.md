# Vyotish-Astro — Epic & Story Plan (BMAD) — v2

Derived from the PRD (`Vyotish_Website_Build_Brief.docx` v1.0) and DECISIONS.md.
**v2 (2026-11-19): full BMAD traceability review** — every PRD section was mapped to
stories; 14 gaps found and logged (see Gap Log). New stories are appended with new
numbers (no renumbering) to preserve traceability.
Working mode: autonomous, but **any product judgement call → stop and ask the owner**.
Every epic ends with: build verified, owner demo, CHANGELOG + placeholder register updated.
**Build/deploy gate: backend deploys via CI on push; frontend deploys ONLY after owner
approval (D8).**

Status legend: ⬜ todo · 🔄 in progress · ✅ done · 🔶 done with refinements (listed)

---

## PRD traceability matrix (§ → stories)

| PRD § | Requirement area | Stories |
|---|---|---|
| §1–2 | Overview, MCP, working method | setup stories (done), D-decisions |
| §3 | Reference sites (structure only) | research done informally; rules respected |
| §4 | Nav/header/footer/mobile | 2.1 ✅ |
| §5.1 | Consultations directory/profile/booking | 5.2 (+offers configurable) |
| §5.2 | Horoscope | 5.1 |
| §5.3 | Panchang | 1.2 ✅, **1.7 new**, 3.1 ✅+**3.1b**, 3.2 ✅+**3.2b** |
| §5.4 | Muhurat | 1.4 ✅, 3.3 ✅, 3.4 🔶 (Choghadiya display ← 1.7) |
| §5.5 | Kundli/matching/learn | 1.3 ✅, **1.8–1.10 new**, 4.1 🔶, 4.2 🔶, **4.3, 4.5** |
| §5.6 | Poojan | 5.3 |
| §5.7 | Calculators | 1.5 ✅, **4.4, 4.6 (Tier 2)** |
| §5.8 | Gemstones | 5.4 🔶 |
| §5.9 | Blog | 6.3 |
| §6 | Home page | 2.2 🔶, **2.5 (picker + popular calculators)** |
| §7 | Blog & admin | 6.1–6.4 |
| §8 | Engine accuracy/config | 1.x ✅ + **1.9 (config), 1.10 (Sade Sati/divisionals)** |
| §9 | Design/icons | 2.1 ✅, **2.6 (zodiac+planet icons)**; palette = owner-provided |
| §10 | Architecture/data | 0.x ✅, contracts in this file |
| §11–13 | SEO/Perf/A11y | 7.1, 8.2, 2.4 ✅ |
| §14 | Security | 7.2 (Turnstile+rate-limit on all forms) |
| §15 | Privacy/legal | 7.3, 2.3 (consent stub) |
| §16 | Analytics/monitor/email | 7.4 (+WhatsApp click-to-chat) |
| §17–18 | QA/method | 8.x, CHANGELOG/placeholders ✅ |
| §19–20 | DoD/open questions | gates at end |
| — | **D12 API-first data plane (owner directive)** | **Epic 9 (NEW)** |

---

## Epic 0 — Foundations & Orchestrator — ✅ 5/5
0.1 Meta orchestrator registers ✅ · 0.2 Backend re-arch ✅ · 0.3 Astro migration ✅ ·
0.4 Supabase dev project + schema V1 + RLS + seed ✅ · 0.5 Env & secrets ✅
*(CI pipeline live 2026-11-19; repo + worker secrets set.)*
- **0.5b 🔶 polish:** secret-scan pre-commit hook (gitleaks) in all 3 repos.

## Epic 1 — Calculation Engine — ✅ 6/6 + 4 NEW
1.1 Astronomy layer ✅ · 1.2 Panchang limbs ✅ · 1.3 Kundli core ✅ · 1.4 Muhurat rules ✅ ·
1.5 Calculator primitives ✅ · 1.6 Engine README/accuracy notes ✅

- **1.7 ✅ Choghadiya + Hora + Hindu month (PRD §5.3/§5.4 — WAS MISSING):** engine adds
  day+night Choghadiya tables (Chaldean lord cycles, drikpanchang-verified vs live
  Delhi table + 14-weekday regression grid), planetary Hora list, Hindu month
  (Amanta **and** Purnimanta, adhika flag) + paksha + Vikram/Shaka Samvat; all
  surfaced in Panchang API. **Live 2026-11-19** (deploy 805babc; Kartika • Shukla •
  Vikram 2083 • Shaka 1948 matches the design sample).
- **1.8 ✅ Ashtakoota matching engine (PRD §5.5 — WAS MISSING):** 36-guna milan across
  8 kootas (classical maxima 1..8) with per-koota detail strings; Manglik from Lagna,
  Moon **and Venus** with own-sign/exaltation cancellation; half-sign vashya; yoni
  animals + 7 enemy pairs; bhakoot mutual-friend cancellation. `verified:false` (P11).
  **Live 2026-11-19** (backend 3f177ac; self-match 28/36 identity tested; 123→150 tests).
- **1.9 ✅ Engine configurability (PRD §8 — WAS MISSING):** `engine/config.ts`
  (ayanamsha/month_system/house_system/chart_style, allowed-value tables, DB resolver
  with db|default|invalid source map); migration 0005 seeds `public.engine_*` site
  settings (applied once via MCP); GET **/api/v1/settings** serves config + gemstones/
  contact/WhatsApp; POST /kundli accepts strict-validated options and echoes
  engine_config; panchang `hindu_month.primary` follows the configured month system.
  (backend f9fc742)
- **1.10 ✅ Sade Sati + extra divisionals (PRD §5.5/§5.7 — WAS MISSING):** `transits.ts`
  Sade Sati window (first trio entry → final exit; retro dips ignored via 200-day rule;
  EXTERNAL ANCHOR: Aquarius-moon window 2020-01-24→2028-02-23 matches published
  ingresses) + phases 1/2/3; `divisionals.ts` Parashari D3/D7/D9/D10/D12 (D9
  sync-tested vs navamshaSignIndex); kundli POST carries `divisionals` + `sade_sati`.
  ENGINE_VERSION 1.3.0-alpha1. (backend 02e6530)

## Epic 2 — Public Site Shell & Home — ✅ 4/4 + 2 NEW
2.1 Header/footer/nav/themes ✅ · 2.2 Home ✅ *(D11 rebuild 🔶→✅, see 2.7)* · 2.3 Legal+404 ✅ · 2.4 a11y+i18n ✅

- **2.7 ✅ D11 design-mockup rebuild (owner directive, supersedes Sandalwood & Teal):**
  home + all chrome rebuilt pixel-exact to the attached mockup (frontend local
  commit e303b6c; NOT deployed — D8 gate). Tailwind v4 utilities-only + @theme
  design tokens; chrome-reset scoping; dual theme (class + attribute); live islands
  for panchang/horoscope/kundli/newsletter; honest booking modal. Verified in
  browser light+dark incl. live-API E2E kundli generation.
- **2.5 ✅ Home sections (PRD §6 — WAS MISSING):** home 12-sign picker cards link to
  /horoscope/{sign}/daily (frontend local 9d20739); popular-calculators strip hrefs
  live via content_blocks (DB updated via MCP → real tool pages); horoscope picker +
  calculator strip fully wired to the D11 design.
- **2.6 🔶 Zodiac + planet icon set (PRD §9):** design mandates **Material Symbols**
  (variable font) — adopted per D11 as the icon system (nav, cards, FAQ, forms);
  custom SVG zodiac set not required while D11 governs. ONE swappable font link.
- **2.3b ✅ polish:** consent-banner stub in Base (honest "no analytics yet" notice,
  localStorage-acknowledged; swap point for the real CMP in 7.2).

## Epic 3 — Panchang & Muhurat surfaces — ✅ 4/4 + refinements
3.1 Panchang API ✅ · 3.2 City pages ✅ · 3.3 Muhurat API ✅ · 3.4 Muhurat page ✅

- **3.1b ✅ polish (backend 15e571d, pushed):** write-through `panchang_cache` on
  city-mode reads (hit/miss meta, deterministic payloads) + daily 00:15 UTC Workers Cron
  warm (all cities, chunked) + 7-day prune. Cache-API edge caching of GET responses still ⬜ (optional).
- **3.2b ✅ polish (PRD §5.3):** GET **/api/v1/festivals?date=** (backend 6ccd7ce, live);
  city panchang pages get Today/Tomorrow **quick buttons**, **festivals/vrats block**
  for the selected day, and Hindu month (primary per 1.9) + Samvat cells. Monthly
  calendar view still ⬜ (button stub in place).
- **3.4b ✅:** auspicious + inauspicious **Choghadiya slots** join muhurat/today lists
  (backend 34da3c5, live-verified: Shubh/Char/Labh/Amrit slots render on the page).

## Epic 4 — Kundli & Calculators — ✅ 6/6 (+2 NEW stories below)
4.1 Kundli API ✅ (**generate + POST /kundli/match via 1.8 + divisionals/Sade Sati/
manglik/kaal-sarp in the response; calculator endpoints landed with 4.4**) ·
4.2 Free Kundli UI ✅ · 4.3 Matching UI ✅ · 4.4 Calculator pages ✅

- **4.5 ✅ Learn section (PRD §5.5 — WAS MISSING):** Astro content collection
  (src/content.config.ts) + **7 original articles** under /astrology/learn/ (12 rashis,
  Navagraha, 27 nakshatras, 12 houses, panchang limbs+yogas, doshas, Vimshottari
  dasha) with article renderer + /astrology hub replacing the TabStub. Frontend local
  9d20739.
- **4.6 ✅ Tier 2 calculators (PRD §5.7 "build next" — WAS MISSING):** engine/tools.ts
  (Jaimini karakas, Ishta Devata base — deity table deferred to P11, Kaal Sarp with
  12 Rahu-house types, Lo Shu grid, FLAMES/love/friendship/name-compat for_fun,
  vehicle numbers, mobile/name numerology, age) + GET /api/v1/calculators/{…} ×16
  (backend 9ad9db8) + 17 shared-template pages (BirthForm + generic renderer).
- **4.2b 🔶:** city **autocomplete** ✅ (datalist over /cities — Epic 9.4); short
  interpretations block ⬜ (needs an admin-authored content source — lands with 6.4).

## Epic 5 — Horoscope, Consultations, Poojan, Gemstones — ✅ 5/5
5.1 Horoscope ✅ (**GET /horoscope LIVE + /horoscope/ hub + 72 static
/horoscope/{sign}/{period} pages with runtime API text** — frontend local 9d20739) ·
5.2 Astrologer directory+booking ✅ (GET /astrologers +/{slug} + POST
/requests/consultation — backend d3d25a4 live; /consultations directory + BookingForm;
individual profile [slug] pages ⬜ small follow-up; Turnstile + admin notify = 7.2/6.4;
offers-config via site_settings ⬜) · 5.3 Poojan catalogue+booking ✅ (GET /pujas
(+/{slug}, ?category=) + POST /requests/puja live; /poojan catalogue + BookingForm) ·
5.4 Gemstones ✅ (wired to GET /settings — links out to the store the moment
`public.gemstones_site_url` is set)

- **5.5 ✅ Newsletter + notify endpoints (PRD §6/§5.8):** POST /newsletter **LIVE**
  (validation + source whitelist + 5/10-min throttle → 429; upsert
  `newsletter_subscribers` merge-duplicates; happy-path + validation verified
  against the deployed worker 2026-11-19). Turnstile/WAF hardening = 7.2.
  Admin export in 6.4.

## Epic 6 — Blog & Admin — ✅ 4/4 (backend pushed; frontend committed LOCALLY — owner review pending)
6.1 ✅ Admin auth (backend 84a3e63, CI-green+live: `admin_users` 0006 service-role-only,
requireAdmin fail-closed 401/403/503, token validated via Supabase /auth/v1/user, aal
claim MFA-ready, GET /admin/me probe; **owner action pending: run
`bun scripts/setup-first-admin.ts --email …`**) ·
6.2 ✅ Post CRUD (backend 23099dc, CI-green+live: draft/publish/archived state machine,
scheduled = draft + future publish_at + lazy sweep, soft delete, auto-slug w/ Devanagari
fallback, auto reading time, SEO validation, tags/categories/media endpoints; Supabase
Storage `media` bucket created; migration 0007 category link; md sanitiser = render-time
in 6.3 per D13) ·
6.3 ✅ Public blog (backend f296f0a pushed + frontend local: listing/pagination
/blog/page/N, category+tag pages, client search island over /blog/posts?q=, article +
sticky TOC from sanitised headings, related, share row + copy-link, "Team Vyotish"
author box, /blog/rss.xml, /sitemap.xml 156 URLs; **migration 0008_blog_seed applied** —
2 original starter articles live; rehype-sanitize GitHub-schema pipeline with id-safe
headings) ·
6.4 ✅ Admin modules + admin UI (backend 277a86c pushed: POST /auth/login + /auth/refresh
proxy per D4 — browser never sees Supabase keys; astrologers/pujas CRUD w/ category+mode
enums, horoscope content CRUD (5 sections, 4000-char caps, publish_at stamping), requests
inbox status workflow (new/contacted/scheduled/closed), contact messages (new/read/closed),
newsletter CSV export, settings key/value upsert; frontend local: /admin/ shell (noindex),
login, dashboard counts, posts list/editor (all SEO+schedule fields), taxonomy, media
upload+copy, horoscopes dialog editor, catalog tabs, inbox tabs, settings+export — 9
pages, all routes 200, astro check clean)

## Epic 7 — SEO, Security, Legal, Analytics — 🔶 2/4 (backend 15e571d + frontend local)
7.1 SEO pass (unique metas, canonical, hreflang, JSON-LD Org/WebSite/Breadcrumb/
Article/FAQ/Person, **sitemap.xml + robots.txt**, OG images, internal linking) 🔶 —
✅ canonical+OG+twitter on every page (Base.astro), JSON-LD: Organization+WebSite+FAQPage
(home), Article+BreadcrumbList (blog posts), sitemap.xml 156 URLs, robots.txt (allow all,
/admin/ disallowed, sitemap link), RSS link
alternate; ⬜ hreflang audit on remaining pages, Person JSON-LD ·
7.2 Security pass (CSP/HSTS/headers, **rate limiting everywhere, Turnstile on all
forms/login/calculators**, input-validation audit, dependency audit, secret scan) 🔶 —
✅ API-wide security headers middleware + best-effort fixed-window rate limiter on
login/newsletter/booking POSTs (429s, backend ba57577); ⬜ CSP, volumetric WAF/
Turnstile (needs owner keys), dependency audit, secret scan ·
7.3 Legal content final drafts + DPDP statements + grievance contact ⬜ (pages exist;
drafts need owner review) · 7.4
Analytics (CF Web Analytics + events: kundli_generated, calculator_used,
booking_request_sent, blog_read) + error monitoring + transactional email design +
**WhatsApp click-to-chat** 🔶 — ✅ consent-gated GA4 loader (waits for explicit Accept +
`ga_measurement_id` site setting — nothing loads before that, banner upgrades honestly),
WhatsApp click-to-chat float driven by `contact_whatsapp` site setting (runtime settings
fetch, D12); ⬜ event instrumentation, CF Web Analytics, error monitoring, email design

## Epic 8 — QA, Performance & Owner Review Gate — 🔶 1/4
8.1 Test suites green + edge cases ✅ (backend 241/241 across 26 files: engine,
routes, admin auth/CRUD/modules, blog public reads, panchang cache, headers, rate
limiter; frontend astro check + biome clean; full local sweep 166/166 routes HTTP 200
w/ content checks) ·
8.2 Lighthouse ≥90 + budgets ⬜ (needs a real Chrome audit — owner review gate) · 8.3 Device
matrix (owner participates) ⬜ · 8.4 **Owner review gate** + launch-blocker list ⬜

## Epic 9 — API-First Data Plane (D12 owner directive, 2026-11-19) — ✅ 4/4
**Goal:** every computation in the backend, every page datum in Supabase (RLS), the
frontend a thin renderer over `/api/v1/*`. Unblocks 2.5 and feeds 5.2/5.3/6.4 later
(same tables, admin-managed).

- **9.1 ✅ Content tables + seeds (migration 0004, applied once via MCP):**
  astrologers/pujas extended additively (title/availability/is_available/sort_order/
  accent/includes), `faq_items` + `content_blocks` created with public-read RLS
  (status='published'), D11-verbatim seeds (3 astrologers, 3 pujas, 3 home FAQs,
  5 content blocks) marked `is_sample=true`; generic V1 placeholder rows soft-retired.
- **9.2 ✅ Read endpoints (backend 494aeff, live-verified):** GET `/api/v1/cities`
  (lang/country filters, 503 w/o creds) + GET `/api/v1/content/home` (single bundle:
  astrologers, poojas incl. includes jsonb, faqs, content_blocks → blocks map;
  honest is_sample flags). Route tests: mapping/503/validation/500 (113 pass).
- **9.3 ✅ Server-side limb picking (engine 1.2.0-alpha1):** panchang returns
  `active{as_of, tithi, nakshatra, yoga, karana}` with `window`/`next` per limb
  (pickActiveLimb + deterministic fallbacks; `nowOverride` for tests); unit tests
  for boundaries/fallbacks; live-verified on new-delhi.
- **9.4 ✅ Frontend thin-client rewiring (local commit 25bb1b4):** home arrays +
  hero badges + gemstones kicker/title now BUILD-time fetches of /content/home
  (fail-soft honest empty notes); city selects + kundli datalist RUNTIME fetches of
  /cities; panchang getStaticPaths generated from /cities (30 pages);
  src/data/cities.ts deleted; rashiphal lines removed from HomeHoroscope (text =
  API-only data); server-picked `active` limbs rendered client-side. Browser pass:
  all sections render identically to the D11 mockup from live APIs.

---

## Gap log (BMAD review v2 — found missing, now placed)

| # | PRD requirement | Was | Now |
|---|---|---|---|
| G1 | Choghadiya day+night (§5.3) | absent | **1.7** |
| G2 | Hora list (§5.3) | absent | **1.7** |
| G3 | Hindu month + paksha + Samvat year (§5.3) | absent | **1.7** |
| G4 | Amanta/Purnimanta support (§5.3/§8) | absent | **1.7/1.9** |
| G5 | Ashtakoota 36 engine (§5.5) | absent (UI story existed, engine didn't) | **1.8** |
| G6 | Configurable ayanamsha/house/month/chart (§8) | absent | **1.9** |
| G7 | Sade Sati (§5.5/§5.7) | "arriving" note only | **1.10** |
| G8 | Other divisional charts (§5.5) | D9 only | **1.10** |
| G9 | Learn articles (§5.5) | absent | **4.5** |
| G10 | Tier 2 calculators (§5.7) | absent | **4.6** |
| G11 | Home 12-sign picker + popular calculators (§6) | absent | **2.5** |
| G12 | Zodiac/planet icon set (§9) | absent (emoji) | **2.6** |
| G13 | Today/Tomorrow quick buttons + festivals-for-day (§5.3) | absent | **3.2b** |
| G14 | Choghadiya in muhurat today (§5.4); WhatsApp chat (§16); newsletter endpoint; offers-config; consent stub; gemstones setting-wiring | scattered/absent | **3.4b / 7.4 / 5.5 / 5.2 / 2.3b / 5.4** |

## Story totals
E0 5✅ + 1 polish · E1 10✅(incl 1.7–1.10) · E2 6✅(incl 2.7, 2.5, 2.3b) + 1🔶(2.6) ·
E3 4✅ + 3.2b/3.4b/3.1b ✅ · E4 6✅(+4.5/4.6) + 4.2b 🔶 · E5 5✅ ·
E6 4✅ · E7 2🔶(7.1/7.2/7.4 partial) · E8 1✅(8.1) · E9 4✅ (D12)
**= 50 tracked stories: ~47 done · partials: 2.5 (2.6/4.2b refinements + 5.2 profile
pages), 7.1/7.2/7.4 (robots.txt, CSP/rate-limit/Turnstile, event instrumentation —
some need owner keys), 8.2–8.4 (owner gates: Lighthouse audit, device matrix, review
gate) · remaining owner action: setup-first-admin + frontend review/push decision**

## Dependencies
1.7→3.2b/3.4b ✅ · 1.8→4.1(match)/4.3 ✅ · 1.10→4.2 ✅ · 2.5→5.1 + E9.2 ✅ ·
E1 done earlier unlocked E3/E4 ✅ · E6.3 needs 6.2 · E7/E8 last ·
E9.4 needs E9.1–9.3 ✅ · E5/E6 can parallelise after E4 ✅.

## Polish / debt register (tracked, not owner-blocking)
3.1b cache+cron ✅ (edge-cache optional) · 3.2b monthly calendar view ⬜ · 4.2b interpretations ⬜ ·
5.2 profile [slug] pages + offers-config ⬜ · 0.5b secret-scan hook ⬜ ·
P3 self-hosted fonts · P20 Lighthouse · P19 Docker build test · token rotation.

## Pre-launch gates (owner-visible)
Jyotishi review of muhurat rules (P11) · Jyotishi/owner engine sign-off (P16/D5) ·
sample-data removal or marking (P8/P9/P10/P17) · legal review (P7) · **D8 frontend
deploy approval**.

## Working rules (unchanged)
Frontend/backend/database workstream split · API & data contracts v1 · commit in the
owning repo · BMAD-style review before every commit · QA-mindset tests · fix where
the fix belongs · backend deploys first (additive before breaking) · Bun only.
