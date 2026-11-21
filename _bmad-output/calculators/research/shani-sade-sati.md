# Shani Sade Sati Check — Research
> Written by Mary (Analyst) · 2026-11-21 · Pipeline: _bmad-output/calculators/

## 1. Purpose and who uses it

Sade Sati (Hindi "साढ़े साती", "seven and a half") is the ~7.5-year period when transit Saturn (Shani) passes through the 12th, 1st and 2nd signs from the natal Moon sign. It is the single most-asked-about transit in Vedic astrology. The calculator answers three questions: (a) Am I in Sade Sati right now? (b) Which phase (charan) am I in? (c) When does this / the next Sade Sati start and end?

Users:
- Anxious adults checking whether they are "in" Sade Sati and when it ends (largest segment; drives most traffic to AstroSage/GaneshaSpeaks tools).
- People approaching a known Saturn ingress (e.g., March 2025 Pisces ingress triggered a wave of queries for Aries/Pisces/Aquarius moon signs).
- Users of matchmaking flows and "Saturn report" upsells (GaneshaSpeaks gates the report behind login and sells paid Saturn-transit reports).
- Regional users — the same concept is called **Elinati Shani** (Telugu/Andhra), **Shanichari**, and the sub-periods are called **Dhaiya / Small Panoti / Laghu Panoti** (AstroSage, ProKerala, jagannathhora).

Positioning note: Sade Sati is not universally read as bad — several sources stress it is Saturn "the strict teacher" dispensing karma and can coincide with hard-won growth (DrikPanchang methodology text; AstroSage caveat; steer.coach). Output copy should say this; a fear-only framing would be below competitor standard.

## 2. Inputs

| field | required/optional | format & units | valid range | default | why needed |
|---|---|---|---|---|---|
| Birth date | required | DD/MM/YYYY | 1900–2076 (DrikPanchang dropdown); ProKerala allows 1901–2028 | — | Fixes the natal Moon longitude epoch (sidereal, Lahiri) |
| Birth time | required in practice | HH:MM(:SS), 12h/24h | — | AstroSage/GaneshaSpeaks/DrikPanchang require it | Moon moves ~0.55°/h; on ~1 day in 30 the Moon changes sign during the day, so an unknown time can flip the moon sign |
| Place of birth | required | city autocomplete → lat/lng + timezone | — | — | Supplies the timezone (and DST rules) needed to convert birth time to UT. Astronomical note: the Moon sign is geocentric, so latitude/longitude per se do NOT change the moon sign — only the timezone does. Lat/lng are still asked by all competitors (they compute the full kundli anyway) |
| Name | optional | text | — | — | Personalization only; all 4 competitors ask for it |
| Gender | optional | male/female(/other at GaneshaSpeaks) | — | — | Not astronomically needed; competitors ask for report wording; relevant only for upsells |
| Check date ("as of") | optional | date | 1900–2100 | today | Needed to answer "was I / will I be in Sade Sati on date X". Vyotish currently hard-codes "now" |
| Ayanamsha | advanced, optional | Lahiri (default), Raman, KP, none | — | Lahiri | Sidereal frame choice; competitors expose it in advanced settings |

### Recommended input set
Full name (optional), gender (optional), date of birth (required), exact birth time (required, with "time unknown" fallback that warns when the Moon was near a sign boundary that day), place of birth (city autocomplete → lat/lng/tz), plus a **check date** that defaults to today so users can test any date (the single most-missed feature in our build). Timezone must be resolved historically (DST) for non-IST places.

### Current Vyotish input set
`GET /api/v1/calculators/sade-sati?date&time&lat&lng&tz` on `/calculators/sade-sati`: birth date, optional birth time, place of birth (city autocomplete → lat/lng/tz). **No check-date parameter — the engine always evaluates the server's "now"**; no name/gender. (Gaps tracked in §5.)

## 3. Formula(s) / method

Definitions: rashi index i ∈ {0..11} for Mesha..Meena; sidereal longitudes use the **Lahiri (Chitrapaksha) ayanamsha**; whole-sign (rashi) arithmetic, no degrees.

