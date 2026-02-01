"use client";

// app/admin/manage/leagues/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Leagues (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/leagues
|
| Purpose:
| - Lists all leagues in the system
| - Entry point into:
|     → View league
|     → Add teams to league
|
| Current behavior:
| - Uses static seed data
|
| Where to wire backend later:
| - Fetch leagues from DB
| - Add pagination + filters (sport/season/status)
|--------------------------------------------------------------------------
*/

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trophy } from "lucide-react";

/*
|--------------------------------------------------------------------------
| SEED DATA (TEMP)
|--------------------------------------------------------------------------
*/
const leagues = [
  {
    id: "u14-premier",
    name: "Youth Premier Division",
    sport: "Football",
    season: "2025–2026",
    status: "Active",
  },
  {
    id: "senior-cup",
    name: "Senior Cup",
    sport: "Football",
    season: "2025",
    status: "Draft",
  },
  {
    id: "cricket-league",
    name: "County Amateur League",
    sport: "Cricket",
    season: "2025",
    status: "Active",
  },
];

export default function LeaguesPage() {
  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Leagues</h1>
          <p className="mt-2 text-slate-600">
            Manage competitions and register teams.
          </p>
        </div>

        <Link href="/admin/manage/leagues/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add League
          </Button>
        </Link>
      </div>

      {/* LIST */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#0C2F57]" />
              <div className="text-xl font-semibold">All Leagues</div>
            </div>

            <div className="mt-4 divide-y divide-slate-200">
              {leagues.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{l.name}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {l.sport} • {l.season}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{l.status}</Badge>

                    <Link href={`/admin/manage/leagues/${l.id}`}>
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                        View
                      </button>
                    </Link>
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
