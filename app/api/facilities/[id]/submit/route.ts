import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
 const access = await getAccess();
 if (!access.user) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers });
 if (!access.roles.includes("organisation_admin") && !access.roles.includes("facilities_admin"))
  return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers });
 const { id } = await params;
 if (!uuid.test(id)) return NextResponse.json({ error: "Invalid Facility ID" }, { status: 400, headers });
 let body: unknown;
 try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers }); }
 if (!body || typeof body !== "object" || Array.isArray(body))
  return NextResponse.json({ error: "Invalid request" }, { status: 400, headers });
 const { expectedVersion, commandId } = body as { expectedVersion?: unknown; commandId?: unknown };
 if (!Number.isSafeInteger(expectedVersion) || (expectedVersion as number) < 1 ||
     typeof commandId !== "string" || !uuid.test(commandId))
  return NextResponse.json({ error: "Expected record version and command UUID required" }, { status: 400, headers });
 try {
  const result = await prisma.$transaction(async tx => {
   // Row lock prevents concurrent submissions racing through the version check.
   const facilities = await tx.$queryRaw<Array<{ id:string; approval_state:string; lifecycle_state:string; record_version:number; content_version:number; pending_request_id:string|null }>>`
     SELECT id,approval_state,lifecycle_state,record_version,content_version,pending_request_id
     FROM public."Facilities Table" WHERE id=${id}::uuid FOR UPDATE
   `;
   // A repeated HTTP request must not create a second approval request.
   // A command UUID is bound to the original facility and submitting actor.
   const prior = await tx.facility_requests.findUnique({ where: { command_id: commandId } });
   if (prior) {
     if (prior.facility_id !== id || prior.submitted_by !== access.user!.id || prior.kind !== "INITIAL_APPROVAL")
       return { status:409, error:"Command ID already belongs to another submission" };
     return { status:200, requestId:prior.id, state:prior.state==="PENDING"?"PENDING_APPROVAL":prior.state };
   }
   const facility = facilities[0];
   if (!facility) return { status:404, error:"Facility not found" };
   if (facility.record_version !== expectedVersion) return { status:409, error:"Facility has changed. Reload before submitting." };
   if (facility.approval_state !== "DRAFT" || facility.lifecycle_state !== "ACTIVE" || facility.pending_request_id)
    return { status:409, error:"Facility is not an available draft" };
   const snapshot = await tx.facilities_Table.findUnique({ where:{ id } });
   if (!snapshot) return { status:404, error:"Facility not found" };
   if (!snapshot.name.trim() || !snapshot.address.trim() || !["Operational","Limited","Closed"].includes(snapshot.status))
    return { status:422, error:"Complete Facility name, address and valid operational status before submission" };
   const decision = await tx.facility_requests.create({
    data:{
     facility_id:id,kind:"INITIAL_APPROVAL",state:"PENDING",
     submitted_content_version:facility.content_version,
     snapshot:JSON.parse(JSON.stringify(snapshot)),
     validation_version:"phase1-v1",
     submitted_by:access.user!.id,
     command_id:commandId,
    },
   });
   await tx.facilities_Table.update({
    where:{id},
    data:{approval_state:"PENDING_APPROVAL",pending_request_id:decision.id,record_version:{increment:1}},
   });
   await tx.facility_audit_events.create({
    data:{
     facility_id:id,request_id:decision.id,action:"SUBMIT_INITIAL_APPROVAL",
     after_state:{approvalState:"PENDING_APPROVAL",requestId:decision.id},
     record_version:facility.record_version+1,content_version:facility.content_version,
     actor_id:access.user!.id,actor_role:access.roles.includes("organisation_admin")?"organisation_admin":"facilities_admin",
     command_id:crypto.randomUUID(),validation_version:"phase1-v1",
    },
   });
   return { status:201, requestId:decision.id, state:"PENDING_APPROVAL" };
  });
  return NextResponse.json((result.status===201||result.status===200)?{requestId:result.requestId,state:result.state}:{error:result.error},{status:result.status,headers});
 } catch (error) {
  console.error("Submit Facility for approval failed",error);
  return NextResponse.json({error:"Could not submit Facility for approval"},{status:500,headers});
 }
}
