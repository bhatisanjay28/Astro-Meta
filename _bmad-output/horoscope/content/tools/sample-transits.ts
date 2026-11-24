/**
 * Paige Step-2 tool: compute REAL horoscope conditions for sample content.
 * Runs Mary's rule set (_bmad-output/horoscope/research/03-ruleset.md) against
 * astronomy-engine sidereal positions (same approach as backend/src/engine).
 * NOT production code — a sample/spec validation tool.
 * Run:  bun _bmad-output/horoscope/content/tools/sample-transits.ts
 */
import Astronomy from "../../../../backend/node_modules/astronomy-engine";
import { writeFileSync } from "node:fs";

// ---------- ephemeris layer (mirrors backend: Lahiri computed, geocentric, ecliptic-of-date)
const J2000 = Date.UTC(2000, 0, 1, 12);
const ayan = (d: Date) => 23.853044 + (50.2564 / 3600) * ((d.getTime() - J2000) / 31557600000);
const norm = (x: number) => ((x % 360) + 360) % 360;
const sunTrop = (d: Date) => Astronomy.SunPosition(d).elon;
const moonTrop = (d: Date) => Astronomy.EclipticGeoMoon(d).lon;
const sid = (d: Date) => norm(moonTrop(d) - ayan(d));
const sunSid = (d: Date) => norm(sunTrop(d) - ayan(d));
const geoSid = (body: Astronomy.Body, d: Date) =>
  norm(Astronomy.Ecliptic(Astronomy.GeoVector(body, d, true)).elon - ayan(d));
const nodeTrop = (d: Date) =>
  125.04452 - 0.05295376 * ((d.getTime() - J2000) / 86400000); // Meeus 47.7 mean node
const rahuSid = (d: Date) => norm(nodeTrop(d) - ayan(d));
const ketuSid = (d: Date) => norm(nodeTrop(d) + 180 - ayan(d));

function retroOf(body: Astronomy.Body, d: Date): boolean {
  const d2 = new Date(d.getTime() + 3600_000);
  let delta = norm(geoSid(body, d2) - geoSid(body, d));
  if (delta > 180) delta -= 360;
  return delta < 0;
}

type PlanetName = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";
const PLANETS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const BODY: Record<PlanetName, Astronomy.Body | null> = {
  Sun: Astronomy.Body.Sun, Moon: Astronomy.Body.Moon, Mars: Astronomy.Body.Mars,
  Mercury: Astronomy.Body.Mercury, Jupiter: Astronomy.Body.Jupiter, Venus: Astronomy.Body.Venus,
  Saturn: Astronomy.Body.Saturn, Rahu: null, Ketu: null,
};

type Snapshot = { planets: Record<PlanetName, { lon: number; sign: number; retro: boolean }> };
function snapshot(d: Date): Snapshot {
  const out = {} as Snapshot["planets"];
  for (const p of PLANETS) {
    const lon = p === "Sun" ? sunSid(d) : p === "Moon" ? sid(d)
      : p === "Rahu" ? rahuSid(d) : p === "Ketu" ? ketuSid(d)
      : geoSid(BODY[p] as Astronomy.Body, d);
    const retro = p === "Sun" || p === "Moon" ? false
      : p === "Rahu" || p === "Ketu" ? true : retroOf(BODY[p] as Astronomy.Body, d);
    out[p] = { lon, sign: Math.floor(lon / 30), retro };
  }
  return { planets: out };
}

// ---------- rule-set tables (03-ruleset.md §2–§5)
const house = (p: number, s: number) => ((p - s + 12) % 12) + 1;
const FAVORABLE: Record<PlanetName, number[]> = {
  Sun: [3, 6, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11], Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12], Saturn: [3, 6, 11], Rahu: [3, 6, 11], Ketu: [3, 6, 11],
};
const VEDHA: Partial<Record<PlanetName, Record<number, number>>> = {
  Sun: { 3: 9, 6: 12, 10: 4, 11: 5 }, Moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  Mars: { 3: 12, 6: 9, 11: 5 }, Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
  Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  Venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  Saturn: { 3: 12, 6: 9, 11: 5 },
};
const OBSTRUCTORS: PlanetName[] = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]; // nodes+Moon never obstruct [ED]
const EXEMPT: [PlanetName, PlanetName][] = [["Sun", "Saturn"], ["Moon", "Mercury"]]; // never obstruct each other

