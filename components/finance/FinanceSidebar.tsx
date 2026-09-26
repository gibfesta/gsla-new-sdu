"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, BarChart3, Building2, CircleHelp, ClipboardCheck, CreditCard,
  FileText, Landmark, LayoutDashboard, LockKeyhole, ReceiptText, Settings,
  Wallet, type LucideIcon,
} from "lucide-react";

type Entry = { label: string; icon: LucideIcon; href?: string };
const groups: { title: string; entries: Entry[] }[] = [
  { title: "Overview", entries: [
    { label: "Finance Dashboard", icon: LayoutDashboard, href: "/finance/dashboard" },
  ] },
  { title: "Financial Management", entries: [
    { label: "Budgets", icon: Wallet },
    { label: "Expenditure", icon: CreditCard },
    { label: "Purchase Requests", icon: ClipboardCheck },
  ] },
  { title: "Accounts & Records", entries: [
    { label: "Invoices", icon: ReceiptText },
    { label: "Suppliers", icon: Building2 },
    { label: "Documents", icon: FileText },
  ] },
  { title: "Reporting & Admin", entries: [
    { label: "Reports", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ] },
];

export default function FinanceSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[266px] lg:overflow-y-auto">
      <div className="px-4 py-5 lg:px-5">
        <Link href="/finance/dashboard" className="inline-flex w-fit items-center" aria-label="GSLA Finance home"><Image src="/gsla-white.png" alt="GSLA" width={600} height={279} className="h-auto w-[180px]" priority /></Link>
        <p className="mt-1 text-sm leading-5 text-blue-100">Clear budgets.<br />Better decisions.<br />Stronger accountability.</p>
        <nav aria-label="Finance navigation" className="mt-5 space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h3>
              <div className="space-y-0.5">
                {group.entries.map(({ label, icon: Icon, href }) => {
                  const active = href === pathname;
                  const className = `flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : href ? "text-blue-50 hover:bg-white/10" : "text-blue-200/65"}`;
                  const content = <><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{label}</span></>;
                  return href ? <Link key={label} href={href} className={className} aria-current={active ? "page" : undefined}>{content}</Link>
                    : <span key={label} className={className} aria-disabled="true" title="Coming soon">{content}</span>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 border-t border-blue-300/30 pt-3">
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Admin</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" aria-disabled="true" title="Coming soon"><CircleHelp size={19} aria-hidden="true" />Help</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100"><LockKeyhole size={16} className="shrink-0" aria-hidden="true" />Finance workflows and records are not connected yet. Unavailable sections are shown but cannot be opened.</p>
        <p className="mt-3 flex items-center gap-2 px-2 text-xs text-blue-200"><Landmark size={14} aria-hidden="true" />GSLA Finance workspace</p>
      </div>
    </aside>
  );
}
