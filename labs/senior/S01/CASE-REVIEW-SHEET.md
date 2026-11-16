# S01 — Registro de revisión individual

## Contexto

Contexto: un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar direcciones Terraform.

## Misión y criterio de aceptación

señalar recursos afectados, bloquear el apply, evaluar `moved` y documentar un procedimiento de migración de direcciones.

## Artefactos que deberían revisarse

`main-before.tf`, `main-after.tf`, fixture de plan con `delete/create`, mapa de recursos y restricciones de disponibilidad.

## Cuatro controles específicos

- [ ] G1: Identifiqué las direcciones old_key/new_key y los recursos que podrían reemplazarse
- [ ] G2: Comprobé cuándo moved conserva identidad y cuándo la migración no es segura
- [ ] G3: Exigí revisar plan sin delete/create inesperados y registrar NOT_RUN si no se ejecutó
- [ ] G4: Definí ventana de cambio, owner de state y reversión antes del apply

## Decisión y alternativas

- Decisión:
- Alternativa rechazada:
- Consecuencia:

## Evidencia verificable y procedencia

- Estado de la CLI: NOT_RUN
- Estado cloud: NOT_RUN
- Estado de revisión humana: NOT_RUN
- Enlace/hash del artefacto cuando exista:
- Responsable y fecha:

## Plan de rollback y comunicación

- Condición de parada:
- Dependencias:
- Owner:
- Acción de contención:
- Prueba de recuperación:

> Documento educativo: marcar un control no demuestra que se ejecutó una prueba real.
