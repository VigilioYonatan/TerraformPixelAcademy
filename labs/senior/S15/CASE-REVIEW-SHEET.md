# S15 — Registro de revisión individual

## Contexto

Contexto: un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.

## Misión y criterio de aceptación

pausar writers, investigar, verificar backup, diseñar restore **sin inferir que una copia vieja refleja la nube actual**, requerir revisión dual para `force-unlock`.

## Artefactos que deberían revisarse

inventario de versiones ficticias de S3, timeline, último plan y responsables.

## Cuatro controles específicos

- [ ] G1: Paré escritores y conservé versiones y metadatos de recuperación
- [ ] G2: Evité force-unlock sin identificar propietario y estado de operación
- [ ] G3: Diseñé restore ensayado con comparación de drift y observación cloud
- [ ] G4: Definí doble aprobación, RTO/RPO y verificación post-recuperación

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
