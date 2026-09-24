import Link from "next/link";
import {
  ArrowRight, Building2, CalendarDays, CheckCircle2, ClipboardCheck,
  Info, TriangleAlert, UsersRound,
  type LucideIcon,
} from "lucide-react";

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

type Metric = { label: string; value: string; detail: string; icon: LucideIcon; iconStyle: string };
const metrics: Metric[] = [
  { label: "Total Facilities", value: "6", detail: "Directory demo venues", icon: Building2, iconStyle: "bg-blue-50 text-blue-700" },
  { label: "Operational", value: "5", detail: "Operating normally", icon: CheckCircle2, iconStyle: "bg-emerald-50 text-emerald-700" },
  { label: "Limited Access", value: "1", detail: "Partially open or restricted", icon: TriangleAlert, iconStyle: "bg-amber-50 text-amber-700" },
  { label: "Open Issues", value: "—", detail: "Live data not connected", icon: TriangleAlert, iconStyle: "bg-rose-50 text-rose-700" },
  { label: "Today's Events", value: "—", detail: "Live data not connected", icon: CalendarDays, iconStyle: "bg-blue-50 text-blue-700" },
];

function SummaryCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <article className="relative min-h-36 overflow-hidden rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#174a84]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#35557f]">{metric.label}</h2>
          <p className="mt-2 text-4xl font-bold leading-none text-[#102b59]">{metric.value}</p>
          <p className="mt-2 text-xs leading-4 text-[#657da5]">{metric.detail}</p>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${metric.iconStyle}`}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
      </div>
    </article>
  );
}

function EmptyFeed({ title }: { title: string }) {
  return <p className="rounded-xl border border-dashed border-[#d4e2f2] bg-[#f8fbff] px-4 py-6 text-sm leading-5 text-[#617796]">{title} will appear here when this data is connected.</p>;
}

export default function FacilitiesDashboard() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Facilities Dashboard</h1>
              <span className="rounded-lg border border-blue-300/70 bg-white/10 px-4 py-2 text-sm">Facilities Manager Overview</span>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">Monitor all GSLA venues at a glance. Less typing, faster navigation, more time in venues.</p>
          </div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Safe venues<br />Stronger communities</p>
        </div>
      </section>

      <section aria-label="Facilities summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => <SummaryCard key={metric.label} metric={metric} />)}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)]">
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

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="alerts-heading">
            <div className="flex items-center justify-between gap-3"><h2 id="alerts-heading" className="text-lg font-bold">Priority Alerts</h2><TriangleAlert size={20} className="text-[#e27b4c]" aria-hidden="true" /></div>
            <div className="mt-4"><EmptyFeed title="Live priority alerts" /></div>
          </section>
          <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="today-heading">
            <h2 id="today-heading" className="text-lg font-bold">Today Across All Venues</h2>
            <div className="mt-3 divide-y divide-[#e5edf8]">
              {[
                { label: "Total events", icon: CalendarDays },
                { label: "Expected participants", icon: UsersRound },
                { label: "Tasks due today", icon: ClipboardCheck },
              ].map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-4 py-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={21} aria-hidden="true" /></span><span className="text-2xl font-bold text-[#7890ad]">—</span><span className="text-sm text-[#526f98]">{label}<span className="block text-xs">Live data not connected</span></span></div>)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
