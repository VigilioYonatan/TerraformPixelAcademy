# S10 — Simulación «¿qué pasaría si...?"

**Caso:** IAM mínimo en GitHub Actions + OIDC  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Un workflow GitHub Actions usa una access key de AWS de larga duración.

1. Guardar la misma clave en otro secreto del repositorio
2. Federar OIDC y restringir trust policy, audiencia y permisos IAM

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: mover la misma clave no elimina el riesgo de credenciales persistentes.

## Criterio de seguridad esperado

Credenciales efímeras y autorización mínima por repositorio/rama/entorno.

## Contrato de evidencia

Trust policy OIDC, permissions id-token y prueba de acceso limitado.

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