function vedhaBlocked(p: PlanetName, s: number, snap: Snapshot): boolean {
  const h = house(snap.planets[p].sign, s);
  const obs = VEDHA[p]?.[h];
  if (!obs) return false;
  for (const q of OBSTRUCTORS) {
    if (q === p) continue;
    if (EXEMPT.some(([a, b]) => (a === p && b === q) || (a === q && b === p))) continue;
    if (house(snap.planets[q].sign, s) === obs) return true;
  }
  return false;
}

function baseVal(p: PlanetName, s: number, snap: Snapshot): number {
  const h = house(snap.planets[p].sign, s);
  const fav = FAVORABLE[p].includes(h);
  let v = fav && !vedhaBlocked(p, s, snap) ? 1
    : fav && vedhaBlocked(p, s, snap) ? 0.2
    : (p === "Rahu" || p === "Ketu") && h === 10 ? 0.5
    : !fav ? -1 : 0;
  if (snap.planets[p].retro && v > 0) v *= 0.6; // §3 retro benefic
  return v;
}

const WEIGHTS: Record<string, Record<PlanetName, number>> = {
  health:   { Sun: .20, Moon: .30, Mars: .15, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: .20, Rahu: .10, Ketu: .05 },
  education:{ Sun: 0, Moon: .10, Mars: 0, Mercury: .40, Jupiter: .35, Venus: .15, Saturn: 0, Rahu: 0, Ketu: 0 },
  career:   { Sun: .25, Moon: 0, Mars: .20, Mercury: .15, Jupiter: .15, Venus: 0, Saturn: .25, Rahu: 0, Ketu: 0 },
  business: { Sun: 0, Moon: 0, Mars: .10, Mercury: .35, Jupiter: .15, Venus: .20, Saturn: .20, Rahu: 0, Ketu: 0 },
  wealth:   { Sun: 0, Moon: .15, Mars: 0, Mercury: .15, Jupiter: .30, Venus: .25, Saturn: .15, Rahu: 0, Ketu: 0 },
  love:     { Sun: 0, Moon: .30, Mars: .15, Mercury: 0, Jupiter: .15, Venus: .40, Saturn: 0, Rahu: 0, Ketu: 0 },
  marriage: { Sun: 0, Moon: .20, Mars: 0, Mercury: 0, Jupiter: .30, Venus: .35, Saturn: .15, Rahu: 0, Ketu: 0 },
  family:   { Sun: .10, Moon: .35, Mars: 0, Mercury: 0, Jupiter: .25, Venus: .15, Saturn: .15, Rahu: 0, Ketu: 0 },
  children: { Sun: .10, Moon: .25, Mars: 0, Mercury: 0, Jupiter: .40, Venus: .15, Saturn: .10, Rahu: 0, Ketu: 0 },
};
export type Area = keyof typeof WEIGHTS;
export const AREAS = Object.keys(WEIGHTS) as Area[];
const SADE = [0, -0.2, -0.25, -0.2, 0, -0.15, 0, -0.15, 0, 0, 0, 0]; // satHouse 1..12 → mod; SADE[1]=12th? no: index by house: [1]=-0.2,2=-0.25,3=-0.2,4=-0.15,8=-0.15
const SADE_MOD: Record<number, number> = { 12: -0.2, 1: -0.25, 2: -0.2, 4: -0.15, 8: -0.15 };
const SADE_PHASE: Record<number, string> = { 12: "Sade Sati phase 1", 1: "Sade Sati phase 2 (peak)", 2: "Sade Sati phase 3", 4: "Ardhastama (Dhaiya)", 8: "Ashtama phase" };

