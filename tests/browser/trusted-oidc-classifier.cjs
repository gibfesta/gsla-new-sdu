'use strict';
// Pure, credential-free decision helper. Never pass raw headers, body or tokens to reports.
function classifyPreflight(o){
 if(!o||o.status!==401||o.path!=='/api/facilities'||o.redirected||!o.json||!o.appError||o.vercelMitigated)return {status:'BLOCKED',reason:'GSLA application boundary not independently established'};
 return {status:'PASS',reason:'Application-specific anonymous API denial confirmed'};
}
function classify(t,o,boundary){
 if(!boundary)return {status:'BLOCKED',reason:'Preflight did not prove GSLA boundary'};
 if(!o||o.vercelMitigated||o.external||o.status===0||o.status===503)return {status:'BLOCKED',reason:'Interception or infrastructure prevented reliable observation'};
 if(t.kind==='pageRedirect'){
  return o.finalPath==='/sign-in'&&o.redirected&&o.redirectPath==='/sign-in'?
   {status:'PASS',reason:'GSLA sign-in redirect observed'}:
   {status:'FAIL',reason:'Protected page did not redirect to GSLA sign-in'};
 }
 if(!o.json||!o.appError)return {status:'BLOCKED',reason:'Application-specific API denial could not be identified'};
 const ok=o.status===401&&(!t.expected.cacheControl||o.cachePrivateNoStore)&&(!t.expected.varyContains||o.varyCookie);
 return ok?{status:'PASS',reason:'Expected anonymous API denial and headers observed'}:
 {status:'FAIL',reason:'GSLA anonymous API response differs from expectation'};
}
module.exports={classifyPreflight,classify};
