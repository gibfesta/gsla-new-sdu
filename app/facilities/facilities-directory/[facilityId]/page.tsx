"use client";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import SavedFacilityInformation from "@/components/facilities/SavedFacilityInformation";
import OriginalVenueWorkspace from "@/components/facilities/OriginalVenueWorkspace";
import { type FacilityFormSection } from "@/components/facilities/FacilityFormBlueprint";

const planningTabs: FacilityFormSection[] = ["handover", "issues", "timeline", "bookings", "procedures", "weekly", "monthly", "documents", "photos", "compliance", "audit"];

function VenuePageContent() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const section = useSearchParams().get("tab");
  if (section === "events") return <section className="rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Venue Events</h1><p className="mt-3 text-sm">Event examples and form designs remain available in Events Control.</p><Link className="mt-4 inline-block font-semibold text-[#155ca7]" href="/facilities/events-control">Open Events Control</Link></section>;
  if (section && planningTabs.includes(section as FacilityFormSection)) return <OriginalVenueWorkspace key={facilityId} facilityId={facilityId}/>;
  return <SavedFacilityInformation key={facilityId} facilityId={facilityId} />;
}
export default function FacilityPage() {
  return <Suspense fallback={<p role="status">Loading facility...</p>}><VenuePageContent /></Suspense>;
}
