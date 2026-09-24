"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, Building2, CalendarDays, CalendarRange, Camera, CheckSquare2,
  ClipboardList, Clock3, DoorOpen, FileText, HelpCircle, Info,
  LayoutDashboard, ListChecks, LockKeyhole, Settings, ShieldCheck,
  TriangleAlert, UsersRound, type LucideIcon,
} from "lucide-react";

type FacilitiesRole = "facilities-manager" | "centre-manager" | "superuser";
type NavEntry = { label: string; icon: LucideIcon; href?: string; tab?: string; managerOnly?: boolean };
type NavGroup = { title: string; entries: NavEntry[] };

const groups: NavGroup[] = [
  { title: "Overview", entries: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/facilities/dashboard" },
    { label: "Facilities Directory", icon: Building2, href: "/facilities/facilities", managerOnly: true },
  ] },
  { title: "Daily Operations", entries: [
    { label: "Daily Handover", icon: ClipboardList, tab: "handover" },
    { label: "Information", icon: Info, tab: "information" },
    { label: "Issues", icon: TriangleAlert, tab: "issues" },
    { label: "Timeline", icon: Clock3, tab: "timeline" },
  ] },
  { title: "Planning & Scheduling", entries: [
    { label: "Events", icon: CalendarDays, href: "/facilities/events" },
    { label: "Bookings / Calendar", icon: CalendarRange, href: "/facilities/shared-calendar" },
    { label: "Opening / Closing", icon: DoorOpen, tab: "procedures" },
    { label: "Weekly Tasks", icon: CheckSquare2, tab: "weekly" },
    { label: "Monthly Tasks", icon: CalendarDays, tab: "monthly" },
  ] },
  { title: "Records & Control", entries: [
    { label: "Documents / SOPs", icon: FileText, tab: "documents" },
    { label: "Photo Log", icon: Camera, tab: "photos" },
    { label: "Compliance", icon: ShieldCheck, tab: "compliance" },
    { label: "Audit Trail", icon: ListChecks, tab: "audit" },
  ] },
  { title: "Management", entries: [
    { label: "Centre Manager Assignments", icon: UsersRound },
  ] },
];

// Role enforcement is not wired into the app yet. When it is, pass the
// authenticated role here and protect the directory route on the server too.
export default function FacilitiesSidebar({ role = "superuser" }: { role?: FacilitiesRole }) {
  const pathname = usePathname();
  const venueMatch = pathname.match(/^\/facilities\/facilities\/([^/]+)/);
  const venueId = venueMatch?.[1] && venueMatch[1] !== "new" ? venueMatch[1] : null;

  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[286px] lg:overflow-y-auto">
      <div className="px-4 py-5 lg:px-5">
        <Link href="/facilities/dashboard" className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white" aria-label="GSLA Facilities home">
          <span className="text-3xl" aria-hidden="true">✦</span> GSLA
        </Link>
        <h2 className="mt-1 text-lg font-bold">Facilities Section</h2>
        <p className="mt-1 text-sm text-blue-100">Shared Facilities Workspace</p>
        <p className="mt-1 text-xs leading-5 text-blue-200">Less typing. Faster navigation.<br />More time in venues.</p>
        <nav aria-label="Facilities navigation" className="mt-5 space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h3>
              <div className="space-y-0.5">
                {group.entries.filter((entry) => !(role === "centre-manager" && entry.managerOnly)).map((entry) => {
                  const href = entry.tab && venueId
                    ? `/facilities/facilities/${venueId}?tab=${entry.tab}`
                    : entry.href;
                  const Icon = entry.icon;
                  const active = entry.href === pathname || (entry.label === "Facilities Directory" && pathname.startsWith("/facilities/facilities"));
                  const className = `flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : href ? "text-blue-50 hover:bg-white/10" : "text-blue-200/65"}`;
                  const content = <><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{entry.label}</span></>;
                  return href
                    ? <Link key={entry.label} href={href} className={className} aria-current={active ? "page" : undefined}>{content}</Link>
                    : <span key={entry.label} className={className} title={entry.tab ? "Open a facility to use this section" : "Coming soon"} aria-disabled="true">{content}</span>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 border-t border-blue-300/30 pt-3">
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Admin</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><HelpCircle size={19} aria-hidden="true" />Help</span>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><Settings size={19} aria-hidden="true" />Settings</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100">
          <LockKeyhole size={16} className="shrink-0" aria-hidden="true" />
          Venue sections open after selecting a facility. Directory access will follow account permissions.
        </p>
      </div>
    </aside>
  );
}
