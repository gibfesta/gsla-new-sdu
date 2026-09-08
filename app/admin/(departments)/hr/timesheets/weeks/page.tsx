import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Plus, Building2 } from "lucide-react";

type WeekStatus = "DRAFT" | "SUBMITTED" | "RETURNED" | "LOCKED" | "SENT";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function statusTone(s: WeekStatus): "slate" | "amber" | "emerald" | "red" | "indigo" {
  if (s === "LOCKED") return "emerald";
  if (s === "SUBMITTED") return "amber";
  if (s === "DRAFT") return "slate";
  if (s === "SENT") return "indigo";
  return "red"; // RETURNED
}

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

function startOfPayrollWeekSaturday(date = new Date()) {
  // returns the Saturday on/before the given date (UTC-based)
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = (day + 1) % 7; // Sat => 0, Sun => 1, Mon => 2, ...
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

export default async function TimesheetWeeksPage() {
  const weeks = await prisma.timesheet_week_packs.findMany({
    orderBy: { week_start: "desc" },
    take: 50,
  });

  async function createWeekPack() {
    "use server";

    const facilityId = process.env.TIMESHEETS_DEFAULT_FACILITY_ID;
    if (!facilityId) {
      throw new Error('Missing TIMESHEETS_DEFAULT_FACILITY_ID in .env (set it to a facility UUID).');
    }

    const weekStart = startOfPayrollWeekSaturday(new Date());
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

    await prisma.timesheet_week_packs.upsert({
      where: {
        facility_id_week_start: {
          facility_id: facilityId,
          week_start: weekStart,
        },
      },
      update: {},
      create: {
        facility_id: facilityId,
        week_start: weekStart,
        week_end: weekEnd,
        status: "DRAFT",
      },
    });

    revalidatePath("/admin/hr/timesheets/weeks");
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Timesheet weeks</h1>
          <p className="mt-2 text-slate-600">Saturday → Saturday · One Centre Manager approval required</p>
        </div>

        <form action={createWeekPack}>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            <Plus size={16} />
            Create this week (default facility)
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4">
  <div className="text-sm font-semibold text-slate-900">Demo shortcut</div>
  <p className="mt-1 text-sm text-slate-600">Temporary link to preview the Week Grid UI without DB data.</p>
  <a href="/admin/hr/timesheets/weeks/demo-week" className="mt-3 inline-block rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white">Open demo week</a>
</div>

<Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Week packs</div>
              <div className="mt-1 text-xs text-slate-600">{weeks.length} shown</div>
            </div>
            <Pill tone="slate">
              <ClipboardList size={14} />
              Inbox
            </Pill>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-600">
                  <th className="px-5 py-3">Facility</th>
                  <th className="px-5 py-3">Week</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => {
                  const status = (w.status as unknown as WeekStatus) || "DRAFT";
                  return (
                    <tr key={w.id} className="border-t border-slate-100">
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-900">
                          <span className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
                            <Building2 size={14} className="text-slate-600" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-900">{w.facility_id}</div>
                            <div className="mt-0.5 text-xs text-slate-600">Facility ID (replace with name next)</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {fmtDate(w.week_start)} → {fmtDate(w.week_end)}
                      </td>
                      <td className="px-5 py-4">
                        <Pill tone={statusTone(status)}>{status}</Pill>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/hr/timesheets/weeks/${w.id}`}
                          className="text-sm font-semibold text-[#0C2F57] hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {weeks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-600">
                      No week packs yet. Set <code className="rounded bg-slate-100 px-1.5 py-0.5">TIMESHEETS_DEFAULT_FACILITY_ID</code>{" "}
                      in <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> then click “Create this week”.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
