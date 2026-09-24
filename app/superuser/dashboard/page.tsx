import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function SuperuserDashboard() {
  return <DepartmentOverview title="Superuser Dashboard" badge="GSLA Superuser" sectionTitle="Departments & System Health" description="Choose a department or view system health."
    links={[
      { label: "Facilities Department", href: "/facilities/dashboard", detail: "Venues, bookings and daily operations" },
      { label: "Human Resources Department", href: "/human-resources/dashboard", detail: "Employees, leave and timesheets" },
      { label: "Sports Development Unit", href: "/sports-development/dashboard", detail: "Sports, associations and programmes" },
      { label: "Finance Department", href: "/finance/dashboard", detail: "Financial workflows planned" },
      { label: "Health Dashboard", href: "/superuser/health", detail: "Monitoring integration planned" },
    ]} />;
}
