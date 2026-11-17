#!/usr/bin/env node
/**
 * Deterministically bundles genuine CodeMirror 6 packages from locked node_modules
 * into app/vendor/codemirror6.mjs so both offline mode (`npm start`) and `vite build`
 * use authentic CodeMirror 6 without requiring runtime internet access.
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const entryFile = join(root, 'scripts', 'cm6-entry.mjs');
const tempOutDir = await mkdtemp(join(tmpdir(), 'tp-cm6-out-'));

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
        fileName: () => 'codemirror6.raw.mjs'
      }
    }
  });

  const compiled = await readFile(join(tempOutDir, 'codemirror6.raw.mjs'), 'utf8');
  const banner = [
    '// CodeMirror 6 ESM Bundle (@codemirror/state 6.7.6, @codemirror/view 6.43.15, @codemirror/commands 6.11.1,',
    '// @codemirror/language 6.13.1, @codemirror/autocomplete 6.20.4, @lezer/highlight 1.2.5)',
    '// MIT License — Copyright (C) 2018-2026 by Marijn Haverbeke and others. See assets/vendor/THIRD_PARTY_NOTICES.md'
  ].join('\n');

  const outPath = join(root, 'app', 'vendor', 'codemirror6.mjs');
  await writeFile(outPath, `${banner}\n${compiled}`, 'utf8');
  console.log(`Bundled CodeMirror 6 ESM -> app/vendor/codemirror6.mjs (${(compiled.length / 1024).toFixed(1)} KB)`);
} finally {
  await rm(tempOutDir, { recursive: true, force: true });
}
