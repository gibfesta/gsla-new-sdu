import Link from "next/link";
import {
  ArrowRight, Building2, CheckCircle2, ClipboardCheck,
  Clock3, FileText, Info, TriangleAlert,
} from "lucide-react";
import { facilitiesVenues } from "@/components/facilities/venues";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

// Illustrative states for the visual preview only. Venue checklists are currently
// local page state, so no department-wide status can be calculated from them yet.
const exampleDay = [
  { id: "fac-001", opening: "Complete · 08:05", openingTone: "good", handover: "Received", closing: "Not started", attention: "None" },
  { id: "fac-002", opening: "Complete · 08:12", openingTone: "good", handover: "Received", closing: "Not started", attention: "None" },
  { id: "fac-003", opening: "Complete · 08:20", openingTone: "good", handover: "Awaiting", closing: "Not started", attention: "Handover due" },
  { id: "fac-004", opening: "Check outstanding", openingTone: "alert", handover: "Received", closing: "Not started", attention: "Pool plant check" },
  { id: "fac-005", opening: "Complete · 08:18", openingTone: "good", handover: "Received", closing: "Not started", attention: "None" },
  { id: "fac-006", opening: "Scheduled · 09:00", openingTone: "waiting", handover: "Not due", closing: "Not started", attention: "None" },
] as const;

const tones = {
  good: "bg-emerald-50 text-emerald-800",
  alert: "bg-rose-50 text-rose-800",
  waiting: "bg-amber-50 text-amber-800",
} as const;

export default function FacilitiesDailyOperationsPage() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Daily Operations" description="See which venues have opened, what needs attention and whether handovers and closing checks are on track." />

      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]">
        <Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" />
        <p><strong>Illustrative day — not a live status board.</strong> The times and statuses below are examples, not today&apos;s venue reports. Venue checklists and handovers are not yet connected to this department view.</p>
      </div>

      <section aria-label="Example day summary" className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Building2, label: "Venues in view", value: "6", detail: "Example directory" },
          { icon: CheckCircle2, label: "Opening complete", value: "4", detail: "Illustrative statuses" },
          { icon: TriangleAlert, label: "Needs attention", value: "2", detail: "Illustrative exceptions" },
        ].map(({ icon: Icon, label, value, detail }) => <div key={label} className="rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between"><p className="text-sm font-semibold text-[#35557f]">{label}</p><Icon size={23} className="text-[#155ca7]" aria-hidden="true" /></div>
          <p className="mt-2 text-3xl font-bold text-[#102b59]">{value}</p><p className="mt-1 text-xs text-[#617796]">{detail}</p>
        </div>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d5e4f6] bg-white shadow-sm" aria-labelledby="venue-status-heading">
        <div className="flex flex-wrap items-start justify-between gap-3 p-5">
          <div><h2 id="venue-status-heading" className="text-xl font-bold">Opening, handover &amp; closing</h2><p className="mt-1 text-sm text-[#60799f]">One line per venue; Centre Managers will complete actual checks in their venue workspace once connected.</p></div>
          <span className="rounded-lg bg-[#eef5fd] px-3 py-2 text-xs font-semibold text-[#35557f]">Example day preview</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#eef5fd] text-xs text-[#35557f]"><tr><th scope="col" className="px-5 py-3">Venue</th><th scope="col" className="px-4 py-3">Opening</th><th scope="col" className="px-4 py-3">Handover</th><th scope="col" className="px-4 py-3">Closing</th><th scope="col" className="px-4 py-3">Attention</th><th scope="col" className="px-4 py-3">Venue view</th></tr></thead>
            <tbody>{facilitiesVenues.map((venue) => {
              const example = exampleDay.find((item) => item.id === venue.id);
              if (!example) return null;
              return <tr key={venue.id} className="border-t border-[#e5edf8]">
                <td className="px-5 py-4 font-semibold">{venue.name}<span className="mt-1 block text-xs font-normal text-[#60799f]">{venue.type}</span></td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${tones[example.openingTone]}`}>{example.opening}</span></td>
                <td className="px-4 py-4 text-[#526f98]">{example.handover}</td>
                <td className="px-4 py-4 text-[#526f98]">{example.closing}</td>
                <td className={`px-4 py-4 ${example.attention === "None" ? "text-[#60799f]" : "font-semibold text-rose-700"}`}>{example.attention}</td>
                <td className="px-4 py-4"><Link href={`/facilities/facilities-directory/${venue.id}?tab=procedures`} className="inline-flex items-center gap-1 font-semibold text-[#155ca7] hover:underline">Open venue <ArrowRight size={15} aria-hidden="true" /></Link></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><ClipboardCheck size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="text-lg font-bold">What this page will flag</h2></div><p className="mt-3 text-sm leading-6 text-[#60799f]">Overdue opening or closing checks, missing handovers and exceptions that need department attention. These alerts require connected records and agreed permissions.</p></section>
        <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><FileText size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="text-lg font-bold">Procedures are separate</h2></div><p className="mt-3 text-sm leading-6 text-[#60799f]">The department keeps the approved instructions and templates; each venue completes the daily checklist.</p><Link href="/facilities/procedures-&-sop" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">View Procedures &amp; SOPs <ArrowRight size={15} aria-hidden="true" /></Link></section>
      </div>
      <p className="flex items-center gap-2 text-xs text-[#60799f]"><Clock3 size={14} aria-hidden="true" />Live timestamps will appear once venue updates are stored and shared.</p>
    </div>
  );
}
