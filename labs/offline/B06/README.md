# B06 — Locals y outputs

**Tema:** IaC · **Nivel:** Básico · **Modo:** CLI local sin cloud.

## Objetivo observable
Reutiliza expresiones sin repetir valores y publica salidas seguras.

## Qué se ejecuta
`main.tf` implementa el concepto específico de B06, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `local.nombre` contra el resultado esperado `"academy-dev"`.
Las lecciones que enseñan backend, importación o providers de cloud mantienen ese ejemplo en `reference-cloud.tf.txt`, **no ejecutable por defecto**.

## Ejecución local
```sh
terraform fmt
terraform fmt -check
terraform init -backend=false
terraform validate
terraform test
```
Terraform CLI >= 1.10 para A03; >= 1.6 para los demás. Las pruebas usan `apply` únicamente sobre recursos incorporados `terraform_data`, variables y `locals`, sin dependencias cloud.

## Ejercicio
Reutiliza expresiones sin repetir valores y publica salidas seguras.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
