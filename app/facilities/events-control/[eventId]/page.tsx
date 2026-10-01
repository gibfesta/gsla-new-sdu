"use client";

// Event record design preview: original layout, with browser-saved edits.

import { useState } from "react";
import Link from "next/link";
import { useEventRecords } from "@/lib/eventPageStore";
import WorkflowAttachments from "@/components/facilities/WorkflowAttachments";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  ClipboardList,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Package,
  UserCheck,
  Stamp,
  Wrench,
  DoorOpen,
  Archive,
  Pencil,
  type LucideIcon,
} from "lucide-react";

type DocStatus = "Pending" | "Approved" | "Rejected";
type ApprovalState = "Pending" | "Approved" | "Not required";
type Status = "Draft" | "Submitted" | "Approved" | "Completed" | "Cancelled";
type Category = "Concert" | "Stand-up" | "Community" | "Cultural" | "Other";

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function statusPill(s: Status) {
  switch (s) {
    case "Approved":
      return <Pill className="bg-emerald-600 text-white">Approved</Pill>;
    case "Submitted":
      return <Pill className="bg-amber-500 text-white">Submitted</Pill>;
    case "Draft":
      return <Pill className="bg-slate-100 text-slate-700">Draft</Pill>;
    case "Completed":
      return <Pill className="bg-slate-900 text-white">Completed</Pill>;
    case "Cancelled":
      return <Pill className="bg-rose-600 text-white">Cancelled</Pill>;
    default:
      return <Pill className="bg-slate-100 text-slate-700">{s}</Pill>;
  }
}

function categoryPill(c: Category) {
  switch (c) {
    case "Concert":
      return <Pill className="bg-indigo-50 text-indigo-700">Concert</Pill>;
    case "Stand-up":
      return <Pill className="bg-fuchsia-50 text-fuchsia-700">Stand-up</Pill>;
    case "Community":
      return <Pill className="bg-sky-50 text-sky-700">Community</Pill>;
    case "Cultural":
      return <Pill className="bg-teal-50 text-teal-700">Cultural</Pill>;
    default:
      return <Pill className="bg-slate-100 text-slate-700">Other</Pill>;
  }
}

function docPill(s: DocStatus) {
  switch (s) {
    case "Approved":
      return <Pill className="bg-emerald-600 text-white">Approved</Pill>;
    case "Pending":
      return <Pill className="bg-amber-500 text-white">Pending</Pill>;
    case "Rejected":
      return <Pill className="bg-rose-600 text-white">Rejected</Pill>;
  }
}

