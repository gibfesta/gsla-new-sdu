"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, ClipboardCheck, Info, TriangleAlert } from "lucide-react";
import { facilitiesVenues } from "./venues";

const tabNames: Record<string, string> = {
  handover: "Daily Handovers", information: "Information", issues: "Issues", timeline: "Timeline",
  events: "Venue Events", bookings: "Bookings / Calendar", procedures: "Opening / Closing",
  weekly: "Weekly Tasks", monthly: "Monthly Tasks", documents: "Documents / SOPs",
  photos: "Photo Log", compliance: "Compliance", audit: "Audit Trail",
};

export default function OtherVenueWorkspace({ venueId }: { venueId: string }) {
  const searchParams = useSearchParams();
  const venue = facilitiesVenues.find((item) => item.id === venueId);
  const tab = searchParams.get("tab") ?? "handover";
  const section = tabNames[tab] ?? "Daily Handovers";
  if (!venue) return <div className="rounded-xl border border-[#d5e4f6] bg-white p-6 text-[#112d56]"><h1 className="text-2xl font-bold">Venue not found</h1><Link href="/facilities/facilities-directory" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7]">Open Facilities Directory <ArrowRight size={16} /></Link></div>;

  return <div className="space-y-4 text-[#112d56]">
    <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9"><h1 className="text-3xl font-extrabold sm:text-4xl">{venue.name}</h1><p className="mt-3 max-w-2xl text-base text-blue-50">A dedicated working space for this venue&apos;s Centre Managers.</p></section>
    <div className="rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mr-2 inline text-[#155ca7]" aria-hidden="true" />This venue is listed in the demonstration directory. Operational records for {venue.name} are not connected yet. Europa Sports Complex has the detailed demonstration workspace.</div>
    <section aria-label="Venue summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Open Issues", icon: TriangleAlert }, { label: "Today’s Events", icon: CalendarDays },
      { label: "Weekly Tasks", icon: ClipboardCheck }, { label: "Venue Status", icon: Building2 },
    ].map(({ label, icon: Icon }) => <article key={label} className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><Icon size={25} className="text-[#174a84]" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold">{label}</h2><p className="mt-1 text-3xl font-bold">—</p><p className="text-xs text-[#637da2]">Venue data not connected</p></article>)}</section>
    {tab === "handover" ? (
      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-section-heading">
        <h2 id="venue-section-heading" className="text-xl font-bold">Daily Handovers</h2>
        <p className="mt-1 text-sm text-[#60799f]">AM and PM handovers for {venue.name} will appear when its operational records are connected.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(["AM", "PM"] as const).map((period) => <div key={period} className="rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-6"><h3 className="font-semibold">{period} Handover</h3><p className="mt-2 text-sm text-[#637da2]">No connected handover record yet.</p></div>)}
        </div>
      </section>
    ) : tab === "events" ? (
      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-section-heading">
        <h2 id="venue-section-heading" className="text-xl font-bold">Events at {venue.name}</h2>
        <p className="mt-1 text-sm text-[#60799f]">This venue will see its assigned events, preparation and on-site delivery tasks here. Records for this venue are not connected yet.</p>
        <div className="mt-5 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-4 text-sm leading-6 text-[#35557f]">Facilities Department controls event requests, approvals and cross-venue decisions. <Link href="/facilities/events-control" className="font-semibold text-[#155ca7] hover:underline">Open Events Control →</Link></div>
      </section>
    ) : (
      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-section-heading"><h2 id="venue-section-heading" className="text-xl font-bold">{section}</h2><p className="mt-1 text-sm text-[#60799f]">{venue.name}</p><p className="mt-5 rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-8 text-sm text-[#637da2]">{section} for this venue will appear when its records and permissions are connected.</p></section>
    )}
  </div>;
}
