# S11 — Registro de revisión individual

## Contexto

Contexto: un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.

## Misión y criterio de aceptación

explicar la ruptura de integridad, diseñar procedencia y validación de plan de despliegue asociada al commit/estado/entorno aprobados, con protección de artefactos sensibles.

## Artefactos que deberían revisarse

dos commits ficticios, hashes de ejemplo, workflow inseguro, dos fixtures con diferencias.

## Cuatro controles específicos

- [ ] G1: Vinculé commit, environment, state y digest del artefacto autorizado
- [ ] G2: Evité regenerar otro plan entre la revisión y terraform apply
- [ ] G3: Distinguí checksum de firma/autorización y controlé almacenamiento sensible
- [ ] G4: Diseñé gates ante divergencia, expiración de plan y rollback

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
