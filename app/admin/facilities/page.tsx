"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal: make “future-you” understand what each section is for + where to edit things.
 * Rule: comments only. No logic changes, no UI changes.
 *
 * If you want these notes to show ON the webapp UI later, we’d add small <div> helper text,
 * but that would be a UI change — so this file sticks to comments only.
 */

import { useEffect, useMemo, useRef, useState } from "react";
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

/**
 * Utility: joins Tailwind class strings safely.
 * Change this only if you want a different style of class merging.
 */
function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/**
 * ENUM-LIKE TYPES (domain rules)
 * Change these if you want new statuses/types to exist in the UI filters + dropdowns.
 * IMPORTANT: if you add a new type/status here, also add it to the arrays near the bottom:
 * - facilityTypes / facilityStatuses / issueStatuses / issueCategories
 */
type FacilityStatus = "Operational" | "Limited" | "Closed";
type FacilityType = "Park" | "Sports Centre" | "Grounds" | "Multi Sports Center" | "Courts";

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

/**
 * Roles drive permissions:
 * - Members/Volunteers/Club Official/Association can lodge issues
 * - GSLA Staff/System Admin can manage issues
 * Change roles if your org structure changes.
 */
type UserRole =
  | "Member"
  | "Volunteer"
  | "Club Official"
  | "Association"
  | "GSLA Staff"
  | "System Admin";

/**
 * Data model: Facility
 * Change fields here if your backend schema changes later.
 *
 * Tip: if a field is not displaying, check:
 * - where it's rendered in the JSX
 * - whether the seed data includes it
 */
type Facility = {
  id: string; // Used as the primary key + for linking issues (facilityId).
  name: string; // Change this to rename a facility shown in the UI.
  type: FacilityType; // Controls filter + label under facility name.
  status: FacilityStatus; // Controls status badge + filter + "open issues" visibility.
  suburb: string; // Displayed in list + used in search.
  address: string; // Displayed in details + used in search.
  sportsSupported: string[]; // Shown as chips and searchable.
  amenities: {
    toilets: boolean;
    lighting: boolean;
    parking: boolean;
    changerooms: boolean;
    seating: boolean;
    water: boolean;
  };
  condition: {
    rating: number; // 1-5 (shown as “rating/5”)
    lastInspection: string; // ISO date -> formatted by formatDate()
    notes: string[]; // bullet list
  };
  manager: {
    org: "Council" | "Private" | "GSLA";
    name: string; // Change this to change the manager name shown.
    title: string; // Change this to change manager role/title shown.
    email: string; // Shown in the “Managed by” contact section.
    phone: string; // Shown in the “Managed by” contact section.
  };
};

/**
 * Data model: Issue
 * Links to a facility via facilityId (MUST match a Facility.id).
 * If issues show as “Unknown facility”, the facilityId probably doesn’t match any facility.
 */
type Issue = {
  id: string; // Unique issue identifier.
  facilityId: string; // IMPORTANT link to Facility.id.
  createdAt: string; // ISO
  updatedAt: string; // ISO
  reportedBy: {
    name: string; // Demo uses “You (Demo)” for new submissions.
    role: Exclude<UserRole, "GSLA Staff" | "System Admin">;
    clubOrAssoc?: string;
  };
  category: IssueCategory; // Controls label + search/filter matching.
  description: string; // Main issue text
  urgency: "Normal" | "High"; // High shows red pill.
  status: IssueStatus; // Drives dashboard + open/closed counts.
  internalNotes: string; // Staff-only notes shown to staff/admin
  photos: Array<{
    name: string;
    dataUrl: string; // base64 for demo/localStorage
  }>;
};

/**
 * Utility: human-friendly date rendering.
 * Change formatting here if you want different date display in the UI.
 */
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

/**
 * UI helper: chooses colors/icons for Facility status badges.
 * Change these classes if you want different badge colors.
 */
function badgeForFacilityStatus(s: FacilityStatus) {
  if (s === "Operational")
    return { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 };
  if (s === "Limited")
    return { cls: "bg-amber-50 text-amber-700 ring-amber-200", icon: AlertTriangle };
  return { cls: "bg-rose-50 text-rose-700 ring-rose-200", icon: ShieldAlert };
}

/**
 * UI helper: chooses colors for Issue status badges.
 * Change these if you want different status color mapping.
 */
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

/**
 * Small reusable pill UI component.
 * Change tone classes here to adjust the whole app's pill look.
 */
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

/**
 * Generic modal component used by:
 * - Report Issue modal
 * - Issues Dashboard modal
 *
 * Change modal sizing/styling here if you want all modals updated together.
 */
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
            {description ? <div className="mt-1 text-sm text-slate-600">{description}</div> : null}
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

