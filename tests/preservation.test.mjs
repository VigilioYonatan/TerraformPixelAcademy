import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('v1.4 baseline inventory is intact in this version',async()=>{
 const lines=(await readFile(new URL('docs/BASELINE_V1_4_FILES.txt',root),'utf8')).split(/\r?\n/).filter(line=>line&&!line.startsWith('#'));
 assert.ok(lines.length>500);
 for(const file of lines){const meta=await stat(new URL(file,root));assert.ok(meta.isFile(),file)}
 const result=spawnSync(process.execPath,['scripts/verify-preservation.mjs'],{cwd:process.cwd(),encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert.match(result.stdout,/PRESERVATION PASS/);
});
