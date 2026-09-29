"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Building2, CalendarDays, ClipboardList,
  Clock3, Info, Plus, Search, ShieldCheck, TriangleAlert,
} from "lucide-react";
import { eventExamples } from "@/components/facilities/eventExamples";
import { facilitiesVenues } from "@/components/facilities/venues";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

type StatusFilter = "All statuses" | (typeof eventExamples)[number]["status"];

const workstreams = [
  { title: "Requests & approvals", detail: "Review event plans, documents and decisions in the department event record.", icon: ClipboardList },
  { title: "Venue impact", detail: "Check the space, preparation window, access and operational requirements.", icon: Building2 },
  { title: "Schedule & clashes", detail: "Coordinate the timetable and check other activity across all venues.", icon: CalendarDays },
];

const statusStyle: Record<(typeof eventExamples)[number]["status"], string> = {
  Draft: "bg-slate-100 text-slate-700",
  Submitted: "bg-amber-50 text-amber-800",
  Approved: "bg-emerald-50 text-emerald-800",
  Completed: "bg-blue-50 text-blue-800",
};

export default function FacilitiesEventsPage() {
  const [query, setQuery] = useState("");
  const [venueId, setVenueId] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("All statuses");
  const filtered = eventExamples.filter((event) => {
    const text = `${event.name} ${event.organiser} ${event.venue} ${event.category}`.toLowerCase();
    return text.includes(query.trim().toLowerCase())
      && (venueId === "all" || event.venueId === venueId)
      && (status === "All statuses" || event.status === status);
  });
  const reviewCount = eventExamples.filter((event) => event.status === "Submitted" || event.status === "Draft").length;

  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Events Control" description="The central place to review and coordinate events across every venue. Venue teams handle the on-site delivery of events assigned to them." />

      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><p><strong>Demonstration workspace.</strong> The records below are historical examples from 2025–26, not a live event schedule. Event creation, approvals and changes are not connected yet; no action here changes an event or grants permission.</p></div>

      <section aria-label="Department event control" className="grid gap-3 md:grid-cols-3">
        {workstreams.map(({ title, detail, icon: Icon }) => <div key={title} className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#155ca7]"><Icon size={22} aria-hidden="true" /></span><h2 className="mt-3 font-bold">{title}</h2><p className="mt-1 text-sm leading-5 text-[#60799f]">{detail}</p></div>)}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(270px,1fr)]">
        <section className="min-w-0 rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="event-register-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 id="event-register-heading" className="text-xl font-bold">Event register</h2><p className="mt-1 text-sm text-[#60799f]">Find a record, review its status and open the department-level detail.</p></div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-[#eef5fd] px-3 py-2 text-xs font-semibold text-[#35557f]">Example records · {eventExamples.length}</span><Link href="/facilities/events-control/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#155ca7] px-4 text-sm font-semibold text-white hover:bg-[#104d90]"><Plus size={17} aria-hidden="true" />Add Event</Link></div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#cfdff2] px-3 text-[#60799f]"><Search size={17} aria-hidden="true" /><span className="sr-only">Search events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, organiser or venue" className="w-full min-w-0 bg-transparent text-sm text-[#112d56] outline-none" /></label>
            <label className="sr-only" htmlFor="events-venue">Filter by venue</label><select id="events-venue" value={venueId} onChange={(event) => setVenueId(event.target.value)} className="min-h-11 max-w-full rounded-lg border border-[#cfdff2] bg-white px-3 text-sm"><option value="all">All venues</option>{facilitiesVenues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select>
            <label className="sr-only" htmlFor="events-status">Filter by status</label><select id="events-status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="min-h-11 rounded-lg border border-[#cfdff2] bg-white px-3 text-sm"><option>All statuses</option><option>Draft</option><option>Submitted</option><option>Approved</option><option>Completed</option></select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead><tr className="bg-[#eef5fd] text-xs text-[#35557f]"><th scope="col" className="rounded-l-lg px-3 py-3">Event / organiser</th><th scope="col" className="px-3 py-3">Venue</th><th scope="col" className="px-3 py-3">Date</th><th scope="col" className="px-3 py-3">Status</th><th scope="col" className="rounded-r-lg px-3 py-3">Record</th></tr></thead>
              <tbody>{filtered.map((event) => <tr key={event.id} className="border-b border-[#e5edf8]"><td className="px-3 py-3"><strong className="block">{event.name}</strong><span className="text-xs text-[#60799f]">{event.organiser}</span></td><td className="px-3 py-3 text-[#526f98]">{event.venue}</td><td className="whitespace-nowrap px-3 py-3 text-[#526f98]">{event.date}</td><td className="px-3 py-3"><span className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusStyle[event.status]}`}>{event.status}</span></td><td className="px-3 py-3"><Link href={`/facilities/events-control/${event.id}`} className="inline-flex items-center gap-1 font-semibold text-[#155ca7] hover:underline">Review <ArrowRight size={15} aria-hidden="true" /></Link></td></tr>)}</tbody>
            </table>
            {filtered.length === 0 && <p className="rounded-b-lg border border-[#e5edf8] p-5 text-sm text-[#60799f]">No example records match these filters.</p>}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="review-heading">
            <div className="flex items-center gap-3"><TriangleAlert size={23} className="text-amber-600" aria-hidden="true" /><h2 id="review-heading" className="text-lg font-bold">Department review queue</h2></div>
            <p className="mt-2 text-sm text-[#60799f]">{reviewCount} example records are Draft or Submitted. Review and approval belong here, not inside a venue workspace.</p>
            <div className="mt-4 space-y-2">{eventExamples.filter((event) => event.status === "Submitted" || event.status === "Draft").map((event) => <Link key={event.id} href={`/facilities/events-control/${event.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-[#d5e4f6] px-3 py-3 text-sm hover:bg-[#f5f9ff]"><span><strong className="block">{event.name}</strong><span className="text-xs text-[#60799f]">{event.status} · {event.venue}</span></span><ArrowRight size={16} className="shrink-0 text-[#155ca7]" aria-hidden="true" /></Link>)}</div>
          </section>
          <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="coordination-heading">
            <h2 id="coordination-heading" className="text-lg font-bold">Coordination</h2>
            <div className="mt-3 space-y-2"><Link href="/facilities/shared-calendar" className="flex items-center justify-between rounded-lg border border-[#d5e4f6] px-3 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><span className="flex items-center gap-2"><CalendarDays size={18} aria-hidden="true" />Shared Calendar</span><ArrowRight size={16} aria-hidden="true" /></Link><Link href="/facilities/facilities-directory" className="flex items-center justify-between rounded-lg border border-[#d5e4f6] px-3 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><span className="flex items-center gap-2"><Building2 size={18} aria-hidden="true" />Facilities Directory</span><ArrowRight size={16} aria-hidden="true" /></Link></div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#60799f]"><Clock3 size={15} className="mt-0.5 shrink-0" aria-hidden="true" />Live clash checks and event totals will appear when event data is connected.</p>
          </section>
        </aside>
      </div>
      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-delivery-heading"><div className="flex items-start gap-3"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#155ca7]" aria-hidden="true" /><div><h2 id="venue-delivery-heading" className="text-lg font-bold">Venue delivery</h2><p className="mt-1 text-sm text-[#60799f]">Centre Managers see only their venue&apos;s event information and prepare the site. Department-wide decisions stay in this Events Control area.</p></div></div></section>
    </div>
  );
}
