# Admin Panel — Full Audit (Mary)
2026-11-26. Sources: frontend code audit (`Astro-Meta/frontend/src/pages/admin/**`, `layouts/Admin.astro`, `scripts/admin/api.ts`), backend code audit (`Astro-Meta/backend/src/**`), live Supabase schema+data (`owgszyhxvyomxyxhoeed`), live HTTP probes of vyotish.com, reference-tool research. Statuses: ✅ CONFIRMED · 🟡 PARTIAL (real but different from reported) · ❌ NOT-REPRODUCED (evidence says otherwise).

## 0. Corrections to the reported list (read first)
1. **Horoscope filter**: code wiring is correct — element IDs (`#f-sign/#f-period/#f-status`) match readers (horoscopes.astro:72–74, 95–98) and param names match the backend allowlist (backend `horoscopes.ts:62–65`). ❌ NOT-REPRODUCED in code. Practical failure likely comes from the screen's real limitations below (no lang filter, 384 rows vs 50-row default page, unstable order among same-`updated_at` rows). Quinn reproduces live in dev phase; screen gets rebuilt regardless.
2. **Contrast**: secondary text `#9b8f7a` = 5.59:1 on panel / 5.95:1 on bg — **passes WCAG AA**, fails AAA, and is used at 11–12px. 🟡 Real weakness, not a violation. Fix: bump small-size secondary to ≥12px/+1 lightness step in the UI kit.
3. **Dashboard cards are clickable**: all four are `<a class="card" href="/admin/…">` (index.astro:9–14). 🟡 Affordance is weak (no hover cue, flush row spacing) — likely why they read as non-clickable. Fix affordance + the missing inter-row gap (`.grid2` gap:16px with no margin between the two rows).
4. **Noindex**: meta IS present on both admin shells (Admin.astro:30, login.astro:10) + robots.txt `Disallow: /admin/`. What's genuinely missing: **`X-Robots-Tag` header** (no `public/_headers` file exists at all) — ✅ gap confirmed. Also `/admin/` HTML is statically prerendered and publicly served (200 logged-out); gating is client-side redirect + backend 401/403 — accepted design (Admin.astro:2–4), backend is the boundary.
5. **Post delete confirmation exists** but is generic native `confirm("Are you sure…")` (posts.astro:70) — doesn't name the post, no trash view. 🟡.

## 1. Screen-by-screen

### Dashboard (`admin/index.astro`)
- ✅ "drafts waiting to publish" hardcoded (index.astro:9) while the count is total posts, no status filter (line 38). DB: all 5 posts `published`, 0 drafts → label factually wrong.
- ✅ "6 astrologers" = all rows (astrologers endpoint array length); DB: 3 active + 3 inactive sample rows. Active = 3.
- ✅ No alerts / recent activity / quick actions (only static "Getting started" links). No `/admin/stats` endpoint exists (backend grep: absent) — cards poll list endpoints.
- ✅ Uneven spacing: no vertical gap between the two `.grid2` rows.
- NEW: catalogue/horoscope counts use array `.length` (lines 43–44) — capped at page size.

### Blog posts (`admin/posts.astro`, `admin/posts/edit.astro`)
- ✅ Category column renders raw truncated UUID (posts.astro:45 `.slice(0,8)`); backend list select returns only `category_id` (backend posts.ts:43–45). DB has proper names (4 categories). Contract gap, both sides.
- 🟡 Delete: native generic confirm, then soft delete; no trash view/restore UI; purge unreachable.
- ✅ Filter needs button click (posts.astro:82–85), no URL state, not live.
- ✅ Missing: pagination (hard 50), sort, bulk, author, language, in_review/scheduled status options (editor status select: draft/published/archived only — scheduled is implicit via future `publish_at`), `fmtDate` hides time so scheduled times invisible (api.ts:154–162).
- Editor: no markdown toolbar/preview/autosave/revisions (none exist); no EN/HI field anywhere (schema has no lang column either); dead `#save-state` pill (edit.astro:56); no unsaved-changes guard repo-wide.

### Categories & tags (`admin/taxonomy.astro`)
- ✅ Create-only categories (form lines 47–58; table Name/Slug only). Backend has POST+GET only — no PATCH/DELETE. DB: no `name_hi`/description/`sort_order` columns.
- ✅ Tags list-only ("auto-created from posts" label); backend GET only — no rename/merge/delete. DB: 11 tags, 14 links.

### Media (`admin/media.astro`)
- ✅ Flat table, no thumbnails/grid; files never rendered as images.
- ✅ "Copy URL" is a lie — readonly input `onclick="this.select()"` (line 32) only selects text; toast falsely says "URL copied" (line 54).
- ✅ No delete/alt-edit/usage/search/pagination — **backend has no DELETE/PATCH media endpoints at all** (media.ts: POST+GET limit=50). DB `media` table: 0 rows (nothing uploaded yet).
- 🟡 File input is styled by the global dark input rule (consistent; owner still wants a dedicated styled dropzone).

