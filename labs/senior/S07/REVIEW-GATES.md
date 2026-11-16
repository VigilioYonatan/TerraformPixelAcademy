# S07 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: actualización mayor del provider cambia schema/comportamiento y un plan anuncia reemplazos inesperados.

## Gate de riesgo

`terraform init -upgrade` sin plan de revisión falla; actualizar producción directa falla.

## Qué revisar y documentar

1. Inventarié versiones de provider, lockfile y dependencias de módulos.
2. Elegí rango versionado compatible con changelog y runtime fijado.
3. Propuse test de plan y regresión en sandbox, con evidencia NO EJECUTADA si aplica.
4. Definí rollback del lockfile y política de actualización segura.

## Evidencia exigida

matriz versión/impacto, estrategia revertible y checklist de aprobación.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
