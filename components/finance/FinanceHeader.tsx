import { Search } from "lucide-react";

export default function FinanceHeader() {
  return (
    <header className="border-b border-[#e0e9f5] bg-white px-4 py-3 sm:px-6 lg:py-4">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-11 min-w-[220px] items-center gap-3 rounded-xl border border-[#cfdff2] px-4 text-sm text-[#64748b] shadow-sm sm:w-[450px]" aria-label="Finance search is coming soon">
          <Search size={19} className="text-[#174a84]" aria-hidden="true" />Search coming soon
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="rounded-xl border border-[#cfdff2] bg-white px-4 py-3 text-sm font-semibold text-[#16365f] shadow-sm">Finance Department</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315d90] text-sm font-bold text-white" aria-label="GSLA account">GS</span>
          <span className="hidden text-sm font-medium text-[#16365f] sm:inline">GSLA</span>
        </div>
      </div>
    </header>
  );
}
