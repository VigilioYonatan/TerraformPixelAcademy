# TerraPixel Academy v1.5.1 — corrección documental y release gate

La versión v1.5.1 conserva los archivos de la v1.5 y de la v1.3. Se corrigió el README para evitar dos afirmaciones incompatibles sobre Preact y CodeMirror. Ya existe Preact real como montaje del shell y CodeMirror 5.58.3 real como editor offline; faltan componentes Preact declarativos integrales y CodeMirror 6, por lo que el release sigue **PARCIAL / NO APROBADO** frente a la especificación maestra.

**Aportes de v1.5 preservados:** DevSecOps local, workflow, Biome declarado, Dependabot, playbook Senior, mejora S18, verificación de preservación y 47 pruebas Node. Los scripts de Terraform trabajan sobre copias y no alteran los laboratorios originales.

**Evidencia observada:** `npm run qa`, build estático, `python3 scripts/release-audit.py`, `npm run verify:preservation`, 69 pruebas Chromium embebidas y control de SHA-256 desde ZIP extraído. Estas verificaciones no equivalen a ejecución Terraform CLI, CI GitHub Actions online, Biome CLI ni E2E por HTTP, que permanecen NO VERIFICADOS. El registro npm no estuvo disponible.

**Para uso:** descomprimir en carpeta nueva; con Node.js 20.19+ ejecutar `npm start`; abrir `http://localhost:4173`. Lee `docs/AUDITORIA_FINAL_V1_5.md` y `docs/DEVSECOPS.md` antes de una publicación comercial o despliegue.
