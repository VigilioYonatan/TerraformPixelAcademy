/**
 * Deterministic, pure training simulators for all 18 Senior Mode incidents (`S01–S18` — `F4-01`).
 * Never executes Terraform CLI, cloud APIs, or state mutations; all outputs carry `SYNTHETIC_FIXTURE` provenance.
 */

export interface SimOutcome {
  ok: boolean;
  verdict: 'SAFE' | 'REVIEW' | 'BLOCKED';
  summary: string;
  provenance: 'SYNTHETIC_FIXTURE';
}

export interface SimulatorInputs {
  // S01
  oldKey: string;
  newKey: string;
  hasMovedBlock: boolean;
  // S02
  lockAgeMinutes: number;
  writerActive: boolean;
  lockDualApproved: boolean;
  // S03
  hclOwner: string;
  remoteOwner: string;
  driftTouchesSecurity: boolean;
  // S04
  criticalEnv: 'dev' | 'staging' | 'prod';
  hasPreventDestroy: boolean;
  hasVerifiedBackup: boolean;
  // S05
  writersFrozen: boolean;
  migrationBackupVerified: boolean;
  migrationLockEnabled: boolean;
  // S06
  secretHandling: 'sensitive_var' | 'ephemeral_var' | 'raw_output';
  secretInState: boolean;
  // S07
  providerFrom: string;
  providerTo: string;
  lockfilePinned: boolean;
  // S08
  stateResourceCount: number;
  cycleCount: number;
  // S09
  cidrA: string;
  cidrB: string;
  // S10
  oidcSubject: string;
  oidcAudience: string;
  oidcProtectedEnv: boolean;
  // S11
  approvedCommit: string;
  appliedCommit: string;
  // S12
  mockTestsPass: boolean;
  sandboxIntegrationPass: boolean;
  // S13
  policySeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  exceptionOwner: string;
  exceptionTtlDays: number;
  // S14
  simulatedReplicas: number;
  hasFinOpsTags: boolean;
  statefulOnSpot: boolean;
  // S15
  drWritersPaused: boolean;
  drDualApproved: boolean;
  drRtoMinutes: number;
  // S16
  tfOwnsCluster: boolean;
  tfOwnsWorkloads: boolean;
  gitopsOwnsWorkloads: boolean;
  // S17
  rfcMonolithicState: boolean;
  rfcHasRollback: boolean;
  rfcHasGates: boolean;
  // S18
  capstoneTargetEnv: 'dev' | 'staging' | 'prod';
  capstoneGatesGreen: boolean;
  capstoneOidcScoped: boolean;
  capstoneFinOpsApproved: boolean;
}

export function defaultSimulatorInputs(): SimulatorInputs {
  return {
    oldKey: 'old_key',
    newKey: 'new_key',
    hasMovedBlock: false,
    lockAgeMinutes: 4,
    writerActive: true,
    lockDualApproved: false,
    hclOwner: 'team-platform',
    remoteOwner: 'unknown',
    driftTouchesSecurity: true,
    criticalEnv: 'prod',
    hasPreventDestroy: false,
    hasVerifiedBackup: false,
    writersFrozen: false,
    migrationBackupVerified: true,
    migrationLockEnabled: true,
    secretHandling: 'sensitive_var',
    secretInState: true,
    providerFrom: '4.67.0',
    providerTo: '5.0.0',
    lockfilePinned: false,
    stateResourceCount: 480,
    cycleCount: 1,
    cidrA: '10.40.0.0/16',
    cidrB: '10.40.8.0/21',
    oidcSubject: 'repo:acme/infra:*',
    oidcAudience: 'sts.amazonaws.com',
    oidcProtectedEnv: false,
    approvedCommit: 'a1b2',
    appliedCommit: 'c9d8',
    mockTestsPass: true,
    sandboxIntegrationPass: false,
    policySeverity: 'HIGH',
    exceptionOwner: '',
    exceptionTtlDays: 30,
    simulatedReplicas: 6,
    hasFinOpsTags: true,
    statefulOnSpot: false,
    drWritersPaused: false,
    drDualApproved: false,
    drRtoMinutes: 90,
    tfOwnsCluster: true,
    tfOwnsWorkloads: true,
    gitopsOwnsWorkloads: true,
    rfcMonolithicState: true,
    rfcHasRollback: false,
    rfcHasGates: false,
    capstoneTargetEnv: 'prod',
    capstoneGatesGreen: true,
    capstoneOidcScoped: false,
    capstoneFinOpsApproved: true
  };
}

