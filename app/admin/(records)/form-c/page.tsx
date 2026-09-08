// app/admin/form-c/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * What this page is:
 * - Form C wizard UI (Confirmation of results and outcomes) — UI-only.
 * - Route: /admin/form-c
 *
 * Same rules as Forms A & B:
 * - UI-only (no backend). Submit is display-only.
 * - Draft autosaves to localStorage, keyed by current year.
 * - Uses Card/CardContent + Button from existing UI components.
 * - Uses plain HTML inputs to avoid missing shadcn input modules.
 *
 * Document mapping:
 * - Form C asks for:
 *   - Category (tick one)
 *   - Event/project details
 *   - Total financial assistance received + sponsorship gained
 *   - Results/benefits + PB/NR + development impact + aims met
 *   - Attachments checklist (result sheets etc.)
 *   - Signatory (exec committee)
 *
 * Where to edit:
 * - Steps list: `steps`
 * - State model: `FormCState` + `defaultState`
 * - Step content: switch block under “STEP CONTENT”
 * - Backend later: replace `submitUiOnly()`
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
  ClipboardList,
  FileText,
  Target,
  Paperclip,
} from "lucide-react";

const REG_YEAR = new Date().getFullYear();
const DRAFT_KEY = `gsla_formC_${REG_YEAR}_draft_v1`;

type Category =
  | ""
  | "official_international_competitions"
  | "sports_development"
  | "improvement_to_facilities"
  | "school_mentoring"
  | "elite_funding"
  | "agm_conferences";

type FormCState = {
  applicationYear: number;

  category: Category;

  eventName: string;
  governingBodyName: string;

  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;

  dateOfEvent: string;
  organisingBody: string;
  venue: string;

  athletesAttended: string;
  officialsAttended: string;

  totalFinancialAssistanceReceived: string;
  totalSponsorshipGained: string;

  resultsBenefits: string;
  personalBestsOrRecords: string;
  developmentImpact: string;
  aimsMet: string;

  attachments: {
    allSectionsCompleted: boolean;
    officialResultSheetsAttached: boolean;
  };

  // Note: Form C only shows one signatory block in the template.
  signatoryName: string;
  signatoryRole: string;
  signatoryDate: string;
};

const defaultState: FormCState = {
  applicationYear: REG_YEAR,

  category: "",

  eventName: "",
  governingBodyName: "",

  contactName: "",
  contactPosition: "",
  contactEmail: "",
  contactPhone: "",

  dateOfEvent: "",
  organisingBody: "",
  venue: "",

  athletesAttended: "",
  officialsAttended: "",

  totalFinancialAssistanceReceived: "",
  totalSponsorshipGained: "",

  resultsBenefits: "",
  personalBestsOrRecords: "",
  developmentImpact: "",
  aimsMet: "",

  attachments: {
    allSectionsCompleted: false,
    officialResultSheetsAttached: false,
  },

  signatoryName: "",
  signatoryRole: "",
  signatoryDate: "",
};

type StepKey = "category" | "details" | "outcomes" | "attachments" | "review";
type Step = {
  key: StepKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  { key: "category", title: "Category", description: "Select the category for this outcomes report.", icon: ClipboardList },
  { key: "details", title: "Event / Project Details", description: "Core information about what took place.", icon: FileText },
  { key: "outcomes", title: "Results & Benefits", description: "Report outcomes, PBs/records, development impact and aims.", icon: Target },
  { key: "attachments", title: "Attachments & Sign-off", description: "Tick required attachments and add signatory details.", icon: Paperclip },
  { key: "review", title: "Review", description: "Final check + submit (UI-only).", icon: CheckCircle2 },
];

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