function scores(s: number, snap: Snapshot) {
  const b = Object.fromEntries(PLANETS.map((p) => [p, baseVal(p, s, snap)])) as Record<PlanetName, number>;
  const satH = house(snap.planets.Saturn.sign, s);
  const jupH = house(snap.planets.Jupiter.sign, s);
  const out = {} as Record<Area, number>;
  for (const a of AREAS) {
    let v = PLANETS.reduce((acc, p) => acc + WEIGHTS[a][p] * b[p as PlanetName], 0);
    if (a === "health" || a === "family" || a === "career") v += SADE_MOD[satH] ?? 0;
    if (jupH === 1) v += 0.10;
    out[a] = Math.max(-1, Math.min(1, v));
  }
  return { b, areas: out, satH, jupH };
}
const rating = (v: number) => v >= 0.35 ? "Excellent" : v >= 0.10 ? "Good" : v > -0.10 ? "Moderate" : "Challenging";
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

// attributions (§5)
const ATTR = {
  Sun: { colours: ["saffron", "gold", "orange"], number: 1, dir: "East", deity: "Surya", mantra: "Om Hraam Hreem Hraum Sah Suryaya Namah" },
  Moon: { colours: ["white", "silver"], number: 2, dir: "North-West", deity: "Parvati", mantra: "Om Shraam Shreem Shraum Sah Chandraya Namah" },
  Mars: { colours: ["red", "crimson"], number: 9, dir: "South", deity: "Hanuman", mantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah" },
  Mercury: { colours: ["green"], number: 5, dir: "North", deity: "Vishnu", mantra: "Om Braam Breem Braum Sah Budhaya Namah" },
  Jupiter: { colours: ["yellow", "gold"], number: 3, dir: "North-East", deity: "Brihaspati", mantra: "Om Graam Greem Graum Sah Gurave Namah" },
  Venus: { colours: ["white", "cream"], number: 6, dir: "South-East", deity: "Lakshmi", mantra: "Om Draam Dreem Draum Sah Shukraya Namah" },
  Saturn: { colours: ["blue", "black", "grey"], number: 8, dir: "West", deity: "Shani", mantra: "Om Praam Preem Praum Sah Shanaischaraya Namah" },
  Rahu: { colours: ["smoky", "multi-shade"], number: 4, dir: "South-West", deity: "Durga", mantra: "Om Bhraam Breem Bhraum Sah Rahave Namah" },
  Ketu: { colours: ["grey", "brown"], number: 7, dir: null, deity: "Ganesha", mantra: "Om Sraam Sreem Sraum Sah Ketave Namah" },
} as const;
const TIE = ["Jupiter", "Venus", "Mercury", "Moon", "Sun", "Mars", "Saturn", "Rahu", "Ketu"] as PlanetName[];
function attrib(s: number, snap: Snapshot) {
  const { b } = scores(s, snap);
  const pool = [...TIE].sort((x, y) => (b[y] - b[x]) || TIE.indexOf(x) - TIE.indexOf(y));
  const top = pool[0];
  const dirPool = pool.filter((p) => p !== "Ketu");
  return {
    planet: top, base: b[top],
    colours: ATTR[top].colours, number: ATTR[top].number,
    direction: ATTR[top as keyof typeof ATTR].dir ?? ATTR[dirPool[0]].dir, // Ketu never assigns direction
    directionPlanet: ATTR[top].dir ? top : dirPool[0],
    deity: ATTR[top].deity, mantra: ATTR[top].mantra,
  };
}

// do/don't houses (§6): best positive / worst negative house
function dosDonts(s: number, snap: Snapshot) {
  const { b } = scores(s, snap);
  let doH = 0, doP: PlanetName = "Sun", doV = -2, dnH = 0, dnP: PlanetName = "Sun", dnV = 2;
  for (const p of PLANETS) {
    const h = house(snap.planets[p].sign, s);
    if (b[p] > doV) { doV = b[p]; doH = h; doP = p; }
    if (b[p] < dnV) { dnV = b[p]; dnH = h; dnP = p; }
  }
  return { doHouse: doH, doPlanet: doP, dontHouse: dnV < 0 ? dnH : null, dontPlanet: dnV < 0 ? dnP : null };
}

// panchang-ish labels
const NAK = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const TITHI = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi"];
function panchangLabels(d: Date) {
  const ist = new Date(d.getTime() + 5.5 * 3600_000);
  const vaar = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][ist.getUTCDay()];
  const elong = norm(moonTrop(d) - sunTrop(d));
  const ti = Math.floor(elong / 12);
  const tithi = ti === 14 ? "Purnima" : ti === 29 ? "Amavasya"
    : `${ti < 15 ? "Shukla" : "Krishna"} ${TITHI[ti % 15]}`;
  return { vaar, tithi, nakshatra: NAK[Math.floor(sid(d) / (13 + 1 / 3))], paksha: elong < 180 ? "Shukla (waxing)" : "Krishna (waning)" };
}

