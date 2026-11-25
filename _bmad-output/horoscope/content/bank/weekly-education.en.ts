/**
 * EN weekly.education bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = study aggregate for the week, pb = Mercury's band for
 * this area, retro = review when a Mercury/Jupiter/Saturn retrograde spans the
 * window). 24 cells × 4 variants, 45–70 words. Mercury flavour: study, focus,
 * revision, clarity — fav = learning flows, neutral = ordinary classes, unfav =
 * distraction asks structure/patience. retro=review is native ground here
 * (revision, old syllabus, second drafts), framed as an advantage. Week-arc
 * texture mirrors daily-education.en.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Learning flows easily across the week, and difficult topics open with less pushing than usual. Focus holds through long stretches, and questions find clear answers by midweek. Tackle the hardest chapter in your freshest hour early on, and see the sharp week carry the rest. Momentum gathered now serves the whole syllabus.",
        "The study week is bright and orderly: notes make sense, doubts dissolve, and memory holds what it reads. Teachers and mentors respond well across the days. Ask the question you have been saving midweek, and see the receptive atmosphere reward the asking. Answers arrive faster in weeks shaped like this one.",
        "Clarity marks every study session this week, with concepts connecting faster than they did last month. Practice feels productive rather than repetitive. Push slightly beyond the comfortable syllabus midweek, and see the strong current widen what you can hold by Friday. What you manage to hold by Friday stays held for months.",
        "Concentration runs deep all week, helped by a Mercury-friendly backdrop that rewards organised effort. A single well-planned session now achieves more than three scattered ones. Plan the week's sessions properly, protect them from interruptions, and see the days hand you real mastery. Deep weeks like this set the tone for this month.",
      ],
      review: [
        "Learning flows easily this week, and the retrograde layer turns it toward revision rather than new ground — natural territory here. Focus holds through long stretches. Revisit the older chapters while the current runs this smooth, and let each pass sharpen what you already hold. Polished chapters serve far longer than fresh skims.",
        "The study week is bright and orderly, with a retrograde preference for second drafts over first attempts. Doubts dissolve on re-reading. Polish the earlier work across the middle days — the essay, the problem set, the notes — and let refinement be the week's achievement. Refined work keeps its polish long after the week ends.",
        "Clarity marks every study session this week, with old concepts connecting in new ways. Practice feels productive rather than repetitive. Re-test yourself on material learned earlier across the week, and see the review passes reveal how much has genuinely settled. Knowledge settled this deeply shows itself in exactly such weeks.",
        "Concentration runs deep this week, helped by a Mercury-friendly backdrop, and the review current makes it ideal for checking older answers. Plan one verification session midweek, protect it from interruptions, and let accuracy be the week's quiet mastery. Accuracy built carefully now holds its value through the entire term.",
      ],
    },
    neutral: {
      none: [
        "Study form is strong this week even on plain ground: your own discipline supplies the progress. Nothing distracts and nothing inspires either. Set the syllabus target yourself on Monday, meet it cleanly across the days, and let self-made order be the week's quiet achievement. Order made yourself holds better than order given.",
        "The study hours run on your effort this week more than on any passing current, and that suits a methodical learner. Classes behave, notes behave, focus behaves. Use the steady form to organise next week's plan while this week's work finishes early. Early finishes leave the Friday of such weeks pleasantly uncluttered.",
        "A confident study week on neutral ground: the sky offers clarity rather than inspiration. Concepts are approachable because your mind is settled. Write the summary notes while thinking is this clean midweek, and see the tidy pages serve the whole term. Pages written this cleanly keep teaching for months afterwards.",
        "Your focus sharpens this week against a plain background, which is often the best combination. No noise disturbs the desk, and no delay hides the answers. Use the clean view for the topic needing unbroken attention, and let strong focus lead the days. Midweek holds the longest unbroken stretch this time.",
      ],
      review: [
        "Study form is strong this week even on plain ground, with the retrograde layer asking for recounts. Your own discipline supplies the progress. Finish the syllabus target across the days, then re-check the earlier answers while focus is this clean. Clean focus finds errors that tired eyes walk past.",
        "The study hours run on your effort this week, and the review current adds a useful habit: re-read before you move on. Classes behave, focus behaves. Use the steady form to proofread the earlier notes, and let re-checking be part of the order. Proofed notes hold their accuracy through the term.",
        "A confident study week on neutral ground, with one exception: the sky prefers revising over starting. Concepts are approachable because your mind is settled. Finish the planned pages, revise the earlier chapter once midweek, and hold new topics for next week. Topics held this way begin far stronger next week.",
        "Your focus sharpens this week against a plain background, while the review current pulls gently toward older chapters. No noise disturbs the desk. Use the clean view for a second pass over last month's material, and let strong focus find the small errors. Errors found early stay small; found late, they grow.",
      ],
    },
    unfav: {
      none: [
        "The week's broader strength reaches your studies too, though the deeper current asks for form and patience with learning. Progress favours the documented and the punctual. Keep the timetable firm and the notes complete, and the strong days still work for you. Complete notes carry more weight than fast ones here.",
        "Warm energy rides through the week while the study channel underneath runs slow and formal. The combination rewards those who keep routines and respect deadlines. Let the schedule precede the enthusiasm, and the week's strength settles into real, checkable progress. Progress you can point to is progress that compounds.",
        "Your overall form is high, though the study current underneath prefers procedure over inspiration this week. Approvals move slowly and feedback arrives formally. Do not push against the gate: submit what is asked, in the asked format, and see the strong week carry it. Well-formatted submissions clear gates twice as fast.",
        "The broad week favours you, while a slower academic current checks each submission for completeness. Treat the checking as protection rather than resistance. Move deliberately, keep every assignment documented, and the week still closes with progress resting on your side. Documented weeks keep their progress where faster weeks misplace it.",
      ],
      review: [
        "The week's broader strength reaches your studies, though the academic channel underneath runs slow and formal, re-checking its own trail. Progress favours the documented. Keep the timetable firm, the notes complete, the figures verified, and the strong days still work. Verified notes are what serves when exams call.",
        "Warm energy rides through the week while the study channel underneath runs slow, formal and revision-minded. The combination rewards routines, deadlines and second passes. Let the schedule precede the enthusiasm, correct what returns, and the strength settles into progress. Work corrected this carefully ages well in every examiner's eyes.",
        "Your overall form is high, though the study current underneath prefers procedure and re-examination over inspiration. Feedback arrives slowly and formally this week. Submit what is asked in the asked format, re-check it before resending, and see the strong week carry the rest. One complete return beats three hasty submissions.",
        "The wider week runs bright while the academic lane runs slow and re-checks its history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: exact formats, full records, revised drafts. The brightness still covers your studies. By Friday the lane closes with every draft verified and filed.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Learning moves at a friendly, workable pace this week, and the classes behave. Steady progress lands where it should, without confusion or delay, and midweek brings a small breakthrough you did not expect. Keep the study routine going and see the week build on it. Small breakthroughs often anchor the whole syllabus.",
        "The week offers solid academic ground and no surprises, which suits careful learners well. Concepts cooperate, small doubts clear without asking twice, and the pace holds steady through Friday. Keep showing up to the desk, and let ordinary diligence do the teaching. Ordinary diligence of this kind outperforms brilliance most terms.",
        "This week's study weather is fair and mild, with a supportive current under ordinary lessons. Your steadiness at the desk reads clearly to teachers and mentors. Keep the promises made about assignments, and let that consistency earn the week's quiet credit. Midweek suits raising the longer question you have saved.",
        "Classes proceed smoothly this week, helped by a patient and well-disposed academic atmosphere. Difficult topics stay approachable, deadlines hold their shape, and small requests meet quick answers. Steady attention across the days earns more than one heroic all-nighter would. By Friday the week closes with every studied page accounted for.",
      ],
      review: [
        "Learning moves at a friendly pace this week, with classes behaving and cooperation easy. The review current adds one instruction: re-read before you trust. Keep the steady rhythm, and give the earlier chapter a second pass before midweek tests it. Chapters re-read this carefully hold their ground under any questioning.",
        "The week offers solid academic ground without surprises, which suits careful learners. Underneath, a revision-friendly current asks for a second pass over older material. Keep the steady rhythm, and give the pending revision one focused session before midweek closes it. Rhythm and revision feed each other in weeks like this.",
        "This week's study weather is fair, with a supportive current beneath ordinary lessons. The sky also nudges you toward revisiting recent material. Continue as planned, treat the re-testing as progress rather than delay, and Friday closes the books respectably tidy. Material re-tested this way is the kind that survives exams.",
        "Classes proceed smoothly this week, helped by a patient academic atmosphere. The week's quieter instruction is to confirm answers others skimmed. Stay the course, and quietly become the student who catches the small mistakes before they reach the marks. Care of that kind outlasts the week by whole terms.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary study week with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the load, and Friday pays the week out quietly and on time. Weeks like this quietly keep the whole term on course.",
        "The classes stay level and orderly this week, neither inspiring nor difficult. Your consistency carries its usual weight. Do the studying that is plainly in front of you, and see the evenness of todays be the week's quiet advantage. The whole week's accumulated steadiness reads as real discipline.",
        "Study holds a steady middle path this week, with cooperation available and resistance absent. Nothing needs heroics, and nothing rewards drift either. Work the timetable as written, close the open chapters you can, and the week ends respectably. Midweek offers the best window for clearing the oldest backlog.",
        "The week runs at ordinary academic pace on an even, manageable field. Progress comes at the standard rate of exchange: hours for understanding. Choose the topics with visible outcomes, work them properly across the middle days, and finish with a clean slate. Understanding banked is the week's most honest report.",
      ],
      review: [
        "A fair, ordinary study week, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, checks included. Keep the standards high, confirm the answers twice, and Friday pays out quietly and on time all the same. Answers confirmed twice rarely need a third look.",
        "The classes stay level and orderly this week, neither inspiring nor difficult, while older material resurfaces for review. Your consistency carries its usual weight. Answer the resurfaced topics first, then move to the main list, and see the evenness hold. Revisions cleared early in the week make the remaining days lighter.",
        "Study holds a steady middle path this week, with one addition from the sky: re-check before you confirm. Cooperation is available and resistance absent. Work the timetable as written, add the second pass, and the week ends respectably on balance. A habit of re-checking quietly becomes the term's best edge.",
        "The week runs at ordinary academic pace on an even field, while a review current tugs older chapters back into view. Progress still comes at the standard rate. Honour the review work first, choose main topics with visible outcomes, and finish tidy. Friday then closes the notebook without loose pages.",
      ],
    },
    unfav: {
      none: [
        "A workable study week with one demanding seam through the formal matters: the deeper current wants procedure and patience. Ordinary classes go fine; official submissions move slowly. Keep the tone respectful, keep the paperwork complete, and see the plain work shine by Friday. The plain work carries unusual weight this week.",
        "The week stays fair on the surface while the slower academic channel underneath asks for proper procedure. Improvisation meets friction this week; preparation meets cooperation. Choose the formal route for anything that matters, and let routine study carry the week's total. Applications completed in the right shape are the real shortcut.",
        "Study holds a decent pace this week with a single stiff knot: the examining side prefers protocol over charm. Respect the preference rather than fighting it. Submit assignments in the asked format, and the rest of the week flows normally. Among the seven days, midweek is safest for formal submissions.",
        "A fair study week with a slow lane through the middle of it. The slow lane belongs to anything official: applications, approvals, and formal submissions. Route those carefully and unhurriedly, keep the lighter lessons moving briskly, and Friday balances out. Both lanes together still cover the entire week's timetable.",
      ],
      review: [
        "A workable study week with a demanding seam through formal matters: the deeper current wants procedure, patience, and re-checking. Ordinary classes go fine; official submissions move slowly. Keep paperwork complete, verify what returns, and see the plain work shine through Friday. What returns corrected once rarely needs another return.",
        "The week stays fair on the surface while the slower academic channel underneath asks for procedure and revision. Improvisation meets friction; preparation meets patience. Choose the formal route for what matters, and correct the older submissions without complaint at midweek. Calm, complete corrections save more time than any shortcut would.",
        "Study holds a decent pace this week with a stiff knot: protocol first, and the sky prefers revisiting over launching. Both point the same way, careful and unhurried. Submit assignments in the asked format and see the rest flow. Currents aligned this neatly simplify the whole week considerably.",
        "A fair study week with a slow lane through its middle, and this week the lane also returns older submissions for correction. Route the official matters carefully, fix what resurfaces, and see the lighter lessons move briskly around the slow traffic. By Friday evening, both lanes stand cleared for rest.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Study moves at an even, ordinary pace this week, and the classes stay neutral but honest. Effort still counts; it just converts at the regular rate. Keep the timetable tight, cover the assigned pages, and Friday closes the week respectably. Plain weeks like this reward steady discipline over brilliance.",
        "The week offers fair, unremarkable study conditions, helped along by a mild supportive current. Nothing dazzles, nothing blocks. Choose two meaningful topics, give them your honest hours, and by Friday the quiet accumulation shows in cleaner notes and surer answers. Midweek carries the deepest stretch of the syllabus best.",
        "This week asks for patience more than ambition on the study front. The mood stays even, understanding comes slowly, and progress happens in modest steps. Work with the mild current instead of against it, and the days pass cleanly enough. Keep the hardest new chapter for a livelier week.",
        "The week offers a plain study rhythm with few surprises and mild support at the edges. Motivation for revision may lag where enthusiasm usually leads, and that is ordinary. Keep the commitments modest, honour the routine, and let quiet hours do their work. Hours tended quietly now are what bright weeks are built on.",
      ],
      review: [
        "Study moves at an even pace this week, with the retrograde undertone turning a few hours toward revision. Effort still converts at the regular rate, checks included. Keep the timetable tight, re-read the assigned pages, and Friday closes the week respectably. One careful pass is genuinely all that this week asks.",
        "The week offers fair, unremarkable study conditions with a mild revision current underneath. Nothing dazzles, nothing blocks, and older chapters resurface gently. Give them a quiet hour midweek, keep the two main topics moving, and Friday closes without loose ends. Weeks this tidy close their own gaps without any prompting.",
        "This week asks for patience twice: once for its ordinary pace, once for the pages that want re-reading. The mood stays even throughout. Cover the essential topics early, let the revision work fill the gaps, and the week passes without fuss. Re-reading earns more than rushing in weather like this.",
        "The week offers a plain study rhythm while small confusions around notes or dates surface midweek. None of it amounts to much. Slow down slightly, confirm the unclear parts, and see the rest of the week settle around that care. A steady pen and a shorter list handle all the rest.",
      ],
    },
    neutral: {
      none: [
        "The week's academic field sits level and undemanding, with neither help nor hindrance from the wider sky. Momentum rests on your own rhythm. Set a modest study target on Monday, reach it without detours, and let satisfaction be the quiet reward. A target set this way survives the whole week intact.",
        "A neutral but honest study week, the kind that quietly builds sound habits. Nothing bends your way, nothing blocks you either. Keep the sessions realistic, keep the notes current, and let steady hours do their patient work through Friday. Habits built this quietly hold firm through busier terms.",
        "Study holds a steady middle path this week on an even, manageable field. Progress is available at the standard exchange rate of attention for accuracy. Work the timetable as written, close what gaps you can, and the week ends respectably. Midweek holds the best odds for tackling one hard topic.",
        "The academic sky sits level this week, offering a fair field and an honest pace. Nothing dazzles, and nothing interferes either. Decide what a good study week looks like for you, pursue it without drama, and let consistency speak at the close. Steady learning gets built in precisely such plain weeks.",
      ],
      review: [
        "The week's academic field sits level while the retrograde undertone turns some hours toward second looks. Momentum still rests on your rhythm. Set the modest study target, re-check the answers behind it, and let careful pacing carry the week to Friday. Pacing carefully is a genuine skill, and this week exercises it.",
        "A neutral but honest study week, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep the sessions realistic, give the re-reading its share of time, and let steady hours carry gently through Friday. Re-reading handled early costs the rest of the week little.",
        "Study holds a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available and resistance absent. Work the timetable as written, add the checking pass, and the week closes on respectable terms. Answers checked once hold; answers rushed rarely do.",
        "The academic sky sits level this week while a review current tugs older chapters back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent material. Set the modest target, verify as you go, and let tidy accuracy be the reward. A tidy notebook on Friday outshines a flashy Monday.",
      ],
    },
    unfav: {
      none: [
        "An ordinary study week with one slow seam through the formal matters: the deeper current wants procedure and patience. Routine lessons proceed fine; anything official moves at its own rhythm. Respect the pace, keep the paperwork complete, and the week passes cleanly. By Friday the books close without drama of any kind.",
        "The week stays level on the surface while the slower academic channel underneath insists on proper procedure. Improvisation meets friction; preparation meets cooperation. Route the important submissions through the formal door, in the asked shape, and let routine carry the rest. Submissions prepared properly travel at twice the usual speed.",
        "Study holds a workable pace this week with one stiff patch: the examining side wants protocol before personality. Give the form its due. Submit what is asked in the asked order, keep your own tempo on lighter lessons, and the week balances out. None of that stiffness is aimed at you personally.",
        "A plain study week with a demanding patch in the middle of it. The patch belongs to official matters: applications, approvals, and formal submissions. Give that part its full documentation, keep the lighter lessons moving briskly, and Friday settles the account. Documentation finished early keeps the week's record honest throughout.",
      ],
      review: [
        "An ordinary study week with a slow seam through formal matters, and the seam now also asks for re-checking. Routine lessons proceed fine; official items move slowly and return once. Respect both speeds, verify what comes back, and the week stays clean. A single complete return beats any number of hasty ones.",
        "The week stays level on the surface while the slower academic channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience. Use the formal door for what matters, correct the older submissions midweek, and let routine carry on. Submissions corrected early age well in every file.",
        "Study holds a workable pace this week with two quiet disciplines stacked: protocol first, re-checking second. Neither is personal. Submit what is asked in the asked order, verify what returns, and keep your own tempo on the lighter lessons. Both disciplines clear sooner than they first promise to.",
        "A plain study week with a demanding patch in its middle, and this week the patch also returns older submissions for review. Give the returns their corrections promptly, keep the documentation complete, and see the lighter lessons move briskly around the traffic. Friday then finds the notebook complete and calm.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual on studies, yet the supportive current still holds and still helps. The difficulty is pacing, not permanence. Keep the workload light, use the cooperative hours early in the week, and see the weekend restore balance. Help received in heavy weeks deserves generous returning later.",
        "A heavier tone runs through the study days, and chapters may feel denser than their actual size. The helpful part is structural: timetables and routines still work exactly as designed. Do the essentials well, postpone the extras without guilt, and rest easy. Short revisions count double in weeks shaped like this.",
        "The week asks more from your studies than the calendar suggests, though the cooperative current keeps a lane open. Take it: one topic done properly keeps the week from souring. Choose gentleness over force and protect the calm evenings. The lane narrows toward Friday, so walk it midweek.",
        "The week leans demanding on the study front, with deadlines arriving in clusters and focus thinning by midweek. What helps: the routine around you stays reliable when little else does. Keep sessions measured, keep the plan minimal, and see the weekend reset the scale. A steady routine is this week's single dependable gift.",
      ],
      review: [
        "The week presses harder than usual on studies, though the supportive current still holds and helps. Add the retrograde instruction: handle revision items before new plans. Keep the workload light, correct what resurfaces early, and see the weekend close the books gently. The order chosen outweighs the speed managed this week.",
        "A heavier tone runs through the study days while the review current pulls attention toward older chapters. The helpful part is structural: timetables and routines still work as designed, revision included. Do the essentials, fix what returns, and rest easy each evening. Chapters mended properly stay mended, which settles the mind.",
        "The week asks study patience twice: for its own weight, and for the older material returning for a second look. The cooperative current keeps a lane open for exactly this work. Take the lane, revise what returns, and protect the calm evenings. Revision fits that lane better than any new chapter would.",
        "The week leans demanding academically, and part of the weight is older topics knocking for attention at awkward hours. The routine around you stays reliable through it. Meet each knock with a short, honest effort, and keep the evenings genuinely calm. Managed this way, Sunday evening arrives feeling earned rather than lucky.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones on studies, and the field offers little cushion: relief comes only from steady, deliberate habits. The difficulty is pacing, not permanence. Keep the plan minimal, cover the essentials, and see the weekend restore what the days spend. Targets kept modest and fully met win this week.",
        "A demanding study week on plain ground, where nothing extra arrives to help and no fresh trouble interferes either. Chapters feel denser than their size; patience closes the gap. Work in short, honest sessions, rest deliberately, and Friday closes the books fairly. Brief honest sessions outlast long sprints in such weather.",
        "The week asks more than the calendar promises, mostly through small delays and tired attention around study. Nothing here is verdict-shaped; it is weather, and weather passes. Slow the pace deliberately, choose patience over force, and protect one quiet hour on the hardest day. The guarded hour counts as upkeep, not idleness.",
        "The week leans demanding without offering much academic support in return, which makes pacing the whole game. Deadlines cluster, focus thins, and yet the essentials still fit if the plan stays small. Keep sessions measured and see the weekend reset the scale. Small plans carried to the end beat grand ones dropped early.",
      ],
      review: [
        "The week runs heavier than recent ones on studies, and old topics surface for correction inside the weight. The field offers little cushion, so sequence matters: revision first, new material last. Keep the list short, work slowly, and see the weekend absorb the rest. Choosing the order well is this week's entire strategy.",
        "A demanding study week on plain ground, with revision requests arriving at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each request with a short, honest effort, rest deliberately between them, and Friday balances the books. Friday balances the books when every effort stays short and real.",
        "The week asks patience twice over: for its own heaviness, and for the answers that need re-checking before anything settles. Take that as the week's shape instead of a judgment. Work slowly, verify carefully, and rest early on the heavier days. Both kinds of patience show their worth by Sunday evening.",
        "The week leans demanding while a review current tugs older chapters back into the open. Neither needs to fight the other. Accept the slower pace, revise what comes up for review, and leave fresh topics for a clearer week ahead. A properly revised base serves coming weeks better than speed.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides: its own weight, and a study channel that wants form at every step. Neither is personal. Keep everything documented, keep the tone patient, do less but do it properly, and see the weekend restore the difference. Correct form is the only shortcut this week offers.",
        "A heavy study week meets a slow, exacting channel, and chapters feel denser than their real size. The combination favours the patient and the prepared. Cover the essentials in the asked shape, postpone the rest without guilt, and rest early each evening. Early nights are what make the mornings kinder here.",
        "The week asks more than the calendar suggests, while the academic channel checks every step for form and pace. The pair feels heavy but stays manageable. Keep the schedule light, keep the notes immaculate, and protect one genuinely quiet hour daily. Guard the hour as necessary upkeep, not as indulgence.",
        "The week leans demanding while the official channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline the temptation: shortcuts cost double in weather like this. Keep the plan minimal, keep submissions complete, and see the weekend reset the scale. Work complete and slow beats work fast and redone.",
      ],
      review: [
        "The week presses from two sides, and the retrograde undertone adds a third: older items returning for correction. The stack feels heavy but stays orderly. Handle the returns first, keep new plans parked, document everything, and rest early each evening. Orderly weeks of this kind close better than they feel.",
        "A heavy study week meets a slow channel that also asks for re-checking this time. The combination favours the thorough over the quick, decisively. Correct what returns, confirm nothing half-checked, keep the schedule light, and rest early each evening. Being thorough proves the quickest route through this week.",
        "The week asks patience three ways: its own weight, the official channel's pace, and the answers that need re-checking. None of the three is personal. Take them in order, one at a time, keep the notes immaculate, and protect the quiet evenings. Handled in strict order, the week stays manageable throughout.",
        "The week leans demanding while the official channel returns older items for review at its own rhythm. The mismatch tempts shortcuts, and shortcuts cost double here. Meet the returns promptly, keep submissions complete, and leave fresh commitments for a clearer week. Managed this way, next week starts on genuinely clean ground.",
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

export const weeklyEducationRows: BankRow[] = makeRows("weekly.education", "en", cells);
