# S09 — CIDR solapados entre entornos

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.

## Misión

detectar solapamiento par-a-par, rechazar topología inválida y revisar contrato/digest del stack de red.

## Artefactos de referencia

mapa de redes con CIDR ficticios, contratos de variables y matriz de ambientes.

## Riesgo que debe bloquear

considerar válido un bloque solapado por pertenecer a otro módulo falla; usar inventario de ejemplo como real falla.

## Evidencia pedida

CIDR corregidos, test de contrato y límites de red.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
