import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const sportName = decodeURIComponent(sport)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-extrabold text-[#0C2F57]">{sportName}</h1>
        <Badge>Overview</Badge>
      </div>
      <p className="mt-2 text-slate-600">Quick snapshot of health, participation, and key actions.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent>
            <div className="text-lg font-semibold">Participation</div>
            <div className="mt-2 text-4xl font-extrabold">—</div>
            <div className="mt-2 text-sm text-slate-600">Players / members registered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-lg font-semibold">Coaches</div>
            <div className="mt-2 text-4xl font-extrabold">—</div>
            <div className="mt-2 text-sm text-slate-600">Active coaches and compliance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-lg font-semibold">Alerts</div>
            <div className="mt-2 text-4xl font-extrabold text-[#D81E27]">—</div>
            <div className="mt-2 text-sm text-slate-600">Upcoming renewals / overdue</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
