"use client";

// app/admin/manage/leagues/add/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Leagues → Add (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/leagues/add
|
| Purpose:
| - Superuser/admin UI for creating a new League record (UI-only for now).
| - This is the first step toward managing leagues/registrations/teams properly.
|
| Rules:
| - UI only: no backend calls yet.
| - Draft autosaves to localStorage to prevent losing progress.
| - Uses simple HTML inputs (no shadcn Input/Label/Select imports) to avoid missing module errors.
|
| Where to wire backend later:
| - Replace `saveLeagueUiOnly()` with server action/API:
|   - Create League
|   - Attach sport + association
|   - Store season, age band, gender, format, rules, contacts
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
  ClipboardList,
  Trophy,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const DRAFT_KEY = "gsla_admin_add_league_draft_v1";

type LeagueStatus = "Draft" | "Active" | "Inactive";

type State = {
  status: LeagueStatus;

  // Core identifiers
  leagueName: string;
  sport: string;
  association: string;

  // Season + structure
  seasonLabel: string; // e.g. "2025–2026"
  level: string; // e.g. "Premier", "Division 1"
  ageBand: string; // e.g. "U14", "Senior"
  gender: string; // e.g. "Mixed", "Men", "Women"
  format: string; // e.g. "League", "Cup", "Tournament"
  teamCountTarget: string; // keep as string for UI-only
  maxPlayersPerTeam: string;

  // Scheduling
  matchDay: string; // e.g. "Saturdays"
  matchTimeWindow: string; // e.g. "09:00–18:00"
  venueNotes: string;

  // Admin + governance
  leagueCoordinatorName: string;
  leagueCoordinatorEmail: string;
  safeguardingRequired: boolean;
  minCoachesPerTeam: string;

  // Notes
  publicDescription: string;
  internalNotes: string;
};

const defaultState: State = {
  status: "Draft",

  leagueName: "",
  sport: "",
  association: "",

  seasonLabel: "",
  level: "",
  ageBand: "",
  gender: "Mixed",
  format: "League",
  teamCountTarget: "",
  maxPlayersPerTeam: "",

  matchDay: "",
  matchTimeWindow: "",
  venueNotes: "",

  leagueCoordinatorName: "",
  leagueCoordinatorEmail: "",
  safeguardingRequired: true,
  minCoachesPerTeam: "",

  publicDescription: "",
  internalNotes: "",
};

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/* INLINE UI HELPERS (avoid missing shadcn Input/Label/Select modules) */
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

function CheckboxRow({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
      </div>
    </label>
  );
}

