"use client";
import { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";
import { KIND_LABELS, PREVIEW_ROLES, WORKFLOW_KINDS, canManage, type WorkflowTemplate, type WorkflowKind, type PreviewRecord, type PreviewRole } from "@/lib/facilityWorkflows";
import { readPreviewSnapshot, savePreviewData, serverPreviewSnapshot, subscribePreview } from "@/lib/workflowPreviewStore";
import WorkflowTemplateEditor, { workflowButton } from "./WorkflowTemplateEditor";
import WorkflowCompletionForm from "./WorkflowCompletionForm";
import WorkflowRecordReview from "./WorkflowRecordReview";

const FILTERS: Record<string, WorkflowKind[]> = { all: [...WORKFLOW_KINDS], daily: ["opening", "closing", "afternoon", "night"], maintenance: ["maintenance"], compliance: ["compliance"], sop: ["sop"], issues: ["issue"] };
const FILTER_LABELS: Record<string, string> = { all: "All forms", daily: "Daily operations", maintenance: "Maintenance", compliance: "Compliance", sop: "Procedures & SOPs", issues: "Issues" };
export default function FacilityWorkflowWorkspace() {
  const params = useSearchParams();
  return <Workspace key={params.toString()} initialFilter={params.get("section") ?? "all"} initialRole={params.get("role") === "cm" ? "Centre Manager" : "Head of Facilities"} venueName={params.get("venue") ?? ""} startComplete={params.get("mode") === "complete"} />;
}
function Workspace({ initialFilter, initialRole, venueName, startComplete }: { initialFilter: string; initialRole: PreviewRole; venueName: string; startComplete: boolean }) {
  const { data, notice } = useSyncExternalStore(subscribePreview, readPreviewSnapshot, serverPreviewSnapshot);
  const [role, setRole] = useState(initialRole);
  const [filter, setFilter] = useState(FILTERS[initialFilter] ? initialFilter : "all");
  const [tab, setTab] = useState<"templates" | "complete" | "records">(startComplete || !canManage(initialRole) ? "complete" : "templates");
  const [editor, setEditor] = useState<WorkflowTemplate | null>(null);
  const [completion, setCompletion] = useState<WorkflowTemplate | null>(null);
  const [review, setReview] = useState<PreviewRecord | null>(null);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<WorkflowTemplate | null>(null);
  const [deleted, setDeleted] = useState<WorkflowTemplate | null>(null);
  const manager = canManage(role);
  const available = data.templates.filter(template => FILTERS[filter].includes(template.kind) && (manager || template.active));
  const records = data.records.filter(record => FILTERS[filter].includes(record.template.kind));
  function switchTab(next: typeof tab) { setTab(next); setEditor(null); setCompletion(null); setReview(null); setMessage(""); }
  function create() {
    setEditor({ id: crypto.randomUUID(), kind: FILTERS[filter][0], title: "", instructions: "", category: "", frequency: "Daily", venue: venueName || "All venues", owner: role, version: 1, reviewDate: "", dueDate: "", active: true, fields: [], source: "Your template design", documents: [] });
  }
  function saveTemplate(template: WorkflowTemplate) {
    if (!manager) return;
    const previous = data.templates.find(item => item.id === template.id);
    const updated = { ...template, version: previous ? previous.version + 1 : 1, source: "Your template design" };
    savePreviewData({ ...data, templates: previous ? data.templates.map(item => item.id === updated.id ? updated : item) : [...data.templates, updated] });
    setEditor(null); setMessage("Template preview saved. Switch to Centre Manager to try completing it.");
  }
  function saveRecord(record: PreviewRecord) {
    savePreviewData({ ...data, records: [record, ...data.records] }); setCompletion(null); setTab("records"); setMessage(record.template.kind === "issue" ? "Issue preview saved. Switch to an FM or the Head of Facilities to review and assign it. No notification was sent." : "Completion preview saved for review.");
  }
  return <div className="space-y-5 text-[#0C2F57]">
    <FacilitiesDepartmentBanner title="Facilities Forms" description="Design the manager templates and try the forms Centre Managers will complete." />
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6"><strong>Design preview.</strong> Example templates recover the old venue fields. Your template changes and test completions stay in this browser. No real report, upload or notification is sent. The role selector demonstrates the intended workflow; account permissions will be enforced when connected.</div>
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
      <label className="text-sm font-semibold">Preview role<select className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={role} onChange={e => { const next = e.target.value as PreviewRole; setRole(next); setEditor(null); setCompletion(null); setReview(null); setPendingDelete(null); setTab(canManage(next) ? "templates" : "complete"); }}>{PREVIEW_ROLES.map(item => <option key={item}>{item}</option>)}</select></label>
      <div className="self-center text-sm leading-6">{manager ? <p><strong>Manager workspace:</strong> create, edit and delete templates; report issues; review completions and follow-up.</p> : <p><strong>CM workspace:</strong> read instructions, tick checks, fill text boxes and attach evidence. Template editing is unavailable.</p>}</div>
    </div>
    {notice && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{notice}</p>}
    {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    <nav className="flex flex-wrap gap-2" aria-label="Form categories">{Object.entries(FILTER_LABELS).map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} className={filter === key ? workflowButton : "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"} onClick={() => { setFilter(key); setEditor(null); setCompletion(null); setReview(null); }}>{label}</button>)}</nav>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2" role="group" aria-label="Form workspace">
      {manager && <button className={tab === "templates" ? workflowButton : "rounded-xl border bg-white px-4 py-2 text-sm"} onClick={() => switchTab("templates")}>Manage templates</button>}
      <button className={tab === "complete" ? workflowButton : "rounded-xl border bg-white px-4 py-2 text-sm"} onClick={() => switchTab("complete")}>Complete a form</button>
      <button className={tab === "records" ? workflowButton : "rounded-xl border bg-white px-4 py-2 text-sm"} onClick={() => switchTab("records")}>Review previews ({records.length})</button>
    </div>{manager && tab === "templates" && !editor && <button className={workflowButton} onClick={create}>Create template</button>}</div>
    {pendingDelete && manager && <div role="alert" className="rounded-xl border border-rose-200 bg-white p-5"><p>Delete the template “{pendingDelete.title}”? Existing completion previews keep their original form and answers.</p><div className="mt-3 flex gap-4"><button className="text-sm font-semibold text-rose-700" onClick={() => { savePreviewData({ ...data, templates: data.templates.filter(item => item.id !== pendingDelete.id) }); setDeleted(pendingDelete); setPendingDelete(null); }}>Delete template preview</button><button className="text-sm" onClick={() => setPendingDelete(null)}>Cancel deletion</button></div></div>}
    {deleted && manager && <p className="rounded-xl bg-slate-100 p-3 text-sm">Template removed. <button className="font-bold underline" onClick={() => { savePreviewData({ ...data, templates: [...data.templates.filter(item => item.id !== deleted.id), deleted] }); setDeleted(null); }}>Undo template deletion</button></p>}
    {editor && manager ? <WorkflowTemplateEditor key={editor.id} initial={editor} onSave={saveTemplate} onCancel={() => setEditor(null)} />
    : completion ? <WorkflowCompletionForm key={completion.id + completion.version + role} template={completion} role={role} venueName={venueName} onSave={saveRecord} onCancel={() => setCompletion(null)} />
    : review ? <WorkflowRecordReview key={review.id + role} record={review} role={role} onClose={() => setReview(null)} onSave={record => { if (!manager) return; savePreviewData({ ...data, records: data.records.map(item => item.id === record.id ? record : item) }); setReview(null); setMessage("Manager review preview saved."); }} />
    : tab === "records" ? <section className="space-y-3">{!records.length && <p className="rounded-2xl border bg-white p-6 text-sm">No test completions yet. Complete a form to see how reports and manager reviews will look.</p>}{records.map(record => <article key={record.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"><div><h2 className="font-bold">{record.template.title}</h2><p className="mt-1 text-sm">{record.venue} · {record.date} · {record.actor} ({record.role})</p><p className="mt-1 text-xs text-slate-500">{record.status}{record.recipient ? " · Reported to " + record.recipient : ""}{record.assignedTo ? " · Assigned to " + record.assignedTo : ""}</p></div><button className={workflowButton} onClick={() => setReview(record)}>Open preview</button></article>)}</section>
    : <div className="grid gap-4 lg:grid-cols-2">{available.map(template => <article key={template.id} className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase text-slate-500">{KIND_LABELS[template.kind]} · v{template.version} · {template.active ? "Available" : "Inactive"}</p><h2 className="mt-2 text-xl font-bold">{template.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{template.instructions}</p><p className="mt-3 text-xs text-slate-500">{template.venue} · {template.frequency} · Owner: {template.owner}</p>
      <ul className="mt-4 space-y-1 text-xs text-slate-600">{template.fields.map(field => <li key={field.id}>{field.type === "checkbox" ? "☐" : field.type === "photos" ? "Photo" : field.type === "file" ? "File" : "Text / input"} · {field.label}{field.required ? " *" : ""}</li>)}</ul>
      <p className="mt-4 text-xs text-slate-500">{template.source}</p>
      <div className="mt-4 flex flex-wrap gap-3">{template.active && <button className={workflowButton} onClick={() => { setCompletion(template); setTab("complete"); }}>Complete {template.kind === "issue" ? "issue report" : "form"}</button>}{manager && <><button className="rounded-xl border px-3 py-2 text-sm font-semibold" onClick={() => { setEditor(template); setTab("templates"); }}>Edit template</button><button className="px-3 py-2 text-sm font-semibold text-rose-700" onClick={() => setPendingDelete(template)}>Delete template</button></>}</div>
    </article>)}{!available.length && <p className="rounded-2xl border bg-white p-6 text-sm">No available templates in this category.</p>}</div>}
    <Link className="inline-block text-sm font-semibold text-[#155ca7]" href="/facilities/home">Back to Facilities Overview</Link>
  </div>;
}