const SIGN_NAMES = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const istDate = (y: number, m: number, d: number, h = 12, min = 0) => new Date(Date.UTC(y, m, d, h, min) - 5.5 * 3600_000);
// istDate(2026,10,25,0,5) = 2026-11-25 00:05 IST  (month 0-based)
function evalSign(s: number, d: Date) {
  const snap = snapshot(d);
  const { b, areas, satH, jupH } = scores(s, snap);
  return {
    snapshot: Object.fromEntries(PLANETS.map((p) => [p, {
      ...snap.planets[p as PlanetName], house: house(snap.planets[p as PlanetName].sign, s), b: b[p as PlanetName],
    }])),
    areas, ratings: Object.fromEntries(AREAS.map((a) => [a, rating(areas[a])])),
    satH, sadePhase: SADE_PHASE[satH] ?? null, jupH,
    attrib: attrib(s, snap), dosDonts: dosDonts(s, snap),
    moonHouse: house(snap.planets.Moon.sign, s),
  };
}

const TARGETS = [
  { key: "aries", idx: 0 }, { key: "pisces", idx: 11 },
];
const out: Record<string, any> = { generated: "2026-11-24", sampleDate: "2026-11-25 (IST)", signs: {} };

for (const t of TARGETS) {
  const S: Record<string, any> = {};
  // ---- DAILY (2026-11-25 00:05 IST = cron instant)
  const d0 = istDate(2026, 10, 25, 0, 5);
  const ev = evalSign(t.idx, d0);
  S.daily = { at: "2026-11-25T00:05 IST", ...ev, panchang: panchangLabels(d0) };

  // ---- WEEKLY (Mon 2026-11-30 .. Sun 2026-12-06)
  const days: number[] = [];
  const moonSweep: number[] = [];
  const acc: Record<string, number[]> = Object.fromEntries(AREAS.map((a) => [a, []]));
  for (let i = 0; i < 7; i++) {
    const d = istDate(2026, 10, 30 + i, 12);
    const e = evalSign(t.idx, d);
    moonSweep.push(house(e.snapshot.Moon.sign, t.idx));
    for (const a of AREAS) acc[a].push(e.areas[a]);
    days.push(e.snapshot.Moon.sign);
  }
  const wAreas = Object.fromEntries(AREAS.map((a) => [a, mean(acc[a])]));
  const wEval = evalSign(t.idx, istDate(2026, 11, 3, 12)); // mid-week snapshot (Dec 3) for attributions
  S.weekly = { window: "Mon 2026-11-30 – Sun 2026-12-06", areas: wAreas,
    ratings: Object.fromEntries(AREAS.map((a) => [a, rating(wAreas[a])])),
    moonSweepHouses: moonSweep, attrib: wEval.attrib, dosDonts: wEval.dosDonts };

  // ---- MONTHLY (December 2026)
  const mAcc: Record<string, number[]> = Object.fromEntries(AREAS.map((a) => [a, []]));
  const dayComposite: { d: string; core4: number }[] = [];
  let sunIngress: string | null = null; let prevSun = -1;
  const stations: string[] = [];
  const planetIngresses: string[] = [];
  const prevRetro: Record<string, boolean> = {};
  const prevSignFast: Record<string, number> = {};
  const phases: string[] = [];
  for (let i = 1; i <= 31; i++) {
    const d = istDate(2026, 11, i, 12);
    const e = evalSign(t.idx, d);
    for (const a of AREAS) mAcc[a].push(e.areas[a]);
    const core4 = mean(["health", "education", "career", "wealth"].map((a) => e.areas[a as Area]));
    dayComposite.push({ d: `2026-12-${String(i).padStart(2, "0")}`, core4 });
    const ss = Math.floor(sunSid(d) / 30);
    if (prevSun >= 0 && ss !== prevSun) sunIngress = `2026-12-${String(i).padStart(2, "0")}: Sun → ${SIGN_NAMES[ss]}`;
    prevSun = ss;
    for (const p of ["Mercury", "Venus", "Mars"] as const) {
      const body = p === "Mercury" ? Astronomy.Body.Mercury : p === "Venus" ? Astronomy.Body.Venus : Astronomy.Body.Mars;
      const r2 = retroOf(body, d);
      if (i > 1 && prevRetro[p] !== undefined && prevRetro[p] !== r2) stations.push(`2026-12-${String(i).padStart(2, "0")}: ${p} ${r2 ? "turns retrograde" : "turns direct"}`);
      prevRetro[p] = r2;
      const sg = Math.floor(geoSid(body, d) / 30);
      if (prevSignFast[p] !== undefined && sg !== prevSignFast[p]) planetIngresses.push(`2026-12-${String(i).padStart(2, "0")}: ${p} → ${SIGN_NAMES[sg]}`);
      prevSignFast[p] = sg;
    }
  }
  const mAreas = Object.fromEntries(AREAS.map((a) => [a, mean(mAcc[a])]));
  const sorted = [...dayComposite].sort((x, y) => y.core4 - x.core4);
  const mEval = evalSign(t.idx, istDate(2026, 11, 16, 12));
  const nm = Astronomy.SearchMoonPhase(0, istDate(2026, 11, 1, 12), 40);
  const fm = Astronomy.SearchMoonPhase(180, istDate(2026, 11, 1, 12), 40);
  const fmtIst = (x: unknown) => { const d = x ? (x as { date?: Date }).date ?? x : null; return d ? new Date((d as Date).getTime() + 5.5 * 3600_000).toISOString().slice(0, 10) : null; };
  S.monthly = { month: "December 2026", areas: mAreas,
    ratings: Object.fromEntries(AREAS.map((a) => [a, rating(mAreas[a])])),
    bestDays: sorted.slice(0, 3), testingDay: sorted[sorted.length - 1],
    sunIngress, stations, planetIngresses, newMoon: fmtIst(nm), fullMoon: fmtIst(fm),
    attrib: mEval.attrib, dosDonts: mEval.dosDonts };

  // ---- YEARLY (2027): slow trajectories + monthly aggregates
  const traj: Record<string, { date: string; sign: string }[]> = { Jupiter: [], Saturn: [], Rahu: [] };
  const prevSign: Record<string, number> = {};
  const mMonths: { month: string; areas: Record<string, number>; tableRating: string; satHouse: number | null; jupHouse: number; rahuHouse: number; topPos: string; topNeg: string }[] = [];
  const mAccY: Record<string, Record<string, number[]>> = {};
  const slowMid: Record<string, { sat: number; jup: number; rahu: number }> = {};
  for (let m = 0; m < 12; m++) {
    mAccY[m] = Object.fromEntries(AREAS.map((a) => [a, []]));
  }
  const d0y = Date.UTC(2027, 0, 1);
  for (let i = 0; i < 365; i++) {
    const d = new Date(d0y + i * 86400_000);
    const snapY = snapshot(d);
    for (const p of ["Jupiter", "Saturn", "Rahu"] as const) {
      const sg = snapY.planets[p].sign;
      if (prevSign[p] === undefined) prevSign[p] = sg;
      else if (sg !== prevSign[p]) { traj[p].push({ date: d.toISOString().slice(0, 10), sign: SIGN_NAMES[sg] }); prevSign[p] = sg; }
    }
    const m = (d.getUTCMonth());
    const e = scores(t.idx, snapY);
    for (const a of AREAS) mAccY[m][a].push(e.areas[a]);
    const key = `${d.getUTCFullYear()}-${String(m + 1).padStart(2, "0")}`;
    const day15 = new Date(Date.UTC(2027, m, 15));
    if (d.getUTCDate() === 15) slowMid[key] = { sat: house(snapY.planets.Saturn.sign, t.idx), jup: house(snapY.planets.Jupiter.sign, t.idx), rahu: house(snapY.planets.Rahu.sign, t.idx) };
    void day15;
  }
  const yAcc: Record<string, number[]> = Object.fromEntries(AREAS.map((a) => [a, []]));
  for (let m = 0; m < 12; m++) {
    const areas = Object.fromEntries(AREAS.map((a) => [a, mean(mAccY[m][a])]));
    const table = mean(AREAS.map((a) => areas[a]));
    const key = `2027-${String(m + 1).padStart(2, "0")}`;
    const sm = slowMid[key];
    // top pos / neg slow planets by b at month 15th (recompute cheaply)
    const snap15 = snapshot(new Date(Date.UTC(2027, m, 15)));
    const { b } = scores(t.idx, snap15);
    const slow = (["Jupiter", "Saturn", "Rahu"] as PlanetName[]).map((p) => ({ p, b: b[p], h: house(snap15.planets[p].sign, t.idx) }));
    const topPos = slow.filter((x) => x.b > 0).sort((x, y) => y.b - x.b)[0];
    const topNeg = slow.filter((x) => x.b < 0).sort((x, y) => x.b - y.b)[0];
    for (const a of AREAS) yAcc[a].push(areas[a]);
    mMonths.push({ month: key, areas, tableRating: rating(table),
      satHouse: sm?.sat ?? null, jupHouse: sm?.jup ?? NaN, rahuHouse: sm?.rahu ?? NaN,
      topPos: topPos ? `${topPos.p} in H${topPos.h}` : "—", topNeg: topNeg ? `${topNeg.p} in H${topNeg.h}` : "—" });
  }
  const yAreas = Object.fromEntries(AREAS.map((a) => [a, mean(yAcc[a])]));
  const yEval = evalSign(t.idx, new Date(Date.UTC(2027, 5, 15)));
  S.yearly = { year: 2027, areas: yAreas, ratings: Object.fromEntries(AREAS.map((a) => [a, rating(yAreas[a])])),
    trajectories: traj, months: mMonths, attrib: yEval.attrib,
    sadeMonths2027: mMonths.filter((m) => m.satHouse && SADE_PHASE[m.satHouse]).map((m) => ({ month: m.month, house: m.satHouse, phase: SADE_PHASE[m.satHouse!] })) };
  out.signs[t.key] = S;
}

