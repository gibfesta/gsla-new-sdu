"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

type FacilityStatus = "Operational" | "Limited" | "Closed";
type FacilityType =
  | "Park"
  | "Sports Centre"
  | "Grounds"
  | "Multi Sports Center"
  | "Multi-Sports Complex"
  | "Courts";

const FACILITY_TYPES: FacilityType[] = [
  "Park",
  "Sports Centre",
  "Grounds",
  "Multi Sports Center",
  "Multi-Sports Complex",
  "Courts",
];

const FACILITY_STATUSES: FacilityStatus[] = ["Operational", "Limited", "Closed"];

export default function AdminFacilityNewPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields (full page)
  const [name, setName] = useState("");
  const [type, setType] = useState<FacilityType>("Grounds");
  const [status, setStatus] = useState<FacilityStatus>("Operational");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  async function onCreate() {
    // Minimal validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!address.trim()) {
      setError("Address is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          status,
          address: address.trim(),
          contact_email: contactEmail.trim() || null,
          contact_phone: contactPhone.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Back to list after create
      router.push("/admin/facilities");
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to create facility");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/facilities")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Facilities
          </button>
          <h1 className="mt-4 text-3xl font-extrabold text-[#0C2F57]">
            Add Facility
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Fill out all fields and create a new facility.
          </p>
        </div>

        <button
          onClick={onCreate}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Creating..." : "Create facility"}
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Facility name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FacilityType)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              >
                {FACILITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FacilityStatus)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              >
                {FACILITY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Address *</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Street / area"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Contact email</label>
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Contact phone</label>
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. 200-4000"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none"
                rows={6}
                placeholder="Internal notes…"
              />
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Fields marked with * are required.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
