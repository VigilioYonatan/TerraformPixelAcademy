# S04 — Destrucción de recurso crítico

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.

## Misión

clasificar criticidad, bloquear el apply, investigar dependencias, proponer mitigación.

## Artefactos de referencia

plan fixture crítico, etiquetas de entorno y clase de datos, política de backups.

## Riesgo que debe bloquear

«aprobar porque el HCL compila» falla; ignorar state y backups falla.

## Evidencia pedida

decisión «NO GO», protecciones, aprobación formal y plan de rollback/recovery.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
