"use client";

import { MapPin, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { facilitiesVenues } from "./venues";

export default function FacilitiesHeader() {
  const pathname = usePathname();
  const venueId = pathname.match(/^\/facilities\/facilities\/(fac-[0-9]{3})(?:\/|$)/)?.[1];
  const venue = facilitiesVenues.find((item) => item.id === venueId);
  return (
    <header className="border-b border-[#e0e9f5] bg-white px-4 py-3 sm:px-6 lg:py-4">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-11 min-w-[220px] items-center gap-3 rounded-xl border border-[#cfdff2] bg-white px-4 text-sm text-[#64748b] shadow-sm sm:w-[375px]" aria-label="Facilities search is coming soon">
          <Search size={19} className="text-[#174a84]" aria-hidden="true" />
          Search coming soon
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex min-h-11 items-center gap-2 rounded-xl border border-[#cfdff2] bg-white px-4 text-sm font-semibold text-[#16365f] shadow-sm">
            <MapPin size={18} aria-hidden="true" /> {venue?.name ?? "All Facilities"}
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315d90] text-sm font-bold text-white" aria-label="Facilities account">GS</span>
          <span className="hidden text-sm font-medium text-[#16365f] sm:inline">GSLA</span>
        </div>
      </div>
    </header>
  );
}
