"use client";

// -------------------------------------------------------------------------------------
// PAGE: Profile (User / Volunteer / Member)
// Purpose: A “single profile view” that shows personal details, account access, volunteer
//          compliance, memberships, activity, training, documents, and internal notes.
// Rule: COMMENTS ONLY — no logic or UI changes.
// Where to wire real data later: replace the `useMemo` seed objects (profile/activity) with
//                                fetch/server data (DB/API) + pass into this component.
// -------------------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import {
  // Icons used across the page. Swap/extend these if you add new sections or statuses.
  User,
  ShieldCheck,
  BadgeCheck,
  GraduationCap,
  CalendarDays,
  FileText,
  Activity,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Pencil,
  Lock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Trophy,
  Users,
} from "lucide-react";

/**
 * BadgeTone
 * Controls semantic colour styles for the little “pill badges” used everywhere (status, roles, etc).
 * Edit tones here if you want to update branding/colour language globally.
 */
type BadgeTone = "good" | "warn" | "bad" | "neutral" | "brand";

/**
 * cn()
 * Tiny className joiner (common Tailwind helper).
 * If you migrate to a shared `cn` util (e.g. "@/lib/utils"), replace this with your project-wide one.
 */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Badge
 * Reusable pill UI used for statuses/roles/tags. Keeps styling consistent across sections.
 * - Edit tone colour mappings in `tones` to change global badge appearance.
 */
function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  // Colour mappings for badge tones (global look & feel for all badges)
  const tones: Record<BadgeTone, string> = {
    good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-700 ring-amber-200",
    bad: "bg-rose-50 text-rose-700 ring-rose-200",
    neutral: "bg-slate-50 text-slate-700 ring-slate-200",
    brand: "bg-red-50 text-[#D81E27] ring-red-200", // GSLA accent vibe
  };

  return (
    <span
      className={cn(
        // Base pill layout shared by all badges
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Card
 * Main section wrapper (big blocks like Profile Summary, Account Information, etc).
 * - `title` shows in the header
 * - `icon` shows in the header badge
 * - `actions` renders on the right side (use for edit buttons, filters, etc)
 *
 * If you want to change the layout of all major sections, edit this component once.
 */
function Card({
  title,
  icon: Icon,
  actions,
  children,
}: {
  title: string;
  icon?: any;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Card header (title + optional icon + optional action buttons) */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700">
              <Icon size={18} />
            </span>
          ) : null}
          <div>
            <div className="text-base font-semibold text-slate-900">{title}</div>
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      {/* Card body content */}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

/**
 * Field
 * A small “label + value” tile used in grids (email, phone, username, 2FA, etc).
 * - Use `mono` for IDs/usernames/codes to visually separate “machine-ish” values.
 */
function Field({
  label,
  value,
  icon: Icon,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  icon?: any;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Optional leading icon */}
      {Icon ? (
        <div className="mt-0.5 text-slate-500">
          <Icon size={16} />
        </div>
      ) : (
        // Keeps alignment consistent when no icon is passed
        <div className="mt-0.5 h-4 w-4" />
      )}

      <div className="min-w-0">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className={cn("truncate text-sm text-slate-900", mono && "font-mono")}>{value}</div>
      </div>
    </div>
  );
}

/**
 * SectionGrid
 * Consistent grid layout for “Field tiles”.
 * If you want Account Information to become 2 columns or 4 columns, tweak it here.
 */
function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{children}</div>;
}

/**
 * SubCard
 * Smaller nested card used inside a section (e.g. Volunteer Status, Compliance).
 * Lets you structure a big section into “mini panels”.
 */
function SubCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-600">{subtitle}</div> : null}
        </div>
        {/* Typically used for status pill/badge on the top-right */}
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

/**
 * StatusPill
 * Converts a small set of “status enums” into a consistent Badge + Icon.
 * Add new statuses here when you introduce more compliance/training states.
 */
function StatusPill({
  status,
}: {
  status: "Completed" | "Booked" | "Overdue" | "Valid" | "ExpiringSoon" | "OnHold";
}) {
  // Mapping between statuses and tone/icon/label. This is your single source of truth for status UI.
  const map = {
    Completed: { tone: "good" as const, icon: CheckCircle2, label: "Completed" },
    Booked: { tone: "warn" as const, icon: Clock, label: "Booked" },
    Overdue: { tone: "bad" as const, icon: XCircle, label: "Overdue" },
    Valid: { tone: "good" as const, icon: CheckCircle2, label: "Valid" },
    ExpiringSoon: { tone: "warn" as const, icon: AlertTriangle, label: "Expiring soon" },
    OnHold: { tone: "neutral" as const, icon: Clock, label: "On hold" },
  }[status];

  const Icon = map.icon;

  return (
    <Badge tone={map.tone}>
      <Icon size={14} />
      {map.label}
    </Badge>
  );
}

/**
 * ActivityItem
 * Represents a single “event/activity row” in the Events & Activity section.
 * In production, this likely comes from your events/calendar module + attendance records.
 */
type ActivityItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  role: string;
  location: string;
  kind: "Match" | "Tournament" | "Course" | "Seminar" | "LocalEvent";
  status: "Upcoming" | "Completed" | "Missed";
};

