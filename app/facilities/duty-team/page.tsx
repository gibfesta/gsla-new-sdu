import { CalendarDays, Info, ShieldCheck, UsersRound } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

export default function DutyTeamPage() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Duty Team" description="Select the people on duty for Shift Black, Shift Grey and Shift White." />

      <div className="flex items-start gap-3 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><p><strong>Page preview.</strong> Staff records and the duty rota are not connected. No shift staff have been selected and no assignments can be saved yet.</p></div>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="duty-team-heading">
        <div className="flex items-start gap-3"><UsersRound size={25} className="mt-0.5 text-[#155ca7]" aria-hidden="true" /><div><h2 id="duty-team-heading" className="text-xl font-bold">Duty shifts</h2><p className="mt-1 text-sm text-[#60799f]">Select duty cover for each shift. Venue Centre Manager changes are managed separately.</p></div></div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {["Shift Black", "Shift Grey", "Shift White"].map((shift) => <div key={shift} className="rounded-xl border border-[#d5e4f6] bg-[#f8fbff] p-4">
            <label htmlFor={shift.toLowerCase().replace(" ", "-")} className="block text-sm font-semibold">{shift}</label>
            <p className="mt-1 text-xs text-[#60799f]">No one selected</p>
            <select id={shift.toLowerCase().replace(" ", "-")} disabled defaultValue="" className="mt-4 min-h-11 w-full cursor-not-allowed rounded-lg border border-[#cfdff2] bg-white px-3 text-sm text-[#60799f]"><option value="">Staff directory not connected</option></select>
          </div>)}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e5edf8] pt-5"><button type="button" disabled className="cursor-not-allowed rounded-lg bg-[#7c9cbe] px-4 py-2.5 text-sm font-semibold text-white">Save duty team — not connected</button><p className="text-xs text-[#60799f]">The eventual record should include the duty date, shift, assigned staff and who made the change.</p></div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#d5e4f6] bg-white p-4"><CalendarDays size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="mt-2 font-semibold">Daily selection</h2><p className="mt-1 text-sm text-[#60799f]">The selected staff will appear against the correct shift and date when the rota is connected.</p></div><div className="rounded-xl border border-[#d5e4f6] bg-white p-4"><ShieldCheck size={21} className="text-[#155ca7]" aria-hidden="true" /><h2 className="mt-2 font-semibold">Accountable changes</h2><p className="mt-1 text-sm text-[#60799f]">Changes should retain who selected or replaced the shift cover and when.</p></div></div>
    </div>
  );
}
