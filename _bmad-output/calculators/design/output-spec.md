# Calculator Output Spec — Sally (UX) · Step 3

> 2026-11-21 · Inputs: `_bmad-output/calculators/qa/discrepancy-report.md` (58 findings), research/ 23 files, `frontend/src/styles/tailwind.css` @theme (single source of colour), `frontend/src/pages/calculators/[tool].astro` (current renderer).
> Reference screens: Stitch project `projects/7000631376845729468` — IDs recorded at the bottom of this file.
> Contract with dev: colours/fonts/radii ONLY via existing tokens (no new palette values); all verdict/interpretation text arrives from the API (D12) — the frontend never invents astrology copy.

## 1. One layout, four blocks, every calculator

Every calculator result renders as the same vertical stack. Blocks appear only when the API supplies their data — no fixed order jumping, no bespoke page layouts except the three archetype overrides in §5.

```
[B1 headline]  verdict card (name of the thing + the answer + status chip)
[B2 chips]     up to 4 small facts as pills (nakshatra, pada, lord, gana …)
[B3 meaning]   "What this means" interpretation paragraphs (API `interpretation`)
[B4 details]   labelled detail rows / tables / grids (API detail blocks)
[B5 footnote]  disclaimer line from API `meta.note` / for_fun / verified flags
```

Rationale per owner complaint:
- "not getting all the details" → B1–B5 give every finding's missing output a home: headline verdict (QB-08, QB-03/04), interpretation layer (QN-14, QB-13), structured detail blocks instead of the flat dump (QN-06, QB-12, QB-13), disclaimers/remedies (QN-17/18).
- "alignment is not correct" → B1–B5 are **server-rendered class structures styled by `is:global` rules** (the JS-injected `.row/.k/.v` scoped-CSS bug, discrepancy-report §1). The renderer builds the SAME class names for every tool, so one stylesheet covers all 20 pages at every viewport.

## 2. Component contract (renderer output → CSS)

The JS renderer emits these structures only. All classes are global; styles live in one `is:global` block (or a shared stylesheet) keyed off `[data-calc-result]`.

| Class | Block | Shape | Tokens |
|---|---|---|---|
| `.verdict-card` | B1 | padded card, primary background | `--color-primary` bg, `--color-on-primary` text, `--radius-card`, hairline border `--border-emphasis` |
| `.verdict-eyebrow` | B1 | 11px letterspaced caps label | `color: rgba(on-primary, .8)` |
| `.verdict-main` | B1 | clamp(28px–40px) display font, the answer | `--font-display` |
| `.verdict-sub` | B1 | Sanskrit/secondary line under the answer | 14px, 0.85 alpha |
| `.status-chip` | B1 | Yes/No · In/Out · band chips | auspicious/inauspicious pairs from tokens.css (always label+colour, never colour alone) |
| `.chip-row` | B2 | wrap, gap 8px | — |
| `.chip` | B2 | pill facts | `--color-tint` bg, `--color-border-strong` border, 44px+ tap if interactive |
| `.meaning` | B3 | 1–2 short paragraphs | 14.5px `--color-text`, max-width 640px |
| `.detail-card` | B4 | titled card wrapper | `--bg-raised`, `--color-border-strong`, `--radius-card` |
| `.detail-title` | B4 | 13px 600 label | `--color-text-muted` |
| `.row` / `.k` / `.v` | B4 | `grid-template-columns: minmax(140px,200px) 1fr`; ≤480px: 1 column, label above value (UX audit F8) | `.k` muted 13px, `.v` 14px text colour |
| `.table` | B4 | real `<table>` for dasha/antardasha/transits/grahas | sticky header optional; retrograde = badge chip, not text-in-cell |
| `.loshu` | B4 | 3×3 grid, cell = number + planet label | present: tint bg + strong number; missing: dashed border + faint number (never colour-alone — legend text also says it) |
| `.flagline` | B5 | 12px muted footnote | `--text-dim` |

**Progress/bars** (sade-sati phase progress, dasha elapsed): simple div bar with `--color-primary` fill on `--color-tint` track + visible start/end dates and % text (not colour-alone).

## 3. States (all four, every page)

| State | Render | Notes |
|---|---|---|
| empty | current `.hint` placeholder line | unchanged |
| loading | `.hint` "Calculating…" + `aria-busy="true"` on result region | no spinner library; text is enough at this latency (~200ms) |
| error | `.hint.err` with API `error.message` verbatim + a "check the inputs" suffix when 4xx | keeps honest empty-state rule |
| results | B1–B5 stack | `aria-live="polite"` already present |

## 4. Per-calculator mapping (headline + chips + details)

API is the source of truth for the words; this table fixes where each API field renders. (Fields marked ✚ are the new/renamed API fields from the discrepancy report §5–6.)

