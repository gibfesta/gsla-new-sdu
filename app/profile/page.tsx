import { redirect } from "next/navigation";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  if (roles.length === 0) redirect("/access-denied");
  const profile = await prisma.profiles.findUnique({ where: { id: user.id }, select: { full_name: true, preferred_name: true, email: true, phone: true, status: true } });
  const name = profile?.preferred_name?.trim() || profile?.full_name?.trim() || "User Profile";
  return <main className="min-h-screen bg-[#f5f9ff] px-5 py-10 text-[#153763]">
    <section className="mx-auto max-w-2xl rounded-2xl border border-[#d5e4f6] bg-white p-7 shadow-sm">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-2 text-sm text-[#526f98]">Your account details from the GSLA database.</p>
      <dl className="mt-7 space-y-4 text-sm">
        <div><dt className="font-semibold">Display name</dt><dd className="mt-1">{name}</dd></div>
        <div><dt className="font-semibold">Email</dt><dd className="mt-1">{user.email ?? "Not available"}</dd></div>
        <div><dt className="font-semibold">Role</dt><dd className="mt-1">{roles.map(role => role.replaceAll("_", " ")).join(", ")}</dd></div>
        <div><dt className="font-semibold">Phone</dt><dd className="mt-1">{profile?.phone || "Not provided"}</dd></div>
      </dl>
    </section>
  </main>;
}
