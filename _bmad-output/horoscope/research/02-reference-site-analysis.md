# Mary (Analyst) — Research 2: Reference-site analysis
**Horoscope Upgrade · Step 1 of 5 · 2026-11-24**

Scope note: the three sites are used **only** for structure / category / flow / feature ideas. No text, wording, scores or content is copied; all our wording will be original (enforced at the content step with a similarity check, and again at QA).

---

## 1. PanchangBodh — panchangbodh.com

**Positioning**: free, no-signup panchang + rashi-first horoscopes; monetizes via premium personalized reports (₹199 / $2.49, 62-page chart-based yearly report, EN+HI).

**Structure**
- Top nav: Panchang (Daily Basics / Periods & Events / Personal / Festivals / Muhurat / Calculators), Astrology (Core Charts / Dashas-Yogas-Doshas / Utilities), **Horoscope (Daily / Weekly / Monthly / Yearly, 2027 transit reports, 12 sign pages split "Aries–Virgo" and "Libra–Pisces")**, Resources.
- Top-bar quick links: Today, Choghadiya, Rahu Kaal, Kundali, Rashifal, Festivals.

**Horoscope URLs**: hub pages `/horoscope-today`, `/weekly-horoscope`, `/monthly-horoscope`, `/yearly-horoscope`; per-sign daily `/{sign}-horoscope-today` (e.g. `/aries-horoscope-today`). Premium: `/rashifal-2027`, transit hubs `/grah-gochar-2027-report`, `/guru-gochar-2027-report`, `/shani-gochar-2027-report`.

**Categories promised**: "Moon-sign (Rashi) based daily predictions for career, business, love, money and health". Article-page inner sections (lucky colour, numbers, mantra, deity) were not visible to the crawl — structure only confirmed from nav/home.

**User flow**: homepage quick-link → horoscope hub → sign page; sign-selector grid with English + Sanskrit names; bilingual EN/हिं toggle ("Every page reads naturally in both languages").

**Notable features**: 2027 transit hub with month-by-month (JFMAMJJASOND) tables and dated ingress events (e.g. Jupiter "26 Jun / Enters Leo"); free downloadable "Panchang 2027" book (62 pages); integrated per-city panchang block (Tithi, Nakshatra, sunrise/sunset, Abhijit, Rahu Kaal) tied to the kundali form.

**Good**: rashi-first honesty; transit tables as evergreen SEO; bilingual parity.
**Weak**: per-sign URL scheme (`/{sign}-horoscope-today`) is flat and doesn't group under one section; premium upsell is aggressive.

## 2. Astrotalk — astrotalk.com/horoscope/daily-horoscope

**Positioning**: astrologer-marketplace funnel; horoscopes are free trust content driving chat consultations (₹35–₹83/min cards, "first chat free").

**Structure / URLs**
- Hub `/horoscope/daily-horoscope`; sign pages `/horoscope/daily-horoscope/{sign}` (e.g. `/aries`).
- Topic pages: `daily-love-horoscope`, `daily-career-horoscope`, `daily-finance-horoscope`, `daily-health-horoscope`.
- Time variants: `tomorrow-horoscope`, `yesterday-horoscope`, `weekly`, `monthly`, `yearly`, `yearly-horoscope-2027`.
- **Hindi is a separate localized route tree**: `/hi/rashifal/aaj-ka-rashifal` (localized slugs, not just `/hi/` prefix). Also Kannada, German.

**Page anatomy (daily)**
- 12 sign cards: date range, **Lucky Number**, short blurb → full page.
- Module: **"Today's Horoscope for Different Areas of Life"** → Love / Career / Money / Health topic links.
- Long-form SEO sections: "Benefits of Reading Your Daily Horoscope", "How to Check Your Daily Horoscope?", "How to Read Daily Horoscope?", "How Does Horoscope Affect Daily Living?", "Which Planets Influence Your Daily Horoscope?", "Explore More Astrology Tools", "Horoscope Guides" + FAQ block.
- Trust/conversion: byline ("Written By: Pt. Vedant Sharma"), astrologer cards, CTAs, app links, 24×7 support.

**Good**: complete period × topic matrix (strong SEO surface); clear sign selector; bylines (E-E-A-T); FAQ blocks.
**Weak**: heavy monetization noise; lucky-colour field present but unpopulated on the hub (inconsistent data hygiene); marketing-first structure dilutes content.

## 3. Astro Arun Pandit — astroarunpandit.org

**Positioning**: personality-brand ecosystem (reports, pujas, consultations, courses, gemstones), 53+ years legacy stats, big social following.

**Structure**: About / Reports / Poojan / Consultations / **Horoscope** / Free Calculators / Courses / Transit / Gemstone.

**Horoscope menu**: Daily, Weekly, Monthly, **Yearly 2026 + 2027**, "Today's Panchang", "Weekly Love Horoscope", plus forward SEO pages (Numerology 2027, Tarot 2027, Horoscope 2026/2027, **Half Yearly**, Chinese, Varshik Rashifal, Nakshatra Horoscope) and topic horoscopes (Career, Finance, Health, Education).

