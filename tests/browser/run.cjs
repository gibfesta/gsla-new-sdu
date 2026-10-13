#!/usr/bin/env node
/* GSLA-M1-021 phase 2. Read-only and report-only: no bodies, cookies, tokens,
 * screenshots, traces, video, browser console or request URLs are persisted. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');
const catalogue=require('./catalogue.json');
const states=['PASS','FAIL','BLOCKED','NOT RUN'];
const roles=['organisation_admin','facilities_admin','centre_manager','operational_owner'];
const rootDir=path.resolve(__dirname,'../..');
const reportDir=path.join(rootDir,'test-results/gsla-audit');
const safeText=v=>String(v||'').replace(/[^a-zA-Z0-9._-]/g,'').slice(0,100);
const runId='gsla-browser-'+new Date().toISOString().replace(/[.:]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
const approvals={
  origin:process.env.GSLA_TEST_BASE_URL,
  approvedOrigin:process.env.GSLA_TEST_APPROVED_ORIGIN,
  commit:safeText(process.env.GSLA_TEST_COMMIT)||'unknown',
  deployment:safeText(process.env.GSLA_TEST_DEPLOYMENT)||'unknown',
  roleGate:process.env.GSLA_TEST_AUTHORIZED_ROLE_RUN==='YES_APPROVED_ROLE_TESTING',
};
function parseOrigin(raw){
  try {const u=new URL(raw); if(u.username||u.password||u.search||u.hash||u.pathname!=='/'||!(u.protocol==='https:'||u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))return null;return u.origin;}
  catch{return null;}
}
const origin=parseOrigin(approvals.origin);
const approvedOrigin=parseOrigin(approvals.approvedOrigin);
const targetApproved=!!origin&&origin===approvedOrigin&&approvals.commit!=='unknown'&&approvals.deployment!=='unknown';
const rows=[];
function record(t,status,reason,actual=null,elapsedMs=0){
  rows.push({testId:t.id,title:t.title,purpose:t.why,procedure:['Create isolated Chromium context for role '+t.role,'Perform read-only '+t.kind+' on '+t.path,'Compare response and final path against predefined expectation'],expected:t.expected,actual,role:t.role,environment:{origin:origin&&approvedOrigin===origin?origin:'unapproved',commit:approvals.commit,deployment:approvals.deployment},evidence:{type:'sanitised-metadata-only',screenshots:false,traces:false},status,reason,durationMs:elapsedMs});
}
function exactPath(u){try{const p=new URL(u);return p.origin===origin?p.pathname:'external-origin';}catch{return 'invalid';}}
function denyPage(obs){return obs.status===401||obs.status===403||obs.redirectPath==='/access-denied'||obs.redirectPath==='/sign-in'||obs.finalPath==='/access-denied'||obs.finalPath==='/sign-in';}
function compare(t,obs){
 const e=t.expected;
 if(t.kind==='pageRedirect')return obs.finalPath===e.redirectTo&&obs.status!==503&&!obs.deploymentProtection;
 if(t.kind==='pageAllow')return obs.status===e.status&&obs.finalPath===t.path&&!obs.deploymentProtection;
 if(t.kind==='pageDeny')return denyPage(obs)&&!obs.deploymentProtection;
 if(t.kind==='apiDeny')return [401,403].includes(obs.status)&&!obs.deploymentProtection;
 if(t.kind==='api')return obs.status===e.status&&(!e.cacheControl||obs.cacheControl?.toLowerCase().includes(e.cacheControl))&&(!e.varyContains||obs.vary?.toLowerCase().split(',').map(x=>x.trim()).includes(e.varyContains))&&!obs.deploymentProtection;
 return false;
}
function privateSessionFile(role){
 const key='GSLA_TEST_STATE_'+role.toUpperCase();
 const supplied=process.env[key];
 if(!supplied)return {error:'No approved isolated role session provisioned'};
 const full=path.resolve(supplied);
 try{
   const real=fs.realpathSync(full),stat=fs.statSync(real);
   if(real===rootDir||real.startsWith(rootDir+path.sep))return {error:'Session state must be outside repository'};
   if(!stat.isFile()||(stat.mode&0o077)!==0)return {error:'Session file is not private (requires mode 0600)'};
   const state=JSON.parse(fs.readFileSync(real,'utf8'));
   if(!Array.isArray(state.cookies)||state.cookies.length===0)return {error:'Empty session state cannot establish authentication'};
   return {file:real};
 }catch{return {error:'Session file missing, unreadable or malformed'};}
}
async function run(){
 let browser=null;
 try{
   if(targetApproved)browser=await chromium.launch({headless:true});
   for(const t of catalogue.tests){
     const start=Date.now();
     if(!t.safeReadOnly||t.kind==='notRun'){record(t,'NOT RUN','Write/destructive cases intentionally not enabled');continue;}
     if(!targetApproved){record(t,'BLOCKED','Target not explicitly approved: require matching HTTPS approved origin, exact commit and deployment');continue;}
     let state=null;
     if(t.role!=='anonymous'){
       if(!roles.includes(t.role)){record(t,'BLOCKED','Unknown role identifier');continue;}
       if(!approvals.roleGate){record(t,'BLOCKED','Credentialed role execution not authorised');continue;}
       const s=privateSessionFile(t.role);
       if(s.error){record(t,'BLOCKED',s.error);continue;}
       state=s.file;
     }
     let context=null;
     try{
       context=await browser.newContext({baseURL:origin,storageState:state||undefined,serviceWorkers:'block',acceptDownloads:false,ignoreHTTPSErrors:false});
       const page=await context.newPage();
       await page.route('**/*',route=>{
         const req=route.request();
         const u=new URL(req.url());
         if(u.origin!==origin||!['GET','HEAD'].includes(req.method()))return route.abort();
         return route.continue();
       });
       let obs;
       if(t.kind.startsWith('api')){
         const response=await page.goto(t.path,{waitUntil:'domcontentloaded',timeout:15000});
         obs={status:response?.status()||0,finalPath:exactPath(page.url()),cacheControl:response?.headers()['cache-control']||null,vary:response?.headers()['vary']||null,deploymentProtection:response?.headers()['x-vercel-mitigated']!=null};
       }else{
         const response=await page.goto(t.path,{waitUntil:'domcontentloaded',timeout:15000});
         obs={status:response?.status()||0,finalPath:exactPath(page.url()),redirectPath:exactPath(page.url()),deploymentProtection:response?.headers()['x-vercel-mitigated']!=null};
       }
       const status=obs.status===503||obs.deploymentProtection?'BLOCKED':compare(t,obs)?'PASS':'FAIL';
       record(t,status,status==='PASS'?'Expected read-only outcome observed':status==='BLOCKED'?'Application not reachable or deployment protection intercepted request':'Observed outcome differs from expectation',obs,Date.now()-start);
     }catch(e){record(t,'BLOCKED','Browser or network prerequisite prevented a trustworthy observation ('+safeText(e.name||'Error')+')',null,Date.now()-start);}
     finally{if(context)await context.close();}
   }
 }catch(e){
   for(const t of catalogue.tests)record(t,'BLOCKED','Chromium launch unavailable ('+safeText(e.name||'Error')+')');
 }finally{if(browser)await browser.close();}
 const summary=Object.fromEntries(states.map(s=>[s,rows.filter(r=>r.status===s).length]));
 const report={schemaVersion:1,runId,executedAt:new Date().toISOString(),tool:'Playwright Chromium (read-only)',source:'tests/browser/catalogue.json',environment:{origin:targetApproved?origin:'unapproved',commit:approvals.commit,deployment:approvals.deployment},summary,results:rows};
 fs.mkdirSync(reportDir,{recursive:true,mode:0o700});
 const dest=path.join(reportDir,runId);
 fs.writeFileSync(dest+'.json',JSON.stringify(report,null,2)+'\n',{mode:0o600});
 const lines=['# GSLA Chromium audit', '', 'Run: '+runId,'Time (UTC): '+report.executedAt,'Deployment: '+approvals.deployment,'Commit: '+approvals.commit,'Environment: '+report.environment.origin,'Summary: '+JSON.stringify(summary),'','Definitions are not acceptance. BLOCKED and NOT RUN are never PASS.',''];
 for(const r of rows)lines.push('## '+r.testId+' — '+r.title,'','Purpose: '+r.purpose,'Procedure: '+r.procedure.join('; '),'Expected: '+JSON.stringify(r.expected),'Actual: '+JSON.stringify(r.actual),'Role: '+r.role,'Evidence: sanitized metadata only; no screenshots','Status: '+r.status,'Reason: '+r.reason,'');
 fs.writeFileSync(dest+'.md',lines.join('\n'),{mode:0o600});
 console.log('GSLA browser audit '+runId+' '+JSON.stringify(summary));
 process.exitCode=summary.FAIL?1:summary.BLOCKED||summary['NOT RUN']?3:0;
}
run().catch(()=>{console.error('Audit unexpectedly failed; no acceptance result');process.exitCode=2;});
