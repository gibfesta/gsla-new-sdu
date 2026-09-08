import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/*
|--------------------------------------------------------------------------
| FORM SEED DATA (TEMP / STATIC)
|--------------------------------------------------------------------------
| - Annual forms show one row per year
| - Past years are NEVER hidden
| - Status values are display-only for now
|
| Intended future logic:
| - Not Started → no draft + no submission
| - Draft       → localStorage draft exists
| - Submitted   → submitted, pending GSLA review
| - Completed   → reviewed & approved
| - Incomplete  → past year, not completed
*/

const currentYear = new Date().getFullYear();

type Form = {
  id: string;
  name: string;
  description?: string;
} & (
  | { type: "annual"; baseRoute: string; years: { year: number; status: string }[] }
  | { type: "single"; status: string }
);

const forms: Form[] = [
  {
    id: "form-a",
    name: "Annual Association Registration (Form A)",
    description: "Mandatory annual registration for GSLA associations.",
    type: "annual",
    baseRoute: "/admin/association/registration",
    years: [
      { year: currentYear, status: "Draft" },
      { year: currentYear - 1, status: "Completed" },
      { year: currentYear - 2, status: "Incomplete" },
    ],
  },
  {
    id: "form-b",
    name: "Application for Financial Assistance (Form B)",
    description:
      "Funding applications for competitions, development, facilities, mentoring, and elite support.",
    type: "annual",
    baseRoute: "/admin/form-b",
    years: [
      { year: currentYear, status: "Not Started" },
      { year: currentYear - 1, status: "Completed" },
      { year: currentYear - 2, status: "Completed" },
    ],
  },
  {
  id: "form-c",
  name: "Confirmation of Results & Outcomes (Form C)",
  description: "Post-event confirmation of results/outcomes for funded projects.",
  type: "annual",
  baseRoute: "/admin/form-c",
  years: [
    { year: currentYear, status: "Not Started" },
    { year: currentYear - 1, status: "Completed" },
    { year: currentYear - 2, status: "Incomplete" },
  ],
},
  {
    id: "coach-registration",
    name: "Coach Registration",
    type: "single",
    status: "Active",
  },
  {
    id: "volunteer-signup",
    name: "Volunteer Signup",
    type: "single",
    status: "Active",
  },
];

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Submitted"
      ? "bg-blue-100 text-blue-800"
      : status === "Draft"
      ? "bg-amber-100 text-amber-800"
      : status === "Incomplete"
      ? "bg-red-100 text-red-800"
      : "bg-slate-100 text-slate-700";

  return <Badge className={color}>{status}</Badge>;
}

export default function FormsPage() {
  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Forms</h1>
      <p className="mt-2 text-slate-600">
        Manage GSLA forms, annual submissions, and funding applications.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            {/* CARD HEADER */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Form Library</div>
              <button className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                + New Form
              </button>
            </div>

            {/* FORM LIST */}
            <div className="mt-6 divide-y divide-slate-200">
              {forms.map((form) => {
                // ─────────────────────────────────────────────
                // ANNUAL FORMS (Form A, Form B)
                // ─────────────────────────────────────────────
                if (form.type === "annual") {
                  return (
                    <div key={form.id} className="py-4">
                      <div className="font-semibold text-slate-900">
                        {form.name}
                      </div>
                      {form.description && (
                        <div className="mt-1 text-sm text-slate-600">
                          {form.description}
                        </div>
                      )}

                      <div className="mt-3 space-y-3">
                        {form.years.map((y) => (
                          <div
                            key={y.year}
                            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                          >
                            <div>
                              <div className="font-medium text-slate-800">
                                Year {y.year}
                              </div>
                              <div className="text-sm text-slate-600">
                                Annual submission
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <StatusBadge status={y.status} />

                              <Link
                                href={form.baseRoute}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                              >
                                {y.year === currentYear ? "Open" : "View"}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // ─────────────────────────────────────────────
                // NON-ANNUAL FORMS
                // ─────────────────────────────────────────────
                return (
                  <div
                    key={form.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {form.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        Last updated: —
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge>{form.status}</Badge>

                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                        Edit
                      </button>

                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
