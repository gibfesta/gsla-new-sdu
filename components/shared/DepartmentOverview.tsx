import Link from "next/link";

export type OverviewLink = { label: string; href: string; detail?: string };

export default function DepartmentOverview({ title, description, links }: {
  title: string;
  description: string;
  links: OverviewLink[];
}) {
  return (
    <div className="space-y-8">
      <header className="rounded-[28px] bg-[#0C2F57] px-8 py-10 text-white">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 max-w-2xl text-white/80">{description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ label, href, detail }) => (
          <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#0C2F57]">
            <h2 className="text-lg font-bold text-[#0C2F57]">{label} →</h2>
            {detail && <p className="mt-2 text-sm text-slate-600">{detail}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
