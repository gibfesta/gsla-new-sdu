import Link from "next/link";
import { loadFormRegister } from "@/lib/form-control/register.server";
import SignOutButton from "@/components/auth/SignOutButton";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function FormControlPage() {
  const register = loadFormRegister();
  return <main className="mx-auto max-w-5xl p-6">
    <header className="flex items-center justify-between gap-4">
      <div><p className="text-sm font-semibold">Owner / System Control</p><h1 className="text-3xl font-bold">Form Control</h1></div>
      <SignOutButton tone="light" />
    </header>
    <p className="mt-6 text-sm">{register.coverageNote}</p>
    <p className="mt-4 text-sm">Recorded forms: {register.forms.length}. This is a metadata register, not a form submission system.</p>
    <p className="mt-4"><Link href="/api/owner/form-control/export" className="underline">Export metadata CSV</Link></p>
    <ul className="mt-6 space-y-3">{register.forms.map(form =>
      <li key={form.formId}><Link className="underline" href={`/owner/form-control/${encodeURIComponent(form.formId)}`}>{form.displayName}</Link> — {form.area} — {form.connectionStatus}</li>)}</ul>
  </main>;
}
