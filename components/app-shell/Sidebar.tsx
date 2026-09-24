"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = {
  facilities: [
    ["Dashboard", "/facilities/dashboard"],
    ["Facilities", "/facilities/facilities"],
    ["Bookings", "/facilities/bookings"],
    ["Shared calendar", "/facilities/shared-calendar"],
    ["Events", "/facilities/events"],
  ],
  "sports-development": [
    ["Dashboard", "/sports-development/dashboard"],
    ["Sports", "/sports-development/sports"],
    ["Associations & forms", "/sports-development/associations/forms"],
    ["Leagues", "/sports-development/leagues"],
    ["Teams", "/sports-development/teams"],
    ["Reports", "/sports-development/reports"],
  ],
  "human-resources": [
    ["Dashboard", "/human-resources/dashboard"],
    ["Employees", "/human-resources/employees"],
    ["Leave", "/human-resources/leave"],
    ["Timesheets", "/human-resources/timesheets"],
  ],
  finance: [["Dashboard", "/finance/dashboard"]],
  superuser: [
    ["Dashboard", "/superuser/dashboard"],
    ["Users", "/superuser/users"],
    ["System tools", "/superuser/system/manage"],
    ["Reports", "/superuser/reports/overview"],
  ],
} as const;

export default function Sidebar() {
  const pathname = usePathname();
  const area = pathname.split("/")[1] as keyof typeof navigation;
  const links: readonly (readonly [string, string])[] = navigation[area] ?? [];
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-[#F8FAFC] px-3 py-3 md:min-h-[calc(100vh-72px)] md:w-[250px] md:border-b-0 md:border-r md:py-5">
      <Link href="/" className="mb-6 block px-3 text-sm font-semibold text-[#0C2F57]">← Departments</Link>
      <nav aria-label={`${area.replaceAll("-", " ")} navigation`} className="space-y-1">
        {links.map(([label, href]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`block rounded-xl px-3 py-2.5 text-sm ${active ? "bg-white font-semibold text-[#0C2F57] shadow-sm" : "text-slate-700 hover:bg-white"}`}>
            {label}
          </Link>;
        })}
      </nav>
    </aside>
  );
}
