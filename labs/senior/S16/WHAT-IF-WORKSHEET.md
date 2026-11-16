# S16 — Simulación «¿qué pasaría si...?"

**Caso:** Límite Terraform vs Helm/GitOps  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Terraform administra un recurso que también reconcilia Helm/GitOps.

1. Permitir que ambos editen el mismo objeto
2. Definir un solo controlador por campo/recurso y contrato de handoff

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: dos reconciliadores generan drift y conflictos continuos.

## Criterio de seguridad esperado

Se clarifica ownership, límites IaC/GitOps y las interfaces de entrega.

## Contrato de evidencia

Matriz de ownership, recursos y campos controlados, flujo de handoff.

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
