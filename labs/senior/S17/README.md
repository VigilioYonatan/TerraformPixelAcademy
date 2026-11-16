# S17 — Revisión técnica de una plataforma IaC

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un equipo presenta un PR/RFC con todo el cloud en un solo estado y sin gates, owners ni plan de rollback.

## Misión

priorizar hallazgos, escribir comentarios de revisión concretos, proponer entregas incrementales y definir criterio GO/NO-GO.

## Artefactos de referencia

PR ficticio, diagrama de arquitectura, inventarios y controles faltantes.

## Riesgo que debe bloquear

recomendar refactor masivo sin baseline/test/rollback falla; confundir opinión con evidencia falla.

## Evidencia pedida

revisión priorizada P0/P1/P2, ADR, matriz de riesgo y gate de entrega.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
