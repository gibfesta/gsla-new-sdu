"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StatsLineChart from "@/components/stats/StatsLineChart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  Trophy,
  ShieldAlert,
  CalendarDays,
  Activity,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* -------------------------------------------------------------
  UI helpers (same vibe as Profile/Calendar pages)
------------------------------------------------------------- */

function classNames(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "red" | "amber" | "emerald" | "indigo";
}) {
  const toneCls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : tone === "red"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : tone === "indigo"
            ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
            : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={classNames("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1", toneCls)}>
      {children}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "slate",
  deltaLabel,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  tone?: "slate" | "red" | "amber" | "emerald" | "indigo";
  deltaLabel?: { dir: "up" | "down"; text: string };
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600">{title}</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
          </div>

          <div className="flex flex-col items-end gap-2">
            <Pill tone={tone}>
              <Icon size={14} />
              {tone === "emerald"
                ? "Healthy"
                : tone === "amber"
                  ? "Watch"
                  : tone === "red"
                    ? "Risk"
                    : tone === "indigo"
                      ? "Focus"
                      : "Info"}
            </Pill>

            {deltaLabel ? (
              <span
                className={classNames(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1",
                  deltaLabel.dir === "up"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                )}
              >
                {deltaLabel.dir === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {deltaLabel.text}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function deltaTone(deltaPct: number) {
  if (deltaPct >= 6) return "emerald";
  if (deltaPct >= 0) return "indigo";
  if (deltaPct >= -5) return "amber";
  return "red";
}

function formatPct(n: number) {
  const s = Math.abs(n).toFixed(1);
  return `${n >= 0 ? "+" : "-"}${s}%`;
}

/* -------------------------------------------------------------
  Demo data (replace with real backend later)
  - All calculations derive from this one source of truth.
------------------------------------------------------------- */

type SportKey = "All Sports" | "Football" | "Cricket" | "Athletics" | "Swimming" | "Gib Hockey";

type SportHealthRow = {
  sport: Exclude<SportKey, "All Sports">;
  participants: number;
  yoyGrowthPct: number;
  new30d: number;
  churn30d: number;
  retentionPct: number;
  complianceFlags: number;
  activeTeams: number;
  fixturesThisMonth: number;
};

const sportsRows: SportHealthRow[] = [
  {
    sport: "Football",
    participants: 520,
    yoyGrowthPct: 10.2,
    new30d: 210,
    churn30d: 40,
    retentionPct: 84,
    complianceFlags: 2,
    activeTeams: 34,
    fixturesThisMonth: 128,
  },
  {
    sport: "Cricket",
    participants: 240,
    yoyGrowthPct: 4.1,
    new30d: 82,
    churn30d: 26,
    retentionPct: 79,
    complianceFlags: 3,
    activeTeams: 18,
    fixturesThisMonth: 62,
  },
  {
    sport: "Athletics",
    participants: 190,
    yoyGrowthPct: -2.6,
    new30d: 58,
    churn30d: 32,
    retentionPct: 74,
    complianceFlags: 1,
    activeTeams: 12,
    fixturesThisMonth: 46,
  },
  {
    sport: "Swimming",
    participants: 110,
    yoyGrowthPct: 1.3,
    new30d: 14,
    churn30d: 12,
    retentionPct: 81,
    complianceFlags: 2,
    activeTeams: 9,
    fixturesThisMonth: 28,
  },
  {
    sport: "Hockey",
    participants: 190,
    yoyGrowthPct: 7.9,
    new30d: 96,
    churn30d: 18,
    retentionPct: 86,
    complianceFlags: 0,
    activeTeams: 23,
    fixturesThisMonth: 48,
  },
];

// Demo time-series data per sport (simple, consistent, “good enough” for UI)
// If you already have real time-series in StatsLineChart, keep it; this page can still use it.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function seriesForSport(sport: SportKey) {
  // baseline by sport
  const base: Record<Exclude<SportKey, "All Sports">, number[]> = {
    Football: [360, 372, 381, 395, 402, 410, 420, 435, 448, 462, 480, 520],
    Cricket: [160, 168, 172, 178, 184, 190, 198, 205, 212, 220, 230, 240],
    Athletics: [180, 176, 172, 170, 168, 166, 165, 167, 170, 175, 182, 190],
    Swimming: [92, 95, 98, 100, 102, 104, 106, 107, 108, 109, 110, 110],
    Hockey: [140, 150, 156, 160, 165, 170, 174, 178, 182, 185, 188, 190],
  };

  if (sport === "All Sports") {
    return months.map((m, idx) => ({
      month: m,
      participants:
        base.Football[idx] + base.Cricket[idx] + base.Athletics[idx] + base.Swimming[idx] + base.Hockey[idx],
      newParticipants: Math.round((base.Football[idx] + base.Cricket[idx] + base.Hockey[idx]) / 25),
      returningParticipants: Math.round(
        (base.Athletics[idx] + base.Swimming[idx] + base.Football[idx] + base.Cricket[idx]) / 4
      ),
    }));
  }

  const p = base[sport];
  return months.map((m, idx) => ({
    month: m,
    participants: p[idx],
    newParticipants: Math.max(6, Math.round(p[idx] / 14) - (idx % 3)),
    returningParticipants: Math.max(10, Math.round(p[idx] / 2.8) + (idx % 2)),
  }));
}

function distributionForSport(sport: SportKey) {
  // “age band” distribution (demo)
  const all = [
    { band: "U12", value: 280 },
    { band: "U16", value: 320 },
    { band: "U18", value: 210 },
    { band: "Adult", value: 390 },
    { band: "Masters", value: 50 },
  ];

  const bySport: Record<Exclude<SportKey, "All Sports">, typeof all> = {
    Football: [
      { band: "U12", value: 130 },
      { band: "U16", value: 160 },
      { band: "U18", value: 90 },
      { band: "Adult", value: 130 },
      { band: "Masters", value: 10 },
    ],
    Cricket: [
      { band: "U12", value: 40 },
      { band: "U16", value: 55 },
      { band: "U18", value: 35 },
      { band: "Adult", value: 95 },
      { band: "Masters", value: 15 },
    ],
    Athletics: [
      { band: "U12", value: 55 },
      { band: "U16", value: 60 },
      { band: "U18", value: 40 },
      { band: "Adult", value: 30 },
      { band: "Masters", value: 5 },
    ],
    Swimming: [
      { band: "U12", value: 35 },
      { band: "U16", value: 25 },
      { band: "U18", value: 15 },
      { band: "Adult", value: 30 },
      { band: "Masters", value: 5 },
    ],
    Hockey: [
      { band: "U12", value: 20 },
      { band: "U16", value: 20 },
      { band: "U18", value: 30 },
      { band: "Adult", value: 105 },
      { band: "Masters", value: 15 },
    ],
  };

  return sport === "All Sports" ? all : bySport[sport];
}

/* -------------------------------------------------------------
  Page
------------------------------------------------------------- */

export default function StatsPage() {
  const [sportFilter, setSportFilter] = useState<SportKey>("All Sports");

  const sportOptions: SportKey[] = ["All Sports", "Football", "Cricket", "Athletics", "Swimming", "Hockey"];

  const selectedRow = useMemo(() => {
    if (sportFilter === "All Sports") return null;
    return sportsRows.find((s) => s.sport === sportFilter) ?? null;
  }, [sportFilter]);

  const totals = useMemo(() => {
    if (sportFilter !== "All Sports" && selectedRow) {
      return {
        participants: selectedRow.participants,
        yoyGrowthPct: selectedRow.yoyGrowthPct,
        new30d: selectedRow.new30d,
        churn30d: selectedRow.churn30d,
        retentionPct: selectedRow.retentionPct,
        complianceFlags: selectedRow.complianceFlags,
        activeTeams: selectedRow.activeTeams,
        fixturesThisMonth: selectedRow.fixturesThisMonth,
      };
    }

    const participants = sportsRows.reduce((a, b) => a + b.participants, 0);
    const new30d = sportsRows.reduce((a, b) => a + b.new30d, 0);
    const churn30d = sportsRows.reduce((a, b) => a + b.churn30d, 0);
    const complianceFlags = sportsRows.reduce((a, b) => a + b.complianceFlags, 0);
    const activeTeams = sportsRows.reduce((a, b) => a + b.activeTeams, 0);
    const fixturesThisMonth = sportsRows.reduce((a, b) => a + b.fixturesThisMonth, 0);

    // weighted averages (simple + sensible for demo)
    const yoyGrowthPct =
      participants === 0
        ? 0
        : sportsRows.reduce((acc, r) => acc + r.yoyGrowthPct * r.participants, 0) / participants;

    const retentionPct =
      participants === 0
        ? 0
        : sportsRows.reduce((acc, r) => acc + r.retentionPct * r.participants, 0) / participants;

    return {
      participants,
      yoyGrowthPct: Math.round(yoyGrowthPct * 10) / 10,
      new30d,
      churn30d,
      retentionPct: Math.round(retentionPct),
      complianceFlags,
      activeTeams,
      fixturesThisMonth,
    };
  }, [sportFilter, selectedRow]);

  const trendData = useMemo(() => seriesForSport(sportFilter), [sportFilter]);
  const distribution = useMemo(() => distributionForSport(sportFilter), [sportFilter]);

  const tableRows = useMemo(() => {
    // table always shows all sports for comparison
    return [...sportsRows].sort((a, b) => b.participants - a.participants);
  }, []);

  const watchList = useMemo(() => {
    // small “action list” derived from health signals (demo logic)
    const scored = sportsRows.map((r) => {
      const risk =
        (r.retentionPct < 78 ? 2 : 0) +
        (r.yoyGrowthPct < 0 ? 2 : r.yoyGrowthPct < 3 ? 1 : 0) +
        (r.complianceFlags >= 3 ? 2 : r.complianceFlags >= 1 ? 1 : 0) +
        (r.new30d < 30 ? 1 : 0);
      return { r, risk };
    });

    return scored
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 4)
      .map(({ r, risk }) => ({
        sport: r.sport,
        note:
          risk >= 5
            ? "High attention"
            : risk >= 3
              ? "Support needed"
              : "Keep monitoring",
        tone: (risk >= 5 ? "red" : risk >= 3 ? "amber" : "slate") as const,
        detail: `Retention ${r.retentionPct}% • YoY ${formatPct(r.yoyGrowthPct)} • Flags ${r.complianceFlags}`,
      }));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Statistics</h1>
          <p className="mt-2 text-slate-600">
            Sport health overview — participation, retention, activity, and risk signals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="indigo">
            <CalendarDays size={14} />
            Last 12 months
          </Pill>
          <Pill tone="emerald">
            <Activity size={14} />
            Live demo
          </Pill>

          {/* Sport filter */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <Filter size={16} className="text-slate-500" />
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value as SportKey)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none"
            >
              {sportOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={sportFilter === "All Sports" ? "Total Participants" : `${sportFilter} Participants`}
          value={totals.participants.toLocaleString()}
          subtitle={sportFilter === "All Sports" ? "Across all sports" : "Registered + active"}
          icon={Users}
          tone={deltaTone(totals.yoyGrowthPct)}
          deltaLabel={{ dir: totals.yoyGrowthPct >= 0 ? "up" : "down", text: `${formatPct(totals.yoyGrowthPct)} YoY` }}
        />

        <StatCard
          title="New Participants"
          value={totals.new30d.toLocaleString()}
          subtitle="Last 30 days"
          icon={UserPlus}
          tone="indigo"
          deltaLabel={{ dir: "up", text: "Pipeline" }}
        />

        <StatCard
          title="Drop-offs"
          value={totals.churn30d.toLocaleString()}
          subtitle="Last 30 days"
          icon={UserMinus}
          tone={totals.churn30d > 120 ? "amber" : "slate"}
          deltaLabel={{ dir: "down", text: "Churn" }}
        />

        <StatCard
          title="Compliance / Risks"
          value={totals.complianceFlags.toLocaleString()}
          subtitle="Open flags"
          icon={ShieldAlert}
          tone={totals.complianceFlags >= 10 ? "red" : totals.complianceFlags >= 5 ? "amber" : "emerald"}
        />
      </div>

      {/* Trends + New vs Returning */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: keep your existing line chart component */}
        <Card className="lg:col-span-7">
          <CardContent className="p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xl font-semibold text-slate-900">Participants Over Time</div>
                <div className="mt-1 text-sm text-slate-600">
                  {sportFilter === "All Sports"
                    ? "Multi-sport trend (your existing chart component)."
                    : `Trend for ${sportFilter} (extend StatsLineChart to accept sport later).`}
                </div>
              </div>
              <Pill tone="slate">
                <Trophy size={14} />
                {sportFilter}
              </Pill>
            </div>

            <div className="mt-4">
              <StatsLineChart />
            </div>
          </CardContent>
        </Card>

        {/* Right: New vs Returning (chart #1) */}
        <Card className="lg:col-span-5">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-slate-900">New vs Returning</div>
                <div className="mt-1 text-sm text-slate-600">
                  Recruitment vs retention signal (monthly, demo series).
                </div>
              </div>
              <Pill tone={totals.retentionPct >= 80 ? "emerald" : "amber"}>{totals.retentionPct}% retention</Pill>
            </div>

            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="returningParticipants" name="Returning" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="newParticipants" name="New" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-600">What to look for</div>
                <div className="mt-1 text-sm text-slate-700">
                  If new is high but returning is flat, focus on onboarding + session quality.
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-600">If returning drops</div>
                <div className="mt-1 text-sm text-slate-700">
                  Check scheduling, coach coverage, facilities, and competition structure.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison table + Distribution chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top sports table */}
        <Card className="lg:col-span-8">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-slate-900">Sports Comparison</div>
                <div className="mt-1 text-sm text-slate-600">
                  Compare participation + health indicators across sports.
                </div>
              </div>
              <Pill tone="indigo">
                <Activity size={14} />
                Snapshot
              </Pill>
            </div>

            <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Sport</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3">YoY</th>
                    <th className="px-4 py-3">New (30d)</th>
                    <th className="px-4 py-3">Drop-offs (30d)</th>
                    <th className="px-4 py-3">Retention</th>
                    <th className="px-4 py-3">Flags</th>
                    <th className="px-4 py-3">Teams</th>
                    <th className="px-4 py-3">Fixtures</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r) => {
                    const yoyTone = deltaTone(r.yoyGrowthPct);
                    const retTone = r.retentionPct >= 82 ? "emerald" : r.retentionPct >= 78 ? "amber" : "red";
                    const flagsTone = r.complianceFlags >= 3 ? "red" : r.complianceFlags >= 1 ? "amber" : "emerald";
                    const isActive = sportFilter !== "All Sports" && r.sport === sportFilter;

                    return (
                      <tr
                        key={r.sport}
                        className={classNames(
                          "border-t border-slate-200",
                          isActive ? "bg-indigo-50/40" : "bg-white"
                        )}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">{r.sport}</td>

                        <td className="px-4 py-3 text-slate-800">{r.participants.toLocaleString()}</td>

                        <td className="px-4 py-3">
                          <Pill tone={yoyTone as any}>
                            {r.yoyGrowthPct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {formatPct(r.yoyGrowthPct)}
                          </Pill>
                        </td>

                        <td className="px-4 py-3 text-slate-800">{r.new30d.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-800">{r.churn30d.toLocaleString()}</td>

                        <td className="px-4 py-3">
                          <Pill tone={retTone as any}>{r.retentionPct}%</Pill>
                        </td>

                        <td className="px-4 py-3">
                          <Pill tone={flagsTone as any}>{r.complianceFlags}</Pill>
                        </td>

                        <td className="px-4 py-3 text-slate-800">{r.activeTeams}</td>
                        <td className="px-4 py-3 text-slate-800">{r.fixturesThisMonth}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-700">
              Tip: this table becomes powerful once you wire club/league drilldowns and time-range filters.
            </div>
          </CardContent>
        </Card>

        {/* Distribution chart (chart #2) */}
        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-slate-900">Participant Mix</div>
                <div className="mt-1 text-sm text-slate-600">
                  Age-band distribution (demo) for {sportFilter}.
                </div>
              </div>
              <Pill tone="slate">{sportFilter}</Pill>
            </div>

            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="band" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Participants" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
              Use this to detect whether a sport’s pipeline is youth-heavy (good future growth) or adult-heavy (risk of
              decline without recruitment).
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watch list */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-slate-900">Support & Intervention Watch List</div>
                <div className="mt-1 text-sm text-slate-600">
                  Auto-generated from retention, growth, registrations, and compliance flags (demo rules).
                </div>
              </div>
              <Pill tone="amber">
                <TrendingDown size={14} />
                Action
              </Pill>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {watchList.map((x) => (
                <div
                  key={x.sport}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{x.sport}</div>
                      <div className="mt-1 text-sm text-slate-600">{x.note}</div>
                    </div>
                    <Pill tone={x.tone as any}>{x.tone === "red" ? "High" : x.tone === "amber" ? "Medium" : "Low"}</Pill>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 text-sm text-slate-700">
                    {x.detail}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Next steps: review sessions/fixtures, coach coverage, facilities constraints, and comms plan.
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
