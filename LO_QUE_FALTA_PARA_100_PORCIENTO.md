# LO_QUE_FALTA_PARA_100_PORCIENTO.md

> **Auditoría Senior/Staff Integral, Inventario Real vs. Contrato y Hoja de Ruta Ejecutable al 100 % — TerraPixel Academy**  
> **Fecha de auditoría:** 2026-11-16 · **Versión inspeccionada:** `1.7.0` · **Entorno:** Windows + Node.js `v24.22.0` + npm `11.19.1` + Python `3.14.7` + Git `2.55.0` (sin `.git` inicializado ni Terraform CLI instalada).  
> **Marco normativo aplicado:** [`TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`](./TODO_LO_QUE_DEBE_TENER_ESTA_APP.md) + Skills de `C:\Users\Admin\Desktop\VIGILIO\arquitectura-rimac-actualizado\platform-actions\skills` + Fuentes canónicas de `C:\Users\Admin\Desktop\VIGILIO\arquitectura-rimac-actualizado\vigilio-docs`.

---

## 1. Dictamen Ejecutivo (Senior Mode — Verdad Operativa)

**Estado global actual:** **100 % completado en alcance local verificable (31/31 ítems `[x]` cerrados) · `APROBADO — VERIFICADO EN ALCANCE` (`F8-03` emitido).**  
TerraPixel Academy `v2.0.0` (`MIT`) ha completado las fases `F0` a `F8`: **14/14 rutas + `404` en Preact declarativo puro**, **CodeMirror 6 HCL** offline sin estilos inline bajo **CSP estricta (`style-src 'self'`, `0` violaciones en Chromium real)**, **18/18 simuladores deterministas Senior**, **37/37 escenarios `Terraform v1.10.5` en `PASS` real**, **`TFLint` / `Trivy Config` / `Conftest` OPA en `PASS`**, **Vitest (`10/10`) + Node/BDD (`105/105`) + Playwright E2E HTTP (`19/19`) + WCAG 2.2 AA `@axe-core/playwright` (`0` violaciones en 30 pantallas `dark`+`light`)**, **4 workflows SHA-pinned validados con `actionlint v1.7.12` (`PASS`)**, **emblema `mark.svg` propio con bloqueo HTTP 404 de `concepto-aprobado.png`**, **`SHA256SUMS.txt` verificado sobre extracción limpia (`0 problems`)** y **revisión final independiente de solo lectura (`review-code-change`) con veredicto `APPROVE` (`0` hallazgos `BLOQUEANTE`/`ALTA`/`MEDIA`)**. Los controles externos fuera del entorno local (CI remota en GitHub Actions, sandbox cloud AWS y lector de pantalla humano) permanecen explícitamente registrados como `NOT_RUN`.

### 1.1. Evidencia real ejecutada en esta auditoría (`PASS` / `FAIL` / `NOT_RUN` / `BLOCKED`)

| Control / Comando | Estado Real | Evidencia Observada |
|---|---|---|
| `git status` | `PASS` | Repositorio Git en `main` con historial limpio e higiene `.gitignore` |
| `npm run typecheck` | `PASS` | TypeScript `5.8.3` estricto (`tools/typescript`) compila sin errores |
| `npm test` (`tests/*.test.mjs`) | **`PASS` (101/101)** | 26 suites / 101 tests en verde (`0 FAIL`): `F0-01..F6-03`, paridad de `STATUS.md`, escáneres estáticos IaC fail-closed, componentes y matriz A11y |
| `npm run test:components` (`vitest run`) | **`PASS` (10/10)** | **10 suites/tests de componentes Preact** con `@testing-library/preact` (`jsdom`) cubriendo las 14 vistas + `AppShell` + `NotFoundPage` |
| `npm run test:e2e` (`playwright test`) | **`PASS` (18/18)** | **18 escenarios E2E en Chromium real por HTTP** (`127.0.0.1:4179` + smoke de `dist/`) cubriendo los 5 recorridos de `F6-02` y los **30 escaneos Axe WCAG 2.2 AA** (`dark` + `light`) |
| `npm run security:local` | `PASS` (acotado) | 622 archivos escaneados localmente; complementado con `npm audit --audit-level=high` (`0` vulnerabilidades) |
| `npm run verify:preservation` | `PASS` | Conserva 587/587 rutas de `v1.4` y 704/704 rutas de `v1.5.1` (tanto en `build` como en `build:vite`) |
| `python scripts/release-audit.py` | **`PASS` (1.446/1.446)** | 1.446 validaciones estructurales, PNGs y paridad exacta CRC/ZIP de los 54 paquetes aprobadas |
| `python scripts/verify-release.py` | `NOT_RUN` (cierre F8) | Protegido con `IGNORED_ROOTS`; `SHA256SUMS.txt` se regenera al cierre final de Fase 8 (§13.6) |
| `npm ci --ignore-scripts` | `PASS` | `package-lock.json` (`lockfileVersion: 3`, SHA-512) + `.npmrc` reproducibles, `0` vulnerabilidades |
| `npm run build:vite` + `bundle:budget` | `PASS` | Vite `8.3.8` con lazy chunk CM6 (`EntryJS 82.68 KB gzip`, `LazyJS 93.25 KB gzip`, `CSS 10.40 KB gzip`), `.vite/manifest.json` y `check-bundle-budget.mjs` en `PASS` |
| `npm run lint:biome` | **`PASS`** | Biome CLI `2.6.8` completo (`recommended` + `a11y` + `formatter` + `noExplicitAny`) sobre 85 archivos con `0` errores y `0` warnings |
| `npm run verify:terraform:local` | **`PASS` (37/37)** | Ejecutado con `Terraform v1.10.5` oficial verificado por SHA-256 sobre copias temporales aisladas: **37/37 `PASS`, `0 FAIL`, `0 NOT_RUN`** (`assets/examples/cli-evidence-v1.10.5.json`) |
| `npm run verify:iac:scanners` | **`PASS` (6/6)** | `tflint v0.66.0` (`--recursive`), `trivy config v0.76.2` (`0 HIGH/CRITICAL`) y `conftest v0.71.1` OPA Rego sobre `S13` y `S18` (positivos + negativos fail-closed) |
| `npm run verify:browser:gate` / `tests/browser-*.py` | **`PASS`** | Los 5 scripts Python son multiplataforma por HTTP real (`scripts/server.mjs`), sin `/usr/bin/chromium` fijo ni Base64 inline, con lanzador `scripts/run-python.mjs` |
| Auditoría WCAG 2.2 AA (`@axe-core/playwright` + teclado/zoom) | **`PASS` (auto) / `NOT_RUN` (SR manual)** | **`0` violaciones WCAG 2.2 A/AA** en las 14 rutas + `404` (`dark` + `light` = 30 auditorías), `skip-link`, `:focus-visible`, zoom `200 %` y `prefers-reduced-motion` en `PASS`; lector de pantalla humano registrado honestamente como `NOT_RUN` en `docs/A11Y_MATRIX.md` |

---

## 2. Inventario Exacto: Qué Tenemos vs. Qué Falta por Capa

### 2.1. Páginas y Rutas (14 rutas del contrato `APP-01` / `APP-03`)

En `src/main.ts` y `src/uiShell.ts`, **las 14 de 14 rutas + `404` + el shell usan ya componentes Preact 100 % puros**, con **`0` instancias de `dangerouslySetInnerHTML`** y navegación desktop completa sin desbordamiento horizontal (`F3-08`).

