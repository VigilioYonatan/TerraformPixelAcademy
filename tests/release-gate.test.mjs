import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectTerraformPlan} from '../app/planInspector.js';
import {evaluateReleaseGate,emptyGateAnswers,exportGateReview} from '../app/releaseGate.js';

const good={...emptyGateAnswers(),environment:'prod',provenanceVerified:true,ownersApproved:true,driftInvestigated:true,destructiveReviewed:true,rollbackDocumented:true,costReviewed:true};
const fixture=(actions=['create'],drift=[])=>inspectTerraformPlan({
 format_version:'1.2',terraform_version:'1.10.5',
 variables:{secret:{value:'NEVER_EXPORT_RELEASE_GATE_SECRET'}},
 resource_changes:[{address:'terraform_data.sample',provider_name:'terraform.io/builtin/terraform',change:{actions,before:{token:'NEVER_EXPORT_RELEASE_GATE_SECRET'},before_sensitive:{token:true}}}],
 resource_drift:drift
});

test('release gate blocks missing provenance and human approvals',()=>{
 const result=evaluateReleaseGate(fixture(),emptyGateAnswers());
 assert.equal(result.status,'BLOCKED');
 assert.ok(result.findings.some(f=>f.id==='PROVENANCE'));
 assert.ok(result.findings.some(f=>f.id==='APPROVAL'));
 assert.equal(result.provenance,'LOCAL_TRAINING_ONLY');
});
test('release gate never claims deploy authorization, even with six declarations',()=>{
 const plan=inspectTerraformPlan({format_version:'1.2',resource_changes:[{address:'terraform_data.sample',change:{actions:['create']}}]});
 const result=evaluateReleaseGate(plan,good);
 assert.equal(result.status,'READY_FOR_HUMAN_REVIEW');
 assert.equal(result.checksPassed,6);
 assert.doesNotMatch(exportGateReview(result),/GO APPROVED|DEPLOY ALLOWED|APPLY AUTORIZADO/);
});
test('unknown actions always block, even when all boxes are ticked',()=>{
 assert.equal(evaluateReleaseGate(fixture(['rollover']),good).status,'BLOCKED');
});
test('destructive actions require dedicated review',()=>{
 const blocked=evaluateReleaseGate(fixture(['delete','create']),{...good,destructiveReviewed:false});
 assert.equal(blocked.status,'BLOCKED');
 assert.ok(blocked.findings.some(f=>f.id==='DESTRUCTIVE'));
});
test('drift without investigation blocks; reviewed destructive drift remains flagged',()=>{
 const drift=[{address:'terraform_data.drift',change:{actions:['delete']}}];
 assert.equal(evaluateReleaseGate(fixture(['update'],drift),{...good,driftInvestigated:false}).status,'BLOCKED');
 assert.equal(evaluateReleaseGate(fixture(['update'],drift),good).status,'NEEDS_EVIDENCE');
});
test('report never includes before/after, variable values or resource credentials',()=>{
 const result=evaluateReleaseGate(fixture(['delete']),good);
 const report=exportGateReview(result);
 assert.match(report,/autoevaluación local/);
 assert.ok(!report.includes('NEVER_EXPORT_RELEASE_GATE_SECRET'));
 assert.ok(!report.includes('terraform_data.sample'));
});
test('sensitive actions remain REVIEW even with all declarations',()=>{
 assert.equal(evaluateReleaseGate(fixture(),good).status,'NEEDS_EVIDENCE');
});
