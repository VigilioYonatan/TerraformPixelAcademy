# S17 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un equipo presenta un PR/RFC con todo el cloud en un solo estado y sin gates, owners ni plan de rollback.

## Gate de riesgo

recomendar refactor masivo sin baseline/test/rollback falla; confundir opinión con evidencia falla.

## Qué revisar y documentar

1. Priorizé P0/P1 según severidad, alcance e impacto en producción.
2. Separé remediación inmediata de mejoras estructurales de largo plazo.
3. Establecí métricas, owners y evidencias para gates de release.
4. Redacté ADR con decisiones rechazadas, fases y rollback.

## Evidencia exigida

revisión priorizada P0/P1/P2, ADR, matriz de riesgo y gate de entrega.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
