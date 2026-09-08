// app/admin/association/registration/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * What this page is:
 * - UI-only multi-step Annual Registration (Form A) for GSLA Associations.
 * - Current route requested by you: /admin/association/registration
 *   (Note: earlier we discussed /admin/associations/register, but you chose this path.)
 *
 * Why it’s built like this:
 * - Your project currently errors on imports like:
 *   "@/components/ui/input", "@/components/ui/label", "@/components/ui/textarea",
 *   "@/components/ui/checkbox", "@/components/ui/select"
 * - Your Button component supports ONLY:
 *   variant?: "default" | "outline"
 *   (no `size` prop, no "ghost" variant)
 * - Therefore this page uses:
 *   - Card/CardContent + Button from your UI kit
 *   - Plain HTML <input>, <textarea>, <select> to avoid missing modules
 *
 * “Once a year” behaviour:
 * - Draft autosaves to localStorage with a key that includes the current year:
 *   gsla_formA_<YEAR>_draft_v1
 * - This keeps drafts separated year-by-year.
 *
 * UI-only / not wired yet:
 * - "Submit" just shows a toast (no backend).
 * - File pickers do NOT upload; we only store filenames for review UX.
 *
 * Where to edit:
 * - Steps: `steps`
 * - State model: `FormAState` + `defaultState`
 * - Step UIs: switch block under "STEP CONTENT"
 * - Backend later: replace `submitUiOnly()`
 */

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Shield,
  ClipboardList,
  ListChecks,
  Globe,
  FileText,
  Target,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  Plus,
  X,
} from "lucide-react";

const REG_YEAR = new Date().getFullYear();
const DRAFT_KEY = `gsla_formA_${REG_YEAR}_draft_v1`;

type CommitteeMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

type Club = {
  id: string;
  clubName: string;
  contactName: string;
  socials: string;
  email: string;
  phone: string;
};

type CoachRow = {
  id: string;
  name: string;
  qualification: string;
  expiry: string;
  safeguarding: string;
};

type OfficialRow = {
  id: string;
  name: string;
  qualification: string;
  expiry: string;
};

type YouthSessionRow = {
  id: string;
  coachName: string;
  schoolOrProgramme: string;
  sessionsPerWeek: string;
  totalJuniors: string;
};

type FormAState = {
  // Organisation
  applicationDate: string;
  governingBodyName: string;
  centralEmail: string;
  safeguardingEmail: string;

  // Executive committee
  presidentName: string;
  presidentEmail: string;
  presidentPhone: string;

  secretaryName: string;
  secretaryEmail: string;
  secretaryPhone: string;

  otherCommittee: CommitteeMember[];

  // Safeguarding officers
  welfareOfficer1Name: string;
  welfareOfficer1Phone: string;
  welfareOfficer2Name: string;
  welfareOfficer2Phone: string;

  // Governance & clubs
  subCommittees: string;
  lastAgmDate: string;
  affiliatedClubs: Club[];

  // Membership & fees
  juniorsMale: string;
  juniorsFemale: string;
  seniorsMale: string;
  seniorsFemale: string;
  veteransMale: string;
  veteransFemale: string;
  socialMale: string;
  socialFemale: string;

  clubFeeJuniors: string;
  clubFeeSeniors: string;
  clubFeeVeterans: string;
  clubFeeSocial: string;

  individualFeeJuniors: string;
  individualFeeSeniors: string;
  individualFeeVeterans: string;
  individualFeeSocial: string;

  // Online
  website: string;
  instagram: string;
  facebook: string;
  x: string;

  // Compliance (UI-only files)
  constitutionAmended: "" | "yes" | "no";
  publicLiabilityProvider: string;
  publicLiabilityExpiry: string;
  internationalFederationMember: "" | "yes" | "no" | "intends";
  internationalFederationName: string;

  files: {
    agmMinutes: string[];
    welfareTier1: string[];
    constitution: string[];
    annualAccounts: string[];
    insurance: string[];
    federationProof: string[];
  };

  // Registers
  coaches: CoachRow[];
  officials: OfficialRow[];
  youthSessions: YouthSessionRow[];

  // Plans & funding
  aimsNextYear: string;
  actionsPerAim: string;
  successMeasures: string;

  requestInternational: string;
  requestSportsDev: string;
  requestAgmConference: string;
  requestFacilities: string;
  requestSchoolsMentoring: string;

  // Bank & agreements
  bankChanged: "" | "yes" | "no";
  bankName: string;
  accountName: string;
  iban: string;
  swift: string;

  antiDopingAgree: boolean;

  conditions: {
    constitutionSubmitted: boolean;
    agmWithinTwoYears: boolean;
    accountsWithinTwoYears: boolean;
    safeguardingOfficersAppointed: boolean;
    insuranceValid: boolean;
    notifyChanges: boolean;
  };

  signatory1Name: string;
  signatory1Role: string;
  signatory1Date: string;

  signatory2Name: string;
  signatory2Role: string;
  signatory2Date: string;
};

