# S04 — Registro de revisión individual

## Contexto

Contexto: un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.

## Misión y criterio de aceptación

clasificar criticidad, bloquear el apply, investigar dependencias, proponer mitigación.

## Artefactos que deberían revisarse

plan fixture crítico, etiquetas de entorno y clase de datos, política de backups.

## Cuatro controles específicos

- [ ] G1: Clasifiqué criticidad del recurso y volumen de datos potencialmente eliminado
- [ ] G2: Bloqueé cambios destroy/replace hasta acreditar dependencias y recuperación
- [ ] G3: Exigí backup/snapshot verificable y prueba de restore documentada
- [ ] G4: Definí aprobación, punto de parada y runbook de recuperación

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
