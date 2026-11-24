/**
 * One-shot generation trigger (scratch — NOT committed).
 * Runs the SAME runHoroscopeGeneration the worker cron executes, against the
 * production Supabase creds from backend/.env — so dated rows with payload
 * exist immediately instead of waiting for the 18:35 UTC cron. Idempotent.
 * Run: bun _bmad-output/horoscope/dev/hz-run-once.ts
 */
import { readFileSync } from "node:fs";
import { runHoroscopeGeneration } from "../../../backend/src/cron";

const envFile = readFileSync(
  "C:/Users/sanjay.bhati.OM/Downloads/Vyotish-Repos/Astro-Meta/backend/.env",
  "utf8",
);
const env: Record<string, string> = {};
for (const m of envFile.matchAll(/^\s*([A-Z_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/gm)) {
  env[m[1]] = m[2];
}
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  process.exit(1);
}
console.log("creds present, running generation…");
await runHoroscopeGeneration(env as never);
console.log("done");
