"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BarChart3, Bell, Building2, Calendar, Clock, House, Info, Landmark, Settings, ShieldCheck, Trophy, User, Users, type LucideIcon } from "lucide-react";

type NavLink = { href: string; label: string; icon: LucideIcon };

function NavItem({ href, label, icon: Icon, pathname }: NavLink & { pathname: string }) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link href={href} aria-current={active ? "page" : undefined}
      className={["group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", active ? "bg-white font-semibold text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white hover:text-slate-900"].join(" ")}>
      <span className={["h-5 w-1 rounded-full transition", active ? "bg-[#D81E27]" : "bg-transparent group-hover:bg-slate-200"].join(" ")} />
      <Icon size={18} className={active ? "text-[#D81E27]" : "text-slate-500"} />
      <span>{label}</span>
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="px-3 pb-2 pt-1 text-sm font-bold tracking-[0.12em] text-slate-800 uppercase">{children}</div>;
}

const navigation: Record<string, { title: string; links: NavLink[]; subsection?: { title: string; links: NavLink[] } }> = {
  facilities: {
    title: "Facilities Department",
    links: [
      { href: "/facilities/dashboard", label: "Facilities Dashboard", icon: Building2 },
      { href: "/facilities/facilities", label: "Facilities Directory", icon: Building2 },
      { href: "/facilities/bookings", label: "Bookings", icon: Calendar },
      { href: "/facilities/events", label: "Community / Cultural Events", icon: Calendar },
    ],
  },
  "human-resources": {
    title: "Human Resources",
    links: [
      { href: "/human-resources/dashboard", label: "Human Resources", icon: Users },
      { href: "/human-resources/employees", label: "Employees", icon: User },
      { href: "/human-resources/leave", label: "Leave", icon: Calendar },
      { href: "/human-resources/timesheets", label: "Time Sheets", icon: Clock },
    ],
  },
  "sports-development": {
    title: "Sports Development Unit",
    links: [
      { href: "/sports-development/dashboard", label: "SDU Dashboard", icon: Trophy },
      { href: "/sports-development/sports", label: "Sports Directory", icon: Trophy },
      { href: "/sports-development/associations/forms", label: "Associations & Forms", icon: Building2 },
      { href: "/sports-development/reports", label: "Overall Participation Statistics", icon: BarChart3 },
    ],
    subsection: { title: "Sports", links: [{ href: "/sports-development/sports/hockey", label: "Hockey", icon: Trophy }] },
  },
  finance: { title: "Finance & Accounts Department", links: [{ href: "/finance/dashboard", label: "Finance Dashboard", icon: Landmark }] },
  superuser: {
    title: "Superuser Privileges",
    links: [
      { href: "/superuser/system/reminders", label: "Reminders", icon: Bell },
      { href: "/superuser/system/manage", label: "Superuser Tools", icon: Settings },
      { href: "/superuser/users", label: "Users", icon: Users },
      { href: "/superuser/reports/operations", label: "Operations Dashboard", icon: ShieldCheck },
      { href: "/superuser/system/info", label: "Information", icon: Info },
      { href: "/superuser/system/import-export", label: "Import / Export", icon: ArrowLeftRight },
    ],
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const area = pathname.split("/")[1];
  const section = navigation[area];
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-[#F8FAFC] px-3 py-5 md:min-h-[calc(100vh-72px)] md:w-[280px] md:border-b-0 md:border-r">
      <nav aria-label="Section navigation">
        <div className="space-y-1">
          <NavItem href="/" label="Home" icon={House} pathname={pathname} />
          <NavItem href="/profile" label="Profile" icon={User} pathname={pathname} />
          <NavItem href="/facilities/shared-calendar" label="Calendar" icon={Calendar} pathname={pathname} />
        </div>
        {section && <div className="mt-6">
          <SectionTitle>{section.title}</SectionTitle>
          <div className="space-y-1">{section.links.map(link => <NavItem key={link.href} {...link} pathname={pathname} />)}</div>
          {section.subsection && <div className="mt-3">
            <div className="px-3 pb-1 pt-3 text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">{section.subsection.title}</div>
            <div className="space-y-1">{section.subsection.links.map(link => <NavItem key={link.href} {...link} pathname={pathname} />)}</div>
          </div>}
        </div>}
      </nav>
    </aside>
  );
}
