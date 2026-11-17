#!/usr/bin/env node
/**
 * Cross-platform dispatcher for the 37 local Terraform CLI checks (B01-A12 + S18).
 * Uses PowerShell natively on Windows (avoiding WSL PATH/env isolation bugs) and Bash on POSIX.
 * Preserves exact exit codes: 0 = PASS, 1 = lab FAIL, 2 = manifest error, 3 = NOT_RUN (CLI missing).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const isWin = process.platform === 'win32';
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
  env: { ...process.env, NODE_BINARY: process.execPath },
  stdio: 'inherit'
});

if (result.error) {
  console.error(`Runner invocation failed: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
