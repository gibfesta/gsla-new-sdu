import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const reminders = [
  { title: "First Aid Certificate renewal", due: "7 days", level: "High" },
  { title: "Safeguarding training expires", due: "14 days", level: "Medium" },
  { title: "Coach license check-in", due: "30 days", level: "Low" },
];

export default function RemindersPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Reminders</h1>
      <p className="mt-2 text-slate-600">Deadlines, renewals, and alerts across all sports.</p>

      <div className="mt-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Upcoming</div>
              <button className="rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                Create Reminder
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-200">
              {reminders.map((r) => (
                <div key={r.title} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-slate-900">{r.title}</div>
                    <div className="text-sm text-slate-600">Due in: {r.due}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge>{r.level}</Badge>
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      View
                    </button>
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Mark done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
