import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cidrOverlap,
  defaultSimulatorInputs,
  estimateCost,
  evaluateFinOpsDecision,
  parseCIDR,
  planIntegrity,
  runCaseSimulator,
  simulateBackendMigration,
  simulateCapstonePromotion,
  simulateCriticalDestroy,
  simulateDriftTriage,
  simulateEmergencyRecovery,
  simulateForEachRefactor,
  simulateGitOpsOwnership,
  simulateModuleCoupling,
  simulateOidcTrust,
  simulatePolicyException,
  simulateProviderUpgrade,
  simulateRfcPrioritization,
  simulateSecretExposure,
  simulateStateLock,
  simulateTestPyramid
} from '../app/simulators.js';

test('IPv4 CIDR parser accepts safe ranges', () => {
  assert.deepEqual(parseCIDR('10.0.0.0/24'), { start: 167772160, end: 167772415, prefix: 24 });
  assert.equal(parseCIDR('10.0.0.300/24'), null);
  assert.equal(parseCIDR('10.0.0.0/33'), null);
});

test('CIDR overlap distinguishes overlap and nonoverlap', () => {
  assert.equal(cidrOverlap('10.40.0.0/16', '10.40.8.0/21'), true);
  assert.equal(cidrOverlap('10.40.0.0/16', '10.41.0.0/16'), false);
  assert.equal(cidrOverlap('garbage', '10.0.0.0/24'), null);
});

test('synthetic plan gate checks commit, environment and digest', () => {
  const a = { commit: 'abc', env: 'prod', digest: 'digest-one' };
  assert.equal(planIntegrity(a, { ...a }).ok, true);
  assert.deepEqual(planIntegrity(a, { commit: 'def', env: 'dev', digest: 'digest-two' }).problems, [
    'commit diferente',
    'entorno diferente',
    'digest del artefacto diferente'
  ]);
});

test('synthetic FinOps estimate obeys budget', () => {
  assert.equal(estimateCost(3).estimate, 183);
  assert.equal(estimateCost(3).exceeds, false);
  assert.equal(estimateCost(6).exceeds, true);
  assert.equal(estimateCost(6).provenance, 'SYNTHETIC_FIXTURE');
});

test('F4-01: all 18 Senior deterministic simulators enforce safe vs blocked platform rules', () => {
  // S01
  assert.equal(simulateForEachRefactor('a', 'b', false).verdict, 'BLOCKED');
  assert.equal(simulateForEachRefactor('a', 'b', true).verdict, 'REVIEW');
  assert.equal(simulateForEachRefactor('same', 'same', false).verdict, 'SAFE');

  // S02
  assert.equal(simulateStateLock(5, true, true).verdict, 'BLOCKED');
  assert.equal(simulateStateLock(10, false, true).verdict, 'BLOCKED');
  assert.equal(simulateStateLock(25, false, true).verdict, 'REVIEW');

  // S03
  assert.equal(simulateDriftTriage('team-platform', 'unknown', true).verdict, 'BLOCKED');
  assert.equal(simulateDriftTriage('team-platform', 'team-platform', false).verdict, 'SAFE');

  // S04
  assert.equal(simulateCriticalDestroy('prod', false, true).verdict, 'BLOCKED');
  assert.equal(simulateCriticalDestroy('prod', true, true).verdict, 'REVIEW');

  // S05
  assert.equal(simulateBackendMigration(false, true, true).verdict, 'BLOCKED');
  assert.equal(simulateBackendMigration(true, true, true).verdict, 'REVIEW');

  // S06
  assert.equal(simulateSecretExposure('raw_output', false).verdict, 'BLOCKED');
  assert.equal(simulateSecretExposure('sensitive_var', true).verdict, 'BLOCKED');
  assert.equal(simulateSecretExposure('ephemeral_var', false).verdict, 'SAFE');

  // S07
  assert.equal(simulateProviderUpgrade('4.67.0', '5.0.0', false).verdict, 'BLOCKED');
  assert.equal(simulateProviderUpgrade('4.67.0', '5.0.0', true).verdict, 'REVIEW');
  assert.equal(simulateProviderUpgrade('5.1.0', '5.2.0', true).verdict, 'SAFE');

  // S08
  assert.equal(simulateModuleCoupling(80, 1).verdict, 'BLOCKED');
  assert.equal(simulateModuleCoupling(400, 0).verdict, 'REVIEW');
  assert.equal(simulateModuleCoupling(60, 0).verdict, 'SAFE');

  // S10
  assert.equal(simulateOidcTrust('repo:acme/infra:*', 'sts.amazonaws.com', true).verdict, 'BLOCKED');
  assert.equal(simulateOidcTrust('repo:acme/infra:pull_request', 'sts.amazonaws.com', true).verdict, 'BLOCKED');
  assert.equal(simulateOidcTrust('repo:acme/infra:environment:prod', 'sts.amazonaws.com', true).verdict, 'SAFE');

  // S12
  assert.equal(simulateTestPyramid(false, false).verdict, 'BLOCKED');
  assert.equal(simulateTestPyramid(true, false).verdict, 'REVIEW');
  assert.equal(simulateTestPyramid(true, true).verdict, 'SAFE');

  // S13
  assert.equal(simulatePolicyException('CRITICAL', 'sec-lead', 7).verdict, 'BLOCKED');
  assert.equal(simulatePolicyException('HIGH', '', 7).verdict, 'BLOCKED');
  assert.equal(simulatePolicyException('HIGH', 'sec-lead', 30).verdict, 'BLOCKED');
  assert.equal(simulatePolicyException('HIGH', 'sec-lead', 14).verdict, 'REVIEW');

  // S14
  assert.equal(evaluateFinOpsDecision(2, false, false).verdict, 'BLOCKED');
  assert.equal(evaluateFinOpsDecision(2, true, true).verdict, 'BLOCKED');
  assert.equal(evaluateFinOpsDecision(6, true, false).verdict, 'REVIEW');
  assert.equal(evaluateFinOpsDecision(3, true, false).verdict, 'SAFE');

  // S15
  assert.equal(simulateEmergencyRecovery(false, true, 30).verdict, 'BLOCKED');
  assert.equal(simulateEmergencyRecovery(true, false, 30).verdict, 'BLOCKED');
  assert.equal(simulateEmergencyRecovery(true, true, 45).ok, true);

  // S16
  assert.equal(simulateGitOpsOwnership(true, true, true).verdict, 'BLOCKED');
  assert.equal(simulateGitOpsOwnership(true, false, true).verdict, 'SAFE');

  // S17
  assert.equal(simulateRfcPrioritization(true, false, false).verdict, 'BLOCKED');
  assert.equal(simulateRfcPrioritization(false, true, true).verdict, 'SAFE');

  // S18
  assert.equal(simulateCapstonePromotion('prod', true, false, true).verdict, 'BLOCKED');
  assert.equal(simulateCapstonePromotion('prod', true, true, false).verdict, 'BLOCKED');
  assert.equal(simulateCapstonePromotion('prod', true, true, true).verdict, 'REVIEW');

  // Dispatcher covers S01..S18 with non-empty distinct guidance
  const defaults = defaultSimulatorInputs();
  for (let i = 1; i <= 18; i++) {
    const id = `S${String(i).padStart(2, '0')}`;
    const out = runCaseSimulator(id, defaults);
    assert.ok(out.length >= 20, `Expected non-trivial output for ${id}`);
    assert.notEqual(out, 'Escenario de simulación no reconocido.');
  }
});
