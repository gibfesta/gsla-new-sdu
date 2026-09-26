"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, CalendarDays, ClipboardList, FileText, HelpCircle, LayoutDashboard,
  LockKeyhole, Settings, UsersRound, type LucideIcon,
} from "lucide-react";

type Entry = { label: string; icon: LucideIcon; href?: string; prefix?: boolean };
const groups: { title: string; entries: Entry[] }[] = [
  { title: "Overview", entries: [
    { label: "Human Resources Dashboard", icon: LayoutDashboard, href: "/human-resources/dashboard" },
    { label: "Employees", icon: UsersRound, href: "/human-resources/employees", prefix: true },
    { label: "Leave Management", icon: CalendarDays, href: "/human-resources/leave", prefix: true },
  ] },
  { title: "Timesheets & Payroll", entries: [
    { label: "Timesheets", icon: ClipboardList, href: "/human-resources/timesheets" },
    { label: "Weeks Inbox", icon: CalendarDays, href: "/human-resources/timesheets/weeks", prefix: true },
    { label: "Timesheet Settings", icon: Settings, href: "/human-resources/timesheets/settings" },
  ] },
  { title: "Records & Reporting", entries: [
    { label: "Documents", icon: FileText },
    { label: "Reports", icon: ClipboardList },
  ] },
];

export default function HumanResourcesSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[266px] lg:overflow-y-auto">
      <div className="px-4 py-5 lg:px-5">
        <Link href="/human-resources/dashboard" className="inline-flex w-fit items-center" aria-label="GSLA Human Resources home"><Image src="/gsla-white.png" alt="GSLA" width={600} height={279} className="h-auto w-[180px]" priority /></Link>
        <p className="mt-1 text-sm leading-5 text-blue-100">Supporting people.<br />Simplifying administration.<br />Stronger teams.</p>
        <nav aria-label="Human Resources navigation" className="mt-5 space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h3>
              <div className="space-y-0.5">
                {group.entries.map((entry) => {
                  const Icon = entry.icon;
                  const active = !!entry.href && (pathname === entry.href || !!entry.prefix && pathname.startsWith(entry.href + "/"));
                  const className = `flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : entry.href ? "text-blue-50 hover:bg-white/10" : "text-blue-200/65"}`;
                  const content = <><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{entry.label}</span></>;
                  return entry.href ? <Link key={entry.label} href={entry.href} className={className} aria-current={active ? "page" : undefined}>{content}</Link>
                    : <span key={entry.label} className={className} aria-disabled="true" title="Coming soon">{content}</span>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 border-t border-blue-300/30 pt-3">
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Admin</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><HelpCircle size={19} aria-hidden="true" />Help</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100"><LockKeyhole size={16} className="shrink-0" aria-hidden="true" />Employee and leave pages currently contain example records. Timesheet week packs use database data.</p>
      </div>
    </aside>
  );
}
