# S12 — Tests con mocks vs integración

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.

## Misión

clasificar qué demuestra cada test y proponer sandbox de integración proporcional al riesgo.

## Artefactos de referencia

`.tftest.hcl` con mock, supuestos del provider, escenarios de integración pendientes.

## Riesgo que debe bloquear

«mock PASS = producción PASS» falla; tests con `apply` cloud no se corren como unitarios públicos.

## Evidencia pedida

pirámide de pruebas, `NOT_RUN` explícito y plan de pruebas de integración.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
