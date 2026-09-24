import { Card, CardContent } from "@/components/ui/card";

/**
 * ImportExportPage
 * ----------------
 * Admin utility page for bulk data movement in and out of the system.
 * Intended for super users / admins managing large datasets
 * (sports, associations, members, etc).
 *
 * NOTE:
 * - This page is currently UI-only (no handlers wired up yet).
 * - All upload / export logic will eventually live behind these sections.
 */
export default function ImportExportPage() {
  return (
    <div>
      {/* Page title — change text here if naming ever changes */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">
        Import / Export
      </h1>

      {/* Short description shown under the title */}
      <p className="mt-2 text-slate-600">
        Upload datasets or export reports for sports and associations.
      </p>

      {/* 
        Main layout grid
        ----------------
        - Single column on mobile
        - Two columns on medium screens and up
        - Each Card represents a major action area (Import vs Export)
      */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* ========================= */}
        {/* IMPORT SECTION CARD       */}
        {/* ========================= */}
        <Card>
          <CardContent>
            {/* Section heading */}
            <div className="text-xl font-semibold">
              Import
            </div>

            {/* Helper text explaining what can be uploaded */}
            <div className="mt-2 text-sm text-slate-600">
              CSV / Excel upload (validation happens here).
            </div>

            {/* 
              File drop zone (UI only)
              ------------------------
              - This is where drag-and-drop logic would eventually go
              - Replace or enhance this div when wiring real upload handling
            */}
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              Drop files here (or click to upload)
            </div>

            {/* 
              Upload action button
              --------------------
              - OnClick handler will eventually trigger:
              - file validation
              - parsing (CSV / Excel)
              - backend upload
            */}
            <button className="mt-4 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white">
              Upload
            </button>
          </CardContent>
        </Card>

        {/* ========================= */}
        {/* EXPORT SECTION CARD       */}
        {/* ========================= */}
        <Card>
          <CardContent>
            {/* Section heading */}
            <div className="text-xl font-semibold">
              Export
            </div>

            {/* Helper text explaining export purpose */}
            <div className="mt-2 text-sm text-slate-600">
              Download reports in CSV / Excel.
            </div>

            {/* 
              Export action buttons
              ---------------------
              - Each button will map to a different export endpoint or query
              - Currently UI-only placeholders
            */}
            <div className="mt-4 flex flex-wrap gap-2">
              
              {/* Export everything across all sports */}
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Export All Sports
              </button>

              {/* Export data filtered to a selected sport */}
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Export Selected Sport
              </button>

              {/* Export association-level data */}
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
