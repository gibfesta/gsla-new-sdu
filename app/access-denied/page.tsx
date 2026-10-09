import Link from "next/link";
export default function AccessDeniedPage() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
    <section className="max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#0C2F57]">Access restricted</h1>
      <p className="mt-3 text-slate-600">Your account does not have permission to view this department. Contact your GSLA administrator if you believe this is incorrect.</p>
      <Link href="/sign-in" className="mt-5 inline-block text-blue-700 underline">Return to sign in</Link>
    </section>
  </main>;
}
