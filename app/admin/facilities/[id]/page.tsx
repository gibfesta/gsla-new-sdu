"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Pencil,
  ClipboardList,
  CalendarDays,
  Clock3,
  Wrench,
  Phone,
  Mail,
  FileText,
  PlayCircle,
  CheckSquare,
  CalendarRange,
  BellRing,
  CircleDot,
  Plus,
  Send,
  MessageSquare,
  DoorClosed,
  Siren,
  TriangleAlert,
  Info,
  FolderOpen,
  Camera,
  BadgeCheck,
  Download,
  Eye,
  Shield,
  Flame,
  HeartPulse,
  HardHat,
  Upload,
  X,
  Lock,
  UserCog,
  CalendarClock,
  ExternalLink,
  History,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type FacilityStatus = "Operational" | "Limited" | "Closed";
type Role = "Centre Manager" | "Facilities Manager" | "GSLA Admin";
type TabKey =
  | "handover"
  | "information"
  | "issues"
  | "timeline"
  | "events"
  | "procedures"
  | "weekly"
  | "monthly"
  | "documents"
  | "photos"
  | "compliance"
  | "bookings"
  | "audit";

type TimelineItem = {
  id: string;
  time: string;
  title: string;
  type: "Operations" | "Maintenance" | "Issue" | "Event" | "Handover";
  detail: string;
};

type TaskItem = {
  id: string;
  task: string;
  owner: string;
  status: "Due" | "Done" | "In Progress" | "Scheduled";
  completed: boolean;
};

type DocumentItem = {
  id: string;
  title: string;
  category: "SOP" | "Checklist" | "Policy" | "Form";
  version: string;
  updated: string;
  owner: string;
};

type PhotoItem = {
  id: string;
  title: string;
  area: string;
  uploaded: string;
  note: string;
};

type ComplianceItem = {
  id: string;
  title: string;
  area: "Fire Safety" | "Health & Safety" | "First Aid" | "Site Safety";
  due: string;
  owner: string;
  status: "Compliant" | "Due Soon" | "Overdue";
};

type AuditItem = {
  id: string;
  time: string;
  user: string;
  role: Role;
  action: string;
  detail: string;
};

const facility = {
  id: "fac-001",
  name: "Europa Sports Complex",
  type: "Sports Centre",
  status: "Operational" as FacilityStatus,
  suburb: "Europa Point",
  address: "Europa Point, Gibraltar",
  description:
    "Europa Sports Complex is one of GSLA’s key operational venues. This page is designed as a daily working dashboard for centre managers and a remote oversight workspace for facilities managers.",
  manager: {
    name: "Europa Centre Manager",
    title: "Centre Manager",
    email: "europa@gov.gi",
    phone: "+350 200 10001",
  },
  facilitiesManager: {
    name: "Facilities Manager",
    email: "facilities.manager@gov.gi",
  },
  summary: {
    urgentItems: 2,
  },
  sportsSupported: ["Football", "Athletics", "Training", "Community Use"],
  notes: [
    "Main outdoor sports complex for football and athletics activity.",
    "High traffic venue during evenings and weekends.",
    "Facilities manager reviews this page remotely for operational oversight.",
  ],
};

const initialIssues = [
  {
    id: "ISS-001",
    title: "Floodlight fault near east side pitch",
    status: "In Progress",
    priority: "High",
    updated: "11 Apr 2026 • 09:10",
    owner: "Maintenance Team",
  },
  {
    id: "ISS-002",
    title: "Changing room tap leaking",
    status: "New",
    priority: "Low",
    updated: "11 Apr 2026 • 07:45",
    owner: "Unassigned",
  },
  {
    id: "ISS-003",
    title: "Loose spectator barrier",
    status: "Reviewed",
    priority: "High",
    updated: "10 Apr 2026 • 16:30",
    owner: "Facility Manager",
  },
];

const initialTimeline: TimelineItem[] = [
  {
    id: "tl-1",
    time: "11 Apr 2026 • 08:00",
    title: "Opening checks completed",
    type: "Operations",
    detail:
      "Centre manager confirmed gates, lights, toilets, and pitch access.",
  },
  {
    id: "tl-2",
    time: "11 Apr 2026 • 09:10",
    title: "Issue updated: floodlight fault",
    type: "Maintenance",
    detail: "Maintenance team assigned and repair window under review.",
  },
  {
    id: "tl-3",
    time: "10 Apr 2026 • 18:00",
    title: "Youth training session completed",
    type: "Event",
    detail: "No operational concerns reported after session.",
  },
  {
    id: "tl-4",
    time: "10 Apr 2026 • 16:30",
    title: "Barrier safety concern logged",
    type: "Issue",
    detail:
      "Reported by centre manager and escalated to facilities manager.",
  },
];

