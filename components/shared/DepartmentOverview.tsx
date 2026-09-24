import Link from "next/link";
import { ArrowRight, Building2, HeartPulse, Landmark, Settings, Trophy, Users, type LucideIcon } from "lucide-react";

type Tone = "navy" | "gold" | "red" | "green" | "slate";
export type OverviewLink = { label: string; href: string; detail?: string; icon?: LucideIcon; tone?: Tone };

const tones: Record<Tone, { bar: string; soft: string; text: string; border: string }> = {
  navy: { bar: "bg-[#0C2F57]", soft: "bg-[#0C2F57]/10", text: "text-[#0C2F57]", border: "border-[#0C2F57]/20" },
  gold: { bar: "bg-[#F2B705]", soft: "bg-[#F2B705]/15", text: "text-[#B45309]", border: "border-[#F2B705]/30" },
  red: { bar: "bg-[#D81E27]", soft: "bg-[#D81E27]/10", text: "text-[#D81E27]", border: "border-[#D81E27]/20" },
  green: { bar: "bg-emerald-600", soft: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  slate: { bar: "bg-slate-600", soft: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

function appearance(href: string): { icon: LucideIcon; tone: Tone } {
  if (href.startsWith("/facilities")) return { icon: Building2, tone: "navy" };
  if (href.startsWith("/sports-development")) return { icon: Trophy, tone: "gold" };
  if (href.startsWith("/human-resources")) return { icon: Users, tone: "red" };
  if (href.startsWith("/finance")) return { icon: Landmark, tone: "green" };
  if (href.includes("health")) return { icon: HeartPulse, tone: "red" };
  return { icon: Settings, tone: "slate" };
}

export default function DepartmentOverview({ title, description, links, badge = "GSLA Home", sectionTitle = "Main Departments" }: {
  title: string;
  description: string;
  links: OverviewLink[];
  badge?: string;
  sectionTitle?: string;
}) {
  return (
    <div className="space-y-10">
      <section className="rounded-[36px] border border-slate-200 bg-white px-8 py-14 text-center shadow-sm md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{badge}</div>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-[#0C2F57] md:text-6xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">{description}</p>
        </div>
      </section>
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#0C2F57]">{sectionTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{links.length} areas. One entry point.</p>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {links.map(({ label, detail, href, icon, tone }) => {
            const defaults = appearance(href);
            const Icon = icon ?? defaults.icon;
            const style = tones[tone ?? defaults.tone];
            return (
              <Link key={href} href={href} className={`group relative overflow-hidden rounded-[32px] border ${style.border} bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-1.5 hover:shadow-xl`}>
                <div className={`absolute left-0 top-0 h-2 w-full ${style.bar}`} />
                <div className={`inline-flex rounded-2xl p-4 ${style.soft}`}><Icon size={28} className={style.text} /></div>
                <h3 className="mt-6 max-w-[18ch] text-2xl font-extrabold leading-tight text-slate-900">{label}</h3>
                {detail && <p className="mt-3 max-w-[34ch] text-sm leading-6 text-slate-600">{detail}</p>}
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">Enter area <ArrowRight size={16} className="transition group-hover:translate-x-1" /></div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