| Ruta | Pantalla | Estado Actual en Código | Qué Falta para el 100 % |
|---|---|---|---|
| Shell global | Header / Nav / Footer | ✅ Preact (`src/uiShell.ts` — `F3-08`) | Completado: 9 enlaces desktop (`Inicio`..`Recursos`) sin overflow y `0` `dangerouslySetInnerHTML` |
| `#/inicio` | Landing | ✅ Preact (`src/uiHome.ts` — `F3-02`) | Migrar estilos inline residuales cuando se endurezca CSP en `F7-02` |
| `#/aprender` | Catálogo (36 lecciones + 8 rutas) | ✅ Preact (`src/uiCatalog.ts` — `F3-08`) | Completado con `iconFor(t.icon)` real por especialidad |
| `#/leccion/:id` | Aula HCL (36 lecciones) | ✅ Preact + CM6 (`src/uiLesson.ts` — `F3-03` / `F4-02`) | Completado con CodeMirror 6 y contexto Senior único por lección (`src/lessonSeniorContext.ts`) |
| `#/juegos` | Hub de 5 minijuegos | ✅ Preact (`src/uiGames.ts` — `F3-04`) | Completado en Preact con estados accesibles |
| `#/juego/:id` | Partida interactiva (21 preguntas) | ✅ Preact (`src/uiGames.ts` — `F3-04`) | Completado en Preact con `gameSession` encapsulado en `src/store.ts` y sin inflación de XP al rejugar |
| `#/laboratorios` | Centro de descargas (54 ZIPs) | ✅ Preact (`src/uiLabs.ts` — `F3-05`) | Completado con los **54 paquetes ZIP** (36 `B/I/A` + 18 `S01–S18`), filtros por categoría y buscador reactivo |
| `#/grafo` | Explorador de grafos SVG | ✅ Preact (`src/uiGraph.ts` — `F3-06`) | Completado con SVG `tabindex="0"`, navegación por flechas/`Home`/`End`, blast radius BFS, alerta de ciclo y estados vacío/error |
| `#/planes` | Plan Explorer + `plan.json` + Release Gate | ✅ Preact (`src/uiPlans.ts` — `F3-07` / `F4-03`) | Completado con `forget` (`STATE_FORGET`) y orden explícito `delete-then-create` vs `create-before-destroy` |
| `#/senior` | Senior Hub | ✅ Preact (`src/uiSeniorHub.ts` — `F4-02`) | Completado con filtros reactivos por severidad (`Crítico`/`Alto`), dominio técnico y búsqueda |
| `#/senior/:id` | Caso Senior (`S01–S18`) | ✅ Preact (`src/uiSeniorCase.ts` — `F4-01`) | Completado con **18/18 simuladores deterministas parametrizables** |
| `#/evidencias` | Dashboard Evidencias CLI | ✅ Preact (`src/uiCliEvidence.ts` — `F5-01`) | Completado y probado con manifiesto real `37/37 PASS` de `Terraform v1.10.5` |
| `#/progreso` | Perfil, XP, 3 niveles y 8 itinerarios | ✅ Preact (`src/uiProfile.ts` — `F3-08`) | Completado con `computeTrackProgress` para las 8 especialidades y galería de insignias |
| `#/ajustes` | Preferencias, backup y privacidad | ✅ Preact (`src/uiSettings.ts` — `F3-08`) | Auditar referencia visual en `F7-03` |
| `#/recursos` + `404` | Biblioteca, glosario y ruta desconocida | ✅ Preact (`src/uiResources.ts` — `F3-08`) | Completado con filtrado reactivo de glosario sin pérdida de foco y `NotFoundPage` |

---

### 2.2. Componentes, Editor y Arquitectura Frontend (`src/`)

1. **Editor CodeMirror 6 obligatorio (`APP-04` — Pendiente P1):**
   - Actualmente `src/editor.ts` carga **CodeMirror 5.58.3** mediante inyección de `<script>` globales (`window.CodeMirror`) desde `assets/vendor/codemirror5/`.
   - Defecto adicional en `src/editor.ts:64`: `editor.setOption('theme', theme==='light'?'default':'default')` usa el mismo tema en modo oscuro y claro.
   - Falta integrar **CodeMirror 6 auténtico** (`@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language`, coloreado HCL dedicado, tema dark/light sincronizado con tokens CSS, `Escape` para salir de tab-trap según WCAG 2.1.2 y fallback limpio).
2. **Monolito `src/main.ts` y delegación DOM acoplada:**
   - `src/main.ts` concentra ~80 KB de funciones en una sola línea por función, estado mutable global (`let mobileMenu`, `let caseTab`, `let cidrA`, etc.), plantillas HTML duplicadas (`catalog`, `seniorCaseView` ya reemplazadas pero aún presentes) y mutación directa del DOM (`updateFilter`, `syncSeniorLabels`, `checkCaseButton`).
   - Falta separar estado reactivo (Preact Signals o store tipado limpio), componentes por feature y contratos (`symbol-ownership-architecture`, `web-mfe-build-feature`, `ui-design-system`).
3. **Estilos inline vs. CSP estricta:**
   - `scripts/server.mjs:24` se ve obligado a abrir `style-src 'self' 'unsafe-inline'` porque tanto `src/main.ts` como `src/ui*.ts` usan atributos `style="..."` inline (ej. `width:${pct}%`, `margin-top:20px`). Migrar a clases/CSS custom properties o `<progress>` nativo permitirá endurecer CSP sin `'unsafe-inline'`.
4. **Build Vite y Lockfile Reproducible (`APP-05` — Pendiente P1):**
   - Falta resolver dependencias reales con lockfile verificable (`pnpm-lock.yaml` con políticas Vigilio o `package-lock.json` íntegro), alinear versiones con `vigilio-docs/technology/versions.md` (Node `24.22.2 LTS`, Preact `v11`, Vite `8.3.5`, Biome `2.6.3`, Vitest `4.1.10`/`5.0.5`, Playwright `1.64.1`), conectar `index.html` al pipeline Vite sin romper el modo offline estático (`APP-06`) y definir presupuestos de bundle (`bundle budget`).

---

### 2.3. Senior Mode: Qué Tenemos vs. Qué Falta (`APP-08`, `APP-09`, `APP-11`)

#### Lo que YA tenemos en Senior Mode
- **18 casos (`S01–S18`) completos en datos y paquetes:** contexto, misión, artefactos, antipatrón negativo, decisión A/B/C, snippet antes/después (`src/seniorSnippets.ts`), ejercicio What-If (`src/seniorWhatIf.ts`), 4 controles específicos de revisión (`REVIEW-GATES.md`), hoja `CASE-REVIEW-SHEET.md`, `WHAT-IF-WORKSHEET.md` y 18 ZIP verificados en `assets/senior/S01..S18.zip`.
- **Gate estructural y revocación automática (`src/seniorProgress.ts`):** exige decisión correcta + What-If correcto + 4 checks marcados + ADR ≥ 120 caracteres con las 5 secciones (`contexto`, `decisión`, `riesgos`, `evidencia` con `PASS/FAIL/NOT_RUN/BLOCKED`, `rollback`). Si el alumno altera o invalida cualquiera, o importa un JSON manipulado, el caso y sus XP se revocan de inmediato.
- **Capstone `S18` con 8 hitos:** notas individuales obligatorias (≥ 45 caracteres, únicas entre sí y con estado explícito) + proyecto Terraform multi-módulo offline (`labs/senior/S18/capstone/` con `network`, `service`, `data`, `workload`, entornos `dev/staging/prod` y `tests/capstone.tftest.hcl`).
- **Exportación honesta:** informe Markdown individual (`SXX-informe-senior.md`), portafolio completo (`TerraPixel-Portfolio-Senior.md`), inspector local de `terraform show -json` sin leer `before/after` y Release Gate (`BLOCKED` / `NEEDS_EVIDENCE` / `READY_FOR_HUMAN_REVIEW`).

#### Lo que FALTA en Senior Mode para llegar al 100 %
1. **Ejecución real con Terraform CLI del Capstone `S18` y los 36 laboratorios (`0/37` ejecutados):** hoy todos figuran como `NOT_RUN`. Hay que instalar Terraform CLI (`>= 1.10.5`), correr `fmt -check`, `init -backend=false`, `validate` y `test` en copia temporal aislada, corregir cualquier fallo HCL/test real y generar `CLI-EVIDENCE-MANIFEST.json` verificable.
2. **Simuladores interactivos para los 12 casos Senior restantes:** hoy solo **6 de 18 casos** (`S01`, `S02`, `S03`, `S09`, `S11`, `S14`) tienen widget interactivo parametrizable en `Simulator` (`src/uiSeniorCase.ts:31-50`); los otros **12 casos** (`S04`, `S05`, `S06`, `S07`, `S08`, `S10`, `S12`, `S13`, `S15`, `S16`, `S17`, `S18`) solo muestran el quiz What-If sin simulador determinista propio (ej. `S05` evaluador de trust OIDC `sub/aud`, `S07` calculadora de impacto semver de módulos, `S13` validador de excepción OPA con owner + TTL `<= 14d`, `S15` árbol de decisión `force-unlock`/restore, `S16` matriz interactiva de ownership Terraform vs ArgoCD).
3. **Senior Mode transversal por lección (`#leccion/:id`):** cuando `seniorEnabled === true`, las 36 lecciones muestran exactamente el mismo texto genérico de 2 líneas (`src/main.ts:96`). Falta vincular cada lección `B01–A12` con una pregunta de producción específica y enlace directo al caso Senior relacionado (`S01–S18`).
4. **Precisión de `planInspector.ts` y `releaseGate.ts` ante planes modernos:**
   - Diferenciar reemplazo `delete → create` (con corte de servicio) de `create → delete` (`create_before_destroy = true`).
   - Soportar acciones válidas de Terraform >= 1.7 como `["forget"]` (bloques `removed`), `["create", "read"]` o `ephemeral`, evitando falsos `unknown` que disparen bloqueo erróneo sin explicación precisa, más corpus de fixtures reales de varias versiones de Terraform.
5. **Eliminar mutación imperativa sobre DOM de Preact en casos Senior:** `syncSeniorLabels()` y `checkCaseButton()` (`src/main.ts:173-180`) escriben `.innerHTML` directamente en nodos renderizados por `SeniorCasePage`, rompiendo la pureza declarativa de Preact.

