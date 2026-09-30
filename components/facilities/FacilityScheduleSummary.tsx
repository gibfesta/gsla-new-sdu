"use client";
import { hoursForDate, parseFacilitySchedule } from "@/lib/facilitySchedule";
export default function FacilityScheduleSummary({ value }: { value: unknown }) {
  let schedule;
  try { schedule = parseFacilitySchedule(value); } catch { return <p role="alert">Opening hours could not be read. Edit the facility to review them.</p>; }
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Gibraltar", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find(item => item.type === type)?.value;
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const today = hoursForDate(schedule, date);
  return <section className="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="text-lg font-bold text-[#0C2F57]">Opening days & times</h2>
    <p className="mt-2 text-sm font-semibold">Today: {today.status === "closed" ? `Closed${today.reason ? " — " + today.reason : ""}` : today.status === "open" ? `${today.opens}–${today.closes}` : "Hours not set"}</p>
    <p className="mt-1 text-xs text-slate-500">Gibraltar local time. Holiday closures override weekly hours.</p>
    <dl className="mt-4 space-y-2">{schedule.weekly.map(row => <div key={row.day} className="flex justify-between gap-4 text-sm"><dt className="font-semibold">{row.day}</dt><dd>{row.status === "open" ? `${row.opens}–${row.closes}` : row.status === "closed" ? "Closed" : "Not set"}</dd></div>)}</dl>
    <h3 className="mt-5 font-semibold">Holiday & temporary closures</h3>
    {schedule.closures.length ? <ul className="mt-2 space-y-2">{schedule.closures.map((row, i) => <li key={i} className="text-sm">{row.start} to {row.end} (inclusive) — {row.reason}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">No temporary closures.</p>}
  </section>;
}
