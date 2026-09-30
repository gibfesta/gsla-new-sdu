"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import FacilityScheduleSummary from "@/components/facilities/FacilityScheduleSummary";
import VenueBanner from "@/components/facilities/VenueBanner";
import { normalizeActivity } from "@/components/facilities/activityOptions";

type FacilityRecord = {
  opening_schedule?: unknown;
  id: string; name: string; type: string; status: string; address: string; area: string;
  description: string; contact_email: string; contact_phone: string;
  centre_manager_name: string; centre_manager_title: string; centre_manager_email: string; centre_manager_phone: string;
  facilities_manager_name: string; facilities_manager_email: string; supported_activities: string[]; notes: string;
};

export default function SavedFacilityInformation({ facilityId }: { facilityId: string }) {
  const [facility, setFacility] = useState<FacilityRecord | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/facilities/${facilityId}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const record = await response.json();
        if (!response.ok) throw new Error(response.status === 404 ? "This venue has no saved database record yet." : record.error);
        setFacility(record);
      })
      .catch((error: Error) => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, [facilityId]);
  if (error) return <section className="rounded-xl bg-white p-6"><p role="alert">{error}</p><Link className="mt-4 inline-block font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${facilityId}/edit`}>Enter facility details</Link></section>;
  if (!facility) return <p role="status">Loading facility...</p>;
  const groups = [
    ["Basic information", [["Name", facility.name], ["Type", facility.type], ["Status", facility.status], ["Address", facility.address], ["Description", facility.description]]],
    ["General contact", [["Email", facility.contact_email], ["Phone", facility.contact_phone]]],
    ["Centre Manager", [["Name", facility.centre_manager_name], ["Job title", facility.centre_manager_title], ["Email", facility.centre_manager_email], ["Phone", facility.centre_manager_phone]]],
    ["Facilities Manager", [["Name", facility.facilities_manager_name], ["Email", facility.facilities_manager_email]]],
  ] as const;
  return <div className="space-y-6">
    <VenueBanner title={facility.name} description="Facility information" eyebrow="Venue" details={<span>{facility.status}</span>} />
    <div className="flex justify-between gap-3"><Link className="font-semibold text-[#155ca7]" href="/facilities/facilities-directory">Back to Facilities Directory</Link><Link className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white" href={`/facilities/facilities-directory/${facility.id}/edit`}>Edit Facility</Link></div>
    <div className="grid gap-6 lg:grid-cols-2">{groups.map(([title, fields]) => <section key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-[#0C2F57]">{title}</h2><dl className="mt-4 space-y-3">{fields.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{value || "Not provided"}</dd></div>)}</dl></section>)}</div>
    <FacilityScheduleSummary value={facility.opening_schedule} />
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-[#0C2F57]">Supported activities</h2><div className="mt-4 flex flex-wrap gap-2">{facility.supported_activities.length ? facility.supported_activities.map((activity) => <span key={activity} className="rounded-full bg-slate-100 px-3 py-2 text-sm">{normalizeActivity(activity)}</span>) : <p>No activities selected.</p>}</div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold text-[#0C2F57]">Operational notes</h2><p className="mt-4 whitespace-pre-wrap text-sm">{facility.notes || "No notes provided."}</p></section>
  </div>;
}
