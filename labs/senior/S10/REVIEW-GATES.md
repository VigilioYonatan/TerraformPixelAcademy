# S10 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.

## Gate de riesgo

`id-token: write` global + admin wildcard falla; `pull_request` no confiable con secretos falla.

## Qué revisar y documentar

1. Revisé permisos del workflow y alcance de trust policy del rol OIDC.
2. Eliminé llaves estáticas y acoté subject, repo, branch y entorno.
3. Comprobé accesos mínimos y pruebas negativas de identidades no autorizadas.
4. Definí revocación, rotación y respuesta a fallos de federación.

## Evidencia exigida

amenazas, trust conditions, matriz roles/jobs, decisiones de promoción.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
