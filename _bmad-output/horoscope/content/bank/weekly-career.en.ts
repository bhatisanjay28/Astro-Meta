/**
 * EN weekly.career bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = career aggregate for the week, pb = Saturn's band for
 * this area, retro = review when a Mercury/Jupiter/Saturn retrograde spans the
 * window). 24 cells × 4 variants, 45–70 words. Saturn flavour: structure,
 * process, formality — fav = structure helps, neutral = field indifferent,
 * unfav = structure asks form/patience. Week-arc texture (early week / midweek
 * / Friday); challenging cells stay constructive; review = revision framing,
 * never fear.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Career momentum runs strong this week, and the structures around you hold firm while you push forward. Meetings and approvals bend your way more often than usual, and early in the week a visible task goes exceptionally well. Say yes to it and see the steady current do half the work.",
        "Work moves with a rare ease across the week, as if the usual friction was oiled overnight. Seniors notice effort without you pointing at it, and by midweek one project clearly pulls ahead. Give your best hours to that project and let ordinary duties orbit around it. Friday closes with the progress visible to everyone who matters.",
        "This week rewards the professional who acts, and the ground beneath your plans stays unusually solid. Colleagues lean cooperative, approvals arrive faster than expected, and the middle days suit bigger moves. Finish something substantial rather than starting three things at once, and the week reads as a genuine step up.",
        "Career effort converts cleanly into visible progress this week, with the heavier duties sitting lighter than they did before. Structure favours you: long tasks feel shorter, hard conversations go smoother, and a Friday review of the week shows real ground gained. Put energy where results compound and see the rest follow.",
      ],
      review: [
        "Career momentum is strong this week and the structure around you rewards steady movement. One instruction comes with the gift: the retrograde undertone asks for review before a launch. Advance the visible task, but double-check the details before anything leaves your desk, particularly toward Friday. Do both and the week ends on your side.",
        "Work flows with unusual ease this week and senior support feels close at hand. Underneath, the retrograde current turns part of the week toward checking older ground. Ride the momentum on the main project, and give yesterday's decisions one careful second look before the weekend arrives. Both efforts pay off handsomely this time.",
        "This week favours the professional who acts, and approvals arrive faster than expected. The review current suggests revising before sending rather than pushing something brand new. Polish the existing draft, walk through it once with fresh eyes, and let its quality speak for the whole week. Midweek is the natural slot for that final pass.",
        "Career effort converts cleanly into progress this week, with duties sitting lighter than usual. Underneath the ease, a quieter current invites you to verify rather than invent. Finish the important file early, then walk through it once more before Friday sends it onward. This kind of unhurried preparation carries the entire week.",
      ],
    },
    neutral: {
      none: [
        "The week's momentum comes from your steady effort more than from the surroundings, and that is the good kind of momentum. Nothing blocks you; nothing carries you either. Claim the win by showing up sharply every morning and finishing what you begin, and Friday shows a clear gain. Self-starters do especially well in this weather.",
        "Career runs on a bright charge this week even though the background stays unremarkable. Your own clarity supplies the drive. Pick the task with the highest visible return, give it your sharpest hours early in the week, and let ordinary conditions witness a strong result by Friday. Consistency, not brilliance, is what wins this week.",
        "Excellent form meets plain conditions this week, which suits self-starters perfectly. Support exists but waits to be asked for. Take the lead on the conversation you have been circling, let your initiative draw the help out, and the week closes visibly ahead of where it began. Midweek offers the best opening for that talk.",
        "Your working spirit is the strongest transit in this week's sky. Conditions sit neutral, neither pushing nor pulling, which leaves the field open. Set the tempo on Monday, protect your first hours each day from interruption, and the rest of the week follows your lead. The week rewards whoever sets its rhythm first.",
      ],
      review: [
        "This week's momentum comes from your steady effort, and the retrograde undertone asks that effort to include verification. Nothing blocks the path. Push the main work forward, and re-read the recent material before presenting it as final, ideally in a quiet midweek hour. Accuracy and pace together make the week a strong one.",
        "Career runs on a bright charge this week even though the background stays plain. The review current adds one discipline: confirm before you commit. Set your own tempo, finish the big task, and walk through its details once with care before Friday closes the books. The double pass costs little and returns much.",
        "Excellent form meets plain conditions this week, which suits self-starters, with one addition: the sky prefers revision over novelty. Take the lead on the task at hand, and fold a careful audit of last week's work into the same effort sometime midweek. Both halves of that plan pay off handsomely by the time Friday arrives.",
        "The week hands you rhythm rather than favours, and pace is enough. Part of it leans backward toward checking older ground. Build your momentum on the main line of work, and treat the review tasks as a second, quieter win to collect before the weekend. Both wins show up in the same tally.",
      ],
    },
    unfav: {
      none: [
        "The week brings strong overall form, though the deeper professional current runs slow and demanding. Tasks want more formality and less improvisation. Respect the slow channel: keep commitments formal, keep the tone patient, and the strong week still lands firmly on your side. Friday looks back on a week handled with real skill.",
        "Excellent energy rides through the week, with one structural knot underneath: the slower planet asks for protocol. Give the process its due, with approvals in order, names spelled right, and chains followed. The week rewards the formal route over the clever one, especially midweek. Do the paperwork early and the bright days stay yours.",
        "Your form is high this week even where authority feels stiff and unrewarding. Do not push against the rigid gate; work with it. Submit what the structure asks for, exactly as it asks, and spend the saved goodwill on your own agenda by the weekend. The gate opens wider once it trusts you.",
        "The week's broad tone favours you, while a slower professional current checks each step for form. Treat the checking as free quality control rather than resistance. Move deliberately, keep the paperwork immaculate, and the week still reads as a clear win on balance. Careful weeks like this one build professional reputations quietly.",
      ],
      review: [
        "The week brings strong overall form, though the professional channel underneath runs slow and formal. Review work moves better than new work in that channel. Respect the pace, re-check rather than re-apply, and the strong week still ends clearly on your side. Friday rewards the discipline you showed earlier in the week.",
        "Excellent energy rides through the week, with two disciplines stacked beneath it: protocol first, revision second. Give the process its due and re-read what the structure returns. The week rewards formality done twice over the shortcut done once, so plan the midweek accordingly. The thorough route is also the fast one this time.",
        "Your form is high even where authority feels stiff, and part of that stiffness is a call for re-examination. Submit what the gate asks for, then verify your own file before anyone else does. Preparation of this order carries the whole week. Walking in prepared changes the tone of every conversation that follows.",
        "The broad tone favours you while the slower professional current checks each step, and this week it also returns older items for correction. Accept both checks gracefully. Move deliberately, fix what resurfaces, and the week still reads as a win on balance. By Friday, the corrections look less like delays and more like foresight.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Career moves at a friendly, workable pace this week, and the structures around you behave. Steady effort lands where it should, without drama or delay, and midweek brings a small approval you have been waiting on. Lean into the routine tasks that quietly build reputation. Friday arrives feeling noticeably lighter than Monday did.",
        "The work week offers solid ground and no surprises, which suits careful professionals well. Colleagues cooperate, small approvals come without chasing, and the pace holds steady through to Friday. Lean in steadily and let ordinary diligence do the persuasive work on your behalf. Quiet reliability remains this week's most persuasive working currency.",
        "This week's career weather is fair and mild, with a supportive current under ordinary tasks. Your reliability reads clearly to the people who matter. Keep the promises you made at work, deliver them on time, and let consistency earn the week's quiet credit. Midweek suits raising the small request you have been saving for later.",
        "Work proceeds smoothly this week, helped by a patient and well-disposed atmosphere. The task list behaves, difficult conversations stay civil, and small requests meet quick answers. Steady attention across the working days earns more than one flashy gesture would manage. Friday closes with the desk clean, the inbox calm, and the mood easy.",
      ],
      review: [
        "Career moves at a friendly pace this week, with structures behaving and cooperation easy. The review current adds one instruction: verify before you finalise. Keep the steady rhythm, and re-read the documents before they leave your desk, especially anything bound for Friday. The extra pass fits comfortably inside a single ordinary morning.",
        "The work week offers solid ground without surprises, which suits careful professionals. Underneath, a revision-friendly current asks for a second pass on older work. Keep the steady rhythm, and give the pending report one more proofread before it goes out midweek. Both the rhythm and the report benefit from the same patience.",
        "This week's career weather is fair, with a supportive current beneath ordinary tasks. The sky also nudges you toward revisiting recent decisions. Continue as planned, treat any recheck as progress rather than delay, and Friday closes the week on a respectably tidy note. The tidiness itself emerges as the reward.",
        "Work proceeds smoothly this week, helped by a patient and well-disposed atmosphere around the workplace. The week's quieter instruction is to confirm details others may have missed. Stay the course, and quietly become the person who catches the errors before they travel. That kind of reputation outlasts the week by whole months.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary working week with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the stakes, and Friday pays out quietly and right on time. Ordinary weeks like this one quietly keep all the larger plans alive.",
        "The work week stays level and professional, neither generous nor difficult. Your competence carries its usual weight, and colleagues match your tone. Do the work that is plainly in front of you and see the evenness be the week's quiet advantage. By Friday afternoon, the accumulated steadiness reads as genuine quiet strength.",
        "Career holds a steady middle path this week, with cooperation available and resistance absent. Nothing needs heroics, and nothing rewards drift either. Work the plan as written, close the open loops you can, and the week ends respectably, if unspectacularly. Midweek offers the best window for clearing the oldest of those loops.",
        "The week runs at ordinary professional pace on an even, manageable field. Progress comes at the standard rate of exchange: effort for progress. Choose the tasks with visible outcomes, do them properly across the middle days, and finish the week with a clean desk. That clean desk is the week's most honest report card.",
      ],
      review: [
        "A fair, ordinary working week, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, re-checks included. Keep the standards high, confirm the details twice, and Friday pays out quietly and on time all the same. Patience with the small print pays for itself twice over here.",
        "The work week stays level and professional, neither generous nor difficult, while older tasks resurface for review. Your competence carries its usual weight. Answer the resurfaced items first, then move to the main list, and see the evenness hold through Friday. Clearing the old work early in the week lightens everything after it.",
        "Career holds a steady middle path this week, with one addition from the sky: re-read before you send. Cooperation is available and resistance absent. Work the plan as written, add the second pass, and the week ends respectably on balance. The quiet habit of checking becomes your personal edge for this week.",
        "The week runs at ordinary professional pace on an even field, while a review current tugs older threads back into view. Progress still comes at the standard rate. Honour the review work first, choose main tasks with visible outcomes, and finish with a clean desk. Friday then closes the books without loose pages.",
      ],
    },
    unfav: {
      none: [
        "A workable week with one demanding seam through the professional matters: the deeper current wants form and patience. Ordinary tasks go fine; formal requests move slowly. Keep the tone respectful, keep the paperwork complete, and see the plain work shine by Friday. The plain work carries more weight than usual this time.",
        "The work week stays fair on the surface while the slower channel underneath asks for proper procedure. Improvisation meets friction this week; process meets cooperation. Choose the formal route for anything that matters, and see the routine work carry the week's total. Form filled in properly emerges as the week's shortcut in disguise.",
        "Career holds a decent pace this week with a single stiff knot: authority figures prefer protocol over charm. Respect the preference rather than fighting it. Submit what is asked in the asked form, and the rest of the week flows normally. Of the week's days, midweek remains the safest slot for formal submissions.",
        "A fair working week with a slow lane through the middle of it. The slow lane belongs to anything formal, like approvals, submissions, and senior conversations. Route those carefully and unhurriedly, keep the lighter tasks moving briskly around them, and Friday balances out. The two lanes together still cover the whole map.",
      ],
      review: [
        "A workable week with a demanding seam through professional matters: the deeper current wants form, patience, and re-checking. Ordinary tasks go fine; formal requests move slowly. Keep paperwork complete, verify what returns, and see the plain work shine through to Friday. Whatever returns corrected this week tends to stay correct for months.",
        "The work week stays fair on the surface while the slower channel underneath asks for procedure and revision. Improvisation meets friction; process meets patience. Choose the formal route for anything that matters, and correct the older items without complaint midweek. A calm manner with the corrections saves more time than any shortcut.",
        "Career holds a decent pace this week with a stiff knot: authority prefers protocol, and the sky prefers revisiting over launching. Both point the same way, careful and unhurried. Submit what is asked in the asked form and see the rest flow. The aligned currents make the week simpler than it sounds.",
        "A fair working week with a slow lane through its middle, and this week the lane also returns older items for correction. Route the formal matters carefully, fix what resurfaces, and see the lighter tasks move briskly around the slow traffic. By Friday evening, both lanes stand neatly cleared for the weekend.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Career moves at an even, ordinary pace this week, and the structures around you stay neutral but honest. Effort still counts; it just converts at the regular rate. Keep the routine tight, deliver on time, and Friday closes the week respectably. Neutral weeks like this one reward the boring disciplines best of all.",
        "The work week offers fair, unremarkable conditions, helped along by a mild supportive current. Nothing dazzles, nothing blocks. Choose two meaningful tasks, give them your honest hours, and by Friday the quiet accumulation shows in the week's tally. Midweek suits the deeper concentration that this kind of week quietly favours most.",
        "This week asks for patience more than ambition on the career front. The mood stays even, decisions come slowly, and progress happens in modest steps. Work with the mild current instead of against it, and the days pass cleanly enough. Save the bold proposals for a livelier week somewhere further ahead.",
        "The week offers a plain working rhythm with few surprises and mild support at the edges. Motivation may lag where excitement usually leads, and that is ordinary. Keep the commitments modest, honour the routine, and see the quiet hours do their maintenance. Maintenance weeks are what make bright weeks possible later.",
      ],
      review: [
        "Career moves at an even pace this week, with the retrograde undertone turning a few hours toward re-reading. Effort still converts at the regular rate, checks included. Keep the routine tight, confirm the details once, and Friday closes the week respectably. The single careful pass is really all that this week asks of you.",
        "The work week offers fair, unremarkable conditions with a mild revision current underneath. Nothing dazzles, nothing blocks, and older threads resurface gently. Give them a quiet hour midweek, keep the two main tasks moving, and Friday closes without loose ends. A tidy week like this one closes its own accounts cleanly.",
        "This week asks for patience twice: once for its ordinary pace, once for the details that want re-checking. The mood stays even throughout. Finish the essential tasks early, let the review work fill the gaps, and the week passes without fuss. Accuracy rather than speed is what this particular week pays for.",
        "The week offers a plain working rhythm while small confusions around plans or messages surface midweek. None of it amounts to much. Slow down slightly, confirm the unclear details, and see the rest of the week settle around that care. A steady pen and a deliberately short list handle everything else.",
      ],
    },
    neutral: {
      none: [
        "The week's career field sits level and undemanding, with neither help nor hindrance from the wider sky. Momentum rests on your own rhythm. Set a modest target on Monday, reach it without detours, and let satisfaction be the week's quiet reward. Self-set targets convert best in calm weather like this one.",
        "A neutral but honest working week, the kind that quietly builds a professional reputation. Nothing bends your way, nothing blocks you either. Keep the commitments realistic, keep the delivery punctual, and let steady hours do their patient compounding through Friday. That patient compounding shows up the very moment conditions turn kind again.",
        "Career holds a steady middle path this week on an even, manageable field. Progress is available at the standard exchange rate of effort for progress. Work the plan as written, close what loops you can, and the week ends respectably. Of the week's days, midweek carries the best odds for one difficult conversation.",
        "The professional sky sits level this week, offering a fair field and an honest pace. Nothing dazzles, and nothing interferes either. Decide what a good week looks like for you, pursue it without drama, and let consistency speak at the close. Plain, even weeks like this one are where steady careers are actually built.",
      ],
      review: [
        "The week's career field sits level while the retrograde undertone turns some hours toward second looks. Momentum still rests on your rhythm. Set the modest target, re-read the material behind it, and let careful pacing carry the week to Friday. Careful pacing remains a genuine skill, and this week pays for it.",
        "A neutral but honest working week, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep commitments realistic, give the re-checks their share of time, and let steady hours compound gently through Friday. The re-checks done early in the week cost the least of all.",
        "Career holds a steady middle path this week, with one instruction from the sky: verify before you send. Cooperation is available and resistance absent. Work the plan as written, add the checking pass, and the week closes on respectable terms. The checked version reads better than the rushed one, whatever the week's mood.",
        "The professional sky sits level this week while a review current tugs older threads back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent work. Set the modest target, verify as you go, and let tidy accuracy be the reward. Friday's tidy accuracy outshines any flashy Monday start.",
      ],
    },
    unfav: {
      none: [
        "An ordinary working week with one slow seam through the formal matters: the deeper current wants procedure and patience. Routine tasks proceed fine; anything official moves at its own rhythm. Respect the pace, keep the paperwork complete, and the week passes cleanly. Friday closes the week's books without any drama attached to them.",
        "The work week stays level on the surface while the slower channel underneath insists on proper procedure. Improvisation meets friction; preparation meets cooperation. Route the important requests through the formal door, in the asked shape, and let routine carry the rest. Well-prepared requests move twice as fast in this kind of weather.",
        "Career holds a workable pace this week with one stiff patch: authority figures want protocol before personality. Give the form its due. Submit what is asked in the asked order, keep your own tempo on lighter work, and the week balances out. The stiffness here is purely procedural, not personal, this time around.",
        "A plain working week with a demanding patch in the middle of it. The patch belongs to formal matters, approvals, submissions, and senior sign-offs. Give that part its full documentation, keep the lighter tasks moving briskly, and Friday settles the account. Documentation completed early in the week keeps the whole account honest.",
      ],
      review: [
        "An ordinary working week with a slow seam through formal matters, and the seam now also asks for re-checking. Routine tasks proceed fine; official items move slowly and return once. Respect both speeds, verify what comes back, and the week stays clean. One careful, complete return beats three hasty submissions every single time.",
        "The work week stays level on the surface while the slower channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience. Use the formal door for what matters, correct the older items midweek, and let routine carry on. The corrected items age well in files like these.",
        "Career holds a workable pace this week with two quiet disciplines stacked: protocol first, re-reading second. Neither is personal. Submit what is asked in the asked order, re-check what returns, and keep your own tempo on the lighter work. Both disciplines pass more quickly than they first promise, especially before Friday.",
        "A plain working week with a demanding patch in its middle, and this week the patch also returns older items for review. Give the returns their corrections promptly, keep the documentation complete, and see the lighter tasks move briskly around the slow traffic. Friday then finds the ledger balanced and quiet.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual, yet the structures around you still hold and still help. The difficulty is pacing, not permanence. Keep the schedule light, use the cooperative colleagues early in the week, and see the weekend restore the balance. Any favour received this week deserves returning once the sky lightens again.",
        "A heavier tone runs through the working days, and tasks may feel slower than their actual size. The helpful part is structural: process and routine still work exactly as designed. Do the essentials well, postpone the rest without guilt, and rest properly each evening. Small completions count double in a week like this.",
        "The week asks more from you than the calendar suggests, though the cooperative current keeps a lane open. Take it: one straightforward task done well each day keeps the week from souring. Choose gentleness over force and protect the quiet evenings. That lane narrows by Friday, so use it early in the week.",
        "The week leans demanding, with interruptions arriving in clusters and patience thinning by midweek. What helps: the structure around you stays reliable when little else does. Keep responses measured, keep the plan minimal, and see the weekend reset the scale. Reliable structure remains the week's one quiet, dependable gift to you.",
      ],
      review: [
        "The week presses harder than usual, though the structures around you still hold and help. Add the retrograde instruction: handle review items before new plans. Keep the schedule light, correct what resurfaces early, and see the weekend close the books gently. Order of operations matters considerably more than raw speed this week.",
        "A heavier tone runs through the working days while the review current pulls attention toward older tasks. The helpful part is structural: process and routine still work as designed, corrections included. Do the essentials, fix what returns, and rest properly each evening. Corrected work stays corrected, which is its own comfort.",
        "The week asks patience twice: for its own weight, and for the older matters returning for a second look. The cooperative current keeps a lane open for exactly this work. Take the lane, correct what returns, and protect the quiet evenings. The lane fits the corrections better than it fits new plans.",
        "The week leans demanding, and part of the weight is old work knocking for attention at awkward hours. The structure around you stays reliable through it. Meet each knock with a short, honest effort, and keep the evenings genuinely quiet to recover. Handled this way, Sunday evening feels like arrival instead of escape.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones, and the field offers little cushion: progress comes only from steady, deliberate effort. The difficulty is pacing, not permanence. Keep the plan minimal, deliver the essentials, and see the weekend restore what the days spend. Modest targets, fully met, are the week's winning shape.",
        "A demanding week on plain ground, where nothing extra arrives to help and no fresh trouble interferes either. Tasks feel slower than their size; patience closes the gap. Work in short, honest sessions, rest deliberately, and Friday closes the week without debt. Short sessions beat long sprints in weather like this.",
        "The week asks more than the calendar promises, mostly through small delays and tired attention. Nothing here is verdict-shaped; it is weather, and weather passes. Slow the pace deliberately, choose gentleness over force, and protect one quiet hour on the hardest day. That protected hour is not laziness; it is necessary maintenance.",
        "The week leans demanding without offering much support in return, which makes pacing the whole game. Interruptions cluster, patience thins, and yet the essentials still fit if the plan stays small. Keep responses measured and see the weekend reset the scale. A small plan honoured fully beats a large one abandoned halfway.",
      ],
      review: [
        "The week runs heavier than recent ones, and old matters surface for correction inside the weight. The field offers little cushion, so sequence matters: review items first, new plans last. Keep the list short, work slowly, and see the weekend absorb the rest. Sequencing is the whole strategy for a week like this.",
        "A demanding week on plain ground, with revision requests arriving at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each request with a short, honest effort, rest deliberately between them, and Friday balances the books. The books balance when the efforts stay short and real.",
        "The week asks patience twice over: for its own heaviness, and for the details that need re-checking before anything ships. Take that as the week's shape instead of a judgment. Work slowly, correct carefully, and rest early on the heavier days. Both kinds of patience pay off visibly by Sunday evening.",
        "The week leans demanding while a review current tugs older threads back into the open. Neither needs to fight the other. Accept the slower pace, fix what comes up for review, and leave new launches for a clearer week ahead. The repaired ground serves next week much better than speed would.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides: its own weight, and a professional channel that wants form at every step. Neither is personal. Keep everything formal, keep the tone patient, do less but do it properly, and see the weekend restore the difference. Proper form is the week's only shortcut, and it works.",
        "A heavy working week meets a slow, exacting professional current, and tasks feel slower than their real size. The combination favours the patient and the prepared. Do the essentials in the asked shape, postpone the rest without guilt, and rest early each evening. Early evenings are what make the mornings survivable.",
        "The week asks more than the calendar suggests, while the professional channel checks every step for form and pace. The pair feels heavy but stays manageable. Keep the schedule light, keep the paperwork immaculate, and protect one genuinely quiet hour daily. That quiet hour is maintenance rather than indulgence for this particular week.",
        "The week leans demanding while the formal channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline the temptation: shortcuts cost double in weather like this. Keep the plan minimal, keep submissions complete, and see the weekend reset the scale. Complete and slow beats fast and repaired every time.",
      ],
      review: [
        "The week presses from two sides, and the retrograde undertone adds a third: older items returning for correction. The stack feels heavy but stays orderly. Handle the returns first, keep new plans parked, do everything in the asked form, and rest early. Orderly weeks like this end better than they feel.",
        "A heavy working week meets a slow professional channel that also asks for re-checking this time. The combination favours the thorough over the quick, decisively. Correct what returns, submit nothing half-checked, keep the schedule light, and rest early each evening. Thorough emerges as the fast route this week, oddly enough.",
        "The week asks patience three ways: its own weight, the formal channel's pace, and the details that need re-checking. None of the three is personal. Take them in order, one at a time, keep the paperwork immaculate, and protect the quiet evenings. Taken in order, the week stays manageable and ends fine.",
        "The week leans demanding while the formal channel returns older items for review at its own rhythm. The mismatch tempts shortcuts, and shortcuts cost double here. Meet the returns promptly, keep submissions complete, and leave new launches for a clearer week. Next week inherits a genuinely clean slate if you manage this.",
      ],
    },
  },
};

const cells: Array<[string, string[]]> = [];
for (const rating of RATINGS) {
  for (const pb of AREA_PB) {
    for (const retro of RETRO) {
      cells.push([`rating=${rating}.pb=${pb}.retro=${retro}`, TEXTS[rating]![pb]![retro]!]);
    }
  }
}

export const weeklyCareerRows: BankRow[] = makeRows("weekly.career", "en", cells);
