"use client";

// app/admin/manage/leagues/[leagueId]/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Leagues → League Detail (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/leagues/[leagueId]
|
| Purpose:
| - League “detail” hub page for managing:
|   - League metadata (view-only for now)
|   - Teams registered into this league (LeagueTeam link records)
|
| Ownership model:
| - Teams belong to Associations.
| - This page manages the relationship:
|     League <-> Team
|   by showing “Teams in this league”.
|
| Current behavior (UI-only):
| - Uses static seed league + registered team rows.
| - "Remove from league" is visual only.
|
| Where to wire backend later:
| - Fetch league by leagueId
| - Fetch LeagueTeam rows for leagueId
| - Remove -> update LeagueTeam.status to Withdrawn/Inactive (don’t delete history)
|--------------------------------------------------------------------------
*/

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Users, Trophy, CalendarDays, ShieldAlert } from "lucide-react";

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/*
|--------------------------------------------------------------------------
| SEED: League data (TEMP)
|--------------------------------------------------------------------------
| Replace with DB fetch by leagueId later.
*/
function useSeedLeague(leagueId: string) {
  return React.useMemo(
    () => ({
      id: leagueId,
      name: "Youth Premier Division",
      sport: "Football",
      association: "Gibraltar FA",
      season: "2025–2026",
      status: "Active",
      format: "League",
      ageBand: "U14",
      gender: "Mixed",
      updated: "—",
    }),
    [leagueId]
  );
}

/*
|--------------------------------------------------------------------------
| SEED: Teams in league (TEMP)
|--------------------------------------------------------------------------
| Replace with LeagueTeam rows fetched by leagueId later.
*/
function useSeedLeagueTeams(leagueId: string) {
  return React.useMemo(
    () => [
      {
        id: "lt1",
        teamId: "t1",
        teamName: "GSLA United U14",
        association: "Gibraltar FA",
        entryStatus: "Active", // Pending/Active/Withdrawn etc
        divisionGroup: "Group A",
        addedOn: "—",
      },
      {
        id: "lt2",
        teamId: "t2",
        teamName: "Lions FC U14",
        association: "Lions FC Association",
        entryStatus: "Pending",
        divisionGroup: "Group A",
        addedOn: "—",
      },
    ],
    [leagueId]
  );
}

export default function Page() {
  const params = useParams<{ leagueId: string }>();
  const leagueId = params?.leagueId ?? "unknown";

  const league = useSeedLeague(leagueId);
  const [rows, setRows] = React.useState(() => useSeedLeagueTeams(leagueId));

  function removeUiOnly(rowId: string) {
    // UI-only: keep history by changing status (mimics a “Withdrawn” approach)
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, entryStatus: "Withdrawn" } : r))
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/manage/leagues"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leagues
            </Link>

            <h1 className="text-4xl font-extrabold text-[#0C2F57]">{league.name}</h1>
          </div>

          <p className="mt-2 text-slate-600">
            Manage league details and the teams registered into it.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {league.sport}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {league.season}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {league.association}
            </span>
            <Badge>{league.status}</Badge>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/manage/leagues/${leagueId}/teams/add`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add team to league
            </Button>
          </Link>
        </div>
      </div>

      {/* LEAGUE SUMMARY */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">League Summary</div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Format</span>
                  <span className="font-semibold text-slate-900">{league.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Age band</span>
                  <span className="font-semibold text-slate-900">{league.ageBand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Gender</span>
                  <span className="font-semibold text-slate-900">{league.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Last updated</span>
                  <span className="font-semibold text-slate-900">{league.updated}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Tip: Later this page can host tabs (Teams, Fixtures, Rules, Standings).
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TEAMS IN THIS LEAGUE */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0C2F57]" />
                  <div className="text-xl font-semibold">Teams in this league</div>
                </div>

                <div className="text-sm text-slate-500">
                  Total: {rows.filter((r) => r.entryStatus !== "Withdrawn").length}
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-200">
                {rows.map((r) => {
                  const isWithdrawn = r.entryStatus === "Withdrawn";
                  return (
                    <div
                      key={r.id}
                      className={cn(
                        "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between",
                        isWithdrawn && "opacity-60"
                      )}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{r.teamName}</div>
                        <div className="mt-1 text-sm text-slate-600">
                          Association:{" "}
                          <span className="font-semibold text-slate-800">{r.association}</span>
                          <span className="mx-2 text-slate-300">•</span>
                          Group:{" "}
                          <span className="font-semibold text-slate-800">{r.divisionGroup || "—"}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Added: {r.addedOn}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge>{r.entryStatus}</Badge>

                        {/* NOTE: In real life, remove = status change (Withdrawn), not delete */}
                        <button
                          onClick={() => removeUiOnly(r.id)}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-sm font-semibold",
                            isWithdrawn
                              ? "border-slate-200 bg-white text-slate-500"
                              : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          )}
                          disabled={isWithdrawn}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <CalendarDays className="mr-2 inline-block h-4 w-4" />
                Next: fixtures/standings can read from LeagueTeam to know who participates.
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4" />
              UI-only note
            </div>
            <div className="mt-1 text-xs text-amber-900/80">
              This page uses seed data. When you wire DB, use LeagueTeam rows (join table) to
              drive the “Teams in this league” section.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
