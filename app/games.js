export const games = [
    {
        id: 'g1',
        title: 'Quiz de infraestructura',
        eyebrow: 'Trivia · 5 preguntas',
        description: 'Demuestra que entiendes el ciclo de vida de Terraform.',
        icon: 'brain',
        questions: [
            {
                question: '¿Qué comando prepara providers y backend?',
                options: ['terraform init', 'terraform output', 'terraform fmt'],
                correct: 0,
                explanation: 'init instala providers y configura backend según el módulo.'
            },
            {
                question: '¿Dónde se ejecutan los comandos reales en esta academia?',
                options: ['Dentro del quiz', 'Equipo del alumno o CI', 'En producción automáticamente'],
                correct: 1,
                explanation: 'La web no tiene motor Terraform; ofrece packs locales.'
            },
            {
                question: '¿Qué significa -/+ en un plan?',
                options: ['No-op', 'Reemplazo', 'Crear un output'],
                correct: 1,
                explanation: '-/+ indica destrucción y recreación de un recurso.'
            },
            {
                question: '¿Qué puede contener terraform.tfstate?',
                options: ['Datos sensibles', 'Solo nombres de archivos', 'Ningún atributo remoto'],
                correct: 0,
                explanation: 'El state requiere protección y acceso mínimo.'
            },
            {
                question: '¿Qué logra `fmt`?',
                options: ['Aplica cambios cloud', 'Formatea archivos HCL', 'Bloquea el backend'],
                correct: 1,
                explanation: 'fmt no ejecuta planes ni toca infraestructura.'
            }
        ]
    },
    {
        id: 'g2',
        title: 'Ordena el pipeline',
        eyebrow: 'Secuencia · 4 decisiones',
        description: 'Ordena los gates de una entrega segura.',
        icon: 'workflow',
        questions: [
            {
                question: '¿Cuál debe ocurrir al inicio de una PR?',
                options: ['fmt y validate', 'apply en prod', 'eliminar estado'],
                correct: 0,
                explanation: 'Se verifican formato y configuración primero.'
            },
            {
                question: '¿Qué sucede tras el análisis automatizado?',
                options: ['Revisión de plan y riesgos', 'force-unlock', 'rotación de todos los roles'],
                correct: 0,
                explanation: 'El plan y los riesgos se exponen para revisión.'
            },
            {
                question: '¿Qué debe validar el gate de producción?',
                options: ['Color del botón', 'Identidad, autorización y plan final', 'Número de commits'],
                correct: 1,
                explanation: 'La aprobación se vincula a un artefacto y entorno.'
            },
            {
                question: '¿Cómo cierra el pipeline?',
                options: ['Apply autorizado y evidencia/observación', 'Guardar contraseñas en logs', 'Forzar destroy'],
                correct: 0,
                explanation: 'Aplicación autorizada y observación posterior, nunca aplicar a ciegas.'
            }
        ]
    },
    {
        id: 'g3',
        title: 'Cazador de riesgos',
        eyebrow: 'Bug hunt · 4 hallazgos',
        description: 'Identifica prácticas que crean incidentes.',
        icon: 'bug',
        questions: [
            {
                question: '`provider = aws`, secret en terraform.tfvars versionado. ¿El problema?',
                options: ['Nombre muy largo', 'Credencial en Git', 'No hay problema'],
                correct: 1,
                explanation: 'Nunca versionar secretos; rotar y retirar el acceso.'
            },
            {
                question: 'Plan aprobado para commit A; apply usa nuevo plan de B. ¿Riesgo?',
                options: ['Integridad del artefacto', 'Sintaxis HCL', 'Solo estilo'],
                correct: 0,
                explanation: 'Lo aplicado puede diferir de lo revisado.'
            },
            {
                question: 'Un mismo recurso K8s pertenece a Terraform y Argo CD. ¿Problema?',
                options: ['Dos owners y drift recurrente', 'Mayor resiliencia garantizada', 'Sin efecto'],
                correct: 0,
                explanation: 'Define ownership exclusivo y migración segura.'
            },
            {
                question: 'Un equipo pone -lock=false siempre. ¿Qué ocurre?',
                options: ['Mayor cifrado', 'Posibles escrituras concurrentes', 'Sin problemas'],
                correct: 1,
                explanation: 'Desactivar lock sin justificación es un riesgo de corrupción.'
            }
        ]
    },
    {
        id: 'g4',
        title: 'Predice el plan',
        eyebrow: 'Análisis · 4 diffs',
        description: 'Interpreta señales de cambios antes de desplegar.',
        icon: 'git-pull-request',
        questions: [
            {
                question: '`+ resource.cloud_instance.web` indica…',
                options: ['Crear', 'Eliminar', 'No-op'],
                correct: 0,
                explanation: 'El signo + señala un nuevo recurso.'
            },
            {
                question: '`~ resource.tags` indica…',
                options: ['Creación', 'Actualización en sitio', 'Reemplazo siempre'],
                correct: 1,
                explanation: 'El símbolo ~ sugiere actualización; leer el detalle del provider.'
            },
            {
                question: '`-/+ resource.database` indica…',
                options: ['Sustitución y posible downtime', 'Solo etiqueta', 'Sin cambios'],
                correct: 0,
                explanation: 'Una sustitución de datos exige análisis de pérdida/backup.'
            },
            {
                question: '`(known after apply)` significa…',
                options: ['Error de HCL', 'Valor no conocido durante plan', 'Permiso de administrador'],
                correct: 1,
                explanation: 'Terraform conoce algunos atributos únicamente tras el apply.'
            }
        ]
    },
    {
        id: 'g5',
        title: 'Arquitecto de ownership',
        eyebrow: 'Diseño · 4 casos',
        description: 'Decide quién administra cada capa de plataforma.',
        icon: 'network',
        questions: [
            {
                question: '¿Quién suele declarar una VPC en una plataforma IaC?',
                options: ['Terraform, si es owner de la red', 'Argo CD siempre', 'El frontend'],
                correct: 0,
                explanation: 'Se asigna propietario a cada stack y recurso.'
            },
            {
                question: '¿Quién reconcilia deployments Kubernetes gestionados por GitOps?',
                options: ['Argo CD / Flux', 'Terraform además en paralelo', 'El lock de state'],
                correct: 0,
                explanation: 'Evita dos reconciliadores sobre el mismo objeto.'
            },
            {
                question: '¿Cómo aislar dev y prod?',
                options: ['State, identidad y gates separados', 'Todo en un state compartido', 'Sin control de acceso'],
                correct: 0,
                explanation: 'El aislamiento limita blast radius.'
            },
            {
                question: '¿Qué hacer con un hallazgo policy crítico?',
                options: ['Silenciarlo permanentemente', 'Corregir o aceptar con aprobación limitada', 'Borrar el workflow'],
                correct: 1,
                explanation: 'La excepción debe registrar owner, vencimiento y riesgo.'
            }
        ]
    }
];
