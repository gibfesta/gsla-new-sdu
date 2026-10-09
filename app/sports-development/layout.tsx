import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";

export const metadata: Metadata = { title: "Sports Development Unit | GSLA WebApp" };

export default async function DepartmentLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  // Other departmental roles are not configured yet: Organisation Admin only.
  if (!roles.includes("organisation_admin")) redirect("/access-denied");
  return children;
}
