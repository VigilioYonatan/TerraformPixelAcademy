# Reglas de Agente — TerraPixel Academy (`AGENTS.md`)

## 1. Fuentes de Verdad y Autoridad

La autoridad del repositorio se divide estrictamente para impedir contradicciones y afirmaciones sin evidencia:

1. **Comportamiento implementado:** lo demuestran únicamente el código ejecutable (`src/`, `app/`, `scripts/`), el lockfile (`package-lock.json`), los artefactos verificados (`assets/`, `labs/`) y los tests automatizados (`tests/`).
2. **Contrato funcional y pedagógico del producto:** [`TODO_LO_QUE_DEBE_TENER_ESTA_APP.md`](./TODO_LO_QUE_DEBE_TENER_ESTA_APP.md) define las 36 lecciones (`B01–A12`), los 18 escenarios Senior (`S01–S18`), los 8 hitos del capstone `S18`, las 14 rutas y los límites éticos/técnicos no negociables.
3. **Hoja de ruta hacia el 100 %:** [`LO_QUE_FALTA_PARA_100_PORCIENTO.md`](./LO_QUE_FALTA_PARA_100_PORCIENTO.md) registra las tareas `[ ]` pendientes por fase (`F0–F8`), los archivos afectados, las skills Vigilio obligatorias y el criterio de cierre verificable.
4. **Estándares de ingeniería y seguridad Vigilio:** las skills operativas (`platform-actions/skills/<skill>/SKILL.md` y sus `references/*`) y la documentación canónica (`vigilio-docs/`, excluyendo `_site/` y `.compat/`) gobiernan arquitectura, testing BDD/E2E, supply-chain y revisión de cambios.

Si una afirmación documental contradice una prueba ejecutable, prevalece la evidencia real y se corrige la documentación.

---

## 2. Orquestación `vigilio-auto-senior` y Cero Atajos (`complete-work-no-shortcuts`)

Antes de modificar cualquier módulo:

1. **Inspeccionar el estado real:** revisar `git status`, `git diff`, `package.json`, `package-lock.json`, imports vecinos y tests existentes.
2. **Cargar skills reales:** abrir y leer íntegras las `SKILL.md` pertinentes al cambio junto con sus `references/*` existentes y las fuentes canónicas aplicables (`technology/versions.md`, `standards/engineering/refactoring-existing-code.md`, `standards/testing/*`). Nunca declarar `skills_loaded` sin lectura real.
3. **Honestidad de estados (`PASS` / `FAIL` / `NOT_RUN` / `BLOCKED`):**
   - `PASS`: comando ejecutado en la sesión actual con código de salida `0` y aserciones verificadas.
   - `FAIL`: comando ejecutado que detectó defecto o regresión.
   - `NOT_RUN`: prueba existente pero aún no ejecutada en la sesión actual.
   - `BLOCKED`: herramienta externa, CLI (`terraform`), servicio o credencial ausente en el entorno. **Prohibido convertir `NOT_RUN` o `BLOCKED` en `PASS`.**
4. **Separación de fases `FIX` vs. `REVIEW`:** tras implementar y ejecutar pruebas, realizar revisión independiente de solo lectura (`review-code-change`) sobre `git diff`. Si aparecen hallazgos, corregir en una nueva pasada `FIX` y re-ejecutar todos los gates afectados.

---

## 3. Invariantes Innegociables del Dominio TerraPixel

- **Preservación de baselines históricos:** jamás eliminar ni renombrar silenciosamente rutas listadas en `docs/BASELINE_V1_4_FILES.txt` (587 rutas) ni `docs/BASELINE_V1_5_1_FILES.txt` (704 rutas). Todo cambio debe mantener `npm run verify:preservation` en `PASS`.
- **Doble modo de construcción y ejecución:**
  - **Modo Offline (`APP-06`):** `npm start` y `npm run build` deben funcionar sin red usando `app/` + `tools/typescript/` (`5.8.3` MIT). Toda edición en `src/*.ts` exige recompilar `app/*.js`.
  - **Modo Bundler Reproducible (`APP-05`):** `npm ci --ignore-scripts` y `npm run build:vite` generan el bundle productivo Vite con `.vite/manifest.json`, control de `bundle:budget` y preservación completa de assets/labs/docs en `dist/`.
- **Seguridad educativa e IaC:**
  - El navegador **no** ejecuta HCL real ni `terraform apply`; el evaluador web usa reglas léxicas didácticas (`BROWSER_RULES`).
  - `src/planInspector.ts` y `src/releaseGate.ts` procesan únicamente direcciones y metadatos de `terraform show -json`; **prohibido** leer, mostrar o exportar `before`, `after`, `planned_values`, `variables`, `outputs` o credenciales, y **prohibido** emitir autorización automática de `apply` (estados únicos: `BLOCKED`, `NEEDS_EVIDENCE`, `READY_FOR_HUMAN_REVIEW`).
  - Los runners `scripts/verify-terraform-labs.ps1` y `scripts/verify-terraform-labs.sh` ejecutan `terraform fmt/init/validate/test` exclusivamente sobre **copias temporales aisladas** con `TF_IN_AUTOMATION=1`, sin mutar `labs/` ni dejar artefactos residuales en la raíz cuando se define `REPORT_DIR`.
  - Toda modificación a `labs/offline/<ID>/` o `labs/senior/<ID>/` exige regenerar su `.zip` correspondiente en `assets/labs/` o `assets/senior/` con paridad exacta verificada por `python scripts/release-audit.py`.

---

## 4. Comandos Obligatorios de Verificación Local

```bash
npm run typecheck             # TypeScript estricto (sin emit)
npm test                      # Suite unitaria, integridad y BDD (Node Test Runner)
npm run lint:biome            # Linter estático Biome sobre src, scripts y tests
npm run security:local        # Escáner local DevSecOps y contratos de seguridad
npm run build                 # Compilación TS -> app/ + dist/ estático offline
npm run build:vite            # Compilación TS + bundle Vite + copia estática + bundle:budget
npm run verify:preservation   # Verificación de rutas baseline v1.4 (587) y v1.5.1 (704)
python scripts/release-audit.py # 1.432+ controles estructurales, PNGs y paridad CRC de 54 ZIPs
```
