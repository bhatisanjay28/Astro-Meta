# BMAD review — S18 story

**Date:** 2026-11-22 · Reviewer: BMAD process (manual, per DECISIONS.md) · Verdict: **APPROVED with 4 conditions**

## Analyst / PM lens

- Audit is complete and honest: 16 live surfaces + 2 out-of-scope + 1 dead-code finding. The owner's rule ("required only if the calculation cannot work without it") is applied field-by-field, not copy-pasted.
- **Decision to defend — time required on matching + birth tools:** the backend *can* default noon, but the owner's own problem statement lists TOB as needed and their spec demands a TOB error message. A silently-defaulted noon can flip nakshatra/guna boundaries — i.e. a "wrong result", which the owner explicitly forbids. Requiring TOB is the faithful reading. Documented in the story.
- BookingModal email required vs BookingForm email optional: pre-existing product asymmetry (modal is the D11 consent design). S18 only *marks* it; no data policy change. Owner can unify later.

## Architect lens

- The picker/validator coordination is the risky seam. Condition C1: the date-time-picker edit must be additive and observable — S16's unit (37/37) + e2e (57/57) suites must pass unchanged; if `stopPropagation` removal causes any page's own submit handler to fire on an invalid dt form, guard by checking `data-invalid`/required-empty state in those handlers (kundli/matching/HomeKundli/[tool] place-guards already read hidden inputs, which remain enforced — verify each).
- Condition C2: form-validation must never duplicate dt judging. Read state (hidden value + `data-invalid`), don't re-parse segments — one source of truth per field type.
- Shared components are the right lever: BirthForm covers 9 tools at once; FieldLabel/RequiredNote keep the marker pattern single-sourced.
- Data format unchanged: verified per surface — hidden dt inputs byte-identical, place role inputs unchanged, booking body unchanged.

## QA-mindset lens

- The e2e matrix in the story matches the owner's test directive (empty, each required field missing in turn, invalid date, place typed-not-selected, fix-clears, valid-passes). Add: focus assertion per form and the summary text count check.
- Condition C3: no-regression sweep beyond new tests — ZC pair pages, S15/S16 e2e, and a Lighthouse-style a11y pass on one instrumented form (error contrast AA in light+dark).
- Backend future-date check must be UTC-date compare and documented as birth-spec-only (moon-phase/vehicle/age keep generic dates).

## SM lens (scope)

- No scope creep: QuickKundli untouched (dead), compatibility untouched (no birth details), Hindi stays message-catalog-only (no /hi/ forms exist to mark — honest empty state remains the /hi/ reality).
- Condition C4: commits follow the one-logical-change rule and push stays consent-gated.

**Verdict: APPROVED** — proceed with C1–C4 as implementation gates.