export default function Page() {
  // UI STATE: controls which activity tab is shown.
  // If you add new tabs, extend this union + the rendering below.
  const [tab, setTab] = useState<"Upcoming" | "Past" | "Attendance">("Upcoming");

  /**
   * SEED DATA: profile
   * Currently hard-coded via useMemo. Replace with real user data:
   * - Server component fetch + pass in props, OR
   * - Client fetch with SWR/React Query.
   *
   * This object is deliberately “wide” to demonstrate how the profile page could be structured.
   */
  const profile = useMemo(
    () => ({
      // Identity basics (top-left of Profile Summary)
      name: "Alex Morgan",
      preferredName: "Alex",
      dob: "12 Aug 1992",

      // Contact details (right side of Profile Summary)
      email: "alex.morgan@example.com",
      emailVerified: true,
      phone: "+350 555 0123",
      address: "12 Europa Point Rd, Gibraltar, GX11 1AA",

      // High-level status + tags (badges in Profile Summary)
      status: "Active" as const,
      roles: ["User", "Volunteer", "Coach Assistant"],
      sports: ["Football", "Cricket"],

      // Account module access + security
      account: {
        username: "alexm",
        userId: "GSLA-001728",
        createdOn: "08 Jan 2024",
        lastLogin: "14 Dec 2025, 18:41",
        twoFA: true,
        // Used to render a list of “module access” badges
        access: ["Dashboard", "Calendar", "Forms", "Notifications", "Sports"],
      },

      // Volunteer-specific profile
      volunteer: {
        status: "Active" as const,
        startDate: "04 Feb 2024",
        renewalDate: "04 Feb 2026",
        roles: ["Match Day Volunteer", "Youth Team Helper", "Event Support"],
        availability: ["Weekends", "Evenings"],
        awayEvents: true,
        // Compliance items shown on the right mini panel
        compliance: [
          { label: "DBS / Vetting", status: "Valid" as const, detail: "Expires 10 Oct 2026" },
          {
            label: "Safeguarding",
            status: "Valid" as const,
            detail: "Completed 22 Mar 2025 • Refresh due 22 Mar 2027",
          },
          { label: "First Aid", status: "ExpiringSoon" as const, detail: "Expires 18 Jan 2026" },
        ],
      },

      // Sport memberships / registrations (one block per sport/club)
      memberships: [
        {
          sport: "Football",
          club: "GSLA United",
          membershipType: "Volunteer + Team Staff",
          registrationNo: "FB-24-9918",
          season: "2025–2026",
          teams: ["U14 Assistant Coach", "Match Day Volunteer"],
          league: "Youth Premier Division",
          status: "Active" as const,
        },
        {
          sport: "Cricket",
          club: "GSLA Cricket Club",
          membershipType: "Member",
          registrationNo: "CR-25-1142",
          season: "2025",
          teams: ["Club Member"],
          league: "County Amateur League",
          status: "Active" as const,
        },
      ],

      // Training / qualifications (right column “Training & Qualifications”)
      courses: [
        {
          name: "Safeguarding Course",
          provider: "GSLA Learning",
          completedOn: "22 Mar 2025",
          expiresOn: "22 Mar 2027",
          status: "Completed" as const,
        },
        {
          name: "First Aid (Emergency Aid)",
          provider: "Red Cross Partner",
          completedOn: "19 Jan 2024",
          expiresOn: "18 Jan 2026",
          status: "Booked" as const, // Example: renewal is booked, but expiry is near
          note: "Renewal session booked",
        },
        {
          name: "Petanque Level 1 Coaching Course",
          provider: "National Petanque Org",
          completedOn: "12 Sep 2025",
          expiresOn: null as string | null,
          status: "Completed" as const,
        },
        {
          name: "Coach Personal Development Seminar",
          provider: "GSLA Workshops",
          completedOn: null as string | null,
          expiresOn: null as string | null,
          status: "Booked" as const,
          note: "Scheduled for 09 Jan 2026",
        },
        {
          name: "Child Protection Refresher",
          provider: "Safeguarding Board",
          completedOn: "14 Apr 2023",
          expiresOn: "14 Apr 2025",
          status: "Overdue" as const,
        },
      ],

      // Uploaded documents list (right column “Documents”)
      documents: [
        { name: "ID Verification", uploaded: "08 Jan 2024", expiry: null },
        { name: "DBS / Vetting Certificate", uploaded: "10 Oct 2024", expiry: "10 Oct 2026" },
        { name: "Safeguarding Certificate", uploaded: "22 Mar 2025", expiry: "22 Mar 2027" },
        { name: "First Aid Certificate", uploaded: "19 Jan 2024", expiry: "18 Jan 2026" },
        { name: "Coaching Certificate (Petanque L1)", uploaded: "12 Sep 2025", expiry: null },
      ],

      // Admin/internal notes log (right column “Internal Notes & Log”)
      notes: [
        { when: "05 Nov 2025", who: "Admin", text: "Promoted to Coach Assistant (Football U14)." },
        { when: "01 Dec 2025", who: "System", text: "First Aid certificate expiring soon." },
        { when: "14 Dec 2025", who: "System", text: "Volunteer status confirmed active." },
      ],
    }),
    []
  );

  /**
   * SEED DATA: activity
   * The “Events & Activity” list. Replace with real calendar/event data.
   * If you later add attendance tracking, you can attach check-in/out info here.
   */
  const activity: ActivityItem[] = useMemo(
    () => [
      {
        id: "a1",
        title: "Youth League Match — U14 (Home)",
        date: "21 Dec 2025",
        time: "10:30",
        role: "Coach Assistant",
        location: "Europa Sports Complex",
        kind: "Match",
        status: "Upcoming",
      },
      {
        id: "a2",
        title: "County Amateur League Fixture",
        date: "04 Jan 2026",
        time: "13:00",
        role: "Member",
        location: "Bay Cricket Grounds",
        kind: "Match",
        status: "Upcoming",
      },
      {
        id: "a3",
        title: "Away Tournament — Winter Cup",
        date: "18 Jan 2026",
        time: "All day",
        role: "Volunteer",
        location: "Seville (Away)",
        kind: "Tournament",
        status: "Upcoming",
      },
      {
        id: "a4",
        title: "Coach Personal Development Seminar",
        date: "09 Jan 2026",
        time: "18:00",
        role: "Attendee",
        location: "GSLA Training Hall",
        kind: "Seminar",
        status: "Upcoming",
      },
      {
        id: "a5",
        title: "Local Community Sports Day",
        date: "16 Nov 2025",
        time: "11:00",
        role: "Event Support",
        location: "Main Square",
        kind: "LocalEvent",
        status: "Completed",
      },
      {
        id: "a6",
        title: "Safeguarding Workshop Refresher",
        date: "10 Oct 2025",
        time: "17:30",
        role: "Volunteer",
        location: "Online",
        kind: "Course",
        status: "Completed",
      },
      {
        id: "a7",
        title: "Youth League Match — U14 (Away)",
        date: "28 Sep 2025",
        time: "09:30",
        role: "Coach Assistant",
        location: "North Field (Away)",
        kind: "Match",
        status: "Missed",
      },
    ],
    []
  );

  /**
   * filtered
   * Derived list for the Activity section based on `tab`.
   * If you add more filtering (sport filter, date range, etc) this is the place to extend.
   */
  const filtered = useMemo(() => {
    if (tab === "Upcoming") return activity.filter((x) => x.status === "Upcoming");
    if (tab === "Past") return activity.filter((x) => x.status !== "Upcoming");
    // Attendance shows everything right now; later you’d join this with check-in data.
    return activity;
  }, [activity, tab]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ---------------------------------------------------------------------------------
            HEADER
            - Title + subtitle (left)
            - Top-right action buttons (Edit / Change Password / Deactivate)
            Wire these buttons to real actions later:
              - Edit Profile -> open modal / navigate to edit route
              - Change Password -> auth flow
              - Deactivate -> admin-only action + confirmation modal
            --------------------------------------------------------------------------------- */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Profile</h1>
            <p className="mt-1 text-sm text-slate-600">
              Personal details, roles, memberships &amp; activity
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* TODO: Hook up to profile edit route/modal */}
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Pencil size={16} />
              Edit Profile
            </button>

            {/* TODO: Hook up to password reset / change-password flow */}
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Lock size={16} />
              Change Password
            </button>

            {/* TODO: Add confirmation modal + role check (admin only) */}
            <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">
              <Ban size={16} />
              Deactivate
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------
            MAIN LAYOUT GRID
            - Left column (primary): summary, account, volunteer, memberships, activity
            - Right column (secondary): training, documents, notes
            Change proportions by editing lg:col-span-* below.
            --------------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: main profile content */}
          <div className="lg:col-span-8 space-y-6">
            {/* -----------------------------------------------------------------------------
               Profile summary
               - Avatar initials are currently hard-coded ("AM"). To generate dynamically:
                 take initials from profile.name
               - Badges: status + volunteer + member (currently static tags for demo)
               - Contact Fields: email/phone/address (email includes “Verified/Unverified”)
               ----------------------------------------------------------------------------- */}
            <Card title="Profile Summary" icon={User}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  {/* Avatar
                      TODO: Replace with real user photo URL or generated initials.
                      If using an image, swap this div for an <img> with rounded-2xl. */}
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-white">
                    <span className="text-lg font-extrabold">AM</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-bold text-slate-900">{profile.name}</div>

                      {/* Profile status badge (Active / Suspended / etc) */}
                      <Badge tone="good">
                        <CheckCircle2 size={14} />
                        {profile.status}
                      </Badge>

                      {/* Role highlight badges (these two are currently “demo labels”) */}
                      <Badge tone="brand">
                        <ShieldCheck size={14} />
                        Volunteer
                      </Badge>
                      <Badge tone="neutral">
                        <Trophy size={14} />
                        Member
                      </Badge>
                    </div>

                    {/* Quick identity line (preferred name + DOB) */}
                    <div className="mt-1 text-sm text-slate-600">
                      Preferred name:{" "}
                      <span className="font-semibold text-slate-800">{profile.preferredName}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      DOB: <span className="font-semibold text-slate-800">{profile.dob}</span>
                    </div>

                    {/* Roles + sports tags (chips) */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {/* TODO: If roles become large, consider limiting to first N + “+X more”. */}
                      {profile.roles.map((r) => (
                        <Badge key={r} tone="neutral">
                          {r}
                        </Badge>
                      ))}
                      {profile.sports.map((s) => (
                        <Badge key={s} tone="neutral">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact details panel (right side) */}
                <div className="grid w-full grid-cols-1 gap-3 sm:max-w-sm">
                  <Field
                    label="Email"
                    icon={Mail}
                    value={
                      <span className="inline-flex items-center gap-2">
                        <span className="truncate">{profile.email}</span>

                        {/* Email verification indicator */}
                        {profile.emailVerified ? (
                          <Badge tone="good" className="shrink-0">
                            <BadgeCheck size={14} />
                            Verified
                          </Badge>
                        ) : (
                          <Badge tone="warn" className="shrink-0">
                            <AlertTriangle size={14} />
                            Unverified
                          </Badge>
                        )}
                      </span>
                    }
                  />
                  <Field label="Phone" icon={Phone} value={profile.phone} />
                  <Field label="Address" icon={MapPin} value={profile.address} />
                </div>
              </div>
            </Card>

            {/* -----------------------------------------------------------------------------
               Account info
               Shows: username, ID, created date, last login, 2FA status, and module access.
               Hook to your auth/user table fields later.
               ----------------------------------------------------------------------------- */}
            <Card title="Account Information" icon={KeyRound}>
              <SectionGrid>
                <Field label="Username" value={profile.account.username} mono />
                <Field label="User ID" value={profile.account.userId} mono />
                <Field label="Account created" value={profile.account.createdOn} />
                <Field label="Last login" value={profile.account.lastLogin} />

                {/* 2FA status is displayed as a StatusPill */}
                <Field
                  label="Two-factor authentication"
                  value={profile.account.twoFA ? <StatusPill status="Valid" /> : <StatusPill status="Overdue" />}
                />

                {/* Module access list */}
                <Field
                  label="Accessible modules"
                  value={
                    <div className="flex flex-wrap gap-2">
                      {profile.account.access.map((m) => (
                        <Badge key={m} tone="neutral">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              </SectionGrid>
            </Card>

            {/* -----------------------------------------------------------------------------
               Volunteer Profile
               Left mini panel: volunteer status, roles, availability, away-events
               Right mini panel: compliance requirements with StatusPill per item
               ----------------------------------------------------------------------------- */}
            <Card title="Volunteer Profile" icon={ShieldCheck}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SubCard
                  title="Volunteer Status"
                  subtitle={`Start: ${profile.volunteer.startDate} • Renewal: ${profile.volunteer.renewalDate}`}
                  // TODO: If volunteer status can change (Suspended/Inactive), bind tone accordingly.
                  right={<Badge tone="good">Active</Badge>}
                >
                  <div className="mt-1 grid grid-cols-1 gap-2">
                    <div className="text-xs font-semibold text-slate-500">Volunteer roles</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.volunteer.roles.map((r) => (
                        <Badge key={r} tone="neutral">
                          {r}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 text-xs font-semibold text-slate-500">Availability</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.volunteer.availability.map((a) => (
                        <Badge key={a} tone="neutral">
                          {a}
                        </Badge>
                      ))}

                      {/* Away events preference */}
                      <Badge tone={profile.volunteer.awayEvents ? "good" : "neutral"}>
                        {profile.volunteer.awayEvents ? "Away events: Yes" : "Away events: No"}
                      </Badge>
                    </div>
                  </div>
                </SubCard>

                <SubCard title="Safeguarding & Compliance" subtitle="Requirements to remain active">
                  {/* Compliance list: each row is label + detail + status pill */}
                  <div className="space-y-3">
                    {profile.volunteer.compliance.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                          <div className="mt-0.5 text-xs text-slate-600">{c.detail}</div>
                        </div>
                        <div className="shrink-0">
                          <StatusPill status={c.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </SubCard>
              </div>
            </Card>

            {/* -----------------------------------------------------------------------------
               Sport Memberships
               Renders each membership as a card (sport, club, league, season, reg no, teams).
               TODO: This likely maps to your “registrations” table + team assignments.
               ----------------------------------------------------------------------------- */}
            <Card title="Sport Memberships" icon={Users}>
              <div className="grid grid-cols-1 gap-4">
                {profile.memberships.map((m) => (
                  <div key={m.registrationNo} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-base font-bold text-slate-900">{m.sport}</div>
                          <Badge tone="good">{m.status}</Badge>
                          <Badge tone="neutral">{m.membershipType}</Badge>
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          Club: <span className="font-semibold text-slate-800">{m.club}</span>
                          <span className="mx-2 text-slate-300">•</span>
                          League: <span className="font-semibold text-slate-800">{m.league}</span>
                        </div>

                        <div className="mt-1 text-xs text-slate-600">
                          Registration:{" "}
                          <span className="font-mono font-semibold text-slate-800">{m.registrationNo}</span>
                          <span className="mx-2 text-slate-300">•</span>
                          Season: <span className="font-semibold text-slate-800">{m.season}</span>
                        </div>
                      </div>

                      {/* Team/role tags within this membership */}
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        {m.teams.map((t) => (
                          <Badge key={t} tone="neutral">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* -----------------------------------------------------------------------------
               Events & Activity
               - Tab buttons toggle filtering (Upcoming/Past/Attendance)
               - Activity list uses computed icon and badge tone based on type/status.
               - Attendance tab reveals summary “counts” (currently derived from seed list).
               ----------------------------------------------------------------------------- */}
            <Card title="Events & Activity" icon={Activity}>
              {/* Tabs: purely UI state right now; in production you may route/query-string this */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {(["Upcoming", "Past", "Attendance"] as const).map((t) => {
                  const active = tab === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm font-semibold transition",
                        active
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {/* List of events based on selected tab */}
              <div className="space-y-3">
                {filtered.map((a) => {
                  // Status -> colour tone mapping for event badge
                  const statusTone =
                    a.status === "Upcoming" ? "good" : a.status === "Completed" ? "neutral" : "bad";

                  // Kind -> icon mapping (matches/tournaments use Trophy, courses use GraduationCap, etc)
                  const kindIcon =
                    a.kind === "Match"
                      ? Trophy
                      : a.kind === "Tournament"
                      ? Trophy
                      : a.kind === "Course"
                      ? GraduationCap
                      : a.kind === "Seminar"
                      ? GraduationCap
                      : CalendarDays;

                  const KindIcon = kindIcon;

                  return (
                    <div
                      key={a.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700">
                          <KindIcon size={18} />
                        </span>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-slate-900">{a.title}</div>
                          <div className="mt-1 text-xs text-slate-600">
                            {a.date} • {a.time} • {a.location}
                          </div>

                          {/* Quick tags for kind and role */}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge tone="neutral">{a.kind}</Badge>
                            <Badge tone="neutral">Role: {a.role}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Status badge (Upcoming / Completed / Missed) */}
                      <div className="shrink-0">
                        <Badge tone={statusTone as any}>
                          {a.status === "Upcoming" ? (
                            <Clock size={14} />
                          ) : a.status === "Completed" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attendance summary panel only appears on Attendance tab */}
              {tab === "Attendance" ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-900">Attendance summary</div>

                  {/* Counts are computed from seed `activity` list.
                      TODO: Replace with real attendance record counts (check-ins, confirmations). */}
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">Upcoming</div>
                      <div className="mt-1 text-2xl font-extrabold text-slate-900">
                        {activity.filter((x) => x.status === "Upcoming").length}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">Completed</div>
                      <div className="mt-1 text-2xl font-extrabold text-slate-900">
                        {activity.filter((x) => x.status === "Completed").length}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500">Missed</div>
                      <div className="mt-1 text-2xl font-extrabold text-slate-900">
                        {activity.filter((x) => x.status === "Missed").length}
                      </div>
                    </div>
                  </div>

                  {/* Friendly implementation hint (purely informational) */}
                  <div className="mt-3 text-xs text-slate-600">
                    Tip: You can later wire this into real attendance records (check-in / QR scan / coach confirmation).
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

          {/* RIGHT COLUMN: supporting information / admin tools */}
          <div className="lg:col-span-4 space-y-6">
            {/* -----------------------------------------------------------------------------
               Training & Qualifications
               List of courses with status pills + completion/expiry dates.
               Buttons are placeholders:
                 - View Certificate -> open doc viewer
                 - Manage -> edit training record / upload certificate / schedule renewal
               ----------------------------------------------------------------------------- */}
            <Card title="Training & Qualifications" icon={GraduationCap}>
              <div className="space-y-3">
                {profile.courses.map((c) => (
                  <div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-900">{c.name}</div>
                        <div className="mt-1 text-xs text-slate-600">{c.provider}</div>
                      </div>
                      <div className="shrink-0">
                        <StatusPill status={c.status} />
                      </div>
                    </div>

                    {/* Dates + optional note */}
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Completed:</span> {c.completedOn ?? "—"}
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Expires:</span> {c.expiresOn ?? "—"}
                      </div>
                      {c.note ? <div className="text-xs text-slate-600">{c.note}</div> : null}
                    </div>

                    {/* TODO: Wire these buttons to real actions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        View Certificate
                      </button>
                      <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* -----------------------------------------------------------------------------
               Documents
               List of uploaded documents + expiry tracking indicator.
               Buttons are placeholders:
                 - Download -> file download
                 - Replace -> upload new version + keep audit trail
               Quick upload box at bottom is a placeholder for a real uploader.
               ----------------------------------------------------------------------------- */}
            <Card title="Documents" icon={FileText}>
              <div className="space-y-3">
                {profile.documents.map((d) => (
                  <div key={d.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-900">{d.name}</div>
                        <div className="mt-1 text-xs text-slate-600">Uploaded: {d.uploaded}</div>
                        <div className="mt-1 text-xs text-slate-600">
                          Expiry: <span className="font-semibold text-slate-700">{d.expiry ?? "—"}</span>
                        </div>
                      </div>

                      {/* Expiry tracking indicator */}
                      <div className="shrink-0">
                        {d.expiry ? (
                          <Badge tone="neutral">
                            <Clock size={14} />
                            Tracked
                          </Badge>
                        ) : (
                          <Badge tone="neutral">No expiry</Badge>
                        )}
                      </div>
                    </div>

                    {/* TODO: Wire document actions (download/replace) */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Download
                      </button>
                      <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick upload placeholder */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">Quick upload</div>
                <div className="mt-2 text-xs text-slate-600">
                  Later you can replace this with a real uploader (S3, Supabase storage, etc.).
                </div>

                {/* TODO: Replace with real upload component + progress/error UI */}
                <button className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
                  Upload Document
                </button>
              </div>
            </Card>

            {/* -----------------------------------------------------------------------------
               Internal Notes & Log
               Displays audit/notes timeline + a simple “Add note” textarea.
               IMPORTANT: This should be admin-only in real life.
               TODO:
                 - Persist notes to DB
                 - Add author + timestamp from session
                 - Add permissions check before rendering the input
               ----------------------------------------------------------------------------- */}
            <Card title="Internal Notes & Log" icon={CalendarDays}>
              <div className="space-y-3">
                {profile.notes.map((n, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs font-semibold text-slate-500">{n.when}</div>
                      <Badge tone="neutral">{n.who}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-900">{n.text}</div>
                  </div>
                ))}
              </div>

              {/* Add note form (placeholder) */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">Add note</div>

                {/* TODO: Control this textarea with state + submit handler */}
                <textarea
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  rows={3}
                  placeholder="Write an internal note (admin-only)..."
                />

                {/* TODO: Wire to save note action (server action / API route) */}
                <button className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                  Save Note
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
