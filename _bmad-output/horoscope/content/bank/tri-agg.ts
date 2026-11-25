// Aggregate shared trigrams across failing EN rows: trigram → occurrence count.
// Same corpus loading + thresholds as validate-and-import.ts originalityCheck().
import { readdirSync, readFileSync } from "node:fs";
import { allRows } from "./index";

const dir = new URL("../originality/fetch/", import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, "$1");
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

function tris(text: string): string[] {
  const ws = text.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) out.push(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
  return out;
}

const counts = new Map<string, number>();
let failing = 0;
for (const row of allRows) {
  if (row.lang !== "en") continue;
  const t = tris(row.text);
  if (!t.length) continue;
  const hits = new Set(t.filter((x) => corpus.has(x)));
  const pct = hits.size / t.length;
  if (pct > 0.01) {
    failing++;
    for (const h of hits) counts.set(h, (counts.get(h) ?? 0) + 1);
  }
}
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log(`${failing} failing rows, ${sorted.length} distinct shared trigrams; top 60:`);
for (const [g, n] of sorted.slice(0, 60)) console.log(`${String(n).padStart(4)}  ${g}`);
