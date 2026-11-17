import { cliEvidenceMarkdown, parseCliManifest } from './cliEvidence.js';
import { getLesson, lessons, tracks, type Lesson } from './curriculum.js';
import { activateCodeEditor, disposeCodeEditor, updateEditorTheme } from './editor.js';
import {
  calculateXP,
  escapeHtml as e,
  evaluateLesson,
  reconcileLessonCompletion,
  sanitizeState,
  slugFilename
} from './engine.js';
import { graphs, planFixtures } from './fixtures.js';
import { games } from './games.js';
import { inspectTerraformPlan } from './planInspector.js';
import { buildPlanReviewMarkdown } from './planReport.js';
import { emptyGateAnswers, evaluateReleaseGate, exportGateReview, type GateAnswers } from './releaseGate.js';
import { getCase, seniorCases } from './senior.js';
import { capstoneNoteValid, reconcileSeniorCompletion, seniorGate } from './seniorProgress.js';
import { buildSeniorPortfolio, buildSeniorReport } from './seniorReport.js';
import { evaluateSeniorDrill } from './seniorWhatIf.js';
import { cidrOverlap, estimateCost, planIntegrity } from './simulators.js';
import { createAcademyStore, filterGlossary, isCaseTabId, isLabsCategory, resolveGameSession } from './store.js';
import { LearningCatalog } from './uiCatalog.js';
import { CliEvidenceDashboard } from './uiCliEvidence.js';
import { GameStage, GamesHub } from './uiGames.js';
import { GraphExplorer } from './uiGraph.js';
import { HomePage, findNextLesson } from './uiHome.js';
import { LabsDirectory } from './uiLabs.js';
import { LessonClassroom } from './uiLesson.js';
import { PlansExplorerPage } from './uiPlans.js';
import { SeniorCasePage } from './uiSeniorCase.js';
import { SeniorDashboard } from './uiSeniorHub.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { AppShell } from './uiShell.js';
import { h, render as renderPreact } from './vendor/preact.mjs';

const appElement = document.getElementById('app');
if (!appElement) {
  throw new Error('No se encuentra #app');
}
const root: HTMLElement = appElement;

const LESSON_IDS = lessons.map((item) => item.id);
const SENIOR_IDS = seniorCases.map((item) => item.id);
const store = createAcademyStore({ lessons, seniorCases });

let toastTimer: number | undefined;
let lastMountedLessonId = '';

function notify(message: string, error = false): void {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  const id = store.showToast(message, error);
  toastTimer = window.setTimeout(() => {
    store.clearToast(id);
  }, 3900);
}

function parseCurrentRoute(): { page: string; param: string; query: URLSearchParams } {
  const rawHash = location.hash || ROUTES.home;
  const [rawPath, rawQuery = ''] = rawHash.split('?');
  const parts = rawPath.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    page: parts[0] || 'inicio',
    param: parts[1] || '',
    query: new URLSearchParams(rawQuery)
  };
}

function syncTextareaValueIfMounted(code: string): void {
  const textarea = document.querySelector<HTMLTextAreaElement>('#code-editor');
  if (textarea) {
    textarea.value = code;
  }
}

function render(): void {
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

  // Preserve caret inside transitional `#glossary-search` input until F3-08 migrates `#/recursos` to Preact
  const activeEl = document.activeElement;
  const restoreGlossaryCaret =
    page === 'recursos' && activeEl instanceof HTMLInputElement && activeEl.id === 'glossary-search'
      ? { start: activeEl.selectionStart, end: activeEl.selectionEnd }
      : null;

  const activeLesson = page === 'leccion' && param ? getLesson(param) : undefined;
  if (!activeLesson) {
    disposeCodeEditor();
    lastMountedLessonId = '';
  } else if (lastMountedLessonId && lastMountedLessonId !== activeLesson.id) {
    disposeCodeEditor();
  }

  const activeGame = page === 'juego' && param ? games.find((g) => g.id === param) : undefined;
  if (activeGame && (!s.gameSession || s.gameSession.id !== activeGame.id)) {
    s.gameSession = resolveGameSession(s.gameSession, activeGame.id);
  }

  const seniorScenario = page === 'senior' && param ? getCase(param) : undefined;

  const declarativeView =
    page === 'inicio'
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
    : page === 'progreso'
      ? progressView()
      : page === 'ajustes'
        ? settingsView()
        : page === 'recursos'
          ? resourcesView()
          : notFound();

  renderPreact(
    h(AppShell, {
      page,
      mobileMenu: s.mobileMenu,
      seniorEnabled: state.seniorEnabled,
      content: legacyContent,
      view: declarativeView,
      toast: s.toast
    }),
    root
  );

  if (restoreGlossaryCaret) {
    const nextInput = document.getElementById('glossary-search');
    if (nextInput instanceof HTMLInputElement) {
      nextInput.focus();
      if (restoreGlossaryCaret.start !== null && restoreGlossaryCaret.end !== null) {
        nextInput.setSelectionRange(restoreGlossaryCaret.start, restoreGlossaryCaret.end);
      }
    }
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
        store.update(() => {}, { persist: true });
      } else {
        store.persistQuietly();
      }
    }, state.theme);
  }
}

