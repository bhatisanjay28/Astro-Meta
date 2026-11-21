# Vyotish Calculators — Inventory (Step 0)

> Pipeline: Mary → Quinn → Sally → Bob/Amelia → Quinn. Written by: Step-0 codebase scan, 2026-11-21.
> Repos: `backend/` (Hono + Cloudflare Workers, engine `ENGINE_VERSION 1.3.0-alpha1`), `frontend/` (Astro 5 static, local-only per D8).
> Backend base URL (baked into built frontend): `https://astro-backend.vyotish.workers.dev`. Envelope: `{ data, meta? }` / errors `{ error: { code, message } }`.

## 1. Architecture

- **Backend**: all calculator routes are GET under `/api/v1/calculators/*` (`backend/src/routes/v1/calculators.ts`), except kundli/match which are POST (`routes/v1/kundli.ts`, `match.ts`). Engine modules: `engine/calculators.ts`, `tools.ts`, `names.ts`, `dasha.ts`, `transits.ts`, `matching.ts`, `kundli.ts`, `bodies.ts`, `nodes.ts`, `ascendant.ts`, `ayanamsha.ts`, `divisionals.ts`. Shared birth validator `src/lib/birth.ts` (date/time/lat/lng/tz; DST-corrected local instant).
- **Frontend**: single registry page `frontend/src/pages/calculators/[tool].astro` (Tool registry inside `getStaticPaths`; kinds: `birth | date-name | date | names | name | mobile | age | transits`), hub `index.astro` (Tier-1 from DB content_blocks, Tier-2 hardcoded 16 entries), `BirthForm.astro` + `PlaceField.astro` (backend Places autocomplete/resolve), **one generic recursive result renderer** (`renderObject` → `.row .k/.v` pairs) shared by ALL tools.
- **Renderer weaknesses (pre-QA observations)**: dumps every API key as a flat label/value row — no headline card, no per-tool layout, Lo Shu grid not drawn as a 3×3 grid, dasha not a table, `illumination` shown as 0–1 decimal. `<style>` in `[tool].astro` is **scoped** while results are JS-injected → **all rendered result rows are unstyled** (Astro scoped-CSS pitfall; known fix pattern is `is:global`). This is the likely root cause of the owner's "alignment is not correct" report.

## 2. Owner's calculator list → actual routes/pages

