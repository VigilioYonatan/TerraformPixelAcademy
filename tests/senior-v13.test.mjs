import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {seniorCases,capstoneSteps} from '../app/senior.js';
import {seniorDrills,evaluateSeniorDrill} from '../app/seniorWhatIf.js';
import {defaultState,sanitizeState} from '../app/engine.js';
import {capstoneNoteValid,capstoneGate,seniorGate,reconcileSeniorCompletion} from '../app/seniorProgress.js';
import {buildSeniorPortfolio,buildSeniorReport} from '../app/seniorReport.js';

const exampleAdr='Contexto: el plan presenta un cambio de identidad que podría afectar producción. Decisión: bloquear y estudiar alternativas. Riesgos: pérdida y downtime. Evidencia: NOT_RUN, revisar primero con Terraform CLI. Rollback: recuperar con procedimiento y owner.';
const exampleNote=(i)=>`Hito ${i+1}: se revisa el riesgo específico del componente ${i+1}. Estado NOT_RUN, falta ejecutar pruebas de forma aislada y registrar responsable.`;
function seniorReadyState(id='S01'){
 const state=defaultState(),c=seniorCases.find(c=>c.id===id);
 state.seniorDecisions[id]=c.correct;state.seniorDrillAnswers[id]=seniorDrills.find(d=>d.id===id).correct;state.seniorChecklist[id]=[0,1,2,3];state.seniorEvidence[id]=exampleAdr;
 return state;
}

test('18 distinct scenario drills agree with 18 case IDs and give fail/safe outcomes',()=>{
 assert.equal(seniorDrills.length,18);
 assert.deepEqual(seniorDrills.map(d=>d.id),seniorCases.map(c=>c.id));
 assert.equal(new Set(seniorDrills.map(d=>d.prompt)).size,18);
 for(const d of seniorDrills){
  assert.notEqual(d.options[0],d.options[1]);
  assert.equal(evaluateSeniorDrill(d.id,d.correct)?.ok,true);
  assert.equal(evaluateSeniorDrill(d.id,1-d.correct)?.ok,false);
  assert.equal(evaluateSeniorDrill(d.id,4),null);
  assert.equal(evaluateSeniorDrill(d.id,d.correct)?.source,'SYNTHETIC_SCENARIO');
 }
 assert.equal(evaluateSeniorDrill('S19',0),null);
});

test('every Senior case source has corresponding scenario, worksheet and reviewed case sheet',()=>{
 for(const c of seniorCases){
  const folder=`labs/senior/${c.id}`;
  for(const fn of ['WHAT-IF-SCENARIO.json','WHAT-IF-WORKSHEET.md','CASE-REVIEW-SHEET.md'])assert.ok(existsSync(`${folder}/${fn}`),`${folder}/${fn}`);
  const contract=JSON.parse(readFileSync(`${folder}/WHAT-IF-SCENARIO.json`,'utf8'));
  const drill=seniorDrills.find(d=>d.id===c.id);
  assert.equal(contract.case_id,c.id);
  assert.equal(contract.question,drill.prompt);
  assert.equal(contract.correct_choice,drill.correct);
  assert.equal(contract.no_real_execution,true);
  assert.ok(readFileSync(`${folder}/CASE-REVIEW-SHEET.md`,'utf8').includes(c.mission));
 }
});

test('what-if answers survive state validation and appear in the exported Senior ADR',()=>{
 const state=seniorReadyState();state.seniorDrillAnswers.S01=0;
 const clean=sanitizeState(state,[],seniorCases.map(c=>c.id));
 assert.equal(clean.seniorDrillAnswers.S01,0);
 assert.match(buildSeniorReport(seniorCases[0],clean),/Simulación What-if/);
 assert.match(buildSeniorReport(seniorCases[0],clean),/SYNTHETIC_SCENARIO/);
 state.seniorDrillAnswers.S01=99;
 const sanit=sanitizeState(state,[],seniorCases.map(c=>c.id));
 assert.equal(sanit.seniorDrillAnswers.S01,undefined);
});

