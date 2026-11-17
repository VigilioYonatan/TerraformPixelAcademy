/**
 * Declarative Preact HCL Lesson Classroom (`#/leccion/:id` — `F3-03`).
 * Renders theory, objectives, CodeMirror 6 host `<textarea>`, browser rule feedback,
 * interactive comprehension quiz with `aria-live`, lab `.zip` download, and CLI guide
 * without destroying editor DOM focus across evaluations or quiz selections.
 */
import type { Lesson } from './curriculum.js';
import type { AcademyState, EvalResult } from './engine.js';
import { getLessonSeniorContext } from './lessonSeniorContext.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface LessonClassroomProps {
  lesson: Lesson;
  lessons: readonly Lesson[];
  state: AcademyState;
  evalResult: EvalResult | undefined;
}

const STEP_GUIDE = [
  'Lee el concepto y el resultado esperado.',
  'Completa la línea TODO en main.tf.',
  'Pulsa “Evaluar reglas” (no CLI).',
  'Responde el quiz correctamente.',
  'Descarga y ejecuta la práctica local.'
] as const;

const LOCAL_CLI_COMMANDS = [
  'terraform fmt -check',
  'terraform init -backend=false',
  'terraform validate',
  'terraform test'
] as const;

function chip(text: string, variant = 'purple') {
  return h('span', { className: `chip chip-${variant}` }, text);
}

function progressBar(done: number, total: number, labelText: string) {
  const safeMax = Math.max(1, total);
  const clamped = Math.min(safeMax, Math.max(0, done));
  return h('progress', {
    className: 'progress-native',
    value: total ? clamped : 0,
    max: safeMax,
    'aria-label': labelText,
    'aria-valuenow': done,
    'aria-valuemin': 0,
    'aria-valuemax': total
  });
}

function LessonFlowDiagram({ level, id }: { level: Lesson['level']; id: string }) {
  const steps =
    level === 'Básico'
      ? [
          ['1. Bloque HCL', 'Declara recurso / variable'],
          ['2. Reglas & Plan', 'Verifica estructura y diff'],
          ['3. State & Output', `Evidencia ${id} local`]
        ]
      : level === 'Intermedio'
        ? [
            ['1. Módulo / Contrato', 'Entradas tipadas y validaciones'],
            ['2. Validate & Test', 'Pruebas en copia aislada'],
            ['3. State Seguro', `Aislamiento ${id} reproducible`]
          ]
        : [
            ['1. OIDC & Policy', 'Identidad efímera y Rego'],
            ['2. Release Gate', 'Revisión de drift y orden'],
            ['3. Multi-Ambiente', `Control ${id} sin secretos`]
          ];

  return h(
    'div',
    { className: 'diagram-card' },
    h('div', { className: 'eyebrow mb-8' }, `MAPA VISUAL · ${level.toUpperCase()}`),
    h(
      'svg',
      {
        className: 'diagram-svg',
        viewBox: '0 0 680 104',
        role: 'img',
        'aria-label': `Flujo conceptual de ${id}: ${steps.map((s) => s[0]).join(' hacia ')}`
      },
      h(
        'defs',
        {},
        h(
          'marker',
          { id: `lesson-arrow-${id}`, markerWidth: '8', markerHeight: '8', refX: '6', refY: '4', orient: 'auto' },
          h('path', { d: 'M 0 0 L 8 4 L 0 8 z', className: 'diagram-arrow-head' })
        )
      ),
      ...steps.flatMap(([title, sub], idx) => {
        const x = 12 + idx * 232;
        const els = [
          h('rect', {
            key: `rect-${idx}`,
            x,
            y: 12,
            width: 192,
            height: 78,
            rx: 12,
            className: idx === 2 ? 'diagram-node-ok' : 'diagram-node'
          }),
          h('text', { key: `t-${idx}`, x: x + 16, y: 40, className: 'diagram-title' }, title),
          h('text', { key: `s-${idx}`, x: x + 16, y: 64, className: 'diagram-sub' }, sub)
        ];
        if (idx < 2) {
          els.push(
            h('line', {
              key: `line-${idx}`,
              x1: x + 196,
              y1: 51,
              x2: x + 226,
              y2: 51,
              className: 'diagram-arrow',
              'marker-end': `url(#lesson-arrow-${id})`
            })
          );
        }
        return els;
      })
    )
  );
}

