# S01 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar direcciones Terraform.

## Gate de riesgo

alternativa «aplicar y recrear» falla por requisito de continuidad; `moved` incorrecto no debe aprobar.

## Qué revisar y documentar

1. Identifiqué las direcciones old_key/new_key y los recursos que podrían reemplazarse.
2. Comprobé cuándo moved conserva identidad y cuándo la migración no es segura.
3. Exigí revisar plan sin delete/create inesperados y registrar NOT_RUN si no se ejecutó.
4. Definí ventana de cambio, owner de state y reversión antes del apply.

## Evidencia exigida

lista de direcciones afectadas, decisión de bloquear, plan de cambios sin destrucción no aprobada, ADR corto.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
