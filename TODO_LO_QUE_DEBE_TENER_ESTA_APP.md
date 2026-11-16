# TODO_LO_QUE_DEBE_TENER_ESTA_APP.md

> **TerraPixel Academy — contrato funcional, visual, educativo, técnico y de aceptación integral.**  
> Documento vivo de requisitos, con estado real comprobable y criterios para liberar una versión sin omisiones conocidas.  
> **Fecha de referencia:** 11 de noviembre de 2026. **Idioma de producto:** español. **Prioridad:** Senior Mode, integridad, seguridad educativa y conservación de archivos.

## 0. Cómo debe utilizarse este documento

Este archivo responde a **qué debe tener TODA la aplicación**, cómo debe verse, qué acciones debe realizar, qué archivos tienen que existir, qué pruebas deben aprobarse y qué funcionalidades no se pueden llamar completas hasta tener evidencias. No es una lista decorativa ni un resumen de marketing.

Se aplican tres marcadores inequívocos:

- **OBLIGATORIO:** parte del contrato de producto y de la definición de terminado.
- **YA IMPLEMENTADO / CON COBERTURA PARCIAL:** el código está localizado, pero su existencia **no** equivale a cobertura exhaustiva ni certificación externa.
- **PENDIENTE / NO VERIFICADO:** falta código, una versión requerida, infraestructura, ejecución real o prueba independiente. **Nunca** elevar a aprobado sin una nueva evidencia.

**Precedencia documental:** las reglas de seguridad, honestidad y criterios de aceptación de los capítulos 0–13 prevalecen ante cualquier ejemplo de diseño en el **Anexo A** (especificación maestra auditada v1.1). El anexo se conserva íntegro para que este documento sea autocontenido y no dependa de abrir un segundo `.md`.

**Conservación:** el ZIP de entrada es un baseline. No se debe eliminar, renombrar ni reemplazar silenciosamente ninguno de sus archivos; se modifica una copia y se revalida su inventario antes del release. Conservar rutas no significa que el contenido jamás pueda actualizarse: toda modificación exige diff, pruebas y evidencia.

## 1. Resultado de producto, alcance y promesa honesta

**Producto:** academia web offline-first, estética pixel art, centrada en aprender **HashiCorp Terraform** desde HCL inicial hasta diagnósticos de Platform Engineering. Mascota original **Terra** con 12 PNG; diseño alineado con GoPixel Academy, pero currículo, iconografía educativa y pantallas adaptadas a IaC.

**Audiencias:** principiante sin cloud; desarrollador que necesita automatizar entornos; DevOps/SRE que revisa planes y riesgos; ingeniero Senior que debe documentar decisiones, responder a incidentes y diseñar una plataforma segura.

**Capas de experiencia obligatorias:**

1. **Aula didáctica offline:** editor HCL, feedback, quiz, progreso, minijuegos, visualizadores y casos. No pretende ejecutar Terraform real.
2. **Labs Terraform CLI locales:** fuentes `.tf`, tests `.tftest.hcl`, instrucciones, comando de verificación seguro en copia temporal y evidencias etiquetadas por procedencia.
3. **Sandbox cloud remoto:** opcional y futuro, **no forma parte del MVP**. Solo introducirlo con aislamiento, identidad temporal, presupuestos, cuotas y limpieza verificable.

**Promesas prohibidas:** no afirmar que se ejecutó `terraform apply` en el navegador; no confundir regex HCL con parser oficial; no marcar `NOT_RUN` como `PASS`; no equiparar XP, badges o ADR estructural con certificación HashiCorp o revisión experta; no afirmar que se desplegó cloud sin evidencia.

**Identidad:** "TerraPixel Academy" como nombre independiente/provisional; la marca HashiCorp Terraform se menciona descriptivamente. No reclamar afiliación, aval, certificación oficial ni derechos sobre logotipos de terceros. La mascota no debe utilizar como logo propio el emblema registrado de Terraform.

## 2. Matriz maestra de alcance y estado

La siguiente tabla debe actualizarse en **cada release**, con enlaces reales a rutas y logs. "PASS estático" no reemplaza una prueba en navegador ni CLI.

| ID | Requisito obligatorio | Implementación/archivo en este ZIP | Estado al crear este documento | Gate definitivo |
|---|---|---|---|---|
| APP-01 | Aplicación navegable, dark/light y responsive | `index.html`, `src/main.ts`, `styles.css` | Implementada; E2E HTTP no verificado | Playwright real vía HTTP y revisión móvil/tablet/desktop |
| APP-02 | UI pixel-art siguiendo PNG aprobado | `assets/reference/concepto-aprobado.png`, `assets/terra/` | Assets presentes | Capturas, visual regression, contrastes y foco |
| APP-03 | SPA Preact totalmente declarativa | `src/uiShell.ts`, `src/uiSeniorHub.ts`, `src/uiSeniorCase.ts`, `src/uiCatalog.ts`, `src/uiCliEvidence.ts` | Parcial: algunas vistas siguen plantillas HTML | Migrar todas las vistas y comprobar paridad de interacción |
| APP-04 | Editor CodeMirror 6 para HCL | `src/editor.ts`, `assets/vendor/codemirror5/` | **Pendiente CodeMirror 6**; v5 como solución actual | Integración CM6 auténtica, licencia, pruebas de edición/accessibilidad |
| APP-05 | Build Vite + lockfile reproducible | `vite.config.js`, `package.json` | **Pendiente** resolución verificada de npm y lockfile | `npm ci`, `npm run build:vite` limpios |
| APP-06 | Build offline sin instalar paquetes | `tools/typescript/`, `scripts/build-static.mjs` | Implementado y probado localmente | Build desde extracción final; integridad de assets |
| APP-07 | 36 lecciones y evaluación educativa | `src/curriculum.ts`, `src/engine.ts`, `labs/offline/` | 36 presentes; no equivalen a tests reales de CLI | Validación de contenido + interacciones + tests por lección |
| APP-08 | 18 retos Senior con investigación, decisión, review, ADR y handoff | `src/senior.ts`, `src/uiSeniorCase.ts`, `labs/senior/` | Presentes; rúbrica estructural, no experta | Cobertura UI de los 18 + casos positivos/negativos |
| APP-09 | Capstone S18 con 8 hitos | `src/senior.ts`, `labs/senior/S18/` | Presente, ejecución real no acreditada | Módulo/test Terraform, evidencias y revisión humana |
| APP-10 | 5 juegos y XP | `src/games.ts`, `src/engine.ts` | Presentes | Gameplay, explicaciones, persistencia, cero doble XP |
| APP-11 | Inspector de `plan.json`, drift y release gate | `src/planInspector.ts`, `src/releaseGate.ts` | Presente; es simulación de revisión | JSON real de distintas versiones, fuzz/negativos y privacidad |
| APP-12 | Grafo de dependencias y planes ficticios | `src/fixtures.ts`, `src/main.ts` | Presente | UI usable con teclado, narrativa clara y errores |
| APP-13 | Progreso local, import/export y revocación | `src/engine.ts`, `src/seniorProgress.ts` | Presente | E2E persistencia, corrupción de JSON, upgrades de schema |
| APP-14 | 36 ZIP locales + 18 ZIP Senior | `assets/labs/`, `assets/senior/` | Presentes | CRC, paridad exacta con `labs/`, extracción limpia |
| APP-15 | Tests Terraform CLI de 36 + S18 | `scripts/verify-terraform-labs.sh`, `.ps1` | **NO VERIFICADOS** sin CLI real | `fmt/init/validate/test` por escenario y logs firmados o hasheados |
| APP-16 | DevSecOps y release gate | `.github/workflows/`, `scripts/devsecops-audit.mjs` | Controles locales; CI externa no ejecutada | CI real, scan dependencias, políticas, PR checks |
| APP-17 | Privacidad/seguridad y datos sensibles | `SECURITY.md`, `src/planInspector.ts`, `src/cliEvidence.ts` | Controles locales parciales | Fuzz, amenazas, límites y revisión de datos de muestras reales |
| APP-18 | Accesibilidad AA, internacionalización futura | CSS, controles UI | Parcial | Auditoría axe/manual y controles teclado/screen reader |
| APP-19 | Documentación operativa y requisitos integrales | `README.md`, `docs/`, **este documento** | Presente al empaquetar | Inventario exacto, vínculos válidos, versión coherente |
| APP-20 | Entrega sin borrar archivos previos | `docs/BASELINE_V1_5_1_FILES.txt`, `scripts/verify-preservation.mjs` | Controles disponibles | Comparar rutas v1.6 y hash de archivos no modificados |

## 3. Identidad visual aprobada: pantalla, componentes, mascota y tokens

### 3.1. Fuente de diseño innegociable

- Archivo de referencia PNG: `assets/reference/concepto-aprobado.png`.
- Hero dark con cabecera y paneles tipo GoPixel, ilustraciones pixeladas, cards y estados de progreso.
- Colores base: púrpura/lavanda Terraform-inspirada para el aprendizaje, navy profundo para fondo, borde suave y acento cian/verde solo para resultados relevantes.
- La interfaz no debe ser una captura PNG gigante: diseñar **componentes HTML accesibles**, iconos/assets reales y texto seleccionable.
- Las 12 poses de Terra deben existir como PNG independientes en `assets/terra/` y como `terra-spritesheet.png`; nunca referenciar rutas que no estén empaquetadas.

### 3.2. Guía de Terra y ubicación de poses

| Pose PNG | Uso esperado | Regla visual |
|---|---|---|
| `hola.png` | Hero / bienvenida | Mirada amigable, no tapar CTA |
| `pensando.png` | Pistas / hipótesis | Alternativa accesible en tooltip |
| `exito.png` | PASS educativo | No usar para tests no ejecutados |
| `codificando.png` | Editor HCL | No cubrir código |
| `leyendo.png` | Guía / teoría | Alt semántico |
| `deploy.png` | Laboratorios y CI | No insinuar apply automático |
| `alerta.png` | Errores y riesgos | Acompañar con texto, no solo color |
| `descanso.png` | Pantallas vacías | No penalizar al usuario |
| `idea.png` | Conceptos / tips | Evitar animaciones distractoras |
| `arquitectura.png` | Grafo / módulos | Mantener pixel art sin difuminar |
| `senior.png` | Dashboard Senior | Insignia educativa, no certificación |
| `graduacion.png` | Capstone / logro | Celebra autoevaluación, con límites |

### 3.3. Diseño por viewport y accesibilidad

- Desktop ≥1280px: navegación lateral o superior consistente; hero en dos columnas; grid máximo 3/4 tarjetas según contexto; aula con teoría/editor/feedback sin saltos.
- Tablet ~768–1279px: paneles apilables, controles de editor visibles; no depender de hover.
- Mobile 320–767px: navegación desplegable accesible, una columna, botones ≥44px, sin scroll horizontal, editores con scroll interior y diálogos no bloqueantes.
- Estados UI: `loading`, `empty`, `ready`, `error`, `warning`, `success` y `disabled` documentados por pantalla.
- A11y: contraste WCAG AA como gate; etiquetas; aria-live para feedback; orden lógico de tabulación; focus visible; `prefers-reduced-motion`; zoom 200%; textos alternativos.
- Tema: oscuro y claro persistidos; tamaño de letra configurable. Los iconos nunca sustituyen el texto de riesgo.

## 4. Mapa de rutas y comportamiento esperado

| Ruta | Pantalla | Funciones mínimas verificables |
|---|---|---|
| `#/inicio` | Landing | Hero con mascota, niveles, KPIs reales del progreso local, CTA a siguiente lección y Senior |
| `#/aprender` | Catálogo | 36 tarjetas, búsqueda, filtros Básico/Intermedio/Avanzado, progreso y acceso a cada lección |
| `#/leccion/:id` | Aula HCL | Introducción, objetivos, ejemplo, editor, comprobaciones didácticas, quiz, ayuda, completar y descargar lab |
| `#/juegos` | Hub de juegos | Cinco juegos, instrucciones, puntuación y continuidad |
| `#/juego/:id` | Partida | Pregunta, opciones, corrección con razón y resumen, sin duplicar XP |
| `#/laboratorios` | Descargas | 36 packs + 18 Senior, instrucciones CLI y avisos de costos/seguridad |
| `#/grafo` | Explorador de grafo | Dependencias, selección de nodos, lectura de relaciones y estado vacío/error |
| `#/planes` | Inspector / Release Gate | Fixtures, import `terraform show -json`, operaciones, drift, riesgos, gate humano y export Markdown |
| `#/senior` | Senior Hub | 18 casos buscables, severidad, pilares, progreso real y capstone |
| `#/senior/:id` | Caso Senior | Cinco etapas, what-if, opciones, code review, ADR, checklist, simulador y paquete de caso |
| `#/evidencias` | CLI evidences | Import/export manifiesto sin logs, distinguir sintético / autodeclarado / verificado externamente |
| `#/progreso` | Perfil | XP, badges, 36/18, reanudar, export JSON, revocación y límites de certificación |
| `#/ajustes` | Preferencias | Tema, tamaño, movimiento reducido, activar Senior, importar/exportar/resetear |
| `#/recursos` | Biblioteca | Documentación oficial, glosario filtrable y enlaces externos con `rel=noopener` |
| rutas desconocidas | 404 accesible | Mensaje claro y acción para volver a inicio |

**Contrato de botones:** cada botón visible debe hacer algo real y comprobable o mostrarse deshabilitado con explicación. No se permiten CTA decorativos, enlaces `href="#"`, botones que aparenten ejecutar Terraform ni exports vacíos.

### 4.1. Recorrido obligatorio del alumno nuevo

1. Abre `#/inicio`, ve Terra, lee la promesa y selecciona **Empezar**.
2. Llega al catálogo y abre B01 (sin cuenta, sin nube).
3. Lee concepto y objetivo; modifica una sección del HCL en el editor.
4. Ejecuta **Comprobar ejercicio**: obtiene lista de reglas didácticas con resultado, sin afirmar CLI.
5. Responde quiz; el sistema muestra explicación aunque se equivoque.
6. Solo con reglas y quiz correctos se registra lección completada y XP **una vez**.
7. Descarga `B01.zip` y ve comandos locales; la web no ejecuta su contenido.
8. Sale y vuelve: el progreso continúa. Si cambia código/quiz a una solución inválida, se revoca su badge.
9. Exporta JSON y puede importarlo tras confirmar reemplazo de datos.

### 4.2. Recorrido Senior obligado

1. Entra `#/senior`, elige S01–S18; lee contexto, severidad, artefactos y objetivo.
2. Descarga el pack, analiza el incidente y resuelve **what-if** (opción peligrosa debe fallar con razón).
3. Toma una decisión técnica entre alternativas. Un resultado inseguro NO permite marcar completo.
4. Revisa fragmento y enfoque seguro; registra cuatro controles concretos por caso.
5. Escribe ADR con **contexto, decisión, riesgos, evidencia con `PASS/FAIL/NOT_RUN/BLOCKED` y rollback**.
6. Planea operaciones y handoff. En S18 completa los ocho hitos con notas individuales diferenciadas.
7. La autoevaluación estructural puede otorgar XP de práctica pero nunca declara validación de contenido experta o ejecución CLI.
8. Al editar decisión, what-if, checklist, notas o evidencias se reconcilia el progreso de inmediato.
9. Exporta ADR por caso y portafolio completo con procedencia explícita.

## 5. Contratos de arquitectura y módulos

### 5.1. Stack objetivo y stack realmente presente

**Objetivo aprobado:** Preact + TypeScript estricto + Vite + CodeMirror **6** + UI de tokens CSS; contenido tipado; Vitest/Testing Library o equivalente con cobertura, Playwright E2E; hosting estático, CI GitHub Actions; Terraform CLI local en laboratorios. Sin NestJS, Kubernetes ni base de datos para el MVP offline-first.

**Realidad de esta rama:** TypeScript estricto, runtime Preact ESM offline, componentes Preact en shell, catálogo y vistas Senior; ciertas vistas aún renderizan plantillas HTML. Editor CodeMirror **5** con fallback textarea. `npm run build` usa TypeScript incluido, y **no** equivale al bundle Vite especificado. El `package.json` declara Vite y Biome, pero no se debe inventar un lockfile ni decir que `npm ci` se validó.

**Criterio de cierre:** cada vista renderizada declarativamente en Preact, CodeMirror 6 operativo, rutas/estado sin pérdida, `npm ci`/Vite sobre instalación limpia, componentes testeados, E2E HTTP, assets legales y rendimiento medido. Si no hay red o CLI, marcar **NO VERIFICABLE**, no sustituir por mock.

### 5.2. Responsabilidades de archivos reales

| Módulo | Responsabilidad |
|---|---|
| `src/main.ts` | Router hash, orquestación de vistas, eventos, persistencia, feedback y exports |
| `src/uiShell.ts` | Cabecera, navegación, footer en Preact |
| `src/uiCatalog.ts` | Catálogo Preact de 36 lecciones y 8 rutas |
| `src/uiSeniorHub.ts` | Dashboard Preact de casos Senior |
| `src/uiSeniorCase.ts` | 18 pantallas Senior declarativas con tabs, what-if y ADR |
| `src/uiCliEvidence.ts` | Panel de evidencias CLI con procedencia |
| `src/curriculum.ts` | Catálogo tipado de 36 lecciones |
| `src/senior.ts` | Contrato y texto de 18 escenarios + 8 hitos |
| `src/engine.ts` | Reglas educativas HCL, estado local, XP, saneamiento |
| `src/hclLex.ts` | Lexing parcial de comentarios/cadenas para evitar falsos positivos |
| `src/seniorProgress.ts` | Reglas del gate Senior, revocación y capstone |
| `src/seniorWhatIf.ts` | Escenarios negativos y decisiones pedagógicas |
| `src/planInspector.ts` | Interpretación acotada de metadatos de Terraform plan JSON |
| `src/releaseGate.ts` | Estado BLOCKED/NEEDS_EVIDENCE/READY_FOR_HUMAN_REVIEW |
| `src/cliEvidence.ts` | Contrato y validador de manifiestos CLI sin leer logs |
| `src/editor.ts` | Editor actual y fallback; pendiente migración a CM6 |
| `scripts/server.mjs` | HTTP local seguro sin publicación de fuentes privadas |
| `scripts/build-static.mjs` | Copia estática de fuentes compiladas/recursos a `dist/` |
| `scripts/verify-terraform-labs.*` | CLI en copias temporales, logs y estados de ejecución |
| `scripts/release-audit.py` | CRC y paridad de ZIP internos; referencias críticas |
| `scripts/verify-release.py` | SHA-256 de la entrega |
| `scripts/verify-preservation.mjs` | Conservación de inventarios anteriores |
| `SECURITY.md`, `README.md`, `docs/` | Seguridad, uso, arquitectura y evidencias |

### 5.3. Persistencia y privacidad

- Fuente: `localStorage` bajo clave versionada; no hay usuario ni contraseña. Importación de JSON validada, con allowlist de IDs y límites de longitud.
- Campos mínimos: `theme`, `seniorEnabled`, `reducedMotion`, `fontScale`, `completed`, `seniorCompleted`, `quizAnswers`, `code`, `seniorEvidence`, `seniorDecisions`, `seniorDrillAnswers`, `seniorChecklist`, `gameWins`, `capstoneDone`, `capstoneEvidence`, `favorites`.
- Nunca confiar en `completed` importado por sí solo: recalcular validez de quiz, código y gate Senior.
- Export local debe explicar que código, notas o ADR pueden contener datos sensibles; no enviar backups a terceros.
- Evolución futura exige migración versionada con tests de datos antiguos y rollback.

### 5.4. Evaluación de HCL y evidencia de ejecución

- La web realiza corrección textual didáctica; puede revisar plantillas, expresiones concretas, paréntesis, comentarios, strings, y quiz.
- **No ofrece parser HCL oficial, resolución de providers, plan real ni apply.** Evitar falsos positivos por HCL comentado, heredocs o fragmentos de URL.
- CLI: ejecuciones **en copias temporales** sin modificar `labs/`, prefiriendo `terraform init -backend=false`, `fmt -check`, `validate` y `test` controlado en laboratorio local con `terraform_data`.
- Nunca ejecutar `apply`, `destroy`, `force-unlock`, `state rm` o gestión cloud desde la web; para laboratorio cloud real exigir sandbox y confirmación humana explícita.
- Los tests `.tftest.hcl` pueden crear recursos en ciertos contextos; mocks y `command = plan` reducen riesgos, no garantizan que cualquier configuración externa sea gratuita.
- Estados de evidencia: `PASS`, `FAIL`, `BLOCKED`, `NOT_RUN`; además procedencia `BROWSER_RULES`, `SYNTHETIC`, `USER_DECLARED`, `CLI_LOG_HASH` y, si se implementa, `INDEPENDENTLY_VERIFIED`.
- Un digest SHA-256 evidencia coincidencia de bytes, **no prueba identidad del ejecutor ni constituye firma criptográfica**.

### 5.5. Plan JSON y Release Gate

- Entrada permitida: JSON seleccionado por usuario, tamaño limitado, esquema acotado y límites de filas. Nunca enviar datos a API externa.
- Extraer solo dirección/acciones/sensibilidad/drift para análisis; no representar `before`, `after`, `planned_values`, `variables`, tokens ni secretos.
- Identificar `create`, `update`, `delete`, `replace`, `no-op`, acciones desconocidas y eventos `resource_drift`; un orden `delete/create` implica reemplazo y requiere revisión.
- Gate requiere procedencia commit/env/digest, owners, drift investigado, destrucción revisada, rollback y FinOps; bloquear ante acciones desconocidas o controles críticos ausentes.
- **Únicos estados del gate:** `BLOCKED`, `NEEDS_EVIDENCE`, `READY_FOR_HUMAN_REVIEW`; el último es solo punto de entrada a revisión humana, **no GO ni autorización de `apply`**.
- Export Markdown muestra metadatos saneados y hallazgos; no copiar valores secretos aunque estén en JSON de origen.

## 6. Laboratorios descargables y empaquetado IaC

### 6.1. Cada lección B/I/A debe entregar

- `labs/offline/<ID>/README.md`: prerrequisitos, objetivo, comandos, expected outputs y advertencias.
- `main.tf`: configuración específica del concepto, preferentemente `terraform_data` o funciones locales para prácticas sin cloud.
- `practice.tftest.hcl`: test correspondiente al resultado del tema, no el mismo assert genérico repetido.
- `exercise-template.tf.txt`: desafío incompleto para el estudiante.
- `solution-reference.tf.txt`: solución de referencia separada.
- `STATUS.md`: indica VALIDADO/NO EJECUTADO, proveedor, costos y límites del sandbox.
- `assets/labs/<ID>.zip`: archivo comprimido con correspondencia byte a byte a la fuente.
- La nomenclatura B01–B12 / I01–I12 / A01–A12 es estable; no omitir ninguno.

### 6.2. Cada Senior S01–S18 debe entregar

- `labs/senior/<ID>/incident.json`, contexto, evidencias sintéticas y README del caso.
- `WHAT-IF-SCENARIO.json` y `WHAT-IF-WORKSHEET.md` con variante peligrosa y variante defendible.
- `CASE-REVIEW-SHEET.md` con rúbrica específica y criterio de GO/NO-GO.
- `REVIEW-GATES.md` y demás artefactos existentes del caso: no borrarlos al regenerar.
- `assets/senior/<ID>.zip` con todos los archivos de la fuente, incluyendo subcarpetas de S18.
- S18 incluye módulo local, `.tftest.hcl`, plantillas de ocho evidencias, runbook y ADR final.

### 6.3. Runner de CLI, salida y seguridad

- Ejecutar desde copia temporal, con `TF_IN_AUTOMATION=1`, recursos sin cloud y límites de duración/CPU razonables.
- Registrar por ID versión Terraform, comando, exit code, fecha, hash del log, `PASS/FAIL/NOT_RUN/BLOCKED` y procedencia.
- Al faltar CLI, devolver estado explícito `NOT_RUN` y código de error documentado, no `PASS`.
- Nunca insertar state, planes binarios, claves, `.terraform/`, `.tfvars` con secretos o credenciales en el ZIP público.
- Comprobar paridad ZIP↔fuente y descomprimir en una carpeta limpia antes de anunciar release.

## 7. Juegos, gamificación y retroalimentación

**Cinco juegos obligatorios** (contenido real en `src/games.ts`):

1. Quiz de infraestructura: ciclo init/plan/state/seguridad, con explicación por respuesta.
2. Ordena el pipeline: formato → revisión → gates → entrega, sin autorizar apply automático.
3. Cazador de riesgos: secretos, planes, doble ownership y locking.
4. Predice el plan: leer `+`, `~`, `-/+` y valores desconocidos.
5. Arquitecto de ownership: Terraform vs GitOps, state por entorno, excepciones a policy.

**Reglas:** navegación por teclado, feedback explicativo, repetición de partidas sin duplicación artificial, puntuación coherente y almacenamiento local. Los juegos no desbloquean un resultado CLI ni certificación.

## 8. Especialidades y caminos de aprendizaje

| Itinerario | Entrada | Salida | Propósito |
|---|---|---|---|
| Fundamentos | B01 | B12 | Aprender HCL y el ciclo de Terraform |
| Módulos | I01 | I12 | Componentes reutilizables y contratos |
| Cloud seguro | A01 | A12 | Identidad, permisos y secretos |
| DevSecOps | I09 | A12 | Gates de CI, policy y auditoría |
| State & DR | B10 | A06 | Bloqueos, drift y recuperación |
| FinOps | A09 | A12 | Presupuesto y eficiencia cloud |
| Kubernetes | A10 | A11 | Ownership de infraestructura y GitOps |
| Platform Senior | S01 | S18 | Incidentes, ADR y capstone |

El catálogo debe permitir entrar al primer módulo de cada itinerario, reflejar el progreso por módulo y ofrecer itinerarios alternativos sin bloqueo artificial. No exigir AWS para completar la ruta básica.

## 9. Catálogo detallado: 36 lecciones y contratos de aceptación

**Cada entrada siguiente está respaldada por `src/curriculum.ts`, con su propio `main.tf`, test, plantilla y solución.** El HCL esperado está indicado como referencia de corrección didáctica, no como resultado Terraform CLI verificado. El formato técnico `required` del catálogo se prueba unitariamente, pero debe revisarse semánticamente al usar proveedores reales.

### 9.1. Básico — dominar el lenguaje y el ciclo IaC

#### B01 — ¿Qué es Infrastructure as Code?

- **Objetivo y resultado:** Distingue la infraestructura declarativa de una secuencia manual de operaciones.
- **Teoría obligatoria:** Terraform describe el estado deseado de la infraestructura; compara configuración y estado para proponer cambios. Un repositorio permite revisar decisiones y reproducir entornos. No reemplaza la operación, las autorizaciones ni la supervisión de recursos.
- **Práctica editable:** Distingue la infraestructura declarativa de una secuencia manual de operaciones. El alumno completa la declaración: `input = "infraestructura como codigo"`.
- **Pista contextual:** Declara el estado deseado en HCL; no escribas un script de clics.
- **Pregunta de verificación:** ¿Qué es principalmente Terraform?
- **Opciones:** A: Un orquestador de contenedores · B: Una herramienta declarativa de IaC · C: Un sistema de monitoreo. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B01/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B01.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B02 — Instalación y CLI

- **Objetivo y resultado:** Reconoce versión, init, validate y plan sin confundir sus responsabilidades.
- **Teoría obligatoria:** La CLI real se ejecuta en tu equipo, no dentro de esta web. `terraform version` comprueba la instalación; `init` prepara plugins y backend; `validate` revisa la configuración; `plan` compara el estado conocido con el código. Los resultados web son solamente verificaciones educativas.
- **Práctica editable:** Reconoce versión, init, validate y plan sin confundir sus responsabilidades. El alumno completa la declaración: `required_version = ">= 1.6.0"`.
- **Pista contextual:** Anota una restricción explícita de versión y recuerda ejecutar init localmente.
- **Pregunta de verificación:** ¿Qué comando prepara los proveedores del módulo?
- **Opciones:** A: terraform plan · B: terraform init · C: terraform output. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B02/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B02.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B03 — Sintaxis HCL

- **Objetivo y resultado:** Aprende bloques, argumentos, expresiones y comentarios en HCL.
- **Teoría obligatoria:** HCL separa bloques y argumentos. Los bloques pueden tener etiquetas y un cuerpo `{}`; las expresiones producen valores. Las referencias entre recursos son expresiones, no textos con nombres copiados. Usa terraform fmt para un formato consistente.
- **Práctica editable:** Aprende bloques, argumentos, expresiones y comentarios en HCL. El alumno completa la declaración: `region = "us-east-1"`.
- **Pista contextual:** Usa `local.region`, no `locals.region`.
- **Pregunta de verificación:** ¿Cómo accedes a un local llamado region?
- **Opciones:** A: var.region · B: local.region · C: locals.region. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B03/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B03.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B04 — Tu primer recurso

- **Objetivo y resultado:** Construye un recurso terraform_data y expón su resultado.
- **Teoría obligatoria:** El recurso incorporado `terraform_data` permite practicar el ciclo de vida sin configurar un proveedor cloud. `output` expone valores resultantes y puede estar desconocido antes del primer apply. El motor web solo verifica reglas; para probar de verdad utiliza el pack local.
- **Práctica editable:** Construye un recurso terraform_data y expón su resultado. El alumno completa la declaración: `input = "Hola, Terraform"`.
- **Pista contextual:** Inserta input dentro de terraform_data.demo, respetando el output existente.
- **Pregunta de verificación:** ¿Dónde corre Terraform CLI real en esta entrega?
- **Opciones:** A: En el navegador · B: En el equipo del alumno o CI · C: En una Lambda oculta. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B04/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B04.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B05 — Variables y tipos

- **Objetivo y resultado:** Parametriza una configuración con variable, tipo y default.
- **Teoría obligatoria:** Las variables declaran una interfaz de entrada para el módulo. Los tipos previenen usos incorrectos y los defaults son opcionales. Nunca guardes credenciales en archivos `.tfvars` que subas a Git.
- **Práctica editable:** Parametriza una configuración con variable, tipo y default. El alumno completa la declaración: `type = string`.
- **Pista contextual:** Declara el tipo `string` en el bloque variable.
- **Pregunta de verificación:** ¿Cómo referencias una variable de entrada?
- **Opciones:** A: var.ambiente · B: local.ambiente · C: input.ambiente. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B05/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B05.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B06 — Locals y outputs

