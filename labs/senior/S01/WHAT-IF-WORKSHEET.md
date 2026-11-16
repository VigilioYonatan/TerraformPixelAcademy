# S01 — Simulación «¿qué pasaría si...?"

**Caso:** Reemplazo destructivo por refactor de `for_each`  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

El plan muestra destroy/create tras renombrar una clave for_each. ¿Qué revisión autorizas?

1. Revisar moved + direcciones, bloquear destroy y comparar planes
2. Aplicar y confiar en que el sistema se recuperará

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: el cambio de claves altera direcciones Terraform; la continuidad no está garantizada.

## Criterio de seguridad esperado

GO condicionado: registrar moved y confirmar un plan sin reemplazos inesperados.

## Contrato de evidencia

Mapa de direcciones old/new, plan previo y posterior, revisión de owner.

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
