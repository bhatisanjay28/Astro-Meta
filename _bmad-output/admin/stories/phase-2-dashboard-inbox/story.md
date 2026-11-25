# Phase 2 — Dashboard + Inbox workflow (Barry/Amelia build story)

**Date:** 2026-11-26 · **Status:** APPROVED-FOR-BUILD — review amendments 1–12 folded in (see §Review)
**Inputs:** 01-mary-audit.md (broken list), 02-mary-gap-analysis.md §Phase-2 + §C matrix, 03-winston-architecture.md §4 + §9, owner brief verbatim items, 04-sally-design mockups (inbox drawer, dashboard cards).

## Problem (owner + Mary)

1. **Dashboard lies**: card labels count the wrong sets (e.g. "posts" counts drafts+published mixed; "astrologers" counts inactive; "3 of 6 active"). No source-of-truth stats endpoint. Cards are links but have no affordance cue; missing inter-row gap; failed loads stall on "Loading…" forever.
2. **Inbox is a dead-end list**: status dropdown offers any value any time (closed rows can be re-opened to contacted/scheduled); no verification before closing (owner: "validate before closing so no re-open needed"); no detail view of birth details/consent; no notes; no assignee; no search/filters; no way to tell consultation vs pooja at a glance; QA test rows (S18, phone 9999999999) pollute the list; no `>24h` SLA signal for the site's "24–48h response" promise; no CSV export; messages lack `cancelled`.
3. **PII exposure**: content_editor and viewer currently receive full phone/email/birth details on inbox reads (02 §C: masked for those roles; `inbox.read_pii` = admin/booking_manager/super_admin).
4. **LIVE BUG (found by review, fixed in this phase)**: `GET /admin/requests?type=puja` 500s in production — the route selects `preferred_date`, which does not exist on `puja_requests` (its date column is `date`; it also carries `gotra`, `location`, `language` that the panel never surfaced).

## Scope — backend

