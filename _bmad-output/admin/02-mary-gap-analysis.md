# Admin Gap Analysis, Prioritised Backlog & Permission Matrix
Mary (Analyst) — 2026-11-26. Companion to `01-mary-audit.md` (evidence) and `03-winston-architecture.md` (design).

## A. Extend vs adopt — decision: **EXTEND our own panel**

| Option | Verdict | Why |
|---|---|---|
| **Extend existing admin** | ✅ **Chosen** | Schema already has the hard parts: `blog_posts.deleted_at` (trash), `publish_at`, SEO fields, `audit_log` table (unused, ready), `media` table, `newsletter_subscribers` with unsubscribe columns, `astrologers.sort_order/expertise/languages/photo_url`. Auth (E6.1) works. Owner rule: "do NOT rebuild from scratch". |
| Payload CMS 3 | ❌ | Only CMS that runs natively on Cloudflare Workers, but on **D1/SQLite** — it would own the data layer, abandoning Supabase + our Hono API (D12 API-first) and every table above. Paid Workers plan + bundle-size risk. A de-facto rebuild. |
| Directus / Strapi | ❌ | Traditional Node servers — no hosting tier exists in this stack (Workers only, Bun-only workstation). Would add a second backend, second auth, second DB connection. |
| WordPress / Ghost | ❌ | PHP/Node monoliths; wrong stack, wrong hosting model. |
| Supabase Studio | ❌ for daily use | Generic table editor — no Vyotish roles, no workflow (inbox status flow), no branding, exposes raw JSON; fine as a super-admin escape hatch only. |

Pattern borrowing (from the reference tools): Directus/Strapi → grouped settings with typed fields; Ghost → post editor + preview + scheduled publishing; WP → trash/restore + revision history; Supabase Studio → raw JSON "Advanced" editor for Super Admin.

## B. Current-state summary (what exists vs what's missing)

**Exists and is kept:** session auth for admins, all 9 screens, Supabase schema with soft-delete/SEO/audit/newsletter primitives, `site_settings` (8 keys), horoscope automation + run log, phrase library.

**Broken (fix):** category IDs shown raw in posts table; dashboard card labels counting wrong sets; horoscope filter non-functional; noindex/X-Robots-Tag missing; secondary-text contrast below AA; unstyled file input; no toasts/success/error feedback.

**Missing (build):** 5-role RBAC + aligned RLS + audit writes; inbox status workflow (new→contacted→scheduled→completed→closed/cancelled) with one-way gate + detail drawer + notes/assignee/search/filters/export/test-flag; trash/restore + named confirmations; taxonomy CRUD + counts + Hindi + order; tags rename/merge/delete; media library UI on Supabase Storage; post editor (toolbar/preview/revisions/scheduled/language); astrologer/pooja editors (toggle, order, consent-to-list, EN/HI); grouped settings forms + protected engine section + who-changed-what; subscribers list (DPDP delete); nav/menu + homepage/banner editing; email notify on new request; session timeout + login rate limiting.

## C. Role & permission matrix

Roles (stored in `admin_users.role`, enum extended): `super_admin`, `admin`, `content_editor`, `booking_manager`, `viewer`.
Enforcement: backend middleware **and** RLS policies on every admin table (see Winston doc). PII = phone, email, birth details.