const outcome = (ok: boolean, verdict: SimOutcome['verdict'], summary: string): SimOutcome => ({
  ok,
  verdict,
  summary,
  provenance: 'SYNTHETIC_FIXTURE'
});

export function parseCIDR(cidr: string): { start: number; end: number; prefix: number } | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d|[12]\d|3[0-2])$/.exec(cidr.trim());
  if (!m) return null;
  const bytes = m.slice(1, 5).map(Number);
  if (bytes.some((n) => n > 255)) return null;
  const prefix = Number(m[5]);
  const address = (bytes[0] * 0x1000000 + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3]) >>> 0;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const start = (address & mask) >>> 0;
  return { start, end: (start | (~mask >>> 0)) >>> 0, prefix };
}

export function cidrOverlap(a: string, b: string): boolean | null {
  const left = parseCIDR(a);
  const right = parseCIDR(b);
  if (!left || !right) return null;
  return left.start <= right.end && right.start <= left.end;
}

export function planIntegrity(
  expected: { commit: string; env: string; digest: string },
  actual: { commit: string; env: string; digest: string }
): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  if (expected.commit !== actual.commit) problems.push('commit diferente');
  if (expected.env !== actual.env) problems.push('entorno diferente');
  if (expected.digest !== actual.digest) problems.push('digest del artefacto diferente');
  return { ok: problems.length === 0, problems };
}

export function estimateCost(replicas: number, costPerReplica = 61, budget = 250) {
  const estimate = Math.max(0, Math.min(50, Math.floor(replicas))) * costPerReplica;
  return { estimate, budget, exceeds: estimate > budget, provenance: 'SYNTHETIC_FIXTURE' as const };
}

