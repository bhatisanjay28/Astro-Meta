/**
 * EN clause bank — yearly month-table fragments (library-structure §3, style §7).
 * Engine contract (compose.ts:586–608): pos/neg fragments pass through fillClause
 * so they MUST carry {planet} + {house}; the composer joins "pos; neg — closing",
 * so fragments/closings never contain "; " or " — " and carry no trailing period.
 * Closing rows are used RAW (no token fill) — they must not contain tokens.
 * Planet calibration: Jupiter = growth vs overreach · Saturn = structure vs heavy
 * pace · Rahu = fresh drive vs distraction. Live cells per clauseBand (compose.ts:439):
 * pos fires only fav/neutral, neg fires only unfav — the other cells are authored
 * for contract completeness (9 cells/slot).
 */
import { clauseCondition, makeRows, type BankRow, CLAUSE_BANDS, CLAUSE_PLANETS } from "./types";

const POS: Record<string, Record<string, string[]>> = {
  Jupiter: {
    fav: [
      "{planet} moves through your {house} this month, expanding what you can build",
      "{planet} in your {house} supports learning, guidance and steady growth",
      "{planet} lights your {house} this month, so plans made now find willing helpers",
      "{planet} in your {house} keeps fortune close as honest work pays off",
      "{planet} moves through your {house} and opens doors that felt stuck",
      "{planet} in your {house} favours study, good advice and steady gains",
    ],
    neutral: [
      "{planet} in your {house} offers quiet support for the plans you keep simple",
      "{planet} moves through your {house} and small gains stack up steadily",
      "{planet} in your {house} lends a gentle hand to patient efforts",
      "{planet} in your {house} nudges growth along without making noise",
      "{planet} moves through your {house}, so modest steps still move you forward",
      "{planet} in your {house} favours steady routines over bold leaps",
    ],
    unfav: [
      "{planet} in your {house} helps most where you keep expectations realistic",
      "{planet} moves through your {house} and rewards carefully checked plans",
      "{planet} in your {house} still backs effort, though at a slower pace",
      "{planet} in your {house} supports you once the small print is read",
      "{planet} moves through your {house}, offering help that needs asking for",
      "{planet} in your {house} turns careful compromises into quiet wins",
    ],
  },
  Saturn: {
    fav: [
      "{planet} in your {house} turns disciplined effort into visible results",
      "{planet} moves through your {house} and patient plans settle into place",
      "{planet} in your {house} rewards steady work with lasting structure",
      "{planet} in your {house} backs commitments you are ready to honour",
      "{planet} moves through your {house} and consistent effort compounds nicely",
      "{planet} in your {house} gives the month a solid, dependable frame",
    ],
    neutral: [
      "{planet} in your {house} asks for patience and quietly repays it",
      "{planet} moves through your {house} and keeps routine work on track",
      "{planet} in your {house} steadies the pace without dramatic swings",
      "{planet} in your {house} favours maintenance over big new beginnings",
      "{planet} moves through your {house}, so steady habits do the heavy lifting",
      "{planet} in your {house} keeps things workable when plans stay simple",
    ],
    unfav: [
      "{planet} in your {house} still rewards effort, though the pace feels slow",
      "{planet} moves through your {house} and delays teach sturdier planning",
      "{planet} in your {house} calls for rebuilding plans on firmer ground",
      "{planet} in your {house} trims what is unnecessary, which helps later",
      "{planet} moves through your {house} and quiet persistence matters more than speed",
      "{planet} in your {house} turns small setbacks into useful lessons",
    ],
  },
  Rahu: {
    fav: [
      "{planet} in your {house} brings fresh energy to an ambitious plan",
      "{planet} moves through your {house} and unconventional ideas find a path",
      "{planet} in your {house} sharpens appetite for new skills and circles",
      "{planet} in your {house} favours bold moves that stay well-researched",
      "{planet} moves through your {house} and unexpected openings suit you well",
      "{planet} in your {house} gives courage to try the different route",
    ],
    neutral: [
      "{planet} in your {house} stirs curiosity that can tilt your way",
      "{planet} moves through your {house} and small experiments are worth trying",
      "{planet} in your {house} adds interest without disturbing the main plan",
      "{planet} in your {house} favours steady effort with one new angle",
      "{planet} moves through your {house}, so leave room for a lucky detour",
      "{planet} in your {house} keeps ambition awake through slow weeks too",
    ],
    unfav: [
      "{planet} in your {house} brings drive, though the details deserve a second look",
      "{planet} moves through your {house} and haste is the main cost this month",
      "{planet} in your {house} tempts shortcuts, so keep your standards close",
      "{planet} in your {house} rewards patience more than impulsive starts",
      "{planet} moves through your {house}, so sleep on anything that glitters",
      "{planet} in your {house} favours focus over chasing every new idea",
    ],
  },
};

