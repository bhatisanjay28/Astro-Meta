// One-shot: capture exact data key paths of every calculator endpoint (live).
const B = "https://astro-backend.vyotish.workers.dev/api/v1";
const QS = [
  ["rashi", "calculators/rashi?date=1990-05-15&time=14:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["lagna", "calculators/lagna?date=1990-05-15&time=14:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["dasha", "calculators/vimshottari-dasha?date=1990-05-15&time=14:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["sade-sati", "calculators/sade-sati?date=1995-11-05&time=14:20&lat=19.076&lng=72.8777&tz=Asia/Kolkata"],
  ["kaal-sarp", "calculators/kaal-sarp?date=1990-05-15&time=14:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["mangal-dosha", "calculators/mangal-dosha?date=1992-03-02&time=08:15&lat=26.9124&lng=75.7873&tz=Asia/Kolkata&gender=male"],
  ["karakas", "calculators/karakas?date=1990-06-15&time=06:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["ishta-devata", "calculators/ishta-devata?date=1990-06-15&time=06:30&lat=28.6139&lng=77.209&tz=Asia/Kolkata"],
  ["moon-phase", "calculators/moon-phase?date=2025-01-13&time=22:27"],
  ["sun-sign", "calculators/sun-sign?date=1990-06-15"],
  ["destiny-number", "calculators/destiny-number?date=1990-06-15"],
  ["numerology", "calculators/numerology?date=1990-06-15&name=Ram"],
  ["lo-shu", "calculators/lo-shu?date=1990-06-15"],
  ["name-numerology", "calculators/name-numerology?name=Poonam&date=1990-06-15"],
  ["mobile-numerology", "calculators/mobile-numerology?digits=%2B91%2098765%2043210"],
  ["vehicle-plate", "calculators/vehicle-plate?plate=DL8CAF1234&date=1990-06-15"],
  ["age", "calculators/age?date=2000-02-29&now=2026-11-21"],
  ["name-compatibility", "calculators/name-compatibility?a=Ram&b=Sita"],
  ["flames", "calculators/flames?a=Rohan&b=Lenna"],
  ["love", "calculators/love?a=Ram&b=Sita"],
  ["friendship", "calculators/friendship?a=Ram&b=Sita"],
];
const walk = (o, p) =>
  Object.entries(o ?? {})
    .map(([k, v]) =>
      typeof v === "object" && v !== null && !Array.isArray(v)
        ? walk(v, p + k + ".")
        : p + k + (Array.isArray(v) ? `[${v.length && typeof v[0] === "object" ? "obj" : typeof (v[0] ?? "")}]` : `:${typeof v}`),
    )
    .join("  ");
for (const [name, path] of QS) {
  const j = await (await fetch(`${B}/${path}`)).json();
  console.log(`=== ${name}\n  ${walk(j.data, "")}`);
}
