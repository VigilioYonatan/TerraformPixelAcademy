import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, tracks } from '../app/curriculum.js';
import { seniorCases, capstoneSteps } from '../app/senior.js';
import { games } from '../app/games.js';
import {
  defaultState,
  sanitizeState,
  evaluateLesson,
  canCompleteSenior,
  calculateXP,
  balancedHcl,
  stripComments,
  escapeHtml
} from '../app/engine.js';

test('curriculum has 12+12+12 and 8 tracks', () => {
  assert.equal(lessons.length, 36);
  assert.equal(tracks.length, 8);
  for (const prefix of ['B', 'I', 'A']) assert.equal(lessons.filter((l) => l.id.startsWith(prefix)).length, 12);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 36);
});
test('each lesson has distinct correction, instruction, quiz and source text', () => {
  for (const l of lessons) {
    assert.ok(l.starter.includes('# TODO'));
    assert.ok(!l.example.includes('# TODO'));
    assert.ok(l.required.length >= 1);
    assert.ok(l.options[l.correct]);
    assert.ok(l.concept.length >= 100);
    assert.notEqual(l.example, l.starter);
  }
});
test('all sample solutions pass browser rules', () => {
  for (const l of lessons) {
    const result = evaluateLesson(l, l.example);
    assert.equal(result.ok, true, `${l.id}: ${JSON.stringify(result.checks)}`);
    assert.equal(result.provenance, 'BROWSER_RULES');
  }
});
test('all starter tasks initially fail rules', () => {
  for (const l of lessons) assert.equal(evaluateLesson(l, l.starter).ok, false, l.id);
});
test('balance checker rejects bad delimiters and unclosed strings', () => {
  assert.equal(balancedHcl('resource "terraform_data" "foo" { input = "bar" }'), true);
  assert.equal(balancedHcl('resource "terraform_data" "foo" { input = "bar" '), false);
  assert.equal(balancedHcl('output "x" { value = "incomplete }'), false);
});
test('senior catalog has 18 cases and 8 final steps', () => {
  assert.equal(seniorCases.length, 18);
  assert.equal(capstoneSteps.length, 8);
  for (const c of seniorCases) {
    assert.equal(c.choices.length, 3);
    assert.ok(c.choices[c.correct]);
    assert.equal(c.checklist.length, 4);
    assert.ok(c.negative.length >= 20);
    assert.ok(c.evidence.length >= 20);
  }
});
test('senior rubric is explicit self assessment, not semantic verification', () => {
  assert.equal(
    canCompleteSenior(
      true,
      [0, 1, 2, 3],
      'Contexto: drift detectado. Decisión: restaurar con revisión. Riesgos: interrupción por cambios. Evidencia: NOT_RUN, pendiente. Rollback: revertir el commit y plan aprobado.'
    ).ok,
    true
  );
  assert.equal(
    canCompleteSenior(
      false,
      [0, 1, 2, 3],
      'Contexto: drift detectado. Decisión: restaurar con revisión. Riesgos: interrupción por cambios. Evidencia: NOT_RUN, pendiente. Rollback: revertir el commit y plan aprobado.'
    ).ok,
    false
  );
  assert.equal(
    canCompleteSenior(
      true,
      [0, 1, 2],
      'Contexto: drift detectado. Decisión: restaurar con revisión. Riesgos: interrupción por cambios. Evidencia: NOT_RUN, pendiente. Rollback: revertir el commit y plan aprobado.'
    ).ok,
    false
  );
  assert.equal(canCompleteSenior(true, [0, 1, 2, 3], 'short').ok, false);
  assert.equal(canCompleteSenior(true, [0, 1, 2, 3], 'X'.repeat(150)).ok, false); // Sin secciones ADR
});
test('games include five sets and twenty-one explanatory questions', () => {
  assert.equal(games.length, 5);
  assert.equal(
    games.reduce((a, g) => a + g.questions.length, 0),
    21
  );
  for (const game of games)
    for (const q of game.questions) {
      assert.ok(q.options[q.correct]);
      assert.ok(q.explanation.length > 15);
    }
});
test('untrusted progress cannot add unknown lesson IDs', () => {
  const state = {
    ...defaultState(),
    completed: ['B04', 'B04', 'INVALID'],
    seniorCompleted: ['S11', 'UNKNOWN'],
    code: { B04: 'ok', INVALID: 'bad' },
    theme: 'weird'
  };
  const clean = sanitizeState(
    state,
    lessons.map((l) => l.id),
    seniorCases.map((c) => c.id)
  );
  assert.deepEqual(clean.completed, ['B04']);
  assert.deepEqual(clean.seniorCompleted, ['S11']);
  assert.equal(clean.theme, 'dark');
  assert.equal(clean.code.INVALID, undefined);
  assert.throws(() => sanitizeState({ version: 999 }, [], []));
});
test('XP is stable even with multiple local attempts', () => {
  const state = {
    ...defaultState(),
    completed: ['B01', 'I01', 'A01'],
    seniorCompleted: ['S01', 'S18'],
    gameWins: { g1: 4 }
  };
  assert.equal(calculateXP(state), 100 + 140 + 180 + 300 + 800 + 80);
});
test('user data is HTML escaped', () => {
  assert.equal(escapeHtml('<script>" &'), '&lt;script&gt;&quot; &amp;');
});

test('comment stripping preserves URL and # inside HCL quotes', () => {
  assert.equal(
    stripComments('output "url" { value = "https://example.com/a#b" } # remove me'),
    'output "url" { value = "https://example.com/a#b" } '
  );
  assert.equal(balancedHcl('output "url" { value = "https://example.com/a#b" } # comment'), true);
  assert.equal(stripComments('x=1 // comment\ny=2'), 'x=1 \ny=2');
});