export function EvaluationFeedback({ result }: { result: EvalResult }) {
  return h(
    'div',
    {
      className: `feedback ${result.ok ? '' : 'fail'}`.trim(),
      role: 'status',
      'aria-live': 'polite'
    },
    h('h3', {}, result.ok ? '✓ Reglas educativas superadas' : '⚠ Aún hay condiciones por corregir'),
    h('ul', {}, ...result.checks.map((item) => h('li', { key: item.label }, `${item.ok ? '✓' : '○'} ${item.label}`))),
    h('p', { className: 'provenance' }, `PROCEDENCIA: ${result.provenance} · ${result.note}`)
  );
}

export function LessonClassroom({ lesson, lessons, state, evalResult }: LessonClassroomProps) {
  const code = state.code[lesson.id] ?? lesson.starter;
  const selected = state.quizAnswers[lesson.id];
  const correctQuiz = selected === lesson.correct;
  const done = state.completed.includes(lesson.id);
  const isFavorite = state.favorites.includes(lesson.id);
  const idx = lessons.findIndex((item) => item.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined;
  const levelCompletedCount = state.completed.filter((id) => id.startsWith(lesson.id[0])).length;

  return h(
    'div',
    { id: 'lesson-classroom', key: lesson.id },
    h(
      'div',
      { className: 'breadcrumb' },
      h('a', { href: ROUTES.home }, 'Inicio'),
      ' / ',
      h('a', { href: ROUTES.learn }, 'Aprender'),
      ` / ${lesson.level} / `,
      h('span', {}, lesson.id)
    ),
    h(
      'div',
      { className: 'lesson-header' },
      h(
        'div',
        { className: 'flex-wrap' },
        chip(`Lección ${lesson.id}`, 'purple'),
        chip(lesson.level, 'cyan'),
        done ? chip('✓ Completada', 'green') : chip(`${lesson.xp} XP`, 'purple'),
        state.seniorEnabled ? chip('♛ Senior Mode activo', 'yellow') : null,
        h(
          'button',
          {
            type: 'button',
            className: 'btn btn-sm',
            'data-action': 'favorite',
            'data-id': lesson.id,
            'aria-pressed': String(isFavorite)
          },
          isFavorite ? '★ Guardado' : '☆ Favorito'
        )
      ),
      h('h1', { className: 'page-title' }, lesson.title),
      h('p', { className: 'page-lead' }, lesson.subtitle),
      h('div', { className: 'space12' }),
      progressBar(levelCompletedCount, 12, `Progreso nivel ${lesson.level}`)
    ),
    h(
      'div',
      { className: 'lesson-layout' },
      h(
        'div',
        { className: 'lesson-main' },
        h(
          'section',
          { className: 'content-panel' },
          h(
            'div',
            { className: 'objective-strip' },
            h(
              'div',
              { className: 'flex-1' },
              h('div', { className: 'eyebrow' }, `CONCEPTO · ${lesson.level.toUpperCase()}`),
              h('h2', { className: 'my-8' }, 'Lo que aprenderás'),
              h('p', { className: 'prose' }, lesson.concept)
            ),
            h('img', { src: mascotUrl('leyendo'), alt: 'Terra leyendo un manual' })
          ),
          h(LessonFlowDiagram, { level: lesson.level, id: lesson.id }),
          h(
            'div',
            { className: 'concept-grid' },
            h('div', { className: 'concept-tile' }, h('strong', {}, '01 · Comprender'), lesson.subtitle),
            h(
              'div',
              { className: 'concept-tile' },
              h('strong', {}, '02 · Practicar'),
              'Editar HCL y comprobar condiciones específicas de esta lección.'
            ),
            h(
              'div',
              { className: 'concept-tile' },
              h('strong', {}, '03 · Verificar'),
              'Resolver el quiz y, si aplica, ejecutar pruebas CLI en tu equipo.'
            )
          )
        ),
        h(
          'div',
          { className: 'mission-banner' },
          h('strong', {}, '🎯 TU MISIÓN'),
          'Completa el bloque marcado como TODO para conseguir las condiciones esperadas. Después responde la pregunta de conocimiento. ',
          h('b', {}, 'La web no ejecuta HCL ni Terraform CLI.')
        ),
        h(
          'section',
          { className: 'editor-card' },
          h(
            'div',
            { className: 'editor-toolbar' },
            h(
              'div',
              { className: 'flex' },
              h('span', { className: 'icon-file-tab', 'aria-hidden': 'true' }, '▣'),
              h('span', { className: 'file-tab' }, 'main.tf')
            ),
            h('span', { className: 'editor-tag' }, 'HCL · editor de texto')
          ),
          h('label', { className: 'sr-only', htmlFor: 'code-editor' }, `Editor HCL de ${lesson.id}`),
          h('textarea', {
            id: 'code-editor',
            className: 'code-editor',
            'data-input': 'code',
            'data-id': lesson.id,
            spellcheck: false,
            autoCapitalize: 'off',
            'aria-label': 'Editor main.tf',
            defaultValue: code
          }),
          h(
            'div',
            { className: 'editor-bottom' },
            h(
              'div',
              { className: 'flex' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'btn btn-primary btn-sm',
                  'data-action': 'evaluate',
                  'data-id': lesson.id
                },
                '▶ Evaluar reglas'
              ),
              h(
                'button',
                { type: 'button', className: 'btn btn-sm', 'data-action': 'hint', 'data-id': lesson.id },
                '✦ Pista'
              ),
              h(
                'button',
                { type: 'button', className: 'btn btn-sm', 'data-action': 'solution', 'data-id': lesson.id },
                'Ver solución'
              )
            ),
            h(
              'div',
              { className: 'flex' },
              h(
                'button',
                { type: 'button', className: 'btn btn-sm', 'data-action': 'reset-code', 'data-id': lesson.id },
                '↺ Restablecer'
              ),
              h(
                'button',
                { type: 'button', className: 'btn btn-sm', 'data-action': 'download-code', 'data-id': lesson.id },
                '↓ .tf'
              )
            )
          )
        ),
        evalResult ? h(EvaluationFeedback, { result: evalResult }) : null,
        h(
          'section',
          { className: 'content-panel' },
          h('div', { className: 'eyebrow' }, 'COMPRENSIÓN'),
          h('h2', { className: 'mt-9' }, 'Pon a prueba tu criterio'),
          h('p', { className: 'prose' }, lesson.question),
          h('div', { className: 'space16' }),
          ...lesson.options.map((opt, i) => {
            const isSelected = selected === i;
            const toneClass = isSelected ? (correctQuiz ? 'selected correct' : 'selected incorrect') : '';
            return h(
              'button',
              {
                key: `${lesson.id}-opt-${i}`,
                type: 'button',
                className: `quiz-answer ${toneClass}`.trim(),
                'data-action': 'answer-quiz',
                'data-id': lesson.id,
                'data-index': i,
                'aria-pressed': String(isSelected)
              },
              h('span', { className: 'quiz-letter' }, String.fromCharCode(65 + i)),
              h('span', {}, opt)
            );
          }),
          selected !== undefined
            ? h(
                'div',
                {},
                h('div', { className: 'space16' }),
                h(
                  'div',
                  {
                    className: `feedback ${correctQuiz ? '' : 'fail'}`.trim(),
                    role: 'status',
                    'aria-live': 'polite'
                  },
                  h('h3', {}, correctQuiz ? '✓ Respuesta correcta' : '⨯ Esa opción no es correcta'),
                  h(
                    'p',
                    {},
                    correctQuiz
                      ? 'Buen criterio. Ahora comprueba las reglas HCL.'
                      : `Revisa la explicación y vuelve a intentarlo. Pista: ${lesson.tip}`
                  )
                )
              )
            : null
        ),
        h(
          'div',
          { className: 'flex-wrap' },
          done ? chip('✓ Lección completada', 'green') : chip('Pendiente: evaluación + quiz', 'yellow'),
          h(
            'a',
            {
              href: `./assets/labs/${lesson.id}.zip`,
              download: `${lesson.id}-lab.zip`,
              className: 'btn btn-soft'
            },
            '⬇ Descargar laboratorio'
          ),
          h('a', { href: ROUTES.graph, className: 'btn btn-sm' }, 'Ver grafos →')
        ),
        h('div', { className: 'space16' }),
        h('a', { href: ROUTES.evidence, className: 'btn btn-soft' }, 'Ver evidencia CLI real →'),
        h(
          'div',
          { className: 'lesson-footer' },
          prev
            ? h('a', { href: `#/leccion/${prev.id}`, className: 'btn' }, `← ${prev.id} · ${prev.title}`)
            : h('a', { href: ROUTES.learn, className: 'btn' }, '← Ver currículo'),
          next
            ? h('a', { href: `#/leccion/${next.id}`, className: 'btn btn-primary' }, `Siguiente: ${next.id} →`)
            : h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Ir a Senior Mode →')
        ),
        state.seniorEnabled
          ? (() => {
              const seniorCtx = getLessonSeniorContext(lesson.id);
              return h(
                'section',
                { className: 'case-review', id: 'lesson-senior-callout' },
                h(
                  'div',
                  { className: 'flex space-between wrap gap-8 mb-8' },
                  h('b', {}, `♛ PREGUNTA DE ARQUITECTURA · ${lesson.id}`),
                  chip(`${seniorCtx.domain} · ${seniorCtx.relatedCaseId}`, 'yellow')
                ),
                h('p', { className: 'mb-8' }, h('strong', {}, 'Riesgo en producción: '), seniorCtx.productionRisk),
                h('p', {}, seniorCtx.architecturePrompt),
                h('div', { className: 'space12' }),
                h(
                  'div',
                  { className: 'flex-wrap' },
                  h(
                    'a',
                    { href: `#/senior/${seniorCtx.relatedCaseId}`, className: 'btn btn-sm btn-primary' },
                    `Resolver incidente ${seniorCtx.relatedCaseId} →`
                  ),
                  h('a', { href: ROUTES.senior, className: 'btn btn-sm btn-soft' }, 'Mapa Senior completo →')
                )
              );
            })()
          : null
      ),
      h(
        'aside',
        { className: 'lesson-aside' },
        h(
          'div',
          { className: 'content-panel' },
          h('h3', {}, 'Paso a paso'),
          ...STEP_GUIDE.map((stepText, i) =>
            h(
              'div',
              { key: stepText, className: `side-step ${i === 0 ? 'active' : ''}`.trim() },
              `${i + 1}. ${stepText}`
            )
          )
        ),
        h(
          'div',
          { className: 'content-panel' },
          h('img', {
            src: mascotUrl(done ? 'exito' : 'idea'),
            className: 'side-terra',
            alt: 'Mascota Terra ofreciendo ayuda'
          }),
          h(
            'p',
            { className: 'side-note' },
            done
              ? '¡Lección completada! Puedes repetirla cuando quieras.'
              : 'Terra te acompaña. Pide una pista cuando te atasques.'
          ),
          h('div', { className: 'space12' }),
          h('div', { className: 'side-caution' }, lesson.warning)
        ),
        h(
          'div',
          { className: 'content-panel' },
          h('h3', {}, 'Práctica local'),
          h('p', { className: 'card-desc' }, 'En tu equipo con Terraform CLI instalado, tras descomprimir el pack:'),
          ...LOCAL_CLI_COMMANDS.map((cmd) =>
            h(
              'div',
              { key: cmd, className: 'terminal-command' },
              h('code', {}, cmd),
              h('button', { type: 'button', 'data-action': 'copy', 'data-value': cmd }, 'Copiar')
            )
          ),
          h(
            'p',
            { className: 'small-note' },
            'Los comandos no se ejecutan en el navegador. Los resultados CLI están sin verificar en esta sesión.'
          )
        )
      )
    )
  );
}
