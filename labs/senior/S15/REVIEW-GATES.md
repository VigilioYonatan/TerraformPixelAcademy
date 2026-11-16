# S15 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.

## Gate de riesgo

restaurar de inmediato sin reconciliar recursos falla; ejecutar `force-unlock` a ciegas falla.

## Qué revisar y documentar

1. Paré escritores y conservé versiones y metadatos de recuperación.
2. Evité force-unlock sin identificar propietario y estado de operación.
3. Diseñé restore ensayado con comparación de drift y observación cloud.
4. Definí doble aprobación, RTO/RPO y verificación post-recuperación.

## Evidencia exigida

plan de recuperación, checklist de seguridad, responsabilidades y pruebas posteriores.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
