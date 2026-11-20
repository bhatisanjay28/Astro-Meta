# Remaining-task stories — enriched & BMAD-reviewed

Story-first hard rule (owner, 2026-11-20): *every epic task gets a written BMAD story,
enriched and reviewed BEFORE implementation.* `docs/plan/epics.md` stays the single
source of truth for plan/status; this file carries the HOW for everything still open.
No story → no work on that task. Implementation of each story below starts only after
its review entry (bottom of file) is recorded.

Status legend: **READY** (agent can start now) · **OWNER-GATED** (needs owner
keys/accounts/decision; agent-ready prep noted) · **BLOCKED** (not runnable in this
environment) · **PARKED** (deliberately deferred, tracked in the debt register).

---

## S1 · P3 — Self-hosted fonts — **READY** (frontend repo, LOCAL commit per D8)

**Story.** As the site owner I want all webfonts served from vyotish.com itself so
the site makes zero third-party font requests, loads faster and deterministically,
and a strict CSP (`font-src 'self'`) becomes achievable in S2/7.2.

**Grounding (verified 2026-11-20).**
- CDN links today: `frontend/src/layouts/Base.astro:115-116` (preconnect to
  fonts.googleapis.com / fonts.gstatic.com), `:118` css2 link — Cinzel:wght@600;700,
  Poppins:wght@400;500;600, JetBrains Mono:wght@500, Noto Sans Devanagari:wght@400;600
  (`display=swap`); `:122` — Material Symbols Outlined wght,FILL@100..700,0..1
  (`display=block`, icon ligatures).
- Admin surfaces link Poppins separately: `frontend/src/layouts/Admin.astro:32`,
  `frontend/src/pages/admin/login.astro:11`.
- Consumers are font-token names only — `frontend/src/styles/tailwind.css:68-73`
  (`--font-display/--font-headline: "Cinzel"`, `--font-title/--font-body/--font-label:
  "Poppins"`, `--font-data: "JetBrains Mono"`) — so swapping the source cannot break
  utility classes.
- Licenses: Cinzel / Poppins / JetBrains Mono / Noto Sans Devanagari = SIL OFL 1.1
  (redistribution permitted, license text must ship); Material Symbols = Apache 2.0
  (notice must ship).

**Acceptance criteria (Given/When/Then).**
- Given the built output, when any page loads, then zero requests go to
  fonts.googleapis.com / fonts.gstatic.com (checked by grep over `dist/**` and by the
  browser network tab on preview).
- Given the css2 API is queried with a modern Chrome UA, when its CSS is processed,
  then only the needed subsets (latin, latin-ext, devanagari) are saved as woff2 into
  `frontend/public/fonts/`, with Google's `unicode-range` blocks preserved per face.
- Given Material Symbols renders via ligatures, when icons load, then its @font-face
  keeps `font-display: block`; the four text families keep `swap`.
- Given a font file fails to load, when a page renders, then the token fallback stacks
  in tailwind.css apply (text visible, icons degrade to text glyph — acceptable
  fail-soft).
- Given OFL/Apache terms, when the fonts commit, then `LICENSE`/`NOTICE` files ship in
  `frontend/public/fonts/`.
- Given visual parity matters, when preview pages render, then home / blog article /
  admin login typography is indistinguishable from today's CDN rendering.

**Steps.**
1. `curl` css2 for the exact families/weights above with a Chrome UA; extract woff2
   URLs + unicode-range per subset.
2. Download woff2 into `frontend/public/fonts/` with flat names
   (`cinzel-600.woff2`, `poppins-400.woff2`, …, `material-symbols-outlined.woff2`).
3. Add @font-face set (unicode-range + font-display) — extend `tailwind.css` above the
   token block or a new `fonts.css` imported first.
4. Replace the three CDN link groups (Base.astro 115-122, Admin.astro, admin/login)
   with the local stylesheet; drop the now-dead preconnects.
