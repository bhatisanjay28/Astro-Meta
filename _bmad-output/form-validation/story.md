# Story S18 — consistent required fields + validation across every birth-detail form

**Date:** 2026-11-22 · **Owner request ("Barry"):** make required fields consistent and add proper validation on every calculator/form that takes birth details.
**Pinned:** frontend (BirthForm, [tool].astro, DateField, PlaceField, kundli, HomeKundli, matching, BookingForm, BookingModal) · backend (birth.ts, calculators.ts, requests.ts) · QA: `_bmad-output/form-validation/qa/`

## Problem (owner)

- Required fields not marked consistently: TOB/POB unmarked while DOB has `*`; POB needed by Kundli/Matching but no marker; Full Name unmarked while Chart Style has one; no clear error on missing required fields.
- Silent failures: calculators submit with empty place/name and only surface a backend 400 in a result box (or nothing).

## Step 1 — Audit (fields × true requirement, "required only if the calculation cannot work without it")

| # | Surface | Fields | Truly required | Current state |
| --- | --- | --- | --- | --- |
| 1 | **BirthForm** on 9 birth tools (rashi, nakshatra, lagna, vimshottari-dasha, sade-sati, mangal-dosha, kaal-sarp, karakas, ishta-devata) | date, time, place (+ per-tool: as_of opt, gender select default) | **date+time+place** | date `*` only; time/place unmarked; place guard writes status text but no red/aria; no note/summary |
| 2 | transits inline form | place | **place** | guard, no marker |
| 3 | sun-sign | date, time, place | **date** (time/place optional — noon-UTC default documented on page) | labels already right; conditional place guard |
| 4 | moon-phase | date (+UTC time opt) | **date** | ok, no note |
| 5 | destiny-number, lo-shu | date | **date** | ok |
| 6 | vehicle-number | date, plate | **date+plate** | plate unmarked, native-only → empty submits to 400 |
| 7 | numerology (date-name) | date, name | **date** (name optional — backend uses it only for Namank) | name wrongly carries `required` attr |
| 8 | name-numerology | name, date | **name** (date opt) | native-only |
| 9 | mobile-numerology | digits | **digits** | native-only |
| 10 | age | date ("Date of birth"), now | **date** (now opt) | ok |
| 11 | name/love/friendship/flames compatibility | first name, second name | **both** | native-only |
| 12 | kundli.astro (/kundli) | date, time (prefilled 10:00), chart style (default north), place | **date+time+place**; style none | banner-only place error |
| 13 | HomeKundli (home) | name, gender, style, date, time, place | **date+time+place**; name/gender optional (**name never sent to API**) | name has `required` attr but body omits it — bug; banner-only place error |
| 14 | matching.astro | boy/girl × (date, time, place) | **dates+places**; time required per owner (TOB listed as needed; noon default materially shifts moon-based guna scores) | date `*` only; banner-only error |
| 15 | BookingForm (consultations ×2, poojan ×2) | name, phone, email(opt), subject, date(opt), time(opt), message(opt) | **name+phone** (backend: 2–120 chars, PHONE_RE) | native bubbles only, no markers |
| 16 | BookingModal (home) | name, phone, email, topic, date(opt), window, consent | **name+phone+email+consent** (modal is the stricter D11 consent design) | native bubbles only |
| — | QuickKundli.astro | — | **dead code** (imported by no page) | leave untouched |
| — | compatibility/index.astro | sign1/sign2 selects | both, native+disabled-empty — correct pattern, no birth details | out of scope |
| — | panchang/muhurat/gochara | no birth details | — | out of scope |

Backend already 400s for: birth spec format/calendar/lat/lng/tz (validateBirth, all birth routes), requireDate/requireName/plate/mobile (quick), kundli/match strict, requests name/phone/email. **Gap: validateBirth does not reject future dates** (owner explicitly wants "reject … future dates"); frontend birth preset blocks future but the API does not.

## Step 2 — Required-field rules (to implement)

