# TerraPixel Academy · DevSecOps y Release Gate v1.5

## Propósito y amenazas

SPA educativa offline-first sin backend. Las amenazas de mayor impacto son: XSS a través de datos importados o metadatos de un plan, persistencia indebida de progreso, publicación accidental de secretos/state, ZIP con contenido diferente del código, dependencias comprometidas y ejecución cloud accidental desde CI.

**Límite de seguridad:** los 36 labs usan `terraform_data` y un runner local sin credenciales cloud; S18 usa un capstone offline. Las 18 decisiones Senior y las evidencias del alumno son **autoevaluación educativa**, no acreditación profesional ni validación de infraestructura real.

## Controles integrados

1. **Origen y aislamiento:** servidor local limitado a `127.0.0.1` por defecto; lista positiva de paths públicos, `GET`/`HEAD`, CSP, `X-Frame-Options`, `nosniff`, política de referrer. La publicación en un hosting externo debe configurar headers equivalentes en ese hosting.
2. **Entrada:** JSON del progreso con saneamiento/validación de claves; límite de tamaño en importación; `plan.json` se analiza *localmente*, sin representar valores `before`/`after`, variables, outputs o state. El informe puede contener direcciones de recursos, potencialmente sensibles.
3. **Terraform:** no hay botón `apply` que ejecute Terraform; los tests del navegador son deterministas/simulados. Runner CLI real opcional ejecuta 37 pruebas en directorios temporales, publica logs y retorna error si falla. No solicita credenciales cloud.
4. **Datos:** progreso en `localStorage`; exportación y borrado manuales. Evitar datos reales en ejercicios, ADR, `plan.json` y exports.
5. **Integridad:** `scripts/release-audit.py` coteja ZIP internos con carpeta fuente; `scripts/devsecops-audit.mjs` detecta rutas/archivos críticos ausentes, rutas privadas, secretos de formato típico, assets y configuración CI. Ninguno sustituye un escáner externo.
6. **CI:** `quality.yml` prueba tipos, tests y build; `devsecops.yml` ejecuta Biome, auditoría local, dependencia `npm audit` y build; `terraform-labs.yml` usa CLI oficial; `deploy-pages.yml` es manual.
7. **Dependencias:** `@biomejs/biome` queda declarada en devDependencies. **Sin acceso al registro npm no se pudo ejecutar Biome ni generar `package-lock.json`**. El workflow usa temporalmente `npm install`, NO `npm ci`: se debe instalar online una vez, generar lockfile y pasar a `npm ci` antes de un release reproducible.
8. **Acciones GitHub:** permisos mínimos por workflow; hay dependencias de Actions por etiquetas `@v4` y no por commit SHA. Antes de desplegar públicamente, fijar por SHA revisado y añadir protección de rama.

## Gates locales (modo sin red)

```bash
npm run typecheck
npm test
npm run test:coverage
npm run security:local
python3 scripts/release-audit.py
npm run build
```

## Gates online adicionales (requieren npm / Terraform CLI / navegador real)

```bash
npm install
npm run lint:biome
npm audit --audit-level=high
npm run build:vite
bash scripts/verify-terraform-labs.sh
# Pruebas browser HTTP / responsive / persistencia: ejecutar contra http://localhost:4173
```

> No ejecutar `npm audit`, Biome, Vite ni tests Terraform con resultados falsos si las herramientas no están disponibles. `npm audit` exige lockfile; generar el lockfile verificado con `npm install` una vez conectados al registro. Mantener resultados en evidencia de CI.

## Política de publicación

**Bloquear release público** si existe P0/P1, la auditoría de datos falla, los tests locales fallan, el ZIP no extrae o no contiene assets. La conformidad total con la especificación requiere además CodeMirror 6, UI Preact declarativa, lockfile y gates externos en verde. La v1.5 es candidata de desarrollo, no certificada para producción.
