import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/*
|--------------------------------------------------------------------------
| FORM SEED DATA (TEMP / STATIC)
|--------------------------------------------------------------------------
| This array represents the list of forms shown in the Form Library.
| - Replace this with API data when forms are stored in the database.
| - Add / remove objects here to change which forms appear in the UI.
| - `status` is currently display-only (no logic tied to it yet).
*/
const forms = [
  { name: "Coach Registration", status: "Active" },
  { name: "Volunteer Signup", status: "Active" },
  { name: "Safeguarding Checklist", status: "Draft" },
  { name: "Facility Allocation Request", status: "Active" },
];

export default function FormsPage() {
  return (
    <div>
      {/* 
        PAGE HEADER
        - Main title and short description for the Forms section.
        - Change text here if the purpose of this page evolves.
      */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Forms</h1>
      <p className="mt-2 text-slate-600">
        Create and manage forms across sports and associations.
      </p>

      {/* 
        MAIN CONTENT WRAPPER
        - Grid used for future expansion (e.g. filters, analytics, side panels).
        - Currently only contains the Form Library card.
      */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            {/* 
              CARD HEADER
              - Displays the section title.
              - "+ New Form" button will later trigger:
                → modal
                → separate page
                → or form builder flow
            */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Form Library</div>
              <button className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                + New Form
              </button>
            </div>

            {/* 
              FORM LIST
              - Iterates over `forms` array above.
              - Each row represents a single form entry.
              - Replace this map with fetched data when backend is connected.
            */}
            <div className="mt-4 divide-y divide-slate-200">
              {forms.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between py-4"
                >
                  {/* 
                    FORM METADATA
                    - Name of the form
                    - Placeholder for last updated timestamp
                    - Timestamp can later be populated from backend
                  */}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {f.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      Last updated: —
                    </div>
                  </div>

                  {/* 
                    FORM ACTIONS
                    - Status badge (visual only for now)
                    - Edit: future form builder or edit screen
                    - View: read-only preview of the form
                  */}
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
