# S08 — Registro de revisión individual

## Contexto

Contexto: network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.

## Misión y criterio de aceptación

romper ciclo con interfaces claras, separar ownership y evitar una capa monolítica innecesaria.

## Artefactos que deberían revisarse

diagrama de grafo circular, interfaces de módulos y errores de planificación de ejemplo.

## Cuatro controles específicos

- [ ] G1: Dibujé el ciclo de dependencias entre módulos y recursos concretos
- [ ] G2: Definí interfaces output/input que rompen el acoplamiento bidireccional
- [ ] G3: Revisé cómo terraform graph representaría el orden tras el cambio
- [ ] G4: Escribí plan de migración incremental con owner y retorno

## Decisión y alternativas

- Decisión:
- Alternativa rechazada:
- Consecuencia:

## Evidencia verificable y procedencia

- Estado de la CLI: NOT_RUN
- Estado cloud: NOT_RUN
- Estado de revisión humana: NOT_RUN
- Enlace/hash del artefacto cuando exista:
- Responsable y fecha:

## Plan de rollback y comunicación

- Condición de parada:
- Dependencias:
- Owner:
- Acción de contención:
- Prueba de recuperación:

> Documento educativo: marcar un control no demuestra que se ejecutó una prueba real.
