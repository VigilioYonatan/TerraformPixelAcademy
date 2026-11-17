import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { EditorState, StreamLanguage } from '../app/vendor/codemirror6.mjs';
import { hclStreamParser } from '../app/hclLanguage.js';

const base = new URL('../', import.meta.url);

test('offline Preact and CodeMirror 6 runtime assets, types, and MIT notices are verified alongside preserved v5 baseline', async () => {
  const html = await readFile(new URL('index.html', base), 'utf8');
  const main = await readFile(new URL('src/main.ts', base), 'utf8');
  const editor = await readFile(new URL('src/editor.ts', base), 'utf8');
  const notices = await readFile(new URL('assets/vendor/THIRD_PARTY_NOTICES.md', base), 'utf8');

  assert.match(main, /from '\.\/vendor\/preact\.mjs'/);
  assert.match(main, /renderPreact\(/);
  assert.match(editor, /import\('\.\/vendor\/codemirror6\.mjs'\)/);
  assert.match(editor, /EditorState\.create\(/);
  assert.match(editor, /new cm\.EditorView\(/);
  assert.match(html, /codemirror5\/codemirror\.css/);

  for (const pkgEntry of [
    '@codemirror/state',
    '6.7.6',
    '@codemirror/view',
    '6.43.15',
    '@codemirror/commands',
    '6.11.1',
    '@codemirror/language',
    '6.13.1',
    '@codemirror/autocomplete',
    '6.20.4',
    '@lezer/highlight',
    '1.2.5'
  ]) {
    assert.ok(notices.includes(pkgEntry), `THIRD_PARTY_NOTICES.md missing ${pkgEntry}`);
  }

  for (const f of [
    'app/vendor/preact.mjs',
    'app/vendor/codemirror6.mjs',
    'src/vendor/codemirror6.d.mts',
    'assets/vendor/codemirror5/codemirror.js',
    'assets/vendor/codemirror5/mode-hcl.js',
    'assets/vendor/codemirror5/codemirror.css',
    'assets/vendor/codemirror5/matchbrackets.js',
    'assets/vendor/codemirror5/closebrackets.js'
  ]) {
    assert.ok((await stat(new URL(f, base))).size > 100, f);
  }

  // Execute genuine CodeMirror 6 EditorState + HCL StreamLanguage in Node
  const hclLang = StreamLanguage.define(hclStreamParser);
  const sampleDoc = 'resource "terraform_data" "demo" {\n  input = "Hola, Terraform"\n}';
  const state = EditorState.create({
    doc: sampleDoc,
    extensions: [hclLang.extension]
  });
  assert.equal(state.doc.toString(), sampleDoc);
});
