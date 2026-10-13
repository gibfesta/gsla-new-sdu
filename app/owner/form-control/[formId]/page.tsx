import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { checkOperationalOwner } from "@/lib/server/owner-access";
import { findForm, loadFormRegister } from "@/lib/form-control/register.server";
import OwnerFrame from "@/components/form-control/OwnerFrame";
import FormInspector from "@/components/form-control/FormInspector";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function FormControlDetail({params}:{params:Promise<{formId:string}>}) {
  if (!(await checkOperationalOwner()).allowed) redirect("/access-denied");
  const form = findForm((await params).formId);
  if (!form) notFound();
  const register = loadFormRegister();
  const allowedRoutes = register.sourceLedger?.flatMap(item=>item.route?[item.route]:[])||[];
  return <OwnerFrame title={form.displayName}><Link href="/owner/form-control" className="inline-block text-sm font-semibold text-[#155ca7] underline">Back to Form Control</Link><FormInspector form={form} allowedRoutes={allowedRoutes}/></OwnerFrame>;
}
