# S03 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.

## Gate de riesgo

«aceptar todo lo que está en cloud» falla si viola política; no toda deriva autoriza `apply` inmediato.

## Qué revisar y documentar

1. Comparé configuración HCL, state y observación remota sin confundir fuentes.
2. Evalué si la modificación fuera de banda requiere adoptar o revertir el cambio.
3. Propuse refresh/plan controlado con snapshot y procedencia explícita.
4. Documenté propietario, ventana y vigilancia posterior de drift.

## Evidencia exigida

causa probable, blast radius, decisión, responsable y monitoreo posterior.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
