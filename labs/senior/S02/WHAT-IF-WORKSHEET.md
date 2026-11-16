# S02 — Simulación «¿qué pasaría si...?"

**Caso:** Lock concurrente de state  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Un writer mantiene el lock y un segundo job no puede aplicar. ¿Qué harías?

1. Quitar lock con -lock=false y continuar
2. Identificar job propietario, esperar/cancelar y replanificar

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: desactivar lock permite carreras y corrupción potencial del estado.

## Criterio de seguridad esperado

Espera controlada y verificación de ownership; force-unlock solo con investigación y aprobación.

## Contrato de evidencia

Job ID, propietario del lock, timestamps y estado del primer writer.

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
