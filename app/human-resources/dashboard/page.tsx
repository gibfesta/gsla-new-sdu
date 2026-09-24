import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Clock3,
  FileText, RotateCcw, Settings, UsersRound, type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Week = { id: string; week_start: Date; week_end: Date; status: string };
type WeekGroup = { status: string; _count: { _all: number } };

async function getTimesheetSummary(): Promise<{ weeks: Week[]; counts: Record<string, number> } | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [weeks, groups] = await Promise.all([
      prisma.timesheet_week_packs.findMany({
        select: { id: true, week_start: true, week_end: true, status: true },
        orderBy: { week_start: "desc" },
        take: 5,
      }),
      prisma.timesheet_week_packs.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    return {
      weeks,
      counts: Object.fromEntries(groups.map((group: WeekGroup) => [group.status, group._count._all])),
    };
  } catch {
    return null;
  }
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return (
    <article className="flex min-h-32 items-start gap-4 rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eaf2fc] text-[#174a84]"><Icon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
      <div><h2 className="text-sm font-semibold text-[#35557f]">{label}</h2><p className="mt-1 text-3xl font-bold text-[#102b59]">{value}</p><p className="mt-1 text-xs text-[#637da2]">{note}</p></div>
    </article>
  );
}

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

const modules = [
  { title: "Timesheets", description: "Review facility week packs and payroll status.", href: "/human-resources/timesheets/weeks", icon: ClipboardList, state: "Database connected" },
  { title: "Employees", description: "Explore employee profiles and departments.", href: "/human-resources/employees", icon: UsersRound, state: "Example records" },
  { title: "Leave Management", description: "Review leave requests and approvals.", href: "/human-resources/leave", icon: CalendarDays, state: "Example requests" },
] as const;

export default async function HRDashboardPage() {
  const summary = await getTimesheetSummary();
  const counts = summary?.counts;
  const count = (keys: string[]) => counts ? String(keys.reduce((total, key) => total + (counts[key] ?? 0), 0)) : "—";
  const note = summary ? "From timesheet week packs" : "Database currently unavailable";
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Human Resources</p><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl">Human Resources Dashboard</h1><p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">Support our people, track timesheets and keep HR work moving.</p></div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Stronger people<br />Stronger teams</p>
        </div>
      </section>

      <section aria-label="Timesheet overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Week Packs" value={count(["DRAFT", "SUBMITTED", "RETURNED", "LOCKED", "SENT"])} note={note} icon={ClipboardList} />
        <Metric label="Awaiting Review" value={count(["SUBMITTED"])} note={note} icon={Clock3} />
        <Metric label="Returned" value={count(["RETURNED"])} note={note} icon={RotateCcw} />
        <Metric label="Locked / Sent" value={count(["LOCKED", "SENT"])} note={note} icon={CheckCircle2} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Human Resources modules">
        {modules.map(({ title, description, href, icon: Icon, state }) => (
          <Link key={title} href={href} className="group rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm transition hover:border-[#8ab8eb] hover:bg-[#f8fbff]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2fc] text-[#174a84]"><Icon size={24} aria-hidden="true" /></span>
            <h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 min-h-10 text-sm text-[#60799f]">{description}</p>
            <div className="mt-4 flex items-center justify-between gap-2"><span className="rounded-full bg-[#eef5fd] px-3 py-1 text-xs font-medium text-[#42648c]">{state}</span><ArrowRight size={18} className="text-[#155ca7] transition group-hover:translate-x-1" aria-hidden="true" /></div>
          </Link>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="recent-weeks-heading">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="recent-weeks-heading" className="text-xl font-bold">Recent Timesheet Weeks</h2><p className="mt-1 text-sm text-[#60799f]">The latest week packs from the HR database.</p></div><Link href="/human-resources/timesheets/weeks" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline">View weeks inbox <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="mt-5 divide-y divide-[#e5edf8]">
            {summary?.weeks.length ? summary.weeks.map((week) => (
              <Link key={week.id} href={`/human-resources/timesheets/weeks/${week.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm hover:bg-[#f8fbff]"><span className="font-semibold">{dateLabel(week.week_start)} – {dateLabel(week.week_end)}</span><span className="rounded-lg bg-[#eef5fd] px-2.5 py-1 text-xs font-semibold text-[#35557f]">{week.status}</span></Link>
            )) : <p className="rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-4 py-8 text-center text-sm text-[#637da2]">{summary ? "No timesheet week packs yet." : "Timesheet data is currently unavailable."}</p>}
          </div>
        </section>
        <section className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm" aria-labelledby="hr-actions-heading">
          <h2 id="hr-actions-heading" className="text-xl font-bold">HR Workspaces</h2><p className="mt-1 text-sm text-[#60799f]">Open the tools already available.</p>
          <div className="mt-5 space-y-3">
            <Link href="/human-resources/timesheets" className="flex items-center gap-3 rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><ClipboardList size={19} aria-hidden="true" />Timesheets <ArrowRight size={16} className="ml-auto" aria-hidden="true" /></Link>
            <Link href="/human-resources/timesheets/settings" className="flex items-center gap-3 rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><Settings size={19} aria-hidden="true" />Timesheet settings <ArrowRight size={16} className="ml-auto" aria-hidden="true" /></Link>
          </div>
          <p className="mt-5 flex gap-2 rounded-xl bg-[#f5f9ff] p-3 text-xs leading-5 text-[#60799f]"><FileText size={17} className="shrink-0" aria-hidden="true" />Employee and leave pages currently show example records. Live counts will be added when those sources are connected.</p>
        </section>
      </div>
    </div>
  );
}
