// app/admin/form-b/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * What this page is:
 * - Form B wizard UI (Application for Financial Assistance) — UI-only.
 * - Route: /admin/form-b
 *
 * Same rules as Form A:
 * - No backend wiring yet (Submit is UI-only).
 * - Draft autosaves to localStorage, keyed by current year.
 * - Past years are NOT hidden by the Forms library; this page focuses on the current year's draft.
 *
 * Why plain HTML inputs:
 * - Your project previously errored on missing shadcn/ui input components.
 * - Your Button only supports variant "default" | "outline" (no size prop, no ghost variant).
 * - So: Card/CardContent + Button from your UI kit, and plain <input>/<textarea>/<select>.
 *
 * Where to edit:
 * - Steps list: `steps`
 * - State model: `FormBState` + `defaultState`
 * - Step UIs: switch block under “STEP CONTENT”
 * - Backend later: replace `submitUiOnly()`
 *
 * Document mapping:
 * - This wizard mirrors Form B sections:
 *   Category selection → Event/initiative info → Category-specific questions →
 *   Cost breakdown → Team/Welfare officer → Post-event reporting → Attachments + Signatories → Review.
 */

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  CheckCircle2,
  FileText,
  ClipboardList,
  Target,
  Banknote,
  Users,
  Shield,
  Plus,
  X,
} from "lucide-react";

const REG_YEAR = new Date().getFullYear();
const DRAFT_KEY = `gsla_formB_${REG_YEAR}_draft_v1`;

type Category =
  | ""
  | "official_international_competitions"
  | "sports_development"
  | "improvement_to_facilities"
  | "school_mentoring"
  | "elite_funding"
  | "agm_conferences";

type CostRowKey =
  | "tutorFees"
  | "travel"
  | "accommodation"
  | "competitionFees"
  | "equipmentTransport"
  | "insurance"
  | "officialsExpenses"
  | "otherCosts"
  | "buildingCosts";

type PersonRow = {
  id: string;
  name: string;
  role: string;
};

type FormBFiles = {
  // “Official quotes and receipts are required…” etc.
  quotesAndReceipts: string[];
  federationSupport: string[];
  schoolDevPlan: string[];
  accreditationProof: string[];
  resultsSheet: string[];
  promotionEvidence: string[];
};

type FormBState = {
  applicationYear: number;

  // Category
  category: Category;

  // Basic event/initiative info
  eventName: string;
  governingBodyName: string;

  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;

  dateFrom: string;
  dateTo: string;
  organisingBody: string;
  venue: string;

  athletesAttending: string;
  athletesAgeGroup: string;
  squadType: "" | "national" | "club";
  numberOfTeams: string;
  numberOfOfficials: string;

  benefits: string;

  // Category-specific blocks
  // Sports Development / International / AGM
  performanceAims: string;
  ifNotCarriedOut: string;

  // Facilities
  facilitiesDetails: string;

  // School mentoring
  schoolApprovedByDoE: "" | "yes" | "no";
  hoursPerYearGroup: string;
  teachersLsaVolunteers: string;
  yearGroupsWorkedWith: string;
  exitStrategy: string;
  schoolCommittedExitStrategy: "" | "yes" | "no";

  // Elite funding
  eliteFundingDetails: string;

  // Costs
  costs: Record<CostRowKey, string>;
  totalRequested: string;

  // Team + welfare officer
  teamAndSupport: PersonRow[];
  welfareOfficerName: string;
  welfareOfficerPhone: string;

  // Post-event reporting (complete if post-event)
  postEvent: {
    resultsSummary: string;
    personalBestsOrRecords: string;
    additionalBenefits: string;
    totalFundingProposal: string;
    directSponsorship: string;
    otherSupportInfo: string;
  };

  // Bank details (Form B includes bank details section)
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    sortCode: string;
    iban: string;
    swift: string;
  };

  // Attachments + declarations checklist
  files: FormBFiles;
  declarations: {
    allSectionsCompleted: boolean;
    quotesOrReceiptsAttached: boolean;
    ifInternational_federationSupportAttached: boolean;
    ifSchoolMentoring_devPlanAttached: boolean;
    ifInternational_accreditedProofAttached: boolean;
    promotionAcknowledgement: boolean;
  };

  // Signatories
  signatory1Name: string;
  signatory1Role: string;
  signatory1Date: string;

  signatory2Name: string;
  signatory2Role: string;
  signatory2Date: string;
};

