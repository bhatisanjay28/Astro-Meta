import { readdirSync, readFileSync } from "node:fs";
import { allRows } from "./index";
const dir = new URL("../originality/fetch/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const corpus = new Set<string>();
for (const file of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const raw = readFileSync(`${dir}${file}`, "utf8");
  const text = raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const ws = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 2 < ws.length; i++) corpus.add(`${ws[i]} ${ws[i+1]} ${ws[i+2]}`);
}
for (const row of allRows) {
  if (row.lang !== "en") continue;
  const ws = row.text.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const hits: string[] = [];
  const tris: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) { const t = `${ws[i]} ${ws[i+1]} ${ws[i+2]}`; tris.push(t); if (corpus.has(t)) hits.push(t); }
  if (!tris.length || hits.length / tris.length <= 0.01) continue;
  console.log(`--- ${row.slot} [${row.condition}] en#${row.variant_no}  ${hits.length}/${tris.length}`);
  console.log(`    SHARED: ${[...new Set(hits)].join(" | ")}`);
  console.log(row.text);
}
