# Phrase-bank research — grounding for the full `horoscope_library` authoring (2026-11-24)
**Companion to 03-ruleset.md (engine semantics) and content/style-guide.md (voice). This file records WHAT the tradition says so the bank's text is grounded; every sentence in the bank remains original wording (style §9).**

## 1. Classical gochara (transit) tables — verified against our engine

Standard favourable houses from the janma rashi (Moon sign) per BPHS gochara chapter and Phaladeepika ch. 26 (Mantreswara) — **match `backend/src/horoscope/rules.ts` `FAVORABLE_HOUSES` exactly**:

| Planet | Favourable from Moon | Note |
|---|---|---|
| Sun | 3, 6, 10, 11 | courage, competition, status, gains |
| Moon | 1, 3, 6, (7), 10, 11 | Phaladeepika 26.2 order: 7,1,6,11,10,3 minus vedha |
| Mars | 3, 6, 11 | effort, competition, income |
| Mercury | 2, 4, 6, 8, 10, 11 | incl. 8th — Mercury is largely vedha-exempt |
| Jupiter | 2, 5, 7, 9, 11 | wealth, children/learning, partnership, fortune, gains (26.7) |
| Venus | 1, 2, 3, 4, 5, 8, 9, 11, 12 | widest benefic range |
| Saturn | 3, 6, 11 | effort, service, income — hard work rewarded |
| Rahu / Ketu | 3, 6, 11 (per common recensions) | effort, service, gains |

**Vedha (obstruction):** a planet occupying the paired vedha house dampens a favourable transit; Mercury's presence generally does NOT obstruct (Phaladeepika ch. 26; Ashtakvarga Jyoti vedha tables). Our engine applies vedha dampening (disclosure block says so) — bank text may reference "obstructions ease/deepen" only in condition-keyed cells, never invent its own astronomy.

## 2. Saturn phases (Sade Sati family) — structure and compliant framing

Classical structure: Sade Sati = Saturn transiting 12th, 1st, 2nd from Moon (3 phases ≈ 2.5 yr each: rising / peak / setting); **Ardhashtama (dhaiya) = 4th**; **Ashtama Shani = 8th**. Modern classical consensus frames these as karma-refinement periods where **discipline, routine and patience are rewarded**; intensity varies with Saturn's natal dignity.

**Style guide §3 hard rule applies:** no punishment/curse/loss framing; the phase is "a phase that rewards steady effort, patience and simple routines". Phase→area flavour the bank may use:
- **Rising (12th):** planning, clearing, rest, behind-the-scenes preparation
- **Peak (1st):** steady self-discipline, pace, simple routines carry the most
- **Setting (2nd):** rebuilding routines, money habits, family steadiness
- **Dhaiya (4th):** home, inner steadiness, patience with property/domestic matters
- **Ashtama (8th):** patience with deep change, research, insurance/taxes handled calmly — phrase as "slow, careful work with shared and long-term matters" (no longevity talk)

## 3. Annual-forecast methodology (professional practice) — matches our engine

Published annual forecasts (AstrologyZone-style and Vedic varshphal sites) share a structure: **(a)** year frame set by slow planets (Jupiter ~1 sign/yr, Saturn ~2.5 yr/sign, nodal axis ~1.5 yr/loop); **(b)** per-sign house mapping of those slow transits; **(c)** month-by-month timing keyed to when faster planets and retrogrades activate the year's main themes. Varshphal (Tajika) uses the solar-return chart; our approved engine uses calendar-year slow-transit drivers — same published structure, distinct method, and the disclosure block says so.

Our `driverFor()` implements exactly the slow-planet frame:
| Driver | Year's story (bank theme) |
|---|---|
| `jupiter-good` | Jupiter's transit dominates this area's year — growth/learning/guidance narrative; rating band sets warmth (works for dominant-negative Jupiter too: "Jupiter sets a demanding rhythm" at challenging) |
| `saturn-phase` | Saturn phase (Sade Sati/dhaiya/ashtama) shapes the area — patience-building narrative per §2 flavour |
| `rahu-axis` | Nodal axis dominates — appetite/expansion vs release/detachment; "keep choices deliberate" |
| `mixed` | Fast planets dominate — week-to-week shifting skies; "flexible plans win" |
| `steady` | No dominant force — even keel; "consistency is the strategy" |

## 4. House → life-area mapping used by `yearly.*` sections

2nd wealth/speech/family resources · 3rd courage/siblings/initiative · 4th home/mother/comfort · 5th children/education/creative work · 6th service/routine work/health habits · 7th marriage/partnership · 8th shared finances/long-term matters/transformation · 9th fortune/higher learning/guru · 10th career/status · 11th gains/networks/income · 12th expenses/rest/retreat. (Phaladeepika house-by-house listings; BPHS bhava chapters.)

## 5. Authoring rules distilled for the bank

1. Every yearly area section (90–140 EN words) covers: **the driver's story** (1–2 sentences, naming the planet + what it is doing astronomically-lite), **two concrete area themes** (rated per band), and **a pacing close** matched to the band (excellent: lean in; good: steady; moderate: even keel; challenging: constructive pacing beat).
2. Rating band is the tone CAP (§2); driver is the THEME; area is the SUBJECT. Never let a challenging cell end without its constructive suggestion.
3. Clause fragments (month table): 8–16 words, `{planet}`/`{house}` filled by the engine; the closing fragment carries the band's beat.
4. Originality: structure from this research, wording from Paige. Trigram check per batch vs competitor fetches (style §9).
5. Hindi mirrors EN slot-for-slot (§6), āp-register, bans per §3.6–7.

## Sources
- [Phaladeepika ch. 26 — Wisdom Library translation](https://www.wisdomlib.org/hinduism/book/phaladeepika-by-mantreswara-text-and-translation/d/doc1621598.html) (26.2 Moon order, 26.7 Jupiter houses, vedha)
- [Mantreswara's Phaladeepika PDF — jyotishvidya.com](https://jyotishvidya.com/HTMLobj-9415/Mantreswara_s__Phaladeeplka_.pdf) (house-by-house transit effects)
- [Gochara favourable-house tables incl. Rahu/Ketu 3,6,11 — dr.gurudeva](https://www.luckygemfinder.com/gochara-predictions.html)
- [Gochara planetary transits overview (BPHS citations) — star-meet](https://star-meet.com/blog/gochara-planetary-transits-vedic-astrology)
- [Rashi gochar vedha mechanics — Ashtakvarga Jyoti](https://ashtakvargajyoti.wordpress.com/2015/01/30/rashi-gochar-vedha-transit-based-planetary-obstruction)
- [Sade Sati phases — pujahome](https://pujahome.com/blogs/articles/sade-sati-meaning-effects-phases) · [Shani Sade Sati — astrosagga](https://www.astrosagga.com/blog/shani-sade-sati) · [Sade Sati explained — moonsutras](https://www.moonsutras.com/blogs/astrology-spirituality-podcast/sade-sati-explained-saturn-s-return-from-the-moon-in-vedic-astrology)
- [Annual forecast structure discussions — r/astrology](https://www.reddit.com/r/astrology/comments/p311oi/how_does_one_interpret_a_solar_return_chart) · [Varshphal annual chart — AstroSage](https://www.astrosage.com/free/annual-horoscope-varshphal.asp) (structure reference only; no copy taken)
