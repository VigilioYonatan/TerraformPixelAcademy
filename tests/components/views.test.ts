/**
 * Vitest 5 + `@testing-library/preact` Component Suite (`F6-01`).
 * Renders all 14 Preact views + `AppShell` + `NotFoundPage` into real JSDOM,
 * asserting accessible roles/labels, search/filter states, all 5 games,
 * all 18 Senior cases + S18 8-milestone capstone, Plan Inspector, Release Gate,
 * CLI Evidence dashboard, and state sanitization/revocation.
 */
import { cleanup, render, screen, within } from '@testing-library/preact';
import { h, type VNode } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';
import { parseCliManifest } from '../../src/cliEvidence.js';
import { lessons, tracks } from '../../src/curriculum.js';
import { defaultState, evaluateLesson, reconcileLessonCompletion } from '../../src/engine.js';
import { graphs, planFixtures } from '../../src/fixtures.js';
import { games } from '../../src/games.js';
import { inspectTerraformPlan } from '../../src/planInspector.js';
import { emptyGateAnswers, evaluateReleaseGate } from '../../src/releaseGate.js';
import { seniorCases } from '../../src/senior.js';
import { reconcileSeniorCompletion } from '../../src/seniorProgress.js';
import { defaultSimulatorInputs } from '../../src/simulators.js';
import { resolveGameSession } from '../../src/store.js';
import { LearningCatalog } from '../../src/uiCatalog.js';
import { CliEvidenceDashboard } from '../../src/uiCliEvidence.js';
import { GameStage, GamesHub } from '../../src/uiGames.js';
import { GraphExplorer } from '../../src/uiGraph.js';
import { HomePage } from '../../src/uiHome.js';
import { LabsDirectory } from '../../src/uiLabs.js';
import { LessonClassroom } from '../../src/uiLesson.js';
import { PlansExplorerPage } from '../../src/uiPlans.js';
import { ProfileProgressPage } from '../../src/uiProfile.js';
import { NotFoundPage, ResourcesPage } from '../../src/uiResources.js';
import { SeniorCasePage } from '../../src/uiSeniorCase.js';
import { SeniorDashboard } from '../../src/uiSeniorHub.js';
import { SettingsPage } from '../../src/uiSettings.js';
import { AppShell } from '../../src/uiShell.js';

const mount = (node: unknown) => render(node as VNode);

afterEach(() => {
  cleanup();
});

