# Auditoría Final v2.0.0 — TerraPixel Academy (`docs/AUDITORIA_FINAL_V2_0.md`)

> **Fecha:** 2026-11-17 · **Versión:** `2.0.0` · **Licencia:** `MIT`  
> **Fuentes de autoridad:** [`TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`](../TODO_LO_QUE_DEBE_TENER_ESTA_APP.md) + [`LO_QUE_FALTA_PARA_100_PORCIENTO.md`](../LO_QUE_FALTA_PARA_100_PORCIENTO.md) + [`AGENTS.md`](../AGENTS.md).

---

## 1. Resumen Ejecutivo de Cierre (`v1.7.0` -> `v2.0.0`)

TerraPixel Academy `v2.0.0` cierra todas las brechas técnicas implementables en entorno local de las fases `F0` a `F8`:

1. **Arquitectura UI y Editor (`F2–F3`):** Las **14 rutas + `404`** y el shell global operan 100 % en **Preact declarativo puro** (`0` asignaciones `innerHTML`, `0` `dangerouslySetInnerHTML`), con estado reactivo centralizado (`src/store.ts`) y **CodeMirror 6 HCL** offline (`app/vendor/codemirror6.mjs`, `src/hclLanguage.ts`, `src/editor.ts`) con salida de foco WCAG 2.1.2 (`Escape` + `Tab`).
2. **Senior Mode y Plan Inspector (`F4`):** **18/18 simuladores deterministas** (`src/simulators.ts`), contexto de arquitectura en producción diferenciado en las **36 lecciones** (`src/lessonSeniorContext.ts`), y soporte Terraform `>= 1.7` (`forget` / `STATE_FORGET`, `delete-then-create` vs `create-before-destroy`) con 50 rondas de fuzzing anti-fuga de secretos (`src/planInspector.ts`, `src/releaseGate.ts`).
3. **IaC Real y Escáneres Estáticos (`F5`):** **37/37 escenarios** (`B01–A12` + `S18/capstone`) verificados con `Terraform v1.10.5` oficial (SHA-256), más `TFLint v0.66.0`, `Trivy Config v0.76.2` (`0 HIGH/CRITICAL`) y `Conftest v0.71.1` OPA Rego sobre `S13` y `S18` (casos positivos y negativos *fail-closed*).
4. **Testing Integral y WCAG 2.2 AA (`F6`):** Suite Node/BDD, suite de componentes Preact en **Vitest** (`tests/components/views.test.ts`), suite E2E HTTP real multiplataforma en **Playwright** (`tests/e2e/*.spec.ts`) sobre servidor local y `dist/` compilado, y **`0` violaciones WCAG 2.2 A/AA** en `@axe-core/playwright` sobre las **30 pantallas** (`dark` + `light`).
5. **Seguridad CSP, CI/CD SHA-Pinned y Marca (`F7`):** Eliminación total de atributos `style="..."` e inyecciones inline en CodeMirror 6 (`adoptedStyleSheets` + CSSOM), CSP estricta `default-src 'self'; script-src 'self'; style-src 'self'` verificada en Chromium real, 4 workflows fijados por commit SHA de 40 caracteres validados con `actionlint v1.7.12`, emblema `mark.svg` original, bloqueo HTTP 404 de `assets/reference/concepto-aprobado.png` y licencia `MIT`.

---

## 2. Evaluación de Gates `G1–G7`

| Gate | Estado | Evidencia Real Verificada |
|---|---|---|
| **G1 Cobertura** | **`PASS`** | 20/20 requisitos `APP-01..APP-20` trazados en `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md` |
| **G2 Integridad** | **`PASS`** | 54/54 ZIPs con paridad byte a byte (`release-audit.py`), `LICENSE` y `THIRD_PARTY_NOTICES.md` presentes |
| **G3 Coherencia** | **`PASS`** | `package.json` (`2.0.0`), `README.md`, `RELEASE_MANIFEST.md`, workflows y UI sincronizados |
| **G4 Build y ejecución** | **`PASS` (local)** | `build`, `build:vite` (`bundle:budget`), `qa`, `test:e2e`, `verify:terraform:local` (`37/37`), `verify:iac:scanners` (`6/6`), `lint:workflows` |
| **G5 Correcciones** | **`PASS`** | Todos los defectos encontrados (CM6 CSP, TFLint child modules, Axe WCAG AA, Python Windows) corregidos y re-verificados |
| **G6 ZIP y extracción limpia** | **`PASS`** | Extracción limpia en directorio temporal con `release-audit.py`, `verify:preservation`, `verify-release.py` (`0 problems`) y gates completos en `PASS` |
| **G7 Honestidad** | **`PASS`** | Estados externos no ejecutables localmente declarados explícitamente como `NOT_RUN` |

---

## 3. Controles Externos Registrados Honestamente como `NOT_RUN`

| Control | Estado Real | Motivo |
|---|---|---|
| Ejecución remota en runners cloud de GitHub Actions | **`NOT_RUN`** | Validados localmente con `actionlint v1.7.12` (`PASS`), sin push a repositorio remoto |
| Sandbox cloud AWS/provider real | **`NOT_RUN`** | Fuera de alcance offline-first; los 37 labs se ejecutan con `terraform_data` local |
| Sesión auditiva manual con lector de pantalla (`NVDA` / `VoiceOver`) | **`NOT_RUN`** | Requiere inspección humana asistiva; cobertura automática WCAG 2.2 AA (`@axe-core/playwright`) en `PASS` (`0` violaciones) |
| Registro jurídico de marca comercial ante oficina externa | **`NOT_RUN`** | Decisión legal/comercial externa; auditoría técnica de activos propios en `PASS` (`docs/BRAND_AND_LICENSE_AUDIT.md`) |
| Advisory upstream sin parche en `devDependencies` (`GHSA-fc5q-39xc-vjpf`) | **`OBSERVADO` (`0` runtime)** | `npm audit --omit=dev` reporta `0` vulnerabilidades en `app/` y `dist/`; `picomatch@4.0.7` (transitivo de `vite@8.3.8` / `vitest@5.1.0` solo en desarrollo) aguarda parche upstream sin downgrade destructivo |
