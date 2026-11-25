# Phase 3 — Blog, categories, media (Barry/Amelia build story)

**Date:** 2026-11-26 · **Status: DRAFT — pending BMAD story review** (dev starts only after review amendments are folded in; operating rule).
**Inputs:** 02-mary-gap-analysis.md §Phase-3 (verbatim P0/P1/P2 items), owner brief security items ("Validate file uploads (type, size, content) and sanitise Markdown on save as well as on render"; "never delete data without confirmation and a backup"), 03-winston-architecture.md, schema 0001 (blog_posts/blog_categories/blog_tags/media), existing routes `posts.ts` (list/create/get/put/delete), `taxonomy.ts` (categories GET/POST, tags GET), `media.ts` (upload + list only).

## Problem (Mary)

1. **Posts list misleads (P0):** category column renders a raw UUID; delete uses a generic `confirm()` that never names the post; search + filters need a button click and lose state on reload; no author/language/sort/pagination/bulk; no trash view although `deleted_at` soft delete exists.
2. **Taxonomy is create-only (P1):** categories can't be edited/deleted/re-ordered; no Hindi name or description; tags can't be renamed/merged/deleted; no post counts.
3. **Media library is an upload bin (P1):** no thumbnails, no delete (orphans forever), no "used in N posts" warning before delete, no search, no multi-upload, alt optional (a11y + SEO), upload control unstyled.
4. **Security gaps (owner brief):** uploads validate declared type + size but **not content** (a renamed `.html` with a PNG mime would pass — magic bytes unchecked); Markdown is sanitized **only at render** (rehype-sanitize), never at save.
5. Editor (P2): no toolbar/preview, no autosave/unsaved-changes guard, no featured-image picker from the library, SEO fields (columns exist since 0001) not surfaced, no EN/HI (`blog_posts` has **no `lang` column**), no revision history, no visitor preview of drafts.

## Scope — migration `0017_blog_taxonomy.sql` (additive only; snapshot first)

> 0016 is taken: `0016_admin_pii_floors.sql` (phase-2 review fix) lands first.

- `blog_categories`: + `name_hi text`, `description text`, `display_order integer not null default 0`.
- `blog_posts`: + `lang text not null default 'en' check (lang in ('en','hi'))`.
- NOT added (flagged): `in_review` status — DEFERRED (single-admin team today; adds a 4th status to public RLS/queries for zero present workflow value — owner-visible default, revisit when a second editor joins). Scheduled remains draft + future `publish_at`.

## Scope — backend

1. **Posts list (`GET /admin/posts`)**: embed `category{name,slug}` (PostgREST embed), `author{display_name}` via `admin_users` embed, `lang`; filters keep `q`/`status`, add `lang`, `category_id`, `deleted=true` (trash view → `deleted_at not null`); sort `updated_at|publish_at|title` + `order=asc|desc` (default updated desc); pagination meta already exists — pin page/per_page bounds.
2. **`POST /admin/posts/bulk`** — `{ids: uuid[], action: 'publish'|'unpublish'|'trash'}` (super-admin/admin/content_editor via existing subtree gate); loops the same validation as single PATCH; **audited per post** (`blog_posts.update` with `bulk: true`); trash action = soft delete; never touches already-trashed rows; 400 on empty ids, 404 list on unknown ids.
3. **`POST /admin/posts/:id/restore`** (trash → previous status draft) + **`DELETE /admin/posts/:id?purge=true`** — purge = **super_admin only**, permanently deletes the row + `post_tags` (cascade) **and is audited as `blog_posts.purge`** with the full pre-delete row in details (owner rule: no deletion without confirmation+backup — the audit row IS the backup); restore audited. Default delete stays soft (`deleted_at`), as today.
4. **Scheduled publishing — NO new work needed (story correction, 2026-11-26)**: an earlier draft of this item proposed a cron `publish-due-posts` step. That is unnecessary: publication already flips **lazily** — every admin/public listing sweeps due drafts to published (`lib/posts.ts` header: "no cron dependency"). Phase-3 backend work here = only make sure the phase-3 list endpoints keep sweeping (they call the same helpers). Tests pin the sweep on a due draft.
5. **Taxonomy**: `PUT/DELETE /admin/categories/:id` (rename slug/name/name_hi/description/display_order; delete → **409 with `{posts: n}` while any post references it** — "reassign first"); `PUT/DELETE /admin/tags/:id` (rename keeps slug stable unless changed → slug collision = 409); **`POST /admin/tags/merge`** `{source_id, target_id}` — moves `post_tags`, deletes source, audited `blog_tags.merge`; deletes audited with pre-images. All gated by the taxonomy subtree capabilities.
6. **Media**: `DELETE /admin/media/:id` — refuses while the URL appears in any `blog_posts.featured_image_url` or `content_md` (`409 {used_in: n}`); after a forced `?force=true` (admin+ only) deletes the Storage object + row; audited. **Content validation on upload**: sniff magic bytes of the first bytes and reject when they don't match the declared mime (PNG `\x89PNG`, JPEG `\xFF\xD8\xFF`, GIF `GIF8`, WebP `RIFF…WEBP`) — SVG stays banned; alt becomes **required** (400 without it). List gains `q` (path/alt ILIKE) + `used_in` count per row.
7. **Sanitize Markdown on save** (owner brief): shared `sanitizeMarkdown()` in `lib/posts.ts` — strips `<script>/<iframe>/on\*=` attributes/`javascript:` URLs from raw HTML fragments while leaving normal Markdown untouched; applied in posts create + update (and blocks PUT); render-side rehype-sanitize stays as layer 2. Tests pin both layers.

