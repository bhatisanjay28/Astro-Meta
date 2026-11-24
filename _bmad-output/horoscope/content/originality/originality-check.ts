// Step 2 originality check (Paige, per style-guide.md §9):
// word-trigram containment + shared 8-word-run detection of OUR sample text
// against fetched competitor pages. Fetched HTML lives in ./fetch (untrusted).
// Usage: bun originality-check.ts
import { readdirSync } from "node:fs";

const HERE = import.meta.dir;
const FETCH = `${HERE}/fetch`;

// ---- 1. our EN sample text -------------------------------------------------
async function ourEnText(file: string): Promise<string> {
  const t = await Bun.file(`${HERE}/../samples/${file}`).text();
  return t
    .split("\n")
    // keep EN blockquote lines + EN table rows; drop HI (Devanagari) lines
    .filter((l) => !/[\u0900-\u097F]/.test(l))
    .join("\n");
}

function cleanOur(raw: string): string {
  return raw
    .replace(/\*\((?:[^*]|\*(?!\*))*\*\)/g, " ") // strip *(slot · condition)* annotations
    .replace(/Om [A-Za-z ]+Namah/gi, " ")        // exempt: beej-mantra transliterations (style §9.4)
    .replace(/[|#*>`—·→✅⛔🔴🟢]/g, " ")
    .toLowerCase();
}

// ---- 2. competitor text -----------------------------------------------------
function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript|svg|head)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[|*>#`]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function words(t: string): string[] {
  return t.split(/[^a-z0-9']+/).filter((w) => w.length > 1);
}

function ngrams(ws: string[], n: number): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i + n <= ws.length; i++) s.add(ws.slice(i, i + n).join(" "));
  return s;
}

// ---- 3. compare -------------------------------------------------------------
const N = 3, RUN = 8;
const samples = [
  { name: "aries EN (4 periods)", text: cleanOur(await ourEnText("aries-2026-11-25.md")) },
  { name: "pisces EN (4 periods)", text: cleanOur(await ourEnText("pisces-2026-11-25.md")) },
];
const pages = readdirSync(FETCH).filter((f) => f.endsWith(".html"));

let flags = 0;
const report: string[] = [];
for (const s of samples) {
  const sw = words(s.text);
  const st3 = ngrams(sw, N), st8 = ngrams(sw, RUN);
  for (const p of pages) {
    const cw = words(htmlToText(await Bun.file(`${FETCH}/${p}`).text()));
    const ct3 = ngrams(cw, N), ct8 = ngrams(cw, RUN);
    let shared = 0;
    for (const g of st3) if (ct3.has(g)) shared++;
    const containment = st3.size ? shared / st3.size : 0;
    const runs = [...st8].filter((g) => ct8.has(g));
    const runFlag = runs.length > 0;
    const ok = containment < 0.20 && !runFlag;
    if (!ok) flags++;
    report.push(
      `${ok ? "PASS" : "**FLAG**"}  ${s.name}  vs  ${p}  — trigram containment ${(containment * 100).toFixed(2)}% (shared ${shared}/${st3.size}); shared 8-word runs: ${runs.length}${runFlag ? " → " + runs.slice(0, 5).map((r) => `"${r}"`).join(", ") : ""}`,
    );
  }
}
console.log(report.join("\n"));
console.log(flags === 0 ? "\nALL CLEAR — no batch flags" : `\n${flags} FLAG(S) — rewrite required before library import`);
