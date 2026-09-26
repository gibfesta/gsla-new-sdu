"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Info,
  ClipboardList,
  Settings,
  ArrowLeftRight,
  Bell,
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
  Activity,
  CheckCircle2,
  Clock3,
  Siren,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Tiles                                                                       */
/* -------------------------------------------------------------------------- */

const tiles = [
  {
    title: "Statistics",
    desc: "View analytics and participation trends",
    href: "/sports-development/reports",
    icon: BarChart3,
    tint: "bg-[#0C2F57]/10",
    iconColor: "text-[#0C2F57]",
  },
  {
    title: "Information Pages",
    desc: "Manage information pages and records",
    href: "/superuser/system/info",
    icon: Info,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Forms",
    desc: "Create and edit forms for coaches, volunteers, associations",
    href: "/sports-development/associations/forms",
    icon: ClipboardList,
    tint: "bg-[#F2B705]/15",
    iconColor: "text-[#B45309]",
  },
  {
    title: "Superuser Tools",
    desc: "Manage users, records, and admin controls",
    href: "/superuser/system/manage",
    icon: Settings,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Import / Export",
    desc: "Upload or download CSV / Excel files",
    href: "/superuser/system/import-export",
    icon: ArrowLeftRight,
    tint: "bg-cyan-100/40",
    iconColor: "text-cyan-700",
  },
  {
    title: "Reminders",
    desc: "Certification renewals, deadlines and alerts",
    href: "/superuser/system/reminders",
    icon: Bell,
    tint: "bg-[#D81E27]/10",
    iconColor: "text-[#D81E27]",
  },
];

/* -------------------------------------------------------------------------- */
/* Data                                                                         */
/* -------------------------------------------------------------------------- */

const summary = [
  {
    key: "approvalsQueue",
    label: "Approvals Queue",
    value: 7,
    icon: ClipboardCheck,
    tone: "danger" as const,
    href: "/superuser/system/manage",
  },
  {
    key: "complianceRisks",
    label: "Compliance Risks",
    value: 6,
    icon: ShieldCheck,
    tone: "warn" as const,
    href: "/superuser/system/reminders",
  },
  {
    key: "facilityIssues",
    label: "Facility Issues",
    value: 2,
    icon: Building2,
    tone: "danger" as const,
    href: "/facilities/facilities",
  },
  {
    key: "eventsToday",
    label: "Events Today",
    value: 4,
    icon: Calendar,
    tone: "neutral" as const,
    href: "/facilities/shared-calendar",
  },
];

type QueueTone = "danger" | "warn" | "success" | "neutral";

const domainQueues = [
  {
    key: "core",
    title: "Core Structure",
    subtitle: "Sports, associations, facilities",
    icon: Building2,
    href: "/superuser/system/manage",
    items: [
      { label: "New association requests", value: 2, tone: "danger" as QueueTone, href: "/superuser/system/manage" },
      { label: "Facility issues reported", value: 2, tone: "danger" as QueueTone, href: "/facilities/facilities" },
      { label: "Profile updates pending", value: 3, tone: "warn" as QueueTone, href: "/profile" },
    ],
  },
  {
    key: "competition",
    title: "Competition & Leagues",
    subtitle: "Leagues, teams, fixtures",
    icon: Trophy,
    href: "/superuser/system/manage",
    items: [
      { label: "League approvals", value: 3, tone: "warn" as QueueTone, href: "/superuser/system/manage" },
      { label: "Team registrations", value: 5, tone: "neutral" as QueueTone, href: "/superuser/system/manage" },
      { label: "Fixture conflicts", value: 1, tone: "danger" as QueueTone, href: "/facilities/shared-calendar" },
    ],
  },
  {
    key: "people",
    title: "People & Roles",
    subtitle: "Users, coaches, volunteers",
    icon: Users,
    href: "/superuser/system/manage",
    items: [
      { label: "Role change requests", value: 3, tone: "danger" as QueueTone, href: "/superuser/system/manage" },
      { label: "Coach onboarding", value: 4, tone: "warn" as QueueTone, href: "/sports-development/associations/forms" },
      { label: "Volunteer intake", value: 2, tone: "neutral" as QueueTone, href: "/sports-development/associations/forms" },
    ],
  },
  {
    key: "governance",
    title: "Administration Governance",
    subtitle: "Safeguarding, policies, forms",
    icon: ClipboardSignature,
    href: "/sports-development/associations/forms",
    items: [
      { label: "Safeguarding checks due", value: 2, tone: "danger" as QueueTone, href: "/superuser/system/reminders" },
      { label: "Certifications expiring", value: 6, tone: "warn" as QueueTone, href: "/superuser/system/reminders" },
      { label: "Forms A/B/C submissions", value: 5, tone: "neutral" as QueueTone, href: "/sports-development/associations/forms" },
    ],
  },
];