store.subscribe(render);

function link(text: string, path: string, style = 'btn btn-soft'): string {
  return `<a href="${path}" class="${style}">${text}</a>`;
}

function label(text: string, variant = 'purple'): string {
  return `<span class="chip chip-${variant}">${e(text)}</span>`;
}

function sectionHead(eyebrow: string, title: string, side = ''): string {
  return `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${side}</div>`;
}

function bar(done: number, total: number): string {
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return `<div class="progress-track" role="progressbar" aria-label="Progreso" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}"><div class="progress-fill" style="width:${pct}%"></div></div>`;
}

function stats(): string {
  const state = store.getState().academy;
  const done = state.completed.length;
  const seniorDone = state.seniorCompleted.length;
  const gamesWon = Object.values(state.gameWins).reduce((a, b) => a + b, 0);
  return `<div class="cards-4"><div class="stat-pill"><span style="font-size:27px">✧</span><div><div class="number">${calculateXP(state).toLocaleString('es-PE')}</div><div class="caption">XP de práctica</div></div></div><div class="stat-pill"><span style="font-size:27px">▣</span><div><div class="number">${done}/36</div><div class="caption">Lecciones evaluadas</div></div></div><div class="stat-pill"><span style="font-size:27px">♛</span><div><div class="number">${seniorDone}/18</div><div class="caption">Casos Senior completados*</div></div></div><div class="stat-pill"><span style="font-size:27px">◆</span><div><div class="number">${gamesWon}</div><div class="caption">Juegos ganados</div></div></div></div>`;
}

function levelLessons(level: string): Lesson[] {
  return lessons.filter((l) => l.level === level);
}

