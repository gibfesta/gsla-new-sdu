"use client";

/**
 * -------------------------------------------------------------------------------------
 * PAGE: Admin — Community Event Profile (Operations Record)
 * Route: /admin/events/[eventId]
 *
 * Purpose:
 * - Single “source of truth” for a community event (concerts, stand-up, cultural/community use).
 * - Replace email threads with a structured, auditable record:
 *   - plans/docs, logistics, approvals, notes, post-event review.
 * - Track venue downtime properly:
 *   - “Prep start” through “Dismantle complete” = true facility impact.
 *
 * What this is (today):
 * - Static/seed data keyed off the URL param (eventId).
 * - UI-only placeholders for actions (no backend).
 *
 * Where to wire real data later:
 * - Replace `useMemo` seed object with API/DB fetch by eventId.
 * - Convert labels into timestamps:
 *   - prepStart, doorsOpen, eventStart, eventEnd, dismantleComplete
 * - Compute venueBlocked duration from timestamps.
 *
 * Rule:
 * - Demo-only. No backend wiring yet.
 * -------------------------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
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
  icon: any;
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
  icon: any;
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

  const event = useMemo(() => {
    // These IDs match the list page seed exactly:
    // - evt-101: Stand-up
    // - evt-102: Concert
    // - evt-103: Community market
    // - evt-104: Cultural completed event
    const isStandUp = eventId === "evt-101";
    const isConcert = eventId === "evt-102";
    const isMarket = eventId === "evt-103";
    const isCultural = eventId === "evt-104";

    const status: Status = isCultural ? "Completed" : isConcert ? "Approved" : isMarket ? "Draft" : "Submitted";
    const category: Category = isConcert ? "Concert" : isStandUp ? "Stand-up" : isCultural ? "Cultural" : "Community";

    return {
      id: eventId,
      name: isStandUp
        ? "Friday Night Stand-Up Showcase"
        : isConcert
          ? "Community Winter Concert"
          : isCultural
            ? "Cultural Evening: Dance & Food"
            : "Local Makers Market",
      category,
      organiser: isStandUp
        ? "Community Arts Collective"
        : isConcert
          ? "Gibraltar Music Group"
          : isCultural
            ? "Cultural Exchange Network"
            : "Neighbourhood Partnership",
      leadOrganiser: {
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        phone: "+350 55555",
      },
      location: isMarket
        ? "Europa Sports Complex • Outdoor Area"
        : "Europa Sports Complex • Main Hall",
      status,
      quickNotes:
        "Operations record capturing plans, approvals, logistics, and learnings — so repeat events become easier, faster, and more predictable.",

      venueImpact: {
        prepStart: isConcert
          ? "Sat 24 Jan 2026 • 10:00"
          : isStandUp
            ? "Fri 16 Jan 2026 • 14:00"
            : isCultural
              ? "Sat 06 Dec 2025 • 12:00"
              : "Sun 01 Feb 2026 • 07:00",
        doorsOpen: isConcert
          ? "Sat 24 Jan 2026 • 18:30"
          : isStandUp
            ? "Fri 16 Jan 2026 • 19:00"
            : isCultural
              ? "Sat 06 Dec 2025 • 17:30"
              : "Sun 01 Feb 2026 • 09:30",
        eventWindow: isConcert
          ? "Sat 24 Jan 2026 • 19:30–22:00"
          : isStandUp
            ? "Fri 16 Jan 2026 • 20:00–22:15"
            : isCultural
              ? "Sat 06 Dec 2025 • 18:00–23:00"
              : "Sun 01 Feb 2026 • 10:00–15:00",
        dismantleComplete: isConcert
          ? "Sun 25 Jan 2026 • 02:00"
          : isStandUp
            ? "Sat 17 Jan 2026 • 00:30"
            : isCultural
              ? "Sun 07 Dec 2025 • 01:00"
              : "Sun 01 Feb 2026 • 18:00",
        venueBlocked: isConcert
          ? "16h (prep → dismantle)"
          : isStandUp
            ? "10h 30m (prep → dismantle)"
            : isCultural
              ? "13h (prep → dismantle)"
              : "11h (prep → dismantle)",
      },

      timeline: [
        { at: "2025-12-01 09:12", by: "Organiser", text: "Event record created (Draft)." },
        { at: "2025-12-03 16:30", by: "Organiser", text: "Risk assessment uploaded." },
        { at: "2025-12-05 10:05", by: "Organiser", text: "Equipment request submitted." },
        { at: "2025-12-06 14:20", by: "GSLA", text: "Requested clarification on venue layout / access." },
        { at: "2025-12-07 09:40", by: "Organiser", text: "Updated site map uploaded." },
        { at: "2025-12-08 15:10", by: "GSLA", text: "Safeguarding approval granted." },
      ],

      documents: [
        { name: "Event Plan / Schedule", owner: "Organiser", updated: "2025-12-02", status: (isMarket ? "Pending" : "Pending") as DocStatus, notes: "Draft schedule included." },
        { name: "Risk Assessment", owner: "Organiser", updated: "2025-12-03", status: (isConcert || isCultural ? "Approved" : "Pending") as DocStatus, notes: "Baseline covered; confirm crowd flow." },
        { name: "Safeguarding Plan", owner: "Organiser", updated: "2025-12-04", status: (isConcert || isCultural ? "Approved" : "Pending") as DocStatus, notes: "Named safeguarding lead / procedures." },
        { name: "Emergency Procedures", owner: "Organiser", updated: "2025-12-04", status: "Pending" as DocStatus, notes: "Add ambulance access point + steward brief." },
        { name: "Venue Layout / Site Map", owner: "Organiser", updated: "2025-12-07", status: "Pending" as DocStatus, notes: "Updated after GSLA feedback." },
      ],

      equipment: [
        { item: "Stage / risers", qty: isMarket ? 0 : 1, providedBy: "External", state: isMarket ? "Not required" as ApprovalState : "Pending" as ApprovalState, notes: isMarket ? "Not needed for market stalls." : "Confirm supplier + delivery window." },
        { item: "PA system", qty: isMarket ? 0 : 1, providedBy: "GSLA", state: isConcert ? "Approved" as ApprovalState : isCultural ? "Approved" as ApprovalState : isMarket ? "Not required" as ApprovalState : "Pending" as ApprovalState, notes: isMarket ? "Not required." : "May require booking (avoid clashes)." },
        { item: "Tables / stalls", qty: isMarket ? 30 : 0, providedBy: "Organiser", state: isMarket ? "Pending" as ApprovalState : "Not required" as ApprovalState, notes: isMarket ? "Confirm count + delivery timing." : "N/A." },
        { item: "Barriers / crowd control", qty: isMarket ? 10 : 20, providedBy: "GSLA", state: "Pending" as ApprovalState, notes: "Confirm required count based on layout." },
      ],

      staffing: [
        { role: "Event Lead", name: "Alex Morgan", status: "Confirmed" },
        { role: "Venue Liaison", name: "GSLA Duty Manager (TBC)", status: "Pending" },
        { role: "Safeguarding Officer", name: "TBC", status: isCultural ? "Confirmed" : "Pending" },
        { role: "First Aid Cover", name: "Jordan Lee", status: isConcert || isCultural ? "Confirmed" : "Pending" },
        { role: "Setup / Teardown", name: "Volunteer team", status: isCultural ? "Confirmed" : "Pending" },
      ],

      approvals: [
        { area: "Safeguarding", state: (isConcert || isCultural) ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: (isConcert || isCultural) ? "GSLA" : "—", at: (isConcert || isCultural) ? "2025-12-08" : "—" },
        { area: "Facilities / Venue", state: isConcert ? "Approved" as ApprovalState : isCultural ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: (isConcert || isCultural) ? "GSLA" : "—", at: (isConcert || isCultural) ? "2025-12-09" : "—" },
        { area: "Equipment", state: "Pending" as ApprovalState, by: "—", at: "—" },
        { area: "Final Sign-off", state: isCultural ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: isCultural ? "GSLA" : "—", at: isCultural ? "2025-12-10" : "—" },
      ],

      postEvent: {
        available: isCultural,
        whatWorked: "Clear steward roles + simple venue layout. Setup checklist reduced last-minute issues.",
        whatDidnt: "PA placement caused feedback; reposition speakers and keep mics away from monitors.",
        issues: "Minor schedule slip; build 10-minute buffers between segments.",
        recommendations: "Reuse the same layout next time; add signage for registration and water point.",
      },

      internalNotes: [
        { by: "GSLA", at: "2025-12-06 14:20", text: "Need updated layout showing audience flow + emergency access routes." },
        { by: "GSLA", at: "2025-12-08 15:10", text: "Safeguarding approved. Venue confirmation pending capacity and steward plan." },
      ],
    };
  }, [eventId]);

  const [view, setView] = useState<"Overview" | "Docs" | "Logistics" | "Review">("Overview");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community Events
          </button>

          <h1 className="mt-3 truncate text-4xl font-extrabold text-[#0C2F57]">{event.name}</h1>

          <p className="mt-2 max-w-3xl text-slate-600">{event.quickNotes}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categoryPill(event.category)}
            {statusPill(event.status)}
            <Pill className="bg-slate-100 text-slate-700">ID: {event.id}</Pill>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            title="Placeholder (wire comment / message later)"
          >
            <span className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message organiser (placeholder)
            </span>
          </button>

          <button
            className="rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            title="Placeholder (wire approve flow later)"
          >
            <span className="inline-flex items-center gap-2">
              <Stamp className="h-4 w-4" />
              Quick approve (placeholder)
            </span>
          </button>
        </div>
      </div>

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
                  Lead: {event.leadOrganiser.name} • {event.leadOrganiser.email}
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

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          title="Placeholder (wire file preview later)"
                        >
                          View (placeholder)
                        </button>
                        <button
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          title="Placeholder (wire reviewer comment later)"
                        >
                          Add comment (placeholder)
                        </button>
                        <button
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          title="Placeholder (wire approve later)"
                        >
                          Approve (placeholder)
                        </button>
                        <button
                          className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          title="Placeholder (wire reject later)"
                        >
                          Reject (placeholder)
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
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                title="Placeholder (wire add-note later)"
              >
                Add internal note (placeholder)
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
                className="mt-3 w-full rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                title="Placeholder (wire duplicate later)"
              >
                Duplicate this event (placeholder)
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
