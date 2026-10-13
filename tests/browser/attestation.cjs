'use strict';
/* Client-side test integration contract ONLY.
 * Backend team must separately approve and implement a fail-closed server endpoint
 * backed by verified Supabase user + trusted GSLA role mapping. */
const ROLES=new Set(['organisation_admin','facilities_admin','centre_manager','operational_owner']);
const CONTRACT='/api/test/role-attestation';
function classify(status,payload,expectedRole){
  if(!ROLES.has(expectedRole))return {status:'BLOCKED',reason:'Unknown expected role'};
  if(status===401||status===403)return {status:'BLOCKED',reason:'Session missing, expired or invalid'};
  if(status!==200)return {status:'BLOCKED',reason:'Approved server identity attestation unavailable'};
  if(!payload||payload.schemaVersion!==1||payload.authority!=='gsla-server-verified'||payload.authenticated!==true||payload.sessionValid!==true||!ROLES.has(payload.role))return {status:'BLOCKED',reason:'Invalid server attestation contract'};
  if(payload.role!==expectedRole)return {status:'FAIL',reason:'Server-attested role does not match expected role'};
  return {status:'PASS',reason:'Server attests valid session and expected role'};
}
async function attest(context,origin,expectedRole,admissionSecret){
  if(typeof admissionSecret!=='string'||admissionSecret.length<32)return {status:'BLOCKED',reason:'Private Preview admission is not provisioned'};
  let response;
  try{
    response=await context.request.get(new URL(CONTRACT,origin).toString(),{timeout:12000,maxRedirects:0,failOnStatusCode:false,headers:{'X-GSLA-Test-Admission':admissionSecret}});
    if(response.headers()['location'])return {status:'BLOCKED',reason:'Attestation redirected unexpectedly'};
    if(response.headers()['cache-control']?.toLowerCase().includes('no-store')!==true)return {status:'BLOCKED',reason:'Attestation missing no-store'};
    const status=response.status();
    if(status!==200)return classify(status,null,expectedRole);
    const contentType=response.headers()['content-type']||'';
    if(!contentType.toLowerCase().includes('application/json'))return {status:'BLOCKED',reason:'Attestation is not JSON'};
    const payload=await response.json();
    return classify(status,payload,expectedRole);
  }catch{return {status:'BLOCKED',reason:'Attestation request failed'};}
}
module.exports={classify,attest,CONTRACT};
