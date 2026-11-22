# Story ZC-1 (master) — Zodiac Sign Compatibility: research → content → design → build

> Written by Bob (SM) via orchestrator, 2026-11-22 · Enriched 2026-11-22 from Mary's research (`../research/`) + owner gate decisions.
> **BMAD review: APPROVED (self, 2026-11-22)** — owner decisions recorded (6+Tips, 35–95, hub+78 pages); ACs map 1:1 to research findings and site conventions (D12 thin renderer, no-PII, P11 verified:false); additive surface only; no contract breaks.
> Reference site (structure study ONLY, no content reuse): astrotalk.com/compatibility.

## Story

**As the** owner of Vyotish, **I want** a new "Zodiac Sign Compatibility" section in the Astrology area where a user picks their own sign and their partner's sign and sees how compatible the two signs are — an overall score/band, one card per category with a short original explanation, and relationship tips — **so that** we offer the popular sun-sign compatibility experience with fully original content, honest framing, and stronger trust signals than competitors.

**Why now:** owner directive 2026-11-22 (full pipeline: Mary research → Paige content → Sally design → Dev build). Prior art on site: `/matching` (Vedic Ashtakoota) exists; this is the Western sun-sign sibling.

## Owner decisions (G1 gate, 2026-11-22 — CONFIRMED)

