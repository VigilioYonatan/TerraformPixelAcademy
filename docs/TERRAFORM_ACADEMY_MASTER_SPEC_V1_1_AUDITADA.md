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
