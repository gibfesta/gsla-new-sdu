"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ClipboardCheck, Clock3, FileText, Info, LayoutGrid, List,
} from "lucide-react";
import { facilitiesVenues } from "@/components/facilities/venues";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

// Illustrative states for the visual preview only. Venue checklists are currently
// local page state, so no department-wide status can be calculated from them yet.
const exampleDay = [
  { id: "fac-001", opening: "Complete · 08:05", openingTone: "good", amHandover: "Received", pmHandover: "Not due", closing: "Not started", attention: "None" },
  { id: "fac-002", opening: "Complete · 08:12", openingTone: "good", amHandover: "Received", pmHandover: "Not due", closing: "Not started", attention: "None" },
  { id: "fac-003", opening: "Complete · 08:20", openingTone: "good", amHandover: "Awaiting", pmHandover: "Not due", closing: "Not started", attention: "AM handover due" },
  { id: "fac-004", opening: "Check outstanding", openingTone: "alert", amHandover: "Received", pmHandover: "Not due", closing: "Not started", attention: "Pool plant check" },
  { id: "fac-005", opening: "Complete · 08:18", openingTone: "good", amHandover: "Received", pmHandover: "Not due", closing: "Not started", attention: "None" },
  { id: "fac-006", opening: "Scheduled · 09:00", openingTone: "waiting", amHandover: "Not due", pmHandover: "Not due", closing: "Not started", attention: "None" },
] as const;

const tones = {
  good: "bg-emerald-50 text-emerald-800",
  alert: "bg-rose-50 text-rose-800",
  waiting: "bg-amber-50 text-amber-800",
} as const;

export default function FacilitiesDailyOperationsPage() {
  const [view, setView] = useState<"cards" | "list">("list");
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Daily Operations" description="See which venues have opened, what needs attention and whether handovers and closing checks are on track." />

      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]">
        <Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" />
        <p><strong>Illustrative day — not a live status board.</strong> The times and statuses below are examples, not today&apos;s venue reports. Venue checklists and handovers are not yet connected to this department view.</p>
      </div>

      <section aria-labelledby="venue-status-heading">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div><h2 id="venue-status-heading" className="text-xl font-bold">Opening, AM &amp; PM handovers, closing</h2><p className="mt-1 text-sm text-[#60799f]">One venue per record; Centre Managers will complete actual checks in their venue workspace once connected.</p></div>
          <div className="flex items-center gap-1" role="group" aria-label="Daily Operations view">
            <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "cards" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><LayoutGrid size={16} aria-hidden="true" />Card view</button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "list" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><List size={16} aria-hidden="true" />List view</button>
          </div>
        </div>
        {view === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {facilitiesVenues.map((venue) => {
              const example = exampleDay.find((item) => item.id === venue.id);
              if (!example) return null;
              return <article key={venue.id} className="flex flex-col rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold">{venue.name}</h3><p className="mt-1 text-sm text-[#60799f]">{venue.type}</p>
                <dl className="mt-4 space-y-3 border-t border-[#e5edf8] pt-4 text-sm">
                  <div className="flex items-center justify-between gap-3"><dt className="text-[#60799f]">Opening</dt><dd className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${tones[example.openingTone]}`}>{example.opening}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-[#60799f]">AM handover</dt><dd className="font-medium text-[#35557f]">{example.amHandover}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-[#60799f]">PM handover</dt><dd className="font-medium text-[#35557f]">{example.pmHandover}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-[#60799f]">Closing</dt><dd className="font-medium text-[#35557f]">{example.closing}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-[#60799f]">Attention</dt><dd className={example.attention === "None" ? "text-[#60799f]" : "font-semibold text-rose-700"}>{example.attention}</dd></div>
                </dl>
                <Link href={`/facilities/facilities-directory/${venue.id}?tab=handover`} className="mt-5 inline-flex items-center gap-1 self-start font-semibold text-[#155ca7] hover:underline">Open handovers <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>;
            })}
          </div>
        ) : (
        <div className="overflow-hidden rounded-2xl border border-[#d5e4f6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="gsla-data-table w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#eef5fd] text-xs text-[#35557f]"><tr><th scope="col" className="px-5 py-3">Venue</th><th scope="col" className="px-4 py-3">Opening</th><th scope="col" className="px-4 py-3">AM handover</th><th scope="col" className="px-4 py-3">PM handover</th><th scope="col" className="px-4 py-3">Closing</th><th scope="col" className="px-4 py-3">Attention</th><th scope="col" className="px-4 py-3">Venue view</th></tr></thead>
            <tbody>{facilitiesVenues.map((venue) => {
              const example = exampleDay.find((item) => item.id === venue.id);
              if (!example) return null;
              return <tr key={venue.id} className="border-t border-[#e5edf8]">
                <td className="px-5 py-4 font-semibold">{venue.name}<span className="mt-1 block text-xs font-normal text-[#60799f]">{venue.type}</span></td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${tones[example.openingTone]}`}>{example.opening}</span></td>
                <td className="px-4 py-4 text-[#526f98]">{example.amHandover}</td>
                <td className="px-4 py-4 text-[#526f98]">{example.pmHandover}</td>
                <td className="px-4 py-4 text-[#526f98]">{example.closing}</td>
                <td className={`px-4 py-4 ${example.attention === "None" ? "text-[#60799f]" : "font-semibold text-rose-700"}`}>{example.attention}</td>
                <td className="px-4 py-4"><Link href={`/facilities/facilities-directory/${venue.id}?tab=handover`} className="inline-flex items-center gap-1 font-semibold text-[#155ca7] hover:underline">Open handovers <ArrowRight size={15} aria-hidden="true" /></Link></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><ClipboardCheck size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="text-lg font-bold">What this page will flag</h2></div><p className="mt-3 text-sm leading-6 text-[#60799f]">Overdue opening or closing checks, missing handovers and exceptions that need department attention. These alerts require connected records and agreed permissions.</p></section>
        <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><FileText size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="text-lg font-bold">Procedures are separate</h2></div><p className="mt-3 text-sm leading-6 text-[#60799f]">The department keeps the approved instructions and templates; each venue completes the daily checklist.</p><Link href="/facilities/procedures-&-sop" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">View Procedures &amp; SOPs <ArrowRight size={15} aria-hidden="true" /></Link></section>
      </div>
      <p className="flex items-center gap-2 text-xs text-[#60799f]"><Clock3 size={14} aria-hidden="true" />Live timestamps will appear once venue updates are stored and shared.</p>
    </div>
  );
}
