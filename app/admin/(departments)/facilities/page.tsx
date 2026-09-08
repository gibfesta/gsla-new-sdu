"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  MapPin,
  Building2,
  Pencil,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Waves,
  Trees,
  Dumbbell,
  Filter,
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

const MOCK_FACILITIES: Facility[] = [
  {
    id: "fac-001",
    name: "Europa Sports Complex",
    type: "Sports Centre",
    status: "Operational",
    suburb: "Europa Point",
    address: "Europa Point, Gibraltar",
    sportsSupported: ["Football", "Athletics"],
    managerEmail: "europa@gov.gi",
    managerPhone: "+350 200 10001",
    notes: ["Main outdoor sports complex", "Large-capacity venue"],
  },
  {
    id: "fac-002",
    name: "Bayside Sports Complex",
    type: "Sports Centre",
    status: "Operational",
    suburb: "Bayside",
    address: "Bayside Road, Gibraltar",
    sportsSupported: ["Basketball", "Futsal", "Volleyball"],
    managerEmail: "bayside@gov.gi",
    managerPhone: "+350 200 10002",
    notes: ["Indoor sports complex", "Used for multi-sport activities"],
  },
  {
    id: "fac-003",
    name: "Lathbury Sports Complex",
    type: "Sports Centre",
    status: "Operational",
    suburb: "Lathbury",
    address: "Lathbury Barracks, Gibraltar",
    sportsSupported: ["Football", "Training"],
    managerEmail: "lathbury@gov.gi",
    managerPhone: "+350 200 10003",
    notes: ["Multi-use sports venue", "Regular training sessions held here"],
  },
  {
    id: "fac-004",
    name: "Lathbury Pool",
    type: "Sports Centre",
    status: "Limited",
    suburb: "Lathbury",
    address: "Lathbury Barracks, Gibraltar",
    sportsSupported: ["Swimming"],
    managerEmail: "lathburypool@gov.gi",
    managerPhone: "+350 200 10004",
    notes: ["Swimming pool facility", "Currently operating with limited access"],
  },
  {
    id: "fac-005",
    name: "GASA Pool",
    type: "Sports Centre",
    status: "Operational",
    suburb: "Victoria Stadium",
    address: "Victoria Stadium Area, Gibraltar",
    sportsSupported: ["Swimming"],
    managerEmail: "gasa@gov.gi",
    managerPhone: "+350 200 10005",
    notes: ["Aquatic facility", "Open for training and public sessions"],
  },
  {
    id: "fac-006",
    name: "Parks",
    type: "Park",
    status: "Operational",
    suburb: "Various Locations",
    address: "Various Locations, Gibraltar",
    sportsSupported: ["Outdoor Recreation"],
    managerEmail: "parks@gov.gi",
    managerPhone: "+350 200 10006",
    notes: ["Collection of public parks", "Outdoor recreation spaces"],
  },
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

function typeIcon(type: FacilityType) {
  if (type === "Park") return Trees;
  if (type === "Sports Centre") return Dumbbell;
  return Building2;
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

export default function FacilitiesPage() {
  const router = useRouter();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FacilityType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "All">("All");

  useEffect(() => {
    setFacilities(MOCK_FACILITIES);
  }, []);

  const filteredFacilities = useMemo(() => {
    const q = search.trim().toLowerCase();

    return facilities.filter((facility) => {
      const matchesSearch =
        !q ||
        facility.name.toLowerCase().includes(q) ||
        facility.suburb.toLowerCase().includes(q) ||
        facility.address.toLowerCase().includes(q) ||
        facility.sportsSupported.some((sport) =>
          sport.toLowerCase().includes(q)
        );

      const matchesType =
        typeFilter === "All" || facility.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || facility.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [facilities, search, typeFilter, statusFilter]);

  const totalFacilities = facilities.length;
  const operationalCount = facilities.filter(
    (f) => f.status === "Operational"
  ).length;
  const limitedCount = facilities.filter((f) => f.status === "Limited").length;
  const parkCount = facilities.filter((f) => f.type === "Park").length;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0C2F57] to-[#174A84] text-white shadow-sm">
        <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15">
              <Building2 size={14} />
              Facilities Directory
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              Facilities
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/80 md:text-base">
              Browse all GSLA facilities, filter by type or status, and open a
              dedicated page for each location.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/admin/facilities/new")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2F57] transition hover:brightness-95"
            >
              <Plus size={16} />
              Add Facility
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Facilities"
          value={totalFacilities}
          subtitle="All facilities in the directory"
        />
        <StatCard
          title="Operational"
          value={operationalCount}
          subtitle="Currently fully available"
        />
        <StatCard
          title="Limited Access"
          value={limitedCount}
          subtitle="Partially available or restricted"
        />
        <StatCard
          title="Parks"
          value={parkCount}
          subtitle="Outdoor locations and recreation areas"
        />
      </section>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
                placeholder="Search by facility, area, address, or sport..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <Filter size={16} className="text-slate-500" />
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as FacilityType | "All")
                  }
                  className="bg-transparent text-sm text-slate-900 outline-none"
                >
                  <option value="All">All types</option>
                  <option value="Park">Park</option>
                  <option value="Sports Centre">Sports Centre</option>
                  <option value="Grounds">Grounds</option>
                  <option value="Multi Sports Center">Multi Sports Center</option>
                  <option value="Courts">Courts</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as FacilityStatus | "All")
                  }
                  className="bg-transparent text-sm text-slate-900 outline-none"
                >
                  <option value="All">All statuses</option>
                  <option value="Operational">Operational</option>
                  <option value="Limited">Limited</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Facility Directory
            </h2>
            <p className="text-sm text-slate-500">
              {filteredFacilities.length} facility
              {filteredFacilities.length === 1 ? "" : "ies"} shown
            </p>
          </div>
        </div>

        {!filteredFacilities.length ? (
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-10 text-center">
              <div className="text-base font-semibold text-slate-900">
                No facilities found
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredFacilities.map((facility) => {
              const status = statusStyles(facility.status);
              const StatusIcon = status.icon;
              const TypeIcon = typeIcon(facility.type);

              return (
                <Card
                  key={facility.id}
                  className="group rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
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
                        onClick={() =>
                          router.push(`/admin/facilities/${facility.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                      >
                        Open Facility
                        <ArrowRight size={16} />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/admin/facilities/${facility.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}