5. Commit in frontend — **LOCAL only (D8)**; secret-scan hook runs.

**Test plan.** `bun run build` → `grep -r "fonts.googleapis\|fonts.gstatic" dist/` =
0 hits → preview + browser network tab shows only self-hosted font requests with woff2
content-type → `/hi` page renders Devanagari → `bunx astro check` + biome clean.

**Risks.** Wrong UA ⇒ Google returns TTF/legacy CSS (check Content-Type = font/woff2);
missing devanagari subset ⇒ hi pages silently fall back (test a hi page); Material
Symbols variable axes (wght,FILL) must be declared or icon weight/fill changes.

**DoD.** Zero third-party font requests on the built site; licenses committed;
astro check + biome + build green; frontend commit LOCAL; epics.md P3 line flipped
with a pointer to this story.

---

## S2 · 7.2 — Browser-side security pass (CSP / WAF / Turnstile) — **OWNER-GATED**, agent prep READY

**Story.** As the site owner I want CSP and Turnstile/WAF hardening on vyotish.com
so the browser surface resists XSS and abuse, completing what the API-side pass
already covers.

**Grounding.** Already done server-side (epics 7.2 ✅ lines): security-headers
middleware on all API responses + fixed-window rate limiter (429) on
login/newsletter/booking POSTs and /places (backend ba57577, tested); dependency
audit 2026-11-20; secret scan + 0.5b hooks. Missing: **no `frontend/public/_headers`
exists** (Cloudflare Pages headers file), no CSP anywhere in the frontend, no
Turnstile widget code. CSP verification REQUIRES a production deploy loop (each
iteration ships to vyotish.com) ⇒ D8 owner gate; Turnstile needs owner site/secret
keys + `wrangler secret put TURNSTILE_SECRET_KEY` and backend verify step.

**Acceptance criteria (agent prep, READY part).**
- Given `frontend/public/_headers`, when a page is served from Pages, then it carries
  HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a CSP that
  starts `report-only`-style permissive (self + inline for Astro islands' hashed
  inline scripts) and tightens in later iterations.
- Given GA4 later loads via the consent-gated loader (7.4), when CSP is active, then
  the directives list the exact hosts GA4 needs (`google-analytics.com`,
  `googletagmanager.com`) — no wildcard openers.
- Given self-hosted fonts land first (S1), when CSP is written, then `font-src 'self'`
  is valid with no third-party font hosts.

**Acceptance criteria (owner-gated part).**
- Given owner provides Turnstile site/secret keys, when a public form submits, then
  the backend verifies the token server-side and rejects failures (429-style path
  already rate-limits).
- Given CSP iterations, when production is exercised, then zero console CSP violations
  on the core flows before `enforce`.

**Steps (prep now):** create `_headers` with baseline + commented CSP; document the
iteration loop in the story. **Owner:** Turnstile keys, then D8-approved deploys per
iteration.

**Test plan (prep):** `bun run build` ships `_headers` into dist; preview server
serves them (Pages parity check documented as manual). **Risks:** CSP breaking island
inline scripts (mitigate: hash-based script-src, iterate report-only first); headers
file typos silently ignored by Pages (keep the file minimal and reviewed).

**DoD.** `_headers` committed (frontend, D8-gated deploy); Turnstile live on
forms/login/calculators once keys exist; epics 7.2 🔶→✅ with iteration log.

---

## S3 · 7.3 — Legal final drafts + DPDP + grievance — **OWNER-GATED** (agent drafts, owner reviews)

**Story.** As the site owner I want legally reviewed Privacy/Terms/Refund/Disclaimer
pages with DPDP-2023 statements and a grievance contact so vyotish.com is compliant
before launch.

**Grounding.** Pages exist: `privacy/terms/disclaimer/refund/contact/about.astro`;
**only privacy.astro currently mentions grievance/DPDP**. Content drafts were written
but never owner-reviewed (epics 7.3 ⬜ "drafts need owner review").