function approvalPill(s: ApprovalState) {
  switch (s) {
    case "Approved":
      return <Pill className="bg-emerald-600 text-white">Approved</Pill>;
    case "Pending":
      return <Pill className="bg-amber-500 text-white">Pending</Pill>;
    case "Not required":
      return <Pill className="bg-slate-100 text-slate-700">Not required</Pill>;
  }
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  right,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-5 w-5 text-slate-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function KeyValueRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-500" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function AdminEventProfilePage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId ?? "unknown";

  const { records, ready } = useEventRecords();
  const event = records.find(item => item.id === eventId);

  const [view, setView] = useState<"Overview" | "Docs" | "Logistics" | "Review">("Overview");

  if (!ready) return <p role="status" className="p-6">Loading event…</p>;
  if (!event) return <div className="p-6"><h1 className="text-xl font-bold">Event not found</h1><Link href="/facilities/events-control">Back to Events Control</Link></div>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => router.push("/facilities/events-control")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events Control
          </button>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#155ca7]">Facilities Department · Event record</p>
          <h1 className="mt-2 truncate text-4xl font-extrabold text-[#0C2F57]">{event.name}</h1>

          <p className="mt-2 max-w-3xl text-slate-600">{event.quickNotes}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categoryPill(event.category)}
            {statusPill(event.status)}
            <Pill className="bg-slate-100 text-slate-700">ID: {event.id}</Pill>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label="Event management actions not connected">
          <Link href={`/facilities/events-control/${event.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-[#b8d4f5] bg-white px-4 py-2 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><Pencil size={16} aria-hidden="true" />Edit Event</Link>
          <Link href={`/facilities/events-control/${event.id}/archive`} className="inline-flex items-center gap-2 rounded-xl border border-[#b8d4f5] bg-white px-4 py-2 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><Archive size={16} aria-hidden="true" />Archive Event</Link>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
            title="Messaging is not connected"
          >
            <span className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message organiser
            </span>
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
            title="Approval is not connected"
          >
            <span className="inline-flex items-center gap-2">
              <Stamp className="h-4 w-4" />
              Approve event
            </span>
          </button>
        </div>
      </div>
      <p className="mt-4 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm text-[#35557f]">Event design preview · edits save in this browser. Messaging, shared records and live approval permissions will be connected later.</p>

      {/* Top summary row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Event window</p>
                <p className="mt-1 text-sm text-slate-600">{event.venueImpact.eventWindow}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Venue</p>
                <p className="mt-1 text-sm text-slate-600">{event.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Organiser</p>
                <p className="mt-1 text-sm text-slate-600">{event.organiser}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Lead: {event.leadOrganiser.name} • {event.leadOrganiser.email} • {event.leadOrganiser.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Venue blocked</p>
                <p className="mt-1 text-sm text-slate-600">{event.venueImpact.venueBlocked}</p>
                <p className="mt-1 text-xs text-slate-500">Prep start → dismantle complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View switch */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["Overview", "Docs", "Logistics", "Review"] as const).map((x) => (
          <button
            key={x}
            onClick={() => setView(x)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              view === x
                ? "bg-[#0C2F57] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {x}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {view === "Overview" && (
            <>
              <Card>
                <CardContent className="p-5">
                  <SectionTitle
                    icon={Wrench}
                    title="Venue Impact"
                    subtitle="Track true facility downtime so scheduling avoids clashes."
                    right={
                      <Pill className="bg-slate-100 text-slate-700">
                        Blocked: {event.venueImpact.venueBlocked}
                      </Pill>
                    }
                  />

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <KeyValueRow icon={Wrench} label="Prep start" value={event.venueImpact.prepStart} />
                    <KeyValueRow icon={DoorOpen} label="Doors open" value={event.venueImpact.doorsOpen} />
                    <KeyValueRow icon={CalendarDays} label="Event window" value={event.venueImpact.eventWindow} />
                    <KeyValueRow icon={Package} label="Dismantle complete" value={event.venueImpact.dismantleComplete} />
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Why this matters:</span> venue availability is impacted long before
                      guests arrive — and continues after the event ends. Capturing this window makes planning more
                      predictable and helps avoid double-booking.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <SectionTitle
                    icon={ClipboardList}
                    title="Timeline"
                    subtitle="Key actions and changes for review and audit trail."
                  />
                  <div className="mt-4 space-y-3">
                    {event.timeline.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3"
                      >
                        <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div className="min-w-0">
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold">{t.by}:</span> {t.text}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{t.at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <SectionTitle
                    icon={ShieldCheck}
                    title="Approvals"
                    subtitle="Track sign-off per area (safeguarding, facilities/venue, equipment, final)."
                  />
                  <div className="mt-4 space-y-3">
                    {event.approvals.map((a, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{a.area}</p>
                          <p className="text-xs text-slate-500">
                            By: {a.by} • Date: {a.at}
                          </p>
                        </div>
                        <div className="shrink-0">{approvalPill(a.state)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {view === "Docs" && (
            <Card>
              <CardContent className="p-5">
                <SectionTitle
                  icon={FileText}
                  title="Plans & Documentation"
                  subtitle="Uploads and review status. Later: real file uploads + permissions."
                />
                <div className="mt-4 space-y-3">
                  {event.documents.map((d, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{d.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Owner: {d.owner} • Updated: {d.updated}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">{d.notes}</p>
                        </div>
                        <div className="shrink-0">{docPill(d.status)}</div>
                      </div>

                      <WorkflowAttachments label="Document files" value={d.files} readOnly/>
                      {d.comments && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">Comments: {d.comments}</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button" disabled
                          className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
                          title="File preview is not connected"
                        >
                          View file
                        </button>
                        <button
                          type="button" disabled
                          className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
                          title="Comments are not connected"
                        >
                          Add comment
                        </button>
                        <button
                          type="button" disabled
                          className="cursor-not-allowed rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500"
                          title="Approval is not connected"
                        >
                          Approve
                        </button>
                        <button
                          type="button" disabled
                          className="cursor-not-allowed rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500"
                          title="Rejection is not connected"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {view === "Logistics" && (
            <>
              <Card>
                <CardContent className="p-5">
                  <SectionTitle
                    icon={Package}
                    title="Equipment & Resources"
                    subtitle="Requested items, quantities, provider, and approval state."
                  />
                  <div className="mt-4 space-y-3">
                    {event.equipment.map((x, i) => (
                      <div key={i} className="rounded-xl border border-slate-100 p-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {x.item} <span className="text-slate-500">× {x.qty}</span>
                            </p>
                            <p className="mt-1 text-xs text-slate-500">Provided by: {x.providedBy}</p>
                            <p className="mt-2 text-sm text-slate-600">{x.notes}</p>
                          </div>
                          <div className="shrink-0">{approvalPill(x.state)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <SectionTitle
                    icon={UserCheck}
                    title="Staffing & Roles"
                    subtitle="Capture responsibilities so setup is repeatable next time."
                  />
                  <div className="mt-4 space-y-3">
                    {event.staffing.map((s, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{s.role}</p>
                          <p className="mt-1 text-sm text-slate-600">{s.name}</p>
                        </div>
                        <Pill className="bg-slate-100 text-slate-700">{s.status}</Pill>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {view === "Review" && (
            <Card>
              <CardContent className="p-5">
                <SectionTitle
                  icon={CheckCircle2}
                  title="Post-Event Review"
                  subtitle="Record learnings so future events can reuse what works."
                />

                {!event.postEvent.available ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">
                      No post-event review recorded yet (demo). This becomes available after completion.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {[
                      ["What worked well", event.postEvent.whatWorked],
                      ["What didn’t work", event.postEvent.whatDidnt],
                      ["Issues encountered", event.postEvent.issues],
                      ["Recommendations next time", event.postEvent.recommendations],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-xl border border-slate-100 p-4">
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="mt-2 text-sm text-slate-600">{body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <SectionTitle
                icon={AlertTriangle}
                title="Internal Notes"
                subtitle="GSLA-only notes (not visible to organisers)."
              />

              <div className="mt-4 space-y-3">
                {event.internalNotes.map((n, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="text-xs font-semibold text-slate-700">
                      {n.by} • <span className="font-normal text-slate-500">{n.at}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{n.text}</p>
                  </div>
                ))}
              </div>

              <button
                type="button" disabled
                className="mt-4 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
                title="Internal notes are not connected"
              >
                Add internal note
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <SectionTitle
                icon={ShieldCheck}
                title="Repeatability"
                subtitle="Later: one-click “Duplicate event” using saved learnings + equipment."
              />

              <div className="mt-4 rounded-xl border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-900">Suggested next step</p>
                <p className="mt-1 text-sm text-slate-600">
                  After the event, capture what worked and what didn’t — it saves huge time next time.
                </p>
              </div>

              <button
                type="button" disabled
                className="mt-3 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
                title="Duplicating events is not connected"
              >
                Duplicate this event
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
