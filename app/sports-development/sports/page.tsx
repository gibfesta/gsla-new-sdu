import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function SportsDirectory() {
  return <DepartmentOverview title="Sports" description="Current sport workspace demonstrations. A live sports directory is planned."
    links={[{ label: "Hockey", href: "/sports-development/sports/hockey" }]} />;
}
