# S16 — Registro de revisión individual

## Contexto

Contexto: Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.

## Misión y criterio de aceptación

declarar quién crea clúster, addons, namespaces, workloads y políticas; reducir controladores concurrentes.

## Artefactos que deberían revisarse

matriz de ownership, diagrama cluster/infra/workloads, recursos duplicados de ejemplo.

## Cuatro controles específicos

- [ ] G1: Identifiqué exactamente qué recursos comparten Terraform y GitOps
- [ ] G2: Asigné un único reconciliador por entidad y límites de ownership
- [ ] G3: Diseñé handoff declarativo sin bucles de drift entre controladores
- [ ] G4: Documenté observabilidad, tolerancia a fallos y reversión de ownership

## Decisión y alternativas

- Decisión:
- Alternativa rechazada:
- Consecuencia:

## Evidencia verificable y procedencia

- Estado de la CLI: NOT_RUN
- Estado cloud: NOT_RUN
- Estado de revisión humana: NOT_RUN
- Enlace/hash del artefacto cuando exista:
- Responsable y fecha:

## Plan de rollback y comunicación

- Condición de parada:
- Dependencias:
- Owner:
- Acción de contención:
- Prueba de recuperación:

> Documento educativo: marcar un control no demuestra que se ejecutó una prueba real.
