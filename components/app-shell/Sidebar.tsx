"use client";

/**
 * Sidebar navigation for the admin area.
 * Cleaned up and reorganised to match the new department structure.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Info,
  Settings,
  ArrowLeftRight,
  Trophy,
  Calendar,
  User,
  Building2,
  Users,
  Clock,
  House,
  Landmark,
  BarChart3,
  Trees,
  ShieldCheck,
} from "lucide-react";

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
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        active
          ? "bg-white font-semibold text-slate-900 shadow-sm"
          : "text-slate-700 hover:bg-white hover:text-slate-900",
      ].join(" ")}
    >
      <span
        className={[
          "h-5 w-1 rounded-full transition",
          active ? "bg-[#D81E27]" : "bg-transparent group-hover:bg-slate-200",
        ].join(" ")}
      />
      <Icon size={18} className={active ? "text-[#D81E27]" : "text-slate-500"} />
      <span>{label}</span>
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-2 pt-1 text-sm font-bold tracking-[0.12em] text-slate-800 uppercase">
      {children}
    </div>
  );
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-3 pb-1 text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
      {children}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="min-h-[calc(100vh-72px)] w-[280px] border-r border-slate-200 bg-[#F8FAFC] px-3 py-5">
      {/* Main */}
      <div className="space-y-1">
        <NavItem href="/" label="Home" icon={House} />
        <NavItem href="/admin/profile" label="Profile" icon={User} />
        <NavItem href="/admin/calendar" label="Calendar" icon={Calendar} />
      </div>

      {/* Superuser Privileges */}
      <div className="mt-6">
        <SectionTitle>Superuser Privileges</SectionTitle>
        <div className="space-y-1">
          <NavItem href="/admin/reminders" label="Reminders" icon={Bell} />
          <NavItem href="/admin/superuser-dashboard" label="Superuser Dashboard" icon={ShieldCheck} />
          <NavItem href="/admin/manage" label="Superuser Tools" icon={Settings} />
          <NavItem href="/admin/info" label="Information" icon={Info} />
          <NavItem href="/admin/import-export" label="Import / Export" icon={ArrowLeftRight} />
        </div>
      </div>

      {/* Finance & Accounts Department */}
      <div className="mt-6">
        <SectionTitle>Finance & Accounts Department</SectionTitle>
        <div className="space-y-1">
          {/* Add finance links here later */}
          {/* Example:
          <NavItem href="/admin/accounts" label="Accounts Overview" icon={Landmark} />
          */}
        </div>
      </div>

      {/* Administration Department */}
      <div className="mt-6">
        <SectionTitle>Administration Department</SectionTitle>
        <div className="space-y-1">
          <NavItem href="/admin/hr" label="Human Resources" icon={Users} />
          <NavItem href="/admin/hr/timesheets" label="Time Sheets" icon={Clock} />
        </div>
      </div>

      {/* Facilities Department */}
      <div className="mt-6">
        <SectionTitle>Facilities Department</SectionTitle>
        <div className="space-y-1">
          <NavItem href="/admin/facilities" label="Facilities Directory" icon={Building2} />
          <NavItem href="/admin/bookings" label="Bookings" icon={Calendar} />
          <NavItem href="/admin/events" label="Community / Cultural Events" icon={Calendar} />
        </div>
      </div>

      {/* Sports Development Department */}
      <div className="mt-6">
        <SectionTitle>Sports Development Department</SectionTitle>

        <div className="space-y-1">
          <NavItem
            href="/admin/statistics"
            label="Overall Participation Statistics"
            icon={BarChart3}
          />
        </div>

        <SubSectionTitle>Sports</SubSectionTitle>
        <div className="space-y-1">
          {sports.map((sport) => (
            <NavItem
              key={sport}
              href={`/admin/sports/${encodeURIComponent(sport.toLowerCase())}`}
              label={sport}
              icon={Trophy}
            />
          ))}
        </div>

        <SubSectionTitle>Leisure</SubSectionTitle>
        <div className="space-y-1">
          <NavItem href="/admin/leisure/parks" label="Parks" icon={Trees} />
        </div>
      </div>
    </aside>
  );
}