// app/admin/sports/[sport]/coaches/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Pencil,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
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
  const { sport } = useParams<{ sport: string }>();

  const seasons = ["2025/26 (Current)", "2024/25", "2023/24"];
  const [season, setSeason] = useState(seasons[0]);

  const [adminMode, setAdminMode] = useState(true);
  const [modal, setModal] = useState<null | { type: "add" | "edit"; id?: string }>(null);

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

  const needsAttention = (c: Coach) =>
    c.safeguarding !== "Complete" || c.vetting !== "Complete" || c.firstAid === "Expired";

  const editing = modal?.type === "edit" ? coaches.find((c) => c.id === modal.id) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href={`/admin/sports/${sport}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Sport
            </Link>

            <div className="mt-4 flex items-center gap-2">
              <GraduationCap className="text-[#D81E27]" />
              <h1 className="text-2xl font-bold text-slate-900">Coaches</h1>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Coaching roster for the selected season — assignments, qualifications, safeguarding & vetting.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                adminMode
                  ? "border-[#D81E27]/20 bg-[#D81E27]/5 text-[#D81E27] hover:bg-[#D81E27]/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {adminMode ? "Admin mode: ON" : "Read-only: ON"}
            </button>

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

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {coaches.length} coaches (Season: <span className="font-bold">{season}</span>)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
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
            <tbody>
              {coaches.map((c) => {
                const flag = needsAttention(c);
                return (
                  <tr
                    key={c.id}
                    className={classNames(
                      "border-t border-slate-200",
                      flag ? "bg-amber-50/40" : "bg-white"
                    )}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-6 py-4 text-slate-700">{c.level}</td>
                    <td className="px-6 py-4 text-slate-700">{c.teams.join(", ")}</td>
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

      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Add Coach" : "Edit Coach"}
        description="Mock modal — coach identity + qualifications + compliance."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Full name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.name ?? ""}
                placeholder="e.g. Sarah Nolan"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Qualification level</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.level ?? ""}
                placeholder="Level 1 / Level 2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900">Assigned teams</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              defaultValue={editing?.teams?.join(", ") ?? ""}
              placeholder="e.g. U13 Tigers, Women’s A"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-900">Safeguarding</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.safeguarding ?? ""}
                placeholder="Complete / Pending"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Vetting</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.vetting ?? ""}
                placeholder="Complete / Pending"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">First Aid</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
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
