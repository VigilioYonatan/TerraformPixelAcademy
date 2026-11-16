# S10 — Registro de revisión individual

## Contexto

Contexto: workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.

## Misión y criterio de aceptación

proponer federación OIDC, permisos limitados por job/entorno, approval gate y roles separados.

## Artefactos que deberían revisarse

workflow YAML de ejemplo vulnerable, trust policy simplificada, roles ficticios.

## Cuatro controles específicos

- [ ] G1: Revisé permisos del workflow y alcance de trust policy del rol OIDC
- [ ] G2: Eliminé llaves estáticas y acoté subject, repo, branch y entorno
- [ ] G3: Comprobé accesos mínimos y pruebas negativas de identidades no autorizadas
- [ ] G4: Definí revocación, rotación y respuesta a fallos de federación

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
