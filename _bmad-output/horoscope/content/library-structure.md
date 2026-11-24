# Paige (Content Writer) — Content Library Structure v1
**Horoscope Upgrade · Step 2 of 5 · 2026-11-24 · companion to [style-guide.md](style-guide.md) and the rule set (`../research/03-ruleset.md` §7)**

The library is a **phrase bank keyed by condition**: the generator computes a condition key per slot from live transit data, then deterministically picks one variant. Nothing is free-written at runtime; a human (or the admin UI) edits rows and the next generation picks them up — editable structured content (owner automation requirement).

---

## 1. Storage

**A. Free-text variants → new table `horoscope_library`** (additive migration at dev step, applied via Supabase MCP per project topology):

```sql
create table if not exists horoscope_library (
  id         uuid primary key default gen_random_uuid(),
  slot       text not null,        -- 'daily.health', 'monthly.overview', 'yearly.love', …
  condition  text not null,        -- 'rating=good.pb=unfav.retro=none'  (§3)
  lang       text not null check (lang in ('en','hi')),
  variant_no int  not null,
  text       text not null,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (slot, condition, lang, variant_no)
);
create index on horoscope_library (slot, condition, lang) where is_active;
```

**B. Fixed strings → existing `content_blocks`** (block_key prefix `horoscope.`, payload jsonb — the S21-proven pattern). These never vary, so they are not library rows:

| block_key | payload |
|---|---|
| `horoscope.disclaimer` | `{ en, hi }` — style guide §7 |
| `horoscope.disclosure` | `{ en, hi }` — style guide §7 (D3) |
| `horoscope.rating_labels` | `{ excellent: {en, hi, glyph}, good: …, moderate: …, challenging: … }` |
| `horoscope.lucky_why` | `{ planet_of_day: {en, hi}, weekday: {en, hi}, sign_lord: {en, hi} }` |
| `horoscope.sadesati_note` | `{ en, hi }` templates with `{{phase}}`, `{{months}}` (D5) |
| `horoscope.chandrashtama_tag` | `{ en, hi }` |
| `horoscope.headers` | `{ monthly_overview, best_days, testing_day, sky_block, year_overview, month_table, area_section }` in both langs |
| `horoscope.month_clause_intro` | table-row reason intro template |

**C. Generated rows → existing `horoscopes` table** (unchanged contract, extended payload): the generator composes final page payloads from library + fixed strings and upserts per (sign, period, date_key, lang). The library is the *source*; `horoscopes` holds the *output* the API serves.

## 2. Slots

| Slot family | Slots | Notes |
|---|---|---|
| `daily.*` | `overview`, `health`, `career`, `money`, `love`, `education`, `family` | career + money render as one compact block (D1); brief's core categories |
| `weekly.*` | `overview`, `health`, `career`, `money`, `love`, `education`, `family` | longer register (style §8) |
| `monthly.*` | `overview`, `health`, `career`, `money`, `love`, `education`, `family` | |
| shared | `thought` (12 house themes × 4 tones), `dos` (12 houses × 2 planet-flavours), `donts` (12 houses × 2 planet-flavours) | period-independent, reused everywhere; **planet-flavours exist because Do and Don't can land on the same house** (e.g., Mercury favourable in H8 while Sun unfavourable in H8) — each house needs a constructive variant (focus/lean-in) and a deferring variant (pace/defer), phrased so they never contradict |
| `yearly.*` | `overview` + one per area ∈ {health, education, career, business, wealth, love, marriage, family, children} | full sections per the brief |
| `clause.*` | `clause.pos`, `clause.neg`, `clause.closing` | month-table reason fragments (ruleset §7.3) |

Best/Testing days, sky & panchang block, lucky triad values, rating chips, month-table numbers: **pure data**, no library rows (ruleset §7.4–7.5).

## 3. Condition keys

Key format: ordered `k=v` pairs joined by `.`; the generator emits exactly the pairs defined for the slot (validators reject rows whose condition doesn't match the slot's schema).

