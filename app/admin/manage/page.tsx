import { Card, CardContent } from "@/components/ui/Card";

export default function ManagePage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Add / Edit / Delete</h1>
      <p className="mt-2 text-slate-600">Manage sports, associations, teams, and people records.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {["Sports", "Associations", "Teams", "Coaches", "Volunteers", "Users"].map((x) => (
          <Card key={x} className="hover:shadow-md transition">
            <CardContent>
              <div className="text-lg font-semibold">{x}</div>
              <div className="mt-2 text-sm text-slate-600">Create, edit, deactivate, and audit.</div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl bg-[#0C2F57] px-3 py-2 text-sm font-semibold text-white">
                  Add
                </button>
                <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                  Edit
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
