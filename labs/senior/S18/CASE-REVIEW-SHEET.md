# S18 — Registro de revisión individual

## Contexto

Contexto: diseñar una plataforma con red, servicios y datos en development/staging/production, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.

## Misión y criterio de aceptación

presentar solución y operar decisiones ante cambios destructivos, drift, bloqueo concurrente, IAM insuficiente y costo excesivo.

## Artefactos que deberían revisarse

blueprint, módulos, entornos, políticas, escenarios de cambios y tests descargables; sin depender obligatoriamente de AWS real para la evaluación conceptual.

## Cuatro controles específicos

- [ ] G1: Justifiqué separación de estados, módulos, entornos y owners
- [ ] G2: Definí pipeline con plan autorizado, OIDC, policies y rollback
- [ ] G3: Cubrí los ocho hitos y anoté fmt/validate/test como NOT_RUN si aplica
- [ ] G4: Escribí handoff operativo con costos, drift, incidentes y recuperación

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
