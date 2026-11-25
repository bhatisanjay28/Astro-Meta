/**
 * EN daily.overview bank — `rating={4}.retro={none,review}` (compose.ts dayKey:
 * rating = the day's aggregate tone, retro=review when a Mercury/Jupiter/Saturn
 * retrograde falls in the window). 8 cells × 4 variants, 35–65 words. The day's
 * lead paragraph: overall pace and mood across areas, tone-capped (excellent is
 * momentum, not a jackpot), review frames verification as housekeeping, never
 * fear. Mirrors daily-overview.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, RETRO } from "./types";

const TEXTS: Record<string, Record<string, string[]>> = {
  excellent: {
    none: [
      "The day opens with unusual clarity and keeps it through most hours. Plans move, conversations cooperate, and small tasks finish ahead of schedule. Ride the momentum on the one priority that matters most, and watch the rest of today arrange itself around that win.",
      "Energy runs high and the atmosphere seems set up on your side today. Messages bring useful answers, and people respond faster than usual. Spend the ease on something concrete rather than drifting, and the whole day reads back as well spent.",
      "This is one of those days when timing quietly works for you. Doors open without forcing, and the right words arrive on cue. Move first on what you have been postponing, because the window rewards initiative more than caution.",
      "The sky lends a bright, cooperative backdrop today, and the hours feel lighter than their tasks. Goodwill travels easily between you and the people around you. Begin with the boldest item on the list and let confidence carry the rest.",
    ],
    review: [
      "The day runs bright and cooperative, with one quiet instruction from the sky: check before you send. Momentum stays strong while a retrograde undertone favours revision. Advance your main goal today, and give anything going out the door a second read.",
      "Clarity and ease mark the day, though part of it pulls gently backward toward unfinished threads. Treat that pull as useful instead of annoying. Ride the good energy forward, and spend a calm half-hour confirming details you usually trust.",
      "A confident, open mood carries the day, while the retrograde current asks for one extra pass on the details. Both fit together comfortably. Push the main plan ahead, and let your careful side handle the paperwork before evening.",
      "Today moves quickly on your side, and the atmosphere rewards those who act on good instincts. The one caution is small: verify numbers and names before anything is finalised. Do that, and the day stays entirely yours.",
    ],
  },
  good: {
    none: [
      "The day holds a steady, friendly rhythm with no sharp edges in sight. Ordinary tasks cooperate, and conversations stay civil and useful. Keep the schedule simple, finish what you start, and the evening closes on a settled note.",
      "A workable, pleasant tone runs through the day, helped by cooperative people and clear-enough plans. Nothing extraordinary is promised, and nothing disrupts either. Steady effort now earns its quiet interest by evening without needing drama.",
      "Today favours routine done well over improvisation. The mood is mild, the pace manageable, and the people around you reasonably easy to work with. Small completions add up faster than they appear to, so keep moving at your own speed.",
      "The sky sets a calm, even backdrop for the day, plus mild support where you reach for it. Energy holds steady through the afternoon. Keep promises small and follow-through clean, and the day closes better than it opened.",
    ],
    review: [
      "A steady, pleasant rhythm carries the day; the retrograde undertone adds a revision task or two. Neither spoils the other. Keep the simple schedule you planned, and give the older pending item a quiet second look.",
      "The day stays workable and mild, though some part of it turns toward checking older work. Read that as housekeeping, not trouble. Continue the routine as planned and watch the review pass tidy up loose ends.",
      "Today offers a calm pace with a small hitch: details may need confirming twice. Accept the extra pass without letting it sour the mood. Ordinary tasks still finish well, and the evening holds a settled, unhurried close.",
      "The day runs on a friendly, even keel while a review current moves underneath. Old messages resurface and small clarifications arrive. Answer them patiently, keep the rest of the plan light, and the day stays pleasant overall.",
    ],
  },
  moderate: {
    none: [
      "The day moves at an ordinary pace without much lift or drag in either direction. Energy rises slowly and attention wanders by afternoon. Keep the list short, take a real break, and allow small steady steps set the tone.",
      "A flat, neutral backdrop sets the tone today, neither helping nor hindering much. The hours ask for patience more than ambition. Choose two meaningful tasks, give them honest attention, and accept that quiet days have their own worth.",
      "Today asks for a level head rather than big swings. The mood stays even, decisions come slowly, and progress happens in modest steps. Work with the neutrality instead of against it, and the day passes cleanly enough.",
      "The day offers a plain, working rhythm with few surprises. Motivation may lag where excitement usually leads, and that is ordinary. Keep the commitments modest, honour the routine, and watch the quiet hours do their maintenance work.",
    ],
    review: [
      "The day keeps a neutral pace, while the retrograde undertone turns some hours toward re-reading and second looks. Energy stays modest throughout. Keep the list short, allow extra time for double-checking, and let accuracy stand in for speed.",
      "An ordinary, flat tone runs through the day; old threads resurface for quiet attention. Treat the interruptions as small and manageable. Take the unhurried route, review before you reply, and the day closes without fuss.",
      "Today moves slowly and evenly, and part of the slowness is the sky asking for verification rather than speed. Accept that framing. Finish the two essential tasks and watch the review work fill the remaining hours.",
      "The day's backdrop stays neutral, though small confusions around plans or messages may surface. None of it needs drama. Slow down slightly, confirm the details that feel unclear, and watch the rest of today settle around that care.",
    ],
  },
  challenging: {
    none: [
      "The day presses a little harder than yesterday, with friction showing in plans and conversations alike. The difficulty is mostly pacing, not permanence. Keep the schedule light, speak less and listen more, and watch the evening restore the balance.",
      "A heavier tone runs through the day, and tasks may feel slower than their actual size. Patience is today's main tool. Do the essentials well, postpone the rest without guilt, and end your day with proper rest.",
      "Today asks more from you than the calendar suggests, mostly in the form of small delays and tired attention. None of it is verdict-shaped. Slow the pace deliberately, choose gentleness over force, and protect one hour of quiet.",
      "The day leans demanding, with interruptions arriving in clusters and patience wearing thin by afternoon. The sky is asking for discipline, not heroics. Keep responses measured, keep the plan minimal, and let tonight's rest reset the scale.",
    ],
    review: [
      "The day carries extra weight, and part of it comes from old matters resurfacing for correction. The combination feels heavy but is manageable. Handle the review items first, keep new plans light, and let rest close the day.",
      "Friction marks the day's surface while the retrograde undertone pulls attention backward toward unfinished threads. Neither needs to fight the other. Accept the slower pace, fix what comes up for review, and leave new launches for clearer days.",
      "Today asks for patience twice over: once for the day's own weight, once for the details that need re-checking. Take that as the day's shape instead of a judgment on you. Work slowly, correct carefully, and rest early.",
      "The day runs heavier than usual, with delays and second looks built into its hours. Old tasks may knock for attention at awkward times. Meet them with a short, honest effort each, and keep the evening genuinely quiet.",
    ],
  },
};

const cells: Array<[string, string[]]> = [];
for (const rating of RATINGS) {
  for (const retro of RETRO) {
    cells.push([`rating=${rating}.retro=${retro}`, TEXTS[rating]![retro]!]);
  }
}

export const dailyOverviewRows: BankRow[] = makeRows("daily.overview", "en", cells);
