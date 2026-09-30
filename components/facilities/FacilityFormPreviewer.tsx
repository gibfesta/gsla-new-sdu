"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import VenueBanner from "./VenueBanner";
import WorkflowAttachments from "./WorkflowAttachments";
import { workflowButton, workflowInput } from "./WorkflowTemplateEditor";
import { useCatalogue, assignedForms, type CatalogueForm } from "@/lib/facilityFormCatalogue";
import { KIND_LABELS, validateCompletion, type Answer, type Attachment, type WorkflowKind } from "@/lib/facilityWorkflows";
import { useVenueDesignState, useVenueDesignNotice } from "@/lib/venueDesignStore";
const groups: Record<string, WorkflowKind[]> = { handover: ["afternoon","night"], procedures: ["opening","closing"], weekly: ["maintenance","work-order"], monthly: ["maintenance"], compliance: ["compliance"], documents: ["sop"], issues: ["issue"], photos: ["photo"], bookings: ["booking"], timeline: ["update"], audit: [] };
const tabs = [["handover","Daily Handovers"],["procedures","Opening / Closing"],["weekly","Maintenance"],["compliance","Compliance"],["documents","Procedures / SOPs"],["issues","Issues"],["photos","Photo Log"],["bookings","Bookings"],["timeline","Updates"],["all","All forms"]];
export default function FacilityFormPreviewer({ facilityId, defaultTab = "handover" }: { facilityId?: string; defaultTab?: string }) {
 const { data, notice } = useCatalogue(); const params = useSearchParams(); const router = useRouter();
 const sectionMap: Record<string,string> = { daily: "handover", maintenance: "weekly", sop: "documents", issues: "issues", compliance: "compliance" };
 const tab = params.get("tab") || sectionMap[params.get("section") || ""] || defaultTab;
 const [venueId,setVenueId] = useState(facilityId || "all"); const [date,setDate] = useState(""); const [event,setEvent] = useState("");
 const available = venueId === "all" ? data.forms : assignedForms(data.forms,venueId,date,event);
 const filtered = params.get("form") ? available : tab === "all" ? available : available.filter(form => groups[tab]?.includes(form.kind) && (tab !== "monthly" || form.frequency === "Monthly"));
 const form = params.get("form") ? filtered.find(item => item.id === params.get("form")) : filtered[0];
 const scope = facilityId || venueId;
 return <div className="space-y-6 text-slate-900">
  <VenueBanner title={facilityId ? "Facility forms" : "Form Previewer"} description="See how the forms look and try their fields. Templates and venue assignments are managed in Forms & Procedures." eyebrow={facilityId ? "Venue forms" : "Venue form preview"}/>
  <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">Preview only · answers save in this browser. No work order is issued and no report is sent.</p>
  {notice && <p role="alert" className="text-sm text-rose-700">{notice}</p>}
  {<div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">{!facilityId && <label className="text-sm font-semibold">Venue<select className={workflowInput} value={venueId} onChange={e => setVenueId(e.target.value)}><option value="all">All catalogue forms</option>{data.previewVenues.map(venue => <option key={venue.id} value={venue.id}>{venue.name}</option>)}{[...new Map(data.forms.flatMap(f => f.assignments.map(a => [a.venueId,a.venueName] as const))).entries()].filter(([id]) => !data.previewVenues.some(v => v.id === id)).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select></label>}<label className="text-sm font-semibold">Day (optional)<input type="date" className={workflowInput} value={date} onChange={e => setDate(e.target.value)}/></label><label className="text-sm font-semibold">Event (optional)<input className={workflowInput} value={event} onChange={e => setEvent(e.target.value)} placeholder="Filter extra assignments by event"/></label></div>}
  {!facilityId && <nav className="flex flex-wrap gap-2" aria-label="Preview forms">{tabs.map(([value,label]) => <Link key={value} href={`?tab=${value}`} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === value && !params.get("form") ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{label}</Link>)}</nav>}
  {!!filtered.length && <label className="block text-sm font-semibold">Choose a form<select aria-label="Choose a form" className={workflowInput} value={form?.id || ""} onChange={e => router.replace(`?tab=${tab}&form=${e.target.value}`)}>{filtered.map(item => <option key={item.id} value={item.id}>{item.title}{!item.active ? " (inactive)" : ""}</option>)}</select></label>}
  {form ? <div className={tab === "procedures" && !params.get("form") ? "grid gap-6 lg:grid-cols-2" : "space-y-6"}>{(tab === "procedures" && !params.get("form") ? filtered : [form]).map(item => <FormPreviewCard key={scope + item.id + item.version} form={item} scope={scope}/>)}</div> : <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm">{params.get("form") ? "This form has been deleted or is not assigned to this venue for the selected day/event." : "No forms are available in this section."}</p>}
  <p className="text-sm text-slate-500">To change a form or its assignments, open <Link className="font-semibold text-[#0C2F57] underline" href="/facilities/forms-and-procedures">Forms & Procedures</Link>.</p>
 </div>;
}
function examples(form: CatalogueForm): Record<string,Answer> {
 return Object.fromEntries(form.fields.map(field => [field.id, field.type === "checkbox" ? false : field.type === "photos" || field.type === "file" ? [] : field.type === "select" ? field.options[0] || "" : field.type === "date" || field.type === "time" ? "" : `Example: ${field.label === "Shift summary" ? "Opening checks completed. Describe the shift here." : field.label === "Risks / concerns" ? "Monitor the entrance gate until it has been checked." : field.label === "Actions required" ? "Arrange a gate inspection." : field.label === "Manager message / notes" ? "Pass unresolved concerns to the next shift." : field.label.toLowerCase()}`]));
}
function FormPreviewCard({form,scope}:{form:CatalogueForm;scope:string}) {
 const [answers,setAnswers] = useVenueDesignState(scope,"catalogue-form-" + form.id + "-v" + form.version,examples(form));
 const [meta,setMeta] = useVenueDesignState(scope,"catalogue-meta-" + form.id,{ actor:"",date:"",notes:"",recipient:"" });
 const notice = useVenueDesignNotice(scope); const [message,setMessage] = useState("");
 const checks = form.fields.filter(field => field.type === "checkbox");
 return <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={e => { e.preventDefault(); const problem = validateCompletion(form,answers); setMessage(problem || "Preview saved in this browser."); }}>
  <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">{form.title}</h2><p className="mt-1 text-sm text-slate-500">{KIND_LABELS[form.kind]} · v{form.version} · {form.frequency}</p></div><button type="submit" className={workflowButton}>Save preview</button></div>
  <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">{form.instructions}</p>
  {!!checks.length && <p className="mt-4 text-xs font-semibold text-slate-500">{checks.filter(field => answers[field.id] === true).length}/{checks.length} checks complete</p>}
  {!!form.documents?.length && <WorkflowAttachments label="Reference documents" value={form.documents} readOnly/>}
  {!form.active && <p className="mt-3 text-sm text-amber-800">This form is inactive and will not appear in facility assignments.</p>}
  <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">{form.fields.map((field,index) => {
   const value=answers[field.id]; const id=form.id+"-"+field.id;
   const change=(answer:Answer)=>setAnswers(prev=>({...prev,[field.id]:answer}));
   const half = ["afternoon","night"].includes(form.kind) && ["risks","actions"].includes(field.id);
   return <div key={field.id} className={`rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 ${half ? "" : "lg:col-span-2"}`}>
    {field.type === "checkbox" ? <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={value===true} required={field.required} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0C2F57]" onChange={e=>change(e.target.checked)}/><span>{index+1}. {field.label}{field.required?" *":""}</span></label>
    : field.type === "photos" || field.type === "file" ? <WorkflowAttachments label={field.label+(field.required?" *":"")} value={Array.isArray(value)?value as Attachment[]:[]} onChange={change} photosOnly={field.type==="photos"}/>
    : <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{field.label}{field.required?" *":""}{field.type === "textarea" ? <textarea id={id} rows={field.id==="summary"?4:3} required={field.required} className={workflowInput} value={typeof value==="string"?value:""} onChange={e=>change(e.target.value)}/> : field.type === "select" ? <select id={id} required={field.required} className={workflowInput} value={typeof value==="string"?value:""} onChange={e=>change(e.target.value)}><option value="">Select an option</option>{field.options.map(option=><option key={option}>{option}</option>)}</select> : <input id={id} type={field.type} required={field.required} className={workflowInput} value={typeof value==="string"?value:""} onChange={e=>change(e.target.value)}/>}</label>}
    {field.help && <p className="mt-2 text-xs text-slate-500">{field.help}</p>}
   </div>;
  })}</div>
  <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-2"><label className="text-sm font-semibold">{form.kind === "issue" ? "Reported by" : "Completed by"}<input className={workflowInput} value={meta.actor} onChange={e=>setMeta(prev=>({...prev,actor:e.target.value}))}/></label><label className="text-sm font-semibold">Date & time<input type="datetime-local" className={workflowInput} value={meta.date} onChange={e=>setMeta(prev=>({...prev,date:e.target.value}))}/></label>{form.kind === "issue" && <label className="text-sm font-semibold sm:col-span-2">Report to<select className={workflowInput} value={meta.recipient || ""} onChange={e=>setMeta(prev=>({...prev,recipient:e.target.value}))}><option value="">Select receiving manager</option>{["Facilities Manager 1","Facilities Manager 2","Facilities Manager 3","Head of Facilities"].map(item=><option key={item}>{item}</option>)}</select></label>}<label className="text-sm font-semibold sm:col-span-2">Notes / findings / exceptions<textarea rows={3} className={workflowInput} value={meta.notes} onChange={e=>setMeta(prev=>({...prev,notes:e.target.value}))}/></label></div>
  {notice && <p role="alert" className="mt-4 text-sm text-rose-700">{notice}</p>}{message && <p role="status" className="mt-4 text-sm text-slate-700">{message}</p>}
 </form>;
}