| # | Owner-listed calculator | Page | Backend route | Status |
|---|---|---|---|---|
| 1 | Rashi Calculator | `/calculators/rashi` | `GET /calculators/rashi` | OK |
| 2 | Nakshatra Calculator | **none** (featured card → `/calculators/rashi`) | (same as rashi) | GAP: no dedicated page |
| 3 | Shani Sade Sati Check | `/calculators/sade-sati` | `GET /calculators/sade-sati` | OK |
| 4 | Kaal Sarp Yoga Check | `/calculators/kaal-sarp` | engine: kaalSarp — page calls `GET /api/v1/kundli` which only exists as **POST** | **BROKEN in UI (404)** |
| 5 | Mangal Dosha Check | `/calculators/mangal-dosha` | engine: manglik — page calls `GET /api/v1/kundli` (**POST only**) | **BROKEN in UI (404)** |
| 6 | Rising sign (Lagna) | **none** (featured card → `/kundli`) | `POST /api/v1/kundli` → `data.lagna` | GAP: no dedicated page |
| 7 | Vedic Numerology | `/calculators/numerology` | `GET /calculators/numerology` | OK |
| 8 | Vimshottari Dasha | **none** (featured card → `/kundli`) | `POST /api/v1/kundli` → `data.dasha` | GAP: no dedicated page |
| 9 | Lo Shu Grid | `/calculators/lo-shu` | `GET /calculators/lo-shu` | OK |
| 10 | Destiny Number | `/calculators/destiny-number` | `GET /calculators/destiny-number` | OK (S13) |
| 11 | Moon Phase | `/calculators/moon-phase` | `GET /calculators/moon-phase` | OK (S13) |
| 12 | Sun Sign ("sun shine calculator") | `/calculators/sun-sign` | `GET /calculators/sun-sign` | OK (S13) |
| 13 | Name Numerology | `/calculators/name-numerology` | `GET /calculators/name-numerology` | OK |
| 14 | Mobile Number Numerology | `/calculators/mobile-numerology` | `GET /calculators/mobile-numerology` | OK |
| 15 | Lucky Vehicle Number | `/calculators/vehicle-number` | `GET /calculators/vehicle-number` | OK |
| 16 | Age Calculator | `/calculators/age` | `GET /calculators/age` | OK |
| 17 | Name Compatibility | `/calculators/name-compatibility` | `GET /calculators/name-compatibility` (params `a`,`b`) | **BROKEN in UI: page sends `name=` not `a=` → 400** |
| 18 | Love Compatibility (fun) | `/calculators/love` | `GET /calculators/love` (params `a`,`b`) | **BROKEN in UI (same)** |
| 19 | Friendship (fun) | `/calculators/friendship` | `GET /calculators/friendship` | **BROKEN in UI (same)** |
| 20 | FLAMES (fun) | `/calculators/flames` | `GET /calculators/flames` | **BROKEN in UI (same)** |
| 21 | Atmakaraka & Jaimini Karakas | `/calculators/karakas` | `GET /calculators/karakas` | OK |
| 22 | Ishta Devata | `/calculators/ishta-devata` | `GET /calculators/ishta-devata` | deity **always null** (P11) |
| 23 | Current Transit Chart | `/calculators/transits` | `GET /calculators/transits` | OK |

Also related but outside `/calculators/*`: `POST /api/v1/kundli` (lagna, vimshottari, manglik, kaal_sarp, divisionals, sade_sati in one payload), `POST /api/v1/kundli/match` (ashtakoota 36 guna + manglik both sides).

## 3. Per-calculator detail (inputs/outputs verbatim)

### 3.1 rashi — `GET /calculators/rashi`
- Inputs (query): `date` (req, YYYY-MM-DD), `time` (opt, HH:mm, default 12:00), `lat`, `lng` (req), `tz` (req IANA). UI: BirthForm (birth date, birth time, place picker).
- Output: `rashi`, `rashiIndex`, `nakshatra`, `nakshatraIndex`, `pada`. Algorithm: Lahiri ayanamsha subtracted from tropical Moon longitude; sign = floor(lon/30); nakshatra = floor(lon/13°20′), pada 1–4.
- Tests: `calculators.test.ts` (2), `tools-calculators.test.ts` route smoke.

### 3.2 sade-sati — `GET /calculators/sade-sati`
- Inputs: same birth query params. Output: `in_sade_sati`, `phase` (1|2|3|null), `moon_sign`, `moon_sign_index`, `saturn_sign`, `saturn_sign_index`, `saturn_offset_from_moon`, `current {start,end}`, `next {start,end}`, `note`, `verified:false`.
- Algorithm: Saturn sidereal lon sampled every 20d + bisect; window = first entry into 12th/1st/2nd-from-Moon trio → final exit (200-day retro rule); next window searched within one Saturn circuit (~29.46y). Tests: `divisionals-sadesati.test.ts` (4).

### 3.3 kaal-sarp — page broken; engine `kaalSarp` (engine/tools.ts:175)
- Output: `present`, `axis` ("rahu_to_ketu"|"ketu_to_rahu"|null), `rahu_house`, `type` (Anant…Sheshnag), `note`, `verified:false`. Algorithm: all 7 grahas within 180° of Rahu side; type from Rahu's whole-sign house from Lagna. Partial Kaal Sarp never asserted.