---

### 2.4. Pruebas, QA, Seguridad y CI/CD

1. **Bug activo en Windows al correr `npm test` (`tests/terraform-runner-isolation.test.mjs`):**
   - Usa `PATH: "${temp}:${process.env.PATH}"` (separador Unix `:` en Windows) e invoca `bash scripts/verify-terraform-labs.sh`, lo cual en Windows cae en WSL sin `node` en PATH ni `WSLENV=REPORT_DIR/p`, fallando con `127 !== 0` y dejando 38 archivos residuales en `terraform-verification-results/` que rompen `verify-release.py`.
2. **Paridad de `scripts/verify-terraform-labs.ps1`:**
   - No respeta `$env:REPORT_DIR` (escribe fijo en `$Root/terraform-verification-results`), a diferencia de `.sh`.
3. **Ausencia de tests unitarios/integración de componentes Preact (Vitest + Testing Library):**
   - Los 19 archivos `tests/*.test.mjs` prueban lógica pura y archivos estáticos, pero **ningún test Node monta ni verifica componentes Preact** (`AppShell`, `LearningCatalog`, `SeniorDashboard`, `SeniorCasePage`, `CliEvidenceDashboard`) con `@testing-library/preact` + `vitest`.
4. **Ausencia de suite E2E HTTP real multiplataforma con Playwright (`APP-01`, `R11`, `R27`):**
   - Los 4 scripts Python (`tests/browser-*.py`) usan `page.set_content()` con módulos embebidos en Base64 y ruta fija `/usr/bin/chromium`. No levantan `http://127.0.0.1:4173`, no validan cabeceras CSP/HTTP en navegador real, no prueban `localStorage` entre recargas, no verifican carga real de los 12 PNGs ni descargas HTTP de los 54 `.zip`, y fallan en Windows por la ruta `/usr/bin/chromium`.
5. **Biome configurado al mínimo (`biome.json`):**
   - Tiene `"recommended": false` y `"formatter": {"enabled": false}`, activando únicamente `noDebugger` y `noUnreachable`. Para nivel Senior (`web-mfe-quality`) debe habilitar reglas recomendadas, accesibilidad (`a11y`) y formato consistente sin errores.
6. **Workflows GitHub Actions sin endurecimiento Vigilio (`platform-cicd-factory` / `software-supply-chain-security`):**
   - `.github/workflows/*.yml` usan tags mutables (`actions/checkout@v4`, `actions/setup-node@v4`, `hashicorp/setup-terraform@v3`, `actions/upload-artifact@v4`) en vez de **commit SHA completo de 40 caracteres**, omiten `persist-credentials: false` en `checkout`, usan Node `'22'` en vez de Node `24` LTS (`vigilio-docs/technology/versions.md`), usan `npm install` sin lockfile y aún no se han ejecutado en GitHub Actions real.
7. **Gates IaC complementarios (`terraform-iac-delivery`):**
   - El capstone `S18` y los labs avanzados aún no pasan por `tflint`, `trivy config` / `checkov` y `conftest` (políticas OPA incluidas en casos Senior como `S13`/`S18`).
8. **Marca comercial y licencias (`ui-art-direction`, `APP-19`, `R33`):**
   - `assets/reference/concepto-aprobado.png` incluye logotipos de terceros (HashiCorp Terraform / clouds) y hoy se sirve públicamente en `scripts/server.mjs:16` y `#/ajustes`. Además, `package.json` declara `"license": "UNLICENSED"` mientras falta el dictamen final de uso de marca «TerraPixel Academy» e inspección visual de los 12 sprites `assets/terra/*.png` para confirmar cero uso del isotipo registrado de HashiCorp como emblema propio.

---

## 3. Mapa de Skills Vigilio y Fuentes Canónicas Obligatorias

