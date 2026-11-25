# Admin Phase 1 — Users, Roles, RLS, Audit, Hardening (2026-11-26)

**Status:** 🔄 Story + BMAD review done; implementation starting. Owner commissioned via
"Admin panel improve & extend" brief (2026-11-26); working order = dev phase 1 of 4.
Deliverable docs: `_bmad-output/admin/01…04` (audit, matrix, architecture, design).

**Owner intent (from brief, verbatim fragments):** "no user or role management, no audit log…
Enforce roles on the server and with Supabase Row Level Security, never only by hiding
buttons. add session timeout, login rate limiting and bot protection… /admin must be noindex
(meta and X-Robots-Tag header)… Mask personal data… log every export."

**Inputs:** 01-audit §0/§3 (roles inert, audit unwired, no user endpoints), 02 §C matrix,
03-architecture §1–3/§12–13 (design of record), Sally mockups §11.

## Root causes (verified in audit)
1. `admin_users.role` CHECK allows only `admin|editor` (migration 0006:14); `requireAdmin()`
   is mounted once with no options (`admin.ts:25`) so no route distinguishes roles; MFA
   plumbing (`minAal`) exists but is never used.
2. Every staff RLS policy checks `user_roles` (0 rows — inert); real roles live in
   `admin_users` which RLS never reads. Backend uses service-role key everywhere → the only
   real gate is backend middleware (which does nothing role-wise).
3. `audit_log` table exists (0001:296) but no code path writes it; no export logging.
4. No user-management endpoints (Epic 6.4 promised, never built); no logout/revoke proxy;
   no absolute token-age cap; login limiter is per-isolate memory only.
5. No `/admin` `X-Robots-Tag` header (no `public/_headers` file; meta noindex IS present).

## Scope (Phase 1 only)
**Backend (Astro-Backend):**
- Migration `0014_admin_roles.sql`: 5-role CHECK on `admin_users.role`; promote
  `vyotish@gmail.com` → `super_admin`; `admin_role_rank(uid)` security-definer helper;
  rewrite all staff policies from `user_roles` → rank-based on `admin_users`; add
  `audit_log` staff-read policy. All additive; `user_roles` table left in place (unused).
- `lib/rbac.ts` — capability map (single source for tests): roles
  `super_admin/admin/content_editor/booking_manager/viewer` → capabilities
  (`posts.*`, `taxonomy.*`, `media.*`, `blocks.*`, `horoscope.*`, `catalog.*`,
  `inbox.read/write/read_pii/export`, `settings.write/engine`, `newsletter.*`,
  `users.manage`, `audit.read`, `stats.read`), per 02 §C.
- `admin-auth.ts`: `requireAdmin({capability, minAal})`; capability resolution from role;
  reject tokens older than 12 h; role returned in context.
- `routes/v1/admin.ts`: per-subtree capability requirements (posts subtree →
  `posts.read/write` etc.; purge endpoints ≥ admin).
- `lib/audit.ts` + writes in every mutating admin route + login success/failure + exports;
  `GET /admin/audit` (capability `audit.read`; filters entity/actor/from/to).
- User management: `GET /admin/users`, `POST /admin/users/invite` (Supabase admin API
  create-user + one-time invite email), `PATCH /admin/users/:id` (role change, deactivate)
  — capability `users.manage` (super_admin only).
- `POST /api/v1/auth/logout` proxy (Supabase revoke) — fixes the missing logout.
- Rate limits: admin writes 60/min/user, exports 5/min/user (extend `rate-limit.ts`).
- Tests: matrix-as-code suite — every role × representative route per capability; extend
  existing admin suites for capability 403s.
**Frontend (Astro-Frontend):**
- `public/_headers`: `X-Robots-Tag: noindex` + frame-ancestors on `/admin/*` (meta already
  present).
- Sidebar: show display name + role chip (data already fetched, unused at `api.ts:140`);
  Sign out calls the new logout endpoint; idle-logout at 30 min; Users & roles screen +
  Audit log screen (per Sally mockups §11, read-only tables + invite dialog).

**Deferred (explicitly):** TOTP enrolment UI + `minAal:2` enforcement (plumbing lands with
this phase; enrolment UI = Phase 1b); Turnstile (needs owner keys); CF WAF rule (needs
owner go-ahead for a zone-level change); PII masking (ships with Phase 2 inbox — needs
`inbox.read_pii` columns decisions at the drawer level).

## Acceptance criteria
1. Migration applied with pre-run snapshot; `admin_users` row promoted; old policies gone,
   new rank-based policies live; `user_roles` untouched.
2. Each admin route requires a capability; non-matching role → 403 with stable error shape.
3. Matrix-as-code test suite passes: 5 roles × representative routes (200/403 expected).
4. Every mutating admin route writes `audit_log` (actor, action, entity, diff); login and
   exports audited; `GET /admin/audit` returns entries for `audit.read` roles only.
5. Invite → new user can log in with one-time password and gets exactly their role's
   capabilities; deactivate blocks login (`requireAdmin` 403).
6. Logout revokes; access tokens older than 12 h rejected; refresh still works normally.
7. `/admin/*` responses carry `X-Robots-Tag: noindex`; sidebar shows name + role chip.
8. Existing 262+ backend tests stay green; new tests green; `bun run lint` clean.

## Risks / guards
- Policy rewrite touches prod RLS: snapshot + additive-only; public policies untouched.
- Promotion UPDATE is owner-impacting (single admin) — done inside migration with comment.
- Frontend push gates unchanged (owner consent before any push; D8-style deploy on push).
