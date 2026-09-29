import { FileText } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesProceduresPage() {
  return <FacilitiesDepartmentModule eyebrow="Records" title="Procedures & SOPs" description="Find the procedures, checklists and standard operating documents used by venues." icon={FileText} statusLabel="Shared document library not connected" emptyMessage="Approved procedures and version history will appear here when the department document library is connected. Venue workspaces currently include demonstration checklists." venueAction="Open venue procedures" venueTab="procedures" />;
}
