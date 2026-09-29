import Link from "next/link";
import { ArrowLeft, CalendarDays, Info } from "lucide-react";
import { facilitiesVenues } from "./venues";
import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";

type EventValues = {
  name?: string;
  venueId?: string;
  date?: string;
  organiser?: string;
  category?: string;
};

export default function EventEditor({ mode, values = {} }: { mode: "new" | "edit"; values?: EventValues }) {
  const edit = mode === "edit";
  const inputClass = "mt-1 w-full min-h-11 rounded-lg border border-[#cfdff2] bg-white px-3 py-2 text-sm text-[#112d56] focus:border-[#155ca7] focus:outline-none";

  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title={edit ? "Edit Event" : "Add Event"} description={edit ? "Review the event details and planned changes at department level." : "Start an event record for any GSLA venue from the Facilities Department."} />
      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><p><strong>UI prototype only.</strong> You can explore these fields, but they are not saved. Do not enter real personal or sensitive information here until event storage and permissions are connected.</p></div>
      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="event-details-heading">
        <div className="flex items-center gap-3"><CalendarDays size={23} className="text-[#155ca7]" aria-hidden="true" /><h2 id="event-details-heading" className="text-xl font-bold">Event details</h2></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">Event name<input className={inputClass} type="text" defaultValue={values.name} placeholder="Event name" /></label>
          <label className="text-sm font-semibold">Organiser<input className={inputClass} type="text" defaultValue={values.organiser} placeholder="Organising group" /></label>
          <label className="text-sm font-semibold">Venue<select className={inputClass} defaultValue={values.venueId ?? ""}><option value="">Choose a venue</option>{facilitiesVenues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select></label>
          <label className="text-sm font-semibold">Category<select className={inputClass} defaultValue={values.category ?? ""}><option value="">Choose a category</option><option>Community</option><option>Concert</option><option>Stand-up</option><option>Cultural</option><option>Other</option></select></label>
          <label className="text-sm font-semibold">Event date<input className={inputClass} type="text" defaultValue={values.date} placeholder="e.g. 24 Jan 2026" /></label>
          <label className="text-sm font-semibold">Status<input className={inputClass + " bg-[#f5f9ff]"} type="text" value={edit ? "Existing demo status (read-only)" : "Draft"} readOnly /></label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#e5edf8] pt-5">
          <button type="button" disabled className="cursor-not-allowed rounded-xl bg-[#7c9cbe] px-5 py-2.5 text-sm font-semibold text-white" title="Saving is not connected">{edit ? "Save changes" : "Create event"} — not connected</button>
          <Link href="/facilities/events-control" className="inline-flex items-center gap-2 rounded-xl border border-[#cfdff2] px-4 py-2.5 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><ArrowLeft size={16} aria-hidden="true" />Back to Events Control</Link>
        </div>
      </section>
    </div>
  );
}
