# Pair Matrix — Scoring Basis for All 144 Zodiac Pairings

- **Author:** Mary (BMAD Analyst persona)
- **Date:** 2026-11-22
- **Purpose:** The complete, deterministic scoring basis for the Zodiac Sign Compatibility feature: 78 unique pairs (12 same-sign + 66 off-diagonal) covering all 144 ordered pairings (mirror pairs are identical; see §8).
- **Verification:** Underlying tables verified from at least two independent sources each — element/modality/polarity/rulers (Wikipedia "Astrological sign" [2]; Britannica "Zodiac" [5]), aspect degrees and readings (Wikipedia "Astrological aspect" [1]; Cafe Astrology grid [9]), dignities (Wikipedia "Essential dignity" [3]). Full register: `sources.md`.
- **Content note:** The one-liners below are original analyst wording derived from the verified rules; they are research basis, not final site copy. The content team will rewrite for tone.

---

## 1. Master data tables (to be encoded by the developer exactly as shown)

### 1.1 Sign index (0-based wheel order)

| Index | Sign | Element | Modality | Polarity | Classical ruler | Modern co-ruler |
|---|---|---|---|---|---|---|
| 0 | Aries | Fire | Cardinal | Yang | Mars | — |
| 1 | Taurus | Earth | Fixed | Yin | Venus | — |
| 2 | Gemini | Air | Mutable | Yang | Mercury | — |
| 3 | Cancer | Water | Cardinal | Yin | Moon | — |
| 4 | Leo | Fire | Fixed | Yang | Sun | — |
| 5 | Virgo | Earth | Mutable | Yin | Mercury | — |
| 6 | Libra | Air | Cardinal | Yang | Venus | — |
| 7 | Scorpio | Water | Fixed | Yin | Mars | Pluto |
| 8 | Sagittarius | Fire | Mutable | Yang | Jupiter | — |
| 9 | Capricorn | Earth | Cardinal | Yin | Saturn | — |
| 10 | Aquarius | Air | Fixed | Yang | Saturn | Uranus |
| 11 | Pisces | Water | Mutable | Yin | Jupiter | Neptune |

Sources: [2] primary; [5] partial (element, modality, dates); [3]/[4] rulers and modern assignments.

### 1.2 Aspect by index difference

`diff = |indexA − indexB|` (0–11). The aspect is read from `d = min(diff, 12 − diff)` [1][2]:

| d | Degrees | Aspect |
|---|---|---|
| 0 | 0° | Conjunction |
| 1 | 30° | Semi-sextile |
| 2 | 60° | Sextile |
| 3 | 90° | Square |
| 4 | 120° | Trine |
| 5 | 150° | Quincunx (inconjunct) |
| 6 | 180° | Opposition |

### 1.3 Dignities (ruler placed in the partner's sign)

| Planet | Detriment in | Exalted in | Fall in |
|---|---|---|---|
| Sun | Aquarius | Aries | Libra |
| Moon | Capricorn | Taurus | Scorpio |
| Mercury | Sagittarius, Pisces | Virgo | Pisces |
| Venus | Scorpio, Aries | Pisces | Virgo |
| Mars | Libra, Taurus | Capricorn | Cancer |
| Jupiter | Gemini, Virgo | Cancer | Capricorn |
| Saturn | Cancer, Leo | Libra | Aries |

