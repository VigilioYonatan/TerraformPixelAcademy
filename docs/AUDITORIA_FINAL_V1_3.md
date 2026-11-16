# TerraPixel Academy — Auditoría total de entrega v1.3

**Fecha:** 11/11/2026 (America/Lima).  
**Base protegida:** `TerraPixel_Academy_v1_2_SENIOR_AUDITADA.zip`.  
**Decisión de release:** **ENTREGA PARCIAL / NO APROBADA** respecto a la especificación maestra completa. Hay implementación adicional y controles aprobados, pero persisten bloqueos conocidos.

## Matriz de requisitos principales

| Requisito | Archivos / implementación | Evidencia observada | Estado |
|---|---|---|---|
| Preservar todos los archivos de v1.2 | ZIP v1.2 vs árbol v1.3 | Comparación de rutas; ninguna eliminada | VERIFICADO |
| Arte visual original / Terra | `assets/terra`, `assets/reference` | PNG originales conservados | VERIFICADO de presencia y estructura |
| Frontend, portada, 36 lecciones | `src/main.ts`, `src/curriculum.ts` | TypeScript + Node, navegación Chromium embebida | VERIFICADO en modo embebido |
| 5 juegos y progreso local | `src/games.ts`, `src/engine.ts` | Unit tests; persistencia real tras recarga HTTP no probada | VERIFICADO lógica; NO VERIFICABLE browser origin |
| 18 retos Senior y rubricas específicas | `src/senior.ts` + `labs/senior` | Node tests y contratos por escenario | VERIFICADO |
| 18 ejercicios what-if interactivos | `src/seniorWhatIf.ts`, `src/main.ts` | Node 18 safe/unsafe + Chromium 18 rutas | VERIFICADO como simulador |
| Respuestas what-if persistibles/exportadas | `src/engine.ts`, `src/seniorReport.ts` | Tests sanitización/exportación Node | VERIFICADO lógica |
| Corregir finalización Senior obsoleta | `src/seniorProgress.ts` | Tests de cambio de ADR/decisión/checklist, interacción S18 | VERIFICADO |
| Portafolio Senior (18 ADR) | `src/seniorReport.ts` | Descarga efectiva en Chromium embebido, test textual | VERIFICADO |
| S18 con ocho evidencias individuales | `src/seniorProgress.ts`, UI y `labs/senior/S18/capstone/HITO-*.md` | Node gate + Chromium ocho hitos + revocación | VERIFICADO estructural |
| Capstone Terraform modular local | `labs/senior/S18/capstone/` | Estructura `.tf`, pruebas `.tftest.hcl`, control de ausencia de AWS | VERIFICADO estático; NO VERIFICABLE CLI |
| 36 labs Terraform diferenciados | `labs/offline`, `assets/labs` | Node contenido y CRC ZIP | VERIFICADO estructura; NO VERIFICABLE CLI |
| 18 ZIP Senior completos y alineados | `assets/senior`, `labs/senior` | Comparación recursiva byte por byte y CRC | VERIFICADO empaquetado |
| Runner real Terraform CLI (37 prácticas) | `scripts/verify-terraform-labs.sh`, `.ps1`, workflow | Sintaxis shell; sin CLI retorna `NOT_RUN` exit 3 | VERIFICADO control de ausencia; CLI NO VERIFICABLE |
| HTML/CSS responsive en Senior | `styles.css` y UI | Chromium embebido 320/390/768/1440 | VERIFICADO en modo embebido |
| HTTP local y protección de archivos | `scripts/server.mjs` | Test HTTP Node; `src` denegado | VERIFICADO |
| 33 tests de lógica/datos | `tests/*.test.mjs` | `npm run qa` TypeScript + Node | VERIFICADO |
| 25 + 34 interacciones en Chromium | `tests/browser-embedded.py`, `tests/browser-senior-v13.py` | PASS; 0 JS errors en pruebas embebidas | VERIFICADO en modo embebido |
| Build estático TypeScript | `scripts/build-static.mjs`, `dist` | `npm run build` PASS | VERIFICADO como build estático, no Vite |
| Stack completo Preact | `src/main.ts` | Sigue usando plantillas HTML + DOM | **INCOMPLETO P1** |
| Editor CodeMirror 6 real | `src/main.ts` | Editor HTML `textarea`, sin CodeMirror | **INCOMPLETO P1** |
| Lockfile y build Vite reproducibles | `package.json`, `vite.config.js` | npm registry inaccesible; no lockfile; Vite no disponible | **INCOMPLETO P1** |
| 37 CLI Terraform PASS | `labs/offline`, `labs/senior/S18/capstone` | Terraform CLI no instalada en el contenedor | **NO VERIFICABLE** |
| E2E Chromium HTTP y localStorage | navegador Chromium -> localhost/file:// | `ERR_BLOCKED_BY_ADMINISTRATOR` (confirmado) | **NO VERIFICABLE** |
| Acreditación oficial Senior | No ofrecida | Autoevaluación identificada explícitamente | NO APLICA |
| Cloud apply remoto | No ofrecido por seguridad/costo | Sin credenciales ni API en navegador | NO APLICA |

