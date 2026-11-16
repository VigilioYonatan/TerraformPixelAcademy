# S05 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.

## Gate de riesgo

migración sin backup o con escrituras concurrentes debe bloquearse; no asumir éxito por solo cambiar HCL.

## Qué revisar y documentar

1. Congelé escritores y enumeré estados/workspaces sujetos a migración.
2. Verifiqué versión y recuperación de backups antes de init -migrate-state.
3. Comparé estado previo y nuevo sin exponer secretos y registré NOT_RUN donde corresponde.
4. Escribí rollback de backend, permiso, locking y responsables.

## Evidencia exigida

runbook, responsables, preflight, verificación de state y rollback.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
