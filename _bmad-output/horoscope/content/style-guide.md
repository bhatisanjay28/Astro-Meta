# Paige (Content Writer) — Style Guide v1
**Horoscope Upgrade · Step 2 of 5 · 2026-11-24 · feeds the content library (see [library-structure.md](library-structure.md))**

This guide governs every EN and HI string that enters the horoscope content library. The generator composes pages from library phrases; nothing is free-typed at runtime. Owner decisions D1–D6 (see `../decisions.md`) are reflected throughout.

---

## 1. Voice

Vyotish speaks as a **calm, warm companion** — a knowledgeable friend sharing a weather report for the day, not a fortune-teller issuing verdicts.

- **Warm, not gushing.** "A good day to…" not "An amazing day destined for…"
- **Calm, not dramatic.** Planets "invite", "support", "ask for patience"; they never "threaten" or "destroy".
- **Agency-forward.** Every reading hands the reader something to *do* — a small action, a pause, a habit — so a slow day still feels navigable.
- **Honest about method.** We describe what the transit *is* (e.g., "the Moon moves through your 2nd house today") before what it *may* mean. The disclosure block (D3) carries the method; page copy never overstates certainty.

## 2. Tone caps — how each rating band may be phrased

A rating band is a **ceiling on intensity**, in both languages. Challenging content must read as gentle pacing advice, never as misfortune.

| Band | Label (EN / HI + icon) | Permitted framing | Example register (EN) |
|---|---|---|---|
| Excellent | Excellent / उत्तम ▲▲ | momentum, visible progress, say yes | "Momentum builds on its own today — a good day to move first." |
| Good | Good / अच्छा ▲ | steady gains, favourable, lean in | "Conditions lean your way; steady steps land well." |
| Moderate | Moderate / मध्यम ◆ | mixed, even keel, small wins | "An even-keeled day — small, steady efforts serve you best." |
| Challenging | Challenging / चुनौतीपूर्ण ▼ | patience, pacing, preparation, rest | "The day asks for a slower pace. Prepare more, push less." |

**Challenging-band rules (hard):**
1. Always pair the observation with one constructive suggestion (rest, planning, reviewing, asking for help, deferring launches).
2. Frame as *timing*, not *outcome*: "a day to revise, not launch" — never "plans will fail".
3. Maximum one Challenging note per category; no stacking of cautions across sentences.
4. Never use the words listed in §3.

## 3. Banned list (automatic validator + human check)

**Fear words:** danger, dangerous, beware, disaster, doom, doomed, unlucky, bad luck, cursed, misfortune, catastrophe, ruin, threat, warning, loss of, fear, afraid, suffer, struggle (as outcome), failure (as certainty).

**Absolutes & guarantees:** always, never, will certainly, definitely, guaranteed, must (as compulsion), cannot, impossible, destiny demands, the stars command, "this will happen".

**Medical:** any diagnosis, symptom, treatment, medication, cure, disease, illness (named or general). Health content may speak only of **rest, routine, balance, sleep, hydration, exercise-lite, calm, pacing** — and must stop short of body-system claims. (Owner rule: general wellness only.)

**Legal / financial directives:** buy, sell, invest in X, shares, lawsuit, litigation, tax, "you will gain ₹…", any named-asset advice. Wealth content stays at the level of **planning, reviewing, budgeting habits, avoiding haste**.

**Fear-coupling:** Sade Sati / Saturn / Rahu may never be described as punishment, curse, or suffering. Approved framing: "a phase that asks for steady effort and patience" (D5 gentle phrasing).

**Shaming / determinism:** nothing that tells the reader their choices are irrelevant, or implies fault for their circumstances.

## 4. Required softeners

- Projections use a graded ladder, matched to band: **may / tends to / leans toward / is likely to feel / consider / a good day to**. "Will" is reserved for astronomical facts only ("the Sun enters Sagittarius on Dec 16" — a fact, not a forecast).
- Each category paragraph ends on an actionable or reassuring beat.
- Retrograde copy uses the **review** metaphor only: "plans in motion deserve a second look" — never "everything goes wrong".
- Chandrashtama (Moon in H8 from sign) copy is the gentlest in the library: rest, quiet, self-care; no health scare framing.

## 5. English conventions

