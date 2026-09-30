"use client";
import { useState } from "react";
import { canManage, type PreviewRecord, type PreviewRole } from "@/lib/facilityWorkflows";
import WorkflowAttachments from "./WorkflowAttachments";
import { workflowInput, workflowButton } from "./WorkflowTemplateEditor";
export default function WorkflowRecordReview({ record, role, onSave, onClose }: { record: PreviewRecord; role: PreviewRole; onSave: (record: PreviewRecord) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(() => structuredClone(record));
  const [error, setError] = useState("");
  const manager = canManage(role);
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold">{record.template.title} · preview record</h2><button className="text-sm font-semibold" onClick={onClose}>Back to previews</button></div>
    <p className="text-sm">{record.venue} · {record.date} {record.time} · {record.actor} ({record.role}){record.shift ? " · " + record.shift : ""}{record.recipient ? " · Reported to " + record.recipient : ""}</p>
    <p className="text-xs text-slate-500">Recorded against template version {record.template.version}. Later template edits do not change these answers.</p>
    <dl className="space-y-4">{record.template.fields.map(field => {
      const value = record.answers[field.id];
      return <div key={field.id} className="rounded-xl bg-slate-50 p-4"><dt className="text-sm font-semibold">{field.label}</dt><dd className="mt-2 whitespace-pre-wrap text-sm">{Array.isArray(value) ? <WorkflowAttachments label={field.label} value={value} readOnly /> : field.type === "checkbox" ? value === true ? "Ticked" : "Not ticked" : typeof value === "string" && value ? value : "Not provided"}</dd></div>;
    })}</dl>
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    {manager ? <form className="space-y-4 border-t pt-5" onSubmit={e => { e.preventDefault(); if (["Resolved", "Closed"].includes(draft.status) && (!draft.resolution.trim() || !draft.resolvedOn)) { setError("Add resolution notes and a resolved / closed date."); return; } onSave(draft); }}>
      <h3 className="text-lg font-bold">Manager review & follow-up</h3>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Status<select className={workflowInput} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as PreviewRecord["status"] })}>{["New", "Reviewed", "In Progress", "Resolved", "Closed"].map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="text-sm font-semibold">Assigned to<input className={workflowInput} value={draft.assignedTo} onChange={e => setDraft({ ...draft, assignedTo: e.target.value })} /></label>
      <label className="text-sm font-semibold">Target / follow-up date<input type="date" className={workflowInput} value={draft.targetDate} onChange={e => setDraft({ ...draft, targetDate: e.target.value })} /></label>
      <label className="text-sm font-semibold">Resolved / closed on<input type="date" className={workflowInput} value={draft.resolvedOn} onChange={e => setDraft({ ...draft, resolvedOn: e.target.value })} /></label></div>
      <label className="block text-sm font-semibold">Action taken / manager message<textarea rows={3} className={workflowInput} value={draft.action} onChange={e => setDraft({ ...draft, action: e.target.value })} /></label>
      <label className="block text-sm font-semibold">Resolution / completion notes<textarea rows={3} className={workflowInput} value={draft.resolution} onChange={e => setDraft({ ...draft, resolution: e.target.value })} /></label>
      <WorkflowAttachments label="Follow-up / resolution photos" value={draft.reviewPhotos} onChange={reviewPhotos => setDraft({ ...draft, reviewPhotos })} photosOnly />
      <button type="submit" className={workflowButton}>Save review preview</button>
    </form> : <div className="border-t pt-5 text-sm"><h3 className="font-bold">Manager feedback</h3><p className="mt-2">Status: {record.status} · Assigned to: {record.assignedTo || "Not assigned"}</p><p className="mt-2 whitespace-pre-wrap">{record.action || "No manager feedback yet."}</p><p className="mt-2 whitespace-pre-wrap">{record.resolution}</p><WorkflowAttachments label="Resolution photos" value={record.reviewPhotos} readOnly /></div>}
  </section>;
}
