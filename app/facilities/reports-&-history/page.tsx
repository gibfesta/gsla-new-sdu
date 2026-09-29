import { BarChart3 } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesReportsPage() {
  return <FacilitiesDepartmentModule eyebrow="Reporting" title="Reports / History" description="Review department activity, issue trends, venue handovers and past actions in one place." icon={BarChart3} statusLabel="Reporting data not connected" emptyMessage="Reports and audit history will appear when venue activity is persisted and available to the Facilities Department. Venue workspaces currently contain illustrative history." venueAction="Open venue audit trail" venueTab="audit" />;
}
