// app/admin/dashboard/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal: make “future-you” understand what each section is for + where to edit things.
 * Rule: comments only (you allowed logic changes if needed).
 *
 * DASHBOARD V2 OVERVIEW
 * ---------------------
 * This page is the “control tower” version of the Super User dashboard:
 * 1) Top Summary Strip: fast situational awareness (approvals, alerts, system ok, events today)
 * 2) Main Row: “Requires Attention” (left) + “Schedule” (right)
 * 3) System Pulse: simple health indicators (progress bars)
 * 4) Tools & Administration: your original tile grid (kept as-is, moved into a section)
 *
 * LOGO NOTE
 * ---------
 * The GSLA logo is rendered globally in your AppShell/HeaderBar.
 * This page intentionally DOES NOT render a second logo to avoid duplication.
 */

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Info,
  ClipboardList,
  Settings,
  ArrowLeftRight,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Building2,
  Users,
  BarChart,
  Plus,
} from "lucide-react";

/**
 * TILE DEFINITIONS (Tools & Administration)
 * ----------------------------------------
 * This is your original tile setup.
 * - Edit here to add/remove tiles, change routes, copy, icon styling, etc.
 */
const tiles = [
  {
    title: "Statistics",
    desc: "View analytics and participation trends",
    href: "/admin/statistics",
    icon: BarChart3,
    tint: "bg-[#0C2F57]/10",
    iconColor: "text-[#0C2F57]",
  },
  {
    title: "Information Pages",
    desc: "Manage information pages and records",
    href: "/admin/info",
    icon: Info,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Forms",
    desc: "Create and edit forms for coaches, volunteers, associations",
    href: "/admin/forms",
    icon: ClipboardList,
    tint: "bg-[#F2B705]/15",
    iconColor: "text-[#B45309]",
  },
  {
    title: "Add / Edit / Delete",
    desc: "Manage sports, associations, teams",
    href: "/admin/manage",
    icon: Settings,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Import / Export",
    desc: "Upload or download CSV / Excel files",
    href: "/admin/import-export",
    icon: ArrowLeftRight,
    tint: "bg-cyan-100/40",
    iconColor: "text-cyan-700",
  },
  {
    title: "Reminders",
    desc: "Certification renewals, deadlines and alerts",
    href: "/admin/reminders",
    icon: Bell,
    tint: "bg-[#D81E27]/10",
    iconColor: "text-[#D81E27]",
  },
];

/**
 * DASHBOARD V2 DATA (Placeholder / Mocked)
 * ----------------------------------------
 * Edit here to:
 * - Wire real counts from DB / API
 * - Update labels / routes
 */

// Summary strip: top-of-page “scan” metrics.
const summary = [
  {
    key: "approvals",
    label: "Approvals",
    value: 3,
    icon: ClipboardCheck,
    tone: "danger" as const,
    href: "/admin/manage", // TODO: route to approvals queue when available
  },
  {
    key: "alerts",
    label: "Alerts",
    value: 2,
    icon: AlertTriangle,
    tone: "warn" as const,
    href: "/admin/reminders",
  },
  {
    key: "system",
    label: "System",
    value: null as number | null,
    icon: CheckCircle2,
    tone: "success" as const,
    href: "/admin/statistics", // TODO: route to health page if you add one
  },
  {
    key: "events",
    label: "Events Today",
    value: 4,
    icon: Calendar,
    tone: "neutral" as const,
    href: "/admin/calendar", // TODO: change if your calendar route differs
  },
];

// Requires Attention: actionable items.
const attentionItems = [
  {
    label: "Facilities with open issues",
    value: 2,
    icon: Building2,
    href: "/admin/manage",
    tone: "danger" as const,
  },
  {
    label: "Certifications expiring",
    value: 6,
    icon: GraduationCap,
    href: "/admin/reminders",
    tone: "warn" as const,
  },
  {
    label: "Role change requests",
    value: 3,
    icon: Users,
    href: "/admin/manage",
    tone: "danger" as const,
  },
];

// Schedule lists: keep short and scannable.
const todayItems = [
  { label: "First Aid Course (10:00)", icon: GraduationCap, href: "/admin/reminders" },
  { label: "League Match — Football", icon: ShieldCheck, href: "/admin/manage" },
  { label: "Facility Inspection", icon: Building2, href: "/admin/manage" },
];

const weekItems = [
  { label: "Away Tournament", icon: ShieldCheck, href: "/admin/manage" },
  { label: "Safeguarding Seminar", icon: ShieldCheck, href: "/admin/reminders" },
  { label: "Volunteer Intake", icon: Users, href: "/admin/forms" },
];

