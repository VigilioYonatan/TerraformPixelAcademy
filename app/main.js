import { inspectTerraformPlan } from './planInspector.js';
import { buildPlanReviewMarkdown } from './planReport.js';
import { evaluateReleaseGate, emptyGateAnswers, exportGateReview } from './releaseGate.js';
import { h, render as renderPreact } from './vendor/preact.mjs';
import { AppShell } from './uiShell.js';
import { SeniorDashboard } from './uiSeniorHub.js';
import { SeniorCasePage } from './uiSeniorCase.js';
import { LearningCatalog } from './uiCatalog.js';
import { CliEvidenceDashboard } from './uiCliEvidence.js';
import { parseCliManifest, cliEvidenceMarkdown } from './cliEvidence.js';
import { activateCodeEditor, disposeCodeEditor } from './editor.js';
import { lessons, tracks, getLesson } from './curriculum.js';
import { seniorCases, getCase, capstoneSteps } from './senior.js';
import { games } from './games.js';
import { seniorSnippets } from './seniorSnippets.js';
import { buildSeniorReport, buildSeniorPortfolio } from './seniorReport.js';
import { seniorGate, capstoneNoteValid, reconcileSeniorCompletion } from './seniorProgress.js';
import { getSeniorDrill, evaluateSeniorDrill } from './seniorWhatIf.js';
import { cidrOverlap, estimateCost, planIntegrity } from './simulators.js';
import { planFixtures, graphs } from './fixtures.js';
import { defaultState, loadState, saveState, sanitizeState, calculateXP, evaluateLesson, reconcileLessonCompletion, escapeHtml as e, slugFilename } from './engine.js';
const app = document.getElementById('app');
if (!app)
    throw new Error('No se encuentra #app');
const root = app;
const LESSON_IDS = lessons.map(item => item.id);
const SENIOR_IDS = seniorCases.map(item => item.id);
let state = loadState(LESSON_IDS, SENIOR_IDS);
reconcileSeniorCompletion(state, seniorCases);
reconcileLessonCompletion(state, lessons);
let mobileMenu = false;
let activeLevel = 'Todos';
let caseTab = 'investigar';
let selectedPlan = 'p2';
let selectedGraph = 'network';
let selectedNode = '';
let showPlanRisks = false;
let evals = {};
let showSeniorFix = false;
let seniorSimResult = '';
let cidrA = '10.40.0.0/16', cidrB = '10.40.8.0/21';
let approvedCommit = 'a1b2', appliedCommit = 'c9d8';
let simulatedReplicas = 6;
let cliManifest = null;
let cliManifestError = '';
let userPlan = null;
let userPlanError = '';
let gateAnswers = emptyGateAnswers();
let gateReview = null;
let gameSession = null;
let toastTimer;
const urls = { home: '#/inicio', learn: '#/aprender', games: '#/juegos', labs: '#/laboratorios', graph: '#/grafo', plan: '#/planes', senior: '#/senior', progress: '#/progreso', settings: '#/ajustes', resources: '#/recursos' };
const mascot = (name) => `./assets/terra/${name}.png`;
const cls = (bool, good = 'active') => bool ? good : '';
function persist() { const ok = saveState(state); if (!ok)
    notify('El navegador no permitió guardar el progreso. Puedes exportarlo manualmente.', true); }
