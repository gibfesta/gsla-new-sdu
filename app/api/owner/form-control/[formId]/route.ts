import { NextResponse } from "next/server";
import { requireOperationalOwner, ownerResponseHeaders } from "@/lib/server/owner-access";
import { findForm } from "@/lib/form-control/register.server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(_req: Request, {params}: {params: Promise<{formId:string}>}) {
  const denied = await requireOperationalOwner();
  if (denied) return denied;
  try {
    const record = findForm((await params).formId);
    return record ? NextResponse.json(record,{headers:ownerResponseHeaders}) :
      NextResponse.json({error:"Not found"},{status:404,headers:ownerResponseHeaders});
  } catch {
    return NextResponse.json({error:"Register unavailable"},{status:503,headers:ownerResponseHeaders});
  }
}
