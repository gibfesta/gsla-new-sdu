import {
  BarChart3, Building2, ClipboardCheck, CreditCard, FileText,
  Landmark, PoundSterling, ReceiptText, type LucideIcon,
} from "lucide-react";

type Metric = { label: string; icon: LucideIcon; detail: string };
const metrics: Metric[] = [
  { label: "Annual Budget", icon: PoundSterling, detail: "Budget data not connected" },
  { label: "Expenditure to Date", icon: CreditCard, detail: "Spend data not connected" },
  { label: "Pending Invoices", icon: ReceiptText, detail: "Invoice data not connected" },
  { label: "Purchase Requests", icon: ClipboardCheck, detail: "Request data not connected" },
];

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-8 text-center text-sm leading-6 text-[#637da2]">{children}</div>;
}

export default function FinanceDashboard() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Finance Department</p><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl">Finance Dashboard</h1><p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">One place for budgets, expenditure, invoices and purchasing as the finance workspace is connected.</p></div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Clear finances<br />Confident decisions</p>
        </div>
      </section>

      <section aria-label="Finance overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, detail, icon: Icon }) => (
          <article key={label} className="flex min-h-32 items-start gap-4 rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eaf2fc] text-[#174a84]"><Icon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
            <div><h2 className="text-sm font-semibold text-[#35557f]">{label}</h2><p className="mt-1 text-3xl font-bold text-[#102b59]">—</p><p className="mt-1 text-xs text-[#637da2]">{detail}</p></div>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="budget-heading">
          <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><BarChart3 size={22} aria-hidden="true" /></span><div><h2 id="budget-heading" className="text-xl font-bold">Budget Overview</h2><p className="mt-1 text-sm text-[#60799f]">Allocation and spend across GSLA departments.</p></div></div>
          <div className="mt-5"><EmptyState>Budget and expenditure figures will appear here when finance data is connected.</EmptyState></div>
        </section>
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="approvals-heading">
          <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><ClipboardCheck size={22} aria-hidden="true" /></span><div><h2 id="approvals-heading" className="text-xl font-bold">Approvals & Payments</h2><p className="mt-1 text-sm text-[#60799f]">Requests and invoices needing attention.</p></div></div>
          <div className="mt-5"><EmptyState>Pending requests and invoices will appear here when those workflows are available.</EmptyState></div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="activity-heading"><h2 id="activity-heading" className="text-xl font-bold">Recent Finance Activity</h2><p className="mt-1 text-sm text-[#60799f]">Changes to budgets, purchases and invoices.</p><div className="mt-5"><EmptyState>Activity will appear here once finance records and an audit trail are connected.</EmptyState></div></section>
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="workspace-heading">
          <h2 id="workspace-heading" className="text-xl font-bold">Finance Workspace</h2><p className="mt-1 text-sm text-[#60799f]">Sections planned for this department.</p>
          <div className="mt-4 divide-y divide-[#e5edf8]">
            {[
              { label: "Budgets & expenditure", icon: Landmark },
              { label: "Invoices & suppliers", icon: Building2 },
              { label: "Purchase requests", icon: ClipboardCheck },
              { label: "Financial reports", icon: FileText },
            ].map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 py-3 text-sm"><Icon size={19} className="text-[#174a84]" aria-hidden="true" /><span className="font-medium">{label}</span><span className="ml-auto rounded-full bg-[#eef5fd] px-2.5 py-1 text-xs text-[#526f98]">Planned</span></div>)}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="finance-actions-heading">
        <div className="flex flex-wrap items-center gap-3"><h2 id="finance-actions-heading" className="mr-auto text-lg font-bold">Quick Actions</h2>
          {[
            { label: "Create Budget", icon: PoundSterling },
            { label: "Add Expenditure", icon: CreditCard },
            { label: "New Invoice", icon: ReceiptText },
            { label: "Purchase Request", icon: ClipboardCheck },
          ].map(({ label, icon: Icon }) => <span key={label} className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-[#d5e4f6] bg-[#f8fbff] px-4 text-sm text-[#7890ad]" aria-disabled="true" title="Coming soon"><Icon size={20} aria-hidden="true" />{label}</span>)}
        </div>
        <p className="mt-4 border-t border-[#e5edf8] pt-4 text-xs text-[#637da2]">Finance pages and permissions will be enabled as the underlying workflows are built. No sample amounts are presented as live data.</p>
      </section>
    </div>
  );
}
