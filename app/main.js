import { cliEvidenceMarkdown, parseCliManifest } from './cliEvidence.js';
import { getLesson, lessons, tracks } from './curriculum.js';
import { activateCodeEditor, disposeCodeEditor, updateEditorTheme } from './editor.js';
import { evaluateLesson, reconcileLessonCompletion, sanitizeState, slugFilename } from './engine.js';
import { graphs, planFixtures } from './fixtures.js';
import { games } from './games.js';
import { inspectTerraformPlan } from './planInspector.js';
import { buildPlanReviewMarkdown } from './planReport.js';
import { emptyGateAnswers, evaluateReleaseGate, exportGateReview } from './releaseGate.js';
import { getCase, seniorCases } from './senior.js';
import { capstoneNoteValid, reconcileSeniorCompletion, seniorGate } from './seniorProgress.js';
import { buildSeniorPortfolio, buildSeniorReport } from './seniorReport.js';
import { evaluateSeniorDrill } from './seniorWhatIf.js';
import { runCaseSimulator, updateSimulatorBoolean, updateSimulatorNumber, updateSimulatorText } from './simulators.js';
import { createAcademyStore, isCaseTabId, isLabsCategory, resolveGameSession } from './store.js';
import { LearningCatalog } from './uiCatalog.js';
import { CliEvidenceDashboard } from './uiCliEvidence.js';
import { GameStage, GamesHub } from './uiGames.js';
import { GraphExplorer } from './uiGraph.js';
import { HomePage } from './uiHome.js';
import { LabsDirectory } from './uiLabs.js';
import { LessonClassroom } from './uiLesson.js';
import { PlansExplorerPage } from './uiPlans.js';
import { ProfileProgressPage } from './uiProfile.js';
import { NotFoundPage, ResourcesPage } from './uiResources.js';
import { SeniorCasePage } from './uiSeniorCase.js';
import { SeniorDashboard } from './uiSeniorHub.js';
import { SettingsPage } from './uiSettings.js';
import { ROUTES } from './uiShared.js';
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
let lastMountedLessonId = '';
let activeArena3D = null;
let lastMountedGameId = '';
let arenaMountToken = 0;
function disposeGameArena() {
    arenaMountToken++;
    lastMountedGameId = '';
    if (activeArena3D) {
        activeArena3D.dispose();
        activeArena3D = null;
    }
}
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
function syncTextareaValueIfMounted(code) {
    const textarea = document.querySelector('#code-editor');
    if (textarea) {
        textarea.value = code;
    }
}
function render() {
    const s = store.getState();
    const state = s.academy;
    document.body.dataset.theme = state.theme;
    document.body.classList.toggle('reduce-motion', state.reducedMotion);
    document.documentElement.dataset.fontScale = String(state.fontScale);
    const { page, param, query } = parseCurrentRoute();
    if (page === 'aprender') {
        const from = query.get('nivel');
        if (from && ['Básico', 'Intermedio', 'Avanzado'].includes(from) && s.activeLevel !== from) {
            s.activeLevel = from;
        }
    }
    const activeLesson = page === 'leccion' && param ? getLesson(param) : undefined;
    if (!activeLesson) {
        disposeCodeEditor();
        lastMountedLessonId = '';
    }
    else if (lastMountedLessonId && lastMountedLessonId !== activeLesson.id) {
        disposeCodeEditor();
    }
    const activeGame = page === 'juego' && param ? games.find((g) => g.id === param) : undefined;
    if (activeGame && (!s.gameSession || s.gameSession.id !== activeGame.id)) {
        s.gameSession = resolveGameSession(s.gameSession, activeGame.id);
    }
    const seniorScenario = page === 'senior' && param ? getCase(param) : undefined;
    const view = page === 'inicio'
        ? h(HomePage, { state, lessons })
        : page === 'aprender'
            ? h(LearningCatalog, {
                lessons,
                tracks,
                state,
                level: s.activeLevel,
                searchQuery: s.lessonSearch
            })
            : page === 'leccion' && activeLesson
                ? h(LessonClassroom, {
                    lesson: activeLesson,
                    lessons,
                    state,
                    evalResult: s.evals[activeLesson.id]
                })
                : page === 'juegos'
                    ? h(GamesHub, { games, state })
                    : page === 'juego' && activeGame && s.gameSession
                        ? h(GameStage, { game: activeGame, session: s.gameSession })
                        : page === 'laboratorios'
                            ? h(LabsDirectory, {
                                lessons,
                                seniorCases,
                                category: s.labsCategory,
                                searchQuery: s.labsSearch
                            })
                            : page === 'grafo'
                                ? h(GraphExplorer, {
                                    graphs,
                                    selectedGraphId: s.selectedGraph,
                                    selectedNodeId: s.selectedNode
                                })
                                : page === 'planes'
                                    ? h(PlansExplorerPage, {
                                        fixtures: planFixtures,
                                        selectedPlanId: s.selectedPlan,
                                        showPlanRisks: s.showPlanRisks,
                                        userPlan: s.userPlan,
                                        userPlanError: s.userPlanError,
                                        gateAnswers: s.gateAnswers,
                                        gateReview: s.gateReview
                                    })
                                    : page === 'senior' && !param
                                        ? h(SeniorDashboard, {
                                            state,
                                            cases: seniorCases,
                                            searchQuery: s.seniorSearch,
                                            severityFilter: s.seniorSeverity,
                                            pillarFilter: s.seniorPillar
                                        })
                                        : page === 'senior' && seniorScenario
                                            ? h(SeniorCasePage, {
                                                scenario: seniorScenario,
                                                cases: seniorCases,
                                                state,
                                                tab: s.caseTab,
                                                showFix: s.showSeniorFix,
                                                simResult: s.seniorSimResult,
                                                simInputs: s.simInputs
                                            })
                                            : page === 'evidencias'
                                                ? h(CliEvidenceDashboard, {
                                                    manifest: s.cliManifest,
                                                    error: s.cliManifestError
                                                })
                                                : page === 'progreso'
                                                    ? h(ProfileProgressPage, { state, lessons, tracks })
                                                    : page === 'ajustes'
                                                        ? h(SettingsPage, { state })
                                                        : page === 'recursos'
                                                            ? h(ResourcesPage, { glossarySearch: s.glossarySearch })
                                                            : h(NotFoundPage, {});
    renderPreact(h(AppShell, {
        page,
        mobileMenu: s.mobileMenu,
        seniorEnabled: state.seniorEnabled,
        view,
        toast: s.toast
    }), root);
    if (!activeGame || s.gameSession?.finished) {
        disposeGameArena();
    }
    else if (lastMountedGameId && lastMountedGameId !== activeGame.id) {
        disposeGameArena();
    }
    if (activeLesson) {
        lastMountedLessonId = activeLesson.id;
        void activateCodeEditor((value) => {
            const lessonId = activeLesson.id;
            const snapshot = store.getState();
            snapshot.academy.code[lessonId] = value.slice(0, 30000);
            delete snapshot.evals[lessonId];
            const invalidated = reconcileLessonCompletion(snapshot.academy, lessons);
            if (invalidated.length > 0) {
                store.update(() => { }, { persist: true });
            }
            else {
                store.persistQuietly();
            }
        }, state.theme);
    }
    if (activeGame && s.gameSession && !s.gameSession.finished) {
        const session = s.gameSession;
        const question = activeGame.questions[session.at];
        const lastStatus = session.last === null ? 'idle' : session.last === question.correct ? 'correct' : 'wrong';
        const arenaState = {
            gameId: activeGame.id,
            step: session.at,
            total: activeGame.questions.length,
            score: session.score,
            streak: session.score,
            finished: session.finished,
            won: session.score >= Math.ceil(activeGame.questions.length * 0.8),
            lastStatus,
            theme: state.theme,
            reducedMotion: state.reducedMotion
        };
        if (activeArena3D && lastMountedGameId === activeGame.id) {
            activeArena3D.updateState(arenaState);
        }
        else {
            const viewport = document.getElementById('game-3d-viewport');
            if (viewport && !viewport.querySelector('canvas.game-3d-canvas')) {
                lastMountedGameId = activeGame.id;
                const myToken = ++arenaMountToken;
                void import('./gameScene3d.js').then(({ mountGameArena3D }) => mountGameArena3D(viewport, {
                    initialState: arenaState,
                    onNodeSelect(title, role) {
                        const inspector = document.getElementById('game-3d-inspector');
                        if (inspector) {
                            inspector.textContent = `Nodo activo (${title}): ${role}`;
                        }
                    }
                }).then((controller) => {
                    if (!controller)
                        return;
                    if (myToken !== arenaMountToken || !viewport.isConnected) {
                        controller.dispose();
                        return;
                    }
                    activeArena3D = controller;
                }));
            }
        }
    }
}
store.subscribe(render);
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
        case 'labs-category':
            if (isLabsCategory(id)) {
                store.update((s) => {
                    s.labsCategory = id;
                });
            }
            return;
        case 'senior-severity':
            if (['Todas', 'Crítico', 'Alto'].includes(id)) {
                store.update((s) => {
                    s.seniorSeverity = id;
                });
            }
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
            syncTextareaValueIfMounted(l.example);
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
            syncTextareaValueIfMounted(l.starter);
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
                store.persistQuietly();
            }
            return;
        }
        case 'restart-game':
            disposeGameArena();
            store.update((s) => {
                s.gameSession = resolveGameSession(null, id);
            });
            return;
        case 'game-cam-iso':
            activeArena3D?.setView('iso');
            return;
        case 'game-cam-top':
            activeArena3D?.setView('top');
            return;
        case 'game-cam-rotate': {
            const rotating = activeArena3D?.toggleAutoRotate();
            if (rotating !== undefined) {
                notify(rotating ? 'Auto-rotación 3D activada.' : 'Auto-rotación 3D pausada.');
            }
            return;
        }
        case 'game-cam-reset':
            activeArena3D?.resetCamera();
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
        case 'run-case-sim':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator(id, s.simInputs);
            });
            return;
        case 'check-cidr':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S09', s.simInputs);
            });
            return;
        case 'check-integrity':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S11', s.simInputs);
            });
            return;
        case 'check-cost':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S14', s.simInputs);
            });
            return;
        case 'simulate-lock':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S02', s.simInputs);
            });
            return;
        case 'simulate-drift':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S03', s.simInputs);
            });
            return;
        case 'simulate-keys':
            store.update((s) => {
                s.seniorSimResult = runCaseSimulator('S01', s.simInputs);
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
        if (input === 'sim-text') {
            const key = target.dataset.id || '';
            store.update((s) => {
                if (updateSimulatorText(s.simInputs, key, target.value)) {
                    s.seniorSimResult = '';
                }
            });
            return;
        }
        if (input === 'sim-num') {
            const key = target.dataset.id || '';
            store.update((s) => {
                if (updateSimulatorNumber(s.simInputs, key, Number(target.value))) {
                    s.seniorSimResult = '';
                }
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
        if (target.id === 'labs-search') {
            store.update((s) => {
                s.labsSearch = target.value.slice(0, 120);
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
        if (target.dataset.input === 'senior-pillar') {
            store.update((s) => {
                s.seniorPillar = target.value.slice(0, 60);
            });
            return;
        }
        if (target.dataset.input === 'sim-select') {
            const key = target.dataset.id || '';
            store.update((s) => {
                if (updateSimulatorText(s.simInputs, key, target.value)) {
                    s.seniorSimResult = '';
                }
            });
            return;
        }
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
    if (target instanceof HTMLInputElement && target.dataset.input === 'sim-bool') {
        const key = target.dataset.id || '';
        store.update((s) => {
            if (updateSimulatorBoolean(s.simInputs, key, target.checked)) {
                s.seniorSimResult = '';
            }
        });
        return;
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
    // Quick 1 / 2 / 3 option selection in Three.js GameStage (`#/juego/:id`)
    if (!(target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement) &&
        (event.key === '1' || event.key === '2' || event.key === '3')) {
        const stage = document.getElementById('game-stage-active');
        const gameId = stage?.getAttribute('data-game-id') || '';
        if (gameId) {
            const idx = Number(event.key) - 1;
            void handleAction('game-answer', gameId, idx, stage);
            return;
        }
    }
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
    // SVG Graph keyboard navigation: Enter, Space, Arrow keys, Home, End
    if (target instanceof Element && target.matches('g.graph-node')) {
        const nodeEl = target;
        const currentId = nodeEl.dataset.id || '';
        const s = store.getState();
        const activeGraph = graphs.find((g) => g.id === s.selectedGraph) || graphs[0];
        if (!activeGraph || activeGraph.nodes.length === 0)
            return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void handleAction('graph-node', currentId, 0, nodeEl);
            return;
        }
        const currentIdx = Math.max(0, activeGraph.nodes.findIndex((n) => n.id === currentId));
        let nextIdx = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIdx = (currentIdx + 1) % activeGraph.nodes.length;
        }
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIdx = (currentIdx - 1 + activeGraph.nodes.length) % activeGraph.nodes.length;
        }
        else if (event.key === 'Home') {
            nextIdx = 0;
        }
        else if (event.key === 'End') {
            nextIdx = activeGraph.nodes.length - 1;
        }
        if (nextIdx >= 0) {
            event.preventDefault();
            const nextNodeId = activeGraph.nodes[nextIdx].id;
            store.update((draft) => {
                draft.selectedNode = nextNodeId;
            });
            const nextDomNode = root.querySelector(`g.graph-node[data-id="${nextNodeId}"]`);
            nextDomNode?.focus();
        }
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
