# PRD — Vyotish Website Build Brief (digest)

> **Source of truth:** `D:\AI Projects\Astrology\Vyotish_Website_Build_Brief.docx` (v1.0, 18 Nov 2026, Phase 1: local build).
> This digest preserves every requirement; read the docx for full prose. MUST = mandatory; SHOULD = strongly recommended; PHASE 2 = design for now, build later.

## 1. Overview
Real working Vedic astrology website named **Vyotish** — not a mockup. Local build first; owner reviews before any deploy. Audience (assumption, confirm): Indian mobile users, EN + HI, beginners → consultation/pooja bookers. Model: free tools/content attract; consultations & poojas convert; gemstones site links later. "Vyotish" + dummy logo top-left on every page.
- **Build now:** Home, 9 tabs, free calculators, Panchang + Muhurat engine, free Kundli, blog w/ admin, enquiry/booking forms, SEO, security, legal, design system.
- **Placeholder now:** Gemstones "Coming soon..!", dummy logo, astrologer/pooja listings (clearly marked sample).
- **PHASE 2:** live chat/call/video, wallet/payments, paid reports, user accounts/saved Kundlis, astrologer dashboard, WhatsApp/email subs, mobile app.

## 2. Working method
Local first — no production deploy, domain connection, or real emails until owner approves. **MCP: Supabase + Cloudflare MCP set up at start.** Supabase = Postgres + Auth + Storage; Cloudflare = Workers APIs + scheduled jobs + caching (+R2/KV). Logins: owner provides; never stored in code/docs/chat (§14). Design skill: Impeccable for all design work. Parallel agents (research, calculation, design, backend, quality) share one DECISIONS.md and agree API/data contracts first.

## 3. Reference sites (structure only — never copy text/images/code/data)
- **astrotalk.com**: nav layout (Consultations, Horoscope daily/weekly/monthly/yearly, Free Services, big Calculators menu, Panchang menu, Numerology, Shop, Blog, theme toggle); astrologer profiles (experience, languages, expertise, rating, price, online status, chat/call).
- **panchangbh.com**: city-based Panchang with exact coords/tz, EN+HI, "no signup" Kundli reassurance, FAQs explaining terms, About/accuracy page, festivals. Method: Swiss Ephemeris, Lahiri Ayanamsha.
- **astroarunpandit.org**: service structure (free Kundli, paid reports, poojas, gemstones separate site, expert section); trust wording (never ask OTPs, no guaranteed results); make payment/refund/support handling very clear.
Rules: no copying/hotlinking/scraping; reverse-engineer the LOGIC only; implement calculations from standard published methods; where references differ, follow the traditional method and document it.

## 4. Structure & navigation
Header: Vyotish + dummy logo top-left; 9 tabs; EN/HI switch; light/dark toggle; primary CTA "Talk to an Astrologer". Mobile: clean drawer, sticky bottom CTA, ≥44px targets. Footer: all tabs, calculators, blog, About, Contact, Privacy, Terms, Refund & Cancellation, Disclaimer, newsletter, social placeholders.
Tabs: 1 Consultations · 2 Horoscope · 3 Panchang · 4 Muhurat · 5 Astrology · 6 Poojan · 7 Free calculators · 8 Gemstones · 9 Blog.

