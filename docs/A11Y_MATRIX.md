# Matriz de Verificación de Accesibilidad WCAG 2.2 Nivel A / AA (`docs/A11Y_MATRIX.md`)

> **Alcance y honestidad operativa (`ux-accessibility` / `ui-quality-review`):**  
> Esta matriz distingue estrictamente entre los criterios **verificados automáticamente sobre Chromium real mediante `@axe-core/playwright` y pruebas E2E de teclado/zoom (`PASS`)** y las validaciones que requieren **inspección humana con lector de pantalla nativo (`NOT_RUN`)**. Un resultado `PASS` en `axe-core` demuestra cumplimiento programático de DOM/contraste/ARIA, **no** certifica experiencia subjetiva completa de tecnología asistiva.

---

## 1. Cobertura Automatizada Ejecutada (`tests/e2e/a11y.spec.ts` — `PASS`)

Se escanearon con `@axe-core/playwright` (`4.14.0`, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) las **14 rutas de producto + la pantalla `404`** tanto en **tema oscuro (`data-theme="dark"`)** como en **tema claro (`data-theme="light"`)** (30 auditorías completas sobre `http://127.0.0.1:4179`):

1. `#/inicio` — Landing (`HomePage`)
2. `#/aprender` — Catálogo de 36 lecciones + 8 itinerarios (`LearningCatalog`)
3. `#/leccion/B04` — Aula HCL con CodeMirror 6 activo (`LessonClassroom`)
4. `#/juegos` — Hub de 5 minijuegos (`GamesHub`)
5. `#/juego/g1` — Partida interactiva (`GameStage`)
6. `#/laboratorios` — Directorio de 54 paquetes ZIP (`LabsDirectory`)
7. `#/grafo` — Explorador SVG interactivo (`GraphExplorer`)
8. `#/planes` — Plan Explorer + Inspector `plan.json` + `SeniorReleaseGate` (`PlansExplorerPage`)
9. `#/senior` — Dashboard Senior con filtros de severidad y dominio (`SeniorDashboard`)
10. `#/senior/S01` — Incidente Senior con simulador y What-If (`SeniorCasePage`)
11. `#/senior/S18` — Capstone multi-etapa (`SeniorCasePage`)
12. `#/evidencias` — Dashboard de Evidencias CLI (`CliEvidenceDashboard`)
13. `#/progreso` — Perfil, XP, 3 niveles, 8 itinerarios e insignias (`ProfileProgressPage`)
14. `#/ajustes` — Preferencias de tema, movimiento, escala y datos locales (`SettingsPage`)
15. `#/recursos` y `#/ruta-no-existente-404` — Biblioteca/glosario y ruta desconocida (`ResourcesPage`, `NotFoundPage`)

---

## 2. Matriz por Criterio WCAG 2.2

| Criterio WCAG 2.2 | Nivel | Descripción | Método de Prueba | Estado Real | Evidencia |
|---|---|---|---|---|---|
| **1.1.1** Non-text Content | A | `alt` descriptivo en poses informativas de Terra y `alt=""` / `aria-hidden="true"` en iconos decorativos | `@axe-core/playwright` + Vitest | **`PASS`** | `tests/e2e/a11y.spec.ts` |
| **1.3.1** Info and Relationships | A | Landmarks `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<label htmlFor>` y `role="progressbar"` | `@axe-core/playwright` + `@testing-library/preact` | **`PASS`** | `tests/components/views.test.ts` |
| **1.4.3** Contrast (Minimum) | AA | Ratio `>= 4.5:1` en texto normal y `>= 3:1` en texto grande en temas `dark` y `light` (incluidos tokens `--muted`, `--text-sub`, chips y CodeMirror 6) | `@axe-core/playwright` (dark + light) | **`PASS`** | `styles.css`, `tests/e2e/a11y.spec.ts` |
| **1.4.4 / 1.4.10** Resize Text & Reflow (`200%`) | AA | Escala `fontScale = 1.3` + reflujo a `640px` y `320px` sin pérdida de contenido ni scroll horizontal | Playwright E2E HTTP | **`PASS`** | `tests/e2e/a11y.spec.ts`, `tests/e2e/journeys-f602.spec.ts` |
| **1.4.11** Non-text Contrast | AA | Bordes de controles, chips, tarjetas y nodos SVG (`#9a70e2` / `#d5b5ff`) diferenciables | `@axe-core/playwright` + revisión de tokens | **`PASS`** | `styles.css` |
| **2.1.1** Keyboard | A | Operación por teclado de navegación, quiz, juegos, editor HCL y nodos SVG (`tabindex="0"` + flechas/`Home`/`End`/`Enter`/`Space`) | Playwright E2E HTTP | **`PASS`** | `tests/e2e/views-f3.spec.ts`, `tests/e2e/editor.spec.ts` |
| **2.1.2** No Keyboard Trap | A | Salida inmediata de tabulación en CodeMirror 6 mediante `Escape` + `Tab` | Playwright E2E HTTP | **`PASS`** | `src/editor.ts`, `tests/e2e/editor.spec.ts` |
| **2.3.3** Animation from Interactions | AAA / Best Practice | Respeto automático de `@media (prefers-reduced-motion: reduce)` y toggle manual `Reducir movimiento` | Playwright `emulateMedia` | **`PASS`** | `tests/e2e/a11y.spec.ts` |
| **2.4.1** Bypass Blocks | A | Enlace `Saltar al contenido` (`a.skip-link`) como primer elemento enfocable hacia `#main-content` | Playwright E2E HTTP | **`PASS`** | `src/uiShell.ts`, `tests/e2e/a11y.spec.ts` |
| **2.4.7 / 2.4.11** Focus Visible & Appearance | AA | Anillo `:focus-visible` (`3px solid var(--cyan)`) y `.cm-focused` claramente visibles | Playwright `getComputedStyle` | **`PASS`** | `styles.css`, `tests/e2e/a11y.spec.ts` |
| **2.5.3** Label in Name | A | El nombre accesible de enlaces/botones contiene su texto visible (corregido en `a.brand`) | `@axe-core/playwright` | **`PASS`** | `src/uiShell.ts`, `tests/e2e/a11y.spec.ts` |
| **2.5.8** Target Size (Minimum) | AA | Objetivos interactivos `>= 24×24 CSS px` o espaciado equivalente en barra de navegación, breadcrumbs y footer | `@axe-core/playwright` | **`PASS`** | `styles.css`, `tests/e2e/a11y.spec.ts` |
| **4.1.2** Name, Role, Value | A | `aria-pressed`, `aria-expanded`, `aria-current="page"`, `aria-valuenow/min/max` sincronizados declarativamente por Preact | `@axe-core/playwright` + Vitest | **`PASS`** | `tests/components/views.test.ts` |
| **4.1.3** Status Messages | AA | Mensajes dinámicos de evaluación, quiz, juegos, toast, errores y Release Gate con `role="status"` / `role="alert"` y `aria-live="polite"` | `@axe-core/playwright` + Vitest | **`PASS`** | `src/uiShell.ts`, `src/uiLesson.ts`, `src/uiGames.ts`, `src/uiPlans.ts` |
| **Recorrido auditivo real con lector de pantalla** | Manual | Prueba hablada extremo a extremo con NVDA (Windows), VoiceOver (macOS/iOS) o TalkBack (Android) | Inspección humana asistiva | **`NOT_RUN`** | Pendiente de sesión humana con lector de pantalla activo |
