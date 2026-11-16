# S08 — Simulación «¿qué pasaría si...?"

**Caso:** Dependencias circulares y módulos acoplados  
**Datos:** sintéticos (NO son logs, planes o resultados de Terraform CLI).  
**Ejecución Terraform/cloud:** NOT_RUN.

## Pregunta de decisión

Dos módulos se necesitan mutuamente y Terraform detecta un ciclo.

1. Agregar depends_on entre ambos módulos
2. Rediseñar el contrato y extraer una dependencia común desacoplada

**Tu elección y argumento técnico:**

> Escribe aquí la opción y por qué evita el riesgo principal. No confundas una hipótesis con una prueba ejecutada.

## Señal de peligro

NO-GO: más depends_on no resuelve un grafo con dependencias circulares.

## Criterio de seguridad esperado

Se rompe el ciclo haciendo explícito el contrato unidireccional de dependencias.

## Contrato de evidencia

Grafo antes/después, inputs/outputs y pruebas de módulos.

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
