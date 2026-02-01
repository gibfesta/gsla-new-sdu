// app/admin/dashboard/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal: make “future-you” understand what each section is for + where to edit things.
 * Rule: Feel free to change mock data + UI structure as needed (this is still demo/static).
 *
 * DASHBOARD V3 (MORE RELEVANT TO YOUR CURRENT IA)
 * ----------------------------------------------
 * Your Admin area has evolved into clear domains:
 * - Core Structure (Sports / Associations / Facilities)
 * - Competition & League Management (Leagues / Teams / Fixtures)
 * - People & Roles (Users / Coaches / Volunteers)
 * - Administration Governance (Policies / Safeguarding / Forms A/B/C)
 *
 * This dashboard is now “task-first”:
 * 1) Top Summary Strip: the 4 things a Super User scans first
 * 2) Domain Queues: 4 mini “queues” that map to your IA (instead of a mixed list)
 * 3) Schedule: Today + This Week with type badges
 * 4) Pulse: governance/coverage indicators
 * 5) Quick Actions: routes to the most common “do something now” tasks
 * 6) Tools & Administration: your original tile grid (kept, but no longer the hero)
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
  Trophy,
  UserCheck,
  ClipboardSignature,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Tools & Administration tiles (kept as-is)                                  */
/* -------------------------------------------------------------------------- */
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
    desc: "Manage sports, associations, teams, facilities",
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

/* -------------------------------------------------------------------------- */
/* Mocked data — edit freely until DB/API wiring                              */
/* -------------------------------------------------------------------------- */

// 1) Summary strip: what a Super User scans first
const summary = [
  {
    key: "approvalsQueue",
    label: "Approvals Queue",
    value: 7,
    icon: ClipboardCheck,
    tone: "danger" as const,
    href: "/admin/manage", // TODO: route to /admin/approvals when you add one
  },
  {
    key: "complianceRisks",
    label: "Compliance Risks",
    value: 6,
    icon: ShieldCheck,
    tone: "warn" as const,
    href: "/admin/reminders",
  },
  {
    key: "facilityIssues",
    label: "Facility Issues",
    value: 2,
    icon: Building2,
    tone: "danger" as const,
    href: "/admin/manage", // TODO: route to /admin/manage/facilities when exists
  },
  {
    key: "eventsToday",
    label: "Events Today",
    value: 4,
    icon: Calendar,
    tone: "neutral" as const,
    href: "/admin/calendar", // TODO: change if your calendar route differs
  },
];

// 2) Domain queues: map to your IA (Core / Competition / People / Governance)
type QueueTone = "danger" | "warn" | "success" | "neutral";

const domainQueues = [
  {
    key: "core",
    title: "Core Structure",
    subtitle: "Sports, associations, facilities",
    icon: Building2,
    href: "/admin/manage",
    items: [
      { label: "New association requests", value: 2, tone: "danger" as QueueTone, href: "/admin/manage" },
      { label: "Facility issues reported", value: 2, tone: "danger" as QueueTone, href: "/admin/manage" },
      { label: "Profile updates pending", value: 3, tone: "warn" as QueueTone, href: "/admin/manage" },
    ],
  },
  {
    key: "competition",
    title: "Competition & Leagues",
    subtitle: "Leagues, teams, fixtures",
    icon: Trophy,
    href: "/admin/manage",
    items: [
      { label: "League approvals", value: 3, tone: "warn" as QueueTone, href: "/admin/manage" },
      { label: "Team registrations", value: 5, tone: "neutral" as QueueTone, href: "/admin/manage" },
      { label: "Fixture conflicts", value: 1, tone: "danger" as QueueTone, href: "/admin/manage" },
    ],
  },
  {
    key: "people",
    title: "People & Roles",
    subtitle: "Users, coaches, volunteers",
    icon: Users,
    href: "/admin/manage",
    items: [
      { label: "Role change requests", value: 3, tone: "danger" as QueueTone, href: "/admin/manage" },
      { label: "Coach onboarding", value: 4, tone: "warn" as QueueTone, href: "/admin/manage" },
      { label: "Volunteer intake", value: 2, tone: "neutral" as QueueTone, href: "/admin/forms" },
    ],
  },
  {
    key: "governance",
    title: "Administration Governance",
    subtitle: "Safeguarding, policies, forms",
    icon: ClipboardSignature,
    href: "/admin/forms",
    items: [
      { label: "Safeguarding checks due", value: 2, tone: "danger" as QueueTone, href: "/admin/reminders" },
      { label: "Certifications expiring", value: 6, tone: "warn" as QueueTone, href: "/admin/reminders" },
      { label: "Forms A/B/C submissions", value: 5, tone: "neutral" as QueueTone, href: "/admin/forms" },
    ],
  },
];

// 3) Schedule: keep short, add type badges for scan-ability
type ScheduleType = "Course" | "Match" | "Facility" | "Governance";

const todayItems: Array<{ label: string; type: ScheduleType; icon: any; href: string }> = [
  { label: "First Aid Course (10:00)", type: "Course", icon: GraduationCap, href: "/admin/reminders" },
  { label: "League Match — Football", type: "Match", icon: Trophy, href: "/admin/manage" },
  { label: "Facility Inspection", type: "Facility", icon: Building2, href: "/admin/manage" },
];

