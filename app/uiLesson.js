import { getLessonSeniorContext } from './lessonSeniorContext.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';
const STEP_GUIDE = [
    'Lee el concepto y el resultado esperado.',
    'Completa la línea TODO en main.tf.',
    'Pulsa “Evaluar reglas” (no CLI).',
    'Responde el quiz correctamente.',
    'Descarga y ejecuta la práctica local.'
];
const LOCAL_CLI_COMMANDS = [
    'terraform fmt -check',
    'terraform init -backend=false',
    'terraform validate',
    'terraform test'
];
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
function progressBar(done, total, labelText) {
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
export function EvaluationFeedback({ result }) {
    return h('div', {
        className: `feedback ${result.ok ? '' : 'fail'}`.trim(),
        role: 'status',
        'aria-live': 'polite'
    }, h('h3', {}, result.ok ? '✓ Reglas educativas superadas' : '⚠ Aún hay condiciones por corregir'), h('ul', {}, ...result.checks.map((item) => h('li', { key: item.label }, `${item.ok ? '✓' : '○'} ${item.label}`))), h('p', { className: 'provenance' }, `PROCEDENCIA: ${result.provenance} · ${result.note}`));
}
export function LessonClassroom({ lesson, lessons, state, evalResult }) {
    const code = state.code[lesson.id] ?? lesson.starter;
    const selected = state.quizAnswers[lesson.id];
    const correctQuiz = selected === lesson.correct;
    const done = state.completed.includes(lesson.id);
    const isFavorite = state.favorites.includes(lesson.id);
    const idx = lessons.findIndex((item) => item.id === lesson.id);
    const prev = idx > 0 ? lessons[idx - 1] : undefined;
    const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined;
    const levelCompletedCount = state.completed.filter((id) => id.startsWith(lesson.id[0])).length;
    return h('div', { id: 'lesson-classroom', key: lesson.id }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('a', { href: ROUTES.learn }, 'Aprender'), ` / ${lesson.level} / `, h('span', {}, lesson.id)), h('div', { className: 'lesson-header' }, h('div', { className: 'flex-wrap' }, chip(`Lección ${lesson.id}`, 'purple'), chip(lesson.level, 'cyan'), done ? chip('✓ Completada', 'green') : chip(`${lesson.xp} XP`, 'purple'), state.seniorEnabled ? chip('♛ Senior Mode activo', 'yellow') : null, h('button', {
        type: 'button',
        className: 'btn btn-sm',
        'data-action': 'favorite',
        'data-id': lesson.id,
        'aria-pressed': String(isFavorite)
    }, isFavorite ? '★ Guardado' : '☆ Favorito')), h('h1', { className: 'page-title' }, lesson.title), h('p', { className: 'page-lead' }, lesson.subtitle), h('div', { className: 'space12' }), progressBar(levelCompletedCount, 12, `Progreso nivel ${lesson.level}`)), h('div', { className: 'lesson-layout' }, h('div', { className: 'lesson-main' }, h('section', { className: 'content-panel' }, h('div', { className: 'objective-strip' }, h('div', { className: 'flex-1' }, h('div', { className: 'eyebrow' }, `CONCEPTO · ${lesson.level.toUpperCase()}`), h('h2', { className: 'my-8' }, 'Lo que aprenderás'), h('p', { className: 'prose' }, lesson.concept)), h('img', { src: mascotUrl('leyendo'), alt: 'Terra leyendo un manual' })), h('div', { className: 'concept-grid' }, h('div', { className: 'concept-tile' }, h('strong', {}, '01 · Comprender'), lesson.subtitle), h('div', { className: 'concept-tile' }, h('strong', {}, '02 · Practicar'), 'Editar HCL y comprobar condiciones específicas de esta lección.'), h('div', { className: 'concept-tile' }, h('strong', {}, '03 · Verificar'), 'Resolver el quiz y, si aplica, ejecutar pruebas CLI en tu equipo.'))), h('div', { className: 'mission-banner' }, h('strong', {}, '🎯 TU MISIÓN'), 'Completa el bloque marcado como TODO para conseguir las condiciones esperadas. Después responde la pregunta de conocimiento. ', h('b', {}, 'La web no ejecuta HCL ni Terraform CLI.')), h('section', { className: 'editor-card' }, h('div', { className: 'editor-toolbar' }, h('div', { className: 'flex' }, h('span', { className: 'icon-file-tab', 'aria-hidden': 'true' }, '▣'), h('span', { className: 'file-tab' }, 'main.tf')), h('span', { className: 'editor-tag' }, 'HCL · editor de texto')), h('label', { className: 'sr-only', htmlFor: 'code-editor' }, `Editor HCL de ${lesson.id}`), h('textarea', {
        id: 'code-editor',
        className: 'code-editor',
        'data-input': 'code',
        'data-id': lesson.id,
        spellcheck: false,
        autoCapitalize: 'off',
        'aria-label': 'Editor main.tf',
        defaultValue: code
    }), h('div', { className: 'editor-bottom' }, h('div', { className: 'flex' }, h('button', {
        type: 'button',
        className: 'btn btn-primary btn-sm',
        'data-action': 'evaluate',
        'data-id': lesson.id
    }, '▶ Evaluar reglas'), h('button', { type: 'button', className: 'btn btn-sm', 'data-action': 'hint', 'data-id': lesson.id }, '✦ Pista'), h('button', { type: 'button', className: 'btn btn-sm', 'data-action': 'solution', 'data-id': lesson.id }, 'Ver solución')), h('div', { className: 'flex' }, h('button', { type: 'button', className: 'btn btn-sm', 'data-action': 'reset-code', 'data-id': lesson.id }, '↺ Restablecer'), h('button', { type: 'button', className: 'btn btn-sm', 'data-action': 'download-code', 'data-id': lesson.id }, '↓ .tf')))), evalResult ? h(EvaluationFeedback, { result: evalResult }) : null, h('section', { className: 'content-panel' }, h('div', { className: 'eyebrow' }, 'COMPRENSIÓN'), h('h2', { className: 'mt-9' }, 'Pon a prueba tu criterio'), h('p', { className: 'prose' }, lesson.question), h('div', { className: 'space16' }), ...lesson.options.map((opt, i) => {
        const isSelected = selected === i;
        const toneClass = isSelected ? (correctQuiz ? 'selected correct' : 'selected incorrect') : '';
        return h('button', {
            key: `${lesson.id}-opt-${i}`,
            type: 'button',
            className: `quiz-answer ${toneClass}`.trim(),
            'data-action': 'answer-quiz',
            'data-id': lesson.id,
            'data-index': i,
            'aria-pressed': String(isSelected)
        }, h('span', { className: 'quiz-letter' }, String.fromCharCode(65 + i)), h('span', {}, opt));
    }), selected !== undefined
        ? h('div', {}, h('div', { className: 'space16' }), h('div', {
            className: `feedback ${correctQuiz ? '' : 'fail'}`.trim(),
            role: 'status',
            'aria-live': 'polite'
        }, h('h3', {}, correctQuiz ? '✓ Respuesta correcta' : '⨯ Esa opción no es correcta'), h('p', {}, correctQuiz
            ? 'Buen criterio. Ahora comprueba las reglas HCL.'
            : `Revisa la explicación y vuelve a intentarlo. Pista: ${lesson.tip}`)))
        : null), h('div', { className: 'flex-wrap' }, done ? chip('✓ Lección completada', 'green') : chip('Pendiente: evaluación + quiz', 'yellow'), h('a', {
        href: `./assets/labs/${lesson.id}.zip`,
        download: `${lesson.id}-lab.zip`,
        className: 'btn btn-soft'
    }, '⬇ Descargar laboratorio'), h('a', { href: ROUTES.graph, className: 'btn btn-sm' }, 'Ver grafos →')), h('div', { className: 'space16' }), h('a', { href: ROUTES.evidence, className: 'btn btn-soft' }, 'Ver evidencia CLI real →'), h('div', { className: 'lesson-footer' }, prev
        ? h('a', { href: `#/leccion/${prev.id}`, className: 'btn' }, `← ${prev.id} · ${prev.title}`)
        : h('a', { href: ROUTES.learn, className: 'btn' }, '← Ver currículo'), next
        ? h('a', { href: `#/leccion/${next.id}`, className: 'btn btn-primary' }, `Siguiente: ${next.id} →`)
        : h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Ir a Senior Mode →')), state.seniorEnabled
        ? (() => {
            const seniorCtx = getLessonSeniorContext(lesson.id);
            return h('section', { className: 'case-review', id: 'lesson-senior-callout' }, h('div', { className: 'flex space-between wrap gap-8 mb-8' }, h('b', {}, `♛ PREGUNTA DE ARQUITECTURA · ${lesson.id}`), chip(`${seniorCtx.domain} · ${seniorCtx.relatedCaseId}`, 'yellow')), h('p', { className: 'mb-8' }, h('strong', {}, 'Riesgo en producción: '), seniorCtx.productionRisk), h('p', {}, seniorCtx.architecturePrompt), h('div', { className: 'space12' }), h('div', { className: 'flex-wrap' }, h('a', { href: `#/senior/${seniorCtx.relatedCaseId}`, className: 'btn btn-sm btn-primary' }, `Resolver incidente ${seniorCtx.relatedCaseId} →`), h('a', { href: ROUTES.senior, className: 'btn btn-sm btn-soft' }, 'Mapa Senior completo →')));
        })()
        : null), h('aside', { className: 'lesson-aside' }, h('div', { className: 'content-panel' }, h('h3', {}, 'Paso a paso'), ...STEP_GUIDE.map((stepText, i) => h('div', { key: stepText, className: `side-step ${i === 0 ? 'active' : ''}`.trim() }, `${i + 1}. ${stepText}`))), h('div', { className: 'content-panel' }, h('img', {
        src: mascotUrl(done ? 'exito' : 'idea'),
        className: 'side-terra',
        alt: 'Mascota Terra ofreciendo ayuda'
    }), h('p', { className: 'side-note' }, done
        ? '¡Lección completada! Puedes repetirla cuando quieras.'
        : 'Terra te acompaña. Pide una pista cuando te atasques.'), h('div', { className: 'space12' }), h('div', { className: 'side-caution' }, lesson.warning)), h('div', { className: 'content-panel' }, h('h3', {}, 'Práctica local'), h('p', { className: 'card-desc' }, 'En tu equipo con Terraform CLI instalado, tras descomprimir el pack:'), ...LOCAL_CLI_COMMANDS.map((cmd) => h('div', { key: cmd, className: 'terminal-command' }, h('code', {}, cmd), h('button', { type: 'button', 'data-action': 'copy', 'data-value': cmd }, 'Copiar'))), h('p', { className: 'small-note' }, 'Los comandos no se ejecutan en el navegador. Los resultados CLI están sin verificar en esta sesión.')))));
}
