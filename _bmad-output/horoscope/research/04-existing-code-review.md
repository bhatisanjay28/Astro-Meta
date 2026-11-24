# Mary (Analyst) — Research 4: Existing code & data — what can be reused
**Horoscope Upgrade · Step 1 of 5 · 2026-11-24**

Bottom line: **the engine and the page shells both exist; the generator that connects them does not.** This project is a "content + automation" build on top of working infrastructure — not a from-scratch build. One schema extension and one new cron pipeline are the real surface area.

---

## 1. What already exists and will be REUSED

### Backend — engine (all sidereal, Lahiri computed, IST-safe; `backend/src/engine/`)
| Capability | Where | Reuse verdict |
|---|---|---|
| 9-graha sidereal positions + retrograde flags | `engine/kundli.ts` `planetaryPositions()` (line 106); Rahu/Ketu mean nodes `engine/nodes.ts`; retro via `isRetrograde()` (line 79) | ✅ **directly feeds the rule set's `snapshot(D)`** |
| Lahiri ayanamsha (computed, ±0.5′ 1900–2100) | `engine/ayanamsha.ts` (lines 11–26) | ✅ |
| Full panchang: tithi/nakshatra/yoga/karana windows, sunrise/sunset vedic day, Rahu Kaal etc., Hindu month, Samvat, active-limb picking | `engine/panchang.ts` `computePanchang()` (line 233), `engine/finders.ts` bisection, `zonedStartOfDay()` (lines 114–146, DST-safe IANA) | ✅ sky-block + daily inputs |
| Moon phase, next new/full | `engine/calculators.ts` (`moonPhaseDetails` line 67) | ✅ monthly lunations |
| `sadeSati()` | `engine/transits.ts` | ✅ yearly Saturn phases (rule set §4.3) |
| Raw transits endpoint (9 grahas, signs, nakshatras) | `routes/v1/calculators.ts:325–356` | ✅ pattern reference |

**Missing at the engine layer** (net-new, small): a **gochara evaluator** (house-from-sign per planet + favorability/vedha scoring per rule set `03` §2–4); planet-sign **ingress finder** for monthly sky block (bisection infrastructure in `finders.ts` already supports it); retrograde **station dates** (same bisection on the retro flag). Sun/Moon "retrograde" hardcoded false is correct; nodes mean-only is acceptable for horoscopes (disclose on the how-it-works block).

