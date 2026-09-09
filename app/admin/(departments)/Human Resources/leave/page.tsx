"use client";

import React, { useMemo, useState } from "react";

type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
type LeaveType = "Annual" | "Sick" | "Unpaid" | "Compassionate" | "Study" | "Other";

type LeaveRequest = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  role: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  days: number;
  submittedAt: string; // ISO date-time
  reason: string;
  manager: string;
  attachments?: number;
};

function classNames(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function formatISODate(d: string) {
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

function formatISODateTime(d: string) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${mi}`;
}

function daysBetweenInclusive(startISO: string, endISO: string) {
  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");
  const ms = e.getTime() - s.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, days);
}

function withinRange(dateISO: string, start?: string, end?: string) {
  const d = new Date(dateISO + "T00:00:00").getTime();
  if (start) {
    const s = new Date(start + "T00:00:00").getTime();
    if (d < s) return false;
  }
  if (end) {
    const e = new Date(end + "T00:00:00").getTime();
    if (d > e) return false;
  }
  return true;
}

function statusTone(s: LeaveStatus) {
  switch (s) {
    case "Pending":
      return "amber";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Cancelled":
      return "slate";
  }
}

function typeTone(t: LeaveType) {
  switch (t) {
    case "Annual":
      return "blue";
    case "Sick":
      return "purple";
    case "Unpaid":
      return "slate";
    case "Compassionate":
      return "red";
    case "Study":
      return "amber";
    case "Other":
      return "slate";
  }
}

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "amber" | "green" | "red" | "blue" | "purple";
}) {
  const styles: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    amber: "bg-amber-100 text-amber-800 ring-amber-200",
    green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    red: "bg-rose-100 text-rose-800 ring-rose-200",
    blue: "bg-sky-100 text-sky-800 ring-sky-200",
    purple: "bg-violet-100 text-violet-800 ring-violet-200",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[tone]
      )}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: React.ReactNode;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      {subtext ? <div className="mt-1 text-xs text-slate-500">{subtext}</div> : null}
    </div>
  );
}

const seededRequests: LeaveRequest[] = [
  {
    id: "LR-10021",
    employeeName: "A. Camilleri",
    employeeId: "EMP-0142",
    department: "Operations",
    role: "Coordinator",
    type: "Annual",
    status: "Pending",
    startDate: "2026-01-29",
    endDate: "2026-01-31",
    days: 3,
    submittedAt: "2026-01-24T10:12:00",
    reason: "Family commitment and travel.",
    manager: "J. Vella",
    attachments: 0,
  },
  {
    id: "LR-10019",
    employeeName: "M. Attard",
    employeeId: "EMP-0088",
    department: "Sports Development",
    role: "Officer",
    type: "Sick",
    status: "Approved",
    startDate: "2026-01-22",
    endDate: "2026-01-24",
    days: 3,
    submittedAt: "2026-01-22T08:40:00",
    reason: "Flu symptoms and recovery.",
    manager: "S. Borg",
    attachments: 1,
  },
  {
    id: "LR-10017",
    employeeName: "L. Grech",
    employeeId: "EMP-0031",
    department: "Facilities",
    role: "Supervisor",
    type: "Unpaid",
    status: "Rejected",
    startDate: "2026-02-03",
    endDate: "2026-02-07",
    days: 5,
    submittedAt: "2026-01-21T16:05:00",
    reason: "Extended personal matters.",
    manager: "D. Zammit",
    attachments: 0,
  },
  {
    id: "LR-10015",
    employeeName: "S. Farrugia",
    employeeId: "EMP-0204",
    department: "Administration",
    role: "Clerk",
    type: "Annual",
    status: "Approved",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    days: 3,
    submittedAt: "2026-01-20T09:18:00",
    reason: "Short break.",
    manager: "J. Vella",
    attachments: 0,
  },
  {
    id: "LR-10014",
    employeeName: "N. Xuereb",
    employeeId: "EMP-0110",
    department: "Human Resources",
    role: "HR Assistant",
    type: "Study",
    status: "Pending",
    startDate: "2026-02-05",
    endDate: "2026-02-05",
    days: 1,
    submittedAt: "2026-01-19T14:52:00",
    reason: "Exam day (professional certification).",
    manager: "M. Mifsud",
    attachments: 1,
  },
];

export default function LeaveManagementPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(seededRequests);

  // filters
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeaveStatus | "All">("All");
  const [leaveType, setLeaveType] = useState<LeaveType | "All">("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // review drawer + create modal (CLOSED by default)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return requests
      .filter((r) => (status === "All" ? true : r.status === status))
      .filter((r) => (leaveType === "All" ? true : r.type === leaveType))
      .filter((r) => {
        if (!fromDate && !toDate) return true;
        return withinRange(r.startDate, fromDate || undefined, toDate || undefined);
      })
      .filter((r) => {
        if (!q) return true;
        const hay = [
          r.id,
          r.employeeName,
          r.employeeId,
          r.department,
          r.role,
          r.type,
          r.status,
          r.manager,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
  }, [requests, query, status, leaveType, fromDate, toDate]);

  // KPI calculations
  const kpis = useMemo(() => {
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;

    // If you want this to be truly "today", use new Date().toISOString().slice(0,10)
    const todayISO = "2026-01-25";
    const onLeaveToday = requests.filter((r) => {
      if (r.status !== "Approved") return false;
      return withinRange(todayISO, r.startDate, r.endDate);
    }).length;

    // This normally comes from balances; here it’s a placeholder
    const balanceAlerts = 4;

    return { pending, approved, onLeaveToday, balanceAlerts };
  }, [requests]);

  function closeReview() {
    setSelectedId(null);
    setReviewNote("");
  }

  function approveSelected() {
    if (!selected) return;
    setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: "Approved" } : r)));
    setReviewNote("");
  }

  function rejectSelected() {
    if (!selected) return;
    setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: "Rejected" } : r)));
    setReviewNote("");
  }

  // Create modal form
  const [cEmployeeName, setCEmployeeName] = useState("");
  const [cEmployeeId, setCEmployeeId] = useState("");
  const [cDepartment, setCDepartment] = useState("Human Resources");
  const [cRole, setCRole] = useState("Staff");
  const [cType, setCType] = useState<LeaveType>("Annual");
  const [cStart, setCStart] = useState("");
  const [cEnd, setCEnd] = useState("");
  const [cManager, setCManager] = useState("Manager");
  const [cReason, setCReason] = useState("");

  function resetCreate() {
    setCEmployeeName("");
    setCEmployeeId("");
    setCDepartment("Human Resources");
    setCRole("Staff");
    setCType("Annual");
    setCStart("");
    setCEnd("");
    setCManager("Manager");
    setCReason("");
  }

  function submitCreate() {
    const start = cStart || new Date().toISOString().slice(0, 10);
    const end = cEnd || start;

    const newReq: LeaveRequest = {
      id: `LR-${Math.floor(10000 + Math.random() * 90000)}`,
      employeeName: cEmployeeName || "Unnamed Employee",
      employeeId: cEmployeeId || "EMP-XXXX",
      department: cDepartment,
      role: cRole,
      type: cType,
      status: "Pending",
      startDate: start,
      endDate: end,
      days: daysBetweenInclusive(start, end),
      submittedAt: new Date().toISOString(),
      reason: cReason || "—",
      manager: cManager,
      attachments: 0,
    };

    setRequests((prev) => [newReq, ...prev]);
    setShowCreate(false);
    resetCreate();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Leave Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Review, approve, and track staff leave requests across departments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              + Create Request
            </button>
            <button
              onClick={() => {
                const rows = filtered.map((r) => ({
                  id: r.id,
                  employeeName: r.employeeName,
                  employeeId: r.employeeId,
                  department: r.department,
                  role: r.role,
                  type: r.type,
                  status: r.status,
                  startDate: r.startDate,
                  endDate: r.endDate,
                  days: r.days,
                  submittedAt: r.submittedAt,
                  manager: r.manager,
                }));
                console.log("Export rows", rows);
                alert("Export placeholder: check console (Export rows).");
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Export
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending approvals" value={kpis.pending} subtext="Awaiting action" />
          <StatCard label="Approved (upcoming)" value={kpis.approved} subtext="Includes future dates" />
          <StatCard label="On leave today" value={kpis.onLeaveToday} subtext="Approved + active today" />
          <StatCard label="Balance alerts" value={kpis.balanceAlerts} subtext="Low/negative balance risk" />
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-medium text-slate-600">Search</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, ID, dept, request ID..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Leave type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>All</option>
                  <option>Annual</option>
                  <option>Sick</option>
                  <option>Unpaid</option>
                  <option>Compassionate</option>
                  <option>Study</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">From</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">To</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 lg:justify-end">
              <div className="text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">{filtered.length}</span> request(s)
              </div>
              <button
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setLeaveType("All");
                  setFromDate("");
                  setToDate("");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-900">Leave Requests</div>
            <div className="text-xs text-slate-500">Click a row to review</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                      No requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{r.id}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {r.attachments ? `${r.attachments} attachment(s)` : "No attachments"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{r.employeeName}</div>
                        <div className="text-xs text-slate-500">
                          {r.employeeId} • {r.role}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{r.department}</td>
                      <td className="px-4 py-3">
                        <Badge tone={typeTone(r.type)}>{r.type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">
                          {formatISODate(r.startDate)} → {formatISODate(r.endDate)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {daysBetweenInclusive(r.startDate, r.endDate)} day(s) (calc)
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{r.days}</td>
                      <td className="px-4 py-3">
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatISODateTime(r.submittedAt)}</td>
                      <td className="px-4 py-3 text-slate-700">{r.manager}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful panels */}
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="text-sm font-medium text-slate-900">Suggested workflow</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                Review <span className="font-medium text-slate-800">Pending</span> requests daily.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                Check overlaps and coverage before approving.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                Add notes for audit trail and payroll alignment.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-900">Quick links</div>
            <div className="mt-3 grid gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                Leave Balances (coming soon)
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                Public Holidays (coming soon)
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                Policy & Entitlements (coming soon)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Drawer (only mounted when selected) */}
      {selected ? (
        <div className="fixed inset-0 z-50">
          <div onClick={closeReview} className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="border-b border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Review request</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{selected.id}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      <span className="font-medium text-slate-800">{selected.employeeName}</span> •{" "}
                      {selected.employeeId} • {selected.department}
                    </div>
                  </div>
                  <button
                    onClick={closeReview}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs text-slate-500">Leave type</div>
                      <div className="mt-2">
                        <Badge tone={typeTone(selected.type)}>{selected.type}</Badge>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="mt-2">
                        <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs text-slate-500">Dates</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">
                        {formatISODate(selected.startDate)} → {formatISODate(selected.endDate)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {daysBetweenInclusive(selected.startDate, selected.endDate)} day(s) (inclusive)
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs text-slate-500">Manager</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{selected.manager}</div>
                      <div className="mt-1 text-xs text-slate-500">Listed approver</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500">Reason</div>
                    <p className="mt-2 text-sm text-slate-800">{selected.reason}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500">Review notes (optional)</div>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Add a note for audit trail..."
                      className="mt-2 h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 p-5">
                {selected.status === "Pending" ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={rejectSelected}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={approveSelected}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      This request is <span className="font-medium text-slate-700">{selected.status}</span>.
                    </div>
                    <button
                      onClick={() => alert("Edit flow placeholder")}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Create Modal (only mounted when showCreate = true) */}
      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={() => setShowCreate(false)} className="absolute inset-0 bg-slate-900/40" />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Create Leave Request</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Submit a new request on behalf of an employee (defaults to Pending).
                  </div>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">Employee name</label>
                  <input
                    value={cEmployeeName}
                    onChange={(e) => setCEmployeeName(e.target.value)}
                    placeholder="e.g., Maria Borg"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Employee ID</label>
                  <input
                    value={cEmployeeId}
                    onChange={(e) => setCEmployeeId(e.target.value)}
                    placeholder="e.g., EMP-0123"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Department</label>
                  <input
                    value={cDepartment}
                    onChange={(e) => setCDepartment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Role</label>
                  <input
                    value={cRole}
                    onChange={(e) => setCRole(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Leave type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value as LeaveType)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Unpaid</option>
                    <option>Compassionate</option>
                    <option>Study</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Manager</label>
                  <input
                    value={cManager}
                    onChange={(e) => setCManager(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Start date</label>
                  <input
                    type="date"
                    value={cStart}
                    onChange={(e) => setCStart(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">End date</label>
                  <input
                    type="date"
                    value={cEnd}
                    onChange={(e) => setCEnd(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600">Reason</label>
                  <textarea
                    value={cReason}
                    onChange={(e) => setCReason(e.target.value)}
                    placeholder="Short reason for leave..."
                    className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 p-5">
              <button
                onClick={resetCreate}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    resetCreate();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCreate}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
