"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import OriginalVenueWorkspace from "@/components/facilities/OriginalVenueWorkspace";
function IssuePreview() {
 const { facilityId } = useParams<{ facilityId: string }>();
 return <OriginalVenueWorkspace facilityId={facilityId} defaultTab="issues"/>;
}
export default function FacilityIssuesPage() {
 return <Suspense fallback={<p role="status">Loading issue form preview…</p>}><IssuePreview/></Suspense>;
}
