# S13 — Policy as Code y excepciones

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un recurso incumple cifrado, tags obligatorios o reglas de red; el equipo pide ignorar el scanner por una urgencia.

## Misión

corregir política o configuración, documentar excepción temporal justificada y dueño del riesgo.

## Artefactos de referencia

findings JSON saneados, política OPA/Conftest y propuesta de excepción con caducidad.

## Riesgo que debe bloquear

ignorar `HIGH/CRITICAL` sin justificación falla; excepciones permanentes no revisables fallan.

## Evidencia pedida

policy diff, pruebas negativas, owner, expiración, aprobación y resultado esperado.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
