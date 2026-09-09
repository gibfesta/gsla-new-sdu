"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type EmployeeStatus = "Active" | "On Leave" | "Inactive";
type EmployeeType = "Staff" | "Manager";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  jobTitle: string;
  type: EmployeeType;
  status: EmployeeStatus;
  email: string;
  phone?: string;
  location?: string;
  startDate?: string;
  managerName?: string;
  emergencyContact?: { name: string; phone: string };
};

/** -------------------------------------------------------
 *  Replace this with your REAL HR employees data source
 *  (must match the ids used in the Employees dashboard)
 *  ------------------------------------------------------ */
const EMPLOYEES: Employee[] = [
  {
    id: "emp_001",
    firstName: "Mark",
    lastName: "Thompson",
    department: "Administration & Accounts",
    jobTitle: "HR Administrator",
    type: "Manager",
    status: "Active",
    email: "mark.thompson@gsla.local",
    phone: "+350 555 0101",
    location: "Head Office",
    startDate: "2023-05-12",
    managerName: "—",
    emergencyContact: { name: "Sarah Thompson", phone: "+350 555 9901" },
  },
  {
    id: "emp_003",
    firstName: "Nadia",
    lastName: "Hussein",
    department: "Sports Development Unit",
    jobTitle: "Sports Development Manager",
    type: "Manager",
    status: "Active",
    email: "nadia.hussein@gsla.local",
    phone: "+350 555 0177",
    location: "Community Centre",
    startDate: "2019-07-22",
    managerName: "—",
    emergencyContact: { name: "Omar Hussein", phone: "+350 555 9911" },
  },
  {
    id: "emp_006",
    firstName: "Daniel",
    lastName: "Costa",
    department: "Facilities",
    jobTitle: "Facilities Coordinator",
    type: "Staff",
    status: "On Leave",
    email: "daniel.costa@gsla.local",
    phone: "+350 555 0133",
    location: "Sports Complex",
    startDate: "2021-02-18",
    managerName: "Sofia Reyes",
    emergencyContact: { name: "Ana Costa", phone: "+350 555 9922" },
  },
];

function clsx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "muted";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
        tone === "neutral" && "bg-white/60 border-zinc-200 text-zinc-800",
        tone === "success" && "bg-emerald-50 border-emerald-200 text-emerald-800",
        tone === "warning" && "bg-amber-50 border-amber-200 text-amber-800",
        tone === "muted" && "bg-zinc-50 border-zinc-200 text-zinc-600"
      )}
    >
      {children}
    </span>
  );
}

function statusPill(status: EmployeeStatus) {
  if (status === "Active") return <Pill tone="success">Active</Pill>;
  if (status === "On Leave") return <Pill tone="warning">On Leave</Pill>;
  return <Pill tone="muted">Inactive</Pill>;
}

