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
| §9 | Design/icons | 2.1 ✅, **2.6 ✅ (Material Symbols per D11)**; palette = owner-provided |
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
- **0.5b ✅ polish (2026-11-20):** secret-scan pre-commit hook in all 3 repos — gitleaks
  unavailable on the box → portable Bun scanner `scripts/secret-scan.ts` (meta 4a989fa):
  9 high-confidence patterns (PEM / AKIA / AIza / gh_ / github_pat_ / xox / sk_live /
  sb_secret_ / credential-assignment), `secret-scan:allow` line marker for documented
  exceptions, `--all` full-tree sweep mode. Hooks at `.git/hooks/pre-commit` +
  `.git/modules/{backend,frontend}/hooks/pre-commit` (absolute bun path). Tested live:
  fake AKIA blocked (meta), fake ghp_ blocked (backend submodule branch), allow-marker
  passes, clean passes, `--all` sweeps clean ×3. Upgrade path: swap hook bodies for
  gitleaks, keep the exit contract (0 clean / 1 leak).

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
- **2.6 ✅ Zodiac + planet icon set (PRD §9):** design mandates **Material Symbols**
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
  for the selected day, and Hindu month (primary per 1.9) + Samvat cells. **Monthly
  calendar view ✅ (2026-11-20, 3.2b completion): ?view=calendar&month=YYYY-MM on every
  city page — 7-column grid with per-day tithi+nakshatra (city-mode reads → cache),
  prev/next month nav, today highlight, deep-linkable; day sections hide in calendar
  mode and restore via pd:show-day event.**
- **3.4b ✅:** auspicious + inauspicious **Choghadiya slots** join muhurat/today lists
  (backend 34da3c5, live-verified: Shubh/Char/Labh/Amrit slots render on the page).

## Epic 4 — Kundli & Calculators — ✅ 6/6 (+2 NEW stories below)

- **4.8 ✅ Owner-requested calculators (S13, 2026-11-21):** Moon Phase / Sun Sign
  (Surya Rashi) / Destiny Number (Bhagyank) — owner asked for "moon phase,
  sun shine, destiny number"; research (3 web agents vs prokerala/astrosage/
  drikpanchang/bhagyank.in/timeanddate/NASA) showed no astrology tool named
  "sunshine calculator" exists → built the standard Sun Sign Calculator with
  BOTH tropical + sidereal output (naming call flagged to owner). Engine:
  moonPhaseDetails (neighbour lunations via SearchMoonPhase ±35d, age,
  illumination, Vedic moon rashi), sunSignDetails (tropical + sidereal +
  Sun nakshatra/pada + lord; RASHI_LORDS now exported from matching.ts),
  destinyNumber (compound sum + master {11,22,33} flag + Rahu/Ketu lords).
  Routes GET /calculators/{moon-phase,sun-sign,destiny-number} with an
  isCalendarDate guard (Bun ISO parser rolls 2025-02-30 → Mar 2 silently).
  Backend 7a7da87, deployed 94225ac0, live-verified vs published instants
  (±2 min) + Sankranti cusps; tests 288 green (BMAD review APPROVED).
  Frontend 8189e22 LOCAL: 3 registry pages + hub rows + sitemap sync +
  shared-template .btn theme-aware fix (was 1.97:1 light-mode fail).
  e2e-s13 14/14 + e2e-contrast no-regression (evidence qa/evidence/
  s13-calculators.json). Backend push stalled (network) — retry tracked.
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
- **4.2b ✅ (2026-11-20):** city **autocomplete** ✅ (datalist → PlaceField, Epic 9.4/4.7);
  short **interpretations block ✅** — admin-authored via the existing `content_blocks`
  table: public GET /api/v1/content/blocks?prefix=kundli. (backend ead7867, pushed+live)
  + admin CRUD /api/v1/admin/content-blocks and the /admin/blocks editor (frontend
  80976ea LOCAL, nav entry added); kundli page renders published kundli.* notes
  fail-soft per block (3 sample notes seeded via MCP, is_sample=true); the dosha
  fine-print now shows API verdicts (1.10 sade_sati/manglik/kaal_sarp) instead of the
  stale client-side checks; planetary table gains a Navamsha (D9) column.
