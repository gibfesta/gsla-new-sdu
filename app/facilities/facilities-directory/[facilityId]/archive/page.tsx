"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Archive, ArrowLeft } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";
import { useSavedFacilities } from "@/components/facilities/useSavedFacilities";

export default function ArchiveFacilityPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const { facilities, loading, error } = useSavedFacilities();
  const facility = facilities.find((item) => item.id === facilityId);
  return <div className="space-y-4 text-[#112d56]">
    <FacilitiesDepartmentBanner title="Archive Facility" description="Review the facility before archiving it." />
    {loading && <p role="status">Loading facility...</p>}
    {error && <p role="alert" className="text-rose-700">{error}</p>}
    {!loading && !error && !facility && <p>Facility not found.</p>}
    {facility && <section className="rounded-2xl border border-[#d5e4f6] bg-white p-6"><Archive size={25} className="text-[#155ca7]" /><h2 className="mt-3 text-xl font-bold">{facility.name}</h2><p className="text-sm text-[#60799f]">{facility.type}</p><p className="mt-5 text-sm">Archiving is not connected. No saved facility will be changed from this page.</p><button type="button" disabled className="mt-4 cursor-not-allowed rounded-xl bg-[#7c9cbe] px-5 py-2.5 text-sm font-semibold text-white">Confirm archive — not connected</button></section>}
    <Link href="/facilities/facilities-directory" className="inline-flex items-center gap-2 font-semibold text-[#155ca7]"><ArrowLeft size={16} />Back to Facilities Directory</Link>
  </div>;
}
