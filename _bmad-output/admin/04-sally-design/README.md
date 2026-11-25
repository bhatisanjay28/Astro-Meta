# Sally — Admin Redesign (04)

2026-11-26. **Stitch is unavailable again today** (project `15718691526906326657` created OK; design-system endpoint returns "invalid argument" on every payload shape; `generate_screen_from_text` accepted the job but list_screens stayed empty across 3 polls / ~3 min — same failure signature as 2026-11-24). Per your instruction, fell back to **HTML mock-ups**.

## Deliverables
- `mockups.html` — self-contained (no CDN/JS deps; open in any browser): design tokens, shared component library, and all 13 in-scope screens with realistic sample data, including the Inbox detail drawer and a mobile stacked-cards sample. Dark+gold brand preserved on the existing `--a-*` palette.

## Key design decisions (dev implements these)
1. **Tokens**: secondary text bumped `#9b8f7a` → `#b3a68c` (12px minimum; audit showed AA-pass but weak at 11px). Spacing scale locked to 4/8/12/16/24/32. New status-pill palette carries meaning (colour per state — today `contacted/scheduled/closed` are all identical green).
2. **Status pills**: request `new`=gold · `contacted`=blue · `scheduled`=violet · `completed`=green · `closed`=neutral · `cancelled`=red; post `draft`=grey · `in_review`=blue · `scheduled`=amber · `published`=green · `archived`=neutral.
3. **Sidebar**: 240px, four grouped sections with line icons (Content / Catalogue / Inbox & Leads / Settings & Access), Inbox badge for new requests, footer = avatar + name + role chip + Sign out. Drawer under 800px.
4. **Dashboard**: clickable stat cards with hover lift + gold hairline + chevron; SLA alert banner (>24 h); recent-activity feed; quick actions.
5. **Inbox**: type chip per row (Consultation/Pooja/Message), SLA badge, tel/WhatsApp/mail quick icons, current-status pill, detail drawer (all fields, notes thread, assignee, verify→close sequence, terminal states have no forward options), test/archived filters.
6. **Tables**: sticky header, inline row actions, pagination footer, bulk-select bar, URL-state filters (live), stacked cards on mobile.
7. **Forms**: settings rendered as grouped cards with per-setting description + last-changed line; Engine section visually locked (gold lock, "Super Admin only"); styled dropzone for uploads; markdown toolbar + live preview + EN/HI tabs in the editor.
8. **Feedback**: toast bottom-right, styled confirm dialogs that name the entity, unsaved-changes guard, fetch-error state (never an eternal "Loading…").

## Mapping to backlog
Components → every phase. Dashboard/Inbox → Phase 2. Posts/Taxonomy/Media → Phase 3. Catalog/Settings/Subscribers/Users/Audit/Nav → Phase 4. Mobile behaviour → global kit.

Stitch regeneration can be re-attempted later; the project shell exists (`projects/15718691526906326657`).
