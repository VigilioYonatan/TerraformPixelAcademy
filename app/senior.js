export const seniorCases = [
    {
        id: 'S01',
        title: 'Reemplazo destructivo por refactor de `for_each`',
        subtitle: 'Contexto: un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar direcciones Terraform.',
        mission: 'señalar recursos afectados, bloquear el apply, evaluar `moved` y documentar un procedimiento de migración de direcciones.',
        artifacts: '`main-before.tf`, `main-after.tf`, fixture de plan con `delete/create`, mapa de recursos y restricciones de disponibilidad.',
        negative: 'alternativa «aplicar y recrear» falla por requisito de continuidad; `moved` incorrecto no debe aprobar.',
        evidence: 'lista de direcciones afectadas, decisión de bloquear, plan de cambios sin destrucción no aprobada, ADR corto.',
        mode: 'grafo + plan simulado + laboratorio descargable opcional con `moved`.',
        severity: 'Crítico',
        pillar: 'State',
        choices: [
            'Aplicar con -auto-approve',
            'Inspeccionar direcciones, declarar moved cuando corresponda y revisar plan',
            'Borrar todo el estado'
        ],
        correct: 1,
        explanation: 'La identidad de recursos y el plan deben revisarse antes de cualquier cambio destructivo.',
        checklist: [
            'Identifiqué las direcciones old_key/new_key y los recursos que podrían reemplazarse',
            'Comprobé cuándo moved conserva identidad y cuándo la migración no es segura',
            'Exigí revisar plan sin delete/create inesperados y registrar NOT_RUN si no se ejecutó',
            'Definí ventana de cambio, owner de state y reversión antes del apply'
        ],
        xp: 300
    },
    {
        id: 'S02',
        title: 'Lock concurrente de state',
        subtitle: 'Contexto: dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.',
        mission: 'evitar ejecuciones simultáneas, decidir cuándo esperar, cancelar/replanificar o investigar un lock sospechoso.',
        artifacts: 'timeline de jobs, IDs de operación ficticios, logs saneados de locking, topología backend.',
        negative: 'desbloquear a la fuerza sin investigación debe fallar; segunda operación no puede considerarse segura mientras otra escribe.',
        evidence: 'runbook de concurrencia, ownership del estado, autorización dual si se propone `force-unlock`.',
        mode: 'simulación determinista; **nunca** ejecutar desbloqueo real desde la web.',
        severity: 'Alto',
        pillar: 'State',
        choices: [
            'Usar -lock=false de forma habitual',
            'Detener escritores, identificar lock activo y operar con una ventana autorizada',
            'Copiar manualmente terraform.tfstate'
        ],
        correct: 1,
        explanation: 'Un bloqueo protege contra escrituras concurrentes; desbloquear exige prueba y owner.',
        checklist: [
            'Identifiqué al escritor propietario y el lock ID sin divulgar secretos',
            'Impedí lock=false y force-unlock prematuro ante escrituras concurrentes',
            'Diseñé verificación del backend y timeout de espera con resultados NOT_RUN si aplica',
            'Establecí autorización dual y recuperación si el lock resulta huérfano'
        ],
        xp: 300
    },
    {
        id: 'S03',
        title: 'Drift fuera de banda',
        subtitle: 'Contexto: alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.',
        mission: 'identificar la desviación, evaluar impacto y elegir reconciliar Git o revertir el cambio externo.',
        artifacts: '`desired.tf`, representación de estado lógico saneado, snapshot cloud ficticio, plan/timeline.',
        negative: '«aceptar todo lo que está en cloud» falla si viola política; no toda deriva autoriza `apply` inmediato.',
        evidence: 'causa probable, blast radius, decisión, responsable y monitoreo posterior.',
        mode: 'diff triple y decisión de incidente.',
        severity: 'Alto',
        pillar: 'Drift',
        choices: [
            'Investigar diferencias y decidir reconciliación',
            'Aplicar sin leer el plan',
            'Editar el state hasta que coincida'
        ],
        correct: 0,
        explanation: 'El drift exige comparar configuración, estado e infraestructura real y encontrar la causa.',
        checklist: [
            'Comparé configuración HCL, state y observación remota sin confundir fuentes',
            'Evalué si la modificación fuera de banda requiere adoptar o revertir el cambio',
            'Propuse refresh/plan controlado con snapshot y procedencia explícita',
            'Documenté propietario, ventana y vigilancia posterior de drift'
        ],
        xp: 300
    },
    {
        id: 'S04',
        title: 'Destrucción de recurso crítico',
        subtitle: 'Contexto: un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.',
        mission: 'clasificar criticidad, bloquear el apply, investigar dependencias, proponer mitigación.',
        artifacts: 'plan fixture crítico, etiquetas de entorno y clase de datos, política de backups.',
        negative: '«aprobar porque el HCL compila» falla; ignorar state y backups falla.',
        evidence: 'decisión «NO GO», protecciones, aprobación formal y plan de rollback/recovery.',
        mode: 'plan review + control de cambios.',
        severity: 'Crítico',
        pillar: 'Seguridad',
        choices: [
            'Borrar y reconstruir ahora',
            'Ignorar cualquier delete en plan',
            'Bloquear el despliegue, evaluar impacto, backup y estrategia de cambio'
        ],
        correct: 2,
        explanation: 'Los cambios destructivos de recursos críticos requieren un control de disponibilidad.',
        checklist: [
            'Clasifiqué criticidad del recurso y volumen de datos potencialmente eliminado',
            'Bloqueé cambios destroy/replace hasta acreditar dependencias y recuperación',
            'Exigí backup/snapshot verificable y prueba de restore documentada',
            'Definí aprobación, punto de parada y runbook de recuperación'
        ],
        xp: 300
    },
    {
        id: 'S05',
        title: 'Migración de backend de estado',
        subtitle: 'Contexto: se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.',
        mission: 'preparar respaldo, congelar writers, verificar destino y explicar `init -migrate-state` en contexto autorizado.',
        artifacts: 'dos topologías, inventario de states, plantilla `backend "s3"` ilustrativa, checklist de migración.',
        negative: 'migración sin backup o con escrituras concurrentes debe bloquearse; no asumir éxito por solo cambiar HCL.',
        evidence: 'runbook, responsables, preflight, verificación de state y rollback.',
        mode: 'laboratorio de decisiones; integración real únicamente en sandbox autorizado.',
        severity: 'Crítico',
        pillar: 'State',
        choices: [
            'Migrar sin respaldo',
            'Congelar escritores, respaldar, validar destino y verificar migración',
            'Cambiar la key y suponer éxito'
        ],
        correct: 1,
        explanation: 'Una migración necesita un runbook reversible, inventario y verificación.',
        checklist: [
            'Congelé escritores y enumeré estados/workspaces sujetos a migración',
            'Verifiqué versión y recuperación de backups antes de init -migrate-state',
            'Comparé estado previo y nuevo sin exponer secretos y registré NOT_RUN donde corresponde',
            'Escribí rollback de backend, permiso, locking y responsables'
        ],
        xp: 300
    },
    {
        id: 'S06',
        title: 'Filtración de secretos en state, plan o logs',
        subtitle: 'Contexto: el equipo incluye un secreto en una variable y descubre que aparece en un plan guardado o state.',
        mission: 'localizar vías de exposición, separar ocultar output de excluir del estado, diseñar contención/rotación y políticas.',
        artifacts: 'ejemplo totalmente ficticio de output enmascarado, plan/state **sintéticos**, guía `sensitive` vs `ephemeral`.',
        negative: 'marcar solo `sensitive = true` sin remediar state falla; registrar secretos en una captura/evidencia falla.',
        evidence: 'matriz de exposición, pasos de contención y control de acceso a artefactos.',
        mode: 'policy hunt + incidente; **nunca usar secretos reales**.',
        severity: 'Crítico',
        pillar: 'Seguridad',
        choices: [
            'Marcar sensitive=true y concluir el incidente',
            'Borrar el archivo de plan y no avisar',
            'Contener acceso, rotar secreto, revisar state/logs y evitar persistencia'
        ],
        correct: 2,
        explanation: 'Sensitive es redacción, no eliminación de secretos del estado.',
        checklist: [
            'Identifiqué la exposición en outputs, logs, planes y state sensible',
            'Exigí rotación/revocación de credenciales y contención del artefacto',
            'Diferencié sensitive de ephemeral y validé compatibilidad de versión',
            'Definí análisis de accesos, limpieza de logs y seguimiento del incidente'
        ],
        xp: 300
    },
    {
        id: 'S07',
        title: 'Upgrade de provider incompatible',
        subtitle: 'Contexto: actualización mayor del provider cambia schema/comportamiento y un plan anuncia reemplazos inesperados.',
        mission: 'analizar compatibilidad, proponer versión fijada, pruebas de regresión y rollout gradual.',
        artifacts: 'lockfile ficticio, changelog resumido, planes antes/después y tests rotos.',
        negative: '`terraform init -upgrade` sin plan de revisión falla; actualizar producción directa falla.',
        evidence: 'matriz versión/impacto, estrategia revertible y checklist de aprobación.',
        mode: 'revisión técnica + comparación de fixtures.',
        severity: 'Alto',
        pillar: 'Providers',
        choices: [
            'Pinnear/planificar upgrade, revisar changelog y ejecutar regresiones',
            'Ejecutar init -upgrade en prod directo',
            'Ignorar cambios del provider'
        ],
        correct: 0,
        explanation: 'Las actualizaciones incompatibles requieren matrices y rollout seguro.',
        checklist: [
            'Inventarié versiones de provider, lockfile y dependencias de módulos',
            'Elegí rango versionado compatible con changelog y runtime fijado',
            'Propuse test de plan y regresión en sandbox, con evidencia NO EJECUTADA si aplica',
            'Definí rollback del lockfile y política de actualización segura'
        ],
        xp: 300
    },
    {
        id: 'S08',
        title: 'Dependencias circulares y módulos acoplados',
        subtitle: 'Contexto: network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.',
        mission: 'romper ciclo con interfaces claras, separar ownership y evitar una capa monolítica innecesaria.',
        artifacts: 'diagrama de grafo circular, interfaces de módulos y errores de planificación de ejemplo.',
        negative: 'mover `depends_on` sin resolver la dependencia lógica no gana; copiar outputs sensibles entre stacks falla.',
        evidence: 'grafo antes/después, razones de estratificación y trade-offs.',
        mode: 'grafo interactivo + ADR.',
        severity: 'Alto',
        pillar: 'Arquitectura',
        choices: [
            'Añadir depends_on a todos los módulos',
            'Romper el ciclo mediante contratos y ownership claros',
            'Copiar todos los outputs en un archivo'
        ],
        correct: 1,
        explanation: 'Un grafo circular requiere rediseño de interfaces y ownership.',
        checklist: [
            'Dibujé el ciclo de dependencias entre módulos y recursos concretos',
            'Definí interfaces output/input que rompen el acoplamiento bidireccional',
            'Revisé cómo terraform graph representaría el orden tras el cambio',
            'Escribí plan de migración incremental con owner y retorno'
        ],
        xp: 300
    },
    {
        id: 'S09',
        title: 'CIDR solapados entre entornos',
        subtitle: 'Contexto: dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.',
        mission: 'detectar solapamiento par-a-par, rechazar topología inválida y revisar contrato/digest del stack de red.',
        artifacts: 'mapa de redes con CIDR ficticios, contratos de variables y matriz de ambientes.',
        negative: 'considerar válido un bloque solapado por pertenecer a otro módulo falla; usar inventario de ejemplo como real falla.',
        evidence: 'CIDR corregidos, test de contrato y límites de red.',
        mode: 'validador local de rangos con pruebas unitarias, sin afirmar haber probado en VPC real.',
        severity: 'Alto',
        pillar: 'Networking',
        choices: [
            'Aceptar solapamiento entre entornos',
            'Crear VPC antes de descubrir IPAM',
            'Detectar superposiciones, ajustar CIDR y probar la topología'
        ],
        correct: 2,
        explanation: 'Rangos superpuestos crean conflicto de rutas, aunque se declaren en módulos distintos.',
        checklist: [
            'Comprobé matemáticamente el solapamiento de CIDR y el blast radius',
            'Contrasté nueva propuesta con la asignación IPAM y conexiones existentes',
            'Definí evidencia de routing/conectividad y marcada NOT_RUN cuando no se probó',
            'Planifiqué migración de IPs, ventana autorizada y rollback de rutas'
        ],
        xp: 300
    },
    {
        id: 'S10',
        title: 'IAM mínimo en GitHub Actions + OIDC',
        subtitle: 'Contexto: workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.',
        mission: 'proponer federación OIDC, permisos limitados por job/entorno, approval gate y roles separados.',
        artifacts: 'workflow YAML de ejemplo vulnerable, trust policy simplificada, roles ficticios.',
        negative: '`id-token: write` global + admin wildcard falla; `pull_request` no confiable con secretos falla.',
        evidence: 'amenazas, trust conditions, matriz roles/jobs, decisiones de promoción.',
        mode: 'code review/policy hunt; no entregar claves reales.',
        severity: 'Crítico',
        pillar: 'IAM',
        choices: [
            'Diseñar trust OIDC limitada y roles mínimos por job/entorno',
            'Compartir claves estáticas de administrador',
            'Conceder permisos * a cualquier PR'
        ],
        correct: 0,
        explanation: 'OIDC sin restricciones de audience, subject y env no es mínimo privilegio.',
        checklist: [
            'Revisé permisos del workflow y alcance de trust policy del rol OIDC',
            'Eliminé llaves estáticas y acoté subject, repo, branch y entorno',
            'Comprobé accesos mínimos y pruebas negativas de identidades no autorizadas',
            'Definí revocación, rotación y respuesta a fallos de federación'
        ],
        xp: 300
    },
    {
        id: 'S11',
        title: 'El plan aprobado no es el plan aplicado',
        subtitle: 'Contexto: un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.',
        mission: 'explicar la ruptura de integridad, diseñar procedencia y validación de plan de despliegue asociada al commit/estado/entorno aprobados, con protección de artefactos sensibles.',
        artifacts: 'dos commits ficticios, hashes de ejemplo, workflow inseguro, dos fixtures con diferencias.',
        negative: 'aprobar plan A y aplicar B falla; descargar un plan arbitrario desde un PR externo falla; un plan obsoleto no se aplica silenciosamente.',
        evidence: 'diagrama seguro PR→aprobación→merge/entorno→plan final→aprobación/aplicación, control de hash y protección de artefactos.',
        mode: 'pipeline simulator + ADR; sin `apply` real.',
        severity: 'Crítico',
        pillar: 'CI/CD',
        choices: [
            'Aprobar plan A y aplicar plan B sin comparar',
            'Autorizar y aplicar exactamente el plan final protegido o bloquear ante drift',
            'Compartir el binario de plan en comentarios públicos'
        ],
        correct: 1,
        explanation: 'La trazabilidad de commit, estado, entorno y artefacto debe preservarse.',
        checklist: [
            'Vinculé commit, environment, state y digest del artefacto autorizado',
            'Evité regenerar otro plan entre la revisión y terraform apply',
            'Distinguí checksum de firma/autorización y controlé almacenamiento sensible',
            'Diseñé gates ante divergencia, expiración de plan y rollback'
        ],
        xp: 300
    },
    {
        id: 'S12',
        title: 'Tests con mocks vs integración',
        subtitle: 'Contexto: un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.',
        mission: 'clasificar qué demuestra cada test y proponer sandbox de integración proporcional al riesgo.',
        artifacts: '`.tftest.hcl` con mock, supuestos del provider, escenarios de integración pendientes.',
        negative: '«mock PASS = producción PASS» falla; tests con `apply` cloud no se corren como unitarios públicos.',
        evidence: 'pirámide de pruebas, `NOT_RUN` explícito y plan de pruebas de integración.',
        mode: 'lectura de tests + diseño experimental.',
        severity: 'Alto',
        pillar: 'Testing',
        choices: [
            'Declarar producción probada por mocks',
            'Omitir todas las pruebas',
            'Distinguir mock PASS de integración NOT_RUN y añadir plan de sandbox'
        ],
        correct: 2,
        explanation: 'Un mock puede ocultar diferencias entre simulación y la API cloud.',
        checklist: [
            'Separé cobertura de mocks de pruebas reales del proveedor cloud',
            'Definí aserciones negativas y casos de error que un mock no reproduce',
            'Registré terraform test con origen y estado NOT_RUN si no hubo CLI',
            'Establecí sandbox, cuotas, limpieza y barrera para promoción a prod'
        ],
        xp: 300
    },
    {
        id: 'S13',
        title: 'Policy as Code y excepciones',
        subtitle: 'Contexto: un recurso incumple cifrado, tags obligatorios o reglas de red; el equipo pide ignorar el scanner por una urgencia.',
        mission: 'corregir política o configuración, documentar excepción temporal justificada y dueño del riesgo.',
        artifacts: 'findings JSON saneados, política OPA/Conftest y propuesta de excepción con caducidad.',
        negative: 'ignorar `HIGH/CRITICAL` sin justificación falla; excepciones permanentes no revisables fallan.',
        evidence: 'policy diff, pruebas negativas, owner, expiración, aprobación y resultado esperado.',
        mode: 'laboratorio de reglas.',
        severity: 'Alto',
        pillar: 'Policy',
        choices: [
            'Deshabilitar scanner en CI',
            'Corregir finding o excepción temporal con owner y expiración',
            'Añadir ignore para todo el repositorio'
        ],
        correct: 1,
        explanation: 'Las excepciones deben tener riesgo, propietario, vencimiento y aprobación.',
        checklist: [
            'Localicé el bypass allow-all y el impacto en recursos críticos',
            'Definí deny-by-default y tests de políticas positivos y negativos',
            'Diseñé excepciones acotadas con ticket, propietario y expiración',
            'Registré auditoría, prueba de expiración y reversión de la excepción'
        ],
        xp: 300
    },
    {
        id: 'S14',
        title: 'Aumento de costos sin control',
        subtitle: 'Contexto: un PR cambia tamaño/ubicación de recursos y eleva el costo proyectado de cloud por encima de presupuesto.',
        mission: 'identificar drivers, rechazar cambios sin Owner/CostCenter, escoger alternativa con trade-off de rendimiento/fiabilidad.',
        artifacts: 'comparación Infracost **ficticia**, tags, presupuesto y alternativas.',
        negative: 'optimizar costo poniendo datos primarios en capacidad interrumpible falla; confundir estimación con factura real falla.',
        evidence: 'decisión de FinOps, ahorro estimado etiquetado, riesgos y validación futura.',
        mode: 'CostReviewPanel + ADR.',
        severity: 'Alto',
        pillar: 'FinOps',
        choices: [
            'Revisar driver de costo, presupuesto, etiquetas y alternativas seguras',
            'Cambiar todo a spot sin SLA',
            'Asumir que la estimación será la factura exacta'
        ],
        correct: 0,
        explanation: 'FinOps evalúa costo, fiabilidad y riesgo, no solo minimiza números.',
        checklist: [
            'Verifiqué unidad, supuestos y procedencia de la estimación ficticia',
            'Evalué efecto de escalado en capacidad, resiliencia y SLA',
            'Establecí presupuesto, umbrales y control de cambios FinOps',
            'Definí owner y reversiones si métricas reales invalidan el ahorro'
        ],
        xp: 300
    },
    {
        id: 'S15',
        title: 'Recuperación de state / desbloqueo de emergencia',
        subtitle: 'Contexto: un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.',
        mission: 'pausar writers, investigar, verificar backup, diseñar restore **sin inferir que una copia vieja refleja la nube actual**, requerir revisión dual para `force-unlock`.',
        artifacts: 'inventario de versiones ficticias de S3, timeline, último plan y responsables.',
        negative: 'restaurar de inmediato sin reconciliar recursos falla; ejecutar `force-unlock` a ciegas falla.',
        evidence: 'plan de recuperación, checklist de seguridad, responsabilidades y pruebas posteriores.',
        mode: 'incidente/DR con simulación.',
        severity: 'Crítico',
        pillar: 'DR',
        choices: [
            'Hacer force-unlock a ciegas',
            'Reemplazar state por la versión más antigua',
            'Pausar escritores, auditar versions/backups y reconciliar antes del restore'
        ],
        correct: 2,
        explanation: 'Recuperar state es un incidente coordinado, con aprobación dual.',
        checklist: [
            'Paré escritores y conservé versiones y metadatos de recuperación',
            'Evité force-unlock sin identificar propietario y estado de operación',
            'Diseñé restore ensayado con comparación de drift y observación cloud',
            'Definí doble aprobación, RTO/RPO y verificación post-recuperación'
        ],
        xp: 300
    },
    {
        id: 'S16',
        title: 'Límite Terraform vs Helm/GitOps',
        subtitle: 'Contexto: Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.',
        mission: 'declarar quién crea clúster, addons, namespaces, workloads y políticas; reducir controladores concurrentes.',
        artifacts: 'matriz de ownership, diagrama cluster/infra/workloads, recursos duplicados de ejemplo.',
        negative: 'dos herramientas dueñas del mismo recurso fallan; «arreglar» drift con `apply` repetitivos sin ownership falla.',
        evidence: 'ADR, árbol de ownership y estrategia de transición segura.',
        mode: 'design review + grafo.',
        severity: 'Alto',
        pillar: 'Kubernetes',
        choices: [
            'Permitir Terraform y Argo CD sobre los mismos objetos',
            'Definir ownership y traspasos claros entre Terraform y GitOps',
            'Ejecutar apply cada minuto para ganar la carrera'
        ],
        correct: 1,
        explanation: 'El ownership único reduce guerras de reconciliación.',
        checklist: [
            'Identifiqué exactamente qué recursos comparten Terraform y GitOps',
            'Asigné un único reconciliador por entidad y límites de ownership',
            'Diseñé handoff declarativo sin bucles de drift entre controladores',
            'Documenté observabilidad, tolerancia a fallos y reversión de ownership'
        ],
        xp: 300
    },
    {
        id: 'S17',
        title: 'Revisión técnica de una plataforma IaC',
        subtitle: 'Contexto: un equipo presenta un PR/RFC con todo el cloud en un solo estado y sin gates, owners ni plan de rollback.',
        mission: 'priorizar hallazgos, escribir comentarios de revisión concretos, proponer entregas incrementales y definir criterio GO/NO-GO.',
        artifacts: 'PR ficticio, diagrama de arquitectura, inventarios y controles faltantes.',
        negative: 'recomendar refactor masivo sin baseline/test/rollback falla; confundir opinión con evidencia falla.',
        evidence: 'revisión priorizada P0/P1/P2, ADR, matriz de riesgo y gate de entrega.',
        mode: 'Code Review + comunicación técnica.',
        severity: 'Alto',
        pillar: 'Arquitectura',
        choices: [
            'Priorizar P0/P1/P2, proponer gates y una migración incremental',
            'Reescribir toda la plataforma de una vez',
            'Aprobar sin pruebas porque compila'
        ],
        correct: 0,
        explanation: 'Una revisión Senior vincula hallazgos concretos con evidencias, blast radius y rollback.',
        checklist: [
            'Priorizé P0/P1 según severidad, alcance e impacto en producción',
            'Separé remediación inmediata de mejoras estructurales de largo plazo',
            'Establecí métricas, owners y evidencias para gates de release',
            'Redacté ADR con decisiones rechazadas, fases y rollback'
        ],
        xp: 300
    },
    {
        id: 'S18',
        title: 'Capstone de Platform Engineering con Terraform',
        subtitle: 'Contexto: diseñar una plataforma con red, servicios y datos en development/staging/production, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.',
        mission: 'presentar solución y operar decisiones ante cambios destructivos, drift, bloqueo concurrente, IAM insuficiente y costo excesivo.',
        artifacts: 'blueprint, módulos, entornos, políticas, escenarios de cambios y tests descargables; sin depender obligatoriamente de AWS real para la evaluación conceptual.',
        negative: 'state monolítico, plan no aprobado, claves estáticas, CIDR solapado, secretos en artefactos y ausencia de rollback deben impedir aprobar el diseño.',
        evidence: 'ADR final, diagrama y ownership, carpeta de módulos/entornos, resultados `fmt/validate/test` si ejecutados, revisión de plan, policy findings, análisis de costos y runbook.',
        mode: 'proyecto de varias etapas, con gates por hito y revisión manual reconocida.',
        severity: 'Crítico',
        pillar: 'Capstone',
        choices: [
            'Desplegar producción primero y documentar después',
            'Usar un state y una llave admin para todo',
            'Diseñar capas, controles, pruebas y capstone multiambiente con evidencia'
        ],
        correct: 2,
        explanation: 'La competencia final demuestra un diseño revisable, no certificación oficial.',
        checklist: [
            'Justifiqué separación de estados, módulos, entornos y owners',
            'Definí pipeline con plan autorizado, OIDC, policies y rollback',
            'Cubrí los ocho hitos y anoté fmt/validate/test como NOT_RUN si aplica',
            'Escribí handoff operativo con costos, drift, incidentes y recuperación'
        ],
        xp: 800
    }
];
export const getCase = (id) => seniorCases.find((item) => item.id === id);
export const capstoneSteps = [
    { name: 'Arquitectura y ownership', detail: 'Diagrama de capas, matriz RACI y ADR de ownership Terraform/GitOps.' },
    { name: 'Módulos y contratos', detail: 'Diseña red, aplicación y datos con entradas, salidas y versionado.' },
    { name: 'Estados por entorno', detail: 'Dev, staging y production aislados; cifrado, versionado y bloqueo.' },
    { name: 'IAM/OIDC', detail: 'Trust federado por entorno y aprobación de producción.' },
    { name: 'Quality gates', detail: 'fmt, init -backend=false, validate, test y escáneres con reporte.' },
    { name: 'Revisión de plan', detail: 'Analiza reemplazos, blast radius y procedencia del artefacto.' },
    { name: 'FinOps y políticas', detail: 'Estimación marcada, tags, presupuesto y excepciones temporales.' },
    { name: 'Operaciones y defensa', detail: 'Escenarios de drift, DR, rollback, handoff y evidencia final.' }
];