type ScheduleType = "Course" | "Match" | "Facility" | "Governance";

const todayItems: Array<{ label: string; type: ScheduleType; icon: any; href: string }> = [
  { label: "First Aid Course (10:00)", type: "Course", icon: GraduationCap, href: "/superuser/system/reminders" },
  { label: "League Match — Hockey", type: "Match", icon: Trophy, href: "/facilities/shared-calendar" },
  { label: "Facility Inspection", type: "Facility", icon: Building2, href: "/facilities/facilities" },
];

const weekItems: Array<{ label: string; type: ScheduleType; icon: any; href: string }> = [
  { label: "Away Tournament", type: "Match", icon: Trophy, href: "/facilities/shared-calendar" },
  { label: "Safeguarding Seminar", type: "Governance", icon: ShieldCheck, href: "/superuser/system/reminders" },
  { label: "Volunteer Intake Session", type: "Course", icon: UserCheck, href: "/sports-development/associations/forms" },
];

const pulse = [
  { label: "Safeguarding Compliance", valueLabel: "98%", percent: 98, tone: "success" as const },
  { label: "First Aid Coverage", valueLabel: "Good", percent: 72, tone: "success" as const },
  { label: "Facility Readiness", valueLabel: "Needs Review", percent: 45, tone: "warn" as const },
  { label: "Data Completeness", valueLabel: "12 Missing", percent: 35, tone: "danger" as const },
  { label: "Form Compliance", valueLabel: "5 Pending", percent: 55, tone: "warn" as const },
];