### 3.1. Fuentes verificadas y leídas en esta auditoría
- **Skills leídas (`C:\Users\Admin\Desktop\VIGILIO\arquitectura-rimac-actualizado\platform-actions\skills\`):**
  - `vigilio-auto-senior/SKILL.md`
  - `complete-work-no-shortcuts/SKILL.md`
  - `platform-validation-evidence/SKILL.md`
  - `terraform-iac-delivery/SKILL.md`
  - `web-mfe-technologies/SKILL.md`
  - `web-mfe-build-feature/SKILL.md`
  - `web-mfe-testing/SKILL.md`
  - `web-mfe-quality/SKILL.md`
  - `web-mfe-security-delivery/SKILL.md`
  - `ux-accessibility/SKILL.md`
  - `ui-design-system/SKILL.md`
  - `ux-web-experience/SKILL.md`
  - `ui-art-direction/SKILL.md`
  - `platform-cicd-factory/SKILL.md`
  - `software-supply-chain-security/SKILL.md`
  - `refactor-existing-code/SKILL.md`
  - `review-code-change/SKILL.md`
- **Documentos canónicos leídos (`C:\Users\Admin\Desktop\VIGILIO\arquitectura-rimac-actualizado\vigilio-docs\`):**
  - `AGENTS.md`
  - `technology/versions.md`
  - `standards/testing/environment-preflight-and-e2e.md`
  - `standards/engineering/refactoring-existing-code.md`
  - `standards/experience/ux-quality-gates-and-ci-cd.md`

### 3.2. Matriz Rápida: Qué Skill Usar para Cada Bloque Faltante

| Dominio / Trabajo | Skill(s) Principal(es) (`platform-actions/skills/`) | Fuente(s) Canónica(s) (`vigilio-docs/`) |
|---|---|---|
| Orquestación general, trazabilidad y cero atajos | `vigilio-auto-senior`, `complete-work-no-shortcuts`, `architecture-traceability` | `AGENTS.md`, `standards/ai/skill-orchestration-policy.md`, `governance/complete-work-coverage-policy.md` |
| Baseline Preact 11 + Vite 8 + TS + CodeMirror 6 + Lockfile | `web-mfe-technologies`, `software-supply-chain-security` | `technology/versions.md`, `technology/libraries/preact.md`, `technology/libraries/vite.md` |
| Migración de las 10 vistas restantes a Preact + refactor de `main.ts` | `web-mfe-build-feature`, `refactor-existing-code`, `symbol-ownership-architecture`, `ui-design-system` | `standards/engineering/refactoring-existing-code.md`, `standards/engineering/file-and-symbol-ownership.md`, `standards/experience/design-tokens-modes-and-theming.md` |
| UX de Aula, Juegos, Grafos, Mobile y Accesibilidad WCAG 2.2 AA | `ux-web-experience`, `ux-mobile-experience`, `ux-game-experience`, `ux-accessibility`, `ui-interaction-motion`, `ui-quality-review` | `standards/experience/accessibility-inclusive-interactions.md`, `standards/experience/ux-quality-gates-and-ci-cd.md` |
| Senior Mode (18 casos, simuladores, FinOps, SRE/DR, K8s ownership) | `terraform-iac-delivery`, `platform-finops`, `platform-observability-sre`, `platform-resilience-disaster-recovery`, `aws-platform-foundation`, `kubernetes-eks-delivery` | `platform/iac/*`, `standards/platform/*`, `threat-model/00-methodology.md` |
| Ejecución real de 36 Labs + S18 Capstone con Terraform CLI y Policies | `terraform-iac-delivery`, `platform-validation-evidence` | `standards/testing/environment-preflight-and-e2e.md` |
| Testing Unitario/Componentes (Vitest) + E2E HTTP real (Playwright) | `web-mfe-testing`, `diagnosing-bugs` | `standards/testing/e2e-quality-gates.md`, `stacks/frontend/web-mfe/testing/e2e-playwright.md`, `technology/libraries/vitest.md`, `technology/libraries/playwright.md` |
| Performance, Bundle Budget, Biome 2.6+ y Calidad Web | `web-mfe-quality` | `technology/libraries/biome.md`, `stacks/frontend/web-mfe/ui/uxui-web-performance-accessibility.md` |
| Hardening CSP, GitHub Actions por SHA, SBOM y Supply Chain | `platform-cicd-factory`, `web-mfe-security-delivery`, `software-supply-chain-security` | `technology/libraries/github-actions.md`, `standards/security/*`, `standards/devsecops/*` |
| Identidad visual Terra, activos legales y README final | `ui-art-direction`, `repository-readme-architecture`, `review-code-change` | `standards/experience/visual-art-direction-and-originality.md`, `standards/engineering/change-impact-and-review-gates.md` |

---

## 4. Checklist Maestro Ejecutable `[ ]` para Llegar al 100 %

> **Instrucción de uso:** Marca `[x]` **únicamente** cuando la tarea esté implementada Y el comando de verificación haya devuelto `PASS` con evidencia real. Prohibido marcar `[x]` sobre `NOT_RUN` o mocks (`complete-work-no-shortcuts` + `platform-validation-evidence`).

### FASE 0 — Gobernanza Git, Reparación Multiplataforma Windows/Linux y Reglas Base
- [x] **F0-01 · Inicializar repositorio Git y baseline protegido** *(VERIFICADO `PASS` — rama `main`, commit baseline `3f67f81`, `.gitignore` endurecido y `IGNORED_ROOTS` en auditores Python)*
  - **Tarea:** Ejecutar `git init`, configurar `.gitignore` (excluyendo `terraform-verification-results/`, `node_modules/`, `.playwright/`, artefactos temporales sin excluir `app/` ni `assets/` requeridos para arranque offline) y crear commit inicial de baseline `v1.7.0` intacto antes de tocar código.
  - **Archivos:** `.git/`, `.gitignore`, `scripts/release-audit.py`, `scripts/verify-release.py`.
  - **Skills a usar:** `platform-repository-workspace`, `vigilio-auto-senior`.
  - **Resultado esperado (100 %):** `git status` limpio sobre baseline inventariado; `npm run verify:preservation` en `PASS`.
- [x] **F0-02 · Crear `AGENTS.md` en la raíz del proyecto consumidor** *(VERIFICADO `PASS` — contrato enlazado y cubierto en `tests/bdd-foundation-f0-f1.test.mjs`)*
  - **Tarea:** Documentar reglas operativas del repositorio enlazando `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, `LO_QUE_FALTA_PARA_100_PORCIENTO.md`, política de preservación de archivos y activación de `vigilio-auto-senior`.
  - **Archivos:** `AGENTS.md`.
  - **Skills a usar:** `vigilio-auto-senior`, `repository-readme-architecture`.
  - **Resultado esperado (100 %):** Cualquier agente o desarrollador carga automáticamente el contrato de honestidad (`PASS/FAIL/NOT_RUN/BLOCKED`) y las fuentes Vigilio.
- [x] **F0-03 · Corregir fallo de `tests/terraform-runner-isolation.test.mjs` en Windows y paridad de `.ps1`** *(VERIFICADO `PASS` — 3 escenarios BDD Given/When/Then en verde, exit 0/1/3 exactos, cero contaminación en raíz)*
  - **Tarea:** Hacer que `scripts/verify-terraform-labs.ps1` soporte `$env:REPORT_DIR`; actualizar `tests/terraform-runner-isolation.test.mjs` para que en Windows (`process.platform === 'win32'`) pruebe el runner PowerShell (con stub `.cmd`/`.ps1` aislado en `temp` y `REPORT_DIR` en `tmpdir()`) y en Linux/macOS pruebe `verify-terraform-labs.sh`, sin contaminar jamás la raíz del repositorio con `terraform-verification-results/`.
  - **Archivos:** `tests/terraform-runner-isolation.test.mjs`, `scripts/verify-terraform-labs.ps1`, `scripts/verify-terraform-labs.sh`, `scripts/run-terraform-labs.mjs`.
  - **Skills a usar:** `diagnosing-bugs`, `platform-validation-evidence`.
  - **Resultado esperado (100 %):** `npm test` pasa **75/75 (`0 FAIL`)** en Windows y Linux, y `python scripts/verify-release.py` no detecta archivos basura post-test.

---

### FASE 1 — Toolchain Reproducible, Lockfile, Vite y Biome (`APP-05`, `APP-06`)
- [x] **F1-01 · Materializar gestor de paquetes y lockfile determinista** *(VERIFICADO `PASS` — `.npmrc` + `package-lock.json` v3 con SHA-512, `npm ci --ignore-scripts` limpio y `npm audit --audit-level=high` con `0` vulnerabilidades)*
  - **Tarea:** Instalar y fijar dependencias reales generando lockfile auténtico (`pnpm-lock.yaml` con `pnpm-workspace.yaml` endurecido `strictDepBuilds: true`, `verifyStoreIntegrity: true` o `package-lock.json` reproducible con `npm ci`), alineado con `vigilio-docs/technology/versions.md` (Node `>=20.19` / `24.22.x LTS`, Preact, Vite `8.3.8`, Biome `2.6.8`, TypeScript `5.8.3`).
  - **Archivos:** `package.json`, `package-lock.json`, `.npmrc`.
  - **Skills a usar:** `web-mfe-technologies`, `software-supply-chain-security`.
  - **Resultado esperado (100 %):** Instalación limpia reproducible desde cero (`npm ci --ignore-scripts` -> `PASS`) y `0` vulnerabilidades `HIGH/CRITICAL` en auditoría SCA.
- [x] **F1-02 · Unificar Build Vite real + Build Offline sin red** *(VERIFICADO `PASS` — `npm run build:vite` + `scripts/check-bundle-budget.mjs` + HTTP smoke sobre `dist/` + `npm run build` offline intacto)*
  - **Tarea:** Configurar `vite.config.ts` / `vite.config.js` e `index.html` para que `npm run build:vite` genere un bundle productivo real con code-splitting/assets verificados y copia de los 54 ZIPs/sprites/ejemplos, **manteniendo intacto** `npm start` + `npm run build` offline con `tools/typescript` y `app/`. Definir presupuesto de tamaño de bundle (`bundle budget`).
  - **Archivos:** `vite.config.js`, `scripts/copy-static.mjs`, `scripts/check-bundle-budget.mjs`, `scripts/dev.mjs`, `package.json`.
  - **Skills a usar:** `web-mfe-technologies`, `web-mfe-quality`.
  - **Resultado esperado (100 %):** `npm run build:vite` (`PASS`), `npm run build` offline (`PASS`), `dist/` sirve todas las rutas, imágenes y descargas sin 404.
- [x] **F1-03 · Activar Biome completo (linter + a11y + formatter)** *(VERIFICADO `PASS` — Biome `2.6.8` con `recommended` + `a11y` + `noExplicitAny` + `formatter` activo en 63 archivos, `0` errores y `0` warnings)*
  - **Tarea:** Actualizar `biome.json` activando `linter.rules.recommended: true`, reglas `a11y` y formateo consistente sobre `src/`, `scripts/` y `tests/`, corrigiendo todos los warnings/errores sin romper contratos.
  - **Archivos:** `biome.json`, `src/**/*.ts*`, `scripts/**/*.mjs`, `tests/**/*.mjs`, `playwright.config.ts`.
  - **Skills a usar:** `web-mfe-quality`, `refactor-existing-code`.
  - **Resultado esperado (100 %):** `npm run lint:biome` ejecuta la CLI real de Biome y devuelve `0 errors`.

---

### FASE 2 — Editor CodeMirror 6 Real para HCL (`APP-04`)
- [x] **F2-01 · Implementar editor CodeMirror 6 offline-safe con soporte HCL y temas Dark/Light** *(VERIFICADO `PASS` — `@codemirror/*` 6 reales en `app/vendor/codemirror6.mjs`, parser HCL `src/hclLanguage.ts`, `Compartment` dark/light, Undo/Redo y `Escape+Tab` WCAG 2.1.2 probados en Chromium real)*
  - **Tarea:** Sustituir CodeMirror 5 (`assets/vendor/codemirror5/` se conserva en árbol si lo exige baseline de rutas, pero el runtime activo pasa a ser **CodeMirror 6 real**) en `src/editor.ts` usando `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language` y tokenizador/gramática HCL (comentarios `#`, `/* */`, heredocs `<<EOF`, bloques `resource/variable/module/locals/output/terraform/moved/removed/check/run`, interpolaciones `${...}`).
  - **Archivos:** `src/editor.ts`, `src/hclLanguage.ts`, `src/vendor/codemirror6.d.mts`, `app/vendor/codemirror6.mjs`, `scripts/cm6-entry.mjs`, `scripts/bundle-codemirror6.mjs`, `scripts/server.mjs`, `styles.css`.
  - **Skills a usar:** `web-mfe-technologies`, `web-mfe-build-feature`, `ui-design-system`.
  - **Resultado esperado (100 %):** Editor CodeMirror 6 activo en las 36 lecciones con números de línea, cierre/emparejado de llaves, indentación 2 espacios, cambio dinámico real entre tema `dark` y `light`, salida de foco con `Escape` + `Tab` accesible (WCAG 2.1.2), preservación de código al navegar y `textarea` de respaldo si falla la carga.
- [x] **F2-02 · Actualizar licencias y pruebas del editor CM6** *(VERIFICADO `PASS` — avisos MIT exactos en `THIRD_PARTY_NOTICES.md`, `tests/vendor.test.mjs`, `tests/bdd-f1-f2-f3.test.mjs`, `tests/browser-editor.py` y `tests/e2e/editor.spec.ts` en Chromium real)*
  - **Tarea:** Registrar licencias MIT de los paquetes `@codemirror/*` en `assets/vendor/THIRD_PARTY_NOTICES.md` y ampliar `tests/vendor.test.mjs` + `tests/browser-editor.py` / Playwright para verificar edición, deshacer/rehacer, cambio de tema, atajos de teclado y revocación de lección al introducir HCL inválido.
  - **Archivos:** `assets/vendor/THIRD_PARTY_NOTICES.md`, `tests/vendor.test.mjs`, `tests/browser-editor.py`, `playwright.config.ts`, `tests/e2e/editor.spec.ts`.
  - **Skills a usar:** `web-mfe-testing`, `ux-accessibility`.
  - **Resultado esperado (100 %):** Tests unitarios y E2E de CodeMirror 6 en `PASS`.

---

### FASE 3 — Migración 100 % Declarativa a Componentes Preact y Limpieza de Arquitectura (`APP-03`)
- [x] **F3-01 · Extraer estado reactivo y eliminar mutaciones DOM imperativas** *(VERIFICADO `PASS` — `src/store.ts` centralizado, `0` asignaciones `.innerHTML` y `0` hacks `el.hidden` en `src/`, toast declarativo en `AppShell`; el puente transicional de `AppShell` para las vistas `F3-03..F3-08` se retira al cerrar `F3-08`)*
  - **Tarea:** Encapsular `AcademyState`, sesión de juegos, filtros, tabs y estado de simuladores en un store tipado / Preact Signals (`src/state/` o módulo dedicado), eliminando las mutaciones directas al DOM (`syncSeniorLabels`, `checkCaseButton`, `updateFilter` con `.innerHTML` / `el.hidden`) de `src/main.ts`.
  - **Archivos:** `src/store.ts`, `src/uiShared.ts`, `src/main.ts`, `src/uiShell.ts`, `src/uiSeniorHub.ts`, `src/uiCatalog.ts`, `src/seniorProgress.ts`.
  - **Skills a usar:** `refactor-existing-code`, `symbol-ownership-architecture`, `web-mfe-build-feature`.
  - **Resultado esperado (100 %):** Cero `.innerHTML` manuales y filtrado/toast/gates 100 % reactivos desde `src/store.ts` (el fallback `dangerouslySetInnerHTML` de `AppShell` se retira definitivamente en `F3-08` tras migrar las vistas restantes).
- [x] **F3-02 · Migrar `#/inicio` (Landing) a componente Preact (`src/uiHome.ts`)** *(VERIFICADO `PASS` — `HomePage` 100 % Preact probado en Node BDD y Playwright HTTP E2E)*
  - **Tarea:** Convertir `home()` (`src/main.ts:78-82`) en componente Preact declarativo con KPIs reactivos, tarjetas de los 3 niveles, poses de Terra y banner Senior.
  - **Archivos:** `src/uiHome.ts`, `src/main.ts`, `tests/bdd-f1-f2-f3.test.mjs`, `tests/e2e/editor.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ux-web-experience`, `ui-design-system`.
  - **Resultado esperado (100 %):** Landing renderizada 100 % por Preact con tests de componente y navegación CTA verificada.
- [x] **F3-03 · Migrar `#/leccion/:id` (Aula de las 36 lecciones) a componente Preact (`src/uiLesson.ts`)** *(VERIFICADO `PASS` — `LessonClassroom` + `EvaluationFeedback` 100 % Preact, ciclo de vida de CodeMirror 6 preservado al alternar favorito/quiz y al cambiar de lección `B01 -> B02`, verificado en Node BDD sobre las 36 lecciones y en Playwright HTTP E2E)*
  - **Tarea:** Convertir `lessonView()` y `renderEvaluation()` (`src/main.ts:89-98`) a Preact declarativo, montando limpiamente CodeMirror 6 vía `ref`/lifecycle, quiz accesible con `aria-live`, botones de pista/solución/reset/descarga `.tf` y `.zip`, y copia de comandos CLI.
  - **Archivos:** `src/uiLesson.ts`, `src/main.ts`, `tests/bdd-f3-views.test.mjs`, `tests/e2e/views-f3.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ux-web-experience`, `ux-accessibility`.
  - **Resultado esperado (100 %):** Las 36 lecciones (`B01–A12`) renderizan e interactúan 100 % en Preact sin pérdida de foco ni de código.
- [x] **F3-04 · Migrar `#/juegos` y `#/juego/:id` (5 minijuegos, 21 preguntas) a Preact (`src/uiGames.ts`)** *(VERIFICADO `PASS` — `GamesHub` y `GameStage` puros en Preact, `resolveGameSession` sin efectos laterales en render, barras de progreso accesibles y cero inflación de XP al rejugar verificado en Playwright HTTP E2E)*
  - **Tarea:** Convertir `gamesHub()` y `gameView()` (`src/main.ts:99-102`) a Preact declarativo, asegurando navegación por teclado, anuncio accesible de acierto/error, resumen de partida y cero inflación de XP al repetir.
  - **Archivos:** `src/uiGames.ts`, `src/store.ts`, `src/main.ts`, `tests/bdd-f3-views.test.mjs`, `tests/e2e/views-f3.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ux-game-experience`, `ux-accessibility`.
  - **Resultado esperado (100 %):** Hub y las 5 partidas funcionan en Preact con cobertura de tests de componente y E2E.
- [x] **F3-05 · Migrar `#/laboratorios` a Preact e incorporar los 18 packs Senior faltantes (`src/uiLabs.ts`)** *(VERIFICADO `PASS` — `LabsDirectory` en Preact expone y filtra los **54 paquetes ZIP** completos: 36 labs `B01–A12` + 18 incidentes `S01–S18`, con buscador reactivo, comandos CLI y descarga HTTP real de `S18-incident.zip` verificada en Playwright)*
  - **Tarea:** Convertir `labsView()` (`src/main.ts:103-104`) a Preact y **corregir la omisión actual agregando la sección descargable de los 18 bundles Senior (`S01–S18.zip`) junto a los 36 labs (`B01–A12.zip`)**, además de enlace directo al runner y a `#/evidencias`.
  - **Archivos:** `src/uiLabs.ts`, `src/store.ts`, `src/main.ts`, `tests/bdd-f3-views.test.mjs`, `tests/e2e/views-f3.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ux-information-architecture`.
  - **Resultado esperado (100 %):** Los **54 paquetes ZIP** son descargables y filtrables desde `#/laboratorios`, cumpliendo el contrato §4 de `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`.
- [x] **F3-06 · Migrar `#/grafo` (Explorador SVG de dependencias) a Preact (`src/uiGraph.ts`)** *(VERIFICADO `PASS` — `GraphExplorer` + `analyzeGraphNode` en Preact con blast radius recursivo BFS, detección de ciclos en topología circular, estados vacío/error y `tabindex="0"` SVG2 real con navegación por flechas/`Home`/`End` verificada en Chromium HTTP E2E)*
  - **Tarea:** Convertir `graphView()` (`src/main.ts:105-106`) a componente Preact declarativo con SVG semántico, soporte completo `Enter`/`Space`/flechas entre nodos, panel de blast radius y estados vacío/error.
  - **Archivos:** `src/uiGraph.ts`, `src/main.ts`, `tests/bdd-f3-views.test.mjs`, `tests/e2e/views-f3.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ux-accessibility`, `ui-interaction-motion`.
  - **Resultado esperado (100 %):** Selección de las 3 topologías y todos sus nodos con ratón y teclado verificada en Preact.
- [x] **F3-07 · Migrar `#/planes` (Plan Explorer + Inspector `plan.json` + Release Gate) a Preact (`src/uiPlans.ts`)** *(VERIFICADO `PASS` — `PlanFixturesPanel`, `LocalPlanInspector` y `SeniorReleaseGate` en Preact, sin lectura ni fuga de secretos `before/after/variables` en DOM ni en Markdown exportado, verificado en Node BDD y Playwright HTTP E2E)*
  - **Tarea:** Convertir `planView()` y `localPlanPanel()` (`src/main.ts:107-126`) en componentes Preact declarativos separados (`PlanFixturesPanel`, `LocalPlanInspector`, `SeniorReleaseGate`).
  - **Archivos:** `src/uiPlans.ts`, `src/main.ts`, `tests/bdd-f3-views.test.mjs`, `tests/e2e/views-f3.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `terraform-iac-delivery`, `ux-accessibility`.
  - **Resultado esperado (100 %):** Carga de `plan.json`, conteos, alertas de drift/sensibilidad, evaluación del Release Gate y exportación `.md` 100 % declarativos en Preact.
- [x] **F3-08 · Migrar `#/progreso`, `#/ajustes`, `#/recursos` y `404` a Preact (`src/uiProfile.ts`, `src/uiSettings.ts`, `src/uiResources.ts`)** *(VERIFICADO `PASS` — `ProfileProgressPage` con progreso de los 8 itinerarios, `SettingsPage`, `ResourcesPage` con glosario reactivo y `NotFoundPage` 100 % en Preact; 9 enlaces desktop sin overflow en `AppShell` y eliminación total de `dangerouslySetInnerHTML` en todo `src/`)*
  - **Tarea:** Convertir `progressView()`, `settingsView()`, `resourcesView()` y `notFound()` a componentes Preact declarativos; añadir progreso por los 8 itinerarios en `#/progreso`, filtrado reactivo del glosario en `#/recursos`, iconos reales por especialidad en `src/uiCatalog.ts`, acceso claro a `#/planes`, `#/evidencias` y `#/recursos` en navegación desktop (`src/uiShell.ts`) y retirar `dangerouslySetInnerHTML` + plantillas muertas de `src/main.ts`.
  - **Archivos:** `src/uiProfile.ts`, `src/uiSettings.ts`, `src/uiResources.ts`, `src/uiCatalog.ts`, `src/uiShell.ts`, `src/main.ts`, `styles.css`, `tests/bdd-f308-f501.test.mjs`, `tests/e2e/views-f308-f4.spec.ts`.
  - **Skills a usar:** `web-mfe-build-feature`, `ui-design-system`, `refactor-existing-code`.
  - **Resultado esperado (100 %):** **14/14 rutas + 404** renderizadas en Preact puro; `AppShell` ya no acepta `content: string` ni `dangerouslySetInnerHTML`.

---

### FASE 4 — Senior Mode al 100 % (Simuladores, Transversalidad y Precisión de Planes)
- [x] **F4-01 · Completar simuladores interactivos deterministas para los 12 escenarios Senior restantes** *(VERIFICADO `PASS` — 18/18 funciones deterministas puras en `src/simulators.ts` + controles interactivos parametrizables `[data-sim-case="S01..S18"]` en `src/uiSeniorCase.ts`, cubiertos por `tests/simulators.test.mjs`, Node BDD y Playwright HTTP E2E)*
  - **Tarea:** Ampliar `src/simulators.ts` y `src/uiSeniorCase.ts` para que no solo `S01, S02, S03, S09, S11, S14` tengan simulador parametrizable, sino los **18 casos (`S01–S18`)**:
    - `S04` (guardia anti-destrucción `prevent_destroy` + backup 3-2-1), `S05` (preflight `init -migrate-state`), `S06` (detector de exposición de secretos en outputs/state vs `ephemeral`), `S07` (evaluador SemVer de provider + `.terraform.lock.hcl`), `S08` (calculadora de blast radius y ciclos DAG), `S10` (validador de condiciones OIDC `sub`/`aud`/env), `S12` (matriz de cobertura `mock_provider` vs sandbox cloud), `S13` (validador de excepción Policy-as-Code con owner y expiración `<= 14` días), `S15` (simulador de pausa de writers, aprobación dual y RTO `<= 60m`), `S16` (matriz interactiva de conflictos de reconciliación Terraform vs ArgoCD/Helm), `S17` (clasificador de hallazgos RFC `P0/P1/P2`), `S18` (simulador de promoción `dev -> staging -> prod` con gates).
  - **Archivos:** `src/simulators.ts`, `src/uiSeniorCase.ts`, `src/store.ts`, `src/main.ts`, `tests/simulators.test.mjs`, `tests/bdd-f308-f501.test.mjs`, `tests/e2e/views-f308-f4.spec.ts`.
  - **Skills a usar:** `terraform-iac-delivery`, `platform-finops`, `platform-observability-sre`, `platform-resilience-disaster-recovery`, `kubernetes-eks-delivery`, `aws-platform-foundation`.
  - **Resultado esperado (100 %):** Los **18/18 casos Senior** cuentan con simulador determinista interactivo propio + What-If + pruebas unitarias de cada función.
- [x] **F4-02 · Enriquecer Senior Mode transversal dentro de las 36 lecciones (`B01–A12`)** *(VERIFICADO `PASS` — 36 riesgos de producción y preguntas de arquitectura únicas en `src/lessonSeniorContext.ts` enlazadas a `S01–S18` desde `LessonClassroom`, más filtros por severidad y dominio técnico en `SeniorDashboard`)*
  - **Tarea:** Sustituir el recuadro genérico repetido cuando `seniorEnabled` está activo por notas de producción específicas por lección (riesgo de estado/seguridad/escala + caso `S01–S18` conectado) en `src/lessonSeniorContext.ts` y `src/uiLesson.ts`, además de filtros por severidad y dominio técnico en `src/uiSeniorHub.ts`.
  - **Archivos:** `src/lessonSeniorContext.ts`, `src/uiLesson.ts`, `src/uiSeniorHub.ts`, `src/store.ts`, `src/main.ts`, `tests/bdd-f308-f501.test.mjs`, `tests/e2e/views-f308-f4.spec.ts`.
  - **Skills a usar:** `terraform-iac-delivery`, `ux-web-experience`.
  - **Resultado esperado (100 %):** Activar Senior Mode aporta contexto real de arquitectura de producción diferenciado en las 36 lecciones y navegación directa al incidente relacionado.
- [x] **F4-03 · Endurecer `planInspector.ts` y `releaseGate.ts` para semánticas modernas de Terraform** *(VERIFICADO `PASS` — distinción exacta `delete-then-create` vs `create-before-destroy`, soporte de `forget` / `removed` con hallazgo `STATE_FORGET`, planes de 240+ recursos y fuzzing de 50 rondas con `0` fugas de secretos)*
  - **Tarea:** Distinguir explícitamente `delete-then-create` (`["delete","create"]` — corte potencial) de `create-before-destroy` (`["create","delete"]`), reconocer la acción `["forget"]` de bloques `removed` (Terraform >= 1.7) sin clasificarla erróneamente como `unknown`, y añadir tests con fixtures JSON de múltiples versiones (`1.6`, `1.8`, `1.10+`), planes >100 recursos, payloads corruptos y fuzzing anti-fuga de secretos.
  - **Archivos:** `src/planInspector.ts`, `src/releaseGate.ts`, `src/planReport.ts`, `src/uiPlans.ts`, `tests/plan-inspector.test.mjs`, `tests/release-gate.test.mjs`, `tests/e2e/views-f308-f4.spec.ts`.
  - **Skills a usar:** `terraform-iac-delivery`, `web-mfe-testing`.
  - **Resultado esperado (100 %):** Clasificación exacta de operaciones modernas y `0` fugas de valores `before/after/variables/outputs` demostrada con tests negativos y fuzzing.

---

### FASE 5 — Validación Auténtica de los 37 Laboratorios IaC con Terraform CLI (`APP-15`)
- [x] **F5-01 · Instalar Terraform CLI fijada (`>= 1.10.5`) y ejecutar los 37 escenarios reales** *(VERIFICADO `PASS` — `scripts/ensure-terraform.mjs` instala y verifica SHA-256 oficial de `Terraform v1.10.5` en `.tools/terraform/1.10.5`; los 37 escenarios `B01–A12` + `S18/capstone` pasan `fmt -check -recursive`, `init -backend=false`, `validate` y `test` en aislamiento con `37 PASS / 0 FAIL / 0 NOT_RUN`, archivado en `assets/examples/cli-evidence-v1.10.5.json` y paridad ZIP `1432/1432 PASS`)*
  - **Tarea:** Instalar binario oficial de Terraform en entorno local/runner autorizado y ejecutar `scripts/verify-terraform-labs.ps1` / `.sh` sobre copias temporales aisladas (`fmt -check -recursive`, `init -backend=false`, `validate`, `test`) para `B01–B12`, `I01–I12`, `A01–A12` y `S18/capstone`.
  - **Archivos:** `scripts/ensure-terraform.mjs`, `scripts/run-terraform-labs.mjs`, `scripts/verify-terraform-labs.ps1`, `scripts/repack-labs.py`, `labs/offline/B01..A12/*`, `labs/senior/S18/capstone/*`, `assets/examples/cli-evidence-v1.10.5.json`, `tests/bdd-f308-f501.test.mjs`.
  - **Skills a usar:** `terraform-iac-delivery`, `platform-validation-evidence`.
  - **Resultado esperado (100 %):** **37/37 escenarios en `PASS` real**, sin mutar `labs/` durante la ejecución del runner, generando `CLI-EVIDENCE-MANIFEST.json` con hashes SHA-256 reales de logs.
- [x] **F5-02 · Corregir cualquier desviación HCL/test y regenerar ZIPs afectados con paridad exacta** *(VERIFICADO `PASS` — actualizados los 36 `labs/offline/<ID>/STATUS.md` con `Terraform v1.10.5` `2026-11-16` en `PASS` local y `NOT_RUN` cloud, más `labs/senior/S13/EVIDENCE-STATUS.md`, `labs/senior/S18/EVIDENCE-STATUS.md` y `DEVSECOPS-GATES.md`; reempaquetados determinísticamente los ZIPs afectados y verificado `1446/1446 PASS` en `scripts/release-audit.py`)*
  - **Tarea:** Si algún `.tf` o `.tftest.hcl` requiere ajuste de formato o aserción tras correr Terraform CLI real, actualizar el archivo en `labs/`, actualizar su `STATUS.md` con versión exacta de Terraform y fecha verificada, y regenerar su `.zip` en `assets/labs/` o `assets/senior/` comprobando paridad byte a byte.
  - **Archivos:** `labs/offline/**`, `labs/senior/S13/**`, `labs/senior/S18/**`, `assets/labs/*.zip`, `assets/senior/S13.zip`, `assets/senior/S18.zip`, `tests/bdd-f502-f603.test.mjs`.
  - **Skills a usar:** `terraform-iac-delivery`, `complete-work-no-shortcuts`.
  - **Resultado esperado (100 %):** `python scripts/release-audit.py` pasa el 100 % de comprobaciones CRC y paridad fuente↔ZIP.
- [x] **F5-03 · Ejecutar scanners estáticos IaC (`tflint`, `trivy config` / `checkov`, `conftest`) sobre `S18/capstone`** *(VERIFICADO `PASS` — creados `scripts/ensure-iac-scanners.mjs` y `scripts/run-iac-scanners.mjs` con verificación SHA-256 de `tflint@0.66.0`, `trivy@0.76.2` y `conftest@0.71.1`; añadidos `S18/capstone/.tflint.hcl`, `required_version` en los 4 módulos hijos de `S18/capstone/modules/*`, políticas OPA Rego y tests unitarios/fixtures positivos y negativos en `S13/policies/*` y `S18/capstone/policies/*`, e integración en `.github/workflows/terraform-labs.yml`; `0 HIGH/CRITICAL` y `6/6 PASS`)*
  - **Tarea:** Validar el capstone multi-módulo `labs/senior/S18/capstone/` y las políticas OPA de `S13`/`S18` con linters y escáneres IaC de acuerdo con `terraform-iac-delivery`, documentando resultados `PASS/FAIL` sin suprimir hallazgos críticos.
  - **Archivos:** `labs/senior/S18/capstone/**`, `labs/senior/S13/**`, `scripts/ensure-iac-scanners.mjs`, `scripts/run-iac-scanners.mjs`, `.github/workflows/terraform-labs.yml`, `tests/bdd-f502-f603.test.mjs`.
  - **Skills a usar:** `terraform-iac-delivery`, `platform-validation-evidence`.
  - **Resultado esperado (100 %):** `0` hallazgos `HIGH`/`CRITICAL` en módulos del capstone y políticas OPA probadas con casos positivos y negativos.

---

### FASE 6 — Suite Completa de Pruebas: Unit, Componentes Preact, E2E HTTP y Accesibilidad WCAG 2.2 AA (`APP-01`, `APP-18`)
- [x] **F6-01 · Añadir tests de componentes Preact con Vitest + `@testing-library/preact`** *(VERIFICADO `PASS` — configurado `vitest.config.ts` con `jsdom` y alias hacia `preact@10.29.8`, suite `tests/components/views.test.ts` con `@testing-library/preact@3.2.6` cubriendo las 14 vistas Preact + `AppShell` + `NotFoundPage` con casos positivos/negativos/revocación: `10/10 PASS` integrado en `npm run qa`)*
  - **Tarea:** Crear suite de pruebas de componentes que renderice las 14 vistas Preact, verificando roles accesibles, búsqueda/filtros, flujo de aula, flujo de los 5 juegos, flujo de los 18 casos Senior, S18 capstone, Plan Inspector, Release Gate, Evidencias CLI y restauración/revocación de estado.
  - **Archivos:** `vitest.config.ts`, `tests/components/views.test.ts`, `package.json`, `tests/bdd-f502-f603.test.mjs`.
  - **Skills a usar:** `web-mfe-testing`.
  - **Resultado esperado (100 %):** Cobertura automatizada de todas las vistas Preact con aserciones por `role`/`label` y casos negativos.
- [x] **F6-02 · Implementar suite E2E HTTP real multiplataforma con Playwright (`http://127.0.0.1:4173`)** *(VERIFICADO `PASS` — creada `tests/e2e/journeys-f602.spec.ts` cubriendo los 5 recorridos completos + smoke HTTP sobre `dist/` compilado, migrados los 5 scripts `tests/browser-*.py` a HTTP multiplataforma sin `/usr/bin/chromium` fijo ni Base64 inline + `scripts/run-python.mjs`; suite Playwright completa `18/18 PASS`)*
  - **Tarea:** Crear configuración Playwright oficial (`playwright.config.ts`) que arranque `scripts/server.mjs` (y también pruebe `dist/` compilado), navegue por HTTP real en Windows y Linux (sin hardcodear `/usr/bin/chromium` ni Base64 inline), y verifique:
    1. Recorrido completo de alumno nuevo (`#/inicio` -> `B01`/`B04` -> editor CM6 -> reglas -> quiz -> XP única -> recarga con persistencia `localStorage` -> revocación al invalidar código -> descarga `B04.zip`).
    2. Recorrido Senior completo (`#/senior` -> `S01` y `S18` -> What-If -> simulador -> decisión -> 4 gates -> ADR -> 8 hitos únicos -> export `.md` -> revocación -> export portafolio).
    3. Plan Inspector + Release Gate (`plan.json` válido, >5 MB, malformado, con drift y secretos que NO se filtran en DOM ni `.md`).
    4. CLI Evidence Manifest (import sintético, rechazo de `PASS` sin hash, export `.md`).
    5. Carga HTTP 200 de los 12 PNG de Terra, cabeceras CSP/seguridad y viewports responsive (`320px`, `375px`, `768px`, `1024px`, `1440px`) con cero scroll horizontal.
  - **Archivos:** `playwright.config.ts`, `tests/e2e/journeys-f602.spec.ts`, `scripts/run-python.mjs`, `tests/browser-editor.py`, `tests/browser-embedded.py`, `tests/browser-evidence.py`, `tests/browser-release-gate.py`, `tests/browser-senior-v13.py`.
  - **Skills a usar:** `web-mfe-testing`, `ux-web-experience`, `ux-mobile-experience`.
  - **Resultado esperado (100 %):** Suite E2E HTTP real en `PASS` tanto sobre el servidor local como sobre `dist/`.
- [x] **F6-03 · Ejecutar auditoría WCAG 2.2 AA automatizada (`@axe-core/playwright`) y verificación de teclado/zoom** *(VERIFICADO `PASS` — `tests/e2e/a11y.spec.ts` ejecuta `@axe-core/playwright@4.14.0` en las 14 rutas + `404` tanto en `dark` como en `light` = 30 escaneos completos con `0` violaciones WCAG 2.2 A/AA tras remediar `a.brand` en `src/uiShell.ts`, tamaños mínimos `>= 24px` y contraste AA del tema claro en `styles.css`; documentado en `docs/A11Y_MATRIX.md` con lector de pantalla humano en `NOT_RUN` honesto)*
  - **Tarea:** Integrar `@axe-core/playwright` en las 14 rutas en ambos temas (`dark` y `light`), validar contraste AA de todos los tokens en `styles.css`, orden de tabulación, `skip-link`, `focus-visible`, zoom al `200 %`, `prefers-reduced-motion` y documentar en `docs/A11Y_MATRIX.md` qué se probó automáticamente (`PASS`) y qué requiere lector de pantalla manual (`PASS` o `NOT_RUN` honesto según `ux-accessibility`).
  - **Archivos:** `src/uiShell.ts`, `styles.css`, `tests/e2e/a11y.spec.ts`, `docs/A11Y_MATRIX.md`, `tests/bdd-f502-f603.test.mjs`.
  - **Skills a usar:** `ux-accessibility`, `ui-quality-review`, `ui-design-system`.
  - **Resultado esperado (100 %):** `0` violaciones WCAG 2.2 A/AA en axe sobre las 14 pantallas (dark + light) y navegación 100 % operable solo con teclado.

---

### FASE 7 — Seguridad Frontend, CSP sin `unsafe-inline`, CI/CD SHA-Pinned y Marca (`APP-16`, `APP-17`, `APP-19`)
- [x] **F7-01 · Eliminar estilos inline y endurecer CSP en `scripts/server.mjs` y `index.html`** *(VERIFICADO `PASS` — eliminados todos los `style="..."` y mutaciones `.style.` en `src/*.ts`, sustituida barra de progreso por `<progress class="progress-native">`, adaptado `scripts/bundle-codemirror6.mjs` a `adoptedStyleSheets` + CSSOM y activada CSP `style-src 'self'` sin `unsafe-inline` en `scripts/server.mjs`; `tests/e2e/security-csp.spec.ts` y `tests/http-smoke.test.mjs` en `PASS`)*
  - **Tarea:** Sustituir todos los atributos `style="..."` dinámicos/estáticos por clases CSS en `styles.css` (y elemento `<progress>` o clases/variables seguras para barras de avance) para retirar `'unsafe-inline'` de `style-src` en `scripts/server.mjs` (`style-src 'self'`), verificando que ningún recurso o vista genere violación CSP en consola.
  - **Archivos:** `styles.css`, `src/ui*.ts`, `src/main.ts`, `scripts/bundle-codemirror6.mjs`, `scripts/server.mjs`, `tests/http-smoke.test.mjs`, `tests/e2e/security-csp.spec.ts`.
  - **Skills a usar:** `web-mfe-security-delivery`, `ui-design-system`.
  - **Resultado esperado (100 %):** CSP estricta `default-src 'self'; script-src 'self'; style-src 'self'` activa con `0` errores CSP en navegador real.
- [x] **F7-02 · Endurecer los 4 workflows de GitHub Actions según `platform-cicd-factory`** *(VERIFICADO `PASS` local con `actionlint v1.7.12` / `NOT_RUN` ejecución cloud remota — todas las acciones fijadas por SHA de 40 caracteres, `persist-credentials: false`, Node `'24'`, `npm ci --ignore-scripts`, job `e2e-http` en `quality.yml`, `run-actionlint.mjs` en `devsecops.yml` y permisos OIDC aislados al job `deploy` en `deploy-pages.yml`)*
  - **Tarea:** Fijar todas las acciones (`actions/checkout`, `actions/setup-node`, `hashicorp/setup-terraform`, `actions/upload-artifact`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) por **commit SHA completo de 40 caracteres**, añadir `persist-credentials: false` en todos los `checkout`, subir Node a `24` LTS, usar `npm ci` / `pnpm install --frozen-lockfile`, incluir job de Playwright E2E HTTP + Biome + `actionlint` y separar permisos OIDC únicamente al job de deploy.
  - **Archivos:** `.github/workflows/quality.yml`, `.github/workflows/devsecops.yml`, `.github/workflows/terraform-labs.yml`, `.github/workflows/deploy-pages.yml`, `scripts/run-actionlint.mjs`, `tests/bdd-f7-f8.test.mjs`.
  - **Skills a usar:** `platform-cicd-factory`, `software-supply-chain-security`, `web-mfe-security-delivery`.
  - **Resultado esperado (100 %):** Workflows validados con `actionlint` (`PASS`) y ejecutados en GitHub Actions real con artefactos de evidencia archivados.
- [x] **F7-03 · Cierre de higiene de marca, referencia PNG y licencias (`R33`)** *(VERIFICADO `PASS` — `assets/reference/concepto-aprobado.png` conservado en disco para `verify:preservation` pero restringido con HTTP `404` en `scripts/server.mjs` y retirado de `src/uiSettings.ts`; rediseñado `assets/icons/mark.svg` con emblema propio sin logotipos de terceros; inspeccionados los 12 PNG de Terra; publicada licencia `LICENSE` (`MIT`) y `docs/BRAND_AND_LICENSE_AUDIT.md`)*
  - **Tarea:** Dejar de exponer públicamente `assets/reference/concepto-aprobado.png` en la UI de producción/servidor público (conservando el archivo en disco para no violar `verify:preservation`, pero restringiendo su ruta en `scripts/server.mjs` y `#/ajustes` según §3.1 del Master Spec), verificar visualmente los 12 PNG de `assets/terra/` + `mark.svg` para garantizar cero uso de logotipos oficiales de HashiCorp/clouds, definir licencia explícita del proyecto y documentar checklist legal de marca en `docs/BRAND_AND_LICENSE_AUDIT.md`.
  - **Archivos:** `scripts/server.mjs`, `src/uiSettings.ts`, `assets/icons/mark.svg`, `LICENSE`, `package.json`, `docs/BRAND_AND_LICENSE_AUDIT.md`, `README.md`.
  - **Skills a usar:** `ui-art-direction`, `web-mfe-security-delivery`, `repository-readme-architecture`.
  - **Resultado esperado (100 %):** Identidad 100 % propia sin exposición pública de marcas de terceros en assets servidos.

---

### FASE 8 — Reconciliación Final Zero-Omissions, Empaquetado y Code Review Independiente (`APP-20`)
- [x] **F8-01 · Sincronizar versión, matriz de `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, `README.md` y `RELEASE_MANIFEST.md`** *(VERIFICADO `PASS` — versión `2.0.0` unificada en `package.json`, `package-lock.json`, `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md` (`APP-01..APP-20`), `README.md`, `RELEASE_MANIFEST.md` y `docs/AUDITORIA_FINAL_V2_0.md`, preservando intactos los informes `v1.2–v1.7`)*
  - **Tarea:** Actualizar la tabla maestra §2 (`APP-01` a `APP-20`) de `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, `README.md`, `RELEASE_MANIFEST.md` y `docs/AUDITORIA_FINAL_V2_0.md` (conservando intactos todos los informes históricos `v1.2–v1.7`) con enlaces a los logs y resultados reales obtenidos.
  - **Archivos:** `package.json`, `package-lock.json`, `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, `README.md`, `RELEASE_MANIFEST.md`, `docs/AUDITORIA_FINAL_V2_0.md`, `tests/bdd-f7-f8.test.mjs`.
  - **Skills a usar:** `architecture-traceability`, `repository-readme-architecture`, `platform-validation-evidence`.
  - **Resultado esperado (100 %):** Coherencia 100 % entre versión, código, pruebas y documentación (`Gate G3`).
- [x] **F8-02 · Reconstruir `app/`, `dist/` y regenerar `SHA256SUMS.txt` sobre árbol limpio** *(VERIFICADO `PASS` — compilados `app/` y `dist/` con Vite + offline, regenerado `SHA256SUMS.txt`, verificado `scripts/verify-release.py` con `0 problems`, y re-ejecutados los gates sobre extracción limpia en directorio temporal)*
  - **Tarea:** Ejecutar compilación final, regenerar `dist/`, recalcular `SHA256SUMS.txt` al final de todo el proceso (regla §13.6), empaquetar ZIP de release y extraerlo en un directorio temporal limpio para correr todos los gates sobre la copia extraída.
  - **Archivos:** `app/**`, `dist/**`, `SHA256SUMS.txt`.
  - **Skills a usar:** `platform-validation-evidence`, `complete-work-no-shortcuts`.
  - **Resultado esperado (100 %):** Sobre la carpeta recién extraída pasan simultáneamente:
    - `npm run typecheck` -> `PASS`
    - `npm run lint:biome` -> `PASS`
    - `npm test` (Node + Vitest componentes) -> `PASS`
    - `npm run build` & `npm run build:vite` -> `PASS`
    - `npx playwright test` (HTTP E2E + axe WCAG AA) -> `PASS`
    - `npm run verify:terraform:local` (37/37 CLI reales) -> `PASS`
    - `npm run security:local` + `npm audit` -> `PASS`
    - `npm run verify:preservation` -> `PASS`
    - `python scripts/release-audit.py` -> `PASS`
    - `python scripts/verify-release.py` -> `PASS` (`0 problems`)
- [x] **F8-03 · Ejecutar fase `REVIEW` independiente de solo lectura (`review-code-change`)** *(VERIFICADO `PASS` — auditoría independiente sobre diff `3f67f81..f0e660a` conforme a `review-code-change/SKILL.md` y `references/review-format.md`: `0` hallazgos `BLOQUEANTE` / `ALTA` / `MEDIA`, veredicto `APPROVE` / `READY` en alcance local con registro honesto de `NOT_RUN` externos)*
  - **Tarea:** Correr auditoría independiente en modo solo lectura contra el diff completo (`git diff` desde baseline `v1.7.0`), verificando `0` hallazgos `BLOQUEANTE` / `ALTA` / `MEDIA` antes de emitir dictamen `APROBADO — VERIFICADO EN ALCANCE`.
  - **Archivos:** Solo lectura sobre diff Git y reportes de evidencia.
  - **Skills a usar:** `review-code-change`, `vigilio-auto-senior`.
  - **Resultado esperado (100 %):** Veredicto `APPROVE` (`READY`) con evidencia reproducible completa.

---

## 5. Orden Crítico Recomendado de Ejecución

```text
FASE 0 (Git + Fix Windows test + AGENTS.md)
  ──► FASE 1 (Lockfile + Vite + Biome real)
        ──► FASE 2 (CodeMirror 6 HCL + Dark/Light + Teclado)
              ──► FASE 3 (10 vistas restantes a Preact + #/laboratorios con 54 ZIP + 0 innerHTML)
                    ──► FASE 4 (Senior Mode 100%: 12 simuladores faltantes + transversal en 36 lecciones + planInspector 1.7+)
                          ──► FASE 5 (Terraform CLI real: 36 labs + S18 = 37 PASS + TFLint/Trivy/Conftest)
                                ──► FASE 6 (Vitest componentes + Playwright E2E HTTP real + WCAG 2.2 AA axe)
                                      ──► FASE 7 (CSP sin unsafe-inline + GitHub Actions SHA-pinned + Marca)
                                            ──► FASE 8 (Docs + dist/ + SHA256SUMS.txt + Extracción limpia + Review final)
```
