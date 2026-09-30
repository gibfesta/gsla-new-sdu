"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import VenueBanner from "@/components/facilities/VenueBanner";
import { FacilityFormBlueprint } from "@/components/facilities/FacilityFormBlueprint";

export default function FacilityIssuesPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  return <div className="space-y-5">
    <VenueBanner eyebrow="Venue issues" title="Issues" description="Report and track issues for this facility." />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{["Total Issues", "Open Issues", "High Priority", "Resolved"].map((title) => <div key={title} className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><p className="text-sm text-[#60799f]">{title}</p><p className="mt-2 text-3xl font-bold text-[#0C2F57]">—</p><p className="mt-1 text-xs text-[#60799f]">Register not connected</p></div>)}</div>
    <FacilityFormBlueprint sections={["issues", "maintenance"]} />
    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-6">
      <h2 className="text-lg font-bold">No connected issues</h2>
      <p className="mt-2 text-sm text-[#60799f]">Issue reports and their status will appear here when the issue register is connected. Reporting an issue cannot be saved yet.</p>
      <Link className="mt-4 inline-block font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${facilityId}?tab=information`}>Back to facility information</Link>
    </section>
  </div>;
}
