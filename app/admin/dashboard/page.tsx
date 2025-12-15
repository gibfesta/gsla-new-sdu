import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Info, ClipboardList, Settings, ArrowLeftRight, Bell } from "lucide-react";

const tiles = [
  {
    title: "Statistics",
    desc: "View analytics and participation trends",
    href: "/admin/statistics",
    icon: BarChart3,
    tint: "bg-[#0C2F57]/10",
    iconColor: "text-[#0C2F57]",
  },
  {
    title: "Information Pages",
    desc: "Manage information pages and records",
    href: "/admin/info",
    icon: Info,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Forms",
    desc: "Create and edit forms for coaches, volunteers, associations",
    href: "/admin/forms",
    icon: ClipboardList,
    tint: "bg-[#F2B705]/15",
    iconColor: "text-[#B45309]",
  },
  {
    title: "Add / Edit / Delete",
    desc: "Manage sports, associations, teams",
    href: "/admin/manage",
    icon: Settings,
    tint: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    title: "Import / Export",
    desc: "Upload or download CSV / Excel files",
    href: "/admin/import-export",
    icon: ArrowLeftRight,
    tint: "bg-cyan-100/40",
    iconColor: "text-cyan-700",
  },
  {
    title: "Reminders",
    desc: "Certification renewals, deadlines and alerts",
    href: "/admin/reminders",
    icon: Bell,
    tint: "bg-[#D81E27]/10",
    iconColor: "text-[#D81E27]",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Super User Dashboard</h1>
      <p className="mt-2 text-slate-600">Quick access to system tools and sport health insights.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.title} href={t.href} className="group">
              <Card className="transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardContent className="flex h-[150px] items-start gap-4">
                  <div className={`rounded-2xl p-4 ${t.tint}`}>
                    <Icon className={t.iconColor} />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-slate-900">{t.title}</div>
                    <div className="mt-2 text-sm text-slate-600">{t.desc}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
