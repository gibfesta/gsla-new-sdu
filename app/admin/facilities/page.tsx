"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Plus,
  Pencil,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Upload,
  Trash2,
  ClipboardList,
  X,
  Building2,
  Wrench,
  Send,
  Eye,
  Clock,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

// UI unions (we’ll coerce DB values into these safely)
type FacilityStatus = "Operational" | "Limited" | "Closed";
type FacilityType =
  | "Park"
  | "Sports Centre"
  | "Grounds"
  | "Multi Sports Center"
  | "Courts";

type IssueStatus =
  | "New"
  | "Reviewed"
  | "Sent to Facility Manager"
  | "In Progress"
  | "Resolved"
  | "Closed";

type IssueCategory =
  | "Lighting"
  | "Playing surface"
  | "Toilets"
  | "Safety hazard"
  | "Vandalism"
  | "Other";

type UserRole =
  | "Member"
  | "Volunteer"
  | "Club Official"
  | "Association"
  | "GSLA Staff"
  | "System Admin";

type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  suburb: string;
  address: string;
  sportsSupported: string[];
  amenities: {
    toilets: boolean;
    lighting: boolean;
    parking: boolean;
    changerooms: boolean;
    seating: boolean;
    water: boolean;
  };
  condition: {
    rating: number;
    lastInspection: string;
    notes: string[];
  };
  manager: {
    org: "Council" | "Private" | "GSLA";
    name: string;
    title: string;
    email: string;
    phone: string;
  };
};

type Issue = {
  id: string;
  facilityId: string;
  createdAt: string;
  updatedAt: string;
  reportedBy: {
    name: string;
    role: Exclude<UserRole, "GSLA Staff" | "System Admin">;
    clubOrAssoc?: string;
  };
  category: IssueCategory;
  description: string;
  urgency: "Normal" | "High";
  status: IssueStatus;
  internalNotes: string;
  photos: Array<{
    name: string;
    dataUrl: string;
  }>;
};

// DB row shape coming from /api/facilities (matches your Prisma model)
type DbFacilityRow = {
  id: string;
  name: string | null;
  type: string | null;
  status: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created__at: string;
  updated_at: string;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function badgeForFacilityStatus(s: FacilityStatus) {
  if (s === "Operational")
    return {
      cls: "bg-emerald-50 text-emerald-800 ring-emerald-200",
      icon: CheckCircle2,
    };
  if (s === "Limited")
    return {
      cls: "bg-amber-50 text-amber-800 ring-amber-200",
      icon: AlertTriangle,
    };
  return {
    cls: "bg-rose-50 text-rose-800 ring-rose-200",
    icon: ShieldAlert,
  };
}

function badgeForIssueStatus(s: IssueStatus) {
  switch (s) {
    case "New":
      return "bg-slate-50 text-slate-700 ring-slate-200";
    case "Reviewed":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "Sent to Facility Manager":
      return "bg-cyan-50 text-cyan-700 ring-cyan-200";
    case "In Progress":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "Closed":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

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
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
        toneCls
      )}
    >
      {children}
    </span>
  );
}