Step-by-step (sign-based method — the method every mainstream source uses):
1. Compute natal Moon sidereal longitude at birth → natal Moon sign M (janma rashi).
2. Compute transit Saturn sidereal longitude at the check instant → sign S.
3. Relative position k = (S − M) mod 12. Sade Sati is ON iff k ∈ {11, 0, 1} (Saturn in 12th, 1st, 2nd from Moon).
4. Phase (charan) from k: k=11 → Phase 1 (rising); k=0 → Phase 2 (peak, "Janma Shani"); k=1 → Phase 3 (setting).
5. Window boundaries: **start = Saturn's first ingress into sign (M−1); end = Saturn's final exit from sign (M+1)**, with all retrograde back-and-forth crossings merged into one continuous window ("from the first entry into the 12th sign to the final exit from the 2nd, with those retrograde dips merged in" — rasilagnam). Phase sub-windows are the corresponding per-sign intervals; a retrograde dip back into an earlier phase's sign temporarily revives that phase (rasilagnam documents exactly this for Pisces-moon people: Saturn's 20 Oct 2027 → 23 Feb 2028 dip into Meena restores the peak phase).
6. Dhaiya / Small Panoti (optional output): Saturn in the **4th** sign from Moon = **Kantaka Shani / Ardhāshtama Shani** ("Small Panoti", ~2.5y) and in the **8th** sign from Moon = **Ashtama Shani** (considered the harsher of the two). Because {11,0,1} and {4,8} are disjoint modulo 12, Dhaiya never overlaps Sade Sati — the "only outside Sade Sati" wording found in some articles is automatic, not an extra rule (jagannathhora; AstroSage names Artha-Ashtam/Ashtam Shani; ProKerala displays "Small Panoti (Kandaka Sani)" and "Ashtama Sani" sign lists).
7. Next window: the same rule at the next Saturn circuit (~29.46 years later). The next Sade Sati starts when Saturn next enters sign (M−1).

