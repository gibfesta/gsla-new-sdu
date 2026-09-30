import { Suspense } from "react";
import FacilityWorkflowWorkspace from "@/components/facilities/FacilityWorkflowWorkspace";
export default function FacilitiesFormsPage() {
  return <Suspense fallback={<p role="status">Loading form designs…</p>}><FacilityWorkflowWorkspace /></Suspense>;
}
