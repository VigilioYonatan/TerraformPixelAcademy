import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessons } from '../app/curriculum.js';
import { defaultState, evaluateLesson } from '../app/engine.js';
import { graphs, planFixtures } from '../app/fixtures.js';
import { games } from '../app/games.js';
import { inspectTerraformPlan } from '../app/planInspector.js';
import { emptyGateAnswers, evaluateReleaseGate } from '../app/releaseGate.js';
import { seniorCases } from '../app/senior.js';
import { filterLabPacks, resolveGameSession } from '../app/store.js';
import { GameStage, GamesHub } from '../app/uiGames.js';
import { GraphExplorer, analyzeGraphNode } from '../app/uiGraph.js';
import { LabsDirectory } from '../app/uiLabs.js';
import { LessonClassroom } from '../app/uiLesson.js';
import { PlansExplorerPage } from '../app/uiPlans.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const readText = (rel) => readFile(join(root, rel), 'utf8');

function collectText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(' ');
  if (typeof node === 'object') {
    if (typeof node.type === 'function') {
      return collectText(node.type(node.props || {}));
    }
    return collectText(node.props?.children);
  }
  return '';
}

function findNodes(node, predicate, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    for (const child of node) findNodes(child, predicate, acc);
    return acc;
  }
  if (typeof node.type === 'function') {
    const rendered = node.type(node.props || {});
    return findNodes(rendered, predicate, acc);
  }
  if (predicate(node)) acc.push(node);
  if (node.props?.children !== undefined) {
    findNodes(node.props.children, predicate, acc);
  }
  return acc;
}