Source: [3]. (Domicile column omitted — a ruler "in domicile" in the partner's sign means the two signs share that ruler, handled separately in §3.)

---

## 2. The scoring formula (deterministic; backend API encodes this)

```
score = clamp( aspectBase + elementModifier + dignityModifier + sharedRulerBonus , 35, 95 )
```

**Step 1 — aspectBase** (from the traditional easy/hard consensus [1][9]):

| Aspect | Base |
|---|---|
| Trine | 88 |
| Conjunction | 80 |
| Sextile | 78 |
| Opposition | 62 |
| Semi-sextile | 54 |
| Quincunx | 48 |
| Square | 45 |

**Step 2 — elementModifier** (classical element contrariety; §2.1 of `mary-research.md`):

| Element pair | Modifier |
|---|---|
| Same element | 0 (already priced into trine/conjunction base) |
| Complementary (fire–air, earth–water) | +3 |
| Cross (fire–earth, air–water) — "different tempos, effortful but not hostile" | 0 |
| Contrary (fire–water, earth–air) | −3 |

**Step 3 — dignityModifier** (from §1.3; applied per direction, then summed):

- Sign A's ruler **exalted** in sign B: **+3**
- Sign A's ruler in **detriment** or **fall** in sign B: **−4**
- (Ruler "in domicile" in partner's sign = shared ruler → goes to Step 4 instead)
- Sum both directions (A→B and B→A), then clamp the total to **[−6, +5]**.
- **Skip entirely for same-sign pairs** (A == B) — a ruler in its own sign is a property of the sign, not a pair interaction; all same-sign pairs therefore score exactly `aspectBase + 0 + sharedRuler(same manager) + 0 = 80`.

**Step 4 — sharedRulerBonus:**

| Case | Bonus |
|---|---|
| Same sign (same planetary manager) | 0 (already the conjunction base) |
| Gemini–Virgo (Mercury), Taurus–Libra (Venus) — the ruler's two domiciles | **+2** |
| Aries–Scorpio (Mars), Sagittarius–Pisces (Jupiter), Capricorn–Aquarius (Saturn) — traditional-only shared rulers (modern co-rulers differ) | **+1**, flagged DISPUTED |

**Step 5 — clamp and band:**

| Score | Band label |
|---|---|
| 85–95 | Excellent |
| 70–84 | Strong |
| 55–69 | Mixed (workable with effort) |
| 40–54 | Challenging |
| 35–39 | Very challenging (growth-intensive) |

Copy guidance: bands are labelled on the site as relationship-forecast *moods*, never verdicts; the verification flag accompanies every displayed score (see `mary-research.md` §5).

**Design choices documented for the record:**
- The element modifier only ever applies where the element reading adds information the aspect base has not already priced in (complementary pairs on sextiles/oppositions get +3; contrary pairs on squares/adjacent/150° pairs get −3; same-element pairs get 0 because trine/conjunction bases already encode the ease).
- Dignity penalties are capped so a classical footnote cannot collapse an easy aspect out of its band (e.g., Cancer–Scorpio stays Strong).
- Modern co-rulers are NOT scored (only classical rulers enter dignities), but the three traditional-only shared-ruler bonuses are reduced to +1 and flagged DISPUTED because modern practice assigns different co-rulers to Scorpio/Aquarius/Pisces [2][3][4].

---

## 3. Element-pair reference (what the modifier names mean)

- **Same element** — natural understanding (trine/conjunction).
- **Complementary** — fire–air (air feeds fire), earth–water (water shapes earth): mutually supportive [1][2].
- **Cross** — fire–earth, air–water: neither allies nor enemies; "different tempos, effortful" (documented analyst ruling; sources agree these are not the classic contrary pairs — see `mary-research.md` §6 conflict note).
- **Contrary** — fire–water (water quenches fire), earth–air (air dries/disturbs earth): the classical difficult pairs [1][2].

---

## 4. The 78-row unique-pair matrix

Columns: angular distance; aspect; element pair; modality pair; polarity pair; rulers (A / B); ruler-affinity note; traditional reading (one line, analyst's own words); deterministic score; band.

| # | Sign A | Sign B | Deg | Aspect | Element | Modality | Polarity | Rulers (A/B) | Ruler affinity note | Traditional reading (own words) | Score | Band |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aries | Aries | 0° | Conjunction | Fire/Fire | Cardinal/Cardinal | Yang–Yang | Mars / Mars | same planetary manager (Mars) | Instant recognition — same pace and same fire; brilliant when goals align, explosive when both insist on leading. | 80 | Strong |
| 2 | Aries | Taurus | 30° | Semi-sextile | Fire/Earth | Cardinal/Fixed | Yang–Yin | Mars / Venus | mutual detriment (Mars in Taurus; Venus in Aries) | Neighbours with different clocks — Aries sprints, Taurus strolls; patience on both sides turns friction into balance. | 48 | Challenging |
| 3 | Aries | Gemini | 60° | Sextile | Fire/Air | Cardinal/Mutable | Yang–Yang | Mars / Mercury | none | Sparky and playful — Aries acts, Gemini talks; easy chemistry that stays fresh while plans keep moving. | 81 | Strong |
| 4 | Aries | Cancer | 90° | Square | Fire/Water | Cardinal/Cardinal | Yang–Yin | Mars / Moon | Mars (Aries ruler) in fall in Cancer | Bold impulse meets cautious feeling — Aries' bluntness can wound Cancer's sensitivity; slow down and mind the soft spots. | 38 | Very challenging |
| 5 | Aries | Leo | 120° | Trine | Fire/Fire | Cardinal/Fixed | Yang–Yang | Mars / Sun | Sun (Leo ruler) exalted in Aries | A warm, generous fire duo — mutual admiration and shared adventure; the only trap is two crowns competing for one stage. | 91 | Excellent |
| 6 | Aries | Virgo | 150° | Quincunx | Fire/Earth | Cardinal/Mutable | Yang–Yin | Mars / Mercury | none | Doer meets editor — Aries finds Virgo fussy, Virgo finds Aries reckless; works when criticism becomes coaching. | 48 | Challenging |
| 7 | Aries | Libra | 180° | Opposition | Fire/Air | Cardinal/Cardinal | Yang–Yang | Mars / Venus | mutual detriment (Mars in Libra; Venus in Aries) | Magnetic opposites — self versus we; the attraction is real, and turn-taking must be, too. | 59 | Mixed |
| 8 | Aries | Scorpio | 150° | Quincunx | Fire/Water | Cardinal/Fixed | Yang–Yin | Mars / Mars | traditional shared ruler Mars (modern co-ruler Pluto differs — DISPUTED) | Intensity aimed differently — Aries open, Scorpio hidden; trust builds slowly and jealousy is the risk to manage. | 46 | Challenging |
| 9 | Aries | Sagittarius | 120° | Trine | Fire/Fire | Cardinal/Mutable | Yang–Yang | Mars / Jupiter | none | Adventure partners in spirit — honest, fun, fast-moving; commitments need deliberate attention or plans drift. | 88 | Excellent |
| 10 | Aries | Capricorn | 90° | Square | Fire/Earth | Cardinal/Cardinal | Yang–Yin | Mars / Saturn | Mars (Aries ruler) exalted in Capricorn; Saturn (Capricorn ruler) in fall in Aries | Sparks and structure — Capricorn's caution frustrates Aries' urgency, yet together they can build things that last. | 44 | Challenging |
| 11 | Aries | Aquarius | 60° | Sextile | Fire/Air | Cardinal/Fixed | Yang–Yang | Mars / Saturn | Saturn (Aquarius ruler) in fall in Aries (classical; modern Uranus rulership disputed) | Sparky and free — Aquarius loves Aries' daring, Aries loves the big ideas; watch for detachment when conflict heats. | 77 | Strong |
| 12 | Aries | Pisces | 30° | Semi-sextile | Fire/Water | Cardinal/Mutable | Yang–Yin | Mars / Jupiter | none | Direct meets dreamy — Pisces' sensitivity blunts Aries' edge; gentleness from one and grounding from the other. | 51 | Challenging |
| 13 | Taurus | Taurus | 0° | Conjunction | Earth/Earth | Fixed/Fixed | Yin–Yin | Venus / Venus | same planetary manager (Venus) | Cozy and loyal — shared tastes and routines; the risk is stubbornness hardening into a comfortable stalemate. | 80 | Strong |
| 14 | Taurus | Gemini | 30° | Semi-sextile | Earth/Air | Fixed/Mutable | Yin–Yang | Venus / Mercury | none | Steady meets scattered — Taurus craves the consistency Gemini can't promise; novelty must come with reassurance. | 51 | Challenging |
| 15 | Taurus | Cancer | 60° | Sextile | Earth/Water | Fixed/Cardinal | Yin–Yin | Venus / Moon | Moon (Cancer ruler) exalted in Taurus | A classic comfort match — home, security and loyalty flow naturally; both must voice feelings, not just store them. | 84 | Strong |
| 16 | Taurus | Leo | 90° | Square | Earth/Fire | Fixed/Fixed | Yin–Yang | Venus / Sun | none | Two proud fixed signs — affection is lavish, but stubborn standoffs over who yields first are the main hazard. | 45 | Challenging |
| 17 | Taurus | Virgo | 120° | Trine | Earth/Earth | Fixed/Mutable | Yin–Yin | Venus / Mercury | Venus (Taurus ruler) in fall in Virgo — nuance, band retained (see §6) | Grounded practical pair — routines, money and care align easily; guard against nitpicking replacing romance. | 84 | Strong |
| 18 | Taurus | Libra | 150° | Quincunx | Earth/Air | Fixed/Cardinal | Yin–Yang | Venus / Venus | shared ruler Venus (its two domiciles) | Venus rules both, yet rhythms differ — Taurus rooted, Libra social; shared pleasures bridge the pace gap. | 47 | Challenging |
| 19 | Taurus | Scorpio | 180° | Opposition | Earth/Water | Fixed/Fixed | Yin–Yin | Venus / Mars | mutual detriment (Venus in Scorpio; Mars in Taurus) | Opposites with the same depth — possessive magnetism; loyalty is strong, control struggles need honest rules. | 59 | Mixed |
| 20 | Taurus | Sagittarius | 150° | Quincunx | Earth/Fire | Fixed/Mutable | Yin–Yang | Venus / Jupiter | none | Comfort meets wanderlust — the bull wants plans, the archer wants horizons; negotiate freedom explicitly. | 48 | Challenging |
| 21 | Taurus | Capricorn | 120° | Trine | Earth/Earth | Fixed/Cardinal | Yin–Yin | Venus / Saturn | none | Ambitious, patient builders — shared values in work and home; keep playfulness alive beyond the to-do list. | 88 | Excellent |
| 22 | Taurus | Aquarius | 90° | Square | Earth/Air | Fixed/Fixed | Yin–Yang | Venus / Saturn | none | Habit meets experiment — Aquarius' unpredictability rattles Taurus; respecting the difference is the price of admission. | 42 | Challenging |
| 23 | Taurus | Pisces | 60° | Sextile | Earth/Water | Fixed/Mutable | Yin–Yin | Venus / Jupiter | Venus (Taurus ruler) exalted in Pisces | Tender and devotional — water softens earth into gardens; agree on practical duties so romance stays dreamy. | 84 | Strong |
| 24 | Gemini | Gemini | 0° | Conjunction | Air/Air | Mutable/Mutable | Yang–Yang | Mercury / Mercury | same planetary manager (Mercury) | A conversation that never ends — fun, curious, restless; anchor the bond with rituals or it evaporates. | 80 | Strong |
| 25 | Gemini | Cancer | 30° | Semi-sextile | Air/Water | Mutable/Cardinal | Yang–Yin | Mercury / Moon | none | Airy logic meets tidal feeling — Cancer needs the reassurance Gemini forgets to give; translate, don't dismiss. | 54 | Challenging |
| 26 | Gemini | Leo | 60° | Sextile | Air/Fire | Mutable/Fixed | Yang–Yang | Mercury / Sun | none | Vivid and sociable — Leo warms to Gemini's wit; keep the wandering attention focused on the one on stage. | 81 | Strong |
| 27 | Gemini | Virgo | 90° | Square | Air/Earth | Mutable/Mutable | Yang–Yin | Mercury / Mercury | shared ruler Mercury; Mercury exalted in Virgo (nuance, band retained) | Same messenger planet, different dialects — ideas versus details; brilliant collaboration when judgments soften. | 47 | Challenging |
| 28 | Gemini | Libra | 120° | Trine | Air/Air | Mutable/Cardinal | Yang–Yang | Mercury / Venus | none | Breezy social harmonics — talk, taste and fairness align; just decide who actually makes the decisions. | 88 | Excellent |
| 29 | Gemini | Scorpio | 150° | Quincunx | Air/Water | Mutable/Fixed | Yang–Yin | Mercury / Mars | none | Chatty light meets still water — Scorpio probes, Gemini deflects; honesty about depth closes the gap. | 48 | Challenging |
| 30 | Gemini | Sagittarius | 180° | Opposition | Air/Fire | Mutable/Mutable | Yang–Yang | Mercury / Jupiter | mutual detriment (Mercury in Sagittarius; Jupiter in Gemini) | Opposite ends of the curiosity axis — big-picture fire meets quicksilver air; freedom must be mutual. | 59 | Mixed |
| 31 | Gemini | Capricorn | 150° | Quincunx | Air/Earth | Mutable/Cardinal | Yang–Yin | Mercury / Saturn | none | Improviser meets architect — Capricorn's structure can feel like a cage; defined roles ease the rub. | 45 | Challenging |
| 32 | Gemini | Aquarius | 120° | Trine | Air/Air | Mutable/Fixed | Yang–Yang | Mercury / Saturn | none | Electric friendship first — ideas, networks, experiments; name the feelings out loud to keep it romantic. | 88 | Excellent |
| 33 | Gemini | Pisces | 90° | Square | Air/Water | Mutable/Mutable | Yang–Yin | Mercury / Jupiter | Mercury in detriment and fall in Pisces; Jupiter in detriment in Gemini (capped) | Literal meets symbolic — Pisces reads between lines Gemini hasn't written; patience prevents misread signals. | 39 | Very challenging |
| 34 | Cancer | Cancer | 0° | Conjunction | Water/Water | Cardinal/Cardinal | Yin–Yin | Moon / Moon | same planetary manager (Moon) | A shelter of shared feeling — nurturing, loyal, intuitive; moods must be shared, not stored. | 80 | Strong |
| 35 | Cancer | Leo | 30° | Semi-sextile | Water/Fire | Cardinal/Fixed | Yin–Yang | Moon / Sun | none | Tides meet sunshine — Leo's public warmth versus Cancer's private nesting; appreciation is the bridge. | 51 | Challenging |
| 36 | Cancer | Virgo | 60° | Sextile | Water/Earth | Cardinal/Mutable | Yin–Yin | Moon / Mercury | none | Devoted caretakers — practical help is this pair's love language; watch perfectionism masquerade as care. | 81 | Strong |
| 37 | Cancer | Libra | 90° | Square | Water/Air | Cardinal/Cardinal | Yin–Yang | Moon / Venus | none | Feelings versus fairness — Libra rationalizes what Cancer needs felt; security must be stated, not assumed. | 45 | Challenging |
| 38 | Cancer | Scorpio | 120° | Trine | Water/Water | Cardinal/Fixed | Yin–Yin | Moon / Mars | mutual fall (Moon in Scorpio; Mars in Cancer) — nuance, band retained (see §6) | Deep-water kindred — profound loyalty and intuition; the only real risk is secrecy, so keep the currents open. | 82 | Strong |
| 39 | Cancer | Sagittarius | 150° | Quincunx | Water/Fire | Cardinal/Mutable | Yin–Yang | Moon / Jupiter | Jupiter (Sagittarius ruler) exalted in Cancer — softens but does not rescue the quincunx | Hearth meets horizon — Sagittarius' candor can scald; freedom with a guaranteed return helps. | 48 | Challenging |
| 40 | Cancer | Capricorn | 180° | Opposition | Water/Earth | Cardinal/Cardinal | Yin–Yin | Moon / Saturn | mutual detriment (Moon in Capricorn; Saturn in Cancer) | Opposite poles of home and ambition — complementary caretakers; warmth must be scheduled into the diary. | 59 | Mixed |
| 41 | Cancer | Aquarius | 150° | Quincunx | Water/Air | Cardinal/Fixed | Yin–Yang | Moon / Saturn | Saturn (Aquarius ruler) in detriment in Cancer | Attachment meets detachment — Aquarius' distance alarms Cancer; agree on what "space" actually means. | 44 | Challenging |
| 42 | Cancer | Pisces | 120° | Trine | Water/Water | Cardinal/Mutable | Yin–Yin | Moon / Jupiter | Jupiter (Pisces ruler) exalted in Cancer | Intuition squared — imaginative, protective, devoted; agree on who handles reality's paperwork. | 91 | Excellent |
| 43 | Leo | Leo | 0° | Conjunction | Fire/Fire | Fixed/Fixed | Yang–Yang | Sun / Sun | same planetary manager (Sun) | A double sun — generous, theatrical, loyal; share the spotlight or rivalry shades the shine. | 80 | Strong |
| 44 | Leo | Virgo | 30° | Semi-sextile | Fire/Earth | Fixed/Mutable | Yang–Yin | Sun / Mercury | none | Radiance meets realism — Virgo's notes can dim Leo's glow; praise publicly, refine privately. | 54 | Challenging |
| 45 | Leo | Libra | 60° | Sextile | Fire/Air | Fixed/Cardinal | Yang–Yang | Sun / Venus | Sun (Leo ruler) in fall in Libra — nuance, band retained (see §6) | Glamour and grace — a mutual-admiration society; mind the flattery trap and keep the praise honest. | 77 | Strong |
| 46 | Leo | Scorpio | 90° | Square | Fire/Water | Fixed/Fixed | Yang–Yin | Sun / Mars | none | Two sovereigns, one throne — passionate fixed fire and water; power struggles are the test, devotion the prize. | 42 | Challenging |
| 47 | Leo | Sagittarius | 120° | Trine | Fire/Fire | Fixed/Mutable | Yang–Yang | Sun / Jupiter | none | A festival of fire — playful, adventurous, honest; egos stay light when laughter leads. | 88 | Excellent |
| 48 | Leo | Capricorn | 150° | Quincunx | Fire/Earth | Fixed/Cardinal | Yang–Yin | Sun / Saturn | Saturn (Capricorn ruler) in detriment in Leo | Applause meets discipline — Capricorn withholds the praise Leo needs; goals can unite if respect is explicit. | 44 | Challenging |
| 49 | Leo | Aquarius | 180° | Opposition | Fire/Air | Fixed/Fixed | Yang–Yang | Sun / Saturn | mutual detriment (Sun in Aquarius; Saturn in Leo) | Stage meets revolution — magnetic opposites; individuality and togetherness need deliberate balance. | 59 | Mixed |
| 50 | Leo | Pisces | 150° | Quincunx | Fire/Water | Fixed/Mutable | Yang–Yin | Sun / Jupiter | none | Lion meets sea — Pisces adores, Leo protects; keep the dreams anchored in a shared reality. | 45 | Challenging |
| 51 | Virgo | Virgo | 0° | Conjunction | Earth/Earth | Mutable/Mutable | Yin–Yin | Mercury / Mercury | same planetary manager (Mercury) | Two careful craftspeople — dependable, improvement-minded; perfectionism must never turn inward on each other. | 80 | Strong |
| 52 | Virgo | Libra | 30° | Semi-sextile | Earth/Air | Mutable/Cardinal | Yin–Yang | Mercury / Venus | Venus (Libra ruler) in fall in Virgo — nuance, band retained (see §6) | Precision meets poise — Virgo critiques, Libra smooths; useful when feedback stays kind. | 47 | Challenging |
| 53 | Virgo | Scorpio | 60° | Sextile | Earth/Water | Mutable/Fixed | Yin–Yin | Mercury / Mars | none | Quiet power couple — discernment plus depth; trust builds brick by brick, and jealousy is watched closely. | 81 | Strong |
| 54 | Virgo | Sagittarius | 90° | Square | Earth/Fire | Mutable/Mutable | Yin–Yang | Mercury / Jupiter | mutual detriment (Mercury in Sagittarius; Jupiter in Virgo) | Details versus big picture — the editor and the philosopher; schedule some spontaneity and tolerate imperfection. | 39 | Very challenging |
| 55 | Virgo | Capricorn | 120° | Trine | Earth/Earth | Mutable/Cardinal | Yin–Yin | Mercury / Saturn | none | Earth's engineers — goals, health, money and routines align beautifully; remember affection needs no audit. | 88 | Excellent |
| 56 | Virgo | Aquarius | 150° | Quincunx | Earth/Air | Mutable/Fixed | Yin–Yang | Mercury / Saturn | none | Systems versus systems-thinking — order meets chaos; give each other's methods independent room. | 45 | Challenging |
| 57 | Virgo | Pisces | 180° | Opposition | Earth/Water | Mutable/Mutable | Yin–Yin | Mercury / Jupiter | Mercury in detriment and fall in Pisces; Jupiter in detriment in Virgo (capped) | Opposite shores of one river — practical craft meets boundless empathy; each completes what the other lacks. | 59 | Mixed |
| 58 | Libra | Libra | 0° | Conjunction | Air/Air | Cardinal/Cardinal | Yang–Yang | Venus / Venus | same planetary manager (Venus) | A gallery of harmony — beauty, diplomacy, romance; decisions stall unless one partner takes the wheel. | 80 | Strong |
| 59 | Libra | Scorpio | 30° | Semi-sextile | Air/Water | Cardinal/Fixed | Yang–Yin | Venus / Mars | mutual detriment (Venus in Scorpio; Mars in Libra) | Charm meets depth — Scorpio wants all-or-nothing, Libra weighs options; early honesty prevents later suspicion. | 48 | Challenging |
| 60 | Libra | Sagittarius | 60° | Sextile | Air/Fire | Cardinal/Mutable | Yang–Yang | Venus / Jupiter | none | Air and fire in easy conversation — optimistic, sociable, curious; anchor the plans or they float away. | 81 | Strong |
| 61 | Libra | Capricorn | 90° | Square | Air/Earth | Cardinal/Cardinal | Yin–Yang | Venus / Saturn | Saturn (Capricorn ruler) exalted in Libra — softens the square | Aesthetics versus achievement — Saturn's structure with Venus' style; explicit scheduling beats resentment. | 45 | Challenging |
| 62 | Libra | Aquarius | 120° | Trine | Air/Air | Cardinal/Fixed | Yang–Yang | Venus / Saturn | Saturn (Aquarius ruler) exalted in Libra (classical; modern Uranus rulership disputed) | Ideals in the air — friendship-forward, fair-minded; warmth needs showing, not just reasoning. | 91 | Excellent |
| 63 | Libra | Pisces | 150° | Quincunx | Air/Water | Cardinal/Mutable | Yang–Yin | Venus / Jupiter | Venus (Libra ruler) exalted in Pisces — softens but does not rescue the quincunx | Romance squared — beauty, empathy, fantasy; keep one practical foot on the ground. | 51 | Challenging |
| 64 | Scorpio | Scorpio | 0° | Conjunction | Water/Water | Fixed/Fixed | Yin–Yin | Mars / Mars | same planetary manager (Mars) | An unbreakable, private bond — all-or-nothing loyalty; secrets and grudges are the only real danger. | 80 | Strong |
| 65 | Scorpio | Sagittarius | 30° | Semi-sextile | Water/Fire | Fixed/Mutable | Yin–Yang | Mars / Jupiter | none | Depth meets distance — Sagittarius' candor can wound Scorpio's pride; truth delivered with tact. | 51 | Challenging |
| 66 | Scorpio | Capricorn | 60° | Sextile | Water/Earth | Fixed/Cardinal | Yin–Yin | Mars / Saturn | Mars (Scorpio ruler) exalted in Capricorn | A strategic power pairing — ambitious, loyal, private; don't let the shared workload eclipse intimacy. | 84 | Strong |
| 67 | Scorpio | Aquarius | 90° | Square | Water/Air | Fixed/Fixed | Yin–Yang | Mars / Saturn | none | Possession meets freedom — fixed water versus fixed air; agree on boundaries before anyone tests them. | 45 | Challenging |
| 68 | Scorpio | Pisces | 120° | Trine | Water/Water | Fixed/Mutable | Yin–Yin | Mars / Jupiter | none | Two currents, one ocean — intuitive, artistic, devoted; keep the reality checks gentle. | 88 | Excellent |
| 69 | Sagittarius | Sagittarius | 0° | Conjunction | Fire/Fire | Mutable/Mutable | Yang–Yang | Jupiter / Jupiter | same planetary manager (Jupiter) | Two arrows in flight — freedom, honesty, humor; commitments need intentional landing spots. | 80 | Strong |
| 70 | Sagittarius | Capricorn | 30° | Semi-sextile | Fire/Earth | Mutable/Cardinal | Yin–Yang | Jupiter / Saturn | Jupiter (Sagittarius ruler) in fall in Capricorn | Trailblazer meets mountaineer — optimism versus realism; a strong mentoring energy if criticism stays kind. | 50 | Challenging |
| 71 | Sagittarius | Aquarius | 60° | Sextile | Fire/Air | Mutable/Fixed | Yang–Yang | Jupiter / Saturn | none | Explorers of ideas and places — independent, unconventional; check in often or the orbits drift apart. | 81 | Strong |
| 72 | Sagittarius | Pisces | 90° | Square | Fire/Water | Mutable/Mutable | Yang–Yin | Jupiter / Jupiter | traditional shared ruler Jupiter (modern co-ruler Neptune differs — DISPUTED) | Blunt truth meets soft dream — Sagittarius' arrows can sting; compassion is the common language to build. | 43 | Challenging |
| 73 | Capricorn | Capricorn | 0° | Conjunction | Earth/Earth | Cardinal/Cardinal | Yin–Yin | Saturn / Saturn | same planetary manager (Saturn) | Co-CEOs of a life — dependable, ambitious, traditional; tenderness needs a place on the agenda. | 80 | Strong |
| 74 | Capricorn | Aquarius | 30° | Semi-sextile | Earth/Air | Cardinal/Fixed | Yin–Yang | Saturn / Saturn | traditional shared ruler Saturn (modern co-ruler Uranus differs — DISPUTED) | Success meets systems — neighbours with different maps; respect each other's definition of progress. | 52 | Challenging |
| 75 | Capricorn | Pisces | 60° | Sextile | Earth/Water | Cardinal/Mutable | Yin–Yin | Saturn / Jupiter | Jupiter (Pisces ruler) in fall in Capricorn — nuance, band retained (see §6) | Mountain meets sea — Pisces' imagination softens Capricorn's edges; boundaries need kindness, not walls. | 77 | Strong |
| 76 | Aquarius | Aquarius | 0° | Conjunction | Air/Air | Fixed/Fixed | Yang–Yang | Saturn / Saturn | same planetary manager (Saturn) | Futurists in tandem — free, inventive, friendly; intimacy must be built deliberately, not assumed. | 80 | Strong |
| 77 | Aquarius | Pisces | 30° | Semi-sextile | Air/Water | Fixed/Mutable | Yang–Yin | Saturn / Jupiter | none | Circuitry meets dream — Aquarius analyzes what Pisces senses; both honor difference, both must listen. | 54 | Challenging |
| 78 | Pisces | Pisces | 0° | Conjunction | Water/Water | Mutable/Mutable | Yin–Yin | Jupiter / Jupiter | same planetary manager (Jupiter) | A shared ocean of feeling — artistic, compassionate, quietly psychic; practical anchors keep the dreams afloat. | 80 | Strong |

---

## 5. Distribution and QA checks (for the developer)

- Row count must be exactly **78** (12 conjunction + 12 semi-sextile + 12 sextile + 12 square + 12 trine + 12 quincunx + 6 opposition).
- Band distribution produced by the formula above: **Excellent 10, Strong 26 (incl. all 12 same-sign), Mixed 6, Challenging 33, Very challenging 3**.
- Every opposition pair must resolve to 59 except Aries–Libra (59)… all six resolve to 59 — assert this.
- All same-sign pairs must be exactly 80.
- The lowest scores must be Aries–Cancer 38, Gemini–Pisces 39, Virgo–Sagittarius 39; the highest Aries–Leo, Cancer–Pisces, Libra–Aquarius at 91.
- The API must accept the two signs in any order and return the same score (symmetry in §8).

## 6. Flags: where the aspect reading and element reading disagree (and the ruling)

1. **All six oppositions** — element reading says *complementary, supportive*; aspect reading says *hard, polarising* (and dignities add *mutual detriment* [3]). **Ruling: aspect dominates; element moderates (+3 kept).** Justification: classical classification of the opposition among the hard aspects [1]; Cafe Astrology treats opposition as its own category rather than an easy class [9]. Result: 59 (Mixed) with "magnetic opposites" copy.
2. **Cancer–Scorpio (trine, both water)** — element says excellent; dignities say Cancer's Moon in fall in Scorpio and Scorpio's Mars in fall in Cancer [3]. **Ruling: element/aspect dominates; dignity applied as capped −6 nuance** → 82 (Strong, top). Content notes emotional depth with a secrecy caveat.
3. **Taurus–Virgo (trine)** — Venus (Taurus ruler) in fall in Virgo [3]; element says excellent. **Ruling: element/aspect dominates; dignity −4 nuance** → 84 (Strong). Content notes the practical bond with a nitpick caveat.
4. **Leo–Libra (sextile)** — Sun in fall in Libra [3]; complementary elements say easy. **Ruling: aspect/element dominate; dignity −4 nuance** → 77 (Strong).
5. **Capricorn–Pisces (sextile)** — Jupiter (Pisces ruler) in fall in Capricorn [3]. **Ruling: aspect/element dominate; dignity −4 nuance** → 77 (Strong).
6. **Aries–Aquarius (sextile)** — Saturn in fall in Aries [3] — **DISPUTED** because modern practice co-rules Aquarius with Uranus [2][3][4]; the classical penalty is applied (77, Strong) and flagged in content as a classical-modern difference.
7. **Gemini–Virgo (square)** — shared Mercury + Mercury exalted in Virgo [3] pull the classic "hard square" upward (+5 capped); the square's modality friction dominates the band → 47 (Challenging, top). Content frames it as "brilliant working chemistry, hard domestic chemistry".
8. **Taurus–Libra (quincunx)** — shared Venus (+2) partially offsets the awkward angle → 47 (Challenging). Content notes shared aesthetics versus different rhythms.
9. **Aries–Scorpio / Sagittarius–Pisces / Capricorn–Aquarius** — traditional-only shared rulers (+1, DISPUTED [2][3][4]); applied as shown in the table.

## 7. Deriving the per-category scores (for the backend)

The six category cards (see `mary-research.md` §4.3) should be **deterministic derivatives** of the pair score, not independent ratings:

- **Love** = pair score + 4 (attraction is the sun-sign method's strongest suit), clamp 35–95.
- **Sexual** = pair score + 6 for aspect in {conjunction, trine, sextile, opposition} (fire/water-heavy pairs feel chemistry regardless of friction), else pair score + 2; clamp 35–95.
- **Friendship** = pair score + 2 for same element or complementary element, −2 for contrary element; clamp 35–95.
- **Communication** = pair score − 6 for aspect in {square, quincunx, semi-sextile} (the friction concentrates in talk), else pair score; clamp 35–95.
- **Trust** = pair score − 8 for aspect in {opposition, square} (trust is where axis/modality friction bites), else pair score − 2; clamp 35–95.
- **Emotional** = pair score + 2 for water-involving pairs, 0 otherwise; clamp 35–95.
- **Overall** = the raw pair score from §2. Band labels per §2 Step 5.

These offsets are analyst recommendations (bounded, deterministic, explainable); they are NOT copied from any site (competitor values were deliberately not recorded [8][15]). A one-line method note should accompany displayed scores on the site (verification-flag policy).

## 8. Symmetry and the 144 ordered pairings

Compatibility by this method is **symmetric**: the aspect, element pair, modality pair, polarity pair, ruler affinities and score are identical for A–B and B–A (only the pronoun order in copy differs). Therefore:

- 78 unique rows above cover all **144 ordered pairings** (78 = 12 same-sign + 66 off-diagonal; 66 × 2 + 12 = 144).
- The API should canonicalise the pair (e.g., always store/sort by wheel index) and let the frontend render "Aries & Taurus" or "Taurus & Aries" from the same record.
- SEO-wise, either one canonical URL per unique pair (`/compatibility/aries/taurus`) with the mirrored query rendering a title reorder, or 144 thin canonical pages pointing at the 78 records — decision for the product/SEO owner (see `astrotalk-comparison.md`).
