// Trigram diff: which word-triples of each failing row appear in the fetch corpus?
import { readdirSync, readFileSync } from "node:fs";
import { allRows } from "./index";

const dir = new URL("../originality/fetch/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const files = readdirSync(dir).filter((x) => x.endsWith(".html"));
const triSource = new Map<string, string>();
for (const file of files) {
  const raw = readFileSync(`${dir}${file}`, "utf8");
  const text = raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const ws = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 2 < ws.length; i++) {
    const t = `${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`;
    if (!triSource.has(t)) triSource.set(t, file);
  }
}

function tris(text: string): string[] {
  const ws = text.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) out.push(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
  return out;
}

const fail = new Set([
  "yearly.love [rating=excellent.driver=saturn-phase] 2",
  "yearly.love [rating=good.driver=saturn-phase] 1",
  "yearly.love [rating=good.driver=saturn-phase] 2",
  "yearly.love [rating=moderate.driver=saturn-phase] 3",
  "yearly.love [rating=excellent.driver=rahu-axis] 2",
  "yearly.love [rating=excellent.driver=rahu-axis] 3",
  "yearly.love [rating=good.driver=rahu-axis] 1",
  "yearly.love [rating=good.driver=rahu-axis] 2",
  "yearly.love [rating=challenging.driver=rahu-axis] 1",
  "yearly.love [rating=good.driver=mixed] 1",
  "yearly.love [rating=excellent.driver=steady] 1",
  "yearly.love [rating=good.driver=steady] 1",
  "yearly.love [rating=challenging.driver=steady] 1",
  "yearly.marriage [rating=excellent.driver=jupiter-good] 3",
  "yearly.marriage [rating=challenging.driver=jupiter-good] 1",
  "yearly.marriage [rating=excellent.driver=rahu-axis] 2",
  "yearly.marriage [rating=good.driver=rahu-axis] 1",
  "yearly.marriage [rating=good.driver=steady] 1",
  "yearly.wealth [rating=excellent.driver=jupiter-good] 1",
  "yearly.wealth [rating=good.driver=saturn-phase] 2",
  "yearly.wealth [rating=excellent.driver=rahu-axis] 2",
  "yearly.wealth [rating=good.driver=rahu-axis] 1",
  "yearly.wealth [rating=excellent.driver=steady] 3",
  "yearly.wealth [rating=good.driver=steady] 1",
]);

for (const row of allRows) {
  if (row.lang !== "en") continue;
  const key = `${row.slot} [${row.condition}] ${row.variant_no}`;
  if (!fail.has(key)) continue;
  const hits: string[] = [];
  for (const t of tris(row.text)) if (triSource.has(t)) hits.push(`${t}   ←${triSource.get(t)}`);
  console.log(`=== ${key}  (${hits.length} shared)`);
  for (const h of new Set(hits)) console.log(`   ${h}`);
}
