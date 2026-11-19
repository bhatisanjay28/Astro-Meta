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
- **1.8 ⬜ Ashtakoota matching engine (PRD §5.5 — WAS MISSING):** 36-guna milan across
  8 kootas with per-koota points + explanation strings; Manglik check from Lagna, Moon
  **and Venus** (classical); powers 4.1 API + 4.3 UI.
- **1.9 ⬜ Engine configurability (PRD §8 — WAS MISSING):** settings for ayanamsha
  (Lahiri default), month system (Amanta/Purnimanta), house system, chart style; read
  from site_settings, threaded through engine options.
- **1.10 ⬜ Sade Sati + extra divisionals (PRD §5.5/§5.7 — WAS MISSING):** Saturn
  transit tables → Sade Sati status (current/upcoming + phase); divisional charts D3,
  D7, D10, D12 selectable alongside D9.

## Epic 2 — Public Site Shell & Home — ✅ 4/4 + 2 NEW
2.1 Header/footer/nav/themes ✅ · 2.2 Home ✅ *(D11 rebuild 🔶→✅, see 2.7)* · 2.3 Legal+404 ✅ · 2.4 a11y+i18n ✅

- **2.7 ✅ D11 design-mockup rebuild (owner directive, supersedes Sandalwood & Teal):**
  home + all chrome rebuilt pixel-exact to the attached mockup (frontend local
  commit e303b6c; NOT deployed — D8 gate). Tailwind v4 utilities-only + @theme
  design tokens; chrome-reset scoping; dual theme (class + attribute); live islands
  for panchang/horoscope/kundli/newsletter; honest booking modal. Verified in
  browser light+dark incl. live-API E2E kundli generation.
- **2.5 ⬜ Home sections (PRD §6 — WAS MISSING):** daily-horoscope **12-sign picker**
  (grid linking to /horoscope/[sign]/daily) + **popular calculators** strip; replace
  the four "coming next" cards with real sample-marked sections once E5/E6 data lands.
  *(Content now served from Supabase via Epic 9.)*
- **2.6 🔶 Zodiac + planet icon set (PRD §9):** design mandates **Material Symbols**
  (variable font) — adopted per D11 as the icon system (nav, cards, FAQ, forms);
  custom SVG zodiac set not required while D11 governs. ONE swappable font link.
- **2.3b 🔶 polish:** consent-banner stub (cookie/analytics) on all pages.

## Epic 3 — Panchang & Muhurat surfaces — ✅ 4/4 + refinements
3.1 Panchang API ✅ · 3.2 City pages ✅ · 3.3 Muhurat API ✅ · 3.4 Muhurat page ✅

- **3.1b ⬜ polish:** write-through `panchang_cache` on city-mode reads + daily cron
  refresh (Workers Cron Trigger) + Cache API edge caching of GET responses.
- **3.2b ⬜ polish (PRD §5.3):** Today/Tomorrow **quick buttons**; **festivals/vrats for
  the day** (from `festivals` table) on city pages; monthly calendar view; display
  Hindu month + Samvat (needs 1.7).
- **3.4b 🔶:** add Choghadiya to today's auspicious list (needs 1.7).

## Epic 4 — Kundli & Calculators — 🔄 1.5/6 (2 NEW stories added)
4.1 Kundli API — 🔶 generate ✅; **matching endpoint (uses 1.8) ⬜; calculator
endpoints ⬜ (folded into 4.4)** · 4.2 Free Kundli UI ✅ *(city autocomplete + short
interpretations pending)* · 4.3 Matching UI ⬜ · 4.4 Calculator pages ⬜

- **4.5 ⬜ Learn section (PRD §5.5 — WAS MISSING):** original articles — 12 signs,
  Navagraha, 27 nakshatras, houses, yogas, doshas, Dasha — as Astro content
  collection under /astrology/learn/, EN first, linked from Astrology tab + calculators.
- **4.6 ⬜ Tier 2 calculators (PRD §5.7 "build next" — WAS MISSING):** name
  compatibility, love, friendship, FLAMES (labelled *for fun*), Lo Shu Grid, Ishta
  Devata, Atmakaraka/Darakaraka, transit chart, lucky vehicle number, mobile-number
  numerology, lucky-name numerology, age — same shared template.
- **4.2b 🔶:** city **autocomplete** (typed input over the cities dataset) replacing
  preset dropdown; short interpretations block on the kundli result.

