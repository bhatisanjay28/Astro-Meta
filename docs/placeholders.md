# Placeholder & Sample-Data Register

Everything below is **placeholder or sample** and must be replaced/resolved before public
launch (PRD §15: sample data removed or clearly marked; PRD §19 definition of done).
This register is updated in the same change that introduces or resolves an item.

Status: 🟡 placeholder in use · 🔴 blocks launch · ✅ resolved

| # | Item | Where | Notes | Status |
|---|------|-------|-------|--------|
| P1 | Dummy Vyotish wordmark SVG | `frontend/src/assets/brand/vyotish-wordmark.svg` | Original placeholder wordmark; owner supplies final logo later. Single swappable file. | 🟡 |
| P2 | Placeholder favicon + app icons | `frontend/public/favicon.svg` | Simple original glyph (re-coloured to D11 palette 2026-11-19 + a11y `<title>`); proper icon set later. | 🟡 |
| P3 | Google Fonts hotlink (Cinzel, Poppins, JetBrains Mono, Noto Sans Devanagari + Material Symbols) | `frontend/src/layouts/Base.astro` | PRD §9 requires self-hosted, subsetted, Devanagari+Latin fonts with licences checked. D11 fonts hotlinked for design parity; self-host before launch. | 🔴 |
| P4 | Launch date "January 1, 2027" | `frontend/src/pages/index.astro` (`LAUNCH_DATE`) | Business placeholder — owner may change the date. | 🟡 |
| P5 | Notify-me via `mailto:vyotish@gmail.com` | `frontend/src/pages/index.astro` | Works today; replaced by newsletter signup (Supabase) in Epic 2/Epic 7 with proper transactional email. | 🟡 |
| P6 | Contact email `vyotish@gmail.com` on Coming-Soon page | `frontend/src/pages/index.astro` | Owner-supplied; role addresses (hello@/support@/privacy@) planned per PRD §16. | 🟡 |
| P7 | Legal pages text (Privacy, Terms, Refund, Disclaimer, About, Contact) | Epic 2.3 skeletons → Epic 7.3 content | **Drafts landed 2026-11-21** (7.3): all 5 pages fully written, DPDP-grounded, no placeholder notes remain. Owner review + entity legal name/address (ECR Rule 4(2)) + grievance-officer name (Rule 4(4)) still needed → launch-blockers #3. Contact page copy was already final (UX session 2026-11-20). | 🟡 |
| P8 | Astrologer listings | Epic 5.2 | Clearly-marked sample data; never presented as real. | 🔴 |
| P9 | Pooja catalogue + prices | Epic 5.3 | Clearly-marked sample data. | 🔴 |
| P10 | Horoscope content | Epic 5.1 | Rolling 12×EN/HI sample seeds **live in Supabase** (`is_sample=true`, API returns the flag); admin-editable later. | 🔴 |
| P11 | Muhurat rules sources | Epic 1.4 | Rules-as-data with documented sources; **qualified Jyotishi review required before launch**. | 🔴 |
| P12 | `GEMSTONES_SITE_URL` setting | backend `site_settings` (Epic 5.4) | Unset → Gemstones tab shows "Coming soon..!". | 🟡 |
| P13 | Self-hosted web fonts licences check | Epic 7 | Blocked by P3 resolution. | 🟡 |
| P14 | Analytics/error monitoring accounts (CF Web Analytics, Sentry-class) | Epic 7.4 | Owner accounts needed. | 🟡 |
| P15 | Social links in footer | Epic 2.1 | Placeholder hrefs until owner supplies profiles. | 🟡 |
| P16 | Ephemeris accuracy sign-off | Epic 1 / Epic 8.4 | astronomy-engine (MIT) behind own Lahiri layer; owner sign-off required before public launch (D5). | 🔴 |
| P17 | Testimonials / ratings / counts | n/a — policy | **Never fabricated.** Review areas stay empty until real reviews exist (PRD §5.1, §15). | 🔴 |
| P18 | `package-lock.json` removal | both repos | Old Vite/Express lockfile replaced by `bun.lock` in Epic 0.2/0.3; bun-only policy forbids npm lockfiles. | ✅ (resolved in Epic 0) |
| P19 | Docker images untested locally | `backend/Dockerfile`, `frontend/Dockerfile` | Docker Desktop not installed on the workstation; Dockerfiles written per best practice but not built — test when Docker is available. | 🟡 |
| P20 | Lighthouse ≥90 verification | Epic 0.3 / Epic 8.2 | Needs Chrome + Lighthouse run; pending until tooling available on the workstation. | 🟡 |
| P21 | Home marketing/content data (astrologers, poojas, blog teasers, FAQs, trust cards, gemstone teaser) | Epic 9.1 (Supabase tables) | Seeded `is_sample=true` from the design mockup; frontend renders via `/api/v1/content/home`; replaced by real data in 5.2/5.3/6.x. | 🔴 |
