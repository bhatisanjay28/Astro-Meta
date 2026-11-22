# S19 — Visitor-facing copy sweep: no dev/placeholder text reaches visitors

**Owner directive (2026-11-22):** "Developer and placeholder text is visible to visitors… Visitors shouldn't see any of this, and the Supabase mention gives away our backend."

## 1. Audit — every leak, by source

### Frontend rendered markup (src)

| # | Location | Leaking text | Fix |
| --- | --- | --- | --- |
| 1 | `index.astro:201` hero kundli card | "Sample Kundli Lagna Chart" | "Janam Kundli — Lagna Chart" |
| 2 | `index.astro:346-351` astrologer directory | `[Sample Data for Phase 1 Local Review]` badge (driven by `ANY_SAMPLE_ASTRO`) | remove badge + flag |
| 3 | `index.astro:413` consultations section | "Phase 1 Consultation Model: Form submissions are saved to Supabase and routed to admin. Live chat… Phase 2." | visitor copy, no phases/backend |
| 4 | `index.astro:469` pooja cards | "Sample Dakshina" ×3 | "Dakshina" |
| 5 | `index.astro:513` gemstones tab | "Configured by GEMSTONES_SITE_URL. Once active…" | "Our dedicated gemstones store is launching soon." |
| 6 | `index.astro:528` blog section | "…written and reviewed through the Vyotish admin publication engine." | "Original research and classical commentary from the Team Vyotish scholars." |
| 7 | `BookingModal.astro:20` | "Saved securely to Supabase • Admin confirmed" | "Saved securely — used only to contact you about this request." |
| 8 | `BookingForm.astro:139` | "Saved securely to the Vyotish admin inbox — …" | same replacement (same leak class) |
| 9 | `consultations/[slug].astro:88-90` | "Sample profile for Phase 1 review — profiles are admin-managed…" (is_sample note; also leaks into `<meta description>` via `a.about.slice`) | remove note; DB about fix removes meta leak |
| 10 | `poojan/[slug].astro:75-77` | "Sample listing for Phase 1 review — the catalogue is admin-managed…" | remove note |
| 11 | `horoscope/[sign]/[period].astro:120,148` | "Sample content — admin-authored horoscopes replace these rolling notes (Epic 6.4)." appended under every reading (24/24 rows flagged) | remove branch + `sampleNote` var |
| 12 | `PanchangDetail.astro:108` | " (sample)" suffix on every festival (3/3 flagged) | remove suffix |
| 13 | `terms.astro:45` | "Phase 1 does not accept online payments…" | "Vyotish does not accept online payments at this time…" |

### Database (Supabase, rendered via APIs)

| # | Table.rows | Leaking text | Fix (MCP UPDATE) |
| --- | --- | --- | --- |
| 14 | `astrologers.about` ×3 active rows (Ananya Dave / Rakesh Mishra / Vidyadhar Shastri) | "SAMPLE DATA — replace with real astrologer profiles before launch (P8)." | visitor-appropriate bios per expertise |
| 15 | `pujas.purpose` ×3 | "…SAMPLE — respectful wording only… (PRD §5.6/§15)." / "SAMPLE DATA (P9)." ×2 | clean one-liners, dev suffix removed |
| 16 | `festivals.description` ×3 | "SAMPLE date — engine-verified in Epic 1 (P16)." / "SAMPLE DATA (P10)." ×2 | clean one-liners |

### Checked and clean
- Horoscope readings (overview/love/career/finance/health ×24) — no dev text. `pujas.description`/`muhurat_note`/`samagri`/`includes` — clean.
- `/gemstones` page copy — visitor-appropriate already. Legal `refund.astro` — no rendered phase text.
- Privacy policy naming Supabase/Cloudflare as processors — **kept deliberately**: DPDP processor disclosure is standard legal transparency, not a backend giveaway (owner can overrule).
- `astrologers` slug sample-astrologer-1/2/3 ("Sample Astrologer One/Two/Three") — `is_active=false`, never rendered; `about` cleaned anyway for hygiene.
- Dead code (TabStub, QuickKundli) — never rendered, untouched.
- `is_sample` DB flags stay true (admin-side truth); after this story NOTHING renders them publicly.

## 2. Acceptance criteria

- AC-1: No rendered page (EN, any viewport) contains: "Sample", "Phase 1", "Phase 2", "Supabase" (outside privacy policy), "GEMSTONES_SITE_URL", "Epic", "PRD", "(P9/P10/P16/P8)", "admin area", "admin-managed", "admin-authored", "publication engine", "(sample)".
- AC-2: Poojan/astrologer/horoscope/panchang pages render normally with their real content after the is_sample render paths are removed.
- AC-3: Astrologer `<meta description>` no longer contains the P8 note.
- AC-4: Booking flows unchanged functionally (copy-only changes around them).
- AC-5: DB updates via MCP land; frontend rebuild re-renders from clean data (build-time baked).

## 3. Guardrails
- Comments in code never render — untouched (minimal-change).
- The hero card IS an illustrative chart; renaming removes the dev-word, not the demo.
- No backend changes; no layout changes; copy-only + two render-path removals.
