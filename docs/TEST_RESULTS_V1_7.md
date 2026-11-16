# Evidencia local de control — TerraPixel Academy v1.7

**Fecha:** 2026-11-11. **Base:** copia de trabajo extraída de la v1.6. **Finalidad:** evidencias de esta rama, sin certificar la totalidad de la especificación.

## Comandos terminados satisfactoriamente en el árbol de trabajo

| Comando | Resultado observado |
|---|---|
| `npm run typecheck` | PASS — TypeScript estricto usando `tools/typescript` |
| `npm test` | PASS — 67/67 pruebas Node, incluido contrato del documento de requisitos |
| `npm run build` | PASS — `dist/` offline; **no es** Vite |
| `python3 scripts/release-audit.py` | PASS — 1.432 comprobaciones estructurales y paridad de ZIP internos |
| `npm run verify:preservation` | PASS — baselines v1.4 (587) y v1.5.1 (704) |
| `npm run security:local` | PASS — scanner local; no SCA/npm audit online |
| Comparación contra ZIP v1.6 | PASS — 854/854 rutas encontradas, cero ausentes |

## Browser embedded

Se observaron mensajes de PASS de los cuatro scripts (27, 34, 17 y 19 checks), sin errores JS reportados. Sin embargo, una ejecución conjunta quedó bloqueada o superó el límite de proceso durante el cierre, de modo que **no se certifica la batería conjunta como ejecución totalmente exitosa**. Estos scripts usan Chromium con módulos embebidos; tampoco equivalen a E2E HTTP.

## Pendientes bloqueantes

- **No ejecutado:** `npm ci`, build Vite real, migración total a componentes Preact.
- **No implementado:** CodeMirror 6; editor offline actual es CodeMirror 5.
- **No ejecutado:** Terraform CLI `fmt/init/validate/test` de 36 labs y capstone S18 (37 casos).
- **No ejecutado en este entorno:** E2E HTTP completo con Chromium/Playwright, accessibility audit AA y CI GitHub real.
- **No sustituir por PASS:** las autoevaluaciones y fixtures educativos.

## Verificación de ZIP final

El control de hashes, extracción e integridad se ejecuta tras empaquetar y se refleja en el informe de cierre junto al archivo entregado. En caso de modificación posterior del ZIP, este resultado debe revalidarse.
