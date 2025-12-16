"use client";

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Create User/Profile (Superuser Intake) (UI-only)
|--------------------------------------------------------------------------
| What this page is:
| - GSLA staff (superuser) intake wizard to create a user identity/profile.
| - Can also create the user's "initial membership assignment" (optional),
|   bypassing association approval (admin override).
|
| Why separate from Public Join:
| - Public flow should create: Identity + MembershipRequest(Pending).
| - Admin flow should allow: Identity + Membership(Active) directly (if required).
|
| Current behavior (UI-only):
| - Draft autosaves to localStorage under `DRAFT_KEY`.
| - "Create User" is UI-only (shows a toast and marks local status as Created).
|
| Wire backend later:
| - Replace `createUserUiOnly()` with server action/API call:
|   1) create identity/user
|   2) create profile fields
|   3) optionally create membership(s) + team/role assignments
|   4) optionally send welcome email / reset password invite
|
| IMPORTANT:
| - Uses plain HTML inputs to avoid missing shadcn components (Input/Label/etc).
| - Styling matches your existing Tailwind + GSLA blue.
|--------------------------------------------------------------------------
*/

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  UserPlus,
  Users,
  ShieldCheck,
  FileText,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
} from "lucide-react";

const DRAFT_KEY = `gsla_admin_create_user_draft_v1`;

type CreateStatus = "Not Started" | "Draft" | "Created";

type Role =
  | "User"
  | "Member"
  | "Volunteer"
  | "Coach"
  | "Coach Assistant"
  | "Team Manager"
  | "Referee"
  | "Official"
  | "Association Admin"
  | "GSLA Staff";

type MembershipStatus = "Active" | "Pending" | "Inactive";

type State = {
  status: CreateStatus;

  // Identity
  firstName: string;
  lastName: string;
  preferredName: string;
  dob: string;

  // Contact
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;

  // Account flags
  username: string;
  twoFA: boolean;
  sendInviteEmail: boolean;

  // Global roles
  roles: Role[];

  // Optional membership assignment (admin override)
  assignMembershipNow: boolean;
  membership: {
    sport: string;
    association: string;
    club: string;
    team: string;
    season: string;
    membershipType: string;
    registrationNo: string;
    league: string;
    status: MembershipStatus;
    teamRoles: string; // free text for now (U14 assistant, etc)
  };

  // Volunteer compliance quick flags (UI-only)
  volunteer: {
    active: boolean;
    startDate: string;
    renewalDate: string;
    awayEvents: boolean;
    availabilityWeekends: boolean;
    availabilityEvenings: boolean;
    compliance: {
      dbsValid: boolean;
      safeguardingValid: boolean;
      firstAidValid: boolean;
    };
  };

  // Documents placeholders (UI-only)
  docs: {
    idUploaded: boolean;
    dbsUploaded: boolean;
    safeguardingUploaded: boolean;
    firstAidUploaded: boolean;
    coachingCertUploaded: boolean;
  };

  // Internal note (first note at creation)
  internalNote: string;
};

const defaultState: State = {
  status: "Not Started",

  firstName: "",
  lastName: "",
  preferredName: "",
  dob: "",

  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",

  username: "",
  twoFA: false,
  sendInviteEmail: true,

  roles: ["User"],

  assignMembershipNow: false,
  membership: {
    sport: "",
    association: "",
    club: "",
    team: "",
    season: "",
    membershipType: "",
    registrationNo: "",
    league: "",
    status: "Active",
    teamRoles: "",
  },

  volunteer: {
    active: false,
    startDate: "",
    renewalDate: "",
    awayEvents: false,
    availabilityWeekends: false,
    availabilityEvenings: false,
    compliance: {
      dbsValid: false,
      safeguardingValid: false,
      firstAidValid: false,
    },
  },

  docs: {
    idUploaded: false,
    dbsUploaded: false,
    safeguardingUploaded: false,
    firstAidUploaded: false,
    coachingCertUploaded: false,
  },

  internalNote: "",
};

type StepKey = "identity" | "contact" | "account" | "membership" | "volunteer" | "documents" | "review";
type Step = { key: StepKey; title: string; description: string; icon: any };

const steps: Step[] = [
  { key: "identity", title: "Identity", description: "Core personal identity fields.", icon: UserPlus },
  { key: "contact", title: "Contact", description: "Email, phone, and address.", icon: Mail },
  { key: "account", title: "Account", description: "Username, security, access roles.", icon: KeyRound },
  { key: "membership", title: "Membership", description: "Optional membership assignment (admin override).", icon: Users },
  { key: "volunteer", title: "Volunteer", description: "Volunteer status and compliance flags (optional).", icon: ShieldCheck },
  { key: "documents", title: "Documents", description: "Optional doc placeholders (UI-only).", icon: FileText },
  { key: "review", title: "Review", description: "Confirm and create the user (UI-only).", icon: CheckCircle2 },
];

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-sm font-semibold text-slate-700">{children}</div>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
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

