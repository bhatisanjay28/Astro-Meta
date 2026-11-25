/**
 * EN weekly.health bank — Moon flavour: energy, meals, sleep, movement,
 * rest and balance. fav = vitality flows, neutral = the body indifferent,
 * unfav = routine asks order and patience, chandrashtama = the Moon's soft
 * tide asking gentleness (rest/routine/balance only — style §5: no
 * diagnosis, no fear; the gentlest reading available). review = re-reading
 * the week's habits. Week-arc texture mirrors daily-health.en.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB_HEALTH, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Energy runs bright all week and the body cooperates: movement feels light, appetite stays steady, and sleep through the week leaves real reserves. Use the vitality well. Take the exercise you enjoy on three separate days, keep meals regular and warm, and see the weekend end with genuine ease.",
        "Vitality holds high through the week, and the body asks for good use of it rather than restlessness. A brisk walk, a proper meal, and an early bedtime each multiply the others across the days. Ride the strong energy from Monday through Friday, and allow balance be its keeper by Sunday.",
        "The body feels capable all week: posture lifts, breath comes easy, and the small aches of busy days fade by midweek. The sky rewards those who build on such mornings. Stretch properly before the week's activity, eat light and warm, and carry this energy gently into the weekend.",
        "Physical rhythm stays strong across the week, with recovery working quietly on your side. Whatever rest you gave yourself recently pays visible interest from Monday onward. Spend the surplus on movement and sunlight early in the week, keep meals regular throughout, and let Friday end with real ease in the body.",
      ],
      review: [
        "Energy runs bright all week, and the retrograde layer adds one instruction: re-check the routine before revising it. Movement feels light and appetite steady. Enjoy the vitality, review which of the week's habits have actually been, and adjust gently rather than drastically before the weekend closes.",
        "Vitality holds high through the week, while the review current favours refinement over new regimens. A brisk walk, a proper meal, and an early bedtime still set the tone. Ride the strong energy across the days, re-read the timetables you follow, and allow small corrections compound by Friday.",
        "The body feels capable all week, and the retrograde layer turns attention toward older habits worth revisiting. Breath comes easy and posture lifts. Re-attempt the routine that once worked well, keep meals light and warm through the week, and see the good current restore it by the weekend.",
        "Physical rhythm stays strong across the week, with recovery working quietly on your side and a gentle call to re-examine the week's rest. The surplus shows early. Spend it on movement and sunlight, re-check the sleep schedule honestly by midweek, and let Friday end in ease.",
      ],
    },
    neutral: {
      none: [
        "Vitality stays genuinely good all week even on plain ground: your own routine supplies the strength. Nothing drains the body and nothing lifts it either. Set the week's healthy acts yourself — the walks, the proper meals, the earlier lights-out — and let each one count double by Friday.",
        "The body runs on your habits this week more than on any passing current, and that suits a steady keeper. Sleep, meals, and movement all behave through Friday. Use the good form to organise rather than to celebrate, and the week closes with real ease across the household.",
        "A confident week for the body on neutral ground: the sky offers steadiness rather than surplus. Energy stays reliable because the routine is. Write down what worked across the week while judgement is clear, and see the record serve the coming days with quiet authority.",
        "Your physical sense sharpens this week against a plain background, which is often the best combination. No noise disturbs the body's signals, and no rush hides them. Use the clean view to notice what truly helps across the days, and let that habit grow through the weekend.",
      ],
      review: [
        "Vitality stays genuinely good all week even on plain ground, with the retrograde layer asking for recounts. Your own routine supplies the strength. Set the week's healthy acts, meet them, and re-check the week's sleep record once before calling the pattern final by Sunday evening.",
        "The body runs on your habits this week, and the review current adds a useful instruction: verify before you trust the routine. Sleep, meals, and movement behave through Friday. Use the good form to re-read the week's pattern, and let re-checking be part of the order itself.",
        "A confident week for the body on neutral ground, with one exception: the sky prefers revising over starting. Energy stays reliable because the routine is. Write down what worked, review it once by midweek, and hold new regimens for a clearer week ahead of you.",
        "Your physical sense sharpens this week against a plain background, while the review current pulls gently toward older habits. No noise disturbs the body's signals. Use the clean view for a second pass over the week's routines, and let clear noticing find the small drifts by Friday.",
      ],
    },
    unfav: {
      none: [
        "The week's broader strength reaches your body too, though the deeper current asks for form and patience with health. Energy favours the regular and the punctual this week. Keep meals on time, sleep defended, movement moderate, and the strong week still serves the body well by Friday.",
        "Bright energy rides through the week while the body's channel underneath runs slow and formal. The combination rewards those who keep routines and respect limits. Let the steady schedule precede the enthusiasm across the days, and the week's strength settles into lasting good form by the weekend.",
        "Your overall form runs high this week, though the physical current underneath prefers protocol over push. Recovery moves slowly and the body asks for order. Do not push against the gate: eat on schedule, rest on schedule, and see the strong week carry the body gently forward.",
        "The broad week favours you while a slower physical current checks each habit for completeness. Treat the checking as protection rather than resistance for the body. Move deliberately, keep every meal and bedtime regular through midweek, and the week still closes with steadiness on your side.",
      ],
      review: [
        "The week's broader strength reaches your body, with the deeper current asking for form and the review layer for a second pass. Keep meals punctual, sleep defended, and re-check the older routines once each. Even a slow physical week closes warmly under a strong sky.",
        "Bright energy rides through the week while the body's channel underneath runs slow, formal, and fond of second looks. The combination rewards those who keep routines and revisit postponed rest. Give the body's timetable full respect, re-check what returns midweek, and the weekend arrives calm.",
        "Your overall form runs high this week, though the physical current prefers protocol, and the retrograde layer prefers correction. Recovery moves slowly and older routines resurface. Eat on schedule, rest on schedule, re-check what returns, and see the strong week absorb the remaining care by Friday.",
        "The broad week favours you while a slower physical current checks each habit and returns a few older routines. Treat both as protection rather than resistance. Move deliberately, re-check what comes back by midweek, and the week still closes with steadiness on your side of that ledger.",
      ],
    },
    chandrashtama: {
      none: [
        "The week's bright energy holds, but the Moon's quiet tide beneath it asks for gentler pacing all week. Feelings sit closer to the surface from Monday to Friday. Keep the strength for essentials, add earlier rest and softer evenings, and see the tide pass easily by Sunday.",
        "Energy remains good across the week, with one gentle exception: the Moon's tide makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness through the days. Speak slowly, eat warm, rest a little earlier each evening, and see the tide seek its own quiet by Friday.",
        "The week stays bright on the surface while the Moon's band underneath asks for quiet company and simple food. Sensitivity runs a notch higher through the week. Honour it without drama: warm meals, calm corners, and unhurried evenings restore the balance quickly, well before the weekend arrives.",
        "A strong week overall, tempered by the lunar tide that turns the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the schedule light on noise and heavy on comfort through midweek, and see the tide move through by the weekend.",
      ],
      review: [
        "The week's bright energy holds while the Moon's quiet tide asks for gentler pacing, and the review layer adds one habit: re-read the week's rest honestly. Feelings sit closer to the surface. Keep strength for essentials, soften the evenings, and re-check the sleep pattern gently by Friday.",
        "Energy remains good across the week with the Moon's tide making emotions nearer, and the review current suggesting a second look at older habits. Nothing needs alarm, only gentleness. Speak slowly, re-check the meal timings once, rest a little earlier, and see the tide settle by Friday.",
        "The week stays bright on the surface while the Moon's band asks for quiet company, and older routines knock for a kind re-read. Sensitivity runs higher through the days. Honour both gently: warm meals, calm corners, one honest habit review midweek, and the balance restores quickly.",
        "A strong week overall, tempered under the Moon's inward tide and a review call toward the week's patterns. Treat the inward turn as rest, not trouble. Keep the schedule light on noise, heavy on comfort, and re-check the sleep notes by midweek. The tide moves through by Sunday.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "The week's physical ground sits level while good order does quiet, useful work. Energy arrives on time, appetite stays cooperative, and sleep keeps its rhythm through Friday. Keep the simple habits steady, take the daily walk without negotiation, and see the weekend collect the ease.",
        "The body receives a gentle assist this week, and ordinary days feel lighter for it. Movement comes willingly, meals sit well, and rest runs deep at night. Keep the portions modest and the timings punctual, walk the routine faithfully, and the week closes on friendly terms with the body.",
        "The body finds its natural rhythm this week, helped along by mild support at the edges. Energy, meals and sleep all move comfortably through the days. Give the routine your normal attention, add one unhurried stretch midweek, and Friday closes a physical week with real steadiness in it.",
        "Physical weeks like this one ask little and give steadily back: energy cooperates, sleep deepens, and movement goes to plan. Ride the mild current rather than testing it. Keep the meals warm and punctual, schedule the morning walks early, and see the weekend collect the ease.",
      ],
      review: [
        "The week's physical ground sits level while good order does quiet, useful work, and the review layer adds one habit: revisit before rearranging. Energy arrives on time, appetite cooperates. Keep the simple habits steady, re-check one older routine by midweek, and see the weekend carry it.",
        "The body receives a gentle assist this week, with older routines resurfacing for a kind second look. Movement comes willingly, meals sit well, and rest runs deep. Keep the portions modest, give one postponed habit its revision hour, and the week closes friendly with the body.",
        "The body finds its natural rhythm this week, helped at the edges while older habits ask for a re-read. Energy, meals and sleep move comfortably through the days. Give the routine normal attention, re-check the pattern that returned, and Friday closes a physical week in honest order.",
        "Physical weeks like this one ask little and give steadily back, with a revision request folded quietly into the middle. Energy cooperates, sleep deepens. Ride the mild current, re-check the habit that resurfaced midweek, and see the weekend collect the ease without any new regimens.",
      ],
    },
    neutral: {
      none: [
        "The week's physical sky sits even, and the body simply follows the routine you set. Nothing lifts the energy and nothing drains it. Choose one healthful improvement on Monday — the earlier bedtime, the longer walk — carry it through calmly by Friday, and let consistency be the reward.",
        "A plain but honest week for the body: meals happen on time, sleep stays adequate, and movement keeps its place in the days. Nothing bends your way and nothing blocks you. Keep the sessions of exercise realistic, keep the meals simple, and let steady hours carry Friday home.",
        "Physical matters hold a steady middle path this week on an even, manageable field. Progress in energy comes at the usual exchange rate of rest for stamina. Work the routine as written, close the small gaps where you find them, and the week ends respectably.",
        "The body's sky sits level this week, offering a fair field and an honest pace. Nothing dazzles the energy, and nothing interferes either. Decide what a good physical week looks like for you, pursue it without drama, and let consistency speak for itself by Sunday evening.",
      ],
      review: [
        "The week's physical sky sits even while the review layer turns some hours toward second looks. The body follows the routine you set. Choose one healthful improvement on Monday, carry it through calmly by Friday, and re-check the week's sleep record before calling the pattern settled.",
        "A plain but honest week for the body, with revision requests folded quietly into the days. Meals happen on time, sleep stays adequate, movement keeps its place. Keep the exercise sessions realistic, give the re-reading its share, and steady hours carry the week home cleanly.",
        "Physical matters hold a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available and resistance absent in the body. Work the routine as written, add the checking pass midweek, and the week closes on respectful terms.",
        "The body's sky sits level this week while a review current tugs older routines back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent habits. Set the modest target, verify as you go, and let a well-kept routine be the week's reward.",
      ],
    },
    unfav: {
      none: [
        "An ordinary physical week with one slow seam through the deeper matters: the current wants procedure and patience. Routine meals and walks proceed fine; the body's slower processes move at their own pace. Respect the pace, keep the timings regular, and Friday closes the week calmly.",
        "The week stays level on the surface while the slower channel underneath insists on proper procedure. Improvisation meets friction in the body; preparation meets cooperation. Keep the meals punctual, the sleep defended, and the movement moderate, and let routine carry the rest of the week.",
        "Physical matters hold a workable pace this week with one stiff patch: the body wants protocol before personality, order before ambition. Give the form its due. Eat on the asked schedule, rest on the asked schedule, keep your own tempo on lighter activity, and the week balances.",
        "A plain physical week with a demanding patch in the middle of it. The patch belongs to the body's slower processes: recovery, rest and routine. Give that part its full patience early in the week, keep the lighter movement moving briskly, and Friday settles the account.",
      ],
      review: [
        "An ordinary physical week with a slow seam through the deeper matters, and the seam also asks for re-checking this week. Routine meals and walks proceed fine; the slower processes return once for review. Respect both speeds, verify the routine you keep, and Friday stays clean.",
        "The week stays level on the surface while the slower channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience in the body. Keep the meals punctual, correct the older habits midweek, and let routine carry the rest of the household's week.",
        "Physical matters hold a workable pace this week with two quiet disciplines stacked: protocol first, re-checking second. Neither is personal, and neither lasts past its hour. Eat on the asked schedule, verify the routine that returns, and keep the lighter movement moving on its tempo.",
        "A plain physical week with a demanding patch in its middle, and this week the patch also returns older routines for review. Give the returns their corrections promptly, keep the timings complete, and let lighter activity move briskly around the traffic. Friday finds the body in honest order.",
      ],
    },
    chandrashtama: {
      none: [
        "The week's physical ground sits level while the Moon's quiet tide beneath it asks for gentler pacing. Feelings sit closer to the surface through the days. Keep the good order for essentials, add earlier rest and softer evenings, and see the tide pass easily by the weekend.",
        "The body receives its gentle assist this week with one exception: the Moon's tide makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness. Keep the walks and warm meals punctual, rest a little earlier each evening, and see the tide seek its own quiet by Friday.",
        "The body finds its natural rhythm this week while the Moon's band underneath asks for quiet company and simple food. Sensitivity runs a notch higher through the days. Honour it without drama: warm meals, calm corners, unhurried evenings, and the balance restores quickly, well before the weekend.",
        "A workable week overall, tempered by the lunar tide that turns the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the schedule light on noise and heavy on comfort through midweek, and see the tide move through by the weekend.",
      ],
      review: [
        "The week's physical ground sits level while the Moon's quiet tide asks for gentler pacing, and the review layer adds one habit: re-read the week's rest honestly. Feelings sit closer to the surface. Keep the good order, soften the evenings, and re-check the sleep pattern gently by Friday.",
        "The body receives its gentle assist this week while the review current suggests a second look at older habits, with the Moon's tide making emotions nearer. Nothing needs alarm, only gentleness. Re-check the meal timings once, keep the walks punctual, and see the tide settle by Friday.",
        "The body finds its natural rhythm this week while the Moon's band asks for quiet company, and older routines knock for a kind re-read. Sensitivity runs higher through the days. Honour both gently: warm meals, calm corners, one honest habit review midweek, and the balance restores quickly.",
        "A workable week overall, tempered under the Moon's inward tide and a review call toward the week's patterns. Treat the inward turn as rest, not trouble. Keep the schedule light on noise, heavy on comfort, and re-check the sleep notes by midweek. The tide moves through by Sunday.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Physical matters move at an even, ordinary pace this week, and the body stays neutral but honest. Effort still counts; it converts at the regular rate. Keep the routine tight, cover the planned walks and meals, and Friday closes the physical week respectably. Plain weeks reward steady care over flair.",
        "The week offers fair, unremarkable conditions for the body, helped along by a mild supportive current. Nothing dazzles the energy, nothing blocks it. Choose two meaningful habits, give them your honest hours, and by Friday the quiet accumulation shows in steadier sleep and easier mornings. Midweek carries the longest walks best.",
        "This week asks for patience more than ambition on the physical front, and the body's mood stays even. Understanding between effort and energy comes slowly, and progress happens in modest steps. Work with the mild current instead of against it, and the days pass cleanly enough for the body.",
        "The week offers a plain physical rhythm with few surprises and mild support at the edges. Motivation for the longer walks may lag where enthusiasm usually leads, and that is ordinary. Keep the commitments modest, honour the meal timings, and see the weekend's quiet hours do their work.",
      ],
      review: [
        "Physical matters move at an even pace this week, with the retrograde undertone turning a few hours toward revision. Effort still converts at the regular rate, checks included. Keep the routine tight, re-read the week's sleep and meal notes, and Friday closes the physical week respectably. One careful pass is all it asks.",
        "The week offers fair, unremarkable conditions for the body with a mild revision current underneath. Nothing dazzles the energy, nothing blocks it, and older routines resurface gently. Give them a quiet hour midweek, keep the two main habits moving, and Friday closes without loose ends. Tidy weeks close their own gaps.",
        "This week asks for patience twice on the physical front: once for its ordinary pace, once for the habits that want re-reading. The body's mood stays even throughout. Cover the essential routines early, let the revision work fill the gaps, and the week passes without fuss. Re-reading earns more than rushing here.",
        "The week offers a plain physical rhythm while small confusions around timings surface midweek. None of it amounts to much in the body. Slow down slightly, confirm the unclear parts of the routine, and see the rest of the week settle around that care. A steady hand and a shorter list handle the rest.",
      ],
    },
    neutral: {
      none: [
        "The week's physical field sits level and undemanding, with neither help nor hindrance from the wider sky. The body's momentum rests on your own rhythm entirely. Set a modest health target on Monday, reach it without detours, and let satisfaction be the quiet reward. A target set this way survives the week intact.",
        "A neutral but honest week for the body, the kind that quietly builds sound habits. Nothing bends your way physically, nothing blocks you either. Keep the exercise commitments realistic, keep the meals current and simple, and let steady hours do their patient work through Friday. Habits built quietly hold through busier times.",
        "Physical matters hold a steady middle path this week on an even, manageable field. Progress is available at the standard exchange rate of attention for energy. Work the routine as written, close what gaps you can, and the week ends respectably. Midweek holds the best odds for the longest walk.",
        "The body's sky sits level this week, offering a fair field and an honest pace. Nothing dazzles, and nothing interferes either. Decide what a good physical week looks like for you, pursue it without drama, and let consistency speak at the close. Steady strength gets built in plain weeks.",
      ],
      review: [
        "The week's physical field sits level while the retrograde undertone turns some hours toward second looks. The body's momentum still rests on your rhythm. Set the modest health target, re-check the habits behind it, and let careful pacing carry the week to Friday. Pacing carefully is a genuine physical skill, and this week exercises it.",
        "A neutral but honest week for the body, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep the exercise commitments realistic, give the re-reading its share of time, and let steady hours carry gently through Friday. Re-reading handled early costs the rest of the week little.",
        "Physical matters hold a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available and resistance absent in the body. Work the routine as written, add the checking pass, and the week closes on respectable terms. Habits checked once hold; rushed ones rarely do.",
        "The body's sky sits level this week while a review current tugs older routines back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent habits. Set the modest target, verify as you go, and let tidy accuracy be the reward. A tidy routine on Friday outshines a flashy Monday start.",
      ],
    },
    unfav: {
      none: [
        "An ordinary physical week with one slow seam through the deeper matters: the current wants procedure and patience. Routine meals and walks proceed fine; anything the body processes slowly moves at its own rhythm. Respect the pace, keep the timings complete, and Friday closes the week without drama.",
        "The week stays level on the surface while the slower physical channel underneath insists on proper procedure. Improvisation meets friction in the body; preparation meets cooperation. Route the important routines through the steady door — punctual meals, defended sleep — and see the routine carry the rest of the week.",
        "Physical matters hold a workable pace this week with one stiff patch: the body wants protocol before personality. Give the form its due. Eat what is asked at the asked hours, rest at the asked hours, keep your own tempo on lighter movement, and the week balances out.",
        "A plain physical week with a demanding patch in the middle of it. The patch belongs to the body's slower processes: recovery, appetite and rest. Give that part its full patience early, keep the lighter movement moving briskly, and Friday settles the account. Patience finished early keeps the week's record honest.",
      ],
      review: [
        "An ordinary physical week with a slow seam through the deeper matters, and the seam also asks for re-checking. Routine meals and walks proceed fine; the slower processes return once for review. Respect both speeds, verify the routine that comes back, and the week stays clean.",
        "The week stays level on the surface while the slower physical channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience. Keep the punctual meals, correct the older habits midweek, and let routine carry on. Habits corrected early age well in every body.",
        "Physical matters hold a workable pace this week with two quiet disciplines stacked: protocol first, re-checking second. Neither is personal. Eat at the asked hours, verify the routine that returns, and keep your own tempo on the lighter movement. Both disciplines clear sooner than they first promise.",
        "A plain physical week with a demanding patch in its middle, and this week the patch also returns older routines for review. Give the returns their corrections promptly, keep the timings complete, and see the lighter movement move briskly around the traffic. Friday then finds the body's file complete and calm.",
      ],
    },
    chandrashtama: {
      none: [
        "The week moves at an even pace while the Moon's quiet tide beneath it asks for gentler pacing than usual. Feelings sit closer to the surface through the days. Keep the routine for essentials, add earlier rest and softer evenings, and see the tide pass easily by the weekend.",
        "The week stays ordinary and workable with one gentle exception: the Moon's tide makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness through the days. Speak slowly, eat warm, rest a little earlier each evening, and see the tide seek its own quiet by Friday.",
        "The week stays plain on the surface while the Moon's band underneath asks for quiet company and simple food. Sensitivity runs a notch higher through the week. Honour it without drama: warm meals, calm corners, and unhurried evenings restore the balance quickly, well before Sunday arrives.",
        "An even week overall, tempered by the lunar tide that turns the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the schedule light on noise and heavy on comfort through midweek, and see the tide move through by the weekend.",
      ],
      review: [
        "The week moves at an even pace while the Moon's quiet tide asks for gentler pacing, and the review layer adds one habit: re-read the week's rest honestly. Feelings sit closer to the surface. Keep the routine for essentials, soften the evenings, and re-check the sleep pattern gently by Friday.",
        "The week stays ordinary and workable with the Moon's tide making emotions nearer, and the review current suggesting a second look at older habits. Nothing needs alarm, only gentleness. Speak slowly, re-check the meal timings once, rest a little earlier, and see the tide settle by Friday.",
        "The week stays plain on the surface while the Moon's band asks for quiet company, and older routines knock for a kind re-read. Sensitivity runs higher through the days. Honour both gently: warm meals, calm corners, one honest habit review midweek, and the balance restores quickly.",
        "An even week overall, tempered under the Moon's inward tide and a review call toward the week's patterns. Treat the inward turn as rest, not trouble. Keep the schedule light on noise, heavy on comfort, and re-check the sleep notes by midweek. The tide moves through by Sunday.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual on the body, yet the supportive current still holds and still helps. The difficulty is pacing, not permanence. Keep the physical workload light, use the cooperative hours early in the week, and see the weekend restore the body's balance. Help received in heavy weeks deserves generous returning.",
        "A heavier tone runs through the physical days, and routines may feel denser than their actual size. The helpful part is structural: mealtimes and bedtimes still work exactly as designed. Do the essentials well, postpone the extras without guilt, and rest easy each evening. Short sessions of movement count double in weeks shaped like this.",
        "The week asks more from the body than the calendar suggests, though the cooperative current keeps a lane open. Take it: one restorative evening kept properly keeps the week from souring. Choose gentleness over force in training and protect the calm hours. The lane narrows toward Friday, so walk it midweek.",
        "The week leans demanding on the physical front, with duties arriving in clusters and energy thinning by midweek. What helps: the routine around meals and sleep stays reliable when little else does. Keep the asks modest, keep the plan minimal, and see the weekend reset the scale. A steady routine is this week's dependable gift.",
      ],
      review: [
        "The week presses harder than usual on the body, though the supportive current still holds and helps. Add the retrograde instruction: handle revision items before new plans. Keep the physical workload light, correct the routine drifts early in the week, and see the weekend close the ledger gently. Order chosen outweighs speed managed.",
        "A heavier tone runs through the physical days while the review current pulls attention toward older routines. The helpful part is structural: mealtimes and bedtimes still work as designed, revision included. Do the essentials, fix what returns, and rest easy each evening. Routines mended properly stay mended, which settles the whole body.",
        "The week asks physical patience twice: for its own weight, and for the older routines returning for a second look. The cooperative current keeps a lane open for exactly this work. Take the lane, revise what returns, and protect the calm evenings. Revision fits that lane better than any new regimen would.",
        "The week leans demanding physically, and part of the weight is older habits knocking for attention at awkward hours. The routine around meals and sleep stays reliable through it. Meet each knock with a short, honest effort, and keep the evenings genuinely calm. Managed this way, Sunday evening arrives feeling earned.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones for the body, and the field offers little cushion: relief comes only from steady, deliberate habits. The difficulty is pacing, not permanence. Keep the plan minimal, cover the essentials, and see the weekend restore what the days spend. Targets kept modest and fully met win the week.",
        "A demanding week on plain physical ground, where nothing extra arrives to help and no fresh trouble interferes either. Routines feel denser than their size; patience closes the gap. Work in short, honest sessions, rest deliberately, and Friday closes the books fairly. Brief honest sessions outlast long sprints in such weather.",
        "The week asks more than the calendar promises, mostly through small delays and tired energy. Nothing here is verdict-shaped; it is weather, and weather passes. Slow the pace deliberately, choose patience over force in training, and protect one quiet hour on the heaviest day. The guarded hour counts as upkeep, not idleness.",
        "The week leans demanding without offering the body much support in return, which makes pacing the whole game. Duties cluster, energy thins, and yet the essentials still fit if the plan stays small. Keep the sessions measured and see the weekend reset the scale. Small plans carried to the end beat grand ones dropped.",
      ],
      review: [
        "The week runs heavier than recent ones for the body, and older routines surface for correction inside the weight. The field offers little cushion, so sequence matters: revision first, new plans last. Keep the list short, work slowly, and see the weekend absorb the rest. Choosing the order well is the week's entire strategy.",
        "A demanding week on plain physical ground, with revision requests arriving at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each request with a short, honest effort, rest deliberately between them, and Friday balances the books. Friday balances the books when every effort stays short and real.",
        "The week asks patience twice over: for its own heaviness, and for the routines that need re-checking before anything settles. Take that as the week's shape instead of a judgment. Work slowly, verify carefully, and rest early on the heavier days. Both kinds of patience show their worth by Sunday evening.",
        "The week leans demanding while a review current tugs older routines back into the open. Neither needs to fight the other. Accept the slower pace, revise what comes up for review, and leave fresh plans for a clearer week ahead. A properly revised base serves the coming weeks better than speed.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides: its own weight, and a physical channel that wants form at every step. Neither is personal. Keep everything regular, keep the tone patient with the body, do less but do it properly, and see the weekend restore the difference. Correct form is the only shortcut offered.",
        "A heavy physical week meets a slow, exacting channel, and routines feel denser than their real size. The combination favours the patient and the prepared. Cover the essentials in the asked shape, postpone the rest without guilt, and rest early each evening. Early nights are what make the mornings kinder here.",
        "The week asks more than the calendar suggests, while the body's channel checks every step for form and pace. The pair feels heavy but stays manageable. Keep the schedule light, keep the meal notes immaculate, and protect one genuinely quiet hour daily. Guard the hour as necessary upkeep, not as indulgence.",
        "The week leans demanding while the body's slower channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline the temptation: shortcuts cost double in physical weather like this. Keep the plan minimal, keep the timings complete, and see the weekend reset the scale. Work complete and slow beats fast and redone.",
      ],
      review: [
        "The week presses from two sides, and the retrograde undertone adds a third: older routines returning for correction. The stack feels heavy but stays orderly. Handle the returns first, keep new plans parked, keep the timings regular, and rest early each evening. Orderly weeks of this kind close better than they feel.",
        "A heavy physical week meets a slow channel that also asks for re-checking this time. The combination favours the thorough over the quick, decisively. Correct what returns, confirm nothing half-checked, keep the schedule light, and rest early each evening. Being thorough proves the quickest route through this week.",
        "The week asks patience three ways: its own weight, the body's slower channel, and the routines that need re-checking. None of the three is personal. Take them in order, one at a time, keep the notes immaculate, and protect the quiet evenings. Handled in strict order, the week stays manageable.",
        "The week leans demanding while the body's channel returns older routines for review at its own rhythm. The mismatch tempts shortcuts, and shortcuts cost double here. Meet the returns promptly, keep the timings complete, and leave fresh regimens for a clearer week. Managed this way, next week starts on genuinely clean ground.",
      ],
    },
    chandrashtama: {
      none: [
        "The week presses harder than usual, and the Moon's quiet tide beneath it asks for gentler pacing still. Feelings sit close to the surface from Monday onward. Keep the schedule light on noise, add earlier rest each evening, and see the weekend absorb what the days spend. Gentleness carries more than force this week.",
        "A heavier week runs its course with the Moon's tide making emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness. Trim the noise, eat warm and simply, rest a little earlier each evening, and see the tide seek its own quiet by Sunday's close.",
        "A demanding week on the surface while the Moon's band underneath asks for quiet company and simple food. Sensitivity runs higher through the days. Honour it without drama: warm meals, calm corners, unhurried evenings, and one genuinely restful afternoon midweek. The balance restores itself once the tide has passed.",
        "The week leans demanding while the Moon's tide turns the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the plan light on noise and heavy on comfort, protect the sleep hour nightly, and see the tide move through by the weekend's close.",
      ],
      review: [
        "The week presses harder than usual while the Moon's quiet tide asks for gentler pacing, and the review layer adds one habit: re-read the week's rest honestly. Feelings sit close to the surface. Trim the schedule, soften the evenings, re-check the sleep pattern gently, and see the weekend close the books.",
        "A heavier week runs its course with the Moon's tide making emotions nearer, and the review current suggesting a second look at older habits. Nothing needs alarm, only gentleness. Trim the noise, re-check the meal timings once, rest earlier each evening, and see the tide settle by Sunday.",
        "A demanding week on the surface while the Moon's band asks for quiet company, and older routines knock for a kind re-read. Sensitivity runs higher through the days. Honour both gently: warm meals, calm corners, one honest habit review midweek, and one genuinely restful afternoon before Sunday.",
        "The week leans demanding while the Moon's tide turns the mind inward, and the review current asks for one honest look at the week's patterns. Treat the inward turn as rest, not trouble. Keep the plan light on noise, protect the sleep hour nightly, and re-check the notes by midweek.",
      ],
    },
  },
};

const cells: Array<[string, string[]]> = [];
for (const rating of RATINGS) {
  for (const pb of AREA_PB_HEALTH) {
    for (const retro of RETRO) {
      cells.push([`rating=${rating}.pb=${pb}.retro=${retro}`, TEXTS[rating]![pb]![retro]!]);
    }
  }
}

export const weeklyHealthRows: BankRow[] = makeRows("weekly.health", "en", cells);
