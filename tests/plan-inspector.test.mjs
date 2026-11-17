import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectTerraformPlan } from '../app/planInspector.js';
const fixture = {
  format_version: '1.2',
  terraform_version: '1.10.5',
  variables: { private_value: { value: 'HIDDEN_SECRET_SHOULD_NEVER_RENDER' } },
  resource_changes: [
    {
      address: 'aws_s3_bucket.example',
      provider_name: 'registry.terraform.io/hashicorp/aws',
      change: {
        actions: ['create'],
        after: { secret: 'HIDDEN_SECRET_SHOULD_NEVER_RENDER' },
        after_sensitive: { secret: true }
      }
    },
    {
      address: 'aws_instance.web',
      change: { actions: ['delete', 'create'], before_sensitive: {}, after_sensitive: { sensitive: false } }
    },
    { address: 'terraform_data.safe', change: { actions: ['no-op'] } }
  ]
};
test('user-supplied plan classification flags destructive actions and only true sensitivity markers', () => {
  const result = inspectTerraformPlan(fixture);
  assert.equal(result.provenance, 'USER_SUPPLIED_TERRAFORM_JSON');
  assert.equal(result.total, 3);
  assert.equal(result.destructive, 1);
  assert.equal(result.sensitiveCount, 1);
  assert.equal(result.summary.replace, 1);
  assert.equal(result.summary.create, 1);
  assert.equal(result.summary['no-op'], 1);
  assert.ok(result.notices.some((x) => x.includes('destructivas')));
  assert.ok(!JSON.stringify(result).includes('HIDDEN_SECRET_SHOULD_NEVER_RENDER'));
  assert.ok(!JSON.stringify(result).includes('private_value'));
});
test('plan inspection rejects other JSON, limits displayed rows and does not persist values', () => {
  assert.throws(() => inspectTerraformPlan({ hello: 'world' }), /format_version/);
  assert.throws(() => inspectTerraformPlan({ format_version: '1.0' }), /resource_changes/);
  assert.equal(
    inspectTerraformPlan({
      format_version: '1.0',
      resource_changes: Array.from({ length: 105 }, (_, i) => ({ address: `x.${i}`, change: { actions: ['read'] } }))
    }).shown,
    100
  );
  assert.equal(
    inspectTerraformPlan({
      format_version: '1.0',
      resource_changes: [{ address: 'x', change: { actions: ['completely_new'] } }]
    }).summary.unknown,
    1
  );
});
