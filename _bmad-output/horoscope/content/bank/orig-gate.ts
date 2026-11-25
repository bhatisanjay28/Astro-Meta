// originality-only dry run (no import, no env): replicate EN trigram check
import { readdirSync, readFileSync } from "node:fs";
import { allRows } from "./index";
const dir = new URL("../originality/fetch/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const corpus = new Set<string>();
for (const file of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const raw = readFileSync(`${dir}${file}`, "utf8");
  const text = raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const ws = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 2 < ws.length; i++) corpus.add(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
}
let bad = 0;
for (const row of allRows) {
  if (row.lang !== "en") continue;
  const ws = row.text.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const tris: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) tris.push(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
  if (!tris.length) continue;
  const hits = tris.filter((t) => corpus.has(t));
  const pct = hits.length / tris.length;
  if (pct > 0.01) {
    bad++;
    console.log(`ERROR  ${row.slot} [${row.condition}] en#${row.variant_no}: ${(pct * 100).toFixed(2)}% (${hits.length}/${tris.length})`);
  }
}
console.log(`${bad} failing`);
