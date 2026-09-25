import Link from "next/link";
import { ArrowRight, Building2, Info, type LucideIcon } from "lucide-react";
import { facilitiesVenues } from "./venues";

type ModuleProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  statusLabel: string;
  emptyMessage: string;
  venueAction?: string;
  venueTab?: string;
};

export default function FacilitiesDepartmentModule({ eyebrow, title, description, icon: Icon, statusLabel, emptyMessage, venueAction, venueTab }: ModuleProps) {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities · {eyebrow}</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">{description}</p></div><p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">All venues<br />One workspace</p></div>
      </section>
      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="module-overview"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><Icon size={25} aria-hidden="true" /></span><div><h2 id="module-overview" className="text-xl font-bold">Department Overview</h2><p className="text-sm text-[#60799f]">{statusLabel}</p></div></div><p className="mt-5 rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-8 text-sm leading-6 text-[#637da2]">{emptyMessage}</p></section>
      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="venue-list-heading"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="venue-list-heading" className="text-xl font-bold">Venues</h2><p className="mt-1 text-sm text-[#60799f]">The six demonstration venues from the Facilities Directory.</p></div><Link href="/facilities/facilities" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline">Open Facilities Directory <ArrowRight size={16} aria-hidden="true" /></Link></div><div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{facilitiesVenues.map((venue) => <div key={venue.id} className="rounded-xl border border-[#d5e4f6] p-4"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Building2 size={20} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold">{venue.name}</h3><p className="mt-1 text-xs text-[#637da2]">{venue.type}</p></div></div><p className="mt-3 text-xs text-[#637da2]">{statusLabel}</p>{venueAction && <Link href={`/facilities/facilities/${venue.id}${venueTab ? `?tab=${venueTab}` : ""}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#155ca7] hover:underline">{venueAction} <ArrowRight size={14} aria-hidden="true" /></Link>}</div>)}</div></section>
      <p className="flex items-start gap-2 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-xs leading-5 text-[#35557f]"><Info size={17} className="shrink-0 text-[#155ca7]" aria-hidden="true" />These department pages provide the structure for cross-venue work. Live records and management actions need a connected data source and permission checks.</p>
    </div>
  );
}