export default function FormCPage() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [state, setState] = React.useState<FormCState>(defaultState);
  const [toast, setToast] = React.useState<string | null>(null);

  const step = steps[stepIndex];

  // Load this year's draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormCState>;
      setState((s) => ({ ...s, ...parsed }));
      setToast(`Draft loaded for ${REG_YEAR}.`);
      window.setTimeout(() => setToast(null), 2000);
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

  function update<K extends keyof FormCState>(key: K, value: FormCState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function updateAttach<K extends keyof FormCState["attachments"]>(
    key: K,
    value: FormCState["attachments"][K]
  ) {
    setState((s) => ({ ...s, attachments: { ...s.attachments, [key]: value } }));
  }

  function saveDraftNow() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      setToast("Draft saved.");
      window.setTimeout(() => setToast(null), 1600);
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
    window.setTimeout(() => setToast(null), 1800);
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
    setToast(`Submitted Form C for ${REG_YEAR} (UI-only).`);
    window.setTimeout(() => setToast(null), 2400);
  }

  const missingQuick = React.useMemo(() => {
    const m: string[] = [];
    if (!state.category) m.push("Category");
    if (!state.eventName.trim()) m.push("Event / project name");
    if (!state.governingBodyName.trim()) m.push("Governing body");
    if (!state.contactName.trim()) m.push("Contact name");
    if (!state.contactEmail.trim()) m.push("Contact email");
    if (!state.dateOfEvent.trim()) m.push("Date of event/project");
    if (!state.venue.trim()) m.push("Venue");
    if (!state.totalFinancialAssistanceReceived.trim()) m.push("Total financial assistance received");
    if (!state.attachments.allSectionsCompleted) m.push("Attachment tick: all sections completed");
    return m;
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Form C — Results & Outcomes — {REG_YEAR}</h1>
          <p className="mt-2 text-slate-600">Confirmation of results/outcomes (UI-only draft). Route: /admin/form-c</p>
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
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <step.icon className="h-5 w-5 text-[#0C2F57]" />
                <h2 className="text-2xl font-extrabold text-[#0C2F57]">{step.title}</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>

            {/* STEP CONTENT */}
            {step.key === "category" && (
              <div className="space-y-6">
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

            {step.key === "details" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Name of event / project</FieldLabel>
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
                  <div className="text-sm font-semibold text-slate-800">Details of event / project</div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Date of event / project</FieldLabel>
                      <TextInput type="date" value={state.dateOfEvent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("dateOfEvent", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Official organising body</FieldLabel>
                      <TextInput value={state.organisingBody} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("organisingBody", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Venue</FieldLabel>
                      <TextInput value={state.venue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("venue", e.target.value)} />
                    </div>
                    <div />
                    <div>
                      <FieldLabel>How many athletes attended?</FieldLabel>
                      <TextInput value={state.athletesAttended} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("athletesAttended", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>How many officials attended?</FieldLabel>
                      <TextInput value={state.officialsAttended} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("officialsAttended", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Total financial assistance received</FieldLabel>
                      <TextInput value={state.totalFinancialAssistanceReceived} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("totalFinancialAssistanceReceived", e.target.value)} placeholder="e.g., £2,000" />
                    </div>
                    <div>
                      <FieldLabel>Total sponsorship gained</FieldLabel>
                      <TextInput value={state.totalSponsorshipGained} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("totalSponsorshipGained", e.target.value)} placeholder="e.g., £500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "outcomes" && (
              <div className="space-y-6">
                <div>
                  <FieldLabel>Details of results and benefits gained</FieldLabel>
                  <TextArea
                    className="min-h-[160px]"
                    value={state.resultsBenefits}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("resultsBenefits", e.target.value)}
                    placeholder="Include: contacts made, funding generated, mentoring, sports-led tourism/economic impact…"
                  />
                  <div className="mt-2 text-xs text-slate-500">
                    Note: official result sheets must be attached for competitions.
                  </div>
                </div>

                <div>
                  <FieldLabel>Personal bests or national records attained</FieldLabel>
                  <TextArea
                    className="min-h-[110px]"
                    value={state.personalBestsOrRecords}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("personalBestsOrRecords", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>How has the funding improved the development of your sport?</FieldLabel>
                  <TextArea
                    className="min-h-[130px]"
                    value={state.developmentImpact}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("developmentImpact", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>How has this project met your specific aims?</FieldLabel>
                  <TextArea
                    className="min-h-[130px]"
                    value={state.aimsMet}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("aimsMet", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step.key === "attachments" && (
              <div className="space-y-6">
                <div className="text-sm text-slate-600">
                  Tick required items (UI-only). Upload widgets can be added later, like Form B.
                </div>

                <div className="space-y-3">
                  <CheckRow
                    checked={state.attachments.allSectionsCompleted}
                    onChange={(next) => updateAttach("allSectionsCompleted", next)}
                    title="All sections of this application have been completed in full"
                    description="Accompanied by requested supporting information."
                  />

                  <CheckRow
                    checked={state.attachments.officialResultSheetsAttached}
                    onChange={(next) => updateAttach("officialResultSheetsAttached", next)}
                    title="Official result sheets attached (for competitions)"
                    description="Required for events/initiatives supported by official results."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800">Signatory (exec committee member)</div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel>Name</FieldLabel>
                      <TextInput value={state.signatoryName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatoryName", e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Role</FieldLabel>
                      <TextInput value={state.signatoryRole} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatoryRole", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Date</FieldLabel>
                      <TextInput type="date" value={state.signatoryDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("signatoryDate", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step.key === "review" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-800">Summary</div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Category</div>
                      <div className="font-semibold text-slate-800">{categoryLabel(state.category)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Event / project</div>
                      <div className="font-semibold text-slate-800">{state.eventName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Venue</div>
                      <div className="font-semibold text-slate-800">{state.venue || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Date</div>
                      <div className="font-semibold text-slate-800">{state.dateOfEvent || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Financial assistance received</div>
                      <div className="font-semibold text-slate-800">{state.totalFinancialAssistanceReceived || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Sponsorship gained</div>
                      <div className="font-semibold text-slate-800">{state.totalSponsorshipGained || "—"}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Submit outcomes report?</div>
                    <div className="mt-1 text-xs text-slate-600">
                      UI-only. Backend later should create a submission record + review/approval.
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
