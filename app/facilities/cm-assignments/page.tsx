import { UsersRound } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function CentreManagerAssignmentsPage() {
  return <FacilitiesDepartmentModule eyebrow="Management" title="CM Assignments" description="Oversee which Centre Managers are responsible for each venue and update assignments when rotations change." icon={UsersRound} statusLabel="Assignment records not connected" emptyMessage="Centre Manager assignments will appear here when staff accounts and venue assignments are connected. No managers have been inferred from sample venue data." />;
}