/** S01: `for_each` key rename vs `moved` block identity continuity. */
export function simulateForEachRefactor(oldKey: string, newKey: string, hasMovedBlock: boolean): SimOutcome {
  const from = oldKey.trim() || 'old_key';
  const to = newKey.trim() || 'new_key';
  if (from === to) {
    return outcome(true, 'SAFE', `Sin cambio de clave (${from}): dirección estable sin reemplazo.`);
  }
  if (!hasMovedBlock) {
    return outcome(
      false,
      'BLOCKED',
      `Cambio de clave ${from} → ${to} sin bloque moved. Plan ficticio: destroy + create; BLOQUEAR apply y declarar moved.`
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Bloque moved declarado (${from} → ${to}). Revisar que el plan reporte 0 destroy / 0 create antes de aprobar.`
  );
}

/** S02: Remote state lock contention & force-unlock safety. */
export function simulateStateLock(lockAgeMinutes: number, writerActive: boolean, dualApproved: boolean): SimOutcome {
  const age = Math.max(0, Math.floor(lockAgeMinutes));
  if (writerActive) {
    return outcome(
      false,
      'BLOCKED',
      `Writer A sigue activo (lock ${age} min). Writer B: BLOCKED; prohibido usar -lock=false o force-unlock.`
    );
  }
  if (!dualApproved || age < 15) {
    return outcome(
      false,
      'BLOCKED',
      `Writer sin actividad reciente (${age} min), pero falta espera segura (>= 15 min) o doble aprobación del owner para force-unlock.`
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Lock huérfano verificado (${age} min) con writers detenidos y autorización dual: proceder bajo ventana controlada y backup previo.`
  );
}

/** S03: Out-of-band cloud drift triage. */
export function simulateDriftTriage(hclOwner: string, remoteOwner: string, touchesSecurity: boolean): SimOutcome {
  const desired = hclOwner.trim() || 'team-platform';
  const observed = remoteOwner.trim() || 'unknown';
  if (desired === observed && !touchesSecurity) {
    return outcome(true, 'SAFE', `Sin deriva entre Git (${desired}) y observación remota.`);
  }
  if (touchesSecurity) {
    return outcome(
      false,
      'BLOCKED',
      `DRIFT CRÍTICO DE SEGURIDAD (Git="${desired}" vs Cloud="${observed}"). NO aplicar a ciegas: investigar CloudTrail y autoría antes de revertir o adoptar.`
    );
  }
  return outcome(
    false,
    'REVIEW',
    `DRIFT DETECTADO: Owner esperado ${desired}, remoto ${observed}. Acordar con el propietario si importar en Git o restaurar estado deseado.`
  );
}

/** S04: Stateful critical resource deletion guard. */
export function simulateCriticalDestroy(
  environment: 'dev' | 'staging' | 'prod',
  hasPreventDestroy: boolean,
  hasVerifiedBackup: boolean
): SimOutcome {
  if (environment === 'prod' && (!hasPreventDestroy || !hasVerifiedBackup)) {
    return outcome(
      false,
      'BLOCKED',
      `NO-GO en producción: falta ${!hasPreventDestroy ? 'prevent_destroy = true' : ''}${!hasPreventDestroy && !hasVerifiedBackup ? ' y ' : ''}${!hasVerifiedBackup ? 'backup 3-2-1 con restore verificado' : ''}.`
    );
  }
  if (!hasVerifiedBackup) {
    return outcome(
      false,
      'BLOCKED',
      `BLOQUEADO en ${environment}: no existe snapshot/backup verificable antes del cambio destructivo.`
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Controles base presentes en ${environment} (prevent_destroy=${hasPreventDestroy}, backup verificado). Aún requiere ventana aprobada y prueba de restore.`
  );
}

/** S05: Remote backend state migration preflight. */
export function simulateBackendMigration(
  writersFrozen: boolean,
  backupVerified: boolean,
  lockEnabled: boolean
): SimOutcome {
  const missing: string[] = [];
  if (!writersFrozen) missing.push('pipelines escritores activos');
  if (!backupVerified) missing.push('backup versionado sin verificar');
  if (!lockEnabled) missing.push('destino sin bloqueo use_lockfile');
  if (missing.length > 0) {
    return outcome(false, 'BLOCKED', `MIGRACIÓN BLOQUEADA (${missing.join(', ')}). No ejecutar init -migrate-state.`);
  }
  return outcome(
    true,
    'REVIEW',
    'Preflight completo: writers congelados, backup íntegro y bloqueo S3 activo. Ejecutar migración en contexto autorizado y cotejar inventario post-migración.'
  );
}

/** S06: Secret persistence across sensitive outputs, ephemeral vars & state. */
export function simulateSecretExposure(
  handling: 'sensitive_var' | 'ephemeral_var' | 'raw_output',
  persistedInState: boolean
): SimOutcome {
  if (handling === 'raw_output') {
    return outcome(
      false,
      'BLOCKED',
      'EXPOSICIÓN DIRECTA: output sin protección vuelca el secreto en consola, logs CI y terraform.tfstate. Contener y rotar credencial.'
    );
  }
  if (persistedInState) {
    return outcome(
      false,
      'BLOCKED',
      'RIESGO ACTIVO: sensitive = true solo redacta la terminal; el valor persiste en claro dentro de state/tfplan. Rotar secreto y migrar a ephemeral o KMS/Secrets Manager.'
    );
  }
  if (handling === 'ephemeral_var') {
    return outcome(
      true,
      'SAFE',
      'Variable ephemeral sin persistencia en state ni outputs: verifica versión Terraform >= 1.10 y políticas de acceso a logs.'
    );
  }
  return outcome(false, 'REVIEW', 'Revisa trazas de plan guardado y restringe lectura del backend de state.');
}

/** S07: SemVer provider upgrade & `.terraform.lock.hcl` verification. */
export function simulateProviderUpgrade(fromVer: string, toVer: string, lockfilePinned: boolean): SimOutcome {
  const parseMajor = (v: string) => {
    const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(v.trim());
    return m ? { major: Number(m[1]), minor: Number(m[2]) } : null;
  };
  const a = parseMajor(fromVer);
  const b = parseMajor(toVer);
  if (!a || !b) {
    return outcome(false, 'BLOCKED', 'Versión SemVer inválida (usa formato X.Y.Z, ej. 4.67.0 → 5.0.0).');
  }
  if (!lockfilePinned) {
    return outcome(
      false,
      'BLOCKED',
      'BLOQUEADO: .terraform.lock.hcl no fijado. Prohibido ejecutar init -upgrade directo en producción.'
    );
  }
  if (b.major > a.major) {
    return outcome(
      false,
      'REVIEW',
      `Salto MAJOR detectado (${fromVer} → ${toVer}): posible cambio de schema y reemplazos. Exigir changelog, matriz de regresión en sandbox y plan sin destroy inesperado.`
    );
  }
  return outcome(
    true,
    'SAFE',
    `Upgrade compatible (${fromVer} → ${toVer}) con lockfile fijado; validar plan en staging antes de promover.`
  );
}

/** S08: Circular module dependencies & monolithic state blast radius. */
export function simulateModuleCoupling(resourcesInState: number, cycleEdges: number): SimOutcome {
  const count = Math.max(0, Math.floor(resourcesInState));
  const cycles = Math.max(0, Math.floor(cycleEdges));
  if (cycles > 0) {
    return outcome(
      false,
      'BLOCKED',
      `GRAFO INVÁLIDO: ${cycles} dependencia(s) circular(es) activa(s). Romper el ciclo separando contratos de red, seguridad y cómputo.`
    );
  }
  if (count > 250) {
    return outcome(
      false,
      'REVIEW',
      `BLAST RADIUS ALTO (${count} recursos en un solo state). Particionar por capas (network / data / app) y frecuencia de cambio.`
    );
  }
  return outcome(true, 'SAFE', `DAG acíclico y tamaño de state acotado (${count} recursos).`);
}

/** S10: GitHub Actions OIDC federated trust policy validator. */
export function simulateOidcTrust(subjectClaim: string, audience: string, protectedEnv: boolean): SimOutcome {
  const sub = subjectClaim.trim();
  const aud = audience.trim();
  if (aud !== 'sts.amazonaws.com') {
    return outcome(
      false,
      'BLOCKED',
      `Audience OIDC inválida ("${aud || 'vacía'}"). Exigir StringEquals aud = "sts.amazonaws.com".`
    );
  }
  if (!sub.startsWith('repo:') || sub.includes('*') || sub.includes('pull_request')) {
    return outcome(
      false,
      'BLOCKED',
      `Trust OIDC demasiado abierta ("${sub}"): prohibido comodín * o pull_request con rol de escritura.`
    );
  }
  if (!protectedEnv && !sub.includes(':environment:')) {
    return outcome(
      false,
      'REVIEW',
      `Subject "${sub}" sin entorno protegido (:environment:prod). Separar rol read-only de plan y rol restringido de apply.`
    );
  }
  return outcome(true, 'SAFE', `Federación OIDC acotada (${sub}, aud=${aud}) con aprobación de entorno protegido.`);
}

/** S12: `mock_provider` unit coverage vs cloud sandbox integration truth. */
export function simulateTestPyramid(mockPass: boolean, sandboxPass: boolean): SimOutcome {
  if (!mockPass) {
    return outcome(
      false,
      'BLOCKED',
      'Tests unitarios (.tftest.hcl con mock_provider) en FAIL: corregir contratos HCL antes de avanzar.'
    );
  }
  if (!sandboxPass) {
    return outcome(
      false,
      'REVIEW',
      'mock_provider = PASS · Integración cloud = NOT_RUN. Prohibido declarar producción probada; programar prueba efímera en cuenta sandbox con cuotas.'
    );
  }
  return outcome(
    true,
    'SAFE',
    'Pirámide consistente: contratos mock_provider en PASS + prueba de integración en sandbox efímero verificada.'
  );
}

/** S13: Policy-as-Code (OPA/Conftest) exception governance (`TTL <= 14d` + owner). */
export function simulatePolicyException(
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM',
  owner: string,
  ttlDays: number
): SimOutcome {
  const cleanOwner = owner.trim();
  if (severity === 'CRITICAL') {
    return outcome(
      false,
      'BLOCKED',
      'BLOQUEADO: hallazgos CRITICAL (ej. S3/RDS público o clave expuesta) no admiten bypass por excepción; remediar configuración HCL.'
    );
  }
  if (cleanOwner.length < 3) {
    return outcome(
      false,
      'BLOCKED',
      'EXCEPCIÓN RECHAZADA: falta propietario responsable del riesgo (owner obligatorio).'
    );
  }
  if (!Number.isFinite(ttlDays) || ttlDays <= 0 || ttlDays > 14) {
    return outcome(
      false,
      'BLOCKED',
      `EXCEPCIÓN RECHAZADA: vigencia de ${ttlDays} días excede el máximo de 14 días para excepciones auditables.`
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Excepción temporal acotada (${severity}, owner=${cleanOwner}, expira en ${ttlDays} días): requiere ticket y test de caducidad.`
  );
}

/** S14: FinOps cost, tags & SLO protection gate (`platform-finops`). */
export function evaluateFinOpsDecision(replicas: number, hasFinOpsTags: boolean, statefulOnSpot: boolean): SimOutcome {
  const cost = estimateCost(replicas);
  if (!hasFinOpsTags) {
    return outcome(
      false,
      'BLOCKED',
      `BLOQUEADO FinOps: faltan etiquetas obligatorias (Owner, CostCenter, Environment). Estimación ficticia: USD ${cost.estimate}/mes.`
    );
  }
  if (statefulOnSpot) {
    return outcome(
      false,
      'BLOCKED',
      'BLOQUEADO por SLO: prohibido alojar bases de datos primarias o quórum stateful en instancias Spot interrumpibles.'
    );
  }
  if (cost.exceeds) {
    return outcome(
      false,
      'REVIEW',
      `Estimación ficticia: USD ${cost.estimate}/mes supera presupuesto (USD ${cost.budget}). Evaluar ARM64/Graviton, VPC Endpoints o aprobación FinOps.`
    );
  }
  return outcome(
    true,
    'SAFE',
    `Estimación ficticia: USD ${cost.estimate}/mes dentro de umbral (USD ${cost.budget}), etiquetado completo y SLO protegido.`
  );
}

/** S15: Emergency state recovery & DR GameDay RTO evaluation. */
export function simulateEmergencyRecovery(
  writersPaused: boolean,
  dualApproved: boolean,
  rtoMinutes: number
): SimOutcome {
  if (!writersPaused) {
    return outcome(
      false,
      'BLOCKED',
      'INCIDENTE ACTIVO: pausa todos los pipelines escritores antes de inspeccionar o restaurar state.'
    );
  }
  if (!dualApproved) {
    return outcome(
      false,
      'BLOCKED',
      'BLOQUEADO: recuperación de state o force-unlock de emergencia exige revisión y aprobación dual.'
    );
  }
  if (rtoMinutes > 60) {
    return outcome(
      false,
      'REVIEW',
      `RTO estimado (${rtoMinutes} min) supera objetivo Nivel 2 (60 min): ensayar restore aislado y reconciliar drift cloud antes de conmutar.`
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Runbook DR controlado (writers pausados, aprobación dual, RTO objetivo ${rtoMinutes} min): comparar backup S3 contra estado real antes de restaurar.`
  );
}

/** S16: Controller ownership boundary between Terraform and Helm/Argo CD. */
export function simulateGitOpsOwnership(
  tfOwnsCluster: boolean,
  tfOwnsWorkloads: boolean,
  gitopsOwnsWorkloads: boolean
): SimOutcome {
  if (!tfOwnsCluster) {
    return outcome(
      false,
      'REVIEW',
      'Sin plano IaC para VPC/EKS/IAM base: define quién aprovisiona y versiona el clúster y Pod Identity.'
    );
  }
  if (tfOwnsWorkloads && gitopsOwnsWorkloads) {
    return outcome(
      false,
      'BLOCKED',
      'GUERRA DE RECONCILIACIÓN: Terraform y Argo CD/Helm mutan los mismos Deployments. Asignar infraestructura base a Terraform y workloads a GitOps.'
    );
  }
  if (!tfOwnsWorkloads && gitopsOwnsWorkloads) {
    return outcome(
      true,
      'SAFE',
      'Frontera limpia: Terraform gestiona VPC/EKS/RDS/Pod Identity y Argo CD reconcilia namespaces/workloads sin colisión.'
    );
  }
  return outcome(
    false,
    'REVIEW',
    'Workloads sin reconciliador GitOps declarativo o acoplados al pipeline de infraestructura.'
  );
}

/** S17: Platform IaC RFC review & P0/P1/P2 finding prioritization. */
export function simulateRfcPrioritization(
  monolithicState: boolean,
  hasRollback: boolean,
  hasGates: boolean
): SimOutcome {
  const p0: string[] = [];
  if (monolithicState) p0.push('P0: state monolítico para toda la nube');
  if (!hasRollback) p0.push('P0: ausencia de plan de rollback/backup verificado');
  if (!hasGates) p0.push('P1: pipeline sin gates fmt/validate/policy/aprobación');
  if (p0.length > 0) {
    return outcome(
      false,
      'BLOCKED',
      `NO-GO en revisión RFC (${p0.join(' · ')}). Proponer partición incremental con baseline antes de migrar.`
    );
  }
  return outcome(
    true,
    'SAFE',
    'RFC defendible: estados aislados por dominio, gates automatizados y rollback documentado para entrega incremental.'
  );
}

/** S18: Multi-environment Capstone promotion gate (`dev -> staging -> prod`). */
export function simulateCapstonePromotion(
  targetEnv: 'dev' | 'staging' | 'prod',
  gatesGreen: boolean,
  oidcScoped: boolean,
  finopsApproved: boolean
): SimOutcome {
  if (!gatesGreen) {
    return outcome(
      false,
      'BLOCKED',
      `Promoción a ${targetEnv} BLOQUEADA: fmt/validate/test/policy deben estar en PASS.`
    );
  }
  if (!oidcScoped) {
    return outcome(
      false,
      'BLOCKED',
      `Promoción a ${targetEnv} BLOQUEADA: falta federación OIDC mínima aislada por entorno.`
    );
  }
  if (targetEnv === 'prod' && !finopsApproved) {
    return outcome(
      false,
      'BLOCKED',
      'Promoción a producción BLOQUEADA: requiere revisión de presupuesto FinOps, aprobación de owners y artefacto de plan inmutable.'
    );
  }
  return outcome(
    true,
    'REVIEW',
    `Candidato ${targetEnv.toUpperCase()} listo para revisión humana final (gates técnicos, OIDC por entorno y control FinOps verificados en simulación).`
  );
}

const VALID_ENVS = ['dev', 'staging', 'prod'] as const;
const VALID_SECRET_MODES = ['sensitive_var', 'ephemeral_var', 'raw_output'] as const;
const VALID_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM'] as const;

export function updateSimulatorText(inputs: SimulatorInputs, key: string, raw: string): boolean {
  const clean = raw.slice(0, 120);
  switch (key) {
    case 'oldKey':
    case 'newKey':
    case 'hclOwner':
    case 'remoteOwner':
    case 'providerFrom':
    case 'providerTo':
    case 'cidrA':
    case 'cidrB':
    case 'oidcSubject':
    case 'oidcAudience':
    case 'approvedCommit':
    case 'appliedCommit':
    case 'exceptionOwner':
      inputs[key] = clean;
      return true;
    case 'criticalEnv':
    case 'capstoneTargetEnv':
      if ((VALID_ENVS as readonly string[]).includes(clean)) {
        inputs[key] = clean as 'dev' | 'staging' | 'prod';
        return true;
      }
      return false;
    case 'secretHandling':
      if ((VALID_SECRET_MODES as readonly string[]).includes(clean)) {
        inputs.secretHandling = clean as SimulatorInputs['secretHandling'];
        return true;
      }
      return false;
    case 'policySeverity':
      if ((VALID_SEVERITIES as readonly string[]).includes(clean)) {
        inputs.policySeverity = clean as SimulatorInputs['policySeverity'];
        return true;
      }
      return false;
    default:
      return false;
  }
}

export function updateSimulatorNumber(inputs: SimulatorInputs, key: string, raw: number): boolean {
  const clamped = Number.isFinite(raw) ? Math.max(0, Math.min(2000, Math.floor(raw))) : 0;
  switch (key) {
    case 'lockAgeMinutes':
    case 'stateResourceCount':
    case 'cycleCount':
    case 'exceptionTtlDays':
    case 'simulatedReplicas':
    case 'drRtoMinutes':
      inputs[key] = clamped;
      return true;
    default:
      return false;
  }
}

export function updateSimulatorBoolean(inputs: SimulatorInputs, key: string, checked: boolean): boolean {
  switch (key) {
    case 'hasMovedBlock':
    case 'writerActive':
    case 'lockDualApproved':
    case 'driftTouchesSecurity':
    case 'hasPreventDestroy':
    case 'hasVerifiedBackup':
    case 'writersFrozen':
    case 'migrationBackupVerified':
    case 'migrationLockEnabled':
    case 'secretInState':
    case 'lockfilePinned':
    case 'oidcProtectedEnv':
    case 'mockTestsPass':
    case 'sandboxIntegrationPass':
    case 'hasFinOpsTags':
    case 'statefulOnSpot':
    case 'drWritersPaused':
    case 'drDualApproved':
    case 'tfOwnsCluster':
    case 'tfOwnsWorkloads':
    case 'gitopsOwnsWorkloads':
    case 'rfcMonolithicState':
    case 'rfcHasRollback':
    case 'rfcHasGates':
    case 'capstoneGatesGreen':
    case 'capstoneOidcScoped':
    case 'capstoneFinOpsApproved':
      inputs[key] = checked;
      return true;
    default:
      return false;
  }
}

/** Unified dispatcher for all 18 Senior scenarios (`S01–S18`). */
export function runCaseSimulator(caseId: string, inputs: SimulatorInputs): string {
  switch (caseId) {
    case 'S01':
      return simulateForEachRefactor(inputs.oldKey, inputs.newKey, inputs.hasMovedBlock).summary;
    case 'S02':
      return simulateStateLock(inputs.lockAgeMinutes, inputs.writerActive, inputs.lockDualApproved).summary;
    case 'S03':
      return simulateDriftTriage(inputs.hclOwner, inputs.remoteOwner, inputs.driftTouchesSecurity).summary;
    case 'S04':
      return simulateCriticalDestroy(inputs.criticalEnv, inputs.hasPreventDestroy, inputs.hasVerifiedBackup).summary;
    case 'S05':
      return simulateBackendMigration(inputs.writersFrozen, inputs.migrationBackupVerified, inputs.migrationLockEnabled)
        .summary;
    case 'S06':
      return simulateSecretExposure(inputs.secretHandling, inputs.secretInState).summary;
    case 'S07':
      return simulateProviderUpgrade(inputs.providerFrom, inputs.providerTo, inputs.lockfilePinned).summary;
    case 'S08':
      return simulateModuleCoupling(inputs.stateResourceCount, inputs.cycleCount).summary;
    case 'S09': {
      const overlap = cidrOverlap(inputs.cidrA, inputs.cidrB);
      return overlap === null
        ? 'Formato CIDR inválido'
        : overlap
          ? 'BLOQUEADO: los rangos se superponen.'
          : 'Sin superposición entre estos dos rangos; revisar IPAM completo.';
    }
    case 'S10':
      return simulateOidcTrust(inputs.oidcSubject, inputs.oidcAudience, inputs.oidcProtectedEnv).summary;
    case 'S11': {
      const integrity = planIntegrity(
        { commit: inputs.approvedCommit, env: 'prod', digest: 'sha256-a1' },
        {
          commit: inputs.appliedCommit,
          env: 'prod',
          digest: inputs.approvedCommit === inputs.appliedCommit ? 'sha256-a1' : 'sha256-b2'
        }
      );
      return integrity.ok
        ? 'Coincidencia local de datos del fixture; todavía requiere autorización real.'
        : `BLOQUEADO: ${integrity.problems.join(', ')}.`;
    }
    case 'S12':
      return simulateTestPyramid(inputs.mockTestsPass, inputs.sandboxIntegrationPass).summary;
    case 'S13':
      return simulatePolicyException(inputs.policySeverity, inputs.exceptionOwner, inputs.exceptionTtlDays).summary;
    case 'S14':
      return evaluateFinOpsDecision(inputs.simulatedReplicas, inputs.hasFinOpsTags, inputs.statefulOnSpot).summary;
    case 'S15':
      return simulateEmergencyRecovery(inputs.drWritersPaused, inputs.drDualApproved, inputs.drRtoMinutes).summary;
    case 'S16':
      return simulateGitOpsOwnership(inputs.tfOwnsCluster, inputs.tfOwnsWorkloads, inputs.gitopsOwnsWorkloads).summary;
    case 'S17':
      return simulateRfcPrioritization(inputs.rfcMonolithicState, inputs.rfcHasRollback, inputs.rfcHasGates).summary;
    case 'S18':
      return simulateCapstonePromotion(
        inputs.capstoneTargetEnv,
        inputs.capstoneGatesGreen,
        inputs.capstoneOidcScoped,
        inputs.capstoneFinOpsApproved
      ).summary;
    default:
      return 'Escenario de simulación no reconocido.';
  }
}
