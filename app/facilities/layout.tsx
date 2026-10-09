import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";

export const metadata: Metadata = { title: "Facilities | GSLA WebApp" };

export default async function DepartmentLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  // Centre Managers require a facility-assignment model before venue access is enabled.
  if (!roles.includes("organisation_admin") && !roles.includes("facilities_admin")) redirect("/access-denied");
  return children;
}
