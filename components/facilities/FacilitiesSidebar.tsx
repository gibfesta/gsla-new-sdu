"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft, CalendarDays, CalendarRange, Camera, CheckSquare2,
  ClipboardList, Clock3, DoorOpen, FileText, HelpCircle, Info,
  LayoutDashboard, ListChecks, LockKeyhole, Settings, ShieldCheck,
  TriangleAlert, type LucideIcon,
} from "lucide-react";
import { facilitiesVenues } from "./venues";

type NavEntry = { label: string; icon: LucideIcon; tab?: string; dashboard?: boolean };
type NavGroup = { title: string; entries: NavEntry[] };

const groups: NavGroup[] = [
  { title: "Overview", entries: [
    { label: "Venue Dashboard", icon: LayoutDashboard, dashboard: true },
  ] },
  { title: "Daily Operations", entries: [
    { label: "Daily Handover", icon: ClipboardList, tab: "handover" },
    { label: "Information", icon: Info, tab: "information" },
    { label: "Issues", icon: TriangleAlert, tab: "issues" },
    { label: "Timeline", icon: Clock3, tab: "timeline" },
  ] },
  { title: "Planning & Scheduling", entries: [
    { label: "Events", icon: CalendarDays, tab: "events" },
    { label: "Bookings / Calendar", icon: CalendarRange, tab: "bookings" },
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
];

// This sidebar is shown on an individual venue route only.
export default function FacilitiesSidebar() {
  const pathname = usePathname();
  const selectedTab = useSearchParams().get("tab");
  const venueId = pathname.match(/^\/facilities\/facilities\/([^/]+)/)?.[1];
  const venue = facilitiesVenues.find((item) => item.id === venueId);
  const venueHref = venueId ? `/facilities/facilities/${venueId}` : "/facilities/dashboard";

  return (
    <aside className="w-full shrink-0 bg-[linear-gradient(180deg,#0d2d52,#123c69)] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[286px] lg:overflow-y-auto">
      <div className="px-4 py-5 lg:px-5">
        <Link href={venueHref} className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white" aria-label="GSLA venue home">
          <span className="text-3xl" aria-hidden="true">✦</span> GSLA
        </Link>
        <h2 className="mt-1 text-lg font-bold">{venue?.name ?? "Venue Workspace"}</h2>
        <p className="mt-1 text-sm text-blue-100">Centre Manager Workspace</p>
        <p className="mt-1 text-xs leading-5 text-blue-200">Less typing. Faster navigation.<br />More time in venues.</p>
        <nav aria-label="Venue operations navigation" className="mt-5 space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{group.title}</h3>
              <div className="space-y-0.5">
                {group.entries.map((entry) => {
                  const href = entry.tab && venueId ? `${venueHref}?tab=${entry.tab}` : entry.dashboard ? venueHref : undefined;
                  const Icon = entry.icon;
                  const active = entry.tab ? selectedTab === entry.tab : !!entry.dashboard && pathname === venueHref && !selectedTab;
                  const className = `flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-[#245d9b] font-semibold text-white" : href ? "text-blue-50 hover:bg-white/10" : "text-blue-200/65"}`;
                  const content = <><Icon size={19} className="shrink-0" aria-hidden="true" /><span className="leading-5">{entry.label}</span></>;
                  return href
                    ? <Link key={entry.label} href={href} className={className} aria-current={active ? "page" : undefined}>{content}</Link>
                    : <span key={entry.label} className={className} title="Coming soon" aria-disabled="true">{content}</span>;
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 border-t border-blue-300/30 pt-3">
          <Link href="/facilities/facilities" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Facilities Directory</Link>
          <Link href="/superuser/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-blue-50 hover:bg-white/10"><ArrowLeft size={19} aria-hidden="true" />Back to Organisation</Link>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><HelpCircle size={19} aria-hidden="true" />Help</span>
          <span className="flex items-center gap-3 px-3 py-1.5 text-sm text-blue-200/65" title="Coming soon"><Settings size={19} aria-hidden="true" />Settings</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-xl border border-blue-300/20 bg-[#194c80] p-3 text-xs leading-4 text-blue-100">
          <LockKeyhole size={16} className="shrink-0" aria-hidden="true" />
          This menu covers this venue only. Department-wide access will follow account permissions.
        </p>
      </div>
    </aside>
  );
}
