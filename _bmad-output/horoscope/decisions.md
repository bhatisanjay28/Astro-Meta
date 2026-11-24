# Horoscope Upgrade — Decision log
**Project: Horoscope section upgrade · 5 gated steps · Started 2026-11-24**

## Step gates
| Step | Agent | Status |
|---|---|---|
| 1 Research & rule set | Mary | ✅ APPROVED by owner 2026-11-24 |
| 2 Content: style guide + library structure + 2-sign samples | Paige | ✅ APPROVED by owner 2026-11-24 ("continue") |
| 3 Design (Stitch MCP) | Sally | ✅ APPROVED by owner 2026-11-24 ("continue") |
| 4 Implementation | Barry/Amelia | ✅ SHIPPED 2026-11-24 — consent consumed by owner ("continue go ahead"); migration applied, backend `6966c7c` + frontend `59013ce` pushed & live on vyotish.com |
| 5 QA verification | Quinn | ✅ PASSED — live e2e vs vyotish.com: 72/72 payload pages, lucky card + axe 0 both themes (one transient CF-edge 500 during deploy propagation; independent 72-route curl sweep all 200 after) |

## Owner decisions (from research/README.md §"Decisions needing the owner")
**2026-11-24 — owner replied "go with defaults"; all defaults adopted:**
1. **Career + Money line**: ADDED to daily/weekly/monthly core (compact two-liner; all reference sites have it; engine scores already exist). Yearly already has full Career & Business areas.
2. **Lucky number**: SINGLE number v1 (no second "friendly number").
3. **"How we compute this" disclosure block**: YES — one plain-language details block per page (covers Moon-sign reference, Lahiri sidereal, mean nodes, vedha dampening, deity-mapping convention).
4. **Rating chips**: shown on monthly Best/Testing days + yearly month-by-month table only. Daily/weekly show text sections without numeric-looking scores.
5. **Sade Sati**: phase name + year range shown on yearly pages when Saturn is in 12/1/2/4/8 from the sign — gentle phrasing (effort/patience, never doom).
6. **P11 Jyotishi sign-off**: scope EXTENDED to cover generated horoscope content (gate before launch).

## Standing project rules (from the brief)
- Original content only; nothing copied from panchangbodh.com / astrotalk.com / astroarunpandit.org — similarity check required at content step and QA.
- Citations in research; UNVERIFIED items marked.
- Show plan + samples for approval at each stage; ≤3 clarifying questions.
- All 12 Vedic Moon signs × 4 periods (today/week/month/year) + yesterday/tomorrow variants (existing URLs).
- No fear tactics; health content general only (rest/routine/balance); disclaimer on every page; automation (cron, 7-day buffer, idempotent, fallback, validation, alerting, health endpoint, IST) lands at dev step.

