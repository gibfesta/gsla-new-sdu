import Link from "next/link";
import { ArrowRight, Building2, Info } from "lucide-react";

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
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Facilities Overview</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">Monitor all GSLA venues at a glance. Less typing, faster navigation, more time in venues.</p>
          </div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Safe venues<br />Stronger communities</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5" aria-labelledby="venues-heading">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="venues-heading" className="text-xl font-bold sm:text-2xl">All Facilities Overview</h2>
              <p className="mt-1 text-sm text-[#5e78a2]">The six demonstration venues from the Facilities Directory.</p>
            </div>
            <Link href="/facilities/facilities" className="inline-flex items-center gap-2 rounded-xl border border-[#d5e4f6] bg-[#f5f9ff] px-3 py-2 text-sm font-semibold text-[#155ca7] hover:bg-blue-50">
              <Building2 size={17} aria-hidden="true" /> View Facilities Directory
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-0 text-left text-sm">
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
                    <Link href={venue.id === "fac-001" ? `/facilities/facilities/${venue.id}` : "/facilities/facilities"} className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#b8d4f5] px-3 py-2 text-xs font-semibold text-[#155ca7] hover:bg-blue-50">
                      {venue.id === "fac-001" ? "Open Facility" : "View Directory"} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-[#657da5]"><Info size={15} aria-hidden="true" />The detailed workspace currently demonstrates Europa Sports Complex; other venues open from the directory as that work is completed.</p>
      </section>
    </div>
  );
}