function notify(message, error = false) { const current = document.getElementById('toast'); if (current)
    current.remove(); const div = document.createElement('div'); div.id = 'toast'; div.className = `toast ${error ? 'error' : ''}`; div.role = 'status'; div.textContent = message; document.body.append(div); if (toastTimer)
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => div.remove(), 3900); }
function render() {
    document.body.dataset.theme = state.theme;
    document.body.classList.toggle('reduce-motion', state.reducedMotion);
    document.documentElement.style.fontSize = `${16 * state.fontScale}px`;
    const route = (location.hash || urls.home).split('?')[0].replace(/^#\/?/, '').split('/').filter(Boolean);
    const page = route[0] || 'inicio';
    if (page === 'aprender') {
        const from = new URLSearchParams(location.hash.split('?')[1] || '').get('nivel');
        if (from && ['Básico', 'Intermedio', 'Avanzado'].includes(from))
            activeLevel = from;
    }
    const result = page === 'inicio' ? home() : page === 'aprender' ? '' : page === 'evidencias' ? '' : page === 'leccion' ? lessonView(route[1]) : page === 'juegos' ? gamesHub() : page === 'juego' ? gameView(route[1]) : page === 'laboratorios' ? labsView() : page === 'grafo' ? graphView() : page === 'planes' ? planView() : page === 'senior' ? (route[1] ? '' : '') : page === 'progreso' ? progressView() : page === 'ajustes' ? settingsView() : page === 'recursos' ? resourcesView() : notFound();
    disposeCodeEditor();
    // Preact owns the top-level application shell; legacy HTML view templates are
    // migrated progressively, retaining event delegation and existing components.
    renderPreact(h(AppShell, { page, mobileMenu, seniorEnabled: state.seniorEnabled, content: result, view: page === 'senior' && !route[1] ? h(SeniorDashboard, { state, cases: seniorCases }) : page === 'senior' && route[1] && getCase(route[1]) ? h(SeniorCasePage, { scenario: getCase(route[1]), cases: seniorCases, state, tab: caseTab, showFix: showSeniorFix, simResult: seniorSimResult, cidrA, cidrB, approvedCommit, appliedCommit, replicas: simulatedReplicas }) : page === 'aprender' ? h(LearningCatalog, { lessons, tracks, state, level: activeLevel }) : page === 'evidencias' ? h(CliEvidenceDashboard, { manifest: cliManifest, error: cliManifestError }) : undefined }), root);
    if (page === 'leccion')
        void activateCodeEditor(value => {
            const id = route[1] || '';
            state.code[id] = value.slice(0, 30000);
            delete evals[id];
            reconcileLessonCompletion(state, lessons);
            persist();
        }, state.theme);
}
function link(text, path, style = 'btn btn-soft') { return `<a href="${path}" class="${style}">${text}</a>`; }
function label(text, variant = 'purple') { return `<span class="chip chip-${variant}">${e(text)}</span>`; }
function sectionHead(eyebrow, title, side = '') { return `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${side}</div>`; }
function bar(done, total) { const pct = total ? Math.min(100, Math.round(done / total * 100)) : 0; return `<div class="progress-track" role="progressbar" aria-label="Progreso" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}"><div class="progress-fill" style="width:${pct}%"></div></div>`; }
function stats() { const done = state.completed.length, seniorDone = state.seniorCompleted.length; return `<div class="cards-4"><div class="stat-pill"><span style="font-size:27px">✧</span><div><div class="number">${calculateXP(state).toLocaleString('es-PE')}</div><div class="caption">XP de práctica</div></div></div><div class="stat-pill"><span style="font-size:27px">▣</span><div><div class="number">${done}/36</div><div class="caption">Lecciones evaluadas</div></div></div><div class="stat-pill"><span style="font-size:27px">♛</span><div><div class="number">${seniorDone}/18</div><div class="caption">Casos Senior completados*</div></div></div><div class="stat-pill"><span style="font-size:27px">◆</span><div><div class="number">${Object.values(state.gameWins).reduce((a, b) => a + b, 0)}</div><div class="caption">Juegos ganados</div></div></div></div>`; }
function home() {
    const done = state.completed.length;
    return `<section class="hero"><div class="hero-content"><div class="hero-flag">✦ &nbsp; TU AVENTURA EN INFRASTRUCTURE AS CODE</div><h1 class="hero-title">Terra<span>Pixel</span><br>Academy</h1><div class="hero-subtitle">Construye, versiona y entrega infraestructura como código.</div><p class="hero-desc">Domina Terraform con lecciones interactivas, editor HCL, planes de ejemplo, laboratorios locales y desafíos de ingeniería Senior. Aprende haciendo, sin cuenta.</p><div class="hero-buttons">${link('▶ &nbsp; ' + (done ? 'Continuar mi ruta' : 'Empezar gratis'), done ? `#/leccion/${nextLesson().id}` : urls.learn, 'btn btn-primary btn-lg')}${link('Explorar Senior Mode ↗', urls.senior, 'btn btn-ghost btn-lg')}</div><div class="hero-numbers"><div><b>36</b><span>Lecciones</span></div><div><b>18</b><span>Senior</span></div><div><b>8</b><span>Rutas</span></div><div><b>5</b><span>Juegos</span></div></div></div><div class="hero-art"><div class="hero-orbit"></div><span class="hero-cloud" aria-hidden="true">☁</span><span class="hero-cloud left" aria-hidden="true">☁</span><img class="hero-terra" src="${mascot('hola')}" alt="Terra, mascota pixel-art de TerraPixel Academy con casco de ingeniería"/><div class="hero-floating">resource <span>"terraform_data"</span> { }</div><div class="hero-glow"></div></div></section>
<section class="section">${sectionHead('LEARNING MAP', 'Tu ruta de aprendizaje', link('Ver todo el currículo →', urls.learn, 'btn btn-sm btn-soft'))}<div class="level-grid">${[...new Set(lessons.map(l => l.level))].map((level, i) => { const sub = levelLessons(level), finished = sub.filter(l => state.completed.includes(l.id)).length; return `<a class="level-card ${i === 1 ? 'intermediate' : i === 2 ? 'advanced' : ''}" href="${urls.learn}?nivel=${encodeURIComponent(level)}"><div class="flex space-between"><span class="level-count">${['01 · FUNDAMENTOS', '02 · PRODUCTIVIDAD', '03 · PRODUCCIÓN'][i]}</span>${label(`${finished}/12`, 'purple')}</div><h3>${level}</h3><p>${['Tu primer recurso, HCL, variables, estado y CLI.', 'Módulos, testing, remote state y buenas prácticas CI.', 'Cloud, seguridad, políticas, FinOps y operaciones.'][i]}</p>${bar(finished, 12)}<div class="flex space-between" style="margin-top:18px"><span class="mini-strong">12 lecciones</span><span class="color-purple">Explorar →</span></div></a>`; }).join('')}</div></section>
<section class="section">${sectionHead('TERRA TE ACOMPAÑA', 'Una aventura de ingeniería con criterio')}<div class="cards-3"><div class="card"><img src="${mascot('codificando')}" alt="Terra codificando" class="portrait"><h3 class="card-title">Practica HCL</h3><p class="card-desc">Completa ejercicios en un editor accesible con reglas explicadas; Terraform CLI se ejecuta solo en los laboratorios locales.</p>${link('Ir al editor →', '#/leccion/B04', 'btn btn-sm btn-soft')}</div><div class="card"><img src="${mascot('arquitectura')}" alt="Terra mostrando un diagrama" class="portrait"><h3 class="card-title">Entiende el plan</h3><p class="card-desc">Explora cambios, reemplazos, grafos y riesgos con datos sintéticos claramente señalados.</p>${link('Visualizar planes →', urls.plan, 'btn btn-sm btn-soft')}</div><div class="card"><img src="${mascot('senior')}" alt="Terra en modo Senior" class="portrait"><h3 class="card-title">Piensa como Senior</h3><p class="card-desc">18 incidentes con decisiones, evidencias, revisión de riesgo y un proyecto final de plataforma.</p>${link('Abrir Senior Mode →', urls.senior, 'btn btn-sm btn-soft')}</div></div></section>
<section class="section">${sectionHead('TU PROGRESO', 'Cada decisión cuenta')}<div class="card"><div class="flex space-between" style="align-items:start"><div><h3 style="font-size:21px">Preparación para Platform Engineering</h3><p class="text-sub" style="font-size:13px;margin-top:7px">${done} de 36 lecciones completadas. Avanza a tu ritmo y conserva el progreso localmente.</p></div>${label(`${Math.round(done / 36 * 100)}%`, 'purple')}</div><div class="space24"></div>${bar(done, 36)}<div class="space24"></div>${stats()}<div class="space16"></div><p class="small-note">* Senior representa una práctica guiada/autoevaluación, no acreditación profesional ni ejecución Terraform verificada.</p></div></section>
<section class="section"><div class="senior-banner"><div><div class="eyebrow" style="color:#ce9eff">♛ SOLO PARA QUIEN REVISA EL RIESGO</div><h3>Senior Mode: más allá del terraform apply</h3><p>Practica drift, state, OIDC, pipeline integrity, controles de costos, incidentes y arquitectura multiambiente. Tu evidencia importa más que el botón verde.</p><div class="space16"></div>${link('Abrir los 18 casos →', urls.senior, 'btn btn-primary')}</div><img src="${mascot('senior')}" alt="Mascota Terra con corona" /></div></section>`;
}
function nextLesson() { return lessons.find(l => !state.completed.includes(l.id)) || lessons[0]; }
function levelLessons(level) { return lessons.filter(l => l.level === level); }
function lessonCard(l) { const done = state.completed.includes(l.id), fav = state.favorites.includes(l.id); return `<a class="list-card lesson-tile ${cls(done, 'done')}" data-title="${e((l.title + ' ' + l.subtitle + ' ' + l.id).toLowerCase())}" href="#/leccion/${l.id}"><div class="lesson-index">${done ? '✓' : l.id}</div><div class="list-card-info"><h3>${e(l.title)}</h3><p>${e(l.subtitle)}</p></div><div class="flex"><span class="mini-strong color-purple">${l.xp} XP</span>${fav ? '<span title="Favorito">★</span>' : ''}<span class="list-chevron">›</span></div></a>`; }
function catalog() {
    const url = new URLSearchParams((location.hash.split('?')[1] || ''));
    const from = url.get('nivel');
    if (from && ['Básico', 'Intermedio', 'Avanzado'].includes(from))
        activeLevel = from;
    const displayed = lessons.filter(l => activeLevel === 'Todos' || l.level === activeLevel);
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Aprender</span></div><div class="eyebrow">APRENDER TERRAFORM</div><h1 class="page-title">Tu mapa hacia IaC profesional</h1><p class="page-lead">36 lecciones reales de contenido, repartidas en tres niveles. Practica HCL en navegador y descarga proyectos para ejecutar Terraform de verdad en tu equipo.</p><div class="space24"></div><div class="flex space-between" style="flex-wrap:wrap"><div class="tabs" style="margin-bottom:0;border-bottom:0">${['Todos', 'Básico', 'Intermedio', 'Avanzado'].map(l => `<button class="tab ${cls(activeLevel === l)}" data-action="level" data-id="${l}">${l}</button>`).join('')}</div><input class="search-bar" id="lesson-search" type="search" placeholder="⌕  Buscar lecciones, conceptos…" aria-label="Buscar lecciones" /></div><div class="space16"></div><div class="lesson-list" id="lesson-list">${displayed.map(lessonCard).join('')}</div><div class="space24"></div><div class="notice">Las 36 lecciones están disponibles sin bloqueos. Completar implica pasar la evaluación educativa y responder el quiz correctamente, no ejecutar Terraform real.</div><section class="section">${sectionHead('8 ESPECIALIDADES', 'Itinerarios de especialización')}<div class="cards-4">${tracks.map(t => `<div class="track-card"><div class="track-icon">${iconFor(t.icon)}</div><span class="track-arrow">↗</span><h3>${e(t.title)}</h3><p>${e(t.description)}</p><div class="track-card-bottom"><span>${e(t.from)} — ${e(t.to)}</span>${link('Abrir →', t.from.startsWith('S') ? urls.senior : `#/leccion/${t.from}`, 'btn btn-sm btn-soft')}</div></div>`).join('')}</div></section>`;
}
function iconFor(name) { return { 'book-open': '▣', 'boxes': '⬡', 'shield': '◈', 'git-branch': '⑂', 'database': '▤', 'trending-down': '↘', 'network': '◇', 'crown': '♛', brain: '❖', workflow: '⑂', bug: '⚑', 'git-pull-request': '↔' }[name] || '◆'; }
function lessonView(id) {
    const l = id ? getLesson(id) : undefined;
    if (!l)
        return notFound();
    const code = state.code[l.id] ?? l.starter, evalResult = evals[l.id], selected = state.quizAnswers[l.id], correctQuiz = selected === l.correct, done = state.completed.includes(l.id), idx = lessons.findIndex(x => x.id === id);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <a href="${urls.learn}">Aprender</a> / ${e(l.level)} / <span>${e(l.id)}</span></div><div class="lesson-header"><div class="flex-wrap">${label(`Lección ${l.id}`, 'purple')}${label(l.level, 'cyan')}${done ? label('✓ Completada', 'green') : label(`${l.xp} XP`, 'purple')}${state.seniorEnabled ? label('♛ Senior Mode activo', 'yellow') : ''}<button class="btn btn-sm" data-action="favorite" data-id="${l.id}" aria-pressed="${state.favorites.includes(l.id)}">${state.favorites.includes(l.id) ? '★ Guardado' : '☆ Favorito'}</button></div><h1 class="page-title">${e(l.title)}</h1><p class="page-lead">${e(l.subtitle)}</p><div class="space12"></div>${bar(state.completed.filter(x => x.startsWith(l.id[0])).length, 12)}</div>
<div class="lesson-layout"><div class="lesson-main"><section class="content-panel"><div class="objective-strip"><div style="flex:1"><div class="eyebrow">CONCEPTO · ${e(l.level.toUpperCase())}</div><h2 style="margin:8px 0">Lo que aprenderás</h2><p class="prose">${e(l.concept)}</p></div><img src="${mascot('leyendo')}" alt="Terra leyendo un manual" /></div><div class="concept-grid"><div class="concept-tile"><strong>01 · Comprender</strong>${e(l.subtitle)}</div><div class="concept-tile"><strong>02 · Practicar</strong>Editar HCL y comprobar condiciones específicas de esta lección.</div><div class="concept-tile"><strong>03 · Verificar</strong>Resolver el quiz y, si aplica, ejecutar pruebas CLI en tu equipo.</div></div></section>
<div class="mission-banner"><strong>🎯 TU MISIÓN</strong>Completa el bloque marcado como TODO para conseguir las condiciones esperadas. Después responde la pregunta de conocimiento. <b>La web no ejecuta HCL ni Terraform CLI.</b></div>
<section class="editor-card"><div class="editor-toolbar"><div class="flex"><span style="color:#8a62e9">▣</span><span class="file-tab">main.tf</span></div><span class="editor-tag">HCL · editor de texto</span></div><label class="sr-only" for="code-editor">Editor HCL de ${e(l.id)}</label><textarea id="code-editor" class="code-editor" data-input="code" data-id="${l.id}" spellcheck="false" autocapitalize="off" aria-label="Editor main.tf">${e(code)}</textarea><div class="editor-bottom"><div class="flex"><button class="btn btn-primary btn-sm" data-action="evaluate" data-id="${l.id}">▶ Evaluar reglas</button><button class="btn btn-sm" data-action="hint" data-id="${l.id}">✦ Pista</button><button class="btn btn-sm" data-action="solution" data-id="${l.id}">Ver solución</button></div><div class="flex"><button class="btn btn-sm" data-action="reset-code" data-id="${l.id}">↺ Restablecer</button><button class="btn btn-sm" data-action="download-code" data-id="${l.id}">↓ .tf</button></div></div></section>
${evalResult ? renderEvaluation(evalResult) : ''}<section class="content-panel"><div class="eyebrow">COMPRENSIÓN</div><h2 style="margin-top:9px">Pon a prueba tu criterio</h2><p class="prose">${e(l.question)}</p><div class="space16"></div>${l.options.map((opt, i) => `<button class="quiz-answer ${cls(selected === i, 'selected')} ${selected === i ? (correctQuiz ? 'correct' : 'incorrect') : ''}" data-action="answer-quiz" data-id="${l.id}" data-index="${i}"><span class="quiz-letter">${String.fromCharCode(65 + i)}</span><span>${e(opt)}</span></button>`).join('')}${selected !== undefined ? `<div class="space16"></div><div class="feedback ${correctQuiz ? '' : 'fail'}"><h3>${correctQuiz ? '✓ Respuesta correcta' : '⨯ Esa opción no es correcta'}</h3><p>${correctQuiz ? 'Buen criterio. Ahora comprueba las reglas HCL.' : `Revisa la explicación y vuelve a intentarlo. Pista: ${e(l.tip)}`}</p></div>` : ''}</section>
<div class="flex-wrap">${done ? label('✓ Lección completada', 'green') : label('Pendiente: evaluación + quiz', 'yellow')}${link('⬇ Descargar laboratorio', `./assets/labs/${l.id}.zip`, 'btn btn-soft')}${link('Ver grafos →', urls.graph, 'btn btn-sm')}</div><div class="space16"></div>${link("Ver evidencia CLI real →", "#/evidencias", "btn btn-soft")}<div class="lesson-footer">${prev ? link('← ' + e(prev.id + ' · ' + prev.title), `#/leccion/${prev.id}`, 'btn') : link('← Ver currículo', urls.learn, 'btn')}${next ? link('Siguiente: ' + e(next.id) + ' →', `#/leccion/${next.id}`, 'btn btn-primary') : link('Ir a Senior Mode →', urls.senior, 'btn btn-primary')}</div>
${state.seniorEnabled ? `<section class="case-review"><b>♛ PREGUNTA DE ARQUITECTURA</b><p>¿Cómo cambiarían los riesgos de esta configuración en producción? Define owner, observabilidad y una prueba reproducible.</p><div class="space12"></div>${link('Ver casos relacionados →', urls.senior, 'btn btn-sm btn-soft')}</section>` : ''}</div>
<aside class="lesson-aside"><div class="content-panel"><h3>Paso a paso</h3>${['Lee el concepto y el resultado esperado.', 'Completa la línea TODO en main.tf.', 'Pulsa “Evaluar reglas” (no CLI).', 'Responde el quiz correctamente.', 'Descarga y ejecuta la práctica local.'].map((s, i) => `<div class="side-step ${i === 0 ? 'active' : ''}">${i + 1}. ${s}</div>`).join('')}</div><div class="content-panel"><img src="${mascot(done ? 'exito' : 'idea')}" class="side-terra" alt="Mascota Terra ofreciendo ayuda"/><p class="side-note">${done ? '¡Lección completada! Puedes repetirla cuando quieras.' : 'Terra te acompaña. Pide una pista cuando te atasques.'}</p><div class="space12"></div><div class="side-caution">${e(l.warning)}</div></div><div class="content-panel"><h3>Práctica local</h3><p class="card-desc">En tu equipo con Terraform CLI instalado, tras descomprimir el pack:</p>${['terraform fmt -check', 'terraform init -backend=false', 'terraform validate', 'terraform test'].map(c => `<div class="terminal-command"><code>${c}</code><button data-action="copy" data-value="${e(c)}">Copiar</button></div>`).join('')}<p class="small-note">Los comandos no se ejecutan en el navegador. Los resultados CLI están sin verificar en esta sesión.</p></div></aside></div>`;
}
function renderEvaluation(result) { return `<div class="feedback ${result.ok ? '' : 'fail'}" role="status"><h3>${result.ok ? '✓ Reglas educativas superadas' : '⚠ Aún hay condiciones por corregir'}</h3><ul>${result.checks.map(item => `<li>${item.ok ? '✓' : '○'} ${e(item.label)}</li>`).join('')}</ul><p class="provenance">PROCEDENCIA: ${result.provenance} · ${e(result.note)}</p></div>`; }
function gamesHub() { return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Minijuegos</span></div><div class="eyebrow">APRENDE JUGANDO</div><h1 class="page-title">Minijuegos IaC</h1><p class="page-lead">Cinco mecánicas, veintiuna preguntas y feedback específico. Los juegos comprueban conocimientos; no simulan una ejecución real de Terraform.</p><div class="space24"></div><div class="games-grid">${games.map((g, i) => `<div class="card game-card"><div class="flex space-between">${label(g.eyebrow, i % 2 ? 'cyan' : 'purple')}${label(`Mejor: ${state.gameWins[g.id] || 0}/${g.questions.length}`, 'green')}</div><div style="font-size:36px;color:var(--purple)">${iconFor(g.icon)}</div><h3>${e(g.title)}</h3><p>${e(g.description)}</p>${link('▶ Jugar', `#/juego/${g.id}`, 'btn btn-primary')}</div>`).join('')}</div><section class="section"><div class="senior-banner"><div><div class="eyebrow">DESAFÍO EXTRA</div><h3>¿Y si una decisión de Terraform falla en producción?</h3><p>Senior Mode añade incidentes sintéticos, revisión técnica y documentación de decisiones verificable.</p><div class="space16"></div>${link('Ir a Senior Mode →', urls.senior, 'btn btn-primary')}</div><img src="${mascot('alerta')}" alt="Terra reaccionando a una alerta"/></div></section>`; }
function gameView(id) {
    const game = games.find(g => g.id === id);
    if (!game)
        return notFound();
    if (!gameSession || gameSession.id !== game.id)
        gameSession = { id: game.id, at: 0, score: 0, last: null, finished: false };
    const s = gameSession;
    if (s.finished) {
        const won = s.score >= Math.ceil(game.questions.length * .8);
        return `<div class="breadcrumb"><a href="${urls.games}">Minijuegos</a> / <span>${e(game.title)}</span></div><div class="game-stage card game-result"><div class="eyebrow">JUEGO FINALIZADO</div><img src="${mascot(won ? 'exito' : 'pensando')}" alt="Terra mostrando el resultado del juego"/><h2>${won ? '¡Reto superado!' : 'Buen intento, sigue practicando'}</h2><p class="prose" style="margin:15px 0">Respuestas correctas: <strong>${s.score} de ${game.questions.length}</strong>. ${won ? 'Has logrado el objetivo de conocimiento.' : 'Lee las explicaciones e inténtalo de nuevo.'}</p>${label(won ? '+20 XP por respuesta acertada' : 'Practica y mejora', won ? 'green' : 'yellow')}<div class="space24"></div><div class="flex-wrap" style="justify-content:center"><button class="btn btn-primary" data-action="restart-game" data-id="${game.id}">↺ Volver a jugar</button>${link('Todos los juegos', urls.games, 'btn')}</div></div>`;
    }
    const q = game.questions[s.at];
    return `<div class="breadcrumb"><a href="${urls.games}">Minijuegos</a> / <span>${e(game.title)}</span></div><div class="game-stage"><div class="flex space-between"><div><div class="eyebrow">${e(game.eyebrow)}</div><h1 class="page-title">${e(game.title)}</h1></div><img src="${mascot(s.last === null ? 'pensando' : 'exito')}" alt="Terra" class="portrait"></div><div class="game-progress">${game.questions.map((_, i) => `<span class="${i < s.at ? 'done' : i === s.at ? 'active' : ''}"></span>`).join('')}</div><div class="card" style="margin-top:22px"><div class="flex space-between">${label(`Pregunta ${s.at + 1}/${game.questions.length}`)}${label(`${s.score} aciertos`, 'green')}</div><h2 class="game-question">${e(q.question)}</h2>${q.options.map((choice, i) => `<button data-action="game-answer" data-id="${game.id}" data-index="${i}" ${s.last !== null ? 'disabled' : ''} class="quiz-answer ${s.last === i ? (s.last === q.correct ? 'correct' : 'incorrect') : ''}"><span class="quiz-letter">${String.fromCharCode(65 + i)}</span>${e(choice)}</button>`).join('')}${s.last !== null ? `<div class="space16"></div><div class="feedback ${s.last === q.correct ? '' : 'fail'}"><h3>${s.last === q.correct ? '✓ Correcto' : '○ Hay una mejor decisión'}</h3><p>${e(q.explanation)}</p></div><div class="space16"></div><button class="btn btn-primary" data-action="next-game" data-id="${game.id}">${s.at === game.questions.length - 1 ? 'Ver resultado →' : 'Siguiente pregunta →'}</button>` : ''}</div></div>`;
}
function labsView() {
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Laboratorios</span></div><div class="eyebrow">PRÁCTICA AUTÉNTICA</div><h1 class="page-title">Laboratorios Terraform locales</h1><p class="page-lead">36 paquetes individuales de ejercicios con HCL, test .tftest.hcl de referencia y README. Descárgalos para probar con tu propia Terraform CLI; ninguna cuenta cloud es necesaria para los laboratorios seguros de terraform_data.</p><div class="space24"></div><div class="alert"><strong>Importante:</strong> las descargas están incluidas en el ZIP. En esta aplicación <b>NO</b> se ejecuta Terraform; algunos ejemplos avanzados con provider AWS/backend S3 son solo ilustrativos y requieren sustituir valores, permisos y revisión previa. Los tests no están marcados PASS hasta que los ejecutes.</div><div class="space24"></div><div class="card" style="margin-bottom:20px"><h3 class="card-title">Comienza con la CLI en tu equipo</h3><p class="card-desc">Abre un laboratorio offline en una terminal. Revisa su README para saber si requiere providers externos. El pack B04 es un punto de partida seguro sin credenciales cloud.</p>${['terraform version', 'terraform fmt -check', 'terraform init -backend=false', 'terraform validate', 'terraform test'].map(c => `<div class="terminal-command"><code>${c}</code><button data-action="copy" data-value="${e(c)}">Copiar</button></div>`).join('')}</div>
${['Básico', 'Intermedio', 'Avanzado'].map(level => `<section class="section">${sectionHead('LAB PACKS', level)}<div class="lesson-list">${levelLessons(level).map(l => `<div class="list-card"><div class="lesson-index">${l.id}</div><div class="list-card-info"><h3>${e(l.title)}</h3><p>main.tf · outputs/test · README · ZIP</p></div><a class="btn btn-sm btn-primary" href="./assets/labs/${l.id}.zip" download="${l.id}-lab.zip">↓ ZIP</a></div>`).join('')}</div></section>`).join('')}<section class="section"><div class="notice">Para pruebas AWS reales, usa una cuenta sandbox propia con presupuesto y cleanup. Nunca guardes credenciales en Terraform source, en state público ni en artefactos de CI.</div></section>`;
}
function graphView() {
    const graph = graphs.find(g => g.id === selectedGraph) || graphs[0];
    const node = graph.nodes.find(n => n.id === selectedNode) || graph.nodes[0];
    const lines = graph.nodes.flatMap(n => n.dep.map(ref => { const from = graph.nodes.find(x => x.id === ref); return from ? `<line class="edge" x1="${from.x + 65}" y1="${from.y + 19}" x2="${n.x + 65}" y2="${n.y + 19}" marker-end="url(#edge-arrow)"></line>` : ''; })).join('');
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Visualizador</span></div><div class="eyebrow">INFRASTRUCTURE GRAPH</div><h1 class="page-title">Observa las dependencias</h1><p class="page-lead">Grafo interactivo basado en topologías ficticias: qué recurso depende de cuál, dónde hay acoplamiento y cómo acotar el blast radius.</p><div class="space24"></div><div class="tabs">${graphs.map(g => `<button class="tab ${cls(graph.id === g.id)}" data-action="graph" data-id="${g.id}">${e(g.title)}</button>`).join('')}</div><div class="content-panel"><div class="flex space-between" style="align-items:start"><div><h2>${e(graph.title)}</h2><p class="prose">${e(graph.description)}</p></div>${label('SIMULACIÓN VISUAL', 'yellow')}</div><div class="space16"></div><div class="graph-frame"><svg viewBox="0 0 930 350" role="img" aria-label="Grafo de dependencias de ${e(graph.title)}"><defs><marker id="edge-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 z" fill="#b38bff"/></marker></defs>${lines}${graph.nodes.map(n => `<g class="graph-node ${cls(node.id === n.id)}" data-action="graph-node" data-id="${n.id}" role="button" tabindex="0" aria-label="Ver nodo ${e(n.label)}"><rect x="${n.x}" y="${n.y}" rx="11" width="130" height="46"/><text x="${n.x + 65}" y="${n.y + 27}" text-anchor="middle">${e(n.label)}</text></g>`).join('')}</svg></div><div class="graph-legend">${graph.nodes.map(n => `<button class="btn btn-sm ${n.id === node.id ? 'btn-primary' : ''}" data-action="graph-node" data-id="${n.id}">${e(n.label)}</button>`).join('')}</div><div class="graph-detail"><div class="flex-wrap">${label(node.category, 'purple')}${label(node.level, 'cyan')}</div><h3 style="margin:10px 0">${e(node.label)}</h3><p class="prose">${e(node.description)}</p><p class="small-note">Depende de: ${node.dep.length ? node.dep.map(e).join(', ') : 'ningún otro nodo'}.</p></div><div class="notice">Estos diagramas no provienen de terraform graph real. Son casos de estudio para aprender modelado, propiedad y dependencias.</div></div><div class="space24"></div>${link('Explorar cambios de plan →', urls.plan, 'btn btn-primary')}`;
}
function localPlanPanel() {
    const plan = userPlan;
    const counts = plan ? Object.entries(plan.summary).filter(([, num]) => num > 0).map(([name, num]) => label(`${name}: ${num}`, name === 'delete' || name === 'replace' ? 'red' : 'cyan')).join('') : '';
    return `<section class="content-panel" style="margin-top:24px" id="real-plan-review"><div class="flex space-between"><div><div class="eyebrow">ANÁLISIS LOCAL · ARCHIVO DEL ESTUDIANTE</div><h2 style="margin:8px 0">Inspeccionar terraform show -json</h2></div>${label('SIN SUBIR A SERVIDOR', 'green')}</div>
 <p class="prose">Carga un <code>plan.json</code> generado en tu propio entorno con <code>terraform show -json plan.tfplan &gt; plan.json</code>. La app analiza operaciones y drift declarados, sin leer valores before/after, variables ni outputs. <strong>Los nombres y direcciones pueden revelar información interna.</strong></p>
 <label class="field-label" for="user-plan-json">Archivo local plan.json (máx. 5 MB)</label><input type="file" id="user-plan-json" accept=".json,application/json" aria-label="Seleccionar plan JSON de Terraform" />
 <div class="space12"></div><button class="btn btn-sm" data-action="clear-user-plan">Olvidar archivo analizado</button>${plan ? ` <button class="btn btn-sm btn-primary" data-action="export-user-plan">↓ Informe local (.md)</button>` : ''}
 ${userPlanError ? `<div class="alert" role="alert">${e(userPlanError)}</div>` : ''}
 ${plan ? `<div class="release-gate" id="release-gate"><div class="eyebrow">SENIOR · RELEASE GATE</div><h3>¿Este plan estaría listo para revisión humana?</h3><p class="small-note">Evaluación local orientativa: los controles marcados son declaraciones tuyas, no verificaciones externas. Nunca concede permiso de apply.</p>
 <label class="field-label" for="review-environment">Ambiente declarado</label><select class="search-bar" id="review-environment" data-input="review-environment"><option value="prod" ${gateAnswers.environment === 'prod' ? 'selected' : ''}>Producción</option><option value="staging" ${gateAnswers.environment === 'staging' ? 'selected' : ''}>Staging</option><option value="dev" ${gateAnswers.environment === 'dev' ? 'selected' : ''}>Development</option></select>
 ${[['provenanceVerified', 'Cotejé origen, commit, workspace y digest del plan'], ['ownersApproved', 'Owners del entorno revisaron el cambio'], ['driftInvestigated', 'Investigación del drift documentada'], ['destructiveReviewed', 'Revisé los reemplazos/eliminaciones por recurso'], ['rollbackDocumented', 'Runbook, rollback y condiciones de parada documentados'], ['costReviewed', 'Revisé costos, cuotas y presupuesto']].map(([key, labelText]) => `<label class="check-row"><input type="checkbox" data-input="gate-check" data-id="${key}" ${gateAnswers[key] ? 'checked' : ''}/>${e(labelText)}</label>`).join('')}
 <button class="btn btn-primary" data-action="run-release-gate">Evaluar gate didáctico →</button> ${gateReview ? `<button class="btn btn-soft" data-action="export-release-gate">↓ Informe gate .md</button><div class="feedback ${gateReview.status === 'READY_FOR_HUMAN_REVIEW' ? '' : 'fail'}" role="status"><h3>${e(gateReview.status)}</h3><p>${gateReview.checksPassed}/${gateReview.checksRequired} controles declarados</p>${gateReview.findings.map(f => `<div class="side-step">${e(f.id)} (${f.severity}): ${e(f.message)}</div>`).join('')}</div>` : ''}
 </div>` : ''}
 ${plan ? `<div class="notice" role="status" style="margin-top:15px"><b>Procedencia: USER_SUPPLIED_TERRAFORM_JSON</b> · Terraform ${e(plan.terraformVersion)} · ${plan.total} cambios · ${plan.destructive} destructivos · ${plan.sensitiveCount} marcados sensitive · ${plan.driftCount} eventos drift. No se verifica ejecución cloud.</div><div class="flex-wrap" style="margin:16px 0">${counts}</div>
 <div class="plan-import-results">${plan.changes.map(item => `<div class="plan-resource"><div class="plan-resource-head"><code>${e(item.address)}</code>${label(item.kind, item.kind === 'delete' || item.kind === 'replace' ? 'red' : 'cyan')}</div><div class="detail">Provider: ${e(item.provider)} · ${item.sensitive ? 'Datos sensibles presentes (no mostrados)' : 'Sin indicador sensitive en el cambio'}</div></div>`).join('')}</div>
 <div class="notice">${plan.notices.map(note => `<p>${e(note)}</p>`).join('')}</div>${plan.driftCount ? `<h3>Drift reportado por Terraform (metadatos)</h3><div class="plan-import-results">${plan.drift.map(item => `<div class="plan-resource"><code>${e(item.address)}</code> ${label(item.kind, item.kind === 'delete' || item.kind === 'replace' ? 'red' : 'yellow')}</div>`).join('')}</div>` : ''}` : ''}
 </section>`;
}
function planView() {
    const fixture = planFixtures.find(p => p.id === selectedPlan) || planFixtures[0];
    const symbols = { create: '+', update: '~', delete: '−', replace: '−/+', 'no-op': '=' };
    const spanish = { create: 'Crear', update: 'Actualizar', delete: 'Eliminar', replace: 'Reemplazar', 'no-op': 'Sin cambios' };
    const risky = fixture.resources.filter(r => r.action === 'delete' || r.action === 'replace').length;
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Plan Explorer</span></div><div class="eyebrow">LEER ANTES DE APLICAR</div><h1 class="page-title">Plan Explorer</h1><p class="page-lead">Compara operaciones de infraestructura y detecta cambios peligrosos. Todos los planes de esta pantalla son <strong>sintéticos</strong> para aprendizaje, no resultados de Terraform CLI.</p><div class="space24"></div><div class="plan-layout"><aside class="fixture-menu">${planFixtures.map(p => `<button class="fixture-select ${cls(p.id === fixture.id)}" data-action="plan" data-id="${p.id}"><strong>${e(p.title)}</strong><small>${e(p.environment)} · ${p.resources.length} recursos</small></button>`).join('')}</aside><div class="content-panel"><div class="flex space-between"><div><div class="eyebrow">PLAN DIDÁCTICO · ${e(fixture.environment.toUpperCase())}</div><h2 style="margin-top:8px">${e(fixture.title)}</h2></div>${label('SYNTHETIC_FIXTURE', 'yellow')}</div><p class="prose">${e(fixture.summary)}</p><div class="space16"></div><div class="plan-toolbar">${label(`${fixture.resources.length} recursos`, 'purple')}${label(`${risky} operaciones destructivas`, risky ? 'red' : 'green')}<button class="btn btn-sm btn-soft" data-action="reveal-plan">${showPlanRisks ? 'Ocultar análisis' : 'Mostrar análisis de riesgo'}</button></div><div class="space16"></div>${fixture.resources.map(r => `<div class="plan-resource"><div class="plan-resource-head"><code><strong class="action-${r.action}">${symbols[r.action]}</strong> ${e(r.name)}</code>${label(spanish[r.action], r.action === 'replace' || r.action === 'delete' ? 'red' : r.action === 'create' ? 'green' : 'cyan')}</div><div class="detail">${e(r.detail)}</div>${showPlanRisks ? `<div class="risk">⚑ ${e(r.risk)}</div>` : ''}</div>`).join('')}<div class="notice">La clasificación de operaciones se realiza sobre datos preparados. Un plan real debe revisarse desde un origen autorizado, con entorno y versión exactos.</div></div></div><div class="space24"></div>${localPlanPanel()}<div class="space24"></div>${link('Resolver caso S11: plan integrity →', '#/senior/S11', 'btn btn-primary')}`;
}
function seniorCaseView(id) {
    const c = getCase(id);
    if (!c)
        return notFound();
    const decision = state.seniorDecisions[c.id];
    const correct = decision === c.correct;
    const checked = state.seniorChecklist[c.id] || [];
    const evidence = state.seniorEvidence[c.id] || '';
    const done = state.seniorCompleted.includes(c.id);
    const status = seniorGate(state, c);
    const canFinish = status.ok;
    const index = seniorCases.findIndex(s => s.id === c.id), prev = seniorCases[index - 1], next = seniorCases[index + 1];
    const tabNames = [['investigar', 'Investigar'], ['decision', 'Decisión'], ['review', 'Code Review'], ['evidencia', 'Evidencia'], ['operaciones', 'Operaciones']];
    return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <a href="${urls.senior}">Senior Mode</a> / <span>${e(c.id)}</span></div><div class="flex-wrap">${label(c.id, 'purple')}${label(c.severity, c.severity === 'Crítico' ? 'red' : 'yellow')}${label(c.pillar, 'cyan')}<span id="current-case-status">${done ? label('✓ Autoevaluado', 'green') : label('Caso abierto', 'purple')}</span></div><h1 class="page-title" style="max-width:1080px">${e(c.title)}</h1><p class="page-lead" style="max-width:1100px">${e(c.subtitle)}</p><div class="space24"></div><div class="case-details"><div><nav class="case-steps" aria-label="Fases del caso">${tabNames.map(([id, text], i) => `<button class="tab ${cls(caseTab === id)}" data-action="case-tab" data-id="${id}">${i + 1}. ${text}</button>`).join('')}</nav>${renderCaseTab(c, decision, checked, evidence, correct)}<div class="space24"></div><div class="case-panel"><div class="flex space-between"><div><div class="eyebrow">GATE DE AUTOEVALUACIÓN</div><h2 style="margin:9px 0">¿Caso completado?</h2></div><span id="senior-gate-status">${done ? label('✓ Autoevaluado', 'green') : label('Pendiente', 'yellow')}</span></div><p>La decisión y el desafío what-if deben ser correctos, los cuatro controles marcados y el ADR con contexto, decisión, riesgos, evidencia y rollback (mínimo 120 caracteres). Es una <strong>autoevaluación orientativa</strong>; no se verifica el contenido semántico de la evidencia ni infraestructura real.</p><div class="space16"></div>${status.reasons.map(r => `<div class="side-step">○ ${e(r)}</div>`).join('')}<div class="space16"></div><button class="btn btn-soft" data-action="export-senior" data-id="${c.id}">↓ Exportar informe/ADR ${c.id}</button> <button class="btn btn-primary" data-action="finish-case" data-id="${c.id}" ${canFinish ? '' : 'disabled'}>${done ? '✓ Revalidar caso' : '♛ Marcar autoevaluación completa'}</button></div><div class="space16"></div>${link("Ver evidencia CLI real →", "#/evidencias", "btn btn-soft")}<div class="lesson-footer">${prev ? link('← ' + e(prev.id + ' · ' + prev.title), `#/senior/${prev.id}`, 'btn') : link('← Todos los casos', urls.senior, 'btn')}${next ? link(e(next.id) + ' →', `#/senior/${next.id}`, 'btn btn-primary') : link('Volver a dashboard', urls.senior, 'btn btn-primary')}</div></div>
<aside class="case-sidebar"><div class="content-panel"><div class="flex space-between"><h3>Ficha del incidente</h3>${label('FICTICIO', 'yellow')}</div><img src="${mascot(done ? 'exito' : 'arquitectura')}" class="side-terra" alt="Terra analizando arquitectura"/><div class="side-step"><b>Severidad:</b> ${e(c.severity)}</div><div class="side-step"><b>Dominio:</b> ${e(c.pillar)}</div><div class="side-step"><b>Puntos:</b> ${c.xp} XP</div><div class="side-step"><b>Evidencia:</b> ${e(c.mode)}</div></div><div class="content-panel"><h3>Autoverificación</h3>${c.checklist.map((text, i) => `<label class="check-row"><input type="checkbox" data-input="case-check" data-id="${c.id}" data-index="${i}" ${checked.includes(i) ? 'checked' : ''}/>${e(text)}</label>`).join('')}<p class="small-note" style="margin-top:15px">Estas casillas registran tu propia declaración, no un test automatizado de los artefactos.</p></div></aside></div>`;
}
function renderCaseTab(c, decision, checked, evidence, correct) {
    if (caseTab === 'investigar')
        return `<section class="case-panel"><div class="eyebrow">ETAPA 01 · INVESTIGACIÓN</div><h2 style="margin-top:11px">¿Qué está ocurriendo?</h2><p>${e(c.subtitle)}</p><div class="case-review"><b>Tu misión</b><p>${e(c.mission)}</p></div><h3 style="margin:24px 0 11px">Artefactos del incidente</h3><p>${e(c.artifacts)}</p><div class="space16"></div><a class="btn btn-sm btn-soft" href="./assets/senior/${c.id}.zip" download="${c.id}-incident.zip">↓ Descargar artefactos de este incidente</a><div class="space16"></div><div class="alert"><b>Prueba negativa:</b> ${e(c.negative)}</div><div class="space24"></div>${seniorSimulator(c.id)}<div class="space24"></div><div class="flex-wrap">${link('Explorar un plan ficticio →', urls.plan, 'btn btn-sm btn-soft')}${link('Explorar dependencias →', urls.graph, 'btn btn-sm btn-soft')}<button class="btn btn-primary btn-sm" data-action="case-tab" data-id="decision">Tomar una decisión →</button></div></section>`;
    if (caseTab === 'decision')
        return `<section class="case-panel"><div class="eyebrow">ETAPA 02 · DECISIÓN</div><h2 style="margin-top:9px">Escoge una respuesta defendible</h2><p>${e(c.mission)}</p><div class="space16"></div>${c.choices.map((choice, i) => `<button class="quiz-answer ${decision === i ? (correct ? 'correct' : 'incorrect') : ''}" data-action="case-decision" data-id="${c.id}" data-index="${i}"><span class="quiz-letter">${String.fromCharCode(65 + i)}</span>${e(choice)}</button>`).join('')}${decision !== undefined ? `<div class="space16"></div><div class="feedback ${correct ? '' : 'fail'}"><h3>${correct ? '✓ Decisión defendible' : '○ Se requiere una opción más segura'}</h3><p>${e(c.explanation)}</p></div>` : ''}<div class="space24"></div><button class="btn btn-primary" data-action="case-tab" data-id="review">Continuar al review →</button></section>`;
    if (caseTab === 'review')
        return `<section class="case-panel"><div class="eyebrow">ETAPA 03 · CODE / ARCHITECTURE REVIEW</div><h2 style="margin-top:9px">Hallazgos y límites de prueba</h2><p>Revisa el peligro antes de recomendar cambios. Los artefactos de este caso son sintéticos; la revisión exige una hipótesis verificable, no una respuesta que solo suene profesional.</p><div class="case-review"><b>Hallazgo principal (${e(c.pillar)})</b><p>${e(c.negative)}</p></div><div class="case-review"><b>Acción profesional esperada</b><p>${e(c.mission)}</p></div><div class="case-review"><b>Qué revisaría en un PR / RFC</b><p>${e(c.artifacts)}</p></div>${renderReviewSnippet(c.id)}<h3 style="margin:20px 0 10px">Rúbrica de revisión</h3>${['Impacto y blast radius explícitos', 'Evidencia reproducible con fuente y fecha', 'Control preventivo y criterio GO/NO-GO', 'Rollback o procedimiento de contención'].map(s => `<div class="side-step">✓ ${s}</div>`).join('')}<div class="space24"></div><button class="btn btn-primary" data-action="case-tab" data-id="evidencia">Documentar evidencia →</button></section>`;
    if (caseTab === 'evidencia')
        return `<section class="case-panel"><div class="eyebrow">ETAPA 04 · EVIDENCIA / ADR</div><h2 style="margin-top:9px">Documenta tu decisión</h2><p>Escribe diagnóstico, riesgos, decisión, estado de evidencia y rollback. La app comprueba secciones y longitud, no su veracidad; no interpreta ni certifica la calidad de tu ADR.</p><div class="case-review"><b>Contrato de evidencia</b><p>${e(c.evidence)}</p></div><label class="field-label" for="senior-evidence">Tu ADR o explicación técnica (almacenada localmente)</label><textarea class="evidence-textarea" data-input="case-evidence" data-id="${c.id}" id="senior-evidence" placeholder="Contexto…\nDecisión y alternativas…\nRiesgos…\nEvidencia ejecutada / NOT_RUN…\nRollback…">${e(evidence)}</textarea><p class="small-note" id="evidence-count">${evidence.trim().length} caracteres. Mínimo didáctico: 120 y cinco secciones.</p><div class="space24"></div><button class="btn btn-soft" data-action="export-senior" data-id="${c.id}">↓ Exportar mi ADR</button> <button class="btn btn-primary" data-action="case-tab" data-id="operaciones">Preparar operaciones →</button></section>`;
    const capstone = c.id === 'S18' ? `<div class="space24"></div><div class="eyebrow">CAPSTONE · 8 HITOS</div><h3 style="margin:12px 0">Checklist de entregables</h3>${capstoneSteps.map((step, i) => `<div class="capstone-stage"><label class="check-row"><input type="checkbox" id="capstone-check-${i}" data-input="capstone-check" data-index="${i}" ${state.capstoneDone.includes(i) ? 'checked' : ''} ${capstoneNoteValid(state.capstoneEvidence[String(i)] || '') ? '' : 'disabled'}/><span><b>${i + 1}. ${e(step.name)}</b><br><span class="small-note">${e(step.detail)}</span></span></label><label class="field-label" for="capstone-note-${i}">Evidencia del hito ${i + 1} (autodeclarada)</label><textarea id="capstone-note-${i}" class="capstone-note" data-input="capstone-note" data-index="${i}" maxlength="2500" placeholder="Control/risgo, evidencia: NOT_RUN / PASS / FAIL / BLOCKED, responsable y siguiente paso…">${e(state.capstoneEvidence[String(i)] || '')}</textarea><p id="capstone-status-${i}" class="small-note">${capstoneNoteValid(state.capstoneEvidence[String(i)] || '') ? 'Estructura lista. Marca el hito si revisaste su evidencia.' : 'Pendiente: al menos 45 caracteres y estado PASS/FAIL/NOT_RUN/BLOCKED.'}</p></div>`).join('')}<div class="space16"></div>${label(`${state.capstoneDone.length}/8 hitos declarados`, 'purple')}<p class="small-note">Las notas son declaraciones educativas. Ni la CLI ni un revisor externo las han validado.</p>` : '';
    return `<section class="case-panel"><div class="eyebrow">ETAPA 05 · OPERACIONES / HANDOFF</div><h2 style="margin-top:9px">¿Qué ocurre después?</h2><p>Diseña controles y handoff. Define cómo demostrarías que el sistema se recupera sin inventar ejecuciones que no han ocurrido.</p>${['Antes del cambio: autorizar, respaldar y verificar owners.', 'Durante el cambio: monitorear señales y detener ante un gate fallido.', 'Si falla: ejecutar contención y rollback diseñado, no improvisado.', 'Después: guardar evidencia real (PASS, FAIL, NOT_RUN o BLOCKED) y comunicar resultados.'].map((step, i) => `<div class="side-step"><b>${i + 1}.</b> ${step}</div>`).join('')}<div class="case-review"><b>Escenario de rehabilitación</b><p>${e(c.negative)}</p></div>${capstone}<div class="space24"></div><button class="btn btn-primary" data-action="case-tab" data-id="evidencia">← Revisar mi ADR</button></section>`;
}
function progressView() { const counts = ['Básico', 'Intermedio', 'Avanzado'].map(level => ({ level, count: levelLessons(level).filter(l => state.completed.includes(l.id)).length })); const badges = [{ title: 'Primer commit', needed: state.completed.length >= 1, icon: 'hola', description: 'Tu primera lección superada' }, { title: 'HCL Explorer', needed: counts[0].count >= 6, icon: 'codificando', description: '6 lecciones de fundamentos' }, { title: 'Builder', needed: counts[0].count === 12, icon: 'arquitectura', description: 'Básico completo' }, { title: 'DevSecOps', needed: counts[1].count === 12, icon: 'deploy', description: 'Intermedio completo' }, { title: 'Cloud Architect', needed: counts[2].count === 12, icon: 'idea', description: 'Avanzado completo' }, { title: 'Senior Reviewer', needed: state.seniorCompleted.length === 18, icon: 'senior', description: '18 casos autoevaluados' }]; return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Progreso</span></div><div class="eyebrow">MI PERFIL DE APRENDIZAJE</div><h1 class="page-title">Tus logros en IaC</h1><p class="page-lead">Tu progreso se guarda en este navegador, sin cuenta ni telemetría. Exporta un respaldo JSON si vas a cambiar de dispositivo.</p><div class="space24"></div>${stats()}<section class="section">${sectionHead('CONTINUIDAD', 'Avance por nivel')}<div class="cards-3">${counts.map(item => `<div class="card"><div class="flex space-between"><h3 style="font-size:21px">${item.level}</h3>${label(`${item.count}/12`, 'purple')}</div><div class="space24"></div>${bar(item.count, 12)}<p class="card-desc" style="margin:14px 0">${item.count === 12 ? 'Nivel completado' : `${12 - item.count} lecciones pendientes`}</p>${link('Abrir nivel →', `#/aprender?nivel=${encodeURIComponent(item.level)}`, 'btn btn-sm btn-soft')}</div>`).join('')}</div></section><section class="section">${sectionHead('PIXEL ACHIEVEMENTS', 'Galería de insignias')}<div class="badge-grid">${badges.map(b => `<div class="badge-card ${b.needed ? '' : 'locked'}"><img src="${mascot(b.icon)}" alt="" class="image-pixel"><strong>${e(b.title)}</strong><small>${e(b.description)}</small><div class="space12"></div>${label(b.needed ? 'Desbloqueada' : 'Bloqueada', b.needed ? 'green' : 'purple')}</div>`).join('')}</div></section><section class="section">${sectionHead('REPASO', 'Continúa donde quedaste')}<div class="cards-2"><div class="card"><h3 class="card-title">Próxima lección</h3><p class="card-desc">${e(nextLesson().id + ' — ' + nextLesson().title)}</p><div class="space16"></div>${link('Continuar →', `#/leccion/${nextLesson().id}`, 'btn btn-primary')}</div><div class="card"><h3 class="card-title">Guardado local</h3><p class="card-desc">Tu JSON de progreso incluye respuestas, ejercicios, decisiones y ADR escritos. No compartas su contenido si incluye datos privados.</p><div class="space16"></div><button class="btn btn-soft" data-action="export-progress">↓ Exportar respaldo</button></div></div></section><div class="space24"></div><div class="notice">XP e insignias son indicadores de práctica educativa. Senior Mode registra autoevaluación; no garantiza experiencia laboral, certificación oficial ni despliegues validados.</div>`; }
function settingsView() { return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Ajustes</span></div><div class="eyebrow">PREFERENCIAS Y PRIVACIDAD</div><h1 class="page-title">Tu academia, a tu manera</h1><p class="page-lead">Controla apariencia, movimiento y progreso. Todo funciona localmente, sin inicio de sesión y sin enviar tus ejercicios a un servidor.</p><div class="space24"></div><div class="settings-layout"><div class="content-panel"><h2>Experiencia</h2><div class="settings-item"><div><h4>Tema</h4><p>Claro u oscuro</p></div><select class="input-select" data-input="theme" aria-label="Tema"><option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Oscuro</option><option value="light" ${state.theme === 'light' ? 'selected' : ''}>Claro</option></select></div><div class="settings-item"><div><h4>Senior Mode</h4><p>Muestra preguntas y retos avanzados</p></div><button class="btn btn-sm ${state.seniorEnabled ? 'btn-primary' : ''}" data-action="toggle-senior">${state.seniorEnabled ? 'Activado' : 'Desactivado'}</button></div><div class="settings-item"><div><h4>Reducir movimiento</h4><p>Desactiva animaciones decorativas</p></div><button class="btn btn-sm" data-action="toggle-motion">${state.reducedMotion ? 'Sí' : 'No'}</button></div><div class="settings-item"><div><h4>Tamaño de texto</h4><p>Escala general de lectura</p></div><select class="input-select" data-input="font-scale"><option value="0.9" ${state.fontScale === .9 ? 'selected' : ''}>Compacto</option><option value="1" ${state.fontScale === 1 ? 'selected' : ''}>Normal</option><option value="1.15" ${state.fontScale === 1.15 ? 'selected' : ''}>Grande</option><option value="1.3" ${state.fontScale === 1.3 ? 'selected' : ''}>Muy grande</option></select></div><div class="settings-item"><div><h4>Idioma</h4><p>La versión completa se ofrece en español</p></div><span class="chip">Español</span></div></div><div class="content-panel"><h2>Datos locales</h2><p class="prose">El almacenamiento usa localStorage. No existe cuenta, sincronización ni analítica remota en la app. Puedes hacer backup, restaurar y borrar tus datos del navegador.</p><div class="space24"></div><div class="flex-wrap"><button class="btn btn-primary" data-action="export-progress">↓ Exportar JSON</button><button class="btn" data-action="import-progress">↑ Importar JSON</button><input type="file" id="progress-file" accept="application/json,.json" style="display:none" aria-label="Cargar archivo de progreso"/></div><div class="space24"></div><div class="alert">El respaldo incluye código editado, decisiones y evidencia Senior. Consérvalo como información personal. La importación reemplaza el progreso actual después de validación de estructura.</div><div class="space24"></div><button class="btn btn-danger" data-action="reset-progress">Eliminar todo mi progreso</button><div class="space24"></div><h3 style="font-size:17px">Sobre los laboratorios</h3><p class="prose">Los comandos CLI se ejecutan en tu equipo. Los simuladores no hacen apply ni gestionan cuentas cloud.</p></div></div><section class="section"><div class="card"><h3>Diseño aprobado</h3><p class="card-desc">Se incluye una copia local del concepto visual y un spritesheet original de Terra con 12 poses PNG.</p><div class="space16"></div><a href="./assets/reference/concepto-aprobado.png" target="_blank" rel="noopener noreferrer" class="btn btn-soft">↗ Ver imagen original</a></div></section>`; }
const glossary = [
    ['HCL', 'Lenguaje de configuración de HashiCorp, con bloques, atributos y expresiones.'], ['Provider', 'Plugin que expone tipos de recursos y data sources para una API.'], ['Resource', 'Declaración de un objeto administrado por Terraform.'], ['Data source', 'Consulta de datos existentes, sin declarar su gestión.'], ['State', 'Registro del mapeo entre configuración y objetos administrados; puede contener secretos.'], ['Backend', 'Configuración para almacenar y bloquear state.'], ['Lock', 'Mecanismo que impide escritores concurrentes sobre un estado.'], ['Drift', 'Desviación observada entre la configuración/estado y recursos externos.'], ['Plan', 'Representación de cambios propuestos antes de apply.'], ['Apply', 'Operación que ejecuta modificaciones reales autorizadas.'], ['Destroy', 'Operación que plantea eliminar objetos administrados.'], ['Module', 'Unidad reusable de configuración con variables, recursos y outputs.'], ['Output', 'Contrato de valores expuestos por un módulo.'], ['Variable', 'Entrada parametrizable tipada del módulo.'], ['Local', 'Valor derivado reusable dentro de un módulo.'], ['for_each', 'Multiplica instancias de recursos por claves estables.'], ['count', 'Multiplica instancias por índice posicional.'], ['moved', 'Declara un traslado de dirección de recurso administrado.'], ['Import', 'Asocia un objeto existente a una dirección de estado.'], ['Remote state', 'Estado compartido gestionado en un backend externo.'], ['Policy as Code', 'Reglas automáticas auditables aplicadas a configuración o planes.'], ['OIDC', 'Identidad federada temporal para workloads, por ejemplo CI/CD.'], ['Sensitive', 'Marca de exposición para ciertos valores; no asegura excluirlos del state.'], ['Ephemeral', 'Propiedad de ciertas entradas/salidas que evita su persistencia en contextos soportados.'], ['Blast radius', 'Alcance potencial de un cambio o incidente.'], ['ADR', 'Registro de decisión arquitectónica con alternativas y consecuencias.'], ['FinOps', 'Gestión colaborativa de costo, valor y riesgo cloud.'], ['GitOps', 'Reconciliación declarativa de entornos a partir de Git.'], ['Mock provider', 'Sustituto de proveedor en determinadas pruebas Terraform.'], ['Plan fixture', 'Datos sintéticos para análisis de un plan; no provienen de CLI real.']
];
const resources = [
    { title: 'Documentación oficial Terraform', description: 'Lenguaje HCL, módulos, providers, state y CLI.', href: 'https://developer.hashicorp.com/terraform/docs', tag: 'Oficial' },
    { title: 'Tutoriales y guías de Terraform', description: 'Aprendizaje práctico y ejercicios oficiales.', href: 'https://developer.hashicorp.com/terraform/tutorials', tag: 'Oficial' },
    { title: 'Terraform test', description: 'Documentación del marco de pruebas, mocks y advertencias.', href: 'https://developer.hashicorp.com/terraform/language/tests', tag: 'Oficial' },
    { title: 'Backends y state', description: 'Protección de state y almacenamiento remoto.', href: 'https://developer.hashicorp.com/terraform/language/backend', tag: 'Oficial' },
    { title: 'Referencia HCL', description: 'Bloques, expresiones y funciones.', href: 'https://developer.hashicorp.com/terraform/language', tag: 'Oficial' },
    { title: 'Guía de marca HashiCorp', description: 'Uso descriptivo de Terraform y restricciones de marca.', href: 'https://www.hashicorp.com/en/trademark-policy', tag: 'Legal' },
    { title: 'Open Policy Agent', description: 'Motor de políticas que puede complementar IaC.', href: 'https://www.openpolicyagent.org/docs', tag: 'Externo' },
    { title: 'Infracost', description: 'Estimaciones de costo para revisión de infraestructura.', href: 'https://www.infracost.io/docs/', tag: 'Externo' },
    { title: 'Vigilio: guía de implementación', description: 'Archivo MASTER_SPEC auditado incluido en docs del ZIP.', href: './docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md', tag: 'Proyecto' }
];
function renderReviewSnippet(id) { const snip = seniorSnippets[id]; if (!snip)
    return ''; return `<div class="space24"></div><div class="flex space-between"><div><div class="eyebrow">FRAGMENTO DIDÁCTICO · NO EJECUTAR</div><h3 style="margin:8px 0">${e(snip.file)}</h3></div><button class="btn btn-sm btn-soft" data-action="review-fix">${showSeniorFix ? 'Mostrar riesgo' : 'Mostrar enfoque seguro'}</button></div><pre class="code-preview"><code>${e(showSeniorFix ? snip.after : snip.before)}</code></pre><div class="case-review"><b>Revisión</b><p>${e(snip.review)}</p></div>`; }
function seniorSimulator(id) {
    let content = '';
    if (id === 'S09')
        content = `<div class="cards-2"><div><label class="field-label">CIDR de development</label><input class="search-bar" data-input="cidr-a" value="${e(cidrA)}" aria-label="CIDR desarrollo"></div><div><label class="field-label">CIDR de producción</label><input class="search-bar" data-input="cidr-b" value="${e(cidrB)}" aria-label="CIDR producción"></div></div><div class="space16"></div><button class="btn btn-primary" data-action="check-cidr">Comprobar rangos →</button>`;
    if (id === 'S11')
        content = `<div class="cards-2"><div><label class="field-label">Commit asociado al plan aprobado</label><input class="search-bar" data-input="approved-commit" value="${e(approvedCommit)}" aria-label="Commit aprobado"></div><div><label class="field-label">Commit usado para apply</label><input class="search-bar" data-input="applied-commit" value="${e(appliedCommit)}" aria-label="Commit aplicado"></div></div><div class="space16"></div><button class="btn btn-primary" data-action="check-integrity">Verificar identidad del fixture →</button>`;
    if (id === 'S14')
        content = `<label class="field-label">Número ficticio de réplicas (costo base USD 61/mes)</label><input class="search-bar" type="number" min="0" max="50" data-input="replicas" value="${simulatedReplicas}" aria-label="Número de réplicas"><div class="space16"></div><button class="btn btn-primary" data-action="check-cost">Calcular estimación →</button>`;
    if (id === 'S02')
        content = `<p class="prose">Writer A adquirió el lock de estado en 10:01. Writer B llega a las 10:02.</p><div class="space16"></div><button class="btn btn-primary" data-action="simulate-lock">Intentar writer B →</button>`;
    if (id === 'S03')
        content = `<pre class="code-preview"><code>HCL: tags.Owner = "team-platform"
STATE: tags.Owner = "team-platform"
REMOTE: tags.Owner = "unknown"</code></pre><div class="space16"></div><button class="btn btn-primary" data-action="simulate-drift">Detectar drift →</button>`;
    if (id === 'S01')
        content = `<pre class="code-preview"><code>Antes: terraform_data.node["old_key"]
Después: terraform_data.node["new_key"]</code></pre><div class="space16"></div><button class="btn btn-primary" data-action="simulate-keys">Evaluar direcciones →</button>`;
    const drill = getSeniorDrill(id);
    const selectedChoice = state.seniorDrillAnswers[id];
    const result = selectedChoice === undefined ? null : evaluateSeniorDrill(id, selectedChoice);
    const drillHtml = drill ? `<div class="what-if"><div class="eyebrow">DESAFÍO WHAT-IF · ${id}</div><h3 class="what-if-title">${e(drill.prompt)}</h3><div class="what-if-choices">${drill.options.map((option, i) => `<button class="btn btn-soft ${selectedChoice === i ? 'selected' : ''}" data-action="what-if-answer" data-id="${id}" data-index="${i}">${String.fromCharCode(65 + i)}. ${e(option)}</button>`).join('')}</div>${result ? `<div class="what-if-result ${result.ok ? 'ok' : 'unsafe'}" role="status"><b>${result.ok ? '✓ Decisión defendible' : '⚠ Riesgo no resuelto'}</b><p>${e(result.message)}</p><p><b>Evidencia que exigirías:</b> ${e(result.next)}</p><small>Escenario sintético, sin consulta a Terraform CLI ni cloud.</small></div>` : ''}</div>` : '';
    if (!content && !drillHtml)
        return '';
    return `<section class="content-panel" style="margin-top:20px"><div class="flex space-between"><div><div class="eyebrow">SIMULADOR DETERMINISTA</div><h3 style="margin-top:8px">Prueba una hipótesis</h3></div>${label('SIMULADO', 'yellow')}</div><div class="space16"></div>${content}${drillHtml}${seniorSimResult ? `<div class="space16"></div><div class="alert" role="status">${e(seniorSimResult)}</div>` : ''}<p class="small-note" style="margin-top:15px">Este simulador no lee state remoto ni ejecuta Terraform. Trabaja con datos locales sintéticos.</p></section>`;
}
function resourcesView() { return `<div class="breadcrumb"><a href="${urls.home}">Inicio</a> / <span>Recursos</span></div><div class="eyebrow">BIBLIOTECA IAC</div><h1 class="page-title">Recursos para aprender mejor</h1><p class="page-lead">Enlaces a documentación oficial, guías técnicas y un glosario de conceptos clave para revisar antes de usar infraestructura real.</p><section class="section">${sectionHead('BIBLIOTECA', 'Documentación y herramientas')}<div class="resource-grid">${resources.map(r => `<div class="resource-card">${label(r.tag, 'purple')}<h3 style="margin-top:11px">${e(r.title)}</h3><p>${e(r.description)}</p><a href="${e(r.href)}" ${r.href.startsWith('https:') ? 'target="_blank" rel="noopener noreferrer"' : ''}>Consultar ↗</a></div>`).join('')}</div></section><section class="section">${sectionHead('A—Z', 'Glosario de Terraform')}<input class="search-bar" type="search" id="glossary-search" placeholder="⌕ Buscar un término…" aria-label="Buscar glosario"/><div class="space16"></div><div class="cards-3" id="glossary-list">${glossary.map(([term, description]) => `<div class="card glossary-tile" data-title="${e((term + ' ' + description).toLowerCase())}"><h3 style="font-size:18px;color:var(--purple-bright)">${e(term)}</h3><p class="card-desc" style="margin-top:9px">${e(description)}</p></div>`).join('')}</div></section>`; }
function notFound() { return `<div class="empty-state"><img src="${mascot('pensando')}" alt="Terra confuso" width="210" style="margin:auto"><h1 class="page-title">No encontré esta ruta</h1><p>Revisa la URL o regresa al inicio.</p><div class="space24"></div>${link('Volver a la academia →', urls.home, 'btn btn-primary')}</div>`; }
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
function maybeCompleteLesson(id) { const l = getLesson(id); if (!l)
    return; const code = state.code[id] ?? l.starter; const evaluated = evals[id]; reconcileLessonCompletion(state, lessons); if (evaluated?.ok && evaluateLesson(l, code).ok && state.quizAnswers[id] === l.correct && !state.completed.includes(id)) {
    state.completed.push(id);
    persist();
    notify(`¡Lección ${id} completada! +${l.xp} XP educativos.`);
} }
function syncSeniorLabels(id) {
    const done = state.seniorCompleted.includes(id);
    const main = document.getElementById('current-case-status');
    const gate = document.getElementById('senior-gate-status');
    if (main)
        main.innerHTML = done ? label('✓ Autoevaluado', 'green') : label('Caso abierto', 'purple');
    if (gate)
        gate.innerHTML = done ? label('✓ Autoevaluado', 'green') : label('Pendiente', 'yellow');
}
function checkCaseButton(id) { const c = getCase(id); if (!c)
    return; const result = seniorGate(state, c); const btn = document.querySelector(`[data-action="finish-case"][data-id="${id}"]`); if (btn)
    btn.disabled = !result.ok; syncSeniorLabels(id); }
function updateFilter(input, selector) { const q = input.value.toLowerCase().trim(); document.querySelectorAll(selector).forEach(el => el.hidden = !(el.dataset.title || '').includes(q)); }
async function handleAction(action, id, index, element) {
    switch (action) {
        case 'toggle-menu':
            mobileMenu = !mobileMenu;
            render();
            return;
        case 'toggle-senior':
            state.seniorEnabled = !state.seniorEnabled;
            persist();
            render();
            notify(state.seniorEnabled ? 'Modo Senior activado' : 'Modo Senior desactivado');
            return;
        case 'favorite': {
            if (!getLesson(id))
                return;
            state.favorites = state.favorites.includes(id) ? state.favorites.filter(v => v !== id) : [...state.favorites, id];
            persist();
            render();
            return;
        }
        case 'toggle-motion':
            state.reducedMotion = !state.reducedMotion;
            persist();
            render();
            return;
        case 'level':
            activeLevel = id;
            render();
            return;
        case 'evaluate': {
            const lesson = getLesson(id);
            if (!lesson)
                return;
            const code = state.code[id] ?? lesson.starter;
            const result = evaluateLesson(lesson, code);
            evals[id] = result;
            maybeCompleteLesson(id);
            render();
            document.querySelector('.feedback')?.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'center' });
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
            state.code[id] = l.example;
            delete evals[id];
            reconcileLessonCompletion(state, lessons);
            persist();
            render();
            notify('Solución de referencia cargada. Evalúa reglas y responde el quiz para completar.');
            return;
        }
        case 'reset-code': {
            const l = getLesson(id);
            if (!l)
                return;
            if (!window.confirm('¿Restablecer solo el código de esta lección?'))
                return;
            state.code[id] = l.starter;
            delete evals[id];
            reconcileLessonCompletion(state, lessons);
            persist();
            render();
            return;
        }
        case 'download-code': {
            const l = getLesson(id);
            if (!l)
                return;
            downloadText(`${slugFilename(id)}-main.tf`, state.code[id] ?? l.starter);
            notify('Se descargó main.tf. Para pruebas auténticas usa el pack ZIP de laboratorio.');
            return;
        }
        case 'answer-quiz': {
            const l = getLesson(id);
            if (!l)
                return;
            state.quizAnswers[id] = index;
            persist();
            maybeCompleteLesson(id);
            render();
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
            const game = games.find(g => g.id === id), s = gameSession;
            if (!game || !s || s.id !== id || s.last !== null || s.finished)
                return;
            s.last = index;
            if (game.questions[s.at].correct === index)
                s.score++;
            render();
            return;
        }
        case 'next-game': {
            const game = games.find(g => g.id === id), s = gameSession;
            if (!game || !s || s.id !== id || s.last === null)
                return;
            if (s.at >= game.questions.length - 1) {
                s.finished = true;
                const previous = state.gameWins[id] || 0;
                if (s.score >= Math.ceil(game.questions.length * .8) && s.score > previous) {
                    state.gameWins[id] = s.score;
                    persist();
                }
            }
            else {
                s.at++;
                s.last = null;
            }
            render();
            return;
        }
        case 'restart-game':
            gameSession = null;
            render();
            return;
        case 'graph':
            selectedGraph = id;
            selectedNode = '';
            render();
            return;
        case 'graph-node':
            selectedNode = id;
            render();
            return;
        case 'plan':
            selectedPlan = id;
            showPlanRisks = false;
            render();
            return;
        case 'reveal-plan':
            showPlanRisks = !showPlanRisks;
            render();
            return;
        case 'case-tab':
            caseTab = id;
            render();
            return;
        case 'review-fix':
            showSeniorFix = !showSeniorFix;
            render();
            return;
        case 'check-cidr': {
            const overlap = cidrOverlap(cidrA, cidrB);
            seniorSimResult = overlap === null ? 'Formato CIDR inválido' : overlap ? 'BLOQUEADO: los rangos se superponen.' : 'Sin superposición entre estos dos rangos; revisar IPAM completo.';
            render();
            return;
        }
        case 'check-integrity': {
            const result = planIntegrity({ commit: approvedCommit, env: 'prod', digest: 'sha256-a1' }, { commit: appliedCommit, env: 'prod', digest: approvedCommit === appliedCommit ? 'sha256-a1' : 'sha256-b2' });
            seniorSimResult = result.ok ? 'Coincidencia local de datos del fixture; todavía requiere autorización real.' : `BLOQUEADO: ${result.problems.join(', ')}.`;
            render();
            return;
        }
        case 'check-cost': {
            const result = estimateCost(simulatedReplicas);
            seniorSimResult = `Estimación ficticia: USD ${result.estimate}/mes (presupuesto USD ${result.budget}). ${result.exceeds ? 'BLOQUEAR y revisar SLA/costos' : 'Dentro del umbral ficticio; revisar capacidad/SLA'}.`;
            render();
            return;
        }
        case 'simulate-lock':
            seniorSimResult = 'Writer B: BLOCKED. El lock de Writer A sigue activo; investigar antes de cualquier force-unlock.';
            render();
            return;
        case 'simulate-drift':
            seniorSimResult = 'DRIFT DETECTADO: Owner esperado team-platform, remoto unknown. NO aplicar sin investigar.';
            render();
            return;
        case 'simulate-keys':
            seniorSimResult = 'Cambio de clave old_key → new_key. Plan ficticio: destroy + create; revisar moved y continuidad.';
            render();
            return;
        case 'case-decision': {
            const c = getCase(id);
            if (!c)
                return;
            state.seniorDecisions[id] = index;
            reconcileSeniorCompletion(state, seniorCases);
            persist();
            render();
            return;
        }
        case 'finish-case': {
            const c = getCase(id);
            if (!c)
                return;
            const result = seniorGate(state, c);
            if (!result.ok) {
                notify(result.reasons.join(' '), true);
                return;
            }
            if (!state.seniorCompleted.includes(id)) {
                state.seniorCompleted.push(id);
                persist();
                notify(`Caso ${id} autoevaluado. +${c.xp} XP educativos.`);
            }
            render();
            return;
        }
        case 'clear-user-plan':
            userPlan = null;
            userPlanError = '';
            gateReview = null;
            gateAnswers = emptyGateAnswers();
            render();
            return;
        case 'run-release-gate': {
            if (!userPlan) {
                notify('Primero carga un plan.json.', true);
                return;
            }
            gateReview = evaluateReleaseGate(userPlan, gateAnswers);
            render();
            return;
        }
        case 'export-release-gate': {
            if (!gateReview) {
                notify('Evalúa el gate antes de exportar.', true);
                return;
            }
            downloadText('TerraPixel-Gate-Didactico.md', exportGateReview(gateReview), 'text/markdown;charset=utf-8');
            return;
        }
        case 'export-user-plan': {
            if (!userPlan) {
                notify('Primero importa un plan.json válido.', true);
                return;
            }
            downloadText('TerraPixel-Revision-Plan-Local.md', buildPlanReviewMarkdown(userPlan), 'text/markdown;charset=utf-8');
            notify('Informe local descargado. Las direcciones de recursos pueden ser privadas.');
            return;
        }
        case 'clear-cli-manifest':
            cliManifest = null;
            cliManifestError = '';
            render();
            return;
        case 'export-cli-manifest': {
            if (!cliManifest) {
                notify('Importa un manifiesto CLI primero.', true);
                return;
            }
            downloadText('TerraPixel-Indice-Evidencia-CLI.md', cliEvidenceMarkdown(cliManifest), 'text/markdown;charset=utf-8');
            notify('Índice exportado: requiere cotejo independiente de los logs originales.');
            return;
        }
        case 'export-portfolio': {
            downloadText('TerraPixel-Portfolio-Senior.md', buildSeniorPortfolio(seniorCases, state), 'text/markdown;charset=utf-8');
            notify('Portafolio exportado: contiene tus respuestas y ADR; revisa datos privados antes de compartir.');
            return;
        }
        case 'export-senior': {
            const c = getCase(id);
            if (!c)
                return;
            const report = buildSeniorReport(c, state);
            downloadText(`${c.id}-informe-senior.md`, report, 'text/markdown;charset=utf-8');
            notify(`Informe ${c.id} descargado: actividad educativa no certificada.`);
            return;
        }
        case 'export-progress':
            downloadText(`terrapixel-progreso-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), 'application/json;charset=utf-8');
            notify('Respaldo JSON exportado.');
            return;
        case 'import-progress':
            document.getElementById('progress-file')?.click();
            return;
        case 'what-if-answer': {
            const result = evaluateSeniorDrill(id, index);
            if (!result)
                return;
            state.seniorDrillAnswers[id] = index;
            reconcileSeniorCompletion(state, seniorCases);
            persist();
            render();
            return;
        }
        case 'reset-progress': {
            if (!window.confirm('¿Eliminar TODO el progreso, código y decisiones de este navegador? Esta acción no se puede deshacer.'))
                return;
            state = defaultState();
            evals = {};
            persist();
            render();
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
    const action = element.dataset.action || '', id = element.dataset.id || '', index = Number(element.dataset.index || 0);
    if (element.tagName.toLowerCase() === 'a')
        event.preventDefault();
    void handleAction(action, id, index, element).catch(err => notify(err instanceof Error ? err.message : 'Error inesperado', true));
});
root.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement))
        return;
    const input = target.dataset.input;
    if (target instanceof HTMLInputElement) {
        if (input === 'cidr-a') {
            cidrA = target.value.slice(0, 50);
            seniorSimResult = '';
            return;
        }
        if (input === 'cidr-b') {
            cidrB = target.value.slice(0, 50);
            seniorSimResult = '';
            return;
        }
        if (input === 'approved-commit') {
            approvedCommit = target.value.slice(0, 120);
            seniorSimResult = '';
            return;
        }
        if (input === 'applied-commit') {
            appliedCommit = target.value.slice(0, 120);
            seniorSimResult = '';
            return;
        }
        if (input === 'replicas') {
            const value = Number(target.value);
            simulatedReplicas = Number.isInteger(value) ? Math.max(0, Math.min(50, value)) : 0;
            seniorSimResult = '';
            return;
        }
    }
    if (input === 'code' && target instanceof HTMLTextAreaElement) {
        const id = target.dataset.id || '';
        state.code[id] = target.value.slice(0, 30000);
        delete evals[id];
        reconcileLessonCompletion(state, lessons);
        persist();
        return;
    }
    if (input === 'case-evidence' && target instanceof HTMLTextAreaElement) {
        const id = target.dataset.id || '';
        state.seniorEvidence[id] = target.value.slice(0, 12000);
        reconcileSeniorCompletion(state, seniorCases);
        persist();
        const count = document.getElementById('evidence-count');
        if (count)
            count.textContent = `${target.value.trim().length} caracteres. Mínimo didáctico: 120 y cinco secciones.`;
        checkCaseButton(id);
        return;
    }
    if (input === 'capstone-note' && target instanceof HTMLTextAreaElement) {
        const i = Number(target.dataset.index);
        if (Number.isInteger(i) && i >= 0 && i < 8) {
            state.capstoneEvidence[String(i)] = target.value.slice(0, 2500);
            const valid = capstoneNoteValid(state.capstoneEvidence[String(i)]);
            const checkbox = document.getElementById(`capstone-check-${i}`);
            if (checkbox) {
                checkbox.disabled = !valid;
                if (!valid) {
                    checkbox.checked = false;
                    state.capstoneDone = state.capstoneDone.filter(n => n !== i);
                }
            }
            const status = document.getElementById(`capstone-status-${i}`);
            if (status)
                status.textContent = valid ? 'Estructura lista. Marca el hito si revisaste su evidencia.' : 'Pendiente: al menos 45 caracteres y estado PASS/FAIL/NOT_RUN/BLOCKED.';
            reconcileSeniorCompletion(state, seniorCases);
            persist();
            checkCaseButton('S18');
        }
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'senior-search')
        updateFilter(target, '.senior-case');
    if (target instanceof HTMLInputElement && target.id === 'lesson-search')
        updateFilter(target, '.lesson-tile');
    if (target instanceof HTMLInputElement && target.id === 'glossary-search')
        updateFilter(target, '.glossary-tile');
});
root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement))
        return;
    if (target instanceof HTMLSelectElement) {
        if (target.dataset.input === 'review-environment') {
            gateAnswers.environment = target.value === 'dev' ? 'dev' : target.value === 'staging' ? 'staging' : 'prod';
            gateReview = null;
            render();
            return;
        }
        if (target.dataset.input === 'theme') {
            state.theme = target.value === 'light' ? 'light' : 'dark';
            persist();
            render();
            return;
        }
        if (target.dataset.input === 'font-scale') {
            state.fontScale = Number(target.value);
            persist();
            render();
            return;
        }
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'gate-check') {
        const key = target.dataset.id;
        if (key in gateAnswers) {
            gateAnswers[key] = target.checked;
            gateReview = null;
            render();
        }
        return;
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'case-check') {
        const id = target.dataset.id || '', index = Number(target.dataset.index), list = new Set(state.seniorChecklist[id] || []);
        target.checked ? list.add(index) : list.delete(index);
        state.seniorChecklist[id] = [...list];
        reconcileSeniorCompletion(state, seniorCases);
        persist();
        render();
        return;
    }
    if (target instanceof HTMLInputElement && target.dataset.input === 'capstone-check') {
        const idx = Number(target.dataset.index), list = new Set(state.capstoneDone);
        target.checked ? list.add(idx) : list.delete(idx);
        if (target.checked && !capstoneNoteValid(state.capstoneEvidence[String(idx)] || '')) {
            notify('Primero documenta evidencia del hito.', true);
            return;
        }
        state.capstoneDone = [...list];
        reconcileSeniorCompletion(state, seniorCases);
        persist();
        render();
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'cli-manifest-file') {
        const file = target.files?.[0];
        if (!file)
            return;
        if (file.size > 200_000) {
            cliManifest = null;
            cliManifestError = 'El manifiesto excede 200 KB.';
            render();
            return;
        }
        void file.text().then(text => { cliManifest = parseCliManifest(JSON.parse(text)); cliManifestError = ''; render(); notify('Manifiesto declarado importado. Los hashes no están cotejados con logs.'); }).catch(error => { cliManifest = null; cliManifestError = error instanceof Error ? error.message : 'JSON inválido'; render(); });
        return;
    }
    if (target instanceof HTMLInputElement && target.id === 'user-plan-json') {
        const file = target.files?.[0];
        if (!file)
            return;
        if (file.size > 5_000_000) {
            userPlan = null;
            gateReview = null;
            userPlanError = 'Archivo demasiado grande (máximo 5 MB).';
            render();
            return;
        }
        void file.text().then(text => {
            userPlan = inspectTerraformPlan(JSON.parse(text));
            userPlanError = '';
            gateReview = null;
            gateAnswers = emptyGateAnswers();
            render();
            notify('Plan JSON analizado localmente. Datos de recursos y secretos ocultos.');
        }).catch(err => { userPlan = null; gateReview = null; userPlanError = err instanceof Error ? err.message : 'JSON inválido'; render(); });
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
        void file.text().then(text => { const incoming = sanitizeState(JSON.parse(text), LESSON_IDS, SENIOR_IDS); if (!window.confirm('¿Reemplazar tu progreso actual por el archivo validado?'))
            return; state = incoming; const invalidated = reconcileSeniorCompletion(state, seniorCases); const invalidLessons = reconcileLessonCompletion(state, lessons); evals = {}; persist(); render(); notify(invalidated.length || invalidLessons.length ? `Progreso importado; se invalidaron ${invalidated.length} casos Senior y ${invalidLessons.length} lecciones incompletas.` : 'Progreso importado y validado correctamente.'); }).catch(err => notify(`Importación inválida: ${err instanceof Error ? err.message : 'JSON incorrecto'}`, true));
        return;
    }
});
root.addEventListener('keydown', (event) => { const target = event.target; if (target instanceof HTMLTextAreaElement && target.id === 'code-editor' && event.key === 'Tab') {
    event.preventDefault();
    const pos = target.selectionStart;
    target.setRangeText('  ', target.selectionStart, target.selectionEnd, 'end');
    state.code[target.dataset.id || ''] = target.value;
    delete evals[target.dataset.id || ''];
    reconcileLessonCompletion(state, lessons);
    persist();
    return;
} if ((event.key === 'Enter' || event.key === ' ') && target instanceof Element && target.matches('g.graph-node')) {
    event.preventDefault();
    const node = target;
    void handleAction('graph-node', node.dataset.id || '', 0, node);
} });
window.addEventListener('hashchange', () => { mobileMenu = false; caseTab = 'investigar'; showSeniorFix = false; seniorSimResult = ''; window.scrollTo({ top: 0, behavior: 'instant' }); render(); });
if (!location.hash)
    location.hash = urls.home;
render();
