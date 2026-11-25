# Admin Panel — Architecture (Winston)
2026-11-26. Inputs: `01-mary-audit.md` (evidence), `02-mary-gap-analysis.md` (matrix/backlog).
Stack stays: Astro-Frontend (Cloudflare Pages) + Hono backend (Cloudflare Workers, Bun toolchain) + Supabase. No new hosting.

## 0. Design principles
1. **Backend is the security boundary.** All staff data access flows through the Workers API with the service-role key (bypasses RLS by design). RLS stays and is *aligned* as defence-in-depth (incl. Supabase Studio access), but the API middleware + capability checks are the real gate.
2. **Capabilities, not role numbers.** Two roles (`booking_manager`, `content_editor`) are siblings — a linear hierarchy can't express them. Each admin route declares a required capability; a single `ROLE_CAPABILITIES` map (one file, `backend/src/lib/rbac.ts`) resolves role → allowed capabilities. Tests iterate this map (permission-matrix as code).
3. **Additive migrations only.** Every change below is `ALTER TABLE ADD COLUMN` / new table / CHECK widening. No data is dropped or rewritten. Existing values keep working (old inbox statuses map 1:1 onto the new enum).

## 1. Identity, roles, sessions
**Keep:** Supabase Auth as the identity provider (password hashing, JWT, refresh). Login stays a backend proxy (`/api/v1/auth/login`).

**Change:**
- `admin_users.role` CHECK → `('super_admin','admin','content_editor','booking_manager','viewer')`. Migration `0014_admin_roles.sql`. Existing row (`vyotish@gmail.com:admin`) stays `admin`; owner promotes themselves to `super_admin` via one SQL (or the invite UI once built — seeded decision: do it in the same migration as a documented UPDATE).
- `requireAdmin({ capability })` — replace the single no-option mount (`admin.ts:25`) with per-subtree capability requirements (e.g. inbox subtree → `inbox.write` for PATCH, `inbox.read` for GET). Role resolution stays in `admin_users` via service-role read.
- **Admin user management endpoints (new):** `GET /admin/users`, `POST /admin/users/invite` (creates Supabase auth user via service key + invite email), `PATCH /admin/users/:id` (role change / deactivate). Capability `users.manage` = `super_admin` only.
- **Sessions:** keep 1h Supabase access token; add (a) `POST /api/v1/auth/logout` proxy → Supabase revoke (missing today), (b) client idle-logout at 30 min + absolute 12 h re-login, (c) `requireAdmin` rejects tokens with `iat` older than 12 h. **MFA:** Supabase TOTP factors exist — enrol in admin UI (Profile → Security); `requireAdmin({ minAal: 2 })` enforced for `users.manage` and engine/raw settings first; rollout to all admin roles after owner enrols.
- **Rate limiting:** keep in-memory limiter, add buckets for admin mutating routes + exports (per-user-id), and add a **Cloudflare WAF rate-limit rule** on `/api/v1/auth/*` via CF API (durable, multi-colo — fixes the per-isolate gap). Bot protection: Turnstile on public request/newsletter forms once owner supplies site+secret keys.

## 2. RLS alignment (defence-in-depth)
- Rewrite staff policies to check `admin_users` (today they check the empty `user_roles` table — inert). One helper SQL function `is_staff(min_role)` + per-table policies using it. `audit_log` gets staff-read policy (backend writes via service key).
- Public policies unchanged (blog published read, requests insert, settings `public.%` read).
- **PII masking lives in the backend**, not RLS: `viewer`/`content_editor` get phone/email/birth-details stripped/replaced (`+91 •••• 4255`) at the API layer; full PII = `inbox.read_pii` capability (`admin`, `booking_manager`, `super_admin`). Every PII-unmasking read and every CSV export writes `audit_log`.

## 3. Audit log (wire what exists)
`audit_log` table already exists (0001) — no migration needed. Add `backend/src/lib/audit.ts`:
```ts
audit(actor, action, entity, entity_id, details?) // details = { before?, after?, ip?, ua? }
```
Called from every mutating admin route (posts/taxonomy/media/blocks/catalog/inbox/settings/newsletter/users), on login success/failure, role changes, and exports. Settings revert = write old value back + audit entry (prior value comes from the audit row itself). Read endpoint `GET /admin/audit?entity=&actor=&from=&to=` (capability `audit.read` ≥ admin; viewer/editor no).

## 4. Inbox workflow (consultation_requests + puja_requests + contact_messages)
**Migration `0015_inbox_workflow.sql` (additive, both request tables):**
- CHECK widened: `status IN ('new','contacted','scheduled','completed','closed','cancelled')`. Existing `closed` rows stay valid & terminal. `scheduled` covers confirmed; **reschedule = update `scheduled_for` while `scheduled`** (no extra state).
- New columns: `scheduled_for timestamptz`, `assignee_id uuid NULL` (→ `admin_users.user_id`), `is_test boolean default false`, `archived_at timestamptz NULL`, `verified_at timestamptz NULL`, `verified_by uuid NULL`, `closed_reason text NULL`. Notes go in a new `request_notes (id, request_kind, request_id, author_id, body, created_at)` table (multi-note history, not a single column).
- `contact_messages`: widen to `('new','read','closed','cancelled')` + same flags where relevant.

