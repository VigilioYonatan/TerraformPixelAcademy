# S04 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.

## Gate de riesgo

«aprobar porque el HCL compila» falla; ignorar state y backups falla.

## Qué revisar y documentar

1. Clasifiqué criticidad del recurso y volumen de datos potencialmente eliminado.
2. Bloqueé cambios destroy/replace hasta acreditar dependencias y recuperación.
3. Exigí backup/snapshot verificable y prueba de restore documentada.
4. Definí aprobación, punto de parada y runbook de recuperación.

## Evidencia exigida

decisión «NO GO», protecciones, aprobación formal y plan de rollback/recovery.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
