export const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type DayHours = { day: typeof WEEK_DAYS[number]; status: "unset" | "open" | "closed"; opens: string; closes: string };
export type VenueClosure = { start: string; end: string; reason: string };
export type FacilitySchedule = { weekly: DayHours[]; closures: VenueClosure[] };
export function emptyFacilitySchedule(): FacilitySchedule {
  return { weekly: WEEK_DAYS.map(day => ({ day, status: "unset", opens: "", closes: "" })), closures: [] };
}
function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function parseFacilitySchedule(value: unknown): FacilitySchedule {
  if (value === undefined || value === null) return emptyFacilitySchedule();
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid opening schedule.");
  const input = value as Record<string, unknown>;
  if (!Array.isArray(input.weekly) || input.weekly.length !== 7 || !Array.isArray(input.closures) || input.closures.length > 100) throw new Error("Provide seven weekdays and no more than 100 closures.");
  const weekly = input.weekly.map((item: unknown, index: number): DayHours => {
    if (!item || typeof item !== "object") throw new Error("Invalid weekday hours.");
    const row = item as Record<string, unknown>;
    if (row.day !== WEEK_DAYS[index] || !["unset", "open", "closed"].includes(String(row.status))) throw new Error("Invalid weekday hours.");
    if (row.status === "open") {
      if (typeof row.opens !== "string" || typeof row.closes !== "string" ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(row.opens) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(row.closes) || row.closes <= row.opens) {
        throw new Error(`${row.day}: closing time must be after opening time on the same day.`);
      }
    }
    return { day: WEEK_DAYS[index], status: row.status as DayHours["status"], opens: row.status === "open" ? String(row.opens) : "", closes: row.status === "open" ? String(row.closes) : "" };
  });
  const closures = input.closures.map((item: unknown): VenueClosure => {
    if (!item || typeof item !== "object") throw new Error("Invalid closure.");
    const row = item as Record<string, unknown>;
    if (typeof row.start !== "string" || typeof row.end !== "string" || !validDate(row.start) || !validDate(row.end) || row.end < row.start) throw new Error("Each closure needs valid start and end dates, with the end on or after the start.");
    if (typeof row.reason !== "string" || !row.reason.trim() || row.reason.length > 500) throw new Error("Give each closure a reason (up to 500 characters).");
    return { start: row.start, end: row.end, reason: row.reason.trim() };
  });
  return { weekly, closures };
}
// Dates are calendar dates in Gibraltar, not UTC instants. Closure end dates are inclusive.
export function hoursForDate(schedule: FacilitySchedule, date: string) {
  if (!validDate(date)) throw new Error("Invalid date.");
  const closure = schedule.closures.find(item => item.start <= date && item.end >= date);
  if (closure) return { status: "closed" as const, reason: closure.reason, opens: "", closes: "" };
  const index = (new Date(date + "T12:00:00Z").getUTCDay() + 6) % 7;
  return { ...schedule.weekly[index], reason: "" };
}
