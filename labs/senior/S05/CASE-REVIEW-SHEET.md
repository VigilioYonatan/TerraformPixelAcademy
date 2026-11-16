# S05 — Registro de revisión individual

## Contexto

Contexto: se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.

## Misión y criterio de aceptación

preparar respaldo, congelar writers, verificar destino y explicar `init -migrate-state` en contexto autorizado.

## Artefactos que deberían revisarse

dos topologías, inventario de states, plantilla `backend "s3"` ilustrativa, checklist de migración.

## Cuatro controles específicos

- [ ] G1: Congelé escritores y enumeré estados/workspaces sujetos a migración
- [ ] G2: Verifiqué versión y recuperación de backups antes de init -migrate-state
- [ ] G3: Comparé estado previo y nuevo sin exponer secretos y registré NOT_RUN donde corresponde
- [ ] G4: Escribí rollback de backend, permiso, locking y responsables

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
