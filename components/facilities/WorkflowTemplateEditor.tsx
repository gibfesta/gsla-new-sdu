"use client";
import { useState } from "react";
import { FIELD_TYPES, KIND_LABELS, WORKFLOW_KINDS, FORM_SECTIONS, FORM_SECTION_LABELS, formSection, validateTemplate, type FormSection, type WorkflowTemplate, type WorkflowKind, type FormField } from "@/lib/facilityWorkflows";
import WorkflowAttachments from "./WorkflowAttachments";
export const workflowInput = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800";
export const workflowButton = "rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110";
export default function WorkflowTemplateEditor({ initial, onSave, onCancel }: { initial: WorkflowTemplate; onSave: (template: WorkflowTemplate) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(() => structuredClone(initial));
  const [error, setError] = useState("");
  const updateField = (id: string, change: Partial<FormField>) => setDraft(previous => ({ ...previous, fields: previous.fields.map(field => field.id === id ? { ...field, ...change } : field) }));
  function move(index: number, offset: number) {
    setDraft(previous => { const fields = [...previous.fields]; [fields[index], fields[index + offset]] = [fields[index + offset], fields[index]]; return { ...previous, fields }; });
  }
  return <form onSubmit={e => { e.preventDefault(); const problem = validateTemplate(draft); if (problem) { setError(problem); return; } onSave(draft); }} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold text-[#0C2F57]">{initial.title ? "Edit form" : "Create new form"}</h2><button type="button" className="text-sm font-semibold" onClick={onCancel}>Cancel</button></div>
    <p className="text-sm text-slate-500">FMs and the Head of Facilities define the instructions and fields. CMs complete the resulting form.</p>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">Template title *<input required className={workflowInput} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
      <label className="text-sm font-semibold">Form type<select className={workflowInput} value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value as WorkflowKind })}>{WORKFLOW_KINDS.map(kind => <option key={kind} value={kind}>{KIND_LABELS[kind]}</option>)}</select></label>
      <label className="text-sm font-semibold">Section<select className={workflowInput} value={formSection(draft)} onChange={e => setDraft({ ...draft, section: e.target.value as FormSection })}>{FORM_SECTIONS.map(section => <option key={section} value={section}>{FORM_SECTION_LABELS[section]}</option>)}</select></label>
      <label className="text-sm font-semibold">Category<input className={workflowInput} value={draft.category} placeholder="e.g. Fire Safety, SOP or Checklist" onChange={e => setDraft({ ...draft, category: e.target.value })} /></label>
      <label className="text-sm font-semibold">Frequency<select className={workflowInput} value={draft.frequency} onChange={e => setDraft({ ...draft, frequency: e.target.value })}>{["Daily", "Weekly", "Monthly", "Quarterly", "Annually", "As scheduled", "As required", "One-off / event"].map(item => <option key={item}>{item}</option>)}</select></label>
      <p className="self-center text-sm text-slate-500">Venue assignments and standard facility inclusion are managed using Assign on the catalogue.</p>
      <label className="text-sm font-semibold">Template owner *<input required className={workflowInput} value={draft.owner} onChange={e => setDraft({ ...draft, owner: e.target.value })} /></label>
      <label className="text-sm font-semibold">Review date<input type="date" className={workflowInput} value={draft.reviewDate} onChange={e => setDraft({ ...draft, reviewDate: e.target.value })} /></label>
      <label className="text-sm font-semibold">Check / task due date<input type="date" className={workflowInput} value={draft.dueDate} onChange={e => setDraft({ ...draft, dueDate: e.target.value })} /></label>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.active} onChange={e => setDraft({ ...draft, active: e.target.checked })} />Available for completion</label>
      <p className="self-center text-xs text-slate-500">Version {draft.version} · saving an edited template creates the next preview version.</p>
    </div>
    <label className="block text-sm font-semibold">Procedure / instructions *<textarea required rows={5} className={workflowInput} value={draft.instructions} onChange={e => setDraft({ ...draft, instructions: e.target.value })} placeholder="Describe what the CM needs to do, in order." /></label>
    <WorkflowAttachments label="Reference SOP / instruction documents" value={draft.documents ?? []} onChange={documents => setDraft({ ...draft, documents })} />
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">Form fields</h3><button type="button" className={workflowButton} onClick={() => setDraft(previous => ({ ...previous, fields: [...previous.fields, { id: crypto.randomUUID(), label: "", type: "checkbox", required: false, help: "", options: [] }] }))}>Add field</button></div>
    <p className="text-xs text-slate-500">A required checkbox must be ticked. Leave checklist ticks optional when a failed check needs to be reported using the outcome and exceptions fields.</p>
    {draft.fields.map((field, index) => <fieldset key={field.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <legend className="px-2 text-sm font-bold">Field {index + 1}</legend>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Field label *<input required className={workflowInput} value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} /></label>
      <label className="text-sm font-semibold">Field type<select className={workflowInput} value={field.type} onChange={e => updateField(field.id, { type: e.target.value as FormField["type"], options: e.target.value === "select" && !field.options.length ? ["Option 1"] : field.options })}>{FIELD_TYPES.map(type => <option key={type} value={type}>{({ checkbox: "Tick box", text: "Short text", textarea: "Text box", select: "Choice list", date: "Date", time: "Time", photos: "Photos", file: "Evidence file" })[type]}</option>)}</select></label>
      <label className="text-sm font-semibold sm:col-span-2">Help / instructions<input className={workflowInput} value={field.help} onChange={e => updateField(field.id, { help: e.target.value })} /></label>
      {field.type === "select" && <label className="text-sm font-semibold sm:col-span-2">Choices (one per line)<textarea rows={3} className={workflowInput} value={field.options.join("\n")} onChange={e => updateField(field.id, { options: e.target.value.split("\n") })} /></label>}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} />Required</label></div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold"><button type="button" disabled={index === 0} className="disabled:opacity-30" onClick={() => move(index, -1)}>Move field {index + 1} up</button><button type="button" disabled={index === draft.fields.length - 1} className="disabled:opacity-30" onClick={() => move(index, 1)}>Move field {index + 1} down</button><button type="button" className="text-rose-700" onClick={() => setDraft(previous => ({ ...previous, fields: previous.fields.filter(item => item.id !== field.id) }))}>Remove field {index + 1}</button></div>
    </fieldset>)}
    <button className={workflowButton} type="submit">Save form</button>
  </form>;
}
