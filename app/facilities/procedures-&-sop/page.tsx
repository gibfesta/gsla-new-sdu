"use client";

import { FileText } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesProceduresPage() {
  return <FacilitiesDepartmentModule eyebrow="Records" title="Procedures & SOPs" description="Find the procedures, checklists and standard operating documents used by venues." icon={FileText} statusLabel="Shared document library not connected" emptyMessage="Approved procedures and version history will appear here when the department document library is connected. Venue workspaces currently include demonstration checklists." venueAction="Open venue procedures" venueTab="procedures" tabs={[
    { label: "All Venues", description: "Find venue-level procedures and opening or closing checklists.", emptyMessage: "The shared department document library is not connected yet.", venueAction: "Open venue procedures", venueTab: "procedures" },
    { label: "Procedures & SOPs", description: "Browse approved operating instructions by venue.", emptyMessage: "Approved procedures will appear here when the document library is connected.", venueAction: "Open venue documents", venueTab: "documents" },
    { label: "Checklists", description: "Access opening, closing and routine checklists for each venue.", emptyMessage: "Completed checklist records are not shared with this department view yet.", venueAction: "Open venue checklists", venueTab: "procedures" },
    { label: "Version History", description: "Review document versions and changes to approved instructions.", emptyMessage: "Version history will appear when documents are stored and approved centrally.", venueAction: "Open venue documents", venueTab: "documents" },
  ]} />;
}
