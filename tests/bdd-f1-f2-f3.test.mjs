import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessons, tracks } from '../app/curriculum.js';
import { defaultState } from '../app/engine.js';
import { tokenizeHclSource } from '../app/hclLanguage.js';
import { seniorCases } from '../app/senior.js';
import { createAcademyStore, filterGlossary, filterLessons, filterSeniorCases } from '../app/store.js';
import { LearningCatalog } from '../app/uiCatalog.js';
import { HomePage } from '../app/uiHome.js';
import { SeniorDashboard } from '../app/uiSeniorHub.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const readText = (rel) => readFile(join(root, rel), 'utf8');

function collectVNodeText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(collectVNodeText).join(' ');
  if (typeof node === 'object') {
    const children = node.props?.children;
    return collectVNodeText(children);
  }
  return '';
}

function findVNodes(node, predicate, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    for (const child of node) findVNodes(child, predicate, acc);
    return acc;
  }
  if (predicate(node)) acc.push(node);
  const children = node.props?.children;
  if (children !== undefined) findVNodes(children, predicate, acc);
  return acc;
}

describe('BDD Suite F1-03..F3-02: Full Biome Gate, CodeMirror 6 HCL Grammar, Reactive Store & Preact Home', () => {
  describe('Feature F1-03: Full Biome Recommended + A11y + Formatter Gate', () => {
    it('Given biome.json, When inspected and executed via biome ci, Then recommended rules, a11y rules, and formatter pass with 0 errors', async () => {
      const biomeConfig = JSON.parse(await readText('biome.json'));
      assert.equal(biomeConfig.formatter?.enabled, true, 'Biome formatter must be enabled');
      assert.equal(biomeConfig.linter?.enabled, true, 'Biome linter must be enabled');
      assert.notEqual(biomeConfig.linter?.rules?.preset, 'none', 'Biome preset must not be disabled');
      assert.notEqual(biomeConfig.linter?.rules?.recommended, false, 'Biome recommended rules must be active');

      const biomeCli = join(root, 'node_modules', '@biomejs', 'biome', 'bin', 'biome');
      const run = spawnSync(process.execPath, [biomeCli, 'ci', '.'], {
        cwd: root,
        encoding: 'utf8',
        timeout: 30000
      });
      assert.equal(run.status, 0, run.stderr || run.stdout);
    });
  });

  describe('Feature F2-01 & F2-02: CodeMirror 6 HCL StreamParser Grammar', () => {
    it('Given HCL with blocks, types, functions, heredocs, comments, and interpolations, When tokenized, Then semantic tokens are accurate and isolated', () => {
      const sample = [
        '# Comentario inicial resource fake',
        '/* Comentario',
        '   multilinea variable fake */',
        'resource "terraform_data" "app" {',
        '  for_each = toset(["dev", "prod"])',
        '  input    = "${var.prefix}-${each.key}"',
        '  triggers_replace = [42, true]',
        '}',
        'locals {',
        '  policy = <<-EOF',
        '    resource "not_a_keyword_inside_heredoc" {}',
        '  EOF',
        '  subnet = cidrsubnet("10.0.0.0/16", 8, 1)',
        '}',
        'removed {',
        '  from = terraform_data.legacy',
        '  lifecycle { destroy = false }',
        '}'
      ].join('\n');

      const tokens = tokenizeHclSource(sample);

      // Line 1 & 2-3 comments must strictly emit 'comment', never 'keyword'
      const commentLines = tokens.filter((t) => t.line <= 3 && t.token !== null);
      assert.ok(commentLines.length >= 2);
      assert.ok(
        commentLines.every((t) => t.token === 'comment'),
        'Comments must not leak keyword tokens'
      );

      // Line 4: `resource` is keyword, `"terraform_data"` and `"app"` are strings
      const line4 = tokens.filter((t) => t.line === 4 && t.token !== null);
      assert.equal(line4[0].token, 'keyword');
      assert.equal(line4[0].text, 'resource');
      assert.ok(line4.some((t) => t.token === 'string' && t.text.includes('terraform_data')));

      // Line 5: `for_each` keyword, `toset` builtin
      const line5 = tokens.filter((t) => t.line === 5 && t.token !== null);
      assert.ok(line5.some((t) => t.token === 'keyword' && t.text === 'for_each'));
      assert.ok(line5.some((t) => t.token === 'builtin' && t.text === 'toset'));

      // Line 6: string interpolation `${var.prefix}-${each.key}` tokenizes `var` and `each` as namespace `type`
      const line6 = tokens.filter((t) => t.line === 6 && t.token !== null);
      assert.ok(line6.some((t) => t.token === 'type' && t.text === 'var'));
      assert.ok(line6.some((t) => t.token === 'type' && t.text === 'each'));

      // Line 7: `42` number and `true` atom
      const line7 = tokens.filter((t) => t.line === 7 && t.token !== null);
      assert.ok(line7.some((t) => t.token === 'number' && t.text === '42'));
      assert.ok(line7.some((t) => t.token === 'atom' && t.text === 'true'));

      // Line 11 inside heredoc: must be `string`, NOT `keyword`
      const line11 = tokens.filter((t) => t.line === 11 && t.token !== null);
      assert.ok(
        line11.every((t) => t.token === 'string'),
        'Heredoc interior must remain string token'
      );

      // Line 13 after heredoc closes: `cidrsubnet` is recognized as builtin again
      const line13 = tokens.filter((t) => t.line === 13 && t.token !== null);
      assert.ok(line13.some((t) => t.token === 'builtin' && t.text === 'cidrsubnet'));

      // Line 15: Terraform 1.7+ `removed` block keyword recognized
      const line15 = tokens.filter((t) => t.line === 15 && t.token !== null);
      assert.equal(line15[0].token, 'keyword');
      assert.equal(line15[0].text, 'removed');
    });
  });

  describe('Feature F3-01: Reactive Store & Elimination of Imperative DOM Mutations', () => {
    it('Given all TypeScript modules in src/, When scanned statically, Then zero .innerHTML assignments, zero el.hidden hacks, and zero dead legacy view functions remain', async () => {
      const files = (await readdir(join(root, 'src'))).filter((f) => f.endsWith('.ts'));
      for (const filename of files) {
        const source = await readText(`src/${filename}`);
        assert.doesNotMatch(source, /\.innerHTML\s*=/, `Imperative .innerHTML mutation forbidden in src/${filename}`);
        assert.doesNotMatch(source, /\.hidden\s*=\s*!\(/, `Imperative el.hidden filter forbidden in src/${filename}`);
      }
      const mainSource = await readText('src/main.ts');
      for (const removedDeadFn of [
        'function home(',
        'function catalog(',
        'function seniorCaseView(',
        'function updateFilter(',
        'function syncSeniorLabels('
      ]) {
        assert.equal(
          mainSource.includes(removedDeadFn),
          false,
          `Dead legacy function ${removedDeadFn} must be removed from src/main.ts`
        );
      }
    });

    it('Given createAcademyStore, When state updates, quiet persistence, toast notifications, and tampered imports occur, Then listeners and reconciliation behave deterministically', () => {
      let persistedCount = 0;
      let renderCount = 0;
      const store = createAcademyStore({
        lessons,
        seniorCases,
        initialAcademy: defaultState(),
        persistFn: () => {
          persistedCount++;
          return true;
        }
      });
      const unsubscribe = store.subscribe(() => {
        renderCount++;
      });

      // Reactive search update notifies subscribers without persisting to localStorage
      store.update((s) => {
        s.lessonSearch = 'estado';
      });
      assert.equal(renderCount, 1);
      assert.equal(persistedCount, 0);
      assert.ok(filterLessons(lessons, 'Todos', store.getState().lessonSearch).length >= 1);

      // Quiet persistence during editor typing saves state without triggering full DOM re-render
      store.getState().academy.code.B04 = 'resource "terraform_data" "demo" {}';
      store.persistQuietly();
      assert.equal(persistedCount, 1);
      assert.equal(renderCount, 1);

      // Declarative toast lifecycle
      const toastId = store.showToast('Guardado exitoso', false);
      assert.equal(store.getState().toast?.message, 'Guardado exitoso');
      store.clearToast(toastId + 999); // mismatched ID does not clear newer toast
      assert.equal(store.getState().toast?.id, toastId);
      store.clearToast(toastId);
      assert.equal(store.getState().toast, null);

      // Forged completion import is immediately reconciled & revoked
      const forged = defaultState();
      forged.completed = ['B01', 'B04']; // missing valid code & quiz answers
      forged.seniorCompleted = ['S01']; // missing ADR, checklist, decision & what-if
      const result = store.replaceAcademy(forged);
      assert.deepEqual(result.invalidatedLessons, ['B01', 'B04']);
      assert.deepEqual(result.invalidatedSenior, ['S01']);
      assert.deepEqual(store.getState().academy.completed, []);
      assert.deepEqual(store.getState().academy.seniorCompleted, []);

      // Pure filters for Senior cases and Glossary
      assert.equal(filterSeniorCases(seniorCases, 'S18').length, 1);
      assert.equal(filterSeniorCases(seniorCases, 'termino-inexistente-xyz').length, 0);
      assert.equal(
        filterGlossary(
          [
            ['Drift', 'Desviacion de estado'],
            ['OIDC', 'Identidad federada']
          ],
          'oidc'
        ).length,
        1
      );

      // Declarative empty states in LearningCatalog & SeniorDashboard
      const emptyCatalogVNode = LearningCatalog({
        lessons,
        tracks,
        state: store.getState().academy,
        level: 'Todos',
        searchQuery: 'filtro-sin-resultados-999'
      });
      assert.match(collectVNodeText(emptyCatalogVNode), /Sin coincidencias/);

      const emptySeniorVNode = SeniorDashboard({
        state: store.getState().academy,
        cases: seniorCases,
        searchQuery: 'incidente-inexistente-999'
      });
      assert.match(collectVNodeText(emptySeniorVNode), /Sin casos coincidentes/);

      unsubscribe();
    });
  });

  describe('Feature F3-02: Declarative Preact HomePage (#/inicio)', () => {
    it('Given a new learner vs a returning learner, When HomePage renders, Then CTAs, level progress bars, Terra poses, and KPI counters reflect live state', () => {
      const freshState = defaultState();
      const freshTree = HomePage({ state: freshState, lessons });
      const freshText = collectVNodeText(freshTree);

      assert.match(freshText, /Terra\s*Pixel\s*Academy/);
      assert.match(freshText, /Empezar gratis/);
      assert.match(freshText, /0\/36/);
      assert.match(freshText, /0\/18/);

      const freshLinks = findVNodes(freshTree, (n) => n.type === 'a');
      assert.ok(freshLinks.some((a) => a.props.href === '#/aprender'));
      const freshImages = findVNodes(freshTree, (n) => n.type === 'img');
      assert.equal(freshImages.length, 5, 'Hero + 3 Terra cards + Senior banner mascot');
      assert.ok(freshImages.every((img) => typeof img.props.alt === 'string' && img.props.alt.length > 5));

      // Returning learner with B01 & B02 completed and S01 evaluated
      const activeState = defaultState();
      activeState.completed = ['B01', 'B02'];
      activeState.seniorCompleted = ['S01'];
      activeState.gameWins = { quiz: 4 };
      const activeTree = HomePage({ state: activeState, lessons });
      const activeText = collectVNodeText(activeTree);

      assert.match(activeText, /Continuar mi ruta/);
      assert.match(activeText, /2\/36/);
      assert.match(activeText, /1\/18/);
      assert.match(activeText, /2\/12/);
      const activeLinks = findVNodes(activeTree, (n) => n.type === 'a');
      assert.ok(
        activeLinks.some((a) => a.props.href === '#/leccion/B03'),
        'Primary CTA must resume at next incomplete lesson B03'
      );
    });
  });
});
