# Senior Mode · Playbook DevSecOps

## Objetivo

Revisar cambios de infraestructura como un Platform Engineer sin confundir simulación, firma, plan, aprobación y ejecución. Este documento acompaña los incidentes S01–S18 y el capstone S18.

## Flujo de aprobación de un cambio

1. **Origen** — PR enlazado a commit SHA; propietario; entorno; línea base Terraform y proveedores versionados; riesgo de supply chain.
2. **Identidad** — Credenciales federadas OIDC y permisos mínimos para el entorno. Nunca almacenar access keys de larga duración en CI.
3. **Estado** — Backend protegido, locking activo, versión histórica/backup y permisos reducidos; no usar `-lock=false` para resolver conflictos.
4. **Pruebas** — `terraform fmt -check`, `init`, `validate`, `test` y `plan` con el entorno autorizado. Guardar salida legible sin secretos. No tratar resultado de web como CLI.
5. **Políticas** — Evaluar cambios destructivos, seguridad, etiquetado, costos, datos críticos, compatibilidad, drift y blast radius; registrar evidencias.
6. **Aprobación** — Revisión humana del artefacto exacto que se aplicará; comprobar digest, commit, entorno y expiración. El hash por sí solo **no es firma criptográfica**.
7. **Ejecución** — Solo pipelines de producción autorizados, con ventana, owner, concurrencia y control de cuota. La academia no ofrece ese endpoint.
8. **Postcambio** — Verificación funcional, métricas, drift, presupuesto, alertas, rollback y cierre documental.

## Matriz de evidencia por familia

| Familia | Incidentes | Riesgo y evidencia mínima |
|---|---|---|
| Identidad/state | S01–S04 | mapa de direcciones, titular del lock, diff/plan, backup |
| Módulos y migraciones | S05–S08 | versiones, contract tests, cambios de dirección, plan reversible |
| Seguridad y red | S09–S12 | CIDR, least privilege, integridad de plan, revisión humana |
| CI y FinOps | S13–S17 | autenticación federada, cambio aprobado, costos, pruebas y cleanup |
| Capstone | S18 | 8 evidencias distintas, ADR, tests, plan, ownership, rollback |

## S18: entregables verificables, sin credenciales

Para cada uno de los ocho hitos: `HITO-XX-EVIDENCIA.md` con hipótesis, comandos realizados, resultado real `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`, salida saneada, riesgos residuales y responsable. Los archivos de ejemplo del capstone no incluyen sistemas cloud reales ni backend S3. **No** se entregan archivos `.tfstate`, planes binarios ni credenciales en repositorio.

## Estados legítimos

- `PASS`: ejecutar y observar el control concreto (adjuntar evidencia reproducible).
- `FAIL`: ejecución real que falló, causa y propuesta correctiva.
- `NOT_RUN`: no ejecutado; jamás convertir a PASS por una simulación.
- `BLOCKED`: falta de herramienta, credencial autorizada, infraestructura o aprobación.

La aplicación valida estructura y respuestas de quiz; un responsable humano debe revisar exactitud técnica y autenticidad de cualquier evidencia Senior antes de aceptar un cambio real.
