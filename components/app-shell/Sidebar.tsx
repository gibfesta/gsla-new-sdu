"use client";

/**
 * Sidebar navigation for the admin area.
 * Edit the sections below to add/remove/reorder links.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  ClipboardList,
  Info,
  Bell,
  Settings,
  ArrowLeftRight,
  Trophy,
  Calendar,
  User,
  Building2,
  Umbrella,
  Users,
  Clock,
} from "lucide-react";

/**
 * Sports list used to render the "Sports" links under Sports Development Unit.
 * Add more sports here to automatically create sidebar links.
 */
const sports = ["Hockey"];

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active ? "bg-white font-semibold text-slate-900" : "text-slate-700 hover:bg-white",
      ].join(" ")}
    >
      <span
        className={[
          "h-5 w-1 rounded-full",
          active ? "bg-[#D81E27]" : "bg-transparent group-hover:bg-slate-200",
        ].join(" ")}
      />
      <Icon size={18} className={active ? "text-[#D81E27]" : "text-slate-500"} />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="min-h-[calc(100vh-72px)] w-[260px] border-r border-slate-200 bg-[#F8FAFC] px-3 py-5">
      {/* Dashboard */}
      <div className="space-y-2">
        <NavItem href="/admin/dashboard" label="Dashboard" icon={LayoutGrid} />
      </div>

      {/* System */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">SYSTEM</div>
        <div className="space-y-1">
          <NavItem href="/admin/profile" label="Profile" icon={User} />
          <NavItem href="/admin/info" label="Info" icon={Info} />
          <NavItem href="/admin/calendar" label="Calendar" icon={Calendar} />
          <NavItem href="/admin/statistics" label="Statistics" icon={BarChart3} />
          <NavItem href="/admin/reminders" label="Reminders" icon={Bell} />
        </div>
      </div>

      {/* Superuser Tools */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">SUPERUSER TOOLS</div>
        <div className="space-y-1">
          <NavItem href="/admin/manage" label="Superuser Tools" icon={Settings} />
          <NavItem href="/admin/import-export" label="Import / Export" icon={ArrowLeftRight} />
        </div>
      </div>

      {/* Admin Department */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          ADMIN DEPARTMENT
        </div>
        <div className="space-y-1">
          <NavItem href="/admin/hr" label="Human Resources" icon={Users} />
          <NavItem href="/admin/hr/timesheets" label="Time Sheets" icon={Clock} />
        </div>
      </div>

      {/* Facilities Department */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          FACILITIES DEPARTMENT
        </div>
        <div className="space-y-1">
          <NavItem href="/admin/facilities" label="Facilities" icon={Building2} />
          <NavItem href="/admin/bookings" label="Bookings" icon={ClipboardList} />
          <NavItem href="/admin/events" label="Community / Cultural Events" icon={Calendar} />
        </div>
      </div>

      {/* Sports Development Unit */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          SPORTS DEVELOPMENT UNIT
        </div>

        {/* Sports */}
        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-400">
          SPORTS
        </div>
        <div className="space-y-1">
          {sports.map((s) => (
            <NavItem key={s} href={`/admin/sports/${encodeURIComponent(s)}`} label={s} icon={Trophy} />
          ))}
        </div>

        {/* Leisure */}
        <div className="px-3 pt-4 pb-1 text-[11px] font-semibold tracking-wider text-slate-400">
          LEISURE
        </div>
        <div className="space-y-1">
          <NavItem href="/admin/leisure" label="Leisure" icon={Umbrella} />
        </div>
      </div>
    </aside>
  );
}
