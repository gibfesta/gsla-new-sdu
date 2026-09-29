import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, UsersRound } from "lucide-react";
import { eventExamples } from "@/components/facilities/eventExamples";
import { facilitiesVenues } from "@/components/facilities/venues";
import VenueBanner from "@/components/facilities/VenueBanner";

export default async function VenueEventPage({ params }: { params: Promise<{ facilityId: string; eventId: string }> }) {
  const { facilityId, eventId } = await params;
  const venue = facilitiesVenues.find((item) => item.id === facilityId);
  const event = eventExamples.find((item) => item.id === eventId && item.venueId === facilityId);
  if (!venue || !event) notFound();

  const venueEvents = `/facilities/facilities-directory/${facilityId}?tab=events`;
  return <div className="space-y-5 text-[#112d56]">
    <VenueBanner className="px-6 pb-8 pt-16 sm:px-8 sm:pt-14">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Venue event · {venue.name}</p>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{event.name}</h1>
      <p className="mt-3 text-blue-100">On-site event information for the Centre Manager workspace.</p>
    </VenueBanner>

    <Link href={venueEvents} className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline"><ArrowLeft size={16} aria-hidden="true" />Back to {venue.name} Events</Link>

    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="venue-event-heading">
      <h2 id="venue-event-heading" className="text-xl font-bold">Event at your venue</h2>
      <p className="mt-1 text-sm text-[#60799f]">Historical demonstration record. Live scheduling and on-site tasks are not connected yet.</p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Date", value: event.date, icon: CalendarDays },
          { label: "Venue", value: venue.name, icon: MapPin },
          { label: "Organiser", value: event.organiser, icon: UsersRound },
          { label: "Venue impact", value: event.impact, icon: CalendarDays },
          { label: "Category", value: event.category, icon: CalendarDays },
          { label: "Status", value: event.status, icon: CalendarDays },
        ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-[#d5e4f6] bg-[#f8fbff] p-4"><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#60799f]"><Icon size={15} aria-hidden="true" />{label}</dt><dd className="mt-2 font-semibold">{value}</dd></div>)}
      </dl>
    </section>
    <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold">On-site delivery</h2>
      <p className="mt-2 text-sm text-[#60799f]">Preparation, venue checks and handover tasks for this event will appear here when venue records are connected.</p>
    </section>
  </div>;
}
