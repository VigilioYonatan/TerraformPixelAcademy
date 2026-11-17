#!/usr/bin/env node
/**
 * Deterministically bundles a tree-shaken Three.js ESM subset from locked `node_modules`
 * into `app/vendor/three.mjs` so both offline mode (`npm start`) and `vite build`
 * render real 3D WebGL infrastructure arenas without runtime network access.
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const entryFile = join(root, 'scripts', 'three-entry.mjs');
const tempOutDir = await mkdtemp(join(tmpdir(), 'tp-three-out-'));

try {
  await build({
    configFile: false,
    root,
    logLevel: 'warn',
    build: {
      outDir: tempOutDir,
      emptyOutDir: false,
      target: 'es2022',
      sourcemap: false,
      minify: true,
      lib: {
        entry: entryFile,
        formats: ['es'],
        fileName: () => 'three.raw.mjs'
      }
    }
  });

  const compiled = await readFile(join(tempOutDir, 'three.raw.mjs'), 'utf8');
  const banner = [
    '// Three.js Tree-Shaken ESM Bundle (three 0.187.0)',
    '// MIT License — Copyright © 2010-2026 three.js authors. See assets/vendor/THIRD_PARTY_NOTICES.md'
  ].join('\n');

  const outPath = join(root, 'app', 'vendor', 'three.mjs');
  await writeFile(outPath, `${banner}\n${compiled}`, 'utf8');
  const gzBytes = gzipSync(Buffer.from(compiled, 'utf8'), { level: 9 }).byteLength;
  console.log(
    `Bundled Three.js ESM -> app/vendor/three.mjs (${(compiled.length / 1024).toFixed(1)} KB raw, ${(gzBytes / 1024).toFixed(1)} KB gzip)`
  );
} finally {
  await rm(tempOutDir, { recursive: true, force: true });
}
