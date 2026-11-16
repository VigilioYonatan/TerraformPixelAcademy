# S07 — Simulación «¿qué pasaría si...?"

**Caso:** Upgrade de provider incompatible  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Una actualización de provider cambia el schema y propone reemplazos.

1. Fijar versiones, revisar notas, plan en entorno aislado y estrategia de rollback
2. Actualizar todos los providers en producción sin lockfile

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: sin lockfile ni plan reproducible no se conoce el impacto del upgrade.

## Criterio de seguridad esperado

Upgrade con lockfile, matriz de compatibilidad y evidencia de cambios esperados.

## Contrato de evidencia

Versiones antes/después, .terraform.lock.hcl, plan y pruebas de regresión.

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