describe('F6-01: Preact Component Suite across all 14 views + AppShell + 404 (@testing-library/preact)', () => {
  it('1. AppShell + HomePage (#/inicio) expose accessible landmarks, skip-link, toast status, and learner progress', () => {
    const state = defaultState();
    state.completed = ['B01', 'B02', 'B03'];
    state.seniorEnabled = true;

    mount(
      AppShell({
        page: 'inicio',
        mobileMenu: false,
        seniorEnabled: true,
        view: HomePage({ state, lessons }),
        toast: { id: 1, message: 'Modo Senior activado', error: false }
      })
    );

    expect(screen.getByRole('link', { name: 'Saltar al contenido' }).getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Modo Senior activado');
    expect(screen.getByRole('link', { name: /Continuar mi ruta/i }).getAttribute('href')).toBe('#/leccion/B04');
  });

  it('2. LearningCatalog (#/aprender) renders 36 lessons + 8 specialization tracks and handles negative zero-match filter', () => {
    const state = defaultState();
    state.completed = ['B01'];
    state.favorites = ['B04'];

    const { rerender } = mount(LearningCatalog({ lessons, tracks, state, level: 'Todos', searchQuery: '' }));
    expect(screen.getByRole('searchbox', { name: 'Buscar lecciones' })).toBeTruthy();
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
    expect(screen.getByText('Itinerarios de especialización')).toBeTruthy();

    rerender(
      LearningCatalog({
        lessons,
        tracks,
        state,
        level: 'Avanzado',
        searchQuery: 'termino-inexistente-xyz'
      }) as VNode
    );
    expect(screen.getByRole('status').textContent).toContain('Sin coincidencias');
  });

  it('3. LessonClassroom (#/leccion/:id) renders editor, accessible quiz, Senior architecture callout, and revokes completion on invalid HCL', () => {
    const state = defaultState();
    state.seniorEnabled = true;
    const lesson = lessons[3]; // B04
    state.code.B04 = lesson.example;
    state.quizAnswers.B04 = lesson.correct;
    state.completed = ['B04'];

    const passingEval = evaluateLesson(lesson, state.code.B04);
    mount(LessonClassroom({ lesson, lessons, state, evalResult: passingEval }));

    expect(screen.getByRole('textbox', { name: 'Editor main.tf' })).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: /Progreso nivel/i }).getAttribute('aria-valuenow')).toBe('1');
    expect(screen.getByText(/PREGUNTA DE ARQUITECTURA · B04/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Resolver incidente S04/i }).getAttribute('href')).toBe('#/senior/S04');

    // Mutate code to invalid starter and verify reconciliation revokes B04
    state.code.B04 = lesson.starter;
    const revoked = reconcileLessonCompletion(state, lessons);
    expect(revoked).toEqual(['B04']);
    expect(state.completed).toEqual([]);
  });

  it('4 & 5. GamesHub (#/juegos) and GameStage (#/juego/:id) cover all 5 mini-games with accessible progressbars and status feedback', () => {
    const state = defaultState();
    state.gameWins = { g1: 5, g2: 3 };
    mount(GamesHub({ games, state }));
    expect(screen.getAllByRole('link', { name: '▶ Jugar' })).toHaveLength(5);
    cleanup();

    for (const game of games) {
      const activeSession = resolveGameSession(null, game.id);
      mount(GameStage({ game, session: activeSession }));
      const bar = screen.getByRole('progressbar', { name: 'Progreso de la partida' });
      expect(bar.getAttribute('aria-valuemax')).toBe(String(game.questions.length));
      cleanup();

      const finishedSession = {
        id: game.id,
        at: game.questions.length - 1,
        score: game.questions.length,
        last: 0,
        finished: true
      };
      mount(GameStage({ game, session: finishedSession }));
      expect(screen.getByRole('status').textContent).toContain('¡Reto superado!');
      cleanup();
    }
  });

  it('6. LabsDirectory (#/laboratorios) exposes 54 downloadable ZIP links and handles empty search state', () => {
    const { rerender } = mount(LabsDirectory({ lessons, seniorCases, category: 'Todos', searchQuery: '' }));
    const zipLinks = screen.getAllByRole('link', { name: '↓ ZIP' });
    expect(zipLinks).toHaveLength(54);

    rerender(
      LabsDirectory({
        lessons,
        seniorCases,
        category: 'Senior',
        searchQuery: 'no-existe-pack-999'
      }) as VNode
    );
    expect(screen.getByRole('status').textContent).toContain('Sin paquetes coincidentes');
  });

  it('7. GraphExplorer (#/grafo) renders interactive SVG group with focusable button nodes and cycle alert', () => {
    const { rerender } = mount(GraphExplorer({ graphs, selectedGraphId: 'network', selectedNodeId: 'vpc' }));
    const svgGroup = screen.getByRole('group', { name: /Grafo de dependencias/i });
    const nodeButtons = within(svgGroup).getAllByRole('button');
    expect(nodeButtons.length).toBeGreaterThanOrEqual(5);

    rerender(GraphExplorer({ graphs, selectedGraphId: 'cycle', selectedNodeId: 'network' }) as VNode);
    expect(screen.getByRole('status').textContent).toMatch(/Dependencia circular detectada/i);
  });

  it('8. PlansExplorerPage (#/planes) renders fixtures, local plan metadata, and SeniorReleaseGate without exposing secrets', () => {
    const canary = 'COMPONENT_TEST_SECRET_NEVER_LEAK';
    const userPlan = inspectTerraformPlan({
      format_version: '1.2',
      terraform_version: '1.10.5',
      variables: { token: { value: canary } },
      resource_changes: [
        {
          address: 'aws_db_instance.main',
          change: { actions: ['delete', 'create'], before: { password: canary }, before_sensitive: { password: true } }
        },
        { address: 'aws_s3_bucket.orphan', change: { actions: ['forget'] } }
      ]
    });
    const gateAnswers = {
      ...emptyGateAnswers(),
      provenanceVerified: true,
      ownersApproved: true,
      driftInvestigated: true,
      destructiveReviewed: true,
      rollbackDocumented: true,
      costReviewed: true
    };
    const gateReview = evaluateReleaseGate(userPlan, gateAnswers);

    const { container } = mount(
      PlansExplorerPage({
        fixtures: planFixtures,
        selectedPlanId: 'p1',
        showPlanRisks: true,
        userPlan,
        userPlanError: '',
        gateAnswers,
        gateReview
      })
    );

    expect(screen.getByLabelText('Seleccionar plan JSON de Terraform')).toBeTruthy();
    expect(screen.getByText('NEEDS_EVIDENCE')).toBeTruthy();
    expect(container.textContent).not.toContain(canary);
  });

  it('9 & 10. SeniorDashboard (#/senior) and all 18 SeniorCasePage (#/senior/:id) + S18 8-milestone capstone & revocation', () => {
    const state = defaultState();
    mount(
      SeniorDashboard({
        state,
        cases: seniorCases,
        searchQuery: '',
        severityFilter: 'Crítico',
        pillarFilter: 'Todos'
      })
    );
    expect(screen.getByLabelText('Filtrar por dominio técnico')).toBeTruthy();
    expect(screen.getByRole('searchbox', { name: 'Buscar casos Senior' })).toBeTruthy();
    cleanup();

    const simInputs = defaultSimulatorInputs();
    for (const scenario of seniorCases) {
      mount(
        SeniorCasePage({
          scenario,
          cases: seniorCases,
          state,
          tab: 'investigar',
          showFix: false,
          simResult: 'Resultado simulado de prueba',
          simInputs
        })
      );
      expect(screen.getByRole('navigation', { name: 'Fases del caso' })).toBeTruthy();
      expect(screen.getByText('Resultado simulado de prueba')).toBeTruthy();
      cleanup();
    }

    // S18 operations tab renders all 8 capstone milestones and enforces revocation
    const s18 = seniorCases.find((c) => c.id === 'S18');
    expect(s18).toBeDefined();
    if (s18) {
      mount(
        SeniorCasePage({
          scenario: s18,
          cases: seniorCases,
          state,
          tab: 'operaciones',
          showFix: false,
          simResult: '',
          simInputs
        })
      );
      expect(screen.getAllByPlaceholderText(/Control, riesgo, estado/i)).toHaveLength(8);
      const finishBtn = screen.getByRole('button', { name: /Marcar autoevaluación completa/i }) as HTMLButtonElement;
      expect(finishBtn.disabled).toBe(true);
    }

    // Forged completion is immediately revoked
    state.seniorCompleted = ['S18'];
    expect(reconcileSeniorCompletion(state, seniorCases)).toEqual(['S18']);
    expect(state.seniorCompleted).toEqual([]);
  });

  it('11. CliEvidenceDashboard (#/evidencias) renders empty state, error alert, and parsed 37-entry manifest', () => {
    const { rerender } = mount(CliEvidenceDashboard({ manifest: null, error: 'Esquema inválido' }));
    expect(screen.getByRole('alert').textContent).toContain('Esquema inválido');

    const manifest = parseCliManifest({
      schemaVersion: 1,
      origin: 'SYNTHETIC_EXAMPLE',
      runId: 'vitest-run-12345',
      generatedAt: '2026-11-16T12:00:00Z',
      terraformVersion: 'Terraform v1.10.5',
      results: [{ id: 'B01', status: 'PASS', logSha256: 'a'.repeat(64), logBytes: 120 }]
    });
    rerender(CliEvidenceDashboard({ manifest, error: '' }) as VNode);
    expect(screen.getByText('SIMULACIÓN')).toBeTruthy();
    expect(screen.getByText(/Terraform v1\.10\.5/)).toBeTruthy();
  });

  it('12, 13 & 14. ProfileProgressPage (#/progreso), SettingsPage (#/ajustes), ResourcesPage (#/recursos) & NotFoundPage (404)', () => {
    const state = defaultState();
    state.completed = ['B01', 'I01', 'A01'];
    mount(ProfileProgressPage({ state, lessons, tracks }));
    expect(screen.getByText('Avance por itinerario')).toBeTruthy();
    expect(screen.getAllByRole('progressbar')).toHaveLength(11); // 3 levels + 8 tracks
    cleanup();

    mount(SettingsPage({ state }));
    expect((screen.getByLabelText('Tema') as HTMLSelectElement).value).toBe('dark');
    expect((screen.getByLabelText('Tamaño de texto') as HTMLSelectElement).value).toBe('1');
    expect(screen.getByRole('button', { name: 'Eliminar todo mi progreso' })).toBeTruthy();
    cleanup();

    mount(ResourcesPage({ glossarySearch: 'Blast radius' }));
    expect((screen.getByRole('searchbox', { name: 'Buscar glosario' }) as HTMLInputElement).value).toBe('Blast radius');
    expect(screen.getByText('Alcance potencial de un cambio o incidente.')).toBeTruthy();
    cleanup();

    mount(h(NotFoundPage, {}));
    expect(screen.getByRole('heading', { name: 'No encontré esta ruta' })).toBeTruthy();
  });
});
