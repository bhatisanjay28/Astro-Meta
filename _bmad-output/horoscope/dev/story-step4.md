# Story H-STEP4 — Horoscope automation: generator, cron, storage, SSR
**Horoscope Upgrade · Step 4 (dev) · 2026-11-24 · consumes [ruleset](../research/03-ruleset.md) + [library-structure](../content/library-structure.md) + [spec](../design/horoscope-spec.md) · feeds Step 5 (Quinn)**

## Story

**As** a vyotish.com visitor **I want** each horoscope page (`/horoscope/{sign}/{period}`, 12 signs × 6 periods) to show real, dated, computed rashiphal content — ratings, categories, lucky attributions, Do's & Don'ts, monthly best/testing days + sky block, yearly areas + month table — **so that** the pages stop showing the "Fetching rashiphal…" sample placeholder and instead render honest, original, computed content every day without a redeploy.

## Scope (maps the 8 automation requirements from 04-existing-code-review.md)

| # | Requirement | Implementation |
|---|---|---|
| 1 | Generator | `backend/src/horoscope/*` — rules tables + scorer (favorability/vedha/retro/Sade-Sati modifiers/boosts), period aggregation (daily/weekly Mon–Sun/monthly day-mean/yearly 12-month), lucky attribution (precedence §5), condition keys, library selection (FNV1a64 + 2-day no-repeat + fallback), payload composition, validator |
| 2 | Storage | Migration `0013_horoscope_automation.sql`: `horoscope_library` table, `horoscope_run_log`, `horoscopes.payload jsonb` (additive), fixed-string `content_blocks` (`horoscope.*`); starter library seed (import script + samples-derived rows) |
| 3 | Cron | `src/cron.ts` gains `generateHoroscopes(env)` — daily 00:05 IST equivalent (Worker cron trigger ≈18:35 UTC), 7-day buffer (dated `date_key` rows; weekly/monthly/yearly current-window rows), idempotent upsert on `(sign, period, date_key, lang)` |
| 4 | Fallback | Missing library cell → per-slot-family fallback templates (style-guide-compliant, 3 variants per band, hash-selected so the §10 variety rule still passes); sky/month-table/best-days = pure data (always real) |
| 5 | Validation | Ruleset §10 rules 1–7 as `validatePayload()`; failures → run-log `status='failed'` + row-level reasons; failed rows are NOT published (stay `draft`) |
| 6 | Alerting | Run-log table + `/health` reports last run (`ok|failed`, when, counts) + console.error (Worker logs). No email/Slack exists — flagged as fast-follow (owner note) |
| 7 | Health endpoint | `/health` extension per #6 |
| 8 | IST | All date math via IST boundaries (reuse istDate pattern from Step 2 tooling; weekly window = Mon–Sun IST; `date_key` = IST date) |

Plus: **API** `GET /api/v1/horoscope` serves dated payloads — new `resolve=current` mode returns the current-window row per period (server-side IST resolution) with `payload` + legacy-column fallback chain (rolling sample rows remain the last resort so today's live behavior never regresses). **Frontend**: `HoroscopeDetail.astro` family + `--rating-good/moderate` tokens; `[sign]/[period].astro` renders build-time-fetched payload HTML (spec §1–§7); fail-soft honest line only when nothing exists.

## Non-goals (v1, each flagged for owner/fast-follow)

- Full 6,460-row library (Paige batches; pipeline ships with starter seed + fallback; P11 gates content pre-launch)
- Admin library editor UI (library editable via import script + Supabase; UI fast-follow)
- Email/Slack alerting (run-log + health now), festivals in sky block (engine has festivals DB — join later)

## Acceptance criteria

1. `bun run test` green — new tests: scorer golden cases (vedha dampening, retro demotion, Sade Sati modifiers, Jupiter-H1 boost, rating bands), weekly/monthly aggregation, lucky precedence incl. Ketu-direction exclusion, FNV selection determinism + no-repeat dodge, validator rules, payload shapes for all 4 periods, API resolve=current mapping.
2. Generator run (local, against Supabase) produces 12 signs × 6 periods × 2 langs dated rows for the 7-day buffer, idempotent re-run changes nothing, validator passes, run-log rows written.
3. Frontend `astro build` renders payload content into all 72 pages; zero client fetch for primary content; chips word+glyph+colour; disclosure + disclaimer on every page; both themes; `astro check` adds no new errors.
4. e2e: 12 signs × 4 periods screenshot/axe sweep on built pages.
5. BMAD review clean before any commit; push/deploy consent-gated (backend CI deploys Worker; frontend push deploys site).

## BMAD review (pre-build)

- **Wiring**: engine primitives all exist (`planetaryPositions`, mean nodes, panchang); generator is pure composition over them — no ephemeris changes. ✔
- **Contract safety**: `payload jsonb` additive; API keeps legacy columns; rolling sample rows stay last-resort → no regression path for today's live behavior. ✔
- **Idempotency**: unique key `(sign, period, date_key, lang)` pre-exists; upsert only. Run-log is append-only. ✔
- **Originality**: all prose either Paige-authored library rows or fixed templates; variety rule §10.5 enforced by validator. ✔
- **Risk accepted**: fallback prose is repetitive across signs until batches land (same condition + template pool) — mitigated by hash-spread over 3 variants; flagged in launch notes.
- **IST**: no `new Date().toISOString()` for date keys in generator paths — istDate only. (2026-11-21 QA sweep proven pattern.)
