import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, Info } from "lucide-react";
import { eventExamples } from "@/components/facilities/eventExamples";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";

export default async function ArchiveFacilitiesEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventExamples.find((item) => item.id === eventId);
  if (!event) notFound();
  return (
    <div className="space-y-4 text-[#112d56]">
      <FacilitiesDepartmentBanner title="Archive Event" description="Review the record before it is removed from the active event register." />
      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-6 shadow-sm" aria-labelledby="archive-heading">
        <div className="flex items-start gap-3"><Archive size={25} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" /><div><h2 id="archive-heading" className="text-xl font-bold">{event.name}</h2><p className="mt-1 text-sm text-[#60799f]">{event.venue} · {event.date} · {event.status}</p></div></div>
        <p className="mt-5 flex items-start gap-2 rounded-xl border border-[#cce2fc] bg-[#eef6ff] px-4 py-3 text-sm leading-6 text-[#35557f]"><Info size={18} className="mt-1 shrink-0 text-[#155ca7]" aria-hidden="true" />Archiving should retain the record for audit and allow an authorised user to restore it. This is a prototype: nothing will be archived until storage and permissions are connected.</p>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled title="Archiving is not connected" className="cursor-not-allowed rounded-xl bg-[#7c9cbe] px-5 py-2.5 text-sm font-semibold text-white">Confirm archive — not connected</button><Link href={`/facilities/events/${event.id}`} className="inline-flex items-center gap-2 rounded-xl border border-[#cfdff2] px-4 py-2.5 text-sm font-semibold text-[#155ca7] hover:bg-blue-50"><ArrowLeft size={16} aria-hidden="true" />Back to event record</Link></div>
      </section>
    </div>
  );
}