1. Second person, "you"; contractions allowed but sparing (aim ≤1 per paragraph).
2. Sentences ≤ 22 words preferred; no semicolons in generated copy (they survive poorly in templated fragments).
3. Sign names: **Latin name capitalised** ("Aries"), Devanagari shown once near the page head ("Aries · मेष"). Category sections use plain nouns: health, career, money, love, education, family.
4. Astronomical facts (ingress dates, full moon, retrograde stations) may be stated as facts with dates. Everything personal stays on the §4 ladder.
5. Mantras render in **Devanagari + IAST-style transliteration** (e.g., "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः · *Om Graam Greem Graum Sah Gurave Namah*"), followed by "11/21/108 times, morning" guidance in one short line.
6. Deity names with one respectful gloss: "Brihaspati (Guru), the guide among planets".
7. Numbers as digits (3, 6, 11); times in 12-h IST; dates as "Dec 16" or "16 Dec" per page locale, consistent within a page.
8. No exclamation marks in horoscope body copy (marketing chrome may use them; generated horoscope text may not).
9. Star/emoji icons: only the rating glyphs defined in §2 (▲▲ ▲ ◆ ▼); no decorative emoji in body copy.

## 6. Hindi conventions

1. Register: **आप**, respectful, simple shuddh-leaning but conversational Hindi; avoid ornate Sanskritised compounds except established jyotish terms (गोचर, राशि, चंद्र राशि, संक्रांति, सढ़े साती written as "साढ़े साती").
2. Structure mirrors EN section-for-section (same slots, same order) so the renderer stays language-agnostic.
3. Sign names: Devanagari primary on HI pages (मेष, वृषभ …), Latin in parentheses once at page head.
4. Mantra in Devanagari primary; transliteration optional per design step.
5. Dates: "16 दिसंबर"; times: "सुबह 6:04 (IST)".
6. The §2 tone caps and §3 bans apply equally in HI: forbid words like ख़तरा, बर्बादी, अशुभ घड़ी, दुख भोगना, निश्चित रूप से होगा; prefer "धीरज", "संतुलन", "विश्राम", "योजना", "संभावना", "शुभ संकेत".
7. Health in HI: only विश्राम, दिनचर्या, संतुलन, नींद, जल — never रोग/बीमारी/इलाज framing.

## 7. Fixed strings (single source of truth; stored in `content_blocks`, block_key prefix `horoscope.`)

**Disclaimer (every horoscope page, footer of content):**
- EN: "This horoscope is shared for guidance and general reflection only. It is based on traditional Vedic Moon-sign transit principles and is not a substitute for professional medical, legal, or financial advice."
- HI: "यह राशिफल केवल मार्गदर्शन एवं चिंतन के लिए है। यह पारंपरिक वैदिक चंद्र-राशि गोचर सिद्धांतों पर आधारित है और किसी भी प्रकार की चिकित्सकीय, कानूनी या वित्तीय सलाह का विकल्प नहीं है।"

**"How we compute this" disclosure (one `<details>` per page, D3):**
- EN: "How we compute this: We take each planet's sidereal position (Lahiri ayanamsha) at 00:05 IST, count the house it occupies from your Vedic Moon sign, and apply classical gochara (transit) favourability tables — including vedha (obstruction) adjustments. Lucky colour, number, direction, mantra and deity follow the day's ruling planet by a fixed traditional mapping. Planetary nodes are computed by the standard mean-node method. Ratings are band labels, not scores; they describe timing tendencies, not outcomes."
- HI: "यह कैसे निकाला जाता है: हम 00:05 IST पर प्रत्येक ग्रह की साइडरियल स्थिति (लाहिड़ी अयनांश) लेते हैं, आपकी वैदिक चंद्र राशि से उसका भाव गिनते हैं, और शास्त्रीय गोचर अनुकूलता तालिकाओं — वेध समायोजन सहित — को लागू करते हैं। शुभ रंग, अंक, दिशा, मंत्र और देवता दिन के शासक ग्रह की निश्चित पारंपरिक मैपिंग से आते हैं। ग्रहों के पाताल/उत्तरायण केंद्र (राहु-केतु) मानक मीन-नोड विधि से गणना किए जाते हैं। रेटिंग केवल समय-प्रवृत्ति बताती है, परिणाम नहीं।"
  *(Note: the HI sentence about राहु-केतु must be simplified at implementation review — flag for Barry/QA wording pass.)*

**Rating labels (chips + table):** Excellent · उत्तम ▲▲ / Good · अच्छा ▲ / Moderate · मध्यम ◆ / Challenging · चुनौतीपूर्ण ▼ — text + glyph + colour together (never colour alone).

**"Why this colour/number" tag (lucky triad, D-basis):**
- planet-of-the-day EN: "Jupiter leads today's sky for Aries" · HI: "आज मेष राशि के लिए गुरु प्रमुख ग्रह हैं" (template with {{planet}}, {{sign_hi}}).

