#!/usr/bin/env node
/**
 * Production Vite bundle budget & env-leakage gate (web-mfe-quality / vite.md).
 * Verifies dist/.vite/manifest.json, enforces raw + gzip budgets, and rejects secret leaks.
 */
import {readFile, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : join(root, 'dist');

const BUDGETS = {
  maxEntryRawBytes: 350_000,
  maxEntryGzipBytes: 110_000,
  maxCssRawBytes: 90_000,
  maxCssGzipBytes: 25_000
};

const failures = [];
const exists = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

const manifestPath = join(distDir, '.vite', 'manifest.json');
if (!(await exists(manifestPath))) {
  console.error('BUNDLE BUDGET FAIL: dist/.vite/manifest.json no existe. Ejecuta `vite build` primero.');
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entries = Object.values(manifest).filter((item) => item && typeof item === 'object' && item.isEntry);
if (entries.length === 0) {
  console.error('BUNDLE BUDGET FAIL: manifest.json no contiene ningun entrypoint.');
  process.exit(1);
}

let totalEntryRaw = 0;
let totalEntryGzip = 0;
let totalCssRaw = 0;
let totalCssGzip = 0;
const inspectedChunks = new Set();

for (const entry of entries) {
  const jsRel = entry.file;
  const jsPath = join(distDir, jsRel);
  if (!(await exists(jsPath))) {
    failures.push(`Chunk de entrada ausente: ${jsRel}`);
    continue;
  }
  const jsBytes = await readFile(jsPath);
  totalEntryRaw += jsBytes.byteLength;
  totalEntryGzip += gzipSync(jsBytes, {level: 9}).byteLength;
  inspectedChunks.add(jsPath);

  const cssFiles = Array.isArray(entry.css) ? entry.css : [];
  for (const cssRel of cssFiles) {
    const cssPath = join(distDir, cssRel);
    if (!(await exists(cssPath))) {
      failures.push(`Asset CSS ausente: ${cssRel}`);
      continue;
    }
    const cssBytes = await readFile(cssPath);
    totalCssRaw += cssBytes.byteLength;
    totalCssGzip += gzipSync(cssBytes, {level: 9}).byteLength;
    inspectedChunks.add(cssPath);
  }
}

// Check standalone CSS entries in manifest (when cssCodeSplit: false emits style.css)
for (const item of Object.values(manifest)) {
  if (item && typeof item === 'object' && typeof item.file === 'string' && item.file.endsWith('.css')) {
    const cssPath = join(distDir, item.file);
    if (!inspectedChunks.has(cssPath) && (await exists(cssPath))) {
      const cssBytes = await readFile(cssPath);
      totalCssRaw += cssBytes.byteLength;
      totalCssGzip += gzipSync(cssBytes, {level: 9}).byteLength;
      inspectedChunks.add(cssPath);
    }
  }
}

if (totalEntryRaw > BUDGETS.maxEntryRawBytes) {
  failures.push(`JS entrypoint raw (${totalEntryRaw} B) supera presupuesto (${BUDGETS.maxEntryRawBytes} B)`);
}
if (totalEntryGzip > BUDGETS.maxEntryGzipBytes) {
  failures.push(`JS entrypoint gzip (${totalEntryGzip} B) supera presupuesto (${BUDGETS.maxEntryGzipBytes} B)`);
}
if (totalCssRaw > BUDGETS.maxCssRawBytes) {
  failures.push(`CSS raw (${totalCssRaw} B) supera presupuesto (${BUDGETS.maxCssRawBytes} B)`);
}
if (totalCssGzip > BUDGETS.maxCssGzipBytes) {
  failures.push(`CSS gzip (${totalCssGzip} B) supera presupuesto (${BUDGETS.maxCssGzipBytes} B)`);
}

const distHtmlPath = join(distDir, 'index.html');
if (!(await exists(distHtmlPath))) {
  failures.push('dist/index.html ausente');
} else {
  const html = await readFile(distHtmlPath, 'utf8');
  if (/<script[^>]+src=["']https?:\/\//i.test(html)) {
    failures.push('Script externo remoto detectado en dist/index.html');
  }
  if (!/assets\/[^"']+\.js/.test(html)) {
    failures.push('dist/index.html no referencia el bundle JS hasheado de Vite');
  }
  inspectedChunks.add(distHtmlPath);
}

for (const filePath of inspectedChunks) {
  const text = await readFile(filePath, 'utf8');
  if (/VITE_[A-Z0-9_]*(?:SECRET|PASSWORD|TOKEN|PRIVATE_KEY)/i.test(text)) {
    failures.push(`Posible variable secreta VITE_* expuesta en bundle: ${filePath}`);
  }
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:AKIA|ASIA)[0-9A-Z]{16}\b|\bghp_[A-Za-z0-9]{36}\b/.test(text)) {
    failures.push(`Posible credencial detectada en artefacto compilado: ${filePath}`);
  }
}

for (const requiredStatic of [
  'assets/terra/hola.png',
  'assets/labs/B04.zip',
  'assets/senior/S18.zip',
  'assets/vendor/codemirror5/codemirror.js',
  'docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md'
]) {
  if (!(await exists(join(distDir, requiredStatic)))) {
    failures.push(`Recurso estatico requerido ausente en dist/: ${requiredStatic}`);
  }
}

if (failures.length > 0) {
  console.error(`BUNDLE BUDGET FAIL (${failures.length}):\n${failures.map((f) => ` - ${f}`).join('\n')}`);
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(2)} KB`;
console.log(
  `BUNDLE BUDGET PASS: JS=${kb(totalEntryRaw)} raw (${kb(totalEntryGzip)} gzip) | CSS=${kb(totalCssRaw)} raw (${kb(totalCssGzip)} gzip) | 0 fugas detectadas.`
);
