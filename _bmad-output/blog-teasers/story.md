# Story S-TB — "Team Vyotish" bylines + homepage teaser articles in Blog

**Date:** 2026-11-22 · **Owner request (direct):** two asks, one change-set
**Pinned:** backend migration file (uncommitted) · frontend `index.astro` (uncommitted) · QA: `_bmad-output/blog-teasers/qa/QA-REPORT.md` (20/20 PASS)

## Narrative

The homepage "Articles & Vedic Studies" section (Section 10, `index.astro`) renders the
`content_blocks.blog_teasers` payload. Its three teaser cards carry fictional bylines
("By Pt. Vidyadhar Shastri", "By Acharya Ananya Dave", "By Dr. Rakesh Mishra") seeded in
migration 0004 — an invented-persona smell the owner flagged. Meanwhile `/blog` holds only
the two 0008 starter posts, so the three teaser topics have no article behind them and the
cards are dead ends.

The blog post pipeline already bylines every article "Team Vyotish"
(`backend/src/routes/v1/blog.ts` returns `author: { name: "Team Vyotish" }`); the teaser
block is the only place the sample names survive.

## Requirements (owner asks verbatim → acceptance criteria)

1. **"change the name of writer to Team Vyotish in Articles & Vedic Studies"**
   - AC-1: all three `blog_teasers` authors read "By Team Vyotish" from the live content API.
2. **"add these article in Blog section as well with proper category section"**
   - AC-2: each teaser topic exists as a full published post at `/blog/<slug>` with original
     computation-first Vyotish prose (story-enriched from the one-line teaser).
   - AC-3: categories: sunrise→Panchang Guides (existing), manglik→Kundli Science (new),
     choghadiya→Muhurat Shastra (new); category chips on /blog and category pages render.
   - AC-4: teaser cards link to their posts (stretched-link pattern; content API carries `href`).
   - AC-5: no sample astrologer name remains anywhere in blog/article surfaces
     (consultations astrologer cards are a separate D11 feature — out of scope).

## Constraints

- D12: content lives in the DB, served by API; frontend is a thin renderer — so the copy
  fix is a Supabase migration (0011), never a frontend string.
- 0010 precedent: idempotent UPDATE/INSERT with LIKE guards; `is_sample` stays true
  (P21 home-copy review stays owner-gated; this change is itself the owner's copy call).
- Static output (`output: "static"`) — DB/API changes are live immediately; pages reflect
  after the next frontend build+push (D8 gate consumed, push still consent-gated).
- Frontend router = trailing-slash 308s (S17 lesson): teaser hrefs stay slash-free.

## Tasks

- [ ] Migration `0011_team_vyotish_blog_posts.sql` (backend repo) + apply via MCP
- [ ] Frontend: `BlogTeaser.href?` + stretched-link card
- [ ] QA: live API checks, local build page checks, screenshots; BMAD review
- [ ] Owner consent → commit (backend, frontend) + push

## Amendment 1 (2026-11-22, owner follow-up)

"Admin Login" link shown publicly in the Section-10 header (pointing at /blog) — removed
along with its `|` separator; "Browse All Articles →" kept. Single occurrence repo-wide.
QA: dist grep (no "Admin Login", CTA intact) + live check after deploy.
