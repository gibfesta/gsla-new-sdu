"use client";
import { useState } from "react";
import EventEditor from "./EventEditor";
import { LayoutGrid, List } from "lucide-react";
import { FormPreviewCard } from "./FacilityFormPreviewer";
import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";
import WorkflowTemplateEditor, { workflowButton, workflowInput } from "./WorkflowTemplateEditor";
import { useSavedFacilities } from "./useSavedFacilities";
import { eventExamples } from "./eventExamples";
import { FORM_SECTIONS, FORM_SECTION_LABELS, formSection, type WorkflowTemplate } from "@/lib/facilityWorkflows";
import { useCatalogue, saveCatalogue, type CatalogueForm, type PreviewVenue } from "@/lib/facilityFormCatalogue";
const outline = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50";
export default function FormsAndProcedures() {
 const { data, notice } = useCatalogue();
 const { facilities, loading, error } = useSavedFacilities();
 const [view, setView] = useState<"cards" | "list">("list");
 const [editor, setEditor] = useState<CatalogueForm | null>(null);
 const [previewing, setPreviewing] = useState<CatalogueForm | null>(null);
 const [assigning, setAssigning] = useState<CatalogueForm | null>(null);
 const [deleted, setDeleted] = useState<CatalogueForm | null>(null);
 const [message, setMessage] = useState("");
 const venues = [...facilities.map(venue => ({ id: venue.id, name: venue.name })), ...data.previewVenues];
 function save(form: CatalogueForm) { saveCatalogue({ ...data, forms: data.forms.some(item => item.id === form.id) ? data.forms.map(item => item.id === form.id ? form : item) : [...data.forms, form] }); setMessage("Form saved in this browser."); }
 function create() { setEditor({ id: crypto.randomUUID(), kind: "work-order", title: "", instructions: "", category: "", frequency: "One-off / event", venue: "All venues", owner: "Head of Facilities", version: 1, reviewDate: "", dueDate: "", active: true, source: "Custom facilities form", standard: false, assignments: [], fields: [{ id: crypto.randomUUID(), label: "Work required", type: "textarea", required: true, help: "", options: [] }] }); }
 return <div className="space-y-6 text-slate-900">
  <FacilitiesDepartmentBanner title="Forms & Procedures" description="Create, edit and organise the forms used across your facilities. Assign additional work to particular venues, dates and events."/>
  <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">Design preview · catalogue changes and assignments save in this browser. Live permissions and shared database records will be connected after design approval.</p>
  {notice && <p role="alert" className="text-sm text-rose-700">{notice}</p>}{message && <p role="status" className="rounded-xl bg-slate-50 p-3 text-sm">{message}</p>}
  {deleted && <p className="rounded-xl bg-slate-50 p-3 text-sm">Removed “{deleted.title}”. <button type="button" className="font-semibold underline" onClick={() => { save(deleted); setDeleted(null); }}>Undo deletion</button></p>}
  {editor?.eventLayout ? <section className="space-y-4"><label className="block text-sm font-semibold">Template title<input className={workflowInput} value={editor.title} onChange={e => setEditor({ ...editor, title: e.target.value })}/></label><label className="block text-sm font-semibold">Instructions<textarea className={workflowInput} value={editor.instructions} onChange={e => setEditor({ ...editor, instructions: e.target.value })}/></label><EventEditor mode="new" preview templateTitle={editor.title} templateInstructions={editor.instructions} templateInitial={editor.eventLayout} onTemplateSave={eventLayout => { if (!editor.title.trim() || !editor.instructions.trim()) { setMessage("Enter a template title and instructions before saving."); return; } save({ ...editor, eventLayout, version: editor.version + 1 }); setEditor(null); }} onClose={() => setEditor(null)}/></section>
  : editor ? <WorkflowTemplateEditor key={editor.id} initial={editor} onCancel={() => setEditor(null)} onSave={(form: WorkflowTemplate) => { save({ ...editor, ...form, version: data.forms.some(item => item.id === form.id) ? editor.version + 1 : 1 }); setEditor(null); }}/>
  : assigning ? <AssignmentEditor key={assigning.id} form={assigning} venues={venues} loading={loading} venueError={error} onCancel={() => setAssigning(null)} onSave={form => { save(form); setAssigning(null); }} onAddVenue={name => { const venue = { id: crypto.randomUUID(), name }; saveCatalogue({ ...data, previewVenues: [...data.previewVenues, venue] }); }}/>
  : previewing?.eventLayout ? <section aria-label="Event form preview"><EventEditor key={previewing.id + previewing.version} mode="new" preview templateTitle={previewing.title} templateInstructions={previewing.instructions} templateInitial={previewing.eventLayout} onClose={() => setPreviewing(null)}/></section>
  : previewing ? <section aria-label="Form preview" className="space-y-4"><button type="button" className={outline} onClick={() => setPreviewing(null)}>Back to forms</button><p className="text-sm text-slate-600">Preview only · try the fields below. Answers save in this browser; no report is sent or work order issued.</p><FormPreviewCard key={previewing.id + previewing.version} form={previewing} scope="all"/></section>
  : <>
   <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex gap-1" role="group" aria-label="Forms view">{([["cards", "Card view", LayoutGrid], ["list", "List view", List]] as const).map(([value, label, Icon]) => <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === value ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><Icon size={16} aria-hidden="true"/>{label}</button>)}</div><button type="button" className={workflowButton} onClick={create}>Create new form</button></div>
   <p className="text-sm text-slate-600">Standard forms are included automatically for every facility. Extra forms only appear at their assigned venues. Use Assign to change either setting.</p>
   <div className="space-y-6">{FORM_SECTIONS.map(section => {
    const forms = data.forms.filter(form => formSection(form) === section);
    if (!forms.length) return null;
    return <section key={section} aria-labelledby={`forms-${section}`} className="space-y-3">
     <h2 id={`forms-${section}`} className="text-lg font-bold text-[#0C2F57]">{FORM_SECTION_LABELS[section]}</h2>
     <div className={view === "cards" ? "grid gap-3 xl:grid-cols-2" : "overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-200"}>
      {forms.map(form => <article key={form.id} className={view === "list" ? "flex flex-wrap items-center justify-between gap-3 px-4 py-3" : "rounded-xl border border-slate-200 bg-white p-4"}>
       <h3 className={"text-sm font-semibold text-slate-900 " + (view === "list" ? "min-w-0 flex-1" : "")}>{form.title}</h3>
       <div className={`flex flex-wrap gap-2 ${view === "cards" ? "mt-4" : ""}`}><button type="button" className={outline} onClick={() => setEditor(form)}>Edit</button><button type="button" className={outline} onClick={() => setAssigning(form)}>Assign</button><button type="button" className={outline} onClick={() => setPreviewing(form)}>Preview</button><button type="button" className={outline + " text-rose-700"} onClick={() => { saveCatalogue({ ...data, forms: data.forms.filter(item => item.id !== form.id) }); setDeleted(form); setMessage("Form removed from the catalogue and venue assignments."); }}>Delete</button></div>
      </article>)}
     </div>
    </section>;
   })}</div>
  </>}
 </div>;
}
function AssignmentEditor({ form, venues, loading, venueError, onCancel, onSave, onAddVenue }: { form: CatalogueForm; venues: PreviewVenue[]; loading: boolean; venueError: string; onCancel: () => void; onSave: (form: CatalogueForm) => void; onAddVenue: (name: string) => void }) {
 const [standard,setStandard] = useState(form.standard); const [assignments,setAssignments] = useState(form.assignments);
 const [selected,setSelected] = useState<string[]>([]); const [date,setDate] = useState(""); const [endDate,setEndDate] = useState(""); const [event,setEvent] = useState(""); const [venueName,setVenueName] = useState(""); const [error,setError] = useState("");
 return <form className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={e => { e.preventDefault(); if (endDate && (!date || endDate < date)) { setError("The end date must be on or after the start date."); return; } if (selected.length && form.frequency === "One-off / event" && !date && !event.trim()) { setError("Choose a date or event for this one-off assignment."); return; } const added = venues.filter(v => selected.includes(v.id)).map(v => ({ venueId: v.id, venueName: v.name, date, endDate, event: event.trim() })); const unique = [...assignments]; for (const a of added) if (!unique.some(existing => JSON.stringify(existing) === JSON.stringify(a))) unique.push(a); onSave({ ...form, standard, assignments: unique }); }}>
  <div className="flex justify-between gap-4"><h2 className="text-xl font-bold">Assign: {form.title}</h2><button type="button" className={outline} onClick={onCancel}>Cancel</button></div>
  <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold ring-1 ring-slate-200"><input type="checkbox" checked={standard} onChange={e => setStandard(e.target.checked)}/>Standard form — include automatically at every current and future facility</label>
  {!!assignments.length && <div><h3 className="font-semibold">Existing extra assignments</h3>{assignments.map((a,i) => <div key={i} className="mt-2 flex flex-wrap justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span>{a.venueName} · {a.date || "No date restriction"}{a.endDate ? ` to ${a.endDate}` : ""}{a.event ? ` · ${a.event}` : ""}</span><button type="button" className="text-rose-700" onClick={() => setAssignments(prev => prev.filter((_,index) => index !== i))}>Remove assignment</button></div>)}</div>}
  <fieldset><legend className="font-semibold">Assign extra forms to selected venues</legend>{loading && <p className="text-sm">Loading saved venues…</p>}{venueError && <p className="mt-2 text-sm text-slate-500">Saved venues are unavailable while the database is disconnected. Use a browser-only preview venue to try assignments.</p>}<div className="mt-3 grid gap-3 sm:grid-cols-2">{venues.map(venue => <label key={venue.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={selected.includes(venue.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev,venue.id] : prev.filter(id => id !== venue.id))}/>{venue.name}</label>)}</div></fieldset>
  <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Day / start date<input type="date" className={workflowInput} value={date} onChange={e => setDate(e.target.value)}/></label><label className="text-sm font-semibold">End date (optional)<input type="date" className={workflowInput} value={endDate} onChange={e => setEndDate(e.target.value)}/></label><label className="text-sm font-semibold sm:col-span-2">Event (optional)<input list="assignment-events" className={workflowInput} value={event} onChange={e => setEvent(e.target.value)} placeholder="Select an event example or enter an event name"/><datalist id="assignment-events">{eventExamples.map(item => <option key={item.id} value={item.name}/>)}</datalist></label></div>
  <div className="rounded-xl border border-dashed border-slate-300 p-4"><label className="text-sm font-semibold">Add a preview venue<input className={workflowInput} value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="Browser-only venue name"/></label><button type="button" className={outline + " mt-3"} disabled={!venueName.trim()} onClick={() => { onAddVenue(venueName.trim()); setVenueName(""); }}>Add preview venue</button><p className="mt-2 text-xs text-slate-500">This does not create a real facility.</p></div>
  {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}<button type="submit" className={workflowButton}>Save assignments</button>
 </form>;
}
