import Image from "next/image";
import Link from "next/link";
import {
  Activity, ArrowRight, Building2, Database, Globe2, Info, Landmark,
  ShieldCheck, UsersRound, Link2, Server,
  type LucideIcon,
} from "lucide-react";

type Department = {
  name: string;
  description: string;
  href: string;
  action: string;
  icon: LucideIcon;
  iconStyle: string;
  metrics: string[];
};

const departments: Department[] = [
  {
    name: "Facilities",
    description: "Manage venues, events, maintenance and compliance.",
    href: "/facilities/dashboard",
    action: "View Facilities",
    icon: Building2,
    iconStyle: "bg-blue-50 text-blue-700",
    metrics: ["Venues", "Open Issues", "Today's Events", "Tasks Due"],
  },
  {
    name: "Sports Development Unit",
    description: "Support sport, clubs, associations and community programmes.",
    href: "/sports-development/dashboard",
    action: "View Sports Development",
    icon: UsersRound,
    iconStyle: "bg-emerald-50 text-emerald-700",
    metrics: ["Active Programmes", "Clubs / Associations", "Pending Approvals", "Upcoming Events"],
  },
  {
    name: "Human Resources",
    description: "Manage people, contracts, training and performance.",
    href: "/human-resources/dashboard",
    action: "View Human Resources",
    icon: UsersRound,
    iconStyle: "bg-orange-50 text-amber-700",
    metrics: ["Total Staff", "On Leave", "Training Due", "Pending Actions"],
  },
  {
    name: "Finance Department",
    description: "Track budgets, purchases, invoices and financial reports.",
    href: "/finance/dashboard",
    action: "View Finance",
    icon: Landmark,
    iconStyle: "bg-violet-50 text-violet-700",
    metrics: ["Annual Budget", "Pending Invoices", "Purchase Requests", "Monthly Reports"],
  },
];

const systems = [
  { name: "WebApp", icon: Globe2 },
  { name: "Database", icon: Database },
  { name: "Security", icon: ShieldCheck },
  { name: "Integrations", icon: Link2 },
  { name: "Services", icon: Server },
];

export default function SuperuserDashboard() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f1f7ff_100%)] text-[#142542]">
      <main className="mx-auto max-w-[1500px] space-y-4 px-5 py-4 md:px-8">
        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#143960_0%,#10447e_55%,#0e5195_100%)] px-7 pb-7 pt-14 text-white shadow-sm md:px-9 md:pb-7 md:pt-10">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-0 h-80 w-[65%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_36px_rgba(255,255,255,0.025),0_0_0_85px_rgba(255,255,255,0.018)]" />
          <div className="absolute right-7 top-4 z-10 flex items-center gap-2 md:right-9"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold text-white" aria-label="SuperUser account">SU</span><span className="text-xs font-medium text-white">SuperUser</span></div>
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA SuperUser</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Organisation Dashboard</h1>
              <p className="mt-3 text-base leading-snug text-blue-50 md:text-lg">Four departments. One connected platform.<br />Supporting safer venues, stronger people and a thriving sporting community.</p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
              <Image src="/gsla-white.png" alt="GSLA" width={600} height={279} sizes="(min-width: 768px) 208px, 176px" className="h-auto w-36 object-contain md:w-44" />
              <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100 md:text-right">People<br />Facilities<br />Opportunities<br />Stronger together</p>
            </div>
          </div>
        </section>

        <section aria-label="Departments" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {departments.map((department) => {
            const Icon = department.icon;
            return (
              <article key={department.name} className="flex min-h-[270px] flex-col rounded-2xl border border-[#dfe7f2] bg-white p-5 shadow-[0_6px_22px_rgba(27,66,113,0.035)]">
                <div className="flex items-start gap-4">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${department.iconStyle}`}><Icon size={26} strokeWidth={1.9} aria-hidden="true" /></span>
                  <div><h2 className="text-lg font-bold leading-6">{department.name}</h2><p className="mt-2 text-sm leading-5 text-[#52617a]">{department.description}</p></div>
                </div>
                <div className="mt-auto pt-3" aria-label={`${department.name} metrics awaiting connection`}>
                  {department.metrics.map((metric) => <div key={metric} className="flex justify-between gap-3 border-b border-[#edf1f7] py-1 text-sm text-[#52617a]"><span>{metric}</span><span className="font-semibold text-[#8190a5]" aria-label="Data unavailable">—</span></div>)}
                </div>
                <Link className="mt-3 inline-flex w-fit items-center gap-2 font-semibold text-[#1265b5] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1265b5]" href={department.href}>{department.action}<ArrowRight size={19} aria-hidden="true" /></Link>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-[#dfe7f2] bg-white p-4 shadow-[0_6px_22px_rgba(27,66,113,0.035)] md:p-5" aria-labelledby="health-title">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#194e85]"><Activity size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div><h2 id="health-title" className="text-xl font-bold">Health Dashboard</h2><p className="mt-1 text-[#52617a]">Monitor the health, security and performance of the GSLA WebApp.</p></div>
            </div>
            <p className="text-sm font-semibold text-amber-700">Monitoring not connected<br /><span className="font-normal text-[#52617a]">Live status unavailable</span></p>
          </div>
          <div className="mt-4 flex flex-wrap items-stretch gap-2">
            {systems.map(({ name, icon: Icon }) => <div key={name} className="flex min-w-[145px] flex-1 items-center gap-2 rounded-xl border border-[#dfe7f2] px-3 py-2"><Icon size={25} className="shrink-0 text-[#163b67]" aria-hidden="true" /><div><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-[#69788d]">Not connected</p></div></div>)}
            <Link href="/superuser/health" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#87b9ec] px-4 font-semibold text-[#1265b5] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1265b5]">View System Health <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>

        <aside className="flex items-start gap-3 rounded-2xl border border-[#cce2fc] bg-[#eef6ff] px-5 py-3 text-sm text-[#52617a]">
          <Info size={23} className="shrink-0 text-[#1d72c5]" aria-hidden="true" />
          <p><strong className="text-[#1265b5]">SuperUser Tip:</strong> Select a department above to view detailed information, manage activity and take action.<br />Less typing, faster navigation, more time for what matters.</p>
        </aside>
      </main>
    </div>
  );
}
