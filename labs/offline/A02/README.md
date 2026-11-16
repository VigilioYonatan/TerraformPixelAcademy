# A02 — Migración de backends

**Tema:** IaC · **Nivel:** Avanzado · **Modo:** CLI local sin cloud.

## Objetivo observable
Prepara backup, ventana de cambio y rollback.

## Qué se ejecuta
`main.tf` implementa el concepto específico de A02, no un arnés genérico intercambiable.
`practice.tftest.hcl` verifica la expresión `local.target_backend` contra el resultado esperado `"prod/app/terraform.tfstate"`.
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
Prepara backup, ventana de cambio y rollback.

> La web realiza validación educativa aproximada; solo la salida real de Terraform CLI es evidencia de ejecución.
