#!/usr/bin/env node
/**
 * Ensures pinned `actionlint` v1.7.12 (SHA-256 verified) in `.tools/actionlint/1.7.12/`
 * and executes it across `.github/workflows/*.yml`. Fails closed on network/hash/lint errors.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VERSION = '1.7.12';
const TOOL_DIR = join(ROOT, '.tools', 'actionlint', VERSION);
const BIN_NAME = process.platform === 'win32' ? 'actionlint.exe' : 'actionlint';
const BIN_PATH = join(TOOL_DIR, BIN_NAME);

const ARTIFACTS = {
  'win32-x64': {
    file: `actionlint_${VERSION}_windows_amd64.zip`,
    sha256: '6e7241b51e6817ea6a047693d8e6fed13b31819c9a0dd6c5a726e1592d22f6e9'
  },
  'win32-arm64': {
    file: `actionlint_${VERSION}_windows_arm64.zip`,
    sha256: 'cadcf7ea4efe3a68728893813643cebe1185e5b1d4be5b96245f65c9a4d5ea41'
  },
  'linux-x64': {
    file: `actionlint_${VERSION}_linux_amd64.tar.gz`,
    sha256: '8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8'
  },
  'linux-arm64': {
    file: `actionlint_${VERSION}_linux_arm64.tar.gz`,
    sha256: '325e971b6ba9bfa504672e29be93c24981eeb1c07576d730e9f7c8805afff0c6'
  },
  'darwin-x64': {
    file: `actionlint_${VERSION}_darwin_amd64.tar.gz`,
    sha256: '5b44c3bc2255115c9b69e30efc0fecdf498fdb63c5d58e17084fd5f16324c644'
  },
  'darwin-arm64': {
    file: `actionlint_${VERSION}_darwin_arm64.tar.gz`,
    sha256: 'aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f'
  }
};

async function ensureBinary() {
  if (existsSync(BIN_PATH)) return BIN_PATH;
  const key = `${process.platform}-${process.arch}`;
  const spec = ARTIFACTS[key];
  if (!spec) {
    console.error(`BLOCKED: unsupported platform ${key} for actionlint.`);
    process.exit(3);
  }
  const url = `https://github.com/rhysd/actionlint/releases/download/v${VERSION}/${spec.file}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`BLOCKED: failed downloading actionlint (${res.status}).`);
    process.exit(3);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const actual = createHash('sha256').update(buf).digest('hex');
  if (actual !== spec.sha256) {
    console.error(`FAIL: SHA-256 mismatch for ${spec.file} (${actual} !== ${spec.sha256}).`);
    process.exit(1);
  }
  await mkdir(TOOL_DIR, { recursive: true });
  const archivePath = join(TOOL_DIR, spec.file);
  await writeFile(archivePath, buf);
  if (spec.file.endsWith('.zip')) {
    const unzip = spawnSync(
      'powershell',
      ['-NoProfile', '-Command', `Expand-Archive -Path '${archivePath}' -DestinationPath '${TOOL_DIR}' -Force`],
      { stdio: 'inherit', windowsHide: true }
    );
    if (unzip.status !== 0) process.exit(unzip.status ?? 1);
  } else {
    const untar = spawnSync('tar', ['-xzf', archivePath, '-C', TOOL_DIR], { stdio: 'inherit' });
    if (untar.status !== 0) process.exit(untar.status ?? 1);
  }
  await rm(archivePath, { force: true });
  if (!existsSync(BIN_PATH)) {
    console.error(`FAIL: actionlint binary missing after extraction at ${BIN_PATH}`);
    process.exit(1);
  }
  return BIN_PATH;
}

const bin = await ensureBinary();
const lint = spawnSync(bin, ['-color'], {
  cwd: ROOT,
  stdio: 'inherit',
  windowsHide: true
});
if (lint.status !== 0) process.exit(lint.status ?? 1);
console.log(`ACTIONLINT PASS: v${VERSION} verified all .github/workflows/*.yml with 0 errors.`);