- **Objetivo y resultado:** Reutiliza expresiones sin repetir valores y publica salidas seguras.
- **Teoría obligatoria:** Los valores locales simplifican expresiones derivadas; los outputs sirven como interfaz para consumidores y CLI. Las salidas sensibles requieren protección real del estado, no solo ocultarlas visualmente.
- **Práctica editable:** Reutiliza expresiones sin repetir valores y publica salidas seguras. El alumno completa la declaración: `nombre = "${var.proyecto}-dev"`.
- **Pista contextual:** Usa una interpolación para derivar el nombre.
- **Pregunta de verificación:** ¿Cuál es la referencia a un local?
- **Opciones:** A: locals.nombre · B: local.nombre · C: output.nombre. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B06/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B06.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B07 — Grafo de dependencias

- **Objetivo y resultado:** Identifica el orden implícito a partir de referencias.
- **Teoría obligatoria:** Terraform construye un grafo de dependencias; si `consumer` referencia `source.output`, se crea una arista implícita. `depends_on` se reserva para relaciones ocultas, no para ordenar arbitrariamente todos los recursos.
- **Práctica editable:** Identifica el orden implícito a partir de referencias. El alumno completa la declaración: `input = terraform_data.source.output`.
- **Pista contextual:** Conecta `consumer` con `source` por referencia, no por posición.
- **Pregunta de verificación:** ¿Qué define la dependencia implícita?
- **Opciones:** A: Una referencia de valor · B: El nombre del archivo · C: El orden de las líneas. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B07/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B07.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B08 — Init, fmt y validate

- **Objetivo y resultado:** Diferencia preparación, formato y comprobación estática.
- **Teoría obligatoria:** El ciclo recomendado empieza con `terraform fmt -check` y `terraform init -backend=false` para ejercicios seguros, seguido de `terraform validate`. Validate verifica sintaxis y consistencia interna; no demuestra permisos cloud ni un plan real.
- **Práctica editable:** Diferencia preparación, formato y comprobación estática. El alumno completa la declaración: `input = "configuracion preparada"`.
- **Pista contextual:** El recurso de práctica debe tener input y permanecer válido como HCL.
- **Pregunta de verificación:** ¿Qué afirmación es válida?
- **Opciones:** A: validate desplegó la red · B: fmt ejecutó recursos · C: validate comprueba configuración, no recursos cloud. **Clave didáctica:** C. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B08/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B08.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B09 — Plan, apply y destroy

- **Objetivo y resultado:** Lee operaciones de un plan antes de autorizar cambios.
- **Teoría obligatoria:** Plan muestra cambios propuestos: `+` crear, `~` actualizar, `-` eliminar, `-/+` reemplazar. Apply ejecuta cambios reales; destroy solicita destrucción. En esta academia los planes se muestran como fixtures etiquetados; no hay ejecuciones cloud desde el navegador.
- **Práctica editable:** Lee operaciones de un plan antes de autorizar cambios. El alumno completa la declaración: `prevent_destroy = true`.
- **Pista contextual:** Protege este recurso ficticio de un borrado accidental.
- **Pregunta de verificación:** ¿Qué indica habitualmente -/+ en un plan?
- **Opciones:** A: Reemplazo · B: Actualización en sitio · C: Sin cambios. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B09/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B09.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B10 — Terraform state y secretos

- **Objetivo y resultado:** Comprende qué guarda state y cómo protegerlo.
- **Teoría obligatoria:** El archivo de estado registra objetos y atributos necesarios para la reconciliación. Puede contener datos sensibles. Debe tener acceso mínimo, cifrado, respaldo y nunca publicarse en Git; `sensitive = true` no borra valores del estado.
- **Práctica editable:** Comprende qué guarda state y cómo protegerlo. El alumno completa la declaración: `sensitive = true`.
- **Pista contextual:** Marca el dato de ejemplo como sensible y protege el estado por separado.
- **Pregunta de verificación:** ¿Qué ocurre con un valor sensitive?
- **Opciones:** A: No puede aparecer en state · B: Se oculta en ciertas vistas, pero puede persistir en state · C: Se cifra automáticamente en todos los destinos. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B10/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B10.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B11 — Count, for_each y lifecycle

- **Objetivo y resultado:** Elige direcciones estables y evalúa reemplazos.
- **Teoría obligatoria:** Con `count` se indexa por posiciones; con `for_each` por claves. Cambiar la identidad de una clave puede provocar reemplazos, por eso los refactors requieren inspección de plan y, cuando corresponda, bloques `moved`.
- **Práctica editable:** Elige direcciones estables y evalúa reemplazos. El alumno completa la declaración: `for_each = local.entornos`.
- **Pista contextual:** La identidad debe estar basada en nombres, no índices cambiantes.
- **Pregunta de verificación:** ¿Qué dirección sería más estable ante reordenar una lista?
- **Opciones:** A: count.index · B: for_each con claves estables · C: Ninguna dirección. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B11/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B11.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

#### B12 — Proyecto final básico

- **Objetivo y resultado:** Integra recursos, variables, outputs y pruebas locales.
- **Teoría obligatoria:** Un módulo root claro separa entrada, recursos y salida. Para completar el nivel básico diseña una configuración sin proveedor cloud y ejecuta localmente fmt/init/validate/test cuando tengas Terraform CLI instalado.
- **Práctica editable:** Integra recursos, variables, outputs y pruebas locales. El alumno completa la declaración: `input = var.equipo`.
- **Pista contextual:** Conecta entrada, recurso y salida; luego descarga el pack y prueba localmente.
- **Pregunta de verificación:** ¿Qué es una evidencia válida de test real?
- **Opciones:** A: Una captura inventada · B: Salida de terraform test ejecutada localmente · C: Que el editor muestre verde. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/B12/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/B12.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 100 se suma solo al completar código y quiz.

### 9.2. Intermedio — modularidad y operación repetible

#### I01 — Diseño de módulos

- **Objetivo y resultado:** Define contratos y límites claros en módulos reutilizables.
- **Teoría obligatoria:** Los módulos son unidades de reutilización con variables y outputs. Evita que un módulo gestione recursos de otro equipo; mantén interfaces estables, documentación y ejemplos pequeños. Terraform no exige una capa de módulos para cada recurso.
- **Práctica editable:** Define contratos y límites claros en módulos reutilizables. El alumno completa la declaración: `input = var.nombre`.
- **Pista contextual:** Trata variables y outputs como API pública de tu módulo.
- **Pregunta de verificación:** ¿Cuál es un buen límite de módulo?
- **Opciones:** A: Un contrato estable con dueño claro · B: Toda la nube en un solo módulo · C: Un módulo por cada atributo. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I01/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I01.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I02 — Versiones y lockfile

- **Objetivo y resultado:** Controla upgrades y reproducibilidad.
- **Teoría obligatoria:** Fija la versión mínima de Terraform y un rango razonable de provider; el lockfile fija una selección y sus checksums. Revisa los cambios de `.terraform.lock.hcl` en PR. Actualiza de forma consciente y prueba planes antes de producción.
- **Práctica editable:** Controla upgrades y reproducibilidad. El alumno completa la declaración: `version = "~> 2.5"`.
- **Pista contextual:** Controla el rango del provider, nunca introduzcas un upgrade libre sin revisar.
- **Pregunta de verificación:** ¿Qué aporta .terraform.lock.hcl?
- **Opciones:** A: Una instantánea de selección y checksums de providers · B: Cifrado del estado · C: Tokens cloud. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I02/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I02.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I03 — Data sources y referencias

- **Objetivo y resultado:** Diferencia consultar recursos existentes y gestionarlos.
- **Teoría obligatoria:** Los bloques `data` consultan información de objetos existentes; `resource` declara objetos que Terraform gestiona. La procedencia y la propiedad de cada recurso deben ser explícitas para evitar que dos stacks intenten controlarlo.
- **Práctica editable:** Diferencia consultar recursos existentes y gestionarlos. El alumno completa la declaración: `input = terraform_data.origen.output`.
- **Pista contextual:** La práctica usa referencias locales sin proveedores para ilustrar flujos de datos.
- **Pregunta de verificación:** ¿Qué representa un data source?
- **Opciones:** A: Recurso siempre creado · B: Consulta externa de datos · C: Un estado de backend. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I03/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I03.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I04 — Direcciones y moved blocks

- **Objetivo y resultado:** Planifica refactors de direcciones sin recrear recursos.
- **Teoría obligatoria:** Un `moved` permite declarar un traslado de dirección de estado sin improvisar `state mv`. Debes revisar el plan resultante y confirmar el tipo e identidad. No implica que toda modificación sea segura.
- **Práctica editable:** Planifica refactors de direcciones sin recrear recursos. El alumno completa la declaración: `to   = terraform_data.nuevo`.
- **Pista contextual:** Asegúrate de que from y to sean direcciones de recursos válidas.
- **Pregunta de verificación:** ¿Para qué sirve moved?
- **Opciones:** A: Señalar un cambio de dirección administrada · B: Mover ficheros en disco · C: Cifrar variables. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I04/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I04.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I05 — Lectura profesional de planes

- **Objetivo y resultado:** Identifica acciones destructivas y prioridades de revisión.
- **Teoría obligatoria:** Un plan requiere lectura del diff, sustituciones, atributos marcados sensitive, blast radius y contexto del servicio. Las salidas desconocidas `(known after apply)` no son fallos. No se aprueba por el número de líneas únicamente.
- **Práctica editable:** Identifica acciones destructivas y prioridades de revisión. El alumno completa la declaración: `prevent_destroy = true`.
- **Pista contextual:** Usa lifecycle como guarda educativa y evalúa el plan completo.
- **Pregunta de verificación:** ¿Qué cambio merece revisión especial?
- **Opciones:** A: No-op · B: Reemplazo de un componente crítico · C: Cambio de comentario. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I05/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I05.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I06 — Remote state y locking

- **Objetivo y resultado:** Diseña aislamiento de estado y bloqueo entre escritores.
- **Teoría obligatoria:** Backends remotos permiten colaboración, pero requieren permisos limitados, acceso auditado, cifrado y backups. S3 admite `use_lockfile`; no publiques un backend real con bucket inventado como si estuviera aprovisionado.
- **Práctica editable:** Diseña aislamiento de estado y bloqueo entre escritores. El alumno completa la declaración: `use_lockfile = true`.
- **Pista contextual:** El archivo de bloqueo depende de permisos correctos y backend configurado.
- **Pregunta de verificación:** ¿Qué evita el bloqueo de estado?
- **Opciones:** A: Cualquier drift cloud · B: Escritores concurrentes sobre el mismo estado · C: Todo costo cloud. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I06/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I06.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I07 — Entornos y capas

- **Objetivo y resultado:** Separa propietarios y estados según el riesgo.
- **Teoría obligatoria:** Organiza capas por responsabilidad, frecuencia de cambio y blast radius. `development`, `staging` y `production` deben tener protección e identidades apropiadas; evitar un estado gigantesco simplifica recuperación y revisiones.
- **Práctica editable:** Separa propietarios y estados según el riesgo. El alumno completa la declaración: `condition = contains(["dev", "staging", "prod"], var.environment)`.
- **Pista contextual:** Declara qué entornos son aceptados en la variable.
- **Pregunta de verificación:** ¿Por qué separar estados?
- **Opciones:** A: Para ampliar el blast radius · B: Para aislar ownership y riesgo · C: Para ignorar CI. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I07/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I07.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I08 — Outputs entre módulos

- **Objetivo y resultado:** Diseña contratos entre stacks sin acoplamiento invisible.
- **Teoría obligatoria:** Los outputs exponen identificadores necesarios para otros módulos. Prefiere interfaces con propiedad explícita y valores mínimos; no conviertas los outputs en un volcadero de secretos. Documenta cambios incompatibles.
- **Práctica editable:** Diseña contratos entre stacks sin acoplamiento invisible. El alumno completa la declaración: `value = terraform_data.red.id`.
- **Pista contextual:** Publica solo datos que el consumidor necesita.
- **Pregunta de verificación:** ¿Qué debe exponer un output de módulo?
- **Opciones:** A: Todos los secretos · B: Solo el contrato necesario · C: Estado completo. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I08/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I08.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I09 — Terraform test y mocks

- **Objetivo y resultado:** Separa unit tests, mocks y pruebas de integración.
- **Teoría obligatoria:** Los tests `.tftest.hcl` pueden ejecutar `plan` y `apply`; con mocks evitan contactos reales para providers soportados. Un mock verde demuestra lógica declarada, no permisos ni comportamiento de API. Usa runners y sandboxes limitados.
- **Práctica editable:** Separa unit tests, mocks y pruebas de integración. El alumno completa la declaración: `input = "seguro"`.
- **Pista contextual:** Descarga el lab local para ver un archivo .tftest.hcl.
- **Pregunta de verificación:** ¿Qué demuestra un mock_provider PASS?
- **Opciones:** A: Integración real con la nube · B: Solo el comportamiento cubierto por el mock · C: Un despliegue listo para producción. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I09/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I09.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I10 — Lint, scanning y policy

- **Objetivo y resultado:** Distingue reglas de estilo y controles de seguridad.
- **Teoría obligatoria:** Fmt revisa estilo, validate estructura, linters patrones y policy evalúa contratos. Una advertencia nunca se resuelve suprimiéndola indiscriminadamente; presenta owner, severidad, evidencia y excepción acotada cuando aplique.
- **Práctica editable:** Distingue reglas de estilo y controles de seguridad. El alumno completa la declaración: `condition = length(trimspace(var.owner)) > 0`.
- **Pista contextual:** Declara un control positivo sobre el owner del recurso.
- **Pregunta de verificación:** ¿Qué hacer ante un hallazgo HIGH?
- **Opciones:** A: Ignorarlo globalmente · B: Evaluar, corregir o gestionar excepción acotada · C: Ocultar el reporte. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I10/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I10.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I11 — Pipeline de pull requests

- **Objetivo y resultado:** Define gates y separación de planificación y despliegue.
- **Teoría obligatoria:** Una PR debe ejecutar fmt, validate, tests seguros y revisión de planes con permisos mínimos. El apply real requiere contexto autorizado, aprobado y revisión del plan final. Los binarios de plan pueden contener secretos.
- **Práctica editable:** Define gates y separación de planificación y despliegue. El alumno completa la declaración: `default = false`.
- **Pista contextual:** Un switch de aprobación no reemplaza un gate de CI real; aprende a distinguirlos.
- **Pregunta de verificación:** ¿Cuál es una práctica segura?
- **Opciones:** A: Aplicar desde cualquier PR · B: Aprobar un plan y aplicar otro silenciosamente · C: Aplicar un plan final autorizado en entorno protegido. **Clave didáctica:** C. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I11/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I11.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

#### I12 — Proyecto de módulo reusable

- **Objetivo y resultado:** Empaqueta un contrato comprobable sin cloud.
- **Teoría obligatoria:** Combina variables tipadas, documentación, outputs y tests de plan. La práctica local usa `terraform_data` para demostrar composición. En producción necesitarías validar los providers reales y las pruebas de integración.
- **Práctica editable:** Empaqueta un contrato comprobable sin cloud. El alumno completa la declaración: `input = "service-${var.service}"`.
- **Pista contextual:** Guarda el módulo con su test local y revisa la interfaz pública.
- **Pregunta de verificación:** ¿Qué vuelve reutilizable un módulo?
- **Opciones:** A: Interfaces documentadas y tests · B: Un único entorno hardcoded · C: Claves de acceso embebidas. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/I12/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/I12.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 140 se suma solo al completar código y quiz.

### 9.3. Avanzado — cloud, controles y plataforma

#### A01 — Importación y refactors

- **Objetivo y resultado:** Planifica importar sin destruir infraestructura existente.
- **Teoría obligatoria:** Los bloques `import` expresan la intención de asociar un objeto existente con una dirección de estado. Primero confirma ownership, permisos, identidad y plan de recuperación; un import no corrige automáticamente la configuración.
- **Práctica editable:** Planifica importar sin destruir infraestructura existente. El alumno completa la declaración: `to = aws_s3_bucket.existente`.
- **Pista contextual:** La sintaxis se estudia con un ejemplo: no se ejecuta en la web.
- **Pregunta de verificación:** ¿Qué ocurre antes de importar un recurso?
- **Opciones:** A: Validar identidad y propiedad · B: Borrar el estado · C: Aplicar sin revisión. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A01/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A01.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A02 — Migración de backends

- **Objetivo y resultado:** Prepara backup, ventana de cambio y rollback.
- **Teoría obligatoria:** Una migración de estado es una operación de alto riesgo. Congela escritores, verifica backups y acceso de destino, ejecuta el proceso de migración desde un contexto autorizado y vuelve a comprobar inventario y recursos.
- **Práctica editable:** Prepara backup, ventana de cambio y rollback. El alumno completa la declaración: `key = "prod/app/terraform.tfstate"`.
- **Pista contextual:** Pon una clave de estado aislada para producción.
- **Pregunta de verificación:** ¿Qué debe ocurrir ANTES de migrate-state?
- **Opciones:** A: Backup y freeze de escritores · B: Force-unlock por costumbre · C: Eliminar el backend anterior. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A02/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A02.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A03 — Secretos y valores ephemeral

- **Objetivo y resultado:** Evalúa exposición en estado, planes y logs.
- **Teoría obligatoria:** `sensitive` puede ocultar ciertos valores de salidas, pero no equivale a sacarlos del estado. Las variables y outputs `ephemeral`, cuando el soporte y contexto aplican, evitan persistir ciertos valores; hay restricciones de uso. Nunca publiques secretos reales.
- **Práctica editable:** Evalúa exposición en estado, planes y logs. El alumno completa la declaración: `ephemeral = true`.
- **Pista contextual:** Contrasta sensibilidad visual y persistencia con el atributo ephemeral.
- **Pregunta de verificación:** ¿Qué garantiza sensitive=true por sí solo?
- **Opciones:** A: Excluir del state · B: Ocultar ciertas presentaciones, no excluir state · C: Rotar automáticamente el token. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A03/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A03.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A04 — IAM mínimo y OIDC

- **Objetivo y resultado:** Modela federación y permisos de despliegue por entorno.
- **Teoría obligatoria:** OIDC permite credenciales temporales mediante identidad de workload; una política de confianza acota repositorio, rama y ambiente. Los secretos estáticos y permisos `*` amplios son riesgos. Esta lección no establece roles AWS reales.
- **Práctica editable:** Modela federación y permisos de despliegue por entorno. El alumno completa la declaración: `condition = contains(["staging", "prod"], var.entorno_autorizado)`.
- **Pista contextual:** Especifica qué entornos puede elegir el pipeline.
- **Pregunta de verificación:** ¿Qué reduce riesgo de CI cloud?
- **Opciones:** A: Credenciales estáticas compartidas · B: OIDC con trust limitado y entorno protegido · C: Permisos administrador por defecto. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A04/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A04.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A05 — Redes y rangos CIDR

- **Objetivo y resultado:** Razona sobre redes sin solapamientos.
- **Teoría obligatoria:** Los bloques CIDR describen rangos de direcciones; dos redes conectadas con bloques solapados generan conflictos. El ejercicio muestra una función `cidrsubnet` sobre ejemplos ficticios; no se crean VPC reales.
- **Práctica editable:** Razona sobre redes sin solapamientos. El alumno completa la declaración: `subred_privada = cidrsubnet(var.red, 8, 1)`.
- **Pista contextual:** Utiliza un número de subred diferente para la privada.
- **Pregunta de verificación:** ¿Cuál es un riesgo de CIDR superpuesto?
- **Opciones:** A: Enrutamiento ambiguo · B: Menor costo de logs · C: Bloqueo de state automático. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A05/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A05.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A06 — Drift y reconciliación

- **Objetivo y resultado:** Diferencia Git, estado y realidad de infraestructura.
- **Teoría obligatoria:** Drift sucede cuando la infraestructura cambia fuera de la configuración y Terraform detecta diferencias. No siempre se soluciona aplicando automáticamente: investiga la intención del cambio, la seguridad y el estado real antes de reconciliar.
- **Práctica editable:** Diferencia Git, estado y realidad de infraestructura. El alumno completa la declaración: `prevent_destroy = true`.
- **Pista contextual:** Protege el baseline de ejemplo y prepara un plan de reconciliación.
- **Pregunta de verificación:** ¿Cuál es el primer paso ante drift crítico?
- **Opciones:** A: Aplicar sin revisar · B: Identificar la causa y evaluar impacto · C: Borrar recursos. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A06/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A06.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A07 — Reemplazo y disponibilidad

- **Objetivo y resultado:** Evalúa lifecycle, provider y costos temporales.
- **Teoría obligatoria:** Un reemplazo puede causar pérdida de disponibilidad, doble consumo o incompatibilidad de nombres únicos. `create_before_destroy` es útil en ciertos recursos pero no garantiza éxito: comprueba restricciones y capacidad, no actives a ciegas.
- **Práctica editable:** Evalúa lifecycle, provider y costos temporales. El alumno completa la declaración: `create_before_destroy = true`.
- **Pista contextual:** Declara la intención y explica sus límites en la decisión.
- **Pregunta de verificación:** ¿Qué debes verificar antes de create_before_destroy?
- **Opciones:** A: Nada: siempre funciona · B: Cuotas, nombres únicos y dependencias · C: Solo el color del dashboard. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A07/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A07.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A08 — Policy as Code

- **Objetivo y resultado:** Escribe controles y excepciones auditables.
- **Teoría obligatoria:** Una política aplicada a IaC debe tener tests positivos y negativos; las excepciones necesitan owner, motivo y caducidad. La función de condición ejemplifica validación local, no la ejecución de OPA/Conftest.
- **Práctica editable:** Escribe controles y excepciones auditables. El alumno completa la declaración: `condition = length(trimspace(var.cost_center)) >= 3`.
- **Pista contextual:** Elabora un control simple y revisable sobre CostCenter.
- **Pregunta de verificación:** ¿Qué evidencia acompaña una excepción?
- **Opciones:** A: Owner y expiración · B: Un emoji · C: Ninguna evidencia. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A08/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A08.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A09 — FinOps para Terraform

- **Objetivo y resultado:** Evalúa incrementos de costo y trade-offs de disponibilidad.
- **Teoría obligatoria:** Infracost estima diferencias; no es la factura definitiva. Un cambio de tamaño, región o cantidad puede disparar costos. Aplica presupuestos, tags, evaluación de fiabilidad y seguimiento después del despliegue.
- **Práctica editable:** Evalúa incrementos de costo y trade-offs de disponibilidad. El alumno completa la declaración: `condition = var.replicas >= 1 && var.replicas <= 5`.
- **Pista contextual:** Controla límites y el número permitido de réplicas.
- **Pregunta de verificación:** ¿Qué representa un costo Infracost?
- **Opciones:** A: Una estimación para revisión · B: El total garantizado de factura · C: Un test de seguridad. **Clave didáctica:** A. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A09/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A09.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A10 — AWS multiambiente

- **Objetivo y resultado:** Diseña cuentas, estados y acceso separados para dev/staging/prod.
- **Teoría obligatoria:** Un diseño serio evita compartir la misma identidad para todos los entornos. Separa cuentas o boundaries adecuados, states versionados y reglas de aprobación. El ejemplo es un contrato local; no aprovisiona cuentas AWS.
- **Práctica editable:** Diseña cuentas, estados y acceso separados para dev/staging/prod. El alumno completa la declaración: `namespace = "app-${var.entorno}"`.
- **Pista contextual:** Deriva nombres consistentes sin mezclar propiedad de entornos.
- **Pregunta de verificación:** ¿Cómo protegerías producción?
- **Opciones:** A: Mismo state y permisos que dev · B: State e identidad aislados y aprobación · C: Llaves en README. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A10/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A10.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A11 — Terraform, Helm y GitOps

- **Objetivo y resultado:** Establece límites de ownership con Kubernetes.
- **Teoría obligatoria:** Terraform puede administrar la infraestructura del cluster y algunos servicios base; Helm/Argo CD suelen administrar despliegues de workloads. Dos controladores propietarios del mismo recurso pueden producir guerras de reconciliación.
- **Práctica editable:** Establece límites de ownership con Kubernetes. El alumno completa la declaración: `input = "workloads-managed-by-${var.owner}"`.
- **Pista contextual:** Declara el handoff sin intentar gestionar los mismos workloads dos veces.
- **Pregunta de verificación:** ¿Qué evita drift entre Terraform y GitOps?
- **Opciones:** A: Doble ownership · B: Contrato de ownership explícito · C: Apply continuo de ambos. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A11/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A11.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

#### A12 — Proyecto avanzado

- **Objetivo y resultado:** Diseña un servicio auditable con seguridad, costo y plan de recuperación.
- **Teoría obligatoria:** La entrega senior exige más que sintaxis: separación de estados, pruebas, control de identidades, revisión de plan, FinOps y rollback. Construye un artefacto pequeño, explícito y reproducible antes de saltar a un cloud real.
- **Práctica editable:** Diseña un servicio auditable con seguridad, costo y plan de recuperación. El alumno completa la declaración: `prevent_destroy = true`.
- **Pista contextual:** Agrega guardas y prepara evidencias concretas de tests locales.
- **Pregunta de verificación:** ¿Qué impide declarar este proyecto production ready?
- **Opciones:** A: Falta de una captura · B: No haber probado providers ni plan cloud real · C: Usar TypeScript en UI. **Clave didáctica:** B. Al responder incorrectamente debe explicarse el porqué y permitir reintentar.
- **Archivos exigidos:** `labs/offline/A12/main.tf`, `practice.tftest.hcl`, `README.md`, `STATUS.md`, `exercise-template.tf.txt`, `solution-reference.tf.txt`, `assets/labs/A12.zip`.
- **Aceptación específica:** solución del catálogo supera las reglas del navegador; plantilla incompleta falla; test CLI del tema pasa en sandbox autorizado; descarga sin pérdida; XP 180 se suma solo al completar código y quiz.

## 10. Senior Mode: definición de competencia y fases globales

**Senior Mode NO es un modo visual con una corona.** Debe entrenar diagnóstico de producción, decisiones con tradeoffs, hipótesis falsables, pruebas negativas, defensas contra regresiones, documentación, comunicación y recuperación. **No sirve una sola respuesta correcta sin ADR y pruebas de contexto.**

**Las cinco etapas obligatorias de cada caso:** (1) INVESTIGAR — leer incidente y artifacts; (2) DECIDIR — elegir la acción segura; (3) REVIEW — código/arquitectura, alternativa segura, cuatro controles; (4) EVIDENCIA — ADR estructurado con procedencia; (5) OPERACIONES — runbook, rollback, handoff y observación. Además, un what-if por caso debe poder responderse y corregirse.

**Criterio educativo mínimo para completar cada caso:** decisión correcta; what-if correcto; cuatro controles específicos registrados; ADR ≥120 caracteres con contexto/diagnóstico, decisión, riesgos, evidencia `PASS/FAIL/NOT_RUN/BLOCKED` y rollback; y, en S18, ocho hitos con notas individuales. Un estado se revoca inmediatamente si se invalidan datos. **La app no debe evaluar automáticamente si el razonamiento técnico escrito es cierto**; eso requiere revisión humana.

### 10.1. Catálogo Senior integral y criterios caso a caso

#### S01 — Reemplazo destructivo por refactor de `for_each`

- **Contexto:** Contexto: un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar direcciones Terraform.
- **Misión técnica:** señalar recursos afectados, bloquear el apply, evaluar `moved` y documentar un procedimiento de migración de direcciones.
- **Artefactos necesarios:** `main-before.tf`, `main-after.tf`, fixture de plan con `delete/create`, mapa de recursos y restricciones de disponibilidad.
- **Antipatrón que debe fallar:** alternativa «aplicar y recrear» falla por requisito de continuidad; `moved` incorrecto no debe aprobar.
- **Evidencia exigida:** lista de direcciones afectadas, decisión de bloquear, plan de cambios sin destrucción no aprobada, ADR corto.
- **Modalidad de ejercicio:** grafo + plan simulado + laboratorio descargable opcional con `moved`.
- **Severidad y dominio:** Crítico / State; **XP didáctico:** 300.
- **Decisión evaluable:** A: Aplicar con -auto-approve / B: Inspeccionar direcciones, declarar moved cuando corresponda y revisar plan / C: Borrar todo el estado. **Clave didáctica:** B.
- **Fundamento de corrección:** La identidad de recursos y el plan deben revisarse antes de cualquier cambio destructivo.
- **Cuatro controles particulares de revisión:**
  1. Identifiqué las direcciones old_key/new_key y los recursos que podrían reemplazarse.
  2. Comprobé cuándo moved conserva identidad y cuándo la migración no es segura.
  3. Exigí revisar plan sin delete/create inesperados y registrar NOT_RUN si no se ejecutó.
  4. Definí ventana de cambio, owner de state y reversión antes del apply.
- **Entregables y gate:** paquete `assets/senior/S01.zip`, `labs/senior/S01/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S02 — Lock concurrente de state

- **Contexto:** Contexto: dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.
- **Misión técnica:** evitar ejecuciones simultáneas, decidir cuándo esperar, cancelar/replanificar o investigar un lock sospechoso.
- **Artefactos necesarios:** timeline de jobs, IDs de operación ficticios, logs saneados de locking, topología backend.
- **Antipatrón que debe fallar:** desbloquear a la fuerza sin investigación debe fallar; segunda operación no puede considerarse segura mientras otra escribe.
- **Evidencia exigida:** runbook de concurrencia, ownership del estado, autorización dual si se propone `force-unlock`.
- **Modalidad de ejercicio:** simulación determinista; **nunca** ejecutar desbloqueo real desde la web.
- **Severidad y dominio:** Alto / State; **XP didáctico:** 300.
- **Decisión evaluable:** A: Usar -lock=false de forma habitual / B: Detener escritores, identificar lock activo y operar con una ventana autorizada / C: Copiar manualmente terraform.tfstate. **Clave didáctica:** B.
- **Fundamento de corrección:** Un bloqueo protege contra escrituras concurrentes; desbloquear exige prueba y owner.
- **Cuatro controles particulares de revisión:**
  1. Identifiqué al escritor propietario y el lock ID sin divulgar secretos.
  2. Impedí lock=false y force-unlock prematuro ante escrituras concurrentes.
  3. Diseñé verificación del backend y timeout de espera con resultados NOT_RUN si aplica.
  4. Establecí autorización dual y recuperación si el lock resulta huérfano.
- **Entregables y gate:** paquete `assets/senior/S02.zip`, `labs/senior/S02/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S03 — Drift fuera de banda