### 3.4 mangal-dosha — page broken; engine `manglik` (engine/matching.ts:563)
- Output: `is_manglik`, `from_lagna`, `from_moon`, `from_venus`, `mars_houses {lagna,moon,venus}`, `cancelled`, `cancellation_reason`, `detail`, `verified:false`. Houses {1,2,4,7,8,12}; cancelled when Mars in Aries/Scorpio/Capricorn.

### 3.5 karakas — `GET /calculators/karakas`
- Output: `karakas` = 7 × `{karaka, planet, sign, degree_in_sign, navamsha_sign}` (Atmakaraka…Darakaraka; descending degree-in-sign, Sun…Saturn; navamsha = (sign×9+part) mod 12).

### 3.6 ishta-devata — `GET /calculators/ishta-devata`
- Output: `atmakaraka` (Karaka object), `navamsha_sign`, `ishta_devata` (**always null**), `note` ("…pending Jyotishi verification (P11)").

### 3.7 transits — `GET /calculators/transits`
- Inputs: `lat`, `lng`, `tz` (no date — always "now"). Output: `as_of`, `timezone`, `grahas` = 9 × `{planet, lon, sign, signIndex, nakshatra, nakshatraIndex, pada, retrograde}`, `meta.cache`.

### 3.8 moon-phase — `GET /calculators/moon-phase` (S13)
- Inputs: `date` (req + isCalendarDate), `time` (opt, **UTC**, default 12:00). Output: `phase` (8 names), `illumination` (0–1), `waxing`, `moon_age_days`, `prev_new_moon`, `next_new_moon`, `prev_full_moon`, `next_full_moon`, `rashi` (Vedic moon sign), `meta.note` (UTC).

### 3.9 sun-sign — `GET /calculators/sun-sign` (S13)
- Inputs: `date` (req + isCalendarDate; computed 12:00 UTC). Output: `tropical_sign`, `rashi`, `rashiIndex`, `nakshatra`, `nakshatraIndex`, `pada`, `lord`.

### 3.10 destiny-number — `GET /calculators/destiny-number` (S13)
- Inputs: `date` (req + isCalendarDate). Output: `destiny` (root), `destiny_sum` (compound), `master` (sum ∈ {11,22,33}), `mulank`, `destiny_lord`, `mulank_lord`. Lords 1–9: Sun, Moon, Jupiter, Rahu, Mercury, Venus, Ketu, Saturn, Mars.

### 3.11 numerology (Vedic Numerology page) — `GET /calculators/numerology`
- Inputs: `date` (req; **no isCalendarDate guard**), `name` (opt). Output: `mulank`, `destiny`, `name_root`, `name_sum`, `name_lord`. Chaldean letter values for name.

### 3.12 lo-shu — `GET /calculators/lo-shu`
- Inputs: `date` (req; no isCalendarDate guard). Output: `grid` = 9 × `{number, digits[], count}` in classical order [4,9,2,3,5,7,8,1,6], `missing`, `repeated`. Digits of DDMMYYYY; zeros dropped.

### 3.13 vehicle-number — `GET /calculators/vehicle-number`
- Inputs: `date` (req; no guard). Output: `mulank`, `lord`, `friendly_numbers`, `neutral_numbers`, `note`, `verified:false`.

### 3.14 name-numerology — `GET /calculators/name-numerology`
- Inputs: `name` (req). Output: `sum`, `root`, `lord`, `letters[]` (per-letter Chaldean values), `note`.

### 3.15 mobile-numerology — `GET /calculators/mobile-numerology`
- Inputs: `digits` (req; 3–15 digits after stripping non-digits; **raw string passed to engine**). Output: `sum`, `root`, `lord`, `note`, `for_fun:true`.

### 3.16 age — `GET /calculators/age`
- Inputs: `date` (req), `now` (opt, default today UTC). Output: `years`, `months`, `days`, `total_days`.

### 3.17 name-compatibility / love / friendship / flames — `GET /calculators/{name-compatibility|love|friendship|flames}`
- Inputs: `a`, `b` (both req). **UI sends `name` + `b` → 400.**
- Outputs: name-compatibility: `a_root`, `b_root`, `combined_root`, `band`, `note`, `for_fun`; love/friendship: `score` (55–95), `band`, `note`, `for_fun`; flames: `result` (6 outcomes), `letters_removed`, `for_fun`.