**Acceptance criteria.**
- Given the four legal pages, when reviewed, then each carries: data collected
  (form fields, settings like contact_email), purpose, retention, third-party
  processors (Supabase, Cloudflare, Google Places, GA4-if-enabled), DPDP rights +
  grievance officer contact, effective date.
- Given owner feedback, when drafts are revised, then changes are committed and
  epics 7.3 flips to ✅ with the review date.
- Given "contact" page, when grievance info exists, then it matches privacy.astro
  (single source: a settings key or shared component, not duplicated prose).

**Steps.** Agent: consolidate draft + extract grievance contact to one place →
present to owner → apply edits. **Owner:** legal review (they may involve counsel).
**Test plan:** content-only; astro check + build green; links between pages valid.
**Risks:** jurisdiction/accuracy — agent cannot certify legal adequacy; owner sign-off
is the gate. **DoD:** owner-approved drafts live on all pages; 7.3 ✅.

---

## S4 · 8.2 / P20 — Lighthouse ≥90 + budgets — **READY** (audit agent-runnable; gate is owner review)

**Story.** As the site owner I want a real Chrome Lighthouse audit of vyotish.com
key pages so performance/accessibility/budget claims are measured, not asserted.

**Grounding.** Chrome **is installed** at
`/c/Program Files/Google/Chrome/Application/chrome.exe` (verified 2026-11-20) — the
earlier "needs real Chrome" blocker no longer applies locally. `bunx lighthouse` with
`CHROME_PATH` against a preview server works on this box. Epics 8.2 ⬜; debt register
P20 = same audit.

**Acceptance criteria.**
- Given preview of the built frontend, when the audit runs, then home, one panchang
  city page, one blog article, one calculator, and one directory page each report
  Performance ≥ 90 and Accessibility ≥ 90 on mobile emulation.
- Given a score < 90, when found, then a numbered findings list with file references
  lands in the story's results section (fix-or-record per minimal-change discipline).
- Given budgets, when configured, then script/font/image byte budgets are recorded so
  future regressions are measurable.

**Steps.** build → preview server → per page:
`CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" bunx lighthouse
<url> --chrome-flags="--headless" --output=html,json --output-path=docs/plan/lighthouse-2026-11-20/<page>`
→ summarize in epics.md.
**Test plan:** the reports themselves; re-run after any fix. **Risks:** preview
environment differs from Pages CDN (document the delta; final number is post-D8-deploy);
flaky audit variance (run ×2, report both). **DoD:** reports committed (meta repo),
8.2/P20 updated, owner review noted as the gate for the production re-run.

---

## S5 · 8.3 — Device matrix — **OWNER-GATED** (agent prepares checklist)

**Story.** As the site owner I want a device/browser matrix exercise so the site is
verified on the hardware the audience actually uses.

**Grounding.** Responsive layout built on Tailwind breakpoints; no device-lab run has
happened. Owner participates (epics 8.3 ⬜).

**Acceptance criteria (agent part).** Checklist doc listing: Android Chrome (low-end),
iPhone Safari, iPad, desktop Chrome/Firefox/Edge, slow-3G sanity via devtools —
with per-page pass criteria (nav, kundli picker, chart render, forms, blog) and a
results table to fill. **Owner part:** run the matrix, record results.
**DoD:** checklist committed; 8.3 flips when owner results recorded.

---

## S6 · 8.4 — Owner review gate + launch-blocker list — **READY** (list is agent work; gate is owner)

**Story.** As the site owner I want a single launch-blocker checklist consolidating
every open owner-gated item so go-live is a deliberate, reviewable decision.