function typePill(type: EmployeeType) {
  return type === "Manager" ? <Pill>Manager</Pill> : <Pill tone="muted">Staff</Pill>;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  // Keep it simple (YYYY-MM-DD) without timezone surprises
  return iso;
}

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const employee = React.useMemo(() => {
    if (!id) return undefined;
    return EMPLOYEES.find((e) => e.id === id);
  }, [id]);

  const [tab, setTab] = React.useState<
    "overview" | "employment" | "leave" | "timesheets" | "documents" | "notes"
  >("overview");

  if (!id) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-lg font-semibold">Missing employee id</div>
          <div className="mt-2 text-sm text-zinc-500">
            This page requires a valid employee id in the URL.
          </div>
          <div className="mt-4">
            <Link
              href="/admin/hr/employees"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/hr/employees"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Back to Employees
          </Link>

          <Link
            href="/admin/hr"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Back to HR
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-lg font-semibold">Employee not found</div>
          <div className="mt-2 text-sm text-zinc-500">
            No employee exists with id: <span className="font-mono">{id}</span>
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            Tip: Ensure the ids used in the Employees dashboard match the data source used here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb / back */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-zinc-500">
          <Link href="/admin/hr" className="hover:underline">
            HR
          </Link>{" "}
          <span className="mx-1">›</span>
          <Link href="/admin/hr/employees" className="hover:underline">
            Employees
          </Link>{" "}
          <span className="mx-1">›</span>
          <span className="text-zinc-700 font-medium">
            {employee.firstName} {employee.lastName}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/hr/employees"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Back to Employees
          </Link>
          <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
            Edit Profile
          </button>
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            Actions
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl font-semibold">
              {initials(employee.firstName, employee.lastName)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold truncate">
                  {employee.firstName} {employee.lastName}
                </h1>
                {typePill(employee.type)}
                {statusPill(employee.status)}
              </div>
              <div className="mt-1 text-sm text-zinc-500 truncate">
                {employee.jobTitle} • {employee.department}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="text-zinc-600">
                  <span className="text-zinc-500">Email:</span>{" "}
                  <span className="font-medium">{employee.email}</span>
                </span>
                <span className="text-zinc-600">
                  <span className="text-zinc-500">Phone:</span>{" "}
                  <span className="font-medium">{employee.phone ?? "—"}</span>
                </span>
                <span className="text-zinc-600">
                  <span className="text-zinc-500">Location:</span>{" "}
                  <span className="font-medium">{employee.location ?? "—"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-500">Start date</div>
              <div className="mt-1 text-sm font-semibold">{formatDate(employee.startDate)}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-500">Manager</div>
              <div className="mt-1 text-sm font-semibold truncate">
                {employee.managerName ?? "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs text-zinc-500">Employee ID</div>
              <div className="mt-1 text-sm font-semibold font-mono">{employee.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          ["overview", "Overview"],
          ["employment", "Employment"],
          ["leave", "Leave"],
          ["timesheets", "Timesheets"],
          ["documents", "Documents"],
          ["notes", "Notes"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={clsx(
              "rounded-xl px-4 py-2 text-sm font-medium border",
              tab === key
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="font-semibold">Overview</div>
              <div className="mt-2 text-sm text-zinc-500">
                Snapshot of employee details, status, and quick HR info.
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Job title" value={employee.jobTitle} />
                <InfoRow label="Status" value={employee.status} />
                <InfoRow label="Type" value={employee.type} />
                <InfoRow label="Start date" value={formatDate(employee.startDate)} />
                <InfoRow label="Manager" value={employee.managerName ?? "—"} />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="font-semibold">Recent Activity</div>
              <div className="mt-2 text-sm text-zinc-500">UI placeholder (connect to data later).</div>

              <div className="mt-4 space-y-3">
                <TimelineItem title="Profile viewed" meta="Today • HR Admin" />
                <TimelineItem title="Timesheet submitted" meta="Last week • Pending approval" />
                <TimelineItem title="Leave request updated" meta="2 weeks ago • Approved" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="font-semibold">Contacts</div>
              <div className="mt-4 space-y-3 text-sm">
                <InfoRow label="Email" value={employee.email} mono />
                <InfoRow label="Phone" value={employee.phone ?? "—"} />
                <InfoRow label="Location" value={employee.location ?? "—"} />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="font-semibold">Emergency Contact</div>
              <div className="mt-4 space-y-2 text-sm">
                <InfoRow
                  label="Name"
                  value={employee.emergencyContact?.name ?? "—"}
                />
                <InfoRow
                  label="Phone"
                  value={employee.emergencyContact?.phone ?? "—"}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="font-semibold">Quick Actions</div>
              <div className="mt-4 grid gap-2">
                <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                  Create leave request
                </button>
                <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                  Open timesheets
                </button>
                <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                  Add note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "employment" && (
        <Panel title="Employment">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Department" value={employee.department} />
            <InfoRow label="Job title" value={employee.jobTitle} />
            <InfoRow label="Employee type" value={employee.type} />
            <InfoRow label="Start date" value={formatDate(employee.startDate)} />
            <InfoRow label="Manager" value={employee.managerName ?? "—"} />
            <InfoRow label="Work location" value={employee.location ?? "—"} />
          </div>
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Add payroll fields, contract type, salary band, and probation dates here (UI placeholder).
          </div>
        </Panel>
      )}

      {tab === "leave" && (
        <Panel title="Leave">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Allowance" value="24 days" sub="Annual" />
            <StatCard label="Used" value="8 days" sub="This year" />
            <StatCard label="Remaining" value="16 days" sub="Available" />
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white">
            <div className="p-4 border-b border-zinc-100">
              <div className="font-semibold">Leave Requests</div>
              <div className="text-sm text-zinc-500">UI placeholder list.</div>
            </div>
            <div className="p-4 space-y-3">
              <RequestRow title="Annual Leave" meta="Jan 10–12 • Approved" />
              <RequestRow title="Sick Leave" meta="Dec 02 • Approved" />
              <RequestRow title="Annual Leave" meta="Nov 18–19 • Pending" />
            </div>
          </div>
        </Panel>
      )}

      {tab === "timesheets" && (
        <Panel title="Timesheets">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="This week" value="32h" sub="Submitted" />
            <StatCard label="Last week" value="38h" sub="Approved" />
            <StatCard label="Exceptions" value="1" sub="Needs review" />
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Link this to your Timesheets module later (UI placeholder).
          </div>
        </Panel>
      )}

      {tab === "documents" && (
        <Panel title="Documents">
          <div className="rounded-2xl border border-zinc-200 bg-white">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="font-semibold">Employee Documents</div>
                <div className="text-sm text-zinc-500">Upload and manage files (UI placeholder).</div>
              </div>
              <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                Upload
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <DocRow name="Contract.pdf" meta="Added 2025-06-01 • PDF" />
              <DocRow name="ID_Verification.png" meta="Added 2025-05-15 • Image" />
              <DocRow name="Training_Certificates.zip" meta="Added 2025-02-10 • Archive" />
            </div>
          </div>
        </Panel>
      )}

      {tab === "notes" && (
        <Panel title="Notes">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <label className="text-xs font-medium text-zinc-600">Add note</label>
            <textarea
              className="mt-2 w-full min-h-[110px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Write HR notes here… (UI placeholder)"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                Cancel
              </button>
              <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                Save Note
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white">
            <div className="p-4 border-b border-zinc-100">
              <div className="font-semibold">Note History</div>
              <div className="text-sm text-zinc-500">UI placeholder list.</div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <NoteCard title="Return-to-work meeting" meta="2025-12-05 • HR Admin">
                Discussed schedule adjustments and follow-up date.
              </NoteCard>
              <NoteCard title="Training reminder" meta="2025-10-22 • Manager">
                Safety refresher scheduled for next month.
              </NoteCard>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

/** ---------- Small UI helpers ---------- */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="font-semibold">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={clsx("mt-1 text-sm font-semibold", mono && "font-mono")}>
        {value}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{sub}</div>
    </div>
  );
}

function TimelineItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-zinc-500">{meta}</div>
    </div>
  );
}

function RequestRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-zinc-500">{meta}</div>
      </div>
      <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50">
        View
      </button>
    </div>
  );
}

function DocRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="min-w-0">
        <div className="font-medium truncate">{name}</div>
        <div className="text-sm text-zinc-500">{meta}</div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50">
          Download
        </button>
        <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50">
          Remove
        </button>
      </div>
    </div>
  );
}

function NoteCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-zinc-500">{meta}</div>
        </div>
        <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50">
          Edit
        </button>
      </div>
      <div className="mt-3 text-sm text-zinc-700">{children}</div>
    </div>
  );
}