1. **Migration `0015_inbox_workflow.sql`** (additive only; backup snapshot taken first):
   - `consultation_requests` + `puja_requests`: CHECK widen to `('new','contacted','scheduled','completed','closed','cancelled')`; new columns `scheduled_for timestamptz`, `assignee_id uuid null` (→ `admin_users.user_id` — **staff assignment**, an owner-visible substitution of Mary's "assign-to-astrologer": the panel assigns to staff members; astrologer assignment would need the existing `astrologer_id` FK and lands later if wanted), `is_test boolean not null default false`, `archived_at timestamptz null`, `verified_at timestamptz null`, `verified_by uuid null`, `closed_reason text null`, **`closed_at timestamptz null`** (stamped by the transition handler on status→closed — gives `closed_7d` a real source).
   - `contact_messages`: widen to `('new','read','closed','cancelled')` + `is_test`, `archived_at`.
   - New table `request_notes (id bigserial, request_kind text, request_id uuid, author_id uuid, body text, created_at)` with staff-read/write RLS (floor ≥3) — audit_log-style policies via `admin_role_rank`. **request ids are UUID (verified live), not bigint as Winston §4 first sketched.**
   - Backfill `is_test = true where phone = '9999999999'` (flagging ≠ deletion; **purge stays owner-gated, D2**).
2. **`src/lib/inbox-flow.ts`** — transition maps (Winston §4 + review #11):
   - Requests: `new → contacted|scheduled|cancelled|closed(verify)`, `contacted → scheduled|completed|cancelled|closed(verify)`, `scheduled → completed|cancelled|closed(verify)`, `completed → closed(verify)|scheduled (reopen only pre-verification)`, `closed|cancelled → ∅ terminal`. Reschedule = `PATCH scheduled_for` while `scheduled` (same-status PATCH is a no-op, allowed). **Closed requires `verified_at` else 409 "Verify this request before closing it."; a verified request can never reopen.**
   - Messages: `new → read|closed|cancelled`, `read → closed|cancelled`, `closed|cancelled → ∅`. No verification gate for messages.
3. **Routes** (all behind existing `inbox.read`/`inbox.write` subtree gates):
   - `GET /admin/requests` — `type` consultation|puja; **per-table date-column map**: consultation `preferred_date`, puja `date` (review #6). Search: **name-only for roles without `inbox.read_pii`; name+phone+email ILIKE for read_pii holders** (review #7 — otherwise masked roles get a phone-existence oracle). Filters: `status`, `date_from`/`date_to` (per-table column), `topic` (consultation only; puja tab filters by `puja_id` instead — review #8), `older_than=24h`. **Test/archive semantics (review #5): default hides `is_test` rows and archived rows; `include_test=true` shows flagged rows in the default view; `is_test=true` returns only flagged rows (implies include); `archived=true` only archived, `archived=any` both, default false.**
   - `GET /admin/requests/:id` — drawer payload: every submitted field **per table's real columns** (consultation: birth_details [jsonb] only with `inbox.read_pii` **and** consent; puja: gotra/location/language included), notes thread, assignee, verify/close metadata.
   - `PATCH /admin/requests/:id` — validates via transition map; accepts `status`, `scheduled_for`, `assignee_id`, `archived`, `is_test`, `closed_reason`; stamps `closed_at` on entering closed; audited.
   - `POST /admin/requests/:id/verify` — stamps `verified_at/by`, idempotent; audited.
   - `POST /admin/requests/:id/notes` — append note; notes included in detail GET; audited.
   - `GET /admin/requests/export.csv` — same filters (full PII regardless of caller role; the export itself is the PII grant) + `inbox.export` + `admin:export` rate limit + audit.
   - `PATCH /admin/messages/:id` — `status` via message map + `archived`/`is_test`.
   - Fix `PUJA_REQUEST_COLUMNS` to the real columns (review #6 / Problem 4).
4. **`GET /admin/stats`** (`stats.read`) — `{posts:{published,draft,trashed}, astrologers:{active,inactive}, pujas:{active}, inbox:{new,older_24h,scheduled_today,closed_7d}, subscribers:{confirmed,unsubscribed}, media:{count}}`. `closed_7d` = `closed_at >= now()-7d` (review #2). `astrologers.unconsented` (Winston §9) **deferred until the consent column lands (0016)** — review #9. Counts only, no PII; failed count ⇒ 500, never a silent 0.
5. **PII masking** (`src/lib/mask.ts`): on inbox reads (list + detail), mask `phone` (`•••• 4255`), `email` (`s••••@gmail.com`), omit `birth_details` unless the caller holds `inbox.read_pii` (birth details additionally require consent on consultation rows; puja/contact have no birth fields). Responses carry `pii_masked: true` when anything was withheld. **Detail reads that return full PII write `inbox.read_pii` audit actions (review #4 naming below).** CSV export always full PII + audited.

### Audit action names (review #4 — `<table>.<verb>` convention pinned)

| Event | Action |
|---|---|
| status/flag/assignee/reschedule changes | `consultation_requests.update` / `puja_requests.update` / `contact_messages.update` (existing) |
| verification stamp | `consultation_requests.verify` / `puja_requests.verify` |
| PII-unmasked detail read | `consultation_requests.read_pii` / `puja_requests.read_pii` / `contact_messages.read_pii` |
| note added | `request_notes.create` |
| CSV export | `consultation_requests.export` / `puja_requests.export` |

## Scope — frontend

1. **Dashboard rebuild** (`/admin`): `/admin/stats` cards with corrected labels ("Published posts", "Active astrologers"…), clickable with hover affordance, **new-request alert = dashboard alert row (new + >24h counts) linking into the pre-filtered inbox + toast on load when new > 0 + sidebar inbox badge with the new count** (review #3: Mary's badge+toast), `>24h` alert row linking to `older_than=24h` inbox view, quick actions (New post, Open inbox), honest error/empty states (no eternal "Loading…"), inter-row gap fix, **success/error toast feedback on every async action in the panel** (review #3; the shared `toast()` is the vehicle — pages that mutate without feedback get fixed).
2. **Inbox rebuild** (`/admin/inbox`): tabs Consultations / Pooja requests / Messages; search box (read_pii roles: name/phone/email; masked roles: name-only — UI hints accordingly); status chips; `>24h` badge; `test` + `archived` tags; row click → **detail drawer** (Sally mockup): all fields (per table), click-to-call / click-to-WhatsApp links, notes thread + add-note, assignee select (staff accounts), Verify button (disabled once terminal), status buttons rendered from the transition map (terminal rows show "terminal"), reschedule datetime input when scheduled, archive + test-flag toggles. Masked PII renders as masked for non-PII roles. **Puja tab shows gotra/location/language/date (fixes the live 500).**
3. Export button on requests tabs (CSV download like settings export pattern).

## Deferrals (explicit)

- **Email notify on new request** — blocked on owner secret `RESEND_API_KEY` (Winston A2); route shape reserved, no stub shipped.
- Purge of flagged test rows — owner decision D2.
- Assign-to-astrologer (instead of staff) — owner-visible substitution flagged in §Scope; revisit if wanted.
- `astrologers.unconsented` stat — waits for the 0016 consent column.
- Assignment notification emails, SLA auto-escalation — later phases.

## Acceptance criteria

1. Transition maps enforced server-side (requests AND messages): every off-map transition → 409; closed/cancelled accepted as source from no state; message `new→read|closed|cancelled` and `read→closed|cancelled` work, nothing else does.
2. `PATCH status=closed` without verify → 409 "Verify this request before closing it."; after `POST …/verify`, close succeeds, stamps `verified_at`/`verified_by`/`closed_at`, and audit rows carry exactly `consultation_requests.verify` then `consultation_requests.update`.
3. `content_editor`/`viewer` list+detail reads contain no raw phone/email/birth_details (`pii_masked: true` present); `booking_manager`/`admin`/`super_admin` receive full PII and the detail read writes exactly `<table>.read_pii`. Search on phone/email for masked roles returns 400 (name-only).
4. `GET /admin/stats` numbers match table reality (tests pin posts published/draft/trashed, astrologers active/inactive, inbox new/older_24h/closed_7d via closed_at).
5. Filters per §Scope 3 semantics: default hides test+archived; `include_test=true` unhides; `is_test=true` only-flagged; date filters hit `preferred_date` (consultation) and `date` (puja); `type=puja` listing succeeds against the real columns (regression for the live 500); export respects the same filters, is audited (`<table>.export`), rate-limited 5/min.
6. Reschedule keeps status `scheduled`, records old→new `scheduled_for` in audit; notes round-trip (`request_notes.create` audited); verify is idempotent; `closed_at` set on close, untouched otherwise.
7. Permission tests for all 5 roles on every new endpoint (403 matrix), legacy-role fail-safe retained.
8. Full suite green + lint; frontend `astro check` 0 errors, biome clean, build passes. **UI checks pinned for the phase QA sweep** (review #12): dashboard card counts equal `/admin/stats` values and each card links to its pre-filtered list; `>24h` row renders for an aged unresolved fixture and links through; drawer renders masked PII for a masked-role fixture and full PII for a read_pii fixture; puja tab lists rows.

## Review amendments log

BMAD story review 2026-11-26: CHANGES REQUIRED (7×P1, 5×P2) → all folded in above: #1 uuid pk ✓(§Scope1), #2 `closed_at` column + stats source ✓, #3 toasts + badge/toast alert ✓, #4 audit-action table ✓ (ACs 2/3/5 assert exact strings), #5 test/archive param semantics ✓, #6 per-table date map + real puja columns (+ live-500 disclosure in Problem 4) ✓, #7 PII-gated search ✓ (+AC 3), #8 topic-vs-puja_id ✓, #9 unconsented deferral ✓, #10 assignee substitution flagged ✓, #11 message map ✓, #12 UI sweep checks pinned ✓. Verdict after amendments: build-ready.
