// app/admin/sports/[sport]/governance/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Shield, Pencil, Plus, X } from "lucide-react";

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

type Member = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  term: string;
};

export default function GovernancePage() {
  const { sport } = useParams<{ sport: string }>();

  const [adminMode, setAdminMode] = useState(true);
  const [modal, setModal] = useState<null | { type: "edit" | "add" }>(null);

  const committee: Member[] = useMemo(
    () => [
      {
        id: "m1",
        role: "Chairperson",
        name: "John Murphy",
        email: "chair@countycricket.org",
        phone: "+350 555 101",
        term: "2025–2026",
      },
      {
        id: "m2",
        role: "Secretary",
        name: "Aoife O’Connell",
        email: "secretary@countycricket.org",
        phone: "+350 555 102",
        term: "2025–2026",
      },
      {
        id: "m3",
        role: "Treasurer",
        name: "Michael Byrne",
        email: "treasurer@countycricket.org",
        phone: "+350 555 103",
        term: "2025–2026",
      },
      {
        id: "m4",
        role: "Safeguarding Officer",
        name: "Laura Walsh",
        email: "safeguarding@countycricket.org",
        phone: "+350 555 104",
        term: "2025–2026",
      },
      {
        id: "m5",
        role: "Children’s Officer",
        name: "Patrick Ryan",
        email: "children@countycricket.org",
        phone: "+350 555 105",
        term: "2025–2026",
      },
    ],
    []
  );

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
              <Shield className="text-[#D81E27]" />
              <h1 className="text-2xl font-bold text-slate-900">Governance</h1>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Committee roles, contacts and terms (typical GSLA governance capture).
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal({ type: "add" })}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus size={16} />
                  Add role
                </button>
                <button
                  onClick={() => setModal({ type: "edit" })}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <Pencil size={16} />
                  Edit roles
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">{committee.length} committee roles</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="text-left">
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold">Name</th>
                <th className="px-6 py-3 font-bold">Email</th>
                <th className="px-6 py-3 font-bold">Phone</th>
                <th className="px-6 py-3 font-bold">Term</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {committee.map((m) => (
                <tr key={m.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-semibold text-slate-900">{m.role}</td>
                  <td className="px-6 py-4 text-slate-700">{m.name}</td>
                  <td className="px-6 py-4 text-slate-700">{m.email}</td>
                  <td className="px-6 py-4 text-slate-700">{m.phone}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                      {m.term}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {adminMode ? (
                      <button
                        onClick={() => setModal({ type: "edit" })}
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
        title={modal?.type === "add" ? "Add Governance Role" : "Edit Governance Roles"}
        description="Mock modal — later: validations, term dates, and document uploads."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            This is a mock modal. In the real version, you’ll edit roles + attach policies, AGM minutes,
            and committee confirmations.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Role</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="e.g. Secretary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="e.g. Aoife O’Connell"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="name@association.org"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900">Phone</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="+350 ..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900">Term</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="2025–2026"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
