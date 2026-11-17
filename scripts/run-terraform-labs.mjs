#!/usr/bin/env node
/**
 * Cross-platform dispatcher for the 37 local Terraform CLI checks (B01-A12 + S18).
 * Uses PowerShell natively on Windows (avoiding WSL PATH/env isolation bugs) and Bash on POSIX.
 * Preserves exact exit codes: 0 = PASS, 1 = lab FAIL, 2 = manifest error, 3 = NOT_RUN (CLI missing).
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const isWin = process.platform === 'win32';
const useLocalTools = process.argv.includes('--use-local-tools');
const localTerraformDir = join(root, '.tools', 'terraform', '1.10.5');
const localTerraformBin = join(localTerraformDir, isWin ? 'terraform.exe' : 'terraform');

const childEnv = { ...process.env, NODE_BINARY: process.execPath };
if (useLocalTools && existsSync(localTerraformBin)) {
  const existingPath = childEnv.PATH || childEnv.Path || '';
  const mergedPath = `${localTerraformDir}${delimiter}${existingPath}`;
  childEnv.PATH = mergedPath;
  if (isWin) {
    childEnv.Path = mergedPath;
  }
}

const command = isWin ? 'powershell.exe' : 'bash';
const args = isWin
  ? [
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      join(root, 'scripts', 'verify-terraform-labs.ps1')
    ]
  : [join(root, 'scripts', 'verify-terraform-labs.sh')];

const result = spawnSync(command, args, {
  cwd: root,
  env: childEnv,
  stdio: 'inherit'
});

if (result.error) {
  console.error(`Runner invocation failed: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
