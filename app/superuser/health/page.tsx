import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Activity, ArrowLeft, ArrowRight, CheckCircle2, Clock3, Database,
  Globe2, Info, Link2, RotateCw, Server, ShieldCheck,
  TriangleAlert, type LucideIcon,
} from "lucide-react";

// Repeat checks on every request; health must never be a cached claim.
export const dynamic = "force-dynamic";

type CheckState = "responding" | "unavailable" | "unmonitored";
type Check = { name: string; icon: LucideIcon; state: CheckState; detail: string; scope: string };

async function databaseCheck(): Promise<Check> {
  const base = { name: "Database", icon: Database, scope: "A simple database connectivity query" };
  if (!process.env.DATABASE_URL) {
    return { ...base, state: "unavailable", detail: "Database connection is not configured for this deployment." };
  }
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Check timed out")), 4000);
      }),
    ]);
    return { ...base, state: "responding", detail: "The database accepted a connectivity query." };
  } catch {
    return { ...base, state: "unavailable", detail: "The database did not respond to the connectivity check." };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

const stateStyles: Record<CheckState, { badge: string; icon: string; label: string }> = {
  responding: { badge: "bg-emerald-50 text-emerald-800", icon: "bg-emerald-50 text-emerald-700", label: "Responding" },
  unavailable: { badge: "bg-rose-50 text-rose-800", icon: "bg-rose-50 text-rose-700", label: "Unavailable" },
  unmonitored: { badge: "bg-slate-100 text-slate-600", icon: "bg-blue-50 text-[#174a84]", label: "Not monitored" },
};

function HealthCard({ check }: { check: Check }) {
  const Icon = check.icon;
  const style = stateStyles[check.state];
  return (
    <article className="rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${style.icon}`}><Icon size={27} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>{style.label}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#102b59]">{check.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[#526f98]">{check.detail}</p>
      <p className="mt-3 border-t border-[#e5edf8] pt-3 text-xs text-[#637da2]">{check.scope}</p>
    </article>
  );
}

export default async function HealthDashboard() {
  const database = await databaseCheck();
  const checks: Check[] = [
    { name: "WebApp", icon: Globe2, state: "responding", detail: "This Health Dashboard request completed successfully.", scope: "Checks this page response only, not the entire site" },
    database,
    { name: "Security", icon: ShieldCheck, state: "unmonitored", detail: "No security event monitoring is connected.", scope: "Authentication and security checks are not included" },
    { name: "Integrations", icon: Link2, state: "unmonitored", detail: "No integration health checks are connected.", scope: "External services have not been checked" },
    { name: "Services", icon: Server, state: "unmonitored", detail: "No background service monitoring is connected.", scope: "Jobs and other services have not been checked" },
  ];
  const responding = checks.filter((check) => check.state === "responding").length;
  const unavailable = checks.filter((check) => check.state === "unavailable").length;
  const unmonitored = checks.filter((check) => check.state === "unmonitored").length;
  const checkedAt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date());

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f1f7ff_100%)] text-[#142542]">
      <header className="border-b border-[#dfe8f4] bg-white/90">
        <div className="mx-auto flex min-h-20 max-w-[1500px] flex-wrap items-center gap-4 px-5 py-3 md:px-8">
          <Link href="/superuser/dashboard" aria-label="GSLA organisation dashboard" className="mr-auto flex items-center"><Image src="/gsla-transp-logo.png" alt="GSLA" width={125} height={70} className="h-12 w-auto max-w-32 object-contain" priority /></Link>
          <Link href="/superuser/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d7e1ef] px-4 text-sm font-semibold text-[#16365f] hover:bg-blue-50"><ArrowLeft size={17} aria-hidden="true" />Organisation Dashboard</Link>
          <span className="rounded-full bg-[#315d90] px-3 py-2 text-sm font-semibold text-white" aria-label="SuperUser account">SU</span>
          <span className="hidden text-sm font-medium sm:inline">SuperUser</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-5 px-5 py-6 md:px-8">
        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#143960_0%,#10447e_55%,#0e5195_100%)] px-7 py-9 text-white shadow-sm md:px-11 md:py-11">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-0 h-80 w-[65%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_36px_rgba(255,255,255,0.025),0_0_0_85px_rgba(255,255,255,0.018)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA SuperUser</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">Health Dashboard</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-50 md:text-xl">A clear view of the checks currently available for the GSLA WebApp.</p></div>
            <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Reliable systems<br />Clear visibility</p>
          </div>
        </section>

        <section aria-label="Check summary" className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><CheckCircle2 size={31} className="text-emerald-700" aria-hidden="true" /><div><p className="text-3xl font-bold">{responding}</p><p className="text-sm text-[#526f98]">Responding checks</p></div></div>
          <div className="flex items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><TriangleAlert size={31} className="text-rose-700" aria-hidden="true" /><div><p className="text-3xl font-bold">{unavailable}</p><p className="text-sm text-[#526f98]">Unavailable checks</p></div></div>
          <div className="flex items-center gap-4 rounded-xl border border-[#d5e4f6] bg-white p-5 shadow-sm"><Info size={31} className="text-[#174a84]" aria-hidden="true" /><div><p className="text-3xl font-bold">{unmonitored}</p><p className="text-sm text-[#526f98]">Not monitored</p></div></div>
        </section>

        <section className="rounded-2xl border border-[#dfe7f2] bg-white p-5 shadow-sm md:p-6" aria-labelledby="systems-heading">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="systems-heading" className="flex items-center gap-3 text-2xl font-bold"><Activity size={25} className="text-[#174a84]" aria-hidden="true" />System Checks</h2><p className="mt-1 text-sm text-[#526f98]">Statuses describe only the checks listed on this page.</p></div><form action="/superuser/health"><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#b8d4f5] px-4 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><RotateCw size={17} aria-hidden="true" />Run checks again</button></form></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{checks.map((check) => <HealthCard key={check.name} check={check} />)}</div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-[#dfe7f2] bg-white p-5 shadow-sm md:p-6" aria-labelledby="coverage-heading"><h2 id="coverage-heading" className="text-xl font-bold">Monitoring Coverage</h2><p className="mt-2 text-sm leading-6 text-[#526f98]">This page checks whether it can render and whether the database accepts a simple query. It does not yet measure uptime, other pages, sign-in security, integrations, background services or historical incidents.</p><p className="mt-4 flex items-center gap-2 text-sm text-[#526f98]"><Clock3 size={17} aria-hidden="true" />Last checked: {checkedAt} UTC</p></section>
          <section className="rounded-2xl border border-[#dfe7f2] bg-white p-5 shadow-sm md:p-6" aria-labelledby="links-heading"><h2 id="links-heading" className="text-xl font-bold">Quick Links</h2><div className="mt-4 space-y-3"><Link href="/superuser/dashboard" className="flex items-center justify-between rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50">Organisation Dashboard <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/human-resources/dashboard" className="flex items-center justify-between rounded-xl border border-[#d5e4f6] px-4 py-3 text-sm font-semibold text-[#155ca7] hover:bg-blue-50">Human Resources <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
        </div>
      </main>
    </div>
  );
}
