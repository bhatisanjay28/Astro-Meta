# Horoscope Upgrade — Step 1: Mary (Analyst) research bundle
**Date: 2026-11-24 · Status: Steps 1–3 APPROVED by owner · Step 4 (dev: pipeline + cron + SSR + tests) IN PROGRESS**

## Files

| File | Contents |
|---|---|
| [01-vedic-horoscope-methodology.md](01-vedic-horoscope-methodology.md) | How Daily/Weekly/Monthly/Yearly horoscopes are derived in the Vedic tradition (Moon-sign gochara), transit durations per planet, classical sources (Phaladeepika Sastri 1950 on archive.org + corroborating English references), lucky colour/number/direction/mantra/deity basis, all citations, UNVERIFIED markers, and what we deliberately don't do |
| [02-reference-site-analysis.md](02-reference-site-analysis.md) | PanchangBodh, Astrotalk, Astro Arun Pandit: structure, categories, user flow, features, strengths/weaknesses; comparison table vs. our plan; features worth adopting; anti-features we avoid |
| [03-ruleset.md](03-ruleset.md) | **The rule set** — the repeatable engine spec: inputs, favorable/vedha tables for all 9 grahas, category weights for all 9 areas, score→4-band ratings, Sade Sati modifiers, deterministic lucky colour/number/direction/mantra/deity assignment, Do's & Don'ts house-theme taxonomy, text condition keys for the content library, sign constants for all 12 signs, validation rules, and 5 open editorial decisions |
| [04-existing-code-review.md](04-existing-code-review.md) | What exists and is reused (engine, `horoscopes` table + API + admin CRUD, cron/upsert pattern, 72 page shells, PanchangDetail pattern, tokens, QA harness, fonts for Hindi), the 8 gaps to fill, risks (P11 sign-off scope, IST date nit, sample rows) |

## One-paragraph summary

Vyotish horoscopes will be **computed, not written**: a rule set (03) maps our existing Lahiri-sidereal astronomy-engine transits — house-counted from each reader's Moon sign — through classical favorability/vedha tables into per-category ratings and data-driven conditions; a content library (Step 2) supplies original EN+HI phrasing per condition; a cron pipeline generates dated rows into the existing `horoscopes` table (unique key already gives idempotency) 7+ days ahead with fallback, validation, alerting and a health extension; the existing 72 page shells render it server-visibly using the proven PanchangDetail pattern. The engine and infrastructure exist; the generator, content library, and automation are net-new.

## Assumptions stated (per the ≤3-question rule — none blocked this step)

1. Reference sign = **Vedic Moon sign (rashi)**, per the brief and site positioning; horoscope pages will say so plainly.
2. All content generated **dasha-independent / chart-generic** (public horoscope; no birth data) — matches the brief's yearly requirement; chart-based personalization stays out of scope.
3. Six periods preserved: yesterday/daily/tomorrow/weekly/monthly/yearly (existing URLs); the brief's four are a subset — yesterday/tomorrow are free byproducts of the same engine.
4. Hindi = second language per row (API already supports `lang=hi`, Devanagari fonts self-hosted); whether `/hi/` routes or an in-page toggle ships is a Sally/owner decision.

## Decisions needing the owner (also listed in 03 §11)

1. Add compact **Career + Money** line to daily/weekly/monthly? (default: yes)
2. Single lucky number or add a "friendly number"? (default: single)
3. On-page "How we compute this" disclosure block? (default: yes)
4. Ratings chips visible on daily pages? (default: monthly best/testing + yearly table only)
5. Sade Sati phase + year range shown on yearly pages when applicable? (default: yes, gentle phrasing)
6. Extend P11 Jyotishi sign-off gate to cover horoscope content? (default: yes, before launch)
