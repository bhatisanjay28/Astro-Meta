/**
 * S16-1 unit tests — the pure DateField logic (frontend/src/scripts/date-time-core.ts),
 * run with bun from the meta repo. `today` is injected so every branch is deterministic:
 * fixed today = 2026-11-22 local midnight.
 */
import { describe, expect, test } from "bun:test";
import {
  checkDate,
  checkTime,
  composeDateTime,
  dateToParts,
  daysInMonth,
  MONTHS,
  normalizeSegment,
  pasteDate,
  splitDateTime,
  timeToParts,
  todayMidnight,
  yearRange,
} from "../../frontend/src/scripts/date-time-core";

const TODAY = new Date(2026, 10, 22); // 2026-11-22 local midnight

describe("normalizeSegment", () => {
  // day: min 1, max 31, pad threshold 3
  test("day two-digit in range advances", () => {
    expect(normalizeSegment("15", 31, "day")).toEqual({ value: "15", advance: true });
    expect(normalizeSegment("01", 31, "day")).toEqual({ value: "01", advance: true });
  });
  test("day first digit >3 zero-pads and advances (4 → 04)", () => {
    expect(normalizeSegment("4", 31, "day")).toEqual({ value: "04", advance: true });
    expect(normalizeSegment("9", 31, "day")).toEqual({ value: "09", advance: true });
  });
  test("day 3 waits for second digit (31 vs 3)", () => {
    expect(normalizeSegment("3", 31, "day")).toEqual({ value: "3", advance: false });
    expect(normalizeSegment("31", 31, "day")).toEqual({ value: "31", advance: true });
  });
  test("day 00 kept, no advance — validator messages it", () => {
    expect(normalizeSegment("00", 31, "day")).toEqual({ value: "00", advance: false });
    expect(normalizeSegment("32", 31, "day")).toEqual({ value: "32", advance: false });
  });
  // month: min 1, max 12, pad threshold 1
  test("month 2 → 02 pads and advances; 12 advances; 13 kept", () => {
    expect(normalizeSegment("2", 12, "month")).toEqual({ value: "02", advance: true });
    expect(normalizeSegment("12", 12, "month")).toEqual({ value: "12", advance: true });
    expect(normalizeSegment("13", 12, "month")).toEqual({ value: "13", advance: false });
    expect(normalizeSegment("1", 12, "month")).toEqual({ value: "1", advance: false });
  });
  // hour12: min 1, max 12, pad threshold 1
  test("hour12 5 → 05; 12 advances; 13 kept", () => {
    expect(normalizeSegment("5", 12, "hour12")).toEqual({ value: "05", advance: true });
    expect(normalizeSegment("12", 12, "hour12")).toEqual({ value: "12", advance: true });
    expect(normalizeSegment("13", 12, "hour12")).toEqual({ value: "13", advance: false });
  });
  // hour24: min 0, max 23, pad threshold 2
  test("hour24 3 → 03; 23 advances; 25 kept; 00 advances", () => {
    expect(normalizeSegment("3", 23, "hour24")).toEqual({ value: "03", advance: true });
    expect(normalizeSegment("23", 23, "hour24")).toEqual({ value: "23", advance: true });
    expect(normalizeSegment("25", 23, "hour24")).toEqual({ value: "25", advance: false });
    expect(normalizeSegment("00", 23, "hour24")).toEqual({ value: "00", advance: true });
    expect(normalizeSegment("2", 23, "hour24")).toEqual({ value: "2", advance: false });
  });
  // minute: min 0, max 59, pad threshold 5
  test("minute 6 → 06; 59 advances; 00 advances; 60 kept", () => {
    expect(normalizeSegment("6", 59, "minute")).toEqual({ value: "06", advance: true });
    expect(normalizeSegment("59", 59, "minute")).toEqual({ value: "59", advance: true });
    expect(normalizeSegment("00", 59, "minute")).toEqual({ value: "00", advance: true });
    expect(normalizeSegment("60", 59, "minute")).toEqual({ value: "60", advance: false });
    expect(normalizeSegment("5", 59, "minute")).toEqual({ value: "5", advance: false });
  });
  test("non-digits stripped, empty stays empty", () => {
    expect(normalizeSegment("a", 31, "day")).toEqual({ value: "", advance: false });
    expect(normalizeSegment("1a5", 31, "day")).toEqual({ value: "15", advance: true });
  });
});