| Capability | super_admin | admin | content_editor | booking_manager | viewer |
|---|---|---|---|---|---|
| Dashboard (all stats) | ✅ | ✅ | ✅ | ✅ | ✅ (PII masked) |
| Users: invite/remove/role change | ✅ | ❌ | ❌ | ❌ | ❌ |
| Audit log: view | ✅ | ✅ | ✅ | ✅ | ❌ |
| Posts: create / edit / submit review | ✅ | ✅ | ✅ | ❌ | ❌ |
| Posts: publish / schedule / unpublish | ✅ | ✅ | ✅ *(flag D1)* | ❌ | ❌ |
| Posts: trash / restore | ✅ | ✅ | ✅ | ❌ | ❌ |
| Posts: purge from trash | ✅ | ✅ | ❌ | ❌ | ❌ |
| Revisions: view / restore | ✅ | ✅ | ✅ | ❌ | ❌ |
| Categories / tags CRUD | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tags: merge | ✅ | ✅ | ❌ | ❌ | ❌ |
| Media: upload / edit alt | ✅ | ✅ | ✅ | ❌ | ❌ |
| Media: delete | ✅ | ✅ | ✅ (usage-checked) | ❌ | ❌ |
| Horoscope content: edit text / regenerate | ✅ / ✅ | ✅ / ✅ | ✅ / ❌ | ❌ / ❌ | view only |
| Astrologers & poojas: full CRUD, consent, order | ✅ | ✅ | ❌ | ✅ | ❌ |
| Inbox: view requests | ✅ full PII | ✅ full PII | 👁 masked | ✅ full PII | 👁 masked |
| Inbox: status flow, assign, notes, archive, mark-test | ✅ | ✅ | ❌ | ✅ | ❌ |
| Inbox: CSV export (logged) | ✅ | ✅ | ❌ | ✅ | ❌ |
| Settings: General / Social / SEO / Features / Newsletter | ✅ | ✅ | ❌ | ❌ | ❌ |
| Settings: Calculation Engine + Advanced raw JSON | ✅ | ❌ | ❌ | ❌ | ❌ |
| Subscribers: list / unsubscribe / export | ✅ | ✅ | ❌ | ✅ | ❌ |
| Subscribers: permanent delete (DPDP) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Nav / homepage / banners | ✅ | ✅ | ✅ (copy only) | ❌ | ❌ |

*(flag D1)* — owner decision embedded below, not blocking.

## D. Prioritised backlog → dev phases

Owner's phase order kept. Within each phase, P0 = correctness/security first.

