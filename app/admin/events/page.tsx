"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal:
 * - Make Events look/feel like Facilities (master-detail layout, clearer hierarchy).
 * - Keep it demo-only (seed data, UI-only filters).
 *
 * Structure:
 * - Header (title + actions)
 * - Filters (search + status filter)
 * - Main grid:
 *   - LEFT: selectable list of events
 *   - RIGHT: selected event preview (Overview / Venue Impact)
 *
 * Where to wire real data later:
 * - Replace seed events with DB/API.
 * - Replace labels with timestamps and compute venue blocked duration.
 * - Wire “New Event” and “Quick actions” to real flows.
 *
 * Rule:
 * - UI/layout only. No backend wiring yet.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Plus,
  CalendarDays,
  MapPin,
  Clock,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Wrench,
  Package,
  Eye,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type EventStatus = "Draft" | "Submitted" | "Approved" | "Completed" | "Cancelled";
type EventCategory = "Concert" | "Stand-up" | "Community" | "Cultural" | "Other";

type EventRow = {
  id: string;
  name: string;
  category: EventCategory;
  organiser: string;

  eventWindowLabel: string;
  prepStartLabel: string;
  dismantledByLabel: string;
  venueBlockedLabel: string;

  location: string;

  status: EventStatus;
  reviewHint: string;
};

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "red" | "amber" | "emerald" | "indigo" | "cyan";
}) {
  const toneCls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : tone === "red"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : tone === "indigo"
            ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
            : tone === "cyan"
              ? "bg-cyan-50 text-cyan-700 ring-cyan-200"
              : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1", toneCls)}>
      {children}
    </span>
  );
}

function statusTone(s: EventStatus): "slate" | "amber" | "emerald" | "red" | "indigo" {
  if (s === "Approved") return "emerald";
  if (s === "Submitted") return "amber";
  if (s === "Draft") return "slate";
  if (s === "Completed") return "indigo";
  return "red";
}

function statusIcon(s: EventStatus) {
  if (s === "Approved") return CheckCircle2;
  if (s === "Submitted") return Clock;
  if (s === "Draft") return ClipboardList;
  if (s === "Completed") return ShieldCheck;
  return XCircle;
}

function categoryTone(c: EventCategory): "slate" | "indigo" | "cyan" | "amber" {
  if (c === "Concert") return "indigo";
  if (c === "Stand-up") return "cyan";
  if (c === "Cultural") return "amber";
  if (c === "Community") return "slate";
  return "slate";
}

