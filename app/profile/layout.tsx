import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  if (roles.length === 0) redirect("/access-denied");
  return children;
}
