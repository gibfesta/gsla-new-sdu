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
const ACTIVITIES = [
  "Football", "Athletics", "Swimming", "Basketball", "Volleyball", "Futsal",
  "Training", "Training Sessions", "Community Use", "Outdoor Recreation",
];

export default function AdminFacilityNewPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields (full page)
  const [name, setName] = useState("");
  const [type, setType] = useState<FacilityType>("Grounds");
  const [status, setStatus] = useState<FacilityStatus>("Operational");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [centreManagerName, setCentreManagerName] = useState("");
  const [centreManagerTitle, setCentreManagerTitle] = useState("Centre Manager");
  const [centreManagerEmail, setCentreManagerEmail] = useState("");
  const [centreManagerPhone, setCentreManagerPhone] = useState("");
  const [facilitiesManagerName, setFacilitiesManagerName] = useState("");
  const [facilitiesManagerEmail, setFacilitiesManagerEmail] = useState("");
  const [supportedActivities, setSupportedActivities] = useState<string[]>([]);
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
    if (!area.trim()) {
      setError("Area is required.");
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
          area: area.trim(),
          description: description.trim(),
          contact_email: contactEmail.trim() || null,
          contact_phone: contactPhone.trim() || null,
          centre_manager_name: centreManagerName.trim(),
          centre_manager_title: centreManagerTitle.trim(),
          centre_manager_email: centreManagerEmail.trim(),
          centre_manager_phone: centreManagerPhone.trim(),
          facilities_manager_name: facilitiesManagerName.trim(),
          facilities_manager_email: facilitiesManagerEmail.trim(),
          supported_activities: supportedActivities,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Back to list after create
      router.push("/facilities/facilities-directory");
      router.refresh();
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to create facility");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/facilities/facilities-directory")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Facilities
          </button>
          <h1 className="mt-4 text-3xl font-extrabold text-[#0C2F57]">
            Create Facility
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Add the facility information shown in its venue workspace. Only fields marked * are required.
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
            <h2 className="lg:col-span-2 text-lg font-bold text-[#0C2F57]">Facility information</h2>
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
              <label htmlFor="facility-area" className="text-xs font-semibold text-slate-600">Area / suburb *</label>
              <input id="facility-area" value={area} onChange={(e) => setArea(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. Europa Point" />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="facility-description" className="text-xs font-semibold text-slate-600">Facility description</label>
              <textarea id="facility-description" value={description} onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none"
                rows={3} placeholder="Short introduction shown in the venue banner" />
            </div>

            <h2 className="lg:col-span-2 border-t border-slate-200 pt-5 text-lg font-bold text-[#0C2F57]">Facility contact</h2>

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

            <h2 className="lg:col-span-2 border-t border-slate-200 pt-5 text-lg font-bold text-[#0C2F57]">Management contacts</h2>
            <p className="lg:col-span-2 text-sm text-slate-500">These are the contacts displayed in the current venue example. Staff assignments and access permissions will be managed separately.</p>
            {([
              ["Centre manager name", centreManagerName, setCentreManagerName],
              ["Centre manager job title", centreManagerTitle, setCentreManagerTitle],
              ["Centre manager email", centreManagerEmail, setCentreManagerEmail],
              ["Centre manager phone", centreManagerPhone, setCentreManagerPhone],
              ["Facilities manager name", facilitiesManagerName, setFacilitiesManagerName],
              ["Facilities manager email", facilitiesManagerEmail, setFacilitiesManagerEmail],
            ] as const).map(([label, value, update]) => (
              <div key={label}>
                <label className="text-xs font-semibold text-slate-600">{label}</label>
                <input type={label.includes("email") ? "email" : "text"} value={value}
                  onChange={(e) => update(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
              </div>
            ))}

            <div className="lg:col-span-2 border-t border-slate-200 pt-5">
              <h2 className="text-lg font-bold text-[#0C2F57]">Supported activities</h2>
              <p className="mt-1 text-sm text-slate-500">Select all sports and activities associated with this venue.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => {
                  const selected = supportedActivities.includes(activity);
                  return <button key={activity} type="button" aria-pressed={selected}
                    onClick={() => setSupportedActivities((current) => selected
                      ? current.filter((item) => item !== activity) : [...current, activity])}
                    className={`rounded-full border px-3 py-2 text-sm ${selected ? "border-[#0C2F57] bg-[#0C2F57] text-white" : "border-slate-200 bg-white text-slate-700"}`}>
                    {activity}
                  </button>;
                })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Operational notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none"
                rows={6}
                placeholder="One note per line. Visible to centre and facilities managers."
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
