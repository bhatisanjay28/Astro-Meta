# Third-Party Licences & Attributions

Every third-party asset, dataset, font, or library used by Vyotish-Astro is listed here
with its licence and required attribution (PRD §8, §15). Updated in the same change that
introduces a dependency.

## Planned datasets & engines

| Item | Licence | Attribution / obligation | Used in |
|------|---------|--------------------------|---------|
| astronomy-engine | MIT | Copyright notice kept in engine package (Epic 1.1) | Astro-Backend calculation engine |
| GeoNames city dataset (cities subset: lat/lng/IANA tz) | CC BY 4.0 | "City data from GeoNames (geonames.org)" in the site footer/About page; dataset docs recorded in Epic 0.4 seed | Supabase `cities` table |
| Swiss Ephemeris | AGPL-3.0 / paid commercial | **Not used** unless D5 revisit approves it; compliance check required before any commercial use | — (decision D5) |

## Fonts

| Item | Licence | Notes |
|------|---------|-------|
| Cormorant Garamond (Google Fonts) | SIL Open Font License 1.1 | Currently hotlinked for Coming-Soon parity; must be self-hosted + subsetted before launch (placeholders P3/P13) |
| Inter (Google Fonts) | SIL Open Font License 1.1 | Same as above |

## Frontend (Astro-Frontend)

| Package | Licence |
|---------|---------|
| astro | MIT |
| @astrojs/cloudflare | MIT |

## Backend (Astro-Backend)

| Package | Licence |
|---------|---------|
| hono | MIT |
| wrangler (dev) | MIT / Apache-2.0 |
| @biomejs/biome (dev) | MIT / Apache-2.0 |

## Meta repository

| Item | Licence |
|------|---------|
| Keep a Changelog (format) | CC BY 4.0 / MIT (format only, no code copied) |

## Reference sites (structure only — no assets copied)

astrotalk.com, panchangbodh.com, astroarunpandit.org were studied for navigation,
feature and flow structure only (PRD §3). No text, images, logos, icons, code, or data
were copied, hotlinked, or scraped. All Vyotish content and assets are original.
