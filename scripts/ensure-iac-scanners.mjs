#!/usr/bin/env node
/**
 * Supply-chain-verified local installer for pinned static IaC scanners (`F5-03`):
 * - TFLint `v0.66.0`
 * - Conftest (OPA) `v0.71.1`
 * - Trivy `v0.76.2`
 * Downloads into `.tools/iac-scanners/` (gitignored & isolated from baseline paths)
 * and enforces pinned SHA-256 digests before extraction.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const isWin = process.platform === 'win32';
const baseDir = join(root, '.tools', 'iac-scanners');

const TOOLS = {
  tflint: {
    version: '0.66.0',
    bin: isWin ? 'tflint.exe' : 'tflint',
    versionArg: '--version',
    expectedText: '0.66.0',
    url: isWin
      ? 'https://github.com/terraform-linters/tflint/releases/download/v0.66.0/tflint_windows_amd64.zip'
      : 'https://github.com/terraform-linters/tflint/releases/download/v0.66.0/tflint_linux_amd64.zip',
    archive: isWin ? 'tflint_windows_amd64.zip' : 'tflint_linux_amd64.zip',
    sha256: isWin
      ? 'e3acd1d89c735ce6e09108c9277f26076ebeb385c1f77a73c1cbf1826ed626a7'
      : '22be11cadc25cd02401e94c0ccc91aa63467debb8485c2a755d98f4c0a9d1e2e'
  },
  conftest: {
    version: '0.71.1',
    bin: isWin ? 'conftest.exe' : 'conftest',
    versionArg: '--version',
    expectedText: '0.71.1',
    url: isWin
      ? 'https://github.com/open-policy-agent/conftest/releases/download/v0.71.1/conftest_0.71.1_Windows_x86_64.zip'
      : 'https://github.com/open-policy-agent/conftest/releases/download/v0.71.1/conftest_0.71.1_Linux_x86_64.tar.gz',
    archive: isWin ? 'conftest_0.71.1_Windows_x86_64.zip' : 'conftest_0.71.1_Linux_x86_64.tar.gz',
    sha256: isWin
      ? '34d623334b5e7ed4465bf62a4cb3b092684859cd3d224bbd390925a0852b922a'
      : 'c3f6b2a753bd56e377a1e51a95ae3e057f926f2e9139f7d5b5dfbbaf810f7985'
  },
  trivy: {
    version: '0.76.2',
    bin: isWin ? 'trivy.exe' : 'trivy',
    versionArg: '--version',
    expectedText: '0.76.2',
    url: isWin
      ? 'https://github.com/aquasecurity/trivy/releases/download/v0.76.2/trivy_0.76.2_windows-64bit.zip'
      : 'https://github.com/aquasecurity/trivy/releases/download/v0.76.2/trivy_0.76.2_Linux-64bit.tar.gz',
    archive: isWin ? 'trivy_0.76.2_windows-64bit.zip' : 'trivy_0.76.2_Linux-64bit.tar.gz',
    sha256: isWin
      ? '691f737a7e5566a673c3a74dab9160552ec32101e953b659e5c77443d16dddb6'
      : 'bc0fc726e017b8927a62b2d3531d7a84ee01769daf5c99ed866dced54089fdbf'
  }
};

function verifyInstalled(binPath, versionArg, expectedText) {
  if (!existsSync(binPath)) return false;
  const res = spawnSync(binPath, [versionArg], { encoding: 'utf8' });
  return res.status === 0 && `${res.stdout}${res.stderr}`.includes(expectedText);
}

async function ensureTool(name, spec) {
  const dir = join(baseDir, `${name}-${spec.version}`);
  const binPath = join(dir, spec.bin);
  if (verifyInstalled(binPath, spec.versionArg, spec.expectedText)) {
    console.log(`SCANNER READY: ${name}@${spec.version} (${binPath})`);
    return;
  }

  if (process.arch !== 'x64') {
    throw new Error(`Pinned SHA-256 for ${name} is configured for x64; detected ${process.arch}`);
  }

  console.log(`Downloading ${name}@${spec.version} from ${spec.url}...`);
  const response = await fetch(spec.url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} downloading ${spec.url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const actualSha256 = createHash('sha256').update(bytes).digest('hex');
  if (actualSha256 !== spec.sha256) {
    throw new Error(`SHA-256 mismatch for ${spec.archive}: expected ${spec.sha256}, got ${actualSha256}`);
  }

  mkdirSync(dir, { recursive: true });
  const archivePath = join(dir, spec.archive);
  writeFileSync(archivePath, bytes);
  try {
    if (spec.archive.endsWith('.zip')) {
      if (isWin) {
        execFileSync(
          'powershell.exe',
          [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            `Expand-Archive -LiteralPath '${archivePath.replace(/'/g, "''")}' -DestinationPath '${dir.replace(/'/g, "''")}' -Force`
          ],
          { stdio: 'inherit' }
        );
      } else {
        execFileSync('unzip', ['-o', archivePath, '-d', dir], { stdio: 'inherit' });
      }
    } else {
      execFileSync('tar', ['-xzf', archivePath, '-C', dir], { stdio: 'inherit' });
    }
    if (!isWin) {
      chmodSync(binPath, 0o755);
    }
  } finally {
    rmSync(archivePath, { force: true });
  }

  if (!verifyInstalled(binPath, spec.versionArg, spec.expectedText)) {
    throw new Error(`Extracted binary ${binPath} failed --version check`);
  }
  console.log(`SCANNER INSTALLED: ${name}@${spec.version} | SHA256=${actualSha256}`);
}

async function main() {
  for (const [name, spec] of Object.entries(TOOLS)) {
    await ensureTool(name, spec);
  }
}

main().catch((err) => {
  console.error(`IAC SCANNER SETUP BLOCKED: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(3);
});
