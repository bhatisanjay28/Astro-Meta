# Review — S24 site-wide bilingual architecture (2026-11-28)

Reviewer role: QA/review agent (BMAD process run manually per DECISIONS.md — persona files
not installed). Reviewed: full S24 diff (backend 13 files, frontend 82 paths, meta suites),
story vs implementation conformance, owner-requirement traceability, QA gate evidence from
P7. Story: `story.md` in this folder. Scope note in Closeout: learn-article Hindi twins
descoped (original-language policy, same as blog) — chrome translated.

## Owner requirement traceability

| # | Requirement | Evidence | Verdict |
|---|---|---|---|
| 1 | Toggle opens the corresponding page's twin | `i18n.ts` switcherHrefs/hasHiTwin (trailing-slash normalized); S24 e2e group 1 covers hub + deep routes (calculators/[tool], panchang/[city], consultations/[slug], poojan/[slug], compatibility pairs, legal, about, contact, horoscope) both directions | PASS |
| 2 | Hindi persists across all navigation session-wide | `withLang` generalized over twin routes; Header tabs/mega/drawer, Footer, breadcrumbs, tiles, home widgets all lang-aware; S24 group 2 leak-scan (every internal anchor on hi pages resolves to /hi twin or a policy-excluded EN surface) | PASS |
| 3 | Complete UI translation | 15 dict modules + chrome (utility bar, header, footer, consent, 404, skip link); client scripts carry EN/HI tables (validation, pickers, calculator renderer, panchang calendar, compatibility, blog search); form labels/placeholders/errors translated; S24 groups 3+5 assert Devanagari chrome and absence of EN labels on hi forms | PASS |
| 4 | Natural Hindi, consistent Jyotish terms | Dictionaries authored per surface (not machine literals); planet/sign/graha Hindi centralized (zodiac-signs.ts + PLANETS_HI); backend interpretations carry authored Hindi prose with the EN-verdict coupling pinned by test; Hindi written for an Indian audience (e.g. साढ़े साती, गुण मिलान, विंशोत्तरी दशा) | PASS |
| 5 | Blog stays original language; no duplicate translated URLs | NO_TWIN_PREFIXES blog+admin; blog articles switcher → /hi/blog/ hub (never a fabricated article URL); sitemap lists blog deep routes EN-only; S24 group 4 asserts zero /hi/article links on EN blog pages | PASS |
| 6 | /hi/horoscope preserved & integrated | S22 suite ALL PASS on the final build (144-page static sweep, chips, switcher counterparts, hreflang); horoscope suite 72/72; horoscope now uses the shared i18n helpers instead of its private SECTIONS_WITH_HI list | PASS |

## Owner constraints check

- Root-cause fix, no URL hacks: ✓ twins are real prerendered routes; zero redirects added
  (308 trailing-slash normalization is pre-existing platform behavior, unchanged).
- EN pages not broken: ✓ axe/contrast/datetime/place/megamenu/calculator regression suites
  all green against the final build; no theme/layout changes (CSS touches: Devanagari face
  scoped to `html[lang=hi]`, universal box-sizing preflight from S20 untouched).
- SEO: canonicals self-canonical per language; hreflang en/hi/x-default reciprocal per page
  (verified in dist); sitemap twins now reciprocal after the P7 fix; no duplicate URLs.
- D12 boundary: identity/config on frontend, content via API/DB — unchanged; DB-served
  authored prose (astrologer bios, puja descriptions) stays original-language with `_hi`
  columns plumbed end-to-end so admin-authored Hindi renders the moment it exists.

## Code quality findings (fixed during review)

1. Sitemap HI twins' xhtml alternates pointed at themselves (and HI home had none — falsy
   `""` skip of the apex entry). Real SEO bug, caught by the revived ZC sitemap check;
   fixed + verified reciprocal (728 entries).
2. Internal build tokens shipped to visitors: "(Story S1/P3)" fonts comment (every page),
   stale "(sample catalogue, P9)" home comment, "S24" comments inside inline scripts on hi
   home + all panchang city pages. Reworded at source; `qa/dist-sweep.mjs` added as a
   reusable push gate (S19 pattern set + S24 terms; /privacy exempted — DPDP processor
   disclosure legitimately names providers).
3. astro-check regressions caught in-flight: bare-attribute `title` on SignPage (boolean
   true — would have shipped a wrong runtime <title>), Base's non-existent `lang` prop.
4. Twin re-export typing: `Twin` cast to `(props: unknown) => unknown` with an explanatory
   comment — acceptable for thin re-export wrappers; route params stay fully typed.

## Suite maintenance (not product bugs)

- megamenu: `:text-is` → whitespace-tolerant locators (trigger labels are span-wrapped for
  hi-text); M12/M16 thresholds aligned to the S17 owner-approved viewport caps.
- S13/S14/calculators-regressions: hidden DateField inputs → segment drives (S16 fallout;
  same revival pattern as booking-modal).

## Verdict

**APPROVE** — implementation matches the story's architecture, all owner requirements
trace to passing evidence, P7 gates green on the final build (backend 598/598, frontend
lint/astro-check/build clean, dist sweep CLEAN, 14 e2e suites ALL PASS). No open product
bugs. Commit/push follows the standing backend-deploys-first order and waits for owner
consent per operating rules.

Follow-ups recorded (non-blocking): learn-hi collection decision rests with owner;
engine freshness gate ENGINE_VERSION "1.5.0-s24" should be bumped in the next engine-touching
story; megamenu M12 hiddenPx at 720h worth revisiting if calculators menu grows again.
