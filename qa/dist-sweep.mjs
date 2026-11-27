// Visitor-facing copy sweep (S19 gate, reused per push — S24 additions).
// Scans every public dist file (HTML + JS chunks; /admin and /access excluded
// — authed surfaces, not visitor copy) for internal/dev tokens that must never
// reach a visitor. Pattern set = the S19 QA-REPORT list + S24 build terms.
// Story-id/i18n-symbol patterns apply to HTML only: minified _astro chunks
// legally contain tokens like "S24" as mangled identifiers, not visitor copy.
// Run: bun qa/dist-sweep.mjs   (dist must be built; pass DIST to override)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const DIST = process.env.DIST ?? resolve(import.meta.dirname, "../frontend/dist");

const HTML_PATTERNS = [
  [/\bEpic \d+/gi, "Epic N"],
  [/PRD\s?§/g, "PRD §"],
  [/\(P\d+\)/g, "(P#)"],
  [/\bP\d+\b/g, "P# token"],
  [/admin-authored|admin-managed|publication engine|admin area/gi, "admin-authored wording"],
  [/SAMPLE DATA|\(sample\)|Sample data/gi, "sample marker"],
  [/\bPhase [12]\b/g, "Phase 1/2"],
  [/GEMSTONES_SITE_URL/g, "GEMSTONES_SITE_URL"],
  [/Supabase/gi, "Supabase"],
  [/Jyotishi review/gi, "Jyotishi review"],
  [/\bS2[0-9]\b/g, "story-id token (S2x)"],
  [/getStaticPaths|hiPathOf|langFromPath|withLang\(/g, "build/i18n symbol"],
  [/Twin proxy|hi-twin|re-export/gi, "twin build term"],
  [/\bi18n\b/g, "i18n token"],
];
// Minified chunks: only tokens that would be a real leak even in compiled code.
const JS_PATTERNS = [
  [/GEMSTONES_SITE_URL/g, "GEMSTONES_SITE_URL"],
  [/Supabase/gi, "Supabase"],
  [/SAMPLE DATA/g, "sample marker"],
  [/admin-authored|admin-managed|publication engine/gi, "admin-authored wording"],
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// /privacy/* legitimately names infrastructure processors (DPDP disclosure,
// S19 review condition C2); /admin + /access are authed surfaces, not visitor copy.
const banned = (p) =>
  p.includes(`${sep}admin${sep}`) ||
  p.includes(`${sep}access${sep}`) ||
  /(^|\\|\/)privacy(\\|\/|\.|$)/.test(relative(DIST, p));
const hits = [];
let files = 0;
for (const f of walk(DIST)) {
  if (banned(f)) continue;
  if (!/\.(html|js)$/.test(f)) continue;
  files += 1;
  const src = readFileSync(f, "utf8");
  const patterns = f.endsWith(".html") ? HTML_PATTERNS : JS_PATTERNS;
  for (const [re, label] of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      const line = src.slice(0, m.index).split("\n").length;
      const ctx = src.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\s+/g, " ");
      hits.push(`${relative(DIST, f)}:${line} [${label}] …${ctx}…`);
      if (hits.length >= 400) { hits.push("(cap reached — fix before full listing)"); break; }
    }
    if (hits.length >= 400) break;
  }
}
console.log(`swept ${files} files`);
if (hits.length) {
  console.log(`FINDINGS: ${hits.length}`);
  for (const h of hits.slice(0, 60)) console.log("  " + h);
  process.exit(1);
} else {
  console.log("CLEAN — no banned tokens in public dist");
}
