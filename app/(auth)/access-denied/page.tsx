import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { getAccess } from "@/lib/auth/access";

export default async function AccessDeniedPage() {
  const { user, roles } = await getAccess();
  const destination = !user ? "/sign-in" : roles.includes("organisation_admin") ? "/organisation/home" : roles.includes("facilities_admin") ? "/facilities/home" : "/sign-in";
  const label = !user ? "Go to sign in" : roles.includes("organisation_admin") ? "Back to Organisation Home" : roles.includes("facilities_admin") ? "Back to Facilities Home" : "Return to sign in";
  return <AuthCard title="Access restricted">
    <p className="text-sm text-slate-600">Your account does not have permission to view this department. Contact your GSLA administrator if you believe this is incorrect.</p>
    <Link href={destination} className="block text-center text-sm font-semibold text-blue-700 underline">{label}</Link>
  </AuthCard>;
}
