"use client";

import { ClipboardCheck } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesDailyOperationsPage() {
  return <FacilitiesDepartmentModule eyebrow="Operations" title="Daily Operations" description="See opening, handovers and closing checks across venues." icon={ClipboardCheck} statusLabel="Daily operations records not connected" emptyMessage="Daily opening, afternoon and night handovers, and closing records will appear when venue checks feed into the shared department view. No operational status is inferred from the facility directory." venueAction="Open venue daily operations" venueTab="handover" tabs={[
    { label: "All Venues", description: "Review the venues covered by department daily operations oversight.", emptyMessage: "Opening, handover and closing status will appear when venue records are connected.", venueAction: "Open venue daily operations", venueTab: "handover" },
    { label: "Opening", description: "Review daily opening checks across venues.", emptyMessage: "Completed opening checks and reported exceptions will appear here when venue records are connected.", venueAction: "Open venue daily operations", venueTab: "handover" },
    { label: "Afternoon Handover", description: "Review information passed to the afternoon shift across venues.", emptyMessage: "Afternoon handover summaries, concerns and follow-up actions will appear when venue records are connected.", venueAction: "Open venue handovers", venueTab: "handover" },
    { label: "Night Handover", description: "Review information passed to the night shift across venues.", emptyMessage: "Night handover summaries, concerns and follow-up actions will appear when venue records are connected.", venueAction: "Open venue handovers", venueTab: "handover" },
    { label: "Closing", description: "Review daily closing checks across venues.", emptyMessage: "Completed closing checks and reported exceptions will appear here when venue records are connected.", venueAction: "Open venue daily operations", venueTab: "handover" },
  ]} />;
}
