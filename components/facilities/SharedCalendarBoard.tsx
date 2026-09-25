"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2, CalendarDays, ChevronLeft, ChevronRight, Clock3, Info,
  Search, TriangleAlert, UsersRound,
} from "lucide-react";
import { facilitiesVenues } from "./venues";

type SessionType = "Sport & Training" | "Community" | "Education" | "Competition" | "Maintenance";
type SampleSession = { venueId: string; slot: number; title: string; type: SessionType; participants?: number; clash?: boolean };
const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
const sampleSessions: SampleSession[] = [
  { venueId: "fac-001", slot: 0, title: "Junior Football Training", type: "Sport & Training", participants: 24 },
  { venueId: "fac-001", slot: 1, title: "Adult Football League", type: "Competition", participants: 22 },
  { venueId: "fac-001", slot: 3, title: "Youth Football", type: "Sport & Training", participants: 20 },
  { venueId: "fac-001", slot: 4, title: "5-a-side League", type: "Community", participants: 20 },
  { venueId: "fac-002", slot: 0, title: "Badminton Club", type: "Community", participants: 12 },
  { venueId: "fac-002", slot: 1, title: "Swimming Lessons", type: "Sport & Training", participants: 28 },
  { venueId: "fac-002", slot: 2, title: "Table Tennis Club", type: "Community", participants: 10 },
  { venueId: "fac-002", slot: 3, title: "Netball Tournament", type: "Competition", participants: 32 },
  { venueId: "fac-003", slot: 0, title: "Grounds Maintenance", type: "Maintenance" },
  { venueId: "fac-003", slot: 1, title: "Athletics Training", type: "Sport & Training", participants: 18 },
  { venueId: "fac-003", slot: 3, title: "Football Training", type: "Sport & Training", participants: 24 },
  { venueId: "fac-004", slot: 0, title: "Pool Maintenance", type: "Maintenance" },
  { venueId: "fac-004", slot: 1, title: "Swim Lessons", type: "Sport & Training", participants: 18, clash: true },
  { venueId: "fac-004", slot: 2, title: "Public Swim", type: "Community", participants: 40 },
  { venueId: "fac-004", slot: 3, title: "Aqua Fitness", type: "Community", participants: 18 },
  { venueId: "fac-005", slot: 0, title: "Indoor Training", type: "Sport & Training", participants: 16 },
  { venueId: "fac-005", slot: 1, title: "School Swim", type: "Education", participants: 30 },
  { venueId: "fac-005", slot: 2, title: "Pool Booking", type: "Competition", participants: 24, clash: true },
  { venueId: "fac-005", slot: 4, title: "Volleyball Club", type: "Community", participants: 18 },
  { venueId: "fac-006", slot: 0, title: "Park Run Setup", type: "Community", participants: 6 },
  { venueId: "fac-006", slot: 1, title: "Community Gardening", type: "Community", participants: 12 },
  { venueId: "fac-006", slot: 3, title: "School Orienteering", type: "Education", participants: 28 },
];
const tones: Record<SessionType, string> = {
  "Sport & Training": "border-blue-200 bg-blue-50 text-blue-950",
  Community: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Education: "border-amber-200 bg-amber-50 text-amber-950",
  Competition: "border-violet-200 bg-violet-50 text-violet-950",
  Maintenance: "border-rose-200 bg-rose-50 text-rose-950",
};

function changeDay(date: string, difference: number) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + difference);
  return next.toISOString().slice(0, 10);
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function Stat({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof CalendarDays }) {
  return <div className="flex min-h-24 items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm"><span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#155ca7]"><Icon size={26} aria-hidden="true" /></span><div><p className="text-2xl font-bold text-[#102b59]">{value}</p><p className="text-sm font-semibold text-[#203b65]">{label}</p><p className="text-xs text-[#637da2]">{detail}</p></div></div>;
}

