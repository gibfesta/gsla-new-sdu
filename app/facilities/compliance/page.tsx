"use client";

import { ShieldCheck } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesCompliancePage() {
  return <FacilitiesDepartmentModule eyebrow="Control" title="Compliance" description="Monitor checks, upcoming deadlines and compliance actions across GSLA venues." icon={ShieldCheck} statusLabel="Compliance records not connected" emptyMessage="A department-wide compliance register will appear here when venue checks and deadlines are stored centrally. Venue compliance records are not connected yet." venueAction="Open venue compliance" venueTab="compliance" tabs={[
    { label: "All Venues", description: "Review compliance coverage across the Facilities Directory.", emptyMessage: "Venue compliance status is not connected to this department view yet.", venueAction: "Open venue compliance", venueTab: "compliance" },
    { label: "Checks", description: "Monitor required checks and their completion by venue.", emptyMessage: "Completed and outstanding checks will appear once venue records are shared.", venueAction: "Open venue compliance", venueTab: "compliance" },
    { label: "Deadlines", description: "Track upcoming renewals, inspections and due dates.", emptyMessage: "Deadline data is not connected yet; no live overdue status is shown here.", venueAction: "Open venue compliance", venueTab: "compliance" },
    { label: "Actions", description: "Follow up on compliance work requiring department attention.", emptyMessage: "Compliance actions will appear when records and ownership are connected.", venueAction: "Open venue audit trail", venueTab: "audit" },
  ]} />;
}
