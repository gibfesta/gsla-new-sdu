import DepartmentOverview from "@/components/shared/DepartmentOverview";
import Link from "next/link";

export default function HomePage() {
  return <>
    <DepartmentOverview title="Choose Your Department" description="The system is organised into four main departments. Select the area you want to enter."
      links={[
        { label: "Facilities Department", href: "/facilities/dashboard", detail: "Bookings, issues, inspections and operations" },
        { label: "Finance & Accounts Department", href: "/finance/dashboard", detail: "Payroll, exports, approvals and reporting · planned" },
        { label: "Sports Development Unit Department", href: "/sports-development/dashboard", detail: "Sports, associations, leagues and governance" },
        { label: "Human Resources Department", href: "/human-resources/dashboard", detail: "Employees, leave and timesheets" },
      ]} />
    <p className="mt-10 text-center text-sm text-slate-600"><Link className="font-semibold text-[#0C2F57] underline" href="/superuser/dashboard">Superuser dashboard</Link></p>
  </>;
}
