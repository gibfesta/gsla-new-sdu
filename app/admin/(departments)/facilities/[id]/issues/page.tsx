"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  Filter,
  Plus,
  Send,
  Wrench,
  User,
  Camera,
  ShieldAlert,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type IssueStatus =
  | "New"
  | "Reviewed"
  | "Sent to Facility Manager"
  | "In Progress"
  | "Resolved"
  | "Closed";

type IssuePriority = "Low" | "Medium" | "High";

type IssueCategory =
  | "Lighting"
  | "Playing Surface"
  | "Toilets"
  | "Safety Hazard"
  | "Vandalism"
  | "General Maintenance"
  | "Other";

type FacilityIssue = {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy: string;
  reportedOn: string;
  assignedTo: string;
  photos: number;
};

const facility = {
  id: "fac-001",
  name: "Europa Sports Complex",
};

const mockIssues: FacilityIssue[] = [
  {
    id: "ISS-001",
    title: "Floodlight fault near east side pitch",
    category: "Lighting",
    description:
      "Two floodlights on the east side of the main pitch are not functioning during evening sessions.",
    status: "In Progress",
    priority: "High",
    reportedBy: "GSLA Staff",
    reportedOn: "09 Apr 2026",
    assignedTo: "Maintenance Team",
    photos: 3,
  },
  {
    id: "ISS-002",
    title: "Wear and tear around goalmouth area",
    category: "Playing Surface",
    description:
      "Visible wear in the goalmouth area affecting surface consistency during training and matches.",
    status: "Reviewed",
    priority: "Medium",
    reportedBy: "Facility Manager",
    reportedOn: "06 Apr 2026",
    assignedTo: "Grounds Team",
    photos: 2,
  },
  {
    id: "ISS-003",
    title: "Changing room tap leaking",
    category: "General Maintenance",
    description:
      "Tap in changing room 2 has a steady leak and may require replacement.",
    status: "New",
    priority: "Low",
    reportedBy: "Club Official",
    reportedOn: "11 Apr 2026",
    assignedTo: "Unassigned",
    photos: 1,
  },
  {
    id: "ISS-004",
    title: "Loose barrier near spectator seating",
    category: "Safety Hazard",
    description:
      "Barrier adjacent to spectator seating appears unstable and should be inspected urgently.",
    status: "Sent to Facility Manager",
    priority: "High",
    reportedBy: "Volunteer",
    reportedOn: "08 Apr 2026",
    assignedTo: "Facility Manager",
    photos: 4,
  },
  {
    id: "ISS-005",
    title: "Toilet cubicle door latch damaged",
    category: "Toilets",
    description:
      "Door latch in one of the toilet cubicles is broken and no longer closes correctly.",
    status: "Resolved",
    priority: "Low",
    reportedBy: "Member",
    reportedOn: "02 Apr 2026",
    assignedTo: "Maintenance Team",
    photos: 0,
  },
];

function statusStyles(status: IssueStatus) {
  switch (status) {
    case "New":
      return {
        icon: AlertTriangle,
        className: "bg-slate-50 text-slate-700 ring-slate-200",
      };
    case "Reviewed":
      return {
        icon: ClipboardList,
        className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      };
    case "Sent to Facility Manager":
      return {
        icon: Send,
        className: "bg-cyan-50 text-cyan-700 ring-cyan-200",
      };
    case "In Progress":
      return {
        icon: Wrench,
        className: "bg-amber-50 text-amber-700 ring-amber-200",
      };
    case "Resolved":
      return {
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      };
    case "Closed":
      return {
        icon: ShieldAlert,
        className: "bg-rose-50 text-rose-700 ring-rose-200",
      };
    default:
      return {
        icon: AlertTriangle,
        className: "bg-slate-50 text-slate-700 ring-slate-200",
      };
  }
}

function priorityStyles(priority: IssuePriority) {
  if (priority === "High") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  if (priority === "Medium") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

export default function FacilityIssuesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | "All">(
    "All"
  );

  const filteredIssues = useMemo(() => {
    const q = search.trim().toLowerCase();

    return mockIssues.filter((issue) => {
      const matchesSearch =
        !q ||
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        issue.reportedBy.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || issue.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, statusFilter, priorityFilter]);

  const openIssues = mockIssues.filter(
    (issue) => issue.status !== "Resolved" && issue.status !== "Closed"
  ).length;

  const highPriority = mockIssues.filter(
    (issue) => issue.priority === "High"
  ).length;

  const resolvedIssues = mockIssues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0C2F57] to-[#174A84] text-white shadow-sm">
        <div className="px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <button
                onClick={() => router.push(`/admin/facilities/${facility.id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to Facility
              </button>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                <ClipboardList size={14} />
                Facility Issues
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
                {facility.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                Review, filter, and track all reported issues associated with
                this facility.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push(`/admin/facilities/${facility.id}/edit`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <Wrench size={16} />
                Edit Facility
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2F57] transition hover:brightness-95"
              >
                <Plus size={16} />
                Report New Issue
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Issues"
          value={mockIssues.length}
          subtitle="All reported issues"
        />
        <StatCard
          label="Open Issues"
          value={openIssues}
          subtitle="Still requiring action"
        />
        <StatCard
          label="High Priority"
          value={highPriority}
          subtitle="Urgent or safety-related"
        />
        <StatCard
          label="Resolved"
          value={resolvedIssues}
          subtitle="Completed and fixed"
        />
      </section>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
                placeholder="Search issues, categories, descriptions, or reporter..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <Filter size={16} className="text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as IssueStatus | "All")
                  }
                  className="bg-transparent text-sm text-slate-900 outline-none"
                >
                  <option value="All">All statuses</option>
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Sent to Facility Manager">
                    Sent to Facility Manager
                  </option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(e.target.value as IssuePriority | "All")
                  }
                  className="bg-transparent text-sm text-slate-900 outline-none"
                >
                  <option value="All">All priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Issue List</h2>
          <p className="text-sm text-slate-500">
            {filteredIssues.length} issue{filteredIssues.length === 1 ? "" : "s"} shown
          </p>
        </div>

        {!filteredIssues.length ? (
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-10 text-center">
              <div className="text-base font-semibold text-slate-900">
                No issues found
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue) => {
            const status = statusStyles(issue.status);
            const StatusIcon = status.icon;

            return (
              <Card
                key={issue.id}
                className="rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md"
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {issue.id}
                        </span>

                        <span
                          className={classNames(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                            status.className
                          )}
                        >
                          <StatusIcon size={14} />
                          {issue.status}
                        </span>

                        <span
                          className={classNames(
                            "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                            priorityStyles(issue.priority)
                          )}
                        >
                          {issue.priority} Priority
                        </span>

                        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {issue.category}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        {issue.title}
                      </h3>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {issue.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <User size={15} />
                          {issue.reportedBy}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={15} />
                          {issue.reportedOn}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Wrench size={15} />
                          {issue.assignedTo}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Camera size={15} />
                          {issue.photos} photo{issue.photos === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:flex-col">
                      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">
                        View Issue
                      </button>

                      <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Update Status
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}