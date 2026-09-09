// app/admin/sports/[sport]/teams/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, Plus, Pencil, X, ChevronDown } from "lucide-react";

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

type Team = {
  id: string;
  name: string;
  ageGroup: string;
  league: string;
  coach: string;
  venue: string;
  squadSize: number;
  status: "Active" | "Seasonal" | "Inactive";
};

export default function TeamsPage() {
  const { sport } = useParams<{ sport: string }>();

  const seasons = ["2025/26 (Current)", "2024/25", "2023/24"];
  const [season, setSeason] = useState(seasons[0]);

  const [adminMode, setAdminMode] = useState(true);
  const [modal, setModal] = useState<null | { type: "add" | "edit"; id?: string }>(null);

  const teams: Team[] = useMemo(
    () => [
      {
        id: "t1",
        name: "U11 Falcons",
        ageGroup: "U11",
        league: "Junior Development League",
        coach: "Sarah Nolan",
        venue: "Main Ground A",
        squadSize: 18,
        status: "Active",
      },
      {
        id: "t2",
        name: "U13 Tigers",
        ageGroup: "U13",
        league: "Junior Development League",
        coach: "Patrick Ryan",
        venue: "Main Ground B",
        squadSize: 17,
        status: "Active",
      },
      {
        id: "t3",
        name: "U17 County",
        ageGroup: "U17",
        league: "Schools Inter-County Cup",
        coach: "Aoife O’Connell",
        venue: "County Pitch",
        squadSize: 20,
        status: "Seasonal",
      },
      {
        id: "t4",
        name: "Senior A",
        ageGroup: "Senior",
        league: "Senior County League",
        coach: "John Murphy",
        venue: "Stadium",
        squadSize: 22,
        status: "Active",
      },
    ],
    []
  );

  const editing = modal?.type === "edit" ? teams.find((t) => t.id === modal.id) : null;

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
              <Users className="text-[#D81E27]" />
              <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Team register for the selected season — squads, coaches, venues and league membership.
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
                Add team
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {teams.length} teams (Season: <span className="font-bold">{season}</span>)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="text-left">
                <th className="px-6 py-3 font-bold">Team</th>
                <th className="px-6 py-3 font-bold">Age</th>
                <th className="px-6 py-3 font-bold">League</th>
                <th className="px-6 py-3 font-bold">Coach</th>
                <th className="px-6 py-3 font-bold">Venue</th>
                <th className="px-6 py-3 font-bold">Squad</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-semibold text-slate-900">{t.name}</td>
                  <td className="px-6 py-4 text-slate-700">{t.ageGroup}</td>
                  <td className="px-6 py-4 text-slate-700">{t.league}</td>
                  <td className="px-6 py-4 text-slate-700">{t.coach}</td>
                  <td className="px-6 py-4 text-slate-700">{t.venue}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{t.squadSize}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {adminMode ? (
                      <button
                        onClick={() => setModal({ type: "edit", id: t.id })}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Add Team" : "Edit Team"}
        description="Mock modal — typical team metadata GSLA would capture."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900">Team name</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              defaultValue={editing?.name ?? ""}
              placeholder="e.g. U13 Falcons"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Age group</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.ageGroup ?? ""}
                placeholder="U13"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">League</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.league ?? ""}
                placeholder="Senior County League"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Coach</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.coach ?? ""}
                placeholder="Coach name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Home venue</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.venue ?? ""}
                placeholder="Venue"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Squad size</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.squadSize ?? 0}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Status</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue={editing?.status ?? ""}
                placeholder="Active / Seasonal / Inactive"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