| Slot | Dimensions | Cells |
|---|---|---|
| `daily.health` / `weekly.health` / `monthly.health` | `rating` (4) × `pb` (4: fav/neutral/unfav/**chandrashtama**) × `retro` (2) | 32 |
| other `*.health`-style area slots (career, money, love, education, family) | `rating` (4) × `pb` (3) × `retro` (2) | 24 |
| — `pb` = bucket (fav/neutral/unfav) of the slot's key planet: Moon-house for health; Mercury/Jupiter for education; Saturn for career & family; Jupiter for money; Venus for love (per rule-set weights) | | |
| `*.overview` | `rating` (4) × `retro` (2) | 8 |
| `thought` | `theme` (12 houses) × `tone` (4) | 48 |
| `dos` / `donts` | `house` (12) × `flavour` (2) | 24 each |
| `yearly.overview` | `rating` (4) | 4 |
| `yearly.<area>` (9 areas) | `rating` (4) × `driver` (5: jupiter-good / saturn-phase / rahu-axis / mixed / steady) | 20 per area |
| `clause.pos` / `clause.neg` | `planet` (3: Jupiter, Saturn, Rahu) × `band` (3: fav/neutral/unfav) | 9 each |
| `clause.closing` | `rating` (4) | 4 |

`retro` = single bit: any of Mercury/Jupiter/Saturn retrograde during the period → `review` (style §4 metaphor).

## 4. Variant counts & row estimate (per lang)

| Slot group | Cells | Variants | Rows |
|---|---|---|---|
| `daily.*` areas (6) | 32 + 5×24 = 152 | 6 | 912 |
| `daily.overview` | 8 | 4 | 32 |
| `weekly.*` areas (6) | 152 | 4 | 608 |
| `weekly.overview` | 8 | 4 | 32 |
| `monthly.*` areas (6) | 152 | 4 | 608 |
| `monthly.overview` | 8 | 4 | 32 |
| `thought` | 48 | 4 | 192 |
| `dos` + `donts` | 48 | 4 | 192 |
| `yearly.*` (overview + 9 areas) | 4 + 180 = 184 | 3 | 552 |
| `clause.*` | 22 | 3 | 66 |
| **Total** | | | **≈ 3,230 rows/lang → ≈ 6,460 both langs** |

Yearly cells get 3 variants (published once a year); daily gets 6 (365 days/year). These counts are the **authoring contract** — the pre-publish validator fails any cell with fewer variants than its minimum.

## 5. Selection algorithm (deterministic, no-repeat)

```
v0 = FNV1a64(`${dateKey}|${sign}|${lang}|${slot}|${condition}`) mod N
v  = v0
for k in 1..N-1:                        // dodge repeats within last 2 published days
    if v not in {variant(sign, slot, lang, dateKey-1), variant(sign, slot, lang, dateKey-2)}: break
    v = (v0 + k) mod N
```

- Same inputs → same output (idempotent re-runs; automation requirement #2).
- Monthly/yearly use `dateKey` = `2026-12` / `2027` so cross-month repetition is structurally impossible; the no-repeat window only matters for daily.
- Final gate is validation rule §10 (rule set): *no identical consecutive-day text for the same sign+slot* — assert at publish, alert on failure.

## 6. Authoring & editing workflow

1. Paige authors per-batch Markdown tables (`samples/batch-*.md` style) or CSVs → **import script** upserts to `horoscope_library` (merge on the unique key; re-import is safe).
2. Validator pass (style §11 checklist + §8 length bounds + §3 banned-word grep + trigram originality log) runs before import; violations block the batch.
3. Admin UI (`/admin/horoscopes` extension, dev step) lists rows by slot/condition/lang, allows text edit + `is_active` toggle — no code deploy needed for copy fixes.
4. Deactivating a variant shrinks N; validator re-checks the ≥-minimum rule on next generation run and alerts if a cell falls below minimum.

## 7. What Paige delivers at full build (Step 4 prerequisite)

- All ≈3,130 EN rows + ≈3,130 HI rows in import batches (roughly: daily bank → weekly/monthly bank → shared bank → yearly bank → clause bank).
- All fixed strings (§1B) finalized EN+HI.
- Style-guide §11 sign-off per batch + `originality-check.md` log.
- P11 note: the Jyotishi sign-off gate (D6) reviews the **library** (phrases + mappings) once, then generated output spot-checks — reviewable without reading 6k rows individually.
