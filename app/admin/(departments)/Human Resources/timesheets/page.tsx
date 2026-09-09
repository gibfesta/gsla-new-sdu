import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ClipboardList, Settings } from "lucide-react";

function Tile({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200">
          <Icon size={18} className="text-slate-600" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
      </div>
    </Link>
  );
}

export default function TimesheetsPage() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Timesheets</h1>
          <p className="mt-2 text-slate-600">
            Weekly facility timesheets (Saturday → Saturday). Centre Manager submits once per facility, then HR/Accounts
            review, lock and export for Treasury.
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Tile
              href="/admin/hr/timesheets/weeks"
              title="Weeks inbox"
              description="View week packs by facility, status and export readiness."
              icon={ClipboardList}
            />
            <Tile
              href="/admin/hr/timesheets/settings"
              title="Settings"
              description="Reason codes and week rules (admin)."
              icon={Settings}
            />
            <Tile
              href="/admin/hr/timesheets/weeks"
              title="Calendar view"
              description="Coming next: who worked what, and week summaries."
              icon={CalendarDays}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
