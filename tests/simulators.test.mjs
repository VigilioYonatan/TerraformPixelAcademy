import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCIDR, cidrOverlap, planIntegrity, estimateCost } from '../app/simulators.js';
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
