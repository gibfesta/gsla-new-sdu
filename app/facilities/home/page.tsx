"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Info, LayoutGrid, List } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

// Matches the demonstration venues in the current Facilities Directory.
// Replace this together with that directory when live venue data is connected.
const venues = [
  { id: "fac-001", name: "Europa Sports Complex", type: "Sports Centre", status: "Operational" },
  { id: "fac-002", name: "Bayside Sports Complex", type: "Sports Centre", status: "Operational" },
  { id: "fac-003", name: "Lathbury Sports Complex", type: "Sports Centre", status: "Operational" },
  { id: "fac-004", name: "Lathbury Pool", type: "Aquatic Centre", status: "Limited Access" },
  { id: "fac-005", name: "GASA Pool", type: "Aquatic Centre", status: "Operational" },
  { id: "fac-006", name: "Parks", type: "Outdoor Recreation", status: "Operational" },
] as const;

export default function FacilitiesDashboard() {
  const [view, setView] = useState<"cards" | "list">("list");
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Facilities Overview" description="Monitor all GSLA venues at a glance. Less typing, faster navigation, more time in venues." />

      <section className="overflow-hidden rounded-2xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5" aria-labelledby="venues-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="venues-heading" className="text-xl font-bold sm:text-2xl">All Facilities Overview</h2>
              <p className="mt-1 text-sm text-[#5e78a2]">The six demonstration venues from the Facilities Directory.</p>
            </div>
            <div className="flex gap-1" role="group" aria-label="Facilities Overview view">
              <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "cards" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><LayoutGrid size={16} aria-hidden="true" />Card view</button>
              <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "list" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><List size={16} aria-hidden="true" />List view</button>
            </div>
          </div>
          {view === "cards" ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{venues.map((venue) => <article key={venue.id} className="rounded-xl border border-[#d5e4f6] p-5"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e8f2fe] text-[#225e9d]"><Building2 size={22} aria-hidden="true" /></span><div><h3 className="font-bold text-[#153763]">{venue.name}</h3><p className="mt-1 text-xs text-[#6680a5]">{venue.type}</p></div></div><span className={`mt-4 inline-flex rounded-lg px-2 py-1 text-xs font-medium ${venue.status === "Operational" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{venue.status}</span><dl className="mt-4 space-y-2 border-t border-[#e5edf8] pt-4 text-sm">{["Open Issues", "Today's Events", "Weekly Tasks"].map((label) => <div key={label} className="flex justify-between gap-2"><dt className="text-[#60799f]">{label}</dt><dd className="text-[#7890ad]" title="Not connected">—</dd></div>)}</dl><Link href={venue.id === "fac-001" ? `/facilities/facilities-directory/${venue.id}` : "/facilities/facilities-directory"} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#b8d4f5] px-3 py-2 text-xs font-semibold text-[#155ca7] hover:bg-blue-50">{venue.id === "fac-001" ? "Open Facility" : "View Directory"} <ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div> : <div className="mt-5 overflow-x-auto">
            <table className="gsla-data-table w-full min-w-[700px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-[#eef5fd] text-xs font-semibold text-[#35557f]"><tr>
                <th className="rounded-l-lg px-3 py-3">Facility</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Open Issues</th><th className="px-3 py-3">Today&apos;s Events</th><th className="px-3 py-3">Weekly Tasks</th><th className="rounded-r-lg px-3 py-3">Actions</th>
              </tr></thead>
              <tbody>{venues.map((venue) => (
                <tr key={venue.id} className="border-b border-[#e5edf8]">
                  <td className="border-b border-[#e5edf8] px-3 py-3">
                    <div className="flex items-center gap-3"><span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e8f2fe] text-[#225e9d]"><Building2 size={22} aria-hidden="true" /></span><span><strong className="block text-[#153763]">{venue.name}</strong><span className="text-xs text-[#6680a5]">{venue.type}</span></span></div>
                  </td>
                  <td className="border-b border-[#e5edf8] px-3 py-3"><span className={`inline-flex whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium ${venue.status === "Operational" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{venue.status}</span></td>
                  <td className="border-b border-[#e5edf8] px-3 py-3 text-[#7890ad]" title="Not connected">—</td>
                  <td className="border-b border-[#e5edf8] px-3 py-3 text-[#7890ad]" title="Not connected">—</td>
                  <td className="border-b border-[#e5edf8] px-3 py-3 text-[#7890ad]" title="Not connected">—</td>
                  <td className="border-b border-[#e5edf8] px-3 py-3">
                    <Link href={venue.id === "fac-001" ? `/facilities/facilities-directory/${venue.id}` : "/facilities/facilities-directory"} className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#b8d4f5] px-3 py-2 text-xs font-semibold text-[#155ca7] hover:bg-blue-50">
                      {venue.id === "fac-001" ? "Open Facility" : "View Directory"} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          }
          <p className="mt-4 flex items-center gap-2 text-xs text-[#657da5]"><Info size={15} aria-hidden="true" />The detailed workspace currently demonstrates Europa Sports Complex; other venues open from the directory as that work is completed.</p>
      </section>
    </div>
  );
}