## 5. Tab requirements (MUSTs)
- **5.1 Consultations:** astrologer directory (cards + filters expertise/language/price/availability + sort); profile page (about, expertise, languages, session types, price, availability, empty-until-real reviews); booking request form (name, phone/WhatsApp, email, topic, preferred date/time, optional birth details w/ consent) → Supabase + admin notify + Turnstile. Offers configurable, never hard-coded.
- **5.2 Horoscope:** 12-sign grid (EN/HI names + symbol); periods yesterday/today/tomorrow/weekly/monthly/yearly; per page: overview/love/career/finance/health + date + share; one URL per sign+period (`/horoscope/aries/daily`); state Moon-sign basis + link to Rashi calculator; content in DB, admin-editable, schedulable; only clearly-marked sample seeds.
- **5.3 Panchang:** city selector (remembered) + date picker + Today/Tomorrow quick buttons; per-city URLs for SEO. Five limbs (Tithi, Vaar, Nakshatra, Yoga, Karana) with start/end times; sunrise/sunset, moonrise/moonset, Hindu month + paksha, Samvat year, Rahu Kaal, Yamaganda, Gulika, Abhijit, Choghadiya (day+night), Hora, festivals/vrats, monthly calendar. **Vedic day starts at sunrise. Swiss Ephemeris-grade accuracy, Lahiri default (configurable). Amanta + Purnimanta. City-local times.** Short About/Accuracy note.
- **5.4 Muhurat:** today's auspicious/inauspicious (Abhijit, Brahma Muhurta, Choghadiya, Rahu Kaal); Muhurat finder (event type + date range + city → suitable windows with reasons). Event types: marriage, engagement, griha pravesh, vehicle, property, business/shop, naamkaran, mundan, annaprashan, travel. **Rules stored as data (not hard-coded), source of each rule documented; qualified Jyotishi MUST review before public launch.**
- **5.5 Astrology:** free Kundli (date/time/place with city autocomplete, optional gender) → Lagna chart, planetary positions, Navamsha + divisionals, Vimshottari Dasha, doshas (Manglik, Kaal Sarp, Sade Sati), short interpretations; no signup; North/South Indian chart toggle. Kundli matching: Ashtakoota (36 Guna Milan) + Manglik check + score explanation. Learn section: original articles (signs, Navagraha, 27 Nakshatras, houses, yogas, doshas, Dasha). PHASE 2: paid reports, saved Kundlis, PDF, Tarot.
- **5.6 Poojan:** catalogue by category (Graha Shanti, Satyanarayan, Griha Pravesh, Rudrabhishek, Navagraha, Kaal Sarp…); each: purpose, samagri list, duration, mode, sample price, muhurat link. Detail + booking form (date, location, language, sankalp name/gotra) → Supabase + admin notify. Respectful wording; no guaranteed-outcome claims.
- **5.7 Calculators:** index page with search + categories; one shared template (form, result card, plain-language explanation, FAQ, share, related, soft consult CTA). **Tier 1 (now):** Rashi, Nakshatra, Sun sign, Rising sign (Lagna), Birth/Natal chart, Dasha, Mangal Dosha, Kaal Sarp, Shani Sade Sati, Moon phase, Numerology (Mulank, Destiny, name). **Tier 2 (next):** name compatibility, Love, Friendship, FLAMES, Lo Shu Grid, Ishta Devata, Atmakaraka/Darakaraka, transit chart, lucky vehicle number, mobile number numerology, lucky name numerology, age. Fun tools labelled "for fun". No login anywhere.
- **5.8 Gemstones:** "Coming soon..!" + teaser + optional notify-me; driven by one setting `GEMSTONES_SITE_URL` (empty → coming soon; set → external link).
- **5.9 Blog:** content writing via admin login (§7).

