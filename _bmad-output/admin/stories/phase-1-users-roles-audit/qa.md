# Phase 1 QA verdict — Users, roles, audit & hardening (2026-11-26)

Reviewer: Quinn (QA lens), run manually per DECISIONS.md. Code under review = working tree (uncommitted at QA time; owner's overnight authorization covers the later commit/push).

**Verdict: PASS — shipped to commit gate with 3 P2 quick-fixes applied during QA** (idle-logout now revokes server-side; `api()` refresh-retry no longer retries 401-from-bad-credentials; viewer `POST /admin/posts` 403 pinned by a test; logout audit names the acting admin).

## AC verification

| AC | Result | Evidence |
|---|---|---|
| 1 — migration + promotion + rank policies live, `user_roles` untouched | PASS | `0014` applied live in 4 recorded parts after a verified-clean rollback during the Supabase DDL stall; owner row promoted to `super_admin` (verified live); `admin_role_rank` revoked from `anon`/`authenticated`; `user_roles` left in place (0 rows) |
| 2 — every route capability-gated server-side; stable 403 shape | PASS | `admin.ts` per-subtree gates; `requireCapability`/`requireCapabilityFor`; stable `{error:{code:"forbidden"}}`; fail-safe: unknown/legacy role → zero capabilities |
| 3 — matrix-as-code suite, 5 roles × routes | PASS | `test/admin-rbac.test.ts` incl. the empty-role case (story review finding 3) and the legacy-role fail-safe |
| 4 — audit on every mutating route + login + exports; `GET /admin/audit` gated | PASS | `lib/audit.ts` `writeAudit` best-effort; wired into posts/blocks/taxonomy/media/catalog/horoscopes/inbox + ops exports + login success/failure; audit route gated `audit.read` |
| 5 — invite/deactivate flows | PASS | invite via Supabase admin API (SMTP-linked); deactivate = auth `ban` + `is_active=false`; `requireAdmin` checks is_active; self-guard on role change/deactivate; before→after audited |
| 6 — logout revokes; >12 h access token rejected; refresh fine | PASS | `POST /auth/logout` (global scope, idempotent, audited); 12 h cap rejects only the presented *access* token (review amendment 1), refresh flow unaffected — pinned by tests |
| 7 — `/admin/*` noindex headers + name/role chip | PASS | `public/_headers` (`X-Robots-Tag: noindex, nofollow` + `CSP: frame-ancestors 'none'` on `/admin` and `/admin/*`) + existing meta; sidebar footer shows email + role chip |
| 8 — 262+ existing tests green; lint clean | PASS | full suite **449/449** across 37 files at Phase 2 close-out (superset of phase-1 state); `bun run typecheck` + `bun run lint` clean |

## Quinn findings raised during build (all fixed in-tree)

1. **P1 — RLS pointed at the wrong table.** Policies checked `user_roles` (0 rows ever) ⇒ RLS was inert; staff writes worked only via service-role. Fixed in `0014`: all 20 policies now rank-check `admin_users`.
2. **P1 — rank helper callable by clients.** `admin_role_rank` was default-granted; a signed-in user could call it directly. Fixed: EXECUTE revoked from `anon`, `authenticated` (verified live) — definer context (RLS) only.
3. **P2 — `/admin` bare path missed by `/_headers`.** Cloudflare Pages header rules match paths literally; `/admin` (no trailing slash) needed its own rule alongside `/admin/*`. Both present.
4. **P2 quick-fixes** (listed in the verdict): logout revoke, retry guard, viewer-403 test, logout audit actor.

## Security requirements (owner brief) — phase-1 slice

- "Enforce roles on the server and with RLS" — capability gates **and** rank-based RLS; UI affordances read `window.__vyotishAdmin.capabilities` but are never the gate.
- "session timeout, login rate limiting and bot protection" — 12 h token-age cap + 30 min idle logout + `admin:write` 60/min & `admin:export` 5/min buckets. **Bot protection (Turnstile) explicitly deferred** — needs owner keys.
- "/admin must be noindex … and not linked from public pages" — meta + `_headers`; no public nav/footer link to `/admin` (grep-verified).

**Deferred, tracked:** Turnstile keys, CF WAF rule, 2FA enrolment UI (phase 1b), `audit_log` probe row kept (owner-gated purge), `user_roles` table left in place.
