import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, ArrowLeft, BadgeCheck, Undo2, Lock, Download } from "lucide-react";
import WeekGridDemo from "@/components/hr/timesheets/WeekGridDemo";

type WeekStatus = "DRAFT" | "SUBMITTED" | "RETURNED" | "LOCKED" | "SENT";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "red" | "amber" | "emerald" | "indigo";
}) {
  const toneCls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : tone === "red"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : tone === "indigo"
            ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
            : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1", toneCls)}>
      {children}
    </span>
  );
}

function statusTone(s: WeekStatus): "slate" | "amber" | "emerald" | "red" | "indigo" {
  if (s === "LOCKED") return "emerald";
  if (s === "SUBMITTED") return "amber";
  if (s === "DRAFT") return "slate";
  if (s === "SENT") return "indigo";
  return "red"; // RETURNED
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function hoursBetween(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startM = sh * 60 + sm;
  const endM = eh * 60 + em;
  const diff = Math.max(0, endM - startM);
  return Number((diff / 60).toFixed(2));
}

export default async function TimesheetWeekPackPage(props: { params: any }) {
  // Works whether Next passes params as an object OR as a Promise-like value
  const resolvedParams = await Promise.resolve(props.params);
  const id = resolvedParams?.id as string | undefined;

  if (!id) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
        Missing week id.
      </div>
    );
  }

  // UI-only demo route: /admin/hr/timesheets/weeks/demo-week
  if (id === "demo-week") {
    return (
      <div>
        <Link
          href="/admin/hr/timesheets/weeks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C2F57] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to weeks
        </Link>

        <div className="mt-4">
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Week pack (demo)</h1>
          <p className="mt-2 text-slate-600">UI-only preview of the new OT / FM / TO grid (no database required).</p>
        </div>

        <WeekGridDemo />
      </div>
    );
  }

  // Real DB-backed page for actual week packs
  const weekPack = await prisma.timesheet_week_packs.findUnique({
    where: { id },
    include: {
      shifts: { orderBy: [{ date: "asc" }] },
    },
  });

  if (!weekPack) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
        Week pack not found.
      </div>
    );
  }

  const status = weekPack.status as unknown as WeekStatus;

  const totalHours = weekPack.shifts.reduce((sum, s) => sum + hoursBetween(s.actual_start, s.actual_end), 0);

  return (
    <div>
      <Link
        href="/admin/hr/timesheets/weeks"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C2F57] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to weeks
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-4xl font-extrabold text-[#0C2F57]">Week pack</h1>
            <Pill tone={statusTone(status)}>{status}</Pill>
          </div>
          <p className="mt-2 text-slate-600">
            Facility ID: <span className="font-semibold text-slate-900">{weekPack.facility_id}</span> ·{" "}
            <span className="font-semibold text-slate-900">{fmtDate(weekPack.week_start)}</span> →{" "}
            <span className="font-semibold text-slate-900">{fmtDate(weekPack.week_end)}</span> (Saturday → Saturday)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            <BadgeCheck size={16} />
            Approve &amp; submit (CM)
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <Undo2 size={16} />
            Return
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <Lock size={16} />
            Lock
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Summary</div>
                <div className="mt-1 text-xs text-slate-600">Auto-calculated from shift entries.</div>
              </div>
              <Pill tone="slate">
                <ClipboardList size={14} />
                Totals
              </Pill>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-600">Total hours (actual)</div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">{totalHours.toFixed(2)}</div>
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Next</div>
                <div className="mt-1">
                  We’ll replace buttons above with server actions (submit/return/lock/export) and wire the OT/FM/TO grid
                  to real staff + rota templates.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Week grid</div>
                <div className="mt-1 text-xs text-slate-600">OT / FM / TO dropdown grid (demo component for now).</div>
              </div>
              <Pill tone="slate">Sat → Fri</Pill>
            </div>

            <WeekGridDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
