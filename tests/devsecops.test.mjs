import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {seniorCases} from '../app/senior.js';
import {getSeniorDrill,evaluateSeniorDrill} from '../app/seniorWhatIf.js';
import {inspectTerraformPlan} from '../app/planInspector.js';
const base=new URL('../',import.meta.url);
const file=(path)=>readFile(new URL(path,base),'utf8');

test('DevSecOps CI includes typecheck, tests, release gate, Biome and audit',async()=>{
 const workflow=await file('.github/workflows/devsecops.yml');
 for(const requirement of ['npm run qa','npm run lint:biome','npm audit --audit-level=high','npm run release:gate','contents: read'])
  assert.ok(workflow.includes(requirement),requirement);
 const pkg=JSON.parse(await file('package.json'));
 assert.equal(pkg.scripts['security:local'],'node scripts/devsecops-audit.mjs');
 assert.ok(pkg.devDependencies['@biomejs/biome']);
 assert.ok((await stat(new URL('biome.json',base))).size>100);
});

test('all Senior incidents retain distinct interactive decision drills',()=>{
 assert.equal(seniorCases.length,18);
 for(const c of seniorCases){
  const drill=getSeniorDrill(c.id);
  assert.ok(drill,`missing drill ${c.id}`);
  const marks=drill.options.map((_,index)=>evaluateSeniorDrill(c.id,index)?.ok);
  assert.equal(marks.filter(Boolean).length,1,`${c.id} must have one valid choice`);
  assert.ok(c.checklist.length>=4,`${c.id} must specify scenario-specific review controls`);
  assert.ok(c.artifacts.length>30&&c.negative.length>30,`${c.id} must document incident inputs and a negative scenario`);
 }
});

test('plan inspector rejects resource secret values and caps renderable records',()=>{
 const secret='INJECTED_SECRET_SHOULD_NOT_EXPORT';
 const changes=Array.from({length:115},(_,i)=>({address:`terraform_data.item_${i}`,change:{actions:['update'],after:{credential:secret}}}));
 const plan=inspectTerraformPlan({format_version:'1.2',resource_changes:changes});
 assert.equal(plan.total,115);
 assert.equal(plan.changes.length,100);
 assert.doesNotMatch(JSON.stringify(plan),/INJECTED_SECRET_SHOULD_NOT_EXPORT/);
});
