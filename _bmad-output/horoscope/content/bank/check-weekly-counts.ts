import { weeklyOverviewRows } from "./weekly-overview.en";
let bad = 0;
for (const r of weeklyOverviewRows) {
  const n = r.text.trim().split(/\s+/).length;
  if (n < 50 || n > 80) { console.log(`${r.condition} en#${r.variant_no}: ${n}`); bad++; }
}
console.log(bad === 0 ? "ALL 32 IN BOUNDS" : `${bad} out of bounds`);
