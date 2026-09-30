"use client";
import { useSyncExternalStore } from "react";
import { initialWorkflowTemplates, parsePreviewStore, STORAGE_KEY, validateTemplate, type WorkflowTemplate, type FormField } from "./facilityWorkflows";
export type Assignment = { venueId: string; venueName: string; date: string; endDate: string; event: string };
export type CatalogueForm = WorkflowTemplate & { standard: boolean; assignments: Assignment[] };
export type PreviewVenue = { id: string; name: string };
type Catalogue = { version: 1; forms: CatalogueForm[]; previewVenues: PreviewVenue[] };
type Snapshot = { data: Catalogue; notice: string };
const key = "gsla-facilities-forms-procedures-v1";
const f = (id: string, label: string, type: FormField["type"] = "textarea", required = false, options: string[] = []): FormField => ({ id, label, type, required, help: "", options });
function extra(id: string, kind: WorkflowTemplate["kind"], title: string, fields: FormField[], standard = false): CatalogueForm {
 return { id, kind, title, fields, standard, assignments: [], instructions: "Complete the required information and record any exceptions or follow-up actions.", category: "", frequency: standard ? "As required" : "One-off / event", venue: "All venues", owner: "Head of Facilities", version: 1, reviewDate: "", dueDate: "", active: true, source: "Facilities form catalogue", documents: [] };
}
export function initialCatalogueForms(): CatalogueForm[] {
 const base = initialWorkflowTemplates().map(form => ({ ...form, standard: true, assignments: [] }));
 return [...base,
  extra("maintenance-request", "work-order", "Maintenance Request", [f("asset", "Asset / location", "text", true), f("linked", "Linked issue reference", "text"), f("work", "Work required", "textarea", true), f("priority", "Priority", "select", true, ["Low", "Medium", "High", "Urgent"]), f("requester", "Requested by", "text", true), f("requested", "Requested on", "date", true), f("photos", "Evidence photos", "photos")], true),
  extra("maintenance-update", "work-order", "Maintenance Update / Work Order", [f("reference", "Work order reference", "text", true), f("assigned", "Assigned to", "text"), f("status", "Status", "select", true, ["New", "In Progress", "Completed", "On hold"]), f("target", "Target date", "date"), f("work", "Work completed / progress notes"), f("completed", "Completion date", "date"), f("photos", "Evidence photos", "photos")], true),
  extra("follow-up", "compliance", "Compliance Follow-up Action", [f("linked", "Linked compliance check", "text", true), f("action", "Action required", "textarea", true), f("owner", "Owner", "text", true), f("deadline", "Deadline", "date"), f("done", "Action completed", "checkbox"), f("evidence", "Completion evidence", "file")], true),
  extra("opening-sop", "sop", "Opening Procedure SOP", [f("read", "Instructions read and understood", "checkbox", true), f("done", "Opening procedure followed", "checkbox"), f("notes", "Exceptions / notes")], true),
  extra("closing-checklist", "sop", "Closing Checklist", [f("exit", "All users have exited", "checkbox"), f("secure", "Gates and doors secured", "checkbox"), f("notes", "Incidents / exceptions")], true),
  extra("incident-form", "issue", "Incident Reporting Form", [f("title", "Incident title", "text", true), f("location", "Exact location", "text", true), f("description", "What happened", "textarea", true), f("action", "Immediate action taken"), f("photos", "Incident photos", "photos")], true),
  extra("issue-review", "issue", "Review & Resolve Issue", [f("reference", "Issue reference", "text", true), f("status", "Status", "select", true, ["New", "Reviewed", "In Progress", "Resolved", "Closed"]), f("assigned", "Assigned to", "text"), f("action", "Action taken"), f("resolution", "Resolution notes"), f("resolved", "Resolved on", "date"), f("photos", "Resolution evidence", "photos")], true),
  extra("photo-log", "photo", "Photo Log", [f("title", "Photo title", "text", true), f("area", "Area", "text", true), f("date", "Date", "date"), f("note", "Note"), f("issue", "Related issue", "text"), f("photos", "Photo / file", "photos", true)], true),
  extra("booking", "booking", "Booking / Resource Reservation", [f("space", "Resource / space", "text", true), f("date", "Booking date", "date", true), f("start", "Start time", "time", true), f("end", "End time", "time", true), f("organiser", "Organiser", "text", true), f("participants", "Participants", "text"), f("status", "Status", "select", true, ["Requested", "Confirmed", "Cancelled"])], true),
  extra("quick-update", "update", "Quick Update / Timeline Entry", [f("title", "Update title", "text", true), f("type", "Activity type", "select", true, ["Operations", "Maintenance", "Issue", "Event", "Handover"]), f("detail", "Message / detail", "textarea", true), f("actor", "Recorded by", "text", true)], true),
 ];
}
const server: Snapshot = { data: { version: 1, forms: initialCatalogueForms(), previewVenues: [{ id: "preview-venue", name: "Venue preview" }] }, notice: "" };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
function emit() { listeners.forEach(listener => listener()); }
function read(): Snapshot {
 if (snapshot) return snapshot;
 try {
  const raw = localStorage.getItem(key);
  if (raw) {
   const data = JSON.parse(raw) as Catalogue;
   if (data.version !== 1 || !Array.isArray(data.forms) || !Array.isArray(data.previewVenues) || data.forms.some(form => !Array.isArray(form.assignments) || typeof form.standard !== "boolean" || validateTemplate(form))) throw new Error("Invalid catalogue");
   snapshot = { data, notice: "" };
  } else {
   const data = structuredClone(server.data);
   const legacyRaw = localStorage.getItem(STORAGE_KEY);
   if (legacyRaw) {
    const legacy = parsePreviewStore(JSON.parse(legacyRaw));
    for (const form of legacy.templates) {
     const existing = data.forms.find(item => item.id === form.id);
     const migrated: CatalogueForm = { ...form, standard: existing?.standard ?? false, assignments: [] };
     if (form.venue !== "All venues") {
      const venue = data.previewVenues.find(v => v.name === form.venue) || { id: "legacy-" + form.id, name: form.venue };
      if (!data.previewVenues.some(v => v.id === venue.id)) data.previewVenues.push(venue);
      migrated.standard = false; migrated.assignments = [{ venueId: venue.id, venueName: venue.name, date: "", endDate: "", event: "" }];
     }
     data.forms = existing ? data.forms.map(item => item.id === form.id ? migrated : item) : [...data.forms,migrated];
    }
   }
   snapshot = { data, notice: "" };
  }
 } catch { snapshot = { data: structuredClone(server.data), notice: "Saved catalogue could not be loaded. The standard catalogue is shown; your browser data has not been overwritten." }; }
 return snapshot;
}
function subscribe(listener: () => void) {
 listeners.add(listener);
 const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) { snapshot = null; emit(); } };
 window.addEventListener("storage", sync); return () => { listeners.delete(listener); window.removeEventListener("storage", sync); };
}
export function useCatalogue() { return useSyncExternalStore(subscribe, read, () => server); }
export function saveCatalogue(data: Catalogue) {
 let notice = "";
 try { localStorage.setItem(key, JSON.stringify(data)); }
 catch { notice = "Browser storage is unavailable or full. Changes are visible for this session but will not survive refresh."; }
 snapshot = { data, notice }; emit();
}
export function assignedForms(forms: CatalogueForm[], venueId: string, date = "", event = "") {
 return forms.filter(form => form.active && (form.standard || form.assignments.some(a => a.venueId === venueId && (!a.date || !date || (date >= a.date && date <= (a.endDate || a.date))) && (!a.event || !event || a.event === event))));
}
