# S08 — Dependencias circulares y módulos acoplados

> **SIMULACIÓN EDUCATIVA — no se ejecuta infraestructura cloud.**

## Contexto

Contexto: network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.

## Misión

romper ciclo con interfaces claras, separar ownership y evitar una capa monolítica innecesaria.

## Artefactos de referencia

diagrama de grafo circular, interfaces de módulos y errores de planificación de ejemplo.

## Riesgo que debe bloquear

mover `depends_on` sin resolver la dependencia lógica no gana; copiar outputs sensibles entre stacks falla.

## Evidencia pedida

grafo antes/después, razones de estratificación y trade-offs.

## Guía de uso

1. Lee `incident.json`, `review-before.txt` y el plan de referencia.
2. Investiga alternativas y define controles de riesgo.
3. Compara el fragmento problemático con `review-after.txt` y explica por qué el segundo es más seguro.
4. Redacta el documento `ADR-TEMPLATE.md` y completa `OPERATIONS-CHECKLIST.md`.
5. Registra resultados como `PASS`, `FAIL`, `NOT_RUN` o `BLOCKED`, con procedencia real.

**No consideres un archivo de ejemplo como prueba de ejecución real.**
