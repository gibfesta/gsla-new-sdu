"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, BarChart3, Building2, CalendarDays, CircleHelp, FileText,
  LockKeyhole, Settings, ShieldCheck, UsersRound, Wrench, type LucideIcon,
} from "lucide-react";

type Item = { label: string; href: string; icon: LucideIcon; activeFor?: string[] };
const items: Item[] = [
  { label: "Facilities", href: "/facilities/dashboard", icon: Building2, activeFor: ["/facilities/facilities"] },
  { label: "CM Assignments", href: "/facilities/cm-assignments", icon: UsersRound },
  { label: "Shared Calendar", href: "/facilities/shared-calendar", icon: CalendarDays },
  { label: "Maintenance & Issues", href: "/facilities/maintenance", icon: Wrench },
  { label: "Compliance", href: "/facilities/compliance", icon: ShieldCheck },
  { label: "Procedures & SOPs", href: "/facilities/procedures", icon: FileText },
  { label: "Reports / History", href: "/facilities/reports", icon: BarChart3 },
];

export default function FacilitiesDepartmentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[286px] lg:overflow-y-auto">
      <div className="flex min-h-full flex-col px-4 py-5 lg:px-5">
        <Link href="/facilities/dashboard" className="inline-flex w-fit items-center" aria-label="GSLA Facilities department home"><Image src="/gsla-white.png" alt="GSLA" width={600} height={279} className="h-auto w-[180px]" priority /></Link>
        <p className="mt-1 text-sm text-blue-100">Shared Facilities Workspace</p>
        <p className="mt-1 text-xs leading-5 text-blue-200">Less typing. Faster navigation.<br />More time in venues.</p>
        <nav aria-label="Facilities department navigation" className="mt-7 space-y-1">
          {items.map(({ label, href, icon: Icon, activeFor }) => {
            const active = pathname === href || (activeFor?.includes(pathname) ?? false);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : "text-blue-50 hover:bg-white/10"}`}><Icon size={20} className="shrink-0" aria-hidden="true" />{label}</Link>;
          })}
        </nav>
        <div className="mt-8 border-t border-blue-300/30 pt-3 lg:mt-auto">
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Organisation</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon" aria-disabled="true"><CircleHelp size={19} aria-hidden="true" />Help</span>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon" aria-disabled="true"><Settings size={19} aria-hidden="true" />Settings</span>
          <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100"><LockKeyhole size={16} className="shrink-0" aria-hidden="true" />Department overview across venues. Editing access will follow account permissions.</p>
        </div>
      </div>
    </aside>
  );
}
