"use client";

import { usePathname } from "next/navigation";

type Department = "sports-development" | "human-resources" | "finance";

const descriptions: Record<Department, Record<string, [string, string]>> = {
  "sports-development": {
    sports: ["Sports & Associations", "Explore the sports, associations and people in the GSLA workspace."],
    reports: ["Participation Statistics", "Review participation, retention and activity across sports."],
    teams: ["Teams", "Manage association teams and their league assignments."],
    leagues: ["Leagues", "Organise competitions and the teams taking part."],
    "associations/forms": ["Forms", "Manage association registrations, annual submissions and funding applications."],
    "associations/registration": ["Annual Association Registration", "Complete the annual registration for your association."],
    "associations/form-b": ["Financial Assistance Application", "Prepare and review your funding application."],
    "associations/form-c": ["Results & Outcomes", "Record the outcomes of a funded project."],
  },
  "human-resources": {
    employees: ["Employees", "View employee records and manage your people workspace."],
    leave: ["Leave Management", "Review leave requests and staff availability."],
    timesheets: ["Timesheets", "Manage timesheets and payroll week packs."],
    "timesheets/weeks": ["Weeks Inbox", "Review and manage facility payroll week packs."],
    "timesheets/settings": ["Timesheet Settings", "Review the rules and reason codes used for timesheets."],
  },
  finance: {},
};

function titleCase(segment: string) {
  return decodeURIComponent(segment).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DepartmentPageFrame({ department, children }: { department: Department; children: React.ReactNode }) {
  const pathname = usePathname();
  const route = pathname.slice(`/${department}/`.length).replace(/\/$/, "");
  if (!route || route === "dashboard") return <>{children}</>;

  const parts = route.split("/");
  const known = descriptions[department][route];
  const isSportDetail = department === "sports-development" && parts[0] === "sports" && parts.length > 2;
  const isWeekDetail = department === "human-resources" && parts[0] === "timesheets" && parts[1] === "weeks" && parts.length > 2;
  const hasRecordHeading = (department === "sports-development" && ((parts[0] === "sports" && parts.length > 1) || (parts[0] === "leagues" && parts.length > 1 && parts[1] !== "add"))) || (department === "human-resources" && parts[0] === "employees" && parts.length > 1);
  const title = known?.[0] ?? (isSportDetail ? `${titleCase(parts[1])} ${titleCase(parts[2])}` : isWeekDetail ? "Week Pack" : hasRecordHeading ? parts[0] === "employees" ? "Employee Profile" : parts[0] === "leagues" ? "League Workspace" : `${titleCase(parts[1])} Overview` : parts.at(-1) === "add" ? `Add ${titleCase(parts.at(-2) ?? "Record")}` : titleCase(parts.at(-1) ?? "Overview"));
  const description = known?.[1] ?? (department === "sports-development" ? "Explore and manage Sports Development Unit activity." : department === "human-resources" ? "View and manage Human Resources records." : "Review Finance Department activity.");
  const name = department === "sports-development" ? "Sports Development Unit" : department === "human-resources" ? "Human Resources" : "Finance Department";
  const section = parts.length > 1 ? titleCase(parts[0]) : "Department Workspace";

  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA {name} · {section}</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">{description}</p></div>
          <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">One workspace<br />Stronger communities</p>
        </div>
      </section>
      <div className={`department-page-content${route === "sports" ? " department-page-overview" : ""}${hasRecordHeading ? " department-page-detail" : ""}`}>{children}</div>
    </div>
  );
}
