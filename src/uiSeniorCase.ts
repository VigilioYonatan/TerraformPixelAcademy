/**
 * Fully declarative Preact detail for ALL 18 Senior cases.
 * Existing data-action/data-input controls deliberately retain the proven
 * root delegation contract, with no dangerous HTML injection.
 */
import { h } from './vendor/preact.mjs';
import type { AcademyState } from './engine.js';
import type { Case } from './senior.js';
import { capstoneSteps } from './senior.js';
import { seniorSnippets } from './seniorSnippets.js';
import { getSeniorDrill, evaluateSeniorDrill } from './seniorWhatIf.js';
import { seniorGate, capstoneNoteValid } from './seniorProgress.js';
interface Props {
  scenario: Case;
  cases: readonly Case[];
  state: AcademyState;
  tab: string;
  showFix: boolean;
  simResult: string;
  cidrA: string;
  cidrB: string;
  approvedCommit: string;
  appliedCommit: string;
  replicas: number;
}
const tag = (value: string, color = 'purple') => h('span', { className: `chip chip-${color}` }, value);
const action = (label: string, name: string, id: string = '', klass = 'btn btn-primary', index?: number) =>
  h(
    'button',
    {
      type: 'button',
      className: klass,
      'data-action': name,
      'data-id': id,
      'data-index': index
    },
    label
  );
const spacer = () => h('div', { className: 'space16' });
const reviewBox = (title: string, body: string) =>
  h('div', { className: 'case-review' }, h('b', {}, title), h('p', {}, body));
