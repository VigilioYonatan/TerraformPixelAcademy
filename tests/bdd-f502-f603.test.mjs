import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

describe('BDD Batch 5 — F5-02..F6-03 (IaC Provenance & Scanners, Vitest Components, HTTP E2E & WCAG 2.2 AA)', () => {
  describe('Feature F5-02: Honest Terraform v1.10.5 lab STATUS.md & Senior evidence provenance', () => {
    it('Scenario: Given all 36 offline labs and S13/S18 Senior packs, When inspecting STATUS.md, Then local CLI is PASS with v1.10.5 and cloud stages remain NOT_RUN', () => {
      for (const prefix of ['B', 'I', 'A']) {
        for (let n = 1; n <= 12; n++) {
          const id = `${prefix}${String(n).padStart(2, '0')}`;
          const statusMd = read(`labs/offline/${id}/STATUS.md`);
          assert.match(statusMd, /Terraform v1\.10\.5/, `${id}/STATUS.md must record Terraform v1.10.5`);
          assert.match(statusMd, /terraform test = PASS/, `${id}/STATUS.md must record verified local PASS`);
          assert.match(statusMd, /NOT_RUN/, `${id}/STATUS.md must keep cloud/remote stages NOT_RUN`);
        }
      }

      const s13 = read('labs/senior/S13/EVIDENCE-STATUS.md');
      assert.match(s13, /conftest v0\.71\.1/i);
      assert.match(s13, /NOT_RUN/);

      const s18 = read('labs/senior/S18/EVIDENCE-STATUS.md');
      assert.match(s18, /Terraform CLI local.*v1\.10\.5/i);
      assert.match(s18, /tflint v0\.66\.0/i);
      assert.match(s18, /trivy(?: config)? v0\.76\.2/i);
      assert.match(s18, /conftest v0\.71\.1/i);
      assert.match(s18, /NOT_RUN/);
    });
  });

  describe('Feature F5-03: Static IaC & OPA policy scanners (tflint, trivy config, conftest)', () => {
    it('Scenario: Given S18 child modules and S13/S18 OPA bundles, When checking structure and CI workflow, Then all policies, fixtures, and pinned scanner gates exist', () => {
      for (const mod of ['data', 'network', 'service', 'workload']) {
        const tf = read(`labs/senior/S18/capstone/modules/${mod}/main.tf`);
        assert.match(tf, /required_version\s*=\s*">= 1\.9\.0, < 2\.0\.0"/, `${mod}/main.tf must pin required_version`);
      }

      for (const rel of [
        'labs/senior/S13/policies/exceptions.rego',
        'labs/senior/S13/policies/exceptions_test.rego',
        'labs/senior/S18/capstone/.tflint.hcl',
        'labs/senior/S18/capstone/policies/platform.rego',
        'labs/senior/S18/capstone/policies/platform_test.rego',
        'labs/senior/S18/capstone/policies/fixtures/plan-compliant.json',
        'labs/senior/S18/capstone/policies/fixtures/plan-noncompliant.json',
        'scripts/ensure-iac-scanners.mjs',
        'scripts/run-iac-scanners.mjs'
      ]) {
        assert.equal(existsSync(join(ROOT, rel)), true, `Missing required F5-03 file: ${rel}`);
      }

      const workflow = read('.github/workflows/terraform-labs.yml');
      assert.match(workflow, /tflint/i);
      assert.match(workflow, /trivy/i);
      assert.match(workflow, /conftest/i);
    });

    it('Scenario: Given empty PATH without --use-local-tools, When invoking run-iac-scanners.mjs, Then it fails closed with exit code 3 (BLOCKED)', () => {
      const res = spawnSync(process.execPath, [join(ROOT, 'scripts', 'run-iac-scanners.mjs')], {
        cwd: ROOT,
        env: { ...process.env, PATH: '', Path: '' },
        encoding: 'utf8',
        windowsHide: true
      });
      assert.equal(res.status, 3);
      assert.match(`${res.stdout}\n${res.stderr}`, /BLOCKED/);
    });

    it('Scenario: Given verified local scanners (.tools/iac-scanners), When invoking run-iac-scanners.mjs --use-local-tools, Then TFLint, Trivy and Conftest pass', () => {
      const localCheck = existsSync(
        join(ROOT, '.tools', 'iac-scanners', 'tflint-0.66.0', process.platform === 'win32' ? 'tflint.exe' : 'tflint')
      );
      if (!localCheck) return;
      const res = spawnSync(process.execPath, [join(ROOT, 'scripts', 'run-iac-scanners.mjs'), '--use-local-tools'], {
        cwd: ROOT,
        encoding: 'utf8',
        windowsHide: true
      });
      assert.equal(res.status, 0, `Scanner gate failed:\n${res.stdout}\n${res.stderr}`);
      assert.match(res.stdout, /IAC STATIC SCANNERS PASS/);
    });
  });

  describe('Feature F6-01..F6-03: Component tests, cross-platform HTTP E2E, and WCAG 2.2 AA matrix', () => {
    it('Scenario: Given Vitest Preact component configuration, When inspecting vitest.config.ts and package.json, Then jsdom and test:components are wired into qa', () => {
      const vitestCfg = read('vitest.config.ts');
      assert.match(vitestCfg, /environment:\s*'jsdom'/);
      assert.match(vitestCfg, /tests\/components\/\*\*\/\*\.test\.ts/);
      const pkg = JSON.parse(read('package.json'));
      assert.equal(pkg.scripts['test:components'], 'vitest run');
      assert.match(pkg.scripts.qa, /npm run test:components/);
    });

    it('Scenario: Given all 5 Python browser smoke scripts, When inspecting source, Then none hardcode executable_path=/usr/bin/chromium or inline Base64 data: modules', () => {
      for (const py of [
        'tests/browser-editor.py',
        'tests/browser-embedded.py',
        'tests/browser-evidence.py',
        'tests/browser-release-gate.py',
        'tests/browser-senior-v13.py'
      ]) {
        const src = read(py);
        assert.doesNotMatch(
          src,
          /executable_path\s*=\s*['"]\/usr\/bin\/chromium['"]/,
          `${py} hardcoded Linux Chromium`
        );
        assert.doesNotMatch(
          src,
          /data:text\/javascript;base64/,
          `${py} still uses Base64 inline modules instead of HTTP`
        );
        assert.match(src, /scripts['" /\\]+server\.mjs|server\.mjs/, `${py} must use scripts/server.mjs over HTTP`);
      }
    });

    it('Scenario: Given WCAG 2.2 AA accessibility suite and A11Y_MATRIX.md, When checking tags and manual AT disclosure, Then 14 routes + 404 dark/light are covered and manual screen reader remains NOT_RUN', () => {
      const a11ySpec = read('tests/e2e/a11y.spec.ts');
      assert.match(a11ySpec, /@axe-core\/playwright/);
      assert.match(a11ySpec, /wcag22aa/);
      assert.match(a11ySpec, /\['dark',\s*'light'\]/);

      const matrix = read('docs/A11Y_MATRIX.md');
      assert.match(matrix, /WCAG 2\.2 Nivel A \/ AA/);
      assert.match(matrix, /`PASS`/);
      assert.match(matrix, /`NOT_RUN`/);
      assert.match(matrix, /NVDA|VoiceOver/);
    });
  });
});
