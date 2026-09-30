"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";
import { useSavedFacilities } from "@/components/facilities/useSavedFacilities";
import { FacilityFormBlueprint } from "@/components/facilities/FacilityFormBlueprint";

export default function FacilitiesDailyOperationsPage() {
  const { facilities, loading, error } = useSavedFacilities();
  const [view, setView] = useState<"cards" | "list">("list");
  return <div className="space-y-4 text-[#112d56]">
    <FacilitiesDepartmentBanner title="Daily Operations" description="See opening, handovers and closing checks across venues." />
    <div className="flex flex-wrap gap-3 rounded-2xl border border-[#d5e4f6] bg-white p-5"><Link className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white" href="/facilities/forms?section=daily">Manage opening, closing & handover templates</Link><Link className="rounded-xl border px-4 py-2 text-sm font-semibold" href="/facilities/forms?section=daily&role=cm&mode=complete">Try Centre Manager forms</Link></div>
    <p className="rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm text-[#35557f]">Daily check and handover records are not connected yet. No operational status is inferred from the facility directory.</p>
    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Opening, handovers and closing</h2><div className="flex gap-1" role="group" aria-label="Daily Operations view"><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className="rounded-lg border px-3 py-2">Card view</button><button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className="rounded-lg border px-3 py-2">List view</button></div></div>
      {loading && <p className="mt-4" role="status">Loading facilities...</p>}
      {error && <p className="mt-4 text-rose-700" role="alert">{error}</p>}
      {!loading && !error && facilities.length === 0 && <p className="mt-4 text-sm">No facilities have been saved yet.</p>}
      {!loading && !error && (view === "cards"
        ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{facilities.map((venue) => <article key={venue.id} className="rounded-xl border border-[#d5e4f6] p-5"><h3 className="font-bold">{venue.name}</h3><p className="text-sm text-[#60799f]">{venue.type}</p><p className="mt-4 text-sm">Daily records not connected</p><Link className="mt-4 inline-flex items-center gap-1 font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${venue.id}?tab=handover`}>Open handovers <ArrowRight size={15} /></Link></article>)}</div>
        : <div className="mt-5 overflow-x-auto"><table className="gsla-data-table w-full text-left text-sm"><thead><tr><th className="p-3">Venue</th><th className="p-3">Opening</th><th className="p-3">Handovers</th><th className="p-3">Closing</th><th className="p-3">Venue view</th></tr></thead><tbody>{facilities.map((venue) => <tr key={venue.id} className="border-t"><td className="p-3 font-semibold">{venue.name}</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3">—</td><td className="p-3"><Link className="font-semibold text-[#155ca7]" href={`/facilities/facilities-directory/${venue.id}?tab=handover`}>Open handovers</Link></td></tr>)}</tbody></table></div>)}
    </section>
    <FacilityFormBlueprint sections={["handover", "procedures", "weekly", "monthly"]} />
  </div>;
}
