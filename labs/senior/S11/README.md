# S11 — El plan aprobado no es el plan aplicado

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.

## Misión

explicar la ruptura de integridad, diseñar procedencia y validación de plan de despliegue asociada al commit/estado/entorno aprobados, con protección de artefactos sensibles.

## Artefactos de referencia

dos commits ficticios, hashes de ejemplo, workflow inseguro, dos fixtures con diferencias.

## Riesgo que debe bloquear

aprobar plan A y aplicar B falla; descargar un plan arbitrario desde un PR externo falla; un plan obsoleto no se aplica silenciosamente.

## Evidencia pedida

diagrama seguro PR→aprobación→merge/entorno→plan final→aprobación/aplicación, control de hash y protección de artefactos.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
