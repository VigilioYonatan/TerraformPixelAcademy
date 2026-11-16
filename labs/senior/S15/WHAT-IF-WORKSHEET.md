# S15 — Simulación «¿qué pasaría si...?"

**Caso:** Recuperación de state / desbloqueo de emergencia  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Un state parece corrupto y un operador pide ejecutar force-unlock ya.

1. Congelar writers, diagnosticar, respaldar y recuperar con autorización
2. Borrar lock y sobrescribir state con cualquier archivo reciente

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: desbloqueo/restore no autorizado puede empeorar la pérdida de estado.

## Criterio de seguridad esperado

Procedimiento de recuperación con snapshot verificable y doble control.

## Contrato de evidencia

Versiones state, timestamps, ownership, recuperación probada y RCA.

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
