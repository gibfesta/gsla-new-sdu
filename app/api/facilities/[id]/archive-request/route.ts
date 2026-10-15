import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 const access=await getAccess();
 if(!access.user)return NextResponse.json({error:"Sign in required"},{status:401,headers});
 if(!access.roles.some(r=>r==="organisation_admin"||r==="facilities_admin"))return NextResponse.json({error:"Insufficient permissions"},{status:403,headers});
 const {id}=await params;if(!uuid.test(id))return NextResponse.json({error:"Invalid Facility ID"},{status:400,headers});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:"Invalid JSON"},{status:400,headers})}
 if(!body||typeof body!=="object"||Array.isArray(body))return NextResponse.json({error:"Invalid request"},{status:400,headers});
 const b=body as Record<string,unknown>;
 if(!Number.isSafeInteger(b.expectedVersion)|| (b.expectedVersion as number)<1 ||typeof b.commandId!=="string"||!uuid.test(b.commandId)||typeof b.reason!=="string"||!(b.reason as string).trim())
 return NextResponse.json({error:"Expected version, command UUID and reason required"},{status:400,headers});
 const reason=b.reason as string;
 try{
 const result=await prisma.$transaction(async tx=>{
  const rows=await tx.$queryRaw<Array<{id:string;approval_state:string;lifecycle_state:string;record_version:number;content_version:number;pending_request_id:string|null}>>`
   SELECT id,approval_state,lifecycle_state,record_version,content_version,pending_request_id FROM public."Facilities Table"
   WHERE id=${id}::uuid FOR UPDATE`;
  const f=rows[0];
  if(!f)return {status:404,error:"Facility not found"};
  if(f.record_version!==b.expectedVersion || f.approval_state!=="APPROVED"||f.lifecycle_state!=="ACTIVE"||f.pending_request_id)
   return {status:409,error:"Facility not eligible for archival request"};
  const snapshot=await tx.facilities_Table.findUnique({where:{id}});
  if(!snapshot)return {status:404,error:"Facility not found"};
  const req=await tx.facility_requests.create({data:{
   facility_id:id,kind:"ARCHIVE",state:"PENDING",submitted_content_version:f.content_version,
   snapshot:JSON.parse(JSON.stringify(snapshot)),validation_version:"phase1-v1",
   submitted_by:access.user!.id,submission_reason:reason.trim(),command_id:b.commandId as string
  }});
  await tx.facilities_Table.update({where:{id},data:{pending_request_id:req.id,record_version:{increment:1}}});
  await tx.facility_audit_events.create({data:{
   facility_id:id,request_id:req.id,action:"REQUEST_ARCHIVE",
   after_state:{approvalState:"APPROVED",lifecycleState:"ACTIVE",requestId:req.id},
   record_version:f.record_version+1,content_version:f.content_version,
   actor_id:access.user!.id,actor_role:access.roles.includes("organisation_admin")?"organisation_admin":"facilities_admin",
   command_id:crypto.randomUUID(),reason:reason.trim()
  }});
  return {status:201,requestId:req.id};
 });
 return NextResponse.json(result.status===201?{requestId:result.requestId,state:"PENDING"}:{error:result.error},{status:result.status,headers});
 }catch(e){console.error("Archive request failed",e);return NextResponse.json({error:"Could not request archival"},{status:500,headers})}
}
