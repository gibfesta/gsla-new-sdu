"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive, ArrowRight, LayoutGrid, List,
  Pencil, Plus, Search, ShieldCheck, TriangleAlert,
} from "lucide-react";
import { useEventRecords, eventRegisterEntry, type Status } from "@/lib/eventPageStore";
import { useSavedFacilities } from "@/components/facilities/useSavedFacilities";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

type StatusFilter = "All statuses" | Status;
type EventTab = "all" | "requests" | "schedule" | "impact" | "delivery";

const tabs: { key: EventTab; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "requests", label: "Requests & Approvals" },
  { key: "schedule", label: "Schedule & Clashes" },
  { key: "impact", label: "Venue Impact" },
  { key: "delivery", label: "Venue Delivery" },
];

const statusStyle: Record<Status, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Submitted: "bg-amber-50 text-amber-800",
  Approved: "bg-emerald-50 text-emerald-800",
  Completed: "bg-blue-50 text-blue-800",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function FacilitiesEventsPage() {
  const { records, ready } = useEventRecords();
  const { facilities: facilitiesVenues, loading: venuesLoading, error: venuesError } = useSavedFacilities();
  const events = records.map(eventRegisterEntry);
  const venueOptions = Array.from(new Map([...facilitiesVenues.map(v => [v.id, { id:v.id, name:v.name }] as const), ...events.map(e => [e.venueId, { id:e.venueId, name:e.venue }] as const)]).values());
  const [tab, setTab] = useState<EventTab>("all");
  const [view, setView] = useState<"cards" | "list">("list");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [query, setQuery] = useState("");
  const [venueId, setVenueId] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("All statuses");
  const filtered = events.filter((event) => {
    const text = `${event.name} ${event.organiser} ${event.venue} ${event.category}`.toLowerCase();
    return text.includes(query.trim().toLowerCase())
      && (venueId === "all" || event.venueId === venueId)
      && (status === "All statuses" || event.status === status);
  });
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Events Control" description="The central place to review and coordinate events across every venue. Venue teams handle the on-site delivery of events assigned to them." />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d5e4f6] bg-white p-4 shadow-sm">
        <div><p className="text-sm font-bold">Department event actions</p><p className="mt-1 text-xs text-[#60799f]">{selectedEvent ? `${selectedEvent.name} selected` : "Select an event in the register to edit or archive it."}</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/facilities/events-control/new" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0C2F57] px-4 text-sm font-semibold text-white hover:brightness-110"><Plus size={16} aria-hidden="true" />Create Event</Link>
          <Link href={selectedEvent ? `/facilities/events-control/${selectedEvent.id}/edit` : "#event-register-heading"} aria-disabled={!selectedEvent} tabIndex={selectedEvent ? 0 : -1} onClick={(event) => { if (!selectedEvent) event.preventDefault(); }} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#b8d4f5] px-4 text-sm font-semibold text-[#155ca7] ${selectedEvent ? "hover:bg-blue-50" : "pointer-events-none opacity-50"}`}><Pencil size={16} aria-hidden="true" />Edit Event</Link>
          <Link href={selectedEvent ? `/facilities/events-control/${selectedEvent.id}/archive` : "#event-register-heading"} aria-disabled={!selectedEvent} tabIndex={selectedEvent ? 0 : -1} onClick={(event) => { if (!selectedEvent) event.preventDefault(); }} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-700 ${selectedEvent ? "hover:bg-rose-50" : "pointer-events-none opacity-50"}`}><Archive size={16} aria-hidden="true" />Archive Event</Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="overflow-x-auto" aria-label="Events Control sections"><div className="inline-flex min-w-max rounded-2xl bg-slate-100 p-1">{tabs.map((item) => <button key={item.key} type="button" aria-current={tab === item.key ? "page" : undefined} onClick={() => setTab(item.key)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === item.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"}`}>{item.label}</button>)}</div></nav>
        <div className="flex gap-1" role="group" aria-label="Events view">
          <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "cards" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><LayoutGrid size={16} aria-hidden="true" />Card view</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "list" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><List size={16} aria-hidden="true" />List view</button>
        </div>
      </div>

      {!ready && <p role="status" className="text-sm text-[#60799f]">Loading saved events…</p>}
      {ready && events.length === 0 && <p role="status" className="rounded-xl border border-[#d5e4f6] bg-white p-4 text-sm text-[#60799f]">No events yet. Create Event will add a browser-saved design record; shared database storage will be connected later.</p>}
      {tab === "all" && <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="all-events-heading">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="all-events-heading" className="text-xl font-bold">All Events</h2><p className="mt-1 text-sm text-[#60799f]">The department register across venues. Select a record for the Edit or Archive controls above.</p></div></div>
        <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#cfdff2] px-3 text-[#60799f]"><Search size={17} aria-hidden="true" /><span className="sr-only">Search events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, organiser or venue" className="w-full min-w-0 bg-transparent text-sm text-[#112d56] outline-none" /></label><label className="sr-only" htmlFor="all-events-venue">Filter by venue</label><select id="all-events-venue" value={venueId} onChange={(event) => setVenueId(event.target.value)} className="min-h-11 rounded-lg border border-[#cfdff2] bg-white px-3 text-sm"><option value="all">All venues</option>{venueOptions.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select><label className="sr-only" htmlFor="all-events-status">Filter by status</label><select id="all-events-status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="min-h-11 rounded-lg border border-[#cfdff2] bg-white px-3 text-sm"><option>All statuses</option><option>Draft</option><option>Submitted</option><option>Approved</option><option>Completed</option><option>Cancelled</option></select></div>
        {view === "cards" ? <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((event) => <article key={event.id} className={`rounded-xl border p-4 ${selectedEventId === event.id ? "border-[#155ca7] bg-blue-50 ring-1 ring-[#155ca7]" : "border-[#d5e4f6]"}`}><div className="flex items-start justify-between gap-3"><input type="radio" name="selected-event-card" checked={selectedEventId === event.id} onChange={() => setSelectedEventId(event.id)} aria-label={`Select ${event.name}`} className="mt-1 h-4 w-4 accent-[#155ca7]" /><span className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusStyle[event.status]}`}>{event.status}</span></div><h3 className="mt-3 font-bold">{event.name}</h3><p className="mt-1 text-sm text-[#60799f]">{event.organiser} · {event.category}</p><p className="mt-3 text-sm text-[#526f98]">{event.venue}<br />{event.date}</p><Link href={`/facilities/events-control/${event.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">Open record <ArrowRight size={15} aria-hidden="true" /></Link></article>)}{filtered.length === 0 && <p className="text-sm text-[#60799f]">{events.length ? "No events match these filters." : "No events yet."}</p>}</div> : <div className="mt-4 overflow-x-auto"><table className="gsla-data-table w-full min-w-[800px] text-left text-sm"><thead className="bg-[#eef5fd] text-xs text-[#35557f]"><tr><th scope="col" className="px-3 py-3">Select</th><th scope="col" className="px-3 py-3">Event / organiser</th><th scope="col" className="px-3 py-3">Venue</th><th scope="col" className="px-3 py-3">Date</th><th scope="col" className="px-3 py-3">Status</th><th scope="col" className="px-3 py-3">Record</th></tr></thead><tbody>{filtered.map((event) => <tr key={event.id} className={`border-b border-[#e5edf8] ${selectedEventId === event.id ? "bg-blue-50" : ""}`}><td className="px-3 py-3"><input type="radio" name="selected-event-all" checked={selectedEventId === event.id} onChange={() => setSelectedEventId(event.id)} aria-label={`Select ${event.name}`} className="h-4 w-4 accent-[#155ca7]" /></td><td className="px-3 py-3"><strong className="block">{event.name}</strong><span className="text-xs text-[#60799f]">{event.organiser} · {event.category}</span></td><td className="px-3 py-3 text-[#526f98]">{event.venue}</td><td className="whitespace-nowrap px-3 py-3 text-[#526f98]">{event.date}</td><td className="px-3 py-3"><span className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusStyle[event.status]}`}>{event.status}</span></td><td className="px-3 py-3"><Link href={`/facilities/events-control/${event.id}`} className="font-semibold text-[#155ca7] hover:underline">Open record →</Link></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-5 text-sm text-[#60799f]">{events.length ? "No events match these filters." : "No events yet."}</p>}</div>}
      </section>}

      {tab === "requests" && <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="requests-heading"><h2 id="requests-heading" className="text-xl font-bold">Requests &amp; Approvals</h2><p className="mt-1 text-sm text-[#60799f]">Review plans, documents and department decisions. Open a record to review its plans and sign-offs.</p><div className={view === "cards" ? "mt-5 grid gap-3 md:grid-cols-2" : "mt-5 space-y-2"}>{events.filter((event) => event.status === "Submitted" || event.status === "Draft").map((event) => <article key={event.id} className={`rounded-xl border border-[#d5e4f6] p-4 ${view === "list" ? "sm:flex sm:items-center sm:gap-5" : ""}`}><span className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusStyle[event.status]}`}>{event.status}</span><h3 className={view === "list" ? "font-bold sm:min-w-[200px] sm:flex-1" : "mt-3 font-bold"}>{event.name}</h3><p className="mt-1 text-sm text-[#60799f] sm:flex-1">{event.organiser} · {event.venue} · {event.date}</p><Link href={`/facilities/events-control/${event.id}`} className={view === "list" ? "inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline" : "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline"}>Review record <ArrowRight size={15} aria-hidden="true" /></Link></article>)}{events.length === 0 && <p className="text-sm text-[#60799f]">No event records to display yet.</p>}</div></section>}

      {tab === "schedule" && <div className="space-y-4"><section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="schedule-heading"><h2 id="schedule-heading" className="text-xl font-bold">Schedule &amp; Clashes</h2><p className="mt-1 text-sm text-[#60799f]">Review event dates and venue impact together. Clash detection needs a connected schedule with start, setup and dismantle times.</p><div className={view === "cards" ? "mt-5 grid gap-3 md:grid-cols-2" : "mt-5 space-y-2"}>{events.map((event) => <Link key={event.id} href={`/facilities/events-control/${event.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm hover:bg-blue-50"><span><strong className="block">{event.name}</strong><span className="text-[#60799f]">{event.venue} · {event.impact}</span></span><span className="font-semibold text-[#155ca7]">{event.date} →</span></Link>)}</div></section><section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><div className="flex items-center gap-2 font-bold"><TriangleAlert size={19} aria-hidden="true" />Clash checks are not connected</div><p className="mt-2">Automatic clash detection will be connected with the backend schedule. Use the Shared Calendar to review venue activity.</p><Link href="/facilities/shared-calendar" className="mt-3 inline-flex items-center gap-1 font-semibold underline">Open Shared Calendar <ArrowRight size={15} aria-hidden="true" /></Link></section></div>}

      {tab === "impact" && <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="impact-heading"><h2 id="impact-heading" className="text-xl font-bold">Venue Impact</h2><p className="mt-1 text-sm text-[#60799f]">Review each event&apos;s space and blocked time; the full record carries preparation and operational details.</p><div className={view === "cards" ? "mt-5 grid gap-3 md:grid-cols-2" : "mt-5 space-y-2"}>{events.map((event) => <article key={event.id} className={`rounded-xl border border-[#d5e4f6] p-4 ${view === "list" ? "sm:flex sm:items-center sm:gap-4" : ""}`}><h3 className={view === "list" ? "font-bold sm:min-w-[200px] sm:flex-1" : "font-bold"}>{event.name}</h3><p className="mt-1 text-sm text-[#60799f]">{event.venue} · {event.date}</p><p className="mt-3 rounded-lg bg-[#eef5fd] px-3 py-2 text-sm font-semibold text-[#35557f]">{event.impact}</p><Link href={`/facilities/events-control/${event.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">Review impact <ArrowRight size={15} aria-hidden="true" /></Link></article>)}{events.length === 0 && <p className="text-sm text-[#60799f]">No event records to display yet.</p>}</div></section>}

      {tab === "delivery" && <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="delivery-heading"><div className="flex items-start gap-3"><ShieldCheck size={23} className="text-[#155ca7]" aria-hidden="true" /><div><h2 id="delivery-heading" className="text-xl font-bold">Venue Delivery</h2><p className="mt-1 text-sm text-[#60799f]">Facilities Department coordinates event requests, approvals and cross-venue decisions. Centre Managers prepare and deliver events assigned to their venue.</p></div></div><div className={view === "cards" ? "mt-5 grid gap-3 md:grid-cols-2" : "mt-5 space-y-2"}>{venuesLoading && <p className="text-sm text-[#60799f]">Loading venues…</p>}{venuesError && <p className="text-sm text-[#60799f]">Saved venues will appear when the facility database connection is available.</p>}{!venuesLoading && !venuesError && facilitiesVenues.length === 0 && <p className="text-sm text-[#60799f]">No facilities have been added yet.</p>}{facilitiesVenues.map((venue) => <Link key={venue.id} href={`/facilities/facilities-directory/${venue.id}?tab=events`} className="flex items-center justify-between rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50">{venue.name}<ArrowRight size={16} aria-hidden="true" /></Link>)}{events.length === 0 && <p className="text-sm text-[#60799f]">No event records to display yet.</p>}</div></section>}
    </div>
  );
}
