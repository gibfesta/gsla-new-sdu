"use client";
import { type FacilitySchedule } from "@/lib/facilitySchedule";
const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";
export default function FacilityScheduleEditor({ value, onChange }: { value: FacilitySchedule; onChange: (value: FacilitySchedule) => void }) {
  return <section className="lg:col-span-2 border-t border-slate-200 pt-5">
    <h2 className="text-lg font-bold text-[#0C2F57]">Opening days & times</h2>
    <p className="mt-1 text-sm text-slate-500">Set normal weekly hours in Gibraltar local time. Leave unconfirmed days as Not set. Times must open and close on the same day.</p>
    <div className="mt-4 space-y-3">{value.weekly.map((row, index) => <div key={row.day} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-4">
      <span className="self-center font-semibold text-[#0C2F57]">{row.day}</span>
      <label className="text-xs font-semibold text-slate-600">{row.day} availability<select className={inputClass} value={row.status} onChange={e => onChange({ ...value, weekly: value.weekly.map((item, i) => i === index ? { ...item, status: e.target.value as typeof row.status } : item) })}>
        <option value="unset">Not set</option><option value="open">Open</option><option value="closed">Closed</option>
      </select></label>
      <label className="text-xs font-semibold text-slate-600">{row.day} opens<input className={inputClass} type="time" disabled={row.status !== "open"} value={row.opens} onChange={e => onChange({ ...value, weekly: value.weekly.map((item, i) => i === index ? { ...item, opens: e.target.value } : item) })} /></label>
      <label className="text-xs font-semibold text-slate-600">{row.day} closes<input className={inputClass} type="time" disabled={row.status !== "open"} value={row.closes} onChange={e => onChange({ ...value, weekly: value.weekly.map((item, i) => i === index ? { ...item, closes: e.target.value } : item) })} /></label>
    </div>)}</div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold text-[#0C2F57]">Holiday & temporary closures</h3><button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={() => onChange({ ...value, closures: [...value.closures, { start: "", end: "", reason: "" }] })}>Add closure</button></div>
    <p className="mt-1 text-sm text-slate-500">Close the venue for specific dates, such as the festive period. Both dates are included; normal weekly hours resume afterwards.</p>
    {!value.closures.length && <p className="mt-3 text-sm text-slate-500">No temporary closures added.</p>}
    {value.closures.map((row, index) => <div key={index} className="mt-3 grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
      <label className="text-xs font-semibold text-slate-600">Closure {index + 1} start date<input type="date" className={inputClass} value={row.start} onChange={e => onChange({ ...value, closures: value.closures.map((item, i) => i === index ? { ...item, start: e.target.value } : item) })} /></label>
      <label className="text-xs font-semibold text-slate-600">Closure {index + 1} end date<input type="date" className={inputClass} min={row.start || undefined} value={row.end} onChange={e => onChange({ ...value, closures: value.closures.map((item, i) => i === index ? { ...item, end: e.target.value } : item) })} /></label>
      <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Closure {index + 1} reason<input className={inputClass} placeholder="e.g. Festive period" maxLength={500} value={row.reason} onChange={e => onChange({ ...value, closures: value.closures.map((item, i) => i === index ? { ...item, reason: e.target.value } : item) })} /></label>
      <button type="button" className="justify-self-start text-sm font-semibold text-rose-700" onClick={() => onChange({ ...value, closures: value.closures.filter((_, i) => i !== index) })}>Remove closure {index + 1}</button>
    </div>)}
  </section>;
}