### Phase 1 — Users, roles, RLS, audit, hardening *(P0 security + P1)*
1. **P0** `admin_users.role` enum → 5 roles; invite/remove users; role shown in sidebar; signup rate limiting; session timeout (idle + absolute).
2. **P0** `/admin/*` noindex: meta on login + `X-Robots-Tag: noindex` header on every admin response.
3. **P0** Wire `audit_log`: writes on every admin mutation (actor, action, entity, diff), read UI.
4. **P1** Align RLS with roles (replace dead `user_roles` checks or populate them — Winston's call); PII column masking for editor/viewer via views/policies; export logging.
5. **P1** 2FA (TOTP) for super_admin/admin; evaluate Cloudflare Access in front of `/admin` (owner cost/approval).

### Phase 2 — Dashboard + Inbox *(P0 fixes + P1 workflow)*
1. **P0** Dashboard: fix card counts (published vs drafts; **active** astrologers = 3 of 6) via new `/admin/stats`; cards are already links — add hover/affordance cue; fix missing inter-row gap; success/error toasts globally.
2. **P0** Mark QA rows as test (`is_test` flag + UI filter); ⚠️ purge of `QA S18 ×3` **pending owner confirmation** — nothing deleted now.
3. **P1** Status flow `new → contacted → scheduled/confirmed → completed → closed | cancelled` with verification step before close; closed is terminal (no re-open to contacted/scheduled); current status highlighted.
4. **P1** Detail drawer (all submitted fields incl. birth details when consented), assign-to-astrologer, internal notes, request-type column (consultation vs pooja), search by name/phone, filters (status/type/date/topic), click-to-call + click-to-WhatsApp, `is_test` + archive, CSV export (logged), `>24h` highlight badge, email notification to admin on new request, unified view for consultation + pooja + contact messages; Messages tab gets same treatment.
5. **P1** New-request alert (badge + toast).

### Phase 3 — Blog, categories, media *(P0 bug + P1/P2)*
1. **P0** Posts table: show category **names** (backend embeds name; frontend stops rendering raw UUID), replace generic native confirm with styled dialog naming the post, live search + filters (no button click, URL state), status column (draft/in_review/scheduled/published), author + language columns, sort, pagination, bulk actions.
2. **P1** Trash view with restore; purge restricted (matrix); scheduled publishing via `publish_at`.
3. **P2** Editor: Markdown toolbar + live preview, autosave, revision history, featured image picker (media library), SEO/social fields, EN + HI versions, "preview as visitor" (draft render route, noindex).
4. **P1** Taxonomy: edit/delete category (reassign posts first), Hindi name, description, display order, post counts; tags rename/merge/delete.
5. **P1** Media library: thumbnail grid + list, copy-URL, delete with "used in N posts" warning, required alt text, search, drag-drop + multi-upload, resize + WebP, styled upload control, usage info. *(Assumption: Supabase Storage bucket backs the `media` table — no new R2.)*

### Phase 4 — Astrologers/poojas, Settings, newsletter, nav *(P1/P2/P3)*
1. **P1** Astrologers: Active **toggle**, drag-to-reorder (`sort_order` exists), photo (media library), specialisation, languages, bio EN/HI, availability, public-card preview, draft/publish, **"approved to be listed"** consent field (all 6 current rows `is_sample=true` — decide sample vs real with owner before publishing).
2. **P1** Poojas: duration, mode, images, EN/HI description, dakshina with "on request" option (nullable price), optional rate/minute stays unused under booking-request model.
3. **P2** Settings: grouped forms (General, Social, SEO defaults, Feature toggles + launch-date picker, Newsletter, Engine with allowed-value dropdowns + Super-Admin warning); description per setting; JSON-validated Advanced raw editor (Super Admin); who-changed-what + revert (audit_log).
4. **P1** Subscribers screen: list + count, search, status (confirmed/unsubscribed), unsubscribe, permanent delete on request (DPDP), CSV export logged.
5. **P2/P3** Nav & content: nav tabs + dropdown items, homepage sections, banners/announcements, footer/static pages from panel. *(Assumption: moves nav config from frontend `NAV_TABS` code into DB, consumed at build — changes the D12 "nav = frontend config" boundary; flagged for Winston.)*
6. **P1** Horoscope content screen (audit found more than reported): keep filters (wiring was correct — rebuild with live URL-state filtering), add **lang filter + language field** (hi rows are unmanageable today; `+ New row` can only create en), fix the 100-row edit cap (384 rows now — most unopenable), sort updated → period → sign newest-first (backend order change), extend cron to generate the missing `yesterday`/`tomorrow` periods (enum allows them, DB has 0 rows), add row delete; Blocks screen: un-hardcode the `kundli.` prefix (12 other block groups unreachable) and stop dropping non-title/body payload keys on save.

### Global UI kit (built inside phases as shared components)
Buttons (primary/secondary/danger), styled inputs/selects/file upload, sortable+paginated tables, toasts, confirm dialogs, unsaved-changes guard, loading/empty states, stacked-cards mobile tables, sidebar grouped (Content / Catalogue / Inbox & Leads / Settings & Access) with icons + user name/role, secondary text raised to comfortable-AA (already 5.6–6.0:1 — bump small sizes to ≥12px and one lightness step toward AAA), one spacing scale, fetch-error states (today failed loads stall on "Loading…").

## E. Owner decisions flagged (none blocking; defaults chosen)
- **D1** Content Editor publish rights: default = can publish (team is 1 person today). Tighten to admin-only if a review gate is wanted.
- **D2** Purge the 3 `QA S18` inbox rows after test-flag feature ships? Default: keep flagged+hidden until you say purge.
- **D3** Nav-from-DB changes the D12 boundary (build-time render, redeploy on change). Default: yes, via `site_settings` + rebuild hook (already exists for horoscope cron).

## F. Assumptions
1. Single Supabase project stays the system of record; no new hosting.
2. Transactional email (new-request notify) via a Workers-compatible provider (Resend or MailChannels) — needs one API key from owner before Phase 2 ships notifications.
3. Media files live in Supabase Storage (`media.bucket/path` already model it); public CDN URL = project storage URL.
4. "24–48h response" promise = highlight requests older than 24h (owner-confirmed wording).
5. Roles today: exactly 1 admin user exists (`vyotish@gmail.com`), so role rollout has zero migration risk for humans.

Sources: [Payload on Cloudflare (Payload blog)](https://payloadcms.com/posts/blog/deploy-payload-onto-cloudflare-in-a-single-click), [Payload × Cloudflare Workers (Cloudflare blog)](https://blog.cloudflare.com/payload-cms-workers)
