import EventEditor from "@/components/facilities/EventEditor";

export default async function EditFacilitiesEventPage({ params }: { params: Promise<{ eventId: string }> }) {
 const { eventId } = await params;
 return <EventEditor mode="edit" eventId={eventId}/>;
}
