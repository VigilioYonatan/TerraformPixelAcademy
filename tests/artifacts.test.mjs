import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { lessons } from '../app/curriculum.js';
import { seniorCases } from '../app/senior.js';
test('all 36 lesson labs and ZIPs exist with expected source files', () => {
  for (const item of lessons) {
    for (const file of [
      'main.tf',
      'practice.tftest.hcl',
      'README.md',
      'exercise-template.tf.txt',
      'solution-reference.tf.txt',
      'STATUS.md'
    ]) {
      assert.equal(existsSync(`labs/offline/${item.id}/${file}`), true, `${item.id} ${file}`);
    }
    const zip = `assets/labs/${item.id}.zip`;
    assert.ok(existsSync(zip), zip);
    assert.equal(readFileSync(zip).subarray(0, 2).toString('hex'), '504b');
  }
});
test('all 18 case bundles exist', () => {
  for (const item of seniorCases) {
    for (const file of [
      'README.md',
      'incident.json',
      'review-before.txt',
      'review-after.txt',
      'ADR-TEMPLATE.md',
      'OPERATIONS-CHECKLIST.md',
      'EVIDENCE-STATUS.md'
    ]) {
      assert.ok(existsSync(`labs/senior/${item.id}/${file}`), `${item.id} ${file}`);
    }
    assert.ok(existsSync(`assets/senior/${item.id}.zip`));
  }
});
test('identity assets and original visual reference are packaged', () => {
  for (const f of [
    'assets/terra/terra-spritesheet.png',
    'assets/terra/hola.png',
    'assets/terra/codificando.png',
    'assets/terra/senior.png',
    'assets/terra/graduacion.png',
    'assets/reference/concepto-aprobado.png'
  ])
    assert.ok(existsSync(f), f);
});

test('36 CLI labs check topic-specific behavior, no generic reused main.tf', () => {
  const sources = new Set();
  const contracts = new Set();
  for (const item of lessons) {
    const dir = `labs/offline/${item.id}`;
    const source = readFileSync(`${dir}/main.tf`, 'utf8');
    const checks = readFileSync(`${dir}/practice.tftest.hcl`, 'utf8');
    assert.ok(source.includes('output "academy_evidence"'), `${item.id} output`);
    assert.match(checks, /condition\s*=\s*output\.academy_evidence\s*==/);
    assert.ok(checks.includes(item.id), `${item.id} traceable test`);
    assert.ok(!source.includes('REEMPLAZAR-bucket'), `${item.id} remote backend excluded`);
    assert.ok(!source.includes('resource "aws_'), `${item.id} no real AWS resources`);
    sources.add(source);
    contracts.add(checks.match(/condition\s*=\s*([^\n]+)/)?.[1]);
  }
  assert.equal(sources.size, 36, 'different executable Terraform exercise per lesson');
  assert.ok(
    contracts.size >= 30,
    'at least 30 distinct observable outcome checks; identical expected values are valid'
  );
});