function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5">
          <div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-slate-600">{description}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(
    16
  )}`;
}

async function filesToDataUrls(
  files: File[]
): Promise<Array<{ name: string; dataUrl: string }>> {
  const limited = files.slice(0, 5);
  const readers = limited.map(
    (file) =>
      new Promise<{ name: string; dataUrl: string }>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () =>
          resolve({ name: file.name, dataUrl: String(fr.result || "") });
        fr.onerror = () => reject(new Error("Failed to read file"));
        fr.readAsDataURL(file);
      })
  );
  const out = await Promise.allSettled(readers);
  return out
    .filter(
      (r): r is PromiseFulfilledResult<{ name: string; dataUrl: string }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

// Coerce DB strings to your UI unions safely
const FACILITY_TYPES: FacilityType[] = [
  "Park",
  "Sports Centre",
  "Grounds",
  "Multi Sports Center",
  "Courts",
];

const FACILITY_STATUSES: FacilityStatus[] = ["Operational", "Limited", "Closed"];

function asFacilityType(v: string): FacilityType {
  return (FACILITY_TYPES as string[]).includes(v)
    ? (v as FacilityType)
    : "Grounds";
}

function asFacilityStatus(v: string): FacilityStatus {
  return (FACILITY_STATUSES as string[]).includes(v)
    ? (v as FacilityStatus)
    : "Operational";
}

function dbRowToUiFacility(r: DbFacilityRow): Facility {
  const notesLines = (r.notes || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const suburb = "";

  return {
    id: r.id,
    name: r.name || "Unnamed facility",
    type: asFacilityType(r.type || ""),
    status: asFacilityStatus(r.status || ""),
    suburb,
    address: r.address || "",
    sportsSupported: [],
    amenities: {
      toilets: false,
      lighting: false,
      parking: false,
      changerooms: false,
      seating: false,
      water: false,
    },
    condition: {
      rating: 3,
      lastInspection: r.updated_at || r.created__at || new Date().toISOString(),
      notes: notesLines.length ? notesLines : [],
    },
    manager: {
      org: "GSLA",
      name: r.contact_email ? r.contact_email.split("@")[0] : "Facility Manager",
      title: "Facility Manager",
      email: r.contact_email || "",
      phone: r.contact_phone || "",
    },
  };
}

export default function FacilitiesPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("GSLA Staff");

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FacilityType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "All">(
    "All"
  );
  const [onlyWithIssues, setOnlyWithIssues] = useState(false);

  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null
  );
  const selectedFacility = useMemo(
    () => facilities.find((f) => f.id === selectedFacilityId) || null,
    [facilities, selectedFacilityId]
  );

  const [tab, setTab] = useState<"Overview" | "Issues">("Overview");

  const [reportOpen, setReportOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const [rCategory, setRCategory] = useState<IssueCategory>("Other");
  const [rUrgency, setRUrgency] = useState<Issue["urgency"]>("Normal");
  const [rDescription, setRDescription] = useState("");
  const [rPhotos, setRPhotos] = useState<
    Array<{ name: string; dataUrl: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [issuesView, setIssuesView] = useState<"All" | "Open" | "Mine">("Open");
  const [issueSearch, setIssueSearch] = useState("");

  const canLodgeIssue = role !== "GSLA Staff" && role !== "System Admin";
  const canManageIssues = role === "GSLA Staff" || role === "System Admin";

  // ✅ CHANGE: move load() out so we can re-run it after returning from edit/add
  async function loadFacilities() {
    const res = await fetch("/api/facilities", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load facilities");
    const data = (await res.json()) as DbFacilityRow[];
    const mapped = (data ?? []).map(dbRowToUiFacility);
    setFacilities(mapped);
    setSelectedFacilityId((prev) => prev ?? mapped[0]?.id ?? null);
    setIssues([]); // still local-only
  }

  // ✅ LOAD FACILITIES FROM DATABASE (via API)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await loadFacilities();
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setFacilities([]);
          setIssues([]);
          setSelectedFacilityId(null);
        }
      }
    }

    load();

    // ✅ CHANGE: when you come BACK from /new or /[id], refresh once
    const onFocus = () => {
      // ignore if unmounted
      if (cancelled) return;
      load().catch(() => {});
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const issuesByFacility = useMemo(() => {
    const map = new Map<string, Issue[]>();
    for (const i of issues) {
      const arr = map.get(i.facilityId) ?? [];
      arr.push(i);
      map.set(i.facilityId, arr);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      map.set(k, arr);
    }
    return map;
  }, [issues]);

  const openIssueCount = (facilityId: string) => {
    const arr = issuesByFacility.get(facilityId) ?? [];
    return arr.filter((x) => x.status !== "Resolved" && x.status !== "Closed")
      .length;
  };

  const filteredFacilities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return facilities
      .filter((f) => {
        const matchesQ =
          !q ||
          f.name.toLowerCase().includes(q) ||
          f.suburb.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.sportsSupported.some((s) => s.toLowerCase().includes(q));
        const matchesType = typeFilter === "All" || f.type === typeFilter;
        const matchesStatus =
          statusFilter === "All" || f.status === statusFilter;
        const matchesIssues = !onlyWithIssues || openIssueCount(f.id) > 0;
        return matchesQ && matchesType && matchesStatus && matchesIssues;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    facilities,
    search,
    typeFilter,
    statusFilter,
    onlyWithIssues,
    issuesByFacility,
  ]);

  const selectedIssues = useMemo(() => {
    if (!selectedFacility) return [];
    return issuesByFacility.get(selectedFacility.id) ?? [];
  }, [selectedFacility, issuesByFacility]);

  // (still demo-only; kept for future issues wiring)
  const issuesDashboard = useMemo(() => {
    const q = issueSearch.trim().toLowerCase();
    const mineName = "You (Demo)";
    const filtered = issues.filter((i) => {
      const facility = facilities.find((f) => f.id === i.facilityId);
      const isOpen = i.status !== "Resolved" && i.status !== "Closed";
      const viewOk =
        issuesView === "All"
          ? true
          : issuesView === "Open"
            ? isOpen
            : i.reportedBy.name === mineName;

      const qOk =
        !q ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q) ||
        (facility?.name?.toLowerCase().includes(q) ?? false) ||
        (facility?.suburb?.toLowerCase().includes(q) ?? false);

      return viewOk && qOk;
    });

    filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return filtered;
  }, [issues, facilities, issuesView, issueSearch]);

  function resetReportForm() {
    setRCategory("Other");
    setRUrgency("Normal");
    setRDescription("");
    setRPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onPickPhotos(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    const data = await filesToDataUrls(arr);
    setRPhotos((prev) => [...prev, ...data].slice(0, 5));
  }

  function submitIssue() {
    if (!selectedFacility) return;
    const desc = rDescription.trim();
    if (desc.length < 10) return;

    const now = new Date().toISOString();

    const reporterRole: Exclude<UserRole, "GSLA Staff" | "System Admin"> =
      role === "Member" ||
      role === "Volunteer" ||
      role === "Club Official" ||
      role === "Association"
        ? role
        : "Member";

    const newIssue: Issue = {
      id: uid("i"),
      facilityId: selectedFacility.id,
      createdAt: now,
      updatedAt: now,
      reportedBy: {
        name: "You (Demo)",
        role: reporterRole,
        clubOrAssoc:
          role === "Club Official"
            ? "Example Club"
            : role === "Association"
              ? "Example Association"
              : undefined,
      },
      category: rCategory,
      description: desc,
      urgency: rUrgency,
      status: "New",
      internalNotes: "",
      photos: rPhotos,
    };

    setIssues((prev) => [newIssue, ...prev]);
    setTab("Issues");
    setReportOpen(false);
    resetReportForm();
  }

  function updateIssue(issueId: string, patch: Partial<Issue>) {
    const now = new Date().toISOString();
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, ...patch, updatedAt: now } : i
      )
    );
  }

  function deleteIssue(issueId: string) {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
  }

  const facilityTypes: FacilityType[] = FACILITY_TYPES;
  const facilityStatuses: FacilityStatus[] = FACILITY_STATUSES;
  const issueStatuses: IssueStatus[] = [
    "New",
    "Reviewed",
    "Sent to Facility Manager",
    "In Progress",
    "Resolved",
    "Closed",
  ];
  const issueCategories: IssueCategory[] = [
    "Lighting",
    "Playing surface",
    "Toilets",
    "Safety hazard",
    "Vandalism",
    "Other",
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Facilities</h1>
          <p className="mt-2 text-slate-600">
            Facility directory + complaints & photo reporting workflow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold text-slate-600">View as</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
            >
              {(
                [
                  "Member",
                  "Volunteer",
                  "Club Official",
                  "Association",
                  "GSLA Staff",
                  "System Admin",
                ] as UserRole[]
              ).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setManageOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <ClipboardList size={16} />
            Issues Dashboard
          </button>

          {/* ✅ FULL PAGE ADD (already correct) */}
          <button
            onClick={() => router.push("/admin/facilities/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <Plus size={16} />
            Add Facility
          </button>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search facility, suburb, address, sport..."
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
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as FacilityType | "All")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option value="All">All types</option>
                  {facilityTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as FacilityStatus | "All")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option value="All">All statuses</option>
                  {facilityStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyWithIssues}
                  onChange={(e) => setOnlyWithIssues(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Only with open issues
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Facilities
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {filteredFacilities.length} shown • {facilities.length} total
                </div>
              </div>
              <Pill tone="indigo">
                <Clock size={14} />
                Live
              </Pill>
            </div>

            <div className="max-h-[70vh] overflow-auto p-2">
              {filteredFacilities.map((f) => {
                const active = f.id === selectedFacilityId;
                const { cls, icon: Icon } = badgeForFacilityStatus(f.status);
                const open = openIssueCount(f.id);

                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFacilityId(f.id);
                      setTab("Overview");
                    }}
                    className={classNames(
                      "w-full rounded-xl border p-4 text-left transition",
                      active
                        ? "border-[#0C2F57] bg-[#0C2F57]/5"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {f.name}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Building2 size={14} />
                            {f.type}
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            {f.suburb || "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={classNames(
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
                            cls
                          )}
                        >
                          <Icon size={14} />
                          {f.status}
                        </span>

                        {open > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
                            <AlertTriangle size={14} />
                            {open} open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-200">
                            <CheckCircle2 size={14} />
                            No open
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {f.sportsSupported.length ? (
                        <>
                          {f.sportsSupported.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                            >
                              {s}
                            </span>
                          ))}
                          {f.sportsSupported.length > 4 ? (
                            <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                              +{f.sportsSupported.length - 4}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                          No sports listed
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {!filteredFacilities.length ? (
                <div className="p-8 text-center text-sm text-slate-600">
                  No facilities match your filters.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardContent className="p-0">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-lg font-semibold text-slate-900">
                      {selectedFacility ? selectedFacility.name : "Select a facility"}
                    </div>
                    {selectedFacility ? (
                      <Pill
                        tone={
                          selectedFacility.status === "Operational"
                            ? "emerald"
                            : selectedFacility.status === "Limited"
                              ? "amber"
                              : "red"
                        }
                      >
                        {selectedFacility.status}
                      </Pill>
                    ) : null}
                  </div>

                  {selectedFacility ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={16} />
                        {selectedFacility.type}
                      </span>
                      <span className="opacity-50">•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedFacility.address}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-600">
                      Choose a facility from the list to see details.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                    {(["Overview", "Issues"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={classNames(
                          "rounded-lg px-3 py-2 text-sm font-semibold transition",
                          tab === t
                            ? "bg-[#0C2F57] text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {selectedFacility ? (
                    <>
                      {canLodgeIssue ? (
                        <button
                          onClick={() => setReportOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Camera size={16} />
                          Report Issue
                        </button>
                      ) : (
                        <Pill tone="slate">
                          <Eye size={14} />
                          Staff view
                        </Pill>
                      )}

                      {/* ✅ CHANGE: real navigation to full-page edit */}
                      <button
                        onClick={() => router.push(`/admin/facilities/${selectedFacility.id}`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* EVERYTHING BELOW stays the same UI as you pasted */}
            <div className="px-6 py-6">
              {!selectedFacility ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
                  Select a facility to view info and issues.
                </div>
              ) : tab === "Overview" ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Facility information
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            Operational details & contacts.
                          </div>
                        </div>
                        <Pill tone="indigo">
                          <MapPin size={14} />
                          {selectedFacility.suburb || "—"}
                        </Pill>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">
                            Supported sports
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedFacility.sportsSupported.length ? (
                              selectedFacility.sportsSupported.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-600">
                                Not set yet
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">
                            Amenities
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            {[
                              ["Toilets", selectedFacility.amenities.toilets],
                              ["Lighting", selectedFacility.amenities.lighting],
                              ["Parking", selectedFacility.amenities.parking],
                              ["Changerooms", selectedFacility.amenities.changerooms],
                              ["Seating", selectedFacility.amenities.seating],
                              ["Water", selectedFacility.amenities.water],
                            ].map(([label, ok]) => (
                              <div
                                key={label as string}
                                className="flex min-w-0 items-center gap-3"
                              >
                                <span
                                  className={classNames(
                                    "inline-flex h-5 w-5 flex-none items-center justify-center rounded-full ring-1",
                                    ok
                                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                      : "bg-rose-50 text-rose-700 ring-rose-200"
                                  )}
                                >
                                  {ok ? <CheckCircle2 size={14} /> : <X size={14} />}
                                </span>
                                <span className="min-w-0 truncate leading-5 text-slate-800">
                                  {label as string}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold text-slate-600">
                              Managed by
                            </div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">
                              {selectedFacility.manager.org} •{" "}
                              {selectedFacility.manager.title}
                            </div>
                            <div className="mt-1 text-sm text-slate-700">
                              {selectedFacility.manager.name}
                            </div>
                          </div>
                          <Pill tone="cyan">
                            <Building2 size={14} />
                            Contact
                          </Pill>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3">
                          <div className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                            <Mail size={16} className="mt-0.5 text-slate-500" />
                            <span className="break-all text-sm text-slate-800">
                              {selectedFacility.manager.email || "—"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                            <Phone size={16} className="text-slate-500" />
                            <span className="text-sm text-slate-800">
                              {selectedFacility.manager.phone || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Condition overview
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            Inspection snapshot & notes.
                          </div>
                        </div>
                        <Pill
                          tone={
                            selectedFacility.condition.rating >= 4
                              ? "emerald"
                              : selectedFacility.condition.rating === 3
                                ? "amber"
                                : "red"
                          }
                        >
                          <Wrench size={14} />
                          {selectedFacility.condition.rating}/5
                        </Pill>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-600">
                          Last inspection
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {formatDate(selectedFacility.condition.lastInspection)}
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-600">
                          Notes
                        </div>
                        {selectedFacility.condition.notes.length ? (
                          <ul className="mt-2 space-y-2 text-sm text-slate-800">
                            {selectedFacility.condition.notes.map((n, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-400" />
                                <span>{n}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-2 text-sm text-slate-700">
                            No notes yet
                          </div>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4">
                        <div className="text-sm font-semibold text-slate-900">
                          Quick actions
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setTab("Issues");
                              setManageOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <ClipboardList size={16} />
                            View all issues
                          </button>
                          <button
                            onClick={() =>
                              alert(
                                "Next: add a proper map link (Google Maps) using address."
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <MapPin size={16} />
                            Open map
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="amber">
                        <AlertTriangle size={14} />
                        {openIssueCount(selectedFacility.id)} open
                      </Pill>
                      <Pill tone="slate">
                        <ClipboardList size={14} />
                        {selectedIssues.length} total
                      </Pill>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {canManageIssues ? (
                        <button
                          onClick={() => setManageOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          <ClipboardList size={16} />
                          Manage in dashboard
                        </button>
                      ) : null}

                      {canLodgeIssue ? (
                        <button
                          onClick={() => setReportOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Camera size={16} />
                          Report Issue
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
                    Issues are not connected to the database yet.
                    <div className="mt-2 text-xs text-slate-500">
                      Next step: create an Issues table + /api/issues and load
                      them like facilities.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REPORT ISSUE MODAL (still local-only until you wire issues table) */}
      <Modal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
          resetReportForm();
        }}
        title="Report a facility issue"
        description={
          selectedFacility ? `Facility: ${selectedFacility.name}` : undefined
        }
      >
        {!selectedFacility ? (
          <div className="text-sm text-slate-600">Select a facility first.</div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-600">
                  Category
                </div>
                <select
                  value={rCategory}
                  onChange={(e) =>
                    setRCategory(e.target.value as IssueCategory)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                >
                  {issueCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600">
                  Urgency
                </div>
                <select
                  value={rUrgency}
                  onChange={(e) =>
                    setRUrgency(e.target.value as "Normal" | "High")
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (safety risk / urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600">
                Description
              </div>
              <textarea
                value={rDescription}
                onChange={(e) => setRDescription(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none"
                rows={5}
                placeholder="Explain the problem clearly (where it is, what’s wrong, how urgent, any impact on matches/training)."
              />
              <div className="mt-1 text-xs text-slate-500">
                Minimum 10 characters.
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Photos
                  </div>
                  <div className="text-xs text-slate-600">
                    Up to 5 images. (Currently local-only.)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onPickPhotos(e.target.files)}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                  <button
                    onClick={() => setRPhotos([])}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                    disabled={!rPhotos.length}
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                </div>
              </div>

              {rPhotos.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {rPhotos.map((p, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.dataUrl}
                        alt={p.name}
                        className="h-28 w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <div className="truncate text-xs text-slate-600">
                          {p.name}
                        </div>
                        <button
                          onClick={() =>
                            setRPhotos((prev) =>
                              prev.filter((_, j) => j !== idx)
                            )
                          }
                          className="rounded-lg border border-slate-200 p-1 text-slate-600 hover:bg-slate-50"
                          aria-label="Remove photo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
                  Add photos to help GSLA and the facility manager understand
                  the problem quickly.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => {
                  setReportOpen(false);
                  resetReportForm();
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitIssue}
                disabled={rDescription.trim().length < 10}
                className={classNames(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
                  rDescription.trim().length < 10
                    ? "bg-slate-300"
                    : "bg-[#0C2F57] hover:brightness-110"
                )}
              >
                <Send size={16} />
                Submit issue (local)
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Dashboard modal kept (will show empty until issues are wired) */}
      <Modal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        title="Facilities issues dashboard"
        description="Search, triage, and track issues across all facilities."
      >
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
          Issues are not connected to the database yet.
        </div>
      </Modal>
    </div>
  );
}