- **Contexto:** Contexto: alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.
- **Misión técnica:** identificar la desviación, evaluar impacto y elegir reconciliar Git o revertir el cambio externo.
- **Artefactos necesarios:** `desired.tf`, representación de estado lógico saneado, snapshot cloud ficticio, plan/timeline.
- **Antipatrón que debe fallar:** «aceptar todo lo que está en cloud» falla si viola política; no toda deriva autoriza `apply` inmediato.
- **Evidencia exigida:** causa probable, blast radius, decisión, responsable y monitoreo posterior.
- **Modalidad de ejercicio:** diff triple y decisión de incidente.
- **Severidad y dominio:** Alto / Drift; **XP didáctico:** 300.
- **Decisión evaluable:** A: Investigar diferencias y decidir reconciliación / B: Aplicar sin leer el plan / C: Editar el state hasta que coincida. **Clave didáctica:** A.
- **Fundamento de corrección:** El drift exige comparar configuración, estado e infraestructura real y encontrar la causa.
- **Cuatro controles particulares de revisión:**
  1. Comparé configuración HCL, state y observación remota sin confundir fuentes.
  2. Evalué si la modificación fuera de banda requiere adoptar o revertir el cambio.
  3. Propuse refresh/plan controlado con snapshot y procedencia explícita.
  4. Documenté propietario, ventana y vigilancia posterior de drift.
- **Entregables y gate:** paquete `assets/senior/S03.zip`, `labs/senior/S03/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S04 — Destrucción de recurso crítico

- **Contexto:** Contexto: un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.
- **Misión técnica:** clasificar criticidad, bloquear el apply, investigar dependencias, proponer mitigación.
- **Artefactos necesarios:** plan fixture crítico, etiquetas de entorno y clase de datos, política de backups.
- **Antipatrón que debe fallar:** «aprobar porque el HCL compila» falla; ignorar state y backups falla.
- **Evidencia exigida:** decisión «NO GO», protecciones, aprobación formal y plan de rollback/recovery.
- **Modalidad de ejercicio:** plan review + control de cambios.
- **Severidad y dominio:** Crítico / Seguridad; **XP didáctico:** 300.
- **Decisión evaluable:** A: Borrar y reconstruir ahora / B: Ignorar cualquier delete en plan / C: Bloquear el despliegue, evaluar impacto, backup y estrategia de cambio. **Clave didáctica:** C.
- **Fundamento de corrección:** Los cambios destructivos de recursos críticos requieren un control de disponibilidad.
- **Cuatro controles particulares de revisión:**
  1. Clasifiqué criticidad del recurso y volumen de datos potencialmente eliminado.
  2. Bloqueé cambios destroy/replace hasta acreditar dependencias y recuperación.
  3. Exigí backup/snapshot verificable y prueba de restore documentada.
  4. Definí aprobación, punto de parada y runbook de recuperación.
- **Entregables y gate:** paquete `assets/senior/S04.zip`, `labs/senior/S04/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S05 — Migración de backend de estado

- **Contexto:** Contexto: se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.
- **Misión técnica:** preparar respaldo, congelar writers, verificar destino y explicar `init -migrate-state` en contexto autorizado.
- **Artefactos necesarios:** dos topologías, inventario de states, plantilla `backend "s3"` ilustrativa, checklist de migración.
- **Antipatrón que debe fallar:** migración sin backup o con escrituras concurrentes debe bloquearse; no asumir éxito por solo cambiar HCL.
- **Evidencia exigida:** runbook, responsables, preflight, verificación de state y rollback.
- **Modalidad de ejercicio:** laboratorio de decisiones; integración real únicamente en sandbox autorizado.
- **Severidad y dominio:** Crítico / State; **XP didáctico:** 300.
- **Decisión evaluable:** A: Migrar sin respaldo / B: Congelar escritores, respaldar, validar destino y verificar migración / C: Cambiar la key y suponer éxito. **Clave didáctica:** B.
- **Fundamento de corrección:** Una migración necesita un runbook reversible, inventario y verificación.
- **Cuatro controles particulares de revisión:**
  1. Congelé escritores y enumeré estados/workspaces sujetos a migración.
  2. Verifiqué versión y recuperación de backups antes de init -migrate-state.
  3. Comparé estado previo y nuevo sin exponer secretos y registré NOT_RUN donde corresponde.
  4. Escribí rollback de backend, permiso, locking y responsables.
- **Entregables y gate:** paquete `assets/senior/S05.zip`, `labs/senior/S05/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S06 — Filtración de secretos en state, plan o logs

- **Contexto:** Contexto: el equipo incluye un secreto en una variable y descubre que aparece en un plan guardado o state.
- **Misión técnica:** localizar vías de exposición, separar ocultar output de excluir del estado, diseñar contención/rotación y políticas.
- **Artefactos necesarios:** ejemplo totalmente ficticio de output enmascarado, plan/state **sintéticos**, guía `sensitive` vs `ephemeral`.
- **Antipatrón que debe fallar:** marcar solo `sensitive = true` sin remediar state falla; registrar secretos en una captura/evidencia falla.
- **Evidencia exigida:** matriz de exposición, pasos de contención y control de acceso a artefactos.
- **Modalidad de ejercicio:** policy hunt + incidente; **nunca usar secretos reales**.
- **Severidad y dominio:** Crítico / Seguridad; **XP didáctico:** 300.
- **Decisión evaluable:** A: Marcar sensitive=true y concluir el incidente / B: Borrar el archivo de plan y no avisar / C: Contener acceso, rotar secreto, revisar state/logs y evitar persistencia. **Clave didáctica:** C.
- **Fundamento de corrección:** Sensitive es redacción, no eliminación de secretos del estado.
- **Cuatro controles particulares de revisión:**
  1. Identifiqué la exposición en outputs, logs, planes y state sensible.
  2. Exigí rotación/revocación de credenciales y contención del artefacto.
  3. Diferencié sensitive de ephemeral y validé compatibilidad de versión.
  4. Definí análisis de accesos, limpieza de logs y seguimiento del incidente.
- **Entregables y gate:** paquete `assets/senior/S06.zip`, `labs/senior/S06/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S07 — Upgrade de provider incompatible

- **Contexto:** Contexto: actualización mayor del provider cambia schema/comportamiento y un plan anuncia reemplazos inesperados.
- **Misión técnica:** analizar compatibilidad, proponer versión fijada, pruebas de regresión y rollout gradual.
- **Artefactos necesarios:** lockfile ficticio, changelog resumido, planes antes/después y tests rotos.
- **Antipatrón que debe fallar:** `terraform init -upgrade` sin plan de revisión falla; actualizar producción directa falla.
- **Evidencia exigida:** matriz versión/impacto, estrategia revertible y checklist de aprobación.
- **Modalidad de ejercicio:** revisión técnica + comparación de fixtures.
- **Severidad y dominio:** Alto / Providers; **XP didáctico:** 300.
- **Decisión evaluable:** A: Pinnear/planificar upgrade, revisar changelog y ejecutar regresiones / B: Ejecutar init -upgrade en prod directo / C: Ignorar cambios del provider. **Clave didáctica:** A.
- **Fundamento de corrección:** Las actualizaciones incompatibles requieren matrices y rollout seguro.
- **Cuatro controles particulares de revisión:**
  1. Inventarié versiones de provider, lockfile y dependencias de módulos.
  2. Elegí rango versionado compatible con changelog y runtime fijado.
  3. Propuse test de plan y regresión en sandbox, con evidencia NO EJECUTADA si aplica.
  4. Definí rollback del lockfile y política de actualización segura.
- **Entregables y gate:** paquete `assets/senior/S07.zip`, `labs/senior/S07/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S08 — Dependencias circulares y módulos acoplados

- **Contexto:** Contexto: network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.
- **Misión técnica:** romper ciclo con interfaces claras, separar ownership y evitar una capa monolítica innecesaria.
- **Artefactos necesarios:** diagrama de grafo circular, interfaces de módulos y errores de planificación de ejemplo.
- **Antipatrón que debe fallar:** mover `depends_on` sin resolver la dependencia lógica no gana; copiar outputs sensibles entre stacks falla.
- **Evidencia exigida:** grafo antes/después, razones de estratificación y trade-offs.
- **Modalidad de ejercicio:** grafo interactivo + ADR.
- **Severidad y dominio:** Alto / Arquitectura; **XP didáctico:** 300.
- **Decisión evaluable:** A: Añadir depends_on a todos los módulos / B: Romper el ciclo mediante contratos y ownership claros / C: Copiar todos los outputs en un archivo. **Clave didáctica:** B.
- **Fundamento de corrección:** Un grafo circular requiere rediseño de interfaces y ownership.
- **Cuatro controles particulares de revisión:**
  1. Dibujé el ciclo de dependencias entre módulos y recursos concretos.
  2. Definí interfaces output/input que rompen el acoplamiento bidireccional.
  3. Revisé cómo terraform graph representaría el orden tras el cambio.
  4. Escribí plan de migración incremental con owner y retorno.
- **Entregables y gate:** paquete `assets/senior/S08.zip`, `labs/senior/S08/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S09 — CIDR solapados entre entornos

- **Contexto:** Contexto: dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.
- **Misión técnica:** detectar solapamiento par-a-par, rechazar topología inválida y revisar contrato/digest del stack de red.
- **Artefactos necesarios:** mapa de redes con CIDR ficticios, contratos de variables y matriz de ambientes.
- **Antipatrón que debe fallar:** considerar válido un bloque solapado por pertenecer a otro módulo falla; usar inventario de ejemplo como real falla.
- **Evidencia exigida:** CIDR corregidos, test de contrato y límites de red.
- **Modalidad de ejercicio:** validador local de rangos con pruebas unitarias, sin afirmar haber probado en VPC real.
- **Severidad y dominio:** Alto / Networking; **XP didáctico:** 300.
- **Decisión evaluable:** A: Aceptar solapamiento entre entornos / B: Crear VPC antes de descubrir IPAM / C: Detectar superposiciones, ajustar CIDR y probar la topología. **Clave didáctica:** C.
- **Fundamento de corrección:** Rangos superpuestos crean conflicto de rutas, aunque se declaren en módulos distintos.
- **Cuatro controles particulares de revisión:**
  1. Comprobé matemáticamente el solapamiento de CIDR y el blast radius.
  2. Contrasté nueva propuesta con la asignación IPAM y conexiones existentes.
  3. Definí evidencia de routing/conectividad y marcada NOT_RUN cuando no se probó.
  4. Planifiqué migración de IPs, ventana autorizada y rollback de rutas.
- **Entregables y gate:** paquete `assets/senior/S09.zip`, `labs/senior/S09/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S10 — IAM mínimo en GitHub Actions + OIDC

- **Contexto:** Contexto: workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.
- **Misión técnica:** proponer federación OIDC, permisos limitados por job/entorno, approval gate y roles separados.
- **Artefactos necesarios:** workflow YAML de ejemplo vulnerable, trust policy simplificada, roles ficticios.
- **Antipatrón que debe fallar:** `id-token: write` global + admin wildcard falla; `pull_request` no confiable con secretos falla.
- **Evidencia exigida:** amenazas, trust conditions, matriz roles/jobs, decisiones de promoción.
- **Modalidad de ejercicio:** code review/policy hunt; no entregar claves reales.
- **Severidad y dominio:** Crítico / IAM; **XP didáctico:** 300.
- **Decisión evaluable:** A: Diseñar trust OIDC limitada y roles mínimos por job/entorno / B: Compartir claves estáticas de administrador / C: Conceder permisos * a cualquier PR. **Clave didáctica:** A.
- **Fundamento de corrección:** OIDC sin restricciones de audience, subject y env no es mínimo privilegio.
- **Cuatro controles particulares de revisión:**
  1. Revisé permisos del workflow y alcance de trust policy del rol OIDC.
  2. Eliminé llaves estáticas y acoté subject, repo, branch y entorno.
  3. Comprobé accesos mínimos y pruebas negativas de identidades no autorizadas.
  4. Definí revocación, rotación y respuesta a fallos de federación.
- **Entregables y gate:** paquete `assets/senior/S10.zip`, `labs/senior/S10/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S11 — El plan aprobado no es el plan aplicado

- **Contexto:** Contexto: un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.
- **Misión técnica:** explicar la ruptura de integridad, diseñar procedencia y validación de plan de despliegue asociada al commit/estado/entorno aprobados, con protección de artefactos sensibles.
- **Artefactos necesarios:** dos commits ficticios, hashes de ejemplo, workflow inseguro, dos fixtures con diferencias.
- **Antipatrón que debe fallar:** aprobar plan A y aplicar B falla; descargar un plan arbitrario desde un PR externo falla; un plan obsoleto no se aplica silenciosamente.
- **Evidencia exigida:** diagrama seguro PR→aprobación→merge/entorno→plan final→aprobación/aplicación, control de hash y protección de artefactos.
- **Modalidad de ejercicio:** pipeline simulator + ADR; sin `apply` real.
- **Severidad y dominio:** Crítico / CI/CD; **XP didáctico:** 300.
- **Decisión evaluable:** A: Aprobar plan A y aplicar plan B sin comparar / B: Autorizar y aplicar exactamente el plan final protegido o bloquear ante drift / C: Compartir el binario de plan en comentarios públicos. **Clave didáctica:** B.
- **Fundamento de corrección:** La trazabilidad de commit, estado, entorno y artefacto debe preservarse.
- **Cuatro controles particulares de revisión:**
  1. Vinculé commit, environment, state y digest del artefacto autorizado.
  2. Evité regenerar otro plan entre la revisión y terraform apply.
  3. Distinguí checksum de firma/autorización y controlé almacenamiento sensible.
  4. Diseñé gates ante divergencia, expiración de plan y rollback.
- **Entregables y gate:** paquete `assets/senior/S11.zip`, `labs/senior/S11/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S12 — Tests con mocks vs integración

- **Contexto:** Contexto: un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.
- **Misión técnica:** clasificar qué demuestra cada test y proponer sandbox de integración proporcional al riesgo.
- **Artefactos necesarios:** `.tftest.hcl` con mock, supuestos del provider, escenarios de integración pendientes.
- **Antipatrón que debe fallar:** «mock PASS = producción PASS» falla; tests con `apply` cloud no se corren como unitarios públicos.
- **Evidencia exigida:** pirámide de pruebas, `NOT_RUN` explícito y plan de pruebas de integración.
- **Modalidad de ejercicio:** lectura de tests + diseño experimental.
- **Severidad y dominio:** Alto / Testing; **XP didáctico:** 300.
- **Decisión evaluable:** A: Declarar producción probada por mocks / B: Omitir todas las pruebas / C: Distinguir mock PASS de integración NOT_RUN y añadir plan de sandbox. **Clave didáctica:** C.
- **Fundamento de corrección:** Un mock puede ocultar diferencias entre simulación y la API cloud.
- **Cuatro controles particulares de revisión:**
  1. Separé cobertura de mocks de pruebas reales del proveedor cloud.
  2. Definí aserciones negativas y casos de error que un mock no reproduce.
  3. Registré terraform test con origen y estado NOT_RUN si no hubo CLI.
  4. Establecí sandbox, cuotas, limpieza y barrera para promoción a prod.
- **Entregables y gate:** paquete `assets/senior/S12.zip`, `labs/senior/S12/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S13 — Policy as Code y excepciones

- **Contexto:** Contexto: un recurso incumple cifrado, tags obligatorios o reglas de red; el equipo pide ignorar el scanner por una urgencia.
- **Misión técnica:** corregir política o configuración, documentar excepción temporal justificada y dueño del riesgo.
- **Artefactos necesarios:** findings JSON saneados, política OPA/Conftest y propuesta de excepción con caducidad.
- **Antipatrón que debe fallar:** ignorar `HIGH/CRITICAL` sin justificación falla; excepciones permanentes no revisables fallan.
- **Evidencia exigida:** policy diff, pruebas negativas, owner, expiración, aprobación y resultado esperado.
- **Modalidad de ejercicio:** laboratorio de reglas.
- **Severidad y dominio:** Alto / Policy; **XP didáctico:** 300.
- **Decisión evaluable:** A: Deshabilitar scanner en CI / B: Corregir finding o excepción temporal con owner y expiración / C: Añadir ignore para todo el repositorio. **Clave didáctica:** B.
- **Fundamento de corrección:** Las excepciones deben tener riesgo, propietario, vencimiento y aprobación.
- **Cuatro controles particulares de revisión:**
  1. Localicé el bypass allow-all y el impacto en recursos críticos.
  2. Definí deny-by-default y tests de políticas positivos y negativos.
  3. Diseñé excepciones acotadas con ticket, propietario y expiración.
  4. Registré auditoría, prueba de expiración y reversión de la excepción.
- **Entregables y gate:** paquete `assets/senior/S13.zip`, `labs/senior/S13/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S14 — Aumento de costos sin control

- **Contexto:** Contexto: un PR cambia tamaño/ubicación de recursos y eleva el costo proyectado de cloud por encima de presupuesto.
- **Misión técnica:** identificar drivers, rechazar cambios sin Owner/CostCenter, escoger alternativa con trade-off de rendimiento/fiabilidad.
- **Artefactos necesarios:** comparación Infracost **ficticia**, tags, presupuesto y alternativas.
- **Antipatrón que debe fallar:** optimizar costo poniendo datos primarios en capacidad interrumpible falla; confundir estimación con factura real falla.
- **Evidencia exigida:** decisión de FinOps, ahorro estimado etiquetado, riesgos y validación futura.
- **Modalidad de ejercicio:** CostReviewPanel + ADR.
- **Severidad y dominio:** Alto / FinOps; **XP didáctico:** 300.
- **Decisión evaluable:** A: Revisar driver de costo, presupuesto, etiquetas y alternativas seguras / B: Cambiar todo a spot sin SLA / C: Asumir que la estimación será la factura exacta. **Clave didáctica:** A.
- **Fundamento de corrección:** FinOps evalúa costo, fiabilidad y riesgo, no solo minimiza números.
- **Cuatro controles particulares de revisión:**
  1. Verifiqué unidad, supuestos y procedencia de la estimación ficticia.
  2. Evalué efecto de escalado en capacidad, resiliencia y SLA.
  3. Establecí presupuesto, umbrales y control de cambios FinOps.
  4. Definí owner y reversiones si métricas reales invalidan el ahorro.
- **Entregables y gate:** paquete `assets/senior/S14.zip`, `labs/senior/S14/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S15 — Recuperación de state / desbloqueo de emergencia

- **Contexto:** Contexto: un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.
- **Misión técnica:** pausar writers, investigar, verificar backup, diseñar restore **sin inferir que una copia vieja refleja la nube actual**, requerir revisión dual para `force-unlock`.
- **Artefactos necesarios:** inventario de versiones ficticias de S3, timeline, último plan y responsables.
- **Antipatrón que debe fallar:** restaurar de inmediato sin reconciliar recursos falla; ejecutar `force-unlock` a ciegas falla.
- **Evidencia exigida:** plan de recuperación, checklist de seguridad, responsabilidades y pruebas posteriores.
- **Modalidad de ejercicio:** incidente/DR con simulación.
- **Severidad y dominio:** Crítico / DR; **XP didáctico:** 300.
- **Decisión evaluable:** A: Hacer force-unlock a ciegas / B: Reemplazar state por la versión más antigua / C: Pausar escritores, auditar versions/backups y reconciliar antes del restore. **Clave didáctica:** C.
- **Fundamento de corrección:** Recuperar state es un incidente coordinado, con aprobación dual.
- **Cuatro controles particulares de revisión:**
  1. Paré escritores y conservé versiones y metadatos de recuperación.
  2. Evité force-unlock sin identificar propietario y estado de operación.
  3. Diseñé restore ensayado con comparación de drift y observación cloud.
  4. Definí doble aprobación, RTO/RPO y verificación post-recuperación.
- **Entregables y gate:** paquete `assets/senior/S15.zip`, `labs/senior/S15/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S16 — Límite Terraform vs Helm/GitOps

- **Contexto:** Contexto: Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.
- **Misión técnica:** declarar quién crea clúster, addons, namespaces, workloads y políticas; reducir controladores concurrentes.
- **Artefactos necesarios:** matriz de ownership, diagrama cluster/infra/workloads, recursos duplicados de ejemplo.
- **Antipatrón que debe fallar:** dos herramientas dueñas del mismo recurso fallan; «arreglar» drift con `apply` repetitivos sin ownership falla.
- **Evidencia exigida:** ADR, árbol de ownership y estrategia de transición segura.
- **Modalidad de ejercicio:** design review + grafo.
- **Severidad y dominio:** Alto / Kubernetes; **XP didáctico:** 300.
- **Decisión evaluable:** A: Permitir Terraform y Argo CD sobre los mismos objetos / B: Definir ownership y traspasos claros entre Terraform y GitOps / C: Ejecutar apply cada minuto para ganar la carrera. **Clave didáctica:** B.
- **Fundamento de corrección:** El ownership único reduce guerras de reconciliación.
- **Cuatro controles particulares de revisión:**
  1. Identifiqué exactamente qué recursos comparten Terraform y GitOps.
  2. Asigné un único reconciliador por entidad y límites de ownership.
  3. Diseñé handoff declarativo sin bucles de drift entre controladores.
  4. Documenté observabilidad, tolerancia a fallos y reversión de ownership.
- **Entregables y gate:** paquete `assets/senior/S16.zip`, `labs/senior/S16/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S17 — Revisión técnica de una plataforma IaC

- **Contexto:** Contexto: un equipo presenta un PR/RFC con todo el cloud en un solo estado y sin gates, owners ni plan de rollback.
- **Misión técnica:** priorizar hallazgos, escribir comentarios de revisión concretos, proponer entregas incrementales y definir criterio GO/NO-GO.
- **Artefactos necesarios:** PR ficticio, diagrama de arquitectura, inventarios y controles faltantes.
- **Antipatrón que debe fallar:** recomendar refactor masivo sin baseline/test/rollback falla; confundir opinión con evidencia falla.
- **Evidencia exigida:** revisión priorizada P0/P1/P2, ADR, matriz de riesgo y gate de entrega.
- **Modalidad de ejercicio:** Code Review + comunicación técnica.
- **Severidad y dominio:** Alto / Arquitectura; **XP didáctico:** 300.
- **Decisión evaluable:** A: Priorizar P0/P1/P2, proponer gates y una migración incremental / B: Reescribir toda la plataforma de una vez / C: Aprobar sin pruebas porque compila. **Clave didáctica:** A.
- **Fundamento de corrección:** Una revisión Senior vincula hallazgos concretos con evidencias, blast radius y rollback.
- **Cuatro controles particulares de revisión:**
  1. Priorizé P0/P1 según severidad, alcance e impacto en producción.
  2. Separé remediación inmediata de mejoras estructurales de largo plazo.
  3. Establecí métricas, owners y evidencias para gates de release.
  4. Redacté ADR con decisiones rechazadas, fases y rollback.
- **Entregables y gate:** paquete `assets/senior/S17.zip`, `labs/senior/S17/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

#### S18 — Capstone de Platform Engineering con Terraform

- **Contexto:** Contexto: diseñar una plataforma con red, servicios y datos en development/staging/production, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.
- **Misión técnica:** presentar solución y operar decisiones ante cambios destructivos, drift, bloqueo concurrente, IAM insuficiente y costo excesivo.
- **Artefactos necesarios:** blueprint, módulos, entornos, políticas, escenarios de cambios y tests descargables; sin depender obligatoriamente de AWS real para la evaluación conceptual.
- **Antipatrón que debe fallar:** state monolítico, plan no aprobado, claves estáticas, CIDR solapado, secretos en artefactos y ausencia de rollback deben impedir aprobar el diseño.
- **Evidencia exigida:** ADR final, diagrama y ownership, carpeta de módulos/entornos, resultados `fmt/validate/test` si ejecutados, revisión de plan, policy findings, análisis de costos y runbook.
- **Modalidad de ejercicio:** proyecto de varias etapas, con gates por hito y revisión manual reconocida.
- **Severidad y dominio:** Crítico / Capstone; **XP didáctico:** 800.
- **Decisión evaluable:** A: Desplegar producción primero y documentar después / B: Usar un state y una llave admin para todo / C: Diseñar capas, controles, pruebas y capstone multiambiente con evidencia. **Clave didáctica:** C.
- **Fundamento de corrección:** La competencia final demuestra un diseño revisable, no certificación oficial.
- **Cuatro controles particulares de revisión:**
  1. Justifiqué separación de estados, módulos, entornos y owners.
  2. Definí pipeline con plan autorizado, OIDC, policies y rollback.
  3. Cubrí los ocho hitos y anoté fmt/validate/test como NOT_RUN si aplica.
  4. Escribí handoff operativo con costos, drift, incidentes y recuperación.
- **Entregables y gate:** paquete `assets/senior/S18.zip`, `labs/senior/S18/incident.json`, what-if, worksheet, review gates y ADR exportable. Verificar que el caso se invalide al borrar/modificar evidencia, checklist o respuestas.

### 10.2. Capstone S18: ocho hitos obligatorios y su Definition of Done

No confundir ocho casillas marcadas con ocho entregables de ingeniería completos. Cada hito requiere una nota propia, clasificación de evidencia, dueño, diseño, verificaciones efectivamente realizadas y revisión final. El módulo local evita exigir una cuenta cloud para la primera comprobación.

#### S18.1 — Arquitectura y ownership

- **Construir:** Diagrama, límites de Terraform vs GitOps, inventario de recursos, responsables, ADR y riesgos de doble reconciliador.
- **Criterio de aceptación:** La matriz de owners cubre todos los componentes; revisión humana firmada; no hay recursos con ownership contradictorio.
- **Artefacto:** `labs/senior/S18/` (etapa 1), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.2 — Módulos y contratos

- **Construir:** Módulos `network`, `application`, `data` ejemplares; variables tipadas, outputs, versionado y dependencias.
- **Criterio de aceptación:** Cada módulo tiene README, inputs/outputs, validación, ejemplos y test de su contrato.
- **Artefacto:** `labs/senior/S18/` (etapa 2), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.3 — Estados por entorno

- **Construir:** Dev/staging/prod aislados por backend, IAM, identidad, secrets y procedimiento de recuperación; ejemplo S3 versionado con lock.
- **Criterio de aceptación:** Demostrar plan de migración y bloqueo, pruebas de recuperación y permisos sin credenciales estáticas.
- **Artefacto:** `labs/senior/S18/` (etapa 3), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.4 — IAM/OIDC

- **Construir:** Federación GitHub Actions con privilegios mínimos por entorno, branch/env conditions y aprobaciones.
- **Criterio de aceptación:** Trust documentado, revisión de permiso, rechazo de un token fuera del scope permitido.
- **Artefacto:** `labs/senior/S18/` (etapa 4), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.5 — Quality gates

- **Construir:** Comandos `fmt`, `init -backend=false`, `validate`, `test`, escáner de secretos, policy/lint según lab.
- **Criterio de aceptación:** Logs reales por comando; `NOT_RUN` si el entorno no lo ejecutó, no un PASS sintético.
- **Artefacto:** `labs/senior/S18/` (etapa 5), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.6 — Revisión de plan

- **Construir:** Identidad inmutable de commit/env/digest, cambios create/update/destroy/replace, drift y sensibilidad.
- **Criterio de aceptación:** Plan comparado con aprobado y gate que bloquee casos destructivos sin revisión.
- **Artefacto:** `labs/senior/S18/` (etapa 6), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.7 — FinOps y políticas

- **Construir:** Coste estimado con supuestos, límites y tags; políticas de excepciones con dueño y caducidad.
- **Criterio de aceptación:** Distinguir estimación de factura; bloquear exceder presupuesto sin excepción formal.
- **Artefacto:** `labs/senior/S18/` (etapa 7), ADR/worksheet y nota de evidencia con fecha, owner y estado.

#### S18.8 — Operaciones y defensa

- **Construir:** Runbooks drift, incidente de lock, estado dañado, rollback, DR, on-call y comunicación.
- **Criterio de aceptación:** Handoff legible, matriz RACI, prueba de recuperación o explícito NOT_RUN, documentación de blast radius.
- **Artefacto:** `labs/senior/S18/` (etapa 8), ADR/worksheet y nota de evidencia con fecha, owner y estado.

## 11. Seguridad, supply chain, licencias y riesgos

### 11.1. Modelo de amenazas

| Riesgo | Control obligatorio | Prueba negativa |
|---|---|---|
| Ejecutar IaC no confiable | Nunca ejecutar directamente en navegador/backend; ejecutar test local solo en copia allowlisted | Intento de incluir provider externo inesperado debe bloquear o avisar |
| Secretos en plan/state/logs | Minimizar import, no renderizar values, no exportar `before/after`, scan de ZIP | Campo sensible ficticio no aparece en pantalla/informe |
| ZIP con path traversal | Reject `..`, absoluta, symlinks externos; extraer a carpeta temporal | Bundle malicioso rechazado |
| Log falso presentado como ejecutado | Procedencia y digest, estado NO ATTESTATION | Manifiesto PASS sin hash rechazado |
| XP / badges falsificables | Reconciliar import y cambios de respuestas | `completed` falso se revoca |
| XSS por entradas JSON/HCL/ADR | Text nodes/escape y límites de tamaño; evitar `innerHTML` inseguro | Entrada `<script>` queda como texto |
| Control de releases omitido | Gate bloquea unknown/destructive/drift sin control | Plan desconocido produce BLOCKED |
| Colisión de nombres/marcas | Identidad original, licencias, revisión de marca | Icono de tercero no se usa como logotipo propio |
| Supply-chain npm | Lockfile verdadero, SCA, licence review, dependabot, integridad | `npm ci` reproducible y sin dependencias inventadas |
| Manipulación de sources durante tests | Copias temporales para init/fmt/test | Hash de los `labs/` no cambia |

### 11.2. Reglas no negociables

- No solicitar claves AWS ni `TF_VAR_*` privadas en la interfaz educativa.
- No subir automáticamente plan JSON, state, notas, backup de progreso o logs a terceros.
- No utilizar `terraform apply -auto-approve` como receta por defecto; ningún botón web lo invoca.
- No sobreescribir ni borrar `.tfstate`; bloquear recetas peligrosas en producción sin autorización.
- Diferenciar simulación, prueba Node, prueba CLI real y validación humana con sellos textuales explícitos.
- La seguridad jurídica y marca deben revisarse antes de vender la academia o publicar assets que utilicen marcas oficiales.

## 12. Pruebas, calidad, release gates y evidencia exigida

### 12.1. Test plan de frontend

1. Carga por HTTP desde un directorio extraído, sin depender de rutas locales de desarrollo.
2. Rutas y botones: probar un recorrido completo para cada familia de pantallas, además de enlaces entre familias.
3. Aula: B01/B12/I01/I12/A01/A12, completitud/revocación/duplicados, guardado y recuperación.
4. Catalog: 36 tarjetas y ocho especialidades, búsqueda vacía/con acentos y cambio de filtros.
5. Juegos: las cinco mecánicas, feedback negativo y score sin inflación.
6. Senior: los 18 casos, cinco pestañas, what-if, decision, review, ADR, notas y export.
7. Capstone: ocho hitos, evidencia única por hito, cambio/revocación y resultado final.
8. Plan: JSON válido, malformado, >5 MB, vacío, con drift, unknown/destructive, secretos y reporte sin values.
9. CLI manifest: sintético, inválido, duplicados, PASS sin hash, export, borrado y persistencia solo de metadatos permitidos.
10. Responsive: 320, 375, 768, 1024, 1440 px, orientación horizontal, zoom y sin overflow.
11. A11y: foco, lector, labels, headings, contraste, instrucciones de error y reduced-motion.
12. Smoke de deploy estático: assets con rutas correctas, CSP, cache y encabezados seguros.

### 12.2. Test plan IaC — distinto del test web

- Cada uno de los 36 laboratorios debe pasar `terraform fmt -check -recursive`, `terraform init -backend=false`, `terraform validate` y `terraform test` conforme a su README, en copia limpia.
- `terraform test` puede tener efectos en recursos; permitir únicamente módulos locales aprobados o mocks, con revisión previa. Proveedores cloud reales son opcionales y **separados**.
- S18 requiere su propia validación CLI y evidencias por hito. Si no hay Terraform CLI, registrar 37 entradas `NOT_RUN`; NO acreditar 37/37.
- Validar outputs reales frente a casos esperados, versiones/providers y licencias; no basta comprobar que existan archivos `.tf`.
- Guardar logs con datos privados saneados, exit codes y hashes; si se importan a la web, se importa solo un manifiesto controlado.

### 12.3. Gate zero-omissions por release

| Gate | Aprobación necesaria |
|---|---|
| G1 Cobertura | 100 % de requisitos obligatorios trazados a archivos y pruebas |
| G2 Integridad | Sin archivos obligatorios ausentes, ZIP internos coherentes, licencias presentes |
| G3 Coherencia | README, código, workflows y pantallas describen lo mismo |
| G4 Build y ejecución | Tests Node/TS, build Vite requerido, UI E2E y Terraform CLI realizados en entorno disponible |
| G5 Correcciones | Defectos de release corregidos y pruebas repetidas |
| G6 ZIP | CRC, path traversal, hashes, extracción limpia y smoke del extraído |
| G7 Honestidad | Pendientes/no verificables explícitos, estados sin afirmaciones ficticias |

**Decisión:** `APROBADO — VERIFICADO EN ALCANCE` solo si todos los P0/P1 obligatorios están resueltos, con evidencia real, y G1–G7 satisfechas. En otro caso: `NO APROBADO — REQUIERE CORRECCIÓN` o `ENTREGA PARCIAL / NO VERIFICABLE`.

### 12.4. Comandos reproducibles actuales

```bash
# Inicio local: Node.js >=20.19.0, sin npm install
npm start
# http://localhost:4173

