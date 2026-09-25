import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { facilitiesVenues } from "./venues";

export default function VenueDetailNotice({ venueId, section }: { venueId: string; section: string }) {
  const venue = facilitiesVenues.find((item) => item.id === venueId);
  return <section className="rounded-xl border border-[#d5e4f6] bg-white p-6 text-[#112d56]"><Info size={27} className="text-[#155ca7]" aria-hidden="true" /><h1 className="mt-3 text-2xl font-bold">{section} · {venue?.name ?? "Venue"}</h1><p className="mt-3 text-sm leading-6 text-[#60799f]">This venue does not have connected {section.toLowerCase()} data yet. The detailed Europa Sports Complex pages are demonstration content and are shown only for that venue.</p><Link href={`/facilities/facilities/${venueId}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline"><ArrowLeft size={17} aria-hidden="true" />Return to venue</Link></section>;
}
