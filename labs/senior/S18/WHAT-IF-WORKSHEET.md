# S18 — Simulación «¿qué pasaría si...?"

**Caso:** Capstone de Platform Engineering con Terraform  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

El capstone tiene módulos, pero no define estados separados ni respuesta a incidentes.

1. Entregar tal cual porque compila
2. Separar responsabilidades, documentar ocho hitos y evidencias con rollback

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: un capstone sin ownership, estados ni recuperación no está operativo.

## Criterio de seguridad esperado

Preparación Senior: evidencias diferenciadas por hito y límites de arquitectura claros.

## Contrato de evidencia

Ocho entregables con estado real, ADR, pruebas y plan de rollback.

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
