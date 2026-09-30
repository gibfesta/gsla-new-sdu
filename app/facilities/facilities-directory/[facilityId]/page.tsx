"use client";
import { useParams } from "next/navigation";
import SavedFacilityInformation from "@/components/facilities/SavedFacilityInformation";
export default function FacilityPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  return <SavedFacilityInformation key={facilityId} facilityId={facilityId} />;
}
