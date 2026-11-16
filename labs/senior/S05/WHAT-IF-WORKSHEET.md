# S05 — Simulación «¿qué pasaría si...?"

**Caso:** Migración de backend de estado  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Vas a mover un backend local a S3 con bloqueo. ¿Qué secuencia es defendible?

1. Congelar escritores, backup, verificar destino, migrar y contrastar estado
2. Cambiar bucket/key y asumir que el state seguirá intacto

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: cambiar el backend sin preflight puede dividir el ownership o perder estado.

## Criterio de seguridad esperado

Migración condicionada a backup, ownership, bloqueo y verificación de estado posterior.

## Contrato de evidencia

Inventario de workspaces, versión del backup, bloqueo y comparación pre/post.

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
