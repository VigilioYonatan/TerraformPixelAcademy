import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,writeFile,chmod,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const project=fileURLToPath(new URL('../',import.meta.url));
const digest=async(path)=>createHash('sha256').update(await readFile(path)).digest('hex');

test('Terraform runner is isolated from sources (using explicit stub, NOT a Terraform CLI test)',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'terra-runner-check-'));
 const binary=join(temp,'terraform');
 const sample=join(project,'labs/offline/B04/main.tf');
 const original=await digest(sample);
 try {
  await writeFile(binary,`#!/bin/sh
if [ "$1" = "version" ];then echo 'TEST STUB - NOT REAL TERRAFORM'; exit 0;fi
printf '%s\\n' "$1" >> "runner-stub-invocations.txt"
exit 0
`);
  await chmod(binary,0o755);
  const run=spawnSync('bash',['scripts/verify-terraform-labs.sh'],{
   cwd:project,env:{...process.env,PATH:`${temp}:${process.env.PATH}`,REPORT_DIR:join(temp,'evidence')},encoding:'utf8',timeout:60000
  });
  assert.equal(run.status,0,run.stderr||run.stdout);
  assert.match(run.stdout,/PASS=37 FAIL=0/);
  const summary=await readFile(join(temp,'evidence','SUMMARY.txt'),'utf8');
  assert.equal(summary.split('\n').filter(line=>/^([BIA]\d\d|S18) \| PASS/.test(line)).length,37);
  assert.equal(await digest(sample),original,'runner must not edit original main.tf');
  assert.ok(!(await readdir(join(project,'labs/offline/B04'))).includes('runner-stub-invocations.txt'));
 } finally{await rm(temp,{recursive:true,force:true});}
});
