# S11 — Simulación «¿qué pasaría si...?"

**Caso:** El plan aprobado no es el plan aplicado  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Se aprobó el plan del commit A, pero el pipeline aplica el commit B.

1. Rechazar el apply y verificar digest, commit y entorno del plan aprobado
2. Aplicar porque ambos commits están en la misma rama

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: una rama mutable no identifica el artefacto aprobado.

## Criterio de seguridad esperado

Cadena plan-aprobación-apply vinculada a un único artefacto inmutable.

## Contrato de evidencia

SHA-256 del plan, commit, entorno, aprobaciones y logs del runner.

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
