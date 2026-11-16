# S10 — IAM mínimo en GitHub Actions + OIDC

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.

## Misión

proponer federación OIDC, permisos limitados por job/entorno, approval gate y roles separados.

## Artefactos de referencia

workflow YAML de ejemplo vulnerable, trust policy simplificada, roles ficticios.

## Riesgo que debe bloquear

`id-token: write` global + admin wildcard falla; `pull_request` no confiable con secretos falla.

## Evidencia pedida

amenazas, trust conditions, matriz roles/jobs, decisiones de promoción.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
