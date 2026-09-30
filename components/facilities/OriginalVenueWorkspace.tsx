"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SavedFacilityInformation from "@/components/facilities/SavedFacilityInformation";
import WorkflowAttachments from "@/components/facilities/WorkflowAttachments";
import type { Attachment } from "@/lib/facilityWorkflows";
import { useVenueDesignState, useVenueDesignNotice } from "@/lib/venueDesignStore";
import VenueViewControls, { venueTabs, type VenueView } from "@/components/facilities/VenueViewControls";
import VenueBanner from "@/components/facilities/VenueBanner";
import { eventExamples } from "@/components/facilities/eventExamples";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  CircleDot,
  Plus,
  Send,
  DoorClosed,
  Siren,
  TriangleAlert,
  Info,
  Camera,
  BadgeCheck,
  Download,
  Eye,
  Shield,
  Flame,
  HeartPulse,
  HardHat,
  Upload,
  X,
  Lock,
  ExternalLink,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type FacilityStatus = "Operational" | "Limited" | "Closed";
type Role = "Centre Manager" | "Facilities Manager 1" | "Facilities Manager 2" | "Facilities Manager 3" | "Head of Facilities";
type TabKey =
  | "handover"
  | "information"
  | "issues"
  | "timeline"
  | "events"
  | "procedures"
  | "weekly"
  | "monthly"
  | "documents"
  | "photos"
  | "compliance"
  | "bookings"
  | "audit";

type TimelineItem = {
  id: string;
  time: string;
  title: string;
  type: "Operations" | "Maintenance" | "Issue" | "Event" | "Handover";
  detail: string;
};

type TaskItem = {
  id: string;
  task: string;
  owner: string;
  status: "Due" | "Done" | "In Progress" | "Scheduled";
  completed: boolean;
};

type DocumentItem = {
  id: string;
  title: string;
  category: "SOP" | "Checklist" | "Policy" | "Form";
  version: string;
  updated: string;
  owner: string;
  instructions?: string;
  attachments?: Attachment[];
};

type PhotoItem = {
  id: string;
  title: string;
  area: string;
  uploaded: string;
  note: string;
  attachments?: Attachment[];
};

type ComplianceItem = {
  id: string;
  title: string;
  area: "Fire Safety" | "Health & Safety" | "First Aid" | "Site Safety";
  due: string;
  owner: string;
  status: "Compliant" | "Due Soon" | "Overdue";
  instructions?: string;
};

type AuditItem = {
  id: string;
  time: string;
  user: string;
  role: Role;
  action: string;
  detail: string;
};

const facility = {
  id: "design-preview", name: "Venue form preview", type: "Editable examples", status: "Operational" as FacilityStatus,
  address: "Design review", description: "The original venue layouts with one editable example per form. This preview saves in your browser without a database.",
};

type IssueItem = { id: string; title: string; status: string; priority: string; updated: string; owner: string; category: string; description: string; location: string; reporter: string; reportedOn: string; recipient: string; action: string; resolution: string; resolvedOn: string; attachments: Attachment[] };
const initialIssues: IssueItem[] = [{ id: "EXAMPLE-ISSUE", title: "Example: Main gate latch needs checking", status: "New", priority: "Medium", updated: "Example entry", owner: "Unassigned", category: "Maintenance", description: "The latch is difficult to secure. Describe the issue here.", location: "Main entrance", reporter: "Example Centre Manager", reportedOn: "", recipient: "Facilities Manager 1", action: "", resolution: "", resolvedOn: "", attachments: [] }];

const initialTimeline: TimelineItem[] = [];

// Historical venue-side activity examples, not the department's event register.
const events = [
  {
    title: "Youth Football Training",
    date: "11 Apr 2026",
    time: "17:00 - 19:00",
    location: "Main Pitch",
    organiser: "Sports Development Unit",
    status: "Confirmed",
  },
  {
    title: "Athletics Community Session",
    date: "11 Apr 2026",
    time: "19:30 - 21:00",
    location: "Track Area",
    organiser: "Community Programme",
    status: "Confirmed",
  },
  {
    title: "Weekend Fixture Prep",
    date: "12 Apr 2026",
    time: "09:00 - 11:00",
    location: "Main Pitch",
    organiser: "Facilities Team",
    status: "Pending",
  },
];

const bookingItems: { id: string; title: string; date: string; time: string; space: string; status: string; source: string }[] = [];

const openingStepsSeed = ["Example: Unlock perimeter access points and main gate."];

const closingStepsSeed = ["Example: Secure all gates, doors, and storage areas."];

const weeklyTaskSeed: TaskItem[] = [{ id: "example-weekly", task: "Example: Inspect lighting and external access points", owner: "Centre Manager", status: "Due", completed: false }];

const monthlyTaskSeed: TaskItem[] = [{ id: "example-monthly", task: "Example: Monthly maintenance review", owner: "Facilities Manager 1", status: "Due", completed: false }];

const documentsSeed: DocumentItem[] = [{ id: "example-sop", title: "Example: Opening Procedure SOP", category: "SOP", version: "Draft v1", updated: "Example entry", owner: "Head of Facilities", instructions: "Inspect the entrance before opening. Record any concerns and confirm the procedure has been followed.", attachments: [] }];

const photosSeed: PhotoItem[] = [{ id: "example-photo", title: "Example: Main entrance inspection", area: "Main entrance", uploaded: "Example entry", note: "Attach a photo to see it in the original photo card.", attachments: [] }];

const complianceSeed: ComplianceItem[] = [{ id: "example-compliance", title: "Example: Fire extinguisher inspection", area: "Fire Safety", due: "Not set", owner: "Centre Manager", status: "Due Soon", instructions: "Check the extinguisher is present, accessible and within its inspection date." }];

