# Decisions — Zodiac Sign Compatibility (Epic ZC)

Running decision log, BMAD convention (matches `_bmad-output/calculators/decisions.md`). Dated 2026-11-22 unless noted.

## D-ZC1 — Page lives at `/compatibility` (frontend), card on `/astrology` hub
Top-level route like `kundli.astro` / `matching.astro` (Astrotalk also uses `/compatibility` for flow familiarity). The Astrology hub (`/astrology` SECTIONS) gains a fifth card; no NAV_TABS change (nav is frontend config per D12 boundary, hub is the entry point).

## D-ZC2 — API shape: two GETs, symmetry canonical
- `GET /api/v1/compatibility/signs` → 12 signs for selectors (slug, name, element, modality, ruler, approximate dates).
- `GET /api/v1/compatibility/signs/pair?sign1=&sign2=` → full result (overall score/band, categories, tips, disclaimer, `verified:false`).
Symmetry: data stored once per unordered pair (78 unique: 12 same-sign + 66 off-diagonal); ordered lookup mirrors presentation (own vs partner labels) without duplicating content. Reuses lowercase slugs `aries…pisces` (horoscope convention) and element/date metadata patterns from `SUN_SIGN_META` (`src/engine/calculators.ts`).

## D-ZC3 — Storage: structured TS/JSON data module in backend (not Supabase)
Static editorial content (144-pair explanations) is versioned with the code like all other static content modules (horoscope rashiphal lives in a Supabase table because it rotates by period/lang; calculator interpretations live in engine modules). Pair compatibility text is pure static content → backend data module, editable in one file, reviewable in PRs. If the owner later wants CMS editing, migrate to Supabase with the same JSON shape (shape documented so migration is mechanical).

## D-ZC4 — Score model: deterministic from aspect/element/modality/rulers
Scores derive deterministically from the scoring basis in `research/pair-matrix.md` (aspect + element consensus, documented banding) — no runtime LLM, no random. Explanation text is per-pair authored content keyed by slug pair; scores are computed so the matrix stays internally consistent and testable.

## D-ZC5 — Same-sign pairs are nuanced, not auto-perfect
Follows research finding (conjunction reads as strong similarity, with friction points). Leo/Leo must not return "100 — perfect".

## D-ZC6 — Honesty framing carried through
`verified:false` (P11 register) on astrological verdicts; "for guidance and entertainment" disclaimer in API payload + page footer of results; no medical/legal/absolute claims (content gate AC-Q2).

## D-ZC7 — Originality is a hard gate
Paige's content passes a scripted ≥6-gram overlap check against the fetched source corpus before dev consumes it. Corpus (reference pages fetched for structure study) stored under `research/corpus/` for the check only, never shipped.

## D-ZC8 — Formula canonical; exactly ONE table slip (row 22); exaltation outranks domicile
First hand-verification pass contained an analyst-side error (earth–air mis-mapped as "cross" in half the checks). Full 78-row re-verification with the research's actual element mapping (contrary = fire–water AND earth–air; cross = fire–earth AND air–water): **77 of 78 table rows match the §2 formula exactly**, including all bands (§5 distribution: Excellent 10 / Strong 26 / Mixed 6 / Challenging 33 / Very challenging 3), the extremes (min Aries–Cancer 38, then Gemini–Pisces 39, Virgo–Sagittarius 39; max 91), all six oppositions = 59 and all 12 same-sign = 80.
- **One slip: row 22 Taurus–Aquarius** — table 45, formula 42 (earth–air contrary −3 missed; stays Challenging). Engine asserts 42.
- **Dignity precedence:** for the one dual-dignity case (Mercury is both domicile AND exalted in Virgo), the table counts exaltation (+3) — Gemini–Virgo = 47 per §6.7. Engine checks exaltation before the domicile short-circuit.
Rule: A, B in formula; the §4 table remains the QA reference.

## D-ZC9 — Content ships as one consolidated `pairs.json` in the backend
Writers produce per-base-sign JSON in `_bmad-output/zodiac-compatibility/content/pairs/` (12 files, parallel-safe); a consolidation script merges them into `backend/src/data/sign-compatibility/pairs.json` (single canonical import — no 12-file import choreography, no writer collisions). Editing later: edit the backend JSON directly (PR-reviewed) or the workspace source + re-run the script.

## Open (owner gates)
- **G1** Final category set — **RESOLVED 2026-11-22**: 6 scored (Love, Sexual, Friendship, Communication, Trust, Emotional) + text-only Relationship Tips; 35–95 honest range; hub + 78 static pair pages.
- **G2** Commit/push consent — end of epic, per operating rules (frontend push now deploys vyotish.com — D8 gate consumed 2026-11-21).
