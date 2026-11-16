# S01 — Reemplazo destructivo por refactor de `for_each`

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar direcciones Terraform.

## Misión

señalar recursos afectados, bloquear el apply, evaluar `moved` y documentar un procedimiento de migración de direcciones.

## Artefactos de referencia

`main-before.tf`, `main-after.tf`, fixture de plan con `delete/create`, mapa de recursos y restricciones de disponibilidad.

## Riesgo que debe bloquear

alternativa «aplicar y recrear» falla por requisito de continuidad; `moved` incorrecto no debe aprobar.

## Evidencia pedida

lista de direcciones afectadas, decisión de bloquear, plan de cambios sin destrucción no aprobada, ADR corto.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
