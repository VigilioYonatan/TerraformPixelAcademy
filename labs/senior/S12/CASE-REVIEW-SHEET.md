# S12 — Registro de revisión individual

## Contexto

Contexto: un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.

## Misión y criterio de aceptación

clasificar qué demuestra cada test y proponer sandbox de integración proporcional al riesgo.

## Artefactos que deberían revisarse

`.tftest.hcl` con mock, supuestos del provider, escenarios de integración pendientes.

## Cuatro controles específicos

- [ ] G1: Separé cobertura de mocks de pruebas reales del proveedor cloud
- [ ] G2: Definí aserciones negativas y casos de error que un mock no reproduce
- [ ] G3: Registré terraform test con origen y estado NOT_RUN si no hubo CLI
- [ ] G4: Establecí sandbox, cuotas, limpieza y barrera para promoción a prod

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
