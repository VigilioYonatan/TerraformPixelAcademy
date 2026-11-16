# S17 — Simulación «¿qué pasaría si...?"

**Caso:** Revisión técnica de una plataforma IaC  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

En revisión de plataforma faltan rollback, pruebas y owners aunque el HCL compile.

1. Bloquear aprobación hasta documentar riesgos, pruebas y responsables
2. Aprobar con el argumento de que el código es legible

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: compilación y estilo no prueban seguridad operacional.

## Criterio de seguridad esperado

Review gate exige evidencia, ownership, política y operación, no solo sintaxis.

## Contrato de evidencia

Checklist de revisión, ADR, testing, plan, costos y matriz de owners.

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