- **4.7 ✅ Birthplace pickers (owner directive, 2026-11-20):** Google Places (New) +
  Time Zone API proxied through the backend (GET /api/v1/places/autocomplete +
  /places/resolve, backend b3b003e — key never reaches the browser; rate-limited
  30/min + 60/min). WITHOUT `GOOGLE_PLACES_API_KEY` both endpoints fall back to the
  Supabase cities table with the same response shape, so pickers work today and
  upgrade to worldwide city,state,country suggestions the moment the owner sets the
  key (wrangler secret put). Frontend: PlaceField.astro + place-picker.ts — every
  place-input form now has ONE "Place of birth" autocomplete instead of raw
  lat/lng/tz: Free Kundli, Matching (boy+girl), all BirthForm calculators, transits,
  and both muhurat city inputs; baked city lists removed from kundli + muhurat (D12).
  Browser-tested end-to-end; submit guards show honest errors until a suggestion is
  picked.
- **4.7b ✅ Worldwide coverage + places store (owner directive, 2026-11-20):** the
  DB itself now carries all places — GeoNames seed (backend dd697ac, CC BY 4.0,
  scripts/seed-cities.ts): cities5000 worldwide + India towns pop≥1000 → **70,718
  cities (7,216 India)** upserted on geonames_id, population-ranked, collision-safe
  slugs (single-owner claims; panchang slugs preserved). Migration 0009: `places`
  store (validated+stored reference data, service-role RLS), pg_trgm GIN on
  name/search_names, country + search_names columns (exonyms: "Calcutta"→Kolkata,
  romanizations, native scripts). /places/resolve returns structured
  {place_id, lat, lng, tz, label, structured{main,admin1,country,country_code}},
  writes through to the store, and answers repeat Google ids cache-first (saves
  quota, works keyless). /cities is a search endpoint (?q=, ?limit≤200) — build
  consumers scoped. Frontend cd63b0f (LOCAL): home kundli+panchang dropdowns →
  PlaceField (datalist broke at 70k rows), panchang index worldwide search field,
  panchang page set India-first (110 IN + 50 world = 160 pages incl Nagpur/Indore),
  place_id hidden input on every form, place:selected now bubbles (fixed stale
  HomePanchang data bug). E2E re-verified on every birthplace surface with small
  towns (Sirohi/Bundi/Sri Ganganagar/Jodhpur). Still pending owner: the Google key
  upgrades suggestions to Google's worldwide dataset — no code change needed.

