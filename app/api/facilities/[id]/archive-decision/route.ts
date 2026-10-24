import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 const access=await getAccess();
 if(!access.user)return NextResponse.json({error:"Sign in required"},{status:401,headers});
 if(!access.roles.includes("organisation_admin"))return NextResponse.json({error:"Organisation Administrator required"},{status:403,headers});
 const {id}=await params;if(!uuid.test(id))return NextResponse.json({error:"Invalid Facility ID"},{status:400,headers});
 let input:unknown;try{input=await request.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400,headers})}
 if(!input||typeof input!=="object"||Array.isArray(input))return NextResponse.json({error:"Invalid request"},{status:400,headers});
 const b=input as Record<string,unknown>;
 if(!["APPROVED","REJECTED"].includes(String(b.decision))||typeof b.requestId!=="string"||!uuid.test(b.requestId)||
   !Number.isSafeInteger(b.expectedVersion)||(b.expectedVersion as number)<1||
   (b.decision==="REJECTED"&&(typeof b.reason!=="string"||!b.reason.trim())))
 return NextResponse.json({error:"Invalid archival decision, request ID, version or reason"},{status:400,headers});
 try{
 const outcome=await prisma.$transaction(async tx=>{
  const rows=await tx.$queryRaw<Array<{id:string;approval_state:string;lifecycle_state:string;record_version:number;content_version:number;pending_request_id:string|null}>>`
   SELECT id,approval_state,lifecycle_state,record_version,content_version,pending_request_id
   FROM public."Facilities Table" WHERE id=${id}::uuid FOR UPDATE`;
  const f=rows[0];if(!f)return {status:404,error:"Facility not found"};
  if(f.approval_state!=="APPROVED"||f.lifecycle_state!=="ACTIVE"||f.record_version!==b.expectedVersion||f.pending_request_id!==b.requestId)
   return {status:409,error:"Facility or archival request changed"};
  const req=await tx.facility_requests.findUnique({where:{id:b.requestId as string}});
  if(!req||req.facility_id!==id||req.kind!=="ARCHIVE"||req.state!=="PENDING"||req.submitted_content_version!==f.content_version)
   return {status:409,error:"Archival request not eligible"};
  const approved=b.decision==="APPROVED";
  await tx.facility_requests.update({where:{id:req.id},data:{
   state:approved?"APPROVED":"REJECTED",request_version:{increment:1},
   decided_by:access.user!.id,decided_at:new Date(),
   decision_reason:typeof b.reason==="string"?b.reason.trim():null
  }});
  const updated=await tx.facilities_Table.update({where:{id},data:{
   lifecycle_state:approved?"ARCHIVED":"ACTIVE",pending_request_id:null,record_version:{increment:1},
   ...(approved?{archived_at:new Date(),archived_by:access.user!.id}:{})
  }});
  await tx.facility_audit_events.create({data:{
   facility_id:id,request_id:req.id,action:approved?"APPROVE_ARCHIVE":"REJECT_ARCHIVE",
   after_state:{approvalState:"APPROVED",lifecycleState:updated.lifecycle_state},
   record_version:f.record_version+1,content_version:f.content_version,
   actor_id:access.user!.id,actor_role:"organisation_admin",
   command_id:crypto.randomUUID(),reason:typeof b.reason==="string"?b.reason.trim():null
  }});
  return {status:200,state:updated.lifecycle_state};
 });
 return NextResponse.json(outcome.status===200?{state:outcome.state}:{error:outcome.error},{status:outcome.status,headers});
 }catch(e){console.error("Archive decision failed",e);return NextResponse.json({error:"Could not decide archival request"},{status:500,headers})}
}
