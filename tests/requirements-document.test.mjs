import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const path = join(root, 'TODO_LO_QUE_DEBE_TENER_ESTA_APP.md');
const doc = readFileSync(path, 'utf8');

test('complete requirement document is present at project root with normative content', () => {
  assert.ok(existsSync(path));
  assert.ok(doc.length > 100_000);
  for (const name of [
    '## 0. Cómo debe utilizarse este documento',
    '## 4. Mapa de rutas',
    '## 5. Contratos de arquitectura',
    '## 6. Laboratorios descargables',
    '## 10. Senior Mode',
    '## 11. Seguridad',
    '## 12. Pruebas',
    '## 13. Control de cambios',
    '## 14. Bloqueos técnicos',
    '# ANEXO A'
  ]) {
    assert.ok(doc.includes(name), `Missing requirement section: ${name}`);
  }
});
test('all 36 lesson and 18 Senior IDs are described individually', () => {
  for (const prefix of ['B', 'I', 'A'])
    for (let i = 1; i <= 12; i++) {
      const id = `${prefix}${String(i).padStart(2, '0')}`;
      assert.match(doc, new RegExp(`#### ${id} —`));
      assert.ok(doc.includes(`labs/offline/${id}/main.tf`));
    }
  for (let i = 1; i <= 18; i++) {
    const id = `S${String(i).padStart(2, '0')}`;
    assert.match(doc, new RegExp(`#### ${id} —`));
    assert.ok(doc.includes(`assets/senior/${id}.zip`));
  }
});
test('document explicitly distinguishes simulated checks from real Terraform executions', () => {
  for (const phrase of [
    'NO VERIFICADOS',
    'CodeMirror 6',
    'NOT_RUN',
    'READY_FOR_HUMAN_REVIEW',
    'terraform apply',
    'Sin cuenta',
    'WCAG'
  ]) {
    assert.ok(doc.toLowerCase().includes(phrase.toLowerCase()), `Missing caveat ${phrase}`);
  }
});
test('all 12 mascot png names cited in the doc exist', () => {
  for (const name of [
    'hola',
    'pensando',
    'exito',
    'codificando',
    'leyendo',
    'deploy',
    'alerta',
    'descanso',
    'idea',
    'arquitectura',
    'senior',
    'graduacion'
  ]) {
    assert.ok(existsSync(join(root, `assets/terra/${name}.png`)), `${name}.png`);
    assert.ok(doc.includes(`\`${name}.png\``));
  }
});
