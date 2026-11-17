import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

describe('BDD Batch 6 — F7-01..F8-02 (Strict CSP, SHA-Pinned CI/CD, Brand/License & v2.0.0 Traceability)', () => {
  describe('Feature F7-01: Zero inline styles & strict Content-Security-Policy (style-src self)', () => {
    it('Scenario: Given all TypeScript modules in src/, server.mjs, and CM6 bundle, When scanned, Then zero inline styles exist and CSP omits unsafe-inline', () => {
      for (const file of readdirSync(join(ROOT, 'src')).filter((f) => f.endsWith('.ts'))) {
        const src = read(`src/${file}`);
        assert.doesNotMatch(
          src,
          /\bstyle\s*:|\bstyle\s*=|\.style\.|setProperty/,
          `Inline style violation found in src/${file}`
        );
      }

      const serverSrc = read('scripts/server.mjs');
      assert.match(serverSrc, /style-src 'self'/);
      assert.doesNotMatch(serverSrc, /unsafe-inline/);
      assert.doesNotMatch(serverSrc, /unsafe-eval/);

      const cm6 = read('app/vendor/codemirror6.mjs');
      assert.doesNotMatch(cm6, /![A-Za-z_$][\w$]*\.head\s*&&/);
    });
  });

  describe('Feature F7-02: SHA-pinned GitHub Actions workflows with OIDC isolation', () => {
    it('Scenario: Given all 4 workflows, When inspected, Then every action uses a 40-char SHA, Node 24, npm ci --ignore-scripts, and persist-credentials: false', () => {
      for (const wf of ['quality.yml', 'devsecops.yml', 'terraform-labs.yml', 'deploy-pages.yml']) {
        const yaml = read(`.github/workflows/${wf}`);
        const usesMatches = [...yaml.matchAll(/uses:\s*([^\s#]+)/g)].map((m) => m[1]);
        assert.ok(usesMatches.length >= 2, `${wf} must declare actions`);
        for (const target of usesMatches) {
          assert.match(target, /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/, `${wf} unpinned action: ${target}`);
        }
        assert.match(yaml, /persist-credentials:\s*false/, `${wf} missing persist-credentials: false`);
        assert.match(yaml, /node-version:\s*'24'/, `${wf} must use Node 24`);
        if (wf !== 'terraform-labs.yml') {
          assert.match(yaml, /npm ci --ignore-scripts/, `${wf} must install with npm ci --ignore-scripts`);
        }
      }

      const deploy = read('.github/workflows/deploy-pages.yml');
      assert.match(deploy, /^permissions:\s*\n\s*contents:\s*read/m);
      assert.match(deploy, /id-token:\s*write/);
    });
  });

  describe('Feature F7-03: Brand hygiene, reference PNG restriction & MIT license', () => {
    it('Scenario: Given server.mjs, uiSettings.ts, LICENSE, and BRAND_AND_LICENSE_AUDIT.md, When inspected, Then public exposure of third-party logos is blocked and MIT license is declared', () => {
      assert.equal(existsSync(join(ROOT, 'LICENSE')), true);
      assert.equal(existsSync(join(ROOT, 'docs/BRAND_AND_LICENSE_AUDIT.md')), true);
      const pkg = JSON.parse(read('package.json'));
      assert.equal(pkg.license, 'MIT');
      assert.equal(pkg.version, '2.0.0');

      const settings = read('src/uiSettings.ts');
      assert.doesNotMatch(settings, /concepto-aprobado\.png/);

      const serverSrc = read('scripts/server.mjs');
      assert.match(serverSrc, /\/assets\/reference\//);
    });
  });

  describe('Feature F8-01: v2.0.0 traceability & README architecture alignment', () => {
    it('Scenario: Given README, RELEASE_MANIFEST, TODO_LO_QUE_DEBE_TENER_ESTA_APP, and AUDITORIA_FINAL_V2_0, When checked, Then versions, MIT license, and honest NOT_RUN limits match', () => {
      for (const doc of [
        'README.md',
        'RELEASE_MANIFEST.md',
        'docs/AUDITORIA_FINAL_V2_0.md',
        'TODO_LO_QUE_DEBE_TENER_ESTA_APP.md'
      ]) {
        const text = read(doc);
        assert.match(text, /2\.0\.0/, `${doc} must reference v2.0.0`);
        assert.match(text, /NOT_RUN/, `${doc} must keep honest NOT_RUN disclosures`);
      }
    });
  });
});
