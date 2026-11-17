import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp, writeFile, chmod, readFile, readdir, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {delimiter, dirname, join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseCliManifest, cliStats} from '../app/cliEvidence.js';

const project = fileURLToPath(new URL('../', import.meta.url));
const runnerScript = join(project, 'scripts', 'run-terraform-labs.mjs');
const isWin = process.platform === 'win32';
const digest = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
const pathExists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

function buildIsolatedPath(stubDir) {
  if (isWin) {
    const sysRoot = process.env.SystemRoot || 'C:\\Windows';
    return [
      stubDir,
      join(sysRoot, 'System32'),
      join(sysRoot, 'System32', 'WindowsPowerShell', 'v1.0')
    ].join(delimiter);
  }
  return [stubDir, '/usr/bin', '/bin'].join(delimiter);
}

async function createTerraformStub(dir, {failFmtForFolder = ''} = {}) {
  if (isWin) {
    const cmdPath = join(dir, 'terraform.cmd');
    const body = [
      '@echo off',
      'if "%~1"=="version" (',
      '  echo TEST STUB - NOT REAL TERRAFORM v1.10.5',
      '  exit /b 0',
      ')',
      'if not "%TF_IN_AUTOMATION%"=="1" (',
      '  echo MISSING_TF_IN_AUTOMATION',
      '  exit /b 9',
      ')',
      failFmtForFolder
        ? `if "%~1"=="fmt" if "%~2"=="-check" ( echo %CD% | findstr /I "${failFmtForFolder}" >nul && exit /b 3 )`
        : 'rem all fmt checks pass',
      'echo %~1>> "runner-stub-invocations.txt"',
      'exit /b 0'
    ].join('\r\n');
    await writeFile(cmdPath, body, 'utf8');
    return cmdPath;
  }
  const shPath = join(dir, 'terraform');
  const body = [
    '#!/bin/sh',
    'if [ "$1" = "version" ]; then echo "TEST STUB - NOT REAL TERRAFORM v1.10.5"; exit 0; fi',
    'if [ "${TF_IN_AUTOMATION:-}" != "1" ]; then echo "MISSING_TF_IN_AUTOMATION"; exit 9; fi',
    failFmtForFolder
      ? `if [ "$1" = "fmt" ] && [ "$2" = "-check" ] && grep -q '${failFmtForFolder}' main.tf 2>/dev/null; then exit 3; fi`
      : '# all fmt checks pass',
    'printf "%s\\n" "$1" >> "runner-stub-invocations.txt"',
    'exit 0'
  ].join('\n');
  await writeFile(shPath, body, 'utf8');
  await chmod(shPath, 0o755);
  return shPath;
}

