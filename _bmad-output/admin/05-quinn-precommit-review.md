# 05 — Quinn pre-commit review (Phases 1+2) — 2026-11-26

Reviewer: Quinn (QA persona, agent-run) · Verdict at review time: **REQUEST-CHANGES**
Scope: full diff of Phase 1 (users/roles/RLS/audit hardening) + Phase 2 (dashboard + inbox workflow),
backend + frontend, against the owner's brief and both phase stories.
This is the one BMAD code review required before commit (owner rule: review before EVERY commit).

Review evidence at review time: backend typecheck clean, tests 449/449, lint clean (117 files);
frontend astro check 0 errors, biome clean, build green, unit 5/5.

## Findings & dispositions

Every finding was dispositioned the same session (owner asleep; standing instruction: fix and continue).
Result after fixes: **backend 457 pass / 0 fail** (8 new tests), all gates re-run green.

| # | Severity | Finding | Disposition |
|---|----------|---------|-------------|
| P1 | P1 | `auth.logout` audit wrote `actor` decoded from an **unverified** JWT — anyone with any token string could fabricate audit rows attributed to any admin (audit-trail poisoning / log-injection class). | **FIXED** — logout audit only written when Supabase validated the token (401 = already-invalid session, allowed, no audit row). Tests now pin: valid session → exactly 1 audit row; forged token → 0 rows. (`src/routes/v1/auth.ts`, `test/admin-rbac.test.ts`) |
| P2-1 | P2 | DB SELECT floors didn't match API masking: rank-based policies let `content_editor` read newsletter PII rows directly, while the API masks by capability. Owner brief: mask for roles that don't need it. | **FIXED in code, swap PENDING live** — migration `0016_admin_pii_floors.sql` adds `admin_can_read_pii(uid)` (super_admin/admin/booking_manager AND active; rank alone can't express the newsletter set) and rewrites the 4 staff-read policies. Function applied live (`0016a`); the 4 policy swaps are blocked by a Supabase DDL stall (reads fast, zero locks, ALL catalog-write DDL hangs — 4 retries over ~40 min on 2026-11-26, incl. a probe `create table`; unlike the 0014/0015 episodes this one did not clear on retry). **API-level capability gates remain the enforced floor** (the backend's service-role key bypasses RLS — inbox.ts header documents this); the swap is defense-in-depth and must be retried when the infra recovers. |
| P2-2 | P2 | Media upload validated declared MIME only — a renamed non-image could reach the public bucket (stored-XSS/malware vector). Owner brief verbatim: validate "type, size, content". | **FIXED** — `matchesMagic()` checks magic bytes (PNG/JPEG/GIF8/WebP RIFF+WEBP@8) → 415 on mismatch; alt text now **required** (400). Tests: 415 on lying bytes, accepts each real signature, 400 missing alt. (`media.ts`, `admin-posts-route.test.ts`) |
| P2-3 | P2 | `content_md` sanitised only at render; owner brief verbatim: "sanitise Markdown on save **as well as** on render". | **FIXED** — `sanitizeMarkdown()` strips scriptable elements **with their bodies**, scriptable tags, `on*` handlers, `javascript:`/`vbscript:` URLs; wired into `validatePostInput` so create AND update both sanitise. Render-time rehype-sanitize stays as layer 2. 5 unit tests. (`lib/posts.ts`, `admin-posts-lib.test.ts`) |
| P2-4 | P2 | Capability matrix test covered representatives, not every role×capability pair. | **ACCEPTED as-is** — the matrix helper iterates all roles for the caps that matter; exhaustiveness would re-state the fixture. |
| P3-1 | P3 | Migration constraint drops not idempotent (`drop constraint` without `if exists` ×4). | **FIXED** — 0014:23 + 0015:17/23/29 now `if exists`. |
| P3-2 | P3 | Stale/wrong comment at 0014:67-69 claimed revoking only anon/authenticated leaves PUBLIC granted (contradicts the `from public` revoke above it). | **FIXED** — comment rewritten to state every grant path is stripped. |
| P3-3 | P3 | `scheduled_for` could be set on a `new`/`contacted` row, leaving a date the row's status contradicts. | **FIXED** — non-null `scheduled_for` requires resulting status `scheduled` (400 "send both fields together"); clearing a date stays allowed. UI only renders the reschedule control on scheduled rows, so behaviour is unchanged there. |
| P3-4 | P3 | CSV export silently caps at 10k rows. | **FIXED** — `capped` recorded in the audit details and `X-Export-Capped: true` response header when the cap is hit. |
| P3-5 | P3 | `esc()` didn't escape single quotes (generated HTML uses single-quoted attrs in places). | **FIXED** — `&#39;` added. |
| P3-6 | P3 | `audit.astro` styled `td.det` in scoped CSS, but rows are JS-generated — Astro scoped CSS never matches script DOM (S17 precedent). Detail cell silently unstyled. | **FIXED** — `<style is:global>` + comment. |
| P3-7 | P3 | Inbox requests tab rendered "No requests yet." for 400/403 failures (only 500 had an error state) — dishonest empty state hides real failures (incl. bad `?type=` deep links). | **FIXED** — any `!res.ok` renders "Could not load requests. Try again." + toast. |
| P3-8 | P3 | Drawer lacked dialog semantics: no `role="dialog"`, focus never moved in or restored. | **FIXED** — `role="dialog" aria-modal="true"`; focus parks on the close button on first open, returns to the trigger on close/Escape; action-refreshes keep the original return target. No full trap (review concurred). |
| P3-9 | P3 | Dashboard astrologer/pooja cards linked bare `/admin/catalog` — no pre-filter. | **FIXED** — `?tab=astrologers` / `?tab=poojas`; catalog reads the param, keeps the URL in sync on tab switch. |

