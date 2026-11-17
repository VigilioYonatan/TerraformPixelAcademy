#!/usr/bin/env node
/**
 * Cross-platform Python 3 launcher for npm scripts on Windows (`python` / `py -3`)
 * and POSIX (`python3` / `python`). Rejects the Windows Store `WindowsApps/python3` stub.
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/run-python.mjs <script.py> [args...]');
  process.exit(2);
}

const candidates =
  process.platform === 'win32'
    ? [
        ['python', []],
        ['py', ['-3']],
        ['python3', []]
      ]
    : [
        ['python3', []],
        ['python', []]
      ];

let selected = null;
for (const [cmd, prefix] of candidates) {
  const probe = spawnSync(cmd, [...prefix, '-c', 'import sys; assert sys.version_info >= (3, 10)'], {
    stdio: 'ignore',
    windowsHide: true
  });
  if (probe.status === 0 && !probe.error) {
    selected = [cmd, prefix];
    break;
  }
}

if (!selected) {
  console.error('BLOCKED: Python >= 3.10 interpreter not found on PATH.');
  process.exit(3);
}

const [cmd, prefix] = selected;
const res = spawnSync(cmd, [...prefix, ...args], {
  stdio: 'inherit',
  windowsHide: true
});

if (res.error) {
  console.error(`ERROR: Failed executing ${cmd}: ${res.error.message}`);
  process.exit(1);
}
process.exit(res.status ?? 1);
