/**
 * EN weekly.love bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = relationship aggregate for the week, pb = Venus's band
 * for this area, retro = review when a Mercury/Jupiter/Saturn retrograde spans
 * the window). 24 cells × 4 variants, 45–70 words. Venus flavour: warmth,
 * listening, small gestures — fav = affection flows, neutral = bonds
 * indifferent, unfav = tender topics want patience and good timing. Challenging
 * cells stay constructive; review = gentle re-hearing/mending, never fear.
 * Week-arc texture mirrors daily-love.en.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Warmth flows through close relationships across the week, and small gestures land better than grand ones. Conversations soften early, old misunderstandings lose their grip, and forgiveness arrives before it is asked for. Say the kind things out loud this week, listen fully in return, and let midweek carry the gentlest hours.",
        "The heart's weather stays clear all week, with affection moving freely in both directions. People close to you are easier to reach than usual, and laughter arrives without effort. Share a meal, a walk, or simply an unhurried evening midweek, and see the warmth do the rest.",
        "Love responds generously this week: messages answer quickly, moods run light, and companionship feels effortless across the days. Venus favours beauty, so a tidy room or fresh flowers carry more meaning than usual. Give warmth openly early in the week and receive it just as openly by the weekend.",
        "Closeness comes easily this week, and the people who matter sense it without being told. Harmony is the week's quiet gift, available to anyone who reaches for it. Choose presence over plans, protect one unhurried evening together midweek, and let an ordinary weekend turn gently memorable.",
      ],
      review: [
        "Warmth flows through close relationships this week, with one retrograde note: an older thread wants revisiting. Conversations soften early and goodwill is abundant. Enjoy the ease, and gently reopen one unfinished talk midweek while the atmosphere is this forgiving; the weekend then closes warmer than the week began.",
        "The heart's weather stays clear this week, though the review current pulls one older memory back into view. Affection still moves freely in both directions. Welcome the memory without relitigating it, share an unhurried hour together, and let present-day warmth settle whatever the past still holds.",
        "Love responds generously this week, and the retrograde layer favours mending over launching. Moods run light, messages answer quickly, and old warmth feels freshly available. Pick up the one apology or clarification left unsaid, offer it simply early in the week, and see the weekend close the gap.",
        "Closeness comes easily this week, and the review undertone makes it deeper rather than different. Old conversations return looking smaller than they felt at the time. Meet them with present-day warmth, choose presence over plans, and let an ordinary weekend gently mend whatever the week stirred.",
      ],
    },
    neutral: {
      none: [
        "Your own warmth leads the week even where the surroundings stay plain, and that self-made glow is genuine. Nothing blocks affection and nothing crowns it either. Set the loving tone yourself on Monday, keep it steady through midweek, and let consistent kindness be the week's real romance.",
        "Relationships run on your initiative this week more than on any passing current, and that suits a steady heart. Ordinary affection behaves well: calls connect, plans hold, moods stay even. Use the strong form to organise the gathering or reunion you keep postponing, and let Friday reward it.",
        "A confident week for the heart on neutral ground: the sky offers clarity rather than drama. Feelings are readable all week, including your own. Name what you actually want from the people you love, say it plainly midweek, and let that honesty be the week's gift.",
        "Your emotional sense sharpens this week against a plain background, which is often the best combination. No noise distorts the signals, and no delay hides them. Use the clean view for one honest conversation early in the week, and let clear affection lead the rest of it.",
      ],
      review: [
        "Your own warmth leads the week on plain ground, with the retrograde layer asking for a gentle look back. Nothing blocks affection. Set the loving tone yourself, and revisit one old promise made in passing, honouring it properly this time; the weekend feels the difference. Small kept promises read as large ones now.",
        "Relationships run on your initiative this week, and the review current adds a useful habit: revisit before you assume. Ordinary affection behaves well throughout. Use the steady form to reconnect with someone the routine has drifted from, and let one unhurried call be the week's warmth.",
        "A confident week for the heart on neutral ground, with one exception: the sky prefers revisiting over launching. Feelings are readable, including your own. Reread an old message with this week's kinder eyes, answer it honestly midweek, and see the gentle reply be the gift. Honesty lands softer in weather like this.",
        "Your emotional sense sharpens this week against a plain background, while the review current pulls gently toward older connections. No noise distorts the signals. Use the clean view to tidy one unfinished emotional thread, and let clear affection close it before the weekend arrives. Closed threads leave the week lighter than it started.",
      ],
    },
    unfav: {
      none: [
        "The week's broader strength reaches your relationships too, though the deeper current asks for form and patience in matters of the heart. Warmth favours the deliberate and the punctual. Keep promises small and kept through the week, and the strong days still work generously for love.",
        "Bright energy rides through the week while the emotional channel underneath runs slow and formal. The combination rewards those who show up on time and mean what they say. Let reliability precede the romance early in the week, and the strength settles into lasting trust. Trust built this way holds its shape for months.",
        "Your overall form is high, though the relational current underneath prefers protocol over passion this week. Feelings move slowly and words arrive carefully. Do not push against the gate: offer what is asked, in the asked measure, and see the strong week carry the warmth. Patient offers land better than eager ones here.",
        "The broad week favours you, while a slower emotional current checks each gesture for sincerity. Treat the checking as protection rather than resistance. Move deliberately, keep every affection honest across the days, and the week still closes with warmth resting on your side. Sincerity checked and kept becomes quiet trust.",
      ],
      review: [
        "The week's broader strength reaches your relationships, though the emotional channel underneath runs slow and formal, re-checking its own history. Warmth favours the deliberate. Keep promises small and kept, revisit one older hurt gently midweek, and the strong days still work warmly for you. Gentle revisits done kindly stay settled afterwards.",
        "Bright energy rides through the week while the emotional channel underneath runs slow, formal and revision-minded. The combination rewards reliability and second passes. Let dependability precede the romance, correct the small misread kindly, and the week's strength settles into honest, lasting trust. Kindly corrected moments deepen a bond rather than darken it.",
        "Your overall form is high, though the relational current underneath prefers protocol and revision over passion this week. Feelings move slowly and words arrive carefully. Offer what is asked in the asked measure, rephrase where needed, and see the strong week carry the rest. Rephrased words often land better than first drafts.",
        "The wider week runs bright while the relational lane runs slow and revisits its older ground, a mismatch experience handles easily. Give the lane its ceremony and its corrections: unhurried words, kept times, one gentle apology. The week's brightness still covers your closest bonds. One sincere apology covers surprising distance this week.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Warmth moves at a friendly, workable pace this week, and the bonds behave. Steady affection lands where it should, without drama or distance, and midweek brings a small moment of closeness you did not plan. Keep the kind routines going and see the week build on them.",
        "The week offers solid relational ground and no surprises, which suits steady hearts well. Affection cooperates, small kindnesses return without asking, and the pace holds gently through Friday. Keep showing up as yourself, and let ordinary thoughtfulness do the quiet courtship on your behalf. Quiet courtship like this outlasts the grand kind.",
        "This week's heart weather is fair and mild, with a supportive current under ordinary exchanges. Your steadiness with the people you love reads clearly to them. Keep the small promises made in passing, and let that consistency earn the week's quiet, durable credit. Midweek suits the longer, unhurried conversation you saved.",
        "Conversations proceed smoothly this week, helped by a patient and well-disposed atmosphere. Difficult topics stay civil, plans hold their shape, and small requests meet warm answers. Steady attention across the days earns more here than one dramatic gesture ever would. Friday closes such a week with everyone still speaking warmly.",
      ],
      review: [
        "Warmth moves at a friendly pace this week, with bonds behaving and goodwill easy to find. The review current adds one gentle instruction: re-hear before you reply. Keep the steady rhythm, and listen once more to an older grievance midweek; it often sounds smaller now. Smaller grievances settle faster in weather like this.",
        "The week offers solid relational ground without surprises, which suits steady hearts. Underneath, a revision-friendly current asks for a second pass over older conversations. Keep the gentle rhythm, and give one unfinished discussion another unhurried hearing before midweek closes it properly. Discussions closed this properly rarely reopen themselves afterwards.",
        "This week's heart weather is fair, with a supportive current beneath ordinary exchanges. The sky also nudges you toward revisiting a recent misunderstanding. Continue as planned, treat the second hearing as progress rather than trouble, and Friday closes the week warmer than usual. Warmer closings come from just this kind of patience.",
        "Exchanges proceed smoothly this week, helped by a patient atmosphere around the people you love. The week's quieter instruction is to re-hear what someone said last week before answering it. Stay the course, and quietly become the person who listens twice and replies kindly. That kind of listening gets remembered longer than gifts.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary relational week with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards of kindness high without raising the stakes, and Friday closes the week with everyone feeling respected. Respect kept all week compounds into easy closeness.",
        "The bonds stay level and steady this week, neither warmer nor cooler than usual. Your constancy carries its usual quiet weight. Do the small caring things plainly in front of you, and see the evenness of the week be its own gentle advantage. Midweek suits the unhurried call you keep postponing.",
        "Relationships hold a steady middle path this week, with cooperation available and friction absent. Nothing needs heroics, and nothing rewards neglect either. Keep the small rituals going, close the open loops you can, and the week ends settled, if quietly. Settled and quiet is a respectable result in any week.",
        "The week runs at ordinary relational pace on an even, manageable field. Progress comes at the standard exchange rate: attention for affection. Choose the small gestures with visible warmth, make them properly across the middle days, and finish the week feeling connected. Connection maintained is the week's own quiet dividend.",
      ],
      review: [
        "A fair, ordinary relational week, with the retrograde undertone asking for a second hearing at the edges. Effort converts at the normal rate, patience included. Keep the kindness high, re-listen to one older complaint, and Friday closes with everyone feeling respected all the same. A second hearing often settles what a first could not.",
        "The bonds stay level and steady this week, neither warmer nor cooler, while older conversations resurface for a gentle review. Your constancy carries its usual weight. Answer the resurfaced items first with patience, then return to the ordinary pleasures, and see the evenness hold. Old threads answered early stop tugging at the week.",
        "Relationships hold a steady middle path this week, with one addition from the sky: hear it again before you answer. Cooperation is available and friction absent. Keep the small rituals going, add the second listening, and the week ends settled on balance. The second listening is where this week's warmth hides.",
        "The week runs at ordinary relational pace on an even field, while a review current draws older talks back into view. Progress still comes at the standard rate. Honour the re-hearing first, keep the small rituals going around it, and finish the week connected. Friday then closes without a single loose thread.",
      ],
    },
    unfav: {
      none: [
        "A workable relational week with one demanding seam through the tender topics: the deeper current wants patience and good timing. Ordinary warmth flows fine; the delicate conversations move slowly. Keep the tone gentle, keep your word carefully, and see the plain kindness shine by Friday. Plain kindness carries surprising weight in weeks like this.",
        "The week stays fair on the surface while the slower emotional channel underneath asks for proper timing. Improvised heart-to-hearts meet friction this week; prepared ones meet cooperation. Choose the calm route for anything tender, and let routine warmth carry the week's total. The calm route arrives sooner than the forceful one.",
        "Affection holds a decent pace this week with a single stiff knot: the tender topics prefer patience over passion. Respect the preference rather than fighting it. Raise the delicate matter gently midweek, and the rest of the week flows warmly enough. Matters raised this gently settle faster than pressed ones do.",
        "A fair relational week with a slow lane through the middle of it. The slow lane belongs to tender topics, apologies, and deeper conversations. Route those carefully and unhurriedly, keep the light warmth moving briskly, and Friday leaves everyone on good terms. Handled this way, the week ends with everyone content.",
      ],
      review: [
        "A workable relational week with a demanding seam through tender topics: the deeper current wants patience, timing, and re-hearing. Ordinary warmth flows fine; delicate conversations move slowly and return once. Keep the tone gentle, hear the older grievance out again, and let kindness shine through Friday.",
        "The week stays fair on the surface while the slower emotional channel underneath asks for timing and revision together. Improvised heart-to-hearts meet friction; the prepared meet patience. Choose the calm route for tender topics, and revisit one older apology midweek without complaint. Apologies renewed this calmly reset more than they cost.",
        "Affection holds a decent pace this week with a stiff knot: patience first, and the sky prefers revisiting over launching. Both point the same way, gentle and unhurried. Raise the delicate matter kindly, hear the older one out, and see the rest flow. Aligned currents like these soften the whole week's edges.",
        "A fair relational week with a slow lane through its middle, and this week the lane also returns older conversations for another hearing. Route the tender topics carefully, listen again patiently, and see the light warmth move briskly around the slow traffic. By Friday evening, both lanes feel warm and cleared.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Warmth moves at an even, ordinary pace this week, and the bonds stay steady but unspectacular. Affection still counts; it just expresses itself quietly. Keep the kind routines tight, answer messages promptly, and Friday closes the week on respectable, warm-enough terms. The small steady gestures carry quiet weeks like this one.",
        "The week offers fair, unremarkable relational conditions, helped along by a mild supportive current. Nothing dazzles, nothing strains. Choose two meaningful gestures, give them your honest attention, and by Friday the quiet accumulation shows in easier, warmer exchanges all round. Midweek suits the longer walk or the shared meal best.",
        "This week asks for patience more than passion on the heart's front. The mood stays even, responses come slowly, and closeness happens in modest steps. Work with the mild current instead of against it, and the days pass gently enough on balance. Save the deeper talks for a livelier week ahead.",
        "The week offers a plain relational rhythm with few surprises and mild warmth at the edges. Energy for grand gestures may lag where affection usually leads, and that is ordinary. Keep the commitments modest, honour the routines, and let quiet hours do their tending. Quiet tending now makes the brighter weeks warmer later.",
      ],
      review: [
        "Warmth moves at an even pace this week, with the retrograde undertone turning a few hours toward remembering. Affection still expresses itself quietly, patience included. Keep the kind routines tight, revisit one shared memory gently, and Friday closes the week on warm-enough terms. Memories revisited kindly tend to deepen the present as well.",
        "The week offers fair, unremarkable relational conditions with a mild revision current underneath. Nothing dazzles, nothing strains, and older conversations resurface gently. Give them a quiet hour midweek, keep the two main bonds warm, and Friday closes without loose feelings anywhere. A tidy week like this closes its own loops cleanly.",
        "This week asks for patience twice: once for its ordinary pace, once for the feelings that want re-hearing. The mood stays even throughout. Tend the essential bonds early, let the gentler review work fill the gaps, and the week passes without strain. Patience rather than passion is what this week rewards.",
        "The week offers a plain relational rhythm while small misunderstandings around words or plans surface midweek. None of it amounts to much. Slow down slightly, hear the unclear parts again, and see the rest of the week settle around that care. A soft word and a second hearing handle the rest.",
      ],
    },
    neutral: {
      none: [
        "The week's relational field sits level and undemanding, with neither help nor hindrance from the wider sky. Warmth rests on your own rhythm. Set a modest intention for the people you love on Monday, keep it without detours, and let steadiness be the reward. Intentions like this hold their shape through the whole week.",
        "A neutral but honest relational week, the kind that quietly strengthens bonds through repetition. Nothing bends your way, nothing blocks you either. Keep the small rituals realistic, keep the check-ins regular, and let steady hours do their patient work through Friday. Bonds strengthened quietly now hold firm in louder weeks.",
        "Relationships hold a steady middle path this week on an even, manageable field. Closeness is available at the standard exchange rate of attention for presence. Keep the rituals as written, tend what needs tending, and the week ends respectably connected. Midweek carries the best odds for one honest, unhurried talk.",
        "The relational sky sits level this week, offering a fair field and an honest pace. Nothing dazzles, and nothing interferes either. Decide what a good week for your bonds looks like, pursue it gently, and let consistency speak at the close. Lasting bonds are built in exactly such plain weeks.",
      ],
      review: [
        "The week's relational field sits level while the retrograde undertone turns some hours toward remembering. Warmth still rests on your rhythm. Set the modest intention, revisit one older conversation gently, and let careful pacing carry the week to a settled Friday. Pacing this carefully is its own quiet relational skill.",
        "A neutral but honest relational week, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep the rituals realistic, give the older conversations their second hearing, and let steady hours carry gently through Friday. Hearings given early in the week tend to cost least.",
        "Relationships hold a steady middle path this week, with one instruction from the sky: listen again before you conclude. Cooperation is available and friction absent. Keep the rituals going, add the second hearing, and the week closes on settled, respectful terms. The second hearing often reads softer than the first.",
        "The relational sky sits level this week while a review current tugs older conversations back for attention. Nothing dazzling, nothing straining, and a preference for revisiting recent words. Set the modest intention, listen as you go, and let gentleness be the reward. A gently closed Friday reads better than a dramatic Monday.",
      ],
    },
    unfav: {
      none: [
        "An ordinary relational week with one slow seam through the tender topics: the deeper current wants patience and timing. Light warmth flows fine; delicate conversations move at their own pace. Respect that pace, keep your word carefully, and the week passes gently. By Friday every bond is still exactly where you left it.",
        "The week stays level on the surface while the slower emotional channel underneath insists on good timing. Improvised heart-to-hearts meet friction; prepared ones meet cooperation. Raise the important matter through the calm door, in gentle words, and let routine warmth carry the rest. Gentleness given its right moment works twice as hard here.",
        "Affection holds a workable pace this week with one stiff patch: the tender topics want patience before passion. Give the slowness its due. Raise what matters gently and only once, keep your own warmth on lighter exchanges, and the week balances out. The stiffness here is purely timing, not indifference.",
        "A plain relational week with a demanding patch in the middle of it. The patch belongs to tender topics, apologies, and long conversations. Give that part its full patience, keep the light warmth moving freely, and Friday settles everything softly. Patience given early in the week keeps its whole tone gentle.",
      ],
      review: [
        "An ordinary relational week with a slow seam through tender topics, and the seam now also asks for re-hearing. Light warmth flows fine; delicate matters move slowly and return once. Respect both speeds, hear what comes back, and the week stays gentle. One patient return beats three rushed replies every time.",
        "The week stays level on the surface while the slower emotional channel underneath asks for timing and revision together. Improvised heart-to-hearts meet friction; the patient meet progress. Use the calm door for tender topics, revisit the older apology midweek, and let warmth carry on. Apologies revisited this well age kindly in any bond.",
        "Affection holds a workable pace this week with two quiet disciplines stacked: patience first, re-hearing second. Neither is a slight. Raise what matters gently, listen again to what returns, and keep your own warmth flowing on the lighter exchanges. Both disciplines turn out far gentler than they first appear.",
        "A plain relational week with a demanding patch in its middle, and this week the patch also returns older conversations for another hearing. Give the returns their patience promptly, keep the light warmth flowing, and let gentleness move briskly around the slow parts. Friday then finds the bonds quietly restored and warm.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual on close bonds, yet the supportive current still holds and still helps. The difficulty is pacing, not permanence. Keep expectations light, lean on the cooperative warmth early in the week, and see the weekend restore the ease. Any warmth received now deserves returning once the week eases.",
        "A heavier tone runs through the relational days, and conversations may feel tighter than their actual substance. The helpful part is structural: the steady rituals still work exactly as designed. Keep them going, postpone the deep talks without guilt, and rest easy together. Small shared moments count double in weeks like this.",
        "The week asks more from your bonds than the calendar suggests, though the cooperative current keeps a lane open. Take it: one kind conversation done well keeps the week from souring. Choose gentleness over force, and protect the calm evenings you share. That lane narrows by Friday, so walk it early.",
        "The week leans demanding on the heart's front, with obligations arriving in clusters and patience thinning by midweek. What helps: the affection around you stays reliable when little else does. Keep responses gentle, keep plans minimal, and see the weekend reset the tone. Steady affection is the week's one dependable gift.",
      ],
      review: [
        "The week presses harder than usual on close bonds, though the supportive current still holds and helps. Add the retrograde instruction: revisit before you react. Keep expectations light, hear the older grievance out early in the week, and see the weekend close it gently. The order you choose matters more than the speed you manage.",
        "A heavier tone runs through the relational days while the review current pulls attention toward older conversations. The helpful part is structural: the steady rituals still work, patience included. Keep them going, mend what returns kindly, and rest easy together each evening. What mends gently now tends to stay mended.",
        "The week asks heart-patience twice: for its own weight, and for the older matters returning for a second hearing. The cooperative current keeps a lane open for exactly this work. Walk it, mend what returns, and protect the calm evenings you share. The lane fits mending much better than it fits new debates.",
        "The week leans demanding emotionally, and part of the weight is older conversations knocking at awkward hours. The affection around you stays reliable through it. Meet each knock with a short, honest hearing, and keep the evenings genuinely calm together. Handled this way, Sunday feels like homecoming rather than escape.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones on the heart's front, and the field offers little cushion: relief comes only from steady, deliberate kindness. The difficulty is pacing, not permanence. Keep plans minimal, tend the essentials, and see the weekend restore what the days spend. Kindness kept modest but complete wins this kind of week.",
        "A demanding relational week on plain ground, where nothing extra arrives to help and no fresh trouble interferes either. Conversations feel tighter than their substance; patience closes the gap. Keep exchanges short and honest, rest deliberately, and Friday closes the week fairly. Short and honest beats long and strained every time.",
        "The week asks more than the calendar promises, mostly through small frictions and tired patience around the people you love. Nothing here is verdict-shaped; it is weather, and weather passes. Slow down deliberately, choose gentleness over force, and protect one quiet shared hour. The shared hour is tending, not idleness, in weeks like this.",
        "The week leans demanding without offering much relational support in return, which makes pacing the whole game. Obligations cluster, patience thins, and yet the essentials still fit if plans stay small. Keep responses gentle and see the weekend reset the tone together. Plans kept small and warm serve better than grand cold ones.",
      ],
      review: [
        "The week runs heavier than recent ones on the heart's front, and old conversations surface for mending inside the weight. The field offers little cushion, so order matters: revisit first, launch nothing new. Keep the list short, work gently, and see the weekend absorb the rest.",
        "A demanding relational week on plain ground, with older threads resurfacing at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each return with a short, honest hearing, rest deliberately between them, and Friday settles the week kindly. Hearings kept short and sincere let Friday settle everything kindly.",
        "The week asks patience twice over: for its own heaviness, and for the conversations that need re-hearing before anything settles. Take that as the week's shape instead of a judgment. Move gently, listen carefully, and rest early on the heavier days. Both kinds of patience are visibly rewarded by Sunday.",
        "The week leans demanding while a review current draws older conversations back into the open. Neither needs to fight the other. Accept the slower pace, hear out what returns, and leave fresh commitments for a clearer week ahead of you. A bond mended slowly serves the coming weeks better than speed.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides: its own weight, and an emotional channel that wants form at every step. Neither is personal. Keep words measured, keep promises carefully, do less but do it sincerely, and see the weekend restore the difference. Sincerity is the week's only shortcut, and it works.",
        "A heavy relational week meets a slow, exacting emotional channel, and conversations feel tighter than their real substance. The combination favours the patient and the sincere. Tend the essentials in gentle words, postpone the rest without guilt, and rest early each evening. Early evenings are what make the mornings kinder here.",
        "The week asks more than the calendar suggests, while the emotional channel checks every exchange for tone and timing. The pair feels heavy but stays manageable. Keep plans light, keep words immaculate in their kindness, and protect one genuinely quiet shared hour. That shared hour counts as tending, not indulgence, this week.",
        "The week leans demanding while the tender channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline them: rushed words cost double in weather like this. Keep plans minimal, keep exchanges complete, and see the weekend reset the tone. Slow complete words beat fast ones you later wish back.",
      ],
      review: [
        "The week presses from two sides, and the retrograde undertone adds a third: older conversations returning for mending. The stack feels heavy but stays orderly. Hear the returns first, park new debates, keep words sincere, and rest early each evening. Orderly weeks like this close far warmer than they began.",
        "A heavy relational week meets a slow channel that also asks for re-hearing this time. The combination favours the thorough over the quick, decisively. Hear out what returns, conclude nothing half-listened, keep plans light, and rest early each evening together. Listening thoroughly proves the fastest route of this whole week.",
        "The week asks patience three ways: its own weight, the tender channel's pace, and the conversations that need re-hearing. None of the three is personal. Take them in order, one at a time, keep words kind, and protect the quiet evenings. Taken in order, the week stays gentle and ends fine.",
        "The week leans demanding while the tender channel returns older conversations at its own rhythm. The mismatch tempts shortcuts, and short words cost double here. Hear the returns promptly, keep exchanges sincere, and leave fresh commitments for a clearer week. Next week inherits warmer ground if you manage this gently.",
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

export const weeklyLoveRows: BankRow[] = makeRows("weekly.love", "en", cells);
