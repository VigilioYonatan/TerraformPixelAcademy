# S04 — Simulación «¿qué pasaría si...?"

**Caso:** Destrucción de recurso crítico  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Un plan intenta eliminar un recurso de datos de producción sin backup verificado.

1. Aprobar si terraform validate termina sin errores
2. Bloquear, clasificar datos y exigir recuperación probada

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: validate revisa estructura, no riesgos de disponibilidad ni pérdida de datos.

## Criterio de seguridad esperado

NO-GO hasta demostrar backup/restore, dependencia, ventana y aprobación del owner.

## Contrato de evidencia

Plan firmado/identificado, aprobación del propietario y evidencia de restauración.

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
