import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
 const access = await getAccess();
 if (!access.user) return NextResponse.json({error:"Sign in required"},{status:401,headers});
 if (!access.roles.includes("organisation_admin"))
  return NextResponse.json({error:"Organisation Administrator approval required"},{status:403,headers});
 const {id}=await params;
 if (!uuid.test(id)) return NextResponse.json({error:"Invalid Facility ID"},{status:400,headers});
 let body: unknown;
 try {body=await request.json();}catch{return NextResponse.json({error:"Invalid JSON"},{status:400,headers});}
 if (!body || typeof body!=="object" || Array.isArray(body))
  return NextResponse.json({error:"Invalid request"},{status:400,headers});
 const b=body as Record<string,unknown>;
 if (!["APPROVED","REJECTED","RETURNED"].includes(String(b.decision)) ||
     typeof b.requestId!=="string" || !uuid.test(b.requestId) ||
     !Number.isSafeInteger(b.expectedVersion) || (b.expectedVersion as number)<1 ||
     (b.decision!=="APPROVED" && (typeof b.reason!=="string" || !b.reason.trim())))
  return NextResponse.json({error:"Decision, request ID, version and any required reason are invalid"},{status:400,headers});
 try {
  const result=await prisma.$transaction(async tx=>{
   const rows=await tx.$queryRaw<Array<{id:string;approval_state:string;record_version:number;content_version:number;pending_request_id:string|null}>>`
    SELECT id,approval_state,record_version,content_version,pending_request_id
    FROM public."Facilities Table" WHERE id=${id}::uuid FOR UPDATE
   `;
   const f=rows[0];
   if(!f)return {status:404,error:"Facility not found"};
   if(f.record_version!==b.expectedVersion || f.approval_state!=="PENDING_APPROVAL" || f.pending_request_id!==b.requestId)
    return {status:409,error:"Facility or pending request has changed"};
   const pending=await tx.facility_requests.findUnique({where:{id:b.requestId as string}});
   if(!pending || pending.facility_id!==id || pending.kind!=="INITIAL_APPROVAL" || pending.state!=="PENDING" ||
      pending.submitted_content_version!==f.content_version)
    return {status:409,error:"Request is no longer eligible for decision"};
   const approved=b.decision==="APPROVED";
   const nextState=approved?"APPROVED":b.decision==="REJECTED"?"REJECTED":"CHANGES_REQUESTED";
   await tx.facility_requests.update({
    where:{id:pending.id},
    data:{state:b.decision as string,request_version:{increment:1},decided_by:access.user!.id,decided_at:new Date(),decision_reason:typeof b.reason==="string"?b.reason.trim():null},
   });
   await tx.facilities_Table.update({
    where:{id},data:{
     approval_state:nextState,pending_request_id:null,
     ...(approved?{approved_content_version:f.content_version,initial_approval_request_id:pending.id}:{}),
     record_version:{increment:1},
    },
   });
   await tx.facility_audit_events.create({data:{
    facility_id:id,request_id:pending.id,action:"DECIDE_INITIAL_APPROVAL",
    after_state:{approvalState:nextState,requestId:pending.id},
    record_version:f.record_version+1,content_version:f.content_version,
    actor_id:access.user!.id,actor_role:"organisation_admin",
    command_id:crypto.randomUUID(),reason:typeof b.reason==="string"?b.reason.trim():null,
   }});
   return {status:200,state:nextState};
  });
  return NextResponse.json(result.status===200?{state:result.state}:{error:result.error},{status:result.status,headers});
 }catch(error){
  console.error("Facility approval decision failed",error);
  return NextResponse.json({error:"Could not record approval decision"},{status:500,headers});
 }
}
