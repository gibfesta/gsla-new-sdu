import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Landmark,
  Trophy,
  Settings,
} from "lucide-react";

const departments = [
  {
    title: "Facilities Department",
    subtitle: "Bookings, issues, inspections and operations",
    href: "/admin/facilities",
    icon: Building2,
    tone: {
      bg: "bg-[#0C2F57]",
      soft: "bg-[#0C2F57]/10",
      text: "text-[#0C2F57]",
      border: "border-[#0C2F57]/20",
    },
  },
  {
    title: "Finance & Accounts Department",
    subtitle: "Payroll, exports, approvals and reporting",
    href: "/admin/accounts",
    icon: Landmark,
    tone: {
      bg: "bg-emerald-600",
      soft: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },
  {
    title: "Sports Development Unit Department",
    subtitle: "Sports, associations, leagues and governance",
    href: "/admin/sdu",
    icon: Trophy,
    tone: {
      bg: "bg-[#F2B705]",
      soft: "bg-[#F2B705]/15",
      text: "text-[#B45309]",
      border: "border-[#F2B705]/30",
    },
  },
  {
    title: "Administration Department",
    subtitle: "Policies, forms, governance and administration",
    href: "/admin",
    icon: Settings,
    tone: {
      bg: "bg-[#D81E27]",
      soft: "bg-[#D81E27]/10",
      text: "text-[#D81E27]",
      border: "border-[#D81E27]/20",
    },
  },
];

function DepartmentTile({
  title,
  subtitle,
  href,
  icon: Icon,
  tone,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: {
    bg: string;
    soft: string;
    text: string;
    border: string;
  };
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[32px] border ${tone.border} bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-1.5 hover:shadow-xl`}
    >
      <div className={`absolute left-0 top-0 h-2 w-full ${tone.bg}`} />

      <div className="flex h-full flex-col justify-between">
        <div>
          <div className={`inline-flex rounded-2xl p-4 ${tone.soft}`}>
            <Icon size={28} className={tone.text} />
          </div>

          <h2 className="mt-6 max-w-[18ch] text-2xl font-extrabold leading-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          Enter department
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Main intro */}
      <section className="rounded-[36px] border border-slate-200 bg-white px-8 py-14 text-center shadow-sm md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            GSLA Home
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-[#0C2F57] md:text-6xl">
            Choose Your Department
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            The system is organised into four main departments. Select the area
            you want to enter.
          </p>
        </div>
      </section>

      {/* Department portal grid */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0C2F57]">
              Main Departments
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Four departments. One entry point.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {departments.map((dept) => (
            <DepartmentTile key={dept.title} {...dept} />
          ))}
        </div>
      </section>
    </div>
  );
}