/**
 * localStorage key for demo persistence.
 * Change this if you want to "reset" demo data for everyone (new key = fresh seed).
 *
 * Why your facility rename might not show:
 * - If localStorage already has old data, the app loads that instead of seedFacilities().
 * - To force the new seed, clear localStorage OR change STORAGE_KEY.
 */
const STORAGE_KEY = "gsla_facilities_demo_v5";

/**
 * Demo seed data: FACILITIES
 * Change this section to rename facilities, update address, manager, amenities, etc.
 *
 * IMPORTANT:
 * - Facility.id is the primary key. If you change an id, any Issue.facilityId pointing
 *   to the old id will break (issues become “Unknown facility”).
 * - Facility.type MUST be one of FacilityType (otherwise TS should complain).
 */
function seedFacilities(): Facility[] {
  return [
    {
      id: "Europa-Point-Complex",
      name: "Europa Sports Complex",
      // NOTE: This value is NOT in FacilityType as defined above.
      // If TypeScript is active, this should error. If you still see it running,
      // your TS checks might not be strict, or this file isn't typechecked as expected.
      type: "Multi Sports Center",
      status: "Operational",
      suburb: "Europa Point",
      address: "Europa Road, Gibraltar",
      sportsSupported: ["Football", "Cricket", "Petanque"],
      amenities: {
        toilets: true,
        lighting: true,
        parking: true,
        changerooms: true,
        seating: true,
        water: true,
      },
      condition: {
        rating: 4,
        lastInspection: "2025-11-18T10:00:00.000Z",
        notes: ["Pitch in good condition", "Floodlights serviced in Oct", "Minor wear near south touchline"],
      },
      manager: {
        org: "GSLA",
        name: "B.Carmela",
        title: "Center Manager",
        email: "b.carmela@council.example",
        phone: "+350 200 12345",
      },
    },
    {
      id: "vic-stadium",
      name: "Victoria Stadium",
      type: "Multi Sports Center",
      status: "Limited",
      suburb: "Marina District",
      address: "Marina Promenade, Gibraltar",
      sportsSupported: ["Basketball", "Volleyball", "Futsal"],
      amenities: {
        toilets: true,
        lighting: true,
        parking: false,
        changerooms: true,
        seating: true,
        water: true,
      },
      condition: {
        rating: 3,
        lastInspection: "2025-10-02T09:15:00.000Z",
        notes: ["One court line repaint pending", "Leak reported near west entrance", "Changing room lockers need repair"],
      },
      manager: {
        org: "GSLA",
        name: "A. Hammnond",
        title: "Centre Manager",
        email: "ahammond@gsla.gi",
        phone: "+350 200 67890",
      },
    },
    {
      id: "Lath-Barracks",
      name: "Lathbury Barracks Sports Complex",
      type: "Multi Sports Center",
      status: "Operational",
      suburb: "Windmill Hill",
      address: "Windmill Hill, Gibraltar",
      sportsSupported: ["Tennis", "Padel"],
      amenities: {
        toilets: false,
        lighting: true,
        parking: true,
        changerooms: false,
        seating: true,
        water: false,
      },
      condition: {
        rating: 4,
        lastInspection: "2025-09-12T16:30:00.000Z",
        notes: ["New net installed", "Lighting timer adjusted", "Surface cleaned monthly"],
      },
      manager: {
        org: "GSLA",
        name: "J. Duarte",
        title: "Center Manager",
        email: "j.duarte@gsla.gi",
        phone: "+350 200 44556",
      },
    },
    {
      id: "NotreDame-Park",
      name: "Notrea Dame School Park",
      type: "Park",
      status: "Closed",
      suburb: "North District",
      address: "North Road, Gibraltar",
      sportsSupported: ["Football", "Athletics"],
      amenities: {
        toilets: false,
        lighting: false,
        parking: true,
        changerooms: false,
        seating: false,
        water: false,
      },
      condition: {
        rating: 2,
        lastInspection: "2025-11-28T12:10:00.000Z",
        notes: ["Surface remediation required", "Safety fencing damaged", "Closed pending contractor works"],
      },
      manager: {
        org: "GSLA",
        name: "M. Bennett",
        title: "Center Manager",
        email: "facilities@gsla.example",
        phone: "+350 200 90001",
      },
    },
  ];
}

/**
 * Demo seed data: ISSUES
 * Change this section to add/edit initial issues.
 *
 * IMPORTANT:
 * - facilityId MUST match a Facility.id above
 * - In this file, several issue facilityIds refer to ids that do not exist in seedFacilities()
 *   (e.g. "f-ocean-view-centre", "f-king-george-v", "f-north-ground")
 *   -> Those will show as “Unknown facility” in dashboard.
 */
