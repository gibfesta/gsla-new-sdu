// app/admin/sports/[sport]/coaches/page.tsx
"use client"; // Client Component: this page uses React state/hooks (season dropdown, admin toggle, modal).

import Link from "next/link"; // For in-app navigation back to the sport overview.
import { useMemo, useState } from "react"; // useState drives UI toggles; useMemo holds mock data stable.
import { useParams } from "next/navigation"; // Reads the dynamic route param: /admin/sports/[sport]/coaches.
import {
  ArrowLeft, // UI icon: back navigation button.
  GraduationCap, // UI icon: page header (coaches/qualifications theme).
  Plus, // UI icon: "Add coach" action.
  Pencil, // UI icon: "Edit" action per row.
  X, // UI icon: close modal.
  CheckCircle2, // UI icon: compliance OK flag.
  AlertTriangle, // UI icon: needs-attention flag.
  ChevronDown, // UI icon: season dropdown indicator.
} from "lucide-react";

/**
 * Utility: tiny class joiner.
 * Edit here if you later want a shared cn() helper, or swap to a library (e.g. clsx),
 * without touching the JSX everywhere else.
 */
function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

/**
 * Reusable modal shell (mock).
 * - `open` controls whether it renders.
 * - `title` / `description` define the header content.
 * - `children` is the form body content.
 * - `onClose` closes via overlay click, X button, Cancel, or Save (Mock).
 *
 * Where to extend later:
 * - Wire Save to a real submit handler (currently it just calls onClose).
 * - Add focus trap / ESC-to-close / animations if desired.
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
  // Render nothing unless open.
  if (!open) return null;

  return (
    // Fixed overlay: sits above the rest of the app (z-index high).
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop: clicking it closes the modal (mock UX). */}
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      {/* Modal panel: centered, constrained width, GSLA-ish rounded + border style. */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header: title, description, close button. */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>

          {/* Close icon button (top-right). */}
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body content: injected form fields live here. */}
        <div className="p-5">{children}</div>

        {/* Footer actions: Cancel + Save (Mock). */}
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

/**
 * Data model for a single coach row.
 * Edit here if you add fields like email, phone, cert expiry dates, etc.
 */
type Coach = {
  id: string;
  name: string;
  level: string;
  teams: string[];
  safeguarding: "Complete" | "Pending";
  vetting: "Complete" | "Pending";
  firstAid: "Valid" | "Expired" | "Unknown";
};

