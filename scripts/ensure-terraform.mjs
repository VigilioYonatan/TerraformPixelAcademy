#!/usr/bin/env node
/**
 * Supply-chain-verified local installer for pinned HashiCorp Terraform CLI (`v1.10.5`).
 * Downloads into `.tools/terraform/1.10.5/` (gitignored & isolated from baseline paths)
 * and verifies SHA-256 against HashiCorp's official `SHA256SUMS` before extraction.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TERRAFORM_VERSION = '1.10.5';
const PINNED_WINDOWS_AMD64_SHA256 = '4e2c6b7232aa30026baf9fe575f1bf4006c2a0cbbcdcbd244573dc188b439239';

const root = fileURLToPath(new URL('..', import.meta.url));
const installDir = join(root, '.tools', 'terraform', TERRAFORM_VERSION);
const isWin = process.platform === 'win32';
const binaryName = isWin ? 'terraform.exe' : 'terraform';
const binaryPath = join(installDir, binaryName);

function resolvePlatformSlug() {
  const osMap = { win32: 'windows', linux: 'linux', darwin: 'darwin' };
  const archMap = { x64: 'amd64', arm64: 'arm64' };
  const os = osMap[process.platform];
  const arch = archMap[process.arch];
  if (!os || !arch) {
    throw new Error(`Unsupported platform/arch for Terraform installer: ${process.platform}/${process.arch}`);
  }
  return `${os}_${arch}`;
}

function checkExistingBinary(bin) {
  if (!existsSync(bin)) return false;
  const res = spawnSync(bin, ['version'], { encoding: 'utf8' });
  return res.status === 0 && res.stdout.includes(`Terraform v${TERRAFORM_VERSION}`);
}

async function main() {
  if (checkExistingBinary(binaryPath)) {
    console.log(`TERRAFORM READY: ${binaryPath} (v${TERRAFORM_VERSION} verified)`);
    return;
  }

  const slug = resolvePlatformSlug();
  const zipName = `terraform_${TERRAFORM_VERSION}_${slug}.zip`;
  const baseUrl = `https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}`;
  const sumsUrl = `${baseUrl}/terraform_${TERRAFORM_VERSION}_SHA256SUMS`;
  const zipUrl = `${baseUrl}/${zipName}`;

  console.log(`Fetching SHA256SUMS from ${sumsUrl}...`);
  const sumsResponse = await fetch(sumsUrl);
  if (!sumsResponse.ok) {
    throw new Error(`Failed to fetch SHA256SUMS: HTTP ${sumsResponse.status}`);
  }
  const sumsText = await sumsResponse.text();
  const matchLine = sumsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.endsWith(`  ${zipName}`));
  if (!matchLine) {
    throw new Error(`Archive ${zipName} not found in official SHA256SUMS`);
  }
  const expectedSha256 = matchLine.split(/\s+/)[0].toLowerCase();
  if (slug === 'windows_amd64' && expectedSha256 !== PINNED_WINDOWS_AMD64_SHA256) {
    throw new Error(
      `Pinned SHA256 mismatch for ${zipName}: expected ${PINNED_WINDOWS_AMD64_SHA256}, got ${expectedSha256}`
    );
  }

  console.log(`Downloading ${zipUrl}...`);
  const zipResponse = await fetch(zipUrl);
  if (!zipResponse.ok) {
    throw new Error(`Failed to download ${zipName}: HTTP ${zipResponse.status}`);
  }
  const zipBytes = Buffer.from(await zipResponse.arrayBuffer());
  const actualSha256 = createHash('sha256').update(zipBytes).digest('hex');
  if (actualSha256 !== expectedSha256) {
    throw new Error(`SHA-256 verification failed for ${zipName}: expected ${expectedSha256}, got ${actualSha256}`);
  }

  mkdirSync(installDir, { recursive: true });
  const tempZipPath = join(installDir, zipName);
  writeFileSync(tempZipPath, zipBytes);

  try {
    if (isWin) {
      execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          `Expand-Archive -LiteralPath '${tempZipPath.replace(/'/g, "''")}' -DestinationPath '${installDir.replace(/'/g, "''")}' -Force`
        ],
        { stdio: 'inherit' }
      );
    } else {
      execFileSync('unzip', ['-o', tempZipPath, '-d', installDir], { stdio: 'inherit' });
      chmodSync(binaryPath, 0o755);
    }
  } finally {
    rmSync(tempZipPath, { force: true });
  }

  const licenseNotice = readFileSync(join(installDir, 'LICENSE.txt'), 'utf8').slice(0, 120).trim();
  if (!checkExistingBinary(binaryPath)) {
    throw new Error(`Extracted Terraform binary at ${binaryPath} failed version verification.`);
  }
  console.log(`TERRAFORM INSTALLED: v${TERRAFORM_VERSION} (${slug}) | SHA256=${actualSha256} | ${licenseNotice}`);
}

main().catch((err) => {
  console.error(`TERRAFORM SETUP BLOCKED: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(3);
});
