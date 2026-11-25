/**
 * EN weekly.family bank — Saturn flavour (family shares Saturn with career):
 * structure, duties, elders, household form — fav = home order helps,
 * neutral = household indifferent, unfav = duties and elders ask patience
 * and proper form. Household content only (meals, elders, duties, repairs,
 * routines); challenging cells stay constructive; review = revisiting older
 * domestic threads, never fear. Week-arc texture mirrors daily-family.en.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Household matters flow generously this week: meals come together easily, elders are pleased without effort, and the home feels lighter than its list. Tend the small domestic rituals with patience, settle the pending repair early in the week, and see the weekend carry the household's good mood into Sunday evening.",
        "A warm, orderly week at home: conversations at the table stay kind, plans for the house move forward, and everyone finds their place without friction. Enjoy the harmony, keep the small promises made to family, and by Friday the whole household runs on the ease you tended early.",
        "The home catches the friendly corner of the sky this week, and domestic life reads as simple arithmetic instead of a puzzle. Pending repairs settle, visits go well, and fair words pass easily at the table. Welcome whatever the week brings, and let midweek's calm set the tone for the rest.",
        "The household's weather stays warm and steady all week, with enough calm to make planning pleasant. Small comforts appear where you expected chores, and elders move through their days contentedly. Note the good hours gratefully, share a little of the ease around, and see the weekend keep its own unhurried time.",
      ],
      review: [
        "Household matters flow generously this week, with one retrograde instruction folded in: re-check older arrangements before changing them. Meals and routines run on time, and the verification keeps them that way. Enjoy the calm, revisit one postponed family thread early in the week, and see the weekend settle what remains.",
        "A warm, orderly week at home, though the review current asks for a gentle look at older domestic plans. Conversations stay kind and the house cooperative. Enjoy the harmony, revisit one postponed family matter by Wednesday, and see the ease you have tended carry the correction kindly.",
        "The home catches the friendly corner of the sky this week, and domestic life reads as simple arithmetic. The retrograde layer prefers mending over launching, so let repaired routines lead while new household plans wait. Welcome what arrives on its own, and let midweek do the mending quietly.",
        "The household's weather stays warm, with one modest caveat attached: family plans deserve a second pass this week. Small comforts appear where you expected chores, and elders stay content. Note the good hours gratefully, re-check the arrangements once, and let accurate detail dress the weekend's harmony.",
      ],
    },
    neutral: {
      none: [
        "Domestic form runs strong this week even where the household stays plain: your own steadiness supplies the order. Nothing disrupts the home and nothing elevates it either. Set the week's family priority yourself on Monday, meet it cleanly by midweek, and let quiet order be the reward.",
        "The household runs on your effort this week more than on any passing current, and that suits a steady hand. Meals behave, routines behave, moods behave through Friday. Use the strong form to organise rather than to celebrate, and the week closes with a settled, tidy home.",
        "A confident family week on neutral ground: the sky offers clarity rather than drama at home. Plans about the house and elders move easily because you are thinking straight. Write the arrangements down while they are this clear, and let order pay its quiet dividend by Sunday.",
        "Your sense of the household sharpens this week against a plain background, which is often the best combination. No noise disturbs the home, and no delay hides the small repairs. Use the clean view to set the week's domestic course early, and let calm lead the rest.",
      ],
      review: [
        "Domestic form runs strong this week even on plain ground, with the retrograde layer asking for recounts. Your own steadiness supplies the order. Set the week's family priority, meet it by midweek, and re-check each arrangement once before you call the week's household settled by Friday.",
        "The household runs on your effort this week, and the review current adds a useful habit: revisit older plans before deciding. Meals behave, routines behave, moods behave. Use the steady form to re-read the family arrangements on file, and let re-checking be part of the order itself.",
        "A confident family week on neutral ground, with one exception: the sky prefers revisiting over fresh arrangements. Plans about the house move easily because you are thinking straight. Write the plans down, review them once by midweek, and hold new domestic commitments for a clearer week.",
        "Your sense of the household sharpens this week against a plain background, while the review current pulls gently toward older domestic threads. No noise disturbs the home. Use the clean view for a second pass over recent family matters, and let calm find the small gaps by Friday.",
      ],
    },
    unfav: {
      none: [
        "The week's broader strength reaches your household too, though the deeper current asks for form and patience at home. Family matters favour the documented and the punctual this week. Keep commitments clear, duties scheduled and words gentle, and the strong week still closes with a peaceful house.",
        "Warm energy rides through the week while the domestic channel underneath runs slow and formal. The combination rewards those who keep routines and respect elders' timelines. Let proper form precede the optimism at home, and the week's strength settles into household calm by the weekend.",
        "Your overall form runs high this week, though the family current underneath prefers protocol over enthusiasm. Elders move slowly and discussions stay formal. Do not push against the gate: offer what is asked, in the asked manner, and see the strong week carry the household.",
        "The broad week favours you, while a slower domestic current checks each arrangement for completeness. Treat the checking as protection rather than resistance at home. Move deliberately, keep every family commitment clear through midweek, and the week still closes with peace resting on your side.",
      ],
      review: [
        "The week's broader strength reaches your household, with the deeper current asking for form and the review layer for a second pass. Keep commitments clear, duties scheduled, words gentle, and re-check the older domestic arrangements once. Even a slow home week closes warmly under a strong sky.",
        "Warm energy rides through the week while the domestic channel underneath runs slow, formal, and fond of second looks. The combination rewards those who keep routines and revisit postponed family threads. Give elders' timelines full respect, re-check what returns midweek, and the weekend arrives calm.",
        "Your overall form runs high this week, though the family current underneath prefers protocol, and the retrograde layer prefers correction. Elders move slowly and older household plans resurface. Offer what is asked in the asked manner, re-check what returns, and see the strong week absorb the rest.",
        "The broad week favours you while a slower domestic current checks each arrangement and returns a few older ones. Treat both as protection rather than resistance. Move deliberately, re-check what comes back by midweek, and the week still closes with peace on your side of that door.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "The week's family ground sits level while home order does quiet, useful work. Meals arrive on time, elders stay content, and small repairs hold their place on the list. Keep the domestic rituals steady, tend the routine through midweek, and see the weekend carry the household easily.",
        "Home receives a gentle assist this week, and ordinary household weeks feel warmer for it. Table conversations stay kind, duties divide fairly, and the house hums along. Keep the small promises made to family, walk the routine faithfully, and the week closes on friendly terms.",
        "The household finds its natural rhythm this week, helped along by mild support at the edges. Meals, visits and elders' small requests all move comfortably. Give the routine your normal attention, tidy one neglected corner midweek, and Friday closes a home week with real warmth in it.",
        "Domestic weeks like this one ask little and give steadily back: the home cooperates, elders relax, and repairs go to plan. Ride the mild current rather than testing it. Keep the meals and rituals punctual, schedule the small fixes early, and see the weekend collect the ease.",
      ],
      review: [
        "The week's family ground sits level while home order does quiet, useful work, and the review layer adds one habit: revisit before rearranging. Meals arrive on time, elders stay content. Keep the domestic rituals steady, re-check one older household plan by midweek, and see the weekend carry it.",
        "Home receives a gentle assist this week, with older domestic threads resurfacing for a kind second look. Table conversations stay kind, duties divide fairly, and the house hums. Keep the small promises, give one postponed family matter its revision hour, and the week closes friendly.",
        "The household finds its natural rhythm this week, helped at the edges while older plans ask for a re-read. Meals, visits and elders' small requests move comfortably. Give the routine normal attention, re-check the arrangement that returned, and Friday closes a home week in honest order.",
        "Domestic weeks like this one ask little and give steadily back, with a revision request folded quietly into the middle. The home cooperates, elders relax. Ride the mild current, re-check the plan that resurfaced midweek, and see the weekend collect the ease without new launches.",
      ],
    },
    neutral: {
      none: [
        "The week's household sky sits even, and the home simply follows the routine you set. Nothing elevates family matters and nothing disturbs them. Choose one domestic improvement on Monday, carry it through calmly by Friday without fuss, and let consistency be the week's quiet household reward.",
        "A plain but honest week at home: meals happen, elders are looked after, and the house runs its course without drama. Nothing bends your way and nothing blocks you. Keep the sessions of family time realistic, keep the small duties current, and let steady hours carry Friday home.",
        "Household matters hold a steady middle path this week on an even, manageable field. Progress in family life comes at the usual exchange rate of patience for peace. Work the routine as written, close the small gaps where you find them, and the week ends respectably.",
        "The domestic sky sits level this week, offering a fair field and an honest pace at home. Nothing dazzles, and nothing interferes either. Decide what a good household week looks like for you, pursue it without drama, and let consistency speak for itself by Sunday evening.",
      ],
      review: [
        "The week's household sky sits even while the review layer turns some hours toward second looks. The home follows the routine you set. Choose one domestic improvement on Monday, carry it through calmly, and re-check each family arrangement before Friday calls the week's household settled.",
        "A plain but honest week at home, with revision requests folded quietly into the household hours. Meals happen, elders are looked after, the house runs its course. Keep the family time realistic, give the re-reading its share, and steady hours carry the week home cleanly.",
        "Household matters hold a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available and resistance absent at home. Work the routine as written, add the checking pass midweek, and the week closes on respectful household terms.",
        "The domestic sky sits level this week while a review current tugs older family threads back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent household matters. Set the modest target, verify as you go, and let a tidy home be the reward.",
      ],
    },
    unfav: {
      none: [
        "An ordinary week at home with one slow seam through the domestic matters: the deeper current wants procedure and patience. Routine meals and chores proceed fine; anything formal about the house moves at its own rhythm. Respect the pace, keep the household paperwork complete, and Friday closes calmly.",
        "The week stays level on the surface while the slower home channel underneath insists on proper procedure. Improvisation meets friction at home; preparation meets cooperation. Route the important family arrangements through the formal door, in the asked shape, and see the routine carry the rest of the household week.",
        "Household matters hold a workable pace this week with one stiff patch: the elders' side wants protocol before personality. Give the form its due at home. Submit what is asked in the asked order, keep your own tempo on lighter domestic matters, and the week balances.",
        "A plain home week with a demanding patch in the middle of it. The patch belongs to official household matters: approvals, documents and formal family submissions. Give that part its full documentation early, keep the lighter domestic duties moving briskly, and Friday settles the account.",
      ],
      review: [
        "An ordinary week at home with a slow seam through the formal matters, and the seam also asks for re-checking this week. Routine meals and chores proceed fine; official items move slowly and return once. Respect both speeds, verify what comes back, and Friday stays clean.",
        "The week stays level on the surface while the slower home channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience at home. Use the formal door for what matters, correct the older arrangements midweek, and let routine carry the household.",
        "Household matters hold a workable pace this week with two quiet disciplines stacked: protocol first, re-checking second. Neither is personal, and neither lasts past its hour. Submit what is asked in the asked order, verify what returns, and keep lighter domestic duties moving on tempo.",
        "A plain home week with a demanding patch in its middle, and this week the patch also returns older household submissions for review. Give the returns their corrections promptly, keep the documentation complete, and let lighter duties move briskly around the traffic. Friday finds the house in order.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Household matters move at an even, ordinary pace this week, and the home stays neutral but honest. Effort still counts; it converts at the regular rate. Keep the domestic routine tight, cover the assigned duties, and Friday closes the household week respectably. Plain weeks like this reward steady care over flair.",
        "The week offers fair, unremarkable home conditions, helped along by a mild supportive current. Nothing dazzles the household, nothing blocks it. Choose two meaningful domestic tasks, give them your honest hours, and by Friday the quiet accumulation shows in a tidier home and gentler tempers. Midweek carries the heaviest chores best.",
        "This week asks for patience more than ambition on the home front, and the mood stays even throughout. Understanding at the kitchen table comes slowly, and family progress happens in modest steps. Work with the mild current instead of against it, and the days pass cleanly enough.",
        "The week offers a plain household rhythm with few surprises and mild support at the edges. Motivation for the bigger domestic projects may lag where enthusiasm usually leads, and that is ordinary. Keep the commitments modest, honour the routine, and see the weekend's quiet hours do their work.",
      ],
      review: [
        "Household matters move at an even pace this week, with the retrograde undertone turning a few hours toward revision. Effort still converts at the regular rate, checks included. Keep the domestic routine tight, re-read the assigned duties, and Friday closes the household week respectably. One careful pass is all this week asks.",
        "The week offers fair, unremarkable home conditions with a mild revision current underneath. Nothing dazzles the household, nothing blocks it, and older domestic plans resurface gently. Give them a quiet hour midweek, keep the two main duties moving, and Friday closes without loose ends. Tidy weeks close their own gaps.",
        "This week asks for patience twice on the home front: once for its ordinary pace, once for the arrangements that want re-reading. The mood stays even throughout. Cover the essential duties early, let the revision work fill the gaps, and the week passes without fuss. Re-reading earns more than rushing here.",
        "The week offers a plain household rhythm while small confusions around dates or duties surface midweek. None of it amounts to much at home. Slow down slightly, confirm the unclear parts with the family, and see the rest of the week settle around that care. A steady hand and a shorter list handle the rest.",
      ],
    },
    neutral: {
      none: [
        "The week's domestic field sits level and undemanding, with neither help nor hindrance from the wider sky. Household momentum rests on your own rhythm entirely. Set a modest family target on Monday, reach it without detours, and let satisfaction be the quiet reward. A target set this way survives the week intact.",
        "A neutral but honest week at home, the kind that quietly builds sound household habits. Nothing bends your way at home, nothing blocks you either. Keep the family commitments realistic, keep the small duties current, and let steady hours do their patient work through Friday. Habits built quietly hold through busier times.",
        "Family matters hold a steady middle path this week on an even, manageable field. Domestic progress is available at the standard exchange rate of attention for peace. Work the household routine as written, close what gaps you can, and the week ends respectably. Midweek holds the best odds for one hard conversation.",
        "The domestic sky sits level this week, offering a fair field and an honest pace at home. Nothing dazzles the household, and nothing interferes either. Decide what a good family week looks like for you, pursue it without drama, and let consistency speak at the close. Steady homes get built in plain weeks.",
      ],
      review: [
        "The week's domestic field sits level while the retrograde undertone turns some hours toward second looks. Household momentum still rests on your rhythm. Set the modest family target, re-check the arrangements behind it, and let careful pacing carry the week to Friday. Pacing carefully is a genuine domestic skill, and this week exercises it.",
        "A neutral but honest week at home, with revision requests folded quietly into the household hours. Nothing bends your way and nothing blocks you. Keep the family commitments realistic, give the re-reading its share of time, and let steady hours carry gently through Friday. Re-reading handled early costs the rest of the week little.",
        "Family matters hold a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available at home and resistance absent. Work the household routine as written, add the checking pass, and the week closes on respectable terms. Arrangements checked once hold; rushed ones rarely do.",
        "The domestic sky sits level this week while a review current tugs older family threads back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent household matters. Set the modest target, verify as you go, and let tidy accuracy be the reward. A tidy home on Friday outshines a flashy Monday start.",
      ],
    },
    unfav: {
      none: [
        "An ordinary household week with one slow seam through the formal matters: the deeper current wants procedure and patience. Routine meals and chores proceed fine; anything official about the house moves at its own rhythm. Respect the pace, keep the family paperwork complete, and Friday closes the week without drama.",
        "The week stays level on the surface while the slower domestic channel underneath insists on proper procedure. Improvisation meets friction at home; preparation meets cooperation. Route the important family matters through the formal door, in the asked shape, and let routine carry the rest of the household.",
        "Family matters hold a workable pace this week with one stiff patch: the formal side wants protocol before personality. Give the form its due at home. Submit what is asked in the asked order, keep your own tempo on lighter domestic matters, and the week balances out. None of the stiffness is personal.",
        "A plain household week with a demanding patch in the middle of it. The patch belongs to official family matters: applications, approvals and formal submissions. Give that part its full documentation early, keep the lighter domestic duties moving briskly, and Friday settles the account. Documentation finished early keeps the week's home record honest.",
      ],
      review: [
        "An ordinary household week with a slow seam through formal matters, and the seam also asks for re-checking. Routine meals and chores proceed fine; official items move slowly and return once. Respect both speeds, verify what comes back promptly, and the week stays clean at home.",
        "The week stays level on the surface while the slower domestic channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience. Use the formal door for what matters at home, correct the older family submissions midweek, and let routine carry on. Submissions corrected early age well.",
        "Family matters hold a workable pace this week with two quiet disciplines stacked: protocol first, re-checking second. Neither is personal. Submit what is asked in the asked order, verify what returns, and keep your own tempo on the lighter domestic matters. Both disciplines clear sooner than they first promise.",
        "A plain household week with a demanding patch in its middle, and this week the patch also returns older family submissions for review. Give the returns their corrections promptly, keep the documentation complete, and see the lighter domestic duties move briskly around the traffic. Friday then finds the household file complete and calm.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual at home, yet the supportive current still holds and still helps. The difficulty is pacing, not permanence. Keep the domestic workload light, use the cooperative hours early in the week, and see the weekend restore the household's balance. Help received in heavy weeks deserves generous returning later.",
        "A heavier tone runs through the household days, and chores may feel denser than their actual size. The helpful part is structural: routines and mealtimes still work exactly as designed. Do the essentials well, postpone the extras without guilt, and rest easy each evening. Short sessions of family time count double in weeks shaped like this.",
        "The week asks more from your home life than the calendar suggests, though the cooperative current keeps a lane open. Take it: one household matter handled properly keeps the week from souring. Choose gentleness over force at the kitchen table and protect the calm evenings. The lane narrows toward Friday, so walk it midweek.",
        "The week leans demanding on the family front, with duties arriving in clusters and patience thinning by midweek. What helps: the routine around the house stays reliable when little else does. Keep the asks modest, keep the plan minimal, and see the weekend reset the scale. A steady household routine is this week's dependable gift.",
      ],
      review: [
        "The week presses harder than usual at home, though the supportive current still holds and helps. Add the retrograde instruction: handle revision items before new household plans. Keep the domestic workload light, correct what resurfaces early in the week, and see the weekend close the home ledger gently. The order chosen outweighs the speed managed.",
        "A heavier tone runs through the household days while the review current pulls attention toward older family threads. The helpful part is structural: routines and mealtimes still work as designed, revision included. Do the essentials, fix what returns, and rest easy each evening. Chores mended properly stay mended, which settles the whole house.",
        "The week asks household patience twice: for its own weight, and for the older domestic threads returning for a second look. The cooperative current keeps a lane open for exactly this work. Take the lane, revise what returns, and protect the calm evenings. Revision fits that lane better than any new launch would.",
        "The week leans demanding at home, and part of the weight is older arrangements knocking for attention at awkward hours. The routine around the house stays reliable through it. Meet each knock with a short, honest effort, and keep the evenings genuinely calm. Managed this way, Sunday evening arrives feeling earned rather than lucky.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones at home, and the field offers little cushion: relief comes only from steady, deliberate household habits. The difficulty is pacing, not permanence. Keep the plan minimal, cover the essentials, and see the weekend restore what the days spend. Targets kept modest and fully met win this week.",
        "A demanding household week on plain ground, where nothing extra arrives to help and no fresh trouble interferes either. Chores feel denser than their size; patience closes the gap at home. Work in short, honest sessions, rest deliberately, and Friday closes the books fairly. Brief honest sessions outlast long sprints in such weather.",
        "The week asks more than the calendar promises, mostly through small delays and tired patience around the house. Nothing here is verdict-shaped; it is weather, and weather passes. Slow the pace deliberately, choose gentleness over force at the table, and protect one quiet hour on the heaviest day. The guarded hour counts as upkeep.",
        "The week leans demanding without offering much household support in return, which makes pacing the whole game. Duties cluster, patience thins, and yet the essentials still fit if the plan stays small. Keep the sessions of family time measured and see the weekend reset the scale. Small plans carried to the end beat grand ones dropped.",
      ],
      review: [
        "The week runs heavier than recent ones at home, and older domestic threads surface for correction inside the weight. The field offers little cushion, so sequence matters: revision first, new plans last. Keep the list short, work slowly, and see the weekend absorb the rest. Choosing the order well is this week's entire household strategy.",
        "A demanding household week on plain ground, with revision requests arriving at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each request with a short, honest effort, rest deliberately between them, and Friday balances the home books. Friday balances the books when every effort stays short and real.",
        "The week asks household patience twice over: for its own heaviness, and for the arrangements that need re-checking before anything settles. Take that as the week's shape instead of a judgment. Work slowly, verify carefully, and rest early on the heavier days. Both kinds of patience show their worth by Sunday evening.",
        "The week leans demanding at home while a review current tugs older family arrangements back into the open. Neither needs to fight the other. Accept the slower pace, revise what comes up for review, and leave fresh household plans for a clearer week ahead. A properly revised base serves the coming weeks better than speed.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides at home: its own weight, and a household channel that wants form at every step. Neither is personal. Keep everything documented, keep the tone patient, do less but do it properly, and see the weekend restore the difference. Correct form is the only shortcut this week offers.",
        "A heavy household week meets a slow, exacting channel, and duties feel denser than their real size. The combination favours the patient and the prepared at home. Cover the essentials in the asked shape, postpone the rest without guilt, and rest early each evening. Early nights are what make the mornings kinder here.",
        "The week asks more than the calendar suggests, while the household channel checks every step for form and pace. The pair feels heavy but stays manageable at home. Keep the schedule light, keep the notes immaculate, and protect one genuinely quiet hour daily. Guard the hour as necessary upkeep, not as indulgence.",
        "The week leans demanding while the official household channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline the temptation: shortcuts cost double in home weather like this. Keep the plan minimal, keep submissions complete, and see the weekend reset the scale. Work complete and slow beats work fast and redone.",
      ],
      review: [
        "The week presses from two sides at home, and the retrograde undertone adds a third: older items returning for correction. The stack feels heavy but stays orderly. Handle the returns first, keep new household plans parked, document everything, and rest early each evening. Orderly weeks of this kind close better than they feel.",
        "A heavy household week meets a slow channel that also asks for re-checking this time. The combination favours the thorough over the quick, decisively. Correct what returns, confirm nothing half-checked, keep the schedule light, and rest early each evening. Being thorough proves the quickest route through this week.",
        "The week asks household patience three ways: its own weight, the official channel's pace, and the arrangements that need re-checking. None of the three is personal. Take them in order, one at a time, keep the notes immaculate, and protect the quiet evenings. Handled in strict order, the week stays manageable throughout.",
        "The week leans demanding at home while the official channel returns older household items for review at its own rhythm. The mismatch tempts shortcuts, and shortcuts cost double here. Meet the returns promptly, keep submissions complete, and leave fresh family commitments for a clearer week. Managed this way, next week starts on genuinely clean ground.",
      ],
    },
  },
};

const RETRO = ["none", "review"] as const;

const cells: Array<[string, string[]]> = [];
for (const rating of RATINGS) {
  for (const pb of AREA_PB) {
    for (const retro of RETRO) {
      cells.push([`rating=${rating}.pb=${pb}.retro=${retro}`, TEXTS[rating]![pb]![retro]!]);
    }
  }
}

export const weeklyFamilyRows: BankRow[] = makeRows("weekly.family", "en", cells);