const events = [
  {
    title: "Youth Football Training",
    date: "11 Apr 2026",
    time: "17:00 - 19:00",
    location: "Main Pitch",
    organiser: "Sports Development Unit",
    status: "Confirmed",
  },
  {
    title: "Athletics Community Session",
    date: "11 Apr 2026",
    time: "19:30 - 21:00",
    location: "Track Area",
    organiser: "Community Programme",
    status: "Confirmed",
  },
  {
    title: "Weekend Fixture Prep",
    date: "12 Apr 2026",
    time: "09:00 - 11:00",
    location: "Main Pitch",
    organiser: "Facilities Team",
    status: "Pending",
  },
];

const bookingItems = [
  {
    id: "bk-1",
    title: "Football Training Booking",
    date: "11 Apr 2026",
    time: "17:00 - 19:00",
    space: "Main Pitch",
    status: "Confirmed",
    source: "Bookings",
  },
  {
    id: "bk-2",
    title: "Athletics Lane Reservation",
    date: "11 Apr 2026",
    time: "19:30 - 21:00",
    space: "Track Area",
    status: "Confirmed",
    source: "Calendar",
  },
  {
    id: "bk-3",
    title: "Maintenance Access Window",
    date: "12 Apr 2026",
    time: "09:00 - 11:00",
    space: "East Lighting Zone",
    status: "Pending",
    source: "Bookings",
  },
];

const openingStepsSeed = [
  "Unlock perimeter access points and main gate.",
  "Check pitch, spectator zone, toilets, and changing rooms for safety.",
  "Turn on essential systems and confirm lighting where needed.",
  "Confirm scheduled bookings/events for the day.",
  "Log any defects or urgent concerns before public access.",
];

const closingStepsSeed = [
  "Confirm all users have exited the facility.",
  "Check toilets, changing rooms, spectator areas, and pitch surroundings.",
  "Turn off lighting and non-essential systems.",
  "Secure all gates, doors, and storage areas.",
  "Log any incidents, maintenance issues, or unusual activity.",
];

const weeklyTaskSeed: TaskItem[] = [
  {
    id: "w1",
    task: "Inspect lighting and external access points",
    owner: "Centre Manager",
    status: "Due",
    completed: false,
  },
  {
    id: "w2",
    task: "Review toilet and changing room condition log",
    owner: "Centre Manager",
    status: "Done",
    completed: true,
  },
  {
    id: "w3",
    task: "Submit weekly facility summary to Facilities Manager",
    owner: "Centre Manager",
    status: "Due",
    completed: false,
  },
  {
    id: "w4",
    task: "Check signage, barriers, and spectator safety zones",
    owner: "Facilities Team",
    status: "In Progress",
    completed: false,
  },
];

const monthlyTaskSeed: TaskItem[] = [
  {
    id: "m1",
    task: "Full maintenance review meeting",
    owner: "Facilities Manager",
    status: "Scheduled",
    completed: false,
  },
  {
    id: "m2",
    task: "Monthly compliance and safety walkaround",
    owner: "Centre Manager",
    status: "Due",
    completed: false,
  },
  {
    id: "m3",
    task: "Review recurring issues and escalation trends",
    owner: "Facilities Manager",
    status: "Due",
    completed: false,
  },
];

const documentsSeed: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Opening Procedure SOP",
    category: "SOP",
    version: "v2.1",
    updated: "02 Apr 2026",
    owner: "Facilities Manager",
  },
  {
    id: "doc-2",
    title: "Closing Checklist",
    category: "Checklist",
    version: "v1.8",
    updated: "28 Mar 2026",
    owner: "Centre Manager",
  },
  {
    id: "doc-3",
    title: "Incident Reporting Form",
    category: "Form",
    version: "v3.0",
    updated: "15 Feb 2026",
    owner: "GSLA Admin",
  },
  {
    id: "doc-4",
    title: "Pitch Access & Safety Policy",
    category: "Policy",
    version: "v1.3",
    updated: "07 Jan 2026",
    owner: "Facilities Manager",
  },
];