const stage = (text: string) => h('div', { className: 'side-step' }, text);
function Simulator({ scenario, state, simResult, cidrA, cidrB, approvedCommit, appliedCommit, replicas }: Props) {
  const id = scenario.id,
    drill = getSeniorDrill(id),
    selected = state.seniorDrillAnswers[id];
  const result = selected === undefined ? null : evaluateSeniorDrill(id, selected);
  let control: unknown = null;
  const field = (label: string, actionId: string, value: string, placeholder: string) =>
    h(
      'div',
      {},
      h('label', { className: 'field-label' }, label),
      h('input', { className: 'search-bar', 'data-input': actionId, value, 'aria-label': placeholder })
    );
  if (id === 'S09')
    control = h(
      'div',
      {},
      h(
        'div',
        { className: 'cards-2' },
        field('CIDR de development', 'cidr-a', cidrA, 'CIDR desarrollo'),
        field('CIDR de producción', 'cidr-b', cidrB, 'CIDR producción')
      ),
      spacer(),
      action('Comprobar rangos →', 'check-cidr')
    );
  if (id === 'S11')
    control = h(
      'div',
      {},
      h(
        'div',
        { className: 'cards-2' },
        field('Commit del plan aprobado', 'approved-commit', approvedCommit, 'Commit aprobado'),
        field('Commit usado para apply', 'applied-commit', appliedCommit, 'Commit aplicado')
      ),
      spacer(),
      action('Verificar identidad del fixture →', 'check-integrity')
    );
  if (id === 'S14')
    control = h(
      'div',
      {},
      h('label', { className: 'field-label' }, 'Número ficticio de réplicas (base USD 61/mes)'),
      h('input', {
        className: 'search-bar',
        type: 'number',
        min: 0,
        max: 50,
        'data-input': 'replicas',
        value: replicas,
        'aria-label': 'Número de réplicas'
      }),
      spacer(),
      action('Calcular estimación →', 'check-cost')
    );
  if (id === 'S02')
    control = h(
      'div',
      {},
      h('p', { className: 'prose' }, 'Writer A adquirió el lock en 10:01; writer B llega en 10:02.'),
      spacer(),
      action('Intentar writer B →', 'simulate-lock')
    );
  if (id === 'S03')
    control = h(
      'div',
      {},
      h(
        'pre',
        { className: 'code-preview' },
        h(
          'code',
          {},
          'HCL: tags.Owner = "team-platform"\nSTATE: tags.Owner = "team-platform"\nREMOTE: tags.Owner = "unknown"'
        )
      ),
      spacer(),
      action('Detectar drift →', 'simulate-drift')
    );
  if (id === 'S01')
    control = h(
      'div',
      {},
      h(
        'pre',
        { className: 'code-preview' },
        h('code', {}, 'Antes: terraform_data.node["old_key"]\nDespués: terraform_data.node["new_key"]')
      ),
      spacer(),
      action('Evaluar direcciones →', 'simulate-keys')
    );
  if (!drill) return null;
  return h(
    'section',
    { className: 'content-panel', style: 'margin-top:20px' },
    h(
      'div',
      { className: 'flex space-between' },
      h(
        'div',
        {},
        h('div', { className: 'eyebrow' }, 'SIMULADOR DETERMINISTA'),
        h('h3', { style: 'margin-top:8px' }, 'Prueba una hipótesis')
      ),
      tag('SIMULADO', 'yellow')
    ),
    spacer(),
    control,
    h(
      'div',
      { className: 'what-if' },
      h('div', { className: 'eyebrow' }, `DESAFÍO WHAT-IF · ${id}`),
      h('h3', { className: 'what-if-title' }, drill.prompt),
      h(
        'div',
        { className: 'what-if-choices' },
        ...drill.options.map((option, i) =>
          action(
            `${String.fromCharCode(65 + i)}. ${option}`,
            'what-if-answer',
            id,
            `btn btn-soft ${selected === i ? 'selected' : ''}`,
            i
          )
        )
      ),
      result
        ? h(
            'div',
            { className: `what-if-result ${result.ok ? 'ok' : 'unsafe'}`, role: 'status' },
            h('b', {}, result.ok ? '✓ Decisión defendible' : '⚠ Riesgo no resuelto'),
            h('p', {}, result.message),
            h('p', {}, h('b', {}, 'Evidencia que exigirías: '), result.next),
            h('small', {}, 'Ejercicio sintético, no Terraform real.')
          )
        : null
    ),
    simResult ? h('div', { className: 'alert', role: 'status' }, simResult) : null,
    h(
      'p',
      { className: 'small-note', style: 'margin-top:15px' },
      'No se lee state remoto ni se ejecuta Terraform. Datos sintéticos.'
    )
  );
}
function ReviewSnippet({ scenario, showFix }: { scenario: Case; showFix: boolean }) {
  const snip = seniorSnippets[scenario.id];
  if (!snip) return null;
  return h(
    'div',
    {},
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'flex space-between' },
      h('div', {}, h('div', { className: 'eyebrow' }, 'FRAGMENTO DIDÁCTICO · NO EJECUTAR'), h('h3', {}, snip.file)),
      action(showFix ? 'Mostrar riesgo' : 'Mostrar enfoque seguro', 'review-fix', '', 'btn btn-sm btn-soft')
    ),
    h('pre', { className: 'code-preview' }, h('code', {}, showFix ? snip.after : snip.before)),
    reviewBox('Revisión', snip.review)
  );
}
function Capstone({ state }: Pick<Props, 'state'>) {
  return h(
    'div',
    {},
    h('div', { className: 'space24' }),
    h('div', { className: 'eyebrow' }, 'CAPSTONE · 8 HITOS'),
    h('h3', { style: 'margin:12px 0' }, 'Checklist de entregables'),
    ...capstoneSteps.map((step, i) => {
      const note = state.capstoneEvidence[String(i)] || '',
        valid = capstoneNoteValid(note);
      return h(
        'div',
        { className: 'capstone-stage', key: i },
        h(
          'label',
          { className: 'check-row' },
          h('input', {
            type: 'checkbox',
            id: `capstone-check-${i}`,
            'data-input': 'capstone-check',
            'data-index': i,
            checked: state.capstoneDone.includes(i),
            disabled: !valid
          }),
          h(
            'span',
            {},
            h('b', {}, `${i + 1}. ${step.name}`),
            h('span', { className: 'small-note' }, ` — ${step.detail}`)
          )
        ),
        h(
          'label',
          { className: 'field-label', htmlFor: `capstone-note-${i}` },
          `Evidencia del hito ${i + 1} (autodeclarada)`
        ),
        h('textarea', {
          id: `capstone-note-${i}`,
          className: 'capstone-note',
          'data-input': 'capstone-note',
          'data-index': i,
          maxLength: 2500,
          placeholder: 'Control, riesgo, estado: NOT_RUN / PASS / FAIL / BLOCKED, responsable y siguiente paso…',
          value: note
        }),
        h(
          'p',
          { id: `capstone-status-${i}`, className: 'small-note' },
          valid
            ? 'Estructura lista. Marca el hito si revisaste la evidencia.'
            : 'Pendiente: mínimo 45 caracteres y estado PASS/FAIL/NOT_RUN/BLOCKED.'
        )
      );
    }),
    spacer(),
    tag(`${state.capstoneDone.length}/8 hitos declarados`),
    h('p', { className: 'small-note' }, 'Las notas son autodeclaradas; sin ejecución ni aprobación externa.')
  );
}
function TabContent(props: Props) {
  const c = props.scenario,
    decision = props.state.seniorDecisions[c.id],
    correct = decision === c.correct;
  const evidence = props.state.seniorEvidence[c.id] || '';
  if (props.tab === 'investigar')
    return h(
      'section',
      { className: 'case-panel' },
      h('div', { className: 'eyebrow' }, 'ETAPA 01 · INVESTIGACIÓN'),
      h('h2', {}, '¿Qué está ocurriendo?'),
      h('p', {}, c.subtitle),
      reviewBox('Tu misión', c.mission),
      h('h3', {}, 'Artefactos del incidente'),
      h('p', {}, c.artifacts),
      spacer(),
      h(
        'a',
        { className: 'btn btn-sm btn-soft', href: `./assets/senior/${c.id}.zip`, download: `${c.id}-incident.zip` },
        '↓ Descargar artefactos del incidente'
      ),
      spacer(),
      h('div', { className: 'alert' }, h('b', {}, 'Prueba negativa: '), c.negative),
      h(Simulator, props),
      h('div', { className: 'space24' }),
      h(
        'div',
        { className: 'flex-wrap' },
        h('a', { className: 'btn btn-sm btn-soft', href: '#/planes' }, 'Explorar un plan ficticio →'),
        h('a', { className: 'btn btn-sm btn-soft', href: '#/grafo' }, 'Explorar dependencias →'),
        action('Tomar una decisión →', 'case-tab', 'decision', 'btn btn-primary btn-sm')
      )
    );
  if (props.tab === 'decision')
    return h(
      'section',
      { className: 'case-panel' },
      h('div', { className: 'eyebrow' }, 'ETAPA 02 · DECISIÓN'),
      h('h2', {}, 'Escoge una respuesta defendible'),
      h('p', {}, c.mission),
      spacer(),
      ...c.choices.map((choice, i) =>
        h(
          'button',
          {
            type: 'button',
            className: `quiz-answer ${decision === i ? (correct ? 'correct' : 'incorrect') : ''}`,
            'data-action': 'case-decision',
            'data-id': c.id,
            'data-index': i
          },
          h('span', { className: 'quiz-letter' }, String.fromCharCode(65 + i)),
          choice
        )
      ),
      decision !== undefined
        ? h(
            'div',
            { className: `feedback ${correct ? '' : 'fail'}`, role: 'status' },
            h('h3', {}, correct ? '✓ Decisión defendible' : '○ Se requiere una opción más segura'),
            h('p', {}, c.explanation)
          )
        : null,
      h('div', { className: 'space24' }),
      action('Continuar al review →', 'case-tab', 'review')
    );
  if (props.tab === 'review')
    return h(
      'section',
      { className: 'case-panel' },
      h('div', { className: 'eyebrow' }, 'ETAPA 03 · CODE / ARCHITECTURE REVIEW'),
      h('h2', {}, 'Hallazgos y límites de prueba'),
      h(
        'p',
        {},
        'Revisa el peligro antes de recomendar cambios. Los artefactos de este caso son sintéticos; se exige una hipótesis verificable.'
      ),
      reviewBox(`Hallazgo principal (${c.pillar})`, c.negative),
      reviewBox('Acción profesional esperada', c.mission),
      reviewBox('Qué revisar en un PR / RFC', c.artifacts),
      h(ReviewSnippet, { scenario: c, showFix: props.showFix }),
      h('h3', {}, 'Rúbrica de revisión'),
      ...[
        'Impacto y blast radius explícitos',
        'Evidencia reproducible con fuente y fecha',
        'Control preventivo y criterio GO/NO-GO',
        'Rollback o procedimiento de contención'
      ].map((step) => stage(`✓ ${step}`)),
      h('div', { className: 'space24' }),
      action('Documentar evidencia →', 'case-tab', 'evidencia')
    );
  if (props.tab === 'evidencia')
    return h(
      'section',
      { className: 'case-panel' },
      h('div', { className: 'eyebrow' }, 'ETAPA 04 · EVIDENCIA / ADR'),
      h('h2', {}, 'Documenta tu decisión'),
      h(
        'p',
        {},
        'La web comprueba secciones y longitud, no la veracidad de tu ADR; no certifica calidad ni ejecución real.'
      ),
      reviewBox('Contrato de evidencia', c.evidence),
      h(
        'label',
        { className: 'field-label', htmlFor: 'senior-evidence' },
        'Tu ADR o explicación técnica (almacenada localmente)'
      ),
      h('textarea', {
        className: 'evidence-textarea',
        'data-input': 'case-evidence',
        'data-id': c.id,
        id: 'senior-evidence',
        value: evidence,
        placeholder: 'Contexto…\nDecisión y alternativas…\nRiesgos…\nEvidencia: NOT_RUN…\nRollback…'
      }),
      h(
        'p',
        { className: 'small-note', id: 'evidence-count' },
        `${evidence.trim().length} caracteres. Mínimo: 120 y cinco secciones.`
      ),
      h('div', { className: 'space24' }),
      action('↓ Exportar mi ADR', 'export-senior', c.id, 'btn btn-soft'),
      ' ',
      action('Preparar operaciones →', 'case-tab', 'operaciones')
    );
  return h(
    'section',
    { className: 'case-panel' },
    h('div', { className: 'eyebrow' }, 'ETAPA 05 · OPERACIONES / HANDOFF'),
    h('h2', {}, '¿Qué ocurre después?'),
    h('p', {}, 'Diseña controles y handoff sin inventar ejecuciones que no han ocurrido.'),
    ...[
      'Antes del cambio: autorizar, respaldar y verificar owners.',
      'Durante el cambio: monitorear y detener ante un gate fallido.',
      'Si falla: contención y rollback diseñado.',
      'Después: guardar evidencia real con estado y comunicar resultados.'
    ].map((text, i) => stage(`${i + 1}. ${text}`)),
    reviewBox('Escenario de rehabilitación', c.negative),
    c.id === 'S18' ? h(Capstone, { state: props.state }) : null,
    h('div', { className: 'space24' }),
    action('← Revisar mi ADR', 'case-tab', 'evidencia')
  );
}
export function SeniorCasePage(props: Props) {
  const c = props.scenario,
    state = props.state;
  const checked = state.seniorChecklist[c.id] || [],
    done = state.seniorCompleted.includes(c.id),
    gate = seniorGate(state, c);
  const idx = props.cases.findIndex((x) => x.id === c.id),
    prev = props.cases[idx - 1],
    next = props.cases[idx + 1];
  const tabs = [
    ['investigar', 'Investigar'],
    ['decision', 'Decisión'],
    ['review', 'Code Review'],
    ['evidencia', 'Evidencia'],
    ['operaciones', 'Operaciones']
  ];
  return h(
    'div',
    { id: 'preact-senior-case' },
    h(
      'div',
      { className: 'breadcrumb' },
      h('a', { href: '#/inicio' }, 'Inicio'),
      ' / ',
      h('a', { href: '#/senior' }, 'Senior Mode'),
      ` / ${c.id}`
    ),
    h(
      'div',
      { className: 'flex-wrap' },
      tag(c.id),
      tag(c.severity, c.severity === 'Crítico' ? 'red' : 'yellow'),
      tag(c.pillar, 'cyan'),
      h('span', { id: 'current-case-status' }, tag(done ? '✓ Autoevaluado' : 'Caso abierto', done ? 'green' : 'purple'))
    ),
    h('h1', { className: 'page-title', style: 'max-width:1080px' }, c.title),
    h('p', { className: 'page-lead', style: 'max-width:1100px' }, c.subtitle),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'case-details' },
      h(
        'div',
        {},
        h(
          'nav',
          { className: 'case-steps', 'aria-label': 'Fases del caso' },
          ...tabs.map(([id, title], i) =>
            h(
              'button',
              {
                type: 'button',
                className: `tab ${props.tab === id ? 'active' : ''}`,
                'data-action': 'case-tab',
                'data-id': id,
                'aria-current': props.tab === id ? 'step' : undefined
              },
              `${i + 1}. ${title}`
            )
          )
        ),
        h(TabContent, props),
        h('div', { className: 'space24' }),
        h(
          'div',
          { className: 'case-panel' },
          h(
            'div',
            { className: 'flex space-between' },
            h(
              'div',
              {},
              h('div', { className: 'eyebrow' }, 'GATE DE AUTOEVALUACIÓN'),
              h('h2', {}, '¿Caso completado?')
            ),
            h(
              'span',
              { id: 'senior-gate-status' },
              tag(done ? '✓ Autoevaluado' : 'Pendiente', done ? 'green' : 'yellow')
            )
          ),
          h(
            'p',
            {},
            'Se requiere decisión y what-if correctos, cuatro controles y un ADR con cinco secciones. Es autoevaluación, no verificación del contenido ni pruebas reales.'
          ),
          ...gate.reasons.map((r) => stage(`○ ${r}`)),
          spacer(),
          action(`↓ Exportar informe/ADR ${c.id}`, 'export-senior', c.id, 'btn btn-soft'),
          ' ',
          h(
            'button',
            {
              type: 'button',
              className: 'btn btn-primary',
              'data-action': 'finish-case',
              'data-id': c.id,
              disabled: !gate.ok
            },
            done ? '✓ Revalidar caso' : '♛ Marcar autoevaluación completa'
          )
        ),
        spacer(),
        h('a', { href: '#/evidencias', className: 'btn btn-soft' }, 'Ver evidencia CLI real →'),
        h(
          'div',
          { className: 'lesson-footer' },
          h(
            'a',
            { className: 'btn', href: prev ? `#/senior/${prev.id}` : '#/senior' },
            prev ? `← ${prev.id} · ${prev.title}` : '← Todos los casos'
          ),
          h(
            'a',
            { className: 'btn btn-primary', href: next ? `#/senior/${next.id}` : '#/senior' },
            next ? `${next.id} →` : 'Volver al dashboard'
          )
        )
      ),
      h(
        'aside',
        { className: 'case-sidebar' },
        h(
          'div',
          { className: 'content-panel' },
          h('div', { className: 'flex space-between' }, h('h3', {}, 'Ficha del incidente'), tag('FICTICIO', 'yellow')),
          h('img', {
            className: 'side-terra',
            src: `./assets/terra/${done ? 'exito' : 'arquitectura'}.png`,
            alt: 'Terra analizando arquitectura'
          }),
          stage(`Severidad: ${c.severity}`),
          stage(`Dominio: ${c.pillar}`),
          stage(`Puntos: ${c.xp} XP`),
          stage(`Evidencia: ${c.mode}`)
        ),
        h(
          'div',
          { className: 'content-panel' },
          h('h3', {}, 'Autoverificación'),
          ...c.checklist.map((text, i) =>
            h(
              'label',
              { className: 'check-row' },
              h('input', {
                type: 'checkbox',
                'data-input': 'case-check',
                'data-id': c.id,
                'data-index': i,
                checked: checked.includes(i)
              }),
              text
            )
          ),
          h(
            'p',
            { className: 'small-note' },
            'Estas casillas son declaraciones del estudiante, no pruebas automatizadas.'
          )
        )
      )
    )
  );
}