1. **Categories:** 6 scored cards — **Love, Sexual, Friendship, Communication, Trust, Emotional** — plus text-only **Relationship Tips**, under an **overall score + band** (Mary's recommendation adopted; Marriage/Family/Values/Shared-Activities/Work explicitly not added per research §4.4).
2. **Score scale:** **35–95 honest range** with a one-line method note (no fake 0/100 extremes); band labels Excellent / Strong / Mixed / Challenging / Very challenging per `../research/pair-matrix.md` §2.
3. **URLs:** hub page `/compatibility` (selectors + intro) **plus 78 static pair pages** `/compatibility/{sign1}/{sign2}` (canonical unique pair, wheel-order sorted; mirrored order renders the same record with reordered labels).

Standing adoption: per-category score offsets from `../research/pair-matrix.md` §7 as v1 (deterministic, clamped 35–95); analyst open items 4–5 (CTA slot, Hindi) deferred — design includes a neutral slot placeholder, no Hindi scope in this epic.

## Pipeline (this epic)

1. **Mary (Analyst)** — DONE: `../research/mary-research.md` + `pair-matrix.md` (78-unique-pair deterministic scoring basis, §7 category offsets) + `astrotalk-comparison.md` (gaps: FAQ, breadcrumbs, method page — all S/M) + `sources.md` (full register; 10+ fetched sources; tables verified ×2 sources).
2. **Owner gate G1** — DONE (decisions above).
3. **Paige (Writer)** — original content for 78 unique pairs × (overall verdict + 6 category explanations + tips) ≈ 624 blocks; style guide + exemplar first, then parallel batches; validation gates AC-Q1/Q2.
4. **Sally (UX)** — hub + pair-result design in Stitch, mapped to site tokens.
5. **Dev** — backend scoring module + data + API + tests; frontend hub + 78 pair pages + e2e.
6. **QA sweep + BMAD code review** — before any commit (consent-gated push per operating rules).

## Scope

- **Backend** (`Astro-Backend`): new scoring engine module + pair-content data modules + 2 routes; no changes to existing endpoints.
- **Frontend** (`Astro-Frontend`): hub `/compatibility` + 78 static pair pages (shared template) + Astrology-hub card + sitemap entries; no NAV_TABS change.
- **Data**: 78 unique pairs (12 same-sign + 66 off-diagonal) cover all 144 ordered pairings by symmetry; content stored as structured, editable JSON/TS modules in the backend; all served via API (D12 thin renderer).

## Acceptance criteria

### AC-B1 — Scoring engine (backend)
`src/engine/sign-compatibility.ts` encodes the deterministic model exactly per `../research/pair-matrix.md`: sign index table (§1.1), aspect by index difference (§1.2), dignity table (§1.3), score formula (§2: aspect base + element modifier + bounded dignity modifier → band), same-sign = Strong 80 (§2.6), opposition ruling (§6: aspect dominates, element moderates +3). Exports per-pair: overall score, band, aspect/element/modality/polarity/ruler facts (for display), per-category scores via §7 offsets (clamped 35–95). `verified:false` flag on verdicts (P11 convention).

### AC-B2 — Pair content data (backend, editable)
78 pair records under `src/data/sign-compatibility/` (JSON, one file per lower-index sign: `aries.json` holds aries-aries … aries-pisces). Each record: pair slug, overall verdict line (1–2 sentences), 6 category explanations (2–4 sentences each), relationship tips (4–6 short lines). Every record keyed by canonical slug; a loader joins content to engine facts; missing-pair keys fail loudly (no runtime fallbacks).

### AC-B3 — API routes (backend, D12)
- `GET /api/v1/compatibility/signs` — 12 signs (slug, name, element, modality, ruler, approximate dates, sanskrit name) for selectors/hubs.
- `GET /api/v1/compatibility/signs/pair?sign1={slug}&sign2={slug}` — canonicalised symmetric result: overall (score, band, verdict), facts block, categories (6 × {key, label, score, explanation}), tips[], disclaimer + method note, `verified:false`. Same sign allowed. Unknown/missing sign → 400 with plain message.
- Mounted in `src/app.ts`; added to `v1.ts` implemented list.

### AC-B4 — Backend tests
- Completeness: all **144 ordered combinations** resolve; 78 unique records exist with non-empty text everywhere; symmetry invariant (pair(A,B) ≡ pair(B,A) except echo fields).
- Score invariants: same-sign pairs = 80/Strong; the 3 "Very challenging" and 6 "Mixed" rows match `pair-matrix.md` §4–§5 distribution (Excellent 10 / Strong 26 / Mixed 6 / Challenging 33 / Very challenging 3); all scores within 35–95; category scores respect §7 offsets.
- Route tests: valid pair, reversed pair (same payload), unknown sign → 400, missing params → 400, same-sign allowed.

### AC-F1 — Frontend hub `/compatibility` (thin renderer)
- Two sign selectors (own + partner — same sign selectable), "Check Compatibility" button → navigates to the pair page (prefilled selectors there too); intro copy (original), entry card on `/astrology` hub (SECTIONS), sitemap entry, original meta title/description.

### AC-F2 — Frontend pair pages `/compatibility/{sign1}/{sign2}` (78, shared template)
- `getStaticPaths` from the canonical slug list; client fetch of the pair API (thin renderer preserved).
- Result layout: overall score + band + verdict; facts chips (elements/modalities/aspect/rulers); 6 category cards (score + short explanation); tips card; inline "guidance and entertainment" disclaimer + method note; breadcrumbs (hub → sign1 hub? v1: hub → pair); `verified:false` flag surfaced per site convention.
- Mirrored order (`/compatibility/taurus/aries`) renders the same record with own/partner labels swapped; canonical link points to the wheel-order page.
- Light + dark themes via tokens.css; AA contrast strict harness; mobile + desktop aligned.

### AC-F3 — Frontend e2e
- Hub → select two signs → lands on pair page → result renders (score, band, 6 cards, tips, disclaimer); reversed path renders mirrored labels; same-sign path works; invalid path → 404; axe + light/dark contrast in the strict harness; regression suite green.

### AC-Q1 — Originality gate (hard)
- Scripted ≥6-gram overlap check of all pair content vs the fetched source corpus (reference pages stored under `../research/corpus/`); zero near-matches required; findings logged in `../content/originality-check.md`.

### AC-Q2 — Content quality gate (hard)
- Friendly, clear, gender-neutral tone; no medical/legal/financial/absolute claims (banned-words sweep: always, never, guaranteed, destined, doomed, toxic, proven); no fear framing for low scores; disclaimer present in data + rendered page; consistent style per the Paige style guide.
- **Sign-binding check (Astrotalk templating-bug lesson, research §5.8):** automated check that every rendered pair page mentions exactly its two selected signs by name — no wrong-sign copy.

### AC-Q3 — Visual gate
- Sally's Stitch design mapped to tokens; screenshots (light+dark, mobile+desktop) for hub + representative pair pages (one Excellent, one Mixed, one Very challenging, one same-sign) verified before dev hands-off.

## Non-goals
- No birth-detail compatibility (moon/Venus synastry) — sun-sign only, labelled as such; cross-link to `/matching` (Vedic) instead.
- No Hindi content, no consult CTA monetisation in v1 (slot placeholder only).
- No content copied from any source — ideas only.

## Verification summary
- Mary's methodology tables: VERIFIED ×2 independent sources each (aspect list, element/modality/ruler/dignity tables). Same-sign Strong-80: mainstream consensus (Cafe Astrology label + relationship writing), DISPUTED resolved to Strong-80 with nuance copy. Opposition Mixed-band: DISPUTED resolved (aspect dominates). Traditional-only shared-ruler pairs (Aries–Scorpio, Sagittarius–Pisces, Capricorn–Aquarius): DISPUTED → reduced flagged bonus. Star ratings: UNVERIFIED on majors → not used as primary UI. Full register: `../research/sources.md`.

## Build verification (S-ZC-4 closeout, 2026-11-22)
- Backend: engine + `/api/v1/compatibility/signs` (+`/pair`) + 78-record content — **336/336 tests green** (`bun test`); originality 6-gram gate clean on all 78 records; consolidate gate (schema, aspect geometry vs engine, banned words, §10 sign-binding, lengths) green.
- Frontend: hub + 78 canonical pair pages + astrology-hub card + sitemap — `qa/e2e-zc-compatibility.mjs` **23/23** (axe strict light+dark ×3 pages, picker canonicalisation, full result render [score/band/6 cards/tips/disclaimer/honesty flag], swap, same-sign 80/Strong, hub grid, astrology card, sitemap 78); `qa/e2e-aria.mjs` + `qa/e2e-contrast.mjs` **ALL PASS**.
- Sally design reconcile (9 build deltas + 6 post-build spec deltas): verdict card → site primary-fill pattern [eyebrow, serif score, white-outline band chip, unverified line last]; band colour moved to category-card borders only, mixed→`--color-warning`; picker helper line; hub button disabled-until-both; terracotta tip markers; "Want the Vedic view?" cross-link band; hub breadcrumb; 2-col mobile sign grid; crumbs underlined (axe link-in-text-block); then chip value hierarchy + 375px overflow guard + ≤480px picker stack + mobile full-width CTA + serif result section titles + 44px related-link targets.
- BMAD pre-commit review (QA agent): **APPROVED**, zero P0/P1; 5 P2s — 4 fixed (double-escape in fact chips, inline wheel arrays → `canonicalPairSlug` import ×2, band-threshold pinning comment, verdict h2→p), 1 deliberate skip (sitemap pair URLs stay slash-less to match the site-wide sitemap convention; host 308s to the slash form).
- Site-chrome fixes surfaced by strict axe: Footer col-heads h4→h2 (heading-order, site-wide); CTA ink on `--gold` fills → `--color-on-primary` (theme-aware #ffffff/#541b00, ≥8:1) on the two new pages only — other `--ink-on-gold` consumers pair it with fixed `--color-accent` and already pass.
- Evidence: `../qa/` shots (hub light, pair light/dark). State: **SHIPPED 2026-11-22** — G2 approved → backend fc1b6c4 (LIVE) + frontend 63013e5 (LIVE on vyotish.com) + meta 83035b0; hub, pair page, sitemap, astrology card and mirrored-404 verified in production.
- **Content sign-off (owner, 2026-11-22)**: `verified: true` in `signPairResult` (this set only — Ashtakoota/muhurat/transits keep their P11 `verified: false`); "interpretive method" UI tag dropped from the verdict card; method framing + guidance-and-entertainment disclaimer unchanged. Backend tests re-pinned 336/336; `qa/e2e-zc-compatibility.mjs` re-run 23/23 with the tag-dropped assertion; aria + contrast suites re-run ALL PASS.
