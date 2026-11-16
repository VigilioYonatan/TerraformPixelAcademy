# S05 — Migración de backend de estado

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.

## Misión

preparar respaldo, congelar writers, verificar destino y explicar `init -migrate-state` en contexto autorizado.

## Artefactos de referencia

dos topologías, inventario de states, plantilla `backend "s3"` ilustrativa, checklist de migración.

## Riesgo que debe bloquear

migración sin backup o con escrituras concurrentes debe bloquearse; no asumir éxito por solo cambiar HCL.

## Evidencia pedida

runbook, responsables, preflight, verificación de state y rollback.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
