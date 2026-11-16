# S13 — Simulación «¿qué pasaría si...?"

**Caso:** Policy as Code y excepciones  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Una política deniega exposición pública y un equipo solicita excepción.

1. Registrar excepción temporal, owner, TTL, compensación y aprobación
2. Deshabilitar la política global para desbloquear la release

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: desactivar política global suprime el guardrail de todos los equipos.

## Criterio de seguridad esperado

La excepción queda limitada, auditada, reversible y con vencimiento.

## Contrato de evidencia

Policy evaluation, excepción firmada, TTL y controles compensatorios.

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
