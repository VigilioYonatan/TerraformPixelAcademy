# Componentes terceros incluidos en el repositorio y distribución

## Preact — distribución ESM

- Origen de la distribución incluida: paquete open-source utilizado por PyTorch `torch/utils/model_dump/preact.mjs`.
- Cabecera del archivo original: `// Preact, MIT License`.
- Licencia: MIT. Proyecto: https://github.com/preactjs/preact
- Archivo incluido sin reescritura: `app/vendor/preact.mjs`.
- No se afirma una versión de Preact que no pueda rastrearse a este artefacto precompilado.

## CodeMirror 6 (Editor HCL activo)

- Proyecto: https://codemirror.net / https://github.com/codemirror
- Licencia: **MIT**, Copyright (C) 2018–2026 by Marijn Haverbeke and others.
- Paquetes exactos fijados en `package-lock.json` y empaquetados determinísticamente mediante `scripts/bundle-codemirror6.mjs` en `app/vendor/codemirror6.mjs` para ejecución offline sin red:
  - `@codemirror/state` **6.7.6** (MIT)
  - `@codemirror/view` **6.43.15** (MIT)
  - `@codemirror/commands` **6.11.1** (MIT)
  - `@codemirror/language` **6.13.1** (MIT)
  - `@codemirror/autocomplete` **6.20.4** (MIT)
  - `@lezer/highlight` **1.2.5** (MIT)
- El tokenizador HCL (`src/hclLanguage.ts`) y los temas accesibles claro/oscuro (`src/editor.ts`, `styles.css`) son implementación original de TerraPixel Academy. No constituyen el compilador oficial de HashiCorp HCL ni ejecutan Terraform CLI.

## Three.js 0.187.0 (Arena 3D de Minijuegos)

- Proyecto: https://threejs.org / https://github.com/mrdoob/three.js
- Licencia: **MIT**, Copyright © 2010–2026 three.js authors.
- Subconjunto *tree-shaken* fijado en `package-lock.json` (`three@0.187.0`) y empaquetado determinísticamente mediante `scripts/bundle-three.mjs` en `app/vendor/three.mjs` para ejecución WebGL 100 % offline en `#/juego/:id` (`src/gameScene3d.ts`).

## Silkscreen (Tipografía Pixel Auto-alojada)

- Proyecto: https://github.com/kottke/silkscreen
- Autor: Copyright (c) 1999–2022 Jason Kottke.
- Licencia: **SIL Open Font License 1.1 (OFL-1.1)**.
- Archivo auto-alojado localmente en `assets/fonts/silkscreen-latin.woff2` para ejecución 100 % offline bajo CSP estricta (`font-src 'self'`), sin carga desde CDNs externos.

## CodeMirror 5.58.3 (Preservado en baseline histórico)

- Origen: paquete MIT CodeMirror incluido por el proyecto open-source nbclassic/Jupyter.
- Proyecto: https://github.com/codemirror/codemirror5
- Versión obtenida de `codemirror/package.json`: **5.58.3**.
- Archivos conservados en `assets/vendor/codemirror5/` para integridad de rutas históricas (`BASELINE_V1_5_1_FILES.txt`): `codemirror.js`, `codemirror.css`, `matchbrackets.js`, `closebrackets.js`, `mode-hcl.js`.
- Licencia: MIT, Copyright (C) 2017 by Marijn Haverbeke and others.

## TypeScript Compiler 5.8.3

- **TypeScript Compiler 5.8.3 (MIT)**, maintained by Microsoft. Bundled in `tools/typescript/` solely for offline TypeScript builds (`npm run build` / `npm run typecheck`). License: `tools/typescript/LICENSE.txt`. No executable binary from untrusted sources was downloaded.
