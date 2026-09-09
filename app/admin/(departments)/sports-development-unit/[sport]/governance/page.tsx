// app/admin/sports/[sport]/governance/page.tsx
"use client";

// ------------------------------------------------------------
// PAGE PURPOSE
// ------------------------------------------------------------
// This page is the “Governance” view for a specific sport (route param: [sport]).
// It shows a simple committee/roles table and provides mock “Add/Edit” flows via a modal.
// NOTE: This file is intentionally UI-only (mock data + mock modal). No API wiring yet.

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Shield, Pencil, Plus, X } from "lucide-react";

// ------------------------------------------------------------
// SMALL UTILS
// ------------------------------------------------------------
// Tailwind class concatenation helper.
// Edit here if you want a different convention for conditional class joining.
function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

// ------------------------------------------------------------
// MODAL COMPONENT (REUSABLE)
// ------------------------------------------------------------
// Generic modal shell used for both "Add role" and "Edit roles" actions.
// This is a “mock” modal: it does not submit anything, it just closes on Save/Cancel.
// Where to extend later:
// - add form state + validation
// - add real submit handler
// - optionally add focus trap / ESC to close / scroll lock
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
  // When closed, render nothing (keeps DOM clean + avoids hidden overlays).
  if (!open) return null;

  return (
    // Fixed overlay wrapper (high z-index so it sits above tables/cards).
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop: clicking outside closes the modal (simple UX for mock). */}
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      {/* Modal panel centered on screen. Edit sizing here if you want wider/narrower. */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header: title + optional description + close icon. */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>

          {/* Top-right close button (purely closes modal). */}
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body: injected content from the page (form fields / info blocks). */}
        <div className="p-5">{children}</div>

        {/* Footer actions: Cancel + Save (both close in this mock). */}
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

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
// Represents one governance committee entry (role + contact details).
// If you later add document uploads, status, or verification, extend this type here.
type Member = {
  id: string; // Stable key for rendering + future DB id
  role: string; // e.g. Chairperson, Secretary
  name: string;
  email: string;
  phone: string;
  term: string; // Human-friendly term label (e.g. "2025–2026")
};

export default function GovernancePage() {
  // ------------------------------------------------------------
  // ROUTING CONTEXT
  // ------------------------------------------------------------
  // Reads the dynamic route param: /admin/sports/[sport]/governance
  // Used for the “Back to Sport” link and for displaying sport-specific governance.
  const { sport } = useParams<{ sport: string }>();

  // ------------------------------------------------------------
  // UI STATE
  // ------------------------------------------------------------
  // adminMode: toggles whether the UI shows edit/add actions.
  // NOTE: This is mock; in the real app this should come from auth/roles/permissions.
  const [adminMode, setAdminMode] = useState(true);

  // modal: controls which modal is open (add vs edit).
  // null = closed.
  const [modal, setModal] = useState<null | { type: "edit" | "add" }>(null);

  // ------------------------------------------------------------
  // MOCK DATA (COMMITTEE LIST)
  // ------------------------------------------------------------
  // useMemo: keeps the mock array stable across renders.
  // Where to replace later:
  // - fetch from API by sport id/slug
  // - store in state and update after form submit
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
    // Page layout: vertical spacing between the header card, table card, and modal.
    <div className="space-y-6">
      {/* ------------------------------------------------------------
          HEADER / PAGE INTRO CARD
          ------------------------------------------------------------
          Contains:
          - back navigation to sport overview
          - page title + icon
          - short description
          - admin mode toggle + action buttons
      */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {/* Back link: uses [sport] param to return to sport home page. */}
            <Link
              href={`/admin/sports/${sport}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Sport
            </Link>

            {/* Page title row: governance icon + heading. */}
            <div className="mt-4 flex items-center gap-2">
              <Shield className="text-[#D81E27]" />
              <h1 className="text-2xl font-bold text-slate-900">Governance</h1>
            </div>

            {/* Subtitle: clarifies what this governance page captures. */}
            <p className="mt-1 text-sm text-slate-600">
              Committee roles, contacts and terms (typical GSLA governance capture).
            </p>
          </div>

          {/* Right-side controls: admin toggle + add/edit actions (admin only). */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Admin-mode toggle: purely affects UI. Replace later with real permissions. */}
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

            {/* Admin actions: only visible when adminMode is true. */}
            {adminMode ? (
              <div className="flex items-center gap-2">
                {/* Add role: opens modal in "add" mode (mock). */}
                <button
                  onClick={() => setModal({ type: "add" })}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus size={16} />
                  Add role
                </button>

                {/* Edit roles: opens modal in "edit" mode (mock). */}
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

      {/* ------------------------------------------------------------
          COMMITTEE TABLE CARD
          ------------------------------------------------------------
          Displays the committee list in a simple table layout.
          Where to edit:
          - columns: table header + each row cell
          - styling: wrapper card / table classes
      */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {/* Table header band showing count. */}
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {committee.length} committee roles
          </p>
        </div>

        {/* Horizontal scroll container for smaller screens. */}
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            {/* Column headers: update labels/order here if governance fields change. */}
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

            {/* Rows: currently rendered from mock committee array. */}
            <tbody>
              {committee.map((m) => (
                <tr key={m.id} className="border-t border-slate-200">
                  {/* Role: treated as the primary label (bold). */}
                  <td className="px-6 py-4 font-semibold text-slate-900">{m.role}</td>

                  {/* Contact details: plain text right now (no mailto/tel links). */}
                  <td className="px-6 py-4 text-slate-700">{m.name}</td>
                  <td className="px-6 py-4 text-slate-700">{m.email}</td>
                  <td className="px-6 py-4 text-slate-700">{m.phone}</td>

                  {/* Term: rendered as a small pill/badge. */}
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                      {m.term}
                    </span>
                  </td>

                  {/* Actions: edit button in admin mode, otherwise "Read-only" label. */}
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

      {/* ------------------------------------------------------------
          MODAL CONTENT (MOCK FORM)
          ------------------------------------------------------------
          A single form layout reused for both Add and Edit modes.
          Where to extend later:
          - wire inputs to state
          - prefill fields when editing a specific member
          - add file uploads (policies, AGM minutes, confirmations)
      */}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Add Governance Role" : "Edit Governance Roles"}
        description="Mock modal — later: validations, term dates, and document uploads."
        onClose={() => setModal(null)}
      >
        <div className="grid gap-3">
          {/* Helper/instruction block: reminds this is a placeholder flow. */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            This is a mock modal. In the real version, you’ll edit roles + attach policies, AGM minutes,
            and committee confirmations.
          </div>

          {/* Role + Name (two-column on larger screens). */}
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

          {/* Email + Phone (two-column on larger screens). */}
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

          {/* Term (single column). */}
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
