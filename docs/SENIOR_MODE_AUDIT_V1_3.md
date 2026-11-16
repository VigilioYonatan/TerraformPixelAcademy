# TerraPixel Academy — Auditoría Senior v1.3

Fecha: 11 de noviembre de 2026. Revisión aplicada a una **copia de v1.2**. El ZIP original permanece intacto.

## Resultado

**Entrega funcional ampliada en lo probado; NO APROBADA contra la especificación maestra completa.** Todos los 18 casos tienen un ejercicio interactivo de decisión, un contrato JSON sintético, una hoja de trabajo y una revisión específica. El caso S18 añade un laboratorio Terraform local de composición de módulos y ocho registros de evidencia. Se distingue rigurosamente entre pruebas de interfaz/reglas educativas y ejecución real de Terraform.

## Matriz de la auditoría Senior

| ID | Implementación / evidencia | Verificación real | Estado |
|---|---|---|---|
| SR-01 | 18 casos y sus rúbricas `src/senior.ts` | Node catálogo, datos | VERIFICADO |
| SR-02 | 18 what-if `src/seniorWhatIf.ts` | Node safe/unsafe de los 18 y Chromium embebido | VERIFICADO como simulación |
| SR-03 | 18 packs con hojas y contrato `labs/senior/Sxx` | Node + CRC + comparación byte a byte | VERIFICADO empaquetado |
| SR-04 | ADR y 4 controles `src/engine.ts` | Node y Chromium embebido | VERIFICADO estructural |
| SR-05 | Revocar completado por decisión/checklist/ADR inválidos `src/seniorProgress.ts` | Node + cambio de nota S18 en navegador embebido | VERIFICADO |
| SR-06 | Portafolio global `src/seniorReport.ts` | Node y descarga Chromium embebido | VERIFICADO |
| SR-07 | S18 ocho hitos con evidencia distinta y estado declarado | Node y Chromium embebido | VERIFICADO estructural |
| SR-08 | S18 capstone Terraform local con módulo y tests | Inventario, análisis de referencias, checks Node | NO VERIFICADO con CLI |
| SR-09 | 36 labs + S18 runner CLI y workflow CI | Bash sintaxis, script sin CLI devuelve 3 | NO VERIFICADO con CLI |
| SR-10 | Responsive Senior 320, 390, 768, 1440 | Chromium embebido sin navegación HTTP | VERIFICADO en modo embebido |
| SR-11 | Integración de navegador a través de HTTP | Chromium rechaza localhost/file:// por política del contenedor | NO VERIFICABLE |
| SR-12 | Preact + CodeMirror 6 + Vite build original | Paquetes no disponibles offline, frontend actual DOM nativo | INCOMPLETO P1 |
| SR-13 | Lockfile npm reproducible | Ausente; npm registry `EAI_AGAIN` | INCOMPLETO P1 |
| SR-14 | Revisión semántica del ADR y acreditación Senior | Sin validación externa, se etiqueta autoevaluación | NO APLICA como certificación |

## Controles ejecutables

```sh
npm run qa
npm run build
python3 scripts/release-audit.py
python3 tests/browser-embedded.py
python3 tests/browser-senior-v13.py
bash scripts/verify-terraform-labs.sh
```

La última orden requiere instalar Terraform CLI >= 1.9; cuando no está instalada informa `NOT_RUN` y sale con código 3. Su mera presencia en el repositorio no significa que se haya ejecutado Terraform. El workflow GitHub Actions existe pero no se comprobó su resultado remoto.

## Límites de contenido

- Los 18 escenarios, planes, grafos y simuladores son **sintéticos**, no métricas cloud.
- El validador HCL del navegador usa patrones de aprendizaje, no parser ni motor Terraform.
- El S18 incluye código Terraform diseñado para `terraform test` con `command = plan`, pero sin Terraform CLI no se certifica su ejecución.
- Los resultados del portafolio indican `NOT_RUN` para CLI/cloud y revisión externa; el usuario es responsable de las afirmaciones personales en su ADR.
- Falta instalar versiones de npm y resolver Preact + CodeMirror, lockfile y bundling Vite exigidos en la especificación original.
- Sin E2E de origen HTTP ni auditoría de accesibilidad WCAG completa, no se declara el frontend apto para producción.

## Criterio de salida

**NO APROBADO como release de producción completo.** Versión 1.3 apta para práctica local y revisión ulterior; estructura, imágenes, fuentes, packs y `dist/` se auditan de forma independiente tras comprimir y extraer el ZIP.
