// app/admin/sports/[sport]/page.tsx
"use client";

/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Goal:
 * - Match the same page scaffolding used in Profile / Calendar / Facilities:
 *   1) Full-page light background
 *   2) White header bar with border
 *   3) Constrained max width
 *   4) Rounded “card” sections with subtle shadow
 *   5) Tabs as a pill switcher (bg-slate-100 + white active)
 *
 * Added:
 * - Association-managed sport logo (demo):
 *   - Upload in the “Update logo” modal
 *   - Stored in localStorage by sport slug
 *   - Shows next to sport name (fallback = initials)
 *
 * Rule:
 * - Still mock/static datasets for stats, leagues, etc.
 * - No backend wiring yet.
 */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
  ImageIcon,
  Upload,
  Trash2,
} from "lucide-react";

/** ------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------ */

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

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

/** ------------------------------------------------------------
 * Demo persistence: Sport Logos (association-provided)
 * ------------------------------------------------------------
 * Stored as base64 dataUrl so it works with “no backend”.
 * Later: replace with Sport.logoUrl from DB and remove localStorage.
 */
const SPORT_LOGO_STORAGE_KEY = "gsla_sport_logos_demo_v1";

type LogoStore = Record<string, { name: string; dataUrl: string }>;

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

async function fileToDataUrl(file: File): Promise<{ name: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve({ name: file.name, dataUrl: String(fr.result || "") });
    fr.onerror = () => reject(new Error("Failed to read file"));
    fr.readAsDataURL(file);
  });
}

/** ------------------------------------------------------------
 * Small UI building blocks (same vibe as Profile/Calendar/Facilities)
 * ------------------------------------------------------------ */

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "red" | "amber" | "emerald" | "indigo";
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
            : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1", toneCls)}>
      {children}
    </span>
  );
}