test('completion is revoked when a completed case answer, checklist or ADR is changed',()=>{
 const state=seniorReadyState('S01');state.seniorCompleted=['S01'];
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),[]);
 state.seniorDecisions.S01=0;
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),['S01']);
 assert.equal(state.seniorCompleted.length,0);
 state.seniorDecisions.S01=seniorCases[0].correct;
 state.seniorCompleted=['S01'];state.seniorChecklist.S01=[0,1,2];
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),['S01']);
 state.seniorChecklist.S01=[0,1,2,3];state.seniorCompleted=['S01'];state.seniorEvidence.S01='';
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),['S01']);
});

test('imported forged Senior completion cannot survive gate reconciliation',()=>{
 const forged={...defaultState(),seniorCompleted:['S01','S18'],seniorDecisions:{S01:1},seniorChecklist:{S01:[0,1,2,3]}};
 const state=sanitizeState(forged,[],seniorCases.map(c=>c.id));
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases).sort(),['S01','S18']);
 assert.deepEqual(state.seniorCompleted,[]);
});

test('capstone needs eight distinct documented notes and declared checks',()=>{
 const state=seniorReadyState('S18');
 assert.equal(capstoneGate(state).ok,false);
 for(let i=0;i<8;i++)state.capstoneEvidence[String(i)]=exampleNote(i);
 assert.equal(capstoneGate(state).ok,false,'without checkmarks');
 state.capstoneDone=[0,1,2,3,4,5,6,7];
 assert.equal(capstoneGate(state).ok,true);
 assert.equal(seniorGate(state,seniorCases.find(c=>c.id==='S18')).ok,true);
 state.capstoneEvidence['3']=exampleNote(2);
 assert.equal(capstoneGate(state).ok,false,'duplicate notes');
 state.capstoneEvidence['3']=exampleNote(3).replace('NOT_RUN','unverified');
 assert.equal(capstoneGate(state).ok,false,'status missing');
 state.capstoneEvidence['3']=exampleNote(3);
 state.seniorCompleted=['S18'];
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),[]);
 state.capstoneDone.pop();
 assert.deepEqual(reconcileSeniorCompletion(state,seniorCases),['S18']);
});

test('notes are bounded and sanitization discards invalid keys without deleting valid entries',()=>{
 assert.equal(capstoneNoteValid('x'),false);
 assert.equal(capstoneNoteValid('PASS'),false);
 assert.equal(capstoneNoteValid(exampleNote(0)),true);
 const raw={...defaultState(),capstoneEvidence:{'0':exampleNote(0),'8':'extra',__proto__: 'bad'}};
 const state=sanitizeState(raw,[],seniorCases.map(c=>c.id));
 assert.equal(state.capstoneEvidence['0'],exampleNote(0));
 assert.ok(!Object.keys(state.capstoneEvidence).includes('8'));
});

test('Senior portfolio includes all 18 cases with explicit NOT_RUN execution provenance',()=>{
 const state=seniorReadyState();state.seniorCompleted=['S01'];
 const doc=buildSeniorPortfolio(seniorCases,state);
 assert.match(doc,/Autoevaluados con gate vigente: 1/);
 assert.match(doc,/Terraform CLI.*NOT_RUN/);
 for(const c of seniorCases)assert.ok(doc.includes(`${c.id} — ${c.title}`),c.id);
 assert.match(doc,/Revisión humana del ADR.*NOT_RUN/);
 assert.ok(!/\bCERTIFICADO\b/.test(doc));
});

test('S18 offline Terraform capstone includes module composition and plan-only tests',()=>{
 const base='labs/senior/S18/capstone';
 for(const fn of ['main.tf','modules/workload/main.tf','tests/capstone.tftest.hcl','README.md','terraform.tfvars.example',...Array.from({length:8},(_,i)=>`HITO-${String(i+1).padStart(2,'0')}-EVIDENCIA.md`)])assert.ok(existsSync(`${base}/${fn}`),fn);
 const hcl=readFileSync(`${base}/main.tf`,'utf8'),child=readFileSync(`${base}/modules/workload/main.tf`,'utf8'),checks=readFileSync(`${base}/tests/capstone.tftest.hcl`,'utf8');
 assert.match(hcl,/module "workload"/);
 assert.match(child,/resource "terraform_data"/);
 assert.match(checks,/command = plan/g);
 assert.ok(!/resource "aws_|backend "s3"|command\s*=\s*apply/.test(hcl+child+checks));
 assert.equal(capstoneSteps.length,8);
});
