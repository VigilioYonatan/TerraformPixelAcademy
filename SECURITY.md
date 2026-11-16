# Seguridad de TerraPixel Academy

- SPA educativa sin backend ni credenciales cloud. No permite ejecutar `terraform apply` remoto.
- No compartas `terraform.tfstate`, plan binario, `.tfvars`, tokens o ADR con datos personales.
- Todos los planes de pantalla, incidentes y costos son **fixtures** etiquetados.
- Los ejemplos de Terraform cloud de `solution-reference.tf.txt` son didácticos, **no** una invitación a aplicar sobre cuentas reales.
- Cualquier despliegue real requiere sandbox, cuota, identidad temporal, revisión de cambios, backups y política de cleanup.
- El progreso se almacena en `localStorage` y se puede borrar o exportar.
- El servidor local responde únicamente a rutas públicas (`index.html`, `styles.css`, `app/`, `assets/` y la especificación publicada), y acepta GET/HEAD; está limitado a `127.0.0.1` por defecto. Si necesitas abrirlo en otra interfaz, define `HOST` explícitamente y asume la responsabilidad de la exposición.
- Recomendación para un repositorio público: habilita Dependabot, control de licencias, acciones pinneadas por SHA, revisión de marcas y dependencias bloqueadas por lockfile.

No hay una función para reportes a un servicio central porque la aplicación no incluye backend.

## Privacidad del portafolio Senior (v1.3)

El portafolio y los archivos ADR descargados contienen las respuestas introducidas por el estudiante. La aplicación no los sube a un servidor; deben revisarse antes de compartirlos. No introduzcas credenciales, `terraform.tfstate` reales, secretos ni planes de producción en campos de práctica. La exportación no valida la veracidad de estados PASS/FAIL que el usuario declare.

## v1.6 — puerta de revisión local

El Release Gate solo procesa metadatos generados por `inspectTerraformPlan`, nunca valores de recursos, before/after o secretos. Los checkboxes son declaraciones del alumno; no confieren permisos de producción. Los archivos `.tfplan` binarios, state real y credenciales no se cargan ni se envían a servidores. No exportar informes con direcciones de recursos internas sin revisión. Recomendación: gestionar planes reales en CI autorizada con controles de identidad/artefacto y retención limitada.