## Step 4 implementation decisions (2026-11-24, dev)
1. **Migration 0013 is additive-only** (152 lines): `horoscope_library` table + partial active index, `horoscopes.payload jsonb`, `horoscope_run_log` table, 18 `content_blocks` rows (9 keys × en/hi) verbatim. Nothing dropped or altered — applied via Supabase MCP only after owner consent.
2. **Fallback-library mode**: Paige's ≈6,460-row phrase bank is NOT yet in the workspace (samples + structure spec only). `loadLibrary` sees an empty `horoscope_library` and the generator runs `fallbackForSlot` — 3 style-guide-compliant variants per slot×condition, EN+HI, marked `source: "fallback"` in the run log. Importing the real batches later needs **no code change** (same table, same picker). Flagged at the consent gate.
3. **Freshness / deploy hook**: frontend is static (build-time SSR of resolve-current). Backend cron pings the CF Pages deploy hook after a generation run with `published > 0`, gated on the `FRONTEND_DEPLOY_HOOK_URL` worker secret. **Until the owner creates the hook + sets the secret, live pages stay frozen at their last build** — a freshness regression vs today's client-fetch. Owner action required at consent gate.
4. **D4 chip interpretation (dev's own call, spec §8 flag 1)**: filled `HoroscopeChip`s appear ONLY on the yearly month-table rows (where space allows); daily/monthly category headings get a text-only bandmark (glyph + word, no fill). Owner can flip to strict D4 (filled chips everywhere) later without schema change.
5. **Lucky why-line sign names**: `params.sign` is the visitor-facing EN display name (`SIGN_EN`, "Aries") not the slug; Hindi renders `{{sign_hi}}` first. `LuckyBlock.why.params.sign` widened to `string` for the display map.
6. **Trust card / P11 tension**: sidebar Trust card says "reviewed by our Jyotishi panel" per the approved Sally spec, plus honest sub-line "Panel reviewer names are published with the launch." P11 sign-off is still pending — owner may want the claim softened until it lands. Flagged at consent gate.
7. **Pre-migration API guard**: the live worker predates Step 4 and returns no `date_key`; the page's `metaLine` fails soft to "Reading being prepared" and the e2e suite is mode-aware (passes 0/72 payload pre-migration and 72/72 post-migration), so deploys in either order stay green.
8. **Dress rehearsal without deploys**: `_bmad-output/horoscope/dev/hz-stub-api.ts` serves the exact resolve-current contract from REAL backend modules + migration 0013 payloads on localhost:8799 — full-payload frontend verified in-browser with zero DB writes and zero deploys. Scratch file, not shipped.
9. **QA gates green (backend)**: 392/392 unit, 55/55 horoscope suites, biome lint, tsc. **(frontend)**: lint, astro check 0 errors, build, e2e ALL PASS, axe 0 violations both themes × 3 pages, S20 alignment sweep 0 findings × 42 pages × 3 viewports, S19 dist sweep CLEAN.
10. **BMAD review**: REQUEST_CHANGES → all blockers fixed same-pass, re-gated green. Reviewer verdict (2026-11-24, QA persona, 12 findings): IST discipline, contract match, publish gate, security (no set:html/innerHTML, strict param allowlists), honest states, migration/upsert targets, tests all verified clean. Fixed: **P0** RLS added to `horoscope_library`/`horoscope_run_log` (0013 §E, deny-by-default, service-role-only — anon-key write surface was a content-injection vector); **P1** scheduled handler now uses `ctx.waitUntil` (fire-and-forget could kill a mid-run generation of ~800 snapshots); **P1** cron `35 18 * * *` (≈00:05 IST) added beside the panchang `15 0 * * *` (story's promised trigger was missing; stale "stays lazy" comment removed); **P2** legacy rolling fallback fetches daily rows for every tab (rolling rows exist as daily only); **P2** sample rows no longer wear a dated metaLine ("Sample reading — live readings are being prepared"); **P2** sadesati note drops hardcoded "(Sade Sati)" so Dhaiya/Ashtama years read correctly (card heading now family-aware: "Sade Sati" vs "Saturn's transit phase" — verified on Sagittarius, a Dhaiya year); **P2** resolve-current mapping now tested (+5 tests → 397 total); **P2** `lang="hi"` on h1 + picker Devanagari; **P2** `<details open>` per spec D3; **P2** swatch values regex-guarded before style-attr interpolation. Accepted-as-noted (P2, low impact): intra-batch daily variety blind spot (adjacent future days can share fallback text; prev-2-day rule can't see same-run siblings) and D-1 rows recomposed next-day run (yesterday tab only, FNV-stable same-day). Post-fix gates: backend 397/397 + lint + tsc; frontend lint + astro check 0 + build; e2e ALL PASS 72/72 payload; axe 0 both themes. ~~NOTHING COMMITTED — consent gate next.~~ → **Consent consumed 2026-11-24; shipped (see deploy record).**

## Deploy record (2026-11-24, in the consented order)
1. **Migration 0013 applied via Supabase MCP** — verified against the repo file row-by-row; one Hindi content_block text had drifted in the hand-typed MCP call ("मंत्र और देवता दिन के शासक") and was corrected in-DB via `jsonb_set` + re-verified (the repo file was always correct).
2. **Backend `9823d42..6966c7c` pushed** (Astro-Backend main) → CI deploy; live worker verified serving the new contract (`date_key` + migration blocks in resolve-current response).
3. **Generation run once via the cron code path** (scratch `hz-run-once.ts` → `runHoroscopeGeneration` with backend/.env creds): 336 rows with payload, 0 validation violations, ~4.8s; `horoscope_run_log` row confirmed (`source: "fallback"` — phrase bank not yet imported).
4. **Frontend `9baad1d..59013ce` pushed** (Astro-Frontend main) → Actions build green → CF Pages deploy live: `/horoscope/aries/daily/` serves the new build (`class="how" open`, 6 bandmarks, dated metaLine "24 November 2026" baked from real payloads).
5. **Quinn live verification** — `HZ_BASE=https://vyotish.com bun qa/e2e-horoscope.mjs`: **ALL PASS (72/72 payload pages)** + lucky card assertions + axe 0 violations × 3 pages × both themes; evidence shots refreshed. First attempt hit one transient `500` on `gemini/tomorrow` during deploy propagation; an independent 72-route curl sweep was all-200 immediately after, and the re-run passed clean.

**Still open (owner actions, unchanged):** ~~CF Pages deploy hook + `FRONTEND_DEPLOY_HOOK_URL` worker secret~~ → **CLOSED same day via Cloudflare API** (agent, with owner's connected token): Pages deploy hook `horoscope-cron` (branch `main`) created on the `vyotish` Pages project, secret `FRONTEND_DEPLOY_HOOK_URL` set on worker `astro-backend` (URL never echoed to chat), hook test-fired → deployment `efb2656d` entered `build/active` 18s later. From tonight's `18:35 UTC` cron onward, any generation with `published > 0` rebuilds vyotish.com automatically. Remaining: Paige's ≈6,460-row phrase-bank import (generator already consumes it with no code change); P11 Jyotishi sign-off vs the Trust-card claim.
