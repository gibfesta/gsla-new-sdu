"use client";

/**
 * Sidebar navigation for the admin area.
 * - Lives under the AppShell layout and sits on the left of the page content.
 * - Edit sections (SYSTEM / ADMIN TOOLS / etc.) below to add/remove/reorder links.
 * - Rule for this edit pass: comments only (no logic/UI changes).
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
} from "lucide-react";

/**
 * Sports list used to render the "SPORTS" section.
 * - Add more sports here to automatically create sidebar links.
 * - These values are also used in the URL (encodeURIComponent is applied below).
 */
const sports = ["Hockey"];

/**
 * Reusable sidebar link row.
 * - Handles "active" styling based on the current route.
 * - If you want to change active-state rules (e.g., exact match only), edit `active`.
 * - If you want to change how items look (spacing, colors, indicator bar), edit the className strings.
 */
function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any; // Icon component (lucide-react). Kept as `any` for flexibility in this UI pass.
}) {
  /**
   * Current path for determining which nav item is active.
   * - Provided by Next.js app router.
   */
  const pathname = usePathname();

  /**
   * Active state logic:
   * - Active if exact match (pathname === href)
   * - Also active for nested routes (pathname starts with href), except for "/" safety.
   *   Example: "/admin/sports/Hockey/teams" keeps "/admin/sports/Hockey" highlighted.
   */
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        /**
         * Base row layout:
         * - "group" enables group-hover styles on child elements
         * - Rounded + padding create the pill-like clickable area
         */
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        /**
         * Active vs inactive styles:
         * - Active: white background + bolder text
         * - Inactive: slate text + subtle hover background
         */
        active
          ? "bg-white font-semibold text-slate-900"
          : "text-slate-700 hover:bg-white",
      ].join(" ")}
    >
      {/* Left indicator bar (shows red when active). Edit width/height/colors here. */}
      <span
        className={[
          "h-5 w-1 rounded-full",
          active ? "bg-[#D81E27]" : "bg-transparent group-hover:bg-slate-200",
        ].join(" ")}
      />

      {/* Icon for the nav item. Swap icons by changing `icon={...}` in the sections below. */}
      <Icon size={18} className={active ? "text-[#D81E27]" : "text-slate-500"} />

      {/* Human-readable label shown in the sidebar */}
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    /**
     * Main sidebar container:
     * - Height accounts for the 72px header bar (so it fills the remaining viewport)
     * - Fixed width = 260px (adjust here if you want a wider/narrower sidebar)
     */
    <aside className="min-h-[calc(100vh-72px)] w-[260px] border-r border-slate-200 bg-[#F8FAFC] px-3 py-5">
      {/* Top-level: primary entry point. Add more "always visible" items here if needed. */}
      <div className="space-y-2">
        <NavItem href="/admin/dashboard" label="Dashboard" icon={LayoutGrid} />
      </div>

      {/* SYSTEM: user-facing admin pages (profile, calendar, reminders, etc.). */}
      <div className="mt-6">
        {/* Section header label. Edit text here to rename the group. */}
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          SYSTEM
        </div>

        {/* Section links. Add/remove NavItem rows here. */}
        <div className="space-y-1">
          <NavItem href="/admin/profile" label="Profile" icon={User} />
          <NavItem href="/admin/info" label="Info" icon={Info} />
          <NavItem href="/admin/calendar" label="Calendar" icon={Calendar} />
          <NavItem href="/admin/statistics" label="Statistics" icon={BarChart3} />
          <NavItem href="/admin/reminders" label="Reminders" icon={Bell} />
        </div>
      </div>

      {/* ADMIN TOOLS: higher-privilege actions (manage data, import/export). */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          ADMIN TOOLS
        </div>
        <div className="space-y-1">
          {/* Data management hub (CRUD). Adjust route/label here if the admin module changes. */}
          <NavItem href="/admin/manage" label="Add / Edit / Delete" icon={Settings} />

          {/* Bulk operations (imports/exports). */}
          <NavItem
            href="/admin/import-export"
            label="Import / Export"
            icon={ArrowLeftRight}
          />
        </div>
      </div>

      {/* FACILITIES: venue/building management area. */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          FACILITIES
        </div>
        <div className="space-y-1">
          <NavItem href="/admin/facilities" label="Facilities" icon={Building2} />
        </div>
      </div>

      {/* SPORTS: dynamically generated per sport in the `sports` array above. */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          SPORTS
        </div>
        <div className="space-y-1">
          {sports.map((s) => (
            /**
             * Each sport becomes a nav link to /admin/sports/[sport]
             * - encodeURIComponent ensures spaces/special chars are safe in URLs.
             */
            <NavItem
              key={s}
              href={`/admin/sports/${encodeURIComponent(s)}`}
              label={s}
              icon={Trophy}
            />
          ))}
        </div>
      </div>

      {/* LEISURE: non-sport leisure module entry point. */}
      <div className="mt-6">
        <div className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500">
          LEISURE
        </div>
        <div className="space-y-1">
          <NavItem href="/admin/leisure" label="Leisure" icon={Umbrella} />
        </div>
      </div>
    </aside>
  );
}
