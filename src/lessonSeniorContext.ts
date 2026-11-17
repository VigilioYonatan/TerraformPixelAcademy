/**
 * Per-lesson Senior Production Architecture Context (`F4-02`).
 * Maps every single lesson (`B01–A12`) to a unique production failure mode,
 * an architecture review prompt, and its directly connected Senior Incident (`S01–S18`).
 */
export interface LessonSeniorContext {
  lessonId: string;
  relatedCaseId: string;
  domain: string;
  productionRisk: string;
  architecturePrompt: string;
}

export const LESSON_SENIOR_CONTEXTS: Readonly<Record<string, LessonSeniorContext>> = {
  B01: {
    lessonId: 'B01',
    relatedCaseId: 'S03',
    domain: 'Gobernanza Declarativa',
    productionRisk:
      'Mezclar cambios manuales en consola (ClickOps) con código HCL rompe la fuente única de verdad y genera drift silencioso.',
    architecturePrompt:
      '¿Qué recursos de tu plataforma tienen prohibido editarse fuera de Git y cómo auditas cambios manuales de emergencia?'
  },
  B02: {
    lessonId: 'B02',
    relatedCaseId: 'S07',
    domain: 'Reproducibilidad CLI',
    productionRisk:
      'Ejecutar versiones dispares del binario Terraform entre laptops y runners CI provoca planes inconsistentes o incompatibilidad de formato de state.',
    architecturePrompt:
      '¿Cómo fijas required_version y verificas checksums SHA-256 del binario CLI en todos tus pipelines antes de correr init?'
  },
  B03: {
    lessonId: 'B03',
    relatedCaseId: 'S08',
    domain: 'Contratos HCL',
    productionRisk:
      'Hardcodear ARNs o IDs como strings literales en lugar de expresiones HCL oculta dependencias al grafo y causa fallos de orden al destruir o recrear.',
    architecturePrompt:
      '¿Dónde estás pasando cadenas copiadas manualmente que deberían expresarse como atributos tipados entre bloques?'
  },
  B04: {
    lessonId: 'B04',
    relatedCaseId: 'S04',
    domain: 'Ciclo de Vida de Recursos',
    productionRisk:
      'Todo bloque resource administrado entra al state y puede ser destruido si desaparece del código o cambia un atributo ForceNew.',
    architecturePrompt:
      'Antes de incorporar un recurso con datos persistentes, ¿definiste su clase de criticidad, backup externo 3-2-1 y owner?'
  },
  B05: {
    lessonId: 'B05',
    relatedCaseId: 'S06',
    domain: 'Frontera de Entradas',
    productionRisk:
      'Variables sin tipo estricto ni validación aceptan valores inválidos tarde en apply, y guardar secretos en archivos .tfvars versionados filtra credenciales.',
    architecturePrompt:
      '¿Qué validaciones shift-left deben rechazar entradas inválidas en plan y cómo inyectas secretos efímeros sin persistirlos en Git?'
  },
  B06: {
    lessonId: 'B06',
    relatedCaseId: 'S06',
    domain: 'Exposición en Outputs',
    productionRisk:
      'Publicar cadenas de conexión o tokens en outputs propaga material sensible hacia artefactos CI, logs y consumidores remotos de state.',
    architecturePrompt:
      '¿Cuáles outputs de tu stack son estrictamente necesarios como contrato público y cuáles deben eliminarse o manejarse vía KMS/Secrets Manager?'
  },
  B07: {
    lessonId: 'B07',
    relatedCaseId: 'S08',
    domain: 'Topología DAG y Blast Radius',
    productionRisk:
      'Abusar de depends_on a nivel de módulo serializa despliegues enteros, fuerza lecturas diferidas de data sources y puede introducir ciclos irreconciliables.',
    architecturePrompt:
      'Si reemplazas el nodo raíz de este grafo en producción, ¿cuántos recursos aguas abajo entran en recreación en cascada?'
  },
  B08: {
    lessonId: 'B08',
    relatedCaseId: 'S12',
    domain: 'Límites de Validación Estática',
    productionRisk:
      'Asumir que terraform validate garantiza un despliegue exitoso ignora cuotas IAM, colisiones de nombres globales, políticas SCP y rechazos de API cloud.',
    architecturePrompt:
      '¿Cómo separas en tus reportes CI la evidencia estática (fmt/validate PASS) de la validación real en sandbox (NOT_RUN / PASS)?'
  },
  B09: {
    lessonId: 'B09',
    relatedCaseId: 'S04',
    domain: 'Protección contra Destrucción',
    productionRisk:
      'Un símbolo -/+ sobre bases de datos, buckets o claves KMS implica pérdida irreversible de datos o corte de servicio aunque el HCL compile.',
    architecturePrompt:
      'Además de prevent_destroy en HCL, ¿qué política de bucket/SCP e instantánea verificada impiden borrar datos primarios por accidente?'
  },
  B10: {
    lessonId: 'B10',
    relatedCaseId: 'S06',
    domain: 'Seguridad del State',
    productionRisk:
      'Marcar sensitive = true oculta valores en consola, pero el texto plano sigue escrito dentro de terraform.tfstate y de cualquier binario tfplan guardado.',
    architecturePrompt:
      '¿Quién tiene permiso s3:GetObject sobre tu bucket de state productivo y cómo auditas cada lectura en CloudTrail?'
  },
  B11: {
    lessonId: 'B11',
    relatedCaseId: 'S01',
    domain: 'Estabilidad de Direcciones',
    productionRisk:
      'Usar count sobre listas ordenables o renombrar claves de for_each desplaza índices y ordena destruir/recrear instancias sanas en producción.',
    architecturePrompt:
      'Si mañana eliminas el primer elemento de esta colección, ¿tus direcciones de estado permanecen inmutables o desencadenan reemplazos masivos?'
  },
  B12: {
    lessonId: 'B12',
    relatedCaseId: 'S17',
    domain: 'Estructura de Root Module',
    productionRisk:
      'Acumular red, datos, IAM y workloads dentro de un único root module convierte cada cambio menor en un plan lento y de alto riesgo operativo.',
    architecturePrompt:
      '¿Qué criterio de cadencia de cambio y dominio de fallo usarías para dividir este módulo raíz antes de llevarlo a producción?'
  },
  I01: {
    lessonId: 'I01',
    relatedCaseId: 'S08',
    domain: 'Fronteras de Módulos',
    productionRisk:
      'Módulos “wrapper” ultrafinos por recurso o megamódulos multi-equipo acoplan ciclos de release y bloquean actualizaciones independientes.',
    architecturePrompt:
      '¿El contrato de variables y outputs de este módulo encapsula una capacidad clara con un único equipo propietario?'
  },
  I02: {
    lessonId: 'I02',
    relatedCaseId: 'S07',
    domain: 'Gobernanza de Providers y Lockfile',
    productionRisk:
      'Omitir .terraform.lock.hcl o correr init -upgrade directo en producción introduce cambios mayores de schema del provider con reemplazos imprevistos.',
    architecturePrompt:
      '¿Incluyes hashes multiplataforma (zh:/h1:) en .terraform.lock.hcl y ejecutas init -lockfile=readonly en tu pipeline CI?'
  },
  I03: {
    lessonId: 'I03',
    relatedCaseId: 'S16',
    domain: 'Consulta vs Propiedad Exclusiva',
    productionRisk:
      'Importar o declarar como resource un objeto que ya administra otro stack genera doble ownership y guerras de reconciliación.',
    architecturePrompt:
      'Para cada dependencia externa leída con data, ¿está documentado qué repositorio posee su ciclo de vida y qué pasa si cambia su contrato?'
  },
  I04: {
    lessonId: 'I04',
    relatedCaseId: 'S01',
    domain: 'Refactorización Segura de Estado',
    productionRisk:
      'Ejecutar terraform state mv manual sin respaldo ni revisión deja discrepancias entre ramas; un bloque moved mal apuntado aún puede forzar recreación.',
    architecturePrompt:
      '¿Verificaste que el plan posterior al bloque moved reporta 0 destroy y 0 create antes de aprobar la promoción a producción?'
  },
  I05: {
    lessonId: 'I05',
    relatedCaseId: 'S11',
    domain: 'Inspección Forense de Planes',
    productionRisk:
      'Aprobar un PR mirando solo el conteo resumido ignora el orden delete-then-create vs create-before-destroy y los cambios ocultos por known after apply.',
    architecturePrompt:
      '¿Cómo garantizas que el artefacto tfplan revisado por los owners sea bit a bit el mismo que recibe terraform apply?'
  },
  I06: {
    lessonId: 'I06',
    relatedCaseId: 'S02',
    domain: 'Bloqueo y Concurrencia de State',
    productionRisk:
      'Dos jobs concurrentes sin bloqueo nativo o el uso imprudente de -lock=false / force-unlock corrompen el estado remoto en pleno despliegue.',
    architecturePrompt:
      'Si un pipeline muere dejando el lock activo en S3, ¿cuál es tu protocolo de verificación de procesos vivos y doble aprobación antes de desbloquear?'
  },
  I07: {
    lessonId: 'I07',
    relatedCaseId: 'S18',
    domain: 'Aislamiento por Entorno y Capa',
    productionRisk:
      'Compartir un mismo backend key o rol IAM entre dev, staging y prod permite que una prueba experimental impacte recursos productivos.',
    architecturePrompt:
      '¿Tus estados de red, datos y aplicación están particionados por cuenta/prefijo con identidades OIDC disjuntas por ambiente?'
  },
  I08: {
    lessonId: 'I08',
    relatedCaseId: 'S08',
    domain: 'Contratos entre Stacks',
    productionRisk:
      'Acoplar stacks mediante terraform_remote_state completo expone todo el estado sensible y bloquea refactors internos del módulo productor.',
    architecturePrompt:
      '¿Expones únicamente IDs inmutables no sensibles con semántica versionada entre capas de red y plataforma?'
  },
  I09: {
    lessonId: 'I09',
    relatedCaseId: 'S12',
    domain: 'Pirámide de Pruebas IaC',
    productionRisk:
      'Un mock_provider sintetiza respuestas ideales y jamás detecta errores reales de IAM, límites regionales, tiempos de propagación ni validaciones del API cloud.',
    architecturePrompt:
      '¿Qué controles validas en milisegundos con mock_provider y cuáles exigen un job efímero con TTL en cuenta sandbox aislada?'
  },
  I10: {
    lessonId: 'I10',
    relatedCaseId: 'S13',
    domain: 'Policy-as-Code y Gestión de Excepciones',
    productionRisk:
      'Añadir comentarios ignore globales para destrabar un release urgente desactiva permanentemente controles de cifrado, red pública y etiquetado.',
    architecturePrompt:
      '¿Toda excepción de seguridad en tu pipeline exige ticket, dueño del riesgo, alcance mínimo y fecha de expiración automática <= 14 días?'
  },
  I11: {
    lessonId: 'I11',
    relatedCaseId: 'S11',
    domain: 'Integridad del Pipeline PR → Apply',
    productionRisk:
      'Ejecutar un nuevo terraform plan sin supervisión después del merge aplica cambios no revisados si el código o el estado remoto derivaron entre tanto.',
    architecturePrompt:
      '¿Tu flujo CI vincula commit SHA, digest del plan cifrado, entorno protegido y aprobación humana antes de autorizar apply?'
  },
  I12: {
    lessonId: 'I12',
    relatedCaseId: 'S07',
    domain: 'Ciclo de Vida y Versionado SemVer',
    productionRisk:
      'Publicar cambios incompatibles en un módulo compartido apuntado a main rompe simultáneamente a todos los equipos consumidores en su próximo plan.',
    architecturePrompt:
      '¿Publicas tags inmutables SemVer con notas de migración, bloques moved y matriz de compatibilidad de providers?'
  },
  A01: {
    lessonId: 'A01',
    relatedCaseId: 'S04',
    domain: 'Adopción e Importación Segura',
    productionRisk:
      'Importar un recurso productivo con argumentos HCL incompletos hace que el siguiente plan proponga actualizar en caliente o reemplazar el recurso real.',
    architecturePrompt:
      'Tras declarar el bloque import, ¿exiges que terraform plan llegue a 0 acciones destructivas y contar con snapshot verificado antes del apply?'
  },
  A02: {
    lessonId: 'A02',
    relatedCaseId: 'S05',
    domain: 'Migración de Backend en Producción',
    productionRisk:
      'Ejecutar init -migrate-state con pipelines activos o sin versionado KMS en el destino puede dejar dos estados divergentes (split-brain de infraestructura).',
    architecturePrompt:
      '¿Cuál es tu checklist de congelamiento de writers, checksum previo/posterior del state y plan de rollback si falla la migración?'
  },
  A03: {
    lessonId: 'A03',
    relatedCaseId: 'S06',
    domain: 'Valores Ephemeral y Cero Secretos en State',
    productionRisk:
      'Generar contraseñas con recursos persistentes o pasarlas a atributos normales graba credenciales permanentes en el historial de versiones del bucket de state.',
    architecturePrompt:
      '¿Dónde puedes usar variables/acciones ephemeral (Terraform >= 1.10) o rotación nativa en Secrets Manager + KMS CMK para no persistir secretos?'
  },
  A04: {
    lessonId: 'A04',
    relatedCaseId: 'S10',
    domain: 'Federación OIDC Zero-Trust',
    productionRisk:
      'Una trust policy OIDC que solo valida el repositorio pero acepta cualquier rama o pull_request permite escalar privilegios hacia producción desde un fork o PR.',
    architecturePrompt:
      '¿Tu condición StringEquals en IAM restringe aud, repo, environment:production y separa el rol read-only de plan del rol restringido de apply?'
  },
  A05: {
    lessonId: 'A05',
    relatedCaseId: 'S09',
    domain: 'Arquitectura IPAM y Segmentación 3 AZs',
    productionRisk:
      'Asignar bloques CIDR solapados entre cuentas/entornos impide conectar Transit Gateway o VPC Peering y obliga a recrear VPCs completas con corte total.',
    architecturePrompt:
      '¿Validas matemáticamente la no superposición IPAM y segregas subredes públicas (ALB), privadas (EKS) y aisladas de datos (RDS/PrivateLink)?'
  },
  A06: {
    lessonId: 'A06',
    relatedCaseId: 'S03',
    domain: 'Detección y Respuesta ante Drift',
    productionRisk:
      'Sobrescribir automáticamente el drift con apply puede revertir una mitigación de incidente activa, mientras que aceptarlo a ciegas institucionaliza brechas.',
    architecturePrompt:
      'Cuando terraform plan -detailed-exitcode devuelve código 2 en producción, ¿cómo investigas autoría en CloudTrail antes de decidir revertir o adoptar?'
  },
  A07: {
    lessonId: 'A07',
    relatedCaseId: 'S01',
    domain: 'Estrategias de Reemplazo y Continuidad',
    productionRisk:
      'Activar create_before_destroy falla si el recurso tiene nombre físico fijo, IP estática única o cuota agotada para duplicar capacidad transitoria.',
    architecturePrompt:
      '¿Verificaste límites de cuota regional, desacoplamiento de nombres (name_prefix) y drenado de conexiones antes de confiar en create_before_destroy?'
  },
  A08: {
    lessonId: 'A08',
    relatedCaseId: 'S13',
    domain: 'Cumplimiento Continuo OPA / Conftest',
    productionRisk:
      'Reglas de política sin pruebas unitarias negativas dan falsa sensación de seguridad y dejan pasar buckets públicos o volúmenes sin KMS CMK.',
    architecturePrompt:
      '¿Cada política Rego en tu CI incluye fixtures explícitos de caso permitido, caso denegado y auditoría de excepciones próximas a vencer?'
  },
  A09: {
    lessonId: 'A09',
    relatedCaseId: 'S14',
    domain: 'Gobernanza FinOps e Impacto en SLO',
    productionRisk:
      'Escalar réplicas o NAT Gateways sin presupuesto dispara la factura mensual, pero mover bases de datos primarias a instancias Spot destruye el SLO.',
    architecturePrompt:
      '¿Exiges etiquetas Owner/CostCenter/Environment, VPC Endpoints para S3 y concilias estimaciones Infracost contra OpenCost/CUR real?'
  },
  A10: {
    lessonId: 'A10',
    relatedCaseId: 'S15',
    domain: 'Fundación Multicuenta y DR Ensayado',
    productionRisk:
      'Alojar backups en la misma cuenta productiva o restaurar una versión antigua de state sin reconciliar recursos reales agrava un incidente mayor.',
    architecturePrompt:
      '¿Cuentas con AWS Organizations separadas, backups inmutables 3-2-1 y simulacros GameDay cronometrados para certificar RPO/RTO reales?'
  },
  A11: {
    lessonId: 'A11',
    relatedCaseId: 'S16',
    domain: 'Frontera Limpia Terraform vs GitOps',
    productionRisk:
      'Gestionar Deployments, HPA o valores dinámicos de aplicación simultáneamente desde Terraform y Argo CD desencadena bucles infinitos de sobrescritura.',
    architecturePrompt:
      '¿Está firmado en ADR que Terraform entrega VPC/EKS/RDS/Pod Identity y cede por completo namespaces de aplicación y rollouts a Argo CD?'
  },
  A12: {
    lessonId: 'A12',
    relatedCaseId: 'S18',
    domain: 'Arquitectura Integral de Plataforma',
    productionRisk:
      'Declarar una plataforma lista para producción basándose únicamente en sintaxis HCL local oculta brechas críticas de IAM, costos, observabilidad y DR.',
    architecturePrompt:
      '¿Puedes defender los 8 hitos del Capstone S18 diferenciando qué controles están verificados localmente (PASS) y cuáles requieren sandbox cloud (NOT_RUN)?'
  }
};

export function getLessonSeniorContext(lessonId: string): LessonSeniorContext {
  return (
    LESSON_SENIOR_CONTEXTS[lessonId] || {
      lessonId,
      relatedCaseId: 'S18',
      domain: 'Arquitectura de Plataforma',
      productionRisk: 'Evalúa estado, permisos, costos y recuperación antes de promover a producción.',
      architecturePrompt:
        '¿Qué evidencia reproducible, owner y plan de rollback exigirías antes de autorizar este cambio?'
    }
  );
}