export default function SharedCalendarBoard({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate);
  const [example, setExample] = useState(false);
  const [venue, setVenue] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const visibleVenues = facilitiesVenues.filter((item) => venue === "all" || item.id === venue);
  const sessions = useMemo(() => example ? sampleSessions.filter((item) =>
    (venue === "all" || item.venueId === venue) && (type === "all" || item.type === type) &&
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  ) : [], [example, venue, type, query]);
  const clashes = sessions.filter((item) => item.clash);

  function navigateTo(next: string) { setDate(next); setExample(false); }

  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-7 text-white shadow-sm sm:px-9">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities</p><div className="mt-2 flex flex-wrap items-center gap-4"><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Shared Calendar</h1><span className="rounded-lg border border-blue-300/70 bg-white/10 px-4 py-2 text-sm">Facilities Manager View</span></div><p className="mt-3 max-w-3xl text-base leading-6 text-blue-50">See what is happening across venues, manage resources and spot scheduling clashes.</p></div><p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">One timetable<br />Stronger communities</p></div>
      </section>

      <div className="rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mr-2 inline text-[#155ca7]" aria-hidden="true" />The venue list is a directory demo. Calendar events are not connected. {example ? <strong>You are viewing illustrative sample sessions and clash markers.</strong> : <span>Use “Preview example day” to see how a populated operations board will look.</span>}</div>

      <section aria-label="Shared calendar summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Clashes detected" value={example ? String(clashes.length) : "—"} detail={example ? "Illustrative examples" : "Live checks not connected"} icon={TriangleAlert} />
        <Stat label="Venues in directory" value={String(facilitiesVenues.length)} detail="Demonstration locations" icon={Building2} />
        <Stat label="Events on board" value={example ? String(sessions.length) : "—"} detail={example ? "Illustrative examples" : "Live events not connected"} icon={CalendarDays} />
        <Stat label="Parallel at 10:00" value={example ? String(sessions.filter((item) => item.slot === 1).length) : "—"} detail={example ? "Illustrative examples" : "Live events not connected"} icon={UsersRound} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(255px,1fr)]">
        <section className="min-w-0 rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5" aria-labelledby="board-heading">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="board-heading" className="text-xl font-bold">Operations Board — {example ? "Example Day" : "Today"}</h2><p className="mt-1 text-sm text-[#60799f]">{formatDay(date)}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => navigateTo(changeDay(date, -1))} aria-label="Previous day" className="rounded-lg border border-[#cfdff2] p-2 text-[#155ca7] hover:bg-blue-50"><ChevronLeft size={18} /></button><button type="button" onClick={() => navigateTo(initialDate)} className="rounded-lg border border-[#cfdff2] px-3 py-2 text-sm font-semibold text-[#155ca7] hover:bg-blue-50">Today</button><button type="button" onClick={() => navigateTo(changeDay(date, 1))} aria-label="Next day" className="rounded-lg border border-[#cfdff2] p-2 text-[#155ca7] hover:bg-blue-50"><ChevronRight size={18} /></button></div></div>
          <div className="mt-4 flex flex-wrap gap-2"><label className="sr-only" htmlFor="calendar-type">Event type</label><select id="calendar-type" value={type} onChange={(event) => setType(event.target.value)} className="min-h-10 rounded-lg border border-[#cfdff2] bg-white px-3 text-sm text-[#16365f]"><option value="all">All Event Types</option>{Object.keys(tones).map((name) => <option key={name}>{name}</option>)}</select><label className="sr-only" htmlFor="calendar-venue">Venue</label><select id="calendar-venue" value={venue} onChange={(event) => setVenue(event.target.value)} className="min-h-10 max-w-56 rounded-lg border border-[#cfdff2] bg-white px-3 text-sm text-[#16365f]"><option value="all">All Venues</option>{facilitiesVenues.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><label className="flex min-h-10 items-center gap-2 rounded-lg border border-[#cfdff2] px-3"><Search size={17} aria-hidden="true" /><span className="sr-only">Search board</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sessions" className="w-32 bg-transparent text-sm outline-none" /></label><button type="button" onClick={() => setExample((value) => !value)} className="min-h-10 rounded-lg bg-[#155ca7] px-3 text-sm font-semibold text-white hover:bg-[#104d90]">{example ? "Hide example day" : "Preview example day"}</button></div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#dbe6f4]"><table className="w-full min-w-[750px] table-fixed border-collapse text-left text-xs"><thead><tr className="bg-[#f4f8fe]"><th scope="col" className="w-16 border-b border-r border-[#dbe6f4] p-2 text-[#35557f]">Time</th>{visibleVenues.map((item) => <th key={item.id} scope="col" className="border-b border-r border-[#dbe6f4] px-2 py-3 text-center text-[#16365f]"><Building2 size={22} className="mx-auto mb-1 text-[#155ca7]" aria-hidden="true" /><span className="block leading-4">{item.name}</span></th>)}</tr></thead><tbody>{timeSlots.map((time, slot) => <tr key={time}><th scope="row" className="border-b border-r border-[#dbe6f4] px-2 text-[#35557f]">{time}</th>{visibleVenues.map((item) => { const session = sessions.find((event) => event.venueId === item.id && event.slot === slot); return <td key={item.id} className="h-22 border-b border-r border-[#dbe6f4] p-1 align-top">{session ? <div className={`h-full min-h-19 rounded-lg border p-2 ${session.clash ? "border-rose-400 bg-rose-50 text-rose-950" : tones[session.type]}`}><span className="block text-[11px]">{time} – {slot === 5 ? "20:00" : timeSlots[slot + 1]}</span><strong className="mt-1 block leading-4">{session.title}</strong><span className="mt-1 flex items-center gap-1 text-[11px]">{session.clash ? <TriangleAlert size={12} aria-label="Example clash" /> : session.participants ? <UsersRound size={12} aria-hidden="true" /> : null}{session.clash ? "Example clash" : session.participants ? session.participants : session.type}</span></div> : <span className="block h-full rounded-lg bg-[#f8fbff]" aria-label="No connected event" />}</td>; })}</tr>)}</tbody></table></div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#526f98]">{Object.entries(tones).map(([name, tone]) => <span key={name} className="inline-flex items-center gap-1"><span className={`h-3 w-3 rounded-full border ${tone}`} />{name}</span>)}</div>
        </section>

        <aside className="space-y-3" aria-label="Calendar alerts and activity">
          <section className="rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm"><h2 className="text-lg font-bold">Clash Alerts</h2>{example && clashes.length ? <div className="mt-3 space-y-2">{clashes.map((item) => <div key={item.venueId} className="rounded-lg bg-rose-50 p-3 text-xs text-rose-900"><TriangleAlert size={16} className="mb-1" aria-hidden="true" /><strong className="block">{timeSlots[item.slot]} — {facilitiesVenues.find((venue) => venue.id === item.venueId)?.name}</strong>{item.title} · illustrative conflict</div>)}</div> : <p className="mt-3 text-sm leading-6 text-[#637da2]">Clash detection will appear when cross-venue events and maintenance are connected.</p>}</section>
          <section className="rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm"><h2 className="text-lg font-bold">{example ? "Example Sessions" : "Live Now"}</h2>{example ? <div className="mt-3 divide-y divide-[#e5edf8]">{sessions.slice(0, 4).map((item) => <p key={`${item.venueId}-${item.slot}`} className="py-2 text-xs"><span className="block text-[#60799f]">{timeSlots[item.slot]}</span><strong>{item.title}</strong><span className="block text-[#60799f]">{facilitiesVenues.find((venue) => venue.id === item.venueId)?.name}</span></p>)}</div> : <p className="mt-3 text-sm leading-6 text-[#637da2]">Live activity is not connected.</p>}</section>
          <section className="rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm"><h2 className="text-lg font-bold">Upcoming Next</h2><p className="mt-3 text-sm leading-6 text-[#637da2]">Upcoming activity will appear here when the shared schedule is connected.</p><Link href="/facilities/facilities" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline"><Clock3 size={16} aria-hidden="true" />View venue directory</Link></section>
        </aside>
      </div>
    </div>
  );
}
