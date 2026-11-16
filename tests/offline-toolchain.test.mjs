import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {stat,readFile} from 'node:fs/promises';
const base=new URL('../',import.meta.url);
test('TypeScript build tool is fully vendored with its MIT license',async()=>{
 for(const filename of ['tools/typescript/bin/tsc','tools/typescript/lib/tsc.js','tools/typescript/lib/typescript.js','tools/typescript/LICENSE.txt']){
  assert.ok((await stat(new URL(filename,base))).size>20,filename);
 }
 const version=spawnSync(process.execPath,['tools/typescript/bin/tsc','--version'],{cwd:process.cwd(),encoding:'utf8'});
 assert.equal(version.status,0,version.stderr);
 assert.match(version.stdout,/Version 5\.8\.3/);
 const manifest=await readFile(new URL('docs/BASELINE_V1_5_1_FILES.txt',base),'utf8');
 assert.equal(manifest.split('\n').filter(s=>s.startsWith('assets/')||s.startsWith('src/')||s.startsWith('labs/')).length>300,true);
});
