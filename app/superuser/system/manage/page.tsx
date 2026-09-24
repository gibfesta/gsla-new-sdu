import DepartmentOverview from "@/components/shared/DepartmentOverview";

export default function SystemManagePage() {
  return <DepartmentOverview title="System management" description="User administration and system tools. Sport and league management belongs to Sports Development."
    links={[
      { label: "Users", href: "/superuser/users" },
      { label: "Information", href: "/superuser/system/info" },
      { label: "Mail", href: "/superuser/system/mail" },
      { label: "Import / export", href: "/superuser/system/import-export" },
      { label: "Reminders", href: "/superuser/system/reminders" },
    ]} />;
}