1. Red `*` next to the label of every truly-required field (EN and HI alike); aria-hidden asterisk + `aria-required="true"` on the control (the glyph is decorative; screen readers get the attribute).
2. Place of Birth: required wherever lat/lng/tz feed the calc (table above); must be **selected from the suggestion list** (data-place-selected), never free text.
3. Full Name: HomeKundli → "(optional)" (unused in payload); name-numerology → required; numerology → "(optional)".
4. Defaults (chart style, gender, prefill 10:00/12:00) → no asterisk, no fake requirement.
5. Note "Fields marked * are required." atop every form (HI: "* चिह्नित फ़ील्ड अनिवार्य हैं।").
6. One shared label/note component pair + one shared validation module — not per-form copies.

## Step 3 — Validation behaviour (to implement)

- Submit with missing/invalid required field → calculation blocked; inline error under each problem field; red border; focus moves to the **first error field in DOM order**; screen-reader summary "Please fix N fields to continue" (`role="alert"`).
- Specific messages: DOB "Please enter your date of birth" / "Please enter a valid date" (31 Feb and future dates rejected); TOB "Please enter your time of birth (hour, minute, AM/PM)"; POB "Please select your place of birth from the list"; name "Please enter your name". Partial date/time says which part is missing.
- Errors never show before interaction; validate on blur once touched; clear the moment the field is fixed.
- EN + HI via the language toggle (messages keyed off `document.documentElement.lang`).
- aria-required / aria-invalid / aria-describedby wired; error text uses the AA-contrast error token and is never colour-alone (⚠ prefix + text).
- Backend rejects incomplete birth requests with clear 400s (existing) + future-date rejection (new); no wrong results, no crashes.
- Checked at 360 / 768 / 1024 / 1440 px.

## Architecture (minimal-change, shared-first)

- **New:** `src/components/forms/FieldLabel.astro` (label + `*`/"(optional)"), `src/components/forms/RequiredNote.astro`, `src/scripts/form-validation.ts` (EN/HI catalog, per-field error elements, submit gate, summary, focus, blur/input revalidation).
- **Coordination with S16/S15 (do not break their 37/37 + 28/28 suites):** DateField keeps its own per-field messages + submit guard. Picker guard change (small, additive): on block, **stop short-circuiting** (keep preventDefault, drop stopPropagation), write the form summary, and only self-focus when the form is not validator-managed (`data-vy-fv`) — the shared validator owns final focus in DOM order. form-validation binds at **form-capture** level (always runs after the document-capture picker), reads dt state from the already-enforced hidden inputs / `data-invalid` roots — never re-judges dt internals.
- PlaceField: `*` on label when required, aria wiring, error styling via existing `.pp-status`/`.pp-error`.
- Data format sent to the backend is unchanged everywhere (hidden inputs keep byte-identical values).
- Backend: `validateBirth` gains a future-date rejection (UTC date compare) with a clear message; birth-spec routes inherit it automatically (kundli, match, calculators birth tools). Quick tools (moon-phase, age, vehicle) keep accepting generic dates — their dates are not birth-chart instants except age (DOB) which keeps frontend-only guard; documented.

## Tasks

- [ ] Shared infra (FieldLabel, RequiredNote, form-validation.ts, DateField "(optional)" label support, PlaceField asterisk, picker coordination)
- [ ] Calculators: BirthForm + [tool].astro wiring across all kinds (incl. numerology name fix, vehicle/mobile/names validators)
- [ ] kundli.astro, HomeKundli (name → optional), matching.astro
- [ ] BookingForm + BookingModal
- [ ] Backend future-date rejection + Bun unit tests
- [ ] E2E matrix per form: submit empty · each required field missing in turn · invalid date (31 Feb / future) · place typed-not-selected · fixing clears error · valid submission still calculates
- [ ] QA report (EN+HI, 4 widths, focus/aria, API 400s, contrast) + BMAD review + one commit per logical change + owner push consent

## Acceptance criteria

- AC-1: every truly-required field shows a red `*` with the note line; optional fields read "(optional)"; defaults carry no marker — identically on every surface audited above.
- AC-2: submitting with any required field missing/invalid blocks the calculation, shows per-field inline errors + red borders + summary, and focuses the first error; fixing a field clears its error immediately.
- AC-3: the specific messages from the owner's spec render (incl. part-specific partial date/time, 31 Feb + future-date rejection, place-not-selected); Hindi variants exist for when Hindi forms ship.
- AC-4: valid input still calculates on every form; wire format to the backend is unchanged.
- AC-5: API rejects missing/invalid/future birth input with clear 400s; S15/S16 existing suites stay green.
