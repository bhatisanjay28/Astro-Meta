# Phase 2 — Dashboard + Inbox workflow: complete change list

Delivered 2026-11-26. Built against story.md **with the 7×P1 / 5×P2 review amendments folded in** (see review.md). Everything below is in the working tree; **nothing is committed or pushed yet** (consent-gated by the owner's overnight authorization).

## Database (Supabase `owgszyhxvyomxyxhoeed`)

Migration `0015_inbox_workflow` — applied live on 2026-11-25 in 5 recorded parts (`0015_inbox_workflow`, `0015b_consultation_columns`, `0015c_puja_columns`, `0015d_message_columns`, `0015e_request_notes`), **additive only**:

- Status CHECKs widened: requests `new|contacted|scheduled|completed|closed|cancelled`; messages `new|read|closed|cancelled`.
- Workflow columns on both request tables: `scheduled_for`, `assignee_id → admin_users`, `verified_at`, `verified_by`, `closed_reason`, `closed_at`, `is_test`, `archived_at`. Messages: `is_test`, `archived_at`.
- **`closed_at`** added per story-review finding 2 — the dashboard's `closed_7d` stat now has a real source, stamped by the transition handler on →closed.
- `request_notes` table (`request_kind` consultation|puja|message, `request_id uuid` — finding 1 fixed, never bigint; body CHECK 1–2000 chars) + index; staff RLS floors (select/insert ≥ rank 3).
- Backfill: QA-S18 probe rows (phone `9999999999`) flagged `is_test=true` — hidden by default in the panel, **not deleted** (owner decision D2, purge stays owner-gated).
- Snapshot before migration: `_bmad-output/admin/backups/2026-11-26-pre-0015.json`.

## Backend repo (Astro-Backend)

| File | Change |
|---|---|
| `src/lib/inbox-flow.ts` | NEW — single source of truth for status maps: `REQUEST_KINDS` (tables/columns/mask-field names per kind), `REQUEST_NEXT` / `MESSAGE_NEXT` transition maps, verify-before-close rules, terminal detection |
| `src/lib/mask.ts` | NEW — `maskRequestRow(row, fullPii, fields)`: raw phone/email only for `inbox.read_pii` holders; birth details only with fullPii **and** consent; `pii_masked` flag; mask helpers (`•••• 4255`, `s••••@gmail.com`). **Product bug fixed during QA:** v1 masked phone/email unconditionally — fullPii was only consulted for birth details; a booking manager couldn't call a seeker back. Now fullPii passes phone/email through untouched (pinned by test) |
| `src/routes/v1/admin/inbox.ts` | REWRITTEN (—~570 lines net) — list/get/patch per kind with: server-enforced transition maps (UI mirrors, API is the gate), verify (stamps `verified_at/by`, required before close), assignee PATCH, `scheduled_for` ISO normalization, archive/unarchive + test-flag toggles, notes create/list, CSV export (`inbox.export` + `admin:export` 5/min + audited), PGRST103→200 empty-page mapping retained. **Live 500 fixed** (story review #6): puja list had selected the non-existent `preferred_date` — replaced with puja's real `date` column; puja tab gains gotra/location/language fields. **PII-search oracle closed** (finding 7): phone/email ILIKE restricted to `inbox.read_pii` holders; masked roles search name-only |
| `src/routes/v1/admin/stats.ts` | NEW — `GET /admin/stats`: 17 counts in one `Promise.all` (posts ×3, astrologers ×2, pujas, inbox new/older_24h/scheduled_today/closed_7d, subscribers ×2, media) — dashboard source of truth; gated `stats.read` (every role) |
| `src/routes/v1/admin.ts` | EDITED — `/admin/stats` route + inbox subtree capability gates per story; `inbox.read/read_pii/write/export` enforced server-side |
| `src/lib/audit.ts` usage | inbox audit trail: `<table>.export` (with count + filters), `<table>.read_pii` (every raw-PII detail read — finding 4), `<table>.update` (with `diffBeforeAfter`), `<table>.verify`, `request_notes.create` |

## Frontend repo (Astro-Frontend)

| File | Change |
|---|---|
| `src/pages/admin/index.astro` | REWRITTEN — 8 stat cards, every label states exactly what its number counts and links the pre-filtered list behind it (drafts → `?status=published` hint, older-24h → `?older_than=24h`, etc.); new-request **alert row** + toast + sidebar badge (review #3); quick actions (+ new post, review >24h); honest "unavailable" error states; hover affordance + inter-row gaps (Mary's audit) |
| `src/pages/admin/inbox.astro` | REWRITTEN (~660 lines) — 3 tabs (Consultations / Pooja requests / Messages) with per-tab status chips; role-aware search placeholder ("contacts hidden for your role" for masked roles); >24h / test / archived tags; **drawer**: fields + masked-PII display, Call/WhatsApp/mailto chips only when not masked, verify, transition buttons from the shared map (terminal states tagged), assignee select (fed from `/admin/requests/assignees`), schedule `datetime-local` (only in `scheduled`), archive/test toggles, notes thread + add; CSV export button (`inbox.export` and not messages); deep-link params (`?type/?status/?older_than=24h/?q`); honest error states both branches |
| `src/layouts/Admin.astro` | EDITED — sidebar inbox **badge** (`#inbox-badge`, count, hidden at 0) |
| `src/pages/admin/posts.astro` | EDITED — reads `?status=` into the status filter (dashboard deep-links) |
| all 12 admin pages | `logout` listener arity fix (`() => logout()` — Phase 1 added a `reason` param; astro check had gone stale) |

## Verification (pre-review gates, all green)

- Backend: `bun run typecheck` clean · `bun test` **449/449** across 37 files (31 new phase-2 tests pin: transition maps incl. ISO normalization, masking incl. the fullPii phone/email bugfix, viewer 403 matrix, name-only search for masked roles, URL-encoded PostgREST params, PGRST103 empty page, notes/validation, export CSV) · `bun run lint` (biome) clean.
- Frontend: `astro check` **0 errors / 0 warnings** · biome clean · `bun run build` complete · unit tests 5/5 · built admin pages verified in `dist` (badge present, `robots noindex` meta, `_headers` emitted).
