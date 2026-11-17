import type { Case } from './senior.js';
import type { AcademyState } from './engine.js';
import { seniorGate } from './seniorProgress.js';
import { evaluateSeniorDrill, getSeniorDrill } from './seniorWhatIf.js';

/** Informe descargable del ejercicio. No declara que se ejecutaron comandos o cloud. */
export function buildSeniorReport(caseFile: Case, state: AcademyState): string {
  const id = caseFile.id,
    selected = state.seniorDecisions[id];
  const checklist = state.seniorChecklist[id] || [];
  const evidence = (state.seniorEvidence[id] || '').trim();
  const correct = selected === caseFile.correct;
  const gate = seniorGate(state, caseFile);
  const finished = gate.ok && state.seniorCompleted.includes(id);
  const decision = selected === undefined ? 'SIN RESPUESTA' : caseFile.choices[selected] || 'SIN RESPUESTA';
  return [
    `# ${id} — ${caseFile.title}`,
    '',
    '> DOCUMENTO DE PRÁCTICA EDUCATIVA. Todos los incidentes y planes de la academia son sintéticos. Este informe no certifica pruebas Terraform, revisiones humanas ni despliegues.',
    '',
    `- Caso: ${id} / ${caseFile.pillar} / ${caseFile.severity}`,
    `- Autoevaluación local: ${finished ? 'COMPLETADA (solo reglas didácticas)' : 'PENDIENTE'}`,
    `- Terraform CLI: NOT_RUN (no existe integración de ejecución en navegador)`,
    `- Cloud: NOT_RUN`,
    `- Decisión seleccionada: ${decision}`,
    `- Decisión del ejercicio: ${correct ? 'coincide con criterio docente' : 'pendiente de corregir'}`,
    '',
    '## Escenario y alcance',
    '',
    caseFile.subtitle,
    '',
    '## Misión',
    '',
    caseFile.mission,
    '',
    '## Simulación What-if (sintética)',
    '',
    ...(state.seniorDrillAnswers[id] === undefined
      ? ['- Sin respuesta registrada.']
      : [
          `- Pregunta: ${getSeniorDrill(id)?.prompt || 'No disponible'}`,
          `- Respuesta: ${getSeniorDrill(id)?.options[state.seniorDrillAnswers[id]] || 'No disponible'}`,
          `- Diagnóstico del simulador: ${evaluateSeniorDrill(id, state.seniorDrillAnswers[id])?.message || 'No disponible'}`,
          '- Fuente: SYNTHETIC_SCENARIO; ejecución Terraform: NOT_RUN'
        ]),
    '',
    '## Rúbrica de controles declarados',
    '',
    ...caseFile.checklist.map((t, i) => `- [${checklist.includes(i) ? 'x' : ' '}] ${t}`),
    '',
    ...(id === 'S18'
      ? [
          '## Hitos del capstone y evidencia declarada',
          '',
          ...Array.from(
            { length: 8 },
            (_, i) =>
              `### Hito ${i + 1} — ${state.capstoneDone.includes(i) ? 'marcado' : 'pendiente'}\n\n${state.capstoneEvidence[String(i)] || '_Sin documentación._'}\n`
          ),
          ''
        ]
      : []),
    '## ADR escrito por el estudiante',
    '',
    evidence || '_Sin evidencia documentada._',
    '',
    '## Gate estructural',
    '',
    ...(gate.reasons.length
      ? gate.reasons.map((r) => `- PENDIENTE: ${r}`)
      : [
          '- Se cumplen las reglas locales de estructura y decisión; la validez técnica de la evidencia NO ha sido verificada.'
        ]),
    '',
    '## Ejecuciones externas',
    '',
    '| Control | Estado | Fuente |',
    '|---|---|---|',
    '| terraform fmt / validate / test | NOT_RUN | Sin ejecución desde navegador |',
    '| Plan y apply cloud | NOT_RUN | Sin conexión cloud |',
    '| Revisión humana del ADR | NOT_RUN | Sin evaluador externo |',
    '',
    '## Próximos pasos',
    '',
    'Ejecutar las pruebas que correspondan en un entorno aislado, conservar logs reales y actualizar los estados de evidencia con el responsable correspondiente.',
    ''
  ].join('\n');
}

/** 18 case reports, with explicit provenance and no false CLI claims. */
export function buildSeniorPortfolio(cases: Case[], state: AcademyState): string {
  const done = cases.filter((c) => seniorGate(state, c).ok && state.seniorCompleted.includes(c.id));
  return [
    '# TerraPixel Academy — Portafolio Senior',
    '',
    '> AUTOEVALUACIÓN EDUCATIVA SIN CERTIFICACIÓN. Sin validación de Terraform CLI, infraestructura ni revisión humana externa.',
    '',
    `- Casos: ${cases.length}`,
    `- Autoevaluados con gate vigente: ${done.length}`,
    '- terraform fmt/validate/test: NOT_RUN desde la academia web',
    '- Apply/cloud: NOT_RUN',
    '- Evaluación humana externa: NOT_RUN',
    '',
    '## Matriz de progreso',
    '| Caso | Tema | Estado didáctico |',
    '|---|---|---|',
    ...cases.map(
      (c) =>
        `| ${c.id} | ${c.title.replaceAll('|', '/')} | ${done.some((d) => d.id === c.id) ? 'AUTOEVALUADO' : 'PENDIENTE'} |`
    ),
    '',
    ...cases.map((c) => buildSeniorReport(c, state))
  ].join('\n\n');
}
