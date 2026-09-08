"use client";

// app/admin/manage/teams/add/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Teams → Add (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/teams/add
|
| Purpose:
| - Create a Team record (owned by an Association).
| - Sets up the foundation for “Add team to league” (LeagueTeam/Registration link).
|
| Ownership model:
| - Teams belong to Associations (Association is required).
| - A Team can later be registered into 1+ leagues per season.
|
| Current behavior (UI-only):
| - Draft autosaves to localStorage.
| - Save just shows a UI confirmation (no backend yet).
|
| Where to wire backend later:
| - Replace `saveTeamUiOnly()` with server action/API:
|   1) Create Team { associationId, sportId, name, category, venue, contacts }
|   2) Return teamId
|   3) Redirect to /admin/manage/teams or /admin/manage/teams/[id]
|--------------------------------------------------------------------------
*/

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Users,
  Building2,
  Trophy,
  MapPin,
  Phone,
  Mail,
  ClipboardList,
} from "lucide-react";

const DRAFT_KEY = "gsla_admin_add_team_draft_v1";

type TeamStatus = "Draft" | "Active" | "Inactive";

type State = {
  status: TeamStatus;

  // Ownership (required)
  associationName: string; // UI-only. Later this should be associationId + a selector/search.

  // Core
  teamName: string;
  sport: string;

  // Categorisation (helps filtering + league eligibility)
  ageBand: string; // e.g. U12, U14, Senior
  gender: string; // Mixed/Men/Women/Boys/Girls
  category: string; // free text: "1st Team", "Academy", "Development"

  // Home/venue
  homeVenue: string;
  venueNotes: string;

  // Contacts (team-level contacts can differ from association contacts)
  managerName: string;
  managerEmail: string;
  managerPhone: string;

  // Notes
  publicNotes: string;
  internalNotes: string;
};

const defaultState: State = {
  status: "Draft",

  associationName: "",

  teamName: "",
  sport: "",

  ageBand: "",
  gender: "Mixed",
  category: "",

  homeVenue: "",
  venueNotes: "",

  managerName: "",
  managerEmail: "",
  managerPhone: "",

  publicNotes: "",
  internalNotes: "",
};

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/* Local field helpers (avoids importing shadcn Input/Label modules) */
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

export default function Page() {
  const [state, setState] = React.useState<State>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // Load draft once
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<State>;
      setState((s) => ({ ...s, ...parsed }));
      setToast("Draft loaded.");
      window.setTimeout(() => setToast(null), 1400);
    } catch {
      // ignore
    }
  }, []);

  // Autosave
  React.useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function saveTeamUiOnly() {
    setSaved(true);
    setToast("Saved (UI-only).");
    window.setTimeout(() => setToast(null), 1600);
  }

  // Basic required fields (UI hint only)
  const missing = React.useMemo(() => {
    const m: string[] = [];
    if (!state.associationName.trim()) m.push("Association");
    if (!state.teamName.trim()) m.push("Team name");
    if (!state.sport.trim()) m.push("Sport");
    return m;
  }, [state]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Add Team</h1>
          <p className="mt-2 text-slate-600">Teams are owned by Associations (UI-only).</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Status: {state.status}
            </span>

            {missing.length ? (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                Missing: {missing.join(", ")}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                Ready
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/manage"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Manage
          </Link>

          <Button variant="outline" onClick={saveTeamUiOnly}>
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
          {/* OWNERSHIP */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Association ownership is required. Later replace with associationId selector/search. */}
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Association Ownership</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Association *</Label>
                  <Input
                    value={state.associationName}
                    onChange={(e) => update("associationName", e.target.value)}
                    placeholder="e.g., Gibraltar FA / Lions FC Association"
                  />
                  <div className="mt-2 text-xs text-slate-500">
                    Later: change this into a searchable picker (associationId).
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CORE DETAILS */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Team name + sport are the minimum required identifiers for UI flows and later DB. */}
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Team Details</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Team name *</Label>
                  <Input value={state.teamName} onChange={(e) => update("teamName", e.target.value)} />
                </div>

                <div>
                  <Label>Sport *</Label>
                  <Input value={state.sport} onChange={(e) => update("sport", e.target.value)} placeholder="e.g., Football" />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={state.status} onChange={(e) => update("status", e.target.value as TeamStatus)}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </div>

                <div>
                  <Label>Age band</Label>
                  <Input value={state.ageBand} onChange={(e) => update("ageBand", e.target.value)} placeholder="e.g., U14" />
                </div>

                <div>
                  <Label>Gender</Label>
                  <Select value={state.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="Mixed">Mixed</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Category</Label>
                  <Input
                    value={state.category}
                    onChange={(e) => update("category", e.target.value)}
                    placeholder="e.g., 1st Team, Academy, Development"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VENUE */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Venue info helps scheduling and facility allocation later. */}
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Home Venue</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Home venue</Label>
                  <Input value={state.homeVenue} onChange={(e) => update("homeVenue", e.target.value)} placeholder="e.g., Europa Sports Complex" />
                </div>

                <div>
                  <Label>Venue notes</Label>
                  <TextArea
                    rows={3}
                    value={state.venueNotes}
                    onChange={(e) => update("venueNotes", e.target.value)}
                    placeholder="Any constraints, pitch allocations, preferred times..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          {/* CONTACTS */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Team contact can differ from association contact. */}
              <div className="mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Team Contact</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Manager name</Label>
                  <Input value={state.managerName} onChange={(e) => update("managerName", e.target.value)} />
                </div>

                <div>
                  <Label>Manager email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <Input
                      type="email"
                      value={state.managerEmail}
                      onChange={(e) => update("managerEmail", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Manager phone</Label>
                  <Input value={state.managerPhone} onChange={(e) => update("managerPhone", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NOTES */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Split public/internal notes so you can reuse the same record for public views later. */}
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Notes</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Public notes</Label>
                  <TextArea
                    rows={3}
                    value={state.publicNotes}
                    onChange={(e) => update("publicNotes", e.target.value)}
                    placeholder="Visible to association/team viewers later..."
                  />
                </div>

                <div>
                  <Label>Internal notes</Label>
                  <TextArea
                    rows={3}
                    value={state.internalNotes}
                    onChange={(e) => update("internalNotes", e.target.value)}
                    placeholder="Admin-only notes..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UI SAVE CONFIRMATION */}
          {saved ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Saved (UI-only)
              </div>
              <div className="mt-1 text-xs text-emerald-900/80">
                Next: wire backend + redirect to /admin/manage/teams (list) or /admin/manage/teams/[id].
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