describe('BDD Suite F3-03..F3-07: Preact Lesson Classroom, Mini-Games, 54-Pack Labs, SVG Graph & Plan Release Gate', () => {
  describe('Feature F3-03: Declarative Preact LessonClassroom (#/leccion/:id)', () => {
    it('Given all 36 lessons (B01-A12), When LessonClassroom renders each lesson, Then editor host, quiz options, lab ZIP link, and navigation boundaries are intact', async () => {
      const mainSource = await readText('src/main.ts');
      assert.equal(
        mainSource.includes('function lessonView('),
        false,
        'Legacy lessonView HTML template must be removed'
      );
      assert.equal(
        mainSource.includes('function renderEvaluation('),
        false,
        'Legacy renderEvaluation HTML template must be removed'
      );

      const state = defaultState();
      state.seniorEnabled = true;

      for (const lesson of lessons) {
        const evalResult = evaluateLesson(lesson, lesson.example);
        const tree = LessonClassroom({ lesson, lessons, state, evalResult });
        const text = collectText(tree);

        assert.ok(text.includes(lesson.title), `Missing title for ${lesson.id}`);
        assert.ok(text.includes('Reglas educativas superadas'), `Expected passing eval banner for ${lesson.id}`);
        assert.ok(
          text.includes('PREGUNTA DE ARQUITECTURA'),
          `Expected Senior callout when seniorEnabled for ${lesson.id}`
        );

        const textareas = findNodes(tree, (n) => n.type === 'textarea' && n.props?.id === 'code-editor');
        assert.equal(textareas.length, 1, `Expected single #code-editor textarea for ${lesson.id}`);

        const zipLinks = findNodes(tree, (n) => n.type === 'a' && n.props?.href === `./assets/labs/${lesson.id}.zip`);
        assert.equal(zipLinks.length, 1, `Expected lab ZIP download link for ${lesson.id}`);
      }

      // Boundary links: B01 goes back to #/aprender; A12 advances to #/senior
      const firstTree = LessonClassroom({ lesson: lessons[0], lessons, state, evalResult: undefined });
      const lastTree = LessonClassroom({
        lesson: lessons[lessons.length - 1],
        lessons,
        state,
        evalResult: undefined
      });
      assert.ok(findNodes(firstTree, (n) => n.type === 'a' && n.props?.href === '#/aprender').length >= 1);
      assert.ok(findNodes(lastTree, (n) => n.type === 'a' && n.props?.href === '#/senior').length >= 1);
    });
  });

  describe('Feature F3-04: Declarative Preact GamesHub (#/juegos) & GameStage (#/juego/:id)', () => {
    it('Given GamesHub and GameStage across active, answered, and finished states, When rendered, Then all 5 games, accessible progressbars, and redundant cues work purely', async () => {
      const mainSource = await readText('src/main.ts');
      assert.equal(mainSource.includes('function gamesHub('), false);
      assert.equal(mainSource.includes('function gameView('), false);

      const state = defaultState();
      state.gameWins.g1 = 4;
      const hubTree = GamesHub({ games, state });
      const playLinks = findNodes(hubTree, (n) => n.type === 'a' && String(n.props?.href).startsWith('#/juego/'));
      assert.equal(playLinks.length, 5, 'Hub must expose all 5 mini-games');
      assert.match(collectText(hubTree), /Mejor: 4\//);

      const g1 = games[0];
      const freshSession = resolveGameSession(null, g1.id);
      const activeTree = GameStage({ game: g1, session: freshSession });
      assert.equal(freshSession.at, 0, 'Pure render must not mutate session');
      const optionButtons = findNodes(
        activeTree,
        (n) => n.type === 'button' && n.props?.['data-action'] === 'game-answer'
      );
      assert.equal(optionButtons.length, g1.questions[0].options.length);
      assert.ok(optionButtons.every((b) => b.props.disabled === false));

      // Answered wrong state -> shows alerta mascot + explanation + disabled option buttons
      const wrongIdx = (g1.questions[0].correct + 1) % g1.questions[0].options.length;
      const answeredWrongTree = GameStage({
        game: g1,
        session: { id: g1.id, at: 0, score: 0, last: wrongIdx, finished: false }
      });
      assert.match(collectText(answeredWrongTree), /Hay una mejor decisión/);
      const disabledButtons = findNodes(
        answeredWrongTree,
        (n) => n.type === 'button' && n.props?.['data-action'] === 'game-answer'
      );
      assert.ok(disabledButtons.every((b) => b.props.disabled === true));

      // Finished winning state
      const wonTree = GameStage({
        game: g1,
        session: { id: g1.id, at: g1.questions.length - 1, score: g1.questions.length, last: 0, finished: true }
      });
      assert.match(collectText(wonTree), /¡Reto superado!/);
    });
  });

  describe('Feature F3-05: Declarative Preact LabsDirectory (#/laboratorios) with all 54 ZIP Packages', () => {
    it('Given LabsDirectory on default view, When rendered, Then all 36 lesson ZIPs and all 18 Senior incident ZIPs (54 total) are downloadable and filterable', async () => {
      const mainSource = await readText('src/main.ts');
      assert.equal(mainSource.includes('function labsView('), false);

      const allTree = LabsDirectory({
        lessons,
        seniorCases,
        category: 'Todos',
        searchQuery: ''
      });
      const lessonZips = findNodes(
        allTree,
        (n) => n.type === 'a' && typeof n.props?.href === 'string' && n.props.href.startsWith('./assets/labs/')
      );
      const seniorZips = findNodes(
        allTree,
        (n) => n.type === 'a' && typeof n.props?.href === 'string' && n.props.href.startsWith('./assets/senior/')
      );
      assert.equal(lessonZips.length, 36, 'Must list all 36 B/I/A lesson lab ZIPs');
      assert.equal(seniorZips.length, 18, 'Must list all 18 S01-S18 Senior incident ZIPs');

      // Category filtering: Senior only
      const seniorOnly = filterLabPacks(lessons, seniorCases, 'Senior', '');
      assert.equal(seniorOnly.lessons.length, 0);
      assert.equal(seniorOnly.seniorCases.length, 18);

      // Search filtering with zero matches -> empty state
      const emptyTree = LabsDirectory({
        lessons,
        seniorCases,
        category: 'Todos',
        searchQuery: 'paquete-inexistente-9999'
      });
      assert.match(collectText(emptyTree), /Sin paquetes coincidentes/);
    });
  });

  describe('Feature F3-06: Declarative Preact GraphExplorer (#/grafo), Blast Radius & Cycle Detection', () => {
    it('Given network DAG, circular topology, and empty fixtures, When analyzeGraphNode and GraphExplorer run, Then blast radius, cycle alerts, and empty/error states are accurate', async () => {
      const mainSource = await readText('src/main.ts');
      assert.equal(mainSource.includes('function graphView('), false);

      const networkGraph = graphs.find((g) => g.id === 'network');
      assert.ok(networkGraph);
      const vpcAnalysis = analyzeGraphNode(networkGraph.nodes, 'vpc');
      assert.deepEqual(vpcAnalysis.upstreamIds, []);
      assert.equal(vpcAnalysis.downstreamIds.length, 5, 'VPC impacts subnet, sg, compute, db, and app');
      assert.equal(vpcAnalysis.hasCycle, false);

      const cycleGraph = graphs.find((g) => g.id === 'cycle');
      assert.ok(cycleGraph);
      const cycleAnalysis = analyzeGraphNode(cycleGraph.nodes, 'network');
      assert.equal(cycleAnalysis.hasCycle, true, 'Circular dependency must be detected without infinite loop');

      const cycleTree = GraphExplorer({
        graphs,
        selectedGraphId: 'cycle',
        selectedNodeId: 'network'
      });
      assert.match(collectText(cycleTree), /Dependencia circular detectada/);
      const svgGroupNodes = findNodes(cycleTree, (n) => n.type === 'g');
      assert.ok(svgGroupNodes.length === 3);
      assert.ok(
        svgGroupNodes.every((n) => n.props?.tabindex === 0 && n.props?.tabIndex === undefined),
        'SVG <g> nodes must use lowercase tabindex=0 so XML setAttribute makes them keyboard-focusable'
      );

      // Empty & node-less resilience
      const emptyTree = GraphExplorer({ graphs: [], selectedGraphId: '', selectedNodeId: '' });
      assert.match(collectText(emptyTree), /Sin topologías disponibles/);

      const nodelessTree = GraphExplorer({
        graphs: [{ id: 'broken', title: 'Grafo vacío', description: 'Test', nodes: [] }],
        selectedGraphId: 'broken',
        selectedNodeId: ''
      });
      assert.match(collectText(nodelessTree), /no contiene nodos válidos/);
    });
  });

  describe('Feature F3-07: Declarative Preact PlansExplorerPage & SeniorReleaseGate (#/planes)', () => {
    it('Given synthetic fixtures and a user plan with secret values + drift, When PlansExplorerPage renders, Then release gate states render cleanly without leaking secrets', async () => {
      const mainSource = await readText('src/main.ts');
      assert.equal(mainSource.includes('function planView('), false);
      assert.equal(mainSource.includes('function localPlanPanel('), false);

      const canary = 'TOP_SECRET_NEVER_RENDER_98765';
      const userPlan = inspectTerraformPlan({
        format_version: '1.2',
        terraform_version: '1.10.5',
        variables: { db_password: { value: canary } },
        resource_changes: [
          {
            address: 'aws_db_instance.primary',
            provider_name: 'registry.terraform.io/hashicorp/aws',
            change: {
              actions: ['delete', 'create'],
              before: { password: canary },
              after_sensitive: { password: true }
            }
          }
        ],
        resource_drift: [
          {
            address: 'aws_security_group.edge',
            change: { actions: ['update'], before: { token: canary } }
          }
        ]
      });

      const blockedAnswers = emptyGateAnswers();
      const blockedReview = evaluateReleaseGate(userPlan, blockedAnswers);
      const blockedTree = PlansExplorerPage({
        fixtures: planFixtures,
        selectedPlanId: 'p2',
        showPlanRisks: true,
        userPlan,
        userPlanError: '',
        gateAnswers: blockedAnswers,
        gateReview: blockedReview
      });

      const renderedText = collectText(blockedTree);
      assert.ok(renderedText.includes('BLOCKED'));
      assert.ok(renderedText.includes('aws_db_instance.primary'));
      assert.ok(renderedText.includes('aws_security_group.edge'));
      assert.equal(renderedText.includes(canary), false, 'Canary secret must never appear in Preact VNode text');
      assert.equal(
        JSON.stringify(blockedTree).includes(canary),
        false,
        'Canary secret must never appear in VNode props'
      );

      // Empty fixtures resilience
      const emptyFixturesTree = PlansExplorerPage({
        fixtures: [],
        selectedPlanId: '',
        showPlanRisks: false,
        userPlan: null,
        userPlanError: '',
        gateAnswers: blockedAnswers,
        gateReview: null
      });
      assert.match(collectText(emptyFixturesTree), /Sin planes sintéticos disponibles/);
    });
  });
});
