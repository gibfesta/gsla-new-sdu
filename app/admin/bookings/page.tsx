"use client";

/**
 * PAGE: Admin — Manage Bookings (Full-width Calendar)
 * ------------------------------------------------------------
 * This version includes:
 * ✅ NO sport/kind pill on any booking cards
 * ✅ NO "lanes used" pill on Pool booking cards (availability pill stays)
 * ✅ Padel/Squash realistic density
 * ✅ Members pill compact + small Users icon
 * ✅ Micro status pill (top-right) where ONLY THE TEXT is smaller:
 *    - Pool: Confirmed
 *    - Padel/Squash: Confirmed / Pending / Expired
 *    - "Free" is for empty space (no booking card), so not rendered
 * ✅ Removed bottom expiry message entirely
 */

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
  Settings,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ---------------- types ---------------- */
type Facility = { id: string; name: string };
type ResourceKind = "Pool" | "Padel" | "Squash";
type Resource = { id: string; facilityId: string; name: string; kind: ResourceKind };

type Participant = { name: string; initial?: string; confirmed: boolean };

type Booking = {
  id: string;
  resourceId: string;
  title: string;
  bookedBy?: string;
  start: string; // "YYYY-MM-DDTHH:mm"
  end: string; // "YYYY-MM-DDTHH:mm"
  kind: ResourceKind;

  createdAt?: string; // confirm window start (padel/squash)
  participants?: Participant[]; // members list
  units?: number; // pool: lanes used
};

type Positioned = { b: Booking; lane: number; lanes: number };
type MicroStatus = "Free" | "Confirmed" | "Pending" | "Expired";

/* ---------------- utils ---------------- */
function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}
const pad2 = (n: number) => String(n).padStart(2, "0");
const toYMD = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
function parseLocal(isoLike: string) {
  const [dp, tp] = isoLike.split("T");
  const [y, m, d] = dp.split("-").map(Number);
  const [hh, mm] = tp.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}
function toIsoLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(
    d.getMinutes()
  )}`;
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function fmtTopDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const snapToIncrement = (minutes: number, inc: number) => Math.round(minutes / inc) * inc;
const minutesSinceStartOfDay = (d: Date, startHour: number) => (d.getHours() - startHour) * 60 + d.getMinutes();
function dateWithMinutes(day: Date, startHour: number, minutesFromStartHour: number) {
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, 0, 0, 0);
  d.setMinutes(d.getMinutes() + minutesFromStartHour);
  return d;
}
const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && aEnd > bStart;
const minutesDiff = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / 60000);

/* ---------------- data ---------------- */
const facilities: Facility[] = [
  { id: "fac_1", name: "Lathbury Leisure Centre" },
  { id: "fac_2", name: "GASA" },
];

const resources: Resource[] = [
  { id: "res_lp", facilityId: "fac_1", name: "Lathbury Pool", kind: "Pool" },
  { id: "res_gp", facilityId: "fac_2", name: "GASA Pool", kind: "Pool" },
  { id: "res_sq1", facilityId: "fac_1", name: "Squash Court 1", kind: "Squash" },
  { id: "res_pc1", facilityId: "fac_1", name: "Padel Court 1", kind: "Padel" },
  { id: "res_pc2", facilityId: "fac_1", name: "Padel Court 2", kind: "Padel" },
  { id: "res_pc3", facilityId: "fac_1", name: "Padel Court 3", kind: "Padel" },
];

const POOL_CAPACITY_BY_RESOURCE: Record<string, number> = {
  res_lp: 24,
  res_gp: 12,
};

/* ------------ realistic seed helpers ------------ */
const D = "2025-12-19";
const t = (hm: string) => `${D}T${hm}`;

function people4(
  a: [string, boolean],
  b: [string, boolean],
  c: [string, boolean],
  d: [string, boolean]
): Participant[] {
  const mk = (name: string, confirmed: boolean) => ({ name, initial: name.trim().slice(0, 1).toUpperCase(), confirmed });
  return [mk(a[0], a[1]), mk(b[0], b[1]), mk(c[0], c[1]), mk(d[0], d[1])];
}

function players4(
  p1: [string, boolean],
  p2: [string, boolean],
  p3: [string, boolean],
  p4: [string, boolean]
): Participant[] {
  const mk = (name: string, confirmed: boolean, fallback: string) => ({
    name,
    initial: name.includes(" ") ? name.split(" ")[0].slice(0, 1) : fallback || name.slice(0, 1),
    confirmed,
  });
  return [mk(p1[0], p1[1], "1"), mk(p2[0], p2[1], "2"), mk(p3[0], p3[1], "3"), mk(p4[0], p4[1], "4")];
}

const seedBookings: Booking[] = [
  // POOL
  { id: "lp1", resourceId: "res_lp", title: "Public Swim", bookedBy: "Leisure Ops", start: t("08:00"), end: t("10:00"), kind: "Pool", units: 6 },
  { id: "lp2", resourceId: "res_lp", title: "School Swim", bookedBy: "Education", start: t("10:15"), end: t("12:15"), kind: "Pool", units: 10 },
  { id: "lp3", resourceId: "res_lp", title: "Lane Swim", bookedBy: "Leisure Ops", start: t("12:30"), end: t("14:30"), kind: "Pool", units: 8 },
  { id: "lp4", resourceId: "res_lp", title: "Club Training", bookedBy: "Swim Club", start: t("15:00"), end: t("18:00"), kind: "Pool", units: 12 },
  { id: "gp1", resourceId: "res_gp", title: "Public Swim", bookedBy: "GASA Ops", start: t("08:00"), end: t("11:00"), kind: "Pool", units: 5 },
  { id: "gp2", resourceId: "res_gp", title: "Lessons", bookedBy: "Coach Team", start: t("11:15"), end: t("13:15"), kind: "Pool", units: 4 },
  { id: "gp3", resourceId: "res_gp", title: "Club Lane Booking", bookedBy: "Swim Club", start: t("16:00"), end: t("18:00"), kind: "Pool", units: 7 },

  // SQUASH
  { id: "sq_0815", resourceId: "res_sq1", title: "Pay & Play", bookedBy: "Front Desk", start: t("08:15"), end: t("09:15"), kind: "Squash", createdAt: t("07:50"), participants: people4(["Member A", true], ["Member B", false], ["Member C", false], ["Member D", true]) },
  { id: "sq_0930", resourceId: "res_sq1", title: "Lunchtime Ladder", bookedBy: "Squash Desk", start: t("09:30"), end: t("10:30"), kind: "Squash", createdAt: t("09:05"), participants: people4(["Member E", true], ["Member F", true], ["Member G", false], ["Member H", false]) },
  { id: "sq_1045", resourceId: "res_sq1", title: "Coaching (1:1)", bookedBy: "Coach", start: t("10:45"), end: t("11:45"), kind: "Squash", participants: people4(["Coach", true], ["Member J", true], ["—", true], ["—", true]) },
  { id: "sq_1200", resourceId: "res_sq1", title: "Open Court", bookedBy: "Member Booking", start: t("12:00"), end: t("13:00"), kind: "Squash", createdAt: t("11:40"), participants: people4(["Member K", true], ["Member L", true], ["Member M", true], ["Member N", true]) },
  { id: "sq_1315", resourceId: "res_sq1", title: "League Match", bookedBy: "League", start: t("13:15"), end: t("14:15"), kind: "Squash", createdAt: t("12:58"), participants: people4(["Member P", true], ["Member Q", false], ["Member R", false], ["Member S", false]) },
  { id: "sq_1430", resourceId: "res_sq1", title: "Junior Coaching", bookedBy: "Coach", start: t("14:30"), end: t("15:30"), kind: "Squash", participants: people4(["Junior 1", true], ["Junior 2", true], ["Coach", true], ["Junior 3", false]) },
  { id: "sq_1545", resourceId: "res_sq1", title: "Pay & Play", bookedBy: "Public User", start: t("15:45"), end: t("16:45"), kind: "Squash", createdAt: t("15:12"), participants: people4(["Member T", true], ["Member U", false], ["Member V", false], ["Member W", true]) },
  { id: "sq_1700", resourceId: "res_sq1", title: "Club Session", bookedBy: "Squash Club", start: t("17:00"), end: t("18:00"), kind: "Squash", participants: people4(["Member X", true], ["Member Y", true], ["Member Z", true], ["Member AA", true]) },
  { id: "sq_1815", resourceId: "res_sq1", title: "Social Doubles", bookedBy: "Squash Club", start: t("18:15"), end: t("19:15"), kind: "Squash", createdAt: t("17:55"), participants: people4(["Member AB", true], ["Member AC", true], ["Member AD", false], ["Member AE", true]) },

  // PADEL 1
  { id: "pc1_0800", resourceId: "res_pc1", title: "Pay & Play", bookedBy: "Public User", start: t("08:00"), end: t("09:00"), kind: "Padel", createdAt: t("07:35"), participants: players4(["Alex (booker)", true], ["Jamie", false], ["Sam", false], ["Taylor", true]) },
  { id: "pc1_0915", resourceId: "res_pc1", title: "Padel Booking", bookedBy: "Public User", start: t("09:15"), end: t("10:15"), kind: "Padel", createdAt: t("08:58"), participants: players4(["Chris (booker)", true], ["Jordan", true], ["Casey", false], ["Morgan", true]) },
  { id: "pc1_1030", resourceId: "res_pc1", title: "Coaching Clinic", bookedBy: "Coach", start: t("10:30"), end: t("11:30"), kind: "Padel", participants: players4(["Coach", true], ["Player A", true], ["Player B", true], ["Player C", true]) },
  { id: "pc1_1145", resourceId: "res_pc1", title: "Padel Booking", bookedBy: "Public User", start: t("11:45"), end: t("12:45"), kind: "Padel", participants: players4(["Riley (booker)", true], ["Avery", true], ["Quinn", true], ["Parker", true]) },
  { id: "pc1_1300", resourceId: "res_pc1", title: "Lunch League", bookedBy: "League", start: t("13:00"), end: t("14:00"), kind: "Padel", createdAt: t("12:30"), participants: players4(["Team 1", true], ["Team 2", false], ["Team 3", false], ["Team 4", true]) },
  { id: "pc1_1415", resourceId: "res_pc1", title: "Pay & Play", bookedBy: "Front Desk", start: t("14:15"), end: t("15:15"), kind: "Padel", participants: players4(["Member 1", true], ["Member 2", true], ["Member 3", false], ["Member 4", false]) },
  { id: "pc1_1530", resourceId: "res_pc1", title: "Padel Booking", bookedBy: "Public User", start: t("15:30"), end: t("16:30"), kind: "Padel", createdAt: t("15:05"), participants: players4(["Lee (booker)", true], ["Kim", false], ["Pat", false], ["Drew", true]) },
  { id: "pc1_1645", resourceId: "res_pc1", title: "After Work Match", bookedBy: "Member Booking", start: t("16:45"), end: t("17:45"), kind: "Padel", participants: players4(["Nina", true], ["Omar", true], ["Iris", true], ["Hugo", true]) },
  { id: "pc1_1800", resourceId: "res_pc1", title: "Social Padel", bookedBy: "Padel Club", start: t("18:00"), end: t("19:00"), kind: "Padel", createdAt: t("17:34"), participants: players4(["Host", true], ["Guest 1", true], ["Guest 2", false], ["Guest 3", true]) },

  // PADEL 2
  { id: "pc2_0815", resourceId: "res_pc2", title: "Padel Booking", bookedBy: "Public User", start: t("08:15"), end: t("09:15"), kind: "Padel", participants: players4(["Mia (booker)", true], ["Noah", true], ["Aria", true], ["Evan", true]) },
  { id: "pc2_0930", resourceId: "res_pc2", title: "Beginner Lesson", bookedBy: "Coach", start: t("09:30"), end: t("10:30"), kind: "Padel", participants: players4(["Coach", true], ["Student 1", true], ["Student 2", true], ["Student 3", true]) },
  { id: "pc2_1045", resourceId: "res_pc2", title: "Padel Booking", bookedBy: "Public User", start: t("10:45"), end: t("11:45"), kind: "Padel", createdAt: t("10:20"), participants: players4(["Ben (booker)", true], ["Zoe", false], ["Max", false], ["Ella", true]) },
  { id: "pc2_1200", resourceId: "res_pc2", title: "Padel Booking", bookedBy: "Member Booking", start: t("12:00"), end: t("13:00"), kind: "Padel", participants: players4(["Sana", true], ["Luca", true], ["Jude", true], ["Tara", true]) },
  { id: "pc2_1315", resourceId: "res_pc2", title: "Corporate Session", bookedBy: "Corporate", start: t("13:15"), end: t("14:15"), kind: "Padel", createdAt: t("12:40"), participants: players4(["Team A", true], ["Team B", true], ["Team C", false], ["Team D", false]) },
  { id: "pc2_1430", resourceId: "res_pc2", title: "Padel Coaching", bookedBy: "Coach", start: t("14:30"), end: t("15:30"), kind: "Padel", participants: players4(["Coach", true], ["Player D", true], ["Player E", true], ["Player F", false]) },
  { id: "pc2_1545", resourceId: "res_pc2", title: "Padel Booking", bookedBy: "Public User", start: t("15:45"), end: t("16:45"), kind: "Padel", createdAt: t("15:10"), participants: players4(["Kaya (booker)", true], ["Ivo", false], ["Ren", false], ["Tomi", true]) },
  { id: "pc2_1700", resourceId: "res_pc2", title: "Match Play", bookedBy: "Member Booking", start: t("17:00"), end: t("18:00"), kind: "Padel", participants: players4(["Asha", true], ["Jon", true], ["Priya", true], ["Cal", true]) },
  { id: "pc2_1815", resourceId: "res_pc2", title: "Padel Booking", bookedBy: "Public User", start: t("18:15"), end: t("19:15"), kind: "Padel", createdAt: t("17:50"), participants: players4(["Inez (booker)", true], ["Bo", true], ["Kai", false], ["Liv", true]) },

  // PADEL 3
  { id: "pc3_0900", resourceId: "res_pc3", title: "Padel Booking", bookedBy: "Public User", start: t("09:00"), end: t("10:00"), kind: "Padel", createdAt: t("08:40"), participants: players4(["Dani (booker)", true], ["Rowan", true], ["Sky", false], ["Remy", true]) },
  { id: "pc3_1015", resourceId: "res_pc3", title: "Intermediate Lesson", bookedBy: "Coach", start: t("10:15"), end: t("11:15"), kind: "Padel", participants: players4(["Coach", true], ["Student A", true], ["Student B", true], ["Student C", true]) },
  { id: "pc3_1130", resourceId: "res_pc3", title: "Padel Booking", bookedBy: "Member Booking", start: t("11:30"), end: t("12:30"), kind: "Padel", participants: players4(["Mason", true], ["Isla", true], ["Theo", true], ["Sage", true]) },
  { id: "pc3_1245", resourceId: "res_pc3", title: "Padel Booking", bookedBy: "Public User", start: t("12:45"), end: t("13:45"), kind: "Padel", createdAt: t("12:20"), participants: players4(["Aiden (booker)", true], ["Nova", false], ["Liam", false], ["Mara", true]) },
  { id: "pc3_1500", resourceId: "res_pc3", title: "Padel Booking", bookedBy: "Public User", start: t("15:00"), end: t("16:00"), kind: "Padel", participants: players4(["Sofia", true], ["Nico", true], ["Elle", true], ["Finn", true]) },
  { id: "pc3_1615", resourceId: "res_pc3", title: "Club Ladder", bookedBy: "Padel Club", start: t("16:15"), end: t("17:15"), kind: "Padel", createdAt: t("15:44"), participants: players4(["Host", true], ["Challenger", true], ["Pair 1", false], ["Pair 2", true]) },
  { id: "pc3_1730", resourceId: "res_pc3", title: "Padel Booking", bookedBy: "Member Booking", start: t("17:30"), end: t("18:30"), kind: "Padel", participants: players4(["Zara", true], ["Hani", true], ["Cora", false], ["Mika", true]) },
];

/* ---------------- overlap layout ---------------- */
function layoutOverlapsForColumn(bookings: Booking[]): Positioned[] {
  const sorted = [...bookings].sort((a, b) => a.start.localeCompare(b.start));
  const laneById: Record<string, number> = {};
  type Active = { id: string; end: number; lane: number };
  const active: Active[] = [];

  for (const b of sorted) {
    const s = parseLocal(b.start).getTime();
    const e = parseLocal(b.end).getTime();

    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= s) active.splice(i, 1);
    }

    const used = new Set(active.map((x) => x.lane));
    let lane = 0;
    while (used.has(lane)) lane++;
    laneById[b.id] = lane;

    active.push({ id: b.id, end: e, lane });
  }

  const lanesForId: Record<string, number> = {};
  for (const b of sorted) {
    const s = parseLocal(b.start);
    const e = parseLocal(b.end);
    let max = 1;

    for (const t of sorted) {
      const ts = parseLocal(t.start);
      const te = parseLocal(t.end);
      if (!overlaps(s, e, ts, te)) continue;
      max = Math.max(max, (laneById[t.id] ?? 0) + 1);
    }
    lanesForId[b.id] = max;
  }

  return sorted.map((b) => ({ b, lane: laneById[b.id] ?? 0, lanes: lanesForId[b.id] ?? 1 }));
}

/* ---------------- small UI helpers ---------------- */
function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[92vw] max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        min={min}
        max={max}
        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-300"
      />
    </label>
  );
}

function membersPillText(b: Booking) {
  if ((b.kind !== "Padel" && b.kind !== "Squash") || !b.participants?.length) return null;
  const total = b.participants.length;
  const confirmed = b.participants.filter((p) => p.confirmed).length;
  return `${confirmed}/${total}`;
}

function allMembersConfirmed(b: Booking) {
  if ((b.kind !== "Padel" && b.kind !== "Squash") || !b.participants?.length) return true;
  return b.participants.every((p) => p.confirmed);
}

/**
 * ✅ ONLY TEXT is smaller now:
 * - Keep pill size/shape basically the same
 * - Make the label smaller: text-[7px] (even smaller than before)
 * - Keep padding similar so it still "reads" as a pill
 */

function MicroPill({ status }: { status: MicroStatus }) {
  const cls =
    status === "Confirmed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Pending"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : status === "Expired"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        cls
      )}
    >
      {status}
    </span>
  );
}


function microStatusForBooking(b: Booking, nowTick: Date): MicroStatus {
  if (b.kind === "Pool") return "Confirmed";

  if (!b.participants?.length) return "Confirmed";
  if (allMembersConfirmed(b)) return "Confirmed";

  if (!b.createdAt) return "Pending";

  const created = parseLocal(b.createdAt);
  const deadline = new Date(created.getTime() + 60 * 60000);
  const minsLeft = minutesDiff(deadline, nowTick);

  if (minsLeft <= 0) return "Expired";
  return "Pending";
}

function BookingBlock({
  b,
  selected,
  onClick,
  top,
  height,
  left,
  width,
  availabilityPill,
  membersPill,
  isConfirmed,
  microStatus,
}: {
  b: Booking;
  selected: boolean;
  onClick: () => void;
  top: number;
  height: number;
  left: string;
  width: string;
  availabilityPill?: string;
  membersPill?: string;
  isConfirmed?: boolean;
  microStatus?: MicroStatus;
}) {
  return (
    <button type="button" data-booking onClick={onClick} className="absolute px-2" style={{ top, height, left, width }}>
      <div
        className={cn(
          "group relative h-full w-full rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md",
          selected ? "border-[#0C2F57] ring-1 ring-[#0C2F57]/20" : "border-slate-200"
        )}
      >
        {microStatus ? (
          <div className="pointer-events-none absolute right-2 top-2">
            <MicroPill status={microStatus} />
          </div>
        ) : null}

        <div className="flex h-full flex-col p-3">
          <div className="flex items-start justify-between gap-2">
            {/* leave room for pill */}
            <div className="min-w-0 pr-14">
              <div className="truncate text-sm font-semibold text-slate-900">{b.title}</div>
              <div className="mt-0.5 truncate text-xs text-slate-600">{b.bookedBy ?? "—"}</div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {b.start.slice(11)}–{b.end.slice(11)}
            </span>

            {availabilityPill ? (
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {availabilityPill}
              </span>
            ) : null}

            {membersPill ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                  isConfirmed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                )}
              >
                <Users className="mr-1 h-3 w-3" />
                {membersPill}
              </span>
            ) : null}
          </div>

          {height >= 120 ? (
            <div className="mt-auto pt-2 text-[11px] text-slate-600">
              Click to manage
              <span className="ml-2 opacity-0 transition group-hover:opacity-100">• View / Edit / Delete</span>
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

/* ---------------- page ---------------- */
export default function AdminBookingsPage() {
  const START_HOUR = 8;
  const END_HOUR = 20;
  const INC_MIN = 15;

  const INC_PX = 28;

  const TIME_RAIL_W = 92;
  const COL_MIN = 260;

  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const steps = totalMinutes / INC_MIN;
  const gridHeight = steps * INC_PX;

  const [day, setDay] = useState<Date>(new Date(2025, 11, 19));
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"manage" | "edit" | "create">("manage");

  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldStart, setFieldStart] = useState("");
  const [fieldEnd, setFieldEnd] = useState("");
  const [fieldUnits, setFieldUnits] = useState("1");

  const [nowTick, setNowTick] = useState<Date>(new Date());
  useEffect(() => {
    const tmr = setInterval(() => setNowTick(new Date()), 30000);
    return () => clearInterval(tmr);
  }, []);

  const ymd = toYMD(day);
  const visibleBookings = useMemo(() => bookings.filter((b) => b.start.startsWith(ymd)), [bookings, ymd]);
  const selected = selectedId ? bookings.find((b) => b.id === selectedId) : null;

  const facilityName = (fid: string) => facilities.find((f) => f.id === fid)?.name ?? "—";
  const resourceById = (id: string) => resources.find((r) => r.id === id);

  const timeLabels = useMemo(() => {
    const out: Array<{ top: number; label: string; isHour: boolean }> = [];
    for (let i = 0; i <= steps; i++) {
      const mins = i * INC_MIN;
      const hh = START_HOUR + Math.floor(mins / 60);
      const mm = mins % 60;
      out.push({ top: i * INC_PX, label: `${pad2(hh)}:${pad2(mm)}`, isHour: mm === 0 });
    }
    return out;
  }, [steps, INC_MIN, INC_PX, START_HOUR]);

  function poolAvailabilityForWindow(resourceId: string, wStart: Date, wEnd: Date) {
    const cap = POOL_CAPACITY_BY_RESOURCE[resourceId];
    if (!cap) return null;

    const used = visibleBookings
      .filter((b) => b.kind === "Pool" && b.resourceId === resourceId)
      .reduce((sum, b) => {
        const s = parseLocal(b.start);
        const e = parseLocal(b.end);
        if (!overlaps(s, e, wStart, wEnd)) return sum;
        return sum + (b.units ?? 1);
      }, 0);

    const available = clamp(cap - used, 0, cap);
    return { available, cap };
  }

  function openManage(id: string) {
    setSelectedId(id);
    setDrawerMode("manage");
    setDrawerOpen(true);
  }

  function openCreateDefault() {
    const r = resources[0];
    if (!r) return;

    const s = dateWithMinutes(day, START_HOUR, 60);
    const e = dateWithMinutes(day, START_HOUR, 120);

    setSelectedId(null);
    setActiveResourceId(r.id);
    setFieldTitle("");
    setFieldStart(toIsoLocal(s));
    setFieldEnd(toIsoLocal(e));
    setFieldUnits("1");

    setDrawerMode("create");
    setDrawerOpen(true);
  }

  function openEditSelected() {
    if (!selected) return;
    setActiveResourceId(selected.resourceId);
    setFieldTitle(selected.title);
    setFieldStart(selected.start);
    setFieldEnd(selected.end);
    setFieldUnits(String(selected.units ?? 1));
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  function deleteSelected() {
    if (!selected) return;
    setBookings((prev) => prev.filter((b) => b.id !== selected.id));
    setSelectedId(null);
    setDrawerOpen(false);
  }

  function saveEdit() {
    if (!selected) return;

    const s0 = parseLocal(fieldStart);
    const e0 = parseLocal(fieldEnd);

    const sMin = snapToIncrement(minutesSinceStartOfDay(s0, START_HOUR), INC_MIN);
    const eMin = snapToIncrement(minutesSinceStartOfDay(e0, START_HOUR), INC_MIN);

    const s = dateWithMinutes(day, START_HOUR, clamp(sMin, 0, totalMinutes));
    const e = dateWithMinutes(day, START_HOUR, clamp(eMin, 0, totalMinutes));
    if (e <= s) return;

    const units = Math.max(1, Math.min(99, Number(fieldUnits || "1") || 1));

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selected.id
          ? {
              ...b,
              title: fieldTitle.trim() || b.title,
              start: toIsoLocal(s),
              end: toIsoLocal(e),
              units: b.kind === "Pool" ? units : b.units,
            }
          : b
      )
    );

    setDrawerMode("manage");
  }

  function createBooking() {
    if (!activeResourceId) return;
    const r = resourceById(activeResourceId);
    if (!r) return;

    const s0 = parseLocal(fieldStart);
    const e0 = parseLocal(fieldEnd);

    const sMin = snapToIncrement(minutesSinceStartOfDay(s0, START_HOUR), INC_MIN);
    const eMin = snapToIncrement(minutesSinceStartOfDay(e0, START_HOUR), INC_MIN);

    const s = dateWithMinutes(day, START_HOUR, clamp(sMin, 0, totalMinutes));
    const e = dateWithMinutes(day, START_HOUR, clamp(eMin, 0, totalMinutes));
    if (e <= s) return;

    const id = `bk_${Math.random().toString(16).slice(2)}`;

    const next: Booking = {
      id,
      resourceId: activeResourceId,
      title: fieldTitle.trim() || "New Booking",
      bookedBy: "Admin",
      start: toIsoLocal(s),
      end: toIsoLocal(e),
      kind: r.kind,
    };

    const units = Math.max(1, Math.min(99, Number(fieldUnits || "1") || 1));
    if (r.kind === "Pool") next.units = units;

    if (r.kind === "Padel" || r.kind === "Squash") {
      next.bookedBy = r.kind === "Padel" ? "Public User" : "Member Booking";
      next.createdAt = toIsoLocal(new Date());
      next.participants = [
        { name: "Member 1 (booker)", initial: "1", confirmed: true },
        { name: "Member 2", initial: "2", confirmed: false },
        { name: "Member 3", initial: "3", confirmed: false },
        { name: "Member 4", initial: "4", confirmed: false },
      ];
    }

    setBookings((prev) => [...prev, next]);
    setSelectedId(id);
    setDrawerMode("manage");
  }

  function onColumnClick(e: React.MouseEvent, resourceId: string) {
    const target = e.target as HTMLElement;
    if (target.closest("[data-booking]")) return;

    const col = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = e.clientY - col.top;

    const minutes = (y / INC_PX) * INC_MIN;
    const snapped = snapToIncrement(minutes, INC_MIN);

    const s = dateWithMinutes(day, START_HOUR, clamp(snapped, 0, totalMinutes));
    const e2 = dateWithMinutes(day, START_HOUR, clamp(snapped + 60, 0, totalMinutes));

    setSelectedId(null);
    setActiveResourceId(resourceId);
    setFieldTitle("");
    setFieldStart(toIsoLocal(s));
    setFieldEnd(toIsoLocal(e2));
    setFieldUnits("1");

    setDrawerMode("create");
    setDrawerOpen(true);
  }

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0C2F57]">Manage Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">Squash &amp; Padel require member confirmation (shows x/4).</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setDay(new Date())}>
            Today
          </Button>

          <Button className="gap-2" onClick={openCreateDefault}>
            <Plus className="h-4 w-4" />
            Create Booking
          </Button>

          <Button variant="outline" className="gap-2" onClick={openEditSelected} disabled={!selected}>
            <Pencil className="h-4 w-4" />
            Edit Booking
          </Button>

          <Button variant="outline" className="gap-2" onClick={deleteSelected} disabled={!selected}>
            <Trash2 className="h-4 w-4" />
            Delete Booking
          </Button>
        </div>
      </div>

      {/* Date bar */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setDay((d) => addDays(d, -1))}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setDay((d) => addDays(d, 1))}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="ml-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            {fmtTopDate(day)}
          </div>

          <div className="ml-auto text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{resources.length}</span> resources ·{" "}
            <span className="font-semibold text-slate-900">{visibleBookings.length}</span> bookings
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Card className="mt-4">
        <CardContent className="p-0">
          <div className="overflow-auto">
            {/* Headers */}
            <div
              className="sticky top-0 z-20 grid border-b border-slate-200 bg-white"
              style={{ gridTemplateColumns: `${TIME_RAIL_W}px repeat(${resources.length}, minmax(${COL_MIN}px, 1fr))` }}
            >
              <div className="border-r border-slate-200 px-3 py-3" />
              {resources.map((r) => (
                <div key={r.id} className="border-r border-slate-200 px-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{r.name}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {facilityName(r.facilityId)}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {r.kind}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `${TIME_RAIL_W}px repeat(${resources.length}, minmax(${COL_MIN}px, 1fr))`,
                height: gridHeight,
              }}
            >
              {/* Time rail */}
              <div className="relative border-r border-slate-200 bg-white">
                {Array.from({ length: steps + 1 }).map((_, i) => {
                  const isHour = i % 4 === 0;
                  return (
                    <div
                      key={i}
                      className={cn("absolute left-0 right-0 border-t", isHour ? "border-slate-200" : "border-slate-100")}
                      style={{ top: i * INC_PX }}
                    />
                  );
                })}
                {timeLabels.map((x, idx) => (
                  <div
                    key={`${x.label}_${idx}`}
                    className={cn(
                      "absolute left-0 right-0 -translate-y-1/2 px-3",
                      x.isHour ? "text-sm font-semibold text-slate-600" : "text-xs text-slate-400"
                    )}
                    style={{ top: x.top }}
                  >
                    {x.label}
                  </div>
                ))}
              </div>

              {/* Columns */}
              {resources.map((r) => {
                const colBookings = visibleBookings.filter((b) => b.resourceId === r.id);
                const positioned = layoutOverlapsForColumn(colBookings);

                return (
                  <div key={r.id} className="relative border-r border-slate-200 bg-white" onClick={(e) => onColumnClick(e, r.id)}>
                    {Array.from({ length: steps + 1 }).map((_, i) => {
                      const isHour = i % 4 === 0;
                      return (
                        <div
                          key={i}
                          className={cn("absolute left-0 right-0 border-t", isHour ? "border-slate-200" : "border-slate-100")}
                          style={{ top: i * INC_PX }}
                        />
                      );
                    })}

                    {positioned.map(({ b, lane, lanes }) => {
                      const s = parseLocal(b.start);
                      const e = parseLocal(b.end);

                      const startMin = snapToIncrement(minutesSinceStartOfDay(s, START_HOUR), INC_MIN);
                      const endMin = snapToIncrement(minutesSinceStartOfDay(e, START_HOUR), INC_MIN);

                      const topMin = clamp(startMin, 0, totalMinutes);
                      const bottomMin = clamp(endMin, 0, totalMinutes);

                      const top = (topMin / INC_MIN) * INC_PX;
                      const height = Math.max(44, ((bottomMin - topMin) / INC_MIN) * INC_PX);

                      const width = `calc((100% - ${10 * 2}px - ${(lanes - 1) * 10}px) / ${lanes})`;
                      const left = `calc(${10}px + ${lane} * (${width} + ${10}px))`;

                      let availabilityPill: string | undefined = undefined;
                      if (b.kind === "Pool") {
                        const info = poolAvailabilityForWindow(b.resourceId, s, e);
                        if (info) availabilityPill = `${info.available}/${info.cap} available`;
                      }

                      const mPill = membersPillText(b) ?? undefined;
                      const confirmed = allMembersConfirmed(b);
                      const microStatus = microStatusForBooking(b, nowTick);

                      return (
                        <BookingBlock
                          key={b.id}
                          b={b}
                          selected={selectedId === b.id}
                          onClick={() => openManage(b.id)}
                          top={top}
                          height={height}
                          left={left}
                          width={width}
                          availabilityPill={availabilityPill}
                          membersPill={mPill}
                          isConfirmed={confirmed}
                          microStatus={microStatus}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        title={drawerMode === "create" ? "Create booking" : drawerMode === "edit" ? "Edit booking" : "Manage booking"}
        onClose={() => setDrawerOpen(false)}
      >
        {/* Manage */}
        {drawerMode === "manage" && selected ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-900">{selected.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{selected.bookedBy ?? "—"}</div>
                </div>
                <MicroPill status={microStatusForBooking(selected, nowTick)} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {selected.start.slice(11)}–{selected.end.slice(11)}
                </span>

                {(selected.kind === "Padel" || selected.kind === "Squash") && selected.participants ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      allMembersConfirmed(selected)
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    )}
                  >
                    <Users className="mr-1 h-3 w-3" />
                    {membersPillText(selected)}
                  </span>
                ) : null}
              </div>
            </div>

            {(selected.kind === "Padel" || selected.kind === "Squash") && selected.participants ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-900">Members</div>
                {selected.participants.map((p, idx) => (
                  <div
                    key={`${p.name}_${idx}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {p.initial ?? p.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-600">{p.confirmed ? "Confirmed" : "Pending"}</div>
                      </div>
                    </div>

                    {p.confirmed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-2">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Manage booking
              </Button>

              <Button variant="outline" className="gap-2" onClick={openEditSelected}>
                <Pencil className="h-4 w-4" />
                Edit booking
              </Button>

              <Button variant="outline" className="gap-2" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4" />
                Delete booking
              </Button>
            </div>
          </div>
        ) : null}

        {/* Edit */}
        {drawerMode === "edit" && selected ? (
          <div className="space-y-4">
            <Field label="Title" value={fieldTitle} onChange={setFieldTitle} />
            <Field label="Start (YYYY-MM-DDTHH:mm)" value={fieldStart} onChange={setFieldStart} />
            <Field label="End (YYYY-MM-DDTHH:mm)" value={fieldEnd} onChange={setFieldEnd} />
            {selected.kind === "Pool" ? (
              <Field label="Lanes used" value={fieldUnits} onChange={setFieldUnits} type="number" min={1} max={99} />
            ) : null}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDrawerMode("manage")}>
                Back
              </Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </div>
        ) : null}

        {/* Create */}
        {drawerMode === "create" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Creating for</div>
              <div className="mt-1 text-sm text-slate-600">
                {activeResourceId ? resourceById(activeResourceId)?.name : "—"}
              </div>
            </div>

            <Field label="Title" value={fieldTitle} onChange={setFieldTitle} />
            <Field label="Start (YYYY-MM-DDTHH:mm)" value={fieldStart} onChange={setFieldStart} />
            <Field label="End (YYYY-MM-DDTHH:mm)" value={fieldEnd} onChange={setFieldEnd} />

            {activeResourceId && resourceById(activeResourceId)?.kind === "Pool" ? (
              <Field label="Lanes used" value={fieldUnits} onChange={setFieldUnits} type="number" min={1} max={99} />
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createBooking}>Create</Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
