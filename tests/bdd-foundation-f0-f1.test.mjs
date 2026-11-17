import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp, mkdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const readText = (rel) => readFile(join(root, rel), 'utf8');
const fileExists = async (rel) => {
  try {
    return (await stat(join(root, rel))).isFile();
  } catch {
    return false;
  }
};

describe('BDD Suite F0-F1: Repository Governance, AGENTS.md, Lockfile Supply-Chain & Dual Vite/Offline Build', () => {
  describe('Feature F0-01: Git Repository & Workspace Boundaries', () => {
    it('Given the repository workspace, When checking Git metadata and .gitignore, Then main branch, baseline history, and artifact exclusions are enforced', async () => {
      const topLevel = spawnSync('git', ['rev-parse', '--show-toplevel'], {cwd: root, encoding: 'utf8'});
      assert.equal(topLevel.status, 0, topLevel.stderr);
      assert.equal(resolve(topLevel.stdout.trim()).toLowerCase(), resolve(root).toLowerCase(), 'Git root must be TerraPixel-Academy itself, not a parent folder');

      const logCheck = spawnSync('git', ['log', '--oneline', '-n', '1'], {cwd: root, encoding: 'utf8'});
      assert.equal(logCheck.status, 0);
      assert.ok(logCheck.stdout.trim().length > 7, 'At least one baseline commit must exist');

      const gitignore = await readText('.gitignore');
      for (const requiredRule of [
        'node_modules/',
        'dist/',
        '.vite/',
        'terraform-verification-results/',
        '*.tfstate',
        '!*.tfvars.example',
        '!.env.example'
      ]) {
        assert.ok(gitignore.includes(requiredRule), `.gitignore missing rule: ${requiredRule}`);
      }
    });

    it('Given release-audit.py and verify-release.py, When local .git and node_modules exist, Then IGNORED_ROOTS isolates transient directories', async () => {
      const releaseAudit = await readText('scripts/release-audit.py');
      const verifyRelease = await readText('scripts/verify-release.py');
      for (const ignored of ['.git', 'node_modules', 'terraform-verification-results']) {
        assert.ok(releaseAudit.includes(ignored), `release-audit.py must ignore ${ignored}`);
        assert.ok(verifyRelease.includes(ignored), `verify-release.py must ignore ${ignored}`);
      }
    });
  });

  describe('Feature F0-02: AGENTS.md Consumer Governance Contract', () => {
    it('Given AGENTS.md at project root, When inspected, Then it binds Auto-Senior, No-Shortcuts, evidence states, and baseline preservation', async () => {
      assert.equal(await fileExists('AGENTS.md'), true, 'AGENTS.md must exist at root');
      const agentsDoc = await readText('AGENTS.md');
      for (const token of [
        'TODO_LO_QUE_DEBE_TENER_ESTA_APP.md',
        'LO_QUE_FALTA_PARA_100_PORCIENTO.md',
        'vigilio-auto-senior',
        'complete-work-no-shortcuts',
        'PASS',
        'FAIL',
        'NOT_RUN',
        'BLOCKED',
        'BASELINE_V1_4_FILES.txt',
        'BASELINE_V1_5_1_FILES.txt',
        'npm run build:vite'
      ]) {
        assert.ok(agentsDoc.includes(token), `AGENTS.md missing mandatory token: ${token}`);
      }
    });
  });

  describe('Feature F1-01: Deterministic Lockfile & Supply-Chain Hardening', () => {
    it('Given .npmrc, package.json, and package-lock.json, When audited, Then exact versions and SHA-512 integrity hashes are enforced', async () => {
      assert.equal(await fileExists('.npmrc'), true, '.npmrc must exist');
      const npmrc = await readText('.npmrc');
      assert.match(npmrc, /engine-strict=true/);
      assert.match(npmrc, /save-exact=true/);
      assert.match(npmrc, /audit-level=high/);

      const pkg = JSON.parse(await readText('package.json'));
      for (const [depName, depVersion] of Object.entries(pkg.devDependencies || {})) {
        assert.doesNotMatch(String(depVersion), /^[\^~><*]/, `Dependency ${depName} must be pinned to exact version, got ${depVersion}`);
      }

      const vendoredTsPkg = JSON.parse(await readText('tools/typescript/package.json'));
      assert.equal(pkg.devDependencies.typescript, vendoredTsPkg.version, 'Pinned TypeScript must match vendored offline compiler');

      assert.equal(await fileExists('package-lock.json'), true, 'package-lock.json must be committed and real');
      const lock = JSON.parse(await readText('package-lock.json'));
      assert.equal(lock.lockfileVersion, 3);
      assert.ok(lock.packages && Object.keys(lock.packages).length >= 4, 'package-lock.json must contain resolved dependency graph');

      for (const requiredPkg of ['node_modules/vite', 'node_modules/@biomejs/biome', 'node_modules/typescript']) {
        const entry = lock.packages[requiredPkg];
        assert.ok(entry, `Missing ${requiredPkg} in package-lock.json`);
        assert.match(entry.integrity || '', /^sha512-/, `${requiredPkg} must carry sha512 integrity hash`);
      }
    });
  });

  describe('Feature F1-02: Unified Vite Production Bundle, Bundle Budget Gate & Offline Coexistence', () => {
    it('Given check-bundle-budget.mjs, When tested against negative fixtures (missing manifest, VITE_ secret leak, external script, oversized JS), Then it fails closed', async () => {
      const budgetScript = join(root, 'scripts', 'check-bundle-budget.mjs');
      const tempRoot = await mkdtemp(join(tmpdir(), 'tp-budget-neg-'));
      try {
        // Case 1: Missing .vite/manifest.json
        const emptyDist = join(tempRoot, 'empty-dist');
        await mkdir(emptyDist, {recursive: true});
        const missingRun = spawnSync(process.execPath, [budgetScript], {
          cwd: root,
          env: {...process.env, DIST_DIR: emptyDist},
          encoding: 'utf8'
        });
        assert.notEqual(missingRun.status, 0);
        assert.match(missingRun.stderr, /manifest\.json/);

        // Helper to scaffold minimal valid fixture before injecting specific faults
        const createFixtureDist = async (name, {jsContent = 'console.log("ok");', htmlContent = '<script type="module" src="./assets/index-abc.js"></script>'} = {}) => {
          const dir = join(tempRoot, name);
          await mkdir(join(dir, '.vite'), {recursive: true});
          await mkdir(join(dir, 'assets', 'terra'), {recursive: true});
          await mkdir(join(dir, 'assets', 'labs'), {recursive: true});
          await mkdir(join(dir, 'assets', 'senior'), {recursive: true});
          await mkdir(join(dir, 'assets', 'vendor', 'codemirror5'), {recursive: true});
          await mkdir(join(dir, 'docs'), {recursive: true});
          await writeFile(
            join(dir, '.vite', 'manifest.json'),
            JSON.stringify({'index.html': {file: 'assets/index-abc.js', src: 'index.html', isEntry: true, css: ['assets/style.css']}}),
            'utf8'
          );
          await writeFile(join(dir, 'assets', 'index-abc.js'), jsContent, 'utf8');
          await writeFile(join(dir, 'assets', 'style.css'), 'body{margin:0}', 'utf8');
          await writeFile(join(dir, 'index.html'), htmlContent, 'utf8');
          await writeFile(join(dir, 'assets/terra/hola.png'), 'png', 'utf8');
          await writeFile(join(dir, 'assets/labs/B04.zip'), 'zip', 'utf8');
          await writeFile(join(dir, 'assets/senior/S18.zip'), 'zip', 'utf8');
          await writeFile(join(dir, 'assets/vendor/codemirror5/codemirror.js'), 'cm', 'utf8');
          await writeFile(join(dir, 'docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md'), '# spec', 'utf8');
          return dir;
        };

        // Case 2: Leaked VITE_* secret in bundle
        const secretDist = await createFixtureDist('secret-dist', {
          jsContent: 'const x = "VITE_DATABASE_PASSWORD=supersecret";'
        });
        const secretRun = spawnSync(process.execPath, [budgetScript], {
          cwd: root,
          env: {...process.env, DIST_DIR: secretDist},
          encoding: 'utf8'
        });
        assert.notEqual(secretRun.status, 0);
        assert.match(secretRun.stderr, /VITE_\*/);

        // Case 3: External remote script in dist/index.html
        const remoteDist = await createFixtureDist('remote-dist', {
          htmlContent: '<script src="https://cdn.example.com/evil.js"></script><script type="module" src="./assets/index-abc.js"></script>'
        });
        const remoteRun = spawnSync(process.execPath, [budgetScript], {
          cwd: root,
          env: {...process.env, DIST_DIR: remoteDist},
          encoding: 'utf8'
        });
        assert.notEqual(remoteRun.status, 0);
        assert.match(remoteRun.stderr, /Script externo remoto/);

        // Case 4: Oversized JS bundle (>350 KB raw)
        const hugeDist = await createFixtureDist('huge-dist', {
          jsContent: 'x'.repeat(360_000)
        });
        const hugeRun = spawnSync(process.execPath, [budgetScript], {
          cwd: root,
          env: {...process.env, DIST_DIR: hugeDist},
          encoding: 'utf8'
        });
        assert.notEqual(hugeRun.status, 0);
        assert.match(hugeRun.stderr, /supera presupuesto/);
      } finally {
        await rm(tempRoot, {recursive: true, force: true});
      }
    });

    it('Given Vite installed in node_modules, When running the build:vite pipeline and serving dist/ via HTTP, Then hashed bundle, static ZIPs, sprites, and baseline preservation all pass', async () => {
      const pkg = JSON.parse(await readText('package.json'));
      assert.equal(
        pkg.scripts['build:vite'],
        'node tools/typescript/bin/tsc -p tsconfig.json && vite build && node scripts/copy-static.mjs && node scripts/check-bundle-budget.mjs'
      );

      // Execute each step of build:vite via process.execPath (shell: false, zero DEP0190 risk)
      const pipelineSteps = [
        [join(root, 'tools', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.json'],
        [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'],
        [join(root, 'scripts', 'copy-static.mjs')],
        [join(root, 'scripts', 'check-bundle-budget.mjs')]
      ];
      let budgetOutput = '';
      for (const stepArgs of pipelineSteps) {
        const stepRun = spawnSync(process.execPath, stepArgs, {
          cwd: root,
          encoding: 'utf8',
          timeout: 60000
        });
        assert.equal(stepRun.status, 0, stepRun.stderr || stepRun.stdout);
        budgetOutput += stepRun.stdout;
      }
      assert.match(budgetOutput, /BUNDLE BUDGET PASS/);

      // Baseline preservation must still pass 100% after Vite build!
      const preserveRun = spawnSync(process.execPath, [join(root, 'scripts', 'verify-preservation.mjs')], {
        cwd: root,
        encoding: 'utf8'
      });
      assert.equal(preserveRun.status, 0, preserveRun.stderr || preserveRun.stdout);

      // Serve built dist/ over real local HTTP server and verify hashed chunks + static assets
      const manifest = JSON.parse(await readText('dist/.vite/manifest.json'));
      const entry = Object.values(manifest).find((m) => m && m.isEntry);
      assert.ok(entry && typeof entry.file === 'string', 'Vite manifest must expose entry JS chunk');

      const distRoot = join(root, 'dist');
      const mimeMap = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.zip': 'application/zip'};
      const srv = createServer(async (req, res) => {
        try {
          const urlPath = (req.url || '/').split('?')[0];
          const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
          const target = resolve(distRoot, rel);
          if (!target.startsWith(distRoot)) {
            res.writeHead(403);
            res.end();
            return;
          }
          const data = await readFile(target);
          res.writeHead(200, {'Content-Type': mimeMap[extname(target)] || 'application/octet-stream'});
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end();
        }
      });

      await new Promise((resolveListen) => srv.listen(0, '127.0.0.1', resolveListen));
      const address = srv.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      try {
        for (const route of ['/', `/${entry.file}`, '/assets/terra/hola.png', '/assets/labs/B04.zip', '/assets/senior/S18.zip', '/app/main.js']) {
          const res = await fetch(`http://127.0.0.1:${port}${route}`);
          assert.equal(res.status, 200, `Expected 200 from built dist/ for ${route}`);
          assert.ok((await res.arrayBuffer()).byteLength > 50, `Empty payload for ${route}`);
        }
      } finally {
        await new Promise((resolveClose) => srv.close(resolveClose));
      }
    });
  });
});
