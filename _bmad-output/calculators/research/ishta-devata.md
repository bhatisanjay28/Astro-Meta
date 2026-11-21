# Ishta Devata (from Atmakaraka's navamsha position) — Research

> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/
> Engine assumption: sidereal zodiac, Lahiri (Chitra Paksha) ayanamsha — same as Vyotish.
> Depends on the Atmakaraka & Jaimini Karakas calculator (see research/atmakaraka-jaimini-karakas.md) — AK must be computed identically in both.

## 1. Purpose and who uses it

The **Ishta Devata** is the "personal deity of spiritual guidance" — the form of the divine a native is said to be naturally inclined to worship, and in the Jaimini framework, the deity connected with the soul's path to moksha (liberation). The astrological derivation runs entirely through the **Atmakaraka's position in the navamsha (D9)**:

1. AK (highest-degree planet) is found in the rashi chart.
2. The sign AK occupies in the navamsha is the **Karakamsha** (soul ascendant).
3. The **12th sign from Karakamsha in the navamsha** (called *Jivanmuktamsa* — the "liberation house") is examined; the planet(s) there — or the lord of that sign if empty — indicate the deity (BPHS "Karakamsa Phala" chapter; Jaimini Upadesa Sutras 1.2.72–79 per B.S. Suryanarain Rao translation).

Who uses it:
- **Devout users / seekers** choosing or confirming a daily worship practice and mantra; this is a highly emotional, high-intent query ("who is my ishta devata").
- **Jaimini-savvy astrologers** (it sits next to Karakamsha, Dharma Devata, Palana Devata readings).
- **Vyotish product-wise**: the current endpoint returns `ishta_devata: null` — the calculator exists but does not answer the question users ask it for. This file specifies what it should answer.

Important framing for output copy (all sources agree): Ishta Devata is individual-specific and distinct from the **Kul Devata** (family deity); a chart result is "a pointer, never overriding a family deity or guru lineage" (vidhata.app); worship of a Vishnu avatar is recommended by BPHS for moksha (howisyourdaytoday citing BPHS ch. 2, v. 5–7).

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Birth date | required | ISO `YYYY-MM-DD` | 1900-01-01 … today | today | Planetary longitudes |
| Birth time | required | `HH:MM:SS`, local clock | 00:00–23:59 | 12:00 | D9 sign boundaries are 3°20′ wide; a 15–20 min birth-time error can change Karakamsha and hence the deity (ournakshatra explicitly warns ~10 min; vidhata.app warns the whole chain inherits AK fragility) |
| Birth latitude / longitude | required | decimal degrees | ±90 / ±180 | — | Time/ephemeris resolution for the place |
| Time-zone | required | IANA id or offset | — | — | Local → UT |
| Karaka scheme | optional | enum 7 or 8 | — | 7 (match karakas page) | 7 vs 8 changes whether Rahu can be AK — and therefore the deity (vedicastro.bot offers both; ournakshatra defaults 7 with optional 8) |
| Node type (8-scheme only) | optional | mean/true | — | mean | Only matters if Rahu can be AK |

