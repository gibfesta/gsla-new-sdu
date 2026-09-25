import SharedCalendarBoard from "@/components/facilities/SharedCalendarBoard";

// Render the current Gibraltar date on each request, rather than freezing it at build time.
export const dynamic = "force-dynamic";

export default function SharedCalendarPage() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Gibraltar", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  return <SharedCalendarBoard initialDate={today} />;
}