describe("daysInMonth", () => {
  test("ordinary months", () => {
    expect(daysInMonth(2001, 1)).toBe(31);
    expect(daysInMonth(2001, 4)).toBe(30);
  });
  test("February leap rules (div 4, except div 100 unless div 400)", () => {
    expect(daysInMonth(2001, 2)).toBe(28);
    expect(daysInMonth(2004, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
  });
});

describe("checkDate", () => {
  const birth = (dd: string, mm: string, yyyy: string) =>
    checkDate({ dd, mm, yyyy }, "birth", TODAY);
  const free = (dd: string, mm: string, yyyy: string) =>
    checkDate({ dd, mm, yyyy }, "free", TODAY);

  test("incomplete → silent (empty message), empty iso", () => {
    expect(birth("1", "08", "1990")).toMatchObject({ ok: false, code: "incomplete", message: "", iso: "" });
    expect(birth("15", "08", "199")).toMatchObject({ ok: false, code: "incomplete" });
    expect(birth("", "", "")).toMatchObject({ ok: false, code: "incomplete" });
  });
  test("valid → ISO yyyy-mm-dd", () => {
    expect(birth("15", "08", "1990")).toEqual({ ok: true, code: "valid", message: "", iso: "1990-08-15" });
  });
  test("impossible: day beyond month length, named message", () => {
    expect(birth("31", "02", "2001")).toMatchObject({
      ok: false,
      code: "impossible",
      message: "31 February 2001 doesn't exist — February 2001 has 28 days.",
    });
    expect(birth("30", "02", "2000")).toMatchObject({
      ok: false,
      code: "impossible",
      message: "30 February 2000 doesn't exist — February 2000 has 29 days.",
    });
    expect(birth("31", "04", "1990")).toMatchObject({
      ok: false,
      code: "impossible",
      message: "31 April 1990 doesn't exist — April 1990 has 30 days.",
    });
    expect(birth("31", "12", "2025")).toMatchObject({ ok: true, code: "valid" });
  });
  test("impossible: month/day out of 1–12 / 1–31 ranges", () => {
    expect(birth("15", "00", "1990")).toMatchObject({ ok: false, code: "impossible", message: "Month must be 1–12." });
    expect(birth("15", "13", "1990")).toMatchObject({ ok: false, code: "impossible", message: "Month must be 1–12." });
    expect(birth("00", "08", "1990")).toMatchObject({ ok: false, code: "impossible", message: "Day must be 1–31." });
  });
  test("future rejected in birth mode (day after today, or year beyond)", () => {
    expect(birth("23", "11", "2026")).toMatchObject({
      ok: false, code: "future", message: "The birth date can't be in the future.",
    });
    expect(birth("01", "01", "2027")).toMatchObject({ ok: false, code: "future" });
    expect(birth("01", "01", "2100")).toMatchObject({ ok: false, code: "future" });
    expect(birth("22", "11", "2026")).toMatchObject({ ok: true, code: "valid" }); // today itself is fine
  });
  test("100-year window in birth mode", () => {
    expect(birth("01", "01", "1926")).toMatchObject({ ok: true, code: "valid" }); // first valid year
    expect(birth("31", "12", "1925")).toMatchObject({
      ok: false,
      code: "too-old",
      message: "Please enter a year within the last 100 years (1926–2026).",
    });
    expect(birth("01", "01", "1800")).toMatchObject({ ok: false, code: "too-old" });
  });
  test("free mode: past AND future valid, no century window", () => {
    expect(free("01", "01", "2100")).toMatchObject({ ok: true, code: "valid" });
    expect(free("01", "01", "1900")).toMatchObject({ ok: true, code: "valid" });
    expect(free("23", "11", "2026")).toMatchObject({ ok: true, code: "valid" });
    expect(free("31", "02", "2001")).toMatchObject({ ok: false, code: "impossible" });
    expect(free("15", "08", "1990")).toMatchObject({ ok: true, iso: "1990-08-15" });
  });
});

describe("yearRange", () => {
  test("birth: newest first, current year back 100", () => {
    const r = yearRange("birth", TODAY);
    expect(r.max).toBe(2026);
    expect(r.min).toBe(1926);
    expect(r.years[0]).toBe(2026); // newest first
    expect(r.years[1]).toBe(2025);
    expect(r.years[r.years.length - 1]).toBe(1926);
    expect(r.years.length).toBe(101);
  });
  test("free: 2100 down to 1900", () => {
    const r = yearRange("free", TODAY);
    expect(r.min).toBe(1900);
    expect(r.max).toBe(2100);
    expect(r.years[0]).toBe(2100);
    expect(r.years[r.years.length - 1]).toBe(1900);
    expect(r.years.length).toBe(201);
  });
});

describe("checkTime", () => {
  test("12-hour conversions", () => {
    expect(checkTime({ hh: "09", mm: "30", ampm: "am" }, true)).toEqual({ ok: true, code: "valid", message: "", value: "09:30" });
    expect(checkTime({ hh: "07", mm: "15", ampm: "pm" }, true)).toEqual({ ok: true, code: "valid", message: "", value: "19:15" });
    expect(checkTime({ hh: "12", mm: "00", ampm: "am" }, true)).toEqual({ ok: true, code: "valid", value: "00:00", message: "" }); // midnight
    expect(checkTime({ hh: "12", mm: "05", ampm: "pm" }, true)).toEqual({ ok: true, code: "valid", value: "12:05", message: "" }); // noon
    expect(checkTime({ hh: "11", mm: "59", ampm: "pm" }, true)).toEqual({ ok: true, value: "23:59", code: "valid", message: "" });
  });
  test("12-hour bounds", () => {
    expect(checkTime({ hh: "00", mm: "30", ampm: "" }, true)).toMatchObject({ ok: false, code: "hour", message: "Hour must be 1–12." });
    expect(checkTime({ hh: "13", mm: "00", ampm: "pm" }, true)).toMatchObject({ ok: false, code: "hour", message: "Hour must be 1–12." });
  });
  test("24-hour bounds", () => {
    expect(checkTime({ hh: "00", mm: "30", ampm: "" }, false)).toEqual({ ok: true, code: "valid", message: "", value: "00:30" });
    expect(checkTime({ hh: "23", mm: "59", ampm: "" }, false)).toEqual({ ok: true, code: "valid", message: "", value: "23:59" });
    expect(checkTime({ hh: "24", mm: "00", ampm: "" }, false)).toMatchObject({ ok: false, code: "hour", message: "Hour must be 0–23." });
  });
  test("minutes bounds", () => {
    expect(checkTime({ hh: "10", mm: "60", ampm: "" }, false)).toMatchObject({ ok: false, code: "minute", message: "Minutes must be 00–59." });
    expect(checkTime({ hh: "10", mm: "00", ampm: "" }, false)).toMatchObject({ ok: true, value: "10:00" });
  });
  test("incomplete stays silent", () => {
    expect(checkTime({ hh: "9", mm: "", ampm: "" }, true)).toMatchObject({ ok: false, code: "incomplete", message: "", value: "" });
    expect(checkTime({ hh: "", mm: "", ampm: "" }, true)).toMatchObject({ ok: false, code: "incomplete" });
  });
});

describe("timeToParts", () => {
  test("12-hour display", () => {
    expect(timeToParts("00:30", true)).toEqual({ hh: "12", mm: "30", ampm: "am" });
    expect(timeToParts("12:00", true)).toEqual({ hh: "12", mm: "00", ampm: "pm" });
    expect(timeToParts("19:15", true)).toEqual({ hh: "07", mm: "15", ampm: "pm" });
    expect(timeToParts("09:05", true)).toEqual({ hh: "09", mm: "05", ampm: "am" });
  });
  test("24-hour display", () => {
    expect(timeToParts("19:15", false)).toEqual({ hh: "19", mm: "15", ampm: "" });
    expect(timeToParts("00:00", false)).toEqual({ hh: "00", mm: "00", ampm: "" });
  });
  test("time half of a datetime-local value (as the picker passes it); garbage → empty", () => {
    expect(timeToParts(splitDateTime("2026-01-05T14:30").time, true)).toEqual({ hh: "02", mm: "30", ampm: "pm" });
    expect(timeToParts("", true)).toEqual({ hh: "", mm: "", ampm: "" });
    expect(timeToParts("not-a-time", false)).toEqual({ hh: "", mm: "", ampm: "" });
  });
});

describe("dateToParts", () => {
  test("ISO → display segments", () => {
    expect(dateToParts("1990-08-15")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(dateToParts("2026-11-22T10:00")).toEqual({ dd: "22", mm: "11", yyyy: "2026" });
  });
  test("garbage → empty segments", () => {
    expect(dateToParts("")).toEqual({ dd: "", mm: "", yyyy: "" });
    expect(dateToParts("08/15/1990")).toEqual({ dd: "", mm: "", yyyy: "" });
  });
});

describe("pasteDate", () => {
  test("accepts the documented formats (DD MM YYYY digit order)", () => {
    expect(pasteDate("15/08/1990")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(pasteDate("15-08-1990")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(pasteDate("15081990")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(pasteDate("1508 1990")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(pasteDate("15.08.1990")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
  });
  test("truncates to 8 digits; empty on no digits", () => {
    expect(pasteDate("150819901234")).toEqual({ dd: "15", mm: "08", yyyy: "1990" });
    expect(pasteDate("born on a Monday")).toEqual({ dd: "", mm: "", yyyy: "" });
  });
});

describe("composeDateTime / splitDateTime", () => {
  test("compose datetime-local contract", () => {
    expect(composeDateTime("2026-01-05", "14:30")).toBe("2026-01-05T14:30");
    expect(composeDateTime("2026-01-05", "")).toBe("");
    expect(composeDateTime("", "14:30")).toBe("");
  });
  test("split datetime-local", () => {
    expect(splitDateTime("2026-01-05T14:30")).toEqual({ date: "2026-01-05", time: "14:30" });
    expect(splitDateTime("2026-01-05")).toEqual({ date: "2026-01-05", time: "" });
    expect(splitDateTime("")).toEqual({ date: "", time: "" });
    expect(splitDateTime("garbage")).toEqual({ date: "", time: "" });
  });
  test("compose ∘ split round-trips", () => {
    const v = "2026-06-15T08:45";
    const s = splitDateTime(v);
    expect(composeDateTime(s.date, s.time)).toBe(v);
  });
});

describe("todayMidnight / MONTHS", () => {
  test("strips the clock", () => {
    const t = todayMidnight(new Date(2026, 10, 22, 15, 42, 9, 500));
    expect(t.getFullYear()).toBe(2026);
    expect(t.getMonth()).toBe(10);
    expect(t.getDate()).toBe(22);
    expect(t.getHours()).toBe(0);
    expect(t.getMinutes()).toBe(0);
    expect(t.getSeconds()).toBe(0);
  });
  test("MONTHS names align with checkDate messages", () => {
    expect(MONTHS[1]).toBe("February");
    expect(MONTHS.length).toBe(12);
  });
});