## Validaciones y pruebas reproducibles

```bash
npm run qa
npm run build
python3 scripts/release-audit.py
python3 tests/browser-embedded.py
python3 tests/browser-senior-v13.py
bash scripts/verify-terraform-labs.sh   # CLI NO DISPONIBLE: NOT_RUN, exit 3
```

**Resultados locales obtenidos antes del empaquetado:** 33/33 tests Node PASS; `tsc` PASS; build estático PASS; 25 interacciones Chromium generales y 34 Senior PASS en modo embebido; 1.363 controles de integridad/estructura PASS; 18 ZIP Senior regenerados con contenido recursivo coincidente byte por byte. El último gate consiste en extraer el ZIP exterior en carpeta limpia y repetir estos controles.

## Hallazgos pendientes, severidad y tratamiento

- **P1:** Preact no implementado de forma real. No sustituirlo por una etiqueta o por una isla de VDOM ficticia.
- **P1:** CodeMirror 6 no integrado; no simular que un `textarea` es CodeMirror.
- **P1:** Lockfile e instalación reproducible con Vite sin resolver. `npm run build` usa TypeScript + copia, no Vite. npm registry inaccesible en el contenedor (`EAI_AGAIN`).
- **NO VERIFICABLE:** Terraform CLI no disponible; no afirmar validez sintáctica/semántica de los 37 ejercicios como si `terraform test` hubiera pasado.
- **NO VERIFICABLE:** Chromium HTTP, `localStorage` entre recargas y carga de PNG por HTTP bloqueados para browser E2E (tests embebidos no lo sustituyen).
- **P2:** Navegación y render viven en un `src/main.ts` monolítico; necesita modularización al migrar a Preact.
- **P2:** Autoevaluación del ADR revisa estructura y estados escritos, no exactitud, autenticidad de logs o revisión humana.
- **Legal:** nombre comercial, uso descriptivo de Terraform y derechos de marca sujetos a revisión antes de publicación pública.

## Seguridad y procedencia

- El frontend no ejecuta `apply` ni solicita cuentas cloud. Los planes y what-if son `SYNTHETIC_SCENARIO` o fixtures educativos.
- El runner usa `terraform_data` y tests locales; no requiere AWS, pero la ejecución debe realizarse en entorno controlado.
- Los archivos JSON/Markdown exportados pueden contener datos escritos por el alumno. No se incluyen secretos voluntariamente ni credenciales reales en el paquete.
- El control de secretos usa patrones comunes y no equivale a un escaneo de seguridad exhaustivo.

## Decisión

**NO APROBADO como implementación completa de la especificación original.** La versión 1.3 amplía y verifica la experiencia educativa de Senior Mode y preserva la base anterior. Apta para continuar desarrollo y pruebas; publicación de producción requiere cerrar Preact, CodeMirror, instalación reproducible y controles CLI/E2E externos.
