# S13 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un recurso incumple cifrado, tags obligatorios o reglas de red; el equipo pide ignorar el scanner por una urgencia.

## Gate de riesgo

ignorar `HIGH/CRITICAL` sin justificación falla; excepciones permanentes no revisables fallan.

## Qué revisar y documentar

1. Localicé el bypass allow-all y el impacto en recursos críticos.
2. Definí deny-by-default y tests de políticas positivos y negativos.
3. Diseñé excepciones acotadas con ticket, propietario y expiración.
4. Registré auditoría, prueba de expiración y reversión de la excepción.

## Evidencia exigida

policy diff, pruebas negativas, owner, expiración, aprobación y resultado esperado.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
