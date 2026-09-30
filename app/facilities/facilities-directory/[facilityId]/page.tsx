"use client";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import SavedFacilityInformation from "@/components/facilities/SavedFacilityInformation";

function VenuePageContent() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const section = useSearchParams().get("tab");
  if (section && section !== "information") return <section className="rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Venue operations</h1><p className="mt-3 text-sm">This operational section does not have connected records yet.</p><Link className="mt-4 inline-block font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${facilityId}?tab=information`}>View facility information</Link></section>;
  return <SavedFacilityInformation key={facilityId} facilityId={facilityId} />;
}
export default function FacilityPage() {
  return <Suspense fallback={<p role="status">Loading facility...</p>}><VenuePageContent /></Suspense>;
}