function seedIssues(): Issue[] {
  return [
    {
      id: "i-1001",
      facilityId: "Lath-Barracks",
      createdAt: "2025-12-03T18:20:00.000Z",
      updatedAt: "2025-12-05T09:05:00.000Z",
      reportedBy: { name: "Leah Johnson", role: "Club Official", clubOrAssoc: "Marina Futsal Club" },
      category: "Safety hazard",
      description: "Wet patch near west entrance after rain. Slippery surface needs attention/signage.",
      urgency: "High",
      status: "Reviewed",
      internalNotes: "Requested centre manager to place temporary signage; awaiting maintenance confirmation.",
      photos: [],
    },
    {
      id: "i-1002",
      facilityId: "vic-stadium",
      createdAt: "2025-12-06T07:45:00.000Z",
      updatedAt: "2025-12-07T11:00:00.000Z",
      reportedBy: { name: "Omar Khan", role: "Member", clubOrAssoc: "Gibraltar Cricket Association" },
      category: "Playing surface",
      description: "Uneven patch on the square near wicket 2. Ball is bouncing unpredictably during practice.",
      urgency: "Normal",
      status: "Sent to Facility Manager",
      internalNotes: "Forwarded to Council grounds team. Asked for inspection early next week.",
      photos: [],
    },
    {
      id: "i-1003",
      facilityId: "Europa-Point-Complex",
      createdAt: "2025-12-10T16:10:00.000Z",
      updatedAt: "2025-12-12T14:25:00.000Z",
      reportedBy: { name: "Sofia Pereira", role: "Volunteer" },
      category: "Vandalism",
      description: "Fence panel appears bent and graffiti near the storage area. Concerned about access/safety.",
      urgency: "High",
      status: "In Progress",
      internalNotes: "Contractor engaged for fencing; police report reference logged internally.",
      photos: [],
    },
  ];
}

/**
 * Safe JSON parse helper for localStorage reads.
 * Change this only if you want stricter validation/error handling.
 */
function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

/**
 * Simple unique id generator for demo records (issues).
 * In a real backend, your DB will create IDs.
 */
function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

/**
 * Converts uploaded files -> base64 data URLs (demo-only).
 * In production, you'd upload to storage (S3, Cloudinary, etc) and store URLs.
 */
async function filesToDataUrls(files: File[]): Promise<Array<{ name: string; dataUrl: string }>> {
  const limited = files.slice(0, 5);
  const readers = limited.map(
    (file) =>
      new Promise<{ name: string; dataUrl: string }>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve({ name: file.name, dataUrl: String(fr.result || "") });
        fr.onerror = () => reject(new Error("Failed to read file"));
        fr.readAsDataURL(file);
      })
  );
  const out = await Promise.allSettled(readers);
  return out
    .filter((r): r is PromiseFulfilledResult<{ name: string; dataUrl: string }> => r.status === "fulfilled")
    .map((r) => r.value);
}

