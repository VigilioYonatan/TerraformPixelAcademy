# S15 — Recuperación de state / desbloqueo de emergencia

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.

## Misión

pausar writers, investigar, verificar backup, diseñar restore **sin inferir que una copia vieja refleja la nube actual**, requerir revisión dual para `force-unlock`.

## Artefactos de referencia

inventario de versiones ficticias de S3, timeline, último plan y responsables.

## Riesgo que debe bloquear

restaurar de inmediato sin reconciliar recursos falla; ejecutar `force-unlock` a ciegas falla.

## Evidencia pedida

plan de recuperación, checklist de seguridad, responsabilidades y pruebas posteriores.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