const quickActions = [
  { label: "Add Sport", icon: Plus, href: "/superuser/system/manage" },
  { label: "Add Association", icon: Building2, href: "/superuser/system/manage" },
  { label: "Add Facility", icon: Building2, href: "/facilities/facilities" },
  { label: "Review Users", icon: Users, href: "/superuser/system/manage" },
  { label: "Form A", icon: ClipboardList, href: "/sports-development/associations/forms" },
  { label: "Form B", icon: ClipboardList, href: "/sports-development/associations/forms" },
  { label: "Form C", icon: ClipboardList, href: "/sports-development/associations/forms" },
  { label: "View Alerts", icon: AlertTriangle, href: "/superuser/system/reminders" },
  { label: "Reports", icon: BarChart, href: "/sports-development/reports" },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
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

function SectionTitle({
  icon: Icon,
  title,
  action,
}: {
  icon: any;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#0C2F57]" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function SuperuserDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-[linear-gradient(110deg,#0C2F57_0%,#174A84_70%,#0C2F57_100%)] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 shrink-0 text-blue-200" />
              <h1 className="text-3xl font-extrabold text-white">Operations Dashboard (Demo)</h1>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Original operations dashboard design. Values shown here are demonstration data.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Sample system status
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                <Clock3 className="h-4 w-4 text-amber-300" />
                6 items need review today
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                <Siren className="h-4 w-4 text-rose-300" />
                2 urgent facility issues
              </span>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-start gap-4 lg:w-[320px] lg:items-end">
            <Image
              src="/gsla-white.png"
              alt="GSLA"
              width={600}
              height={279}
              sizes="(min-width: 1024px) 208px, 176px"
              className="h-auto w-44 object-contain lg:w-52"
              priority
            />
            <div className="grid w-full grid-cols-2 gap-3">
              <Link
                href="/superuser/system/manage"
                className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#0C2F57] shadow-sm transition hover:bg-blue-50"
              >
                Review Queue
              </Link>
              <Link
                href="/superuser/system/reminders"
                className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                Open Alerts
              </Link>
              <Link
                href="/facilities/shared-calendar"
                className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                View Calendar
              </Link>
              <Link
                href="/superuser/system/import-export"
                className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                Export Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.key} href={s.href} className="group">
              <Card className="rounded-2xl border-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={["rounded-2xl p-4 ring-1", toneBadgeClasses(s.tone)].join(" ")}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600">{s.label}</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">{s.value}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main operations area */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Queues */}
        <Card className="xl:col-span-2 rounded-3xl border-slate-200">
          <CardContent className="p-6">
            <SectionTitle
              icon={Activity}
              title="Queues by Domain"
              action={
                <Link
                  href="/superuser/system/manage"
                  className="text-sm font-semibold text-[#0C2F57] hover:underline"
                >
                  Open Manage →
                </Link>
              }
            />

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {domainQueues.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.key} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#0C2F57]/10 p-2">
                          <Icon className="h-5 w-5 text-[#0C2F57]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{d.title}</div>
                          <div className="text-xs text-slate-600">{d.subtitle}</div>
                        </div>
                      </div>

                      <Link href={d.href} className="text-xs font-semibold text-[#0C2F57] hover:underline">
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
                          <span className="truncate text-sm font-medium text-slate-900">{it.label}</span>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                              toneBadgeClasses(it.tone),
                            ].join(" ")}
                          >
                            {it.value}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right rail */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200">
            <CardContent className="p-6">
              <SectionTitle icon={Calendar} title="Schedule" />

              <div className="mt-5">
                <div className="text-sm font-semibold text-slate-700">Today</div>
                <div className="mt-2 space-y-2">
                  {todayItems.map((it) => {
                    const Icon = it.icon;
                    return (
                      <Link
                        key={it.label}
                        href={it.href}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                      >
                        <Icon className="h-5 w-5 text-[#0C2F57]" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                          {it.label}
                        </span>
                        <span
                          className={[
                            "rounded-full px-2 py-1 text-[11px] font-bold ring-1",
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
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                      >
                        <Icon className="h-5 w-5 text-[#0C2F57]" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                          {it.label}
                        </span>
                        <span
                          className={[
                            "rounded-full px-2 py-1 text-[11px] font-bold ring-1",
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

          <Card className="rounded-3xl border-slate-200">
            <CardContent className="p-6">
              <SectionTitle icon={AlertTriangle} title="Priority Alerts" />
              <div className="mt-4 space-y-3">
                <Link
                  href="/superuser/system/reminders"
                  className="block rounded-2xl border border-red-200 bg-red-50 p-4 transition hover:bg-red-100"
                >
                  <div className="text-sm font-bold text-red-700">2 urgent facility issues</div>
                  <div className="mt-1 text-xs text-red-600">Immediate review required</div>
                </Link>

                <Link
                  href="/superuser/system/reminders"
                  className="block rounded-2xl border border-amber-200 bg-amber-50 p-4 transition hover:bg-amber-100"
                >
                  <div className="text-sm font-bold text-amber-700">6 certifications expiring</div>
                  <div className="mt-1 text-xs text-amber-600">Check upcoming renewals</div>
                </Link>

                <Link
                  href="/superuser/system/manage"
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <div className="text-sm font-bold text-slate-900">7 items awaiting approval</div>
                  <div className="mt-1 text-xs text-slate-600">Open the approvals queue</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pulse + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-3xl border-slate-200">
          <CardContent className="p-6">
            <SectionTitle icon={ShieldCheck} title="Governance Pulse" />

            <div className="mt-5 space-y-4">
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

        <Card className="rounded-3xl border-slate-200">
          <CardContent className="p-6">
            <SectionTitle icon={Plus} title="Quick Actions" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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

      {/* Tools & Administration */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C2F57]">Tools & Administration</h2>
          <p className="mt-1 text-sm text-slate-600">
            Jump into statistics, content, forms, data tools and reminders.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.title} href={t.href} className="group">
                <Card className="h-full rounded-2xl border-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex h-[150px] items-start gap-4 p-5">
                    <div className={`rounded-2xl p-4 ${t.tint}`}>
                      <Icon className={t.iconColor} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{t.title}</div>
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
