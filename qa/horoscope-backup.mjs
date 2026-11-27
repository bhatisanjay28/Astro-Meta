/**
 * Pre-change backup of the horoscope tables (S23 cron-repair task).
 * Reads creds from backend/.env — never prints them. Writes JSON files to
 * qa/evidence/horoscope-backup-2026-11-27/ (gitignored) and prints only
 * row counts + output paths.
 *
 * Run: bun qa/horoscope-backup.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const envText = await Bun.file(new URL("../backend/.env", import.meta.url)).text();
const get = (k) => {
  const m = envText.match(new RegExp(`^${k}=(.*)$`, "m"));
  if (!m) throw new Error(`missing ${k} in backend/.env`);
  return m[1].trim();
};
const url = get("SUPABASE_URL");
const key = get("SUPABASE_SERVICE_ROLE_KEY");
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

async function pullAll(table) {
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const res = await fetch(`${url}/rest/v1/${table}?limit=${pageSize}&offset=${offset}`, { headers });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

const outDir = join(import.meta.dir, "evidence", "horoscope-backup-2026-11-27");
mkdirSync(outDir, { recursive: true });

const targets = [
  ["horoscopes", "horoscopes.json"],
  ["horoscope_run_log", "horoscope_run_log.json"],
  ["horoscope_library", "horoscope_library.json"],
  ["content_blocks?block_key=in.(horoscope.disclaimer,horoscope.disclosure,horoscope.rating_labels,horoscope.lucky_why,horoscope.sadesati_note,horoscope.chandrashtama_tag,horoscope.headers,horoscope.area_names,horoscope.month_clause_intro)", "content_blocks_horoscope.json"],
];

for (const [table, file] of targets) {
  const name = file.replace(".json", "");
  const rows = await pullAll(table);
  writeFileSync(join(outDir, file), JSON.stringify(rows, null, 2));
  console.log(`${name}: ${rows.length} rows -> qa/evidence/horoscope-backup-2026-11-27/${file}`);
}
console.log("backup complete");
