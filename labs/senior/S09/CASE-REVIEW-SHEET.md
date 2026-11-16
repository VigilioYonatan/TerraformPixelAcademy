# S09 — Registro de revisión individual

## Contexto

Contexto: dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.

## Misión y criterio de aceptación

detectar solapamiento par-a-par, rechazar topología inválida y revisar contrato/digest del stack de red.

## Artefactos que deberían revisarse

mapa de redes con CIDR ficticios, contratos de variables y matriz de ambientes.

## Cuatro controles específicos

- [ ] G1: Comprobé matemáticamente el solapamiento de CIDR y el blast radius
- [ ] G2: Contrasté nueva propuesta con la asignación IPAM y conexiones existentes
- [ ] G3: Definí evidencia de routing/conectividad y marcada NOT_RUN cuando no se probó
- [ ] G4: Planifiqué migración de IPs, ventana autorizada y rollback de rutas

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