export default function AdminEventsPage() {
  // -----------------------------------------------------------------------------------
  // SEED DATA (Replace later with DB/API)
  // -----------------------------------------------------------------------------------
  const events = useMemo<EventRow[]>(
    () => [
      {
        id: "evt-101",
        name: "Friday Night Stand-Up Showcase",
        category: "Stand-up",
        organiser: "Community Arts Collective",
        eventWindowLabel: "Fri 16 Jan 2026 • 20:00–22:15",
        prepStartLabel: "Fri 16 Jan 2026 • 14:00",
        dismantledByLabel: "Sat 17 Jan 2026 • 00:30",
        venueBlockedLabel: "10h 30m (prep → dismantle)",
        location: "Europa Sports Complex • Main Hall",
        status: "Submitted",
        reviewHint: "Stage plan pending • Sound equipment request submitted",
      },
      {
        id: "evt-102",
        name: "Community Winter Concert",
        category: "Concert",
        organiser: "Gibraltar Music Group",
        eventWindowLabel: "Sat 24 Jan 2026 • 19:30–22:00",
        prepStartLabel: "Sat 24 Jan 2026 • 10:00",
        dismantledByLabel: "Sun 25 Jan 2026 • 02:00",
        venueBlockedLabel: "16h (prep → dismantle)",
        location: "Europa Sports Complex • Main Hall",
        status: "Approved",
        reviewHint: "All docs approved • PA booked • Seating layout confirmed",
      },
      {
        id: "evt-103",
        name: "Local Makers Market",
        category: "Community",
        organiser: "Neighbourhood Partnership",
        eventWindowLabel: "Sun 01 Feb 2026 • 10:00–15:00",
        prepStartLabel: "Sun 01 Feb 2026 • 07:00",
        dismantledByLabel: "Sun 01 Feb 2026 • 18:00",
        venueBlockedLabel: "11h (prep → dismantle)",
        location: "Europa Sports Complex • Outdoor Area",
        status: "Draft",
        reviewHint: "Awaiting organiser submission (risk assessment + site layout)",
      },
      {
        id: "evt-104",
        name: "Cultural Evening: Dance & Food",
        category: "Cultural",
        organiser: "Cultural Exchange Network",
        eventWindowLabel: "Sat 06 Dec 2025 • 18:00–23:00",
        prepStartLabel: "Sat 06 Dec 2025 • 12:00",
        dismantledByLabel: "Sun 07 Dec 2025 • 01:00",
        venueBlockedLabel: "13h (prep → dismantle)",
        location: "Europa Sports Complex • Main Hall",
        status: "Completed",
        reviewHint: "Post-event review available (learnings recorded)",
      },
    ],
    []
  );

  // -----------------------------------------------------------------------------------
  // UI-ONLY FILTERS (No backend yet)
  // -----------------------------------------------------------------------------------
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "All">("All");

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => {
        const matchesQ =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.organiser.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "All" || e.status === statusFilter;
        return matchesQ && matchesStatus;
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [events, search, statusFilter]);

  // -----------------------------------------------------------------------------------
  // MASTER-DETAIL SELECTION (UI-only)
  // -----------------------------------------------------------------------------------
  const [selectedEventId, setSelectedEventId] = useState<string>(() => "evt-101");
  const selectedEvent =
    filteredEvents.find((e) => e.id === selectedEventId) ||
    events.find((e) => e.id === selectedEventId) ||
    null;

  const statuses: Array<EventStatus> = ["Draft", "Submitted", "Approved", "Completed", "Cancelled"];

  return (
    <div>
      {/* PAGE TITLE (Profile/Calendar style) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Community Events</h1>
          <p className="mt-2 text-slate-600">
            Operations records for cultural/community venue use — designed to capture what worked, what didn’t, and
            the real venue downtime from prep to dismantle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="indigo">
            <Clock size={14} />
            Demo
          </Pill>

          <button
            onClick={() => alert("Demo: Create Event flow can be added next (modal + fields).")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <Plus size={16} />
            New Community Event
          </button>
        </div>
      </div>

      {/* FILTERS (Facilities-style row) */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search event, organiser, category, venue..."
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Filter size={16} className="text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as EventStatus | "All")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option value="All">All statuses</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <ClipboardList size={16} className="text-slate-500" />
                <span>
                  Showing <span className="font-semibold">{filteredEvents.length}</span> events
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN GRID (Facilities-style master-detail) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT LIST */}
        <Card className="lg:col-span-5">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Events</div>
                <div className="mt-1 text-xs text-slate-600">
                  {filteredEvents.length} shown • {events.length} total
                </div>
              </div>
              <Pill tone="slate">
                <Eye size={14} />
                List
              </Pill>
            </div>

            <div className="max-h-[70vh] overflow-auto p-2">
              {filteredEvents.map((e) => {
                const active = e.id === selectedEventId;
                const Icon = statusIcon(e.status);

                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEventId(e.id)}
                    className={classNames(
                      "w-full rounded-xl border p-4 text-left transition",
                      active ? "border-[#0C2F57] bg-[#0C2F57]/5" : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{e.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            {e.location}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill tone={statusTone(e.status)}>
                            <Icon size={14} />
                            {e.status}
                          </Pill>
                          <Pill tone={categoryTone(e.category)}>{e.category}</Pill>
                          <Pill tone="slate">
                            <Wrench size={14} />
                            {e.venueBlockedLabel}
                          </Pill>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-semibold text-slate-500">{e.id}</span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-600">Next review</div>
                      <div className="mt-1 text-xs text-slate-700">{e.reviewHint}</div>
                    </div>
                  </button>
                );
              })}

              {!filteredEvents.length ? (
                <div className="p-8 text-center text-sm text-slate-600">No events match your filters.</div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT DETAIL */}
        <Card className="lg:col-span-7">
          <CardContent className="p-0">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-lg font-semibold text-slate-900">
                      {selectedEvent ? selectedEvent.name : "Select an event"}
                    </div>

                    {selectedEvent ? (
                      <>
                        <Pill tone={statusTone(selectedEvent.status)}>{selectedEvent.status}</Pill>
                        <Pill tone={categoryTone(selectedEvent.category)}>{selectedEvent.category}</Pill>
                      </>
                    ) : null}
                  </div>

                  {selectedEvent ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedEvent.location}
                      </span>
                      <span className="opacity-50">•</span>
                      <span className="inline-flex items-center gap-1">
                        <ClipboardList size={16} />
                        Organiser: {selectedEvent.organiser}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-600">Choose an event from the list to preview details.</div>
                  )}
                </div>

                {selectedEvent ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/events/${selectedEvent.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                    >
                      Open full record <ArrowRight size={16} />
                    </Link>

                    <button
                      onClick={() => alert("Demo: Quick approval / message actions can be wired here next.")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <ShieldCheck size={16} />
                      Quick actions
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="px-6 py-6">
              {!selectedEvent ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
                  Select an event to view its preparation and venue impact.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* LEFT: key timings */}
                  <div className="lg:col-span-7">
                    <div className="rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Key timings</div>
                          <div className="mt-1 text-xs text-slate-600">Prep → Event → Dismantle timeline snapshot.</div>
                        </div>
                        <Pill tone="indigo">
                          <Clock size={14} />
                          {selectedEvent.venueBlockedLabel}
                        </Pill>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3">
                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Event window</div>
                          <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <CalendarDays size={16} className="text-slate-500" />
                            {selectedEvent.eventWindowLabel}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-600">Prep start</div>
                            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <Wrench size={16} className="text-slate-500" />
                              {selectedEvent.prepStartLabel}
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-600">Dismantled by</div>
                            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <Package size={16} className="text-slate-500" />
                              {selectedEvent.dismantledByLabel}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">Why we capture this</div>
                        <div className="mt-1">
                          These events block the venue well before doors open and after the event ends. Recording the
                          full window helps avoid clashes and improves repeat planning.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: planning snapshot */}
                  <div className="lg:col-span-5">
                    <div className="rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Planning snapshot</div>
                          <div className="mt-1 text-xs text-slate-600">What GSLA should look at next.</div>
                        </div>
                        <Pill tone={statusTone(selectedEvent.status)}>{selectedEvent.status}</Pill>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Organiser</div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">{selectedEvent.organiser}</div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Review hint</div>
                          <div className="mt-2 text-sm text-slate-800">{selectedEvent.reviewHint}</div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Venue</div>
                          <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-800">
                            <MapPin size={16} className="text-slate-500" />
                            {selectedEvent.location}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/admin/events/${selectedEvent.id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          Open record <ArrowRight size={16} />
                        </Link>
                        <button
                          onClick={() => alert("Demo: Add lightweight 'Mark reviewed' action later.")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          <CheckCircle2 size={16} />
                          Mark reviewed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