const defaultState: FormBState = {
  applicationYear: REG_YEAR,

  category: "",

  eventName: "",
  governingBodyName: "",

  contactName: "",
  contactPosition: "",
  contactEmail: "",
  contactPhone: "",

  dateFrom: "",
  dateTo: "",
  organisingBody: "",
  venue: "",

  athletesAttending: "",
  athletesAgeGroup: "",
  squadType: "",
  numberOfTeams: "",
  numberOfOfficials: "",

  benefits: "",

  performanceAims: "",
  ifNotCarriedOut: "",

  facilitiesDetails: "",

  schoolApprovedByDoE: "",
  hoursPerYearGroup: "",
  teachersLsaVolunteers: "",
  yearGroupsWorkedWith: "",
  exitStrategy: "",
  schoolCommittedExitStrategy: "",

  eliteFundingDetails: "",

  costs: {
    tutorFees: "",
    travel: "",
    accommodation: "",
    competitionFees: "",
    equipmentTransport: "",
    insurance: "",
    officialsExpenses: "",
    otherCosts: "",
    buildingCosts: "",
  },
  totalRequested: "",

  teamAndSupport: [],
  welfareOfficerName: "",
  welfareOfficerPhone: "",

  postEvent: {
    resultsSummary: "",
    personalBestsOrRecords: "",
    additionalBenefits: "",
    totalFundingProposal: "",
    directSponsorship: "",
    otherSupportInfo: "",
  },

  bank: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    iban: "",
    swift: "",
  },

  files: {
    quotesAndReceipts: [],
    federationSupport: [],
    schoolDevPlan: [],
    accreditationProof: [],
    resultsSheet: [],
    promotionEvidence: [],
  },

  declarations: {
    allSectionsCompleted: false,
    quotesOrReceiptsAttached: false,
    ifInternational_federationSupportAttached: false,
    ifSchoolMentoring_devPlanAttached: false,
    ifInternational_accreditedProofAttached: false,
    promotionAcknowledgement: false,
  },

  signatory1Name: "",
  signatory1Role: "",
  signatory1Date: "",

  signatory2Name: "",
  signatory2Role: "",
  signatory2Date: "",
};

type StepKey =
  | "category"
  | "event"
  | "categoryQuestions"
  | "costs"
  | "team"
  | "postEvent"
  | "attachments"
  | "review";

