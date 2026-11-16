# Componentes terceros incluidos en el ZIP

## Preact — distribución ESM

- Origen de la distribución incluida: paquete open-source utilizado por PyTorch `torch/utils/model_dump/preact.mjs`.
- Cabecera del archivo original: `// Preact, MIT License`.
- Licencia: MIT. Proyecto: https://github.com/preactjs/preact
- Archivo incluido sin reescritura: `app/vendor/preact.mjs`.
- No se afirma una versión de Preact que no pueda rastrearse a este artefacto precompilado.

## CodeMirror 5.58.3

- Origen: paquete MIT CodeMirror incluido por el proyecto open-source nbclassic/Jupyter.
- Proyecto: https://github.com/codemirror/codemirror5
- Versión obtenida de `codemirror/package.json`: **5.58.3**.
- Archivos: `codemirror.js`, `codemirror.css`, `matchbrackets.js`, `closebrackets.js`.
- Licencia: MIT, Copyright (C) 2017 by Marijn Haverbeke and others.
- `mode-hcl.js` y estilos TerraPixel específicos son implementación original de esta academia.

Los avisos MIT se conservan. Los componentes son bibliotecas de interfaz, no un parser HCL ni Terraform CLI.

- **TypeScript Compiler 5.8.3 (MIT)**, maintained by Microsoft. Bundled in `tools/typescript/` solely for offline TypeScript builds. License: `tools/typescript/LICENSE.txt`. No executable binary from untrusted sources was downloaded.
