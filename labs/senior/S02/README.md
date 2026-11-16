# S02 — Lock concurrente de state

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.

## Misión

evitar ejecuciones simultáneas, decidir cuándo esperar, cancelar/replanificar o investigar un lock sospechoso.

## Artefactos de referencia

timeline de jobs, IDs de operación ficticios, logs saneados de locking, topología backend.

## Riesgo que debe bloquear

desbloquear a la fuerza sin investigación debe fallar; segunda operación no puede considerarse segura mientras otra escribe.

## Evidencia pedida

runbook de concurrencia, ownership del estado, autorización dual si se propone `force-unlock`.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
