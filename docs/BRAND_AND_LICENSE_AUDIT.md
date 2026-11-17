# Auditoría de Marca, Identidad Visual y Licencias (`docs/BRAND_AND_LICENSE_AUDIT.md`)

> **Alcance (`F7-03` / `ui-art-direction` / `R33`):** Revisión técnica y legal de activos visuales servidos al público, separación respecto al boceto conceptual histórico y declaración de licencias de software de primera y tercera parte.

---

## 1. Inventario y Verificación Visual de Activos Propios

| Activo | Inspección Realizada | Resultado | Observación |
|---|---|---|---|
| `assets/terra/hola.png` .. `graduacion.png` (12 PNGs) + `terra-spritesheet.png` | Inspección visual directa (`terra-spritesheet.png`) y verificación de cabecera PNG en `scripts/release-audit.py` | **`PASS`** | Personaje pixel-art original **Terra** con emblema geométrico propio de rombo simple en casco y pecho; **0 logotipos de HashiCorp Terraform, AWS, Azure o GCP** |
| `assets/icons/mark.svg` | Rediseño geométrico y verificación HTTP 200 | **`PASS`** | Emblema propio de rombo + grafo DAG de 3 nodos con paleta TerraPixel (`#a875ff`, `#48d7ed`, `#66e7a9`), sin prismas isométricos registrados de terceros |
| `assets/reference/concepto-aprobado.png` | Revisión de aislamiento público (`scripts/server.mjs` y `src/uiSettings.ts`) | **`PASS` (restringido)** | Conservado en disco para preservar la integridad histórica (`npm run verify:preservation`), **bloqueado con HTTP 404 en `scripts/server.mjs`** y **retirado de enlaces públicos en `#/ajustes`** por contener marcas ilustrativas de terceros en el boceto inicial |

---

## 2. Licencias del Proyecto y Dependencias

- **Licencia del repositorio:** [`MIT`](./../LICENSE), declarada también en `package.json` (`"license": "MIT"`), con aviso expreso de no afiliación respecto a HashiCorp, Terraform y proveedores cloud.
- **Toolchains y librerías empaquetadas:**
  - `tools/typescript/` (`5.8.3`): Licencia `Apache-2.0` / aviso en `tools/typescript/LICENSE.txt`.
  - `app/vendor/preact.mjs` (`10.29.8`) y `app/vendor/codemirror6.mjs` (`@codemirror/*` + `@lezer/highlight`): Licencia `MIT`, documentada en `assets/vendor/THIRD_PARTY_NOTICES.md`.
  - Dependencias de desarrollo (`vite`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `@biomejs/biome`, `@testing-library/preact`): `MIT` / `Apache-2.0`, fijadas en `package-lock.json` (`0` vulnerabilidades).

---

## 3. Checklist Legal y de Marca Pre-Publicación

- [x] Ninguna vista servida por la aplicación expone ni enlaza `assets/reference/concepto-aprobado.png`.
- [x] `scripts/server.mjs` devuelve `404` ante cualquier solicitud a `/assets/reference/*`.
- [x] `assets/icons/mark.svg` y los 12 sprites `assets/terra/*.png` no reproducen logotipos registrados de HashiCorp ni de proveedores cloud.
- [x] El pie de página global (`src/uiShell.ts`), `README.md` y `LICENSE` declaran explícitamente que TerraPixel Academy es un proyecto educativo independiente sin afiliación ni certificación oficial.
- [ ] Registro jurídico formal de marca comercial ante oficina de propiedad intelectual (`NOT_RUN` — decisión de negocio externa al repositorio).
