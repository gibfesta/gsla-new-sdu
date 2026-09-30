"use client";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import SavedFacilityInformation from "@/components/facilities/SavedFacilityInformation";
import { FacilityFormBlueprint, type FacilityFormSection } from "@/components/facilities/FacilityFormBlueprint";

const planningTabs: FacilityFormSection[] = ["handover", "issues", "timeline", "bookings", "procedures", "weekly", "monthly", "documents", "photos", "compliance", "audit"];

function VenuePageContent() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const section = useSearchParams().get("tab");
  if (section === "events") return <section className="rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Venue Events</h1><p className="mt-3 text-sm">Event examples and form designs remain available in Events Control.</p><Link className="mt-4 inline-block font-semibold text-[#155ca7]" href="/facilities/events-control">Open Events Control</Link></section>;
  if (section && planningTabs.includes(section as FacilityFormSection)) return <div className="space-y-5 p-4"><div className="rounded-2xl border border-[#d5e4f6] bg-white p-6"><h1 className="text-xl font-bold capitalize text-[#0C2F57]">{section === "procedures" ? "Opening / Closing" : section}</h1><p className="mt-2 text-sm text-[#60799f]">The cards and form fields remain available for planning. Connected records will appear here when these workflows are built.</p></div><FacilityFormBlueprint sections={[section as FacilityFormSection]} /><Link className="font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${facilityId}?tab=information`}>View facility information</Link></div>;
  return <SavedFacilityInformation key={facilityId} facilityId={facilityId} />;
}
export default function FacilityPage() {
  return <Suspense fallback={<p role="status">Loading facility...</p>}><VenuePageContent /></Suspense>;
}
