/**
 * Zero-network release safety gate. It is intentionally NOT a replacement for
 * a full SAST, dependency audit, Terraform CLI or browser E2E run.
 */
import {readFile, readdir, stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const failures=[];
let inspected=0;
const failuresOf=(message)=>failures.push(message);
const read=(file)=>readFile(join(root,file),'utf8');
const exists=async(file)=>{try{return (await stat(join(root,file))).isFile()}catch{return false}};

const mustHave=[
 'index.html','styles.css','src/main.ts','src/senior.ts','src/seniorProgress.ts',
 'src/seniorWhatIf.ts','src/planInspector.ts','src/planReport.ts','app/main.js',
 'app/vendor/preact.mjs','assets/vendor/codemirror5/codemirror.js',
 'assets/vendor/THIRD_PARTY_NOTICES.md','scripts/server.mjs',
 '.github/workflows/quality.yml','.github/workflows/terraform-labs.yml',
 '.github/workflows/devsecops.yml','biome.json','SECURITY.md','docs/DEVSECOPS.md'
];
for(const path of mustHave)if(!await exists(path))failuresOf(`Archivo obligatorio ausente: ${path}`);

async function walk(folder){
 const names=(await readdir(join(root,folder),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name));
 for(const entry of names){
  const name=join(folder,entry.name);
  if(entry.isSymbolicLink()){failuresOf(`Enlace simbólico no autorizado: ${name}`);continue}
  if(entry.isDirectory()){await walk(name);continue}
  if(!entry.isFile())continue;
  inspected++;
  if(/(^|[\\/])(?:\.env(?:\..*)?|id_rsa|id_ed25519|credentials|terraform\.tfstate(?:\..*)?|\.terraform[\\/])/i.test(name))failuresOf(`Archivo privado inesperado: ${name}`);
  if(!/\.(?:ts|mjs|js|json|ya?ml|html|css|tf|hcl|md|txt)$/i.test(name))continue;
  // Do not report training fixtures as secret leaks: restrict credential scan to delivered executable/config files.
  if(!/^(src|scripts|app|\.github)[\\/]/.test(name)&&!['index.html','vite.config.js'].includes(name))continue;
  const data=await readFile(join(root,name),'utf8');
  if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(data))failuresOf(`Clave privada detectada: ${name}`);
  if(/\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/.test(data))failuresOf(`Posible AWS access key: ${name}`);
  if(/\bghp_[A-Za-z0-9]{36}\b/.test(data))failuresOf(`Posible GitHub PAT: ${name}`);
  if(/^\s*terraform\s+apply\b/m.test(data)&&name.startsWith('.github'))failuresOf(`CI no debe ejecutar apply: ${name}`);
 }
}
for(const folder of ['src','scripts','app','.github','labs','assets'])await walk(folder);
for(const i of ['B','I','A'])for(let n=1;n<=12;n++){
 const id=`${i}${String(n).padStart(2,'0')}`;
 for(const file of [`labs/offline/${id}/main.tf`,`labs/offline/${id}/practice.tftest.hcl`,`assets/labs/${id}.zip`])
  if(!await exists(file))failuresOf(`Lab incompleto: ${file}`);
}
for(let n=1;n<=18;n++){
 const id=`S${String(n).padStart(2,'0')}`;
 for(const file of [`labs/senior/${id}/CASE-REVIEW-SHEET.md`,`labs/senior/${id}/WHAT-IF-SCENARIO.json`,`assets/senior/${id}.zip`])
  if(!await exists(file))failuresOf(`Caso Senior incompleto: ${file}`);
}
const config=JSON.parse(await read('package.json'));
if(!config.scripts?.['lint:biome']||!config.devDependencies?.['@biomejs/biome'])failuresOf('Biome no configurado en npm.');
const html=await read('index.html');
if(/<script[^>]+src=["']https?:\/\//i.test(html))failuresOf('Runtime JS remoto inesperado en index.html');
const server=await read('scripts/server.mjs');
for(const header of ['Content-Security-Policy','X-Content-Type-Options','X-Frame-Options'])
 if(!server.includes(header))failuresOf(`Servidor no establece ${header}`);
const workflows=await Promise.all(['quality.yml','devsecops.yml','terraform-labs.yml'].map(n=>read(`.github/workflows/${n}`)));
for(let i=0;i<workflows.length;i++)if(!/permissions:\s*\n\s*contents:\s*read/.test(workflows[i]))failuresOf(`Workflow sin permisos mínimos: ${i}`);
if(!workflows[1].includes('npm run lint:biome'))failuresOf('Workflow DevSecOps no ejecuta Biome.');
if(!workflows[1].includes('npm run security:local'))failuresOf('Workflow DevSecOps no ejecuta auditoría local.');
if(!failures.length)console.log(`DEVSECOPS LOCAL PASS: ${inspected} archivos inspeccionados; 36 labs y 18 casos Senior presentes. No incluye análisis npm online/CLI.`);
else{console.error(`DEVSECOPS LOCAL FAIL (${failures.length}):\n${failures.join('\n')}`);process.exitCode=1}
