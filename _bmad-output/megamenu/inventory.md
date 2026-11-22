# Mega menu — nav inventory (read from the codebase, 2026-11-22)

Sources: `frontend/src/data/navigation.ts` (NAV_TABS), `frontend/src/components/Header.astro`,
`frontend/src/pages/sitemap.xml.ts` (TOOLS/PERIODS), hub pages (`astrology/index.astro`,
`calculators/index.astro` TIER2, `horoscope/index.astro` SIGNS, `muhurat/index.astro` EVENTS),
live backend (`/api/v1/cities`, `/api/v1/pujas`, `/api/v1/blog/categories`), learn collection
(`src/content/learn/*.md`).

## Current chrome

- `Header.astro`: sticky z-40 header; desktop `<nav>` visible at Tailwind `xl` (≥1280px);
  mobile drawer `#mobile-drawer` with `hidden` attr + toggle button (`data-drawer-toggle`),
  Escape support, focus moved to first link on open. `Base.astro` passes `currentPath`.
- Gemstones tab renders a "Soon" chip; its page is a coming-soon / store-redirect page.
- Icons: Material Symbols (self-hosted, `icon-display.css` unlayered override).
- Theme: `data-theme="dark"` + `.dark` class toggled together; Tailwind 4 `@theme` colours with
  `light-`/`dark-` prefixed utility tokens (`bg-light-surface`, `dark:bg-dark-surface`, …);
  legacy alias vars in `tokens.css` (`--gold`, `--ivory`, `--border-gold-soft`, …).

## Sub-categories available per tab (real routes only)

| Tab | Children from codebase |
|---|---|
| Consultations `/consultations` | hub (astrologer directory + booking form); per-astrologer pages `/consultations/[slug]` (API-driven, not menu-safe). No page anchors. |
| Horoscope `/horoscope` | 12 signs → `/horoscope/{sign}/daily`; periods per sign: yesterday/daily/tomorrow/weekly/monthly/yearly (need a sign — not linkable generically). |
| Panchang `/panchang` | hub with worldwide search; city pages `/panchang/{slug}` — live slugs verified: new-delhi, mumbai, bengaluru, hyderabad, ahmedabad, chennai, kolkata, surat, pune (IN) + world list. |
| Muhurat `/muhurat` | hub; in-page sections with ids `#today-h` (today's windows) and `#finder-h` (event finder; 10 events are select options, not pages). |
| Astrology `/astrology` | hub SECTIONS: `/kundli`, `/matching`, `/compatibility`, `/calculators`, `/astrology/learn/`; learn articles ×7: doshas-in-the-chart, navagraha-nine-grahas, panchang-limbs-and-yogas, the-12-houses, the-12-rashis, the-27-nakshatras, vimshottari-dasha. |
| Poojan `/poojan` | hub (catalogue); live puja pages: navagraha-shanti, maha-rudrabhishek, griha-pravesh-vastu. |
| Free Calculators `/calculators` | hub + 23 tool pages (sitemap TOOLS, TIER2 titles): rashi, nakshatra, lagna, vimshottari-dasha, sade-sati, mangal-dosha, kaal-sarp, karakas, ishta-devata, transits, moon-phase, sun-sign, numerology, destiny-number, lo-shu, vehicle-number, name-numerology, mobile-numerology, age, name-compatibility, love, friendship, flames. |
| Gemstones `/gemstones` | single page only (coming-soon / store redirect). **No children → plain tab, no dropdown.** |
| Blog `/blog` | hub + categories (live: basics, panchang-guides) → `/blog/category/{slug}`; tags (API, volatile — excluded); `/blog/rss.xml`. |

## Design constraints

- One config file: extend `navigation.ts` (NAV_TABS stays the tab list; add optional menu per tab).
- Desktop mega panel: full-width of the header container (`max-w-7xl`), absolute under the nav —
  never wider than the container → no viewport overflow at 1280–1536px; solid surface bg + border +
  shadow so it never hides behind page content (header z-40 sticky context).
- Hover intent: open delay ≈100 ms, close grace ≈250 ms; both timers cancelled on re-enter of the
  trigger/panel wrapper. Keyboard: focus opens (no delay), focus-out closes, Escape closes +
  returns focus, ArrowDown jumps into panel. `aria-expanded`/`aria-controls` on the tab link.
- Mobile/touch: gate desktop mega on `(min-width: 1280px) and (hover: hover) and (pointer: fine)`;
  everything else gets the existing drawer upgraded to an accordion (per-tab disclose, hub as
  first "Overview" link). Same config drives both.
