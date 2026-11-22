# S20 — Clear the 7 pre-existing astro-check errors (frontend CI green)

## Why

Frontend CI runs `bun run check` (astro check) on every push. It has been failing on
7 pre-existing type errors since before S19, which means the only real signal in the
CI gate is noise. With S18's lesson ("run astro check locally before pushing") we
want the gate to be a hard precondition, not an advisory — so the errors must go.

## Scope (types + one real defensive branch; zero behavior change)

### A. DateField segment inputs — 5 × ts(2322), all one cause

`DateField.astro`'s `segProps` helper returns `inputmode: "numeric"` from an untyped
arrow function → TS widens it to `string`, which is not assignable to Astro's
`InputHTMLAttributes.inputmode` union (`"search" | "text" | "email" | "url" | "tel" |
"numeric" | "none" | "decimal" | null | undefined`). All 5 errors (lines 136, 140,
144, 195, 199) die on one fix: `inputmode: "numeric" as const` — the helper already
uses `as const` for `type` and `enterkeyhint`; this attribute was simply missed.

### B. Compatibility picker handlers — 2 × ts(18047), `key` possibly null

`matching`-style picker handlers in `compatibility/index.astro` (:139) and
`compatibility/[sign1]/[sign2].astro` (:187) call
`const key = canonicalPairSlug(s1, s2)` — which returns `string | null` (`src/lib/zodiac-signs.ts:36`)
— then `key.split("-")` without a guard.

Fix: add `if (!key) return;` after the call. This is a real defensive branch, not a
type silencer: if a sign value ever falls outside the 12-sign canonical list, the
handler must not navigate to `/compatibility/undefined/…`. The guard's sibling
checks (`if (!s1 || !s2) return;`) establish the exact pattern.

## Non-goals

- No UI/copy/behavior change. `as const` is compile-time only; the null guard is
  unreachable with today's fixed `<select>` options.
- ts(80006)/ts(6133) **warnings** elsewhere are untouched — warnings don't fail CI.

## Acceptance criteria

1. `bun run check` (astro check) reports **0 errors**.
2. `bun test scripts/` still green (date-time-core unit pins unaffected).
3. `bun run build` green; spot-diff of a dist page containing a DateField shows
   identical HTML to the pre-fix build (no runtime delta).
4. Compatibility picker e2e path still navigates (manual e2e spot check on preview).