**Grounding.** Owner-gated remainder (epics totals + handoff notes): D8 frontend push
(frontend 80976ea LOCAL, ahead 15) · setup-first-admin never run (`bun
scripts/setup-first-admin.ts --email …` from the **backend** repo) → /admin/* unusable ·
GOOGLE_PLACES_API_KEY
(optional) · S2 keys · S3 legal review · S4 owner review · S5 matrix · token rotation
(debt register) · P8/P9/P10/P17 sample-data marking · P11/P16 jyotishi sign-offs ·
vyotish.co.in GoDaddy nameserver switch (staged).

**Acceptance criteria.**
- Given the checklist, when reviewed, then every blocker has: owner/agent, repo,
  exact command or link, and the gate it satisfies.
- Given the list, when the owner ticks all items, then launch proceeds with no
  undiscovered dependencies (cross-checked against epics.md pre-launch gates section).

**Steps.** Write `docs/plan/launch-blockers.md` (meta repo) from the grounding above;
cross-check vs epics.md gates; commit. **Test plan:** coverage check = every ⬜/🔶 in
epics.md appears in the list. **DoD:** list committed; 8.4 flips when owner completes
the gate.

---

## S7 · 7.4 remainder — CF Web Analytics + error monitoring + email — **OWNER-GATED**

**Story.** As the site owner I want analytics/monitoring/email wired so operations
are observable and users get transactional mail.

**Grounding.** Already done: consent-gated GA4 loader (Accept + `ga_measurement_id`
setting), `window.vyTrack` events (kundli_generated / calculator_used /
booking_request_sent / blog_read), WhatsApp float. Missing needs owner accounts:
Cloudflare Web Analytics token, error-monitoring service choice (e.g. Sentry) + DSN,
email provider + templates. Agent-ready wiring documented per provider once chosen
(GA4 path proves the pattern: setting → consent → inject).

**Acceptance criteria.** Given owner credentials, when configured, then analytics
loads only post-consent, errors surface with source maps/versions, and booking/newsletter
emails send from the provider with designed templates. **DoD:** 7.4 🔶→✅.

---

## S8 · P19 — Docker build test — **BLOCKED** (no docker on this box)

**Story.** As the maintainer I want the backend Dockerfile verified by an actual
build so the documented container path is proven.

**Grounding.** `docker` not installed on this workstation (verified twice) — cannot
run here. Backend CI builds on Cloudflare (wrangler), so nothing is unverified except
the Dockerfile itself.

**Acceptance criteria.** Given a machine with docker, when
`docker build -t vyotish-backend ./backend` runs, then the image builds and
`docker run` serves `/api/v1/health` 200. **DoD:** result recorded in debt register
by owner on any docker-capable machine.

---

## S9 · 3.1b remainder — panchang edge-cache — **PARKED** (optional, debt register)

**Story.** As the maintainer I may want Cache-API edge caching in front of panchang
reads if traffic justifies it. **Grounding:** write-through `panchang_cache` + 00:15
UTC cron warm/prune already live (15e571d); edge-cache adds latency win only at
scale. **DoD:** stays parked unless owner asks; exit = one middleware + cache-key
tests.

---

## S10 · sade_sati.next jitter — **PARKED** (nit, debt register)

**Story.** As a maintainer I'd like the ±ms jitter in `sade_sati.next` window edges
(iterative transit search) deterministic. **Grounding:** astronomically irrelevant;
UI renders dates only (8.1b note). **DoD:** only if owner requests; fix = quantize
edge to whole minute before compare.

---

## S11 · 8.2 follow-up — a11y/SEO quick fixes from the Lighthouse audit — **READY**

**Story.** As the site owner I want the audit's contained accessibility/SEO findings
fixed so the shared chrome is crawlable and screen-reader correct on every page.

**Grounding (reports in `docs/plan/lighthouse-2026-11-20/`).** Site-wide findings,
each maps to one shared component:
1. **seo `crawlable-anchors` (all pages → seo 92):** header anchor
   `div.max-w-7xl … a.font-label` (Gemstones "Soon" chip) is an `<a>` without a
   usable href — Header.astro; make it `<span>`/button or give it a real target.
2. **a11y `aria-allowed-attr` (home/kundli):** `input#hp-place` (HomePanchang) and
   `input#hk-place` (HomeKundli) carry an aria attribute their role forbids —
   inspect PlaceField markup, correct or drop the attribute.
3. **a11y `label-content-name-mismatch`:** header brand link `a.flex`
   (Header.astro) — aria-label must contain the visible label text.
4. **a11y `heading-order` (panchang/blog/kundli):** one skipped level in shared
   components — find and fix the culprit heading.
5. **a11y `color-contrast`:** e.g. `div.consent-stub > button` — palette values are
   owner-approved (D11); propose token tweak, apply only with owner nod.

**AC.** Given the fixed components, when re-audited locally, then seo ≥ 95 on all
pages, no `aria-allowed-attr` / `label-content-name-mismatch` / `heading-order`
fails, and astro check + biome + build stay green. Contrast fix rides only on owner
palette approval (else recorded). **Test plan.** Re-run the 5-page audit; diff
scores. **Risks.** Changing the brand link label affects SEO text — keep visible
text intact. **DoD.** Scores in results doc updated; findings list shrinks; commit
LOCAL (D8).

## S12 · 8.2 follow-up — CLS font-swap mitigation — **READY**

**Story.** As a visitor I want pages not to shift while fonts load, so text doesn't
jump mid-read.

**Grounding.** Lighthouse: CLS 0.246 (panchang) / 0.267 (blog), culprit =
`main#main-content` whole-block shift (font-metric swap of display/body faces);
kundli/consultations (0.03/0.08) unaffected. Same `swap` behaviour existed with the
Google CDN (S1 preserved font-display) — not a regression, a standing nit now
measured.

**AC.** Given fallback-font metric overrides (`ascent-override`/`descent-override`/
`line-gap-override`/`size-adjust` tuned per face) or targeted font preloads on
text-heavy pages, when re-audited, then CLS < 0.1 on panchang + blog with LCP/TBT
not regressed. **Test plan.** Audit re-run ×2 per page. **Risks.** size-adjust
changes fallback rendering on slow networks; tune conservatively. **DoD.** CLS
recorded < 0.1; commit LOCAL.



| # | Check | Result |
|---|-------|--------|
| R1 | Fact-check: every file/line/state claim re-verified against the working tree 2026-11-20 | PASS — font links (Base.astro 115-122, Admin.astro:32, admin/login.astro:11), tailwind.css:68-73, no `_headers`, Chrome path present, docker absent, only privacy.astro mentions grievance — all re-grepped this session |
| R2 | Coverage: every ⬜/🔶/open debt line in epics.md has a story | PASS — 7.2→S2, 7.3→S3, 7.4→S7, 8.2/P20→S4, 8.3→S5, 8.4→S6, P3→S1, P19→S8, 3.1b remainder→S9, sade_sati→S10; token rotation + sample-data + jyotishi gates → S6 list |
| R3 | AC testability: every Given/When/Then is observable | PASS — all ACs measurable (header names, grep counts, numeric scores, fillable tables) |
| R4 | Ownership/consent: stories touching the frontend note LOCAL commit per D8; owner-gated items do not impersonate agent work | PASS |
| R5 | Risk sections present incl. failure modes (UA mismatch, CSP breakage, subset loss, deploy-vs-preview delta) | PASS |
| R6 | DoD each closes with an epics.md flip + pointer, keeping epics.md the source of truth | PASS |
| R7 | S11/S12 (added 2026-11-20 after the S4 audit): facts from report JSONs (selectors quoted from audit details), ACs numeric (seo ≥95, CLS <0.1), D8 noted | PASS |

Review verdict: **approved for implementation** — start order: S1 (frontend, LOCAL),
S4, S6 (meta docs). S2 prep (`_headers`) rides with S1's deploy only after owner's D8
decision; owner-gated stories wait on owner inputs.