### Backend — data & API
| Capability | Where | Verdict |
|---|---|---|
| `horoscopes` table: sign/period/date_key/lang/sections/status/publish_at/is_sample, **unique(sign,period,date_key,lang)** → idempotency built in | `supabase/migrations/0001_schema_v1.sql:96–117` | ✅ core table; needs an **additive migration** for new sections (education, dos, donts, lucky_colour/number/direction, mantra, thought, deity, ratings/meta jsonb) — columns or a payload jsonb; decision at dev step |
| `GET /api/v1/horoscope?period&lang&sign` public read (`status=published`) | `routes/v1/horoscope.ts` | ✅ keep contract, extend response shape |
| Admin CRUD `/admin/horoscopes` + admin UI `frontend/src/pages/admin/horoscopes.astro` | `routes/v1/admin/horoscopes.ts` | ✅ extends naturally to new sections + dated rows (editable structured content = automation req) |
| Seed pattern + evergreen fallback rows (`date_key='rolling'`) | `migrations/0003_seed_horoscopes.sql` | ✅ becomes the **fallback layer** (automation req #4: latest-valid/evergreen with date label) |
| **Cron + idempotent upsert + prune pattern** | `src/cron.ts` `warmPanchangCache()` (chunked, `merge-duplicates`, per-item error logging), `wrangler.jsonc` `triggers.crons` (currently `15 0 * * *` UTC), `index.ts` `scheduled` handler | ✅ the exact pattern the horoscope job copies (same backend, per DECISIONS.md line 28) |
| Write-through cache pattern (`panchang_cache` pk(city,date), payload jsonb, meta cache hit/miss) | `lib/panchang-cache.ts`, `routes/v1/panchang.ts:74–95` | ✅ model for a `horoscope GET` fast path if needed; dated-row reads are already cheap |
| `/health` endpoint | `routes/health.ts` | ✅ extend with `last_run`/`published_date` fields (health-check req #6); no alerting exists today — email/Slack alert is net-new |

### Frontend
| Capability | Where | Verdict |
|---|---|---|
| 72 pages `/horoscope/{sign}/{period}/` (12 × yesterday/daily/tomorrow/weekly/monthly/yearly) + hub | `pages/horoscope/[sign]/[period].astro`, `index.astro` | ✅ URL structure preserved; shells upgraded |
| **Static shell + data hooks + inline island + URL-state pattern** (the strongest in-house template) | `components/PanchangDetail.astro` (284 lines), panchang calendar island | ✅ the template for new horoscope rendering |
| Sign config incl. symbols + Hindi names | `SIGNS` arrays (duplicated 6×: horoscope index, [period] page, `HomeHoroscope.astro`, `lib/zodiac-signs.ts`, `navigation.ts`, `sitemap.xml.ts`) | ✅ reuse; **consolidate to `lib/zodiac-signs.ts`** during dev (flagged cleanup) |
| `lang=hi` API support + Devanagari fonts (Noto Sans Devanagari + Poppins devanagari subsets, self-hosted) + hreflang machinery in `Base.astro` | `routes/v1/horoscope.ts` lang param; `styles/fonts.css`; `Base.astro` lang/langPath | ✅ Hindi is data-ready; page-level HI experience is a design-step decision |
| Tokens (`--bg-raised`, `--radius-card`, auspicious/inauspicious status colours, dark mode via `data-theme` + `.dark`) | `styles/tokens.css`, `tailwind.css @theme`, `Base.astro` bootstrap | ✅ Sally designs against these |
| Tabs precedent (`HomeHoroscope` role=tablist), chips, native `<details>` accordions, block-renderer B1–B5 spec | `HomeHoroscope.astro:49–65`, `calculator-renderer.ts` | ✅ candidates for period tabs / rating chips / section cards |
| QA harness: playwright-core `channel:"chrome"`, axe injection, consent dismissal, screenshots | meta repo `qa/*.mjs` | ✅ Quinn reuses directly; no horoscope e2e exists yet (new suite) |
| SEO: `Base.astro` canonical/OG/JSON-LD prop; hand-rolled `sitemap.xml.ts` already loops the 72 pages | `Base.astro:57–90`, `pages/sitemap.xml.ts:103` | ✅ add JSON-LD to horoscope pages; sitemap already covers them |

### Planning docs already on record
- `docs/DECISIONS.md` **D12** API-first (all logic in backend, all data in Supabase, thin frontend) — binds the generator to the backend, content to DB.
- `docs/DECISIONS.md` line 28: "Scheduled jobs (daily Panchang/**horoscope refresh**, panchang_cache pruning) are Workers Cron Triggers within the same backend project" — the architecture is pre-decided; we're building the reserved slot.
- Epic 5.1 ✅ / Epic 6.4 ✅ recorded the runtime-API-text design and admin CRUD.
- Launch blockers **P8/P9/P10/P17** (sample-data removal) currently gate the evergreen `rolling` seed rows — the dated-row automation is what finally unblocks them.

## 2. Gaps this project must fill (net-new work)

1. **Generator** (backend): rule-set engine (`03-ruleset.md`) → produces full per-sign per-period rows for all langs. Biggest single item.
2. **Content library** (DB, editable): phrase banks per condition key (`03` §7) + fixed monthly/yearly texts for 12 signs × 2 langs — Paige's deliverable, stored as structured rows (reviewable without code).
3. **Cron jobs**: daily 00:05 IST (≈ 18:35 UTC — note the existing panchang cron is 00:15 UTC; horoscope job gets its own trigger), Sunday-night weekly, 5-days-before-month-end monthly, in-advance yearly. Buffered ≥7 days ahead, idempotent (unique key already exists), run-log table.
4. **Validation + alerting + health**: pre-publish validator (rule set §10), failure alerting (net-new — no email/Slack wiring exists), `/health` extension.
5. **Frontend rendering**: replace "Fetching … rashiphal…" placeholders with server-visible content. Since the frontend builds static, the honest options are (a) build-time fetch of published rows + (b) runtime fail-soft island refresh — the PanchangDetail pattern already solves exactly this; final call at design step.
6. **IST date boundary**: panchang route currently defaults to **UTC date** (known nit); the horoscope job must use IST boundaries (req #7) — `zonedStartOfDay()` already provides the primitive.
7. **Schema extension migration** + backfill of new sections; admin editor field updates.
8. **Hindi page experience**: rows exist in `lang=hi`; frontend needs the in-page language decision (design step) — note hreflang rule: never emit `/hi/*` hreflang for pages that don't exist.

## 3. Risks / constraints found

- **P11 (Jyotishi sign-off)** is an open owner gate for segment tables; horoscope content is new content and should be added to that review gate's scope (or explicitly waived) before launch.
- Sample `rolling` rows (P8/P9/P10/P17) are what users see today via the runtime fetch — until automation ships, the fallback chain must keep them working (or the fallback order changes deliberately).
- Frontend CI has 7 pre-existing `astro-check` errors (S18 follow-up) — dev step must not add more and ideally not depend on them.
- No edge caching exists; 12×4-period dated reads per page are fine, but the design step should confirm whether period pages fetch one sign or all 12 (today: per-sign fetch on sign pages, all-12 on home).
