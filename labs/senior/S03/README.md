# S03 — Drift fuera de banda

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.

## Misión

identificar la desviación, evaluar impacto y elegir reconciliar Git o revertir el cambio externo.

## Artefactos de referencia

`desired.tf`, representación de estado lógico saneado, snapshot cloud ficticio, plan/timeline.

## Riesgo que debe bloquear

«aceptar todo lo que está en cloud» falla si viola política; no toda deriva autoriza `apply` inmediato.

## Evidencia pedida

causa probable, blast radius, decisión, responsable y monitoreo posterior.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
