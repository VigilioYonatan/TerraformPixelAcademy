/** Training evidence ledger. It displays a user-supplied CLI manifest, but does
 * NOT authenticate the executor or re-run Terraform. Values and logs are never
 * loaded or persisted. Only metadata and SHA-256 references are handled.
 */
export type CliRunStatus='PASS'|'FAIL'|'NOT_RUN';
export type CliOrigin='LOCAL_TERRAFORM_CLI'|'SYNTHETIC_EXAMPLE';
export interface CliResult {id:string;status:CliRunStatus;logSha256:string|null;logBytes:number}
export interface CliManifest {
  schemaVersion:1;
  origin:CliOrigin;
  runId:string;
  generatedAt:string;
  terraformVersion:string;
  results:CliResult[];
}
const allowed=new Set([...['B','I','A'].flatMap(p=>Array.from({length:12},(_,i)=>`${p}${String(i+1).padStart(2,'0')}`)),'S18']);
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const short=(v:unknown,length=120):string=>typeof v==='string'?v.slice(0,length):'';
export function parseCliManifest(input:unknown):CliManifest {
  if(!isObject(input)||input.schemaVersion!==1)throw new Error('Esquema no reconocido: se requiere schemaVersion=1.');
  if(input.origin!=='LOCAL_TERRAFORM_CLI'&&input.origin!=='SYNTHETIC_EXAMPLE')throw new Error('Origen de manifest desconocido.');
  if(!Array.isArray(input.results)||input.results.length<1||input.results.length>37)throw new Error('Se requieren entre 1 y 37 resultados.');
  const generatedAt=short(input.generatedAt,40);
  if(!/^\d{4}-\d\d-\d\dT/.test(generatedAt)||!Number.isFinite(Date.parse(generatedAt)))throw new Error('Fecha UTC inválida.');
  const runId=short(input.runId,100);
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(runId))throw new Error('Identificador de ejecución inválido.');
  const terraformVersion=short(input.terraformVersion,80);
  if(terraformVersion.length<2)throw new Error('Falta versión de Terraform declarada.');
  const seen=new Set<string>();
  const results:CliResult[]=input.results.map(raw=>{
    if(!isObject(raw))throw new Error('Resultado de laboratorio inválido.');
    const id=raw.id;
    if(typeof id!=='string'||!allowed.has(id)||seen.has(id))throw new Error('ID duplicado o no permitido en los resultados.');
    seen.add(id);
    if(raw.status!=='PASS'&&raw.status!=='FAIL'&&raw.status!=='NOT_RUN')throw new Error('Estado CLI inválido.');
    const logSha256=raw.logSha256;
    const logBytes=raw.logBytes;
    if(typeof logBytes!=='number'||!Number.isSafeInteger(logBytes)||logBytes<0||logBytes>100000000)
      throw new Error('Tamaño del log inválido.');
    if(raw.status!=='NOT_RUN' && (typeof logSha256!=='string'||!/^[0-9a-f]{64}$/.test(logSha256)||logBytes<1))
      throw new Error(`Falta SHA-256 del log para ${id}.`);
    if(raw.status==='NOT_RUN' && (logSha256!==null||logBytes!==0))
      throw new Error('NOT_RUN no puede declarar un log de ejecución.');
    return {id,status:raw.status,logSha256:logSha256 as string|null,logBytes};
  });
  return {schemaVersion:1,origin:input.origin,runId,generatedAt,terraformVersion,results};
}
export function cliStats(manifest:CliManifest){
  const total=manifest.results.length;
  const pass=manifest.results.filter(r=>r.status==='PASS').length;
  const fail=manifest.results.filter(r=>r.status==='FAIL').length;
  return {total,pass,fail,notRun:total-pass-fail,missing:37-total};
}
/** Never include raw log content; digests are unverified until logs are separately checked. */
export function cliEvidenceMarkdown(m:CliManifest):string {
  const stats=cliStats(m);
  const lines=[
    '# TerraPixel — índice de evidencias CLI', '',
    `- Origen declarado: ${m.origin}`,
    `- Versión declarada: ${m.terraformVersion.replace(/[\r\n|]/g,' ')}`,
    `- Fecha declarada: ${m.generatedAt}`,
    `- Ejecución: ${m.runId}`,
    `- PASS: ${stats.pass}; FAIL: ${stats.fail}; NOT_RUN: ${stats.notRun}; sin resultado: ${stats.missing}`,'',
    '> AUTODECLARADO: importar este JSON no prueba que Terraform se ejecutó ni que el log original coincida con su hash. Un auditor debe cotejar los logs originales y su origen.', '',
    '| Lab | Estado declarado | SHA-256 del log (sin verificar) |','|---|---|---|',
    ...m.results.map(r=>`| ${r.id} | ${r.status} | ${r.logSha256||'—'} |`),'',
    '## Privacidad', 'No se han incluido logs, variables, recursos, planes, credenciales ni contenido de state. Guarda los logs reales por separado con permisos restringidos.',''
  ];
  return lines.join('\n');
}
