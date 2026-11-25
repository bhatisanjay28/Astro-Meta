/**
 * EN donts bank — `house={1..12}.flavour=deferring` (compose.ts dayPeaks: house =
 * the day's bottom house). Items 4–10 words, verb-first, imperative-mild, deferring
 * flavour only — the composer serves this bank exclusively from `flavour=deferring`
 * (the library-structure §4 estimate of 192 rows/lang counted both flavours per
 * slot; only the served flavour is authored — see decisions.md). 4 variants per
 * cell. Paired with the `dos` bank at the same house: flavours never contradict.
 */
import { makeRows, type BankRow } from "./types";

const TEXTS: Record<number, string[]> = {
  1: [
    "Defer big self-promises to a calmer day.",
    "Avoid harsh self-criticism today.",
    "Let the mirror talk wait for now.",
    "Skip the comparison spiral today.",
  ],
  2: [
    "Defer large purchases by a week.",
    "Avoid money talks when tired.",
    "Let the big loan decision rest.",
    "Postpone expensive commitments politely.",
  ],
  3: [
    "Delay sending the sharp reply.",
    "Avoid debates that prove nothing.",
    "Let the risky shortcut wait.",
    "Skip gossip in every form today.",
  ],
  4: [
    "Defer major home renovations today.",
    "Avoid long family debates tonight.",
    "Let property talks rest this week.",
    "Delay moving furniture or plans.",
  ],
  5: [
    "Defer big study deadlines today.",
    "Avoid comparing children or yourself.",
    "Let the risky creative leap wait.",
    "Skip new commitments for the kids.",
  ],
  6: [
    "Defer adding new routine tasks.",
    "Avoid skipping meals today.",
    "Defer the overdue apology by a day.",
    "Let extra errands wait until tomorrow.",
  ],
  7: [
    "Defer the difficult relationship talk.",
    "Avoid negotiating when upset today.",
    "Avoid ultimatums of every kind.",
    "Skip the public argument entirely.",
  ],
  8: [
    "Defer signing anything significant today.",
    "Avoid digging into old wounds.",
    "Let shared-money disputes rest.",
    "Delay the anxious late-night online searching.",
  ],
  9: [
    "Defer big travel bookings today.",
    "Avoid grand pronouncements about fate.",
    "Let the pilgrimage plan mature.",
    "Skip preaching to anyone today.",
  ],
  10: [
    "Defer asking for the promotion today.",
    "Avoid office politics today.",
    "Let the resignation draft wait.",
    "Skip public criticism of colleagues.",
  ],
  11: [
    "Defer new money schemes today.",
    "Avoid lending money today.",
    "Let the big ask wait a day.",
    "Skip speculative plans today.",
  ],
  12: [
    "Defer big expenses for now.",
    "Avoid crowded places if drained.",
    "Let late-night spending wait.",
    "Skip the endless scrolling before sleep.",
  ],
};

const cells: Array<[string, string[]]> = [];
for (const house of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  cells.push([`house=${house}.flavour=deferring`, TEXTS[house]!]);
}

export const dontsRows: BankRow[] = makeRows("donts", "en", cells);
