> Auditoría histórica de la versión anterior. Para v1.2, consulte `SENIOR_MODE_AUDIT_V1_2.md`. No se revocan los requisitos pendientes.

# AUDITORÍA TOTAL — TerraPixel Academy v1.1

**Decisión: ENTREGA PARCIAL / NO APROBADA contra la especificación V1.1.** Se han corregido defectos funcionales y de contenido; siguen pendientes requisitos obligatorios de stack y validaciones externas. Este documento no es un certificado de producción.

## Requisitos ↔ archivos ↔ verificación

| ID | Requisito | Archivos | Método | Estado |
|---|---|---|---|---|
| R01 | Diseño visual, hero, navegación | `src/main.ts`, `styles.css`, `assets/terra` | inspección de fuentes/assets | VERIFICADO estático |
| R02 | 12 sprites + atlas | `assets/terra` | Pillow/PNG | VERIFICADO |
| R03 | Referencia visual PNG | `assets/reference` | decodificación PNG | VERIFICADO |
| R04 | 36 lecciones | `src/curriculum.ts` | Node tests | VERIFICADO |
| R05 | 8 rutas | `src/curriculum.ts` | Node tests | VERIFICADO |
| R06 | Evaluación didáctica HCL | `src/engine.ts` | muestras, sintaxis y regresiones Node | VERIFICADO con límite didáctico |
| R07 | CodeMirror 6 real | `src/main.ts` | inspección de imports y DOM | **INCOMPLETO P1**: editor accesible es textarea |
| R08 | Preact + Vite obligatorios | `src/main.ts`, `package.json` | inspección + build | **INCOMPLETO P1**: runtime DOM; build alternativo TypeScript, no Preact |
| R09 | Cinco juegos, 21 preguntas | `src/games.ts` | Node tests | VERIFICADO de datos, UI NO VERIFICABLE |
| R10 | 18 casos Senior | `src/senior.ts` | Node tests | VERIFICADO estructural |
| R11 | Capstone de ocho hitos | `src/senior.ts`, `labs/senior/S18` | Node tests + inventario | VERIFICADO estructural |
| R12 | ADR evaluado semánticamente por IA | — | fuera de alcance, autoevaluación explícita | NO APLICA |
| R13 | Plan explorer fixtures | `src/fixtures.ts`, `src/main.ts` | inspección/test de fixtures | VERIFICADO estático |
| R14 | Grafo interactivo en navegador | `src/main.ts` | requiere E2E | NO VERIFICABLE |
| R15 | Simuladores Senior | `src/simulators.ts` | tests CIDR, estimación, digest | VERIFICADO de lógica |
| R16 | 36 laboratorios distintos | `labs/offline/*`, `assets/labs/*.zip` | revisión semántica mapeada + tests de unicidad | VERIFICADO de estructura, CLI NO VERIFICABLE |
| R17 | 36 Terraform test PASS | `labs/offline/*/*.tftest.hcl` | CLI `terraform` no instalada | NO VERIFICABLE |
| R18 | 18 packs Senior | `labs/senior`, `assets/senior` | integridad ZIP | VERIFICADO de empaquetado |
| R19 | Estado/versionado/XP | `src/engine.ts` | Node tests | VERIFICADO de lógica |
| R20 | Import, export, limpieza progreso | `src/main.ts` | inspección de callbacks, sin E2E | NO VERIFICABLE |
| R21 | Responsive, tema, teclado | `styles.css`, `src/main.ts` | inspección sin prueba Chromium válida | NO VERIFICABLE |
| R22 | Arranque HTTP sin instalar | `scripts/server.mjs`, `app/*` | curl HTTP/200 | VERIFICADO |
| R23 | Servidor no filtra código fuente | `scripts/server.mjs` | curl rutas prohibidas | VERIFICADO |
| R24 | Compilación TS estricto | `src/*`, `tsconfig.json` | `npm run build` | VERIFICADO |
| R25 | Build Vite y publicación real | `vite.config.js` | sin dependencia Vite instalada/registro npm | NO VERIFICABLE (build estático alternativo PASS) |
| R26 | npm lockfile e instalación reproducible | `package.json` | no hay lockfile; npm registry inaccesible | **INCOMPLETO P1** |
| R27 | E2E desktop y mobile | `src/main.ts`, CSS | Chromium bloqueado | NO VERIFICABLE |
| R28 | Pruebas Node | `tests/*.test.mjs` | `npm run qa` | VERIFICADO, 20/20 |
| R29 | ZIP exterior | ZIP release | testzip, extracción limpia | VERIFICADO |
| R30 | 54 ZIP internos | `assets/labs`, `assets/senior` | testzip y comparación de contenido | VERIFICADO |
| R31 | Referencias HTML/README | raíz y docs | inspección de rutas | VERIFICADO |
| R32 | Escaneo de secretos conocidos | árbol de entrega | patrones de alta confianza | VERIFICADO limitado |
| R33 | Trademark/licencias comerciales | `README.md`, assets | requiere revisión jurídica | NO VERIFICABLE |
| R34 | Aplicación cloud remota real | — | fuera del alcance seguro definido | NO APLICA |

