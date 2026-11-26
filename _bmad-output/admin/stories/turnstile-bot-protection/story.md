# Turnstile bot protection — login, consultation, puja, newsletter (Barry/Amelia build story)

**Date:** 2026-11-26 · **Status: SHIPPED & LIVE — enforcement ARMED** (frontend `855cf3f`+`973f0bc` Pages-live; backend `7adb7ff` Workers-live; AC 6 sweep closed, see §Shipped). Story review REQUEST_CHANGES (1×P0, 1×P1, 3×P2, 3×P3) — all folded as [R1]–[R8]; pre-commit review **APPROVE** (1×P2 deploy gate + 4×P3, all folded); delta review **APPROVE** (newsletter ensure fix); meta review **APPROVE** (docs commit; 2×P3 wording folds applied — AC 5 dist-sweep claim + deploy-order deviation note).
**Inputs:** admin brief (verbatim requirement: "add session timeout, login rate limiting and bot protection" — timeout + rate limiting shipped in Phase 1, bot protection never shipped); Mary audit #5 ("login limiter per-isolate only, no WAF rule"); standing TODOs in code: `backend/src/env.ts` Bindings comment already names `TURNSTILE_SECRET_KEY`, `backend/src/routes/v1/newsletter.ts:10` and `requests.ts:5` say Turnstile "arrives with Epic 7.2"; owner instruction 2026-11-26: "Finish this task as well" (owner-gated list included Turnstile keys — keys are creatable by us via the CF API).

## Problem (facts)
The four anonymous write endpoints are bot-abuse surfaces with only per-isolate in-memory throttles (`app.ts:72` middleware via `rate-limit.ts` WINDOWS — login 10/min, newsletter/requests 5/min; each Workers isolate keeps its own map, so real floods rotate through isolates/colos):

1. `POST /api/v1/auth/login` (`auth.ts:50`) — credential stuffing against the Supabase proxy; every failure writes an audit row (`auth.login_failed`), so bots also pollute the audit trail.
2. `POST /api/v1/requests/consultation` (`requests.ts:66`) — writes PII (name/phone/email/birth details) into `consultation_requests`.
3. `POST /api/v1/requests/puja` (`requests.ts:178`) — same shape.
4. `POST /api/v1/newsletter` (`newsletter.ts:41`) — upsert re-activates unsubscribed addresses, so bots can undo owner-visible unsubscribes.

**Deliberately NOT covered:** compute endpoints (`/kundli`, `/kundli/match`, `/muhurat/find`) — stateless, cache-backed, no DB writes; places autocomplete/resolve — [R4] they DO write to the DB (`places.ts:103` storePlace upserts a bounded non-PII cache row via merge-duplicates), but captcha would wreck type-as-you-type UX and the Google bill, and the write is cache-only, not user data; the contact page (no POST endpoint exists); edge WAF rate-limit rules (CF-dashboard owner task, out of repo scope).

## Design (Cloudflare Turnstile, managed mode)
- **Widget:** created via CF API (managed mode, domains `vyotish.com` + `localhost`). Sitekey is public; secret is a Workers secret. Secrets/keys live in temp files only — never echoed in chat or committed.
- **Backend** `src/lib/turnstile.ts`: `verifyTurnstile(token, ip, secret)` → POST form-encoded `secret`+`response`+`remoteip` to `https://challenges.cloudflare.com/turnstile/v0/siteverify`, returns `{ ok: boolean }`. Rules:
  - `secret` unset → **pass** (dev/test opt-out, mirrors `RATE_LIMIT_DISABLED`; this is what keeps all 554 existing tests green without edits and gives a deploy-safe arming window).
  - missing/empty token → fail; siteverify network error / non-success → fail (fail closed).
