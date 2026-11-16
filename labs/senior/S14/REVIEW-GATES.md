# S14 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un PR cambia tamaño/ubicación de recursos y eleva el costo proyectado de cloud por encima de presupuesto.

## Gate de riesgo

optimizar costo poniendo datos primarios en capacidad interrumpible falla; confundir estimación con factura real falla.

## Qué revisar y documentar

1. Verifiqué unidad, supuestos y procedencia de la estimación ficticia.
2. Evalué efecto de escalado en capacidad, resiliencia y SLA.
3. Establecí presupuesto, umbrales y control de cambios FinOps.
4. Definí owner y reversiones si métricas reales invalidan el ahorro.

## Evidencia exigida

decisión de FinOps, ahorro estimado etiquetado, riesgos y validación futura.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
