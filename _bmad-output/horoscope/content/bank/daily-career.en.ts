/**
 * EN daily.career bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = career aggregate, pb = Saturn's band for this area,
 * retro = review when a Mercury/Jupiter/Saturn retrograde falls in the window).
 * 24 cells × 6 variants, 35–55 words. Saturn flavour: structure, process,
 * formality — fav = structure helps, neutral = structure indifferent, unfav =
 * structure asks form/patience. Challenging cells stay constructive; review =
 * revision framing, never fear. Mirrors daily-career.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Career momentum is real today, and the structure around you holds firm while you push forward. Meetings and deadlines bend your way more than usual. Say yes to the visible task and watch the steady current do half the work.",
        "Work moves with a rare ease today, as if the usual friction was oiled overnight. Seniors notice effort without you pointing at it. A fine day to advance the project that matters most while conditions quietly cooperate.",
        "Today rewards the professional who acts, and the ground beneath your plans is unusually solid. Colleagues lean cooperative, and approvals arrive faster than expected. Use the ease to finish something substantial rather than starting three things at once.",
        "This is one day when career effort converts cleanly into visible progress. The heavier duties sit lighter on your shoulders than they did yesterday. Move the important file forward and watch the momentum carry the smaller tasks along.",
        "Your professional standing brightens today, helped by an accommodating current you did not create but can ride all the same. Deals, reviews and sign-offs fall into place with little resistance. A fine day to be seen doing your best work.",
        "The workday opens with promise and keeps its word as the hours pass. Structure favours you, so long tasks feel shorter and hard conversations go smoother. Put your energy where the results compound, and watch the rest follow on its own.",
      ],
      review: [
        "Career momentum is strong today, and the structure around you rewards steady movement. Even so, the sky asks for a review before a launch. Advance the visible task, but double-check the details before anything goes out the door.",
        "Work flows with unusual ease today, and senior support feels close at hand. The retrograde undertone turns part of today toward checking old ground. Ride the momentum, and give yesterday's decisions one careful second look.",
        "Today favours the professional who acts, and approvals arrive faster than expected. The review current suggests revising before sending rather than pushing something brand new. Polish the existing draft and let its quality speak for the day.",
        "Career effort converts cleanly into progress today, with duties sitting lighter than usual. Underneath the ease, a quieter current invites you to verify rather than invent. Finish the important file, then walk through it once more with fresh eyes.",
        "Your standing brightens today, helped by an accommodating current you can ride. The atmosphere rewards both progress and patience with detail. Advance what is ready, and treat any unfinished older task as today's quiet opportunity.",
        "The workday opens with promise and holds it as the hours pass. Structure favours you, while the day's second half leans toward review and revision. Move the main project forward, and schedule the audit for the same sitting.",
      ],
    },
    neutral: {
      none: [
        "The day's momentum comes from your steady effort more than from the surroundings, and that is the good kind of momentum. Nothing blocks you; nothing carries you either. Claim the win by showing up sharply and finishing what you begin.",
        "Career runs on a bright charge today even though the background stays unremarkable. Your own clarity supplies the drive. Pick the task with the highest visible return, give it your sharpest hours, and let ordinary conditions witness a strong result.",
        "Excellent form meets plain conditions today, which suits self-starters perfectly. Support exists but waits to be asked for. Take the lead on the conversation you have been circling, and let your initiative draw the help out of the woodwork.",
        "The day hands you rhythm rather than favours, and your pace needs no instruction. Momentum builds task by task as the hours pass. Keep the direction simple and steady, and the day closes visibly ahead of where it began.",
        "Your working spirit is the strongest transit in today's sky. Conditions sit neutral, neither pushing nor pulling, which leaves the field open. Set the tempo early, protect the first two hours from interruption, and the rest of today follows your lead.",
        "A strong professional day built on plain ground, the kind experienced people quietly prefer. Nothing dazzles, but nothing interferes either. Decide what winning today looks like, pursue it without detours, and watch the consistency speak for itself at close of day.",
      ],
      review: [
        "Today's momentum comes from your steady effort, and the retrograde undertone asks that effort to include verification. Nothing blocks the path. Push the main work forward and re-read the recent material before presenting it as final.",
        "Career runs on a bright charge today even though the background stays plain. The review current adds one discipline: confirm before you commit. Set your own tempo, finish the big task, and walk through its details once with care.",
        "Excellent form meets plain conditions today, which suits self-starters, with one addition: the sky prefers revision over novelty. Take the lead on the task at hand, and fold a careful audit of yesterday's work into the same effort.",
        "The day hands you rhythm rather than favours, and pace is enough. Part of today leans backward toward checking older ground. Build your momentum on the main line, and treat the review work as a second, quieter win.",
        "Your working spirit is the strongest transit in today's sky, with a retrograde nudge underneath. Conditions neither push nor pull, so the field stays open. Set the tempo early, and give the re-checking its own reserved hour rather than squeezing it.",
        "A strong professional day on plain ground, with revision work woven through it. Nothing dazzles, nothing interferes, and nothing escapes a careful second read. Decide the day's target, reach it, and watch the final pass be unhurried and thorough.",
      ],
    },
    unfav: {
      none: [
        "The day brings strong overall form, though the deeper professional current runs slow and demanding. Tasks want more formality and less improvisation. Respect the slow channel: keep commitments formal, keep the tone patient, and the strong day still lands on your side.",
        "Excellent energy rides through the day; one structural knot sits underneath: the slower planet asks for protocol today. Give the process its due — approvals in order, names spelled right, chains followed. The day rewards the formal route over the clever one.",
        "Your form is high today even where authority feels stiff and unrewarding. Do not push against the rigid gate; work with it. Submit what the structure asks for, exactly as it asks, and spend the saved goodwill on your own agenda.",
        "The day's broad tone favours you, while a slower professional current checks each step for form. Treat the checking as free quality control rather than resistance. Move deliberately, keep the paperwork immaculate, and the day still reads as a win.",
        "Strong drive meets a demanding professional gate today. The combination favours the patient and well-prepared. Bring your best work in the structure's preferred shape, avoid shortcuts entirely, and watch the formal finish of today speak louder than speed would have.",
        "The wider day runs bright while your professional lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: proper titles, complete files, unhurried tone. Do that, and the day's brightness still covers your main goal.",
      ],
      review: [
        "The day brings strong overall form, though the professional channel underneath runs slow and formal. Review work moves better than new work in that channel. Respect the pace, re-check rather than re-apply, and the strong day still ends on your side.",
        "Excellent energy rides through the day; two disciplines stack beneath it: protocol first, revision second. Give the process its due and re-read what the structure returns. The day rewards formality done twice over the shortcut done once.",
        "Your form is high even where authority feels stiff, and part of that stiffness is a call for re-examination. Submit what the gate asks for, then verify your own file before anyone else does. Preparation carries the day.",
        "The broad tone favours you while the slower professional current checks each step for form, and today it also asks for corrections of older items. Accept both checks gracefully. Move deliberately, fix what resurfaces, and the day still reads as a win.",
        "Strong drive meets a demanding professional gate, with revision requests woven into the demands. The combination favours the patient and the thorough. Bring the work in the preferred shape, correct what is flagged, and watch the formal finish speak for you.",
        "The wider day runs bright while your professional lane runs slow and re-checks its own history. Give the lane its ceremony and its corrections: complete files, verified names, updated drafts. Do that, and the day's brightness still covers your goal.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Career moves at a friendly, workable pace today, and the structures around you behave. Steady effort lands where it should, without drama or delay. A fine day to lean into the routine tasks that quietly build reputation.",
        "The workday offers solid ground and no surprises, which suits careful professionals well. Colleagues cooperate, and small approvals come without chasing. Lean in steadily and let ordinary diligence do the persuasive work on your behalf.",
        "Today's career weather is fair and mild, with a supportive current under ordinary tasks. Your reliability reads clearly to the people who matter. Keep the promises you made at work and let consistency earn today's quiet credit.",
        "Work proceeds smoothly today, helped by a patient and well-disposed atmosphere. The task list behaves, difficult conversations stay civil, and small requests meet quick answers. Steady attention now earns more than one flashy gesture would manage.",
        "A pleasant, productive rhythm settles over your professional duties today. The structures that usually slow you down move in step with you. Do the next right thing and watch the day's goodwill quietly multiply it.",
        "Your career enjoys a calm and cooperative day, with doors opening at a natural pace. Supervisors seem receptive rather than distracted. Bring up the small request you have been saving and watch the mood help it along.",
      ],
      review: [
        "Career moves at a friendly pace today, with structures behaving and cooperation easy. The review current adds one instruction: verify before you finalise. Keep the steady rhythm, and re-read the documents before they leave your desk.",
        "The workday offers solid ground without surprises, which suits careful professionals. Underneath, a revision-friendly current asks for a second pass on older work. Keep the steady rhythm, and give the pending report one more proofread.",
        "Today's career weather is fair, with a supportive current beneath ordinary tasks. The sky also nudges you toward revisiting recent decisions. Continue as planned, and treat any recheck as progress instead of a delay in disguise.",
        "Work proceeds smoothly today, helped by a patient and well-disposed atmosphere around the office. The day's quieter instruction is to confirm details others may have missed. Stay the course, and quietly become the person who catches the errors.",
        "A pleasant, productive rhythm settles over your duties today. The retrograde mood favours tidying loose ends over opening brand-new fronts. Finish what is in flight, and put the new idea on paper for later this week.",
        "Your career enjoys a calm, cooperative day with doors opening at a natural pace. Alongside the ease comes a gentle call to review. Accept the small delay of a double-check and keep the goodwill flowing.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary working day with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the stakes, and the day pays out quietly and on time.",
        "The workday stays level and professional, neither generous nor difficult. Your competence carries its usual weight, and colleagues match your tone. Do the work that is plainly in front of you and watch the evenness be today's quiet advantage.",
        "Career holds a steady middle path today, with cooperation available and resistance absent. Nothing needs heroics, and nothing rewards drift either. Work the plan as written, close the open loops you can, and the day ends respectably.",
        "The day runs at ordinary professional pace on an even, manageable field. Progress is available at the standard rate of exchange: effort for progress. Choose the tasks with visible outcomes, do them properly, and finish your day with a clean desk.",
        "A neutral but honest working day, the kind that quietly builds a professional reputation. Nothing bends your way, nothing blocks you either. Keep the commitments realistic, keep the delivery punctual, and let steady hours do their patient compounding.",
        "The professional sky sits level today, offering a fair field and an honest pace. Momentum depends mostly on your own rhythm. Set a modest target for the day, reach it without shortcuts, and let satisfaction be its own small reward.",
      ],
      review: [
        "A fair, ordinary working day, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, re-checks included. Keep the standards high, confirm the details twice, and the day pays out quietly and on time.",
        "The workday stays level and professional, neither generous nor difficult, while older tasks resurface for review. Your competence carries its usual weight. Answer the resurfaced items first, then move to the main list, and watch the evenness hold.",
        "Career holds a steady middle path today, with one addition from the sky: re-read before you send. Cooperation is available and resistance absent. Work the plan as written, add the second pass, and the day ends respectably.",
        "The day runs at ordinary professional pace on an even field, while a review current tugs older threads. Progress still comes at the standard rate of exchange. Honour the review work first, choose main tasks with visible outcomes, and finish with a clean desk.",
        "A neutral but honest working day, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep commitments realistic, give the re-checks their share of time, and let steady hours do their patient compounding.",
        "The professional sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent work. Momentum rests on your rhythm. Set a modest target, verify as you go, and let tidy accuracy be the day's reward.",
      ],
    },
    unfav: {
      none: [
        "A workable day with one demanding seam running through the professional matters: the deeper current wants form and patience. Ordinary tasks go fine; formal requests move slowly. Keep the tone respectful, keep the paperwork complete, and watch the plain work shine.",
        "The workday stays fair on the surface while the slower channel underneath asks for proper procedure. Improvisation meets friction today; process meets cooperation. Choose the formal route for anything that matters, and watch the routine work set the tone's total.",
        "Career holds a decent pace today with a single stiff knot: authority figures prefer protocol over charm. Respect the preference rather than fighting it. Submit what is asked in the asked form, and the rest of today flows normally.",
        "A fair working day with a slow lane through the middle of it. The slow lane belongs to anything formal — approvals, submissions, senior conversations. Route those carefully and unhurriedly, and keep the lighter tasks moving briskly around them.",
        "The day gives ordinary professional ground with one strict patch in it. The strict patch rewards preparation and punishes haste. Prepare the important request fully before entering it, keep small talk away from formal channels, and the day passes cleanly.",
        "A steady, usable workday with a demanding undercurrent around senior matters. The undercurrent is not hostile, just slow and precise. Give the slow part its full documentation, keep your own tempo on the rest, and close the day respectably.",
      ],
      review: [
        "A workable day with a demanding seam through professional matters: the deeper current wants form, patience, and re-checking. Ordinary tasks go fine; formal requests move slowly. Keep paperwork complete, verify what returns, and watch the plain work shine.",
        "The workday stays fair on the surface while the slower channel underneath asks for procedure and revision. Improvisation meets friction today; process meets patience. Choose the formal route for anything that matters, and correct older items without complaint.",
        "Career holds a decent pace today with a stiff knot: authority prefers protocol, and the sky prefers revisiting over launching. Both point the same way — careful, formal, unhurried. Submit what is asked in the asked form and watch the rest flow.",
        "A fair working day with a slow lane through its middle, and today the lane also returns older items for correction. The lane belongs to formal matters — approvals, submissions, senior conversations. Route those carefully, fix what resurfaces, and let lighter tasks move briskly.",
        "The day gives ordinary professional ground with one strict patch, and the strict patch currently reviews as much as it approves. Prepare requests fully, re-read the returned ones, keep small talk away from formal channels, and the day passes cleanly.",
        "A steady, usable workday with a demanding undercurrent around senior matters, now also marked by review. The undercurrent is not hostile, just slow and precise. Give the slow part full documentation and verified details, keep your own tempo elsewhere, and close respectably.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Career stays on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands heroics, and nothing blocks the path either. Keep the plan simple, finish the scheduled work, and let ordinary hours add up.",
        "The workday is uneventful in the best sense, with support available when you reach for it. Progress comes at working pace, not sprint pace. Small, scheduled steps suit the day better than any ambitious overhaul.",
        "Your professional life hums along at a moderate pitch today, helped by decent conditions underneath. Deadlines are real but movable, and colleagues are present but busy. Divide the day into blocks and let each block carry its share.",
        "Career neither leaps nor stalls today, and the underlying current is quietly on your side. Use the neutrality to repair rather than expand. Tidy the workflow, clear the backlog, and call it a fine day's work.",
        "The day holds steady for work, with mild favours available to those who ask early. Progress is possible, just not spectacular. Focus on completion over innovation today, and watch the rest of the week inherit a tidy desk.",
        "Work moves at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up. Keep the commitments modest, keep the follow-through immaculate, and watch the quiet goodwill accrue.",
      ],
      review: [
        "Career stays on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for revision over new launches. Keep the plan simple, and spend the spare hour checking older work.",
        "The workday is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Finish the scheduled tasks, and give a recent decision a calm audit.",
        "Your professional life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours verifying the details you assumed earlier. Divide the day into blocks, and give one block entirely to quiet review work.",
        "Career neither leaps nor stalls today, and the underlying current leans helpful. The retrograde undertone makes it a re-reading kind of day. Tidy the workflow, re-read the things you sent in haste, and let accuracy be today's contribution.",
        "The day holds steady for work, with mild favours for early askers. A revision-friendly atmosphere hangs over the second half. Focus on completing and correcting what exists, and watch the brand-new ideas wait for clearer skies.",
        "Work moves at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward double-checking numbers. Keep the commitments modest and the spreadsheets immaculate before anything travels onward to the team.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest working day with level conditions throughout and no special favours in play. The tasks are ordinary and the rewards ordinary too. Do them well anyway, because plain days done well are what reputations are quietly built from.",
        "The workday runs at its most neutral setting: fair, flat, and manageable. Nothing invites ambition and nothing threatens it either. Keep the plan mechanical, execute without improvising, and bank the saved energy for a day with more movement.",
        "Career sits in a level patch today where effort and outcome hold a fair exchange. The sky offers neither pushback nor applause. Choose measurable tasks, complete them cleanly, and watch the neutrality protect you from unnecessary noise.",
        "The professional day moves evenly, with attention best spent on maintenance rather than expansion. Systems, files, follow-ups — the unglamorous layer that supports everything. Tend that layer today, and the flashier days ahead inherit solid ground to build on.",
        "A steady, unremarkable professional day in which pace matters more than ambition. The hours respond to whoever keeps rhythm with them. Work in clean blocks, rest between blocks, and watch the day's modest output stand on its own merits.",
        "The day offers career conditions as plain as a clear sky: nothing to fight, nothing to chase. Use it for the work that needs no weather at all. Organise, document, finish, and watch the simplicity itself be the day's achievement.",
      ],
      review: [
        "A plain, honest working day with level conditions and a retrograde preference for re-examination. The tasks are ordinary and the rewards ordinary too. Do them well, add the second pass, because plain days done carefully are reputations in the making.",
        "The workday runs at its most neutral setting: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites ambition and nothing threatens it. Keep the plan mechanical, re-check what you touch, and bank the saved energy for later.",
        "Career sits in a level patch today where effort and outcome hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose measurable tasks, complete them cleanly, and watch the audit notes be the day's extra credit.",
        "The professional day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. Files, follow-ups, older drafts awaiting a second look. Tend that layer today, and the flashier days inherit solid ground.",
        "A steady, unremarkable professional day in which pace matters more than ambition, and accuracy more than pace. The hours respond to whoever keeps rhythm. Work in clean blocks, re-read each block's output once, and let modest exactness stand on its merits.",
        "The day offers career conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to fight, nothing to chase. Review the recent trail, tidy it, and watch the simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level working day with a slow, formal current underneath the ordinary tasks. Nothing collapses and nothing breaks through either. Meet the current with steady patience and paperwork: complete forms, gentle tone, punctual submissions. The day respects whoever respects its pace.",
        "The workday runs neutral on the surface and stiff underneath, especially around senior channels. Requests move slowly and answers arrive formally. Keep expectations plain, prepare before approaching authority, and watch the routine work define the day instead.",
        "Career holds an even, unhurried line today with one patch of resistance in it. The patch sits wherever approvals and permissions live. Walk around it rather than through it: handle what is free to move, and leave the gated items for a friendlier hour.",
        "The day moves at working pace with a demanding undertone around structure and authority. The undertone is honest: it rewards completeness and slows shortcuts. Give it completeness, skip the shortcuts, and the ordinary day passes with quiet dignity intact.",
        "A flat but fair professional day, with friction concentrated where hierarchies live. Colleagues stay easy; the formal layer does not. Save charm for peers and precision for the formal layer, and the day closes without any real damage done.",
        "Work proceeds ordinarily today while the structural layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: document properly, wait properly, follow up politely. The rest of today rewards whoever keeps that discipline.",
      ],
      review: [
        "A level working day with a slow, formal current underneath, and that current also wants older items re-checked. Nothing collapses and nothing breaks through. Meet it with steady patience and paperwork: complete forms, gentle tone, verified submissions. It respects whoever respects its pace.",
        "The workday runs neutral on the surface and stiff underneath, especially around senior channels, with revision requests folded in. Requests move slowly and answers arrive formally. Keep expectations plain, correct what returns, and watch the routine work define the day.",
        "Career holds an even, unhurried line today with one patch of resistance where approvals live, and the patch currently reviews as much as it approves. Walk around rather than through: handle the free-moving work, re-check the gated items, and wait well.",
        "The day moves at working pace with a demanding undertone around structure, and today the undertone also audits. It rewards completeness and slows shortcuts. Give it completeness, correct what it flags, and the ordinary day passes with dignity intact.",
        "A flat but fair professional day, with friction concentrated where hierarchies live and a review mood layered over it. Colleagues stay easy; the formal layer does not. Save charm for peers, precision for paperwork, corrections for returned items, and close the day cleanly.",
        "Work proceeds ordinarily today while the structural layer beneath moves slowly, deliberately, and with an eye on older work. Nothing about the slowness is personal. Match it: document properly, correct properly, follow up politely, and let discipline carry the rest.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "Career asks for patience today, even though the deeper current is quietly supportive. The surface feels heavy, and progress comes in increments rather than leaps. Choose the smallest important task, do it well, and let that be enough.",
        "The workday leans demanding, though the ground beneath is kinder than it looks. Frustration is possible if you measure today by yesterday's speed. Pace the duties gently, and protect one piece of genuinely good work.",
        "Professional pressures press a little harder today, while support waits underneath for those who ask. Not every hour feels productive today, and that is acceptable. Aim for steady contact with the work instead of a breakthrough.",
        "Career feels like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about pacing. Keep the commitments small, and finish your day with one thing quietly completed and properly closed.",
        "The day tests your professional composure more than your competence, even with a supportive undertone below. Under the heaviness, courtesy and slowness still earn their reward. Answer in writing, keep the scope tight, and let time do its share.",
        "Work duties feel heavier than their actual weight today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule breaks deliberately, and watch the hardest task have your freshest hour.",
      ],
      review: [
        "Career asks for patience today, even with a quietly supportive current underneath. The heaviness on the surface is real, and part of it is review work resurfacing. Choose re-checking over launching, and let accuracy be today's win.",
        "The workday leans demanding, though the ground beneath is kinder than it looks. Old drafts and old mistakes resurface for calm revision. Correct them without ceremony, accept the slower tempo, and treat the cleanup as today's real progress.",
        "Professional pressures press a little harder today, while support waits underneath for those who ask. The retrograde mood turns attention toward unfinished older business. Close one lingering loop properly, accept the modest total, and consider the day honestly spent.",
        "Career feels like wading today where yesterday was walking, and the slowdown is partly review rather than only resistance. Keep the commitments small, spend the quiet hour verifying what you sent, and watch the day close with one loop tied.",
        "The day tests your composure more than your competence today, with an undertone of revisiting old ground. Courtesy and slowness still earn their reward beneath the surface. Reply carefully in writing, and double-check before any commitment goes out.",
        "Work duties feel heavier than their weight today, and old tasks knock for attention. The friendly undertone rewards gentle persistence and careful re-reading. Schedule the breaks, refresh the oldest draft, and watch the day settle quietly.",
      ],
    },
    neutral: {
      none: [
        "A demanding day with no particular villain in it, just slow attention and tired edges. The professional ground neither helps nor harms. Keep the scope small, keep the tone steady, and watch the plain routine see you through to evening.",
        "The workday moves under a heavier sky today, with delays arriving without explanation. Nothing in the difficulty needs diagnosing; it passes with the day. Do the essential tasks, defer the ambitious ones, and guard your evening rest.",
        "Career carries a muted, effortful tone today, where each task asks twice the usual push. The sky is testing endurance, not worth. Work in short honest bursts, rest between them, and treat a modest output as a complete day.",
        "A heavy-handed day at work, where small tasks arrive with big friction attached. The wise response is smaller commitments and slower speech. Keep interactions brief and courteous, finish one meaningful item, and watch the rest of today breathe.",
        "The professional day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower. Lower the target to whatever is essential, hold your patience visibly, and watch the evening restore you.",
        "Today's career atmosphere asks for endurance dressed as calm. Approvals crawl, conversations loop, and energy thins by mid-afternoon. Keep the plan minimal, keep the posture upright, and give the hardest hour your kindest voice rather than your sharpest.",
      ],
      review: [
        "A demanding day with no particular villain in it, just slow attention, tired edges, and older work asking to be reviewed. The ground neither helps nor harms. Keep the scope small, handle the review items first, and watch the routine see you through.",
        "The workday moves under a heavier sky, with delays and returned drafts arriving without ceremony. Nothing in the difficulty needs diagnosing; it passes with the day. Correct what returns, defer the ambitious plans, and guard the evening rest.",
        "Career carries a muted, effortful tone today, where each task asks twice the usual push, and revision work sits at the top of the pile. The sky is testing endurance, not worth. Begin with the review item, work in short bursts, and rest properly after.",
        "A heavy-handed day at work, where small tasks arrive with big friction and old files with correction notes attached. The wise response is smaller commitments and careful fixes. Keep interactions brief, finish one clean correction, and watch the day breathe.",
        "The professional day runs thick and slow, with a backward pull toward half-finished older matters. Nothing is wrong exactly; everything is slower and half of it needs a second pass. Lower the target, close one review item, and watch the evening restore you.",
        "Today's career atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every step. Approvals crawl, conversations loop, and details resurface. Keep the plan minimal, verify as you go, and give the hardest hour your kindest voice.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on professional matters, with slow structures and thin patience on both sides. The wise posture is small, precise and unbothered. Handle the one required task properly, step back from the rest, and watch tomorrow carry fresh air.",
        "A stiff, demanding workday where formal channels respond slowly and moods run short. Pushing harder today achieves less than waiting well. Keep commitments formal and minimal, speak in writing where possible, and protect your evening from carry-over worry.",
        "Career matters sit in today's shadow, with approvals slow and conversations stiff. The day is testing posture more than ability. Stand steady: deliver the basics punctually, avoid the sensitive topics, and let a quiet finish be the victory.",
        "The workday presents friction in layers today — slow approvals, short tempers, sticky logistics. None of the layers need solving at once. Peel only the top one, keep the tone level, and save the deeper repairs for a lighter day.",
        "A slow, heavy professional day in which effort meets structure that refuses to hurry. Fighting the structure costs more than it returns. Work within its lines, keep the requests small and fully documented, and let patience be today's professional skill.",
        "Today the working world seems to move in syrup while you move in air, and the mismatch wears on the spirit. Accept the pace without argument. Complete what completes easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on professional matters, with slow structures, thin patience, and older items resurfacing for correction. The wise posture is small, precise and unbothered. Handle the required task, correct one returned item, and let tomorrow carry fresh air.",
        "A stiff, demanding workday where formal channels respond slowly and returned work asks for fixes. Pushing harder today achieves less than correcting well. Keep commitments formal and minimal, fix what comes back, and protect the evening from carry-over worry.",
        "Career matters sit in today's shadow, with approvals slow, conversations stiff, and a review mood on top. The day is testing posture more than ability. Stand steady: deliver the basics punctually, correct what returns, and let a quiet finish be enough.",
        "The workday presents friction in layers today — slow approvals, short tempers, returned drafts. None of the layers need solving at once. Peel only the top one, correct it cleanly, keep the tone level, and save deeper repairs for a lighter day.",
        "A slow, heavy professional day in which effort meets unhurried structure, and the structure is also auditing its recent history. Fighting either costs more than it returns. Work within its lines, correct what it flags, and let patience be today's professional skill.",
        "Today the working world seems to move in syrup, with a backward current pulling attention to older files. Accept the pace without argument. Complete what completes easily, review one resurfaced item properly, and close the day gently.",
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

export const dailyCareerRows: BankRow[] = makeRows("daily.career", "en", cells);
