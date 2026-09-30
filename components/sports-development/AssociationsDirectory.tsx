"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List, UsersRound } from "lucide-react";
import { associationsChecked, associationsSource, directoryAssociations } from "./associationsDirectory";

export default function AssociationsDirectory() {
  const [view, setView] = useState<"cards" | "list">("list");
  return <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 text-[#112d56] shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-bold">Sports &amp; Leisure Associations</h2><p className="mt-1 text-sm text-[#60799f]">{directoryAssociations.length} associations listed in the GSLA directory.</p></div>
      <div className="flex gap-1" role="group" aria-label="Associations view">
        {(["cards", "list"] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === option ? "bg-[#0C2F57] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{option === "cards" ? <LayoutGrid size={16} aria-hidden="true" /> : <List size={16} aria-hidden="true" />}{option === "cards" ? "Card view" : "List view"}</button>)}
      </div>
    </div>
    {view === "list" ? <div className="mt-5 overflow-x-auto"><table className="gsla-data-table min-w-[680px]">
      <thead><tr><th scope="col">Association</th><th scope="col">Published email</th><th scope="col">Record</th></tr></thead>
      <tbody>{directoryAssociations.map((association) => <tr key={association.slug}>
        <td><strong className="font-semibold">{association.name}</strong></td>
        <td className="max-w-[260px] break-words text-[#526f98]">{association.email || "Not listed"}</td>
        <td><Link href={`/sports-development/sports/${association.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-[#155ca7] hover:underline">Open association <ArrowRight size={15} aria-hidden="true" /></Link></td>
      </tr>)}</tbody>
    </table></div> : <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{directoryAssociations.map((association) => <article key={association.slug} className="flex flex-col rounded-xl border border-[#d5e4f6] p-5">
      <UsersRound size={24} className="text-[#155ca7]" aria-hidden="true" /><h3 className="mt-3 font-bold">{association.name}</h3>
      <p className="mt-2 break-words text-sm text-[#60799f]">{association.email || "Email not listed"}</p>
      <Link href={`/sports-development/sports/${association.slug}`} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-[#155ca7] hover:underline">Open association <ArrowRight size={15} aria-hidden="true" /></Link>
    </article>)}</div>}
    <p className="mt-5 text-xs leading-5 text-[#60799f]">Source: <a href={associationsSource} target="_blank" rel="noreferrer" className="font-semibold text-[#155ca7] hover:underline">GSLA Sports &amp; Leisure Directory</a> · Checked {associationsChecked}.</p>
  </section>;
}
