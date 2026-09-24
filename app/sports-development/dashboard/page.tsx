import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function SportsDevelopmentDashboard() {
  return <DepartmentOverview title="Sports Development Unit" badge="GSLA SDU" sectionTitle="Sports Development Areas" description="Sports, associations, leagues and participation."
    links={[
      { label: "Sports", href: "/sports-development/sports" },
      { label: "Association forms", href: "/sports-development/associations/forms" },
      { label: "Leagues", href: "/sports-development/leagues" },
      { label: "Teams", href: "/sports-development/teams" },
      { label: "Reports", href: "/sports-development/reports" },
    ]} />;
}
