import { Suspense } from "react";
import FacilityFormPreviewer from "@/components/facilities/FacilityFormPreviewer";
export default function FacilitiesFormsPage() {
 return <Suspense fallback={<p role="status">Loading venue form preview…</p>}><FacilityFormPreviewer/></Suspense>;
}