## 6. Home page
Hero (promise + 3 actions: Free Kundli, Today's Panchang, Talk to an Astrologer) · Today at a glance (Tithi/Nakshatra/Rahu Kaal for selected city) · daily horoscope 12-sign picker · Explore Vyotish (9 tiles) · quick Kundli form · popular calculators · featured astrologers (sample) · upcoming festivals/muhurat · pooja highlights · latest posts · trust section (true statements only — no invented numbers/testimonials) · FAQ · newsletter · full footer.

## 7. Blog & admin
Separate `/admin`; **Supabase Auth** email+password; roles admin/editor; MFA strongly recommended; **first admin via secure setup script, never hard-coded**. Posts: create/edit/soft-delete/draft/publish/schedule/preview; rich-text or Markdown + image upload; categories, tags, author, slug (auto+editable), excerpt, featured image + alt. SEO per post (title, meta desc, OG image, canonical); auto reading time. Public: listing + pagination, category/tag pages, search, article w/ TOC, related, share, author box; RSS; sitemap inclusion. **Sanitise all post HTML (XSS); only admin area writes.** SHOULD: admin modules for horoscope content, astrologers, poojas, requests, contact messages, newsletter (export), site settings (incl. GEMSTONES_SITE_URL).

## 8. Calculation engine
Separate, **versioned module with automated tests**; runs on Workers (e.g. WASM) or small separate service — confirm in DECISIONS.md. Swiss Ephemeris dual licence (AGPL/paid) — check compliance before public commercial use; record decision. **IANA tz db for historical/DST correctness.** City dataset (GeoNames, attribution) in Supabase — avoid per-request geocoding APIs. Configurable: ayanamsha (Lahiri default), house system, chart style, month system. **Validate against known sample dates/charts + independent sources; document differences. Deterministic → cacheable per city+date. Never present a guessed value as real.**

## 9. Design & UX
Impeccable → design direction → tokens (colour/type/spacing/radius/shadows) before components; no generic template look. Calm, trustworthy, traditional-yet-modern; no clutter/clip-art/popup spam/pressure. Light + dark. Original dummy logo: simple SVG wordmark + small symbol, one swappable file; placeholder favicon/app icons. Typography: self-hosted, subsetted, Devanagari + Latin, licences checked; body ≥16px. **Mobile first**: responsive, ≥44px targets, short forms, sticky CTA, fast on low-end Android/4G. Kundli charts: responsive printable SVG; original/open-licensed zodiac + planet icons. All states (loading skeletons, empty, friendly errors, offline, custom 404). Simple respectful EN/HI microcopy; multilingual-ready from start (EN first, HI for Panchang/Horoscope core), URL prefixes `/hi/` + hreflang. Motion subtle; respects reduced-motion.

## 10. Technical architecture
Frontend: SEO-friendly SSR/SSG framework that deploys well on Cloudflare (Next.js+OpenNext or Astro); TypeScript; justify in DECISIONS.md. Backend: **Cloudflare Workers** (APIs, caching, scheduled jobs — daily Panchang/horoscope refresh). Supabase Postgres/Auth/Storage. Environments: local now, staging/prod later; env vars + documented `.env.example`. Cache Panchang by city+date at edge, refresh daily. DX: one-command local run, seed script, README, linting, formatting, clean commits. **Starting data model (adjust as needed):** profiles, user_roles, astrologers, consultation_requests, horoscopes, panchang_cache, festivals, muhurat_rules, pujas, puja_requests, blog_posts, blog_categories, blog_tags, post_tags, media, newsletter_subscribers, contact_messages, cities, site_settings, audit_log.

## 11. SEO
SSR/SSG + unique title/meta per page; clean URLs; canonical + hreflang EN/HI. Generate at scale where valuable (`/panchang/<city>`, `/horoscope/<sign>/<period>`, one page per calculator) with unique content, not thin duplicates. JSON-LD: Organization, WebSite, BreadcrumbList, Article, FAQPage, Person (astrologers). XML sitemap, robots.txt, OG/social previews, internal linking; llms.txt optional.

## 12. Performance
LCP <2.5s, INP <200ms, CLS <0.1 on mid-range phone/4G; Lighthouse ≥90 Performance/SEO/Accessibility. Cloudflare CDN; modern images + lazy/sizes; preload critical fonts; avoid heavy libs; route code-splitting; page-weight budget checked in testing.

## 13. Accessibility
WCAG 2.2 AA: contrast both themes, full keyboard nav, visible focus, semantic HTML, labelled fields, alt text, correct lang attributes EN/HI. Charts/calculators have text alternatives; never colour alone.

## 14. Security
Owner provides Supabase/Cloudflare logins — never in code/docs/commits/screenshots/chat; env vars + secret stores; prefer scoped tokens/MCP over passwords; **separate dev Supabase project for local work.** Service-role key server-only. **RLS on every table, least-privilege** (public: read public content, insert own requests only). Validate/sanitise input server-side; **Turnstile + rate limiting on forms/login/calculators**; CSRF/XSS protection. Admin: MFA, strong passwords, session expiry, audit log. Headers: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. HTTPS everywhere. .env out of Git; secret scanning; dependency updates/audit; automated DB backups. Never ask users for OTPs/passwords — say so on site.

## 15. Privacy, legal, trust
Birth details/phone/email = personal data: collect minimally, clear consent, purpose + retention stated, deletion on request, grievance contact. **DPDP Act 2023 compliance; legal review.** Required: Privacy Policy, Terms of Use, Refund & Cancellation, Disclaimer, About, Contact; cookie/analytics consent banner where required. Disclaimer: guidance only, no guaranteed outcomes, not medical/legal/financial advice. No guaranteed results, fear messaging, disease-cure claims. **Never ship fabricated reviews/ratings/counts/awards; sample data removed or clearly marked before launch.** All assets original/licensed; THIRD_PARTY_LICENSES.md (GeoNames etc.). Payments later → gateway compliance, GST invoices, clear pricing.

## 16. Analytics & ops
Privacy-friendly analytics (CF Web Analytics or GA4+consent). Events: kundli_generated, calculator_used, booking_request_sent, blog_read. Error monitoring (Sentry-class) + uptime. Transactional email via proper sender (SPF/DKIM/DMARC) with role addresses hello@/support@/privacy@. WhatsApp click-to-chat recommended.

## 17. QA & testing
Unit tests (engine), API tests (forms/admin), E2E (core journeys). Manual on real phones (low-end Android + iPhone), main browsers, slow networks, both themes. Edge cases: births near midnight, foreign timezones, leap years, near-pole locations, invalid inputs, empty states. Every link/form/email/SEO tag checked before sign-off.

## 18. How the AI tool should work
Plan first → DECISIONS.md (architecture, sitemap, data model, tech choices). **Milestones, quick check after each:** 1 setup+design system · 2 home+navigation · 3 Panchang+Muhurat · 4 Kundli+calculators · 5 Horoscope+Consultations+Poojan · 6 Blog+admin · 7 SEO/security/a11y/legal · 8 testing+polish. After each: summary + how to run locally + decisions needed. Keep CHANGELOG + placeholder/sample-data register. **Deploy gate: owner reviews local build first.**

## 19. Definition of done (Phase 1)
Runs locally w/ one command + README · Vyotish + dummy logo everywhere · all 9 tabs work (Gemstones switchable via setting) · home offers multiple explorations · Panchang/Muhurat/Kundli/Tier-1 calculators validated · blog end-to-end w/ admin + SEO fields · forms save to Supabase + notify admin · RLS everywhere, no secrets in code · SEO basics + sitemap + structured data + Lighthouse targets · WCAG 2.2 AA · EN/HI structure · legal pages + disclaimers · sample data marked · DECISIONS.md/CHANGELOG/placeholder list current.

## 20. Open questions — defaults unless owner overrides
EN + HI for core pages · India first (other countries' cities supported) · warm calm palette by design agent · admin writes horoscope content; Jyotishi reviews muhurat rules pre-launch · no payments Phase 1 (booking requests only) · **domain + email already owned** · placeholder legal text until supplied + legal review.
