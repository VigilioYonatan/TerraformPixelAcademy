# TerraPixel Academy v2.0.0 — Inventario de Entrega

- **Versión:** `2.0.0` (2026-11-16) · **Licencia:** [`MIT`](./LICENSE).
- **Contrato de requisitos:** [`TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`](./TODO_LO_QUE_DEBE_TENER_ESTA_APP.md) (`APP-01..APP-20`).
- **Auditoría y dictamen actual:** [`docs/AUDITORIA_FINAL_V2_0.md`](./docs/AUDITORIA_FINAL_V2_0.md) (se conservan intactos todos los informes y baselines históricos `v1.2–v1.7` en `docs/`).
- **Estado:** Verificado localmente en alcance completo (**14/14 rutas Preact**, **CodeMirror 6 HCL**, **37/37 Terraform v1.10.5 `PASS`**, **TFLint/Trivy/Conftest `PASS`**, **Vitest + Playwright E2E HTTP + WCAG 2.2 AA `0` violaciones**, **CSP `style-src 'self'` sin `unsafe-inline`**, **`actionlint` `PASS`**). Permanecen explícitamente `NOT_RUN` los controles externos fuera del entorno local (ejecución remota en GitHub Actions cloud, sandbox cloud AWS real y sesión auditiva humana con lector de pantalla `NVDA`/`VoiceOver`).

| Ruta | Alcance |
|---|---|
| `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, `LO_QUE_FALTA_PARA_100_PORCIENTO.md` | Contrato maestro (`36` lecciones, `18` Senior, `8` hitos `S18`, `APP-01..APP-20`) y trazabilidad |
| `README.md`, `LICENSE`, `SECURITY.md` | Onboarding `<10 min`, licencia `MIT` y modelo de seguridad |
| `src/`, `app/`, `styles.css`, `index.html` | Código TypeScript estricto, ESM offline, Preact declarativo y tokens WCAG AA |
| `assets/terra/`, `assets/icons/mark.svg` | 12 poses PNG de Terra, spritesheet y emblema SVG propio (referencia histórica `assets/reference/` restringida a HTTP 404) |
| `assets/vendor/`, `app/vendor/`, `tools/typescript/` | Preact `10.29.8`, CodeMirror 6 offline ESM y TypeScript `5.8.3` con licencias |
| `labs/offline/`, `assets/labs/` | 36 laboratorios HCL reales y 36 ZIPs con paridad exacta |
| `labs/senior/`, `assets/senior/` | 18 casos Senior, políticas OPA (`S13`/`S18`), capstone `S18` y 18 ZIPs |
| `scripts/`, `tests/`, `.github/` | Build estático y Vite, QA (`node --test`, `Vitest`, `Playwright` + Axe + CSP), runners SHA-256 y workflows SHA-pinned |
| `dist/` | Salida lista para despliegue HTTP estático (con `.vite/manifest.json` y assets sincronizados) |
| `docs/AUDITORIA_FINAL_V2_0.md`, `docs/A11Y_MATRIX.md`, `docs/BRAND_AND_LICENSE_AUDIT.md` | Informes de auditoría, accesibilidad y marca/licencias |
| `SHA256SUMS.txt` | Manifiesto SHA-256 íntegro de todo el árbol versionado (`scripts/verify-release.py`) |

## Comandos de Verificación

```bash
npm start
npm run typecheck
npm run lint:biome
npm run qa
npm run test:e2e
npm run verify:iac:scanners
npm run verify:terraform:local
npm run lint:workflows
npm run build && npm run build:vite
npm run verify:preservation
python scripts/release-audit.py
python scripts/verify-release.py
```
