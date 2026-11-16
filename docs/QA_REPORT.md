> Registro histórico de validaciones previas a v1.2. Consulte `SENIOR_MODE_AUDIT_V1_2.md` para las pruebas más recientes.

> **Informe vigente:** [AUDITORIA_TOTAL_ZERO_OMISSIONS.md](AUDITORIA_TOTAL_ZERO_OMISSIONS.md). La sección siguiente es histórica de v1.0.1; contiene cifras y observaciones anteriores a v1.1.

> **La auditoría total prevalece sobre la descripción de verificación original.** Ver `AUDITORIA_TOTAL_ZERO_OMISSIONS.md`. Estado global **NO APROBADO**. 19/19 tests Node PASS, pero no validación Terraform CLI, navegador o Vite.

# QA — TerraPixel Academy 1.0.1 (auditoría posterior)

**Fecha:** 11-11-2026. **Declaración de evidencia:** este reporte distingue pruebas efectivamente realizadas de las no ejecutadas.

## PASS — ejecutado en la sesión de generación

- `tsc -p tsconfig.json --pretty false`: compilación de TypeScript estricto sin errores.
- `npm test`: **18/18 pruebas PASS** en Node Test Runner, que comprueba la consistencia de lecciones, evaluador educativo, juegos, 18 casos, estado, sanitización y XP (ver salida reproducible al ejecutarlo).
- Generación de **36** carpetas `labs/offline/B,I,Axx`, cada una con `main.tf`, `.tftest.hcl`, plantilla, solución y README.
- Validación de integridad ZIP/CRC: **54/54 PASS**; rutas sin traversal.
- Generación de **18** carpetas `labs/senior/Sxx` con artefactos sintéticos, plantilla ADR y checklist.
- Smoke check HTTP del servidor: cabecera `200 OK` para `index.html` en `localhost:4173` desde `curl`.

## NOT_RUN — requieren entorno externo o permisos

- **Terraform CLI:** el ejecutable `terraform` no está instalado en el entorno. Por tanto `terraform fmt`, `terraform init`, `terraform validate` y `terraform test` de los 36 packs no se ejecutaron aquí.
- **Chromium E2E:** se intentó abrir la web en Chromium por Playwright; el navegador del entorno devolvió `net::ERR_BLOCKED_BY_ADMINISTRATOR` incluso para `localhost` y recursos locales. No se afirma un E2E PASS ni WCAG PASS.
- **npm / Vite build:** `npm view` falló con `EAI_AGAIN` por restricción DNS. TypeScript global sí compiló, pero no se pudo hacer `npm install` ni el bundle Vite real.
- **GitHub Actions:** workflows creados pero sin ejecución remota.
- **Despliegues cloud / costos reales:** no se probaron y no están incluidos en el navegador.
- **Revisión de marca/licencia por abogado:** pendiente.

## Manual QA sugerido antes de publicar

1. `npm start` y abrir `http://localhost:4173` en escritorio y móvil.
2. Abrir catálogo (36), completar B04 por evaluación + quiz y verificar XP persistido tras recarga.
3. Completar un juego y comprobar que no suma XP indefinidamente al repetir.
4. Abrir S11, tomar decisión correcta, marcar cuatro controles, escribir ADR, completar la autoevaluación. Repetir S18 con ocho hitos.
5. Evaluar simulador de CIDR S09 con redes superpuestas y sin superponer.
6. Evaluar S14 con 6 y 3 réplicas; confirmar etiqueta de estimación sintética.
7. Exportar/importar JSON, probar archivo malformado, limpiar estado y comprobar tema.
8. Descargar los 54 ZIP y comprobar su contenido.
9. Navegar sin ratón, probar contraste y foco visible, 390 px / 768 px / 1440 px.
10. Correr `terraform test` de cada pack en un runner sin credenciales cloud, guardar resultados con fecha y versión.

## No equivale a

- Autorización para utilizar «Terraform» como marca comercial del producto.
- Validación de HCL con CLI, pruebas de proveedores o un `apply` sobre cloud.
- Certificación o acreditación Senior.
