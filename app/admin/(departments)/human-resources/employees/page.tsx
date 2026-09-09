"use client";

import * as React from "react";
import Link from "next/link";

/** =========================
 *  Departments (as requested)
 *  ========================= */
const DEPARTMENTS = [
  "Administration & Accounts",
  "Sports Development Unit",
  "Sports and Leisure Officer",
  "Europa Sports Officer",
  "Lifeguards",
  "Facilities",
  "Summer Sports Programme",
] as const;

type DepartmentName = (typeof DEPARTMENTS)[number];

type EmployeeStatus = "Active" | "On Leave" | "Inactive";
type EmployeeType = "Staff" | "Manager";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  department: DepartmentName;
  jobTitle: string;
  type: EmployeeType;
  status: EmployeeStatus;
  email: string;
  phone?: string;
  location?: string;
  startDate?: string;
  managerName?: string;
};

/** =========================
 *  IMPORTANT:
 *  Paste your EXISTING HR employees here
 *  (replace this sample data completely)
 *  ========================= */
const EMPLOYEES: Employee[] = [
  // Replace these with your real staff list used elsewhere in HR
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
  },
  {
    id: "emp_002",
    firstName: "Aisha",
    lastName: "Khan",
    department: "Administration & Accounts",
    jobTitle: "Accounts Officer",
    type: "Staff",
    status: "Active",
    email: "aisha.khan@gsla.local",
    phone: "+350 555 0122",
    location: "Head Office",
    startDate: "2022-11-03",
    managerName: "Mark Thompson",
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
  },
  {
    id: "emp_004",
    firstName: "Liam",
    lastName: "Owen",
    department: "Sports Development Unit",
    jobTitle: "Sports Development Officer",
    type: "Staff",
    status: "Active",
    email: "liam.owen@gsla.local",
    phone: "+350 555 0166",
    location: "Community Centre",
    startDate: "2024-01-15",
    managerName: "Nadia Hussein",
  },
  {
    id: "emp_005",
    firstName: "Sofia",
    lastName: "Reyes",
    department: "Facilities",
    jobTitle: "Facilities Manager",
    type: "Manager",
    status: "Active",
    email: "sofia.reyes@gsla.local",
    phone: "+350 555 0144",
    location: "Sports Complex",
    startDate: "2020-09-01",
    managerName: "—",
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

export default function EmployeesPage() {
  const [tab, setTab] = React.useState<"employees" | "departments">("employees");
  const [query, setQuery] = React.useState<string>("");
  const [deptFilter, setDeptFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedId, setSelectedId] = React.useState<string>(EMPLOYEES[0]?.id ?? "");

  // Always show ALL departments (even if empty)
  const departments = React.useMemo(() => {
    const counts = new Map<string, { headcount: number; managerName: string }>();

    for (const name of DEPARTMENTS) {
      counts.set(name, { headcount: 0, managerName: "—" });
    }

    for (const e of EMPLOYEES) {
      const current = counts.get(e.department) ?? { headcount: 0, managerName: "—" };
      current.headcount += 1;
      if (e.type === "Manager") current.managerName = `${e.firstName} ${e.lastName}`;
      counts.set(e.department, current);
    }

    return Array.from(counts.entries()).map(([name, v]) => ({ name, ...v }));
  }, []);

  const stats = React.useMemo(() => {
    const totalEmployees = EMPLOYEES.length;
    const totalDepartments = DEPARTMENTS.length;
    const totalManagers = EMPLOYEES.filter((e) => e.type === "Manager").length;
    const onLeave = EMPLOYEES.filter((e) => e.status === "On Leave").length;
    return { totalEmployees, totalDepartments, totalManagers, onLeave };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return EMPLOYEES.filter((e) => {
      const matchesQuery =
        !q ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q);

      const matchesDept = deptFilter === "all" ? true : e.department === deptFilter;
      const matchesStatus = statusFilter === "all" ? true : e.status === statusFilter;

      return matchesQuery && matchesDept && matchesStatus;
    }).sort((a, b) => {
      if (a.type !== b.type) return a.type === "Manager" ? -1 : 1;
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    });
  }, [query, deptFilter, statusFilter]);

  const selected = React.useMemo(() => {
    return filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? EMPLOYEES[0];
  }, [filtered, selectedId]);

  React.useEffect(() => {
    if (!filtered.some((e) => e.id === selectedId) && filtered[0]) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-zinc-500">Employee profiles and department overview.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/hr"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Back to HR
          </Link>

          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-500">Total Employees</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalEmployees}</div>
          <div className="mt-2 text-xs text-zinc-500">Across all departments</div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-500">Departments</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalDepartments}</div>
          <div className="mt-2 text-xs text-zinc-500">Always shown (even empty)</div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-500">Managers</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalManagers}</div>
          <div className="mt-2 text-xs text-zinc-500">Approval roles</div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-500">On Leave</div>
          <div className="mt-1 text-3xl font-semibold">{stats.onLeave}</div>
          <div className="mt-2 text-xs text-zinc-500">Current status</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab("employees")}
          className={clsx(
            "rounded-xl px-4 py-2 text-sm font-medium border",
            tab === "employees"
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
          )}
        >
          Employees
        </button>
        <button
          onClick={() => setTab("departments")}
          className={clsx(
            "rounded-xl px-4 py-2 text-sm font-medium border",
            tab === "departments"
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
          )}
        >
          Departments
        </button>
      </div>

      {/* EMPLOYEES TAB */}
      {tab === "employees" ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <label className="text-xs font-medium text-zinc-600">Search</label>
                <input
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Search by name, email, job title…"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-[260px]">
                  <label className="text-xs font-medium text-zinc-600">Department</label>
                  <select
                    value={deptFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDeptFilter(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                  >
                    <option value="all">All departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[180px]">
                  <label className="text-xs font-medium text-zinc-600">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                  >
                    <option value="all">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setQuery("");
                    setDeptFilter("all");
                    setStatusFilter("all");
                  }}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* List + Preview */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* List */}
            <div className="rounded-2xl border border-zinc-200 bg-white lg:col-span-2">
              <div className="p-4 border-b border-zinc-100">
                <div className="font-semibold">Employee Directory</div>
                <div className="text-sm text-zinc-500">Click a row to preview details.</div>
              </div>

              <div className="divide-y">
                {filtered.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500">No employees match your filters.</div>
                ) : (
                  filtered.map((e) => {
                    const isSelected = e.id === selected?.id;
                    return (
                      <button
                        key={e.id}
                        onClick={() => setSelectedId(e.id)}
                        className={clsx(
                          "w-full text-left p-4 hover:bg-zinc-50",
                          isSelected && "bg-zinc-50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center font-semibold">
                              {initials(e.firstName, e.lastName)}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="font-medium truncate">
                                  {e.firstName} {e.lastName}
                                </div>
                                {typePill(e.type)}
                                {statusPill(e.status)}
                              </div>
                              <div className="text-sm text-zinc-500 truncate">
                                {e.jobTitle} • {e.department}
                              </div>
                            </div>
                          </div>

                          <span className="text-zinc-400">›</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-zinc-200 bg-white">
              <div className="p-4 border-b border-zinc-100">
                <div className="font-semibold">Profile Preview</div>
                <div className="text-sm text-zinc-500">Quick view of key details.</div>
              </div>

              <div className="p-4 space-y-4">
                {!selected ? (
                  <div className="text-sm text-zinc-500">Select an employee to preview.</div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-lg font-semibold">
                        {initials(selected.firstName, selected.lastName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {selected.firstName} {selected.lastName}
                        </div>
                        <div className="text-sm text-zinc-500 truncate">{selected.jobTitle}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {typePill(selected.type)}
                          {statusPill(selected.status)}
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Department</span>
                        <span className="font-medium text-right">{selected.department}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Email</span>
                        <span className="font-medium text-right truncate">{selected.email}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Phone</span>
                        <span className="font-medium text-right">{selected.phone ?? "—"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Location</span>
                        <span className="font-medium text-right">{selected.location ?? "—"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Start date</span>
                        <span className="font-medium text-right">{selected.startDate ?? "—"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-zinc-500">Manager</span>
                        <span className="font-medium text-right">{selected.managerName ?? "—"}</span>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100" />

                    <div className="grid gap-2">
                      <Link
                        href={`/admin/hr/employees/${selected.id}`}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium hover:bg-zinc-50"
                      >
                        Open Full Profile
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                          Edit
                        </button>
                        <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                          Actions
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DEPARTMENTS TAB */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <div key={d.name} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="font-semibold">{d.name}</div>
              <div className="mt-1 text-sm text-zinc-500">{d.headcount} staff</div>

              <div className="mt-3 text-sm">
                <span className="text-zinc-500">Manager: </span>
                <span className="font-medium">{d.managerName}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                  View Team
                </button>
                <button className="flex-1 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                  Department Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