const auditSeed: AuditItem[] = [];

function statusStyles(status: FacilityStatus) {
  if (status === "Operational") {
    return {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  }
  if (status === "Limited") {
    return {
      icon: AlertTriangle,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  }
  return {
    icon: ShieldAlert,
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  };
}

function miniStatus(status: string) {
  if (
    status === "Done" ||
    status === "Resolved" ||
    status === "Operational" ||
    status === "Scheduled" ||
    status === "Confirmed" ||
    status === "Compliant"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (
    status === "Due" ||
    status === "Reviewed" ||
    status === "In Progress" ||
    status === "Pending" ||
    status === "Due Soon"
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  if (status === "New" || status === "High" || status === "Overdue") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function roleCanEdit() { return true; }
function roleCanUpload() { return true; }
function roleCanManageCompliance(role: Role) { return role !== "Centre Manager"; }
function roleCanEditDocuments(role: Role) { return role !== "Centre Manager"; }


type DesignKind = "opening" | "closing" | "weekly" | "monthly" | "documents" | "photos" | "compliance" | "issues" | "handover";
type DesignField = { key: string; label: string; required?: boolean; multiline?: boolean; type?: string; options?: string[] };
const primaryButton = "inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110";
const outlineButton = "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50";
const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none disabled:bg-slate-100";
const taskFields: DesignField[] = [{ key: "asset", label: "Asset / location" }, { key: "linkedIssue", label: "Linked issue" }, { key: "priority", label: "Priority", options: ["Medium", "Low", "High", "Urgent"] }, { key: "requestedBy", label: "Requested by" }, { key: "requestedOn", label: "Requested on", type: "date" }, { key: "assignedTo", label: "Assigned to" }, { key: "targetDate", label: "Target date", type: "date" },{ key: "task", label: "Task / maintenance procedure", required: true }, { key: "owner", label: "Owner", required: true }, { key: "due", label: "Due date", type: "date" }, { key: "status", label: "Status", options: ["Due", "In Progress", "Scheduled", "Done"] }, { key: "instructions", label: "Instructions", multiline: true }];
const designTitles: Record<DesignKind, string> = { opening: "Opening Procedure", closing: "Closing Procedure", weekly: "Weekly Maintenance Task", monthly: "Monthly Maintenance Task", documents: "Document / SOP", photos: "Photo Log", compliance: "Compliance Check", issues: "Issue Report", handover: "Handover Fields" };
const designFields: Record<DesignKind, DesignField[]> = {
 opening: [{ key: "label", label: "Opening check / instruction", required: true, multiline: true }],
 closing: [{ key: "label", label: "Closing check / instruction", required: true, multiline: true }],
 weekly: taskFields, monthly: taskFields,
 documents: [{ key: "title", label: "Document title", required: true }, { key: "category", label: "Category", options: ["SOP", "Checklist", "Policy", "Form"] }, { key: "version", label: "Version", required: true }, { key: "owner", label: "Owner", required: true }, { key: "reviewDate", label: "Review date", type: "date" }, { key: "instructions", label: "Procedure / instructions", required: true, multiline: true }],
 photos: [{ key: "title", label: "Photo title", required: true }, { key: "area", label: "Area", required: true }, { key: "relatedIssue", label: "Related issue" }, { key: "note", label: "Note", multiline: true }],
 compliance: [{ key: "title", label: "Check title", required: true }, { key: "area", label: "Category / area", options: ["Fire Safety", "Health & Safety", "First Aid", "Site Safety"] }, { key: "due", label: "Due date", type: "date" }, { key: "owner", label: "Owner", required: true }, { key: "status", label: "Status", options: ["Due Soon", "Overdue", "Compliant"] }, { key: "instructions", label: "Checks / instructions", required: true, multiline: true }, { key: "followUp", label: "Follow-up action", multiline: true }, { key: "deadline", label: "Follow-up deadline", type: "date" }],
 issues: [{ key: "title", label: "Issue title", required: true }, { key: "category", label: "Category", options: ["Maintenance", "Safety", "Security", "Cleaning", "Equipment", "Other"] }, { key: "description", label: "Description", required: true, multiline: true }, { key: "location", label: "Location / area", required: true }, { key: "priority", label: "Priority", options: ["Medium", "Low", "High", "Urgent"] }, { key: "reporter", label: "Reported by", required: true }, { key: "reportedOn", label: "Reported on", type: "date", required: true }, { key: "recipient", label: "Report to", options: ["Facilities Manager 1", "Facilities Manager 2", "Facilities Manager 3", "Head of Facilities"] }, { key: "status", label: "Status", options: ["New", "Reviewed", "In Progress", "Resolved", "Closed"] }, { key: "owner", label: "Assigned to" }, { key: "action", label: "Action taken", multiline: true }, { key: "resolution", label: "Resolution notes", multiline: true }, { key: "resolvedOn", label: "Resolved on", type: "date" }],
 handover: [{ key: "shiftSummary", label: "Shift summary field label", required: true }, { key: "risks", label: "Risks / concerns field label", required: true }, { key: "actionsRequired", label: "Actions required field label", required: true }, { key: "managerMessage", label: "Manager message field label", required: true }],
};
function CompletionFields({ id, caption, value, onChange, showCheck = true }: { id: string; caption: string; showCheck?: boolean; value?: { notes: string; done: boolean; actor: string; date: string; attachments: Attachment[] }; onChange: (value: { notes: string; done: boolean; actor: string; date: string; attachments: Attachment[] }) => void }) {
 const current = value || { notes: "", done: false, actor: "", date: "", attachments: [] };
 return <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
  {showCheck && <label className="flex items-center gap-2 text-sm font-semibold text-slate-900"><input type="checkbox" checked={current.done} onChange={e => onChange({ ...current, done: e.target.checked })}/>{caption}</label>}
  <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Completed by<input className={fieldClass} value={current.actor} onChange={e => onChange({ ...current, actor: e.target.value })}/></label><label className="text-sm font-semibold text-slate-700">Date & time<input type="datetime-local" className={fieldClass} value={current.date} onChange={e => onChange({ ...current, date: e.target.value })}/></label></div>
  <label htmlFor={`notes-${id}`} className="block text-sm font-semibold text-slate-700">Notes / findings / exceptions</label><textarea id={`notes-${id}`} rows={3} className={fieldClass} value={current.notes} onChange={e => onChange({ ...current, notes: e.target.value })}/>
  <WorkflowAttachments label="Evidence / photos" value={current.attachments} onChange={attachments => onChange({ ...current, attachments })}/>
  <p className="text-xs text-slate-500">Changes save automatically in this browser.</p>
 </div>;
}

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Modal({ open, title, description, children, onClose }: { open: boolean; title: string; description?: string; children: React.ReactNode; onClose: () => void }) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  useEffect(() => { if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }, [open, dialog]);
  return <dialog ref={setDialog} onCancel={e => { e.preventDefault(); onClose(); }} onClose={onClose} aria-label={title} className="fixed inset-0 m-auto max-h-[90vh] w-[92vw] max-w-2xl overflow-y-auto rounded-3xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-200 backdrop:bg-slate-900/40">
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5"><div><h2 className="text-lg font-semibold text-slate-900">{title}</h2>{description && <p className="mt-1 text-sm text-slate-600">{description}</p>}</div><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Close"><X size={18}/></button></div>
    <div className="px-6 py-5">{open && children}</div>
  </dialog>;
}

export default function OriginalVenueWorkspace({ facilityId, defaultTab = "handover" }: { facilityId?: string; defaultTab?: TabKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requested = searchParams.get("tab") || ({ daily: "handover", maintenance: "weekly", issues: "issues", compliance: "compliance", sop: "documents" } as Record<string, string>)[searchParams.get("section") || ""];
  const activeTab = venueTabs.some(tab => tab.key === requested) ? requested as TabKey : defaultTab;
  const setActiveTab = (tab: TabKey) => router.replace(`?tab=${tab}`);
  const [view, setView] = useState<VenueView>("list");
  const [role, setRole] = useState<Role>(searchParams.get("role") === "cm" ? "Centre Manager" : "Facilities Manager 1");
  const scope = facilityId || "example";

  const [timeline, setTimeline] = useVenueDesignState(scope, "timeline", initialTimeline);
  const [updateText, setUpdateText] = useState("");

  const [handoverPeriod, setHandoverPeriod] = useState<"AM" | "PM">("AM");
  const [handovers, setHandovers] = useVenueDesignState(scope, "handovers", {
    AM: {
      shiftSummary: "Example: Opening checks completed. Describe what happened during the shift.",
      risks: "Example: Monitor the main gate latch until it has been checked.",
      actionsRequired: "Example: Ask the facilities manager to arrange a gate inspection.",
      managerMessage: "Example: Please record any changes to the evening schedule.",
    },
    PM: { shiftSummary: "Example: Evening activities finished. Add the night handover here.", risks: "Example: Recheck the main entrance before leaving.", actionsRequired: "Example: Confirm the venue is secured.", managerMessage: "Example: Pass any unresolved concerns to the next shift." },
  });
  const handover = handovers[handoverPeriod];
  function updateHandover(field: keyof typeof handover, value: string) {
    setHandovers((previous) => ({
      ...previous,
      [handoverPeriod]: { ...previous[handoverPeriod], [field]: value },
    }));
  }

  const [openingChecklist, setOpeningChecklist] = useVenueDesignState(scope, "opening",
    openingStepsSeed.map((step, i) => ({
      id: `open-${i + 1}`,
      label: step,
      done: false,
    }))
  );

  const [closingChecklist, setClosingChecklist] = useVenueDesignState(scope, "closing",
    closingStepsSeed.map((step, i) => ({
      id: `close-${i + 1}`,
      label: step,
      done: false,
    }))
  );

  const [weeklyTasks, setWeeklyTasks] = useVenueDesignState(scope, "weekly", weeklyTaskSeed);
  const [monthlyTasks, setMonthlyTasks] = useVenueDesignState(scope, "monthly", monthlyTaskSeed);
  const [documents, setDocuments] = useVenueDesignState(scope, "documents", documentsSeed);
  const [photos, setPhotos] = useVenueDesignState(scope, "photos", photosSeed);
  const [audit, setAudit] = useVenueDesignState(scope, "audit", auditSeed);

  const [issues, setIssues] = useVenueDesignState(scope, "issues", initialIssues);
  const [compliance, setCompliance] = useVenueDesignState(scope, "compliance", complianceSeed);
  const [responses, setResponses] = useVenueDesignState<Record<string, { notes: string; done: boolean; actor: string; date: string; attachments: Attachment[] }>>(scope, "responses", {});
  const [handoverLabels, setHandoverLabels] = useVenueDesignState(scope, "handover-labels", { shiftSummary: "Shift Summary", risks: "Risks / Concerns", actionsRequired: "Actions Required", managerMessage: "Manager Message / Notes" });
  const [editor, setEditor] = useState<{ kind: DesignKind; id?: string } | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [draftFiles, setDraftFiles] = useState<Attachment[]>([]);
  const [message, setMessage] = useState("");
  const [viewOnly, setViewOnly] = useState(false);
  const status = statusStyles(facility.status);
  const StatusIcon = status.icon;

  const openIssueCount = issues.filter(
    (i) => i.status !== "Resolved" && i.status !== "Closed"
  ).length;

  const weeklyDue = weeklyTasks.filter((t) => !t.completed).length;
  const monthlyDue = monthlyTasks.filter((t) => !t.completed).length;
  const overdueCompliance = compliance.filter((c) => c.status === "Overdue").length;

  const canEdit = roleCanEdit();
  const canUpload = roleCanUpload();
  const canManageDocs = roleCanEditDocuments(role);
  const canManageCompliance = roleCanManageCompliance(role);

  function addAuditEntry(action: string, detail: string) {
    const userName = role;

    const entry: AuditItem = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleString("en-GB"),
      user: userName,
      role,
      action,
      detail,
    };

    setAudit((prev) => [entry, ...prev]);
  }

  function addTimelineUpdate() {
    const text = updateText.trim();
    if (!text) return;

    const item: TimelineItem = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleString("en-GB"),
      title: "Manager update posted",
      type: "Handover",
      detail: text,
    };

    setTimeline((prev) => [item, ...prev]);
    addAuditEntry("Posted timeline update", text);
    setUpdateText("");
    setActiveTab("timeline");
  }

  function toggleOpening(id: string) {
    setOpeningChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    addAuditEntry("Updated opening procedure", "Opening checklist item toggled.");
  }

  function toggleClosing(id: string) {
    setClosingChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    addAuditEntry("Updated closing procedure", "Closing checklist item toggled.");
  }

  function toggleWeekly(id: string) {
    const target = weeklyTasks.find((item) => item.id === id);
    setWeeklyTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "Done" : "Due",
            }
          : item
      )
    );
    addAuditEntry(
      "Updated weekly task",
      target ? `${target.task} toggled.` : "Weekly task toggled."
    );
  }

  function toggleMonthly(id: string) {
    const target = monthlyTasks.find((item) => item.id === id);
    setMonthlyTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "Done" : "Due",
            }
          : item
      )
    );
    addAuditEntry(
      "Updated monthly task",
      target ? `${target.task} toggled.` : "Monthly task toggled."
    );
  }

  function entries(kind: DesignKind): object[] {
    return kind === "opening" ? openingChecklist : kind === "closing" ? closingChecklist : kind === "weekly" ? weeklyTasks : kind === "monthly" ? monthlyTasks : kind === "documents" ? documents : kind === "photos" ? photos : kind === "compliance" ? compliance : kind === "issues" ? issues : [handoverLabels];
  }
  function openEditor(kind: DesignKind, id?: string, readOnly = false) {
    const item = id ? entries(kind).find(item => (item as { id: string }).id === id) : kind === "handover" ? handoverLabels : undefined;
    const values = Object.fromEntries(Object.entries(item || {}).filter(([, value]) => typeof value === "string")) as Record<string, string>;
    if (!id && kind !== "handover") for (const field of designFields[kind]) values[field.key] = field.options?.[0] || "";
    if (kind === "issues" && !id) { values.status = "New"; values.owner = "Unassigned"; }
    setDraft(values); setDraftFiles((item as { attachments?: Attachment[] })?.attachments || []); setMessage(""); setViewOnly(readOnly); setEditor({ kind, id });
  }
  function writeEntries(kind: DesignKind, values: object[]) {
    if (kind === "opening") setOpeningChecklist(values as typeof openingChecklist);
    if (kind === "closing") setClosingChecklist(values as typeof closingChecklist);
    if (kind === "weekly") setWeeklyTasks(values as TaskItem[]);
    if (kind === "monthly") setMonthlyTasks(values as TaskItem[]);
    if (kind === "documents") setDocuments(values as DocumentItem[]);
    if (kind === "photos") setPhotos(values as PhotoItem[]);
    if (kind === "compliance") setCompliance(values as ComplianceItem[]);
    if (kind === "issues") setIssues(values as IssueItem[]);
  }
  function saveEditor(e: React.FormEvent) {
    e.preventDefault(); if (!editor) return;
    const { kind, id } = editor;
    const values = { ...draft };
    if (kind !== "issues" && kind !== "photos" && role === "Centre Manager") return;
    if (kind === "issues" && role === "Centre Manager" && editor.id) {
      const original = issues.find(issue => issue.id === editor.id);
      if (original) for (const key of ["status", "owner", "action", "resolution", "resolvedOn"] as const) values[key] = original[key];
    }
    const required = designFields[kind].filter(field => field.required);
    if (required.some(field => !values[field.key]?.trim())) { setMessage("Complete the required fields."); return; }
    if (kind === "photos" && !draftFiles.length) { setMessage("Attach a photo before saving."); return; }
    if (kind === "issues" && values.status === "Resolved" && (!values.resolution?.trim() || !values.resolvedOn)) { setMessage("Add resolution notes and a resolved date."); return; }
    if (kind === "handover") setHandoverLabels(values as typeof handoverLabels);
    else {
      const old = entries(kind).find(item => (item as { id: string }).id === id) || {};
      const entry = { ...old, ...values, id: id || crypto.randomUUID(), attachments: draftFiles,
        ...(kind === "opening" || kind === "closing" ? { done: (old as { done?: boolean }).done || false } : {}),
        ...(kind === "weekly" || kind === "monthly" ? { completed: values.status === "Done" } : {}),
        ...(kind === "documents" || kind === "issues" ? { updated: new Date().toLocaleString("en-GB") } : {}),
        ...(kind === "photos" ? { uploaded: new Date().toLocaleString("en-GB") } : {}) };
      writeEntries(kind, id ? entries(kind).map(item => (item as { id: string }).id === id ? entry : item) : [...entries(kind), entry]);
    }
    addAuditEntry(id ? "Edited preview entry" : "Created preview entry", kind); setEditor(null); setMessage("Saved in this browser.");
  }
  function removeEntry(kind: DesignKind, id: string) {
    if (role === "Centre Manager" && kind !== "issues" && kind !== "photos") return;
    writeEntries(kind, entries(kind).filter(item => (item as { id: string }).id !== id));
    addAuditEntry("Deleted preview entry", kind); setMessage("Example removed. Use Add entry to create another.");
  }
  function saveHandover() {
    if (!handover.shiftSummary.trim()) { setMessage("Enter a shift summary before saving the handover."); return; }
    const shift = handoverPeriod === "AM" ? "Afternoon" : "Night";
    setTimeline(prev => [{ id: crypto.randomUUID(), time: new Date().toLocaleString("en-GB"), title: `${shift} handover saved`, type: "Handover", detail: `${handover.shiftSummary}\nRisks: ${handover.risks}\nActions: ${handover.actionsRequired}\nNotes: ${handover.managerMessage}` }, ...prev]);
    addAuditEntry("Saved handover", shift); setMessage(`${shift} handover saved in this browser.`);
  }
  const actions = (kind: DesignKind, id?: string) => role !== "Centre Manager" || kind === "photos" || kind === "issues" ? <div className="flex flex-wrap gap-2">{id ? <><button type="button" className={outlineButton} onClick={() => openEditor(kind, id)}>Edit entry</button><button type="button" className={outlineButton + " text-rose-700"} onClick={() => removeEntry(kind, id)}>Delete entry</button></> : <button type="button" className={primaryButton} onClick={() => openEditor(kind)}><Plus size={16}/>Add entry</button>}</div> : null;
  const completion = (id: string, caption = "Completed / confirmed", showCheck = true) => <CompletionFields id={id} caption={caption} showCheck={showCheck} value={responses[id]} onChange={value => { setResponses(prev => ({ ...prev, [id]: value })); if (compliance.some(item => item.id === id)) setCompliance(prev => prev.map(item => item.id === id ? { ...item, status: value.done ? "Compliant" : "Due Soon" } : item)); }} />;
  const storageNotice = useVenueDesignNotice(scope);
  const openingDone = openingChecklist.filter((s) => s.done).length;
  const closingDone = closingChecklist.filter((s) => s.done).length;

  return (
    <div className="space-y-8" data-venue-view={view}>
      <VenueBanner
        title={facility.name}
        description={facility.description}
        eyebrow="Venue design preview"
        details={<>
          <span className="inline-flex items-center gap-1"><Building2 size={15} aria-hidden="true" />{facility.type}</span>
          <span className="inline-flex items-center gap-1"><StatusIcon size={15} aria-hidden="true" />Browser only</span>
          <span className="inline-flex items-center gap-1"><MapPin size={15} aria-hidden="true" />{facility.address}</span>
        </>}
      />

      <div className="flex flex-wrap items-center justify-between gap-3"><label className="text-sm font-semibold text-slate-700">Preview role<select aria-label="Preview role" className="ml-3 rounded-xl border border-slate-200 bg-white px-3 py-2" value={role} onChange={e => setRole(e.target.value as Role)}>{["Facilities Manager 1", "Facilities Manager 2", "Facilities Manager 3", "Head of Facilities", "Centre Manager"].map(value => <option key={value}>{value}</option>)}</select></label><VenueViewControls view={view} onViewChange={setView}/></div>
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">One example per form · saved only in this browser · role controls demonstrate the design and are not live permissions.</p>
      <nav aria-label="Preview forms" className="flex flex-wrap gap-2">{venueTabs.filter(tab => !["information", "events", "bookings"].includes(tab.key)).map(tab => <Link key={tab.key} href={`?tab=${tab.key}`} aria-current={activeTab === tab.key ? "page" : undefined} className={activeTab === tab.key ? primaryButton : outlineButton}>{tab.label}</Link>)}</nav>
      {storageNotice && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{storageNotice}</p>}
      {message && <p role="status" className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}

      <section>
          {activeTab === "handover" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Daily Handovers"
                    description="Record afternoon and night shift information separately for centre and facilities managers."
                    action={
                      canEdit ? (
                        <button
                          onClick={saveHandover}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Send size={16} />
                          Save Handover
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Read only
                        </span>
                      )
                    }
                  />

                  <div className="mt-5 flex items-center gap-2" role="group" aria-label="Handover shift">
                    {(["AM", "PM"] as const).map((period) => (
                      <button key={period} type="button" aria-pressed={handoverPeriod === period} onClick={() => setHandoverPeriod(period)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${handoverPeriod === period ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{period === "AM" ? "Afternoon" : "Night"} Handover</button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Separate shift examples. Your edits save in this browser.</p>

                  {canManageDocs && <button type="button" className={outlineButton + " mt-4"} onClick={() => openEditor("handover")}>Edit handover fields</button>}
                  <div className="mt-5 grid grid-cols-1 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <label htmlFor="shiftSummary" className="text-sm font-semibold text-slate-900">
                        {handoverLabels.shiftSummary}
                      </label>
                      <textarea
                        id="shiftSummary" aria-label={handoverLabels.shiftSummary} value={handover.shiftSummary}
                        onChange={(e) =>
                          updateHandover("shiftSummary", e.target.value)
                        }
                        rows={4}
                        disabled={!canEdit}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <TriangleAlert size={16} />
                          {handoverLabels.risks}
                        </label>
                        <textarea
                          id="risks" aria-label={handoverLabels.risks} value={handover.risks}
                          onChange={(e) =>
                            updateHandover("risks", e.target.value)
                          }
                          rows={5}
                          disabled={!canEdit}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                        />
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Siren size={16} />
                          {handoverLabels.actionsRequired}
                        </label>
                        <textarea
                          id="actionsRequired" aria-label={handoverLabels.actionsRequired} value={handover.actionsRequired}
                          onChange={(e) =>
                            updateHandover("actionsRequired", e.target.value)
                          }
                          rows={5}
                          disabled={!canEdit}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Info size={16} />
                        {handoverLabels.managerMessage}
                      </label>
                      <textarea
                        id="managerMessage" aria-label={handoverLabels.managerMessage} value={handover.managerMessage}
                        onChange={(e) =>
                          updateHandover("managerMessage", e.target.value)
                        }
                        rows={3}
                        disabled={!canEdit}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                  {completion(`handover-${handoverPeriod}`, "Handover checked")}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
                  <CardContent className="p-6">
                    <SectionTitle
                      title="Quick Update Composer"
                      description="Post a short operational update directly into the facility timeline."
                    />

                    <div className="mt-4">
                      <textarea
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        rows={4}
                        disabled={!canEdit}
                        placeholder="Example: Main gate lock checked, evening booking confirmed, awaiting maintenance response on floodlights..."
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={addTimelineUpdate}
                        disabled={!canEdit || !updateText.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                      >
                        <Plus size={16} />
                        Add Update
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <SectionTitle
                      title="At a Glance"
                      description="Fast operational snapshot."
                    />

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Site Status
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Design example
                        </div>
                      </div>

                      <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                          Open Issues
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {openIssueCount} active
                        </div>
                      </div>

                      <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          Tasks Due
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {weeklyDue + monthlyDue} pending
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Compliance
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {overdueCompliance} overdue item{overdueCompliance === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "information" && (facilityId ? <SavedFacilityInformation facilityId={facilityId}/> : <Card className="rounded-2xl border-slate-200 shadow-sm"><CardContent className="p-6"><SectionTitle title="Facility information" description="Create and Edit Facility retain the form you have already reviewed."/><Link href="/facilities/facilities-directory/new" className={primaryButton + " mt-4"}>Open Create Facility</Link></CardContent></Card>)}

          {activeTab === "issues" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Current Issues"
                  description="Open and recent issues affecting day-to-day facility operations." action={actions("issues")}
                />

                <div className="venue-records mt-5 space-y-4">
                  {!issues.length && <p className="text-sm text-slate-500">No issues in this browser preview. Add an entry to try the form.</p>}
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {issue.id}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                miniStatus(issue.status)
                              )}
                            >
                              {issue.status}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                miniStatus(issue.priority)
                              )}
                            >
                              {issue.priority}
                            </span>
                          </div>

                          <div className="mt-3 text-base font-semibold text-slate-900">
                            {issue.title}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Updated: {issue.updated}</span>
                            <span>•</span>
                            <span>Owner: {issue.owner}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openEditor("issues", issue.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View / Edit
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{issue.description}</p>
                      <WorkflowAttachments label="Issue photos" value={issue.attachments} photosOnly readOnly/>
                      {actions("issues", issue.id)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "timeline" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Facility Timeline"
                  description="A running log of operational activity, issue updates, and notable events."
                />

                <div className="venue-records mt-6 space-y-5">
                  {timeline.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 rounded-full bg-[#0C2F57] p-1.5 text-white">
                          <CircleDot size={12} />
                        </div>
                        <div className="h-full w-px bg-slate-200" />
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {item.type}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.time}
                        </div>
                        <div className="mt-3 text-sm text-slate-700">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "events" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Venue Events"
                  description="Venue-side preparation and on-site delivery. Facilities Department owns event records, approvals and cross-venue changes."
                />
                <h3 className="mt-6 text-base font-bold text-[#112d56]">Event records for this venue</h3>
                <p className="mt-1 text-xs text-[#60799f]">Historical demonstration records from 2025–26, not live scheduled events.</p>
                <div className="venue-records mt-3 grid gap-2 sm:grid-cols-2">
                  {eventExamples.filter((event) => event.venueId === facility.id).map((event) => (
                    <div key={event.id} className="rounded-xl border border-[#d5e4f6] bg-white p-4">
                      <strong className="block text-sm">{event.name}</strong>
                      <p className="mt-1 text-xs text-[#60799f]">{event.date} · {event.impact} · {event.status}</p>
                      <Link href={`/facilities/facilities-directory/${facility.id}/events/${event.id}`} className="mt-3 inline-block text-xs font-semibold text-[#155ca7] hover:underline">Open venue event →</Link>
                    </div>
                  ))}
                </div>
                <h3 className="mt-6 text-base font-bold text-[#112d56]">Local activity examples</h3>
                <p className="mt-1 text-xs text-[#60799f]">Past sample sessions shown for venue operations only. Manage event decisions in Facilities Department.</p>

                <div className="venue-records mt-4 space-y-4">
                  {events.map((event) => (
                    <div
                      key={`${event.title}-${event.date}-${event.time}`}
                      className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="text-base font-semibold text-slate-900">
                            {event.title}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.time}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {event.organiser}
                          </span>
                          <span
                            className={classNames(
                              "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              miniStatus(event.status)
                            )}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Bookings / Calendar"
                    description="Operational view of scheduled use, booking windows, and quick links to your main bookings and calendar pages."
                    action={
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => router.push("/facilities/bookings")}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink size={15} />
                          Open Bookings
                        </button>
                        <button
                          onClick={() => router.push("/facilities/shared-calendar")}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <ExternalLink size={15} />
                          Open Calendar
                        </button>
                      </div>
                    }
                  />

                  <div className="venue-records mt-5 space-y-4">
                    {bookingItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              {item.title}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                              <span>{item.date}</span>
                              <span>•</span>
                              <span>{item.time}</span>
                              <span>•</span>
                              <span>{item.space}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {item.source}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                miniStatus(item.status)
                              )}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    Mock note: this tab is designed to surface key scheduling
                    information while linking out to your existing Bookings and
                    Calendar areas.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "procedures" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Opening Procedure"
                    description="Steps to complete at the start of the day."
                    action={
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {openingDone}/{openingChecklist.length} done
                      </span>
                    }
                  />

                  <div className="mt-4">{actions("opening")}</div>
                  <div className="venue-records mt-5 space-y-3">
                    {!openingChecklist.length && <p className="text-sm text-slate-500">No opening checks in this browser preview. Add an entry to try the form.</p>}
                  {openingChecklist.map((step, index) => (
                      <div key={step.id} className="space-y-3"><button type="button"
                        aria-pressed={step.done} onClick={() => canEdit && toggleOpening(step.id)}
                        disabled={!canEdit}
                        className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-left ring-1 ring-slate-200 disabled:opacity-70"
                      >
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            step.done ? "bg-emerald-600" : "bg-[#0C2F57]"
                          )}
                        >
                          {step.done ? "✓" : index + 1}
                        </span>
                        <span className="text-sm text-slate-700">
                          {step.label}
                        </span>
                      </button>
                      {actions("opening", step.id)}
                      {completion(step.id, "Checklist reviewed", false)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Closing Procedure"
                    description="Steps to complete before the facility is locked down."
                    action={
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {closingDone}/{closingChecklist.length} done
                      </span>
                    }
                  />

                  <div className="mt-4">{actions("closing")}</div>
                  <div className="venue-records mt-5 space-y-3">
                    {!closingChecklist.length && <p className="text-sm text-slate-500">No closing checks in this browser preview. Add an entry to try the form.</p>}
                  {closingChecklist.map((step, index) => (
                      <div key={step.id} className="space-y-3"><button type="button"
                        aria-pressed={step.done} onClick={() => canEdit && toggleClosing(step.id)}
                        disabled={!canEdit}
                        className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-left ring-1 ring-slate-200 disabled:opacity-70"
                      >
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            step.done ? "bg-emerald-600" : "bg-slate-700"
                          )}
                        >
                          {step.done ? "✓" : index + 1}
                        </span>
                        <span className="text-sm text-slate-700">
                          {step.label}
                        </span>
                      </button>
                      {actions("closing", step.id)}
                      {completion(step.id, "Checklist reviewed", false)}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <DoorClosed size={16} />
                      End of Day Reminder
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Use the timeline or handover tab to record anything the
                      next shift or facilities manager needs to know.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "weekly" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Weekly Tasks"
                  description="Routine weekly actions that support safe and consistent operations."
                  action={actions("weekly")}
                />

                <div className="venue-records mt-5 space-y-4">
                  {!weeklyTasks.length && <p className="text-sm text-slate-500">No weekly tasks in this browser preview. Add an entry to try the form.</p>}
                  {weeklyTasks.map((item) => (
                    <div key={item.id} className="space-y-3"><button type="button"
                      aria-pressed={item.completed} onClick={() => canEdit && toggleWeekly(item.id)}
                      disabled={!canEdit}
                      className="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between disabled:opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            item.completed ? "bg-emerald-600" : "bg-[#0C2F57]"
                          )}
                        >
                          {item.completed ? "✓" : ""}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.task}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Owner: {item.owner} • Due: {(item as TaskItem & { due?: string }).due || "Not set"}
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{(item as TaskItem & { instructions?: string }).instructions}</p>
                        </div>
                      </div>

                      <span
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                          miniStatus(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </button>
                    {actions("weekly", item.id)}
                    {completion(item.id, "Completed", false)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "monthly" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Monthly Tasks"
                  description="Longer-cycle tasks for maintenance, compliance, and management oversight."
                  action={actions("monthly")}
                />

                <div className="venue-records mt-5 space-y-4">
                  {!monthlyTasks.length && <p className="text-sm text-slate-500">No monthly tasks in this browser preview. Add an entry to try the form.</p>}
                  {monthlyTasks.map((item) => (
                    <div key={item.id} className="space-y-3"><button type="button"
                      aria-pressed={item.completed} onClick={() => canEdit && toggleMonthly(item.id)}
                      disabled={!canEdit}
                      className="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between disabled:opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            item.completed ? "bg-emerald-600" : "bg-slate-700"
                          )}
                        >
                          {item.completed ? "✓" : ""}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.task}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Owner: {item.owner} • Due: {(item as TaskItem & { due?: string }).due || "Not set"}
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{(item as TaskItem & { instructions?: string }).instructions}</p>
                        </div>
                      </div>

                      <span
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                          miniStatus(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </button>
                    {actions("monthly", item.id)}
                    {completion(item.id, "Completed", false)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Documents / SOPs"
                    description="Key procedures, checklists, policies, and forms used on site."
                    action={
                      canManageDocs ? (
                        <button
                          onClick={() => openEditor("documents")}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Upload size={16} />
                          Upload Document
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Restricted
                        </span>
                      )
                    }
                  />

                  <div className="venue-records mt-5 space-y-4">
                    {!documents.length && <p className="text-sm text-slate-500">No documents in this browser preview. Add an entry to try the form.</p>}
                  {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {doc.title}
                            </span>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {doc.category}
                            </span>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {doc.version}
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-slate-500">
                            Updated {doc.updated} • Owner: {doc.owner}
                          </div>
                          <p className="mt-3 text-sm text-slate-700">{doc.instructions}</p>
                          {completion(doc.id, "Procedure followed / acknowledged")}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => openEditor("documents", doc.id, true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <Eye size={15} />
                            View
                          </button>
                          {doc.attachments?.[0] && /^(data:image\/(jpeg|png|webp);base64,|data:application\/pdf;base64,|data:text\/plain;base64,)/.test(doc.attachments[0].data) && <a href={doc.attachments[0].data} download={doc.attachments[0].name} className={outlineButton}><Download size={15}/>Download</a>}
                          {actions("documents", doc.id)}

                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Photo Log"
                    description="Visual record of issues, inspections, and site condition updates."
                    action={
                      canUpload ? (
                        <button
                          onClick={() => openEditor("photos")}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Upload size={16} />
                          Upload Photo
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Restricted
                        </span>
                      )
                    }
                  />

                  <div className="venue-records mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {!photos.length && <p className="text-sm text-slate-500">No photos in this browser preview. Add an entry to try the form.</p>}
                  {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                          {photo.attachments?.[0]?.type.startsWith("image/") ? <Image unoptimized src={photo.attachments[0].data} alt={photo.title} width={600} height={240} className="h-40 w-full object-cover"/> : <Camera size={28}/>}
                        </div>
                        <div className="p-4">
                          <div className="text-sm font-semibold text-slate-900">
                            {photo.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {photo.area} • {photo.uploaded}
                          </div>
                          <p className="mt-3 text-sm text-slate-700">
                            {photo.note}
                          </p>
                          <div className="mt-3">{actions("photos", photo.id)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="rounded-2xl border-emerald-200 bg-emerald-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-emerald-700" />
                      <div>
                        <div className="text-sm font-semibold text-emerald-700">
                          Compliant
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {compliance.filter((c) => c.status === "Compliant").length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <HardHat size={18} className="text-amber-700" />
                      <div>
                        <div className="text-sm font-semibold text-amber-700">
                          Due Soon
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {compliance.filter((c) => c.status === "Due Soon").length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-rose-200 bg-rose-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className="text-rose-700" />
                      <div>
                        <div className="text-sm font-semibold text-rose-700">
                          Overdue
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {overdueCompliance}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Compliance Register"
                    description="Track operational compliance, inspections, checks, and safety responsibilities."
                    action={
                      canManageCompliance ? (
                        actions("compliance")
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Complete checks
                        </span>
                      )
                    }
                  />

                  <div className="venue-records mt-5 space-y-4">
                    {!compliance.length && <p className="text-sm text-slate-500">No compliance checks in this browser preview. Add an entry to try the form.</p>}
                  {compliance.map((item) => {
                      const AreaIcon =
                        item.area === "Fire Safety"
                          ? Flame
                          : item.area === "First Aid"
                            ? HeartPulse
                            : item.area === "Site Safety"
                              ? Shield
                              : BadgeCheck;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-white p-2.5 text-slate-700 ring-1 ring-slate-200">
                              <AreaIcon size={16} />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </div>
                              <div className="mt-1 text-sm text-slate-500">
                                {item.area} • Due {item.due} • Owner: {item.owner}
                              </div>
                              <p className="mt-3 text-sm text-slate-700">{item.instructions}</p>
                              {actions("compliance", item.id)}
                              {completion(item.id, "Check completed")}
                            </div>
                          </div>

                          <span
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              miniStatus(item.status)
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "audit" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Audit Trail"
                  description="History of your changes in this browser preview."
                />

                <div className="venue-records mt-6 space-y-4">
                  {audit.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.action}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {item.detail}
                          </div>
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.time}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {item.user}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </section>

      <Modal open={!!editor} onClose={() => setEditor(null)} title={editor ? `${viewOnly ? "View" : editor.id ? "Edit" : "Create"} ${designTitles[editor.kind]}` : "Edit entry"} description="Changes save in this browser for design review.">
        {editor && <form onSubmit={saveEditor} className="space-y-5">
          {designFields[editor.kind].filter(field => role !== "Centre Manager" || editor.kind !== "issues" || !["status", "owner", "action", "resolution", "resolvedOn"].includes(field.key)).map(field => <label key={field.key} className="block text-sm font-semibold text-slate-700">{field.label}{field.required ? " *" : ""}
            {field.options ? <select disabled={viewOnly} value={draft[field.key] || field.options[0]} onChange={e => setDraft(prev => ({ ...prev, [field.key]: e.target.value }))} className={fieldClass}>{field.options.map(option => <option key={option}>{option}</option>)}</select> : field.multiline ? <textarea disabled={viewOnly} required={field.required} value={draft[field.key] || ""} rows={4} onChange={e => setDraft(prev => ({ ...prev, [field.key]: e.target.value }))} className={fieldClass}/> : <input disabled={viewOnly} required={field.required} type={field.type || "text"} value={draft[field.key] === "Not set" ? "" : draft[field.key] || ""} onChange={e => setDraft(prev => ({ ...prev, [field.key]: e.target.value }))} className={fieldClass}/>}
          </label>)}
          {["documents", "photos", "issues"].includes(editor.kind) && <div className="rounded-xl border border-dashed border-slate-300 p-4"><WorkflowAttachments label={editor.kind === "documents" ? "File upload" : "Photo upload"} value={draftFiles} onChange={setDraftFiles} photosOnly={editor.kind !== "documents"} readOnly={viewOnly}/></div>}
          {message && <p role="alert" className="text-sm text-rose-700">{message}</p>}
          <div className="flex justify-end gap-2"><button type="button" className={outlineButton} onClick={() => setEditor(null)}>{viewOnly ? "Close" : "Cancel"}</button>{!viewOnly && <button type="submit" className={primaryButton}>Save entry</button>}</div>
        </form>}
      </Modal>
    </div>
  );
}
