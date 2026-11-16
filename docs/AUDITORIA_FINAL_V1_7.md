# TerraPixel Academy v1.7 — auditoría de integridad y requisitos

**Resultado exigido:** entregar el ZIP con `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md` raíz; preservar v1.6; revalidar código, Senior Mode y ZIP final desde extracción limpia. **Decisión de release de producto:** NO APROBADO (aún faltan gates de especificación original).

## Hallazgos y alcance

- El nuevo archivo de requisitos es el documento integrador. Verifica qué **debe existir**, no solo lo que existe hoy.
- Código actual: Preact ESM en shell, catálogo, hub Senior, 18 casos Senior y evidencias CLI; legacy views preservadas en `src/main.ts`.
- Editor actual: CodeMirror **5**, con fallback. CodeMirror **6** pendiente.
- `npm run build` usa TypeScript local y build estático. **No es** un bundle Vite con lockfile.
- Runner CLI solo disponible como scripts: sin Terraform CLI no se han ejecutado los 37 escenarios reales.
- Playwright embebido cubre interacciones, **no** E2E de navegador HTTP completo.
- Plan Inspector/Release Gate operan sobre metadatos y estados educativos, nunca autorizan `terraform apply`.
- Una validación estructural del ADR no equivale a revisión técnica experta.

## Matriz de calidad resumida

| Puerta | Criterio | Estado |
|---|---|---|
| G1 | Requisitos documentados por pantalla/ID y matriz | Verificar mediante tests de documento |
| G2 | Conservación de rutas previas y paquetes IaC | Verificar baseline + CRC + comparación fuente |
| G3 | Código, README, manifest y versión coherentes | Verificar antes del ZIP final |
| G4 | Node tests, TS estricto, build, HTTP smoke | Verificar sobre extracción limpia |
| G5 | Nuevas páginas Preact sin rutas/clicks rotos | Tests Chromium embebidos; E2E HTTP pendiente |
| G6 | ZIP CRC, SHA256, extracción limpia | Verificar sobre ZIP final |
| G7 | Advertencias honestas y P1 pendientes registrados | NO APROBADO producto completo |

## Pruebas reproducibles

```bash
npm run typecheck
npm test
npm run security:local
npm run build
python3 scripts/release-audit.py
npm run verify:preservation
python3 scripts/verify-release.py
python3 tests/browser-embedded.py
python3 tests/browser-senior-v13.py
python3 tests/browser-evidence.py
python3 tests/browser-release-gate.py
```

En `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`, capítulos 12–14, constan el proceso integral y los pendientes. La evidencia definitiva de la extracción se indica en el informe de acompañamiento del ZIP cuando se empaqueta.
