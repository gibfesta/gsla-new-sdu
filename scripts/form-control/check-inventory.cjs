/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS verification tool. */
// Offline evidence check only. Never imported by a runtime page/API.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const m=JSON.parse(fs.readFileSync('config/form-control/register.json','utf8'));
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
