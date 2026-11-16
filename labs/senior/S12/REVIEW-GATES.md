# S12 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.

## Gate de riesgo

«mock PASS = producción PASS» falla; tests con `apply` cloud no se corren como unitarios públicos.

## Qué revisar y documentar

1. Separé cobertura de mocks de pruebas reales del proveedor cloud.
2. Definí aserciones negativas y casos de error que un mock no reproduce.
3. Registré terraform test con origen y estado NOT_RUN si no hubo CLI.
4. Establecí sandbox, cuotas, limpieza y barrera para promoción a prod.

## Evidencia exigida

pirámide de pruebas, `NOT_RUN` explícito y plan de pruebas de integración.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
