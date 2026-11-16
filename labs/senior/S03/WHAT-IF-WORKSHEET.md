# S03 — Simulación «¿qué pasaría si...?"

**Caso:** Drift fuera de banda  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Hay tags diferentes entre Git, state y recurso remoto. ¿Cómo procedes?

1. Investigar origen y decidir adopción o reversión con plan controlado
2. Modificar el state a mano para ocultar la deriva

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: editar el state a ciegas destruye trazabilidad y no corrige la causa.

## Criterio de seguridad esperado

Se identifica drift antes de reconciliar y se conserva el rastro del cambio fuera de banda.

## Contrato de evidencia

Snapshot saneado de Git/state/remoto y plan con proveedor autorizado.

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
