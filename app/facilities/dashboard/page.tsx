import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function FacilitiesDashboard() {
  return <DepartmentOverview title="Facilities" badge="GSLA Facilities" sectionTitle="Facilities Areas" description="Venues, bookings and shared operations."
    links={[
      { label: "Facilities directory", href: "/facilities/facilities" },
      { label: "Bookings", href: "/facilities/bookings", detail: "Current demonstration screen" },
      { label: "Shared calendar", href: "/facilities/shared-calendar", detail: "Current demonstration screen" },
      { label: "Events", href: "/facilities/events", detail: "Current demonstration screen" },
    ]} />;
}
