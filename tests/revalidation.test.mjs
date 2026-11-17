import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../app/curriculum.js';
import { seniorCases } from '../app/senior.js';
import { seniorDrills } from '../app/seniorWhatIf.js';
import { defaultState, reconcileLessonCompletion, evaluateLesson } from '../app/engine.js';
import { seniorGate, reconcileSeniorCompletion } from '../app/seniorProgress.js';
const adr = `Contexto: un cambio puede reemplazar producción por la nueva dirección. Decisión: bloquear y verificar el estado con el owner. Riesgos: pérdida de datos y downtime. Evidencia: NOT_RUN, se debe capturar el plan y compararlo. Rollback: volver a la versión aprobada con backup verificado.`;
test('lesson badge is revoked after code or quiz becomes invalid', () => {
  const lesson = lessons.find((l) => l.id === 'B04');
  assert.ok(lesson);
  const state = defaultState();
  state.code.B04 = lesson.example;
  state.quizAnswers.B04 = lesson.correct;
  state.completed = ['B04'];
  assert.equal(reconcileLessonCompletion(state, lessons).length, 0);
  state.code.B04 = lesson.starter;
  assert.deepEqual(reconcileLessonCompletion(state, lessons), ['B04']);
  assert.equal(state.completed.length, 0);
  state.code.B04 = lesson.example;
  state.completed = ['B04'];
  state.quizAnswers.B04 = (lesson.correct + 1) % lesson.options.length;
  assert.deepEqual(reconcileLessonCompletion(state, lessons), ['B04']);
  assert.equal(evaluateLesson(lesson, lesson.example).ok, true);
});
test('18 Senior gates require the right what-if decision and invalidate a changed answer', () => {
  for (const c of seniorCases) {
    const state = defaultState(),
      drill = seniorDrills.find((d) => d.id === c.id);
    state.seniorDecisions[c.id] = c.correct;
    state.seniorChecklist[c.id] = [0, 1, 2, 3];
    state.seniorEvidence[c.id] = adr;
    if (c.id === 'S18') continue;
    assert.ok(!seniorGate(state, c).ok, `${c.id}: drill missing must block`);
    state.seniorDrillAnswers[c.id] = 1 - drill.correct;
    assert.ok(!seniorGate(state, c).ok, `${c.id}: wrong drill must block`);
    state.seniorDrillAnswers[c.id] = drill.correct;
    assert.ok(seniorGate(state, c).ok, `${c.id}: valid self-assessment should pass`);
    state.seniorCompleted = [c.id];
    state.seniorDrillAnswers[c.id] = 1 - drill.correct;
    assert.deepEqual(reconcileSeniorCompletion(state, seniorCases), [c.id]);
  }
});
