import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck, UserRound, LogOut } from "lucide-react";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import PasswordForm from "@/components/auth/PasswordForm";
import SignOutButton from "@/components/auth/SignOutButton";

export const dynamic = "force-dynamic";

function roleLabel(role: string) {
  return role.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

export default async function AccountPage() {
  const { user, roles } = await getAccess();
  if (!user) redirect("/sign-in");
  if (roles.length === 0) redirect("/access-denied");

  const profile = await prisma.profiles.findUnique({
    where: { id: user.id },
    select: {
      full_name: true,
      preferred_name: true,
      email: true,
      phone: true,
      status: true,
    },
  });

  const displayName =
    profile?.preferred_name?.trim() ||
    profile?.full_name?.trim() ||
    user.email?.split("@")[0] ||
    "User";

  const homeHref = roles.includes("organisation_admin")
    ? "/organisation/home"
    : roles.includes("facilities_admin")
      ? "/facilities/home"
      : "/auth/awaiting-assignment";

  return (
    <main className="min-h-screen bg-[#f5f9ff] px-4 py-8 text-[#153763] sm:px-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-6 py-7 text-white shadow-sm sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Account</p>
              <h1 className="mt-2 text-3xl font-extrabold">My Account</h1>
              <p className="mt-2 text-sm text-blue-50">Manage your personal account, access and security.</p>
            </div>
            <Link href={homeHref} className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
              Back to WebApp
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#d5e4f6] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fd] text-[#155ca7]"><UserRound size={20} /></span>
              <div><h2 className="text-lg font-bold">Personal details</h2><p className="text-sm text-[#60799f]">Your GSLA account information.</p></div>
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="font-semibold">Name</dt><dd className="mt-1 text-[#526f98]">{displayName}</dd></div>
              <div><dt className="font-semibold">Email</dt><dd className="mt-1 text-[#526f98]">{user.email ?? profile?.email ?? "Not available"}</dd></div>
              <div><dt className="font-semibold">Phone</dt><dd className="mt-1 text-[#526f98]">{profile?.phone || "Not provided"}</dd></div>
            </dl>
          </article>

          <article className="rounded-2xl border border-[#d5e4f6] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fd] text-[#155ca7]"><ShieldCheck size={20} /></span>
              <div><h2 className="text-lg font-bold">Account access</h2><p className="text-sm text-[#60799f]">Your current WebApp access.</p></div>
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="font-semibold">Role</dt><dd className="mt-1 text-[#526f98]">{roles.map(roleLabel).join(", ")}</dd></div>
              <div><dt className="font-semibold">Account status</dt><dd className="mt-1 text-[#526f98]">{profile?.status || "Active"}</dd></div>
              {roles.includes("centre_manager") && <div><dt className="font-semibold">Venue access</dt><dd className="mt-1 text-[#526f98]">Awaiting venue assignment</dd></div>}
            </dl>
          </article>
        </section>

        <article id="security" className="rounded-2xl border border-[#d5e4f6] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fd] text-[#155ca7]"><KeyRound size={20} /></span>
            <div><h2 className="text-lg font-bold">Password & Security</h2><p className="text-sm text-[#60799f]">Change your password securely.</p></div>
          </div>
          <div className="mt-6 max-w-xl"><PasswordForm change continueHref="/account" /></div>
        </article>

        <article className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><LogOut size={20} /></span>
            <div><h2 className="text-lg font-bold">Session</h2><p className="text-sm text-[#60799f]">Sign out of this device when you have finished.</p></div>
          </div>
          <div className="mt-5"><SignOutButton tone="light" /></div>
        </article>
      </div>
    </main>
  );
}
