# S06 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: el equipo incluye un secreto en una variable y descubre que aparece en un plan guardado o state.

## Gate de riesgo

marcar solo `sensitive = true` sin remediar state falla; registrar secretos en una captura/evidencia falla.

## Qué revisar y documentar

1. Identifiqué la exposición en outputs, logs, planes y state sensible.
2. Exigí rotación/revocación de credenciales y contención del artefacto.
3. Diferencié sensitive de ephemeral y validé compatibilidad de versión.
4. Definí análisis de accesos, limpieza de logs y seguimiento del incidente.

## Evidencia exigida

matriz de exposición, pasos de contención y control de acceso a artefactos.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