function CheckRow({
  checked,
  onChange,
  title,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3",
        disabled && "opacity-60"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
        disabled={disabled}
      />
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
      </div>
    </label>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function Page() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [state, setState] = React.useState<State>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);

  const step = steps[stepIndex];

  // Load draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<State>;
      setState((s) => ({ ...s, ...parsed, status: parsed.status ?? "Draft" }));
      setToast("Draft loaded.");
      window.setTimeout(() => setToast(null), 1500);
    } catch {
      // ignore
    }
  }, []);

  // Autosave
  React.useEffect(() => {
    try {
      const next = state.status === "Not Started" ? { ...state, status: "Draft" as const } : state;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      if (state.status === "Not Started") setState(next);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleRole(role: Role) {
    setState((s) => {
      const has = s.roles.includes(role);
      const nextRoles = has ? s.roles.filter((r) => r !== role) : [...s.roles, role];
      return { ...s, roles: nextRoles.length ? nextRoles : ["User"] };
    });
  }

  function saveDraftNow() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...state, status: "Draft" }));
      setToast("Draft saved.");
      window.setTimeout(() => setToast(null), 1400);
    } catch {
      setToast("Could not save draft in this browser.");
      window.setTimeout(() => setToast(null), 2000);
    }
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function createUserUiOnly() {
    setState((s) => ({ ...s, status: "Created" }));
    setToast("User created (UI-only).");
    window.setTimeout(() => setToast(null), 2000);
  }

  const missing = React.useMemo(() => {
    const m: string[] = [];
    if (!state.firstName.trim()) m.push("First name");
    if (!state.lastName.trim()) m.push("Last name");
    if (!state.dob.trim()) m.push("Date of birth");
    if (!state.email.trim()) m.push("Email");
    if (!state.username.trim()) m.push("Username");

    if (state.assignMembershipNow) {
      if (!state.membership.sport.trim()) m.push("Membership: sport");
      if (!state.membership.association.trim()) m.push("Membership: association");
      if (!state.membership.season.trim()) m.push("Membership: season");
    }

    return m;
  }, [state]);

  const created = state.status === "Created";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Create User / Profile</h1>
          <p className="mt-2 text-slate-600">
            GSLA staff intake. Create identity + optionally assign initial membership (admin override).
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill>Status: {state.status}</Pill>
            {state.assignMembershipNow ? <Pill>Membership: will be created</Pill> : <Pill>No membership assignment</Pill>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={saveDraftNow}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {toast}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* LEFT NAV */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-slate-700">
              Progress ({stepIndex + 1}/{steps.length})
            </div>

            <div className="mt-4 space-y-2">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const active = idx === stepIndex;
                const done = idx < stepIndex;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStepIndex(idx)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left transition",
                      active ? "border-[#0C2F57] bg-[#0C2F57]/5" : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 rounded-lg p-2",
                          active ? "bg-[#0C2F57] text-white" : done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={cn("text-sm font-semibold", active ? "text-[#0C2F57]" : "text-slate-800")}>
                          {s.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-500">{s.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {missing.length ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-semibold text-amber-800">Missing</div>
                <ul className="mt-2 list-disc pl-5 text-xs text-amber-800">
                  {missing.slice(0, 8).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                  {missing.length > 8 ? <li>…and {missing.length - 8} more</li> : null}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-xs font-semibold text-emerald-800">Ready</div>
                <div className="mt-1 text-xs text-emerald-800">No missing required fields detected.</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT CONTENT */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-[#0C2F57]" />
                  <h2 className="text-2xl font-extrabold text-[#0C2F57]">{step.title}</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                <ClipboardList className="mr-2 inline-block h-4 w-4" />
                Step {stepIndex + 1} / {steps.length}
              </div>
            </div>

            {/* STEP CONTENT */}
            {step.key === "identity" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>First name *</FieldLabel>
                    <TextInput value={state.firstName} onChange={(e) => update("firstName", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Last name *</FieldLabel>
                    <TextInput value={state.lastName} onChange={(e) => update("lastName", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Preferred name</FieldLabel>
                    <TextInput value={state.preferredName} onChange={(e) => update("preferredName", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Date of birth *</FieldLabel>
                    <TextInput type="date" value={state.dob} onChange={(e) => update("dob", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step.key === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Email *</FieldLabel>
                    <TextInput type="email" value={state.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <TextInput value={state.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    Address
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Address line 1</FieldLabel>
                      <TextInput value={state.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Address line 2</FieldLabel>
                      <TextInput value={state.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>City</FieldLabel>
                      <TextInput value={state.city} onChange={(e) => update("city", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Postcode</FieldLabel>
                      <TextInput value={state.postcode} onChange={(e) => update("postcode", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "account" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Username *</FieldLabel>
                    <TextInput value={state.username} onChange={(e) => update("username", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Two-factor enabled</FieldLabel>
                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        checked={state.twoFA}
                        onChange={(e) => update("twoFA", e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-semibold text-slate-800">2FA enabled</span>
                    </label>
                  </div>
                </div>

                <CheckRow
                  checked={state.sendInviteEmail}
                  onChange={(v) => update("sendInviteEmail", v)}
                  title="Send invite email"
                  description="Later: triggers password setup / welcome email."
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Roles (global)</div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(
                      [
                        "User",
                        "Member",
                        "Volunteer",
                        "Coach",
                        "Coach Assistant",
                        "Team Manager",
                        "Referee",
                        "Official",
                        "Association Admin",
                        "GSLA Staff",
                      ] as Role[]
                    ).map((r) => (
                      <label key={r} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={state.roles.includes(r)}
                          onChange={() => toggleRole(r)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-semibold text-slate-800">{r}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    Tip: In production, global roles should be kept small; sport/club roles should live in Memberships.
                  </div>
                </div>
              </div>
            )}

            {step.key === "membership" && (
              <div className="space-y-6">
                <CheckRow
                  checked={state.assignMembershipNow}
                  onChange={(v) => update("assignMembershipNow", v)}
                  title="Assign a membership now (admin override)"
                  description="Creates an Active membership directly (no association approval needed)."
                />

                <div className={cn("space-y-4", !state.assignMembershipNow && "opacity-60")}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Sport *</FieldLabel>
                      <TextInput
                        value={state.membership.sport}
                        onChange={(e) => update("membership", { ...state.membership, sport: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Association *</FieldLabel>
                      <TextInput
                        value={state.membership.association}
                        onChange={(e) => update("membership", { ...state.membership, association: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Club</FieldLabel>
                      <TextInput
                        value={state.membership.club}
                        onChange={(e) => update("membership", { ...state.membership, club: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Team</FieldLabel>
                      <TextInput
                        value={state.membership.team}
                        onChange={(e) => update("membership", { ...state.membership, team: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Season *</FieldLabel>
                      <TextInput
                        value={state.membership.season}
                        onChange={(e) => update("membership", { ...state.membership, season: e.target.value })}
                        placeholder="e.g., 2025–2026"
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Membership type</FieldLabel>
                      <TextInput
                        value={state.membership.membershipType}
                        onChange={(e) => update("membership", { ...state.membership, membershipType: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>Registration No.</FieldLabel>
                      <TextInput
                        value={state.membership.registrationNo}
                        onChange={(e) => update("membership", { ...state.membership, registrationNo: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div>
                      <FieldLabel>League</FieldLabel>
                      <TextInput
                        value={state.membership.league}
                        onChange={(e) => update("membership", { ...state.membership, league: e.target.value })}
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Team roles / positions</FieldLabel>
                      <TextInput
                        value={state.membership.teamRoles}
                        onChange={(e) => update("membership", { ...state.membership, teamRoles: e.target.value })}
                        placeholder="e.g., U14 Assistant Coach, Match Day Volunteer"
                        disabled={!state.assignMembershipNow}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "volunteer" && (
              <div className="space-y-6">
                <CheckRow
                  checked={state.volunteer.active}
                  onChange={(v) => update("volunteer", { ...state.volunteer, active: v })}
                  title="Volunteer profile active"
                  description="If enabled, you can set dates/availability and compliance flags."
                />

                <div className={cn("space-y-4", !state.volunteer.active && "opacity-60")}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <TextInput
                        type="date"
                        value={state.volunteer.startDate}
                        onChange={(e) => update("volunteer", { ...state.volunteer, startDate: e.target.value })}
                        disabled={!state.volunteer.active}
                      />
                    </div>
                    <div>
                      <FieldLabel>Renewal date</FieldLabel>
                      <TextInput
                        type="date"
                        value={state.volunteer.renewalDate}
                        onChange={(e) => update("volunteer", { ...state.volunteer, renewalDate: e.target.value })}
                        disabled={!state.volunteer.active}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <CheckRow
                      checked={state.volunteer.availabilityWeekends}
                      onChange={(v) => update("volunteer", { ...state.volunteer, availabilityWeekends: v })}
                      title="Available weekends"
                      disabled={!state.volunteer.active}
                    />
                    <CheckRow
                      checked={state.volunteer.availabilityEvenings}
                      onChange={(v) => update("volunteer", { ...state.volunteer, availabilityEvenings: v })}
                      title="Available evenings"
                      disabled={!state.volunteer.active}
                    />
                    <CheckRow
                      checked={state.volunteer.awayEvents}
                      onChange={(v) => update("volunteer", { ...state.volunteer, awayEvents: v })}
                      title="Away events"
                      disabled={!state.volunteer.active}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Compliance flags (quick)</div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <CheckRow
                        checked={state.volunteer.compliance.dbsValid}
                        onChange={(v) =>
                          update("volunteer", {
                            ...state.volunteer,
                            compliance: { ...state.volunteer.compliance, dbsValid: v },
                          })
                        }
                        title="DBS/Vetting valid"
                        disabled={!state.volunteer.active}
                      />
                      <CheckRow
                        checked={state.volunteer.compliance.safeguardingValid}
                        onChange={(v) =>
                          update("volunteer", {
                            ...state.volunteer,
                            compliance: { ...state.volunteer.compliance, safeguardingValid: v },
                          })
                        }
                        title="Safeguarding valid"
                        disabled={!state.volunteer.active}
                      />
                      <CheckRow
                        checked={state.volunteer.compliance.firstAidValid}
                        onChange={(v) =>
                          update("volunteer", {
                            ...state.volunteer,
                            compliance: { ...state.volunteer.compliance, firstAidValid: v },
                          })
                        }
                        title="First Aid valid"
                        disabled={!state.volunteer.active}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "documents" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Document placeholders</div>
                  <div className="mt-2 text-xs text-slate-600">
                    UI-only. Later replace with real uploads + expiry tracking.
                  </div>

                  <div className="mt-4 space-y-3">
                    <CheckRow checked={state.docs.idUploaded} onChange={(v) => update("docs", { ...state.docs, idUploaded: v })} title="ID uploaded" />
                    <CheckRow checked={state.docs.dbsUploaded} onChange={(v) => update("docs", { ...state.docs, dbsUploaded: v })} title="DBS/Vetting uploaded" />
                    <CheckRow checked={state.docs.safeguardingUploaded} onChange={(v) => update("docs", { ...state.docs, safeguardingUploaded: v })} title="Safeguarding uploaded" />
                    <CheckRow checked={state.docs.firstAidUploaded} onChange={(v) => update("docs", { ...state.docs, firstAidUploaded: v })} title="First Aid uploaded" />
                    <CheckRow checked={state.docs.coachingCertUploaded} onChange={(v) => update("docs", { ...state.docs, coachingCertUploaded: v })} title="Coaching certificate uploaded" />
                  </div>
                </div>

                <div>
                  <FieldLabel>Internal note (optional)</FieldLabel>
                  <TextArea
                    className="min-h-[120px]"
                    value={state.internalNote}
                    onChange={(e) => update("internalNote", e.target.value)}
                    placeholder="Admin-only note about this profile creation..."
                  />
                </div>
              </div>
            )}

            {step.key === "review" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">Summary</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Name</div>
                      <div className="font-semibold text-slate-800">
                        {state.firstName || "—"} {state.lastName || ""}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">DOB</div>
                      <div className="font-semibold text-slate-800">{state.dob || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Email</div>
                      <div className="font-semibold text-slate-800">{state.email || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Username</div>
                      <div className="font-semibold text-slate-800">{state.username || "—"}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-slate-500">Roles</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {state.roles.map((r) => (
                          <Pill key={r}>{r}</Pill>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-slate-500">Membership assignment</div>
                      <div className="mt-1 font-semibold text-slate-800">
                        {state.assignMembershipNow
                          ? `${state.membership.sport || "—"} • ${state.membership.association || "—"} • ${state.membership.season || "—"}`
                          : "None"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Create user</div>
                    <div className="mt-1 text-xs text-slate-600">
                      UI-only. Backend later will create identity + optionally create active membership.
                    </div>
                    {missing.length ? (
                      <div className="mt-2 text-xs text-rose-700">
                        Missing required: {missing.slice(0, 6).join(", ")}
                        {missing.length > 6 ? "…" : ""}
                      </div>
                    ) : null}
                  </div>

                  <Button onClick={createUserUiOnly} disabled={created || missing.length > 0}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {created ? "Created" : "Create User"}
                  </Button>
                </div>

                {created ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <div className="font-semibold">Created!</div>
                    <div className="mt-1 text-xs text-emerald-900/80">
                      Next step: wire to backend → redirect to /admin/users/[id].
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Footer nav */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={goBack} disabled={stepIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="text-sm text-slate-500">
                Step {stepIndex + 1} of {steps.length}
              </div>

              <Button onClick={goNext} disabled={stepIndex === steps.length - 1}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