writeFileSync(new URL("./sample-conditions.json", import.meta.url), JSON.stringify(out, null, 1));
console.log("OK — wrote sample-conditions.json");
for (const k of Object.keys(out.signs)) {
  const s = out.signs[k];
  console.log(`\n== ${k.toUpperCase()} ==`);
  console.log("daily:", JSON.stringify({ moonHouse: s.daily.moonHouse, health: s.daily.ratings.health, education: s.daily.ratings.education, career: s.daily.ratings.career, wealth: s.daily.ratings.wealth, attrib: s.daily.attrib.planet, do: s.daily.dosDonts.doHouse, dont: s.daily.dosDonts.dontHouse, panchang: s.daily.panchang }));
  console.log("weekly:", JSON.stringify({ ratings: s.weekly.ratings, sweep: s.weekly.moonSweepHouses }));
  console.log("monthly:", JSON.stringify({ health: s.monthly.ratings.health, education: s.monthly.ratings.education, best: s.monthly.bestDays?.[0], test: s.monthly.testingDay, sun: s.monthly.sunIngress, stations: s.monthly.stations, nm: s.monthly.newMoon, fm: s.monthly.fullMoon }));
  console.log("yearly trajectory:", JSON.stringify(s.yearly.trajectories));
  console.log("yearly months:", s.yearly.months.map((m: any) => `${m.month}:${m.tableRating}(${m.topPos}/${m.topNeg})`).join(" "));
  console.log("yearly areas:", JSON.stringify(s.yearly.ratings), "sade:", JSON.stringify(s.yearly.sadeMonths2027));
}