Also accepted (deviation, not a defect): requests search matches name-only (no PII search) —
**safer** than the story's "returns 400" wording for non-PII roles, per review discussion #7.

## Security checklist vs owner brief (verbatim requirements)

| Requirement | Where enforced |
|---|---|
| Roles on the server + RLS, never only hidden buttons | `rbac.ts` capability gate on every admin route; RLS policies (0014/0016); API masking is additionally capability-gated server-side (inbox.ts) |
| Session timeout + login rate limiting + bot protection | Session: token TTL + idle logout revoke; rate limiting: `adminActionLimited` (login 5/min, export 5/min). **Bot protection (Turnstile) deferred — needs owner keys (flagged, not tonight's scope)** |
| `/admin` noindex (meta + X-Robots-Tag) and not linked from public pages | Meta on every admin page; `_headers` rule emitted; public pages carry no admin links (dist sweep verified) |
| Mask PII for roles that don't need it + log every export | `mask.ts` capability-driven masking server-side; exports require `inbox.export`, are full-PII-by-design, audited with count/filters/capped flag |
| No service-role key or secrets in frontend | Frontend holds no keys (login issues short-lived admin JWTs from the backend); verified in dist sweep |
| Validate uploads (type, size, content) | MIME allow-list + 5 MB cap + **magic bytes (P2-2)** + alt required |
| Sanitise Markdown on save AND render | **P2-3** save-time scrub + existing rehype-sanitize at render |
| CSRF + XSS protection | Auth = Bearer tokens (no cookies → no CSRF surface); all dynamic HTML escaped via `esc()` (now quote-safe, P3-5); markdown scrubbed on save + render |
| Never delete data without confirmation + backup | Purge/destructive flows gated (story AC); `is_test` rows never auto-deleted; deletes audited with pre-image |

## Sign-off

All P1/P2 findings fixed and re-verified (457/457 backend, all frontend gates green).
All P3s fixed. **Shipped 2026-11-26**: backend 2fb8514 (Workers deploy success, new routes
live-verified 401-unauth), frontend 0fe6a77 (Pages live — all 11 admin pages 200, noindex
meta + X-Robots-Tag live, no /admin links on public pages), meta f28a662 (this bundle;
`backups/` gitignored — the pre-0014/0015 backups hold raw visitor PII and stay local-only).
Outstanding: the 0016 policy swap (P2-1, live-DB step, Supabase DDL stall documented above —
retry when infra recovers; statements in the repo migration are idempotent). With that
caveat, this review is **satisfied for commit/deploy**.
