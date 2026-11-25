/**
 * EN thought-of-the-day bank — `theme={1..12}.tone={rating}` (compose.ts dayPeaks:
 * theme = the day's dominant house, tone = the overall band). 12–20 words, tone
 * cap per style §2, house flavour per the Phaladeepika house map (research §4).
 * 4 variants per cell; challenging cells carry a constructive beat (§2 hard rule).
 *
 * House themes: 1 self/vitality · 2 money & speech · 3 courage/communication ·
 * 4 home/comfort · 5 children/creativity/learning · 6 work/routines/health habits ·
 * 7 partnership/others · 8 deep change/shared matters · 9 fortune/guidance/learning ·
 * 10 career/status · 11 gains/networks/friends · 12 rest/expenses/solitude.
 */
import { makeRows, type BankRow, RATINGS } from "./types";

type Tone = (typeof RATINGS)[number];

const TEXTS: Record<number, Record<Tone, string[]>> = {
  1: {
    excellent: [
      "Vitality and purpose move together today, and the day rewards whoever begins.",
      "Your energy leads the day, so spend it on what genuinely matters.",
      "A deep sense of self makes even small wins feel larger today.",
      "The day places you centre stage in your own life, gently and without fuss.",
    ],
    good: [
      "A modest dose of self-care today keeps your natural energy running smoothly.",
      "Confidence grows quietly when you keep the promises you make to yourself.",
      "Energy is adequate instead of abundant today, so pace the day kindly.",
      "A calm start protects your mood and carries the whole day forward.",
    ],
    moderate: [
      "An even-keeled day for the self, with simple routine holding the centre.",
      "Keep the expectations light today and let ordinary discipline do the work.",
      "Your energy today feels like a middle road, neither pushing forward nor pausing.",
      "Small maintenance of mood today pays more than any grand push would.",
    ],
    challenging: [
      "The day invites you to go gently with yourself, since rest counts as progress.",
      "Low-key pacing is the day's real strength, and preparation still beats performance.",
      "Meet yourself with patience today, the way you would a tired friend.",
      "A quieter pace today is not a setback but simple, honest maintenance.",
    ],
  },
  2: {
    excellent: [
      "Words and resources both carry weight today, and both move on your side.",
      "A fine day to speak clearly about value, yours and everyone else's.",
      "Generosity flows back today, so let the practical plans breathe a little.",
      "Material matters feel lighter today, and simple honesty opens a door or two.",
    ],
    good: [
      "Steady habits around money and speech serve you better than bold moves today.",
      "Count what you have before deciding what you need, and the day aligns.",
      "A measured tone in money conversations today earns you quiet, lasting respect.",
      "Small savings or small kindnesses, the day rewards either with quiet interest.",
    ],
    moderate: [
      "Money and words both prefer steady hands today, so keep both simple.",
      "An ordinary day for resources, which is another way of saying stable.",
      "Review before speaking about money today, since carefully measured words travel further.",
      "Keep the spending and promises modest today, and the evening stays peaceful.",
    ],
    challenging: [
      "Money matters ask for patience today, so prefer quiet reviewing over deciding.",
      "A slower day for negotiations, which careful notes can still turn useful.",
      "Let big purchases and promises rest today, and revisit them with fresh eyes.",
      "Quiet, careful wording today protects both purse and peace of mind completely.",
    ],
  },
  3: {
    excellent: [
      "Courage comes easily today, and the first honest sentence changes the whole day.",
      "Initiative lands well now, so put a name to the idea you have been carrying.",
      "Your voice finds its footing today, and people hear more than usual.",
      "A fine day to send the message, make the call, start the conversation.",
    ],
    good: [
      "Speak once and clearly today, and notice the words do the rest.",
      "Steady courage today looks like one honest conversation, not a big battle.",
      "Small brave steps today build the kind of momentum tomorrow gratefully inherits.",
      "A gentle push past hesitation today opens more doors than force ever could.",
    ],
    moderate: [
      "Keep communication plain and factual today, and notice the plain facts persuade.",
      "Initiation is fine today, but pair it with patience for the reply.",
      "A middle-of-the-road day for bold words, so draft first and send later.",
      "Quiet courage today means showing up steadily rather than giving long speeches.",
    ],
    challenging: [
      "Words land a little heavier today, so weigh them before letting them go.",
      "The day suits rehearsing the hard conversation rather than having it live.",
      "Let courage work quietly today, preparing the ground instead of storming gates.",
      "If any discussion turns sharp today, pause first and answer it second.",
    ],
  },
  4: {
    excellent: [
      "Home feels like a strength today, and small touches make it warmer still.",
      "Comfort and confidence share an address today, so tend kindly to both.",
      "A fine day to refresh a corner of home and notice the calm spread.",
      "The day supports settling in, and settling in quietly supports everything else.",
    ],
    good: [
      "Simple comforts today, done properly, hold more value than any grand change.",
      "Home runs on small repairs today, and the day supplies the patience.",
      "Keep the home fires steady today, and the rest of life follows.",
      "A quiet evening at home restores more today than an outing would.",
    ],
    moderate: [
      "Domestic matters prefer routine today, so let the house run its usual course.",
      "An even day on the home front, best served with ordinary kindness.",
      "Keep home plans modest today and let comfort stay simple and uncomplicated.",
      "The home front holds steady today, asking only the usual small attentions.",
    ],
    challenging: [
      "Home matters ask for a soft touch today, so lead with listening.",
      "A fine day to fix the small domestic friction before it grows.",
      "Let home decisions rest today, and give the household some breathing room.",
      "Tend the home front gently today, since comfort rebuilds slowly and surely.",
    ],
  },
  5: {
    excellent: [
      "Creative energy runs bright today, so give it a proper full hour.",
      "Learning lands quickly today, and delight turns out to be an excellent teacher.",
      "A fine day to begin the playful project you keep quietly postponing.",
      "Young hearts and fresh ideas both respond warmly to gentle attention today.",
    ],
    good: [
      "Steady attention today turns a half-formed idea into a real working plan.",
      "Encourage one learner today, including the one who lives in your mirror.",
      "Creativity prefers structure today, so give the idea a simple, honest frame.",
      "A patient hour with children or study today pays quiet, lasting dividends.",
    ],
    moderate: [
      "Creative sparks arrive today, but they need you to write them down.",
      "An average day for study, best used for review rather than new chapters.",
      "Keep the creative plans light today, and let fun stay the point.",
      "Small learning steps today suit the day much better than ambitious syllabi.",
    ],
    challenging: [
      "Learning resists hurry today, so take the material in much smaller sips.",
      "The day suits encouraging others patiently rather than critiquing sharply or comparing.",
      "Let creative work rest today, and return when the mind is fresher.",
      "With the children today, choose calm repetition over introducing any new demands.",
    ],
  },
  6: {
    excellent: [
      "Work flows with unusual ease today, so ride the rhythm while it lasts.",
      "A fine day to clear the task you have been avoiding longest.",
      "Service done cheerfully today returns later as reputation, quietly and quite reliably.",
      "Routines feel lighter today, and discipline briefly feels like a genuine pleasure.",
    ],
    good: [
      "Steady work today beats brilliant work, and the whole day knows it.",
      "Keep the routine intact today, and it keeps you whole in return.",
      "One honest hour of focused effort today outweighs a whole scattered morning.",
      "A fine day to tidy the workflow, one small improvement at a time.",
    ],
    moderate: [
      "Work asks for persistence today rather than inspiration, so simply keep persisting.",
      "An even day at work, best met with lists and steady pacing.",
      "Keep the routine simple today, and let quiet completion be the win.",
      "Moderate output today still compounds well, provided the basics all stay done.",
    ],
    challenging: [
      "The workload may feel heavier today, so carry less and carry it well.",
      "A day for repairing the routine rather than to extend it further.",
      "Rest between tasks today is not laziness but sound and honest engineering.",
      "Keep each work promise deliberately small today, and overdelivery becomes quite simple.",
    ],
  },
  7: {
    excellent: [
      "Partnerships lean warm today, and one kind sentence can set the tone.",
      "A fine day to reach out first, and the outreach lands well.",
      "Others meet you halfway today, so meet them slightly more than halfway.",
      "Togetherness feels easy today, whether at work, at home or among friends.",
    ],
    good: [
      "Steady attention to your people today keeps every one of those bonds humming.",
      "Listen fully today, and you may notice the relationship bank quietly filling.",
      "A calm word today repairs more than a perfectly delivered speech tomorrow.",
      "Keep the partnership promises modest today, and mutual trust grows on schedule.",
    ],
    moderate: [
      "Relationships prefer a neutral register today, so be present without pushing agendas.",
      "An ordinary day for negotiation, best spent quietly listening rather than pitching.",
      "Keep the peace today, and allow small frictions dissolve on their own.",
      "Company is pleasant today, though deep talks may wait for a better day.",
    ],
    challenging: [
      "Close bonds ask for gentleness today, so soften the delivery, keep the truth.",
      "The day suits letting others be right, and keeping your counsel warm.",
      "Postpone the difficult relationship talk today, and prepare it kindly in writing.",
      "If friction finds you somewhere today, breathe deeply first and respond second.",
    ],
  },
  8: {
    excellent: [
      "Deep matters move smoothly today, and quiet understanding arrives without any effort.",
      "A fine day to untangle one long-pending matter with calm, complete attention.",
      "Change feels friendly today, so cooperate with it at least a little.",
      "Patience pays unusually quick dividends today, especially where the matters are complicated.",
    ],
    good: [
      "Steady attention to the deep file today keeps the long-run matters healthy.",
      "Handle the delicate matter today with plain words and cleanly written notes.",
      "A calm approach today turns a heavy topic into a manageable one.",
      "Small honest steps today make the big changes feel a little less steep.",
    ],
    moderate: [
      "Deep matters prefer steady hands today, so go slowly and keep notes.",
      "An even day for complicated topics, best handled in very small portions.",
      "Keep the shared matters transparent today, and trust quietly does the rest.",
      "Change neither rushes nor blocks today, and it simply asks for patience.",
    ],
    challenging: [
      "Complicated matters ask for extra care today, so exactly one step only.",
      "A day for researching and prepare rather than to commit to anything new.",
      "Let the deep waters settle today, and revisit them with a guide.",
      "Patience today is quietly protective, especially with shared resources and old files.",
    ],
  },
  9: {
    excellent: [
      "Luck leans your way today, mostly because the preparation finally gets noticed.",
      "A fine day to seek guidance, and the guidance finds you quickly.",
      "The bigger picture comes into clear focus today, and it looks kind.",
      "Fortune favours the moving today, so take the step you have rehearsed.",
    ],
    good: [
      "A steady and quietly kept faith today tends to attract the right doors.",
      "Learning from a mentor today works noticeably better than learning entirely alone.",
      "A fine day to plan the long journey, whether literal or otherwise.",
      "Keep the optimistic outlook steady today, and the opportunities keep introducing themselves.",
    ],
    moderate: [
      "Fortune runs neutral today, which quietly puts careful preparation back in charge.",
      "An ordinary day for big questions, best spent gathering small honest answers.",
      "Keep the long view today, and notice the short-term noise simply pass.",
      "Guidance arrives today in modest and easily missed forms, so take notes.",
    ],
    challenging: [
      "The bigger picture may blur today, so trust the map, not the mood.",
      "A day for patience with plans, since timing matters more than effort.",
      "Let large decisions rest today, and collect one more piece of advice.",
      "Keep faith simple today, and let routine carry what luck declines to.",
    ],
  },
  10: {
    excellent: [
      "Career matters shine today, and your own work speaks before you do.",
      "A fine day to present, propose or volunteer for the visible task.",
      "Recognition finds you today, so be where the work can be seen.",
      "Ambition and timing agree today, which is far rarer than it sounds.",
    ],
    good: [
      "Steady professional work today quietly compounds into clearly visible standing over time.",
      "A fine day to sharpen one professional skill in full public view.",
      "Keep the work promises you made, and reputation follows on its own.",
      "Do the visible task well today, and notice the credit arrive unworried.",
    ],
    moderate: [
      "Career moves at its working pace today, so let the work speak.",
      "An ordinary professional day, best used for finishing things rather than launching.",
      "Keep the public commitments light today, and deliver the private ones fully.",
      "Status neither rises nor slips today, and it simply holds its level.",
    ],
    challenging: [
      "Career pressures ask for composure today, so reply slowly and in writing.",
      "The day suits readying the whole case carefully rather than arguing it.",
      "Let ambitious timelines breathe today, and protect the quality of one task.",
      "Quiet diligence today protects more standing than any loud public defence could.",
    ],
  },
  11: {
    excellent: [
      "Gains arrive through people today, so gladly accept the introductions being offered.",
      "A fine day to share the goal, because sharing attracts willing helpers.",
      "Networks warm up today, and one message can open a practical door.",
      "Aspirations feel reachable today, and the honest maths quietly agrees with you.",
    ],
    good: [
      "Steady networking today, done warmly, tends to build more than any pitch.",
      "Keep the friend promises deliberately small today, and the goodwill compounds nicely.",
      "A fine day to follow up once, politely and with real specificity.",
      "Small gains today confirm the chosen direction, which is their whole job.",
    ],
    moderate: [
      "Gains run ordinary today, so appreciate them fully without stretching for more.",
      "An average day for outreach, best spent gently tending to existing contacts.",
      "Keep the financial hopes realistic today, and let effort set the pace.",
      "Friends help today in small ways, and small ways still count twice.",
    ],
    challenging: [
      "Gains may dawdle today, so protect carefully whatever has already safely arrived.",
      "The day suits declining extra commitments kindly and keeping the calendar honest.",
      "Let new money plans wait today, and review the current ones instead.",
      "Borrowed optimism today costs more than it returns, so go gently instead.",
    ],
  },
  12: {
    excellent: [
      "Rest restores unusually well today, so accept the long pause without guilt.",
      "A fine day to spend on quiet, which returns the cost as clarity.",
      "Solitude feels like a proper luxury today instead of a quiet setback.",
      "The quiet corner of today holds the best ideas, so visit it.",
    ],
    good: [
      "Steady rest today, taken seriously, repairs more than another round of effort.",
      "Keep the expenses planned today, and the peace of mind stays affordable.",
      "A fine day to end early and notice the evening be genuinely soft.",
      "Small retreats today, even one short hour, keep the larger momentum healthy.",
    ],
    moderate: [
      "An ordinary day for rest, which still deserves its own scheduled slot.",
      "Keep the spending unhurried today, and notice the budget remain satisfyingly boring.",
      "Solitude helps today in strict moderation, so take precisely that much only.",
      "A quiet day by careful design, and the design asks for little.",
    ],
    challenging: [
      "The day asks for deliberate rest, scheduled like the work it protects.",
      "The day suits keeping plans few and the inner noise even lower.",
      "Let the expenses wait today, except the ones that secure genuine calm.",
      "Solitude today is medicine in the gentlest sense, so take the dose.",
    ],
  },
};

const cells: Array<[string, string[]]> = [];
for (const house of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  for (const tone of RATINGS) {
    cells.push([`theme=${house}.tone=${tone}`, TEXTS[house]![tone]!]);
  }
}

export const thoughtRows: BankRow[] = makeRows("thought", "en", cells);
