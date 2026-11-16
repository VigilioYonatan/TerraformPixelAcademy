import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const base=new URL('../',import.meta.url);
test('offline Preact and CodeMirror runtime assets are present with references in the shell',async()=>{
 const html=await readFile(new URL('index.html',base),'utf8');
 const main=await readFile(new URL('src/main.ts',base),'utf8');
 const editor=await readFile(new URL('src/editor.ts',base),'utf8');
 assert.match(main,/from '\.\/vendor\/preact\.mjs'/);
 assert.match(main,/renderPreact\(/);
 assert.match(editor,/fromTextArea\(/);
 assert.match(html,/codemirror5\/codemirror\.css/);
 for(const f of ['app/vendor/preact.mjs','assets/vendor/codemirror5/codemirror.js','assets/vendor/codemirror5/mode-hcl.js','assets/vendor/codemirror5/codemirror.css','assets/vendor/codemirror5/matchbrackets.js','assets/vendor/codemirror5/closebrackets.js']){
  assert.ok((await stat(new URL(f,base))).size>100, f);
 }
});