### Horoscope content (`admin/horoscopes.astro`)
- ❌ Filter wiring correct (see §0.1) — but see real gaps.
- ✅ Sort is `updated_at.desc` only (backend horoscopes.ts:58) — owner wants updated→period→sign, newest first.
- NEW a: no lang filter or lang field in UI; `+ New row` can only create `en` rows (frontend posts no lang; backend defaults en) — **Hindi rows unmanageable from the panel** (DB has 384 rows: daily 120/lang, weekly/monthly/yearly 24/lang; `yesterday`/`tomorrow` exist in the enum but **0 rows** — generator never writes them; owner's "content for all periods" confirmed missing 2 of 6 periods).
- NEW b: Edit re-fetches list at per_page=100 and finds rows client-side (lines 110–114) — with 384 rows, most rows **cannot be opened**. No delete for rows.
- NEW c: status filter/pill limited to draft|published; DB: all rows published.

### Content blocks (`admin/blocks.astro`)
- NEW: hardcoded `kundli.` prefix (line 56, 84–86) — the other 12 block_key groups (hero_trust, blog_teasers, horoscope.*, trust_cards…) are unreachable from the panel. Save overwrites payload with exactly `{title, body}` (lines 93–96) — **silently drops any other payload keys** an existing block carries (several real blocks have richer payloads — e.g. calculators hrefs from migration 0012 are at risk on edit).

### Astrologers & poojas (`admin/catalog.astro`)
- ✅ Active = plain "yes"/"no" text (lines 98, 104); change requires opening dialog checkbox. Backend PATCH exists (catalog.ts:94–97) — toggle is easy.
- ✅ No photo picker (text URL field only), no sort control (DB `sort_order` exists, listings ordered sort_order.asc), no EN/HI bio split (single `about`), no consent-to-list field (closest: `is_sample`, not exposed).
- NEW: `session_types` fallback prefills the **string** `"[]"` (line 138 JSON.stringify of missing value) — saving writes a string, not array; `accent:"primary"` hardcoded on every save (lines 172, 181); DB reality: 6 astrologers all `is_sample=true` (3 named + 3 "Sample Astrologer One/Two/Three"), `sort_order` 0,0,0,0,1,2.
- Poojas: no images field, no "dakshina on request" (nullable `sample_price` unused for that), no `description_hi` (only `name_hi` exists).

### Inbox (`admin/inbox.astro`)
- ✅ Test rows in DB: `QA S18` ×3, phone `9999999999` (created 2026-11-22/23) + 1 real lead (Sanjay Bhati, `scheduled`). No flag/mark-test anywhere (backend: no `is_test` in schema or API).
- ✅ Statuses exactly `new|contacted|scheduled|closed` requests / `new|read|closed` messages (inbox.astro:28–29 = backend inbox.ts:16–17 = DB CHECKs).
- 🟡 Current status partially highlighted: gold pill for `new`, **identical green pill for contacted/scheduled/closed** (lines 47, 58) — color carries no status meaning.
- ✅ No detail view (message truncated to 120 chars inline), no notes, no assignee (no columns in DB), no search/filters/export, no pagination (two per_page=50 fetches merged client-side).
- ✅ Phone/email plain text — no tel:/mailto:/wa.me links (lines 44, 54).
- ✅ No status-transition rules: backend PATCH accepts any of the 4 values from any state (inbox.ts:74–89); frontend offers no path back to `new` (frontend-only limitation).
- NEW: no request-type column (type only via client-merge of two fetches); no `>24h` indicator (site promises 24–48h); no email notification on new request (backend comment defers it, requests.ts:5); no Turnstile (comment only, env.ts:4).

### Settings (`admin/settings.astro`)
- ✅ Raw key/value editor with `JSON.parse` validation ("wrap plain text in quotes" toast); no grouping/descriptions/allowlist; backend PUT accepts any key matching `[a-z0-9_.-]{1,80}` with any JSON value (ops.ts:68–94) — no per-key permissions. DB: 8 keys (4 engine, contact_email/whatsapp, gemstones_site_url, notify_launch_date), values stored as JSON strings.
- ✅ Engine settings writable by any admin (and editor — same gate): no capability distinction exists.
- ✅ Newsletter: CSV download only (settings.astro:69–88); no subscriber list UI **and no backend endpoints** for list/unsubscribe/delete; `confirmed_at` never set by code (single-opt-in, DPDP-relevant); 1 subscriber row.
- NEW: `offers_config` code path renders public settings unvalidated (settings.ts:94–99); row currently absent (deleted earlier) but writable.

### Global (`layouts/Admin.astro`, `scripts/admin/api.ts`)
- ✅ Sidebar flat text-only, 9 items, no icons/grouping; email shown, **role fetched but never displayed** (api.ts:140); no user management endpoints (Epic 6.4's promised "promote further admins" route absent).
- ✅ Toast component exists (good); confirms are native `window.confirm`; loading rows + honest empty states exist; **no fetch-error state** (failed load = eternal "Loading…"); no spinner.
- ✅ No success/error message parity issue toasts aside: silent-stall bug — `requireSession()` returns false on non-401 `/admin/me` failure without redirect or message (api.ts:143) — blank page.
- ✅ Tables don't stack/scroll on mobile (no horizontal-scroll wrapper; single 800px breakpoint stacks sidebar only).
- ✅ Spacing ad-hoc (8/14/16/18/22px scattered); admin palette `--a-*` private (doesn't load public tokens.css).
- Auth model: static prerender + sessionStorage JWT + `Authorization: Bearer`; 401 → one refresh → retry → logout; login rate limit 10/min (per-isolate memory only); **no logout/revoke endpoint**; MFA plumbing (`aal`, `minAal`) exists but never enforced (`requireAdmin()` mounted once, no options — admin.ts:25); **roles admin|editor only, and the distinction is enforced nowhere**.

## 2. Database & data audit (live)
- Schema highlights: `blog_posts` has `deleted_at` (trash-ready), `publish_at`, full SEO fields, `alt_text`; **no `lang`/`translation_of`**; no revisions table. `audit_log` exists (0001:296) — **0 rows, never written by any code path**. `media` table ready, 0 rows. `newsletter_subscribers` has `confirmed_at`/`unsubscribed_at` (code never sets either). `astrologers` already has `sort_order/is_available/availability_label/expertise/languages/photo_url` — UI exposes almost none.
- **Two parallel role systems (P0)**: every RLS staff policy checks `user_roles` (admin|editor) — **0 rows, inert**. Actual roles live in `admin_users` (1 row: vyotish@gmail.com:admin) which RLS never reads. Backend uses service-role key everywhere (bypasses RLS) → all real gating is backend middleware, which (see above) enforces no role distinctions. No DELETE policies on any table.
- `site_settings_public_read` = `key LIKE 'public.%'` → engine keys (`public.engine_*`) are **world-readable** by anon (write-side protection is what's missing; frontend charts read them legitimately).
- PII: `consultation_requests` staff-read/update policies exist but are inert (see above); public insert open (correct for the form); no public read (good).

## 3. Security posture (summary — details in Winston §12)
✅ Good: CORS allowlist incl. prod only; Bearer-only (no cookies → CSRF largely N/A); SVG uploads rejected; MIME allowlist + 5MB cap; per-field length caps; secrets not in frontend or git; `X-Frame-Options: DENY`, nosniff, referrer-policy on API.
⚠️ Gaps (ranked): (1) no role/capability enforcement on any route; (2) RLS staff policies inert (empty `user_roles`); (3) audit log never written; (4) no logout/revoke + MFA never enforced → stolen token = full admin for its TTL; (5) login limiter per-isolate only, no WAF rule; (6) settings PUT accepts any key/value; (7) mass-assignment spreads in catalog create/patch (`{...input}` — e.g. `is_sample` settable); (8) no media content sniffing / no delete; (9) no JSON body-size ceiling; (10) exports unmetered (newsletter CSV cap 10k, no rate bucket); (11) service-role key in local `backend/.env` plaintext (untracked; rotation advised); (12) no X-Robots-Tag/CSP headers; (13) hard deletes on catalog (irreversible, FK SET NULL orphans requests).

## 4. Tests inventory (backend)
~51 admin-focused `it()`s across admin-auth-route (8), admin-modules (16), admin-posts-route (15), admin-posts-lib (12) + adjacent public-route tests. All will need extension for 5 roles (matrix as code, Winston §12.5).

## 5. Extend-vs-adopt
See `02-mary-gap-analysis.md` §A — decision: **extend** (Payload 3 = only Workers-native CMS but D1-based rebuild; Directus/Strapi need Node hosting; schema already has the primitives).

## 6. Where each fix lands
Frontend-only fixes: 14 items listed by the frontend audit (dashboard hints/affordance/gap, category-name rendering stopgap, live filters+URL state, media copy-truthfulness, inbox links/pills, catalog JSON bugs, blocks prefix+payload merge, editor guard, silent-stall, pagination UI, mobile scroll, `_headers` file…).
Backend/contract fixes: stats endpoint, category embed, inbox workflow (0015), media DELETE/PATCH, settings registry+capabilities, newsletter list/unsub/delete, users/roles endpoints, audit wiring, horoscope order+lang params, catalog whitelists+soft delete, posts lang/revisions, rate buckets, body cap, sniffing.
