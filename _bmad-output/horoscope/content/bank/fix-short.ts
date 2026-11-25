// One-shot: lengthen the 94 thought rows flagged at 11/10 words by the §8 lint.
import { readFileSync, writeFileSync } from "node:fs";

const en: Array<[string, string]> = [
  ["Keep expectations light today and let ordinary discipline do the work.", "Keep the expectations light today and let ordinary discipline do the work."],
  ["Your energy today is a middle road, neither pushing nor pausing.", "Your energy today is a middle road, neither pushing forward nor pausing."],
  ["Small maintenance of mood today pays more than any grand push.", "Small maintenance of mood today pays more than any grand push would."],
  ["Low-key pacing is the day's real strength, and preparation beats performance.", "Low-key pacing is the day's real strength, and preparation still beats performance."],
  ["Generosity flows back today, so let practical plans breathe a little.", "Generosity flows back today, so let the practical plans breathe a little."],
  ["Review before speaking about money today, since measured words travel further.", "Review before speaking about money today, since carefully measured words travel further."],
  ["Keep spending and promises modest today, and the evening stays peaceful.", "Keep the spending and promises modest today, and the evening stays peaceful."],
  ["Money matters ask for patience today, so prefer reviewing over deciding.", "Money matters ask for patience today, so prefer quiet reviewing over deciding."],
  ["Quiet, careful wording protects both purse and peace of mind today.", "Quiet, careful wording today protects both purse and peace of mind completely."],
  ["Speak once, clearly, today, and let the words do the rest.", "Speak once and clearly today, and let the words do the rest."],
  ["Steady courage today looks like one honest conversation, not a battle.", "Steady courage today looks like one honest conversation, not a big battle."],
  ["Small brave steps today build the momentum that tomorrow gratefully inherits.", "Small brave steps today build the kind of momentum tomorrow gratefully inherits."],
  ["Keep communication plain and factual today, and let the facts persuade.", "Keep communication plain and factual today, and let the plain facts persuade."],
  ["A middle-of-the-road day for bold words, so draft first, send later.", "A middle-of-the-road day for bold words, so draft first and send later."],
  ["Quiet courage today means showing up steadily rather than giving speeches.", "Quiet courage today means showing up steadily rather than giving long speeches."],
  ["Words land heavier today, so weigh them before letting them go.", "Words land a little heavier today, so weigh them before letting them go."],
  ["Let courage work quietly today, preparing ground instead of storming gates.", "Let courage work quietly today, preparing the ground instead of storming gates."],
  ["If a discussion turns sharp today, pause first and answer second.", "If any discussion turns sharp today, pause first and answer second."],
  ["Comfort and confidence share an address today, so tend to both.", "Comfort and confidence share an address today, so tend kindly to both."],
  ["The day supports settling in, and settling in supports everything else.", "The day supports settling in, and settling in quietly supports everything else."],
  ["Creative energy runs bright today, so give it a proper hour.", "Creative energy runs bright today, so give it a proper full hour."],
  ["A good day to begin the playful project you keep postponing.", "A good day to begin the playful project you keep quietly postponing."],
  ["Young hearts and fresh ideas both respond warmly to attention today.", "Young hearts and fresh ideas both respond warmly to gentle attention today."],
  ["Steady attention today turns a half-formed idea into a working plan.", "Steady attention today turns a half-formed idea into a real working plan."],
  ["Creativity prefers structure today, so give the idea a simple frame.", "Creativity prefers structure today, so give the idea a simple, honest frame."],
  ["A patient hour with children or study today pays quiet dividends.", "A patient hour with children or study today pays quiet, lasting dividends."],
  ["Keep creative plans light today, and let fun stay the point.", "Keep the creative plans light today, and let fun stay the point."],
  ["Small learning steps today suit the day better than ambitious syllabi.", "Small learning steps today suit the day far better than ambitious syllabi."],
  ["Learning resists hurry today, so take the material in smaller sips.", "Learning resists hurry today, so take the material in much smaller sips."],
  ["With children today, choose calm repetition over introducing any new demands.", "With the children today, choose calm repetition over introducing any new demands."],
  ["Service done cheerfully today returns later as reputation, quietly and reliably.", "Service done cheerfully today returns later as reputation, quietly and quite reliably."],
  ["Routines feel lighter today, and discipline briefly feels like genuine pleasure.", "Routines feel lighter today, and discipline briefly feels like a genuine pleasure."],
  ["Steady work today beats brilliant work, and the day knows it.", "Steady work today beats brilliant work, and the whole day knows it."],
  ["Keep the routine intact today, and it keeps you in return.", "Keep the routine intact today, and it keeps you whole in return."],
  ["One honest hour of focused effort today outweighs a scattered morning.", "One honest hour of focused effort today outweighs a whole scattered morning."],
  ["Work asks for persistence today rather than inspiration, so simply persist.", "Work asks for persistence today rather than inspiration, so simply keep persisting."],
  ["Keep the routine simple today, and let completion be the win.", "Keep the routine simple today, and let quiet completion be the win."],
  ["A day to repair the routine rather than to extend it.", "A day to repair the routine rather than to extend it further."],
  ["Rest between tasks today is not laziness but sound, honest engineering.", "Rest between tasks today is not laziness but sound and honest engineering."],
  ["Keep each work promise deliberately small today, and overdelivery becomes simple.", "Keep each work promise deliberately small today, and overdelivery becomes quite simple."],
  ["A calm word today repairs more than a perfect speech tomorrow.", "A calm word today repairs more than a perfectly delivered speech tomorrow."],
  ["Keep partnership promises modest today, and mutual trust grows on schedule.", "Keep the partnership promises modest today, and mutual trust grows on schedule."],
  ["An ordinary day for negotiation, best spent listening rather than pitching.", "An ordinary day for negotiation, best spent quietly listening rather than pitching."],
  ["Postpone the difficult relationship talk today, and prepare it kindly instead.", "Postpone the difficult relationship talk today, and prepare it kindly in writing."],
  ["If friction finds you somewhere today, breathe first and respond second.", "If friction finds you somewhere today, breathe deeply first and respond second."],
  ["Deep matters move smoothly today, and quiet understanding arrives without effort.", "Deep matters move smoothly today, and quiet understanding arrives without any effort."],
  ["A good day to untangle one long-pending matter, calmly and completely.", "A good day to untangle one long-pending matter with calm completeness."],
  ["Change feels friendly today, so cooperate with it just a little.", "Change feels friendly today, so cooperate with it at least a little."],
  ["Patience pays unusually quick dividends today, especially where matters are complicated.", "Patience pays unusually quick dividends today, especially where the matters are complicated."],
  ["Steady attention to the deep file today keeps long-term matters healthy.", "Steady attention to the deep file today keeps the long-term matters healthy."],
  ["Handle the delicate matter today with plain words and clean notes.", "Handle the delicate matter today with plain words and cleanly written notes."],
  ["An even day for complicated topics, best handled in small portions.", "An even day for complicated topics, best handled in very small portions."],
  ["Keep shared matters transparent today, and trust quietly does the rest.", "Keep the shared matters transparent today, and trust quietly does the rest."],
  ["Complicated matters ask for extra care today, so one step only.", "Complicated matters ask for extra care today, so exactly one step only."],
  ["Patience today is protective, especially with shared resources and old files.", "Patience today is quietly protective, especially with shared resources and old files."],
  ["Luck leans your way today, mostly because preparation finally gets noticed.", "Luck leans your way today, mostly because the preparation finally gets noticed."],
  ["The bigger picture comes into focus today, and it looks kind.", "The bigger picture comes into clear focus today, and it looks kind."],
  ["Learning from a mentor today works noticeably better than learning alone.", "Learning from a mentor today works noticeably better than learning entirely alone."],
  ["A good day to plan the long journey, literal or otherwise.", "A good day to plan the long journey, whether literal or otherwise."],
  ["Keep the optimistic outlook today, and opportunities keep introducing themselves.", "Keep the optimistic outlook steady today, and the opportunities keep introducing themselves."],
  ["Fortune runs neutral today, which quietly puts preparation back in charge.", "Fortune runs neutral today, which quietly puts careful preparation back in charge."],
  ["An ordinary day for big questions, best spent gathering small answers.", "An ordinary day for big questions, best spent gathering small honest answers."],
  ["Career matters shine today, and your work speaks before you do.", "Career matters shine today, and your own work speaks before you do."],
  ["Ambition and timing agree today, which is rarer than it sounds.", "Ambition and timing agree today, which is far rarer than it sounds."],
  ["A good day to sharpen one professional skill in public view.", "A good day to sharpen one professional skill in full public view."],
  ["Career moves at working pace today, so let the work speak.", "Career moves at its working pace today, so let the work speak."],
  ["An ordinary professional day, best used for finishing rather than launching.", "An ordinary professional day, best used for finishing things rather than launching."],
  ["Keep public commitments light today, and deliver the private ones fully.", "Keep the public commitments light today, and deliver the private ones fully."],
  ["A day to prepare the case rather than to argue it.", "A day to prepare the case carefully rather than to argue it."],
  ["Quiet diligence today protects more standing than any public defence could.", "Quiet diligence today protects more standing than any loud public defence could."],
  ["Gains arrive through people today, so gladly accept the introductions offered.", "Gains arrive through people today, so gladly accept the introductions being offered."],
  ["A good day to share the goal, because sharing attracts helpers.", "A good day to share the goal, because sharing attracts willing helpers."],
  ["Aspirations feel reachable today, and the maths quietly agrees with you.", "Aspirations feel reachable today, and the honest maths quietly agrees with you."],
  ["Keep friend promises deliberately small today, and the goodwill compounds.", "Keep the friend promises deliberately small today, and the goodwill compounds nicely."],
  ["Small gains today confirm the direction, which is their whole job.", "Small gains today confirm the chosen direction, which is their whole job."],
  ["Gains run ordinary today, so appreciate them without stretching for more.", "Gains run ordinary today, so appreciate them fully without stretching for more."],
  ["An average day for outreach, best spent tending to existing contacts.", "An average day for outreach, best spent gently tending to existing contacts."],
  ["Keep financial hopes realistic today, and let effort set the pace.", "Keep the financial hopes realistic today, and let effort set the pace."],
  ["Gains may dawdle today, so protect whatever has already arrived.", "Gains may dawdle today, so protect carefully whatever has already safely arrived."],
  ["Borrowed optimism today costs more than it returns, so go gently.", "Borrowed optimism today costs more than it returns, so go gently instead."],
  ["Rest restores unusually well today, so accept the pause without guilt.", "Rest restores unusually well today, so accept the long pause without guilt."],
  ["Solitude feels like a luxury today rather than a quiet setback.", "Solitude feels like a proper luxury today rather than a quiet setback."],
  ["Keep expenses planned today, and the peace of mind stays affordable.", "Keep the expenses planned today, and the peace of mind stays affordable."],
  ["Small retreats today, even an hour, keep the larger momentum healthy.", "Small retreats today, even one short hour, keep the larger momentum healthy."],
  ["An ordinary day for rest, which still deserves its scheduled slot.", "An ordinary day for rest, which still deserves its own scheduled slot."],
  ["Keep spending unhurried today, and let the budget remain satisfyingly boring.", "Keep the spending unhurried today, and let the budget remain satisfyingly boring."],
  ["Solitude helps today in strict moderation, so take precisely that much.", "Solitude helps today in strict moderation, so take precisely that much only."],
  ["A quiet day by design, and the design asks for little.", "A quiet day by careful design, and the design asks for little."],
  ["A day to keep plans few and the inner noise lower.", "A day to keep plans few and the inner noise even lower."],
  ["Let expenses wait today, except the ones that secure genuine calm.", "Let the expenses wait today, except the ones that secure genuine calm."],
];

