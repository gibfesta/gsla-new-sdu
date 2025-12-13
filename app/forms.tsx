import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const forms = [
  { name: "Coach Registration", status: "Active" },
  { name: "Volunteer Signup", status: "Active" },
  { name: "Safeguarding Checklist", status: "Draft" },
  { name: "Facility Allocation Request", status: "Active" },
];

export default function FormsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Forms</h1>
      <p className="mt-2 text-slate-600">Create and manage forms across sports and associations.</p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Form Library</div>
              <button className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                + New Form
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-200">
              {forms.map((f) => (
                <div key={f.name} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-slate-900">{f.name}</div>
                    <div className="text-sm text-slate-600">Last updated: —</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{f.status}</Badge>
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Edit
                    </button>
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      View
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
