"use client";

/*
|--------------------------------------------------------------------------
| PAGE: Public Intake — Create Profile + Join Request (UI-only)
|--------------------------------------------------------------------------
| What this is:
| - A public-facing wizard where a person creates their profile AND requests to join
|   an association/team with roles (e.g., coach, president, volunteer, player).
|
| Why this exists:
| - Supports your intended data flow:
|   Public creates profile + join request → Association Admin reviews → approval activates membership.
|
| Current behavior (UI-only):
| - Draft autosaves to localStorage.
| - "Submit" only changes a local UI status (no backend).
|
| Where to wire real logic later:
| - Replace `submitUiOnly()` with a server action/API call:
|     1) create/update user profile (identity)
|     2) create membership request (Pending)
|     3) notify association admins
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
  ClipboardList,
  User,
  Users,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";

const DRAFT_KEY = `gsla_public_join_draft_v1`;

type JoinStatus = "Not Started" | "Draft" | "Submitted";

type RoleRequest =
  | "Player"
  | "Member"
  | "Volunteer"
  | "Coach"
  | "Assistant Coach"
  | "Team Manager"
  | "Referee"
  | "Official"
  | "President"
  | "Secretary"
  | "Treasurer"
  | "Committee Member";

type State = {
  status: JoinStatus;

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

  // Join request
  sport: string;
  association: string;
  team: string;
  requestedRoles: RoleRequest[];
  shortBio: string;

  // Volunteer intent + basic safeguarding declarations (UI-only)
  wantsToVolunteer: boolean;
  availableWeekends: boolean;
  availableEvenings: boolean;
  willingAwayEvents: boolean;

  // Documents placeholder (UI-only)
  docs: {
    idUploaded: boolean;
    dbsUploaded: boolean;
    safeguardingUploaded: boolean;
    firstAidUploaded: boolean;
  };

  // Consent (needed for public submission)
  consentAccurate: boolean;
  consentContact: boolean;
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

  sport: "",
  association: "",
  team: "",
  requestedRoles: [],
  shortBio: "",

  wantsToVolunteer: false,
  availableWeekends: false,
  availableEvenings: false,
  willingAwayEvents: false,

  docs: {
    idUploaded: false,
    dbsUploaded: false,
    safeguardingUploaded: false,
    firstAidUploaded: false,
  },

  consentAccurate: false,
  consentContact: false,
};

type StepKey = "personal" | "contact" | "membership" | "volunteer" | "documents" | "review";
type Step = { key: StepKey; title: string; description: string; icon: any };

const steps: Step[] = [
  { key: "personal", title: "Personal", description: "Your name and basic identity details.", icon: User },
  { key: "contact", title: "Contact", description: "How we can reach you (and where you live).", icon: Mail },
  { key: "membership", title: "Join Request", description: "Which sport/association/team and your requested roles.", icon: Users },
  { key: "volunteer", title: "Volunteering", description: "Availability and volunteering preferences.", icon: ShieldCheck },
  { key: "documents", title: "Documents", description: "Optional uploads (placeholders for now).", icon: FileText },
  { key: "review", title: "Review", description: "Confirm details and submit for approval.", icon: CheckCircle2 },
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
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
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
      window.setTimeout(() => setToast(null), 1600);
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

  function toggleRole(role: RoleRequest) {
    setState((s) => {
      const has = s.requestedRoles.includes(role);
      return {
        ...s,
        requestedRoles: has ? s.requestedRoles.filter((r) => r !== role) : [...s.requestedRoles, role],
      };
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

  function submitUiOnly() {
    setState((s) => ({ ...s, status: "Submitted" }));
    setToast("Submitted for approval (UI-only).");
    window.setTimeout(() => setToast(null), 2200);
  }

  const missing = React.useMemo(() => {
    const m: string[] = [];
    if (!state.firstName.trim()) m.push("First name");
    if (!state.lastName.trim()) m.push("Last name");
    if (!state.dob.trim()) m.push("Date of birth");
    if (!state.email.trim()) m.push("Email");
    if (!state.phone.trim()) m.push("Phone");
    if (!state.sport.trim()) m.push("Sport");
    if (!state.association.trim()) m.push("Association");
    if (state.requestedRoles.length === 0) m.push("At least one role");
    if (!state.consentAccurate) m.push("Consent: details are accurate");
    if (!state.consentContact) m.push("Consent: GSLA/Association can contact you");
    return m;
  }, [state]);

  const submitted = state.status === "Submitted";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#0C2F57]">Join a Sport / Association</h1>
            <p className="mt-2 text-slate-600">
              Create your profile and request membership. Your request will be reviewed by the association admin.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Pill>Status: {state.status}</Pill>
              {submitted ? <Pill>Next: Admin approval</Pill> : <Pill>Auto-saving draft</Pill>}
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
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
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
                  <div className="text-xs font-semibold text-emerald-800">Ready to submit</div>
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
              {step.key === "personal" && (
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
                      <FieldLabel>Phone *</FieldLabel>
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

              {step.key === "membership" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Sport *</FieldLabel>
                      <TextInput value={state.sport} onChange={(e) => update("sport", e.target.value)} placeholder="e.g., Football" />
                    </div>
                    <div>
                      <FieldLabel>Association / Club *</FieldLabel>
                      <TextInput value={state.association} onChange={(e) => update("association", e.target.value)} placeholder="e.g., GSLA United" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Team (optional)</FieldLabel>
                      <TextInput value={state.team} onChange={(e) => update("team", e.target.value)} placeholder="e.g., U14" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Requested roles *</div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(
                        [
                          "Player",
                          "Member",
                          "Volunteer",
                          "Coach",
                          "Assistant Coach",
                          "Team Manager",
                          "Referee",
                          "Official",
                          "President",
                          "Secretary",
                          "Treasurer",
                          "Committee Member",
                        ] as RoleRequest[]
                      ).map((r) => (
                        <label key={r} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <input
                            type="checkbox"
                            checked={state.requestedRoles.includes(r)}
                            onChange={() => toggleRole(r)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-semibold text-slate-800">{r}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <FieldLabel>Short bio / message to the association (optional)</FieldLabel>
                      <TextArea
                        className="min-h-[120px]"
                        value={state.shortBio}
                        onChange={(e) => update("shortBio", e.target.value)}
                        placeholder="e.g., I’m looking to help with the youth team and volunteer on match days..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {step.key === "volunteer" && (
                <div className="space-y-6">
                  <CheckRow
                    checked={state.wantsToVolunteer}
                    onChange={(v) => update("wantsToVolunteer", v)}
                    title="I want to volunteer"
                    description="Tick if you want to help with events, teams, officiating, admin support, etc."
                  />

                  <div className={cn("grid grid-cols-1 gap-3", state.wantsToVolunteer ? "" : "opacity-60")}>
                    <CheckRow
                      checked={state.availableWeekends}
                      onChange={(v) => update("availableWeekends", v)}
                      title="Available on weekends"
                    />
                    <CheckRow
                      checked={state.availableEvenings}
                      onChange={(v) => update("availableEvenings", v)}
                      title="Available on evenings"
                    />
                    <CheckRow
                      checked={state.willingAwayEvents}
                      onChange={(v) => update("willingAwayEvents", v)}
                      title="Willing to support away events"
                      description="If your role requires travel (optional)."
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    Note: safeguarding/DBS checks can be requested after approval depending on your requested role.
                  </div>
                </div>
              )}

              {step.key === "documents" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Optional document placeholders</div>
                    <div className="mt-2 text-xs text-slate-600">
                      UI-only: later replace with real upload components + storage.
                    </div>

                    <div className="mt-4 space-y-3">
                      <CheckRow checked={state.docs.idUploaded} onChange={(v) => update("docs", { ...state.docs, idUploaded: v })} title="ID verification uploaded" />
                      <CheckRow checked={state.docs.dbsUploaded} onChange={(v) => update("docs", { ...state.docs, dbsUploaded: v })} title="DBS / Vetting uploaded" />
                      <CheckRow checked={state.docs.safeguardingUploaded} onChange={(v) => update("docs", { ...state.docs, safeguardingUploaded: v })} title="Safeguarding certificate uploaded" />
                      <CheckRow checked={state.docs.firstAidUploaded} onChange={(v) => update("docs", { ...state.docs, firstAidUploaded: v })} title="First Aid certificate uploaded" />
                    </div>
                  </div>
                </div>
              )}

              {step.key === "review" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-800">Review</div>
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
                        <div className="text-xs text-slate-500">Phone</div>
                        <div className="font-semibold text-slate-800">{state.phone || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Sport</div>
                        <div className="font-semibold text-slate-800">{state.sport || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Association</div>
                        <div className="font-semibold text-slate-800">{state.association || "—"}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs text-slate-500">Requested roles</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {state.requestedRoles.length ? (
                            state.requestedRoles.map((r) => <Pill key={r}>{r}</Pill>)
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <CheckRow
                      checked={state.consentAccurate}
                      onChange={(v) => update("consentAccurate", v)}
                      title="I confirm that the information provided is accurate *"
                    />
                    <CheckRow
                      checked={state.consentContact}
                      onChange={(v) => update("consentContact", v)}
                      title="I agree that GSLA and the association may contact me regarding this request *"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Submit for approval</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Your request will be reviewed by the association admin.
                      </div>
                      {missing.length ? (
                        <div className="mt-2 text-xs text-rose-700">
                          Missing required: {missing.slice(0, 5).join(", ")}
                          {missing.length > 5 ? "…" : ""}
                        </div>
                      ) : null}
                    </div>

                    <Button onClick={submitUiOnly} disabled={submitted || missing.length > 0}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {submitted ? "Submitted" : "Submit"}
                    </Button>
                  </div>

                  {submitted ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                      <div className="font-semibold">Submitted!</div>
                      <div className="mt-1 text-xs text-emerald-900/80">
                        Next step: the association admin will approve/reject your membership request.
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

                <div className="text-sm text-slate-500">Step {stepIndex + 1} of {steps.length}</div>

                <Button onClick={goNext} disabled={stepIndex === steps.length - 1}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer hint for future flow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
            <div>
              <div className="font-semibold text-slate-800">Future flow</div>
              <div className="mt-1">
                On submit, you’ll create a <span className="font-semibold">Membership Request</span> (Pending) and notify
                the association admin. They approve → membership becomes Active and roles/teams are assigned.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