export default function FacilitiesPage() {
  /**
   * ROLE SWITCHER (demo)
   * Controls permissions in the UI:
   * - canLodgeIssue: who can submit issues
   * - canManageIssues: who can triage/update/delete issues
   */
  const [role, setRole] = useState<UserRole>("GSLA Staff");

  /**
   * Main app state:
   * - facilities: list on the left + detail view on the right
   * - issues: issue records used by facility tab + dashboard modal
   */
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  /**
   * Facility list filters (top search + dropdowns):
   * Change these if you want different filtering behavior.
   */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FacilityType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "All">("All");
  const [onlyWithIssues, setOnlyWithIssues] = useState(false);

  /**
   * Selection state:
   * selectedFacilityId picks which facility appears in the right-hand detail view.
   */
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const selectedFacility = useMemo(
    () => facilities.find((f) => f.id === selectedFacilityId) || null,
    [facilities, selectedFacilityId]
  );

  /**
   * Tabs for the right side panel (Overview vs Issues).
   * Add more tabs here if you expand the page later.
   */
  const [tab, setTab] = useState<"Overview" | "Issues">("Overview");

  /**
   * Modal controls:
   * - reportOpen: “Report an Issue” modal
   * - manageOpen: “Issues Dashboard” modal
   */
  const [reportOpen, setReportOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  /**
   * Report Issue modal form state:
   * This is the temporary form data while a user fills the issue form.
   */
  const [rCategory, setRCategory] = useState<IssueCategory>("Other");
  const [rUrgency, setRUrgency] = useState<Issue["urgency"]>("Normal");
  const [rDescription, setRDescription] = useState("");
  const [rPhotos, setRPhotos] = useState<Array<{ name: string; dataUrl: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Issues Dashboard modal state:
   * - issuesView controls which “slice” you see
   * - issueSearch is dashboard search text
   */
  const [issuesView, setIssuesView] = useState<"All" | "Open" | "Mine">("Open");
  const [issueSearch, setIssueSearch] = useState("");

  /**
   * Permissions derived from role (demo rules).
   * Change these rules if permissions should behave differently.
   */
  const canLodgeIssue = role !== "GSLA Staff" && role !== "System Admin";
  const canManageIssues = role === "GSLA Staff" || role === "System Admin";

  /**
   * Data hydration (localStorage → state)
   * - If localStorage has data under STORAGE_KEY, we use it.
   * - Otherwise we use seedFacilities() and seedIssues().
   *
   * WHY CHANGES SOMETIMES “DON’T SHOW”:
   * If you change seedFacilities() but localStorage already has older saved data,
   * the UI will continue showing what’s in localStorage until cleared/reset.
   */
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? safeParse<{ facilities: Facility[]; issues: Issue[] }>(localStorage.getItem(STORAGE_KEY))
        : null;

    const f = stored?.facilities?.length ? stored.facilities : seedFacilities();
    const i = stored?.issues?.length ? stored.issues : seedIssues();

    setFacilities(f);
    setIssues(i);
    setSelectedFacilityId((prev) => prev ?? f[0]?.id ?? null);
  }, []);

  /**
   * Persist changes back to localStorage.
   * Anything that updates facilities/issues will be remembered on refresh (demo behavior).
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!facilities.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ facilities, issues }));
  }, [facilities, issues]);

  /**
   * Index issues by facilityId for fast lookup.
   * This drives:
   * - the Issues tab for a selected facility
   * - open issue counts per facility
   */
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

  /**
   * Counts open issues for a facility (anything not Resolved/Closed).
   * Used by:
   * - facility list badges (“X open”)
   * - “Only with open issues” filter
   */
  const openIssueCount = (facilityId: string) => {
    const arr = issuesByFacility.get(facilityId) ?? [];
    return arr.filter((x) => x.status !== "Resolved" && x.status !== "Closed").length;
  };

  /**
   * Main facility list filtering logic (left column list).
   * Search matches: name/suburb/address/sportsSupported.
   */
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
        const matchesStatus = statusFilter === "All" || f.status === statusFilter;
        const matchesIssues = !onlyWithIssues || openIssueCount(f.id) > 0;
        return matchesQ && matchesType && matchesStatus && matchesIssues;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [facilities, search, typeFilter, statusFilter, onlyWithIssues, issuesByFacility]);

  /**
   * Issues for the currently selected facility (right column, Issues tab).
   */
  const selectedIssues = useMemo(() => {
    if (!selectedFacility) return [];
    return issuesByFacility.get(selectedFacility.id) ?? [];
  }, [selectedFacility, issuesByFacility]);

  /**
   * Dashboard modal list:
   * - filters by Open/All/Mine
   * - searches issue fields + facility name/suburb
   */
  const issuesDashboard = useMemo(() => {
    const q = issueSearch.trim().toLowerCase();
    const mineName = "You (Demo)";
    const filtered = issues.filter((i) => {
      const facility = facilities.find((f) => f.id === i.facilityId);
      const isOpen = i.status !== "Resolved" && i.status !== "Closed";
      const viewOk =
        issuesView === "All" ? true : issuesView === "Open" ? isOpen : i.reportedBy.name === mineName;

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

  /**
   * Clears the “Report issue” modal form.
   * Called on close and after successful submit.
   */
  function resetReportForm() {
    setRCategory("Other");
    setRUrgency("Normal");
    setRDescription("");
    setRPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /**
   * Adds selected photo files into rPhotos (base64) for demo storage.
   * Limits to 5 images.
   */
  async function onPickPhotos(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    const data = await filesToDataUrls(arr);
    setRPhotos((prev) => [...prev, ...data].slice(0, 5));
  }

  /**
   * Submits a new issue for the currently selected facility.
   * Demo behavior: stores in local React state + localStorage.
   */
  function submitIssue() {
    if (!selectedFacility) return;
    const desc = rDescription.trim();
    if (desc.length < 10) return;

    const now = new Date().toISOString();

    const reporterRole: Exclude<UserRole, "GSLA Staff" | "System Admin"> =
      role === "Member" || role === "Volunteer" || role === "Club Official" || role === "Association"
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

  /**
   * Updates a single issue (status/notes/etc).
   * Staff/admin use this via dropdowns and textarea.
   */
  function updateIssue(issueId: string, patch: Partial<Issue>) {
    const now = new Date().toISOString();
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ...patch, updatedAt: now } : i)));
  }

  /**
   * Deletes an issue (demo).
   * In production you’d likely soft-delete or require confirmation.
   */
  function deleteIssue(issueId: string) {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
  }

  /**
   * Dropdown options for filters and status pickers.
   * If you add a new type/status/category above, add it here too.
   */
  const facilityTypes: FacilityType[] = ["Park", "Sports Centre", "Grounds", "Multi Sports Center", "Courts"];
  const facilityStatuses: FacilityStatus[] = ["Operational", "Limited", "Closed"];
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

  /**
   * JSX UI START
   * Page layout:
   * - Header: title + role switcher + action buttons
   * - Filters row: search + dropdown filters
   * - Content grid:
   *    Left: facility list
   *    Right: selected facility detail (Overview/Issues tabs)
   * - Modals at the bottom: Report Issue + Issues Dashboard
   */
  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      {/* PAGE HEADER (title + role switcher + buttons) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div>
                {/* Change this title if you want the page heading to change */}
                <div className="text-2xl font-extrabold tracking-tight text-slate-900">Facilities</div>
                {/* Change this subtitle if you want different top-of-page description */}
                <div className="text-sm text-slate-600">
                  Facility directory + complaints & photo reporting workflow.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* ROLE SELECTOR (demo permissions) */}
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs font-semibold text-slate-600">View as</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  {(
                    ["Member", "Volunteer", "Club Official", "Association", "GSLA Staff", "System Admin"] as UserRole[]
                  ).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Opens the Issues Dashboard modal */}
              <button
                onClick={() => setManageOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <ClipboardList size={16} />
                Issues Dashboard
              </button>

              {/* Placeholder for "Add Facility" flow (not implemented in this file) */}
              <button
                onClick={() => alert("Demo: Add Facility UI can be added next (modal + fields).")}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <Plus size={16} />
                Add Facility
              </button>
            </div>
          </div>

          {/* FILTERS ROW (search + type/status + open-only toggle) */}
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search box filters the left list */}
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
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
                  className="rounded-xl border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Type filter */}
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Filter size={16} className="text-slate-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as FacilityType | "All")}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option value="All">All types</option>
                  {facilityTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FacilityStatus | "All")}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option value="All">All statuses</option>
                  {facilityStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkbox filters facilities that have open issues */}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
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
        </div>
      </div>

      {/* MAIN GRID: left list + right details */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Facility list */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Facilities</div>
                  <div className="text-xs text-slate-600">
                    {filteredFacilities.length} shown • {facilities.length} total
                  </div>
                </div>
                <Pill tone="indigo">
                  <Clock size={14} />
                  Live demo data
                </Pill>
              </div>

              {/* Facility list scroll area */}
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
                        "w-full rounded-2xl border p-4 text-left transition",
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {/* Facility name (change in seedFacilities -> name) */}
                          <div className={classNames("text-sm font-semibold", active ? "text-white" : "text-slate-900")}>
                            {f.name}
                          </div>

                          {/* Facility meta line (type + suburb) */}
                          <div
                            className={classNames(
                              "mt-1 inline-flex items-center gap-2 text-xs",
                              active ? "text-slate-200" : "text-slate-600"
                            )}
                          >
                            <span className="inline-flex items-center gap-1">
                              <Building2 size={14} />
                              {f.type}
                            </span>
                            <span className="opacity-60">•</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={14} />
                              {f.suburb}
                            </span>
                          </div>
                        </div>

                        {/* Status + open issue count badges */}
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
                              active ? "bg-white/10 text-white ring-white/15" : cls
                            )}
                          >
                            <Icon size={14} />
                            {f.status}
                          </span>

                          {open > 0 ? (
                            <span
                              className={classNames(
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
                                active
                                  ? "bg-amber-500/15 text-amber-100 ring-amber-200/20"
                                  : "bg-amber-50 text-amber-700 ring-amber-200"
                              )}
                            >
                              <AlertTriangle size={14} />
                              {open} open
                            </span>
                          ) : (
                            <span
                              className={classNames(
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
                                active
                                  ? "bg-emerald-500/15 text-emerald-100 ring-emerald-200/20"
                                  : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              )}
                            >
                              <CheckCircle2 size={14} />
                              No open issues
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sports supported chips */}
                      <div
                        className={classNames(
                          "mt-3 flex flex-wrap gap-2",
                          active ? "text-slate-200" : "text-slate-700"
                        )}
                      >
                        {f.sportsSupported.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className={classNames(
                              "rounded-full px-2 py-1 text-xs ring-1",
                              active ? "bg-white/10 ring-white/15" : "bg-slate-50 ring-slate-200"
                            )}
                          >
                            {s}
                          </span>
                        ))}
                        {f.sportsSupported.length > 4 ? (
                          <span
                            className={classNames(
                              "rounded-full px-2 py-1 text-xs ring-1",
                              active ? "bg-white/10 ring-white/15" : "bg-slate-50 ring-slate-200"
                            )}
                          >
                            +{f.sportsSupported.length - 4}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}

                {!filteredFacilities.length ? (
                  <div className="p-6 text-center text-sm text-slate-600">No facilities match your filters.</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Facility details */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Detail header: facility name + tabs + actions */}
              <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold text-slate-900">
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

                  {/* Address line */}
                  {selectedFacility ? (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={16} />
                        {selectedFacility.type}
                      </span>
                      <span className="opacity-60">•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedFacility.address}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-600">Choose a facility from the list to see details.</div>
                  )}
                </div>

                {/* Tabs + primary actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tab switcher */}
                  <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                    {(["Overview", "Issues"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={classNames(
                          "rounded-xl px-3 py-2 text-sm font-semibold transition",
                          tab === t
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-700 hover:text-slate-900"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {selectedFacility ? (
                    <>
                      {/* Report Issue button (hidden/disabled for staff/admin) */}
                      {canLodgeIssue ? (
                        <button
                          onClick={() => setReportOpen(true)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                        >
                          <Camera size={16} />
                          Report an Issue
                        </button>
                      ) : (
                        <Pill tone="slate">
                          <Eye size={14} />
                          Staff view (reporting disabled)
                        </Pill>
                      )}

                      {/* Placeholder edit facility action */}
                      <button
                        onClick={() => alert("Demo: Edit Facility UI can be added next (modal + fields).")}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Detail body: empty state OR Overview OR Issues */}
              <div className="px-6 py-6">
                {!selectedFacility ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
                    Select a facility to view info and issues.
                  </div>
                ) : tab === "Overview" ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* OVERVIEW LEFT: facility information card */}
                    <div className="lg:col-span-7">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Facility information</div>
                            <div className="text-xs text-slate-600">Operational details & contacts.</div>
                          </div>
                          <Pill tone="indigo">
                            <MapPin size={14} />
                            {selectedFacility.suburb}
                          </Pill>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* Supported sports */}
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-600">Supported sports</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {selectedFacility.sportsSupported.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Amenities checklist (booleans) */}
                          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-600">Amenities</div>

                            <div className="mt-3 grid grid-cols-1 gap-y-3 text-sm lg:grid-cols-2 lg:gap-x-6">
                              {[
                                ["Toilets", selectedFacility.amenities.toilets],
                                ["Lighting", selectedFacility.amenities.lighting],
                                ["Parking", selectedFacility.amenities.parking],
                                ["Changerooms", selectedFacility.amenities.changerooms],
                                ["Seating", selectedFacility.amenities.seating],
                                ["Water", selectedFacility.amenities.water],
                              ].map(([label, ok]) => (
                                <div key={label} className="flex min-w-0 items-center gap-3">
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
                                  <span className="min-w-0 text-slate-800">{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Managed by / contact block */}
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-semibold text-slate-600">Managed by</div>
                              <div className="mt-1 text-sm font-semibold text-slate-900">
                                {selectedFacility.manager.org} • {selectedFacility.manager.title}
                              </div>
                              <div className="mt-1 text-sm text-slate-700">{selectedFacility.manager.name}</div>
                            </div>
                            <Pill tone="cyan">
                              <Building2 size={14} />
                              Contact
                            </Pill>
                          </div>

                          <div className="mt-4 flex flex-col gap-3">
                            <div className="flex items-start gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                              <Mail size={16} className="mt-0.5 text-slate-500" />
                              <span className="break-all text-sm text-slate-800">
                                {selectedFacility.manager.email}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                              <Phone size={16} className="text-slate-500" />
                              <span className="text-sm text-slate-800">{selectedFacility.manager.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* OVERVIEW RIGHT: condition card */}
                    <div className="lg:col-span-5">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Condition overview</div>
                            <div className="text-xs text-slate-600">Inspection snapshot & notes.</div>
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

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Last inspection</div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">
                            {formatDate(selectedFacility.condition.lastInspection)}
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-semibold text-slate-600">Notes</div>
                          <ul className="mt-2 space-y-2 text-sm text-slate-800">
                            {selectedFacility.condition.notes.map((n, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-400" />
                                <span>{n}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Quick actions (links into Issues + placeholder map action) */}
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4">
                          <div className="text-sm font-semibold text-slate-900">Quick actions</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setTab("Issues");
                                setManageOpen(true);
                              }}
                              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                              <ClipboardList size={16} />
                              View all issues
                            </button>
                            <button
                              onClick={() => alert("Demo: A map link could open Google Maps / internal map view.")}
                              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
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
                  /* ISSUES TAB: per-facility issues list + staff controls */
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
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <ClipboardList size={16} />
                            Manage in dashboard
                          </button>
                        ) : null}

                        {canLodgeIssue ? (
                          <button
                            onClick={() => setReportOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                          >
                            <Camera size={16} />
                            Report an Issue
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {selectedIssues.map((i) => (
                        <div key={i.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs ring-1",
                                    badgeForIssueStatus(i.status)
                                  )}
                                >
                                  {i.status}
                                </span>
                                <Pill tone={i.urgency === "High" ? "red" : "slate"}>
                                  {i.urgency === "High" ? <ShieldAlert size={14} /> : <Clock size={14} />}
                                  {i.urgency}
                                </Pill>
                                <span className="text-xs text-slate-500">
                                  Created {formatDate(i.createdAt)} • Updated {formatDate(i.updatedAt)}
                                </span>
                              </div>

                              <div className="mt-2 text-sm font-semibold text-slate-900">{i.category}</div>
                              <div className="mt-1 text-sm text-slate-700">{i.description}</div>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                                  Reported by:{" "}
                                  <span className="font-semibold text-slate-800">{i.reportedBy.name}</span> (
                                  {i.reportedBy.role})
                                </span>
                                {i.reportedBy.clubOrAssoc ? (
                                  <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                                    {i.reportedBy.clubOrAssoc}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {/* Staff controls (status dropdown + notify + delete) */}
                            {canManageIssues ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={i.status}
                                  onChange={(e) => updateIssue(i.id, { status: e.target.value as IssueStatus })}
                                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none"
                                >
                                  {issueStatuses.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  onClick={() =>
                                    updateIssue(i.id, {
                                      status: "Sent to Facility Manager",
                                      internalNotes:
                                        (i.internalNotes ? i.internalNotes + "\n" : "") +
                                        `[${new Date().toISOString()}] Notified manager (demo).`,
                                    })
                                  }
                                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                >
                                  <Send size={16} />
                                  Notify
                                </button>

                                <button
                                  onClick={() => deleteIssue(i.id)}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>

                          {/* Issue photos section (if any exist) */}
                          {i.photos.length ? (
                            <div className="mt-4">
                              <div className="text-xs font-semibold text-slate-600">Photos</div>
                              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
                                {i.photos.map((p, idx) => (
                                  <div
                                    key={idx}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.dataUrl} alt={p.name} className="h-32 w-full object-cover" />
                                    <div className="truncate px-3 py-2 text-xs text-slate-600">{p.name}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Staff-only internal notes textarea */}
                          {canManageIssues ? (
                            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                              <div className="text-xs font-semibold text-slate-600">Internal notes (GSLA)</div>
                              <textarea
                                value={i.internalNotes}
                                onChange={(e) => updateIssue(i.id, { internalNotes: e.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none"
                                rows={3}
                                placeholder="Add internal notes, contractor refs, follow-ups..."
                              />
                            </div>
                          ) : null}
                        </div>
                      ))}

                      {/* Empty state for facility issues */}
                      {!selectedIssues.length ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
                          No issues logged for this facility yet.
                          {canLodgeIssue ? (
                            <div className="mt-3">
                              <button
                                onClick={() => setReportOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                              >
                                <Camera size={16} />
                                Report the first issue
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT ISSUE MODAL (members/volunteers/club/assoc only) */}
      <Modal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
          resetReportForm();
        }}
        title="Report a facility issue"
        description={selectedFacility ? `Facility: ${selectedFacility.name}` : undefined}
      >
        {!selectedFacility ? (
          <div className="text-sm text-slate-600">Select a facility first.</div>
        ) : (
          <div className="space-y-5">
            {/* Category + urgency */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-600">Category</div>
                <select
                  value={rCategory}
                  onChange={(e) => setRCategory(e.target.value as IssueCategory)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                >
                  {issueCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600">Urgency</div>
                <select
                  value={rUrgency}
                  onChange={(e) => setRUrgency(e.target.value as "Normal" | "High")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (safety risk / urgent)</option>
                </select>
              </div>
            </div>

            {/* Description field */}
            <div>
              <div className="text-xs font-semibold text-slate-600">Description</div>
              <textarea
                value={rDescription}
                onChange={(e) => setRDescription(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none"
                rows={5}
                placeholder="Explain the problem clearly (where it is, what’s wrong, how urgent, any impact on matches/training)."
              />
              <div className="mt-1 text-xs text-slate-500">Minimum 10 characters.</div>
            </div>

            {/* Photo upload section (demo base64) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Photos</div>
                  <div className="text-xs text-slate-600">Up to 5 images. (Stored in local demo data.)</div>
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
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                  <button
                    onClick={() => setRPhotos([])}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
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
                    <div key={idx} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.dataUrl} alt={p.name} className="h-28 w-full object-cover" />
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <div className="truncate text-xs text-slate-600">{p.name}</div>
                        <button
                          onClick={() => setRPhotos((prev) => prev.filter((_, j) => j !== idx))}
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
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
                  Add photos to help GSLA and the facility manager understand the problem quickly.
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => {
                  setReportOpen(false);
                  resetReportForm();
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitIssue}
                disabled={rDescription.trim().length < 10}
                className={classNames(
                  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
                  rDescription.trim().length < 10 ? "bg-slate-300" : "bg-slate-900 hover:bg-slate-800"
                )}
              >
                <Send size={16} />
                Submit issue
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ISSUES DASHBOARD MODAL (staff/admin triage view) */}
      <Modal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        title="Facilities issues dashboard"
        description="Search, triage, and track issues across all facilities."
      >
        {/* Dashboard controls: search + Open/All/Mine */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
              <Search size={18} className="text-slate-500" />
              <input
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search issues by facility, category, status, text..."
              />
              {issueSearch ? (
                <button
                  onClick={() => setIssueSearch("")}
                  className="rounded-xl border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              {(["Open", "All", "Mine"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setIssuesView(v)}
                  className={classNames(
                    "rounded-xl px-3 py-2 text-sm font-semibold transition",
                    issuesView === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard results list */}
          <div className="rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Results</div>
                <div className="text-xs text-slate-600">{issuesDashboard.length} issues</div>
              </div>
              {canManageIssues ? (
                <Pill tone="emerald">
                  <CheckCircle2 size={14} />
                  Staff tools enabled
                </Pill>
              ) : (
                <Pill tone="slate">
                  <Eye size={14} />
                  Read-only
                </Pill>
              )}
            </div>

            <div className="max-h-[55vh] overflow-auto p-2">
              {issuesDashboard.map((i) => {
                const f = facilities.find((x) => x.id === i.facilityId);
                const isSelectedFacility = selectedFacilityId === i.facilityId;

                return (
                  <div key={i.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      {/* Clicking an issue navigates the right panel to that facility + Issues tab */}
                      <button
                        onClick={() => {
                          setSelectedFacilityId(i.facilityId);
                          setTab("Issues");
                          setManageOpen(false);
                        }}
                        className="min-w-0 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={classNames(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs ring-1",
                              badgeForIssueStatus(i.status)
                            )}
                          >
                            {i.status}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {f ? f.name : "Unknown facility"}
                          </span>
                          {isSelectedFacility ? <Pill tone="indigo">Selected</Pill> : null}
                        </div>

                        <div className="mt-2 text-sm font-semibold text-slate-900">{i.category}</div>
                        <div className="mt-1 text-sm text-slate-700">{i.description}</div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                            {i.urgency}
                          </span>
                          <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                            Created {formatDate(i.createdAt)}
                          </span>
                          <span className="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                            By {i.reportedBy.name} ({i.reportedBy.role})
                          </span>
                        </div>
                      </button>

                      {/* Staff tools in dashboard */}
                      {canManageIssues ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={i.status}
                            onChange={(e) => updateIssue(i.id, { status: e.target.value as IssueStatus })}
                            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none"
                          >
                            {issueStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() =>
                              updateIssue(i.id, {
                                status: "Sent to Facility Manager",
                                internalNotes:
                                  (i.internalNotes ? i.internalNotes + "\n" : "") +
                                  `[${new Date().toISOString()}] Notified manager (demo).`,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <Send size={16} />
                            Notify
                          </button>

                          <button
                            onClick={() => deleteIssue(i.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {!issuesDashboard.length ? (
                <div className="p-8 text-center text-sm text-slate-600">No issues match your search.</div>
              ) : null}
            </div>
          </div>

          {/* Small explanation box (already visible in UI) */}
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Workflow idea (what this enables)</div>
            <div className="mt-1">
              Members submit issues with photos → GSLA reviews → GSLA notifies facility manager → status updates tracked until resolved.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
