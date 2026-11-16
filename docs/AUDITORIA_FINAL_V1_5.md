# TerraPixel Academy v1.5 — Auditoría final de Senior Mode y DevSecOps

**Fecha:** 2026-11-11.  
**Estado:** **ENTREGA PARCIAL / NO APROBADO** frente a la especificación maestra original.  
**Base:** copia de `terrapixel_v14_work/TerraPixel-Academy` sin borrar el árbol de origen. Se rescató además cualquier archivo añadido a esa base durante la revisión.  
**Propósito:** asegurar rutas y archivos, reforzar CI/DevSecOps/Biome y volver a probar sin atribuir a un análisis estático la fuerza de una prueba real.

## Matriz de requisitos y evidencia

| ID | Requisito | Implementación | Control | Estado |
|---|---|---|---|---|
| R01 | Conservar todos los fuentes de v1.4 | `docs/BASELINE_V1_4_FILES.txt` | `npm run verify:preservation` | VERIFICADO |
| R02 | 36 lecciones e inputs HCL | `src/curriculum.ts`, `assets/labs`, `labs/offline` | test catálogo, `release-audit.py` | VERIFICADO como contenido; CLI NO VERIFICABLE |
| R03 | 18 casos Senior y rúbricas | `src/senior.ts`, `src/seniorWhatIf.ts`, `labs/senior` | tests de 18 decisiones/casos | VERIFICADO como evaluación educativa |
| R04 | S18 capstone y pruebas descargables | `labs/senior/S18/capstone`, `assets/senior/S18.zip` | CRC + comparación byte a byte | VERIFICADO como paquete; CLI NO VERIFICABLE |
| R05 | Revisión de plan.json sin exponer valores | `src/planInspector.ts`, `src/planReport.ts` | Node tests de secretos/drift/límites | VERIFICADO en pruebas locales |
| R06 | CodeMirror offline | `src/editor.ts`, `assets/vendor/codemirror5` | prueba Chromium embebida | VERIFICADO v5; **INCOMPLETO** v6 |
| R07 | Preact real | `app/vendor/preact.mjs`, `src/main.ts` | unidad+render embebido | VERIFICADO shell; **INCOMPLETO** migración declarativa |
| R08 | Biome | `biome.json`, `package.json`, `devsecops.yml` | validación JSON/contratos CI | **NO VERIFICABLE** CLI Biome sin npm |
| R09 | Escaneo DevSecOps local | `scripts/devsecops-audit.mjs` | `npm run security:local` | VERIFICADO; no sustituye SAST |
| R10 | Dependencias seguras | `dependabot.yml`, `devsecops.yml` | revisión estática | **NO VERIFICABLE** npm audit online |
| R11 | Build estático | `scripts/build-static.mjs`, `dist/` | `npm run build` | VERIFICADO |
| R12 | Build Vite/lockfile | `vite.config.js`, `package.json` | herramienta no instalable vía npm | **INCOMPLETO / NO VERIFICABLE** |
| R13 | Servidor local con CSP y acceso restringido | `scripts/server.mjs`, `tests/http-smoke.test.mjs` | HTTP smoke Node | VERIFICADO local |
| R14 | Browser embebido responsive, Senior y editor | `tests/browser-*.py` | ejecución Chromium embebido | VERIFICADO solo modo embebido |
| R15 | Browser HTTP completo/persistencia | sin runner HTTP desbloqueado | navegación bloqueada por entorno | **NO VERIFICABLE** |
| R16 | Terraform CLI para 37 ejercicios | `scripts/verify-terraform-labs.*`, GitHub Actions | herramienta ausente localmente | **NO VERIFICABLE** |
| R17 | ZIP preservado y verificable | `scripts/verify-release.py`, `SHA256SUMS.txt` | hashing del ZIP extraído | VERIFICADO en release empaquetado |
| R18 | Documentación DevSecOps y Senior | `docs/DEVSECOPS.md`, `docs/SENIOR_DEVSECOPS_PLAYBOOK.md` | inspección manual y manifest | VERIFICADO |

## Riesgos y limitaciones que bloquean el estatus completo

1. **P1:** CodeMirror requerido **6**, integrado **5** (biblioteca MIT offline disponible). No intercambiables.
2. **P1:** Preact monta el shell pero la mayoría de vistas siguen siendo HTML de plantilla; falta migrar a componentes declarativos y pruebas UI completas.
3. **P1:** Sin `package-lock.json` instalado/verificado. `npm ci` no es viable; CI usa `npm install`. Las versiones instaladas y build Vite requieren resolución de dependencias online.
4. **P1 / NO VERIFICABLE:** 37 ejecuciones reales de Terraform (`fmt/init/validate/test`) sin CLI local. El workflow existe, no hubo evidencia externa de un run verde.
5. **NO VERIFICABLE:** `@biomejs/biome` declarado, pero no disponible en caché ni descargable por `EAI_AGAIN`. No se afirma haber corrido Biome.
6. **NO VERIFICABLE:** `npm audit`, SAST en servicio externo, escaneo de dependencias y Chromium E2E HTTP.
7. **P2:** GitHub Actions usan versiones por etiquetas `@v4`, no pins SHA. Revisión de licencias y marcas antes de publicar.

## Controles que sí corrieron

```bash
npm run qa                       # tsc + todos los tests Node + seguridad local
python3 scripts/release-audit.py # verificación de cada laboratorio/ZIP interno
npm run verify:preservation     # prueba de inventario histórico
npm run build                   # compilación TypeScript y paquete estático
python3 tests/browser-embedded.py
python3 tests/browser-senior-v13.py
python3 tests/browser-editor.py
python3 scripts/verify-release.py # ejecutar tras generar SHA256SUMS y sobre ZIP extraído
```

**Pruebas Terraform CLI, Biome y npm audit no corridas.**

## Recomendaciones para resolver gates restantes

En equipo con Internet: instalar dependencias, revisar versiones del lockfile generado y hacer commit de `package-lock.json`; sustituir `npm install` en CI por `npm ci`; ejecutar `npm run lint:biome`, `npm audit --audit-level=high` y `npm run build:vite`. Migrar CodeMirror a v6, reemplazar el shell con renderizado Preact declarativo y ejecutar E2E contra HTTP real. En GitHub Actions ejecutar el workflow de Terraform y guardar sus 37 logs; **no subir credenciales ni state**.

## Decisión

El ZIP v1.5 puede distribuirse para **prácticas educativas y desarrollo**, conservando los archivos anteriores, pero **no debe aprobarse como producto completo de producción**. Ningún test Node o checksum demuestra que Terraform haya ejecutado cloud/CLI, que el código esté libre de vulnerabilidades o que el flujo CI online ya funcione.
