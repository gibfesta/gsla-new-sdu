import Link from "next/link";
import { ArrowRight, Building2, Info, UserRoundCog } from "lucide-react";
import { facilitiesVenues } from "@/components/facilities/venues";

export default function CentreManagerAssignmentsPage() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities · Staffing & Cover</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Centre Manager Assignments</h1>
        <p className="mt-3 max-w-3xl text-blue-50">See each venue&apos;s usual Centre Manager and arrange temporary cover when someone needs to work at another venue.</p>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><p><strong>Page preview.</strong> Centre Manager records and permissions are not connected. No names or existing assignments have been inferred from demonstration venue data; no changes can be saved here yet.</p></div>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="cover-heading">
        <div className="flex items-start gap-3"><UserRoundCog size={25} className="mt-0.5 text-[#155ca7]" aria-hidden="true" /><div><h2 id="cover-heading" className="text-xl font-bold">Arrange temporary venue cover</h2><p className="mt-1 text-sm text-[#60799f]">For example, assign a Centre Manager to cover a different venue for a defined period, then return to the usual assignment.</p></div></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Venue to cover<select defaultValue="" className="mt-1 min-h-11 w-full rounded-lg border border-[#cfdff2] bg-white px-3 text-sm font-normal text-[#112d56]"><option value="">Choose a venue</option>{facilitiesVenues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select></label>
          <label className="text-sm font-semibold">Covering Centre Manager<select disabled defaultValue="" className="mt-1 min-h-11 w-full cursor-not-allowed rounded-lg border border-[#cfdff2] bg-[#f8fbff] px-3 text-sm font-normal text-[#60799f]"><option value="">Staff directory not connected</option></select></label>
          <label className="text-sm font-semibold">Cover starts<input type="date" className="mt-1 min-h-11 w-full rounded-lg border border-[#cfdff2] bg-white px-3 text-sm font-normal text-[#112d56]" /></label>
          <label className="text-sm font-semibold">Cover ends<input type="date" className="mt-1 min-h-11 w-full rounded-lg border border-[#cfdff2] bg-white px-3 text-sm font-normal text-[#112d56]" /></label>
          <label className="text-sm font-semibold sm:col-span-2">Reason or handover note<textarea rows={3} placeholder="Brief reason for cover and handover details" className="mt-1 w-full rounded-lg border border-[#cfdff2] bg-white px-3 py-2 text-sm font-normal text-[#112d56]" /></label>
        </div>
        <div className="mt-5 border-t border-[#e5edf8] pt-5"><button type="button" disabled className="cursor-not-allowed rounded-lg bg-[#7c9cbe] px-4 py-2.5 text-sm font-semibold text-white">Save cover assignment — not connected</button></div>
      </section>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="assignment-heading">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="assignment-heading" className="text-xl font-bold">Venues &amp; assignments</h2><p className="mt-1 text-sm text-[#60799f]">The usual manager and any active temporary cover will appear here once staff records are connected.</p></div><Link href="/facilities/facilities" className="inline-flex items-center gap-1 text-sm font-semibold text-[#155ca7] hover:underline">Facilities Directory <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{facilitiesVenues.map((venue) => <div key={venue.id} className="rounded-xl border border-[#d5e4f6] bg-[#f8fbff] p-4"><div className="flex items-start gap-2"><Building2 size={19} className="shrink-0 text-[#155ca7]" aria-hidden="true" /><h3 className="text-sm font-semibold">{venue.name}</h3></div><p className="mt-3 text-xs text-[#60799f]">Usual CM: Not connected</p><p className="mt-1 text-xs text-[#60799f]">Temporary cover: Not connected</p></div>)}</div>
      </section>
    </div>
  );
}