**Sade Sati note (yearly, D5):**
- EN: "Saturn is moving through your {phase} (Sade Sati) during {months}. In tradition this is a phase that rewards steady effort, patience and simple routines — slow building, not sudden change."
- HI: "{months} के दौरान शनि आपकी {phase} से गुज़र रहे हैं (साढ़े साती)। परंपरा में यह ऐसा समय माना जाता है जो धीरे-धीरे, लगातार मेहनत और संतुलित दिनचर्या को फल देता है — अचानक बदलाव से नहीं, धीरज से।"

**Chandrashtama tag (daily, when Moon in H8):**
- EN: "The Moon passes your 8th house today — tradition suggests quiet, rest and unhurried routines." · HI: "आज चंद्रमा आपके आठवें भाव से गुज़र रहे हैं — परंपरा शांति, विश्राम और बिना जल्दबाज़ी की दिनचर्या सुझाती है।"

## 8. Length targets (validation bounds)

| Slot | EN | HI |
|---|---|---|
| Daily category paragraph (health/career+money/love/education/family) | 35–55 words | 30–50 शब्द |
| Daily thought-of-the-day | 12–20 words | 10–18 शब्द |
| Weekly category paragraph | 45–70 words | 40–65 शब्द |
| Weekly overview | 50–80 words | 45–75 शब्द |
| Monthly area section | 60–90 words | 55–85 शब्द |
| Monthly overview | 80–120 words | 75–110 शब्द |
| Yearly area section | 90–140 words | 80–130 शब्द |
| Yearly overview | 100–150 words | 90–140 शब्द |
| Month-table reason clause | 8–16 words | 8–16 शब्द |

Do's & Don'ts items: 4–10 words each, verb-first, imperative-mild ("Begin…", "Defer…", "Offer water to the rising sun" style — traditional acts only, no purchases/rituals involving expense).

## 9. Originality protocol (owner rule)

1. **Never open a competitor page while drafting a phrase.** Reference sites informed structure only (Step 1); all wording originates from Paige.
2. After drafting a batch, run the trigram overlap check (`tools/originality-check` pattern: word-trigram Jaccard vs. fetched competitor text for the same sign/period).
3. Threshold: **any overlapping trigram sequence ≥ 0.20 Jaccard, or any shared 8-word run**, requires a rewrite of that phrase before it enters the library.
4. Traditional fixed phrases are exempt and enumerated: mantras (beej mantras are standard formulae), deity names, panchang terms (tithi/nakshatra names), rating labels, and the disclaimer. Everything else is original.
5. Log results in `originality-check.md` per batch.

## 10. Token glossary (library placeholders)

| Token | Meaning | Example fill |
|---|---|---|
| `{{sign_en}}` / `{{sign_hi}}` | sign name | Aries / मेष |
| `{{planet}}` / `{{planet_hi}}` | attribution planet | Jupiter / गुरु |
| `{{colour}}` / `{{colour_hi}}` | lucky colour | yellow / पीला |
| `{{number}}` | lucky number (single, D2) | 3 |
| `{{direction}}` / `{{direction_hi}}` | lucky direction | North-East / उत्तर-पूर्व |
| `{{deity}}` / `{{deity_hi}}` | attribution deity | Brihaspati / बृहस्पति |
| `{{mantra_dev}}` / `{{mantra_lat}}` | beej mantra | ॐ ग्रां… / Om Graam… |
| `{{house_n}}` | house number in words | 5th / पाँचवाँ |
| `{{area}}` | category noun | health / स्वास्थ्य |
| `{{date_range}}` | period span | Nov 30 – Dec 6 |
| `{{best_day}}` / `{{test_day}}` | monthly dates | Dec 5 / Dec 29 |
| `{{phase}}` | Sade Sati phase name | rising phase |
| `{{months}}` | Sade Sati month list | Jan–May & Nov–Dec |

Token fills are **data, never editorialised** — the generator substitutes; the library never embeds sign-specific facts inside generic slots (that's what condition keys are for).

## 11. Review checklist (every batch before entering library)

- [ ] Every string keyed to a condition slot (library-structure.md §3), no orphan phrases
- [ ] Tone cap respected per band; Challenging has a constructive beat
- [ ] §3 banned list passes (grep + human)
- [ ] Health = rest/routine/balance only
- [ ] EN/HI slot-for-slot parallel
- [ ] Length within §8 bounds
- [ ] Tokens present where required, none misused
- [ ] Trigram originality check logged