const defaultState: FormAState = {
  applicationDate: "",
  governingBodyName: "",
  centralEmail: "",
  safeguardingEmail: "",

  presidentName: "",
  presidentEmail: "",
  presidentPhone: "",

  secretaryName: "",
  secretaryEmail: "",
  secretaryPhone: "",

  otherCommittee: [],

  welfareOfficer1Name: "",
  welfareOfficer1Phone: "",
  welfareOfficer2Name: "",
  welfareOfficer2Phone: "",

  subCommittees: "",
  lastAgmDate: "",
  affiliatedClubs: [],

  juniorsMale: "",
  juniorsFemale: "",
  seniorsMale: "",
  seniorsFemale: "",
  veteransMale: "",
  veteransFemale: "",
  socialMale: "",
  socialFemale: "",

  clubFeeJuniors: "",
  clubFeeSeniors: "",
  clubFeeVeterans: "",
  clubFeeSocial: "",

  individualFeeJuniors: "",
  individualFeeSeniors: "",
  individualFeeVeterans: "",
  individualFeeSocial: "",

  website: "",
  instagram: "",
  facebook: "",
  x: "",

  constitutionAmended: "",
  publicLiabilityProvider: "",
  publicLiabilityExpiry: "",
  internationalFederationMember: "",
  internationalFederationName: "",

  files: {
    agmMinutes: [],
    welfareTier1: [],
    constitution: [],
    annualAccounts: [],
    insurance: [],
    federationProof: [],
  },

  coaches: [],
  officials: [],
  youthSessions: [],

  aimsNextYear: "",
  actionsPerAim: "",
  successMeasures: "",

  requestInternational: "",
  requestSportsDev: "",
  requestAgmConference: "",
  requestFacilities: "",
  requestSchoolsMentoring: "",

  bankChanged: "",
  bankName: "",
  accountName: "",
  iban: "",
  swift: "",

  antiDopingAgree: false,

  conditions: {
    constitutionSubmitted: false,
    agmWithinTwoYears: false,
    accountsWithinTwoYears: false,
    safeguardingOfficersAppointed: false,
    insuranceValid: false,
    notifyChanges: false,
  },

  signatory1Name: "",
  signatory1Role: "",
  signatory1Date: "",

  signatory2Name: "",
  signatory2Role: "",
  signatory2Date: "",
};

type StepKey =
  | "org"
  | "committee"
  | "safeguarding"
  | "governance"
  | "membership"
  | "online"
  | "compliance"
  | "registers"
  | "plans"
  | "signoff"
  | "review";

type Step = {
  key: StepKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  { key: "org", title: "Organisation", description: "Governing body + contact emails.", icon: Building2 },
  { key: "committee", title: "Executive Committee", description: "President, Secretary, and committee members.", icon: Users },
  { key: "safeguarding", title: "Safeguarding", description: "Welfare officers + Tier 1 evidence.", icon: Shield },
  { key: "governance", title: "Governance & Clubs", description: "AGM details + affiliated clubs.", icon: ClipboardList },
  { key: "membership", title: "Membership & Fees", description: "Membership numbers and fee structure.", icon: ListChecks },
  { key: "online", title: "Online Presence", description: "Website and social links.", icon: Globe },
  { key: "compliance", title: "Compliance Documents", description: "Constitution, accounts, insurance, federation status.", icon: FileText },
  { key: "registers", title: "People Registers", description: "Coaches, officials, youth sessions.", icon: Users },
  { key: "plans", title: "Plans & Funding", description: "Aims, actions, measures, funding requests.", icon: Target },
  { key: "signoff", title: "Bank & Agreements", description: "Bank details, conditions, anti-doping, signatories.", icon: Banknote },
  { key: "review", title: "Review", description: "Final check + submit (UI-only).", icon: CheckCircle2 },
];

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function cn(...v: Array<string | false | null | undefined>): string {
  return v.filter(Boolean).join(" ");
}

/** Simple reusable form label (avoids missing UI Label component) */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-sm font-semibold text-slate-700">{children}</div>;
}

/** Simple text input styling */
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

