# S09 — Simulación «¿qué pasaría si...?"

**Caso:** CIDR solapados entre entornos  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Development y producción tienen CIDR solapados y necesitan conectividad.

1. Bloquear peering y rediseñar direcciones mediante IPAM
2. Crear rutas más específicas y esperar que no existan conflictos

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: rutas más específicas no garantizan direccionamiento único entre redes.

## Criterio de seguridad esperado

Conflicto detectado; planificación IPAM requerida antes de conectar.

## Contrato de evidencia

CIDR calculados, inventario IPAM, rutas y plan de renumeración.

| Comprobación | Estado inicial | Ejecución requerida |
|---|---|---|
| Análisis de incidente didáctico | NOT_RUN | Respuesta individual del alumno |
| Terraform CLI | NOT_RUN | Laboratorio autorizado independiente |
| Cloud/API | NOT_RUN | Sandbox controlado, con credenciales efímeras |
| Revisión por otro ingeniero | NOT_RUN | Peer review con autor/fecha |

## Runbook mínimo

1. Identificar recurso, entorno y dueño de la operación.
2. Determinar impacto y criterio explícito GO/NO-GO.
3. Conseguir la evidencia indicada arriba; si falta, declarar NOT_RUN/BLOCKED.
4. Escribir propuesta de contención, rollback, observabilidad y aprobación.
5. No ejecutar apply ni force-unlock desde el simulador de la academia.
