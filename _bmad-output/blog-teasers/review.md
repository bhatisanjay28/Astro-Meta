# BMAD review — S-TB (pre-implementation)

**Reviewer:** QA-mindset pass (per-DECISIONS manual BMAD; no persona files installed)
**Verdict at review:** GO with notes · **Re-review after QA:** APPROVED (see qa/QA-REPORT)

## Enrichment pass

- Scope split confirmed: homepage teasers = `content_blocks.blog_teasers`; blog = `blog_posts`.
  The two systems touch only at the teaser `href` (new field).
- Author pipeline asymmetry caught: post pages already hardcode "Team Vyotish" server-side —
  the migration only needs to fix the teaser block. No schema change.
- Category slugs chosen to mirror existing style: `kundli-science`, `muhurat-shastra`.
- `publish_at` = teaser dates (18/15/12 Nov 2026) keeps card date ↔ article date coherent and
  sorts naturally under the two 19 Nov 0008 posts.
- `reading_minutes` = teaser "read" strings (6/8/5) — card and article agree.
- Tags: reuse `panchang`/`time-keeping`; add `sunrise`, `kundli`, `manglik`, `dosha`,
  `muhurat`, `choghadiya` (all lowercase, hyphenated, matching 0008 style).

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Sample names re-seeded on fresh install (0004 runs before 0011) | 0011 is idempotent UPDATE with LIKE guard → final state identical on fresh + live DB |
| Content facts (choghadiya/Abhijit/exceptions) vary by tradition | Article prose hedges ("traditions differ"), computation claims stay engine-grounded; interpretation framed as tradition, per trust card "No fear tactics" |
| Teaser href drift vs real slug | hrefs point at the exact slugs inserted in the same migration; QA asserts both |
| Stretched-link breaks card hover border | overlay anchor, not markup swap; hover stays on `<article>` |
| RLS: content/blog tables public-read only — insert via service path | migration runs with ownership (MCP), not anon role |

## Anti-pattern check

- No frontend copy hardcoding (D12 ✓) · no dead teaser links after change (UX ✓)
- Minimal-change: frontend diff = interface field + 3 lines in Section 10 ✓
- No astrology claims invented beyond well-established classical sources; house-number
  variation (Moon-vs-lagna reference for Manglik) is stated as tradition-dependent, not
  asserted ✓
