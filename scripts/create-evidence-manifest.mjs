#!/usr/bin/env node
/** Create metadata-only manifest from actual CLI runner logs; never copy log data. */
import {readFile,writeFile,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
const reportDir=resolve(process.argv[2]||'terraform-verification-results');
const summary=await readFile(join(reportDir,'SUMMARY.txt'),'utf8');
const version=await readFile(join(reportDir,'terraform-version.txt'),'utf8');
const ids=[...'BIA'].flatMap(p=>Array.from({length:12},(_,i)=>p+String(i+1).padStart(2,'0'))).concat('S18');
const rows=new Map();
for(const line of summary.split(/\r?\n/)){
 const match=/^([BIA]\d{2}|S18)\s*\|\s*(PASS|FAIL)\s*\|/.exec(line);
 if(match){if(rows.has(match[1]))throw Error(`ID duplicado: ${match[1]}`);rows.set(match[1],match[2]);}
}
const results=[];
for(const id of ids){
 if(!rows.has(id)){results.push({id,status:'NOT_RUN',logSha256:null,logBytes:0});continue;}
 const filename=join(reportDir,`${id}.log`);
 const bytes=await readFile(filename);const file=await stat(filename);
 if(!file.isFile()||bytes.length===0)throw Error(`Log obligatorio ausente/vacío: ${id}`);
 results.push({id,status:rows.get(id),logSha256:createHash('sha256').update(bytes).digest('hex'),logBytes:bytes.length});
}
const manifest={
 schemaVersion:1,origin:'LOCAL_TERRAFORM_CLI',runId:randomUUID(),generatedAt:new Date().toISOString(),
 terraformVersion:version.trim().split(/\r?\n/)[0].slice(0,80)||'desconocida',results
};
await writeFile(join(reportDir,'CLI-EVIDENCE-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
console.log(`Created metadata-only CLI evidence: ${results.filter(r=>r.status==='PASS').length} PASS, ${results.filter(r=>r.status==='FAIL').length} FAIL, ${results.filter(r=>r.status==='NOT_RUN').length} NOT_RUN`);
