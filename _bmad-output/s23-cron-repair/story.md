# Story S23 — horoscope cron repair (site stuck on yesterday's date)

**Date:** 2026-11-27 · **Owner report:** "Today's horoscope shows Thursday, 26 November 2026 when today is Friday, 27 November 2026 (IST)."
**Pinned:** backend (`src/cron.ts`, `src/index.ts`, `src/horoscope/watchdog.ts` NEW, `src/routes/v1/horoscope.ts`, `src/routes/health.ts`, `src/env.ts`, `wrangler.jsonc`, migration `0019`, tests ×2 NEW) · frontend (`src/lib/content.ts`, `src/components/horoscope/SignPage.astro`) · nothing else touched.

## Root cause (verified, not guessed)

Cloudflare killed EVERY horoscope cron invocation with `exceededResources` (CPU limit). One `scheduled` handler chained **panchang warm** (~50 cities × ephemeris) **then horoscope compose** (~800 snapshots) in a single isolate — the combined CPU blew the limit, the horoscope pass never completed, `horoscope_run_log` never got a row, the Pages deploy hook was never pinged, and the static site kept serving the previous build's baked dates (last successful bake: 26 Nov 10:19 UTC — the Turnstile push, which was the last thing that updated the site).

Evidence: CF GraphQL `workersInvocationsAdaptive` — status `exceededResources`, errors 1, ~50 subrequests each, on 24 Nov 18:35, 26 Nov 00:15, 26 Nov 18:35, 27 Nov 00:15 UTC (every firing checked). Non-problems ruled out: data was FINE (27 Nov rows existed since 25 Nov via the D+6 buffer; live API answered `date_key=2026-11-27`), IST maths fine, no edge cache (`cf-cache-status: DYNAMIC`) — the staleness was purely "no rebuild happened".

## Fix (backend 20a5dd1, frontend fed1375 — both pushed & deployed)

1. **Per-job isolates** — `scheduled` dispatches on `event.cron` via `cronJobFor()`; wrangler.jsonc declares three schedules: panchang `15 0 * * *` (05:45 IST), horoscope `35 18 * * *` (00:05 IST), watchdog `50 0 * * *` (06:20 IST). Unknown expression (ops one-off trigger) → horoscope generation (used for the run-now).
2. **Watchdog** (`src/horoscope/watchdog.ts`) — evaluates today's IST content (24-row floor per period: 12 signs × 2 langs) + run log (fresh success ≤ 30 h). Unhealthy → re-run generation + re-ping the deploy hook; still unhealthy → rows in new `horoscope_alerts` table + optional alert email (`SEND_EMAIL` binding + `ALERT_EMAIL_TO` secret — inert until CF Email Routing is enabled on the zone; table + /health surface alerts regardless). Fail-soft, never throws (cron context).
3. **Honest stale ladder** on GET /api/v1/horoscope — dated row → **latest earlier dated row** (response carries `date_key` = the CONTENT's own key, `requested_date_key` = what the tab asked for, `stale: true`) → legacy rolling → honest empty. Never a wrong date.
4. **Frontend stale note** — SignPage.astro renders a small amber "Latest available reading — today's will appear shortly" line (en/hi, `role="status"`) under the hero meta line when `stale` is true; the real date stays in the meta line.
5. **Health check** — GET /health now reports `horoscope.content` (per period: expected IST key + published row count) + `horoscope.open_alerts` — the owner's "date of content currently published" at a glance.
6. `warmPanchangCache` now uses `istDateKey()` (was raw `toISOString().slice` — harmless at 05:45 IST but aligned so a schedule move can never drift it).
7. Migration `0019_horoscope_alerts` — applied to the remote Supabase via MCP **before** the code that consumes it deployed.

## Backup (before any data change, per owner rule)

`qa/evidence/horoscope-backup-2026-11-27/` — horoscopes 384, horoscope_run_log 7, horoscope_library 6392, content_blocks_horoscope 18.

## QA (Quinn)

- 35 new tests: `test/cron.test.ts` (18: wrangler⇄cronJobFor map, IST rollover pins incl. "18:35 UTC = next IST day", expectedKeys at the firing instant, evaluateContentState matrix, watchdog flow with injected generate + mocked fetch, alert-row capture) + `test/horoscope-stale-fallback.test.ts` (5: fresh / stale rung with real date_key + requested_date_key + stale / weekly stale / honest empty / rest() smoke). Clock-robust: fixtures derive keys from the real clock, so they don't rot at midnight.
- Suite 589 pass / 0 fail · biome clean · tsc clean. Frontend: biome clean (5 pre-existing warnings in admin confirm.ts, untouched), astro check 0 errors, build verified baked dates "Friday, 27 November 2026" en+hi, weekly 23–29 Nov, no stale-note while content is fresh.
- **Run-now (27 Nov 08:05 UTC):** real `runHoroscopeGeneration` entrypoint → success, 336 rows, 0 violations, 10.9 s; fresh `horoscope_run_log` row; live /health reports `last_run` + all 4 periods at expected IST keys (daily 2026-11-27, weekly 2026-11-23, monthly 2026-11, yearly 2026, 24 rows each) + `open_alerts: []`.
- **Live sweep (`qa/verify-s23-live.mjs`): 144/144** — 12 signs × {en, hi} × {daily, yesterday, tomorrow, weekly, monthly, yearly}, every page carrying the correct IST date/range in its own language.
- **Rollover:** daily rows exist D+0…D+6 (2026-11-27 → 2026-12-03, 24 each) — the next IST day's content is already published before midnight; cron.test.ts pins 18:35 UTC = next IST day and all three schedule expressions.

## Gotchas (for future sessions)

- Bun's `mock()` isn't assignable to `typeof fetch` (missing `preconnect`) — repo convention: `globalThis.fetch = mock(...) as unknown as typeof fetch`.
- `wrangler.jsonc` is JSONC — tests parsing it must strip full-line `//` comments first (line-anchored regex keeps `https://` values safe).
- Post-`noUncheckedIndexedAccess`, destructured `split("@")` elements are `string | undefined` — give defaults.
- **Run-now mechanism (proven, 27 Nov 08:05 UTC):** schedules-API PUTs (one-shot AND minute-level) registered but NEVER fired — do not use them. `wrangler dev --test-scheduled` is also broken under Bun ("Bun's fetch ignores the undici dispatcher" — oven-sh/bun#39247; 503s everything). Working path: a throwaway Bun script importing `runHoroscopeGeneration` from `src/cron.ts` with creds from a staged `.dev.vars` (delete it after) — identical code path to the cron handler; dispatch itself is pinned by cron.test.ts and proven live by the real schedules. Evidence: run_log row `2026-11-27 08:05:38 success 336 rows 0 violations`.
- QA sweep gotcha: the Hindi weekly meta line uses `MONTHS_SHORT.hi` — "23 नव – 29 नव", NOT "23 Nov – 29 Nov". The sweep script expects per-lang abbreviations.
- CF Pages custom domains: vyotish.com + vyotish.pages.dev only — **www.vyotish.com is proxied in DNS but NOT a Pages custom domain → HTTP 522** (pre-existing, owner follow-up, not touched).

## Owner-gated follow-ups

1. **Email alerts**: enable CF Email Routing on vyotish.com zone (2 dashboard clicks), then `wrangler secret put ALERT_EMAIL_TO` + declare the `send_email` binding in wrangler.jsonc. Until then alerts land in horoscope_alerts + /health only.
2. **www.vyotish.com 522** (add it as a Pages custom domain or unproxy the record).
