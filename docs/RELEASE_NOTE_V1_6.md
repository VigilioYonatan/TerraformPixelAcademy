# Release v1.6 — Senior Mode y build offline

**Base:** v1.5.1 sin pérdida de rutas ni modificaciones a los 54 ZIP educativos. **Versión de aplicación:** 1.6.0.

## Archivos añadidos

- `src/uiShell.ts`, `src/uiSeniorHub.ts`: shell, navegación, footer y dashboard Senior ahora declarativos con Preact real.
- `src/releaseGate.ts`: motor educativo de revisión de planes sin autorizar despliegues.
- `tests/release-gate.test.mjs`, `tests/browser-release-gate.py`: regresión de reglas, redacción de secretos y revocación de estados previos.
- `tests/offline-toolchain.test.mjs`: comprueba el compilador local.
- `tools/typescript/`: TypeScript 5.8.3 MIT, para compilar offline con Node.
- `docs/BASELINE_V1_5_1_FILES.txt`: inventario del ZIP anterior para detectar eliminaciones.
- `docs/AUDITORIA_FINAL_V1_6.md`: matriz de requisitos y límites reales.

## Archivos preservados y modificados intencionalmente

- `src/main.ts`: usa el shell/dashboard declarativos; agrega Release Gate y búsqueda Senior.
- `src/vendor/preact.d.mts`: declaración genérica con props tipadas para componentes funcionales.
- `styles.css`: UI nueva, accesibilidad y panel de release.
- `scripts/verify-preservation.mjs`: ahora compara contra v1.4 y v1.5.1.
- `.github/workflows/quality.yml`: usa toolchain offline y tests Node reales sin `npm install`.
- `package.json`, `README.md`, `SECURITY.md` y `assets/vendor/THIRD_PARTY_NOTICES.md`: alineación documental y licencia de TypeScript.

## Lo no cerrado

CodeMirror 6, todas las vistas en Preact declarativo, Vite/lockfile, Terraform CLI, E2E HTTP, DevSecOps remoto y revisión legal siguen sin aprobación. No se simulan resultados de esas comprobaciones.
