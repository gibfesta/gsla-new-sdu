import { Wrench } from "lucide-react";
import FacilitiesDepartmentModule from "@/components/facilities/FacilitiesDepartmentModule";

export default function FacilitiesMaintenancePage() {
  return <FacilitiesDepartmentModule eyebrow="Operations" title="Maintenance & Issues" description="Review maintenance work and reported issues across all venues from one place." icon={Wrench} statusLabel="Cross-venue issues not connected" emptyMessage="Open issue counts, work orders and priority alerts will appear when venue reports feed into a shared register. Individual venue pages currently show demonstration entries." venueAction="Open venue issues" venueTab="issues" />;
}
