# QA report — S-TB

**Date:** 2026-11-22 · **Environment:** local build of `frontend/dist` (preview-static :4321, system Chrome via playwright-core) + live API `astro-backend.vyotish.workers.dev` + live Supabase (owgszyhxvyomxyxhoeed)

## Automated — 20/20 PASS (`bun shots.mjs`)

| Surface | Assertions |
| --- | --- |
| `/blog` | 5 post cards · category chips incl. **Kundli Science** + **Muhurat Shastra** · no sample astrologer names |
| sunrise article | Team Vyotish byline · breadcrumb **Panchang Guides** · TOC (6 sections) · ≥3 tag chips |
| manglik article | byline · breadcrumb **Kundli Science** · table renders |
| choghadiya article | byline · breadcrumb **Muhurat Shastra** · table renders |
| `/blog/category/{kundli-science,muhurat-shastra}` | correct h1 · exactly 1 card each |
| `/` Articles section | 3× "By Team Vyotish" · **no sample names inside `#blog`** · teaser overlay click-through → manglik article |

## API / DB

- Supabase migration `0011` applied (MCP): teasers = "By Team Vyotish" ×3 with `href`s; 4 categories; 5 published posts; 9 post_tag links. Verified by SQL re-select.
- Live `GET /api/v1/blog/posts` → total **5**, the 3 new slugs present, ordered by `publish_at desc` (19/19/18/15/12 Nov).

## Build/static

- `astro build` green (21.8s). New dist pages exist: 3 articles + 2 category pages; sitemap/RSS regenerate on build.
- `biome`: `index.astro` clean. Repo-wide lint findings (14E/23W in DateField, date-time-picker, place-picker, matching, muhurat, etc.) are **pre-existing S15/S16 leftovers** — untouched per minimal-change discipline.

## Screenshots (`shots/`)

home-teasers-light · article-sunrise-light · article-manglik-light · article-choghadiya-light · blog-dark — bylines, breadcrumbs, TOC/tables, chips all render; consent banner overlay is the expected consent-check behaviour.

## Test-fix notes (not app bugs)

1. Related-posts for a sole-post category is legitimately empty (related filters same-category) — expectation corrected to table-render check.
2. Sample-name grep had to be scoped to the Articles section: the same fictional names ("Pt. Vidyadhar Shastri", "Dr. Rakesh Mishra") appear in the **consultations astrologer cards** — a separate D11 product surface (bookable astrologers via `/api/v1/astrologers`). Left untouched; flagged to owner.
3. `waitForURL` needed slash-free glob: local preview serves extension-less paths directly; production Cloudflare 308s to trailing slash (S17-verified). Click-through works in both.

## Deployment state

- **Live now:** DB + content API (teaser copy, 5 posts, categories).
- **Needs frontend push to show on vyotish.com** (static build bakes content at build time): homepage bylines/links, /blog listing, category pages, article pages, RSS, sitemap.
- **Uncommitted:** backend `0011_team_vyotish_blog_posts.sql` · frontend `src/pages/index.astro` (+4/-1) · meta `_bmad-output/blog-teasers/*`.

## Re-review verdict

**APPROVED** — owner asks covered (AC-1..5), D12 respected (copy = DB, not frontend strings), zero regressions on affected surfaces, no unrelated files touched.