function progressView(): string {
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

function settingsView(): string {
  const state = store.getState().academy;
  return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Ajustes</span></div><div class="eyebrow">PREFERENCIAS Y PRIVACIDAD</div><h1 class="page-title">Tu academia, a tu manera</h1><p class="page-lead">Controla apariencia, movimiento y progreso. Todo funciona localmente, sin inicio de sesión y sin enviar tus ejercicios a un servidor.</p><div class="space24"></div><div class="settings-layout"><div class="content-panel"><h2>Experiencia</h2><div class="settings-item"><div><h4>Tema</h4><p>Claro u oscuro</p></div><select class="input-select" data-input="theme" aria-label="Tema"><option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Oscuro</option><option value="light" ${state.theme === 'light' ? 'selected' : ''}>Claro</option></select></div><div class="settings-item"><div><h4>Senior Mode</h4><p>Muestra preguntas y retos avanzados</p></div><button type="button" class="btn btn-sm ${state.seniorEnabled ? 'btn-primary' : ''}" data-action="toggle-senior">${state.seniorEnabled ? 'Activado' : 'Desactivado'}</button></div><div class="settings-item"><div><h4>Reducir movimiento</h4><p>Desactiva animaciones decorativas</p></div><button type="button" class="btn btn-sm" data-action="toggle-motion">${state.reducedMotion ? 'Sí' : 'No'}</button></div><div class="settings-item"><div><h4>Tamaño de texto</h4><p>Escala general de lectura</p></div><select class="input-select" data-input="font-scale" aria-label="Tamaño de texto"><option value="0.9" ${state.fontScale === 0.9 ? 'selected' : ''}>Compacto</option><option value="1" ${state.fontScale === 1 ? 'selected' : ''}>Normal</option><option value="1.15" ${state.fontScale === 1.15 ? 'selected' : ''}>Grande</option><option value="1.3" ${state.fontScale === 1.3 ? 'selected' : ''}>Muy grande</option></select></div><div class="settings-item"><div><h4>Idioma</h4><p>La versión completa se ofrece en español</p></div><span class="chip">Español</span></div></div><div class="content-panel"><h2>Datos locales</h2><p class="prose">El almacenamiento usa localStorage. No existe cuenta, sincronización ni analítica remota en la app. Puedes hacer backup, restaurar y borrar tus datos del navegador.</p><div class="space24"></div><div class="flex-wrap"><button type="button" class="btn btn-primary" data-action="export-progress">↓ Exportar JSON</button><button type="button" class="btn" data-action="import-progress">↑ Importar JSON</button><input type="file" id="progress-file" accept="application/json,.json" style="display:none" aria-label="Cargar archivo de progreso"/></div><div class="space24"></div><div class="alert">El respaldo incluye código editado, decisiones y evidencia Senior. Consérvalo como información personal. La importación reemplaza el progreso actual después de validación de estructura.</div><div class="space24"></div><button type="button" class="btn btn-danger" data-action="reset-progress">Eliminar todo mi progreso</button><div class="space24"></div><h3 style="font-size:17px">Sobre los laboratorios</h3><p class="prose">Los comandos CLI se ejecutan en tu equipo. Los simuladores no hacen apply ni gestionan cuentas cloud.</p></div></div><section class="section"><div class="card"><h3>Diseño aprobado</h3><p class="card-desc">Se incluye una copia local del concepto visual y un spritesheet original de Terra con 12 poses PNG.</p><div class="space16"></div><a href="./assets/reference/concepto-aprobado.png" target="_blank" rel="noopener noreferrer" class="btn btn-soft">↗ Ver imagen original</a></div></section>`;
}

const glossary: readonly (readonly [string, string])[] = [
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

function resourcesView(): string {
  const query = store.getState().glossarySearch;
  const visibleGlossary = filterGlossary(glossary, query);
  return `<div class="breadcrumb"><a href="${ROUTES.home}">Inicio</a> / <span>Recursos</span></div><div class="eyebrow">BIBLIOTECA IAC</div><h1 class="page-title">Recursos para aprender mejor</h1><p class="page-lead">Enlaces a documentación oficial, guías técnicas y un glosario de conceptos clave para revisar antes de usar infraestructura real.</p><section class="section">${sectionHead('BIBLIOTECA', 'Documentación y herramientas')}<div class="resource-grid">${resources.map((r) => `<div class="resource-card">${label(r.tag, 'purple')}<h3 style="margin-top:11px">${e(r.title)}</h3><p>${e(r.description)}</p><a href="${e(r.href)}" ${r.href.startsWith('https:') ? 'target="_blank" rel="noopener noreferrer"' : ''}>Consultar ↗</a></div>`).join('')}</div></section><section class="section">${sectionHead('A—Z', 'Glosario de Terraform')}<input class="search-bar" type="search" id="glossary-search" value="${e(query)}" placeholder="⌕ Buscar un término…" aria-label="Buscar glosario"/><div class="space16"></div><div class="cards-3" id="glossary-list">${visibleGlossary.map(([term, description]) => `<div class="card glossary-tile"><h3 style="font-size:18px;color:var(--purple-bright)">${e(term)}</h3><p class="card-desc" style="margin-top:9px">${e(description)}</p></div>`).join('')}</div></section>`;
}

function notFound(): string {
  return `<div class="empty-state"><img src="${mascotUrl('pensando')}" alt="Terra confuso" width="210" style="margin:auto"><h1 class="page-title">No encontré esta ruta</h1><p>Revisa la URL o regresa al inicio.</p><div class="space24"></div>${link('Volver a la academia →', ROUTES.home, 'btn btn-primary')}</div>`;
}

function downloadText(name: string, contents: string, mime = 'text/plain;charset=utf-8'): void {
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

function maybeCompleteLesson(id: string): boolean {
  const l = getLesson(id);
  if (!l) return false;
  const s = store.getState();
  const state = s.academy;
  const code = state.code[id] ?? l.starter;
  const evaluated = s.evals[id];
  reconcileLessonCompletion(state, lessons);
  if (
    evaluated?.ok &&
    evaluateLesson(l, code).ok &&
    state.quizAnswers[id] === l.correct &&
    !state.completed.includes(id)
  ) {
    state.completed.push(id);
    return true;
  }
  return false;
}

async function handleAction(action: string, id: string, index: number, element: HTMLElement): Promise<void> {
  switch (action) {
    case 'toggle-menu':
      store.update((s) => {
        s.mobileMenu = !s.mobileMenu;
      });
      return;
    case 'toggle-senior': {
      let enabled = false;
      store.update(
        (s) => {
          s.academy.seniorEnabled = !s.academy.seniorEnabled;
          enabled = s.academy.seniorEnabled;
        },
        { persist: true }
      );
      notify(enabled ? 'Modo Senior activado' : 'Modo Senior desactivado');
      return;
    }
    case 'favorite': {
      if (!getLesson(id)) return;
      store.update(
        (s) => {
          const favs = s.academy.favorites;
          s.academy.favorites = favs.includes(id) ? favs.filter((v) => v !== id) : [...favs, id];
        },
        { persist: true }
      );
      return;
    }
    case 'toggle-motion':
      store.update(
        (s) => {
          s.academy.reducedMotion = !s.academy.reducedMotion;
        },
        { persist: true }
      );
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
    case 'evaluate': {
      const lesson = getLesson(id);
      if (!lesson) return;
      let justCompleted = false;
      store.update(
        (s) => {
          const code = s.academy.code[id] ?? lesson.starter;
          s.evals[id] = evaluateLesson(lesson, code);
          justCompleted = maybeCompleteLesson(id);
        },
        { persist: true }
      );
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
      if (l) notify(`Pista ${id}: ${l.tip}`);
      return;
    }
    case 'solution': {
      const l = getLesson(id);
      if (!l) return;
      if (!window.confirm('Ver la solución completa reemplazará tu código actual. ¿Continuar?')) return;
      syncTextareaValueIfMounted(l.example);
      store.update(
        (s) => {
          s.academy.code[id] = l.example;
          delete s.evals[id];
          reconcileLessonCompletion(s.academy, lessons);
        },
        { persist: true }
      );
      notify('Solución de referencia cargada. Evalúa reglas y responde el quiz para completar.');
      return;
    }
    case 'reset-code': {
      const l = getLesson(id);
      if (!l) return;
      if (!window.confirm('¿Restablecer solo el código de esta lección?')) return;
      syncTextareaValueIfMounted(l.starter);
      store.update(
        (s) => {
          s.academy.code[id] = l.starter;
          delete s.evals[id];
          reconcileLessonCompletion(s.academy, lessons);
        },
        { persist: true }
      );
      return;
    }
    case 'download-code': {
      const l = getLesson(id);
      if (!l) return;
      const code = store.getState().academy.code[id] ?? l.starter;
      downloadText(`${slugFilename(id)}-main.tf`, code);
      notify('Se descargó main.tf. Para pruebas auténticas usa el pack ZIP de laboratorio.');
      return;
    }
    case 'answer-quiz': {
      const l = getLesson(id);
      if (!l) return;
      let justCompleted = false;
      store.update(
        (s) => {
          s.academy.quizAnswers[id] = index;
          justCompleted = maybeCompleteLesson(id);
        },
        { persist: true }
      );
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
      } catch {
        notify('No se pudo copiar: selecciona y copia el comando manualmente.', true);
      }
      return;
    }
    case 'game-answer': {
      const game = games.find((g) => g.id === id);
      const current = store.getState().gameSession;
      if (!game || !current || current.id !== id || current.last !== null || current.finished) return;
      store.update((s) => {
        if (!s.gameSession) return;
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
      if (!game || !current || current.id !== id || current.last === null) return;
      let shouldPersist = false;
      store.update((s) => {
        const session = s.gameSession;
        if (!session) return;
        if (session.at >= game.questions.length - 1) {
          session.finished = true;
          const previous = s.academy.gameWins[id] || 0;
          if (session.score >= Math.ceil(game.questions.length * 0.8) && session.score > previous) {
            s.academy.gameWins[id] = session.score;
            shouldPersist = true;
          }
        } else {
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
      store.update((s) => {
        s.gameSession = resolveGameSession(null, id);
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
        const result = planIntegrity(
          { commit: approvedCommit, env: 'prod', digest: 'sha256-a1' },
          {
            commit: appliedCommit,
            env: 'prod',
            digest: approvedCommit === appliedCommit ? 'sha256-a1' : 'sha256-b2'
          }
        );
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
      if (!c) return;
      store.update(
        (s) => {
          s.academy.seniorDecisions[id] = index;
          reconcileSeniorCompletion(s.academy, seniorCases);
        },
        { persist: true }
      );
      return;
    }
    case 'finish-case': {
      const c = getCase(id);
      if (!c) return;
      const gateResult = seniorGate(store.getState().academy, c);
      if (!gateResult.ok) {
        notify(gateResult.reasons.join(' '), true);
        return;
      }
      let newlyCompleted = false;
      store.update(
        (s) => {
          if (!s.academy.seniorCompleted.includes(id)) {
            s.academy.seniorCompleted.push(id);
            newlyCompleted = true;
          }
        },
        { persist: true }
      );
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
      downloadText(
        'TerraPixel-Revision-Plan-Local.md',
        buildPlanReviewMarkdown(currentPlan),
        'text/markdown;charset=utf-8'
      );
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
      downloadText(
        'TerraPixel-Portfolio-Senior.md',
        buildSeniorPortfolio(seniorCases, state),
        'text/markdown;charset=utf-8'
      );
      notify('Portafolio exportado: contiene tus respuestas y ADR; revisa datos privados antes de compartir.');
      return;
    }
    case 'export-senior': {
      const c = getCase(id);
      if (!c) return;
      const report = buildSeniorReport(c, store.getState().academy);
      downloadText(`${c.id}-informe-senior.md`, report, 'text/markdown;charset=utf-8');
      notify(`Informe ${c.id} descargado: actividad educativa no certificada.`);
      return;
    }
    case 'export-progress': {
      const state = store.getState().academy;
      downloadText(
        `terrapixel-progreso-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(state, null, 2),
        'application/json;charset=utf-8'
      );
      notify('Respaldo JSON exportado.');
      return;
    }
    case 'import-progress':
      document.getElementById('progress-file')?.click();
      return;
    case 'what-if-answer': {
      const result = evaluateSeniorDrill(id, index);
      if (!result) return;
      store.update(
        (s) => {
          s.academy.seniorDrillAnswers[id] = index;
          reconcileSeniorCompletion(s.academy, seniorCases);
        },
        { persist: true }
      );
      return;
    }
    case 'reset-progress': {
      if (
        !window.confirm(
          '¿Eliminar TODO el progreso, código y decisiones de este navegador? Esta acción no se puede deshacer.'
        )
      ) {
        return;
      }
      store.resetAcademy();
      notify('Progreso local restablecido.');
      return;
    }
  }
}

