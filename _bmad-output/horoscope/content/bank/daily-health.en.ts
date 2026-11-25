/**
 * EN daily.health bank — `rating={4}.pb={fav,neutral,unfav,chandrashtama}.retro={none,review}`
 * (compose.ts: rating = wellbeing aggregate, pb = Moon's band for this area —
 * chandrashtama is the Moon's own soft band, framed as an emotional tide asking
 * for gentleness, the gentlest reading available — and retro = review when a
 * Mercury/Jupiter/Saturn retrograde falls in the window).
 * 32 cells × 6 variants, 35–55 words. Health content = rest, routine, balance
 * only (style §5): energy, meals, sleep, movement — no diagnosis, no fear.
 * Mirrors daily-health.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB_HEALTH, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Energy runs bright today and the body cooperates: movement feels light, appetite is steady, and sleep last night left real reserves. Use the vitality well. Take the exercise you enjoy, eat on time, and watch the strong current refill the tank.",
        "Vitality is high today, and the body asks for good use of it rather than restlessness. A brisk walk, a proper meal, and an early bedtime would each multiply the others. Ride the strong energy, and allow balance be its keeper.",
        "The body feels capable today: posture lifts, breath comes easy, and small aches from busy days fade. The sky rewards those who build on such mornings. Stretch properly, eat light and warm, and carry this energy gently into the evening.",
        "Physical rhythm is strong today, with recovery working quietly on your side. Whatever rest you gave yourself recently pays visible interest now. Spend the surplus on movement and sunlight, keep meals regular, and watch the day end with genuine ease.",
        "Your energy holds a clean, steady line today, and ordinary habits work smoother than usual. Water, walking, and unhurried meals each show their effect by evening. Keep the simple disciplines, add nothing drastic, and watch the good current compound.",
        "The day hands you stamina and a cooperative body, a pairing worth spending deliberately. Climb the stairs, take the longer route, finish the workday upright. Physical ease today is built from yesterday's rest, and today's care becomes tomorrow's.",
      ],
      review: [
        "Energy runs bright today, and the retrograde layer adds one instruction: re-check the routine before revising it. Movement feels light, appetite steady. Enjoy the vitality, review what your recent habits have actually been, and adjust gently rather than drastically.",
        "Vitality is high today, while the review current favours refinement over new regimens. A brisk walk, a proper meal, and an early bedtime still lead. Ride the strong energy, re-read the labels and timetables you follow, and allow small corrections compound.",
        "The body feels capable today, and the retrograde layer turns attention toward older habits worth revisiting. Breath comes easy, posture lifts. Re-attempt the routine that once worked well, keep meals light and warm, and watch the good current restore it.",
        "Physical rhythm is strong today, with recovery working quietly on your side and a gentle call to re-examine recent rest. The surplus shows. Spend it on movement and sunlight, re-check the sleep schedule honestly, and watch the day end in ease.",
        "Your energy holds a clean, steady line today, and the review current suggests a second look at the daily pattern. Ordinary habits work smoother than usual. Keep the simple disciplines, re-check the meal timings once, and watch the good current compound.",
        "The day hands you stamina and a cooperative body, with a quiet instruction underneath: revise before you expand. Climb the stairs, take the longer route. Then re-read the routine you keep, correct its small drifts, and let care become tomorrow's ease.",
      ],
    },
    neutral: {
      none: [
        "Vitality is genuinely good today even on plain ground: your own routine supplies the strength. Nothing drains and nothing lifts either. Set the day's one healthy act yourself — the walk, the proper meal, the earlier light-out — and let it count double.",
        "The body runs on your habits today more than on any passing current, and that suits a steady keeper. Sleep, meals, and movement all behave. Use the good form to organise rather than to celebrate, and the evening closes with real ease.",
        "A confident day for the body on neutral ground: the sky offers steadiness rather than surplus. Energy is reliable because the routine is. Write down what worked this week while judgement is clear, and watch the record serve the coming days.",
        "Your physical sense sharpens today against a plain background, which is often the best combination. No noise disturbs the body's signals, and no rush hides them. Use the clean view to notice what truly helps, and let that habit grow.",
        "Strong steady energy carries the day; the wider field neither drains nor lifts it. Ordinary choices land well when made on time. Keep the portions modest and the sleep punctual, and let your own consistency be the day's real medicine.",
        "The day gives plain physical ground and unusually steady energy, a pairing worth using deliberately. Nothing dazzles and nothing drains. Decide what today's one healthful act is, complete it precisely, and watch the quiet discipline compound into the week.",
      ],
      review: [
        "Vitality is genuinely good today even on plain ground, with the retrograde layer asking for recounts. Your own routine supplies the strength. Set the day's healthy act, meet it, and re-check the week's sleep record before calling the pattern final.",
        "The body runs on your habits today, and the review current adds a useful habit: verify before you trust the routine. Sleep, meals, and movement behave. Use the good form to re-read the week's pattern, and let re-checking be part of the order.",
        "A confident day for the body on neutral ground, with one exception: the sky prefers revising over starting. Energy is reliable because the routine is. Write down what worked, review it once tonight, and hold new regimens for a clearer day.",
        "Your physical sense sharpens today against a plain background, while the review current pulls gently toward older habits. No noise disturbs the body's signals. Use the clean view for a second pass over recent routines, and let clear noticing find the small drifts.",
        "Strong steady energy carries the day; a retrograde preference folds itself in: refine rather than expand. Ordinary choices land well when double-checked. Keep the portions modest, verify the meal timings, and let consistency plus accuracy be the day's real care.",
        "The day gives plain physical ground and unusually steady energy, with revision work woven through the hours. Nothing dazzles and nothing drains. Pick the routine that most needs a second look, give it today's clean attention, and let discipline compound.",
      ],
    },
    unfav: {
      none: [
        "The day's broader strength reaches your body too, though the deeper current asks for form and patience with health. Energy favours the regular and the punctual. Keep meals on time, sleep defended, and movement moderate, and the strong day still serves you.",
        "Bright energy rides through the day while the body's channel underneath runs slow and formal. The combination rewards those who keep routines and respect limits. Let the steady schedule precede the enthusiasm, and the strength settles into lasting good form.",
        "Your overall form is high, though the physical current underneath prefers protocol over push. Recovery moves slowly and the body asks for order. Do not push against the gate: eat on schedule, rest on schedule, and watch the strong day carry you.",
        "The broad day favours you, while a slower physical current checks each habit for regularity. Treat the checking as protection rather than resistance. Move deliberately, keep every meal and rest punctual, and the day still closes with vigour on your side.",
        "Strong drive meets a careful body-gate today, and the pairing favours the moderate. Intense plans meet slowness; gentle consistency meets welcome. Let the regular finish of today speak louder than any heroic one ever would.",
        "The wider day runs bright while the physical lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: warm meals, unhurried walks, earlier nights. Do that, and the day's brightness still covers your wellbeing.",
      ],
      review: [
        "The day's broader strength reaches your body, though the physical channel underneath runs slow and formal, re-checking its own trail. Energy favours the regular. Keep meals on time, sleep defended, routines verified, and the strong day still serves you well.",
        "Bright energy rides through the day while the body's channel underneath runs slow, formal and revision-minded. The combination rewards routines, limits and second passes. Let the steady schedule precede the enthusiasm, correct the older habits gently, and strength settles into form.",
        "Your overall form is high, though the physical current underneath prefers protocol and re-examination over push. Recovery moves slowly and asks for order. Eat on schedule, rest on schedule, re-check the routine before changing it, and watch the strong day carry you.",
        "The broad day favours you, while the slower physical current checks each habit for regularity and asks corrections of older ones. Treat both as protection. Move deliberately, keep every meal and rest punctual, and the day still closes with vigour intact.",
        "Strong drive meets a careful body-gate that is currently reviewing as much as it releases. The pairing favours the moderate. Gentle consistency and one honest habit revision meet welcome, and the regular finish of today speaks loudest.",
        "The wider day runs bright while the physical lane runs slow and re-checks its history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: warm meals, unhurried walks, one adjusted bedtime. The brightness still covers wellbeing.",
      ],
    },
    chandrashtama: {
      none: [
        "The day's broader strength holds, but the Moon's quiet tide beneath it asks for gentler pacing than usual. Feelings sit closer to the surface today. Keep the strength for essentials, add earlier rest and softer hours, and watch the tide pass easily.",
        "Energy remains good today, with one gentle exception: the Moon's tide makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness. Speak slowly, eat warm, rest a little earlier, and watch the tide seek its own quiet.",
        "The day stays bright on the surface while the Moon's band underneath asks for quiet company and simple food. Sensitivity runs a notch higher today. Honour it without drama: warm meals, calm corners, and an unhurried evening restore the balance quickly.",
        "A strong day overall, tempered by the lunar tide that turns the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the schedule light on noise, heavy on comfort, and watch the tide move through.",
        "Vitality holds well today while the Moon's quiet band asks for emotional housekeeping: softer words, familiar places, unhurried meals. The combination is manageable and temporary. Give the feelings room without giving them the microphone, and the day stays kind.",
        "The strong day keeps its promise, and the Moon's tide adds a soft request: treat yourself the way you would treat a tired friend. Warmth, simpler plans, earlier nights. Do that, and the tide passes without taking anything from the day.",
      ],
      review: [
        "The day's broader strength holds, while the Moon's tide beneath asks for gentler pacing and one quiet look at old feelings. Emotions sit closer to the surface. Keep strength for essentials, revisit nothing in the late hours, and watch the tide pass easily.",
        "Energy remains good today, with the Moon's tide and the review current both asking for gentleness rather than new ventures. Reactions run quicker than usual. Speak slowly, eat warm, re-read old messages with kind eyes, and watch the tide settle on its own.",
        "The day stays bright while the Moon's band underneath asks for quiet company, simple food, and a soft revision of old memories. Sensitivity runs higher. Honour it without drama, keep late-night reminiscing brief, and let an unhurried evening restore balance.",
        "A strong day overall, tempered by the lunar tide and a backward pull toward older emotional ground. Treat the pull as rest, not trouble. Keep the schedule light on noise, revisit one old matter gently, and watch the tide move through.",
        "Vitality holds well today while the Moon's quiet band asks for emotional housekeeping and a gentle pass over older worries. The combination is manageable and temporary. Give the feelings room and one calm re-look, and the day stays kind.",
        "The strong day keeps its promise, and the Moon's tide adds a soft request: treat yourself like a tired friend, and let old matters close gently rather than reopening. Warmth, simpler plans, earlier nights, and the tide passes without cost.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Health keeps a friendly, workable rhythm today. Energy behaves, appetite is honest, and movement comes without argument. Keep the routine gentle without loosening it, and watch the steady current hand its quiet strength to the week.",
        "The body offers solid ground without surprises today, which suits steady keepers of routine well. Meals land well, walks feel natural, and nothing demands heroics. Lean in gently, add the stretch you keep skipping, and let ordinary care do its compounding.",
        "Today's physical weather is fair and mild, with a supportive current under ordinary routines. Your consistency reads clearly in how today feels. Keep the promises made to yourself about rest, and watch steadiness earn its quiet credit.",
        "Wellbeing proceeds smoothly today, helped by a patient and well-disposed backdrop. The body behaves, sleep repays itself, and small healthy choices meet quick rewards. Steady attention now earns more than one drastic reset would manage.",
        "A pleasant, orderly rhythm settles over your health today. The frictions that usually slow good habits stay quiet. Do the next small right thing for the body, and watch the day's quiet goodwill attach itself to the routine.",
        "Your wellbeing enjoys a calm, cooperative day with strength arriving at a natural pace. The body seems receptive rather than resistant. Take the walk you postponed, eat the simple meal properly, and watch the good mood help both along.",
      ],
      review: [
        "Health keeps a friendly rhythm today, with the review current adding one instruction: listen to the body before assuming. Energy behaves and appetite is honest. Keep the routine gentle, re-check the sleep hours honestly, and watch the steady current carry strength onward.",
        "The body offers solid ground without surprises, while a revision-minded undertone asks for a second pass on recent habits. Routine care still lands well. Lean in gently, revisit the meal pattern of the past week, and let consistency do its compounding.",
        "Today's physical weather is fair, with a supportive current under ordinary routines and a gentle call to revisit a recent lapse. Your consistency shows. Keep the promises about rest, and treat each honest re-check as quiet progress for the body.",
        "Wellbeing proceeds smoothly today, helped by a patient backdrop and a retrograde preference for correcting over launching. The body behaves and sleep repays itself. Keep attention steady, re-check the timings where habits drift, and let accuracy do the earning.",
        "A pleasant, orderly rhythm settles over your health today, with revision work folded quietly into the hours. The frictions stay quiet. Do the next small right thing, and give the older skipped habit its gentle second look.",
        "Your wellbeing enjoys a calm, cooperative day with strength arriving at a natural pace, and one gentle call to review. The body seems receptive. Take the postponed walk, verify the routine once more, and watch the good mood help along.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary health day with mild support at the edges and no obstacles in the middle. Care converts at the normal rate. Keep the standards steady without raising the load, and the body pays its quiet dividend by evening.",
        "The body stays level and easy today, neither energetic nor heavy. Your caring habits carry their usual weight, and the routine matches your tone. Do the plainly visible healthy act and watch the evenness be the day's quiet advantage.",
        "Wellbeing holds a steady middle path today, with cooperation available and resistance absent. Nothing needs overhauling, and nothing rewards neglect either. Work the routine as written, close the small skipped items, and watch the day end in comfort.",
        "The health day runs at ordinary pace on an even, manageable field. Progress comes at the standard rate of exchange: attention for energy. Choose the habits with clear returns, keep them properly, and finish with a rested evening.",
        "A neutral but honest day for the body, the kind that quietly builds resilience. Nothing bends toward comfort, nothing blocks it either. Keep the commitments realistic, keep the meals punctual, and let steady habits do their patient strengthening.",
        "The physical sky sits level today, offering a fair field and an honest pace. Energy depends mostly on your own rhythm. Set a modest health intention for the day, carry it out without fanfare, and let satisfaction be its reward.",
      ],
      review: [
        "A fair, ordinary health day, with the retrograde undertone asking for a re-check at the edges. Care converts at the normal rate. Keep the standards steady, review the week's sleep and meals once, and the body settles quietly by evening.",
        "The body stays level and easy today, neither energetic nor heavy, while older habits resurface for review. Your caring routines carry their usual weight. Answer the resurfaced pattern first, gently and briefly, and watch the evenness hold.",
        "Wellbeing holds a steady middle path today, with one addition from the sky: re-check before you conclude. Cooperation is available and resistance absent. Work the routine as written, add the second pass over recent habits, and watch the day end in comfort.",
        "The health day runs at ordinary pace on an even field, while a review current tugs at older threads. Progress still comes at the standard rate of exchange. Honour the re-check first, keep the newer habits gently, and finish with a rested evening.",
        "A neutral but honest day for the body, with revision requests folded quietly into the hours. Nothing bends toward comfort and nothing blocks it. Keep commitments realistic, give the re-check its share of time, and let steady habits strengthen quietly.",
        "The physical sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent routines. Energy rests on your rhythm. Set a modest intention, re-check the habits as you go, and let tidy accuracy be the reward.",
      ],
    },
    unfav: {
      none: [
        "A workable health day with one demanding seam through it: the deeper current wants routine and patience. Ordinary energy goes fine; demanding schedules ask care. Keep the meals regular, keep the pace moderate, and watch the plain discipline shine.",
        "The body stays fair on the surface while the slower channel underneath asks for proper care. Overreach meets heaviness today; moderation meets cooperation. Choose the gentler version of everything that matters, and let routine wellbeing set the tone.",
        "Energy holds a decent pace today with a single stiff knot: the body prefers rhythm over spontaneity right now. Respect the preference rather than fighting it. Eat and rest on the usual clock, and the rest of today flows normally.",
        "A fair health day with a slow lane through its middle. The slow lane belongs to recovery and routine — meals, rest, gentle movement. Route those carefully and unhurriedly, and keep the lighter activity moving briskly around them.",
        "The day gives ordinary physical ground with one strict patch in it. The strict patch rewards preparation and penalises haste. Prepare the day's meals and rest properly before the rush begins, keep shortcuts away from them, and the day passes cleanly.",
        "A steady, usable health day with a demanding undercurrent around energy levels. The undercurrent is not hostile, just slow and precise. Give the body its full meals and full nights, keep your own tempo elsewhere, and close the day comfortably.",
      ],
      review: [
        "A workable health day with a demanding seam through it: the deeper current wants routine, patience, and re-checking. Ordinary energy goes fine; demanding schedules ask care. Keep meals regular, verify the rest you are getting, and watch the plain discipline shine.",
        "The body stays fair on the surface while the slower channel underneath asks for care and gentle revision. Overreach meets heaviness today; moderation meets patience. Choose the gentler version of everything, and revisit the recent habits without complaint.",
        "Energy holds a decent pace today with a stiff knot: the body prefers rhythm, and the sky prefers revisiting over launching. Both point the same way — regular, gentle, unhurried. Keep the usual clock for meals and rest, and watch the rest flow.",
        "A fair health day with a slow lane through its middle, and today the lane also returns an older habit for correction. The lane belongs to recovery and routine. Route those carefully, mend what resurfaces, and keep lighter activity moving briskly.",
        "The day gives ordinary physical ground with one strict patch, and the patch currently reviews as much as it approves. Prepare meals and rest fully, re-read the recent pattern honestly, keep shortcuts away from care, and the day passes cleanly.",
        "A steady, usable health day with a demanding undercurrent around energy, now also marked by review. The undercurrent is not hostile, just slow and precise. Give the body full meals and verified rest, keep your tempo elsewhere, and close comfortably.",
      ],
    },
    chandrashtama: {
      none: [
        "A workable day with the Moon's quiet tide underneath asking for softer pacing than the calendar suggests. Feelings sit closer to the surface. Keep the good rhythm, add warm meals and earlier rest, and the tide passes without taking anything.",
        "The day stays steady, though the Moon's band makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness. Choose familiar places and simple food today, speak slowly, and watch the tide seek its own quiet by evening.",
        "Solid ground overall, with the Moon's tide underneath turning the mind inward and the feelings upward. Treat the inward turn as rest, not trouble. Keep the schedule light on noise, keep the evening warm and unhurried, and the day stays kind.",
        "The good rhythm holds while the Moon's quiet band asks for emotional housekeeping: softer words, known company, unhurried meals. The combination is manageable and temporary. Give the feelings room without giving them the microphone, and the day stays pleasant.",
        "The day's steady promise stands, with one soft request under this Moon: treat yourself the way you would treat a tired friend. The body asks for warmth and the mind for quiet. Grant both, and the tide passes easily by night.",
        "A friendly, usable day with a gentle tide running beneath it that heightens sensitivity to words and moods. Nothing about it is wrong; it simply asks gentleness. Keep plans light, company familiar, and watch the evening restore the usual ease.",
      ],
      review: [
        "A workable day with the Moon's tide underneath asking for softer pacing and one gentle look at older feelings. Emotions sit closer to the surface. Keep the good rhythm, revisit nothing late at night, and the tide passes without taking anything.",
        "The day stays steady, though the Moon's band and the review current together make emotions nearer and memories nearer still. Nothing needs alarm, only gentleness. Choose familiar places, re-read old messages with kind eyes, and watch the tide settle by evening.",
        "Solid ground overall, with the Moon's tide and a backward pull toward older emotional ground arriving together. Treat both as rest, not trouble. Keep the schedule light on noise, revisit one old matter gently, and watch the day stay kind.",
        "The good rhythm holds while the Moon's quiet band asks for emotional housekeeping and one calm re-look at recent worries. The combination is manageable and temporary. Give the feelings room and one soft revision, and the day stays pleasant.",
        "The day's steady promise stands, with the Moon asking for the care you would give a tired friend, and the sky asking for revision over new ventures. Grant both: warmth, simpler plans, one gentle re-look, and the tide passes by night.",
        "A friendly, usable day with a gentle tide beneath it that heightens sensitivity to words, moods, and older threads resurfacing. Nothing about it is wrong; it asks gentleness and one patient re-hearing. Keep plans light, and let evening restore ease.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Health stays on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands a reset, and nothing blocks the routine either. Keep the plan simple, tend the scheduled meals and rest, and watch ordinary hours add up.",
        "The body's day is uneventful in the best sense, with support available when you reach for it. Recovery comes at working pace, not sprint pace. Small, scheduled care suits the body better than any ambitious overhaul.",
        "Your physical life hums along at a moderate pitch today, helped by decent conditions underneath. Tiredness is real but manageable, and the body responds when asked politely. Divide the evening into rest, a light meal, and an early night.",
        "Energy neither leaps nor sinks today, and the underlying current is quietly on your side. Use the steadiness to repair rather than expand. Tidy the routine, clear the small neglected habits, and call it a fine day's care.",
        "The day holds steady for health matters, with mild favours available to those who act early. Progress is possible, just not spectacular. Focus on consistency over ambition, and watch the week inherit a well-tended body.",
        "Routines move at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up for their own care. Keep the portions modest, keep the nights early, and let goodwill accrue.",
      ],
      review: [
        "Health stays on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for re-checking over new regimens. Keep the plan simple, and spend the spare moment reviewing the week's sleep.",
        "The body's day is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Tend the scheduled care, and give one recent habit a calm second look.",
        "Your physical life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours re-reading what you assumed about your rest. Divide the evening into rest and a light meal, and give one part to honest review.",
        "Energy neither leaps nor sinks today, and the underlying current leans helpful. The retrograde undertone makes it a maintenance kind of day. Tidy the routine, re-read the pattern of recent weeks, and let accuracy be today's contribution.",
        "The day holds steady for health matters, with mild favours for early actors. A revision-friendly atmosphere hangs over the second half. Focus on completing and correcting what exists, and watch the brand-new plans wait for clearer skies.",
        "Routines move at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward listening twice to the body's signals. Keep the portions modest and the attention genuine before the day closes.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest health day with level conditions throughout and no special favours in play. The routines are ordinary and the outcomes ordinary too. Keep them well anyway, because plain days kept well are what real resilience quietly grows from.",
        "The body runs at its most neutral setting today: fair, flat, and manageable. Nothing invites indulgence and nothing threatens it either. Keep the routine mechanical in the best sense, follow it without improvising, and bank the calm for livelier days.",
        "Energy sits in a level patch today where care and comfort hold a fair exchange. The sky offers neither pushback nor applause. Choose measurable habits, keep them cleanly, and watch the neutrality protect the body from noise.",
        "The health day moves evenly, with attention best spent on maintenance rather than experiments. Meals on time, water within reach, a walk after sunset — the unglamorous layer that quietly supports everything else. Tend that layer today, and the livelier days inherit solid ground.",
        "A steady, unremarkable physical day in which pace matters more than ambition. The hours respond to whoever keeps rhythm with them. Work in clean blocks, rest between blocks, and watch the day's modest steadiness stand on its own merits.",
        "The day offers physical conditions as plain as a clear sky: nothing to chase, nothing to dodge. Use it for the care that needs no occasion at all. Eat simply, walk gently, sleep on time, and let simplicity be the achievement.",
      ],
      review: [
        "A plain, honest health day with level conditions and a retrograde preference for re-examination. The routines are ordinary and the outcomes ordinary too. Keep them well, add the second look, because plain days handled carefully build resilience.",
        "The body runs at its most neutral setting today: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites indulgence and nothing threatens it. Keep the routine steady, re-check what you touch, and bank the calm for later.",
        "Energy sits in a level patch today where care and comfort hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose measurable habits, keep them cleanly, and watch the honest notes be the day's extra credit.",
        "The health day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. Meals on time, water within reach, the older habit awaiting its second look. Tend that layer, and calmer days inherit ground.",
        "A steady, unremarkable physical day in which pace matters more than ambition, and accuracy more than pace. The hours respond to whoever keeps rhythm. Work in clean blocks, re-read each block's signals once, and let modest exactness stand.",
        "The day offers physical conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to chase, nothing to dodge. Review the recent trail of habits, tidy it gently, and let simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level health day with a slow, formal current underneath the ordinary routines. Nothing collapses and nothing breaks through either. Meet the current with steady patience and care: regular meals, gentle movement, punctual rest. The body respects whoever respects its pace.",
        "The body runs neutral on the surface and heavy underneath, especially around energy dips. Recovery moves slowly and signals arrive quietly. Keep expectations plain, prepare the day's rest before the rush, and watch the routine care define the day.",
        "Wellbeing holds an even, unhurried line today with one patch of sluggishness in it. The patch sits wherever late nights and skipped meals live. Walk around it rather than through it: keep what already works, and repair the skipped parts gently.",
        "The health day moves at working pace with a demanding undertone around routine and regularity. The undertone is honest: it rewards completeness and slows shortcuts. Give it completeness, skip the shortcuts, and the ordinary day passes with steadiness intact.",
        "A flat but fair day for the body, with friction concentrated wherever habits have thinned. Energy stays workable; the neglected corners do not. Save patience for the body and precision for the timings, and the day closes without real cost.",
        "Routines proceed ordinarily today while the deeper layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: eat properly, rest properly, move gently. The rest of today rewards whoever keeps that discipline.",
      ],
      review: [
        "A level health day with a slow, formal current underneath, and that current also wants older habits re-checked. Nothing collapses and nothing breaks through. Meet it with steady patience and care: regular meals, gentle movement, one honest re-check of the week.",
        "The body runs neutral on the surface and heavy underneath, especially around energy dips, with revision requests folded in. Recovery moves slowly and signals arrive quietly. Keep expectations plain, correct the skipped parts gently, and let routine care define the day.",
        "Wellbeing holds an even, unhurried line today with one patch of sluggishness where late nights live, and the patch currently reviews as much as it rests. Walk around rather than through: keep what works, re-check the skipped meals, and go gently.",
        "The health day moves at working pace with a demanding undertone around regularity, and today the undertone also audits. It rewards completeness and slows shortcuts. Give it completeness, correct what it flags, and the ordinary day passes with steadiness intact.",
        "A flat but fair day for the body, with friction concentrated where habits have thinned and a review mood layered over it. Energy stays workable; the neglected corners do not. Save patience for the body, precision for timings, and close gently.",
        "Routines proceed ordinarily today while the deeper layer beneath moves slowly, deliberately, and with an eye on older patterns. Nothing about the slowness is personal. Match it: eat properly, correct gently, rest properly, and let discipline carry the rest.",
      ],
    },
    chandrashtama: {
      none: [
        "A level day gains a softer, more inward tone under the Moon's quiet tide. Energy is ordinary and feelings are near the surface. Keep the plans modest, add warm meals and an earlier night, and watch the tide pass without ceremony.",
        "The neutral day stays manageable, though the Moon's band makes emotions nearer and reactions quicker than usual. Nothing needs alarm, only gentleness. Choose quiet company and simple food, speak less and listen more, and watch the tide settle by evening.",
        "The even pace of today meets the Moon's tide, which turns the mind inward and the feelings upward. Treat the inward turn as rest. Keep the schedule light on noise, take a proper break in the afternoon, and evening restores balance.",
        "Moderate energy and a quiet lunar tide make a day best spent on gentle maintenance. Softer words, familiar places, unhurried meals. Give the feelings room without giving them the microphone, and the flat day passes kindly.",
        "The day's plain promise stands, with the Moon adding one request: treat yourself the way you would treat a tired friend. The body asks warmth, the mind asks quiet, and both are easily granted. Do so, and the tide passes by night.",
        "A plain, usable day with a gentle tide beneath it that heightens sensitivity to words and moods. Nothing about it is wrong; it asks for gentleness and simple comforts. Keep plans light, company familiar, and watch the evening restore ease.",
      ],
      review: [
        "A level day gains a softer, more inward tone under the Moon's tide, along with a gentle pull toward older feelings. Energy is ordinary and emotions are near the surface. Keep plans modest, revisit nothing late at night, and the tide passes quietly.",
        "The neutral day stays manageable, though the Moon's band and the review current together bring emotions and memories closer than usual. Nothing needs alarm, only gentleness. Choose quiet company, re-read old words with kind eyes, and watch the tide settle by evening.",
        "The even pace meets the Moon's tide and a backward pull toward older emotional ground, both asking for rest rather than trouble. Keep the schedule light on noise, revisit one old matter gently, take a proper afternoon break, and evening restores balance.",
        "Moderate energy and a quiet tide make a day best spent on gentle maintenance and one calm revision of recent worries. Softer words, familiar places, unhurried meals. Give the feelings room and one soft re-look, and the flat day passes kindly.",
        "The day's plain promise stands, with the Moon asking for the care owed to a tired friend and the sky asking for revision over new ventures. Grant both: warmth, simpler plans, one gentle re-look, and the tide passes by night.",
        "A plain, usable day with a tide beneath it that heightens sensitivity to words, moods, and older threads resurfacing for review. Nothing about it is wrong; it asks gentleness and one patient re-hearing. Keep plans light, and let evening restore ease.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The body asks for patience today, even though the deeper current is quietly supportive. The surface feels heavy, and energy comes in increments rather than waves. Choose the smallest caring act — the walk, the proper meal — and let that be enough.",
        "The physical day leans demanding, though the ground beneath is kinder than it looks. Heaviness is possible if you measure today by yesterday's pace. Move through the routine gently, and protect one moment of genuine rest.",
        "Energy presses a little lower today, while support waits underneath for those who rest deliberately. Not every hour feels strong today, and that is acceptable. Aim for steady care instead of a burst of energy.",
        "Vitality feels like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about pacing. Keep the schedule light, and finish your day with one good rest properly taken.",
        "The day tests your patience more than your strength, even with a supportive undertone below. Under the heaviness, gentleness and slowness still earn their reward. Eat warm, rest early, keep the demands modest, and let time do its share.",
        "The body feels heavier than its actual state today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule the breaks deliberately, and watch the evening's rest have your fullest attention.",
      ],
      review: [
        "The body asks for patience today, even with a quietly supportive current underneath. The heaviness on the surface is real, and part of it is accumulated tiredness asking for review. Choose rest over new regimens, and let care be today's win.",
        "The physical day leans demanding, though the ground beneath is kinder than it looks. Recent overexertion resurfaces for calm correction. Ease the schedule without ceremony, accept the slower tempo, and treat the rest as today's real progress.",
        "Energy presses a little lower today, while support waits underneath for those who rest deliberately. The retrograde mood turns attention toward neglected routines. Repair one small skipped habit, accept the modest pace, and consider the day honestly spent.",
        "Vitality feels like wading today where yesterday was walking, and the slowdown is partly review rather than only resistance. Keep the schedule light, spend the quiet hour revising the routine kindly, and watch the day close with one loop tied.",
        "The day tests your patience more than your strength today, with an undertone of revisiting neglected care. Gentleness and slowness still earn their reward beneath the surface. Eat warm, rest early, and double-check the routine before any change.",
        "The body feels heavier than its weight today, and skipped rests knock for attention. The friendly undertone rewards gentle persistence and careful re-reading of signals. Schedule the breaks, revisit the oldest neglected habit gently, and watch the day settle.",
      ],
    },
    neutral: {
      none: [
        "A demanding health day with no particular villain in it, just low energy and tired attention. The physical ground neither helps nor harms. Keep the scope small, keep the care steady, and watch the plain routine see the body through to evening.",
        "The body moves under a heavier sky today, with tiredness arriving without explanation. Nothing in the heaviness needs diagnosing; it passes with the day. Keep the essential care going, defer the demanding plans, and guard the evening's rest.",
        "Physical matters carry a muted, effortful tone today, where each task asks twice the usual energy. The sky is testing endurance, not health. Work in short gentle efforts, rest between them, and treat a modest day as complete.",
        "A heavy-handed day around energy, where small tasks arrive with big tiredness attached. The wise response is smaller plans and slower pace. Keep efforts brief and kind to the body, take one real rest, and watch the day breathe.",
        "The physical day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower. Lower the demands to whatever is essential, hold your patience visibly, and watch the evening restore balance.",
        "Today's physical atmosphere asks for endurance dressed as calm. Energy thins by mid-afternoon, and the body moves slowly. Keep the plan minimal, keep the posture upright, and give the tired hours your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding health day with no particular villain in it, just low energy, tired attention, and neglected rest asking to be reviewed. The ground neither helps nor harms. Keep the scope small, handle the rest first, and let routine carry the evening.",
        "The body moves under a heavier sky, with tiredness and skipped meals resurfacing without ceremony. Nothing in the heaviness needs diagnosing; it passes with the day. Repair the missed meal gently, defer the demanding plans, and guard the evening's rest.",
        "Physical matters carry a muted, effortful tone today, where each task asks twice the usual energy, and rest sits at the top of the pile. The sky is testing endurance, not health. Start with proper rest, work gently, and finish early.",
        "A heavy-handed day around energy, where small tasks arrive with big tiredness and old habits with correction notes attached. The wise response is smaller plans and careful repairs. Keep efforts brief, close one clean correction, and watch the day breathe.",
        "The physical day runs thick and slow, with a backward pull toward half-kept routines. Nothing is wrong exactly; everything is slower and half of it needs a second pass. Lower the demands, close one small repair, and let evening restore balance.",
        "Today's physical atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every step. Energy thins, signals blur, and routines resurface. Keep the plan minimal, verify before pushing, and give the tired hours your kindest attention.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on the body, with low energy and thin reserves on both sides. The wise posture is small, gentle and unbothered. Take the required rest properly, step back from the rest, and watch tomorrow carry fresh strength.",
        "A stiff, demanding physical day where energy responds slowly and patience runs short. Pushing harder today achieves less than resting well. Keep the schedule minimal, eat warm and simple, and protect the evening from carry-over tiredness.",
        "Physical matters sit in today's shadow, with energy slow and effort heavy. The day is testing posture more than strength. Stand steady: keep the basic care going, avoid the demanding extras, and let a quiet evening be the victory.",
        "The physical day presents heaviness in layers today — slow starts, short energy, reluctant limbs. None of the layers need solving at once. Move through only the essential ones, keep the pace level, and save the rest for a lighter day.",
        "A slow, heavy day in which effort meets a body that refuses to hurry. Fighting the slowness costs more than it returns. Work within its lines, keep the demands small and the meals warm, and let patience be today's health skill.",
        "Today the body seems to move in syrup while the mind moves in air, and the mismatch wears on the spirit. Accept the pace without argument. Do what moves easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on the body, with low energy, thin reserves, and neglected rest resurfacing for attention. The wise posture is small, gentle and unbothered. Take the required rest properly, repair one missed meal gently, and let tomorrow carry fresh strength.",
        "A stiff, demanding physical day where energy responds slowly and tiredness asks for proper settlement. Pushing harder today achieves less than resting well. Keep the schedule minimal, settle the rest debt honestly, and protect the evening from carry-over tiredness.",
        "Physical matters sit in today's shadow, with energy slow, effort heavy, and a review mood on top. The day is testing posture more than strength. Stand steady: keep the basic care going, correct the skipped routines gently, and let a quiet evening be enough.",
        "The physical day presents heaviness in layers today — slow starts, short energy, returned tiredness. None of the layers need solving at once. Rest through the top one properly, keep the pace level, and save deeper repairs for a lighter day.",
        "A slow, heavy day in which effort meets a body that refuses to hurry, and the body is also reviewing its recent history. Fighting either costs more than it returns. Work within its lines, tend what it flags, and let patience lead.",
        "Today the body seems to move in syrup, with a backward current pulling attention to neglected rest. Accept the pace without argument. Do what moves easily, give one resurfaced tiredness its proper rest, and close the day gently.",
      ],
    },
    chandrashtama: {
      none: [
        "A demanding day meets the Moon's quiet tide, and the kindest reading is simple: the mind wants rest, and the body follows the mind. Keep the day small, the meals warm, the words few, and watch the evening arrive early and gentle.",
        "The heavy day deepens slightly as the Moon's tide draws feelings closer to the surface. Nothing in it needs diagnosing; it passes with the day. Choose quiet company, simple food, and slow hours, and treat rest as today's main task.",
        "Tired energy and a sensitive tide share the day, where each exchange asks twice the usual gentleness. The sky is testing patience, not worth. Work in short soft efforts, rest between them, and give the evening entirely to quiet.",
        "The demanding day gains a tender edge under the Moon's band, where small words carry big weight. The wise response is smaller plans and softer speech. Keep company familiar, take one real rest, and watch the day close without fuss.",
        "The day runs heavy and the tide runs close, like walking through a room where both air and mood are reluctant. Nothing is wrong exactly; everything needs gentleness. Lower the demands, warm the meals, and watch the evening restore the balance.",
        "Today asks for endurance dressed as gentleness: energy thins by afternoon while the Moon's tide heightens every feeling. Keep the plan minimal, keep the posture soft, and give the tired hours your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding day meets the Moon's quiet tide and a backward pull toward older feelings, and the kindest reading is simple: the mind wants rest. Keep the day small, the meals warm, revisit nothing in the late hours, and watch the evening arrive gently.",
        "The heavy day deepens as the Moon's tide and the review current together draw feelings and memories closer to the surface. Nothing needs diagnosing; it passes with the day. Choose quiet company, simple food, one gentle closure, and treat rest as the main task.",
        "Tired energy and a sensitive tide share the day, where each exchange asks twice the usual gentleness, and older words resurface for re-hearing. The sky is testing patience, not worth. Begin with the gentlest item, rest between efforts, and give evening to quiet.",
        "The demanding day gains a tender edge under the Moon's band, where small words carry big weight and old threads knock for closure. The wise response is smaller plans, softer speech, and one gentle mending. Keep company familiar, and watch the day close quietly.",
        "The day runs heavy and the tide runs close, with a backward current toward half-mended older worries. Nothing is wrong exactly; everything needs gentleness. Lower the demands, warm the meals, close one small loop softly, and watch the evening restore balance.",
        "Today asks for endurance dressed as gentleness, and the retrograde layer adds re-checking to every feeling before reacting on it. Energy thins while the tide heightens sensitivity. Keep the plan minimal, verify before speaking, and give the tired hours your kindest attention.",
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

export const dailyHealthRows: BankRow[] = makeRows("daily.health", "en", cells);
