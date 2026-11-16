# TerraPixel Academy — Auditoría Senior v1.2

**Gate: ENTREGA PARCIAL / NO APROBADA contra toda la especificación.** Registro de controles realmente ejecutados en este contenedor; no certificado de producción.

## Cambios que se conservan sobre v1.1

- Se trabajó sobre una extracción de `TerraPixel_Academy_v1_1_REVISADA.zip`, sin borrar fuentes, imágenes, bundles o ejercicios de origen.
- Se añadieron 18 archivos `labs/senior/Sxx/REVIEW-GATES.md` con comprobaciones específicas, y se regeneraron sus 18 ZIP. Las rutas fuente existentes permanecen presentes.
- `src/seniorReport.ts` genera informes Markdown descargables del alumno, sin adjudicar ejecuciones externas.
- `src/engine.ts` valida apartados y contenidos mínimos por sección, estados explícitos de evidencia y cuatro IDs de checklist válidos. **No** entiende la calidad técnica ni verifica logs.
- `src/main.ts` conecta entradas reales de S09 (CIDR), S11 (commits) y S14 (réplicas) con los simuladores, y añade exportación Senior.
- Se corrigió además el desbordamiento horizontal del catálogo en pantallas de 390 píxeles con una cuadrícula de ancho mínimo cero. Se añadieron pruebas `tests/senior-report.test.mjs`, `tests/http-smoke.test.mjs` y `tests/browser-embedded.py`.

## Matriz Senior

| Requisito | Evidencia | Estado |
|---|---|---|
| 18 casos y decisiones diferenciadas | `src/senior.ts`, Node tests | VERIFICADO de datos |
| 18 listas de revisión específicas | `labs/senior/S01…S18/REVIEW-GATES.md`, Node tests | VERIFICADO de estructura |
| 18 bundles íntegros y alineados con su fuente | `python3 scripts/release-audit.py` | VERIFICADO de contenido |
| ADR exportable desde UI | `src/seniorReport.ts`, Chromium embebido S01, Node | VERIFICADO de interacción embebida |
| Gate de ADR estructural | Node tests | VERIFICADO de reglas (no semántica) |
| S09 cambios CIDR | Chromium embebido, valor no solapado y solapado | VERIFICADO de interacción embebida |
| S11 commits de integridad | Chromium embebido, match y mismatch | VERIFICADO de interacción embebida |
| S14 estimación de réplicas | Chromium embebido, resultado USD 61 | VERIFICADO de interacción embebida |
| S18 no se completa sin ocho hitos | Chromium embebido gate inicial | VERIFICADO parcial |
| Estado guardado local tras reiniciar navegador | Navegación normal bloqueada | NO VERIFICABLE en navegador |
| Pruebas CLI de 36 labs | `terraform` no instalado | NO VERIFICABLE |
| Evaluación de ADR por experto humano | No se incluye ese servicio | NO APLICA: autoevaluación etiquetada |
| E2E vía localhost (HTTP + assets + CSS + responsive) | Chromium rechaza navegar con `ERR_BLOCKED_BY_ADMINISTRATOR` | NO VERIFICABLE |
| Requisito Preact + CodeMirror | Dependencias npm sin resolver; runtime TypeScript DOM | INCOMPLETO P1 |
| Lockfile y build de Vite | Registro npm inaccesible; build estático alternativo | INCOMPLETO P1 |

## Validaciones reales ejecutadas

- `npm run qa` — 24/24 Node tests PASS, TypeScript estricto PASS.
- `npm run build` — compilación TS y copia estática a `dist` PASS; **no usa bundler Vite**.
- `python3 scripts/release-audit.py` — 1.181 validaciones estructurales y ZIP internos PASS.
- `python3 tests/browser-embedded.py` — 25 controles Chromium sobre módulos JS embebidos PASS (sin HTTP/almacenamiento/PNG).
- Prueba HTTP Node — recurso público, packs y bloqueo de código fuente PASS; no valida la interfaz de Chromium por HTTP.

## Limitaciones explícitas y release gate

P1 pendientes: migración efectiva a Preact y editor CodeMirror 6; resolución de dependencias, lockfile y build Vite. Las 36 pruebas Terraform CLI y el E2E completo siguen sin ejecutarse. No se elimina ni rebaja un requisito para aprobar. Esta entrega **no está aprobada como producto final**.

Para reproducir un gate de CI completo se necesita acceso a npm, Terraform CLI y un navegador que permita `localhost`, además de revisión de marca/derechos si se publica comercialmente.
