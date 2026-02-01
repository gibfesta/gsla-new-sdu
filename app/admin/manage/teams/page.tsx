// app/admin/manage/teams/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Teams (List/Search) (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/teams
|
| Purpose:
| - Admin list/search view of Teams (owned by Associations).
| - Provides entry points for:
|   - Add Team
|   - Edit Team (future route)
|   - Deactivate (soft delete) team (future backend)
|
| Current behavior (UI-only):
| - Uses static seed data.
| - Search filter is client-side only (simple state).
|
| Where to wire backend later:
| - Replace `seedTeams` with fetched data.
| - Deactivate -> PATCH team status (Inactive).
|--------------------------------------------------------------------------
*/

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/*
|--------------------------------------------------------------------------
| TEAM SEED DATA (TEMP / STATIC)
|--------------------------------------------------------------------------
| Replace with DB/API results later.
| Ownership model:
| - Every team belongs to an Association.
*/
const seedTeams = [
  {
    id: "t1",
    name: "GSLA United U14",
    association: "Gibraltar FA",
    sport: "Football",
    ageBand: "U14",
    status: "Active",
    updated: "—",
  },
  {
    id: "t2",
    name: "Lions FC 1st Team",
    association: "Lions FC Association",
    sport: "Football",
    ageBand: "Senior",
    status: "Active",
    updated: "—",
  },
  {
    id: "t3",
    name: "Bay Cricket Club XI",
    association: "Cricket Association",
    sport: "Cricket",
    ageBand: "Senior",
    status: "Inactive",
    updated: "—",
  },
];

export default function TeamsPage() {
  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Teams</h1>
          <p className="mt-2 text-slate-600">
            Teams are owned by Associations. Manage and assign them into leagues.
          </p>
        </div>

        {/* PRIMARY CTA */}
        <Link
          href="/admin/manage/teams/add"
          className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          + Add Team
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            {/* CARD HEADER */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xl font-semibold">Team Directory</div>

              {/* 
                SEARCH PLACEHOLDER
                - UI-only right now (no state) to keep this page server component friendly.
                - If you want interactive search now, we can convert this page to "use client".
              */}
              <div className="text-sm text-slate-500">Search/filter coming next</div>
            </div>

            {/* TABLE/LIST */}
            <div className="mt-4 divide-y divide-slate-200">
              {seedTeams.map((t) => (
                <div key={t.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* LEFT: metadata */}
                  <div>
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Association: <span className="font-semibold text-slate-800">{t.association}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      Sport: <span className="font-semibold text-slate-800">{t.sport}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      Age: <span className="font-semibold text-slate-800">{t.ageBand}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Last updated: {t.updated}</div>
                  </div>

                  {/* RIGHT: actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{t.status}</Badge>

                    {/* 
                      EDIT (future)
                      - Recommended route later:
                        /admin/manage/teams/[id]/edit
                    */}
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Edit
                    </button>

                    {/* 
                      DEACTIVATE (soft delete)
                      - Recommended: status -> Inactive (don’t delete history)
                      - Later: confirmation modal + server action
                    */}
                    <button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">
                      Deactivate
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
