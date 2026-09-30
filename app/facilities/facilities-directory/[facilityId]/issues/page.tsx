"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import FacilityFormPreviewer from "@/components/facilities/FacilityFormPreviewer";
function IssuePreview() {
 const { facilityId } = useParams<{ facilityId: string }>();
 return <FacilityFormPreviewer facilityId={facilityId} defaultTab="issues"/>;
}
export default function FacilityIssuesPage() {
 return <Suspense fallback={<p role="status">Loading issue form preview…</p>}><IssuePreview/></Suspense>;
}
