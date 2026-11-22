# Inventory — every date & time field on the site (S16 scope)

> Sweep method: grep for `type="date" | type="time" | type="datetime-local"` across all
> `src/**/*.{astro,ts}` + script-injected input audit (`createElement("input")` — none found).
> Verified 2026-11-22 against frontend @ 3cf3301.

## A. Birth date + birth time — mode `birth` (no future, no impossible dates, year ≤ 100y back)

| # | File | Fields | Integration contract (must keep working) |
|---|------|--------|------------------------------------------|
| A1 | `src/components/home/HomeKundli.astro:83,88` | DOB + TOB (required) | page script reads `[data-dob]`/`[data-tob]` `.value` — attrs must land on the element holding the value |
| A2 | `src/pages/kundli.astro:30,31` | Birth date + Birth time (required; time prefill `10:00`) | `FormData` reads `name="date"` / `name="time"` |
| A3 | `src/pages/matching.astro` | boy-date/time, girl-date/time (date required, time optional) | page script reads `getElementById("boy-date").value` etc. — hidden inputs keep the ids |
| A4 | `src/components/calculators/BirthForm.astro:40,44` | bf-date (required) + bf-time (optional) — 9 birth-kind calculators | `FormData` `name="date"`/`name="time"`; `[tool].astro` guard reads `[name="time"]` |
| A5 | `src/pages/calculators/[tool].astro:387,393` | bf-date ("Date of birth" for age; numerology dates; "Date" for moon-phase/vehicle) + bf-time (sun-sign optional birth time) | `FormData`; registry decides birth vs free date mode |
| A6 | `src/components/QuickKundli.astro:19,20` | dead code (zero imports — S15-1) but has date+time | swap for consistency (FormData contract) |

## B. Non-birth date fields — mode `free` (past + future valid; behavior-neutral, no new min/max rules)

| # | File | Fields | Integration contract |
|---|------|--------|----------------------|
| B1 | `src/components/BookingForm.astro:89` | bk-date `name="date"` (puja preferred date) | `FormData` |
| B2 | `src/components/BookingForm.astro:100` | bk-date `name="preferred_date"` (consultation) | `FormData` → `payload.preferred_date` |
| B3 | `src/components/home/BookingModal.astro:55` | bk-date (home modal) | `form.querySelector("#bk-date").value` |
| B4 | `src/components/PanchangDetail.astro:21` | panchang lookup date | script SETS `dateInput.value =` (init + prev/next buttons) AND listens for `change` — needs hidden input with `data-pd-date` + dispatched `change` + programmatic `set` seam |
| B5 | `src/pages/muhurat/index.astro:66,67` | from + to (required range) | `FormData` `name="from"`/`name="to"` |

## C. Calculator extra-field date/time (registry `extraFields`)

| # | Tool | Field | Mode |
|---|------|-------|------|
| C1 | sade-sati | as_of "Check as of date" (type date) | free |
| C2 | age | now "Age at date" (type date) | free |
| C3 | moon-phase | time "Time (UTC)" (type time) | time, 24-hour (UTC) |

## D. Admin

| # | File | Field | Notes |
|---|------|-------|-------|
| D1 | `src/pages/admin/posts/edit.astro:29` | publish_at `datetime-local` | loads `p.publish_at.slice(0,16)` ("YYYY-MM-DDTHH:MM") via `set("#publish_at", …)`; sends `new Date(val).toISOString()`; blank = publish immediately |

## Out of scope (no date/time input)

- `bk-time` "Preferred time" in BookingForm is **free text** ("e.g. morning / 6 pm IST") — a preference note, not a time value; stays text.
- `panchang-calendar.ts`, horoscope pages, hi/, consultations, poojan, blog front-end — no date/time inputs (verified).
- Admin `horoscopes.astro` / `blocks.astro` / `settings.astro` etc. — no date/time inputs.

**Totals: 12 date inputs + 6 time inputs + 1 datetime-local = 19 instances across 10 files.**
