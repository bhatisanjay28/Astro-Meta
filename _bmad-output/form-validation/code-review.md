# BMAD Code Review — S18 Required Fields & Validation

**Reviewer:** per-commit review pass (QA mindset, manual BMAD process)
**Date:** 2026-11-22 · **Pre-commit review of:** frontend 11 modified + 2 new files, backend 2 modified
**Verdict:** ✅ **APPROVED for commit** — all review conditions C1–C4 and acceptance criteria AC-1–5 satisfied; evidence in `qa/QA-REPORT.md`.

## Story conditions

| Condition | Assessment |
| --- | --- |
| **C1 — picker edit additive, S16 suites unchanged** | ✅ Picker changes are strictly additive: bilingual `requiredMessage` (new branch logic, same call sites), one early-return in `enforceRoot` (only fires when `data-invalid` is already set — preserves the specific impossible/future message the S18 spec demands), and a submit-guard early-return for `data-vy-fv` forms (unmanaged forms keep the legacy short-circuit byte-for-byte). All S16 behaviours re-exercised incidentally by e2e sections 1/7/8. |
| **C2 — validator never duplicates dt judging** | ✅ `dtErrors()` reads state only (`data-invalid`, `data-dt-required` + hidden value) that the picker already enforced at document-capture phase; it writes no dt state and focuses only still-empty segments. Phase order is structural: document-capture (picker) → form-capture (validator) → bubble (page fetch). When the validator blocks, `stopPropagation` keeps the page handler from fetching bad input. |
| **C3 — no-regression sweep + a11y contrast** | ✅ e2e 62/62 across 14 sections incl. valid submissions on every surface; error-text contrast 6.25:1 light / 7.74:1 dark; `⚠ ` prefix + red border + `aria-invalid` — colour never the sole signal. Astro scoped-CSS pitfall avoided: validator styles are injected at runtime (plain stylesheet), so no `:global()` trap. |
| **C4 — one commit per logical change, consent-gated push** | ✅ Commit plan below; push held for owner consent (main-branch gate). |

## Acceptance criteria

- **AC-1 required marking:** asterisk only where the calculation cannot work without the field (audit matrix in `story.md` §1); `(optional)` on unused Full Name / email / preferred-date; RequiredNote atop every required-bearing form; DateField/PlaceField/FieldLabel carry the marks so all forms render consistently.
- **AC-2 submit gate:** no calculation with missing/invalid required input — asserted on all 14 surfaces; `stopPropagation` guarantees no fetch on blocked submits.
- **AC-3 inline errors:** `.vy-err` inserted afterend the control; picker messages stay under their fields; first-error focus in DOM order asserted per surface; `aria-required`/`aria-invalid`/`aria-describedby` wired; `role="alert"` summary with the owner's exact wording.
- **AC-4 messages:** owner's exact strings (DOB/TOB/POB/name) + part-aware "Please complete the date — day and month missing." style; EN + HI catalogs; lang read at validate time (install-time capture bug found in QA and fixed).
- **AC-5 backend contract:** payloads unchanged (hidden-input contract untouched); API 400s verified live (`qa/api-evidence.txt`); future-date rejection added in `birth.ts` with a unit test — pending push/deploy, documented in the QA report.

## Code-quality notes (non-blocking)

1. `Rule.message` field is vestigial (validate() returns the message) — harmless, kept for structure.
2. Page-supplied text-rule overrides (BookingForm name/phone) are English literals; under a hypothetical /hi/ booking form they'd need the catalog — noted for the future /hi/ build, not reachable today.
3. 360px fix (`col-span-2 sm:col-span-1` on dt fields) changes base-breakpoint layout only (fields stack full-width <640px) — verified no overflow at all four widths; `sm:` layout identical to pre-S18.
4. Backend `birth.ts` rejection message says "a birth chart needs a past date" — worded for the calculator context; fine for all birth-preset callers (free-preset fields bypass this path by design).

## Commit plan (one logical change each)

- backend: `feat(birth): reject future birth dates with a clear message (S18)`
- frontend 1: `feat(forms): shared validation gate + required-marking components (S18)` — form-validation.ts, date-time-picker.ts, forms/FieldLabel+RequiredNote, DateField, PlaceField
- frontend 2: `feat(calculators): required marking + validation on calculator forms (S18)` — BirthForm, [tool].astro
- frontend 3: `feat(forms): birth-detail forms on kundli/home/matching/muhurat (S18)`
- frontend 4: `feat(booking): validation gates on consultation/puja forms (S18)` — BookingForm, BookingModal
- meta: `docs(s18): story, review, QA report + evidence`