Name/gender: not needed for computation (AstroSage and AstroTalk ask for them; AstroSage's advanced fields — ayanamsha choice, chart style, KP horary number — are irrelevant to this specific calculation and should not be copied).

### Recommended input set
Same as the karakas calculator: `date + time + lat + lng + tz` (+ shared `scheme` param). The endpoint should internally reuse the karakas computation (AK, navamsha of every planet in D9) rather than recomputing divergently.

### Current Vyotish input set
`GET /api/v1/calculators/ishta-devata` (page `/calculators/ishta-devata`) with birth date/time/place. Same input fields as karakas. Fine as-is; add the scheme toggle when karakas gets one.

## 3. Formula(s) / method

### Method 1 — Classical: planet(s) in the 12th from Karakamsha (RECOMMENDED)
1. Compute AK (7-scheme default; identical algorithm to the karakas calculator).
2. Compute navamsha (D9) signs of the **AK and of every planet** (same `part = floor(arcsec_in_sign ÷ 12000)`; `navamsha_sign = (sign_index×9 + part) mod 12`).
3. Karakamsha = AK's navamsha sign.
4. 12th from Karakamsha (whole-sign, in D9): `jivanmukta_sign = (karakamsha_index + 11) mod 12`.
5. **Decision rule (source-consistent):**
   - If planets occupy that 12th sign in D9 → the occupant indicates the deity. Precedence when several occupy: AstroSage-style pages take the occupant; ournakshatra takes the **highest-degree occupant**; vidhata.app weighs occupation over aspect, then prefers a planet not heavily afflicted. RECOMMENDED: highest-degree occupant (deterministic), else sign lord.
   - If the 12th is empty → the **lord of that sign** indicates the deity (AstroSage, vedicastro.bot, Navamsa-PDF snippet: "Lord of the 12th from Karakamsha is Ishta Devata. If there is a planet [in the 12th], that planet leads").
   - Special cases: Scorpio/Aquarius dual lordship (Mars/Ketu; Saturn/Rahu) — vedicastro.bot uses "the stronger of the two lords"; **Ketu as lord → Ganesha** (ournakshatra special case; Ketu has no standard rulership but maps to Ganesha).
   - Classical **combination rules** (BPHS Karakamsa Phala as quoted in secondary sources): e.g., Sun+Ketu in the 12th → worshipper of Shiva; Moon+Ketu → Gauri (IndiaDivine quotes; treat as documented variant list, implement only if a full verbatim verse table is sourced).
6. Map the indicating planet to a deity (table below). Show the derivation, not just the answer.

### Planet → deity mapping (the two published tables)

**Table A — main mapping (aggregated across sources; names differ in breadth):**

| Indicating planet | Deity (per AstroSage page) | Deity (per vedicastro.bot FAQ) | Deity (per vidhata.app / BPHS-style) |
|---|---|---|---|
| Sun | Shiva, Sri Rama | Shiva or Rama | Shiva (or Surya directly) |
| Moon | Gauri, Lalita, Saraswati, Sri Krishna | Gauri, Lalita, Saraswati or Krishna | Devi, nurturing/protective forms |
| Mars | Hanuman, Rudra Deva, Kartikeya, Sri Narasimha | Hanuman, Kartikeya, Narasimha or Rudra | Kartikeya or Hanuman; Narasimha in some lineages |
| Mercury | Vishnu, Sri Buddha | Vishnu, Narayana or Buddha | usually Vishnu |
| Jupiter | Hayagreeva, Vishnu, Indra, Dattatreya | Vishnu, Hayagriva, Parameshwara or Dattatreya | Vishnu's Rama/Krishna forms; Dattatreya in some lineages |
| Venus | Lakshmi, Parvati | Lakshmi or Parvati | Devi — Lakshmi or Durga aspect |
| Saturn | Vishnu, Brahma | Vishnu or Brahma | Shiva as Mahakala/Bhairava, or Shani directly |
| Rahu | Durga, Sri Narasimha | Durga or Narasimha | Durga or Kali |
| Ketu | Ganesha | Ganesha | Ganesha |

**Consensus core (stable across ALL sources):** Sun→Shiva(/Rama) · Moon→Devi(Gauri) · Mercury→Vishnu · Jupiter→Vishnu forms(/Dattatreya) · Venus→Lakshmi/Devi · Ketu→Ganesha. **Genuinely disputed:** Mars (Hanuman vs Kartikeya vs Narasimha), Saturn (Vishnu/Brahma in AstroSage+vedicastro.bot vs Mahakala/Bhairava in vidhata.app vs Yama/Shani in ournakshatra), Rahu (Durga agreed; Narasimha vs Kali secondary). Santhanam-vs-Rao BPHS translations and commentators differ for Mars/Mercury/Saturn/Rahu (per the IndiaDivine-thread summary — thread itself timed out on fetch, so marked UNVERIFIED detail).

**Table B — Vishnu avatar per planet** (AstroSage "if Vishnu is the deity"; howisyourdaytoday cites BPHS ch. 2 v. 5–7 for the avatar concept): Sun→Rama · Moon→Krishna · Mars→Narasimha · Mercury→Buddha · Jupiter→Vamana · Venus→Parashurama · Saturn→Koorma · Rahu→Varaha · Ketu→Matsya.

### Method 2 — "Deity of the sign-lord of Karakamsha itself" (simplified; found in popular articles only)
Some popular/numerology-adjacent articles skip the 12th and read the deity off the lord of the navamsha sign **occupied by AK** (i.e., Karakamsha's own lord), and/or circulate a **12-sign table** (Karakamsha sign → deity), e.g., Aries→Hanuman, Taurus→Lakshmi, Gemini→Vishnu (searched versions disagree on Taurus: Ganesha vs Lakshmi). **No classical citation was found for the sign-based table; sources explicitly contradict each other on at least one sign. Marked UNVERIFIED — do not implement.** vidhata.app explicitly states the technique "works purely through planets, not signs"; vedicastro.bot's sign-wise sutras (Jaimini 1.2.2–1.2.13) are about rats/snakes/itching/charity — NOT deities — which is likely the origin of the misreading.

### RECOMMENDATION
Implement **Method 1** (12th from Karakamsha in D9: occupant with highest degree, else sign lord) with **Table A**, defaulting each disputed planet to the AstroSage/vedicastro.bot column (Mars→Hanuman, Saturn→Vishnu, Rahu→Durga, Mercury→Vishnu, Jupiter→Vishnu) and displaying the alternate deity names as "also indicated by some lineages". Reasons: (1) it is the only method with consistent classical sourcing (BPHS Karakamsa Phala; Jaimini Upadesa Sutras 1.2.72–79); (2) it is what AstroSage — the largest consumer competitor — describes, so output is checkable against the market; (3) the sign-based table is internally inconsistent across sources and has no classical citation. Always show the derivation (AK → Karakamsha → 12th sign → occupant/lord → deity) so the result is auditable — this is the single biggest trust differentiator because every source disagrees at the edges.

## 4. Worked examples (≥3: normal, edge, boundary)

All examples reuse the karakas-file fixtures (sidereal, Lahiri). D9 sign of each planet computed with `(signIndex×9 + part) mod 12`.

### Example A (normal, real ephemeris) — 2026-11-21, 19:31:10 IST, New Delhi
Positions: DrikPanchang sidereal snapshot (see karakas file, Example A). AK = **Venus**, Venus navamsha = **Virgo** → Karakamsha = Virgo (index 5).
- 12th from Virgo = (5+11) mod 12 = 4 = **Leo**.
- D9 occupants of Leo: Sun (Sun navamsha Leo). No other planet lands in Leo navamsha.
- Occupant = Sun → Ishta Devata = **Shiva (also Rama)**. Fallback check: lord of Leo is also Sun — same deity, self-consistent example.
- Vishnu-avatar variant (if reading Vishnu path): Sun → Rama.

### Example B (normal birth chart, real ephemeris) — 1990-06-15, 10:30 IST, New Delhi
Positions: DrikPanchang sidereal page with date/time params (see karakas file, Example B). AK = **Venus**, Venus navamsha = **Scorpio** → Karakamsha = Scorpio (index 7).
- 12th from Scorpio = (7+11) mod 12 = 6 = **Libra**.
- D9 occupants of Libra: Sun (Sun navamsha Libra = (2×9+0) mod 12 = 6). Others: Venus Scorpio, Jupiter Aries, Moon Pisces, Mars Sagittarius, Mercury Aries, Saturn Capricorn, Rahu Scorpio.
- Occupant = Sun → Ishta Devata = **Shiva (also Rama)**; avatar variant: Rama.
- Fallback contrast (for tests): if the empty-house rule were exercised, lord of Libra = Venus → Lakshmi/Parvati. Test both branches by asserting on the rule actually selected.

### Example C (edge: empty 12th + disputed planet, synthetic fixture)
Fixture = karakas file Example C (synthetic). AK = **Mercury**, Mercury navamsha = **Pisces** (107 mod 12 = 11) → Karakamsha = Pisces (index 11).
- 12th from Pisces = (11+11) mod 12 = 10 = **Aquarius**.
- D9 occupants of Aquarius in this fixture: none (Sun→Taurus, Moon→Aries, Mars→Leo, Mercury→Pisces, Jupiter→Taurus, Venus→Capricorn, Saturn→Capricorn) → **empty house → sign lord**.
- Lord of Aquarius = Saturn → deity per recommended table = **Vishnu (also Brahma)**; vidhata.app lineage would read Mahakala/Bhairava Shiva; ournakshatra reads Yama/Shani. Output must show the primary deity + lineage note. This example proves the output must include the *derivation*, since the same chart yields different deities under different published tables.

### Example D (boundary: D9 cusp flips the deity, synthetic)
Take Example B and shift Jupiter's longitude by −1 arc-second (22°05′45″ Gemini instead of 22°05′46″): Jupiter part goes from 6 → 6 (no change — wrong test). Instead shift **Venus**: AK Venus at 24°42′16″ Aries → part = floor(24.704444/3.333333) = 7 (unchanged). Now shift Venus to **24°39′59″** (24.666389): part = floor(7.3999) = 7 — still Scorpio. Continue down to **24°39′59″ of the previous navamsa boundary**: Venus at 23°19′59″ Aries (23.333056) → part = floor(7.0) − 1 = 6 → navamsha (0×9+6)=6 = **Libra** → Karakamsha flips Scorpio→Libra → 12th-from flips Libra→**Virgo** → occupants: none (check fixture D9s) → lord of Virgo = Mercury → **Vishnu**. So a 1°22′16″ change in Venus's longitude changes the answer from Shiva/Rama to Vishnu. Test assertion: Karakamsha Scorpio ⇒ 12th=Libra ⇒ Sun→Shiva; Karakamsha Libra ⇒ 12th=Virgo ⇒ lord Mercury→Vishnu (empty-house branch). (Numbers recomputed explicitly; both branches deterministic.)

### Example E (scheme edge, documentary) — 7 vs 8 changes the deity
If the 8-scheme is enabled on karakas-file Example A, AK is still Venus (29°43′29″ > Rahu's adjusted 29°15′30″), so Example A is scheme-stable. A scheme-sensitive case needs Rahu adjusted > top planet's degree: e.g., Rahu at 0°30′ of a sign (adjusted 29°30′) with no other planet above 29°30′ → 8-scheme AK = Rahu → deity family flips to Durga/Narasimha vs the 7-scheme AK's deity. Construct as a unit test by feeding longitudes directly. (Synthetic; marked as fixture, not a historical chart.)

## 5. Complete output list

What a GOOD Ishta Devata calculator shows:
1. **AK** (planet, sign, degree, highlighted) — the anchor of the whole chain.
2. **Karakamsha** (AK's navamsha sign) explicitly named.
3. **Jivanmuktamsa** (12th sign from Karakamsha in D9) with its occupants (planet + D9 sign + degree) and, if empty, its lord; Scorpio/Aquarius dual-lordship handling disclosed.
4. **Ishta Devata name** (primary + alternate names from other lineages, since sources disagree) with **the full derivation shown step-by-step** — auditable, not a black box.
5. **Optional enrichments**: Vishnu-avatar variant (Table B), mantra guidance (ournakshatra gives a Beej Mantra + 108× daily recommendation; a pure devotional extra — keep optional and clearly non-judgmental), Dharma Devata (9th from Karakamsha; vedicastro.bot) and Palana Devata (6th from Amatyakaraka in D9; ournakshatra) as advanced tabs.
6. **Disclaimers**: distinct from Kul Devata / guru-given practice; birth-time sensitivity (15–20 min can change Karakamsha — ournakshatra, vidhata.app); 7-vs-8 scheme changes AK and hence the deity; spiritual-informational use only.
7. Scheme + ayanamsha disclosure (same as karakas page).

### Competitor comparison
| Output element | AstroSage (ishta-devata-calculator.asp) | AstroTalk (ishta-devata-calculator) | vedicastro.bot (karakamsa-calculator) | ournakshatra (ishta-devata) | Vyotish (current) |
|---|---|---|---|---|---|
| Inputs | name, sex, dob, tob, place (+advanced ayanamsha/chart style) | birth details form | date/time/place/tz + **scheme choice** | name, dob, tob, place + consent | date/time/lat/lng/tz |
| Shows AK | explained in text | form only (output unseen) | Yes | Yes | Yes (`atmakaraka` object) |
| Shows Karakamsha | explained | output unseen | Yes (Swamsa Lagna) | Yes | **Yes (`navamsha_sign`)** |
| 12th-from-Karakamsha step shown | explained | output unseen | Yes | Yes | **No** |
| Deity output | form-only in fetched view (paid reports around it) | output unseen | **locked behind free account** | Yes + beej mantra | **Always null — gap** |
| Derivation transparency | mapping tables on page | unknown | planet→deity FAQ | explains rule incl. Ketu→Ganesha | note text only |
| Disclaimers | Kul Devata distinction only | unknown | scheme caveat | birth-time + spiritual-use only | none |

(DrikPanchang and GaneshaSpeaks: **no dedicated Ishta Devata tool found** in searches — competitor set is AstroSage/AstroTalk/vedicastro.bot/ournakshatra. AstroTalk's output page did not render for extraction; details marked unseen.)

### Current Vyotish outputs
`GET /api/v1/calculators/ishta-devata` → `atmakaraka` (karaka object), `navamsha_sign`, `ishta_devata` (**always null** — deity mapping deferred), `note`. Page: `/calculators/ishta-devata`. The calculator currently computes everything up to Karakamsha but never answers the user's question.

### Initial gap list
1. **`ishta_devata` is always null** — the product does not answer its own question. Implement Method 1 (§3) with Table A consensus + lineage alternates.
2. **No derivation in output** — users cannot see Karakamsha→12th→occupant/lord→deity; competitors that show derivation (ournakshatra) earn trust; this is also the QA surface.
3. **No occupants of the 12th-from-Karakamsha in D9** exposed (needed for the decision rule and for tests).
4. **No empty-house fallback logic** (lord of 12th) — required by all classical sources.
5. **No dual-lordship rule** (Scorpio/Aquarius) and **no Ketu-as-lord → Ganesha special case**.
6. **No scheme consistency link** to the karakas endpoint (if the two endpoints disagree on AK, the site contradicts itself on the same user).
7. **No Vishnu-avatar variant** (Table B) — cheap differentiator AstroSage describes.
8. **No disclaimers** (Kul Devata distinction, birth-time sensitivity, lineage variance).
9. **No mantra/extra layer** — optional; keep behind a clearly-labeled tab.

## 6. Edge cases and validation rules

1. **D9 boundary flips**: a planet within ±1 arc-sec of a navamsa boundary changes Karakamsha → different 12th → different deity (Example D). Use integer arc-seconds for `part`; assert `part = floor(arcsec/12000)` with 3°20′00″ exactly landing in the *next* navamsa.
2. **Empty 12th**: fall back to sign lord; return which branch was used (`occupant` vs `lord`) in the API — tests must pin the branch.
3. **Multiple occupants**: deterministic rule = highest degree-within-sign among occupants (ournakshatra); also return all occupants so UI can show alternates.
4. **Dual lordship**: Scorpio (Mars/Ketu) and Aquarius (Saturn/Rahu) as 12th-lord cases — vedicastro.bot uses the stronger lord; ournakshatra resolves Ketu→Ganesha. Recommend: Mars/Saturn as primary lords (Parashari standard), Ketu/Rahu noted as co-lords with deity fallback (Ketu→Ganesha, Rahu→Durga). Document the choice in output.
5. **Scheme dependency**: 7 vs 8 changes AK (Example E fixture) → the ishta-devata endpoint must consume the karakas scheme param; a scheme toggle must flip both pages consistently.
6. **Birth-time fragility**: AK depends on arc-seconds (Moon moves ~32′/hour); 15–20 min error can flip AK or Karakamsha (both source-cited). Emit a warning when AK's degree-within-sign is within 1° of a neighbor or within 1° of a navamsa boundary.
7. **Ketu can never be AK** (all sources) but Ketu can indicate the deity (as occupant/lord) — different roles; do not filter Ketu from the 12th-house occupant scan.
8. **Mean vs true Rahu** (8-scheme AK only): Example B mean Rahu adjusted 14°01′14″ vs true adjusted 15°37′29″ — can flip a near-tie AK. Pin one, label it.
9. **Deity mapping stability**: snapshot the chosen mapping table (with source URLs) in a data file, versioned; never hardcode inline so lineage variants are testable.
10. **No-invention rule**: any deity not present in the sourced tables must be rejected at review, not added.

## 7. Sources

- AstroSage — Ishta Devata Calculator (method, full planet→deity table, Vishnu-avatar table, inputs): https://www.astrosage.com/ishta-devata-calculator.asp
- vedicastro.bot — Karakamsa/Ishta Devata calculator (scheme options, Swamsa output, 12th-from rule, occupant-vs-lord rule, dual-lord rule, planet→deity FAQ, Jaimini 1.2.1–1.2.13 sutra quotes per B.S. Rao translation): https://vedicastro.bot/karakamsa-calculator
- ournakshatra — Ishta Devata calculator (7/8-scheme default, occupant-highest-degree rule, conjunction specials, Ketu→Ganesha, beej mantra output, birth-time caveat): https://ournakshatra.com/ishta-devata
- vidhata.app — Karakamsha & Ishta Devata article (12th-from method, planet→deity mappings, occupation-over-aspect, Kul Devata/guru caveat, no sign-based mapping): https://vidhata.app/blog/karakamsha-ishta-devata-jaimini-vedic-astrology
- howisyourdaytoday — Ishta Devta determination (Jivanmuktamsa term, BPHS "Karakamsa Phala" chapter citation, Jaimini Upadesa Sutras 1.2.72–79 citation, BPHS ch.2 v.5–7 Vishnu-avatar citation): https://howisyourdaytoday.com/ProductDetails/Ishta_Devta_Deity_determination.htm
- BPHS Karakamsa-Phala quotes (Sun+Ketu→Shiva, Moon+Ketu→Gauri etc.) — secondary compilation, fetch failed (UNVERIFIED verbatim): https://www.indiadivine.org/content/topic/1493084-on-seeing-deities-from-the-12th-from-karakamsa and https://www.scribd.com/doc/51021250/karakamsa
- AstroTalk — Ishta Devata calculator (exists; output page not renderable — unseen): https://astrotalk.com/ishta-devata-calculator
- Navamsa partition method (3°20′; movable/fixed/dual starts; ×9 equivalence): https://www.scribd.com/document/133753260/Navamsa-Calculation
- steer.coach — Karakamsa definition (AK's navamsha sign as soul ascendant): https://steer.coach/karakamsa
- DrikPanchang — sidereal positions used for Example A/B: https://www.drikpanchang.com/planet/position/planetary-positions-sidereal.html
- Vyotish codebase scan (current implementation facts): internal, 2026-11-21.