## Scope — frontend

1. **Posts list**: real category **names**, author names, lang badges; live search (300 ms debounce, no button) + status/category/lang/sort filters synced to the URL (back/forward work); pagination controls; checkbox bulk bar (publish/unpublish/trash) with styled confirm naming the count; Trash tab with restore + purge (super-admin only sees purge; typed-name confirm + styled dialog); scheduled rows keep the `scheduled` pill.
2. **Global UI kit piece**: styled confirm dialog component (title names the target, danger variant, focus trap, Escape) replacing `window.confirm` everywhere in the panel; unsaved-changes guard on the editor.
3. **Editor**: Markdown toolbar (bold/italic/h2/link/list/image) + live preview (render client-side with the same sanitizer or a read-only backend render endpoint — Winston's call in review); autosave draft every 30 s when dirty + "unsaved changes" guard; featured-image picker modal over the media library (writes `featured_image_url` + requires alt); SEO section (seo_title/seo_description/canonical_url/og_image_url with length hints); lang toggle EN/HI writing the new `lang` column.
4. **Taxonomy screen**: edit-in-place rows, Hindi name + description + display_order fields, post counts, delete with the 409 reassign message; tags: rename, merge (pick target), delete.
5. **Media library**: thumbnail grid + list toggle, drag-drop + multi-file sequential upload with progress, alt required inline, copy-URL button, delete with "used in N posts" warning (409 message surfaced), search, styled upload control (Sally tokens).
6. Toast feedback on every mutation (phase-2 `toast()` reused).

## Deferrals (explicit)

- Resize/WebP conversion on upload — needs image processing on Workers (Cloudflare Images = owner cost); DEFERRED, owner flag.
- Revision history, visitor draft preview, `in_review` status — deferred (Mary P2; owner-visible).
- Nav-from-DB / banners — Phase 4 (D3 boundary change).

## Acceptance criteria (draft — review to sharpen)

1. List: category/author names render (no raw UUID); `lang` + `category_id` + `deleted=true` filters and sort/pagination params work server-side; URL state round-trips.
2. Bulk: publish/unpublish/trash applied server-side in one request; per-post audit rows; trashed rows excluded from default list; unknown ids → 404 list, no partial silent success.
3. Trash: restore returns row to `draft`; purge is 403 for non-super-admin, permanently removes the row, and its audit row embeds the full pre-image.
4. Uploads: wrong magic bytes for declared mime → 415; >5 MB → 413; SVG → 415 (regression); missing alt → 400; `DELETE /admin/media/:id` with a URL referenced by a post → 409 `{used_in}`, `?force=true` admin-only, storage object gone.
5. Markdown: post created with `<script>` in content_md stores the sanitized version (save-layer test) AND public render stays sanitized (existing render test stays green); normal markdown (code fences, raw HTML `<b>` allowed set) unchanged.
6. Taxonomy: category delete with posts → 409 `{posts:n}`; after reassign → deletes; tag merge moves associations and deletes source; all audited; display_order/Hindi name round-trip.
7. Permission matrix for every new endpoint × 5 roles (403s); legacy-role fail-safe retained.
8. Full backend suite green + lint + typecheck; frontend `astro check` 0 errors, biome clean, build green; QA sweep: posts list screenshot vs Sally tokens, bulk + trash flows e2e, media upload happy + 4 rejection paths e2e.
