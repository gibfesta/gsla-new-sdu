import { Suspense } from "react";
import OriginalVenueWorkspace from "@/components/facilities/OriginalVenueWorkspace";
export default function FacilitiesFormsPage() {
 return <Suspense fallback={<p role="status">Loading venue form preview…</p>}><OriginalVenueWorkspace/></Suspense>;
}