const photosSeed: PhotoItem[] = [
  {
    id: "photo-1",
    title: "East Floodlight Column",
    area: "Main Pitch",
    uploaded: "11 Apr 2026 • 09:05",
    note: "Fault reported and attached for maintenance review.",
  },
  {
    id: "photo-2",
    title: "Spectator Barrier",
    area: "North Stand",
    uploaded: "10 Apr 2026 • 16:28",
    note: "Loose section flagged for urgent inspection.",
  },
  {
    id: "photo-3",
    title: "Changing Room Tap",
    area: "Changing Room 2",
    uploaded: "11 Apr 2026 • 07:43",
    note: "Leak documented before works are scheduled.",
  },
  {
    id: "photo-4",
    title: "Track Area Surface Check",
    area: "Athletics Track",
    uploaded: "09 Apr 2026 • 13:10",
    note: "Routine visual inspection photo log.",
  },
];

const complianceSeed: ComplianceItem[] = [
  {
    id: "comp-1",
    title: "Fire extinguisher inspection",
    area: "Fire Safety",
    due: "18 Apr 2026",
    owner: "Facilities Manager",
    status: "Due Soon",
  },
  {
    id: "comp-2",
    title: "First aid kit stock check",
    area: "First Aid",
    due: "11 Apr 2026",
    owner: "Centre Manager",
    status: "Due Soon",
  },
  {
    id: "comp-3",
    title: "Monthly site safety walkaround",
    area: "Site Safety",
    due: "05 Apr 2026",
    owner: "Centre Manager",
    status: "Overdue",
  },
  {
    id: "comp-4",
    title: "H&S signage verification",
    area: "Health & Safety",
    due: "01 Apr 2026",
    owner: "Facilities Team",
    status: "Compliant",
  },
];

const auditSeed: AuditItem[] = [
  {
    id: "aud-1",
    time: "11 Apr 2026 • 09:10",
    user: "Alex Garcia",
    role: "Facilities Manager",
    action: "Updated issue status",
    detail: "Floodlight fault marked as In Progress.",
  },
  {
    id: "aud-2",
    time: "11 Apr 2026 • 08:02",
    user: "Jordan Smith",
    role: "Centre Manager",
    action: "Completed opening procedure",
    detail: "4 of 5 opening checks completed.",
  },
  {
    id: "aud-3",
    time: "10 Apr 2026 • 17:15",
    user: "Admin User",
    role: "GSLA Admin",
    action: "Uploaded document",
    detail: "Closing Checklist v1.8 added to Documents / SOPs.",
  },
];

