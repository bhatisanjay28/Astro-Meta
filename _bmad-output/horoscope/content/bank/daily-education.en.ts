/**
 * EN daily.education bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = study aggregate, pb = Mercury's band for this area,
 * retro = review when a Mercury/Jupiter/Saturn retrograde falls in the window).
 * 24 cells × 6 variants, 35–55 words. Mercury flavour: study, focus, revision,
 * clarity — fav = learning flows, neutral = ordinary classes, unfav = distraction
 * asks structure/patience. retro=review is native ground here (revision, old
 * syllabus, second drafts), framed as an advantage, never fear.
 * Mirrors daily-education.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Learning comes easily today, and difficult topics open with less pushing than usual. Focus holds through long stretches, and questions find clear answers. Tackle the hardest chapter in your freshest hour, and watch the sharp day carry the rest.",
        "The study day is bright and orderly: notes make sense, doubts dissolve, and memory holds what it reads. Teachers and mentors respond well today. Ask the question you have been saving, and watch the receptive atmosphere reward the asking.",
        "Clarity marks every study session today, with concepts connecting faster than they did last week. Practice feels productive rather than repetitive. Push slightly beyond the comfortable syllabus, and watch the strong current widen what you can hold.",
        "Concentration runs deep today, helped by a Mercury-friendly backdrop that rewards organised effort. A single well-planned session achieves more than three scattered ones. Plan it properly, protect it from interruptions, and watch the day hand you real mastery.",
        "Your learning instincts are quick today: patterns show themselves, formulas settle in, and revision reads smoother than expected. Use the clarity while it lasts. Cover the topic you have postponed longest, and let momentum do the lifting.",
        "Study flows with an easy rhythm today, and understanding arrives before effort finishes. Tests and revisions go well under this sky. Work through the planned material steadily, note what comes quickly, and bank the confidence for harder days.",
      ],
      review: [
        "Learning comes easily today, and the retrograde layer turns it toward revision rather than new ground. Focus holds through long stretches. Revisit the older chapters while the current runs this smooth, and let each pass sharpen what you already hold.",
        "The study day is bright and orderly, with a retrograde preference for second drafts over first attempts. Doubts dissolve on re-reading. Polish the earlier work today — the essay, the problem set, the notes — and let refinement be the achievement.",
        "Clarity marks every study session today, with old concepts connecting in new ways. Practice feels productive rather than repetitive. Re-test yourself on material learned earlier, and watch the review pass reveal how much has genuinely settled.",
        "Concentration runs deep today, helped by a Mercury-friendly backdrop that rewards organised effort. The review current makes it ideal for checking older answers. Plan one verification session properly, protect it from interruptions, and let accuracy be the day's mastery.",
        "Your learning instincts are quick today, with a gentle pull toward re-reading what you skimmed before. Patterns show themselves on the second pass. Cover the skipped paragraphs and rough margins, and let momentum settle the gaps.",
        "Study flows with an easy rhythm today, and the retrograde layer adds a useful habit: re-test before you trust. Understanding arrives quickly. Work the planned material, then re-attempt the questions that once failed, and watch the contrast build confidence.",
      ],
    },
    neutral: {
      none: [
        "Study form is strong today even on plain ground: your own discipline supplies the progress. Nothing distracts and nothing inspires either. Set the syllabus target yourself, meet it cleanly, and let self-made order be the day's quiet achievement.",
        "The study hours run on your effort today more than on any passing current, and that suits a methodical learner. Classes behave, notes behave, focus behaves. Use the steady form to organise next week's plan while today's work finishes early.",
        "A confident study day on neutral ground: the sky offers clarity rather than inspiration. Concepts are approachable because your mind is settled. Write the summary notes while thinking is this clean, and watch the tidy pages serve the whole month.",
        "Your focus sharpens today against a plain background, which is often the best combination. No noise disturbs the desk, and no delay hides the answers. Use the clean view for the topic that needs unbroken attention, and watch the strong focus lead.",
        "Strong personal discipline carries the study day, with the wider field neither helpful nor hostile. Difficult chapters land well when approached in order. Keep the sessions modest and well-timed, and let your own steadiness be the real teacher.",
        "The day gives plain study ground and unusually good concentration, a pairing worth using deliberately. Nothing dazzles and nothing distracts. Decide what today's one learning task is, complete it precisely, and watch the quiet progress compound into the week.",
      ],
      review: [
        "Study form is strong today even on plain ground, with the retrograde layer asking for recounts. Your own discipline supplies the progress. Finish the syllabus target, then re-check yesterday's answers while focus is this clean.",
        "The study hours run on your effort today, and the review current adds a useful habit: re-read before you move on. Classes behave, focus behaves. Use the steady form to proofread the earlier notes, and let re-checking be part of the order.",
        "A confident study day on neutral ground, with one exception: the sky prefers revising over starting. Concepts are approachable because your mind is settled. Finish the planned pages, then revise the earlier chapter once, and hold new topics for tomorrow.",
        "Your focus sharpens today against a plain background, while the review current pulls gently toward older chapters. No noise disturbs the desk. Use the clean view for a second pass over last week's material, and let strong focus find the small errors.",
        "Strong personal discipline carries the study day, with a retrograde preference folded in: consolidate rather than cover. Difficult chapters land well when re-attempted. Keep the sessions modest, verify the earlier work, and let steadiness be the real teacher.",
        "The day gives plain study ground and unusually good concentration, with revision work woven through the hours. Nothing dazzles and nothing distracts. Pick the topic that most needs a second look, give it today's clean attention, and let progress compound.",
      ],
    },
    unfav: {
      none: [
        "The day's broader strength reaches your studies too, though the deeper current asks for form and patience with learning. Progress favours the documented and the punctual. Keep the timetable firm, the notes complete, and the strong day still works for you.",
        "Warm energy rides through the day while the study channel underneath runs slow and formal. The combination rewards those who keep routines and respect deadlines. Let the schedule precede the enthusiasm, and the strength settles into real, checkable progress.",
        "Your overall form is high, though the study current underneath prefers procedure over inspiration. Approvals move slowly and feedback arrives formally. Do not push against the gate: submit what is asked, in the asked format, and watch the strong day carry it.",
        "The broad day favours you, while a slower academic current checks each submission for completeness. Treat the checking as protection rather than resistance. Move deliberately, keep every assignment documented, and the day still closes with progress on your side.",
        "Strong drive meets a careful academic gate today, and the pairing favours the thorough. Bring applications in the preferred shape, keep the formats exact and the papers complete. Let the formal finish of today speak louder than a faster one would.",
        "The wider day runs bright while the academic lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: exact formats, full records, unhurried submissions. Do that, and the day's brightness still covers your studies.",
      ],
      review: [
        "The day's broader strength reaches your studies, though the academic channel underneath runs slow and formal, re-checking its own trail. Progress favours the documented. Keep the timetable firm, the notes complete, the figures verified, and the strong day still works.",
        "Warm energy rides through the day while the study channel underneath runs slow, formal and revision-minded. The combination rewards routines, deadlines and second passes. Let the schedule precede the enthusiasm, correct what returns, and the strength settles into progress.",
        "Your overall form is high, though the study current underneath prefers procedure and re-examination over inspiration. Feedback arrives slowly and formally. Submit what is asked in the asked format, re-check it before resending, and watch the strong day carry the rest.",
        "The broad day favours you, while the slower academic current checks each submission and asks corrections of older ones. Treat both as protection. Move deliberately, keep every assignment documented, and the day still closes with progress on your side.",
        "Strong drive meets a careful academic gate that is currently reviewing as much as it releases. The pairing favours the thorough. Bring applications in the preferred shape, re-check the returned ones, and watch the formal finish speak louder than speed would.",
        "The wider day runs bright while the academic lane runs slow and re-checks its history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: exact formats, full records, revised drafts. The brightness still covers your studies.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Studies keep a friendly, workable rhythm today. Classes cooperate, notes behave, and small doubts resolve themselves. Keep the study plan honest without overloading it, and watch the steady current hand its quiet progress to the week.",
        "The academic day offers solid ground without surprises, which suits steady learners well. Routine study lands well, small exercises finish on time, and nothing demands heroics. Lean in gently and let ordinary discipline do the compounding.",
        "Today's study weather is fair and mild, with a supportive current under ordinary classes. Your reliability as a student reads clearly to the right teachers. Keep the promises made about homework, and let consistency earn its quiet credit.",
        "Learning proceeds smoothly today, helped by a patient and well-disposed backdrop. The timetable behaves, doubt sessions stay useful, and small questions meet quick answers. Steady attention now earns more than one all-night sprint would manage.",
        "A pleasant, orderly rhythm settles over your study day. The distractions that usually slow sessions stay quiet. Do the next small right thing, and watch the day's quiet goodwill attach itself to the notebook and stay through tomorrow's revision.",
        "Your studies enjoy a calm, cooperative day with doors opening at a natural pace. The teacher on the far side of that doubt seems receptive rather than rushed. Raise the small pending question today and watch the mood help it along.",
      ],
      review: [
        "Studies keep a friendly rhythm today, with the review current adding one instruction: verify before you trust the answer. Classes cooperate and notes behave. Keep the plan honest, re-check the solved sums, and watch the steady current carry progress onward.",
        "The academic day offers solid ground without surprises, while a revision-minded undertone asks for a second pass on older chapters. Routine study still lands well. Lean in gently, re-attempt the earlier exercise set, and let discipline do the compounding.",
        "Today's study weather is fair, with a supportive current under ordinary classes and a gentle call to revisit recent topics. Your reliability reads clearly to the right teachers. Keep the homework promises, and treat each re-check as quiet progress.",
        "Learning proceeds smoothly today, helped by a patient backdrop and a retrograde preference for corrections over new topics. The timetable behaves and doubt sessions stay useful. Keep attention steady, confirm the steps others missed, and let accuracy do the earning.",
        "A pleasant, orderly rhythm settles over your study day, with revision work folded quietly into the hours. The distractions stay quiet. Do the next small right thing, and give the older chapter its scheduled second look.",
        "Your studies enjoy a calm, cooperative day with doors opening at a natural pace, and one gentle call to review. The teacher across the doubt seems receptive. Raise the small pending question, verify the answer once, and watch the mood help along.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary study day with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the load, and the syllabus pays out quietly and on time.",
        "The classes stay level and professional today, neither inspiring nor difficult. Your careful study habits carry their usual weight, and the notes match your effort. Do the plainly visible learning task and watch the evenness be the day's quiet advantage.",
        "Studies hold a steady middle path today, with cooperation available and resistance absent. Nothing needs brilliance, and nothing rewards drift either. Work the timetable as written, close the small open doubts, and watch the day end respectably.",
        "The study day runs at ordinary pace on an even, manageable field. Progress is available at the standard rate of exchange: attention for understanding. Choose the topics with clear outcomes, handle them properly, and finish with a balanced page count.",
        "A neutral but honest academic day, the kind that quietly builds a learner's reputation. Nothing bends your way, nothing blocks you either. Keep the commitments realistic, keep the notes punctual, and let steady habits do their patient compounding.",
        "The academic sky sits level today, offering a fair field and an honest pace. Momentum depends mostly on your own rhythm. Set a modest study target for the day, reach it without shortcuts, and watch the satisfaction be its small reward.",
      ],
      review: [
        "A fair, ordinary study day, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, re-checks included. Keep the standards high, confirm the solved answers twice, and the syllabus closes quietly on time.",
        "The classes stay level and professional today, neither inspiring nor difficult, while older topics resurface for review. Your careful study habits carry their usual weight. Answer the resurfaced doubts first, then move to the main list, and watch the evenness hold.",
        "Studies hold a steady middle path today, with one addition from the sky: re-check before you conclude. Cooperation is available and resistance absent. Work the timetable as written, add the second pass, and watch the day end respectably.",
        "The study day runs at ordinary pace on an even field, while a review current tugs at older threads. Progress still comes at the standard rate of exchange. Honour the revision first, choose topics with clear outcomes, and finish with a balanced page count.",
        "A neutral but honest academic day, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep commitments realistic, give the re-checks their share of time, and let steady habits do their patient compounding.",
        "The academic sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent topics. Momentum rests on your rhythm. Set a modest target, revise as you go, and let tidy accuracy be the day's reward.",
      ],
    },
    unfav: {
      none: [
        "A workable study day with one demanding seam through it: the deeper current wants structure and patience. Ordinary classes go fine; formal submissions move slowly. Keep the tone diligent, keep the formats correct, and watch the plain discipline shine.",
        "The academic day stays fair on the surface while the slower channel underneath asks for proper procedure. Haste meets friction today; method meets cooperation. Choose the structured route for anything that counts, and let routine study set the tone.",
        "Studies hold a decent pace today with a single stiff knot: whoever evaluates the work prefers format over flair right now. Respect the preference rather than fighting it. Submit what is asked in the asked form, and the rest of today flows normally.",
        "A fair study day with a slow lane through the middle of it. The slow lane belongs to anything formal — applications, approvals, fee counters. Route those carefully and unhurriedly, and keep the lighter study moving briskly around them.",
        "The day gives ordinary academic ground with one strict patch in it. The strict patch rewards preparation and penalises carelessness. Prepare the important submission fully before entering it, keep casual shortcuts away from it, and the day passes cleanly.",
        "A steady, usable academic day with a demanding undercurrent around official matters. The undercurrent is not hostile, just slow and precise. Give the slow part its full documentation, keep your own study tempo on the rest, and close the day respectably.",
      ],
      review: [
        "A workable study day with a demanding seam through it: the deeper current wants structure, patience, and re-checking. Ordinary classes go fine; formal submissions move slowly. Keep formats correct, verify what returns, and watch the plain discipline shine.",
        "The academic day stays fair on the surface while the slower channel underneath asks for procedure and revision. Haste meets friction today; method meets patience. Choose the structured route for anything that counts, and correct older submissions without complaint.",
        "Studies hold a decent pace today with a stiff knot: whoever evaluates prefers format, and the sky prefers revisiting over launching. Both point the same way — careful, formal, unhurried. Submit what is asked in the asked form and watch the rest flow.",
        "A fair study day with a slow lane through its middle, and today the lane also returns older items for correction. The lane belongs to formal matters — applications, approvals, institutional counters. Route those carefully, fix what resurfaces, and keep lighter study moving.",
        "The day gives ordinary academic ground with one strict patch, and the patch currently reviews as much as it approves. Prepare submissions fully, re-read the returned ones, keep casual shortcuts away from formal channels, and the day passes cleanly.",
        "A steady, usable academic day with a demanding undercurrent around official matters, now also marked by review. The undercurrent is not hostile, just slow and precise. Give the slow part full documentation and verified details, keep your tempo elsewhere, and close respectably.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Studies stay on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands brilliance, and nothing blocks the flow either. Keep the plan simple, tend the scheduled sessions, and let ordinary hours add up.",
        "The academic day is uneventful in the best sense, with support available when you reach for it. Progress comes at working pace, not sprint pace. Small, scheduled sessions suit the syllabus better than any ambitious cram.",
        "Your study life hums along at a moderate pitch today, helped by decent conditions underneath. Doubts are real but solvable, and teachers are present but unhurried. Divide the syllabus into blocks and let each block carry its share.",
        "Learning neither leaps nor stalls today, and the underlying current is quietly on your side. Use the steadiness to repair rather than race ahead. Tidy the rough notes, clear the small doubts, and call it a fine day's study.",
        "The day holds steady for study matters, with mild favours available to those who ask early. Progress is possible, just not spectacular. Focus on completion over ambition, and watch the week inherit a tidy syllabus.",
        "Sessions move at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up at the desk. Keep the targets modest, keep the notes immaculate, and watch the quiet goodwill accrue.",
      ],
      review: [
        "Studies stay on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for revision over new chapters. Keep the plan simple, and spend the spare hour checking older notes.",
        "The academic day is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Tend the scheduled sessions, and give one recent topic a calm second pass.",
        "Your study life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours verifying the answers you assumed earlier. Divide the syllabus into blocks, and give one block entirely to quiet revision.",
        "Learning neither leaps nor stalls today, and the underlying current leans helpful. The retrograde undertone makes it a revision kind of day. Tidy the rough notes, re-read the passages read in haste, and let accuracy be today's contribution.",
        "The day holds steady for study matters, with mild favours for early askers. A revision-friendly atmosphere hangs over the second half. Focus on completing and correcting what exists, and watch the brand-new chapters wait for clearer skies.",
        "Sessions move at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward double-checking answers. Keep the targets modest and the notes immaculate before anything travels onward to the teacher.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest study day with level conditions throughout and no special favours in play. The sessions are ordinary and the outcomes ordinary too. Handle them well anyway, because plain days handled well are what real understanding quietly grows from.",
        "The study day runs at its most neutral setting: fair, flat, and manageable. Nothing invites ambition and nothing threatens it either. Keep the timetable mechanical, execute without improvising, and bank the saved attention for a livelier study day.",
        "Learning sits in a level patch today where effort and understanding hold a fair exchange. The sky offers neither pushback nor applause. Choose measurable topics, complete them cleanly, and watch the neutrality protect the plan from noise.",
        "The study day moves evenly, with attention best spent on maintenance rather than expansion. Notes, revisions, pending doubts — the unglamorous layer that supports everything. Tend that layer today, and the livelier days ahead inherit solid ground.",
        "A steady, unremarkable academic day in which pace matters more than ambition. The hours respond to whoever keeps rhythm with them. Work in clean blocks, rest between blocks, and watch the day's modest progress stand on its own merits.",
        "The day offers study conditions as plain as a clear sky: nothing to chase, nothing to dodge. Use it for the work that needs no inspiration at all. Organise, revise, finish, and watch the simplicity itself be the day's achievement.",
      ],
      review: [
        "A plain, honest study day with level conditions and a retrograde preference for re-examination. The sessions are ordinary and the outcomes ordinary too. Handle them well, add the second pass, because plain days handled carefully build understanding.",
        "The study day runs at its most neutral setting: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites ambition and nothing threatens it. Keep the timetable mechanical, re-check what you touch, and bank the saved attention.",
        "Learning sits in a level patch today where effort and understanding hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose measurable topics, complete them cleanly, and watch the revision notes be the day's extra credit.",
        "The study day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. Notes, revisions, older drafts awaiting a second look. Tend that layer, and the livelier days inherit solid ground.",
        "A steady, unremarkable academic day in which pace matters more than ambition, and accuracy more than pace. The hours respond to whoever keeps rhythm. Work in clean blocks, re-read each block's key points once, and let modest exactness stand.",
        "The day offers study conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to chase, nothing to dodge. Review the recent trail of topics, tidy it, and let simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level study day with a slow, formal current underneath the ordinary sessions. Nothing collapses and nothing breaks through either. Meet the current with steady patience and paperwork: complete formats, gentle persistence, punctual follow-ups. It respects whoever respects its pace.",
        "The academic day runs neutral on the surface and stiff underneath, especially around official channels. Approvals move slowly and answers arrive formally. Keep expectations plain, prepare before approaching the counter, and watch the routine study define the day.",
        "Studies hold an even, unhurried line today with one patch of resistance in it. The patch sits wherever approvals and revaluations live. Walk around it rather than through it: study what is free to move, and leave the gated items for a friendlier hour.",
        "The study day moves at working pace with a demanding undertone around structure and procedure. The undertone is honest: it rewards completeness and slows shortcuts. Give it completeness, skip the shortcuts, and the ordinary day passes with dignity intact.",
        "A flat but fair academic day, with friction concentrated where institutions live. Teachers stay easy; the formal layer does not. Save warmth for the people and precision for the paperwork, and the day closes without any real damage done.",
        "Sessions proceed ordinarily today while the administrative layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: document properly, wait properly, follow up politely. The rest of today rewards whoever keeps that discipline.",
      ],
      review: [
        "A level study day with a slow, formal current underneath, and that current also wants older submissions re-checked. Nothing collapses and nothing breaks through. Meet it with steady patience and paperwork: complete formats, gentle persistence, verified details.",
        "The academic day runs neutral on the surface and stiff underneath, especially around official channels, with revision requests folded in. Approvals move slowly and answers arrive formally. Keep expectations plain, correct what returns, and let routine study define the day.",
        "Studies hold an even, unhurried line today with one patch of resistance where revaluations live, and the patch currently reviews as much as it approves. Walk around rather than through: study the free-moving material, re-check the gated items, and wait well.",
        "The study day moves at working pace with a demanding undertone around procedure, and today the undertone also audits. It rewards completeness and slows shortcuts. Give it completeness, correct what it flags, and the ordinary day passes with dignity intact.",
        "A flat but fair academic day, with friction concentrated where institutions live and a review mood layered over it. Teachers stay easy; the formal layer does not. Save warmth for people, precision for paperwork, corrections for returned items, and close cleanly.",
        "Sessions proceed ordinarily today while the administrative layer beneath moves slowly, deliberately, and with an eye on older records. Nothing about the slowness is personal. Match it: document properly, correct properly, follow up politely, and let discipline carry the rest.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "Studies ask for patience today, even though the deeper current is quietly supportive. The surface feels heavy, and progress comes in increments rather than leaps. Choose the smallest important topic, learn it well, and let that be enough.",
        "The academic day leans demanding, though the ground beneath is kinder than it looks. Frustration is possible if you measure today by yesterday's pace. Move through the syllabus gently, and protect one piece of genuinely solid learning.",
        "Study pressures press a little harder today, while support waits underneath for those who ask. Not every hour feels productive today, and that is acceptable. Aim for steady contact with the books instead of a breakthrough.",
        "Learning feels like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about pacing. Keep the sessions small, and finish your day with one topic settled and properly understood.",
        "The day tests your study composure more than your ability, even with a supportive undertone below. Under the heaviness, patience and repetition still earn their reward. Revise in writing, keep the portions modest, and let time do its share.",
        "Study duties feel heavier than their actual weight today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule the breaks deliberately, and watch the driest chapter have your freshest hour.",
      ],
      review: [
        "Studies ask for patience today, even with a quietly supportive current underneath. The heaviness on the surface is real, and part of it is older portions resurfacing. Choose re-checking over new chapters, and let accuracy be today's win.",
        "The academic day leans demanding, though the ground beneath is kinder than it looks. Old question papers and old notes resurface for calm revision. Correct them without ceremony, accept the slower tempo, and treat the cleanup as today's progress.",
        "Study pressures press a little harder today, while support waits underneath for those who ask. The retrograde mood turns attention toward unfinished older topics. Close one lingering small doubt, accept the modest total, and consider the day honestly spent.",
        "Learning feels like wading today where yesterday was walking, and the slowdown is partly revision rather than only resistance. Keep the sessions small, spend the quiet hour verifying what you learned, and watch the day close with one loop tied.",
        "The day tests your study composure more than your ability today, with an undertone of revisiting old chapters. Patience and repetition still earn their reward beneath the surface. Revise carefully in writing, and double-check before any answer is final.",
        "Study duties feel heavier than their weight today, and older notes knock for attention. The friendly undertone rewards gentle persistence and careful re-reading. Schedule the breaks, refresh the oldest chapter, and watch the day settle quietly.",
      ],
    },
    neutral: {
      none: [
        "A demanding study day with no particular villain in it, just slow understanding and tired attention. The academic ground neither helps nor harms. Keep the scope small, keep the effort steady, and watch the plain routine see the syllabus through.",
        "The academic day moves under a heavier sky today, with delays arriving without explanation. Nothing in the difficulty needs diagnosing; it passes with the day. Study the essential portions, defer the ambitious plans, and guard the evening's rest.",
        "Study matters carry a muted, effortful tone today, where each topic asks twice the usual push. The sky is testing endurance, not ability. Work in short honest bursts, rest between them, and treat a modest page count as a complete day.",
        "A heavy-handed day around study, where small topics arrive with big friction attached. The wise response is smaller portions and slower reading. Keep sessions brief and focused, master one meaningful page, and watch the rest of today breathe.",
        "The academic day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower. Lower the target to whatever is essential, hold your patience visibly, and watch the evening restore balance.",
        "Today's study atmosphere asks for endurance dressed as calm. Pages crawl, doubts loop, and energy thins by mid-afternoon. Keep the plan minimal, keep the posture upright, and give the driest chapter your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding study day with no particular villain in it, just slow understanding, tired attention, and older work asking to be revised. The ground neither helps nor harms. Keep the scope small, handle the review items first, and let routine set the tone.",
        "The academic day moves under a heavier sky, with delays and returned submissions arriving without ceremony. Nothing in the difficulty needs diagnosing; it passes with the day. Correct what returns, defer the ambitious plans, and guard the evening's rest.",
        "Study matters carry a muted, effortful tone today, where each topic asks twice the usual push, and revision sits at the top of the pile. The sky is testing endurance, not ability. Begin with the revision, work in short bursts, and rest after.",
        "A heavy-handed day around study, where small topics arrive with big friction and old answers with correction notes attached. The wise response is smaller portions and careful fixes. Keep sessions brief, settle one clean correction, and watch the day breathe.",
        "The academic day runs thick and slow, with a backward pull toward half-finished older topics. Nothing is wrong exactly; everything is slower and half of it needs a second pass. Lower the target, close one revision item, and let evening restore balance.",
        "Today's study atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every step. Pages crawl, doubts loop, and figures resurface. Keep the plan minimal, verify as you go, and give the driest chapter your kindest attention.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on studies, with slow understanding and thin patience on both sides. The wise posture is small, precise and unbothered. Master the one required topic properly, step back from the rest, and watch tomorrow carry fresh air.",
        "A stiff, demanding academic day where classes respond slowly and focus runs short. Pushing harder today achieves less than waiting well. Keep the portions formal and minimal, write notes where possible, and protect the evening from carry-over fatigue.",
        "Study matters sit in today's shadow, with feedback slow and classes stiff. The day is testing posture more than ability. Stand steady: attend the basics punctually, avoid the overwhelming portions, and let a quiet finish be the victory.",
        "The academic day presents friction in layers today — slow feedback, short attention, sticky topics. None of the layers need solving at once. Peel only the top one, keep the effort level, and save the deeper revision for a lighter day.",
        "A slow, heavy academic day in which effort meets evaluation that refuses to hurry. Fighting the pace costs more than it returns. Work within its lines, keep the portions small and fully understood, and let patience be today's study skill.",
        "Today the study world seems to move in syrup while you move in air, and the mismatch wears on the spirit. Accept the pace without argument. Learn what learns easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on studies, with slow understanding, thin patience, and older answers resurfacing for correction. The wise posture is small, precise and unbothered. Master the required topic, correct one returned answer, and let tomorrow carry fresh air.",
        "A stiff, demanding academic day where classes respond slowly and returned work asks for fixes. Pushing harder today achieves less than correcting well. Keep the portions formal and minimal, fix what comes back, and protect the evening from carry-over fatigue.",
        "Study matters sit in today's shadow, with feedback slow, classes stiff, and a review mood on top. The day is testing posture more than ability. Stand steady: attend the basics punctually, correct what returns, and let a quiet finish be enough.",
        "The academic day presents friction in layers today — slow feedback, short attention, returned drafts. None of the layers need solving at once. Peel only the top one, correct it cleanly, keep the effort level, and save deeper revision for a lighter day.",
        "A slow, heavy academic day in which effort meets unhurried evaluation, and the evaluation is also auditing its recent history. Fighting either costs more than it returns. Work within its lines, correct what it flags, and let patience be today's study skill.",
        "Today the study world seems to move in syrup, with a backward current pulling attention to older chapters. Accept the pace without argument. Learn what learns easily, revise one resurfaced topic properly, and close the day gently.",
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

export const dailyEducationRows: BankRow[] = makeRows("daily.education", "en", cells);
