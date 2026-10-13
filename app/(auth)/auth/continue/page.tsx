import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";
import { checkOperationalOwner } from "@/lib/server/owner-access";

export default async function ContinueAfterLogin() {
  const owner = await checkOperationalOwner();
  if (owner.allowed) redirect("/owner/form-control");
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  if (roles.includes("organisation_admin")) redirect("/organisation/home");
  if (roles.includes("facilities_admin")) redirect("/facilities/home");
  if (roles.includes("centre_manager")) redirect("/auth/awaiting-assignment");
  redirect("/access-denied");
}