function statusStyles(status: FacilityStatus) {
  if (status === "Operational") {
    return {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  }
  if (status === "Limited") {
    return {
      icon: AlertTriangle,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  }
  return {
    icon: ShieldAlert,
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  };
}

function miniStatus(status: string) {
  if (
    status === "Done" ||
    status === "Resolved" ||
    status === "Operational" ||
    status === "Scheduled" ||
    status === "Confirmed" ||
    status === "Compliant"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (
    status === "Due" ||
    status === "Reviewed" ||
    status === "In Progress" ||
    status === "Pending" ||
    status === "Due Soon"
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  if (status === "New" || status === "High" || status === "Overdue") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function roleCanEdit(role: Role) {
  return role === "Centre Manager" || role === "Facilities Manager" || role === "GSLA Admin";
}

function roleCanUpload(role: Role) {
  return role === "Facilities Manager" || role === "GSLA Admin" || role === "Centre Manager";
}

function roleCanManageCompliance(role: Role) {
  return role === "Facilities Manager" || role === "GSLA Admin";
}

function roleCanEditDocuments(role: Role) {
  return role === "Facilities Manager" || role === "GSLA Admin";
}

function StatCard({
  title,
  value,
  subtitle,
  tone = "slate",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  tone?: "slate" | "emerald" | "amber" | "rose";
}) {
  const toneCls =
    tone === "emerald"
      ? "bg-emerald-50 ring-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 ring-amber-200"
        : tone === "rose"
          ? "bg-rose-50 ring-rose-200"
          : "bg-white ring-slate-200";

  return (
    <Card className={classNames("rounded-2xl shadow-sm ring-1", toneCls)}>
      <CardContent className="p-5">
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
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
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
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

export default function FacilityPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("handover");
  const [role, setRole] = useState<Role>("Centre Manager");

  const [timeline, setTimeline] = useState(initialTimeline);
  const [updateText, setUpdateText] = useState("");

  const [handover, setHandover] = useState({
    shiftSummary:
      "Morning checks completed. Main pitch open. Floodlight issue remains in progress. Evening training still expected to go ahead.",
    risks:
      "Loose barrier near spectator area still needs monitoring until permanent fix is confirmed.",
    actionsRequired:
      "Confirm maintenance ETA for floodlight. Recheck barrier before first evening session.",
    managerMessage:
      "Please make sure any change to the evening schedule is logged here before 16:00.",
  });

  const [openingChecklist, setOpeningChecklist] = useState(
    openingStepsSeed.map((step, i) => ({
      id: `open-${i + 1}`,
      label: step,
      done: i < 4,
    }))
  );

  const [closingChecklist, setClosingChecklist] = useState(
    closingStepsSeed.map((step, i) => ({
      id: `close-${i + 1}`,
      label: step,
      done: false,
    }))
  );

  const [weeklyTasks, setWeeklyTasks] = useState(weeklyTaskSeed);
  const [monthlyTasks, setMonthlyTasks] = useState(monthlyTaskSeed);
  const [documents, setDocuments] = useState(documentsSeed);
  const [photos, setPhotos] = useState(photosSeed);
  const [audit, setAudit] = useState(auditSeed);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const [docForm, setDocForm] = useState({
    title: "",
    category: "SOP" as DocumentItem["category"],
    version: "",
    owner: role,
    fileName: "",
  });

  const [photoForm, setPhotoForm] = useState({
    title: "",
    area: "",
    note: "",
    fileName: "",
  });

  const status = statusStyles(facility.status);
  const StatusIcon = status.icon;

  const openIssueCount = initialIssues.filter(
    (i) => i.status !== "Resolved" && i.status !== "Closed"
  ).length;

  const weeklyDue = weeklyTasks.filter((t) => !t.completed).length;
  const monthlyDue = monthlyTasks.filter((t) => !t.completed).length;
  const overdueCompliance = complianceSeed.filter((c) => c.status === "Overdue").length;

  const canEdit = roleCanEdit(role);
  const canUpload = roleCanUpload(role);
  const canManageDocs = roleCanEditDocuments(role);
  const canManageCompliance = roleCanManageCompliance(role);

  const tabs = useMemo(
    () => [
      { key: "handover" as TabKey, label: "Daily Handover", icon: MessageSquare, badge: "Live" },
      { key: "information" as TabKey, label: "Information", icon: FileText },
      { key: "issues" as TabKey, label: "Issues", icon: ClipboardList, badge: String(openIssueCount) },
      { key: "timeline" as TabKey, label: "Timeline", icon: Clock3 },
      { key: "events" as TabKey, label: "Events", icon: CalendarDays, badge: String(events.length) },
      { key: "bookings" as TabKey, label: "Bookings / Calendar", icon: CalendarClock, badge: String(bookingItems.length) },
      { key: "procedures" as TabKey, label: "Opening / Closing", icon: PlayCircle },
      { key: "weekly" as TabKey, label: "Weekly Tasks", icon: CheckSquare, badge: String(weeklyDue) },
      { key: "monthly" as TabKey, label: "Monthly Tasks", icon: CalendarRange, badge: String(monthlyDue) },
      { key: "documents" as TabKey, label: "Documents / SOPs", icon: FolderOpen, badge: String(documents.length) },
      { key: "photos" as TabKey, label: "Photo Log", icon: Camera, badge: String(photos.length) },
      { key: "compliance" as TabKey, label: "Compliance", icon: BadgeCheck, badge: overdueCompliance > 0 ? String(overdueCompliance) : undefined },
      { key: "audit" as TabKey, label: "Audit Trail", icon: History, badge: String(audit.length) },
    ],
    [audit.length, documents.length, monthlyDue, openIssueCount, overdueCompliance, photos.length, weeklyDue]
  );

  function addAuditEntry(action: string, detail: string) {
    const userName =
      role === "Centre Manager"
        ? "Jordan Smith"
        : role === "Facilities Manager"
          ? "Alex Garcia"
          : "Admin User";

    const entry: AuditItem = {
      id: `aud-${Date.now()}`,
      time: "11 Apr 2026 • Now",
      user: userName,
      role,
      action,
      detail,
    };

    setAudit((prev) => [entry, ...prev]);
  }

  function addTimelineUpdate() {
    const text = updateText.trim();
    if (!text) return;

    const item: TimelineItem = {
      id: `tl-${Date.now()}`,
      time: "11 Apr 2026 • Now",
      title: "Manager update posted",
      type: "Handover",
      detail: text,
    };

    setTimeline((prev) => [item, ...prev]);
    addAuditEntry("Posted timeline update", text);
    setUpdateText("");
    setActiveTab("timeline");
  }

  function toggleOpening(id: string) {
    setOpeningChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    addAuditEntry("Updated opening procedure", "Opening checklist item toggled.");
  }

  function toggleClosing(id: string) {
    setClosingChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    addAuditEntry("Updated closing procedure", "Closing checklist item toggled.");
  }

  function toggleWeekly(id: string) {
    const target = weeklyTasks.find((item) => item.id === id);
    setWeeklyTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "Done" : "Due",
            }
          : item
      )
    );
    addAuditEntry(
      "Updated weekly task",
      target ? `${target.task} toggled.` : "Weekly task toggled."
    );
  }

  function toggleMonthly(id: string) {
    const target = monthlyTasks.find((item) => item.id === id);
    setMonthlyTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "Done" : "Due",
            }
          : item
      )
    );
    addAuditEntry(
      "Updated monthly task",
      target ? `${target.task} toggled.` : "Monthly task toggled."
    );
  }

  function submitDocumentUpload() {
    if (!docForm.title.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docForm.title.trim(),
      category: docForm.category,
      version: docForm.version.trim() || "v1.0",
      updated: "11 Apr 2026",
      owner: docForm.owner || role,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    addAuditEntry(
      "Uploaded document",
      `${newDoc.title} added to Documents / SOPs.`
    );
    setDocForm({
      title: "",
      category: "SOP",
      version: "",
      owner: role,
      fileName: "",
    });
    setDocModalOpen(false);
    setActiveTab("documents");
  }

  function submitPhotoUpload() {
    if (!photoForm.title.trim()) return;

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: photoForm.title.trim(),
      area: photoForm.area.trim() || "General Area",
      uploaded: "11 Apr 2026 • Now",
      note: photoForm.note.trim() || "Uploaded via mock photo log modal.",
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    addAuditEntry("Uploaded photo", `${newPhoto.title} added to Photo Log.`);
    setPhotoForm({
      title: "",
      area: "",
      note: "",
      fileName: "",
    });
    setPhotoModalOpen(false);
    setActiveTab("photos");
  }

  const openingDone = openingChecklist.filter((s) => s.done).length;
  const closingDone = closingChecklist.filter((s) => s.done).length;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0C2F57] to-[#174A84] text-white shadow-sm">
        <div className="px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <button
                onClick={() => router.push("/admin/facilities")}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to Facilities
              </button>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                  <Building2 size={14} />
                  {facility.type}
                </span>

                <span
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1",
                    status.className
                  )}
                >
                  <StatusIcon size={14} />
                  {facility.status}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                  <BellRing size={14} />
                  Operations Workspace
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
                {facility.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/85">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {facility.address}
                </span>
                <span className="opacity-60">•</span>
                <span>{facility.suburb}</span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80 md:text-base">
                {facility.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <UserCog size={16} />
                <span className="text-sm font-medium">View as</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="rounded-lg bg-white px-2 py-1 text-sm text-slate-900 outline-none"
                >
                  <option>Centre Manager</option>
                  <option>Facilities Manager</option>
                  <option>GSLA Admin</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/admin/facilities/${facility.id}/edit`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2F57] transition hover:brightness-95"
                >
                  <Pencil size={16} />
                  Edit Facility
                </button>

                <button
                  onClick={() => router.push(`/admin/facilities/${facility.id}/issues`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  <ClipboardList size={16} />
                  Open Issues Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Open Issues"
          value={openIssueCount}
          subtitle="Current operational concerns"
          tone="rose"
        />
        <StatCard
          title="Today's Events"
          value={events.filter((e) => e.date === "11 Apr 2026").length}
          subtitle="Sessions and scheduled usage"
          tone="emerald"
        />
        <StatCard
          title="Weekly Tasks Due"
          value={weeklyDue}
          subtitle="Tasks awaiting completion"
          tone="amber"
        />
        <StatCard
          title="Monthly Tasks Due"
          value={monthlyDue}
          subtitle="Longer-cycle responsibilities"
          tone="amber"
        />
        <StatCard
          title="Urgent Items"
          value={facility.summary.urgentItems}
          subtitle="Need manager visibility"
          tone="rose"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 text-sm font-semibold text-slate-900">
                Facility Workspace
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={classNames(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
                        active
                          ? "bg-[#0C2F57] text-white"
                          : "bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </span>

                      {tab.badge ? (
                        <span
                          className={classNames(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                            active
                              ? "bg-white/15 text-white ring-white/15"
                              : "bg-slate-100 text-slate-700 ring-slate-200"
                          )}
                        >
                          {tab.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mock Permissions
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    {canEdit ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                    Edit workspace content
                  </div>
                  <div className="flex items-center gap-2">
                    {canUpload ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                    Upload documents / photos
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageCompliance ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                    Manage compliance items
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Main Contact
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {facility.manager.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {facility.manager.title}
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-500" />
                    {facility.manager.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-500" />
                    {facility.manager.phone}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Remote Oversight
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {facility.facilitiesManager.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Reviews updates remotely
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  {facility.facilitiesManager.email}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-9">
          {activeTab === "handover" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Daily Handover"
                    description="The main communication space between centre managers and facilities managers."
                    action={
                      canEdit ? (
                        <button
                          onClick={addTimelineUpdate}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Send size={16} />
                          Post to Timeline
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Read only
                        </span>
                      )
                    }
                  />

                  <div className="mt-5 grid grid-cols-1 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <label className="text-sm font-semibold text-slate-900">
                        Shift Summary
                      </label>
                      <textarea
                        value={handover.shiftSummary}
                        onChange={(e) =>
                          setHandover((prev) => ({
                            ...prev,
                            shiftSummary: e.target.value,
                          }))
                        }
                        rows={4}
                        disabled={!canEdit}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <TriangleAlert size={16} />
                          Risks / Concerns
                        </label>
                        <textarea
                          value={handover.risks}
                          onChange={(e) =>
                            setHandover((prev) => ({
                              ...prev,
                              risks: e.target.value,
                            }))
                          }
                          rows={5}
                          disabled={!canEdit}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                        />
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Siren size={16} />
                          Actions Required
                        </label>
                        <textarea
                          value={handover.actionsRequired}
                          onChange={(e) =>
                            setHandover((prev) => ({
                              ...prev,
                              actionsRequired: e.target.value,
                            }))
                          }
                          rows={5}
                          disabled={!canEdit}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Info size={16} />
                        Manager Message / Notes
                      </label>
                      <textarea
                        value={handover.managerMessage}
                        onChange={(e) =>
                          setHandover((prev) => ({
                            ...prev,
                            managerMessage: e.target.value,
                          }))
                        }
                        rows={3}
                        disabled={!canEdit}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
                  <CardContent className="p-6">
                    <SectionTitle
                      title="Quick Update Composer"
                      description="Post a short operational update directly into the facility timeline."
                    />

                    <div className="mt-4">
                      <textarea
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        rows={4}
                        disabled={!canEdit}
                        placeholder="Example: Main gate lock checked, evening booking confirmed, awaiting maintenance response on floodlights..."
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={addTimelineUpdate}
                        disabled={!canEdit || !updateText.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                      >
                        <Plus size={16} />
                        Add Update
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <SectionTitle
                      title="At a Glance"
                      description="Fast operational snapshot."
                    />

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Site Status
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {facility.status}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                          Open Issues
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {openIssueCount} active
                        </div>
                      </div>

                      <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          Tasks Due
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {weeklyDue + monthlyDue} pending
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Compliance
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {overdueCompliance} overdue item{overdueCompliance === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "information" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Facility Information"
                    description="Core information used by centre managers and facilities managers."
                  />

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Facility Name
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {facility.name}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {facility.type}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Area
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {facility.suburb}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Operational Status
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {facility.status}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:col-span-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Address
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {facility.address}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Supported Activity"
                    description="Sports and activity types currently associated with this site."
                  />

                  <div className="mt-5 flex flex-wrap gap-3">
                    {facility.sportsSupported.map((sport) => (
                      <span
                        key={sport}
                        className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Operational Notes"
                    description="Important context visible to both local and remote managers."
                  />

                  <div className="mt-5 space-y-3">
                    {facility.notes.map((note) => (
                      <div
                        key={note}
                        className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700 ring-1 ring-slate-200"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "issues" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Current Issues"
                  description="Open and recent issues affecting day-to-day facility operations."
                />

                <div className="mt-5 space-y-4">
                  {initialIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {issue.id}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                miniStatus(issue.status)
                              )}
                            >
                              {issue.status}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                miniStatus(issue.priority)
                              )}
                            >
                              {issue.priority}
                            </span>
                          </div>

                          <div className="mt-3 text-base font-semibold text-slate-900">
                            {issue.title}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Updated: {issue.updated}</span>
                            <span>•</span>
                            <span>Owner: {issue.owner}</span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            router.push(`/admin/facilities/${facility.id}/issues`)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "timeline" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Facility Timeline"
                  description="A running log of operational activity, issue updates, and notable events."
                />

                <div className="mt-6 space-y-5">
                  {timeline.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 rounded-full bg-[#0C2F57] p-1.5 text-white">
                          <CircleDot size={12} />
                        </div>
                        <div className="h-full w-px bg-slate-200" />
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {item.type}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.time}
                        </div>
                        <div className="mt-3 text-sm text-slate-700">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "events" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Facility Events"
                  description="Scheduled activities, bookings, and on-site operational use."
                />

                <div className="mt-5 space-y-4">
                  {events.map((event) => (
                    <div
                      key={`${event.title}-${event.date}-${event.time}`}
                      className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="text-base font-semibold text-slate-900">
                            {event.title}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.time}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {event.organiser}
                          </span>
                          <span
                            className={classNames(
                              "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              miniStatus(event.status)
                            )}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Bookings / Calendar"
                    description="Operational view of scheduled use, booking windows, and quick links to your main bookings and calendar pages."
                    action={
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => router.push("/admin/bookings")}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink size={15} />
                          Open Bookings
                        </button>
                        <button
                          onClick={() => router.push("/admin/calendar")}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <ExternalLink size={15} />
                          Open Calendar
                        </button>
                      </div>
                    }
                  />

                  <div className="mt-5 space-y-4">
                    {bookingItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              {item.title}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                              <span>{item.date}</span>
                              <span>•</span>
                              <span>{item.time}</span>
                              <span>•</span>
                              <span>{item.space}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {item.source}
                            </span>
                            <span
                              className={classNames(
                                "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                miniStatus(item.status)
                              )}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    Mock note: this tab is designed to surface key scheduling
                    information while linking out to your existing Bookings and
                    Calendar areas.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "procedures" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Opening Procedure"
                    description="Steps to complete at the start of the day."
                    action={
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {openingDone}/{openingChecklist.length} done
                      </span>
                    }
                  />

                  <div className="mt-5 space-y-3">
                    {openingChecklist.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => canEdit && toggleOpening(step.id)}
                        disabled={!canEdit}
                        className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-left ring-1 ring-slate-200 disabled:opacity-70"
                      >
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            step.done ? "bg-emerald-600" : "bg-[#0C2F57]"
                          )}
                        >
                          {step.done ? "✓" : index + 1}
                        </span>
                        <span className="text-sm text-slate-700">
                          {step.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Closing Procedure"
                    description="Steps to complete before the facility is locked down."
                    action={
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {closingDone}/{closingChecklist.length} done
                      </span>
                    }
                  />

                  <div className="mt-5 space-y-3">
                    {closingChecklist.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => canEdit && toggleClosing(step.id)}
                        disabled={!canEdit}
                        className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-left ring-1 ring-slate-200 disabled:opacity-70"
                      >
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            step.done ? "bg-emerald-600" : "bg-slate-700"
                          )}
                        >
                          {step.done ? "✓" : index + 1}
                        </span>
                        <span className="text-sm text-slate-700">
                          {step.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <DoorClosed size={16} />
                      End of Day Reminder
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Use the timeline or handover tab to record anything the
                      next shift or facilities manager needs to know.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "weekly" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Weekly Tasks"
                  description="Routine weekly actions that support safe and consistent operations."
                />

                <div className="mt-5 space-y-4">
                  {weeklyTasks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => canEdit && toggleWeekly(item.id)}
                      disabled={!canEdit}
                      className="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between disabled:opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            item.completed ? "bg-emerald-600" : "bg-[#0C2F57]"
                          )}
                        >
                          {item.completed ? "✓" : ""}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.task}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Owner: {item.owner}
                          </div>
                        </div>
                      </div>

                      <span
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                          miniStatus(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "monthly" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Monthly Tasks"
                  description="Longer-cycle tasks for maintenance, compliance, and management oversight."
                />

                <div className="mt-5 space-y-4">
                  {monthlyTasks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => canEdit && toggleMonthly(item.id)}
                      disabled={!canEdit}
                      className="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between disabled:opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={classNames(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                            item.completed ? "bg-emerald-600" : "bg-slate-700"
                          )}
                        >
                          {item.completed ? "✓" : ""}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.task}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Owner: {item.owner}
                          </div>
                        </div>
                      </div>

                      <span
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                          miniStatus(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Documents / SOPs"
                    description="Key procedures, checklists, policies, and forms used on site."
                    action={
                      canManageDocs ? (
                        <button
                          onClick={() => setDocModalOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Upload size={16} />
                          Upload Document
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Restricted
                        </span>
                      )
                    }
                  />

                  <div className="mt-5 space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {doc.title}
                            </span>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {doc.category}
                            </span>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {doc.version}
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-slate-500">
                            Updated {doc.updated} • Owner: {doc.owner}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <Eye size={15} />
                            View
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <Download size={15} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Photo Log"
                    description="Visual record of issues, inspections, and site condition updates."
                    action={
                      canUpload ? (
                        <button
                          onClick={() => setPhotoModalOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                        >
                          <Upload size={16} />
                          Upload Photo
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Restricted
                        </span>
                      )
                    }
                  />

                  <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                          <Camera size={28} />
                        </div>
                        <div className="p-4">
                          <div className="text-sm font-semibold text-slate-900">
                            {photo.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {photo.area} • {photo.uploaded}
                          </div>
                          <p className="mt-3 text-sm text-slate-700">
                            {photo.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="rounded-2xl border-emerald-200 bg-emerald-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-emerald-700" />
                      <div>
                        <div className="text-sm font-semibold text-emerald-700">
                          Compliant
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {complianceSeed.filter((c) => c.status === "Compliant").length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <HardHat size={18} className="text-amber-700" />
                      <div>
                        <div className="text-sm font-semibold text-amber-700">
                          Due Soon
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {complianceSeed.filter((c) => c.status === "Due Soon").length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-rose-200 bg-rose-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className="text-rose-700" />
                      <div>
                        <div className="text-sm font-semibold text-rose-700">
                          Overdue
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {overdueCompliance}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle
                    title="Compliance Register"
                    description="Track operational compliance, inspections, checks, and safety responsibilities."
                    action={
                      canManageCompliance ? (
                        <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                          <BadgeCheck size={14} />
                          Editable role
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <Lock size={14} />
                          Read only
                        </span>
                      )
                    }
                  />

                  <div className="mt-5 space-y-4">
                    {complianceSeed.map((item) => {
                      const AreaIcon =
                        item.area === "Fire Safety"
                          ? Flame
                          : item.area === "First Aid"
                            ? HeartPulse
                            : item.area === "Site Safety"
                              ? Shield
                              : BadgeCheck;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-white p-2.5 text-slate-700 ring-1 ring-slate-200">
                              <AreaIcon size={16} />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </div>
                              <div className="mt-1 text-sm text-slate-500">
                                {item.area} • Due {item.due} • Owner: {item.owner}
                              </div>
                            </div>
                          </div>

                          <span
                            className={classNames(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              miniStatus(item.status)
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "audit" && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <SectionTitle
                  title="Audit Trail"
                  description="Mock history of who changed what and when across the facility workspace."
                />

                <div className="mt-6 space-y-4">
                  {audit.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.action}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {item.detail}
                          </div>
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.time}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {item.user}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Modal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Upload document"
        description="Mock upload flow for SOPs, policies, forms, and checklists."
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Document title
            </label>
            <input
              value={docForm.title}
              onChange={(e) =>
                setDocForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="Example: Emergency Evacuation SOP"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={docForm.category}
                onChange={(e) =>
                  setDocForm((prev) => ({
                    ...prev,
                    category: e.target.value as DocumentItem["category"],
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option>SOP</option>
                <option>Checklist</option>
                <option>Policy</option>
                <option>Form</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Version
              </label>
              <input
                value={docForm.version}
                onChange={(e) =>
                  setDocForm((prev) => ({ ...prev, version: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                placeholder="v1.0"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Owner
              </label>
              <input
                value={docForm.owner}
                onChange={(e) =>
                  setDocForm((prev) => ({ ...prev, owner: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 p-4">
            <div className="text-sm font-semibold text-slate-900">
              File upload
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Mock only. Type a file name to simulate an uploaded file.
            </div>
            <input
              value={docForm.fileName}
              onChange={(e) =>
                setDocForm((prev) => ({ ...prev, fileName: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="europa-emergency-evacuation.pdf"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDocModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submitDocumentUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              <Upload size={15} />
              Save document
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        title="Upload photo"
        description="Mock upload flow for inspection and issue photos."
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Photo title
            </label>
            <input
              value={photoForm.title}
              onChange={(e) =>
                setPhotoForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="Example: Main gate latch condition"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Area
              </label>
              <input
                value={photoForm.area}
                onChange={(e) =>
                  setPhotoForm((prev) => ({ ...prev, area: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                placeholder="Main Pitch / Toilets / Gate / Stand"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                File name
              </label>
              <input
                value={photoForm.fileName}
                onChange={(e) =>
                  setPhotoForm((prev) => ({ ...prev, fileName: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                placeholder="pitch-lights-april11.jpg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Note
            </label>
            <textarea
              value={photoForm.note}
              onChange={(e) =>
                setPhotoForm((prev) => ({ ...prev, note: e.target.value }))
              }
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
              placeholder="Describe what the photo shows and why it was uploaded."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPhotoModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submitPhotoUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              <Upload size={15} />
              Save photo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}