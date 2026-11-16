# S16 — Límite Terraform vs Helm/GitOps

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.

## Misión

declarar quién crea clúster, addons, namespaces, workloads y políticas; reducir controladores concurrentes.

## Artefactos de referencia

matriz de ownership, diagrama cluster/infra/workloads, recursos duplicados de ejemplo.

## Riesgo que debe bloquear

dos herramientas dueñas del mismo recurso fallan; «arreglar» drift con `apply` repetitivos sin ownership falla.

## Evidencia pedida

ADR, árbol de ownership y estrategia de transición segura.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
