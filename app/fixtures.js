export const planFixtures = [
    {
        id: 'p1',
        title: 'Primer despliegue',
        environment: 'dev',
        summary: 'Ejemplo didáctico: infraestructura sin recursos previos.',
        provenance: 'SYNTHETIC_FIXTURE',
        resources: [
            {
                name: 'terraform_data.demo',
                action: 'create',
                detail: 'input = "Hola, Terraform"',
                risk: 'Bajo: recurso local de demostración.'
            },
            {
                name: 'terraform_data.config',
                action: 'create',
                detail: 'input = "development"',
                risk: 'Bajo: recurso local de demostración.'
            }
        ]
    },
    {
        id: 'p2',
        title: 'Reemplazo de base de datos',
        environment: 'prod',
        summary: 'Reemplazo de un recurso crítico por modificación immutable.',
        provenance: 'SYNTHETIC_FIXTURE',
        resources: [
            {
                name: 'aws_db_instance.core',
                action: 'replace',
                detail: 'identifier: prod-main → prod-core (forces replacement)',
                risk: 'Crítico: plan de backup, restauración y disponibilidad obligatorio.'
            },
            {
                name: 'aws_security_group.app',
                action: 'update',
                detail: 'ingress: 443 permitido desde otro CIDR',
                risk: 'Alto: verificar exposición de red.'
            },
            { name: 'aws_cloudwatch_log_group.app', action: 'no-op', detail: 'Sin cambios', risk: 'Sin impacto.' }
        ]
    },
    {
        id: 'p3',
        title: 'Deriva de configuración',
        environment: 'staging',
        summary: 'Terraform observa cambios fuera de banda en tags y tamaños.',
        provenance: 'SYNTHETIC_FIXTURE',
        resources: [
            {
                name: 'aws_instance.worker',
                action: 'update',
                detail: 'instance_type: t3.small → t3.medium',
                risk: 'Medio: costo y posible reinicio.'
            },
            {
                name: 'aws_s3_bucket.logs',
                action: 'delete',
                detail: 'El recurso ya no aparece en la configuración',
                risk: 'Crítico: revisar retención y propiedad de datos.'
            }
        ]
    },
    {
        id: 'p4',
        title: 'Cambio de claves for_each',
        environment: 'prod',
        summary: 'Un refactor altera direcciones gestionadas.',
        provenance: 'SYNTHETIC_FIXTURE',
        resources: [
            {
                name: 'aws_subnet.private["old"]',
                action: 'delete',
                detail: 'La clave old desaparece del mapa',
                risk: 'Alto: revisar moved y dependencias.'
            },
            {
                name: 'aws_subnet.private["new"]',
                action: 'create',
                detail: 'Nueva clave new introducida',
                risk: 'Alto: posible recreación de red.'
            },
            {
                name: 'aws_route_table.private',
                action: 'update',
                detail: 'Asociaciones afectadas',
                risk: 'Medio: puede cortar conectividad.'
            }
        ]
    }
];
export const graphs = [
    {
        id: 'network',
        title: 'Aplicación en tres capas',
        description: 'Grafo de ejemplo: una app depende de la red y los datos.',
        nodes: [
            {
                id: 'vpc',
                label: 'VPC',
                category: 'Network',
                description: 'La capa de red raíz crea el espacio de direcciones.',
                dep: [],
                x: 100,
                y: 165,
                level: 'Foundation'
            },
            {
                id: 'subnet',
                label: 'Subnet',
                category: 'Network',
                description: 'Subred privada que depende de la VPC.',
                dep: ['vpc'],
                x: 320,
                y: 70,
                level: 'Foundation'
            },
            {
                id: 'sg',
                label: 'Security Group',
                category: 'Security',
                description: 'Reglas de red asociadas a la VPC.',
                dep: ['vpc'],
                x: 320,
                y: 270,
                level: 'Foundation'
            },
            {
                id: 'compute',
                label: 'Compute',
                category: 'Service',
                description: 'Servicio que necesita subred y seguridad.',
                dep: ['subnet', 'sg'],
                x: 560,
                y: 90,
                level: 'Workload'
            },
            {
                id: 'db',
                label: 'Database',
                category: 'Data',
                description: 'Persistencia en subred privada.',
                dep: ['subnet', 'sg'],
                x: 560,
                y: 270,
                level: 'Data'
            },
            {
                id: 'app',
                label: 'App',
                category: 'Workload',
                description: 'Producto que requiere servicio y base de datos.',
                dep: ['compute', 'db'],
                x: 800,
                y: 170,
                level: 'Workload'
            }
        ]
    },
    {
        id: 'local',
        title: 'Laboratorio offline',
        description: 'Todos los recursos son terraform_data; sin cuenta cloud.',
        nodes: [
            {
                id: 'input',
                label: 'Variable',
                category: 'Input',
                description: 'Variable de entrada al módulo.',
                dep: [],
                x: 100,
                y: 170,
                level: 'Input'
            },
            {
                id: 'resource',
                label: 'terraform_data',
                category: 'Resource',
                description: 'Recurso nativo que almacena input en state local.',
                dep: ['input'],
                x: 425,
                y: 170,
                level: 'Resource'
            },
            {
                id: 'output',
                label: 'Output',
                category: 'Output',
                description: 'Contrato de salida al consumidor.',
                dep: ['resource'],
                x: 750,
                y: 170,
                level: 'Output'
            }
        ]
    },
    {
        id: 'cycle',
        title: 'Ciclo incorrecto',
        description: 'Ejemplo de dependencia circular que bloquea la planificación.',
        nodes: [
            {
                id: 'network',
                label: 'Network',
                category: 'Module',
                description: 'Depende del compute; arquitectura acoplada.',
                dep: ['compute'],
                x: 160,
                y: 160,
                level: 'Error'
            },
            {
                id: 'compute',
                label: 'Compute',
                category: 'Module',
                description: 'Depende del security; arquitectura acoplada.',
                dep: ['security'],
                x: 470,
                y: 70,
                level: 'Error'
            },
            {
                id: 'security',
                label: 'Security',
                category: 'Module',
                description: 'Depende del network; arquitectura acoplada.',
                dep: ['network'],
                x: 740,
                y: 240,
                level: 'Error'
            }
        ]
    }
];
