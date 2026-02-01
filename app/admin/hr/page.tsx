import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, CalendarDays, FileText, Users, ArrowRight, Clock } from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Tile({
  href,
  title,
  description,
  icon: Icon,
  tone = "slate",
  badge,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone?: "slate" | "indigo" | "emerald" | "amber";
  badge?: string;
}) {
  const toneCls =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
      : tone === "emerald"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className={classNames("rounded-xl p-2 ring-1", toneCls)}>
          <Icon size={18} className="opacity-90" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
            {badge ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {badge}
              </span>
            ) : null}
          </div>

          <div className="mt-1 text-sm text-slate-600">{description}</div>

          <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0C2F57]">
            Open <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HRDashboardPage() {
  return (
    <div>
      {/* PAGE TITLE (same style as Community Events) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Human Resources</h1>
          <p className="mt-2 text-slate-600">
            Central place for leave, timesheets, and HR administration workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <Clock size={16} className="text-slate-500" />
            Saturday → Saturday payroll week
          </span>
        </div>
      </div>

      {/* QUICK MODULES */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Tile
              href="/admin/hr/timesheets"
              title="Timesheets"
              description="Facility week packs → CM submits → HR/Accounts review → lock & export for Treasury."
              icon={ClipboardList}
              tone="indigo"
              badge="Live"
            />
            <Tile
              href="/admin/hr/leave"
              title="Leave management"
              description="Digital leave requests, approvals, attachments and audit trail (add next)."
              icon={CalendarDays}
              tone="amber"
              badge="Next"
            />
            <Tile
              href="/admin/hr/employees"
              title="Employees"
              description="Profiles, roles, departments and contracts (optional module)."
              icon={Users}
              tone="emerald"
              badge="Optional"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECONDARY LINKS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardContent className="p-5">
            <div className="text-sm font-semibold text-slate-900">What’s working now</div>
            <p className="mt-2 text-sm text-slate-600">
              Your Timesheets module is now themed consistently and backed by Supabase/Postgres tables via Prisma. Next
              step is adding “Create week pack (choose facility)” + “Add/Edit shift” flows, then submit/lock/export.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/admin/hr/timesheets/weeks"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Go to weeks inbox <ArrowRight size={16} />
              </Link>
              <Link
                href="/admin/hr/timesheets/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Timesheet settings
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardContent className="p-5">
            <div className="text-sm font-semibold text-slate-900">Planned next</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                Facility picker for week pack creation (no more env default).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                Add/Edit shift entry drawer (staff, times, reason codes, notes).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                Submit/Return/Lock/Export server actions + audit log.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                Leave module (requests + approvals + calendar).
              </li>
            </ul>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <FileText size={14} className="text-slate-500" />
                Note
              </div>
              <div className="mt-1 text-sm text-slate-700">
                If you already have sidebar links for HR, this page becomes the “home” dashboard.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
