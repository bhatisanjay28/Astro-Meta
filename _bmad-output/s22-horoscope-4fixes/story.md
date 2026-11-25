# S22 — Horoscope pages: 4 owner fixes (2026-11-25)

**Status:** ✅ Implemented + verified — review APPROVED (`review.md`), all gates green; awaiting owner consent to commit/push (frontend repo; backend untouched).

**Owner request (verbatim intent):** four changes on the Horoscope pages —
1. Remove the public sentence "Panel reviewer names are published with the launch."
   everywhere (EN+HI files, templates, content, DB), leaving no empty box/gap/orphan heading.
2. Home "Daily, Weekly & Yearly Horoscope": selecting a period tab then a sign must land
   on that PERIOD's page (e.g. Monthly → /horoscope/leo/monthly), for all 12 signs.
3. On sign pages, the bottom "All 12 Signs" section shows Hindi names only — show BOTH
   English and Hindi names. Naming only; no functional change.
4. Hindi language selection shows English horoscope pages. Find the cause; make horoscope
   pages (home widget, hub, sign pages, all 6 periods) fully Hindi when Hindi is chosen,
   carrying the choice across pages. Report any missing Hindi content; check 360/768/1024/1440px.

## Root causes (verified 2026-11-25)

1. Sentence exists ONLY in `HoroscopeSidebar.astro:121` (EN only; no hi page existed).
   Swept src + dist + DB (`~* 'Panel reviewer|published with the launch|पैनल|समीक्षक|लॉन्च'`):
   DB matches are benign loanwords in yearly Hindi text ("…लॉन्च के लिए नहीं"), NOT the
   sentence. → remove the `<p>` + dead `.trust .muted` CSS; trust card keeps h2 + body.
2. `HomeHoroscope.astro:72` bakes `href=/horoscope/{slug}/daily`; the client-side period
   `state` never updates hrefs. → JS re-syncs card hrefs on tab click with mapping
   today→daily, yesterday/tomorrow/weekly/monthly/yearly 1:1. Stale "being prepared" note
   (weekly/monthly/yearly ARE live) removed.
3. `[sign]/[period].astro:211` renders only `<span lang="hi">{s.hi}</span>`. → chips show
   zodiac EN + Hindi on BOTH langs.
4. **No Hindi horoscope routes exist** — getStaticPaths bakes only 12×6=72 EN pages;
   `fetchHoroscopePage` called without lang (defaults "en"); the "selection" is a static
   `/hi/` home skeleton; the UtilityBar switcher links flat `/hi/`. DB Hindi content is
   COMPLETE (en↔hi parity perfect: daily 120/120, weekly/monthly/yearly 24/24 rows; all 9
   horoscope.* content_blocks bilingual; hi payload twins on every structural field).
   **Missing content report: NOTHING missing in DB.** The missing Hindi is frontend chrome
   only (h1/lede/chips/crumbs/sidebar labels/dates/"All 12 Signs"), translated in code per
   the D12 boundary (sign identity + chrome = frontend config; content = API).

## Scope

- New `src/lib/horoscope-l10n.ts` — chrome vocabulary EN+HI (period labels/titles, months,
  weekdays, lords, field labels, trust copy, CTA).
- `HoroscopeSidebar.astro` + `HoroscopeDetail.astro` — lang prop; hi payload fields
  (sky.hi, planets_hi, month_hi, label_hi+months_hi, colours/direction/deity .hi).
- New shared `horoscope/SignPage.astro` + `horoscope/HubPage.astro`; EN routes become thin
  wrappers (getStaticPaths stays inline per the hoisting NOTE); new `/hi/horoscope/` hub +
  `/hi/horoscope/{sign}/{period}` (12×6) with lang="hi" + langPath hreflang pairs.
- SignPage: hi crumbs/h1/lede/chips/metaLine dates/picker "सभी 12 राशियाँ"; item-3 both-name
  chips (zodiac + hi) on both langs; Devanagari self-hosted font stack on hi variants.
- `HomeHoroscope.astro` — lang prop (hi labels, fetch lang=hi, /hi/horoscope links);
  item-2 href carry; stale note removed.
- `hi/index.astro` — adds `<HomeHoroscope lang="hi" />`; honest en-note update.
- `Base.astro`+`UtilityBar.astro` — switcher links the exact counterpart on / and /horoscope/*,
  flat fallback elsewhere (never a dead link).
- `navigation.ts` `withLang()` helper; Header (tabs+mega+drawer), ExploreTiles, Footer
  carry /hi on hi pages for horoscope links only.
- `sitemap.xml.ts` — /hi/horoscope + 72 hi sign×period entries.

## Acceptance criteria

1. Sentence gone from src; rebuilt dist clean; trust card intact (h2 + attribution).
2. On home, click Monthly → Leo card href ends /monthly; Today → /daily; all 12 signs.
3. Picker chips show "Leo / सिंह" style pairs on EN and HI pages, all 6 periods; counts
   and aria-current unchanged.
4. /hi/horoscope/{sign}/{period} renders Hindi chrome + Hindi API content; html lang="hi";
   switcher cross-links the exact counterpart both ways; home widget on /hi/ fetches
   lang=hi and links /hi/horoscope; no invented content (fallbacks honest); screenshots
   360/768/1024/1440 clean (no clipping/misalignment).
- Existing e2e-horoscope stays green (trust===1, book===1, h1===1, lucky [lang=hi]===1 —
  selector is sidebar-scoped, picker spans don't affect it).

## Out of scope

- Consent-stub chrome copy (site-wide, not horoscope). Non-horoscope sections have no hi
  pages — links from hi pages to them stay EN (reported fallback, owner-informed).
- Backend: zero changes (content + lang routing already served).
