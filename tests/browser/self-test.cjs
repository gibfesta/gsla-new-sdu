#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const baseline=require('../automated/catalogue.json');
const browser=require('./catalogue.json');
const IDs=baseline.tests.concat(browser.tests).map(t=>t.id);
assert.equal(new Set(IDs).size,IDs.length,'permanent test IDs must be unique');
assert.deepEqual(baseline.tests.map(t=>t.id),Array.from({length:8},(_,i)=>'GSLA-M1-004-AUTO-'+String(i+1).padStart(3,'0')));
assert.deepEqual(browser.tests.map(t=>t.id),Array.from({length:12},(_,i)=>'GSLA-M1-021-AUTO-'+String(i+9).padStart(3,'0')));
for(const t of browser.tests){
 assert.match(t.path,/^\/(?!\/)[a-zA-Z0-9/_-]+$/,'literal relative path only');
 assert.ok(t.why&&t.role&&t.kind&&t.expected,'complete test contract');
 if(t.safeReadOnly)assert.notEqual(t.kind,'notRun');
}
const statuses=['PASS','FAIL','BLOCKED','NOT RUN'];
function classify(input){if(!input.executed)return input.blocked?'BLOCKED':'NOT RUN';return input.matched?'PASS':'FAIL';}
assert.deepEqual([
 classify({executed:true,matched:true}),
 classify({executed:true,matched:false}),
 classify({executed:false,blocked:true}),
 classify({executed:false,blocked:false})
],statuses);
assert.equal(classify({executed:false,matched:true,blocked:true}),'BLOCKED','missing authenticated session cannot PASS');
assert.equal(classify({executed:true,matched:false}),'FAIL','deliberate mismatch must FAIL');
console.log('PASS: 8 original IDs remain stable; 12 new unique IDs; safe catalogue; all four result states');

const {classify:classifyAttestation}=require('./attestation.cjs');
const expected='facilities_admin';
const good={schemaVersion:1,authority:'gsla-server-verified',authenticated:true,sessionValid:true,role:expected};
assert.equal(classifyAttestation(200,good,expected).status,'PASS');
assert.equal(classifyAttestation(200,{...good,role:'organisation_admin'},expected).status,'FAIL');
for(const httpStatus of [401,403,500,503])assert.equal(classifyAttestation(httpStatus,null,expected).status,'BLOCKED');
for(const invalid of [null,{}, {...good,sessionValid:false},{...good,authenticated:false},{...good,role:'unknown'},{...good,authority:'client-asserted'}])assert.equal(classifyAttestation(200,invalid,expected).status,'BLOCKED');
const secret='SYNTHETIC_SECRET_TOKEN_498172_DO_NOT_EMIT';
for(const item of [classifyAttestation(401,{...good,token:secret},expected),classifyAttestation(200,{...good,role:'centre_manager',cookie:secret},expected)])assert.ok(!JSON.stringify(item).includes(secret),'attestation outputs must not leak credentials');
console.log('PASS: attestation valid/wrong-role/expired/invalid/missing and synthetic secret redaction');

(async()=>{
 const {attest}=require('./attestation.cjs');
 const secret='SYNTHETIC_PRIVATE_ADMISSION_abcdefghijklmnopqrstuvwxyz_1234';
 const calls=[];
 const ctx={request:{get:async(url,options)=>{
   calls.push({url,options});
   return {status:()=>200,headers:()=>({'cache-control':'private, no-store','content-type':'application/json'}),json:async()=>({...good})};
 }}};
 assert.equal((await attest(ctx,'https://preview.example','facilities_admin',null)).status,'BLOCKED');
 assert.equal(calls.length,0,'no request without secret');
 assert.equal((await attest(ctx,'https://preview.example','facilities_admin',secret)).status,'PASS');
 assert.equal(calls.length,1);
 assert.equal(calls[0].url,'https://preview.example/api/test/role-attestation');
 assert.deepEqual(calls[0].options.headers,{'X-GSLA-Test-Admission':secret});
 assert.ok(!JSON.stringify(classifyAttestation(200,good,expected)).includes(secret));
 for(const [code,result] of [[401,'BLOCKED'],[403,'BLOCKED'],[404,'BLOCKED']]){
  ctx.request.get=async()=>({status:()=>code,headers:()=>({'cache-control':'private, no-store'})});
  assert.equal((await attest(ctx,'https://preview.example',expected,secret)).status,result);
 }
 ctx.request.get=async()=>({status:()=>200,headers:()=>({'cache-control':'private, no-store','content-type':'application/json'}),json:async()=>({...good,role:'centre_manager'})});
 assert.equal((await attest(ctx,'https://preview.example',expected,secret)).status,'FAIL');
 console.log('PASS private attestation header only, no request without admission, 401/403/404 BLOCKED and wrong-role FAIL');
})().catch(()=>{process.exitCode=1;});