root.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as Element | null;
  const element = target?.closest<HTMLElement>('[data-action]');
  if (!element) return;
  if (element instanceof HTMLButtonElement && element.disabled) return;
  const action = element.dataset.action || '';
  const id = element.dataset.id || '';
  const index = Number(element.dataset.index || 0);
  if (element.tagName.toLowerCase() === 'a') {
    event.preventDefault();
  }
  void handleAction(action, id, index, element).catch((err) =>
    notify(err instanceof Error ? err.message : 'Error inesperado', true)
  );
});

root.addEventListener('input', (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
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
    store.update(
      (s) => {
        s.academy.code[id] = target.value.slice(0, 30000);
        delete s.evals[id];
        reconcileLessonCompletion(s.academy, lessons);
      },
      { persist: true }
    );
    return;
  }

  if (input === 'case-evidence' && target instanceof HTMLTextAreaElement) {
    const id = target.dataset.id || '';
    store.update(
      (s) => {
        s.academy.seniorEvidence[id] = target.value.slice(0, 12000);
        reconcileSeniorCompletion(s.academy, seniorCases);
      },
      { persist: true }
    );
    return;
  }

  if (input === 'capstone-note' && target instanceof HTMLTextAreaElement) {
    const idx = Number(target.dataset.index);
    if (Number.isInteger(idx) && idx >= 0 && idx < 8) {
      store.update(
        (s) => {
          const text = target.value.slice(0, 2500);
          s.academy.capstoneEvidence[String(idx)] = text;
          if (!capstoneNoteValid(text)) {
            s.academy.capstoneDone = s.academy.capstoneDone.filter((n) => n !== idx);
          }
          reconcileSeniorCompletion(s.academy, seniorCases);
        },
        { persist: true }
      );
    }
  }
});

