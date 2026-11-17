# TerraPixel Academy (`v2.0.0`) — Plataforma Educativa Offline-First de IaC y Senior Mode

> **Academia web interactiva para aprender HashiCorp Terraform** desde fundamentos de HCL hasta diagnóstico de incidentes, revisión de planes `terraform show -json` y Platform Engineering. Proyecto independiente bajo licencia [`MIT`](./LICENSE), **sin afiliación ni certificación oficial de HashiCorp**.

---

## Tabla de Contenidos

1. [Características Principales](#1-características-principales)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Inicio Rápido (< 10 min)](#3-inicio-rápido--10-min)
4. [Arquitectura y Estructura del Repositorio](#4-arquitectura-y-estructura-del-repositorio)
5. [Límites de Seguridad y Ejecución](#5-límites-de-seguridad-y-ejecución)
6. [Testing y Verificación Local](#6-testing-y-verificación-local)
7. [CI/CD y Supply Chain](#7-cicd-y-supply-chain)
8. [Troubleshooting](#8-troubleshooting)
9. [Documentación Normativa e Histórica](#9-documentación-normativa-e-histórica)
10. [Licencia y Marca](#10-licencia-y-marca)

---

## 1. Características Principales

- **14 rutas + `404` en Preact declarativo puro (`0` `innerHTML` / `0` `dangerouslySetInnerHTML`)** con store reactivo centralizado (`src/store.ts`) y persistencia local en `localStorage` con reconciliación y revocación inmediata ante invalidación de código o evidencias.
- **Editor CodeMirror 6 HCL offline** (`src/editor.ts`, `src/hclLanguage.ts`, `app/vendor/codemirror6.mjs`) con temas oscuro/claro dinámicos vía `Compartment`, historial Undo/Redo, salida de teclado WCAG 2.1.2 (`Escape` + `Tab`) y cero estilos inline bajo CSP `style-src 'self'`.
- **36 lecciones interactivas (`B01–A12`) + 8 rutas de especialización**, cada una con contexto transversal de riesgo en producción vinculado a los escenarios Senior (`src/lessonSeniorContext.ts`).
- **18 escenarios Senior (`S01–S18`) + Capstone `S18` de 8 hitos** con simuladores deterministas parametrizables (`src/simulators.ts`), ejercicios *What-If*, 4 controles por incidente, exportación ADR y portafolio completo.
- **Inspector local de `terraform show -json` + Senior Release Gate** (`src/planInspector.ts`, `src/releaseGate.ts`) con soporte de semánticas Terraform `>= 1.7` (`forget` / `STATE_FORGET`, `delete-then-create` vs `create-before-destroy`), **cero exposición de `before/after`, variables o secretos**, y estados exclusivos `BLOCKED`, `NEEDS_EVIDENCE` y `READY_FOR_HUMAN_REVIEW`.
- **54 paquetes ZIP descargables** (`36` laboratorios `B/I/A` + `18` casos Senior `S01–S18`) verificados contra `Terraform v1.10.5`, `TFLint`, `Trivy Config` y `Conftest` OPA Rego en copias temporales aisladas.
- **Accesibilidad WCAG 2.2 AA automatizada** (`0` violaciones `@axe-core/playwright` en 30 escaneos `dark` + `light`, teclado, zoom `200 %` y `prefers-reduced-motion`).

---

## 2. Stack Tecnológico

- **UI & Estado:** `Preact`, `TypeScript` estricto (`tools/typescript/` offline + `package-lock.json`).
- **Editor HCL:** `CodeMirror 6` (`@codemirror/view`, `@codemirror/state`, `@codemirror/language`, `@codemirror/commands`, `@codemirror/autocomplete`, `@lezer/highlight`).
- **Build & Bundler:** Modo estático offline (`npm run build` -> `app/` + `dist/`) y bundler productivo `Vite` (`npm run build:vite` + control de presupuesto `scripts/check-bundle-budget.mjs`).
- **Calidad & Testing:** `Biome` (`npm run lint:biome`), Node Test Runner (`npm test`), `Vitest` + `@testing-library/preact` (`npm run test:components`), `Playwright` + `@axe-core/playwright` (`npm run test:e2e`).
- **IaC & Supply Chain:** `Terraform CLI`, `TFLint`, `Trivy`, `Conftest` OPA y `actionlint` con verificación SHA-256 en `.tools/`.
- **Versiones de runtime y dependencias:** Consultar `package.json#engines`, `package.json#devDependencies` y `package-lock.json`.

---

## 3. Inicio Rápido (< 10 min)

### Prerrequisitos

- **Node.js:** Versión compatible con `package.json#engines`.
- **Python 3:** Para auditorías estructurales (`scripts/release-audit.py`, `scripts/verify-release.py`).

### Opción A · Arranque Offline Inmediato (sin `npm install`)

```bash
npm start
# Abre http://127.0.0.1:4173 (o usa INICIAR-WINDOWS.cmd / INICIAR-LINUX-MAC.sh)
```

> **Importante:** No abras `index.html` mediante `file://`; la aplicación usa módulos ES y requiere un servidor HTTP local.

### Opción B · Entorno Completo de Desarrollo, Build Vite y Testing

```bash
npm ci --ignore-scripts      # Instala dependencias exactas del lockfile sin lifecycle scripts
npm run build:vite           # Compila TypeScript, genera bundle Vite y valida presupuesto
npm run qa                   # Typecheck + 101 tests Node/BDD + 10 tests Vitest + security:local
npm run test:e2e             # Playwright E2E HTTP + Strict CSP + 30 auditorías WCAG 2.2 AA
```

---

## 4. Arquitectura y Estructura del Repositorio

```text
TerraPixel-Academy/
├── index.html                  # Punto de entrada SPA
├── styles.css                  # Design system tokens (dark/light), WCAG AA, layout responsive
├── src/                        # Fuente TypeScript estricto (Preact, store, CM6, motores IaC)
├── app/                        # Módulos ESM compilados para ejecución offline sin bundler
├── assets/
│   ├── icons/mark.svg          # Emblema original pixel-art de TerraPixel
│   ├── terra/                  # 12 sprites PNG originales + terra-spritesheet.png
│   ├── labs/ & assets/senior/  # 54 paquetes ZIP descargables (B01..A12 + S01..S18)
│   └── examples/               # Manifiestos sintéticos y cli-evidence-v1.10.5.json
├── labs/
│   ├── offline/B01..A12/       # 36 laboratorios Terraform reales + .tftest.hcl + STATUS.md
│   └── senior/S01..S18/        # 18 incidentes, políticas OPA (S13/S18) y capstone multi-módulo
├── scripts/                    # Servidor HTTP CSP estricta, builders, verificadores y runners SHA-256
├── tests/                      # Suites Node/BDD, Vitest Preact (components/) y Playwright E2E (e2e/)
├── docs/                       # Auditorías históricas v1.2–v2.0, A11Y_MATRIX.md, BRAND_AND_LICENSE_AUDIT.md
└── .github/workflows/          # Pipelines SHA-pinned (quality, devsecops, terraform-labs, deploy-pages)
```

---

## 5. Límites de Seguridad y Ejecución

- **Navegador sin Terraform real:** El botón **Evaluar reglas** aplica comprobaciones léxicas didácticas (`src/engine.ts`), **no** ejecuta `terraform plan`/`apply` ni accede a cuentas cloud.
- **Privacidad de `plan.json`:** `src/planInspector.ts` procesa el JSON localmente en memoria y descarta `before`, `after`, `variables` y `outputs`. Nunca sube archivos ni logs a servidores externos.
- **CSP estricta (`scripts/server.mjs`):** `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'`.
- **Variables de entorno locales:** El servidor HTTP admite únicamente `HOST` (default `127.0.0.1`) y `PORT` (default `4173`). No existen secretos ni variables `TF_VAR_*` requeridas.

---

## 6. Testing y Verificación Local

| Comando | Qué verifica |
|---|---|
| `npm run typecheck` | TypeScript estricto (`--noEmit`) con `tools/typescript` |
| `npm run lint:biome` | Reglas Biome (`recommended` + `a11y` + formateo) |
| `npm run qa` | `typecheck` + Node Test Runner (`tests/*.test.mjs`) + `Vitest` (`tests/components/`) + `devsecops-audit.mjs` |
| `npm run test:e2e` | Suite Playwright HTTP real (recorridos alumno/Senior, `dist/`, CSP estricta y 30 auditorías Axe WCAG 2.2 AA) |
| `npm run setup:terraform && npm run verify:terraform:local` | Instala `Terraform v1.10.5` con SHA-256 y ejecuta los 37 escenarios reales en copias temporales aisladas |
| `npm run setup:scanners && npm run verify:iac:scanners` | Instala `tflint`, `trivy` y `conftest` con SHA-256 y valida `S13` + `S18/capstone` |
| `npm run lint:workflows` | Valida `.github/workflows/*.yml` con `actionlint` verificado por SHA-256 |
| `npm run verify:preservation` | Garantiza la conservación de las 587 rutas `v1.4` y 704 rutas `v1.5.1` |
| `python scripts/release-audit.py` | 1.446+ controles de integridad, PNGs y paridad CRC/byte de los 54 ZIPs |
| `python scripts/verify-release.py` | Comprueba cada archivo del árbol contra `SHA256SUMS.txt` |

---

## 7. CI/CD y Supply Chain

Los 4 workflows en `.github/workflows/` (`quality.yml`, `devsecops.yml`, `terraform-labs.yml`, `deploy-pages.yml`) fijan todas las acciones externas por **commit SHA completo de 40 caracteres**, desactivan `persist-credentials`, ejecutan `npm ci --ignore-scripts` sobre Node 24 LTS, separan permisos OIDC únicamente al job `deploy` y están validados con `actionlint`. La ejecución remota en la nube de GitHub Actions y la sesión manual humana con lector de pantalla se mantienen explícitamente como `NOT_RUN` hasta ejecutarse en sus entornos respectivos.

---

## 8. Troubleshooting

- **Error `file://` o página en blanco al abrir `index.html`:** Inicia con `npm start` y accede a `http://127.0.0.1:4173`.
- **Error `BLOCKED` al correr `verify:terraform:local` o `verify:iac:scanners`:** Ejecuta primero `npm run setup:terraform` o `npm run setup:scanners` (requiere red para descargar binarios oficiales verificados por SHA-256 en `.tools/`).
- **Fallo de Playwright por falta de navegador:** Ejecuta `npx playwright install chromium`.

---

## 9. Documentación Normativa e Histórica

- Contrato maestro de requisitos: [`TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`](./TODO_LO_QUE_DEBE_TENER_ESTA_APP.md)
- Hoja de ruta y cierre: [`LO_QUE_FALTA_PARA_100_PORCIENTO.md`](./LO_QUE_FALTA_PARA_100_PORCIENTO.md)
- Inventario de entrega: [`RELEASE_MANIFEST.md`](./RELEASE_MANIFEST.md)
- Auditoría final `v2.0.0`: [`docs/AUDITORIA_FINAL_V2_0.md`](./docs/AUDITORIA_FINAL_V2_0.md) (se preservan intactos los informes históricos `v1.2–v1.7` en `docs/`)
- Matriz de accesibilidad WCAG 2.2 AA: [`docs/A11Y_MATRIX.md`](./docs/A11Y_MATRIX.md)
- Auditoría de marca y licencias: [`docs/BRAND_AND_LICENSE_AUDIT.md`](./docs/BRAND_AND_LICENSE_AUDIT.md)

---

## 10. Licencia y Marca

Distribuido bajo licencia [`MIT`](./LICENSE). **TerraPixel Academy** es un proyecto educativo independiente; HashiCorp, Terraform, AWS, Azure, Google Cloud y Kubernetes son marcas registradas de sus respectivos titulares.
