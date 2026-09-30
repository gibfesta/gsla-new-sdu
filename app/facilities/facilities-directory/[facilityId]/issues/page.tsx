"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import VenueBanner from "@/components/facilities/VenueBanner";

export default function FacilityIssuesPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  return <div className="space-y-5">
    <VenueBanner eyebrow="Venue issues" title="Issues" description="Report and track issues for this facility." />
    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-6">
      <h2 className="text-lg font-bold">No connected issues</h2>
      <p className="mt-2 text-sm text-[#60799f]">Issue reports and their status will appear here when the issue register is connected. Reporting an issue cannot be saved yet.</p>
      <Link className="mt-4 inline-block font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${facilityId}?tab=information`}>Back to facility information</Link>
    </section>
  </div>;
}
