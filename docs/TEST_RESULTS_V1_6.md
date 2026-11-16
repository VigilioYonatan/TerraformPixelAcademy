# Resultados observados de QA — TerraPixel Academy v1.6

Fecha: 2026-11-11. Herramientas: Node.js 22.16, TypeScript 5.8.3 vendorizado, Python/Playwright con Chromium del entorno. Las pruebas fueron ejecutadas desde la carpeta de trabajo; el reporte de entrega describe una comprobación independiente del ZIP extraído.

| Control | Resultado observado | Qué NO acredita |
|---|---|---|
| `npm run qa` | 55/55 tests Node PASS; DevSecOps local PASS (565 archivos inspeccionados) | Terraform CLI, E2E HTTP, npm audit |
| `npm run verify:preservation` | Baseline v1.4 587/587; baseline v1.5.1 704/704 rutas presentes | Comportamiento de cada archivo |
| `npm run build` | Compilación TypeScript sin errores; dist estático generado | Build Vite real |
| `python3 scripts/release-audit.py` | 1431 controles estructurales/ZIP internos PASS | Semántica HCL ejecutada |
| `python3 tests/browser-embedded.py` | 27 checks, cero errores JS observados | Navegación por HTTP |
| `python3 tests/browser-senior-v13.py` | 34 checks, cero errores JS observados | Validación externa de los ADR |
| `python3 tests/browser-editor.py` | 8 checks, CodeMirror 5 offline | CodeMirror 6 |
| `python3 tests/browser-release-gate.py` | 19 checks, cero errores JS observados, incluyendo búsqueda de casos y revocación de evaluación stale | Autenticidad del plan, aprobación de apply |

**Total controles embebidos de navegador observados:** 88. No equivalen a 88 escenarios E2E HTTP completos. `Page.goto(http://127.0.0.1:4182)` devolvió `net::ERR_BLOCKED_BY_ADMINISTRATOR`.

**Terraform:** comando `terraform` no disponible. 37 pruebas CLI reales quedan NOT_RUN. **npm:** no existe resolución DNS para `registry.npmjs.org`; no se generó `package-lock.json` falso ni se ejecutó Vite/Biome/npx.

**Datos sintéticos:** los flujos de S18, what-if, juegos, planos de ejemplo y políticas son contenido educativo. La ejecución real cloud nunca se invoca desde el navegador.