| Tool | B1 headline (eyebrow → main) | B2 chips | B4 details |
|---|---|---|---|
| rashi | MOON SIGN → rashi name | nakshatra · pada · lord | longitude, deity, gana ✚, sign lord ✚ |
| nakshatra (new page) | NAKSHATRA → name | pada · lord · deity | longitude, gana, yoni/taste ✚ |
| lagna (new page) | ASCENDANT (LAGNA) → sign | lord · degree | birth UTC echo ✚, house-cusp note |
| vimshottari-dasha (new page) | CURRENT PERIOD → "Mahadasha lord" | elapsed % · next change date | mahadasha timeline bar + antardasha `.table` with Past/Current/Upcoming chips ✚ |
| sade-sati | VERDICT → In/Not in Sade Sati | moon sign · phase ✚ | window start/end ✚ first-entry (D-QB06), dhaiya rows ✚, next window, as_of echo ✚ |
| mangal-dosha (+gender ✚) | VERDICT → Manglik / Not Manglik | from_lagna/moon/venus chips | per-frame rows, cancellation reasons ✚ (flags never suppressed — QB-05) |
| kaal-sarp | VERDICT → Full/Partial + type ✚ | rahu/ketu degrees | per-planet hemming table ✚ |
| karakas | SOUL SIGNIFICATOR → Atmakaraka planet | AK degree · scheme ✚ (7/8) | full ranking table, AK row highlighted |
| ishta-devata | ISHTA DEVATA → deity name | via planet ✚ · source ✚ | karakamsha derivation rows ✚, disputed flag line |
| transits | CURRENT SKY → "now" stamp ✚ | count · location | grahas `.table` (planet, sign, degree ✚, nakshatra ✚, retro badge ✚) — replaces 1825px row dump (QB-12) |
| moon-phase | PHASE → phase name | illumination % ✚ · lunar age | phase-instant times ✚, next NM/FM, icon optional |
| sun-sign | WESTERN SUN SIGN → sign | vedic rashi · element ✚ | dates covered ✚, cusp warning when within ±1° of ingress ✚ |
| numerology | DESTINY (BHAGYANK) → number | mulank · namank · lords | full shape: sums, chains, master flags ✚ (consistent destiny shape per decisions) |
| destiny-number | DESTINY NUMBER → n | mulank · lord chips | sum, chain, master flag |
| lo-shu | GRID VERDICT → "Missing 3, 5" | missing ✚ · repeated ✚ chips (sorted) | `.loshu` 3×3 grid ✚ + planes/arrows rows ✚ |
| name-numerology | NAME NUMBER → root | lord · system chip | per-word subtotals ✚, letters with values ✚ |
| mobile-numerology | MOBILE NUMBER → root | lord · length warning ✚ | digit sum chain ✚, prefix strip note ✚; optional owner-DOB compatibility verdict ✚ |
| vehicle-number | PLATE VERDICT → favourable/not ✚ | mulank · bhagyank | School A digits ✚ + School B letters ✚, consensus matrix rows ✚ |
| age | AGE → "Xy Ym Zd" | total days · day of week ✚ | months/weeks/hours ✚, next-birthday countdown ✚ |
| name/love/friendship | SCORE → root or score | band chip ✚ | shared letters trace ✚, subtotals; D-QF10 LOVES/FRIEND work shown ✚ |
| flames | FLAMES → letter word | score chip | round-by-round elimination trace ✚, letter set |

## 5. Archetype overrides (reference screens)

1. **Standard result (mobile)** — every tool's default; rashi shown in screen #1.
2. **Dasha table (desktop)** — vimshottari page: current-period hero + proportional timeline bar + antardasha table; screen #2.
3. **Lo Shu grid (mobile)** — `.loshu` centerpiece + legend chips + plane cards; screen #3.
4. **States sheet (mobile)** — loading/error/empty composition; screen #4.

## 6. Non-goals this pass

- No new fonts, no new colours, no icon set (emoji only where API copy already uses none — icons deferred).
- Gochara overlay for transits (decisions.md) — deferred; table view only.
- Kundli/matching pages keep their existing dedicated layouts; this spec governs the calculator registry pages only.

## 7. Stitch screens (project `projects/7000631376845729468`)

| # | Screen | ID |
|---|---|---|
| 1 | Calculator result — standard (mobile) | `screens/fb4fae0b63d048d4a6a7576c3ffd2710` (+ variant `screens/19d84f664ba043a2b584dff7dcaa628e`) |
| 2 | Vimshottari dasha table (desktop) | `screens/8e4f11aade514b63b8ea7bbec649437f` (+ variant `screens/46d37c46151041cd83e407b17d63906b`) |
| 3 | Lo Shu grid (mobile) | `screens/d032eb7e8b6042d69cb9f4119cfcc98a` |
| 4 | Loading / error / empty states (mobile) | `screens/757c570f1e5546628f21fc336a600c81` |

All screens COMPLETE in Stitch; screenshots downloadable from the project (used as visual reference only — implementation maps everything onto tokens.css per §2).
