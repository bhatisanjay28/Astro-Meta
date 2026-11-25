import { allRows } from "./index";
for (const r of allRows) {
  if (r.lang !== "en") continue;
  if (!r.slot.startsWith("daily.love") && !r.slot.startsWith("daily.health")) continue;
  if (!r.condition.includes("pb=unfav") || !r.condition.includes("retro=none") || !r.condition.includes("rating=excellent")) continue;
  console.log(`${r.slot} en#${r.variant_no}: ${r.text.split(/\s+/).length}w  | ${r.text.slice(0, 60)}`);
}