**Backend `lib/inbox-flow.ts` — single transition map:**
```
new → contacted | scheduled | cancelled | closed(verify required)
contacted → scheduled | completed | cancelled | closed(verify required)
scheduled → completed | cancelled | closed(verify required)   // reschedule = PATCH scheduled_for, same state
completed → closed(verify required) | scheduled (reopen only pre-verification)
closed | cancelled → ∅ (terminal — no endpoint accepts them as source)
```
- **Verification before close:** `POST /admin/requests/:id/verify` sets `verified_at/by`; `PATCH status=closed` is **409 unless `verified_at` set**. This is the owner's "validate before closing so no re-open needed".
- Detail endpoint returns every submitted field (+ birth details only with `inbox.read_pii` and consent), notes, assignee, timestamps.
- List: search `name|phone ILIKE`, filters `status,type,date_from,date_to,topic,is_test,archived,older_than=24h`, sort `created_at desc`; type = consultation|puja|message via unified handler (three queries merged in the API; no DB view needed).
- Export `GET /admin/requests/export.csv` (same filters; capability `inbox.export`; writes audit).
- **Email notify (new):** on public insert of consultation/puja/contact/newsletter-confirm → Resend API call (`RESEND_API_KEY` secret; **owner must supply key** — assumption A2). To `public.contact_email`; includes type, name, topic, created_at — **not** full phone in the email body (forwarding risk).
- Test data: `UPDATE ... SET is_test = true WHERE phone='9999999999'` ships inside migration 0015 (flagging ≠ deletion; purge stays owner-gated, decision D2).

## 5. Blog: statuses, trash, revisions, scheduled publishing
- **Statuses:** widen posts CHECK to `('draft','in_review','scheduled','published','archived')`. `scheduled` = `status='scheduled' AND publish_at<=now()` renders as published (public API condition: `status='published' OR (status='scheduled' AND publish_at<=now())`), and an admin listing sweep promotes `scheduled→published` (existing lazy sweep) **plus** the horoscope cron gains a posts sweep so publishing doesn't depend on someone opening the list.
- **Trash:** `deleted_at` already exists. Add `GET /admin/posts/trash`, `POST /admin/posts/:id/restore`, `DELETE /admin/posts/:id?purge=true` (capability `posts.purge` ≥ admin). UI confirm dialog names the post; purge warns "permanent".
- **Revisions:** new table `post_revisions (id bigserial, post_id, author_id, snapshot jsonb, created_at)` — snapshot written on every PUT (title/content_md/excerpt/seo/alt/category/tags). Restore = write snapshot back + new revision. Cap: keep last 50/post (delete-oldest on insert). Capability `posts.revise` ≥ editor.
- **Language:** add `lang text default 'en'` + `translation_of uuid NULL` (self-FK) to `blog_posts`; EN/HI pair linked; lists get a language column + filter.
- **Hindi category names:** `blog_categories` + `blog_tags` add `name_hi text NULL`, `description text NULL`, `sort_order int default 0`. Delete category = blocked while posts reference it (API returns reassign instructions); tag delete/merge endpoints: `POST /admin/tags/merge {from_ids,to_id}` (updates `post_tags`, deletes sources — **owner confirm dialog + audit**).

## 6. Catalogue (astrologers/poojas): soft delete + consent
- Migration `0016_catalog_soft_delete.sql`: `deleted_at` on both tables; DELETE endpoints → soft delete; purge ≥ admin. Fixes the current hard-delete footgun (FK `ON DELETE SET NULL` orphans requests today).
- Astrologers: add `listing_consent_confirmed_at timestamptz NULL` + `about_hi text NULL` + `title_hi` — public listing requires `is_active AND listing_consent_confirmed_at NOT NULL`. UI shows a dated consent checkbox. All 6 current rows are `is_sample=true` — owner must either mark real people or leave unlisted (flagged in gap analysis).
- Poojas: add `description_hi`, `images jsonb default '[]'`, `dakshina_on_request boolean default false` (`sample_price NULL` + flag = "on request"). `price_per_minute` stays optional/unused.
- Close the mass-assignment hole: replace `{...input}` spreads with explicit whitelists (same pattern posts already use).
- Drag-to-reorder uses existing `sort_order`; endpoint `POST /admin/astrologers/reorder {ids:[…]}` (bulk, audited).

## 7. Media
- Storage stays Supabase Storage public bucket `media` (already auto-created by the upload route). `media` table is the index.
- Backend: add magic-byte sniff (PNG/JPEG/WebP/GIF signatures) on upload; keep SVG rejected; body cap stays 5 MB; **add `DELETE /admin/media/:id`** (bucket object + row) with usage pre-check: search `blog_posts.featured_image_url/og_image_url/content_md`, `astrologers.photo_url`, `pujas.images` → "used in N posts" warning, hard-block on confirm-bypass only for admin.
- Thumbnails/resize/WebP: use **Supabase Storage image transformations** (`/render/image/…?width=&format=webp`) at render time — no Workers image pipeline needed; grid uses `width=400`.
- Listing gets pagination + `q` (alt/path search).

