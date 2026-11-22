# Place/city field inventory — scan 2026-11-21 (S15-1, owner directive)

Search terms: "place of birth", birthPlace/birth_place, pob, place_id, Places/autocomplete, city, place, location — across all `frontend/src` (+ admin, booking, profile surfaces).

## A. Shared `PlaceField.astro` instances (12, on 8 surfaces)

| # | Surface | File:line | inputId | Variant | Hidden target | Required | Consumer wiring |
|---|---------|-----------|---------|---------|---------------|----------|-----------------|
| 1 | `/` Kundli widget | `HomeKundli.astro:94` | `hk-place` | combined | `hk-city` | yes | submit guard reads combined parts |
| 2 | `/` Panchang widget | `HomePanchang.astro:31` | `hp-place` | combined | `hp-city` | no (New Delhi JS default) | `place:selected` → reload |
| 3 | `/kundli` | `kundli.astro:39` | `k-place` | combined | `city` | yes | FormData guard |
| 4 | `/matching` (boy + girl) | `matching.astro:63` | `boy-place`/`girl-place` | separate | `boy-lat`/`girl-lat`… | yes | id-based guard |
| 5 | `/muhurat` Today island | `muhurat/index.astro:41` | `mt-place` | combined | `city` prefilled `28.6139,77.209,Asia/Kolkata` (+`data-mt-city`) | yes | `place:selected` → reload |
| 6 | `/muhurat` Finder | `muhurat/index.astro:68` | `mf-place` | combined | `city` | yes | FormData guard |
| 7 | `/panchang` | `panchang/index.astro:22` | `pl-place` | combined | `pl-city` | no | `place:selected` → navigate `/panchang/{slug}` |
| 8 | `/calculators/*` birth kind | `calculators/BirthForm.astro:49` | `bf-place` | separate | `lat/lng/tz` | yes | shared guard `[tool].astro:456` |
| 9 | `/calculators/*` transits kind | `calculators/[tool].astro:374` | `bf-place` | separate | `lat/lng/tz` | yes | same guard |
| 10 | `/calculators/*` date-place kind | `calculators/[tool].astro:419` | `bf-place` | separate | `lat/lng/tz` | optional | same guard |

Behaviour lives in `src/scripts/place-picker.ts` (loaded on every chrome page via `Base.astro:169`). **One shared component — extended, not patched per form.**

## B. Location-ish fields NOT on the shared component

- `BookingForm.astro:93` — `bk-location` "Mode / place (optional)": free-text venue/mode note ("Online / Home / Temple + city") sent as a plain string to the booking API. **Excluded** — converting would change the backend payload shape (owner rule).
- `QuickKundli.astro:25` — `<select name="city">`: **dead component, zero imports** — untouched.

## C. Surfaces checked with no place field

`panchang/[city].astro` (fixed-city page), `admin/*`, `BookingModal.astro`, `contact.astro`, legal pages.

## D. Gap analysis vs owner requirements ①–⑧ (baseline `place-picker.ts`)

Already present: hidden-role wipe on typing (③ partial), Esc closes list (⑤ partial), arrows/Enter (⑤).
Missing: × clear button (①), focus/click select-all (②), selection-state tracking + session/suggestion reset (③), free-text validation state (④), second-Esc clears + SR cleared announcement (⑤), 44px tap target + input padding (⑥), prefill/edit mode (⑦ — no `value` prop exists), disabled/readonly handling (⑧).
