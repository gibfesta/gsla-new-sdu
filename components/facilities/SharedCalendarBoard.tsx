"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";
import { useSavedFacilities } from "./useSavedFacilities";

function changeDay(date: string, difference: number) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + difference);
  return next.toISOString().slice(0, 10);
}

export default function SharedCalendarBoard({ initialDate }: { initialDate: string }) {
  const { facilities, loading, error } = useSavedFacilities();
  const [date, setDate] = useState(initialDate);
  const [venue, setVenue] = useState("all");
  const visible = facilities.filter((item) => venue === "all" || item.id === venue);
  const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  return <div className="space-y-4 text-[#112d56]">
    <FacilitiesDepartmentBanner title="Shared Calendar" description="See venue activity and scheduling across facilities." />
    <p className="rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm">Shared calendar entries and clash checks are not connected yet. No bookings or sessions are shown until they have saved records.</p>
    {loading && <p role="status">Loading facilities...</p>}
    {error && <p role="alert" className="text-rose-700">{error}</p>}
    {!loading && !error && !facilities.length && <p className="rounded-xl bg-white p-4 text-sm">No facilities have been saved yet. <Link href="/facilities/facilities-directory/new" className="font-semibold text-[#155ca7]">Create a facility</Link> to begin.</p>}
    <section className="rounded-xl border border-[#d5e4f6] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Operations Board</h2><p className="text-sm text-[#60799f]">{date}</p></div><div className="flex items-center gap-2"><button onClick={() => setDate(changeDay(date, -1))} aria-label="Previous day" className="rounded-lg border p-2"><ChevronLeft size={18} /></button><button onClick={() => setDate(initialDate)} className="rounded-lg border px-3 py-2 text-sm">Today</button><button onClick={() => setDate(changeDay(date, 1))} aria-label="Next day" className="rounded-lg border p-2"><ChevronRight size={18} /></button></div></div>
      <label className="mt-5 block text-sm">Venue <select value={venue} onChange={(event) => setVenue(event.target.value)} className="ml-2 rounded-lg border p-2"><option value="all">All venues</option>{facilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[500px] border-collapse text-xs"><thead><tr><th className="border p-3">Time</th>{visible.map((item) => <th className="border p-3" key={item.id}>{item.name}</th>)}</tr></thead><tbody>{slots.map((slot) => <tr key={slot}><th className="border p-3">{slot}</th>{visible.map((item) => <td key={item.id} className="h-16 border bg-slate-50" aria-label="No connected calendar entry" />)}</tr>)}</tbody></table></div>
    </section>
    <p className="flex items-center gap-2 text-sm text-[#60799f]"><CalendarDays size={17} />Calendar events will appear when scheduling is connected.</p>
  </div>;
}
