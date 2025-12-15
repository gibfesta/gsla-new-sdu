// app/admin/sports/[sport]/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Shield,
  Trophy,
  UserCheck,
  GraduationCap,
  ClipboardList,
  ChevronDown,
  Plus,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  Settings2,
} from "lucide-react";

type TabKey =
  | "overview"
  | "governance"
  | "leagues"
  | "teams"
  | "participants"
  | "coaches"
  | "compliance";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function toTitleCaseSlug(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
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
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-5">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            onClick={onClose}
          >
            Save (Mock)
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionShell({
  icon: Icon,
  title,
  right,
  children,
}: {
  icon: any;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="text-[#D81E27]" />
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>();
  const sportTitle = `${toTitleCaseSlug(sport)} Association`;

  const seasons = ["2025/26 (Current)", "2024/25", "2023/24", "2022/23"];
  const [season, setSeason] = useState(seasons[0]);

  const [adminMode, setAdminMode] = useState(true);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "governance", label: "Governance" },
    { key: "leagues", label: "Leagues" },
    { key: "teams", label: "Teams" },
    { key: "participants", label: "Participants" },
    { key: "coaches", label: "Coaches" },
    { key: "compliance", label: "Compliance" },
  ];
  const [tab, setTab] = useState<TabKey>("overview");

  const [modal, setModal] = useState<
    null | { type: "addTeam" | "editCommittee" | "addLeague" | "addCoach" }
  >(null);

  const committee = useMemo(
    () => [
      { role: "Chairperson", name: "John Murphy" },
      { role: "Secretary", name: "Aoife O’Connell" },
      { role: "Treasurer", name: "Michael Byrne" },
      { role: "Safeguarding Officer", name: "Laura Walsh" },
      { role: "Children’s Officer", name: "Patrick Ryan" },
    ],
    []
  );

  const leagues = useMemo(
    () => [
      { name: "Senior County League", status: "Active" },
      { name: "Junior Development League", status: "Active" },
      { name: "Women’s Premier League", status: "Active" },
      { name: "Schools Inter-County Cup", status: "Seasonal" },
      { name: "Over 35s Social League", status: "Active" },
    ],
    []
  );

  const ageGroups = useMemo(
    () => [
      { group: "Under 11", teams: 4 },
      { group: "Under 13", teams: 3 },
      { group: "Under 15", teams: 3 },
      { group: "Under 17", teams: 2 },
      { group: "Senior", teams: 4 },
      { group: "Women’s", teams: 2 },
    ],
    []
  );

  const quickStats = useMemo(
    () => [
      { label: "Registered Players", value: "486" },
      { label: "Under 18s", value: "312" },
      { label: "Adults", value: "174" },
      { label: "Active Volunteers", value: "68" },
    ],
    []
  );

  const coachQuals = useMemo(
    () => [
      { level: "Level 1 Coaches", count: 14 },
      { level: "Level 2 Coaches", count: 9 },
      { level: "Youth Certified Coaches", count: 11 },
      { level: "Safeguarding Certified", count: 100 },
    ],
    []
  );

  const compliance = useMemo(
    () => [
      { label: "Annual affiliation submitted to GSLA", ok: true },
      { label: "Safeguarding policy approved and on file", ok: true },
      { label: "Insurance certificates valid", ok: false },
      { label: "Code of Conduct acknowledged by all members", ok: true },
      { label: "Coach vetting completed for current season", ok: false },
    ],
    []
  );

  const missingComplianceCount = compliance.filter((c) => !c.ok).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{sportTitle}</h1>
            <p className="mt-1 text-sm text-slate-600">
              GSLA sport admin — governance, operations, participants and compliance.
            </p>

            {missingComplianceCount > 0 ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Missing compliance items ({missingComplianceCount})
                  </p>
                  <p className="text-sm text-amber-800">
                    Review the Compliance tab to resolve outstanding requirements.
                  </p>
                </div>
                <button
                  className="ml-auto rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                  onClick={() => setTab("compliance")}
                >
                  View compliance
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Compliance complete
                  </p>
                  <p className="text-sm text-emerald-800">
                    All required items are on file for this season.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Season filter */}
            <div className="relative">
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-slate-900 outline-none hover:bg-slate-50 sm:w-[220px]"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    Season: {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
            </div>

            <button
              onClick={() => setAdminMode((v) => !v)}
              className={classNames(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                adminMode
                  ? "border-[#D81E27]/20 bg-[#D81E27]/5 text-[#D81E27] hover:bg-[#D81E27]/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              title="Mock: toggle admin mode"
            >
              <Settings2 size={16} />
              {adminMode ? "Admin mode: ON" : "Read-only: ON"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <SectionShell icon={UserCheck} title="At a glance">
            <div className="grid gap-4 md:grid-cols-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </SectionShell>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionShell
              icon={Shield}
              title="Governance (Top roles)"
              right={
                adminMode ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setModal({ type: "editCommittee" })}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                ) : null
              }
            >
              <div className="space-y-3">
                {committee.slice(0, 4).map((m) => (
                  <div
                    key={m.role}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{m.role}</p>
                      <p className="text-sm text-slate-600">{m.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href={`/admin/sports/${sport}/governance`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
                >
                  View full governance <ArrowRight size={16} />
                </Link>
              </div>
            </SectionShell>

            <SectionShell
              icon={ClipboardList}
              title="Compliance snapshot"
              right={
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setTab("compliance")}
                >
                  View tab <ArrowRight size={16} />
                </button>
              }
            >
              <div className="space-y-2">
                {compliance.slice(0, 4).map((c) => (
                  <div
                    key={c.label}
                    className={classNames(
                      "flex items-start gap-3 rounded-xl border px-4 py-3",
                      c.ok
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-amber-200 bg-amber-50"
                    )}
                  >
                    {c.ok ? (
                      <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                    ) : (
                      <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                    )}
                    <p
                      className={classNames(
                        "text-sm font-medium",
                        c.ok ? "text-emerald-900" : "text-amber-900"
                      )}
                    >
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </SectionShell>
          </div>
        </div>
      )}

      {/* Governance */}
      {tab === "governance" && (
        <SectionShell
          icon={Shield}
          title="Committee & Governance"
          right={
            adminMode ? (
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => setModal({ type: "editCommittee" })}
              >
                <Pencil size={16} />
                Edit roles
              </button>
            ) : null
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {committee.map((m) => (
              <div
                key={m.role}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{m.role}</p>
                  <p className="text-sm text-slate-600">{m.name}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Leagues */}
      {tab === "leagues" && (
        <SectionShell
          icon={Trophy}
          title="Leagues & Competitions"
          right={
            adminMode ? (
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => setModal({ type: "addLeague" })}
              >
                <Plus size={16} />
                Add league
              </button>
            ) : null
          }
        >
          <div className="space-y-3">
            {leagues.map((l) => (
              <div
                key={l.name}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{l.name}</p>
                  <p className="text-sm text-slate-600">Season: {season}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Teams */}
      {tab === "teams" && (
        <SectionShell
          icon={Users}
          title="Teams & Age Groups"
          right={
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/sports/${sport}/teams`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Teams <ArrowRight size={16} />
              </Link>
              {adminMode ? (
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  onClick={() => setModal({ type: "addTeam" })}
                >
                  <Plus size={16} />
                  Add team
                </button>
              ) : null}
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {ageGroups.map((a) => (
              <div key={a.group} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{a.group}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {a.teams} registered teams (Season: {season})
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Participants */}
      {tab === "participants" && (
        <SectionShell
          icon={UserCheck}
          title="Participants"
          right={
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/sports/${sport}/participants`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Open Participants List <ArrowRight size={16} />
              </Link>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-4">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 p-4 text-center"
              >
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Coaches */}
      {tab === "coaches" && (
        <SectionShell
          icon={GraduationCap}
          title="Coaches & Qualifications"
          right={
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/sports/${sport}/coaches`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View coaches <ArrowRight size={16} />
              </Link>
              {adminMode ? (
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  onClick={() => setModal({ type: "addCoach" })}
                >
                  <Plus size={16} />
                  Add coach
                </button>
              ) : null}
            </div>
          }
        >
          <div className="space-y-3">
            {coachQuals.map((c) => (
              <div
                key={c.level}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="font-semibold text-slate-900">{c.level}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Compliance */}
      {tab === "compliance" && (
        <SectionShell icon={ClipboardList} title="Compliance & Administration">
          <div className="space-y-3">
            {compliance.map((c) => (
              <div
                key={c.label}
                className={classNames(
                  "flex items-start justify-between gap-4 rounded-2xl border p-4",
                  c.ok
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                  ) : (
                    <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                  )}
                  <div>
                    <p
                      className={classNames(
                        "text-sm font-semibold",
                        c.ok ? "text-emerald-900" : "text-amber-900"
                      )}
                    >
                      {c.label}
                    </p>
                    <p
                      className={classNames(
                        "mt-1 text-sm",
                        c.ok ? "text-emerald-800" : "text-amber-800"
                      )}
                    >
                      Season: {season}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Modals */}
      <Modal
        open={modal?.type === "addTeam"}
        title="Add Team"
        description="Mock modal — later this writes to DB."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900">Team name</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="e.g. U13 Falcons"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={modal?.type === "editCommittee"}
        title="Edit Committee Roles"
        description="Mock modal — governance capture."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          {committee.map((m) => (
            <div key={m.role} className="grid gap-2 sm:grid-cols-2">
              <div className="text-sm font-semibold text-slate-900">{m.role}</div>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={m.name}
              />
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal?.type === "addLeague"}
        title="Add League / Competition"
        description="Mock modal — league metadata."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900">League name</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="e.g. Senior County League"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={modal?.type === "addCoach"}
        title="Add Coach"
        description="Mock modal — coach identity + qualifications."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900">Full name</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="e.g. Sarah Nolan"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