// System Pulse: governance/health indicators.
const pulse = [
  { label: "Safeguarding Compliance", valueLabel: "98%", percent: 98, tone: "success" as const },
  { label: "First Aid Coverage", valueLabel: "Good", percent: 72, tone: "success" as const },
  { label: "Facility Readiness", valueLabel: "Needs Review", percent: 45, tone: "warn" as const },
  { label: "Data Completeness", valueLabel: "2 Open", percent: 28, tone: "danger" as const },
];

// Quick actions: small command buttons.
const quickActions = [
  { label: "Add Facility", icon: Building2, href: "/admin/manage" },
  { label: "Create Event", icon: Calendar, href: "/admin/manage" },
  { label: "Review Users", icon: Users, href: "/admin/manage" },
  { label: "View Alerts", icon: AlertTriangle, href: "/admin/reminders" },
  { label: "Reports", icon: BarChart, href: "/admin/statistics" },
];

/**
 * Styling helpers
 * ---------------
 * Central place to adjust tone colors consistently across the dashboard.
 */
function toneBadgeClasses(tone: "danger" | "warn" | "success" | "neutral") {
  switch (tone) {
    case "danger":
      return "bg-[#D81E27]/10 text-[#D81E27] ring-[#D81E27]/20";
    case "warn":
      return "bg-[#F2B705]/15 text-[#B45309] ring-[#F2B705]/30";
    case "success":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function toneBarClasses(tone: "danger" | "warn" | "success") {
  switch (tone) {
    case "danger":
      return "bg-[#D81E27]";
    case "warn":
      return "bg-[#F2B705]";
    default:
      return "bg-emerald-500";
  }
}

export default function DashboardPage() {
  return (
    <div>
      {/* Page title + subtitle */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">
        Super User Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Control tower view — priorities, schedule, and system pulse at a glance.
      </p>

      {/* 1) Summary Strip */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.key} href={s.href} className="group">
              <Card className="transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className={["rounded-2xl p-4 ring-1", toneBadgeClasses(s.tone)].join(" ")}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-600">{s.label}</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">
                      {typeof s.value === "number" ? s.value : "OK"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2) Main Row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Requires Attention */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#B45309]" />
                <div className="text-lg font-semibold text-slate-900">Requires Attention</div>
              </div>

              <Link
                href="/admin/reminders"
                className="text-sm font-semibold text-[#0C2F57] underline-offset-4 hover:underline"
              >
                Review all issues →
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {attentionItems.map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.label} className="py-3">
                    <Link
                      href={it.href}
                      className="flex items-center justify-between gap-4 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#0C2F57]" />
                        <div className="text-sm font-medium text-slate-900">{it.label}</div>
                      </div>

                      <div className={["rounded-full px-3 py-1 text-xs font-extrabold ring-1", toneBadgeClasses(it.tone)].join(" ")}>
                        {it.value}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0C2F57]" />
              <div className="text-lg font-semibold text-slate-900">Schedule</div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-700">Today</div>
              <div className="mt-2 space-y-2">
                {todayItems.map((it) => {
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.label}
                      href={it.href}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                    >
                      <Icon className="h-5 w-5 text-[#0C2F57]" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-700">This Week</div>
              <div className="mt-2 space-y-2">
                {weekItems.map((it) => {
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.label}
                      href={it.href}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                    >
                      <Icon className="h-5 w-5 text-[#0C2F57]" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3) System Pulse + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Pulse */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <div className="text-lg font-semibold text-slate-900">System Pulse</div>
            </div>

            <div className="mt-4 space-y-4">
              {pulse.map((p) => (
                <div
                  key={p.label}
                  className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr_80px] md:items-center"
                >
                  <div className="text-sm font-medium text-slate-900">{p.label}</div>

                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className={["h-3 rounded-full", toneBarClasses(p.tone)].join(" ")}
                      style={{ width: `${Math.max(0, Math.min(100, p.percent))}%` }}
                    />
                  </div>

                  <div className="text-right text-sm font-semibold text-slate-900">
                    {p.valueLabel}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#0C2F57]" />
              <div className="text-lg font-semibold text-slate-900">Quick Actions</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <div className="rounded-xl bg-[#0C2F57]/10 p-2">
                        <Icon className="h-5 w-5 text-[#0C2F57]" />
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{a.label}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4) Tools & Administration (your original tiles) */}
      <div className="mt-10">
        <div className="text-2xl font-extrabold text-[#0C2F57]">Tools & Administration</div>
        <div className="mt-1 text-sm text-slate-600">
          Jump straight into key areas — stats, content, forms, data, and reminders.
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.title} href={t.href} className="group">
                <Card className="transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <CardContent className="flex h-[150px] items-start gap-4">
                    <div className={`rounded-2xl p-4 ${t.tint}`}>
                      <Icon className={t.iconColor} />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-slate-900">{t.title}</div>
                      <div className="mt-2 text-sm text-slate-600">{t.desc}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
