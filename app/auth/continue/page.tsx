import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";

export default async function ContinueAfterLogin() {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  if (roles.includes("organisation_admin")) redirect("/organisation/home");
  if (roles.includes("facilities_admin")) redirect("/facilities/home");
  // Centre Manager venue access will be enabled once assignments are enforced.
  redirect("/access-denied");
}
