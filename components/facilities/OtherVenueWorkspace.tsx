"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, ClipboardCheck, Info, TriangleAlert } from "lucide-react";
import { facilitiesVenues } from "./venues";

const tabNames: Record<string, string> = {
  handover: "Daily Handover", information: "Information", issues: "Issues", timeline: "Timeline",
  events: "Events", bookings: "Bookings / Calendar", procedures: "Opening / Closing",
  weekly: "Weekly Tasks", monthly: "Monthly Tasks", documents: "Documents / SOPs",
  photos: "Photo Log", compliance: "Compliance", audit: "Audit Trail",
};

export default function OtherVenueWorkspace({ venueId }: { venueId: string }) {
  const searchParams = useSearchParams();
  const venue = facilitiesVenues.find((item) => item.id === venueId);
  const tab = searchParams.get("tab") ?? "handover";
  const section = tabNames[tab] ?? "Daily Handover";
  if (!venue) return <div className="rounded-xl border border-[#d5e4f6] bg-white p-6 text-[#112d56]"><h1 className="text-2xl font-bold">Venue not found</h1><Link href="/facilities/facilities" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7]">Open Facilities Directory <ArrowRight size={16} /></Link></div>;

  return <div className="space-y-4 text-[#112d56]">
    <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities · Venue Workspace</p><h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{venue.name}</h1><p className="mt-3 max-w-2xl text-base text-blue-50">A dedicated working space for this venue&apos;s Centre Managers.</p></section>
    <div className="rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mr-2 inline text-[#155ca7]" aria-hidden="true" />This venue is listed in the demonstration directory. Operational records for {venue.name} are not connected yet. Europa Sports Complex has the detailed demonstration workspace.</div>
    <section aria-label="Venue summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Open Issues", icon: TriangleAlert }, { label: "Today’s Events", icon: CalendarDays },
      { label: "Weekly Tasks", icon: ClipboardCheck }, { label: "Venue Status", icon: Building2 },
    ].map(({ label, icon: Icon }) => <article key={label} className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><Icon size={25} className="text-[#174a84]" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold">{label}</h2><p className="mt-1 text-3xl font-bold">—</p><p className="text-xs text-[#637da2]">Venue data not connected</p></article>)}</section>
    <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-section-heading"><h2 id="venue-section-heading" className="text-xl font-bold">{section}</h2><p className="mt-1 text-sm text-[#60799f]">{venue.name}</p><p className="mt-5 rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-8 text-sm text-[#637da2]">{section} for this venue will appear when its records and permissions are connected.</p></section>
  </div>;
}
