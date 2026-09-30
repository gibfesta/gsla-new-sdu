"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, BarChart3, Building2, CalendarCheck2, CalendarDays,
  ClipboardCheck, FileText, LayoutDashboard, ShieldCheck, UserRoundCog,
  UsersRound, Wrench, type LucideIcon,
} from "lucide-react";

type Item = { label: string; href: string; icon: LucideIcon };
const groups: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [
    { label: "All Facilities Overview", href: "/facilities/home", icon: LayoutDashboard },
    { label: "Facilities Directory", href: "/facilities/facilities-directory", icon: Building2 },
    { label: "Daily Operations", href: "/facilities/daily-operations", icon: ClipboardCheck },
    { label: "Forms & Procedures", href: "/facilities/forms-and-procedures", icon: FileText },
  ] },
  { title: "Planning & Events", items: [
    { label: "Shared Calendar", href: "/facilities/shared-calendar", icon: CalendarDays },
    { label: "Events Control", href: "/facilities/events-control", icon: CalendarCheck2 },
  ] },
  { title: "Venue Oversight", items: [
    { label: "Maintenance & Issues", href: "/facilities/maintenance-&-issues", icon: Wrench },
    { label: "Compliance", href: "/facilities/compliance", icon: ShieldCheck },
    { label: "Procedures & SOPs", href: "/facilities/procedures-&-sop", icon: FileText },
  ] },
  { title: "Staffing & Cover", items: [
    { label: "Duty Team", href: "/facilities/duty-team", icon: UsersRound },
    { label: "Centre Manager Assignments", href: "/facilities/cm-assignments", icon: UserRoundCog },
  ] },
  { title: "Reporting", items: [
    { label: "Reports & History", href: "/facilities/reports-&-history", icon: BarChart3 },
  ] },
];

export default function FacilitiesDepartmentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[286px] lg:overflow-y-auto">
      <div className="flex min-h-full flex-col px-4 py-5 lg:px-5">
        <Link href="/facilities/home" className="inline-flex w-fit items-center" aria-label="GSLA Facilities department home"><Image src="/gsla-white.png" alt="GSLA" width={600} height={279} className="h-auto w-[180px]" priority /></Link>
        <p className="mt-2 text-base font-semibold">Facilities Department</p>
        <p className="mt-0.5 text-xs text-blue-200">All venues · Department view</p>
        <nav aria-label="Facilities department navigation" className="mt-6 space-y-4">
          {groups.map((group) => <div key={group.title}>
            <h2 className="mb-1 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h2>
            <div className="space-y-0.5">{group.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : "text-blue-50 hover:bg-white/10"}`}><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{label}</span></Link>;
            })}</div>
          </div>)}
        </nav>
        <div className="mt-6 border-t border-blue-300/30 pt-3 lg:mt-auto">
          <Link href="/organisation/home" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Organisation</Link>
        </div>
      </div>
    </aside>
  );
}
