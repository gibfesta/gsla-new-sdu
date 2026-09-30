import Link from "next/link";
import { ClipboardList, Wrench, ShieldCheck, CalendarDays, FileText, Camera, Clock3, type LucideIcon } from "lucide-react";

export type FacilityFormSection = "issues" | "maintenance" | "handover" | "procedures" | "weekly" | "monthly" | "compliance" | "documents" | "photos" | "bookings" | "timeline" | "audit";

type FormCard = { title: string; purpose: string; fields: string[]; icon: LucideIcon };

const cards: Record<FacilityFormSection, FormCard[]> = {
  issues: [
    { title: "Report New Issue", purpose: "Capture what happened and where.", icon: ClipboardList, fields: ["Issue title", "Category", "Description", "Location / area", "Priority", "Reported by", "Reported on", "Photos"] },
    { title: "Review & Resolve Issue", purpose: "Track ownership and outcome.", icon: Wrench, fields: ["Issue reference", "Status", "Assigned to", "Action taken", "Resolution notes", "Resolved on"] },
  ],
  maintenance: [
    { title: "Maintenance Request", purpose: "Turn an issue or inspection finding into work.", icon: Wrench, fields: ["Facility", "Asset / location", "Linked issue", "Work required", "Priority", "Requested by", "Requested on"] },
    { title: "Maintenance Update", purpose: "Record progress and completion.", icon: ClipboardList, fields: ["Work order", "Assigned to", "Status", "Target date", "Work completed", "Completion date", "Evidence / photos"] },
  ],
  handover: [
    { title: "Afternoon Handover", purpose: "Pass operational information to the afternoon shift.", icon: ClipboardList, fields: ["Facility", "Date & shift", "Shift summary", "Risks / concerns", "Actions required", "Manager message / notes", "Submitted by"] },
    { title: "Night Handover", purpose: "Pass operational information to the night shift.", icon: ClipboardList, fields: ["Facility", "Date & shift", "Shift summary", "Risks / concerns", "Actions required", "Manager message / notes", "Submitted by"] },
    { title: "Quick Update", purpose: "Record an update for the venue timeline.", icon: Clock3, fields: ["Date & time", "Update type", "Message", "Recorded by"] },
  ],
  procedures: [
    { title: "Opening Checklist", purpose: "Record completed opening checks and exceptions.", icon: ClipboardList, fields: ["Facility", "Date & time", "Checklist items", "Exceptions", "Completed by"] },
    { title: "Closing Checklist", purpose: "Record the closing checks and handover.", icon: ClipboardList, fields: ["Facility", "Date & time", "Checklist items", "Exceptions", "Completed by"] },
  ],
  weekly: [{ title: "Weekly Task", purpose: "Assign and complete recurring work.", icon: ClipboardList, fields: ["Task", "Owner", "Due date", "Status", "Completion notes"] }],
  monthly: [{ title: "Monthly Task", purpose: "Assign and complete monthly reviews.", icon: ClipboardList, fields: ["Task", "Owner", "Due date", "Status", "Completion notes"] }],
  compliance: [
    { title: "Compliance Check", purpose: "Track inspections and evidence.", icon: ShieldCheck, fields: ["Check title", "Category / area", "Due date", "Owner", "Status", "Result", "Evidence / document"] },
    { title: "Follow-up Action", purpose: "Resolve an overdue or failed check.", icon: ClipboardList, fields: ["Linked check", "Action required", "Owner", "Deadline", "Completion evidence"] },
  ],
  documents: [{ title: "Document / SOP", purpose: "Store an approved file and its version.", icon: FileText, fields: ["Document title", "Category", "Version", "Owner", "File", "Review date"] }],
  photos: [{ title: "Photo Log", purpose: "Document a location, issue or inspection.", icon: Camera, fields: ["Photo / file", "Title", "Area", "Date", "Note", "Related issue"] }],
  bookings: [{ title: "Booking", purpose: "Reserve a bookable facility resource.", icon: CalendarDays, fields: ["Facility", "Resource / space", "Date", "Start & end time", "Organiser", "Participants", "Status"] }],
  timeline: [{ title: "Timeline Entry", purpose: "Display dated activity from connected workflows.", icon: Clock3, fields: ["Date & time", "Activity type", "Title", "Detail", "Recorded by"] }],
  audit: [{ title: "Audit Entry", purpose: "Keep a record of who changed what.", icon: Clock3, fields: ["Date & time", "User", "Action", "Record changed", "Detail"] }],
};

export function FacilityFormBlueprint({ sections, showHeading = true }: { sections: FacilityFormSection[]; showHeading?: boolean }) {
  return <section className="space-y-4" aria-label="Forms to design">
    {showHeading && <div><h2 className="text-xl font-bold text-[#0C2F57]">Form designs</h2><p className="mt-1 text-sm text-[#60799f]">Open a form to try the design. Test completions stay in your browser.</p></div>}
    <div className="grid gap-4 md:grid-cols-2">{sections.flatMap((section) => cards[section].map((card) => <article key={`${section}-${card.title}`} className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3"><span className="rounded-xl bg-[#eaf2fc] p-2 text-[#155ca7]"><card.icon size={21} /></span><div><h3 className="font-bold text-[#0C2F57]">{card.title}</h3><p className="mt-1 text-sm text-[#60799f]">{card.purpose}</p></div></div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#526f98]">Fields to confirm</p>
      <ul className="mt-2 flex flex-wrap gap-2">{card.fields.map((field) => <li key={field} className="rounded-lg border border-[#d5e4f6] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#35557f]">{field}</li>)}</ul>
      {["issues", "maintenance", "handover", "procedures", "weekly", "monthly", "compliance", "documents"].includes(section) ? <Link className="mt-4 inline-block rounded-xl bg-[#0C2F57] px-3 py-2 text-sm font-semibold text-white" href={`/facilities/forms?tab=${section === "maintenance" ? "weekly" : section}`}>Open form designs</Link> : <p className="mt-4 text-xs text-[#60799f]">Form design reference · data entry not connected</p>}
    </article>))}</div>
    <Link href="/facilities/events-control" className="inline-block text-xs font-semibold text-[#155ca7] hover:underline">Events examples remain in Events Control</Link>
  </section>;
}
