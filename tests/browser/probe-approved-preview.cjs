#!/usr/bin/env node
'use strict';
/* Read-only, credential-free smoke probe. Separate from authenticated runner.
 * Never exports bodies, URLs with query strings, cookies, headers or screenshots. */
const {chromium}=require('playwright');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const catalogue=require('./catalogue.json');
const origin='https://gsla-new-ba0fvaspz-founder-os6.vercel.app';
const commit='7114b037c34b320e8f86572ebfbce82f3bc8613e';
const deployment='dpl_6peMrCQKby7QzfoT4DZuof42E9mW';
const runId='gsla-anon-'+new Date().toISOString().replace(/[.:]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
const chosen=new Set(['GSLA-M1-021-AUTO-009','GSLA-M1-021-AUTO-010','GSLA-M1-021-AUTO-011','GSLA-M1-021-AUTO-012']);
const results=[];
async function main(){
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const t of catalogue.tests.filter(x=>chosen.has(x.id))){
   const start=Date.now();
   const record={testId:t.id,purpose:t.why,procedure:'Anonymous Chromium isolated context GET '+t.path,expected:t.expected,observed:null,result:'BLOCKED',reason:'not observed',durationMs:0};
   let ctx;
   try{
    ctx=await browser.newContext({serviceWorkers:'block',acceptDownloads:false,ignoreHTTPSErrors:false});
    const page=await ctx.newPage();
    await page.route('**/*',route=>{
      const req=route.request();
      if(new URL(req.url()).origin!==origin||!['GET','HEAD'].includes(req.method()))return route.abort();
      return route.continue();
    });
    const response=await page.goto(origin+t.path,{waitUntil:'domcontentloaded',timeout:15000});
    const status=response?.status()||0,h=response?.headers()||{};
    const finalUrl=new URL(page.url());
    const finalPath=finalUrl.origin===origin?finalUrl.pathname:'external-origin';
    const protectedLayer=!!h['x-vercel-mitigated']||!!h['x-vercel-protection-bypass']||finalPath==='external-origin'||status===429||
      (status===401||status===403)&&!['/api/facilities','/api/owner/form-control'].includes(t.path);
    const cacheOk=(h['cache-control']||'').toLowerCase().includes('private, no-store');
    const varyOk=(h.vary||'').toLowerCase().split(',').map(s=>s.trim()).includes('cookie');
    record.observed={status,finalPath:['/sign-in','/facilities/home','/organisation/home','/api/facilities','/api/owner/form-control'].includes(finalPath)?finalPath:'other-or-external',cachePrivateNoStore:cacheOk,varyCookie:varyOk,vercelMitigated:!!h['x-vercel-mitigated']};
    if(protectedLayer||status===503||status===0){record.reason='Edge deployment protection or infrastructure prevented confirmed app-level response';}
    else {
      const ok=t.kind==='pageRedirect'?status>=200&&status<400&&finalPath===t.expected.redirectTo:
       status===t.expected.status&&(!t.expected.cacheControl||cacheOk)&&(!t.expected.varyContains||varyOk);
      record.result=ok?'PASS':'FAIL';
      record.reason=ok?'App-level expected response observed':'Unexpected response; inspect possible edge protection before accepting as app defect';
      if(status===401||status===403){record.result='BLOCKED';record.reason='Ambiguous denial: deployment layer not ruled out without separate independent edge evidence';}
    }
   }catch(e){record.reason='Browser request unavailable ('+String(e?.name||'error').replace(/[^a-zA-Z]/g,'')+')';}
   finally{record.durationMs=Date.now()-start;results.push(record);if(ctx)await ctx.close();}
  }
 }finally{if(browser)await browser.close();}
 const summary=Object.fromEntries(['PASS','FAIL','BLOCKED','NOT RUN'].map(s=>[s,results.filter(r=>r.result===s).length]));
 const report={schemaVersion:1,runId,dateUtc:new Date().toISOString(),environment:{origin,commit,deployment},method:'Credential-free Chromium, no Vercel bypass',summary,results};
 const dir=path.resolve(__dirname,'../../test-results/gsla-audit');fs.mkdirSync(dir,{recursive:true,mode:0o700});
 fs.writeFileSync(path.join(dir,runId+'.json'),JSON.stringify(report,null,2),{mode:0o600});
 console.log('GSLA_ANONYMOUS_RUN_ID='+runId);
 console.log(JSON.stringify(report));
 process.exitCode=summary.FAIL?1:summary.BLOCKED?3:0;
}
main().catch(()=>{console.error('Probe terminated before complete evidence');process.exitCode=2;});
