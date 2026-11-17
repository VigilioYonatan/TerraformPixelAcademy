import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectTerraformPlan } from '../app/planInspector.js';
import { buildPlanReviewMarkdown } from '../app/planReport.js';

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

test('F4-03: distinguishes delete-then-create vs create-before-destroy and supports Terraform >= 1.7 forget actions across versions 1.6, 1.8 and 1.10+', () => {
  for (const tfVer of ['1.6.6', '1.8.5', '1.10.5']) {
    const plan = inspectTerraformPlan({
      format_version: tfVer.startsWith('1.6') ? '1.1' : '1.2',
      terraform_version: tfVer,
      resource_changes: [
        { address: 'aws_db_instance.cutover', change: { actions: ['delete', 'create'] } },
        { address: 'aws_launch_template.rolling', change: { actions: ['create', 'delete'] } },
        { address: 'aws_s3_bucket.detached_legacy', change: { actions: ['forget'] } },
        { address: 'aws_iam_role.recreated_detached', change: { actions: ['forget', 'create'] } }
      ]
    });
    assert.equal(plan.summary.replace, 2);
    assert.equal(plan.replaceDeleteThenCreate, 1);
    assert.equal(plan.replaceCreateBeforeDestroy, 1);
    assert.equal(plan.summary.forget, 2);
    assert.equal(plan.forgottenCount, 2);
    assert.equal(plan.summary.unknown, 0, `Expected 0 unknown actions for Terraform ${tfVer}`);
    assert.equal(plan.changes[0].replaceOrder, 'delete-then-create');
    assert.equal(plan.changes[1].replaceOrder, 'create-before-destroy');
    assert.ok(plan.notices.some((n) => n.includes('delete-then-create')));
    assert.ok(plan.notices.some((n) => n.includes('create-before-destroy')));
    assert.ok(plan.notices.some((n) => n.includes('forget')));
  }
});

test('F4-03: handles >200 resources + >40 drift entries, corrupt inputs, and 50-round secret canary fuzzing with zero leaks', () => {
  assert.throws(() => inspectTerraformPlan(null), /format_version/);
  assert.throws(() => inspectTerraformPlan('not-json'), /format_version/);
  assert.throws(() => inspectTerraformPlan([]), /format_version/);

  const largePlan = inspectTerraformPlan({
    format_version: '1.2',
    terraform_version: '1.10.5',
    resource_changes: Array.from({ length: 240 }, (_, i) => ({
      address: `module.fleet.terraform_data.node[${i}]`,
      provider_name: 'terraform.io/builtin/terraform',
      change: { actions: i % 10 === 0 ? ['create', 'delete'] : ['update'] }
    })),
    resource_drift: Array.from({ length: 55 }, (_, i) => ({
      address: `module.fleet.terraform_data.drift[${i}]`,
      change: { actions: ['update'] }
    }))
  });
  assert.equal(largePlan.total, 240);
  assert.equal(largePlan.shown, 100);
  assert.equal(largePlan.replaceCreateBeforeDestroy, 24);
  assert.equal(largePlan.driftCount, 55);
  assert.equal(largePlan.drift.length, 40);

  // 50-iteration fuzzing of secrets injected into every sensitive Terraform JSON section
  for (let round = 0; round < 50; round++) {
    const canary = `CANARY_FUZZ_SECRET_${round}_SYNTHETIC_CREDENTIAL_${(round * 7919).toString(36)}`;
    const deepSensitive = { l1: { l2: { l3: { secret: true } } } };
    const fuzzed = inspectTerraformPlan({
      format_version: '1.2',
      terraform_version: '1.10.5',
      variables: { [`var_${round}`]: { value: canary } },
      planned_values: { outputs: { token: { value: canary, sensitive: true } }, root_module: { secret: canary } },
      output_changes: { api_key: { before: canary, after: canary, after_sensitive: true } },
      prior_state: { values: { root_module: { resources: [{ values: { password: canary } }] } } },
      configuration: { root_module: { variables: { default: canary } } },
      resource_changes: [
        {
          address: `module.sec_${round}.aws_secretsmanager_secret_version.db`,
          provider_name: 'registry.terraform.io/hashicorp/aws',
          change: {
            actions: round % 2 === 0 ? ['delete', 'create'] : ['forget'],
            before: { secret_string: canary },
            after: { secret_string: canary },
            after_unknown: { arn: true },
            before_sensitive: false,
            after_sensitive: deepSensitive
          }
        }
      ]
    });
    const serialized = JSON.stringify(fuzzed);
    const md = buildPlanReviewMarkdown(fuzzed);
    assert.equal(serialized.includes(canary), false, `Leak in PlanAnalysis at round ${round}`);
    assert.equal(md.includes(canary), false, `Leak in Markdown report at round ${round}`);
  }
});
