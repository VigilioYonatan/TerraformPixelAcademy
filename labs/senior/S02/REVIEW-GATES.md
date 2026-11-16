# S02 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.

## Gate de riesgo

desbloquear a la fuerza sin investigación debe fallar; segunda operación no puede considerarse segura mientras otra escribe.

## Qué revisar y documentar

1. Identifiqué al escritor propietario y el lock ID sin divulgar secretos.
2. Impedí lock=false y force-unlock prematuro ante escrituras concurrentes.
3. Diseñé verificación del backend y timeout de espera con resultados NOT_RUN si aplica.
4. Establecí autorización dual y recuperación si el lock resulta huérfano.

## Evidencia exigida

runbook de concurrencia, ownership del estado, autorización dual si se propone `force-unlock`.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