## 8. Settings governance
- **Registry in code** (`backend/src/lib/settings-registry.ts`): every known key → `{ group, label, description_en, type: string|url|email|date|boolean|enum|json, allowed?, capability, public }`. `GET /admin/settings` returns registry + values (UI renders grouped forms with descriptions). `PUT /admin/settings/:key` validates against the registry: unknown key → 404, wrong shape → 400, capability check (`settings.write` ≥ admin; keys with `group='engine'` or type `json` → `settings.engine` = super_admin only).
- Engine keys (`public.engine_*`) stay `public.%`-readable (frontend charts need them) — protection is write-side only, which matches the owner's "extra protection" ask.
- Who-changed-what + revert: audit_log entries carry before/after; Settings UI shows last-change per key + Revert button (≥ admin; engine revert = super_admin).
- Newsletter keys gained: `public.newsletter_from_email` etc. when Resend lands.

## 9. Dashboard + stats
- New `GET /admin/stats`: `{posts:{published,draft,in_review,scheduled,trashed}, astrologers:{active,inactive,unconsented}, pujas:{active}, inbox:{new,older_24h,scheduled_today,closed_7d}, subscribers:{confirmed,unsubscribed}, media:{count}}` — one query round-trip, capabilities-aware (viewer gets non-PII counts). Dashboard cards become links; >24 h requests surface as an alert row; quick actions = links (New post, Open inbox).

## 10. Nav / homepage / banners (D12 boundary change, decision D3 = yes)
- Nav + homepage section config move to `site_settings` (new keys `public.nav_config`, `public.home_sections`) written by admin UI (capability `content.nav` ≥ editor for copy, admin for structure); frontend keeps a **checked-in fallback** and reads the override at build time; saving triggers the existing `FRONTEND_DEPLOY_HOOK_URL` rebuild (~40 s). Banners/announcements: new content_blocks keys (`banner.*`) rendered build-time the same way. Static pages stay git-side (legal pages etc. are release artifacts) — panel edits only DB-backed copy.

## 11. Deployment & cache path
- API-rendered content (blog body, horoscopes, catalog, inbox) → **live immediately** on save (Pages proxies API; no rebuild).
- Build-time-rendered config (nav, homepage sections, banners, sitemap) → save triggers deploy hook rebuild (exists today for horoscope cron).
- Static pages/legal → git-only (out of panel scope).
- `/admin` noindex: Astro `login.astro` + admin layout add `<meta name="robots" content="noindex">`; Pages `_headers` adds `X-Robots-Tag: noindex` for `/admin/*`; admin JSON API responses already never indexed (API paths, but we add the header on `/api/v1/admin/*` too for belt-and-braces).

## 12. Hardening backlog (server-side)
1. Global JSON body cap middleware (256 KB) on `/api/v1/*`.
2. Rate-limit buckets: admin writes (60/min/user), exports (5/min/user), newsletter subscribe (already 3/h), public request forms (5/h/IP) + Turnstile when keys arrive.
3. CSP + `X-Frame-Options`/`frame-ancestors 'none'` on admin HTML via `_headers`.
4. Service-role key: **rotation recommended** (plaintext in local `backend/.env`; untracked in git). Owner action, then `wrangler secret put`.
5. Permission tests: for each of 5 roles × every admin route → expect 200/403 per the matrix in `02` §C; plus RLS regression tests via anon/authenticated Supabase clients (staff policies now non-inert).

## 13. Migration sequence (all additive; snapshot before run)
| # | Name | Content |
|---|---|---|
| 0014 | admin_roles | 5-role CHECK on `admin_users.role`; promote owner → super_admin; (optionally populate `user_roles` mirror or drop its policies — one source of truth: `admin_users`) |
| 0015 | inbox_workflow | status CHECK widening + new columns (both request tables) + `request_notes` + `contact_messages` widening + `is_test` backfill for `9999999999` rows |
| 0016 | catalog_soft_delete | `deleted_at` (astrologers, pujas), consent + `*_hi` + pooja `images`/`dakshina_on_request`, `sort_order` reseed 10,20,30… |
| 0017 | blog_lang_revisions | posts `lang`/`translation_of` + status widening; categories/tags `name_hi/description/sort_order`; `post_revisions` table |
| 0018 | settings_registry_seed | no-op / seed new newsletter keys (registry itself lives in code) |

Each migration: `supabase-migrations apply` via MCP (proven flow), preceded by a data snapshot of affected tables into `_bmad-output/admin/backups/` (SELECT * dumps) per the no-data-loss rule.

## 14. Open items (owner, non-blocking)
1. `RESEND_API_KEY` (or chosen email provider) before Phase 2 notifications ship.
2. Turnstile site+secret keys for public form bot protection.
3. Service-role key rotation go-ahead.
4. Cloudflare Access (Zero Trust) evaluation in front of `/admin` — strongest win, zero code; needs owner plan choice.
5. D1–D3 decision flags from gap analysis (defaults chosen; silence = proceed).
