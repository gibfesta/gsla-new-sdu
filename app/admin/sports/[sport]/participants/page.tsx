// app/admin/sports/[sport]/participants/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Pencil,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  X,
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
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
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

type Participant = {
  id: string;
  name: string;
  dob: string;
  ageGroup: "U11" | "U13" | "U15" | "U17" | "Senior" | "Women";
  role: "Player" | "Volunteer" | "Coach";
  team?: string;
  status: "Active" | "Pending" | "Inactive";
  safeguarding: "Complete" | "Pending" | "Required";
  vetting: "Complete" | "Pending" | "N/A";
};

export default function ParticipantsPage() {
  const { sport } = useParams<{ sport: string }>();

  const [adminMode, setAdminMode] = useState(true);

  const seasons = ["2025/26 (Current)", "2024/25", "2023/24"];
  const [season, setSeason] = useState(seasons[0]);

  const [q, setQ] = useState("");
  const [ageGroup, setAgeGroup] = useState<"All" | Participant["ageGroup"]>("All");
  const [role, setRole] = useState<"All" | Participant["role"]>("All");
  const [status, setStatus] = useState<"All" | Participant["status"]>("All");
  const [onlyFlags, setOnlyFlags] = useState(false);

  const data: Participant[] = useMemo(
    () => [
      {
        id: "p1",
        name: "Amir Khan",
        dob: "2014-03-12",
        ageGroup: "U11",
        role: "Player",
        team: "U11 Falcons",
        status: "Active",
        safeguarding: "Complete",
        vetting: "N/A",
      },
      {
        id: "p2",
        name: "Sophie Martin",
        dob: "2012-07-05",
        ageGroup: "U13",
        role: "Player",
        team: "U13 Tigers",
        status: "Active",
        safeguarding: "Pending",
        vetting: "N/A",
      },
      {
        id: "p3",
        name: "Daniel O’Rourke",
        dob: "2009-10-22",
        ageGroup: "U17",
        role: "Player",
        team: "U17 County",
        status: "Pending",
        safeguarding: "Required",
        vetting: "N/A",
      },
      {
        id: "p4",
        name: "Laura Walsh",
        dob: "1986-01-14",
        ageGroup: "Senior",
        role: "Volunteer",
        team: "N/A",
        status: "Active",
        safeguarding: "Complete",
        vetting: "Pending",
      },
      {
        id: "p5",
        name: "Sarah Nolan",
        dob: "1992-05-30",
        ageGroup: "Women",
        role: "Coach",
        team: "Women’s A",
        status: "Active",
        safeguarding: "Complete",
        vetting: "Complete",
      },
      {
        id: "p6",
        name: "Michael Byrne",
        dob: "1981-11-02",
        ageGroup: "Senior",
        role: "Volunteer",
        team: "N/A",
        status: "Inactive",
        safeguarding: "Complete",
        vetting: "Complete",
      },
    ],
    []
  );

  const flagged = (p: Participant) =>
    p.safeguarding !== "Complete" || (p.role !== "Player" && p.vetting !== "Complete");

  const rows = useMemo(() => {
    return data
      .filter((p) => {
        const matchesQ =
          !q.trim() ||
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          (p.team ?? "").toLowerCase().includes(q.toLowerCase());

        const matchesAge = ageGroup === "All" || p.ageGroup === ageGroup;
        const matchesRole = role === "All" || p.role === role;
        const matchesStatus = status === "All" || p.status === status;

        const matchesFlags = !onlyFlags || flagged(p);
        return matchesQ && matchesAge && matchesRole && matchesStatus && matchesFlags;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, q, ageGroup, role, status, onlyFlags]);

  const [modal, setModal] = useState<null | { type: "add" | "edit"; id?: string }>(
    null
  );
  const modalParticipant = modal?.type === "edit" ? data.find((d) => d.id === modal.id) : null;

  const flagsCount = data.filter(flagged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
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

            <h1 className="mt-4 text-2xl font-bold text-slate-900">Participants</h1>
            <p className="mt-1 text-sm text-slate-600">
              Season-scoped register — players, volunteers, coaches, safeguarding & vetting.
            </p>

            {flagsCount > 0 ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
                <AlertTriangle size={16} className="text-amber-700" />
                {flagsCount} flagged records need attention
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-700" />
                No outstanding issues
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Season */}
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

            {/* Admin toggle */}
            <button
              onClick={() => setAdminMode((v) => !v)}
              className={classNames(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                adminMode
                  ? "border-[#D81E27]/20 bg-[#D81E27]/5 text-[#D81E27] hover:bg-[#D81E27]/10"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              title="Mock: toggle admin mode"
            >
              {adminMode ? "Admin mode: ON" : "Read-only: ON"}
            </button>

            {adminMode ? (
              <button
                onClick={() => setModal({ type: "add" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                <Plus size={16} />
                Add participant
              </button>
            ) : null}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
              <Search size={18} className="text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search name, team…"
              />
            </div>
          </div>

          <div className="lg:col-span-7 grid gap-3 sm:grid-cols-4">
            <div className="relative">
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as any)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <option value="All">All Age Groups</option>
                <option value="U11">U11</option>
                <option value="U13">U13</option>
                <option value="U15">U15</option>
                <option value="U17">U17</option>
                <option value="Senior">Senior</option>
                <option value="Women">Women</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <option value="All">All Roles</option>
                <option value="Player">Player</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Coach">Coach</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>

            <button
              onClick={() => setOnlyFlags((v) => !v)}
              className={classNames(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold",
                onlyFlags
                  ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              title="Show only flagged"
            >
              <Filter size={16} />
              Flags
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            Showing <span className="font-bold">{rows.length}</span> of{" "}
            <span className="font-bold">{data.length}</span> records (Season:{" "}
            <span className="font-bold">{season}</span>)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="text-left">
                <th className="px-6 py-3 font-bold">Name</th>
                <th className="px-6 py-3 font-bold">Age Group</th>
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold">Team</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold">Safeguarding</th>
                <th className="px-6 py-3 font-bold">Vetting</th>
                <th className="px-6 py-3 font-bold">Flags</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const isFlagged = flagged(p);
                return (
                  <tr
                    key={p.id}
                    className={classNames(
                      "border-t border-slate-200",
                      isFlagged ? "bg-amber-50/40" : "bg-white"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">DOB: {p.dob}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{p.ageGroup}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                        {p.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{p.team ?? "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          p.status === "Active" && "border-emerald-200 bg-emerald-50 text-emerald-900",
                          p.status === "Pending" && "border-amber-200 bg-amber-50 text-amber-900",
                          p.status === "Inactive" && "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          p.safeguarding === "Complete" &&
                            "border-emerald-200 bg-emerald-50 text-emerald-900",
                          p.safeguarding !== "Complete" &&
                            "border-amber-200 bg-amber-50 text-amber-900"
                        )}
                      >
                        {p.safeguarding}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          p.vetting === "Complete" &&
                            "border-emerald-200 bg-emerald-50 text-emerald-900",
                          p.vetting === "Pending" &&
                            "border-amber-200 bg-amber-50 text-amber-900",
                          p.vetting === "N/A" && "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                      >
                        {p.vetting}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isFlagged ? (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                          <ShieldAlert size={14} className="text-amber-700" />
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
                          onClick={() => setModal({ type: "edit", id: p.id })}
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-slate-600">
                    No results. Try clearing filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Add Participant" : "Edit Participant"}
        description="Mock modal — typical GSLA participant fields."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Full name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.name ?? ""}
                placeholder="e.g. Jane Smith"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Date of birth</label>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.dob ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-900">Age group</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.ageGroup ?? ""}
                placeholder="U13"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Role</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.role ?? ""}
                placeholder="Player / Coach / Volunteer"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Status</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.status ?? ""}
                placeholder="Active / Pending / Inactive"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Team</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.team ?? ""}
                placeholder="e.g. U15 County"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Guardian contact (youth)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="Name + phone/email"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Safeguarding</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.safeguarding ?? ""}
                placeholder="Complete / Pending / Required"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Vetting (adult roles)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={modalParticipant?.vetting ?? ""}
                placeholder="Complete / Pending / N/A"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
