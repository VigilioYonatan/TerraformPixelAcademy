#!/usr/bin/env node
/**
 * Executes static IaC scanners (`tflint`, `trivy config`, `conftest`) on an isolated
 * temporary copy of `labs/senior/S18/capstone/` and `labs/senior/S13/policies/` (`F5-03`).
 * Exits 0 on PASS, 1 on scanner/policy failure, 3 on BLOCKED (scanner binary missing).
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const isWin = process.platform === 'win32';
const useLocalTools = process.argv.includes('--use-local-tools');

function resolveScanner(name, versionDir) {
  const exe = isWin ? `${name}.exe` : name;
  if (useLocalTools) {
    const localPath = join(root, '.tools', 'iac-scanners', versionDir, exe);
    if (existsSync(localPath)) return localPath;
  }
  const probe = spawnSync(exe, ['--version'], { encoding: 'utf8' });
  if (probe.status === 0) return exe;
  return null;
}

const tflint = resolveScanner('tflint', 'tflint-0.66.0');
const conftest = resolveScanner('conftest', 'conftest-0.71.1');
const trivy = resolveScanner('trivy', 'trivy-0.76.2');

if (!tflint || !conftest || !trivy) {
  const missing = [!tflint ? 'tflint' : null, !conftest ? 'conftest' : null, !trivy ? 'trivy' : null].filter(Boolean);
  console.error(`NOT_RUN / BLOCKED: Missing IaC scanner binaries (${missing.join(', ')}). Run npm run setup:scanners.`);
  process.exit(3);
}

const sandbox = mkdtempSync(join(tmpdir(), 'tp-iac-scan-'));
try {
  const capstoneCopy = join(sandbox, 'capstone');
  const s13PoliciesCopy = join(sandbox, 's13-policies');
  cpSync(join(root, 'labs', 'senior', 'S18', 'capstone'), capstoneCopy, { recursive: true });
  cpSync(join(root, 'labs', 'senior', 'S13', 'policies'), s13PoliciesCopy, { recursive: true });

  const runStep = (label, bin, args, cwd, expectExitZero = true) => {
    const res = spawnSync(bin, args, { cwd, encoding: 'utf8', timeout: 60000 });
    const passed = expectExitZero ? res.status === 0 : res.status !== 0;
    if (!passed) {
      console.error(`FAIL [${label}] (exit ${res.status}):\n${res.stdout}\n${res.stderr}`);
      process.exit(1);
    }
    console.log(`PASS [${label}]`);
  };

  // 1. TFLint static analysis on S18 multi-module capstone (root + environments + modules)
  runStep(
    'TFLint S18 capstone (--recursive)',
    tflint,
    ['--config', join(capstoneCopy, '.tflint.hcl'), '--recursive', '--no-color'],
    capstoneCopy
  );

  // 2. Trivy IaC misconfiguration scan on S18 capstone (0 HIGH/CRITICAL findings)
  runStep(
    'Trivy IaC S18 capstone (0 HIGH/CRITICAL)',
    trivy,
    ['config', '--severity', 'HIGH,CRITICAL', '--exit-code', '1', '--quiet', capstoneCopy],
    sandbox
  );

  // 3. Conftest OPA unit tests (positive + negative) for S13 exception governance policies
  runStep('Conftest OPA verify S13 policies', conftest, ['verify', '--policy', s13PoliciesCopy], sandbox);

  // 4. Conftest OPA unit tests (positive + negative) for S18 platform policies
  runStep(
    'Conftest OPA verify S18 policies',
    conftest,
    ['verify', '--policy', join(capstoneCopy, 'policies')],
    sandbox
  );

  // 5. Conftest positive fixture test (must exit 0)
  runStep(
    'Conftest test S18 compliant fixture (positive)',
    conftest,
    [
      'test',
      join(capstoneCopy, 'policies', 'fixtures', 'plan-compliant.json'),
      '--policy',
      join(capstoneCopy, 'policies')
    ],
    sandbox,
    true
  );

  // 6. Conftest negative fixture test (must fail closed with non-zero exit!)
  runStep(
    'Conftest test S18 non-compliant fixture (negative fail-closed)',
    conftest,
    [
      'test',
      join(capstoneCopy, 'policies', 'fixtures', 'plan-noncompliant.json'),
      '--policy',
      join(capstoneCopy, 'policies')
    ],
    sandbox,
    false
  );

  console.log('IAC STATIC SCANNERS PASS: TFLint + Trivy Config (0 HIGH/CRITICAL) + Conftest OPA (S13 & S18)');
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