# Chequeo estático y unidad
npm run typecheck
npm test
npm run security:local

# Build estático (NO confundir con Vite)
npm run build

# Integridad y conservación
python3 scripts/release-audit.py
npm run verify:preservation
python3 scripts/verify-release.py

# Solo si están instaladas y habilitadas las dependencias
npm ci
npm run build:vite
npm run lint:biome

# Terraform real, únicamente en máquina autorizada con Terraform CLI
npm run verify:terraform:local
```

**No confundir:** los tests de navegador embebido no constituyen E2E HTTP completos; un HTTP 200 de Node tampoco implica que el editor, el focus o los botones funcionen. Los checks del paquete deben ejecutarse de nuevo sobre la **copia extraída del ZIP final**.

## 13. Control de cambios y protección de archivos al continuar el desarrollo

1. Tomar ZIP baseline íntegro e inventariar todos los paths, tamaños, hashes.
2. Hacer working copy independiente. Versionar cada cambio por patch o commit y mantener copia del original.
3. Antes de regenerar un ZIP de laboratorio, comparar source y paquete previo: ningún archivo sin sustituto funcional debe desaparecer.
4. No borrar código heredado solo porque una vista nueva Preact existe; primero comprobar que navega, renderiza y preserva datos.
5. Registrar en `docs/` cada bug, evidencia, fix, revalidación y pendiente. Actualizar README en la misma revisión que código.
6. Regenerar `dist/` y `SHA256SUMS.txt` **solo al final** de la compilación y empaquetado. Nunca calcular checksum y después cambiar archivos incluidos.
7. Empaquetar ZIP nuevo con raíz `TerraPixel-Academy/`, no sobrescribir releases históricos.
8. Abrir/extract ZIP, comparar rutas baseline, ejecutar gates, contar archivos, verificar CRC/hash y smoke.
9. Marcar como parcial todo P0/P1 no resuelto; un archivo más grande no prueba completitud.
10. Publicar enlace al ZIP y al informe real, no a una ruta supuesta.

## 14. Bloqueos técnicos y decisiones pendientes que NO pueden omitirse

**Para cumplir completamente la especificación original y declarar release de producción, quedan como mínimo estos gates** (su estado se reevalúa con la evidencia del ZIP final, no con declaraciones anteriores):

- [ ] CodeMirror 6 real con módulos/assets autorizados y tests de interacción, migración v5 sin pérdida de texto.
- [ ] Finalizar todos los componentes internos Preact y retirar las plantillas legacy solo tras paridad de UI, teclado y comportamiento.
- [ ] Dependencias npm declaradas con lockfile reproducible; instalación limpia y build Vite verdaderamente ejecutado.
- [ ] Ejecutar Terraform CLI de los 36 laboratorios y el capstone S18 en sandbox local seguro; archivar los resultados verificados.
- [ ] E2E completo por HTTP con Playwright/Chromium, incluyendo import/export, persistencia, captura responsive y navegación.
- [ ] Auditoría de accesibilidad WCAG AA (automática y manual) y seguridad adicional de dependencias.
- [ ] Verificación real de los workflows GitHub Actions y permisos cloud (cuando sean aplicables).
- [ ] Revisión de marcas/licencias antes de distribución comercial.
- [ ] Unificar versión en `package.json`, README, auditoría, manifest y ZIP final.
- [ ] Repetir auditoría zero-omissions sobre ZIP extraído y registrar cualquier `NO VERIFICABLE`.

**Prioridad recomendada:** cerrar editor CM6 + full Preact + build Vite/lockfile, después CLI y E2E HTTP, luego accesibilidad/seguridad profunda, CI y revisión jurídica. No aumentar cantidad de páginas por apariencia mientras los gates centrales estén pendientes.

---

# ANEXO A — Especificación maestra auditada v1.1 (íntegra)

> Este anexo reproduce el diseño funcional normativo de origen: pantallas, colores, contratos, progreso, 54 módulos, laboratorios, Senior Mode, skills Vigilio, CI/CD y definición de terminado. Su redacción histórica puede proponer archivos o configuraciones que aún NO existen. **La presencia de una propuesta en este anexo no significa que esté implementada o probada.** Las correcciones y el estado de los capítulos 0–14 prevalecen sobre sus ejemplos cuando hay diferencias de versión o nombre.

# ACADEMIA IaC PIXEL — MASTER SPECIFICATION (enseñanza de HashiCorp Terraform)

> **Documento maestro único · Producto + UX/UI + arquitectura + currículo + laboratorios + Senior Mode + DevSecOps**  
> **Versión de la especificación:** 1.1 auditada · **Fecha de revisión:** 11 de noviembre de 2026  
> **Estado:** referencia visual aceptada por el usuario y **especificación de producto propuesta**, con correcciones de auditoría. **NO** equivale a software implementado, tests ejecutados ni licencia de marca concedida.  
> **Idioma editorial inicial:** español.  
> **Producto (nombre público pendiente de validación de marca):** academia independiente para enseñar HashiCorp Terraform. **Nombre provisional de diseño en el PNG:** «Terraform Academy», **NO autorizado para publicación como marca**. **Alternativa propuesta sujeta a verificación:** «TerraPixel Academy». **Mascota original propuesta:** Terra, sin símbolos oficiales de Terraform en su identidad.  
> **Principio:** **reproducir el lenguaje visual y educativo de GoPixel Academy, especializado en HashiCorp Terraform y alineado con Vigilio, usando una marca y una mascota originales**.

## Índice ejecutivo

1. [Mandato, límites y resultado esperado](#1-mandato-límites-y-resultado-esperado)
2. [Fuentes auditadas y decisiones de herencia](#2-fuentes-auditadas-y-decisiones-de-herencia)
3. [Referencia PNG, identidad y mascota Terra](#3-referencia-png-identidad-y-mascota-terra)
4. [Design system completo](#4-design-system-completo)
5. [Mapa de pantallas, navegación y microinteracciones](#5-mapa-de-pantallas-navegación-y-microinteracciones)
6. [Stack tecnológico elegido y ADR](#6-stack-tecnológico-elegido-y-adr)
7. [Arquitectura y contratos de datos](#7-arquitectura-y-contratos-de-datos)
8. [Motor educativo de HCL, plan y evaluación](#8-motor-educativo-de-hcl-plan-y-evaluación)
9. [Currículo: 54 módulos y ocho itinerarios](#9-currículo-54-módulos-y-ocho-itinerarios)
10. [Laboratorios Terraform auténticos](#10-laboratorios-terraform-auténticos)
11. [Senior Mode: sistema, 18 escenarios y capstone](#11-senior-mode-sistema-18-escenarios-y-capstone)
12. [Progreso, accesibilidad, privacidad e internacionalización](#12-progreso-accesibilidad-privacidad-e-internacionalización)
13. [Seguridad, cloud, CI/CD, costos y evidencia](#13-seguridad-cloud-cicd-costos-y-evidencia)
14. [Implementación paso a paso y entregables](#14-implementación-paso-a-paso-y-entregables)
15. [Definition of Done, pruebas, matriz de aceptación](#15-definition-of-done-pruebas-matriz-de-aceptación)
16. [Extensiones futuras y criterios de decisión](#16-extensiones-futuras-y-criterios-de-decisión)
17. [Fuentes y matriz de skills Vigilio](#17-fuentes-y-matriz-de-skills-vigilio)
18. [Instrucciones de ejecución para el equipo o agente](#18-instrucciones-de-ejecución-para-el-equipo-o-agente)
19. [Auditoría técnica y legal — revisión 1.1](#19-auditoría-técnica-y-legal--revisión-11)

---

# 1. Mandato, límites y resultado esperado

## 1.1. Qué se construirá

La academia (llamada «Terraform Academy» solo en la imagen conceptual) será una aplicación web educativa, rápida y sin cuenta obligatoria, que enseñe Terraform desde sus conceptos iniciales hasta decisiones de producción. Debe sentirse como la **misma familia visual de GoPixel Academy**: portada épica con mascota pixelada, dark/light, rutas de aprendizaje, lecciones guiadas, editor, minijuegos, logros, actividades aplicadas, modo Senior y pruebas con retroalimentación honesta.

La especialización **no es cambiar `main.go` por `main.tf`**. Terraform introduce conceptos y riesgos propios: declaratividad, grafo de dependencias, proveedores, evaluación de expresiones, state, locking, drift, importación, cambios destructivos, módulos, políticas y costos. Cada mecánica de GoPixel debe conservarse, reemplazarse o descartarse según aporte un aprendizaje auténtico de IaC.

**Promesa al alumno:** «Aprende a declarar, revisar, probar, proteger y entregar infraestructura como código con criterio profesional».

**No prometer:** certificación oficial HashiCorp, que todo funciona en navegador, equivalencia con un verdadero `terraform plan` o que completar 18 desafíos convierte automáticamente a una persona en Senior Engineer.

## 1.2. Resultado verificable

El producto terminado debe permitir, como mínimo:

1. Entrar, elegir una ruta y continuar el progreso **sin login**.
2. Leer lecciones en español con ejemplos **correctos de Terraform/HCL**.
3. Resolver ejercicios cortos en editor HCL y recibir feedback específico.
4. Distinguir inequívocamente entre **corrección educativa en navegador**, **plan de ejemplo** y **prueba ejecutada con Terraform CLI real**.
5. Visualizar un grafo de recursos y comprender orden, dependencias y blast radius.
6. Practicar 5 tipos de minijuego con respuestas y explicaciones.
7. Descargar laboratorios `.tf` y `.tftest.hcl` reproducibles y auditados.
8. Completar **12 módulos básicos + 12 intermedios + 12 avanzados + 18 retos Senior**.
9. Activar Senior Mode dentro de lecciones compatibles sin borrar el progreso normal.
10. Evaluar riesgos de state, permisos, seguridad, drift, CI/CD y FinOps en escenarios realistas.
11. Exportar/importar progreso local validado, cambiar tema y usar teclado/móvil.
12. Disponer de CI con gates reales, evidencias y publicación estática reproducible.

## 1.3. Restricciones no negociables

- **MVP estático:** no backend, no login, no base de datos y no ejecución remota arbitraria de Terraform.
- **Diseño:** conservar jerarquía, navegación y mezcla **80 % interfaz moderna / 20 % pixel art** de GoPixel; adoptar el morado Terraform y la mascota Terra de la imagen.
- **Stack:** Preact + TypeScript estricto + Vite; un solo frontend, no microfrontends.
- **Idioma de lanzamiento:** español completo. No mostrar seis idiomas vacíos ni traducciones automáticas incompletas.
- **Seguridad:** nunca requerir credenciales cloud para las primeras lecciones; ningún `apply` contra producción desde la web.
- **Honestidad:** estados `PASS`, `FAIL`, `NOT_RUN` y `BLOCKED` con procedencia explícita.
- **Marca comercial (BLOQUEANTE PARA PUBLICACIÓN):** «Terraform» no puede formar parte del nombre propio del producto o de su logotipo sin autorización adecuada. Usar nombre/identidad originales. El nombre «HashiCorp Terraform» se puede mencionar de forma descriptiva y proporcional para identificar la tecnología enseñada, con atribución y sin alegar afiliación. Revisar la [política oficial de marcas](https://www.hashicorp.com/en/trademark-policy) antes de publicar.
- **Licencias y gráfica:** respetar derechos de contenidos y bibliotecas; no reutilizar el Gopher como mascota. La imagen conceptual incorpora logotipos protegidos (Terraform y proveedores cloud) y **no está autorizada automáticamente para uso público o merchandising**; recrear marca original y, cuando proceda, usar iconografía de terceros únicamente bajo sus guías.
- **Alcance:** este `.md` gobierna diseño e implementación; no inventa que el código ya exista.

## 1.4. Tres niveles de laboratorio

| Nivel | Nombre | Dónde corre | Qué hace | Credenciales | En la primera entrega |
|---|---|---|---|---|---|
| A | **Interactivo web** | Navegador | Reglas de ejercicio, quiz, editor, grafos y fixtures de plan | No | **Sí** |
| B | **Terraform real local** | Equipo del alumno / CI permitido | `fmt`, `init`, `validate`, `test` y escenarios sin cloud; cloud optativo | No en básico; opcionales en avanzados | **Sí** |
| C | **Sandbox cloud remoto** | Workers aislados dedicados | Ejecución real gestionada de CLI, con cuotas y cleanup | Identidad temporal, nunca keys del alumno expuestas | **No; solo futuro** |

### 1.5. El significado de «misma plataforma que GoPixel»

Se conserva la **composición del producto**: hero, rutas, selección de dificultad, navegación, cards, aula, editor, estado de progreso, minijuegos, Senior Mode, badges, ajustes y experiencia pixelada. Se adapta todo lo específico de Go a semánticas Terraform.

**No se garantiza reutilización del código fuente.** En el ZIP recibido, `index.html` apunta a `/src/main.tsx`, pero faltan `src/`, `package.json`, lockfile y configuraciones necesarias para compilar una SPA. Sí están presentes documentación, capturas, assets, auditorías y laboratorios Go de referencia. Por eso, la estrategia operativa es **reconstrucción fiel del sistema visual y funcional**, o migración del repositorio original solo si después se dispone de los fuentes reales.

---

# 2. Fuentes auditadas y decisiones de herencia

| Material suministrado | Qué aporta | Qué no se debe asumir |
|---|---|---|
| `index.zip` / `docs/design/UI_UX_ESPECIFICACION_PREVIA.md` | Especificación UI 80/20, modos, arquitectura de pantallas, editor, Senior transversal, estados de ejecución | Que todos los componentes descritos estén en el snapshot |
| `index.zip` / `public/assets/ASSET-ATLAS.png` | Patrón de 12 poses, iconos, seis badges y catálogo visual | Derecho a copiar el personaje Gopher para Terraform |
| `index.zip` / `docs/content/*` | Patrón curricular de 12+12+12+18, minijuegos y módulos | Que los temarios Go sean reutilizables sin rediseñar |
| `index.zip` / `docs/senior/*` | Evaluación, incidentes, evidencia, autoevaluación y límites declarados | Que una rúbrica manual sea un test automático |
| `skills(10).zip` / `terraform-iac-delivery` | State, locking, módulos, testing, políticas, OIDC y CI | Que producción AWS/K8s sea requisito del MVP educativo |
| `vigilio-docs(9).zip` / `platform/iac/*` | Convenciones Terraform y anti-drift | Que los laboratorios educativos deban usar cuentas cloud reales |
| `vigilio-docs(9).zip` / `technology/versions.md` | Política de versiones y compatibilidad | Que versiones citadas en docs antiguos estén vigentes en el lockfile futuro |
| `vigilio-docs(9).zip` / `platform/cicd/*` y `platform/sre/*` | Gates, evidencia y controles de entrega | Que una captura o checklist equivalga a un pipeline ejecutado |
| **PNG entregado por el usuario** | **Dirección visual seleccionada**: Terra, paleta morada, layout de landing, atlas de poses y editor | Que la composición 4-en-1 sea una captura literal de una web implementada |

**Regla de autoridad:** utilizar documentos canónicos de Vigilio, no copias de `_site/` o `.compat/`; aplicar sus controles **de manera proporcional a la topología de una SPA estática**. Los requerimientos de cuentas cloud se activan únicamente cuando existe un laboratorio cloud explícito.

---

# 3. Referencia PNG, identidad y mascota Terra

## 3.1. Imagen de diseño aceptada

**Referencia maestra suministrada:** `image(20261111-014058).png` (PNG **1536 × 1024**, RGBA; dimensiones y modo comprobados). El archivo es un **concept board privado**, no una maqueta a la que se deben superponer botones HTML: contiene cuatro regiones ilustrativas. **La aceptación estética no constituye autorización para publicar marcas ni logotipos ajenos.**

![Concepto aprobado de Terraform Academy: mascota Terra, atlas de poses, portada y editor](<image(20261111-014058).png>)

> **Uso en el repositorio de implementación:** conservar la imagen en una carpeta de referencia **privada/restringida**, por ejemplo `docs/design/reference/terraform-academy-concept.png`, sin distribuirla como un asset de marca pública. En este `.md`, la previsualización es un enlace relativo al PNG que el usuario aportó y **solo funciona si el archivo PNG está junto al Markdown**. Un archivo `.md` por sí solo no contiene los bytes de la imagen. **No usar el collage como fondo de la web**: reconstruir la UI accesible y recrear sprites originales sin marcas protegidas. La generación de sprites separados será trabajo posterior.

### Interpretación de sus cuatro regiones

1. **Arriba izquierda — identidad/hero:** nombre Terraform Academy, propuesta de valor, mascota grande con casco, planos, módulos flotantes y contexto multicloud.
2. **Arriba derecha — atlas Terra:** ocho poses principales y expresiones; utilizable para feedback según cada lección.
3. **Abajo izquierda — homepage:** header oscuro, hero con Terra trabajando en laptop, CTA y tarjetas de métricas (cifras como metas del temario, no implementación ya realizada).
4. **Abajo derecha — aula:** ruta de fundamentos, progreso, panel paso a paso, pestañas `.tf`, sintaxis coloreada, validar/plan/aplicar simulado y feedback.

## 3.2. Mascota Terra: contrato de identidad

**Nombre:** Terra. **Aspecto:** personaje pixel art original, cuerpo en forma de bloque cúbico redondeado lila, rostro expresivo, ojos simples, botas y guantes morados, casco de construcción blanco con **símbolo propio no confundible con el logo Terraform**, mochila/utilidades y plano de infraestructura. **Personalidad:** práctica, curiosa, resolutiva, nunca burlona con errores. **Papel:** instructora visual y compañera de operaciones, no reemplazo del contenido.

**No confundir** con un personaje oficial de Terraform. Los logos de Terraform en casco, pecho y cabecera **no se trasladan a producción**; hay que diseñar un símbolo original de construcción/nodos que no imite la forma oficial. «HashiCorp Terraform» se menciona en texto descriptivo de contenidos, no como marca del producto. La política de HashiCorp prohíbe en general utilizar su marca en el nombre propio de un producto, incluso si el proyecto es independiente.

### Las 12 poses de producto

| Archivo a producir | Escena | Ubicación funcional | Texto alternativo orientativo |
|---|---|---|---|
| `terra-welcome.png` | Saluda | Hero / onboarding | Terra da la bienvenida a la academia |
| `terra-thinking.png` | Piensa con signo de pregunta | Pistas / diagnóstico | Terra analiza un problema de infraestructura |
| `terra-success.png` | Celebra con destellos | Prueba realmente aprobada | Terra celebra la respuesta correcta |
| `terra-coding.png` | Trabaja con laptop | Editor / playground | Terra escribe Terraform en su laptop |
| `terra-planning.png` | Lee un plano | Plan explorer / dependencias | Terra revisa un plano de infraestructura |
| `terra-deploy.png` | Casco + aprobación | Entrega revisada | Terra aprueba un cambio controlado |
| `terra-error.png` | Alerta de error | Validación fallida | Terra detecta un error a corregir |
| `terra-sleep.png` | Descansa | Estado vacío/pausa | Terra descansa entre prácticas |
| `terra-reading.png` | Libro abierto | Teoría y conceptos | Terra estudia módulos Terraform |
| `terra-security.png` | Escudo y candado | Seguridad/state | Terra protege el estado de Terraform |
| `terra-senior.png` | Corona sutil y plano | Senior Dashboard | Terra analiza arquitectura de producción |
| `terra-graduate.png` | Birrete y diploma | Fin de itinerario | Terra celebra que completaste una ruta |

**Las ocho primeras poses aparecen como idea en el PNG; las cuatro últimas amplían el sistema del GoPixel original.** Los nombres son especificaciones de archivos futuros, no assets ya producidos.

### Reglas de producción de sprites

- Fondo **RGBA transparente** para personajes aislados.
- Dibujar a cuadrícula consistente, por ejemplo base **64 × 64 o 96 × 96 píxeles lógicos**, exportada a escala entera **×4 / ×8** usando vecino más cercano.
- Dos tamaños recomendados: mini (`128–192 px` renderizados) y hero (`320–500 px` renderizados). Mantener contorno, ojos, proporciones, tonos y casco consistentes.
- `image-rendering: pixelated` **solo** en sprites que tengan pixeles nativos limpios; no en tipografía/UI ni en el PNG concept board.
- No aplicar blur, suavizado de píxeles ni sombras que anulen el pixel art. Sombras ambientales suaves **detrás** del sprite sí son válidas.
- Cada pose tiene su PNG individual, dimensiones registradas, licencia/autor y atributo `alt` o `aria-hidden` si es decorativa.
- Preparar atlas maestro con etiquetas como GoPixel (`public/assets/asset-atlas.png`) y comparar visualmente las 12 poses.
- Los badges deben diseñarse con símbolos originales: iniciación, HCL, módulos, state, seguridad y arquitecto Senior.

## 3.3. Asset manifest solicitado

```text
public/assets/
├── brand/
│   ├── terra-academy-mark.svg
│   ├── terra-academy-wordmark.svg
│   ├── favicon.svg
│   └── social-preview.png
├── mascot/
│   ├── terra-welcome.png
│   ├── terra-thinking.png
│   ├── terra-success.png
│   ├── terra-coding.png
│   ├── terra-planning.png
│   ├── terra-deploy.png
│   ├── terra-error.png
│   ├── terra-sleep.png
│   ├── terra-reading.png
│   ├── terra-security.png
│   ├── terra-senior.png
│   └── terra-graduate.png
├── badges/
│   ├── terraform-starter.svg
│   ├── hcl-crafter.svg
│   ├── module-builder.svg
│   ├── state-guardian.svg
│   ├── policy-reviewer.svg
│   └── platform-architect.svg
├── illustrations/
│   ├── cloud-connections.svg
│   ├── dependency-graph-example.svg
│   ├── plan-diff-scene.svg
│   └── empty-state.svg
└── asset-atlas.png

docs/design/reference/terraform-academy-concept.png
```

**Los SVG de infraestructura deben tener semántica accesible; los gráficos esenciales no pueden depender de la imagen.** La captura aceptada sirve para dirección estética, no se distribuye como una UI interactiva.

---

# 4. Design system completo

## 4.1. Dirección estética

- **80 % producto serio, 20 % diversión pixelada**, heredado de GoPixel.
- Base navy/índigo oscuro, **primario morado** en vez de cian Go, lila para destacados y dorado para Senior Mode. Fondos con bloques pixelados tenues, nubes/geometrías e iconos infra.
- La mascota se usa en hero, resultados y estados vacíos; **no en cada párrafo**.
- El código HCL y el plan mantienen gramática visual profesional, sin pixelar texto.
- El hero debe mantener la sensación de la referencia sin forzar recursos reales de AWS/Google/Azure en el MVP.
- Modo claro igual de diseñado y contrastado; no basta invertir colores.

## 4.2. Tokens propuestos (ajustar contraste en implementación)

| Token | Dark | Light | Uso |
|---|---|---|---|
| `--bg-canvas` | `#0C0B1B` | `#F7F5FF` | Fondo principal |
| `--bg-surface` | `#17152C` | `#FFFFFF` | Cards |
| `--bg-raised` | `#211D3D` | `#EFEBFF` | Inputs/aside |
| `--bg-editor` | `#0D1325` | `#F7F8FD` | Editor HCL |
| `--text-primary` | `#F5F3FF` | `#1C1835` | Texto principal |
| `--text-muted` | `#C2BDDB` | `#56506F` | Texto secundario |
| `--border` | `#413763` | `#CFC6EE` | Separadores/cards |
| `--purple-brand` | `#9457EC` | `#7142C4` | Identidad/links |
| `--purple-soft` | `#BE91FF` | `#6840AD` | Resaltados y pistas |
| `--accent-action` | `#A77BFF` | `#6436B0` | CTA con contraste validado |
| `--senior-gold` | `#F4C668` | `#825609` | Corona y estados Senior |
| `--success` | `#45D5A2` | `#147A59` | Checks correctos |
| `--warning` | `#FFD47C` | `#895700` | Alertas/planes inciertos |
| `--danger` | `#FF7B9C` | `#B5294A` | Error/destrucción |
| `--focus-ring` | `#D2B3FF` | `#5932B0` | Accesibilidad |

**Regla:** estos HEX representan la **propuesta** coherente con la imagen, no un muestreo certificado del PNG. Antes de cerrar UI, medir contraste WCAG AA por combinación texto/fondo y ajustar tonos si es necesario. **Nunca usar solo color** para explicar create/update/delete.

```css
:root {
  --pixel-unit: 4px;
  --header-height: 72px;
  --sidebar-width: 248px;
  --inspector-width: 312px;
  --radius-panel: 16px;
  --radius-control: 10px;
  --touch-min: 44px;
  --motion-short: 140ms;
  --motion-medium: 240ms;
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg-canvas: #0c0b1b;
  --bg-surface: #17152c;
  --bg-raised: #211d3d;
  --bg-editor: #0d1325;
  --text-primary: #f5f3ff;
  --text-muted: #c2bddb;
  --border: #413763;
  --accent-action: #a77bff;
  --senior-gold: #f4c668;
}

[data-theme="light"] {
  color-scheme: light;
  --bg-canvas: #f7f5ff;
  --bg-surface: #ffffff;
  --bg-raised: #efebff;
  --bg-editor: #f7f8fd;
  --text-primary: #1c1835;
  --text-muted: #56506f;
  --border: #cfc6ee;
  --accent-action: #6436b0;
  --senior-gold: #825609;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 4.3. Tipografía y medidas

| Elemento | Desktop | Móvil | Nota |
|---|---|---|---|
| Logo/wordmark | 24–32 px | 20–24 px | Texto HTML/SVG, no rasterizar textos |
| H1 landing | 48–68 px | 34–42 px | Jerarquía hero del PNG |
| H1 lección | 32–40 px | 27–32 px | Una línea si cabe; si no, natural |
| Títulos de cards | 18–22 px | 18–20 px | Legibilidad |
| Cuerpo | 15–17 px | 15–16 px | `line-height >= 1.55` |
| Código | 13–15 px | 13–14 px | Mono con zoom/font-size ajustable |
| Botones | >=44 px alto | >=44 px | Click/teclado/touch |
| Header | 72 px | 60–64 px | Nav colapsable |
| Hero ilustración | 32–42 % del ancho | debajo de título/CTA | `object-fit: contain` |

Tipografía sugerida: **Outfit/Inter o system UI** para producto; **JetBrains Mono / sistema mono** para HCL y consola. Pixel font solo para etiquetas mínimas y decoraciones. Cargar fuentes locales o con fallback robusto, respetando licencias.

## 4.4. Estados universales

Todos los controles y cards interactivos deben exponer: **default, hover, focus-visible, pressed, disabled, loading (solo si existe operación), success, failed y unavailable**. Error siempre contiene causa y siguiente paso. El progreso distingue **completado** de **visitado**. El editor distingue **sin cambios** de **borrador modificado** sin un chip permanente «guardado en localStorage».

**No sobresaturar:** badge Senior dorado, no convertir toda la UI en dorado. Mostrar estados de infraestructura con icono y texto: `+ CREAR`, `~ ACTUALIZAR`, `-/+ REEMPLAZAR`, `- DESTRUIR`, `= SIN CAMBIOS`.

---

# 5. Mapa de pantallas, navegación y microinteracciones

## 5.1. Menú principal (igual concepto que GoPixel)

**Header:** icono original de Terra + **marca pública original por definir** (alternativa «TerraPixel Academy» pendiente de validación) · `Inicio` · `Aprende Terraform` · `Minijuegos` · `Labs` · `Senior Mode` · a la derecha idioma (cuando exista localización), tema, toggle Senior y Ajustes. En el PNG, `Rutas`, `Laboratorios`, `Desafíos` y `Recursos` también son aceptables; consolidar navegación para no tener menús duplicados.

**Footer:** acerca de, método de evaluación, licencias/créditos, privacidad, documentación oficial de Terraform y descargo de no afiliación.

| Ruta hash | Pantalla | Entrega |
|---|---|---|
| `/#/` | Landing / `WelcomePage` | MVP |
| `/#/rutas` | Mapa de aprendizaje | MVP |
| `/#/aprender/:lessonId` | Teoría + editor + ejercicio | MVP |
| `/#/aprender/:lessonId?senior=1` | Senior transversal compatible | Senior |
| `/#/juegos` | Hub de minijuegos | MVP |
| `/#/juegos/:gameId` | Quiz / ordenar / bug hunt / predicción | MVP |
| `/#/laboratorios` | Catálogo de packs Terraform | MVP |
| `/#/laboratorios/:labId` | Guía, riesgos y descarga | MVP |
| `/#/grafo/:fixtureId` | Explorer de dependencias | Fase interactiva |
| `/#/plan/:fixtureId` | Explorer de cambios de ejemplo | Fase interactiva |
| `/#/senior` | Dashboard de 18 retos | Senior |
| `/#/senior/:moduleId` | Resumen de módulo, prerrequisitos y retos | Senior |
| `/#/senior/:moduleId/:challengeId` | Laboratorio Senior con evidencias y ADR | Senior |
| `/#/senior/S18/capstone` | Evaluación final | Senior |
| `/#/progreso` | Perfil de avance y badges | MVP |
| `/#/ajustes` | Preferencias, exportar, importar, limpiar | MVP |
| `/#/acerca` | Privacidad, licencias y límites del motor | MVP |
| `/#/no-encontrado` | Estado de ruta inválida | MVP |

**Hash routing** permite refrescar rutas en GitHub Pages sin 404; centralizar generación de URL para respetar el `base` de Vite.

## 5.2. Landing exacta

**Zona A — header**: marca original propia con Terra y navegación; tema y Senior toggle persistentes. **El logotipo Terraform oficial no forma parte de la marca ni del casco de la mascota.**

**Zona B — hero**:

- Eyebrow: `APRENDE TERRAFORM PASO A PASO`.
- Título: **«Construye, versiona y entrega infraestructura como código»**.
- Bajada: «Desde cero hasta Platform Engineering, con ejercicios HCL, laboratorios auténticos y desafíos de producción».
- CTA primario: **«Comenzar ruta»** si no hay avance, **«Continuar»** si existe último módulo válido.
- CTA secundario: **«Explorar temario»**; «Ver demo» solo si existe una demo implementada.
- Ilustración: Terra con laptop, mochila, plano y cubos/nubes, reproduciendo composición del PNG.
- Métricas editoriales: **54 módulos · 18 retos Senior · 8 itinerarios**; si el contenido se publica por fases, mostrar **módulos disponibles reales** junto a «programa previsto», evitando anunciar lecciones incompletas como accesibles.

**Zona C — mapa**: 4 cards: Básico / Intermedio / Avanzado / Senior; badges de dificultad, progreso y CTA.

**Zona D — «Aprende con casos reales»**: 3 cards: Editor HCL, Plan Explorer y Labs descargables. La card de ejecución lleva distintivo `en navegador (educativo)` o `CLI local (real)`.

**Zona E — footer**: información educativa y atribuciones.

### Comportamiento de START

```text
if no completed/started lesson:
  redirect /#/aprender/B01
else if lastLessonId exists in published content:
  redirect /#/aprender/<lastLessonId>
else:
  redirect /#/rutas
```

Nunca sobreescribir progreso previo al alternar Senior ON/OFF.

## 5.3. Aula / lección

La estructura respeta la lección GoPixel y el cuadrante del editor en el PNG, con tres columnas en pantallas amplias:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Marca propia     Inicio  Rutas  Juegos  Labs  Senior      [tema] [Senior ON/OFF] [Ajustes] │
├────────────────┬───────────────────────────────────────────────┬───────────────────────────┤
│ CURRÍCULO      │ B04 · TU PRIMER RECURSO                       │ PASO A PASO               │
│ ○ B01           │ Aprende qué declara un recurso                │ 1. Concepto               │
│ ○ B02           │                                               │ 2. Ejemplo                │
│ ● B04           │ [Teoría + microcards + Terra leyendo]         │ 3. Ejercicio              │
│ ...             │                                               │ 4. Comprobación           │
│                 │ [TU MISIÓN: modifica main.tf]                 │ 5. Retroalimentación      │
│ Progreso 3/12   │ ┌─ main.tf ─ variables.tf ─ outputs.tf ─────┐│                           │
│                 │ │ editor HCL                                   ││ [Terra idea/pista]        │
│                 │ └──────────────────────────────────────────────┘│                           │
│                 │ [Validar ejercicio] [Ver plan de ejemplo]      │                           │
│                 │ [Aplicar (simulado)] [Descargar lab real]      │                           │
│                 │ [Evaluación + diferencias + próximo paso]     │                           │
├────────────────┴───────────────────────────────────────────────┴───────────────────────────┤
│ Créditos · Método de evaluación · Recursos oficiales                                      │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

**Orden obligatorio de una lección:** breadcrumb → objetivos → contexto → explicación → ejemplo → misión → editor/actividad → comprobación → feedback → explicación de errores → enlace a lab auténtico → anterior/siguiente.

**Editor:** pestañas para archivos permitidos, copy, restablecer con confirmación, pista en tres etapas, solución con confirmación y aviso de que no acredita evaluación. Mantener drafts separados para normal y Senior.

## 5.4. Botones y verdad operativa

| Botón | Acción real | Copia de UI obligatoria |
|---|---|---|
| `Comenzar / Continuar` | Navegar a lección disponible | Nunca enlaza a ruta vacía |
| `Validar ejercicio` | Ejecutar reglas del reto en el navegador | «Evaluación educativa; no ejecuta Terraform CLI» |
| `Ver plan de ejemplo` | Cargar fixture `.json` y explicación | «Plan de ejemplo — NO generado desde tu HCL» |
| `Aplicar (simulado)` | Mostrar secuencia pedagógica sin crear recursos | «Simulación: no se creó infraestructura» |
| `Descargar laboratorio` | Descargar ZIP ya generado y probado | Mostrar versión y requisitos del pack |
| `Copiar HCL` | Copiar el archivo activo | Confirmar visualmente la acción |
| `Pista` | Mostrar orientación → concepto → fragmento | No marcar tarea como completada |
| `Ver solución` | Revelar con confirmación | No conceder puntos de comprobación |
| `Restablecer` | Restaurar draft actual tras confirmación | No borrar otros ejercicios |
| `Senior Mode` | Cambiar profundidad y drafts compatibles | Mismo tema; no borra progreso |
| `Exportar progreso` | JSON descargable validado | No exportar secretos ni datos no reconocidos |
| `Importar progreso` | Validar/migrar y pedir confirmación | No reemplazar estado silenciosamente |
| `Ejecutar Terraform real` | **No existe en el MVP web** | Solo instrucciones en terminal del alumno |

El control del PNG `Validar / Plan / Aplicar (simulado)` es una **referencia gráfica**; su implementación debe usar las etiquetas explícitas anteriores para evitar engaño técnico.

## 5.5. Minijuegos, uno por mecánica

| ID | Juego | Actividad Terraform | Evaluación |
|---|---|---|---|
| G01 | **HCL Quiz** | Escoger el significado correcto de `resource`, `data`, `module`, `local` | Respuesta exacta + por qué |
| G02 | **Fill the HCL** | Completar un atributo o referencia (`var.name`) | Regla de ejercicio acotada |
| G03 | **Ordena el flujo** | Orden lógico `init` → `validate` → `plan` → revisión → `apply` | Secuencia + matiz de contexto |
| G04 | **Predict the Plan** | Leer cambios predefinidos y anticipar create/update/replace/delete | Comparación contra fixture |
| G05 | **Bug Hunt / Policy Hunt** | Detectar interpolación incorrecta, secretos, CIDR amplios o cambio peligroso | Hallazgo + evidencia + explicación |

No usar una simulación superficial que da XP solo por pulsar. Cada juego incluirá **enunciado, objetivo, respuesta, explicación, segundo intento y accesibilidad sin drag-and-drop obligatorio**. Para ordenar, permitir flechas o selección con teclado.

## 5.6. Pantallas de grafo y plan

**Dependency Graph:** recursos como nodos, referencias como aristas dirigidas, leyenda y tabla textual equivalente; mostrar dependencias explícitas e implícitas en fixtures curados. Al seleccionar nodo, explicar atributos, módulo, entornos, seguridad y consecuencias de borrarlo. Grafo inicial **de ejemplos**, no de HCL arbitrario sin parser completo.

**Plan Explorer:** lista de `+`, `~`, `-/+`, `-`, `=`; filtro por acción, recurso, criticidad y costo estimado. Tarjeta lateral: **Qué cambia, por qué importa, qué revisar, siguiente paso**. Datos iniciales **ficticios o saneados**, declarados como tales. La vista debe ser accesible como tabla y no prometer `terraform plan` real.

## 5.7. Responsive

- **>= 1280 px:** tres columnas (sidebar 248, main flexible, aside 312).
- **768–1279 px:** sidebar plegable, main + aside adaptable, sin cortar editor.
- **< 768 px:** una columna, menú tipo drawer, aside como acordeón, editor scroll horizontal controlado y botones en 2 filas/stack.
- Hero: texto/CTA primero, Terra debajo; nunca texto legible dentro de una imagen como único contenido.
- No forzar 1536px de ancho porque el concept board mida 1536px.
- `prefers-reduced-motion` deshabilita efectos de pixel/partículas; modo oscuro no implica animaciones.

---

# 6. Stack tecnológico elegido y ADR

## 6.1. Decisión base — SPA estática de un producto

| Capa | Elección para el MVP | Razón / restricción |
|---|---|---|
| Runtime UI | **Preact + TypeScript `strict`** | Cercano a GoPixel, ligero, dueño del árbol de componentes |
| Tooling | **Vite + pnpm** | Build reproducible, salida estática |
| Estado | **Preact Signals**, solo donde es útil | Progreso/preferencias/editor; evitar globalizar todo |
| Router | **Hash router mínimo** | GitHub Pages y back/forward sin rewrite del servidor |
| Estilos | **Tokens CSS + CSS modular**; Tailwind CSS 4 opcional | Consistencia sin dependencia obligatoria |
| Editor | **CodeMirror 6** | Editor usable, extensión HCL verificada con fixture y testing |
| Contenido | **Markdown + manifiestos JSON + Zod** | Separación de experiencia y currículo; esquema versionado |
| Diagrama | **SVG accesible**; Mermaid para docs; ELK.js **si el layout lo requiere** | Grafo ligero sin backend |
| Pruebas UI | **Vitest + Testing Library + Playwright** | Unitarias, E2E, navegador real y regresión visual |
| QA HCL real | **Terraform CLI** en CI y en labs locales | Fuente de verdad sintáctica/funcional cuando se ejecuta |
| IaC extra | **TFLint + Trivy/Checkov + OPA/Conftest** en labs aplicables | Seguridad y calidad verificable |
| FinOps | **Infracost** en módulos cloud avanzados | Mostrar costo estimado, no factura real |
| Delivery | **GitHub Actions** con SHA pinning y permisos mínimos | Calidad y release trazables |
| Hosting | **GitHub Pages** (Cloudflare Pages alternativa) | Cero backend y operaciones mínimas |

**Versiones:** no inventar números «más recientes». Determinar versiones exactas cuando se materialice `package.json`/`pnpm-lock.yaml` y la versión Terraform de labs; contrastar `vigilio-docs/technology/versions.md` con releases y compatibilidad real. Se prohíbe combinar instrucciones de Preact 10 y 11 sin verificación del lockfile elegido.

## 6.2. ADR-001: por qué NO NestJS y NO Kubernetes para alojar la academia

**Contexto:** el producto es un conjunto de lecciones, ejercicios y descargas que inicialmente puede servirse con HTML/CSS/JS estáticos.  
**Decisión:** hosting estático.  
**Ventajas:** simplicidad, costos bajos, resiliencia, ausencia de cuentas, fácil versionado y menor superficie de ataque.  
**Alternativas descartadas por ahora:** NestJS + Postgres + Redis, ECS, EKS, K8s, microfrontends, SSR, ejecución Terraform alojada.  
**Reevaluación:** cuando se apruebe autenticación sincronizada, cohortes, evaluación docente, telemetría consentida o un sandbox remoto con presupuesto y threat model.  
**Consecuencia:** no se pueden certificar ejecuciones remotas ni sincronizar progreso multi-dispositivo en el MVP.

## 6.3. ADR-002: Terraform como núcleo, no mezclar ownership

- **Núcleo:** Terraform oficial + HCL + providers + módulos + CLI + state + testing.
- **Complementos:** AWS/Azure/GCP y GitHub Actions cuando ayudan a entender Terraform.
- **Comparaciones optativas:** OpenTofu, CDK, CDKTF, Pulumi, Terragrunt, Kubernetes, Helm, GitOps. No se enseñarán como sustitutos de los fundamentos Terraform.
- **Límite de ownership:** un recurso tiene un controlador de IaC claramente asignado; no mezclar Terraform y CDK administrando simultáneamente el mismo recurso.
- **Distinción conceptual:** el Terraform que puede aprovisionar un clúster Kubernetes **no** implica que la web educativa tenga que desplegarse en Kubernetes.

## 6.4. ADR-003: por qué no «Terraform en el navegador» de primeras

Un editor HCL puede ejecutarse en la web. La CLI oficial, los providers y sus plugins requieren un entorno adecuado; ejecutar código arbitrario o montar providers de usuario introduce ejecución de binarios, red, credenciales, filesystem y riesgo de facturación. Por tanto:

- MVP: **revisiones de ejercicio acotadas** + fixtures **etiquetados** + descarga de labs reales.
- Futuro: sandbox con aislamiento fuerte y allowlist; nunca vender un `plan` ficticio como real.
- Si existe parser HCL compatible comprobado para navegador, puede ampliar **diagnóstico de sintaxis**, pero **no** sustituye a `terraform validate` ni a la evaluación de providers/state.

---

# 7. Arquitectura y contratos de datos

## 7.1. Estructura propuesta del repositorio

```text
terraform-academy/
├── README.md
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── biome.json                 # Si Biome se confirma como linter/formateador del repo
├── .gitignore
├── .github/
│   ├── workflows/
│   │   ├── quality.yml
│   │   ├── terraform-labs.yml
│   │   └── deploy-pages.yml
│   └── dependabot.yml
├── docs/
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── adr-001-static-spa.md
│   │   ├── adr-002-terraform-ownership.md
│   │   └── adr-003-execution-boundary.md
│   ├── design/
│   │   ├── tokens.md
│   │   ├── components.md
│   │   └── reference/
│   │       └── terraform-academy-concept.png
│   ├── curriculum/
│   ├── security/
│   ├── evidence/
│   └── release/
├── content/
│   ├── catalog.json
│   ├── tracks.json
│   ├── lessons/
│   │   ├── basic/
│   │   ├── intermediate/
│   │   ├── advanced/
│   │   └── senior/
│   ├── games/
│   ├── challenges/
│   ├── plan-fixtures/
│   ├── graph-fixtures/
│   ├── translations/
│   │   └── es.json
│   └── schema/
│       ├── lesson.schema.json
│       ├── challenge.schema.json
│       └── lab.schema.json
├── public/
│   ├── assets/
│   │   ├── brand/
│   │   ├── mascot/
│   │   ├── badges/
│   │   └── illustrations/
│   └── downloads/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── app-router.ts
│   │   └── AppShell.tsx
│   ├── design-system/
│   │   ├── tokens.css
│   │   ├── components/
│   │   └── icons/
│   ├── features/
│   │   ├── home/
│   │   ├── curriculum/
│   │   ├── lessons/
│   │   ├── hcl-editor/
│   │   ├── exercises/
│   │   ├── games/
│   │   ├── graph-explorer/
│   │   ├── plan-explorer/
│   │   ├── labs/
│   │   ├── senior/
│   │   ├── progress/
│   │   └── settings/
│   ├── content-runtime/
│   │   ├── content-loader.ts
│   │   ├── schemas.ts
│   │   └── integrity.ts
│   └── styles/
│       └── app.css
├── labs-terraform/
│   ├── manifest.json
│   ├── basic/
│   │   └── B04-first-resource/
│   ├── intermediate/
│   ├── advanced/
│   ├── senior/
│   └── capstone/
├── scripts/
│   ├── verify-catalog.ts
│   ├── package-labs.ts
│   ├── verify-lab-manifest.ts
│   └── verify-assets.ts
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    ├── accessibility/
    └── visual/
```

**Una sola fuente de verdad por responsabilidad:** el currículo se define en `content/`, los archivos Terraform reales en `labs-terraform/`, la interacción en `src/features/`, las reglas visuales en `design-system/`. Los contratos de contenido son **del producto**, versionados con él, no una carpeta global compartida entre stacks ajenos.

**Importante:** `index.zip` original puede conservarse **solo como referencia** fuera del producto; no copiar `labs-native/` Go como si fuesen labs Terraform.

## 7.2. Ownership y dependencias

```text
AppShell / Router
      │
      ├── Curriculum  ───────────┐
      ├── Lesson UI              │
      ├── HCL Editor ── Exercise │
      ├── Plan Explorer          ├── Content Runtime (tipado, validado)
      ├── Graph Explorer         │
      ├── Games                  │
      ├── Senior Mode            │
      └── Labs Catalog ──────────┘
             │
             └── public/downloads/*  <── empaquetador CI desde labs-terraform/*

Progress (local, versionado) <── eventos explícitos de comprobación
Design System         ──────────> todas las pantallas, sin lógica de negocio
```

Reglas:

- Un componente UI no interpreta HCL arbitrario ni decide si algo es «plan real».
- Los evaluadores puros no importan Preact, DOM ni `localStorage`.
- Una lección referencia un `exerciseId` y un `labId`; la lógica de aprobación está versionada en su evaluador, no incrustada en JSX.
- Las vistas leen `content-runtime` con acceso tipado; los ejercicios no inventan soluciones que no estén en el manifiesto.
- El `LabDownloader` solo sirve artefactos CI cuyos hashes, versiones y pruebas estén registrados.

## 7.3. Modelo de lección

```ts
type Track = 'basic' | 'intermediate' | 'advanced' | 'senior';
type ActivityMode = 'browser-educational' | 'fixture-demo' | 'local-terraform';
type ContentStatus = 'planned' | 'draft' | 'ready' | 'published';

type Lesson = {
  id: string;                       // "B04"
  slug: string;                     // "primer-recurso"
  version: number;                  // migraciones del contenido
  status: ContentStatus;
  track: Track;
  title: string;
  summary: string;
  estimatedMinutes: number;
  prerequisites: string[];          // IDs de lecciones existentes
  objectives: string[];
  concepts: string[];
  bodyMarkdownPath: string;
  examples: Array<{ id: string; language: 'hcl' | 'shell' | 'json'; path: string }>;
  activityIds: string[];
  labId?: string;
  seniorChallengeId?: string;
  keywords: string[];
};

type BrowserExercise = {
  id: string;
  lessonId: string;
  title: string;
  statement: string;
  mode: 'browser-educational';
  initialFiles: Record<string, string>;
  writableFiles: string[];
  evaluatorId: string;              // registered deterministic evaluator
  evaluatorVersion: number;
  hints: [string, string, string];
  solutionFiles: Record<string, string>;
  explanations: Record<string, string>;
  fixturePlanId?: string;            // always tagged example
  difficulty: 'easy' | 'medium' | 'hard';
};

// Contratos explicativos; la implementación precisa validación Zod y tipos inferidos.
```

### JSON de catálogo ilustrativo

```json
{
  "catalogVersion": 1,
  "language": "es",
  "tracks": [
    { "id": "basic", "label": "Básico", "expectedCount": 12 },
    { "id": "intermediate", "label": "Intermedio", "expectedCount": 12 },
    { "id": "advanced", "label": "Avanzado", "expectedCount": 12 },
    { "id": "senior", "label": "Senior Mode", "expectedCount": 18 }
  ],
  "lessons": [
    {
      "id": "B04",
      "slug": "primer-recurso",
      "version": 1,
      "track": "basic",
      "status": "draft",
      "title": "Tu primer recurso Terraform",
      "prerequisites": ["B01", "B02", "B03"],
      "activityIds": ["B04-E01"],
      "labId": "B04-first-resource"
    }
  ]
}
```

**Nota:** el estado `draft` es intencional porque B04 todavía no está implementado ni auditado; este es un **fragmento de catálogo**; el validador debe aceptar un catálogo en desarrollo pero **bloquear publicación final** si las cantidades anunciadas no corresponden con recursos `published` completos, todos los IDs o referencias fallan, falta contenido o no hay evaluador registrado.

## 7.4. Modelo de ejecución/evidencia

```ts
type EvidenceStatus = 'PASS' | 'FAIL' | 'NOT_RUN' | 'BLOCKED';
type EvidenceSource =
  | 'browser-rule-engine'
  | 'browser-fixture'
  | 'terraform-cli-local'
  | 'terraform-cli-ci'
  | 'manual-self-review'
  | 'external-review';

type Evidence = {
  id: string;
  checkId: string;
  status: EvidenceStatus;
  source: EvidenceSource;
  sourceVersion: string;
  summary: string;
  details?: string;
  checkedAt?: string;               // sólo si existe evidencia real
  fixtureId?: string;
  commitSha?: string;               // sólo si corresponde
  artifactHash?: string;             // sólo para artefactos verificados
};

type ValidationResult = {
  exerciseId: string;
  passed: boolean;
  source: 'browser-rule-engine';
  checks: Array<{
    id: string;
    passed: boolean;
    message: string;
    expected?: string;
    actual?: string;
  }>;
  explanation: string;
  notSupported: string[];
};
```

**Semántica crítica:** `PASS` del `browser-rule-engine` significa «cumplió este ejercicio». **No significa `terraform validate PASS`**. La interfaz siempre muestra la fuente y el alcance. Un lab probado por CI puede mostrar «pack revisado en CI» con hash/commit; **no** se debe afirmar que el código editado por el alumno pasó CI.

## 7.5. Persistencia local y migración

```ts
type AcademyProgressV1 = {
  schemaVersion: 1;
  catalogVersionSeen: number;
  settings: {
    theme: 'system' | 'light' | 'dark';
    seniorMode: boolean;
    language: 'es';
    reducedMotion: boolean;
  };
  lastLessonId?: string;
  completedLessonIds: string[];
  completedGameIds: string[];
  completedSeniorChallengeIds: string[];
  normalDrafts: Record<string, Record<string, string>>;  // ejercicio: archivos
  seniorDrafts: Record<string, Record<string, string>>;
  seniorNotes: Record<string, string>;
  hintRevealCount: Record<string, number>;
  achievements: string[];
};
```

**Protección:** Zod al leer y escribir, claves versionadas (`terraform-academy:progress:v1`), migración explícita, límite de tamaño de drafts, fallback seguro si el storage falla, export JSON con esquema permitido y **sin estado Terraform ni credenciales**. Nunca usar `innerHTML` con código de usuario sin sanitizar. Un usuario puede borrar almacenamiento del navegador y perder datos: indicarlo en Ajustes.

Si un editor contiene secretos potenciales, **evitar persistirlos**, mostrar advertencia y mantenerlos solo en memoria de sesión; el detector es defensa adicional, no reemplaza evitar pegar secretos reales.

---

# 8. Motor educativo de HCL, plan y evaluación

## 8.1. Capacidad real por botón

La plataforma debe tener tres motores lógicamente independientes:

1. **`ExerciseRuleEngine`:** funciones TS puras que comprueban patrones y valores de un ejercicio específico; apto para ejemplos controlados. No afirma interpretar todo Terraform.
2. **`FixturePlanEngine`:** lee escenarios precomputados y saneados; produce cambios/leyendas consistentes según respuestas acotadas del alumno. No invoca la CLI.
3. **`LocalTerraformLab`:** **no ejecuta en la web**; es un pack con HCL y tests que corre bajo Terraform CLI del alumno y en CI permitido. El progreso local puede registrar que el alumno indicó haberlo ejecutado, pero sin evidencia importada verificada no se marca como `terraform-cli-ci`.

### No implementar una pseudo-CLI fraudulenta

| Característica | Navegador sin Terraform | Terraform CLI auténtico |
|---|---|---|
| Coloreado HCL | Sí | N/A |
| Edición de archivos `.tf` | Sí | Sí |
| Regla «existe variable con este nombre» | Sí, acotada | N/A |
| `terraform fmt` real | No | Sí |
| `terraform validate` real | No | Sí, inicializando dependencias |
| `terraform plan` real con providers/state | No | Sí, con contexto y acceso correspondiente |
| `terraform apply` real | **Nunca** | Solo lab expresamente autorizado |
| Pruebas nativas `.tftest.hcl` | No | Sí |
| Plan de ejemplo | Sí, **rotulado** | N/A |

El formateo **real** no debe aparecer como botón en la web mientras no haya formateador HCL compatible verificado. Un simple prettifier visual no es `terraform fmt`.

## 8.2. Pipeline de validación del ejercicio

```text
Alumno escribe HCL
    ↓
Preflight: archivo permitido + tamaño + modelo del ejercicio
    ↓
Reglas puras TS (sobre contenido del ejercicio acotado)
    ↓
Resultados: PASS/FAIL por expectativa verificable
    ↓
Explicación pedagógica + pista siguiente
    ↓
Progreso / XP si evaluación aprobada bajo reglas publicadas
    ↓
Opción de descargar lab auténtico y ejecutar Terraform local
```

Recomendación de implementación: para checks semánticos básicos, usar parser de gramática HCL **solo tras evaluar fidelidad y compatibilidad**. Hasta entonces, los verificadores por tokens/reglas deberían estar confinados a ejercicios de formato controlado. Evitar aprobar respuestas erróneas por coincidencia de regex: añadir casos negativos, cambios de orden, whitespace, comentarios, nombres parecidos y atributos falsos. Si una solución fuera del subconjunto del motor podría ser correcta, responder **«No puedo verificar esta variante aquí»** y ofrecer laboratorio CLI, no declarar que Terraform la rechazaría.

## 8.3. Registro de verificadores

```ts
type ExerciseEvaluator = (
  files: Readonly<Record<string, string>>
) => ValidationResult;

const evaluators: Record<string, ExerciseEvaluator> = {
  'B04-E01:v1': evaluateB04E01,
  'B05-E01:v1': evaluateB05E01,
  'I05-E01:v1': evaluateI05E01,
};

function evaluateB04E01(files: Readonly<Record<string, string>>): ValidationResult {
  const source = files['main.tf'] ?? '';
  // Reglas acotadas; reemplazar matcher trivial por comprobación estructural probada.
  const hasResource = /resource\s+"terraform_data"\s+"demo"\s*\{/.test(source);
  const hasInput = /input\s*=\s*"Hola, Terraform"/.test(source);
  const passed = hasResource && hasInput;
  return {
    exerciseId: 'B04-E01',
    passed,
    source: 'browser-rule-engine',
    checks: [
      { id: 'has-resource', passed: hasResource, message: hasResource ? 'Recurso encontrado' : 'Falta declarar terraform_data.demo' },
      { id: 'has-input', passed: hasInput, message: hasInput ? 'Input encontrado' : 'Configura el texto esperado' },
    ],
    explanation: 'Un recurso terraform_data permite practicar el lenguaje sin credenciales de nube.',
    notSupported: ['Validación completa de HCL', 'Invocación de providers', 'Plan y apply reales'],
  };
}
```

> **Este fragmento demuestra el contrato, no un evaluador listo para producción.** Dos regex independientes pueden dar falsos positivos si `input` aparece en otro bloque. El gate real exige pruebas adversariales y, para este ejercicio, asociación correcta de atributo con su bloque o un parser estructural compatible.

## 8.4. `PlanFixture`: tipado y protección

```ts
type PlanAction = 'create' | 'update' | 'delete' | 'replace' | 'no-op' | 'read';

type PlanFixture = {
  id: string;
  title: string;
  classification: 'synthetic' | 'sanitized-real-example';
  terraformVersionLabel: string;
  scenarioVersion: number;
  resources: Array<{
    address: string;
    type: string;
    action: PlanAction;
    beforeSummary?: string;
    afterSummary?: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    costImpact?: { description: string; amount?: number; currency?: string; isEstimate: boolean };
  }>;
  expectedFindings: string[];
  answerKeyVersion: number;
};
```

**Precisión:** el formato anterior es **interno y educativo**. Si en el futuro se consumen planes JSON oficiales (`terraform show -json`), implementar un **adaptador versionado, con saneamiento**, mapeando `resource_changes[].change.actions` y acciones combinadas a nuestro modelo. Nunca publicar `tfplan`, `tfstate`, output sensible ni el JSON completo sin sanitización y revisión.

## 8.5. Grafo de dependencias

- V1: fixture versionado `nodes[]`, `edges[]`, módulos, riesgo, leyenda y descripción textual.
- V2: derivar parte del grafo a partir de HCL analizado con parser compatible, con límites documentados.
- `depends_on` y referencias configuran relaciones; no se deben inventar dependencias por mera proximidad visual.
- Al seleccionar un recurso, mostrar **dependencias entrantes/salientes**, probable impacto si se modifica y dónde revisar.
- Filtros: recurso, módulo, ambiente, tipo, criticidad; navegación por teclado.

## 8.6. Motor de pistas y aprendizaje

```text
Intento 1  → feedback de regla específica
Pista 1    → recordar concepto (no revelar código)
Pista 2    → apuntar al bloque/atributo correcto
Pista 3    → mostrar un fragmento y explicar por qué
Solución   → confirmación, código final, explicación completa
```

**Política XP:** solo dar XP de comprobación por criterios realmente cumplidos. Si se revela solución, registrar `solutionRevealed: true`; permitir aprendizaje y progreso de lectura, pero no otorgar el mismo logro de resolución autónoma. El sistema puede mostrar rúbrica y revisión propia sin inventar acreditación oficial.

## 8.7. Diseño de minijuegos y casos negativos

- Quiz: distractores técnicamente plausibles; no confundir `data` con `resource` ni `module` con provider.
- Orden: una etapa lógica, no obligar `apply` en todos los workflows (CI puede tener gates y aprobación).
- Predict Plan: explicitar que reemplazar es destruir+crear, que `sensitive` oculta output pero no necesariamente el state y que planes pueden variar por provider/state.
- Bug Hunt: exigir hallar *línea, regla infringida y corrección*, no pulsar en un área al azar.
- FinOps: cifras de ejemplo **estimadas**; jamás precio actual no verificado ni facturación real.

---

# 9. Currículo: 54 módulos y ocho itinerarios

## 9.1. Arquitectura pedagógica

**54 módulos:** Básico **12**, Intermedio **12**, Avanzado **12**, Senior **18**. Los ocho itinerarios son **reordenaciones/especializaciones** de contenido, no otros ocho módulos ni cursos ya implementados.

Todo módulo publicado tendrá:

1. ID estable y título; prerrequisitos verificables.
2. Objetivo específico en una frase observable.
3. Explicación breve y ejemplo correcto.
4. Visualización o decisión contextual (si aporta valor).
5. Una misión interactiva y al menos un caso negativo.
6. Feedback explicativo.
7. Referencia oficial y lab real cuando el tema lo justifique.
8. Evaluación de comprensión y registro de avance.

## 9.2. Básico — 12 lecciones

| ID | Título | Objetivo de aprendizaje | Práctica principal |
|---|---|---|---|
| B01 | IaC, declarativo vs imperativo | Explicar qué resuelve Terraform y qué NO resuelve | Clasificar escenarios de infraestructura |
| B02 | Instalación y CLI | Identificar `terraform version`, directorio y CLI | Terminal guiada / laboratorio local |
| B03 | Sintaxis HCL | Reconocer bloque, atributo, expresión y comentario | Completar HCL sin cloud |
| B04 | Tu primer recurso | Crear `terraform_data`, input y output | Editor + test local sin nube |
| B05 | Variables y tipos | Parametrizar un root module con validación | Corregir `variable` y `.tfvars.example` |
| B06 | `locals` y outputs | Reutilizar expresiones y publicar valores no sensibles | Armar `locals` y `output` |
| B07 | Grafo de dependencias | Identificar referencias y dependencias | Ordenar nodos y flechas |
| B08 | `init`, `fmt`, `validate` | Distinguir inicialización, formato y validación | Ordenar comandos y prueba local |
| B09 | `plan`, `apply`, `destroy` | Explicar ciclo de vida y riesgos | Leer plan de ejemplo; no apply real web |
| B10 | Estado y datos sensibles | Explicar por qué state es confidencial | Identificar un leak en ejemplo saneado |
| B11 | `count`, `for_each`, `lifecycle` | Elegir direccionamiento estable | Simular cambio de claves y reemplazos |
| B12 | Proyecto final básico | Unir variables, recursos, outputs y pruebas | Pack Terraform sin cloud |

**Requisito de graduación básica:** poder explicar que `validate` no contacta recursos remotos y que `plan` depende de contexto, providers y state. La capacidad de escribir HCL debe estar respaldada por pruebas locales reales en al menos un pack.

## 9.3. Intermedio — 12 lecciones

| ID | Título | Objetivo de aprendizaje | Práctica principal |
|---|---|---|---|
| I01 | Diseño de módulos | Crear módulo reusable, entradas/salidas y límites de ownership | Módulo parametrizado |
| I02 | Versiones y lockfile | Fijar Terraform/proveedores y entender `.terraform.lock.hcl` | Revisar dependencias y upgrades |
| I03 | `data` sources y references | Comparar consulta de data vs recursos gestionados | Clasificar y conectar referencias |
| I04 | `for_each`, `count` y direcciones | Analizar estabilidad, cambios y `moved` | Predecir impacto en direcciones |
| I05 | Lectura profesional de planes | Clasificar operaciones y riesgo | Plan Explorer |
| I06 | Remote state y locking | Diseñar backend separado, cifrado y con bloqueo | Diagrama de state y carrera simulada |
| I07 | Entornos y capas | Separar network/data/compute por ownership | Construir arquitectura de stacks |
| I08 | Outputs entre módulos | Contratos entre módulos sin acoplamientos indebidos | Encadenar resultados |
| I09 | `terraform test` y mocks | Diferenciar tests con mocks e integración real | `.tftest.hcl` seguro |
| I10 | Lint, IaC scanning y policy | Detectar violaciones antes de la nube | Findings + corrección |
| I11 | Pipeline de PR | Diseñar plan, revisión, aprobación y OIDC | Armar pipeline seguro |
| I12 | Proyecto intermedio | Módulo reutilizable con tests y CI | Lab descargable + evidencia |

## 9.4. Avanzado — 12 lecciones

| ID | Título | Objetivo de aprendizaje | Práctica principal |
|---|---|---|---|
| A01 | Importación y `moved` | Incorporar recursos existentes sin destrucción accidental | Proponer import/moved |
| A02 | Migración de estado | Definir backup, locking y pasos reversibles | Dry-run documentado |
| A03 | Secretos, sensitive, ephemeral | Distinguir redacción de exclusión de state | Análisis de exposición |
| A04 | IAM y OIDC para Terraform | Permisos mínimos de un pipeline de cloud | Revisar trust policy ficticia |
| A05 | Redes, CIDR y VPC | Prevenir solapamientos, zonas y errores de conectividad | Validar rangos + grafo |
| A06 | Drift y reconciliación | Detectar diferencia Git/infra/state y decidir respuesta | Incidente con plan de ejemplo |
| A07 | Reemplazos y disponibilidad | Evaluar `create_before_destroy` y límites de provider | Plan con blast radius |
| A08 | Policy as Code | Aplicar Conftest/OPA a configuraciones o planes saneados | Ajustar política y prueba |
| A09 | FinOps de IaC | Justificar costos estimados, tags y presupuestos | Diff económico de ejemplo |
| A10 | AWS multiambiente | Separar estados e identidades por entorno | Blueprint AWS opcional |
| A11 | Terraform, Helm y GitOps | Establecer ownership de clúster vs workloads | ADR de límites de gestión |
| A12 | Proyecto avanzado | Integrar seguridad, CI, state y evidencias | Propuesta auditable y tests |

**Nota sobre nube:** A10 puede empezar como arquitectura simulada y disponer de un pack opcional AWS; no hacer que el estudiante pague para alcanzar conceptos fundamentales.

## 9.5. Itinerarios de especialización — ocho

| Itinerario | Base mínima | Proyecto de salida |
|---|---|---|
| AWS | B01–B12, I01–I11, A04/A05/A10 | Infra AWS en cuenta sandbox con permisos y costos controlados |
| Azure | Básico/intermedio y módulos equivalentes de state/identidad | Blueprint Azure con backend Blob Leases |
| GCP | Básico/intermedio y módulos equivalentes de state/identidad | Blueprint GCP con GCS backend |
| Módulos | I01/I02/I08/I09, A01 | Library con semver, contrato y tests |
| Seguridad | B10, I10, A03/A04/A08 | Políticas, secrets hygiene y revisión de PR |
| CI/CD | I09–I12, A06/A07 | Gate PR, plan aprobado, promoción segura |
| Kubernetes/GitOps | I07, A05/A11 | Definir frontera Terraform vs Helm/GitOps |
| Alternativas IaC | Fundamentos + ownership | Comparar Terraform/OpenTofu/CDK/Pulumi sin doble propietario |

**Contenido publicado de verdad:** mostrar `Disponible` únicamente si existe cuerpo, actividad, solución, pruebas y criterio editorial. `Próximamente` para el resto, con ruta de seguimiento clara pero sin CTA roto.

## 9.6. Lección ejemplar B04 — diseño de pantalla y pedagogía

**Título:** «Tu primer recurso en Terraform».  
**Duración prevista:** 12–20 min (estimación editorial, no medida real).  
**Objetivo:** el alumno declara un `terraform_data` con un `input` dado y comprende que un `output` expone un valor.  
**Sin dependencia cloud:** Terraform incluye el tipo `terraform_data` a través del provider **integrado** (`terraform.io/builtin/terraform`) para practicar recursos sin necesitar un proveedor cloud externo. Su atributo `output` es **computado y normalmente desconocido en el plan inicial**; se conoce tras aplicar, aunque el ejemplo de `terraform test` comprobará el `input` conocido durante `plan`. Fuente: <https://developer.hashicorp.com/terraform/language/resources/terraform-data>.  
**Mascota:** `terra-reading.png` en teoría y `terra-success.png` tras resolver.

**Paso a paso del alumno:**

1. Leer diferencia entre configuración y estado.
2. Revisar un bloque `resource "terraform_data" "demo"`.
3. Completar el atributo `input` y revisar `output`.
4. Pulsar «Validar ejercicio»; ver reglas del reto, **no** `terraform validate`.
5. Abrir «Ver plan de ejemplo» y entender por qué se trata de **un fixture**.
6. Descargar `B04-first-resource.zip` y ejecutar Terraform **real local**.
7. Leer un test `.tftest.hcl` y ejecutar `terraform test`.
8. Completar mini-quiz: «¿Esto creó recursos en AWS?». Respuesta correcta: **no**.

**Feedback positivo:** «Bien: declaraste el recurso y su entrada según esta actividad. Para comprobar la configuración con Terraform real, descarga el laboratorio».  
**Feedback negativo:** «Falta el atributo `input` dentro de `terraform_data.demo`. Revisa el bloque y vuelve a validar».  
**No mostrar:** «Terraform ejecutó correctamente» tras usar solo reglas TS.

---

# 10. Laboratorios Terraform auténticos

## 10.1. Convención obligatoria de cada pack

Cada pack descargable incluye documentación, HCL, test oficial y metadatos:

```text
B04-first-resource/
├── README.md
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
├── tests/
│   └── first_resource.tftest.hcl
├── .gitignore
└── lab.json
```

**Regla:** un pack se empaca únicamente si `fmt`, `init`, `validate` y tests aplicables están `PASS` en CI **y** su hash de salida está asociado a un commit. Si el gate no se ejecutó, pack `NOT_RUN` y no publicar como probado.

## 10.2. Ejemplo auténtico de B04 (propuesta de archivos)

**`versions.tf`**

```hcl
terraform {
  required_version = ">= 1.10.0, < 2.0.0"
}
```

> Esto es una restricción mínima ilustrativa compatible con la ruta Vigilio de bloqueo S3 para módulos futuros, **no una fijación exacta de la CLI instalada**. En CI se debe fijar una versión exacta verificada y documentada. Los packs básicos no configuran backends ni AWS. **Este HCL se revisó contra la referencia oficial, pero NO pudo ejecutarse `terraform init/validate/test` en este entorno porque no hay Terraform CLI instalada; tampoco estuvo disponible una descarga externa desde el contenedor. Hasta ejecutarlo con CLI real, su estado es `NOT_RUN`**.

**`variables.tf`**

```hcl
variable "message" {
  description = "Mensaje para el primer recurso"
  type        = string
  default     = "Hola, Terraform"

  validation {
    condition     = length(trimspace(var.message)) > 0
    error_message = "El mensaje no puede estar vacío."
  }
}
```

**`main.tf`**

```hcl
resource "terraform_data" "demo" {
  input = var.message
}
```

**`outputs.tf`**

```hcl
output "mensaje" {
  description = "Mensaje declarado en el recurso"
  value       = terraform_data.demo.output
}
```

**`tests/first_resource.tftest.hcl`**

```hcl
run "input_is_configured" {
  command = plan

  variables {
    message = "Hola, Terraform"
  }

  assert {
    condition     = terraform_data.demo.input == "Hola, Terraform"
    error_message = "terraform_data.demo debe recibir el mensaje esperado."
  }
}
```

**`lab.json`** (metadatos, **no sustituye** el manifiesto de procedencia generado en CI; un hash o commit NO equivale a firma criptográfica):

```json
{
  "id": "B04-first-resource",
  "version": 1,
  "lessonId": "B04",
  "requiresCloud": false,
  "expectedTerraformVersion": ">=1.10.0 <2.0.0",
  "allowedActions": ["fmt", "init-backend-false", "validate", "test-plan-only"],
  "risk": "low",
  "hasCost": false,
  "validatedInCI": false
}
```

La propiedad `validatedInCI: false` en este **ejemplo documental** es deliberada: nada ha sido ejecutado aquí. El empaquetador real reemplazará este estado **solo con evidencia auténtica**.

**`README.md` dentro del lab** debe incluir: propósito, prerrequisitos, duración estimada, rutas y comandos, expectativas, riesgos, cómo borrar archivos de estado locales y troubleshooting.

### Comandos del alumno

```bash
# En B04-first-resource/ (después de instalar una CLI compatible)
terraform version
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform test
```

**Notas técnicas:** `terraform validate` requiere un directorio inicializado y no comprueba infraestructura remota; `terraform test` puede crear infraestructura en tests con `apply` real si el archivo lo permite. **Este ejemplo usa `command = plan` y `terraform_data`, sin proveedores cloud externos.** El `output` computado no debe tratarse como conocido antes de `apply`. En packs siguientes se debe auditar la combinación de `run`, providers, módulos, funciones externas y mocks: **un plan puede realizar lecturas mediante providers o data sources**, por lo que `command = plan` no garantiza ausencia absoluta de red o efectos secundarios. No ejecutar indiscriminadamente tests o providers de contribuciones no confiables en runners públicos, incluso sin credenciales.

### Qué significa la salida

- Si `fmt` devuelve cambios necesarios: explicar formato, no falsificar un PASS.
- Si `init` falla por proxy/red/versiones: mostrar `BLOCKED` e instrucciones de diagnóstico.
- Si `validate` falla: mostrar error real con línea/archivo en la terminal local; la web no lo sabe automáticamente.
- Si `test` falla: alumno usa el diagnóstico real para corregir; no «aprobar» manualmente con una animación.

## 10.3. Laboratorios por nivel

| Tipo | Fase | Cuenta cloud | Permisos | Condición de publicación |
|---|---|---|---|---|
| `terraform_data`, expresiones y variables | Básico | No | Ninguno | CLI real `fmt/init/validate/test` |
| Módulos y `mock_provider` | Intermedio | No | Ninguno | Tests mock aprobados; proveedor fijado si aplica |
| State/backend didáctico | Intermedio | No o lab sandbox aislado | Limitado | Procedimiento explícito de no tocar prod |
| AWS/VPC/S3/IAM | Avanzado | **Opcional** | OIDC/roles mínimos | Costos y cleanup; laboratorio autorizado |
| Drift/state migration | Senior | Fixture o sandbox separado | Elevados solo bajo autorización | Backups, revisión dual, pruebas negativas |
| Capstone multiambiente | Senior | Diseño y fixtures primero | Según entorno | ADR, controles, revisión y cleanup |

## 10.4. Estructura para labs profesionales

```text
labs-terraform/advanced/A10-aws-multi-env/
├── README.md
├── infra/
│   ├── bootstrap/             # backend de práctica, nunca crear prod por defecto
│   ├── modules/
│   │   ├── network/
│   │   └── application/
│   ├── stacks/
│   │   ├── network/
│   │   └── application/
│   ├── environments/
│   │   ├── development/
│   │   └── staging/
│   ├── policies/
│   └── tests/
├── examples/
│   └── terraform.tfvars.example
├── cleanup.md
└── lab.json
```

### Reglas de Vigilio aplicadas a labs cloud

- Backend remoto versionado/cifrado y con locking; en S3 moderno `use_lockfile = true` y S3 Versioning cuando aplique.
- Separación de raíz de estado por **ambiente y capa** (`network`, `compute`, `data`, `security`) según necesidad real.
- Módulos reutilizables sin provider/backend hardcodeado; configuración de providers/backend en raíz operativa.
- Credenciales efímeras OIDC, nunca claves AWS estáticas en repo o ZIP.
- `tfvars.example` contiene solo placeholders ficticios; no se puede usar para un `apply` productivo.
- Validación de CIDR sin solapamiento, y contratos/huellas SHA-256 donde un stack crítico consuma outputs de red de otro, conforme a la skill Terraform de Vigilio.
- Lint, escaneo, policy y estimación Infracost antes de proponer recursos pagados.
- Aprobar planes destructivos con revisión dual; rollback documentado, no asumir que `git revert` restaura automáticamente un servicio o estado.
- Nunca bloquear el aprendizaje básico por ausencia de una cuenta cloud.

## 10.5. Comandos de QA y límites de ejecución

```bash
# Solamente en directorios de laboratorio allowlisted y revisados:
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform test

# En labs con providers, según configuración aprobada:
tflint --init
tflint
trivy config .
# Checkov / Conftest / Infracost: ejecutar con configuración y políticas
# del laboratorio correspondiente; no inventar flags ni certificados de PASS.
```

- `init -backend=false` evita inicializar el backend definido en la configuración, pero puede necesitar descargar plugins/módulos. Se registran fallas de red como `BLOCKED` o `FAIL` según causa.
- Ejecutar `terraform test` solo tras inspeccionar si hay `apply`/providers auténticos. En CI pública, **allowlist** de labs `no-cloud`, revisión de proveedores y módulos, ejecución sin credenciales y aislamiento del runner; `command = plan`/mocks revisados por sí solos no constituyen una sandbox de seguridad.
- Tests de integración cloud se ejecutan en pipeline **separado** con cuenta dedicada, presupuesto, TTL, limpieza y autorización. Por defecto `NOT_RUN` en la rama web.
- Nunca subir `.terraform/`, `terraform.tfstate*`, planes guardados, secretos ni `.tfvars` reales a Git.

## 10.6. Empaquetado y procedencia

Al producir `public/downloads/B04-first-resource.zip`, el job crea también un manifiesto de release (por ejemplo, `public/downloads/manifest.json`) con: `labId`, `version`, `commitSha`, `terraformCliVersion`, `testStatus`, `sha256`, `buildId` y `timestamp`. Mostrar solo datos disponibles y verificados. Un cambio en HCL invalida la evidencia previa y obliga a nuevas pruebas antes de publicar.

---

# 11. Senior Mode: sistema, 18 escenarios y capstone

## 11.1. Qué significa Senior Mode en una academia de Terraform

**Senior Mode no es una paleta más oscura ni 18 cuestionarios difíciles.** Es la capa de aprendizaje donde el alumno practica **decidir qué cambiar, qué no ejecutar, qué pruebas pedir, qué riesgos aceptar y cómo dejar evidencia** ante incidentes reales de Infrastructure as Code.

Se implementan **dos superficies complementarias**, igual que en GoPixel:

**A. Senior transversal (`seniorMode = ON`).** Se puede activar desde el header y enriquecer lecciones compatibles con restricciones, escenarios de producción, amenazas, tests adversariales, revisión de plan, costos y un campo ADR. El estudiante conserva su contexto: si estaba en B10, sigue en B10, pero puede abrir el reto avanzado asociado. El borrador Senior y normal **jamás se pisan**.

**B. Laboratorios Senior autónomos (`/#/senior`).** Dashboard con **S01 a S18**, filtros por dominio, progreso, incidentes y capstone. Accesibles aunque el toggle esté apagado, conservando la experiencia de ruta específica.

**Verdad pedagógica:** el nivel Senior requiere criterio de producción y evidencia verificable. Una autoevaluación no es una certificación técnica, un fixture no es un despliegue real y un plan seguro para un entorno puede ser peligroso para otro.

## 11.2. Navegación y componentes Senior

```text
SENIOR DASHBOARD
   │
   ├── Filtros: State / Arquitectura / Seguridad / CI/CD / FinOps / Incidentes
   │
   ├── S01...S18 (cards con competencia y progreso)
   │
   ├── Recomendado según últimos retos (algoritmo local explicable)
   │
   └── Capstone S18 (gates de prerrequisitos)
   │
   └── SENIOR MODULE PAGE
         ├── Contexto y señales del incidente
         ├── Restricciones y SLO / RTO / RPO (solo si el escenario los define)
         ├── Dependencias y blast radius
         ├── Fuentes: HCL, plan SANITIZADO, timeline, logs de muestra
         ├── Análisis/decisión del alumno
         ├── Validadores acotados y tests negativos
         ├── ADR: alternativas, trade-offs y rollback
         ├── Rúbrica (automático vs revisión propia)
         └── Evidencia/exportación de resultado
```

**Componentes previstos:**

| Componente | Función | Requisito de verdad |
|---|---|---|
| `SeniorModeToggle` | Alternar profundidad | No borra normal ni cambia tema |
| `SeniorDashboard` | Mapa S01–S18 | Indicadores basados en progreso real |
| `IncidentBrief` | Contexto/síntomas/restricciones | Datos ficticios etiquetados |
| `ArchitectureGraph` | Grafo de stacks y blast radius | Basado en fixture tipado |
| `PlanRiskExplorer` | Clasificar create/update/delete/replace | No usar `terraform plan` ficticio sin etiqueta |
| `StateLockSimulator` | Carrera entre dos operaciones | Solo pedagogía; no toca backend real |
| `DriftTimeline` | Secuencia Git/state/cloud de ejemplo | Etiqueta procedencia y cronología |
| `EvidencePanel` | PASS/FAIL/NOT_RUN/BLOCKED | Fuente explícita por prueba |
| `SecurityFindings` | Riesgos de IAM/state/secrets | Reglas/escenarios versionados |
| `CostReviewPanel` | Trade-offs y presupuestos | Costos estimados/sintéticos etiquetados |
| `TradeoffEditor` | Reflexión ADR | Autoevaluación, nunca «IA certificó» |
| `RiskApprovalGate` | Plan destructivo requiere revisión | La simulación nunca aplica cambios |
| `SeniorRubric` | Matriz de competencias | Señala cada dimensión evaluada/no evaluada |
| `RecoveryChecklist` | Backup/restore/drift/rollback | No ofrecer un `force-unlock` real en web |
| `SeniorCompletionCard` | Reconocimiento educativo | No equivale a seniority profesional |
| `CapstoneWorkspace` | Proyecto final multietapa | Fases, artefactos, criterios y límites claros |

## 11.3. Ciclo obligatorio de cada reto Senior

1. **Brief:** contexto, intención del cambio, entorno, señales y datos de ejemplo.
2. **Investigación:** revisar `.tf`, dependencias, diff/plan, políticas, credenciales ficticias y timeline.
3. **Hipótesis:** señalar causa, riesgos, recursos afectados y nivel de confianza.
4. **Plan de acción:** escoger entre `bloquear`, `revertir`, `replanificar`, `corregir`, `escalar` o `aprobar condicionado`.
5. **Prueba:** ejecutar evaluadores del navegador sobre la decisión o descargar pack `terraform test` si existe.
6. **Pruebas negativas:** validar que una solución aparentemente cómoda falla ante un escenario adverso.
7. **ADR / trade-offs:** documentar alternativa seleccionada, costo, seguridad y reversibilidad.
8. **Revisión:** tabla por dimensión, evidencia observada, errores, puntos no verificables.
9. **Cierre:** progreso **educativo** solo al cumplir gates declarados; enlace al siguiente reto.

**Regla esencial:** una nota ADR puede comprobarse automáticamente solo en propiedades estructurales (se escribió, cubre secciones solicitadas). **La calidad del juicio arquitectónico necesita revisión humana o autoevaluación rotulada**; no inventar un puntaje objetivo de liderazgo.

## 11.4. Taxonomía de evidencia y calificación

| Evidencia | Ejemplo | Quién la valida | ¿Automatizable en MVP? |
|---|---|---|---|
| Comprensión objetiva | Identificar que `-/+` significa reemplazo | Motor TS de fixture | Sí |
| Selección segura | Bloquear un destroy crítico | Regla versionada del escenario | Sí, dentro de la simulación |
| Código real | `terraform test` pasó en pack descargado | Terraform CLI local / CI **si existe resultado verificable** | En CI para packs aprobados |
| Arquitectura | Justificar separación de states | Rúbrica propia / revisión humana | No plenamente |
| Costos | Detectar salto estimado en Infracost | Fixture / herramienta CI si se ejecuta | Sí en el escenario, no como factura real |
| Rollback | Explicar procedimiento aprobado | Checklist + revisión | Parcial |
| Seguridad | No exponer secretos, OIDC, permisos mínimos | Regla automatizada o auditoría | Parcial |

**Puntuación propuesta:**

- **30 puntos verificables:** interpretación del plan y cambios esperados (fixtures/test).
- **25 puntos verificables:** tratamiento de fallos y riesgo (incluye casos negativos).
- **20 puntos verificables:** decisiones de seguridad y estado que tienen regla explícita.
- **15 puntos de revisión:** calidad de arquitectura, alternativas y trade-offs.
- **10 puntos de revisión:** claridad del plan de rollback, observabilidad y comunicación.

La suma **100** es una estructura de revisión, **no una nota totalmente automática**. La UI muestra separadamente **`75 puntos verificables posibles`** y **`25 puntos pendientes de revisión humana/autoevaluación`** (pesos por defecto, adaptables por módulo). Nunca computar el segundo grupo como `PASS` sin revisión. Para desbloquear un reto avanzado, el autor define qué checks objetivos deben pasar y qué secciones se deben completar; esas secciones no equivalen a aprobación técnica.

**Estado de módulo:** `not-started`, `in-progress`, `practice-completed` (checks del browser), `lab-verified` (evidencia real autenticable cuando exista), `review-pending`, `reviewed`. El dashboard no simplifica esas categorías a un único «100% listo para producción».

## 11.5. Los 18 escenarios Senior — catálogo ejecutable por diseño

### S01 — Reemplazo destructivo por refactor de `for_each`

**Contexto:** un equipo cambia claves usadas en `for_each`; el diff propone destruir y recrear objetos críticos. El alumno debe reconocer que la configuración aparentemente equivalente puede alterar **direcciones Terraform**.

- **Artefactos:** `main-before.tf`, `main-after.tf`, fixture de plan con `delete/create`, mapa de recursos y restricciones de disponibilidad.
- **Misión:** señalar recursos afectados, bloquear el apply, evaluar `moved` y documentar un procedimiento de migración de direcciones.
- **Pruebas negativas:** alternativa «aplicar y recrear» falla por requisito de continuidad; `moved` incorrecto no debe aprobar.
- **Evidencia esperada:** lista de direcciones afectadas, decisión de bloquear, plan de cambios sin destrucción no aprobada, ADR corto.
- **Modo:** grafo + plan simulado + laboratorio descargable opcional con `moved`.

### S02 — Lock concurrente de state

**Contexto:** dos pipelines intentan mutar el mismo estado remoto; una ejecución queda bloqueada. Se investiga si un lock está activo, obsoleto o comprometido.

- **Artefactos:** timeline de jobs, IDs de operación ficticios, logs saneados de locking, topología backend.
- **Misión:** evitar ejecuciones simultáneas, decidir cuándo esperar, cancelar/replanificar o investigar un lock sospechoso.
- **Pruebas negativas:** desbloquear a la fuerza sin investigación debe fallar; segunda operación no puede considerarse segura mientras otra escribe.
- **Evidencia:** runbook de concurrencia, ownership del estado, autorización dual si se propone `force-unlock`.
- **Modo:** simulación determinista; **nunca** ejecutar desbloqueo real desde la web.

### S03 — Drift fuera de banda

**Contexto:** alguien modificó manualmente una regla de red. Git dice una cosa; el proveedor cloud refleja otra; Terraform detecta drift.

- **Artefactos:** `desired.tf`, representación de estado lógico saneado, snapshot cloud ficticio, plan/timeline.
- **Misión:** identificar la desviación, evaluar impacto y elegir reconciliar Git o revertir el cambio externo.
- **Pruebas negativas:** «aceptar todo lo que está en cloud» falla si viola política; no toda deriva autoriza `apply` inmediato.
- **Evidencia:** causa probable, blast radius, decisión, responsable y monitoreo posterior.
- **Modo:** diff triple y decisión de incidente.

### S04 — Destrucción de recurso crítico

**Contexto:** un cambio de módulo produce eliminación de un bucket o componente de datos asociado a producción.

- **Artefactos:** plan fixture crítico, etiquetas de entorno y clase de datos, política de backups.
- **Misión:** clasificar criticidad, bloquear el apply, investigar dependencias, proponer mitigación.
- **Pruebas negativas:** «aprobar porque el HCL compila» falla; ignorar state y backups falla.
- **Evidencia:** decisión «NO GO», protecciones, aprobación formal y plan de rollback/recovery.
- **Modo:** plan review + control de cambios.

### S05 — Migración de backend de estado

**Contexto:** se migrará state local o remoto legacy a S3 versionado con bloqueo nativo; existe riesgo de duplicar o perder ownership.

- **Artefactos:** dos topologías, inventario de states, plantilla `backend "s3"` ilustrativa, checklist de migración.
- **Misión:** preparar respaldo, congelar writers, verificar destino y explicar `init -migrate-state` en contexto autorizado.
- **Pruebas negativas:** migración sin backup o con escrituras concurrentes debe bloquearse; no asumir éxito por solo cambiar HCL.
- **Evidencia:** runbook, responsables, preflight, verificación de state y rollback.
- **Modo:** laboratorio de decisiones; integración real únicamente en sandbox autorizado.

### S06 — Filtración de secretos en state, plan o logs

**Contexto:** el equipo incluye un secreto en una variable y descubre que aparece en un plan guardado o state.

- **Artefactos:** ejemplo totalmente ficticio de output enmascarado, plan/state **sintéticos**, guía `sensitive` vs `ephemeral`.
- **Misión:** localizar vías de exposición, separar ocultar output de excluir del estado, diseñar contención/rotación y políticas.
- **Pruebas negativas:** marcar solo `sensitive = true` sin remediar state falla; registrar secretos en una captura/evidencia falla.
- **Evidencia:** matriz de exposición, pasos de contención y control de acceso a artefactos.
- **Modo:** policy hunt + incidente; **nunca usar secretos reales**.

### S07 — Upgrade de provider incompatible

**Contexto:** actualización mayor del provider cambia schema/comportamiento y un plan anuncia reemplazos inesperados.

- **Artefactos:** lockfile ficticio, changelog resumido, planes antes/después y tests rotos.
- **Misión:** analizar compatibilidad, proponer versión fijada, pruebas de regresión y rollout gradual.
- **Pruebas negativas:** `terraform init -upgrade` sin plan de revisión falla; actualizar producción directa falla.
- **Evidencia:** matriz versión/impacto, estrategia revertible y checklist de aprobación.
- **Modo:** revisión técnica + comparación de fixtures.

### S08 — Dependencias circulares y módulos acoplados

**Contexto:** network, compute y security se referencian mutuamente; Terraform no puede ordenar el grafo y el equipo tiene estados excesivamente acoplados.

- **Artefactos:** diagrama de grafo circular, interfaces de módulos y errores de planificación de ejemplo.
- **Misión:** romper ciclo con interfaces claras, separar ownership y evitar una capa monolítica innecesaria.
- **Pruebas negativas:** mover `depends_on` sin resolver la dependencia lógica no gana; copiar outputs sensibles entre stacks falla.
- **Evidencia:** grafo antes/después, razones de estratificación y trade-offs.
- **Modo:** grafo interactivo + ADR.

### S09 — CIDR solapados entre entornos

**Contexto:** dos VPC/redes propuestas se superponen; una red de clúster consumiría inventarios inconsistentes.

- **Artefactos:** mapa de redes con CIDR ficticios, contratos de variables y matriz de ambientes.
- **Misión:** detectar solapamiento par-a-par, rechazar topología inválida y revisar contrato/digest del stack de red.
- **Pruebas negativas:** considerar válido un bloque solapado por pertenecer a otro módulo falla; usar inventario de ejemplo como real falla.
- **Evidencia:** CIDR corregidos, test de contrato y límites de red.
- **Modo:** validador local de rangos con pruebas unitarias, sin afirmar haber probado en VPC real.

### S10 — IAM mínimo en GitHub Actions + OIDC

**Contexto:** workflow pide permisos amplios, depende de claves estáticas y puede aplicarse desde una rama no protegida.

- **Artefactos:** workflow YAML de ejemplo vulnerable, trust policy simplificada, roles ficticios.
- **Misión:** proponer federación OIDC, permisos limitados por job/entorno, approval gate y roles separados.
- **Pruebas negativas:** `id-token: write` global + admin wildcard falla; `pull_request` no confiable con secretos falla.
- **Evidencia:** amenazas, trust conditions, matriz roles/jobs, decisiones de promoción.
- **Modo:** code review/policy hunt; no entregar claves reales.

### S11 — El plan aprobado no es el plan aplicado

**Contexto:** un job de PR muestra un plan; tras merge, el pipeline vuelve a hacer `plan` y aplica un resultado potencialmente distinto por cambio de estado o código.

- **Artefactos:** dos commits ficticios, hashes de ejemplo, workflow inseguro, dos fixtures con diferencias.
- **Misión:** explicar la ruptura de integridad, diseñar procedencia y validación de plan de despliegue asociada al commit/estado/entorno aprobados, con protección de artefactos sensibles.
- **Pruebas negativas:** aprobar plan A y aplicar B falla; descargar un plan arbitrario desde un PR externo falla; un plan obsoleto no se aplica silenciosamente.
- **Evidencia:** diagrama seguro PR→aprobación→merge/entorno→plan final→aprobación/aplicación, control de hash y protección de artefactos.
- **Modo:** pipeline simulator + ADR; sin `apply` real.

### S12 — Tests con mocks vs integración

**Contexto:** un módulo tiene `terraform test` verde con `mock_provider`, pero nunca se comprobó contra la API cloud real.

- **Artefactos:** `.tftest.hcl` con mock, supuestos del provider, escenarios de integración pendientes.
- **Misión:** clasificar qué demuestra cada test y proponer sandbox de integración proporcional al riesgo.
- **Pruebas negativas:** «mock PASS = producción PASS» falla; tests con `apply` cloud no se corren como unitarios públicos.
- **Evidencia:** pirámide de pruebas, `NOT_RUN` explícito y plan de pruebas de integración.
- **Modo:** lectura de tests + diseño experimental.

### S13 — Policy as Code y excepciones

**Contexto:** un recurso incumple cifrado, tags obligatorios o reglas de red; el equipo pide ignorar el scanner por una urgencia.

- **Artefactos:** findings JSON saneados, política OPA/Conftest y propuesta de excepción con caducidad.
- **Misión:** corregir política o configuración, documentar excepción temporal justificada y dueño del riesgo.
- **Pruebas negativas:** ignorar `HIGH/CRITICAL` sin justificación falla; excepciones permanentes no revisables fallan.
- **Evidencia:** policy diff, pruebas negativas, owner, expiración, aprobación y resultado esperado.
- **Modo:** laboratorio de reglas.

### S14 — Aumento de costos sin control

**Contexto:** un PR cambia tamaño/ubicación de recursos y eleva el costo proyectado de cloud por encima de presupuesto.

- **Artefactos:** comparación Infracost **ficticia**, tags, presupuesto y alternativas.
- **Misión:** identificar drivers, rechazar cambios sin Owner/CostCenter, escoger alternativa con trade-off de rendimiento/fiabilidad.
- **Pruebas negativas:** optimizar costo poniendo datos primarios en capacidad interrumpible falla; confundir estimación con factura real falla.
- **Evidencia:** decisión de FinOps, ahorro estimado etiquetado, riesgos y validación futura.
- **Modo:** CostReviewPanel + ADR.

### S15 — Recuperación de state / desbloqueo de emergencia

**Contexto:** un estado remoto parece corrupto o bloqueado después de un incidente. Existe una versión anterior, pero la realidad cloud puede haber cambiado.

- **Artefactos:** inventario de versiones ficticias de S3, timeline, último plan y responsables.
- **Misión:** pausar writers, investigar, verificar backup, diseñar restore **sin inferir que una copia vieja refleja la nube actual**, requerir revisión dual para `force-unlock`.
- **Pruebas negativas:** restaurar de inmediato sin reconciliar recursos falla; ejecutar `force-unlock` a ciegas falla.
- **Evidencia:** plan de recuperación, checklist de seguridad, responsabilidades y pruebas posteriores.
- **Modo:** incidente/DR con simulación.

### S16 — Límite Terraform vs Helm/GitOps

**Contexto:** Terraform y Argo CD/Helm intentan administrar los mismos objetos Kubernetes, generando drift y guerras de reconciliación.

- **Artefactos:** matriz de ownership, diagrama cluster/infra/workloads, recursos duplicados de ejemplo.
- **Misión:** declarar quién crea clúster, addons, namespaces, workloads y políticas; reducir controladores concurrentes.
- **Pruebas negativas:** dos herramientas dueñas del mismo recurso fallan; «arreglar» drift con `apply` repetitivos sin ownership falla.
- **Evidencia:** ADR, árbol de ownership y estrategia de transición segura.
- **Modo:** design review + grafo.

### S17 — Revisión técnica de una plataforma IaC

**Contexto:** un equipo presenta un PR/RFC con todo el cloud en un solo estado y sin gates, owners ni plan de rollback.

- **Artefactos:** PR ficticio, diagrama de arquitectura, inventarios y controles faltantes.
- **Misión:** priorizar hallazgos, escribir comentarios de revisión concretos, proponer entregas incrementales y definir criterio GO/NO-GO.
- **Pruebas negativas:** recomendar refactor masivo sin baseline/test/rollback falla; confundir opinión con evidencia falla.
- **Evidencia:** revisión priorizada P0/P1/P2, ADR, matriz de riesgo y gate de entrega.
- **Modo:** Code Review + comunicación técnica.

### S18 — Capstone de Platform Engineering con Terraform

**Contexto:** diseñar una plataforma con red, servicios y datos en **development/staging/production**, respaldada por estados aislados, CI/CD, seguridad, costos y respuesta a incidentes.

- **Artefactos:** blueprint, módulos, entornos, políticas, escenarios de cambios y tests descargables; sin depender obligatoriamente de AWS real para la evaluación conceptual.
- **Misión:** presentar solución y operar decisiones ante cambios destructivos, drift, bloqueo concurrente, IAM insuficiente y costo excesivo.
- **Pruebas negativas:** state monolítico, plan no aprobado, claves estáticas, CIDR solapado, secretos en artefactos y ausencia de rollback deben impedir aprobar el diseño.
- **Evidencia:** ADR final, diagrama y ownership, carpeta de módulos/entornos, resultados `fmt/validate/test` si ejecutados, revisión de plan, policy findings, análisis de costos y runbook.
- **Modo:** proyecto de varias etapas, con gates por hito y revisión manual reconocida.

## 11.6. Escenario detallado S11 — simulador de integridad del plan

**Por qué incluirlo:** es un error de ingeniería recurrente y muestra que Terraform no se reduce a sintaxis. El alumno debe demostrar que puede detectar y bloquear un pipeline que aplica cambios diferentes a los revisados.

### Fixture de incidente (datos sintéticos)

```text
Commit aprobado:       1a2b3c4  (ejemplo)
Plan mostrado en PR:    PLAN-A   (+1, ~1, -0)
Commit aplicado:        9f8e7d6  (ejemplo)
Plan creado tras merge: PLAN-B   (+2, ~0, -1)
Entorno:                production (ficticio)
Diferencia crítica:     recurso de datos marcado para delete
```

### Ejercicio

- Marcar si el cambio está **listo para aplicar**. Respuesta segura: **NO GO**.
- Señalar qué evidencia está ausente: correspondencia de código, entorno/state, revisión del plan final, procedencia protegida.
- Diseñar un flujo donde el plan que se aplica sea el plan exacto autorizado **para el estado y entorno vigentes**; gestionar cambios entre PR y merge con invalidación de aprobación o nueva revisión cuando corresponda.
- Proteger `tfplan` como archivo sensible; no subirlo a artefactos públicos ni imprimirlo íntegro en comentarios de PR.
- Describir qué ocurre si Terraform rechaza un plan guardado por estado obsoleto: **replanificar y volver a revisar; no forzar aplicación**.

### Gate de éxito automatizable (fixture)

| Check | Aceptado | Rechazado |
|---|---|---|
| `plan_id_matches_approved` | A == A | A != B |
| `commit_matches_target` | Commit/revisión de despliegue vinculados | Hash del PR ajeno a lo aplicado |
| `environment_authorized` | Entorno protegido y aprobación correspondiente | `production` libre desde feature branch |
| `artifact_is_protected` | Acceso restringido y retención definida | Plan visible públicamente |
| `change_is_safe` | Sin destrucción crítica no aprobada | `-1` de datos sin revisión |

**Resultado UI:** «**NO GO · diferencias críticas detectadas**. Se ha evaluado un caso simulado; no se ha ejecutado Terraform». El **conteo** de riesgos debe calcularse según checks realmente fallidos en el fixture, no fijarse artificialmente en cuatro (los datos del caso no prueban todos los riesgos de la tabla).

### Revisión escrita

> Describe dos diseños seguros del flujo de aprobación y qué haces ante drift entre plan y apply. ¿Cuáles son los límites del replay de planes guardados? ¿Cómo controlas los permisos de GitHub Actions sin mantener claves estáticas?

**Evaluación:** checks objetivos vs calidad del razonamiento, separados.

## 11.7. Capstone S18 — plan de trabajo de ocho etapas

1. **Discovery:** requisitos, entornos, restricciones, componentes y riesgos.
2. **Blueprint:** capas `network`, `compute`, `data`, `security`; dependencias y ownership de recursos.
3. **State strategy:** backend, locking, segmentación, cifrado, versionado y recuperación.
4. **Module design:** entradas/salidas, versiones, tests, providers configurados desde root modules.
5. **Security:** OIDC, scopes, secretos, policy gates y clasificación de findings.
6. **Delivery:** PR plan, aprobación, artefactos protegidos, identidad de aplicación y rollback.
7. **Failure drills:** drift, destrucción imprevista, lock abandonado, subida de costos y actualización de provider.
8. **Readiness review:** resumen ejecutivo, evidencia por gate, riesgos abiertos, decisión GO/NO-GO y limitaciones.

### Árbol de entregables de ejemplo

```text
capstone-s18/
├── README.md
├── architecture/
│   ├── system-context.md
│   ├── ownership-matrix.md
│   └── adr-001-state-and-delivery.md
├── infra/
│   ├── bootstrap/
│   ├── modules/
│   │   ├── network/
│   │   ├── security/
│   │   └── application/
│   ├── stacks/
│   │   ├── network/
│   │   └── application/
│   ├── environments/
│   │   ├── development/
│   │   ├── staging/
│   │   └── production/
│   ├── policies/
│   └── tests/
├── evidence/
│   ├── gate-matrix.example.json
│   ├── plan-summary.example.json
│   ├── security-findings.example.json
│   └── cost-diff.example.json
└── runbooks/
    ├── drift-response.md
    ├── state-recovery.md
    └── destructive-change.md
```

**Estos son archivos objetivo**, no archivos existentes en el actual artefacto. Los ejemplos `.example.json` no son evidencia real. Si el alumno opta por ejecutar AWS, debe tratarse de un sandbox separado con autorización explícita y cleanup, nunca de producción.

## 11.8. Matriz de competencias Senior

| Competencia | Módulos que la practican | Evidencia mínima | Riesgo de aprobación falsa |
|---|---|---|---|
| Lectura de plan/blast radius | S01, S04, S07, S11 | Clasificación correcta de cambios y NO-GO | Confundir create con replace |
| State y recuperación | S02, S03, S05, S15 | Runbook, locking y análisis de drift | `force-unlock` indiscriminado |
| Seguridad e identidad | S06, S10, S13 | Hallazgos y mitigaciones | Ocultar secretos solo con `sensitive` |
| Arquitectura/ownership | S08, S09, S16, S18 | Grafo, contratos y ADR | Dos controladores de mismo recurso |
| Testing y compatibilidad | S07, S12 | Tests y límite de mocks | «PASS mock = prod» |
| FinOps | S14, S18 | Costo estimado y trade-offs | Presentar estimación como gasto real |
| Liderazgo técnico | S17, S18 | Review priorizada, riesgos y GO/NO-GO | Autoevaluación pretendida como certificación |

## 11.9. Pistas, fallos y rehabilitación

Si falla un reto, **no** mostrar solo «Incorrecto». El feedback debe tener cuatro partes: **hallazgo**, **por qué importa**, **qué evidencia falta** y **qué intentar después**. Terra puede aparecer preocupada (`terra-error.png`), pero jamás usar personajes como sustitutos de un diagnóstico.

Si el alumno solicita solución, registrar revelación y permitir continuar teoría, pero diferenciar de la práctica resuelta de forma autónoma. Si falta una prueba cloud por no tener credenciales, registrar **`NOT_RUN` o `BLOCKED`**, permitir terminar la parte conceptual y explicar qué faltaría verificar antes de desplegar.

---

# 12. Progreso, accesibilidad, privacidad e internacionalización

## 12.1. Modelo de progreso honesto

Separar claramente **avance del aprendizaje** de **evidencia de ejecución**:

| Estado | Significado | Otorga logro técnico |
|---|---|---|
| `not-started` | No visitado | No |
| `in-progress` | Leído o actividad abierta | No |
| `concept-complete` | Contenido y quiz de comprensión terminados | Logro de comprensión |
| `exercise-passed` | Motor educativo aprobó las reglas explícitas | Logro de ejercicio web |
| `lab-downloaded` | ZIP descargado | No es prueba aprobada |
| `self-reported-local-test` | El alumno declara haber ejecutado CLI | Solo indicador personal; **no verificado** |
| `ci-pack-validated` | El artefacto publicado pasó CI | Calidad del pack, **no del trabajo del alumno** |
| `senior-review-pending` | Faltan evaluación externa/autoinspección | No certifica seniority |

**XP y badges:** recompensan esfuerzo y dominio de ejercicios acotados. El primer logro `Terraform Starter` se alcanza tras B01–B04 + prueba educativa; `State Guardian` solo tras temas de state/riesgos; `Platform Architect` tras el capstone educativo y debe decir **«Ruta de aprendizaje completada»**, no «Terraform Certified» ni «Senior certificado».

La barra de portada muestra `Módulos completados: X / Y publicados`, no `54 / 54` cuando aún se están construyendo.

## 12.2. Retención local y backups

- Guardar preferencias, ejercicios y notas no sensibles de forma silenciosa (sin chip persistente en header).
- Auto-guardar al salir de editor **sin sobrescribir el modo normal con Senior**.
- `Exportar progreso` genera JSON descargable con `schemaVersion` y sin datos no autorizados.
- `Importar progreso` presenta resumen: datos nuevos, sobrescrituras, versión y confirmación.
- Antes de borrar progreso, solicitar confirmación clara; la opción `Reiniciar reto` no borra todo el perfil.
- Al subir versión del currículo, migrar IDs conocidos; conservar o archivar progreso anterior, sin marcar módulos nuevos como aprobados automáticamente.
- Si localStorage está lleno, deshabilitado o falla, mantener sesión actual y comunicar que no habrá persistencia.
- No guardar `.tfstate`, `.terraform/`, archivos `.tfvars` con secretos o planes privados.

## 12.3. Accesibilidad WCAG AA como objetivo

- Navegación completa con teclado; foco visible y orden lógico.
- Botones accesibles >=44 × 44 px, etiquetas programáticas y estado `aria-pressed` para el toggle si corresponde.
- `aria-live` discreto para feedback de ejercicios, sin bombardear lectores de pantalla.
- Contraste al menos WCAG AA para texto, controles y elementos esenciales (validar tonos reales).
- Formularios y notas con labels; errores asociados a campos.
- Editor navegable con tabulación y atajo explicado; opción de editar con textarea accesible si el componente lo necesita.
- Diagrama de recursos con lista/tabla textual equivalente y navegación entre nodos.
- No depender solo del color: `- DESTRUIR` además de rojo, `+ CREAR` además de verde.
- `prefers-reduced-motion`, modo claro/oscuro, zoom hasta 200 %, responsive sin pérdida de información.
- Sprite decorativo `aria-hidden=true`; sprite explicativo con `alt` específico.
- Los minijuegos de ordenar no obligan a drag-and-drop, incluyen botones accesibles.

## 12.4. Idiomas

**Release 1 en español completo.** Arquitectura lista para i18n, sin anunciar idiomas incompletos. GoPixel tiene una especificación de seis idiomas, pero eso no significa que esta academia deba publicar seis versiones huecas desde el primer día.

Diseño futuro: `es`, `en`, `pt-BR` y otros solo cuando **cada contenido, instrucción, feedback, error, pista, alternativa de quiz y README de lab pertinente** esté traducido y revisado técnicamente. Si una ruta no está traducida, indicar disponibilidad y ofrecer español en vez de mezclar cadenas sueltas. Los identificadores de código/HCL no se traducen.

## 12.5. Privacidad y analítica

**MVP:** sin cuenta, sin trackers invasivos, sin enviar HCL del alumno a servidores y sin credenciales AWS. Si se incorpora analítica agregada posteriormente, requiere política y consentimiento adecuados, datos minimizados y sin código/secretos en eventos. No convertir un curso educativo en recolector de configuración de infraestructuras reales.

---

# 13. Seguridad, cloud, CI/CD, costos y evidencia

## 13.1. Threat model mínimo

| Activo | Amenaza | Mitigación | Evidencia del gate |
|---|---|---|---|
| Progreso importado | JSON malicioso, tamaño enorme o esquema inválido | Zod, límites y rechazo de claves desconocidas | Tests de importación adversarial |
| Markdown educativo | XSS por HTML embebido | Render seguro, sanitización; sin HTML arbitrario confiado | Test de HTML malicioso |
| Editor HCL | Inyección visual/script vía código usuario | Text nodes seguros, no evaluar código ni `innerHTML` | Test de payload especial |
| ZIP de laboratorio | Archivos secretos o scripts inesperados | Allowlist de archivos, escaneo CI, manifiesto y hash | Gate de empaquetado |
| `.tfstate` y `tfplan` | Filtración de secretos | Excluir de Git/artifacts públicos; saneamiento de fixtures | Secret scan y revisión |
| Dependencias web | Supply chain | Lockfile y escaneo periódico | Auditoría y SBOM según release |
| GitHub Actions | Permisos excesivos / acciones mutables | SHA completo, mínimos permisos, OIDC acotado | actionlint + policy review |
| URLs y navegación | Open redirect/rutas arbitrarias | Router hash con rutas allowlisted | E2E rutas no válidas |
| Assets/branding | Uso indebido de marca | Créditos, licencia, distinción de producto independiente | Checklist legal/editorial |
| Cloud labs | Costos inesperados o afectación de cuentas reales | Sandbox explícito, presupuesto, IAM y cleanup | Approval + evidencia de teardown |
| Sandbox remoto futuro | Ejecución de binarios/provider maliciosos | Aislamiento fuerte, red restringida, cuotas y workers efímeros | Threat model separado antes de construir |

## 13.2. Gate de contenido y assets

Antes de publicar una lección, ejecutar controles sobre **texto y recursos**:

- Toda lección tiene ID, metadata, objetivo, ejemplo, reto, explicaciones y estado editorial.
- Toda referencia a `exerciseId`, `fixtureId`, `labId` y asset existe.
- No hay enlaces a documentos no incluidos o rutas que resuelven 404.
- No hay comandos peligrosos presentados sin advertencia/contexto.
- No aparecen secretos plausibles en código, fixtures, tests, screenshots o ZIP.
- Imágenes de Terra consistentes en proporciones, estilo y fondo correcto.
- La captura de concept board nunca se usa como interfaz textual funcional.
- No hay texto impreciso como «Aplicar tu HCL» en un botón que no hace `apply`.

## 13.3. CI/CD — tres workflows por responsabilidad

### A. `.github/workflows/quality.yml` (web)

**En cada PR:**

1. Checkout sin credenciales persistidas y acciones fijadas por SHA completo verificado.
2. Instalar Node y pnpm con versiones fijadas y lockfile (`--frozen-lockfile`).
3. Validación estática (lint/format o Biome, TypeScript `tsc --noEmit`).
4. `verify-catalog`: IDs, prerrequisitos, cantidad publicada, traducciones, assets, enlaces y evaluadores.
5. Unit tests: motores de quiz/HCL acotado, scoring y persistencia.
6. Component/integration tests: Header, editor, resultados, progreso, Senior toggle.
7. E2E Playwright: inicio, lección B04, minijuegos, tema, export/import, S11 y móvil.
8. A11y automatizada con inspección manual complementaria.
9. Scans: secretos, dependencias, patrones inseguros.
10. `vite build` y verificación de tamaño/recursos y `base`.
11. Publicar reporte con evidencia real: PASS/FAIL/NOT_RUN/BLOCKED.

No colocar `continue-on-error: true` ni `|| true` para esconder fallos obligatorios. No fingir un checkout verificado ni usar placeholders de SHA como si fueran listos para copiar.

### B. `.github/workflows/terraform-labs.yml` (IaC)

**En PR de labs:**

1. Detectar directorios afectados y consultar allowlist de labs seguros.
2. Verificar versión Terraform fijada, manifest y exclusión de state/planes/secrets.
3. `terraform fmt -check -recursive` sobre contenidos permitidos.
4. `terraform init -backend=false` en cada raíz explícita.
5. `terraform validate` con dependencias resueltas.
6. `terraform test` solo para labs revisados sin cloud y tests seguros (plan-only / mocks auditados).
7. `tflint`, Trivy/Checkov/Conftest según tipo de laboratorio y políticas versionadas.
8. Validar casos negativos y que la solución incorrecta **falla**.
9. Empaquetar packs aprobados y calcular SHA-256.
10. Guardar evidencia del commit, versión CLI, comandos, códigos de salida y logs saneados.

**Separación:** los labs que requieren AWS real no entran en este workflow público; usan aprobación y sandbox dedicados, con `NOT_RUN` cuando no corresponda correrlos.

### C. `.github/workflows/deploy-pages.yml` (release)

- Ejecutarse con ramas protegidas y gates previos obligatorios aprobados.
- Desplegar **exactamente el artefacto web construido y probado** para el commit aprobado; no reconstruir con dependencias distintas sin volver a verificar.
- Publicar la SPA y `public/downloads` con manifest de packs validado.
- Revisión de enlaces/rutas y smoke test final; publicar reporte de release.
- No publicar planes `tfplan`, state, variables reales ni reportes con secretos.

## 13.4. Política de evidencias Vigilio

**Estados válidos:**

- `PASS`: la verificación **se ejecutó** y cumplió el criterio.
- `FAIL`: la verificación **se ejecutó** y falló.
- `NOT_RUN`: no fue ejecutada; indicar por qué.
- `BLOCKED`: falta prerequisito material (credencial/sandbox/herramienta/red/etc.).

**Prohibido:** «todos los tests pasaron» basado en lectura de Markdown, tests de otra rama, una captura verde o salidas inventadas.

### Contrato de reporte reproducible

```json
{
  "schemaVersion": 1,
  "project": "terraform-academy",
  "commit": "EXAMPLE_NOT_A_REAL_COMMIT",
  "environment": "ci-example",
  "checks": [
    {
      "id": "web-typecheck",
      "status": "NOT_RUN",
      "evidenceSource": "document-only-example",
      "reason": "La aplicación aún no está implementada"
    },
    {
      "id": "B04-terraform-test",
      "status": "NOT_RUN",
      "evidenceSource": "document-only-example",
      "reason": "Código HCL mostrado como diseño, no ejecutado"
    }
  ]
}
```

**MVP no necesita una API** para coleccionar reportes: CI genera JSON y HTML estáticos, ligados al commit y a los artefactos. Los resultados que contienen información sensible deben quedar protegidos en CI, no servirse como archivos públicos.

## 13.5. AWS y otros clouds: acceso, costos y límites

- AWS se introduce como **laboratorio opcional** en avanzado/Senior, no como requisito para aprender HCL.
- Para estados S3, habilitar versionado/cifrado y `use_lockfile = true` cuando el backend/versión sea compatible; IAM restringe lectura/escritura y permisos del `.tflock`.
- Azure Blob y GCS requieren convenciones específicas; no copiar configuración AWS a otra nube.
- Terraform/OpenTofu son alternativas; si un itinerario usa OpenTofu, registrar compatibilidad propia y no mezclar lockfiles/estados sin análisis.
- IAM **least privilege** y federación OIDC en CI; revisar trust conditions por rama/entorno.
- Las estimaciones de Infracost muestran la diferencia prevista, no monto facturado. Los números de un fixture **no son precios vigentes**.
- En sandbox cloud, cada pack debe tener instrucciones de `destroy`/cleanup, comprobación de eliminación de recursos y límite de presupuesto/TTL cuando aplique.
- No usar `terraform apply -auto-approve` en guía de producción. Si aparece en entornos efímeros automatizados, debe haber controles equivalentes previos, identidad acotada, auto-cleanup y aprobación contextual.

## 13.6. Requisitos de desempeño

**Objetivos de calidad propuestos, no mediciones realizadas:**

- Carga inicial optimizada; código del editor, grafo y Senior lazy-loaded.
- Bundle sin bibliotecas gigantes no usadas; analizar `dist` al cerrar cada fase.
- Core Web Vitals como objetivos: LCP <= 2,5 s, CLS <= 0,1 e INP <= 200 ms en condiciones de prueba especificadas; medir, no declarar alcanzado por diseño.
- Sprites PNG optimizados sin perder pixel art; no usar el concept board de 2,7 MB como hero de todas las páginas.
- Renderizar gráficos grandes con límites de nodos o viewport; ofrecer tabla alternativa.
- Funcionamiento básico tras carga estática, incluso si servicios externos no están disponibles; `terraform init` local puede requerir red para providers externos.

## 13.7. Control de marcas y licencias

**HashiCorp Terraform** y los logos de los proveedores cloud son marcas de sus titulares. La [política de marcas de HashiCorp](https://www.hashicorp.com/en/trademark-policy) indica que **no se debe incorporar su marca al nombre propio de un producto** ni construir un logo derivado del logotipo oficial. **Cambio obligatorio:** publicar con marca propia y sustituir todos los logos Terraform que funcionen como marca del sitio o distintivo de la mascota. Es admisible identificar la tecnología en textos descriptivos de forma proporcionada, con atribución y sin sugerir aprobación o patrocinio. Usar logos oficiales de terceros solo en los usos y condiciones que sus políticas permitan; una ilustración conceptual aceptada por el usuario no concede derechos comerciales. Terra será original, no derivada del Go Gopher. Validar disponibilidad del nombre propio elegido antes de lanzamiento (dominio/marca), incluir créditos y aviso de independencia. **No es asesoría legal; ante dudas, solicitar revisión legal o permiso al titular.**

---

# 14. Implementación paso a paso y entregables

## 14.1. Orden: primero un vertical slice, después amplitud

**No construir 54 páginas vacías y declarar éxito.** Materializar primero **una lección B04 completa**, desde home a editor, validación, descarga local, test CI y progreso. Usarla como referencia obligatoria para todos los módulos siguientes.

| Fase | Trabajo principal | Entregable demostrable | Gate de salida |
|---|---|---|---|
| F0 — Preflight | Auditoría de ZIP/repo, restricciones, versiones, fuente visual y licencias | Inventario + ADR + plan de compatibilidad | Sin afirmaciones de archivos ausentes |
| F1 — Design system | Tokens, modo dark/light, Terra, nav, 4 cards, badges | Storybook opcional o página de componentes real | Contraste/teclado/móvil; assets coherentes |
| F2 — Shell y routing | Preact/Vite/TS/CI, home, rutas, ajustes | SPA navegable y deploy de preview | `typecheck`, build y smoke E2E |
| F3 — B04 vertical slice | Contenido, editor, motor, plan fixture, test real local y descarga | B04 completamente utilizable | Tests web + `terraform test` real del pack |
| F4 — Básico completo | B01–B12, 5 minijuegos, progreso | 12 unidades publicadas | Contenido/QA por módulo |
| F5 — Intermedio | I01–I12, grafo, estado y mocks | 12 unidades y packs aplicables | CI IaC, casos negativos |
| F6 — Avanzado | A01–A12, policies, FinOps, optional cloud | 12 unidades avanzadas | Seguridad, no-cloud path, costos etiquetados |
| F7 — Senior Core | Dashboard, toggle, 18 briefs, rúbricas, artefactos | Motor Senior verificable | Sin autograding ficticio |
| F8 — Senior profundo | S01–S18 completos + capstone | Escenarios completos y evidencias | Matriz de competencias y revisión |
| F9 — Release | E2E, a11y, performance, seguridad, docs, producción | SPA publicada + changelog + evidencias | GO/NO-GO explícito |

**Fases no son estimaciones de duración.** La prioridad es asegurar calidad de cada vertical slice, no una promesa de calendario sin equipo, presupuesto ni repositorio completo.

## 14.2. Primera implementación concreta — checklist de B04

```text
[ ] Crear pnpm workspace de producto único (sin monorepo innecesario)
[ ] Crear vite.config.ts con base para GitHub Pages
[ ] Configurar TS strict, lint y test
[ ] Crear tokens dark/light y AppShell
[ ] Crear rutas Home, Rutas, Lesson B04, Labs y Ajustes
[ ] Incorporar Terra como PNG individual optimizado
[ ] Crear metadatos de B04 y carga de Markdown
[ ] Crear pestañas de CodeMirror para main.tf, variables.tf, outputs.tf
[ ] Implementar ExerciseRuleEngine acotado con casos negativos
[ ] Mostrar "Validar ejercicio" y procedencia del resultado
[ ] Crear fixture de plan etiquetado "Ejemplo"
[ ] Implementar progreso local y separación por modo
[ ] Escribir lab B04 con HCL + .tftest.hcl
[ ] Ejecutar fmt/init/validate/test en entorno autorizado
[ ] Empaquetar ZIP con sha256 y manifest CI solo después de PASS
[ ] E2E: home → B04 → prueba → feedback → descarga
[ ] E2E: móvil, teclado, tema, refresco de hash route
[ ] Documentar limitaciones técnicas y licencia de marca
```

**Criterio de aceptación de F3:** una persona sin AWS puede leer B04, modificar su HCL, recibir feedback correcto sobre el reto y descargar un pack que pasa `terraform validate` y `terraform test` realmente en un entorno de validación; no se hace `apply` cloud ni se inventa un resultado de CLI en el navegador.

## 14.3. Catálogo de tareas por dominio

### Producto y UI

- Header y drawer móvil, hero, rutas, cards, progreso, footer.
- Tema dark/light, foco, responsive, acceso por teclado.
- Terra: 12 poses, estados y atlas.
- Modales de reset/solución, toasts no intrusivos, navegación entre ejercicios.

### Contenido

- Manifiesto de cada lección y publicación progresiva.
- Teoría con ejemplos HCL correctos y casos de error.
- Evaluadores explícitos versionados y tests adversariales.
- Pistas, explicaciones, cuestionarios, minijuegos, laboratorios.

### IaC

- Packs no-cloud primero, .tftest.hcl plan-only/mocks.
- Labs cloud optativos con scripts/documentación segura, policies y cleanup.
- Matriz Terraform version/provider/lockfile.
- Pruebas reales y hashes de paquetes.

### Senior

- Dashboard y competencia, Senior toggle, briefs S01–S18.
- Plan/graph/state/lock/drift/cost simulators con fixtures.
- ADR editor, evidencia, autoevaluación y límites honestos.
- Capstone S18, gates y documentación de decisiones.

### Delivery

- Workflow web, Terraform labs, release Pages, scans y actionlint.
- Versiones fijadas, SBOM si requerido por política, rastreo de dependencias.
- Reporte de evidencia y release checklist.
- Revisiones de accesibilidad/visual/performance y pruebas en dispositivos.

## 14.4. Dependencias y camino crítico

```text
Fuentes y ADR
   ↓
Stack + sistema visual
   ↓
AppShell + content schema + engine tests
   ↓
B04 vertical slice con Terraform CLI en CI
   ↓
Básico completo ───────→ juegos / progreso
   ↓
Intermedio ─────────────→ grafo / plan explorer
   ↓
Avanzado ──────────────→ policy / FinOps / cloud opcional
   ↓
Senior engine ──────────→ 18 casos / rúbricas / capstone
   ↓
Release GO/NO-GO con evidencia
```

## 14.5. Qué no debemos hacer durante la implementación

1. Copiar la imagen completa como HTML con hotspots invisibles.
2. Instalar Kubernetes o NestJS para una página estática sin justificación.
3. Publicar las 54 lecciones como completadas solo porque existe el catálogo.
4. Marcar «terraform validate PASS» por una expresión regular TypeScript.
5. Ejecutar `terraform apply` remotamente con HCL de usuario sin aislamiento.
6. Comitear `.tfstate`, planes guardados, `.tfvars` secretos o keys cloud.
7. Mezclar backend/proveedores dentro de módulos de librería.
8. Usar un único state prod/dev con ownership ambiguo.
9. Publicar cifras de Infracost sintéticas como precios reales.
10. Dar títulos de «certificado oficial» o Senior profesional sin validación legítima.
11. Presentar resultados de un lab de ejemplo como si pertenecieran al alumno.
12. Ignorar las pruebas negativas porque el happy path funciona.

---

# 15. Definition of Done, pruebas, matriz de aceptación

## 15.1. Definition of Done por módulo

Una unidad se considera **publicable** si cumple todas estas condiciones:

- [ ] ID, prerequisitos y estado editorial válidos.
- [ ] Contenido revisado técnicamente y en español.
- [ ] Ejemplo HCL verificable o rotulado explícitamente como pseudocódigo/fixture.
- [ ] Actividad funcional, evaluador registrado y al menos tres casos de prueba (correcto, incorrecto y límite).
- [ ] Pistas y solución con explicación pedagógica.
- [ ] Botones realizan su acción o están honestamente deshabilitados con explicación.
- [ ] Lectura responsive y accesible.
- [ ] Progreso compatible con schema actual.
- [ ] Asset Terra y textos alternativos correctos donde aplica.
- [ ] No hay credenciales ni estado real en contenido.
- [ ] Pack real probado en CI si se anuncia como tal.
- [ ] Todos los enlaces y rutas comprobados.

## 15.2. Test plan web

| ID | Prueba | Criterio |
|---|---|---|
| WEB-01 | Navegación por hash y recarga | `/`, `rutas`, `B04`, `senior`, `ajustes` no dan 404 |
| WEB-02 | START sin progreso | Abre B01 publicada |
| WEB-03 | Continuar con progreso | Abre última lección válida |
| WEB-04 | Validación incorrecta B04 | Muestra regla fallida, no XP indebido |
| WEB-05 | Validación correcta B04 | PASS **del motor educativo**, con procedencia |
| WEB-06 | Plan Explorer | Muestra «Plan de ejemplo» en todo momento |
| WEB-07 | Apply simulado | Nunca realiza llamada cloud ni afirma crear recursos |
| WEB-08 | Ver solución | No equivale a resolver autónomamente |
| WEB-09 | Borradores normal/Senior | Independientes al alternar toggle |
| WEB-10 | Export/import | Versionado, validado, confirmación y sin XSS |
| WEB-11 | Tema | Claro/oscuro/system y conservación |
| WEB-12 | Responsive/teclado | Sin controles cortados; foco visible |
| WEB-13 | A11y contraste/lectores | Mensajes y tablas equivalentes |
| WEB-14 | Contenido inexistente | 404 interno amigable sin crash |
| WEB-15 | S11 simulated incident | NO GO por plan no aprobado |
| WEB-16 | Progreso antes de release | Conteos solo de contenido publicado |
| WEB-17 | Fixture corrupto | Bloqueo seguro, sin falso PASS |
| WEB-18 | Storage deshabilitado | App usable con advertencia honesta |

## 15.3. Test plan IaC

| ID | Prueba | Requisito |
|---|---|---|
| IAC-01 | `terraform fmt -check -recursive` | Cero archivos sin formato en el pack |
| IAC-02 | `terraform init -backend=false` | Dependencias resueltas y versión compatible |
| IAC-03 | `terraform validate` | Resultado real registrado |
| IAC-04 | `terraform test` | Archivo de test revisado, resultado real |
| IAC-05 | Negativo de B04 | Entrada inválida no debe obtener un PASS artificial |
| IAC-06 | Security scan | Hallazgos HIGH/CRITICAL tratados por política |
| IAC-07 | Secret scan | No state, plan, claves o variables reales |
| IAC-08 | Lab manifest | ID, versión, sha256, commit y status coherentes |
| IAC-09 | AWS opcional | Identidad temporal, presupuesto y teardown documentados |
| IAC-10 | Plan guardado | No expuesto públicamente; uso restringido/aprobado |
| IAC-11 | Drift / locking senior | Tests negativos en fixture y runbook asociado |
| IAC-12 | Matriz de versiones | Lockfile/CLI/plugins compatibles, sin rangos ambiguos en CI |

## 15.4. Casos negativos de seguridad obligatorios

```text
SEC-N01: Importar progreso con __proto__ / HTML malicioso → rechazo/sanitización.
SEC-N02: Editor con texto parecido a clave cloud → no persistir secreto; advertencia.
SEC-N03: ZIP con terraform.tfstate → empaquetado FAIL.
SEC-N04: Fixture sin classification → no mostrar como plan válido.
SEC-N05: Workflow con permisos amplios o acción mutable → lint/policy FAIL.
SEC-N06: Terraform test con provider real no allowlisted → BLOCKED en CI pública.
SEC-N07: Plan productivo con recurso crítico delete → NO GO.
SEC-N08: Force unlock sin verificación ni doble revisión → NO GO.
SEC-N09: CIDRs solapados → falla test de contrato.
SEC-N10: Senior ADR vacío → revisión pendiente; no acreditar juicio arquitectónico.
```

## 15.5. Checklist de release global

- [ ] Código fuente de la SPA existe, compila y está fijado con lockfile.
- [ ] PNG aprobado referenciado como material de diseño; sprites producidos en assets separados.
- [ ] UI respeta diseño de GoPixel adaptado a Terraform, sin Gopher ni tono azul Go como primario.
- [ ] No hay contenido `draft` accesible como `published`.
- [ ] B01–B12, I01–I12, A01–A12 y S01–S18 tienen sus criterios cumplidos o se anuncia un **release parcial** sin ocultarlo.
- [ ] Todos los controles con acción real, estado y feedback.
- [ ] Browser rules etiquetadas y no confundidas con Terraform CLI.
- [ ] Packs publicados pasan tests realmente y tienen hash.
- [ ] CI web/IaC/Pages con permisos mínimos y evidencias de ejecución.
- [ ] Seguridad, secret scanning, XSS, importación adversarial y licencia revisados.
- [ ] Light/dark, móvil, teclado, a11y y reduced motion verificados.
- [ ] Plan Explorer y grafo accesibles, con leyendas y fuentes.
- [ ] S11 y S18 probados con escenarios negativos.
- [ ] Privacidad, marca independiente y costos cloud opcionales explicados.
- [ ] GO/NO-GO firmado según responsabilidad del equipo y riesgos pendientes.

### Criterio de NO-GO absoluto

No publicar como «funcional completo» si el catálogo contiene rutas vacías, los labs no tienen evidencia CI, el editor inventa ejecución Terraform, se exponen secrets/planes/state o los tests críticos se registran como PASS sin haber corrido.

---

# 16. Extensiones futuras y criterios de decisión

## 16.1. Sandbox real en navegador — solo fase posterior

**Disparador legítimo:** alumnos necesitan ejecutar Terraform CLI sin instalarlo y el valor supera complejidad y costo operacional. Antes de aprobar, completar ADR, modelado de amenazas, presupuesto, aislamiento, pruebas de abuso y responsable de operaciones.

Arquitectura tentativa, **no decisión MVP**:

```text
Frontend estático
    │ HTTPS, autenticación si corresponde
    ▼
API de sesiones de laboratorio
    │ Validación de cuota y allowlist
    ▼
Queue / control plane de sesiones
    │
    ▼
Workers efímeros fuertemente aislados
    ├── Terraform CLI y providers permitidos versionados
    ├── FS temporal y sin mounts sensibles
    ├── Egress restringido y sin metadata cloud expuesta
    ├── CPU/RAM/time quotas y cancelación
    ├── Credenciales temporales de sandbox opcional
    └── Teardown + auditoría + límites FinOps
```

**No basta** con `child_process.exec('terraform apply ' + entradaUsuario)` en NestJS, ni ejecutar providers de usuarios sin control en el servidor compartido. Una sandbox remota debe tener aislamiento apropiado frente a código arbitrario, no solo un iframe o sandbox de JavaScript.

## 16.2. Cuenta y sincronización — solo cuando se necesiten

Si aparecen cohortes, instructores, revisión humana y badges firmados, puede añadirse backend y DB (según skills Node/Nest), con consentimiento, seguridad y migración de progreso. La web local-first debe seguir pudiendo funcionar en modo invitado cuando sea viable.

## 16.3. Laboratorios con Kubernetes

Kubernetes será **itinerario avanzado**, no la infraestructura obligatoria del producto. Se enseñará cuándo Terraform crea clúster/network/IAM y cuándo Helm/Argo CD gobiernan workloads; también cómo no dejar dos controladores peleando por el mismo objeto. La mascota de esta academia sigue siendo **Terra**, aunque aparezcan escenas de k8s en módulos de especialidad.

## 16.4. Evaluación avanzada de HCL

Futuras mejoras posibles: parser HCL de mayor fidelidad en WASM, syntax checks robustos, diff semántico con AST, generación de plan fixtures curados, visualización de cambios de estado ficticio y escenarios de fallos interactivos. **Cada capacidad exige pruebas de exactitud antes de presentarse como análisis semántico completo**.

---

# 17. Fuentes y matriz de skills Vigilio

## 17.1. Skills encontradas y aplicación práctica

| Skill (`skills(10).zip/skills/<nombre>/SKILL.md`) | Aplicar cuando | Output esperado |
|---|---|---|
| `terraform-iac-delivery` | Diseño/revisión de labs, state, OIDC, policies, recuperación | HCL seguro, tests y reportes de evidencia |
| `web-mfe-technologies` | Seleccionar versiones y arquitectura web | Baseline Preact/Vite/TS/CodeMirror verificado |
| `web-mfe-build-feature` | Implementar funcionalidades UI | Features con ownership y tests |
| `web-mfe-testing` | Pruebas unitarias/E2E web | Matriz de cobertura reproducible |
| `web-mfe-quality` | Calidad del frontend | Lint/TypeScript/performance |
| `web-mfe-security-delivery` | CSP, XSS, entrega web | Gate de seguridad frontend |
| `ui-design-system` | Tokens, Terra, cards y temas | Componentes consistentes y accesibles |
| `ux-web-experience` | Experiencia, navegación, estados | UX adaptada, no clon de imagen plana |
| `platform-cicd-factory` | Workflows de calidad/release | Acciones SHA y permisos mínimos |
| `platform-validation-evidence` | Mostrar PASS/FAIL/NOT_RUN/BLOCKED | Evidencia trazable por commit y lab |
| `platform-finops` | A09/S14 y optional cloud | Política de tags, escenarios de costos |
| `aws-platform-foundation` | A10 y sandbox AWS | IAM, backend S3 y base cloud |
| `platform-local-production-lab` | Labs de múltiples servicios locales | Topologías reproducibles |
| `platform-observability-sre` | Incidentes/drift/DR | Runbooks y criterios de recuperación |
| `kubernetes-eks-delivery` | Itinerario Kubernetes/GitOps | Límites de ownership/infra-clúster |
| `node-nest-build-feature` + `node-nest-security` | **Solo** API de sandbox futuro | Backend controlado y aislado |

**Contrato de aplicación:** antes de implementar cada fase, leer la `SKILL.md` relevante, **los archivos de `references/` que realmente existan para esa skill** (incluido `canonical-contract.md` solo donde esté presente) y las fuentes canónicas correspondientes. No todas las skills incluyen `references/canonical-contract.md`; exigirlo universalmente sería un error. No declarar una skill «cumplida» solo porque se cita aquí. Mantener `PASS/FAIL/NOT_RUN/BLOCKED` en función de evidencia.

## 17.2. Rutas documentales de referencia (dentro de los ZIP)

### GoPixel (en `index.zip`)

```text
docs/design/UI_UX_ESPECIFICACION_PREVIA.md
docs/design/ASSETS_Y_PALETA.md
docs/design/COMPONENTES_UI.md
docs/content/CURRICULUM_MANIFEST.md
docs/content/MINIJUEGOS_LIGEROS.md
docs/content/SENIOR_MODE_18_LABS.md
docs/senior/COMPETENCY_MODEL_V6.md
docs/senior/IMPLEMENTACION_V3.md
docs/senior/OPERATIONS_V5.md
docs/senior/LEARNING_GUIDES_V7.md
docs/devsecops/RELEASE_GATES.md
docs/devsecops/THREAT_MODEL.md
docs/architecture/ARQUITECTURA_OBJETIVO.md
public/assets/ASSET-ATLAS.png
screenshots/showcase/01-hero-dashboard-dark.png
screenshots/showcase/03-code-editor-b01.png
```

### Vigilio (en `vigilio-docs(9).zip/vigilio-docs/`)

```text
technology/versions.md
platform/iac/terraform-delivery.md
platform/iac/state-and-drift.md
platform/iac/testing.md
platform/iac/terraform-cdk.md
platform/cicd/github-actions-stages.md
platform/cicd/pipeline-factory.md
platform/security/supply-chain.md
platform/finops/cloud-cost-intelligence.md
platform/sre/operational-evidence.md
platform/sre/adr-threat-modeling.md
platform/aws/platform-foundation.md
platform/architecture/ownership-model.md
playbooks/stack-selection-and-solution-design.md
playbooks/uxui-product-design-auto-senior.md
```

**Aviso de alcance de auditoría:** los ZIP originales contienen muchos más `.md`; este documento sintetiza los contratos y fuentes directamente pertinentes. No afirma una auditoría manual exhaustiva línea por línea de los más de mil `.md` de Vigilio ni pruebas reales en producción.

## 17.3. Documentación oficial Terraform verificada como referencia

Las siguientes URLs sirven para corroborar la semántica de los comandos y features usadas en esta especificación. Revisitadas para esta auditoría el **11 de noviembre de 2026**; verificar de nuevo al fijar la versión del proyecto:

- **`terraform validate`:** <https://developer.hashicorp.com/terraform/cli/commands/validate> — requiere inicialización y no valida APIs remotas.
- **`terraform init`:** <https://developer.hashicorp.com/terraform/cli/commands/init> — inicialización y migraciones de backend.
- **`terraform plan`:** <https://developer.hashicorp.com/terraform/cli/commands/plan> — planes especulativos/guardados; planes guardados pueden contener secretos sin cifrar.
- **Testing nativo:** <https://developer.hashicorp.com/terraform/language/tests> — archivos `.tftest.hcl` y `run`.
- **Mocks de providers:** <https://developer.hashicorp.com/terraform/language/tests/mocking> — disponibles desde Terraform 1.7.0, para tests sin infraestructura real en determinados casos.
- **Backend S3 y locking:** <https://developer.hashicorp.com/terraform/language/backend/s3> — `use_lockfile`, versionado recomendado y permisos `.tflock`.
- **Módulos:** <https://developer.hashicorp.com/terraform/language/modules/develop> — estructura y reutilización.
- **`moved` blocks:** <https://developer.hashicorp.com/terraform/language/block/moved> — cambio de direcciones sin destrucción por refactor de direcciones, cuando aplica.
- **Valores sensibles:** <https://developer.hashicorp.com/terraform/language/manage-sensitive-data> — state/planes, `sensitive` y valores efímeros.

**Los enlaces oficiales informan la especificación; no sustituyen comprobar el comportamiento con la versión exacta que seleccione el repositorio.**

---

# 18. Instrucciones de ejecución para el equipo o agente

Este bloque es el **contrato de trabajo** para construir la academia IaC especializada en Terraform siguiendo el documento. Está diseñado para evitar crear una demo bonita pero engañosa.

## 18.1. Orden de arranque

1. Revisar `index.zip`, el PNG aprobado y los Markdown de GoPixel; extraer componentes/patrones visuales, **sin afirmar que el frontend original fue recibido**.
2. Revisar las skills pertinentes de `skills(10).zip`, sus referencias obligatorias y la política `vigilio-docs` aplicable; indicar cualquier material faltante como `BLOCKED`.
3. Proponer y registrar tres ADR: **SPA estática**, **ownership Terraform**, **límite de ejecución CLI/web**.
4. Materializar stack real con versiones fijadas y lockfile; ejecutar `typecheck`, tests y build, sin claims de éxito antes de correrlos.
5. Crear dark/light y los componentes de navegación según el PNG, reproduciendo la experiencia, **no incrustando la imagen como app**.
6. Crear la mascota Terra y assets separados **sin logo Terraform como insignia de marca**, con licencia, créditos y nombre público propios revisados.
7. Implementar **B04 como vertical slice end-to-end** con HCL educativo, validación honesta, plan fixture, ZIP real y pruebas CLI en CI permitido.
8. Completar niveles progresivamente y los 5 minijuegos con casos negativos.
9. Implementar Senior transversal y Senior Dashboard; crear los 18 escenarios sin inventar ejecución.
10. Cerrar gates de contenido, IaC, E2E, a11y, seguridad, privacidad, performance y release.

## 18.2. Output obligatorio de cada fase

Cada fase debe entregar:

- **Resumen:** qué se implementó, qué faltó y por qué.
- **Archivos:** rutas exactas creadas o modificadas.
- **Evidencia:** comandos corridos, versiones, códigos de salida, checks PASS/FAIL/NOT_RUN/BLOCKED.
- **Riesgo:** implicaciones de seguridad, cloud, estado y costos, cuando aplique.
- **Próximo paso:** pequeño vertical slice siguiente, no expansión indiscriminada.

## 18.3. Criterio de diseño a conservar de forma obligatoria

> **La academia de IaC debe sentirse como GoPixel Academy adaptada a la disciplina Terraform:** misma calidez del pixel art, navegación moderna, aprendizaje guiado, editor, progreso, minijuegos y Senior Mode, pero con **marca original**, identidad morada, mascota Terra sin logo oficial, HCL, módulos, state, plan, drift, seguridad, CI/CD, FinOps y decisiones reales de Platform Engineering. La interfaz nunca debe afirmar haber ejecutado Terraform cuando solo analizó un ejercicio o reprodujo un plan de ejemplo.

## 18.4. Resumen de aceptación definitiva

**Producto aceptable:** página real funcional, consistente con la **composición visual del PNG pero con marca propia y sin logos ajenos como identidad**, con contenidos genuinos y funcionalidades implementadas, más packs Terraform auténticos probados.  
**Senior Mode aceptable:** 18 desafíos con contexto, evidencia, negativas, rúbrica honesta, decisiones y capstone completo.  
**Arquitectura aceptable:** Preact + TS + Vite estático, sin backend o cloud forzados, CI seguro, datos local-first, planes y state protegidos.  
**Release aceptable:** solo con evidencia ejecutada, límites expresos y decisiones GO/NO-GO claras.

---

## Estado del presente documento

| Elemento | Estado a fecha de este documento |
|---|---|
| Referencia visual PNG del usuario | **DISPONIBLE**, dimensiones verificadas; guía estética privada, NO material de marca listo para publicar |
| Auditoría de GoPixel + skills + Vigilio docs | **COMPROBACIÓN DIRIGIDA** de inventario y rutas citadas; NO lectura exhaustiva de todos los `.md` |
| Selección de stack y arquitectura | **PROPUESTA** |
| Diseño de 54 módulos / 8 itinerarios | **ESPECIFICADO**, no implementado |
| Diseño de 12 sprites Terra | **ESPECIFICADO**, solo concept board disponible |
| Laboratorio B04 | **EJEMPLO DE CÓDIGO DOCUMENTADO** y contrastado con referencias oficiales; `terraform fmt/init/validate/test`: **NOT_RUN** (CLI ausente) |
| 18 retos Senior + capstone | **ESPECIFICADOS**, no implementados |
| Build de Preact/Vite | **NOT_RUN** |
| `terraform validate` / `terraform test` del nuevo repo | **NOT_RUN** |
| CI, security scan y despliegue | **NOT_RUN** |

**Fin de la especificación principal; el dictamen de auditoría 1.1 continúa a continuación.**


---

# 19. Auditoría técnica y legal — revisión 1.1

## 19.1. Dictamen resumido

**Resultado: DISEÑO VIABLE, TODAVÍA NO VERIFICADO COMO SOFTWARE, Y PUBLICACIÓN DE MARCA BLOQUEADA HASTA REDISEÑO.** Se corrigió el documento sin declarar completadas pruebas que no se han podido ejecutar. El concepto visual está bien definido y la arquitectura estática es proporcionada; la identidad que aparece en el PNG **no puede trasladarse automáticamente al producto publicado**.

| Hallazgo | Gravedad | Verificación | Resolución |
|---|---|---|---|
| Nombre público «Terraform Academy» y logotipo oficial usado como identidad/insignia | **ALTA / NO-GO marca** | Política oficial HashiCorp prohíbe usar su marca en nombres de productos propios y restringe uso de logotipos | Elegir marca original y quitar los símbolos oficiales de cabecera, casco, pecho y favicon; mantener «HashiCorp Terraform» solo como mención tecnológica descriptiva |
| Ejemplos B04 descritos como auténticos sin haber corrido la CLI | **MEDIA / NO-GO prueba** | No existe binario `terraform` en el entorno de esta auditoría; la red del contenedor no resolvió releases.hashicorp.com | Mantener `NOT_RUN` hasta ejecutar `fmt/init/validate/test` en una CI con Terraform fijado; no afirmar PASS |
| Uso de `terraform_data.output` durante `plan` | **MEDIA / precisión docente** | El output es computado; puede ser desconocido durante plan; `input` es el atributo apropiado para el assert de B04 | Anotación explícita en B04 y en el ejemplo de test |
| `command = plan` presentado a veces como garantía de ausencia de nube | **MEDIA / riesgo operacional** | Un plan de un provider puede leer servicios y hacer actividad de red | Aislar CI, permitir solo módulos/providers revisados y sin credenciales; el B04 propuesto usa solo provider integrado |
| `sha256` y commit confundibles con «manifiesto firmado» | **MEDIA / cadena de suministro** | SHA-256 prueba integridad respecto a una referencia confiable, **no** firma ni procedencia verificable por sí mismo | Usar «manifiesto generado en CI»; añadir firma/attestation verificable únicamente si se implementa explícitamente |
| Catálogo JSON con `published` de ejemplo aunque B04 no existe | **BAJA / estados** | Es un JSON documental, no hay repo funcional | Cambiado a `draft` para evitar interpretaciones erróneas |
| S11 decía «4 riesgos» sin fixture exhaustivo para contarlos | **BAJA / exactitud del simulador** | Datos mostraban solo parte de los flags de la tabla | Mostrar riesgos concretos y conteo calculado desde fallos observados |
| Guía de skills pretendía cargar `canonical-contract.md` desde todas ellas | **MEDIA / rutas inexistentes** | No todas las skills tienen ese archivo; se comprobó en los ZIP | Leer las referencias **que sí existan** en cada skill, sin inventar rutas |
| Imagen Markdown como referencia externa | **BAJA / portabilidad** | El `.md` enlaza `image(20261111-014058).png` de forma relativa | Para ver la imagen, poner PNG junto a este `.md`; el Markdown único no incrusta sus bytes |

## 19.2. Evidencia que sí se pudo verificar

- `index.zip`: **385 entradas**, **52 archivos Markdown**; no hay `src/main.tsx` ni `package.json`. Las rutas GoPixel citadas en §17.2 existen.
- `skills(10).zip`: **514 entradas**, **210 Markdown** y **103 rutas `SKILL.md`**. Las 17 skills nominadas en §17.1 existen.
- `vigilio-docs(9).zip`: **1.992 entradas**, **1.113 Markdown** (incluidas copias generadas/compatibles); las 15 rutas canónicas citadas en §17.2 existen.
- PNG del usuario: **1536 × 1024**, **RGBA**, referencia de cuatro paneles.
- El catálogo de la especificación contiene IDs **B01–B12, I01–I12, A01–A12 y S01–S18** sin omisiones: **54 módulos total**, de los cuales **18 son Senior**. Hay **8 itinerarios**, que no se suman a esos 54.
- Los ejemplos JSON de esta especificación tienen sintaxis JSON correcta; las vallas Markdown se cierran de forma balanceada. Las rutas de 17 skills son reales, pero sus archivos auxiliares **no son uniformes**.
- Se confirmaron conceptualmente en documentación oficial: `terraform_data` integrado, `terraform validate` después de `init`, `terraform test` con runs y mocks, backend S3 con `use_lockfile` y recomendación de versionado.

## 19.3. Qué **no** está probado

| Acción | Estado | Motivo |
|---|---|---|
| Compilar frontend Preact/Vite | `NOT_RUN` | No existe código fuente del nuevo producto |
| Ejecutar pruebas de accesibilidad/Playwright | `NOT_RUN` | No existe web nueva ni tests implementados |
| Ejecutar `terraform fmt -check -recursive` | `NOT_RUN` | CLI no instalada |
| Ejecutar `terraform init -backend=false` | `NOT_RUN` | CLI no instalada |
| Ejecutar `terraform validate` | `NOT_RUN` | CLI no instalada |
| Ejecutar `terraform test` | `NOT_RUN` | CLI no instalada |
| Probar CodeMirror HCL con Preact | `NOT_RUN` | Integración aún no implementada |
| Confirmar libre uso comercial del nombre de marca alternativa | `NOT_RUN` | Requiere comprobación de nombre/dominio/marca y, si aplica, asesoría legal |
| Validar CI, SHA pinning y reproducibilidad | `NOT_RUN` | Workflows aún no implementados |
| Probar laboratorio cloud y limpieza | `NOT_RUN` | No hay infraestructura ni sandbox autorizado |

**Regla de aceptación:** no transformar los `NOT_RUN` en `PASS` a partir de documentación, capturas o ejemplos; ejecutar los gates reales con versiones fijadas y conservar logs y códigos de salida.

## 19.4. Fuentes externas verificadas el 11 de noviembre de 2026

1. [HashiCorp Trademark Policy](https://www.hashicorp.com/en/trademark-policy) — uso nominativo limitado; restricciones para marcas en nombre propio del producto y logos.
2. [Terraform `terraform_data`](https://developer.hashicorp.com/terraform/language/resources/terraform-data) — recurso integrado, `input` y `output` computado.
3. [Terraform `validate`](https://developer.hashicorp.com/terraform/cli/commands/validate) — exige directorio inicializado; `init -backend=false` útil para validar sin backend.
4. [Terraform `test`](https://developer.hashicorp.com/terraform/cli/commands/test) — ejecuta plan/apply de los tests y puede crear infraestructura real.
5. [Terraform test mocking](https://developer.hashicorp.com/terraform/language/tests/mocking) — mocks desde 1.7.0; no equivalen a integración cloud.
6. [Backend S3](https://developer.hashicorp.com/terraform/language/backend/s3) — `use_lockfile = true`, permisos de `.tflock`, S3 Versioning recomendado.
7. [Terraform `plan`](https://developer.hashicorp.com/terraform/cli/commands/plan) — diferenciar plan especulativo, plan guardado y análisis previo a `apply`.

**Cierre de auditoría:** la idea y el enfoque de enseñanza son sólidos como **propuesta**, pero antes de lanzar el producto hay dos requisitos reales: **marca propia validada** y **código/laboratorios sometidos a pruebas ejecutadas**. Este `.md` es una especificación auditada, **no un sello de certificación de ejecución**.

