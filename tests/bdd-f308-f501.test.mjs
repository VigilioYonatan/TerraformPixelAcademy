import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cliStats, parseCliManifest } from '../app/cliEvidence.js';
import { lessons, tracks } from '../app/curriculum.js';
import { defaultState } from '../app/engine.js';
import { LESSON_SENIOR_CONTEXTS } from '../app/lessonSeniorContext.js';
import { seniorCases } from '../app/senior.js';
import { defaultSimulatorInputs } from '../app/simulators.js';
import { filterSeniorCases } from '../app/store.js';
import { LessonClassroom } from '../app/uiLesson.js';
import { ProfileProgressPage, computeTrackProgress } from '../app/uiProfile.js';
import { GLOSSARY_ENTRIES, NotFoundPage, ResourcesPage } from '../app/uiResources.js';
import { SeniorCasePage } from '../app/uiSeniorCase.js';
import { SeniorDashboard } from '../app/uiSeniorHub.js';
import { SettingsPage } from '../app/uiSettings.js';
import { AppShell, NAV_ITEMS } from '../app/uiShell.js';

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

describe('BDD Suite F3-08..F5-01: 100% Pure Preact Routes, 18 Senior Simulators, Per-Lesson Senior Context & Real Terraform 1.10.5 CLI', () => {
  describe('Feature F3-08: Zero dangerouslySetInnerHTML & Pure Preact Profile, Settings, Resources & 404', () => {
    it('Given all TypeScript sources in src/, When inspected statically, Then zero dangerouslySetInnerHTML usages and zero legacy HTML template functions exist', async () => {
      const srcFiles = (await readdir(join(root, 'src'))).filter((f) => f.endsWith('.ts'));
      for (const file of srcFiles) {
        const source = await readText(`src/${file}`);
        assert.equal(
          source.includes('dangerouslySetInnerHTML'),
          false,
          `Forbidden dangerouslySetInnerHTML found in src/${file}`
        );
      }

      const mainSource = await readText('src/main.ts');
      for (const legacyFn of ['progressView', 'settingsView', 'resourcesView', 'notFound']) {
        assert.equal(mainSource.includes(`function ${legacyFn}(`), false, `Legacy ${legacyFn} must be removed`);
      }

      // Desktop nav includes Planes, Evidencias, and Recursos
      const slugs = NAV_ITEMS.map((item) => item.slug);
      assert.ok(slugs.includes('planes'));
      assert.ok(slugs.includes('evidencias'));
      assert.ok(slugs.includes('recursos'));
      assert.equal(NAV_ITEMS.length, 9);
    });

    it('Given ProfileProgressPage, SettingsPage, ResourcesPage, and NotFoundPage, When rendered with learner progress, Then 8 track cards, preferences, glossary filter, and 404 render purely', () => {
      const state = defaultState();
      state.completed = ['B01', 'B02', 'I09', 'A09', 'A10'];
      state.seniorCompleted = ['S01', 'S18'];
      state.theme = 'light';
      state.fontScale = 1.15;
      state.reducedMotion = true;

      const trackProgress = computeTrackProgress(tracks, lessons, state);
      assert.equal(trackProgress.length, 8);
      assert.equal(trackProgress.find((t) => t.track.title === 'Fundamentos')?.done, 2);
      assert.equal(trackProgress.find((t) => t.track.title === 'DevSecOps')?.done, 3);
      assert.equal(trackProgress.find((t) => t.track.title === 'Platform Senior')?.done, 2);

      const profileTree = ProfileProgressPage({ state, lessons, tracks });
      assert.equal(
        findNodes(
          profileTree,
          (n) => n.type === 'div' && String(n.props?.className || '').includes('track-progress-card')
        ).length,
        8
      );
      assert.match(collectText(profileTree), /Primer commit/);

      const settingsTree = SettingsPage({ state });
      assert.match(collectText(settingsTree), /Tu academia, a tu manera/);
      assert.match(collectText(settingsTree), /Sí/);

      const resourcesTree = ResourcesPage({ glossarySearch: 'OIDC' });
      assert.equal(
        findNodes(resourcesTree, (n) => n.type === 'div' && String(n.props?.className || '').includes('glossary-tile'))
          .length,
        1
      );
      assert.equal(GLOSSARY_ENTRIES.length, 30);

      const emptyGlossaryTree = ResourcesPage({ glossarySearch: 'termino-inexistente-999' });
      assert.match(collectText(emptyGlossaryTree), /Sin términos coincidentes/);

      const notFoundTree = AppShell({
        page: 'desconocida',
        mobileMenu: false,
        seniorEnabled: false,
        view: NotFoundPage(),
        toast: null
      });
      assert.match(collectText(notFoundTree), /No encontré esta ruta/);
    });
  });

  describe('Feature F4-01: Dedicated Parameterized Simulators for All 18 Senior Cases (S01–S18)', () => {
    it('Given all 18 Senior cases on tab="investigar", When SeniorCasePage renders each case, Then every case exposes its own .case-sim-controls and run-case-sim button', () => {
      const state = defaultState();
      const simInputs = defaultSimulatorInputs();

      for (const scenario of seniorCases) {
        const tree = SeniorCasePage({
          scenario,
          cases: seniorCases,
          state,
          tab: 'investigar',
          showFix: false,
          simResult: '',
          simInputs
        });
        const simBoxes = findNodes(tree, (n) => n.type === 'div' && n.props?.['data-sim-case'] === scenario.id);
        assert.equal(simBoxes.length, 1, `Missing dedicated simulator widget for ${scenario.id}`);

        const runButtons = findNodes(
          tree,
          (n) =>
            n.type === 'button' && n.props?.['data-action'] === 'run-case-sim' && n.props?.['data-id'] === scenario.id
        );
        assert.equal(runButtons.length, 1, `Missing run-case-sim trigger button for ${scenario.id}`);
      }
    });
  });

  describe('Feature F4-02: Enriched Per-Lesson Senior Context (B01–A12) & Severity/Pillar Filters on #/senior', () => {
    it('Given all 36 lessons with seniorEnabled=true, When LessonClassroom renders, Then each lesson presents unique production risk & prompt linked to a valid S01–S18 incident', () => {
      const validCaseIds = new Set(seniorCases.map((c) => c.id));
      const risks = new Set();
      const prompts = new Set();
      const state = defaultState();
      state.seniorEnabled = true;

      for (const lesson of lessons) {
        const ctx = LESSON_SENIOR_CONTEXTS[lesson.id];
        assert.ok(ctx, `Missing LESSON_SENIOR_CONTEXTS entry for ${lesson.id}`);
        assert.ok(validCaseIds.has(ctx.relatedCaseId), `Invalid relatedCaseId ${ctx.relatedCaseId} for ${lesson.id}`);
        risks.add(ctx.productionRisk);
        prompts.add(ctx.architecturePrompt);

        const tree = LessonClassroom({ lesson, lessons, state, evalResult: undefined });
        const text = collectText(tree);
        assert.ok(text.includes(ctx.productionRisk));
        assert.ok(
          findNodes(tree, (n) => n.type === 'a' && n.props?.href === `#/senior/${ctx.relatedCaseId}`).length >= 1
        );
      }

      assert.equal(risks.size, 36, 'Every lesson B01–A12 must have a distinct productionRisk');
      assert.equal(prompts.size, 36, 'Every lesson B01–A12 must have a distinct architecturePrompt');

      // Senior Hub severity & pillar filtering
      const criticalOnly = filterSeniorCases(seniorCases, '', 'Crítico', 'Todos');
      const stateOnly = filterSeniorCases(seniorCases, '', 'Todas', 'State');
      assert.ok(criticalOnly.length > 0 && criticalOnly.every((c) => c.severity === 'Crítico'));
      assert.ok(stateOnly.length > 0 && stateOnly.every((c) => c.pillar === 'State'));

      const hubTree = SeniorDashboard({
        state,
        cases: seniorCases,
        searchQuery: '',
        severityFilter: 'Crítico',
        pillarFilter: 'IAM'
      });
      const renderedCards = findNodes(hubTree, (n) => n.type === 'a' && n.props?.className === 'senior-case');
      assert.equal(renderedCards.length, 1);
      assert.equal(renderedCards[0].props?.href, '#/senior/S10');
    });
  });

  describe('Feature F5-01: Authentic Terraform v1.10.5 CLI Execution & 37/37 Verified Manifest', () => {
    it('Given assets/examples/cli-evidence-v1.10.5.json and pinned Terraform CLI, When inspected and executed on S18/capstone in isolation, Then 37/37 labs are verified PASS', async () => {
      const rawManifest = JSON.parse(await readText('assets/examples/cli-evidence-v1.10.5.json'));
      const parsed = parseCliManifest(rawManifest);
      assert.equal(parsed.origin, 'LOCAL_TERRAFORM_CLI');
      assert.match(parsed.terraformVersion, /^Terraform v1\.10\.5/);
      assert.deepEqual(cliStats(parsed), { total: 37, pass: 37, fail: 0, notRun: 0, missing: 0 });

      const isWin = process.platform === 'win32';
      const localTf = join(root, '.tools', 'terraform', '1.10.5', isWin ? 'terraform.exe' : 'terraform');
      if (existsSync(localTf)) {
        const sandbox = await mkdtemp(join(tmpdir(), 'tp-s18-live-'));
        try {
          const capstoneSrc = join(root, 'labs', 'senior', 'S18', 'capstone');
          // Copy S18 capstone into temp dir via Node fs.cp
          const { cp } = await import('node:fs/promises');
          await cp(capstoneSrc, sandbox, { recursive: true });

          for (const args of [
            ['fmt', '-check', '-recursive', '-no-color'],
            ['init', '-backend=false', '-input=false', '-no-color'],
            ['validate', '-no-color'],
            ['test', '-no-color']
          ]) {
            const res = spawnSync(localTf, args, {
              cwd: sandbox,
              env: { ...process.env, TF_IN_AUTOMATION: '1' },
              encoding: 'utf8',
              timeout: 30000
            });
            assert.equal(
              res.status,
              0,
              `Real Terraform ${args[0]} failed on S18/capstone: ${res.stderr || res.stdout}`
            );
          }
        } finally {
          await rm(sandbox, { recursive: true, force: true });
        }
      }
    });
  });
});
