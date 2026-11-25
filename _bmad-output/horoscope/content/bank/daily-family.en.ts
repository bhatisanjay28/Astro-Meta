/**
 * EN daily.family bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = domestic aggregate, pb = Saturn's band for this area —
 * family shares Saturn with career, structure/process/formality flavour — and
 * retro = review when a Mercury/Jupiter/Saturn retrograde falls in the window).
 * 24 cells × 6 variants, 35–55 words. fav = home order helps, neutral = household
 * indifferent, unfav = duties and elders ask patience/proper form. Household
 * content only (meals, elders, duties, repairs, routines); challenging cells
 * stay constructive; review = revisiting older domestic threads, never fear.
 * Mirrors daily-family.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Household matters flow generously today: meals come together easily, elders are pleased without effort, and the home feels lighter than its list. Tend the small domestic rituals patiently, note what works, and watch the good day carry the household.",
        "A warm, orderly day at home: conversations at the table stay kind, plans for the house move forward, and everyone finds their place without friction. Enjoy the harmony, keep the small promises to family, and watch the ease do its quiet work.",
        "The home catches the friendly corner of the sky today, and domestic life reads as simple arithmetic instead of a puzzle. Pending repairs settle, visits go well, and fair words pass easily. Welcome what the day offers without forcing more.",
        "The household's weather is warm and steady, with enough calm to make planning pleasant. Small comforts appear where you expected chores. Note them gratefully, share a little of the ease, and watch the momentum keep its own time.",
        "Your domestic instincts run accurate today, helped by a generous backdrop that favours honest, unhurried talk. Conversations about family matters land on receptive ears. Put the fair word in early, and watch the day's goodwill carry it home.",
        "Order marks the family side of today, the quiet kind that compounds rather than dazzles. Routines hold, meals arrive on time, and patience costs less than usual. Keep the simple discipline and watch the calm add its share.",
      ],
      review: [
        "Household matters flow generously today, with one retrograde instruction on top: verify before you commit. Meals and routines run on time, and re-checking keeps them that way. Enjoy the calm, and give each family arrangement a second look before fixing it.",
        "A warm, orderly day at home, though the review current asks for a gentle look at older plans. Conversations stay kind and the house cooperative. Enjoy the harmony, revisit one postponed family matter, and watch the ease settle it.",
        "The home catches the friendly corner of the sky today, and domestic life reads as simple arithmetic. The retrograde layer prefers mending over launching, so let repaired routines lead. Welcome what arrives on its own, and hold new arrangements for later.",
        "The household's weather is warm, with one modest caveat attached: family plans deserve a second pass today. Small comforts appear where you expected chores. Note them gratefully, re-check the arrangements, and let accuracy dress the harmony.",
        "Your domestic instincts run accurate today, with the review current standing quietly beside them. Conversations about family matters land on receptive ears. State the fair word early, re-check the details behind it, and let goodwill do the rest.",
        "Order marks the family side of today, the quiet kind that compounds, and the retrograde layer adds one habit: confirm before counting it settled. Routines hold, patience costs less. Keep the discipline, verify the plans, and watch the calm continue.",
      ],
    },
    neutral: {
      none: [
        "Domestic form is strong today even where the household stays plain: your own steadiness supplies the order. Nothing disrupts the home and nothing elevates it either. Set the day's family priority yourself, meet it cleanly, and let quiet order be the reward.",
        "The household runs on your effort today more than on any passing current, and that suits a steady hand. Meals behave, routines behave, moods behave. Use the strong form to organise rather than to celebrate, and the day closes with a settled home.",
        "A confident family day on neutral ground: the sky offers clarity rather than drama at home. Plans about the house and elders move easily because you are thinking straight. Write the arrangements down while they are this clear, and let order pay quietly.",
        "Your sense of the household sharpens today against a plain background, which is often the best combination. No noise disturbs the home, and no delay hides the small repairs. Use the clean view to set the week's domestic course, and let calm lead.",
        "Strong personal steadiness carries the family day, with the wider field neither helpful nor hostile. Decisions about routines, budgets and small duties land well. Keep the choices modest and well-communicated, and let your own calm be the day's real asset.",
        "The day gives plain domestic ground and unusually good judgement, a pairing worth using deliberately. Nothing dazzles and nothing disrupts. Decide what today's one useful family task is, complete it precisely, and watch the quiet order compound.",
      ],
      review: [
        "Domestic form is strong today even on plain ground, with the retrograde layer asking for recounts. Your own steadiness supplies the order. Set the day's family priority, meet it, and re-check each arrangement before you call it final.",
        "The household runs on your effort today, and the review current adds a useful habit: revisit before you decide. Meals behave, routines behave. Use the steady form to re-read the older family plans, and let re-checking be part of the order.",
        "A confident family day on neutral ground, with one exception: the sky prefers revisiting over fresh arrangements. Plans about the house move easily because you are thinking straight. Write the plans down, review them once, and hold new commitments for later.",
        "Your sense of the household sharpens today against a plain background, while the review current pulls gently toward older threads. No noise disturbs the home. Use the clean view for a second pass over recent family matters, and let calm find the small gaps.",
        "Strong personal steadiness carries the family day, with a retrograde preference folded in: correct rather than commit. Decisions about routines and duties land well when double-checked. Keep the choices modest, verify the details, and let calm be the real asset.",
        "The day gives plain domestic ground and unusually good judgement, with revision work woven through the hours. Nothing dazzles and nothing disrupts. Pick the family matter that most needs a second look, give it today's clean attention, and let order compound.",
      ],
    },
    unfav: {
      none: [
        "The day's broader strength reaches your household too, though the deeper current asks for form and patience at home. Family matters favour the documented and the punctual. Keep commitments clear, duties scheduled and words gentle, and the strong day still works.",
        "Warm energy rides through the day while the domestic channel underneath runs slow and formal. The combination rewards those who keep routines and respect elders' timelines. Let the proper form precede the optimism, and the strength settles into household calm.",
        "Your overall form is high, though the family current underneath prefers protocol over enthusiasm. Elders move slowly and discussions stay formal. Do not push against the gate: offer what is asked, in the asked manner, and watch the strong day carry it.",
        "The broad day favours you, while a slower domestic current checks each arrangement for completeness. Treat the checking as protection rather than resistance. Move deliberately, keep every family commitment clear, and the day still closes with peace on your side.",
        "Strong drive meets a careful household gate today, and the pairing favours the thorough. Bring requests to elders in the respectful shape, keep the asks modest and the timing right. Let the patient finish of today speak louder than speed would.",
        "The wider day runs bright while the domestic lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: unhurried words, kept timings, full consideration. Do that, and the day's brightness still covers your home.",
      ],
      review: [
        "The day's broader strength reaches your household, though the domestic channel underneath runs slow and formal, re-checking its own trail. Family matters favour the patient. Keep commitments clear, duties scheduled, words verified, and the strong day still works for home.",
        "Warm energy rides through the day while the domestic channel underneath runs slow, formal and revision-minded. The combination rewards routines, timings and second passes. Let proper form precede the optimism, correct the older misunderstandings, and the strength settles into calm.",
        "Your overall form is high, though the family current underneath prefers protocol and re-examination over enthusiasm. Elders move slowly and discussions stay formal. Offer what is asked in the asked manner, re-check it before restating, and watch the strong day carry the rest.",
        "The broad day favours you, while the slower domestic current checks each arrangement and asks corrections of older ones. Treat both as protection. Move deliberately, keep every family commitment clear, and the day still closes with peace on your side.",
        "Strong drive meets a careful household gate that is currently reviewing as much as it approves. The pairing favours the thorough. Bring requests in the respectful shape, revisit the returned ones gently, and watch the patient finish speak louder than speed would.",
        "The wider day runs bright while the domestic lane runs slow and re-checks its history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: unhurried words, kept timings, one gentle apology. The brightness still covers your home.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Household matters keep a friendly, workable rhythm today. Meals behave, elders are content, and conversations about family plans stay easy. Keep the domestic budget of time honest without squeezing it, and watch the steady current deepen the home's calm.",
        "The family day offers solid ground without surprises, which suits steady households well. Routine chores land, small visits go well, and nothing demands heroics. Lean in gently and let ordinary devotion to your home do its compounding.",
        "Today's domestic weather is fair and mild, with a supportive current under ordinary routines. Your reliability as the household's anchor reads clearly to the family. Keep the small promises made at breakfast, and let consistency earn its quiet credit.",
        "Home life proceeds smoothly today, helped by a patient and well-disposed backdrop. The schedule behaves, family conversations stay civil, and small requests meet warm answers. Steady attention now earns more than one grand gesture would manage.",
        "A pleasant, orderly rhythm settles over your household today. The frictions that usually slow the morning stay quiet. Do the next small right thing for the home, and watch the day's quiet goodwill attach itself to the family.",
        "Your home enjoys a calm, cooperative day with warmth arriving at a natural pace. The family member across the table seems receptive rather than rushed. Raise the small pending household topic today and watch the good mood help it along.",
      ],
      review: [
        "Household matters keep a friendly rhythm today, with the review current adding one instruction: hear fully before assuming. Meals behave and elders are content. Keep the home's routines honest, re-hear the older family complaint carefully, and watch the steady current deepen calm.",
        "The family day offers solid ground without surprises, while a revision-minded undertone asks for a second pass on an older domestic thread. Routine chores still land well. Lean in gently, revisit the small family grievance kindly, and let devotion do its work.",
        "Today's domestic weather is fair, with a supportive current under ordinary routines and a gentle call to revisit a recent family discussion. Your reliability reads clearly. Keep the small promises, and treat each re-hearing as quiet progress at home.",
        "Home life proceeds smoothly today, helped by a patient backdrop and a retrograde preference for mending over launching. The schedule behaves and conversations stay civil. Keep attention steady, hear the point half-heard before, and let warmth do the earning.",
        "A pleasant, orderly rhythm settles over your household today, with revision work folded quietly into the hours. The frictions stay quiet. Do the next small right thing, and give the older tender family topic its gentle second look.",
        "Your home enjoys a calm, cooperative day with warmth arriving at a natural pace, and one gentle call to review. The family member across the table seems receptive. Raise the small pending topic, hear the answer fully, and watch the mood help along.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary family day with mild support at the edges and no obstacles in the middle. Household effort converts at the normal rate. Keep the standards steady without raising the stakes, and the home pays its quiet dividend by evening.",
        "The household stays level and easy today, neither festive nor strained. Your caring routines carry their usual weight, and the family matches your tone. Do the plainly visible domestic task and watch the evenness be the day's quiet advantage.",
        "Family matters hold a steady middle path today, with cooperation available and resistance absent. Nothing needs drama, and nothing rewards neglect either. Work the routines as written, close the small open threads, and watch the day end affectionately.",
        "The domestic day runs at ordinary pace on an even, manageable field. Progress comes at the standard rate of exchange: attention for harmony. Choose the conversations with clear outcomes, hold them gently, and finish with a settled evening.",
        "A neutral but honest family day, the kind that quietly builds a home's trust. Nothing bends toward celebration, nothing blocks it either. Keep the commitments realistic, keep the listening genuine, and let steady habits do their patient deepening.",
        "The domestic sky sits level today, offering a fair field and an honest pace. Harmony depends mostly on your own rhythm. Set a modest intention for the household, carry it out without fanfare, and watch the satisfaction be its reward.",
      ],
      review: [
        "A fair, ordinary family day, with the retrograde undertone asking for a re-hearing at the edges. Household effort converts at the normal rate. Keep the standards steady, listen once more to the earlier family grievance, and the home settles quietly.",
        "The household stays level and easy today, neither festive nor strained, while older conversations resurface for review. Your caring routines carry their usual weight. Answer the resurfaced thread first, gently and briefly, and watch the evenness hold.",
        "Family matters hold a steady middle path today, with one addition from the sky: revisit before you conclude. Cooperation is available and resistance absent. Work the routines as written, add the second conversation, and watch the day end affectionately.",
        "The domestic day runs at ordinary pace on an even field, while a review current tugs at older threads. Progress still comes at the standard rate of exchange. Honour the revisiting first, hold the newer talks gently, and finish with a settled evening.",
        "A neutral but honest family day, with revision requests folded quietly into the hours. Nothing bends toward celebration and nothing blocks it. Keep commitments realistic, give the re-hearing its share of patience, and let steady habits deepen the home's trust.",
        "The domestic sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent words. Harmony rests on your rhythm. Set a modest intention, hear the other side once more, and let gentle accuracy be the reward.",
      ],
    },
    unfav: {
      none: [
        "A workable family day with one demanding seam through it: the deeper current wants patience and proper form. Ordinary routines go fine; sensitive family topics move slowly. Keep the tone respectful, keep the timing considerate, and watch the plain kindness shine.",
        "The domestic day stays fair on the surface while the slower channel underneath asks for careful handling. Haste meets friction today; gentleness meets cooperation. Choose soft words for anything that matters, and let routine household work set the tone.",
        "Family matters hold a decent pace today with a single stiff knot: the elder closest to the matter prefers form over feeling right now. Respect the preference rather than fighting it. Say what is needed plainly and respectfully, and the rest flows.",
        "A fair domestic day with a slow lane through its middle. The slow lane belongs to anything weighty — property, ceremonies, older grievances. Route those gently and unhurriedly, and keep the lighter household warmth moving briskly around them.",
        "The day gives ordinary family ground with one strict patch in it. The strict patch rewards preparation and penalises ambush. Raise the important family topic gently and at a good hour, keep casual chatter away from it, and the day passes cleanly.",
        "A steady, usable family day with a demanding undercurrent around sensitive matters. The undercurrent is not hostile, just slow and exacting. Give the sensitive part its full attention and privacy, keep your own tempo elsewhere, and close the day warmly.",
      ],
      review: [
        "A workable family day with a demanding seam through it: the deeper current wants patience, form, and re-hearing. Ordinary routines go fine; sensitive topics move slowly. Keep the tone respectful, re-listen before replying, and watch the plain kindness shine.",
        "The domestic day stays fair on the surface while the slower channel underneath asks for careful handling and gentle revision. Haste meets friction today; patience meets cooperation. Choose soft words for anything weighty, and revisit the older disagreement kindly.",
        "Family matters hold a decent pace today with a stiff knot: the elder closest to the matter prefers form, and the sky prefers revisiting over starting. Both point the same way — gentle, respectful, unhurried. Say what is needed plainly, and watch the rest flow.",
        "A fair domestic day with a slow lane through its middle, and today the lane also returns an older grievance for mending. The lane belongs to weighty matters — property, ceremonies, hurts. Route those gently, mend what resurfaces, and keep lighter warmth moving.",
        "The day gives ordinary family ground with one strict patch, and the patch currently reviews as much as it listens. Raise the important topic gently at a good hour, re-hear the answer before responding, and the day passes cleanly.",
        "A steady, usable family day with a demanding undercurrent around sensitive matters, now also marked by review. The undercurrent is not hostile, just slow and exacting. Give the sensitive part full attention and verified understanding, and close the day warmly.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Household matters stay on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands drama, and nothing blocks the warmth either. Keep the plans simple, tend the small rituals, and let ordinary hours deepen the home.",
        "The family day is uneventful in the best sense, with support available when you reach for it. Closeness comes at working pace, not sprint pace. Small, scheduled kindnesses suit the household better than any grand occasion.",
        "Your domestic life hums along at a moderate pitch today, helped by decent conditions underneath. Duties are real but manageable, and family members are present but unhurried. Divide the evening into small shared moments and let each carry its share.",
        "Home harmony neither leaps nor stalls today, and the underlying current is quietly on your side. Use the steadiness to repair rather than impress. Tidy the small misunderstanding, keep the evening gentle, and call it a fine day's care.",
        "The day holds steady for family matters, with mild favours available to those who ask early. Progress is possible, just not spectacular. Focus on presence over performance, and watch the week inherit a closer home.",
        "Household routines move at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up for the family. Keep the gestures modest, keep the listening genuine, and let goodwill accrue.",
      ],
      review: [
        "Household matters stay on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for revisiting over announcing. Keep the plans simple, and spend the spare moment hearing the family properly.",
        "The family day is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Tend the small rituals, and give one recent family exchange a calm second hearing.",
        "Your domestic life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours re-hearing what you assumed earlier. Divide the evening into small shared moments, and give one moment entirely to listening.",
        "Home harmony neither leaps nor stalls today, and the underlying current leans helpful. The retrograde undertone makes it a mending kind of day. Tidy the small misunderstanding, reread the message sent in haste, and let gentleness be today's contribution.",
        "The day holds steady for family matters, with mild favours for early askers. A revision-friendly atmosphere hangs over the second half. Focus on completing and mending what exists, and watch the brand-new family plans wait for clearer skies.",
        "Household routines move at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward hearing each other twice. Keep the gestures modest and the patience genuine before anything tender travels onward.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest family day with level conditions throughout and no special favours in play. The routines are ordinary and the outcomes ordinary too. Handle them warmly anyway, because plain days handled well are what lasting homes are quietly built from.",
        "The household runs at its most neutral setting today: fair, flat, and manageable. Nothing invites drama and nothing threatens it either. Keep the routines mechanical in the best sense, show up without improvising, and bank the calm for livelier days.",
        "Family matters sit in a level patch today where effort and harmony hold a fair exchange. The sky offers neither pushback nor applause. Choose the unhurried hour, spend it together cleanly, and watch the neutrality protect the home from noise.",
        "The domestic day moves evenly, with attention best spent on maintenance rather than grand occasions. The shared meal, the returned call, the remembered errand — the unglamorous layer that quietly supports everything else. Tend that layer today.",
        "A steady, unremarkable family day in which presence matters more than occasion. The hours respond to whoever keeps showing up. Sit together in clean, unhurried blocks, and watch the day's modest closeness stand on its own merits.",
        "The day offers domestic conditions as plain as a clear sky: nothing to chase, nothing to dodge. Use it for the care that needs no occasion at all. Sit, talk, finish the evening gently, and let simplicity itself be the achievement.",
      ],
      review: [
        "A plain, honest family day with level conditions and a retrograde preference for re-examination. The routines are ordinary and the outcomes ordinary too. Handle them warmly, add the second conversation, because plain days handled carefully build lasting homes.",
        "The household runs at its most neutral setting today: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites drama and nothing threatens it. Keep the routines steady, re-hear what you touched on earlier, and bank the calm.",
        "Family matters sit in a level patch today where effort and harmony hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose the unhurried hour, spend it together cleanly, and watch the honest re-hearing be the extra credit.",
        "The domestic day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. The shared meal, the returned call, the older topic awaiting its second look. Tend that layer, and calmer days inherit ground.",
        "A steady, unremarkable family day in which presence matters more than occasion, and listening more than presence. The hours respond to whoever keeps showing up. Sit together unhurried, hear each thread of talk fully once, and let modest closeness stand.",
        "The day offers domestic conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to chase, nothing to dodge. Review the recent trail of small words, tidy it gently, and let simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level family day with a slow, formal current underneath the ordinary routines. Nothing collapses and nothing breaks through either. Meet the current with steady patience and gentleness: soft words, good timing, punctual replies. It respects whoever respects its pace.",
        "The household runs neutral on the surface and stiff underneath, especially around sensitive family topics. Conversations move slowly and answers arrive carefully. Keep expectations plain, prepare before raising anything tender, and watch the ordinary affection define the day.",
        "Family matters hold an even, unhurried line today with one patch of resistance in it. The patch sits wherever property and older grievances live. Walk around it rather than through it: enjoy the free-flowing warmth, and leave the heavy topic for later.",
        "The domestic day moves at working pace with a demanding undertone around elders and procedure. The undertone is honest: it rewards gentleness and slows bluntness. Give it gentleness, skip the blunt edges, and the ordinary day passes with dignity intact.",
        "A flat but fair family day, with friction concentrated where old hurts live. People stay easy; the tender topics do not. Save warmth for the people and precision for the timing, and the day closes without any real damage.",
        "Household routines proceed ordinarily today while the emotional layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: speak properly, wait properly, follow up gently. The rest of today rewards that discipline.",
      ],
      review: [
        "A level family day with a slow, formal current underneath, and that current also wants older conversations re-heard. Nothing collapses and nothing breaks through. Meet it with steady patience and gentleness: soft words, good timing, one genuine re-hearing.",
        "The household runs neutral on the surface and stiff underneath, especially around sensitive topics, with revision requests folded in. Conversations move slowly and answers arrive carefully. Keep expectations plain, correct the small misread gently, and let affection define the day.",
        "Family matters hold an even, unhurried line today with one patch of resistance where older grievances live, and the patch currently reviews as much as it listens. Walk around rather than through: enjoy the warmth that flows, re-hear the heavy topic, and wait well.",
        "The domestic day moves at working pace with a demanding undertone around elders, and today the undertone also audits. It rewards gentleness and slows bluntness. Give it gentleness, correct what it flags, and the ordinary day passes with dignity intact.",
        "A flat but fair family day, with friction concentrated where old hurts live and a review mood layered over it. People stay easy; the tender topics do not. Save warmth for people, precision for timing, patience for returned grievances, and close gently.",
        "Household routines proceed ordinarily today while the emotional layer beneath moves slowly, deliberately, and with an eye on older words. Nothing about the slowness is personal. Match it: speak properly, correct gently, follow up kindly, and let discipline carry the rest.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "Family matters ask for patience today, even though the deeper current is quietly supportive. The surface feels tender, and household progress comes in increments rather than leaps. Choose the smallest kind gesture at home, make it well, and let that be enough.",
        "The domestic day leans demanding, though the ground beneath is kinder than it looks. Hurt feelings are possible if you measure today by yesterday's ease. Move through the family conversations gently, and protect one moment of genuine warmth.",
        "Household pressures press a little harder today, while support waits underneath for those who ask softly. Not every exchange at home feels smooth today, and that is acceptable. Aim for steady kindness instead of a perfect evening.",
        "Home closeness feels like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about timing. Keep the conversations small, and finish your day with one warm moment properly shared.",
        "The day tests your tenderness at home more than your patience, even with a supportive undertone below. Under the heaviness, gentleness and slowness still earn their reward. Reply kindly, keep the expectations modest, and let time do its share.",
        "Family duties feel heavier than their actual weight today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule the quiet moments deliberately, and watch the hardest conversation have your calmest hour.",
      ],
      review: [
        "Family matters ask for patience today, even with a quietly supportive current underneath. The tenderness on the surface is real, and part of it is old feelings resurfacing. Choose re-hearing over new arguments, and let gentleness be today's win.",
        "The domestic day leans demanding, though the ground beneath is kinder than it looks. Older grievances and older words resurface for calm revision. Meet them gently, accept the slower tempo, and treat the mending as today's real progress.",
        "Household pressures press a little harder today, while support waits underneath for those who ask softly. The retrograde mood turns attention toward unfinished conversations. Close one lingering small hurt, accept the modest evening, and consider the day honestly spent.",
        "Home closeness feels like wading today where yesterday was walking, and the slowdown is partly review rather than only resistance. Keep the conversations small, spend the quiet hour mending what you can, and watch the day close with one loop tied.",
        "The day tests your tenderness at home more than your patience today, with an undertone of revisiting old words. Gentleness and slowness still earn their reward beneath the surface. Reply kindly and slowly, and think twice before any firm word is sent.",
        "Family duties feel heavier than their weight today, and older conversations knock for attention. The friendly undertone rewards gentle persistence and careful re-reading. Schedule the quiet moments, revisit the oldest hurt gently, and watch the day settle quietly.",
      ],
    },
    neutral: {
      none: [
        "A demanding family day with no particular villain in it, just slow conversations and tired patience. The domestic ground neither helps nor harms. Keep the scope small, keep the tone soft, and watch the plain routine carry the home through to evening.",
        "The household moves under a heavier sky today, with delays and silences arriving without explanation. Nothing in the difficulty needs diagnosing; it passes with the day. Keep the essential warmth going, defer the heavy topics, and guard the evening's peace.",
        "Family matters carry a muted, effortful tone today, where each exchange asks twice the usual care. The sky is testing patience, not affection. Work in short gentle exchanges, rest between them, and treat a modest evening as complete.",
        "A heavy-handed day at home, where small words arrive with big weight attached. The wise response is smaller conversations and softer speech. Keep exchanges brief and kind, offer one genuine reassurance, and watch the rest of today breathe.",
        "The domestic day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower and quieter. Lower the expectations to whatever is essential, hold your patience visibly, and let evening restore warmth.",
        "Today's household atmosphere asks for endurance dressed as calm. Replies slow, conversations loop, and sensitivity rises by afternoon. Keep the plan minimal, keep the posture gentle, and give the tensest topic your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding family day with no particular villain in it, just slow conversations, tired patience, and older words asking to be re-heard. The ground neither helps nor harms. Keep the scope small, handle the review items first, and let routine carry the evening.",
        "The household moves under a heavier sky, with delays and returned grievances arriving without ceremony. Nothing in the difficulty needs diagnosing; it passes with the day. Hear the returned grievance once, defer the heavy topics, and guard the evening's peace.",
        "Family matters carry a muted, effortful tone today, where each exchange asks twice the usual care, and revision work sits at the top of the pile. The sky is testing patience, not affection. Begin with the re-hearing, work gently, and rest after.",
        "A heavy-handed day at home, where small words arrive with big weight and old conversations with correction notes attached. The wise response is smaller conversations and careful mending. Keep exchanges brief, close one clean repair, and watch the day breathe.",
        "The domestic day runs thick and slow, with a backward pull toward half-finished older conversations. Nothing is wrong exactly; everything is slower and half of it needs a second hearing. Lower the expectations, close one review item gently, and let evening restore.",
        "Today's household atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every exchange. Replies slow, conversations loop, and older words resurface. Keep the plan minimal, verify before reacting, and give the tensest topic your kindest attention.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on family matters, with slow replies and thin patience on both sides. The wise posture is small, gentle and unbothered. Offer the one required reassurance properly, step back from the rest, and watch tomorrow carry fresh air.",
        "A stiff, demanding domestic day where conversations respond slowly and moods run short. Pushing harder today achieves less than waiting well. Keep the words few and respectful, put the important things gently, and protect the evening from carry-over hurt.",
        "Family matters sit in today's shadow, with warmth slow and discussions formal. The day is testing posture more than affection. Stand steady: keep the small courtesies going, avoid the sensitive ground, and let a quiet finish be the victory.",
        "The domestic day presents friction in layers today — slow replies, short tempers, tender spots. None of the layers need solving at once. Step on only the safest path, keep the tone level, and save the deeper conversations for a lighter day.",
        "A slow, heavy family day in which warmth meets pride that refuses to soften quickly. Fighting the pride costs more than it returns. Work around it gently, keep the expectations small and the words kind, and let patience be today's skill.",
        "Today the home's world seems to move in syrup while you move in air, and the mismatch wears on the spirit. Accept the pace without argument. Give what gives easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on family matters, with slow replies, thin patience, and older hurts resurfacing for mending. The wise posture is small, gentle and unbothered. Offer the required reassurance, mend one returned feeling gently, and let tomorrow carry fresh air.",
        "A stiff, demanding domestic day where conversations respond slowly and returned grievances ask for care. Pushing harder today achieves less than mending well. Keep the words few and respectful, tend what comes back, and protect the evening from carry-over hurt.",
        "Family matters sit in today's shadow, with warmth slow, discussions formal, and a review mood on top. The day is testing posture more than affection. Stand steady: keep the courtesies going, mend what returns, and let a quiet finish be enough.",
        "The domestic day presents friction in layers today — slow replies, short tempers, returned grievances. None of the layers need solving at once. Mend only the top one cleanly, keep the tone level, and save the deeper talks for a lighter day.",
        "A slow, heavy family day in which warmth meets unhurried pride, and the pride is also reviewing its recent history. Fighting either costs more than it returns. Work around it gently, tend what it flags, and let patience be today's skill.",
        "Today the home's world seems to move in syrup, with a backward current pulling attention to older words. Accept the pace without argument. Give what gives easily, re-hear one resurfaced grievance properly, and close the day gently.",
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

export const dailyFamilyRows: BankRow[] = makeRows("daily.family", "en", cells);
