"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Info, LayoutGrid, List, type LucideIcon } from "lucide-react";
import { useSavedFacilities } from "./useSavedFacilities";
import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";
import { FacilityFormBlueprint, type FacilityFormSection } from "./FacilityFormBlueprint";

export type DepartmentTab = {
  label: string;
  description: string;
  emptyMessage: string;
  venueAction: string;
  venueTab: string;
};

type ModuleProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  statusLabel: string;
  emptyMessage: string;
  venueAction?: string;
  venueTab?: string;
  tabs?: DepartmentTab[];
};

export default function FacilitiesDepartmentModule({ title, description, icon: Icon, statusLabel, emptyMessage, venueAction, venueTab, tabs }: ModuleProps) {
  const { facilities: facilitiesVenues, loading, error } = useSavedFacilities();
  const [activeTab, setActiveTab] = useState(0);
  const [view, setView] = useState<"cards" | "list">("list");
  const sections = tabs?.length ? tabs : [{ label: "All Venues", description: "Saved facilities from the Facilities Directory.", emptyMessage, venueAction: venueAction ?? "Open venue", venueTab: venueTab ?? "" }];
  const section = sections[activeTab];
  const venueHref = (id: string) => `/facilities/facilities-directory/${id}${section.venueTab ? `?tab=${section.venueTab}` : ""}`;
  const formSections: FacilityFormSection[] = title === "Maintenance & Issues" ? ["issues", "maintenance"] : title === "Compliance" ? ["compliance"] : title === "Procedures & SOPs" ? ["procedures", "documents"] : title === "Reports / History" ? ["audit", "timeline"] : [];

  return <div className="space-y-4 text-[#112d56]">
    <FacilitiesDepartmentBanner title={title} description={description} />
    {formSections.some(item => ["issues", "maintenance", "compliance", "procedures", "documents"].includes(item)) && <div className="flex flex-wrap gap-3 rounded-2xl border border-[#d5e4f6] bg-white p-5"><Link className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white" href={`/facilities/forms?section=${title === "Compliance" ? "compliance" : title === "Procedures & SOPs" ? "sop" : "maintenance"}`}>Manage form templates</Link><Link className="rounded-xl border px-4 py-2 text-sm font-semibold" href={`/facilities/forms?section=${title === "Compliance" ? "compliance" : title === "Procedures & SOPs" ? "sop" : "issues"}&role=cm&mode=complete`}>Try Centre Manager forms</Link>{title === "Maintenance & Issues" && <Link className="rounded-xl border px-4 py-2 text-sm font-semibold" href="/facilities/forms?section=issues&mode=complete">Report an issue as FM</Link>}</div>}
    <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-0.5 shrink-0 text-[#155ca7]" aria-hidden="true" /><p><strong>{statusLabel}.</strong> {emptyMessage}</p></div>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav className="overflow-x-auto" aria-label={`${title} sections`}><div className="inline-flex min-w-max rounded-2xl bg-slate-100 p-1">{sections.map((item, index) => <button key={item.label} type="button" aria-current={activeTab === index ? "page" : undefined} onClick={() => setActiveTab(index)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === index ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"}`}>{item.label}</button>)}</div></nav>
      <div className="flex gap-1" role="group" aria-label={`${title} view`}><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "cards" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><LayoutGrid size={16} aria-hidden="true" />Card view</button><button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === "list" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><List size={16} aria-hidden="true" />List view</button></div>
    </div>

    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="department-section-heading">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><Icon size={22} aria-hidden="true" /></span><div><h2 id="department-section-heading" className="text-xl font-bold">{section.label}</h2><p className="mt-1 text-sm text-[#60799f]">{section.description}</p></div></div><Link href="/facilities/facilities-directory" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline">Facilities Directory <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <p className="mt-5 rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#637da2]">{section.emptyMessage}</p>
      {loading && <p className="mt-5 text-sm" role="status">Loading facilities...</p>}
      {error && <p className="mt-5 text-sm text-rose-700" role="alert">{error}</p>}
      {!loading && !error && !facilitiesVenues.length && <p className="mt-5 text-sm text-[#637da2]">No facilities have been saved yet.</p>}
      {!loading && !error && (view === "cards" ? <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{facilitiesVenues.map((venue) => <article key={venue.id} className="rounded-xl border border-[#d5e4f6] p-4"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Building2 size={20} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold">{venue.name}</h3><p className="mt-1 text-xs text-[#637da2]">{venue.type}</p></div></div><p className="mt-3 text-xs text-[#637da2]">{statusLabel}</p><Link href={venueHref(venue.id)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#155ca7] hover:underline">{section.venueAction} <ArrowRight size={14} aria-hidden="true" /></Link></article>)}</div> : <div className="mt-5 overflow-hidden rounded-xl border border-[#d5e4f6]" role="list" aria-label={`${section.label} by venue`}>{facilitiesVenues.map((venue) => <div key={venue.id} role="listitem" className="flex flex-wrap items-center gap-3 border-b border-[#e5edf8] px-4 py-3 last:border-b-0"><Building2 size={19} className="shrink-0 text-[#155ca7]" aria-hidden="true" /><div className="min-w-[190px] flex-1"><h3 className="text-sm font-semibold">{venue.name}</h3><p className="text-xs text-[#637da2]">{venue.type}</p></div><span className="text-xs text-[#637da2]">{statusLabel}</span><Link href={venueHref(venue.id)} className="inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">{section.venueAction} <ArrowRight size={14} aria-hidden="true" /></Link></div>)}</div>)}
    </section>
    {formSections.length > 0 && <FacilityFormBlueprint sections={formSections} />}
    <p className="flex items-start gap-2 text-xs leading-5 text-[#60799f]"><Info size={16} className="shrink-0" aria-hidden="true" />Live records and management actions need a connected data source and permission checks.</p>
  </div>;
}