describe('BDD Feature: Cross-platform Terraform CLI Runner Isolation & Evidence Integrity', () => {
  it('Given an isolated Terraform stub and custom REPORT_DIR, When all 37 labs execute, Then sources stay untouched, root stays clean, and 37 SHA-256 manifest entries pass', async () => {
    const temp = await mkdtemp(join(tmpdir(), 'terra-runner-bdd-pass-'));
    const evidenceDir = join(temp, 'evidence');
    const sampleB04 = join(project, 'labs/offline/B04/main.tf');
    const sampleS18 = join(project, 'labs/senior/S18/capstone/main.tf');
    const originalB04Hash = await digest(sampleB04);
    const originalS18Hash = await digest(sampleS18);
    const rootPollutionDir = join(project, 'terraform-verification-results');

    try {
      await createTerraformStub(temp);
      const run = spawnSync(process.execPath, [runnerScript], {
        cwd: project,
        env: {
          ...process.env,
          PATH: `${temp}${delimiter}${dirname(process.execPath)}${delimiter}${process.env.PATH || ''}`,
          Path: `${temp}${delimiter}${dirname(process.execPath)}${delimiter}${process.env.Path || process.env.PATH || ''}`,
          REPORT_DIR: evidenceDir
        },
        encoding: 'utf8',
        timeout: 90000
      });

      assert.equal(run.status, 0, run.stderr || run.stdout);
      assert.match(run.stdout, /Finished: PASS=37 FAIL=0 \(expected 37\)/);

      const summary = await readFile(join(evidenceDir, 'SUMMARY.txt'), 'utf8');
      assert.equal(summary.split(/\r?\n/).filter((line) => /^([BIA]\d\d|S18) \| PASS \|/.test(line)).length, 37);

      const rawManifest = JSON.parse(await readFile(join(evidenceDir, 'CLI-EVIDENCE-MANIFEST.json'), 'utf8'));
      const parsed = parseCliManifest(rawManifest);
      assert.deepEqual(cliStats(parsed), {total: 37, pass: 37, fail: 0, notRun: 0, missing: 0});

      assert.equal(await digest(sampleB04), originalB04Hash, 'runner must not edit original B04 main.tf');
      assert.equal(await digest(sampleS18), originalS18Hash, 'runner must not edit original S18 main.tf');
      assert.ok(!(await readdir(join(project, 'labs/offline/B04'))).includes('runner-stub-invocations.txt'));
      assert.equal(await pathExists(rootPollutionDir), false, 'custom REPORT_DIR must never pollute repo root');
    } finally {
      await rm(temp, {recursive: true, force: true});
    }
  });

  it('Given an environment without Terraform CLI in PATH, When the runner is invoked, Then it fails closed with exit code 3 and NOT_RUN', async () => {
    const emptyBinDir = await mkdtemp(join(tmpdir(), 'terra-runner-bdd-missing-'));
    const evidenceDir = join(emptyBinDir, 'evidence');
    try {
      const cleanEnv = {...process.env, REPORT_DIR: evidenceDir};
      const minimalPath = buildIsolatedPath(emptyBinDir);
      cleanEnv.PATH = minimalPath;
      cleanEnv.Path = minimalPath;

      const run = spawnSync(process.execPath, [runnerScript], {
        cwd: project,
        env: cleanEnv,
        encoding: 'utf8',
        timeout: 30000
      });

      assert.equal(run.status, 3, `Expected exit code 3 for missing CLI, got ${run.status}: ${run.stderr || run.stdout}`);
      assert.match(run.stderr, /NOT_RUN/);
      assert.equal(await pathExists(join(evidenceDir, 'CLI-EVIDENCE-MANIFEST.json')), false);
    } finally {
      await rm(emptyBinDir, {recursive: true, force: true});
    }
  });

  it('Given a lab failing terraform fmt -check, When the runner executes, Then it exits with code 1 and records FAIL in the manifest without mutating sources', async () => {
    const temp = await mkdtemp(join(tmpdir(), 'terra-runner-bdd-fail-'));
    const evidenceDir = join(temp, 'evidence');
    const sampleB04 = join(project, 'labs/offline/B04/main.tf');
    const originalB04Hash = await digest(sampleB04);

    try {
      // Trigger failure when B04's unique string "Hola, Terraform" is formatted/checked in the sandbox copy
      if (isWin) {
        await writeFile(
          join(temp, 'terraform.cmd'),
          [
            '@echo off',
            'if "%~1"=="version" ( echo TEST STUB v1.10.5 & exit /b 0 )',
            'if "%~1"=="fmt" if "%~2"=="-check" ( findstr /C:"Hola, Terraform" main.tf >nul 2>&1 && exit /b 3 )',
            'exit /b 0'
          ].join('\r\n'),
          'utf8'
        );
      } else {
        const shPath = join(temp, 'terraform');
        await writeFile(
          shPath,
          [
            '#!/bin/sh',
            'if [ "$1" = "version" ]; then echo "TEST STUB v1.10.5"; exit 0; fi',
            'if [ "$1" = "fmt" ] && [ "$2" = "-check" ] && grep -q "Hola, Terraform" main.tf 2>/dev/null; then exit 3; fi',
            'exit 0'
          ].join('\n'),
          'utf8'
        );
        await chmod(shPath, 0o755);
      }

      const run = spawnSync(process.execPath, [runnerScript], {
        cwd: project,
        env: {
          ...process.env,
          PATH: `${temp}${delimiter}${dirname(process.execPath)}${delimiter}${process.env.PATH || ''}`,
          Path: `${temp}${delimiter}${dirname(process.execPath)}${delimiter}${process.env.Path || process.env.PATH || ''}`,
          REPORT_DIR: evidenceDir
        },
        encoding: 'utf8',
        timeout: 90000
      });

      assert.equal(run.status, 1, `Expected exit code 1 on lab failure, got ${run.status}`);
      assert.match(run.stdout, /Finished: PASS=36 FAIL=1 \(expected 37\)/);

      const rawManifest = JSON.parse(await readFile(join(evidenceDir, 'CLI-EVIDENCE-MANIFEST.json'), 'utf8'));
      const parsed = parseCliManifest(rawManifest);
      const b04Entry = parsed.results.find((r) => r.id === 'B04');
      assert.equal(b04Entry?.status, 'FAIL');
      assert.deepEqual(cliStats(parsed), {total: 37, pass: 36, fail: 1, notRun: 0, missing: 0});
      assert.equal(await digest(sampleB04), originalB04Hash);
    } finally {
      await rm(temp, {recursive: true, force: true});
    }
  });
});
