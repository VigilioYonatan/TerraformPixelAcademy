/** 18 deterministic, synthetic scenario drills. Not a Terraform/Cloud execution engine. */
export interface SeniorDrill {
  id: string;
  prompt: string;
  options: readonly [string, string];
  correct: 0 | 1;
  good: string;
  bad: string;
  evidence: string;
}
export const seniorDrills: readonly SeniorDrill[] = [
  {
    id: 'S01',
    prompt: 'El plan muestra destroy/create tras renombrar una clave for_each. ¿Qué revisión autorizas?',
    options: [
      'Revisar moved + direcciones, bloquear destroy y comparar planes',
      'Aplicar y confiar en que el sistema se recuperará'
    ],
    correct: 0,
    good: 'GO condicionado: registrar moved y confirmar un plan sin reemplazos inesperados.',
    bad: 'NO-GO: el cambio de claves altera direcciones Terraform; la continuidad no está garantizada.',
    evidence: 'Mapa de direcciones old/new, plan previo y posterior, revisión de owner'
  },
  {
    id: 'S02',
    prompt: 'Un writer mantiene el lock y un segundo job no puede aplicar. ¿Qué harías?',
    options: [
      'Quitar lock con -lock=false y continuar',
      'Identificar job propietario, esperar/cancelar y replanificar'
    ],
    correct: 1,
    good: 'Espera controlada y verificación de ownership; force-unlock solo con investigación y aprobación.',
    bad: 'NO-GO: desactivar lock permite carreras y corrupción potencial del estado.',
    evidence: 'Job ID, propietario del lock, timestamps y estado del primer writer'
  },
  {
    id: 'S03',
    prompt: 'Hay tags diferentes entre Git, state y recurso remoto. ¿Cómo procedes?',
    options: [
      'Investigar origen y decidir adopción o reversión con plan controlado',
      'Modificar el state a mano para ocultar la deriva'
    ],
    correct: 0,
    good: 'Se identifica drift antes de reconciliar y se conserva el rastro del cambio fuera de banda.',
    bad: 'NO-GO: editar el state a ciegas destruye trazabilidad y no corrige la causa.',
    evidence: 'Snapshot saneado de Git/state/remoto y plan con proveedor autorizado'
  },
  {
    id: 'S04',
    prompt: 'Un plan intenta eliminar un recurso de datos de producción sin backup verificado.',
    options: [
      'Aprobar si terraform validate termina sin errores',
      'Bloquear, clasificar datos y exigir recuperación probada'
    ],
    correct: 1,
    good: 'NO-GO hasta demostrar backup/restore, dependencia, ventana y aprobación del owner.',
    bad: 'NO-GO: validate revisa estructura, no riesgos de disponibilidad ni pérdida de datos.',
    evidence: 'Plan firmado/identificado, aprobación del propietario y evidencia de restauración'
  },
  {
    id: 'S05',
    prompt: 'Vas a mover un backend local a S3 con bloqueo. ¿Qué secuencia es defendible?',
    options: [
      'Congelar escritores, backup, verificar destino, migrar y contrastar estado',
      'Cambiar bucket/key y asumir que el state seguirá intacto'
    ],
    correct: 0,
    good: 'Migración condicionada a backup, ownership, bloqueo y verificación de estado posterior.',
    bad: 'NO-GO: cambiar el backend sin preflight puede dividir el ownership o perder estado.',
    evidence: 'Inventario de workspaces, versión del backup, bloqueo y comparación pre/post'
  },
  {
    id: 'S06',
    prompt: 'Un secreto aparece en un plan guardado en CI. ¿Cuál es el primer control?',
    options: [
      'Declarar la variable sensitive y dejar el artefacto público',
      'Restringir/eliminar exposición y rotar secreto antes de reintentar'
    ],
    correct: 1,
    good: 'Contención, rotación, revisión de accesos y prevención de reexposición.',
    bad: 'NO-GO: sensitive puede ocultar salida, pero no elimina todo el secreto de state/plan.',
    evidence: 'Registro de contención, rotación, retención y controles de acceso'
  },
  {
    id: 'S07',
    prompt: 'Una actualización de provider cambia el schema y propone reemplazos.',
    options: [
      'Fijar versiones, revisar notas, plan en entorno aislado y estrategia de rollback',
      'Actualizar todos los providers en producción sin lockfile'
    ],
    correct: 0,
    good: 'Upgrade con lockfile, matriz de compatibilidad y evidencia de cambios esperados.',
    bad: 'NO-GO: sin lockfile ni plan reproducible no se conoce el impacto del upgrade.',
    evidence: 'Versiones antes/después, .terraform.lock.hcl, plan y pruebas de regresión'
  },
  {
    id: 'S08',
    prompt: 'Dos módulos se necesitan mutuamente y Terraform detecta un ciclo.',
    options: [
      'Agregar depends_on entre ambos módulos',
      'Rediseñar el contrato y extraer una dependencia común desacoplada'
    ],
    correct: 1,
    good: 'Se rompe el ciclo haciendo explícito el contrato unidireccional de dependencias.',
    bad: 'NO-GO: más depends_on no resuelve un grafo con dependencias circulares.',
    evidence: 'Grafo antes/después, inputs/outputs y pruebas de módulos'
  },
  {
    id: 'S09',
    prompt: 'Development y producción tienen CIDR solapados y necesitan conectividad.',
    options: [
      'Bloquear peering y rediseñar direcciones mediante IPAM',
      'Crear rutas más específicas y esperar que no existan conflictos'
    ],
    correct: 0,
    good: 'Conflicto detectado; planificación IPAM requerida antes de conectar.',
    bad: 'NO-GO: rutas más específicas no garantizan direccionamiento único entre redes.',
    evidence: 'CIDR calculados, inventario IPAM, rutas y plan de renumeración'
  },
  {
    id: 'S10',
    prompt: 'Un workflow GitHub Actions usa una access key de AWS de larga duración.',
    options: [
      'Guardar la misma clave en otro secreto del repositorio',
      'Federar OIDC y restringir trust policy, audiencia y permisos IAM'
    ],
    correct: 1,
    good: 'Credenciales efímeras y autorización mínima por repositorio/rama/entorno.',
    bad: 'NO-GO: mover la misma clave no elimina el riesgo de credenciales persistentes.',
    evidence: 'Trust policy OIDC, permissions id-token y prueba de acceso limitado'
  },
  {
    id: 'S11',
    prompt: 'Se aprobó el plan del commit A, pero el pipeline aplica el commit B.',
    options: [
      'Rechazar el apply y verificar digest, commit y entorno del plan aprobado',
      'Aplicar porque ambos commits están en la misma rama'
    ],
    correct: 0,
    good: 'Cadena plan-aprobación-apply vinculada a un único artefacto inmutable.',
    bad: 'NO-GO: una rama mutable no identifica el artefacto aprobado.',
    evidence: 'SHA-256 del plan, commit, entorno, aprobaciones y logs del runner'
  },
  {
    id: 'S12',
    prompt: 'Un módulo pasó terraform test con mock_provider, pero no se validó una API real.',
    options: [
      'Declarar integración cloud PASS automáticamente',
      'Mantener mocks como evidencia unitaria y exigir prueba aislada real aparte'
    ],
    correct: 1,
    good: 'Se distinguen niveles de prueba y se mantiene NOT_RUN para integración.',
    bad: 'NO-GO: mocks no demuestran permisos, cuotas, latencias o errores del proveedor.',
    evidence: 'Resultados test mock y evidencia separada de test de integración real'
  },
  {
    id: 'S13',
    prompt: 'Una política deniega exposición pública y un equipo solicita excepción.',
    options: [
      'Registrar excepción temporal, owner, TTL, compensación y aprobación',
      'Deshabilitar la política global para desbloquear la release'
    ],
    correct: 0,
    good: 'La excepción queda limitada, auditada, reversible y con vencimiento.',
    bad: 'NO-GO: desactivar política global suprime el guardrail de todos los equipos.',
    evidence: 'Policy evaluation, excepción firmada, TTL y controles compensatorios'
  },
  {
    id: 'S14',
    prompt: 'El plan aumenta capacidad y el costo previsto supera el umbral.',
    options: [
      'Aplicar y revisar factura al mes siguiente',
      'Exigir estimación, SLA, owner de presupuesto y cambio aprobado'
    ],
    correct: 1,
    good: 'Decisión FinOps antes de apply con presupuesto y trade-off explícito.',
    bad: 'NO-GO: el impacto financiero debe revisarse antes del despliegue.',
    evidence: 'Estimación de costo, baseline, SLA, cuota y aprobación financiera'
  },
  {
    id: 'S15',
    prompt: 'Un state parece corrupto y un operador pide ejecutar force-unlock ya.',
    options: [
      'Congelar writers, diagnosticar, respaldar y recuperar con autorización',
      'Borrar lock y sobrescribir state con cualquier archivo reciente'
    ],
    correct: 0,
    good: 'Procedimiento de recuperación con snapshot verificable y doble control.',
    bad: 'NO-GO: desbloqueo/restore no autorizado puede empeorar la pérdida de estado.',
    evidence: 'Versiones state, timestamps, ownership, recuperación probada y RCA'
  },
  {
    id: 'S16',
    prompt: 'Terraform administra un recurso que también reconcilia Helm/GitOps.',
    options: [
      'Permitir que ambos editen el mismo objeto',
      'Definir un solo controlador por campo/recurso y contrato de handoff'
    ],
    correct: 1,
    good: 'Se clarifica ownership, límites IaC/GitOps y las interfaces de entrega.',
    bad: 'NO-GO: dos reconciliadores generan drift y conflictos continuos.',
    evidence: 'Matriz de ownership, recursos y campos controlados, flujo de handoff'
  },
  {
    id: 'S17',
    prompt: 'En revisión de plataforma faltan rollback, pruebas y owners aunque el HCL compile.',
    options: [
      'Bloquear aprobación hasta documentar riesgos, pruebas y responsables',
      'Aprobar con el argumento de que el código es legible'
    ],
    correct: 0,
    good: 'Review gate exige evidencia, ownership, política y operación, no solo sintaxis.',
    bad: 'NO-GO: compilación y estilo no prueban seguridad operacional.',
    evidence: 'Checklist de revisión, ADR, testing, plan, costos y matriz de owners'
  },
  {
    id: 'S18',
    prompt: 'El capstone tiene módulos, pero no define estados separados ni respuesta a incidentes.',
    options: [
      'Entregar tal cual porque compila',
      'Separar responsabilidades, documentar ocho hitos y evidencias con rollback'
    ],
    correct: 1,
    good: 'Preparación Senior: evidencias diferenciadas por hito y límites de arquitectura claros.',
    bad: 'NO-GO: un capstone sin ownership, estados ni recuperación no está operativo.',
    evidence: 'Ocho entregables con estado real, ADR, pruebas y plan de rollback'
  }
];
export function getSeniorDrill(id: string): SeniorDrill | undefined {
  return seniorDrills.find((s) => s.id === id);
}
export function evaluateSeniorDrill(
  id: string,
  choice: number
): { ok: boolean; message: string; next: string; source: 'SYNTHETIC_SCENARIO' } | null {
  const drill = getSeniorDrill(id);
  if (!drill || !Number.isInteger(choice) || choice < 0 || choice > 1) return null;
  return {
    ok: choice === drill.correct,
    message: choice === drill.correct ? drill.good : drill.bad,
    next: drill.evidence,
    source: 'SYNTHETIC_SCENARIO'
  };
}
