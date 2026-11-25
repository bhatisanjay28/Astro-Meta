# Admin Panel — Revalidate, Improve, Extend (Program Hub)

Started 2026-11-26. Owner brief: fix every reported screen problem and extend the panel
(roles, audit, inbox workflow, settings forms, newsletter, media, nav) without rebuilding
from scratch. Stack: Astro-Frontend (vyotish.com, Cloudflare Pages) + Astro-Backend
(Hono, Cloudflare Workers) + Supabase (project `owgszyhxvyomxyxhoeed`).

## Working order (BMAD)
| Step | Agent | Deliverable | File | Status |
|---|---|---|---|---|
| 1 | Mary (Analyst) | Screen audit + DB/RLS audit + gap analysis + prioritised backlog + permission matrix | `01-mary-audit.md`, `02-mary-gap-analysis.md` | ✅ 2026-11-26 |
| 2 | Winston (Architect) | Roles/RLS, audit log, status flow, trash/revisions, deploy path, migration plan | `03-winston-architecture.md` | ✅ 2026-11-26 |
| 3 | Sally (UX, Stitch MCP) | Screen redesigns + shared components — **Stitch generation DOWN** (DS endpoint invalid-arg on all shapes; generate accepted but 3 polls empty over ~3 min — same as 2026-11-24). Owner-approved HTML fallback used; Stitch project `15718691526906326657` kept for retry | `04-sally-design/` (README + mockups.html) | 🔶 fallback |
| 4 | Barry/Amelia (Dev) | 4 phases: (1) users/roles/RLS/audit (2) dashboard+inbox (3) blog/categories/media (4) astrologers/poojas/settings/newsletter/nav — story-first per repo rules | stories under `_bmad-output/admin/stories/` | ⏳ Phase 1 story next |
| 5 | Quinn (QA) | Permission matrix tests, bypass attempts, session expiry, CRUD flows, mobile, public parity | `05-quinn-qa.md` | ⏳ |

## Ground rules (from owner)
- Security first; roles enforced server-side + RLS, never only by hiding buttons.
- Reuse what exists (schema, auth, components). No greenfield CMS adoption unless clearly better.
- Never delete data without confirmation + backup. Test rows are flagged, not deleted.
- Max 3 clarifying questions — otherwise state assumptions and continue (see each deliverable's "Assumptions").
- `/admin` stays noindex; no secrets in frontend; exports logged and role-restricted.

## Repos
- Frontend: `Astro-Meta/frontend` (= Astro-Frontend, deploys vyotish.com on push)
- Backend: `Astro-Meta/backend` (= Astro-Backend, Workers via CI)
- (Standalone `Vyotish-Repos\Astro-Backend` is a stale 24-line shim — ignore.)

## Key decisions log
- 2026-11-26: Extend-vs-adopt → **EXTEND** our panel (see 02 gap analysis §A).
