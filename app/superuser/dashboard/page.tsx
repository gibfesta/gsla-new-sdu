import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function SuperuserDashboard() {
  return <DepartmentOverview title="GSLA · Superuser" description="Four departments and system health."
    links={[
      { label: "Facilities", href: "/facilities/dashboard" },
      { label: "Human Resources", href: "/human-resources/dashboard" },
      { label: "Sports Development Unit", href: "/sports-development/dashboard" },
      { label: "Finance", href: "/finance/dashboard", detail: "Planned workflows" },
      { label: "Health Dashboard", href: "/superuser/health", detail: "Monitoring integration planned" },
    ]} />;
}