const NEG: Record<string, Record<string, string[]>> = {
  Jupiter: {
    fav: [
      "{planet} in your {house} stretches a good month slightly thin with extra promises",
      "{planet} moves through your {house} and overcommitment is the one thing to watch",
      "{planet} in your {house} adds big ideas faster than the month can hold them",
      "{planet} in your {house} tempts extra spending, so keep priorities written down",
      "{planet} moves through your {house} and a well-placed no protects your wins",
      "{planet} in your {house} favours fewer commitments, each honoured fully",
    ],
    neutral: [
      "{planet} in your {house} scatters attention, so name your priority early",
      "{planet} moves through your {house} and optimism needs a reality check sometimes",
      "{planet} in your {house} favours trimming plans before adding new ones",
      "{planet} in your {house} can overstate what one week can hold",
      "{planet} moves through your {house}, so double-check advice before acting on it",
      "{planet} in your {house} asks for modest promises kept over grand ones made",
    ],
    unfav: [
      "{planet} in your {house} inflates expectations, so verify details yourself",
      "{planet} moves through your {house} and scattered focus is the main cost",
      "{planet} in your {house} tempts overcommitment, so keep each promise realistic",
      "{planet} in your {house} favours fewer plans, chosen with care",
      "{planet} moves through your {house}, so seek advice before large commitments",
      "{planet} in your {house} rewards patience where you would rather rush ahead",
    ],
  },
  Saturn: {
    fav: [
      "{planet} in your {house} keeps a strong month honest about its workload",
      "{planet} moves through your {house} and the only cost is a fuller schedule",
      "{planet} in your {house} tempers good momentum with useful caution",
      "{planet} in your {house} asks for structure even when things flow",
      "{planet} moves through your {house}, so bank wins while keeping standards high",
      "{planet} in your {house} favours finishing before starting anything new",
    ],
    neutral: [
      "{planet} in your {house} slows the pace, so schedule fewer things properly",
      "{planet} moves through your {house} and patience matters more than pushing",
      "{planet} in your {house} favours steady routines over clever shortcuts",
      "{planet} in your {house} uses delays to teach better planning",
      "{planet} moves through your {house}, so protect rest inside the plan",
      "{planet} in your {house} rewards quiet persistence over visible speed",
    ],
    unfav: [
      "{planet} in your {house} adds weight to the month, so keep plans light",
      "{planet} moves through your {house} and delays are information, not verdicts",
      "{planet} in your {house} asks for fewer commitments and firmer follow-through",
      "{planet} in your {house} favours repair and maintenance over new launches",
      "{planet} moves through your {house}, so pace yourself and let routine carry you",
      "{planet} in your {house} tests patience, and steady habits answer it well",
    ],
  },
  Rahu: {
    fav: [
      "{planet} in your {house} adds noise to a good month, so guard your focus",
      "{planet} moves through your {house} and distraction is the one thing worth watching",
      "{planet} in your {house} tempts detours when the main road is working",
      "{planet} in your {house} favours declining a few shiny side-quests this month",
      "{planet} moves through your {house}, so write priorities down before the week begins",
      "{planet} in your {house} rewards one clear goal over scattered curiosity",
    ],
    neutral: [
      "{planet} in your {house} blurs priorities slightly, so name them each morning",
      "{planet} moves through your {house} and second-guessing costs more than it should",
      "{planet} in your {house} favours simple choices over complicated ones",
      "{planet} in your {house} stirs restlessness that a good routine absorbs",
      "{planet} moves through your {house}, so keep big decisions for clearer days",
      "{planet} in your {house} rewards focus more than novelty right now",
    ],
    unfav: [
      "{planet} in your {house} clouds judgement, so sleep on important choices",
      "{planet} moves through your {house} and restlessness misdirects good energy",
      "{planet} in your {house} magnifies distraction, so protect your focused hours",
      "{planet} in your {house} mixes appetite with haste, so slow the pace down",
      "{planet} moves through your {house}, so re-check motives before chasing anything new",
      "{planet} in your {house} rewards a short list of priorities kept firmly",
    ],
  },
};

const CLOSING: Record<string, string[]> = {
  excellent: [
    "lean in while the sky is generous",
    "bank this progress early",
    "move first and verify once",
    "carry the momentum honestly",
    "ride the window, skip the haste",
    "let good results compound",
  ],
  good: [
    "steady steps land best",
    "let routine do its quiet work",
    "consistency keeps it growing",
    "continue and check in weekly",
    "a steady hand holds the gains",
    "quiet effort wins this stretch",
  ],
  moderate: [
    "keep plans realistic",
    "pace yourself and continue",
    "small steps are enough",
    "let routine carry the month",
    "aim for steady rather than fast",
    "even effort pays best",
  ],
  challenging: [
    "prepare more and push less",
    "review before you launch",
    "rest counts as progress",
    "revise plans before rushing ahead",
    "patience now saves rework later",
    "slow down, regroup and continue",
  ],
};

const posCells: Array<[string, string[]]> = [];
for (const planet of CLAUSE_PLANETS) {
  for (const band of CLAUSE_BANDS) {
    posCells.push([clauseCondition(planet, band), POS[planet]![band]!]);
  }
}

const negCells: Array<[string, string[]]> = [];
for (const planet of CLAUSE_PLANETS) {
  for (const band of CLAUSE_BANDS) {
    negCells.push([clauseCondition(planet, band), NEG[planet]![band]!]);
  }
}

const closingCells: Array<[string, string[]]> = Object.entries(CLOSING).map(
  ([rating, texts]) => [`rating=${rating}`, texts],
);

export const clauseRows: BankRow[] = [
  ...makeRows("clause.pos", "en", posCells),
  ...makeRows("clause.neg", "en", negCells),
  ...makeRows("clause.closing", "en", closingCells),
];
