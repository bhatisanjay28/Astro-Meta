// usage: bun check-counts.ts ./weekly-career.en 45 70
const path = process.argv[2]!;
const lo = Number(process.argv[3]!);
const hi = Number(process.argv[4]!);
const mod: any = await import(path);
let total = 0;
let bad = 0;
for (const v of Object.values(mod)) {
  if (!Array.isArray(v)) continue;
  for (const r of v as any[]) {
    if (typeof r?.text !== "string" || typeof r?.condition !== "string") continue;
    total++;
    const n = r.text.trim().split(/\s+/).length;
    if (n < lo || n > hi) {
      console.log(`${r.condition} ${r.lang}#${r.variant_no}: ${n}`);
      bad++;
    }
  }
}
console.log(`${total} rows, ${bad} out of ${lo}-${hi}`);
