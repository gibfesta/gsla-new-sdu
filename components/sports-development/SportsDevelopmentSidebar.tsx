"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, BarChart3, CalendarDays, CheckSquare2, ClipboardList, Download,
  FileText, Folder, HelpCircle, LayoutDashboard, LockKeyhole, Settings,
  ShieldCheck, Trophy, UserRound, UserRoundPlus, UsersRound, type LucideIcon,
} from "lucide-react";

type Entry = { label: string; icon: LucideIcon; href?: string; prefix?: boolean };
const groups: { title: string; entries: Entry[] }[] = [
  { title: "Overview", entries: [
    { label: "Sports Development Unit Dashboard", icon: LayoutDashboard, href: "/sports-development/dashboard" },
    { label: "Sports & Associations", icon: Trophy, href: "/sports-development/sports" },
    { label: "Participation Statistics", icon: BarChart3, href: "/sports-development/reports" },
  ] },
  { title: "Planning & Activity", entries: [
    { label: "Calendar", icon: CalendarDays },
    { label: "Events / Competitions", icon: Trophy },
    { label: "Programmes / Initiatives", icon: Folder },
  ] },
  { title: "People", entries: [
    { label: "Participants", icon: UserRound },
    { label: "Coaches", icon: UserRoundPlus },
    { label: "Teams", icon: UsersRound, href: "/sports-development/teams", prefix: true },
  ] },
  { title: "Compliance & Admin", entries: [
    { label: "Compliance Centre", icon: ShieldCheck },
    { label: "Forms", icon: FileText, href: "/sports-development/associations/forms", prefix: true },
    { label: "Documents", icon: Folder },
    { label: "Tasks / Actions", icon: CheckSquare2 },
  ] },
  { title: "Reporting", entries: [
    { label: "Reports", icon: ClipboardList, href: "/sports-development/reports" },
    { label: "Exports", icon: Download },
  ] },
];

export default function SportsDevelopmentSidebar() {
  const pathname = usePathname();
  const sportMatch = pathname.match(/^\/sports-development\/sports\/([^/]+)/);
  const sport = sportMatch?.[1];
  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[266px] lg:overflow-y-auto">
      <div className="px-4 py-5 lg:px-5">
        <Link href="/sports-development/dashboard" className="inline-flex w-fit items-center" aria-label="GSLA Sports Development Unit home"><Image src="/gsla-white.png" alt="GSLA" width={600} height={279} className="h-auto w-[180px]" priority /></Link>
        <p className="mt-1 text-sm leading-5 text-blue-100">Developing People.<br />Stronger Communities.<br />More Opportunities.</p>
        <nav aria-label="Sports Development Unit navigation" className="mt-5 space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h3>
              <div className="space-y-0.5">
                {group.entries.map((entry) => {
                  const Icon = entry.icon;
                  const href = sport && entry.label === "Participants" ? `/sports-development/sports/${sport}/participants`
                    : sport && entry.label === "Coaches" ? `/sports-development/sports/${sport}/coaches` : entry.href;
                  const active = !!href && (pathname === href || !!entry.prefix && pathname.startsWith(href + "/"));
                  const className = `flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : href ? "text-blue-50 hover:bg-white/10" : "text-blue-200/65"}`;
                  const content = <><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{entry.label}</span></>;
                  return href ? <Link key={entry.label} href={href} className={className} aria-current={active ? "page" : undefined}>{content}</Link>
                    : <span key={entry.label} className={className} aria-disabled="true" title={entry.label === "Participants" || entry.label === "Coaches" ? "Select a sport first" : "Coming soon"}>{content}</span>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 border-t border-blue-300/30 pt-3">
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Organisation</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><HelpCircle size={19} aria-hidden="true" />Help</span>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><Settings size={19} aria-hidden="true" />Settings</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100"><LockKeyhole size={16} className="shrink-0" aria-hidden="true" />People sections open after selecting a sport. Editing access follows account permissions.</p>
      </div>
    </aside>
  );
}