export default function CoachesPage() {
  // Route context: sport is taken from the URL segment [sport].
  const { sport } = useParams<{ sport: string }>();

  /**
   * Season filter (UI only).
   * - Update `seasons` to add/remove seasons.
   * - `season` holds the currently selected season label.
   */
  const seasons = ["2025/26 (Current)", "2024/25", "2023/24"];
  const [season, setSeason] = useState(seasons[0]);

  /**
   * Admin mode toggle:
   * - ON: show Add button and Edit actions.
   * - OFF: lock the page to read-only UI.
   *
   * Later: you can set this from real permissions rather than local state.
   */
  const [adminMode, setAdminMode] = useState(true);

  /**
   * Modal state:
   * - null: modal closed
   * - { type: "add" }: open add flow
   * - { type: "edit", id }: open edit flow for specific coach
   *
   * Later: hook this to real CRUD and validation.
   */
  const [modal, setModal] = useState<null | { type: "add" | "edit"; id?: string }>(null);

  /**
   * Mock dataset (stable across renders).
   * Replace this with fetched data when you connect to an API / DB.
   */
  const coaches: Coach[] = useMemo(
    () => [
      {
        id: "c1",
        name: "Sarah Nolan",
        level: "Level 2",
        teams: ["Women’s A", "U15 County"],
        safeguarding: "Complete",
        vetting: "Complete",
        firstAid: "Valid",
      },
      {
        id: "c2",
        name: "Patrick Ryan",
        level: "Level 1",
        teams: ["U13 Tigers"],
        safeguarding: "Pending",
        vetting: "Pending",
        firstAid: "Unknown",
      },
      {
        id: "c3",
        name: "John Murphy",
        level: "Level 2",
        teams: ["Senior A"],
        safeguarding: "Complete",
        vetting: "Complete",
        firstAid: "Expired",
      },
    ],
    []
  );

  /**
   * Compliance/attention rule for highlighting rows + rendering the "Flags" column.
   * Edit here if your business logic changes (e.g., treat Unknown as attention-worthy).
   */
  const needsAttention = (c: Coach) =>
    c.safeguarding !== "Complete" || c.vetting !== "Complete" || c.firstAid === "Expired";

  /**
   * Convenience: if editing, locate the coach record for the modal default values.
   * (Purely for mock form prefill right now.)
   */
  const editing = modal?.type === "edit" ? coaches.find((c) => c.id === modal.id) : null;

  return (
    <div className="space-y-6">
      {/* ===== Page header / controls card ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Left: back link + title + subtitle */}
          <div>
            {/* Back navigation uses the current sport param to route correctly. */}
            <Link
              href={`/admin/sports/${sport}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Sport
            </Link>

            {/* Title row */}
            <div className="mt-4 flex items-center gap-2">
              <GraduationCap className="text-[#D81E27]" />
              <h1 className="text-2xl font-bold text-slate-900">Coaches</h1>
            </div>

            {/* Context text: describes what the table is representing. */}
            <p className="mt-1 text-sm text-slate-600">
              Coaching roster for the selected season — assignments, qualifications, safeguarding & vetting.
            </p>
          </div>

          {/* Right: season selector + admin toggle + add coach */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Season selector (UI only). */}
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

              {/* Decorative chevron icon for the select control. */}
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
            </div>

            {/* Admin/read-only toggle (local state mock). */}
            <button
              onClick={() => setAdminMode((v) => !v)}
              className={classNames(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                adminMode
                  ? "border-[#D81E27]/20 bg-[#D81E27]/5 text-[#D81E27] hover:bg-[#D81E27]/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {adminMode ? "Admin mode: ON" : "Read-only: ON"}
            </button>

            {/* Add button only appears in admin mode. */}
            {adminMode ? (
              <button
                onClick={() => setModal({ type: "add" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                <Plus size={16} />
                Add coach
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ===== Table card ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {/* Table header strip: coach count + selected season label. */}
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {coaches.length} coaches (Season: <span className="font-bold">{season}</span>)
          </p>
        </div>

        {/* Scroll container for wide tables on small screens. */}
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            {/* Column labels */}
            <thead className="bg-slate-50 text-slate-700">
              <tr className="text-left">
                <th className="px-6 py-3 font-bold">Coach</th>
                <th className="px-6 py-3 font-bold">Level</th>
                <th className="px-6 py-3 font-bold">Teams</th>
                <th className="px-6 py-3 font-bold">Safeguarding</th>
                <th className="px-6 py-3 font-bold">Vetting</th>
                <th className="px-6 py-3 font-bold">First Aid</th>
                <th className="px-6 py-3 font-bold">Flags</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>

            {/* Rows: derived from the mock coaches array */}
            <tbody>
              {coaches.map((c) => {
                // Row-level flag used for background highlight + "Needs attention" chip.
                const flag = needsAttention(c);

                return (
                  <tr
                    key={c.id}
                    className={classNames(
                      "border-t border-slate-200",
                      flag ? "bg-amber-50/40" : "bg-white"
                    )}
                  >
                    {/* Coach identity */}
                    <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>

                    {/* Qualification level */}
                    <td className="px-6 py-4 text-slate-700">{c.level}</td>

                    {/* Team assignments list */}
                    <td className="px-6 py-4 text-slate-700">{c.teams.join(", ")}</td>

                    {/* Safeguarding status pill */}
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          c.safeguarding === "Complete"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                        )}
                      >
                        {c.safeguarding}
                      </span>
                    </td>

                    {/* Vetting status pill */}
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          c.vetting === "Complete"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                        )}
                      >
                        {c.vetting}
                      </span>
                    </td>

                    {/* First Aid status pill */}
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          c.firstAid === "Valid" && "border-emerald-200 bg-emerald-50 text-emerald-900",
                          c.firstAid === "Expired" && "border-amber-200 bg-amber-50 text-amber-900",
                          c.firstAid === "Unknown" && "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                      >
                        {c.firstAid}
                      </span>
                    </td>

                    {/* Overall flag summary */}
                    <td className="px-6 py-4">
                      {flag ? (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                          <AlertTriangle size={14} className="text-amber-700" />
                          Needs attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">
                          <CheckCircle2 size={14} className="text-emerald-700" />
                          OK
                        </span>
                      )}
                    </td>

                    {/* Row actions: Edit button (admin) or Read-only label */}
                    <td className="px-6 py-4 text-right">
                      {adminMode ? (
                        <button
                          onClick={() => setModal({ type: "edit", id: c.id })}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">Read-only</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Empty state: only shows if coaches array becomes empty (future real data). */}
              {coaches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-600">
                    No coaches found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Add/Edit modal (mock form) ===== */}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Add Coach" : "Edit Coach"}
        description="Mock modal — coach identity + qualifications + compliance."
        onClose={() => setModal(null)}
      >
        {/* Form layout only: fields are uncontrolled (defaultValue) and do not persist yet. */}
        <div className="grid gap-3">
          {/* Basic identity + qualification */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Full name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                // Prefill when editing; blank when adding.
                defaultValue={editing?.name ?? ""}
                placeholder="e.g. Sarah Nolan"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">Qualification level</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                // Prefill when editing; blank when adding.
                defaultValue={editing?.level ?? ""}
                placeholder="Level 1 / Level 2"
              />
            </div>
          </div>

          {/* Team assignments: currently a comma-separated string */}
          <div>
            <label className="text-sm font-semibold text-slate-900">Assigned teams</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              // Prefill when editing; blank when adding.
              defaultValue={editing?.teams?.join(", ") ?? ""}
              placeholder="e.g. U13 Tigers, Women’s A"
            />
          </div>

          {/* Compliance fields: safeguarding / vetting / first aid */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-900">Safeguarding</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                // Prefill when editing; blank when adding.
                defaultValue={editing?.safeguarding ?? ""}
                placeholder="Complete / Pending"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">Vetting</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                // Prefill when editing; blank when adding.
                defaultValue={editing?.vetting ?? ""}
                placeholder="Complete / Pending"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">First Aid</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                // Prefill when editing; blank when adding.
                defaultValue={editing?.firstAid ?? ""}
                placeholder="Valid / Expired / Unknown"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
