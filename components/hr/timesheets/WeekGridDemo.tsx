"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ClipboardList } from "lucide-react";

type DayKey = "SAT" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI";

type Slot =
  | "AM"
  | "PM"
  // Monday-only
  | "ONE_TO_NINE";

type ShiftCode =
  | "M"
  | "N"
  | "CRD"
  | "A/L"
  | "SICK"
  | "SP/L"
  | "B/HOL"
  | "ACTG"
  | "USL"
  | "CSL"
  | "ABS"
  | "";

type EmployeeRow = {
  kind: "employee";
  id: string;
  name: string;
  role?: string;
  team?: string;
  cells: Record<DayKey, Partial<Record<Slot, ShiftCode>>>;
};

type GroupRow = {
  kind: "group";
  id: string;
  label: string;
};

type Row = EmployeeRow | GroupRow;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

const DAYS: Array<{ key: DayKey; label: string }> = [
  { key: "SAT", label: "Sat" },
  { key: "SUN", label: "Sun" },
  { key: "MON", label: "Mon" },
  { key: "TUE", label: "Tue" },
  { key: "WED", label: "Wed" },
  { key: "THU", label: "Thu" },
  { key: "FRI", label: "Fri" },
];

// - Mon: AM / 1–9 / PM
// - Others: AM / PM
const DAY_SLOTS: Record<DayKey, Slot[]> = {
  SAT: ["AM", "PM"],
  SUN: ["AM", "PM"],
  MON: ["AM", "ONE_TO_NINE", "PM"],
  TUE: ["AM", "PM"],
  WED: ["AM", "PM"],
  THU: ["AM", "PM"],
  FRI: ["AM", "PM"],
};

const SLOT_LABEL: Record<Slot, string> = {
  AM: "AM",
  PM: "PM",
  ONE_TO_NINE: "1–9",
};

const CODES: Array<{ code: ShiftCode; label: string }> = [
  { code: "", label: "—" },
  { code: "M", label: "M" },
  { code: "N", label: "N" },
  { code: "CRD", label: "CRD" },
  { code: "A/L", label: "A/L" },
  { code: "SICK", label: "SICK" },
  { code: "SP/L", label: "SP/L" },
  { code: "B/HOL", label: "B/HOL" },
  { code: "ACTG", label: "ACTG" },
  { code: "USL", label: "USL" },
  { code: "CSL", label: "CSL" },
  { code: "ABS", label: "ABS" },
];

function emptyCells(): EmployeeRow["cells"] {
  return {
    SAT: { AM: "", PM: "" },
    SUN: { AM: "", PM: "" },
    MON: { AM: "", ONE_TO_NINE: "", PM: "" },
    TUE: { AM: "", PM: "" },
    WED: { AM: "", PM: "" },
    THU: { AM: "", PM: "" },
    FRI: { AM: "", PM: "" },
  };
}

function mkEmp(
  name: string,
  id: string,
  role?: string,
  team?: string,
  preset?: Partial<Record<DayKey, Partial<Record<Slot, ShiftCode>>>>
): EmployeeRow {
  const cells = emptyCells();

  // Default pattern:
  // - Weekdays: AM=M, PM="" (Mon has 1–9 empty by default)
  // - Weekend: AM/PM = CRD
  cells.SAT = { AM: "CRD", PM: "CRD" };
  cells.SUN = { AM: "CRD", PM: "CRD" };
  cells.MON = { AM: "M", ONE_TO_NINE: "", PM: "" };
  cells.TUE = { AM: "M", PM: "" };
  cells.WED = { AM: "M", PM: "" };
  cells.THU = { AM: "M", PM: "" };
  cells.FRI = { AM: "M", PM: "" };

  if (preset) {
    for (const d of Object.keys(preset) as DayKey[]) {
      cells[d] = { ...cells[d], ...(preset[d] as any) };
    }
  }

  return { kind: "employee", id, name, role, team, cells };
}

function mkGroup(label: string, id: string): GroupRow {
  return { kind: "group", id, label };
}

