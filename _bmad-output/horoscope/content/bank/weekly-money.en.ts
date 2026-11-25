/**
 * EN weekly.money bank — `rating={4}.pb={fav,neutral,unfav}.retro={none,review}`
 * (compose.ts: rating = money aggregate for the week, pb = Jupiter's band for
 * this area, retro = review when a Mercury/Jupiter/Saturn retrograde spans the
 * window). 24 cells × 4 variants, 45–70 words. Jupiter flavour: expansion, fair
 * dealing, generosity — fav = flow helps, neutral = ledger indifferent, unfav =
 * procedure asks form/patience. No buy/sell/invest directives (style §6): the
 * bank speaks of dues, budgets, records and patience. Week-arc texture.
 */
import { makeRows, type BankRow, RATINGS, AREA_PB, RETRO } from "./types";

const TEXTS: Record<string, Record<string, Record<string, string[]>>> = {
  excellent: {
    fav: {
      none: [
        "Money matters flow generously across the week, and the bigger current rewards clarity over cleverness. Income, reimbursements and pending dues tend to arrive on their promised days. Tend the numbers patiently, note what comes in, and see the expansive week do most of that lifting. Midweek carries the friendliest arithmetic of the seven days.",
        "A widening week for finances: opportunities knock politely and the ground under your accounts feels fertile. Generosity moves both ways, and giving rarely feels costly this time. Keep the records straight, enjoy the flow, and let gratitude be part of the ledger. By Friday the books close with a comfortable line to spare.",
        "Finances catch the friendly corner of the sky this week, and abundance reads as ordinary arithmetic rather than luck. Pending amounts move, negotiations soften, and fair offers appear without much searching. Sign nothing in haste, but welcome what arrives on its own timing. The middle days carry the best of the movement.",
        "The week's money weather is warm and steady, with enough flow to make planning pleasant. Small surpluses appear where you expected balance. Track them without anxiety, share a little of the ease, and see the momentum keep its own calendar this week. Early in the week is the right moment for setting generous plans.",
      ],
      review: [
        "Money matters flow generously this week, with one retrograde instruction on top: verify before you settle. Income and dues tend to move on time, and re-checking keeps them that way. Welcome the flow, and give every closing figure a second look before Friday. The checked totals hold their value through the weekend.",
        "A widening week for finances, though the review current asks for careful recounting along the way. Generosity moves both ways, and honest arithmetic protects it. Enjoy the open flow, and recount the statements once midweek before the week closes them. Recounted plenty tends to stay plenty, which is this week's quiet promise.",
        "Finances catch the friendly corner of the sky this week, and abundance reads as ordinary arithmetic. The retrograde layer prefers corrections over commitments, so let revised figures set the tone. Welcome what arrives on its own, and hold fresh agreements for a clearer week. The corrections made now keep compounding nicely later on.",
        "The week's money weather is warm, with one modest caveat attached: numbers deserve a second pass this time. Small surpluses appear where you expected balance. Track them happily, re-check the totals once, and let accuracy dress the generosity by the weekend. Accuracy like this turns the week's ease into lasting order.",
      ],
    },
    neutral: {
      none: [
        "Financial form is strong this week even where the surroundings stay plain: your own discipline supplies the growth. Nothing blocks the ledger and nothing elevates it either. Set the week's money target yourself, meet it cleanly by Thursday, and let self-made order be the reward. Discipline like this pays its own quiet interest.",
        "The accounts run on your effort this week more than on any passing current, and that suits a clear-headed operator. Ordinary income behaves, ordinary expenses behave. Use the strong form to organise rather than celebrate, and Friday closes with tidy numbers. Order kept across all seven days reads as real achievement.",
        "A confident money week on neutral ground: the sky hands you clarity rather than windfalls. Plans about budgets and dues move easily because you are thinking straight. Write the numbers down while they are this clear, and see the order pay quietly. Monday and Tuesday offer the clearest window for it.",
        "Your money sense sharpens this week against a plain background, which is often the best combination. No noise distorts the figures, and no delay hides them. Use the clean view to set the coming month's small financial course, and let strong instincts lead. Midweek suits the course-setting better than the weekend does.",
      ],
      review: [
        "Financial form is strong this week even on plain ground, with the retrograde layer asking for recounts. Your own discipline supplies the growth. Set the week's money target, meet it, and re-check each figure before calling it final on Friday. Checked figures keep their strength intact through the weekend as well.",
        "The accounts run on your effort this week, and the review current adds a useful habit: verify before you file. Ordinary income behaves, ordinary expenses behave. Use the clear-headed form to organise the ledger, and let re-checking be part of that order. One verified filing this week saves three corrections later.",
        "A confident money week on neutral ground, with one exception: the sky prefers revision over fresh commitments. Plans about budgets and dues move easily because you are thinking straight. Write the numbers down, review them once, and hold new agreements for later. The week rewards the reviewed plan over the new one.",
        "Your money sense sharpens this week against a plain background, while the review current pulls gently toward older statements. No noise distorts the figures. Use the clean view for a second pass over recent accounts, and see the instincts find small errors. Small errors found early in the week cost almost nothing at all.",
      ],
    },
    unfav: {
      none: [
        "The week's broader strength reaches your finances too, though the deeper current asks for form and patience around money. Gains favour the documented and the punctual. Keep agreements written, dues scheduled and claims precise, and the strong week still works for you. Paperwork completed early carries the whole week's gains without strain.",
        "Warm energy rides through the week while the money channel underneath runs slow and formal. The combination rewards those who keep receipts and respect timelines. Let the paperwork precede the optimism, and the week's strength settles into real, verifiable figures. Midweek suits the formal submissions and filings best this time around.",
        "Your overall form is high, though the financial current underneath prefers protocol over enthusiasm this week. Claims move slowly and counters stay formal. Do not push against the gate: submit what is asked, in the asked shape, and see the strong week carry the rest. The gate respects patience more than pressure here.",
        "The broad week favours you, while a slower financial current checks each step for completeness. Treat the checking as protection rather than resistance. Move deliberately, keep every money note documented, and the week still closes with credit on your side. Good, early documentation is what makes the week's credit stay put.",
      ],
      review: [
        "The week's broader strength reaches your finances, though the money current underneath runs slow, formal and revision-minded. Gains favour the documented. Keep agreements written, dues scheduled, figures verified, and the strong week still works firmly for you. Verified gains remain the only ones truly worth having in a week shaped like this.",
        "Warm energy rides through the week while the money channel underneath runs slow, formal and revision-friendly. The combination rewards receipts, timelines and second passes. Let the paperwork precede the optimism, correct what returns, and the strength settles into verifiable figures. Corrected figures end up carrying more weight than fresh promises do.",
        "Your overall form is high, though the financial current underneath prefers protocol and re-examination over enthusiasm. Claims move slowly and counters stay formal this week. Submit what is asked in the asked shape, re-check before resending, and see the strong week carry it. Patience with the gate turns out to be speed.",
        "The wider week runs bright while the financial lane runs slow and re-checks its own history, a mismatch experience handles easily. Give the lane its ceremony and its corrections: exact amounts, full records, revised drafts. The brightness still covers your money matters. Friday then closes the lane with every figure verified and filed.",
      ],
    },
  },
  good: {
    fav: {
      none: [
        "Money moves at a friendly, workable pace this week, and the accounts behave. Steady income lands where it should, without drama or delay, and midweek brings a small settlement you have been waiting on. Keep the routine payments punctual and see the flow build. Friday's ledger reads a little richer for the patience.",
        "The week offers solid financial ground and no surprises, which suits careful planners well. Income cooperates, small reimbursements come without chasing, and the pace holds steady through Friday. Lean in steadily and let ordinary diligence do the persuasive bookkeeping on your behalf. Bookkeeping done without drama turns out to be bookkeeping done best.",
        "This week's money weather is fair and mild, with a supportive current under ordinary transactions. Your reliability with numbers reads clearly to the people who matter. Keep the promises you made about payments, and let consistency earn the week's quiet credit. Midweek suits raising the small question about dues you have been saving.",
        "Payments proceed smoothly this week, helped by a patient and well-disposed atmosphere. The budget behaves, difficult conversations about money stay civil, and small requests meet quick answers. Steady attention across the days earns more than one grand gesture would. By Friday the accounts close with everything plainly accounted for and calm.",
      ],
      review: [
        "Money moves at a friendly pace this week, with accounts behaving and cooperation easy. The review current adds one instruction: verify before you finalise. Keep the steady rhythm, and re-read the figures before they leave your desk, especially toward Friday. The extra pass fits comfortably inside a single ordinary working morning.",
        "The week offers solid financial ground without surprises, which suits careful planners. Underneath, a revision-friendly current asks for a second pass on older statements. Keep the steady rhythm, and give the pending reconciliation one more look before midweek sends it out. Both the rhythm and the reconciliation benefit from it equally.",
        "This week's money weather is fair, with a supportive current beneath ordinary transactions. The sky also nudges you toward revisiting recent figures. Continue as planned, treat any recount as progress rather than delay, and Friday closes the books respectably tidy. The tidiness itself emerges as the week's real, lasting gain.",
        "Payments proceed smoothly this week, helped by a patient atmosphere around money matters. The week's quieter instruction is to confirm figures others may have missed. Stay the course, and quietly become the person who catches the errors before they spread. That kind of careful accuracy outlasts the week by whole months.",
      ],
    },
    neutral: {
      none: [
        "A fair, ordinary financial week with mild support at the edges and no obstacles in the middle. Effort converts at the normal rate. Keep the standards high without raising the stakes, and Friday pays the ledger out quietly and on time. Ordinary money weeks like this keep the big plans alive.",
        "The accounts stay level and professional this week, neither generous nor difficult. Your competence with numbers carries its usual weight. Do the bookkeeping that is plainly in front of you and see the evenness be the week's quiet advantage. By Friday afternoon, the whole week's accumulated steadiness reads as genuine strength.",
        "Money holds a steady middle path this week, with cooperation available and resistance absent. Nothing needs heroics, and nothing rewards drift either. Work the budget as written, close the open loops you can, and the week ends respectably, if plainly. Midweek offers the best window for clearing the oldest of those entries.",
        "The week runs at ordinary financial pace on an even, manageable field. Progress comes at the standard rate of exchange: attention for accuracy. Choose the entries with visible outcomes, reconcile them properly across the middle days, and finish with a clean ledger. A clean ledger is the week's most honest report card.",
      ],
      review: [
        "A fair, ordinary financial week, with the retrograde undertone asking for verification at the edges. Effort converts at the normal rate, recounts included. Keep the standards high, confirm the figures twice, and Friday pays out quietly and on time all the same. Patience with the small print pays twice over here.",
        "The accounts stay level and professional this week, neither generous nor difficult, while older statements resurface for review. Your competence carries its usual weight. Answer the resurfaced items first, then move to the main list, and see the evenness hold. Clearing the old statements early in the week lightens everything after them.",
        "Money holds a steady middle path this week, with one addition from the sky: re-count before you confirm. Cooperation is available and resistance absent. Work the budget as written, add the second pass, and the week ends respectably on balance. The quiet habit of recounting becomes your personal edge for this week.",
        "The week runs at ordinary financial pace on an even field, while a review current tugs older entries back into view. Progress still comes at the standard rate. Honour the review work first, choose main entries with visible outcomes, and finish tidy. Friday then closes the ledger without loose pages anywhere.",
      ],
    },
    unfav: {
      none: [
        "A workable financial week with one demanding seam through the formal matters: the deeper current wants procedure and patience. Ordinary payments go fine; official claims move slowly. Keep the tone respectful, keep the paperwork complete, and see the plain work shine by Friday. The plain work carries more weight than usual this week.",
        "The week stays fair on the surface while the slower financial channel underneath asks for proper procedure. Improvisation meets friction this week; preparation meets cooperation. Choose the formal route for anything that matters, and let routine payments carry the week's total. Forms filled in properly become the shortcut in disguise.",
        "Money holds a decent pace this week with a single stiff knot: the receiving side prefers protocol over charm. Respect the preference rather than fighting it. Submit claims in the asked form, and the rest of the week flows normally. Of all the week's days, midweek remains the safest for formal submissions.",
        "A fair financial week with a slow lane through the middle of it. The slow lane belongs to anything official, like reimbursements, claims, and formal settlements. Route those carefully and unhurriedly, keep the lighter payments moving briskly, and Friday balances out. The two lanes together still cover the whole of the ledger.",
      ],
      review: [
        "A workable financial week with a demanding seam through formal matters: the deeper current wants procedure, patience, and re-checking. Ordinary payments go fine; official claims move slowly. Keep paperwork complete, verify what returns, and see the plain work shine through Friday. Whatever returns corrected this week tends to stay correct for a long while.",
        "The week stays fair on the surface while the slower financial channel underneath asks for procedure and revision. Improvisation meets friction; preparation meets patience. Choose the formal route for what matters, and correct the older claims without complaint at midweek. A calm, early manner with the corrections saves more time than any shortcut.",
        "Money holds a decent pace this week with a stiff knot: protocol first, and the sky prefers revisiting over launching. Both point the same way, careful and unhurried. Submit claims in the asked form and see the rest flow. The two aligned currents make the week simpler than it first sounds.",
        "A fair financial week with a slow lane through its middle, and this week the lane also returns older claims for correction. Route the official matters carefully, fix what resurfaces, and see the lighter payments move briskly around the slow traffic. By Friday evening, both lanes stand cleared for the weekend.",
      ],
    },
  },
  moderate: {
    fav: {
      none: [
        "Money moves at an even, ordinary pace this week, and the accounts stay neutral but honest. Effort still counts; it just converts at the regular rate. Keep the payment routine tight, settle dues on time, and Friday closes the week respectably. Neutral money weeks reward the boring disciplines best of all.",
        "The week offers fair, unremarkable financial conditions, helped along by a mild supportive current. Nothing dazzles, nothing blocks. Choose two meaningful money tasks, give them your honest hours, and by Friday the quiet accumulation shows in the ledger's tally. Midweek suits the deeper arithmetic that this kind of week favours most.",
        "This week asks for patience more than ambition on the money front. The mood stays even, settlements come slowly, and progress happens in modest steps. Work with the mild current instead of against it, and the days pass cleanly enough. Save the bigger money decisions for a livelier week further down the road.",
        "The week offers a plain financial rhythm with few surprises and mild support at the edges. Motivation for budgets may lag where excitement usually leads, and that is ordinary. Keep the commitments modest, honour the routine, and let quiet hours do their maintenance. Maintenance weeks are what make bright money weeks possible.",
      ],
      review: [
        "Money moves at an even pace this week, with the retrograde undertone turning a few hours toward recounting. Effort still converts at the regular rate, checks included. Keep the payment routine tight, confirm the figures once, and Friday closes the week respectably. The single careful pass is really all this week asks.",
        "The week offers fair, unremarkable financial conditions with a mild revision current underneath. Nothing dazzles, nothing blocks, and older entries resurface gently. Give them a quiet hour midweek, keep the two main payments moving, and Friday closes without loose ends. A tidy ledger like this one closes its own accounts cleanly.",
        "This week asks for patience twice: once for its ordinary pace, once for the figures that want re-checking. The mood stays even throughout. Settle the essential dues early, let the review work fill the gaps, and the week passes without fuss. Accuracy rather than speed is what this week pays for.",
        "The week offers a plain financial rhythm while small confusions around receipts or statements surface midweek. None of it amounts to much. Slow down slightly, confirm the unclear figures, and see the rest of the week settle around that care. A steady pen and a deliberately short list handle everything else here.",
      ],
    },
    neutral: {
      none: [
        "The week's financial field sits level and undemanding, with neither help nor hindrance from the wider sky. Momentum rests on your own rhythm. Set a modest money target on Monday, reach it without detours, and let satisfaction be the quiet reward. Self-set money targets convert best in calm weather like this one.",
        "A neutral but honest financial week, the kind that quietly builds sound habits. Nothing bends your way, nothing blocks you either. Keep the commitments realistic, keep the payments punctual, and let steady hours do their patient compounding through Friday. That patient compounding shows up the very moment conditions turn kind again.",
        "Money holds a steady middle path this week on an even, manageable field. Progress is available at the standard exchange rate of attention for accuracy. Work the budget as written, close what loops you can, and the week ends respectably. Of the week's days, midweek carries the best odds for one hard talk about dues.",
        "The financial sky sits level this week, offering a fair field and an honest pace. Nothing dazzles, and nothing interferes either. Decide what a good money week looks like for you, pursue it without drama, and let consistency speak at the close. Plain weeks are where steady finances are actually built.",
      ],
      review: [
        "The week's financial field sits level while the retrograde undertone turns some hours toward second looks. Momentum still rests on your rhythm. Set the modest money target, re-check the figures behind it, and let careful pacing carry the week to Friday. Careful pacing remains a genuine skill, and this week pays for it.",
        "A neutral but honest financial week, with revision requests folded quietly into the hours. Nothing bends your way and nothing blocks you. Keep commitments realistic, give the recounts their share of time, and let steady hours compound gently through Friday. The recounts done early in the week cost the least of all.",
        "Money holds a steady middle path this week, with one instruction from the sky: verify before you confirm. Cooperation is available and resistance absent. Work the budget as written, add the checking pass, and the week closes on respectable terms. The checked version reads better than the rushed one, whatever the mood.",
        "The financial sky sits level this week while a review current tugs older statements back for attention. Nothing dazzling, nothing blocking, and a preference for revisiting recent figures. Set the modest target, verify as you go, and let tidy accuracy be the reward. Friday's tidy ledger outshines any flashy Monday start.",
      ],
    },
    unfav: {
      none: [
        "An ordinary financial week with one slow seam through the formal matters: the deeper current wants procedure and patience. Routine payments proceed fine; anything official moves at its own rhythm. Respect the pace, keep the paperwork complete, and the week passes cleanly. Friday closes the books without any drama attached to them.",
        "The week stays level on the surface while the slower financial channel underneath insists on proper procedure. Improvisation meets friction; preparation meets cooperation. Route the important claims through the formal door, in the asked shape, and let routine carry the rest. Well-prepared claims move twice as fast in this kind of weather.",
        "Money holds a workable pace this week with one stiff patch: the receiving side wants protocol before personality. Give the form its due. Submit what is asked in the asked order, keep your own tempo on lighter payments, and the week balances out. The stiffness here is purely procedural, not personal, this time.",
        "A plain financial week with a demanding patch in the middle of it. The patch belongs to official matters, reimbursements, claims, and formal settlements. Give that part its full documentation, keep the lighter payments moving briskly, and Friday settles the account. Documentation completed early in the week keeps the whole account honest.",
      ],
      review: [
        "An ordinary financial week with a slow seam through formal matters, and the seam now also asks for re-checking. Routine payments proceed fine; official items move slowly and return once. Respect both speeds, verify what comes back, and the week stays clean. One careful, complete return beats three hasty submissions every time.",
        "The week stays level on the surface while the slower financial channel underneath asks for procedure and revision together. Improvisation meets friction; the prepared meet patience. Use the formal door for what matters, correct the older claims midweek, and let routine carry on. The corrected claims age well in files like these.",
        "Money holds a workable pace this week with two quiet disciplines stacked: protocol first, recounting second. Neither is personal. Submit what is asked in the asked order, re-check what returns, and keep your own tempo on the lighter payments. Both disciplines pass more quickly than they first promise, especially before Friday.",
        "A plain financial week with a demanding patch in its middle, and this week the patch also returns older claims for review. Give the returns their corrections promptly, keep the documentation complete, and see the lighter payments move briskly around the traffic. Friday then finds the whole ledger balanced and quietly complete.",
      ],
    },
  },
  challenging: {
    fav: {
      none: [
        "The week presses harder than usual on money matters, yet the supportive current still holds and still helps. The difficulty is pacing, not permanence. Keep the spending plan light, use the cooperative helpers early in the week, and see the weekend restore balance. Any financial help received this week deserves returning once the sky lightens.",
        "A heavier tone runs through the financial days, and figures may feel tighter than their actual size. The helpful part is structural: budgets and routines still work exactly as designed. Do the essentials well, postpone the extras without guilt, and rest easy. Small settlements count double in a week like this.",
        "The week asks more from your finances than the calendar suggests, though the cooperative current keeps a lane open. Take it: one straightforward settlement done well keeps the week from souring. Choose gentleness over force and protect the calm evenings. That lane narrows by Friday, so use it early in the week.",
        "The week leans demanding on the money front, with obligations arriving in clusters and patience thinning by midweek. What helps: the budget around you stays reliable when little else does. Keep responses measured, keep the plan minimal, and see the weekend reset the scale. A reliable budget is the week's one quiet, dependable gift.",
      ],
      review: [
        "The week presses harder than usual on money, though the supportive current still holds and helps. Add the retrograde instruction: handle review items before new plans. Keep the spending plan light, correct what resurfaces early, and see the weekend close the books gently. Order of operations matters considerably more than raw speed this week.",
        "A heavier tone runs through the financial days while the review current pulls attention toward older statements. The helpful part is structural: budgets and routines still work as designed, recounts included. Do the essentials, fix what returns, and rest easy each evening. Corrected figures stay corrected, which is its own comfort.",
        "The week asks money patience twice: for its own weight, and for the older matters returning for a second look. The cooperative current keeps a lane open for exactly this work. Take the lane, correct what returns, and protect the calm evenings. The lane fits the corrections better than it fits new plans.",
        "The week leans demanding financially, and part of the weight is old accounts knocking for attention at awkward hours. The budget around you stays reliable through it. Meet each knock with a short, honest effort, and keep the evenings genuinely calm. Handled this way, Sunday evening feels like arrival instead of escape.",
      ],
    },
    neutral: {
      none: [
        "The week runs heavier than recent ones on money, and the field offers little cushion: relief comes only from steady, deliberate habits. The difficulty is pacing, not permanence. Keep the plan minimal, settle the essentials, and see the weekend restore what the days spend. Modest targets, fully met, are the week's winning shape.",
        "A demanding financial week on plain ground, where nothing extra arrives to help and no fresh trouble interferes either. Figures feel tighter than their size; patience closes the gap. Work in short, honest sessions, rest deliberately, and Friday closes the books fairly. Short sessions beat long sprints in weather like this.",
        "The week asks more than the calendar promises, mostly through small delays and tired attention around money. Nothing here is verdict-shaped; it is weather, and weather passes. Slow the pace deliberately, choose patience over force, and protect one quiet hour on the hardest day. That protected hour is maintenance rather than laziness.",
        "The week leans demanding without offering much financial support in return, which makes pacing the whole game. Obligations cluster, patience thins, and yet the essentials still fit if the plan stays small. Keep responses measured and see the weekend reset the scale. A small plan honoured fully beats a large one abandoned halfway.",
      ],
      review: [
        "The week runs heavier than recent ones on money, and old matters surface for correction inside the weight. The field offers little cushion, so sequence matters: review items first, new plans last. Keep the list short, work slowly, and see the weekend absorb the rest. Sequencing is the whole strategy for a week like this.",
        "A demanding financial week on plain ground, with revision requests arriving at awkward hours. Nothing extra arrives to help, and none of it is verdict-shaped. Meet each request with a short, honest effort, rest deliberately between them, and Friday balances the books. The books balance when the efforts stay short and real.",
        "The week asks patience twice over: for its own heaviness, and for the figures that need re-checking before anything settles. Take that as the week's shape instead of a judgment. Work slowly, verify carefully, and rest early on the heavier days. Both kinds of patience pay off visibly by Sunday evening.",
        "The week leans demanding while a review current tugs older accounts back into the open. Neither needs to fight the other. Accept the slower pace, fix what comes up for review, and leave fresh commitments for a clearer week ahead. The repaired ledger serves next week much better than speed would.",
      ],
    },
    unfav: {
      none: [
        "The week presses from two sides: its own weight, and a financial channel that wants form at every step. Neither is personal. Keep everything documented, keep the tone patient, do less but do it properly, and see the weekend restore the difference. Proper form is the week's only shortcut, and it works.",
        "A heavy financial week meets a slow, exacting channel, and figures feel tighter than their real size. The combination favours the patient and the prepared. Settle the essentials in the asked shape, postpone the rest without guilt, and rest early each evening. Early evenings are what make the mornings easier here.",
        "The week asks more than the calendar suggests, while the financial channel checks every step for form and pace. The pair feels heavy but stays manageable. Keep the schedule light, keep the records immaculate, and protect one genuinely quiet hour daily. That quiet hour is maintenance rather than indulgence for this week.",
        "The week leans demanding while the official channel moves at its own unhurried rhythm, and the mismatch tempts shortcuts. Decline the temptation: shortcuts cost double in weather like this. Keep the plan minimal, keep settlements complete, and see the weekend reset the scale. Complete and slow beats fast and corrected every time.",
      ],
      review: [
        "The week presses from two sides, and the retrograde undertone adds a third: older items returning for correction. The stack feels heavy but stays orderly. Handle the returns first, keep new plans parked, document everything, and rest early each evening. Orderly weeks like this one end better than they first feel.",
        "A heavy financial week meets a slow channel that also asks for re-checking this time. The combination favours the thorough over the quick, decisively. Correct what returns, confirm nothing half-checked, keep the schedule light, and rest early each evening. Thorough emerges as the fast route this week, oddly enough.",
        "The week asks patience three ways: its own weight, the official channel's pace, and the figures that need re-checking. None of the three is personal. Take them in order, one at a time, keep the records immaculate, and protect the quiet evenings. Taken in order, the week stays manageable and ends fine.",
        "The week leans demanding while the official channel returns older items for review at its own rhythm. The mismatch tempts shortcuts, and shortcuts cost double here. Meet the returns promptly, keep settlements complete, and leave fresh commitments for a clearer week. Next week inherits a genuinely clean ledger if you manage this.",
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

export const weeklyMoneyRows: BankRow[] = makeRows("weekly.money", "en", cells);