/** Simple textarea styling */
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

/** Simple select styling */
function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
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

/** Simple checkbox styling */
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

function FilePicker({
  title,
  hint,
  value,
  onPick,
  onClear,
}: {
  title: string;
  hint?: string;
  value: string[];
  onPick: (files: FileList | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
        {value.length ? (
          <Button variant="outline" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className="mt-3">
        <input
          type="file"
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPick(e.target.files)}
          className="block w-full text-sm"
        />
      </div>

      {value.length ? (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
          <div className="font-semibold text-slate-700">Selected files:</div>
          <ul className="mt-2 list-disc pl-5 text-slate-600">
            {value.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-slate-500">UI-only: filenames stored for review; no upload yet.</div>
        </div>
      ) : null}
    </div>
  );
}

function RowRemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      <X className="mr-2 h-4 w-4" />
      Remove
    </Button>
  );
}

export default function AssociationAnnualRegistrationPage() {
  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<FormAState>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);

  const step = steps[stepIndex];

  // Load this year's draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormAState>;
      setState((s) => ({ ...s, ...parsed }));
      setToast(`Draft loaded for ${REG_YEAR}.`);
      window.setTimeout(() => setToast(null), 2200);
    } catch {
      // ignore corrupted draft
    }
  }, []);

  // Autosave draft
  React.useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function update<K extends keyof FormAState>(key: K, value: FormAState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function saveDraftNow() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      setToast("Draft saved.");
      window.setTimeout(() => setToast(null), 1800);
    } catch {
      setToast("Could not save draft in this browser.");
      window.setTimeout(() => setToast(null), 2200);
    }
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setState(defaultState);
    setStepIndex(0);
    setToast(`Draft cleared for ${REG_YEAR}.`);
    window.setTimeout(() => setToast(null), 2000);
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pickFiles(key: keyof FormAState["files"], files: FileList | null) {
    const names = files ? Array.from(files).map((f) => f.name) : [];
    setState((s) => ({ ...s, files: { ...s.files, [key]: names } }));
  }

  function clearFiles(key: keyof FormAState["files"]) {
    setState((s) => ({ ...s, files: { ...s.files, [key]: [] } }));
  }

  // Repeatable rows helpers
  function addCommitteeMember() {
    setState((s) => ({
      ...s,
      otherCommittee: [...s.otherCommittee, { id: uid(), name: "", role: "", email: "", phone: "" }],
    }));
  }
  function updateCommitteeMember(id: string, patch: Partial<CommitteeMember>) {
    setState((s) => ({
      ...s,
      otherCommittee: s.otherCommittee.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }
  function removeCommitteeMember(id: string) {
    setState((s) => ({ ...s, otherCommittee: s.otherCommittee.filter((m) => m.id !== id) }));
  }

  function addClub() {
    setState((s) => ({
      ...s,
      affiliatedClubs: [
        ...s.affiliatedClubs,
        { id: uid(), clubName: "", contactName: "", socials: "", email: "", phone: "" },
      ],
    }));
  }
  function updateClub(id: string, patch: Partial<Club>) {
    setState((s) => ({
      ...s,
      affiliatedClubs: s.affiliatedClubs.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }
  function removeClub(id: string) {
    setState((s) => ({ ...s, affiliatedClubs: s.affiliatedClubs.filter((c) => c.id !== id) }));
  }

  function addCoach() {
    setState((s) => ({
      ...s,
      coaches: [...s.coaches, { id: uid(), name: "", qualification: "", expiry: "", safeguarding: "" }],
    }));
  }
  function updateCoach(id: string, patch: Partial<CoachRow>) {
    setState((s) => ({ ...s, coaches: s.coaches.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }
  function removeCoach(id: string) {
    setState((s) => ({ ...s, coaches: s.coaches.filter((r) => r.id !== id) }));
  }

  function addOfficial() {
    setState((s) => ({
      ...s,
      officials: [...s.officials, { id: uid(), name: "", qualification: "", expiry: "" }],
    }));
  }
  function updateOfficial(id: string, patch: Partial<OfficialRow>) {
    setState((s) => ({ ...s, officials: s.officials.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }
  function removeOfficial(id: string) {
    setState((s) => ({ ...s, officials: s.officials.filter((r) => r.id !== id) }));
  }

  function addYouthSession() {
    setState((s) => ({
      ...s,
      youthSessions: [
        ...s.youthSessions,
        { id: uid(), coachName: "", schoolOrProgramme: "", sessionsPerWeek: "", totalJuniors: "" },
      ],
    }));
  }
  function updateYouthSession(id: string, patch: Partial<YouthSessionRow>) {
    setState((s) => ({ ...s, youthSessions: s.youthSessions.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }
  function removeYouthSession(id: string) {
    setState((s) => ({ ...s, youthSessions: s.youthSessions.filter((r) => r.id !== id) }));
  }

  function submitUiOnly() {
    setToast(`Submitted for ${REG_YEAR} (UI-only).`);
    window.setTimeout(() => setToast(null), 2500);
  }

  const missingQuick = React.useMemo<string[]>(() => {
    const m: string[] = [];
    if (!state.governingBodyName.trim()) m.push("Governing body name");
    if (!state.centralEmail.trim()) m.push("Central email");
    if (!state.safeguardingEmail.trim()) m.push("Safeguarding email");
    if (!state.presidentName.trim()) m.push("President name");
    if (!state.secretaryName.trim()) m.push("Secretary name");
    if (!state.welfareOfficer1Name.trim()) m.push("Welfare officer 1 name");
    if (!state.lastAgmDate.trim()) m.push("Last AGM date");
    if (!state.antiDopingAgree) m.push("Anti-doping agreement");
    return m;
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">
            Annual Registration (Form A) — {REG_YEAR}
          </h1>
          <p className="mt-2 text-slate-600">
            Association annual registration (UI-only draft). Route: /admin/association/registration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={saveDraftNow}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={clearDraft}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Draft (this year)
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
                      active
                        ? "border-[#0C2F57] bg-[#0C2F57]/5"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 rounded-lg p-2",
                          active
                            ? "bg-[#0C2F57] text-white"
                            : done
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
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

            {missingQuick.length ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-semibold text-amber-800">Missing (quick check)</div>
                <ul className="mt-2 list-disc pl-5 text-xs text-amber-800">
                  {missingQuick.slice(0, 6).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                  {missingQuick.length > 6 ? <li>…and {missingQuick.length - 6} more</li> : null}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-xs font-semibold text-emerald-800">Looks good so far</div>
                <div className="mt-1 text-xs text-emerald-800">No obvious missing essentials detected.</div>
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
            </div>

            {/* STEP CONTENT */}
            {step.key === "org" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Organisation Details</div>
                  <div className="mt-1 text-sm text-slate-600">Core identity + official contact emails.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Application Date</FieldLabel>
                    <TextInput
                      type="date"
                      value={state.applicationDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("applicationDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Governing Body Name</FieldLabel>
                    <TextInput
                      value={state.governingBodyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("governingBodyName", e.target.value)}
                      placeholder="e.g., Gibraltar ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Central Email (generic)</FieldLabel>
                    <TextInput
                      value={state.centralEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("centralEmail", e.target.value)}
                      placeholder="info@..."
                    />
                  </div>
                  <div>
                    <FieldLabel>Safeguarding Email (restricted)</FieldLabel>
                    <TextInput
                      value={state.safeguardingEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("safeguardingEmail", e.target.value)}
                      placeholder="safeguarding@..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step.key === "committee" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">President</div>
                  <div className="mt-1 text-sm text-slate-600">Primary executive contact.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextInput
                      value={state.presidentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("presidentName", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextInput
                      value={state.presidentEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("presidentEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Telephone</FieldLabel>
                  <TextInput
                    value={state.presidentPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("presidentPhone", e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Secretary</div>
                  <div className="mt-1 text-sm text-slate-600">Main admin / coordination contact.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextInput
                      value={state.secretaryName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("secretaryName", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextInput
                      value={state.secretaryEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("secretaryEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Telephone</FieldLabel>
                  <TextInput
                    value={state.secretaryPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("secretaryPhone", e.target.value)}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Other Committee Members</div>
                      <div className="mt-1 text-xs text-slate-500">Add as many as needed.</div>
                    </div>
                    <Button onClick={addCommitteeMember}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.otherCommittee.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No committee members added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.otherCommittee.map((m) => (
                        <div key={m.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Name</FieldLabel>
                              <TextInput
                                value={m.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateCommitteeMember(m.id, { name: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <FieldLabel>Role</FieldLabel>
                              <TextInput
                                value={m.role}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateCommitteeMember(m.id, { role: e.target.value })
                                }
                                placeholder="e.g., Treasurer"
                              />
                            </div>
                            <div>
                              <FieldLabel>Email</FieldLabel>
                              <TextInput
                                value={m.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateCommitteeMember(m.id, { email: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <FieldLabel>Phone</FieldLabel>
                              <TextInput
                                value={m.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateCommitteeMember(m.id, { phone: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removeCommitteeMember(m.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step.key === "safeguarding" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Welfare / Safeguarding Officers</div>
                  <div className="mt-1 text-sm text-slate-600">Minimum two officers recommended.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Officer 1 Name</FieldLabel>
                    <TextInput
                      value={state.welfareOfficer1Name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficer1Name", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Officer 1 Phone</FieldLabel>
                    <TextInput
                      value={state.welfareOfficer1Phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficer1Phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Officer 2 Name</FieldLabel>
                    <TextInput
                      value={state.welfareOfficer2Name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficer2Name", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Officer 2 Phone</FieldLabel>
                    <TextInput
                      value={state.welfareOfficer2Phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficer2Phone", e.target.value)}
                    />
                  </div>
                </div>

                <FilePicker
                  title="Upload evidence of Safeguarding Tier 1 (or equivalent)"
                  hint="UI-only (not uploaded yet)."
                  value={state.files.welfareTier1}
                  onPick={(files) => pickFiles("welfareTier1", files)}
                  onClear={() => clearFiles("welfareTier1")}
                />
              </div>
            )}

            {step.key === "governance" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Governance</div>
                  <div className="mt-1 text-sm text-slate-600">AGM information and sub-committee details.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Last AGM Date</FieldLabel>
                    <TextInput
                      type="date"
                      value={state.lastAgmDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("lastAgmDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Sub-committees (optional)</FieldLabel>
                    <TextInput
                      value={state.subCommittees}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("subCommittees", e.target.value)}
                      placeholder="e.g., Youth Dev; Referees; Events"
                    />
                  </div>
                </div>

                <FilePicker
                  title="Upload AGM minutes (must be within 2 years)"
                  hint="UI-only (not uploaded yet)."
                  value={state.files.agmMinutes}
                  onPick={(files) => pickFiles("agmMinutes", files)}
                  onClear={() => clearFiles("agmMinutes")}
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Affiliated Clubs</div>
                      <div className="mt-1 text-xs text-slate-500">Add every club currently affiliated to the association.</div>
                    </div>
                    <Button onClick={addClub}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.affiliatedClubs.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No clubs added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.affiliatedClubs.map((c) => (
                        <div key={c.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Club Name</FieldLabel>
                              <TextInput
                                value={c.clubName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateClub(c.id, { clubName: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <FieldLabel>Contact Name</FieldLabel>
                              <TextInput
                                value={c.contactName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateClub(c.id, { contactName: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <FieldLabel>Socials</FieldLabel>
                              <TextInput
                                value={c.socials}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateClub(c.id, { socials: e.target.value })
                                }
                                placeholder="e.g., @clubhandle"
                              />
                            </div>
                            <div>
                              <FieldLabel>Email</FieldLabel>
                              <TextInput
                                value={c.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateClub(c.id, { email: e.target.value })
                                }
                              />
                            </div>
                            <div className="md:col-span-2">
                              <FieldLabel>Phone</FieldLabel>
                              <TextInput
                                value={c.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateClub(c.id, { phone: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removeClub(c.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step.key === "membership" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Membership Numbers</div>
                  <div className="mt-1 text-sm text-slate-600">Enter current membership numbers by category.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Juniors (Male)</FieldLabel>
                    <TextInput value={state.juniorsMale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("juniorsMale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Juniors (Female)</FieldLabel>
                    <TextInput value={state.juniorsFemale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("juniorsFemale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Seniors (Male)</FieldLabel>
                    <TextInput value={state.seniorsMale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("seniorsMale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Seniors (Female)</FieldLabel>
                    <TextInput value={state.seniorsFemale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("seniorsFemale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Veterans (Male)</FieldLabel>
                    <TextInput value={state.veteransMale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("veteransMale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Veterans (Female)</FieldLabel>
                    <TextInput value={state.veteransFemale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("veteransFemale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Social Members (Male)</FieldLabel>
                    <TextInput value={state.socialMale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("socialMale", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <FieldLabel>Social Members (Female)</FieldLabel>
                    <TextInput value={state.socialFemale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("socialFemale", e.target.value)} placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Club Association Fees</div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <FieldLabel>Juniors</FieldLabel>
                        <TextInput value={state.clubFeeJuniors} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("clubFeeJuniors", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Seniors</FieldLabel>
                        <TextInput value={state.clubFeeSeniors} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("clubFeeSeniors", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Veterans</FieldLabel>
                        <TextInput value={state.clubFeeVeterans} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("clubFeeVeterans", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Social</FieldLabel>
                        <TextInput value={state.clubFeeSocial} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("clubFeeSocial", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Individual Membership Fees</div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <FieldLabel>Juniors</FieldLabel>
                        <TextInput value={state.individualFeeJuniors} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("individualFeeJuniors", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Seniors</FieldLabel>
                        <TextInput value={state.individualFeeSeniors} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("individualFeeSeniors", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Veterans</FieldLabel>
                        <TextInput value={state.individualFeeVeterans} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("individualFeeVeterans", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Social</FieldLabel>
                        <TextInput value={state.individualFeeSocial} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("individualFeeSocial", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "online" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Website & Social Media</div>
                  <div className="mt-1 text-sm text-slate-600">Where the public can find your association.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Website</FieldLabel>
                    <TextInput value={state.website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("website", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <FieldLabel>Instagram</FieldLabel>
                    <TextInput value={state.instagram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("instagram", e.target.value)} placeholder="@handle or link" />
                  </div>
                  <div>
                    <FieldLabel>Facebook</FieldLabel>
                    <TextInput value={state.facebook} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("facebook", e.target.value)} placeholder="Page link" />
                  </div>
                  <div>
                    <FieldLabel>X (Twitter)</FieldLabel>
                    <TextInput value={state.x} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("x", e.target.value)} placeholder="@handle or link" />
                  </div>
                </div>
              </div>
            )}

            {step.key === "compliance" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Compliance Documents</div>
                  <div className="mt-1 text-sm text-slate-600">Uploads are UI-only for now.</div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FilePicker
                    title="Constitution (upload)"
                    hint="UI-only"
                    value={state.files.constitution}
                    onPick={(files) => pickFiles("constitution", files)}
                    onClear={() => clearFiles("constitution")}
                  />
                  <FilePicker
                    title="Annual Accounts (certified/audited within 2 years)"
                    hint="UI-only"
                    value={state.files.annualAccounts}
                    onPick={(files) => pickFiles("annualAccounts", files)}
                    onClear={() => clearFiles("annualAccounts")}
                  />
                  <FilePicker
                    title="Public Liability Insurance (policy evidence)"
                    hint="UI-only"
                    value={state.files.insurance}
                    onPick={(files) => pickFiles("insurance", files)}
                    onClear={() => clearFiles("insurance")}
                  />
                  <FilePicker
                    title="International Federation Proof (if applicable)"
                    hint="UI-only"
                    value={state.files.federationProof}
                    onPick={(files) => pickFiles("federationProof", files)}
                    onClear={() => clearFiles("federationProof")}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Constitution amended?</FieldLabel>
                      <SelectInput
                        value={state.constitutionAmended}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          update("constitutionAmended", e.target.value as FormAState["constitutionAmended"])
                        }
                      >
                        <option value="">Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </SelectInput>
                    </div>

                    <div>
                      <FieldLabel>International Federation Status</FieldLabel>
                      <SelectInput
                        value={state.internationalFederationMember}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          update("internationalFederationMember", e.target.value as FormAState["internationalFederationMember"])
                        }
                      >
                        <option value="">Select…</option>
                        <option value="yes">Member</option>
                        <option value="no">Not a member</option>
                        <option value="intends">Intends to become</option>
                      </SelectInput>
                    </div>

                    <div>
                      <FieldLabel>International Federation Name (if relevant)</FieldLabel>
                      <TextInput
                        value={state.internationalFederationName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("internationalFederationName", e.target.value)}
                      />
                    </div>

                    <div>
                      <FieldLabel>Public Liability Provider</FieldLabel>
                      <TextInput
                        value={state.publicLiabilityProvider}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("publicLiabilityProvider", e.target.value)}
                      />
                    </div>

                    <div>
                      <FieldLabel>Public Liability Expiry Date</FieldLabel>
                      <TextInput
                        type="date"
                        value={state.publicLiabilityExpiry}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("publicLiabilityExpiry", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "registers" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Registers</div>
                  <div className="mt-1 text-sm text-slate-600">Appendix-style tables: coaches, officials, youth sessions.</div>
                </div>

                {/* Coaches */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Coaches (Appendix 1)</div>
                      <div className="mt-1 text-xs text-slate-500">Name, qualification, expiry, safeguarding.</div>
                    </div>
                    <Button onClick={addCoach}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.coaches.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No coaches added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.coaches.map((r) => (
                        <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Name</FieldLabel>
                              <TextInput value={r.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCoach(r.id, { name: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>Qualification</FieldLabel>
                              <TextInput value={r.qualification} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCoach(r.id, { qualification: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>Expiry</FieldLabel>
                              <TextInput type="date" value={r.expiry} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCoach(r.id, { expiry: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>Safeguarding</FieldLabel>
                              <TextInput value={r.safeguarding} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCoach(r.id, { safeguarding: e.target.value })} placeholder="e.g., Tier 1 (date)" />
                            </div>
                          </div>
                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removeCoach(r.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Officials */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Officials (Appendix 2)</div>
                      <div className="mt-1 text-xs text-slate-500">Name, qualification, expiry.</div>
                    </div>
                    <Button onClick={addOfficial}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.officials.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No officials added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.officials.map((r) => (
                        <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Name</FieldLabel>
                              <TextInput value={r.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOfficial(r.id, { name: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>Qualification</FieldLabel>
                              <TextInput value={r.qualification} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOfficial(r.id, { qualification: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                              <FieldLabel>Expiry</FieldLabel>
                              <TextInput type="date" value={r.expiry} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOfficial(r.id, { expiry: e.target.value })} />
                            </div>
                          </div>
                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removeOfficial(r.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Youth */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Youth Training Allocations (Appendix 3)</div>
                      <div className="mt-1 text-xs text-slate-500">Coach, programme, sessions/week, total juniors.</div>
                    </div>
                    <Button onClick={addYouthSession}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.youthSessions.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No youth sessions added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.youthSessions.map((r) => (
                        <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Coach Name</FieldLabel>
                              <TextInput value={r.coachName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateYouthSession(r.id, { coachName: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>School / Programme</FieldLabel>
                              <TextInput value={r.schoolOrProgramme} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateYouthSession(r.id, { schoolOrProgramme: e.target.value })} />
                            </div>
                            <div>
                              <FieldLabel>Sessions per week</FieldLabel>
                              <TextInput value={r.sessionsPerWeek} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateYouthSession(r.id, { sessionsPerWeek: e.target.value })} placeholder="e.g., 2" />
                            </div>
                            <div>
                              <FieldLabel>Total juniors</FieldLabel>
                              <TextInput value={r.totalJuniors} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateYouthSession(r.id, { totalJuniors: e.target.value })} placeholder="e.g., 18" />
                            </div>
                          </div>
                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removeYouthSession(r.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step.key === "plans" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Plans for the Next Financial Year</div>
                  <div className="mt-1 text-sm text-slate-600">Aims → actions → success measures.</div>
                </div>

                <div>
                  <FieldLabel>Aims</FieldLabel>
                  <TextArea
                    className="min-h-[120px]"
                    value={state.aimsNextYear}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("aimsNextYear", e.target.value)}
                    placeholder="List your aims…"
                  />
                </div>

                <div>
                  <FieldLabel>Actions per aim</FieldLabel>
                  <TextArea
                    className="min-h-[120px]"
                    value={state.actionsPerAim}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("actionsPerAim", e.target.value)}
                    placeholder="What will you do to achieve them?"
                  />
                </div>

                <div>
                  <FieldLabel>Success measures</FieldLabel>
                  <TextArea
                    className="min-h-[120px]"
                    value={state.successMeasures}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("successMeasures", e.target.value)}
                    placeholder="How will you measure success?"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <FieldLabel>International competitions (request)</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.requestInternational}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("requestInternational", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Sports development (request)</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.requestSportsDev}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("requestSportsDev", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>AGMs / Conferences (request)</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.requestAgmConference}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("requestAgmConference", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Facilities / equipment (request)</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.requestFacilities}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("requestFacilities", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Schools mentoring programme (request)</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.requestSchoolsMentoring}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("requestSchoolsMentoring", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step.key === "signoff" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Bank Details</div>
                  <div className="mt-1 text-sm text-slate-600">Only required if bank details have changed.</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="max-w-md">
                    <FieldLabel>Have bank details changed?</FieldLabel>
                    <SelectInput
                      value={state.bankChanged}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        update("bankChanged", e.target.value as FormAState["bankChanged"])
                      }
                    >
                      <option value="">Select…</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </SelectInput>
                  </div>

                  {state.bankChanged === "yes" ? (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Bank Name</FieldLabel>
                        <TextInput value={state.bankName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("bankName", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Account Name</FieldLabel>
                        <TextInput value={state.accountName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("accountName", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>IBAN</FieldLabel>
                        <TextInput value={state.iban} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("iban", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>SWIFT</FieldLabel>
                        <TextInput value={state.swift} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("swift", e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-slate-600">If bank details have not changed, you can leave the fields blank.</div>
                  )}
                </div>

                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Agreements & Conditions</div>
                  <div className="mt-1 text-sm text-slate-600">Tick to confirm compliance (UI-only for now).</div>
                </div>

                <div className="space-y-3">
                  <CheckRow
                    checked={state.antiDopingAgree}
                    onChange={(next) => update("antiDopingAgree", next)}
                    title="Anti-doping agreement"
                    description="Confirm your association complies with anti-doping requirements."
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <CheckRow
                      checked={state.conditions.constitutionSubmitted}
                      onChange={(next) => setState((s) => ({ ...s, conditions: { ...s.conditions, constitutionSubmitted: next } }))}
                      title="Constitution submitted"
                    />
                    <CheckRow
                      checked={state.conditions.agmWithinTwoYears}
                      onChange={(next) => setState((s) => ({ ...s, conditions: { ...s.conditions, agmWithinTwoYears: next } }))}
                      title="AGM within last 2 years"
                    />
                    <CheckRow
                      checked={state.conditions.accountsWithinTwoYears}
                      onChange={(next) => setState((s) => ({ ...s, conditions: { ...s.conditions, accountsWithinTwoYears: next } }))}
                      title="Accounts within last 2 years"
                    />
                    <CheckRow
                      checked={state.conditions.safeguardingOfficersAppointed}
                      onChange={(next) =>
                        setState((s) => ({ ...s, conditions: { ...s.conditions, safeguardingOfficersAppointed: next } }))
                      }
                      title="Welfare officers appointed"
                    />
                    <CheckRow
                      checked={state.conditions.insuranceValid}
                      onChange={(next) => setState((s) => ({ ...s, conditions: { ...s.conditions, insuranceValid: next } }))}
                      title="Public liability insurance valid"
                    />
                    <CheckRow
                      checked={state.conditions.notifyChanges}
                      onChange={(next) => setState((s) => ({ ...s, conditions: { ...s.conditions, notifyChanges: next } }))}
                      title="Will notify GSLA of changes"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Signatories</div>
                  <div className="mt-1 text-sm text-slate-600">Two signatories (UI-only fields).</div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Signatory 1</div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <FieldLabel>Name</FieldLabel>
                        <TextInput value={state.signatory1Name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory1Name", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Role</FieldLabel>
                        <TextInput value={state.signatory1Role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory1Role", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Date</FieldLabel>
                        <TextInput type="date" value={state.signatory1Date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory1Date", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Signatory 2</div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <FieldLabel>Name</FieldLabel>
                        <TextInput value={state.signatory2Name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory2Name", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Role</FieldLabel>
                        <TextInput value={state.signatory2Role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory2Role", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Date</FieldLabel>
                        <TextInput type="date" value={state.signatory2Date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatory2Date", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "review" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Review</div>
                  <div className="mt-1 text-sm text-slate-600">Readable summary; submit is UI-only.</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">Key details</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Governing body</div>
                      <div className="font-semibold text-slate-800">{state.governingBodyName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Year</div>
                      <div className="font-semibold text-slate-800">{REG_YEAR}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Central email</div>
                      <div className="font-semibold text-slate-800">{state.centralEmail || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Safeguarding email</div>
                      <div className="font-semibold text-slate-800">{state.safeguardingEmail || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">President</div>
                      <div className="font-semibold text-slate-800">{state.presidentName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Secretary</div>
                      <div className="font-semibold text-slate-800">{state.secretaryName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Last AGM date</div>
                      <div className="font-semibold text-slate-800">{state.lastAgmDate || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Anti-doping</div>
                      <div className="font-semibold text-slate-800">{state.antiDopingAgree ? "Agreed" : "Not agreed"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Uploaded documents (UI-only)</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm text-slate-700">
                    <div>AGM minutes: {state.files.agmMinutes.length || 0}</div>
                    <div>Tier 1 evidence: {state.files.welfareTier1.length || 0}</div>
                    <div>Constitution: {state.files.constitution.length || 0}</div>
                    <div>Accounts: {state.files.annualAccounts.length || 0}</div>
                    <div>Insurance: {state.files.insurance.length || 0}</div>
                    <div>Federation proof: {state.files.federationProof.length || 0}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Ready to submit?</div>
                    <div className="mt-1 text-xs text-slate-600">
                      UI-only. Next step: wire server action + admin review workflow.
                    </div>
                  </div>
                  <Button onClick={submitUiOnly}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit (UI-only)
                  </Button>
                </div>
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
