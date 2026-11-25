/**
 * EN daily.love bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = relationship aggregate, pb = Venus's band for this area,
 * retro = review when a Mercury/Jupiter/Saturn retrograde falls in the window).
 * 24 cells × 6 variants, 35–55 words. Venus flavour: warmth, listening, small
 * gestures — fav = affection flows, neutral = bonds indifferent, unfav = tender
 * topics want patience and good timing. Challenging cells stay constructive;
 * review = gentle re-hearing/mending, never fear. Mirrors daily-love.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Warmth flows easily in close relationships today, and small gestures land better than grand ones. Conversations soften at the edges, and old misunderstandings lose their grip. Say the kind thing out loud, listen fully in return, and watch the day be gently generous.",
        "The heart's weather is clear today, with affection moving freely in both directions. People close to you seem easier to reach, and laughter arrives without effort. Share a meal, a walk, or simply an unhurried hour, and watch the warmth do the rest.",
        "Love responds generously today: texts answer quickly, moods run light, and companionship feels effortless. The Venus touch favours beauty, so fresh flowers or a tidy room carry more meaning than usual. Give warmth openly and receive it just as openly.",
        "Closeness comes easily today, and the people who matter sense it without being told. Harmony is the day's quiet gift, available to anyone who reaches for it. Choose presence over plans, and let an ordinary evening turn gently memorable.",
        "Affection finds its mark today, and old warmth between partners feels freshly available. The atmosphere forgives small clumsy words and rewards sincere ones. Speak simply, touch base with the people you care for, and watch the day's softness carry you both.",
        "The day opens channels that habit often keeps half-closed: easier words, warmer silences, quicker forgiveness. Romance reads the room kindly. Trust this ease, offer the gesture you have been postponing, and watch the goodwill double itself between you.",
      ],
      review: [
        "Warmth flows easily in close relationships today, with one retrograde note: an older thread wants revisiting. Conversations soften, and goodwill is abundant. Enjoy the ease, and gently reopen one unfinished talk while the atmosphere is this forgiving.",
        "The heart's weather is clear today, though the review current pulls one older memory back into view. Affection still moves freely in both directions. Welcome the memory without relitigating it, share an unhurried hour, and let warmth settle the past.",
        "Love responds generously today, and the retrograde layer favours mending over launching. Moods run light, texts answer quickly. Pick up the one apology or clarification left unsaid, offer it simply, and watch the day's softness close the gap.",
        "Closeness comes easily today, and the review undertone makes it deeper rather than different. Old conversations return looking smaller than they felt. Meet them with present-day warmth, choose presence over plans, and let an ordinary evening gently mend.",
        "Affection finds its mark today, with a gentle pull toward revisiting shared history. The atmosphere forgives small clumsy words and rewards sincere ones. Speak simply, look back kindly together, and watch the day's softness carry you both forward.",
        "The day opens warmer channels between you and yours, and the retrograde layer asks for one pass over older ground. Quicker forgiveness is available. Trust this ease, revisit the small hurt gently, and watch the goodwill reset itself between you.",
      ],
    },
    neutral: {
      none: [
        "Your own warmth leads the day even where the surroundings stay plain, and that self-made glow is genuine. Nothing blocks affection and nothing crowns it either. Set the loving tone yourself, and let steady kindness be the day's real romance.",
        "Relationships run on your initiative today more than on any passing current, and that suits a steady heart. Ordinary affection behaves well: calls connect, plans hold, moods stay even. Use the strong form to organise the gathering you keep postponing.",
        "A confident day for the heart on neutral ground: the sky offers clarity rather than drama. Feelings are readable, including your own. Name what you actually want from the people you love, say it plainly, and watch the honesty be the gift.",
        "Your emotional sense sharpens today against a plain background, which is often the best combination. No noise distorts the signals, and no delay hides them. Use the clean view for one honest conversation, and let clear affection lead.",
        "Strong personal presence carries the relational day, with the wider field neither warm nor cold. Others respond to your steadiness more than to circumstances. Keep the gestures modest and sincere, and let your own calm be the day's attraction.",
        "The day gives plain emotional ground and unusually good instincts, a pairing worth using deliberately. Nothing dazzles and nothing blocks. Decide what today's one loving act is, perform it without announcement, and let quiet confidence carry the connection.",
      ],
      review: [
        "Your own warmth leads the day on plain ground, with the retrograde layer asking for a gentle look back. Nothing blocks affection. Set the loving tone yourself, and revisit one old promise made in passing, honouring it properly this time.",
        "Relationships run on your initiative today, and the review current adds a useful habit: revisit before you assume. Ordinary affection behaves well. Use the steady form to reconnect with someone the routine has drifted from, and watch the call be the day's warmth.",
        "A confident day for the heart on neutral ground, with one exception: the sky prefers revisiting over launching. Feelings are readable, including your own. Reread an old message with today's kinder eyes, and watch the honest reply be the gift.",
        "Your emotional sense sharpens today against a plain background, while the review current pulls gently toward older connections. No noise distorts the signals. Use the clean view to tidy one unfinished emotional thread, and let clear affection close it.",
        "Strong personal presence carries the relational day, with a retrograde preference folded in: mend rather than begin. Others respond to your steadiness. Keep the gestures modest, revisit the relationship that needs a small repair, and let calm do the attracting.",
        "The day gives plain emotional ground and unusually good instincts, with revision work woven through the hours. Nothing dazzles and nothing blocks. Pick the connection that most needs a second look, give it today's clean attention, and let confidence carry it.",
      ],
    },
    unfav: {
      none: [
        "The day's broader strength reaches your relationships too, though the deeper current asks for form and patience in matters of the heart. Warmth favours the deliberate and the punctual. Keep promises small and kept, and the strong day still works for love.",
        "Bright energy rides through the day while the emotional channel underneath runs slow and formal. The combination rewards those who show up on time and mean what they say. Let reliability precede the romance; the strength settles into trust.",
        "Your overall form is high, though the relational current underneath prefers protocol over passion. Feelings move slowly and words arrive carefully. Do not push against the gate: offer what is asked, in the asked measure, and watch the strong day carry it.",
        "The broad day favours you, while a slower emotional current checks each gesture for sincerity. Treat the checking as protection rather than resistance. Move deliberately, keep every affection honest, and the day still closes with warmth on your side.",
        "Strong drive meets a careful heart-gate today, and the pairing favours the patient. Grand declarations meet formality; quiet consistency meets welcome. Let the sincere finish of today speak louder than any dramatic one ever would.",
        "The wider day runs bright while the relational lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: unhurried words, kept times, gentle attention. Do that, and the day's brightness still covers your closest bonds.",
      ],
      review: [
        "The day's broader strength reaches your relationships, though the emotional channel underneath runs slow and formal, re-checking its own history. Warmth favours the deliberate. Keep promises small and kept, revisit one older hurt gently, and the strong day still works for love.",
        "Bright energy rides through the day while the emotional channel underneath runs slow, formal and revision-minded. The combination rewards reliability and second passes. Let dependability precede the romance, correct the small misread kindly, and the strength settles into trust.",
        "Your overall form is high, though the relational current underneath prefers protocol and revision over passion. Feelings move slowly and words arrive carefully. Offer what is asked in the asked measure, rephrase where needed, and watch the strong day carry the rest.",
        "The broad day favours you, while the slower emotional current checks each gesture for sincerity and asks corrections of older misunderstandings. Treat both as protection. Move deliberately, keep every affection honest, and the day still closes with warmth on your side.",
        "Strong drive meets a careful heart-gate that is currently reviewing as much as it welcomes. The pairing favours the patient. Grand declarations meet formality; quiet consistency and one honest revision meet warmth. Let the sincere finish speak loudest.",
        "The wider day runs bright while the relational lane runs slow and revisits its older ground, a mismatch experience handles easily. Give the lane its ceremony and its corrections: unhurried words, kept times, one gentle apology. The brightness still covers your bonds.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Relationships keep a friendly, workable rhythm today. Conversations flow without friction, and small affections land where they are aimed. Keep the connection honest without overthinking it, and watch the steady current deepen the bond by evening.",
        "The emotional day offers solid ground without surprises, which suits steady hearts well. Routine affection works: the shared meal, the evening call, the small errand done together. Lean in gently and let ordinary devotion do its quiet compounding.",
        "Today's relational weather is fair and mild, with a supportive current under ordinary exchanges. Your steadiness reads clearly to the people who matter. Keep the small promises made in passing, and let consistency earn its quiet credit.",
        "Affection proceeds smoothly today, helped by a patient and well-disposed backdrop. The household behaves, conversations stay civil, and small requests meet warm answers. Steady attention now earns more warmth than one grand gesture would manage, so keep showing up.",
        "A pleasant, orderly rhythm settles over your relationships today, and the defenses that usually slow conversations stay down. Do the next small kind thing without announcing it, and watch the day's quiet goodwill attach itself to the bond.",
        "Your bonds enjoy a calm, cooperative day with warmth arriving at a natural pace. The person across the table seems receptive rather than rushed. Raise the small pending topic today and watch the good mood help it along.",
      ],
      review: [
        "Relationships keep a friendly rhythm today, with the review current adding one instruction: listen twice before assuming. Conversations flow without friction. Keep the connection honest, re-hear the older complaint carefully, and watch the steady current deepen the bond.",
        "The emotional day offers solid ground without surprises, while a revision-minded undertone asks for a second pass on an older hurt. Routine affection still works well. Lean in gently, revisit the small grievance kindly, and let devotion do its compounding.",
        "Today's relational weather is fair, with a supportive current under ordinary exchanges and a gentle call to revisit a recent disagreement. Your steadiness reads clearly. Keep the small promises, and treat each re-hearing as quiet progress between you.",
        "Affection proceeds smoothly today, helped by a patient backdrop and a retrograde preference for mending over launching. The household behaves and conversations stay civil. Keep attention steady, hear the point you half-heard before, and let warmth do the earning.",
        "A pleasant, orderly rhythm settles over your relationships today, with revision work folded quietly into the hours. The defenses stay down. Do the next small kind thing, and give the older tender topic its gentle second look.",
        "Your bonds enjoy a calm, cooperative day with warmth arriving at a natural pace, and one gentle call to review. The person across the table seems receptive. Raise the small pending topic, hear the answer fully, and watch the mood help along.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary relational day with mild support at the edges and no obstacles in the middle. Exchanges proceed at the normal rate. Keep the warmth steady without raising the stakes, and the bond pays its quiet dividend by evening.",
        "The relationships stay level and easy today, neither sparkling nor strained. Your caring habits carry their usual weight, and the household matches your tone. Do the plainly visible kind act and watch the evenness be the day's quiet advantage.",
        "Bonds hold a steady middle path today, with cooperation available and resistance absent. Nothing needs drama, and nothing rewards neglect either. Keep the small rituals intact, close the small silences, and watch the day end affectionately.",
        "The relational day runs at ordinary pace on an even, manageable field. Progress comes at the standard rate of exchange: attention for closeness. Choose the conversations with clear outcomes, hold them gently, and finish with a settled evening.",
        "A neutral but honest day in relationships, the kind that quietly builds trust. Nothing bends toward romance, nothing blocks it either. Keep the commitments realistic, keep the listening genuine, and let steady habits do their patient deepening.",
        "The relational sky sits level today, offering a fair field and an honest pace. Closeness depends mostly on your own rhythm. Set a modest intention for the people you love, carry it out without fanfare, and watch the satisfaction be its reward.",
      ],
      review: [
        "A fair, ordinary relational day, with the retrograde undertone asking for a re-hearing at the edges. Exchanges proceed at the normal rate. Keep the warmth steady, listen once more to the earlier grievance, and the bond settles quietly by evening.",
        "The relationships stay level and easy today, neither sparkling nor strained, while older conversations resurface for review. Your caring habits carry their usual weight. Answer the resurfaced thread first, gently and briefly, and watch the evenness hold.",
        "Bonds hold a steady middle path today, with one addition from the sky: revisit before you conclude. Cooperation is available and resistance absent. Keep the small rituals intact, add the second conversation, and watch the day end affectionately.",
        "The relational day runs at ordinary pace on an even field, while a review current tugs at older threads. Progress still comes at the standard rate of exchange. Honour the revisiting first, hold the newer talks gently, and finish with a settled evening.",
        "A neutral but honest day in relationships, with revision requests folded quietly into the hours. Nothing bends toward romance and nothing blocks it. Keep commitments realistic, give the re-hearing its share of patience, and let steady habits deepen the trust.",
        "The relational sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent words. Closeness rests on your rhythm. Set a modest intention, hear the other side once more, and let gentle accuracy be the reward.",
      ],
    },
    unfav: {
      none: [
        "A workable relational day with one demanding seam through it: the deeper current wants patience and proper form. Ordinary warmth goes fine; sensitive topics move slowly. Keep the tone respectful, keep the timing considerate, and watch the plain kindness shine.",
        "The emotional day stays fair on the surface while the slower channel underneath asks for careful handling. Haste meets friction today; gentleness meets cooperation. Choose soft words for anything that matters, and let routine affection set the tone.",
        "Bonds hold a decent pace today with a single stiff knot: the person closest to the matter prefers form over feeling right now. Respect the preference rather than fighting it. Say what is needed plainly and kindly, and the rest of today flows.",
        "A fair relational day with a slow lane through its middle. The slow lane belongs to anything weighty — decisions, promises, older grievances. Route those gently and unhurriedly, and keep the lighter warmth moving briskly around them.",
        "The day gives ordinary relational ground with one strict patch in it. The strict patch rewards preparation and penalises ambush. Raise the important topic gently and at a good hour, keep casual banter away from it, and the day passes cleanly.",
        "A steady, usable relational day with a demanding undercurrent around sensitive matters. The undercurrent is not hostile, just slow and exacting. Give the sensitive part its full attention and privacy, keep your own tempo elsewhere, and close the day warmly.",
      ],
      review: [
        "A workable relational day with a demanding seam through it: the deeper current wants patience, form, and re-hearing. Ordinary warmth goes fine; sensitive topics move slowly. Keep the tone respectful, re-listen before replying, and watch the plain kindness shine.",
        "The emotional day stays fair on the surface while the slower channel underneath asks for careful handling and gentle revision. Haste meets friction today; patience meets cooperation. Choose soft words for anything weighty, and revisit the older disagreement kindly.",
        "Bonds hold a decent pace today with a stiff knot: the person closest to the matter prefers form, and the sky prefers revisiting over starting. Both point the same way — gentle, unhurried, considered. Say what is needed plainly, and watch the rest flow.",
        "A fair relational day with a slow lane through its middle, and today the lane also returns an older grievance for mending. The lane belongs to weighty matters — decisions, promises, hurts. Route those gently, mend what resurfaces, and keep lighter warmth moving.",
        "The day gives ordinary relational ground with one strict patch, and the patch currently reviews as much as it listens. Raise the important topic gently at a good hour, re-hear the answer before responding, and the day passes cleanly.",
        "A steady, usable relational day with a demanding undercurrent around sensitive matters, now also marked by review. The undercurrent is not hostile, just slow and exacting. Give the sensitive part full attention and verified understanding, and close the day warmly.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Relationships stay on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands drama, and nothing blocks the warmth either. Keep the plans simple, tend the small rituals, and let ordinary hours deepen the bond.",
        "The relational day is uneventful in the best sense, with support available when you reach for it. Closeness comes at working pace, not sprint pace. Small, scheduled kindnesses suit the bond better than any grand reshuffle.",
        "Your emotional life hums along at a moderate pitch today, helped by decent conditions underneath. Feelings are real but manageable, and counterparts are present but unhurried. Divide the evening into small shared moments and let each carry its share.",
        "Affection neither leaps nor stalls today, and the underlying current is quietly on your side. Use the steadiness to repair rather than impress. Tidy the small misunderstanding, keep the evening gentle, and call it a fine day's relating.",
        "The day holds steady for matters of the heart, with mild favours available to those who ask early. Warmth is possible, just not spectacular. Focus on presence over performance, and watch the week inherit a closer bond.",
        "Exchanges move at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up for each other. Keep the gestures modest, keep the listening genuine, and watch the goodwill accrue.",
      ],
      review: [
        "Relationships stay on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for revisiting over announcing. Keep the plans simple, and spend the spare moment hearing the person properly.",
        "The relational day is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Tend the small rituals, and give one recent exchange a calm second hearing.",
        "Your emotional life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours re-hearing what you assumed earlier. Divide the evening into small shared moments, and give one moment entirely to listening.",
        "Affection neither leaps nor stalls today, and the underlying current leans helpful. The retrograde undertone makes it a mending kind of day. Tidy the small misunderstanding, reread the message sent in haste, and let gentleness be today's contribution.",
        "The day holds steady for matters of the heart, with mild favours for early askers. A revision-friendly atmosphere hangs over the second half. Focus on completing and mending what exists, and watch the brand-new conversations wait for clearer skies.",
        "Exchanges move at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward hearing each other twice. Keep the gestures modest and the patience genuine before anything tender travels onward.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest relational day with level conditions throughout and no special favours in play. The exchanges are ordinary and the outcomes ordinary too. Handle them warmly anyway, because plain days handled well are what lasting closeness is built from.",
        "The heart runs at its most neutral setting today: fair, flat, and manageable. Nothing invites drama and nothing threatens it either. Keep the rituals mechanical in the best sense, show up without improvising, and bank the calm for livelier days.",
        "Feelings sit in a level patch today where effort and closeness hold a fair exchange. The sky offers neither pushback nor applause. Choose the unhurried hour, spend it together cleanly, and watch the neutrality protect the bond from noise.",
        "The relational day moves evenly, with attention best spent on maintenance rather than grand gestures. The shared meal, the returned call, the remembered date — the unglamorous layer that quietly supports everything else. Tend that layer today, and the livelier days inherit solid ground.",
        "A steady, unremarkable relational day in which presence matters more than passion. The hours respond to whoever keeps showing up. Sit together in clean, unhurried blocks, and watch the day's modest closeness stand on its own merits.",
        "The day offers relational conditions as plain as a clear sky: nothing to chase, nothing to dodge. Use it for the closeness that needs no occasion at all. Sit, talk, finish the evening gently, and let simplicity itself be the achievement.",
      ],
      review: [
        "A plain, honest relational day with level conditions and a retrograde preference for re-examination. The exchanges are ordinary and the outcomes ordinary too. Handle them warmly, add the second conversation, because plain days handled carefully build lasting closeness.",
        "The heart runs at its most neutral setting today: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites drama and nothing threatens it. Keep the rituals steady, re-hear what you touched on earlier, and bank the calm.",
        "Feelings sit in a level patch today where effort and closeness hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose the unhurried hour, spend it together cleanly, and watch the honest re-hearing be the extra credit.",
        "The relational day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. The shared meal, the returned call, the older topic awaiting its second look. Tend that layer, and livelier days inherit solid ground.",
        "A steady, unremarkable relational day in which presence matters more than passion, and listening more than presence. The hours respond to whoever keeps showing up. Sit together unhurried, hear each block of talk fully once, and let modest closeness stand.",
        "The day offers relational conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to chase, nothing to dodge. Review the recent trail of small words, tidy it gently, and let simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level relational day with a slow, formal current underneath the ordinary exchanges. Nothing collapses and nothing breaks through either. Meet the current with steady patience and gentleness: soft words, good timing, punctual replies. The day respects whoever respects its pace.",
        "The heart runs neutral on the surface and stiff underneath, especially around sensitive topics. Conversations move slowly and answers arrive carefully. Keep expectations plain, prepare before raising anything tender, and watch the ordinary affection define the day.",
        "Bonds hold an even, unhurried line today with one patch of resistance in it. The patch sits wherever old grievances live. Walk around it rather than through it: enjoy what is free to flow, and leave the heavy topic for a friendlier hour.",
        "The relational day moves at working pace with a demanding undertone around pride and procedure. The undertone is honest: it rewards gentleness and slows bluntness. Give it gentleness, skip the blunt edges, and the ordinary day passes with dignity intact.",
        "A flat but fair day in relationships, with friction concentrated where old hurts live. People stay easy; the tender topics do not. Save warmth for the people and precision for the timing, and the day closes without any real damage.",
        "Conversations proceed ordinarily today while the emotional layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: speak properly, wait properly, follow up gently. The rest of today rewards whoever keeps that discipline.",
      ],
      review: [
        "A level relational day with a slow, formal current underneath, and that current also wants older conversations re-heard. Nothing collapses and nothing breaks through. Meet it with steady patience and gentleness: soft words, good timing, one genuine re-hearing.",
        "The heart runs neutral on the surface and stiff underneath, especially around sensitive topics, with revision requests folded in. Conversations move slowly and answers arrive carefully. Keep expectations plain, correct the small misread gently, and let ordinary affection define the day.",
        "Bonds hold an even, unhurried line today with one patch of resistance where old grievances live, and the patch currently reviews as much as it listens. Walk around rather than through: enjoy the free-flowing warmth, re-hear the heavy topic, and wait well.",
        "The relational day moves at working pace with a demanding undertone around pride, and today the undertone also audits. It rewards gentleness and slows bluntness. Give it gentleness, correct what it flags, and the ordinary day passes with dignity intact.",
        "A flat but fair day in relationships, with friction concentrated where old hurts live and a review mood layered over it. People stay easy; the tender topics do not. Save warmth for people, precision for timing, patience for returned grievances, and close gently.",
        "Conversations proceed ordinarily today while the emotional layer beneath moves slowly, deliberately, and with an eye on older words. Nothing about the slowness is personal. Match it: speak properly, correct gently, follow up kindly, and let discipline carry the rest.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "Matters of the heart ask for patience today, even though the deeper current is quietly supportive. The surface feels tender, and closeness comes in increments rather than leaps. Choose the smallest kind gesture, make it well, and let that be enough.",
        "The relational day leans demanding, though the ground beneath is kinder than it looks. Hurt feelings are possible if you measure today by yesterday's ease. Move through the conversations gently, and protect one moment of genuine warmth.",
        "Emotions press a little harder today, while support waits underneath for those who ask softly. Not every exchange feels smooth today, and that is entirely acceptable. Aim for steady kindness through the day rather than one perfect conversation, and let that be the win.",
        "Closeness feels like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about timing. Keep the conversations small, and finish your day with one warm moment properly shared.",
        "The day tests your tenderness more than your patience, even with a supportive undertone below. Under the heaviness, gentleness and slowness still earn their reward. Reply kindly, keep the expectations modest, and let time do its share.",
        "Affection feels heavier than its actual weight today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule the quiet moments deliberately, and watch the hardest conversation have your calmest hour.",
      ],
      review: [
        "Matters of the heart ask for patience today, even with a quietly supportive current underneath. The tenderness on the surface is real, and part of it is old feelings resurfacing. Choose re-hearing over new arguments, and let gentleness be today's win.",
        "The relational day leans demanding, though the ground beneath is kinder than it looks. Older grievances and older words resurface for calm revision. Meet them gently, accept the slower tempo, and treat the mending as today's real progress.",
        "Emotions press a little harder today, while support waits underneath for those who ask softly. The retrograde mood turns attention toward unfinished conversations. Close one lingering small hurt, accept the modest evening, and consider the day honestly spent.",
        "Closeness feels like wading today where yesterday was walking, and the slowdown is partly review rather than only resistance. Keep the conversations small, spend the quiet hour mending what you can, and watch the day close with one loop tied.",
        "The day tests your tenderness more than your patience today, with an undertone of revisiting old words. Gentleness and slowness still earn their reward beneath the surface. Reply kindly and slowly, and think twice before any firm word is sent.",
        "Affection feels heavier than its weight today, and older conversations knock for attention. The friendly undertone rewards gentle persistence and careful re-reading. Schedule the quiet moments, revisit the oldest hurt gently, and watch the day settle quietly.",
      ],
    },
    neutral: {
      none: [
        "A demanding relational day with no particular villain in it, just slow conversations and tired patience. The emotional ground neither helps nor harms. Keep the scope small, keep the tone soft, and watch the plain routine carry the bond through to evening.",
        "The heart moves under a heavier sky today, with delays and silences arriving without explanation. Nothing in the difficulty needs diagnosing; it passes with the day. Keep the essential warmth going, defer the heavy topics, and guard the evening's peace.",
        "Matters of the heart carry a muted, effortful tone today, where each exchange asks twice the usual care. The sky is testing patience, not affection. Work in short gentle exchanges, rest between them, and treat a modest evening as complete.",
        "A heavy-handed day around feelings, where small words arrive with big weight attached. The wise response is smaller conversations and softer speech. Keep exchanges brief and kind, offer one genuine reassurance, and watch the rest of today breathe.",
        "The relational day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower and quieter. Lower the expectations to whatever is essential, hold your patience visibly, and watch the evening restore warmth.",
        "Today's emotional atmosphere asks for endurance dressed as calm. Replies slow, conversations loop, and sensitivity rises by afternoon. Keep the plan minimal, keep the posture gentle, and give the tensest topic your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding relational day with no particular villain in it, just slow conversations, tired patience, and older words asking to be re-heard. The emotional ground neither helps nor harms. Keep the scope small, handle the review items first, and let routine carry the evening.",
        "The heart moves under a heavier sky, with delays and returned grievances arriving without ceremony. Nothing in the difficulty needs diagnosing; it passes with the day. Hear the returned grievance once, defer the heavy topics, and guard the evening's peace.",
        "Matters of the heart carry a muted, effortful tone today, where each exchange asks twice the usual care, and revision work sits at the top of the pile. The sky is testing patience, not affection. Begin with the re-hearing, work gently, and rest after.",
        "A heavy-handed day around feelings, where small words arrive with big weight and old conversations with correction notes attached. The wise response is smaller conversations and careful mending. Keep exchanges brief, close one clean repair, and watch the day breathe.",
        "The relational day runs thick and slow, with a backward pull toward half-finished older conversations. Nothing is wrong exactly; everything is slower and half of it needs a second hearing. Lower the expectations, close one review item gently, and watch the evening restore warmth.",
        "Today's emotional atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every exchange. Replies slow, conversations loop, and older words resurface. Keep the plan minimal, verify before reacting, and give the tensest topic your kindest attention.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on matters of the heart, with slow replies and thin patience on both sides. The wise posture is small, gentle and unbothered. Offer the one required reassurance properly, step back from the rest, and watch tomorrow carry fresh air.",
        "A stiff, demanding relational day where conversations respond slowly and moods run short. Pushing harder today achieves less than waiting well. Keep the words few and kind, put the important things gently, and protect the evening from carry-over hurt.",
        "Matters of the heart sit in today's shadow, with warmth slow and conversations formal. The day is testing posture more than affection. Stand steady: keep the small courtesies going, avoid the sensitive ground, and let a quiet finish be the victory.",
        "The relational day presents friction in layers today — slow replies, short tempers, tender spots. None of the layers need solving at once. Step on only the safest path, keep the tone level, and save the deeper conversations for a lighter day.",
        "A slow, heavy relational day in which warmth meets pride that refuses to soften quickly. Fighting the pride costs more than it returns. Work around it gently, keep the expectations small and the words kind, and let patience be today's relational skill.",
        "Today the heart's world seems to move in syrup while you move in air, and the mismatch wears on the spirit. Accept the pace without argument. Give what gives easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on matters of the heart, with slow replies, thin patience, and older hurts resurfacing for mending. The wise posture is small, gentle and unbothered. Offer the required reassurance, mend one returned feeling gently, and let tomorrow carry fresh air.",
        "A stiff, demanding relational day where conversations respond slowly and returned grievances ask for care. Pushing harder today achieves less than mending well. Keep the words few and kind, tend what comes back, and protect the evening from carry-over hurt.",
        "Matters of the heart sit in today's shadow, with warmth slow, conversations formal, and a review mood on top. The day is testing posture more than affection. Stand steady: keep the courtesies going, mend what returns, and let a quiet finish be enough.",
        "The relational day presents friction in layers today — slow replies, short tempers, returned grievances. None of the layers need solving at once. Mend only the top one cleanly, keep the tone level, and save the deeper talks for a lighter day.",
        "A slow, heavy relational day in which warmth meets unhurried pride, and the pride is also reviewing its recent history. Fighting either costs more than it returns. Work around it gently, tend what it flags, and let patience be today's relational skill.",
        "Today the heart's world seems to move in syrup, with a backward current pulling attention to older words. Accept the pace without argument. Give what gives easily, re-hear one resurfaced grievance properly, and close the day gently.",
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

export const dailyLoveRows: BankRow[] = makeRows("daily.love", "en", cells);
