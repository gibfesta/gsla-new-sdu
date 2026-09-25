import { ShieldCheck } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesCompliancePage() {
  return <FacilitiesDepartmentModule eyebrow="Control" title="Compliance" description="Monitor checks, upcoming deadlines and compliance actions across GSLA venues." icon={ShieldCheck} statusLabel="Compliance records not connected" emptyMessage="A department-wide compliance register will appear here when venue checks and deadlines are stored centrally. The Europa venue workspace contains a demonstration view." venueAction="Open venue compliance" venueTab="compliance" />;
}
