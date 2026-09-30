"use client";
import { useState } from "react";
import { KIND_LABELS, validateCompletion, type Answer, type Attachment, type PreviewRecord, type PreviewRole, type WorkflowTemplate } from "@/lib/facilityWorkflows";
import WorkflowAttachments from "./WorkflowAttachments";
import { workflowInput, workflowButton } from "./WorkflowTemplateEditor";
function localDate() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Gibraltar", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  return ["year", "month", "day"].map(type => parts.find(part => part.type === type)?.value).join("-");
}
export default function WorkflowCompletionForm({ template, role, venueName = "", onSave, onCancel }: { template: WorkflowTemplate; role: PreviewRole; venueName?: string; onSave: (record: PreviewRecord) => void; onCancel: () => void }) {
  const [venue, setVenue] = useState(venueName || (template.venue === "All venues" ? "" : template.venue));
  const [actor, setActor] = useState("");
  const [date, setDate] = useState(localDate);
  const [time, setTime] = useState("");
  const [shift, setShift] = useState("");
  const [recipient, setRecipient] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [error, setError] = useState("");
  function answer(id: string, value: Answer) { setAnswers(previous => ({ ...previous, [id]: value })); }
  function save() {
    const problem = validateCompletion(template, answers);
    if (!venue.trim() || !actor.trim() || !date || !time || (template.kind === "issue" && !recipient)) { setError("Provide the venue, your name, date, time and (for issues) receiving manager."); return; }
    if (template.venue !== "All venues" && venue.trim().toLowerCase() !== template.venue.trim().toLowerCase()) { setError("This template is for " + template.venue + "."); return; }
    if (problem) { setError(problem); return; }
    onSave({ id: crypto.randomUUID(), template: structuredClone(template), venue: venue.trim(), date, time, shift, actor: actor.trim(), role, recipient, answers: structuredClone(answers), status: "New", assignedTo: "", targetDate: "", action: "", resolution: "", resolvedOn: "", reviewPhotos: [] });
  }
  return <form className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={e => { e.preventDefault(); save(); }}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-slate-500">{KIND_LABELS[template.kind]} · version {template.version}</p><h2 className="mt-1 text-2xl font-bold text-[#0C2F57]">{template.title}</h2></div><button type="button" className="text-sm font-semibold" onClick={onCancel}>Back to forms</button></div>
    <div className="rounded-xl bg-blue-50 p-4 text-sm"><p className="whitespace-pre-wrap">{template.instructions}</p><p className="mt-2 text-xs text-slate-500">Owner: {template.owner} · {template.frequency}{template.dueDate ? " · Due " + template.dueDate : ""}</p></div>
    {!!template.documents?.length && <div><h3 className="font-semibold">Reference documents</h3><WorkflowAttachments label="Reference documents" value={template.documents} readOnly /></div>}
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">Facility / venue *<input required className={workflowInput} value={venue} onChange={e => setVenue(e.target.value)} placeholder="Enter venue name for this preview" /></label>
      <label className="text-sm font-semibold">{template.kind === "issue" ? "Reported by" : "Completed by"} *<input required className={workflowInput} value={actor} onChange={e => setActor(e.target.value)} placeholder="Your name" /></label>
      <label className="text-sm font-semibold">Date *<input required type="date" className={workflowInput} value={date} onChange={e => setDate(e.target.value)} /></label>
      <label className="text-sm font-semibold">Time *<input required type="time" className={workflowInput} value={time} onChange={e => setTime(e.target.value)} /></label>
      <label className="text-sm font-semibold">Shift<select className={workflowInput} value={shift} onChange={e => setShift(e.target.value)}><option value="">Select shift if applicable</option>{["Shift Black", "Shift Grey", "Shift White"].map(item => <option key={item}>{item}</option>)}</select></label>
      {template.kind === "issue" ? <label className="text-sm font-semibold">Report to *<select required className={workflowInput} value={recipient} onChange={e => setRecipient(e.target.value)}><option value="">Select receiving manager</option>{["FM 1", "FM 2", "FM 3", "Head of Facilities"].map(item => <option key={item}>{item}</option>)}</select></label> : <p className="self-center text-sm text-slate-500">Completing as: {role}</p>}
    </div>
    <div className="space-y-5">{template.fields.map(field => {
      const id = "answer-" + field.id;
      const value = answers[field.id];
      const label = field.label + (field.required ? " *" : "");
      return <div key={field.id} className="rounded-xl border border-slate-200 p-4">
        {field.type === "checkbox" ? <label className="flex items-start gap-3 text-sm font-semibold"><input required={field.required} type="checkbox" checked={value === true} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0C2F57]" onChange={e => answer(field.id, e.target.checked)} />{label}</label>
        : field.type === "photos" || field.type === "file" ? <WorkflowAttachments label={label} value={Array.isArray(value) ? value as Attachment[] : []} onChange={files => answer(field.id, files)} photosOnly={field.type === "photos"} />
        : <label htmlFor={id} className="block text-sm font-semibold">{label}
          {field.type === "textarea" ? <textarea id={id} required={field.required} rows={4} className={workflowInput} value={typeof value === "string" ? value : ""} onChange={e => answer(field.id, e.target.value)} />
          : field.type === "select" ? <select id={id} required={field.required} className={workflowInput} value={typeof value === "string" ? value : ""} onChange={e => answer(field.id, e.target.value)}><option value="">Select an option</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
          : <input id={id} required={field.required} type={field.type} className={workflowInput} value={typeof value === "string" ? value : ""} onChange={e => answer(field.id, e.target.value)} />}
        </label>}
        {field.help && <p className="mt-2 text-xs text-slate-500">{field.help}</p>}
      </div>;
    })}</div>
    <p className="text-xs text-slate-500">This saves a test completion in this browser for design review. It does not send a report or notify a manager.</p>
    <button type="submit" className={workflowButton}>{template.kind === "issue" ? "Save issue report preview" : "Save completion preview"}</button>
  </form>;
}