**URLs**: flat kebab-case, e.g. `/horoscope/daily-horoscope/`, `/horoscope/horoscope-2026/`; duplicate transit taxonomy `/transit/*` (English) and `/grah-gochar/*` (Hindi transliteration).

**Observed behaviour**: homepage horoscope tiles for all 12 signs show **"Loading today's horoscope…" placeholder — content lazy-loaded client-side** (exactly the anti-pattern our project brief requires us to remove; search engines see the placeholder, not the text).

**Good**: 12-tile sign selector as the primary entry; topic-horoscope matrix; panchang + horoscope cross-linked.
**Weak**: client-side lazy loading hurts SEO/first paint; URL sprawl (half-yearly, Chinese, tarot variants); duplicate transit taxonomies.

---

## 4. Comparison: what they offer vs. what we plan

| Dimension | PanchangBodh | Astrotalk | Astro Arun Pandit | **Vyotish plan** |
|---|---|---|---|---|
| Moon-sign (rashi) based | ✅ core | ✅ | ✅ | ✅ core (Vedic Moon signs) |
| Periods | Daily/W/M/Y + transit hubs | Daily±(yesterday/tomorrow)/W/M/Y | Daily/W/M/Y + half-yearly | Yesterday / Today / Tomorrow / Weekly / Monthly / Yearly (existing URL set) |
| Core categories | career, business, love, money, health | love/career/money/health topic pages | career, finance, health, education | **Health & Wellbeing, Education & Learning** core; lucky colour/number/direction; Do's & Don'ts; Mantra-Thought-Deity — Career/Finance/Love *recommendable add* |
| Lucky colour/number/direction | partial (unclear) | number only (colour field unpopulated) | not confirmed | **all three, with colour swatch + text label** |
| Do's & Don'ts | not confirmed | no | not confirmed | ✅ explicit section |
| Mantra & deity of the day | not confirmed | no | not confirmed | ✅ deterministic from day's dominant benefic |
| Best & testing days (month) | no | no | no | ✅ computed from daily engine |
| Month's sky & panchang block | transit hub pages | no | transit pages | ✅ from our existing panchang engine + festivals DB |
| Yearly area-by-area (9 areas) | premium report only | yearly page (generic) | yearly page | ✅ free, 9 areas |
| Yearly month-by-month rated table | ✅ (premium/2027 hub) | no | no | ✅ free, colour-coded **plus text labels + icons** (not colour-only) |
| Bilingual | ✅ EN/हिं toggle | ✅ separate `/hi/` tree | partial | ✅ en + hi per row (API ready today; frontend `/hi/` routes TBD at design step) |
| Server-rendered content | ✅ | ✅ | ❌ lazy-load placeholder | ✅ hard requirement (no "Fetching…" placeholders) |
| Scheduled automation | yes (content ops) | yes | yes | ✅ cron + 7-day buffer + fallback + validation + alerting + health endpoint (new) |
| Disclaimer | unclear | unclear | unclear | ✅ every page (guidance/entertainment; not medical/legal/financial advice) |
| Original rule-based engine | unknown | unknown | unknown | ✅ fully computed from our own astronomy-engine transits (differentiator) |

## 5. Useful features they have that we should adopt (ideas, not copies)

1. **Topic × period matrix pages** (Astrotalk) — strong SEO surface. *Recommendation (owner decision at design step):* keep core pages to the brief; optionally add a compact Career/Money line inside daily/weekly before considering separate topic pages.
2. **Byline/reviewer attribution** (Astrotalk) — E-E-A-T signal. We can attribute content to "Team Vyotish" (our bylines already exist for the blog) and/or a reviewer line pending P11 Jyotishi sign-off.
3. **Long-form "how to read" + FAQ sections** (Astrotalk) — good for SEO and trust; matches our learn section.
4. **Transit hub with dated ingress table** (PanchangBodh) — we can generate this *free* from our engine (ingress dates for Jupiter/Saturn/Rahu etc.); natural fit for the "Month's Sky" block and a future `/horoscope/transits/` page.
5. **Yesterday/Tomorrow variants** — we already have these periods in URLs; the rule engine supports them (compute for shifted date).
6. **Premium personalized report upsell** (PanchangBodh) — out of scope for this project, but the monthly/yearly pages are a natural cross-link to our existing consultation booking.

## 6. Anti-features we deliberately avoid

- Client-side-only content (Arun Pandit's "Loading today's horoscope…") — replaced by scheduled generation + published rows + prerendered/fail-soft reads.
- Aggressive paywall/upsell inside horoscope pages; fear-based dosha marketing (site policy).
- URL sprawl (half-yearly/Chinese/tarot variants) — we keep the existing six periods and one clean URL scheme.
- Colour-only rating labels (a11y failure) — ratings always carry text + icon + colour.
