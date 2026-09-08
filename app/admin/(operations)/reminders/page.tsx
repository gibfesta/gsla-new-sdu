// app/admin/reminders/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  Filter,
  Plus,
  Search,
} from "lucide-react";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal:
 * - Make Reminders feel like a proper “Alerts & Deadlines” hub.
 * - Align with Dashboard queues + Administration Governance.
 *
 * Rules:
 * - Still demo / static (no backend)
 * - Client-only state is OK
 * - Easy to rip out once API-backed reminders exist
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Urgency = "High" | "Medium" | "Low";
type Status = "Overdue" | "Due Soon" | "Upcoming" | "Completed";
type ReminderType =
  | "Certification"
  | "Safeguarding"
  | "Governance"
  | "Facility"
  | "Other";

type Reminder = {
  id: string;
  title: string;
  dueInDays: number; // < 0 = overdue
  urgency: Urgency;
  status: Status;
  type: ReminderType;
  owner?: string;
  source?: string;
};

/* -------------------------------------------------------------------------- */
/* Seed Data (demo only)                                                      */
/* -------------------------------------------------------------------------- */

const seedReminders: Reminder[] = [
  {
    id: "r1",
    title: "First Aid Certificate renewal",
    dueInDays: 7,
    urgency: "High",
    status: "Due Soon",
    type: "Certification",
    owner: "Coaches",
    source: "People & Roles",
  },
  {
    id: "r2",
    title: "Safeguarding training expires",
    dueInDays: 14,
    urgency: "Medium",
    status: "Upcoming",
    type: "Safeguarding",
    owner: "Volunteers",
    source: "Administration Governance",
  },
  {
    id: "r3",
    title: "Coach license check-in",
    dueInDays: 30,
    urgency: "Low",
    status: "Upcoming",
    type: "Certification",
    owner: "Coaches",
    source: "People & Roles",
  },
  {
    id: "r4",
    title: "Facility inspection follow-up",
    dueInDays: -3,
    urgency: "High",
    status: "Overdue",
    type: "Facility",
    owner: "Main Sports Hall",
    source: "Core Structure",
  },
  {
    id: "r5",
    title: "Form B acknowledgements outstanding",
    dueInDays: 10,
    urgency: "Medium",
    status: "Due Soon",
    type: "Governance",
    owner: "New Volunteers",
    source: "Forms A/B/C",
  },
  {
    id: "r6",
    title: "Completed: Coach onboarding checklist",
    dueInDays: 0,
    urgency: "Low",
    status: "Completed",
    type: "Other",
    owner: "Coaching Team",
  },
];

/* -------------------------------------------------------------------------- */
/* Styling Helpers                                                            */
/* -------------------------------------------------------------------------- */

function urgencyClasses(level: Urgency) {
  if (level === "High")
    return "bg-[#D81E27]/10 text-[#D81E27] ring-[#D81E27]/20";
  if (level === "Medium")
    return "bg-[#F2B705]/15 text-[#B45309] ring-[#F2B705]/30";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function statusClasses(status: Status) {
  if (status === "Overdue")
    return "bg-[#D81E27]/10 text-[#D81E27] ring-[#D81E27]/20";
  if (status === "Due Soon")
    return "bg-[#F2B705]/15 text-[#B45309] ring-[#F2B705]/30";
  if (status === "Completed")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function dueLabel(days: number) {
  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return "Due today";
  return `Due in ${days} days`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function RemindersPage() {
  const [items, setItems] = useState<Reminder[]>(seedReminders);
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return {
      overdue: items.filter((x) => x.status === "Overdue").length,
      dueSoon: items.filter((x) => x.status === "Due Soon").length,
      upcoming: items.filter((x) => x.status === "Upcoming").length,
      completed: items.filter((x) => x.status === "Completed").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (x) =>
        x.title.toLowerCase().includes(q) ||
        x.owner?.toLowerCase().includes(q) ||
        x.source?.toLowerCase().includes(q)
    );
  }, [items, query]);

  function markDone(id: string) {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, status: "Completed" } : x
      )
    );
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Reminders</h1>
      <p className="mt-2 text-slate-600">
        Deadlines, renewals, and alerts across all sports.
      </p>

      {/* Scan strip */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="flex items-center gap-4 py-5">
          <AlertTriangle className="h-6 w-6 text-[#D81E27]" />
          <div><div className="text-sm text-slate-600">Overdue</div><div className="text-2xl font-extrabold">{counts.overdue}</div></div>
        </CardContent></Card>

        <Card><CardContent className="flex items-center gap-4 py-5">
          <Bell className="h-6 w-6 text-[#B45309]" />
          <div><div className="text-sm text-slate-600">Due Soon</div><div className="text-2xl font-extrabold">{counts.dueSoon}</div></div>
        </CardContent></Card>

        <Card><CardContent className="flex items-center gap-4 py-5">
          <Calendar className="h-6 w-6 text-slate-700" />
          <div><div className="text-sm text-slate-600">Upcoming</div><div className="text-2xl font-extrabold">{counts.upcoming}</div></div>
        </CardContent></Card>

        <Card><CardContent className="flex items-center gap-4 py-5">
          <CheckCircle2 className="h-6 w-6 text-emerald-700" />
          <div><div className="text-sm text-slate-600">Completed</div><div className="text-2xl font-extrabold">{counts.completed}</div></div>
        </CardContent></Card>
      </div>

      {/* List */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Upcoming</div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  placeholder="Search reminders…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-200">
              {filtered.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-slate-600">
                      {dueLabel(r.dueInDays)}
                      {r.owner && ` · ${r.owner}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={urgencyClasses(r.urgency)}>{r.urgency}</Badge>
                    <Badge className={statusClasses(r.status)}>{r.status}</Badge>

                    {r.status !== "Completed" && (
                      <button
                        onClick={() => markDone(r.id)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                      >
                        Mark done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Create Reminder
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}