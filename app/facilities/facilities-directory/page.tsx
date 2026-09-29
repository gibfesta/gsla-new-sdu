"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";
import {
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

export default function FacilitiesPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <FacilitiesDepartmentBanner title="Facilities Directory" description="Browse GSLA facilities and open a dedicated page for each location." />

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{MOCK_FACILITIES.length} facilities</p>
          <button onClick={() => router.push("/facilities/facilities-directory/new")} className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"><Plus size={16} aria-hidden="true" />Add Facility</button>
        </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {MOCK_FACILITIES.map((facility) => {
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
                          router.push(`/facilities/facilities-directory/${facility.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C2F57] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                      >
                        Open Facility
                        <ArrowRight size={16} />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/facilities/facilities-directory/${facility.id}`)
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
      </section>
    </div>
  );
}
