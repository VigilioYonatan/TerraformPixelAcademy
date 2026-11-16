# S06 — Simulación «¿qué pasaría si...?"

**Caso:** Filtración de secretos en state, plan o logs  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Un secreto aparece en un plan guardado en CI. ¿Cuál es el primer control?

1. Declarar la variable sensitive y dejar el artefacto público
2. Restringir/eliminar exposición y rotar secreto antes de reintentar

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: sensitive puede ocultar salida, pero no elimina todo el secreto de state/plan.

## Criterio de seguridad esperado

Contención, rotación, revisión de accesos y prevención de reexposición.

## Contrato de evidencia

Registro de contención, rotación, retención y controles de acceso.

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
