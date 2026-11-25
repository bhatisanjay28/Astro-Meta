/**
 * Phrase-bank authoring types (library-structure.md §2–§3).
 * Bank files live next to this one; import via import-bank.ts.
 */
export type Rating = "excellent" | "good" | "moderate" | "challenging";
export type Driver = "jupiter-good" | "saturn-phase" | "rahu-axis" | "mixed" | "steady";
export type YearArea =
  | "business"
  | "career"
  | "children"
  | "education"
  | "family"
  | "health"
  | "love"
  | "marriage"
  | "wealth";
export type ClausePlanet = "Jupiter" | "Saturn" | "Rahu";
export type ClauseBand = "fav" | "neutral" | "unfav";

export const RATINGS: Rating[] = ["excellent", "good", "moderate", "challenging"];
export const DRIVERS: Driver[] = ["jupiter-good", "saturn-phase", "rahu-axis", "mixed", "steady"];
export const YEAR_AREAS: YearArea[] = [
  "business",
  "career",
  "children",
  "education",
  "family",
  "health",
  "love",
  "marriage",
  "wealth",
];
export const CLAUSE_PLANETS: ClausePlanet[] = ["Jupiter", "Saturn", "Rahu"];
export const CLAUSE_BANDS: ClauseBand[] = ["fav", "neutral", "unfav"];

/** rating (4) × pb (4 incl. chandrashtama) × retro (2) — daily/weekly/monthly.health */
export const AREA_PB_HEALTH = ["fav", "neutral", "unfav", "chandrashtama"] as const;
/** rating (4) × pb (3) × retro (2) — all other area slots */
export const AREA_PB = ["fav", "neutral", "unfav"] as const;
export const RETRO = ["none", "review"] as const;

export type Lang = "en" | "hi";

/** One phrase-bank row, shaped exactly like the `horoscope_library` table. */
export interface BankRow {
  slot: string;
  condition: string;
  lang: Lang;
  variant_no: number;
  text: string;
}

/** Condition strings must byte-match compose.ts picks (select.ts libKey). */
export const clauseCondition = (planet: ClausePlanet, band: ClauseBand): string =>
  `planet=${planet}.band=${band}`;
export const ratingCondition = (rating: Rating): string => `rating=${rating}`;
export const areaCondition = (rating: Rating, driver: Driver): string =>
  `rating=${rating}.driver=${driver}`;

/** Flatten cells → variant-numbered rows (variant_no = 1..n per cell). */
export function makeRows(
  slot: string,
  lang: Lang,
  cells: Array<[condition: string, texts: string[]]>,
): BankRow[] {
  const out: BankRow[] = [];
  for (const [condition, texts] of cells) {
    texts.forEach((text, i) => out.push({ slot, condition, lang, variant_no: i + 1, text }));
  }
  return out;
}
