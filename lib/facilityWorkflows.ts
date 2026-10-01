export const WORKFLOW_KINDS = ["maintenance", "opening", "closing", "afternoon", "night", "compliance", "sop", "issue", "work-order", "booking", "photo", "update"] as const;
export type WorkflowKind = typeof WORKFLOW_KINDS[number];
export const FORM_SECTIONS = ["daily-operations", "maintenance-issues", "compliance", "procedures-sop", "events", "bookings"] as const;
export type FormSection = typeof FORM_SECTIONS[number];
export const FORM_SECTION_LABELS: Record<FormSection, string> = { "daily-operations": "Daily Operations", "maintenance-issues": "Maintenance & Issues", compliance: "Compliance", "procedures-sop": "Procedures & SOPs", events: "Events", bookings: "Bookings & Resources" };
export function formSection(form: { kind: WorkflowKind; section?: FormSection }): FormSection {
  if (form.section && FORM_SECTIONS.includes(form.section)) return form.section;
  switch (form.kind) {
    case "maintenance": case "issue": case "work-order": case "photo": return "maintenance-issues";
    case "compliance": return "compliance";
    case "sop": return "procedures-sop";
    case "booking": return "bookings";
    default: return "daily-operations";
  }
}
export const KIND_LABELS: Record<WorkflowKind, string> = { maintenance: "Maintenance procedure", opening: "Daily opening", closing: "Daily closing", afternoon: "Afternoon handover", night: "Night handover", compliance: "Compliance check", sop: "Procedure / SOP", issue: "Issue report", "work-order": "Work order", booking: "Booking", photo: "Photo log", update: "Operational update" };
export const FIELD_TYPES = ["checkbox", "text", "textarea", "select", "date", "time", "photos", "file"] as const;
export type FormField = { id: string; label: string; type: typeof FIELD_TYPES[number]; required: boolean; help: string; options: string[] };
export type WorkflowTemplate = { id: string; kind: WorkflowKind; section?: FormSection; title: string; instructions: string; category: string; frequency: string; venue: string; owner: string; version: number; reviewDate: string; dueDate: string; active: boolean; fields: FormField[]; source: string; documents?: Attachment[] };
export type PreviewRole = "Head of Facilities" | "FM 1" | "FM 2" | "FM 3" | "Centre Manager";
export const PREVIEW_ROLES: PreviewRole[] = ["Head of Facilities", "FM 1", "FM 2", "FM 3", "Centre Manager"];
export type Attachment = { id: string; name: string; type: string; data: string };
export type Answer = string | boolean | Attachment[];
export type PreviewRecord = { id: string; template: WorkflowTemplate; venue: string; date: string; time: string; shift: string; actor: string; role: PreviewRole; recipient: string; answers: Record<string, Answer>; status: "New" | "Reviewed" | "In Progress" | "Resolved" | "Closed"; assignedTo: string; targetDate: string; action: string; resolution: string; resolvedOn: string; reviewPhotos: Attachment[] };
export type PreviewStore = { version: 1; templates: WorkflowTemplate[]; records: PreviewRecord[] };
export const STORAGE_KEY = "gsla-facilities-form-design-v1";
export const canManage = (role: PreviewRole) => role !== "Centre Manager";
function field(id: string, label: string, type: FormField["type"] = "textarea", required = false, options: string[] = []): FormField {
  return { id, label, type, required, help: "", options };
}
function template(id: string, kind: WorkflowKind, title: string, fields: FormField[], frequency = "Daily", category = ""): WorkflowTemplate {
  return { id, kind, title, fields, frequency, category, instructions: "Complete the checks and record any exceptions or actions required.", venue: "All venues", owner: "Facilities management", version: 1, reviewDate: "", dueDate: "", active: true, source: "Design example based on the previous venue layout" };
}
const handoverFields = () => [
  field("summary", "Shift summary", "textarea", true), field("risks", "Risks / concerns"),
  field("actions", "Actions required"), field("message", "Manager message / notes"),
  field("acknowledge", "Information passed to the incoming shift", "checkbox"),
];
export function initialWorkflowTemplates(): WorkflowTemplate[] {
  return [
    template("opening", "opening", "Daily Opening", [
      ...["Unlock perimeter access points and main gate.", "Check pitch, spectator zone, toilets, and changing rooms for safety.", "Turn on essential systems and confirm lighting where needed.", "Confirm scheduled bookings/events for the day.", "Log any defects or urgent concerns before public access."].map((label, i) => field("open-" + i, label, "checkbox")),
      field("outcome", "Opening outcome", "select", true, ["Ready to open", "Issues found / access restricted", "Venue remains closed"]),
      field("exceptions", "Exceptions / defects / actions required"),
    ]),
    template("closing", "closing", "Daily Closing", [
      ...["Confirm all users have exited the facility.", "Check toilets, changing rooms, spectator areas, and pitch surroundings.", "Turn off lighting and non-essential systems.", "Secure all gates, doors, and storage areas.", "Log any incidents, maintenance issues, or unusual activity."].map((label, i) => field("close-" + i, label, "checkbox")),
      field("outcome", "Closing outcome", "select", true, ["Secured", "Issues found / follow-up required"]),
      field("exceptions", "Incidents / exceptions / follow-up"),
    ]),
    template("afternoon", "afternoon", "Afternoon Handover", handoverFields()),
    template("night", "night", "Night Handover", handoverFields()),
    template("maintenance", "maintenance", "Weekly Maintenance Inspection", [
      field("lighting", "Inspect lighting and external access points", "checkbox"),
      field("rooms", "Review toilet and changing room condition log", "checkbox"),
      field("barriers", "Check signage, barriers and spectator safety zones", "checkbox"),
      field("summarySent", "Submit weekly facility summary to Facilities Manager", "checkbox"),
      field("asset", "Asset / exact location", "text", true),
      field("owner", "Task / work owner", "text"), field("due", "Task / work due date", "date"),
      field("work", "Work required / defects found"), field("linked", "Linked issue reference", "text"),
      field("priority", "Priority", "select", true, ["Low", "Medium", "High", "Urgent"]),
      field("status", "Work status", "select", true, ["Due", "In Progress", "Done", "Scheduled"]),
      field("notes", "Work completed / completion notes"), field("completed", "Completion date", "date"),
      field("evidence", "Evidence photos", "photos"),
    ], "Weekly", "Routine maintenance"),
    template("monthly", "maintenance", "Monthly Maintenance Review", [
      field("meeting", "Full maintenance review meeting held", "checkbox"),
      field("walkaround", "Monthly compliance and safety walkaround completed", "checkbox"),
      field("trends", "Recurring issues and escalation trends reviewed", "checkbox"),
      field("summary", "Monthly facility summary", "textarea", true),
      field("actions", "Actions / work required"), field("owner", "Action owner", "text"),
      field("due", "Action due date", "date"), field("photos", "Evidence photos", "photos"),
    ], "Monthly"),
    ...[["fire", "Fire extinguisher inspection", "Fire Safety"], ["first-aid", "First aid kit stock check", "First Aid"], ["site", "Monthly site safety walkaround", "Site Safety"], ["signage", "H&S signage verification", "Health & Safety"]].map(([id, title, category]) => template(id, "compliance", title, [
      field("checked", "Check carried out", "checkbox"), field("location", "Area / exact location", "text", true),
      field("result", "Check result", "select", true, ["Pass", "Fail / action required", "Not applicable"]),
      field("notes", "Findings / result notes"), field("actions", "Follow-up action required"),
      field("owner", "Follow-up owner", "text"), field("deadline", "Follow-up deadline", "date"),
      field("expiry", "Certificate / inspection expiry date", "date"), field("photos", "Evidence photos", "photos"), field("document", "Certificate / evidence document", "file"),
    ], id === "site" ? "Monthly" : "As scheduled", category)),
    template("sop", "sop", "Pitch Access & Safety Procedure", [
      field("read", "Instructions read and understood", "checkbox", true),
      field("access", "Access routes and spectator safety zones checked", "checkbox"),
      field("exceptions", "Exceptions / observations"), field("actions", "Actions required"), field("evidence", "Evidence photos", "photos"),
    ], "As required", "SOP"),
    template("issue", "issue", "Report an Issue", [
      field("title", "Issue title", "text", true),
      field("category", "Issue category", "select", true, ["Maintenance", "Safety", "Security", "Cleaning", "Equipment", "Other"]),
      field("location", "Exact location / asset", "text", true),
      field("description", "Description / what happened", "textarea", true),
      field("priority", "Priority", "select", true, ["Low", "Medium", "High", "Urgent"]),
      field("safe", "Immediate action taken / safety precautions"),
      field("photos", "Issue photos", "photos"),
    ], "As required", "Issue reporting"),
  ];
}
export function validateTemplate(value: WorkflowTemplate): string | null {
  if (!value.title.trim() || !value.instructions.trim() || !value.venue.trim() || !value.owner.trim()) return "Provide a title, instructions, venue scope and owner.";
  if (!value.fields.length) return "Add at least one field.";
  if (value.kind === "issue" && !value.fields.some(f => f.type === "photos")) return "Issue report templates need a photo attachment field.";
  const ids = new Set<string>();
  for (const f of value.fields) {
    if (ids.has(f.id)) return "Each field must have its own identifier.";
    ids.add(f.id);
    if (!f.label.trim()) return "Every field needs a label.";
    if (f.type === "select" && (!f.options.length || f.options.some(option => !option.trim()) || new Set(f.options).size !== f.options.length)) return "Choice fields need unique, non-empty options.";
  }
  return null;
}
export function validateCompletion(template: WorkflowTemplate, answers: Record<string, Answer>): string | null {
  for (const f of template.fields) {
    const a = answers[f.id];
    if (f.required && (a === undefined || a === false || a === "" || (Array.isArray(a) && !a.length) || (typeof a === "string" && !a.trim()))) return f.label + " is required.";
    if (a !== undefined && f.type === "select" && a !== "" && (typeof a !== "string" || !f.options.includes(a))) return "Choose a valid option for " + f.label + ".";
  }
  return null;
}
export function parsePreviewStore(value: unknown): PreviewStore {
  const data = value as PreviewStore;
  if (!data || data.version !== 1 || !Array.isArray(data.templates) || !Array.isArray(data.records)) throw new Error("Unrecognised preview data.");
  for (const t of data.templates) {
    if (!t || !WORKFLOW_KINDS.includes(t.kind) || !Array.isArray(t.fields) || t.fields.some(f => !FIELD_TYPES.includes(f.type)) || validateTemplate(t)) throw new Error("Invalid saved template.");
  }
  for (const r of data.records) if (!r?.template || !Array.isArray(r.template.fields) || !r.answers || typeof r.venue !== "string") throw new Error("Invalid saved preview.");
  return data;
}