## Epic 5 — Horoscope, Consultations, Poojan, Gemstones — 🔄 2.5/5 (1 NEW)
5.1 Horoscope API 🔶 (**GET /horoscope + rolling sample seeds LIVE** 805babc; per-sign
daily pages ⬜) · 5.2 Astrologer directory+profile+booking ⬜ (Turnstile +
rate limit + admin notify; **offers configurable via site_settings — PRD §5.1**) ·
5.3 Poojan catalogue+booking ⬜ · 5.4 Gemstones 🔶 (page ✅; wire the
`public.gemstones_site_url` setting → tab links out when set)

- **5.5 🔶 Newsletter + notify endpoints (PRD §6/§5.8):** POST /newsletter **LIVE**
  (validation + source whitelist + 5/10-min throttle → 429; upsert
  `newsletter_subscribers` merge-duplicates; happy-path + validation verified
  against the deployed worker 2026-11-19). Turnstile/WAF hardening = 7.2.
  Admin export in 6.4.

## Epic 6 — Blog & Admin — ⬜ 0/4
6.1 Admin auth (Supabase Auth, roles, first-admin setup script, MFA-ready) ⬜ ·
6.2 Post CRUD (draft/publish/schedule/preview, Markdown+sanitiser, media upload,
SEO fields, soft delete) ⬜ · 6.3 Public blog (listing/pagination, category+tag
pages, search, article+TOC, related, share, author box, **RSS**, sitemap) ⬜ ·
6.4 Admin modules (horoscope content, astrologers, poojas, requests inbox, contact
messages, newsletter export, site settings incl. GEMSTONES_SITE_URL) ⬜

## Epic 7 — SEO, Security, Legal, Analytics — ⬜ 0/4
7.1 SEO pass (unique metas, canonical, hreflang, JSON-LD Org/WebSite/Breadcrumb/
Article/FAQ/Person, **sitemap.xml + robots.txt**, OG images, internal linking) ⬜ ·
7.2 Security pass (CSP/HSTS/headers, **rate limiting everywhere, Turnstile on all
forms/login/calculators**, input-validation audit, dependency audit, secret scan) ⬜ ·
7.3 Legal content final drafts + DPDP statements + grievance contact ⬜ · 7.4
Analytics (CF Web Analytics + events: kundli_generated, calculator_used,
booking_request_sent, blog_read) + error monitoring + transactional email design +
**WhatsApp click-to-chat** ⬜

## Epic 8 — QA, Performance & Owner Review Gate — ⬜ 0/4
8.1 Test suites green + edge cases ⬜ · 8.2 Lighthouse ≥90 + budgets ⬜ · 8.3 Device
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
E0 5✅ + 1 polish · E1 7✅(incl 1.7) + 3⬜ · E2 5✅(incl 2.7) + 1🔶(2.6) + 1⬜ + 1 polish ·
E3 4✅ + 3 polish · E4 ~1.5/6 · E5 ~2.5/5 (5.1🔶 5.5🔶) · E6 0/4 · E7 0/4 · E8 0/4 ·
E9 4✅ (D12, 2026-11-19)
**= 50 tracked stories: ~28 done · partials 1.5+2.5 · ~20 remaining** (polish items
counted separately from the owner-visible count).

## Dependencies
1.7→3.2b/3.4b ✅(1.7 done) · 1.8→4.1(match)/4.3 · 1.10→4.2 · 2.5→5.1 + E9.2 (picker
links + content) · E1 done earlier unlocked E3/E4 · E6.3 needs 6.2 · E7/E8 last ·
E9.4 needs E9.1–9.3 · E5/E6 can parallelise after E4.

## Polish / debt register (tracked, not owner-blocking)
3.1b cache+cron · 3.2b quick buttons/festivals/monthly · 3.4b Choghadiya display ·
4.2b autocomplete+interpretations · 2.3b consent stub · 0.5b secret-scan hook ·
P3 self-hosted fonts · P20 Lighthouse · P19 Docker build test · token rotation.

## Pre-launch gates (owner-visible)
Jyotishi review of muhurat rules (P11) · Jyotishi/owner engine sign-off (P16/D5) ·
sample-data removal or marking (P8/P9/P10/P17) · legal review (P7) · **D8 frontend
deploy approval**.

## Working rules (unchanged)
Frontend/backend/database workstream split · API & data contracts v1 · commit in the
owning repo · BMAD-style review before every commit · QA-mindset tests · fix where
the fix belongs · backend deploys first (additive before breaking) · Bun only.
