# S03 — Registro de revisión individual

## Contexto

Contexto: alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.

## Misión y criterio de aceptación

identificar la desviación, evaluar impacto y elegir reconciliar Git o revertir el cambio externo.

## Artefactos que deberían revisarse

`desired.tf`, representación de estado lógico saneado, snapshot cloud ficticio, plan/timeline.

## Cuatro controles específicos

- [ ] G1: Comparé configuración HCL, state y observación remota sin confundir fuentes
- [ ] G2: Evalué si la modificación fuera de banda requiere adoptar o revertir el cambio
- [ ] G3: Propuse refresh/plan controlado con snapshot y procedencia explícita
- [ ] G4: Documenté propietario, ventana y vigilancia posterior de drift

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
