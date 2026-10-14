#!/usr/bin/env node
'use strict';
/* Local-only, approved Trusted Sources admission. No CI credential provisioning.
 * Never logs or persists header, token, cookies, body, traces or screenshots. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');
const {classifyPreflight,classify}=require('./trusted-oidc-classifier.cjs');
const {tests}=require('./catalogue.json');
const origin='https://gsla-new-ba0fvaspz-founder-os6.vercel.app';
const commit='7114b037c34b320e8f86572ebfbce82f3bc8613e';
const deployment='dpl_6peMrCQKby7QzfoT4DZuof42E9mW';
const ids=['GSLA-M1-021-AUTO-009','GSLA-M1-021-AUTO-010','GSLA-M1-021-AUTO-011','GSLA-M1-021-AUTO-012'];
const runId='gsla-oidc-anon-'+new Date().toISOString().replace(/[.:]/g,'-')+'-'+crypto.randomBytes(4).toString('hex');
const token=process.env.VERCEL_OIDC_TOKEN;
const authorised=process.env.GSLA_APPROVED_LOCAL_ANON==='APPROVED_DPL_6peMrCQKby7QzfoT4DZuof42E9mW';
const runTime=new Date().toISOString();
const entries=[];
function pathOnly(url){try{const u=new URL(url);if(u.origin!==origin)return 'external';return ['/sign-in','/organisation/home','/facilities/home','/api/facilities','/api/owner/form-control'].includes(u.pathname)?u.pathname:'other';}catch{return 'invalid';}}
function safeHeaders(h){return {json:(h['content-type']||'').toLowerCase().includes('application/json'),cachePrivateNoStore:(h['cache-control']||'').toLowerCase().includes('private, no-store'),varyCookie:(h.vary||'').toLowerCase().split(',').map(x=>x.trim()).includes('cookie'),vercelMitigated:!!h['x-vercel-mitigated']};}
async function observe(browser,route){
 const context=await browser.newContext({serviceWorkers:'block',acceptDownloads:false,ignoreHTTPSErrors:false});
 try{
  const page=await context.newPage();
  await page.route('**/*',route=>{
   const req=route.request();
   const u=new URL(req.url());
   if(u.origin!==origin||!['GET','HEAD'].includes(req.method()))return route.abort();
   // The token is provided only to this exact approved origin. No secret in browser storage.
   return route.continue({headers:{...req.headers(),'x-vercel-trusted-oidc-idp-token':token}});
  });
  const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:18000});
  const h=response?.headers()||{},status=response?.status()||0;
  let rr=response?.request()||null,redirected=false,redirectPath=null;
  while(rr?.redirectedFrom()){
   redirected=true;
   rr=rr.redirectedFrom();
   if(rr.url().startsWith(origin))redirectPath=pathOnly(response.url());
  }
  // Check only fixed, non-sensitive JSON sentinel in memory; never export body.
  let appError=false;
  if(h['content-type']?.toLowerCase().includes('application/json')&&status===401){
   try{const data=JSON.parse(await response.text());appError=Object.keys(data).length===1&&data.error==='Authentication required';}catch{}
  }
  return {status,finalPath:pathOnly(page.url()),redirected,redirectPath,...safeHeaders(h),appError,external:pathOnly(page.url())==='external'};
 }finally{await context.close();}
}
async function main(){
 let browser=null,confirmed=false,preflight=null;
 try{
  if(authorised&&typeof token==='string'&&token.length>20){
    browser=await chromium.launch({headless:true});
    try{preflight=await observe(browser,'/api/facilities');confirmed=classifyPreflight({...preflight,path:'/api/facilities'}).status==='PASS';}
    catch{confirmed=false;}
  }
  for(const id of ids){
   const t=tests.find(x=>x.id===id);
   const row={testId:id,purpose:t.why,procedure:'Isolated anonymous Chromium GET '+t.path,expected:t.expected,observed:null,result:'BLOCKED',reason:'Approved local Trusted Sources access or app preflight unavailable',executedAtUtc:runTime,runId,environment:{deployment,commit,origin},evidence:'sanitised report only'};
   if(confirmed){
    try{
     const obs=await observe(browser,t.path),c=classify(t,obs,true);
     row.observed={status:obs.status,finalPath:obs.finalPath,redirected:obs.redirected,redirectPath:obs.redirectPath,json:obs.json,cachePrivateNoStore:obs.cachePrivateNoStore,varyCookie:obs.varyCookie,vercelMitigated:obs.vercelMitigated,appError:obs.appError};
     row.result=c.status;row.reason=c.reason;
    }catch{row.reason='Chromium navigation or network prerequisite unavailable';}
   }
   entries.push(row);
  }
 }catch{for(const id of ids){const t=tests.find(x=>x.id===id);entries.push({testId:id,purpose:t.why,procedure:'Anonymous Chromium GET '+t.path,expected:t.expected,result:'BLOCKED',reason:'Chromium launch unavailable',executedAtUtc:runTime,runId,environment:{deployment,commit,origin}});}}
 finally{if(browser)await browser.close();}
 const summary=Object.fromEntries(['PASS','FAIL','BLOCKED','NOT RUN'].map(s=>[s,entries.filter(x=>x.result===s).length]));
 const report={runId,executedAtUtc:runTime,environment:{deployment,commit,origin},appBoundaryConfirmed:confirmed,preflight:preflight?{status:preflight.status,json:preflight.json,appError:preflight.appError,finalPath:preflight.finalPath}:null,summary,results:entries};
 const directory=path.resolve(__dirname,'../../test-results/gsla-audit');fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const stem=path.join(directory,runId);
 fs.writeFileSync(stem+'.json',JSON.stringify(report,null,2),{mode:0o600});
 const md=['# GSLA restricted anonymous Chromium evidence','','Run ID: '+runId,'UTC: '+runTime,'Deployment: '+deployment,'Commit: '+commit,'Application boundary confirmed: '+confirmed,'Summary: '+JSON.stringify(summary),''];
 for(const row of entries)md.push('## '+row.testId,'Purpose: '+row.purpose,'Procedure: '+row.procedure,'Expected: '+JSON.stringify(row.expected),'Observed: '+JSON.stringify(row.observed||null),'Result: '+row.result,'Reason: '+row.reason,'');
 fs.writeFileSync(stem+'.md',md.join('\n'),{mode:0o600});
 console.log('GSLA run '+runId+' '+JSON.stringify(summary)+' appBoundaryConfirmed='+confirmed);
 process.exitCode=summary.FAIL?1:summary.BLOCKED?3:0;
}
main().catch(()=>{console.error('Restricted probe failed closed');process.exitCode=2;});
