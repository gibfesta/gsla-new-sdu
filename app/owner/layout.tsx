import { redirect } from "next/navigation";
import { checkOperationalOwner } from "@/lib/server/owner-access";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function OwnerLayout({children}:{children:React.ReactNode}) {
  const check = await checkOperationalOwner();
  if (!check.allowed) {
    if (check.status === 401) redirect("/sign-in");
    if (check.status === 503) redirect("/access-denied");
    redirect("/access-denied");
  }
  return <>{children}</>;
}
