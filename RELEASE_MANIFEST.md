# TerraPixel Academy v1.7 — inventario de entrega

- **Nombre del ZIP:** `TerraPixel_Academy_v1_7_SENIOR_CON_REQUISITOS_COMPLETOS.zip`.
- **Archivo principal solicitado:** `TerraPixel-Academy/TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`.
- **Fuente de implementación:** v1.6 preservada; código Preact incremental para catálogo, evidencias y casos Senior.
- **Progreso y documentación históricos:** conservar rutas, no borrar los releases anteriores ni sus informes.
- **Estado:** paquete auditable y funcional en controles locales, **NO APROBADO como release de producción** porque hay requisitos originales sin verificación.

| Ruta | Alcance |
|---|---|
| `TODO_LO_QUE_DEBE_TENER_ESTA_APP.md` | Contrato exhaustivo, 36 lecciones, 18 Senior, 8 hitos, matriz y Anexo A |
| `README.md`, `SECURITY.md` | Ejecución, riesgos y obligaciones de seguridad |
| `src/`, `app/`, `styles.css` | TS, módulos ESM, Preact, interfaz y motor educativo |
| `assets/terra/`, `assets/reference/` | 12 PNG, spritesheet y diseño aprobado |
| `assets/vendor/`, `app/vendor/`, `tools/typescript/` | Runtime offline, editor CM5 y compilador TypeScript, con licencias |
| `labs/offline/`, `assets/labs/` | 36 laboratorios HCL y ZIP descargables |
| `labs/senior/`, `assets/senior/` | 18 escenarios Senior, ejercicios, ADR, S18 y ZIP |
| `scripts/`, `tests/`, `.github/` | Build, QA, runner Terraform, workflows y auditoría |
| `dist/` | Salida estática offline reconstruible |
| `docs/AUDITORIA_FINAL_V1_7.md`, `docs/RELEASE_NOTE_V1_7.md` | Estado, alcance y pendientes |
| `SHA256SUMS.txt` | Integridad de archivos por hash (no firma digital) |

## Iniciar y verificar

```bash
npm start                  # http://localhost:4173
npm run typecheck
npm test
npm run security:local
npm run build
python3 scripts/release-audit.py
npm run verify:preservation
python3 scripts/verify-release.py
```

No declarar PASS en Terraform CLI o E2E HTTP mientras no se ejecuten esas pruebas.
