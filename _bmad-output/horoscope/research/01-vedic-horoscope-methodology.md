# Mary (Analyst) — Research 1: How Vedic horoscopes are derived
**Horoscope Upgrade · Step 1 of 5 · 2026-11-24**
Output dir: `_bmad-output/horoscope/research/`

Purpose: explain, in our own words and with citations, how Daily / Weekly / Monthly / Yearly horoscopes are derived in the Vedic tradition, so the rule set (`03-ruleset.md`) rests on verifiable ground rather than invention.

---

## 0. Framing decision (what "our horoscope" is)

Vyotish horoscopes are **Moon-sign (rashi) gochara** horoscopes:

- The reader identifies with one of 12 **Vedic Moon signs (rashis)**. Each page treats that rashi as the reference point — the sign itself is counted as house 1, and every transiting planet's position is counted **zodiacally from that sign**. This is the *Chandra Lagna* gochara convention: "Analyze transits from Moon first and also Lagna… Parasara emphasized Moon-based gochara because the Moon governs mind/feelings" — [The Art of Vedic Astrology, "Analyzing Basics: Transits (I)"](https://www.theartofvedicastrology.com/?page_id=356).
- This matches established practice for public horoscope publishing: "All Indastro.com horoscopes are based on Vedic Moon Sign… not Sun Signs" — [Indastro, "Moon transit in Astrology"](https://www.indastro.com/transit-planets/transit-of-moon.html). PanchangBodh likewise positions "Rashi-first: your Moon sign, called your Rashi" (site analysis in `02`).
- **Because we publish per-sign horoscopes without the reader's birth chart**, everything that needs a natal chart is **explicitly out of scope** for our engine: dasha timing, ashtakavarga bindus, paaya, double-transit judgement against a specific chart. The user's brief already constrains this: yearly horoscopes must use "**dasha-independent transit effects**". We say so on the page (honest framing), and our tone rules (no absolutes) follow naturally.

**What is IN scope:** transit house-counts from the rashi, classical favorability tables, vedha (obstruction), Sade Sati / Dhaiya phases, retrogression, tithi/nakshatra/panchang factors (already computed by our backend), and weekday-based lucky attributions.

---

## 1. Classical sources used (and their status)

| Source | Status | What we take from it |
|---|---|---|
| **Phaladeepika** (Mantreswara) — English translation by V. Subrahmanya Sastri, 2nd ed. 1950, [archive.org item `Phaladeepika2ndEd.1950ByVSubrahmanyaSastri`](https://archive.org/details/Phaladeepika2ndEd.1950ByVSubrahmanyaSastri) | **Primary classical anchor** (confirmed on archive.org; chapter-level verification pending — see UNVERIFIED-1) | The gochara-from-Moon framework and per-planet favorable-house tradition |
| **Brihat Parashara Hora Shastra (BPHS)** | Referenced for the Moon-first principle; **not independently verified online in this pass** (see UNVERIFIED-2) | The *rationale* for Moon-based gochara (via the Art of Vedic Astrology article quoting the Parasara tradition) |
| **Sarvartha Chintamani / gochara tradition** | Via secondary English write-ups (see UNVERIFIED-3) | Vedha (obstruction) pairs |
| Widely-published gochara tables (modern English references) | Secondary corroboration | The full per-planet favorable/unfavorable house table used by commercial sites |

### UNVERIFIED markers carried into the rule set
- **UNVERIFIED-1**: That the gochara chapter is **chapter 26** of Phaladeepika. The archive.org item is confirmed as the Sastri 1950 English translation, but the online page does not expose its table of contents. Chapter numbering was not verified against the PDF in this pass. → Action at build time (not a blocker): download the PDF once and pin the chapter citation.
- **UNVERIFIED-2**: BPHS chapter authorship. Circulating BPHS editions are reconstructions and scholars dispute some chapters. We therefore **anchor the tables to Phaladeepika + the widely-published gochara tradition**, and cite BPHS only for the Moon-first rationale, attributed through the [Art of Vedic Astrology article](https://www.theartofvedicastrology.com/?page_id=356).
- **UNVERIFIED-3**: The vedha pair table below comes from a modern English write-up ([Ashtakvarga Jyoti blog](https://ashtakvargajyoti.wordpress.com/)) that itself names no classical text. Pairs are consistent across sources found, but exact sets vary between traditions. We treat vedha as a **modifier that dampens** (not erases) results, which is the safe editorial choice.
- **UNVERIFIED-4**: Graha→direction (dik) table is standard in popular/vastu literature but we found only secondary web sources (e.g. [Dik Bala notes on Scribd](https://www.scribd.com/document/315247216/Dik-Bal-of-Grahas)); the related classical *dik bala* (directional strength) is a different concept. Our lucky-direction rule is therefore labelled an editorial convention built on popular tradition.

**No text from any source is copied.** Sources give us structure and the numeric tables; all wording on our site is written fresh by the content step (Paige).

---

## 2. Transit durations — why each period looks at different planets

| Graha | ~Time per sign | Role in our horoscopes |
|---|---|---|
| Moon | 2.25–2.5 days | **Daily driver** — which house of your rashi it occupies today |
| Sun | 1 month | Monthly backdrop; fixed calendar anchor |
| Mars | ~45 days (7–8 months when retrograde, ~2-yearly) | Weeks–months tone |
| Mercury | ~21 days (retrogrades ~3×/year) | Weeks–months tone; education/commerce |
| Venus | ~26 days (retro ~18-monthly) | Weeks–months tone; love/comforts |
| Jupiter | ~12.5 months | **Yearly driver** |
| Saturn | ~2.5 years (30 months) | **Yearly driver**; Sade Sati clock |
| Rahu–Ketu | ~19 months per sign (retrograde axis) | **Yearly driver** (axis = pressure points) |

Source: [The Art of Vedic Astrology, Transits (I)](https://www.theartofvedicastrology.com/?page_id=356) (their table: Sun 1 month, Moon 2.25 days, Mars 45 days, Mercury 21 days, Venus 26 days, Jupiter 12.5 months, Saturn 2.5 yrs, Rahu/Ketu 19 months). Mercury retrograde ~3×/year also noted by [LuckyGemFinder gochara page](https://luckygemfinder.com/gochara-predictions.html). Our own astronomy-engine pipeline computes exact sign-crossing dates, so these approximations are used for *editorial tone*, not math.

## 3. Daily horoscope — derivation

**Inputs (all already computable in our backend):**
1. **Moon's house from the rashi** — the single most important daily factor. Count = `((moonSiderealSign − sign) mod 12) + 1`.
2. **Moon's nakshatra + tithi + weekday** — already produced by our panchang engine.
3. Other planets' houses from the rashi (the slower backdrop), incl. retrograde flags.

**The classical Moon table** (from [Indastro](https://www.indastro.com/transit-planets/transit-of-moon.html), which lists favorable houses 1, 3, 6, 10, 11 and describes per-house results across health/mind/wealth):
- Favorable: 1, 3, 6, 10, 11 — and **7** in the Phaladeepika-lineage tables (Indastro's own page shows an internal inconsistency: it lists 7 as unfavorable yet describes the 7th-house results positively — love/income). **Our rule set takes Moon-7 as favorable**, flagged as a recorded variance.
- Unfavorable: 2, 4, 5, 8, 9, 12. House **8 is "Chandrashtama"** — traditionally the most caution-worthy Moon day; our tone rules cap how strongly we may phrase it (no fear language).
- Per-house themes extracted from Indastro's table (health/mind/wealth): 1st = steady health, contentment; 3rd = improving health, satisfaction, recognition; 6th = stable health, peace at home, profitable efforts; 7th = romance, rising income; 10th = energy, recognition, promotion; 11th = stable mind, income gains; 2nd = friction in money matters; 4th = heavy emotions, overspending; 5th = mental stress, poor judgement calls; 8th = stress, health sensitivity; 9th = fatigue, slowing reputation; 12th = expense, disturbed rest.

**Supporting factors** that differentiate one day from another: weekday planet (drives the lucky-attributions below), the day's strongest benefic/malefic *other* transit for that sign, vedha on the Moon's favorable placement, and retrograde flags (tone = "revisit/delay", never catastrophe).

## 4. Weekly horoscope — derivation

The Moon crosses ~2.7 signs per week, so the week is described by the **sequence of Moon houses** it sweeps through the reader's rashi (e.g. "Moon moves through your 4th, 5th and 6th this week"), layered with:
1. **Fast-planet sign changes during the week** (Mercury, Venus, sometimes Mars) — new house placements activate new themes mid-week.
2. **Retrograde stations** (Mercury turning retrograde/direct this week is the classic "review communication" moment).
3. The **slow backdrop** (Jupiter/Saturn/Rahu houses) unchanged within a week but used for framing.
4. **Panchang arc**: which tithis/nakshatras fall in the week; full/new moon if it lands in the window.

Rule-set output for a week: per-category score = day-weighted average of daily scores (weekdays weighted equally), plus explicit mention of any fast-planet sign change or station during the window. This keeps weekly text grounded in the same engine as daily — no separate made-up system.

## 5. Monthly horoscope — derivation

1. **Sun's sign = the month's anchor** (solar month; Sankranti/ingress date computed exactly). Sun's house from the rashi sets the month's headline theme (favorable 3, 6, 10, 11).
2. **Mars/Mercury/Venus month arcs**: which houses each occupies for how many days of the month (a planet spending 25 of 30 days in house 6 dominates the tone).
3. **Lunations**: amavasya (new moon) and purnima (full moon) dates and the nakshatras involved — extracted from our panchang engine.
4. **Retrograde station dates** falling within the month.
5. **Best & Testing Days**: computed, not invented — we score every day of the month for the sign (same daily engine), then surface the highest-scoring and lowest-scoring day(s) with their driver ("Moon in your 11th; Mercury supports study" etc.).
6. **Month's Sky & Panchang block**: key ingresses, lunations, notable nakshatra entries, and festivals/vrats falling in the month — our DB already holds festivals/vrat data (see `04-existing-code-review.md`).

## 6. Yearly horoscope — derivation

Slow movers set the year. All computed from exact sign-ingress dates, split-weighted when a planet changes sign mid-year (days-in-each-sign weighting):

1. **Jupiter** (favorable from Moon: 2, 5, 7, 9, 11 per the standard table; source: [LuckyGemFinder gochara table](https://luckygemfinder.com/gochara-predictions.html), consistent with the Phaladeepika-lineage tradition): which house(s) it holds during the year; ingress dates get month-level prominence. Jupiter transiting the rashi itself (house 1) is popularly read as supportive overall ([RoxyAPI gochara overview](https://roxyapi.com/blogs/planetary-transits-gochar-vedic-astrology-prediction-guide) notes "Jupiter's transit over natal Moon is generally positive"); we apply a modest boost, flagged as editorial.
2. **Saturn** (favorable 3, 6, 11):
   - **Sade Sati phases**: Saturn in 12th = first phase, 1st = peak, 2nd = last phase; 4th and 8th = "ardhastama"/Dhaiya phases — recorded by both [LuckyGemFinder](https://luckygemfinder.com/gochara-predictions.html) ("12th = first phase of Sade Sati, 1st = second, 2nd = last; 4th = ardhastama Shani") and [Art of Vedic Astrology](https://www.theartofvedicastrology.com/?page_id=356) ("Saturn transiting 12th, 1st, 2nd from Moon = ~7.5 years…; Saturn in 4th and 8th = Dhaiyas"). Our engine encodes the *phase* and applies a capped, non-fearful modifier; per our site policy, Sade Sati is described as a period of extra effort and maturing, never doom.
   - Vipreet-style relief: a benefic occupying Saturn's vedha point dampens the Saturn pressure (rule set encodes vedha pairs; Sun–Saturn mutually exempt, per the vedha source).
3. **Rahu–Ketu axis**: the axis shows where pressure/opportunity sits ([Art of Vedic Astrology](https://www.theartofvedicastrology.com/?page_id=356): "Rahu-Ketu axis shows the problem area… Rahu can also open hidden doors… especially if Jupiter aspects that sign"). Favorable node houses recorded as 3, 6, 10, 11 by several modern references; classical lists often restrict to 3, 6, 11 — **variance flagged; rule set uses 3, 6, 11 primary with 10 as weak-positive.**
4. **Double transit** (a sign lit by both Jupiter and Saturn) is *described qualitatively* where it lands on houses of the rashi — but as sign-generic publishers we do not claim chart-specific activation ([Art of Vedic Astrology](https://www.theartofvedicastrology.com/?page_id=356) describes the concept; we use a light editorial touch).
5. **Dasha-independent** by explicit requirement (see §0).

**Yearly month-by-month ratings**: each calendar month scored with the same engine using mid-month planet positions (split-weighting at ingresses), producing the 4-level rating + a one-line reason generated from that month's top favorable and top unfavorable transit.

## 7. Lucky Colour, Number, Direction, Mantra, Deity — traditional basis

These are **attribution conventions** with a traditional basis, applied deterministically by our rule set (details in `03-ruleset.md`):

**Colours** — planetary colours are a stable popular tradition: Sun saffron/gold/orange, Moon white/silver, Mars red, Mercury green, Jupiter yellow/gold, Venus white/cream, Saturn blue/black/grey, Rahu smoky, Ketu grey/brown (corroborated by [Kripalu's weekday colour guide](https://kripalu.org/living-kripalu/what-wear-every-day-week-according-vedic-astrology), [DivyaIndia zodiac colours guide](https://www.divyaindia.com/blogs/blog/your-zodiac-sign-its-sacred-colour-an-indian-astrology-guide), [AllThingsVedic colour therapy](https://www.allthingsvedic.in/post/colour-therapy-astrology-use-colours-to-balance-your-chart)). Rashi base colours follow the **sign lord's colour** (Aries→red … Pisces→yellow; same convention as [Vidhata's lucky-colour explainer](https://vidhata.app/blog/lucky-colour-as-per-rashi-and-date-of-birth), which derives lucky colour from the Moon-sign lord). Our *daily* lucky colour rotates by the day's strongest benefic (fallback: weekday planet → sign lord).

**Numbers** — the navagraha→number 1–9 mapping is the basis of Vedic numerology: 1 Sun, 2 Moon, 3 Jupiter, 4 Rahu, 5 Mercury, 6 Venus, 7 Ketu, 8 Saturn, 9 Mars ([Swarnsiddhi numerology reference](https://swarnsiddhi.com/numerology-number-meanings), [Times of India on ruling numbers](https://timesofindia.indiatimes.com/astrology/numerology-tarot/ruling-numbers-and-their-planets-how-numerology-connects-to-astrology/articleshow/114576206.cms)). Base number = **sign lord's number**; daily number rotates via the day's strongest benefic (fallback: sign lord). Friendly-number pairs (e.g. Sun friendly with 2, 3, 5, 9) are optionally used to give a second number — editorial choice, flagged for owner.

**Direction** — graha-direction (dik) popular table: Sun East, Moon Northwest, Mars South, Mercury North, Jupiter Northeast, Venus Southeast, Saturn West, Rahu Southwest, Ketu unassigned (secondary sources; **UNVERIFIED-4**). Base = sign lord's direction; daily rotation via the day's strongest benefic, with Ketu excluded from direction assignment (falls through to next benefic).

**Mantra & Deity** — popular remedial tradition pairs planets with beej (seed) mantras and presiding deities: e.g. Surya "Om Hraam Hreem Hraum Sah Suryaya Namah", Shani "Om Praam Preem Praum Sah Shanaischaraya Namah", Rahu "Om Bhraam Bhreem Bhraum Sah Rahave Namah" ([Exotic India on Shani](https://www.exoticindiaart.com/article/all-about-shani-dev/)); weekday deities (Sunday Surya, Monday Shiva, Saturday Shani/Hanuman) from the same tradition ([Kripalu weekday guide](https://kripalu.org/living-kripalu/what-wear-every-day-week-according-vedic-astrology)). Per-rashi deity lists vary by source (e.g. Aries: Hanuman in popular remedy lists, Kartikeya as the sign's guardian deity — [Times of India deity guide](https://timesofindia.indiatimes.com/astrology/zodiacs-astrology/identifying-hindu-deities-governing-each-zodiac-sign/articleshow/111610551.cms), [Paramarsh on Mesha](https://paramarsh.app/patrika/vedic-astrology-fundamentals/mesha-rashi-aries-vedic)). **Rule-set decision:** to stay consistent and non-sectarian, mantra + deity always follow **one and the same planet** — the day's/week's/month's dominant benefic (fallback: weekday deity → sign lord) — so the page never mixes a mantra of one planet with a deity of another. The fixed per-sign fallback deity = the sign lord's deity (table in `03`), which we will publish as *our editorial convention* ("traditions vary; we follow X"), stated on-page.

**Thought of the day/week/month/year** — not a classical item; it is our own editorial slot. Rule set ties it to the dominant house *theme* (e.g. 6th house = routine/service) and Paige's library supplies original aphorisms per theme per language. Zero astrology claims inside the thought text.

## 8. What we deliberately do NOT do

- No dasha, ashtakavarga, paaya, or chart-based double transit (no birth data in a public horoscope; honesty on-page).
- No gemstone prescriptions, no dosha/fear marketing (site policy: no fear tactics; health wording stays general — rest, routine, balance; never diagnostic).
- No "100% guaranteed" phrasing anywhere; ratings use 4 measured levels, not percentages.
- No copying of any reference site's text; all wording is fresh (enforced by the originality check in the content step and QA).

---

*Citations inline above; reference-site analysis in `02-reference-site-analysis.md`; the formal, implementable rule set in `03-ruleset.md`; code reuse findings in `04-existing-code-review.md`.*
