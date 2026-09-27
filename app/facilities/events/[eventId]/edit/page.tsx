import { notFound } from "next/navigation";
import EventEditor from "@/components/facilities/EventEditor";
import { eventExamples } from "@/components/facilities/eventExamples";

export default async function EditFacilitiesEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventExamples.find((item) => item.id === eventId);
  if (!event) notFound();
  return <EventEditor mode="edit" values={{ name: event.name, organiser: event.organiser, date: event.date, venueId: event.venueId, category: event.category }} />;
}