const weekItems: Array<{ label: string; type: ScheduleType; icon: any; href: string }> = [
  { label: "Away Tournament", type: "Match", icon: Trophy, href: "/admin/manage" },
  { label: "Safeguarding Seminar", type: "Governance", icon: ShieldCheck, href: "/admin/reminders" },
  { label: "Volunteer Intake Session", type: "Course", icon: UserCheck, href: "/admin/forms" },
];

// 4) Pulse: governance outcomes + readiness + completeness
const pulse = [
  { label: "Safeguarding Compliance", valueLabel: "98%", percent: 98, tone: "success" as const },
  { label: "First Aid Coverage", valueLabel: "Good", percent: 72, tone: "success" as const },
  { label: "Facility Readiness", valueLabel: "Needs Review", percent: 45, tone: "warn" as const },
  { label: "Data Completeness", valueLabel: "12 Missing", percent: 35, tone: "danger" as const },
  { label: "Form Compliance", valueLabel: "5 Pending", percent: 55, tone: "warn" as const },
];

// 5) Quick actions: match your *current* IA and new “Forms A/B/C”
const quickActions = [
  { label: "Add Sport", icon: Plus, href: "/admin/manage" },
  { label: "Add Association", icon: Building2, href: "/admin/manage" },
  { label: "Add Facility", icon: Building2, href: "/admin/manage" },
  { label: "Review Users", icon: Users, href: "/admin/manage" },

  // Forms A/B/C — adjust routes to match your actual folder names.
  // If your routes are /admin/forms/formABC etc, update these hrefs accordingly.
  { label: "Form A", icon: ClipboardList, href: "/admin/forms" },
  { label: "Form B", icon: ClipboardList, href: "/admin/forms" },
  { label: "Form C", icon: ClipboardList, href: "/admin/forms" },

  { label: "View Alerts", icon: AlertTriangle, href: "/admin/reminders" },
  { label: "Reports", icon: BarChart, href: "/admin/statistics" },
];

/* -------------------------------------------------------------------------- */
/* Styling helpers                                                            */
/* -------------------------------------------------------------------------- */

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

function scheduleTypeBadge(type: ScheduleType) {
  switch (type) {
    case "Course":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case "Match":
      return "bg-[#0C2F57]/10 text-[#0C2F57] ring-[#0C2F57]/20";
    case "Facility":
      return "bg-[#D81E27]/10 text-[#D81E27] ring-[#D81E27]/20";
    default:
      return "bg-[#F2B705]/15 text-[#B45309] ring-[#F2B705]/30";
  }
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  return (
    <div>
      {/* Page title + subtitle */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Super User Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Task-first view — queues, schedule, governance pulse, and tools.
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
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">{s.value}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2) Domain Queues + Schedule */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Domain Queues (2 columns) */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#B45309]" />
                <div className="text-lg font-semibold text-slate-900">Queues by Domain</div>
              </div>
              <Link
                href="/admin/manage"
                className="text-sm font-semibold text-[#0C2F57] underline-offset-4 hover:underline"
              >
                Go to Manage →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {domainQueues.map((d) => {
                const Icon = d.icon;
                return (
                  <Card key={d.key} className="border border-slate-200">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="rounded-xl bg-[#0C2F57]/10 p-2">
                              <Icon className="h-5 w-5 text-[#0C2F57]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-slate-900">{d.title}</div>
                              <div className="mt-0.5 text-xs text-slate-600">{d.subtitle}</div>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={d.href}
                          className="shrink-0 text-xs font-semibold text-[#0C2F57] underline-offset-4 hover:underline"
                        >
                          Open →
                        </Link>
                      </div>

                      <div className="mt-4 space-y-2">
                        {d.items.map((it) => (
                          <Link
                            key={it.label}
                            href={it.href}
                            className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                          >
                            <div className="truncate text-sm font-medium text-slate-900">{it.label}</div>
                            <div
                              className={[
                                "shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                                toneBadgeClasses(it.tone),
                              ].join(" ")}
                            >
                              {it.value}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule (right column) */}
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
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ring-1",
                          scheduleTypeBadge(it.type),
                        ].join(" ")}
                      >
                        {it.type}
                      </span>
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
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ring-1",
                          scheduleTypeBadge(it.type),
                        ].join(" ")}
                      >
                        {it.type}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3) Pulse + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pulse */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <div className="text-lg font-semibold text-slate-900">Governance Pulse</div>
            </div>

            <div className="mt-4 space-y-4">
              {pulse.map((p) => (
                <div
                  key={p.label}
                  className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr_90px] md:items-center"
                >
                  <div className="text-sm font-medium text-slate-900">{p.label}</div>

                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className={["h-3 rounded-full", toneBarClasses(p.tone)].join(" ")}
                      style={{ width: `${Math.max(0, Math.min(100, p.percent))}%` }}
                    />
                  </div>

                  <div className="text-right text-sm font-semibold text-slate-900">{p.valueLabel}</div>
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

            <div className="mt-4 text-xs text-slate-600">
              Tip: update Form A/B/C links above to match your actual folder routes.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4) Tools & Administration (original tiles) */}
      <div className="mt-10">
        <div className="text-2xl font-extrabold text-[#0C2F57]">Tools & Administration</div>
        <div className="mt-1 text-sm text-slate-600">
          Jump into stats, content, forms, data tools and reminders.
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
