import { Card, CardContent } from "@/components/ui/card";

export default function ImportExportPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Import / Export</h1>
      <p className="mt-2 text-slate-600">Upload datasets or export reports for sports and associations.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent>
            <div className="text-xl font-semibold">Import</div>
            <div className="mt-2 text-sm text-slate-600">CSV / Excel upload (validation happens here).</div>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              Drop files here (or click to upload)
            </div>
            <button className="mt-4 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white">
              Upload
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-xl font-semibold">Export</div>
            <div className="mt-2 text-sm text-slate-600">Download reports in CSV / Excel.</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Export All Sports
              </button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Export Selected Sport
              </button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Export Associations
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
