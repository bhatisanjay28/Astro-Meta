/**
 * EN weekly.overview bank — `rating={4}.retro={none,review}` (compose.ts weekKey:
 * rating = the week's aggregate tone, retro=review when a Mercury/Jupiter/Saturn
 * retrograde spans the window). 8 cells × 4 variants, 50–80 words. The week's
 * lead paragraph: pace and mood across the seven days with week-arc texture
 * (early week / midweek / weekend), tone-capped (excellent is momentum, not a
 * jackpot), review frames verification as housekeeping, never fear.
 */
import { makeRows, type BankRow, RATINGS, RETRO } from "./types";

const TEXTS: Record<string, Record<string, string[]>> = {
  excellent: {
    none: [
      "The week opens on a strong note and keeps its footing through most of it. Plans advance with little friction, conversations turn cooperative early, and by midweek several pending matters have quietly resolved. Spend the momentum on the one goal that matters most, and see the remaining days arrange themselves around that win.",
      "Energy holds high across the week, and the atmosphere seems arranged on your side more days than not. Answers arrive faster, people respond warmly, and obstacles that usually slow Monday dissolve by Tuesday. Put the ease into something concrete rather than letting it drift, and the week reads back as well spent.",
      "This is one of those weeks when timing works quietly on your side. Doors open without force, the right introductions happen on cue, and good news tends to arrive before you chase it. Move early on what you have postponed, because the opening stretch rewards initiative more than the second half.",
      "The sky lends the week a bright, cooperative backdrop, and the days feel lighter than their to-do lists. Goodwill moves easily between you and the people around you, and small favours return unasked. Begin the week with the boldest item on your list and let confidence carry the rest of it.",
    ],
    review: [
      "The week runs bright and cooperative, with one quiet instruction attached: check before you send. Momentum stays strong while a retrograde undertone favours revision, especially early in the week. Advance the main goal steadily, and give anything leaving your hands on Friday an unhurried second read. Do that small bit of diligence and the week stays entirely yours.",
      "Clarity and ease mark most of your week, though a part of it pulls gently backward toward unfinished threads. Treat the pull as useful instead of annoying. Ride the strong days forward, and set aside one calm hour midweek for confirming details you would usually trust. The weekend then closes better than the week began.",
      "A confident, open mood carries the week, while the retrograde current asks for one extra pass on anything important. Both fit together comfortably. Push the main plan ahead through Tuesday and Wednesday, then let your careful side handle the paperwork before the weekend arrives. Progress and proofreading share the week comfortably when each gets its own hours.",
      "The week moves quickly on your side, and most days reward acting on good instincts. The one discipline is small: verify numbers and names before anything is finalised, since the review current runs beneath the speed. Do that, and the week closes entirely on your terms. Saturday arrives feeling earned rather than lucky.",
    ],
  },
  good: {
    none: [
      "The week holds a steady, friendly rhythm with no sharp edges in sight. Ordinary tasks cooperate, conversations stay civil and useful, and the pace stays unhurried from Monday through Friday. Keep the schedule simple, finish what you start, and the weekend closes on a settled note. Small wins here compound quietly by Sunday evening.",
      "A workable, pleasant tone runs through the week, helped by cooperative people and clear-enough plans. Nothing extraordinary is promised, and nothing disrupts either. Steady effort now earns its quiet interest, and by midweek you can feel the small completions stacking on your side. Keep moving at your own speed and see the week stay kind.",
      "The week favours routine done well over improvisation. The mood stays mild, the pace manageable, and the people around you reasonably easy to work with. Midweek brings one small test of patience; meet it plainly and it passes without ceremony. Keep promises small and follow-through clean, and the weekend arrives better than Friday left it.",
      "The sky sets a calm, even backdrop for the week, with mild support wherever you reach for it. Energy holds steady through the middle days, when many weeks sag. Keep commitments modest, deliver them punctually, and Saturday reads as the quiet payoff of an honest week. Nothing here needs pushing; ordinary diligence carries it.",
    ],
    review: [
      "A steady, pleasant rhythm carries the week, with the retrograde undertone adding a revision task or two along the way. Neither spoils the other. Keep the simple schedule you planned, and give the older pending item a quiet second look before the weekend. The review fits neatly into one unhurried midweek hour.",
      "The week stays workable and mild, though part of it turns toward checking older work. Read that as housekeeping rather than trouble. Continue the routine as planned, let the review pass tidy up loose ends, and Friday closes the week cleaner than it found it. The momentum survives the housekeeping detour easily enough.",
      "The week offers a calm pace with a small hitch: details may need confirming twice. Accept the extra pass without letting it sour the mood. Ordinary tasks still finish well, and the weekend holds a settled, unhurried close. Midweek suits the double-checking best, when patience runs highest, and each confirmation saves money later.",
      "The week runs on a friendly, even keel while a review current moves underneath. Old messages resurface and small clarifications arrive through the middle days. Answer them patiently, keep the rest of the plan light, and the week stays pleasant on balance. One unhurried hour on Thursday absorbs most of that extra work.",
    ],
  },
  moderate: {
    none: [
      "The week moves at an ordinary pace without much lift or drag in either direction. Energy rises slowly, attention wanders by midweek, and progress comes in modest steps. Keep the list short, take a real break when the flatness shows, and allow small steady steps carry the seven days. Quiet weeks have their own worth, too.",
      "A flat, neutral backdrop sets the tone for most of your week, neither helping nor hindering much. The days ask for patience more than ambition. Choose two meaningful tasks, give them honest attention, and accept that a quiet week still moves your work forward. Save the bigger swings for a livelier sky next week.",
      "The week asks for a level head rather than big swings. The mood stays even, decisions come slowly, and progress happens in modest increments. Work with the neutrality instead of against it, and the days pass cleanly enough to keep your plans intact. Routine done well is the quiet victory here, and it compounds.",
      "The week offers a plain, working rhythm with few surprises. Motivation may lag where excitement usually leads, and that is ordinary for this transit. Keep the commitments modest, honour the routine, and see the quieter hours do their maintenance work while you rest properly. By Sunday the tally still reads as gentle forward motion.",
    ],
    review: [
      "The week keeps a neutral pace while the retrograde undertone turns several hours toward re-reading and second looks. Energy stays modest throughout. Keep the list short, allow extra time for double-checking, and let accuracy stand in for speed until the weekend. Quiet precision suits this week better than ambition does, and it is easier work besides.",
      "An ordinary, flat tone runs through the week, with old threads resurfacing for quiet attention. Treat the interruptions as small and manageable. Take the unhurried route, review before you reply, and the days close without fuss one after another. Midweek carries most of that review work, so plan the remaining days around it generously.",
      "The week moves slowly and evenly, and part of the slowness is the sky asking for verification rather than speed. Accept that framing. Finish the two essential tasks early and see the review work fill the remaining days without crowding your rest. A patient week still ends with a clean slate and a rested mind.",
      "The week's backdrop stays neutral, though small confusions around plans or messages may surface midweek. None of it needs drama. Slow down slightly, confirm the details that feel unclear, and see the rest of the week settle around that care. A short list, a steady pen, and one extra cup of tea handle the whole thing.",
    ],
  },
  challenging: {
    none: [
      "The week presses a little harder than recent ones, with friction showing in plans and conversations alike. The difficulty is mostly pacing, not permanence. Keep the schedule light, speak less and listen more through the tight days, and see the weekend restore the balance. By Saturday the pressure visibly eases, softer than Monday promised.",
      "A heavier tone runs through the week, and tasks may feel slower than their actual size. Patience is the week's main tool. Do the essentials well, postpone the rest without guilt, and end each day with proper rest so the weight does not accumulate. The weekend pays the steadiness back in full.",
      "The week asks more from you than the calendar suggests, mostly through small delays and tired attention. None of it is verdict-shaped. Slow the pace deliberately, choose gentleness over force, and protect one quiet hour for yourself on the hardest day. Choose smaller plans and honour them fully; they beat ambitious ones abandoned halfway.",
      "The week leans demanding, with interruptions arriving in clusters and patience wearing thin by midweek. The sky is asking for discipline, not heroics. Keep responses measured, keep the plan minimal, and see the weekend's genuine rest reset the scale. Difficult weeks end on schedule; the composure built inside them stays with you.",
    ],
    review: [
      "The week carries extra weight, and part of it comes from old matters resurfacing for correction. The combination feels heavy but stays manageable. Handle the review items first, keep new plans light, and let genuine rest close the week. Sorting the old matters properly clears room for the new to breathe later.",
      "Friction marks the week's surface while the retrograde undertone pulls attention backward toward unfinished threads. Neither needs to fight the other. Accept the slower pace, fix what comes up for review, and leave new launches for clearer days ahead. A properly repaired foundation serves next week better than any rushed launch would.",
      "The week asks for patience twice over: once for its own weight, once for the details that need re-checking. Take that as the week's shape instead of a judgment. Work slowly, correct carefully, and rest early on the heavier days. Small daily completions keep the week from feeling stuck, and patience here is practical rather than passive.",
      "The week runs heavier than usual, with delays and second looks built into several of its days. Old tasks may knock for attention at awkward hours. Meet each with a short, honest effort, and keep the evenings genuinely quiet to recover. Handled this way, Sunday then feels like arrival rather than escape.",
    ],
  },
};

const cells: Array<[string, string[]]> = [];
for (const rating of RATINGS) {
  for (const retro of RETRO) {
    cells.push([`rating=${rating}.retro=${retro}`, TEXTS[rating]![retro]!]);
  }
}

export const weeklyOverviewRows: BankRow[] = makeRows("weekly.overview", "en", cells);
