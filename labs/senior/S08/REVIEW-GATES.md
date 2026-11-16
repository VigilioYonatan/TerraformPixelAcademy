# S08 — controles específicos de revisión Senior

> CASO SINTÉTICO PARA FORMACIÓN. Ninguna ejecución Terraform ni verificación de cloud ha sido realizada por esta guía.

## Escenario

Contexto: network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.

## Gate de riesgo

mover `depends_on` sin resolver la dependencia lógica no gana; copiar outputs sensibles entre stacks falla.

## Qué revisar y documentar

1. Dibujé el ciclo de dependencias entre módulos y recursos concretos.
2. Definí interfaces output/input que rompen el acoplamiento bidireccional.
3. Revisé cómo terraform graph representaría el orden tras el cambio.
4. Escribí plan de migración incremental con owner y retorno.

## Evidencia exigida

grafo antes/después, razones de estratificación y trade-offs.

Registrar cada comprobación con `PASS`, `FAIL`, `BLOCKED` o `NOT_RUN`, hora, fuente y responsable. No reportar `PASS` sin observación real. Un checklist marcado solo representa autoevaluación.

## Resultado

- Decisión propuesta: **PENDIENTE**
- Aprobación humana: **NOT_RUN**
- Terraform CLI: **NOT_RUN**
- Proveedor cloud: **NOT_RUN**
- Rollback ensayado: **NOT_RUN**
