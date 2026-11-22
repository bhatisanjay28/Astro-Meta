# QA Report — S18 Required Fields & Validation (Barry directive)

**Date:** 2026-11-22 · **Tester:** Quinn (manual BMAD process) · **Frontend build:** local, dist current
**Verdict:** ✅ **PASS — ready to commit** (1 noted live-environment gap, backend-side, gated on push)

## Owner directive coverage

| Directive item | Result |
| --- | --- |
| Submit with each required field empty, per form | ✅ 62/62 e2e assertions, ALL PASS (`e2e-log.txt`) |
| Asterisks consistent | ✅ audited matrix in `story.md` §1; red `*` only on truly-required fields; `(optional)` markers on unused name/email/date fields; `Fields marked * are required.` note atop every form with required fields |
| Errors under the right field, EN + HI | ✅ per-field `.vy-err`/`.dt-error`/`.pp-status` verified per surface; Hindi catalog verified via runtime lang flip (summary, DOB, POB) — screenshot `shots/rashi-errors-hindi.png` |
| Focus moves to first error | ✅ asserted per surface (rashi/sun-sign/numerology/name-numerology/mobile/vehicle/kundli/matching/booking) — DOM-order sort via `compareDocumentPosition` |
| API rejects incomplete requests | ✅ 5 live-backend curls → HTTP 400 `validation_error` with clear messages (`api-evidence.txt`); ⚠ one gap, see below |
| Valid input still gives the correct result | ✅ rashi, sun-sign, numerology, name-numerology, mobile, vehicle, kundli (chart renders), matching (36-gun table), home kundli (result panel), booking (request saved) |

## Surfaces tested (14 e2e sections)

1. **Rashi/BirthForm** (date+time+place) — full per-field matrix: 3→2→1 remaining, place-free-text blocked, pick clears, 31-Feb specific message, future-date message, valid pass.
2. **Sun-sign** — date-only (time/place truly optional; no asterisks there), calculates without them.
3. **Numerology** — name optional; no native `required` on name; calculates nameless.
4. **Name-numerology** — name required with its own message; typing clears.
5. **Mobile number** — digits required.
6. **Vehicle** — date + plate; per-field removal counts down correctly.
7. **Kundli page** — 10:00 prefill honoured (date+place = 2), unselected place blocked, chart renders.
8. **Matching** — 4 dates/times + 2 places = 6 errors; boy-side fix leaves girl-side 3; 36-gun table renders.
9. **Home kundli** — date+time+place required, Full Name `(optional)` (never sent), scoped summary (no collision with the booking modal on the same page).
10. **Consultations booking** — name+phone required, email optional; valid submit posts a real request (row cleaned from prod afterwards — see Cleanup).
11. **BookingModal (home)** — name+phone+email+consent = 4; fix-all clears without resubmitting.
12. **Hindi catalog** — runtime lang flip: `कृपया जारी रखने के लिए N फ़ील्ड ठीक करें।`, `जन्म तिथि`, `जन्म स्थली` all render.
13. **Responsive** — no horizontal overflow @360/768/1024/1440 with errors shown; shots at all four widths.
14. **Contrast** — summary text 6.25:1 (light), 7.74:1 (dark) — WCAG AA met; error colour never the sole signal (`⚠ ` prefix + red border + text).

## API evidence (live backend, invalid payloads only — no rows created)

```
kundli {}                                   → 400 "date must be YYYY-MM-DD"
kundli date=1990-02-31                      → 400 "date is not a valid calendar date"
match girl without lat/lng/tz               → 400 "girl: lat must be a number in [-90,90]"
consultation {}                             → 400 details: name/phone/topic each listed
consultation {name}                         → 400 details: phone/topic listed
```

⚠ **Noted gap (backend, pending deploy):** `kundli date=2099-01-01` currently returns **200** on the live worker — the future-date rejection (`birth.ts`) is implemented and unit-tested locally (backend suite green incl. the new "S18: future birth dates are rejected" test) but the S18 backend commit is not pushed/deployed yet. The live API never computes a *wrong* result for missing/invalid input (all 400s above), so the owner-facing contract holds; the future-date 400 goes live with the S18 backend push.

> **AMENDMENT (2026-11-22, post-push):** gap closed. Backend pushed through 6ebfc05 (CI lint-gate required a whitespace fixup on the S18 files), deploy success — live re-curl: `kundli date=2099-01-01` → **HTTP 400**. Frontend pushed through 007195a (astro-check fix in form-validation.ts + dead frontmatter import in BookingModal), Pages deploy success — live /calculators/rashi serves the RequiredNote + 3 req-stars + the 360px col-span fix; /kundli, /matching, /consultations, /muhurat all serve the required-note. Frontend CI remains red on 7 PRE-EXISTING astro-check errors (5× DateField segment-input typings from the S16 era, 2× compatibility key-nulls from Epic ZC) — non-gating for deploys (Cloudflare deploys independently; live verified), left untouched per minimal-change discipline, recommended as a small follow-up.

## Bugs found & fixed during QA

| # | Bug | Fix |
| --- | --- | --- |
| 1 | Validator captured the message catalog at install time — runtime lang flip (and future /hi/ build) showed English summary/place messages | `msg()` read lazily at validate time (form-validation.ts) |
| 2 | 360px: BirthForm `grid-cols-2` squeezed date/time pickers into ~125px cells (picker needs ~230px, clear button off-screen) | dt fields span the full row at base, single cell from `sm:` up (BirthForm + `[tool].astro`, incl. date/time extraFields) |
| 3 | `enforceRoot` required-empty branch could clobber the picker's specific impossible/future-date messages | early return when `data-invalid` is set (picker owns those) |
| 4 | BookingForm import sat in Astro frontmatter (server-side) → `installFormValidation is not defined` at runtime on /consultations | import moved inside the client `<script>` |
| 5 | e2e-only: summary locator collided across two forms on one page | scoped summary reads |
| 6 | e2e-only: contrast helper never sorted luminance → inverted ratio in light mode | sort before divide (product contrast itself measured 6.25:1) |

## Pre-existing vs S18

- Biome: `form-validation.ts` clean (formatted, no findings). Remaining findings in `DateField.astro` / `date-time-picker.ts` are pre-existing S16 `!`-assertions — untouched per minimal-change discipline.
- All S16 picker suites behaviour unchanged: the validator only reads enforced dt state (review condition C2 honoured; S16 e2e flows re-exercised incidentally by sections 1/7/8).

## Artifacts

- `e2e.mjs` (14 sections, 62 assertions) + `e2e-log.txt` — **ALL PASS**
- `shots/` — rashi errors @360/768/1024/1440 + 360 full-page, Hindi, valid light (rashi/kundli/matching)
- `api-evidence.txt` — live-backend 400 envelopes (+ the noted future-date 200)
- `probe360.mjs` — the overflow root-cause probe (kept for reference)

## Cleanup

QA booking rows (`QA S18` / 9999999999) deleted from prod `consultation_requests` via Supabase MCP after each e2e run — verified 0 remaining.
