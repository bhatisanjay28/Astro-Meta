# BMAD story review — Phase 2 Dashboard + Inbox (2026-11-26)

**Verdict: CHANGES REQUIRED** (7×P1, 5×P2) — all folded into story.md §Review-amendments-log; build started only after the amendments.

## Findings (as delivered)

1. **P1 — `request_notes.request_id bigint` is factually wrong.** All three request tables use `id uuid primary key default gen_random_uuid()` (0001:75,189,278). Story/migration must say `request_id uuid` or the join breaks (AC 6).
2. **P1 — `inbox.closed_7d` has no source column.** Request tables have only `created_at`; nothing stamps close-time. Fix: add `closed_at timestamptz` to 0015, stamped by the transition handler on status→closed.
3. **P1 — Two Mary Phase-2 items dropped:** (a) success/error toasts globally; (b) new-request alert (badge + toast). Both added to frontend scope.
4. **P1 — audit action naming:** pin exact `<table>.<verb>` strings for verify / read_pii / notes / export; ACs assert them (see story audit table).
5. **P1 — filter param contradiction:** `include_test` vs `is_test` semantics defined in scope (default hide; include=true unhides; is_test=true only-flagged; archived=true|any).
6. **P1 — per-table date mismatch:** consultation `preferred_date`, puja `date`; the live `PUJA_REQUEST_COLUMNS` selects the non-existent `preferred_date` ⇒ **`GET /admin/requests?type=puja` 500s in production today** (verified against information_schema). Fix in this phase; puja tab also gains gotra/location/language.
7. **P1 — PII search oracle:** server-side ILIKE on phone/email lets masked roles probe existence. Phone/email search restricted to `inbox.read_pii` holders; masked roles: name-only (AC 3).
8. **P2 — `topic` filter undefined for puja:** consultation-only; puja tab filters by `puja_id`.
9. **P2 — `astrologers.unconsented` dropped:** deferred until the 0016 consent column.
10. **P2 — assignee substitution:** Mary said "assign-to-astrologer"; design of record assigns to staff (`admin_users`). Flagged as owner-visible; revisit if wanted.
11. **P2 — messages transition map:** defined (new→read|closed|cancelled; read→closed|cancelled; no verify gate) so AC 1 is evaluable.
12. **P2 — no functional UI ACs:** dashboard/inbox behaviors pinned as phase QA-sweep checks (story AC 8).

Reviewer verified against: 02 §Phase-2/§C/D1–D3, 03 §4/§9, phase-1 story/review/changes, `rbac.ts`, `admin/inbox.ts`, `rate-limit.ts`, `0001_schema_v1.sql`, staged `0015_inbox_workflow.sql`, live information_schema.
