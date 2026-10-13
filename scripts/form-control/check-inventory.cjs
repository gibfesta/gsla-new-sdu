/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS verification tool. */
// Offline evidence check only. Never imported by a runtime page/API.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const m=JSON.parse(fs.readFileSync('config/form-control/register.json','utf8'));
const identities=JSON.parse(fs.readFileSync("config/form-control/form-ids.json","utf8"));
const mappings=new Map(identities.assignments.map(x=>[x.formId,x.ownerFormId]));
assert.equal(mappings.size,identities.assignments.length);
assert.equal(new Set(identities.assignments.map(x=>x.ownerFormId)).size,identities.assignments.length);
for(const x of identities.assignments){assert.match(x.ownerFormId,/^GSLA-FRM-[0-9]{3}$/);assert.ok(Number(x.ownerFormId.slice(-3))>0&&Number(x.ownerFormId.slice(-3))<=identities.highWatermark);}
for(const f of m.forms)assert.equal(f.ownerFormId,mappings.get(f.formId));
// Comparing to Git history prevents reassignment, deletion (including retired IDs), or high-watermark rollback.
if(process.argv.includes("--identity-baseline")){const ref=process.argv[process.argv.indexOf("--identity-baseline")+1];const old=JSON.parse(require("node:child_process").execFileSync("git",["show",ref+":config/form-control/form-ids.json"],{encoding:"utf8"}));for(const x of old.assignments)assert.equal(mappings.get(x.formId),x.ownerFormId,"Historical assignment changed or removed");assert.ok(identities.highWatermark>=old.highWatermark);for(const x of identities.assignments.filter(x=>!old.assignments.some(y=>y.formId===x.formId)))assert.ok(Number(x.ownerFormId.slice(-3))>old.highWatermark,"Retired number reused");}
const seen=new Set();const missing=[],changed=[];
for(const f of m.forms){assert.ok(!seen.has(f.formId),'Duplicate identity '+f.formId);seen.add(f.formId);assert.ok(f.locations.length,'Missing usages '+f.formId);assert.ok(f.locations.every(l=>l.mode&&l.source),'Missing mode/source');}
assert.equal(m.forms.filter(f=>f.nativeTemplateId).length,23);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);}
const ui=walk('app').concat(walk('components')).filter(p=>p.endsWith('.tsx'));
const reviewed=new Set(m.sourceLedger.map(x=>x.source));
const newSources=ui.filter(p=>!reviewed.has(p));
for(const item of m.sourceLedger.concat(m.definitionEvidence||[])){if(!fs.existsSync(item.source)){missing.push(item.source);continue;}const hash=crypto.createHash('sha256').update(fs.readFileSync(item.source)).digest('hex');if(hash!==item.sourceHash)changed.push(item.source);}
console.log(JSON.stringify({definitions:m.forms.length,sourceDefaults:23,reviewedPageSources:m.sourceLedger.filter(x=>x.route!==null).length,reviewedUiSources:m.sourceLedger.length,newSources,missing:[...new Set(missing)],changed:[...new Set(changed)],browserReconciliation:'Not complete: local candidates must remain visible'},null,2));
if(process.argv.includes('--strict')&&(newSources.length||missing.length||changed.length))process.exitCode=1;