root.addEventListener('change', (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;

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
      store.update(
        (s) => {
          s.academy.theme = nextTheme;
        },
        { persist: true }
      );
      updateEditorTheme(nextTheme);
      return;
    }
    if (target.dataset.input === 'font-scale') {
      store.update(
        (s) => {
          s.academy.fontScale = Number(target.value);
        },
        { persist: true }
      );
      return;
    }
  }

  if (target instanceof HTMLInputElement && target.dataset.input === 'gate-check') {
    const key = target.dataset.id as keyof Omit<GateAnswers, 'environment'>;
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
    store.update(
      (s) => {
        const list = new Set(s.academy.seniorChecklist[id] || []);
        if (target.checked) list.add(index);
        else list.delete(index);
        s.academy.seniorChecklist[id] = [...list];
        reconcileSeniorCompletion(s.academy, seniorCases);
      },
      { persist: true }
    );
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.input === 'capstone-check') {
    const idx = Number(target.dataset.index);
    if (target.checked && !capstoneNoteValid(store.getState().academy.capstoneEvidence[String(idx)] || '')) {
      notify('Primero documenta evidencia del hito.', true);
      return;
    }
    store.update(
      (s) => {
        const list = new Set(s.academy.capstoneDone);
        if (target.checked) list.add(idx);
        else list.delete(idx);
        s.academy.capstoneDone = [...list];
        reconcileSeniorCompletion(s.academy, seniorCases);
      },
      { persist: true }
    );
    return;
  }

  if (target instanceof HTMLInputElement && target.id === 'cli-manifest-file') {
    const file = target.files?.[0];
    if (!file) return;
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
    if (!file) return;
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
    if (!file) return;
    if (file.size > 2_000_000) {
      notify('El archivo de progreso supera 2 MB.', true);
      return;
    }
    void file
      .text()
      .then((text) => {
        const incoming = sanitizeState(JSON.parse(text), LESSON_IDS, SENIOR_IDS);
        if (!window.confirm('¿Reemplazar tu progreso actual por el archivo validado?')) return;
        const { invalidatedSenior, invalidatedLessons } = store.replaceAcademy(incoming);
        notify(
          invalidatedSenior.length || invalidatedLessons.length
            ? `Progreso importado; se invalidaron ${invalidatedSenior.length} casos Senior y ${invalidatedLessons.length} lecciones incompletas.`
            : 'Progreso importado y validado correctamente.'
        );
      })
      .catch((err) => notify(`Importación inválida: ${err instanceof Error ? err.message : 'JSON incorrecto'}`, true));
  }
});