Variant methods found (list, then recommendation):
- **Sign-based (above)** — used by DrikPanchang, AstroSage, GaneshaSpeaks, ProKerala, rasilagnam, Indastro. **RECOMMENDED**: it is the only method every competitor agrees on, and phase 1/2/3 are defined by it.
- **Exact-longitude "45° rule"** — Sade Sati runs while Saturn is within 45° of the natal Moon's exact longitude (begins 45° behind, ends 45° ahead). AstroTalk's calculator explicitly uses this ("Saturn transiting 45° before and after your natal Moon's position"). It slightly shifts start/end dates vs the sign method and cannot define phases cleanly. Do not mix the two in one output.
- **First entry vs "stable" entry for the start date**: when Saturn dips into (M−1) and retrogrades out before finally entering (e.g., Aquarius first touched 2022-04-29, retrograded back into Capricorn 2022-07-12, final entry 2023-01-17), the "first entry" convention makes Pisces-moon Sade Sati start 2022-04-29 while a "stable entry" reading starts 2023-01-17. rasilagnam and ProKerala-style "first entry → final exit" merge produce windows of 7–8.2 years (steer.coach notes the nominal 7.5y "can stretch to about eight years or compress to about seven"). **RECOMMENDED: first-entry→final-exit merge** (matches rasilagnam's published window table, matches steer.coach's retro treatment, and matches Vyotish's existing engine).
- **Ayanamsha variants**: Raman/KP shift every sidereal boundary by up to ~1° → ingress dates shift ~±1 day for Saturn (it moves ~0.12°/day mid-sign, less near stations). All worked examples below use Lahiri.
- **Saturn retrograde "breaking" the window**: no mainstream source treats a retrograde dip as *ending* Sade Sati and restarting it as a new window; the merge convention is standard. Vyotish's engine ignores a dip "unless Saturn stays out ≥200 days" — keep this materiality guard, document it.

Saturn sidereal (Lahiri) ingress table — computed for this research (JPL DE441 apparent longitudes + linear Lahiri; validated: matches the published dates below within ±1 day; IST times computed):
| Saturn enters | UTC | IST | Cross-check |
|---|---|---|---|
| Kumbha (Aquarius) | 2023-01-17 12:14 | 17:44 | "January 17, 2023" (moondanceastrology) |
| Meena (Pisces) | 2025-03-29 15:21 | 20:51 | "March 29, 2025" (moondanceastrology, Indastro) |
| Mesha (Aries) | 2027-06-02 22:09 | 2027-06-03 03:39 | "June 3, 2027" (search consensus); ProKerala writes "Meena Rasi till 2027-Jun-02" (UTC convention) |
| retro back → Meena | 2027-10-20 04:02 | 09:32 | "20 Oct 2027" (rasilagnam) |
| Mesha again | 2028-02-23 11:42 | 17:12 | "23 Feb 2028" (rasilagnam) |
| Vrishabha (Taurus) | 2029-08-08 02:30 | 08:00 | "8th August 2029" (Indastro phase-3 start for Aries moon) |
| retro back → Mesha | 2029-10-05 15:41 | 21:11 | computed only (no published cross-check found — UNVERIFIED against other software) |
| Vrishabha again | 2030-04-17 01:53 | 07:23 | "17 Apr 2030" (rasilagnam Meena end) |
| Mithuna (Gemini) | 2032-05-30 20:09 | 2032-05-31 01:39 | "30 May 2032" (Indastro Aries end) |
Earlier anchors from published sources: Saturn entered Makara 2020-01-24 (rasilagnam Kumbha window start), first touched Kumbha 2022-04-29 and retrograded back to Makara 2022-07-12 (moondanceastrology). Saturn on 2026-11-21: Meena 14.06°, retrograde (station ≈ 2026-12-11 UT — computed).

## 4. Worked examples (≥3 per calculator: normal, edge, boundary)

All positions below were computed for this research with a JPL Horizons DE441 (geocentric apparent) pipeline + of-date mean-obliquity ecliptic + linear Lahiri model, validated against the published Saturn ingresses above and Makar Sankranti 2026 (computed 2026-01-14 14:58 IST vs DrikPanchang ≈15:13 IST → engine runs ≈0.01° behind DrikPanchang's Lahiri; whole-sign results unaffected, ingress dates ±1 day). Verify any example with any standard panchang before freezing as a test fixture.

### Example 1 — normal (Aquarius moon; currently in phase 3; dhaiya after)
Birth: 1990-06-15, 06:30 IST, Delhi (28.6139N, 77.2090E). Natal Moon sidereal = 315.55° → **Kumbha (Aquarius), 15.55°** (mid-sign; stable all day).
- 12th from M = Makara, 1st = Kumbha, 2nd = Meena.
- Start: Saturn enters Makara (12th from Aquarius) 2020-01-24 → Sade Sati begins (published anchor).
- Phase 1 (Saturn in Makara): 2020-01-24 → 2023-01-17.
- Phase 2 (Saturn in Kumbha): 2023-01-17 → 2025-03-29.
- Phase 3 (Saturn in Meena): 2025-03-29 → 2028-02-23. The 2027-10-20→2028-02-23 retro dip is Saturn back in Meena = still 2nd from Aquarius → **phase does not change** during this dip.
- End: final exit from Meena 2028-02-23 17:12 IST. Total window 2020-01-24 → 2028-02-23 ≈ 8.07 years (the "stretched" 7.5 nominal).
- Check on 2026-11-21: Saturn Meena 14.06° (retrograde) → in_sade_sati = true, phase = 3, time remaining ≈ 2y 3m.
- Dhaiya (4th from Aquarius = Vrishabha): starts 2029-08-08; retro dip back into Mesha 2029-10-05 → 2030-04-17 (dip-aware convention: dhaiya pauses then resumes); final exit 2032-05-31. Merged convention: one window 2029-08-08 → 2032-05-31. (Pick one convention and document it in output.)
- Next Sade Sati (published window table, rasilagnam): 2046-12-08 → 2055-02-05.

### Example 2 — edge (Pisces moon; retro dips revive phase 2 and phase 3; start-date variant)
Birth: 1995-11-05, 14:20 IST, Mumbai (19.0760N, 72.8777E). Natal Moon sidereal = 326.33° → **Meena (Pisces), 26.33°**.
- 12th from M = Kumbha, 1st = Meena, 2nd = Mesha.
- Start (first-entry convention): Saturn first touched Kumbha 2022-04-29, retrograded back into Makara 2022-07-12 (published; moondanceastrology), final Kumbha entry 2023-01-17 17:44 IST (computed). rasilagnam prints this window as "29 Apr 2022 – 17 Apr 2030" — i.e., the dip-in of 2022 counts as the start. A "stable entry" reading would start 2023-01-17. **This 8.5-month ambiguity is the #1 test case for the start-date rule.**
- Phase 1 (Kumbha): 2022-04-29 → 2022-07-12 (dip), then 2023-01-17 → 2025-03-29.
- Phase 2 (Meena): 2025-03-29 → 2027-06-03 03:39 IST.
- Dip revives Phase 2: Saturn retro re-enters Meena 2027-10-20 09:32 IST → Phase 2 again until 2028-02-23 17:12 IST (rasilagnam states exactly this: "restoring the peak phase until 23 Feb 2028").
- Phase 3 (Mesha): 2028-02-23 → 2029-08-08 08:00 IST.
- Dip revives Phase 3: Saturn retro re-enters Mesha 2029-10-05 21:11 IST → Phase 3 again until final Vrishabha ingress 2030-04-17 07:23 IST = end.
- Check on 2026-11-21: Saturn Meena 14.06° = Moon's own sign → phase = 2 (peak).
- Test assertions: window = 2022-04-29 → 2030-04-17 (7.96y); phase at 2027-12-01 = 2; phase at 2029-11-01 = 3; phase at 2026-11-21 = 2.

### Example 3 — boundary (moon 0.17° into its sign; birth-time error flips the verdict)
Birth: 1992-03-03, 02:30 IST, Jaipur (26.9124N, 75.7873E). Moon sidereal = 300.17° → **Kumbha (Aquarius), 0.17°** — the Moon entered Aquarius at ≈02:30 IST that night (computed: Moon crossed sidereal 300° at 1992-03-02 21:00 UT). Born ≈10 minutes earlier, the Moon would still be in Makara (Capricorn).
- Read as Aquarius moon: Sade Sati 2020-01-24 → 2028-02-23; on 2026-11-21 phase = 3.
- Read as Capricorn moon (any time-of-birth error ≥10 min earlier): 12th = Dhanu, 1st = Makara, 2nd = Kumbha → Sade Sati ended 2025-03-29 (Saturn left Kumbha); on 2026-11-21 not in Sade Sati; next contact = Dhaiya (4th from Makara = Mesha) starting 2027-06-03.
- Rule: when Moon is within ~2° of a sign boundary (≈3.6 h of moon motion), flag "moon sign sensitive to birth-time accuracy" and require a high-precision ephemeris. A 5-minute birth-time error is common in user data.

### Example 4 — boundary of the window itself (phase flips exactly at an ingress)
Same Pisces-moon person as Example 2: check on 2027-06-02 22:00 UTC → Saturn Meena 29.99x° → phase 2; on 2027-06-03 04:00 UTC → Saturn Mesha 0.00x° → phase 3. Sampling granularity must be ≤1 day near ingresses; Vyotish's 20-day sampling + bisection is sufficient only if bisection resolves to the day (it does — but assert it in tests with this date pair).

## 5. Complete output list

What a GOOD Sade Sati calculator shows:
1. Verdict: `in_sade_sati` true/false for the check date (default today).
2. Phase: 1 (rising) / 2 (peak) / 3 (setting), with the charan's sign and a one-line effect description (competitors give per-charan effects; AstroSage describes 12th/1st/2nd house effects of each charan).
3. Overall window: current window start + end dates (first entry → final exit).
4. Phase sub-windows with dates (each charan's start/end; including any dip-revived segments).
5. Saturn's current position: sign, degree (optional), retrograde/direct, and a "Saturn is in X rashi till YYYY-MM-DD" line (ProKerala shows exactly this).
6. Remaining duration (time to window end / to next phase).
7. Next window: start (and ideally end) of the following Sade Sati (~29.5y later).
8. Dhaiya / Small Panoti: 4th (Kantaka/Ardha-ashtama) and 8th (Ashtama) status + dates (ProKerala displays both sign lists; AstroSage describes them).
9. Natal Moon sign (+ nakshatra optionally) so the user can verify their chart.
10. Remedies note (Shani-related: Saturday worship, Hanuman Chalisa, etc.) — competitors all include a remedies block; keep it brief and non-fearful.
11. Disclaimers: not deterministic/for guidance; effects depend on the full chart (AstroSage: depends on Saturn and Moon placement; DrikPanchang: depends on Shani's placement in the janma kundali).

Comparison vs leading competitors:
| Feature | AstroSage (free/sade-sati-report.asp) | GaneshaSpeaks (products…/sadesati) | ProKerala (astrology/sade-sati.php) | AstroTalk (shani-sade-sati-calculator) | Vyotish current |
|---|---|---|---|---|---|
| in/out verdict + phase 1/2/3 | Yes (charans with effects text) | Yes (status + current phase) | Yes (rising/peak/setting wording) | Yes (rising/peak/setting) | Yes (phase 1/2/3/null) |
| Window start/end dates | via report | Yes ("start and end period") | Via transit dates | Yes ("duration and timeline") | Yes (current + next) |
| Next window | Report-level | Report-level | Not shown inline | — | Yes (searched within one circuit) |
| Saturn current position line | In kundli/report | Personalized insights | Yes — "Saturn is in Meena Rasi till 2027-Jun-02" | Implicit | saturn_sign + offset, no "till date" |
| Dhaiya / Small Panoti | Described in text (Artha-Ashtam/Ashtam) | — | **Yes — live sign lists: Small Panoti (Kandaka) + Ashtama Sani** | — | **Missing entirely** |
| Check-a-date (past/future) | Via birth chart only | — | Implicit (transit dates) | — | **Missing — runs only for "now"** |
| Gender/name inputs | Yes | Yes (+relation, login wall) | Yes | Yes | No |
| Remedies + effects copy | Extensive (list of do/don't) | Yes (report) | Articles only | Yes | `note` string only |
| Ayanamsha choice | Yes (advanced) | Hidden | — | — | Fixed Lahiri |
| Chart display | Yes (advanced) | Paid report | — | — | None |

### Current Vyotish outputs
Page `/calculators/sade-sati`, `GET /api/v1/calculators/sade-sati?date&time&lat&lng&tz`. Output keys verbatim: `in_sade_sati, phase (1|2|3|null), moon_sign, moon_sign_index, saturn_sign, saturn_sign_index, saturn_offset_from_moon, current {start,end}, next {start,end}, note, verified:false`.
Algorithm (from codebase scan): Saturn sidereal longitude sampled every 20 days + bisection; window = first entry into the 12th/1st/2nd-from-natal-Moon trio → final exit (retrograde dip ignored unless Saturn stays out ≥200 days); next window searched within one Saturn circuit (~29.46y); phase computed from the instantaneous offset (12th→1, 1st→2, 2nd→3). Runs for "now" only. No dhaiya. `verified:false` pending Jyotishi review.

### Initial gap list
1. **No "check date" input** — users cannot ask "was my Sade Sati over in 2019?" or "when does phase 3 start?"; competitors' transit tables make this trivial. Add `as_of` param (default now).
2. **No dhaiya / small panoti** (4th/8th from Moon) — ProKerala shows them live; AstroSage explains them. High user demand (they occur outside the 7.5y window, i.e., for ~9 of 12 moon signs at any time).
3. **Phase sub-window dates not emitted** — only the overall window; users (and the Jyotishi reviewer) will want each charan's dates, including dip-revived segments.
4. **No "Saturn is in X till Y" line** and no retrograde flag in output (retro matters to users: dips revive phases).
5. **Start-date convention ambiguity unhandled** — for Pisces moons the first-entry (2022-04-29) vs stable-entry (2023-01-17) question changes the window by 8.5 months; document the chosen convention in `note`.
6. No moon-boundary sensitivity flag when birth time is unknown or Moon is within ~2° of a rashi boundary.
7. No natal moon nakshatra / verification anchor in output (competitors echo the moon sign back; helps trust).
8. `verified:false` needs a Jyotishi sign-off workflow; output copy should be honest about the flag.
9. No remedies/effects copy per phase (competitors differentiate phases: phase 2 peak = hardest).
10. Missing gender/name (low priority; only affects personalization copy).

## 6. Edge cases and validation rules

1. **Moon near rashi boundary** (≤2° from either edge): flag; birth time ±10 min can flip moon sign (Example 3). With unknown birth time, compute moon sign at sunrise and sunset; if both agree, safe; else warn.
2. **First-entry vs stable-entry start** (Example 2): choose first-entry→final-exit merge (rasilagnam convention). Assert: Pisces-moon window = 2022-04-29 → 2030-04-17.
3. **Retro dip phase revival**: phase must follow instantaneous Saturn sign (Vyotish does) — assert phase 2 at 2027-12-01 for the Pisces-moon fixture, phase 3 at 2029-11-01.
4. **Dip materiality**: a dip "ignored" must never flip a verdict — with the 200-day rule, dips ≤200 days are merged but *phase output must still follow the instantaneous sign*. Document the rule in `note` to avoid "why did my phase change during sade sati?" confusion.
5. **Ingress date tolerance**: ±1 day vs other software (ayanamsha micro-variants; Sankranti 2026 observed delta ≈15 min ≈0.01°). Tests should compare dates, not times; document "dates as per Lahiri".
6. **Timezone/DST history**: births in DST-observing zones (e.g., wartime IST 1942–45 offset 6:00? — UNVERIFIED, do not ship without checking) need historical tz tables; a wrong tz shifts the Moon by up to ~7° = 0.23 sign-day risk. Validate with known panchang outputs for a few foreign births.
7. **Window-length sanity**: merged window must be 7.0–8.3 years (steer.coach: "roughly seven to slightly over eight"); reject absurd windows (catches sign-index bugs).
8. **Next-window sanity**: next start ≈ current start + ~29.4y (Saturn circuit 29.46y); phases cycle in the same order.
9. **45°-rule variant**: if ever offered, it must NOT be mixed with sign-based dates in the same response (AstroTalk uses it; start/end will differ by weeks).
10. **Date range guards**: engine must behave sanely for DOBs 1900–2100 (Horizons/ephemeris coverage; competitors cap at 1900–2076 / 1901–2028).
11. **Null cases**: moon sign cannot be computed (missing time + boundary day) → `phase=null`, honest message, never a default guess.
12. **Sanity heuristic**: while Saturn is in sign S, Sade Sati affects exactly moon signs S−1, S, S+1 (mod 12) and dhaiya affects exactly the moon signs M for which Saturn occupies M+4 (Kantaka) or M+8 (Ashtama) — i.e., M = S−4 and M = S−8. Cross-check with ProKerala's live sign lists: for Saturn in Meena it lists Sade Sati = Kumbha/Meena/Mesha, Small Panoti (Kandaka) = Dhanu, Ashtama = Simha, which matches the rule exactly (Meena−4 = Dhanu, Meena−8 = Simha). Any engine output disagreeing with this identity for the current Saturn sign indicates a sign-index bug.

## 7. Sources

- DrikPanchang Shani Sadesati calculator (inputs incl. ayanamsha; methodology): https://www.drikpanchang.com/jyotisha/sadesati/shani-sadesati-analysis.html
- AstroSage Shani Sade Sati report page (12th/1st/2nd rule, charan effects, Artha-Ashtam/Ashtam Shani, Elinati Shani, remedies): https://www.astrosage.com/free/sade-sati-report.asp
- ProKerala Shani Sade Sati calculator (live Saturn line, Sade Sati + Small Panoti + Ashtama Sani sign lists, date ranges): https://www.prokerala.com/astrology/sade-sati.php
- GaneshaSpeaks Sade Sati calculator (report contents, login wall, gender/relation inputs): https://products.ganeshaspeaks.com/free-astrology-reports/sadesati
- rasilagnam Sade Sati by moon sign (full 12-rashi window table, first-entry→final-exit merge, dip revives phase): https://www.rasilagnam.com/blog/sade-sati
- Indastro Sade Sati for Aries moon (phase dates 29 Mar 2025 – 1 Jun 2027 – 8 Aug 2029 – 30 May 2032): https://www.indastro.com/sade-sati/aries-sade-sati.html
- steer.coach Sade Sati phases (retro stretches/compresses 7→8 years; BPHS peak-phase note): https://steer.coach/sade-sati-phases
- AstroTalk Sade Sati calculator (45°-longitude variant): https://astrotalk.com/shani-sade-sati-calculator (per search result; page not fetched directly)
- Moondance Astrology (Saturn Aquarius 2023-01-17; 2022-04-29 first touch + 2022-07-12 retro-back): https://www.moondanceastrology.com/post/saturn-in-aquarius-transit
- jagannathhora (Dhaiya = 4th/8th from Moon, Kantaka/Ashtama naming, ~2.5y): https://jagannathhora.com/dhaiya-ashtama-shani-kantaka-shani
- DrikPanchang Sankranti calendar (Makar Sankranti 2026 moment ≈15:13 IST — ayanamsha cross-check): https://www.drikpanchang.com/sankranti/sankranti.html
- Ephemeris for all computed dates in §3/§4: JPL Horizons API, geocentric apparent RA/Dec (DE441), https://ssd.jpl.nasa.gov/api/horizons.api — reduced by the validated research pipeline described in §4 (linear Lahiri; cross-checked against the published ingresses above).
