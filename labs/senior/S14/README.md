# S14 — Aumento de costos sin control

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un PR cambia tamaño/ubicación de recursos y eleva el costo proyectado de cloud por encima de presupuesto.

## Misión

identificar drivers, rechazar cambios sin Owner/CostCenter, escoger alternativa con trade-off de rendimiento/fiabilidad.

## Artefactos de referencia

comparación Infracost **ficticia**, tags, presupuesto y alternativas.

## Riesgo que debe bloquear

optimizar costo poniendo datos primarios en capacidad interrumpible falla; confundir estimación con factura real falla.

## Evidencia pedida

decisión de FinOps, ahorro estimado etiquetado, riesgos y validación futura.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