const hi: Array<[string, string]> = [
  ["सीखना आज जल्दी बैठता है, और ख़ुशी उत्तम शिक्षक निकलती है।", "सीखना आज जल्दी बैठता है, और ख़ुशी उत्तम शिक्षक साबित होती है।"],
  ["रचनात्मक चिंगारियाँ आज आती हैं, पर उन्हें आपको लिखकर रखना होगा।", "रचनात्मक चिंगारियाँ आज आती हैं, पर उन्हें आपको लिखकर सँभालकर रखना होगा।"],
  ["दिनचर्या को बढ़ाने के बजाय उसकी मरम्मत करने का दिन है।", "दिनचर्या को आज बढ़ाने के बजाय उसकी मरम्मत करने का दिन है।"],
  ["उलझे मामले आज बेहतर सावधानी माँगते हैं, इसलिए केवल एक क़दम।", "उलझे मामले आज बेहतर सावधानी माँगते हैं, इसलिए केवल एक ही क़दम।"],
];

let miss = 0;
for (const [file, pairs] of [["thought.en.ts", en], ["thought.hi.ts", hi]] as const) {
  let s = readFileSync(file, "utf8");
  for (const [a, b] of pairs) {
    if (!s.includes(a)) {
      console.log("MISS: " + a.slice(0, 60));
      miss++;
      continue;
    }
    s = s.replace(a, b);
  }
  writeFileSync(file, s);
}
console.log("done, missing:", miss);