root.addEventListener('keydown', (event: KeyboardEvent) => {
  const target = event.target;
  // Fallback Tab indentation only when `<textarea id="code-editor">` is visible without CodeMirror 6
  if (target instanceof HTMLTextAreaElement && target.id === 'code-editor' && !target.hidden && event.key === 'Tab') {
    event.preventDefault();
    target.setRangeText('  ', target.selectionStart, target.selectionEnd, 'end');
    const id = target.dataset.id || '';
    store.update(
      (s) => {
        s.academy.code[id] = target.value;
        delete s.evals[id];
        reconcileLessonCompletion(s.academy, lessons);
      },
      { persist: true }
    );
    return;
  }

  // SVG Graph keyboard navigation: Enter, Space, Arrow keys, Home, End
  if (target instanceof Element && target.matches('g.graph-node')) {
    const nodeEl = target as HTMLElement | SVGElement;
    const currentId = nodeEl.dataset.id || '';
    const s = store.getState();
    const activeGraph = graphs.find((g) => g.id === s.selectedGraph) || graphs[0];
    if (!activeGraph || activeGraph.nodes.length === 0) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void handleAction('graph-node', currentId, 0, nodeEl as HTMLElement);
      return;
    }

    const currentIdx = Math.max(
      0,
      activeGraph.nodes.findIndex((n) => n.id === currentId)
    );
    let nextIdx = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIdx = (currentIdx + 1) % activeGraph.nodes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIdx = (currentIdx - 1 + activeGraph.nodes.length) % activeGraph.nodes.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = activeGraph.nodes.length - 1;
    }

    if (nextIdx >= 0) {
      event.preventDefault();
      const nextNodeId = activeGraph.nodes[nextIdx].id;
      store.update((draft) => {
        draft.selectedNode = nextNodeId;
      });
      const nextDomNode = root.querySelector<SVGElement>(`g.graph-node[data-id="${nextNodeId}"]`);
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
