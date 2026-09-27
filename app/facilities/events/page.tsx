import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Clock3, Info } from "lucide-react";
import { facilitiesVenues } from "@/components/facilities/venues";

const exampleEvents = [
  { id: "evt-101", name: "Friday Night Stand-Up Showcase", date: "16 Jan 2026", status: "Submitted", venue: "Europa Sports Complex" },
  { id: "evt-102", name: "Community Winter Concert", date: "24 Jan 2026", status: "Approved", venue: "Europa Sports Complex" },
  { id: "evt-103", name: "Local Makers Market", date: "1 Feb 2026", status: "Draft", venue: "Europa Sports Complex" },
  { id: "evt-104", name: "Cultural Evening: Dance & Food", date: "6 Dec 2025", status: "Completed", venue: "Europa Sports Complex" },
] as const;

export default function FacilitiesEventsPage() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Events</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">Review venue events and their operational impact across the Facilities Department.</p>
          </div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">All venues<br />One view</p>
        </div>
      </section>

      <section aria-label="Event overview" className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Building2 size={25} aria-hidden="true" /></span><div><p className="text-2xl font-bold">{facilitiesVenues.length}</p><p className="text-sm text-[#60799f]">Venues in directory</p></div></div>
        <div className="flex items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><CalendarDays size={25} aria-hidden="true" /></span><div><p className="text-2xl font-bold">—</p><p className="text-sm text-[#60799f]">Live events not connected</p></div></div>
        <Link href="/facilities/shared-calendar" className="flex items-center justify-between gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 font-semibold text-[#155ca7] shadow-sm hover:bg-blue-50"><span className="flex items-center gap-3"><CalendarDays size={25} aria-hidden="true" />Open Shared Calendar</span><ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-events-heading">
        <h2 id="venue-events-heading" className="text-xl font-bold">Events by venue</h2>
        <p className="mt-1 text-sm text-[#60799f]">Open a venue&apos;s Events workspace for its activities and records.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {facilitiesVenues.map((venue) => (
            <Link key={venue.id} href={`/facilities/facilities/${venue.id}?tab=events`} className="flex items-center justify-between gap-3 rounded-xl border border-[#d5e4f6] p-4 hover:bg-[#f5f9ff]">
              <span className="flex items-center gap-3"><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Building2 size={19} aria-hidden="true" /></span><span><strong className="block text-sm">{venue.name}</strong><span className="text-xs text-[#60799f]">{venue.type}</span></span></span>
              <ArrowRight size={16} className="shrink-0 text-[#155ca7]" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="example-events-heading">
        <div className="flex items-start gap-3"><Info size={20} className="mt-0.5 shrink-0 text-[#155ca7]" aria-hidden="true" /><div><h2 id="example-events-heading" className="text-xl font-bold">Example community event records</h2><p className="mt-1 text-sm text-[#60799f]">These are the existing demonstration records from 2025–26. They are not a live schedule.</p></div></div>
        <div className="mt-5 divide-y divide-[#e5edf8]">
          {exampleEvents.map((event) => (
            <Link key={event.id} href={`/facilities/events/${event.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-[#f8fbff]">
              <span><strong className="block text-sm">{event.name}</strong><span className="text-xs text-[#60799f]">{event.venue} · {event.date}</span></span>
              <span className="flex items-center gap-3 text-xs font-semibold text-[#155ca7]"><span className="rounded-lg bg-[#eef5fd] px-2 py-1 text-[#35557f]">{event.status}</span>View record <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
      <p className="flex items-start gap-2 text-xs text-[#60799f]"><Clock3 size={15} className="shrink-0" aria-hidden="true" />Live event totals and venue-wide management will appear when the event data is connected.</p>
    </div>
  );
}
