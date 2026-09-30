"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeActivity } from "@/components/facilities/activityOptions";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";
import {
  Plus,
  MapPin,
  Building2,
  Pencil,
  Archive,
  LayoutGrid,
  List,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Waves,
  Trees,
  Dumbbell,
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

type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  suburb: string;
  address: string;
  sportsSupported: string[];
  managerEmail: string;
  managerPhone: string;
  notes: string[];
};



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

function typeIcon(type: FacilityType) {
  if (type === "Park") return Trees;
  if (type === "Sports Centre") return Dumbbell;
  return Building2;
}

export default function FacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/facilities", { cache: "no-store", signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("Unable to load facilities"); return response.json(); })
      .then((records) => setFacilities(records.map((record: { id: string; name: string; type: FacilityType; status: FacilityStatus; area: string; address: string; supported_activities: string[]; centre_manager_email: string; centre_manager_phone: string; contact_email: string; contact_phone: string; notes: string }) => ({
        id: record.id, name: record.name, type: record.type, status: record.status,
        suburb: record.area, address: record.address, sportsSupported: record.supported_activities.map(normalizeActivity),
        managerEmail: record.centre_manager_email || record.contact_email,
        managerPhone: record.centre_manager_phone || record.contact_phone,
        notes: record.notes.split("\n").filter(Boolean),
      }))))
      .catch((error: Error) => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [view, setView] = useState<"cards" | "list">("list");

  return (
    <div className="space-y-8">
      <FacilitiesDepartmentBanner title="Facilities Directory" description="Browse GSLA facilities and open a dedicated page for each location." />

      <section>
        {loading && <p role="status">Loading facilities...</p>}
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        {!loading && !error && !facilities.length && <p className="mb-4 rounded-xl bg-blue-50 p-4">No facilities have been saved yet. Choose Create Facility to add your first venue.</p>}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Directory view">
            <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={classNames("inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold", view === "cards" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}><LayoutGrid size={16} aria-hidden="true" />Card view</button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={classNames("inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold", view === "list" ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}><List size={16} aria-hidden="true" />List view</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => router.push("/facilities/facilities-directory/new")} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"><Plus size={16} aria-hidden="true" />Create Facility</button>
            <button type="button" disabled={!selectedFacilityId} onClick={() => router.push(`/facilities/facilities-directory/${selectedFacilityId}/edit`)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#b8d4f5] bg-white px-4 py-2.5 text-sm font-semibold text-[#155ca7] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"><Pencil size={16} aria-hidden="true" />Edit Facility</button>
            <button type="button" disabled={!selectedFacilityId} onClick={() => router.push(`/facilities/facilities-directory/${selectedFacilityId}/archive`)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"><Archive size={16} aria-hidden="true" />Archive Facility</button>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-500">{facilities.length} facilities · {selectedFacilityId ? `${facilities.find((facility) => facility.id === selectedFacilityId)?.name} selected` : "Select a facility below to edit or archive"}</p>

        {view === "list" ? (
          <div className="overflow-hidden rounded-2xl border border-[#d5e4f6] bg-white p-4 shadow-sm sm:p-5">
            <div className="overflow-x-auto">
              <table className="gsla-data-table w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-[#eef5fd] text-xs font-semibold text-[#35557f]"><tr>
                  <th scope="col" className="rounded-l-lg px-3 py-3">Select</th><th scope="col" className="px-3 py-3">Facility</th><th scope="col" className="px-3 py-3">Status</th><th scope="col" className="px-3 py-3">Location</th><th scope="col" className="px-3 py-3">Sports</th><th scope="col" className="rounded-r-lg px-3 py-3">Actions</th>
                </tr></thead>
                <tbody>{facilities.map((facility) => {
                  const TypeIcon = typeIcon(facility.type);
                  return <tr key={facility.id} className={selectedFacilityId === facility.id ? "bg-blue-50" : ""}>
                    <td className="border-b border-[#e5edf8] px-3 py-3"><input type="radio" name="selected-facility-list" value={facility.id} checked={selectedFacilityId === facility.id} onChange={() => setSelectedFacilityId(facility.id)} aria-label={`Select ${facility.name}`} className="h-4 w-4 accent-[#155ca7]" /></td>
                    <td className="border-b border-[#e5edf8] px-3 py-3"><div className="flex items-center gap-3"><span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e8f2fe] text-[#225e9d]"><TypeIcon size={22} aria-hidden="true" /></span><span><strong className="block text-[#153763]">{facility.name}</strong><span className="text-xs text-[#6680a5]">{facility.type}</span></span></div></td>
                    <td className="border-b border-[#e5edf8] px-3 py-3"><span className={`inline-flex whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium ${facility.status === "Operational" ? "bg-emerald-50 text-emerald-700" : facility.status === "Limited" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{facility.status}</span></td>
                    <td className="border-b border-[#e5edf8] px-3 py-3 text-[#60799f]"><span className="block">{facility.suburb}</span><span className="text-xs text-[#6680a5]">{facility.address}</span></td>
                    <td className="border-b border-[#e5edf8] px-3 py-3 text-[#60799f]">{facility.sportsSupported.join(", ")}</td>
                    <td className="border-b border-[#e5edf8] px-3 py-3"><button type="button" onClick={() => router.push(`/facilities/facilities-directory/${facility.id}`)} className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#b8d4f5] px-3 py-2 text-xs font-semibold text-[#155ca7] hover:bg-blue-50">Open Facility <ArrowRight size={15} aria-hidden="true" /></button></td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((facility) => {
              const status = statusStyles(facility.status);
              const StatusIcon = status.icon;
              const TypeIcon = typeIcon(facility.type);

              return (
                <div key={facility.id} onClick={() => setSelectedFacilityId(facility.id)}>
                <Card
                  className={classNames("group cursor-pointer rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", selectedFacilityId === facility.id && "border-[#155ca7] ring-2 ring-[#155ca7]")}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <input type="radio" name="selected-facility-card" value={facility.id} checked={selectedFacilityId === facility.id} onChange={() => setSelectedFacilityId(facility.id)} aria-label={`Select ${facility.name}`} className="mt-4 h-4 w-4 shrink-0 accent-[#155ca7]" />
                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                          <TypeIcon size={20} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900">
                            {facility.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>{facility.type}</span>
                            <span>•</span>
                            <span>{facility.suburb}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                          status.className
                        )}
                      >
                        <StatusIcon size={14} />
                        {facility.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="mt-0.5 text-slate-400" />
                      <span>{facility.address}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {facility.sportsSupported.map((sport) => (
                        <span
                          key={sport}
                          className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                        >
                          {sport === "Swimming" ? (
                            <span className="inline-flex items-center gap-1">
                              <Waves size={12} />
                              {sport}
                            </span>
                          ) : (
                            sport
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Notes
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {facility.notes.slice(0, 2).map((note, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-700"
                          >
                            • {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button
                        onClick={(event) => { event.stopPropagation(); router.push(`/facilities/facilities-directory/${facility.id}`); }}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                      >
                        Open Facility
                        <ArrowRight size={16} />
                      </button>

                    </div>
                  </CardContent>
                </Card>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
