import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inspectTerraformPlan } from '../app/planInspector.js';
test('synthetic plan example is valid and teaches destructive changes + drift', async () => {
  const raw = await readFile(new URL('../assets/examples/plan-sintetico.json', import.meta.url), 'utf8');
  const result = inspectTerraformPlan(JSON.parse(raw));
  assert.equal(result.total, 3);
  assert.equal(result.destructive, 2);
  assert.equal(result.driftCount, 1);
  assert.equal(result.sensitiveCount, 1);
  assert.match(raw, /terraform_data.drifted/);
  assert.doesNotMatch(raw, /"value":\s*"[^"]+"/);
});
