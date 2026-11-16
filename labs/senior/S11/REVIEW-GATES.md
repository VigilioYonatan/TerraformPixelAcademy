# S11 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.

## Gate de riesgo

aprobar plan A y aplicar B falla; descargar un plan arbitrario desde un PR externo falla; un plan obsoleto no se aplica silenciosamente.

## Qué revisar y documentar

1. Vinculé commit, environment, state y digest del artefacto autorizado.
2. Evité regenerar otro plan entre la revisión y terraform apply.
3. Distinguí checksum de firma/autorización y controlé almacenamiento sensible.
4. Diseñé gates ante divergencia, expiración de plan y rollback.

## Evidencia exigida

diagrama seguro PR→aprobación→merge/entorno→plan final→aprobación/aplicación, control de hash y protección de artefactos.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
