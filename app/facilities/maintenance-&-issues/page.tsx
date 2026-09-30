"use client";

import { Wrench } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesMaintenancePage() {
  return <FacilitiesDepartmentModule eyebrow="Operations" title="Maintenance & Issues" description="Review maintenance work and reported issues across all venues from one place." icon={Wrench} statusLabel="Cross-venue issues not connected" emptyMessage="Open issue counts, work orders and priority alerts will appear when venue reports feed into a shared register. Individual venue issue records are not connected yet." venueAction="Open venue issues" venueTab="issues" tabs={[
    { label: "All Venues", description: "Review the venues covered by department maintenance oversight.", emptyMessage: "Venue issue totals are not connected to this department view yet.", venueAction: "Open venue issues", venueTab: "issues" },
    { label: "Reported Issues", description: "A cross-venue register for reported faults and operational issues.", emptyMessage: "Reported issues will appear here when venue reports are shared with the department.", venueAction: "Open venue issues", venueTab: "issues" },
    { label: "Maintenance Work", description: "Track work orders, progress and completed repairs across venues.", emptyMessage: "Work orders and maintenance progress are not connected yet.", venueAction: "Open venue timeline", venueTab: "timeline" },
    { label: "Priorities", description: "Review urgent items and work requiring department coordination.", emptyMessage: "Priority alerts require connected issue records and agreed escalation rules.", venueAction: "Open venue issues", venueTab: "issues" },
  ]} />;
}
