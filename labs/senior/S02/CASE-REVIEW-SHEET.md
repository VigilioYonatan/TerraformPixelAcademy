# S02 — Registro de revisión individual

## Contexto

Contexto: dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.

## Misión y criterio de aceptación

evitar ejecuciones simultáneas, decidir cuándo esperar, cancelar/replanificar o investigar un lock sospechoso.

## Artefactos que deberían revisarse

timeline de jobs, IDs de operación ficticios, logs saneados de locking, topología backend.

## Cuatro controles específicos

- [ ] G1: Identifiqué al escritor propietario y el lock ID sin divulgar secretos
- [ ] G2: Impedí lock=false y force-unlock prematuro ante escrituras concurrentes
- [ ] G3: Diseñé verificación del backend y timeout de espera con resultados NOT_RUN si aplica
- [ ] G4: Establecí autorización dual y recuperación si el lock resulta huérfano

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
