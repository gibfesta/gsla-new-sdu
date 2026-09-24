import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function HomePage() {
  return <DepartmentOverview title="GSLA WebApp" description="Choose a department or open the Superuser area."
    links={[
      { label: "Facilities", href: "/facilities/dashboard" },
      { label: "Human Resources", href: "/human-resources/dashboard" },
      { label: "Sports Development Unit", href: "/sports-development/dashboard" },
      { label: "Finance", href: "/finance/dashboard", detail: "Planned workflows" },
      { label: "Superuser", href: "/superuser/dashboard" },
    ]} />;
}
