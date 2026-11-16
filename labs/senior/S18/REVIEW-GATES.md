# S18 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: diseñar una plataforma con red, servicios y datos en development/staging/production, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.

## Gate de riesgo

state monolítico, plan no aprobado, claves estáticas, CIDR solapado, secretos en artefactos y ausencia de rollback deben impedir aprobar el diseño.

## Qué revisar y documentar

1. Justifiqué separación de estados, módulos, entornos y owners.
2. Definí pipeline con plan autorizado, OIDC, policies y rollback.
3. Cubrí los ocho hitos y anoté fmt/validate/test como NOT_RUN si aplica.
4. Escribí handoff operativo con costos, drift, incidentes y recuperación.

## Evidencia exigida

ADR final, diagrama y ownership, carpeta de módulos/entornos, resultados `fmt/validate/test` si ejecutados, revisión de plan, policy findings, análisis de costos y runbook.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