export default function Page() {
  const [state, setState] = React.useState<State>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // LOAD DRAFT ON MOUNT
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

  // AUTOSAVE DRAFT
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

  // UI-ONLY SAVE (placeholder)
  function saveLeagueUiOnly() {
    setSaved(true);
    setToast("Saved (UI-only).");
    window.setTimeout(() => setToast(null), 1600);
  }

  // LIGHT VALIDATION (UI hints only)
  const missing = React.useMemo(() => {
    const m: string[] = [];
    if (!state.leagueName.trim()) m.push("League name");
    if (!state.sport.trim()) m.push("Sport");
    if (!state.association.trim()) m.push("Association");
    if (!state.seasonLabel.trim()) m.push("Season");
    return m;
  }, [state]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Add League</h1>
          <p className="mt-2 text-slate-600">
            Create a league structure for a sport &amp; association (UI-only).
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Status: {state.status}
            </span>
            {missing.length ? (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                Missing: {missing.slice(0, 3).join(", ")}
                {missing.length > 3 ? "…" : ""}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                Ready
              </span>
            )}
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/manage"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Manage
          </Link>

          <Button variant="outline" onClick={saveLeagueUiOnly}>
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

      {/* MAIN FORM */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* CORE INFO */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Core league identifiers. Keep these stable — they become natural DB keys later. */}
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Core Details</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>League name *</Label>
                  <Input value={state.leagueName} onChange={(e) => update("leagueName", e.target.value)} />
                </div>

                <div>
                  <Label>Sport *</Label>
                  <Input
                    value={state.sport}
                    onChange={(e) => update("sport", e.target.value)}
                    placeholder="e.g., Football"
                  />
                </div>

                <div>
                  <Label>Association *</Label>
                  <Input
                    value={state.association}
                    onChange={(e) => update("association", e.target.value)}
                    placeholder="e.g., Gibraltar FA"
                  />
                </div>

                <div>
                  <Label>Season *</Label>
                  <Input
                    value={state.seasonLabel}
                    onChange={(e) => update("seasonLabel", e.target.value)}
                    placeholder="e.g., 2025–2026"
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={state.status} onChange={(e) => update("status", e.target.value as LeagueStatus)}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STRUCTURE */}
          <Card>
            <CardContent>
              {/* DEV NOTE: These fields define how the league is categorized + displayed in front-end filters. */}
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Structure</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Level / Division</Label>
                  <Input value={state.level} onChange={(e) => update("level", e.target.value)} placeholder="e.g., Division 1" />
                </div>

                <div>
                  <Label>Age band</Label>
                  <Input value={state.ageBand} onChange={(e) => update("ageBand", e.target.value)} placeholder="e.g., U14, Senior" />
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

                <div>
                  <Label>Format</Label>
                  <Select value={state.format} onChange={(e) => update("format", e.target.value)}>
                    <option value="League">League</option>
                    <option value="Cup">Cup</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Friendly">Friendly</option>
                  </Select>
                </div>

                <div>
                  <Label>Target team count</Label>
                  <Input
                    value={state.teamCountTarget}
                    onChange={(e) => update("teamCountTarget", e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <Label>Max players per team</Label>
                  <Input
                    value={state.maxPlayersPerTeam}
                    onChange={(e) => update("maxPlayersPerTeam", e.target.value)}
                    placeholder="e.g., 18"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SCHEDULING */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Scheduling is intentionally loose for now; later this can connect to Calendar/Fixtures. */}
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Scheduling</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Typical match day</Label>
                  <Input value={state.matchDay} onChange={(e) => update("matchDay", e.target.value)} placeholder="e.g., Saturdays" />
                </div>

                <div>
                  <Label>Time window</Label>
                  <Input
                    value={state.matchTimeWindow}
                    onChange={(e) => update("matchTimeWindow", e.target.value)}
                    placeholder="e.g., 09:00–18:00"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Venue notes</Label>
                  <TextArea
                    rows={3}
                    value={state.venueNotes}
                    onChange={(e) => update("venueNotes", e.target.value)}
                    placeholder="e.g., Home fixtures at Europa Sports Complex unless otherwise allocated."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          {/* ADMIN / GOVERNANCE */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Who is responsible for this league. Later can drive notifications + approvals. */}
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Coordinator & Rules</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>League coordinator</Label>
                  <Input
                    value={state.leagueCoordinatorName}
                    onChange={(e) => update("leagueCoordinatorName", e.target.value)}
                    placeholder="Name"
                  />
                </div>

                <div>
                  <Label>Coordinator email</Label>
                  <Input
                    type="email"
                    value={state.leagueCoordinatorEmail}
                    onChange={(e) => update("leagueCoordinatorEmail", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <CheckboxRow
                  checked={state.safeguardingRequired}
                  onChange={(v) => update("safeguardingRequired", v)}
                  title="Safeguarding required"
                  description="Later: enforce DBS/safeguarding for teams in this league."
                />

                <div>
                  <Label>Minimum coaches per team</Label>
                  <Input
                    value={state.minCoachesPerTeam}
                    onChange={(e) => update("minCoachesPerTeam", e.target.value)}
                    placeholder="e.g., 1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DESCRIPTIONS */}
          <Card>
            <CardContent>
              {/* DEV NOTE: Public vs internal description helps reuse the same league record across admin & public views. */}
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-[#0C2F57]" />
                <div className="text-xl font-semibold">Descriptions</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Public description</Label>
                  <TextArea
                    rows={4}
                    value={state.publicDescription}
                    onChange={(e) => update("publicDescription", e.target.value)}
                    placeholder="Shown to clubs/teams when browsing leagues..."
                  />
                </div>

                <div>
                  <Label>Internal notes</Label>
                  <TextArea
                    rows={4}
                    value={state.internalNotes}
                    onChange={(e) => update("internalNotes", e.target.value)}
                    placeholder="Admin-only notes (allocations, special rules, contacts)..."
                  />
                </div>
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
                Next: wire backend + redirect to a league detail page (e.g. /admin/manage/leagues/[id]).
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
