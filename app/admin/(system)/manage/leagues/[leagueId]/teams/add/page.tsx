"use client";

// app/admin/manage/leagues/[leagueId]/teams/add/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Leagues → Add Team to League (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/leagues/[leagueId]/teams/add
|
| Purpose:
| - Creates a LeagueTeam/Registration link between:
|     League <-> Team
| - Teams are owned by Associations, so this flow is:
|     1) Choose Association
|     2) Pick a Team from that Association
|     3) Set entry fields (group/division/status/notes)
|     4) Save (UI-only)
|
| Current behavior (UI-only):
| - Uses static seed data for Associations + Teams.
| - Save writes to localStorage “league entry draft” and shows confirmation.
|
| Where to wire backend later:
| - Fetch associations/teams (scoped by sport/association permissions)
| - POST LeagueTeam { leagueId, teamId, status, group, notes }
|--------------------------------------------------------------------------
*/

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, CheckCircle2, Building2, Users, ClipboardList } from "lucide-react";

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-sm font-semibold text-slate-700">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
        "focus:border-[#0C2F57] focus:ring-2 focus:ring-[#0C2F57]/10",
        props.className
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
        "focus:border-[#0C2F57] focus:ring-2 focus:ring-[#0C2F57]/10",
        props.className
      )}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
        "focus:border-[#0C2F57] focus:ring-2 focus:ring-[#0C2F57]/10",
        props.className
      )}
    />
  );
}

/*
|--------------------------------------------------------------------------
| SEED: associations + teams (TEMP)
|--------------------------------------------------------------------------
| Replace with DB data later. This is structured so “Teams are owned by Associations”.
*/
const seedAssociations = ["Gibraltar FA", "Lions FC Association", "Cricket Association"] as const;

const seedTeamsByAssociation: Record<(typeof seedAssociations)[number], Array<{ id: string; name: string; sport: string }>> = {
  "Gibraltar FA": [
    { id: "t1", name: "GSLA United U14", sport: "Football" },
    { id: "t4", name: "Europa FC U14", sport: "Football" },
  ],
  "Lions FC Association": [
    { id: "t2", name: "Lions FC U14", sport: "Football" },
    { id: "t5", name: "Lions FC U16", sport: "Football" },
  ],
  "Cricket Association": [{ id: "t3", name: "Bay Cricket Club XI", sport: "Cricket" }],
};

type EntryStatus = "Pending" | "Active" | "Withdrawn";

type State = {
  association: string;
  teamId: string;

  // LeagueTeam / entry fields
  status: EntryStatus;
  group: string;
  notes: string;
};

export default function Page() {
  const params = useParams<{ leagueId: string }>();
  const leagueId = params?.leagueId ?? "unknown";
  const router = useRouter();

  const [state, setState] = React.useState<State>({
    association: seedAssociations[0],
    teamId: "",
    status: "Pending",
    group: "",
    notes: "",
  });

  const [toast, setToast] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // Teams available after selecting an association
  const teams = React.useMemo(() => {
    const list = seedTeamsByAssociation[state.association as (typeof seedAssociations)[number]] ?? [];
    return list;
  }, [state.association]);

  // If association changes and current teamId isn’t in that association, clear it.
  React.useEffect(() => {
    if (!state.teamId) return;
    const stillValid = teams.some((t) => t.id === state.teamId);
    if (!stillValid) setState((s) => ({ ...s, teamId: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.association]);

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function saveUiOnly() {
    // UI-only: persist a “last saved entry” per league in localStorage
    try {
      localStorage.setItem(`gsla_league_${leagueId}_add_team_ui_only`, JSON.stringify(state));
    } catch {
      // ignore
    }

    setSaved(true);
    setToast("Saved (UI-only).");
    window.setTimeout(() => setToast(null), 1600);

    // Optional: navigate back to league page after save (comment out if you prefer staying)
    // router.push(`/admin/manage/leagues/${leagueId}`);
  }

  const missing = React.useMemo(() => {
    const m: string[] = [];
    if (!state.association.trim()) m.push("Association");
    if (!state.teamId.trim()) m.push("Team");
    return m;
  }, [state.association, state.teamId]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/manage/leagues/${leagueId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to League
            </Link>

            <h1 className="text-4xl font-extrabold text-[#0C2F57]">Add Team to League</h1>
          </div>

          <p className="mt-2 text-slate-600">
            Select an Association, then register one of their teams into this league (UI-only).
          </p>

          {missing.length ? (
            <div className="mt-3 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              Missing: {missing.join(", ")}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
              Ready
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={saveUiOnly} disabled={missing.length > 0}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* TOAST */}
      {toast ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {toast}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-6">
          {/* PICK ASSOCIATION + TEAM */}
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Select Team</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Association *</Label>
                  <Select value={state.association} onChange={(e) => update("association", e.target.value)}>
                    {seedAssociations.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label>Team *</Label>
                  <Select value={state.teamId} onChange={(e) => update("teamId", e.target.value)}>
                    <option value="">Select a team…</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.sport})
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <Users className="mr-2 inline-block h-4 w-4" />
                Later: filter teams by the league’s sport automatically, and prevent duplicate registrations.
              </div>
            </CardContent>
          </Card>

          {/* ENTRY FIELDS */}
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">League Entry Details</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Entry status</Label>
                  <Select value={state.status} onChange={(e) => update("status", e.target.value as EntryStatus)}>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </Select>
                </div>

                <div>
                  <Label>Group / Division</Label>
                  <Input value={state.group} onChange={(e) => update("group", e.target.value)} placeholder="e.g., Group A" />
                </div>

                <div className="md:col-span-2">
                  <Label>Notes</Label>
                  <TextArea
                    rows={4}
                    value={state.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Admin notes about this league entry..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          {/* SUMMARY */}
          <Card>
            <CardContent>
              <div className="text-xl font-semibold">Summary</div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">League</span>
                  <span className="font-semibold text-slate-900">{leagueId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Association</span>
                  <span className="font-semibold text-slate-900">{state.association || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Team</span>
                  <span className="font-semibold text-slate-900">
                    {state.teamId ? teams.find((t) => t.id === state.teamId)?.name ?? state.teamId : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="font-semibold text-slate-900">{state.status}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Tip: This “LeagueTeam” record is what fixtures/standings read from later.
              </div>
            </CardContent>
          </Card>

          {/* SAVE CONFIRMATION */}
          {saved ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Saved (UI-only)
              </div>
              <div className="mt-1 text-xs text-emerald-900/80">
                Next: POST to backend + redirect back to /admin/manage/leagues/{leagueId}.
              </div>
              <div className="mt-3">
                <Button onClick={() => router.push(`/admin/manage/leagues/${leagueId}`)}>
                  Back to league
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
