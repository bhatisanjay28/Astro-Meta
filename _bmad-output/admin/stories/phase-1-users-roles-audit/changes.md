# Phase 1 — Users, roles, audit & hardening: complete change list

Delivered 2026-11-26. Everything below is in the working tree; **nothing is committed or pushed yet** (consent-gated).

## Database (Supabase `owgszyhxvyomxyxhoeed`)

Migration `0014_admin_roles` — applied live in 4 recorded parts (`admin_roles`, `admin_roles_policies`, `admin_roles_policies_2`, `0014_admin_rls_tail`), all after a verified-clean rollback during the Supabase DDL stall:

- `admin_users.role` CHECK widened: `admin` | `super_admin` | `content_editor` | `booking_manager` | `viewer`.
- `admin_users` + `is_active boolean default true`, `display_name text`, `updated_at timestamptz`.
- Owner promoted: `vyotish@gmail.com` → `super_admin` (verified live).
- New function `public.admin_role_rank(uuid)` — security definer, stable; maps role+is_active → 5/4/3/1/0. **Revoked from `anon`, `authenticated`** (verified live) so only definer context (RLS) can call it.
- 20 policies replaced across 13 tables to check `admin_users` via the rank function instead of the empty `user_roles` table. Read floors ≥1 (profiles, newsletter, contact/requests read, muhurats); manage floors ≥3 (astrologers, horoscopes, festivals, pujas, blog_*, post_tags, media, site_settings, requests/contact update); `audit_log` gets its **first client policy** (select ≥3).
- Snapshot before migration: `_bmad-output/admin/backups/2026-11-26-pre-0014.json`.
- One probe row in `audit_log` (id 1, action `system.probe`) — documents the DDL stall episode; kept deliberately (test rows are flagged, not deleted; purge is owner-gated).

## Backend repo (Astro-Backend) — 12 files

| File | Change |
|---|---|
| `src/lib/rbac.ts` | NEW — capability catalogue (~33), 5-role map, `roleCan`/`capabilitiesOf`; unknown/legacy roles ⇒ zero capabilities (fail-safe) |
| `src/lib/admin-auth.ts` | REWRITTEN — 12h token-age cap (access token), is_active + ban enforcement, distinct 401/403 messages, `requireCapability`, `requireCapabilityFor` method-map |
| `src/lib/audit.ts` | NEW — `writeAudit` (best-effort, never fails the request), `diffBeforeAfter` |
| `src/lib/rate-limit.ts` | EDITED — `admin:write` 60/min/user, `admin:export` 5/min/user buckets; sweep evicts both key shapes |
| `src/routes/v1/admin.ts` | REWRITTEN — per-subtree capability gates (posts/blocks/taxonomy/media/catalog/horoscopes/inbox), `users.manage` gate on users, `audit.read` on audit; `/admin/me` now returns role, display_name, aal, capabilities |
| `src/routes/v1/admin/users.ts` | NEW — list (auth last-sign-in merge), invite (SMTP-linked), role change / deactivate-reactivate (auth ban sync), self-guard, audited with before→after |
| `src/routes/v1/admin/audit.ts` | NEW — `GET /admin/audit` filters (entity/actor/action/from/to) + pagination |
| `src/routes/v1/admin/ops.ts` | EDITED — export: `newsletter.export` + 5/min limit + audited; settings: read/write caps; `engine.*` keys super-admin-only; changes audited with diff |
| `src/routes/v1/auth.ts` | EDITED — login success/failure audited; NEW `POST /auth/logout` (global scope revoke, idempotent) |
| `src/routes/v1/admin/{posts,blocks,taxonomy,media,catalog,horoscopes,inbox}.ts` | EDITED — every mutating handler writes the audit trail (compact metadata only; long bodies logged as char counts) |
| `test/admin-rbac.test.ts` | NEW — capability matrix (incl. legacy-role fail-safe), token-age/deactivated hardening, gate 403s, invite/patch flows, logout idempotency |

## Frontend repo (Astro-Frontend) — 6 files

| File | Change |
|---|---|
| `public/_headers` | NEW — `/admin/*`: `X-Robots-Tag: noindex, nofollow` + `CSP: frame-ancestors 'none'` |
| `src/scripts/admin/api.ts` | EDITED — `requireSession` fills name + role chip, exposes identity/capabilities, arms **30-min idle logout**; `logout()` now revokes server-side (best-effort) before clearing |
| `src/layouts/Admin.astro` | EDITED — "Users & roles" + "Audit log" nav entries; role chip in sidebar footer |
| `src/pages/admin/login.astro` | EDITED — explains idle-logout redirect |
| `src/pages/admin/users.astro` | NEW — accounts table, role change, deactivate/reactivate (confirms), invite form; hidden without `users.manage` (API remains the gate) |
| `src/pages/admin/audit.astro` | NEW — filterable, paginated, read-only audit table |

## Verification

- Backend: **417/417 tests pass**, biome clean (CRLF normalized).
- Frontend: **astro check 0 errors**, biome clean, production build complete; `dist/_headers` + both new pages confirmed in dist.
- Live DB: all 20 policies present, rank function revoked from client roles, migration history recorded.
- QA review (Quinn) verdict: see `review-qa.md` in this folder once filed.