- **Route behavior on fail:** `400 {error:{code:"captcha_required",...}}` (standard envelope), **no audit row** (pre-auth noise; today's `auth.login_failed` semantics unchanged for requests that pass captcha and then fail credentials). Insert the check after body validation, before any Supabase call / DB write, in each of the 4 handlers (`grant()`, insert, upsert). In-handler (not middleware) — body is read in-handler already; matches the existing `throttled(ip)` placement in `requests.ts:68,180`.
- **Request field:** `turnstile_token: string` in the JSON body.
- **Frontend** `public/turnstile.js` (~60 lines, **comment-free** — S19/S22 gotcha: inline+public script comments ship to dist and the visitor-copy sweep greps dist): defines `window.VyotishTurnstile` with `ensure(container)` (lazy-loads the CF challenges script once, renders a widget into `container.querySelector("[data-turnstile-slot]")` using `container.dataset.turnstileSitekey`) and `getToken(container)` (polls for a token up to ~8 s, resets the widget after reading — **tokens are single-use**, so a reset is required for consecutive submits; returns `""` when no sitekey is set or on timeout). No sitekey → no CF script load at all. [R8] **Timing rule:** the loader is `defer` and component scripts are parse-time inline, so `window.VyotishTurnstile` is undefined at parse time — reference it only inside submit/open handlers (call time), never capture it at script top.
- **Base.astro** head: `<script is:inline src="/turnstile.js" defer>` — covers 5 of the 6 surfaces. [R1] `admin/login.astro` is a **standalone page** (own `<html>` head, renders inside Base ❌ — story originally claimed otherwise) → it carries its own `<script is:inline src="/turnstile.js" defer>` tag in its head; do NOT force it into Base.
- **Surfaces (4 components, 6 pages):** `admin/login.astro:57-59` (bundled fetch script; standalone page — own script tag [R1]), `BookingForm.astro` (:194 fetch; serves consultations index+slug and poojan index+slug), `home/BookingModal.astro` (:141 fetch; **hidden until first open → `ensure()` must be called on first open**, not page load — Turnstile cannot render into `display:none`; also [R6] update the static badge copy at :88-94 which currently claims "Cloudflare Turnstile Protected / No CAPTCHA required" — false until now, wrong again once the real widget ships), `home/NewsletterForm.astro` ([R3] **both instances live on the home page** (`index.astro:498` gemstones_notify, `:633` weekly_panchang) — the gemstones page has no newsletter form). Each: hidden slot div + `data-turnstile-sitekey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? ""}`; on submit, if sitekey present → await token, add to body; on 400 `captcha_required` → friendly retry line in the existing message element (role=alert already present on newsletter). Sitekey absent → submit unchanged without token (backend parity: secret unset → skip). [R2] NewsletterForm's `define:vars` script renders per instance and queries `querySelectorAll("[data-newsletter-form]")` → today every home form has TWO submit listeners (pre-existing duplicate-POST bug, masked by the upsert; with single-use tokens the handlers would race and the loser flips the alert). Fix in this story: scope each instance's script to its own form (`querySelector` by its distinct `data-source`, which is unique per instance across the site).
- **Env plumbing:** Pages build env `PUBLIC_TURNSTILE_SITE_KEY` (bakes into static pages at build — must be set BEFORE the frontend build; set via CF API `deployment_configs`), Workers secret `TURNSTILE_SECRET_KEY` (arming step, AFTER backend + frontend are live).

## Deploy order (safe window)
1. Create widget → keys to temp files.
2. **Backend first** (backend-deploys-first): lib + 4 guards + tests → gates → Quinn pre-commit → push → CI deploys Workers. Enforcement INACTIVE (secret unset) — zero-risk window.
3. Set Pages build env var → **frontend** push → Pages build bakes the sitekey.
4. Arm: set Workers secret `TURNSTILE_SECRET_KEY` via CF API.
5. Live verify (see AC 6).

## Scope — backend (Astro-Backend)
1. `src/lib/turnstile.ts` per Design.
2. Guards in `auth.ts` (before `grant()`), `requests.ts` ×2 (before insert), `newsletter.ts` (before upsert) per Design.
3. [R5] `newsletter.ts:43` honors `RATE_LIMIT_DISABLED` in its in-file throttle (parity with `requests.ts:68` — the Maps are process-wide and module-level across bun test files, so tests need either unique IPs per case or the opt-out; today only `requests.ts` has the opt-out).
4. Test pins (env binding `TURNSTILE_SECRET_KEY: "test-secret"` + mocked `global.fetch` for siteverify; Supabase mocks per existing per-file `mockSupabase` — siteverify and Supabase both hit fetch, so the mock routes on URL substrings, precedent `admin-modules.test.ts:40`):
   - each of the 4 routes with secret set + missing token → 400 `captcha_required`, **no Supabase call, no audit row for login**;
   - login: valid token (siteverify 200 success) + wrong creds → 401 `invalid_credentials` + audit row (today's semantics pinned);
   - consultation + puja + newsletter: valid token → proceeds exactly as today (insert/upsert observed);
   - siteverify network throw → 400 `captcha_required`; siteverify `success:false` → `captcha_required`;
   - [R5] newsletter/requests pins each use a unique `x-forwarded-for` (in-file throttle Maps are process-wide and `horoscope-newsletter-route.test.ts` already consumes 4 of 5 hits for the shared IP);
   - regression: existing suites (secret unset) all pass unmodified.

## Scope — frontend (Astro-Frontend)
5. `public/turnstile.js` + Base.astro script tag per Design; [R1] `admin/login.astro` carries its own script tag (standalone page).
6. The 4 components gain slot div, sitekey attr, token attach, `captcha_required` handling per Design — incl. [R2] NewsletterForm scoped per-instance listeners (fixes the pre-existing duplicate-listener bug) and [R6] the BookingModal badge copy.

## Acceptance criteria (binding)
1. Secret set: each of the 4 endpoints rejects missing/invalid token with 400 `captcha_required`; a valid token yields today's response byte-identically. Pinned per route.
2. Secret unset: all 4 endpoints behave exactly as today (token ignored) — pinned + full existing suite green unmodified.
3. [R1] Frontend loads `/turnstile.js` on all 6 pages (Base.astro for 5; login.astro's own tag) and renders the widget on admin login, booking modal, booking forms (consultations ×2, poojan ×2) and both home newsletter instances; token attached to the POST; `captcha_required` renders a friendly retry message; no sitekey → forms unchanged; [R2] each newsletter instance fires exactly ONE POST per submit (scoped listener).
4. Secret never client-side; siteverify called server-side only, with `remoteip` from the request IP (`cf-connecting-ip` fallback chain as `app.ts:71`); widget resets after each token read (single-use) — two consecutive submits both succeed (live).
5. Gates green: backend lint + tsc + full suite; frontend biome + `astro check` + build; new public script (`turnstile.js`) ships comment-free (the S19/S22 gotcha — technical comments in component scripts still ship, per pre-existing practice); Quinn story review + pre-commit review.
6. [R3][R7] Live verify (no owner password needed): admin login page with wrong creds → captcha passes + `401 invalid_credentials` (NOT `captcha_required`); home newsletter submit in browser succeeds with widget (×2 instances on home — gemstones has no form); booking modal renders widget on first open; `/consultations` lists the consent-marked samples (confirms Pages retry re-bake). 6 pages total: home (modal + 2 newsletters), consultations index+slug, poojan index+slug, admin login; `hi/index` embeds neither component.

## Test strategy / traps (carried)
- Env bindings via `app.request(path, init, BINDINGS)` (precedent `places.test.ts:22`); mocks must branch BEFORE broad matches; `| tail` pipes mask exit codes — gate with if/then/else.
- Hono body: guard runs after `c.req.json()` in-handler — no body-caching concerns.
- `define:vars` scripts cannot import bundled modules — that is why the helper is a static `public/` file, not a TS module.
- Astro scoped CSS not touched; no markup beyond slot divs.
- Bun ISO rollover / date logic: none here.
- Out of scope: edge WAF rules, honeypot fallback, CSP (Mary #12, separate), contact form.

## Shipped (2026-11-26)

**Pre-commit review (Quinn): APPROVE** — no P0/P1. Five folds before commit:
- **[P2] Deploy gate honored:** the local verification dist was built WITHOUT the sitekey (bare attribute — helper correctly skips, but deploying that artifact with the armed secret would 400 every submit forever). Fix = process: `GET /pages/projects/vyotish` confirmed `PUBLIC_TURNSTILE_SITE_KEY` set on production+preview (value matches, build config intact) BEFORE the frontend push; live baked-sitekey check added to AC 6 sweep.
- **[P3] `turnstile.test.ts`:** the "remoteip forwarded" pin now asserts `sv[0]?.remoteip === "10.9.7.7"` (explicit IP passed via the new optional `xffInit(body, ip)` param).
- **[P3] `lib/turnstile.ts`:** siteverify fetch carries `signal: AbortSignal.timeout(5000)` — a hung siteverify can no longer hold an anonymous write endpoint until the Workers runtime cap; the existing `.catch(() => false)` makes the abort fail-closed.
- **[P3] `public/turnstile.js`:** api.js script gets an `error` listener alongside `load`, `apiReady` resets the `loading` flag, and the queued render callback clears `renderQueued` when `window.turnstile` is absent → an ad-blocked/failed CF script load no longer permanently wedges the widget for the page session (next `ensure()` retries).
- **[P3] BookingModal docblock:** stale "enforcement is Epic 7.2" replaced with the shipped behavior (slot + ensure-on-first-open + token in payload).

Review-verified (mechanically, not trusted): BookingModal define:vars braces balanced; Astro script ordering correct in built HTML (`/turnstile.js` defer precedes inline modules); [R2] newsletter sources unique site-wide; stale-tab 400 exposure during the arming overlap = LOW severity (only already-open pre-deploy tabs, message says "reload", HTML has no long CDN cache). Dist sweep actual outcome (meta-review [P3] correction): `public/turnstile.js` ships comment-free, but this build DID add two visitor-visible technical comments in BookingModal's shipped HTML (the badge HTML comment + one extended sentence in the define:vars fetch docblock) — same class as the pre-existing inline comments that already ship site-wide since S19.

**Deploy + live verification (2026-11-26):**
- P2 deploy gate honored: `GET /pages/projects/vyotish` re-confirmed `PUBLIC_TURNSTILE_SITE_KEY` on production+preview BEFORE the frontend push; Pages deploy `855cf3f` SUCCESS; live curl on `/`, `/admin/login/`, `/consultations/`, `/poojan/` → all carry `<script src="/turnstile.js" defer>` + baked `data-turnstile-sitekey="0x4AAAAAAGT7Zw4uZ1WBMbQ9"`.
- Frontend `855cf3f` pushed FIRST, then backend `7adb7ff` (Workers CI ~5 s) → **enforcement armed** — deliberate deviation from the Design's backend-first order; safe because the pre-Turnstile backend ignored tokens entirely (secret unset → pass), and the residual arming overlap is only the stale-tab case already assessed LOW above. Curl probe: `POST /auth/login` without token → `400 captcha_required` live.
- AC 6 login leg CLOSED in the in-app browser: cleared the inherited owner admin session (`vyotish.admin.*` in sessionStorage — the login page auto-redirects to `/admin/` while a valid token exists), reloaded `/admin/login/`, submitted wrong credentials through the REAL widget → alert `Invalid email or password` (`401 invalid_credentials`, NOT captcha_required). Widget had already resolved a managed non-interactive pass token before submit.
- **LIVE BUG FOUND + FIXED (post-arming):** the home newsletter slots never rendered a widget — `NewsletterForm.astro` wires only the submit listener and never calls `ensure()`, so `getToken` would poll 8 s → `""` → token-less POST → `400` on every newsletter submit (newsletter broken on production between the backend push and this fix; BookingModal/BookingForm/login all ensure correctly). Fix: `turnstile.js` `getToken()` now calls `ensure(container)` first (structural net for ANY surface that forgets an explicit ensure) + NewsletterForm gains an eager init render with a capped retry (`initTs`, 15×300 ms) because its `define:vars` inline script runs before the deferred helper. Delta Quinn review: **APPROVE** (no P0/P1/P2; 3 non-blocking P3s) → frontend `973f0bc` pushed, Pages deploy SUCCESS.

**AC 6 sweep — CLOSED (all legs, post-`973f0bc` deploy):**
- Armed enforcement: curl `POST /auth/login` without token → `400 captcha_required` ✅
- Admin login (in-app browser, REAL widget): wrong creds → alert `Invalid email or password` (`401 invalid_credentials`, NOT captcha_required) ✅
- Newsletter ×2 instances: both slots render at init (`widgetId` set) after the fix; `gemstones_notify` submit ✅ → **second submit on the SAME form ✅ (single-use reset proven)** → `weekly_panchang` submit ✅
- Booking modal: opens → `ensure()` renders the widget (`slotWidgetId` true) → managed-pass token materializes → **real submission succeeds** (ok message, no fail) ✅
- `/consultations/` on the `973f0bc` deploy: 200, bakes the consented samples ("Vidyadhar") + the sitekey attr ✅
- Probe cleanup: the 1 consultation probe row + 1 newsletter probe row (upsert collapsed 3 submits into one) verified then DELETED via MCP (0 left) — the rows' existence was itself the backend-receipt proof.

**Deferred (Quinn delta-review P3s, non-blocking):** console diagnostic when the NewsletterForm retry cap exhausts (4.5 s) with the helper still absent; submit-button disable while `getToken` is in flight (pre-existing double-click same-token race — second POST fails visibly); the token-less `send("")` fallback burns one server round-trip (consistent with approved BookingModal/login branches).

**Note for the owner:** the in-app browser's admin session (`vyotish.admin.*` in sessionStorage) was cleared during the AC6 login test — the panel will ask for a fresh login next time in that browser. Zero Trust/CF Access (owner click) is unaffected.