function SectionShell({
  icon: Icon,
  title,
  subtitle,
  right,
  children,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
            <Icon size={18} className="text-[#D81E27]" />
          </span>
          <div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
          </div>
        </div>
        {right ? <div className="flex flex-wrap items-center gap-2">{right}</div> : null}
      </div>

      <div className="mt-4">{children}</div>
    </section>
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
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
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

/** ------------------------------------------------------------
 * Page
 * ------------------------------------------------------------ */

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>();
  const sportSlug = String(sport || "").toLowerCase();
  const sportName = toTitleCaseSlug(String(sport || ""));
  const sportTitle = `${sportName} Association`;

  const seasons = ["2025/26 (Current)", "2024/25", "2023/24", "2022/23"];
  const [season, setSeason] = useState(seasons[0]);

  // Mock permission toggle (replace with real RBAC later)
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
    null | { type: "addTeam" | "editCommittee" | "addLeague" | "addCoach" | "editLogo" }
  >(null);

  /** Logo state (localStorage demo) */
  const [logoStore, setLogoStore] = useState<LogoStore>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = safeParse<LogoStore>(localStorage.getItem(SPORT_LOGO_STORAGE_KEY)) ?? {};
    setLogoStore(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SPORT_LOGO_STORAGE_KEY, JSON.stringify(logoStore));
  }, [logoStore]);

  const logo = logoStore[sportSlug] ?? null;

  async function onPickLogo(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    const data = await fileToDataUrl(f);
    setLogoStore((prev) => ({ ...prev, [sportSlug]: data }));
  }

  function clearLogo() {
    setLogoStore((prev) => {
      const next = { ...prev };
      delete next[sportSlug];
      return next;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /** Mock datasets (static for now) */
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
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      {/* HEADER BAR (Profile/Calendar style) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: identity */}
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                {/* Logo block */}
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  {logo?.dataUrl ? (
                    // dataUrl is safe for next/image when unoptimized
                    <Image
                      src={logo.dataUrl}
                      alt={`${sportName} logo`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-slate-600">
                      {initialsFromName(sportName)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{sportTitle}</h1>

                    <Pill tone={missingComplianceCount > 0 ? "amber" : "emerald"}>
                      {missingComplianceCount > 0 ? (
                        <>
                          <AlertTriangle size={14} />
                          {missingComplianceCount} missing
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          Compliant
                        </>
                      )}
                    </Pill>

                    <Pill tone="indigo">
                      <ImageIcon size={14} />
                      Logo: {logo ? "Set" : "Not set"}
                    </Pill>
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    Governance, competitions, teams, participants and compliance.
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setModal({ type: "editLogo" })}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Update logo
                    </button>

                    {/* Optional: quick jump */}
                    {missingComplianceCount > 0 ? (
                      <button
                        className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                        onClick={() => setTab("compliance")}
                      >
                        <AlertTriangle size={16} />
                        View compliance
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Compliance callout (same callout style as Facilities-like pages) */}
              <div className="mt-5">
                {missingComplianceCount > 0 ? (
                  <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                      <div>
                        <div className="text-sm font-semibold text-amber-900">
                          Missing compliance items ({missingComplianceCount})
                        </div>
                        <div className="text-sm text-amber-800">Review and resolve in the Compliance tab.</div>
                      </div>
                    </div>
                    <button
                      className="rounded-2xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                      onClick={() => setTab("compliance")}
                    >
                      View compliance
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                    <div>
                      <div className="text-sm font-semibold text-emerald-900">Compliance complete</div>
                      <div className="text-sm text-emerald-800">All required items are on file for this season.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-semibold text-slate-900 outline-none hover:bg-slate-50"
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
                  "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                  adminMode
                    ? "border-[#D81E27]/20 bg-[#D81E27]/5 text-[#D81E27] hover:bg-[#D81E27]/10"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
                title="Mock: toggle admin mode"
              >
                <Settings2 size={16} />
                {adminMode ? "Admin mode" : "Read-only"}
              </button>
            </div>
          </div>

          {/* Tabs switcher (Profile/Calendar style) */}
          <div className="mt-6">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              {tabs.map((t) => {
                const active = t.key === tab;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={classNames(
                      "rounded-xl px-4 py-2 text-sm font-semibold transition",
                      active ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {tab === "overview" ? (
          <div className="space-y-6">
            <SectionShell icon={UserCheck} title="At a glance" subtitle={`Season context: ${season}`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickStats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </SectionShell>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SectionShell
                icon={Shield}
                title="Governance"
                subtitle="Committee snapshot and governance link."
                right={
                  adminMode ? (
                    <button
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
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
                    <div key={m.role} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900">{m.role}</div>
                      <div className="mt-1 text-sm text-slate-600">{m.name}</div>
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
                subtitle="Top checklist items with quick visual state."
                right={
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    onClick={() => setTab("compliance")}
                  >
                    Open tab <ArrowRight size={16} />
                  </button>
                }
              >
                <div className="space-y-2">
                  {compliance.slice(0, 4).map((c) => (
                    <div
                      key={c.label}
                      className={classNames(
                        "flex items-start gap-3 rounded-2xl border px-4 py-3",
                        c.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
                      )}
                    >
                      {c.ok ? (
                        <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                      ) : (
                        <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                      )}
                      <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                    </div>
                  ))}
                </div>
              </SectionShell>
            </div>
          </div>
        ) : null}

        {tab === "governance" ? (
          <SectionShell
            icon={Shield}
            title="Committee & Governance"
            subtitle="Key roles responsible for sport governance."
            right={
              adminMode ? (
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  onClick={() => setModal({ type: "editCommittee" })}
                >
                  <Pencil size={16} />
                  Edit roles
                </button>
              ) : null
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {committee.map((m) => (
                <div key={m.role} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">{m.role}</div>
                  <div className="mt-1 text-sm text-slate-600">{m.name}</div>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {tab === "leagues" ? (
          <SectionShell
            icon={Trophy}
            title="Leagues & Competitions"
            subtitle={`Season context: ${season}`}
            right={
              adminMode ? (
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
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
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{l.name}</div>
                    <div className="mt-1 text-sm text-slate-600">Season: {season}</div>
                  </div>
                  <Pill tone="slate">{l.status}</Pill>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {tab === "teams" ? (
          <SectionShell
            icon={Users}
            title="Teams & Age Groups"
            subtitle="Quick snapshot by age band."
            right={
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/sports/${sport}/teams`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  View teams <ArrowRight size={16} />
                </Link>
                {adminMode ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    onClick={() => setModal({ type: "addTeam" })}
                  >
                    <Plus size={16} />
                    Add team
                  </button>
                ) : null}
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {ageGroups.map((a) => (
                <div key={a.group} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">{a.group}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {a.teams} registered teams • {season}
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {tab === "participants" ? (
          <SectionShell
            icon={UserCheck}
            title="Participants"
            subtitle="Summary stats and a link to the full participant list."
            right={
              <Link
                href={`/admin/sports/${sport}/participants`}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open list <ArrowRight size={16} />
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">{s.label}</div>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {tab === "coaches" ? (
          <SectionShell
            icon={GraduationCap}
            title="Coaches & Qualifications"
            subtitle="Qualification coverage and coaching pipeline."
            right={
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/sports/${sport}/coaches`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  View coaches <ArrowRight size={16} />
                </Link>
                {adminMode ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    onClick={() => setModal({ type: "addCoach" })}
                  >
                    <Plus size={16} />
                    Add coach
                  </button>
                ) : null}
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {coachQuals.map((c) => (
                <div
                  key={c.level}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-sm font-semibold text-slate-900">{c.level}</div>
                  <Pill tone="indigo">{c.count}</Pill>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}

        {tab === "compliance" ? (
          <SectionShell icon={ClipboardList} title="Compliance & Administration" subtitle={`Season context: ${season}`}>
            <div className="space-y-3">
              {compliance.map((c) => (
                <div
                  key={c.label}
                  className={classNames(
                    "rounded-2xl border p-4",
                    c.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {c.ok ? (
                      <CheckCircle2 className="mt-0.5 text-emerald-700" size={18} />
                    ) : (
                      <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                      <div className="mt-1 text-sm text-slate-600">Season: {season}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>
        ) : null}
      </div>

      {/* MODALS */}
      <Modal
        open={modal?.type === "editLogo"}
        title="Update sport logo"
        description="Associations must upload/set their sport logo."
        onClose={() => setModal(null)}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Logo</div>
                <div className="mt-1 text-xs text-slate-600">
                  Upload a PNG/JPG. Saved in localStorage for this demo.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickLogo(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <Upload size={16} />
                  Upload
                </button>
                <button
                  onClick={clearLogo}
                  disabled={!logo}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                {logo?.dataUrl ? (
                  <Image src={logo.dataUrl} alt={logo.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-slate-600">
                    {initialsFromName(sportName)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  Current: {logo ? logo.name : "No logo set"}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  This demo stores the image in your browser (per sport slug).
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Later (backend)</div>
            <div className="mt-1">
              Save the uploaded image to storage (S3/Cloudinary) → store URL on the Sport record (Sport.logoUrl).
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={modal?.type === "addTeam"}
        title="Add team"
        description="Mock modal — later writes to DB."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-900">Team name</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            placeholder="e.g. U13 Falcons"
          />
        </div>
      </Modal>

      <Modal
        open={modal?.type === "editCommittee"}
        title="Edit committee roles"
        description="Mock modal — governance capture."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          {committee.map((m) => (
            <div key={m.role} className="grid gap-2 sm:grid-cols-2">
              <div className="text-sm font-semibold text-slate-900">{m.role}</div>
              <input
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                defaultValue={m.name}
              />
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal?.type === "addLeague"}
        title="Add league / competition"
        description="Mock modal — league metadata."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-900">League name</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            placeholder="e.g. Senior County League"
          />
        </div>
      </Modal>

      <Modal
        open={modal?.type === "addCoach"}
        title="Add coach"
        description="Mock modal — coach identity + qualifications."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-900">Full name</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            placeholder="e.g. Sarah Nolan"
          />
        </div>
      </Modal>
    </div>
  );
}
