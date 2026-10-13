#!/usr/bin/env node
/* GSLA-M1-021 — audited read-only smoke runner (Node 20+).
 * No cookies, credentials, tokens or response bodies are collected. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {performance}=require('node:perf_hooks');
const catalogue=require('./catalogue.json');
const base=process.env.GSLA_TEST_BASE_URL;
const commit=process.env.GSLA_TEST_COMMIT||'unknown';
const deployment=process.env.GSLA_TEST_DEPLOYMENT||'unknown';
const runId='gsla-'+new Date().toISOString().replace(/[.:]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
if(!base){console.error('GSLA_TEST_BASE_URL is required. No tests executed.');process.exit(2);}
let root;try{root=new URL(base);if(root.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(root.hostname))throw Error('HTTPS required');}catch{console.error('Invalid GSLA_TEST_BASE_URL (HTTPS required except localhost).');process.exit(2);}
const results=[];
(async()=>{
  for(const t of catalogue.tests){
    const row={testId:t.id,title:t.title,why:t.why,role:t.role,steps:['Issue read-only '+t.method+' to '+t.path,'Compare the HTTP status and non-secret security headers with the expected result'],expected:t.expected,actual:null,result:'NOT RUN',reason:null,evidence:null,durationMs:null};
    if(!t.safeReadOnly||t.method!=='GET'){row.result='BLOCKED';row.reason='Mutation/destructive test not authorised';results.push(row);continue;}
    if(t.role!=='anonymous'){row.result='BLOCKED';row.reason='Authenticated test session has not been supplied via an approved secure testing method';results.push(row);continue;}
    const start=performance.now();
    try{
      const response=await fetch(new URL(t.path,root),{redirect:'manual',signal:AbortSignal.timeout(12000),cache:'no-store'});
      const status=response.status;
      const location=response.headers.get('location');
      const locationPath=location?new URL(location,root).pathname:null;
      const cc=response.headers.get('cache-control');
      const vary=response.headers.get('vary');
      row.actual={status,redirectPath:locationPath,cacheControl:cc,vary};
      // Evidence excludes URLs with tokens, body, credentials, cookies and all request headers.
      const exp=t.expected;
      const ok=(exp.status==null||status===exp.status)&&
        (exp.redirectTo==null||(status>=300&&status<400&&locationPath===exp.redirectTo))&&
        (exp.cacheControl==null||cc?.toLowerCase().includes(exp.cacheControl.toLowerCase()))&&
        (exp.varyContains==null||vary?.toLowerCase().split(',').map(x=>x.trim()).includes(exp.varyContains.toLowerCase()));
      row.result=ok?'PASS':'FAIL';
      row.reason=ok?'Observed result matches the pre-declared expectation':'Observed result differs from the pre-declared expectation';
    }catch(e){row.result='BLOCKED';row.reason='Network or environment prevented an observable response ('+String(e?.name||'error')+')';}
    row.durationMs=Math.round(performance.now()-start);
    results.push(row);
  }
  const report={schemaVersion:1,runId,executedAt:new Date().toISOString(),targetOrigin:root.origin,commit,deployment,tool:'Node HTTP smoke (not browser and not independently authenticated)',source:'tests/automated/catalogue.json',summary:Object.fromEntries(['PASS','FAIL','BLOCKED','NOT RUN'].map(s=>[s,results.filter(r=>r.result===s).length])),results};
  const dir=path.resolve('test-results/gsla-audit');fs.mkdirSync(dir,{recursive:true});
  const jsonFile=path.join(dir,runId+'.json'),mdFile=path.join(dir,runId+'.md');
  fs.writeFileSync(jsonFile,JSON.stringify(report,null,2)+'\n',{mode:0o600});
  const lines=['# GSLA automated test record','',`Run: ${runId}`,`Date (UTC): ${report.executedAt}`,`Target: ${root.origin}`,`Commit: ${commit}`,`Deployment: ${deployment}`,`Results: ${JSON.stringify(report.summary)}`,'','A test marked BLOCKED was not successfully checked. An automated specification alone is never a PASS.',''];
  for(const r of results)lines.push(`## ${r.testId} — ${r.title}`,'',`**Why it matters:** ${r.why}`,`**How tested:** ${r.steps.join('; ')}`,`**Expected:** \`${JSON.stringify(r.expected)}\``,`**Observed:** \`${JSON.stringify(r.actual)}\``,`**Result:** ${r.result}`,`**Reason:** ${r.reason||'Not executed'}`,'');
  fs.writeFileSync(mdFile,lines.join('\n'),{mode:0o600});
  console.log('Run '+runId+' '+JSON.stringify(report.summary)+'; sanitized results: '+dir);
  process.exitCode=results.some(r=>r.result==='FAIL')?1:results.some(r=>r.result==='BLOCKED'||r.result==='NOT RUN')?3:0;
})().catch(()=>{console.error('Test runner failed without valid report');process.exitCode=2;});
