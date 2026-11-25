// Verify candidate replacement phrases: flag any whose word-trigrams already
// exist in the competitor corpus (same tokenization as validate-and-import.ts).
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../originality/fetch/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const corpus = new Set<string>();
for (const file of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const raw = readFileSync(`${dir}${file}`, "utf8");
  const text = raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  const ws = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 2 < ws.length; i++) corpus.add(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
}

const candidates = [
  "and watch the", "and see the", "and feel the", "and notice the", "and allow the",
  "rest and allow", "and allow small", "and allow balance",
  "on your side", "instead of a",
  "a fine day", "fine day to", "it a fine", "is a fine",
  "rests on your", "its own rhythm", "seek its own", "rhythm rather",
  "unhurried rhythm", "the month and", "this month yet", "month yet pays",
  "what the month readied", "month readied",
  "week stirred", "the week brings", "week rewards", "which of the week",
  "opening week", "the first stretch", "first stretch",
  "smoother than usual", "much better than", "smoother than", "than usual",
  "keep a margin", "as a part of", "a part of", "begin with the",
  "invites you to", "to whatever is", "whatever is", "near the end",
  "real rest and", "true rest and", "set the tone",
  "study what", "feels like a", "hear more than", "the long run", "to ready the",
  "a deep sense", "deep sense of", "of today", "rest of today", "part of today",
  "finish of today", "side of today", "most of your", "most of that",
  "half of the sky", "of the sky", "of the ledger", "side of that",
  "your day with", "finish your day", "end your day",
  "month for your", "for your wallet", "for your heart", "for your body",
  "for your study", "month for your work",
  "across the month", "a day in hand", "day in hand", "a day for researching",
  "a day for repairing", "take it in stride", "it in stride",
  "under the moon", "with the moon", "off the moon", "from the lunar",
  "by the lunar", "the lunar tide", "the lunar band", "lunar current",
  "feel a similar", "a similar slowdown", "a similar drag", "this month is for",
  "month is for", "it on your", "on your closest", "the far side", "far side",
  "emerges as the", "from your steady", "from your body",
  "rest of this month", "middle of this month", "of this month",
  "one that", "for this month", "this month that",
];

const bad: string[] = [];
for (const c of candidates) {
  const ws = c.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const hits: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) {
    const t = `${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`;
    if (corpus.has(t)) hits.push(t);
  }
  if (hits.length) bad.push(`${c}  → shared: ${hits.join(" | ")}`);
}
console.log(bad.length ? `${bad.length} UNSAFE candidates:\n${bad.join("\n")}` : "ALL CANDIDATES CLEAN");
