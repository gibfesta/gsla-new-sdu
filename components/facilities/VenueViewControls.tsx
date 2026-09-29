"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";

export type VenueView = "cards" | "list";

export const venueTabs = [
  { key: "handover", label: "Daily Handover" },
  { key: "information", label: "Information" },
  { key: "issues", label: "Issues" },
  { key: "timeline", label: "Timeline" },
  { key: "events", label: "Venue Events" },
  { key: "bookings", label: "Bookings / Calendar" },
  { key: "procedures", label: "Opening / Closing" },
  { key: "weekly", label: "Weekly Tasks" },
  { key: "monthly", label: "Monthly Tasks" },
  { key: "documents", label: "Documents / SOPs" },
  { key: "photos", label: "Photo Log" },
  { key: "compliance", label: "Compliance" },
  { key: "audit", label: "Audit Trail" },
] as const;

export default function VenueViewControls({ venueId, activeTab, view, onViewChange }: {
  venueId: string;
  activeTab: string;
  view: VenueView;
  onViewChange: (view: VenueView) => void;
}) {
  return <div className="flex flex-wrap items-center justify-between gap-3">
    <nav aria-label="Venue sections" className="min-w-0 flex-1 overflow-x-auto">
      <div className="inline-flex min-w-max gap-1 rounded-2xl bg-slate-100 p-1">
        {venueTabs.map(({ key, label }) => <Link key={key} href={`/facilities/facilities-directory/${venueId}?tab=${key}`} aria-current={activeTab === key ? "page" : undefined} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === key ? "bg-white text-[#112d56] shadow-sm" : "text-slate-700 hover:bg-white/70"}`}>{label}</Link>)}
      </div>
    </nav>
    <div className="flex gap-1" role="group" aria-label="Venue view">
      {(["cards", "list"] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => onViewChange(option)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === option ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{option === "cards" ? <LayoutGrid size={16} aria-hidden="true" /> : <List size={16} aria-hidden="true" />}{option === "cards" ? "Card view" : "List view"}</button>)}
    </div>
  </div>;
}
