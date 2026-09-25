import Link from "next/link";
import { ArrowLeft, CalendarDays, ListChecks } from "lucide-react";

export default function TimesheetsSettingsPage() {
  return (
    <div className="space-y-4">
      <Link href="/human-resources/timesheets" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline"><ArrowLeft size={16} aria-hidden="true" />Back to Timesheets</Link>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><CalendarDays size={22} aria-hidden="true" /></span><h2 className="text-xl font-bold">Week Rules</h2></div>
          <dl className="mt-5 divide-y divide-[#e5edf8] text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-[#60799f]">Payroll week</dt><dd className="font-semibold">Saturday to Saturday</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-[#60799f]">Facility submission</dt><dd className="text-right font-semibold">One Centre Manager approval</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-[#60799f]">After Accounts lock</dt><dd className="text-right font-semibold">Adjustments only</dd></div>
          </dl>
        </section>
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><ListChecks size={22} aria-hidden="true" /></span><h2 className="text-xl font-bold">Reason Codes</h2></div>
          <p className="mt-4 text-sm text-[#60799f]">These codes will be editable once timesheet settings are connected.</p>
          <div className="mt-4 flex flex-wrap gap-2">{["As rota", "Rota change", "Overtime", "Sick cover", "Sick leave", "Annual leave", "Unpaid leave", "Other"].map((reason) => <span key={reason} className="rounded-lg border border-[#d5e4f6] bg-[#f8fbff] px-3 py-2 text-sm font-medium">{reason}</span>)}</div>
        </section>
      </div>
    </div>
  );
}
