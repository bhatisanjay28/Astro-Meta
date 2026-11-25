/**
 * EN dos bank — `house={1..12}.flavour=constructive` (compose.ts dayPeaks: house =
 * the day's top house). Items 4–10 words, verb-first, imperative-mild, traditional
 * acts only — no purchases or rituals involving expense (style §8). 4 variants per
 * cell. Paired with the `donts` bank at the same house: flavours never contradict.
 */
import { makeRows, type BankRow } from "./types";

const TEXTS: Record<number, string[]> = {
  1: [
    "Begin your day with ten quiet minutes.",
    "Take a morning walk before the news.",
    "Write one honest intention for today.",
    "Wear something that feels like yourself.",
  ],
  2: [
    "Draft a simple budget before lunch.",
    "Thank someone who helped you this week.",
    "Prepare one home-cooked meal today.",
    "Say the appreciation out loud today.",
  ],
  3: [
    "Send the message you keep rewriting.",
    "Call a sibling or an old friend.",
    "Start the small project this morning.",
    "Read one page before going to bed.",
  ],
  4: [
    "Tidy one corner of the house.",
    "Cook something warm for the family.",
    "Call your mother or an elder.",
    "Water the plants with full attention.",
  ],
  5: [
    "Play a board game with the children.",
    "Sketch the idea instead of explaining it.",
    "Read a story to a child today.",
    "Attend a class or a lecture today.",
  ],
  6: [
    "Clear the smallest item on your list.",
    "Take the stairs and skip the lift.",
    "Serve someone without mentioning it.",
    "Set tomorrow's clothes out tonight.",
  ],
  7: [
    "Make the first polite phone call.",
    "Ask your partner one curious question.",
    "Host tea for a neighbour today.",
    "Listen fully before giving advice.",
  ],
  8: [
    "Organise one shared document or account.",
    "Journal about a worry, privately.",
    "Research one big question calmly.",
    "Review the family's important paperwork.",
  ],
  9: [
    "Visit a temple or a quiet place.",
    "Ask a teacher one good question.",
    "Take the long journey's first step.",
    "Read ten pages of scripture or philosophy.",
  ],
  10: [
    "Send the status update you owe.",
    "Dress one notch sharper today.",
    "Volunteer for the visible task.",
    "Thank a mentor publicly today.",
  ],
  11: [
    "Reply to the pending introduction.",
    "Attend a community or alumni meetup.",
    "Share your goal with one friend.",
    "Set up one small automatic saving.",
  ],
  12: [
    "Schedule an hour of genuine rest.",
    "Decline one invitation politely.",
    "Offer water to the rising sun.",
    "Sleep thirty minutes earlier tonight.",
  ],
};

const cells: Array<[string, string[]]> = [];
for (const house of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  cells.push([`house=${house}.flavour=constructive`, TEXTS[house]!]);
}

export const dosRows: BankRow[] = makeRows("dos", "en", cells);
