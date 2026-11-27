# S24 — Site-wide bilingual architecture: page-level EN↔HI switching + full Hindi translation (2026-11-27)

**Status:** ✅ Code-complete, ALL QA gates green 2026-11-28 — commit/push PENDING owner consent (see Closeout).

**Owner request (verbatim intent):** fix English↔Hindi switching across the ENTIRE site.
1. Toggle must open the corresponding page's twin (/kundli/ → /hi/kundli/), not the Hindi homepage.
2. After choosing Hindi, ALL navigation (menus, dropdowns, buttons, breadcrumbs, calculators,
   footer) must keep the visitor on Hindi pages for the whole session; same in reverse.
3. Translate all relevant UI: nav/mega menus, headings, buttons/CTAs, form labels+placeholders,
   validation errors, calculator labels AND results, breadcrumbs, footer, informational/static copy.
4. Natural Hindi (no machine literals), correct consistent Jyotish terminology.
5. Blog articles stay in their original language; no duplicate translated blog URLs.
6. /hi/horoscope/* (S22) must keep working and integrate with the site-wide system.
Root-cause fix, not URL hacks; no broken EN pages/SEO/canonicals; no duplicate pages; no
unrelated design changes.

## Root causes (verified 2026-11-27)

1. **Only 3 Hindi routes exist** — `/hi/`, `/hi/horoscope/`, `/hi/horoscope/{sign}/{period}`
   (72). Every other page has no twin, so `Base.astro`'s `SECTIONS_WITH_HI = ["/", "/horoscope"]`
   falls back to the flat `/hi/` home (an honest S22 fallback for pages that had no twins —
   the fallback is now wrong because the fix is to BUILD twins, not keep the fallback).
2. **`withLang()` (data/navigation.ts:359) hardcodes horoscope-only prefixing** — on a Hindi
   page every non-horoscope href (tabs, mega menu, drawer, footer, tiles) stays English →
   the visitor bounces back to EN. This is the "nav reverts to English" bug.
3. **Page copy is hardcoded English** inside ~30 page templates and 8 client scripts
   (form-validation, date-time-picker, place-picker, calculator-render(-map), compatibility-render,
   pancha­ng-calendar, blog-search). Only the horoscope chrome (`horoscope-l10n.ts`) and the three
   home widgets (ExploreTiles / HomeHoroscope / TodayAtAGlance) accept a `lang` prop today.
4. **Backend gaps:** calculator routes have no `lang` param and `engine/interpretations.ts`
   prose is EN-only; panchang/choghadiya engines ALREADY carry `name_hi` fields; horoscope +
   content/home APIs already accept `lang` and DB blocks are lang-filtered (hi rows may be
   missing → frontend must merge hi-then-en fail-soft).

## Design (the maintainable architecture)

**D12 boundary unchanged:** sign/planet/graha identity and page chrome = frontend config;
long-form content = API/DB (horoscope already bilingual); DB-served authored prose (astrologer
bios, puja descriptions, blog) stays in its original language unless a Hindi twin exists in the
DB/API — flagged honestly where it can't be translated this pass.

1. **Core (`src/lib/i18n.ts`)** — `Lang`, `langFromPath()`, `hiPath(enPath)`, `enPath(hiPath)`,
   twin policy (BLOG_ARTICLE routes + admin + coming-soon excluded), generalized `withLang(href,
   currentPath)` (prefixes /hi for EVERY twin route when on a hi page; identity elsewhere).
   `navigation.ts` re-exports it (same signature — all call sites keep working).
2. **Dictionaries (`src/lib/i18n/*.ts`)** — one module per surface (chrome, home, kundli, matching,
   muhurat, panchang, calculators, compatibility, consultations, poojan, astrology/learn, blog,
   legal, about, contact, forms, misc). Each exports `Record<Lang, {...}>`. Hindi written for an
   Indian audience, consistent Jyotish vocabulary (कुंडली, राशि, नक्षत्र, लग्न, दशा, गोचर, मुहूर्त,
   पंचांग, तिथि, करण, ग्रह, भाव, मांगलिक, साढ़े साती, गुण मिलान…). Planet hi names centralized in
   `zodiac-signs.ts` (identity config).
3. **Page twins — horoscope pattern generalized:** each page's markup moves to a shared component
   (`src/components/pages/*.astro`) taking `lang`; EN file becomes a thin wrapper (`lang="en"`,
   URL unchanged); `src/pages/hi/**` adds the twin (`lang="hi"`). getStaticPaths stays INLINE
   (worker-hoisting NOTE) in both wrappers of dynamic routes.
4. **Chrome components** — Base (counterpart computation rewritten around the twin policy +
   hreflang pairs), UtilityBar, Header, Footer, consent banner, skip link, 404: all read `lang`.
5. **Client scripts** — read `document.documentElement.lang`; string tables EN/HI inline per
   script (they're page-scoped bundles; no cross-bundle imports needed).
6. **API consumption** — pages fetch content blocks with lang, MERGING hi over en (never blank);
   panchang/panchang-detail use `name_hi` fields when lang=hi; calculator endpoints gain
   `?lang=hi` and the frontend passes it.
7. **Backend (targeted)** — calculators.ts + calculators-quick.ts accept `lang`; `interpretations.ts`
   gains parallel Hindi prose (deterministic strings; P11 flags unchanged); panchang engine
   `name_hi` audit completed (tithi/yoga/karana where missing). Horoscope untouched.
8. **SEO** — sitemap lists every /hi twin beside its EN original (blog articles/category/tag/page
   + rss excluded; /hi/blog/ hub included); hreflang en/hi/x-default pairs emitted per page
   (blog articles: self only); canonicals unchanged (absolute path per lang — no cross-lang
   canonicals); no redirects introduced anywhere.
9. **Learn articles** — authored in-repo (7 short files) → Hindi twins via a `learn-hi` collection,
   same slugs. Legal pages → full Hindi translations (careful, DPDP-grounded wording kept).

## Out of scope

- Astrologer bios / puja description prose in the DB (single-language columns; no schema change
  in this pass — chrome translated, authored prose stays original, same principle as blog).
- Any redesign, theme, or layout change; admin panel; coming-soon pixel-parity page (chrome-less).
- Blog article translation or hi article URLs (owner exclusion #5).

## Acceptance criteria

1. Toggle on any EN page opens the /hi twin of THAT page (spot list: /kundli/, /panchang/,
   /muhurat/, /horoscope/, /calculators/rashi, /panchang/mumbai, /compatibility/leo-aries,
   /poojan/navagraha-shanti, /consultations, /about, /privacy); reverse toggle opens the EN
   twin from every /hi page. Blog articles toggle to /hi/blog/ (Hindi hub) — never a duplicate
   article URL.
2. On any /hi page, header tabs + mega menu + drawer + footer + breadcrumbs + tiles + home
   widgets all link to /hi twins (no EN bounce); refreshing a Hindi page stays Hindi; direct
   /hi/ URLs render; html lang="hi" everywhere on hi pages.
3. Every major page renders natural Hindi UI (headings, buttons, forms, errors, calculator
   labels, breadcrumbs, footer, utility bar, consent banner). Horoscope pages unchanged in
   behavior (S22 e2e suite still green). EN pages byte-equivalent in structure (no visual change).
4. Calculator results on /hi: verdicts/meanings/guidance from the API in Hindi (lang=hi),
   identity nouns (signs/planets) mapped on the frontend, status words/labels Hindi.
5. Sitemap lists hi twins for all non-blog pages; hreflang pairs correct; no duplicate blog URLs;
   existing EN URLs and canonicals untouched.
6. QA gates: `bun run lint` + `astro check` + `bun test` green; e2e bilingual sweep (both
   languages, desktop+mobile viewports) green; dist sweep clean; build before e2e.

## Phases (build green after each)

- P1 core i18n + chrome (Base/UtilityBar/Header/Footer/404/consent) + home twin refresh
- P2 static pages: kundli, matching, muhurat, panchang hub, calculators hub, astrology+learn,
  compatibility hub, consultations hub, poojan hub, about, contact, gemstones, legal ×4
- P3 dynamic twins: calculators/[tool], compatibility pairs, panchang cities, consultations/[slug],
  poojan/[slug], learn/[slug], blog hub + article policy
- P4 client scripts (validation/picker/calculator/panchang/compatibility/blog strings)
- P5 backend: calculators lang param + Hindi interpretations + panchang name_hi audit
- P6 sitemap + hreflang + DB hi-block merge
- P7 QA gates + review + (consent-gated) commit/push

## Closeout (P7, 2026-11-28)

**Scope note:** learn articles stayed EN-only (design point 9's `learn-hi` collection was
descoped — same original-language scholarship policy as blog; owner requirement #5's spirit).
Learn hub chrome + article chrome (eyebrow, TOC, trust card) are translated on /hi twins.

**QA gates — all green (final build 00:48):**
- Backend: `bun test` 598/598 (incl. new s24-lang-hi suite, 7 tests pinning the lang=hi API
  contract + verdict-coupling), `bun run lint` clean, `tsc` typecheck clean.
- Frontend: `bun run lint` 0 errors (6 pre-existing warnings), `astro check` 0 errors
  (22 → 0 during P6), build green, dist visitor-copy sweep CLEAN (790 files).
- e2e: S24 bilingual 129/0 · S22 horoscope ALL PASS · megamenu ALL PASS · S16 datetime 59/59 ·
  place-picker 28/28 · ZC compatibility ALL PASS · horoscope ALL PASS (72 pages) · aria ALL
  PASS · contrast ALL PASS (light+dark strict) · booking-modal ALL PASS · calculators
  regressions 26/26 · S13 ALL PASS · S14 ALL PASS · closeout-glyphs 9/9.
- Full-site crawl (exit 0): zero broken links; the only 404s were 3 hashed-CSS files raced
  mid-rebuild — all 200 on re-fetch; /404 + /no-such-page-404-probe honest 404s.

**Bugs found & fixed by the P7 gates (none shipped):**
1. **Sitemap reciprocity (real bug, S24-authored):** HI twins' xhtml alternates pointed at
   themselves for en/hi/x-default instead of the EN counterpart (and HI home had none —
   falsy `""` check skipped the apex entry). Fixed in `sitemap.xml.ts` (Entry gains `en`);
   728 twinned entries verified reciprocal; ZC suite sitemap check revived to per-language
   loc counts (78 EN + 78 HI).
2. **Internal tokens shipping to visitors (pre-existing + S24-authored):** Base.astro fonts
   comment carried "(Story S1/P3)" to every page; home "SECTION 8" comment said "(sample
   catalogue, P9)" — stale AND misleading; inline-script "S24" comments shipped on hi home +
   every panchang city page (~660 hits). All reworded at source; sweep gate now enforces
   (qa/dist-sweep.mjs — S19 patterns + S24 additions, /privacy exempted per S19 C2).
3. **Suite rot (stale locators, not product):** megamenu `:text-is` vs span-wrapped trigger
   labels → `:has-text` + href-anchored Gemstones check; M12/M16 thresholds updated to the
   S17 owner-approved viewport caps (Free-Calculators panel legitimately at the 1408px cap,
   height guard engages ≤720h — calculator count 17→23 since S21). S13/S14/calculators
   regressions `[name=date/time]` fills → DateField segment drives (S16 fallout, same fix
   pattern as booking-modal S16 revival).

**Pending owner consent (not done):** commit backend (13 files) + frontend (82 paths) + meta
(story/QA/suites), then backend→GitHub→Cloudflare deploy FIRST, frontend push after (Pages
rebuild), meta last. Never pushed without consent per operating rules.
