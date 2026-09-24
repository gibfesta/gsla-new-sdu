import Link from "next/link";
import {
  ArrowRight, BarChart3, CalendarDays, ClipboardList, FileText, Trophy,
  UserRoundPlus, UsersRound, type LucideIcon,
} from "lucide-react";

type Metric = { label: string; icon: LucideIcon };
const metrics: Metric[] = [
  { label: "Total Participants", icon: UsersRound },
  { label: "Total Teams", icon: UsersRound },
  { label: "Coaches", icon: UserRoundPlus },
  { label: "Sports / Associations", icon: Trophy },
];

function Panel({ title, description, children, className = "" }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      <h2 className="text-lg font-bold text-[#102b59]">{title}</h2>
      {description && <p className="mt-1 text-sm text-[#60799f]">{description}</p>}
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#cadcf2] bg-[#f8fbff] px-5 py-8 text-center text-sm leading-6 text-[#637da2]">{text}</div>;
}

export default function SportsDevelopmentDashboard() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Sports Development Unit</p>
            <h1 className="mt-3 max-w-[900px] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl">Sports Development Unit Dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">Developing sport. Supporting people. Building stronger communities.</p>
          </div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">More participation<br />Brighter opportunities</p>
        </div>
      </section>

      <section aria-label="Sports Development Unit summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, icon: Icon }) => (
          <article key={label} className="flex min-h-32 items-start gap-4 rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eaf2fc] text-[#174a84]"><Icon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
            <div><h2 className="text-sm font-semibold text-[#35557f]">{label}</h2><p className="mt-1 text-3xl font-bold text-[#102b59]">—</p><p className="mt-1 text-xs text-[#637da2]">Live data not connected</p></div>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Panel title="Participation Trend" description="Total participants across all sports (last 12 months)">
          <div className="mt-4"><EmptyState text="Participation trends will appear here when reporting data is connected." /></div>
        </Panel>
        <Panel title="Participants by Sport" description="Participation breakdown across sports">
          <div className="mt-4"><EmptyState text="The sport breakdown will appear here when participant data is connected." /></div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Upcoming Events"><div className="mt-4"><EmptyState text="Upcoming events will appear here when the calendar is connected." /></div></Panel>
        <Panel title="Recent Activity"><div className="mt-4"><EmptyState text="Recent sports activity will appear here when activity data is connected." /></div></Panel>
        <Panel title="Actions Required"><div className="mt-4"><EmptyState text="Actions requiring attention will appear here when tasks are connected." /></div></Panel>
      </div>

      <section className="rounded-xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5" aria-labelledby="quick-links-heading">
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="quick-links-heading" className="mr-auto text-lg font-bold">Quick Links</h2>
          {[
            { label: "Add Participant", icon: UserRoundPlus },
            { label: "Add Coach", icon: UserRoundPlus },
            { label: "Create Event", icon: CalendarDays },
            { label: "Upload Document", icon: FileText },
          ].map(({ label, icon: Icon }) => <span key={label} aria-disabled="true" title="Coming soon" className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-[#d5e4f6] bg-[#f8fbff] px-4 text-sm text-[#7890ad]"><Icon size={20} aria-hidden="true" />{label}</span>)}
          <Link href="/sports-development/reports" className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-[#b8d4f5] px-4 text-sm font-medium text-[#155ca7] hover:bg-blue-50"><BarChart3 size={20} aria-hidden="true" />View Reports <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-[#e5edf8] pt-4 text-sm">
          <Link href="/sports-development/sports" className="inline-flex items-center gap-2 font-medium text-[#155ca7] hover:underline"><Trophy size={17} aria-hidden="true" />Browse Sports</Link>
          <Link href="/sports-development/teams" className="inline-flex items-center gap-2 font-medium text-[#155ca7] hover:underline"><UsersRound size={17} aria-hidden="true" />View Teams</Link>
          <Link href="/sports-development/associations/forms" className="inline-flex items-center gap-2 font-medium text-[#155ca7] hover:underline"><ClipboardList size={17} aria-hidden="true" />Association Forms</Link>
        </div>
      </section>
    </div>
  );
}
