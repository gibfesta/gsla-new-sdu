import { checkOperationalOwner } from "@/lib/server/owner-access";
import { redirect } from "next/navigation";
import { loadFormRegister } from "@/lib/form-control/register.server";
import OwnerFrame from "@/components/form-control/OwnerFrame";
import FormControlRegister from "@/components/form-control/FormControlRegister";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function FormControlPage() {
  if (!(await checkOperationalOwner()).allowed) redirect("/access-denied");
  const register = loadFormRegister();
  const deploymentDiffers = Boolean(process.env.VERCEL_GIT_COMMIT_SHA && process.env.VERCEL_GIT_COMMIT_SHA !== register.sourceCommit);
  return <OwnerFrame><FormControlRegister register={register} deploymentDiffers={deploymentDiffers}/></OwnerFrame>;
}
