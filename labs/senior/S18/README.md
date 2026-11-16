# S18 — Capstone de Platform Engineering con Terraform

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: diseñar una plataforma con red, servicios y datos en development/staging/production, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.

## Misión

presentar solución y operar decisiones ante cambios destructivos, drift, bloqueo concurrente, IAM insuficiente y costo excesivo.

## Artefactos de referencia

blueprint, módulos, entornos, políticas, escenarios de cambios y tests descargables; sin depender obligatoriamente de AWS real para la evaluación conceptual.

## Riesgo que debe bloquear

state monolítico, plan no aprobado, claves estáticas, CIDR solapado, secretos en artefactos y ausencia de rollback deben impedir aprobar el diseño.

## Evidencia pedida

ADR final, diagrama y ownership, carpeta de módulos/entornos, resultados `fmt/validate/test` si ejecutados, revisión de plan, policy findings, análisis de costos y runbook.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