type Step = {
  key: StepKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  { key: "category", title: "Category", description: "Choose a funding category.", icon: ClipboardList },
  { key: "event", title: "Event / Initiative", description: "Core details and contacts.", icon: FileText },
  { key: "categoryQuestions", title: "Category Questions", description: "Extra questions based on category.", icon: Target },
  { key: "costs", title: "Costs", description: "Detailed breakdown + total requested.", icon: Banknote },
  { key: "team", title: "Team & Welfare Officer", description: "People attending + safeguarding contact.", icon: Shield },
  { key: "postEvent", title: "Post-event Reporting", description: "Results/outcomes (if post-event).", icon: FileText },
  { key: "attachments", title: "Attachments & Sign-off", description: "Upload evidence + declarations + signatories.", icon: Users },
  { key: "review", title: "Review", description: "Final check + submit (UI-only).", icon: CheckCircle2 },
];

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function cn(...v: Array<string | false | null | undefined>): string {
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

function categoryLabel(c: Category): string {
  switch (c) {
    case "official_international_competitions":
      return "Official International Competitions";
    case "sports_development":
      return "Sports Development";
    case "improvement_to_facilities":
      return "Improvement to Facilities";
    case "school_mentoring":
      return "School Mentoring";
    case "elite_funding":
      return "Elite Funding";
    case "agm_conferences":
      return "AGM & Conferences";
    default:
      return "—";
  }
}

export default function FormBPage() {
  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [state, setState] = React.useState<FormBState>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);

  const step = steps[stepIndex];

  // Load this year's draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormBState>;
      setState((s) => ({ ...s, ...parsed }));
      setToast(`Draft loaded for ${REG_YEAR}.`);
      window.setTimeout(() => setToast(null), 2200);
    } catch {
      // ignore
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

  function update<K extends keyof FormBState>(key: K, value: FormBState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function updateCosts(key: CostRowKey, value: string) {
    setState((s) => ({ ...s, costs: { ...s.costs, [key]: value } }));
  }

  function updatePostEvent<K extends keyof FormBState["postEvent"]>(key: K, value: FormBState["postEvent"][K]) {
    setState((s) => ({ ...s, postEvent: { ...s.postEvent, [key]: value } }));
  }

  function updateBank<K extends keyof FormBState["bank"]>(key: K, value: FormBState["bank"][K]) {
    setState((s) => ({ ...s, bank: { ...s.bank, [key]: value } }));
  }

  function updateDecl<K extends keyof FormBState["declarations"]>(key: K, value: FormBState["declarations"][K]) {
    setState((s) => ({ ...s, declarations: { ...s.declarations, [key]: value } }));
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

  function pickFiles(key: keyof FormBFiles, files: FileList | null) {
    const names = files ? Array.from(files).map((f) => f.name) : [];
    setState((s) => ({ ...s, files: { ...s.files, [key]: names } }));
  }

  function clearFiles(key: keyof FormBFiles) {
    setState((s) => ({ ...s, files: { ...s.files, [key]: [] } }));
  }

  // Repeatable people rows (athletes + technical team)
  function addPersonRow() {
    setState((s) => ({
      ...s,
      teamAndSupport: [...s.teamAndSupport, { id: uid(), name: "", role: "" }],
    }));
  }

  function updatePersonRow(id: string, patch: Partial<PersonRow>) {
    setState((s) => ({
      ...s,
      teamAndSupport: s.teamAndSupport.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  function removePersonRow(id: string) {
    setState((s) => ({ ...s, teamAndSupport: s.teamAndSupport.filter((p) => p.id !== id) }));
  }

  function submitUiOnly() {
    setToast(`Submitted Form B for ${REG_YEAR} (UI-only).`);
    window.setTimeout(() => setToast(null), 2500);
  }

  const missingQuick = React.useMemo<string[]>(() => {
    const m: string[] = [];
    if (!state.category) m.push("Funding category");
    if (!state.eventName.trim()) m.push("Event/initiative name");
    if (!state.governingBodyName.trim()) m.push("Governing body name");
    if (!state.contactName.trim()) m.push("Contact name");
    if (!state.contactEmail.trim()) m.push("Contact email");
    if (!state.dateFrom.trim()) m.push("Start date");
    if (!state.venue.trim()) m.push("Venue");
    if (!state.totalRequested.trim()) m.push("Total requested");
    if (!state.declarations.allSectionsCompleted) m.push("Declaration: all sections completed");
    if (!state.declarations.promotionAcknowledgement) m.push("Declaration: promotion acknowledgement");
    return m;
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Form B — Financial Assistance — {REG_YEAR}</h1>
          <p className="mt-2 text-slate-600">Application for financial assistance (UI-only draft). Route: /admin/form-b</p>
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
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{toast}</div>
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

            {missingQuick.length ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-semibold text-amber-800">Missing (quick check)</div>
                <ul className="mt-2 list-disc pl-5 text-xs text-amber-800">
                  {missingQuick.slice(0, 7).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                  {missingQuick.length > 7 ? <li>…and {missingQuick.length - 7} more</li> : null}
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
            {step.key === "category" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Choose a category</div>
                  <div className="mt-1 text-sm text-slate-600">Only one project per application (mirrors the paper form).</div>
                </div>

                <div className="max-w-md">
                  <FieldLabel>Category</FieldLabel>
                  <SelectInput
                    value={state.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      update("category", e.target.value as Category)
                    }
                  >
                    <option value="">Select…</option>
                    <option value="official_international_competitions">Official International Competitions</option>
                    <option value="sports_development">Sports Development</option>
                    <option value="improvement_to_facilities">Improvement to Facilities</option>
                    <option value="school_mentoring">School Mentoring</option>
                    <option value="elite_funding">Elite Funding</option>
                    <option value="agm_conferences">AGM & Conferences</option>
                  </SelectInput>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold">Selected</div>
                  <div className="mt-1">{categoryLabel(state.category)}</div>
                </div>
              </div>
            )}

            {step.key === "event" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Event / initiative details</div>
                  <div className="mt-1 text-sm text-slate-600">Core information used across all categories.</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Name of event / initiative</FieldLabel>
                    <TextInput value={state.eventName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("eventName", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Governing Body / Multi-sport organisation</FieldLabel>
                    <TextInput value={state.governingBodyName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("governingBodyName", e.target.value)} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Contact details</div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Contact name</FieldLabel>
                      <TextInput value={state.contactName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("contactName", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Position held</FieldLabel>
                      <TextInput value={state.contactPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("contactPosition", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Email</FieldLabel>
                      <TextInput value={state.contactEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("contactEmail", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Telephone</FieldLabel>
                      <TextInput value={state.contactPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("contactPhone", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Dates & logistics</div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Date from</FieldLabel>
                      <TextInput type="date" value={state.dateFrom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("dateFrom", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Date to</FieldLabel>
                      <TextInput type="date" value={state.dateTo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("dateTo", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Official organising body</FieldLabel>
                      <TextInput value={state.organisingBody} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("organisingBody", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Venue</FieldLabel>
                      <TextInput value={state.venue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("venue", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Participation info</div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>How many athletes are attending?</FieldLabel>
                      <TextInput value={state.athletesAttending} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("athletesAttending", e.target.value)} placeholder="e.g., 12" />
                    </div>
                    <div>
                      <FieldLabel>Age group (if applicable)</FieldLabel>
                      <TextInput value={state.athletesAgeGroup} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("athletesAgeGroup", e.target.value)} placeholder="e.g., U18 / Seniors" />
                    </div>
                    <div>
                      <FieldLabel>National squad or club?</FieldLabel>
                      <SelectInput
                        value={state.squadType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update("squadType", e.target.value as FormBState["squadType"])}
                      >
                        <option value="">Select…</option>
                        <option value="national">National representative squad</option>
                        <option value="club">Club</option>
                      </SelectInput>
                    </div>
                    <div>
                      <FieldLabel>Number of teams competing</FieldLabel>
                      <TextInput value={state.numberOfTeams} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("numberOfTeams", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Number of officials accompanying team</FieldLabel>
                      <TextInput value={state.numberOfOfficials} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("numberOfOfficials", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div>
                  <FieldLabel>Benefits of participating / delivering this initiative</FieldLabel>
                  <TextArea className="min-h-[140px]" value={state.benefits} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("benefits", e.target.value)} />
                </div>
              </div>
            )}

            {step.key === "categoryQuestions" && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold">Category</div>
                  <div className="mt-1">{categoryLabel(state.category)}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    These questions change depending on the funding category you selected.
                  </div>
                </div>

                {(state.category === "official_international_competitions" ||
                  state.category === "sports_development" ||
                  state.category === "agm_conferences" ||
                  state.category === "elite_funding") && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xl font-extrabold text-[#0C2F57]">Performance & programme questions</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Used for international, development, AGM/conferences, and elite-related support.
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Specific performance aims?</FieldLabel>
                      <TextArea className="min-h-[120px]" value={state.performanceAims} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("performanceAims", e.target.value)} />
                    </div>

                    <div>
                      <FieldLabel>What will happen if this programme/event is not carried out?</FieldLabel>
                      <TextArea className="min-h-[120px]" value={state.ifNotCarriedOut} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("ifNotCarriedOut", e.target.value)} />
                    </div>

                    {state.category === "elite_funding" ? (
                      <div>
                        <FieldLabel>Elite funding details (who, what, why, expected outcomes)</FieldLabel>
                        <TextArea className="min-h-[140px]" value={state.eliteFundingDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("eliteFundingDetails", e.target.value)} />
                      </div>
                    ) : null}
                  </div>
                )}

                {state.category === "improvement_to_facilities" && (
                  <div className="space-y-4">
                    <div className="text-xl font-extrabold text-[#0C2F57]">Facilities improvement details</div>
                    <div className="text-sm text-slate-600">Describe the improvement works and intended impact.</div>
                    <TextArea className="min-h-[160px]" value={state.facilitiesDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("facilitiesDetails", e.target.value)} />
                    <div className="text-xs text-slate-500">
                      Note: for building works, the paper form expects multiple quotes — attach them in the Attachments step.
                    </div>
                  </div>
                )}

                {state.category === "school_mentoring" && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xl font-extrabold text-[#0C2F57]">School mentoring questions</div>
                      <div className="mt-1 text-sm text-slate-600">These fields mirror the School Mentoring block in Form B.</div>
                    </div>

                    <div className="max-w-md">
                      <FieldLabel>Has the Department of Education approved the mentoring project?</FieldLabel>
                      <SelectInput
                        value={state.schoolApprovedByDoE}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          update("schoolApprovedByDoE", e.target.value as FormBState["schoolApprovedByDoE"])
                        }
                      >
                        <option value="">Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </SelectInput>
                    </div>

                    <div>
                      <FieldLabel>How many hours have you worked with each year group?</FieldLabel>
                      <TextArea className="min-h-[100px]" value={state.hoursPerYearGroup} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("hoursPerYearGroup", e.target.value)} />
                    </div>

                    <div>
                      <FieldLabel>How many teachers, LSA’s, volunteers will benefit?</FieldLabel>
                      <TextArea className="min-h-[100px]" value={state.teachersLsaVolunteers} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("teachersLsaVolunteers", e.target.value)} />
                    </div>

                    <div>
                      <FieldLabel>How many year groups have you worked with?</FieldLabel>
                      <TextInput value={state.yearGroupsWorkedWith} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("yearGroupsWorkedWith", e.target.value)} />
                    </div>

                    <div>
                      <FieldLabel>What is your exit strategy?</FieldLabel>
                      <TextArea className="min-h-[120px]" value={state.exitStrategy} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("exitStrategy", e.target.value)} />
                    </div>

                    <div className="max-w-md">
                      <FieldLabel>Has the school committed to the exit strategy?</FieldLabel>
                      <SelectInput
                        value={state.schoolCommittedExitStrategy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          update("schoolCommittedExitStrategy", e.target.value as FormBState["schoolCommittedExitStrategy"])
                        }
                      >
                        <option value="">Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </SelectInput>
                    </div>
                  </div>
                )}

                {!state.category ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Select a category first to unlock the relevant questions.
                  </div>
                ) : null}
              </div>
            )}

            {step.key === "costs" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Detailed breakdown of costs</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Mirror of Form B “Detailed Breakdown of Costs” (quotes/receipts attached later).
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Tutor / officials fees</FieldLabel>
                    <TextInput value={state.costs.tutorFees} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("tutorFees", e.target.value)} placeholder="e.g., £500" />
                  </div>
                  <div>
                    <FieldLabel>Travel costs</FieldLabel>
                    <TextInput value={state.costs.travel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("travel", e.target.value)} placeholder="e.g., £1,200" />
                  </div>
                  <div>
                    <FieldLabel>Accommodation (B&B only – max 3*)</FieldLabel>
                    <TextInput value={state.costs.accommodation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("accommodation", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Competition fees</FieldLabel>
                    <TextInput value={state.costs.competitionFees} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("competitionFees", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Transportation / hire of equipment</FieldLabel>
                    <TextInput value={state.costs.equipmentTransport} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("equipmentTransport", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Insurance</FieldLabel>
                    <TextInput value={state.costs.insurance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("insurance", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Officials expenses</FieldLabel>
                    <TextInput value={state.costs.officialsExpenses} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("officialsExpenses", e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Any other costs</FieldLabel>
                    <TextInput value={state.costs.otherCosts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("otherCosts", e.target.value)} />
                  </div>

                  {state.category === "improvement_to_facilities" ? (
                    <div className="md:col-span-2">
                      <FieldLabel>Building costs (3 quotes required for works)</FieldLabel>
                      <TextInput value={state.costs.buildingCosts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCosts("buildingCosts", e.target.value)} />
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <FieldLabel>Total finance requested</FieldLabel>
                  <TextInput value={state.totalRequested} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("totalRequested", e.target.value)} placeholder="e.g., £3,500" />
                  <div className="mt-2 text-xs text-slate-500">
                    UI-only: no validation math yet. Later we can sum the fields automatically.
                  </div>
                </div>
              </div>
            )}

            {step.key === "team" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Team details (athletes + technical team)</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Add names and roles. This mirrors the “team details” section in Form B.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">People attending</div>
                      <div className="mt-1 text-xs text-slate-500">Add athletes and support staff.</div>
                    </div>
                    <Button onClick={addPersonRow}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {state.teamAndSupport.length === 0 ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No people added yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {state.teamAndSupport.map((p) => (
                        <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <FieldLabel>Name</FieldLabel>
                              <TextInput
                                value={p.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonRow(p.id, { name: e.target.value })}
                              />
                            </div>
                            <div>
                              <FieldLabel>Role</FieldLabel>
                              <TextInput
                                value={p.role}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonRow(p.id, { role: e.target.value })}
                                placeholder="e.g., Athlete / Coach / Physio"
                              />
                            </div>
                          </div>
                          <div className="mt-3">
                            <RowRemoveButton onClick={() => removePersonRow(p.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Designated Welfare Officer</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Requirement if anyone attending is under 18.
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Name</FieldLabel>
                      <TextInput value={state.welfareOfficerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficerName", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Telephone</FieldLabel>
                      <TextInput value={state.welfareOfficerPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("welfareOfficerPhone", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "postEvent" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Post-event reporting</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Complete if this application is post-event (or later when reporting outcomes).
                  </div>
                </div>

                <div>
                  <FieldLabel>Results / summary of events / projects</FieldLabel>
                  <TextArea
                    className="min-h-[130px]"
                    value={state.postEvent.resultsSummary}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("resultsSummary", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>Personal bests or national records attained</FieldLabel>
                  <TextArea
                    className="min-h-[110px]"
                    value={state.postEvent.personalBestsOrRecords}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("personalBestsOrRecords", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>Additional benefits gained</FieldLabel>
                  <TextArea
                    className="min-h-[120px]"
                    value={state.postEvent.additionalBenefits}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("additionalBenefits", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <FieldLabel>Proposal to fund total amount</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.postEvent.totalFundingProposal}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("totalFundingProposal", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Direct sponsorship towards the event/project</FieldLabel>
                    <TextArea
                      className="min-h-[110px]"
                      value={state.postEvent.directSponsorship}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("directSponsorship", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Any other information in support of this application</FieldLabel>
                    <TextArea
                      className="min-h-[120px]"
                      value={state.postEvent.otherSupportInfo}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePostEvent("otherSupportInfo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Bank details</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Paper form asks for bank details if needed. Keep this as association bank account only.
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Bank</FieldLabel>
                      <TextInput value={state.bank.bankName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("bankName", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Account Name</FieldLabel>
                      <TextInput value={state.bank.accountName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("accountName", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Account Number</FieldLabel>
                      <TextInput value={state.bank.accountNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("accountNumber", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Sort Code</FieldLabel>
                      <TextInput value={state.bank.sortCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("sortCode", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>IBAN</FieldLabel>
                      <TextInput value={state.bank.iban} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("iban", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>SWIFT</FieldLabel>
                      <TextInput value={state.bank.swift} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBank("swift", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "attachments" && (
              <div className="space-y-8">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Attachments</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Upload supporting documents (UI-only filenames). Tick declarations and add signatories.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FilePicker
                    title="Quotes & receipts (required)"
                    hint="Official quotes and receipts required in the paper form."
                    value={state.files.quotesAndReceipts}
                    onPick={(files) => pickFiles("quotesAndReceipts", files)}
                    onClear={() => clearFiles("quotesAndReceipts")}
                  />
                  <FilePicker
                    title="International Federation support (if applicable)"
                    hint="Attach supporting information from the relevant International Federation."
                    value={state.files.federationSupport}
                    onPick={(files) => pickFiles("federationSupport", files)}
                    onClear={() => clearFiles("federationSupport")}
                  />
                  <FilePicker
                    title="School mentoring development plan (if applicable)"
                    hint="Approved by Department of Education."
                    value={state.files.schoolDevPlan}
                    onPick={(files) => pickFiles("schoolDevPlan", files)}
                    onClear={() => clearFiles("schoolDevPlan")}
                  />
                  <FilePicker
                    title="Accreditation proof (official international competitions)"
                    hint="Evidence of accreditation + eligibility criteria."
                    value={state.files.accreditationProof}
                    onPick={(files) => pickFiles("accreditationProof", files)}
                    onClear={() => clearFiles("accreditationProof")}
                  />
                  <FilePicker
                    title="Results sheet (post-event)"
                    hint="If post-event reporting is included."
                    value={state.files.resultsSheet}
                    onPick={(files) => pickFiles("resultsSheet", files)}
                    onClear={() => clearFiles("resultsSheet")}
                  />
                  <FilePicker
                    title="Promotion evidence / acknowledgements"
                    hint="Evidence that event promotion acknowledges Government of Gibraltar support."
                    value={state.files.promotionEvidence}
                    onPick={(files) => pickFiles("promotionEvidence", files)}
                    onClear={() => clearFiles("promotionEvidence")}
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-800">Declarations (tick to confirm)</div>

                  <CheckRow
                    checked={state.declarations.allSectionsCompleted}
                    onChange={(next) => updateDecl("allSectionsCompleted", next)}
                    title="All sections of this application are complete"
                    description="Includes supporting information and official quotes/receipts where required."
                  />
                  <CheckRow
                    checked={state.declarations.quotesOrReceiptsAttached}
                    onChange={(next) => updateDecl("quotesOrReceiptsAttached", next)}
                    title="Quotes / receipts attached"
                    description="Tick once uploaded (UI-only for now)."
                  />
                  <CheckRow
                    checked={state.declarations.ifInternational_federationSupportAttached}
                    onChange={(next) => updateDecl("ifInternational_federationSupportAttached", next)}
                    title="If international: federation support attached"
                  />
                  <CheckRow
                    checked={state.declarations.ifSchoolMentoring_devPlanAttached}
                    onChange={(next) => updateDecl("ifSchoolMentoring_devPlanAttached", next)}
                    title="If school mentoring: Department of Education approved plan attached"
                  />
                  <CheckRow
                    checked={state.declarations.ifInternational_accreditedProofAttached}
                    onChange={(next) => updateDecl("ifInternational_accreditedProofAttached", next)}
                    title="If international competition: accreditation / eligibility proof attached"
                  />
                  <CheckRow
                    checked={state.declarations.promotionAcknowledgement}
                    onChange={(next) => updateDecl("promotionAcknowledgement", next)}
                    title="Event / initiative promotion acknowledges Government of Gibraltar support"
                  />
                </div>

                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Signatories</div>
                  <div className="mt-1 text-sm text-slate-600">Signatories must be executive committee members.</div>
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                  Data Protection note: store/submit only what is necessary. Backend integration later should apply access controls for sensitive data.
                </div>
              </div>
            )}

            {step.key === "review" && (
              <div className="space-y-6">
                <div>
                  <div className="text-xl font-extrabold text-[#0C2F57]">Review</div>
                  <div className="mt-1 text-sm text-slate-600">Final check before submit (UI-only).</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">Summary</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Category</div>
                      <div className="font-semibold text-slate-800">{categoryLabel(state.category)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Year</div>
                      <div className="font-semibold text-slate-800">{state.applicationYear}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Event / initiative</div>
                      <div className="font-semibold text-slate-800">{state.eventName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Governing body</div>
                      <div className="font-semibold text-slate-800">{state.governingBodyName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Contact</div>
                      <div className="font-semibold text-slate-800">{state.contactName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Dates</div>
                      <div className="font-semibold text-slate-800">
                        {state.dateFrom || "—"} {state.dateTo ? `→ ${state.dateTo}` : ""}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Venue</div>
                      <div className="font-semibold text-slate-800">{state.venue || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Total requested</div>
                      <div className="font-semibold text-slate-800">{state.totalRequested || "—"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Attachments (UI-only)</div>
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 text-sm text-slate-700">
                    <div>Quotes/receipts: {state.files.quotesAndReceipts.length}</div>
                    <div>Federation support: {state.files.federationSupport.length}</div>
                    <div>School dev plan: {state.files.schoolDevPlan.length}</div>
                    <div>Accreditation proof: {state.files.accreditationProof.length}</div>
                    <div>Results sheet: {state.files.resultsSheet.length}</div>
                    <div>Promotion evidence: {state.files.promotionEvidence.length}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Ready to submit?</div>
                    <div className="mt-1 text-xs text-slate-600">UI-only. Backend later should create a submission + review workflow.</div>
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
