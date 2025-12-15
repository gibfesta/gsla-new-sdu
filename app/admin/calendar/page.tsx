"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Flag,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  HeartPulse,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react";

type EventType =
  | "League"
  | "Tournament"
  | "Away Tournament"
  | "Local Event"
  | "Course"
  | "Seminar";

type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  sport: string;
  location: string;
  start: string; // ISO date-time
  end?: string;  // ISO date-time (optional, enables multi-day)
  notes?: string;
};

const INITIAL_EVENTS: CalendarEvent[] = [
  // --- Leagues / Tournaments / Local events ---
  {
    id: "e1",
    title: "Gibraltar Football League — Matchday 12",
    type: "League",
    sport: "Football",
    location: "Europa Point Stadium",
    start: "2025-12-03T18:30:00",
    notes: "Referees: Assigned | Kits: Home/Blue",
  },
  {
    id: "e2",
    title: "Cricket Winter League — Round 5",
    type: "League",
    sport: "Cricket",
    location: "Victoria Stadium (Oval)",
    start: "2025-12-06T10:00:00",
    notes: "Bring covers if rain forecast.",
  },
  {
    id: "e3",
    title: "Youth Development Day",
    type: "Local Event",
    sport: "Multi-sport",
    location: "Lathbury Sports Complex",
    start: "2025-12-07T09:30:00",
    end: "2025-12-07T14:00:00",
    notes: "Open session for U10–U14. Coaches required.",
  },
  {
    id: "e4",
    title: "National Cup Qualifiers",
    type: "Tournament",
    sport: "Football",
    location: "Europa Point Stadium",
    start: "2025-12-10T19:00:00",
    notes: "Media: Local press confirmed.",
  },
  {
    id: "e5",
    title: "Away: Andalusia Invitational",
    type: "Away Tournament",
    sport: "Cricket",
    location: "Málaga Cricket Ground",
    start: "2025-12-12T08:00:00",
    end: "2025-12-14T18:00:00",
    notes: "Travel: Coach departs 05:30 | Hotel: Confirmed",
  },

  // --- Courses / Seminars ---
  {
    id: "c1",
    title: "First Aid Course (Sports Environment)",
    type: "Course",
    sport: "Admin",
    location: "GSLA HQ — Training Room",
    start: "2025-12-15T17:30:00",
    end: "2025-12-15T20:00:00",
    notes: "Certification: 12 months | Bring ID",
  },
  {
    id: "c2",
    title: "Safeguarding Course (Coaches & Volunteers)",
    type: "Course",
    sport: "Admin",
    location: "GSLA HQ — Training Room",
    start: "2025-12-16T17:30:00",
    end: "2025-12-16T19:30:00",
    notes: "Required for youth programmes | Attendance register",
  },
  {
    id: "c3",
    title: "Pétanque Level 1 Coaching Course",
    type: "Course",
    sport: "Pétanque",
    location: "Europa Sports Club — Pétanque Courts",
    start: "2025-12-17T18:00:00",
    end: "2025-12-17T20:30:00",
    notes: "Assessment included | Equipment provided",
  },
  {
    id: "e7",
    title: "Indoor Athletics Meet",
    type: "Tournament",
    sport: "Athletics",
    location: "Tercentenary Sports Hall",
    start: "2025-12-18T16:00:00",
    notes: "U16 + Open categories.",
  },
  {
    id: "c4",
    title: "Coach Personal Development Seminar",
    type: "Seminar",
    sport: "Admin",
    location: "GSLA HQ — Main Hall",
    start: "2025-12-19T18:00:00",
    end: "2025-12-19T20:00:00",
    notes: "Topic: Communication, leadership, and athlete wellbeing",
  },
  {
    id: "c5",
    title: "Concussion Awareness Workshop",
    type: "Seminar",
    sport: "Multi-sport",
    location: "Tercentenary Sports Hall — Meeting Room 2",
    start: "2025-12-20T17:00:00",
    end: "2025-12-20T18:30:00",
    notes: "Recommended for contact sports staff",
  },
  {
    id: "e8",
    title: "League Admin Deadline: Team Sheets",
    type: "Local Event",
    sport: "Football",
    location: "Online Submission",
    start: "2025-12-20T12:00:00",
    notes: "All clubs must submit final team sheet list.",
  },
  {
    id: "c6",
    title: "Strength & Conditioning Basics (Intro Course)",
    type: "Course",
    sport: "Multi-sport",
    location: "Lathbury Gym — Studio 1",
    start: "2025-12-21T10:00:00",
    end: "2025-12-21T13:00:00",
    notes: "Bring training shoes | Practical component included",
  },
  {
    id: "e9",
    title: "Away: Regional Netball Friendly Series",
    type: "Away Tournament",
    sport: "Netball",
    location: "Seville Sports Arena",
    start: "2025-12-22T07:00:00",
    end: "2025-12-22T21:00:00",
    notes: "Roster due by 2025-12-16.",
  },
  {
    id: "c7",
    title: "Club Admin Bootcamp (Fixtures, Registrations, Compliance)",
    type: "Course",
    sport: "Admin",
    location: "GSLA HQ — Training Room",
    start: "2025-12-23T17:30:00",
    end: "2025-12-23T19:30:00",
    notes: "For secretaries + team managers | Laptop recommended",
  },
  {
    id: "c8",
    title: "Talent ID & Player Pathways Seminar",
    type: "Seminar",
    sport: "Multi-sport",
    location: "GSLA HQ — Main Hall",
    start: "2025-12-27T18:00:00",
    end: "2025-12-27T19:30:00",
    notes: "Panel format + Q&A",
  },
  {
    id: "e10",
    title: "Community Fun Run (5K)",
    type: "Local Event",
    sport: "Athletics",
    location: "Casemates Square",
    start: "2025-12-28T09:00:00",
    notes: "Volunteers needed for water points.",
  },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function clampToDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function typeMeta(type: EventType) {
  switch (type) {
    case "League":
      return { icon: Trophy, pill: "bg-slate-900 text-white", dot: "bg-slate-900" };
    case "Tournament":
      return { icon: Flag, pill: "bg-amber-500 text-white", dot: "bg-amber-500" };
    case "Away Tournament":
      return { icon: MapPin, pill: "bg-emerald-600 text-white", dot: "bg-emerald-600" };
    case "Course":
      return { icon: GraduationCap, pill: "bg-indigo-600 text-white", dot: "bg-indigo-600" };
    case "Seminar":
      return { icon: ClipboardCheck, pill: "bg-fuchsia-600 text-white", dot: "bg-fuchsia-600" };
    case "Local Event":
    default:
      return { icon: Users, pill: "bg-sky-600 text-white", dot: "bg-sky-600" };
  }
}

function eventIconHint(title: string) {
  const t = title.toLowerCase();
  if (t.includes("first aid")) return HeartPulse;
  if (t.includes("safeguard")) return ShieldCheck;
  return null;
}

// Convert "YYYY-MM-DDTHH:mm" (from <input type="datetime-local">) to ISO string
function localInputToISO(v: string) {
  if (!v) return "";
  // Treat as local time, store as ISO with timezone offset applied by Date
  const d = new Date(v);
  if (Number.isNaN(+d)) return "";
  return d.toISOString();
}

// Convert ISO string to "YYYY-MM-DDTHH:mm" for datetime-local input
function isoToLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "";
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

export default function Page() {
  const today = clampToDay(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>(() => INITIAL_EVENTS);
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selectedDayKey, setSelectedDayKey] = useState<string>(toDateKey(today));
  const [typeFilter, setTypeFilter] = useState<EventType | "All">("All");
  const [sportFilter, setSportFilter] = useState<string>("All");

  // Create Event modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string>("");
  const [draft, setDraft] = useState<{
    title: string;
    type: EventType;
    sport: string;
    location: string;
    startLocal: string;
    endLocal: string;
    notes: string;
  }>(() => {
    // default start: today at 18:00 local
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    return {
      title: "",
      type: "Local Event",
      sport: "Admin",
      location: "",
      startLocal: isoToLocalInput(d.toISOString()),
      endLocal: "",
      notes: "",
    };
  });

  const monthStart = useMemo(() => startOfMonth(cursor), [cursor]);
  const monthEnd = useMemo(() => endOfMonth(cursor), [cursor]);

  const sports = useMemo(() => {
    const s = Array.from(new Set(events.map((e) => e.sport))).sort();
    return ["All", ...s];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (typeFilter !== "All" && e.type !== typeFilter) return false;
      if (sportFilter !== "All" && e.sport !== sportFilter) return false;
      return true;
    });
  }, [events, typeFilter, sportFilter]);

  // ✅ Multi-day rendering: add event to each day it spans (inclusive)
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Array<CalendarEvent & { _span?: { dayKey: string } }>>();

    for (const ev of filteredEvents) {
      const start = new Date(ev.start);
      if (Number.isNaN(+start)) continue;

      const end = ev.end ? new Date(ev.end) : new Date(ev.start);
      const endSafe = Number.isNaN(+end) ? new Date(ev.start) : end;

      let cur = clampToDay(start);
      const last = clampToDay(endSafe);

      // Ensure forward direction only
      if (+last < +cur) {
        const key = toDateKey(clampToDay(start));
        const arr = map.get(key) ?? [];
        arr.push({ ...ev, _span: { dayKey: key } });
        map.set(key, arr);
        continue;
      }

      while (+cur <= +last) {
        const key = toDateKey(cur);
        const arr = map.get(key) ?? [];
        arr.push({ ...ev, _span: { dayKey: key } });
        map.set(key, arr);
        cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
      }
    }

    // sort inside each day by:
    // 1) "starts today" first, then 2) start time
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        const day = new Date(k + "T00:00:00");
        const aStartsToday = isSameDay(clampToDay(aStart), day);
        const bStartsToday = isSameDay(clampToDay(bStart), day);
        if (aStartsToday !== bStartsToday) return aStartsToday ? -1 : 1;
        return +aStart - +bStart;
      });
      map.set(k, arr);
    }

    return map;
  }, [filteredEvents]);

  const selectedEvents = useMemo(() => {
    return eventsByDay.get(selectedDayKey) ?? [];
  }, [eventsByDay, selectedDayKey]);

  const gridDays = useMemo(() => {
    // Monday-start calendar
    const first = monthStart;
    const last = monthEnd;

    const jsDay = first.getDay(); // Sun=0..Sat=6
    const mondayIndex = (jsDay + 6) % 7; // Mon=0..Sun=6
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - mondayIndex);

    const jsDayLast = last.getDay();
    const mondayIndexLast = (jsDayLast + 6) % 7;
    const gridEnd = new Date(last);
    gridEnd.setDate(last.getDate() + (6 - mondayIndexLast));

    const days: Date[] = [];
    const cur = new Date(gridStart);
    while (cur <= gridEnd) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [monthStart, monthEnd]);

  const monthLabel = useMemo(() => {
    return cursor.toLocaleDateString([], { month: "long", year: "numeric" });
  }, [cursor]);

  const upcoming = useMemo(() => {
    const now = new Date();
    // For upcoming, show unique base events (not per-day expansions)
    const base = filteredEvents
      .slice()
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .filter((e) => new Date(e.start) >= now);

    return base.slice(0, 7);
  }, [filteredEvents]);

  function openCreateModal() {
    setCreateError("");
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    setCreateError("");
  }

  function createEvent() {
    setCreateError("");

    const title = draft.title.trim();
    const location = draft.location.trim();
    const sport = draft.sport.trim() || "Admin";

    const startISO = localInputToISO(draft.startLocal);
    const endISO = draft.endLocal ? localInputToISO(draft.endLocal) : "";

    if (!title) return setCreateError("Please enter a title.");
    if (!startISO) return setCreateError("Please choose a start date/time.");
    if (!location) return setCreateError("Please enter a location.");

    const start = new Date(startISO);
    if (Number.isNaN(+start)) return setCreateError("Start date/time is invalid.");

    let end: Date | null = null;
    if (endISO) {
      end = new Date(endISO);
      if (Number.isNaN(+end)) return setCreateError("End date/time is invalid.");
      if (+end < +start) return setCreateError("End cannot be earlier than start.");
    }

    const newEv: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title,
      type: draft.type,
      sport,
      location,
      start: startISO,
      end: end ? endISO : undefined,
      notes: draft.notes.trim() || undefined,
    };

    setEvents((prev) => [newEv, ...prev]);

    const startDayKey = toDateKey(clampToDay(start));
    setSelectedDayKey(startDayKey);
    setCursor(startOfMonth(clampToDay(start)));

    // reset draft (keep type/sport as convenience)
    setDraft((d) => ({
      ...d,
      title: "",
      location: "",
      notes: "",
      endLocal: "",
      startLocal: isoToLocalInput(startISO),
    }));

    closeCreateModal();
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Calendar</h1>
            <p className="text-sm text-slate-600">
              Leagues, tournaments, away trips, local events, courses & seminars
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Plus size={16} />
            New event
          </button>

          <button
            onClick={() => setCursor(startOfMonth(today))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Today
          </button>

          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => setCursor(addMonths(cursor, -1))}
              className="px-3 py-2 text-slate-700 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-2 text-sm font-semibold text-slate-900">{monthLabel}</div>
            <button
              onClick={() => setCursor(addMonths(cursor, 1))}
              className="px-3 py-2 text-slate-700 hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
            <Filter size={16} />
            <select
              className="bg-transparent text-sm outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="All">All types</option>
              <option value="League">League</option>
              <option value="Tournament">Tournament</option>
              <option value="Away Tournament">Away Tournament</option>
              <option value="Local Event">Local Event</option>
              <option value="Course">Course</option>
              <option value="Seminar">Seminar</option>
            </select>

            <span className="mx-1 h-4 w-px bg-slate-200" />

            <select
              className="bg-transparent text-sm outline-none"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            >
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All sports" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Calendar grid */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="px-3 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {gridDays.map((d) => {
                const key = toDateKey(d);
                const inMonth = d.getMonth() === cursor.getMonth();
                const isToday = key === toDateKey(today);
                const isSelected = key === selectedDayKey;

                const dayEvents = eventsByDay.get(key) ?? [];
                const visible = dayEvents.slice(0, 2);
                const extra = Math.max(0, dayEvents.length - visible.length);

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDayKey(key)}
                    className={[
                      "min-h-[110px] border-b border-r border-slate-200 p-2 text-left transition",
                      "hover:bg-slate-50",
                      !inMonth ? "bg-slate-50/50 text-slate-400" : "bg-white text-slate-900",
                      isSelected ? "ring-2 ring-slate-900 ring-inset" : "",
                    ].join(" ")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold",
                          isToday ? "bg-slate-900 text-white" : "bg-transparent",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </div>
                      {dayEvents.length > 0 ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {dayEvents.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {visible.map((ev) => {
                        const meta = typeMeta(ev.type);
                        const day = new Date(key + "T00:00:00");
                        const startsToday = isSameDay(clampToDay(new Date(ev.start)), day);
                        const ends = ev.end ? new Date(ev.end) : null;
                        const isMultiDay = !!(ev.end && ends && clampToDay(ends).getTime() !== clampToDay(new Date(ev.start)).getTime());

                        return (
                          <div key={`${ev.id}_${key}`} className="flex items-start gap-2 rounded-xl bg-slate-50 px-2 py-1">
                            <span className={`mt-1 h-2 w-2 rounded-full ${meta.dot}`} />
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-slate-900">
                                {ev.title}
                              </div>
                              <div className="text-[11px] text-slate-600">
                                {startsToday ? formatTime(ev.start) : isMultiDay ? "Multi-day" : "—"} • {ev.sport}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {extra > 0 ? (
                        <div className="text-[11px] font-semibold text-slate-600">+{extra} more</div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected day details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <div className="text-sm font-bold text-slate-900">
                {new Date(selectedDayKey).toLocaleDateString([], {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-xs text-slate-600">
                {selectedEvents.length === 0
                  ? "No events"
                  : `${selectedEvents.length} event${selectedEvents.length === 1 ? "" : "s"}`}
              </div>
            </div>

            <div className="space-y-3">
              {selectedEvents.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  Nothing scheduled for this day.
                </div>
              ) : (
                selectedEvents.map((ev) => {
                  const meta = typeMeta(ev.type);
                  const Icon = meta.icon;
                  const HintIcon = eventIconHint(ev.title);

                  const start = new Date(ev.start);
                  const end = ev.end ? new Date(ev.end) : null;
                  const day = new Date(selectedDayKey + "T00:00:00");

                  const startsToday = isSameDay(clampToDay(start), day);
                  const endsToday = end ? isSameDay(clampToDay(end), day) : false;
                  const isMultiDay = !!(end && clampToDay(end).getTime() !== clampToDay(start).getTime());

                  return (
                    <div key={`${ev.id}_${selectedDayKey}`} className="rounded-2xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-slate-900">{ev.title}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${meta.pill}`}>
                              <Icon size={14} />
                              {ev.type}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                              {ev.sport}
                            </span>
                            {HintIcon ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                                <HintIcon size={14} />
                                {ev.title.toLowerCase().includes("first aid") ? "First Aid" : "Safeguarding"}
                              </span>
                            ) : null}
                            {isMultiDay ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                                Multi-day
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">When:</span>
                          <span>
                            {isMultiDay ? (
                              <>
                                {formatDateLong(ev.start)} {formatTime(ev.start)} →{" "}
                                {ev.end ? `${formatDateLong(ev.end)} ${formatTime(ev.end)}` : "—"}
                                <span className="ml-2 text-slate-500">
                                  ({startsToday ? "starts today" : endsToday ? "ends today" : "continues"})
                                </span>
                              </>
                            ) : (
                              <>
                                {formatTime(ev.start)}
                                {ev.end ? ` – ${formatTime(ev.end)}` : ""}
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-slate-500" />
                          <span className="truncate">{ev.location}</span>
                        </div>

                        {ev.notes ? (
                          <div className="mt-2 rounded-xl bg-slate-50 p-2 text-xs text-slate-700">
                            {ev.notes}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-bold text-slate-900">Upcoming</div>
            <div className="space-y-2">
              {upcoming.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  No upcoming events (with current filters).
                </div>
              ) : (
                upcoming.map((ev) => {
                  const meta = typeMeta(ev.type);
                  const Icon = meta.icon;
                  return (
                    <div key={ev.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3">
                      <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl ${meta.pill}`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{ev.title}</div>
                        <div className="mt-1 text-xs text-slate-600">
                          {formatDateLong(ev.start)} • {formatTime(ev.start)}
                          {ev.end ? (
                            <span className="ml-2 text-slate-500">→ {formatDateLong(ev.end)}</span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-slate-700">
                          {ev.sport} • {ev.location}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-bold text-slate-900">Legend</div>
            <div className="grid gap-2 text-sm">
              {(["League", "Tournament", "Away Tournament", "Local Event", "Course", "Seminar"] as EventType[]).map(
                (t) => {
                  const meta = typeMeta(t);
                  const Icon = meta.icon;
                  return (
                    <div key={t} className="flex items-center gap-2 text-slate-700">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${meta.pill}`}
                      >
                        <Icon size={14} />
                        {t}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {isCreateOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* backdrop */}
          <button
            aria-label="Close"
            onClick={closeCreateModal}
            className="absolute inset-0 bg-black/40"
          />

          {/* modal */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">Create event</div>
                <div className="text-sm text-slate-600">Add leagues, tournaments, courses, seminars, etc.</div>
              </div>
              <button
                onClick={closeCreateModal}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4">
              {createError ? (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                  {createError}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Title
                  </label>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="e.g. Safeguarding Course (Coaches & Volunteers)"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Type
                  </label>
                  <select
                    value={draft.type}
                    onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as EventType }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="League">League</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Away Tournament">Away Tournament</option>
                    <option value="Local Event">Local Event</option>
                    <option value="Course">Course</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Sport
                  </label>
                  <input
                    value={draft.sport}
                    onChange={(e) => setDraft((d) => ({ ...d, sport: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="e.g. Admin / Football / Pétanque"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Location
                  </label>
                  <input
                    value={draft.location}
                    onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="e.g. GSLA HQ — Training Room"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={draft.startLocal}
                    onChange={(e) => setDraft((d) => ({ ...d, startLocal: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  <div className="mt-1 text-[11px] text-slate-500">
                    Tip: set an End time to make it multi-day.
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    End (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={draft.endLocal}
                    onChange={(e) => setDraft((d) => ({ ...d, endLocal: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Notes (optional)
                  </label>
                  <textarea
                    value={draft.notes}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                    className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="e.g. Attendance register, roster due date, travel details..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={closeCreateModal}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createEvent}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create event
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
