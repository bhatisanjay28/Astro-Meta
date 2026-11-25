/**
 * EN daily.money bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = money aggregate, pb = Jupiter's band for this area,
 * retro = review when a Mercury/Jupiter/Saturn retrograde falls in the window).
 * 24 cells × 6 variants, 35–55 words. Jupiter flavour: expansion, fair dealing,
 * generosity — fav = flow helps, neutral = ledger indifferent, unfav = procedure
 * asks form/patience. No buy/sell/invest directives (style §6): the bank speaks
 * of dues, budgets, records and patience. Mirrors daily-money.hi.ts.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Money matters flow generously today, and the bigger current rewards clarity over cleverness. Income, reimbursements and pending dues tend to arrive on time. Tend the numbers patiently, note what comes in, and watch the expansive day do most of that lifting.",
        "A widening day for finances: opportunities knock politely and the ground under your accounts feels fertile. Generosity moves both ways, and giving rarely feels costly today. Keep the records straight, enjoy the flow, and let gratitude be part of the ledger.",
        "Finances catch the friendly corner of the sky today, and abundance reads as ordinary arithmetic rather than luck. Pending amounts move, negotiations soften, and fair offers appear without much searching. Sign nothing in haste, but welcome what arrives on its own.",
        "The day's money weather is warm and steady, with enough flow to make planning pleasant. Small surpluses appear where you expected balance. Track them without anxiety, share a little of the ease, and watch the momentum keep its own time.",
        "Your financial instincts run accurate today, helped by a generous backdrop that favours honest dealing. Conversations about dues or terms land on receptive ears. Put the fair number on the table early, and watch the day's goodwill carry it home.",
        "Expansion marks the money side of today, the quiet kind that compounds rather than dazzles. Bills find their slots, savings hold their line, and generosity costs less than usual. Keep the simple discipline and watch the current add its share.",
      ],
      review: [
        "Money matters flow generously today, with one retrograde instruction on top: verify before you settle. Income and dues tend to move on time, and re-checking keeps them that way. Welcome the flow, and give every figure a second look before it closes.",
        "A widening day for finances, though the review current asks for careful recounting. Generosity moves both ways, and honest arithmetic protects it. Enjoy the open flow, and recount the statements once before the day closes them.",
        "Finances catch the friendly corner of the sky today, and abundance reads as ordinary arithmetic. The retrograde layer prefers corrections over commitments, so let revised figures lead. Welcome what arrives on its own, and hold new agreements for a clearer day.",
        "The day's money weather is warm, with one modest caveat attached: numbers deserve a second pass today. Small surpluses appear where you expected balance. Track them happily, re-check the totals, and let accuracy dress the generosity.",
        "Your financial instincts run accurate today, with the review current standing quietly beside them. Conversations about dues and terms land on receptive ears. State the fair number early, re-check the paperwork behind it, and let goodwill do the rest.",
        "Expansion marks the money side of today, the quiet kind that compounds rather than dazzles. The retrograde layer adds one habit: confirm totals before counting them settled. Keep the simple discipline, verify the figures, and watch the current add its share.",
      ],
    },
    neutral: {
      none: [
        "Financial form is strong today even where the surroundings stay plain: your own discipline supplies the growth. Nothing blocks the ledger and nothing elevates it either. Set the day's money target yourself, meet it cleanly, and let self-made order be the reward.",
        "The accounts run on your effort today more than on any passing current, and that suits a clear-headed operator. Ordinary income behaves, ordinary expenses behave. Use the strong form to organise rather than to celebrate, and the day closes with tidy numbers.",
        "A confident money day on neutral ground: the sky hands you clarity rather than windfalls. Plans about budgets and dues move easily because you are thinking straight. Write the numbers down while they are this clear, and watch the order pay quietly.",
        "Your money sense sharpens today against a plain background, which is often the best combination. No noise distorts the figures, and no delay hides them. Use the clean view to set the week's small financial course, and watch the strong instincts lead.",
        "Strong personal judgement carries the financial day, with the wider field neither helpful nor hostile. Decisions about dues, budgets and small commitments land well. Keep the choices modest and well-documented, and let your own steadiness be the day's real asset.",
        "The day gives plain financial ground and unusually good instincts, a pairing worth using deliberately. Nothing dazzles and nothing blocks. Decide what today's one useful money task is, complete it precisely, and watch the quiet confidence compound into the week.",
      ],
      review: [
        "Financial form is strong today even on plain ground, with the retrograde layer asking for recounts. Your own discipline supplies the growth. Set the day's money target, meet it, and re-check each figure before you call it final.",
        "The accounts run on your effort today, and the review current adds a useful habit: verify before you file. Ordinary income behaves, ordinary expenses behave. Use the clear-headed form to organise the ledger, and let re-checking be part of the order.",
        "A confident money day on neutral ground, with one exception: the sky prefers revision over fresh commitments. Plans about budgets and dues move easily because you are thinking straight. Write the numbers down, review them once, and hold new agreements for later.",
        "Your money sense sharpens today against a plain background, while the review current pulls gently toward older statements. No noise distorts the figures. Use the clean view for a second pass over recent accounts, and watch the strong instincts find the small errors.",
        "Strong personal judgement carries the financial day, with a retrograde preference folded in: correct rather than commit. Decisions about dues and budgets land well when double-checked. Keep the choices modest, verify the arithmetic, and let steadiness be the real asset.",
        "The day gives plain financial ground and unusually good instincts, with revision work woven through the hours. Nothing dazzles and nothing blocks. Pick the account that most needs a second look, give it today's clean attention, and watch the confidence compound.",
      ],
    },
    unfav: {
      none: [
        "The day's broader strength reaches your finances too, though the deeper current asks for form and patience around money. Gains favour the documented and the punctual. Keep agreements written, dues scheduled and claims precise, and the strong day still works for you.",
        "Warm energy rides through the day while the money channel underneath runs slow and formal. The combination rewards those who keep receipts and respect timelines. Let the paperwork precede the optimism, and the day's strength settles into real, verifiable figures.",
        "Your overall form is high, though the financial current underneath prefers protocol over enthusiasm. Claims move slowly and counters stay formal. Do not push against the gate: submit what is asked, in the asked shape, and watch the strong day carry the rest.",
        "The broad day favours you, while a slower financial current checks each step for completeness. Treat the checking as protection rather than resistance. Move deliberately, keep every money note documented, and the day still closes with credit on your side.",
        "Strong drive meets a careful money gate today, and the pairing favours the thorough. Bring claims in the preferred shape, keep the amounts modest and the papers complete. Let the formal finish of today speak louder than a faster one would.",
        "The wider day runs bright while the financial lane runs slow, a mismatch that experience handles easily. Give the slow lane its ceremony: exact amounts, full records, unhurried tone. Do that, and the day's brightness still covers your money matters.",
      ],
      review: [
        "The day's broader strength reaches your finances, though the money current underneath runs slow and formal, and it re-checks its own trail. Gains favour the documented. Keep agreements written, dues scheduled, figures verified, and the strong day still works for you.",
        "Warm energy rides through the day while the money channel underneath runs slow, formal and revision-minded. The combination rewards receipts, timelines and second passes. Let the paperwork precede the optimism, correct what returns, and the strength settles into verifiable figures.",
        "Your overall form is high, though the financial current underneath prefers protocol and re-examination over enthusiasm. Claims move slowly and counters stay formal. Submit what is asked in the asked shape, re-check it before resending, and watch the strong day carry the rest.",
        "The broad day favours you, while the slower financial current checks each step for completeness and asks corrections of older items. Treat both as protection. Move deliberately, keep every money note documented, and the day still closes with credit on your side.",
        "Strong drive meets a careful money gate that is currently reviewing as much as it releases. The pairing favours the thorough. Bring claims in the preferred shape, re-check the returned ones, and watch the formal finish speak louder than speed would.",
        "The wider day runs bright while the financial lane runs slow and re-checks its history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: exact amounts, full records, revised drafts. The brightness still covers your money matters.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Money matters keep a friendly, workable rhythm today. Dues behave, small surpluses hold, and conversations about terms stay easy. Keep the budget honest without squeezing it, and watch the steady current hand its quiet gains to the week.",
        "The financial day offers solid ground without surprises, which suits steady hands well. Routine payments land, small receipts arrive, and nothing demands heroics. Lean in gently and let ordinary discipline do the compounding on your behalf.",
        "Today's money weather is fair and mild, with a supportive current under ordinary transactions. Your reliability with numbers reads clearly to the right people. Keep the promises made about dues, and let consistency earn its quiet credit.",
        "Finances proceed smoothly today, helped by a patient and well-disposed backdrop. The budget behaves, conversations about money stay civil, and small requests meet quick answers. Steady attention now earns more than one ambitious stroke would manage.",
        "A pleasant, orderly rhythm settles over your money matters today. The structures that usually slow payments move in step with you. Do the next small right thing, and watch the day's quiet goodwill attach itself to the ledger.",
        "Your finances enjoy a calm, cooperative day with doors opening at a natural pace. The person on the far side of that counter seems receptive rather than rushed. Raise the small pending question today and watch the mood help it along.",
      ],
      review: [
        "Money matters keep a friendly rhythm today, with the review current adding one instruction: verify before you settle. Dues behave and small surpluses hold. Keep the budget honest, re-check the statements, and watch the steady current hand its quiet gains onward.",
        "The financial day offers solid ground without surprises, while a revision-minded undertone asks for a second pass on older accounts. Routine payments land, small receipts arrive. Lean in gently, recount the recent statements, and let discipline do the compounding.",
        "Today's money weather is fair, with a supportive current under ordinary transactions and a gentle call to revisit recent decisions. Your reliability with numbers reads clearly. Keep the promises made about dues, and treat each recheck as quiet progress.",
        "Finances proceed smoothly today, helped by a patient backdrop and a retrograde preference for corrections over commitments. The budget behaves and money conversations stay civil. Keep attention steady, confirm the details others missed, and let accuracy do the earning.",
        "A pleasant, orderly rhythm settles over your money matters today, with revision work folded quietly into the hours. The structures that usually slow payments move in step with you. Do the next small right thing, and give the older invoice its second look.",
        "Your finances enjoy a calm, cooperative day with doors opening at a natural pace, and one gentle call to review. The person across the counter seems receptive. Raise the small pending question, verify the answer in writing, and watch the mood help along.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary money day with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the stakes, and the ledger pays out quietly and on time.",
        "The accounts stay level and professional today, neither generous nor difficult. Your careful habits carry their usual weight, and the numbers match your tone. Do the plainly visible money task and watch the evenness be the day's quiet advantage.",
        "Finances hold a steady middle path today, with cooperation available and resistance absent. Nothing needs boldness, and nothing rewards drift either. Work the budget as written, close the small open loops, and watch the day end respectably.",
        "The money day runs at ordinary pace on an even, manageable field. Progress is available at the standard rate of exchange: attention for accuracy. Choose the transactions with clear outcomes, handle them properly, and finish with a balanced book.",
        "A neutral but honest financial day, the kind that quietly builds a reputation for reliability. Nothing bends your way, nothing blocks you either. Keep the commitments realistic, keep the records punctual, and let steady habits do their patient compounding.",
        "The financial sky sits level today, offering a fair field and an honest pace. Momentum depends mostly on your own rhythm. Set a modest money target for the day, reach it without shortcuts, and watch the satisfaction be its own small reward.",
      ],
      review: [
        "A fair, ordinary money day, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, re-checks included. Keep the standards high, confirm the figures twice, and the ledger closes quietly and on time.",
        "The accounts stay level and professional today, neither generous nor difficult, while older entries resurface for review. Your careful habits carry their usual weight. Answer the resurfaced items first, then move to the main list, and watch the evenness hold.",
        "Finances hold a steady middle path today, with one addition from the sky: re-count before you commit. Cooperation is available and resistance absent. Work the budget as written, add the second pass, and watch the day end respectably.",
        "The money day runs at ordinary pace on an even field, while a review current tugs at older threads. Progress still comes at the standard rate of exchange. Honour the review work first, choose transactions with clear outcomes, and finish with a balanced book.",
        "A neutral but honest financial day, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep commitments realistic, give the re-checks their share of time, and let steady habits do their patient compounding.",
        "The financial sky sits level today, offering a fair field, an honest pace, and a preference for revisiting recent figures. Momentum rests on your rhythm. Set a modest target, verify as you go, and let tidy accuracy be the day's reward.",
      ],
    },
    unfav: {
      none: [
        "A workable money day with one demanding seam through it: the deeper current wants form and patience. Ordinary transactions go fine; formal claims move slowly. Keep the tone respectful, keep the paperwork complete, and watch the plain discipline shine.",
        "The financial day stays fair on the surface while the slower channel underneath asks for proper procedure. Haste meets friction today; process meets cooperation. Choose the formal route for anything that matters, and let routine payments set the tone.",
        "Finances hold a decent pace today with a single stiff knot: whoever holds the purse prefers protocol over charm. Respect the preference rather than fighting it. Submit what is asked in the asked form, and the rest of today flows normally.",
        "A fair money day with a slow lane through the middle of it. The slow lane belongs to anything formal — claims, approvals, dues owed to institutions. Route those carefully and unhurriedly, and keep the lighter transactions moving briskly around them.",
        "The day gives ordinary financial ground with one strict patch in it. The strict patch rewards preparation and penalises haste. Prepare the important request fully before entering it, keep casual money talk away from formal channels, and the day passes cleanly.",
        "A steady, usable financial day with a demanding undercurrent around official matters. The undercurrent is not hostile, just slow and precise. Give the slow part its full documentation, keep your own tempo on the rest, and close the ledger respectably.",
      ],
      review: [
        "A workable money day with a demanding seam through it: the deeper current wants form, patience, and re-checking. Ordinary transactions go fine; formal claims move slowly. Keep paperwork complete, verify what returns, and watch the plain discipline shine.",
        "The financial day stays fair on the surface while the slower channel underneath asks for procedure and revision. Haste meets friction today; process meets patience. Choose the formal route for anything that matters, and correct older entries without complaint.",
        "Finances hold a decent pace today with a stiff knot: whoever holds the purse prefers protocol, and the sky prefers revisiting over launching. Both point the same way — careful, formal, unhurried. Submit what is asked in the asked form and watch the rest flow.",
        "A fair money day with a slow lane through its middle, and today the lane also returns older items for correction. The lane belongs to formal matters — claims, approvals, institutional dues. Route those carefully, fix what resurfaces, and let lighter transactions move briskly.",
        "The day gives ordinary financial ground with one strict patch, and the patch currently reviews as much as it approves. Prepare requests fully, re-read the returned ones, keep casual money talk away from formal channels, and the day passes cleanly.",
        "A steady, usable financial day with a demanding undercurrent around official matters, now also marked by review. The undercurrent is not hostile, just slow and precise. Give the slow part full documentation and verified details, keep your tempo elsewhere, and close respectably.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Money matters stay on an even keel today, with a helpful current running beneath unremarkable surfaces. Nothing demands boldness, and nothing blocks the flow either. Keep the plan simple, tend the scheduled payments, and let ordinary hours add up.",
        "The financial day is uneventful in the best sense, with support available when you reach for it. Progress comes at working pace, not sprint pace. Small, scheduled steps suit the ledger better than any ambitious reshuffle.",
        "Your money life hums along at a moderate pitch today, helped by decent conditions underneath. Bills are real but movable, and counterparts are present but unhurried. Divide the ledger into blocks and let each block carry its share.",
        "Finances neither leap nor stall today, and the underlying current is quietly on your side. Use the neutrality to repair rather than expand. Tidy the budget, clear the small dues, and call it a fine day's arithmetic.",
        "The day holds steady for money matters, with mild favours available to those who ask early. Progress is possible, just not spectacular. Focus on completion over ambition, and watch the week inherit a tidy account.",
        "Transactions move at an ordinary pace today on ground that is friendlier than it looks. The helpful undertone rewards those who keep showing up. Keep the commitments modest, keep the records immaculate, and watch the quiet goodwill accrue.",
      ],
      review: [
        "Money matters stay on an even keel today, with a helpful current beneath unremarkable surfaces. The sky's one addition is a preference for recounts over new commitments. Keep the plan simple, and spend the spare hour checking older entries.",
        "The financial day is uneventful in the best sense, with support there when you reach. The review current quietly steers part of today backward. Tend the scheduled payments, and give one recent decision a calm audit.",
        "Your money life hums along at a moderate pitch today, helped by decent conditions underneath. Today favours verifying the figures you assumed earlier. Divide the ledger into blocks, and give one block entirely to quiet review.",
        "Finances neither leap nor stall today, and the underlying current leans helpful. The retrograde undertone makes it a re-counting kind of day. Tidy the budget, re-read the entries made in haste, and let accuracy be today's contribution.",
        "The day holds steady for money matters, with mild favours for early askers. A revision-friendly atmosphere hangs over the second half. Focus on completing and correcting what exists, and watch the brand-new schemes wait for clearer skies.",
        "Transactions move at an ordinary pace on ground friendlier than it looks. The day's quiet extra is a nudge toward double-checking numbers. Keep the commitments modest and the records immaculate before anything travels onward to anyone else.",
      ],
    },
    neutral: {
      none: [
        "A plain, honest money day with level conditions throughout and no special favours in play. The transactions are ordinary and the outcomes ordinary too. Handle them well anyway, because plain days handled well are what financial trust is quietly built from.",
        "The ledger runs at its most neutral setting today: fair, flat, and manageable. Nothing invites ambition and nothing threatens it either. Keep the plan mechanical, execute without improvising, and bank the saved attention for a day with more movement.",
        "Finances sit in a level patch today where effort and outcome hold a fair exchange. The sky offers neither pushback nor applause. Choose measurable tasks, complete them cleanly, and watch the neutrality protect the purse from unnecessary noise.",
        "The money day moves evenly, with attention best spent on maintenance rather than expansion. Receipts, records, follow-ups — the unglamorous layer that supports everything. Tend that layer today, and the livelier days ahead inherit solid ground to build on.",
        "A steady, unremarkable financial day in which pace matters more than ambition. The hours respond to whoever keeps rhythm with them. Work in clean blocks, rest between blocks, and watch the day's modest output stand on its own merits.",
        "The day offers money conditions as plain as a clear sky: nothing to chase, nothing to dodge. Use it for the work that needs no weather at all. Organise, record, finish, and watch the simplicity itself be the day's achievement.",
      ],
      review: [
        "A plain, honest money day with level conditions and a retrograde preference for re-examination. The transactions are ordinary and the outcomes ordinary too. Handle them well, add the second pass, because plain days handled carefully build financial trust.",
        "The ledger runs at its most neutral setting today: fair, flat, and manageable, with revision threaded quietly through it. Nothing invites ambition and nothing threatens it. Keep the plan mechanical, re-check what you touch, and bank the saved attention for later.",
        "Finances sit in a level patch today where effort and outcome hold a fair exchange, with one exception: the sky reviews rather than rewards. Choose measurable tasks, complete them cleanly, and watch the audit notes be the day's extra credit.",
        "The money day moves evenly, with attention best spent on maintenance — and today maintenance means revisiting as much as tidying. Receipts, records, older drafts awaiting a second look. Tend that layer today, and the livelier days inherit solid ground.",
        "A steady, unremarkable financial day in which pace matters more than ambition, and accuracy more than pace. The hours respond to whoever keeps rhythm. Work in clean blocks, re-read each block's figures once, and let modest exactness stand on its merits.",
        "The day offers money conditions as plain as a clear sky, with a quiet instruction underneath: look back before moving on. Nothing to chase, nothing to dodge. Review the recent trail of entries, tidy it, and watch the simplicity be the achievement.",
      ],
    },
    unfav: {
      none: [
        "A level money day with a slow, formal current underneath the ordinary transactions. Nothing collapses and nothing breaks through either. Meet the current with steady patience and paperwork: complete forms, gentle tone, punctual follow-ups. The day respects whoever respects its pace.",
        "The ledger runs neutral on the surface and stiff underneath, especially around official channels. Requests move slowly and answers arrive formally. Keep expectations plain, prepare before approaching the counter, and watch the routine payments define the day instead.",
        "Finances hold an even, unhurried line today with one patch of resistance in it. The patch sits wherever approvals and reimbursements live. Walk around it rather than through it: handle what is free to move, and leave the gated amounts for a friendlier hour.",
        "The money day moves at working pace with a demanding undertone around structure and procedure. The undertone is honest: it rewards completeness and slows shortcuts. Give it completeness, skip the shortcuts, and the ordinary day passes with dignity intact.",
        "A flat but fair financial day, with friction concentrated where institutions live. People stay easy; the formal layer does not. Save warmth for the people and precision for the paperwork, and the day closes without any real damage done.",
        "Payments proceed ordinarily today while the structural layer beneath moves slowly and deliberately. Nothing about the slowness is personal. Match it: document properly, wait properly, follow up politely. The rest of today rewards whoever keeps that discipline.",
      ],
      review: [
        "A level money day with a slow, formal current underneath, and that current also wants older entries re-checked. Nothing collapses and nothing breaks through. Meet it with steady patience and paperwork: complete forms, gentle tone, verified figures. It respects whoever respects its pace.",
        "The ledger runs neutral on the surface and stiff underneath, especially around official channels, with revision requests folded in. Requests move slowly and answers arrive formally. Keep expectations plain, correct what returns, and watch the routine payments define the day.",
        "Finances hold an even, unhurried line today with one patch of resistance where reimbursements live, and the patch currently reviews as much as it approves. Walk around rather than through: handle the free-moving amounts, re-check the gated ones, and wait well.",
        "The money day moves at working pace with a demanding undertone around procedure, and today the undertone also audits. It rewards completeness and slows shortcuts. Give it completeness, correct what it flags, and the ordinary day passes with dignity intact.",
        "A flat but fair financial day, with friction concentrated where institutions live and a review mood layered over it. People stay easy; the formal layer does not. Save warmth for people, precision for paperwork, corrections for returned items, and close the day cleanly.",
        "Payments proceed ordinarily today while the structural layer beneath moves slowly, deliberately, and with an eye on older records. Nothing about the slowness is personal. Match it: document properly, correct properly, follow up politely, and let discipline carry the rest.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "Money matters ask for patience today, even though the deeper current is quietly supportive. The surface feels heavy, and progress comes in increments rather than leaps. Choose the smallest important payment, handle it well, and let that be enough.",
        "The financial day leans demanding, though the ground beneath is kinder than it looks. Frustration is possible if you measure today by yesterday's pace. Move through the dues gently, and protect one piece of genuinely sound arithmetic.",
        "Money pressures press a little harder today, while support waits underneath for those who ask. Not every hour feels productive today, and that is acceptable. Aim for steady contact with the ledger instead of a breakthrough.",
        "Finances feel like wading today where yesterday was walking, despite a friendly undertone. The difficulty is temporary and largely about pacing. Keep the commitments small, and finish your day with one account settled and properly closed.",
        "The day tests your financial composure more than your competence, even with a supportive undertone below. Under the heaviness, courtesy and slowness still earn their reward. Reply in writing, keep the amounts modest, and let time do its share.",
        "Money duties feel heavier than their actual weight today, an old trick of slow planets. The kindly undertone shows itself to those who keep moving gently. Schedule the breaks deliberately, and watch the driest number have your freshest hour.",
      ],
      review: [
        "Money matters ask for patience today, even with a quietly supportive current underneath. The heaviness on the surface is real, and part of it is review work resurfacing. Choose re-checking over new commitments, and let accuracy be today's win.",
        "The financial day leans demanding, though the ground beneath is kinder than it looks. Old statements and old claims resurface for calm revision. Correct them without ceremony, accept the slower tempo, and treat the cleanup as today's real progress.",
        "Money pressures press a little harder today, while support waits underneath for those who ask. The retrograde mood turns attention toward unfinished older business. Settle one lingering small due, accept the modest total, and consider the day honestly spent.",
        "Finances feel like wading today where yesterday was walking, and the slowdown is partly review rather than only resistance. Keep the commitments small, spend the quiet hour verifying what you settled, and watch the day close with one loop tied.",
        "The day tests your composure more than your competence today, with an undertone of revisiting old accounts. Courtesy and slowness still earn their reward beneath the surface. Reply carefully in writing, and double-check before any amount is confirmed.",
        "Money duties feel heavier than their weight today, and old entries knock for attention. The friendly undertone rewards gentle persistence and careful re-reading. Schedule the breaks, refresh the oldest statement, and watch the day settle quietly.",
      ],
    },
    neutral: {
      none: [
        "A demanding money day with no particular villain in it, just slow counters and tired attention. The financial ground neither helps nor harms. Keep the scope small, keep the tone steady, and watch the plain routine see the ledger through to evening.",
        "The financial day moves under a heavier sky today, with delays arriving without explanation. Nothing in the difficulty needs diagnosing; it passes with the day. Settle the essential dues, defer the ambitious plans, and guard the evening's peace.",
        "Money matters carry a muted, effortful tone today, where each transaction asks twice the usual push. The sky is testing endurance, not worth. Work in short honest bursts, rest between them, and treat a modest total as a complete day.",
        "A heavy-handed day around money, where small payments arrive with big friction attached. The wise response is smaller commitments and slower speech. Keep exchanges brief and courteous, settle one meaningful due, and watch the rest of today breathe.",
        "The financial day runs thick and slow, like walking through a room where the air is reluctant. Nothing is wrong exactly; everything is slower. Lower the target to whatever is essential, hold your patience visibly, and watch the evening restore the balance.",
        "Today's money atmosphere asks for endurance dressed as calm. Counters crawl, conversations loop, and energy thins by mid-afternoon. Keep the plan minimal, keep the posture upright, and give the driest figure your kindest attention rather than your sharpest.",
      ],
      review: [
        "A demanding money day with no particular villain in it, just slow counters, tired attention, and older work asking to be reviewed. The ground neither helps nor harms. Keep the scope small, handle the review items first, and let routine see the ledger through.",
        "The financial day moves under a heavier sky, with delays and returned claims arriving without ceremony. Nothing in the difficulty needs diagnosing; it passes with the day. Correct what returns, defer the ambitious plans, and guard the evening's peace.",
        "Money matters carry a muted, effortful tone today, where each transaction asks twice the usual push, and revision work sits at the top of the pile. The sky is testing endurance, not worth. Begin with the review item, work in short bursts, and rest properly after.",
        "A heavy-handed day around money, where small payments arrive with big friction and old accounts with correction notes attached. The wise response is smaller commitments and careful fixes. Keep exchanges brief, settle one clean correction, and watch the day breathe.",
        "The financial day runs thick and slow, with a backward pull toward half-finished older matters. Nothing is wrong exactly; everything is slower and half of it needs a second pass. Lower the target, close one review item, and watch the evening restore the balance.",
        "Today's money atmosphere asks for endurance dressed as calm, and the retrograde layer adds re-checking to every step. Counters crawl, conversations loop, and figures resurface. Keep the plan minimal, verify as you go, and give the driest figure your kindest attention.",
      ],
    },
    unfav: {
      none: [
        "The day weighs heaviest on money matters, with slow counters and thin patience on both sides. The wise posture is small, precise and unbothered. Handle the one required payment properly, step back from the rest, and watch tomorrow carry fresh air.",
        "A stiff, demanding financial day where official channels respond slowly and moods run short. Pushing harder today achieves less than waiting well. Keep commitments formal and minimal, put things in writing where possible, and protect the evening from carry-over worry.",
        "Money matters sit in today's shadow, with approvals slow and conversations stiff. The day is testing posture more than arithmetic. Stand steady: settle the basics punctually, avoid the sensitive sums, and let a quiet finish be the victory.",
        "The financial day presents friction in layers today — slow approvals, short tempers, sticky paperwork. None of the layers need solving at once. Peel only the top one, keep the tone level, and save the deeper repairs for a lighter day.",
        "A slow, heavy financial day in which effort meets procedure that refuses to hurry. Fighting the procedure costs more than it returns. Work within its lines, keep the claims small and fully documented, and let patience be today's financial skill.",
        "Today the money world seems to move in syrup while you move in air, and the mismatch wears on the spirit. Accept the pace without argument. Settle what settles easily, note the rest for later, and close the day gently.",
      ],
      review: [
        "The day weighs heaviest on money matters, with slow counters, thin patience, and older entries resurfacing for correction. The wise posture is small, precise and unbothered. Handle the required payment, correct one returned figure, and let tomorrow carry fresh air.",
        "A stiff, demanding financial day where official channels respond slowly and returned claims ask for fixes. Pushing harder today achieves less than correcting well. Keep commitments formal and minimal, fix what comes back, and protect the evening from carry-over worry.",
        "Money matters sit in today's shadow, with approvals slow, conversations stiff, and a review mood on top. The day is testing posture more than arithmetic. Stand steady: settle the basics punctually, correct what returns, and let a quiet finish be enough.",
        "The financial day presents friction in layers today — slow approvals, short tempers, returned drafts. None of the layers need solving at once. Peel only the top one, correct it cleanly, keep the tone level, and save deeper repairs for a lighter day.",
        "A slow, heavy financial day in which effort meets unhurried procedure, and the procedure is also auditing its recent history. Fighting either costs more than it returns. Work within its lines, correct what it flags, and let patience be today's financial skill.",
        "Today the money world seems to move in syrup, with a backward current pulling attention to older statements. Accept the pace without argument. Settle what settles easily, review one resurfaced figure properly, and close the day gently.",
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

export const dailyMoneyRows: BankRow[] = makeRows("daily.money", "en", cells);
