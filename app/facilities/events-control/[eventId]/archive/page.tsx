"use client";
import Link from "next/link";
import { use } from "react";
import { useEventRecords, eventRegisterEntry } from "@/lib/eventPageStore";
import { Archive, ArrowLeft, Info } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

export default function ArchiveFacilitiesEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { records, ready } = useEventRecords();
  if (!ready) return <p role="status">Loading event…</p>;
  const record = records.find(item => item.id === eventId);
  if (!record) return <div className="space-y-4"><FacilitiesDepartmentBanner title="Archive Event" description="Review the record before it is removed from the active event register."/><p>Event not found.</p><Link href="/facilities/events-control">Back to Events Control</Link></div>;
  const event = eventRegisterEntry(record);
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Archive Event" description="Review the record before it is removed from the active event register." />
      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-6 shadow-sm" aria-labelledby="archive-heading">
        <div className="flex items-start gap-3"><Archive size={25} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><div><h2 id="archive-heading" className="text-xl font-bold">{event.name}</h2><p className="mt-1 text-sm text-[#60799f]">{event.venue} · {event.date} · {event.status}</p></div></div>
        <p className="mt-5 flex items-start gap-2 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" />Archiving should retain the record for audit and allow an authorised user to restore it. This is a prototype: nothing will be archived until storage and permissions are connected.</p>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled title="Archiving is not connected" className="cursor-not-allowed rounded-xl bg-[#7c9cbe] px-5 py-2.5 text-sm font-semibold text-white">Confirm archive — not connected</button><Link href={`/facilities/events-control/${event.id}`} className="inline-flex items-center gap-2 rounded-xl border border-[#cfdff2] px-4 py-2.5 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><ArrowLeft size={16} aria-hidden="true" />Back to event record</Link></div>
      </section>
    </div>
  );
}
