# S06 — Filtración de secretos en state, plan o logs

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: el equipo incluye un secreto en una variable y descubre que aparece en un plan guardado o state.

## Misión

localizar vías de exposición, separar ocultar output de excluir del estado, diseñar contención/rotación y políticas.

## Artefactos de referencia

ejemplo totalmente ficticio de output enmascarado, plan/state **sintéticos**, guía `sensitive` vs `ephemeral`.

## Riesgo que debe bloquear

marcar solo `sensitive = true` sin remediar state falla; registrar secretos en una captura/evidencia falla.

## Evidencia pedida

matriz de exposición, pasos de contención y control de acceso a artefactos.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
