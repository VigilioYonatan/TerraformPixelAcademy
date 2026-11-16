# S09 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.

## Gate de riesgo

considerar válido un bloque solapado por pertenecer a otro módulo falla; usar inventario de ejemplo como real falla.

## Qué revisar y documentar

1. Comprobé matemáticamente el solapamiento de CIDR y el blast radius.
2. Contrasté nueva propuesta con la asignación IPAM y conexiones existentes.
3. Definí evidencia de routing/conectividad y marcada NOT_RUN cuando no se probó.
4. Planifiqué migración de IPs, ventana autorizada y rollback de rutas.

## Evidencia exigida

CIDR corregidos, test de contrato y límites de red.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
