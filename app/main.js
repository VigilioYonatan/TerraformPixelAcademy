import { cliEvidenceMarkdown, parseCliManifest } from './cliEvidence.js';
import { getLesson, lessons, tracks } from './curriculum.js';
import { activateCodeEditor, disposeCodeEditor, updateEditorTheme } from './editor.js';
import { calculateXP, escapeHtml as e, evaluateLesson, reconcileLessonCompletion, sanitizeState, slugFilename } from './engine.js';
import { graphs, planFixtures } from './fixtures.js';
import { games } from './games.js';
import { inspectTerraformPlan } from './planInspector.js';
import { buildPlanReviewMarkdown } from './planReport.js';
import { emptyGateAnswers, evaluateReleaseGate, exportGateReview } from './releaseGate.js';
import { getCase, seniorCases } from './senior.js';
import { capstoneNoteValid, reconcileSeniorCompletion, seniorGate } from './seniorProgress.js';
import { buildSeniorPortfolio, buildSeniorReport } from './seniorReport.js';
import { evaluateSeniorDrill } from './seniorWhatIf.js';
import { cidrOverlap, estimateCost, planIntegrity } from './simulators.js';
import { createAcademyStore, filterGlossary, isCaseTabId } from './store.js';
import { LearningCatalog } from './uiCatalog.js';
import { CliEvidenceDashboard } from './uiCliEvidence.js';
import { HomePage, findNextLesson } from './uiHome.js';
import { SeniorCasePage } from './uiSeniorCase.js';
import { SeniorDashboard } from './uiSeniorHub.js';
import { ROUTES, iconFor, mascotUrl } from './uiShared.js';
import { AppShell } from './uiShell.js';
import { h, render as renderPreact } from './vendor/preact.mjs';
const appElement = document.getElementById('app');
if (!appElement) {
    throw new Error('No se encuentra #app');
}
const root = appElement;
const LESSON_IDS = lessons.map((item) => item.id);
const SENIOR_IDS = seniorCases.map((item) => item.id);
const store = createAcademyStore({ lessons, seniorCases });
let toastTimer;
const cls = (active, good = 'active') => (active ? good : '');
function notify(message, error = false) {
    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }
    const id = store.showToast(message, error);
    toastTimer = window.setTimeout(() => {
        store.clearToast(id);
    }, 3900);
}
function parseCurrentRoute() {
    const rawHash = location.hash || ROUTES.home;
    const [rawPath, rawQuery = ''] = rawHash.split('?');
    const parts = rawPath.replace(/^#\/?/, '').split('/').filter(Boolean);
    return {
        page: parts[0] || 'inicio',
        param: parts[1] || '',
        query: new URLSearchParams(rawQuery)
    };
}
function render() {
    const s = store.getState();
    const state = s.academy;
    document.body.dataset.theme = state.theme;
    document.body.classList.toggle('reduce-motion', state.reducedMotion);
    document.documentElement.style.fontSize = `${16 * state.fontScale}px`;
    const { page, param, query } = parseCurrentRoute();
    if (page === 'aprender') {
        const from = query.get('nivel');
        if (from && ['Básico', 'Intermedio', 'Avanzado'].includes(from) && s.activeLevel !== from) {
            s.activeLevel = from;
        }
    }
    // Preserve caret inside the transitional `#glossary-search` input until F3-08 migrates `#/recursos` to Preact
    const activeEl = document.activeElement;
    const restoreGlossaryCaret = page === 'recursos' && activeEl instanceof HTMLInputElement && activeEl.id === 'glossary-search'
        ? { start: activeEl.selectionStart, end: activeEl.selectionEnd }
        : null;
    if (page !== 'leccion') {
        disposeCodeEditor();
    }
    const seniorScenario = page === 'senior' && param ? getCase(param) : undefined;
    const declarativeView = page === 'inicio'
        ? h(HomePage, { state, lessons })
        : page === 'aprender'
            ? h(LearningCatalog, {
                lessons,
                tracks,
                state,
                level: s.activeLevel,
                searchQuery: s.lessonSearch
            })
            : page === 'senior' && !param
                ? h(SeniorDashboard, {
                    state,
                    cases: seniorCases,
                    searchQuery: s.seniorSearch
                })
                : page === 'senior' && seniorScenario
                    ? h(SeniorCasePage, {
                        scenario: seniorScenario,
                        cases: seniorCases,
                        state,
                        tab: s.caseTab,
                        showFix: s.showSeniorFix,
                        simResult: s.seniorSimResult,
                        cidrA: s.simInputs.cidrA,
                        cidrB: s.simInputs.cidrB,
                        approvedCommit: s.simInputs.approvedCommit,
                        appliedCommit: s.simInputs.appliedCommit,
                        replicas: s.simInputs.simulatedReplicas
                    })
                    : page === 'evidencias'
                        ? h(CliEvidenceDashboard, {
                            manifest: s.cliManifest,
                            error: s.cliManifestError
                        })
                        : undefined;
    const legacyContent = declarativeView
        ? ''
        : page === 'leccion'
            ? lessonView(param)
            : page === 'juegos'
                ? gamesHub()
                : page === 'juego'
                    ? gameView(param)
                    : page === 'laboratorios'
                        ? labsView()
                        : page === 'grafo'
                            ? graphView()
                            : page === 'planes'
                                ? planView()
                                : page === 'progreso'
                                    ? progressView()
                                    : page === 'ajustes'
                                        ? settingsView()
                                        : page === 'recursos'
                                            ? resourcesView()
                                            : notFound();
    renderPreact(h(AppShell, {
        page,
        mobileMenu: s.mobileMenu,
        seniorEnabled: state.seniorEnabled,
        content: legacyContent,
        view: declarativeView,
        toast: s.toast
    }), root);
    if (restoreGlossaryCaret) {
        const nextInput = document.getElementById('glossary-search');
        if (nextInput instanceof HTMLInputElement) {
            nextInput.focus();
            if (restoreGlossaryCaret.start !== null && restoreGlossaryCaret.end !== null) {
                nextInput.setSelectionRange(restoreGlossaryCaret.start, restoreGlossaryCaret.end);
            }
        }
    }
    if (page === 'leccion' && getLesson(param)) {
        void activateCodeEditor((value) => {
            const lessonId = param;
            const snapshot = store.getState();
            snapshot.academy.code[lessonId] = value.slice(0, 30000);
            delete snapshot.evals[lessonId];
            const invalidated = reconcileLessonCompletion(snapshot.academy, lessons);
            if (invalidated.length > 0) {
                disposeCodeEditor();
                store.update(() => { }, { persist: true });
            }
            else {
                store.persistQuietly();
            }
        }, state.theme);
    }
}
store.subscribe(render);
function link(text, path, style = 'btn btn-soft') {
    return `<a href="${path}" class="${style}">${text}</a>`;
}
function label(text, variant = 'purple') {
    return `<span class="chip chip-${variant}">${e(text)}</span>`;
}
function sectionHead(eyebrow, title, side = '') {
    return `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${side}</div>`;
}
function bar(done, total) {
    const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
    return `<div class="progress-track" role="progressbar" aria-label="Progreso" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}"><div class="progress-fill" style="width:${pct}%"></div></div>`;
}
function stats() {
    const state = store.getState().academy;
    const done = state.completed.length;
    const seniorDone = state.seniorCompleted.length;
    const gamesWon = Object.values(state.gameWins).reduce((a, b) => a + b, 0);
    return `<div class="cards-4"><div class="stat-pill"><span style="font-size:27px">✧</span><div><div class="number">${calculateXP(state).toLocaleString('es-PE')}</div><div class="caption">XP de práctica</div></div></div><div class="stat-pill"><span style="font-size:27px">▣</span><div><div class="number">${done}/36</div><div class="caption">Lecciones evaluadas</div></div></div><div class="stat-pill"><span style="font-size:27px">♛</span><div><div class="number">${seniorDone}/18</div><div class="caption">Casos Senior completados*</div></div></div><div class="stat-pill"><span style="font-size:27px">◆</span><div><div class="number">${gamesWon}</div><div class="caption">Juegos ganados</div></div></div></div>`;
}
function levelLessons(level) {
    return lessons.filter((l) => l.level === level);
}
let lastRenderedLessonId = '';
function lessonView(id) {
    const l = id ? getLesson(id) : undefined;
    if (!l)
        return notFound();
    if (lastRenderedLessonId !== l.id) {
        disposeCodeEditor();
        lastRenderedLessonId = l.id;
    }
    const s = store.getState();
    const state = s.academy;
    const code = state.code[l.id] ?? l.starter;
    const evalResult = s.evals[l.id];
    const selected = state.quizAnswers[l.id];
    const correctQuiz = selected === l.correct;
    const done = state.completed.includes(l.id);
    const idx = lessons.findIndex((x) => x.id === id);
    const prev = lessons[idx - 1];
    const next = lessons[idx + 1];
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <a href="${ROUTES.learn}">Aprender</a> / ${e(l.level)} / <span>${e(l.id)}</span></div><div class="lesson-header"><div class="flex-wrap">${label(`Lección ${l.id}`, 'purple')}${label(l.level, 'cyan')}${done ? label('✓ Completada', 'green') : label(`${l.xp} XP`, 'purple')}${state.seniorEnabled ? label('♛ Senior Mode activo', 'yellow') : ''}<button type="button" class="btn btn-sm" data-action="favorite" data-id="${l.id}" aria-pressed="${state.favorites.includes(l.id)}">${state.favorites.includes(l.id) ? '★ Guardado' : '☆ Favorito'}</button></div><h1 class="page-title">${e(l.title)}</h1><p class="page-lead">${e(l.subtitle)}</p><div class="space12"></div>${bar(state.completed.filter((x) => x.startsWith(l.id[0])).length, 12)}</div>
<div class="lesson-layout"><div class="lesson-main"><section class="content-panel"><div class="objective-strip"><div style="flex:1"><div class="eyebrow">CONCEPTO · ${e(l.level.toUpperCase())}</div><h2 style="margin:8px 0">Lo que aprenderás</h2><p class="prose">${e(l.concept)}</p></div><img src="${mascotUrl('leyendo')}" alt="Terra leyendo un manual" /></div><div class="concept-grid"><div class="concept-tile"><strong>01 · Comprender</strong>${e(l.subtitle)}</div><div class="concept-tile"><strong>02 · Practicar</strong>Editar HCL y comprobar condiciones específicas de esta lección.</div><div class="concept-tile"><strong>03 · Verificar</strong>Resolver el quiz y, si aplica, ejecutar pruebas CLI en tu equipo.</div></div></section>
<div class="mission-banner"><strong>🎯 TU MISIÓN</strong>Completa el bloque marcado como TODO para conseguir las condiciones esperadas. Después responde la pregunta de conocimiento. <b>La web no ejecuta HCL ni Terraform CLI.</b></div>
<section class="editor-card"><div class="editor-toolbar"><div class="flex"><span style="color:#8a62e9">▣</span><span class="file-tab">main.tf</span></div><span class="editor-tag">HCL · editor de texto</span></div><label class="sr-only" for="code-editor">Editor HCL de ${e(l.id)}</label><textarea id="code-editor" class="code-editor" data-input="code" data-id="${l.id}" spellcheck="false" autocapitalize="off" aria-label="Editor main.tf">${e(code)}</textarea><div class="editor-bottom"><div class="flex"><button type="button" class="btn btn-primary btn-sm" data-action="evaluate" data-id="${l.id}">▶ Evaluar reglas</button><button type="button" class="btn btn-sm" data-action="hint" data-id="${l.id}">✦ Pista</button><button type="button" class="btn btn-sm" data-action="solution" data-id="${l.id}">Ver solución</button></div><div class="flex"><button type="button" class="btn btn-sm" data-action="reset-code" data-id="${l.id}">↺ Restablecer</button><button type="button" class="btn btn-sm" data-action="download-code" data-id="${l.id}">↓ .tf</button></div></div></section>
${evalResult ? renderEvaluation(evalResult) : ''}<section class="content-panel"><div class="eyebrow">COMPRENSIÓN</div><h2 style="margin-top:9px">Pon a prueba tu criterio</h2><p class="prose">${e(l.question)}</p><div class="space16"></div>${l.options.map((opt, i) => `<button type="button" class="quiz-answer ${cls(selected === i, 'selected')} ${selected === i ? (correctQuiz ? 'correct' : 'incorrect') : ''}" data-action="answer-quiz" data-id="${l.id}" data-index="${i}"><span class="quiz-letter">${String.fromCharCode(65 + i)}</span><span>${e(opt)}</span></button>`).join('')}${selected !== undefined ? `<div class="space16"></div><div class="feedback ${correctQuiz ? '' : 'fail'}"><h3>${correctQuiz ? '✓ Respuesta correcta' : '⨯ Esa opción no es correcta'}</h3><p>${correctQuiz ? 'Buen criterio. Ahora comprueba las reglas HCL.' : `Revisa la explicación y vuelve a intentarlo. Pista: ${e(l.tip)}`}</p></div>` : ''}</section>
<div class="flex-wrap">${done ? label('✓ Lección completada', 'green') : label('Pendiente: evaluación + quiz', 'yellow')}${link('⬇ Descargar laboratorio', `./assets/labs/${l.id}.zip`, 'btn btn-soft')}${link('Ver grafos →', ROUTES.graph, 'btn btn-sm')}</div><div class="space16"></div>${link('Ver evidencia CLI real →', ROUTES.evidence, 'btn btn-soft')}<div class="lesson-footer">${prev ? link(`← ${e(`${prev.id} · ${prev.title}`)}`, `#/leccion/${prev.id}`, 'btn') : link('← Ver currículo', ROUTES.learn, 'btn')}${next ? link(`Siguiente: ${e(next.id)} →`, `#/leccion/${next.id}`, 'btn btn-primary') : link('Ir a Senior Mode →', ROUTES.senior, 'btn btn-primary')}</div>
${state.seniorEnabled ? `<section class="case-review"><b>♛ PREGUNTA DE ARQUITECTURA</b><p>¿Cómo cambiarían los riesgos de esta configuración en producción? Define owner, observabilidad y una prueba reproducible.</p><div class="space12"></div>${link('Ver casos relacionados →', ROUTES.senior, 'btn btn-sm btn-soft')}</section>` : ''}</div>
<aside class="lesson-aside"><div class="content-panel"><h3>Paso a paso</h3>${['Lee el concepto y el resultado esperado.', 'Completa la línea TODO en main.tf.', 'Pulsa “Evaluar reglas” (no CLI).', 'Responde el quiz correctamente.', 'Descarga y ejecuta la práctica local.'].map((step, i) => `<div class="side-step ${i === 0 ? 'active' : ''}">${i + 1}. ${step}</div>`).join('')}</div><div class="content-panel"><img src="${mascotUrl(done ? 'exito' : 'idea')}" class="side-terra" alt="Mascota Terra ofreciendo ayuda"/><p class="side-note">${done ? '¡Lección completada! Puedes repetirla cuando quieras.' : 'Terra te acompaña. Pide una pista cuando te atasques.'}</p><div class="space12"></div><div class="side-caution">${e(l.warning)}</div></div><div class="content-panel"><h3>Práctica local</h3><p class="card-desc">En tu equipo con Terraform CLI instalado, tras descomprimir el pack:</p>${['terraform fmt -check', 'terraform init -backend=false', 'terraform validate', 'terraform test'].map((cmd) => `<div class="terminal-command"><code>${cmd}</code><button type="button" data-action="copy" data-value="${e(cmd)}">Copiar</button></div>`).join('')}<p class="small-note">Los comandos no se ejecutan en el navegador. Los resultados CLI están sin verificar en esta sesión.</p></div></aside></div>`;
}
function renderEvaluation(result) {
    return `<div class="feedback ${result.ok ? '' : 'fail'}" role="status"><h3>${result.ok ? '✓ Reglas educativas superadas' : '⚠ Aún hay condiciones por corregir'}</h3><ul>${result.checks.map((item) => `<li>${item.ok ? '✓' : '○'} ${e(item.label)}</li>`).join('')}</ul><p class="provenance">PROCEDENCIA: ${result.provenance} · ${e(result.note)}</p></div>`;
}
function gamesHub() {
    const state = store.getState().academy;
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Minijuegos</span></div><div class="eyebrow">APRENDE JUGANDO</div><h1 class="page-title">Minijuegos IaC</h1><p class="page-lead">Cinco mecánicas, veintiuna preguntas y feedback específico. Los juegos comprueban conocimientos; no simulan una ejecución real de Terraform.</p><div class="space24"></div><div class="games-grid">${games.map((g, i) => `<div class="card game-card"><div class="flex space-between">${label(g.eyebrow, i % 2 ? 'cyan' : 'purple')}${label(`Mejor: ${state.gameWins[g.id] || 0}/${g.questions.length}`, 'green')}</div><div style="font-size:36px;color:var(--purple)">${iconFor(g.icon)}</div><h3>${e(g.title)}</h3><p>${e(g.description)}</p>${link('▶ Jugar', `#/juego/${g.id}`, 'btn btn-primary')}</div>`).join('')}</div><section class="section"><div class="senior-banner"><div><div class="eyebrow">DESAFÍO EXTRA</div><h3>¿Y si una decisión de Terraform falla en producción?</h3><p>Senior Mode añade incidentes sintéticos, revisión técnica y documentación de decisiones verificable.</p><div class="space16"></div>${link('Ir a Senior Mode →', ROUTES.senior, 'btn btn-primary')}</div><img src="${mascotUrl('alerta')}" alt="Terra reaccionando a una alerta"/></div></section>`;
}
function gameView(id) {
    const game = games.find((g) => g.id === id);
    if (!game)
        return notFound();
    const storeState = store.getState();
    if (!storeState.gameSession || storeState.gameSession.id !== game.id) {
        storeState.gameSession = { id: game.id, at: 0, score: 0, last: null, finished: false };
    }
    const s = storeState.gameSession;
    if (s.finished) {
        const won = s.score >= Math.ceil(game.questions.length * 0.8);
        return `<div class="breadcrumb"><a href="${ROUTES.games}">Minijuegos</a> / <span>${e(game.title)}</span></div><div class="game-stage card game-result"><div class="eyebrow">JUEGO FINALIZADO</div><img src="${mascotUrl(won ? 'exito' : 'pensando')}" alt="Terra mostrando el resultado del juego"/><h2>${won ? '¡Reto superado!' : 'Buen intento, sigue practicando'}</h2><p class="prose" style="margin:15px 0">Respuestas correctas: <strong>${s.score} de ${game.questions.length}</strong>. ${won ? 'Has logrado el objetivo de conocimiento.' : 'Lee las explicaciones e inténtalo de nuevo.'}</p>${label(won ? '+20 XP por respuesta acertada' : 'Practica y mejora', won ? 'green' : 'yellow')}<div class="space24"></div><div class="flex-wrap" style="justify-content:center"><button type="button" class="btn btn-primary" data-action="restart-game" data-id="${game.id}">↺ Volver a jugar</button>${link('Todos los juegos', ROUTES.games, 'btn')}</div></div>`;
    }
    const q = game.questions[s.at];
    return `<div class="breadcrumb"><a href="${ROUTES.games}">Minijuegos</a> / <span>${e(game.title)}</span></div><div class="game-stage"><div class="flex space-between"><div><div class="eyebrow">${e(game.eyebrow)}</div><h1 class="page-title">${e(game.title)}</h1></div><img src="${mascotUrl(s.last === null ? 'pensando' : 'exito')}" alt="Terra" class="portrait"></div><div class="game-progress">${game.questions.map((_, i) => `<span class="${i < s.at ? 'done' : i === s.at ? 'active' : ''}"></span>`).join('')}</div><div class="card" style="margin-top:22px"><div class="flex space-between">${label(`Pregunta ${s.at + 1}/${game.questions.length}`)}${label(`${s.score} aciertos`, 'green')}</div><h2 class="game-question">${e(q.question)}</h2>${q.options.map((choice, i) => `<button type="button" data-action="game-answer" data-id="${game.id}" data-index="${i}" ${s.last !== null ? 'disabled' : ''} class="quiz-answer ${s.last === i ? (s.last === q.correct ? 'correct' : 'incorrect') : ''}"><span class="quiz-letter">${String.fromCharCode(65 + i)}</span>${e(choice)}</button>`).join('')}${s.last !== null ? `<div class="space16"></div><div class="feedback ${s.last === q.correct ? '' : 'fail'}"><h3>${s.last === q.correct ? '✓ Correcto' : '○ Hay una mejor decisión'}</h3><p>${e(q.explanation)}</p></div><div class="space16"></div><button type="button" class="btn btn-primary" data-action="next-game" data-id="${game.id}">${s.at === game.questions.length - 1 ? 'Ver resultado →' : 'Siguiente pregunta →'}</button>` : ''}</div></div>`;
}
function labsView() {
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Laboratorios</span></div><div class="eyebrow">PRÁCTICA AUTÉNTICA</div><h1 class="page-title">Laboratorios Terraform locales</h1><p class="page-lead">36 paquetes individuales de ejercicios con HCL, test .tftest.hcl de referencia y README. Descárgalos para probar con tu propia Terraform CLI; ninguna cuenta cloud es necesaria para los laboratorios seguros de terraform_data.</p><div class="space24"></div><div class="alert"><strong>Importante:</strong> las descargas están incluidas en el ZIP. En esta aplicación <b>NO</b> se ejecuta Terraform; algunos ejemplos avanzados con provider AWS/backend S3 son solo ilustrativos y requieren sustituir valores, permisos y revisión previa. Los tests no están marcados PASS hasta que los ejecutes.</div><div class="space24"></div><div class="card" style="margin-bottom:20px"><h3 class="card-title">Comienza con la CLI en tu equipo</h3><p class="card-desc">Abre un laboratorio offline en una terminal. Revisa su README para saber si requiere providers externos. El pack B04 es un punto de partida seguro sin credenciales cloud.</p>${['terraform version', 'terraform fmt -check', 'terraform init -backend=false', 'terraform validate', 'terraform test'].map((cmd) => `<div class="terminal-command"><code>${cmd}</code><button type="button" data-action="copy" data-value="${e(cmd)}">Copiar</button></div>`).join('')}</div>
${['Básico', 'Intermedio', 'Avanzado']
        .map((level) => `<section class="section">${sectionHead('LAB PACKS', level)}<div class="lesson-list">${levelLessons(level)
        .map((l) => `<div class="list-card"><div class="lesson-index">${l.id}</div><div class="list-card-info"><h3>${e(l.title)}</h3><p>main.tf · outputs/test · README · ZIP</p></div><a class="btn btn-sm btn-primary" href="./assets/labs/${l.id}.zip" download="${l.id}-lab.zip">↓ ZIP</a></div>`)
        .join('')}</div></section>`)
        .join('')}<section class="section"><div class="notice">Para pruebas AWS reales, usa una cuenta sandbox propia con presupuesto y cleanup. Nunca guardes credenciales en Terraform source, en state público ni en artefactos de CI.</div></section>`;
}
function graphView() {
    const s = store.getState();
    const graph = graphs.find((g) => g.id === s.selectedGraph) || graphs[0];
    const node = graph.nodes.find((n) => n.id === s.selectedNode) || graph.nodes[0];
    const lines = graph.nodes
        .flatMap((n) => n.dep.map((ref) => {
        const from = graph.nodes.find((x) => x.id === ref);
        return from
            ? `<line class="edge" x1="${from.x + 65}" y1="${from.y + 19}" x2="${n.x + 65}" y2="${n.y + 19}" marker-end="url(#edge-arrow)"></line>`
            : '';
    }))
        .join('');
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Visualizador</span></div><div class="eyebrow">INFRASTRUCTURE GRAPH</div><h1 class="page-title">Observa las dependencias</h1><p class="page-lead">Grafo interactivo basado en topologías ficticias: qué recurso depende de cuál, dónde hay acoplamiento y cómo acotar el blast radius.</p><div class="space24"></div><div class="tabs">${graphs.map((g) => `<button type="button" class="tab ${cls(graph.id === g.id)}" data-action="graph" data-id="${g.id}">${e(g.title)}</button>`).join('')}</div><div class="content-panel"><div class="flex space-between" style="align-items:start"><div><h2>${e(graph.title)}</h2><p class="prose">${e(graph.description)}</p></div>${label('SIMULACIÓN VISUAL', 'yellow')}</div><div class="space16"></div><div class="graph-frame"><svg viewBox="0 0 930 350" role="img" aria-label="Grafo de dependencias de ${e(graph.title)}"><defs><marker id="edge-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 z" fill="#b38bff"/></marker></defs>${lines}${graph.nodes.map((n) => `<g class="graph-node ${cls(node.id === n.id)}" data-action="graph-node" data-id="${n.id}" role="button" tabindex="0" aria-label="Ver nodo ${e(n.label)}"><rect x="${n.x}" y="${n.y}" rx="11" width="130" height="46"/><text x="${n.x + 65}" y="${n.y + 27}" text-anchor="middle">${e(n.label)}</text></g>`).join('')}</svg></div><div class="graph-legend">${graph.nodes.map((n) => `<button type="button" class="btn btn-sm ${n.id === node.id ? 'btn-primary' : ''}" data-action="graph-node" data-id="${n.id}">${e(n.label)}</button>`).join('')}</div><div class="graph-detail"><div class="flex-wrap">${label(node.category, 'purple')}${label(node.level, 'cyan')}</div><h3 style="margin:10px 0">${e(node.label)}</h3><p class="prose">${e(node.description)}</p><p class="small-note">Depende de: ${node.dep.length ? node.dep.map(e).join(', ') : 'ningún otro nodo'}.</p></div><div class="notice">Estos diagramas no provienen de terraform graph real. Son casos de estudio para aprender modelado, propiedad y dependencias.</div></div><div class="space24"></div>${link('Explorar cambios de plan →', ROUTES.plan, 'btn btn-primary')}`;
}
function localPlanPanel() {
    const s = store.getState();
    const plan = s.userPlan;
    const gateAnswers = s.gateAnswers;
    const gateReview = s.gateReview;
    const counts = plan
        ? Object.entries(plan.summary)
            .filter(([, num]) => num > 0)
            .map(([name, num]) => label(`${name}: ${num}`, name === 'delete' || name === 'replace' ? 'red' : 'cyan'))
            .join('')
        : '';
    return `<section class="content-panel" style="margin-top:24px" id="real-plan-review"><div class="flex space-between"><div><div class="eyebrow">ANÁLISIS LOCAL · ARCHIVO DEL ESTUDIANTE</div><h2 style="margin:8px 0">Inspeccionar terraform show -json</h2></div>${label('SIN SUBIR A SERVIDOR', 'green')}</div>
 <p class="prose">Carga un <code>plan.json</code> generado en tu propio entorno con <code>terraform show -json plan.tfplan &gt; plan.json</code>. La app analiza operaciones y drift declarados, sin leer valores before/after, variables ni outputs. <strong>Los nombres y direcciones pueden revelar información interna.</strong></p>
 <label class="field-label" for="user-plan-json">Archivo local plan.json (máx. 5 MB)</label><input type="file" id="user-plan-json" accept=".json,application/json" aria-label="Seleccionar plan JSON de Terraform" />
 <div class="space12"></div><button type="button" class="btn btn-sm" data-action="clear-user-plan">Olvidar archivo analizado</button>${plan ? ` <button type="button" class="btn btn-sm btn-primary" data-action="export-user-plan">↓ Informe local (.md)</button>` : ''}
 ${s.userPlanError ? `<div class="alert" role="alert">${e(s.userPlanError)}</div>` : ''}
 ${plan
        ? `<div class="release-gate" id="release-gate"><div class="eyebrow">SENIOR · RELEASE GATE</div><h3>¿Este plan estaría listo para revisión humana?</h3><p class="small-note">Evaluación local orientativa: los controles marcados son declaraciones tuyas, no verificaciones externas. Nunca concede permiso de apply.</p>
 <label class="field-label" for="review-environment">Ambiente declarado</label><select class="search-bar" id="review-environment" data-input="review-environment"><option value="prod" ${gateAnswers.environment === 'prod' ? 'selected' : ''}>Producción</option><option value="staging" ${gateAnswers.environment === 'staging' ? 'selected' : ''}>Staging</option><option value="dev" ${gateAnswers.environment === 'dev' ? 'selected' : ''}>Development</option></select>
 ${[
            ['provenanceVerified', 'Cotejé origen, commit, workspace y digest del plan'],
            ['ownersApproved', 'Owners del entorno revisaron el cambio'],
            ['driftInvestigated', 'Investigación del drift documentada'],
            ['destructiveReviewed', 'Revisé los reemplazos/eliminaciones por recurso'],
            ['rollbackDocumented', 'Runbook, rollback y condiciones de parada documentados'],
            ['costReviewed', 'Revisé costos, cuotas y presupuesto']
        ]
            .map(([key, labelText]) => `<label class="check-row"><input type="checkbox" data-input="gate-check" data-id="${key}" ${gateAnswers[key] ? 'checked' : ''}/>${e(labelText)}</label>`)
            .join('')}
 <button type="button" class="btn btn-primary" data-action="run-release-gate">Evaluar gate didáctico →</button> ${gateReview ? `<button type="button" class="btn btn-soft" data-action="export-release-gate">↓ Informe gate .md</button><div class="feedback ${gateReview.status === 'READY_FOR_HUMAN_REVIEW' ? '' : 'fail'}" role="status"><h3>${e(gateReview.status)}</h3><p>${gateReview.checksPassed}/${gateReview.checksRequired} controles declarados</p>${gateReview.findings.map((f) => `<div class="side-step">${e(f.id)} (${f.severity}): ${e(f.message)}</div>`).join('')}</div>` : ''}
 </div>`
        : ''}
 ${plan
        ? `<div class="notice" role="status" style="margin-top:15px"><b>Procedencia: USER_SUPPLIED_TERRAFORM_JSON</b> · Terraform ${e(plan.terraformVersion)} · ${plan.total} cambios · ${plan.destructive} destructivos · ${plan.sensitiveCount} marcados sensitive · ${plan.driftCount} eventos drift. No se verifica ejecución cloud.</div><div class="flex-wrap" style="margin:16px 0">${counts}</div>
 <div class="plan-import-results">${plan.changes.map((item) => `<div class="plan-resource"><div class="plan-resource-head"><code>${e(item.address)}</code>${label(item.kind, item.kind === 'delete' || item.kind === 'replace' ? 'red' : 'cyan')}</div><div class="detail">Provider: ${e(item.provider)} · ${item.sensitive ? 'Datos sensibles presentes (no mostrados)' : 'Sin indicador sensitive en el cambio'}</div></div>`).join('')}</div>
 <div class="notice">${plan.notices.map((note) => `<p>${e(note)}</p>`).join('')}</div>${plan.driftCount ? `<h3>Drift reportado por Terraform (metadatos)</h3><div class="plan-import-results">${plan.drift.map((item) => `<div class="plan-resource"><code>${e(item.address)}</code> ${label(item.kind, item.kind === 'delete' || item.kind === 'replace' ? 'red' : 'yellow')}</div>`).join('')}</div>` : ''}`
        : ''}
 </section>`;
}
function planView() {
    const s = store.getState();
    const fixture = planFixtures.find((p) => p.id === s.selectedPlan) || planFixtures[0];
    const symbols = { create: '+', update: '~', delete: '−', replace: '−/+', 'no-op': '=' };
    const spanish = {
        create: 'Crear',
        update: 'Actualizar',
        delete: 'Eliminar',
        replace: 'Reemplazar',
        'no-op': 'Sin cambios'
    };
    const risky = fixture.resources.filter((r) => r.action === 'delete' || r.action === 'replace').length;
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Plan Explorer</span></div><div class="eyebrow">LEER ANTES DE APLICAR</div><h1 class="page-title">Plan Explorer</h1><p class="page-lead">Compara operaciones de infraestructura y detecta cambios peligrosos. Todos los planes de esta pantalla son <strong>sintéticos</strong> para aprendizaje, no resultados de Terraform CLI.</p><div class="space24"></div><div class="plan-layout"><aside class="fixture-menu">${planFixtures.map((p) => `<button type="button" class="fixture-select ${cls(p.id === fixture.id)}" data-action="plan" data-id="${p.id}"><strong>${e(p.title)}</strong><small>${e(p.environment)} · ${p.resources.length} recursos</small></button>`).join('')}</aside><div class="content-panel"><div class="flex space-between"><div><div class="eyebrow">PLAN DIDÁCTICO · ${e(fixture.environment.toUpperCase())}</div><h2 style="margin-top:8px">${e(fixture.title)}</h2></div>${label('SYNTHETIC_FIXTURE', 'yellow')}</div><p class="prose">${e(fixture.summary)}</p><div class="space16"></div><div class="plan-toolbar">${label(`${fixture.resources.length} recursos`, 'purple')}${label(`${risky} operaciones destructivas`, risky ? 'red' : 'green')}<button type="button" class="btn btn-sm btn-soft" data-action="reveal-plan">${s.showPlanRisks ? 'Ocultar análisis' : 'Mostrar análisis de riesgo'}</button></div><div class="space16"></div>${fixture.resources.map((r) => `<div class="plan-resource"><div class="plan-resource-head"><code><strong class="action-${r.action}">${symbols[r.action]}</strong> ${e(r.name)}</code>${label(spanish[r.action], r.action === 'replace' || r.action === 'delete' ? 'red' : r.action === 'create' ? 'green' : 'cyan')}</div><div class="detail">${e(r.detail)}</div>${s.showPlanRisks ? `<div class="risk">⚑ ${e(r.risk)}</div>` : ''}</div>`).join('')}<div class="notice">La clasificación de operaciones se realiza sobre datos preparados. Un plan real debe revisarse desde un origen autorizado, con entorno y versión exactos.</div></div></div><div class="space24"></div>${localPlanPanel()}<div class="space24"></div>${link('Resolver caso S11: plan integrity →', '#/senior/S11', 'btn btn-primary')}`;
}
function progressView() {
    const state = store.getState().academy;
    const counts = ['Básico', 'Intermedio', 'Avanzado'].map((level) => ({
        level,
        count: levelLessons(level).filter((l) => state.completed.includes(l.id)).length
    }));
    const badges = [
        {
            title: 'Primer commit',
            needed: state.completed.length >= 1,
            icon: 'hola',
            description: 'Tu primera lección superada'
        },
        {
            title: 'HCL Explorer',
            needed: counts[0].count >= 6,
            icon: 'codificando',
            description: '6 lecciones de fundamentos'
        },
        { title: 'Builder', needed: counts[0].count === 12, icon: 'arquitectura', description: 'Básico completo' },
        { title: 'DevSecOps', needed: counts[1].count === 12, icon: 'deploy', description: 'Intermedio completo' },
        { title: 'Cloud Architect', needed: counts[2].count === 12, icon: 'idea', description: 'Avanzado completo' },
        {
            title: 'Senior Reviewer',
            needed: state.seniorCompleted.length === 18,
            icon: 'senior',
            description: '18 casos autoevaluados'
        }
    ];
    const next = findNextLesson(lessons, state.completed);
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Progreso</span></div><div class="eyebrow">MI PERFIL DE APRENDIZAJE</div><h1 class="page-title">Tus logros en IaC</h1><p class="page-lead">Tu progreso se guarda en este navegador, sin cuenta ni telemetría. Exporta un respaldo JSON si vas a cambiar de dispositivo.</p><div class="space24"></div>${stats()}<section class="section">${sectionHead('CONTINUIDAD', 'Avance por nivel')}<div class="cards-3">${counts.map((item) => `<div class="card"><div class="flex space-between"><h3 style="font-size:21px">${item.level}</h3>${label(`${item.count}/12`, 'purple')}</div><div class="space24"></div>${bar(item.count, 12)}<p class="card-desc" style="margin:14px 0">${item.count === 12 ? 'Nivel completado' : `${12 - item.count} lecciones pendientes`}</p>${link('Abrir nivel →', `#/aprender?nivel=${encodeURIComponent(item.level)}`, 'btn btn-sm btn-soft')}</div>`).join('')}</div></section><section class="section">${sectionHead('PIXEL ACHIEVEMENTS', 'Galería de insignias')}<div class="badge-grid">${badges.map((b) => `<div class="badge-card ${b.needed ? '' : 'locked'}"><img src="${mascotUrl(b.icon)}" alt="" class="image-pixel"><strong>${e(b.title)}</strong><small>${e(b.description)}</small><div class="space12"></div>${label(b.needed ? 'Desbloqueada' : 'Bloqueada', b.needed ? 'green' : 'purple')}</div>`).join('')}</div></section><section class="section">${sectionHead('REPASO', 'Continúa donde quedaste')}<div class="cards-2"><div class="card"><h3 class="card-title">Próxima lección</h3><p class="card-desc">${e(`${next.id} — ${next.title}`)}</p><div class="space16"></div>${link('Continuar →', `#/leccion/${next.id}`, 'btn btn-primary')}</div><div class="card"><h3 class="card-title">Guardado local</h3><p class="card-desc">Tu JSON de progreso incluye respuestas, ejercicios, decisiones y ADR escritos. No compartas su contenido si incluye datos privados.</p><div class="space16"></div><button type="button" class="btn btn-soft" data-action="export-progress">↓ Exportar respaldo</button></div></div></section><div class="space24"></div><div class="notice">XP e insignias son indicadores de práctica educativa. Senior Mode registra autoevaluación; no garantiza experiencia laboral, certificación oficial ni despliegues validados.</div>`;
}
function settingsView() {
    const state = store.getState().academy;
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Ajustes</span></div><div class="eyebrow">PREFERENCIAS Y PRIVACIDAD</div><h1 class="page-title">Tu academia, a tu manera</h1><p class="page-lead">Controla apariencia, movimiento y progreso. Todo funciona localmente, sin inicio de sesión y sin enviar tus ejercicios a un servidor.</p><div class="space24"></div><div class="settings-layout"><div class="content-panel"><h2>Experiencia</h2><div class="settings-item"><div><h4>Tema</h4><p>Claro u oscuro</p></div><select class="input-select" data-input="theme" aria-label="Tema"><option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Oscuro</option><option value="light" ${state.theme === 'light' ? 'selected' : ''}>Claro</option></select></div><div class="settings-item"><div><h4>Senior Mode</h4><p>Muestra preguntas y retos avanzados</p></div><button type="button" class="btn btn-sm ${state.seniorEnabled ? 'btn-primary' : ''}" data-action="toggle-senior">${state.seniorEnabled ? 'Activado' : 'Desactivado'}</button></div><div class="settings-item"><div><h4>Reducir movimiento</h4><p>Desactiva animaciones decorativas</p></div><button type="button" class="btn btn-sm" data-action="toggle-motion">${state.reducedMotion ? 'Sí' : 'No'}</button></div><div class="settings-item"><div><h4>Tamaño de texto</h4><p>Escala general de lectura</p></div><select class="input-select" data-input="font-scale" aria-label="Tamaño de texto"><option value="0.9" ${state.fontScale === 0.9 ? 'selected' : ''}>Compacto</option><option value="1" ${state.fontScale === 1 ? 'selected' : ''}>Normal</option><option value="1.15" ${state.fontScale === 1.15 ? 'selected' : ''}>Grande</option><option value="1.3" ${state.fontScale === 1.3 ? 'selected' : ''}>Muy grande</option></select></div><div class="settings-item"><div><h4>Idioma</h4><p>La versión completa se ofrece en español</p></div><span class="chip">Español</span></div></div><div class="content-panel"><h2>Datos locales</h2><p class="prose">El almacenamiento usa localStorage. No existe cuenta, sincronización ni analítica remota en la app. Puedes hacer backup, restaurar y borrar tus datos del navegador.</p><div class="space24"></div><div class="flex-wrap"><button type="button" class="btn btn-primary" data-action="export-progress">↓ Exportar JSON</button><button type="button" class="btn" data-action="import-progress">↑ Importar JSON</button><input type="file" id="progress-file" accept="application/json,.json" style="display:none" aria-label="Cargar archivo de progreso"/></div><div class="space24"></div><div class="alert">El respaldo incluye código editado, decisiones y evidencia Senior. Consérvalo como información personal. La importación reemplaza el progreso actual después de validación de estructura.</div><div class="space24"></div><button type="button" class="btn btn-danger" data-action="reset-progress">Eliminar todo mi progreso</button><div class="space24"></div><h3 style="font-size:17px">Sobre los laboratorios</h3><p class="prose">Los comandos CLI se ejecutan en tu equipo. Los simuladores no hacen apply ni gestionan cuentas cloud.</p></div></div><section class="section"><div class="card"><h3>Diseño aprobado</h3><p class="card-desc">Se incluye una copia local del concepto visual y un spritesheet original de Terra con 12 poses PNG.</p><div class="space16"></div><a href="./assets/reference/concepto-aprobado.png" target="_blank" rel="noopener noreferrer" class="btn btn-soft">↗ Ver imagen original</a></div></section>`;
}
const glossary = [
    ['HCL', 'Lenguaje de configuración de HashiCorp, con bloques, atributos y expresiones.'],
    ['Provider', 'Plugin que expone tipos de recursos y data sources para una API.'],
    ['Resource', 'Declaración de un objeto administrado por Terraform.'],
    ['Data source', 'Consulta de datos existentes, sin declarar su gestión.'],
    ['State', 'Registro del mapeo entre configuración y objetos administrados; puede contener secretos.'],
    ['Backend', 'Configuración para almacenar y bloquear state.'],
    ['Lock', 'Mecanismo que impide escritores concurrentes sobre un estado.'],
    ['Drift', 'Desviación observada entre la configuración/estado y recursos externos.'],
    ['Plan', 'Representación de cambios propuestos antes de apply.'],
    ['Apply', 'Operación que ejecuta modificaciones reales autorizadas.'],
    ['Destroy', 'Operación que plantea eliminar objetos administrados.'],
    ['Module', 'Unidad reusable de configuración con variables, recursos y outputs.'],
    ['Output', 'Contrato de valores expuestos por un módulo.'],
    ['Variable', 'Entrada parametrizable tipada del módulo.'],
    ['Local', 'Valor derivado reusable dentro de un módulo.'],
    ['for_each', 'Multiplica instancias de recursos por claves estables.'],
    ['count', 'Multiplica instancias por índice posicional.'],
    ['moved', 'Declara un traslado de dirección de recurso administrado.'],
    ['Import', 'Asocia un objeto existente a una dirección de estado.'],
    ['Remote state', 'Estado compartido gestionado en un backend externo.'],
    ['Policy as Code', 'Reglas automáticas auditables aplicadas a configuración o planes.'],
    ['OIDC', 'Identidad federada temporal para workloads, por ejemplo CI/CD.'],
    ['Sensitive', 'Marca de exposición para ciertos valores; no asegura excluirlos del state.'],
    ['Ephemeral', 'Propiedad de ciertas entradas/salidas que evita su persistencia en contextos soportados.'],
    ['Blast radius', 'Alcance potencial de un cambio o incidente.'],
    ['ADR', 'Registro de decisión arquitectónica con alternativas y consecuencias.'],
    ['FinOps', 'Gestión colaborativa de costo, valor y riesgo cloud.'],
    ['GitOps', 'Reconciliación declarativa de entornos a partir de Git.'],
    ['Mock provider', 'Sustituto de proveedor en determinadas pruebas Terraform.'],
    ['Plan fixture', 'Datos sintéticos para análisis de un plan; no provienen de CLI real.']
];
const resources = [
    {
        title: 'Documentación oficial Terraform',
        description: 'Lenguaje HCL, módulos, providers, state y CLI.',
        href: 'https://developer.hashicorp.com/terraform/docs',
        tag: 'Oficial'
    },
    {
        title: 'Tutoriales y guías de Terraform',
        description: 'Aprendizaje práctico y ejercicios oficiales.',
        href: 'https://developer.hashicorp.com/terraform/tutorials',
        tag: 'Oficial'
    },
    {
        title: 'Terraform test',
        description: 'Documentación del marco de pruebas, mocks y advertencias.',
        href: 'https://developer.hashicorp.com/terraform/language/tests',
        tag: 'Oficial'
    },
    {
        title: 'Backends y state',
        description: 'Protección de state y almacenamiento remoto.',
        href: 'https://developer.hashicorp.com/terraform/language/backend',
        tag: 'Oficial'
    },
    {
        title: 'Referencia HCL',
        description: 'Bloques, expresiones y funciones.',
        href: 'https://developer.hashicorp.com/terraform/language',
        tag: 'Oficial'
    },
    {
        title: 'Guía de marca HashiCorp',
        description: 'Uso descriptivo de Terraform y restricciones de marca.',
        href: 'https://www.hashicorp.com/en/trademark-policy',
        tag: 'Legal'
    },
    {
        title: 'Open Policy Agent',
        description: 'Motor de políticas que puede complementar IaC.',
        href: 'https://www.openpolicyagent.org/docs',
        tag: 'Externo'
    },
    {
        title: 'Infracost',
        description: 'Estimaciones de costo para revisión de infraestructura.',
        href: 'https://www.infracost.io/docs/',
        tag: 'Externo'
    },
    {
        title: 'Vigilio: guía de implementación',
        description: 'Archivo MASTER_SPEC auditado incluido en docs del ZIP.',
        href: './docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md',
        tag: 'Proyecto'
    }
];
function resourcesView() {
    const query = store.getState().glossarySearch;
    const visibleGlossary = filterGlossary(glossary, query);
    return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Recursos</span></div><div class="eyebrow">BIBLIOTECA IAC</div><h1 class="page-title">Recursos para aprender mejor</h1><p class="page-lead">Enlaces a documentación oficial, guías técnicas y un glosario de conceptos clave para revisar antes de usar infraestructura real.</p><section class="section">${sectionHead('BIBLIOTECA', 'Documentación y herramientas')}<div class="resource-grid">${resources.map((r) => `<div class="resource-card">${label(r.tag, 'purple')}<h3 style="margin-top:11px">${e(r.title)}</h3><p>${e(r.description)}</p><a href="${e(r.href)}" ${r.href.startsWith('https:') ? 'target="_blank" rel="noopener noreferrer"' : ''}>Consultar ↗</a></div>`).join('')}</div></section><section class="section">${sectionHead('A—Z', 'Glosario de Terraform')}<input class="search-bar" type="search" id="glossary-search" value="${e(query)}" placeholder="⌕ Buscar un término…" aria-label="Buscar glosario"/><div class="space16"></div><div class="cards-3" id="glossary-list">${visibleGlossary.map(([term, description]) => `<div class="card glossary-tile"><h3 style="font-size:18px;color:var(--purple-bright)">${e(term)}</h3><p class="card-desc" style="margin-top:9px">${e(description)}</p></div>`).join('')}</div></section>`;
}
function notFound() {
    return `<div class="empty-state"><img src="${mascotUrl('pensando')}" alt="Terra confuso" width="210" style="margin:auto"><h1 class="page-title">No encontré esta ruta</h1><p>Revisa la URL o regresa al inicio.</p><div class="space24"></div>${link('Volver a la academia →', ROUTES.home, 'btn btn-primary')}</div>`;
}
function downloadText(name, contents, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function maybeCompleteLesson(id) {
    const l = getLesson(id);
    if (!l)
        return false;
    const s = store.getState();
    const state = s.academy;
    const code = state.code[id] ?? l.starter;
    const evaluated = s.evals[id];
    reconcileLessonCompletion(state, lessons);
    if (evaluated?.ok &&
        evaluateLesson(l, code).ok &&
        state.quizAnswers[id] === l.correct &&
        !state.completed.includes(id)) {
        state.completed.push(id);
        return true;
    }
    return false;
}
async function handleAction(action, id, index, element) {
    switch (action) {
        case 'toggle-menu':
            store.update((s) => {
                s.mobileMenu = !s.mobileMenu;
            });
            return;
        case 'toggle-senior': {
            let enabled = false;
            store.update((s) => {
                s.academy.seniorEnabled = !s.academy.seniorEnabled;
                enabled = s.academy.seniorEnabled;
            }, { persist: true });
            notify(enabled ? 'Modo Senior activado' : 'Modo Senior desactivado');
            return;
        }
        case 'favorite': {
            if (!getLesson(id))
                return;
            store.update((s) => {
                const favs = s.academy.favorites;
                s.academy.favorites = favs.includes(id) ? favs.filter((v) => v !== id) : [...favs, id];
            }, { persist: true });
            return;
        }
        case 'toggle-motion':
            store.update((s) => {
                s.academy.reducedMotion = !s.academy.reducedMotion;
            }, { persist: true });
            return;
        case 'level':
            store.update((s) => {
                s.activeLevel = id;
            });
            return;
        case 'evaluate': {
            const lesson = getLesson(id);
            if (!lesson)
                return;
            let justCompleted = false;
            store.update((s) => {
                const code = s.academy.code[id] ?? lesson.starter;
                s.evals[id] = evaluateLesson(lesson, code);
                justCompleted = maybeCompleteLesson(id);
            }, { persist: true });
            if (justCompleted) {
                notify(`¡Lección ${id} completada! +${lesson.xp} XP educativos.`);
            }
            const reducedMotion = store.getState().academy.reducedMotion;
            document.querySelector('.feedback')?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'center'
            });
            return;
        }
        case 'hint': {
            const l = getLesson(id);
            if (l)
                notify(`Pista ${id}: ${l.tip}`);
            return;
        }
        case 'solution': {
            const l = getLesson(id);
            if (!l)
                return;
            if (!window.confirm('Ver la solución completa reemplazará tu código actual. ¿Continuar?'))
                return;
            disposeCodeEditor();
            store.update((s) => {
                s.academy.code[id] = l.example;
                delete s.evals[id];
                reconcileLessonCompletion(s.academy, lessons);
            }, { persist: true });
            notify('Solución de referencia cargada. Evalúa reglas y responde el quiz para completar.');
            return;
        }
        case 'reset-code': {
            const l = getLesson(id);
            if (!l)
                return;
            if (!window.confirm('¿Restablecer solo el código de esta lección?'))
                return;
            disposeCodeEditor();
            store.update((s) => {
                s.academy.code[id] = l.starter;
                delete s.evals[id];
                reconcileLessonCompletion(s.academy, lessons);
            }, { persist: true });
            return;
        }
        case 'download-code': {
            const l = getLesson(id);
            if (!l)
                return;
            const code = store.getState().academy.code[id] ?? l.starter;
            downloadText(`${slugFilename(id)}-main.tf`, code);
            notify('Se descargó main.tf. Para pruebas auténticas usa el pack ZIP de laboratorio.');
            return;
        }
        case 'answer-quiz': {
            const l = getLesson(id);
            if (!l)
                return;
            let justCompleted = false;
            store.update((s) => {
                s.academy.quizAnswers[id] = index;
                justCompleted = maybeCompleteLesson(id);
            }, { persist: true });
            if (justCompleted) {
                notify(`¡Lección ${id} completada! +${l.xp} XP educativos.`);
            }
            return;
        }
        case 'copy': {
            const text = element.dataset.value ?? '';
            try {
                await navigator.clipboard.writeText(text);
                notify('Comando copiado.');
            }
            catch {
                notify('No se pudo copiar: selecciona y copia el comando manualmente.', true);
            }
            return;
        }
        case 'game-answer': {
            const game = games.find((g) => g.id === id);
            const current = store.getState().gameSession;
            if (!game || !current || current.id !== id || current.last !== null || current.finished)
                return;
            store.update((s) => {
                if (!s.gameSession)
                    return;
                s.gameSession.last = index;
                if (game.questions[s.gameSession.at].correct === index) {
                    s.gameSession.score++;
                }
            });
            return;
        }
        case 'next-game': {
            const game = games.find((g) => g.id === id);
            const current = store.getState().gameSession;
            if (!game || !current || current.id !== id || current.last === null)
                return;
            let shouldPersist = false;
            store.update((s) => {
                const session = s.gameSession;
                if (!session)
                    return;
                if (session.at >= game.questions.length - 1) {
                    session.finished = true;
                    const previous = s.academy.gameWins[id] || 0;
                    if (session.score >= Math.ceil(game.questions.length * 0.8) && session.score > previous) {
                        s.academy.gameWins[id] = session.score;
                        shouldPersist = true;
                    }
                }
                else {
                    session.at++;
                    session.last = null;
                }
            });
            if (shouldPersist) {
                store.update(() => { }, { persist: true });
            }
            return;
        }
        case 'restart-game':
            store.update((s) => {
                s.gameSession = null;
            });
            return;
        case 'graph':
            store.update((s) => {
                s.selectedGraph = id;
                s.selectedNode = '';
            });
            return;
        case 'graph-node':
            store.update((s) => {
                s.selectedNode = id;
            });
            return;
        case 'plan':
            store.update((s) => {
                s.selectedPlan = id;
                s.showPlanRisks = false;
            });
            return;
        case 'reveal-plan':
            store.update((s) => {
                s.showPlanRisks = !s.showPlanRisks;
            });
            return;
        case 'case-tab':
            if (isCaseTabId(id)) {
                store.update((s) => {
                    s.caseTab = id;
                });
            }
            return;
        case 'review-fix':
            store.update((s) => {
                s.showSeniorFix = !s.showSeniorFix;
            });
            return;
        case 'check-cidr': {
            store.update((s) => {
                const overlap = cidrOverlap(s.simInputs.cidrA, s.simInputs.cidrB);
                s.seniorSimResult =
                    overlap === null
                        ? 'Formato CIDR inválido'
                        : overlap
                            ? 'BLOQUEADO: los rangos se superponen.'
                            : 'Sin superposición entre estos dos rangos; revisar IPAM completo.';
            });
            return;
        }
        case 'check-integrity': {
            store.update((s) => {
                const { approvedCommit, appliedCommit } = s.simInputs;
                const result = planIntegrity({ commit: approvedCommit, env: 'prod', digest: 'sha256-a1' }, {
                    commit: appliedCommit,
                    env: 'prod',
                    digest: approvedCommit === appliedCommit ? 'sha256-a1' : 'sha256-b2'
                });
                s.seniorSimResult = result.ok
                    ? 'Coincidencia local de datos del fixture; todavía requiere autorización real.'
                    : `BLOQUEADO: ${result.problems.join(', ')}.`;
            });
            return;
        }
        case 'check-cost': {
            store.update((s) => {
                const result = estimateCost(s.simInputs.simulatedReplicas);
                s.seniorSimResult = `Estimación ficticia: USD ${result.estimate}/mes (presupuesto USD ${result.budget}). ${result.exceeds ? 'BLOQUEAR y revisar SLA/costos' : 'Dentro del umbral ficticio; revisar capacidad/SLA'}.`;
            });
            return;
        }
        case 'simulate-lock':
            store.update((s) => {
                s.seniorSimResult =
                    'Writer B: BLOCKED. El lock de Writer A sigue activo; investigar antes de cualquier force-unlock.';
            });
            return;
        case 'simulate-drift':
            store.update((s) => {
                s.seniorSimResult = 'DRIFT DETECTADO: Owner esperado team-platform, remoto unknown. NO aplicar sin investigar.';
            });
            return;
        case 'simulate-keys':
            store.update((s) => {
                s.seniorSimResult =
                    'Cambio de clave old_key → new_key. Plan ficticio: destroy + create; revisar moved y continuidad.';
            });
            return;
        case 'case-decision': {
            const c = getCase(id);
            if (!c)
                return;
            store.update((s) => {
                s.academy.seniorDecisions[id] = index;
                reconcileSeniorCompletion(s.academy, seniorCases);
            }, { persist: true });
            return;
        }
        case 'finish-case': {
            const c = getCase(id);
            if (!c)
                return;
            const gateResult = seniorGate(store.getState().academy, c);
            if (!gateResult.ok) {
                notify(gateResult.reasons.join(' '), true);
                return;
            }
            let newlyCompleted = false;
            store.update((s) => {
                if (!s.academy.seniorCompleted.includes(id)) {
                    s.academy.seniorCompleted.push(id);
                    newlyCompleted = true;
                }
            }, { persist: true });
            if (newlyCompleted) {
                notify(`Caso ${id} autoevaluado. +${c.xp} XP educativos.`);
            }
            return;
        }
        case 'clear-user-plan':
            store.update((s) => {
                s.userPlan = null;
                s.userPlanError = '';
                s.gateReview = null;
                s.gateAnswers = emptyGateAnswers();
            });
            return;
        case 'run-release-gate': {
            const currentPlan = store.getState().userPlan;
            if (!currentPlan) {
                notify('Primero carga un plan.json.', true);
                return;
            }
            store.update((s) => {
                if (s.userPlan) {
                    s.gateReview = evaluateReleaseGate(s.userPlan, s.gateAnswers);
                }
            });
            return;
        }
        case 'export-release-gate': {
            const currentReview = store.getState().gateReview;
            if (!currentReview) {
                notify('Evalúa el gate antes de exportar.', true);
                return;
            }
            downloadText('TerraPixel-Gate-Didactico.md', exportGateReview(currentReview), 'text/markdown;charset=utf-8');
            return;
        }
        case 'export-user-plan': {
            const currentPlan = store.getState().userPlan;
            if (!currentPlan) {
                notify('Primero importa un plan.json válido.', true);
                return;
            }
            downloadText('TerraPixel-Revision-Plan-Local.md', buildPlanReviewMarkdown(currentPlan), 'text/markdown;charset=utf-8');
            notify('Informe local descargado. Las direcciones de recursos pueden ser privadas.');
            return;
        }
        case 'clear-cli-manifest':
            store.update((s) => {
                s.cliManifest = null;
                s.cliManifestError = '';
            });
            return;
        case 'export-cli-manifest': {
            const manifest = store.getState().cliManifest;
            if (!manifest) {
                notify('Importa un manifiesto CLI primero.', true);
                return;
            }
            downloadText('TerraPixel-Indice-Evidencia-CLI.md', cliEvidenceMarkdown(manifest), 'text/markdown;charset=utf-8');
            notify('Índice exportado: requiere cotejo independiente de los logs originales.');
            return;
        }
        case 'export-portfolio': {
            const state = store.getState().academy;
            downloadText('TerraPixel-Portfolio-Senior.md', buildSeniorPortfolio(seniorCases, state), 'text/markdown;charset=utf-8');
            notify('Portafolio exportado: contiene tus respuestas y ADR; revisa datos privados antes de compartir.');
            return;
        }
        case 'export-senior': {
            const c = getCase(id);
            if (!c)
                return;
            const report = buildSeniorReport(c, store.getState().academy);
            downloadText(`${c.id}-informe-senior.md`, report, 'text/markdown;charset=utf-8');
            notify(`Informe ${c.id} descargado: actividad educativa no certificada.`);
            return;
        }
        case 'export-progress': {
            const state = store.getState().academy;
            downloadText(`terrapixel-progreso-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), 'application/json;charset=utf-8');
            notify('Respaldo JSON exportado.');
            return;
        }
        case 'import-progress':
            document.getElementById('progress-file')?.click();
            return;
        case 'what-if-answer': {
            const result = evaluateSeniorDrill(id, index);
            if (!result)
                return;
            store.update((s) => {
                s.academy.seniorDrillAnswers[id] = index;
                reconcileSeniorCompletion(s.academy, seniorCases);
            }, { persist: true });
            return;
        }
        case 'reset-progress': {
            if (!window.confirm('¿Eliminar TODO el progreso, código y decisiones de este navegador? Esta acción no se puede deshacer.')) {
                return;
            }
            store.resetAcademy();
            notify('Progreso local restablecido.');
            return;
        }
    }
}
root.addEventListener('click', (event) => {
    const target = event.target;
    const element = target?.closest('[data-action]');
    if (!element)
        return;
    if (element instanceof HTMLButtonElement && element.disabled)
        return;
    const action = element.dataset.action || '';
    const id = element.dataset.id || '';
    const index = Number(element.dataset.index || 0);
    if (element.tagName.toLowerCase() === 'a') {
        event.preventDefault();
    }
    void handleAction(action, id, index, element).catch((err) => notify(err instanceof Error ? err.message : 'Error inesperado', true));
});
root.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement))
        return;
    const input = target.dataset.input;
    if (target instanceof HTMLInputElement) {
        if (input === 'cidr-a') {
            store.update((s) => {
                s.simInputs.cidrA = target.value.slice(0, 50);
                s.seniorSimResult = '';
            });
            return;
        }
        if (input === 'cidr-b') {
            store.update((s) => {
                s.simInputs.cidrB = target.value.slice(0, 50);
                s.seniorSimResult = '';
            });
            return;
        }
        if (input === 'approved-commit') {
            store.update((s) => {
                s.simInputs.approvedCommit = target.value.slice(0, 120);
                s.seniorSimResult = '';
            });
            return;
        }
        if (input === 'applied-commit') {
            store.update((s) => {
                s.simInputs.appliedCommit = target.value.slice(0, 120);
                s.seniorSimResult = '';
            });
            return;
        }
        if (input === 'replicas') {
            const value = Number(target.value);
            store.update((s) => {
                s.simInputs.simulatedReplicas = Number.isInteger(value) ? Math.max(0, Math.min(50, value)) : 0;
                s.seniorSimResult = '';
            });
            return;
        }
        if (target.id === 'senior-search') {
            store.update((s) => {
                s.seniorSearch = target.value.slice(0, 120);
            });
            return;
        }
        if (target.id === 'lesson-search') {
            store.update((s) => {
                s.lessonSearch = target.value.slice(0, 120);
            });
            return;
        }
        if (target.id === 'glossary-search') {
            store.update((s) => {
                s.glossarySearch = target.value.slice(0, 120);
            });
            return;
        }
    }
    if (input === 'code' && target instanceof HTMLTextAreaElement) {
        const id = target.dataset.id || '';
        store.update((s) => {
            s.academy.code[id] = target.value.slice(0, 30000);
            delete s.evals[id];
            reconcileLessonCompletion(s.academy, lessons);
        }, { persist: true });
        return;
    }
    if (input === 'case-evidence' && target instanceof HTMLTextAreaElement) {
        const id = target.dataset.id || '';
        store.update((s) => {
            s.academy.seniorEvidence[id] = target.value.slice(0, 12000);
            reconcileSeniorCompletion(s.academy, seniorCases);
        }, { persist: true });
        return;
    }
    if (input === 'capstone-note' && target instanceof HTMLTextAreaElement) {
        const idx = Number(target.dataset.index);
        if (Number.isInteger(idx) && idx >= 0 && idx < 8) {
            store.update((s) => {
                const text = target.value.slice(0, 2500);
                s.academy.capstoneEvidence[String(idx)] = text;
                if (!capstoneNoteValid(text)) {
                    s.academy.capstoneDone = s.academy.capstoneDone.filter((n) => n !== idx);
                }
                reconcileSeniorCompletion(s.academy, seniorCases);
            }, { persist: true });
        }
    }
});
root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement))
        return;
    if (target instanceof HTMLSelectElement) {
        if (target.dataset.input === 'review-environment') {
            store.update((s) => {
                s.gateAnswers.environment = target.value === 'dev' ? 'dev' : target.value === 'staging' ? 'staging' : 'prod';
                s.gateReview = null;
            });
            return;
        }
        if (target.dataset.input === 'theme') {
            const nextTheme = target.value === 'light' ? 'light' : 'dark';
            store.update((s) => {
                s.academy.theme = nextTheme;
            }, { persist: true });
            updateEditorTheme(nextTheme);
            return;
        }
        if (target.dataset.input === 'font-scale') {
            store.update((s) => {
                s.academy.fontScale = Number(target.value);
            }, { persist: true });
            return;
        }
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'gate-check') {
        const key = target.dataset.id;
        store.update((s) => {
            if (key in s.gateAnswers) {
                s.gateAnswers[key] = target.checked;
                s.gateReview = null;
            }
        });
        return;
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'case-check') {
        const id = target.dataset.id || '';
        const index = Number(target.dataset.index);
        store.update((s) => {
            const list = new Set(s.academy.seniorChecklist[id] || []);
            if (target.checked)
                list.add(index);
            else
                list.delete(index);
            s.academy.seniorChecklist[id] = [...list];
            reconcileSeniorCompletion(s.academy, seniorCases);
        }, { persist: true });
        return;
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'capstone-check') {
        const idx = Number(target.dataset.index);
        if (target.checked && !capstoneNoteValid(store.getState().academy.capstoneEvidence[String(idx)] || '')) {
            notify('Primero documenta evidencia del hito.', true);
            return;
        }
        store.update((s) => {
            const list = new Set(s.academy.capstoneDone);
            if (target.checked)
                list.add(idx);
            else
                list.delete(idx);
            s.academy.capstoneDone = [...list];
            reconcileSeniorCompletion(s.academy, seniorCases);
        }, { persist: true });
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'cli-manifest-file') {
        const file = target.files?.[0];
        if (!file)
            return;
        if (file.size > 200_000) {
            store.update((s) => {
                s.cliManifest = null;
                s.cliManifestError = 'El manifiesto excede 200 KB.';
            });
            return;
        }
        void file
            .text()
            .then((text) => {
            const parsed = parseCliManifest(JSON.parse(text));
            store.update((s) => {
                s.cliManifest = parsed;
                s.cliManifestError = '';
            });
            notify('Manifiesto declarado importado. Los hashes no están cotejados con logs.');
        })
            .catch((error) => {
            store.update((s) => {
                s.cliManifest = null;
                s.cliManifestError = error instanceof Error ? error.message : 'JSON inválido';
            });
        });
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'user-plan-json') {
        const file = target.files?.[0];
        if (!file)
            return;
        if (file.size > 5_000_000) {
            store.update((s) => {
                s.userPlan = null;
                s.gateReview = null;
                s.userPlanError = 'Archivo demasiado grande (máximo 5 MB).';
            });
            return;
        }
        void file
            .text()
            .then((text) => {
            const inspected = inspectTerraformPlan(JSON.parse(text));
            store.update((s) => {
                s.userPlan = inspected;
                s.userPlanError = '';
                s.gateReview = null;
                s.gateAnswers = emptyGateAnswers();
            });
            notify('Plan JSON analizado localmente. Datos de recursos y secretos ocultos.');
        })
            .catch((err) => {
            store.update((s) => {
                s.userPlan = null;
                s.gateReview = null;
                s.userPlanError = err instanceof Error ? err.message : 'JSON inválido';
            });
        });
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'progress-file') {
        const file = target.files?.[0];
        if (!file)
            return;
        if (file.size > 2_000_000) {
            notify('El archivo de progreso supera 2 MB.', true);
            return;
        }
        void file
            .text()
            .then((text) => {
            const incoming = sanitizeState(JSON.parse(text), LESSON_IDS, SENIOR_IDS);
            if (!window.confirm('¿Reemplazar tu progreso actual por el archivo validado?'))
                return;
            const { invalidatedSenior, invalidatedLessons } = store.replaceAcademy(incoming);
            notify(invalidatedSenior.length || invalidatedLessons.length
                ? `Progreso importado; se invalidaron ${invalidatedSenior.length} casos Senior y ${invalidatedLessons.length} lecciones incompletas.`
                : 'Progreso importado y validado correctamente.');
        })
            .catch((err) => notify(`Importación inválida: ${err instanceof Error ? err.message : 'JSON incorrecto'}`, true));
    }
});
root.addEventListener('keydown', (event) => {
    const target = event.target;
    // Fallback Tab indentation only when `<textarea id="code-editor">` is visible without CodeMirror 6
    if (target instanceof HTMLTextAreaElement && target.id === 'code-editor' && !target.hidden && event.key === 'Tab') {
        event.preventDefault();
        target.setRangeText('  ', target.selectionStart, target.selectionEnd, 'end');
        const id = target.dataset.id || '';
        store.update((s) => {
            s.academy.code[id] = target.value;
            delete s.evals[id];
            reconcileLessonCompletion(s.academy, lessons);
        }, { persist: true });
        return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && target instanceof Element && target.matches('g.graph-node')) {
        event.preventDefault();
        const node = target;
        void handleAction('graph-node', node.dataset.id || '', 0, node);
    }
});
window.addEventListener('hashchange', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    store.update((s) => {
        s.mobileMenu = false;
        s.caseTab = 'investigar';
        s.showSeniorFix = false;
        s.seniorSimResult = '';
    });
});
if (!location.hash) {
    location.hash = ROUTES.home;
}
render();
