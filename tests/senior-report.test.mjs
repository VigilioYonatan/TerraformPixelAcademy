import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {seniorCases} from '../app/senior.js';
import {buildSeniorReport} from '../app/seniorReport.js';
import {defaultState,canCompleteSenior} from '../app/engine.js';
import {seniorDrills} from '../app/seniorWhatIf.js';

test('each of the 18 Senior cases has four distinct, subject-specific gates aligned with packed incident data',()=>{
 const all=[];
 for(const c of seniorCases){
  assert.equal(c.checklist.length,4,c.id);
  assert.equal(new Set(c.checklist).size,4,c.id);
  assert.ok(c.checklist.every(t=>t.length>=35),c.id);
  const incident=JSON.parse(readFileSync(`labs/senior/${c.id}/incident.json`,'utf8'));
  assert.deepEqual(incident.checklist,c.checklist,c.id);
  assert.ok(existsSync(`labs/senior/${c.id}/REVIEW-GATES.md`));
  all.push(c.checklist.join('|'));
 }
 assert.equal(new Set(all).size,18);
});

test('exported Senior report cannot claim real Terraform or cloud tests',()=>{
 const c=seniorCases[0],state=defaultState();
 const initial=buildSeniorReport(c,state);
 assert.match(initial,/NOT_RUN/);
 assert.match(initial,/PENDIENTE/);
 state.seniorDecisions[c.id]=c.correct;
 state.seniorDrillAnswers[c.id]=seniorDrills.find(d=>d.id===c.id).correct;
 state.seniorChecklist[c.id]=[0,1,2,3];
 state.seniorEvidence[c.id]='Contexto: reemplazo no deseado del recurso crítico. Decisión: detener y revisar moved. Riesgos: caída de servicio. Evidencia: NOT_RUN, sin terraform CLI. Rollback: revertir el cambio en PR con aprobación.';
 state.seniorCompleted.push(c.id);
 const done=buildSeniorReport(c,state);
 assert.match(done,/COMPLETADA \(solo reglas didácticas\)/);
 assert.match(done,/- Terraform CLI: NOT_RUN/);
 assert.match(done,/- Cloud: NOT_RUN/);
 assert.match(done,/\| Revisión humana del ADR \| NOT_RUN/);
 assert.ok(done.includes(state.seniorEvidence[c.id]));
});

test('Senior ADR gate rejects labels without meaningful content, forged evidence status and invalid check indices',()=>{
 const base='Contexto: se revisa la topología de estado en producción. Decisión: bloquear apply mientras no se comprueba la integridad. Riesgos: reemplazo y downtime. Evidencia: NOT_RUN, se requiere CLI real. Rollback: restaurar solo bajo aprobación con backup.';
 assert.equal(canCompleteSenior(true,[0,1,2,3],base).ok,true);
 assert.equal(canCompleteSenior(true,[0,1,2,5],base).ok,false);
 assert.equal(canCompleteSenior(true,[0,1,2,3],base.replace('NOT_RUN,','quizás,')).ok,false);
 assert.equal(canCompleteSenior(true,[0,1,2,3],base.replace('Decisión: bloquear apply mientras no se comprueba la integridad.','Decisión: x.')).ok,false);
});