function seedRows(): Row[] {
  return [
    mkGroup("Centre Managers", "g-cm"),

    mkEmp("J. Torres", "cm1", "Centre Manager", "Centre Managers", {
      SAT: { AM: "M", PM: "N" },
      SUN: { AM: "M", PM: "N" },
    }),
    mkEmp("D. Lopez", "cm2", "Centre Manager", "Centre Managers", {
      MON: { AM: "A/L" },
    }),
    mkEmp("JC Segui", "cm3", "Centre Manager", "Centre Managers", {
      TUE: { AM: "SICK" },
    }),

    mkGroup("ESOs — Team 1 (M. Bacarese + L. Moreno)", "g-eso-t1"),
    mkEmp("M. Bacarese", "eso1", "ESO", "Team 1"),
    mkEmp("L. Moreno", "eso2", "ESO", "Team 1", { FRI: { AM: "M", PM: "M" } }),

    mkGroup("ESOs — Team 2 (K. Robba + S. Tellez)", "g-eso-t2"),
    mkEmp("K. Robba", "eso3", "ESO", "Team 2", { WED: { AM: "CRD", PM: "CRD" } }),
    mkEmp("S. Tellez", "eso4", "ESO", "Team 2", { SUN: { AM: "M" } }),

    mkGroup("ESOs — Team 3 (P. Galdez + P. Millan)", "g-eso-t3"),
    mkEmp("P. Galdez", "eso5", "ESO", "Team 3"),
    mkEmp("P. Millan", "eso6", "ESO", "Team 3", { MON: { ONE_TO_NINE: "M" } }),
  ];
}

export default function WeekGridDemo() {
  const [rows, setRows] = useState<Row[]>(() => seedRows());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    // Keep a group header only if at least one matching employee exists under it
    const out: Row[] = [];
    let pendingGroup: GroupRow | null = null;
    let groupHasMatch = false;

    for (const r of rows) {
      if (r.kind === "group") {
        if (pendingGroup && groupHasMatch) out.push(pendingGroup);
        pendingGroup = r;
        groupHasMatch = false;
        continue;
      }

      const hay = `${r.name} ${r.role ?? ""} ${r.team ?? ""}`.toLowerCase();
      const isMatch = hay.includes(q);

      if (isMatch) {
        if (pendingGroup && !groupHasMatch) out.push(pendingGroup);
        groupHasMatch = true;
        out.push(r);
      }
    }

    return out;
  }, [rows, search]);

  function setCell(empId: string, day: DayKey, slot: Slot, value: ShiftCode) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.kind !== "employee") return r;
        if (r.id !== empId) return r;

        return {
          ...r,
          cells: {
            ...r.cells,
            [day]: {
              ...r.cells[day],
              [slot]: value,
            },
          },
        };
      })
    );
  }

  const employeeCount = filtered.filter((r) => r.kind === "employee").length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6">
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Weekly grid (demo)</div>
              <div className="mt-1 text-xs text-slate-600">
                Sat/Sun/Tue–Fri: AM/PM • Monday: AM / 1–9 / PM • grouped by teams
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 lg:max-w-[420px]">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search staff..."
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <Pill>
              <ClipboardList size={14} />
              Demo
            </Pill>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-600">
                  <th className="sticky left-0 z-20 bg-white px-6 py-3">
                    <div className="text-slate-900">Staff</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-500">Role</div>
                  </th>

                  {DAYS.map((d) => {
                    const slots = DAY_SLOTS[d.key];
                    return (
                      <th key={d.key} className="px-4 py-3">
                        <div className="text-slate-900">{d.label}</div>
                        <div
                          className="mt-1 grid gap-2 text-[11px] font-semibold text-slate-500"
                          style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
                        >
                          {slots.map((s) => (
                            <div key={s} className="text-center">
                              {SLOT_LABEL[s]}
                            </div>
                          ))}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => {
                  // FULL-WIDTH band row (spans all columns)
                  if (r.kind === "group") {
                    return (
                      <tr key={r.id} className="border-t border-slate-100">
                        <td colSpan={8} className="px-6 py-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-xs font-semibold text-slate-900">{r.label}</div>
                            <div className="mt-1 text-[11px] font-semibold text-slate-600">
                              AM/PM (Mon includes 1–9)
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="sticky left-0 z-10 bg-white px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                        <div className="mt-1 text-xs text-slate-600">{r.role ?? "—"}</div>
                      </td>

                      {DAYS.map((d) => {
                        const slots = DAY_SLOTS[d.key];

                        return (
                          <td key={d.key} className="px-4 py-3 align-top">
                            <div
                              className="grid gap-2"
                              style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
                            >
                              {slots.map((slot) => (
                                <select
                                  key={slot}
                                  value={(r.cells[d.key][slot] ?? "") as ShiftCode}
                                  onChange={(e) => setCell(r.id, d.key, slot, e.target.value as ShiftCode)}
                                  className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none hover:bg-slate-50"
                                >
                                  {CODES.map((c) => (
                                    <option key={`${slot}-${c.label}`} value={c.code}>
                                      {c.label}
                                    </option>
                                  ))}
                                </select>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {employeeCount === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-600">
                      No staff match your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="text-sm font-semibold text-slate-900">Legend</div>
          <div className="mt-1 text-xs text-slate-600">Codes used in the dropdowns</div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CODES.filter((c) => c.code !== "").map((c) => (
              <span
                key={c.code}
                className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {c.code}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Next</div>
            <div className="mt-1">
              Next we’ll load staff from DB by facility, then auto-fill cells from rota templates so managers only edit
              changes.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
