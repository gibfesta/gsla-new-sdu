"use client";
import { useParams } from "next/navigation";
import FacilityForm from "@/components/facilities/FacilityForm";
export default function EditFacilityPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  return <FacilityForm key={facilityId} facilityId={facilityId} />;
}