**Clasificación: 22 verificados (en alcances específicos), 3 incompletos, 7 no verificables y 2 no aplicables = 34.** Ningún control está clasificado como producción verificada.

## Correcciones frente a v1.0.1

1. Los **36 `main.tf` son distintos**; prueban variables, outputs, referencias, conjuntos, ciclos de vida, convenciones de state, validaciones, redes, políticas, costos y otros conceptos de cada lección. Se incluyen verificaciones `.tftest.hcl` específicas y los ZIP se regeneraron. Las referencias a AWS, S3 remoto/import siguen en `.txt` no autoejecutables.
2. Build alternativo reproducible desde fuentes presentes: `npm run build` compila TS y copia `app/assets/docs` a `dist`, sin Vite. Vite se mantiene como opción `npm run build:vite`, **sin comprobación**.
3. Senior Mode exige un mínimo de **120 caracteres** y apartados de contexto, decisión, riesgos, evidencia y rollback. **Se trata de una comprobación estructural, no de calidad o veracidad del ADR.**
4. Tests de unicidad de HCL y contratos de aprendizaje añadidos; pasan 20/20.
5. Se preservan todos los recursos visuales, currículo, juegos, Senior, simuladores, archivos fuente y documentos de la versión anterior.

## Limitaciones / bloqueos

- No se puede certificar cumplimiento completo de la especificación: falta la migración real a **Preact** y la integración de **CodeMirror 6**. No se sustituirán por implementaciones que aparenten ser esos paquetes.
- No hay Terraform CLI; no se ejecutaron `terraform init/fmt/validate/test` ni pruebas cloud. La existencia de `.tftest.hcl` no prueba que los archivos funcionen con Terraform.
- Registro npm inaccesible (`EAI_AGAIN`, `ENOTCACHED`); no fue posible instalar dependencias, producir un lockfile válido o probar Vite.
- Chromium no permitió completar pruebas E2E navegando a localhost. La comprobación HTTP de curl no es validación de UI.
- La versión web no ejecuta Terraform real, evita credenciales cloud, y evalúa HCL mediante reglas didácticas.
- Revisión de marca y derechos antes de lanzamiento público/comercial pendiente.

## Reproducción local

```sh
npm start                    # HTTP, sin npm install; usa JS compilado empaquetado
npm run qa                   # requiere tsc: instalar deps o usar TypeScript global
npm run build                # requiere tsc, genera dist/; NO usa Vite
npm run build:vite           # SOLO después de npm install; NO VERIFICADO
```

Para validar los laboratorios con CLI y sin credenciales: `cd labs/offline/B04 && terraform fmt && terraform init -backend=false && terraform validate && terraform test`. Repetir los 36 y registrar Terraform version + logs. Un workflow manual `.github/workflows/terraform-labs.yml` documenta la rutina, **no se ha ejecutado en GitHub Actions**.

## Puertas de calidad

| Gate | Resultado |
|---|---|
| G1 cobertura obligatoria | FALLA: Preact, CodeMirror, lockfile |
| G2 integridad | PASS limitado a archivos/ZIP comprobados |
| G3 coherencia | PARCIAL: documentación corregida, stack aún difiere de la spec |
| G4 ejecución | PARCIAL: TS/Node/HTTP/build estático; CLI/Vite/UI faltan |
| G5 reparación | PARCIAL: correcciones disponibles aplicadas y probadas |
| G6 ZIP | PASS de integridad y extracción |
| G7 transparencia | PASS: pruebas pendientes declaradas |

**RELEASE GATE: NO APROBADO como especificación completa. ZIP apto para continuar trabajo y pruebas offline del frontend.**
