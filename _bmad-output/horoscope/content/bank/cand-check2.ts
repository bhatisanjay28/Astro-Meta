import { readdirSync, readFileSync } from "node:fs";
const dir = new URL("../originality/fetch/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const corpus = new Set<string>();
for (const file of readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const raw = readFileSync(`${dir}${file}`, "utf8");
  const text = raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const ws = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 2 < ws.length; i++) corpus.add(`${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`);
}
for (const c of process.argv.slice(2)) {
  const ws = c.toLowerCase().replace(/[^a-z0-9\s{]/g, " ").split(/\s+/).filter(Boolean);
  const hits: string[] = [];
  for (let i = 0; i + 2 < ws.length; i++) {
    const t = `${ws[i]} ${ws[i + 1]} ${ws[i + 2]}`;
    if (corpus.has(t)) hits.push(t);
  }
  console.log(hits.length ? `UNSAFE  ${c}  → ${hits.join(" | ")}` : `clean   ${c}`);
}
