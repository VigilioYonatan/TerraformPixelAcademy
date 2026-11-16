# S16 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.

## Gate de riesgo

dos herramientas dueñas del mismo recurso fallan; «arreglar» drift con `apply` repetitivos sin ownership falla.

## Qué revisar y documentar

1. Identifiqué exactamente qué recursos comparten Terraform y GitOps.
2. Asigné un único reconciliador por entidad y límites de ownership.
3. Diseñé handoff declarativo sin bucles de drift entre controladores.
4. Documenté observabilidad, tolerancia a fallos y reversión de ownership.

## Evidencia exigida

ADR, árbol de ownership y estrategia de transición segura.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