### 3.18 Inside POST /api/v1/kundli (serves lagna / dasha / manglik / kaal_sarp when the two broken pages are fixed, plus /kundli page)
- Body: `{date, time?, lat, lng, tz, options?}`. Output keys: `birth{...}`, `lagna {lon,sign,signIndex,nakshatra,nakshatraIndex,pada,house}`, `grahas[9]`, `houses`, `navamsha`, `divisionals {D3,D7,D9,D10,D12}`, `sade_sati`, `manglik`, `kaal_sarp`, `dasha {moon_nakshatra, moon_nakshatra_lord, balance_at_birth_years, mahadashas[9] {lord,start,end,years}}`.

## 4. Cross-cutting issues found at scan time (Quinn to confirm)

| ID | Issue | Where |
|---|---|---|
| X1 | `/calculators/mangal-dosha` and `/calculators/kaal-sarp` fetch `GET /api/v1/kundli` — route is POST-only → users see `No route for GET /api/v1/kundli` | `[tool].astro` registry endpoint for these two slugs; `backend/src/routes/v1/kundli.ts:43` |
| X2 | Four name-pair pages send `name=`/`b=` but endpoints require `a=`/`b=` → 400 "a and b name parameters are required" | `[tool].astro` FormData passthrough vs `calculators.ts:204–238` |
| X3 | Result rows JS-injected but `<style>` in `[tool].astro` is scoped → `.row/.k/.v/.obj` never match → unstyled/misaligned results | `[tool].astro` style block (fix pattern: `is:global`, precedent in CHANGELOG) |
| X4 | `isCalendarDate` guard only on moon-phase/sun-sign/destiny-number; rashi, sade-sati, kaal-sarp, karakas, ishta-devata, numerology, lo-shu, vehicle-number, age accept `2025-02-30` (Bun rolls to Mar 2) | `lib/birth.ts` + `calculators.ts` |
| X5 | Generic renderer: no headline card, no tables (dasha), no 3×3 grid (lo-shu), illumination as 0–1 raw decimal, no per-tool interpretation sections | `[tool].astro` `renderObject` |
| X6 | No gender field anywhere (standard input for several Vedic tools); nakshatra/lagna/vimshottari have no dedicated calculator pages | registry + hub |
| X7 | `numerology`/`name-numerology` Chaldean map is A–Z only → non-Latin names give 0 | `engine/tools.ts:356` |
| X8 | Doc drift: `routes/v1.ts` "implemented" list omits moon-phase/sun-sign/destiny-number | `backend/src/routes/v1.ts:42` |
| X9 | Fun-band system (Warm/Bright/Harmonious/Playful/Steady) is invented, not from any published numerology system — Mary should propose standard interpretations | `engine/tools.ts` |
| X10 | Sade-sati `phase` derived from instantaneous offset — mid-window retrograde dip can report phase 3 while window spans full transit | `engine/transits.ts` |

## 5. Harness (Quinn's tools)

- Backend tests: `cd backend && bun test` (288 cases, 29 files). Lint `bun run lint`, typecheck `bun run typecheck`.
- Frontend: `bun run build` → `bun run preview` (Bun.serve static, `http://127.0.0.1:4321`, serves `dist/`). **Build before any e2e.** Built pages call the **live deployed backend**.
- QA scripts (meta `qa/`, playwright-core + axe-core, `channel:"chrome"`): `e2e-s13-calculators.mjs` (14 checks), `crawl.mjs`, `responsive.mjs` (360/768/1024/1440; run from `qa/`), `e2e-contrast.mjs`, `e2e-aria.mjs`.
- Only Bun installed: `export PATH="$USERPROFILE/.bun/bin:$PATH"` per shell call.
