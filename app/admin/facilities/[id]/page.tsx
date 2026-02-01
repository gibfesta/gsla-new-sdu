"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

type FacilityStatus = "Operational" | "Limited" | "Closed";
type FacilityType =
  | "Park"
  | "Sports Centre"
  | "Grounds"
  | "Multi Sports Center"
  | "Multi-Sports Complex"
  | "Courts";

type DbFacilityRow = {
  id: string;
  name: string | null;
  type: string | null;
  status: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created__at: string;
  updated_at: string;
};

const FACILITY_TYPES: FacilityType[] = [
  "Park",
  "Sports Centre",
  "Grounds",
  "Multi Sports Center",
  "Multi-Sports Complex",
  "Courts",
];

const FACILITY_STATUSES: FacilityStatus[] = ["Operational", "Limited", "Closed"];

function asFacilityType(v: string): FacilityType {
  return (FACILITY_TYPES as string[]).includes(v) ? (v as FacilityType) : "Grounds";
}

function asFacilityStatus(v: string): FacilityStatus {
  return (FACILITY_STATUSES as string[]).includes(v) ? (v as FacilityStatus) : "Operational";
}

export default function AdminFacilityEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (full page)
  const [name, setName] = useState("");
  const [type, setType] = useState<FacilityType>("Grounds");
  const [status, setStatus] = useState<FacilityStatus>("Operational");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  // For dirty check (optional nice UX)
  const initialSnapshot = useMemo(
    () => ({ name, type, status, address, contactEmail, contactPhone, notes }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/facilities/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());

        const row = (await res.json()) as DbFacilityRow;

        if (cancelled) return;

        setName(row.name ?? "");
        setType(asFacilityType(row.type ?? ""));
        setStatus(asFacilityStatus(row.status ?? ""));
        setAddress(row.address ?? "");
        setContactEmail(row.contact_email ?? "");
        setContactPhone(row.contact_phone ?? "");
        setNotes(row.notes ?? "");
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setError(e?.message || "Failed to load facility");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSave() {
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/facilities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          status,
          address,
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null,
          notes: notes || null,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Option: return to list page after save
      router.push("/admin/facilities");
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to save facility");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id) return;
    const ok = confirm("Delete this facility? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/facilities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/facilities");
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to delete facility");
    } finally {
      setDeleting(false);
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
          <h1 className="mt-4 text-3xl font-extrabold text-[#0C2F57]">Edit Facility</h1>
          <p className="mt-1 text-sm text-slate-600">Edit all fields and save.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDelete}
            disabled={loading || deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={onSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Name</label>
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
                <label className="text-xs font-semibold text-slate-600">Address</label>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