## Epic 5 — Horoscope, Consultations, Poojan, Gemstones — ✅ 5/5
5.1 Horoscope ✅ (**GET /horoscope LIVE + /horoscope/ hub + 72 static
/horoscope/{sign}/{period} pages with runtime API text** — frontend local 9d20739) ·
5.2 Astrologer directory+booking ✅ (GET /astrologers +/{slug} + POST
/requests/consultation — backend d3d25a4 live; /consultations directory + BookingForm;
**individual profile pages + offers-config ✅ (2026-11-20):** /consultations/{slug} and
/poojan/{slug} static pages (breadcrumb + BreadcrumbList JSON-LD, facts grid, session
types, in sitemap) + OfferStrip on both directories fed by the `public.offers_config`
site setting. **Admin contract (no new UI):** settings UI, key `public.offers_config`,
value = JSON array `[{"text": "…", "href": "/path", "audience": "consultation|puja|all"}]`
(href optional, must start "/"; audience filters placement; max 5 shown; renderer
validates shape fail-soft → empty). Turnstile + admin notify = 7.2/6.4) · 5.3 Poojan catalogue+booking ✅ (GET /pujas
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

## Epic 7 — SEO, Security, Legal, Analytics — 🔶 3/4 (backend ba57577 pushed; frontend local)
7.1 SEO pass (unique metas, canonical, hreflang, JSON-LD Org/WebSite/Breadcrumb/
Article/FAQ/Person, **sitemap.xml + robots.txt**, OG images, internal linking) ✅ —
✅ canonical+OG+twitter on every page (Base.astro), JSON-LD: Organization+WebSite+FAQPage
(home), Article+BreadcrumbList (blog posts), sitemap.xml 156 URLs, robots.txt (allow all,
/admin/ disallowed, sitemap link), RSS link alternate; **hreflang audit ✅ (2026-11-20):
only / ↔ /hi/ keep the pair — 20 pages were emitting hi-alternates to non-existent
/hi/* URLs (cleaned; decision documented in Base.astro); Person JSON-LD N/A per D14
(byline = fixed Organization "Team Vyotish", Article author already @type=Organization) ·
7.2 Security pass (CSP/HSTS/headers, **rate limiting everywhere, Turnstile on all
forms/login/calculators**, input-validation audit, dependency audit, secret scan) 🔶 —
✅ API-wide security headers middleware + best-effort fixed-window rate limiter on
login/newsletter/booking POSTs + /places (429s, backend ba57577); **dependency audit ✅
(2026-11-20, bun audit: backend 0 findings; frontend 49→16 via build-only overrides
ws/undici/sharp — the remaining 16 sit in astro/zod/esbuild/cloudflare-adapter majors,
build/dev-time only, none ship in the static artifact; major upgrades = owner decision)**;
**secret scan ✅ (2026-11-20: all 3 repos — no tracked secret-like files, no key-pattern
literals, backend/.env properly gitignored)**; **+ 0.5b pre-commit secret-scan hooks
installed & tested in all 3 repos (2026-11-20 — see Epic 0)**; ⬜ CSP (needs a production deploy loop to
verify → D8 owner gate), volumetric WAF/Turnstile (owner keys) ·
7.3 Legal content final drafts + DPDP statements + grievance contact 🔶 —
**agent drafts landed 2026-11-21 (owner legal review = the gate)**: all 5 pages
(privacy/terms/refund/disclaimer/about) rewritten as sectioned documents via upgraded
LegalPage.astro (id-anchored h2 sections, "On this page" TOC, bullets, Last-updated
line); grounded in DPDP Act 2023 (ss. 5-14 rights/consent/notice), DPDP Rules 2025
(Rule 3 notice, Rule 6 safeguards, Rule 7 breach ≤72h, Rule 14 grievance ≤90d —
we commit 30d), E-Commerce Rules 2020 (Rule 4(4)/(5) grievance officer 48h-ack/1-month,
Rule 4(2) entity details → owner gate), industry refund norms (consultations ≥24h full
refund, poojas 48h windows, 5-7 business days to original method) and no-cure/no-
guarantee/no-fabrication policy language; data items mirror the actual schema
(tool inputs not stored — requests.ts is the only personal-data insert path).
**Trust-copy accuracy sweep in the same change**: "Swiss Ephemeris" claims corrected
to astronomy-engine (MIT) + Lahiri + IANA everywhere — Footer.astro (also removed
unverified "vetted scholar" wording per ux-audit pattern), UtilityBar.astro,
HomeKundli.astro, index.astro meta description, and seeded home DB rows (backend
migration 0010, applied to Supabase owgszyhxvyomxyxhoeed; rows stay is_sample=true).
Footer About label → "About Vyotish". astro check 0 errors; 5/5 routes 200 with
content verified; playwright screenshots light+mobile clean. **Owner items remain:
legal review + entity legal name/address (ECR Rule 4(2)) + grievance officer name
(launch-blockers #3)** · 7.4
Analytics (CF Web Analytics + events: kundli_generated, calculator_used,
booking_request_sent, blog_read) + error monitoring + transactional email design +
**WhatsApp click-to-chat** 🔶 — ✅ consent-gated GA4 loader (waits for explicit Accept +
`ga_measurement_id` site setting — nothing loads before that, banner upgrades honestly),
WhatsApp click-to-chat float driven by `contact_whatsapp` site setting (runtime settings
fetch, D12); **event instrumentation ✅ (2026-11-20): window.vyTrack fires
kundli_generated / calculator_used (all tools + match) / booking_request_sent /
blog_read — no-ops unless GA4 is actually loaded, so consent holds by construction**;
⬜ CF Web Analytics, error monitoring, email design (owner accounts)

## Epic 8 — QA, Performance & Owner Review Gate — 🔶 1/4
8.1 Test suites green + edge cases ✅ (backend 241/241 → **250/250 across 27 files**
after /places: engine, routes, admin auth/CRUD/modules, blog public reads, panchang
cache, headers, rate limiter, places proxy; frontend astro check 0 errors + biome clean;
full local sweep 166/166 routes HTTP 200) · **8.1b E2E page-by-page pass ✅ (2026-11-20,
owner directive): all interactive flows browser-tested — kundli (picker→chart),
matching (2 pickers→36 gunas), rashi+transits calculators, muhurat today/finder,
panchang day+monthly calendar (prev/next/deep-link), blog article/TOC/search, admin
login→dashboard; 166/166 sweep re-run green. Bugs found & fixed: UTC-date default
showed yesterday's panchang before 05:30 IST (PanchangDetail/TodayAtAGlance/
HomePanchang → local date), footer Popular-Tools links wrong/flat, transits tool still
asked raw lat/lng. Known nit: sade_sati.next window jitter ±ms (iterative transit
search) — astronomically irrelevant, UI shows dates only.** ·
8.2 Lighthouse ≥90 + budgets 🔶 (**local baseline done 2026-11-20** — Chrome was on the box:
a11y 90–95 + bp 100 everywhere; perf 98–100 on home/kundli/consultations, 82–88 on
panchang/blog from font-swap CLS 0.25–0.36 (→ story S12), seo 92 (crawlable header anchor →
S11); reports + findings in [lighthouse-2026-11-20/](lighthouse-2026-11-20/RESULTS.md);
**production re-run after D8 deploy = owner gate**) · 8.3 Device
matrix (owner participates; S5 checklist) ⬜ · 8.4 **Owner review gate** — launch-blocker
list ✅ written: [launch-blockers.md](launch-blockers.md) (15 rows, 14 open owner actions,
offers_config row closed) ·

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

## Epic 14 — Calculators overhaul (owner directive 2026-11-21) — ✅ 4/4

Owner: *"cross check and fix outputs of all the calculators … not getting all the
details … alignment is not correct … check inputs … no scope of error."* Full BMAD
pipeline ran (Mary → Quinn → Sally → Bob → Amelia → Quinn); papers in
`_bmad-output/calculators/` (23 research files, 58 findings → 17 proven bugs, output
spec + Stitch screens, 4 stories, closeout SUMMARY.md).

- **14.1a ✅ Backend engine (ab93aa0, pushed + deployed + 27/27 live):** UTC solver
  (evening births), sidereal mean nodes, raw manglik flags beside cancellations,
  sade-sati first-entry windows + dhaiya + phase_windows, cumulative antardashas,
  kaal-sarp planet table, karakas scheme, honest plates. ENGINE_VERSION 1.4.0-alpha1.
- **14.1b ✅ Backend routes + interpretations (+ d362808):** nakshatra / lagna /
  vimshottari-dasha / mangal-dosha routes; vehicle-plate rewrite; name-numerology
  owner_compatibility; interpretation layer. 313 tests green (story estimated ≥320 —
  honest deviation).
- **14.2 ✅ Frontend renderer + pages (a5ccbae + b333ed8 + 3cf3301, pushed = D8
  deploy):** shared block renderer (verdict card / chips / meaning / detail cards /
  Lo Shu 3×3 / dasha timeline / honesty flaglines + "More details" fallback); all 23
  pages rebuilt with is:global token styles (root cause of the alignment complaint);
  3 new pages; registry fixes (dedicated MD/KS routes, names a/b, plate, gender,
  owner date, as-of); hub + sitemap. Push deployed all 36 pending local commits.
- **14.3 ✅ Verify + docs (meta 8ecab96):** 26/26 regressions vs deployed backend AND
  live vyotish.com; 14/14 S13 + 11/11 S14 e2e; axe AA 8/8 light+dark; 92/92 shots;
  CHANGELOG + SUMMARY.md + memory. Deferred: gochara overlay, P11 Jyotishi sign-off.

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
E0 5✅ + 0.5b ✅ · E1 10✅(incl 1.7–1.10) · E2 2.1–2.7 all ✅ (incl 2.5/2.3b/2.6) ·
E3 4✅ + 3.2b/3.4b/3.1b ✅ · E4 4.1–4.7b all ✅ (incl 4.2b interpretations) ·
E5 5✅ (5.2 profile [slug] + offers-config ✅) ·
E6 4✅ · E7 7.1✅ (7.2/7.4 owner-keys remain) · E8 1✅(8.1+8.1b) · E9 4✅ (D12) ·
E14 4✅ (calculators overhaul, 2026-11-21 — backend AND frontend pushed & live) ·
E-ZC 4✅ (Zodiac Sign Compatibility — Mary research 144 pairs → owner gate G1
[6 scored categories + Tips, honest 35–95, hub + 78 canonical pages] → Paige 78/78
original records, all gates green [schema/aspect-geometry/banned-words/§10 sign-binding/
originality 6-gram vs Astrotalk corpus] → Sally Stitch design spec → backend engine
+ /api/v1/compatibility/signs(+/pair) + content, tests 288→336 green → frontend hub
+ 78 pair pages + astrology card + sitemap, S16/S15 fields reused → Sally reconcile
[verdict-card pattern, band accents, disabled-until-both, cross-link band] →
qa/e2e-zc-compatibility.mjs 23/23 + axe strict light+dark clean + aria/contrast suites
ALL PASS; footer col-heads h4→h2 site-wide [axe heading-order], CTA ink --ink-on-gold→
--color-on-primary on --gold fills — 2026-11-22, LOCAL ONLY, owner push-consent G2 pending)
**= 59 tracked stories: all code-side work done; both repos pushed (2026-11-21, E-ZC local) ·
remaining items are owner-gated only: 7.2 CSP/WAF/Turnstile (owner keys + production
deploy loop), 7.3 legal drafts (owner review), 7.4 CF-analytics/error-monitoring/email
(owner accounts), 8.2 Lighthouse / 8.3 device matrix / 8.4 launch review (owner gates) ·
owner actions: GOOGLE_PLACES_API_KEY (optional, upgrades pickers worldwide), admin
sign-in password check (vyotish@gmail.com admin row exists since 2026-11-19 — see
launch-blockers.md #2) · note: frontend push 3cf3301 (2026-11-21) deployed the
previously pending local commits — D8 gate consumed by Epic 14 owner delegation**

Remaining items each carry an enriched BMAD story in
[stories-remaining.md](stories-remaining.md) (story-first hard rule, owner 2026-11-20:
story written + reviewed before implementation — **S1 P3 fonts ✅ frontend 285d710
LOCAL · S4 8.2 local Lighthouse baseline ✅ · S6 launch-blocker list ✅
launch-blockers.md**; S11 a11y/SEO quick fixes + S12 CLS mitigation READY next;
rest owner-gated/blocked/parked as marked).

## Dependencies
1.7→3.2b/3.4b ✅ · 1.8→4.1(match)/4.3 ✅ · 1.10→4.2 ✅ · 2.5→5.1 + E9.2 ✅ ·
E1 done earlier unlocked E3/E4 ✅ · E6.3 needs 6.2 · E7/E8 last ·
E9.4 needs E9.1–9.3 ✅ · E5/E6 can parallelise after E4 ✅.

## Polish / debt register (tracked, not owner-blocking)
3.1b cache+cron ✅ (edge-cache optional) · 3.2b monthly calendar view ✅ · 4.2b interpretations ✅ ·
5.2 profile [slug] pages + offers-config ✅ · 0.5b secret-scan hook ✅ (installed+tested in all 3 repos; sweeps clean 2026-11-20) ·
kundli sade_sati.next boundary jitter ±ms (iterative transit search; UI shows dates only) ·
BirthForm PlaceField grid alignment ✅ (full-row wrapper, 2026-11-20) ·
P3 self-hosted fonts ✅ (frontend 285d710 LOCAL: 22 woff2 in /fonts + fonts.css, zero
third-party font requests, licenses shipped, icon helper class restored — Story S1) ·
P20 Lighthouse 🔶 (= 8.2 local baseline done, see lighthouse-2026-11-20/) ·
P19 Docker build test (⬜ not runnable on this box — no docker installed) · token rotation.

## Pre-launch gates (owner-visible)
Jyotishi review of muhurat rules (P11) · Jyotishi/owner engine sign-off (P16/D5) ·
sample-data removal or marking (P8/P9/P10/P17) · legal review (P7) · **D8 frontend
deploy approval**.

## Working rules (unchanged)
Frontend/backend/database workstream split · API & data contracts v1 · commit in the
owning repo · BMAD-style review before every commit · QA-mindset tests · fix where
the fix belongs · backend deploys first (additive before breaking) · Bun only.
