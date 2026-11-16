# S07 — Upgrade de provider incompatible

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: actualización mayor del provider cambia schema/comportamiento y un plan anuncia reemplazos inesperados.

## Misión

analizar compatibilidad, proponer versión fijada, pruebas de regresión y rollout gradual.

## Artefactos de referencia

lockfile ficticio, changelog resumido, planes antes/después y tests rotos.

## Riesgo que debe bloquear

`terraform init -upgrade` sin plan de revisión falla; actualizar producción directa falla.

## Evidencia pedida

matriz versión/impacto, estrategia revertible y checklist de aprobación.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
