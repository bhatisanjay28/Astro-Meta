# Age Calculator — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Computes exact calendar age between a **date of birth** and an **"age at" date** (default: today): years/months/days, totals, day of week born, and a next-birthday countdown. It is a utility (not an astrology tool), but it is one of the highest-traffic "calculator" queries on the web and a standard trust-builder page for a calculator site.

Audience: everyone — form-filling (Visa/government forms ask age in Y/M/D), parents (baby age in weeks/months), event planning, and the common "how many days until my birthday" query. calculator.net notes the Western convention used (age increments on the birthday) vs traditional Chinese reckoning (age 1 at birth, increments at Lunar New Year) — Vyotish uses the Western convention, which is also what Indian users expect on a web calculator.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| date of birth | required | ISO `YYYY-MM-DD` | 1900-01-01 – today (past only) | — | start of the interval |
| age at date ("now") | optional | ISO `YYYY-MM-DD` | ≥ DOB | today (server local date, or user's local date) | lets users compute age at a past/future date (exam eligibility, "how old was I on X"); default today |
| birth time | optional | `HH:MM` local | 00:00–23:59 | 00:00 | only needed if showing live hours/minutes/seconds age |

Note: age is a **date-based** quantity — no timezone parameter is needed as long as "today" uses the user's local calendar date, not UTC (a UTC-based "today" is wrong for IST users before 05:30 IST).

### Recommended input set
`date of birth` (required) + `"age at date"` (optional, defaults today, user's local date) — this is calculator.net's exact input model and the standard for the category. Birth time optional and only used for the live seconds counter.

### Current Vyotish input set
`GET /calculators/age?date&now` — `now` optional, defaults today **UTC**, and not exposed in the UI at all. Gap: UI hides the "age at date" power feature, and UTC-defaulted "today" can be the wrong day for IST users between 00:00 and 05:30 IST.

## 3. Formula(s) / method

### 3.1 Exact Y/M/D subtraction (same-day-of-month method — RECOMMENDED)
Let DOB = (Y₁, M₁, D₁) and end = (Y₂, M₂, D₂):

```
years  = Y₂ − Y₁
months = M₂ − M₁
days   = D₂ − D₁
if days < 0:                    # borrow from the month before the END month
    months -= 1
    days += days_in_month(Y₂, M₂ − 1)     # e.g., end March → borrow February's length (28/29)
if months < 0:
    years  -= 1
    months += 12
```

`days_in_month(y, m)` = {31, 28/29 (leap: y%4=0 and (y%100≠0 or y%400=0)), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}. Borrow rule: when D₂ < D₁, add the length of the calendar month immediately **before the end month** — this is the algorithm calculator.net documents as its method ("counting from the same day-of-month, then adding remaining days"), chosen over the end-of-month coalescing method. The two conventions differ only when both dates are month-ends: calculator.net's own example — Feb 28 2022 → Mar 31 2022 is "1 month 3 days" by same-day-of-month vs "1 month" by end-of-month; both reasonable; **recommend same-day-of-month** (deterministic, matches the borrow algorithm with no special cases).

### 3.2 Feb 29 birthdays (leaplings) — legal vs celebratory
Under algorithm 3.1 a Feb 29 DOB ages naturally on **March 1** in common years (the borrow rule takes the year to complete at Mar 1, since Feb has 28 days). This matches the strict legal computation (University of Iowa College of Law analysis: Feb 29 is the day *after* Feb 28, so a leapling legally turns a year older on Mar 1 in common years; consistent with FRCP 6-style "same date next month" deadline logic). Administrative practice varies — US DMV systems commonly use Feb 28 — and celebratory practice is split (Feb 28 or Mar 1; Ireland's "Bachelor's Day" tradition). **RECOMMENDATION:** use the algorithm's natural Mar 1 result, and display a note on Feb 29 DOBs: "Born on a leap day — age completes on Mar 1 in non-leap years (some jurisdictions use Feb 28)." Document it as our convention; do not special-case.

### 3.3 Total days
`total_days = (end_date − DOB)` as a plain difference of calendar dates (both UTC midnights of those civil dates). Equivalent check: total_days = 365×years + leap_days(covered Februaries) + offset_in_year. Total weeks = floor(total_days / 7); hours = total_days × 24 (only exact if DOB time omitted → convention: measure from 00:00 local of DOB and 00:00 local of end date; label the hours line "assuming midnight" or only show it when birth time is given).

### 3.4 Next-birthday countdown (common competitor feature)
`next_birthday = the next occurrence of the anniversary date on/after end_date`: anniversary = Feb 29 if that year is a leap year, else Mar 1 (per §3.2); `days_until = (next_birthday − end_date)`. On the birthday itself days_until = 0 and the UI should say "Happy Birthday — today".

### 3.5 Day of week born
Standard weekday computation (Zeller's congruence or any date library): e.g., DOB 2000-02-29 → **Tuesday**; 1990-07-15 → **Sunday**. Trivial with a date library; no custom formula needed.

## 4. Worked examples (≥3: normal, edge, boundary)

### Example 1 — normal: DOB 1990-07-15, age at 2025-11-21
- years = 2025 − 1990 = 35; months = 11 − 7 = 4; days = 21 − 15 = 6 → **35 years, 4 months, 6 days**
- total_days: 1990-07-15 → 2025-07-15 = 35×365 + 9 leap Februaries (1992…2024) = 12784; + Jul 15→Nov 21 = 31+31+30+31+6 = 129 → **12913 days** (= 1844 weeks + 5 days; 310,0 wks approx → 12913/7 = 1844.7)
- day of week born: **Sunday**
- next birthday 2026-07-15: days_until = 30+31+31+28+31+30+31+24 = **236 days**

### Example 2 — edge: DOB 2000-02-29 (leapling), age at 2025-02-28 vs 2025-03-01
- **At 2025-02-28:** years = 25, months = 2−2 = 0, days = 28−29 = −1 → borrow: days += days_in_month(Jan 2025) = 31 → days = 30, months = −1 → years = 24, months = 11 → **24 years, 11 months, 30 days** (still 24 — correct under the Mar 1 convention). total_days = 8766 (2000-02-29→2024-02-29: 24×365 + 6 leap days) + 364 = **9130**. Next birthday: 2025-03-01 → days_until = **1**. Day of week born: **Tuesday**.
- **At 2025-03-01:** years = 25, months = 1, days = 1−29 = −28 → borrow: days += days_in_month(Feb 2025) = 28 → days = 0, months = 0 → **25 years, 0 months, 0 days**; total_days = **9131**. Test pair: `age(2000-02-29, 2025-02-28) = {24,11,30,9130}` and `age(2000-02-29, 2025-03-01) = {25,0,0,9131}` — this is the automated leap-day regression test.

### Example 3 — boundary (month-end ambiguity): DOB 2022-02-28, age at 2022-03-31
- Same-day-of-month method: months = 1, days = 31−28 = 3 → **0 years, 1 month, 3 days** (calculator.net's documented choice).
- End-of-month variant would give 0 years, 1 month, 0 days. Document the chosen method in `meta.method = "same-day-of-month"`.
- Companion boundary cases: DOB 2002-01-31, age at 2025-02-28 → 23y 0m 28d (borrow 31 from Jan); DOB == end date → 0y 0m 0d; end date == day before first birthday → 0y 11m 30d or similar via borrow.

## 5. Complete output list

A GOOD age calculator shows:
1. **Age in years / months / days** (the headline result).
2. **Totals**: total months, total weeks (+ remainder days), **total days**, total hours (and optionally minutes/seconds with a live ticker if birth time given).
3. **Next birthday**: date + days-until countdown (and "today — Happy Birthday" state).
4. **Day of week born**.
5. Leap-day note when DOB = Feb 29 (which convention used).
6. `meta.method` string ("same-day-of-month borrow algorithm") for transparency.
7. Nice-to-have: half-birthday, exact "10,000 days old" milestones (timeanddate's Special Age / 1-billion-seconds features).

**Comparison vs competitors**
- calculator.net — inputs DOB + "age at date"; outputs years/months/weeks/days/hours/minutes/seconds; documents its same-day-of-month method and the end-of-month ambiguity; Western birthday convention (also contrasts Chinese reckoning). Closest to what Vyotish should be.
- timeanddate.com — age in Y/M/D + total months/days + **day of week born** + **next-birthday countdown**; separate Special Age Calculator (1-billion-seconds style milestones) and countdown timer.
- Generic app-store age apps — DOB + next-birthday countdown in months/days; table-stakes feature set.

### Current Vyotish outputs
`GET /calculators/age?date&now` → `{years, months, days, total_days}`; `now` defaults today **UTC** and is not exposed in the UI. Page: `/calculators/age`.

### Initial gap list
1. **No next-birthday countdown** (the single most-asked follow-up; every major competitor has it).
2. **No day-of-week born**.
3. No total **weeks/hours** breakdown (Vyotish has total_days only).
4. `"age at date"` (`now`) **not exposed in the UI** — hidden power feature; also defaults to UTC-today, which is wrong for IST users before 05:30 (should use user's local date).
5. No Feb 29 convention note; behavior currently undocumented (verify it matches §3.2 after implementing borrow rules).
6. No `meta.method`/label of the counting convention; no happy-birthday / invalid-date UX states.

## 6. Edge cases and validation rules

1. **DOB in the future** → reject with clear error (or interpret as negative age deliberately? No — reject; calculator.net behavior treats it as invalid input).
2. **end < DOB** → reject ("age at date must be on or after date of birth").
3. **Feb 29 DOB in common years** → anniversary = Mar 1 (recommended, documented); on Feb 28 the age must still show the old year (24y 11m 30d in example 2).
4. **Borrow month length:** borrowed month is the one **before the end month** — e.g., end = March borrows February (28/29); end = March in a leap year borrows 29. Test both (2000-02-29→2025-03-01 uses 28; 2000-02-29→2024-03-01 must use 29 → age(2000-02-29, 2024-03-01) = 24y 0m 1d; check: 24y at 2024-02-29 + 1 day ✓).
5. **Same-day-of-month vs end-of-month** — one documented method only (`meta.method`), with the calculator.net Feb 28→Mar 31 pair as the regression test.
6. **"Today" is local-date based** — server must resolve "today" in the user's timezone (or accept an explicit `tz` param); never use UTC-today for IST (day rolls at 05:30 IST).
7. **Range limits:** DOB before 1900 → allow but warn (most forms don't need it); end date far-future → allow (eligibility checks) but no live ticker.
8. **Total-days consistency:** total_days must equal (end − DOB) exactly; assert `age_days` reconciles with Y/M/D within ±1 day depending on month lengths (e.g., 1 month can be 28–31 days) — document that Y/M/D and total days are different projections of the same interval, not convertible to each other exactly.
9. **Leap-year arithmetic:** use a date library for day-difference; never hand-roll 365.25 multipliers.

## 7. Sources

- calculator.net — Age Calculator (inputs DOB + "age at date"; Y/M/W/D/H/M/S outputs; same-day-of-month method; Feb 28→Mar 31 "1 month 3 days" example; Western vs Chinese age convention): https://www.calculator.net/age-calculator.html
- timeanddate.com — Special Age Calculator & birthday tools (age Y/M/D, totals, day-of-week born, next-birthday countdown, milestone ages): https://www.timeanddate.com/date/birthday.html
- University of Iowa College of Law — "The Law Doesn't Care About February 29th" (legal reasoning that a Feb 29 birth ages on March 1 in common years): https://law.uiowa.edu/law-doesnt-care-about-february-29th
- Leap-day legal-practice discussion (DMV Feb 28 vs legal Mar 1; celebratory split; Ireland's Bachelor's Day): https://en.wikipedia.org/wiki/February_29 (section on leap-day birthdays) + WebSearch aggregation of state-practice anecdotes
- Python `datetime`/proleptic Gregorian calendar arithmetic for total-days: standard library behavior (no external claim).
