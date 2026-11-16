import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectTerraformPlan} from '../app/planInspector.js';
import {buildPlanReviewMarkdown} from '../app/planReport.js';

test('real plan inspection includes reported drift without exposing values',()=>{
 const secret='SHOULD_NEVER_APPEAR_IN_REPORT_987';
 const plan=inspectTerraformPlan({format_version:'1.2',terraform_version:'1.10.5',
  variables:{admin_password:{value:secret}},
  resource_changes:[{address:'aws_instance.web',provider_name:'registry.terraform.io/hashicorp/aws',change:{actions:['delete','create'],before:{token:secret},after:{token:secret},before_sensitive:{token:true}}}],
  resource_drift:[{address:'aws_s3_bucket.example',change:{actions:['update'],before:{credentials:secret},after:{credentials:secret}}},{address:'aws_iam_role.owner',change:{actions:['delete'],before:{token:secret}}}]
 });
 assert.equal(plan.total,1);
 assert.equal(plan.destructive,1);
 assert.equal(plan.driftCount,2);
 assert.equal(plan.driftDestructive,1);
 assert.equal(plan.drift.length,2);
 const report=buildPlanReviewMarkdown(plan);
 assert.match(report,/resource_drift declarados: 2/);
 assert.match(report,/aws_s3_bucket.example/);
 assert.match(report,/NOT_RUN/);
 assert.doesNotMatch(JSON.stringify(plan),/SHOULD_NEVER_APPEAR_IN_REPORT_987/);
 assert.doesNotMatch(report,/SHOULD_NEVER_APPEAR_IN_REPORT_987/);
 assert.doesNotMatch(report,/admin_password/);
});

test('plan report sanitizes metadata before creating markdown table',()=>{
 const plan=inspectTerraformPlan({format_version:'1.0',resource_changes:[{address:'evil\n|header|`',provider_name:'provider\rname',change:{actions:['read']}}]});
 const report=buildPlanReviewMarkdown(plan);
 assert.match(report,/evil -header--/);
 assert.doesNotMatch(report,/evil\n\|header/);
 assert.match(report,/nombres/mi);
});

test('missing resource_drift is reported as zero, invalid extra-large drift rejected',()=>{
 assert.equal(inspectTerraformPlan({format_version:'1.0',resource_changes:[]}).driftCount,0);
 assert.throws(()=>inspectTerraformPlan({format_version:'1.0',resource_changes:[],resource_drift:Array(150001).fill(null)}),/excede/);
});
