// One-off: rerun the horoscope generation the same way the Workers cron does,
// now that the full 6,392-row phrase bank is imported into horoscope_library.
// Republishes daily/weekly/monthly/yearly rows that were previously composed
// from fallback templates. Creds come from backend/.env via Bun's auto-load —
// never printed. Run: cd backend && bun ../../_bmad-output/horoscope/dev/regen.ts
import { runHoroscopeGeneration } from "../../../backend/src/cron";

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  // FRONTEND_DEPLOY_HOOK_URL intentionally omitted — hook fired separately via CF API.
};
const result = await runHoroscopeGeneration(env as never);
console.log(
  JSON.stringify(
    {
      status: result.status,
      published: result.published,
      violations: result.violations.length,
      durationMs: result.durationMs,
      ranAt: result.ranAt,
    },
    null,
    2,
  ),
);
