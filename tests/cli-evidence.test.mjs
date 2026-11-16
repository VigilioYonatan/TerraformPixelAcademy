import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {parseCliManifest,cliStats,cliEvidenceMarkdown} from '../app/cliEvidence.js';
const valid=JSON.parse(await readFile('assets/examples/cli-evidence-synthetic.json','utf8'));
test('CLI manifest: valid synthetic example is explicitly labeled',()=>{
 const parsed=parseCliManifest(valid),stat=cliStats(parsed);
 assert.equal(parsed.origin,'SYNTHETIC_EXAMPLE');
 assert.deepEqual(stat,{total:3,pass:1,fail:1,notRun:1,missing:34});
 const report=cliEvidenceMarkdown(parsed);
 assert.match(report,/AUTODECLARADO/);assert.match(report,/SIN RESULTADO|sin resultado/);
 assert.doesNotMatch(report,/secret_access_key/);
});
test('CLI manifest rejects fabricated IDs, duplicate IDs and PASS without log hash',()=>{
 for(const entries of [
   [{...valid.results[0],id:'S99'}],
   [valid.results[0],valid.results[0]],
   [{...valid.results[0],logSha256:null}],
   [{...valid.results[0],status:'NOT_RUN'}],
 ])assert.throws(()=>parseCliManifest({...valid,results:entries}));
});
test('CLI manifest rejects unknown origin and controls log bounds',()=>{
 assert.throws(()=>parseCliManifest({...valid,origin:'TRUSTED'}));
 assert.throws(()=>parseCliManifest({...valid,results:[{...valid.results[0],logBytes:999999999}]}));
 assert.throws(()=>parseCliManifest({...valid,generatedAt:'yesterday'}));
});
test('evidence manifest generator reads actual local logs and never embeds log text',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'tp-evidence-'));
 try{
  const secret='DO_NOT_EXPORT_SAMPLE_TOKEN';
  await writeFile(join(dir,'SUMMARY.txt'),`Run UTC\nB01 | PASS | local/B01.log\nB02 | FAIL | local/B02.log\n`);
  await writeFile(join(dir,'terraform-version.txt'),'Terraform v1.10.5\n');
  await writeFile(join(dir,'B01.log'),`terraform test success ${secret}`);
  await writeFile(join(dir,'B02.log'),'terraform test failed');
  execFileSync('node',['scripts/create-evidence-manifest.mjs',dir],{cwd:process.cwd()});
  const raw=await readFile(join(dir,'CLI-EVIDENCE-MANIFEST.json'),'utf8');
  assert.ok(!raw.includes(secret));
  const manifest=parseCliManifest(JSON.parse(raw));
  assert.equal(manifest.results.length,37);
  assert.deepEqual(cliStats(manifest),{total:37,pass:1,fail:1,notRun:35,missing:0});
  assert.match(manifest.results[0].logSha256,/^[a-f0-9]{64}$/);
 }finally{await rm(dir,{recursive:true,force:true})}
});
