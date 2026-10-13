import { notFound } from "next/navigation";
import Link from "next/link";
import { findForm } from "@/lib/form-control/register.server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function FormControlDetail({params}:{params:Promise<{formId:string}>}) {
  const form = findForm((await params).formId);
  if (!form) notFound();
  return <main className="mx-auto max-w-5xl p-6">
    <Link href="/owner/form-control" className="underline">Back to Form Control</Link>
    <h1 className="mt-6 text-3xl font-bold">{form.displayName}</h1>
    <dl className="mt-6 space-y-3">
      <div><dt>Area</dt><dd>{form.area}</dd></div>
      <div><dt>Connection</dt><dd>{form.connectionStatus}</dd></div>
      <div><dt>Operational status</dt><dd>{form.operationalStatus}</dd></div>
    </dl>
    <ul className="mt-5">{form.locations.map((loc,i)=><li key={i}>{loc.route} — {loc.mode}</li>)}</ul>
  </main>;
}
