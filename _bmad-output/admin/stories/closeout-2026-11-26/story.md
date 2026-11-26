# Closeout sweep — unconsented stat, dakshina cross-PATCH, ExploreTiles glyphs (Barry/Amelia build story)

**Date:** 2026-11-26 · **Status: SHIPPED & LIVE** (backend `8b70bba` Workers-live ~5 s; frontend `9c535ba` Pages-live ~110 s — see §Shipped). Story review: REQUEST_CHANGES 2×P1 + 3×P2 + 3×P3, all folded as [R#]; pre-commit review round 1 REQUEST_CHANGES (audit-fields pins) → delta re-reviewed **APPROVED**.
**Inputs:** phase-2 review #9 ("`astrologers.unconsented` dropped — deferred until the 0016 consent column" — the consent column landed in phase-4's 0018, so the deferral is now unblocked); phase-4 story §Shipped ("[P3] dakshina exclusivity only checked within one PATCH"); S22 memory ("ExploreTiles icon-text blemish pre-existing on live (follow-up story)"). Fresh verification 2026-11-26: `unconsented` absent from backend/src; gap live at `catalog.ts:509`; `ExploreTiles.astro:23` renders `{t.icon}` without a Material Symbols class.

## Problem (facts)
1. **Dashboard hides unconsented astrologers.** Phase-2 review #9 deferred `astrologers.unconsented` until a consent column existed. 0018 added `listing_consent_confirmed_at`; the 6 sample astrologers are now consent-NULL → unlisted from the public directory, yet `/admin/stats` reports only `active`/`inactive` — the owner sees "6 active" with no hint they're invisible to visitors.
2. **Dakshina exclusivity is per-PATCH only.** `applyDakshinaRule` nulls `sample_price` when `dakshina_on_request === true` on the object it's given. POST is fine (whole row). PATCH applies the rule to the patch payload alone, so `PATCH {sample_price: 500}` on a row already `dakshina_on_request=true` stores BOTH — public pages then show a price the astrologer asked not to quote.
3. **ExploreTiles shows icon names as text.** `ExploreTiles.astro` renders `{t.icon}` inside a bare span — visitors to the HI home (`/hi/`, its only consumer per [R1]) read literal strings like `star` / `spa` instead of glyphs. The header/megamenu render the same `NAV_TABS` icons correctly via `material-symbols-outlined`; [R3] the **self-hosted** Material Symbols face and the `.material-symbols-outlined` helper class ship globally via `fonts.css` (imported by Base.astro) — the "Google-hosted, linked in Base.astro" phrasing was wrong (stale comments in base.css/icon-display.css), but the substance holds: adding the class is sufficient.

**Verified NOT broken (checked, no action):** `gemstones.astro` `.cta` ink `#17201e` on `var(--gold)` — the S13 follow-up is obsolete: the page is `lockDark`, dark `--color-primary` = `#ffb594` (light peach), contrast ≈10:1.

**Out of scope (deliberate phase-4 deferrals, owner decisions):** drag-reorder UI, homepage-sections visual editor, Resend double-opt-in; owner-gated items (RESEND_API_KEY, Turnstile, sample-astrologer consent marking, D1/D2/D3, key rotation, CF Access, horoscope phrase bank, P11 sign-off).

## Scope — backend (Astro-Backend)
1. `src/routes/v1/admin/stats.ts`: add a third `one(...)` count — `astrologers?select=id&listing_consent_confirmed_at=is.null&is_active=eq.true&deleted_at=is.null` → `astrologers.unconsented` (active-but-unconsented; deliberately NOT counting inactive/deleted). Shape: `astrologers: { active, inactive, unconsented }`.
2. `src/routes/v1/admin/catalog.ts` PATCH handler: [R6] in the pujas branch only (the `!isAstro` guard is preserved as today) — before `applyDakshinaRule(patch)`, build a candidate carrying the effective flag (`patch.dakshina_on_request ?? before.dakshina_on_request`), apply the rule to the candidate, and copy `sample_price: null` back onto the patch only when the rule nulled it AND the patch itself carried `sample_price` or `dakshina_on_request` (keeps `PATCH {name}` touching neither field; preserves today's rule-implied null for `PATCH {dakshina_on_request:true}` per [R5]). Never write the folded `dakshina_on_request` back when the client didn't send it (keep the audit `fields` list honest).
3. Test pins (extend `admin-inbox-phase2.test.ts` stats block + `admin-phase4.test.ts` catalog block):
   - stats: third count query asserted ([R4] the mock must branch on `listing_consent_confirmed_at=is.null` **before** the `is_active=eq.true/false` branches — the new query contains `is_active=eq.true` and would otherwise fall into the existing branch; the strict `toEqual({ active: 3, inactive: 1 })` assertion updates to the three-key shape `{ active, inactive, unconsented }`).
   - dakshina: PATCH `{sample_price}` on a `dakshina_on_request=true` pre-image → written patch contains `sample_price: null` AND no `dakshina_on_request` key; PATCH `{sample_price, dakshina_on_request: false}` → price preserved; [R2] PATCH `{name}` on a flagged row → neither field in the written patch.

## Scope — frontend (Astro-Frontend)
4. `src/components/ExploreTiles.astro`: `class="icon material-symbols-outlined"` on the icon span (aria-hidden already present). No other markup change.
5. `src/pages/admin/index.astro`: Stats interface gains `unconsented: number`; the astrologers hint (`#h-astro`) appends `· N unconsented (unlisted)` when N > 0 (existing inactive text stays).

## Acceptance criteria (binding)
1. `GET /admin/stats` payload includes `astrologers.unconsented` counting active, non-deleted, consent-NULL astrologers; pinned test.
2. [R2] **Prevent semantics:** a PATCH cannot *create* the both-set state — a PATCH carrying `sample_price` on a flagged row always results in `sample_price: null`; a PATCH carrying `dakshina_on_request:true` always results in `sample_price: null`; a PATCH carrying neither field changes neither field. (Self-healing of pre-corrupted rows is out of scope.)
3. [R5] Audit `fields` for a price-only cross-PATCH (e.g. `{sample_price}`) lists exactly the fields the client sent (`updated_at` excluded as today); the rule-implied `sample_price: null` written by `PATCH {dakshina_on_request: true}` continues to be listed, as today.
4. [R1][R8] The HI home (`/hi/`) renders Material Symbols glyphs in every ExploreTiles tile (no literal icon-name text) — manual browser check at `/hi/`; EN home re-verified as already correct (inline `material-symbols-outlined` spans in `pages/index.astro`).
5. [R8] Dashboard astrologers card hint shows unconsented count when non-zero — manual browser check on `/admin/` (manual-only; the frontend has no test runner).
6. Backend suite + lint + tsc green; frontend biome + `astro check` + build green. Quinn pre-commit review before any commit.

## Test strategy / traps (carried)
- Mocks: `mockSupabase(handler)`; `one()` queries asserted by decoded path (PostgREST URL-encoded); audit capture per `admin-inbox-phase2.test.ts:61-77`.
- Astro scoped CSS never reaches JS-generated DOM — not touched here (class added in static markup).
- Bun ISO rollover guard (`isCalendarDate`) irrelevant here; no date logic.
- [R7] **Verified, no action:** (a) pre-image `dakshina_on_request` is `boolean not null default false` (0018) and the `=== true` check is null-safe anyway — no null-branch test is seedable via the API, don't invent one; (b) `/admin/stats` has no rate-limit bucket and no cache — the 19th parallel `one()` count needs nothing elsewhere; (c) the sole frontend consumer of `/admin/stats` is `admin/index.astro:130` (Scope 5 covers it); (d) `preImage()` returns the full row (`select=*`) and the REST PATCH body is built key-by-key, so omitting `dakshina_on_request` is safe; (e) accessibility is unchanged — `aria-hidden="true"` is already on the span, and the scoped `.icon { font-size: 22px }` (0,2,0 unlayered) wins over the helper class's 24px.

## Shipped (2026-11-26)

**Backend — Astro-Backend `8b70bba`** (30e34f4..8b70bba, 4 files, +140/−4): `stats.ts` gains the third astrologers count (`listing_consent_confirmed_at=is.null&is_active=eq.true&deleted_at=is.null`) and the three-key shape; `catalog.ts` PATCH gets the cross-PATCH dakshina guard (merged candidate, copy-back only when the patch carried price or flag, folded boolean never written); 7 closeout pins incl. audit `details.fields` exacts (AC 1–3 fully pinned). Suite **554/554**, biome + tsc clean, CI deployed, Workers live ~5 s after push (401 envelope verified).

**Frontend — Astro-Frontend `9c535ba`** (03e9a48..9c535ba, 2 files, +11/−3): ExploreTiles icon span carries `material-symbols-outlined` (HI home, its sole consumer); admin dashboard astrologers hint appends "N unconsented (unlisted)" with a stale-payload `?? 0` guard. biome + astro check + build green; Pages live ~110 s.

**Live verification:** `/hi/` serves the new markup; headless render check (`qa/e2e-closeout-glyphs.mjs`, reusable) — **9/9 tile icons** resolve the Material Symbols face at 22 px (AC 4 CLOSED, evidence `qa/evidence/closeout/hi-explore-glyphs.png`); `/admin/` and `/` 200.

**AC 5 note:** the dashboard hint renders only behind an admin login — code + stats-shape verified in build/tests; the authed live render awaits an owner-side login (browser-access protocol, no stored admin credentials in qa/).

**Quinn reviews:** story round REQUEST_CHANGES (all folded pre-build); pre-commit round 1 REQUEST_CHANGES (P2: audit-fields unpinned; P3: flag-only case, distinct totals) → delta applied, re-review **APPROVED**.
