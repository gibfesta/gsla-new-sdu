import { Card, CardContent } from "@/components/ui/card";

const items = [
  { title: "About GSLA System", desc: "How data is collected and used." },
  { title: "Roles & Permissions", desc: "Who can see what and why." },
  { title: "Data Quality", desc: "Guidance on keeping entries consistent." },
  { title: "Add New Info Here?", desc: "Guidance on living life." },
];

export default function InfoPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Information</h1>
      <p className="mt-2 text-slate-600">System information, guidance, and documentation.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="hover:shadow-md transition">
            <CardContent>
              <div className="text-lg font-semibold">{it.title}</div>
              <div className="mt-2 text-sm text-slate-600">{it.desc}</div>
              <button className="mt-4 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Open
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
