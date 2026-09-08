"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Plus,
  X,
} from "lucide-react";

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type FacilityStatus = "Operational" | "Limited" | "Closed";
type FacilityType =
  | "Park"
  | "Sports Centre"
  | "Grounds"
  | "Multi Sports Center"
  | "Courts";

const allSports = [
  "Football",
  "Athletics",
  "Swimming",
  "Basketball",
  "Volleyball",
  "Futsal",
  "Training Sessions",
  "Community Use",
  "Outdoor Recreation",
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

export default function EditFacilityPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: "fac-001",
    name: "Europa Sports Complex",
    type: "Sports Centre" as FacilityType,
    status: "Operational" as FacilityStatus,
    suburb: "Europa Point",
    address: "Europa Point, Gibraltar",
    description:
      "Europa Sports Complex is one of GSLA’s key sporting venues, supporting football, athletics, training sessions, and community sporting activity.",
    managerName: "Europa Facility Manager",
    managerTitle: "Facility Manager",
    managerEmail: "europa@gov.gi",
    managerPhone: "+350 200 10001",
    sportsSupported: [
      "Football",
      "Athletics",
      "Training Sessions",
      "Community Use",
    ] as string[],
    notes: [
      "Main outdoor sports complex for football and athletics activity.",
      "Suitable for larger events and scheduled sports development programmes.",
      "Last maintenance review completed successfully.",
    ] as string[],
  });

  const [newNote, setNewNote] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const status = statusStyles(form.status);
  const StatusIcon = status.icon;

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function toggleSport(sport: string) {
    setForm((prev) => {
      const exists = prev.sportsSupported.includes(sport);

      return {
        ...prev,
        sportsSupported: exists
          ? prev.sportsSupported.filter((s) => s !== sport)
          : [...prev.sportsSupported, sport],
      };
    });
  }

  function addNote() {
    const note = newNote.trim();
    if (!note) return;

    setForm((prev) => ({
      ...prev,
      notes: [...prev.notes, note],
    }));
    setNewNote("");
  }

  function removeNote(index: number) {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  }

  function saveFacility() {
    setSaveMessage("Facility details saved locally.");
    setTimeout(() => setSaveMessage(""), 2500);
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0C2F57] to-[#174A84] text-white shadow-sm">
        <div className="px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <button
                onClick={() => router.push(`/admin/facilities/${form.id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to Facility
              </button>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                  <Building2 size={14} />
                  Edit Facility
                </span>

                <span
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1",
                    status.className
                  )}
                >
                  <StatusIcon size={14} />
                  {form.status}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
                {form.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                Update facility details, contact information, supported sports,
                and notes for this location.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push(`/admin/facilities/${form.id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                Cancel
              </button>

              <button
                onClick={saveFacility}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2F57] transition hover:brightness-95"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </section>

      {saveMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {saveMessage}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Basic Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Main facility identity and location details.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Facility Name
                  </label>
                  <div className="mt-2 relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#0C2F57]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Facility Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      updateField("type", e.target.value as FacilityType)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                  >
                    <option value="Park">Park</option>
                    <option value="Sports Centre">Sports Centre</option>
                    <option value="Grounds">Grounds</option>
                    <option value="Multi Sports Center">Multi Sports Center</option>
                    <option value="Courts">Courts</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateField("status", e.target.value as FacilityStatus)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Limited">Limited</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Area / Suburb
                  </label>
                  <input
                    value={form.suburb}
                    onChange={(e) => updateField("suburb", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Address
                  </label>
                  <div className="mt-2 relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <div className="mt-2 relative">
                    <FileText
                      size={16}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Contact Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Main contact details for this facility.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Manager Name
                  </label>
                  <input
                    value={form.managerName}
                    onChange={(e) => updateField("managerName", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Job Title
                  </label>
                  <input
                    value={form.managerTitle}
                    onChange={(e) =>
                      updateField("managerTitle", e.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <div className="mt-2 relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="email"
                      value={form.managerEmail}
                      onChange={(e) =>
                        updateField("managerEmail", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <div className="mt-2 relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      value={form.managerPhone}
                      onChange={(e) =>
                        updateField("managerPhone", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Supported Sports
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the sports and activities linked to this facility.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {allSports.map((sport) => {
                  const active = form.sportsSupported.includes(sport);

                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={classNames(
                        "rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
                        active
                          ? "bg-[#0C2F57] text-white ring-[#0C2F57]"
                          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {sport}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Facility Notes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add or remove internal notes for this facility.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0C2F57]"
                />
                <button
                  type="button"
                  onClick={addNote}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0C2F57] px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
                >
                  <Plus size={16} />
                  Add Note
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {form.notes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200"
                  >
                    <span className="text-sm text-slate-700">{note}</span>
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-slate-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {!form.notes.length ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                    No notes added yet.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-900">Preview</h2>
              <p className="mt-1 text-sm text-slate-500">
                How this facility currently appears at a glance.
              </p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-lg font-bold text-slate-900">
                      {form.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{form.type}</span>
                      <span>•</span>
                      <span>{form.suburb}</span>
                    </div>
                  </div>

                  <span
                    className={classNames(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      status.className
                    )}
                  >
                    <StatusIcon size={14} />
                    {form.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-slate-600">{form.address}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {form.sportsSupported.length ? (
                    form.sportsSupported.map((sport) => (
                      <span
                        key={sport}
                        className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        {sport}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No sports selected
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-900">Tips</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  Keep facility names consistent with the main directory.
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  Use the status field for quick visibility on operational issues.
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  Notes can later be replaced with database-backed updates or logs.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-900">Actions</h2>
              <div className="mt-4 space-y-3">
                <button
                  onClick={saveFacility}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#0C2F57] px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
                >
                  <span>Save facility</span>
                  <Save size={16} />
                </button>

                <button
                  onClick={() => router.push(`/admin/facilities/${form.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <span>Return to facility page</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}